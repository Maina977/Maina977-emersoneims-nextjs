// components/common/SEOHead.jsx
import React from "react";
import { Helmet } from "react-helmet-async";

/**
 * SEOHead - SEO metadata component
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string | string[]} [props.keywords] - SEO keywords (optional, accepts string or array)
 */
export default function SEOHead({ title, description, keywords }) {
  /**
   * PERMANENT FIX: Normalize keywords to handle both string and string[]
   * This allows pages to pass either format without breaking the build.
   * Arrays are automatically converted to comma-separated strings for SEO.
   */
  const normalizedKeywords = Array.isArray(keywords)
    ? keywords.join(", ")
    : (keywords || '');
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "EmersonEIMS",
    "url": "https://www.emersoneims.com",
    "logo": "https://www.emersoneims.com/wp-content/uploads/2025/10/emerson-eims-logo.png",
    "email": ["info@emersoneims.com", "emersoneimservices@gmail.com"],
    "contactPoint": [
      { "@type": "ContactPoint", telephone: "+254768860665", contactType: "sales", areaServed: ["KE", "TZ", "UG"], availableLanguage: ["English", "Swahili"] },
      { "@type": "ContactPoint", telephone: "+254782914717", contactType: "technical support", areaServed: ["KE", "TZ", "UG"], availableLanguage: ["English", "Swahili"] }
    ],
    "address": {
      "@type": "PostalAddress",
      streetAddress: "Old North Airport Road",
      postalCode: "00521",
      addressLocality: "Nairobi",
      addressRegion: "Nairobi County",
      addressCountry: "KE"
    },
    "sameAs": [
      "https://www.linkedin.com/company/emersoneims",
      "https://twitter.com/EmersonEIMS",
      "https://www.facebook.com/EmersonEIMS"
    ]
  };

  return (
    <Helmet prioritizeSeoTags>
      <html lang="en" />
      <title>{title}</title>
      <meta name="description" content={description} />
      {normalizedKeywords && <meta name="keywords" content={normalizedKeywords} />}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://www.emersoneims.com/services" />
      <meta property="og:image" content="https://www.emersoneims.com/wp-content/uploads/2025/10/emerson-eims-og.jpg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="https://www.emersoneims.com/wp-content/uploads/2025/10/emerson-eims-twitter.jpg" />
      <link rel="canonical" href="https://www.emersoneims.com/services" />
      <script type="application/ld+json">{JSON.stringify(orgSchema, null, 2)}</script>
    </Helmet>
  );
}