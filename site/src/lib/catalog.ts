import { useEffect, useState } from "react";

export interface Img {
  n: number;
  w: number;
  h: number;
  widths: number[]; // larguras existentes, em ordem crescente
}
export interface Product {
  slug: string;
  name: string;
  rawName: string; // nome como está no catálogo
  brand: string;
  category: string;
  subcategory: string | null;
  code: string;
  price: number;
  oldPrice: number | null;
  installment: number | null;
  installmentCount: number | null;
  sizes: string[] | null;
  unavailable: string[];
  inStock: boolean | null;
  description: string | null;
  sourceUrl: string;
  imgs: Img[];
}

// Registro compacto gerado por scripts/build-data.mjs.
export interface Packed {
  s: string;
  n: string;
  b: string;
  c: string;
  k: string;
  p: number;
  m: [number, number, number, number[]][];
  sc?: string;
  o?: number;
  i?: number;
  ic?: number;
  z?: string[];
  x?: string[];
  st?: number;
  d?: string;
  u?: string;
}

const SOURCE = "https://www.jnoriginalsshop.com.br";

// "TÊNIS NIKE AIR 90" vira "Tênis Nike Air 90"; códigos com número ficam como estão.
function niceName(s: string) {
  if (s !== s.toUpperCase()) return s;
  return s
    .toLocaleLowerCase("pt-BR")
    .replace(/(^|[\s\-/(])(\p{L})/gu, (_m, a: string, b: string) => a + b.toLocaleUpperCase("pt-BR"))
    .replace(/\b\w*\d\w*\b/g, (t) => t.toUpperCase());
}

export function unpack(p: Packed): Product {
  return {
    slug: p.s,
    name: niceName(p.n),
    rawName: p.n,
    brand: p.b ?? "",
    category: p.c,
    subcategory: p.sc ?? null,
    code: p.k,
    price: p.p,
    oldPrice: p.o ?? null,
    installment: p.i ?? null,
    installmentCount: p.ic ?? null,
    sizes: p.z ?? null,
    unavailable: p.x ?? [],
    inStock: p.st === undefined ? null : p.st === 1,
    description: p.d ?? null,
    sourceUrl: p.u ?? `${SOURCE}/${p.s}`,
    imgs: p.m.map(([n, w, h, widths]) => ({ n, w, h, widths })),
  };
}

let cache: Promise<Product[]> | null = null;
export function loadCatalog(): Promise<Product[]> {
  if (!cache) {
    cache = fetch("/data/catalog.v1.json")
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json() as Promise<Packed[]>;
      })
      .then((a) => a.map(unpack))
      .catch((e) => {
        cache = null;
        throw e;
      });
  }
  return cache;
}

export function useCatalog() {
  const [state, set] = useState<{ products: Product[] | null; error: boolean }>({ products: null, error: false });
  useEffect(() => {
    let live = true;
    loadCatalog().then(
      (products) => live && set({ products, error: false }),
      () => live && set({ products: null, error: true }),
    );
    return () => {
      live = false;
    };
  }, []);
  return state;
}

export const imgUrl = (slug: string, n: number, w: number) => `/img/p/${slug}-${n}-${w}.webp`;
export const installmentText = (p: { installment: number | null; installmentCount: number | null }, fmt: (v: number) => string) =>
  p.installment && p.installmentCount ? `${p.installmentCount}x de ${fmt(p.installment)}` : null;
