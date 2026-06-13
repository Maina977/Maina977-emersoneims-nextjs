// ═══════════════════════════════════════════════════════════════════════════════
// SolarFaultEngineeringDeepDive — additive, server-rendered reference content for
// /solutions/solar. UNIQUE angle: diagnosing solar UNDERPERFORMANCE and faults (IV
// curve reading, soiling/shading/mismatch, hotspots, inverter faults, performance-ratio
// monitoring, O&M in dusty Kenya). Distinct from sizing and PV-physics deep-dives.
// ═══════════════════════════════════════════════════════════════════════════════

import {
  DeepDiveSection,
  DeepDiveBlock,
  FormulaBlock,
  SpecTable,
  Callout,
} from '@/components/content/EngineeringDeepDive';

export default function SolarFaultEngineeringDeepDive() {
  return (
    <DeepDiveSection
      id="solar-fault-engineering"
      eyebrow="Engineering reference"
      title="Diagnosing Solar Underperformance: Faults, IV Curves & O&M"
      accent="emerald"
      intro="A solar array rarely fails outright — it quietly under-delivers, and the owner never knows what they are missing. This is how to tell a healthy system from a sick one: reading the symptoms, the IV curve, the common Kenyan failure modes, and the monitoring that catches a problem before it costs a season of yield."
      sources={[
        'IEC 61724-1 — photovoltaic system performance monitoring.',
        'IEC 62446 — commissioning tests, documentation and inspection of PV systems.',
        'IEC 61215 — module qualification (hotspot, degradation).',
        'Inverter manufacturer fault-code references (isolation, grid, over-temperature).',
        'Field O&M practice for soiling and degradation in dusty/coastal environments.',
      ]}
    >
      <DeepDiveBlock heading="1. The performance ratio: are you actually getting your yield?" accent="emerald">
        <p>
          The honest health check for any solar system is the <strong>performance ratio (PR)</strong> — the energy you actually
          harvested divided by what the array <em>should</em> have produced given the sunlight that fell on it. A well-built,
          clean Kenyan system runs a PR around 0.75-0.80; a dusty, shaded or faulty one drifts well below 0.65. Because the sun
          varies day to day, raw kWh tells you little — PR normalises for the weather and exposes the losses that are actually
          within your control.
        </p>
        <p>
          Without monitoring, a system can lose 10-20% of its output to creeping soiling, a failing string or a degrading panel
          and nobody notices, because it still &quot;works.&quot; The first thing we do on an underperforming site is establish
          the real PR — that single number turns a vague &quot;it doesn&apos;t seem to do much&quot; into a measurable,
          fixable gap.
        </p>
      </DeepDiveBlock>

      <FormulaBlock
        label="Performance ratio"
        expression="PR = E_actual ÷ (P_array × (H_irradiation ÷ G_STC))"
        where={[
          ['E_actual', 'energy actually generated (kWh)'],
          ['P_array', 'installed array capacity (kWp)'],
          ['H_irradiation', 'in-plane irradiation over the period (kWh/m²)'],
          ['G_STC', 'reference irradiance (1 kW/m²)'],
        ]}
        example={<>A 7&nbsp;kWp array under 5.5&nbsp;kWh/m² should make ~38.5&nbsp;kWh; if it only makes 27&nbsp;kWh, PR ≈ 0.70 — a 10-point loss worth investigating (soiling? a dead string?).</>}
        accent="emerald"
      />

      <DeepDiveBlock heading="2. Reading the IV curve — the panel's fingerprint" accent="emerald">
        <p>
          A panel&apos;s <strong>current-voltage (IV) curve</strong> is its diagnostic fingerprint, and the shape of a deviation
          tells you the cause. A curve that sits low across the whole current axis points to <strong>uniform soiling</strong> or
          low irradiance. A distinct <strong>step or notch</strong> in the curve is the signature of partial <strong>shading or a
          mismatched/failing cell</strong>, where bypass diodes have kicked in. A reduced slope (lower fill factor) suggests
          <strong> increased series resistance</strong> — corroded connections or degraded cells. A curve that is fine but the
          array still under-delivers points downstream, to wiring or the inverter.
        </p>
        <p>
          You do not always need a curve tracer to reason this way: string-level monitoring that shows one string lagging its
          identical neighbours localises the fault immediately. The discipline is comparing like with like — identical strings
          under identical sun should produce identically; the one that doesn&apos;t is the one to inspect.
        </p>
      </DeepDiveBlock>

      <SpecTable
        caption="Common solar underperformance causes (and the fix)"
        accent="emerald"
        highlightCol={0}
        headers={['Symptom', 'Likely cause', 'Action']}
        rows={[
          ['Whole array down a bit', 'Soiling (dust/coastal salt)', 'Scheduled cleaning'],
          ['One string lags identical ones', 'Connector / cable / blown fuse', 'Inspect that string'],
          ['Notch/step in output', 'Shading or failing cell', 'Trace shade source / module test'],
          ['Hot spot on module', 'Bypass diode / cell defect', 'Thermal scan, replace module'],
          ['Inverter trips on isolation', 'Moisture / earth fault in DC', 'Insulation test the array'],
          ['Output capped below array', 'Inverter clipping / undersized', 'Check DC/AC ratio, inverter health'],
        ]}
      />

      <DeepDiveBlock heading="3. Hotspots, mismatch and why one bad module hurts" accent="emerald">
        <p>
          Panels in a string carry the same current, so the weakest module sets the pace — a single shaded, soiled or degraded
          module drags the whole string, which is the <strong>mismatch</strong> loss. Worse, a cell forced to pass more current
          than it can generate heats up into a <strong>hotspot</strong>, which can crack the glass and start a slow failure (the
          reason modules have bypass diodes). In dusty and coastal Kenya, uneven soiling and bird droppings are common hotspot
          triggers, which is why cleaning is not cosmetic — it is fault prevention.
        </p>
        <p>
          A thermal (infrared) scan is the fastest way to find hotspots and dead cells across a large array, and we use it on
          commercial sites where climbing every panel is impractical. Catching a developing hotspot early turns a module swap
          into routine maintenance instead of a fire risk.
        </p>
      </DeepDiveBlock>

      <DeepDiveBlock heading="4. Inverter faults and degradation over time" accent="emerald">
        <p>
          The inverter is the hardest-working component and the most common single point of failure. Its fault codes are usually
          honest once you read them: <strong>isolation/earth faults</strong> point to moisture ingress or damaged DC cabling;
          <strong> grid faults</strong> point to supply voltage/frequency outside limits (common on weak Kenyan feeders);
          <strong> over-temperature</strong> points to poor ventilation or a baking installation location. Separately, panels
          themselves <strong>degrade</strong> slowly — roughly 0.5% a year — which is normal and warrantied, but a sudden step
          down is a fault, not age.
        </p>
        <p>
          Distinguishing normal degradation from a real fault is exactly what monitoring and a baseline PR let you do. We
          commission systems with proper documentation (IEC&nbsp;62446) and a performance baseline, so years later there is a
          reference to judge against rather than a guess.
        </p>
      </DeepDiveBlock>

      <DeepDiveBlock heading="5. O&M: the cheapest yield you can buy" accent="emerald">
        <p>
          Solar is often sold as &quot;fit and forget,&quot; which is half true: there are no moving parts, but there is dust,
          there are connectors that loosen, there are inverters that age and there is vegetation that grows into the sun line.
          A modest <strong>operations-and-maintenance regime</strong> — scheduled cleaning matched to the local dust/salt,
          periodic connection and isolation checks, inverter health review, and PR monitoring — routinely recovers more yield
          than it costs, every year.
        </p>
        <p>
          For commercial arrays where every percentage point is real money, O&amp;M is the difference between a system that
          quietly decays to 65% PR and one that holds near 80% for its full life. We build that monitoring and maintenance into
          the SLA so the asset keeps earning what it was designed to.
        </p>
      </DeepDiveBlock>

      <Callout title="Underperforming array? Let us diagnose it" accent="emerald">
        If your solar isn&apos;t saving what you expected, we will measure its performance ratio, trace the fault (soiling,
        string, inverter or module) and quote the fix or an O&amp;M plan to keep it healthy. Call
        <strong> +254&nbsp;768&nbsp;860&nbsp;665</strong> or <strong>+254&nbsp;782&nbsp;914&nbsp;717</strong>.
      </Callout>
    </DeepDiveSection>
  );
}
