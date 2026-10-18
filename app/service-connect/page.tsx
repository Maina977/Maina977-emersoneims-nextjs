import type { Metadata } from 'next';
import Link from 'next/link';
import { SERVICE_ACTIONS, COMPANY_PHONE_DISPLAY, COMPANY_PHONE_TEL, waLink } from '@/lib/serviceConnect/actions';
import { RESPONSE_SUMMARY } from '@/lib/business/responseTime';

/*
 * SERVICE CONNECT — Phase 1 (owner-approved 2026-10-18).
 *
 * noindex, follow ON PURPOSE: today this page is a menu of six links into
 * pages that already exist (/booking, /contact, WhatsApp, the phone). A page
 * that is mostly links is thin content, and this site is recovering from a
 * Google demotion. It stays out of the sitemap until it carries something of
 * its own (e.g. real job tracking in Phase 2). Visitors reach it from the
 * floating launcher and the mobile menu; crawlers can still follow its links.
 */
export const metadata: Metadata = {
  title: 'Service Connect | Request a Service, Engineer or Quote',
  description:
    'Request a service, book a technician, talk to an engineer, request a quote, get emergency help or ask about a job — in one place.',
  alternates: { canonical: 'https://www.emersoneims.com/service-connect' },
  robots: { index: false, follow: true },
};

export default function ServiceConnectPage() {
  return (
    // A <div>, not <main>: the root layout already provides <main id="main-content">.
    <div className="bg-black text-white min-h-screen">
      <section className="eims-shell">
        <p className="eims-kicker">EmersonEIMS · Service Connect</p>
        <h1 className="eims-title">How can we help you today?</h1>
        <p className="mt-4 max-w-2xl text-white/70">
          Choose what you need. Requests go straight to our engineering team. For a breakdown, call
          us: {RESPONSE_SUMMARY}
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_ACTIONS.map((a) => {
            const cls = `eims-card block p-6 transition-colors ${
              a.urgent ? 'border-red-500/40 bg-red-500/10 hover:border-red-400' : 'hover:border-amber-400/50'
            }`;
            const body = (
              <>
                <span className="text-3xl" aria-hidden>{a.icon}</span>
                <h2 className={`mt-3 text-lg font-semibold ${a.urgent ? 'text-red-200' : 'text-white'}`}>{a.label}</h2>
                <p className="mt-1 text-sm text-white/60">{a.hint}</p>
              </>
            );
            return a.external ? (
              <a key={a.id} href={a.href} className={cls} {...(a.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                {body}
              </a>
            ) : (
              <Link key={a.id} href={a.href} className={cls}>
                {body}
              </Link>
            );
          })}
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          <div className="eims-card p-6">
            <h2 className="text-base font-semibold">Prefer to speak to someone?</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href={`tel:${COMPANY_PHONE_TEL}`} className="btn-premium">Call {COMPANY_PHONE_DISPLAY}</a>
              <a
                href={waLink('Hello EmersonEIMS, I need help with: ')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-premium"
              >
                WhatsApp us
              </a>
            </div>
          </div>
          <div className="eims-card p-6 text-sm text-white/70">
            <h2 className="text-base font-semibold text-white">About “Track My Job”</h2>
            <p className="mt-2">
              Online job tracking is not live yet. Until it is, message us on WhatsApp with your name or
              reference and we will send you an update.
            </p>
            <p className="mt-3">
              How we handle the details you send: see our{' '}
              <Link href="/privacy" className="underline">privacy policy</Link>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
