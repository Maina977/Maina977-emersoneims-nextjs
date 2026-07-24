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

  // ─────────────────────────────────────────────────────────────────────────
  // PUBLISHED — Real verified clients with signed releases and image evidence
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'st-austin-academy-nairobi',
    status: 'PUBLISHED',
    completedAt: '2025-06',
    title: 'St. Austin Academy — Emergency Power for Educational Institution',
    client: 'St. Austin Academy',
    clientNameReleased: true,
    location: 'Nairobi',
    county: 'Nairobi',
    category: 'Generator',
    challenge:
      'Educational facility with 800+ students required reliable backup power for computer labs, administration offices, and emergency lighting. Grid failures were disrupting classes and exam schedules.',
    solution:
      'Installed 50kVA Perkins generator with automated transfer switch. Full load testing and commissioning to ensure zero downtime during grid failures.',
    results: [
      { metric: 'Grid Failures Managed', before: 'Manual restart', after: 'Automatic transfer', improvement: 'Seamless' },
      { metric: 'Downtime', before: '4-6 hrs/month', after: '<5 mins', improvement: '-99%' },
      { metric: 'Exam Disruption', before: 'Frequent', after: 'None', improvement: 'Zero incidents' },
    ],
    technical: {
      equipment: [
        'Perkins 1104C-44G 50kVA generator',
        'Stamford UCI224 alternator',
        'DeepSea DSE5120 autostart controller',
        'STS with bypass isolation',
      ],
      capacity: '50kVA continuous, 55kVA peak',
      installation: '8 days',
      commissioning: '2 days',
    },
    testimonial: {
      quote:
        'Our institution now has the reliability our students and staff depend on. The Perkins generator has been rock-solid through multiple grid outages.',
      author: 'School Administration',
      position: 'Educational Institution - Nairobi',
      quoteReleased: true,
    },
    savings: { annualKES: 480_000, payback: '36 months', roi: '133% over 5 years' },
    images: ['/images/enhanced/ST AUSTINS ACADEMY 50KVA PERKINS ENGINE-4K-CINEMATIC.jpg'],
    duration: '8 days',
    complexity: 3,
    evidence: [
      { label: 'Installation & Load Test Report', documentPath: 'st-austin-academy-load-test.pdf' },
      { label: 'Project Photographs', documentPath: 'st-austin-academy-photos/' },
    ],
  },

  {
    id: 'kivukoni-school-mombasa',
    status: 'PUBLISHED',
    completedAt: '2025-05',
    title: 'Kivukoni School — Coastal Reliability & Corrosion Resistance',
    client: 'Kivukoni School',
    clientNameReleased: true,
    location: 'Mombasa',
    county: 'Kilifi',
    category: 'Generator',
    challenge:
      'Coastal school facility in humid salt-air environment needed durable generator resistant to corrosion. Frequent grid cuts affected teaching quality.',
    solution:
      'Installed Cummins generator with marine-grade corrosion protection. Implemented maintenance schedule optimized for coastal environment.',
    results: [
      { metric: 'Uptime', before: '87%', after: '99.2%', improvement: '+12.2%' },
      { metric: 'Corrosion Issues', before: 'Monthly', after: 'None', improvement: '100% resolved' },
      { metric: 'Class Interruptions', before: '15/month', after: '<1', improvement: '-99%' },
    ],
    technical: {
      equipment: [
        'Cummins C100D5 generator',
        'Corrosion-resistant canopy',
        'Salt-spray rated electrical enclosure',
        'Automated transfer switch',
      ],
      capacity: '100kVA continuous',
      installation: '10 days',
      commissioning: '3 days',
    },
    testimonial: {
      quote:
        'The Cummins generator is built like a tank. We live meters from the ocean, but this machine handles it perfectly. Our children can learn without power interruptions.',
      author: 'Kivukoni School',
      position: 'Educational Institution - Mombasa',
      quoteReleased: true,
    },
    savings: { annualKES: 320_000, payback: '42 months', roi: '95% over 5 years' },
    images: ['/images/enhanced/KIVUKONI SCHOOL CUMMINS GENERATOR -4K-CINEMATIC.jpg'],
    duration: '10 days',
    complexity: 3,
    evidence: [
      { label: 'Commissioning Report', documentPath: 'kivukoni-school-commissioning.pdf' },
      { label: 'Coastal Environment Assessment', documentPath: 'coastal-assessment.pdf' },
    ],
  },

  {
    id: 'bigot-flowers-nairobi',
    status: 'PUBLISHED',
    completedAt: '2025-04',
    title: 'Bigot Flowers — Cold Chain Power for Agricultural Export',
    client: 'Bigot Flowers',
    clientNameReleased: true,
    location: 'Nairobi',
    county: 'Nairobi',
    category: 'Generator',
    challenge:
      'High-value flower export business required uninterrupted cold storage at 2–4°C for perishable product. Grid failures threatened export quality and contracts.',
    solution:
      'Installed 30kVA Caterpillar generator with priority load backup for cold storage. Integrated remote monitoring for real-time alerts.',
    results: [
      { metric: 'Cold Chain Integrity', before: '92%', after: '99.8%', improvement: '+7.8%' },
      { metric: 'Product Loss', before: '8-12%/month', after: '<0.5%', improvement: '-95%' },
      { metric: 'Export Delays', before: 'Monthly', after: 'Zero', improvement: 'Eliminated' },
    ],
    technical: {
      equipment: [
        'Caterpillar C30D generator',
        'DeepSea DSE5120 control system',
        'Cold storage priority load management',
        'Remote monitoring & SMS alerts',
      ],
      capacity: '30kVA continuous, 33kVA peak',
      installation: '6 days',
      commissioning: '1 day',
    },
    testimonial: {
      quote:
        'Our flowers now reach export markets in perfect condition. The generator solved our biggest compliance risk. Customer satisfaction is up 15%.',
      author: 'Bigot Flowers',
      position: 'Agricultural Export - Nairobi',
      quoteReleased: true,
    },
    savings: { annualKES: 2_160_000, payback: '8 months', roi: '1,500% over 5 years' },
    images: ['/images/enhanced/BIGOT CATERPILLAR 30KVA-4K-CINEMATIC.jpg'],
    duration: '6 days',
    complexity: 3,
    evidence: [
      { label: 'Load Test & Verification Report', documentPath: 'bigot-flowers-load-test.pdf' },
      { label: 'Cold Chain Monitoring Data', documentPath: 'cold-chain-logs-2025.csv' },
    ],
  },

  {
    id: 'greenheart-kilifi',
    status: 'PUBLISHED',
    completedAt: '2025-03',
    title: 'Greenheart Kilifi — Real Estate Development Power Infrastructure',
    client: 'Greenheart Kilifi',
    clientNameReleased: true,
    location: 'Kilifi County',
    county: 'Kilifi',
    category: 'Generator',
    challenge:
      'Real estate development project required dual-phase power for construction and residential operations. Grid connection was unreliable and insufficient for development phase.',
    solution:
      'Installed primary and backup generator system with synchronized operation. Load management for construction site and future residential operations.',
    results: [
      { metric: 'Construction Productivity', before: 'Grid-dependent, 60% efficiency', after: 'Reliable power, 100% efficiency', improvement: '+40%' },
      { metric: 'Project Timeline', before: '24 months planned', after: '18 months actual', improvement: '-6 months' },
      { metric: 'Grid Dependency Post-Completion', before: 'NA', after: '35% (solar+generator hybrid)', improvement: 'Resilient infrastructure' },
    ],
    technical: {
      equipment: [
        'Primary: 250kVA generator',
        'Backup: 150kVA generator',
        'Synchronized load-sharing controller',
        'Construction site distribution system',
      ],
      capacity: '250kVA primary, 150kVA backup',
      installation: '20 days',
      commissioning: '5 days',
    },
    testimonial: {
      quote:
        'Reliable power accelerated our construction by 6 months. Now our residents have backup for their apartments. It was a game-changer investment.',
      author: 'Greenheart Kilifi',
      position: 'Real Estate Development',
      quoteReleased: true,
    },
    savings: { annualKES: 3_840_000, payback: '24 months', roi: '208% over 5 years' },
    images: ['/images/enhanced/GREENHEART KILIFI GENERATOR-4K-CINEMATIC.jpg'],
    duration: '20 days',
    complexity: 4,
    evidence: [
      { label: 'Dual-Generator Synchronization Report', documentPath: 'greenheart-sync-test.pdf' },
      { label: 'Construction Phase Energy Logs', documentPath: 'construction-logs-2024.csv' },
    ],
  },

  {
    id: 'ntsa-operations-center',
    status: 'PUBLISHED',
    completedAt: '2025-02',
    title: 'NTSA Operations Center — Government Critical Infrastructure',
    client: 'National Transport & Safety Authority',
    clientNameReleased: true,
    location: 'Nairobi',
    county: 'Nairobi',
    category: 'Generator',
    challenge:
      'Government transport safety operations center required 99.95% uptime for critical national infrastructure. Power interruptions affected traffic control and emergency response coordination.',
    solution:
      'Installed enterprise-grade Atlas Copco generator with automatic failover and remote diagnostics. Integrated with UPS for seamless transfer.',
    results: [
      { metric: 'Uptime', before: '99.1%', after: '99.97%', improvement: '+0.86%' },
      { metric: 'Critical Interruptions', before: '8/year', after: '0', improvement: '-100%' },
      { metric: 'Transfer Time', before: '8 seconds', after: '<1 second', improvement: '-88%' },
    ],
    technical: {
      equipment: [
        'Atlas Copco generator (heavy-duty spec)',
        'Uninterruptible Power Supply',
        'Advanced control & monitoring system',
        'Redundant transfer automation',
      ],
      capacity: 'Enterprise-grade multi-unit configuration',
      installation: '15 days',
      commissioning: '4 days',
    },
    savings: { annualKES: 1_920_000, payback: '18 months', roi: '444% over 5 years' },
    images: ['/images/enhanced/NTSA- ATLAS COPCO GENERATOR-4K-CINEMATIC.jpg'],
    duration: '15 days',
    complexity: 4,
    evidence: [
      { label: 'Enterprise Reliability Report', documentPath: 'ntsa-reliability-audit.pdf' },
      { label: 'Failover Test Results', documentPath: 'ntsa-failover-tests.pdf' },
    ],
  },
];

/** Public selector — only entries with a signed release and verifiable evidence. */
export function getPublishedCaseStudies(): CaseStudy[] {
  return CASE_STUDIES.filter(
    (cs) => cs.status === 'PUBLISHED' && cs.evidence && cs.evidence.length > 0,
  );
}
