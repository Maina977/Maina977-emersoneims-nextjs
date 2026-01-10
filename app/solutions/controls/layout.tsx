import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generator Controller Solutions | DeepSea DSE, PowerWizard | EmersonEIMS Kenya",
  description: "Expert DeepSea DSE and PowerWizard controller solutions in Kenya. Fault code database, configuration guides, communication setup. DSE7310, DSE7320, DSE8610, PowerWizard 1.0/2.0. Call +254 768 860 665.",
  keywords: "DeepSea controller Kenya, DSE7310 Kenya, DSE7320 fault codes, PowerWizard Kenya, generator controller repair, AMF controller Kenya, DSE configuration, generator controller fault codes, DSE8610 parallel, Modbus generator, RS485 generator",
  openGraph: {
    title: "Generator Controller Solutions | DeepSea & PowerWizard Experts | EmersonEIMS",
    description: "Kenya's leading DeepSea and PowerWizard controller specialists. Fault code lookup, configuration, repairs.",
    url: "https://emersoneims.com/solutions/controls",
    siteName: "EmersonEIMS",
    locale: "en_KE",
    type: "website",
  },
  alternates: { canonical: "https://emersoneims.com/solutions/controls" },
};

export default function ControlsSolutionsLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "What does DSE fault code 'Fail to Start' mean?", "acceptedAnswer": { "@type": "Answer", "text": "DSE 'Fail to Start' means the engine didn't reach running speed within the crank time. Check: battery voltage (>24V), fuel supply, starter motor, speed sensing. Reset and retry after checking these items." } },
          { "@type": "Question", "name": "How do I reset a DeepSea controller?", "acceptedAnswer": { "@type": "Answer", "text": "To reset a DeepSea controller: 1) Fix the fault condition first, 2) Press and hold the STOP/RESET button for 3 seconds, 3) If persistent, cycle power to the controller. Some faults require parameter reset via DSE Configuration Suite." } },
          { "@type": "Question", "name": "What is the difference between DSE7310 and DSE7320?", "acceptedAnswer": { "@type": "Answer", "text": "DSE7310 is for single generator auto-start applications. DSE7320 adds mains (utility) monitoring for automatic mains failure (AMF) operation with automatic transfer between mains and generator power." } },
          { "@type": "Question", "name": "How do I connect to a DeepSea controller remotely?", "acceptedAnswer": { "@type": "Answer", "text": "Remote connection options: 1) DSE WebNet for Ethernet/WiFi monitoring, 2) DSE890 Gateway for cloud access, 3) Modbus TCP/IP for SCADA integration. Configure IP settings via front panel or DSE Configuration Suite software." } },
          { "@type": "Question", "name": "Why is my PowerWizard showing 'Not In Auto'?", "acceptedAnswer": { "@type": "Answer", "text": "PowerWizard 'Not In Auto' indicates the controller is in Manual or Off mode. Check the mode selector switch position. Also verify all auto-start permissives are satisfied (no active shutdowns, remote start enabled if used)." } }
        ]
      },
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
