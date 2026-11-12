import { Link } from "react-router-dom";
import data from "../data/featured.json";
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

function Marquee() {
  const items = BAND.map((t) => <li key={t} className="display">{t}</li>);
  return (
    <div className="marquee" role="region" aria-label="Avisos da loja">
      <div className="marquee-track">
        <ul className="marquee-group">{items}</ul>
        <ul className="marquee-group" aria-hidden="true">{BAND.map((t) => <li key={t} className="display">{t}</li>)}</ul>
      </div>
    </div>
  );
}

export default function Home() {
  usePageTitle(null);
  const [lead, ...rest] = products;
  return (
    <>
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden md:min-h-[88vh]" aria-label="Abertura">
        <Pic wide={HERO.wide} tall={HERO.tall} priority alt="Três rapazes na rua, de boné e óculos escuros, vestindo Nike e Lacoste." className="absolute inset-0 -z-10 h-full w-full object-cover object-[50%_0%] md:object-[50%_20%]" />
        <div className="hero-shade absolute inset-0 -z-10" aria-hidden="true" />
        <div className="wrap pb-8 pt-[60svh] md:flex md:items-end md:gap-10 md:pb-12 md:pt-40">
          <h1 className="shrink-0">
            <Logo className="w-[40%] max-w-40 text-giz md:w-[clamp(7rem,11vw,10rem)] md:max-w-none" />
          </h1>
          <div className="mt-3 md:mt-0">
            <p className="display m-0 text-[clamp(2.75rem,1.2rem+8vw,4.5rem)] text-giz md:max-w-[16ch]">Apenas produtos originais.</p>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link to="/loja" className="btn btn-buy">Ver a loja</Link>
              <p className="m-0 max-w-[34ch] text-sm text-giz">Loja física em {A.district} · {STORE.hours.text}</p>
            </div>
          </div>
        </div>
      </section>

      <Marquee />

      {lead && (
        <section className="pt-16 md:pt-24" aria-labelledby="novidades">
          <div className="wrap flex items-end justify-between gap-4">
            <h2 id="novidades" className="display t-section">Chegou agora</h2>
            <Link to="/loja" className="link pb-1 text-sm">Ver tudo</Link>
          </div>
          <ul className="no-scrollbar m-0 mt-8 flex lg:items-stretch list-none snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-2 lg:mx-auto lg:grid lg:max-w-[var(--container-page)] lg:snap-none lg:grid-cols-4 lg:overflow-visible lg:pb-0" style={{ scrollPaddingInline: "var(--gutter)" }}>
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

      <section className="wrap pt-20 md:pt-28" aria-labelledby="cats">
        <h2 id="cats" className="display t-section">Por categoria</h2>
        <ul className="m-0 mt-8 grid list-none grid-cols-2 gap-3 p-0 md:grid-cols-12 md:gap-4">
          {mosaic.map((m, i) => (
            <li key={m.slug} className={i === 0 || i === 5 ? "md:col-span-6" : "md:col-span-3"}>
              <Link to={`/loja?group=${m.slug}`} className={"tile group block text-giz no-underline " + (i < 3 ? "h-64 md:h-[28rem]" : "h-64 md:h-[22rem]")}>
                <div className="frame frame-bar h-full">
                  {m.product && <Photo p={m.product} sizes="(min-width:768px) 30vw, 46vw" />}
                  <div className="absolute inset-x-0 bottom-0 flex h-[4.5rem] flex-col justify-center bg-asfalto px-3">
                    <span className="display text-giz text-[clamp(1.5rem,1.1rem+1.6vw,2.25rem)]">{m.label}</span>
                    <span className="num label text-cinza">{m.count} itens</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="relative mt-20 md:mt-28" aria-labelledby="motor">
        <Pic wide={MOTOR.wide} tall={MOTOR.tall} alt="Dentro da loja: tênis e bonés Puma Motorsport sobre a bancada e clientes de moletom cinza." className="h-auto w-full" />
        <div className="hero-shade absolute inset-0" aria-hidden="true" />
        <div className="wrap absolute inset-x-0 bottom-0 pb-6 md:pb-12">
          <h2 id="motor" className="display t-section max-w-[10ch] text-giz">Linha Puma Motorsport</h2>
          <Link to="/loja?q=puma" className="btn btn-buy mt-4">Ver a linha</Link>
        </div>
      </section>

      <section className="relative mt-20 overflow-hidden border-y border-linha md:mt-28" aria-labelledby="loja-fisica">
        <Logo variant="mark" label={false} className="pointer-events-none absolute -right-[8%] top-1/2 hidden w-[min(46vw,34rem)] -translate-y-1/2 text-linha md:block" />
        <div className="wrap relative py-16 md:py-24">
          <h2 id="loja-fisica" className="label text-cinza">A loja</h2>
          <p className="display t-section m-0 mt-4 max-w-[14ch] text-giz">{A.street}</p>
          <p className="display t-section m-0 mt-2 text-giz">{A.district} · {A.state}</p>
          <p className="m-0 mt-6 text-lg">{STORE.hours.text}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a className="btn btn-buy" href={waUrl()} rel="noopener noreferrer" target="_blank">Chamar no WhatsApp</a>
            <a className="link py-2" href={MAPS_URL} rel="noopener noreferrer" target="_blank" aria-label={`Como chegar: ${ADDRESS_LINE}`}>Como chegar</a>
          </div>
        </div>
      </section>
    </>
  );
}
