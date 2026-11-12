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
  ["Escolha o produto.", "Na loja, filtre por categoria, marca ou tamanho. Abra o produto para ver fotos, preço e código."],
  ["Escolha o tamanho.", "Quando o produto tem tamanhos listados, o tamanho é obrigatório. Sem lista, a equipe confirma pelo WhatsApp."],
  ["Monte a sacola.", "Junte vários itens. A sacola fica salva neste aparelho."],
  ["Envie pelo WhatsApp.", "Informe seu nome. O pedido vira uma mensagem pronta, com itens e total. A equipe confirma estoque, pagamento e entrega."],
];

export default function HowToBuy() {
  usePageTitle("Como comprar");
  return (
    <div className="wrap pt-8 md:pt-12">
      <div className="flex flex-wrap items-end gap-x-5"><h1 className="display t-hero">Como comprar</h1><span className="marker pb-3 text-texto">é rápido</span></div>
      <ol className="m-0 mt-10 grid list-none gap-x-12 gap-y-10 p-0 md:grid-cols-2">
        {steps.map(([t, d], i) => (
          <li key={t} className="superficie grid grid-cols-[auto_1fr] items-start gap-x-5 rounded-3xl p-5">
            <span className="sticker sticker-big display grid size-[clamp(5rem,3rem+8vw,8rem)] place-items-center !rounded-[1.4rem] text-[clamp(3.5rem,2rem+6vw,6rem)]" style={{ ["--giro" as string]: i % 2 ? "3deg" : "-3deg" }} aria-hidden="true">{i + 1}</span>
            <div className="pt-2">
              <h2 className="display text-3xl">{t}</h2>
              <p className="m-0 mt-2 text-suave">{d}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-10 max-w-[60ch]">
        Prefere falar antes? Chame no <a className="link" href={waUrl()}>WhatsApp {STORE.whatsapp.primaryLabel}</a> ou veja a <Link className="link" to="/loja">loja</Link>.
      </p>
      {policies.length > 0 && (
        <section className="mt-20 max-w-[70ch]" aria-labelledby="pol">
          <h2 id="pol" className="display t-section">Trocas e políticas</h2>
          {policies.map((b, i) => (
            <div key={i} className="mt-8">
              {b.title && <h3 className="display text-3xl">{b.title}</h3>}
              <p className="m-0 mt-2 whitespace-pre-line">{b.body}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
