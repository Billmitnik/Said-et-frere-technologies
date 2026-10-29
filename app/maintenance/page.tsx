import type { Metadata } from "next";
import { connection } from "next/server";
import { DiagnosticForm } from "@/components/maintenance/DiagnosticForm";
import { DemoBanner } from "@/components/site/DemoBanner";
import { MaintenanceHeader } from "@/components/site/MaintenanceHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "Assistance & maintenance",
  description:
    "Décrivez votre panne et préparez une demande de diagnostic auprès de SAID & FRÈRES TECHNOLOGIES à Bouaké.",
  referrer: "strict-origin-when-cross-origin",
};

export default async function MaintenancePage() {
  await connection();

  return (
    <>
      <DemoBanner maintenance />
      <MaintenanceHeader />
      <main>
        <section className="diagnostic-section maintenance-page" id="diagnostic">
          <div className="section-top">
            <div>
              <p className="eyebrow eyebrow-dark">Assistance informatique à Bouaké</p>
              <h1>Parlons de votre<br />problème technique.</h1>
            </div>
            <p className="section-intro">
              Décrivez les symptômes de votre appareil. Pour un dommage physique ou un problème de carte mère, ajoutez une description détaillée.
            </p>
          </div>
          <p className="maintenance-location">📍 SAID &amp; FRÈRES TECHNOLOGIES — Centre commercial Capitole, Bouaké</p>
          <DiagnosticForm />
        </section>
      </main>
      <SiteFooter maintenance />
    </>
  );
}
