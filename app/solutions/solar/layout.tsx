import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solar Solutions Kenya | Installation, Maintenance, Troubleshooting | EmersonEIMS",
  description: "Complete solar solutions in Kenya. Installation guides, maintenance schedules, inverter fault codes (SMA, Fronius, Huawei, Growatt), battery diagnostics. KPLC net metering experts. Call 0768 860 655.",
  keywords: "solar installation Kenya, solar panels Kenya, solar inverter fault codes, SMA error codes, Fronius fault codes, solar maintenance Kenya, solar troubleshooting, KPLC net metering, hybrid solar Kenya, off-grid solar Kenya, solar battery Kenya",
  openGraph: {
    title: "Solar Solutions Kenya | Installation, Maintenance & Repairs | EmersonEIMS",
    description: "Kenya's most comprehensive solar resource. Installation guides, inverter troubleshooting, maintenance schedules.",
    url: "https://emersoneims.com/solutions/solar",
    siteName: "EmersonEIMS",
    locale: "en_KE",
    type: "website",
  },
  alternates: { canonical: "https://emersoneims.com/solutions/solar" },
};

export default function SolarLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "Why is my solar inverter showing an error?", "acceptedAnswer": { "@type": "Answer", "text": "Common solar inverter errors: Grid fault (check KPLC supply), isolation fault (moisture in panels/cables), overcurrent (check panel strings), overtemperature (improve ventilation). Check inverter display for specific error code and refer to manual." } },
          { "@type": "Question", "name": "How do I maintain my solar system in Kenya?", "acceptedAnswer": { "@type": "Answer", "text": "Monthly: Clean panels with water (early morning), check inverter display for errors. Quarterly: Inspect cable connections, check battery water levels (flooded). Annually: Professional inspection, tighten all connections, test battery capacity." } },
          { "@type": "Question", "name": "Why is my solar system producing less power?", "acceptedAnswer": { "@type": "Answer", "text": "Common causes: Dirty panels (clean them), shading (trees grown?), panel degradation (normal 0.5%/year), faulty inverter, loose connections, battery issues. Compare current production to original commissioning data." } },
          { "@type": "Question", "name": "How long do solar panels last in Kenya?", "acceptedAnswer": { "@type": "Answer", "text": "Quality solar panels last 25-30 years with 80%+ output. Inverters last 10-15 years. Lead-acid batteries: 3-5 years. Lithium batteries: 10-15 years. Proper maintenance extends all component lifespans." } },
          { "@type": "Question", "name": "Can I connect solar to KPLC in Kenya?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, through KPLC Net Metering program. Requirements: Grid-tie inverter with anti-islanding, application to KPLC, inspection and approval, bidirectional meter installation. Export excess power and get credited on your bill." } }
        ]
      },
      { "@type": "Service", "serviceType": "Solar Installation and Maintenance", "provider": { "@type": "LocalBusiness", "name": "EmersonEIMS", "telephone": "+254768860665" }, "areaServed": { "@type": "Country", "name": "Kenya" } }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
