import { Link } from "react-router-dom";
import data from "../data/featured.json";
import { unpack, type Packed } from "../lib/catalog";
import { ProductCard } from "../components/ProductCard";
import { usePageTitle } from "../lib/meta";

const products = (data.products as unknown as Packed[]).map(unpack);
const cats = data.categories as { name: string; count: number }[];
const count = products.find((p) => p.installmentCount)?.installmentCount ?? null;

export default function Home() {
  usePageTitle(null);
  const [lead, ...rest] = products;
  const side = rest.slice(0, 4);
  const trail = rest.slice(4).filter((p) => p.category === "Calçados");
  return (
    <>
      <div className="border-b border-line bg-frame">
        <p className="wrap m-0 pb-1.5 text-sm text-muted">
          {count ? `${count}x no cartão · ` : ""}Pedido pelo WhatsApp
        </p>
      </div>

      {lead && (
        <section className="wrap pt-8" aria-labelledby="novidades">
          <h1 id="novidades" className="text-2xl">Novidades</h1>
          <div className="mt-6 grid gap-4 lg:grid-cols-[3fr_2fr] lg:gap-8">
            <ProductCard p={lead} priority sizes="(min-width:1024px) 54vw, 100vw" />
            <div className="grid grid-cols-2 content-start gap-x-4 gap-y-6">
              {side.map((p, i) => (
                <ProductCard key={p.slug} p={p} sizes="(min-width:1024px) 22vw, 46vw" />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="wrap pt-20" aria-labelledby="cats">
        <h2 id="cats" className="text-xl">Categorias</h2>
        <ul className="m-0 mt-4 grid list-none gap-x-8 p-0 md:grid-cols-2">
          {cats.map((c) => (
            <li key={c.name} className="border-t border-line">
              <Link to={`/loja?categoria=${encodeURIComponent(c.name)}`} className="flex min-h-14 items-baseline justify-between gap-4 py-3 text-ink no-underline hover:underline underline-offset-4">
                <span className="font-display text-xl">{c.name}</span>
                <span className="num text-sm text-muted">{c.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {trail.length > 0 && (
        <section className="pt-20" aria-labelledby="tenis">
          <div className="wrap flex items-baseline justify-between">
            <h2 id="tenis" className="text-xl">Tênis</h2>
            <Link to="/loja?categoria=Calçados" className="link text-sm">Ver todos os calçados</Link>
          </div>
          <ul className="wrap m-0 mt-4 flex list-none snap-x gap-4 overflow-x-auto py-0 pb-4" style={{ scrollPaddingInline: "var(--gutter)" }}>
            {trail.map((p) => (
              <li key={p.slug} className="w-44 shrink-0 snap-start sm:w-56">
                <ProductCard p={p} sizes="224px" />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
