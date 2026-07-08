# 🧃 WeeJuice — Boutique de jus frais (Tunisie)

Site de commande de jus frais, pressés à la commande, **paiement à la livraison**.
Adapté au marché tunisien : devise **TND**, téléphone **+216**, gouvernorats, fuseau **Africa/Tunis**.

## Stack

- **Next.js 15** (App Router) — front + API dans un seul projet, déployable facilement.
- **Prisma + SQLite** — stockage des commandes et des jus (migration vers Postgres possible sans changer le code métier).
- **Tailwind CSS** — design coloré, responsive, animations légères.
- **Zod** — validation des commandes côté serveur.

## Démarrage

```bash
cp .env.example .env      # ajustez ADMIN_PASSWORD au minimum
npm install
npm run db:push           # crée la base SQLite
npm run seed              # ajoute les 6 jus de départ
npm run dev               # http://localhost:3000
```

Admin : http://localhost:3000/admin — mot de passe = `ADMIN_PASSWORD` du `.env`.

## Fonctionnalités

| Zone | Détails |
|------|---------|
| **Accueil** | Hero fruité, message « frais / naturel / à la commande », jus populaires, CTA « Commander maintenant ». |
| **Catalogue** | Cartes produits : image, nom, description, **sélecteur de format** (0,5 L / 1 L / 2 L) et **prix mis à jour en direct**. |
| **Panier** | Ajout, modification de quantité, suppression, total, continuer / valider. Persisté en `localStorage`. |
| **Commande** | Prénom, nom, téléphone (validé format tunisien), gouvernorat, ville, adresse, note, **carte OpenStreetMap** optionnelle. |
| **Confirmation** | Référence de commande + rappel paiement à la livraison. |
| **Admin** | Liste + filtres par statut, détail commande, changement de statut (Nouvelle → En préparation → Prête → Livrée / Annulée), gestion des jus (activer/désactiver, modifier les prix par format). |
| **Notifications** | À chaque commande : email (Resend), webhook (Slack/Zapier), lien WhatsApp, et log console — voir `lib/notify.js`. |

## Adaptation Tunisie & devise

Tout est centralisé dans **`lib/config.js`** et pilotable par variables d'environnement — **aucun changement de code** :

- `NEXT_PUBLIC_CURRENCY_CODE` / `_SYMBOL` / `_DECIMALS` / `_POSITION` → format `5,500 TND` (ou `5,500 د.ت`).
- `NEXT_PUBLIC_LOCALE` (`fr-TN`, prêt pour `ar-TN` / `en`) — voir `lib/i18n.js` (bascule RTL automatique pour l'arabe).
- `NEXT_PUBLIC_TIMEZONE=Africa/Tunis`, dates au format `JJ/MM/AAAA`.
- Téléphone validé : 8 chiffres ou `+216…` (`lib/validation.js`).
- Gouvernorats tunisiens dans le formulaire (`lib/config.js`).

Les prix sont **toujours recalculés côté serveur** depuis la base à la validation — le client ne peut pas les falsifier.

## Évolutions prévues (architecture prête)

- **Paiement en ligne** : ajouter une route `/api/checkout` (Stripe/Flouci/…) ; le modèle `Order` a déjà un `status` et un `total`.
- **Frais de livraison** : `NEXT_PUBLIC_DELIVERY_FEE` (en TND) déjà pris en compte dans les totaux.
- **Multilingue** : compléter les dictionnaires `ar` / `en` dans `lib/i18n.js`.
- **Postgres** : changer `provider` + `DATABASE_URL`.

## Structure

```
app/
  page.jsx                 Accueil (hero + catalogue)
  panier/                  Panier
  commande/                Formulaire + confirmation
  admin/                   Tableau de bord propriétaire
  api/
    orders/                Création de commande (+ recalcul prix serveur)
    admin/                 Login, statut commande, gestion jus
components/                Navbar, Footer, JuiceCard, MapPicker, admin/*
lib/
  config.js                Devise, locale, fuseau, gouvernorats
  format.js                formatPrice (TND), formatDate (JJ/MM/AAAA)
  validation.js            Schéma commande + téléphone tunisien
  notify.js                Notification propriétaire multi-canal
  i18n.js                  FR (AR/EN prêts)
  cart-context.jsx         Panier (localStorage)
prisma/
  schema.prisma            Juice, JuiceFormat, Order, OrderItem
  seed.mjs                 6 jus de départ
```
