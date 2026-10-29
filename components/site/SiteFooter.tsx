import { Brand } from "@/components/site/Brand";

type SiteFooterProps = {
  maintenance?: boolean;
};

export function SiteFooter({ maintenance = false }: SiteFooterProps) {
  return (
    <footer className={`site-footer${maintenance ? " maintenance-footer" : ""}`}>
      <Brand
        href={maintenance ? "/#accueil" : "#accueil"}
        label="Retour à l’accueil SAID & Frères Technologies"
      />
      <p>
        Centre commercial Capitole · Bouaké, Côte d’Ivoire
        {!maintenance && <><br />Une boutique à votre service. Site en préparation.</>}
      </p>
      {maintenance ? (
        <a href="/#boutique">Retour à la boutique ↑</a>
      ) : (
        <>
          <a className="primary-button footer-maintenance-link" href="/maintenance#diagnostic">
            Demander une maintenance <span aria-hidden="true">↗</span>
          </a>
          <a href="#accueil">Retour en haut ↑</a>
        </>
      )}
    </footer>
  );
}
