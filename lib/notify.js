import { formatPrice, formatDate } from "./format.js";

// Notification du propriétaire après une nouvelle commande.
//
// Architecture évolutive : cette fonction essaie plusieurs canaux selon la
// configuration (.env). Aucune clé n'est requise pour démarrer — dans ce cas
// la commande reste consultable dans le tableau d'administration, et un
// message est simplement écrit dans la console du serveur.
//
// Canaux supportés :
//   - Email        (Resend)     : RESEND_API_KEY + OWNER_EMAIL + FROM_EMAIL
//   - WhatsApp/SMS (lien)        : OWNER_WHATSAPP  -> génère un lien wa.me loggé
//   - Webhook      (générique)   : OWNER_WEBHOOK_URL (Slack, Zapier, n8n...)

export function buildOrderMessage(order) {
  const lines = order.items.map(
    (it) =>
      `• ${it.quantity} × ${it.juiceName} (${it.formatLabel}) — ${formatPrice(
        it.lineTotal
      )}`
  );

  return [
    `🧃 Nouvelle commande ${order.reference}`,
    ``,
    `Client : ${order.firstName} ${order.lastName}`,
    `Téléphone : ${order.phone}`,
    `Gouvernorat : ${order.gouvernorat}`,
    `Ville : ${order.city}`,
    `Adresse : ${order.address}`,
    order.lat && order.lng
      ? `Localisation : https://www.google.com/maps?q=${order.lat},${order.lng}`
      : null,
    order.note ? `Note : ${order.note}` : null,
    ``,
    `Commande :`,
    ...lines,
    ``,
    `TOTAL : ${formatPrice(order.total)}`,
    `Paiement : à la livraison`,
    `Date : ${formatDate(order.createdAt)}`,
  ]
    .filter((l) => l !== null)
    .join("\n");
}

export async function notifyOwner(order) {
  const message = buildOrderMessage(order);
  const results = [];

  // 1) Email via Resend (HTTP, aucune dépendance requise)
  if (process.env.RESEND_API_KEY && process.env.OWNER_EMAIL) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.FROM_EMAIL || "WeeJuice <onboarding@resend.dev>",
          to: [process.env.OWNER_EMAIL],
          subject: `🧃 Nouvelle commande ${order.reference} — ${formatPrice(
            order.total
          )}`,
          text: message,
        }),
      });
      results.push({ channel: "email", ok: res.ok });
    } catch (e) {
      results.push({ channel: "email", ok: false, error: String(e) });
    }
  }

  // 2) Webhook générique (Slack / Zapier / n8n / Make...)
  if (process.env.OWNER_WEBHOOK_URL) {
    try {
      const res = await fetch(process.env.OWNER_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message, order }),
      });
      results.push({ channel: "webhook", ok: res.ok });
    } catch (e) {
      results.push({ channel: "webhook", ok: false, error: String(e) });
    }
  }

  // 3) WhatsApp : on génère un lien cliquable (loggé). Pour un envoi automatique
  //    réel, brancher l'API WhatsApp Business plus tard.
  if (process.env.OWNER_WHATSAPP) {
    const link = `https://wa.me/${process.env.OWNER_WHATSAPP.replace(
      /\D/g,
      ""
    )}?text=${encodeURIComponent(message)}`;
    console.log(`[notify] WhatsApp : ${link}`);
    results.push({ channel: "whatsapp", ok: true, link });
  }

  // Toujours logger : garantit qu'aucune commande ne passe inaperçue même sans config.
  if (results.length === 0) {
    console.log(
      "\n──────── NOUVELLE COMMANDE ────────\n" +
        message +
        "\n───────────────────────────────────\n"
    );
  }

  return results;
}
