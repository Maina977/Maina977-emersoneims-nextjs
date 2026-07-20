/**
 * SiteSurveyPolicy — the official EmersonEIMS site-survey & diagnostic fee policy.
 *
 * Owner-supplied wording (2026-07-18). This is a REAL, authorised business
 * policy — do not paraphrase the commercial terms and do not invent a fee
 * amount (the figure is quoted per job, so none is stated here).
 *
 * WHY IT EXISTS: the site previously advertised "free site surveys/visits" in
 * several places while the booking page referred to a "paid site survey" — an
 * internal contradiction that set the wrong customer expectation and damaged
 * trust at the point of sale. This component is the single source of truth.
 *
 * Two variants:
 *   - `full`    → complete policy block for service/contact/booking pages
 *   - `compact` → short reassurance line for tight spaces (forms, CTAs)
 */
import Link from 'next/link';

export const SURVEY_POLICY_POINTS = [
  'Technician site visit and inspection',
  'Testing, troubleshooting and fault identification',
  'A clear technical solution and written quotation',
];

export default function SiteSurveyPolicy({
  variant = 'full',
  className = '',
}: {
  variant?: 'full' | 'compact';
  className?: string;
}) {
  if (variant === 'compact') {
    return (
      <p className={`text-sm text-slate-300 ${className}`}>
        <span className="font-semibold text-amber-400">Site survey &amp; diagnostic fee:</span>{' '}
        a modest fee covers the technician’s visit, inspection, testing and fault
        diagnosis, plus your technical solution and quotation.{' '}
        <span className="font-semibold text-emerald-400">
          If you award the work to EmersonEIMS, the full survey fee is deducted from
          the contract amount.
        </span>
      </p>
    );
  }

  return (
    <section
      aria-labelledby="survey-policy-heading"
      className={`rounded-2xl border border-amber-500/30 bg-gradient-to-br from-slate-900 to-slate-950 p-6 md:p-8 ${className}`}
    >
      <h2 id="survey-policy-heading" className="text-xl md:text-2xl font-bold text-white">
        Site Survey &amp; Diagnostic Fee — and why it protects you
      </h2>

      <p className="mt-4 leading-relaxed text-slate-300">
        At EmersonEIMS we do not rely on assumptions when recommending repairs,
        installations or equipment. Every solution begins with a proper site survey
        and technical diagnosis carried out by a qualified technician.
      </p>

      <p className="mt-4 leading-relaxed text-slate-300">
        To ensure we provide an accurate and professional assessment, we charge a
        modest site survey and diagnostic fee. It covers:
      </p>

      <ul className="mt-3 space-y-2">
        {SURVEY_POLICY_POINTS.map((point) => (
          <li key={point} className="flex items-start gap-3 text-slate-300">
            <span aria-hidden="true" className="mt-1 text-amber-400">✔</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4">
        <p className="font-semibold text-emerald-300">
          Award the work to EmersonEIMS and the full survey fee is deducted from the
          total contract amount.
        </p>
      </div>

      <p className="mt-5 leading-relaxed text-slate-400">
        This approach protects you from incorrect diagnosis, unnecessary expenditure
        and inaccurate quotations — and ensures the solution we propose is technically
        suitable and properly costed.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/contact"
          className="rounded-lg bg-amber-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-amber-400"
        >
          Book a site survey
        </Link>
        <a
          href="tel:+254768860665"
          className="rounded-lg border border-slate-600 px-5 py-3 font-semibold text-slate-200 transition hover:border-amber-500 hover:text-amber-400"
        >
          Call +254 768 860 665
        </a>
      </div>
    </section>
  );
}
