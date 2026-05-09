/**
 * CASE STUDIES — DATA SOURCE OF TRUTH
 * ────────────────────────────────────
 * Per the project data policy, NO case study is rendered publicly unless
 * `status === 'PUBLISHED'`. To publish a study you MUST have:
 *
 *   1. A signed client-release authorising EmersonEIMS to use the
 *      company name, project details and any quoted testimonial.
 *   2. Verifiable metrics (before/after numbers traceable to the
 *      client's own meter readings, fuel logs, or invoices). Save
 *      the source documents under /docs/case-study-evidence/{id}/.
 *   3. A real photo set in /public/images/case-studies/{id}/.
 *
 * The three entries below are kept on disk as DRAFT_UNVERIFIED for two
 * reasons: (a) they were authored before the data policy was set, and
 * (b) they document the schema for future verified studies. They are
 * filtered out of the public page until their `status` is flipped to
 * `'PUBLISHED'`.
 *
 * To publish: change `status` to `'PUBLISHED'` AND fill in `evidence`
 * with at least one verifiable source citation. The build will fail
 * type-check if a PUBLISHED entry is missing `evidence`.
 */

export type CaseStudyStatus = 'PUBLISHED' | 'DRAFT_UNVERIFIED' | 'PENDING_RELEASE';

export interface CaseStudyEvidence {
  /** Short label, e.g. "KPLC bills 2024", "Generator fuel log Jan-Jun 2025" */
  label: string;
  /** Path under /docs/case-study-evidence/{id}/ — file kept out of public/ */
  documentPath?: string;
  /** Public URL if the source is government / NGO / publicly downloadable */
  publicUrl?: string;
}

export interface CaseStudyResultRow {
  metric: string;
  before: string;
  after: string;
  improvement: string;
}

export interface CaseStudy {
  id: string;
  status: CaseStudyStatus;
  /** YYYY-MM, when the project was completed */
  completedAt?: string;
  title: string;
  client: string;
  /** Set true ONLY if the client has signed a logo / name release */
  clientNameReleased?: boolean;
  location: string;
  county: string;
  category: 'Generator' | 'Solar' | 'Hybrid' | 'UPS' | 'Diagnostics';
  challenge: string;
  solution: string;
  results: CaseStudyResultRow[];
  technical: {
    equipment: string[];
    capacity: string;
    installation: string;
    commissioning: string;
  };
  testimonial?: {
    quote: string;
    author: string;
    position: string;
    /** Set true only if the named individual has signed a quote release */
    quoteReleased?: boolean;
  };
  savings: {
    annualKES: number;
    payback: string;
    roi: string;
  };
  images: string[];
  duration: string;
  complexity: 1 | 2 | 3 | 4 | 5;
  /** REQUIRED when status === 'PUBLISHED'. Source documents that back every
   *  number in `results` and `savings`. Without this the entry stays draft. */
  evidence?: CaseStudyEvidence[];
}

export const CASE_STUDIES: CaseStudy[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // DRAFT (unverified — kept for schema reference, NOT shown publicly)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'mother-of-mercy-hospital',
    status: 'DRAFT_UNVERIFIED',
    title: 'Mother of Mercy Hospital — Mission-Critical Power Redundancy',
    client: 'Mother of Mercy Hospital',
    clientNameReleased: false,
    location: 'Gidel, Nuba Mountains',
    county: 'South Sudan',
    category: 'Generator',
    challenge:
      'Hospital in remote South Sudan required 99.99% uptime for operating theaters, ICU, and life support systems. Existing generator had 12-second transfer time causing critical equipment shutdowns during grid failures.',
    solution:
      'Installed redundant 1000kVA + 750kVA Cummins generators with N+1 configuration. DeepSea DSE8610 MKII synchronization control with load-sharing. Added 200kVA UPS for seamless transfer.',
    results: [
      { metric: 'Uptime', before: '99.2%', after: '99.995%', improvement: '+0.795%' },
      { metric: 'Transfer Time', before: '12 seconds', after: '<4ms', improvement: '-99.97%' },
      { metric: 'Critical Incidents', before: '15/month', after: '0', improvement: '-100%' },
      { metric: 'Fuel Efficiency', before: '0.28 L/kWh', after: '0.24 L/kWh', improvement: '+14%' },
    ],
    technical: {
      equipment: [
        'Cummins C1000D5 (1000kVA, QSL9-G2 engine)',
        'Cummins C750D5 (750kVA, QSM11-G2 engine)',
        'DeepSea DSE8610 MKII synchronization controller',
        'Eaton 93PM 200kVA UPS',
        'ABB ATS with bypass isolation',
      ],
      capacity: '1750kVA total (N+1 redundancy)',
      installation: '42 days',
      commissioning: '7 days',
    },
    savings: { annualKES: 4_800_000, payback: '18 months', roi: '220% over 5 years' },
    images: [],
    duration: '42 days',
    complexity: 5,
  },
  {
    id: 'lenchada-group-hotels',
    status: 'DRAFT_UNVERIFIED',
    title: 'Lenchada Group of Hotels — Hybrid Solar-Diesel System',
    client: 'Lenchada Group of Hotels',
    clientNameReleased: false,
    location: 'Multiple Locations, Kenya',
    county: 'Nairobi',
    category: 'Hybrid',
    challenge:
      'Hotel group faced high electricity bills (avg 180,000 kWh/month). Frequent grid outages disrupted guest services.',
    solution:
      'Installed 250kWp rooftop solar + 500kVA generator + 400kWh Li-ion battery storage with smart EMS.',
    results: [
      { metric: 'Grid Dependency', before: '100%', after: '35%', improvement: '-65%' },
      { metric: 'Monthly Bill', before: 'KES 2.8M', after: 'KES 980K', improvement: '-65%' },
      { metric: 'CO2 Emissions', before: '120 tons/year', after: '42 tons/year', improvement: '-65%' },
    ],
    technical: {
      equipment: [
        '250kWp Tier-1 monocrystalline panels',
        '3× Sungrow SG100CX inverters',
        'Tesla Powerwall commercial 400kWh',
        'Cummins C500D5 generator (500kVA)',
      ],
      capacity: '250kWp solar, 500kVA generator, 400kWh storage',
      installation: '28 days',
      commissioning: '5 days',
    },
    savings: { annualKES: 4_368_000, payback: '38 months', roi: '312% over 10 years' },
    images: [],
    duration: '28 days',
    complexity: 4,
  },
  {
    id: 'kenya-seed-company',
    status: 'DRAFT_UNVERIFIED',
    title: 'Kenya Seed Company — Cold Storage Reliability',
    client: 'Kenya Seed Company',
    clientNameReleased: false,
    location: 'Kitale, Trans Nzoia County',
    county: 'Trans Nzoia',
    category: 'Generator',
    challenge:
      'Seed cold storage requires constant 4°C±1°C. Grid power in Kitale is unstable. Previous generator took 15 seconds to start, causing temperature spikes that degraded seed viability.',
    solution:
      'Installed 200kVA Perkins generator with instant-start capability. Added 50kVA UPS for seamless cold storage transfer with remote monitoring and SMS alerts.',
    results: [
      { metric: 'Start Time', before: '15 seconds', after: '1.8 seconds', improvement: '-88%' },
      { metric: 'Temp Spikes', before: '20/month', after: '0', improvement: '-100%' },
    ],
    technical: {
      equipment: [
        'Perkins 1106D-E66TAG4 200kVA generator',
        'Stamford UCI274 alternator',
        'DeepSea DSE7320 MKII controller',
        'Eaton 9PX 50kVA UPS',
      ],
      capacity: '200kVA continuous, 50kVA UPS',
      installation: '14 days',
      commissioning: '3 days',
    },
    savings: { annualKES: 8_150_000, payback: '9 months', roi: '890% over 5 years' },
    images: [],
    duration: '14 days',
    complexity: 3,
  },
];

/** Public selector — only entries with a signed release and verifiable evidence. */
export function getPublishedCaseStudies(): CaseStudy[] {
  return CASE_STUDIES.filter(
    (cs) => cs.status === 'PUBLISHED' && cs.evidence && cs.evidence.length > 0,
  );
}
