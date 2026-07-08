import { PrismaClient } from "@prisma/client";

// Réutilise l'instance en dev pour éviter d'épuiser les connexions au hot-reload.
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
