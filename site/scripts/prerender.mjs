// Pré-renderiza só a rota "/" dentro de dist/index.html; o shell vazio vai para dist/app.html.
import { readFileSync, writeFileSync, rmSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const indexPath = resolve(root, "dist/index.html");
// Fontes latin usadas acima da dobra: preload evita a troca tardia do título.
const fonts = readdirSync(resolve(root, "dist/assets")).filter((f) => /^(archivo|hanken-grotesk)-latin-w.*\.woff2$/.test(f));
const preload = fonts.map((f) => `<link rel="preload" as="font" type="font/woff2" href="/assets/${f}" crossorigin />`).join("\n    ");
const shell = readFileSync(indexPath, "utf8").replace("</head>", `  ${preload}\n  </head>`);
const marker = '<div id="root"></div>';
if (!shell.includes(marker)) throw new Error("prerender: #root não encontrado");
const { render } = await import(pathToFileURL(resolve(root, "dist-ssr/entry-server.js")).href);
// app.html (rotas que usam o catálogo): começa a baixar o catálogo antes do JS.
writeFileSync(
  resolve(root, "dist/app.html"),
  shell.replace("</head>", '<link rel="preload" as="fetch" href="/data/catalog.v1.json" crossorigin="anonymous" />\n  </head>'),
);
writeFileSync(indexPath, shell.replace(marker, `<div id="root">${render("/")}</div>`));
rmSync(resolve(root, "dist-ssr"), { recursive: true, force: true });
console.log("prerender: / ok, app.html criado");
