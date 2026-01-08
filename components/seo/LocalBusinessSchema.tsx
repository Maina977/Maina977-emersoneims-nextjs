import Script from 'next/script';

type LocalBusinessProps = {
  name: string;
  description: string;
  url: string;
  telephone?: string;
  address?: {
    streetAddress?: string;
    addressLocality: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry: string;
  };
  image?: string;
  priceRange?: string;
};

export default function LocalBusinessSchema({
  name,
  description,
  url,
  telephone = "+254768860665", // Default primary phone
  address,
  image = "/images/logo-tagline.png",
  priceRange = "$$$"
}: LocalBusinessProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": name,
    "description": description,
    "url": url,
    "telephone": telephone,
    "image": image,
    "priceRange": priceRange,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address?.streetAddress || "Industrial Area",
      "addressLocality": address?.addressLocality,
      "addressRegion": address?.addressRegion,
      "postalCode": address?.postalCode || "00100",
      "addressCountry": address?.addressCountry
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        "opens": "08:00",
        "closes": "17:00"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/emersoneims",
      "https://twitter.com/emersoneims",
      "https://www.linkedin.com/company/emersoneims"
    ]
  };

  return (
    <Script
      id={`local-business-schema-${name.replace(/\s+/g, '-').toLowerCase()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
