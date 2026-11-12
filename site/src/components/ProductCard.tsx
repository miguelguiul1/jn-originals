import { Link } from "react-router-dom";
import { installmentText, type Product } from "../lib/catalog";
import { moneyPlain, money } from "../lib/store";
import { Photo } from "./Photo";

export const CARD_SIZES = "(min-width:1440px) 15vw, (min-width:1100px) 20vw, (min-width:768px) 28vw, 46vw";

export function ProductCard({ p, priority = false, sizes = CARD_SIZES }: { p: Product; priority?: boolean; sizes?: string }) {
  const inst = installmentText(p, (v) => `R$ ${moneyPlain(v)}`);
  const soldOut = p.inStock === false;
  const off = p.oldPrice && p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  return (
    <Link to={`/produto/${p.slug}`} className="card block no-underline">
      <div className="frame aspect-square">
        <Photo p={p} sizes={sizes} priority={priority} className={soldOut ? "opacity-60" : undefined} />
        {off > 0 && (
          <span className="absolute left-2 top-2 rounded-s bg-signal px-2 py-0.5 text-xs font-semibold text-paper">-{off}%</span>
        )}
      </div>
      <div className="pt-2">
        {p.brand && <div className="text-xs text-muted">{p.brand}</div>}
        <p className="m-0 line-clamp-2 font-sans text-sm font-semibold leading-snug">{p.name}</p>
        <div className="mt-1 text-base">
          {p.oldPrice && p.oldPrice > p.price && <s className="mr-2 text-sm text-muted">{money(p.oldPrice)}</s>}
          {money(p.price)}
        </div>
        {inst && <div className="text-xs text-muted">{inst}</div>}
        {soldOut && <div className="text-xs font-semibold text-muted">Esgotado</div>}
      </div>
    </Link>
  );
}
