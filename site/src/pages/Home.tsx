import { Link } from "react-router-dom";
import data from "../data/featured.json";
import brandsAll from "../data/brands.json";
import { Drip } from "../components/Drip";
import { unpack, type Packed } from "../lib/catalog";
import { ADDRESS_LINE, MAPS_URL, STORE, waUrl } from "../lib/store";
import { ProductCard } from "../components/ProductCard";
import { Photo } from "../components/Photo";
import { Logo } from "../components/Logo";
import { Pic, HERO, MOTOR } from "../components/Pic";
import { usePageTitle } from "../lib/meta";

const products = (data.products as unknown as Packed[]).map(unpack);
const mosaic = (data.mosaic as unknown as { slug: string; label: string; count: number; product: Packed | null }[]).map((m) => ({
  ...m,
  product: m.product ? unpack(m.product) : null,
}));
const A = STORE.address;
const installments = products.find((p) => p.installmentCount)?.installmentCount ?? null;

// Faixa: só o que a loja afirma na origem e na direção.
const BAND = [
  "Apenas produtos originais",
  `Loja física em ${A.district}`,
  ...(installments ? [`Até ${installments}x no cartão`] : []),
  "Motoboy em SP",
  "Envio para todo o Brasil",
  "Pedido pelo WhatsApp",
];

// Marcas: contagem real do catálogo, as 8 maiores. Rotação alterna para não virar fileira.
const OWN = brandsAll.find((b) => b.name === "JN Originals");
const BRANDS = brandsAll.filter((b) => b.name !== "JN Originals").slice(0, 8);
const TILT = ["-2deg", "1.5deg", "-1deg", "2.5deg"];

function Marquee() {
  const items = BAND.map((t) => <li key={t} className="display">{t}</li>);
  return (
    <div className="relative z-10">
      <div className="marquee" role="region" aria-label="Avisos da loja">
        <div className="marquee-track">
          <ul className="marquee-group">{items}</ul>
          <ul className="marquee-group" aria-hidden="true">{BAND.map((t) => <li key={t} className="display">{t}</li>)}</ul>
        </div>
      </div>
      <Drip className="absolute inset-x-0 top-[calc(100%-1px)] text-amarelo" />
    </div>
  );
}

export default function Home() {
  usePageTitle(null);
  const [lead, ...rest] = products;
  return (
    <>
      <section className="wrap pt-4 md:pt-6" aria-label="Abertura">
        <div className="relative">
          <div className="relative">
          <div className="overflow-hidden rounded-[var(--r-hero)]">
            <Pic wide={HERO.wide} tall={HERO.tall} priority alt="Três rapazes na rua, de boné e óculos escuros, vestindo Nike e Lacoste." className="h-auto w-full" />
          </div>
          <h1 className="sticker absolute -bottom-7 left-3 z-10 !rounded-2xl !p-3 md:left-8 md:!p-4" style={{ ["--giro" as string]: "-4deg" }}>
            <Logo className="w-[6.5rem] md:w-44" />
          </h1>
          </div>
          <div className="superficie relative mt-12 rounded-3xl p-5 lg:absolute lg:bottom-6 lg:right-6 lg:mt-0 lg:w-[min(27rem,38%)] lg:rotate-1">
            <p className="display m-0 text-[clamp(2.5rem,1.4rem+4vw,3.75rem)] text-texto">Apenas produtos originais.</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link to="/loja" className="btn btn-buy">Ver a loja</Link>
              <p className="m-0 max-w-[22ch] text-sm text-suave">Loja física em {A.district} · {STORE.hours.text}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-10 md:mt-14">
        <Marquee />
      </div>

      {lead && (
        <section className="pt-24 md:pt-32" aria-labelledby="novidades">
          <div className="wrap flex items-end justify-between gap-4">
            <div>
              <span className="marker text-texto">olha só</span>
              <h2 id="novidades" className="display t-section">Chegou agora</h2>
            </div>
            <Link to="/loja" className="link pb-1 text-sm">Ver tudo</Link>
          </div>
          <ul className="no-scrollbar fade-x m-0 mt-8 flex lg:items-stretch list-none snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-2 lg:mx-auto lg:grid lg:max-w-[var(--container-page)] lg:snap-none lg:grid-cols-4 lg:overflow-visible lg:pb-0" style={{ scrollPaddingInline: "var(--gutter)" }}>
            <li className="w-[72vw] max-w-80 shrink-0 snap-start lg:col-span-2 lg:row-span-2 lg:w-auto lg:max-w-none">
              <ProductCard p={lead} fill sizes="(min-width:1024px) 46vw, 72vw" />
            </li>
            {rest.map((p) => (
              <li key={p.slug} className="w-[72vw] max-w-80 shrink-0 snap-start lg:w-auto lg:max-w-none">
                <ProductCard p={p} sizes="(min-width:1024px) 22vw, 72vw" />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="pt-24 md:pt-32" aria-labelledby="marcas">
        <div className="wrap">
          <span className="marker text-texto">só original</span>
          <h2 id="marcas" className="display t-section">As marcas</h2>
        </div>
        <ul className="no-scrollbar fade-x m-0 mt-8 flex list-none snap-x gap-3 overflow-x-auto px-[var(--gutter)] py-3 lg:mx-auto lg:max-w-[var(--container-page)] lg:flex-wrap lg:overflow-visible" style={{ scrollPaddingInline: "var(--gutter)" }}>
          {OWN && (
            <li className="shrink-0 snap-start pt-5">
              <Link to={`/loja?marca=${encodeURIComponent(OWN.name)}`} className="relative flex items-center gap-3 rounded-full border-2 border-texto bg-texto py-2 pl-6 pr-3 text-fundo no-underline transition-opacity hover:opacity-90" style={{ transform: "rotate(-1.5deg)" }}>
                <span className="marker absolute -top-6 left-6 text-texto" aria-hidden="true">linha própria</span>
                <span className="display text-[clamp(2rem,1.2rem+3vw,3.25rem)]">{OWN.name}</span>
                <span className="num grid min-w-10 place-items-center rounded-full bg-amarelo px-2 py-1 text-sm font-semibold text-tinta">{OWN.count}<span className="sr-only"> produtos, linha própria</span></span>
              </Link>
            </li>
          )}
          {BRANDS.map((b, i) => (
            <li key={b.name} className="shrink-0 snap-start pt-5">
              <Link
                to={`/loja?marca=${encodeURIComponent(b.name)}`}
                className={"group flex items-center gap-3 rounded-full border-2 border-texto py-2 pl-6 pr-3 no-underline transition-colors duration-[140ms] hover:bg-texto hover:text-fundo " + (i % 4 === 1 ? "bg-amarelo text-tinta hover:!bg-texto hover:!text-fundo" : "bg-superficie text-texto")}
                style={{ transform: `rotate(${TILT[i % 4]})` }}
              >
                <span className="display text-[clamp(2rem,1.2rem+3vw,3.25rem)]">{b.name}</span>
                <span className="num grid min-w-10 place-items-center rounded-full bg-tinta px-2 py-1 text-sm font-semibold text-giz">{b.count}<span className="sr-only"> produtos</span></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="wrap pt-24 md:pt-32" aria-labelledby="cats">
        <span className="marker text-texto">escolhe a sua</span>
        <h2 id="cats" className="display t-section">Por categoria</h2>
        <ul className="m-0 mt-8 grid list-none grid-cols-2 gap-3 p-0 md:grid-cols-12 md:gap-4">
          {mosaic.map((m, i) => (
            <li key={m.slug} className={i === 0 || i === 5 ? "md:col-span-6" : "md:col-span-3"}>
              <Link to={`/loja?group=${m.slug}`} className={"tile group block text-texto no-underline " + (i < 3 ? "h-64 md:h-[28rem]" : "h-64 md:h-[22rem]")}>
                <div className="frame frame-bar h-full">
                  {m.product && <Photo p={m.product} sizes="(min-width:768px) 30vw, 46vw" />}
                  <div className="absolute inset-x-2 bottom-2 flex h-16 items-center justify-between gap-2 rounded-xl bg-fundo px-4 text-texto">
                    <span className="display text-[clamp(1.25rem,0.9rem+1.4vw,2rem)] leading-[0.95]">{m.label}</span>
                    <span className="num sticker label shrink-0" style={{ ["--giro" as string]: i % 2 ? "3deg" : "-3deg" }}>{m.count}</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
          <li className="col-span-2 md:col-span-12">
            <Link to="/loja?q=puma" className="group relative block overflow-hidden rounded-[var(--r-hero)] text-giz no-underline">
              <Pic wide={MOTOR.wide} tall={MOTOR.tall} alt="Dentro da loja: tênis e bonés Puma Motorsport sobre a bancada e clientes de moletom cinza." className="h-auto w-full" />
              <span className="sticker display absolute bottom-3 left-3 text-[clamp(1.5rem,1rem+2.4vw,3rem)] md:bottom-6 md:left-6" style={{ ["--giro" as string]: "-2deg" }}>Linha Puma Motorsport</span>
            </Link>
          </li>
        </ul>
      </section>

      <section className="muro muro-forte mt-24 overflow-hidden md:mt-32" aria-labelledby="loja-fisica">
        <div className="wrap relative grid items-center gap-10 py-14 md:grid-cols-[1.25fr_1fr] md:gap-12 md:py-16">
          <div>
            <span className="marker text-texto">a loja</span>
            <h2 id="loja-fisica" className="sr-only">A loja</h2>
            <p className="display t-section m-0 mt-2 max-w-[14ch]">{A.street}</p>
            <p className="display t-section m-0 mt-3"><span className="sticker sticker-big" style={{ ["--giro" as string]: "-1.5deg" }}>{A.district} · {A.state}</span></p>
            <p className="m-0 mt-6 text-lg">{STORE.hours.text}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a className="btn btn-buy" href={waUrl()} rel="noopener noreferrer" target="_blank">Chamar no WhatsApp</a>
              <a className="link py-2" href={MAPS_URL} rel="noopener noreferrer" target="_blank" aria-label={`Como chegar: ${ADDRESS_LINE}`}>Como chegar</a>
            </div>
          </div>
          <div className="mx-auto w-full max-w-md rotate-2 md:mr-3 overflow-hidden rounded-3xl border-4 border-moldura md:max-w-none">
            <img
              src="/img/brand/loja-dentro-720.webp"
              srcSet="/img/brand/loja-dentro-480.webp 480w, /img/brand/loja-dentro-720.webp 720w"
              sizes="(min-width:768px) 40vw, 90vw"
              width={720}
              height={977}
              loading="lazy"
              decoding="async"
              alt="Dentro da loja física: araras de roupa e clientes de moletom cinza sentados no banco."
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>
    </>
  );
}
