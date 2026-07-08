// Données de départ des jus (source unique partagée par le seed CLI et la
// route API /api/admin/seed). Prix en Dinar Tunisien (TND), 3 décimales.

// Arrondi à 3 décimales (millimes).
function round(n) {
  return Math.round(n * 1000) / 1000;
}

// Formats standards proposés pour chaque jus.
export function formatsFor(base) {
  return [
    { label: "0,5 L", liters: 0.5, price: round(base * 0.5), sortOrder: 0 },
    { label: "1 L", liters: 1, price: round(base), sortOrder: 1 },
    { label: "2 L", liters: 2, price: round(base * 1.9), sortOrder: 2 },
  ];
}

export const JUICES = [
  {
    slug: "fraise",
    name: "Jus de fraise",
    description: "Fraises mûres pressées à la commande, douces et parfumées.",
    color: "#f43f5e",
    image:
      "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80",
    base: 5.5,
  },
  {
    slug: "citron",
    name: "Jus de citron",
    description: "Citronnade fraîche, acidulée et désaltérante.",
    color: "#facc15",
    image:
      "https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=800&q=80",
    base: 4.5,
  },
  {
    slug: "kiwi",
    name: "Jus de kiwi",
    description: "Kiwi vert éclatant, vitaminé et légèrement acidulé.",
    color: "#84cc16",
    image:
      "https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?auto=format&fit=crop&w=800&q=80",
    base: 6,
  },
  {
    slug: "orange",
    name: "Jus d'orange",
    description: "Oranges pressées, 100% naturel, sans sucre ajouté.",
    color: "#fb923c",
    image:
      "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80",
    base: 4.5,
  },
  {
    slug: "banane",
    name: "Jus de banane",
    description: "Onctueux et gourmand, la banane veloutée à souhait.",
    color: "#fde047",
    image:
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
    base: 5,
  },
  {
    slug: "panache",
    name: "Jus panaché",
    description: "Notre mélange signature multifruits, frais et surprenant.",
    color: "#ec4899",
    image:
      "https://images.unsplash.com/photo-1615478503562-ec2d8aa0e24e?auto=format&fit=crop&w=800&q=80",
    base: 6.5,
  },
];

// Insère/actualise les jus dans la base. Idempotent (upsert par slug) :
// on peut le relancer sans créer de doublons.
export async function runSeed(prisma) {
  for (const [i, j] of JUICES.entries()) {
    await prisma.juice.upsert({
      where: { slug: j.slug },
      update: {
        name: j.name,
        description: j.description,
        color: j.color,
        image: j.image,
        sortOrder: i,
      },
      create: {
        slug: j.slug,
        name: j.name,
        description: j.description,
        color: j.color,
        image: j.image,
        sortOrder: i,
        formats: { create: formatsFor(j.base) },
      },
    });
  }
  return JUICES.length;
}
