// ═══════════════════════════════════════════════════════════════════════════════
// DieselFuelSystemsDeepDive — additive, server-rendered reference content for
// /solutions/diesel-automation. UNIQUE angle: diesel FUEL SYSTEMS & plant automation
// (bulk/day tanks, fuel polishing, the diesel-bug problem, leak/level telemetry,
// auto-refuel) — distinct from the controls deep-dive (electrical AMF/sync).
// ═══════════════════════════════════════════════════════════════════════════════

import {
  DeepDiveSection,
  DeepDiveBlock,
  FormulaBlock,
  SpecTable,
  Callout,
} from '@/components/content/EngineeringDeepDive';

export default function DieselFuelSystemsDeepDive() {
  return (
    <DeepDiveSection
      id="diesel-fuel-systems-engineering"
      eyebrow="Engineering reference"
      title="Diesel Fuel Systems & Plant Automation: Tanks, Polishing & Telemetry"
      accent="amber"
      intro="A standby generator is only as reliable as the fuel it draws — and stored diesel is a living, degrading thing. The fuel system, not the engine, is behind a surprising share of failed starts and field call-outs. This is how to design and automate the fuel side so the set actually runs when called."
      sources={[
        'Diesel fuel storage and stability guidance (ASTM D975, microbial contamination control).',
        'Bulk/day-tank design and bunding practice for standby plant.',
        'NFPA 110 — fuel supply requirements for emergency power systems.',
        'Manufacturer fuel-polishing and water-separation system data.',
        'Telemetry/level-monitoring practice for remote and multi-site fuel management.',
      ]}
    >
      <DeepDiveBlock heading="1. The diesel-bug problem: fuel that rots in the tank" accent="amber">
        <p>
          Standby fuel often sits in a tank for months between uses, and that is exactly the condition in which it degrades.
          Condensation puts water into the tank; at the diesel/water interface, microbes (the &quot;diesel bug&quot;) grow into a
          sludge that blocks filters and corrodes tanks. Modern low-sulphur and biodiesel-blended fuels are more prone to it,
          and the result is a set that cranks but starves — a fuel failure misdiagnosed as an engine fault.
        </p>
        <p>
          The defences are design and maintenance together: keep tanks full to limit condensation, water-separating filters,
          periodic fuel testing, and <strong>fuel polishing</strong> — circulating the stored fuel through filtration and
          water-separation to keep it clean and dry. On critical sites we automate polishing so the fuel is conditioned on a
          schedule without anyone remembering to do it.
        </p>
      </DeepDiveBlock>

      <DeepDiveBlock heading="2. Bulk and day tanks: sizing the autonomy" accent="amber">
        <p>
          Fuel system architecture is usually a <strong>bulk tank</strong> (the strategic store) feeding a smaller <strong>day
          tank</strong> at the engine, with an automatic transfer pump keeping the day tank topped up and the engine&apos;s
          return managed. Sizing the storage means deciding the <strong>autonomy</strong> — how many hours the set must run on
          stored fuel before a refuel is realistic — which depends on how remote the site is and how reliable diesel deliveries
          are. A hospital or a remote mast needs far more autonomy than a city office with a fuel station nearby.
        </p>
        <p>
          The storage must also be safe and legal: properly <strong>bunded</strong> (a containment volume around the tank to
          catch a leak), vented, and protected against theft — fuel theft from standby tanks is a real and costly problem in
          Kenya, which is one reason level telemetry (below) pays for itself.
        </p>
      </DeepDiveBlock>

      <FormulaBlock
        label="Fuel storage for a target autonomy"
        expression="Tank (litres) ≈ L/h × Autonomy_hours × margin"
        where={[
          ['L/h', 'fuel burn at the expected operating load'],
          ['Autonomy_hours', 'hours of run-time required before refuel'],
          ['margin', 'reserve + unusable bottom volume (≈1.1–1.2)'],
        ]}
        example={<>A 100&nbsp;kVA set burning ~17&nbsp;L/h at 75% load needing 48&nbsp;h autonomy: 17 × 48 × 1.15 ≈ <strong>940&nbsp;litres</strong> of usable storage.</>}
        accent="amber"
      />

      <SpecTable
        caption="Fuel system elements and what they prevent"
        accent="amber"
        highlightCol={0}
        headers={['Element', 'Purpose', 'Failure it prevents']}
        rows={[
          ['Bulk + day tank', 'Strategic store + engine feed', 'Running dry mid-outage'],
          ['Auto transfer pump', 'Keep day tank topped', 'Manual refuel errors'],
          ['Water separator / filter', 'Remove water & contaminants', 'Filter blockage, bug growth'],
          ['Fuel polishing', 'Condition stored fuel', 'Stale-fuel no-start'],
          ['Bunding', 'Contain a leak', 'Environmental / fire incident'],
          ['Level & leak telemetry', 'Remote visibility', 'Theft, surprise empty tank'],
        ]}
      />

      <DeepDiveBlock heading="3. Telemetry: knowing the fuel state before it bites" accent="amber">
        <p>
          The fuel problems that strand a generator — a slowly emptying tank, a leak, overnight theft, a transfer pump that
          stopped — are invisible until the set fails to run. <strong>Level and leak telemetry</strong> turns that around: tank
          level, consumption rate and alarms are sent to a dashboard, so a falling level or an abnormal overnight drop (theft)
          is flagged immediately. For multi-site fleets this means head office sees every tank&apos;s state at a glance instead
          of discovering an empty tank during a blackout.
        </p>
        <p>
          Combined with the controller telemetry on the electrical side, this gives a complete picture of standby readiness —
          fuel and machine together — which is the foundation of genuine predictive maintenance rather than reactive call-outs.
        </p>
      </DeepDiveBlock>

      <DeepDiveBlock heading="4. Plant automation: making it run itself, safely" accent="amber">
        <p>
          For larger and multi-set installations the fuel and engine automation are designed as one plant: automatic day-tank
          fill, scheduled fuel polishing, low-level and leak interlocks that protect the engine and the environment, and (where
          warranted) auto-refuel ordering triggered by level. The aim is a plant that maintains its own readiness and only calls
          a human when a real decision is needed.
        </p>
        <p>
          This is the difference between a generator that is &quot;installed&quot; and a standby plant that is genuinely
          <em> managed</em> — the same philosophy we apply to the electrical controls, extended to the fuel that ultimately
          decides whether the set runs.
        </p>
      </DeepDiveBlock>

      <Callout title="Make your fuel system as reliable as your engine" accent="amber">
        Whether it is sizing bulk/day tanks, adding fuel polishing, stopping diesel theft with telemetry, or automating a
        multi-set plant, we design the fuel side so the set never fails for want of clean fuel. Call
        <strong> +254&nbsp;768&nbsp;860&nbsp;665</strong> or <strong>+254&nbsp;782&nbsp;914&nbsp;717</strong>.
      </Callout>
    </DeepDiveSection>
  );
}
