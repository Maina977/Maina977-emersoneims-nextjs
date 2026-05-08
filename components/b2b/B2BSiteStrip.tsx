/**
 * B2BSiteStrip — site-wide commercial positioning strip.
 *
 * Mounted in app/layout.tsx so EVERY page in the EmersonEIMS site carries a
 * single, consistent B2B message: this site serves professional, commercial,
 * institutional, industrial, project, facility, contractor, engineering,
 * procurement and business clients.
 *
 * Designed to be:
 *   - Thin (single row, ~32px tall) so it does not disrupt page layout.
 *   - Always-on (server component, no JS).
 *   - Consistent in position (directly under the main navigation).
 *   - Linkable to the contact / WhatsApp engineer for clear B2B intent.
 *   - Compatible with the richer per-page <B2BCommercialBand /> profile band.
 *
 * This component does NOT replace the per-page B2BCommercialBand. The two
 * complement each other: the strip guarantees universal coverage, the band
 * provides the deep commercial story on money pages.
 */

import Link from 'next/link';

const WHATSAPP = 'https://wa.me/254768860665';
const TEL = 'tel:+254768860665';

export default function B2BSiteStrip() {
  return (
    <div
      role="region"
      aria-label="B2B commercial positioning"
      className="w-full bg-slate-950 border-b border-amber-500/20 text-slate-200"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-1.5 flex flex-wrap items-center justify-center sm:justify-between gap-x-4 gap-y-1 text-[11px] sm:text-xs">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 text-amber-200 border border-amber-500/30 px-2 py-0.5 font-semibold uppercase tracking-wider">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400" aria-hidden="true" />
            B2B
          </span>
          <span className="text-slate-300">
            EmersonEIMS serves <span className="text-white font-medium">commercial, industrial, healthcare, telecom, hospitality, government &amp; contractor</span> clients.
          </span>
          <span className="hidden md:inline text-slate-500">
            • Engineering-led • SLA-backed • Documented commissioning
          </span>
        </p>
        <p className="flex items-center gap-3">
          <Link
            href="/contact?topic=b2b-enquiry"
            className="text-amber-300 hover:text-amber-200 font-medium underline-offset-2 hover:underline"
          >
            Talk to an engineer
          </Link>
          <a
            href={WHATSAPP}
            className="text-emerald-300 hover:text-emerald-200 font-medium underline-offset-2 hover:underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            WhatsApp
          </a>
          <a
            href={TEL}
            className="hidden sm:inline text-slate-300 hover:text-white"
          >
            +254&nbsp;768&nbsp;860&nbsp;665
          </a>
        </p>
      </div>
    </div>
  );
}
