import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AC & Air Conditioning Solutions Kenya | Installation, BTU Sizing | EmersonEIMS",
  description: "Complete AC solutions in Kenya. BTU sizing calculator, installation guides, refrigerant types (R410A, R32, R22), maintenance schedules, troubleshooting. Samsung, LG, Daikin, Carrier experts. Call +254 768 860 665.",
  keywords: "AC installation Kenya, air conditioning Kenya, AC repair Nairobi, BTU calculator Kenya, AC sizing Kenya, R410A Kenya, R32 refrigerant, AC maintenance Kenya, split AC Kenya, VRF system Kenya, AC troubleshooting, inverter AC Kenya, Daikin Kenya, Samsung AC Kenya",
  openGraph: {
    title: "AC Solutions Kenya | Installation, BTU Sizing, Repairs | EmersonEIMS",
    description: "Kenya's comprehensive AC resource. BTU sizing guides, refrigerant information, installation procedures, troubleshooting.",
    url: "https://emersoneims.com/solutions/ac",
    siteName: "EmersonEIMS",
    locale: "en_KE",
    type: "website",
  },
  alternates: { canonical: "https://emersoneims.com/solutions/ac" },
};

export default function ACSolutionsLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "What size AC do I need for my room in Kenya?", "acceptedAnswer": { "@type": "Answer", "text": "Calculate BTU: Room area (sq ft) × 25 BTU for normal rooms, ×35 BTU for sunny rooms or kitchens. Example: 200 sq ft bedroom = 5,000 BTU (0.5 ton). Add 600 BTU per person beyond 2 occupants. Nairobi's mild climate needs less than coastal Mombasa." } },
          { "@type": "Question", "name": "What is the difference between R22 and R410A refrigerant?", "acceptedAnswer": { "@type": "Answer", "text": "R22 (Freon) is being phased out due to ozone depletion. R410A is the current standard - more efficient, environmentally friendly, but operates at higher pressure requiring different equipment. R32 is the newest, even more efficient option." } },
          { "@type": "Question", "name": "Why is my AC not cooling properly?", "acceptedAnswer": { "@type": "Answer", "text": "Common causes: dirty filters (clean monthly), low refrigerant (needs recharge), dirty condenser coils, faulty compressor, wrong BTU sizing, or blocked airflow. Start by cleaning filters - this fixes 60% of cooling issues." } },
          { "@type": "Question", "name": "How often should I service my AC in Kenya?", "acceptedAnswer": { "@type": "Answer", "text": "Service AC every 3-4 months in Kenya due to dust. Monthly: clean filters. Quarterly: professional service including coil cleaning, refrigerant check, electrical inspection. This maintains efficiency and prevents costly repairs." } },
          { "@type": "Question", "name": "How much does AC installation cost in Kenya?", "acceptedAnswer": { "@type": "Answer", "text": "AC installation in Kenya: 1-1.5 ton split AC: KES 15,000-25,000 for installation. Price includes mounting, piping (up to 3m), electrical connection, and gas top-up. Additional piping charged per meter. VRF systems: KES 50,000-200,000." } }
        ]
      },
      {
        "@type": "HowTo",
        "name": "How to Calculate AC BTU Size for Your Room",
        "step": [
          { "@type": "HowToStep", "name": "Measure Room", "text": "Calculate room area in square feet (length × width)" },
          { "@type": "HowToStep", "name": "Base BTU", "text": "Multiply area by 25 BTU per square foot" },
          { "@type": "HowToStep", "name": "Sun Exposure", "text": "Add 10% if room gets direct afternoon sun" },
          { "@type": "HowToStep", "name": "Occupants", "text": "Add 600 BTU per person beyond 2 people" },
          { "@type": "HowToStep", "name": "Kitchen", "text": "Add 4,000 BTU if it's a kitchen" },
          { "@type": "HowToStep", "name": "Select Unit", "text": "Choose AC with capacity equal to or slightly above calculated BTU" }
        ]
      },
      {
        "@type": "Service",
        "serviceType": "Air Conditioning Services",
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
