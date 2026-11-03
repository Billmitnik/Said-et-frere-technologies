import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { getCatalogProducts } from "@/lib/server/catalog";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Built per request from the cached catalog, so new products appear without a redeploy.
  await connection();
  const products = await getCatalogProducts();

  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/maintenance`, changeFrequency: "monthly", priority: 0.7 },
    ...products.map((product) => ({
      url: `${SITE_URL}/produits/${product.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
