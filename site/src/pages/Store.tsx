import { usePageTitle } from "../lib/meta";
import { STORE, waUrl } from "../lib/store";

export default function Store() {
  usePageTitle("A loja");
  const rows: [string, React.ReactNode][] = [
    ["Razão social", STORE.legalName],
    ["CNPJ", STORE.cnpj],
    ...(STORE.phone ? ([["Telefone", STORE.phone]] as [string, React.ReactNode][]) : []),
    ["WhatsApp", <a key="w" className="link" href={waUrl()}>{STORE.whatsapp.primaryLabel}</a>],
    ...(STORE.email ? ([["E-mail", <a key="e" className="link break-all" href={`mailto:${STORE.email}`}>{STORE.email}</a>]] as [string, React.ReactNode][]) : []),
    ["Instagram", <a key="i" className="link" href={STORE.social.instagram} rel="noopener noreferrer">@jnoriginals</a>],
    ...(STORE.address ? ([["Endereço", STORE.address]] as [string, React.ReactNode][]) : []),
    ...(STORE.hours ? ([["Horário", STORE.hours]] as [string, React.ReactNode][]) : []),
  ];
  return (
    <div className="wrap py-8">
      <h1 className="text-2xl">A loja</h1>
      <div className="mt-8 grid gap-12 md:grid-cols-[3fr_2fr]">
        <div className="max-w-[60ch] space-y-4">
          <p className="m-0 text-lg">A JN Originals vende roupas, calçados e acessórios de marca.</p>
          <p className="m-0">O catálogo está aqui no site. O atendimento e os pedidos acontecem pelo WhatsApp: você escolhe, envia a mensagem e a equipe confirma tamanho, disponibilidade e entrega.</p>
        </div>
        <dl className="m-0 grid grid-cols-[7rem_1fr] gap-y-3 border-t border-line pt-4 text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-muted">{k}</dt>
              <dd className="m-0">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
