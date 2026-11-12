import { useState, type FormEvent } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { PROTOTYPE } from "../config";
import { useCart } from "../lib/cart";
import { Logo } from "./Logo";

const nav = "inline-flex min-h-11 items-center text-sm text-ink no-underline hover:underline underline-offset-4 aria-[current=page]:underline";

export function Header() {
  const { count, setOpen } = useCart();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    navigate(q.trim() ? `/loja?q=${encodeURIComponent(q.trim())}` : "/loja");
    setQ("");
  };
  return (
    <>
      {PROTOTYPE && (
        <div className="bg-frame text-xs text-muted">
          <p className="wrap m-0 py-1.5">Protótipo: sem pagamento aqui, o pedido segue pelo WhatsApp.</p>
        </div>
      )}
      <header className="border-b border-line">
        <div className="wrap flex flex-wrap items-center gap-x-6 gap-y-1 py-2">
          <Logo />
          <nav aria-label="Principal" className="order-3 flex w-full gap-5 sm:order-none sm:w-auto">
            <NavLink to="/loja" className={nav}>Loja</NavLink>
            <NavLink to="/como-comprar" className={nav}>Como comprar</NavLink>
            <NavLink to="/a-loja" className={nav}>A loja</NavLink>
          </nav>
          <form role="search" onSubmit={submit} className="ml-auto hidden md:block">
            <label className="sr-only" htmlFor="hq">Buscar produtos</label>
            <input id="hq" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar" className="field !min-h-11 w-56" />
          </form>
          <button type="button" onClick={() => setOpen(true)} className="ml-auto min-h-11 px-1 text-sm md:ml-0" aria-haspopup="dialog">
            Sacola ({count})
          </button>
        </div>
      </header>
    </>
  );
}
