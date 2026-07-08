import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { STATUS_ORDER } from "@/lib/format";

// PATCH /api/admin/orders/:id — met à jour le statut d'une commande.
export async function PATCH(req, { params }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const { id } = await params;
  const { status } = await req.json().catch(() => ({}));

  if (!STATUS_ORDER.includes(status)) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  const updated = await prisma.order.update({
    where: { id },
    data: { status },
  });
  return NextResponse.json({ ok: true, status: updated.status });
}
