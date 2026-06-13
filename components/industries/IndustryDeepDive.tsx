// ═══════════════════════════════════════════════════════════════════════════════
// IndustryDeepDive — PER-SLUG unique, server-rendered reference content for each
// /industries/[industry] page. Every industry gets genuinely different engineering
// content (no shared boilerplate) so there is no duplicate-content penalty across the
// generated pages. Renders nothing if a slug has no entry yet.
// ═══════════════════════════════════════════════════════════════════════════════

import {
  DeepDiveSection,
  DeepDiveBlock,
  SpecTable,
  Callout,
} from '@/components/content/EngineeringDeepDive';

interface Block { heading: string; paras: string[]; }
interface IndustryDeep {
  title: string;
  intro: string;
  blocks: Block[];
  table?: { caption: string; headers: string[]; rows: (string | number)[][] };
  callout: string;
}

const PHONE = '+254 768 860 665';

const DEEP: Record<string, IndustryDeep> = {
  'hotels-hospitality': {
    title: 'Power Engineering for Hotels & Hospitality',
    intro: 'In hospitality the brief is unusual: the power system must be invisible. A guest should never hear the generator, never see a light flicker at check-in, and never find a cold shower or a dead lift. That makes hospitality as much an acoustic and transfer-quality problem as a capacity one.',
    blocks: [
      {
        heading: 'Seamless changeover and the guest experience',
        paras: [
          'A standard open-transition transfer leaves a brief dead gap when the grid fails. In a factory that is nothing; in a hotel lobby, restaurant or conference hall it is darkness and a reset of every card machine and AV system. The answer is a UPS bridging the critical lighting, reception and AV loads for the few seconds the generator takes to start and accept load, with an automatic transfer switch tuned for the fastest safe changeover.',
          'For four- and five-star properties we design the changeover so that front-of-house never perceives the event at all — the genset is running and carrying the load before anyone looks up. Lifts, kitchen refrigeration, water pumping and the booking/PMS servers are treated as critical and prioritised in the load-shedding logic.',
        ],
      },
      {
        heading: 'Silence is a specification',
        paras: [
          'A hotel generator is rated not just in kVA but in dB(A) at the boundary. Sound-attenuated canopies, residential-grade silencers, anti-vibration mounting and careful siting (away from guest rooms and pool decks) bring a set down to a level guests will not notice. We specify the acoustic target alongside the electrical one, because a powerful set that wakes the top-floor suites has failed at its real job.',
          'Coastal resorts add a second constraint: salt-laden air corrodes enclosures and radiators quickly, so we specify marine-grade protection and a maintenance regime that keeps cooling and corrosion in check at Diani, Kilifi and Mombasa properties.',
        ],
      },
    ],
    table: {
      caption: 'Hospitality load priorities for transfer & shedding',
      headers: ['Load', 'Priority', 'Treatment'],
      rows: [
        ['Reception / PMS servers / AV', 'Critical', 'UPS + genset, zero perceived gap'],
        ['Lifts, kitchen cold storage', 'Critical', 'Auto-start genset, fast transfer'],
        ['Guest-room AC / lighting', 'Essential', 'Genset, staged restoration'],
        ['Pool, landscape, signage', 'Deferrable', 'Shed first under load limit'],
      ],
    },
    callout: 'Building or refurbishing a hotel? We will design a silent, seamless power system sized for full occupancy and acoustically tuned to your site.',
  },

  'hospitals-healthcare': {
    title: 'Power Engineering for Hospitals & Healthcare',
    intro: 'Healthcare is the one sector where a power gap is a clinical risk, not an inconvenience. The engineering follows medical electrical practice (HTM 06-01 and its equivalents): the load is split into essential and critical branches, and the critical branch must never see darkness.',
    blocks: [
      {
        heading: 'The critical branch and millisecond transfer',
        paras: [
          'Theatres, ICU, neonatal units and life-support equipment sit on the critical branch, which demands a transfer measured in milliseconds — far faster than any generator can start. That is bridged by an online double-conversion UPS that carries the critical load with zero transfer time while the generator starts and takes the essential branch behind it. The two are engineered together so the handover is bumpless.',
          'Operating theatres often add a further layer — an isolated power supply (IT system) with line-isolation monitoring — so that a single earth fault does not cut power or create a hazard mid-procedure. This is specialised work where the documentation and testing matter as much as the equipment.',
        ],
      },
      {
        heading: 'Waste, water and the whole-site view',
        paras: [
          'Hospitals are also where our incineration and water capability matters: compliant dual-chamber medical-waste incineration to NEMA limits, and reliable borehole and pressurisation pumping for theatres, laundry and sanitation. We see the hospital as one connected system — power, water and waste — because a failure in any of them stops clinical work.',
          'Compliance is part of the deliverable: load schedules, test certificates and maintenance logs that satisfy the Ministry of Health and your accreditation auditors, not just equipment that happens to work.',
        ],
      },
    ],
    table: {
      caption: 'Healthcare branch classification (HTM-style)',
      headers: ['Branch', 'Examples', 'Transfer requirement'],
      rows: [
        ['Critical', 'Theatres, ICU, life support', 'Online UPS — 0 ms'],
        ['Essential', 'Wards, imaging, pharmacy cold chain', 'Genset auto-start, fast ATS'],
        ['Non-essential', 'Admin, general lighting', 'Genset, may be shed'],
      ],
    },
    callout: 'We design hospital power to medical electrical practice — critical-branch UPS, essential-branch generation, isolated theatre supplies, plus incineration and water. Talk to our engineers before your next build or upgrade.',
  },

  'schools-universities': {
    title: 'Power Engineering for Schools & Universities',
    intro: 'Education buys reliability on a budget and a calendar. Power must hold through exams, protect lab and IT investment, and keep boarding facilities safe — all while respecting fee-collection cycles and bursar approval.',
    blocks: [
      {
        heading: 'Continuity where it counts: exams, labs and IT',
        paras: [
          'A blackout during a national exam, a practical assessment or an online class is more than inconvenient — it disrupts the academic record. We prioritise examination halls, computer labs, science labs and the school server/network on the backed-up supply, with a UPS protecting the IT and a generator carrying the wider load.',
          'Boarding schools add safety-critical loads: dormitory lighting, water pumping, kitchen refrigeration and security systems must stay live overnight. These are designed as essential loads with automatic restoration, so a night-time outage never leaves students in the dark.',
        ],
      },
      {
        heading: 'Solar that matches the school day and the budget',
        paras: [
          'Schools have an ideal solar profile — heavy daytime use, large unshaded roofs, and long holidays where surplus generation can offset other costs. A solar-plus-generator design cuts the diesel and grid bill substantially, and the savings can be structured to align with termly fee cycles. We also offer phased and payment-plan approaches so the bursary can budget realistically.',
          'For universities and larger campuses, the same engineering scales up: metered sub-distribution per building, load studies that account for lab equipment, and an SLA that keeps the estate running across many buildings under one contract.',
        ],
      },
    ],
    callout: 'From a single ICT lab to a full campus, we design school power for exam-day reliability and a budget that fits the fee calendar. Ask about solar and payment-plan options.',
  },

  'banks-financial': {
    title: 'Power Engineering for Banks & Financial Services',
    intro: 'Banking runs on continuity and clean power. A branch that cannot transact, an ATM that goes dark, or a data centre that drops a beat is lost revenue and a regulatory and reputational risk. The engineering targets the highest availability tiers.',
    blocks: [
      {
        heading: 'Redundancy to four-and-five nines',
        paras: [
          'Core systems and data centres are designed to N+1 or 2N redundancy: dual-corded equipment fed from independent UPS systems, generators that synchronise and carry the load indefinitely, and transfer schemes with maintenance bypass so nothing has a single point of failure. The target is 99.99% availability or better — under an hour of risk a year — which is a deliberate architectural choice, not an accident.',
          'Branch networks need a consistent, repeatable standard across dozens of sites: the same UPS-and-generator design, the same monitoring, the same SLA, so head office can see the power health of every branch from one screen and a flat battery is flagged before it becomes a closed branch.',
        ],
      },
      {
        heading: 'Clean power and documented compliance',
        paras: [
          'Financial IT is sensitive to power quality, so the design conditions the supply (online UPS, surge protection, proper earthing) and keeps harmonic distortion within IEEE limits. Just as important is the evidence: CBK-aligned reliability documentation, test certificates and service records that satisfy auditors and risk committees.',
          'We design the bank’s power as a fleet — standardised, monitored, documented and maintained under one SLA — because in financial services consistency across sites is itself a form of resilience.',
        ],
      },
    ],
    table: {
      caption: 'Availability targets for financial facilities',
      headers: ['Facility', 'Target', 'Architecture'],
      rows: [
        ['Core data centre', '99.99%+', '2N UPS + synchronised gensets'],
        ['Regional hub', '99.99%', 'N+1 UPS + genset + ATS'],
        ['Branch / ATM', '99.9%', 'Online UPS + genset, monitored'],
      ],
    },
    callout: 'We standardise bank power across your branch and data-centre estate — redundant, monitored, documented to CBK expectations, under one SLA. Let’s scope it.',
  },

  'manufacturing-industries': {
    title: 'Power Engineering for Manufacturing & Industry',
    intro: 'On the factory floor the challenge is brute load and clean control at the same time: heavy motor starts that dictate generator size, processes that cannot tolerate a glitch, and increasingly non-linear loads (VFDs, induction) that distort the supply if you let them.',
    blocks: [
      {
        heading: 'Sizing for the worst motor start, not the average load',
        paras: [
          'A direct-on-line motor pulls six to eight times its full-load current on starting, and on most factories it is that worst-case start — while the rest of the plant is already running — that sets the generator and alternator size, not the steady running load. We base the sizing on starting kVA, and where it pays, we cut the requirement with soft starters or VFDs rather than buying a bigger set.',
          'Process continuity then dictates the transfer scheme: a momentary dip that trips a PLC or ruins a batch is a real cost, so critical control systems sit on a UPS while the generator carries the motive load. We size against a measured load profile, because nameplate sums grossly over- or under-state what a real plant draws.',
        ],
      },
      {
        heading: 'Power quality, harmonics and energy cost',
        paras: [
          'A plant full of VFDs and rectifiers injects harmonics that overheat transformers and trip drives, so we manage total harmonic distortion (detuned power-factor correction, filters where needed) to stay within IEEE 519 and remove the KPLC reactive penalty. Correcting power factor alone often frees real transformer and cable capacity for expansion.',
          'For energy-intensive plants we also model solar and, where the load is steady, the economics of running generation closer to base load — turning the power system from a pure cost into a managed one with documented savings.',
        ],
      },
    ],
    callout: 'Send us your single-line diagram and your largest motors and we will size generation for the real starting load, manage your power quality, and model the energy savings. Call ' + PHONE + '.',
  },

  'flower-farms': {
    title: 'Power Engineering for Flower Farms & Agribusiness',
    intro: 'For an export farm, power is the cold chain and the irrigation — and both are unforgiving. A few hours without refrigeration downgrades a consignment; a failed pump at the wrong time stresses a crop. Kenya’s flower belt also sits at altitude, which quietly derates every generator delivered to it.',
    blocks: [
      {
        heading: 'Protecting the cold chain and the harvest',
        paras: [
          'Cold rooms and pack-house refrigeration are the priority load: they must restore fast and automatically after any outage, because the value sits in maintaining temperature continuously from cut to export. We design for rapid, automatic restart of refrigeration and prioritise it in the transfer logic, with monitoring that alerts before a temperature excursion becomes spoilage.',
          'Irrigation and borehole pumps are the other critical load. Sized and protected correctly (with the dry-run and duty-point discipline boreholes demand), and increasingly run on solar, they keep the crop watered without a punishing diesel bill.',
        ],
      },
      {
        heading: 'Altitude derating and the solar opportunity',
        paras: [
          'Naivasha, Nakuru and the Mt Kenya farms sit well above 1,500 m, so a generator rated at sea level delivers several percent less here — we size against the site-corrected rating so the set genuinely covers the cold rooms and pumps on a hot afternoon. This is exactly the altitude derate most suppliers ignore.',
          'Farms also have an excellent solar profile: large unshaded land, heavy daytime pumping and refrigeration, and high grid/diesel costs. A solar-hybrid design carries the daytime load cheaply and leaves the generator as true backup, often cutting energy costs dramatically while improving resilience.',
        ],
      },
    ],
    callout: 'We protect the cold chain and irrigation with correctly-derated generation, well-matched pumps and a solar hybrid that cuts the diesel bill. Talk to us about your farm.',
  },

  'real-estate-construction': {
    title: 'Power Engineering for Real Estate & Construction',
    intro: 'A development needs power in two phases that are usually treated as unrelated but should be planned together: temporary, robust power on the construction site, then permanent, distributed standby power for the finished estate, mall or tower. We engineer both — and the transition between them.',
    blocks: [
      {
        heading: 'From site rental to permanent standby',
        paras: [
          'During construction the priority is rugged, flexible power for tower cranes, hoists, mixers and welding — often best met with rental generation sized for the heavy, intermittent motor loads of a building site, with the ability to scale as the project grows. We supply and support that phase, then design the permanent installation so the developer is not buying power twice.',
          'For the completed asset, the permanent standby system covers common-area loads that residents and tenants depend on: lifts, water pressurisation and boosting, common lighting, security, fire systems and basement ventilation. These are the loads whose failure makes a building uninhabitable, so they sit on automatic standby.',
        ],
      },
      {
        heading: 'Estate-wide distribution and metering',
        paras: [
          'A multi-block estate or high-rise needs proper distribution design: an HV intake and transformer where the load justifies it, metered sub-distribution per block or tenancy, and a standby scheme that carries the right loads without over-building. Done well, it keeps service charges predictable and the development marketable.',
          'Our Greenheart Kilifi real-estate project is an example of this approach — estate-wide standby power engineered for the development’s distributed loads, not a single building.',
        ],
      },
    ],
    callout: 'Planning a development? We power the construction phase and engineer the permanent estate standby and distribution — one partner across the build. Call ' + PHONE + '.',
  },

  'churches-religious': {
    title: 'Power Engineering for Churches & Religious Organisations',
    intro: 'A place of worship has a distinctive load: large, occasional gatherings where audio, lighting and cooling must all work flawlessly for a few hours, on a budget funded by the congregation. The engineering is about right-sizing for the peak event without over-spending.',
    blocks: [
      {
        heading: 'Reliable power for services and events',
        paras: [
          'During a service the critical loads are the public-address and audio-visual system, lighting and (increasingly) air-conditioning for large halls. A power interruption mid-service is disruptive in a way few other settings are, so we prioritise the AV and lighting on a backed-up supply, with a generator sized for the gathering rather than the empty building.',
          'Because the peak load is occasional, we size carefully to avoid an oversized set that idles (and wet-stacks) most of the week — often a modest generator plus a UPS for the AV is the right, affordable answer.',
        ],
      },
      {
        heading: 'Affordable solar and phased solutions',
        paras: [
          'Many congregations are cost-sensitive, so we structure solutions in phases and offer solar where the roof and daytime use suit it — cutting running costs and, for off-grid or rural churches, providing primary power. Payment-friendly approaches let a building committee budget realistically.',
          'For larger ministries with multiple sites, we apply the same standardised, monitored, maintained approach we use for commercial estates, so every branch gets dependable power under one relationship.',
        ],
      },
    ],
    callout: 'We size church power for your services and your budget — generator, AV-protecting UPS, and affordable solar where it fits. Let’s find the right, affordable design.',
  },

  'government-ngos': {
    title: 'Power Engineering for Government & NGOs',
    intro: 'Public-sector and donor-funded work adds two requirements on top of good engineering: procurement compliance (AGPO, transparent documentation) and the reality that many facilities are remote, off-grid or in harsh environments where power must be self-sufficient.',
    blocks: [
      {
        heading: 'Remote and off-grid resilience',
        paras: [
          'County facilities, health posts, water schemes, camps and field offices are often far from a reliable grid, so the design leans on solar-plus-storage with a generator backup — a self-sufficient system that does not depend on fuel deliveries to a remote site for its day-to-day power. Solar borehole pumping is frequently the most cost-effective water solution for these locations.',
          'We design for the environment: dust in the north, humidity and salt at the coast, and the maintenance logistics of sites that are hard to reach — which makes remote monitoring and a planned spares strategy essential rather than optional.',
        ],
      },
      {
        heading: 'Compliance, documentation and accountability',
        paras: [
          'Public procurement demands AGPO-compliant vendors and a clean documentation trail: specifications, test certificates, as-built drawings and maintenance records that satisfy auditors and donors. We build that documentation in from the start, so the installation is not just functional but defensible.',
          'For multi-site programmes — a county rollout, an NGO’s field network — we standardise the design and maintain it under one SLA, giving the funder consistent, reportable performance across every site.',
        ],
      },
    ],
    callout: 'We deliver compliant, documented, off-grid-ready power for government and NGO facilities, with solar where it makes sense and an SLA across every site. Call ' + PHONE + '.',
  },
};

export default function IndustryDeepDive({ slug }: { slug: string }) {
  const d = DEEP[slug];
  if (!d) return null;
  return (
    <DeepDiveSection eyebrow="Engineering reference" title={d.title} intro={d.intro} accent="cyan" id="industry-engineering">
      {d.blocks.map((b, i) => (
        <DeepDiveBlock key={i} heading={b.heading} accent="cyan">
          {b.paras.map((p, j) => <p key={j}>{p}</p>)}
        </DeepDiveBlock>
      ))}
      {d.table && (
        <SpecTable caption={d.table.caption} headers={d.table.headers} rows={d.table.rows} accent="cyan" highlightCol={0} />
      )}
      <Callout title="Talk to our engineers" accent="cyan">{d.callout}</Callout>
    </DeepDiveSection>
  );
}
