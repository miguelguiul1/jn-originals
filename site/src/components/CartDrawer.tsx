import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../lib/cart";
import { money } from "../lib/store";
import { CartLines } from "./CartLines";

export function CartDrawer() {
  const { open, setOpen, lines, subtotal } = useCart();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const root = ref.current!;
    const focusables = () => Array.from(root.querySelectorAll<HTMLElement>("a[href],button:not([disabled]),input,select"));
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setOpen(false);
      if (e.key !== "Tab") return;
      const f = focusables();
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      prev?.focus();
    };
  }, [open, setOpen]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="scrim absolute inset-0 bg-asfalto/70" onClick={() => setOpen(false)} aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className="drawer absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col border-l border-linha bg-muro"
      >
        <div className="flex items-center justify-between border-b border-linha p-4">
          <h2 id="cart-title" className="display text-4xl">Sacola</h2>
          <button type="button" onClick={() => setOpen(false)} className="label min-h-11 px-2 underline underline-offset-4">Fechar</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {lines.length ? (
            <CartLines compact />
          ) : (
            <p className="m-0 text-cinza">
              Sua sacola está vazia.{" "}
              <Link to="/loja" className="link text-giz" onClick={() => setOpen(false)}>Ver a loja</Link>
            </p>
          )}
        </div>
        {lines.length > 0 && (
          <div className="border-t border-linha p-4">
            <div className="mb-3 flex items-baseline justify-between"><span className="label">Total</span><b className="display-m num text-3xl">{money(subtotal)}</b></div>
            <Link to="/sacola" onClick={() => setOpen(false)} className="btn btn-buy w-full">Ver sacola e finalizar</Link>
          </div>
        )}
      </div>
    </div>
  );
}
