import { useEffect, useState } from "react";
import { applyTheme, currentTheme, type Theme } from "../lib/theme";

/** Botão mostra o tema para onde vai trocar. O texto vem de CSS (sem esperar o JS); o aria-label só depois de montar. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme | null>(null);
  useEffect(() => setTheme(currentTheme()), []);
  const next: Theme = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      className={className}
      {...(theme ? { "aria-label": `Usar tema ${next === "dark" ? "escuro" : "claro"}` } : {})}
      onClick={() => {
        applyTheme(next);
        setTheme(next);
      }}
    >
      <span className="tema-escuro">Escuro</span>
      <span className="tema-claro">Claro</span>
    </button>
  );
}
