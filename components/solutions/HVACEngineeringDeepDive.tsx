// ═══════════════════════════════════════════════════════════════════════════════
// HVACEngineeringDeepDive — additive, server-rendered reference content for the AC/
// HVAC page. UNIQUE topics: cooling-load calculation, the oversizing trap, refrigerant
// phase-down, efficiency metrics (EER/SEER/COP) and system architecture choice.
// ═══════════════════════════════════════════════════════════════════════════════

import {
  DeepDiveSection,
  DeepDiveBlock,
  FormulaBlock,
  SpecTable,
  Callout,
} from '@/components/content/EngineeringDeepDive';

export default function HVACEngineeringDeepDive() {
  return (
    <DeepDiveSection
      id="hvac-engineering"
      eyebrow="Engineering reference"
      title="HVAC Engineering: Cooling Loads, Refrigerants & Efficiency in Kenya"
      accent="sky"
      intro="Air-conditioning is sized by physics, not by floor area or guesswork — and the units that fail early in Kenya are almost always the ones that were guessed. This is how a cooling load is actually calculated, why bigger is worse, and what the refrigerant phase-down means for equipment you buy today."
      sources={[
        'ASHRAE Fundamentals Handbook — cooling load calculation and psychrometrics.',
        'ASHRAE 62.1 — ventilation for acceptable indoor air quality.',
        'Kigali Amendment to the Montreal Protocol — HFC phase-down (Kenya is a party).',
        'ISO 5151 / AHRI 210/240 — rating of air-conditioner performance (EER/SEER/COP).',
        'Manufacturer VRF/chiller selection data and refrigerant safety classifications (ASHRAE 34).',
      ]}
    >
      {/* 1 ── Cooling load */}
      <DeepDiveBlock heading="1. The cooling load: sensible heat, latent heat and why area is a lie" accent="sky">
        <p>
          The job of an air-conditioner is to remove heat at the rate the space gains it, and that rate has two parts.
          <strong> Sensible heat</strong> is the energy that changes air temperature — from the sun through glass, the people,
          the lights, the computers, the hot outside air leaking in. <strong>Latent heat</strong> is the energy needed to remove
          moisture — from occupants, from open doors, from the humid coastal air. A unit sized for sensible heat alone leaves a
          space cold and clammy, which is why &quot;so many BTU per square metre&quot; rules of thumb produce so many
          uncomfortable, under-dehumidified rooms.
        </p>
        <p>
          A proper load calculation totals every gain — fabric, solar, occupancy, equipment, lighting, fresh-air ventilation —
          for the worst design hour, then sizes the equipment to that. In Kenya the design conditions swing from the dry highland
          cool of Nairobi to the humid heat of Mombasa, so the same room needs a different machine in each city. We calculate
          rather than guess, because every assumption made with a thumb is paid for daily in either discomfort or wasted power.
        </p>
      </DeepDiveBlock>

      <FormulaBlock
        label="Total cooling load"
        expression="Q_total = Q_sensible + Q_latent     (1 ton = 3.517 kW = 12,000 BTU/h)"
        where={[
          ['Q_sensible', 'heat that changes air temperature'],
          ['Q_latent', 'heat to remove moisture (humidity)'],
          ['1 TR', 'one ton of refrigeration ≈ 3.517 kW'],
        ]}
        example={<>A naïve &quot;area&quot; estimate ignores latent load and solar orientation; a west-facing glazed boardroom in Mombasa can need double the cooling of an identical north-facing room in Nairobi.</>}
        accent="sky"
      />

      {/* 2 ── Oversizing trap */}
      <DeepDiveBlock heading="2. The oversizing trap: bigger is worse" accent="sky">
        <p>
          The instinct to &quot;buy a size up to be safe&quot; is precisely wrong for air-conditioning. An oversized unit cools
          the air to the thermostat setpoint so fast that it switches off before it has run long enough to <strong>dehumidify</strong>
          — so it <strong>short-cycles</strong>, leaving the room cold but damp and sticky, while the compressor wears out from
          constant stop-start. It also costs more to buy and run, and it controls temperature poorly because it is always
          slamming between full output and off.
        </p>
        <p>
          The modern answer is the <strong>inverter (variable-speed) compressor</strong>, which modulates its output to match
          the load instead of cycling, holding both temperature and humidity steady while drawing far less energy at part load —
          where the system spends almost all its life. A correctly sized inverter system beats an oversized fixed-speed one on
          comfort, electricity bill and lifespan, all at once.
        </p>
      </DeepDiveBlock>

      {/* 3 ── Refrigerants */}
      <DeepDiveBlock heading="3. Refrigerants: the phase-down you are buying into" accent="sky">
        <p>
          The refrigerant inside the system is now a regulatory decision as much as a technical one. Under the Kigali Amendment,
          which Kenya has joined, high global-warming-potential (GWP) HFCs are being phased down. The old <strong>R410A</strong>
          (GWP ~2,088) is giving way to lower-GWP options like <strong>R32</strong> (GWP ~675) and, in some equipment, natural
          refrigerants such as <strong>R290</strong> (propane, GWP ~3, but flammable and tightly charge-limited). Buying R410A
          equipment today is buying into a refrigerant whose supply and price will only worsen over the machine&apos;s life.
        </p>
        <p>
          The trade-off matters: lower-GWP refrigerants are often mildly flammable (ASHRAE class A2L) or flammable (A3), which
          drives charge limits, room-size rules and installer competence requirements. We specify refrigerant with the phase-down
          and the safety classification in mind, so the system is both legal and serviceable for its full life — not stranded in
          five years when the gas becomes scarce.
        </p>
      </DeepDiveBlock>

      <SpecTable
        caption="Refrigerant transition (typical comfort cooling)"
        accent="sky"
        highlightCol={0}
        headers={['Refrigerant', 'GWP', 'Safety class', 'Status']}
        rows={[
          ['R22 (HCFC)', '~1,810', 'A1', 'Phased out — service only'],
          ['R410A', '~2,088', 'A1', 'Being phased down'],
          ['R32', '~675', 'A2L (mild flam.)', 'Current mainstream'],
          ['R290 (propane)', '~3', 'A3 (flammable)', 'Growing, charge-limited'],
        ]}
      />

      {/* 4 ── Efficiency metrics */}
      <DeepDiveBlock heading="4. EER, SEER and COP — reading the efficiency honestly" accent="sky">
        <p>
          Air-conditioners are rated by how much cooling they deliver per unit of electricity consumed. <strong>EER</strong> is
          that ratio at a single rated condition; <strong>SEER</strong> is a seasonal average that rewards good part-load
          behaviour (which is why inverter units score well); and <strong>COP</strong> is the same idea expressed as a pure ratio
          of cooling output to electrical input. A unit with an EER of 3.5 delivers 3.5&nbsp;kW of cooling for every 1&nbsp;kW of
          power — the rest is &quot;free&quot; heat moved rather than generated.
        </p>
        <p>
          Because cooling is often a building&apos;s single largest electrical load, the gap between a cheap low-EER unit and an
          efficient one repays the price difference quickly. We size first, then choose the highest sensible efficiency for the
          duty, and on solar-equipped sites we time the cooling to the array&apos;s daytime output — the cheapest cooling is the
          cooling run on your own solar power.
        </p>
      </DeepDiveBlock>

      <FormulaBlock
        label="Efficiency and running cost"
        expression="EER = Q_cooling ÷ P_input      Annual cost = (Q ÷ EER) × hours × tariff"
        where={[
          ['Q_cooling', 'cooling delivered (kW)'],
          ['P_input', 'electrical power drawn (kW)'],
          ['EER / COP', 'higher is better — kW cooling per kW power'],
        ]}
        example={<>Raising EER from 2.8 to 3.6 on a 10&nbsp;kW cooling load cuts input from 3.57&nbsp;kW to 2.78&nbsp;kW — about 22% off the cooling bill, every hour it runs.</>}
        accent="sky"
      />

      {/* 5 ── System architecture */}
      <DeepDiveBlock heading="5. Split, VRF or chilled water — matching the system to the building" accent="sky">
        <p>
          The architecture follows the building. <strong>Split and multi-split</strong> units suit single rooms and small
          offices — simple, cheap, independently controlled. <strong>VRF/VRV</strong> (variable refrigerant flow) shines in
          medium-to-large commercial buildings with many zones of differing load, moving refrigerant to dozens of indoor units
          from a compact outdoor plant and even shifting heat from a sunny side to a shaded one. <strong>Chilled-water</strong>
          systems with central chillers and air-handling units are the workhorse of large buildings, hospitals and industry,
          where their capacity and water-side flexibility outweigh their complexity.
        </p>
        <p>
          The decision weighs zoning needs, building size, maintenance access and the cost of downtime — a hospital theatre and
          a four-room SACCO office have nothing in common but the word &quot;air-conditioning.&quot; We design ventilation
          (fresh-air rates to ASHRAE&nbsp;62.1) and filtration into the same plan, because comfort without adequate fresh air is
          just recirculated staleness, and indoor air quality is part of the brief whether or not it appears in it.
        </p>
      </DeepDiveBlock>

      <Callout title="Get a calculated cooling design" accent="sky">
        Send us the floor plans, glazing, occupancy and city, and we&apos;ll return a calculated cooling load, an equipment
        selection with EER/refrigerant, and a system architecture sized for comfort and the lowest running cost — not a guess.
        Call <strong>+254&nbsp;768&nbsp;860&nbsp;665</strong> or use the enquiry form.
      </Callout>
    </DeepDiveSection>
  );
}
