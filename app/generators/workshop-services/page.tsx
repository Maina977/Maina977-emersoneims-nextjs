/**
 * /generators/workshop-services — Workshop Repairs & Fabrication.
 *
 * Built to the owner brief of 2026-07-21 as a SUBPAGE of the generator section.
 *
 * DESIGN DECISIONS, and why:
 *  - Server component, no client JS, no new dependencies. The brief asks to
 *    avoid heavy animation libraries where CSS suffices and to avoid large
 *    client components; every interaction here is a link or an anchor.
 *  - The service navigator uses plain anchors + CSS scroll-margin rather than a
 *    scroll-spy, so it works without JavaScript and cannot cause layout shift.
 *  - Enquiry is WhatsApp-first with the required fields pre-filled, plus the
 *    existing /contact form. See the note on the enquiry section for why this
 *    was chosen over a new multi-file upload form.
 *
 * CONTENT RULES HELD (brief §14 and the site-wide credibility policy):
 *  - No turnaround times, no completion-date promises.
 *  - No certifications, accreditations or dealership claims.
 *  - No decibel figures for canopies.
 *  - Explicit caveats where a repair may not be economical.
 *  - Site survey fee stated consistently with components/trust/SiteSurveyPolicy.
 *  - No workshops or staff claimed outside the Embakasi, Nairobi base.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  DIVISIONS,
  WORKSHOP_SERVICES,
  WORKSHOP_PROCESS,
  WORKSHOP_FAQS,
} from '@/lib/workshop/workshopServices';

const BASE = 'https://www.emersoneims.com';
const PATH = '/generators/workshop-services';
const PHONE = '+254768860665';

export const metadata: Metadata = {
  title: 'Generator Workshop Repairs & Fabrication Kenya | EmersonEIMS',
  description:
    'Radiator, starter, alternator, injector, turbo, engine, UPS and pump repairs, plus generator canopies, tanks, plinths and industrial fabrication in Kenya.',
  keywords: [
    'generator workshop services Kenya',
    'generator component repairs Kenya',
    'generator radiator repair Nairobi',
    'starter motor repair Kenya',
    'alternator rewinding Kenya',
    'injector nozzle repair Kenya',
    'turbocharger repair Kenya',
    'generator engine overhaul Kenya',
    'motor rewinding Kenya',
    'UPS repair Kenya',
    'industrial pump repair Kenya',
    'generator canopy fabrication Kenya',
    'diesel fuel tank fabrication Kenya',
    'generator plinth construction',
    'hammer mill fabrication Kenya',
    'industrial grinder fabrication Kenya',
  ],
  alternates: { canonical: `${BASE}${PATH}` },
  openGraph: {
    title: 'Generator Workshop Repairs & Fabrication — Kenya | EmersonEIMS',
    description:
      'Component-level repair, rebuild and fabrication for generators, engines, electrical machines, UPS, pumps and industrial machinery. Nationwide receipt and dispatch.',
    url: `${BASE}${PATH}`,
    type: 'website',
  },
};

function wa(text: string) {
  return `https://wa.me/254768860665?text=${encodeURIComponent(text)}`;
}

export default function WorkshopServicesPage() {
  const byDivision = (d: string) => WORKSHOP_SERVICES.filter((s) => s.division === d);

  return (
    <main className="min-h-screen bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Generator Workshop Repairs & Fabrication Kenya',
              url: `${BASE}${PATH}`,
              inLanguage: 'en-KE',
              isPartOf: { '@type': 'WebSite', url: BASE, name: 'EmersonEIMS' },
            },
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
                { '@type': 'ListItem', position: 2, name: 'Generators', item: `${BASE}/generators` },
                { '@type': 'ListItem', position: 3, name: 'Workshop Repairs & Fabrication', item: `${BASE}${PATH}` },
              ],
            },
            {
              '@context': 'https://schema.org',
              '@type': 'Service',
              serviceType: 'Generator, engine, electrical and industrial workshop repairs and fabrication',
              provider: { '@type': 'Organization', name: 'EmersonEIMS', url: BASE, telephone: PHONE },
              areaServed: { '@type': 'Country', name: 'Kenya' },
              availableChannel: {
                '@type': 'ServiceChannel',
                servicePhone: { '@type': 'ContactPoint', telephone: PHONE, contactType: 'customer service' },
                serviceUrl: `${BASE}${PATH}`,
              },
            },
            {
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: 'Workshop services',
              numberOfItems: WORKSHOP_SERVICES.length,
              itemListElement: WORKSHOP_SERVICES.map((s, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: s.title,
                url: `${BASE}${PATH}#${s.id}`,
              })),
            },
            {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: WORKSHOP_FAQS.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            },
          ]),
        }}
      />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="border-b border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-8 text-sm">
            <ol className="flex flex-wrap items-center gap-2 text-slate-400">
              <li><Link href="/" className="hover:text-amber-400">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/generators" className="hover:text-amber-400">Generators</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-white">Workshop Repairs &amp; Fabrication</li>
            </ol>
          </nav>

          <span className="text-xs font-medium uppercase tracking-[0.2em] text-amber-400">
            EmersonEIMS Workshop and Engineering Services
          </span>

          <h1 className="mt-4 max-w-4xl text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
            Generator, Engine, Electrical and Industrial Workshop Services in Kenya
          </h1>

          <p className="mt-3 max-w-3xl text-xl font-semibold text-amber-400 md:text-2xl">
            Restore it. Rebuild it. Fabricate it. Keep your operations running.
          </p>

          <p className="mt-6 max-w-3xl leading-relaxed text-slate-300">
            From generator radiators, starters, alternators, injectors and turbochargers to
            motor rewinding, UPS repairs, pump overhauls, fuel systems and custom
            fabrication, EmersonEIMS provides coordinated workshop and field engineering
            services for businesses across Kenya.
          </p>
          <p className="mt-4 max-w-3xl leading-relaxed text-slate-400">
            Equipment can be delivered to our workshop, collected where arrangements are
            available, or sent through a suitable courier or transport service and returned
            the same way after repair.
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              'Generator, engine and electrical repairs',
              'Industrial and mechanical workshop services',
              'Custom steel and equipment fabrication',
              'Nationwide component receipt and dispatch',
              'Inspection and quotation before major work',
              'Repair testing and documented handover',
            ].map((t) => (
              <li key={t} className="flex items-start gap-2 text-sm text-slate-300">
                <span aria-hidden="true" className="mt-0.5 text-amber-400">✔</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href={wa(
                'Hello EmersonEIMS, I would like a repair assessment. Equipment: , Brand/model: , Serial number: , Fault: , My location (county/town): '
              )}
              target="_blank"
              rel="noopener noreferrer"
              data-track="workshop:hero:whatsapp"
              className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-500"
            >
              Send equipment photos on WhatsApp
            </a>
            <a href={`tel:${PHONE}`} data-track="workshop:hero:call" className="rounded-lg bg-amber-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-amber-400">
              Call the workshop
            </a>
            <Link href="/contact?type=workshop" data-track="workshop:hero:assessment" className="rounded-lg border border-slate-600 px-5 py-3 font-semibold text-slate-200 transition hover:border-amber-500 hover:text-amber-400">
              Request a repair assessment
            </Link>
          </div>
        </div>
      </section>

      {/* ── SERVICE NAVIGATOR ────────────────────────────────────────────── */}
      <nav aria-label="Workshop services" className="border-b border-slate-800 bg-slate-900/60">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
          <h2 className="sr-only">Jump to a service</h2>
          <ul className="flex flex-wrap gap-2">
            {WORKSHOP_SERVICES.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  data-track={`workshop:nav:${s.id}`}
                  className="inline-block rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-300 transition hover:border-amber-500 hover:text-amber-400"
                >
                  {s.nav}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ── REAL WORKSHOP PHOTOGRAPHY ────────────────────────────────────
          Every image below was OPENED AND VISUALLY VERIFIED before use, not
          selected on filename. That check mattered: public/images/
          generator-canopy-fabrication.png is not a canopy at all — it is a
          stock photograph of high-voltage substation insulators. Publishing it
          as our fabrication work is exactly what brief section 13 forbids.

          Alt text describes what is visibly happening in each frame. No claim
          is made about client, site or date, because none is recorded. */}
      <section aria-labelledby="workshop-photos" className="border-b border-slate-800 py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 id="workshop-photos" className="text-2xl font-bold text-white md:text-3xl">
            Inside the workshop
          </h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-slate-400">
            Engine strip-down, liner and block work photographed during actual jobs.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                src: '/images/repairs/repair-01.webp',
                alt: 'EmersonEIMS technician lowering a new cylinder liner into a stripped six-cylinder diesel engine block during an overhaul',
                cap: 'Cylinder liner being fitted to a stripped block',
              },
              {
                src: '/images/desktop/overhaul/engine-overhaul-2.jpg',
                alt: 'Technician handling a numbered cylinder liner over an open engine block, with bores and head-bolt holes visible during a generator engine overhaul',
                cap: 'Liners marked and matched to their bores',
              },
              {
                src: '/images/repairs/repair-06.webp',
                alt: 'Large diesel engine block stripped to the bare casting and supported on timber and lifting gear in the EmersonEIMS workshop',
                cap: 'Block stripped for measurement and rebuild',
              },
            ].map((img) => (
              <figure key={img.src} className="overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/40">
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={800}
                  height={600}
                  quality={85}
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="h-56 w-full object-cover"
                />
                <figcaption className="px-4 py-3 text-sm text-slate-400">{img.cap}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIVISIONS + SERVICES ─────────────────────────────────────────── */}
      {DIVISIONS.map((div) => (
        <section key={div.id} className="border-b border-slate-800 py-14 md:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white md:text-3xl">{div.title}</h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-slate-400">{div.blurb}</p>

            <div className="mt-10 space-y-8">
              {byDivision(div.id).map((s) => (
                <article
                  key={s.id}
                  id={s.id}
                  className="scroll-mt-24 rounded-2xl border border-slate-700/70 bg-slate-900/40 p-6 md:p-8"
                >
                  <h3 className="text-xl font-bold text-white md:text-2xl">{s.title}</h3>
                  <p className="mt-3 max-w-3xl leading-relaxed text-slate-300">{s.intro}</p>

                  <div className="mt-6 grid gap-8 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
                        What the work covers
                      </h4>
                      <ul className="mt-3 space-y-2">
                        {s.scope.map((x) => (
                          <li key={x} className="flex items-start gap-2 text-sm leading-relaxed text-slate-300">
                            <span aria-hidden="true" className="mt-1 text-slate-600">•</span>
                            <span>{x}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {s.symptoms && (
                      <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
                          Symptoms we see
                        </h4>
                        <ul className="mt-3 flex flex-wrap gap-2">
                          {s.symptoms.map((x) => (
                            <li key={x} className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-1.5 text-sm text-slate-300">
                              {x}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {s.caveat && (
                    <p className="mt-6 rounded-xl border border-slate-700 bg-slate-950/60 p-4 text-sm leading-relaxed text-slate-400">
                      <span className="font-semibold text-slate-300">Worth knowing: </span>
                      {s.caveat}
                    </p>
                  )}

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <a
                      href={wa(
                        `Hello EmersonEIMS, I need help with: ${s.title}. Equipment brand/model: , Serial number: , Fault: , My location: `
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-track={`workshop:service:${s.id}`}
                      className="rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-500"
                    >
                      {s.cta}
                    </a>
                    {s.relatedHref && (
                      <Link href={s.relatedHref} data-track={`workshop:detail:${s.id}`} className="text-sm font-semibold text-amber-400 hover:underline">
                        {s.relatedLabel} →
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ── PROCESS ──────────────────────────────────────────────────────── */}
      <section className="border-b border-slate-800 py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white md:text-3xl">How the workshop process works</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-slate-400">
            The same six stages apply whether the item arrives by courier from Turkana or we
            attend your plant room in Nairobi.
          </p>
          <ol className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {WORKSHOP_PROCESS.map((p) => (
              <li key={p.n} className="rounded-2xl border border-slate-700/70 bg-slate-900/40 p-6">
                <span className="text-sm font-bold text-amber-400">Stage {p.n}</span>
                <h3 className="mt-2 font-semibold text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{p.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-slate-400">
            A site survey and diagnostic fee covers the technician’s attendance, inspection
            and fault diagnosis. The full fee is deducted from the contract when the work is
            awarded to EmersonEIMS.
          </p>
        </div>
      </section>

      {/* ── NATIONWIDE DISPATCH ──────────────────────────────────────────── */}
      <section className="border-b border-amber-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            Send your component from anywhere in Kenya
          </h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-slate-300">
            You do not always need to travel to Nairobi to use the workshop. Suitable
            components can be sent to us by courier, parcel or transport service, and
            returned the same way once the approved repair is complete.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-700/70 bg-slate-900/50 p-6">
              <h3 className="font-semibold text-white">Transport options</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {[
                  'Established courier companies',
                  'G4S courier services',
                  'Wells Fargo courier services',
                  'Matatu and bus parcel services',
                  'Regional transport providers',
                  'Your own nominated courier',
                ].map((x) => (
                  <li key={x} className="flex items-start gap-2">
                    <span aria-hidden="true" className="mt-1 text-amber-400">•</span>
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                Availability, packaging requirements, liability, insurance, cost and expected
                transit are confirmed with you before anything is dispatched.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700/70 bg-slate-900/50 p-6">
              <h3 className="font-semibold text-white">Before you send equipment</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {[
                  'Drain fuel, oil or coolant where appropriate',
                  'Protect exposed shafts and terminals',
                  'Seal injector and pump openings',
                  'Pack in strong, protective packaging',
                  'Include your contact details inside the parcel',
                  'Include the quotation or job reference',
                  'Photograph the item before dispatch',
                  'Share the consignment or parcel details with us',
                ].map((x) => (
                  <li key={x} className="flex items-start gap-2">
                    <span aria-hidden="true" className="mt-1 text-amber-400">✔</span>
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                Please do not dispatch leaking, pressurised, hazardous or inadequately
                packaged equipment — it is a risk to handlers and often arrives damaged.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ENQUIRY ──────────────────────────────────────────────────────── */}
      <section id="enquire" className="scroll-mt-24 border-b border-slate-800 py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white md:text-3xl">Request an inspection or quotation</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-slate-300">
            Photographs tell us more than a description. Send the equipment and its nameplate
            on WhatsApp and our technical team will come back to you on inspection, the
            technical details still needed and the appropriate next step.
          </p>

          <div className="mt-6 rounded-2xl border border-slate-700/70 bg-slate-900/40 p-6 md:p-8">
            <h3 className="font-semibold text-white">Please include</h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {[
                'Your name and company',
                'County and nearest town',
                'Service required',
                'Equipment type, brand and model',
                'Serial number from the nameplate',
                'Description of the problem',
                'Whether the equipment still runs',
                'Whether the item is on site or ready to dispatch',
                'Photographs of the equipment and nameplate',
                'Any date you are working towards',
              ].map((x) => (
                <li key={x} className="flex items-start gap-2 text-sm text-slate-300">
                  <span aria-hidden="true" className="mt-1 text-amber-400">•</span>
                  <span>{x}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={wa(
                  'Hello EmersonEIMS, I would like a workshop inspection/quotation.\n\nName/company: \nCounty: \nTown: \nService required: \nEquipment type: \nBrand: \nModel: \nSerial number: \nProblem: \nIs it running? \nOn site or ready to dispatch? \nRequired by: '
                )}
                target="_blank"
                rel="noopener noreferrer"
                data-track="workshop:quote:started"
                className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-500"
              >
                Start the enquiry on WhatsApp
              </a>
              <Link href="/contact?type=workshop" data-track="workshop:quote:contact-form" className="rounded-lg bg-amber-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-amber-400">
                Use the contact form instead
              </Link>
              <a href={`tel:${PHONE}`} className="rounded-lg border border-slate-600 px-5 py-3 font-semibold text-slate-200 transition hover:border-amber-500 hover:text-amber-400">
                Call {PHONE}
              </a>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-slate-400">
              We do not quote a repair price or completion date before inspection. Once we
              have seen the equipment you get a written scope and quotation, and major work
              begins only after you approve it.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="border-b border-slate-800 py-14 md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white md:text-3xl">Frequently asked questions</h2>
          <div className="mt-8 space-y-3">
            {WORKSHOP_FAQS.map((f) => (
              <details key={f.q} className="group rounded-xl border border-slate-700/70 bg-slate-900/40 p-5">
                <summary className="cursor-pointer list-none font-semibold text-white marker:hidden">
                  <span className="inline-flex w-full items-start justify-between gap-4">
                    <span>{f.q}</span>
                    <span aria-hidden="true" className="mt-0.5 shrink-0 text-amber-400 transition-transform group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── RELATED ──────────────────────────────────────────────────────── */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white md:text-3xl">Related EmersonEIMS services</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              { href: '/generators', label: 'Generator sales' },
              { href: '/generators/maintenance', label: 'Generator repairs & maintenance' },
              { href: '/generators/spare-parts', label: 'Generator spare parts' },
              { href: '/generators/installation', label: 'Generator installation' },
              { href: '/solutions/motor-rewinding', label: 'Motor rewinding' },
              { href: '/solutions/diesel-automation', label: 'Diesel automation' },
              { href: '/fabrication', label: 'Steel fabrication' },
              { href: '/solutions/borehole-pumps', label: 'Borehole & pump services' },
              { href: '/solutions/controls', label: 'ATS & changeover systems' },
              { href: '/hub/ups-lab', label: 'UPS Intelligence Lab' },
              { href: '/generator-oracle', label: 'Generator Oracle diagnostics' },
              { href: '/locations', label: 'Areas we cover' },
              { href: '/contact', label: 'Contact & service booking' },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-slate-300 transition hover:border-amber-500 hover:text-amber-400"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
