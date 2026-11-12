import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Logo } from "./Logo";

const KEY = "jn-intro";

// Decide uma única vez, antes da primeira pintura: só em "/", 1x por sessão, sem reduced-motion.
function shouldPlay() {
  if (window.location.pathname !== "/") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    if (sessionStorage.getItem(KEY)) return false;
    sessionStorage.setItem(KEY, "1");
    return true;
  } catch {
    return false;
  }
}

export function Intro() {
  const [on, setOn] = useState(false);
  const decided = useRef(false);
  const [leaving, setLeaving] = useState(false);
  const skipRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();

  const end = useCallback(() => setOn(false), []);
  const skip = useCallback(() => {
    setLeaving(true);
    window.setTimeout(end, 180);
  }, [end]);

  // Decide depois da hidratação, para o HTML pré-renderizado e o primeiro render coincidirem.
  useEffect(() => {
    if (decided.current) return;
    decided.current = true;
    if (shouldPlay()) setOn(true);
  }, []);

  useEffect(() => {
    if (!on) return;
    const shell = document.getElementById("shell");
    shell?.setAttribute("inert", "");
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    skipRef.current?.focus({ preventScroll: true });
    const t = window.setTimeout(end, 1660);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && skip();
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      shell?.removeAttribute("inert");
      html.style.overflow = prev;
    };
  }, [on, end, skip]);

  useEffect(() => {
    if (pathname !== "/") setOn(false);
  }, [pathname]);

  if (!on) return null;
  return (
    <div
      role="presentation"
      onClick={skip}
      className="fixed inset-0 z-[100] grid place-items-center bg-asfalto text-giz"
      style={{
        animation: "intro-up 400ms var(--ease-out) 1250ms both",
        opacity: leaving ? 0 : 1,
        transition: "opacity 180ms var(--ease-out)",
      }}
    >
      {/* Duas camadas do mesmo logo: letras (esquerda para direita) e escorridos (de cima para baixo). */}
      <div aria-hidden="true" className="relative w-[min(60vw,36vh,22rem)]">
        <Logo label={false} className="text-giz" style={{ animation: "spray-x 700ms var(--ease-out) both" }} />
        <Logo label={false} className="absolute inset-0 text-giz" style={{ animation: "spray-y 400ms var(--ease-out) 700ms both" }} />
      </div>
      <button
        ref={skipRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          skip();
        }}
        className="label absolute bottom-4 right-4 min-h-11 px-3 text-giz underline underline-offset-4"
      >
        Pular
      </button>
    </div>
  );
}
