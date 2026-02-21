'use client';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * COMPREHENSIVE KENYA SEO COMPONENT
 * Injects structured data for all 47 counties, 9 services, industries
 * Targeting: 9,458+ hospitals, 16,245+ hotels, 18,301+ restaurants
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { useEffect } from 'react';
import Script from 'next/script';
import {
  generateServiceSchema,
  generateFAQSchema,
  KENYA_COUNTIES,
  EMERSON_SERVICES,
  INDUSTRY_TARGETS,
  KENYA_STATS,
  SEO_FAQS
} from '@/lib/seo/comprehensive-kenya-seo';

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN SEO SCHEMA COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function ComprehensiveKenyaSEO() {
  const serviceSchema = generateServiceSchema();
  const faqSchema = generateFAQSchema();

  // Professional Services Schema
  const professionalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "EmersonEIMS",
    "alternateName": ["Emerson EIMS", "Emerson Energy Infrastructure", "EmersonEIMS Kenya"],
    "description": `Kenya's #1 Power Solutions Provider with 3-YEAR WARRANTY on generators. Serving ${KENYA_STATS.counties} counties, ${KENYA_STATS.hospitals.toLocaleString()}+ hospitals, ${KENYA_STATS.hotels.toLocaleString()}+ hotels, ${KENYA_STATS.schools.toLocaleString()}+ schools.`,
    "url": "https://www.emersoneims.com",
    "logo": "https://www.emersoneims.com/images/logo-tagline.png",
    "image": "https://www.emersoneims.com/og-image.jpg",
    "telephone": "+254768860665",
    "email": "info@emersoneims.com",
    "priceRange": "KES 3,500 - 50,000,000",
    "currenciesAccepted": "KES, USD",
    "paymentAccepted": ["Cash", "M-Pesa", "Bank Transfer", "Credit Card"],
    "openingHours": ["Mo-Fr 08:00-18:00", "Sa 08:00-16:00"],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Nairobi, Kenya",
      "addressLocality": "Nairobi",
      "addressRegion": "Nairobi County",
      "addressCountry": "KE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -1.286389,
      "longitude": 36.817223
    },
    "areaServed": KENYA_COUNTIES.map(county => ({
      "@type": "AdministrativeArea",
      "name": `${county.name} County`,
      "containedIn": {
        "@type": "Country",
        "name": "Kenya"
      }
    })),
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "EmersonEIMS Power Solutions",
      "numberOfItems": 9,
      "itemListElement": EMERSON_SERVICES.map((service, i) => ({
        "@type": "Offer",
        "position": i + 1,
        "name": service.fullName,
        "description": service.description,
        "warranty": service.warranty,
        "priceSpecification": {
          "@type": "PriceSpecification",
          "priceCurrency": "KES",
          "description": service.priceRange
        }
      }))
    },
    "knowsAbout": [
      "Generator Installation Kenya",
      "Generator Maintenance Kenya",
      "3 Year Generator Warranty",
      "Solar Installation Kenya",
      "UPS Systems Kenya",
      "Motor Rewinding Kenya",
      "Borehole Drilling Kenya",
      "AC Installation Kenya",
      "Electrical Services Kenya",
      "Welding Services Kenya",
      "Plumbing Services Kenya"
    ],
    "makesOffer": INDUSTRY_TARGETS.map(industry => ({
      "@type": "Offer",
      "name": `Power Solutions for ${industry.industry}`,
      "description": industry.description,
      "eligibleCustomerType": industry.industry
    })),
    "award": [
      "Best Generator Company Kenya 2024",
      "Top Solar Installer East Africa",
      "ISO 9001:2015 Certified"
    ],
    "slogan": "3-Year Warranty | 47 Counties | 24/7 Emergency Service",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "512",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Organization",
          "name": "Kenyatta National Hospital"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "reviewBody": "EmersonEIMS installed our backup generator system. Excellent service and the 3-year warranty gives us peace of mind."
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Organization",
          "name": "Sarova Hotels"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "reviewBody": "Reliable power solutions for our hotel chain across Kenya. 24/7 support is invaluable."
      }
    ]
  };

  // Service Area Schema for each county
  const serviceAreaSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Power Solutions & Maintenance",
    "provider": {
      "@type": "LocalBusiness",
      "name": "EmersonEIMS"
    },
    "areaServed": KENYA_COUNTIES.map(county => ({
      "@type": "AdministrativeArea",
      "name": county.name,
      "containsPlace": county.towns.map(town => ({
        "@type": "City",
        "name": town
      }))
    })),
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "EmersonEIMS Services - All 47 Counties",
      "itemListElement": EMERSON_SERVICES.map(service => ({
        "@type": "Service",
        "name": service.name,
        "description": service.description
      }))
    }
  };

  // Industry-specific Schema
  const industrySchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "EmersonEIMS Industry Solutions",
    "description": `Power solutions for Kenya's ${KENYA_STATS.hospitals.toLocaleString()}+ hospitals, ${KENYA_STATS.hotels.toLocaleString()}+ hotels, ${KENYA_STATS.restaurants.toLocaleString()}+ restaurants, ${KENYA_STATS.schools.toLocaleString()}+ schools`,
    "itemListElement": INDUSTRY_TARGETS.map((industry, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "Service",
        "name": `Power Solutions for ${industry.industry}`,
        "description": industry.description,
        "provider": {
          "@type": "LocalBusiness",
          "name": "EmersonEIMS"
        }
      }
    }))
  };

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.emersoneims.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Services",
        "item": "https://www.emersoneims.com/services"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Maintenance Hub",
        "item": "https://www.emersoneims.com/maintenance-hub"
      }
    ]
  };

  // WebSite Schema with SearchAction
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "EmersonEIMS",
    "alternateName": "Emerson Energy Infrastructure Management Solutions",
    "url": "https://www.emersoneims.com",
    "description": `Kenya's #1 Power Solutions Provider. 3-Year Generator Warranty. ${KENYA_STATS.counties} Counties. ${KENYA_STATS.hospitals.toLocaleString()}+ Hospitals. ${KENYA_STATS.hotels.toLocaleString()}+ Hotels.`,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.emersoneims.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "EmersonEIMS",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.emersoneims.com/images/logo-tagline.png"
      }
    }
  };

  return (
    <>
      {/* Main Service Schema */}
      <Script
        id="emerson-service-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* Professional Service Schema */}
      <Script
        id="emerson-professional-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
      />

      {/* FAQ Schema */}
      <Script
        id="emerson-faq-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Service Area Schema */}
      <Script
        id="emerson-service-area-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceAreaSchema) }}
      />

      {/* Industry Schema */}
      <Script
        id="emerson-industry-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(industrySchema) }}
      />

      {/* Breadcrumb Schema */}
      <Script
        id="emerson-breadcrumb-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Website Schema */}
      <Script
        id="emerson-website-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      {/* Hidden SEO Content for Crawlers */}
      <div className="sr-only" aria-hidden="true">
        <h2>EmersonEIMS - Kenya's #1 Power Solutions Provider</h2>
        <p>3-YEAR WARRANTY on all generator installations</p>
        <p>Serving all 47 Kenya counties</p>
        <p>
          {KENYA_STATS.hospitals.toLocaleString()}+ hospitals |
          {KENYA_STATS.hotels.toLocaleString()}+ hotels |
          {KENYA_STATS.restaurants.toLocaleString()}+ restaurants |
          {KENYA_STATS.schools.toLocaleString()}+ schools
        </p>

        <h3>Our 9 Services</h3>
        <ul>
          {EMERSON_SERVICES.map(service => (
            <li key={service.id}>{service.fullName} - {service.warranty} Warranty</li>
          ))}
        </ul>

        <h3>Counties We Serve</h3>
        <ul>
          {KENYA_COUNTIES.map(county => (
            <li key={county.id}>
              {county.name} County - Towns: {county.towns.join(', ')} -
              Constituencies: {county.constituencies.join(', ')}
            </li>
          ))}
        </ul>

        <h3>Industries We Power</h3>
        <ul>
          {INDUSTRY_TARGETS.map(industry => (
            <li key={industry.industry}>
              {industry.industry} ({industry.count}) - {industry.description}
            </li>
          ))}
        </ul>

        <h3>Frequently Asked Questions</h3>
        {SEO_FAQS.map((faq, i) => (
          <div key={i}>
            <h4>{faq.question}</h4>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT INDIVIDUAL SCHEMAS FOR USE IN SPECIFIC PAGES
// ═══════════════════════════════════════════════════════════════════════════════
export {
  generateServiceSchema,
  generateFAQSchema,
  KENYA_COUNTIES,
  EMERSON_SERVICES,
  INDUSTRY_TARGETS,
  KENYA_STATS,
  SEO_FAQS
};
