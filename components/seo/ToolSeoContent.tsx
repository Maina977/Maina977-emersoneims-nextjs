/**
 * ToolSeoContent — server-rendered, crawlable content for the AI-tool routes.
 *
 * WHY (SEO audit 2026-07-16): every tool page is a client-side app ('use
 * client' + dynamic ssr:false), so Google indexes the URL and title but finds
 * almost no body text — the tools are indexed yet rank for nothing. Layouts
 * are SERVER components, so rendering this below {children} gives each tool
 * real crawlable copy + FAQPage structured data without touching the apps.
 * NEVER modify the tools themselves (standing rule).
 */
import Link from 'next/link';

interface ToolCopy {
  h2: string;
  intro: string;
  capabilities: string[];
  coverage: string;
  faqs: { q: string; a: string }[];
}

const TOOLS: Record<string, ToolCopy> = {
  'aquascan-pro-v3': {
    h2: 'AquaScan Pro — Borehole & Groundwater Survey Intelligence for Kenya and East Africa',
    intro:
      'AquaScan Pro is a free desktop pre-screen for anyone planning a borehole in Kenya. Add a site photo and coordinates and it combines public climate and soil data (NASA POWER, ERA5-Land, ISRIC SoilGrids), mapped water points (WPDx, OpenStreetMap, UNESCO IHP-WINS field records) and county drilling statistics into a first look at likely depth, yield and cost. It is a planning estimate, not a survey.',
    capabilities: [
      'Likelihood of success, a provisional depth and a planning yield, each given as a range with its data source',
      'Map and list of recorded boreholes and springs within 50 km, with names, depths and distances where the records have them',
      'Rainfall and recharge estimate, the water-quality risks to test for (against WHO guideline values) and a drilling cost range at July 2026 Kenyan rates',
      'Checklists for the next steps: the geophysical survey, the hydrogeologist’s report and the Water Resources Authority permit',
    ],
    coverage:
      'Works for any site in Kenya. Depth checks against real drilled boreholes are strongest in the northern counties (Turkana, Wajir, Garissa, Isiolo, Marsabit), where field records exist. It never replaces the statutory hydrogeological survey and a licensed hydrogeologist’s sign-off.',
    faqs: [
      { q: 'How much does a borehole survey cost in Kenya?', a: 'A statutory hydrogeological survey with targeted ERT typically costs KSh 40,000–110,000 depending on site access and reporting scope. AquaScan Pro produces the desktop pre-feasibility stage first, so you spend that survey money on a site that already screens well.' },
      { q: 'Can AquaScan Pro tell me exactly where and how deep to drill?', a: 'No desktop tool can — and any that claims to should worry you. AquaScan Pro gives a provisional investigation depth and target evidence, then requires field ERT/VES, a licensed hydrogeologist and WRA authorisation before any drilling instruction is issued.' },
      { q: 'What data does the report use?', a: 'NASA POWER and ERA5-Land climate data, ISRIC SoilGrids, SRTM terrain, mapped water points and compiled county drilling records. Every value carries its source and estimates are marked "(est.)". The full methodology is public at /aquascan-pro-v3/methodology.' },
    ],
  },
  'generator-oracle': {
    h2: 'Generator Oracle — Generator Fault Codes & Diagnosis',
    intro:
      'Generator Oracle is a free fault-code and diagnosis tool for diesel generators. Look up a controller alarm or J1939 engine code, or describe the symptoms, and it shows the likely causes, what to check and how to clear the alarm. The descriptions are written by our engineers; it is rule-based, not generative AI.',
    capabilities: [
      'Symptom-to-cause fault analysis for starting, fuel, cooling, AVR, alternator and control-panel problems',
      'Alarm lookup for DeepSea, ComAp, Woodward, SmartGen, CAT PowerWizard, Datakom, Lovato, Siemens and ENKO controllers, plus J1939 engine codes',
      'Maintenance-interval guidance (250 h oil service, 500 h full service, major overhaul planning)',
      'One-tap WhatsApp or phone escalation to an EmersonEIMS engineer when hands-on service is needed',
    ],
    coverage: 'Backed by EmersonEIMS mobile field service teams covering all 47 counties from our Nairobi base and scheduled regional deployments, with emergency response in under 4 hours in the Nairobi metro; other counties by mobile workshop, time depending on distance.',
    faqs: [
      { q: 'Why does my generator start and then shut down?', a: 'Common causes include low fuel pressure, blocked filters, low coolant/oil protection trips, failing sensors or AVR issues. Generator Oracle points you to the matching diagnostic guide and alarm, and EmersonEIMS technicians can attend if it needs hands-on work (under 4 hours in the Nairobi metro; elsewhere by mobile workshop).' },
      { q: 'Which generator brands does it cover?', a: 'It covers the controllers most sets in Kenya use — DeepSea, ComAp, Woodward, SmartGen, CAT PowerWizard, Datakom, Lovato, Siemens and ENKO — and J1939 engine codes from electronic diesels such as Cummins, Caterpillar, Perkins, Volvo Penta, Deutz and MTU. Older mechanical engines have no engine codes; for those, use the symptom guides.' },
      { q: 'Is the diagnosis a substitute for a technician?', a: 'It narrows the fault fast and prevents unnecessary parts purchases, but load testing, injector service and control rewiring need a qualified technician — book one directly from the tool.' },
    ],
  },
  'solar-genius-pro': {
    h2: 'SolarGenius Pro — Solar System Design & Sizing for Kenya',
    intro:
      'SolarGenius Pro gives a first estimate of the solar system you need: enter your monthly kWh from your KPLC bill (or your appliances) and it sizes the panels, inverter and battery using NASA sun-hours for your town, with a typical Kenyan cost range and payback. It is an estimate, not a quotation.',
    capabilities: [
      'Panel, inverter and battery sizing with NASA POWER sun-hours for your town',
      'Grid-tied, hybrid and off-grid modes; off-grid is sized on the cloudiest month and compared with diesel',
      /*
       * DATED, not "current". The calculator's prices live in
       * lib/solar/sizing.ts (costKes) and are mid-2026 typical installed
       * ranges. Solar prices move, so the text dates them rather than calling
       * them "current Kenya market prices".
       *
       * AquaScan already gets this right — it says "July 2026 Kenya market
       * rates" and marks every estimate. Same standard here. When the price
       * table is refreshed, update this month with it.
       */
      'Installed-cost range at mid-2026 typical Kenyan prices, with monthly saving and simple payback',
      'Send the design summary to us on WhatsApp for a quotation',
    ],
    coverage: 'Estimates use NASA sun data for Kenyan towns and your own tariff; EmersonEIMS designs, installs and maintains the systems.',
    faqs: [
      { q: 'How many solar panels do I need in Kenya?', a: 'It depends on daily consumption: a typical home using 10 kWh/day needs roughly a 3 kW array with storage. SolarGenius Pro estimates it from your KPLC bill or appliances.' },
      { q: 'What does a solar system cost in Kenya?', a: 'Residential hybrid systems commonly run KSh 150k–1.5M depending on size and storage. The tool gives a typical installed-cost range for your design — treat it as indicative and confirm it with a quotation.' },
      { q: 'Can solar run a borehole pump?', a: 'Yes — solar pumping is often the cheapest lifetime option. For a first estimate use off-grid mode with the pump\'s kW as the largest load; our engineers size the pump itself from your borehole\'s test-pumping results.' },
    ],
  },
  calculators: {
    h2: 'Engineering Calculators — Generator Sizing, Solar, UPS, Cable & Fuel Tools',
    intro:
      'Free professional engineering calculators used by contractors and facility managers across Kenya: generator sizing, solar array and battery sizing, UPS runtime, cable sizing and voltage drop, fuel consumption and lifecycle cost.',
    capabilities: [
      'Generator sizing from connected load with safety margin and derating',
      'UPS runtime and battery bank calculators for data rooms and clinics',
      'Cable size and voltage-drop checks to Kenyan wiring practice',
      'Diesel fuel consumption and cost-per-kWh comparisons vs solar and grid',
    ],
    coverage: 'Every calculator reflects Kenyan market conditions and standards, and links directly to EmersonEIMS engineers for validation of critical designs.',
    faqs: [
      { q: 'What size generator do I need?', a: 'Sum your running loads, add the largest motor starting kVA, then add a 25% margin. The sizing calculator does this properly, including diversity factors — a 10-second job instead of an expensive guess.' },
      { q: 'Are the calculators free?', a: 'Yes — all calculators are free to use without registration. Complex or safety-critical designs should still be reviewed by an engineer, which we offer.' },
      { q: 'How accurate is the fuel consumption estimate?', a: 'Within ~10% for healthy engines at the stated load (e.g., a 100 kVA set burns roughly 20–25 L/hr at 75% load). Real consumption depends on engine condition and load profile.' },
    ],
  },
  diagnostics: {
    h2: 'Equipment Diagnostics Suite — Generators, Motors, Pumps & Power Systems',
    intro:
      'The EmersonEIMS diagnostics suite triages faults in generators, electric motors, water pumps, UPS systems and switchgear — guided symptom analysis that tells you what to check, what to measure and when to call an engineer.',
    capabilities: [
      'Guided fault trees for no-start, overheating, vibration, tripping and output problems',
      'Measurement interpretation: insulation resistance, winding balance, battery health, fuel pressure',
      'Repair-vs-replace guidance with Kenya market pricing context',
      'Direct booking of EmersonEIMS field diagnostics with calibrated instruments',
    ],
    coverage: 'Remote triage anywhere; on-site diagnostics across all 47 Kenyan counties with 24/7 emergency coverage in major towns.',
    faqs: [
      { q: 'Why does my pump trip the breaker?', a: 'Usually overload from a jammed impeller, low insulation resistance after water ingress, or an undersized cable run. The suite walks the megger and current checks that separate them.' },
      { q: 'Do you diagnose on site?', a: 'Yes — thermal imaging, insulation testing, load-bank testing and power-quality logging across Kenya, with same-day response in Nairobi.' },
      { q: 'What does a diagnostic visit cost?', a: 'Call-out diagnostics typically run KSh 5,000–15,000 within Nairobi depending on equipment, credited against repair work we carry out.' },
    ],
  },
  'maintenance-hub': {
    h2: 'Maintenance Hub — Preventive Maintenance Plans for Generators, Solar & Power Equipment',
    intro:
      'The Maintenance Hub builds preventive maintenance schedules for generators, solar plants, UPS systems, pumps and HVAC — service intervals, checklists and cost planning that extend equipment life from 15,000 to 25,000+ hours.',
    capabilities: [
      'Interval planning: daily checks, 250 h oil service, 500 h full service, 2000–3000 h overhaul',
      'Printable service checklists and log templates per equipment type',
      'Annual maintenance contract (AMC) scoping with transparent Kenya pricing',
      'Fleet dashboards for multi-site operators (hospitals, telecom, retail chains)',
    ],
    coverage: 'AMC coverage across Kenya and East Africa with mobile field service teams, genuine parts stock and 24/7 emergency response for contract clients.',
    faqs: [
      { q: 'How often should a standby generator be serviced?', a: 'Oil and filters every 250 running hours or 6 months (whichever first), full service at 500 hours or annually, plus weekly no-load checks and monthly on-load tests.' },
      { q: 'What does an AMC cost in Kenya?', a: 'Typical generator AMCs run KSh 60k–250k/year depending on size, site count and response tier — usually 3–5% of replacement value, versus the far higher cost of an unplanned failure.' },
      { q: 'Do you maintain solar systems too?', a: 'Yes — panel cleaning regimes, string testing, inverter service and battery health monitoring, standalone or bundled with generator AMCs.' },
    ],
  },
  fabrication: {
    h2: 'Fabrication & Engineering Works — Canopies, Tanks, Structures & Custom Steelwork',
    intro:
      'EmersonEIMS fabrication delivers generator canopies and acoustic enclosures, fuel tanks, exhaust systems, structural steel, incinerators and custom metalwork — designed, built and installed by certified welders and engineers.',
    capabilities: [
      'Sound-attenuated generator canopies and drop-over enclosures to 85 dBA @ 1 m and below',
      'Bunded fuel tanks and day-tank systems with gauges and fire valves',
      'Medical and general-purpose incinerators with emissions-conscious design',
      'Structural steel: platforms, gantries, brackets, machine bases and guards',
    ],
    coverage: 'Fabricated in our Nairobi works and installed anywhere in Kenya and East Africa, with site surveys and engineered drawings before manufacture.',
    faqs: [
      { q: 'Can you build a silent canopy for an open generator?', a: 'Yes — retrofit acoustic canopies with proper airflow design are a core product; typical noise reduction is 15–25 dBA without derating the engine.' },
      { q: 'Do you make incinerators?', a: 'Yes — medical-waste and general incinerators sized for clinics, hospitals and institutions, including installation, commissioning and operator training.' },
      { q: 'What is the lead time?', a: 'Standard canopies and tanks: 2–4 weeks from confirmed drawings. Complex structural work is quoted with a programme after site survey.' },
    ],
  },
  'ai-tools': {
    h2: 'EmersonEIMS AI Tools — Free Engineering Intelligence for Power, Water & Solar',
    intro:
      'A suite of free AI-powered engineering tools built for the Kenyan and East African market: AquaScan Pro for boreholes and groundwater, Generator Oracle for diagnostics, SolarGenius Pro for solar design, BuildingPro for construction services, plus calculators, diagnostics and maintenance planners.',
    capabilities: [
      'AquaScan Pro — desktop borehole pre-feasibility with audited, verifiable reports',
      'Generator Oracle — brand-specific generator fault diagnosis and maintenance guidance',
      'SolarGenius Pro — solar PV design, sizing and payback for homes to industry',
      'Engineering calculators, equipment diagnostics and maintenance planning — all free',
    ],
    coverage: 'Built in Kenya, priced for the region, and backed by real EmersonEIMS engineers — the tools hand over to humans the moment field work is needed.',
    faqs: [
      { q: 'Are the AI tools really free?', a: 'Yes. The tools are free to use; we earn our keep when you need the physical services they lead to — surveys, installation, repairs and maintenance.' },
      { q: 'How are the results validated?', a: 'Each tool publishes its methodology and limits. AquaScan Pro, for example, runs 20 automated consistency checks and refuses to export a contradictory report, with a public validation ledger.' },
      { q: 'Can I use them outside Kenya?', a: 'Yes — the underlying data sources are global, with the deepest calibration in Kenya and East Africa.' },
    ],
  },
  'generator-parts': {
    h2: 'Generator Spare Parts Kenya — 2000+ Genuine Parts, M-Pesa Checkout, Countrywide Delivery',
    intro:
      'Buy genuine generator spare parts online in Kenya: filters, AVRs, controllers, sensors, gaskets, starters, alternators and consumables for Cummins, Perkins, CAT, FG Wilson, Lister Petter and more — with M-Pesa payment and delivery to all 47 counties.',
    capabilities: [
      'Oil, fuel, air and water filters cross-referenced by engine model',
      'AVRs, controllers (DeepSea, ComAp, PowerWizard), sensors and solenoids',
      'Starters, alternators, water pumps, turbochargers and gasket kits',
      'Fitment support from EmersonEIMS technicians and same-day Nairobi dispatch',
    ],
    coverage: 'Stocked in Nairobi with countrywide courier delivery and regional export to Uganda, Tanzania, Rwanda and South Sudan.',
    faqs: [
      { q: 'How do I know a part is genuine?', a: 'Every part is sourced through authorised channels and cross-referenced against the engine serial. Counterfeit filters are a leading cause of engine failure in Kenya — a saved shilling that costs an engine.' },
      { q: 'Can you fit the parts you sell?', a: 'Yes — technicians across the country can fit and test what you buy, and fitment by us extends the parts warranty.' },
      { q: 'Do you deliver outside Nairobi?', a: 'Yes, courier delivery countrywide (typically 1–2 days) and export across East Africa.' },
    ],
  },
  solar: {
    h2: 'Solar Hub — Solar Power Systems, Water Pumping & Hybrid Energy for Kenya',
    intro:
      'The EmersonEIMS Solar Hub covers everything solar in Kenya: grid-tie and hybrid systems, solar water pumping for boreholes and irrigation, commercial rooftops, battery storage and generator-solar hybrids that cut diesel bills by half or more.',
    capabilities: [
      'Residential, commercial and industrial PV design, supply and installation',
      'Solar borehole pumping — sized with AquaScan Pro groundwater data',
      'Battery storage and backup integration with existing generators and UPS',
      'O&M: cleaning regimes, string testing, inverter service and monitoring',
    ],
    coverage: 'Installations across Kenya and East Africa with county-level service reach and 2-year workmanship warranty.',
    faqs: [
      { q: 'Is solar worth it in Kenya?', a: 'Usually yes: with 4.5–6.5 kWh/m²/day of irradiance, commercial systems commonly pay back in 3–5 years against KPLC tariffs, faster where diesel generation is being displaced.' },
      { q: 'Can solar work with my existing generator?', a: 'Yes — hybrid controllers let solar carry the day load and the generator top up, typically halving fuel consumption. We design the integration properly, including reverse-power protection.' },
      { q: 'Do you offer financing?', a: 'We work with asset financiers and structure phased installations; talk to our engineers about options for your project size.' },
    ],
  },
};

export default function ToolSeoContent({
  tool,
  headingLevel = 'h2',
}: {
  tool: keyof typeof TOOLS | string;
  /** Use 'h1' only when the host page renders no <h1> of its own. */
  headingLevel?: 'h1' | 'h2';
}) {
  const c = TOOLS[tool as string];
  if (!c) return null;
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: c.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  return (
    <section aria-label="About this tool" className="mx-auto max-w-4xl px-6 py-14 text-slate-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      {/*
        Heading level is opt-in. Most hosts (/calculators, /diagnostics,
        /generator-oracle, /maintenance-hub, /solar ...) already render their own
        <h1>, so this block must stay an <h2> there.

        The interactive tool pages do NOT: a Googlebot scan on 2026-07-31 found
        /aquascan-pro-v3 and /solar-genius-pro and their sub-pages serving 700–1000
        words with no <h1> at all, because the app itself is client-rendered.
        Those layouts pass headingLevel="h1" so the page has exactly one.
      */}
      {headingLevel === 'h1' ? (
        <h1 className="text-2xl font-bold text-white">{c.h2}</h1>
      ) : (
        <h2 className="text-2xl font-bold text-white">{c.h2}</h2>
      )}
      <p className="mt-4 leading-relaxed">{c.intro}</p>
      <h3 className="mt-8 text-lg font-semibold text-white">What it does</h3>
      <ul className="mt-3 list-disc space-y-2 pl-6">
        {c.capabilities.map((cap) => (
          <li key={cap}>{cap}</li>
        ))}
      </ul>
      <h3 className="mt-8 text-lg font-semibold text-white">Coverage</h3>
      <p className="mt-3 leading-relaxed">{c.coverage}</p>
      <h3 className="mt-8 text-lg font-semibold text-white">Frequently asked questions</h3>
      <dl className="mt-3 space-y-5">
        {c.faqs.map((f) => (
          <div key={f.q}>
            <dt className="font-semibold text-white">{f.q}</dt>
            <dd className="mt-1 leading-relaxed">{f.a}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-10 text-sm">
        <Link href="/contact" className="font-semibold text-cyan-400 underline">Talk to an EmersonEIMS engineer</Link>
        {' · '}
        <Link href="/services" className="font-semibold text-cyan-400 underline">All services</Link>
        {' · '}
        <Link href="/ai-tools" className="font-semibold text-cyan-400 underline">All AI tools</Link>
      </p>
    </section>
  );
}
