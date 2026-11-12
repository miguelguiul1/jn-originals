import raw from "../data/store.json";

export interface StoreData {
  name: string;
  legalName: string;
  cnpj: string;
  address: { street: string; district: string; city: string; state: string };
  hours: { text: string };
  phone: string | null;
  email: string | null;
  whatsapp: { primary: string; primaryLabel: string };
  social: { instagram: string; instagramHandle: string };
  physicalStore: boolean;
}
export const STORE = raw as unknown as StoreData;

const A = STORE.address;
export const ADDRESS_LINE = `${A.street}, ${A.district}, ${A.city} - ${A.state}`;
/** Só um link para o Google Maps: sem iframe, sem script de terceiros. */
export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS_LINE)}`;

export function waUrl(message?: string) {
  const q = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${STORE.whatsapp.primary}${q}`;
}

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
export const money = (v: number) => brl.format(v);
const num = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const moneyPlain = (v: number) => num.format(v);
