// ═══════════════════════════════════════════════════════════════════════════════
// GeneratorEngineeringDeepDive
//
// Reference-grade, additive technical content for /generators. Server-rendered
// (no 'use client') so every paragraph, formula and table is in the initial HTML
// for crawlers, researchers and procurement teams. Written from field practice —
// not generic copy — and unique to this page. Do not duplicate this material on
// other pages; each service page gets its own deep-dive.
// ═══════════════════════════════════════════════════════════════════════════════

import {
  DeepDiveSection,
  DeepDiveBlock,
  FormulaBlock,
  SpecTable,
  Callout,
  DataChart,
} from '@/components/content/EngineeringDeepDive';

export default function GeneratorEngineeringDeepDive() {
  return (
    <DeepDiveSection
      id="generator-engineering"
      eyebrow="Engineering reference"
      title="Diesel Generator Engineering: Sizing, Derating & Lifecycle for Kenyan Sites"
      accent="amber"
      intro="A working reference for the engineers, facility managers and procurement teams who actually specify standby power. Everything below is the maths and field experience we use when we size, install and maintain gensets across Kenya — including the altitude and load-profile realities that catch most imported sizing charts out."
      sources={[
        'ISO 8528-1:2018 — Reciprocating internal combustion engine driven alternating current generating sets (rating definitions ESP/PRP/COP/LTP).',
        'ISO 3046-1 — Engine power adjustment for site reference conditions (altitude, temperature, humidity derating).',
        'IEEE Std 519-2022 — Recommended practice for harmonic control in electric power systems.',
        'NFPA 110 — Standard for Emergency and Standby Power Systems (test and maintenance regimes).',
        'EPRA Kenya retail electricity tariff schedules and KenGen/KPLC commercial rate bands (used for diesel-vs-grid cost comparison).',
      ]}
    >
      {/* 1 ── kVA vs kW & power factor */}
      <DeepDiveBlock heading="1. kVA, kW and why the nameplate lies to you">
        <p>
          The first argument on almost every project is the size of the set, and it usually starts from the wrong number.
          A generator&apos;s nameplate is given in <strong>kVA — apparent power</strong> — but your equipment does real work in
          <strong> kW</strong>. The two are linked by the power factor (PF), the ratio of useful power to the total power the
          alternator has to push. For diesel sets the industry convention is a lagging PF of <strong>0.8</strong>, so an
          800&nbsp;kVA set is only an 640&nbsp;kW machine. Specify in kW, confirm the PF of your actual load, then convert —
          never the other way round.
        </p>
        <p>
          The reactive component matters because motors, transformers and fluorescent gear draw magnetising current that does
          no work but still heats the alternator windings and loads the engine. A site full of induction motors running at
          PF&nbsp;0.65 will pull far more kVA than its kW figure suggests, which is why power-factor correction at the main
          board is often cheaper than a bigger genset.
        </p>
        <p>
          Get this number wrong in either direction and you pay. Oversize the set and it spends its life lightly loaded, which —
          as we cover below — destroys diesel engines through wet stacking. Undersize it and the first big motor start collapses
          the voltage, drops out contactors and trips the main breaker. The right answer is rarely &quot;round up to the next
          model&quot;; it is a load study.
        </p>
      </DeepDiveBlock>

      <FormulaBlock
        label="Apparent ↔ real power"
        expression="kVA = kW ÷ PF        kW = kVA × PF"
        where={[
          ['kVA', 'apparent power (alternator rating)'],
          ['kW', 'real / working power'],
          ['PF', 'power factor (≈0.8 lagging for diesel sets)'],
        ]}
        example={<>A load measured at 512&nbsp;kW with a site PF of 0.8 needs 512 ÷ 0.8 = <strong>640&nbsp;kVA</strong> of alternator — i.e. an 800&nbsp;kVA set is over-spec&apos;d unless future load or starting current demands it.</>}
        accent="amber"
      />

      <SpecTable
        caption="Typical running demand of common commercial loads (planning estimates, confirm by measurement)"
        accent="amber"
        headers={['Load', 'Typical running power', 'Power factor', 'Notes']}
        rows={[
          ['Office / lighting (LED)', '8–15 W/m²', '0.95', 'Low reactive draw; switch-mode drivers add harmonics'],
          ['Ducted air-conditioning (per ton)', '1.2–1.5 kW', '0.80', 'Compressor inrush dominates sizing'],
          ['Borehole submersible pump', '2.2–37 kW', '0.78', 'DOL start = high inrush; consider soft-start'],
          ['Cold room / chiller', '5–60 kW', '0.82', 'Cyclic load; size for compressor restart'],
          ['Server room + UPS', '10–200 kW', '0.9–1.0', 'Non-linear — see harmonics section'],
          ['Lift / hoist motor', '7.5–30 kW', '0.75', 'Regenerative spikes; brief but severe'],
        ]}
      />

      {/* 2 ── Motor starting & step loads */}
      <DeepDiveBlock heading="2. Motor starting decides the size, not the running load">
        <p>
          On most industrial and water-supply sites it is not the steady running load that sets the genset size — it is the
          worst-case motor start. A direct-on-line (DOL) induction motor draws a <strong>locked-rotor inrush of roughly six to
          eight times its full-load current</strong> for the first few seconds, at a miserable starting power factor of around
          0.3. That transient is what the alternator must swallow without the voltage sagging far enough to drop out your
          contactors and controls.
        </p>
        <p>
          So the real sizing question is the <strong>starting kVA (SkVA)</strong> of the largest motor that can start while
          everything else is already running. ISO&nbsp;8528 classifies sets by how tightly they hold voltage and frequency during
          these steps (performance classes G1 to G4); a data centre or hospital wants G3, where the transient voltage dip is
          held to a few percent. Reciprocating-engine sets can typically accept a first step of 60–80% of their rating, but only
          if the alternator is sized for the inrush.
        </p>
        <p>
          The fix is often not a bigger generator. Soft starters cut inrush to around 2–3× FLC, and variable-frequency drives
          (VFDs) bring it down near 1× while ramping — turning a brutal step load into a gentle one. On borehole and HVAC sites
          we routinely save a customer a whole frame size by staging starts and adding soft-starters rather than buying copper.
        </p>
      </DeepDiveBlock>

      <FormulaBlock
        label="Motor starting demand"
        expression="SkVA ≈ (√3 × V × I_LR) ÷ 1000     I_LR ≈ 6–8 × I_FL"
        where={[
          ['SkVA', 'starting kVA the alternator must supply'],
          ['V', 'line voltage (415 V, three-phase Kenya)'],
          ['I_LR', 'locked-rotor (inrush) current'],
          ['I_FL', 'motor full-load current'],
        ]}
        example={<>A 30&nbsp;kW DOL pump (≈55&nbsp;A FLC) pulls ≈330&nbsp;A on start → √3 × 415 × 330 ÷ 1000 ≈ <strong>237&nbsp;SkVA</strong> momentarily, even though it runs at ~38&nbsp;kVA. The set must ride through that dip.</>}
        accent="amber"
      />

      {/* 3 ── Altitude & temperature derating (Kenya-critical) */}
      <DeepDiveBlock heading="3. Altitude and heat: the Kenyan derate nobody imports">
        <p>
          This is the single most common specification error we see, because most generators sold in the region are rated at the
          ISO reference of sea level and 25&nbsp;°C — conditions that exist almost nowhere on the Kenyan plateau. A diesel engine
          breathes air; thinner high-altitude air carries less oxygen, so the engine makes less power. As a rule of thumb a
          naturally-aspirated engine loses about <strong>3–4% of its output for every 300&nbsp;m above 1,000&nbsp;m</strong>, and
          roughly a further <strong>1–2% for every 5–6&nbsp;°C above the 25–40&nbsp;°C reference</strong>. Turbocharged engines
          tolerate altitude better but are not immune.
        </p>
        <p>
          Nairobi sits at about 1,795&nbsp;m, Nakuru at 1,850&nbsp;m, Eldoret at roughly 2,100&nbsp;m. A &quot;100&nbsp;kVA&quot;
          set delivered to a factory in Eldoret can be a genuine 80&nbsp;kVA machine on a hot afternoon. Buyers then wonder why
          their &quot;oversized&quot; generator trips on overload every time the chillers and compressors coincide. The capacity
          was never there — it was de-rated away by physics the supplier ignored.
        </p>
        <p>
          We always size against the <strong>site-corrected</strong> rating, not the brochure. That means knowing the altitude,
          the worst-case ambient (radiator air-on temperature, not shade temperature), and whether the canopy restricts airflow.
          For coastal sites — Mombasa, Kilifi, Diani — altitude is a non-issue but ambient heat and salt-laden humidity drive the
          derate and the corrosion-protection spec instead.
        </p>
      </DeepDiveBlock>

      <FormulaBlock
        label="Site-corrected power (approximation per ISO 3046 principles)"
        expression="P_site ≈ P_rated × (1 − a·Δh) × (1 − b·Δt)"
        where={[
          ['P_site', 'usable power at the installation site'],
          ['P_rated', 'ISO nameplate power'],
          ['a·Δh', 'altitude derate (≈3.5% per 500 m above 1000 m)'],
          ['b·Δt', 'temperature derate (≈1% per 5.5 °C above reference)'],
        ]}
        example={<>A 100&nbsp;kVA set in Eldoret (≈2,100&nbsp;m, 30&nbsp;°C): altitude loss ≈ 7.7%, heat loss ≈ 1% → ≈100 × 0.923 × 0.99 ≈ <strong>91&nbsp;kVA</strong> usable, before any canopy restriction.</>}
        accent="amber"
      />

      <SpecTable
        caption="Approximate altitude derate across major Kenyan locations (naturally-aspirated diesel, indicative)"
        accent="amber"
        highlightCol={2}
        headers={['Location', 'Elevation', 'Altitude derate', 'A 100 kVA set delivers ≈']}
        rows={[
          ['Mombasa / Diani', '~15 m', '0%', '100 kVA'],
          ['Kisumu', '~1,130 m', '~1%', '99 kVA'],
          ['Nairobi', '~1,795 m', '~5.5%', '94 kVA'],
          ['Nakuru', '~1,850 m', '~6%', '94 kVA'],
          ['Nyeri', '~1,750 m', '~5%', '95 kVA'],
          ['Eldoret', '~2,100 m', '~7.7%', '92 kVA'],
        ]}
      />

      {/* 4 ── ISO 8528 ratings */}
      <DeepDiveBlock heading="4. ESP, PRP, COP — buy the rating that matches the duty">
        <p>
          A generator does not have one power figure; it has several, and quoting the wrong one is how cheap sets are made to
          look competitive. ISO&nbsp;8528 defines the operating ratings, and the gap between them is real money and real engine
          life. Pay for the duty you actually run, not the headline number.
        </p>
        <p>
          For a building that draws grid power and only fires the genset during outages, <strong>Emergency Standby Power (ESP)</strong>
          is correct — full output for the duration of the outage, variable load, no sustained overload, limited annual hours.
          A telecom site or an off-grid lodge that runs the set as its main supply needs <strong>Prime (PRP)</strong>, rated for
          unlimited hours at a variable load whose average stays around 70%. A process that demands constant full output around
          the clock needs <strong>Continuous (COP)</strong>. Putting an ESP-rated set on prime duty voids the warranty and ages
          the engine fast.
        </p>
      </DeepDiveBlock>

      <SpecTable
        caption="ISO 8528 operating ratings"
        accent="amber"
        highlightCol={0}
        headers={['Rating', 'Load profile', 'Overload allowed', 'Typical use']}
        rows={[
          ['ESP — Emergency Standby', 'Variable, avg ≤ 70%', 'None', 'Grid-connected building backup'],
          ['PRP — Prime', 'Variable, avg ≤ 70%, unlimited hrs', '10% for 1 h in 12', 'Off-grid sites, telecom, construction'],
          ['COP — Continuous', 'Constant load, unlimited hrs', 'None', 'Base-load / co-generation'],
          ['LTP — Limited Time Prime', 'Constant, ≤ 500 h/year', 'None', 'Peak-shaving, grid support'],
        ]}
      />

      {/* 5 ── Fuel & economics */}
      <DeepDiveBlock heading="5. Fuel burn and the economics of diesel vs grid">
        <p>
          Over a ten-year life, fuel — not the purchase price — is where most of the money goes. A modern diesel set burns
          roughly <strong>0.25–0.30 litres of diesel per kWh generated at full load</strong>, but specific consumption climbs
          sharply at light load because the engine still has fixed friction and pumping losses to overcome. A set running at 25%
          load can burn nearly twice as much fuel per useful kWh as the same set at 80%. The curve below is why right-sizing and
          loading discipline matter more than any spec-sheet efficiency claim.
        </p>
        <p>
          Translate that into shillings and the case for treating a generator as <strong>backup, not base-load</strong> becomes
          obvious. At a pump price around KSh&nbsp;165/litre, diesel generation lands near KSh&nbsp;40–55 per kWh once you include
          oil and maintenance — well above commercial grid tariffs. The sets that wreck a budget are the ones quietly running as
          primary supply because nobody trusts the changeover, or because a solar-plus-storage layer was never added to carry the
          daytime base load.
        </p>
        <p>
          This is the conversation we have with every serious B2B client: the cheapest kWh is the one you do not generate on
          diesel. A correctly sized genset for genuine outage cover, paired with solar PV and (where the tariff justifies it)
          battery storage, routinely cuts a site&apos;s diesel bill by 40–70% while keeping the resilience.
        </p>
      </DeepDiveBlock>

      <DataChart
        kind="line"
        accent="amber"
        title="Specific fuel consumption vs load — typical 100 kVA / 80 kW diesel set"
        xLabel="Engine load (%)"
        yLabel="Litres of diesel per hour"
        unit=" L"
        data={[
          { x: '25%', y: 7 },
          { x: '50%', y: 12 },
          { x: '75%', y: 17 },
          { x: '100%', y: 23 },
        ]}
      />

      <FormulaBlock
        label="Cost per generated kWh"
        expression="Cost/kWh = (L/h × P_fuel) ÷ kW_out + C_maint"
        where={[
          ['L/h', 'fuel burn at the operating load'],
          ['P_fuel', 'diesel price per litre (≈ KSh 165)'],
          ['kW_out', 'real power delivered'],
          ['C_maint', 'oil + service cost apportioned per kWh'],
        ]}
        example={<>At 75% load: 17&nbsp;L/h × 165 ÷ 60&nbsp;kW ≈ KSh&nbsp;47/kWh before maintenance — roughly double a typical commercial grid rate, which is exactly why the set should run only when the grid is down.</>}
        accent="amber"
      />

      {/* 6 ── Load factor / wet stacking */}
      <DeepDiveBlock heading="6. Wet stacking: why an under-loaded diesel destroys itself">
        <p>
          A diesel engine is designed to run hot and worked. Keep it below about <strong>30% load</strong> for long periods and
          combustion temperatures never rise enough to burn the fuel completely. Unburnt diesel and soot then condense in the
          cylinders, exhaust and turbocharger — the black, oily weep at the exhaust that gives <strong>wet stacking</strong> its
          name. Left unchecked it glazes the bores, fouls injectors and valves, and progressively strangles the engine.
        </p>
        <p>
          This is the hidden cost of the &quot;buy big to be safe&quot; instinct. The oversized standby set that idles at 15%
          during every short outage is slowly killing itself. The remedy is either to size honestly, or — where load genuinely
          varies — to commission an annual <strong>resistive load-bank test</strong> that runs the set to 80–100% for an hour to
          burn off the deposits and prove it can carry full rated load. NFPA&nbsp;110 builds this into its monthly/annual test
          regime for exactly this reason.
        </p>
      </DeepDiveBlock>

      <Callout title="Field rule we hold to" accent="amber">
        Never let a diesel set run below 30% of its rating for extended periods. If the real load is that small, fit a smaller
        set or a load bank — do not &quot;protect&quot; the engine by under-working it. Under-loading is a failure mode, not a safety margin.
      </Callout>

      {/* 7 ── Power quality / harmonics */}
      <DeepDiveBlock heading="7. Harmonics, the AVR and sizing for non-linear loads">
        <p>
          Modern sites are full of <strong>non-linear loads</strong> — VFDs, UPS rectifiers, LED drivers, IT power supplies — that
          draw current in sharp pulses rather than clean sine waves. Those pulses inject harmonic currents back into the
          alternator, distorting the voltage waveform (measured as total harmonic distortion, <strong>THD</strong>), overheating
          the windings and confusing voltage regulators. IEEE&nbsp;519 recommends keeping voltage THD below 5% at the point of
          common coupling; a poorly matched genset on a heavy VFD load can drift well past that.
        </p>
        <p>
          Two things protect against it. First, a <strong>permanent-magnet generator (PMG) excitation</strong> with a good
          digital AVR sustains field current even when the waveform is distorted, so the set holds voltage during step loads and
          fault clearing. Second, where the non-linear fraction is high, the alternator is deliberately <strong>oversized</strong> —
          a common rule is to rate the alternator at 1.5–2× the connected UPS or VFD load so the harmonic heating stays within
          the insulation class. Skipping this is why some sets &quot;work on the bench&quot; but nuisance-trip once the real IT
          and drive load is connected.
        </p>
        <p>
          On data-centre, hospital and broadcast work we specify the alternator and the UPS together, because the two have to
          cooperate during transfer. A UPS with an aggressive input filter or a low-quality rectifier can fight the genset; the
          cure is matched ratings, a PMG alternator, and sometimes a passive harmonic filter or an active front-end UPS.
        </p>
      </DeepDiveBlock>

      <SpecTable
        caption="Alternator oversizing guidance for non-linear load fraction"
        accent="amber"
        headers={['Non-linear load share', 'Recommended alternator margin', 'Excitation']}
        rows={[
          ['< 20%', 'Standard rating', 'Shunt / AREP acceptable'],
          ['20–40%', '×1.25 rating', 'PMG preferred'],
          ['40–60%', '×1.5 rating', 'PMG + digital AVR'],
          ['> 60% (IT / VFD heavy)', '×1.75–2 rating', 'PMG + harmonic mitigation'],
        ]}
      />

      {/* 8 ── Maintenance & availability */}
      <DeepDiveBlock heading="8. Maintenance, batteries and what availability really means">
        <p>
          A standby generator earns its keep on the day the grid fails — and the cruellest statistic in our trade is how many
          sets fail to start on exactly that day. The leading cause is not the engine at all: it is a <strong>flat or sulphated
          starting battery</strong>, followed by stale fuel and a discharged or faulty charger. Reliability is a maintenance
          outcome, not a purchase decision.
        </p>
        <p>
          We schedule service by running hours or by calendar, whichever comes first, and we log every visit. Oil and filter
          changes at 250–500&nbsp;hours or annually; coolant condition and concentration checked each visit; fuel polished or
          treated to stop diesel-bug growth in tanks that sit full for months; valve lash and injectors on the manufacturer&apos;s
          longer interval; battery tested under load — voltage alone lies. Above all, the set is <strong>exercised under load</strong>
          regularly, not just idled, for the wet-stacking reasons above.
        </p>
        <p>
          The number that matters to a facility manager is <strong>availability</strong> — the probability the set runs when
          called. It is driven by how often it fails (mean time between failures, MTBF) and how fast it is repaired (mean time to
          repair, MTTR). A genset with a long MTBF but a three-day parts wait can have worse real-world availability than a humbler
          set backed by local spares and a four-hour SLA. This is why we hold fast-moving Cummins and FG&nbsp;Wilson parts locally
          and contract response times rather than selling iron and disappearing.
        </p>
      </DeepDiveBlock>

      <FormulaBlock
        label="System availability"
        expression="A = MTBF ÷ (MTBF + MTTR)"
        where={[
          ['A', 'availability (fraction of time ready)'],
          ['MTBF', 'mean time between failures'],
          ['MTTR', 'mean time to repair (incl. parts wait)'],
        ]}
        example={<>A set with MTBF of 2,000&nbsp;h and a 4&nbsp;h SLA repair → 2000 ÷ 2004 = <strong>99.8%</strong>. The same set with a 72&nbsp;h parts wait → 2000 ÷ 2072 = <strong>96.5%</strong>. Spares and SLA, not just the badge, decide uptime.</>}
        accent="amber"
      />

      <SpecTable
        caption="Indicative preventive-maintenance schedule (confirm against engine manual)"
        accent="amber"
        headers={['Interval', 'Tasks']}
        rows={[
          ['Weekly / monthly', 'Visual check, fluid levels, battery voltage, no-load run, alarm test'],
          ['Every 250–500 h or 6–12 mo', 'Engine oil + oil filter, fuel filter, air filter inspection, coolant test'],
          ['Annually', 'Load-bank test to ≥80%, full alternator/AVR check, hoses & belts, fuel polishing'],
          ['Every 2 yr / 1,000+ h', 'Coolant change, valve lash adjustment, injector inspection, battery replacement'],
        ]}
      />

      {/* 9 ── TCO */}
      <DeepDiveBlock heading="9. Total cost of ownership: the cheap set is the expensive one">
        <p>
          When two quotes differ by a few hundred thousand shillings, the gap almost always reappears — multiplied — in fuel,
          parts and downtime over the life of the machine. The honest comparison is <strong>total cost of ownership</strong>:
          purchase and installation, plus fuel over the expected running hours, plus scheduled maintenance, plus the cost of the
          outages the set fails to cover. A generator that is 15% cheaper but burns 10% more fuel and waits days for parts is the
          expensive option on any horizon longer than a year.
        </p>
        <p>
          We put this number in front of clients deliberately, because it reframes the decision from price to value — and because
          it is where a properly engineered solution (right size, right rating, local parts, an SLA, and a solar layer to shave
          the fuel) pays for itself. Ask any supplier for the ten-year TCO, not just the invoice. If they cannot produce it, they
          have not engineered your power — they have just sold you a box.
        </p>
      </DeepDiveBlock>

      <FormulaBlock
        label="10-year total cost of ownership"
        expression="TCO = CAPEX + (H × L/h × P_fuel) + (Σ service) + (downtime cost)"
        where={[
          ['CAPEX', 'set + installation + ATS + civil works'],
          ['H', 'running hours over the period'],
          ['L/h × P_fuel', 'fuel cost at the operating load'],
          ['Σ service', 'all scheduled and corrective maintenance'],
          ['downtime cost', 'value of production/service lost when power is out'],
        ]}
        accent="amber"
      />

      <Callout title="Talk to our engineers before you buy" accent="amber">
        Send us your single-line diagram or a list of your largest motors and your worst-case ambient/altitude, and we will return
        a site-corrected sizing, an ISO&nbsp;8528 rating recommendation and a ten-year TCO — free, and in writing. That is how a
        power partner works. Call <strong>+254&nbsp;768&nbsp;860&nbsp;665</strong> or use the enquiry form on this page.
      </Callout>
    </DeepDiveSection>
  );
}
