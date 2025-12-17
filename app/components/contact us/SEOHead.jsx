import React from "react";
import { Helmet } from "react-helmet-async";

/**
 * SEOHead - SEO metadata component
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string | string[]} [props.keywords] - SEO keywords (optional, accepts string or array)
 * @param {string} [props.canonical] - Canonical URL
 * @param {Object} [props.openGraph] - Open Graph metadata
 */
export default function SEOHead({ title, description, keywords, canonical, openGraph }) {
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
      {normalizedKeywords && <meta name="keywords" content={normalizedKeywords} />}
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