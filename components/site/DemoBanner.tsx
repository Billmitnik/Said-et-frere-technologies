type DemoBannerProps = {
  maintenance?: boolean;
};

export function DemoBanner({ maintenance = false }: DemoBannerProps) {
  return (
    <div className="demo-banner">
      <span className="demo-dot" aria-hidden="true" />
      <strong>{maintenance ? "Assistance à Bouaké" : "Bouaké · Centre commercial Capitole"}</strong>
      <span className="demo-separator" aria-hidden="true">|</span>
      <span>
        {maintenance
          ? "Centre commercial Capitole"
          : "Version de présentation — articles et prix provisoires, paiement à la livraison via WhatsApp"}
      </span>
    </div>
  );
}
