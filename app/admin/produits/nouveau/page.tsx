import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/server/admin/auth";
import { getProductFormSuggestions } from "@/lib/server/admin/products";

export const metadata: Metadata = { title: "Nouveau produit" };

export default async function NewProductPage() {
  await requireAdmin();
  const suggestions = await getProductFormSuggestions();

  return (
    <>
      <AdminHeader />
      <main className="admin-main admin-main-form">
        <p className="admin-back"><a href="/admin">← Tous les produits</a></p>
        <h1>Nouveau produit</h1>
        <ProductForm product={null} {...suggestions} />
      </main>
    </>
  );
}
