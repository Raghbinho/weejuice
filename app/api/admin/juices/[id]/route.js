import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

// PATCH /api/admin/juices/:id
// Corps possible :
//   { active: boolean }                     -> activer/désactiver le jus
//   { name, description }                    -> modifier les infos
//   { formats: [{ id, price }] }             -> modifier les prix par format
export async function PATCH(req, { params }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const data = {};
  if (typeof body.active === "boolean") data.active = body.active;
  if (typeof body.name === "string" && body.name.trim()) data.name = body.name.trim();
  if (typeof body.description === "string") data.description = body.description.trim();

  if (Object.keys(data).length) {
    await prisma.juice.update({ where: { id }, data });
  }

  // Mise à jour des prix par format (validés : nombre positif, arrondi millimes).
  if (Array.isArray(body.formats)) {
    for (const f of body.formats) {
      if (!f.id) continue;
      const price = Number(f.price);
      if (!Number.isFinite(price) || price < 0) continue;
      await prisma.juiceFormat.update({
        where: { id: f.id },
        data: { price: Math.round(price * 1000) / 1000 },
      });
    }
  }

  const juice = await prisma.juice.findUnique({
    where: { id },
    include: { formats: { orderBy: { sortOrder: "asc" } } },
  });
  return NextResponse.json({ ok: true, juice });
}
