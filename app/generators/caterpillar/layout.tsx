import type { Metadata } from "next";

export const metadata: Metadata = {
  // See app/generators/cummins/layout.tsx for why every client page under
  // /generators needs its own server layout: without one it inherits the
  // section canonical and de-indexes itself.
  alternates: { canonical: 'https://www.emersoneims.com/generators/caterpillar' },
  title: "Caterpillar Generators Kenya | 100-2000 kVA",
  description:
    "Caterpillar generators for mining, construction and heavy industry in Kenya. 100-2000 kVA sets supplied, installed and serviced by EmersonEIMS.",
  openGraph: {
    title: "Caterpillar Heavy-Duty Power — 100-2000 kVA",
    description:
      "Caterpillar generators for mission-critical mining, construction and heavy industrial applications.",
    type: "website",
    locale: "en_KE",
  },
};

export default function CaterpillarGeneratorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
