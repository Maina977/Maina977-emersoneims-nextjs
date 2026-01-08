import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UPS Solutions Kenya | Installation, Battery Replacement, Sizing | EmersonEIMS",
  description: "Complete UPS solutions in Kenya. Installation guides, battery replacement, sizing calculator, troubleshooting. APC, Eaton, Vertiv specialists. Online, Line-Interactive UPS. Call 0768 860 655.",
  keywords: "UPS Kenya, UPS installation Kenya, UPS battery replacement, UPS sizing Kenya, APC UPS Kenya, Eaton UPS Kenya, Vertiv UPS Kenya, online UPS Kenya, data center UPS, UPS repair Nairobi, UPS maintenance Kenya, backup power Kenya",
  openGraph: {
    title: "UPS Solutions Kenya | Installation, Maintenance, Repairs | EmersonEIMS",
    description: "Kenya's comprehensive UPS resource. Installation guides, battery care, sizing calculators, troubleshooting.",
    url: "https://emersoneims.com/solutions/ups",
    siteName: "EmersonEIMS",
    locale: "en_KE",
    type: "website",
  },
  alternates: { canonical: "https://emersoneims.com/solutions/ups" },
};

export default function UPSSolutionsLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "What size UPS do I need?", "acceptedAnswer": { "@type": "Answer", "text": "Calculate: Total load watts ÷ 0.8 (power factor) × 1.25 (safety margin) = UPS VA rating. Example: 800W load needs 800÷0.8×1.25 = 1250VA UPS minimum." } },
          { "@type": "Question", "name": "How long do UPS batteries last?", "acceptedAnswer": { "@type": "Answer", "text": "UPS batteries typically last 3-5 years. Lifespan depends on temperature (keep below 25°C), discharge cycles, and depth of discharge. Replace when capacity drops below 80%." } },
          { "@type": "Question", "name": "Why is my UPS beeping continuously?", "acceptedAnswer": { "@type": "Answer", "text": "Continuous beeping usually means low battery or battery fault. Check if it's on battery (mains may be off), battery age, and battery voltage (should be 13.5-14.5V per 12V battery)." } },
          { "@type": "Question", "name": "What is the difference between Online and Line-Interactive UPS?", "acceptedAnswer": { "@type": "Answer", "text": "Online UPS continuously converts power (best protection, zero transfer time). Line-Interactive uses AVR and switches to battery when needed (more efficient). Online best for servers." } },
          { "@type": "Question", "name": "How much does UPS installation cost in Kenya?", "acceptedAnswer": { "@type": "Answer", "text": "UPS installation in Kenya: Small office (1-3kVA): KES 15,000-30,000. Server room (5-10kVA): KES 50,000-100,000. Data center (20kVA+): KES 150,000-500,000." } }
        ]
      },
      { "@type": "Service", "serviceType": "UPS Installation and Maintenance", "provider": { "@type": "LocalBusiness", "name": "EmersonEIMS", "telephone": "+254768860665" }, "areaServed": { "@type": "Country", "name": "Kenya" } }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
