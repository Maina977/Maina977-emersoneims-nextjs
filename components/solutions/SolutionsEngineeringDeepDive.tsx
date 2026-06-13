// ═══════════════════════════════════════════════════════════════════════════════
// SolutionsEngineeringDeepDive — additive, server-rendered reference content for the
// /solutions hub. UNIQUE angle: the engineering *methodology* — how a power project
// is actually delivered (load study → single-line → standards → commissioning →
// lifecycle SLA). Distinct from the sector view (/industries) and the per-service pages.
// ═══════════════════════════════════════════════════════════════════════════════

import {
  DeepDiveSection,
  DeepDiveBlock,
  FormulaBlock,
  SpecTable,
  Callout,
} from '@/components/content/EngineeringDeepDive';

export default function SolutionsEngineeringDeepDive() {
  return (
    <DeepDiveSection
      id="solutions-engineering"
      eyebrow="Engineering reference"
      title="How a Power Project Is Engineered: From Load Study to Lifecycle"
      accent="amber"
      intro="Anyone can sell a generator. Engineering a solution means knowing the load before the quote, integrating every part as one system, proving it at commissioning, and standing behind it for its life. This is the method behind every project we deliver — and the questions you should ask any supplier before you sign."
      sources={[
        'IEC 60364 / KS IEC — design and verification of low-voltage electrical installations.',
        'ISO 8528 — generating-set ratings and acceptance test methods.',
        'IEEE 446 (Orange Book) — emergency and standby power system design.',
        'NFPA 110 — commissioning and periodic testing of standby power systems.',
        'Manufacturer commissioning protocols (FAT/SAT) and protection-coordination practice.',
      ]}
    >
      {/* 1 ── Load study */}
      <DeepDiveBlock heading="1. The load study: measure before you quote" accent="amber">
        <p>
          Every credible power solution starts with one thing the cheapest suppliers skip: an honest understanding of the load.
          That means a <strong>demand profile</strong> — not a nameplate tally, but how the load actually behaves through the
          day, the largest motor that can start while everything else runs, the power factor, the harmonic content, and the
          growth expected over the next few years. A connected-load total can overstate the real demand by a wide margin because
          not everything runs at once; a <strong>diversity (demand) factor</strong> turns the nameplate sum into the figure the
          system must really serve.
        </p>
        <p>
          Skipping this step is how sites end up with equipment that is simultaneously too big (idling, wet-stacking, wasting
          standing losses) and too small (collapsing on the worst motor start). We measure with data loggers where the load
          already exists, or build the profile carefully from the schedule where it does not — because every downstream decision,
          from genset frame size to cable to tariff, rests on this number being right.
        </p>
      </DeepDiveBlock>

      <FormulaBlock
        label="Maximum demand from connected load"
        expression="MD = (Σ connected load × Demand factor) ÷ PF"
        where={[
          ['MD', 'maximum demand the system must serve (kVA)'],
          ['Σ connected load', 'sum of all equipment ratings (kW)'],
          ['Demand factor', 'fraction running simultaneously (< 1)'],
          ['PF', 'load power factor'],
        ]}
        example={<>500&nbsp;kW connected, demand factor 0.7, PF 0.85 → (500 × 0.7) ÷ 0.85 ≈ <strong>412&nbsp;kVA</strong> — not the 588&nbsp;kVA a raw nameplate sum would have over-bought.</>}
        accent="amber"
      />

      {/* 2 ── Single-line / integration */}
      <DeepDiveBlock heading="2. The single-line diagram: one integrated system, not a pile of boxes" accent="amber">
        <p>
          A generator, a UPS, a solar array, an ATS and a distribution board bought separately are not a power system — they are
          a pile of boxes that may or may not cooperate when the grid drops. The <strong>single-line diagram (SLD)</strong> is
          where they become one designed system: it shows every source, switch, protective device and load, how the changeover
          sequences, how the UPS bridges the genset start, how the solar ties in without back-feeding, and where the system can
          be isolated safely for maintenance.
        </p>
        <p>
          This integration is where most field failures are quietly designed out — or designed in. A UPS that fights the
          generator, a transfer switch that is itself a single point of failure behind a redundant UPS, a solar inverter with no
          anti-islanding interlock: these are integration faults, invisible on any individual datasheet and obvious on a
          well-drawn SLD. We design the whole chain on one diagram, and that diagram becomes the document the installation,
          the commissioning and every future engineer works from.
        </p>
      </DeepDiveBlock>

      {/* 3 ── Standards */}
      <DeepDiveBlock heading="3. Standards and protection: safe, selective, certified" accent="amber">
        <p>
          A compliant installation is designed to recognised standards (IEC&nbsp;60364 / the Kenyan equivalents) and proven by
          verification, not assertion. Cables are sized for current capacity <em>and</em> volt-drop and fault withstand;
          protective devices are selected and <strong>graded</strong> so a downstream fault trips the nearest breaker and leaves
          the rest of the site live; earthing is designed and tested so faults clear and people are safe. These are not optional
          refinements that separate a professional install from a dangerous one — they are the install.
        </p>
        <p>
          The output is a documented, certifiable system: test certificates, protection settings, an as-built SLD and an O&amp;M
          manual. For regulated clients this is what satisfies the auditor; for everyone it is what lets the next engineer work
          on the system safely years later. We hand it over as a matter of course, because an undocumented installation is a
          liability waiting for an incident.
        </p>
      </DeepDiveBlock>

      {/* 4 ── Commissioning */}
      <DeepDiveBlock heading="4. Commissioning: prove it under load before you trust it" accent="amber">
        <p>
          Equipment that has never been tested under real conditions is a hope, not a system. Proper commissioning runs a
          defined sequence: factory acceptance where it applies, then on-site checks of every connection and setting, a
          <strong> load-bank test</strong> that proves the generator carries full rated load (and burns off any wet-stacking),
          a simulated mains failure to verify the changeover and UPS bridge happen cleanly and within the specified transfer
          time, and a check that protection grades as designed. Only then is the system signed over.
        </p>
        <p>
          This is the step that separates a working installation from one that fails on its first real outage — the day nobody
          can afford a surprise. NFPA&nbsp;110 formalises it for standby systems precisely because untested systems fail when
          tested by reality. We commission to a written protocol and leave the client the records, so the first time the system
          proves itself is on the test bench, not in a crisis.
        </p>
      </DeepDiveBlock>

      <SpecTable
        caption="The delivery method we follow on every project"
        accent="amber"
        highlightCol={0}
        headers={['Stage', 'What happens', 'What you get']}
        rows={[
          ['1. Load study', 'Measure / profile the real demand', 'Demand figure, growth allowance'],
          ['2. Design (SLD)', 'Integrate sources, switching, protection', 'Single-line diagram, equipment spec'],
          ['3. Standards check', 'Cable, protection, earthing to IEC/KS', 'Compliant, certifiable design'],
          ['4. Install', 'Build to the design, not to convenience', 'As-built drawings'],
          ['5. Commission', 'Load-bank + mains-fail + protection test', 'Test certificates, O&M manual'],
          ['6. Lifecycle SLA', 'Scheduled service + monitoring + spares', 'Documented uptime, fast response'],
        ]}
      />

      {/* 5 ── Lifecycle */}
      <DeepDiveBlock heading="5. Lifecycle: the relationship after the handover" accent="amber">
        <p>
          The day the system is commissioned is the start of its working life, not the end of the engagement. Standby systems
          fail quietly between outages — a flat battery, stale fuel, a drifted setting — so reliability is sustained by a
          <strong> maintenance SLA</strong>: scheduled service by running hours or calendar, periodic load testing, remote
          monitoring where it earns its keep, and locally-held fast-moving spares so a fault is measured in hours, not weeks.
          Availability, as the maths shows elsewhere on this site, depends as much on speed of repair as on the quality of the
          iron.
        </p>
        <p>
          This is why we sell partnerships rather than boxes. One contract, one SLA, documented service history, and the same
          engineers who designed the system maintaining it — across one site or fifty. It is the least glamorous part of power
          engineering and, over a ten-year life, the part that decides whether the investment actually delivered the resilience
          it promised.
        </p>
      </DeepDiveBlock>

      <Callout title="Ask us — and any supplier — these questions" accent="amber">
        Before you sign anything, ask for the load study, the single-line diagram, the commissioning protocol and the SLA. If a
        supplier cannot produce them, they are selling you a box, not a solution. We provide all four as standard. Call
        <strong> +254&nbsp;768&nbsp;860&nbsp;665</strong> or <strong>+254&nbsp;782&nbsp;914&nbsp;717</strong>, or use the enquiry form.
      </Callout>
    </DeepDiveSection>
  );
}
