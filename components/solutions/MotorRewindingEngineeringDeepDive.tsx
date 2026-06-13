// ═══════════════════════════════════════════════════════════════════════════════
// MotorRewindingEngineeringDeepDive — additive, server-rendered reference content
// for the motor-rewinding page. UNIQUE topics: winding failure modes, insulation
// classes & thermal life, rewind-vs-replace economics, the efficiency penalty of a
// poor rewind, and the electrical tests that prove a job is good.
// ═══════════════════════════════════════════════════════════════════════════════

import {
  DeepDiveSection,
  DeepDiveBlock,
  FormulaBlock,
  SpecTable,
  Callout,
} from '@/components/content/EngineeringDeepDive';

export default function MotorRewindingEngineeringDeepDive() {
  return (
    <DeepDiveSection
      id="motor-rewinding-engineering"
      eyebrow="Engineering reference"
      title="Motor Rewinding Engineering: Failure, Insulation & the Efficiency You Keep"
      accent="rose"
      intro="Electric motors consume the majority of industrial electricity, so a rewound motor that loses two points of efficiency quietly costs more in power than the rewind ever saved. This is how a rewind is engineered — not just re-wired — so the motor comes back as good as it left the factory."
      sources={[
        'IEC 60034-1 — Rotating electrical machines: rating and performance.',
        'IEC 60085 / NEMA MG-1 — Insulation thermal classification (B, F, H).',
        'EASA/AEMT rewind study — measured efficiency impact of repair practice.',
        'IEEE 43 — insulation resistance and polarization index testing.',
        'ISO 10816 / 20816 — mechanical vibration evaluation of machines.',
      ]}
    >
      {/* 1 ── Failure modes */}
      <DeepDiveBlock heading="1. Why windings fail — read the burn before you rewind" accent="rose">
        <p>
          A burnt-out motor is a forensic document. The pattern of the failure tells you what killed it, and a shop that simply
          rewinds without diagnosing will hand back a motor that fails the same way again. A <strong>single-phasing</strong>
          failure — one supply phase lost — cooks two of the three phase groups symmetrically while sparing the third. A
          <strong> turn-to-turn short</strong> burns a localised spot from insulation that finally gave way. <strong>Bearing
          failure</strong> shows as a rotor rubbing the stator (a swirl of damage), and <strong>overload</strong> evenly
          darkens the whole winding from sustained over-temperature.
        </p>
        <p>
          The repair therefore starts with the cause: a single-phasing burn points to a protection or supply fault that must be
          fixed, or the new winding dies too; even overheating points to overloading, poor ventilation or a clogged cooling
          path. We log the as-found condition, the resistance balance and the failure signature before a single coil comes out —
          because the rewind is the easy part, and preventing the repeat is the value.
        </p>
      </DeepDiveBlock>

      <SpecTable
        caption="Common winding failure signatures"
        accent="rose"
        highlightCol={0}
        headers={['Pattern', 'Likely cause', 'What to fix first']}
        rows={[
          ['Two phase groups burnt, one clean', 'Single-phasing (lost phase)', 'Protection, contactor, supply'],
          ['Localised spot burn', 'Turn-to-turn insulation breakdown', 'Surge/winding quality, moisture'],
          ['Even, all-over darkening', 'Sustained overload / over-temp', 'Load, ventilation, sizing'],
          ['Symmetrical at coil ends', 'Voltage stress / VFD reflections', 'Inverter cable, dV/dt filters'],
          ['Rotor rub / mechanical scoring', 'Bearing failure, misalignment', 'Bearings, alignment, balance'],
        ]}
      />

      {/* 2 ── Insulation class & thermal life */}
      <DeepDiveBlock heading="2. Insulation class and the 10-degree rule" accent="rose">
        <p>
          A motor&apos;s life is, to a first approximation, the life of its insulation — and insulation ages with heat. Windings
          are built to a thermal class (B, F or H) defining the maximum temperature the insulation tolerates continuously. The
          governing rule of thumb is brutal in its simplicity: <strong>every 8–10&nbsp;°C of sustained over-temperature roughly
          halves the insulation life</strong>. A motor run 20&nbsp;°C hot does not lose a little life — it loses most of it.
        </p>
        <p>
          A quality rewind therefore matches or upgrades the insulation system (we routinely rewind to Class&nbsp;F or H with
          modern enamel and resin), uses the correct slot fill, and cures the varnish properly so the winding resists moisture,
          vibration and the voltage spikes that VFDs throw at it. Using a lower-grade wire or skipping the vacuum-pressure
          impregnation saves the shop money and costs the owner years of motor life — invisible at handover, expensive later.
        </p>
      </DeepDiveBlock>

      <FormulaBlock
        label="Insulation life vs temperature (Arrhenius rule of thumb)"
        expression="L ≈ L₀ × 2^[(T_rated − T_actual) ÷ 10]"
        where={[
          ['L', 'expected insulation life'],
          ['L₀', 'rated life at rated temperature'],
          ['T_rated', 'insulation class limit (°C)'],
          ['T_actual', 'actual operating temperature'],
        ]}
        example={<>Run a Class&nbsp;F winding 10&nbsp;°C over its limit and expected life roughly halves; 20&nbsp;°C over and it falls to about a quarter.</>}
        accent="rose"
      />

      {/* 3 ── Efficiency penalty */}
      <DeepDiveBlock heading="3. The hidden efficiency penalty of a careless rewind" accent="rose">
        <p>
          The most expensive mistake in motor repair is invisible: a rewind that returns the motor one or two efficiency points
          lower than new. The classic culprit is the burn-out oven running too hot when stripping the old winding, which damages
          the inter-laminar insulation of the stator core and increases iron losses. Add a slightly different wire gauge, turns
          count or coil pitch and you have a motor that runs hotter and draws more power for the same shaft output — forever.
        </p>
        <p>
          Because motors are such large energy consumers, that small loss dwarfs the repair cost over the motor&apos;s remaining
          life. A 75&nbsp;kW motor running continuously, dropped from 94% to 92% efficiency, wastes roughly an extra
          13,000&nbsp;kWh a year — at commercial tariffs, far more than the rewind. Good practice (controlled core stripping,
          a core-loss test before and after, exact-replica winding data) preserves the efficiency. We treat the core-loss test
          as non-negotiable, because it is the only honest proof the core survived the strip.
        </p>
      </DeepDiveBlock>

      <FormulaBlock
        label="Annual cost of lost efficiency"
        expression="ΔCost = P_out × H × (1/η₂ − 1/η₁) × Tariff"
        where={[
          ['P_out', 'shaft power (kW)'],
          ['H', 'annual running hours'],
          ['η₁, η₂', 'efficiency before and after rewind'],
          ['Tariff', 'cost per kWh'],
        ]}
        example={<>75&nbsp;kW, 8,000&nbsp;h, 94%→92%: 75 × 8000 × (1/0.92 − 1/0.94) ≈ 13,900&nbsp;kWh/yr extra — a recurring loss that can exceed the rewind price every single year.</>}
        accent="rose"
      />

      {/* 4 ── Rewind vs replace */}
      <DeepDiveBlock heading="4. Rewind or replace? The honest decision" accent="rose">
        <p>
          There is a defensible line between repairing and replacing, and a trustworthy shop will tell you which side you are on.
          For larger motors (roughly above 30–40&nbsp;kW), a quality rewind that preserves efficiency is almost always cheaper
          over the life than a new motor, and far quicker than a long import lead time. For small, mass-produced motors the
          economics can flip — the cost of a careful rewind approaches the price of a new, possibly higher-efficiency unit.
        </p>
        <p>
          The variables are the rewind quality (does it keep the efficiency?), the price and lead time of an equivalent new
          motor, the running hours (which amplify any efficiency gap), and the criticality of getting the machine back. We put
          all four in front of the client rather than defaulting to the option that suits the workshop — because the right
          answer for a continuously-run 90&nbsp;kW process motor is rarely the right answer for a spare 4&nbsp;kW fan.
        </p>
      </DeepDiveBlock>

      {/* 5 ── Testing */}
      <DeepDiveBlock heading="5. The tests that prove a rewind — not just a re-wire" accent="rose">
        <p>
          A finished rewind is only as good as the tests it passes, and the meaningful ones go well beyond &quot;it spins.&quot;
          <strong> Insulation resistance (IR)</strong> and the <strong>polarization index (PI)</strong> — the ratio of the
          10-minute to the 1-minute IR reading — reveal whether the winding is clean and dry or contaminated and damp. A
          <strong> surge comparison test</strong> stresses turn-to-turn insulation that a simple megger cannot see, catching the
          weak coil before it fails in service. A <strong>core-loss test</strong> confirms the stripping process did not damage
          the core.
        </p>
        <p>
          We finish with mechanical truth: bearings replaced as a matter of course, the rotor dynamically balanced, alignment
          checked, and a <strong>vibration baseline</strong> taken to ISO&nbsp;10816 so the customer has a reference for future
          condition monitoring. A documented test sheet handed over with the motor is the difference between a repair you can
          trust and one you simply hope worked.
        </p>
      </DeepDiveBlock>

      <SpecTable
        caption="Acceptance tests we run on every rewind"
        accent="rose"
        headers={['Test', 'What it proves', 'Healthy result']}
        rows={[
          ['Insulation resistance (IR)', 'Winding cleanliness / dryness', '≥ 100 MΩ (rule: 1 MΩ/kV + 1)'],
          ['Polarization index (PI)', 'Moisture / contamination', '≥ 2.0'],
          ['Surge comparison', 'Turn-to-turn insulation', 'Matched waveforms, no shift'],
          ['Core loss', 'Core damage from stripping', 'Within pre-strip baseline'],
          ['Vibration (ISO 10816)', 'Balance / bearing / alignment', 'Within zone A/B'],
        ]}
      />

      <Callout title="Send us the motor — and the symptoms" accent="rose">
        Tell us the motor rating, the duty and how it failed, and we&apos;ll diagnose the cause, quote a quality rewind (Grade-A
        copper, Class F/H, full test sheet) and advise honestly whether rewind or replace wins on your running hours. Free
        collection in Nairobi for motors above 5&nbsp;HP. Call <strong>+254&nbsp;768&nbsp;860&nbsp;665</strong>.
      </Callout>
    </DeepDiveSection>
  );
}
