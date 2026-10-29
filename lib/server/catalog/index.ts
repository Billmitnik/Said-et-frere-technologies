import "server-only";

import { productPitches, products as demoProducts } from "@/data/products";
import type { Product } from "@/data/products";
import { getPrisma } from "@/lib/server/prisma";

const developmentCatalog: Product[] = demoProducts.map((product) => ({
  ...product,
  blendBackground: product.blendBackground ?? false,
  pitch: productPitches[product.id],
  isDemo: true,
}));

export async function getCatalogProducts(): Promise<Product[]> {
  if (!process.env.DATABASE_URL) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("DATABASE_URL is required to load the production catalog.");
    }

    return developmentCatalog;
  }

  const records = await getPrisma().product.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return records.map((record) => ({
    id: record.id,
    name: record.name,
    category: record.category,
    categoryLabel: record.categoryLabel,
    badge: record.badge,
    description: record.description,
    price: record.price,
    art: record.art,
    mark: record.mark,
    image: record.image,
    blendBackground: record.blendBackground,
    pitch: record.pitch ?? undefined,
    isDemo: record.isDemo,
  }));
}
