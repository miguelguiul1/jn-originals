import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { SITE_URL } from "../config";
import { imgUrl, installmentText, lastSize, useCatalog, type Product } from "../lib/catalog";
import { useCart } from "../lib/cart";
import { ADDRESS_LINE, MAPS_URL, STORE, money, moneyPlain, waUrl } from "../lib/store";
import { groupSlug } from "../lib/groups";
import { usePageTitle } from "../lib/meta";
import { Photo } from "../components/Photo";
import { ProductCard } from "../components/ProductCard";
import NotFound from "./NotFound";

function waMessage(p: Product, size: string) {
  if (p.inStock === false)
    return [
      "Olá! Vi que este produto está esgotado. Ele volta ao estoque?",
      p.rawName,
      p.code ? `Código: ${p.code}` : "",
      `${window.location.origin}/produto/${p.slug}`,
    ].filter(Boolean).join("\n");
  return [
    "Olá! Quero este produto:",
    p.rawName,
    p.code ? `Código: ${p.code}` : "",
    size ? `Tamanho: ${size}` : "Tamanho: quero confirmar os disponíveis",
    `${window.location.origin}/produto/${p.slug}`,
  ].filter(Boolean).join("\n");
}

function JsonLd({ p }: { p: Product }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: p.code,
    ...(p.brand ? { brand: { "@type": "Brand", name: p.brand } } : {}),
    category: p.category,
    ...(p.description ? { description: p.description } : {}),
    ...(p.imgs.length ? { image: p.imgs.map((i) => `${SITE_URL}${imgUrl(p.slug, i.n, i.widths[i.widths.length - 1])}`) } : {}),
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/produto/${p.slug}`,
      priceCurrency: "BRL",
      price: p.price.toFixed(2),
      ...(p.inStock === null ? {} : { availability: `https://schema.org/${p.inStock ? "InStock" : "OutOfStock"}` }),
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />;
}

function Gallery({ p }: { p: Product }) {
  const [i, setI] = useState(0);
  const n = p.imgs.length;
  useEffect(() => { setI(0); }, [p.slug]);
  const go = (d: number) => setI((x) => (x + d + n) % n);
  const key = (e: KeyboardEvent) => {
    if (n < 2) return;
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
  };
  return (
    <div className="flex flex-col-reverse gap-3 md:flex-row md:items-start" onKeyDown={key}>
      {n > 1 && (
        <ul className="m-0 flex list-none gap-2 overflow-x-auto p-0 md:flex-col md:overflow-visible" aria-label="Fotos">
          {p.imgs.map((im, k) => (
            <li key={im.n}>
              <button
                type="button"
                aria-label={`Foto ${k + 1} de ${n}`}
                aria-current={k === i}
                onClick={() => setI(k)}
                className={"frame block h-16 w-16 shrink-0 !rounded-xl border-[3px] " + (k === i ? "!border-texto" : "border-transparent")}
              >
                <Photo p={p} index={k} sizes="56px" className="!inset-[6%] !h-[88%] !w-[88%]" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="min-w-0 flex-1">
        <div className="frame" style={{ aspectRatio: p.imgs[0] ? `${p.imgs[0].w} / ${p.imgs[0].h}` : "3 / 4", maxHeight: "80vh", width: "100%" }}>
          <Photo p={p} index={i} priority sizes="(min-width:1024px) 52vw, 100vw" />
        </div>
        {n > 1 && (
          <div className="label mt-2 flex items-center justify-between">
            <button type="button" className="min-h-11 px-2 underline underline-offset-4" onClick={() => go(-1)}>Anterior</button>
            <span className="num text-suave" aria-live="polite">{i + 1} de {n}</span>
            <button type="button" className="min-h-11 px-2 underline underline-offset-4" onClick={() => go(1)}>Próxima</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductPage() {
  const { slug } = useParams();
  const { products, error } = useCatalog();
  const p = products?.find((x) => x.slug === slug) ?? null;
  usePageTitle(p?.name ?? null);
  const { add } = useCart();
  const [size, setSize] = useState("");
  const [warn, setWarn] = useState(false);
  useEffect(() => { setSize(""); setWarn(false); }, [slug]);

  const { related, relatedTitle } = useMemo(() => {
    if (!products || !p) return { related: [] as Product[], relatedTitle: "" };
    const others = products.filter((x) => x.slug !== p.slug);
    const brand = p.brand ? others.filter((x) => x.brand === p.brand) : [];
    if (brand.length >= 4) return { related: [...brand.filter((x) => x.group === p.group), ...brand.filter((x) => x.group !== p.group)].slice(0, 8), relatedTitle: "Mais da marca" };
    return { related: others.filter((x) => x.group === p.group).slice(0, 8), relatedTitle: `Mais em ${p.group}` };
  }, [products, p]);

  if (error) return <div className="wrap py-20" role="alert">Não foi possível carregar o produto. <Link className="link" to="/loja">Ir para a loja</Link></div>;
  if (!products) return (
    <div className="wrap grid gap-8 pt-8 lg:grid-cols-[1.3fr_1fr]">
      <div className="skeleton aspect-[3/4] max-h-[80vh]" />
      <div className="skeleton h-64" />
    </div>
  );
  if (!p) return <NotFound />;

  const inst = installmentText(p, (v) => `R$ ${moneyPlain(v)}`);
  const hasSizes = !!p.sizes;
  const soldOut = p.inStock === false;
  const last = soldOut ? null : lastSize(p);
  const promo = !!p.oldPrice && p.oldPrice > p.price;
  const wa = waUrl(waMessage(p, size));
  const addToCart = () => {
    if (hasSizes && !size) return setWarn(true);
    add(p, size);
  };

  return (
    <div className="wrap pt-6">
      <JsonLd p={p} />
      <nav aria-label="Trilha" className="label text-suave">
        <Link className="link" to="/loja">Loja</Link> / <Link className="link" to={`/loja?group=${groupSlug(p.group)}`}>{p.group}</Link>
      </nav>
      <div className="mt-4 grid items-start gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
        <Gallery p={p} />
        <div className="lg:sticky lg:top-32">
          {p.brand && <div className="label text-suave">{p.brand}</div>}
          <h1 className="display mt-2 text-[clamp(2.25rem,1.6rem+3vw,3.75rem)] [text-wrap:balance]">{p.name}</h1>
          <div className="mt-5 flex flex-wrap items-baseline gap-x-3">
            <span className="display-m num text-5xl">{money(p.price)}</span>{promo && <span className="sticker label self-center" style={{ ["--giro" as string]: "3deg" }}>Promoção</span>}
            {promo && <s className="num text-lg text-suave">{money(p.oldPrice!)}</s>}
          </div>
          {last && <p className="sticker label m-0 mt-3" style={{ ["--giro" as string]: "-2deg" }}>Só resta o {last}</p>}
          {inst && <div className="num mt-1 text-suave">{inst}</div>}
          {p.code && <div className="num mt-1 text-xs text-suave">Código {p.code}</div>}

          <div className="mt-6">
            {hasSizes ? (
              <fieldset className="m-0 border-0 p-0">
                <legend className="label mb-2">Tamanho</legend>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-describedby={warn ? "size-warn" : undefined}>
                  {p.sizes!.map((s) => {
                    const off = soldOut || p.unavailable.includes(s);
                    const on = size === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        aria-disabled={off}
                        aria-label={off ? `Tamanho ${s}, indisponível` : `Tamanho ${s}`}
                        disabled={soldOut}
                        onClick={() => { if (!off) { setSize(s); setWarn(false); } }}
                        className={"num min-h-12 min-w-12 rounded-2xl border-2 px-3 font-semibold " + (off ? "cursor-not-allowed border-linha text-suave line-through" : on ? "border-texto bg-texto text-fundo" : "border-campo hover:border-texto")}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
                {warn && <p id="size-warn" role="alert" className="sticker m-0 mt-3 text-sm font-semibold">Escolha um tamanho para continuar.</p>}
              </fieldset>
            ) : (
              <p className="m-0 text-sm"><b>Tamanhos:</b> confirme pelo WhatsApp</p>
            )}
          </div>

          {soldOut && <p className="mt-4 text-sm font-semibold">Indisponível no momento. Pergunte pelo WhatsApp se volta ao estoque.</p>}
          <div className="mt-6 grid gap-3">
            {!soldOut && <button type="button" className="btn btn-buy w-full" onClick={addToCart}>Adicionar à sacola</button>}
            <a
              className="btn btn-second"
              href={wa}
              rel="noopener noreferrer"
              target="_blank"
              onClick={(e) => { if (hasSizes && !size && !soldOut) { e.preventDefault(); setWarn(true); } }}
            >
              {soldOut ? "Perguntar sobre reposição" : "Pedir pelo WhatsApp"}
            </a>
          </div>
          <ul className="m-0 mt-4 list-none space-y-1 p-0 text-sm text-suave">
            <li>Pix{p.installmentCount ? ` · até ${p.installmentCount}x no cartão` : ""} · pedido pelo WhatsApp</li>
            <li>Motoboy em SP para pagamento via Pix · envio para todo o Brasil</li>
          </ul>
          {!hasSizes && !soldOut && <p className="mt-3 text-xs text-suave">A mensagem pede o tamanho. A equipe responde com o que há em estoque.</p>}

          <div className="superficie mt-8 rounded-3xl p-5">
            <h2 className="label text-suave">Retire na loja ou receba por motoboy ou Correios</h2>
            <p className="m-0 mt-2 text-sm">{ADDRESS_LINE}</p>
            <p className="m-0 text-sm text-suave">{STORE.hours.text}</p>
            <a className="link mt-1 inline-block py-1 text-sm" href={MAPS_URL} rel="noopener noreferrer" target="_blank">Como chegar</a>
          </div>
        </div>
      </div>

      <section className="mt-16" aria-labelledby="det">
        <h2 id="det" className="display text-4xl">Detalhes</h2>
        <dl className="m-0 mt-4 grid max-w-xl grid-cols-[8rem_1fr] gap-y-2 border-t border-linha pt-4 text-sm">
          {p.brand && <><dt className="text-suave">Marca</dt><dd className="m-0">{p.brand}</dd></>}
          <dt className="text-suave">Categoria</dt><dd className="m-0">{p.group}</dd>
          {p.code && <><dt className="text-suave">Código</dt><dd className="num m-0">{p.code}</dd></>}
        </dl>
        {p.description && <p className="mt-4 max-w-[60ch] whitespace-pre-line">{p.description}</p>}
      </section>

      {related.length > 0 && (
        <section className="mt-20" aria-labelledby="rel">
          <h2 id="rel" className="display t-section">{relatedTitle}</h2>
          <ul className="no-scrollbar -mx-4 m-0 mt-6 flex list-none snap-x gap-4 overflow-x-auto px-4 pb-2 lg:-mx-8 lg:px-8" style={{ scrollPaddingInline: "var(--gutter)" }}>
            {related.map((r) => (
              <li key={r.slug} className="w-[58vw] max-w-64 shrink-0 snap-start">
                <ProductCard p={r} sizes="(min-width:768px) 256px, 58vw" />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
