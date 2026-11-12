import raw from "../data/store.json";

export interface StoreData {
  name: string;
  legalName: string;
  cnpj: string;
  address: string | null;
  hours: string | null;
  phone: string | null;
  email: string | null;
  whatsapp: { primary: string; primaryLabel: string };
  social: { instagram: string };
}
export const STORE = raw as unknown as StoreData;

export function waUrl(message?: string) {
  const q = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${STORE.whatsapp.primary}${q}`;
}

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
export const money = (v: number) => brl.format(v);
const num = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const moneyPlain = (v: number) => num.format(v);
