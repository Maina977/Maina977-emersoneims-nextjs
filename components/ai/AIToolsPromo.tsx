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
    tag: 'AI generator diagnostics',
    blurb: 'Search 400,000+ fault codes, read interactive wiring diagrams, and run AI-guided troubleshooting for Cummins, Perkins, FG Wilson and every major controller (DSE, ComAp, PowerWizard).',
  },
  {
    href: '/solar-genius-pro',
    name: 'Solar Genius Pro',
    tag: 'AI solar design & sizing',
    blurb: 'Design and optimise a solar system in minutes — array, inverter and battery sizing tuned to real Kenyan irradiance, with fault codes and a design studio.',
  },
  {
    href: '/aquascan-pro-v3',
    name: 'AquaScan Pro',
    tag: 'AI water & borehole intelligence',
    blurb: 'Site and borehole analysis with satellite and NASA data, pump matching, water-quality insight and predictive maintenance for water systems.',
  },
  {
    href: '/pro-building-suite',
    name: 'Pro Building Suite',
    tag: 'AI architecture + structural + QS',
    blurb: 'Architectural design, structural engineering analysis and professional BOQ generation in one platform — complete construction documentation in minutes.',
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
      title="6 Powerful AI Tools — Free to Explore"
      accent="violet"
      intro="Beyond installing and maintaining power systems, EmersonEIMS has built a suite of AI engineering tools used across Africa and beyond — diagnostics, design, sizing and documentation that put professional-grade engineering in your hands in minutes. Explore any of them free."
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOOLS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all hover:border-violet-500/40 hover:bg-white/[0.06]"
          >
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-violet-300/70 mb-1">{t.tag}</p>
            <h3 className="text-lg font-semibold text-violet-300 group-hover:text-violet-200 mb-2">{t.name}</h3>
            <p className="text-sm text-white/65 leading-relaxed">{t.blurb}</p>
            <span className="mt-3 inline-block text-xs font-semibold tracking-wider uppercase text-white/40 group-hover:text-violet-300">
              Open the tool →
            </span>
          </Link>
        ))}
      </div>

      <p className="text-white/70 leading-relaxed">
        These tools are how we reach far beyond a single site visit: a technician in any of Kenya&apos;s 47 counties — or anywhere
        in the region — can diagnose a generator fault, size a solar array, analyse a borehole or generate a BOQ without waiting
        for an engineer to arrive. They are part of the same engineering discipline behind our field work, and they are{' '}
        <Link href="/ai-tools" className="text-violet-300 hover:text-violet-200 underline underline-offset-2">all gathered on our AI Tools hub</Link>.
        When the tool points to a real-world job, our engineers are a call away on{' '}
        <strong>+254&nbsp;768&nbsp;860&nbsp;665</strong> or <strong>+254&nbsp;782&nbsp;914&nbsp;717</strong>.
      </p>
    </DeepDiveSection>
  );
}
