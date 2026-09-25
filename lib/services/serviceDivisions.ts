/**
 * THE TWELVE ENGINEERING DIVISIONS.
 *
 * WHY THIS FILE EXISTS
 * /services presented the company as a flat list of whatever happened to be in
 * ALL_SERVICES — eleven cards, grouped by a seven-value category union that was
 * an implementation detail ('power', 'renewable', 'waste') rather than anything
 * a buyer would recognise. Real capability that ships on this site sat outside
 * it entirely: the repair centre's fifteen hubs, eleven maintenance hubs, the
 * spare-parts marketplace, the workshop, the solutions deep-dives.
 *
 * A facilities manager who needs a plumber, a rewind and a generator service
 * could not tell from that page that one company does all three.
 *
 * WHAT A DIVISION IS
 * A division is a trade a customer would name. It is not a page — several
 * divisions are assembled from pages that already exist and already rank. The
 * `hub` is the best existing destination for that trade; `items` are the real
 * routes beneath it.
 *
 * EVERY HREF HERE IS A ROUTE THAT EXISTS. They were taken from the 288 static
 * routes under app/ plus the dynamic /services/<slug> set, and the whole list
 * is re-checked by scripts/check-divisions.mjs on every build. Nothing is
 * aspirational: if a capability has no page, it is not linked, because a
 * division that promises a page it cannot show is worse than one that is
 * honestly shorter.
 *
 * THE BRAND QUESTION, HANDLED DELIBERATELY
 * The structure this was built from listed Perkins, Caterpillar, FG Wilson,
 * Volvo Penta and SDMO under "Generator Sales". Owner-confirmed, repeatedly:
 * VOLTKA is the only make EmersonEIMS sells new. Those other makes are ones it
 * SERVICES, REPAIRS AND SUPPLIES PARTS FOR — which is true, is evidenced by the
 * per-brand pages, the fault-code database and the workshop, and captures the
 * same searches without claiming a dealership that does not exist.
 *
 * So brands appear under `serviced`, never under sales. See app/voltka/page.tsx
 * and scripts/check-claims.mjs (rule: authorised-dealer) for the same line held
 * elsewhere.
 */

export interface DivisionLink {
  label: string;
  href: string;
}

export interface ServiceDivision {
  /** Two-digit number shown in the card. Stable — used in anchors. */
  no: string;
  id: string;
  title: string;
  /** The chips under the title: the trade in the words a buyer uses. */
  strapline: string[];
  /** One sentence. What this division actually does, no adjectives. */
  blurb: string;
  icon: string;
  /** The best existing page for this trade. */
  hub: DivisionLink;
  items: DivisionLink[];
  /** Makes we service and supply parts for. NEVER a sales claim. */
  serviced?: DivisionLink[];
}

export const SERVICE_DIVISIONS: ServiceDivision[] = [
  {
    no: '01',
    id: 'generators',
    title: 'Generators & Backup Power',
    strapline: ['Sales', 'Installation', 'Repairs', 'Maintenance', 'Rental', 'ATS'],
    blurb:
      'The division the company was built on: diesel gensets from 10 kVA to 2000 kVA, supplied, installed, commissioned, maintained and repaired.',
    icon: '⚡',
    hub: { label: 'All generator services', href: '/generators' },
    items: [
      { label: 'VOLTKA generators — our own make, Cummins-powered', href: '/voltka' },
      { label: 'Generator sales and supply', href: '/generators' },
      { label: 'Cummins generators — engines, sizing and the bible', href: '/services/cummins-generators' },
      { label: 'Generator installation and commissioning', href: '/generators/installation' },
      { label: 'Generator repairs and breakdown response', href: '/services/generator-repairs' },
      { label: 'Generator maintenance and service contracts', href: '/generators/maintenance' },
      { label: 'ATS, changeover and AMF panels', href: '/services/ats-changeover' },
      { label: 'Generator rental', href: '/generators/rental' },
      { label: 'Generator leasing', href: '/generators/leasing' },
      { label: 'Used and refurbished generators', href: '/generators/used' },
      { label: 'Generator systems and sizing', href: '/generators/systems' },
      { label: 'Workshop repairs and fabrication', href: '/generators/workshop-services' },
      { label: 'Engine overhaul and top overhaul', href: '/generators/workshop-services' },
      { label: 'Alternator repair and rewinding', href: '/generators/workshop-services' },
      { label: 'Starter motor repair', href: '/generators/workshop-services' },
      { label: 'Radiator repair and recoring', href: '/generators/workshop-services' },
      { label: 'Injector and injector-pump service', href: '/generators/workshop-services' },
      { label: 'Turbocharger repair', href: '/generators/workshop-services' },
      { label: 'Generator maintenance hub', href: '/maintenance-hub/generators' },
      { label: 'Scheduled maintenance contracts', href: '/maintenance-hub' },
    ],
    serviced: [
      { label: 'Cummins', href: '/generators/cummins' },
      { label: 'Perkins', href: '/generators/perkins' },
      { label: 'Caterpillar', href: '/generators/caterpillar' },
      { label: 'Volvo Penta', href: '/generators/volvo-penta' },
      { label: 'All brands we service', href: '/brands' },
    ],
  },
  {
    no: '02',
    id: 'spare-parts',
    title: 'Generator Spare Parts & Components',
    strapline: ['Engine parts', 'Filters', 'Controllers', 'AVRs', 'Starters', 'Alternators'],
    blurb:
      'Genuine and equivalent parts for the makes we service — specified by part number against your engine, not by description.',
    icon: '⚙️',
    hub: { label: 'Generator spare parts', href: '/generators/spare-parts' },
    items: [
      { label: 'Generator spare parts catalogue', href: '/generators/spare-parts' },
      { label: 'Engine and electrical parts', href: '/generator-parts' },
      { label: 'Parts marketplace', href: '/marketplace/parts' },
      { label: 'Controllers: DSE, SmartGen, ComAp, PowerWizard', href: '/repair-centre/controllers' },
      { label: 'Fuel-system components', href: '/repair-centre/fuel-systems' },
      { label: 'Engine-system components', href: '/repair-centre/engine-systems' },
    ],
  },
  {
    no: '03',
    id: 'solar',
    title: 'Solar Energy Solutions',
    strapline: ['Residential', 'Commercial', 'Industrial', 'Hybrid', 'Off-grid', 'Maintenance'],
    blurb:
      'Grid-tied, off-grid and hybrid PV designed against a measured load rather than a panel count, then installed and maintained.',
    icon: '☀️',
    hub: { label: 'Solar energy solutions', href: '/services/solar-energy' },
    items: [
      { label: 'Solar energy services', href: '/services/solar-energy' },
      { label: 'Commercial and industrial solar', href: '/solar' },
      { label: 'Solar system sizing and design', href: '/solutions/solar-sizing' },
      { label: 'Solar inverters', href: '/services/solar-inverters' },
      { label: 'Solar maintenance hub', href: '/maintenance-hub/solar' },
      { label: 'Solar repair centre', href: '/repair-centre/solar' },
      { label: 'Solar solutions overview', href: '/solutions/solar' },
    ],
  },
  {
    no: '04',
    id: 'ups',
    title: 'UPS, Inverters & Energy Storage',
    strapline: ['UPS', 'Inverters', 'Batteries', 'Installation', 'Repairs', 'Runtime testing'],
    blurb:
      'Ride-through power for the loads that cannot blink — sized on real runtime, installed, and kept alive through battery life.',
    icon: '🔋',
    hub: { label: 'UPS systems', href: '/services/ups-systems' },
    items: [
      { label: 'UPS systems: supply and installation', href: '/services/ups-systems' },
      { label: 'UPS solutions overview', href: '/solutions/ups' },
      { label: 'UPS Lab', href: '/hub/ups-lab' },
      { label: 'Inverter systems', href: '/services/solar-inverters' },
      { label: 'UPS repair centre', href: '/repair-centre/ups' },
      { label: 'Inverter repair centre', href: '/repair-centre/inverters' },
      { label: 'Solar & UPS intelligence hub', href: '/resources/solar-ups-hub' },
    ],
  },
  {
    no: '05',
    id: 'electrical',
    title: 'Electrical & High-Voltage Engineering',
    strapline: ['Installations', 'Panels', 'Switchgear', 'HV', 'Controls', 'Automation'],
    blurb:
      'Distribution, switchgear and control systems for commercial and industrial sites, from the incomer to the final circuit.',
    icon: '🔌',
    hub: { label: 'Distribution boards & panels', href: '/services/distribution-boards' },
    items: [
      { label: 'Distribution boards, panels and switchgear', href: '/services/distribution-boards' },
      { label: 'High-voltage systems', href: '/solutions/high-voltage' },
      { label: 'Industrial controls', href: '/solutions/controls' },
      { label: 'Diesel and generator automation', href: '/solutions/diesel-automation' },
      { label: 'ATS and changeover panels', href: '/services/ats-changeover' },
      { label: 'Electrical maintenance hub', href: '/maintenance-hub/electrical' },
      { label: 'Power interruption solutions', href: '/solutions/power-interruptions' },
    ],
  },
  {
    no: '06',
    id: 'motors',
    title: 'Motors & Electromechanical Services',
    strapline: ['Rewinding', 'Motor repair', 'Pump motors', 'Alternators', 'Testing'],
    blurb:
      'Rewinding and repair on the bench in Embakasi — usually a fraction of the cost of replacing a motor because one winding failed.',
    icon: '🔄',
    hub: { label: 'Motor rewinding', href: '/services/motor-rewinding' },
    items: [
      { label: 'Motor rewinding and repair', href: '/services/motor-rewinding' },
      { label: 'Motor rewinding solutions', href: '/solutions/motor-rewinding' },
      { label: 'Industrial motors', href: '/solutions/motors' },
      { label: 'Motor repair centre', href: '/repair-centre/motors' },
      { label: 'Motors maintenance hub', href: '/maintenance-hub/motors' },
    ],
  },
  {
    no: '07',
    id: 'plumbing',
    title: 'Plumbing & Water Systems',
    strapline: ['Hotels', 'Homes', 'Bathrooms', 'Kitchens', 'Hot water', 'Repairs'],
    blurb:
      'Plumbing and hot-water systems for hotels, homes, apartments and commercial buildings — installed, repaired and maintained by the same engineering team that handles the power and pumping.',
    icon: '🚿',
    hub: { label: 'Plumbing & water systems', href: '/services/plumbing' },
    items: [
      { label: 'Plumbing installation and repair', href: '/services/plumbing' },
      { label: 'Hotel and commercial plumbing', href: '/services/plumbing' },
      { label: 'Hot water systems and water heaters', href: '/services/plumbing' },
      { label: 'Bathroom and kitchen plumbing', href: '/services/plumbing' },
      { label: 'Blocked drains, burst pipes and leak detection', href: '/maintenance-hub/plumbing' },
      { label: 'Plumbing diagnosis and fault finding', href: '/maintenance-hub/plumbing' },
    ],
  },
  {
    no: '08',
    id: 'water',
    title: 'Boreholes, Pumps & Water Infrastructure',
    strapline: ['Boreholes', 'Pumps', 'Storage', 'Pressure systems', 'Solar pumping'],
    blurb:
      'Getting water out of the ground and into the building: borehole pumps, boosters, storage and the controls that run them.',
    icon: '💧',
    hub: { label: 'Borehole pumps', href: '/services/borehole-pumps' },
    items: [
      { label: 'Borehole and submersible pumps', href: '/services/borehole-pumps' },
      { label: 'Borehole drilling, aquifer testing and yield', href: '/services/borehole-drilling' },
      { label: 'Borehole pump solutions', href: '/solutions/borehole-pumps' },
      { label: 'Pump repair centre', href: '/repair-centre/pumps' },
      { label: 'Borehole maintenance hub', href: '/maintenance-hub/borehole' },
      { label: 'AquaScan Pro — borehole & water intelligence', href: '/aquascan-pro-v3' },
    ],
  },
  {
    no: '09',
    id: 'hvac',
    title: 'HVAC & Air Conditioning',
    strapline: ['Installation', 'Repairs', 'Maintenance', 'Ventilation', 'Cooling'],
    blurb:
      'Cooling and ventilation sized against the actual heat load and the local design ambient, not a catalogue guess.',
    icon: '❄️',
    hub: { label: 'AC & HVAC installation', href: '/services/ac-installation' },
    items: [
      { label: 'Air conditioning installation and repair', href: '/services/ac-installation' },
      { label: 'Air conditioning: refrigeration, SEER and derating', href: '/services/air-conditioning' },
      { label: 'AC and cooling solutions', href: '/solutions/ac' },
      { label: 'HVAC maintenance hub', href: '/maintenance-hub/hvac' },
    ],
  },
  {
    no: '10',
    id: 'fabrication',
    title: 'Fabrication & Mechanical Engineering',
    strapline: ['Steel fabrication', 'Welding', 'Canopies', 'Tanks', 'Exhausts'],
    blurb:
      'In-house steelwork for the parts of a power or water installation that have to be made rather than bought.',
    icon: '🔧',
    hub: { label: 'Steel fabrication', href: '/fabrication' },
    items: [
      { label: 'Steel fabrication and site works', href: '/fabrication' },
      { label: 'Fabrication solutions', href: '/solutions/fabrication' },
      { label: 'Generator canopies, tanks and exhausts', href: '/generators/workshop-services' },
      { label: 'Fabrication maintenance hub', href: '/maintenance-hub/fabrication' },
      { label: 'Welding maintenance hub', href: '/maintenance-hub/welding' },
    ],
  },
  {
    no: '11',
    id: 'incinerators',
    title: 'Incinerators & Waste Systems',
    strapline: ['Supply', 'Construction', 'Installation', 'Repairs', 'Maintenance'],
    blurb:
      'Medical and industrial incineration: units, chimneys, burners and refractory, built to hold temperature and pass inspection.',
    icon: '🔥',
    hub: { label: 'Hospital incinerators', href: '/services/hospital-incinerators' },
    items: [
      { label: 'Hospital and industrial incinerators', href: '/services/hospital-incinerators' },
      { label: 'Incinerator construction guide', href: '/solutions/incinerators' },
      { label: 'Incinerator maintenance hub', href: '/maintenance-hub/incinerators' },
    ],
  },
  {
    no: '12',
    id: 'diagnostics',
    title: 'Diagnostics & Industrial Electronics',
    strapline: ['Fault finding', 'PCB repair', 'Controllers', 'Drives', 'Electronics'],
    blurb:
      'Component-level electronics repair and structured fault diagnosis — the work that decides whether a board is replaced or fixed.',
    icon: '🩺',
    hub: { label: 'Repair centre', href: '/repair-centre' },
    items: [
      { label: 'Repair centre — all fifteen hubs', href: '/repair-centre' },
      { label: 'PCB and motherboard repair', href: '/repair-centre/pcb-motherboards' },
      { label: 'Industrial electronics', href: '/repair-centre/industrial-electronics' },
      { label: 'Generator fault diagnosis', href: '/repair-centre/generators' },
      { label: 'ATS and changeover diagnosis', href: '/repair-centre/ats-changeover' },
      { label: 'Fault-code database', href: '/repair-centre/fault-codes' },
      { label: 'Diagnostics hub', href: '/diagnostics' },
      { label: 'Troubleshooting wizard', href: '/troubleshooting' },
      { label: 'General maintenance hub', href: '/maintenance-hub/general' },
    ],
  },
];

/** Every distinct href the divisions publish — used by the build guard. */
export function allDivisionHrefs(): string[] {
  const out = new Set<string>();
  for (const d of SERVICE_DIVISIONS) {
    out.add(d.hub.href);
    for (const i of d.items) out.add(i.href);
    for (const s of d.serviced ?? []) out.add(s.href);
  }
  return [...out].sort();
}
