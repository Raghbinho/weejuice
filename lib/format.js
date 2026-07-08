// Utilitaires de formatage partagés client/serveur.
// Devise, locale et fuseau proviennent de lib/config.js (TND par défaut).

import { CONFIG } from "./config.js";

// Formate un montant selon la devise configurée.
// Exemples TND : formatPrice(5.5) -> "5,500 TND" ; symbole "د.ت" possible via config.
export function formatPrice(value) {
  const { code, symbol, decimals, position } = CONFIG.currency;

  const number = new Intl.NumberFormat(CONFIG.locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value ?? 0);

  const sym = symbol || code;
  return position === "before" ? `${sym} ${number}` : `${number} ${sym}`;
}

// Date au format JJ/MM/AAAA + heure, fuseau Africa/Tunis par défaut.
export function formatDate(date) {
  return new Intl.DateTimeFormat(CONFIG.locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: CONFIG.timezone,
  }).format(new Date(date));
}

export const STATUSES = {
  NOUVELLE: { label: "Nouvelle", color: "bg-blue-100 text-blue-700" },
  PREPARATION: { label: "En préparation", color: "bg-amber-100 text-amber-700" },
  PRETE: { label: "Prête", color: "bg-purple-100 text-purple-700" },
  LIVREE: { label: "Livrée", color: "bg-green-100 text-green-700" },
  ANNULEE: { label: "Annulée", color: "bg-red-100 text-red-700" },
};

export const STATUS_ORDER = ["NOUVELLE", "PREPARATION", "PRETE", "LIVREE", "ANNULEE"];
