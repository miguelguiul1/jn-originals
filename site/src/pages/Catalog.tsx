import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { PAGE } from "../config";
import { useCatalog, type Product } from "../lib/catalog";
import { money } from "../lib/store";
import { usePageTitle } from "../lib/meta";
import { ProductCard } from "../components/ProductCard";

const norm = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
const sizeKey = (a: string, b: string) => (Number(a) - Number(b) || a.localeCompare(b));
type Group = "categoria" | "marca" | "tamanho";
const ORDERS: Record<string, string> = { "": "Ordem da loja", menor: "Menor preço", maior: "Maior preço", nome: "Nome, A a Z" };

interface F {
  q: string;
  categoria: string[];
  marca: string[];
  tamanho: string[];
  min: number | null;
  max: number | null;
}

function matches(p: Product, f: F, skip?: Group | "preco") {
  if (f.q) {
    const hay = norm(`${p.name} ${p.brand} ${p.code} ${p.category}`);
    if (!norm(f.q).split(/\s+/).every((t) => hay.includes(t))) return false;
  }
  if (skip !== "categoria" && f.categoria.length && !f.categoria.includes(p.category)) return false;
  if (skip !== "marca" && f.marca.length && !f.marca.includes(p.brand)) return false;
  if (skip !== "tamanho" && f.tamanho.length && !(p.sizes && p.sizes.some((s) => f.tamanho.includes(s) && !p.unavailable.includes(s)))) return false;
  if (skip !== "preco") {
    if (f.min !== null && p.price < f.min) return false;
    if (f.max !== null && p.price > f.max) return false;
  }
  return true;
}

export default function Catalog() {
  usePageTitle("Loja");
  const { products, error } = useCatalog();
  const [sp, setSp] = useSearchParams();
  const [shown, setShown] = useState(PAGE);
  const [panel, setPanel] = useState(false);
  const toNum = (v: string | null) => (v && !Number.isNaN(Number(v)) ? Number(v) : null);
  const f: F = {
    q: sp.get("q") ?? "",
    categoria: sp.getAll("categoria"),
    marca: sp.getAll("marca"),
    tamanho: sp.getAll("tamanho"),
    min: toNum(sp.get("min")),
    max: toNum(sp.get("max")),
  };
  const ordem = sp.get("ordem") ?? "";
  const qs = sp.toString();

  useEffect(() => { setShown(PAGE); }, [qs]);
  useEffect(() => {
    if (!panel) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setPanel(false);
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [panel]);

  const update = (fn: (n: URLSearchParams) => void) => {
    const n = new URLSearchParams(sp);
    fn(n);
    setSp(n, { replace: true });
  };
  const toggle = (g: Group, v: string) =>
    update((n) => {
      const cur = n.getAll(g);
      n.delete(g);
      (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]).forEach((x) => n.append(g, x));
    });
  const setOne = (k: string, v: string) => update((n) => (v ? n.set(k, v) : n.delete(k)));

  const result = useMemo(() => {
    if (!products) return [];
    const r = products.filter((p) => matches(p, f));
    if (ordem === "menor") r.sort((a, b) => a.price - b.price);
    else if (ordem === "maior") r.sort((a, b) => b.price - a.price);
    else if (ordem === "nome") r.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    return r;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, qs]);

  const facets = useMemo(() => {
    const out: Record<Group, [string, number][]> = { categoria: [], marca: [], tamanho: [] };
    if (!products) return out;
    const tally = (g: Group, get: (p: Product) => string[]) => {
      const m = new Map<string, number>();
      for (const p of products) if (matches(p, f, g)) for (const v of get(p)) m.set(v, (m.get(v) ?? 0) + 1);
      for (const v of f[g]) if (!m.has(v)) m.set(v, 0);
      out[g] = [...m];
    };
    tally("categoria", (p) => [p.category]);
    tally("marca", (p) => (p.brand ? [p.brand] : []));
    tally("tamanho", (p) => (p.sizes ?? []).filter((s) => !p.unavailable.includes(s)));
    out.categoria.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    out.marca.sort((a, b) => a[0].localeCompare(b[0], "pt-BR"));
    out.tamanho.sort((a, b) => sizeKey(a[0], b[0]));
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, qs]);

  const active: { label: string; remove: () => void }[] = [
    ...(f.q ? [{ label: `Busca: ${f.q}`, remove: () => setOne("q", "") }] : []),
    ...f.categoria.map((v) => ({ label: v, remove: () => toggle("categoria", v) })),
    ...f.marca.map((v) => ({ label: v, remove: () => toggle("marca", v) })),
    ...f.tamanho.map((v) => ({ label: `Tamanho ${v}`, remove: () => toggle("tamanho", v) })),
    ...(f.min !== null || f.max !== null
      ? [{ label: `Preço ${f.min !== null ? "de " + money(f.min) : ""} ${f.max !== null ? "até " + money(f.max) : ""}`.trim(), remove: () => update((n) => { n.delete("min"); n.delete("max"); }) }]
      : []),
  ];

  const onPrice = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    update((n) => {
      for (const k of ["min", "max"]) {
        const v = String(d.get(k) ?? "").trim().replace(",", ".");
        if (v && !Number.isNaN(Number(v)) && Number(v) >= 0) n.set(k, v);
        else n.delete(k);
      }
    });
  };

  const filters = (
    <div className="space-y-2">
      {(["categoria", "marca", "tamanho"] as Group[]).map((g) => (
        <details key={g} open={g === "categoria" || f[g].length > 0} className="border-b border-line pb-2">
          <summary className="flex min-h-11 cursor-pointer items-center text-sm font-semibold">
            {g === "categoria" ? "Categoria" : g === "marca" ? "Marca" : "Tamanho"}
          </summary>
          <div className="flex max-h-64 flex-wrap gap-2 overflow-y-auto py-1">
            {facets[g].length === 0 && <span className="text-xs text-muted">Sem opções para esta busca.</span>}
            {facets[g].map(([v, n]) => {
              const on = f[g].includes(v);
              return (
                <button
                  key={v}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(g, v)}
                  className={"min-h-11 rounded-s border px-3 text-sm " + (on ? "border-ink bg-ink text-paper" : "border-field bg-paper text-ink hover:bg-frame")}
                >
                  {v} <span className={"num text-xs " + (on ? "text-paper" : "text-muted")}>{n}</span>
                </button>
              );
            })}
          </div>
          {g === "tamanho" && <p className="m-0 text-xs text-muted">Só entram produtos com tamanhos listados. Para os demais, confirme pelo WhatsApp.</p>}
        </details>
      ))}
      <details open={f.min !== null || f.max !== null} className="border-b border-line pb-3">
        <summary className="flex min-h-11 cursor-pointer items-center text-sm font-semibold">Preço</summary>
        <form onSubmit={onPrice} className="flex items-end gap-2" key={`${f.min}-${f.max}`}>
          <label className="text-xs text-muted">De (R$)
            <input name="min" inputMode="decimal" defaultValue={f.min ?? ""} className="field mt-1 text-ink" />
          </label>
          <label className="text-xs text-muted">Até (R$)
            <input name="max" inputMode="decimal" defaultValue={f.max ?? ""} className="field mt-1 text-ink" />
          </label>
          <button type="submit" className="btn btn-second !px-3">Aplicar</button>
        </form>
      </details>
    </div>
  );

  return (
    <div className="wrap pt-8">
      <h1 className="text-2xl">Loja</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside aria-label="Filtros" className={panel ? "fixed inset-0 z-40 overflow-y-auto bg-paper p-4 lg:static lg:z-auto lg:overflow-visible lg:p-0" : "hidden lg:block"}>
          <div className="mb-2 flex items-center justify-between lg:hidden">
            <h2 className="text-xl">Filtros</h2>
            <button type="button" className="min-h-11 px-2 text-sm underline underline-offset-4" onClick={() => setPanel(false)}>Fechar</button>
          </div>
          {filters}
          <button type="button" className="btn btn-primary mt-4 w-full lg:hidden" onClick={() => setPanel(false)}>
            Ver {result.length} produtos
          </button>
        </aside>

        <section aria-label="Produtos" className="min-w-0">
          <div className="flex flex-wrap items-end gap-3">
            <form role="search" className="min-w-[12rem] flex-1" onSubmit={(e) => { e.preventDefault(); setOne("q", String(new FormData(e.currentTarget).get("q") ?? "").trim()); }} key={f.q}>
              <label htmlFor="cq" className="block text-xs text-muted">Buscar na loja</label>
              <input id="cq" name="q" type="search" defaultValue={f.q} placeholder="Nome, marca ou código" className="field mt-1" />
            </form>
            <div>
              <label htmlFor="ord" className="block text-xs text-muted">Ordenar</label>
              <select id="ord" value={ordem} onChange={(e) => setOne("ordem", e.target.value)} className="field mt-1 w-auto">
                {Object.entries(ORDERS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <button type="button" className="btn btn-second lg:hidden" onClick={() => setPanel(true)}>
              Filtros{active.length ? ` (${active.length})` : ""}
            </button>
          </div>

          {active.length > 0 && (
            <ul className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0" aria-label="Filtros ativos">
              {active.map((a) => (
                <li key={a.label}>
                  <button type="button" onClick={a.remove} aria-label={`Remover filtro: ${a.label}`} className="min-h-11 rounded-s border border-field px-3 text-sm hover:bg-frame">
                    {a.label} <span aria-hidden="true">×</span>
                  </button>
                </li>
              ))}
              <li>
                <button type="button" className="min-h-11 px-2 text-sm underline underline-offset-4" onClick={() => setSp(new URLSearchParams(), { replace: true })}>Limpar tudo</button>
              </li>
            </ul>
          )}

          <p className="num my-4 text-sm text-muted" aria-live="polite">
            {products ? `${Math.min(shown, result.length)} de ${result.length}` : "Carregando"}
          </p>

          {error && (
            <p role="alert">Não foi possível carregar os produtos. <button className="link" onClick={() => location.reload()}>Tentar de novo</button></p>
          )}
          {!products && !error && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 min-[1100px]:grid-cols-4 min-[1440px]:grid-cols-5">
              {Array.from({ length: 10 }, (_, i) => <div key={i} className="skeleton aspect-square" />)}
            </div>
          )}
          {products && result.length === 0 && (
            <div className="py-12">
              <p className="m-0 text-lg">Nenhum produto com esses filtros.</p>
              <p className="mt-2 text-muted">Tire um filtro ou mude a busca.</p>
              <button className="btn btn-primary mt-4" onClick={() => setSp(new URLSearchParams(), { replace: true })}>Limpar filtros</button>
            </div>
          )}
          {products && result.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 min-[1100px]:grid-cols-4 min-[1440px]:grid-cols-5">
                {result.slice(0, shown).map((p, i) => <ProductCard key={p.slug} p={p} priority={i < 4} />)}
              </div>
              {shown < result.length && (
                <div className="mt-10 text-center">
                  <button className="btn btn-second" onClick={() => setShown((n) => n + PAGE)}>Ver mais</button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
