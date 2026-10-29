import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

type PrismaGlobal = typeof globalThis & {
  saidFreresPrisma?: PrismaClient;
};

const globalForPrisma = globalThis as PrismaGlobal;

export function getPrisma(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required before connecting to PostgreSQL.");
  }

  if (!globalForPrisma.saidFreresPrisma) {
    globalForPrisma.saidFreresPrisma = new PrismaClient({
      adapter: new PrismaPg({
        connectionString,
        max: 5,
        connectionTimeoutMillis: 5_000,
      }),
    });
  }

  return globalForPrisma.saidFreresPrisma;
}
