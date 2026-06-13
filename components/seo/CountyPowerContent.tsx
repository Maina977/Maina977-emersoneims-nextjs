// ═══════════════════════════════════════════════════════════════════════════════
// CountyPowerContent — UNIQUE-per-county, server-rendered local SEO content driven
// by the county's real data (region climate/altitude, its actual towns/areas,
// population). Each county reads differently because the data differs — legitimate
// local SEO, not duplicated doorway pages. Lists the towns served so one rich county
// page is relevant for "[town] generator" searches (no thin per-village pages).
// ═══════════════════════════════════════════════════════════════════════════════

import {
  DeepDiveSection,
  DeepDiveBlock,
  Callout,
} from '@/components/content/EngineeringDeepDive';

interface Village { name: string }
interface Constituency { name: string; villages: Village[] }
interface County { name: string; region: string; population: number; constituencies: Constituency[] }

// Region-specific engineering narrative — different physics & loads per region.
const REGION: Record<string, { altitude: string; climate: string; angle: string; loads: string }> = {
  Central: {
    altitude: 'highland (≈1,500–2,000 m)',
    climate: 'cool highland',
    angle: 'At this altitude every diesel generator is de-rated several percent — a "100 kVA" set delivered here is really ~94 kVA on a warm day. We size against the altitude-corrected rating so the set genuinely covers the load.',
    loads: 'corporate offices, hospitals, malls, hotels, data rooms and agri-processing',
  },
  Coast: {
    altitude: 'near sea level',
    climate: 'hot, humid, salt-laden',
    angle: 'Altitude is a non-issue at the coast, but heat and salt are: gensets need corrosion-protected, marine-grade enclosures and radiators, and air-conditioning carries a heavy latent (humidity) load. We specify for heat derating and salt corrosion.',
    loads: 'tourism and hotels, port and cold-storage, manufacturing and residential developments',
  },
  Eastern: {
    altitude: 'semi-arid (varied)',
    climate: 'hot and dusty',
    angle: 'Dust is the enemy here — air filters clog fast, so service intervals tighten and enclosures need good filtration. Strong sun makes this prime solar-hybrid territory to cut diesel costs.',
    loads: 'agriculture and irrigation, water pumping, schools, health facilities and trading centres',
  },
  'North Eastern': {
    altitude: 'arid lowland',
    climate: 'very hot, dusty, remote',
    angle: 'Heat and dust drive heavy derating and tight filter servicing, and remoteness makes fuel logistics costly — which is why solar-plus-storage with a generator backup, and remote monitoring, are usually the right answer here.',
    loads: 'boreholes and water schemes, health posts, camps, telecom masts and county facilities',
  },
  Nyanza: {
    altitude: 'lakeside (≈1,130 m)',
    climate: 'warm and humid',
    angle: 'Modest altitude with lakeside humidity; the priority is reliable backup for processing and cold chain, with solar to trim daytime costs.',
    loads: 'fish processing and cold storage, agriculture, hospitals, schools and commerce',
  },
  'Rift Valley': {
    altitude: 'high altitude (up to ≈2,100 m)',
    climate: 'cool to temperate, high',
    angle: 'This is the highest-altitude region in Kenya — derating is significant (a set in Eldoret can lose ~8% of its rating). We size strictly against the altitude-corrected rating, especially for the heavy motor loads of farms and factories.',
    loads: 'flower farms and cold chain, manufacturing, agri-processing, hotels and institutions',
  },
  Western: {
    altitude: 'moderate altitude',
    climate: 'humid, cloudier',
    angle: 'Cloudier skies mean solar arrays are sized up to hit the same yield; reliable backup matters for sugar, agri-processing and institutions.',
    loads: 'sugar and agri-processing, schools, hospitals and commerce',
  },
};

export default function CountyPowerContent({ county }: { county: County }) {
  const r = REGION[county.region] ?? REGION.Central;
  // Build a crawlable list of areas/towns served (constituencies + a sample of their wards/towns)
  const areas = county.constituencies.slice(0, 12).map((c) => c.name);
  const sampleTowns = county.constituencies
    .flatMap((c) => c.villages.slice(0, 2).map((v) => v.name))
    .slice(0, 18);

  return (
    <DeepDiveSection
      id="county-power"
      eyebrow={`${county.name} County · ${county.region} region`}
      title={`Generator & Power Solutions Across ${county.name} County`}
      accent="amber"
      intro={`EmersonEIMS serves businesses and institutions across ${county.name} County — ${r.climate} conditions, ${r.altitude} — with generators, solar, UPS and full electrical engineering, installed and maintained to standard with countrywide support.`}
    >
      <DeepDiveBlock heading={`Power engineering for ${county.name}'s conditions`} accent="amber">
        <p>
          {county.name} County sits in the {county.region} region — {r.altitude}, {r.climate}. {r.angle}
        </p>
        <p>
          The county&apos;s power demand is driven by {r.loads}. With a population of around{' '}
          {county.population.toLocaleString()}, demand for reliable electricity here keeps growing, and our role is to engineer
          power that fits these specific local conditions — not a one-size set shipped in without regard for altitude, heat or
          dust. Whether it is a standby generator with an automatic changeover, a solar-hybrid to cut the diesel bill, a UPS for
          critical loads, or motor, HVAC and borehole work, we size it for {county.name} and back it with an SLA.
        </p>
      </DeepDiveBlock>

      {areas.length > 0 && (
        <DeepDiveBlock heading={`Areas and towns we serve in ${county.name}`} accent="amber">
          <p>
            We cover the whole of {county.name} County, including{' '}
            {areas.join(', ')}{county.constituencies.length > areas.length ? ' and beyond' : ''}
            {sampleTowns.length > 0 ? ` — and towns and centres such as ${sampleTowns.join(', ')}.` : '.'}{' '}
            Site surveys are free and our technicians reach sites across the county for installation, service and 24/7 emergency
            response.
          </p>
        </DeepDiveBlock>
      )}

      <Callout title={`Get a quote for ${county.name} County`} accent="amber">
        Generators, solar, UPS, motors, HVAC, boreholes and electrical works — installed and maintained anywhere in{' '}
        {county.name}. Call <strong>+254&nbsp;768&nbsp;860&nbsp;665</strong> or <strong>+254&nbsp;782&nbsp;914&nbsp;717</strong>{' '}
        for a free site survey and quote.
      </Callout>
    </DeepDiveSection>
  );
}
