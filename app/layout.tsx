import type { Metadata, Viewport } from "next";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const siteDescription =
  "Ordinateurs, accessoires, stockage et maintenance informatique au Centre commercial Capitole, à Bouaké.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SAID & FRÈRES TECHNOLOGIES — La tech, bien choisie",
    template: "%s — SAID & FRÈRES TECHNOLOGIES",
  },
  description: siteDescription,
  applicationName: "SAID & FRÈRES TECHNOLOGIES",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "SAID & FRÈRES TECHNOLOGIES",
    title: "SAID & FRÈRES TECHNOLOGIES — La tech, bien choisie",
    description: siteDescription,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#111827",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
