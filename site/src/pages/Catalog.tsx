import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { PAGE } from "../config";
import { useCatalog, type Product } from "../lib/catalog";
import { money } from "../lib/store";
import { usePageTitle } from "../lib/meta";
import { ProductCard } from "../components/ProductCard";
import { GROUPS, groupLabel, groupSlug } from "../lib/groups";

const norm = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
const sizeKey = (a: string, b: string) => (Number(a) - Number(b) || a.localeCompare(b));
type Group = "group" | "categoria" | "marca" | "tamanho";
const FACET_LABEL: Record<Group, string> = { group: "Categoria", categoria: "Departamento", marca: "Marca", tamanho: "Tamanho" };
const ORDERS: Record<string, string> = { "": "Ordem da loja", menor: "Menor preço", maior: "Maior preço", nome: "Nome, A a Z" };

interface F {
  q: string;
  group: string[];
  categoria: string[];
  marca: string[];
  tamanho: string[];
  min: number | null;
  max: number | null;
}

function matches(p: Product, f: F, skip?: Group | "preco") {
  if (f.q) {
    const hay = norm(`${p.name} ${p.brand} ${p.code} ${p.category} ${p.group}`);
    if (!norm(f.q).split(/\s+/).every((t) => hay.includes(t))) return false;
  }
  if (skip !== "group" && f.group.length && !f.group.includes(groupSlug(p.group))) return false;
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
    group: sp.getAll("group"),
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
    const out: Record<Group, [string, number][]> = { group: [], categoria: [], marca: [], tamanho: [] };
    if (!products) return out;
    const tally = (g: Group, get: (p: Product) => string[]) => {
      const m = new Map<string, number>();
      for (const p of products) if (matches(p, f, g)) for (const v of get(p)) m.set(v, (m.get(v) ?? 0) + 1);
      for (const v of f[g]) if (!m.has(v)) m.set(v, 0);
      out[g] = [...m];
    };
    tally("group", (p) => [groupSlug(p.group)]);
    tally("categoria", (p) => [p.category]);
    tally("marca", (p) => (p.brand ? [p.brand] : []));
    tally("tamanho", (p) => (p.sizes ?? []).filter((s) => !p.unavailable.includes(s)));
    out.group.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    out.categoria.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    out.marca.sort((a, b) => a[0].localeCompare(b[0], "pt-BR"));
    out.tamanho.sort((a, b) => sizeKey(a[0], b[0]));
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, qs]);

  const active: { label: string; remove: () => void }[] = [
    ...(f.q ? [{ label: `Busca: ${f.q}`, remove: () => setOne("q", "") }] : []),
    ...f.group.map((v) => ({ label: groupLabel(v), remove: () => toggle("group", v) })),
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
    <div>
      {(["group", "categoria", "marca", "tamanho"] as Group[]).map((g) => (
        <details key={g} open={g === "group" || f[g].length > 0} className="border-b border-linha pb-2">
          <summary className="label flex min-h-11 cursor-pointer items-center">{FACET_LABEL[g]}</summary>
          <div className="flex max-h-64 flex-wrap gap-2 overflow-y-auto py-1">
            {facets[g].length === 0 && <span className="text-xs text-cinza">Sem opções para esta busca.</span>}
            {facets[g].map(([v, n]) => (
              <button key={v} type="button" aria-pressed={f[g].includes(v)} onClick={() => toggle(g, v)} className="chip">
                {g === "group" ? groupLabel(v) : v} <span className="num text-xs opacity-80">{n}</span>
              </button>
            ))}
          </div>
          {g === "tamanho" && <p className="m-0 mt-1 text-xs text-cinza">Só entram produtos com tamanhos listados. Para os demais, confirme pelo WhatsApp.</p>}
        </details>
      ))}
      <details open={f.min !== null || f.max !== null} className="border-b border-linha pb-3">
        <summary className="label flex min-h-11 cursor-pointer items-center">Preço</summary>
        <form onSubmit={onPrice} className="flex items-end gap-2" key={`${f.min}-${f.max}`}>
          <label className="text-xs text-cinza">De (R$)
            <input name="min" inputMode="decimal" defaultValue={f.min ?? ""} className="field mt-1" />
          </label>
          <label className="text-xs text-cinza">Até (R$)
            <input name="max" inputMode="decimal" defaultValue={f.max ?? ""} className="field mt-1" />
          </label>
          <button type="submit" className="btn btn-second !px-3">Ok</button>
        </form>
      </details>
    </div>
  );

  const cols = "grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-4 lg:grid-cols-4";
  return (
    <div className="wrap pt-8 md:pt-12">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <h1 className="display t-hero">Loja</h1>
        <p className="num m-0 pb-2 text-cinza" aria-live="polite">
          {products ? `${result.length} ${result.length === 1 ? "produto" : "produtos"}` : "Carregando"}
        </p>
      </div>

      <nav aria-label="Categorias" className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden">
        <button type="button" className="chip" aria-current={f.group.length === 0 ? "true" : undefined} onClick={() => update((n) => n.delete("group"))}>Tudo</button>
        {GROUPS.slice(0, 6).map((g) => (
          <button key={g.slug} type="button" className="chip" aria-current={f.group.length === 1 && f.group[0] === g.slug ? "true" : undefined} onClick={() => update((n) => n.set("group", g.slug))}>{g.label}</button>
        ))}
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside aria-label="Filtros" className={(panel ? "drawer fixed inset-0 z-40 overflow-y-auto bg-muro p-4 lg:static lg:z-auto lg:animate-none lg:overflow-visible" : "hidden lg:block") + " lg:self-start lg:bg-muro lg:p-4"}>
          <div className="mb-2 flex items-center justify-between lg:hidden">
            <h2 className="display text-4xl">Filtros</h2>
            <button type="button" className="label min-h-11 px-2 underline underline-offset-4" onClick={() => setPanel(false)}>Fechar</button>
          </div>
          {filters}
          <button type="button" className="btn btn-buy mt-4 w-full lg:hidden" onClick={() => setPanel(false)}>
            Ver {result.length} produtos
          </button>
        </aside>

        <section aria-label="Produtos" className="min-w-0">
          <div className="flex flex-wrap items-end gap-3">
            <form role="search" className="min-w-[12rem] flex-1" onSubmit={(e) => { e.preventDefault(); setOne("q", String(new FormData(e.currentTarget).get("q") ?? "").trim()); }} key={f.q}>
              <label htmlFor="cq" className="label block text-cinza">Buscar na loja</label>
              <input id="cq" name="q" type="search" defaultValue={f.q} placeholder="Nome, marca ou código" className="field mt-1" />
            </form>
            <div>
              <label htmlFor="ord" className="label block text-cinza">Ordenar</label>
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
                  <button type="button" onClick={a.remove} aria-label={`Remover filtro: ${a.label}`} className="chip" aria-pressed="true">
                    {a.label} <span aria-hidden="true">×</span>
                  </button>
                </li>
              ))}
              <li>
                <button type="button" className="label min-h-11 px-2 underline underline-offset-4" onClick={() => setSp(new URLSearchParams(), { replace: true })}>Limpar tudo</button>
              </li>
            </ul>
          )}

          <p className="num mb-4 mt-4 text-sm text-cinza">
            {products ? `Mostrando ${Math.min(shown, result.length)} de ${result.length}` : ""}
          </p>

          {error && (
            <p role="alert">Não foi possível carregar os produtos. <button className="link" onClick={() => location.reload()}>Tentar de novo</button></p>
          )}
          {!products && !error && (
            <div className={cols}>
              {Array.from({ length: 8 }, (_, i) => <div key={i} className="skeleton aspect-square" />)}
            </div>
          )}
          {products && result.length === 0 && (
            <div className="bg-muro p-6 md:p-10">
              <p className="display m-0 text-4xl md:text-6xl">Nada por aqui.</p>
              <p className="mt-4 text-cinza">Nenhum produto com esses filtros. Tire um filtro ou mude a busca.</p>
              <button className="btn btn-buy mt-6" onClick={() => setSp(new URLSearchParams(), { replace: true })}>Limpar filtros</button>
            </div>
          )}
          {products && result.length > 0 && (
            <>
              <div className={cols}>
                {result.slice(0, shown).map((p, i) => <ProductCard key={p.slug} p={p} priority={i < 2} />)}
              </div>
              {shown < result.length && (
                <div className="mt-12 text-center">
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
