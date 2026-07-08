import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ConfirmationPage({ searchParams }) {
  const params = await searchParams;
  const ref = params?.ref;

  return (
    <div className="bg-fruity min-h-[70vh]">
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-500 text-4xl text-white shadow-lg shadow-brand-500/30 animate-pop">
          ✓
        </div>
        <h1 className="mt-6 font-display text-3xl font-extrabold text-slate-900">
          Merci pour votre commande !
        </h1>
        <p className="mt-3 text-slate-600">
          Votre commande a bien été enregistrée. Nous préparons vos jus frais et
          vous contactons rapidement pour la livraison.
        </p>

        {ref && (
          <div className="mt-6 inline-block rounded-2xl border border-brand-100 bg-white px-6 py-4 shadow-sm">
            <div className="text-xs uppercase tracking-wide text-slate-400">
              Référence de commande
            </div>
            <div className="mt-1 font-display text-2xl font-extrabold text-brand-600">
              {ref}
            </div>
          </div>
        )}

        <div className="mt-6 rounded-xl bg-white/70 p-4 text-sm font-semibold text-brand-700">
          💵 Paiement à la livraison — préparez le montant exact si possible.
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-brand-500 px-7 py-3 font-semibold text-white shadow transition hover:bg-brand-600"
          >
            Retour à l'accueil
          </Link>
          <Link
            href="/#catalogue"
            className="rounded-full border border-slate-200 bg-white px-7 py-3 font-semibold text-slate-700 transition hover:border-slate-300"
          >
            Commander à nouveau
          </Link>
        </div>
      </div>
    </div>
  );
}
