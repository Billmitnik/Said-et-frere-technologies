import { Brand } from "@/components/site/Brand";
import { createWhatsAppUrl, storePhoneLabel } from "@/lib/whatsapp";

type SiteFooterProps = {
  maintenance?: boolean;
  /** True while the catalog still holds demonstration products and prices. */
  demo?: boolean;
};

export function SiteFooter({ maintenance = false, demo = false }: SiteFooterProps) {
  const whatsappUrl = createWhatsAppUrl("Bonjour SAID & FRÈRES TECHNOLOGIES,");

  return (
    <footer className={`site-footer${maintenance ? " maintenance-footer" : ""}`}>
      <Brand
        href={maintenance ? "/#accueil" : "#accueil"}
        label="Retour à l’accueil SAID & FRÈRES TECHNOLOGIES"
      />
      <p>
        Centre commercial Capitole · Bouaké, Côte d’Ivoire
        {whatsappUrl && <><br />WhatsApp : <a className="footer-phone" href={whatsappUrl}>{storePhoneLabel}</a></>}
        {!maintenance && <><br />Une boutique à votre service.{demo && " Site en préparation."}</>}
      </p>
      {maintenance ? (
        <a href="/#boutique">Retour à la boutique</a>
      ) : (
        <>
          <a className="primary-button footer-maintenance-link" href="/maintenance#diagnostic">
            Demander une maintenance
          </a>
          <a href="#accueil">Retour en haut</a>
        </>
      )}
    </footer>
  );
}
