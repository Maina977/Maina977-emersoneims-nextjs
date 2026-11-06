/**
 * Article -> product/service page links (external audit, Nov 2026, §6.4:
 * "strengthen internal links from technical articles to corresponding product
 * and service pages").
 *
 * Blog articles carry `relatedServices` keys. Until 2026-11-06 those linked to
 * /kenya/nairobi/<key> location pages (many now noindex) or rendered as plain
 * text. Each key now points at the main commercial page for that product or
 * service. Every target is a served, indexable route (checked against the
 * sitemap on 2026-11-06; pinned by tests/regression/article-links-2026-11-06.test.ts).
 */
export const SERVICE_PAGE: Record<string, { href: string; label: string }> = {
  generators: { href: '/generators', label: 'Generators for sale' },
  'diesel-generators': { href: '/generators', label: 'Diesel generators' },
  'generator-companies': { href: '/generators', label: 'Buying a generator' },
  'generator-maintenance': { href: '/generators/maintenance', label: 'Generator maintenance' },
  'generator-repairs': { href: '/services/generator-repairs', label: 'Generator repairs' },
  'generator-installation': { href: '/generators/installation', label: 'Generator installation' },
  'generator-sizing': { href: '/calculators', label: 'Generator sizing calculators' },
  'spare-parts': { href: '/generators/spare-parts', label: 'Generator spare parts' },
  'solar-installation': { href: '/solar', label: 'Solar installation' },
  'ups-systems': { href: '/services/ups-systems', label: 'UPS systems' },
  'ups-installation': { href: '/services/ups-systems', label: 'UPS installation' },
  'electrical-installation': { href: '/services/distribution-boards', label: 'Distribution boards and electrical' },
  'high-voltage': { href: '/solutions/high-voltage', label: 'High-voltage systems' },
  'transformer-installation': { href: '/solutions/high-voltage', label: 'Transformers and HV' },
  'borehole-pumps': { href: '/services/borehole-pumps', label: 'Borehole pumps' },
  'pump-installation': { href: '/services/borehole-pumps', label: 'Pump installation' },
  'ac-installation': { href: '/services/ac-installation', label: 'AC installation' },
  hvac: { href: '/services/air-conditioning', label: 'Air conditioning and HVAC' },
  'borehole-drilling': { href: '/services/borehole-drilling', label: 'Borehole drilling' },
  'motor-rewinding': { href: '/services/motor-rewinding', label: 'Motor rewinding' },
  incinerators: { href: '/services/hospital-incinerators', label: 'Incinerators' },
  'ats-changeover': { href: '/services/ats-changeover', label: 'ATS and changeover panels' },
  'solar-inverters': { href: '/services/solar-inverters', label: 'Solar inverters' },
};

/** De-duplicated product/service links for an article, in its own order. */
export function articleServiceLinks(keys: readonly string[]): { href: string; label: string }[] {
  const seen = new Set<string>();
  const out: { href: string; label: string }[] = [];
  for (const k of keys) {
    const link = SERVICE_PAGE[k];
    if (link && !seen.has(link.href)) {
      seen.add(link.href);
      out.push(link);
    }
  }
  return out;
}
