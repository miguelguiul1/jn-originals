// Pré-renderiza só a rota "/" dentro de dist/index.html; o shell vazio vai para dist/app.html.
import { readFileSync, writeFileSync, rmSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createHash } from "node:crypto";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const indexPath = resolve(root, "dist/index.html");
// Fontes latin usadas acima da dobra: preload evita a troca tardia do título.
const fonts = readdirSync(resolve(root, "dist/assets")).filter((f) => /^(archivo|hanken-grotesk)-latin-w.*\.woff2$/.test(f));
const preload = fonts.map((f) => `<link rel="preload" as="font" type="font/woff2" href="/assets/${f}" crossorigin />`).join("\n    ");
const shell = readFileSync(indexPath, "utf8").replace("</head>", `  ${preload}\n  </head>`);
// CSP: o script de tema (inline, sem src) entra no script-src por hash sha256; vercel.json é atualizado aqui.
const inline = /<script>([\s\S]*?)<\/script>/.exec(shell);
if (!inline) throw new Error("prerender: script de tema não encontrado");
// app.html: na /loja sem filtro, pré-carrega as 4 primeiras fotos sem esperar o catálogo (script inline, também por hash no CSP).
const CARD_SIZES = "(min-width:1440px) 22vw, (min-width:1024px) 22vw, (min-width:768px) 30vw, 46vw";
const first = JSON.parse(readFileSync(resolve(root, "public/data/catalog.v1.json"), "utf8"))
  .filter((p) => p.m.length)
  .slice(0, 4)
  .map((p) => p.m[0][3].map((w) => `/img/p/${p.s}-${p.m[0][0]}-${w}.webp ${w}w`).join(", "));
const preloadJs = `if(location.pathname==="/loja"&&!location.search)${JSON.stringify(first)}.forEach(function(s,i){var l=document.createElement("link");l.rel="preload";l.as="image";l.setAttribute("imagesrcset",s);l.setAttribute("imagesizes",${JSON.stringify(CARD_SIZES)});l.setAttribute("fetchpriority",i<2?"high":"low");document.head.appendChild(l)})`;
const hashes = [inline[1], preloadJs].map((t) => `'sha256-${createHash("sha256").update(t).digest("base64")}'`);
const vj = resolve(root, "vercel.json");
const cfg = readFileSync(vj, "utf8");
const next = cfg.replace(/script-src 'self'(?: 'sha256-[^']+')*;/, `script-src 'self' ${hashes.join(" ")};`);
if (next === cfg && !cfg.includes(hashes[0])) throw new Error("prerender: script-src não encontrado em vercel.json");
if (next !== cfg) writeFileSync(vj, next);
const marker = '<div id="root"></div>';
if (!shell.includes(marker)) throw new Error("prerender: #root não encontrado");
const { render } = await import(pathToFileURL(resolve(root, "dist-ssr/entry-server.js")).href);
// app.html (rotas que usam o catálogo): começa a baixar o catálogo antes do JS.
writeFileSync(
  resolve(root, "dist/app.html"),
  shell.replace("</head>", `<link rel="preload" as="fetch" href="/data/catalog.v1.json" crossorigin="anonymous" />\n  <script>${preloadJs}</script>\n  </head>`),
);
writeFileSync(indexPath, shell.replace(marker, `<div id="root">${render("/")}</div>`));
rmSync(resolve(root, "dist-ssr"), { recursive: true, force: true });
console.log("prerender: / ok, app.html criado");
