/**
 * JSON-LD for /solutions/generators (rendered by app/solutions/generators/layout.tsx).
 *
 * Content-safety withdrawal 2026-11-25 (audit SG-W6):
 *  - FAQPage: the battery-voltage sentence of the "fail to start" answer and
 *    the whole "Why is my generator overheating?" Q&A are withdrawn (unsourced
 *    limit; overheating advice with no STOP).
 *  - The pre-start-checks HowTo is withdrawn (its leak check had no
 *    "if found, do not start").
 * Pure function so the regression test can call it.
 */
export function buildGeneratorSolutionsJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.emersoneims.com/solutions/generators",
        "url": "https://www.emersoneims.com/solutions/generators",
        "name": "Generator Solutions Kenya - Installation, Maintenance, Repairs",
        "description": "Complete generator solutions including installation, maintenance schedules, fault diagnosis, and emergency repairs.",
        "isPartOf": { "@id": "https://www.emersoneims.com/#website" },
        "breadcrumb": { "@id": "https://www.emersoneims.com/solutions/generators#breadcrumb" }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.emersoneims.com/solutions/generators#breadcrumb",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "item": { "@id": "https://www.emersoneims.com", "name": "Home" } },
          { "@type": "ListItem", "position": 2, "item": { "@id": "https://www.emersoneims.com/solutions", "name": "Solutions" } },
          { "@type": "ListItem", "position": 3, "item": { "@id": "https://www.emersoneims.com/solutions/generators", "name": "Generators" } }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "How often should I service my generator?", "acceptedAnswer": { "@type": "Answer", "text": "Generators should be serviced every 250-500 hours or every 6 months, whichever comes first. Daily checks include oil level, coolant, and fuel. Annual service includes full oil change, filter replacement, and load bank testing." } },
          { "@type": "Question", "name": "What causes a generator to fail to start?", "acceptedAnswer": { "@type": "Answer", "text": "Common causes include: dead battery (most common), empty fuel tank, faulty starter motor, clogged fuel filter, or safety shutdown due to low oil." } },
          { "@type": "Question", "name": "How much does generator installation cost in Kenya?", "acceptedAnswer": { "@type": "Answer", "text": "Generator installation in Kenya ranges from KES 50,000 for small units to KES 500,000+ for large industrial installations. This includes electrical connections, AMF panel, ATS, fuel system, and commissioning." } },
          { "@type": "Question", "name": "What size generator do I need for my home?", "acceptedAnswer": { "@type": "Answer", "text": "For a typical Kenyan home: 5-10kVA for basic needs (lights, TV, fridge), 15-20kVA if including AC units, 25kVA+ for large homes with multiple ACs. Calculate total load and add 25% safety margin." } }
        ]
      },
      {
        "@type": "Service",
        "serviceType": "Generator Installation and Maintenance",
        "provider": {
          "@type": "LocalBusiness",
          "name": "EmersonEIMS",
          "telephone": "+254768860665",
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
}
