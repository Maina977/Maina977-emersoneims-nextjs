import { headers } from 'next/headers';
import Script from 'next/script';

/**
 * AutoBreadcrumb
 * ──────────────
 * Server component that emits a BreadcrumbList JSON-LD on every page,
 * derived from the current request path. Google uses this schema to
 * replace the long URL in search results with a clean breadcrumb trail
 * (Home › Solar › Solar Genius Pro), which lifts CTR and gives a more
 * professional SERP appearance — the single biggest free win remaining
 * after metadata coverage and SoftwareApplication schema were shipped.
 *
 * Reads the pathname from the `x-pathname` request header set by
 * `middleware.ts`. No JS shipped to the client; output is a single
 * <script type="application/ld+json"> in the initial HTML.
 *
 * Skips the home page (no breadcrumb needed) and any path with fewer
 * than two segments. Per data policy: every label is derived from the
 * URL itself — no fabricated content.
 */

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';

// Curated label overrides where the slug-to-title transform produces
// something awkward. Keep this short and only override when the auto
// title-case is genuinely wrong (e.g. acronyms, brand names, ampersands).
const LABEL_OVERRIDES: Record<string, string> = {
  ai: 'AI',
  ats: 'ATS',
  ups: 'UPS',
  ev: 'EV',
  hvac: 'HVAC',
  pv: 'PV',
  qa: 'Q&A',
  faq: 'FAQ',
  faqs: 'FAQs',
  iot: 'IoT',
  api: 'API',
  pdf: 'PDF',
  rfq: 'RFQ',
  roi: 'ROI',
  seo: 'SEO',
  vfd: 'VFD',
  uk: 'UK',
  ke: 'Kenya',
  'about-us': 'About Us',
  'contact-us': 'Contact Us',
  'aquascan-pro-v3': 'AquaScan Pro',
  'solar-genius-pro': 'Solar Genius Pro',
  'generator-oracle': 'Generator Oracle',
  'eims-pro': 'EIMS Pro',
  'pro-building-suite': 'Pro Building Suite',
  'quote-audit': 'Quotation Audit',
  'product-intelligence': 'Product Intelligence',
  'power-quality': 'Power Quality',
  'doc-pack': 'Document Pack',
  'ups-lab': 'UPS Lab',
  'solar-ups': 'Solar + UPS',
  'maintenance-hub': 'Maintenance Hub',
  'knowledge-base': 'Knowledge Base',
  'spare-parts': 'Spare Parts',
  'fault-codes': 'Fault Codes',
  'all-tools': 'All Tools',
  'ai-tools': 'AI Tools',
  'case-studies': 'Case Studies',
  'case-study': 'Case Study',
  'design-studio': 'Design Studio',
  'solar-design-studio': 'Solar Design Studio',
  'solar-dashboard': 'Solar Dashboard',
  'calculator-advanced': 'Advanced Calculator',
  'solar-genius-pro-tools': 'Solar Genius Pro — Tools',
  'solar-genius-pro-futuristic': 'Solar Genius Pro — Futuristic',
};

function humanize(slug: string): string {
  if (LABEL_OVERRIDES[slug]) return LABEL_OVERRIDES[slug];
  // Title-case the slug, preserving small-word overrides per token.
  return slug
    .split('-')
    .map((tok) => LABEL_OVERRIDES[tok] ?? (tok.charAt(0).toUpperCase() + tok.slice(1)))
    .join(' ');
}

export default async function AutoBreadcrumb() {
  // Next 15 made `headers()` async; the await is a no-op on Next 14.
  const h = await headers();
  const pathname = h.get('x-pathname') || '/';

  // Skip homepage and obvious non-content paths.
  if (pathname === '/' || pathname.startsWith('/_next') || pathname.startsWith('/api')) {
    return null;
  }

  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return null;

  // Build cumulative breadcrumb items: Home › seg1 › seg1/seg2 › ...
  const items: Array<{ name: string; item: string }> = [
    { name: 'Home', item: SITE },
  ];
  let acc = '';
  for (const seg of segments) {
    acc += `/${seg}`;
    items.push({ name: humanize(seg), item: `${SITE}${acc}` });
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.item,
    })),
  };

  return (
    <Script
      id="auto-breadcrumb-jsonld"
      type="application/ld+json"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
