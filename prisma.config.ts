import "dotenv/config";
import { defineConfig } from "prisma/config";

const localDevelopmentUrl =
  "postgresql://postgres:postgres@localhost:5432/said_freres?schema=public";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DIRECT_URL ?? localDevelopmentUrl,
  },
});
