// Lê data/{catalog,images,store}.json e gera os arquivos usados pelo site.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const data = resolve(root, "../data");
const read = (f) => JSON.parse(readFileSync(resolve(data, f), "utf8"));
const out = (p, s) => {
  const f = resolve(root, p);
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, s);
};

const SITE = "https://www.jnoriginalsshop.com.br";
const catalog = read("catalog.json");
const images = read("images.json");
const store = read("store.json");
const imgDir = resolve(root, "public/img/p");

// Formato compacto: só o que o site usa. Imagens: manifesto + arquivos que existem de fato.
function pack(p) {
  const m = (images[p.slug] || [])
    .map((i) => {
      const ws = (i.sizes || []).filter((w) => existsSync(resolve(imgDir, `${p.slug}-${i.n}-${w}.webp`))).sort((a, b) => a - b);
      return ws.length ? [i.n, i.w, i.h, ws] : null;
    })
    .filter(Boolean);
  const x = p.sizeStock ? Object.keys(p.sizeStock).filter((k) => p.sizeStock[k] === false) : [];
  const o = { s: p.slug, n: p.name, b: p.brand || "", c: p.category || "Outros", k: p.code || "", p: p.price, m };
  if (p.subcategory) o.sc = p.subcategory;
  if (p.oldPrice) o.o = p.oldPrice;
  if (p.installment) {
    o.i = p.installment;
    o.ic = p.installmentCount;
  }
  if (p.sizes && p.sizes.length) o.z = p.sizes;
  if (x.length) o.x = x;
  if (p.inStock === true || p.inStock === false) o.st = p.inStock ? 1 : 0;
  if (p.description) o.d = p.description;
  if (p.sourceUrl && p.sourceUrl !== `${SITE}/${p.slug}`) o.u = p.sourceUrl;
  return o;
}

const packed = catalog.map(pack);
const hasImg = new Set(packed.filter((x) => x.m.length).map((x) => x.s));
out("public/data/catalog.v1.json", JSON.stringify(packed));

// Destaques: com imagem, prefere detalhe e estoque, depois maior id.
const pool0 = catalog.filter((p) => hasImg.has(p.slug));
const rank = (a, b) =>
    Number(b.detailFetched) - Number(a.detailFetched) ||
    Number(b.inStock === true) - Number(a.inStock === true) ||
    Number(b.id) - Number(a.id) ||
    a.slug.localeCompare(b.slug);
const sorted = [...pool0].sort(rank);
const vitrine = sorted.slice(0, 5);
const trilha = sorted.filter((p) => p.category === "Calçados" && !vitrine.includes(p)).slice(0, 7);
const ranked = [...vitrine, ...trilha];
const counts = new Map();
for (const p of catalog) for (const c of p.categories?.length ? p.categories : [p.category]) counts.set(c, (counts.get(c) || 0) + 1);
const categories = [...counts].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
out("src/data/featured.json", JSON.stringify({ total: catalog.length, products: ranked.slice(0, 12).map(pack), categories }));
out("src/data/store.json", JSON.stringify(store, null, 2));

const routes = ["/", "/loja", "/como-comprar", "/a-loja"];
const urls = [...routes.map((r) => SITE + r), ...catalog.map((p) => `${SITE}/produto/${p.slug}`)];
out(
  "public/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `<url><loc>${u}</loc></url>`).join("\n")}\n</urlset>\n`,
);
// Políticas: opcional, vem de data/policies.json se existir.
if (existsSync(resolve(data, "policies.json"))) out("src/data/policies.json", readFileSync(resolve(data, "policies.json")));
console.log(`build-data: ${packed.length} produtos, ${categories.length} categorias`);
