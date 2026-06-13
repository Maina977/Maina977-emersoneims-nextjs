// ═══════════════════════════════════════════════════════════════════════════════
// SolarEngineeringDeepDive
//
// Reference-grade, additive technical content for /solar. Server-rendered.
// UNIQUE to this page — no overlap with the generator deep-dive. Covers PV
// physics, array sizing for Kenyan irradiance, temperature derating, battery
// autonomy & depth-of-discharge, MPPT vs PWM, and grid-tie vs hybrid economics.
// ═══════════════════════════════════════════════════════════════════════════════

import {
  DeepDiveSection,
  DeepDiveBlock,
  FormulaBlock,
  SpecTable,
  Callout,
  DataChart,
} from '@/components/content/EngineeringDeepDive';

export default function SolarEngineeringDeepDive() {
  return (
    <DeepDiveSection
      id="solar-engineering"
      eyebrow="Engineering reference"
      title="Solar PV Engineering: Sizing, Storage & Yield for Kenyan Sites"
      accent="emerald"
      intro="Kenya sits on the equator with some of the best solar resource on earth — and most systems here still under-perform their brochure. This is the maths we use to size arrays, batteries and inverters so the yield survives heat, dust and the real load curve of a Kenyan business."
      sources={[
        'NASA POWER / Global Solar Atlas — peak-sun-hours and irradiance data for Kenyan latitudes.',
        'IEC 61215 / IEC 61730 — PV module performance and safety qualification.',
        'IEC 62548 — Design requirements for photovoltaic arrays.',
        'EPRA Kenya net-metering regulations (Energy (Net-Metering) Regulations, 2024) and retail tariff schedules.',
        'Battery manufacturer cycle-life vs depth-of-discharge data (LiFePO₄ and lead-acid).',
      ]}
    >
      {/* 1 ── Peak sun hours & energy yield */}
      <DeepDiveBlock heading="1. Peak sun hours — the number that actually sizes the array" accent="emerald">
        <p>
          A solar panel&apos;s nameplate watt is measured under Standard Test Conditions (1,000&nbsp;W/m², 25&nbsp;°C cell
          temperature). What matters on a roof is how many hours per day the sun delivers that reference intensity —
          <strong> peak sun hours (PSH)</strong>. Most of Kenya enjoys <strong>5.0–6.0&nbsp;PSH</strong>, among the highest
          sustained figures anywhere, with the arid north (Turkana, Marsabit) higher still and the misty highlands lower.
          Daily energy is, to first order, simply array size × PSH × system efficiency.
        </p>
        <p>
          The catch is the <strong>performance ratio (PR)</strong> — the slice of theoretical yield you actually keep after
          inverter losses, wiring, soiling, heat and mismatch. A well-built system in Kenya runs a PR of about 0.75–0.80;
          a dusty, hot, badly-strung one can drop below 0.65. That gap is the difference between a system that pays back and
          one that disappoints, and it is decided at design and install, not at purchase.
        </p>
        <p>
          So sizing starts from the load, not the roof. Measure the daily energy demand in kWh, divide by PSH and PR, and you
          have the array size. Working from &quot;how many panels fit&quot; is how sites end up with arrays that look impressive
          and still fail to carry the afternoon chiller load.
        </p>
      </DeepDiveBlock>

      <FormulaBlock
        label="Array sizing from energy demand"
        expression="P_array (kWp) = E_daily ÷ (PSH × PR)"
        where={[
          ['E_daily', 'daily energy required (kWh)'],
          ['PSH', 'peak sun hours (≈5.5 for much of Kenya)'],
          ['PR', 'performance ratio (≈0.75–0.80 well-built)'],
        ]}
        example={<>A site using 60&nbsp;kWh/day at 5.5&nbsp;PSH and PR&nbsp;0.78 → 60 ÷ (5.5 × 0.78) ≈ <strong>14&nbsp;kWp</strong> of panels — roughly 26 × 550&nbsp;W modules.</>}
        accent="emerald"
      />

      <SpecTable
        caption="Indicative peak sun hours across Kenyan regions (annual daily average)"
        accent="emerald"
        highlightCol={1}
        headers={['Region', 'Peak sun hours', 'Notes']}
        rows={[
          ['Northern arid (Turkana, Marsabit)', '6.0–6.5', 'Highest resource; heat derating matters most'],
          ['Eastern / Coast (Mombasa, Kitui)', '5.5–6.0', 'High yield; humidity & salt at coast'],
          ['Rift Valley (Nakuru, Naivasha)', '5.5–5.8', 'Strong, stable resource'],
          ['Nairobi & central', '5.0–5.5', 'Good; July–Aug cloud dip'],
          ['Western highlands (Kisii, Kakamega)', '4.5–5.0', 'Cloudier; size up the array'],
        ]}
      />

      {/* 2 ── Temperature derating */}
      <DeepDiveBlock heading="2. Heat is the silent thief: temperature derating" accent="emerald">
        <p>
          Counter-intuitively, panels make less power as they get hotter — and on a Kenyan roof the cells routinely sit at
          55–65&nbsp;°C, far above the 25&nbsp;°C test condition. Crystalline silicon loses roughly
          <strong> 0.35–0.45% of its output per °C above 25&nbsp;°C</strong> (the module&apos;s temperature coefficient of
          power). At a 60&nbsp;°C cell temperature that is a real-world loss of around 12–16% off the nameplate, every clear
          afternoon, before any other loss.
        </p>
        <p>
          This is why mounting matters as much as the module. Panels need an air gap behind them to convect heat away;
          flush-mounting onto a hot iron-sheet roof with no clearance bakes them and quietly throws away yield. We design for
          ventilation, choose modules with a low (better) temperature coefficient for hot sites, and rate string voltages at
          the coldest dawn temperature — because cold mornings push voltage up toward the inverter&apos;s limit while hot
          afternoons pull it down.
        </p>
      </DeepDiveBlock>

      <FormulaBlock
        label="Temperature-corrected module power"
        expression="P_cell = P_stc × [1 + γ × (T_cell − 25)]"
        where={[
          ['P_stc', 'nameplate power at 25 °C'],
          ['γ', 'temp. coefficient of power (≈ −0.40%/°C)'],
          ['T_cell', 'actual cell temperature (°C)'],
        ]}
        example={<>A 550&nbsp;W module at 60&nbsp;°C: 550 × [1 + (−0.004 × 35)] = 550 × 0.86 ≈ <strong>473&nbsp;W</strong> — a 14% heat loss that good ventilation partly recovers.</>}
        accent="emerald"
      />

      {/* 3 ── Battery autonomy & DoD */}
      <DeepDiveBlock heading="3. Battery autonomy, depth-of-discharge and why chemistry decides cost" accent="emerald">
        <p>
          For any site that wants power after dark or through an outage, the battery is the most expensive and most
          misunderstood part. Two numbers govern it: <strong>days of autonomy</strong> (how long the bank carries the load
          with no sun) and <strong>depth of discharge (DoD)</strong> — how much of the rated capacity you dare use each cycle.
          Lead-acid batteries hate deep cycling; draw them below 50% routinely and their life collapses. Lithium iron
          phosphate (LiFePO₄) will cycle to 80–90% DoD for thousands of cycles, which is why — despite a higher sticker price —
          it is usually the cheaper battery per usable kWh over its life.
        </p>
        <p>
          Sizing the bank means inflating the energy you actually need by the usable DoD and the round-trip and inverter
          efficiencies. Skip that and the bank looks fine on paper but sags every cloudy week. We size for the worst realistic
          run of dull days at the site, not the annual average — a system that fails in the one rainy week that matters has
          failed, regardless of its yearly numbers.
        </p>
      </DeepDiveBlock>

      <FormulaBlock
        label="Usable battery capacity required"
        expression="C (kWh) = (E_daily × Days) ÷ (DoD × η)"
        where={[
          ['E_daily', 'energy to be served from battery (kWh)'],
          ['Days', 'days of autonomy required'],
          ['DoD', 'usable depth of discharge (0.5 lead-acid, 0.9 LiFePO₄)'],
          ['η', 'round-trip × inverter efficiency (≈0.85)'],
        ]}
        example={<>To serve 20&nbsp;kWh overnight from LiFePO₄ (DoD 0.9, η 0.85): 20 ÷ (0.9 × 0.85) ≈ <strong>26&nbsp;kWh</strong> of installed battery.</>}
        accent="emerald"
      />

      <SpecTable
        caption="Battery technology trade-offs (planning guide)"
        accent="emerald"
        highlightCol={0}
        headers={['Chemistry', 'Usable DoD', 'Cycle life', 'Best for']}
        rows={[
          ['Flooded lead-acid', '~50%', '500–800', 'Lowest upfront, occasional backup'],
          ['Sealed AGM/Gel', '~50%', '600–1,200', 'Maintenance-free standby'],
          ['LiFePO₄ (LFP)', '80–90%', '3,000–6,000', 'Daily cycling, lowest cost/kWh over life'],
          ['NMC lithium', '80–90%', '2,000–4,000', 'Compact, weight-sensitive sites'],
        ]}
      />

      {/* 4 ── MPPT vs PWM + string design */}
      <DeepDiveBlock heading="4. MPPT, string voltage and the losses nobody quotes" accent="emerald">
        <p>
          A panel has one operating point where it delivers maximum power, and it moves constantly with sun and temperature.
          A <strong>maximum power point tracking (MPPT)</strong> charge controller or inverter continuously hunts that point;
          a cheaper PWM controller simply clamps the panel to the battery voltage and throws the difference away — often
          20–30% of the harvest on a cold, bright morning. On anything beyond a tiny system, MPPT pays for itself quickly.
        </p>
        <p>
          String design is where installs quietly go wrong. Wire too few panels in series and the string voltage never
          reaches the inverter&apos;s MPPT window on hot afternoons, so it under-harvests. Wire too many and the cold-morning
          open-circuit voltage can exceed the inverter&apos;s maximum and damage it. The string voltage must be checked at
          both temperature extremes, and the conductor sized so volt-drop stays under about 2–3% — long DC runs on
          undersized cable are a yield leak you never see on a spec sheet.
        </p>
      </DeepDiveBlock>

      {/* 5 ── Economics */}
      <DeepDiveBlock heading="5. Grid-tie, hybrid or off-grid — and the payback maths" accent="emerald">
        <p>
          The right architecture follows the tariff and the load, not fashion. A business with a reliable grid and high daytime
          consumption wins most from a <strong>grid-tied</strong> system that offsets expensive daytime units — no battery, fast
          payback. A site with frequent outages needs a <strong>hybrid</strong> (battery-backed) system. Only a site with no grid
          at all — a remote lodge, a borehole, a mast — justifies a full <strong>off-grid</strong> design with the storage cost
          that implies.
        </p>
        <p>
          The honest decision tool is levelised cost of energy (LCOE): total lifetime cost divided by total lifetime kWh. A
          well-designed Kenyan PV system delivers solar electricity at roughly KSh&nbsp;8–15 per kWh over 25 years — well under
          both commercial grid tariffs and the KSh&nbsp;40+ per kWh of diesel generation. That spread is the entire business
          case, and it is why we so often pair solar with an existing generator: the panels carry the day cheaply, the genset
          becomes true backup, and the diesel bill falls by half or more.
        </p>
      </DeepDiveBlock>

      <DataChart
        kind="bar"
        accent="emerald"
        title="Indicative cost per kWh by source (KSh, lifetime levelised)"
        xLabel="Energy source"
        yLabel="KSh per kWh"
        unit=""
        data={[
          { x: 'Solar PV', y: 12 },
          { x: 'Grid (commercial)', y: 28 },
          { x: 'Diesel genset', y: 47 },
        ]}
      />

      <FormulaBlock
        label="Simple payback period"
        expression="Payback (yrs) = CAPEX ÷ (E_annual × Tariff_saved)"
        where={[
          ['CAPEX', 'installed system cost'],
          ['E_annual', 'annual kWh the system offsets'],
          ['Tariff_saved', 'cost per kWh avoided (grid or diesel)'],
        ]}
        example={<>A KSh&nbsp;1.8M, 14&nbsp;kWp system offsetting ~22,000&nbsp;kWh/yr at KSh&nbsp;28 → 1,800,000 ÷ (22,000 × 28) ≈ <strong>2.9&nbsp;years</strong>, then 20+ years of near-free power.</>}
        accent="emerald"
      />

      <Callout title="Get a site-specific solar model — free" accent="emerald">
        Send us your last 12 utility bills (or your daily kWh) and your location, and we&apos;ll return a sized array, battery
        and inverter spec with an LCOE and payback for your exact tariff and irradiance. Call <strong>+254&nbsp;768&nbsp;860&nbsp;665</strong>
        or use the enquiry form on this page.
      </Callout>
    </DeepDiveSection>
  );
}
