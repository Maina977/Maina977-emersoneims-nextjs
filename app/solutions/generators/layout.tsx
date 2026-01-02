import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generator Solutions Kenya | Installation, Repairs, Maintenance | EmersonEIMS",
  description: "Complete generator solutions in Kenya. Expert installation, maintenance schedules, fault diagnosis, and 24/7 emergency repairs. Cummins, Perkins, CAT specialists. Serving Nairobi, Mombasa, Kisumu & all 47 counties. Call 0768 860 655.",
  keywords: "generator installation Kenya, generator repair Kenya, generator maintenance Kenya, generator service Nairobi, Cummins generator Kenya, Perkins generator Kenya, CAT generator Kenya, diesel generator Kenya, standby generator Kenya, generator fault codes, generator troubleshooting, AMF panel Kenya, ATS installation Kenya, generator parts Kenya",
  openGraph: {
    title: "Generator Solutions Hub | Expert Installation & Repairs | EmersonEIMS Kenya",
    description: "Kenya's most comprehensive generator resource. Installation guides, maintenance schedules, fault codes & troubleshooting. 24/7 emergency service.",
    url: "https://emersoneims.com/solutions/generators",
    siteName: "EmersonEIMS",
    locale: "en_KE",
    type: "website",
    images: [{ url: "https://emersoneims.com/og/generator-solutions.jpg", width: 1200, height: 630, alt: "Generator Solutions Kenya" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Generator Solutions Kenya | EmersonEIMS",
    description: "Complete generator installation, maintenance & repair solutions. Expert technicians, 24/7 service.",
  },
  alternates: {
    canonical: "https://emersoneims.com/solutions/generators",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export default function GeneratorSolutionsLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://emersoneims.com/solutions/generators",
        "url": "https://emersoneims.com/solutions/generators",
        "name": "Generator Solutions Kenya - Installation, Maintenance, Repairs",
        "description": "Complete generator solutions including installation, maintenance schedules, fault diagnosis, and emergency repairs.",
        "isPartOf": { "@id": "https://emersoneims.com/#website" },
        "breadcrumb": { "@id": "https://emersoneims.com/solutions/generators#breadcrumb" }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://emersoneims.com/solutions/generators#breadcrumb",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "item": { "@id": "https://emersoneims.com", "name": "Home" } },
          { "@type": "ListItem", "position": 2, "item": { "@id": "https://emersoneims.com/solutions", "name": "Solutions" } },
          { "@type": "ListItem", "position": 3, "item": { "@id": "https://emersoneims.com/solutions/generators", "name": "Generators" } }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "How often should I service my generator?", "acceptedAnswer": { "@type": "Answer", "text": "Generators should be serviced every 250-500 hours or every 6 months, whichever comes first. Daily checks include oil level, coolant, and fuel. Annual service includes full oil change, filter replacement, and load bank testing." } },
          { "@type": "Question", "name": "What causes a generator to fail to start?", "acceptedAnswer": { "@type": "Answer", "text": "Common causes include: dead battery (most common), empty fuel tank, faulty starter motor, clogged fuel filter, or safety shutdown due to low oil. Check battery voltage first - it should be above 12.6V for 12V systems." } },
          { "@type": "Question", "name": "How much does generator installation cost in Kenya?", "acceptedAnswer": { "@type": "Answer", "text": "Generator installation in Kenya ranges from KES 50,000 for small units to KES 500,000+ for large industrial installations. This includes electrical connections, AMF panel, ATS, fuel system, and commissioning." } },
          { "@type": "Question", "name": "What size generator do I need for my home?", "acceptedAnswer": { "@type": "Answer", "text": "For a typical Kenyan home: 5-10kVA for basic needs (lights, TV, fridge), 15-20kVA if including AC units, 25kVA+ for large homes with multiple ACs. Calculate total load and add 25% safety margin." } },
          { "@type": "Question", "name": "Why is my generator overheating?", "acceptedAnswer": { "@type": "Answer", "text": "Generator overheating causes include: low coolant level, blocked radiator, faulty thermostat, broken fan belt, overloading, or high ambient temperature. Check coolant level first, then inspect radiator for blockages." } }
        ]
      },
      {
        "@type": "HowTo",
        "name": "How to Perform Generator Pre-Start Checks",
        "description": "Essential daily checks before starting your generator",
        "step": [
          { "@type": "HowToStep", "name": "Check Oil Level", "text": "Check engine oil level using dipstick. Should be between min and max marks." },
          { "@type": "HowToStep", "name": "Check Coolant", "text": "Verify coolant level in expansion tank. Top up with correct coolant mix if low." },
          { "@type": "HowToStep", "name": "Check Fuel Level", "text": "Ensure adequate fuel for expected runtime. Never run tank completely dry." },
          { "@type": "HowToStep", "name": "Inspect for Leaks", "text": "Look for oil, fuel, or coolant leaks around engine and connections." },
          { "@type": "HowToStep", "name": "Check Battery", "text": "Verify battery terminals are clean and connections tight." }
        ]
      },
      {
        "@type": "Service",
        "serviceType": "Generator Installation and Maintenance",
        "provider": {
          "@type": "LocalBusiness",
          "name": "EmersonEIMS",
          "telephone": "+254768860655",
          "address": { "@type": "PostalAddress", "addressCountry": "KE", "addressLocality": "Nairobi" }
        },
        "areaServed": { "@type": "Country", "name": "Kenya" },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Generator Services",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Generator Installation" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Generator Maintenance" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Generator Repairs" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "AMF Panel Installation" } }
          ]
        }
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
