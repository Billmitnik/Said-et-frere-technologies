import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

type PrismaGlobal = typeof globalThis & {
  saidFreresPrisma?: PrismaClient;
  saidFreresAdminPrisma?: PrismaClient;
};

const globalForPrisma = globalThis as PrismaGlobal;

function createClient(connectionString: string) {
  return new PrismaClient({
    adapter: new PrismaPg({
      connectionString,
      max: 5,
      // Neon suspends idle databases; waking one can take several seconds.
      connectionTimeoutMillis: 15_000,
    }),
  });
}

/** Read-only connection used by the public site. */
export function getPrisma(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required before connecting to PostgreSQL.");
  }

  globalForPrisma.saidFreresPrisma ??= createClient(connectionString);
  return globalForPrisma.saidFreresPrisma;
}

/** Connection allowed to write products, photos and sign-in attempts. Admin code only. */
export function getAdminPrisma(): PrismaClient {
  const connectionString = process.env.ADMIN_DATABASE_URL;
  if (!connectionString) {
    throw new Error("ADMIN_DATABASE_URL is required for the admin pages.");
  }

  globalForPrisma.saidFreresAdminPrisma ??= createClient(connectionString);
  return globalForPrisma.saidFreresAdminPrisma;
}
