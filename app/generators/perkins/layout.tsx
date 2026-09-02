import type { Metadata } from "next";

export const metadata: Metadata = {
  // See app/generators/cummins/layout.tsx — client page, inherited canonical.
  alternates: { canonical: 'https://www.emersoneims.com/generators/perkins' },
  title: "Perkins Generators Kenya | 20-1000 kVA",
  description:
    "Perkins diesel generators in Kenya from 20 kVA to 1000 kVA. Engine series, specifications and local support from EmersonEIMS.",
  openGraph: {
    title: "Perkins Diesel Power — 20 kVA to 1000 kVA",
    description:
      "Perkins generators for commercial and industrial applications across Kenya, with expert local support.",
    type: "website",
    locale: "en_KE",
  },
};

export default function PerkinsGeneratorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
