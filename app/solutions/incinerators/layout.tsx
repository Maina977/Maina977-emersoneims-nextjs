import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Incinerator Solutions Kenya | Medical Waste, Installation, NEMA Compliance | EmersonEIMS",
  description: "Incinerator solutions in Kenya. Medical waste incinerators, installation, maintenance, NEMA emissions compliance. Hospital incinerators, industrial waste disposal. All capacities available. Call 0768 860 655.",
  keywords: "incinerator Kenya, medical waste incinerator Kenya, hospital incinerator, waste incinerator Nairobi, NEMA compliance incinerator, industrial incinerator Kenya, cremator Kenya, incinerator installation, incinerator maintenance",
  openGraph: {
    title: "Incinerator Solutions Kenya | Medical & Industrial Waste | EmersonEIMS",
    description: "Professional incinerator installation, maintenance, and NEMA compliance services in Kenya.",
    url: "https://emersoneims.com/solutions/incinerators",
    siteName: "EmersonEIMS",
    locale: "en_KE",
    type: "website",
  },
  alternates: { canonical: "https://emersoneims.com/solutions/incinerators" },
};

export default function IncineratorsLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "What temperature should a medical waste incinerator reach?", "acceptedAnswer": { "@type": "Answer", "text": "Medical waste incinerators must reach minimum 850°C in the secondary chamber with 2-second residence time to destroy pathogens and ensure complete combustion. Primary chamber operates at 800-1000°C. Higher temps (1100°C+) needed for pharmaceutical waste." } },
          { "@type": "Question", "name": "What NEMA requirements apply to incinerators in Kenya?", "acceptedAnswer": { "@type": "Answer", "text": "NEMA requirements: Environmental Impact Assessment before installation, annual operating license, emission limits (particulates <50mg/Nm³, CO <100mg/Nm³), annual stack testing, operator training, and proper ash disposal documentation." } },
          { "@type": "Question", "name": "How much does a medical waste incinerator cost in Kenya?", "acceptedAnswer": { "@type": "Answer", "text": "Medical incinerator prices in Kenya: Small (10-25kg/hr): KES 800,000-1.5M. Medium (50-100kg/hr): KES 2-4M. Large (200kg/hr+): KES 5-15M. Prices include installation, commissioning, and initial training. Add 20-30% for emission controls." } },
          { "@type": "Question", "name": "How often should an incinerator be serviced?", "acceptedAnswer": { "@type": "Answer", "text": "Daily: Remove ash, check burner. Weekly: Clean air filters, inspect refractory. Monthly: Service burners, calibrate sensors. Annually: Full refractory inspection, burner overhaul, emission stack test, replace worn components." } },
          { "@type": "Question", "name": "What waste can be incinerated?", "acceptedAnswer": { "@type": "Answer", "text": "Suitable: Medical waste, pathological waste, sharps, pharmaceutical waste, confidential documents, general non-recyclable waste. NOT suitable: Heavy metals, radioactive materials, large metal objects, pressurized containers, PVC (without proper scrubbers)." } }
        ]
      },
      { "@type": "Service", "serviceType": "Incinerator Services", "provider": { "@type": "LocalBusiness", "name": "EmersonEIMS", "telephone": "+254768860665" }, "areaServed": { "@type": "Country", "name": "Kenya" } }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
