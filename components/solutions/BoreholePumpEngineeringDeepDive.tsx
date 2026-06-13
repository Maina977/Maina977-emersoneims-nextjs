// ═══════════════════════════════════════════════════════════════════════════════
// BoreholePumpEngineeringDeepDive — additive, server-rendered reference content for
// the borehole-pumps page. UNIQUE topics: total dynamic head, the pump curve & duty
// point, well yield & drawdown, motor cooling/cavitation, and specific energy + solar.
// ═══════════════════════════════════════════════════════════════════════════════

import {
  DeepDiveSection,
  DeepDiveBlock,
  FormulaBlock,
  SpecTable,
  Callout,
} from '@/components/content/EngineeringDeepDive';

export default function BoreholePumpEngineeringDeepDive() {
  return (
    <DeepDiveSection
      id="borehole-pump-engineering"
      eyebrow="Engineering reference"
      title="Borehole Pump Engineering: Head, Yield & Energy for Kenyan Water"
      accent="cyan"
      intro="A submersible pump that is wrong for its borehole either burns out chasing water that isn't there or wastes power pushing against a head nobody calculated. This is how a borehole pump is matched to the well — the head, the yield, the duty point and the energy per cubic metre that decides the running cost for years."
      sources={[
        'Hydraulic Institute (HI) pump standards — head, NPSH and efficiency definitions.',
        'WRA (Water Resources Authority) Kenya — borehole permitting and test-pumping requirements.',
        'Manufacturer pump performance curves (Grundfos, Pedrollo, Franklin) — head vs flow vs efficiency.',
        'Submersible motor cooling-flow and minimum-velocity requirements.',
        'NASA POWER irradiance data for solar borehole pumping design.',
      ]}
    >
      {/* 1 ── TDH */}
      <DeepDiveBlock heading="1. Total dynamic head — the number that sizes the pump" accent="cyan">
        <p>
          A pump does not lift water from the depth of the borehole — it lifts it from the <strong>pumping water level</strong>,
          which sits below the resting level once the pump is running and the well draws down. The pump must then overcome four
          things added together as <strong>total dynamic head (TDH)</strong>: the static lift to the pumping level, the
          additional drawdown, the friction loss in the rising main and pipework, and the pressure head needed at the surface
          (to fill a tank on a tower, or to hold pressure in a network). Size for the resting level alone and the pump runs short
          of the tank every dry season when the level drops.
        </p>
        <p>
          Friction loss is the silent thief here: undersized rising main to save a little on pipe costs a great deal in head, so
          the pump works harder and burns more power forever. We calculate TDH at the worst pumping level the borehole reaches,
          size the rising main to keep friction sensible, and choose the pump to that duty — not to the borehole&apos;s drilled
          depth, which is a different and irrelevant number.
        </p>
      </DeepDiveBlock>

      <FormulaBlock
        label="Total dynamic head and hydraulic power"
        expression="TDH = H_static + H_drawdown + H_friction + H_pressure"
        where={[
          ['H_static', 'depth to resting water level'],
          ['H_drawdown', 'extra drop while pumping'],
          ['H_friction', 'pipe + fitting losses'],
          ['H_pressure', 'head needed at surface (tank/network)'],
        ]}
        example={<>Hydraulic power P (kW) = ρ·g·Q·H ÷ 1000 = (Q in m³/s) × TDH × 9.81; divide by pump × motor efficiency for the electrical kW actually drawn.</>}
        accent="cyan"
      />

      {/* 2 ── Pump curve / duty point */}
      <DeepDiveBlock heading="2. The pump curve and the duty point" accent="cyan">
        <p>
          Every pump has a <strong>characteristic curve</strong> — as you ask it for more flow, the head it can deliver falls.
          Your system has its own curve too: the more water you push, the more friction head it demands. Where the two curves
          cross is the <strong>duty point</strong>, the flow and head the pump will actually deliver in this borehole. A pump is
          most efficient only in a band around its best-efficiency point (BEP); run it far to the left (throttled, low flow) or
          right (over-pumping) and efficiency collapses and the pump suffers.
        </p>
        <p>
          This is why a pump that &quot;has plenty of head&quot; can still be the wrong pump — if its duty point lands far from
          its BEP, it wastes energy and wears out. We select so the borehole&apos;s real duty point sits near the BEP, which is
          how you get both the flow you need and the lowest energy per cubic metre. Matching the pump to the curve, not the
          catalogue maximum, is the whole craft.
        </p>
      </DeepDiveBlock>

      {/* 3 ── Yield & drawdown */}
      <DeepDiveBlock heading="3. Well yield, drawdown and not pumping the borehole dry" accent="cyan">
        <p>
          The borehole has a limit — its <strong>sustainable yield</strong>, the flow it can give continuously without the level
          drawing down to the pump. A proper <strong>test-pumping (step-drawdown) exercise</strong> measures how far the level
          falls at increasing flows and reveals that ceiling; the WRA requires it for good reason. A pump sized above the well&apos;s
          yield will draw the level down to its intake, suck air, lose its cooling water and burn out — the single most common way
          a borehole pump dies young.
        </p>
        <p>
          So the pump is sized to the <em>well</em>, not just the demand. Where demand exceeds yield, the answer is a smaller
          pump running longer into storage tanks, plus <strong>low-water (dry-run) protection</strong> that stops the pump before
          the level reaches the intake. We set the pump at the correct depth above the screen, fit level protection, and design
          tank storage to bridge peak demand — so the borehole is harvested at a rate it can sustain for decades.
        </p>
      </DeepDiveBlock>

      <SpecTable
        caption="Why borehole pumps fail early (and the fix)"
        accent="cyan"
        highlightCol={0}
        headers={['Failure', 'Cause', 'Engineered fix']}
        rows={[
          ['Motor burnout', 'Over-pumping below yield → dry run', 'Size to yield + dry-run protection'],
          ['Low flow / no water to tank', 'TDH under-estimated (drawdown ignored)', 'Calculate TDH at pumping level'],
          ['High power bill', 'Duty point far from BEP, thin rising main', 'Match curve, upsize rising main'],
          ['Overheated motor', 'Insufficient cooling flow past motor', 'Flow sleeve / correct setting depth'],
        ]}
      />

      {/* 4 ── Motor cooling / cavitation */}
      <DeepDiveBlock heading="4. Motor cooling and cavitation — the physics that protects the pump" accent="cyan">
        <p>
          A submersible motor is cooled by the very water flowing past it, and that flow must reach a minimum velocity or the
          motor overheats even while pumping. In a wide borehole, or where the pump sits below the inflow, a <strong>flow
          sleeve (cooling shroud)</strong> forces the water past the motor to keep it cool. Ignore this and the motor cooks in a
          well that is, paradoxically, full of water.
        </p>
        <p>
          <strong>Cavitation</strong> is the other hidden killer: if the pressure at the pump intake falls below the water&apos;s
          vapour pressure, bubbles form and then collapse violently against the impeller, pitting the metal and destroying
          efficiency. Adequate submergence (enough water above the intake) and a sensible intake design keep the available
          suction head above what the pump requires (NPSH), which is what stops cavitation. These are not optional refinements;
          they are the difference between a pump that lasts ten years and one that fails in two.
        </p>
      </DeepDiveBlock>

      {/* 5 ── Specific energy & solar */}
      <DeepDiveBlock heading="5. Specific energy and the case for solar pumping" accent="cyan">
        <p>
          The honest running-cost metric for a borehole is <strong>specific energy</strong> — the kWh needed to lift one cubic
          metre of water to the surface. It rises with head and falls with pump efficiency, and it is the number that should
          drive both pump selection and the energy source. A deep, high-head borehole on grid or diesel power can have a
          surprisingly large monthly bill that a well-matched pump and a solar array transform.
        </p>
        <p>
          Solar borehole pumping fits the resource beautifully: the sun is strongest when tanks are being drawn down in the heat
          of the day, and storing water in a tank is far cheaper than storing energy in batteries. A solar-direct pump with a
          variable-speed drive ramps with the available sunlight, filling storage through the day with no fuel and almost no
          running cost. For farms, schools and remote sites off the grid, it is often the lowest lifetime-cost water there is.
        </p>
      </DeepDiveBlock>

      <FormulaBlock
        label="Specific energy of pumping"
        expression="E_specific (kWh/m³) = (ρ·g·TDH) ÷ (3.6×10⁶ × η_pump × η_motor)"
        where={[
          ['TDH', 'total dynamic head (m)'],
          ['η_pump, η_motor', 'pump and motor efficiencies'],
          ['ρ·g', 'water density × gravity (≈9,810 N/m³)'],
        ]}
        example={<>At 120&nbsp;m TDH with 65% pump and 88% motor efficiency: ≈ 9,810 × 120 ÷ (3.6e6 × 0.65 × 0.88) ≈ <strong>0.57&nbsp;kWh/m³</strong> — multiply by your daily m³ and tariff for the real bill.</>}
        accent="cyan"
      />

      <Callout title="Match the pump to your borehole" accent="cyan">
        Send us your borehole&apos;s test-pumping data (yield, resting and pumping levels, depth) and your daily water demand, and
        we&apos;ll return a pump selection at the correct duty point, the rising-main sizing, protection, and a solar option with
        its specific energy and payback. Call <strong>+254&nbsp;768&nbsp;860&nbsp;665</strong> or use the enquiry form.
      </Callout>
    </DeepDiveSection>
  );
}
