import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Product } from "./catalog";

// A linha guarda uma cópia dos dados do produto: a sacola funciona sem carregar o catálogo.
export interface CartLine {
  slug: string;
  size: string; // "" quando o tamanho será confirmado pelo WhatsApp
  qty: number;
  name: string;
  rawName?: string;
  code: string;
  price: number;
  img: string | null;
}

interface CartCtx {
  lines: CartLine[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (p: Product, size: string) => void;
  setQty: (slug: string, size: string, qty: number) => void;
  remove: (slug: string, size: string) => void;
  clear: () => void;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "jn-cart-v2";

function load(): CartLine[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || "[]") as CartLine[];
    return Array.isArray(parsed)
      ? parsed.filter((l) => l && typeof l.slug === "string" && typeof l.price === "number" && l.qty > 0)
      : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<CartLine[]>([]);

  // Lê o armazenamento só depois da hidratação (o HTML pré-renderizado tem sacola vazia).
  useEffect(() => {
    const saved = load();
    if (!saved.length) return;
    ref.current = [...saved, ...ref.current];
    setLines(ref.current);
  }, []);

  // Grava de forma síncrona na própria ação, antes de qualquer navegação.
  const commit = useCallback((fn: (cur: CartLine[]) => CartLine[]) => {
    const next = fn(ref.current);
    ref.current = next;
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* sem armazenamento: a sacola vale só nesta visita */
    }
    setLines(next);
  }, []);

  const add = useCallback((p: Product, size: string) => {
    const i0 = p.imgs[0];
    const img = i0 ? `/img/p/${p.slug}-${i0.n}-${i0.widths[0]}.webp` : null;
    commit((cur) => {
      const i = cur.findIndex((l) => l.slug === p.slug && l.size === size);
      if (i >= 0) {
        const next = [...cur];
        next[i] = { ...next[i], qty: Math.min(10, next[i].qty + 1) };
        return next;
      }
      return [...cur, { slug: p.slug, size, qty: 1, name: p.name, rawName: p.rawName, code: p.code, price: p.price, img }];
    });
    setOpen(true);
  }, [commit]);

  const setQty = useCallback((slug: string, size: string, qty: number) => {
    commit((cur) =>
      cur.map((l) => (l.slug === slug && l.size === size ? { ...l, qty: Math.min(10, qty) } : l)).filter((l) => l.qty > 0),
    );
  }, [commit]);
  const remove = useCallback((slug: string, size: string) => {
    commit((cur) => cur.filter((l) => !(l.slug === slug && l.size === size)));
  }, [commit]);
  const clear = useCallback(() => commit(() => []), [commit]);

  const value = useMemo<CartCtx>(
    () => ({
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.qty * l.price, 0),
      open,
      setOpen,
      add,
      setQty,
      remove,
      clear,
    }),
    [lines, open, add, setQty, remove, clear],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart fora do CartProvider");
  return c;
}
