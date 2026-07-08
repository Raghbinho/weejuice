"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { CONFIG, GOUVERNORATS } from "@/lib/config";
import { isValidTunisianPhone } from "@/lib/validation";

// Carte chargée uniquement côté client (Leaflet manipule le DOM).
const MapPicker = dynamic(() => import("@/components/MapPicker"), { ssr: false });

const EMPTY = {
  firstName: "",
  lastName: "",
  phone: "",
  gouvernorat: "",
  city: "",
  address: "",
  note: "",
};

export default function CommandePage() {
  const { items, total, count, clear } = useCart();
  const router = useRouter();

  const [form, setForm] = useState(EMPTY);
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [showMap, setShowMap] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  function set(field, val) {
    setForm((f) => ({ ...f, [field]: val }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Le prénom est requis";
    if (!form.lastName.trim()) e.lastName = "Le nom est requis";
    if (!form.phone.trim()) e.phone = "Le téléphone est requis";
    else if (!isValidTunisianPhone(form.phone))
      e.phone = "Numéro tunisien invalide (ex : 20 123 456 ou +216 20 123 456)";
    if (!form.gouvernorat) e.gouvernorat = "Sélectionnez un gouvernorat";
    if (!form.city.trim()) e.city = "La ville est requise";
    if (form.address.trim().length < 5) e.address = "Adresse trop courte";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setServerError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          lat: coords.lat,
          lng: coords.lng,
          items: items.map((l) => ({
            juiceId: l.juiceId,
            formatId: l.formatId,
            quantity: l.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error || "Une erreur est survenue.");
        if (data.fieldErrors) setErrors(data.fieldErrors);
        setSubmitting(false);
        return;
      }

      clear();
      router.push(`/commande/confirmation?ref=${data.reference}`);
    } catch {
      setServerError("Impossible de contacter le serveur. Réessayez.");
      setSubmitting(false);
    }
  }

  if (count === 0 && !submitting) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="text-6xl">🧃</div>
        <h1 className="mt-4 font-display text-2xl font-extrabold text-slate-800">
          Aucun article à commander
        </h1>
        <Link
          href="/#catalogue"
          className="mt-6 inline-block rounded-full bg-brand-500 px-7 py-3 font-semibold text-white shadow transition hover:bg-brand-600"
        >
          Découvrir nos jus
        </Link>
      </div>
    );
  }

  const grandTotal = total + CONFIG.delivery.fee;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-3xl font-extrabold text-slate-900">
        Finaliser la commande
      </h1>
      <p className="mt-1 text-slate-500">
        Renseignez vos coordonnées. Paiement à la livraison, aucun paiement en ligne.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]"
      >
        {/* Champs */}
        <div className="space-y-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Prénom" error={errors.firstName} required>
              <input
                className={inputCls(errors.firstName)}
                value={form.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                placeholder="Amine"
              />
            </Field>
            <Field label="Nom" error={errors.lastName} required>
              <input
                className={inputCls(errors.lastName)}
                value={form.lastName}
                onChange={(e) => set("lastName", e.target.value)}
                placeholder="Ben Salah"
              />
            </Field>
          </div>

          <Field
            label="Téléphone"
            error={errors.phone}
            required
            hint="Format tunisien : 8 chiffres ou +216…"
          >
            <div className="flex">
              <span className="flex items-center rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 px-3 text-sm text-slate-500">
                {CONFIG.country.dialCode}
              </span>
              <input
                className={inputCls(errors.phone) + " rounded-l-none"}
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="20 123 456"
                inputMode="tel"
              />
            </div>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Gouvernorat" error={errors.gouvernorat} required>
              <select
                className={inputCls(errors.gouvernorat)}
                value={form.gouvernorat}
                onChange={(e) => set("gouvernorat", e.target.value)}
              >
                <option value="">— Choisir —</option>
                {GOUVERNORATS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Ville / Délégation" error={errors.city} required>
              <input
                className={inputCls(errors.city)}
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder="La Marsa"
              />
            </Field>
          </div>

          <Field
            label="Adresse complète"
            error={errors.address}
            required
            hint="Rue, numéro, immeuble, étage, points de repère…"
          >
            <textarea
              rows={3}
              className={inputCls(errors.address)}
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="12 Rue de la Liberté, résidence Yasmine, 2e étage"
            />
          </Field>

          <Field label="Note pour le livreur (optionnel)">
            <textarea
              rows={2}
              className={inputCls()}
              value={form.note}
              onChange={(e) => set("note", e.target.value)}
              placeholder="Appelez à l'arrivée, digicode 45B…"
            />
          </Field>

          {/* Carte optionnelle */}
          <div>
            <button
              type="button"
              onClick={() => setShowMap((s) => !s)}
              className="text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              {showMap ? "− Masquer la carte" : "📍 Localiser sur la carte (optionnel)"}
            </button>
            {showMap && (
              <div className="mt-3">
                <MapPicker
                  value={coords}
                  onChange={(c) => setCoords(c)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Récapitulatif */}
        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="font-display text-lg font-bold text-slate-800">
              Votre commande
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              {items.map((l, i) => (
                <li key={i} className="flex justify-between gap-2">
                  <span className="text-slate-600">
                    {l.quantity} × {l.juiceName}{" "}
                    <span className="text-slate-400">({l.formatLabel})</span>
                  </span>
                  <span className="font-medium text-slate-700">
                    {formatPrice(l.quantity * l.unitPrice)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="my-4 border-t border-dashed border-slate-200" />
            <div className="flex justify-between text-sm text-slate-500">
              <span>Sous-total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-500">
              <span>Livraison</span>
              <span>
                {CONFIG.delivery.fee > 0
                  ? formatPrice(CONFIG.delivery.fee)
                  : "À convenir"}
              </span>
            </div>
            <div className="mt-3 flex justify-between text-lg font-extrabold text-slate-900">
              <span>Total</span>
              <span className="font-display">{formatPrice(grandTotal)}</span>
            </div>

            <div className="mt-4 rounded-xl bg-brand-50 p-3 text-center text-sm font-semibold text-brand-700">
              💵 Paiement à la livraison
            </div>

            {serverError && (
              <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-4 w-full rounded-full bg-brand-500 py-3.5 font-semibold text-white shadow transition hover:bg-brand-600 disabled:opacity-60"
            >
              {submitting ? "Envoi…" : "Confirmer la commande"}
            </button>
            <Link
              href="/panier"
              className="mt-3 block text-center text-sm text-slate-400 hover:text-slate-600"
            >
              ← Retour au panier
            </Link>
          </div>
        </aside>
      </form>
    </div>
  );
}

function inputCls(error) {
  return `w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-brand-200 ${
    error ? "border-red-400" : "border-slate-200 focus:border-brand-400"
  }`;
}

function Field({ label, error, required, hint, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-400">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint && !error && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
}
