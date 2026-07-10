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

  // Build canonical URL.
  // BUG FIX (Search Console audit 2026-07-10): when the location IS the
  // constituency (constituency-service pages), the old logic appended the
  // constituency slug twice -- the canonical pointed to
  // /kenya/kiambu/kiambaa/kiambaa/generators, which 404s. Google therefore
  // treated every constituency+service page as a non-canonical duplicate
  // and dropped the tier from the index. The location slug is now appended
  // only when it isn't already the last parent segment.
  const segs: string[] = [];
  if (parent?.county) segs.push(parent.county.slug);
  if (parent?.constituency) segs.push(parent.constituency.slug);
  if (segs.length === 0 || segs[segs.length - 1] !== location.slug) {
    segs.push(location.slug);
  }
  const canonicalPath = `/kenya/${segs.join('/')}/${service.slug}`;

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
      siteName: 'EmersonEIMS',
      images: [
        {
          url: 'https://www.emersoneims.com/og-service-location.jpg',
          width: 1200,
          height: 630,
          alt: `${service.name} in ${locationName} - EmersonEIMS`
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
  const title = `Generators, Solar & Power Services in ${countyName} County`;
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
      siteName: 'EmersonEIMS'
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
  const title = `Generators & Power Services in ${constituencyName}, ${countyName}`;
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
      siteName: 'EmersonEIMS'
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
  const title = `Generators & Power Services in ${villageName}, ${constituencyName}`;
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
      siteName: 'EmersonEIMS'
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
