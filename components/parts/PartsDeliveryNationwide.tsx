/**
 * PartsDeliveryNationwide — how customers anywhere in Kenya and East Africa
 * order spare parts and receive them.
 *
 * WHY IT EXISTS (audit 2026-07-21)
 * /generators/spare-parts ran 1,462 words describing WHAT we stock (AVRs,
 * injectors, gaskets, ComAp / PowerWizard / SmartGen controllers) but had ZERO
 * mentions of how a customer outside Nairobi actually receives any of it:
 *
 *   matatu 0, bus 0, courier 0, parcel 0, G4S 0, Wells Fargo 0,
 *   "serial number" 0
 *
 * A workshop in Turkana or a hotel in Kigali could read the whole page and
 * never learn that parts can be ordered remotely at all. That is the single
 * largest gap between the site and the owner's stated national/regional reach.
 *
 * TRUTHFULNESS RULES APPLIED (owner directive §4 and §14)
 * - The delivery channels below are the owner-approved list, quoted as
 *   OPTIONS, not as services we operate.
 * - NO delivery times, ETAs or "next day" claims anywhere — none are
 *   operationally confirmed, and the directive forbids unsupported delivery
 *   guarantees.
 * - NO stock or availability claims. Availability is always presented as
 *   something to confirm per enquiry, never as a promise.
 * - NO authorised-dealership or franchise claim.
 * - Cross-border wording stays "supply", "dispatch" and "cross-border
 *   enquiries", never branches or offices abroad.
 */
import Link from 'next/link';

/** Owner-approved dispatch channels (directive §4). Options, not promises. */
const DISPATCH_CHANNELS = [
  {
    title: 'Bus & matatu parcel services',
    body: 'The established way to move parts up-country quickly. Parcels are booked to the stage or depot nearest you.',
  },
  {
    title: 'G4S and Wells Fargo courier',
    body: 'Tracked courier options for higher-value items such as controllers, AVRs and electronic modules.',
  },
  {
    title: 'Regional & local courier networks',
    body: 'Regional operators and local parcel networks where they reach your town more directly.',
  },
  {
    title: 'Your own transporter',
    body: 'If you already use a transporter or have staff travelling to Nairobi, we can release the parts to them.',
  },
];

/** What we need in order to quote accurately and ship the right part. */
const WHAT_TO_SEND = [
  'Generator make and model (for example Cummins C55D5, Perkins 1104A)',
  'Engine and alternator serial numbers from the data plate',
  'The part number if you have it, or the old part',
  'Photographs of the part, the data plate and the controller display',
  'Any fault or error code currently showing',
  'The town or county the parts should be sent to',
];

export default function PartsDeliveryNationwide({
  className = '',
}: {
  className?: string;
}) {
  const wa =
    'https://wa.me/254768860665?text=' +
    encodeURIComponent(
      'Hello EmersonEIMS, I would like to order a generator spare part. Generator make/model: , Serial number: , Part needed: , Deliver to (town/county): '
    );

  return (
    <section
      aria-labelledby="parts-delivery-heading"
      className={`border-y border-amber-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-14 md:py-20 ${className}`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-amber-400">
          Parts Ordering &amp; Dispatch
        </span>
        <h2
          id="parts-delivery-heading"
          className="mt-3 max-w-3xl text-3xl font-bold leading-tight text-white md:text-4xl"
        >
          Order spare parts from anywhere in Kenya — you do not need to travel to Nairobi
        </h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-slate-300">
          Send us your generator details and we will confirm the correct part, quote
          it, and arrange dispatch to your town. We also supply parts for projects
          across East Africa on a cross-border basis.
        </p>

        {/* Dispatch options */}
        <h3 className="mt-10 text-lg font-semibold text-white">Dispatch options</h3>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          {DISPATCH_CHANNELS.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-slate-700/70 bg-slate-900/50 p-5 transition-colors hover:border-amber-500/40"
            >
              <h4 className="font-semibold text-white">{c.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{c.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-400">
          The channel used depends on the part, its value and where it is going, so we
          agree it with you per order and confirm the cost before anything is sent. We
          do not quote a delivery time until the dispatch method is agreed.
        </p>

        {/* What to send */}
        <h3 className="mt-12 text-lg font-semibold text-white">
          What to send us so we quote the right part
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">
          Generator parts vary between builds of the same model, so we verify
          compatibility from your serial number before quoting rather than assuming
          from the model name.
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {WHAT_TO_SEND.map((item) => (
            <li key={item} className="flex items-start gap-3 text-slate-300">
              <span aria-hidden="true" className="mt-1 text-amber-400">
                ✔
              </span>
              <span className="text-sm leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900/60 p-4">
          <p className="text-sm leading-relaxed text-slate-300">
            <span className="font-semibold text-amber-400">Availability:</span> stock
            changes, and some items are brought in to order. We confirm availability
            and price against your enquiry before you commit to anything — we do not
            ask for payment on a part we have not confirmed.
          </p>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-500"
          >
            Send part details on WhatsApp
          </a>
          <a
            href="tel:+254768860665"
            className="rounded-lg bg-amber-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-amber-400"
          >
            Call +254 768 860 665
          </a>
          <Link
            href="/contact"
            className="rounded-lg border border-slate-600 px-5 py-3 font-semibold text-slate-200 transition hover:border-amber-500 hover:text-amber-400"
          >
            Request a parts quotation
          </Link>
        </div>
      </div>
    </section>
  );
}
