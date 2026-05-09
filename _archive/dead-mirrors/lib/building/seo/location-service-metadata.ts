/**
 * LOCATION-SERVICE METADATA GENERATOR
 * Generates SEO metadata for location + service page combinations
 */

import { Metadata } from 'next';
import { SEOService, generateServiceKeywords } from '@/lib/data/seo-services';

interface LocationData {
  name: string;
  slug: string;
  type: 'county' | 'constituency' | 'village';
}

interface ParentLocation {
  county?: { name: string; slug: string };
  constituency?: { name: string; slug: string };
}

/**
 * Generate comprehensive metadata for location + service pages
 */
export function generateLocationServiceMetadata(
  location: LocationData,
  service: SEOService,
  parent?: ParentLocation
): Metadata {
  const locationName = location.name;
  const title = service.metaTemplate.title.replace(/{location}/g, locationName);
  const description = service.metaTemplate.description.replace(/{location}/g, locationName);
  const keywords = generateServiceKeywords(service, locationName);

  // Build canonical URL
  let canonicalPath = '/kenya';
  if (parent?.county) {
    canonicalPath += `/${parent.county.slug}`;
  }
  if (parent?.constituency) {
    canonicalPath += `/${parent.constituency.slug}`;
  }
  if (location.type !== 'county' || !parent?.county) {
    canonicalPath += `/${location.slug}`;
  }
  canonicalPath += `/${service.slug}`;

  const canonicalUrl = `https://www.emersoneims.com${canonicalPath}`;

  // Build breadcrumb trail for description
  const breadcrumbParts: string[] = ['Kenya'];
  if (parent?.county) {
    breadcrumbParts.push(parent.county.name);
  }
  if (parent?.constituency) {
    breadcrumbParts.push(parent.constituency.name);
  }
  if (location.type === 'village') {
    breadcrumbParts.push(locationName);
  }

  return {
    title,
    description,
    keywords: keywords.join(', '),
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_KE',
      url: canonicalUrl,
      siteName: 'Emerson EiMS',
      images: [
        {
          url: 'https://www.emersoneims.com/og-service-location.jpg',
          width: 1200,
          height: 630,
          alt: `${service.name} in ${locationName} - Emerson EiMS`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@emersoneims',
      creator: '@emersoneims',
      images: ['https://www.emersoneims.com/twitter-service-location.jpg']
    },
    alternates: {
      canonical: canonicalUrl
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    other: {
      'geo.region': 'KE',
      'geo.placename': locationName,
      'format-detection': 'telephone=yes'
    }
  };
}

/**
 * Generate metadata for county landing pages
 */
export function generateCountyMetadata(
  countyName: string,
  countySlug: string,
  population?: number
): Metadata {
  const title = `Generator & Power Solutions in ${countyName} County | Emerson EiMS`;
  const description = `Professional generator installation, repair & maintenance in ${countyName} County, Kenya. Solar power, UPS systems, electrical services. Serving ${population ? population.toLocaleString() + '+ residents. ' : ''}24/7 emergency support. Call +254768860665`;

  return {
    title,
    description,
    keywords: [
      `generators ${countyName}`,
      `generator companies ${countyName}`,
      `power solutions ${countyName}`,
      `solar installation ${countyName}`,
      `generator repair ${countyName}`,
      `generator maintenance ${countyName}`,
      `generator rental ${countyName}`,
      `${countyName} generator services`,
      `${countyName} county power`,
      `electrician ${countyName}`
    ].join(', '),
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_KE',
      url: `https://www.emersoneims.com/kenya/${countySlug}`,
      siteName: 'Emerson EiMS'
    },
    alternates: {
      canonical: `https://www.emersoneims.com/kenya/${countySlug}`
    },
    robots: {
      index: true,
      follow: true
    }
  };
}

/**
 * Generate metadata for constituency pages
 */
export function generateConstituencyMetadata(
  constituencyName: string,
  constituencySlug: string,
  countyName: string,
  countySlug: string
): Metadata {
  const title = `Generator Services in ${constituencyName}, ${countyName} | Emerson EiMS`;
  const description = `Professional generator & power solutions in ${constituencyName}, ${countyName} County. Installation, repair, maintenance, rentals. 24/7 emergency service. Call +254768860665`;

  return {
    title,
    description,
    keywords: [
      `generators ${constituencyName}`,
      `generator repair ${constituencyName}`,
      `power solutions ${constituencyName}`,
      `solar installation ${constituencyName}`,
      `${constituencyName} ${countyName}`,
      `generator services ${constituencyName}`
    ].join(', '),
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_KE',
      url: `https://www.emersoneims.com/kenya/${countySlug}/${constituencySlug}`,
      siteName: 'Emerson EiMS'
    },
    alternates: {
      canonical: `https://www.emersoneims.com/kenya/${countySlug}/${constituencySlug}`
    },
    robots: {
      index: true,
      follow: true
    }
  };
}

/**
 * Generate metadata for village pages
 */
export function generateVillageMetadata(
  villageName: string,
  villageSlug: string,
  constituencyName: string,
  constituencySlug: string,
  countyName: string,
  countySlug: string
): Metadata {
  const title = `Generator Services in ${villageName}, ${constituencyName} | Emerson EiMS`;
  const description = `Professional generator & power solutions in ${villageName}, ${constituencyName}, ${countyName}. Installation, repair, maintenance. Fast response. Call +254768860665`;

  return {
    title,
    description,
    keywords: [
      `generators ${villageName}`,
      `generator repair ${villageName}`,
      `power solutions ${villageName}`,
      `${villageName} ${constituencyName}`,
      `${villageName} ${countyName}`
    ].join(', '),
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_KE',
      url: `https://www.emersoneims.com/kenya/${countySlug}/${constituencySlug}/${villageSlug}`,
      siteName: 'Emerson EiMS'
    },
    alternates: {
      canonical: `https://www.emersoneims.com/kenya/${countySlug}/${constituencySlug}/${villageSlug}`
    },
    robots: {
      index: true,
      follow: true
    }
  };
}
