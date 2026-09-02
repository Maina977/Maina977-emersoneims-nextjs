import type { Metadata } from "next";

export const metadata: Metadata = {
  // See app/generators/cummins/layout.tsx — client page, inherited canonical.
  alternates: { canonical: 'https://www.emersoneims.com/generators/volvo-penta' },
  title: "Volvo Penta Generators | 50-1500 kVA",
  description:
    "Volvo Penta generators in Kenya, 50-1500 kVA, with low emissions and smart monitoring. Supplied, installed and serviced by EmersonEIMS.",
  openGraph: {
    title: "Volvo Penta Advanced Power — 50-1500 kVA",
    description:
      "Volvo Penta generators with advanced technology, low emissions and smart monitoring capabilities.",
    type: "website",
    locale: "en_KE",
  },
};

export default function VolvoPentaGeneratorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
