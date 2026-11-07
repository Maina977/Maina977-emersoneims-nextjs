import Link from 'next/link';
import { Metadata } from 'next';

/*
 * NOINDEX since 2026-08-31: the partner network does not exist yet.
 *
 * Re-audit 7 Nov 2026, item 5. Even after the invented partners, ratings and
 * "47 verified partners" were removed, this page still stated as accomplished
 * fact that EmersonEIMS verifies every partner's registration, certifications
 * and insurance, inspects their facilities, "takes responsibility" when a
 * partner fails, completes failed jobs "at no additional cost to you", and pays
 * "automatic compensation" for missed partner SLAs. No partner has been
 * admitted, no inspection or insurance check has been run, and no written
 * policy, escrow or insurer stands behind those financial undertakings. They
 * are removed. The page now says what the network is, what a partner will
 * have to show before being listed, and, plainly, who is responsible for what.
 *
 * The three /marketplace/partners/* profiles (invented companies, ratings and
 * testimonials) now 301 to this page (next.config.ts).
 *
 * TO RESTORE INDEXING: admit real partners, record the checks actually done
 * for each, get the owner's written approval of any undertaking EmersonEIMS
 * gives on a partner's behalf, then remove the robots block and re-add the
 * sitemap entry.
 */
export const metadata: Metadata = {
  title: 'Partner Marketplace',
  description: 'The EmersonEIMS partner marketplace is in formation. No partners are listed yet; quotation requests are handled by EmersonEIMS directly.',
  robots: { index: false, follow: true },
  alternates: {
    canonical: 'https://www.emersoneims.com/marketplace',
  },
};

const LISTING_REQUIREMENTS = [
  { title: 'Registered business', text: 'Certificate of incorporation or business registration, KRA PIN and a physical address we can visit.' },
  { title: 'Licences for the work', text: 'For electrical work, the EPRA licence class that covers it; for solar, the EPRA solar licence; other trades as the law requires.' },
  { title: 'Insurance', text: 'Current public-liability and, where they employ staff, work-injury cover, with the policy documents.' },
  { title: 'Track record', text: 'Completed jobs of the same kind with client contacts we can call, and photographs of that work.' },
  { title: 'Equipment documents', text: 'Manufacturer or distributor documentation for the equipment they supply, and the warranty terms they give.' },
];

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Partner Marketplace</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-600">
              In Formation
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We are building a network of regional installers and suppliers you can compare against one specification.
            No partners are listed yet. Until they are, every quotation request is handled by EmersonEIMS directly.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 bg-slate-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">What Happens to a Request Today</h2>
          <p className="text-gray-300 text-lg">
            You send your requirements (load, site, location and timeline). EmersonEIMS quotes and, if you accept, does the
            work under our own written quotation, with our own warranty terms. No third party is involved and nothing
            is passed to anyone else.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center">What a Partner Will Have to Show Before Being Listed</h2>
          <p className="text-center text-gray-400 max-w-3xl mx-auto mb-10">
            These are the documents we will ask for. A partner is listed only after we have them on file; the checks done for each
            partner will be stated on their profile.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LISTING_REQUIREMENTS.map((r) => (
              <div key={r.title} className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
                <h3 className="text-lg font-bold text-emerald-400 mb-2">{r.title}</h3>
                <p className="text-gray-300 text-sm">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-slate-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Who Is Responsible for What</h2>
          <ul className="space-y-4 text-gray-300">
            <li><strong className="text-white">Work EmersonEIMS contracts:</strong> we are responsible, under the terms of our written quotation and our published warranties.</li>
            <li><strong className="text-white">Work a partner contracts with you (once partners are listed):</strong> the partner is responsible, under the terms of their own quotation and warranty. Any additional undertaking by EmersonEIMS will apply only if it is written into your order.</li>
            <li><strong className="text-white">Response times, refunds and compensation:</strong> only those written into your order apply. This page promises none on a partner&apos;s behalf.</li>
          </ul>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-emerald-900/30 to-cyan-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Need a Quotation Now?</h2>
          <p className="text-lg text-gray-300 mb-10">Send your requirements and EmersonEIMS will quote directly.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact?type=marketplace-quote" className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-bold rounded-lg">
              Request a Quotation
            </Link>
            <Link href="/contact?type=partner-application" className="inline-block px-8 py-4 border border-emerald-500/50 text-emerald-300 font-bold rounded-lg">
              Apply to Become a Partner
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
