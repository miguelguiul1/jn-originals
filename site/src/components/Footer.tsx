import { Link } from "react-router-dom";
import { STORE, waUrl } from "../lib/store";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="wrap grid gap-8 py-8 text-sm md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <div className="font-display text-lg italic" style={{ fontWeight: 700 }}>JN Originals</div>
          <p className="m-0 mt-2 text-muted">{STORE.legalName}</p>
          <p className="m-0 text-muted">CNPJ {STORE.cnpj}</p>
          {STORE.address && <p className="m-0 text-muted">{STORE.address}</p>}
          {STORE.hours && <p className="m-0 text-muted">{STORE.hours}</p>}
        </div>
        <div>
          <h2 className="font-sans text-sm font-semibold">Contato</h2>
          <ul className="m-0 mt-2 list-none space-y-1 p-0">
            <li><a className="link inline-block py-1" href={waUrl()}>WhatsApp {STORE.whatsapp.primaryLabel}</a></li>
            {STORE.email && <li><a className="link inline-block py-1" href={`mailto:${STORE.email}`}>{STORE.email}</a></li>}
            <li><a className="link inline-block py-1" href={STORE.social.instagram} rel="noopener noreferrer">Instagram</a></li>
          </ul>
        </div>
        <div>
          <h2 className="font-sans text-sm font-semibold">Ajuda</h2>
          <ul className="m-0 mt-2 list-none space-y-1 p-0">
            <li><Link className="link inline-block py-1" to="/loja">Loja</Link></li>
            <li><Link className="link inline-block py-1" to="/como-comprar">Como comprar</Link></li>
            <li><Link className="link inline-block py-1" to="/a-loja">A loja</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
