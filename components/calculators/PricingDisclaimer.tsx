/**
 * PRICING DISCLAIMER BANNER
 * -------------------------
 * Shared across every cost calculator on the site.
 *
 * Why it exists:
 *  - Calculators run on indicative Kenyan-market unit rates (KES) — they
 *    assume mid-range, locally-supported brands and a standard install
 *    profile. Real projects vary by site access, tier of brand chosen,
 *    civil works, transport, taxes, and turnkey vs supply-only scope.
 *  - We must always be transparent that the figure shown is guidance,
 *    NOT a binding offer. A firm quote requires a site visit / load
 *    schedule review.
 *
 * Usage:
 *   <PricingDisclaimer />               // default copy
 *   <PricingDisclaimer scope="solar" /> // tweak the lead noun
 */
import React from 'react';

export interface PricingDisclaimerProps {
  /** Short label for the calculator domain, used in the lead sentence. */
  scope?: string;
  /** Optional className override for the wrapper. */
  className?: string;
}

export default function PricingDisclaimer({
  scope = 'project',
  className = '',
}: PricingDisclaimerProps) {
  return (
    <div
      role="note"
      className={
        'mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100 ' +
        className
      }
    >
      <p className="font-semibold text-amber-300">
        Indicative {scope} cost — request a firm quote
      </p>
      <p className="mt-1 text-amber-100/90 leading-snug">
        Figures use mid-range Kenyan market rates (KES) for locally-supported
        brands and a standard installation profile. Final price depends on
        brand tier, site access, civil works, transport, taxes and scope
        (supply-only vs turnkey). Call <a href="tel:+254768860665" className="underline">+254 768 860 665</a>{' '}
        or WhatsApp for a binding quotation tailored to your site.
      </p>
    </div>
  );
}
