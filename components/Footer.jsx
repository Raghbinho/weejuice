export default function Footer() {
  return (
    <footer className="border-t border-brand-100 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-extrabold">
            <span className="text-xl">🧃</span> WeeJuice
          </div>
          <p className="mt-2 max-w-xs text-sm text-slate-500">
            Des jus 100% naturels, pressés à la commande et livrés frais chez vous.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-700">Infos</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li>💚 100% naturel, sans conservateur</li>
            <li>🚚 Livraison à domicile</li>
            <li>💵 Paiement à la livraison</li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-700">Contact</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li>Du lundi au samedi, 9h–19h</li>
            <li>Commandez en ligne 24h/24</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-brand-50 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} WeeJuice — Fait avec 🍓🍋🥝
      </div>
    </footer>
  );
}
