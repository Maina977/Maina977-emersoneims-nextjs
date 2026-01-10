import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Power Quality Solutions Kenya | Surge Protection, Voltage Stabilizers | EmersonEIMS",
  description: "Complete power quality solutions in Kenya. Surge protection (SPD Type 1, 2, 3), voltage stabilizers, AVR, power conditioners. Protect equipment from Kenya Power fluctuations. Call +254 768 860 665.",
  keywords: "surge protector Kenya, voltage stabilizer Kenya, AVR Kenya, power quality Kenya, SPD Kenya, lightning protection Kenya, voltage regulator Nairobi, power conditioner Kenya, brownout protection, power surge protection",
  openGraph: {
    title: "Power Quality Solutions Kenya | Surge & Voltage Protection | EmersonEIMS",
    description: "Protect your equipment from power problems. Surge protectors, voltage stabilizers, and power conditioners for Kenya.",
    url: "https://emersoneims.com/solutions/power-interruptions",
    siteName: "EmersonEIMS",
    locale: "en_KE",
    type: "website",
  },
  alternates: { canonical: "https://emersoneims.com/solutions/power-interruptions" },
};

export default function PowerInterruptionsLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "Why do I need surge protection in Kenya?", "acceptedAnswer": { "@type": "Answer", "text": "Kenya experiences frequent lightning strikes and grid switching events that cause voltage spikes. These can destroy electronics instantly. A single lightning strike can generate 1 billion volts. Surge protectors divert excess voltage to ground, saving your equipment." } },
          { "@type": "Question", "name": "What is the difference between Type 1, Type 2, and Type 3 surge protectors?", "acceptedAnswer": { "@type": "Answer", "text": "Type 1 (50-200kA): Main panel, catches direct lightning. Type 2 (20-80kA): Distribution boards, catches medium surges. Type 3 (3-15kA): At equipment, final protection. Best protection uses all three in cascade." } },
          { "@type": "Question", "name": "Do I need a voltage stabilizer in Kenya?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, if you experience: voltage below 200V (lights dim) or above 250V (lights too bright), frequent equipment failures, or are in areas with unstable Kenya Power supply. Stabilizers maintain constant 220V output regardless of input fluctuations." } },
          { "@type": "Question", "name": "What size voltage stabilizer do I need?", "acceptedAnswer": { "@type": "Answer", "text": "Calculate total load in VA/Watts and add 25% margin. For a home with 3000W total load: 3000 × 1.25 = 3750VA minimum. For motors or compressors, size for 3× starting current." } },
          { "@type": "Question", "name": "How much does a voltage stabilizer cost in Kenya?", "acceptedAnswer": { "@type": "Answer", "text": "Voltage stabilizer prices in Kenya: 1kVA: KES 8,000-15,000. 3kVA: KES 20,000-35,000. 5kVA: KES 35,000-60,000. 10kVA: KES 70,000-120,000. Industrial 50kVA+: KES 300,000+. Servo stabilizers cost more but last longer." } }
        ]
      },
      { "@type": "Service", "serviceType": "Power Quality Solutions", "provider": { "@type": "LocalBusiness", "name": "EmersonEIMS", "telephone": "+254768860665" }, "areaServed": { "@type": "Country", "name": "Kenya" } }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
