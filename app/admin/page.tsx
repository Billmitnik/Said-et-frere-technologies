import type { Metadata } from "next";
import { hideDemoProductsAction, setProductActiveAction } from "@/app/admin/actions";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { requireAdmin } from "@/lib/server/admin/auth";
import { listAdminProducts } from "@/lib/server/admin/products";
import { formatPrice } from "@/lib/price";

// The admin layout's title template only reaches child segments, not this page.
export const metadata: Metadata = { title: { absolute: "Produits — Administration SAID & FRÈRES" } };

type AdminProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstValue(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  await requireAdmin();
  const params = await searchParams;
  const search = firstValue(params.q).trim().slice(0, 100);
  const savedId = firstValue(params.enregistre);
  const hiddenDemoCount = firstValue(params["demo-masques"]);
  const products = await listAdminProducts(search);
  const visibleDemoCount = products.filter((product) => product.isDemo && product.isActive).length;

  return (
    <>
      <AdminHeader />
      <main className="admin-main">
        <div className="admin-title-row">
          <div>
            <p className="eyebrow eyebrow-dark">Catalogue</p>
            <h1>Produits</h1>
          </div>
          <a className="primary-button" href="/admin/produits/nouveau">
            Ajouter un produit <span aria-hidden="true">+</span>
          </a>
        </div>

        {savedId && (
          <p className="admin-notice" role="status">
            Produit enregistré. Il est déjà à jour sur le site.{" "}
            <a href={`/produits/${encodeURIComponent(savedId)}`} target="_blank" rel="noopener">Voir la fiche</a>
          </p>
        )}
        {hiddenDemoCount && (
          <p className="admin-notice" role="status">
            {hiddenDemoCount} produit(s) de démonstration masqué(s). Ils restent ici et peuvent être réaffichés.
          </p>
        )}

        {!search && visibleDemoCount > 0 && (
          <div className="admin-card admin-demo-card">
            <p>
              <strong>{visibleDemoCount} produit(s) de démonstration</strong> sont encore visibles sur le site.
              Quand vos vrais produits sont prêts, masquez-les d’un coup. Rien n’est supprimé.
            </p>
            <form action={hideDemoProductsAction}>
              <button className="secondary-button" type="submit">Masquer les produits de démonstration</button>
            </form>
          </div>
        )}

        <form className="admin-search" role="search" action="/admin">
          <label className="visually-hidden" htmlFor="admin-search">Rechercher un produit</label>
          <input id="admin-search" name="q" type="search" defaultValue={search} placeholder="Rechercher un produit…" maxLength={100} />
          <button className="secondary-button" type="submit">Rechercher</button>
          {search && <a href="/admin">Tout afficher</a>}
        </form>

        <p className="results-count">{products.length} produit(s){search ? ` pour « ${search} »` : ""}</p>
        <ul className="admin-product-list">
          {products.map((product) => (
            <li key={product.id} className={product.isActive ? undefined : "is-hidden"}>
              <img src={`/${product.image}`} alt="" width="64" height="64" />
              <div className="admin-product-main">
                <a href={`/admin/produits/${encodeURIComponent(product.id)}`}><strong>{product.name}</strong></a>
                <span>{product.categoryLabel}</span>
                <span className="admin-badges">
                  {!product.isActive && <span className="admin-badge admin-badge-muted">Masqué</span>}
                  {product.isDemo && <span className="admin-badge">Démo</span>}
                </span>
              </div>
              <span className="admin-product-price">{product.price === null ? "Sur devis" : formatPrice(product.price)}</span>
              <div className="admin-product-actions">
                <a className="secondary-button" href={`/admin/produits/${encodeURIComponent(product.id)}`}>Modifier</a>
                <form action={setProductActiveAction}>
                  <input type="hidden" name="id" value={product.id} />
                  <input type="hidden" name="isActive" value={product.isActive ? "false" : "true"} />
                  <button className="secondary-button" type="submit">{product.isActive ? "Masquer" : "Afficher"}</button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
