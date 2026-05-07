/**
 * B2BCommercialBand — EmersonEIMS
 *
 * Reusable, presentational commercial-clarity strip injected at the top
 * of every priority money / diagnostic / industry / product page so the
 * whole site reads like one B2B engineering company.
 *
 * Renders six things in one compact block:
 *   1. Eyebrow + plain B2B headline + subtitle
 *   2. "Who this is for" industry chips
 *   3. Problem -> Solution -> Outcome (3 columns)
 *   4. Trust strip
 *   5. Conversion CTAs (primary / secondary / tertiary)
 *   6. Inline Service JSON-LD (FAQ-friendly, lightweight)
 *
 * No hooks, no client state — safe to render inside both server and
 * 'use client' parent pages.
 */

import Link from 'next/link';
import type { B2BProfile } from '@/lib/b2b/pageProfiles';

type Props = {
  profile: B2BProfile;
  /** Optional: override accent ring/border color */
  className?: string;
};

const ACCENT_MAP: Record<NonNullable<B2BProfile['accent']>, {
  ring: string;
  text: string;
  chip: string;
  pill: string;
  primaryBg: string;
  primaryHover: string;
  secondaryBorder: string;
  secondaryHover: string;
}> = {
  amber:   { ring: 'ring-amber-500/30',   text: 'text-amber-300',   chip: 'bg-amber-500/10 border-amber-500/30 text-amber-200',   pill: 'bg-amber-500/15 text-amber-200',   primaryBg: 'bg-amber-500',   primaryHover: 'hover:bg-amber-400',   secondaryBorder: 'border-amber-400/60',   secondaryHover: 'hover:bg-amber-500/10' },
  cyan:    { ring: 'ring-cyan-500/30',    text: 'text-cyan-300',    chip: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200',    pill: 'bg-cyan-500/15 text-cyan-200',    primaryBg: 'bg-cyan-500',    primaryHover: 'hover:bg-cyan-400',    secondaryBorder: 'border-cyan-400/60',    secondaryHover: 'hover:bg-cyan-500/10' },
  emerald: { ring: 'ring-emerald-500/30', text: 'text-emerald-300', chip: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200', pill: 'bg-emerald-500/15 text-emerald-200', primaryBg: 'bg-emerald-500', primaryHover: 'hover:bg-emerald-400', secondaryBorder: 'border-emerald-400/60', secondaryHover: 'hover:bg-emerald-500/10' },
  violet:  { ring: 'ring-violet-500/30',  text: 'text-violet-300',  chip: 'bg-violet-500/10 border-violet-500/30 text-violet-200',  pill: 'bg-violet-500/15 text-violet-200',  primaryBg: 'bg-violet-500',  primaryHover: 'hover:bg-violet-400',  secondaryBorder: 'border-violet-400/60',  secondaryHover: 'hover:bg-violet-500/10' },
  sky:     { ring: 'ring-sky-500/30',     text: 'text-sky-300',     chip: 'bg-sky-500/10 border-sky-500/30 text-sky-200',     pill: 'bg-sky-500/15 text-sky-200',     primaryBg: 'bg-sky-500',     primaryHover: 'hover:bg-sky-400',     secondaryBorder: 'border-sky-400/60',     secondaryHover: 'hover:bg-sky-500/10' },
  rose:    { ring: 'ring-rose-500/30',    text: 'text-rose-300',    chip: 'bg-rose-500/10 border-rose-500/30 text-rose-200',    pill: 'bg-rose-500/15 text-rose-200',    primaryBg: 'bg-rose-500',    primaryHover: 'hover:bg-rose-400',    secondaryBorder: 'border-rose-400/60',    secondaryHover: 'hover:bg-rose-500/10' },
  orange:  { ring: 'ring-orange-500/30',  text: 'text-orange-300',  chip: 'bg-orange-500/10 border-orange-500/30 text-orange-200',  pill: 'bg-orange-500/15 text-orange-200',  primaryBg: 'bg-orange-500',  primaryHover: 'hover:bg-orange-400',  secondaryBorder: 'border-orange-400/60',  secondaryHover: 'hover:bg-orange-500/10' },
  indigo:  { ring: 'ring-indigo-500/30',  text: 'text-indigo-300',  chip: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-200',  pill: 'bg-indigo-500/15 text-indigo-200',  primaryBg: 'bg-indigo-500',  primaryHover: 'hover:bg-indigo-400',  secondaryBorder: 'border-indigo-400/60',  secondaryHover: 'hover:bg-indigo-500/10' },
};

export default function B2BCommercialBand({ profile, className = '' }: Props) {
  const a = ACCENT_MAP[profile.accent ?? 'cyan'];

  // Lightweight JSON-LD: Service + FAQ-flavoured PSO triplets.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: profile.headline,
    description: profile.subtitle,
    provider: {
      '@type': 'Organization',
      name: 'EmersonEIMS',
      url: 'https://www.emersoneims.com',
      telephone: '+254768860665',
    },
    areaServed: { '@type': 'Country', name: 'Kenya' },
    audience: profile.whoFor.map((w) => ({ '@type': 'BusinessAudience', name: w })),
  };

  return (
    <section
      aria-label="Commercial overview"
      className={`relative z-30 border-b border-white/5 bg-gradient-to-b from-black via-slate-950 to-black/95 ${className}`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Eyebrow + headline */}
        <div className={`inline-flex items-center gap-2 rounded-full border ${a.chip} px-3 py-1 text-xs font-medium tracking-wider uppercase`}>
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${a.primaryBg}`} />
          {profile.eyebrow}
        </div>
        <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-semibold text-white leading-tight max-w-4xl">
          {profile.headline}
        </h2>
        <p className="mt-3 text-base sm:text-lg text-slate-300 max-w-3xl">
          {profile.subtitle}
        </p>

        {/* Who this is for */}
        <div className="mt-6">
          <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">Built for</div>
          <ul className="flex flex-wrap gap-2">
            {profile.whoFor.map((w) => (
              <li
                key={w}
                className={`text-xs sm:text-sm rounded-full px-3 py-1 border border-white/10 ${a.pill}`}
              >
                {w}
              </li>
            ))}
          </ul>
        </div>

        {/* Problem -> Solution -> Outcome */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {profile.pso.map((row, i) => (
            <article
              key={i}
              className={`rounded-xl border border-white/10 bg-white/[0.02] p-5 ring-1 ${a.ring}`}
            >
              <div className="text-[10px] uppercase tracking-wider text-slate-400">Problem</div>
              <p className="mt-1 text-sm text-slate-200">{row.problem}</p>
              <div className={`mt-4 text-[10px] uppercase tracking-wider ${a.text}`}>EmersonEIMS solution</div>
              <p className="mt-1 text-sm text-white">{row.solution}</p>
              <div className="mt-4 text-[10px] uppercase tracking-wider text-emerald-300">Business outcome</div>
              <p className="mt-1 text-sm text-emerald-100/90">{row.outcome}</p>
            </article>
          ))}
        </div>

        {/* Trust strip */}
        <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs sm:text-sm text-slate-300">
          {profile.trust.map((t) => (
            <li key={t} className="inline-flex items-center gap-2">
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${a.primaryBg}`} />
              {t}
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap gap-3">
          {profile.ctas.map((cta) => {
            const variant = cta.variant ?? 'primary';
            const base = 'inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition-colors';
            const cls =
              variant === 'primary'
                ? `${base} ${a.primaryBg} ${a.primaryHover} text-black`
                : variant === 'secondary'
                ? `${base} border ${a.secondaryBorder} ${a.secondaryHover} text-white`
                : `${base} text-slate-200 hover:text-white underline-offset-4 hover:underline`;
            const isExternal = /^https?:\/\//.test(cta.href) || cta.href.startsWith('tel:') || cta.href.startsWith('mailto:');
            if (isExternal) {
              return (
                <a
                  key={cta.label}
                  href={cta.href}
                  className={cls}
                  aria-label={cta.ariaLabel ?? cta.label}
                  rel={cta.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  target={cta.href.startsWith('http') ? '_blank' : undefined}
                >
                  {cta.label}
                </a>
              );
            }
            return (
              <Link key={cta.label} href={cta.href} className={cls} aria-label={cta.ariaLabel ?? cta.label}>
                {cta.label}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
