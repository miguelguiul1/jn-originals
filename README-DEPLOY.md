# Deploy na Vercel

1. Suba este repositório inteiro no GitHub. O build lê `data/` na raiz, então não suba só a pasta `site/`.
2. Painel da Vercel: Add New → Project → importe o repositório. Root Directory: `site`. Framework: Vite. Build: `npm run build`. Output: `dist`. Não há variáveis de ambiente.
3. Deixe ligada a opção "Include files outside the Root Directory" (vem ligada por padrão).
4. Pela CLI, dentro de `site/`: `npx vercel` (gera prévia) e `npx vercel --prod` (produção).
5. Depois da aprovação, para tirar o modo protótipo:
   - `site/src/config.ts`: troque para `PROTOTYPE = false` (remove a faixa).
   - `site/index.html`: apague `<meta name="robots" content="noindex, nofollow">`.
   - `site/vercel.json`: apague o header `X-Robots-Tag`.
   - `site/public/robots.txt`: troque por `Allow: /` e `Sitemap: https://www.jnoriginalsshop.com.br/sitemap.xml`.
6. Domínio: Project → Settings → Domains → adicione `www.jnoriginalsshop.com.br` e `jnoriginalsshop.com.br`. No registro do domínio (Registro.br), crie os registros DNS que a Vercel mostrar: CNAME do `www` para `cname.vercel-dns.com` e A da raiz para `76.76.21.21`. Faça isso só quando for desligar a Loja Integrada.
7. Para atualizar o catálogo: `python3 scripts/crawl.py data/raw 400` (retoma de onde parou), depois `python3 scripts/build-catalog.py` e `node scripts/fetch-images.mjs`.
