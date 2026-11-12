import { Link } from "react-router-dom";
import { installmentText, type Product } from "../lib/catalog";
import { moneyPlain, money } from "../lib/store";
import { Photo } from "./Photo";

export const CARD_SIZES = "(min-width:1440px) 22vw, (min-width:1024px) 22vw, (min-width:768px) 30vw, 46vw";

export function ProductCard({ p, priority = false, sizes = CARD_SIZES, fill = false }: { p: Product; priority?: boolean; sizes?: string; fill?: boolean }) {
  const inst = installmentText(p, (v) => `R$ ${moneyPlain(v)}`);
  const soldOut = p.inStock === false;
  const promo = !!p.oldPrice && p.oldPrice > p.price;
  const off = promo ? Math.round((1 - p.price / p.oldPrice!) * 100) : 0;
  return (
    <Link to={`/produto/${p.slug}`} className={"card text-giz no-underline " + (fill ? "flex h-full flex-col" : "block")}>
      <div className={"frame " + (fill ? "min-h-64 flex-1" : "aspect-square")}>
        <Photo p={p} sizes={sizes} priority={priority} className={soldOut ? "opacity-60" : undefined} />
        {off > 0 && <span className="label absolute left-0 top-0 bg-amarelo px-2 py-1 text-asfalto">−{off}%</span>}
        {soldOut && <span className="label absolute inset-x-0 bottom-0 bg-asfalto py-1.5 text-center text-giz">Esgotado</span>}
      </div>
      <div className="pt-3">
        {p.brand && <div className="label text-cinza">{p.brand}</div>}
        <p className="m-0 mt-1 line-clamp-2 font-sans text-sm font-semibold leading-snug">{p.name}</p>
        <div className={"display-m mt-2 text-lg " + (promo ? "text-amarelo" : "")}>
          {promo && <s className="mr-2 text-sm text-cinza">{money(p.oldPrice!)}</s>}
          {money(p.price)}
        </div>
        {inst && <div className="mt-1 text-xs text-cinza">{inst}</div>}
      </div>
    </Link>
  );
}
