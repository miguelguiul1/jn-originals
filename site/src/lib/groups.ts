import raw from "../data/groups.json";

export interface Group {
  slug: string;
  label: string;
  count: number;
}
export const GROUPS = raw as Group[];
export const groupSlug = (label: string) => GROUPS.find((g) => g.label === label)?.slug ?? label;
export const groupLabel = (slug: string) => GROUPS.find((g) => g.slug === slug)?.label ?? slug;
/** Links da navegação: "Roupas" junta os quatro grupos de vestuário. */
export const ROUPAS = ["jaquetas", "camisetas", "calcas", "conjuntos"];
export const groupUrl = (...slugs: string[]) => `/loja?${slugs.map((s) => `group=${s}`).join("&")}`;
