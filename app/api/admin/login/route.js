import { NextResponse } from "next/server";
import { signIn, signOut } from "@/lib/auth";

export async function POST(req) {
  const { password } = await req.json().catch(() => ({}));
  const ok = await signIn(password || "");
  if (!ok) {
    return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await signOut();
  return NextResponse.json({ ok: true });
}
