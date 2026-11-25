/**
 * JSON-LD for /solutions/generators (rendered by app/solutions/generators/layout.tsx).
 *
 * Content-safety withdrawal 2026-11-25 (audit SG-W6):
 *  - FAQPage: dropped entirely. It first lost its battery-voltage sentence
 *    and the overheating Q&A; then, because none of its Q&As is shown on the
 *    page, the whole object was removed (FAQ markup must match visible content).
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
      // FAQPage removed 2026-11-25: none of its Q&As are shown on
      // /solutions/generators (Google requires FAQ markup to match visible content).
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
