export function CaseStudiesSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "EmersonEIMS Case Studies - Real Power Solutions in Kenya",
          url: "https://www.emersoneims.com/case-studies",
          mainEntity: {
            "@type": "ItemList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "St. Austin Academy",
                description: "50kVA Perkins generator backup power for 800+ students",
                url: "https://www.emersoneims.com/case-studies#st-austin",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Bigot Flowers",
                description: "30kVA Caterpillar for cold-chain agricultural export",
                url: "https://www.emersoneims.com/case-studies#bigot-flowers",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "NTSA Operations Center",
                description: "Enterprise-grade Atlas Copco for critical infrastructure",
                url: "https://www.emersoneims.com/case-studies#ntsa",
              },
              {
                "@type": "ListItem",
                position: 4,
                name: "Greenheart Kilifi",
                description: "Dual-generator system for real estate development",
                url: "https://www.emersoneims.com/case-studies#greenheart",
              },
              {
                "@type": "ListItem",
                position: 5,
                name: "Kivukoni School",
                description: "Marine-grade Cummins for coastal environment",
                url: "https://www.emersoneims.com/case-studies#kivukoni",
              },
            ],
          },
        })
      }}
    />
  );
}
