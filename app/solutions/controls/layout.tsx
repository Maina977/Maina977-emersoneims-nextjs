import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generator Controller Solutions",
  description: "Expert DeepSea DSE and PowerWizard controller solutions in Kenya. Fault code database, configuration guides, communication setup. DSE7310, DSE7320, DSE8610, PowerWizard 1.0/2.0. Call +254 768 860 665.",
  keywords: "DeepSea controller Kenya, DSE7310 Kenya, DSE7320 fault codes, PowerWizard Kenya, generator controller repair, AMF controller Kenya, DSE configuration, generator controller fault codes, DSE8610 parallel, Modbus generator, RS485 generator",
  openGraph: {
    title: "Generator Controller Solutions | DeepSea & PowerWizard Experts",
    // Was "Kenya's leading ... specialists" — unsourced market position.
    description: "DeepSea and PowerWizard generator controller work in Kenya: fault code lookup, configuration and repairs.",
    url: "https://www.emersoneims.com/solutions/controls",
    siteName: "EmersonEIMS",
    locale: "en_KE",
    type: "website",
  },
  alternates: { canonical: "https://www.emersoneims.com/solutions/controls" },
};

export default function ControlsSolutionsLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      // FAQPage removed 2026-11-25: none of its Q&As are shown on the page
      // (Google requires FAQ markup to match visible content).
      {
        "@type": "Service",
        "serviceType": "Generator Controller Services",
        "provider": { "@type": "LocalBusiness", "name": "EmersonEIMS", "telephone": "+254768860665" },
        "areaServed": { "@type": "Country", "name": "Kenya" }
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
