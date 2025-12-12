'use client';

import React from "react";
import { Helmet } from "react-helmet-async";

export default function SEOHead({ title, description, canonical, openGraph }) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "EmersonEIMS",
    "url": "https://www.emersoneims.com",
    "logo": "https://www.emersoneims.com/wp-content/uploads/2025/10/Untitled-design-2.svg",
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+254768860655",
        "contactType": "customer service",
        "areaServed": "KE",
        "availableLanguage": ["English", "Swahili"]
      },
      {
        "@type": "ContactPoint",
        "telephone": "+254782914717",
        "contactType": "customer service",
        "areaServed": "KE",
        "availableLanguage": ["English", "Swahili"]
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Old North Airport Road",
      "postalCode": "00521",
      "addressLocality": "Nairobi",
      "addressCountry": "KE"
    },
    "email": ["info@emersoneims.com", "emersoneimservices@gmail.com"]
  };

  const ogUrl = openGraph?.url || "https://www.emersoneims.com/contact";
  const ogType = openGraph?.type || "website";
  const ogLocale = openGraph?.locale || "en_KE";
  const ogSiteName = openGraph?.siteName || "EmersonEIMS";
  const canonicalUrl = canonical 
    ? (canonical.startsWith("http") ? canonical : `https://www.emersoneims.com${canonical}`)
    : "https://www.emersoneims.com/contact";

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:site_name" content={ogSiteName} />
      {openGraph?.images?.map((image, index) => (
        <React.Fragment key={index}>
          <meta property="og:image" content={image.url} />
          {image.width && <meta property="og:image:width" content={String(image.width)} />}
          {image.height && <meta property="og:image:height" content={String(image.height)} />}
          {image.alt && <meta property="og:image:alt" content={image.alt} />}
        </React.Fragment>
      ))}
      <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
    </Helmet>
  );
}