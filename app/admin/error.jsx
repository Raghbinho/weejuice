"use client";

// Error boundary temporaire pour /admin : affiche le message d'erreur réel
// au lieu de l'écran générique, afin de diagnostiquer le crash en production.
export default function AdminError({ error, reset }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-display text-2xl font-extrabold text-red-600">
        Erreur admin (diagnostic)
      </h1>
      <pre className="mt-4 overflow-x-auto rounded-xl bg-red-50 p-4 text-xs text-red-700">
        {String(error?.message || error)}
        {error?.digest ? `\n\ndigest: ${error.digest}` : ""}
        {error?.stack ? `\n\n${error.stack}` : ""}
      </pre>
      <button
        onClick={reset}
        className="mt-4 rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold"
      >
        Réessayer
      </button>
    </div>
  );
}
