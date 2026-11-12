// Baixa as fotos do catálogo (CDN da plataforma antiga) e gera WebP locais.
// Uso: node scripts/fetch-images.mjs [data/catalog.json] [--max-per-product=N]
// Saída: site/public/img/p/<slug>-<n>-<w>.webp e data/images.json {slug: [{n, w, h, sizes:[...]}]}
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const require = createRequire(path.join(ROOT, 'site', 'package.json'));
const sharp = require('sharp');
const args = process.argv.slice(2);
const catPath = args.find((a) => !a.startsWith('--')) || path.join(ROOT, 'data', 'catalog.json');
const maxPer = Number((args.find((a) => a.startsWith('--max-per-product=')) || '=4').split('=')[1]);
const WIDTHS = [480, 800];
const OUT = path.join(ROOT, 'site', 'public', 'img', 'p');
const MAN = path.join(ROOT, 'data', 'images.json');
fs.mkdirSync(OUT, { recursive: true });
const catalog = JSON.parse(fs.readFileSync(catPath, 'utf8'));
const manifest = fs.existsSync(MAN) ? JSON.parse(fs.readFileSync(MAN, 'utf8')) : {};
const failures = [];
const jobs = [];
for (const p of catalog) {
  (p.images || []).slice(0, maxPer).forEach((url, n) => jobs.push({ slug: p.slug, n, url }));
}
async function one({ slug, n, url }) {
  const have = manifest[slug]?.find((x) => x.n === n);
  if (have && WIDTHS.every((w) => fs.existsSync(path.join(OUT, `${slug}-${n}-${w}.webp`)))) return;
  let buf = null;
  for (let attempt = 0; attempt < 3 && !buf; attempt++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; JN-catalog-migration)' } });
      if (r.ok) buf = Buffer.from(await r.arrayBuffer());
      else if (r.status === 404) break;
    } catch { await new Promise((s) => setTimeout(s, 1500)); }
  }
  if (!buf) { failures.push(url); return; }
  try {
    const meta = await sharp(buf).metadata();
    const entry = { n, w: meta.width, h: meta.height, sizes: [] };
    for (const w of WIDTHS) {
      const target = Math.min(w, meta.width);
      const file = path.join(OUT, `${slug}-${n}-${w}.webp`);
      await sharp(buf).resize({ width: target, withoutEnlargement: true }).webp({ quality: w <= 480 ? 68 : 70 }).toFile(file);
      entry.sizes.push(w);
    }
    manifest[slug] = (manifest[slug] || []).filter((x) => x.n !== n).concat(entry).sort((a, b) => a.n - b.n);
  } catch (e) { failures.push(url + ' ' + e.message); }
}
let i = 0;
const CONC = 4;
await Promise.all(Array.from({ length: CONC }, async () => {
  while (i < jobs.length) {
    const j = jobs[i++];
    await one(j);
    if (i % 100 === 0) { fs.writeFileSync(MAN, JSON.stringify(manifest)); console.log('imagens', i, '/', jobs.length); }
  }
}));
fs.writeFileSync(MAN, JSON.stringify(manifest));
fs.writeFileSync(path.join(ROOT, 'data', 'images-failures.txt'), failures.join('\n'));
console.log('ok', jobs.length - failures.length, 'falhas', failures.length);
