import type { Metadata } from "next";
import { MaintenanceHeader } from "@/components/site/MaintenanceHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "Page introuvable",
};

export default function NotFound() {
  return (
    <>
      <MaintenanceHeader />
      <main>
        <section className="error-page" aria-labelledby="not-found-title">
          <p className="eyebrow eyebrow-dark">Erreur 404</p>
          <h1 id="not-found-title">Cette page<br />n’existe pas.</h1>
          <p className="section-intro">
            Le lien est peut-être incomplet, ou ce produit n’est plus proposé. Retrouvez tout notre matériel dans la boutique.
          </p>
          <div className="error-actions">
            <a className="primary-button" href="/#boutique">
              Voir la boutique <span aria-hidden="true">→</span>
            </a>
            <a className="secondary-button" href="/maintenance#diagnostic">
              Demander de l’aide <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>
      </main>
      <SiteFooter maintenance />
    </>
  );
}
