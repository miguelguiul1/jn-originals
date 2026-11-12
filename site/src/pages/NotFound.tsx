import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePageTitle } from "../lib/meta";
import { GROUPS } from "../lib/groups";

export default function NotFound() {
  usePageTitle("Página não encontrada");
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const go = (e: FormEvent) => {
    e.preventDefault();
    nav(`/loja?q=${encodeURIComponent(q.trim())}`);
  };
  return (
    <div className="wrap pt-12 md:pt-20">
      <h1 className="display t-hero max-w-[10ch]">Perdeu o caminho?</h1>
      <p className="mt-6 max-w-[60ch] text-cinza">Essa página não existe ou o endereço mudou. Busque um produto ou veja as categorias.</p>
      <form onSubmit={go} role="search" className="mt-6 flex max-w-md gap-2">
        <label htmlFor="nf-q" className="sr-only">Buscar produtos</label>
        <input id="nf-q" type="search" className="field" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar" />
        <button className="btn btn-buy" type="submit">Buscar</button>
      </form>
      <ul className="m-0 mt-10 flex list-none flex-wrap gap-2 p-0">
        {GROUPS.slice(0, 6).map((g) => (
          <li key={g.slug}>
            <Link className="chip no-underline" to={`/loja?group=${g.slug}`}>{g.label} <span className="num text-xs opacity-80">{g.count}</span></Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
