"""data/raw/{listing,details}.json -> data/catalog.json. Não inventa: ausente = None."""
import json, re, sys, os, unicodedata
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
raw = os.path.join(ROOT, 'data', 'raw')
listing = json.load(open(os.path.join(raw, 'listing.json')))
details = json.load(open(os.path.join(raw, 'details.json'))) if os.path.exists(os.path.join(raw, 'details.json')) else {}
BRANDS = ['Nike', 'Jordan', 'Adidas', 'Puma', 'Tommy Hilfiger', 'Lacoste', 'Calvin Klein', 'Ralph Lauren', 'Polo Ralph Lauren', 'New Balance',
          'Asics', 'Mizuno', 'Vans', 'Converse', 'Oakley', 'Hugo Boss', 'Boss', 'Armani', 'Emporio Armani', 'Diesel', 'Levi\'s', 'Levis', 'Reserva',
          'Fila', 'Reebok', 'Under Armour', 'Champion', 'Kappa', 'Umbro', 'Olympikus', 'Crocs', 'Havaianas', 'Rider', 'Kenner', 'Mormaii',
          'Quiksilver', 'Billabong', 'Hurley', 'Element', 'DC Shoes', 'Lacoste', 'Aramis', 'Osklen', 'Hang Loose', 'Ellus', 'Guess', 'Gucci',
          'Louis Vuitton', 'Prada', 'Balenciaga', 'Dior', 'Versace', 'Moncler', 'Stone Island', 'The North Face', 'Columbia', 'Carhartt',
          'Stussy', 'Supreme', 'Off-White', 'Bape', 'Kith', 'Fear of God', 'Essentials', 'Hollister', 'Abercrombie', 'Gap', 'Mitchell & Ness',
          'Mitchell Ness', 'New Era', 'Salomon', 'On Running', 'Hoka', 'Yeezy', 'Lacoste', 'Tommy Jeans', 'Calvin Klein Jeans', 'Ferrari', 'BMW',
          'Mercedes', 'Red Bull', 'Paco Rabanne', 'Carolina Herrera', 'Jean Paul Gaultier', 'Azzaro', 'Dolce & Gabbana', 'Givenchy', 'Valentino',
          'Montblanc', 'Lattafa', 'Aeropostale', 'Zara', 'Hansez', 'Tommy', 'Ferragamo', 'Hugo', 'Kenzo', 'Burberry', 'Fendi', 'Nautica', 'Timberland', 'Dc']
# Marcas que aparecem como licenças (ex.: "PUMA BMW") não substituem a fabricante: a primeira marca do nome vence.
def norm(s): return unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower()
BR = sorted({b: None for b in BRANDS}, key=len, reverse=True)
CANON = {'levis': "Levi's", 'polo ralph lauren': 'Ralph Lauren', 'mitchell ness': 'Mitchell & Ness', 'dc': 'DC Shoes', 'boss': 'Hugo Boss', 'tommy jeans': 'Tommy Hilfiger', 'calvin klein jeans': 'Calvin Klein', 'nke': 'Nike', 'tommy': 'Tommy Hilfiger'}
def brand_of(name):
    n = ' ' + re.sub(r'[^a-z0-9&\' ]', ' ', norm(name)) + ' '
    best = None
    for b in BR + ['nke']:
        nb = norm(b)
        m = re.search(r'(?<![a-z0-9])' + re.escape(nb) + r'(?![a-z0-9])', n)
        if m and (best is None or m.start() < best[0]): best = (m.start(), b)
    if not best: return None
    b = best[1]
    return CANON.get(norm(b), b)
def slugify(s):
    s = norm(s); s = re.sub(r'[^a-z0-9]+', '-', s).strip('-'); return s[:80]
GRADE_SIZE = re.compile(r'tamanho|numera|size', re.I)
out, slugs = [], set()
for url, it in listing.items():
    if it.get('listingOut') or it.get('price') is None: continue  # esgotado na origem (sem preço): fora da loja nova
    d = details.get(url) or {}
    if d.get('error'): d = {}
    name = d.get('name') or it['name']
    slug = url.rstrip('/').split('/')[-1].replace('.html', '')
    slug = slugify(slug)
    base, k = slug, 2
    while slug in slugs: slug = f'{base}-{k}'; k += 1
    slugs.add(slug)
    variants = d.get('variants') if d else None
    sizes = colors = None
    if variants is not None:
        sizes = [v['label'] for v in variants if GRADE_SIZE.search(v['grade'] or '')] or ([] if variants == [] else None)
        cl = [v['label'] for v in variants if re.search(r'cor', v['grade'] or '', re.I)]
        colors = cl or None
        if sizes is None and variants: sizes = [v['label'] for v in variants]
    sizeStock = {v['label']: v['available'] for v in variants} if variants else None
    bc = (d.get('breadcrumb') or [])[1:] if d else []
    in_stock = None
    if d.get('availability'): in_stock = 'InStock' in d['availability']
    elif sizeStock: in_stock = any(sizeStock.values())
    elif it.get('listingOut') is not None: in_stock = not it['listingOut']
    out.append({
        'slug': slug, 'id': it.get('id'), 'name': name, 'brand': brand_of(name),
        'category': it['categories'][0] if it.get('categories') else None,
        'categories': it.get('categories') or [], 'subcategory': bc[-1].title() if len(bc) > 1 else None,
        'code': d.get('code') or it.get('code'),
        'price': d.get('price') if d.get('price') is not None else it.get('price'),
        'oldPrice': d.get('oldPrice') if d else it.get('oldPrice'),
        'installment': d.get('installment') if d.get('installment') is not None else it.get('installment'),
        'installmentCount': d.get('installmentCount') if d.get('installmentCount') is not None else it.get('installmentCount'),
        'sizes': sizes, 'sizeStock': sizeStock, 'colors': colors, 'description': d.get('description'),
        'images': d.get('images') or ([it['thumb'].replace('/300x300/', '/2500x2500/')] if it.get('thumb') else []),
        'sourceUrl': url, 'inStock': in_stock, 'detailFetched': bool(d),
    })
json.dump(out, open(os.path.join(ROOT, 'data', 'catalog.json'), 'w'), ensure_ascii=False, indent=1)
print(len(out), 'produtos;', sum(o['detailFetched'] for o in out), 'com detalhe;', sum(1 for o in out if o['brand']), 'com marca')
