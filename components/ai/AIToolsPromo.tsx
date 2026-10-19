// ═══════════════════════════════════════════════════════════════════════════════
// AIToolsPromo — server-rendered (crawlable) marketing band for the 6 flagship AI
// tools. It only LINKS to the tools and describes them for SEO — it does not import,
// modify or change any tool. Place once (homepage) to give the tools strong internal
// links from the highest-authority page without duplicating content across pages.
// ═══════════════════════════════════════════════════════════════════════════════

import Link from 'next/link';
import { DeepDiveSection } from '@/components/content/EngineeringDeepDive';

const TOOLS: { href: string; name: string; tag: string; blurb: string }[] = [
  {
    href: '/generator-oracle',
    name: 'Generator Oracle',
    tag: 'Generator fault codes & diagnosis',
    blurb: 'Look up controller alarms (DSE, ComAp, Woodward, SmartGen, CAT PowerWizard and more) and J1939 engine codes, follow the checks, and reach an engineer in one tap.',
  },
  {
    href: '/solar-genius-pro',
    name: 'Solar Genius Pro',
    tag: 'Solar sizing estimate',
    blurb: 'A free first estimate of panels, inverter, battery, cost and payback from your own consumption, using NASA sun-hours for your area, plus an inverter fault-code library.',
  },
  {
    href: '/aquascan-pro-v3',
    name: 'AquaScan Pro',
    tag: 'Borehole pre-screen',
    blurb: 'A desktop first look at a borehole site from public rainfall, soil and water-point data, with every source named — the step before a field survey, not a replacement for one.',
  },
  {
    href: '/solutions/building',
    name: 'Pro Building Suite',
    tag: 'Engineering calculators',
    blurb: 'Hand-checked building calculators — wind load, bolt and beam checks, drainage runoff, bearing capacity, U-values and acoustics — with a route to our engineers for full design.',
  },
  {
    href: '/diagnostics',
    name: 'Diagnostic Suite',
    tag: 'The complete diagnostic cockpit',
    blurb: 'A single guided diagnostic experience across power systems — search the full error-code database and walk structured fault trees to a root cause.',
  },
  {
    href: '/hub/solar-ups',
    name: 'Solar & UPS Intelligence Hub',
    tag: 'Reference + sizing tools',
    blurb: 'A working hub for solar and UPS engineering — sizing, battery runtime, redundancy, fault codes and power-quality guidance in one place.',
  },
];

export default function AIToolsPromo() {
  return (
    <DeepDiveSection
      id="ai-tools"
      eyebrow="Engineering intelligence"
      title="6 Free Engineering Tools"
      accent="violet"
      intro="Beyond installing and maintaining power systems, EmersonEIMS has built free engineering tools for diagnosis, sizing and reference. Each one tells you what it can and cannot do, and each one ends with a route to our engineers."
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOOLS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all hover:border-violet-500/40 hover:bg-white/[0.06]"
          >
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-violet-300/70 mb-1">{t.tag}</p>
            <h3 className="text-lg font-semibold text-violet-300 group-hover:text-violet-200 mb-2">{t.name}</h3>
            <p className="text-sm text-white/65 leading-relaxed">{t.blurb}</p>
            <span className="mt-3 inline-block text-xs font-semibold tracking-wider uppercase text-white/55 group-hover:text-violet-300">
              Open the tool →
            </span>
          </Link>
        ))}
      </div>

      <p className="text-white/70 leading-relaxed">
        These tools are how we help before a site visit: a technician anywhere can look up a generator fault, get a first solar
        estimate or pre-screen a borehole site before an engineer arrives. They are part of the same engineering discipline behind our field work, and they are{' '}
        <Link href="/ai-tools" className="text-violet-300 hover:text-violet-200 underline underline-offset-2">all gathered on our AI Tools hub</Link>.
        When the tool points to a real-world job, our engineers are a call away on{' '}
        <strong>+254&nbsp;768&nbsp;860&nbsp;665</strong> or <strong>+254&nbsp;782&nbsp;914&nbsp;717</strong>.
      </p>
    </DeepDiveSection>
  );
}
