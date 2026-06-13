// ═══════════════════════════════════════════════════════════════════════════════
// StandardsReferenceDeepDive — additive, server-rendered quick-reference for the
// Technical Bible page: the standards that govern this work, unit conversions, and an
// index of the key engineering formulas used across the site. Genuinely unique
// reference content (a glossary), not a duplicate of any service page.
// ═══════════════════════════════════════════════════════════════════════════════

import {
  DeepDiveSection,
  DeepDiveBlock,
  SpecTable,
  Callout,
} from '@/components/content/EngineeringDeepDive';

export default function StandardsReferenceDeepDive() {
  return (
    <DeepDiveSection
      id="standards-reference"
      eyebrow="Reference"
      title="Standards, Units & Formula Index for Power Engineering"
      accent="cyan"
      intro="A quick reference for the standards we design to, the unit conversions that trip people up, and the core formulas used across our service pages. Bookmark this — it is the engineering shorthand behind every quotation and commissioning sheet we produce."
    >
      <DeepDiveBlock heading="The standards that govern this work" accent="cyan">
        <p>
          Good power engineering is not opinion — it is conformance to recognised standards, and knowing which standard governs
          which decision is half of doing the job properly. The table below is the working set we design and verify against,
          from generator ratings to harmonic limits to corrosion protection.
        </p>
      </DeepDiveBlock>

      <SpecTable
        caption="Key standards reference"
        accent="cyan"
        highlightCol={0}
        headers={['Standard', 'Governs']}
        rows={[
          ['ISO 8528', 'Generator-set ratings (ESP/PRP/COP), performance classes, tests'],
          ['ISO 3046', 'Engine power adjustment for site altitude/temperature'],
          ['IEC 60034', 'Rotating machines — efficiency classes (IE1–IE4), duty types'],
          ['IEC 60076', 'Power transformers — losses, ratings, temperature rise'],
          ['IEC 60364', 'Low-voltage electrical installations — design & verification'],
          ['IEC 60909', 'Short-circuit current calculation'],
          ['IEC 61215 / 61730', 'PV module performance & safety qualification'],
          ['IEC 62040', 'UPS — performance classification (VFI/VI/VFD)'],
          ['IEEE 519', 'Harmonic control limits (THD)'],
          ['IEEE 1584', 'Arc-flash hazard calculation'],
          ['NFPA 110', 'Emergency/standby power — test & maintenance'],
          ['ISO 12944 / ISO 1461', 'Corrosion protection by paint / hot-dip galvanizing'],
        ]}
      />

      <DeepDiveBlock heading="Unit conversions that matter on site" accent="cyan">
        <p>
          A surprising number of sizing errors come from mixing units — quoting kVA against a kW load, or a US-ton cooling
          figure against a kW chiller. These are the conversions we use daily.
        </p>
      </DeepDiveBlock>

      <SpecTable
        caption="Common conversions"
        accent="cyan"
        highlightCol={0}
        headers={['From', 'To', 'Relationship']}
        rows={[
          ['kVA', 'kW', 'kW = kVA × PF (PF ≈ 0.8 for diesel sets)'],
          ['kW', 'kVA', 'kVA = kW ÷ PF'],
          ['Horsepower (HP)', 'kW', '1 HP ≈ 0.746 kW'],
          ['Refrigeration ton (TR)', 'kW', '1 TR ≈ 3.517 kW (12,000 BTU/h)'],
          ['BTU/h', 'kW', '1 kW ≈ 3,412 BTU/h'],
          ['Peak sun hours (PSH)', 'kWh/kWp/day', '1 PSH ≈ 1 kWh per kWp (before losses)'],
          ['Litres diesel', 'energy', '≈ 3.3–4.0 kWh electrical per litre (load-dependent)'],
        ]}
      />

      <DeepDiveBlock heading="Formula index — and where each is used" accent="cyan">
        <p>
          The core formulas behind our designs, gathered in one place. Each links conceptually to the service page where it is
          worked through with examples.
        </p>
      </DeepDiveBlock>

      <SpecTable
        caption="Engineering formula index"
        accent="cyan"
        highlightCol={0}
        headers={['Quantity', 'Formula', 'Used in']}
        rows={[
          ['Apparent power', 'kVA = kW ÷ PF', 'Generators, UPS sizing'],
          ['Altitude derate', 'P_site ≈ P_rated × (1−aΔh) × (1−bΔt)', 'Generator sizing (Kenya)'],
          ['Solar array', 'kWp = E_daily ÷ (PSH × PR)', 'Solar sizing'],
          ['Module temp power', 'P = P_stc × [1 + γ(T−25)]', 'Solar derating'],
          ['Battery capacity', 'C = (E × Days) ÷ (DoD × η)', 'Solar / UPS storage'],
          ['Affinity law (power)', 'P₂/P₁ = (N₂/N₁)³', 'Motors / VFD energy'],
          ['Capacitor kVAr', 'Q = P(tanφ₁ − tanφ₂)', 'Power-factor correction'],
          ['Total dynamic head', 'TDH = static + drawdown + friction + pressure', 'Borehole pumps'],
          ['Availability', 'A = MTBF ÷ (MTBF + MTTR)', 'Maintenance / UPS redundancy'],
          ['Harmonic distortion', 'THD = √(ΣVₙ²) ÷ V₁', 'Power quality'],
        ]}
      />

      <Callout title="Need the worked examples?" accent="cyan">
        Every formula above is worked through with Kenyan numbers on its service page — generators, solar, UPS, motors, borehole
        and power-quality. For a design applied to your site, call <strong>+254&nbsp;768&nbsp;860&nbsp;665</strong> or
        <strong> +254&nbsp;782&nbsp;914&nbsp;717</strong>.
      </Callout>
    </DeepDiveSection>
  );
}
