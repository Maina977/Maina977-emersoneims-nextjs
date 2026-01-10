import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AMF Panel & Generator Automation Kenya | ATS, Remote Monitoring | EmersonEIMS",
  description: "Diesel generator automation in Kenya. AMF panels, ATS installation, auto-start systems, remote monitoring. DSE controllers, ComAp integration. AMF panel fabrication, commissioning. Call +254 768 860 665.",
  keywords: "AMF panel Kenya, ATS Kenya, automatic transfer switch Kenya, generator automation Kenya, auto start generator Kenya, DSE controller Kenya, remote generator monitoring, AMF installation Nairobi, generator changeover switch, diesel automation",
  openGraph: {
    title: "Generator Automation Kenya | AMF Panels & ATS Systems | EmersonEIMS",
    description: "Automate your generator with AMF panels and ATS systems. Remote monitoring, auto-start, load management.",
    url: "https://emersoneims.com/solutions/diesel-automation",
    siteName: "EmersonEIMS",
    locale: "en_KE",
    type: "website",
  },
  alternates: { canonical: "https://emersoneims.com/solutions/diesel-automation" },
};

export default function DieselAutomationLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "What is an AMF panel?", "acceptedAnswer": { "@type": "Answer", "text": "AMF (Automatic Mains Failure) panel automatically starts your generator when utility power fails and transfers load to generator. When mains returns, it transfers back and stops the generator. No manual intervention needed." } },
          { "@type": "Question", "name": "How much does an AMF panel cost in Kenya?", "acceptedAnswer": { "@type": "Answer", "text": "AMF panel prices in Kenya: Basic AMF (DSE4520): KES 150,000-300,000. Standard AMF (DSE7310): KES 300,000-600,000. Advanced AMF with sync (DSE8610): KES 1,000,000+. Price depends on generator size and features." } },
          { "@type": "Question", "name": "What is the difference between ATS and AMF?", "acceptedAnswer": { "@type": "Answer", "text": "ATS (Automatic Transfer Switch) only switches power between sources. AMF includes ATS plus generator control (start, stop, monitoring). AMF is a complete system; ATS is just the transfer mechanism." } },
          { "@type": "Question", "name": "Can I monitor my generator remotely?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, with controllers like DSE7310+ or ComAp. Add Ethernet/WiFi module or DSE890 gateway for cloud monitoring. View status, receive SMS/email alerts, see run hours and fuel level from anywhere." } },
          { "@type": "Question", "name": "How long does AMF panel installation take?", "acceptedAnswer": { "@type": "Answer", "text": "AMF panel installation typically takes 1-3 days: Day 1 for panel mounting and cable routing, Day 2 for connections and wiring, Day 3 for commissioning and testing. Complex installations may take longer." } }
        ]
      },
      { "@type": "Service", "serviceType": "Generator Automation", "provider": { "@type": "LocalBusiness", "name": "EmersonEIMS", "telephone": "+254768860665" }, "areaServed": { "@type": "Country", "name": "Kenya" } }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
