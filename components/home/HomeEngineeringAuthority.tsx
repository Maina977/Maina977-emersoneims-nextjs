// ═══════════════════════════════════════════════════════════════════════════════
// HomeEngineeringAuthority — additive, server-rendered editorial/authority band for
// the homepage. Gives crawlers substantial, keyword-rich, UNIQUE text (the Kenyan
// power context + breadth of disciplines + standards-led method) and a dense set of
// internal links into every service deep-dive. Built in the site's premium dark/amber
// language; does not replace or disturb the existing Awwwards sections.
// ═══════════════════════════════════════════════════════════════════════════════

import Link from 'next/link';
import {
  DeepDiveSection,
  DeepDiveBlock,
  Callout,
} from '@/components/content/EngineeringDeepDive';

const DISCIPLINES: { href: string; title: string; blurb: string }[] = [
  { href: '/generators', title: 'Diesel Generators', blurb: 'Cummins & multi-brand supply, sizing, repair, ATS — site-corrected for Kenyan altitude.' },
  { href: '/solar', title: 'Solar PV & Hybrid', blurb: 'Grid-tie, hybrid and off-grid systems engineered for real irradiance and load.' },
  { href: '/solutions/ups', title: 'UPS Systems', blurb: 'Online double-conversion, runtime and N+1 redundancy for critical loads.' },
  { href: '/solutions/high-voltage', title: 'High Voltage', blurb: '11/33 kV intakes, transformers, switchgear, protection and earthing.' },
  { href: '/solutions/motor-rewinding', title: 'Motor Rewinding', blurb: 'Efficiency-preserving rewinds with a documented test sheet.' },
  { href: '/solutions/ac', title: 'HVAC & Cooling', blurb: 'Calculated cooling loads, efficient inverter and VRF systems.' },
  { href: '/solutions/borehole-pumps', title: 'Borehole Pumps', blurb: 'Pumps matched to the well at the correct duty point, solar-ready.' },
  { href: '/solutions/incinerators', title: 'Incinerators', blurb: 'Dual-chamber, NEMA-compliant medical-waste incineration.' },
  { href: '/solutions/fabrication', title: 'Steel Fabrication', blurb: 'Certified steel, qualified welds, coastal-grade corrosion protection.' },
];

export default function HomeEngineeringAuthority() {
  return (
    <DeepDiveSection
      id="why-emersoneims"
      eyebrow="Engineering authority"
      title="Engineered Power for Kenyan Industry — One Partner, Every Discipline"
      accent="amber"
      intro="EmersonEIMS is a B2B power-engineering partner for the businesses that cannot afford to go dark — manufacturers, hospitals, telecom, commercial property, agribusiness and construction across all 47 counties. We design, install, commission and maintain power as a system, to standard, with the documentation to prove it."
    >
      <DeepDiveBlock heading="The Kenyan power reality" accent="amber">
        <p>
          Kenya&apos;s grid has improved enormously, yet most serious operations still lose hours to outages, sags and voltage
          events every year — quietly paying in spoilt product, idle shifts, damaged equipment and overtime. Add the altitude of
          the highlands, the salt and heat of the coast, and the brutal starting currents of industrial plant, and it becomes
          clear why imported sizing charts and box-shifting suppliers leave so many sites under-protected. Reliable power here is
          an engineering problem, not a purchasing one.
        </p>
        <p>
          That is the gap we exist to close. Every recommendation we make starts from your actual load and your actual site —
          measured, not assumed — and ends with a system sized for the worst real case, not the brochure best case. Whether the
          answer is a <Link href="/generators" className="text-amber-400 hover:text-amber-300 underline underline-offset-2">diesel generator</Link>,
          a <Link href="/solar" className="text-amber-400 hover:text-amber-300 underline underline-offset-2">solar-hybrid</Link> system
          that slashes the diesel bill, or a <Link href="/solutions/ups" className="text-amber-400 hover:text-amber-300 underline underline-offset-2">UPS</Link>
          bridging to a generator for millisecond-critical loads, the design follows the need.
        </p>
      </DeepDiveBlock>

      <DeepDiveBlock heading="One engineering partner, every discipline" accent="amber">
        <p>
          Most sites juggle a generator vendor, an electrician, a solar installer, a pump guy and a fabricator — none of whom
          owns the result. We bring the full stack of power and engineering disciplines under one contract and one SLA, so the
          generator, the UPS, the solar, the switchgear and the controls are designed to cooperate rather than collected to
          coexist. Explore any discipline below for the engineering detail — sizing maths, derating, formulas and field practice:
        </p>
      </DeepDiveBlock>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DISCIPLINES.map((d) => (
          <Link
            key={d.href}
            href={d.href}
            className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all hover:border-amber-500/40 hover:bg-white/[0.06]"
          >
            <h3 className="text-base font-semibold text-amber-400 group-hover:text-amber-300 mb-1.5">{d.title}</h3>
            <p className="text-sm text-white/60 leading-relaxed">{d.blurb}</p>
            <span className="mt-3 inline-block text-xs font-semibold tracking-wider uppercase text-white/40 group-hover:text-amber-400">
              Read the engineering →
            </span>
          </Link>
        ))}
      </div>

      <DeepDiveBlock heading="Engineering-led, standards-backed, documented" accent="amber">
        <p>
          What separates a professional installation from a dangerous one is rarely visible on a quotation: cables sized for
          fault withstand and volt-drop, protection graded so a single fault never blacks out a whole site, earthing designed and
          tested, and every set commissioned under load before it is trusted. We work to recognised standards (IEC&nbsp;60364,
          ISO&nbsp;8528, IEEE and NFPA practice) and hand over the evidence — single-line diagrams, test certificates and O&amp;M
          manuals — so your auditors, insurers and board can see the system was engineered, not assembled. See
          our <Link href="/solutions" className="text-amber-400 hover:text-amber-300 underline underline-offset-2">delivery method</Link>,
          the <Link href="/industries" className="text-amber-400 hover:text-amber-300 underline underline-offset-2">requirements by sector</Link>,
          or <Link href="/about-us" className="text-amber-400 hover:text-amber-300 underline underline-offset-2">who we are</Link>.
        </p>
        <p>
          Behind it all is a commitment that turns a sale into a partnership: a 3-year warranty, SLA-backed maintenance, locally
          held fast-moving spares, and 24/7 emergency response across the country. Power you can document is power you can depend
          on — and that is the only kind worth installing.
        </p>
      </DeepDiveBlock>

      <Callout title="Talk to an engineer, not a salesperson" accent="amber">
        Send us your load list, single-line diagram or last 12 utility bills and we&apos;ll return a site-corrected design with a
        ten-year total-cost-of-ownership — free, and in writing. Call <strong>+254&nbsp;768&nbsp;860&nbsp;665</strong> or
        <strong> +254&nbsp;782&nbsp;914&nbsp;717</strong>, or use the <Link href="/contact" className="text-amber-400 hover:text-amber-300 underline underline-offset-2">enquiry form</Link>.
      </Callout>
    </DeepDiveSection>
  );
}
