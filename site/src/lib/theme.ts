export type Theme = "light" | "dark";
const KEY = "jn-theme";

/** Tema ativo: o atributo posto pelo script do <head> ou, sem ele, a preferência do sistema. */
export function currentTheme(): Theme {
  const a = document.documentElement.getAttribute("data-theme");
  if (a === "light" || a === "dark") return a;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(t: Theme) {
  document.documentElement.setAttribute("data-theme", t);
  try {
    localStorage.setItem(KEY, t);
  } catch {
    /* storage bloqueado: o tema vale só nesta visita */
  }
}
