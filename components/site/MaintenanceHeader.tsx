import { Brand } from "@/components/site/Brand";

export function MaintenanceHeader() {
  return (
    <header className="site-header maintenance-header">
      <div className="header-main">
        <Brand href="/#accueil" label="SAID & Frères Technologies, accueil" />
        <a className="maintenance-back-link" href="/#boutique">
          ← Retour à la boutique
        </a>
      </div>
    </header>
  );
}
