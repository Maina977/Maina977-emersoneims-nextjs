import QuickInquiryForm from '@/components/forms/QuickInquiryForm';

/**
 * On-page enquiry block for the /kenya/* location pages.
 *
 * WHY THIS EXISTS — measured, not assumed. On 2026-08-08 a crawl of the live
 * site with scripts and styles stripped found that all 1,474 location pages
 * rendered ZERO <form> elements. They are the highest-volume pages on the
 * site, and a visitor who searched "generator repairs in Nairobi", landed and
 * decided to enquire had to first click through to /contact. The leads table
 * over the same period held four genuine enquiries. Those two facts belong
 * together: intent was being collected on one page and spent on another.
 *
 * Phone and WhatsApp already appear on these pages, so this is deliberately
 * not a third way to reach us shouting over the other two. It is the missing
 * one — the asynchronous option, for the buyer who wants to send drawings, a
 * load list or a fault description at 9pm rather than start a conversation.
 *
 * `service` pre-fills the enquiry so the visitor does not retype what the page
 * already knows, and `source` attributes the lead to the exact page that
 * earned it. Without attribution every enquiry arrives looking identical and
 * there is no way to tell which of 1,474 pages is doing the work.
 *
 * Styling follows the surrounding location-page system (white/5 surfaces,
 * white/10 borders, amber accent) rather than introducing a new one — the
 * standing instruction is to add without altering the existing design.
 */

interface Props {
  /** County or constituency name, for the heading. */
  locationName: string;
  /** Human service name, e.g. "Generator Repairs". Omit on a landing page. */
  serviceName?: string;
  /** Stable attribution key, e.g. "kenya-nairobi-generator-repairs". */
  source: string;
}

export default function LocationEnquiry({ locationName, serviceName, source }: Props) {
  const heading = serviceName
    ? `Get a quote for ${serviceName} in ${locationName}`
    : `Get a quote in ${locationName}`;

  return (
    <section id="enquire" className="mb-16 scroll-mt-24" aria-labelledby="enquire-heading">
      <div className="rounded-2xl border border-amber-500/20 bg-white/5 p-6 md:p-8">
        <h2 id="enquire-heading" className="text-2xl md:text-3xl font-bold mb-3">
          {heading}
        </h2>
        <p className="text-gray-400 max-w-2xl mb-6">
          Send the load, the site conditions or the fault and we will come back with a
          specification and a price. If it is urgent, call or WhatsApp instead — the
          number is at the top of this page and answers 24/7.
        </p>
        <div className="max-w-2xl">
          <QuickInquiryForm
            service={serviceName || ''}
            ctaLabel={serviceName ? `Request a ${serviceName} quote` : 'Request a quote'}
            source={source}
          />
        </div>
      </div>
    </section>
  );
}
