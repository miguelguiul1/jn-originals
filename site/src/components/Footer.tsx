import { Link } from "react-router-dom";
import { ADDRESS_LINE, MAPS_URL, STORE, waUrl } from "../lib/store";
import { Logo } from "./Logo";

export function Footer() {
  const A = STORE.address;
  return (
    <footer className="mt-24 border-t border-linha bg-muro">
      <div className="wrap grid gap-12 py-12 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <Logo className="w-40 text-giz md:w-56" />
          <p className="m-0 mt-6 text-sm text-cinza">{STORE.legalName}</p>
          <p className="m-0 text-sm text-cinza">CNPJ {STORE.cnpj}</p>
        </div>
        <div>
          <h2 className="label text-cinza">Loja física</h2>
          <address className="mt-3 text-sm not-italic">
            {A.street}
            <br />
            {A.district}, {A.city} - {A.state}
          </address>
          <p className="m-0 mt-2 text-sm">{STORE.hours.text}</p>
          <a className="link mt-2 inline-block py-1 text-sm" href={MAPS_URL} rel="noopener noreferrer" target="_blank" aria-label={`Como chegar: ${ADDRESS_LINE}`}>Como chegar</a>
        </div>
        <div>
          <h2 className="label text-cinza">Contato</h2>
          <ul className="m-0 mt-3 list-none space-y-1 p-0 text-sm">
            <li><a className="link inline-block py-1" href={waUrl()}>WhatsApp {STORE.whatsapp.primaryLabel}</a></li>
            {STORE.email && <li><a className="link inline-block break-all py-1" href={`mailto:${STORE.email}`}>{STORE.email}</a></li>}
            <li><a className="link inline-block py-1" href={STORE.social.instagram} rel="noopener noreferrer">Instagram {STORE.social.instagramHandle}</a></li>
          </ul>
        </div>
        <div>
          <h2 className="label text-cinza">Ajuda</h2>
          <ul className="m-0 mt-3 list-none space-y-1 p-0 text-sm">
            <li><Link className="link inline-block py-1" to="/loja">Loja</Link></li>
            <li><Link className="link inline-block py-1" to="/como-comprar">Como comprar</Link></li>
            <li><Link className="link inline-block py-1" to="/a-loja">A loja</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
