// ─────────────────────────────────────────────────────────────────────────────
// Internationalisation (i18n) — architecture prête pour FR / AR / EN.
//
// Aujourd'hui la langue active est le français. Pour ajouter l'arabe ou l'anglais :
//   1. compléter les blocs `ar` / `en` ci-dessous ;
//   2. régler NEXT_PUBLIC_LOCALE (ex : "ar-TN") ;
//   3. (arabe) le layout bascule `dir="rtl"` automatiquement via isRTL().
//
// Aucune logique métier ne dépend des libellés : tout passe par t(key).
// ─────────────────────────────────────────────────────────────────────────────

const DICT = {
  fr: {
    "nav.juices": "Nos jus",
    "nav.admin": "Admin",
    "nav.cart": "Panier",
    "cart.title": "Votre panier",
    "cart.empty": "Votre panier est vide",
    "cart.continue": "Continuer mes achats",
    "cart.checkout": "Valider la commande",
    "cart.total": "Total",
    "order.payOnDelivery": "Paiement à la livraison",
  },
  // Squelettes à compléter — les clés manquantes retombent sur le français.
  ar: {},
  en: {},
};

// Langue courante déduite de la locale (ex : "fr-TN" -> "fr").
export const CURRENT_LANG = (
  process.env.NEXT_PUBLIC_LOCALE || "fr-TN"
).slice(0, 2);

export function isRTL(lang = CURRENT_LANG) {
  return lang === "ar";
}

// Traduit une clé ; retombe sur le français puis sur la clé brute.
export function t(key, lang = CURRENT_LANG) {
  return DICT[lang]?.[key] ?? DICT.fr[key] ?? key;
}
