// ═══════════════════════════════════════════════════════════════════════════════
// PowerQualityEngineeringDeepDive — additive, server-rendered reference content for
// /solutions/power-interruptions. UNIQUE angle: the TYPES of power disturbance, what
// they cost, and the mitigation hierarchy (PFC → AVR/stabiliser → SPD → UPS → genset).
// Distinct from the UPS and generator deep-dives.
// ═══════════════════════════════════════════════════════════════════════════════

import {
  DeepDiveSection,
  DeepDiveBlock,
  FormulaBlock,
  SpecTable,
  Callout,
} from '@/components/content/EngineeringDeepDive';

export default function PowerQualityEngineeringDeepDive() {
  return (
    <DeepDiveSection
      id="power-quality-engineering"
      eyebrow="Engineering reference"
      title="Power Quality in Kenya: Disturbances, Their Cost & How to Mitigate Them"
      accent="amber"
      intro="Total blackouts are the obvious problem. The expensive, invisible one is dirty power — the sags, spikes, brown-outs and harmonics that quietly damage equipment and corrupt processes between outages. This is how to read the disturbances on a Kenyan supply and build the right defence at the right cost."
      sources={[
        'IEC 61000-4-30 — power-quality measurement methods (sags, swells, transients, harmonics, flicker).',
        'IEEE 519-2022 — harmonic control limits (THD).',
        'IEC 62040 — UPS performance for power-quality mitigation.',
        'IEEE 1100 (Emerald Book) — powering and grounding sensitive electronic equipment.',
        'EPRA / KPLC supply-quality context for Kenyan commercial and industrial sites.',
      ]}
    >
      <DeepDiveBlock heading="1. The disturbances hiding in your supply" accent="amber">
        <p>
          &quot;Power problems&quot; is not one thing. A proper diagnosis (IEC&nbsp;61000-4-30) separates them, because each has
          a different cause and a different cure. A <strong>sag (dip)</strong> is a brief drop in voltage — often when a big
          motor starts nearby — that resets controls and dims lights. A <strong>swell</strong> is the opposite, a brief
          over-voltage that stresses insulation. <strong>Transients</strong> are fast, high spikes (switching, lightning) that
          destroy electronics outright. <strong>Brown-outs</strong> are sustained under-voltage that overheats motors.
          <strong> Harmonics</strong> are waveform distortion from non-linear loads. And the <strong>interruption</strong> —
          the total outage — is just the most visible member of the family.
        </p>
        <p>
          Much of Kenya&apos;s grid delivers all of these to some degree, and most businesses misread the symptoms — blaming
          equipment that is actually a victim of the supply. The first step we take is to <strong>measure</strong>: a
          power-quality logger over a representative period reveals which disturbances are really present, so the money goes on
          the right defence instead of a guessed one.
        </p>
      </DeepDiveBlock>

      <SpecTable
        caption="Power-quality disturbances and their usual cause"
        accent="amber"
        highlightCol={0}
        headers={['Disturbance', 'What it is', 'Typical cause']}
        rows={[
          ['Sag / dip', 'Brief under-voltage', 'Large motor start, grid faults'],
          ['Swell', 'Brief over-voltage', 'Load shedding, switching'],
          ['Transient / spike', 'Fast high-voltage pulse', 'Lightning, switching, capacitors'],
          ['Brown-out', 'Sustained under-voltage', 'Overloaded feeder, distance'],
          ['Harmonics', 'Waveform distortion (THD)', 'VFDs, UPS, LED, IT loads'],
          ['Interruption', 'Total loss of supply', 'Grid outage, faults'],
        ]}
      />

      <DeepDiveBlock heading="2. What poor power quality actually costs" accent="amber">
        <p>
          The cost is rarely a single dramatic failure; it is the slow accumulation of shortened equipment life, mysterious
          control trips, corrupted production batches, overheating motors and IT that crashes &quot;for no reason.&quot; Because
          the damage is gradual and the cause is invisible, it is usually misattributed — a factory replaces a string of failed
          drives without realising the supply harmonics are killing them. Quantifying it means adding up the lost output, the
          premature replacements and the downtime, and it is almost always far larger than the cost of fixing the supply.
        </p>
        <p>
          This is the same logic as the cost-of-downtime calculation for backup power: until the loss is on the table, power
          quality looks like an optional expense; once it is, the protection pays for itself. We help clients put a number on it
          before recommending a cure.
        </p>
      </DeepDiveBlock>

      <DeepDiveBlock heading="3. The mitigation hierarchy — match the cure to the disturbance" accent="amber">
        <p>
          There is no single device that fixes &quot;power problems&quot; — the right defence is layered, each layer addressing
          a specific disturbance. <strong>Power-factor correction</strong> tackles a poor power factor and the KPLC penalty.
          <strong> Surge protective devices (SPDs)</strong> clamp transients and spikes. An <strong>AVR / voltage
          stabiliser</strong> holds output voltage steady through sags, swells and brown-outs. <strong>Harmonic filters</strong>
          (passive or active) bring distortion back within IEEE&nbsp;519 limits. A <strong>UPS</strong> rides through short
          interruptions and conditions the supply for critical loads. And a <strong>generator</strong> carries genuine outages.
          Most sites need a considered combination, not one box.
        </p>
        <p>
          Over-buying is as common as under-buying: a site fits an expensive online UPS when a stabiliser and SPDs would have
          solved its actual (voltage and transient) problems, or fits capacitors that resonate with its harmonics and make
          things worse. The measurement in step 1 is what tells us which layers you actually need — and which you can skip.
        </p>
      </DeepDiveBlock>

      <SpecTable
        caption="Which device for which problem"
        accent="amber"
        highlightCol={1}
        headers={['Problem', 'Right mitigation']}
        rows={[
          ['Low power factor / KPLC penalty', 'Power-factor correction (detuned if harmonics present)'],
          ['Transients / spikes / lightning', 'Surge protective devices (SPD), good earthing'],
          ['Sags / swells / brown-outs', 'AVR / automatic voltage stabiliser'],
          ['Harmonic distortion (high THD)', 'Passive or active harmonic filter'],
          ['Short interruptions, sensitive loads', 'Online UPS'],
          ['Sustained outages', 'Standby generator + ATS'],
        ]}
      />

      <FormulaBlock
        label="Total harmonic distortion (the power-quality yardstick)"
        expression="THD = √(ΣVₙ²) ÷ V₁   (target: voltage THD < 5% per IEEE 519)"
        where={[
          ['Vₙ', 'magnitude of the n-th harmonic'],
          ['V₁', 'magnitude of the fundamental (50 Hz)'],
          ['THD', 'total harmonic distortion (%)'],
        ]}
        example={<>If voltage THD at your main board exceeds ~5%, non-linear loads are distorting your supply enough to overheat transformers and trip drives — a measurable trigger for harmonic mitigation.</>}
        accent="amber"
      />

      <DeepDiveBlock heading="4. Earthing: the foundation under all of it" accent="amber">
        <p>
          None of the protective devices above work properly on a bad earth. Surge protectors need a low-impedance path to
          divert a transient; sensitive electronics need a clean reference; protection needs to see a fault to clear it. A poor
          or corroded earth quietly undermines the whole power-quality strategy and is itself a shock hazard. We test earth
          resistance as part of any power-quality remediation, because fixing the supply on top of a bad earth is building on
          sand.
        </p>
        <p>
          Done as a system — measure, then layer correction, surge protection, stabilisation, filtering, UPS and generator on a
          sound earth — power quality stops being a recurring mystery and becomes a solved, documented part of the
          installation.
        </p>
      </DeepDiveBlock>

      <Callout title="Stop guessing — measure your power" accent="amber">
        If equipment keeps failing, controls trip &quot;for no reason,&quot; or your KPLC bill carries a reactive-power penalty,
        let us log your power quality and return a measured diagnosis with a right-sized mitigation plan — not an over-sold box.
        Call <strong>+254&nbsp;768&nbsp;860&nbsp;665</strong> or <strong>+254&nbsp;782&nbsp;914&nbsp;717</strong>.
      </Callout>
    </DeepDiveSection>
  );
}
