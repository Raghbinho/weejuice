import JuiceCard from "@/components/JuiceCard";
import { getActiveJuices } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const juices = await getActiveJuices();

  return (
    <div>
      {/* EN-TÊTE COMPACT — message clé + accès direct aux produits */}
      <section className="bg-fruity border-b border-brand-100">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center sm:py-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand-700 shadow-sm">
            💚 100% naturel · Pressé à la commande
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Nos jus{" "}
            <span className="bg-gradient-to-r from-juice-strawberry via-juice-orange to-brand-500 bg-clip-text text-transparent">
              frais
            </span>
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-slate-600">
            Fruits pressés minute, livrés frais partout en Tunisie. Choisissez votre
            format, ajoutez au panier — paiement à la livraison.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
            <span className="flex items-center gap-2">🍓 Fruits sélectionnés</span>
            <span className="flex items-center gap-2">🚚 Livraison rapide</span>
            <span className="flex items-center gap-2">💵 Paiement à la livraison</span>
          </div>
        </div>
      </section>

      {/* CATALOGUE — liste des produits directement */}
      <section id="catalogue" className="mx-auto max-w-6xl px-4 py-10">
        {juices.length === 0 ? (
          <p className="text-center text-slate-500">
            Aucun jus disponible pour le moment. Revenez bientôt 🍹
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {juices.map((j) => (
              <JuiceCard key={j.id} juice={j} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
