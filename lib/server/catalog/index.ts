import "server-only";

import { unstable_cache } from "next/cache";
import { productPitches, products as demoProducts } from "@/data/products";
import type { Product } from "@/data/products";
import { getPrisma } from "@/lib/server/prisma";

/** Expire it (updateTag) after any change to products so the shop shows it at once. */
export const CATALOG_CACHE_TAG = "catalog";

const developmentCatalog: Product[] = demoProducts.map((product) => ({
  ...product,
  blendBackground: product.blendBackground ?? false,
  pitch: productPitches[product.id],
  isDemo: true,
}));

// Pages stay dynamically rendered for the CSP nonce, so the data is cached instead of
// the page. The shared cache keeps the free-tier Neon database asleep most of the time,
// and visitors get the previous catalog while a stale one is refreshed in the background.
const getDatabaseCatalog = unstable_cache(
  async (): Promise<Product[]> => {
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
  },
  ["catalog-products"],
  { tags: [CATALOG_CACHE_TAG], revalidate: 3600 },
);

export async function getCatalogProducts(): Promise<Product[]> {
  if (!process.env.DATABASE_URL) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("DATABASE_URL is required to load the production catalog.");
    }

    return developmentCatalog;
  }

  return getDatabaseCatalog();
}
