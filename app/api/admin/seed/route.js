import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runSeed } from "@/lib/seed-data";

// Route de seed à usage unique après déploiement.
// Protégée par SEED_SECRET (variable d'environnement).
//
// Utilisation :
//   https://<ton-site>.vercel.app/api/admin/seed?secret=LE_SECRET
//
// Idempotente : peut être rappelée sans créer de doublons.
export async function GET(req) {
  const secret = new URL(req.url).searchParams.get("secret");

  if (!process.env.SEED_SECRET) {
    return NextResponse.json(
      { error: "SEED_SECRET n'est pas configuré sur le serveur." },
      { status: 500 }
    );
  }
  if (secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Secret invalide." }, { status: 401 });
  }

  try {
    const count = await runSeed(prisma);
    return NextResponse.json({
      ok: true,
      message: `${count} jus créés/mis à jour.`,
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Échec du seed.", detail: String(e) },
      { status: 500 }
    );
  }
}
