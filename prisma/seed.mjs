import { PrismaClient } from "@prisma/client";
import { runSeed } from "../lib/seed-data.js";

const prisma = new PrismaClient();

runSeed(prisma)
  .then((n) => console.log(`✅ Seed terminé : ${n} jus créés/mis à jour.`))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
