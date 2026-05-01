'use client';

import React from "react";
import { Helmet } from "react-helmet-async";

/**
 * SEOHead - SEO metadata component for App Router compatibility
 * @param {Object} props
 * @param {string} props.title - Page title (required)
 * @param {string} props.description - Page description (required)
 * @param {string | string[]} [props.keywords] - DEPRECATED: Google ignores keywords since 2009. Kept for backwards compatibility but not rendered.
 * @param {string} [props.canonical] - Canonical URL
 * @param {Object} [props.openGraph] - Open Graph metadata
 */
interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string | string[];
  canonical?: string;
  openGraph?: {
    type?: string;
    locale?: string;
    url?: string;
    siteName?: string;
    images?: Array<{
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    }>;
  };
}

export default function SEOHead({ title, description, canonical, openGraph }: SEOHeadProps) {
  /**
   * NOTE: Keywords meta tag removed - Google has ignored it since 2009.
   * See: https://developers.google.com/search/blog/2009/09/google-does-not-use-keywords-meta-tag
   * Focus on quality content, proper headings, and structured data instead.
   */
  
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "EmersonEIMS",
    "url": "https://www.emersoneims.com",
    "logo": "https://www.emersoneims.com/images/Emerson EIMS Logo and Tagline PNG-Picsart-BackgroundRemover.png",
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+254768860665",
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
      "streetAddress": "Embakasi, off Airport North Road",
      "postalCode": "00521",
      "addressLocality": "Nairobi",
      "addressCountry": "KE"
    },
    "email": ["info@emersoneims.com", "emersoneimservices@gmail.com"]
  };

  const ogUrl = openGraph?.url || "https://www.emersoneims.com";
  const ogType = openGraph?.type || "website";
  const ogLocale = openGraph?.locale || "en_KE";
  const ogSiteName = openGraph?.siteName || "EmersonEIMS";
  const canonicalUrl = canonical 
    ? (canonical.startsWith("http") ? canonical : `https://www.emersoneims.com${canonical}`)
    : "https://www.emersoneims.com";

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
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

