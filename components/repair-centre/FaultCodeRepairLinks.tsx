import Link from 'next/link';
import { REPAIR_ARTICLES } from '@/lib/repair-centre';

/**
 * Bridge from a fault-code page into the Repair Centre guide that actually
 * diagnoses that class of fault.
 *
 * WHY THIS EXISTS: six weeks of first-party analytics showed /faults/spn-190
 * and its siblings carrying sustained, genuinely-searched traffic since June —
 * more than almost anything else technical on the site. Those visitors have
 * typed an engine fault code into Google, which is the highest diagnostic
 * intent a reader can arrive with. Meanwhile the Repair Centre holds 50+ guides
 * covering exactly those faults, and an audit on 2026-07-30 found ZERO links
 * from any fault-code page to any of them.
 *
 * We had built the supply and never connected it to the demand. This component
 * is that connection, and it is worth more than the next guide written.
 *
 * A fault code tells you the symptom class, not the fault, so the mapping is by
 * CATEGORY rather than by individual code — the guide teaches the diagnosis, the
 * code tells you where to start. Categories with no genuinely matching guide
 * render nothing rather than a forced link.
 */

/**
 * CONTENT-SAFETY WITHDRAWAL 2026-11-25: these Repair Centre articles had their
 * diagnosis sections withdrawn (running under a STOP condition). Fault pages
 * do not link into them until they are corrected and independently reviewed.
 */
export const WITHDRAWN_GUIDE_SLUGS: readonly string[] = [
  'generator-low-oil-pressure-shutdown',
  'generator-overheating',
  'diesel-engine-abnormal-noise',
  'generator-starts-then-stops',
  'controller-alarm-interpretation',
  'j1939-spn-fmi-explained',
];

/** Fault-code category -> Repair Centre article slugs that genuinely cover it. */
export const CATEGORY_TO_GUIDES: Record<string, string[]> = {
  'Engine Speed/Timing': ['generator-cranks-but-will-not-start'],
  'Fuel System': [
    'diesel-fuel-contamination',
    'generator-excessive-smoke',
  ],
  'Electrical Output': [
    'generator-produces-no-voltage-output',
    'generator-unstable-voltage',
    'generator-avr-fault-diagnosis',
  ],
  'Air Intake/Turbo': ['generator-air-restriction-turbocharger', 'generator-excessive-smoke'],
  'Starting System': ['starter-motor-clicks-but-will-not-crank', 'generator-battery-not-charging'],
  'Electrical/Starting': ['starter-motor-clicks-but-will-not-crank', 'generator-battery-not-charging'],
  'Safety/Control': ['safe-isolation-and-proving-dead'],
  'Electrical Safety': ['safe-isolation-and-proving-dead'],
  'Emissions/Aftertreatment': ['generator-excessive-smoke', 'generator-air-restriction-turbocharger'],
};

export default function FaultCodeRepairLinks({
  category,
  code,
}: {
  category: string;
  code: string;
}) {
  const slugs = CATEGORY_TO_GUIDES[category] ?? [];
  const bySlug = new Map(REPAIR_ARTICLES.map(a => [a.slug, a]));
  const guides = slugs
    .filter(s => !WITHDRAWN_GUIDE_SLUGS.includes(s))
    .map(s => bySlug.get(s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));
  if (guides.length === 0) return null;

  return (
    <section className="mt-8 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 p-6 md:p-8">
      <p className="text-xs uppercase tracking-[0.2em] text-cyan-400 font-semibold mb-2">
        Related Repair Centre guides
      </p>
      <h2 className="text-2xl font-bold text-white mb-3">
        Guides related to {code}
      </h2>
      <p className="text-slate-300 mb-6 max-w-3xl">
        A fault code names a symptom, not a cause. These guides cover this class of fault: what it
        means, its likely causes, the safety precautions, and when to call a qualified technician.
      </p>

      <ul className="grid sm:grid-cols-2 gap-3">
        {guides.map(a => (
          <li key={a.slug}>
            <Link
              href={`/repair-centre/${a.hub}/${a.slug}`}
              className="block h-full rounded-xl border border-slate-700 bg-slate-900/50 p-4 hover:border-cyan-500/60 transition-colors"
            >
              <h3 className="text-base font-bold text-white mb-1">{a.header.title}</h3>
              <p className="text-sm text-slate-400">
                {a.diagnosis.length} diagnostic steps · {a.header.difficulty} ·{' '}
                {a.header.competence.replace(/-/g, ' ')}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="/repair-centre"
        className="inline-block mt-5 text-cyan-400 hover:text-cyan-300 underline underline-offset-2 text-sm"
      >
        All diagnostic guides in the Repair Centre
      </Link>
    </section>
  );
}
