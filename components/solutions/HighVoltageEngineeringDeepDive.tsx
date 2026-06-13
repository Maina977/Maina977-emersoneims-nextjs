// ═══════════════════════════════════════════════════════════════════════════════
// HighVoltageEngineeringDeepDive — additive, server-rendered reference content for
// the high-voltage page. UNIQUE topics: Kenyan voltage levels, transformer losses
// & sizing, protection/arc-flash, power-factor correction, and earthing safety.
// ═══════════════════════════════════════════════════════════════════════════════

import {
  DeepDiveSection,
  DeepDiveBlock,
  FormulaBlock,
  SpecTable,
  Callout,
} from '@/components/content/EngineeringDeepDive';

export default function HighVoltageEngineeringDeepDive() {
  return (
    <DeepDiveSection
      id="hv-engineering"
      eyebrow="Engineering reference"
      title="High-Voltage Engineering: Distribution, Transformers & Protection in Kenya"
      accent="violet"
      intro="Above 1,000 volts the rules change — clearances, protection and earthing stop being good practice and become the difference between a working substation and a fatality. This is the framework we apply when we design, build and maintain HV intakes, transformers and switchgear for Kenyan industry."
      sources={[
        'Kenya Power (KPLC) supply standards and KETRACO transmission voltage levels (11/33/66/132/220/400 kV).',
        'IEC 60076 — Power transformers (losses, ratings, temperature rise).',
        'IEC 60909 — Short-circuit current calculation in three-phase AC systems.',
        'IEEE 1584 — Guide for performing arc-flash hazard calculations.',
        'IEC 60364 / IEEE 80 — Earthing, step and touch potential for safety.',
      ]}
    >
      {/* 1 ── Why HV at all */}
      <DeepDiveBlock heading="1. Why we transmit high and use low — and Kenya's voltage ladder" accent="violet">
        <p>
          Power is the product of voltage and current, but the <em>losses</em> in a cable rise with the square of the current
          (I²R). Push the same power at a higher voltage and the current — and therefore the loss and the conductor size —
          falls dramatically. That single fact is why Kenya&apos;s grid steps up to <strong>220&nbsp;kV and 400&nbsp;kV</strong>
          for long-distance transmission (KETRACO), distributes regionally at <strong>66&nbsp;kV and 33&nbsp;kV</strong>, feeds
          towns at <strong>11&nbsp;kV</strong>, and only drops to <strong>415/240&nbsp;V</strong> at the customer transformer.
        </p>
        <p>
          A growing industrial or commercial site eventually outgrows a low-voltage supply: the cable and the KPLC connection
          charges for a large LV load become uneconomic, and the voltage sags badly at the far end. The fix is a dedicated
          <strong> 11&nbsp;kV or 33&nbsp;kV intake</strong> with the customer&apos;s own transformer — which also unlocks a better
          tariff band. Knowing when to make that jump, and engineering the intake to KPLC&apos;s standards, is most of the value
          in HV work.
        </p>
      </DeepDiveBlock>

      <FormulaBlock
        label="Transmission loss scales with current squared"
        expression="P_loss = 3 × I² × R     (I = P ÷ (√3 × V × PF))"
        where={[
          ['P_loss', 'three-phase line loss (W)'],
          ['I', 'line current — falls as voltage rises'],
          ['R', 'conductor resistance per phase'],
          ['V', 'line voltage'],
        ]}
        example={<>Raise the delivery voltage 10× and the current drops 10×, so I²R losses fall <strong>100×</strong> for the same power — the entire reason HV distribution exists.</>}
        accent="violet"
      />

      <SpecTable
        caption="Kenyan voltage levels and where they are used"
        accent="violet"
        highlightCol={0}
        headers={['Voltage', 'Role', 'Typical user']}
        rows={[
          ['400 kV / 220 kV', 'Bulk transmission', 'KETRACO national grid'],
          ['132 kV / 66 kV', 'Sub-transmission', 'Regional bulk supply points'],
          ['33 kV', 'Primary distribution', 'Large industry, towns'],
          ['11 kV', 'Secondary distribution', 'Factories, malls, estates'],
          ['415 / 240 V', 'Utilisation', 'Final load, sockets, motors'],
        ]}
      />

      {/* 2 ── Transformers */}
      <DeepDiveBlock heading="2. Transformers: sizing, losses and the efficiency you pay for daily" accent="violet">
        <p>
          The transformer is the heart of any HV intake, and it has two distinct loss streams. <strong>Iron (no-load)
          losses</strong> are present every second the unit is energised, whether or not it serves any load — magnetising the
          core. <strong>Copper (load) losses</strong> rise with the square of the load current. A transformer is most efficient
          at the load where these two are roughly equal, typically around 40–60% of rating, which is why grossly oversizing a
          transformer wastes money continuously through standing iron loss.
        </p>
        <p>
          Sizing means matching the kVA to the present and near-future maximum demand with sensible headroom, allowing for the
          power factor of the load, and — for sites heavy in VFDs and rectifiers — specifying a <strong>K-rated</strong> unit
          built to tolerate harmonic heating. Cooling class (ONAN, ONAF) and the ambient at the site set the real continuous
          rating; a transformer comfortable in a European basement can run hot in a Mombasa switch-room. We also weigh
          capitalised loss: over a 25-year life, a cheaper transformer with higher losses can cost far more than a low-loss
          unit that costs more upfront.
        </p>
      </DeepDiveBlock>

      <FormulaBlock
        label="Transformer efficiency at load fraction x"
        expression="η = (x·S·PF) ÷ (x·S·PF + P_iron + x²·P_cu)"
        where={[
          ['x', 'load fraction (0–1)'],
          ['S', 'rated kVA'],
          ['P_iron', 'no-load (core) loss'],
          ['P_cu', 'full-load copper loss'],
        ]}
        example={<>Peak efficiency occurs where P_iron = x²·P_cu, i.e. x = √(P_iron ÷ P_cu) — usually ~half load, so size for the duty, not the brochure maximum.</>}
        accent="violet"
      />

      {/* 3 ── Protection & arc flash */}
      <DeepDiveBlock heading="3. Protection coordination and the arc-flash hazard" accent="violet">
        <p>
          HV switchgear exists to clear faults fast and selectively — to trip the breaker nearest the fault and leave the rest
          of the plant running. That <strong>discrimination (coordination)</strong> is set by grading protection relays in time
          and current, fed by current and voltage transformers (CTs/VTs), so a downstream fault never trips the incomer first.
          Get the grading wrong and a single cable fault blacks out the whole site; get it right and the plant barely notices.
        </p>
        <p>
          The graver issue is the <strong>arc flash</strong> — the explosive release of energy when a fault arcs across HV
          conductors, reaching temperatures hotter than the sun&apos;s surface and producing a pressure blast and shrapnel.
          IEEE&nbsp;1584 lets us calculate the incident energy at each panel, define the arc-flash boundary, and label the
          required PPE. Faster protection settings cut the energy directly, because the energy is the power of the arc times the
          time the breaker takes to clear it. Designing for low incident energy is a safety duty, not an optional extra, and it
          is why live HV work is done only by competent persons behind a permit-to-work.
        </p>
      </DeepDiveBlock>

      <FormulaBlock
        label="Arc-flash incident energy (principle)"
        expression="E ∝ I_arc × t_clear"
        where={[
          ['E', 'incident energy at the working distance (cal/cm²)'],
          ['I_arc', 'arcing fault current'],
          ['t_clear', 'protection clearing time'],
        ]}
        example={<>Halving the relay clearing time roughly halves the incident energy — fast, well-coordinated protection is the cheapest safety measure on an HV board.</>}
        accent="violet"
      />

      {/* 4 ── Power factor correction */}
      <DeepDiveBlock heading="4. Power-factor correction: the bill you can engineer away" accent="violet">
        <p>
          Industrial sites full of motors and welding plant run at a poor power factor, drawing reactive current that does no
          work but still loads the supply — and KPLC penalises it. Installing a <strong>capacitor bank</strong> (often automatic,
          switching steps in and out to track the load) supplies that reactive power locally, lifting the power factor toward
          unity. The result is a smaller measured demand (kVA), a lower or eliminated reactive-energy charge, less voltage drop,
          and freed-up transformer and cable capacity.
        </p>
        <p>
          The catch on modern sites is harmonics: ordinary capacitors can resonate with the harmonics from VFDs and create more
          trouble than they cure, so we specify <strong>detuned (reactor-protected) banks</strong> where the harmonic content
          warrants it. Correcting from 0.75 to 0.95 typically cuts the apparent power by around 20%, and the bank often pays for
          itself within a year purely on the avoided penalty.
        </p>
      </DeepDiveBlock>

      <FormulaBlock
        label="Capacitor kVAr to correct power factor"
        expression="Q_c = P × (tan φ₁ − tan φ₂)"
        where={[
          ['Q_c', 'capacitor reactive power needed (kVAr)'],
          ['P', 'real power (kW)'],
          ['φ₁', 'angle at the existing PF'],
          ['φ₂', 'angle at the target PF'],
        ]}
        example={<>Correcting 200&nbsp;kW from 0.75 to 0.95: Q_c = 200 × (0.882 − 0.329) ≈ <strong>111&nbsp;kVAr</strong> of capacitors.</>}
        accent="violet"
      />

      {/* 5 ── Earthing */}
      <DeepDiveBlock heading="5. Earthing: step and touch potential, the silent safety system" accent="violet">
        <p>
          A substation&apos;s earthing system does its most important work in the half-second of a fault. When fault current
          floods into the ground grid, the soil&apos;s resistance creates voltage gradients across the surface — a person can be
          exposed to a dangerous <strong>touch potential</strong> (hand to feet) or <strong>step potential</strong> (foot to
          foot) even without touching live metal. IEEE&nbsp;80 lets us design the grid — conductor size, mesh spacing, ground
          rods — so these potentials stay below what the human body can survive for the fault duration.
        </p>
        <p>
          Kenyan soils vary enormously, from conductive coastal and black-cotton soils to high-resistivity rock and laterite,
          so we measure soil resistivity on site rather than assume it. A low, stable earth resistance also lets the protection
          see the fault and trip; a poor earth is both a shock hazard and a reason relays fail to operate. Earthing is tested,
          documented and re-tested — it is not visible, which is exactly why it is so often neglected and so dangerous when it is.
        </p>
      </DeepDiveBlock>

      <Callout title="Plan your HV intake or substation with us" accent="violet">
        Whether you are upgrading from an overloaded LV supply to an 11&nbsp;kV intake, sizing a transformer, correcting power
        factor or building a substation, we deliver the design, the KPLC liaison and the protection/earthing to standard. Call
        <strong> +254&nbsp;768&nbsp;860&nbsp;665</strong> or use the enquiry form for a consultation.
      </Callout>
    </DeepDiveSection>
  );
}
