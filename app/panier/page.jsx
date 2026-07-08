"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { CONFIG } from "@/lib/config";

export default function CartPage() {
  const { items, total, count, setQty, remove, lineKey } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="text-7xl">🛒</div>
        <h1 className="mt-4 font-display text-2xl font-extrabold text-slate-800">
          Votre panier est vide
        </h1>
        <p className="mt-2 text-slate-500">
          Ajoutez quelques jus frais et revenez ici pour commander.
        </p>
        <Link
          href="/#catalogue"
          className="mt-6 inline-block rounded-full bg-brand-500 px-7 py-3 font-semibold text-white shadow transition hover:bg-brand-600"
        >
          Découvrir nos jus
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-3xl font-extrabold text-slate-900">
        Votre panier
        <span className="ml-2 text-base font-medium text-slate-400">
          ({count} article{count > 1 ? "s" : ""})
        </span>
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Lignes du panier */}
        <ul className="space-y-4">
          {items.map((l) => {
            const key = lineKey(l);
            return (
              <li
                key={key}
                className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
              >
                <div
                  className="h-20 w-20 shrink-0 overflow-hidden rounded-xl"
                  style={{ backgroundColor: (l.color || "#eee") + "22" }}
                >
                  {l.image && (
                    <img
                      src={l.image}
                      alt={l.juiceName}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-800">{l.juiceName}</h3>
                      <p className="text-sm text-slate-400">{l.formatLabel}</p>
                    </div>
                    <button
                      onClick={() => remove(key)}
                      className="text-sm text-slate-400 transition hover:text-red-500"
                      aria-label="Supprimer"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center rounded-full border border-slate-200">
                      <button
                        onClick={() => setQty(key, l.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-l-full text-slate-500 hover:bg-slate-50"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">
                        {l.quantity}
                      </span>
                      <button
                        onClick={() => setQty(key, Math.min(99, l.quantity + 1))}
                        className="flex h-8 w-8 items-center justify-center rounded-r-full text-slate-500 hover:bg-slate-50"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-display font-bold text-slate-800">
                      {formatPrice(l.quantity * l.unitPrice)}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Récapitulatif */}
        <aside className="h-fit rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:sticky lg:top-24">
          <h2 className="font-display text-lg font-bold text-slate-800">Récapitulatif</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-slate-500">
              <dt>Sous-total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
            <div className="flex justify-between text-slate-500">
              <dt>Livraison</dt>
              <dd>
                {CONFIG.delivery.fee > 0
                  ? formatPrice(CONFIG.delivery.fee)
                  : "À convenir"}
              </dd>
            </div>
            <div className="my-3 border-t border-dashed border-slate-200" />
            <div className="flex justify-between text-base font-extrabold text-slate-900">
              <dt>Total</dt>
              <dd className="font-display">{formatPrice(total + CONFIG.delivery.fee)}</dd>
            </div>
          </dl>

          <div className="mt-4 rounded-xl bg-brand-50 p-3 text-center text-sm font-semibold text-brand-700">
            💵 Paiement à la livraison
          </div>

          <Link
            href="/commande"
            className="mt-5 block rounded-full bg-brand-500 py-3 text-center font-semibold text-white shadow transition hover:bg-brand-600"
          >
            Valider la commande
          </Link>
          <Link
            href="/#catalogue"
            className="mt-3 block rounded-full border border-slate-200 py-3 text-center font-semibold text-slate-600 transition hover:border-slate-300"
          >
            Continuer mes achats
          </Link>
        </aside>
      </div>
    </div>
  );
}
