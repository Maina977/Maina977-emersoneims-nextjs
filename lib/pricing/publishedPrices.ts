/**
 * PUBLISHED PRICES — every figure here is already public on emersoneims.com.
 *
 * WHY THIS FILE EXISTS
 * An audit on 2026-08-17 found that of 1,385 URLs, exactly THREE targeted price
 * or cost intent, and all three were blog posts. No money page did. Meanwhile a
 * search for "generator price in Kenya 30kva" returned generators.co.ke with
 * /30kva-generator-price-in-kenya.html, generatorskenya.co.ke product pages and
 * Jiji — and no EmersonEIMS result. The same held for "borehole drilling cost
 * in Kenya", where nine of nine results carried cost or price in the URL.
 *
 * The gap was never the content. /generators already publishes a full per-kVA
 * table, /services/solar-energy publishes worked project costs, and so on. The
 * figures simply lived on pages whose titles answer "what do you do" rather
 * than "what does it cost" — which is the question a buyer types.
 *
 * NOTHING HERE IS INVENTED. Every number was read off the live site and is
 * recorded with the page it came from. If a figure is wrong it is wrong at that
 * source too and must be corrected there first; this file is a second surface
 * for numbers the business already stands behind, not a new set of claims.
 *
 * Sources, read 2026-08-17:
 *   /generators                      per-kVA table and kVA bands
 *   /services/solar-energy           worked project costs and payback
 *   /services/borehole-pumps         pump and rehabilitation costs
 *   /services/ups-systems            UPS and battery costs
 *   /services/motor-rewinding        rewind costs
 *   /services/hospital-incinerators  incinerator costs
 */

export interface PriceRow {
  /** What is being priced — a size, a job, or a package. */
  item: string;
  /** Exactly as published, in KES. */
  price: string;
  /** Who it suits, where the source page says so. */
  note?: string;
  /** Flagged on the source page as a common choice. */
  popular?: boolean;
}

export interface PriceGuide {
  slug: string;
  /** Title targets the query a buyer types, not the service name. */
  title: string;
  h1: string;
  description: string;
  /** The service line, for the enquiry form. */
  service: string;
  intro: string;
  /** Page on emersoneims.com these figures were read from. */
  source: string;
  sourceLabel: string;
  rows: PriceRow[];
  /** What genuinely moves the price — buyers ask this before they ask for a quote. */
  drivers: string[];
  /** What the figures do NOT include. Stated because omitting it is how quotes surprise people. */
  excludes: string[];
  related?: { label: string; href: string }[];
}

const VAT_NOTE =
  'Figures are ex-VAT unless stated. Kenyan VAT is 16%, so a KES 600,000 quotation is KES 696,000 payable.';

export const PRICE_GUIDES: readonly PriceGuide[] = [
  {
    slug: 'generator-prices-kenya',
    title: 'Generator Prices in Kenya (2026)',
    h1: 'Generator prices in Kenya',
    description:
      'What a diesel generator actually costs in Kenya in 2026, by kVA — 10 kVA to 500 kVA, with real price ranges, what moves the price, and what a quotation excludes.',
    service: 'Generators',
    source: '/generators',
    sourceLabel: 'our generator range',
    intro:
      'These are the ranges we quote from, not indicative figures collected elsewhere. A range rather than one number is honest: the same kVA varies with brand, enclosure, controller and whether the set is standby or prime-rated.',
    rows: [
      { item: '10 kVA — single phase', price: 'KES 280,000 – 350,000', note: 'Shops, small offices, homes' },
      { item: '15 kVA — three phase', price: 'KES 380,000 – 450,000' },
      { item: '20 kVA — three phase', price: 'KES 480,000 – 580,000' },
      { item: '30 kVA — three phase', price: 'KES 650,000 – 780,000', note: 'Small business, clinics', popular: true },
      { item: '50 kVA — three phase', price: 'KES 950,000 – 1,150,000' },
      { item: '60 kVA — three phase', price: 'KES 1,100,000 – 1,350,000' },
      { item: '80 kVA — three phase', price: 'KES 1,400,000 – 1,700,000' },
      { item: '100 kVA — three phase', price: 'KES 1,750,000 – 2,100,000', note: 'Hotels, schools, factories', popular: true },
      { item: '150 kVA — three phase', price: 'KES 2,400,000 – 2,900,000' },
      { item: '200 kVA — three phase', price: 'KES 3,200,000 – 3,800,000' },
      { item: '250 kVA — three phase', price: 'KES 4,000,000 – 4,800,000' },
      { item: '300 kVA — three phase', price: 'KES 4,800,000 – 5,800,000' },
      { item: '500 kVA — three phase', price: 'KES 7,500,000 – 9,000,000', note: 'Large industrial' },
    ],
    drivers: [
      'Brand. VOLTKA sets start at KES 500,000 for 20 kVA; Cummins, Perkins and FG Wilson sit higher for the same output.',
      'Enclosure. A sound-attenuated canopy costs more than an open set and is usually non-negotiable in a built-up area.',
      'Controller. A basic auto-start panel is far cheaper than an AMF or synchronising controller.',
      'Rating. A standby-rated set is cheaper than a prime-rated one of the same kVA, and is the wrong choice if it will run daily.',
      'Site altitude and temperature. Above roughly 300 m a diesel engine loses output, so a highland site may need the next size up for the same load.',
    ],
    excludes: [
      'Civil works — base, plinth, bunding',
      'Cabling from the set to your changeover or board',
      'Fuel tank beyond the base tank supplied',
      'Transport and offloading outside Nairobi',
      'Installation labour and commissioning — priced separately on our service pricing page',
      VAT_NOTE,
    ],
    related: [
      { label: 'See the full generator range', href: '/generators' },
      { label: 'Installation & servicing pricing', href: '/pricing' },
    ],
  },

  {
    slug: 'solar-installation-cost-kenya',
    title: 'Solar Installation Cost in Kenya (2026)',
    h1: 'Solar installation cost in Kenya',
    description:
      'What a solar system costs in Kenya in 2026 — residential rooftop to commercial and ground-mount, with real project costs, annual savings and payback periods.',
    service: 'Solar Installation',
    source: '/services/solar-energy',
    sourceLabel: 'our solar engineering page',
    intro:
      'These are costs from projects of the type we build, quoted with the annual saving and payback alongside — because a solar price means nothing without them.',
    rows: [
      { item: 'Solar supply and installation — overall range', price: 'KES 120,000 – 15,000,000+', note: 'Small domestic systems through to commercial arrays' },
      { item: '5 kWp residential rooftop, no battery', price: 'KES 600,000 – 800,000', note: 'Saves ≈ KES 120,000 a year · 5–6 year payback. Self-consumption only', popular: true },
      { item: '10 kWh battery retrofit to an existing grid-tied array', price: 'KES 700,000 – 1,100,000', note: 'Evening self-consumption and diesel displaced during outages' },
      { item: '20 kWp + 30 kWh battery — small office', price: 'KES 3,500,000 – 4,500,000', note: 'Saves ≈ KES 720,000 a year · 5 year payback. Replaces ~70% of utility and diesel' },
      { item: '500 kWp commercial rooftop — supermarket', price: 'KES 45,000,000 – 55,000,000', note: 'Saves ≈ KES 11,000,000 a year · 4–5 year payback. Demand-charge reduction is key' },
      { item: '5 MWp ground-mount IPP', price: 'KES 450,000,000 – 550,000,000', note: 'PPA-driven · 6–8 year payback' },
    ],
    drivers: [
      'Battery or no battery. Storage is typically the single largest line, and a grid-tied array without it is far cheaper.',
      'Roof type and access. Sheet, tile and concrete each need different mounting, and a difficult roof adds labour.',
      'Panel temperature. Modules lose roughly 0.3–0.4% per °C above their 25 °C test condition, so a hot site needs more array for the same yield.',
      'Net metering. Where it applies, payback shortens materially.',
    ],
    excludes: [
      'Roof strengthening where a structural survey requires it',
      'Utility application fees and net-metering approval',
      'Generator or changeover integration where the site has one',
      VAT_NOTE,
    ],
    related: [
      { label: 'Solar services in detail', href: '/services/solar-energy' },
      { label: 'Size a system free', href: '/solar-genius-pro' },
    ],
  },

  {
    slug: 'borehole-cost-kenya',
    title: 'Borehole Pump & Rehabilitation Cost Kenya',
    h1: 'Borehole pump and rehabilitation costs in Kenya',
    description:
      'What borehole pump installation, solar pumping and borehole rehabilitation cost in Kenya in 2026 — real ranges, what drives them, and when rehabilitation beats drilling new.',
    service: 'Borehole Pumps',
    source: '/services/borehole-pumps',
    sourceLabel: 'our borehole engineering page',
    intro:
      'We price the pump, the power source and the protection separately, because those are the three decisions that actually move the number.',
    rows: [
      { item: 'Borehole pump work — overall range', price: 'KES 35,000 – 1,500,000+', note: 'From a straightforward replacement to a full solar-powered installation' },
      { item: '5.5 kW solar-direct borehole pump, off-grid farm', price: 'KES 750,000 – 1,100,000', note: 'Saves ≈ KES 220,000 a year against diesel pumping · 4–5 year payback', popular: true },
      { item: 'Borehole rehabilitation', price: 'KES 250,000 – 600,000', note: 'Against KES 1,500,000 – 3,000,000+ to drill a new borehole' },
      { item: '6″ submersible, 18.5 kW, community supply', price: 'KES 950,000 – 1,400,000', note: 'Revenue from water sales · about 2 year payback at 50 m³/day' },
      { item: 'VSD retrofit on an 11 kW farm booster', price: 'from KES 280,000', note: 'Saves ≈ KES 120,000 a year · 2.5 year payback, and reduces wear and water hammer' },
      { item: 'Dry-run and phase protection retrofit on an unprotected pump', price: 'KES 25,000 – 60,000', note: 'One avoided submersible motor replacement and pump pull runs KES 150,000 – 400,000' },
    ],
    drivers: [
      'Depth and yield. Both set the pump size, and the pump sets the power system.',
      'Power source. Solar-direct, grid, or generator-backed each change the cost substantially.',
      'Water chemistry. Aggressive water changes the materials specified.',
      'Whether the existing borehole can be rehabilitated — often a quarter the cost of drilling new.',
    ],
    excludes: [
      'Drilling a new borehole — a separate contract with its own per-metre rate',
      'Water permits and WRA authorisation',
      'Tank, tower and distribution beyond the borehole head',
      VAT_NOTE,
    ],
    related: [
      { label: 'Borehole services in detail', href: '/services/borehole-pumps' },
      { label: 'Check a site before drilling — free', href: '/aquascan-pro-v3' },
    ],
  },

  {
    slug: 'ups-price-kenya',
    title: 'UPS & Inverter Prices in Kenya (2026)',
    h1: 'UPS and inverter prices in Kenya',
    description:
      'What a UPS costs in Kenya in 2026 — desktop units to modular data-centre systems, plus battery replacement and retrofit costs, with the downtime each avoids.',
    service: 'UPS Systems',
    source: '/services/ups-systems',
    sourceLabel: 'our UPS engineering page',
    intro:
      'UPS pricing is dominated by runtime, not by kVA. Doubling the minutes usually costs more than doubling the load rating.',
    rows: [
      { item: 'UPS supply and installation — overall range', price: 'KES 8,000 – 5,000,000+', note: 'Desktop units through to three-phase systems' },
      { item: '10 kVA online UPS, server room, 15 minute runtime', price: 'KES 350,000 – 550,000', note: 'Avoided downtime ≈ KES 1,200,000 a year · pays back on the first incident', popular: true },
      { item: '160 kVA modular UPS (N+1), small data centre', price: 'KES 6,000,000 – 9,000,000', note: 'SLA-credit avoidance ≈ KES 4,000,000 a year · 2–3 year payback' },
      { item: 'Battery monitoring retrofit on an existing UPS', price: 'KES 250,000 – 600,000', note: 'Depending on string size. One avoided surprise string failure runs KES 400,000 – 1,000,000' },
      { item: 'Maintenance bypass retrofit', price: 'KES 300,000 – 700,000', note: 'Every future service visit stops needing a shutdown' },
    ],
    drivers: [
      'Runtime. The batteries, not the inverter, are usually the largest cost.',
      'Topology. Line-interactive is far cheaper than true online double-conversion, and wrong for sensitive loads.',
      'Redundancy. N+1 modular costs more up front and removes the single point of failure.',
      'Room temperature. Sealed lead-acid life roughly halves for every 10 °C above 25 °C, so cooling is part of the real cost of ownership.',
    ],
    excludes: [
      'Electrical works from the board to the UPS',
      'Room cooling and ventilation',
      'Disposal of the batteries being replaced',
      VAT_NOTE,
    ],
    related: [
      { label: 'UPS services in detail', href: '/services/ups-systems' },
      { label: 'Size a UPS free', href: '/hub' },
    ],
  },
] as const;

export function getPriceGuide(slug: string): PriceGuide | undefined {
  return PRICE_GUIDES.find((g) => g.slug === slug);
}

export function getAllPriceGuideSlugs(): string[] {
  return PRICE_GUIDES.map((g) => g.slug);
}
