import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Borehole Pump Solutions Kenya | Installation, VFD, Maintenance | EmersonEIMS",
  description: "Complete borehole pump solutions in Kenya. Submersible pump installation, VFD systems for energy savings, pump sizing, maintenance. Grundfos, Pedrollo, Dayliff specialists. Call 0768 860 655.",
  keywords: "borehole pump Kenya, submersible pump Kenya, borehole drilling Kenya, VFD pump Kenya, water pump installation, Grundfos Kenya, borehole maintenance, pump repair Nairobi, solar borehole pump, well pump Kenya",
  openGraph: {
    title: "Borehole Pump Solutions Kenya | Installation & VFD Systems | EmersonEIMS",
    description: "Expert borehole pump installation, VFD integration, and maintenance services across Kenya.",
    url: "https://emersoneims.com/solutions/borehole-pumps",
    siteName: "EmersonEIMS",
    locale: "en_KE",
    type: "website",
  },
  alternates: { canonical: "https://emersoneims.com/solutions/borehole-pumps" },
};

export default function BoreholePumpsLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "How do I size a borehole pump?", "acceptedAnswer": { "@type": "Answer", "text": "Calculate Total Dynamic Head (TDH) = Static level + Drawdown + Friction loss + Delivery height. Then select pump with flow rate at 80% of tested borehole yield. Use pump curves to match head and flow requirements." } },
          { "@type": "Question", "name": "What are the benefits of VFD for borehole pumps?", "acceptedAnswer": { "@type": "Answer", "text": "VFD benefits: 20-50% energy savings, soft start (no water hammer), constant pressure control, extended pump life, dry run protection. ROI typically 1-2 years through energy savings alone." } },
          { "@type": "Question", "name": "How deep can a borehole pump go?", "acceptedAnswer": { "@type": "Answer", "text": "Submersible pumps can work up to 500m depth. Typical Kenya boreholes are 50-200m. Jet pumps limited to 25m. Solar pumps typically up to 200m. Pump must be positioned above the screen/bottom by at least 2m." } },
          { "@type": "Question", "name": "How much does borehole pump installation cost in Kenya?", "acceptedAnswer": { "@type": "Answer", "text": "Borehole pump installation in Kenya: Small (1-2HP): KES 80,000-150,000. Medium (3-5HP): KES 150,000-300,000. Large (7.5HP+): KES 300,000-600,000. Includes pump, cable, pipes, control panel, and installation." } },
          { "@type": "Question", "name": "How often should I service my borehole pump?", "acceptedAnswer": { "@type": "Answer", "text": "Monthly: Check current draw and flow rate. Quarterly: Megger test insulation. Annually: Full performance test. Every 3-5 years: Pull pump for inspection, check impeller wear, replace seals. More frequent in sandy water conditions." } }
        ]
      },
      { "@type": "Service", "serviceType": "Borehole Pump Services", "provider": { "@type": "LocalBusiness", "name": "EmersonEIMS", "telephone": "+254768860655" }, "areaServed": { "@type": "Country", "name": "Kenya" } }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
