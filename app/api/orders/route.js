import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { orderSchema, normalizePhone } from "@/lib/validation";
import { notifyOwner } from "@/lib/notify";

// Génère une référence courte lisible : WJ-XXXXX
function makeReference() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 5; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `WJ-${s}`;
}

// POST /api/orders — crée une commande.
// Sécurité : les prix sont TOUJOURS recalculés côté serveur depuis la base,
// jamais pris depuis le client.
export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json(
      { error: "Veuillez corriger les champs indiqués.", fieldErrors },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Récupère les formats commandés depuis la base pour vérifier prix + disponibilité.
  const formatIds = [...new Set(data.items.map((i) => i.formatId))];
  const formats = await prisma.juiceFormat.findMany({
    where: { id: { in: formatIds } },
    include: { juice: true },
  });
  const byId = new Map(formats.map((f) => [f.id, f]));

  const orderItems = [];
  for (const item of data.items) {
    const fmt = byId.get(item.formatId);
    if (!fmt || fmt.juiceId !== item.juiceId) {
      return NextResponse.json(
        { error: "Un article de votre panier n'est plus disponible." },
        { status: 409 }
      );
    }
    if (!fmt.juice.active) {
      return NextResponse.json(
        { error: `Le jus « ${fmt.juice.name} » n'est plus disponible.` },
        { status: 409 }
      );
    }
    const lineTotal = Math.round(fmt.price * item.quantity * 1000) / 1000;
    orderItems.push({
      juiceName: fmt.juice.name,
      formatLabel: fmt.label,
      liters: fmt.liters,
      unitPrice: fmt.price,
      quantity: item.quantity,
      lineTotal,
    });
  }

  const total =
    Math.round(orderItems.reduce((s, it) => s + it.lineTotal, 0) * 1000) / 1000;

  // Génère une référence unique (réessaie en cas de collision improbable).
  let reference = makeReference();
  for (let attempt = 0; attempt < 5; attempt++) {
    const exists = await prisma.order.findUnique({ where: { reference } });
    if (!exists) break;
    reference = makeReference();
  }

  const order = await prisma.order.create({
    data: {
      reference,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: normalizePhone(data.phone),
      gouvernorat: data.gouvernorat,
      city: data.city,
      address: data.address,
      note: data.note || null,
      lat: data.lat ?? null,
      lng: data.lng ?? null,
      total,
      status: "NOUVELLE",
      items: { create: orderItems },
    },
    include: { items: true },
  });

  // Notifie le propriétaire (email / webhook / whatsapp / console). Non bloquant.
  notifyOwner(order).catch((e) => console.error("[notify] échec :", e));

  return NextResponse.json({ ok: true, reference: order.reference });
}
