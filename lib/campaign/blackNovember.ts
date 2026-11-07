/**
 * BLACK NOVEMBER 2026: the only source for the campaign's wording and terms.
 *
 * Owner brief, 7 Nov 2026 (homepage ad request plus the owner's own banner):
 *   - generators 40 kVA to 1,500 kVA at competitive prices
 *   - owner, 7 Nov 2026 (later the same day): remove the word VOLTKA from the
 *     ad and say "Generators powered by Cummins engines" instead
 *   - free ATS; 6 months free service; 2-year warranty; free countrywide
 *     delivery; free installation below 100 kVA; maintenance & synchronization
 *   - giving back to loyal customers and welcoming new ones
 *   - runs for six months (owner: "extended for the next 6 months")
 *
 * Deliberately NOT used, from the external review the owner pasted:
 *   - "Offer Extended": the offer starts now, so nothing has been extended yet;
 *   - a discount percentage: none was given, so none is shown;
 *   (The Cummins engine statement was added on the owner's instruction above.)
 * Benefit scope (ATS rating, number of service visits, delivery and installation
 * limits) is NOT invented here: the ad says it is written in the quotation.
 */
export const CAMPAIGN_START = '2026-11-07';
/** Six months from launch, per the owner. Remove the ad from the homepage after this date. */
export const CAMPAIGN_END = '2027-05-07';
export const CAMPAIGN_END_LABEL = '7 May 2027';

export const CAMPAIGN = {
  eyebrow: 'Black November 2026',
  headlineTop: 'Power that',
  headlineBottom: 'means business.',
  lead: 'A thank-you to our loyal customers and a welcome to new ones. Generators powered by Cummins engines, from 40 kVA to 1,500 kVA, at Black November prices, delivered and supported by our own engineers.',
  ctaQuote: 'Get my generator quote',
  quoteHref: '/contact?type=black-november',
  termsHref: '/black-november',
  whatsappText: 'Hello EmersonEIMS, I would like a Black November quotation for a generator powered by a Cummins engine. Size (kVA) / site location: ',
} as const;

export interface CampaignBenefit {
  title: string;
  detail: string;
  icon: 'ats' | 'service' | 'warranty' | 'delivery' | 'install' | 'sync';
  /** false for "we also do" services that are not part of the free package. */
  free: boolean;
}

export const CAMPAIGN_BENEFITS: readonly CampaignBenefit[] = [
  { title: 'Free ATS', detail: 'Automatic transfer switch with your generator', icon: 'ats', free: true },
  { title: '6 months free service', detail: 'Scheduled servicing after commissioning', icon: 'service', free: true },
  { title: '2-year warranty', detail: 'On every generator we sell', icon: 'warranty', free: true },
  { title: 'Free countrywide delivery', detail: 'To your site in any of the 47 counties', icon: 'delivery', free: true },
  { title: 'Free installation', detail: 'For generators below 100 kVA', icon: 'install', free: true },
  { title: 'Maintenance & synchronization', detail: 'Servicing, repairs and multi-set synchronization', icon: 'sync', free: false },
];

export const CAMPAIGN_TERMS: readonly string[] = [
  `Applies to qualifying purchases of new generators powered by Cummins engines (40 kVA to 1,500 kVA) ordered from ${'7 November 2026'} to ${CAMPAIGN_END_LABEL}.`,
  'The ATS rating, the number of free service visits, the delivery point and the installation scope for your generator are written in your quotation before you pay.',
  'Free installation applies to generators below 100 kVA. Larger sets are installed to a separate quotation.',
  'The 2-year warranty applies to every generator we sell; cover depends on servicing at the stated intervals.',
  'Maintenance, repairs and synchronization are paid services, quoted separately.',
  'Subject to stock availability. Prices and benefits are confirmed in writing in your quotation.',
];

/** Owner photos used by the ad, in story order: stock, dispatch, road, site. */
export const CAMPAIGN_SCENES: readonly { src: string; alt: string; caption: string }[] = [
  { src: '/images/voltka/voltka-vks165-stock-forklift.webp', alt: 'Generators powered by Cummins engines in stock at the EmersonEIMS warehouse', caption: 'In stock at our warehouse' },
  { src: '/images/voltka/voltka-vks44-crane-dispatch-wide.webp', alt: 'Generator crane-loaded onto a delivery truck at the EmersonEIMS warehouse', caption: 'Dispatch day' },
  { src: '/images/campaign/voltka-on-the-road.webp', alt: 'Super Silent generator strapped on a crane truck on the highway', caption: 'On the road to your site' },
  { src: '/images/campaign/voltka-vks44-site-offload.webp', alt: 'EmersonEIMS team guiding a generator off the truck at a client site', caption: 'Delivered and installed' },
];
