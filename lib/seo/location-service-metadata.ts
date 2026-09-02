/**
 * LOCATION-SERVICE METADATA GENERATOR
 * Generates SEO metadata for location + service page combinations
 */

import { Metadata } from 'next';
import { SEOService, generateServiceKeywords } from '@/lib/data/seo-services';
import { hasConstituencyData } from '@/lib/data/kenya-constituency-conditions';

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
  const selfPath = `/kenya/${segs.join('/')}/${service.slug}`;

  /*
   * CONSOLIDATION (2026-08-08): a constituency+service page canonicalises UP
   * to the county+service page for the same service.
   *
   * This is not undoing the July fix above. That fix repaired a canonical
   * that pointed at a URL which 404s; self-canonicalising was the correct
   * repair for a broken value, not a decision that these pages should each
   * compete on their own. This is that decision, and it is deliberate.
   *
   * WHY. The constituency pages were measured at 98% identical vocabulary to
   * one another and to the county page — four distinct words separated the
   * Nairobi page from the Mombasa one, because the template substitutes a
   * place name and changes nothing else, FAQs included. Google had already
   * reached that conclusion on its own: it consolidated a Turkana URL onto a
   * Mombasa ward, i.e. it judged pages in different counties interchangeable.
   * Asking it to index 870 more of them was arguing with a verdict it had
   * already reached on the evidence.
   *
   * Pointing them at the COUNTY+SERVICE page rather than the bare county page
   * preserves the service intent: someone searching "generator repair
   * Westlands" is best served by the Nairobi generator-repairs page, not by a
   * generic Nairobi landing page.
   *
   * NOTHING IS DELETED and nothing is redirected. Every constituency URL
   * still serves HTTP 200, still renders, still carries index/follow, and is
   * still reachable and linked. The canonical is a consolidation signal, not
   * a removal — visitors and internal links are entirely unaffected.
   *
   * The county pages now carry genuinely differentiated engineering
   * (components/seo/CountySiteConditions.tsx, driven by sourced per-county
   * altitude), so the consolidated target is a page that has something the
   * duplicates did not.
   */
  /*
   * REVISED 2026-08-08 (same day): consolidate only where we have nothing
   * unique to say.
   *
   * The blanket consolidation below was correct while every constituency page
   * was the same template with a place name swapped in. It is no longer
   * correct for the 119 constituencies that now carry their own VERIFIED
   * altitude and measured 2025 temperature, plus an altitude ranking against
   * their own county that is true of exactly one page. Those pages have
   * something their siblings cannot repeat, so canonicalising them away would
   * suppress content that deserves to rank on its own.
   *
   * The rule is the honest one in both directions: a page earns a
   * self-canonical by having unique substance, and forfeits it by not having
   * any. Constituencies we could not confirm — mostly directional divisions
   * like "Kajiado North", which are not settlements and for which inventing a
   * figure was refused — keep consolidating to their county+service page.
   *
   * This is also self-correcting. If Google disagrees and consolidates the
   * differentiated pages anyway, nothing is lost: we simply do not rank for
   * them, which is exactly where a canonical pointing away would have left us.
   * The asymmetry favours letting genuinely distinct pages compete.
   */
  const consolidateToCounty =
    location.type === 'constituency' &&
    !!parent?.county &&
    !hasConstituencyData(parent.county.slug, location.slug);
  const canonicalPath = consolidateToCounty
    ? `/kenya/${parent!.county!.slug}/${service.slug}`
    : selfPath;

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
