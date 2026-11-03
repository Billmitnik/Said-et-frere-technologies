type DemoBannerProps = {
  maintenance?: boolean;
  /** True while the catalog still holds demonstration products and prices. */
  demo?: boolean;
};

export function DemoBanner({ maintenance = false, demo = false }: DemoBannerProps) {
  return (
    <div className="demo-banner">
      <span className="demo-dot" aria-hidden="true" />
      <strong>{maintenance ? "Assistance à Bouaké" : "Bouaké · Centre commercial Capitole"}</strong>
      <span className="demo-separator" aria-hidden="true">|</span>
      <span>
        {maintenance
          ? "Centre commercial Capitole"
          : demo
            ? "Version de présentation — articles et prix provisoires, paiement à la livraison via WhatsApp"
            : "Commande sur WhatsApp, paiement à la livraison"}
      </span>
    </div>
  );
}
