import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PROTOTYPE } from "../config";
import { useCart } from "../lib/cart";
import { groupUrl, ROUPAS } from "../lib/groups";
import { Logo } from "./Logo";

const NAV: [string, string][] = [
  ["Loja", "/loja"],
  ["Tênis", groupUrl("tenis")],
  ["Roupas", groupUrl(...ROUPAS)],
  ["Bonés", groupUrl("bones")],
  ["Como comprar", "/como-comprar"],
  ["A loja", "/a-loja"],
];
const nav =
  "label inline-flex min-h-11 items-center whitespace-nowrap px-1 text-giz no-underline hover:text-amarelo aria-[current=page]:underline aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-8";

export function Header() {
  const { count, setOpen } = useCart();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const [q, setQ] = useState("");
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    navigate(q.trim() ? `/loja?q=${encodeURIComponent(q.trim())}` : "/loja");
    setQ("");
  };
  return (
    <>
      {PROTOTYPE && (
        <div className="bg-amarelo text-asfalto">
          <p className="label wrap m-0 py-1.5">Protótipo: sem pagamento aqui, o pedido segue pelo WhatsApp.</p>
        </div>
      )}
      <header className={"sticky top-0 z-30 border-b border-linha transition-colors duration-[140ms] " + (scrolled ? "bg-muro" : "bg-asfalto")}>
        <div className="wrap flex flex-wrap items-center gap-x-6">
          <Link to="/" aria-label="JN Originals, início" className="py-3 text-giz">
            <Logo variant="mark" label={false} className="w-[34px]" />
          </Link>
          <nav aria-label="Principal" className="no-scrollbar order-3 -mx-1 flex w-full gap-4 overflow-x-auto md:order-none md:mx-0 md:w-auto md:overflow-visible">
            {NAV.map(([t, to]) => (
              <Link key={t} to={to} className={nav} aria-current={to === pathname + search || (to === "/loja" && pathname === "/loja" && !search) ? "page" : undefined}>
                {t}
              </Link>
            ))}
          </nav>
          <form role="search" onSubmit={submit} className="relative ml-auto hidden md:block">
            <label className="sr-only" htmlFor="hq">Buscar produtos</label>
            <input id="hq" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar" className="field !min-h-11 w-52 pl-9" />
            <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-3 -translate-y-[60%] rounded-full border-2 border-cinza after:absolute after:-bottom-[5px] after:-right-[4px] after:h-[2px] after:w-[6px] after:rotate-45 after:bg-cinza" />
          </form>
          <Link to="/loja" className={nav + " ml-auto md:hidden"}>Buscar</Link>
          <button type="button" onClick={() => setOpen(true)} className="label inline-flex min-h-11 items-center gap-2 text-giz hover:text-amarelo md:ml-0" aria-haspopup="dialog">
            Sacola
            <span className="num grid min-w-6 place-items-center bg-amarelo px-1 py-0.5 text-asfalto" aria-label={`${count} ${count === 1 ? "item" : "itens"}`}>{count}</span>
          </button>
        </div>
      </header>
    </>
  );
}
