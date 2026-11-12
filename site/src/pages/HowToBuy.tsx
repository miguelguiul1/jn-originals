import { Link } from "react-router-dom";
import { usePageTitle } from "../lib/meta";
import { STORE, waUrl } from "../lib/store";

// Políticas: só aparecem se src/data/policies.json existir (gerado depois a partir de data/policies.md).
const found = import.meta.glob("../data/policies.json", { eager: true, import: "default" });
type Block = { title?: string; body: string };
function toBlocks(v: unknown): Block[] {
  if (!v) return [];
  if (typeof v === "string") return [{ body: v }];
  if (Array.isArray(v)) return v.flatMap((x) => (typeof x === "string" ? [{ body: x }] : x && typeof x === "object" ? [{ title: (x as Block).title, body: String((x as Block).body ?? "") }] : []));
  if (typeof v === "object") {
    const o = v as Record<string, unknown>;
    if (Array.isArray(o.sections)) return toBlocks(o.sections);
    return Object.entries(o).filter(([, b]) => typeof b === "string").map(([title, body]) => ({ title, body: body as string }));
  }
  return [];
}
const policies = toBlocks(Object.values(found)[0]).filter((b) => b.body.trim());

const steps = [
  ["Escolha o produto.", "Na página do produto, veja as fotos, o preço e o código. Se houver tamanhos listados, selecione um."],
  ["Adicione à sacola.", "Você pode juntar vários itens. A sacola fica salva neste aparelho."],
  ["Finalize e envie.", "Informe seu nome. O pedido vira uma mensagem pronta no WhatsApp, com itens e total."],
  ["Combine com a equipe.", "A loja confirma tamanhos e disponibilidade e combina pagamento e entrega pela conversa."],
];

export default function HowToBuy() {
  usePageTitle("Como comprar");
  return (
    <div className="wrap py-8">
      <h1 className="text-2xl">Como comprar</h1>
      <ol className="m-0 mt-8 max-w-[60ch] list-none space-y-8 p-0">
        {steps.map(([t, d], i) => (
          <li key={t} className="grid grid-cols-[2.5rem_1fr] gap-2">
            <span className="font-display text-xl text-muted" aria-hidden="true">{i + 1}</span>
            <div>
              <h2 className="text-lg">{t}</h2>
              <p className="m-0 mt-1">{d}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-8 max-w-[60ch]">
        Prefere falar antes? Chame no <a className="link" href={waUrl()}>WhatsApp {STORE.whatsapp.primaryLabel}</a> ou veja a <Link className="link" to="/loja">loja</Link>.
      </p>
      {policies.length > 0 && (
        <section className="mt-16 max-w-[60ch]" aria-labelledby="pol">
          <h2 id="pol" className="text-xl">Trocas e políticas</h2>
          {policies.map((b, i) => (
            <div key={i} className="mt-4">
              {b.title && <h3 className="text-lg">{b.title}</h3>}
              <p className="m-0 mt-1 whitespace-pre-line">{b.body}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
