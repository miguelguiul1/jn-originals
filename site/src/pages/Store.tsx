import { usePageTitle } from "../lib/meta";
import { ADDRESS_LINE, MAPS_URL, STORE, waUrl } from "../lib/store";
import { Pic, MOTOR } from "../components/Pic";

export default function Store() {
  usePageTitle("A loja");
  const A = STORE.address;
  const rows: [string, React.ReactNode][] = [
    ["Endereço", ADDRESS_LINE],
    ["Horário", STORE.hours.text],
    ["WhatsApp", <a key="w" className="link" href={waUrl()}>{STORE.whatsapp.primaryLabel}</a>],
    ["Instagram", <a key="i" className="link" href={STORE.social.instagram} rel="noopener noreferrer">{STORE.social.instagramHandle}</a>],
    ...(STORE.email ? ([["E-mail", <a key="e" className="link break-all" href={`mailto:${STORE.email}`}>{STORE.email}</a>]] as [string, React.ReactNode][]) : []),
    ["Razão social", STORE.legalName],
    ["CNPJ", STORE.cnpj],
  ];
  return (
    <>
      <div className="wrap pt-8 md:pt-12">
        <span className="marker text-texto">a loja</span>
        <h1 className="display t-hero">A loja</h1>
        <p className="display t-section m-0 mt-6 max-w-[16ch]">{A.street}</p>
        <p className="display t-section m-0 mt-3"><span className="sticker sticker-big" style={{ ["--giro" as string]: "-1.5deg" }}>{A.district} · {A.state}</span></p>
      </div>
      <div className="wrap mt-10">
        <div className="overflow-hidden rounded-3xl">
          <Pic wide={MOTOR.wide} tall={MOTOR.tall} alt="Dentro da loja: tênis e bonés Puma Motorsport sobre a bancada e clientes de moletom cinza." className="h-auto w-full" priority />
        </div>
      </div>
      <div className="wrap mt-12 grid gap-12 md:grid-cols-[3fr_2fr]">
        <div className="max-w-[60ch] space-y-4">
          <p className="m-0 text-lg">A JN Originals vende roupas, calçados e acessórios de marca, na loja física e pelo WhatsApp.</p>
          <p className="m-0 text-suave">O catálogo está aqui no site. Você escolhe, envia a mensagem e a equipe confirma tamanho, disponibilidade e entrega.</p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-2">
            <a className="btn btn-buy" href={waUrl()} rel="noopener noreferrer" target="_blank">Chamar no WhatsApp</a>
            <a className="link py-2" href={MAPS_URL} rel="noopener noreferrer" target="_blank" aria-label={`Como chegar: ${ADDRESS_LINE}`}>Como chegar</a>
          </div>
        </div>
        <dl className="muro m-0 grid grid-cols-[7rem_1fr] content-start gap-y-3 rounded-3xl p-5 text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="label text-suave">{k}</dt>
              <dd className="m-0">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}
