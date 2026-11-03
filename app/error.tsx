"use client";

import { useEffect } from "react";
import { Brand } from "@/components/site/Brand";
import { SiteFooter } from "@/components/site/SiteFooter";
import { createWhatsAppUrl } from "@/lib/whatsapp";

type ErrorPageProps = {
  error: unknown;
  retry: () => void;
};

export default function ErrorPage({ error, retry }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const digest = error instanceof Error && "digest" in error && typeof error.digest === "string" ? error.digest : null;
  const whatsappUrl = createWhatsAppUrl("Bonjour SAID & FRÈRES TECHNOLOGIES, je n’arrive pas à afficher votre site. Pouvez-vous m’aider ?");

  return (
    <>
      <header className="site-header maintenance-header">
        <div className="header-main">
          <Brand href="/#accueil" label="SAID & Frères Technologies, accueil" />
        </div>
      </header>
      <main>
        <section className="error-page" aria-labelledby="error-title">
          <p className="eyebrow eyebrow-dark">Petit contretemps</p>
          <h1 id="error-title">La page n’a pas pu<br />se charger.</h1>
          <p className="section-intro">
            Le catalogue met parfois quelques secondes à répondre. Réessayez dans un instant. Si le problème continue, écrivez-nous directement sur WhatsApp.
          </p>
          <div className="error-actions">
            <button type="button" className="primary-button" onClick={() => retry()}>
              Réessayer
            </button>
            {whatsappUrl && (
              <a className="secondary-button" href={whatsappUrl}>
                Écrire sur WhatsApp
              </a>
            )}
          </div>
          {digest && <p className="error-reference">Référence de l’erreur : {digest}</p>}
        </section>
      </main>
      <SiteFooter maintenance />
    </>
  );
}
