import { Link } from "react-router-dom";
import { installmentText, lastSize, type Product } from "../lib/catalog";
import { moneyPlain, money } from "../lib/store";
import { Photo } from "./Photo";

export const CARD_SIZES = "(min-width:1440px) 22vw, (min-width:1024px) 22vw, (min-width:768px) 30vw, 46vw";

export function ProductCard({ p, priority = false, sizes = CARD_SIZES, fill = false }: { p: Product; priority?: boolean; sizes?: string; fill?: boolean }) {
  const inst = installmentText(p, (v) => `R$ ${moneyPlain(v)}`);
  const soldOut = p.inStock === false;
  const last = soldOut ? null : lastSize(p);
  const promo = !!p.oldPrice && p.oldPrice > p.price;
  const off = promo ? Math.round((1 - p.price / p.oldPrice!) * 100) : 0;
  return (
    <Link to={`/produto/${p.slug}`} className={"card text-texto no-underline " + (fill ? "flex h-full flex-col" : "block")}>
      <div className={"frame " + (fill ? "min-h-64 flex-1" : "aspect-square")}>
        <Photo p={p} sizes={sizes} priority={priority} className={soldOut ? "opacity-60" : undefined} />
        {off > 0 && <span className="sticker label absolute left-2 top-2" style={{ ["--giro" as string]: "-4deg" }}>−{off}%</span>}
        {last && <span className="sticker label absolute right-2 top-2" style={{ ["--giro" as string]: "3deg" }}>Só resta o {last}</span>}
        {soldOut && <span className="label absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-tinta px-3 py-1.5 text-center text-giz">Esgotado</span>}
      </div>
      <div className="pt-3">
        {p.brand && <div className="label text-suave">{p.brand}</div>}
        <p className="m-0 mt-1 line-clamp-2 font-sans text-sm font-semibold leading-snug">{p.name}</p>
        <div className="display-m mt-2 text-lg">
          {promo && <s className="mr-2 text-sm text-suave">{money(p.oldPrice!)}</s>}
          {money(p.price)}
        </div>
        {inst && <div className="mt-1 text-xs text-suave">{inst}</div>}
      </div>
    </Link>
  );
}
