import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import data from "../data/featured.json";
import { usePageTitle } from "../lib/meta";

export default function NotFound() {
  usePageTitle("Página não encontrada");
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const go = (e: FormEvent) => {
    e.preventDefault();
    nav(`/loja?q=${encodeURIComponent(q.trim())}`);
  };
  const cats = (data.categories as { name: string; count: number }[]).slice(0, 4);
  return (
    <div className="wrap py-20">
      <h1 className="text-2xl">Essa página não existe.</h1>
      <p className="mt-4 max-w-[60ch] text-muted">O endereço pode ter mudado. Busque um produto ou veja as categorias.</p>
      <form onSubmit={go} role="search" className="mt-6 flex max-w-md gap-2">
        <label htmlFor="nf-q" className="sr-only">Buscar produtos</label>
        <input id="nf-q" type="search" className="field" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar" />
        <button className="btn btn-primary" type="submit">Buscar</button>
      </form>
      <ul className="m-0 mt-8 flex list-none flex-wrap gap-x-8 gap-y-2 p-0">
        {cats.map((c) => (
          <li key={c.name}>
            <Link className="font-display text-xl text-ink underline underline-offset-4" to={`/loja?categoria=${encodeURIComponent(c.name)}`}>{c.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
