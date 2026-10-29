import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { productPitches, products } from "../data/products";

const connectionString = process.env.DIRECT_URL;

if (!connectionString) {
  throw new Error("Set DIRECT_URL before seeding the catalog.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  const result = await prisma.product.createMany({
    data: products.map((product, sortOrder) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      categoryLabel: product.categoryLabel,
      badge: product.badge,
      description: product.description,
      price: product.price,
      art: product.art,
      mark: product.mark,
      image: product.image,
      blendBackground: product.blendBackground ?? false,
      pitch: productPitches[product.id] ?? null,
      isDemo: true,
      isActive: true,
      sortOrder,
    })),
    skipDuplicates: true,
  });

  console.info(`Added ${result.count} demonstration catalog products.`);
}

main()
  .catch((error: unknown) => {
    console.error("Catalog seed failed.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
