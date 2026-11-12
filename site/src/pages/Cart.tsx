import { Link } from "react-router-dom";
import { useCart } from "../lib/cart";
import { money } from "../lib/store";
import { usePageTitle } from "../lib/meta";
import { CartLines } from "../components/CartLines";

export default function Cart() {
  usePageTitle("Sacola");
  const { lines, subtotal, count } = useCart();
  return (
    <div className="wrap pt-8">
      <h1 className="text-2xl">Sacola</h1>
      {lines.length === 0 ? (
        <div className="py-12">
          <p className="m-0 text-lg">Sua sacola está vazia.</p>
          <p className="mt-2 text-muted">Escolha um produto na loja e ele aparece aqui.</p>
          <Link to="/loja" className="btn btn-primary mt-4">Ver a loja</Link>
        </div>
      ) : (
        <div className="mt-6 grid items-start gap-8 lg:grid-cols-[1fr_340px]">
          <CartLines />
          <aside aria-label="Resumo" className="rounded-s bg-frame p-4 lg:sticky lg:top-6">
            <div className="flex justify-between text-sm"><span>{count} {count === 1 ? "item" : "itens"}</span><span className="num">{money(subtotal)}</span></div>
            <div className="mt-2 flex justify-between text-lg"><span>Total</span><b className="num">{money(subtotal)}</b></div>
            <p className="mt-2 text-xs text-muted">Entrega e forma de pagamento: combinadas no WhatsApp.</p>
            <Link to="/finalizar" className="btn btn-buy mt-4 w-full">Finalizar pedido</Link>
          </aside>
        </div>
      )}
    </div>
  );
}
