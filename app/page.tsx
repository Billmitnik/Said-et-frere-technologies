import type { Metadata } from "next";
import { connection } from "next/server";
import { DemoBanner } from "@/components/site/DemoBanner";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ShopClient } from "@/components/shop/ShopClient";
import { getCatalogProducts } from "@/lib/server/catalog";

export const metadata: Metadata = {
  title: { absolute: "SAID & FRÈRES TECHNOLOGIES — La tech, bien choisie" },
  description:
    "Ordinateurs, accessoires, stockage et maintenance chez SAID & FRÈRES TECHNOLOGIES, au Centre commercial Capitole à Bouaké.",
  referrer: "strict-origin-when-cross-origin",
};

function ServiceSection() {
  return (
    <section className="service-section" id="services">
      <div className="service-symbol reveal" aria-hidden="true">
        S<span>+</span>
      </div>
      <div>
        <p className="eyebrow">Un souci avec votre ordinateur ?</p>
        <h2>La maintenance aussi,<br />c’est notre métier.</h2>
        <p>
          Choisissez les symptômes de votre ordinateur, puis décrivez ce qui
          s’est passé. Pour une panne physique, indiquez les dégâts visibles et
          la pièce concernée si vous la connaissez.
        </p>
      </div>
      <a href="/maintenance#diagnostic" className="outline-button">
        Décrire un problème <span aria-hidden="true">↘</span>
      </a>
    </section>
  );
}

function PromiseSection() {
  return (
    <section className="promise-section" id="a-propos">
      <p className="eyebrow eyebrow-dark reveal">SAID &amp; FRÈRES TECHNOLOGIES</p>
      <h2 className="reveal">
        Le bon matériel.<br /><span>Le bon conseil.</span>
      </h2>
      <p className="reveal">
        Retrouvez-nous au Centre commercial Capitole, à Bouaké. Une boutique
        informatique de proximité pour particuliers, étudiants et
        professionnels : matériel neuf, seconde main et reconditionné,
        accessoires et entretien informatique.
      </p>
      <div className="promise-items reveal">
        <span><b>01</b> Plusieurs budgets</span>
        <span><b>02</b> Matériel &amp; accessoires</span>
        <span><b>03</b> Assistance informatique</span>
      </div>
    </section>
  );
}

export default async function HomePage() {
  await connection();
  const products = await getCatalogProducts();

  return (
    <>
      <DemoBanner />
      <ShopClient products={products} afterCatalog={<><ServiceSection /><PromiseSection /></>} />
      <SiteFooter />
    </>
  );
}
