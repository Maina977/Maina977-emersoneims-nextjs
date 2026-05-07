/**
 * B2B Page Profiles — EmersonEIMS
 *
 * One profile per priority money / diagnostic / industry page.
 * Drives the <B2BCommercialBand /> component injected at the top
 * of each page so the whole site reads like one serious B2B
 * engineering company:
 *   1. What is this service/product
 *   2. Who is it for
 *   3. What business problem does it solve
 *   4. Why EmersonEIMS
 *   5. Proof / trust signal
 *   6. Clear next step
 *
 * Pure data — safe to import from server or client components.
 */

export type B2BCta = {
  label: string;
  href: string;
  /** primary = filled accent, secondary = outline, tertiary = ghost */
  variant?: 'primary' | 'secondary' | 'tertiary';
  /** Optional ARIA label override */
  ariaLabel?: string;
};

export type B2BProfile = {
  /** Short eyebrow tag, e.g. "Power Continuity" */
  eyebrow: string;
  /** One-line plain B2B headline, e.g. "Generator sales, installation, ATS & 24/7 maintenance." */
  headline: string;
  /** 1-2 sentence commercial subtitle */
  subtitle: string;
  /** Industry chips — pick only the relevant ones */
  whoFor: string[];
  /** 3-column problem -> solution -> outcome triplets */
  pso: Array<{ problem: string; solution: string; outcome: string }>;
  /** Trust badges / signals (short strings) */
  trust: string[];
  /** CTA buttons (max 3 recommended) */
  ctas: B2BCta[];
  /** Optional accent color tailwind class fragment, e.g. 'amber' / 'cyan' */
  accent?: 'amber' | 'cyan' | 'emerald' | 'violet' | 'sky' | 'rose' | 'orange' | 'indigo';
};

const WHATSAPP = 'https://wa.me/254768860665';
const TEL = 'tel:+254768860665';

export const B2B_PROFILES = {
  generators: {
    eyebrow: 'Power Continuity • Diesel Generators',
    headline: 'Cummins & Voltka diesel generators — sized, installed, and maintained for uptime-critical sites.',
    subtitle:
      'Authorized dealer engineering for hospitals, manufacturers, telecom, banks, hotels and data-sensitive operations across Kenya. 10 kVA – 2,000 kVA, with ATS, synchronization, and SLA-backed maintenance.',
    whoFor: [
      'Hospitals & clinics',
      'Manufacturing plants',
      'Telecom & data centres',
      'Banks & ATMs',
      'Hotels & hospitality',
      'Commercial buildings',
      'Construction sites',
    ],
    pso: [
      {
        problem: 'Grid outages stop production, surgery, transactions and tenants.',
        solution: 'Right-sized Cummins/Voltka set with ATS, fuel logistics and remote monitoring.',
        outcome: 'Documented uptime, lower downtime cost, predictable fuel and service spend.',
      },
      {
        problem: 'Aging or undersized generators trip on start-up loads and damage equipment.',
        solution: 'Independent load study, derating audit, controls upgrade or replacement plan.',
        outcome: 'Stable voltage and frequency, fewer alarms, longer asset life.',
      },
      {
        problem: 'Reactive call-outs cost more than scheduled service.',
        solution: 'EmersonEIMS SLA: scheduled service, genuine parts, 24/7 emergency response.',
        outcome: 'Fewer breakdowns, full service history for audits and warranty claims.',
      },
    ],
    trust: [
      'Authorized Cummins / Voltka dealer',
      '3-year warranty + 1 year free service',
      '24/7 emergency response, all 47 counties',
      'Genuine parts, factory-trained engineers',
    ],
    ctas: [
      { label: 'Request a Generator Quote', href: '/contact?topic=generator-quote', variant: 'primary' },
      { label: 'Book a Free Site Audit', href: '/booking?service=generator-audit', variant: 'secondary' },
      { label: 'WhatsApp an Engineer', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'amber',
  },

  solar: {
    eyebrow: 'Renewable Energy • Solar PV & Storage',
    headline: 'Commercial & industrial solar PV, hybrid and battery systems — engineered for ROI, not slogans.',
    subtitle:
      'Solar design, supply, installation and O&M for businesses that need to cut energy cost without risking uptime. Backed by independent sizing, bankable proposals and post-install monitoring.',
    whoFor: [
      'Manufacturers',
      'Hotels & resorts',
      'Hospitals',
      'Schools & campuses',
      'Agribusiness & cold storage',
      'Commercial buildings',
      'Telecom sites',
    ],
    pso: [
      {
        problem: 'Diesel and grid bills are eroding margins.',
        solution: 'Load-profile based solar/hybrid sizing with realistic yield and payback model.',
        outcome: 'Lower kWh cost, capped exposure to tariff and fuel volatility.',
      },
      {
        problem: 'Past solar quotes felt copy-pasted and nobody owned the result.',
        solution: 'Engineer-led design, equipment selection and single-point installation contract.',
        outcome: 'One accountable partner from feasibility to commissioning and beyond.',
      },
      {
        problem: 'Systems underperform after year 1 with no monitoring.',
        solution: 'Inverter monitoring, scheduled cleaning, performance audits and O&M plan.',
        outcome: 'Documented yield, faster fault response, protected investment.',
      },
    ],
    trust: [
      'Engineer-led design, not sales-led',
      'Tier-1 panel & inverter brands only',
      'Bankable proposals for finance review',
      'O&M contracts with response SLAs',
    ],
    ctas: [
      { label: 'Get a Commercial Solar Proposal', href: '/contact?topic=solar-proposal', variant: 'primary' },
      { label: 'Free Solar Feasibility Audit', href: '/booking?service=solar-audit', variant: 'secondary' },
      { label: 'WhatsApp Solar Engineer', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'emerald',
  },

  ups: {
    eyebrow: 'Power Quality • UPS Systems',
    headline: 'UPS supply, installation, battery replacement and SLA maintenance for mission-critical loads.',
    subtitle:
      'From server rooms and ICUs to trading floors and process controls — sized, installed and serviced so the load never sees the outage.',
    whoFor: [
      'Hospitals (ICU, theatre, lab)',
      'Banks & financial institutions',
      'Telecom & data centres',
      'Manufacturing controls',
      'Government & institutional',
      'Commercial buildings',
    ],
    pso: [
      {
        problem: 'Brownouts and switchover gaps corrupt data and damage controls.',
        solution: 'Online double-conversion UPS, properly sized with battery autonomy plan.',
        outcome: 'Zero-gap transfer, clean voltage, protected critical loads.',
      },
      {
        problem: 'Old batteries silently fail until the next outage.',
        solution: 'Scheduled battery testing, capacity reports and proactive replacement.',
        outcome: 'No surprise UPS failures, audit-ready battery records.',
      },
      {
        problem: 'Mixed-brand UPS estate with no single owner.',
        solution: 'EmersonEIMS multi-brand UPS service contract, one ticket, one SLA.',
        outcome: 'Fewer vendors, faster MTTR, predictable annual cost.',
      },
    ],
    trust: [
      'Multi-brand UPS service (online, line-interactive, modular)',
      'Battery load testing & capacity reports',
      '24/7 SLA response for critical sites',
      'Documented commissioning & handover',
    ],
    ctas: [
      { label: 'Request a UPS Quote', href: '/contact?topic=ups-quote', variant: 'primary' },
      { label: 'Book a UPS Health Check', href: '/booking?service=ups-audit', variant: 'secondary' },
      { label: 'WhatsApp UPS Engineer', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'violet',
  },

  motorRewinding: {
    eyebrow: 'Rotating Equipment • Motor Rewinding',
    headline: 'Industrial motor rewinding, repair and reconditioning — by an engineering workshop, not a backstreet shop.',
    subtitle:
      'LV and HV motor diagnosis, stator/rotor rewind, bearing replacement, balancing and load-tested handover. Documented, traceable, and warrantied.',
    whoFor: [
      'Manufacturing plants',
      'Agribusiness & food processing',
      'Water utilities',
      'Cement & mining',
      'Construction equipment',
      'HVAC & pump operators',
    ],
    pso: [
      {
        problem: 'A failed motor stops the whole line and emergency replacements are expensive.',
        solution: 'Fast diagnosis, transparent quote, rewind or replace decision with payback.',
        outcome: 'Shorter downtime, cost-justified repair vs replace, clean handover.',
      },
      {
        problem: 'Rewound motors come back with the same fault in months.',
        solution: 'Insulation testing, thermal class match, bearings, balancing, no-load + load test.',
        outcome: 'Motor returns within spec — and stays there.',
      },
      {
        problem: 'No paperwork on what was actually done inside the motor.',
        solution: 'Test certificates: IR, PI, surge, vibration, temperature, run-up data.',
        outcome: 'Insurer- and audit-ready records for every overhaul.',
      },
    ],
    trust: [
      'IR / PI / surge testing as standard',
      'Dynamic balancing & vibration analysis',
      'Workshop + on-site rewind capability',
      'Documented warranty on every job',
    ],
    ctas: [
      { label: 'Request a Motor Rewind Quote', href: '/contact?topic=motor-rewind', variant: 'primary' },
      { label: 'Book a Motor Health Check', href: '/booking?service=motor-audit', variant: 'secondary' },
      { label: 'WhatsApp Motor Engineer', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'orange',
  },

  incinerators: {
    eyebrow: 'Waste Treatment • Incinerators',
    headline: 'Hospital, municipal and industrial incinerators — supply, installation and compliance maintenance.',
    subtitle:
      'NEMA-aligned thermal waste treatment for medical, hazardous and process waste. Sized for throughput, engineered for emissions compliance and operator safety.',
    whoFor: [
      'Hospitals & health facilities',
      'County governments',
      'NGOs & humanitarian programs',
      'Pharmaceutical & lab',
      'Manufacturing waste streams',
      'Agribusiness biosecurity',
    ],
    pso: [
      {
        problem: 'Sharps and infectious waste piling up with no compliant disposal route.',
        solution: 'Capacity-matched dual-chamber incinerator, installation and operator training.',
        outcome: 'Compliant on-site disposal, lower waste-handling risk and cost.',
      },
      {
        problem: 'Old incinerators smoke, under-burn, and fail inspections.',
        solution: 'Burner overhaul, refractory rebuild, flue and controls upgrade.',
        outcome: 'Cleaner stack, full burn-out, inspection-ready operation.',
      },
      {
        problem: 'No service partner means no spares, no records, no accountability.',
        solution: 'EmersonEIMS service contract: scheduled checks, spares, log books.',
        outcome: 'Documented operation for NEMA, donors and internal audit.',
      },
    ],
    trust: [
      'NEMA-aligned designs & documentation',
      'Hospital, municipal & industrial sizes',
      'Burner, refractory & controls expertise',
      'Operator training & log-book handover',
    ],
    ctas: [
      { label: 'Request an Incinerator Proposal', href: '/contact?topic=incinerator-quote', variant: 'primary' },
      { label: 'Book a Site Assessment', href: '/booking?service=incinerator-audit', variant: 'secondary' },
      { label: 'WhatsApp Waste Engineer', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'rose',
  },

  boreholePumps: {
    eyebrow: 'Water Systems • Borehole Pumps',
    headline: 'Borehole pump sizing, installation and repair — engineered for sustainable yield, not guesswork.',
    subtitle:
      'Submersible and surface pump systems for institutions, agribusiness and commercial sites. Right-sized to the borehole test data, protected against dry-run, and serviceable for years.',
    whoFor: [
      'Hospitals & schools',
      'Hotels & resorts',
      'Agribusiness & irrigation',
      'Real estate & estates',
      'Industrial water supply',
      'Counties & water utilities',
    ],
    pso: [
      {
        problem: 'Pumps burn out because they were sized off a brochure, not the borehole.',
        solution: 'Sizing from yield test, dynamic water level and head — with margin.',
        outcome: 'Pump runs in its happy zone, fewer trips, longer life.',
      },
      {
        problem: 'No dry-run, no surge protection — recurring motor failures.',
        solution: 'Proper control panel: dry-run, overload, phase, surge, soft-start where needed.',
        outcome: 'Protected motor, fewer emergency call-outs, lower TCO.',
      },
      {
        problem: 'Solar borehole pumps overpromised and underdelivered.',
        solution: 'Solar/hybrid pump design with realistic daily output, storage and backup logic.',
        outcome: 'Predictable water supply, lower diesel dependence.',
      },
    ],
    trust: [
      'Sized from borehole test data',
      'Protection panels as standard',
      'Solar, AC and hybrid configurations',
      'Service contracts with response SLA',
    ],
    ctas: [
      { label: 'Request a Borehole Pump Quote', href: '/contact?topic=borehole-quote', variant: 'primary' },
      { label: 'Book a Pump Site Visit', href: '/booking?service=borehole-audit', variant: 'secondary' },
      { label: 'WhatsApp Water Engineer', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'sky',
  },

  diagnostics: {
    eyebrow: 'Engineering Diagnostics',
    headline: 'Multi-discipline diagnostics for power, solar, motors, HVAC, UPS, water and waste systems.',
    subtitle:
      'Use the calculators and Q&A to triage the issue — then escalate to an EmersonEIMS engineer for on-site diagnosis, repair and SLA-backed maintenance.',
    whoFor: [
      'Facility & maintenance managers',
      'Hospitals & critical sites',
      'Manufacturing & processing',
      'Property & estate managers',
      'Telecom & ICT operations',
      'Procurement & technical buyers',
    ],
    pso: [
      {
        problem: 'Symptoms unclear — is it the genset, the ATS, the load, or the cabling?',
        solution: 'Guided diagnostic Q&A and sizing calculators isolate the likely cause.',
        outcome: 'Faster triage, clearer brief to the engineer, less guesswork.',
      },
      {
        problem: 'Quotes from other vendors don\'t match the actual fault.',
        solution: 'Independent diagnosis and scope of works before any spend.',
        outcome: 'You only buy work that fixes the real problem.',
      },
      {
        problem: 'Repeat failures with no root-cause record.',
        solution: 'Diagnostic report, corrective actions and preventive maintenance plan.',
        outcome: 'Failure modes closed out, not just patched.',
      },
    ],
    trust: [
      'Multi-discipline engineering team',
      'On-site diagnosis across Kenya',
      'Independent scope-of-works reports',
      'Escalation to repair & SLA service',
    ],
    ctas: [
      { label: 'Book an On-Site Diagnostic', href: '/booking?service=diagnostic-visit', variant: 'primary' },
      { label: 'Talk to an Engineer', href: '/contact?topic=diagnostic', variant: 'secondary' },
      { label: 'WhatsApp Diagnostic Desk', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'cyan',
  },

  ac: {
    eyebrow: 'HVAC • Air Conditioning',
    headline: 'Commercial AC and HVAC — sized correctly, installed properly, maintained to spec.',
    subtitle:
      'Split, cassette, ducted, VRF and chiller systems for offices, hospitals, hotels, server rooms and retail. From load calculation to refrigerant compliance and AMC service contracts.',
    whoFor: ['Offices & corporate HQ', 'Hospitals & clinics', 'Hotels & restaurants', 'Server rooms & ICT', 'Retail & malls', 'Schools & institutions'],
    pso: [
      { problem: 'Oversized or undersized AC = high bills, poor comfort, short life.', solution: 'Engineered load calculation, brand-agnostic equipment selection.', outcome: 'Right-sized system, lower kWh, longer asset life.' },
      { problem: 'Poor installation causes refrigerant leaks and compressor failure.', solution: 'Pressure-test, vacuum, charge and commission to manufacturer spec.', outcome: 'Documented commissioning, warranty preserved.' },
      { problem: 'No AMC means breakdowns become emergencies.', solution: 'Scheduled AMC: filter, coil, refrigerant, electrical, controls.', outcome: 'Lower TCO, fewer emergency callouts, capped annual cost.' },
    ],
    trust: ['Daikin / LG / Mitsubishi / Carrier trained', 'Refrigerant handling compliance', 'AMC contracts with defined SLA', 'From split AC to VRF and chillers'],
    ctas: [
      { label: 'Request an AC Quote', href: '/contact?topic=ac-quote', variant: 'primary' },
      { label: 'Book an AC Site Survey', href: '/booking?service=ac-survey', variant: 'secondary' },
      { label: 'WhatsApp HVAC Engineer', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'sky',
  },

  controls: {
    eyebrow: 'Controls • DSE & PowerWizard',
    headline: 'Generator controllers — DeepSea & PowerWizard configuration, fault diagnosis and integration.',
    subtitle:
      'AMF, ATS, sync and load-share configuration, alarm troubleshooting, Modbus / Ethernet / GSM integration. For sites that need their controllers to actually do their job.',
    whoFor: ['Data centres & telecom', 'Hospitals', 'Manufacturing plants', 'Power-station operators', 'Facility managers', 'OEM panel builders'],
    pso: [
      { problem: 'Controller alarms nobody can decode and a downed genset.', solution: 'On-site fault diagnosis with DSE Config Suite / ServiceRanger.', outcome: 'Genset back online, alarms understood and documented.' },
      { problem: 'AMF / ATS not transferring as expected.', solution: 'Re-configure timers, sensing, transfer logic; full sequence test.', outcome: 'Reliable mains-fail transfer, shorter downtime.' },
      { problem: 'No SCADA / remote visibility on critical gensets.', solution: 'Modbus, Ethernet or GSM remote-monitoring setup.', outcome: 'Real-time alerts, fewer surprise outages.' },
    ],
    trust: ['DeepSea & PowerWizard expertise', 'AMF / ATS / sync / load-share', 'SCADA & remote-monitoring integration', 'Documented configuration & test reports'],
    ctas: [
      { label: 'Request a Controls Quote', href: '/contact?topic=controls', variant: 'primary' },
      { label: 'Book a Controller Site Visit', href: '/booking?service=controls-visit', variant: 'secondary' },
      { label: 'WhatsApp Controls Engineer', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'cyan',
  },

  dieselAutomation: {
    eyebrow: 'Diesel Automation • AMF / ATS',
    headline: 'AMF panels, ATS systems and remote monitoring for diesel generators.',
    subtitle:
      'Designed and built for sites where the genset must start, transfer and run unattended — and where every minute of downtime has a price tag.',
    whoFor: ['Hospitals & critical sites', 'Telecom & data centres', 'Hotels & service buildings', 'Manufacturing', 'Banks & ATM networks', 'Remote / unmanned sites'],
    pso: [
      { problem: 'Manual changeover = late response, lost revenue, angry tenants.', solution: 'Properly designed AMF / ATS panel with monitored transfer logic.', outcome: 'Automatic mains-fail response, predictable uptime.' },
      { problem: 'Existing ATS misbehaves — no engineer can explain why.', solution: 'Audit, re-wire, re-program, retest the full sequence.', outcome: 'A panel you can actually trust at 2am.' },
      { problem: 'No remote visibility = no preventive action.', solution: 'GSM / Ethernet remote monitoring with alarms and reports.', outcome: 'Issues caught before they become outages.' },
    ],
    trust: ['Engineered AMF / ATS panels', 'DeepSea & PowerWizard certified', 'Remote monitoring & alerting', 'Documented commissioning'],
    ctas: [
      { label: 'Request an AMF / ATS Quote', href: '/contact?topic=amf-ats', variant: 'primary' },
      { label: 'Book an Automation Audit', href: '/booking?service=automation-audit', variant: 'secondary' },
      { label: 'WhatsApp Automation Desk', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'indigo',
  },

  fabrication: {
    eyebrow: 'Fabrication • Steel & Enclosures',
    headline: 'Custom steel fabrication — generator canopies, enclosures, frames, skids and structures.',
    subtitle:
      'Workshop and on-site fabrication for power, water, HVAC and industrial projects. Sound-attenuated canopies, IP-rated enclosures, equipment skids, walkways and access platforms.',
    whoFor: ['Generator integrators', 'Industrial & process plants', 'Telecom & ISPs', 'Construction & EPC contractors', 'Real estate developers', 'Government & institutional projects'],
    pso: [
      { problem: 'Off-the-shelf canopies don\'t fit the site or the noise spec.', solution: 'Bespoke sound-attenuated canopy designed to actual dB target.', outcome: 'Compliant install, neighbours satisfied, equipment protected.' },
      { problem: 'Outdoor electronics fail because the enclosure was never IP-rated properly.', solution: 'Engineered IP-55/65 enclosures with thermal management.', outcome: 'Protected assets, fewer warranty disputes.' },
      { problem: 'Project delays because steelwork came late or wrong.', solution: 'In-house workshop with drawings, QC and timeline ownership.', outcome: 'Predictable delivery, single point of responsibility.' },
    ],
    trust: ['Workshop + on-site fabrication', 'Sound-attenuated canopies (dB-spec)', 'IP-rated outdoor enclosures', 'Drawings, QC and delivery sign-off'],
    ctas: [
      { label: 'Request a Fabrication Quote', href: '/contact?topic=fabrication', variant: 'primary' },
      { label: 'Send Drawings for Costing', href: '/contact?topic=fabrication-drawings', variant: 'secondary' },
      { label: 'WhatsApp Fabrication Desk', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'orange',
  },

  highVoltage: {
    eyebrow: 'High Voltage • Distribution & Transformers',
    headline: 'HV / MV systems — transformers, switchgear, distribution boards, earthing and protection.',
    subtitle:
      'Design, supply, installation, testing and maintenance of high-voltage and distribution infrastructure for industrial sites, institutions and commercial developments.',
    whoFor: ['Manufacturing plants', 'Hospitals & campuses', 'Real estate & estates', 'Mining & cement', 'Government infrastructure', 'EPC contractors'],
    pso: [
      { problem: 'Frequent trips, unbalanced loads and unexplained outages.', solution: 'Power-quality study, board audit, protection coordination review.', outcome: 'Stable distribution, fewer nuisance trips.' },
      { problem: 'Old transformer with no records — insurance and audit risk.', solution: 'Oil sampling, IR thermography, ratio and insulation testing.', outcome: 'Traceable health record, planned not reactive replacement.' },
      { problem: 'Distribution board built around what was on the shelf.', solution: 'Engineered DB design with proper protection and segregation.', outcome: 'Safer, easier to maintain, easier to extend.' },
    ],
    trust: ['HV / MV design & installation', 'Protection coordination studies', 'Thermography & insulation testing', 'Documented commissioning'],
    ctas: [
      { label: 'Request an HV Quote', href: '/contact?topic=hv-quote', variant: 'primary' },
      { label: 'Book an Electrical Audit', href: '/booking?service=hv-audit', variant: 'secondary' },
      { label: 'WhatsApp HV Engineer', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'amber',
  },

  motors: {
    eyebrow: 'Motors • Supply, VFD & Service',
    headline: 'Industrial motors, VFDs and motor-driven systems — supplied, installed and serviced.',
    subtitle:
      'AC and DC motors, VFD selection and commissioning, bearing failure analysis, insulation testing and rewinding referrals — all under one engineering roof.',
    whoFor: ['Manufacturing & processing', 'Water utilities', 'Agribusiness', 'Cement & quarries', 'HVAC operators', 'Pump & fan operators'],
    pso: [
      { problem: 'Wrong motor for the duty = repeat failures.', solution: 'Application analysis, frame, IE-class and IP-rating selection.', outcome: 'Motor that survives the duty cycle.' },
      { problem: 'VFD installed without harmonics or cable consideration.', solution: 'VFD sizing with reactor / filter and shielded cable design.', outcome: 'Smooth start-up, longer motor life, less power-quality grief.' },
      { problem: 'No baseline data = nobody knows when the motor will fail.', solution: 'IR / PI / vibration baseline + scheduled re-test.', outcome: 'Predictive maintenance, planned outages instead of emergencies.' },
    ],
    trust: ['AC / DC motor expertise', 'VFD sizing & commissioning', 'Insulation & vibration testing', 'Workshop rewind referral & QC'],
    ctas: [
      { label: 'Request a Motor / VFD Quote', href: '/contact?topic=motor-vfd', variant: 'primary' },
      { label: 'Book a Motor Site Visit', href: '/booking?service=motor-visit', variant: 'secondary' },
      { label: 'WhatsApp Motor Engineer', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'orange',
  },

  powerInterruptions: {
    eyebrow: 'Power Quality • Interruption Protection',
    headline: 'Power interruptions, surges and voltage issues — diagnosed and fixed.',
    subtitle:
      'Surge protection, voltage stabilisation, harmonic filtering and UPS strategy for sites that have already lost equipment to dirty power.',
    whoFor: ['Hospitals & laboratories', 'Banks & ATM networks', 'Telecom & data centres', 'Manufacturing controls', 'Hotels & service buildings', 'High-rise commercial'],
    pso: [
      { problem: 'Equipment keeps failing and nobody can prove it\'s the power.', solution: 'Power-quality logging: voltage, sag, swell, THD, transients.', outcome: 'Evidence-based fix instead of guesswork.' },
      { problem: 'No coordinated surge protection at incomer / DB / sensitive load.', solution: 'Three-stage SPD design with proper earthing.', outcome: 'Equipment survives the next storm and the next switching event.' },
      { problem: 'UPS, AVR and stabiliser bought separately, none working together.', solution: 'End-to-end power-quality strategy from incomer to load.', outcome: 'One coherent plan, predictable protection.' },
    ],
    trust: ['Power-quality measurement & reports', 'Coordinated surge protection design', 'Voltage stabilisation & UPS integration', 'Vendor-neutral recommendations'],
    ctas: [
      { label: 'Book a Power-Quality Survey', href: '/booking?service=pq-survey', variant: 'primary' },
      { label: 'Request a Protection Quote', href: '/contact?topic=power-quality', variant: 'secondary' },
      { label: 'WhatsApp PQ Engineer', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'rose',
  },

  solutionsSolar: {
    eyebrow: 'Solar Solutions Hub',
    headline: 'Solar PV, hybrid, battery and inverter solutions — engineered, installed and supported.',
    subtitle:
      'From feasibility and design to installation, monitoring and inverter fault recovery. For commercial buyers who need solar to deliver, not just be installed.',
    whoFor: ['Commercial buildings', 'Manufacturers', 'Hotels & resorts', 'Schools & campuses', 'Agribusiness', 'Telecom & ICT'],
    pso: [
      { problem: 'Solar quote was a price, not a design.', solution: 'Load profile + irradiance + bankable yield model.', outcome: 'A proposal you can defend to finance and the board.' },
      { problem: 'Inverter fault codes and nobody to call.', solution: 'Multi-brand inverter diagnostics and parts support.', outcome: 'Faster restoration, less generation lost.' },
      { problem: 'Battery system underperforming after a year.', solution: 'BMS audit, capacity test, charge-strategy review.', outcome: 'Restored autonomy or a clear replacement plan.' },
    ],
    trust: ['Engineer-led design', 'Multi-brand inverter & BMS support', 'Bankable proposals', 'O&M & monitoring contracts'],
    ctas: [
      { label: 'Request a Solar Proposal', href: '/contact?topic=solar-proposal', variant: 'primary' },
      { label: 'Book a Solar Site Audit', href: '/booking?service=solar-audit', variant: 'secondary' },
      { label: 'WhatsApp Solar Engineer', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'emerald',
  },

  solarSizing: {
    eyebrow: 'Solar Sizing • Engineering Tools',
    headline: 'Engineer-grade solar sizing — load, panels, batteries and inverters, done properly.',
    subtitle:
      'Use the sizing hub to get realistic numbers, then escalate to EmersonEIMS for a bankable design and supervised install.',
    whoFor: ['Commercial buyers', 'Procurement & technical teams', 'Architects & MEP consultants', 'Off-grid sites & lodges', 'Estates & developments', 'NGO & institutional projects'],
    pso: [
      { problem: 'Sizing based on a single brochure number = systems that miss spec.', solution: 'Load profile, PSH, derating and reserve factored in.', outcome: 'Sizing you can sign off on.' },
      { problem: 'Battery autonomy collapses in cloudy weeks.', solution: 'Realistic DOD, ambient and ageing assumptions.', outcome: 'Autonomy that holds in the worst week, not the best.' },
      { problem: 'Inverter undersized for surge / motor loads.', solution: 'Surge-aware inverter selection with margin.', outcome: 'No nuisance shutdowns at compressor start-up.' },
    ],
    trust: ['PSH & load-profile based design', 'Realistic battery & inverter sizing', 'Engineer review on request', 'Bridges to bankable proposals'],
    ctas: [
      { label: 'Request an Engineered Solar Design', href: '/contact?topic=solar-design', variant: 'primary' },
      { label: 'Book a Solar Sizing Review', href: '/booking?service=solar-sizing', variant: 'secondary' },
      { label: 'WhatsApp Solar Engineer', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'emerald',
  },

  solutionsGenerators: {
    eyebrow: 'Generators Solution Hub',
    headline: 'Generator installation, troubleshooting and maintenance — the technical hub.',
    subtitle:
      'Deep-dive guides for installation, fault diagnosis, controllers and maintenance — backed by the EmersonEIMS field service team for any escalation.',
    whoFor: ['Facility managers', 'EPC & MEP contractors', 'Hospitals & critical sites', 'Manufacturing', 'Telecom & data centres', 'Property managers'],
    pso: [
      { problem: 'Genset commissioned poorly = recurring trips and warranty fights.', solution: 'Independent commissioning audit and corrective works.', outcome: 'Asset operates as rated, warranty defensible.' },
      { problem: 'Faults reset and forgotten, then repeat at the worst moment.', solution: 'Root-cause investigation and documented corrective actions.', outcome: 'Faults closed out, not papered over.' },
      { problem: 'No proper PM regime = expensive surprises.', solution: 'EmersonEIMS PM contract: scheduled service + parts + reports.', outcome: 'Predictable spend, longer asset life.' },
    ],
    trust: ['Independent commissioning audits', 'Multi-brand fault diagnosis', 'PM contracts with response SLA', 'Documented job reports'],
    ctas: [
      { label: 'Request a Generator Service Contract', href: '/contact?topic=gen-pm', variant: 'primary' },
      { label: 'Book a Generator Site Audit', href: '/booking?service=gen-audit', variant: 'secondary' },
      { label: 'WhatsApp Generator Desk', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'amber',
  },

  troubleshooting: {
    eyebrow: 'Emergency Troubleshooting',
    headline: 'Step-by-step fault diagnosis — and a real engineer on the other end when you need one.',
    subtitle:
      'For sites that cannot afford to stay down: walk the wizard, capture the symptoms, then escalate to EmersonEIMS for on-site repair across Kenya.',
    whoFor: [
      'Hospitals & critical care',
      'Banks & ATM networks',
      'Telecom & data centres',
      'Manufacturing lines',
      'Hotels & service buildings',
      'Construction & remote sites',
    ],
    pso: [
      {
        problem: 'Equipment is down right now and the supplier isn\'t answering.',
        solution: 'Wizard isolates the likely cause; emergency desk dispatches an engineer.',
        outcome: 'Faster restoration, fewer wrong parts, less downtime cost.',
      },
      {
        problem: 'Recurring nuisance trips with no clear fix.',
        solution: 'Structured diagnostic + on-site root-cause analysis.',
        outcome: 'Fault closed out, not reset and forgotten.',
      },
      {
        problem: 'No after-hours technical support contract.',
        solution: 'EmersonEIMS 24/7 SLA: defined response time, defined escalation.',
        outcome: 'Predictable response, accountable partner.',
      },
    ],
    trust: [
      '24/7 emergency response',
      'Engineers across all 47 counties',
      'SLA-backed critical-site contracts',
      'Documented job reports',
    ],
    ctas: [
      { label: 'Call the Emergency Desk', href: TEL, variant: 'primary' },
      { label: 'WhatsApp an Engineer Now', href: WHATSAPP, variant: 'secondary' },
      { label: 'Request an SLA Contract', href: '/contact?topic=sla', variant: 'tertiary' },
    ],
    accent: 'rose',
  },

  // ── AI / Product pages ────────────────────────────────────────────────
  aiTools: {
    eyebrow: 'AI Engineering Tools • B2B',
    headline: 'AI-assisted engineering tools for power, solar, generators, motors and water — built for serious sites.',
    subtitle:
      'Sizing, fault diagnosis, ROI and audit-grade reports — used by EPC contractors, facility managers and consulting engineers across Kenya. Free to try, real engineers behind every recommendation.',
    whoFor: ['Facility managers', 'EPC & MEP contractors', 'Consulting engineers', 'Hospitals & data centres', 'Manufacturing & agribusiness', 'Government & NGOs'],
    pso: [
      { problem: 'Generic online calculators give answers you cannot defend in a tender.', solution: 'EmersonEIMS AI tools use real load profiles and authoritative datasets.', outcome: 'Bankable numbers, audit-ready reports, fewer redesigns.' },
      { problem: 'No in-house engineer to vet vendor specs.', solution: 'AI sizing + human escalation to a Kenya-based engineering desk.', outcome: 'Right-sized systems, fewer over-spec / under-spec costs.' },
      { problem: 'Reports look pretty but lack provenance.', solution: 'Every figure cites its source; PDFs include a Data Provenance appendix.', outcome: 'Reports that survive board review and lender due diligence.' },
    ],
    trust: ['Sources cited on every figure', 'Engineers behind every tool', 'Used on real EPC tenders', 'Free to try, no credit card'],
    ctas: [
      { label: 'Talk to an Engineer', href: '/contact?topic=ai-tools', variant: 'primary' },
      { label: 'Book a Tools Walkthrough', href: '/booking?service=ai-walkthrough', variant: 'secondary' },
      { label: 'WhatsApp the Tools Desk', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'violet',
  },

  solarGeniusPro: {
    eyebrow: 'Solar Genius Pro • Design & Sizing Suite',
    headline: 'Bankable C&I solar design — sizing, yield, ROI and tender-ready reports in one suite.',
    subtitle:
      'Used by EmersonEIMS engineers and partner EPCs to size, simulate and document commercial & industrial solar systems for hospitals, factories, agribusiness and government in Kenya.',
    whoFor: ['EPC & solar contractors', 'Facility & energy managers', 'Hospitals & data centres', 'Manufacturing & agribusiness', 'Banks & financiers', 'Government & NGOs'],
    pso: [
      { problem: 'Spreadsheets and vendor calculators disagree on size and ROI.', solution: 'Single suite with NASA POWER irradiance, real tariffs and load profiles.', outcome: 'One defensible design package, faster tender turnaround.' },
      { problem: 'Lender / board rejects designs that lack provenance.', solution: 'Every figure cites its source; PDF includes Data Provenance appendix.', outcome: 'Designs that pass due diligence the first time.' },
      { problem: 'Designs ignore generator interaction, ATS and uptime.', solution: 'Hybrid sizing with grid + diesel + battery + ATS engineering.', outcome: 'Real uptime gains, not just panel kWp on paper.' },
    ],
    trust: ['NASA POWER irradiance', 'Audit-grade PDF reports', 'Cross-checked by Kenya engineers', 'Used on live EPC tenders'],
    ctas: [
      { label: 'Request a Solar Design', href: '/contact?topic=solar-design', variant: 'primary' },
      { label: 'Book a Solar Site Audit', href: '/booking?service=solar-audit', variant: 'secondary' },
      { label: 'WhatsApp the Solar Desk', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'orange',
  },

  solarDesignStudio: {
    eyebrow: 'Solar Design Studio • C&I PV',
    headline: 'Visual C&I solar design — array layouts, single-line diagrams and tender packs.',
    subtitle:
      'Drag-and-drop solar layout, string design, single-line schematics and BOQ generation for commercial & industrial PV — backed by EmersonEIMS engineers.',
    whoFor: ['EPC & solar contractors', 'Consulting engineers', 'Facility & energy managers', 'Architects & developers', 'Property managers'],
    pso: [
      { problem: 'Hand-drawn layouts cause BOQ errors and re-orders on site.', solution: 'Studio generates layout, BOQ and SLD in one consistent package.', outcome: 'Fewer site change-orders, predictable cost, faster install.' },
      { problem: 'Designs lack engineering review.', solution: 'Every studio design can be escalated to a real engineer for sign-off.', outcome: 'Designs that get permitted and financed.' },
      { problem: 'Hard to compare two design options for the board.', solution: 'Side-by-side option compare with yield + ROI deltas.', outcome: 'Faster, cleaner board decisions.' },
    ],
    trust: ['BOQ-ready exports', 'Engineer-reviewed designs', 'Used on live tenders', 'Backed by EmersonEIMS field team'],
    ctas: [
      { label: 'Request a Studio Design', href: '/contact?topic=solar-studio', variant: 'primary' },
      { label: 'Book a Design Walkthrough', href: '/booking?service=solar-studio', variant: 'secondary' },
      { label: 'WhatsApp the Solar Desk', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'orange',
  },

  aquascanPro: {
    eyebrow: 'AquaScan Pro • Borehole & Water',
    headline: 'Audit-grade borehole, hydrogeology and water-quality intelligence for serious projects.',
    subtitle:
      'Real datasets from NASA POWER, ORNL DAAC, Open-Meteo and government sources — turned into bankable reports for boreholes, pumps, irrigation and rural water supply in Kenya.',
    whoFor: ['Drillers & hydrogeologists', 'NGOs & development agencies', 'Agribusiness & flower farms', 'County governments', 'Real estate & developers', 'Mining & industry'],
    pso: [
      { problem: 'Borehole proposals lack provenance and get rejected by donors.', solution: 'AquaScan Pro reports cite every dataset and include a Data Provenance appendix.', outcome: 'Proposals pass donor and lender due diligence.' },
      { problem: 'Pump sizing based on guesswork = burnt motors and dry runs.', solution: 'Real aquifer, drawdown and demand modelling, reviewed by engineers.', outcome: 'Right-sized pumps, longer asset life, lower opex.' },
      { problem: 'No single partner for survey, drilling, pumps and O&M.', solution: 'EmersonEIMS borehole desk handles the full chain.', outcome: 'One contract, one SLA, accountable delivery.' },
    ],
    trust: ['Sources cited on every figure', 'Data Provenance appendix in every PDF', 'Used by drillers & NGOs', 'Backed by EmersonEIMS field team'],
    ctas: [
      { label: 'Request a Borehole Report', href: '/contact?topic=borehole-report', variant: 'primary' },
      { label: 'Book a Hydrogeology Review', href: '/booking?service=hydrogeology', variant: 'secondary' },
      { label: 'WhatsApp the Water Desk', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'sky',
  },

  generatorOracle: {
    eyebrow: 'Generator Oracle • AI Diagnostic',
    headline: 'AI-assisted generator diagnostics — backed by Kenya\'s 24/7 generator service desk.',
    subtitle:
      'Describe the symptom, get a structured root-cause path, then escalate to EmersonEIMS for on-site repair across Kenya. Trained on real Cummins, Voltka and multi-brand fault histories.',
    whoFor: ['Facility managers', 'Hospitals & critical sites', 'Banks & ATM networks', 'Telecom & data centres', 'Manufacturing', 'Hotels & service buildings'],
    pso: [
      { problem: 'Generator down at 02:00 and the supplier isn\'t picking up.', solution: 'Oracle isolates the likely cause; emergency desk dispatches an engineer.', outcome: 'Faster restoration, fewer wrong parts, less downtime cost.' },
      { problem: 'Engineers waste hours guessing fault codes.', solution: 'Structured fault-code path with brand-specific guidance.', outcome: 'Faster diagnosis, fewer parts swapped on guess.' },
      { problem: 'Recurring trips never properly closed out.', solution: 'Oracle logs symptoms; engineers do root-cause analysis on site.', outcome: 'Fault closed out, not reset and forgotten.' },
    ],
    trust: ['Cummins / Voltka authorised', '24/7 emergency response', 'Engineers across 47 counties', 'Documented job reports'],
    ctas: [
      { label: 'Call the Emergency Desk', href: TEL, variant: 'primary' },
      { label: 'WhatsApp an Engineer Now', href: WHATSAPP, variant: 'secondary' },
      { label: 'Request an SLA Contract', href: '/contact?topic=sla', variant: 'tertiary' },
    ],
    accent: 'amber',
  },

  eimsPro: {
    eyebrow: 'EIMS Pro • Engineering Console',
    headline: 'Pro engineering console for Kenya\'s power, solar and water professionals.',
    subtitle:
      'Sizing, diagnostics, ROI, BOQ and audit-grade PDF reports — all in one console used by EmersonEIMS engineers and partner EPCs.',
    whoFor: ['EPC & MEP contractors', 'Consulting engineers', 'Facility & energy managers', 'Drillers & hydrogeologists', 'Government & NGOs', 'Property managers'],
    pso: [
      { problem: 'Tools scattered across spreadsheets and vendor calculators.', solution: 'One console: power, solar, water, motors, ROI, reports.', outcome: 'Faster tenders, consistent numbers, fewer redesigns.' },
      { problem: 'No engineering escalation when the tool isn\'t enough.', solution: 'Direct line to the EmersonEIMS engineering desk.', outcome: 'Real engineers behind every recommendation.' },
      { problem: 'Reports lack provenance.', solution: 'Every figure cites its source; PDFs include Data Provenance appendix.', outcome: 'Reports survive lender and board review.' },
    ],
    trust: ['Used on live EPC tenders', 'Sources cited on every figure', 'Backed by Kenya engineering desk', 'Audit-grade PDF reports'],
    ctas: [
      { label: 'Request Pro Access', href: '/contact?topic=eims-pro', variant: 'primary' },
      { label: 'Book a Pro Walkthrough', href: '/booking?service=eims-pro', variant: 'secondary' },
      { label: 'WhatsApp the Pro Desk', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'indigo',
  },

  // ── Resource / Support pages ──────────────────────────────────────────
  resources: {
    eyebrow: 'Engineering Resources',
    headline: 'Engineering resources for Kenya\'s power, solar, generator and water professionals.',
    subtitle:
      'Guides, calculators, checklists and reference data — curated by the EmersonEIMS engineering team. Free to use, real engineers when you need to escalate.',
    whoFor: ['Facility managers', 'EPC & MEP contractors', 'Consulting engineers', 'Drillers & hydrogeologists', 'Property managers', 'Government & NGOs'],
    pso: [
      { problem: 'Engineering info scattered across PDFs and supplier sites.', solution: 'One curated resource library, organised by trade.', outcome: 'Faster answers, fewer mistakes on site.' },
      { problem: 'Generic guides ignore Kenya-specific conditions.', solution: 'Resources tuned to Kenyan grid, climate and regulations.', outcome: 'Designs that work in Kenya, not on paper only.' },
      { problem: 'No way to escalate from a guide to a real engineer.', solution: 'Every resource links to the EmersonEIMS engineering desk.', outcome: 'Real help when the guide isn\'t enough.' },
    ],
    trust: ['Curated by EmersonEIMS engineers', 'Updated for Kenyan conditions', 'Sources cited where relevant', 'Free escalation to engineering desk'],
    ctas: [
      { label: 'Talk to an Engineer', href: '/contact?topic=resources', variant: 'primary' },
      { label: 'Book a Site Audit', href: '/booking?service=site-audit', variant: 'secondary' },
      { label: 'WhatsApp the Engineering Desk', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'sky',
  },

  knowledgeBase: {
    eyebrow: 'Knowledge Base',
    headline: 'Searchable engineering knowledge base — power, solar, generators, motors, water.',
    subtitle:
      'Field-tested answers from the EmersonEIMS engineering team — for facility managers, EPC contractors and site engineers across Kenya.',
    whoFor: ['Facility managers', 'EPC & MEP contractors', 'Site engineers', 'Property managers', 'Government & NGOs'],
    pso: [
      { problem: 'Searching the web returns irrelevant or wrong answers.', solution: 'Curated, Kenya-specific knowledge base maintained by engineers.', outcome: 'Faster, more accurate answers.' },
      { problem: 'Articles end with no clear next step.', solution: 'Every article links to a service, calculator or engineer.', outcome: 'From question to action in one click.' },
      { problem: 'No way to verify what you read.', solution: 'Sources cited; engineering escalation available.', outcome: 'Defensible answers, not folklore.' },
    ],
    trust: ['Maintained by Kenya engineers', 'Sources cited where relevant', 'Direct escalation to engineering desk', 'Updated with field experience'],
    ctas: [
      { label: 'Ask an Engineer', href: '/contact?topic=knowledge-base', variant: 'primary' },
      { label: 'Book a Site Audit', href: '/booking?service=site-audit', variant: 'secondary' },
      { label: 'WhatsApp the Engineering Desk', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'sky',
  },

  technicalBible: {
    eyebrow: 'Technical Bible • Engineering Reference',
    headline: 'The EmersonEIMS Technical Bible — installation, repair, parts and standards in one reference.',
    subtitle:
      'Field-tested standards used by EmersonEIMS engineers on real Kenyan sites — generators, ATS, switchboards, solar, motors, HVAC, boreholes and more.',
    whoFor: ['EPC & MEP contractors', 'Consulting engineers', 'Facility managers', 'Site engineers', 'Property managers'],
    pso: [
      { problem: 'Each brand has its own manual; no single source of truth.', solution: 'Cross-brand reference with EmersonEIMS field corrections.', outcome: 'Consistent installs, fewer warranty disputes.' },
      { problem: 'Standards in PDFs are rarely read on site.', solution: 'Mobile-friendly, searchable bible with diagrams.', outcome: 'Standards actually applied on site.' },
      { problem: 'No way to escalate from reference to engineer.', solution: 'Every chapter links to the engineering desk for site help.', outcome: 'Real engineers on call when the bible isn\'t enough.' },
    ],
    trust: ['Field-tested standards', 'Cross-brand corrections', 'Used by EmersonEIMS engineers', 'Engineering desk escalation'],
    ctas: [
      { label: 'Request a Site Engineer', href: '/contact?topic=technical-bible', variant: 'primary' },
      { label: 'Book a Compliance Audit', href: '/booking?service=compliance-audit', variant: 'secondary' },
      { label: 'WhatsApp the Engineering Desk', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'indigo',
  },

  maintenanceHub: {
    eyebrow: 'Maintenance Hub • SLA-Backed PM',
    headline: 'Scheduled maintenance for generators, solar, motors, HVAC, boreholes and switchgear.',
    subtitle:
      'Single SLA-backed maintenance contract across all your assets — scheduled service, genuine parts, documented job reports, 24/7 emergency response across Kenya.',
    whoFor: ['Facility managers', 'Hospitals & critical sites', 'Banks & financial', 'Hotels & hospitality', 'Manufacturing', 'Property managers', 'Government & NGOs'],
    pso: [
      { problem: 'Reactive call-outs cost more than scheduled service.', solution: 'PM contract with scheduled service + parts + reports.', outcome: 'Fewer breakdowns, predictable spend.' },
      { problem: 'Multiple vendors, no single accountable partner.', solution: 'One contract covers all your power assets.', outcome: 'Simpler management, faster response, clear accountability.' },
      { problem: 'No service history for audits / warranty.', solution: 'Documented job reports stored and shareable.', outcome: 'Audit-ready records, defensible warranty claims.' },
    ],
    trust: ['SLA-backed response times', 'Genuine parts only', '24/7 emergency response', 'Documented job reports'],
    ctas: [
      { label: 'Request a PM Contract', href: '/contact?topic=pm-contract', variant: 'primary' },
      { label: 'Book a Free Site Audit', href: '/booking?service=site-audit', variant: 'secondary' },
      { label: 'WhatsApp Maintenance Desk', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'emerald',
  },

  calculators: {
    eyebrow: 'Engineering Calculators',
    headline: 'Engineering calculators for power, solar, generator, motor, HVAC and water projects.',
    subtitle:
      'Free, defensible calculators used by EmersonEIMS engineers — every result cites its method and links to a real engineer for sign-off.',
    whoFor: ['EPC & MEP contractors', 'Facility managers', 'Consulting engineers', 'Property managers', 'Drillers & hydrogeologists', 'Government & NGOs'],
    pso: [
      { problem: 'Online calculators give different answers for the same input.', solution: 'Calculators built on cited engineering methods, reviewed by engineers.', outcome: 'Consistent, defensible numbers.' },
      { problem: 'Result lacks context or recommended next step.', solution: 'Every calculator links to a related service or engineer.', outcome: 'From number to decision in one click.' },
      { problem: 'No way to capture the calculation for a tender.', solution: 'PDF export with method, inputs and provenance.', outcome: 'Calculations that survive board and lender review.' },
    ],
    trust: ['Methods cited', 'Reviewed by engineers', 'PDF export with provenance', 'Free escalation to engineering desk'],
    ctas: [
      { label: 'Talk to an Engineer', href: '/contact?topic=calculators', variant: 'primary' },
      { label: 'Book a Sizing Review', href: '/booking?service=sizing-review', variant: 'secondary' },
      { label: 'WhatsApp the Engineering Desk', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'cyan',
  },

  faq: {
    eyebrow: 'Frequently Asked Questions',
    headline: 'Straight answers from the EmersonEIMS engineering desk.',
    subtitle:
      'Real questions from real Kenyan facility managers, EPCs and property owners — answered by the team that does the work.',
    whoFor: ['Facility managers', 'EPC & MEP contractors', 'Property managers', 'Hotels, hospitals, schools', 'Manufacturing & agribusiness', 'Government & NGOs'],
    pso: [
      { problem: 'Suppliers give vague or self-serving answers.', solution: 'Direct, specific answers from the engineering desk.', outcome: 'Faster, better-informed decisions.' },
      { problem: 'No way to verify the answer.', solution: 'Sources and standards cited where relevant.', outcome: 'Defensible answers for boards and tenders.' },
      { problem: 'No clear next step after reading.', solution: 'Every FAQ links to a service, calculator or engineer.', outcome: 'Question to action in one click.' },
    ],
    trust: ['Answered by Kenya engineers', 'Sources cited where relevant', 'Updated with field experience', 'Direct engineering desk escalation'],
    ctas: [
      { label: 'Ask an Engineer', href: '/contact?topic=faq', variant: 'primary' },
      { label: 'Book a Site Audit', href: '/booking?service=site-audit', variant: 'secondary' },
      { label: 'WhatsApp the Engineering Desk', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'cyan',
  },

  caseStudies: {
    eyebrow: 'Case Studies • Documented Outcomes',
    headline: 'Real EmersonEIMS projects — outcomes you can verify, not slogans.',
    subtitle:
      'Generators, solar, UPS, motors, boreholes and full electrical fitouts delivered for hospitals, hotels, factories, banks and government across Kenya.',
    whoFor: ['Facility managers', 'EPC & MEP contractors', 'Hospitals & hotels', 'Banks & financial', 'Manufacturing & agribusiness', 'Government & NGOs'],
    pso: [
      { problem: 'Vendors talk capability; you need proof.', solution: 'Documented project outcomes with references.', outcome: 'Confidence to award the next contract.' },
      { problem: 'Hard to find peer projects in your sector.', solution: 'Filterable by industry and project type.', outcome: 'Comparable references in minutes.' },
      { problem: 'No path from case study to proposal.', solution: 'Every case study links to the engineering desk.', outcome: 'From example to proposal in one step.' },
    ],
    trust: ['Verifiable client references', 'Documented project outcomes', 'Sectors across Kenya', 'Engineering desk follow-up'],
    ctas: [
      { label: 'Request a Similar Proposal', href: '/contact?topic=case-study', variant: 'primary' },
      { label: 'Book a Discovery Call', href: '/booking?service=discovery', variant: 'secondary' },
      { label: 'WhatsApp the Sales Desk', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'emerald',
  },

  brands: {
    eyebrow: 'Authorised Brands',
    headline: 'Authorised partner for the brands serious Kenyan sites trust.',
    subtitle:
      'Cummins, Voltka and other tier-one OEMs — supplied, installed and maintained by EmersonEIMS with genuine parts and factory-trained engineers.',
    whoFor: ['Facility managers', 'EPC & MEP contractors', 'Hospitals & critical sites', 'Manufacturing & agribusiness', 'Banks & financial', 'Government & NGOs'],
    pso: [
      { problem: 'Grey-market kit voids warranty and fails inspection.', solution: 'Authorised supply with genuine parts and warranty.', outcome: 'Defensible warranty, longer asset life.' },
      { problem: 'Multi-brand sites need one accountable partner.', solution: 'EmersonEIMS service desk covers all listed brands.', outcome: 'One contract, one SLA, one escalation path.' },
      { problem: 'No clear way to compare brand options.', solution: 'Brand-by-brand engineering guidance from the team.', outcome: 'Right brand for the application, not the spreadsheet.' },
    ],
    trust: ['Authorised dealer (Cummins / Voltka)', 'Genuine parts only', 'Factory-trained engineers', 'Multi-brand service contracts'],
    ctas: [
      { label: 'Request a Brand Quote', href: '/contact?topic=brand-quote', variant: 'primary' },
      { label: 'Book a Site Audit', href: '/booking?service=site-audit', variant: 'secondary' },
      { label: 'WhatsApp the Sales Desk', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'amber',
  },

  blog: {
    eyebrow: 'EmersonEIMS Engineering Blog',
    headline: 'Field notes from Kenya\'s power, solar, generator and water engineers.',
    subtitle:
      'Real lessons from real sites — for facility managers, EPC contractors and decision-makers who need to make defensible engineering decisions.',
    whoFor: ['Facility managers', 'EPC & MEP contractors', 'Property managers', 'Hospitals, hotels, banks', 'Manufacturing & agribusiness', 'Government & NGOs'],
    pso: [
      { problem: 'Generic engineering blogs ignore Kenyan conditions.', solution: 'Articles grounded in Kenyan grid, climate and regulations.', outcome: 'Lessons that actually apply to your site.' },
      { problem: 'No path from article to action.', solution: 'Every post links to a service, tool or engineer.', outcome: 'From insight to decision in one click.' },
      { problem: 'Hard to verify claims in a blog.', solution: 'Sources and standards cited where relevant.', outcome: 'Defensible information, not opinion.' },
    ],
    trust: ['Written by Kenya engineers', 'Sources cited where relevant', 'Direct engineering escalation', 'Updated with field experience'],
    ctas: [
      { label: 'Talk to an Engineer', href: '/contact?topic=blog', variant: 'primary' },
      { label: 'Book a Site Audit', href: '/booking?service=site-audit', variant: 'secondary' },
      { label: 'WhatsApp the Engineering Desk', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'sky',
  },

  faults: {
    eyebrow: 'Fault Library • Diagnostics',
    headline: 'Generator, solar, UPS and motor fault library — with engineers on call.',
    subtitle:
      'Searchable fault codes, symptoms and root causes — backed by the EmersonEIMS 24/7 emergency desk for sites that cannot afford to stay down.',
    whoFor: ['Facility managers', 'Site engineers', 'Hospitals & critical sites', 'Banks & ATM networks', 'Telecom & data centres', 'Manufacturing'],
    pso: [
      { problem: 'Fault code on screen, no time to read the manual.', solution: 'Quick-search fault library with brand-specific causes.', outcome: 'Faster diagnosis, fewer wrong parts.' },
      { problem: 'Recurring faults reset and forgotten.', solution: 'Library + engineer-led root-cause investigation.', outcome: 'Faults closed out, not papered over.' },
      { problem: 'Suppliers slow to respond when it matters.', solution: 'EmersonEIMS 24/7 emergency desk + nationwide engineers.', outcome: 'Predictable, accountable response.' },
    ],
    trust: ['Brand-specific fault data', '24/7 emergency response', 'Engineers across 47 counties', 'Documented job reports'],
    ctas: [
      { label: 'Call the Emergency Desk', href: TEL, variant: 'primary' },
      { label: 'WhatsApp an Engineer Now', href: WHATSAPP, variant: 'secondary' },
      { label: 'Request an SLA Contract', href: '/contact?topic=sla', variant: 'tertiary' },
    ],
    accent: 'rose',
  },

  // ── Generator-related commercial pages ────────────────────────────────
  generatorMain: {
    eyebrow: 'Diesel Generators • Sales & Service',
    headline: 'Cummins & Voltka generators for Kenyan sites — sized, supplied, installed, serviced.',
    subtitle:
      'From 10 kVA shop standby to 2,000 kVA prime power: one accountable partner for sizing, ATS, fuel, controls and 24/7 SLA-backed maintenance.',
    whoFor: ['Hospitals & clinics', 'Manufacturing', 'Telecom & data centres', 'Banks & ATMs', 'Hotels & hospitality', 'Construction & remote sites'],
    pso: [
      { problem: 'Outages stop production, surgery, transactions and tenants.', solution: 'Right-sized genset + ATS + fuel + monitoring.', outcome: 'Documented uptime, lower downtime cost.' },
      { problem: 'Aging gensets trip on start-up loads.', solution: 'Independent load study and corrective works.', outcome: 'Stable voltage and frequency.' },
      { problem: 'Reactive call-outs cost more than scheduled service.', solution: 'EmersonEIMS SLA: scheduled service + parts + reports.', outcome: 'Fewer breakdowns, full audit history.' },
    ],
    trust: ['Authorised Cummins / Voltka dealer', '3-year warranty + 1 year free service', '24/7 emergency response', 'Genuine parts, factory-trained'],
    ctas: [
      { label: 'Request a Generator Quote', href: '/contact?topic=generator-quote', variant: 'primary' },
      { label: 'Book a Free Site Audit', href: '/booking?service=generator-audit', variant: 'secondary' },
      { label: 'WhatsApp an Engineer', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'amber',
  },

  generatorServices: {
    eyebrow: 'Generator Services • Install / Service / Repair',
    headline: 'End-to-end generator services — install, commission, service, repair, fuel, hire.',
    subtitle:
      'One service desk for everything that keeps a genset running — from commissioning a new install to repairing a 20-year-old standby unit, anywhere in Kenya.',
    whoFor: ['Facility managers', 'EPC & MEP contractors', 'Hospitals & critical sites', 'Manufacturing & agribusiness', 'Hotels & banks', 'Property managers'],
    pso: [
      { problem: 'Different vendors for install, service and repair.', solution: 'Single accountable partner across the genset lifecycle.', outcome: 'Faster response, no finger-pointing.' },
      { problem: 'Service quality varies between visits.', solution: 'Standardised job sheets and documented reports.', outcome: 'Consistent quality, audit-ready history.' },
      { problem: 'Repairs done without root-cause analysis.', solution: 'Engineer-led diagnosis with fault closeout.', outcome: 'Faults solved once, not patched repeatedly.' },
    ],
    trust: ['Multi-brand service capability', 'Authorised Cummins / Voltka', 'Documented job reports', '24/7 nationwide response'],
    ctas: [
      { label: 'Request a Service Visit', href: '/contact?topic=gen-service', variant: 'primary' },
      { label: 'Book a Free Site Audit', href: '/booking?service=generator-audit', variant: 'secondary' },
      { label: 'WhatsApp the Generator Desk', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'amber',
  },

  generatorProblems: {
    eyebrow: 'Generator Problems • Real Fixes',
    headline: 'Common generator problems — and the engineering fixes that actually work.',
    subtitle:
      'Field-tested fixes for the faults that take Kenyan gensets offline — written by the engineers who do the work, with escalation to the 24/7 emergency desk.',
    whoFor: ['Facility managers', 'Site engineers', 'Hospitals & critical sites', 'Banks & telecom', 'Manufacturing', 'Hotels & service buildings'],
    pso: [
      { problem: 'Genset won\'t start, won\'t take load, or trips repeatedly.', solution: 'Symptom-based diagnostic + engineer dispatch.', outcome: 'Faster restoration, fewer wrong parts.' },
      { problem: 'Fault diagnosed but never properly closed out.', solution: 'Root-cause investigation with corrective actions.', outcome: 'Faults closed, not reset and forgotten.' },
      { problem: 'No PM regime = same problems every quarter.', solution: 'EmersonEIMS PM contract + genuine parts.', outcome: 'Fewer breakdowns, longer asset life.' },
    ],
    trust: ['Multi-brand fault diagnosis', 'Authorised Cummins / Voltka', '24/7 emergency response', 'Documented job reports'],
    ctas: [
      { label: 'Call the Emergency Desk', href: TEL, variant: 'primary' },
      { label: 'WhatsApp an Engineer Now', href: WHATSAPP, variant: 'secondary' },
      { label: 'Request a PM Contract', href: '/contact?topic=pm-contract', variant: 'tertiary' },
    ],
    accent: 'rose',
  },

  generatorParts: {
    eyebrow: 'Generator Parts • Genuine OEM',
    headline: 'Genuine generator parts — Cummins, Voltka and multi-brand consumables.',
    subtitle:
      'Filters, belts, sensors, AVRs, controllers, alternators and major components — supplied with documentation, fitted by EmersonEIMS engineers if you need it.',
    whoFor: ['Facility managers', 'In-house maintenance teams', 'EPC & MEP contractors', 'Hospitals & critical sites', 'Telecom & data centres', 'Manufacturing'],
    pso: [
      { problem: 'Counterfeit parts fail early and void warranty.', solution: 'Genuine OEM parts with traceable documentation.', outcome: 'Defensible warranty, longer asset life.' },
      { problem: 'Wrong part ordered = downtime extended.', solution: 'Engineer verifies fitment before despatch.', outcome: 'Right part first time, fewer return trips.' },
      { problem: 'Need parts urgently, after hours.', solution: 'EmersonEIMS 24/7 parts + dispatch desk.', outcome: 'Faster restoration of critical assets.' },
    ],
    trust: ['Authorised Cummins / Voltka parts', 'Traceable parts documentation', 'Engineer fitment available', '24/7 dispatch on critical parts'],
    ctas: [
      { label: 'Request a Parts Quote', href: '/contact?topic=gen-parts', variant: 'primary' },
      { label: 'WhatsApp the Parts Desk', href: WHATSAPP, variant: 'secondary' },
      { label: 'Book Engineer Fitment', href: '/booking?service=parts-fitment', variant: 'tertiary' },
    ],
    accent: 'amber',
  },

  // ── Other commercial pages ────────────────────────────────────────────
  fabricationMain: {
    eyebrow: 'Steel Fabrication & Site Works',
    headline: 'Heavy-duty steel fabrication — generator canopies, tanks, frames, walkways and site works.',
    subtitle:
      'In-house fabrication for the steelwork that keeps power, water and process plants reliable: canopies, fuel tanks, equipment frames, access platforms and protective enclosures.',
    whoFor: ['Facility managers', 'EPC & MEP contractors', 'Hospitals, hotels & banks', 'Manufacturing & agribusiness', 'Construction sites', 'Government & NGOs'],
    pso: [
      { problem: 'Off-the-shelf canopies and frames don\'t fit your site.', solution: 'Custom fabrication to your drawings and site survey.', outcome: 'Right-fit steelwork, faster install.' },
      { problem: 'Multiple suppliers for fabrication and install.', solution: 'EmersonEIMS designs, fabricates, transports, installs.', outcome: 'One contract, one accountable partner.' },
      { problem: 'Welds and finishes fail inspection.', solution: 'Coded welders, documented procedures, quality reports.', outcome: 'Inspection-ready, audit-defensible work.' },
    ],
    trust: ['Coded welders, documented procedures', 'In-house design & fabrication', 'Transport & site install included', 'Quality reports on every job'],
    ctas: [
      { label: 'Request a Fabrication Quote', href: '/contact?topic=fabrication', variant: 'primary' },
      { label: 'Book a Site Survey', href: '/booking?service=fabrication-survey', variant: 'secondary' },
      { label: 'WhatsApp the Fabrication Desk', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'orange',
  },

  mepClash: {
    eyebrow: 'MEP Clash & Coordination',
    headline: 'MEP clash detection and coordination for buildings that need to actually work.',
    subtitle:
      'Independent MEP review for developers, EPCs and consulting engineers — find clashes, fix them on paper, not in concrete.',
    whoFor: ['Developers & owners', 'EPC & MEP contractors', 'Consulting engineers', 'Architects', 'Facility managers'],
    pso: [
      { problem: 'Clashes found on site cost weeks and millions.', solution: 'Independent clash review before mobilisation.', outcome: 'Fewer change-orders, faster handover.' },
      { problem: 'Disciplines design in isolation.', solution: 'Cross-discipline coordination workshops + reports.', outcome: 'Single coordinated build set.' },
      { problem: 'Owner has no independent voice in design review.', solution: 'EmersonEIMS represents the owner\'s technical interests.', outcome: 'Buildings that operate, not just buildings that complete.' },
    ],
    trust: ['Independent of contractor & supplier', 'Cross-discipline review', 'Documented coordination reports', 'Owner-side technical advocacy'],
    ctas: [
      { label: 'Request a Clash Review', href: '/contact?topic=mep-clash', variant: 'primary' },
      { label: 'Book a Coordination Workshop', href: '/booking?service=mep-coord', variant: 'secondary' },
      { label: 'WhatsApp the MEP Desk', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'indigo',
  },

  healthcare: {
    eyebrow: 'Healthcare Power & Compliance',
    headline: 'Hospital-grade power, ATS, UPS and isolation — engineered for compliance and uptime.',
    subtitle:
      'Generators, UPS, isolated power systems and SLA-backed maintenance for Kenyan hospitals, clinics and labs that cannot afford a single second of downtime.',
    whoFor: ['Hospitals & clinics', 'Diagnostic labs', 'Pharma & cold-chain', 'Ministry of Health & county facilities', 'NGO healthcare projects'],
    pso: [
      { problem: 'ICU / theatre downtime risks lives and licences.', solution: 'Healthcare-grade gensets, ATS, UPS, isolation panels.', outcome: 'Documented uptime, audit-ready compliance.' },
      { problem: 'Cold-chain fails when generator doesn\'t pick up.', solution: 'Engineered ATS + monitored standby + remote alerts.', outcome: 'Vaccines and samples protected.' },
      { problem: 'Multiple vendors complicate inspections.', solution: 'One SLA across all your power assets.', outcome: 'Simpler audits, one accountable partner.' },
    ],
    trust: ['Healthcare-grade installations', 'Audit-ready documentation', '24/7 emergency response', 'SLA-backed maintenance'],
    ctas: [
      { label: 'Request a Hospital Power Audit', href: '/contact?topic=healthcare-audit', variant: 'primary' },
      { label: 'Book a Compliance Site Visit', href: '/booking?service=hospital-audit', variant: 'secondary' },
      { label: 'WhatsApp the Healthcare Desk', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'rose',
  },

  highRise: {
    eyebrow: 'High-Rise & Commercial Buildings',
    headline: 'High-rise power, vertical transport readiness, fire-life-safety and tenant uptime.',
    subtitle:
      'Generators, ATS, UPS, switchgear and SLA-backed maintenance for towers, malls, mixed-use and Grade A office buildings across Kenya.',
    whoFor: ['Developers & owners', 'Property managers', 'Facility managers', 'Mall & office operators', 'Mixed-use developments'],
    pso: [
      { problem: 'Tenant outages = lease penalties and reputation hits.', solution: 'Right-sized standby + ATS + monitored maintenance.', outcome: 'Lease-compliant uptime, lower churn.' },
      { problem: 'Fire pumps and lifts must run on standby.', solution: 'Engineered standby strategy with documented test regime.', outcome: 'Code-compliant, insurer-defensible.' },
      { problem: 'Multiple service vendors across the stack.', solution: 'One SLA covering generator, UPS, switchgear, HVAC.', outcome: 'Simpler operations, faster response.' },
    ],
    trust: ['High-rise project experience', 'Code-compliant test regimes', 'SLA-backed maintenance', '24/7 nationwide response'],
    ctas: [
      { label: 'Request a Building Power Audit', href: '/contact?topic=highrise-audit', variant: 'primary' },
      { label: 'Book a Property Walk-Through', href: '/booking?service=building-walkthrough', variant: 'secondary' },
      { label: 'WhatsApp the Buildings Desk', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'sky',
  },

  interior: {
    eyebrow: 'Interior Fitout • Electrical & MEP',
    headline: 'Interior electrical, lighting and small-power fitout — done by engineers, not handymen.',
    subtitle:
      'Coordinated interior electrical, lighting, data and small-power for offices, retail, clinics and hospitality — with documented testing and inspection-ready handover.',
    whoFor: ['Developers & owners', 'Interior designers & architects', 'Retail & hospitality operators', 'Clinics & offices', 'Property managers'],
    pso: [
      { problem: 'Handyman wiring fails inspection and risks fire.', solution: 'Licensed electricians + documented test certificates.', outcome: 'Inspection-ready, insurer-defensible.' },
      { problem: 'Lighting and small-power don\'t match the design intent.', solution: 'Coordinated layout with designer + engineer.', outcome: 'Fitouts that look and work as designed.' },
      { problem: 'No after-care when things break.', solution: 'EmersonEIMS service desk for snagging and PM.', outcome: 'Issues fixed fast, tenants stay happy.' },
    ],
    trust: ['Licensed electricians', 'Documented test certificates', 'Designer-engineer coordination', 'After-care service desk'],
    ctas: [
      { label: 'Request a Fitout Quote', href: '/contact?topic=interior-fitout', variant: 'primary' },
      { label: 'Book a Design Review', href: '/booking?service=fitout-review', variant: 'secondary' },
      { label: 'WhatsApp the Fitout Desk', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'violet',
  },

  innovations: {
    eyebrow: 'EmersonEIMS Innovations',
    headline: 'Engineering innovations for Kenyan power, solar and water — built on the field, not the slide deck.',
    subtitle:
      'AI tools, monitoring, hybrid systems and field-tested integrations — developed by EmersonEIMS engineers to solve real Kenyan site problems.',
    whoFor: ['EPC & MEP contractors', 'Facility & energy managers', 'Hospitals & data centres', 'Manufacturing & agribusiness', 'Government & NGOs', 'Investors & developers'],
    pso: [
      { problem: 'Vendor "innovation" rarely survives Kenyan site conditions.', solution: 'Innovations built and tested by Kenya engineers.', outcome: 'Solutions that work in the field, not just the demo.' },
      { problem: 'No accountable partner for new-tech rollout.', solution: 'EmersonEIMS designs, deploys and supports the stack.', outcome: 'Single SLA across the innovation lifecycle.' },
      { problem: 'No path from pilot to production.', solution: 'Engineer-led pilot + scale plan + support.', outcome: 'Pilots that scale, not pilots that die.' },
    ],
    trust: ['Field-tested in Kenya', 'Engineer-led design', 'SLA-backed support', 'Pilot-to-scale capability'],
    ctas: [
      { label: 'Talk About a Pilot', href: '/contact?topic=innovations', variant: 'primary' },
      { label: 'Book an Innovation Workshop', href: '/booking?service=innovations', variant: 'secondary' },
      { label: 'WhatsApp the Innovations Desk', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'violet',
  },

  // ── Generic conversion pages ──────────────────────────────────────────
  contact: {
    eyebrow: 'Contact EmersonEIMS',
    headline: 'Talk to a real engineer — Kenya, 24/7.',
    subtitle:
      'For sales, service, emergency response or technical advice. Real engineers, real response times, all 47 counties.',
    whoFor: ['Facility managers', 'EPC & MEP contractors', 'Hospitals & critical sites', 'Hotels, banks, manufacturing', 'Property managers', 'Government & NGOs'],
    pso: [
      { problem: 'Suppliers don\'t pick up when it matters.', solution: 'EmersonEIMS engineering desk + 24/7 emergency line.', outcome: 'Predictable, accountable response.' },
      { problem: 'No clear path to the right person.', solution: 'Topic-routed contact with engineer follow-up.', outcome: 'Right specialist on the first call.' },
      { problem: 'Need it in writing for procurement.', solution: 'Documented quotes, proposals and SLAs.', outcome: 'Procurement-ready paperwork.' },
    ],
    trust: ['24/7 emergency desk', 'Engineers across 47 counties', 'Documented quotes & SLAs', 'Single accountable partner'],
    ctas: [
      { label: 'Call Now', href: TEL, variant: 'primary' },
      { label: 'WhatsApp the Desk', href: WHATSAPP, variant: 'secondary' },
      { label: 'Book a Site Visit', href: '/booking?service=site-visit', variant: 'tertiary' },
    ],
    accent: 'cyan',
  },

  booking: {
    eyebrow: 'Book a Site Audit or Service Visit',
    headline: 'Book a free site audit or scheduled service visit with EmersonEIMS.',
    subtitle:
      'Pick a service, pick a slot — and an engineer will be on site to assess, quote or service. Nationwide coverage, documented reports, no obligation.',
    whoFor: ['Facility managers', 'Property managers', 'EPC & MEP contractors', 'Hospitals & critical sites', 'Hotels & manufacturing', 'Government & NGOs'],
    pso: [
      { problem: 'Hard to book a real engineer site visit.', solution: 'Online booking + topic routing + confirmation call.', outcome: 'Confirmed engineer visit, on schedule.' },
      { problem: 'Site visits don\'t produce useful documents.', solution: 'Documented site report + scoped recommendations.', outcome: 'Action-ready report after every visit.' },
      { problem: 'No follow-through after the visit.', solution: 'Engineering desk owns follow-up to quote / works.', outcome: 'Decisions taken, works executed.' },
    ],
    trust: ['Engineer-led site visits', 'Documented site reports', 'Nationwide coverage', 'No-obligation audits'],
    ctas: [
      { label: 'Book a Free Site Audit', href: '/booking?service=site-audit', variant: 'primary' },
      { label: 'Book a Service Visit', href: '/booking?service=service-visit', variant: 'secondary' },
      { label: 'WhatsApp the Booking Desk', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'emerald',
  },

  aboutUs: {
    eyebrow: 'About EmersonEIMS',
    headline: 'Kenya\'s accountable engineering partner for power, solar, generators and water.',
    subtitle:
      'A field-led engineering company serving hospitals, hotels, manufacturing, banks, agribusiness, government and NGOs — with documented work, genuine parts and 24/7 nationwide response.',
    whoFor: ['Facility managers', 'EPC & MEP contractors', 'Hospitals, hotels, banks', 'Manufacturing & agribusiness', 'Government & NGOs', 'Property managers'],
    pso: [
      { problem: 'Vendors talk; few are accountable.', solution: 'EmersonEIMS publishes documented work and SLAs.', outcome: 'Accountable engineering, not slogans.' },
      { problem: 'Multi-site clients want one partner.', solution: 'Engineers in all 47 counties, single contract.', outcome: 'Simpler operations, predictable cost.' },
      { problem: 'No engineering depth behind the sales pitch.', solution: 'Field-led team, calculators, Technical Bible, AI tools.', outcome: 'Real engineering, not just sales.' },
    ],
    trust: ['Engineers in all 47 counties', 'Authorised Cummins / Voltka', 'Documented project history', '24/7 emergency response'],
    ctas: [
      { label: 'Talk to an Engineer', href: '/contact?topic=about', variant: 'primary' },
      { label: 'Book a Discovery Call', href: '/booking?service=discovery', variant: 'secondary' },
      { label: 'WhatsApp the Sales Desk', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'cyan',
  },

  industryDetail: {
    eyebrow: 'Industry Solutions • B2B Power',
    headline: 'Sector-specific power, solar and uptime engineering — for Kenya\'s industries.',
    subtitle:
      'Tailored generators, solar, UPS, motors, water and SLA-backed maintenance for your sector — engineered, installed, documented and supported by EmersonEIMS.',
    whoFor: ['Sector facility managers', 'Multi-site operators', 'EPC & MEP contractors', 'Owners & developers', 'Government & NGOs'],
    pso: [
      { problem: 'Generic solutions don\'t fit your sector.', solution: 'Sector-specific sizing, controls and reporting.', outcome: 'Right-fit systems, sector references.' },
      { problem: 'Outages risk revenue, lives, compliance or production.', solution: 'Engineered standby + monitored maintenance.', outcome: 'Documented uptime, audit-ready compliance.' },
      { problem: 'No single partner across multi-site portfolios.', solution: 'One contract, one SLA, nationwide coverage.', outcome: 'Simpler ops, predictable spend.' },
    ],
    trust: ['Sector references on request', 'SLA-backed maintenance', 'Engineers in all 47 counties', '24/7 emergency response'],
    ctas: [
      { label: 'Request a Sector Proposal', href: '/contact?topic=industry-proposal', variant: 'primary' },
      { label: 'Book a Site Audit', href: '/booking?service=industry-audit', variant: 'secondary' },
      { label: 'WhatsApp the Industry Desk', href: WHATSAPP, variant: 'tertiary' },
    ],
    accent: 'cyan',
  },
} as const;

export type B2BProfileKey = keyof typeof B2B_PROFILES;
