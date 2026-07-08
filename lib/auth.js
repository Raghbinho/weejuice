import { cookies } from "next/headers";

// Authentification admin minimale par mot de passe partagé (cookie httpOnly).
// Le mot de passe est défini via ADMIN_PASSWORD (.env). Défaut en dev : "admin".
// Évolutif : remplacer plus tard par un vrai système de comptes si besoin.

const COOKIE = "wj_admin";

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "admin";
}

// Jeton = mot de passe encodé. Suffisant pour un back-office mono-utilisateur.
function token() {
  return Buffer.from(getAdminPassword()).toString("base64");
}

export async function isAdmin() {
  const store = await cookies();
  return store.get(COOKIE)?.value === token();
}

export async function signIn(password) {
  if (password !== getAdminPassword()) return false;
  const store = await cookies();
  store.set(COOKIE, token(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 jours
  });
  return true;
}

export async function signOut() {
  const store = await cookies();
  store.delete(COOKIE);
}
