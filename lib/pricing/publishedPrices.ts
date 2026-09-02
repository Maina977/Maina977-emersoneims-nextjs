/**
 * PUBLISHED PRICES — every figure here traces to a source we can point at.
 *
 * TWO KINDS OF SOURCE, and the distinction matters:
 *   1. Public pages on emersoneims.com (the default). The figure is already
 *      visible on the named page; the guide restates it where a price search
 *      can reach it.
 *   2. Our own ERP trade catalogue (`sourceIsInternal: true`). Currently only
 *      the borehole drilling schedule. These are our schedule rates, published
 *      here for the first time, and the page says so rather than implying they
 *      were already public.
 *
 * WHAT MUST NEVER COME FROM THE ERP. Most of that catalogue is a "Master
 * Catalog Generator" that procedurally builds 7,841 SKUs — priceFromCost(c) is
 * c * 1.45 over formula costs like `hp * 90`, `ah * v * m / 10` and brand
 * multipliers, converted from USD. Those are seed data to populate an
 * inventory, NOT quoted prices, and publishing them would put invented numbers
 * on the site under our name. Only section 6b (borehole and water) is typed
 * directly in KES, and only that section is drawn on here. Two figures were
 * removed on 2026-08-25 after checking: solar pump inverters (18,000 + 14,000
 * per kW is a formula) and per-brand tank prices (base x brand factor).
 *
 * HOW TO VERIFY: compare by VALUE, never by string. Service pages write "600k"
 * and "3.5M" where this file writes "KES 600,000"; raw catalogue JS writes bare
 * digits inside arrays. A naive match reports figures missing that are plainly
 * present — that happened twice while building this.
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
  /**
   * Optional heading this row sits under. A schedule like borehole drilling has
   * genuinely distinct stages — survey, permits, mobilisation, drilling, casing,
   * testing — and flattening them into one list makes the page unreadable and
   * hides the fact that a borehole is a sequence of costs, not a single price.
   */
  group?: string;
  /** Unit the price is per: 'per metre', 'per job'. Blank means per item. */
  unit?: string;
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
  /**
   * Where the figures came from, when it is NOT a public page on the site.
   * Set for the borehole drilling schedule, which comes off our own ERP trade
   * catalogue rather than a published page — so the guide can say so plainly
   * instead of implying the numbers were already visible somewhere.
   */
  sourceIsInternal?: boolean;
  /** Optional lead paragraph explaining how to read a multi-stage schedule. */
  howToRead?: string;
  /**
   * What the index card shows as the headline figure.
   *
   * Falling back to rows[0] is wrong for a staged schedule: the first row of
   * the drilling guide is a KES 65,000 survey, and "From KES 65,000" next to
   * "borehole drilling" reads as the price of a borehole. Set this wherever
   * the first row is not a fair summary of the guide.
   */
  cardNote?: string;
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
    cardNote: 'Sets from KES 280,000',
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
    cardNote: 'Systems from KES 120,000',
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
    cardNote: 'Pump work from KES 35,000',
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
    cardNote: 'UPS from KES 8,000',
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
  {
    slug: 'borehole-drilling-cost-kenya',
    cardNote: 'Drilling from KES 6,000 per metre',
    title: 'Borehole Drilling Cost in Kenya (2026)',
    h1: 'Borehole drilling cost in Kenya',
    description:
      'What it actually costs to drill a borehole in Kenya in 2026 — survey, WRA and NEMA permits, rig mobilisation, drilling per metre by diameter and rock type, casing, test pumping, tanks and towers.',
    service: 'Borehole Drilling',
    source: '/services/borehole-pumps',
    sourceLabel: 'our borehole engineering page',
    sourceIsInternal: true,
    intro:
      'A borehole is not one price, it is a sequence of them. Most quotations in this market give a single lump sum, which is why two quotes for the same site can differ by a million shillings and neither can be checked. This is the schedule we quote from, item by item, so you can see exactly what you are paying for and compare like with like.',
    howToRead:
      'Work down the stages in order — they happen in that order on site. Drilling is charged per drilled metre and the rate depends on diameter and on what the drill meets; nobody can know the rock profile for certain until the hole is down, which is why the geophysical survey and the drilling prognosis come first and why an honest quote gives a rate, not a guess at the total.',
    rows: [
      // Stage 1 — before anything is drilled.
      { group: 'Survey & documentation', item: 'Hydrogeological survey & report (WRA-compliant)', price: 'KES 65,000', unit: 'per job', note: 'Desk study, site geology, groundwater potential, recommended depth and diameter', popular: true },
      { group: 'Survey & documentation', item: 'Geophysical survey — electrical resistivity, VES ×3', price: 'KES 45,000', unit: 'per job', note: 'Aquifer and fracture-zone identification, drill-point siting' },
      { group: 'Survey & documentation', item: 'Rock mapping & strata profile (drilling prognosis)', price: 'KES 35,000', unit: 'per job', note: 'Sets the per-metre rates and the casing plan' },
      { group: 'Survey & documentation', item: 'Drilling supervision by hydrogeologist', price: 'KES 12,000', unit: 'per day' },
      { group: 'Survey & documentation', item: 'WRA authorisation permit — application & statutory fees', price: 'KES 30,000', unit: 'per job', note: 'Drilling without this is illegal' },
      { group: 'Survey & documentation', item: 'NEMA environmental impact assessment & licence', price: 'KES 55,000', unit: 'per job' },
      { group: 'Survey & documentation', item: 'County government drilling permit & fees', price: 'KES 15,000', unit: 'per job' },
      { group: 'Survey & documentation', item: 'Borehole completion record & documentation pack', price: 'KES 12,000', unit: 'per job', note: 'Required for the abstraction permit' },

      // Stage 2 — getting the rig there.
      { group: 'Rig mobilisation', item: 'Mobilisation & demobilisation — within 50 km', price: 'KES 100,000', unit: 'per job' },
      { group: 'Rig mobilisation', item: 'Mobilisation & demobilisation — 50–150 km', price: 'KES 160,000', unit: 'per job' },
      { group: 'Rig mobilisation', item: 'Mobilisation & demobilisation — 150–300 km', price: 'KES 230,000', unit: 'per job' },
      { group: 'Rig mobilisation', item: 'Mobilisation & demobilisation — beyond 300 km', price: 'KES 320,000', unit: 'per job' },

      // Stage 3 — the metre rate, which is where the money is.
      { group: 'Drilling — per metre', item: '6″ — soft formation (soil, sand, clay)', price: 'KES 6,000', unit: 'per metre' },
      { group: 'Drilling — per metre', item: '6″ — medium formation (weathered rock, murram)', price: 'KES 7,500', unit: 'per metre' },
      { group: 'Drilling — per metre', item: '6″ — hard rock (basalt, granite)', price: 'KES 9,500', unit: 'per metre' },
      { group: 'Drilling — per metre', item: '8″ — soft formation', price: 'KES 7,500', unit: 'per metre' },
      { group: 'Drilling — per metre', item: '8″ — medium formation', price: 'KES 9,500', unit: 'per metre', popular: true },
      { group: 'Drilling — per metre', item: '8″ — hard rock', price: 'KES 12,500', unit: 'per metre' },
      { group: 'Drilling — per metre', item: '10″ — soft formation', price: 'KES 9,500', unit: 'per metre' },
      { group: 'Drilling — per metre', item: '10″ — medium formation', price: 'KES 12,000', unit: 'per metre' },
      { group: 'Drilling — per metre', item: '10″ — hard rock', price: 'KES 15,500', unit: 'per metre' },
      { group: 'Drilling — per metre', item: '8″ Symmetrix / ODEX — simultaneous casing', price: 'KES 16,000', unit: 'per metre', note: 'For collapsing sands and boulder beds' },
      { group: 'Drilling — per metre', item: '10″ Symmetrix / ODEX — simultaneous casing', price: 'KES 20,000', unit: 'per metre' },
      { group: 'Drilling — per metre', item: 'Extra-hard rock DTH hammer surcharge', price: 'KES 2,500', unit: 'per metre' },

      // Stage 4 — lining the hole.
      { group: 'Casing & screen', item: 'uPVC casing 4.5″ Class D — plain', price: 'KES 1,800', unit: 'per metre' },
      { group: 'Casing & screen', item: 'uPVC screen 4.5″ Class D — slotted 0.75 mm', price: 'KES 2,000', unit: 'per metre' },
      { group: 'Casing & screen', item: 'uPVC casing 6″ Class D — plain', price: 'KES 3,200', unit: 'per metre' },
      { group: 'Casing & screen', item: 'uPVC screen 6″ Class D — slotted', price: 'KES 3,600', unit: 'per metre' },
      { group: 'Casing & screen', item: 'uPVC casing 8″ Class D — plain', price: 'KES 5,500', unit: 'per metre' },
      { group: 'Casing & screen', item: 'Steel casing 6″ — plain', price: 'KES 4,800', unit: 'per metre' },
      { group: 'Casing & screen', item: 'Steel casing 10″ — plain', price: 'KES 8,800', unit: 'per metre' },
      { group: 'Casing & screen', item: 'Steel casing 12″ — plain', price: 'KES 10,500', unit: 'per metre' },
      { group: 'Casing & screen', item: 'Filter gravel pack, 2–4 mm washed', price: 'KES 4,500', unit: 'per tonne' },
      { group: 'Casing & screen', item: 'Sanitary surface seal — cement grout, top 6 m', price: 'KES 18,000', unit: 'lump sum' },
      { group: 'Casing & screen', item: 'Wellhead cover plate & lockable cap (steel)', price: 'KES 6,500', unit: 'each' },

      // Stage 5 — proving the borehole actually yields.
      { group: 'Development & testing', item: 'Development by air-lifting', price: 'KES 7,500', unit: 'per hour' },
      { group: 'Development & testing', item: 'Test pumping — 24 hr constant discharge + recovery, with report', price: 'KES 65,000', unit: 'per job', popular: true },
      { group: 'Development & testing', item: 'Test pumping — 48 hr constant discharge + recovery, with report', price: 'KES 110,000', unit: 'per job' },
      { group: 'Development & testing', item: 'Step-drawdown test, 4 steps, with report', price: 'KES 45,000', unit: 'per job' },
      { group: 'Development & testing', item: 'Water quality — basic potability panel', price: 'KES 9,500', unit: 'per job' },
      { group: 'Development & testing', item: 'Water quality — full chemical & bacteriological (KEBS/WHO)', price: 'KES 18,500', unit: 'per job' },
      { group: 'Development & testing', item: 'Disinfection / shock chlorination', price: 'KES 8,000', unit: 'per job' },
      { group: 'Development & testing', item: 'Downhole CCTV camera inspection & report', price: 'KES 45,000', unit: 'per job', note: 'To 300 m — casing condition, obstructions, water entries' },

      // Stage 6 — power and control.
      { group: 'Pump control & power', item: 'Control panel — single phase (DOL, dry-run, volt/amp protection)', price: 'KES 18,500', unit: 'each' },
      { group: 'Pump control & power', item: 'Control panel — three phase (DOL, dry-run, phase-failure protection)', price: 'KES 28,500', unit: 'each' },
      { group: 'Pump control & power', item: 'Star-delta starter panel (7.5 HP and above)', price: 'KES 45,000', unit: 'each' },
      { group: 'Pump control & power', item: 'Electrode level controller + 3 probes', price: 'KES 9,500', unit: 'per set' },
      /*
       * Solar pump inverters are deliberately NOT priced here. Their figures in
       * the trade catalogue come out of a formula (18,000 + 14,000 per kW), not
       * a typed rate, so publishing them would be quoting a number nobody set.
       * They are quoted per job instead — see the row below.
       */
      { group: 'Pump control & power', item: 'Solar pump inverter (MPPT, 3-phase out), 0.75–22 kW', price: 'Quoted per job', note: 'Sized against the pump and the array — ask and we will price the specific kW' },

      // Stage 7 — storage and delivery.
      /*
       * Tank rows carry the SCHEDULE base rate. Per-brand figures are the base
       * times a brand factor, so quoting a brand-to-brand span would be
       * publishing derived numbers as though each end were a real quoted price.
       * The base is the typed rate; brand is a discussion, not a printed range.
       */
      { group: 'Storage & delivery', item: 'Plastic tank 5,000 L (UV-stabilised)', price: 'KES 41,500', unit: 'each', note: 'Schedule rate — varies a little by brand' },
      { group: 'Storage & delivery', item: 'Plastic tank 10,000 L', price: 'KES 85,000', unit: 'each' },
      { group: 'Storage & delivery', item: 'Plastic tank 24,000 L', price: 'KES 215,000', unit: 'each' },
      { group: 'Storage & delivery', item: 'Pressed-steel sectional tank, galvanised, incl. erection', price: 'KES 28,000', unit: 'per m³' },
      { group: 'Storage & delivery', item: 'Steel tower 6 m, for 5,000 L tank (fabricated & erected)', price: 'KES 285,000', unit: 'each' },
      { group: 'Storage & delivery', item: 'Steel tower 9 m, for 10,000 L tank', price: 'KES 540,000', unit: 'each' },
      { group: 'Storage & delivery', item: 'Steel tower 12 m, for 24,000 L tank', price: 'KES 1,350,000', unit: 'each' },
      { group: 'Storage & delivery', item: 'HDPE pipe PN16, 2″', price: 'KES 480', unit: 'per metre' },
      { group: 'Storage & delivery', item: 'GI pipe medium class, 2″', price: 'KES 1,250', unit: 'per metre' },
      { group: 'Storage & delivery', item: 'Pipeline trenching & backfilling, 600 mm deep', price: 'KES 350', unit: 'per metre' },

      // Stage 8 — the site itself.
      { group: 'Civil works', item: 'Wellhead concrete slab 1×1 m with drainage apron', price: 'KES 22,000', unit: 'per job' },
      { group: 'Civil works', item: 'Concrete tank base / plinth 2.5×2.5 m, reinforced', price: 'KES 45,000', unit: 'per job' },
      { group: 'Civil works', item: 'Pump house 2×2 m — masonry, lockable steel door, ventilated', price: 'KES 165,000', unit: 'per job' },
      { group: 'Civil works', item: 'Wellhead security cage, steel, lockable', price: 'KES 38,000', unit: 'each' },
      { group: 'Civil works', item: 'Chain-link fencing incl. posts', price: 'KES 1,800', unit: 'per metre' },
      { group: 'Civil works', item: 'Rock blasting — licensed blaster incl. explosives', price: 'KES 5,500', unit: 'per m³' },
      { group: 'Civil works', item: 'Blasting permit, police notification & escort', price: 'KES 35,000', unit: 'per job' },
    ],
    drivers: [
      'Depth. The single biggest variable, and it is not known until the hole is down. The geophysical survey narrows it; nothing removes the uncertainty entirely.',
      'Rock. The same metre costs KES 6,000 in soft ground and KES 9,500 in basalt at 6″ — a hard-rock site can add more than half again to the drilling line.',
      'Diameter. Set by the pump you will need, which is set by the yield and the depth. Going from 6″ to 10″ raises both the metre rate and the casing cost.',
      'Distance from the rig. Mobilisation runs KES 100,000 within 50 km and KES 320,000 beyond 300 km, before a single metre is drilled.',
      'Collapsing formations. Sands and boulder beds need Symmetrix/ODEX simultaneous casing at KES 16,000–20,000 per metre against KES 7,500–12,500 conventional.',
      'Whether an existing borehole can be rehabilitated instead. Rehabilitation runs KES 250,000 – 600,000 against KES 1,500,000 – 3,000,000+ to drill new.',
    ],
    excludes: [
      'The submersible pump and riser — priced separately once test pumping establishes the yield',
      'Electrical supply to the site, or a generator where there is no grid',
      'Access road works where a rig cannot reach the drill point',
      'Any depth beyond the drilled metres actually quoted — the rate is fixed, the total depends on the hole',
      VAT_NOTE,
    ],
    related: [
      { label: 'Borehole pump & rehabilitation costs', href: '/pricing/borehole-cost-kenya' },
      { label: 'Check a site before you drill — free', href: '/aquascan-pro-v3' },
      { label: 'Borehole services in detail', href: '/services/borehole-pumps' },
    ],
  },

  {
    slug: 'generator-service-cost-kenya',
    cardNote: 'Service visits from KES 25,000',
    title: 'Generator Service & Repair Cost in Kenya (2026)',
    h1: 'Generator servicing and repair costs in Kenya',
    description:
      'What generator servicing, emergency repair and installation cost in Kenya in 2026 — per-visit maintenance, call-out rates, annual contracts and installation by kVA band.',
    service: 'Generator Maintenance',
    source: '/pricing',
    sourceLabel: 'our service pricing page',
    intro:
      'Buying the machine is the smaller decision. A generator that runs for fifteen years and one that fails in four differ almost entirely in how they were serviced, so these are the numbers worth understanding before you commit to anything.',
    rows: [
      { item: 'Regular maintenance visit', price: 'KES 25,000 – 100,000', note: '2–4 hours on site', popular: true },
      { item: 'Annual service package', price: 'KES 100,000 – 400,000', note: 'Quarterly visits' },
      { item: 'Emergency repair call-out', price: 'KES 50,000 – 200,000', note: 'Same day' },
      { item: 'Installation, 10–100 kVA', price: 'KES 150,000 – 500,000', note: '3–7 days' },
      { item: 'Installation, 100–500 kVA', price: 'KES 500,000 – 2,000,000', note: '1–2 weeks' },
      { item: 'Control panel installation', price: 'KES 100,000 – 400,000', note: '3–5 days' },
      { item: 'ATS (automatic transfer switch) setup', price: 'KES 80,000 – 300,000', note: '2–4 days' },
      { item: 'Remote monitoring setup', price: 'KES 50,000 – 200,000', note: '1–2 days' },
      { item: 'System testing & commissioning', price: 'KES 50,000 – 150,000', note: '1–2 days' },
    ],
    drivers: [
      'Set size. A 30 kVA service is a different job from a 500 kVA service — more oil, more filters, more time.',
      'Running hours since the last service, which is what the interval should actually be based on rather than the calendar.',
      'Whether it is standby or prime-rated. A set running daily needs servicing several times as often as one that starts monthly for a test.',
      'Site conditions. Dust shortens air-filter life sharply; coastal humidity attacks terminations and windings.',
      'Contract versus call-out. An annual package costs less per visit and puts you ahead of a queue when something fails.',
    ],
    excludes: [
      'Parts beyond the routine service items — filters, oil and belts are included, a failed AVR or injector pump is not',
      'Major overhaul or engine rebuild',
      'Travel outside Nairobi on a one-off call-out',
      VAT_NOTE,
    ],
    related: [
      { label: 'Generator prices by kVA', href: '/pricing/generator-prices-kenya' },
      { label: 'Look up a fault code free', href: '/maintenance-hub/generators' },
      { label: 'Generator spare parts', href: '/generators/spare-parts' },
    ],
  },

  {
    slug: 'motor-rewinding-cost-kenya',
    cardNote: 'Rewinds from KES 50,000',
    title: 'Motor Rewinding Cost in Kenya (2026)',
    h1: 'Motor rewinding cost in Kenya',
    description:
      'What motor rewinding costs in Kenya in 2026 — by horsepower, plus repair, testing and efficiency analysis, and when rewinding beats replacing.',
    service: 'Motor Rewinding',
    source: '/pricing',
    sourceLabel: 'our service pricing page',
    intro:
      'Rewinding is usually the cheaper answer, but not always. A badly rewound motor loses efficiency permanently and costs more in electricity than the rewind saved, so the honest comparison is against the price of a new motor and the running cost of both.',
    rows: [
      { item: 'Motor rewinding, 5–15 HP', price: 'KES 50,000 – 150,000', note: '3–5 days', popular: true },
      { item: 'Motor rewinding, 20–75 HP', price: 'KES 150,000 – 500,000', note: '5–7 days' },
      { item: 'Motor repair & testing', price: 'KES 40,000 – 120,000', note: '2–4 days' },
      { item: 'Motor efficiency analysis', price: 'KES 20,000 – 50,000', note: '1 day' },
    ],
    drivers: [
      'Frame size and horsepower — the copper alone scales with the motor.',
      'Winding configuration. A multi-speed or special-voltage winding takes longer to strip, record and rebuild.',
      'Whether the core is damaged. A burnt stator core needs restacking or relamination, and at that point replacement is often the better economics.',
      'Copper price at the time of the job — it is the dominant material cost and it moves.',
      'Bearings, shaft and fan condition, which are usually replaced during a rewind rather than left to fail afterwards.',
    ],
    excludes: [
      'New bearings, shaft machining or fan replacement where condition requires it',
      'Removal from and refitting to the driven machine',
      'Transport of the motor to and from our workshop',
      VAT_NOTE,
    ],
    related: [
      { label: 'Motor rewinding in detail', href: '/services/motor-rewinding' },
      { label: 'Motors & drives', href: '/solutions/motors' },
      { label: 'All service pricing', href: '/pricing' },
    ],
  },

  {
    /*
     * AIR CONDITIONING. Added 2026-08-29 to close a measured gap: "Air
     * conditioning contractor" is one of the nine categories on the verified
     * Google Business Profile, and there was no price page to back it — so
     * "AC installation cost Nairobi" found competitors.
     *
     * Every figure is read off /solutions/ac, where the full system table has
     * been published all along. Nothing here is researched, estimated or
     * imported from the ERP; this is the same restatement job the other guides
     * do — the numbers existed on a page that answers "what do you do" rather
     * than "what does it cost".
     */
    slug: 'air-conditioning-cost-kenya',
    cardNote: 'Split AC from KES 35,000',
    title: 'Air Conditioning Cost in Kenya (2026)',
    h1: 'Air conditioning prices in Kenya',
    description:
      'What air conditioning costs in Kenya in 2026 — split, cassette, ducted, VRF and chiller systems by capacity, plus installation, and what drives the price.',
    service: 'Air Conditioning',
    source: '/solutions/ac',
    sourceLabel: 'our air conditioning page',
    intro:
      'AC is priced by cooling capacity, not by room. A unit sized by guesswork either short-cycles and never dehumidifies, or runs flat out and fails early — so the figures below are grouped by BTU and tonnage, which is what an engineer actually specifies against.',
    rows: [
      { item: 'Wall-mounted split, 9,000–36,000 BTU (0.75–3 ton)', price: 'KES 35,000 – 180,000', note: 'Offices, shops, homes', popular: true },
      { item: 'Installation of a split unit', price: 'KES 15,000 – 25,000', note: 'Mounting, piping, commissioning' },
      { item: 'Cassette, ceiling-mounted, 18,000–60,000 BTU (1.5–5 ton)', price: 'KES 120,000 – 450,000', note: 'Open-plan floors' },
      { item: 'Floor-standing / console, 24,000–60,000 BTU (2–5 ton)', price: 'KES 150,000 – 400,000', note: 'No ceiling work needed' },
      { item: 'Ducted split system, 36,000–120,000+ BTU (3–10+ ton)', price: 'KES 300,000 – 1,500,000+', note: 'Concealed distribution' },
      { item: 'VRF / VRV multi-split, 5–200+ tons', price: 'KES 1,500,000 – 50,000,000+', note: 'Whole-building, zoned' },
      { item: 'Air-cooled chiller, 20–500+ tons', price: 'KES 5,000,000 – 100,000,000+', note: 'Industrial and campus loads' },
    ],
    drivers: [
      'Cooling load, not floor area. Glazing, orientation, occupancy and equipment heat decide the tonnage; two rooms of identical size can differ by a full ton.',
      'Pipe run between indoor and outdoor units — long runs need larger line sets and more refrigerant, and above a limit an inline trap or oil return.',
      'Inverter versus fixed speed. An inverter unit costs more to buy and less to run, and the payback depends on how many hours a day it actually runs.',
      'Ceiling access and builder’s work for cassette and ducted systems, which is often the difference between two otherwise identical quotes.',
      'Whether the electrical supply can carry it. A large split or a VRF outdoor unit may need a dedicated circuit, and that is electrical work, not AC work.',
    ],
    excludes: [
      'Electrical supply to the unit, isolators and any distribution board work',
      'Builder’s work — coring, ceiling openings, plinths and making good',
      'Condensate drainage runs beyond the immediate unit',
      VAT_NOTE,
    ],
    related: [
      { label: 'Air conditioning systems in detail', href: '/solutions/ac' },
      { label: 'HVAC maintenance', href: '/maintenance-hub/hvac' },
      { label: 'All service pricing', href: '/pricing' },
    ],
  },

  {
    /*
     * ELECTRICAL FAULT-FINDING AND REPAIR. Added 2026-08-29 alongside the AC
     * guide, and for the same reason: "Electrical engineer" and "Electrical
     * repair shop" are both categories on the verified Business Profile with
     * no price page behind them.
     *
     * Figures are read off /maintenance-hub/electrical, which publishes a
     * fault schedule with a cost band and a time estimate against each fault
     * code. The bands below are those entries; the monthly figures are the
     * maintenance plans on the same page.
     */
    slug: 'electrical-repair-cost-kenya',
    cardNote: 'Fault-finding from KES 2,000',
    title: 'Electrical Repair Cost in Kenya (2026)',
    h1: 'Electrical fault-finding and repair costs in Kenya',
    description:
      'What electrical fault-finding and repair costs in Kenya in 2026 — earth faults, overcurrent, bonding and distribution board work, with time estimates.',
    service: 'Electrical Repair',
    source: '/maintenance-hub/electrical',
    sourceLabel: 'our electrical maintenance page',
    intro:
      'Electrical faults are priced by what it takes to find them, not by the part that finally gets replaced. A loose bond and a failed cable can present identically at the board; the difference is hours of testing. The bands below carry the time estimate for that reason.',
    rows: [
      { item: 'Missing earth continuity', price: 'KES 2,000 – 20,000', note: '1–4 hours · critical', popular: true },
      { item: 'Earth fault — insulation breakdown', price: 'KES 5,000 – 50,000', note: '2–8 hours' },
      { item: 'Bonding missing or inadequate', price: 'KES 5,000 – 30,000', note: '2–6 hours' },
      { item: 'High earth resistance', price: 'KES 15,000 – 80,000', note: '4–16 hours' },
      { item: 'Earth fault loop impedance high', price: 'KES 10,000 – 100,000', note: '4–24 hours' },
      { item: 'Maintenance plan — small premises', price: 'KES 2,500 / month', note: 'Scheduled inspection' },
      { item: 'Maintenance plan — commercial', price: 'KES 4,500 / month', note: 'Scheduled inspection and testing' },
      { item: 'Maintenance plan — industrial', price: 'KES 15,000 / month', note: 'Full schedule with reporting' },
    ],
    drivers: [
      'How long the fault takes to locate. Loop impedance and insulation testing across a large installation is measured in hours, and that is most of the cost on the wider bands.',
      'Whether the installation can be shut down. Live-working restrictions and out-of-hours access both extend the job.',
      'Age and documentation of the installation. An undocumented board has to be traced circuit by circuit before anything can be corrected.',
      'What the test reveals. A single loose termination is an hour; a degraded submain is a replacement.',
      'Access — ceiling voids, risers and plant rooms all add time before any testing starts.',
    ],
    excludes: [
      'Replacement cable, boards, breakers and accessories, quoted once the fault is identified',
      'Builder’s work, chasing and making good',
      'Utility-side work and anything beyond the point of supply',
      VAT_NOTE,
    ],
    related: [
      { label: 'Electrical maintenance in detail', href: '/maintenance-hub/electrical' },
      { label: 'Controls and switchgear', href: '/solutions/controls' },
      { label: 'All service pricing', href: '/pricing' },
    ],
  },

  {
    /*
     * ATS / CHANGEOVER PANELS. Added 2026-08-29.
     *
     * THE TABLE IS A SIZING TABLE FOR OUR OWN SETS, NOT A MARKET SURVEY.
     *
     * The first draft of this guide listed observed prices from other Kenyan
     * suppliers — bare changeover switches at KES 2,000, third-party
     * controllers at KES 43,100 — as its rows. The owner stopped it before it
     * shipped, correctly: that put competitors' cheap alternatives on our own
     * price page, directly beneath our supply-and-install figure, and invited
     * the reader to buy a switch elsewhere. We sell VOLTKA sets with Cummins
     * engines, and we sell parts. A price page of ours advertises those.
     *
     * So the rows now answer the question a buyer of OUR generators actually
     * has: "I am buying an N kVA set — what changeover does it need?" The
     * mapping is arithmetic, A = kVA x 1000 / (415 x root 3) at 415 V
     * three-phase, and it was cross-checked against two independent Kenyan
     * listings: a 100 kVA set specified with a 160 A switch (139 A computed)
     * and a 250 kVA set with 400 A (348 A computed). Both land on the next
     * standard frame size up, which is how they are specified in practice.
     *
     * That mapping is the value here. Suppliers advertise "price varies with
     * kVA" and publish no sizing at all; this page publishes it for every set
     * size we supply, from 10 kVA to 3,000 kVA.
     *
     * The MONEY figure is our own published range from /services/ats-changeover
     * (KES 15,000 – 1,500,000, supply, install and commission). No per-rating
     * price is stated because we have not published one; a real figure follows
     * the site survey, which is what the page says.
     */
    slug: 'ats-changeover-price-kenya',
    cardNote: 'Supply and install from KES 15,000',
    title: 'ATS & Changeover Panel Prices in Kenya',
    h1: 'ATS and changeover panel prices in Kenya',
    description:
      'What an automatic transfer switch costs in Kenya in 2026, and which ATS rating your generator needs — sizing from 5 kVA to 3,000 kVA with observed market prices.',
    service: 'ATS & Changeovers',
    source: '/services/ats-changeover',
    sourceLabel: 'our ATS and changeovers page',
    sourceIsInternal: true,
    intro:
      'An ATS is specified by current, not by generator size — so the first question is what rating your set actually needs. At 415 V three-phase a 100 kVA set draws 139 A and takes a 160 A switch; a 250 kVA set draws 348 A and takes 400 A. Get that wrong and the switch either nuisance-trips or welds its contacts closed on the first real transfer. Below is the rating for every set size we supply, and what we charge to supply, install and commission it.',
    rows: [
      { item: 'VOLTKA 10–20 kVA (Cummins engine)', price: '32 A four-pole', note: '7–28 A at 415 V' },
      { item: 'VOLTKA 30 kVA', price: '63 A four-pole', note: '42 A' },
      { item: 'VOLTKA 50–60 kVA', price: '100 A four-pole', note: '70–83 A' },
      { item: 'VOLTKA 80 kVA', price: '125 A four-pole', note: '111 A' },
      { item: 'VOLTKA / Cummins 100 kVA', price: '160 A four-pole', note: '139 A', popular: true },
      { item: 'Cummins 150 kVA', price: '250 A four-pole', note: '209 A' },
      { item: 'Cummins 200 kVA', price: '315 A four-pole', note: '278 A' },
      { item: 'Cummins 250 kVA', price: '400 A four-pole', note: '348 A', popular: true },
      { item: 'Cummins 300–400 kVA', price: '500–630 A', note: '417–556 A' },
      { item: 'Cummins 500 kVA', price: '800 A', note: '696 A' },
      { item: 'Cummins 800 kVA', price: '1,250 A', note: '1,113 A' },
      { item: 'Cummins 1,000 kVA', price: '1,600 A', note: '1,391 A' },
      { item: 'Cummins 2,000 kVA', price: '3,200 A', note: '2,782 A' },
      { item: 'Cummins 3,000 kVA', price: 'Switchboard build', note: '4,174 A — beyond a standard panel' },
    ],
    drivers: [
      'The ATS rating your set needs, which is arithmetic: 5–20 kVA takes 32 A, 30 kVA takes 63 A, 50–60 kVA takes 100 A, 100 kVA takes 160 A, 250 kVA takes 400 A, 500 kVA takes 800 A, 1,000 kVA takes 1,600 A and 2,000 kVA takes 3,200 A. Above that the transfer is usually built as a switchboard rather than a panel.',
      'Whether the quote is for a switch, a controller or a complete panel. Those three are priced an order of magnitude apart, and a cheap-looking quote is often for a bare switch while you are picturing an installed, commissioned panel. Ours is the complete panel, wired to the set and tested on a real transfer.',
      'Three-pole versus four-pole. Four-pole switches the neutral as well, which is what a separately derived generator supply normally requires, and it costs more.',
      'Contactor-based versus motorised changeover. A motorised switch holds position without a coil energised and is what large sets use; contactor pairs are cheaper and suit small installations.',
      'Enclosure rating and where it lives. An outdoor or dusty plant room needs a higher IP rating than a switch room.',
      'Cable size and run between board, set and load — at 400 A and above the cabling can approach the cost of the switch itself.',
    ],
    excludes: [
      'Cabling between the changeover, the generator and the distribution board',
      'Any upgrade to the incoming supply or main distribution board',
      'Builder’s work, plinths, trenching and making good',
      VAT_NOTE,
    ],
    related: [
      { label: 'ATS and changeovers in detail', href: '/services/ats-changeover' },
      { label: 'Generator prices by size', href: '/pricing/generator-prices-kenya' },
      { label: 'Electrical repair costs', href: '/pricing/electrical-repair-cost-kenya' },
    ],
  },

  {
    slug: 'incinerator-price-kenya',
    cardNote: 'Installation from KES 300,000',
    title: 'Incinerator Price in Kenya (2026)',
    h1: 'Incinerator prices in Kenya',
    description:
      'What a medical or industrial incinerator costs in Kenya in 2026 — installation, maintenance and repair, plus what drives the price and what NEMA compliance requires.',
    service: 'Hospital Incinerators',
    source: '/pricing',
    sourceLabel: 'our service pricing page',
    intro:
      'Incinerator pricing is driven by throughput and by compliance. A unit that cannot hold the required chamber temperature will fail inspection regardless of what it cost, so the specification matters more here than in almost any other line we quote.',
    rows: [
      { item: 'Incinerator installation', price: 'KES 300,000 – 2,000,000', note: '1–2 weeks', popular: true },
      { item: 'Incinerator maintenance & repair', price: 'KES 50,000 – 300,000', note: '2–5 days' },
    ],
    drivers: [
      'Throughput in kg per hour — the single biggest determinant of size and therefore cost.',
      'Chamber configuration. A dual-chamber unit with a secondary combustion chamber costs more and is what medical waste compliance generally requires.',
      'Refractory specification and lining thickness, which set both the price and how long between relines.',
      'Burner type and fuel — diesel, gas or electric ignition.',
      'Stack height and emissions treatment, driven by the NEMA licence conditions for the site.',
    ],
    excludes: [
      'NEMA licensing and environmental impact assessment for the installation',
      'Civil works — foundation, ash pit, access apron',
      'Fuel storage and supply lines',
      'Operator training beyond initial handover',
      VAT_NOTE,
    ],
    related: [
      { label: 'Hospital incinerators in detail', href: '/services/hospital-incinerators' },
      { label: 'Incinerator construction guide', href: '/solutions/incinerators' },
      { label: 'All service pricing', href: '/pricing' },
    ],
  },
] as const;

export function getPriceGuide(slug: string): PriceGuide | undefined {
  return PRICE_GUIDES.find((g) => g.slug === slug);
}

export function getAllPriceGuideSlugs(): string[] {
  return PRICE_GUIDES.map((g) => g.slug);
}
