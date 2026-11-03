import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ProductPageActions } from "@/components/shop/ProductPageActions";
import { DemoBanner } from "@/components/site/DemoBanner";
import { MaintenanceHeader } from "@/components/site/MaintenanceHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { getCatalogProducts } from "@/lib/server/catalog";
import { formatPrice } from "@/lib/price";
import { SITE_URL } from "@/lib/site";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

async function findProduct(id: string) {
  const products = await getCatalogProducts();
  return products.find((product) => product.id === id) ?? null;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await findProduct((await params).id);
  if (!product) return { title: "Produit introuvable" };

  const path = `/produits/${product.id}`;
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: path },
    openGraph: {
      title: `${product.name} — SAID & FRÈRES TECHNOLOGIES`,
      description: product.description,
      url: path,
      images: [{ url: `/${product.image}`, alt: product.name }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  await connection();
  const product = await findProduct((await params).id);
  if (!product) notFound();

  const priceLabel = product.price === null ? "Sur devis" : formatPrice(product.price);

  return (
    <>
      <DemoBanner demo={product.isDemo} />
      <MaintenanceHeader />
      <main>
        <section className="product-page">
          <nav className="product-page-breadcrumb" aria-label="Fil d’Ariane">
            <a href="/#boutique">Boutique</a> <span aria-hidden="true">›</span> <span>{product.categoryLabel}</span>
          </nav>
          <div className="product-page-content">
            <div className="product-page-art product-art">
              <span className="product-badge">{product.badge}</span>
              <img
                className={`product-image${product.blendBackground ? " product-image-blended" : ""}`}
                src={`/${product.image}`}
                alt={product.name}
              />
            </div>
            <div className="product-page-info">
              <p className="product-category">{product.categoryLabel}</p>
              <h1>{product.name}</h1>
              <p>{product.description}</p>
              {product.pitch ? <p>{product.pitch}</p> : null}
              <p>Les références exactes et les caractéristiques sont à confirmer auprès de la boutique selon le stock disponible.</p>
              <div className="product-dialog-price">{priceLabel}</div>
              <p className="product-dialog-note">
                {product.price === null
                  ? "Le tarif dépend du diagnostic et de la prestation."
                  : product.isDemo
                    ? "Prix de démonstration uniquement — à confirmer en boutique."
                    : "Le prix est à confirmer auprès de la boutique selon le stock disponible."}
              </p>
              <ProductPageActions
                productId={product.id}
                productName={product.name}
                priceLabel={priceLabel}
                canOrder={product.price !== null}
                pageUrl={`${SITE_URL}/produits/${product.id}`}
              />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter maintenance />
    </>
  );
}
