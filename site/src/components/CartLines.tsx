import { Link } from "react-router-dom";
import { useCart } from "../lib/cart";
import { money } from "../lib/store";

export function CartLines({ compact = false }: { compact?: boolean }) {
  const { lines, setQty, remove, setOpen } = useCart();
  return (
    <ul className="m-0 list-none divide-y divide-linha p-0">
      {lines.map((l) => (
        <li key={l.slug + "|" + l.size} className="flex gap-3 py-4 first:pt-0">
          <div className="frame h-[72px] w-[72px] shrink-0">
            {l.img ? <img src={l.img} width={72} height={96} alt="" loading="lazy" /> : null}
          </div>
          <div className="min-w-0 flex-1">
            <Link to={`/produto/${l.slug}`} onClick={() => setOpen(false)} className="line-clamp-2 text-sm font-semibold text-texto no-underline hover:underline">
              {l.name}
            </Link>
            <div className="text-xs text-suave">{l.size ? `Tamanho ${l.size}` : "Tamanho: a confirmar pelo WhatsApp"}</div>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center border border-campo">
                <button type="button" aria-label={`Diminuir quantidade de ${l.name}`} className="h-11 w-11" onClick={() => setQty(l.slug, l.size, l.qty - 1)}>-</button>
                <span className="num min-w-6 text-center text-sm" aria-live="polite">{l.qty}</span>
                <button type="button" aria-label={`Aumentar quantidade de ${l.name}`} className="h-11 w-11 disabled:opacity-40" disabled={l.qty >= 10} onClick={() => setQty(l.slug, l.size, l.qty + 1)}>+</button>
              </div>
              <button type="button" className="min-h-11 text-xs underline underline-offset-4" onClick={() => remove(l.slug, l.size)}>Remover</button>
              <span className={"display-m num ml-auto " + (compact ? "text-lg" : "text-2xl")}>{money(l.price * l.qty)}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
