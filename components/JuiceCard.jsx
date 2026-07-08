"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";

export default function JuiceCard({ juice }) {
  const { add } = useCart();
  const formats = juice.formats;
  // Format sélectionné par défaut : le 1 L si présent, sinon le premier.
  const [formatId, setFormatId] = useState(
    (formats.find((f) => f.liters === 1) || formats[0])?.id
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const selected = formats.find((f) => f.id === formatId) || formats[0];
  const lineTotal = selected ? selected.price * quantity : 0;

  function handleAdd() {
    if (!selected) return;
    add({
      juiceId: juice.id,
      juiceName: juice.name,
      formatId: selected.id,
      formatLabel: selected.label,
      liters: selected.liters,
      unitPrice: selected.price,
      quantity,
      image: juice.image,
      color: juice.color,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ backgroundColor: juice.color + "22" }}
        />
        {/* Image de fruit (chargée en lazy) */}
        <img
          src={juice.image}
          alt={juice.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span
          className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold text-white shadow"
          style={{ backgroundColor: juice.color }}
        >
          Frais du jour
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold text-slate-800">{juice.name}</h3>
        <p className="mt-1 flex-1 text-sm text-slate-500">{juice.description}</p>

        {/* Sélecteur de format */}
        <div className="mt-4">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Format
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {formats.map((f) => {
              const isSel = f.id === selected?.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFormatId(f.id)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                    isSel
                      ? "border-transparent text-white shadow"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                  style={isSel ? { backgroundColor: juice.color } : {}}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quantité + prix live */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center rounded-full border border-slate-200">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-l-full text-lg text-slate-500 transition hover:bg-slate-50"
              aria-label="Diminuer la quantité"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(99, q + 1))}
              className="flex h-9 w-9 items-center justify-center rounded-r-full text-lg text-slate-500 transition hover:bg-slate-50"
              aria-label="Augmenter la quantité"
            >
              +
            </button>
          </div>
          <div className="text-right">
            <div className="font-display text-xl font-extrabold text-slate-800">
              {formatPrice(lineTotal)}
            </div>
            <div className="text-xs text-slate-400">{formatPrice(selected?.price)} / unité</div>
          </div>
        </div>

        <button
          onClick={handleAdd}
          className={`mt-4 w-full rounded-full py-3 text-sm font-semibold text-white shadow-sm transition ${
            added ? "bg-brand-600" : "bg-brand-500 hover:bg-brand-600"
          }`}
        >
          {added ? "✓ Ajouté au panier" : "Ajouter au panier"}
        </button>
      </div>
    </article>
  );
}
