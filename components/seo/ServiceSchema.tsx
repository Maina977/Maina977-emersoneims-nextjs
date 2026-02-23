// Service Schema for SEO
export function ServiceSchema({
  serviceName,
  description,
  serviceType,
  priceRange,
  areaServed = "Kenya",
}: {
  serviceName: string;
  description: string;
  serviceType: string;
  priceRange?: string;
  areaServed?: string | string[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceName,
    "description": description,
    "serviceType": serviceType,
    "provider": {
      "@type": "LocalBusiness",
      "name": "EmersonEIMS",
      "url": "https://www.emersoneims.com",
      "telephone": "+254-XXX-XXXXXX",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "KE",
        "addressLocality": "Nairobi",
        "addressRegion": "Nairobi County"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "-1.3200",
        "longitude": "36.8900"
      }
    },
    "areaServed": Array.isArray(areaServed)
      ? areaServed.map(area => ({
          "@type": "Country",
          "name": area
        }))
      : {
          "@type": "Country",
          "name": areaServed
        },
    ...(priceRange && {
      "offers": {
        "@type": "Offer",
        "availability": "https://schema.org/InStock",
        "priceRange": priceRange,
        "priceCurrency": "KES"
      }
    })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Product Schema for Generator Sales
export function ProductSchema({
  productName,
  brand,
  model,
  description,
  price,
  availability = "InStock",
  warranty,
}: {
  productName: string;
  brand: string;
  model?: string;
  description: string;
  price?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  warranty?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": productName,
    "brand": {
      "@type": "Brand",
      "name": brand
    },
    ...(model && { "model": model }),
    "description": description,
    "offers": {
      "@type": "Offer",
      ...(price && { "price": price, "priceCurrency": "KES" }),
      "availability": `https://schema.org/${availability}`,
      ...(warranty && { "warranty": warranty })
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// FAQ Schema
export function FAQSchema({
  faqs
}: {
  faqs: Array<{ question: string; answer: string }>;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
