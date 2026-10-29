import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SAID & FRÈRES TECHNOLOGIES — La tech, bien choisie",
    template: "%s — SAID & FRÈRES TECHNOLOGIES",
  },
  applicationName: "SAID & FRÈRES TECHNOLOGIES",
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
