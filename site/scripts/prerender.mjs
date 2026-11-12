// Pré-renderiza só a rota "/" dentro de dist/index.html; o shell vazio vai para dist/app.html.
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const indexPath = resolve(root, "dist/index.html");
const shell = readFileSync(indexPath, "utf8");
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
