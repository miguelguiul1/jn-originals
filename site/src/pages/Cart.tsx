import { Link } from "react-router-dom";
import { useCart } from "../lib/cart";
import { money } from "../lib/store";
import { usePageTitle } from "../lib/meta";
import { CartLines } from "../components/CartLines";

export default function Cart() {
  usePageTitle("Sacola");
  const { lines, subtotal, count } = useCart();
  return (
    <div className="wrap pt-8 md:pt-12">
      <div className="flex flex-wrap items-end gap-x-5"><h1 className="display t-hero">Sacola</h1><span className="marker pb-2 text-texto">quase lá</span></div>
      {lines.length === 0 ? (
        <div className="py-12">
          <p className="display m-0 text-4xl">Sua sacola está vazia.</p>
          <p className="mt-2 text-suave">Escolha um produto na loja e ele aparece aqui.</p>
          <Link to="/loja" className="btn btn-buy mt-6">Ver a loja</Link>
        </div>
      ) : (
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_340px]">
          <CartLines />
          <aside aria-label="Resumo" className="superficie rounded-3xl p-5 lg:sticky lg:top-32">
            <div className="flex justify-between text-sm"><span>{count} {count === 1 ? "item" : "itens"}</span><span className="num">{money(subtotal)}</span></div>
            <div className="mt-3 flex items-baseline justify-between"><span className="label">Total</span><b className="display-m num text-5xl">{money(subtotal)}</b></div>
            <p className="mt-2 text-xs text-suave">Entrega e forma de pagamento: combinadas no WhatsApp.</p>
            <Link to="/finalizar" className="btn btn-buy mt-5 w-full">Finalizar pedido</Link>
          </aside>
        </div>
      )}
    </div>
  );
}
