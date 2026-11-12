import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PROTOTYPE } from "../config";
import { useCart } from "../lib/cart";
import { groupUrl, ROUPAS } from "../lib/groups";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const NAV: [string, string][] = [
  ["Loja", "/loja"],
  ["Tênis", groupUrl("tenis")],
  ["Roupas", groupUrl(...ROUPAS)],
  ["Bonés", groupUrl("bones")],
  ["Como comprar", "/como-comprar"],
  ["A loja", "/a-loja"],
];
const nav =
  "label inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-3 text-texto no-underline hover:bg-linha aria-[current=page]:bg-texto aria-[current=page]:text-fundo";
const pill = "label inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-texto hover:bg-linha";

export function Header() {
  const { count, setOpen } = useCart();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const [q, setQ] = useState("");
  const [menu, setMenu] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const here = (to: string) => to === pathname + search || (to === "/loja" && pathname === "/loja" && !search);

  useEffect(() => setMenu(false), [pathname, search]);
  useEffect(() => {
    if (!menu) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        btn.current?.focus();
      }
    };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [menu]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    navigate(q.trim() ? `/loja?q=${encodeURIComponent(q.trim())}` : "/loja");
    setQ("");
  };
  const search_ = (id: string, cls: string) => (
    <form role="search" onSubmit={submit} className={"relative " + cls}>
      <label className="sr-only" htmlFor={id}>Buscar produtos</label>
      <input id={id} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar" className="field !min-h-11 w-full pl-10" />
      <span aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-3 -translate-y-[60%] rounded-full border-2 border-suave after:absolute after:-bottom-[5px] after:-right-[4px] after:h-[2px] after:w-[6px] after:rotate-45 after:bg-suave" />
    </form>
  );

  return (
    <>
      {PROTOTYPE && (
        <div className="bg-amarelo text-tinta">
          <p className="label wrap m-0 py-1.5">Protótipo: sem pagamento aqui, o pedido segue pelo WhatsApp.</p>
        </div>
      )}
      <header className="sticky top-2 z-30 mx-2 mt-2 md:mx-4">
        <div className="superficie mx-auto flex max-w-[calc(var(--container-page)-var(--gutter)*2)] items-center gap-1 rounded-full py-1.5 pl-3 pr-2 lg:gap-3 lg:pl-4">
          <Link to="/" aria-label="JN Originals, início" className="sticker mr-1 rounded-xl px-2 py-1.5 lg:mr-2" style={{ ["--giro" as string]: "-4deg" }}>
            <Logo variant="mark" label={false} className="w-[30px]" />
          </Link>
          <nav aria-label="Principal" className="hidden lg:flex lg:gap-1">
            {NAV.map(([t, to]) => (
              <Link key={t} to={to} className={nav} aria-current={here(to) ? "page" : undefined}>{t}</Link>
            ))}
          </nav>
          {search_("hq", "ml-auto hidden w-48 lg:block")}
          <button ref={btn} type="button" className={pill + " ml-auto lg:hidden"} aria-expanded={menu} aria-controls="menu-mobile" onClick={() => setMenu((v) => !v)}>
            Menu
          </button>
          <ThemeToggle className={pill} />
          <button type="button" onClick={() => setOpen(true)} className={pill} aria-haspopup="dialog">
            Sacola
            <span className="num grid min-w-6 place-items-center rounded-full bg-amarelo px-1.5 py-0.5 text-tinta" aria-label={`${count} ${count === 1 ? "item" : "itens"}`}>{count}</span>
          </button>
        </div>
        {menu && (
          <div id="menu-mobile" className="drop superficie mt-2 rounded-3xl p-4 lg:hidden">
            {search_("hq-m", "mb-4")}
            <ul className="m-0 grid list-none grid-cols-2 gap-2 p-0">
              {NAV.map(([t, to]) => (
                <li key={t}>
                  <Link to={to} aria-current={here(to) ? "page" : undefined} className="display flex min-h-14 items-center rounded-2xl py-3 leading-[0.95] bg-fundo px-4 text-2xl text-texto no-underline aria-[current=page]:bg-amarelo aria-[current=page]:text-tinta">{t}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>
    </>
  );
}
