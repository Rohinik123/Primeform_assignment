import { PrismaClient } from "@prisma/client";
import { seedDatabase } from "./seedData";

const prisma = new PrismaClient();

seedDatabase(prisma, { reset: false })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
