import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

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
    const t = window.setTimeout(end, 1600);
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
      className="ink-surface fixed inset-0 z-[100] grid place-items-center bg-ink text-paper"
      style={{
        animation: "intro-out 480ms var(--ease-io) 1120ms both",
        opacity: leaving ? 0 : 1,
        transition: "opacity 180ms var(--ease-out)",
      }}
    >
      <div aria-hidden="true" className="px-4 text-center">
        <div
          className="font-display text-[clamp(3rem,12vw,7rem)] italic leading-none"
          style={{ fontWeight: 700, animation: "intro-logo 500ms var(--ease-out) both" }}
        >
          JN Originals
        </div>
        <div
          className="mx-auto mt-4 h-[3px] w-full origin-left bg-signal"
          style={{ animation: "intro-bar 600ms var(--ease-io) 300ms both" }}
        />
      </div>
      <button
        ref={skipRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          skip();
        }}
        className="absolute bottom-4 right-4 min-h-11 px-3 text-sm text-paper underline underline-offset-4"
      >
        Pular
      </button>
    </div>
  );
}
