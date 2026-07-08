import { prisma } from "./prisma.js";

// Jus actifs avec leurs formats, triés — utilisé par la vitrine.
export async function getActiveJuices() {
  return prisma.juice.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
    include: { formats: { orderBy: { sortOrder: "asc" } } },
  });
}

// Tous les jus (admin).
export async function getAllJuices() {
  return prisma.juice.findMany({
    orderBy: { sortOrder: "asc" },
    include: { formats: { orderBy: { sortOrder: "asc" } } },
  });
}
