// ═══════════════════════════════════════════════════════════════════════════════
// SECTOR CONFIGURATION — Source of Truth for "Solutions by Sector"
// All `href` values are VERIFIED against the live App Router at audit time
// (May 2026). Slugs that conflict with existing static `/solutions/*` routes
// are intentionally avoided (next.js resolves static routes before [slug]).
// ═══════════════════════════════════════════════════════════════════════════════

export interface SectorSolutionLink {
  /** Display label shown to the user */
  label: string;
  /** Verified existing public route */
  href: string;
}

export interface SectorConfig {
  /** URL slug — used as `/solutions/[slug]` */
  slug: string;
  /** <title> tag value */
  seoTitle: string;
  /** <meta description> value */
  seoDescription: string;
  /** Page H1 */
  h1: string;
  /** One-sentence pain statement (used on homepage card + landing intro) */
  painStatement: string;
  /** Curated list of services relevant to this sector */
  solutionList: SectorSolutionLink[];
  /** Primary CTA label */
  ctaText: string;
  /** Primary CTA href (sector context preserved via ?sector= query) */
  ctaHref: string;
}

export const SECTOR_SLUGS = [
  'hospitals',
  'schools',
  'hotels',
  'factories',
  'farms',
  'real-estate',
] as const;

export type SectorSlug = (typeof SECTOR_SLUGS)[number];

export const SECTOR_CONFIG: Record<SectorSlug, SectorConfig> = {
  hospitals: {
    slug: 'hospitals',
    seoTitle: 'Power Solutions for Hospitals & Healthcare in Kenya | EmersonEIMS',
    seoDescription:
      'Standby generators, UPS, solar and HVAC for Kenyan hospitals — SLA-backed maintenance, 24/7 emergency response, ICU-grade power continuity. Call +254768860665.',
    h1: 'Power Continuity for Hospitals & Healthcare Facilities',
    painStatement:
      'A single power dip in theatre, ICU or the lab can cost lives, spoil vaccines and trigger HSC penalties — most facilities still rely on a single ageing genset with no UPS bridge.',
    solutionList: [
      { label: 'Standby Generators (20 – 2000 kVA)', href: '/generators' },
      { label: 'UPS Systems for ICU & Theatre', href: '/services/ups-systems' },
      { label: 'Solar Hybrid for Day-Load', href: '/solar' },
      { label: 'ATS / Auto-Changeover', href: '/services/ats-changeover' },
      { label: 'HVAC for Wards & Pharmacies', href: '/services/ac-installation' },
      { label: 'Medical Waste Incinerators', href: '/solutions/incinerators' },
      { label: 'Preventive Maintenance Plans', href: '/maintenance-hub/generators' },
    ],
    ctaText: 'Request a Hospital Power Audit',
    ctaHref: '/contact?sector=hospitals',
  },
  schools: {
    slug: 'schools',
    seoTitle: 'Power & Water Solutions for Schools & Universities Kenya | EmersonEIMS',
    seoDescription:
      'Generators, solar, boreholes and motor rewinding for Kenyan schools, colleges and universities — exam-safe backup power and term-time SLA maintenance.',
    h1: 'Reliable Power & Water for Schools, Colleges & Universities',
    painStatement:
      'Mid-exam blackouts, dry boreholes during third term and rewinding bills on aging water pumps quietly drain school budgets every single year.',
    solutionList: [
      { label: 'School-Grade Standby Generators', href: '/generators' },
      { label: 'Solar PV for Classrooms & Hostels', href: '/solar' },
      { label: 'Borehole Pumps & Water Systems', href: '/services/borehole-pumps' },
      { label: 'UPS for Computer Labs & Servers', href: '/services/ups-systems' },
      { label: 'Motor Rewinding (Pumps & Workshops)', href: '/services/motor-rewinding' },
      { label: 'Termly Maintenance Contracts', href: '/maintenance-hub/generators' },
    ],
    ctaText: 'Get a School Term-Plan Quote',
    ctaHref: '/contact?sector=schools',
  },
  hotels: {
    slug: 'hotels',
    seoTitle: 'Power, HVAC & Solar for Hotels & Lodges Kenya | EmersonEIMS',
    seoDescription:
      'Silent canopy generators, HVAC, solar water heating and UPS for Kenyan hotels, resorts and lodges — guest-grade reliability with whisper-quiet running.',
    h1: 'Guest-Grade Power, Cooling & Solar for Hotels & Lodges',
    painStatement:
      'Guests do not forgive a 30-second blackout in the middle of dinner — yet most hotels still run noisy, fuel-thirsty gensets with no soft-load transfer to UPS.',
    solutionList: [
      { label: 'Silent Canopy Generators', href: '/generators' },
      { label: 'UPS for Reception, POS & Kitchens', href: '/services/ups-systems' },
      { label: 'Solar PV & Solar Water Heating', href: '/solar' },
      { label: 'HVAC Install & Service', href: '/services/ac-installation' },
      { label: 'ATS / Soft-Load Changeover', href: '/services/ats-changeover' },
      { label: 'Power Interruption Protection', href: '/solutions/power-interruptions' },
    ],
    ctaText: 'Plan Your Hotel Power Upgrade',
    ctaHref: '/contact?sector=hotels',
  },
  factories: {
    slug: 'factories',
    seoTitle: 'Industrial Power Solutions for Factories & Manufacturing Kenya | EmersonEIMS',
    seoDescription:
      'Heavy-duty generators, motor rewinding, ATS, high-voltage and diesel automation for Kenyan factories — minimise downtime, protect production lines.',
    h1: 'Heavy-Duty Power & Drives for Factories & Manufacturing',
    painStatement:
      'Every minute of unplanned downtime on a production line costs more than a year of preventive maintenance — yet most plants still react to failures instead of monitoring them.',
    solutionList: [
      { label: 'Industrial Generators (up to 2000 kVA)', href: '/generators' },
      { label: 'Motor Rewinding & Repair', href: '/services/motor-rewinding' },
      { label: 'High-Voltage Solutions', href: '/solutions/high-voltage' },
      { label: 'Diesel Automation & Remote Control', href: '/solutions/diesel-automation' },
      { label: 'ATS / Synchronisation Panels', href: '/services/ats-changeover' },
      { label: 'Steel Fabrication & Skids', href: '/solutions/fabrication' },
      { label: 'Industrial Maintenance Hub', href: '/maintenance-hub/generators' },
    ],
    ctaText: 'Book a Factory Site Survey',
    ctaHref: '/contact?sector=factories',
  },
  farms: {
    slug: 'farms',
    seoTitle: 'Solar, Borehole & Generator Solutions for Farms & Ranches Kenya | EmersonEIMS',
    seoDescription:
      'Solar pumping, borehole drilling, irrigation power and standby generators for Kenyan farms, flower farms and ranches — off-grid ready, agronomy-aware.',
    h1: 'Off-Grid Power, Pumping & Cooling for Farms & Ranches',
    painStatement:
      'Diesel for irrigation pumps and cold rooms is the silent killer of farm margins — and a single dry borehole or burned-out motor can wipe out a whole season.',
    solutionList: [
      { label: 'Solar Pumping & Off-Grid PV', href: '/solar' },
      { label: 'Borehole Pumps & Drilling Support', href: '/services/borehole-pumps' },
      { label: 'Standby Generators for Cold Rooms', href: '/generators' },
      { label: 'Motor Rewinding (Pumps & Conveyors)', href: '/services/motor-rewinding' },
      { label: 'HVAC for Greenhouses & Cold Stores', href: '/services/ac-installation' },
      { label: 'Diesel Automation for Remote Sites', href: '/solutions/diesel-automation' },
    ],
    ctaText: 'Get a Farm Energy Audit',
    ctaHref: '/contact?sector=farms',
  },
  'real-estate': {
    slug: 'real-estate',
    seoTitle: 'Power, UPS & Solar for Real Estate, Apartments & Malls Kenya | EmersonEIMS',
    seoDescription:
      'Building-wide generators, lift UPS, solar common-area lighting, HVAC and ATS for Kenyan apartments, malls, offices and gated estates.',
    h1: 'Building-Wide Power for Real Estate, Apartments & Malls',
    painStatement:
      'Lifts stuck between floors, dark common areas and tenants threatening to walk — most property managers discover their genset is undersized only on the day it fails.',
    solutionList: [
      { label: 'Building-Wide Standby Generators', href: '/generators' },
      { label: 'UPS for Lifts, Pumps & Fire Panels', href: '/services/ups-systems' },
      { label: 'Solar for Common-Area Lighting', href: '/solar' },
      { label: 'HVAC Design & Service', href: '/services/ac-installation' },
      { label: 'ATS / Auto-Changeover Panels', href: '/services/ats-changeover' },
      { label: 'Building Solutions Suite', href: '/solutions/building' },
      { label: 'Power Interruption Protection', href: '/solutions/power-interruptions' },
    ],
    ctaText: 'Schedule a Building Power Audit',
    ctaHref: '/contact?sector=real-estate',
  },
};

/** Ordered list of sectors for grids/menus */
export const SECTOR_LIST: ReadonlyArray<SectorConfig> = SECTOR_SLUGS.map(
  (slug) => SECTOR_CONFIG[slug],
);

export function isValidSectorSlug(slug: string): slug is SectorSlug {
  return (SECTOR_SLUGS as readonly string[]).includes(slug);
}
