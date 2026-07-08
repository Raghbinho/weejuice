"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function Navbar() {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-brand-100 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-extrabold">
          <span className="text-2xl">🧃</span>
          <span className="bg-gradient-to-r from-brand-500 to-juice-orange bg-clip-text text-transparent">
            WeeJuice
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-3">
          <Link
            href="/#catalogue"
            className="hidden rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-brand-50 hover:text-brand-700 sm:block"
          >
            Nos jus
          </Link>
          <Link
            href="/admin"
            className="hidden rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-brand-50 hover:text-brand-700 sm:block"
          >
            Admin
          </Link>
          <Link
            href="/panier"
            className="relative flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600"
          >
            <span>🛒</span>
            <span className="hidden sm:inline">Panier</span>
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 animate-pop items-center justify-center rounded-full bg-juice-strawberry px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
