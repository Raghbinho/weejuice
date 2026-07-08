"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      window.location.reload();
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Erreur.");
      setLoading(false);
    }
  }

  return (
    <div className="bg-fruity flex min-h-[70vh] items-center justify-center px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-3xl border border-slate-100 bg-white p-8 shadow-xl"
      >
        <div className="text-center">
          <div className="text-4xl">🔐</div>
          <h1 className="mt-3 font-display text-2xl font-extrabold text-slate-900">
            Espace propriétaire
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Connectez-vous pour gérer les commandes et les jus.
          </p>
        </div>

        <label className="mt-6 block">
          <span className="text-sm font-medium text-slate-700">Mot de passe</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
            placeholder="••••••••"
            autoFocus
          />
        </label>

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-full bg-brand-500 py-3 font-semibold text-white shadow transition hover:bg-brand-600 disabled:opacity-60"
        >
          {loading ? "Connexion…" : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
