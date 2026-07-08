"use client";

import { useMemo, useState } from "react";
import { formatPrice, formatDate, STATUSES, STATUS_ORDER } from "@/lib/format";

export default function AdminDashboard({ initialOrders, initialJuices }) {
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState(initialOrders);
  const [juices, setJuices] = useState(initialJuices);

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    window.location.reload();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-slate-900">
            Tableau de bord
          </h1>
          <p className="text-sm text-slate-500">Gérez vos commandes et vos jus.</p>
        </div>
        <button
          onClick={logout}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300"
        >
          Se déconnecter
        </button>
      </div>

      {/* Onglets */}
      <div className="mt-6 flex gap-2 border-b border-slate-200">
        {[
          { id: "orders", label: `Commandes (${orders.length})` },
          { id: "juices", label: `Jus (${juices.length})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
              tab === t.id
                ? "border-brand-500 text-brand-600"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "orders" ? (
          <OrdersPanel orders={orders} setOrders={setOrders} />
        ) : (
          <JuicesPanel juices={juices} setJuices={setJuices} />
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────── Commandes ─────────────────────────── */

function OrdersPanel({ orders, setOrders }) {
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState(null);

  const counts = useMemo(() => {
    const c = { ALL: orders.length };
    for (const s of STATUS_ORDER) c[s] = orders.filter((o) => o.status === s).length;
    return c;
  }, [orders]);

  const visible = orders.filter((o) => filter === "ALL" || o.status === filter);

  async function changeStatus(id, status) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    if (selected?.id === id) setSelected((s) => ({ ...s, status }));
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  if (orders.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-slate-400">
        Aucune commande pour le moment.
      </p>
    );
  }

  return (
    <div>
      {/* Filtres par statut */}
      <div className="mb-4 flex flex-wrap gap-2">
        <FilterChip active={filter === "ALL"} onClick={() => setFilter("ALL")}>
          Toutes ({counts.ALL})
        </FilterChip>
        {STATUS_ORDER.map((s) => (
          <FilterChip key={s} active={filter === s} onClick={() => setFilter(s)}>
            {STATUSES[s].label} ({counts[s]})
          </FilterChip>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3">Réf.</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Ville</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {visible.map((o) => (
              <tr key={o.id} className="border-b border-slate-50 last:border-0">
                <td className="px-4 py-3 font-mono font-semibold text-brand-600">
                  {o.reference}
                </td>
                <td className="px-4 py-3">
                  {o.firstName} {o.lastName}
                  <div className="text-xs text-slate-400">{o.phone}</div>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {o.city}
                  <div className="text-xs text-slate-400">{o.gouvernorat}</div>
                </td>
                <td className="px-4 py-3 font-semibold">{formatPrice(o.total)}</td>
                <td className="px-4 py-3 text-slate-500">{formatDate(o.createdAt)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={o.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setSelected(o)}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-200"
                  >
                    Détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <OrderDetail
          order={selected}
          onClose={() => setSelected(null)}
          onStatus={(s) => changeStatus(selected.id, s)}
        />
      )}
    </div>
  );
}

function OrderDetail({ order, onClose, onStatus }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-xl font-extrabold text-slate-900">
              Commande {order.reference}
            </h2>
            <p className="text-sm text-slate-400">{formatDate(order.createdAt)}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm">
          <Row label="Client">
            {order.firstName} {order.lastName}
          </Row>
          <Row label="Téléphone">
            <a href={`tel:${order.phone}`} className="text-brand-600 underline">
              {order.phone}
            </a>
          </Row>
          <Row label="Adresse">
            {order.address}
            <div className="text-slate-400">
              {order.city}, {order.gouvernorat}
            </div>
            {order.lat && order.lng && (
              <a
                href={`https://www.google.com/maps?q=${order.lat},${order.lng}`}
                target="_blank"
                rel="noreferrer"
                className="text-brand-600 underline"
              >
                Voir sur la carte
              </a>
            )}
          </Row>
          {order.note && <Row label="Note">{order.note}</Row>}
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-semibold text-slate-700">Articles</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {order.items.map((it) => (
              <li key={it.id} className="flex justify-between">
                <span className="text-slate-600">
                  {it.quantity} × {it.juiceName}{" "}
                  <span className="text-slate-400">({it.formatLabel})</span>
                </span>
                <span className="font-medium">{formatPrice(it.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-dashed border-slate-200 pt-3 text-base font-extrabold">
            <span>Total</span>
            <span className="font-display">{formatPrice(order.total)}</span>
          </div>
          <div className="mt-2 text-center text-xs font-semibold text-brand-700">
            💵 Paiement à la livraison
          </div>
        </div>

        <div className="mt-5">
          <h3 className="text-sm font-semibold text-slate-700">Changer le statut</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {STATUS_ORDER.map((s) => (
              <button
                key={s}
                onClick={() => onStatus(s)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  order.status === s
                    ? STATUSES[s].color + " ring-2 ring-offset-1 ring-slate-300"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {STATUSES[s].label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Jus ─────────────────────────── */

function JuicesPanel({ juices, setJuices }) {
  async function patch(id, payload) {
    const res = await fetch(`/api/admin/juices/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.juice) {
      setJuices((prev) => prev.map((j) => (j.id === id ? data.juice : j)));
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {juices.map((j) => (
        <JuiceEditor key={j.id} juice={j} onPatch={patch} />
      ))}
    </div>
  );
}

function JuiceEditor({ juice, onPatch }) {
  const [prices, setPrices] = useState(
    Object.fromEntries(juice.formats.map((f) => [f.id, String(f.price)]))
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function savePrices() {
    setSaving(true);
    setSaved(false);
    await onPatch(juice.id, {
      formats: juice.formats.map((f) => ({ id: f.id, price: prices[f.id] })),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div
      className={`rounded-2xl border bg-white p-4 shadow-sm transition ${
        juice.active ? "border-slate-100" : "border-slate-200 opacity-70"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className="h-12 w-12 shrink-0 overflow-hidden rounded-xl"
          style={{ backgroundColor: juice.color + "22" }}
        >
          <img src={juice.image} alt={juice.name} className="h-full w-full object-cover" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-800">{juice.name}</h3>
          <span
            className={`text-xs font-medium ${
              juice.active ? "text-brand-600" : "text-slate-400"
            }`}
          >
            {juice.active ? "● Disponible" : "○ Désactivé"}
          </span>
        </div>
        <label className="inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={juice.active}
            onChange={(e) => onPatch(juice.id, { active: e.target.checked })}
            className="peer sr-only"
          />
          <div className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:ml-0.5 after:mt-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-brand-500 peer-checked:after:translate-x-5 relative" />
        </label>
      </div>

      <div className="mt-4 space-y-2">
        {juice.formats.map((f) => (
          <div key={f.id} className="flex items-center justify-between gap-2">
            <span className="text-sm text-slate-500">{f.label}</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                step="0.001"
                min="0"
                value={prices[f.id]}
                onChange={(e) =>
                  setPrices((p) => ({ ...p, [f.id]: e.target.value }))
                }
                className="w-24 rounded-lg border border-slate-200 px-2 py-1.5 text-right text-sm outline-none focus:border-brand-400"
              />
              <span className="text-xs text-slate-400">TND</span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={savePrices}
        disabled={saving}
        className={`mt-3 w-full rounded-full py-2 text-sm font-semibold text-white transition ${
          saved ? "bg-brand-600" : "bg-brand-500 hover:bg-brand-600"
        } disabled:opacity-60`}
      >
        {saving ? "Enregistrement…" : saved ? "✓ Prix enregistrés" : "Enregistrer les prix"}
      </button>
    </div>
  );
}

/* ─────────────────────────── UI utils ─────────────────────────── */

function FilterChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
        active
          ? "bg-brand-500 text-white shadow"
          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }) {
  const s = STATUSES[status] || STATUSES.NOUVELLE;
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${s.color}`}>
      {s.label}
    </span>
  );
}

function Row({ label, children }) {
  return (
    <div className="grid grid-cols-[90px_1fr] gap-2">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-700">{children}</span>
    </div>
  );
}
