// ═══════════════════════════════════════════════════════════════════════════════
// SolarGeniusContent — crawlable, server-rendered SEO content + imagery for the
// Solar Genius Pro tool pages (fault-codes, design-studio, solar-dashboard). The
// tools themselves are ssr:false (invisible to crawlers); this content sits below
// each tool so the pages have real, unique, indexable substance. Does NOT modify
// any tool. Each variant is distinct (no duplicate content).
// ═══════════════════════════════════════════════════════════════════════════════

import Image from 'next/image';
import {
  DeepDiveSection,
  DeepDiveBlock,
  SpecTable,
  Callout,
} from '@/components/content/EngineeringDeepDive';

type Variant = 'fault-codes' | 'design-studio' | 'solar-dashboard';

function Hero({ src, alt }: { src: string; alt: string }) {
  return (
    <figure className="relative w-full overflow-hidden rounded-2xl border border-emerald-500/20" style={{ aspectRatio: '16 / 6' }}>
      <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width:768px) 100vw, 960px" />
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-4 text-sm text-white/90">{alt}</figcaption>
    </figure>
  );
}

export default function SolarGeniusContent({ variant }: { variant: Variant }) {
  if (variant === 'fault-codes') {
    return (
      <DeepDiveSection id="solar-fault-codes-content" eyebrow="Reference" title="Solar Inverter Fault Codes: What They Mean & What To Do" accent="emerald"
        intro="When a solar inverter alarms, the code is usually honest — once you know how to read it. This is a practical guide to the fault families common across Kenyan installations, what each points to, and the first checks before you call for service."
        sources={['IEC 62109 — safety of power converters for PV systems.', 'Inverter manufacturer fault-code references (Huawei, SMA, Growatt, Solis, Sungrow, Victron, Deye).', 'IEC 61727 / grid-interconnection requirements.']}>
        <Hero src="/images/solar power farms.png" alt="Solar PV array and inverters — fault-code diagnosis in the field" />
        <DeepDiveBlock heading="Fault families, not just codes" accent="emerald">
          <p>
            Every brand numbers its faults differently, but they fall into a handful of families. Read the family and you are
            most of the way to the cause. <strong>Grid faults</strong> (grid over/under-voltage or frequency) mean the supply the
            inverter is tied to is out of limits — common on weak Kenyan feeders, and often the grid&apos;s fault, not the
            inverter&apos;s. <strong>Isolation / insulation (ISO / Riso) faults</strong> point to moisture ingress or damaged DC
            cabling lowering the array&apos;s insulation resistance to earth. <strong>Over-temperature</strong> points to a baking
            or poorly-ventilated install location. <strong>DC over-voltage</strong> means too many panels in the string for the
            cold-morning open-circuit voltage. <strong>Arc-fault / AFCI</strong> trips point to a loose or degraded DC connection.
          </p>
          <p>
            The discipline is the same as any diagnosis: read the code, identify the family, and check the cause before resetting.
            Repeatedly clearing an isolation fault without finding the moisture or damaged cable just defers a failure — and on the
            DC side, that can be a fire risk.
          </p>
        </DeepDiveBlock>
        <SpecTable caption="Common solar inverter fault families" accent="emerald" highlightCol={0}
          headers={['Fault family', 'Typical meaning', 'First checks']}
          rows={[
            ['Grid over/under-voltage', 'Grid outside limits', 'Measure grid V/Hz; weak feeder?'],
            ['Isolation / Riso low', 'Insulation to earth low', 'Moisture, damaged DC cable, connectors'],
            ['DC over-voltage', 'String Voc too high (cold)', 'Panels per string vs inverter Vmax'],
            ['Over-temperature', 'Inverter too hot', 'Ventilation, direct sun, derating'],
            ['Arc-fault (AFCI)', 'Loose/degraded DC joint', 'Inspect & remake DC connections'],
            ['No / low power', 'Soiling, shading, string down', 'Clean, check strings vs neighbours'],
          ]}
        />
        <Callout title="Stuck on a fault code?" accent="emerald">Use the Solar Fault Codes tool above, or send us the inverter make, model and the exact code and our engineers will diagnose it. Call <strong>+254&nbsp;768&nbsp;860&nbsp;665</strong>.</Callout>
      </DeepDiveSection>
    );
  }

  if (variant === 'design-studio') {
    return (
      <DeepDiveSection id="solar-design-studio-content" eyebrow="Engineering reference" title="Solar PV Design: Principles Behind a System That Performs" accent="emerald"
        intro="Good solar design is a sequence of decisions that each constrain the next — and getting the order right is what separates a system that pays back from one that disappoints. This is the design workflow our Design Studio automates, explained."
        sources={['IEC 62548 — PV array design requirements.', 'IEC 60364-7-712 — PV installations.', 'Inverter MPPT-window and DC/AC-ratio design guidance.']}>
        <Hero src="/images/solar for flower farms.png" alt="Commercial solar PV design and layout for a Kenyan site" />
        <DeepDiveBlock heading="The design sequence" accent="emerald">
          <p>
            Design starts from the <strong>load and the goal</strong> (offset the daytime bill? ride through outages? go off-grid?),
            because that decides the architecture — grid-tie, hybrid or off-grid. Next comes the <strong>array</strong>, sized from
            the energy target and the site&apos;s peak sun hours and performance ratio, then the <strong>string design</strong>,
            which must keep voltage inside the inverter&apos;s MPPT window at both the cold-morning and hot-afternoon extremes.
            The <strong>inverter</strong> is matched to the array with a sensible DC/AC ratio, and the <strong>balance of
            system</strong> — cabling sized for volt-drop, protection, isolation and earthing — ties it together safely.
          </p>
          <p>
            Layout and <strong>shading</strong> are where good design earns its money: panels in a string share current, so a
            single shaded module drags the whole string. The studio models the roof, the sun path and obstructions so strings are
            arranged to avoid mismatch, and orientation/tilt are chosen for the yield profile the site actually needs (a business
            with afternoon peaks may favour a slightly west-of-north tilt over absolute maximum annual yield).
          </p>
        </DeepDiveBlock>
        <SpecTable caption="Design decisions and what each constrains" accent="emerald" highlightCol={0}
          headers={['Decision', 'Driven by', 'Constrains']}
          rows={[
            ['Architecture', 'Goal + grid reliability', 'Battery, inverter type'],
            ['Array size (kWp)', 'Energy target, PSH, PR', 'Roof area, budget'],
            ['String design', 'Inverter MPPT window, temp extremes', 'Panels per string'],
            ['Inverter', 'Array kWp, peak/surge load', 'DC/AC ratio, clipping'],
            ['Layout / tilt', 'Shading, yield profile', 'Mismatch losses'],
            ['BOS (cable/protection)', 'Current, volt-drop, safety', 'Losses, compliance'],
          ]}
        />
        <Callout title="Design your system with us" accent="emerald">Use the Design Studio above to explore options, then send us the result for an engineered, costed design. Call <strong>+254&nbsp;768&nbsp;860&nbsp;665</strong>.</Callout>
      </DeepDiveSection>
    );
  }

  return (
    <DeepDiveSection id="solar-dashboard-content" eyebrow="Engineering reference" title="Solar Monitoring: The Numbers That Tell You It's Working" accent="emerald"
      intro="A solar system rarely fails loudly — it quietly under-delivers, and without monitoring nobody notices the lost yield. These are the metrics a good dashboard tracks, and why each matters."
      sources={['IEC 61724-1 — PV system performance monitoring.', 'Manufacturer monitoring/telemetry references.']}>
      <Hero src="/images/solar power farms.png" alt="Solar monitoring dashboard and performance metrics" />
      <DeepDiveBlock heading="The metrics that matter" accent="emerald">
        <p>
          The headline number is <strong>performance ratio (PR)</strong> — energy actually harvested versus what the sunlight that
          fell on the array should have produced. PR normalises for the weather, so it exposes losses within your control: a
          well-built Kenyan system holds ~0.75–0.80, and a drift below that flags soiling, shading or a fault. <strong>Specific
          yield</strong> (kWh per kWp) lets you compare your system to its design expectation and to other sites. <strong>String
          or MPPT-level data</strong> is the most powerful diagnostic — an identical string lagging its neighbours localises a
          fault instantly.
        </p>
        <p>
          Beyond energy, a dashboard watches <strong>inverter status and faults</strong>, <strong>availability</strong> (was the
          system actually up?), and — on hybrid systems — <strong>battery state of charge, cycles and temperature</strong>.
          Alerts turn all of this from a report you never read into a notification that reaches you before a small problem
          becomes a season of lost generation.
        </p>
      </DeepDiveBlock>
      <SpecTable caption="Key solar monitoring KPIs" accent="emerald" highlightCol={0}
        headers={['Metric', 'What it tells you', 'Healthy / action']}
        rows={[
          ['Performance ratio (PR)', 'Real vs expected yield', '≥ 0.75; investigate if lower'],
          ['Specific yield (kWh/kWp)', 'Output vs design', 'Compare to design & peers'],
          ['String-level output', 'Per-string health', 'Lagging string = inspect'],
          ['Inverter status / faults', 'Converter health', 'Act on recurring codes'],
          ['Availability', 'Uptime', 'Chase unexplained downtime'],
          ['Battery SoC / temp / cycles', 'Storage health', 'Cool siting, watch degradation'],
        ]}
      />
      <Callout title="Want monitoring that actually alerts you?" accent="emerald">We set up monitoring and an O&amp;M plan so your system keeps earning. Use the dashboard above or call <strong>+254&nbsp;768&nbsp;860&nbsp;665</strong>.</Callout>
    </DeepDiveSection>
  );
}
