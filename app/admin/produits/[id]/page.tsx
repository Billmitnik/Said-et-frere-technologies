import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/server/admin/auth";
import { getAdminProduct, getProductFormSuggestions } from "@/lib/server/admin/products";

export const metadata: Metadata = { title: "Modifier un produit" };

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  await requireAdmin();
  const { id } = await params;
  const [product, suggestions] = await Promise.all([getAdminProduct(id), getProductFormSuggestions()]);
  if (!product) notFound();

  return (
    <>
      <AdminHeader />
      <main className="admin-main admin-main-form">
        <p className="admin-back"><a href="/admin">← Tous les produits</a></p>
        <h1>{product.name}</h1>
        <p className="admin-subtitle">
          Lien public : <a href={`/produits/${encodeURIComponent(product.id)}`} target="_blank" rel="noopener">/produits/{product.id} ↗</a>
        </p>
        <ProductForm
          product={{
            id: product.id,
            name: product.name,
            category: product.category,
            categoryLabel: product.categoryLabel,
            badge: product.badge,
            description: product.description,
            pitch: product.pitch,
            price: product.price,
            sortOrder: product.sortOrder,
            image: product.image,
            isActive: product.isActive,
            isDemo: product.isDemo,
            blendBackground: product.blendBackground,
          }}
          {...suggestions}
        />
      </main>
    </>
  );
}
