// ═══════════════════════════════════════════════════════════════════════════════
// IncineratorEngineeringDeepDive — additive, server-rendered reference content for
// the incinerators page. UNIQUE topics: the three T's of combustion, dual-chamber
// design & residence time, emissions control, burn-rate sizing, and compliance.
// ═══════════════════════════════════════════════════════════════════════════════

import {
  DeepDiveSection,
  DeepDiveBlock,
  FormulaBlock,
  SpecTable,
  Callout,
} from '@/components/content/EngineeringDeepDive';

export default function IncineratorEngineeringDeepDive() {
  return (
    <DeepDiveSection
      id="incinerator-engineering"
      eyebrow="Engineering reference"
      title="Incinerator Engineering: Combustion, Emissions & Compliance in Kenya"
      accent="rose"
      intro="A medical-waste incinerator either destroys pathogens and toxins cleanly or it becomes a pollution source worse than the waste it burns. The line between the two is combustion engineering — temperature, time and turbulence — and the emissions control that follows. This is how a compliant incinerator actually works."
      sources={[
        'WHO guidance on health-care waste management and incineration.',
        'NEMA Kenya — Environmental Management and Co-ordination (Waste Management) Regulations and emission limits.',
        'EU Directive 2000/76/EC / IED — 850 °C / 1100 °C secondary-chamber and 2-second residence benchmarks.',
        'Stockholm Convention — dioxin and furan (POPs) formation and control.',
        'Combustion engineering references — the “three T’s” and air-fuel stoichiometry.',
      ]}
    >
      {/* 1 ── Three Ts */}
      <DeepDiveBlock heading="1. The three T's: temperature, time and turbulence" accent="rose">
        <p>
          Complete combustion — the kind that destroys pathogens and breaks down toxic organics rather than just charring them —
          depends on three conditions working together, the <strong>three T&apos;s</strong>. <strong>Temperature</strong> high
          enough to break the chemical bonds; <strong>time</strong> enough at that temperature for the reactions to finish
          (residence time); and <strong>turbulence</strong> to mix the combustion gases thoroughly with air so no pocket escapes
          unburnt. Drop any one and you get incomplete combustion: smoke, odour, char and — most dangerously — the formation of
          dioxins.
        </p>
        <p>
          This is why a cheap single-chamber burner that simply &quot;burns the waste&quot; is not an incinerator in any
          meaningful sense. It reaches neither the temperature nor the residence time to destroy what matters, and it vents the
          result over the neighbourhood. A real incinerator engineers all three T&apos;s deliberately, and proves them with
          temperature monitoring rather than hoping for them.
        </p>
      </DeepDiveBlock>

      {/* 2 ── Dual chamber */}
      <DeepDiveBlock heading="2. Why two chambers, and the 850/1100 °C rule" accent="rose">
        <p>
          Compliant incinerators are <strong>dual-chamber</strong> by design. The <strong>primary chamber</strong> burns the
          waste at around 800–900&nbsp;°C in a controlled, slightly air-starved condition, gasifying it into combustible gases.
          Those gases then pass to the <strong>secondary chamber</strong>, where excess air and a burner hold them at
          <strong> at least 850&nbsp;°C — and 1,100&nbsp;°C for hazardous and high-chlorine waste — for a residence time of
          around two seconds</strong>. That second stage is where the actual destruction of organics and odour happens; the
          internationally accepted benchmark of 850&nbsp;°C/2&nbsp;s (1,100&nbsp;°C for the worst waste) exists precisely because
          it is what reliably breaks down dioxin precursors.
        </p>
        <p>
          Residence time is a volume calculation, not a guess: the secondary chamber must be large enough that the gas flowing
          through it at temperature actually spends two seconds inside. Undersize the chamber or over-fire the unit and the gas
          races through in a fraction of that, unburnt. We size the secondary chamber to the gas flow so the residence time is
          real, and fit the auxiliary burner that guarantees the temperature even when the waste itself burns cool.
        </p>
      </DeepDiveBlock>

      <FormulaBlock
        label="Secondary chamber residence time"
        expression="t = V_chamber ÷ Q_gas     (target t ≥ 2 s at ≥ 850 °C)"
        where={[
          ['t', 'gas residence time (s)'],
          ['V_chamber', 'effective secondary-chamber volume (m³)'],
          ['Q_gas', 'flue-gas volumetric flow at temperature (m³/s)'],
        ]}
        example={<>If the hot flue-gas flow is 0.4&nbsp;m³/s, the secondary chamber must hold at least 0.4 × 2 = <strong>0.8&nbsp;m³</strong> of effective volume to achieve the 2-second benchmark.</>}
        accent="rose"
      />

      {/* 3 ── Burn rate sizing */}
      <DeepDiveBlock heading="3. Sizing by burn rate and waste calorific value" accent="rose">
        <p>
          An incinerator is rated by its <strong>burn rate</strong> — kilograms of waste per hour — and matching it to the
          facility&apos;s waste arising is the first sizing decision. Undersize it and waste piles up unsafely between burns;
          grossly oversize it and it runs inefficiently and costs more in auxiliary fuel. The burn rate interacts with the
          waste&apos;s <strong>calorific value</strong>: dry packaging burns hot and supports itself, while wet pathological
          waste and bodily fluids absorb heat and need auxiliary fuel to keep the chambers at temperature.
        </p>
        <p>
          So the design accounts for the real waste mix — its moisture, its calorific value and its peak daily mass — and sizes
          the chambers, the burners and the auxiliary fuel system accordingly. A hospital generating a steady stream of mixed
          clinical waste has very different needs from an abattoir or a quarantine facility, and a one-size unit serves neither
          well. We size to the waste audit, not to a brochure model number.
        </p>
      </DeepDiveBlock>

      <SpecTable
        caption="Indicative incinerator sizing by facility (confirm by waste audit)"
        accent="rose"
        highlightCol={1}
        headers={['Facility', 'Typical burn rate', 'Notes']}
        rows={[
          ['Clinic / health centre', '10–25 kg/h', 'Batch burns, dual-chamber essential'],
          ['District / county hospital', '25–50 kg/h', 'Daily operation, auxiliary burner'],
          ['Referral / regional hub', '50–150 kg/h', 'Continuous duty, heat-recovery option'],
          ['Abattoir / agri', 'Varies (wet waste)', 'High moisture → more auxiliary fuel'],
        ]}
      />

      {/* 4 ── Emissions */}
      <DeepDiveBlock heading="4. Emissions control: dioxins, particulates and the quench" accent="rose">
        <p>
          The most insidious emission is the family of <strong>dioxins and furans</strong> — persistent, toxic organic compounds
          that re-form in a specific temperature window (roughly 200–450&nbsp;°C) as the flue gas cools, especially when chlorine
          is present. The defence is twofold: destroy them completely in the hot secondary chamber, then cool the flue gas
          <strong> rapidly through the re-formation window</strong> (a quench) so they have no time to re-assemble. A unit that
          lets the gas linger while cooling can manufacture dioxins it had already destroyed.
        </p>
        <p>
          Particulate matter and acid gases are handled by the gas-cleaning train — cyclones, scrubbers or bag filters depending
          on the scale and the regulatory limit. NEMA sets emission limits that a compliant installation must meet and monitor,
          and a stack that simply vents untreated combustion products is both illegal and a genuine public-health hazard. We
          design the cooling and gas-cleaning to the waste and the limit, because destroying the pathogen is only half the job
          if the chimney then poisons the air.
        </p>
      </DeepDiveBlock>

      {/* 5 ── Compliance */}
      <DeepDiveBlock heading="5. Compliance, siting and operating discipline" accent="rose">
        <p>
          A compliant incinerator is a system of equipment <em>and</em> operation. NEMA licensing, an environmental impact
          assessment, a stack height and siting that respect surrounding receptors, temperature logging that proves the
          secondary chamber held 850&nbsp;°C, trained operators who load correctly and do not over-fire, and a maintenance
          regime for refractory, burners and gas-cleaning — all of these are part of being lawful, not optional extras.
        </p>
        <p>
          The commonest failure we are called to fix is a unit that was sold cheap, under-engineered on residence time and
          gas-cleaning, and now cannot meet its limits or has cracked its refractory through thermal shock. Doing it right the
          first time — correct chambers, real residence time, proper quench and cleaning, and an operator who understands the
          three T&apos;s — is far cheaper than rebuilding a non-compliant unit under a NEMA notice. We deliver the equipment, the
          compliance documentation and the operator training together.
        </p>
      </DeepDiveBlock>

      <Callout title="Specify a compliant incinerator" accent="rose">
        Tell us your waste type, daily mass and facility, and we&apos;ll return a burn-rate sizing, a dual-chamber design that
        meets the 850/1100&nbsp;°C residence benchmark, an emissions-control train for NEMA limits, and the licensing support.
        Call <strong>+254&nbsp;768&nbsp;860&nbsp;665</strong> or use the enquiry form.
      </Callout>
    </DeepDiveSection>
  );
}
