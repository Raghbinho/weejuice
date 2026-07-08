// ─────────────────────────────────────────────────────────────────────────────
// Configuration centrale de la boutique.
// Tout ce qui est spécifique au marché (devise, locale, fuseau, pays) est ici.
// Modifiable via variables d'environnement — AUCUN changement de code requis.
// ─────────────────────────────────────────────────────────────────────────────

// Devise : par défaut Dinar Tunisien (TND), 3 décimales, séparateur virgule.
// Pour changer de devise plus tard : régler CURRENCY_CODE / CURRENCY_SYMBOL / CURRENCY_DECIMALS.
export const CONFIG = {
  currency: {
    code: process.env.NEXT_PUBLIC_CURRENCY_CODE || "TND",
    // Symbole affiché après le montant. "TND" par défaut ; mettre "د.ت" pour l'arabe.
    symbol: process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "TND",
    decimals: Number(process.env.NEXT_PUBLIC_CURRENCY_DECIMALS ?? 3),
    // Position du symbole : "after" (5,500 TND) ou "before".
    position: process.env.NEXT_PUBLIC_CURRENCY_POSITION || "after",
  },

  // Locale d'affichage des nombres/dates. fr-TN respecte les usages tunisiens.
  locale: process.env.NEXT_PUBLIC_LOCALE || "fr-TN",

  // Fuseau horaire par défaut.
  timezone: process.env.NEXT_PUBLIC_TIMEZONE || "Africa/Tunis",

  // Pays / téléphone.
  country: {
    code: "TN",
    dialCode: "+216",
    // Un numéro tunisien local = 8 chiffres.
    phoneDigits: 8,
  },

  // Livraison (préparé pour plus tard — exprimé dans la devise ci-dessus).
  delivery: {
    fee: Number(process.env.NEXT_PUBLIC_DELIVERY_FEE ?? 0),
    freeAbove: Number(process.env.NEXT_PUBLIC_DELIVERY_FREE_ABOVE ?? 0),
  },
};

// Gouvernorats tunisiens (24) — pour le formulaire d'adresse.
export const GOUVERNORATS = [
  "Ariana",
  "Béja",
  "Ben Arous",
  "Bizerte",
  "Gabès",
  "Gafsa",
  "Jendouba",
  "Kairouan",
  "Kasserine",
  "Kébili",
  "Le Kef",
  "Mahdia",
  "La Manouba",
  "Médenine",
  "Monastir",
  "Nabeul",
  "Sfax",
  "Sidi Bouzid",
  "Siliana",
  "Sousse",
  "Tataouine",
  "Tozeur",
  "Tunis",
  "Zaghouan",
];
