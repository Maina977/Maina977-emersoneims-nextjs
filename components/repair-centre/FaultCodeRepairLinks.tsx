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

/** Fault-code category -> Repair Centre article slugs that genuinely cover it. */
const CATEGORY_TO_GUIDES: Record<string, string[]> = {
  'Engine Speed/Timing': ['generator-cranks-but-will-not-start', 'j1939-spn-fmi-explained'],
  'Fuel System': [
    'diesel-fuel-contamination',
    'generator-starts-then-stops',
    'generator-excessive-smoke',
  ],
  'Lubrication System': ['generator-low-oil-pressure-shutdown', 'diesel-engine-abnormal-noise'],
  'Cooling System': ['generator-overheating'],
  'Electrical Output': [
    'generator-produces-no-voltage-output',
    'generator-unstable-voltage',
    'generator-avr-fault-diagnosis',
  ],
  'ECM/Controller': ['controller-alarm-interpretation', 'j1939-spn-fmi-explained'],
  'Air Intake/Turbo': ['generator-air-restriction-turbocharger', 'generator-excessive-smoke'],
  'Starting System': ['starter-motor-clicks-but-will-not-crank', 'generator-battery-not-charging'],
  'Electrical/Starting': ['starter-motor-clicks-but-will-not-crank', 'generator-battery-not-charging'],
  'Engine Protection': ['controller-alarm-interpretation', 'generator-low-oil-pressure-shutdown'],
  'Safety/Control': ['safe-isolation-and-proving-dead', 'controller-alarm-interpretation'],
  'Electrical Safety': ['safe-isolation-and-proving-dead'],
  'Communication/Network': ['controller-alarm-interpretation', 'j1939-spn-fmi-explained'],
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
  const guides = slugs.map(s => bySlug.get(s)).filter((a): a is NonNullable<typeof a> => Boolean(a));
  if (guides.length === 0) return null;

  return (
    <section className="mt-8 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 p-6 md:p-8">
      <p className="text-xs uppercase tracking-[0.2em] text-cyan-400 font-semibold mb-2">
        Full diagnostic guide
      </p>
      <h2 className="text-2xl font-bold text-white mb-3">
        {code} tells you where to start. These tell you what to do next.
      </h2>
      <p className="text-slate-300 mb-6 max-w-3xl">
        A fault code names a symptom, not a cause. Our engineers have written the diagnostic sequence
        they use on site for this class of fault — ranked causes, ordered steps with the reading
        expected at each one, and the point at which to stop and call someone.
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
