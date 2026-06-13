// ═══════════════════════════════════════════════════════════════════════════════
// FabricationEngineeringDeepDive — additive, server-rendered reference content for
// the steel-fabrication page. UNIQUE topics: structural steel grades & design,
// weld processes and joint integrity, corrosion protection for the Kenyan coast,
// and welder/weld qualification.
// ═══════════════════════════════════════════════════════════════════════════════

import {
  DeepDiveSection,
  DeepDiveBlock,
  FormulaBlock,
  SpecTable,
  Callout,
} from '@/components/content/EngineeringDeepDive';

export default function FabricationEngineeringDeepDive() {
  return (
    <DeepDiveSection
      id="fabrication-engineering"
      eyebrow="Engineering reference"
      title="Steel Fabrication Engineering: Grades, Welds & Corrosion in Kenya"
      accent="cyan"
      intro="A fabricated structure is only as honest as its weakest weld and its thinnest coat of paint. This is the engineering behind the steelwork we cut, weld and protect — material selection, joint integrity and the corrosion strategy that decides whether a structure lasts five years or fifty."
      sources={[
        'EN 10025 / ASTM A36 — structural steel grades and mechanical properties.',
        'Eurocode 3 (EN 1993) / AISC 360 — design of steel structures.',
        'AWS D1.1 / ISO 3834 — structural welding code and welding quality requirements.',
        'ISO 12944 — corrosion protection of steel by protective paint systems (atmospheric categories).',
        'ISO 1461 — hot-dip galvanizing of fabricated iron and steel articles.',
      ]}
    >
      {/* 1 ── Steel grades */}
      <DeepDiveBlock heading="1. Steel is not just steel — grade, yield and ductility" accent="cyan">
        <p>
          The number stamped on a steel section — S275, S355, A36 — is its <strong>minimum yield strength</strong> in MPa, the
          stress at which it stops springing back and starts to deform permanently. A higher grade carries more load per
          kilogram, so the right grade can mean lighter, cheaper structures; the wrong (or uncertified) steel is a structure
          that yields under a load it was supposed to hold. Just as important is <strong>ductility</strong> — the steel&apos;s
          ability to stretch and warn before it breaks rather than snapping brittle, which is what keeps a structure standing
          long enough to be evacuated in an overload or seismic event.
        </p>
        <p>
          On the Kenyan market, mill certificates matter: under-specified or re-rolled steel of unknown provenance is common and
          dangerous for load-bearing work. We specify to a known grade with traceable certification, because the design
          calculations are meaningless if the actual steel does not meet the yield assumed in them. For a portal frame, a mezzanine
          or a tank, that traceability is the foundation everything else rests on.
        </p>
      </DeepDiveBlock>

      <SpecTable
        caption="Common structural steel grades"
        accent="cyan"
        highlightCol={1}
        headers={['Grade', 'Min. yield', 'Typical use']}
        rows={[
          ['S235 / A283', '235 MPa', 'Light structures, general fabrication'],
          ['S275 / A36', '275 / 250 MPa', 'General structural steelwork'],
          ['S355 / A572-50', '355 MPa', 'Heavy frames, beams, long spans'],
          ['Stainless 304/316', '205–310 MPa', 'Hygiene, coastal/corrosive duty'],
        ]}
      />

      {/* 2 ── Design / section properties */}
      <DeepDiveBlock heading="2. Designing the member: stress, section and deflection" accent="cyan">
        <p>
          Sizing a beam or column is a balance of two checks: <strong>strength</strong> (will it yield or buckle?) and
          <strong> serviceability</strong> (will it sag or sway enough to crack finishes or alarm users, even if it does not
          fail?). Bending stress depends on the load, the span and the <strong>section modulus</strong> — a geometric property
          that rewards putting material far from the neutral axis, which is exactly why I-beams and hollow sections are so
          efficient and a solid bar is so wasteful.
        </p>
        <p>
          Deflection is the check that catches people out: a beam can be perfectly safe and still bounce or droop unacceptably.
          Codes cap deflection at a fraction of the span — often span/250 for general beams, tighter where brittle finishes
          hang below. We design to both limits and detail the connections to match, because a member is only as strong as the
          bolts and welds that transfer its load into the next one.
        </p>
      </DeepDiveBlock>

      <FormulaBlock
        label="Bending stress in a beam"
        expression="σ = M ÷ Z      Z = I ÷ c"
        where={[
          ['σ', 'bending stress (must stay below yield ÷ safety factor)'],
          ['M', 'bending moment from the load'],
          ['Z', 'section modulus of the chosen section'],
          ['I, c', 'second moment of area; distance to extreme fibre'],
        ]}
        example={<>For a simply-supported beam with a central point load, M = PL/4; choose a section whose Z keeps σ comfortably below the grade&apos;s yield with a safety factor.</>}
        accent="cyan"
      />

      {/* 3 ── Welding */}
      <DeepDiveBlock heading="3. The weld is the structure: process and joint integrity" accent="cyan">
        <p>
          Most fabrication failures are weld failures, and most weld failures are process failures. The four common processes
          trade speed against control: <strong>MMA/stick (SMAW)</strong> is portable and forgiving on site; <strong>MIG/MAG
          (GMAW)</strong> is fast for production; <strong>flux-cored (FCAW)</strong> suits heavy site work; and <strong>TIG
          (GTAW)</strong> gives the cleanest, most controlled welds for stainless and thin or critical work. The choice follows
          the material, the position and the quality the joint demands.
        </p>
        <p>
          The defects that matter are the ones you cannot see: <strong>lack of fusion</strong> and <strong>incomplete
          penetration</strong> leave a joint that looks finished but carries a fraction of its intended load; <strong>porosity</strong>
          from moisture or poor gas shielding riddles the weld with voids; <strong>undercut</strong> and <strong>cracking</strong>
          start fatigue failures. We control heat input, joint preparation, preheat where the section thickness demands it, and
          consumable storage (damp electrodes are a classic source of hydrogen cracking) — and we verify with the right
          non-destructive test for the joint&apos;s criticality.
        </p>
      </DeepDiveBlock>

      <SpecTable
        caption="Weld process selection and NDT"
        accent="cyan"
        highlightCol={0}
        headers={['Process', 'Strength', 'Best for', 'Typical NDT']}
        rows={[
          ['MMA / Stick (SMAW)', 'Portable, all-position', 'Site work, repairs', 'Visual, MPI'],
          ['MIG/MAG (GMAW)', 'Fast, clean', 'Workshop production', 'Visual, MPI'],
          ['Flux-cored (FCAW)', 'High deposition', 'Heavy site structures', 'UT, MPI'],
          ['TIG (GTAW)', 'Precise, low spatter', 'Stainless, thin, critical', 'Visual, dye-penetrant'],
        ]}
      />

      {/* 4 ── Corrosion */}
      <DeepDiveBlock heading="4. Corrosion protection: the coastal reality" accent="cyan">
        <p>
          Steel and the Kenyan environment are old enemies, and the right protection depends entirely on where the structure
          stands. ISO&nbsp;12944 grades atmospheres from C1 (dry interior) up to <strong>C5 and CX</strong> for the
          salt-laden, humid air of Mombasa, Kilifi and Diani — where unprotected steel can lose measurable thickness every year.
          Specifying an inland paint system for a coastal structure is one of the most expensive mistakes in fabrication,
          because the repair means scaffolding, blasting and re-coating a structure already in service.
        </p>
        <p>
          The strategy is layered: proper <strong>surface preparation</strong> (abrasive blasting to Sa&nbsp;2½ — paint over
          mill scale or rust simply peels), then the system to suit the category — a zinc-rich primer with epoxy and polyurethane
          topcoats for severe atmospheres, or <strong>hot-dip galvanizing</strong> (ISO&nbsp;1461) where a tough, self-healing
          metallic coat is wanted. For coastal and marine work we default to galvanizing plus a duplex paint system, because the
          cost of doing it once correctly is a fraction of the cost of fighting rust for the life of the asset.
        </p>
      </DeepDiveBlock>

      <SpecTable
        caption="ISO 12944 atmospheric corrosivity vs Kenyan siting"
        accent="cyan"
        highlightCol={2}
        headers={['Category', 'Environment', 'Kenyan example']}
        rows={[
          ['C2', 'Low — dry rural', 'Inland highlands, sheltered'],
          ['C3', 'Medium — urban/industrial', 'Nairobi, industrial areas'],
          ['C4', 'High — industrial/coastal', 'Near-coast, chemical plants'],
          ['C5 / CX', 'Very high — marine', 'Mombasa, Kilifi, Diani seafront'],
        ]}
      />

      {/* 5 ── Qualification */}
      <DeepDiveBlock heading="5. Qualified welders, qualified procedures" accent="cyan">
        <p>
          The final guarantee of a structure is not the steel or the paint but the people and procedures behind the welds. A
          <strong> Welding Procedure Specification (WPS)</strong> records the exact recipe — material, joint, process,
          consumable, current, preheat — proven by a tested <strong>Procedure Qualification Record (PQR)</strong>. Welders are
          then qualified against that procedure, so the weld on your structure is made the same way as the weld that was
          destructively tested and passed.
        </p>
        <p>
          ISO&nbsp;3834 sets the quality framework around all of this — traceability of materials, calibration of equipment,
          inspection records. For load-bearing and pressure work it is not bureaucracy; it is the documented chain that lets an
          engineer sign off the structure with confidence. We work to qualified procedures and hand over the records, because a
          weld you cannot trace is a weld you cannot trust.
        </p>
      </DeepDiveBlock>

      <Callout title="Send us your drawings" accent="cyan">
        Whether it is a portal frame, a mezzanine, tanks, walkways or architectural steel, send your drawings or a sketch and
        we&apos;ll return a fabrication quote with the steel grade, weld procedure and a corrosion system matched to your site —
        coastal or inland. Call <strong>+254&nbsp;768&nbsp;860&nbsp;665</strong> or use the enquiry form.
      </Callout>
    </DeepDiveSection>
  );
}
