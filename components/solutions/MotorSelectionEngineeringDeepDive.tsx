// ═══════════════════════════════════════════════════════════════════════════════
// MotorSelectionEngineeringDeepDive — additive, server-rendered reference content for
// /solutions/motors. UNIQUE angle: selecting, driving and PROTECTING motors (efficiency
// classes, starting methods, VFDs & affinity laws, protection) — distinct from the
// motor-REWINDING (repair) deep-dive.
// ═══════════════════════════════════════════════════════════════════════════════

import {
  DeepDiveSection,
  DeepDiveBlock,
  FormulaBlock,
  SpecTable,
  Callout,
} from '@/components/content/EngineeringDeepDive';

export default function MotorSelectionEngineeringDeepDive() {
  return (
    <DeepDiveSection
      id="motor-selection-engineering"
      eyebrow="Engineering reference"
      title="Electric Motors: Selection, Efficiency Classes, Starting & Protection"
      accent="sky"
      intro="Electric motors quietly consume the majority of industrial electricity, so the choices around them — efficiency class, how you start them, how you drive them and how you protect them — decide both your power bill and your downtime. This is the engineering behind specifying a motor that lasts and runs cheaply."
      sources={[
        'IEC 60034-30-1 — efficiency classes (IE1–IE4) for line-operated AC motors.',
        'IEC 60034-1 — duty types (S1–S9), rating and service factor.',
        'Affinity laws — pump/fan power vs speed for variable-speed drives.',
        'IEC 60947-4-1 — motor starters and protection coordination.',
        'Manufacturer inverter-duty insulation and bearing-current guidance (dV/dt).',
      ]}
    >
      <DeepDiveBlock heading="1. Size and duty before brand" accent="sky">
        <p>
          A motor is specified to a <strong>rated power, a duty type and a service factor</strong> — not just a kW number. The
          duty type (IEC&nbsp;60034 S1 continuous through S8 intermittent) describes how the load actually behaves over time; a
          motor sized for continuous duty is wasteful on a load that runs in short bursts, and one sized for bursts overheats on
          continuous duty. The <strong>service factor</strong> is the short-term overload the motor can tolerate without damage —
          useful headroom, not a licence to run permanently above rating.
        </p>
        <p>
          As with generators, oversizing is not safety — it is waste. An oversized motor runs at a low load factor where its
          power factor and efficiency both fall, drawing more reactive current and costing more to run for the same useful work.
          The right answer is the motor matched to the real shaft load with sensible margin, chosen against the duty it will
          actually see.
        </p>
      </DeepDiveBlock>

      <DeepDiveBlock heading="2. Efficiency classes (IE2/IE3/IE4): the bill, not the badge" accent="sky">
        <p>
          Because a motor often runs thousands of hours a year, its <strong>efficiency class (IEC&nbsp;60034-30-1: IE1 to
          IE4)</strong> dominates its lifetime cost. The purchase price is a small fraction of what a continuously-run motor
          spends on electricity over its life, so a higher-efficiency motor that costs more upfront is usually far cheaper to
          own. The difference between an old IE1 and a modern IE3/IE4 motor of the same rating is real money, every hour, for
          fifteen years.
        </p>
        <p>
          We weigh the efficiency class against the running hours: for a motor that runs continuously, IE3 or IE4 almost always
          wins on total cost; for a rarely-used standby motor the case is weaker. The point is to make the decision on lifetime
          energy, not sticker price — the same discipline we apply to generators and transformers.
        </p>
      </DeepDiveBlock>

      <SpecTable
        caption="IEC 60034-30-1 efficiency classes"
        accent="sky"
        highlightCol={0}
        headers={['Class', 'Level', 'Best for']}
        rows={[
          ['IE1', 'Standard', 'Legacy / phased out in many markets'],
          ['IE2', 'High', 'Light-duty, intermittent loads'],
          ['IE3', 'Premium', 'Continuous industrial duty (recommended)'],
          ['IE4', 'Super premium', 'High running hours, lowest lifetime cost'],
        ]}
      />

      <DeepDiveBlock heading="3. Starting methods: taming the inrush" accent="sky">
        <p>
          A direct-on-line (DOL) start pulls <strong>six to eight times full-load current</strong> for the first seconds, which
          stresses the supply (and, on a genset, can dictate the generator size). The starting method is chosen to manage that
          inrush against the mechanical needs of the load. <strong>Star-delta</strong> roughly cuts starting current and torque
          to a third — fine for loads that start unloaded. A <strong>soft starter</strong> ramps voltage to limit inrush to
          ~2-3× and reduce mechanical shock. A <strong>variable-frequency drive (VFD)</strong> ramps frequency and brings
          starting current near full-load level while giving full control of speed and torque.
        </p>
        <p>
          The correct choice depends on the load's torque demand at start, how often it starts, and the supply's tolerance for
          inrush. On borehole, HVAC and conveyor loads we routinely save a customer a generator frame size — or a tripping
          headache — simply by choosing the right starter rather than defaulting to DOL.
        </p>
      </DeepDiveBlock>

      <SpecTable
        caption="Motor starting methods compared"
        accent="sky"
        highlightCol={0}
        headers={['Method', 'Starting current', 'Use when']}
        rows={[
          ['Direct-on-line (DOL)', '6–8× FLC', 'Small motors, stiff supply'],
          ['Star-delta', '~2–3× FLC', 'Starts unloaded, moderate size'],
          ['Soft starter', '~2–3× FLC, smooth', 'Pumps, conveyors, reduce shock'],
          ['VFD', '~1–1.5× FLC, controlled', 'Variable speed, energy saving'],
        ]}
      />

      <DeepDiveBlock heading="4. VFDs and the affinity laws: where the big savings hide" accent="sky">
        <p>
          On pumps and fans, a VFD is not just a soft starter — it is an energy goldmine, because of the <strong>affinity
          laws</strong>: flow scales with speed, but <strong>power scales with the cube of speed</strong>. Run a fan at 80% speed
          and it draws roughly half the power; throttle the same fan with a damper at full speed and you waste the difference as
          heat. Replacing throttling/recirculation control with VFD speed control routinely cuts pump and fan energy by 30-50%.
        </p>
        <p>
          VFDs do demand respect, though. Their fast-switching output stresses winding insulation (dV/dt) and can drive
          circulating <strong>bearing currents</strong> that pit bearings, so inverter-duty motors, shielded cable and shaft
          grounding matter on serious installations. They also inject harmonics back into the supply (see our power-quality
          guidance). Done right, the energy saving dwarfs these costs; done carelessly, they shorten motor life.
        </p>
      </DeepDiveBlock>

      <FormulaBlock
        label="Affinity laws (pumps & fans)"
        expression="Q₂/Q₁ = N₂/N₁     P₂/P₁ = (N₂/N₁)³"
        where={[
          ['Q', 'flow rate'],
          ['N', 'speed (rpm or Hz)'],
          ['P', 'shaft power'],
        ]}
        example={<>Drop a fan from 100% to 80% speed: power ≈ (0.8)³ = 0.51 → about <strong>49% less energy</strong> for 80% of the flow. That cube law is why VFDs pay back so fast on variable flow.</>}
        accent="sky"
      />

      <DeepDiveBlock heading="5. Protection: what actually keeps a motor alive" accent="sky">
        <p>
          Most motor burnouts are preventable with correct protection, and the cheapest insurance on any motor is a properly set
          protection relay. The essentials: <strong>thermal overload</strong> (against sustained over-current), <strong>phase-failure
          / single-phasing protection</strong> (the classic killer — lose one phase and the remaining windings cook),
          <strong> phase-imbalance</strong> and <strong>earth-fault</strong> protection, and for critical machines, embedded
          <strong> thermistors (PTC)</strong> that sense actual winding temperature rather than inferring it from current.
        </p>
        <p>
          Protection only works if it is coordinated and correctly set — an overload set too high protects nothing, and one set
          too low nuisance-trips. We size and set protection to the motor and its starter, because the relay that saved the
          motor is invisible until the day it does. This is also why a rewound motor that fails again so often points back to a
          protection or supply fault that was never fixed.
        </p>
      </DeepDiveBlock>

      <Callout title="Specify motors that run cheaply and last" accent="sky">
        Tell us the driven load (pump, fan, conveyor, compressor), the duty and the running hours, and we will recommend the
        motor, efficiency class, starting method (or VFD with its energy saving) and the protection to match. Call
        <strong> +254&nbsp;768&nbsp;860&nbsp;665</strong> or <strong>+254&nbsp;782&nbsp;914&nbsp;717</strong>.
      </Callout>
    </DeepDiveSection>
  );
}
