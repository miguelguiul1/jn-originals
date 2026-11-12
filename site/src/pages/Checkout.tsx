import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../lib/cart";
import { money, waUrl } from "../lib/store";
import { usePageTitle } from "../lib/meta";

export default function Checkout() {
  usePageTitle("Finalizar pedido");
  const { lines, subtotal } = useCart();
  const [nome, setNome] = useState("");
  const [local, setLocal] = useState("");
  const [obs, setObs] = useState("");
  const [tried, setTried] = useState(false);

  if (!lines.length)
    return (
      <div className="wrap max-w-[560px] py-12 md:py-16">
        <h1 className="display t-section">Finalizar pedido</h1>
        <p className="mt-4">Sua sacola está vazia. <Link className="link" to="/loja">Ver a loja</Link></p>
      </div>
    );

  const msg = [
    `Olá! Sou ${nome.trim() || "(nome)"} e quero fazer este pedido:`,
    ...lines.map((l) => `- ${l.qty}x ${l.rawName ?? l.name} (código ${l.code}, ${l.size ? "tamanho " + l.size : "tamanho a confirmar"}): ${money(l.price * l.qty)}`),
    `Total: ${money(subtotal)}`,
    local.trim() ? `Entrega em: ${local.trim()}` : "",
    obs.trim() ? `Observações: ${obs.trim()}` : "",
  ].filter(Boolean).join("\n");

  const send = () => {
    if (!nome.trim()) return setTried(true);
    window.open(waUrl(msg), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="wrap max-w-[560px] py-8 md:py-12">
      <h1 className="display t-section">Finalizar pedido</h1>
      <p className="sticker mt-4 !rounded-2xl p-3 text-sm" style={{ ["--giro" as string]: "-1deg" }}>Demonstração: nenhum pagamento é feito aqui. O pedido vira uma mensagem no WhatsApp da loja.</p>
      <form className="mt-6 space-y-5" onSubmit={(e) => { e.preventDefault(); send(); }} noValidate>
        <div>
          <label htmlFor="nome" className="label mb-1 block">Seu nome</label>
          <input id="nome" className="field" autoComplete="name" value={nome} onChange={(e) => setNome(e.target.value)} aria-invalid={tried && !nome.trim()} aria-describedby={tried && !nome.trim() ? "nome-erro" : undefined} required />
          {tried && !nome.trim() && <p id="nome-erro" role="alert" className="sticker m-0 mt-2 text-sm font-semibold">Informe seu nome.</p>}
        </div>
        <div>
          <label htmlFor="local" className="label mb-1 block">Cidade e bairro para entrega (opcional)</label>
          <input id="local" className="field" autoComplete="address-level2" value={local} onChange={(e) => setLocal(e.target.value)} />
        </div>
        <div>
          <label htmlFor="obs" className="label mb-1 block">Observações (opcional)</label>
          <input id="obs" className="field" value={obs} onChange={(e) => setObs(e.target.value)} />
        </div>

        <section aria-labelledby="res">
          <h2 id="res" className="label">Resumo</h2>
          <ul className="m-0 mt-2 list-none divide-y divide-linha border-y border-linha p-0 text-sm">
            {lines.map((l) => (
              <li key={l.slug + l.size} className="flex justify-between gap-4 py-2">
                <span>{l.qty}x {l.name}<span className="block text-xs text-suave">{l.size ? `Tamanho ${l.size}` : "Tamanho a confirmar"}</span></span>
                <span className="num">{money(l.price * l.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-baseline justify-between"><span className="label">Total</span><b className="display-m num text-4xl">{money(subtotal)}</b></div>
        </section>

        <button type="submit" className="btn btn-buy w-full">Enviar pedido no WhatsApp</button>
        <p className="m-0 text-center text-sm"><Link className="link" to="/sacola">Voltar para a sacola</Link></p>
      </form>
    </div>
  );
}
