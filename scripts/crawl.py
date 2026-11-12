"""Coleta pública de jnoriginalsshop.com.br. Respeita robots.txt (Crawl-delay 10s), só GET, máx. 400 páginas HTML.
Uso: python3 -I scripts/crawl.py <outdir>"""
import re, json, sys, time, html, urllib.request, os
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
BASE = 'https://www.jnoriginalsshop.com.br'
UA = 'Mozilla/5.0 (compatible; JN-catalog-migration)'
DELAY = 10.5
# Teto de páginas desta execução (total do projeto: 400, ver DECISOES.md). Reexecutar continua de onde parou.
MAXPAGES = int(sys.argv[2]) if len(sys.argv) > 2 else 365
state = {'n': 0, 'last': 0.0}
log = open(os.path.join(OUT, 'crawl.log'), 'a')
def L(*a):
    print(*a, file=log, flush=True)
def get(url):
    if state['n'] >= MAXPAGES: raise RuntimeError('limite de páginas')
    wait = DELAY - (time.time() - state['last'])
    if wait > 0: time.sleep(wait)
    state['last'] = time.time(); state['n'] += 1
    for attempt in range(2):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=40) as r:
                return r.read().decode('utf-8', 'ignore')
        except Exception as e:
            L('ERRO', url, e)
            if attempt == 0: time.sleep(DELAY)
    return None
def txt(s): return html.unescape(re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', s))).strip()
def money(s): return float(s.replace('.', '').replace(',', '.')) if s else None

TOP = [('Acessórios', '/categoria/24317403.html'), ('Bermudas', '/categoria/24337257.html'), ('Calçados', '/categoria/calcados.html'),
       ('Calça e bermuda jeans', '/categoria/calca-e-bermuda-jeans.html'), ('Camiseta e polo', '/categoria/24337258.html'),
       ('Jersey basketball', '/jersey-basketball'), ('Perfumes', '/categoria/perfumes.html'), ('Tracksuit', '/categoria/tracksuit'),
       ('Vestuário', '/categoria/vestuario.html'), ('Vestuário feminino', '/categoria/vestuario-feminino.html'),
       ('Vestuário infantil', '/vestuario-infantil')]

def parse_listing(h):
    items = []
    for blk in re.split(r'<div class="listagem-item ', h)[1:]:
        blk = blk[:6000]
        m = re.search(r'class="nome-produto[^"]*">(.*?)</a>', blk, re.S)
        u = re.search(r'href="([^"]+)" class="nome-produto', blk)
        if not (m and u): continue
        sku = re.search(r'class="produto-sku hide">(.*?)</div>', blk, re.S)
        sell = re.search(r'data-sell-price="([\d.]+)"', blk)
        old = re.search(r'class="preco-venda[^"]*"[^>]*>\s*R\$\s*([\d.,]+)', blk)
        parc = re.search(r'preco-parcela[^>]*>.*?<strong[^>]*>(\d+)x</strong>.*?R\$\s*([\d.,]+)', blk, re.S)
        img = re.search(r'<img[^>]*?(?:data-src|src)="(https://cdn[^"]+)"', blk)
        out = 'indisponivel' in blk[:800] or 'bandeira-indisponivel' in blk
        items.append({'id': re.match(r'prod-id-(\d+)', blk).group(1) if re.match(r'prod-id-(\d+)', blk) else None,
            'name': txt(m.group(1)), 'url': u.group(1), 'code': txt(sku.group(1)) or None if sku else None,
            'price': float(sell.group(1)) if sell else None, 'oldPrice': money(old.group(1)) if old else None,
            'installmentCount': int(parc.group(1)) if parc else None, 'installment': money(parc.group(2)) if parc else None,
            'thumb': img.group(1) if img else None, 'listingOut': out})
    return items

prods = {}
pfile = os.path.join(OUT, 'listing.json')
if os.path.exists(pfile): prods = json.load(open(pfile))
else:
    for cat, path in TOP:
        page = 1
        while True:
            h = get(BASE + path + (f'?pagina={page}' if page > 1 else ''))
            if not h: break
            items = parse_listing(h)
            L('LIST', cat, page, len(items))
            new = 0
            for it in items:
                k = it['url']
                if k not in prods: prods[k] = dict(it, categories=[cat]); new += 1
                elif cat not in prods[k]['categories']: prods[k]['categories'].append(cat)
            if not items or f'pagina={page+1}' not in h: break
            page += 1
    json.dump(prods, open(pfile, 'w'), ensure_ascii=False)
L('LISTING TOTAL', len(prods), 'paginas usadas', state['n'])

def parse_product(h):
    d = {}
    m = re.search(r'<h1 class="nome-produto[^>]*>(.*?)</h1>', h, re.S); d['name'] = txt(m.group(1)) if m else None
    m = re.search(r'itemprop="sku">(.*?)</span>', h); d['code'] = txt(m.group(1)) if m else None
    imgs = []
    for u in re.findall(r'data-imagem-grande="([^"]+)"', h):
        if u not in imgs: imgs.append(u)
    if not imgs:
        og = re.search(r'property="og:image" content="([^"]+)"', h)
        if og: imgs = [og.group(1)]
    d['images'] = imgs
    sizes, grades = [], set()
    avail = {}
    for cls, vid in re.findall(r'class="acoes-produto hide (disponivel|indisponivel)[^"]*"[^>]*data-variacao-id="(\d+)"', h):
        avail[vid] = (cls == 'disponivel')
    seen = set()
    for g, vid, v in re.findall(r'data-grade-nome="([^"]*)" data-variacao-id="(\d+)" data-variacao-nome="([^"]*)"', h):
        if vid in seen: continue
        seen.add(vid); grades.add(g)
        sizes.append({'grade': html.unescape(g), 'label': html.unescape(v).strip(), 'available': avail.get(vid)})
    d['variants'] = sizes
    bc = re.search(r'class="breadcrumbs[^"]*"(.*?)</ul>', h, re.S)
    d['breadcrumb'] = [txt(x) for x in re.findall(r'<a [^>]*>(.*?)</a>', bc.group(1), re.S)] if bc else []
    m = re.search(r'itemprop="price" content="([\d.]+)"', h); d['price'] = float(m.group(1)) if m else None
    m = re.search(r'class="preco-venda[^"]*"[^>]*>\s*R\$\s*([\d.,]+)', h); d['oldPrice'] = money(m.group(1)) if m else None
    m = re.search(r'preco-parcela[^>]*>.*?<strong[^>]*>(\d+)x</strong>.*?R\$\s*([\d.,]+)', h, re.S)
    d['installmentCount'] = int(m.group(1)) if m else None; d['installment'] = money(m.group(2)) if m else None
    m = re.search(r'itemprop="description"[^>]*>(.*?)</div>', h, re.S); d['description'] = txt(m.group(1)) if m else None
    m = re.search(r'itemprop="availability" content="([^"]+)"', h); d['availability'] = m.group(1) if m else None
    return d

dfile = os.path.join(OUT, 'details.json')
details = json.load(open(dfile)) if os.path.exists(dfile) else {}
# Prioridade: categorias com tamanho primeiro, intercaladas, para cada categoria ter produtos completos.
PRIO = ['Calçados', 'Vestuário', 'Tracksuit', 'Camiseta e polo', 'Bermudas', 'Calça e bermuda jeans', 'Jersey basketball',
        'Vestuário feminino', 'Vestuário infantil', 'Acessórios', 'Perfumes']
# Esgotados (sem preço na listagem) não são vendáveis e não gastam o teto de páginas.
sellable = {u: p for u, p in prods.items() if not p['listingOut'] and p['price'] is not None}
queues = {c: [u for u, p in sellable.items() if p['categories'][0] == c] for c in PRIO}
order = []
while any(queues.values()):
    for c in PRIO:
        if queues[c]: order.append(queues[c].pop(0))
for url in order:
    if url in details: continue
    try: h = get(url)
    except RuntimeError: L('LIMITE ATINGIDO'); break
    if not h: details[url] = {'error': True}; continue
    details[url] = parse_product(h)
    if len(details) % 10 == 0: json.dump(details, open(dfile, 'w'), ensure_ascii=False); L('DETAIL', len(details), 'paginas', state['n'])
json.dump(details, open(dfile, 'w'), ensure_ascii=False)
L('FIM detalhes', len(details), 'paginas', state['n'])
