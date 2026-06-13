// ═══════════════════════════════════════════════════════════════════════════════
// SolarSizingEngineeringDeepDive — additive, server-rendered reference content for
// /solutions/solar-sizing. UNIQUE angle: the step-by-step sizing PROCEDURE with a full
// worked example (load → array → inverter DC/AC ratio → battery → cable volt-drop).
// Distinct from the /solar PV-physics deep-dive.
// ═══════════════════════════════════════════════════════════════════════════════

import {
  DeepDiveSection,
  DeepDiveBlock,
  FormulaBlock,
  SpecTable,
  Callout,
} from '@/components/content/EngineeringDeepDive';

export default function SolarSizingEngineeringDeepDive() {
  return (
    <DeepDiveSection
      id="solar-sizing-engineering"
      eyebrow="Engineering reference"
      title="Solar System Sizing: A Step-by-Step Worked Method"
      accent="emerald"
      intro="Sizing a solar system is a sequence, not a single sum: load first, then array, inverter, battery and cable — each step feeding the next. Here is the full method we follow, worked end-to-end with numbers, so you can see exactly how a system is engineered rather than guessed."
      sources={[
        'IEC 62548 — photovoltaic array design requirements.',
        'IEC 60364-7-712 — electrical installations: solar PV power supply systems.',
        'Inverter manufacturer DC/AC (array-to-inverter) ratio and MPPT window guidance.',
        'NASA POWER / Global Solar Atlas peak-sun-hours for Kenyan latitudes.',
        'Voltage-drop limits for PV DC and AC circuits (good-practice ≤ 1–3%).',
      ]}
    >
      <DeepDiveBlock heading="Step 1 — Profile the load (the foundation)" accent="emerald">
        <p>
          Everything downstream depends on one number done honestly: the <strong>daily energy demand in kWh</strong>, and how it
          splits between daytime (served directly by the array) and night (served from battery or grid). List each load, its
          power and its hours; an air-conditioner at 1.5&nbsp;kW for 8 hours is 12&nbsp;kWh, a 200&nbsp;W fridge running half the
          day is ~2.4&nbsp;kWh, and so on. Add a margin for the loads people forget and for growth.
        </p>
        <p>
          Working from &quot;how many panels fit on the roof&quot; instead of the load is the single most common cause of
          systems that disappoint — either oversized and wasteful, or undersized and unable to carry the afternoon. The load
          profile is the brief the whole design answers to.
        </p>
      </DeepDiveBlock>

      <FormulaBlock
        label="Step 2 — Array size from the load"
        expression="P_array (kWp) = E_daily ÷ (PSH × PR)"
        where={[
          ['E_daily', 'daily energy required (kWh)'],
          ['PSH', 'peak sun hours (≈5.5 across much of Kenya)'],
          ['PR', 'performance ratio (≈0.78 well-built)'],
        ]}
        example={<>A site using 30&nbsp;kWh/day at 5.5&nbsp;PSH, PR&nbsp;0.78 → 30 ÷ (5.5 × 0.78) ≈ <strong>7&nbsp;kWp</strong> ≈ 13 × 550&nbsp;W modules.</>}
        accent="emerald"
      />

      <DeepDiveBlock heading="Step 3 — Inverter sizing and the DC/AC ratio" accent="emerald">
        <p>
          The inverter is sized to the array, but deliberately a little <em>smaller</em> than the array&apos;s peak. Panels
          almost never hit their full STC rating in the field (heat, angle, soiling), so a sensible <strong>DC/AC ratio</strong>
          of about 1.1-1.3 means the inverter is well-utilised through more of the day, and the rare moments the array would
          exceed it are simply &quot;clipped&quot; — a tiny energy loss that is cheaper than buying a bigger inverter. The
          inverter&apos;s MPPT voltage window must also bracket the string voltage at both temperature extremes (see Step 5).
        </p>
        <p>
          For hybrid and off-grid systems the inverter must additionally be rated for the <strong>peak load</strong> and the
          <strong> surge</strong> of motor starts (fridge compressors, pumps), not just the average — a 5&nbsp;kW continuous
          inverter may need to swallow a 10&nbsp;kW momentary surge. Get this wrong and the inverter trips every time the borehole
          pump kicks in.
        </p>
      </DeepDiveBlock>

      <FormulaBlock
        label="DC/AC (array-to-inverter) ratio"
        expression="DC/AC = P_array(kWp) ÷ P_inverter(kW)   (typical 1.1–1.3)"
        where={[
          ['P_array', 'installed panel capacity (kWp)'],
          ['P_inverter', 'inverter AC rating (kW)'],
        ]}
        example={<>A 7&nbsp;kWp array on a 5.5&nbsp;kW inverter → DC/AC ≈ 1.27 — a good utilisation with negligible clipping in Kenyan irradiance.</>}
        accent="emerald"
      />

      <FormulaBlock
        label="Step 4 — Battery (where night/backup is needed)"
        expression="C (kWh) = (E_night × Days) ÷ (DoD × η)"
        where={[
          ['E_night', 'energy served from battery (kWh)'],
          ['Days', 'days of autonomy'],
          ['DoD', 'usable depth of discharge (0.9 LiFePO₄)'],
          ['η', 'round-trip × inverter efficiency (≈0.85)'],
        ]}
        example={<>15&nbsp;kWh overnight, 1 day autonomy, LiFePO₄: 15 ÷ (0.9 × 0.85) ≈ <strong>20&nbsp;kWh</strong> installed battery.</>}
        accent="emerald"
      />

      <DeepDiveBlock heading="Step 5 — String voltage and the charge controller" accent="emerald">
        <p>
          Panels are wired in series into <strong>strings</strong> whose voltage must stay inside the inverter or charge
          controller&apos;s MPPT window across the temperature range. This is the step that quietly destroys inverters or starves
          them of harvest: a cold Kenyan highland dawn pushes a string&apos;s open-circuit voltage <em>up</em> (potentially past
          the inverter&apos;s maximum), while a hot afternoon pulls operating voltage <em>down</em> (potentially below the MPPT
          window, so it under-harvests). Both extremes must be checked, not just the nameplate.
        </p>
        <p>
          On battery systems, the charge controller must be MPPT (not PWM) on anything beyond the smallest installation, and
          rated for the array current with margin. Matching string design to the controller&apos;s window is unglamorous and is
          exactly where amateur installs go wrong.
        </p>
      </DeepDiveBlock>

      <FormulaBlock
        label="Step 6 — Cable sizing by voltage drop"
        expression="%Vdrop = (2 × L × I × R) ÷ V × 100   (keep DC ≤ ~1–2%)"
        where={[
          ['L', 'one-way cable length (m)'],
          ['I', 'current (A)'],
          ['R', 'cable resistance per metre (Ω/m)'],
          ['V', 'system voltage'],
        ]}
        example={<>Long DC runs on undersized cable bleed away harvest as heat. Size the conductor so DC volt-drop stays ≤ ~2% — a yield leak you never see on a spec sheet otherwise.</>}
        accent="emerald"
      />

      <SpecTable
        caption="The sizing sequence at a glance"
        accent="emerald"
        highlightCol={0}
        headers={['Step', 'You compute', 'Key input']}
        rows={[
          ['1. Load', 'Daily kWh, day/night split', 'Equipment list + hours'],
          ['2. Array', 'kWp of panels', 'Load, PSH, PR'],
          ['3. Inverter', 'AC kW + DC/AC ratio', 'Array kWp, peak/surge load'],
          ['4. Battery', 'Usable kWh', 'Night energy, autonomy, DoD'],
          ['5. Strings/MPPT', 'Panels in series', 'Temp-extreme voltages'],
          ['6. Cable', 'Conductor size', 'Length, current, %Vdrop'],
        ]}
      />

      <Callout title="Get your system sized properly" accent="emerald">
        Send us your daily kWh (or 12 months of bills), your day/night usage split and your location, and we will return a full
        sized design — array, inverter, battery, string layout and cable — with the assumptions shown. Call
        <strong> +254&nbsp;768&nbsp;860&nbsp;665</strong> or <strong>+254&nbsp;782&nbsp;914&nbsp;717</strong>.
      </Callout>
    </DeepDiveSection>
  );
}
