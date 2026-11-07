import type { Metadata } from 'next';
import Link from 'next/link';
import BlackNovemberAd from '@/components/campaign/BlackNovemberAd';
import GeneratorQuoteForm from '@/components/forms/GeneratorQuoteForm';
import { CAMPAIGN_TERMS, CAMPAIGN_BENEFITS, CAMPAIGN_END_LABEL } from '@/lib/campaign/blackNovember';

export const metadata: Metadata = {
  title: 'Black November 2026 Generator Offer',
  description: `Generators powered by Cummins engines, 40-1,500 kVA: free ATS, 6 months free service, 2-year warranty, free countrywide delivery and free installation below 100 kVA. Until ${CAMPAIGN_END_LABEL}.`,
  alternates: { canonical: 'https://www.emersoneims.com/black-november' },
};

export default function BlackNovemberPage() {
  return (
    <main className="bg-[#071226] text-white">
      <BlackNovemberAd />

      <section className="max-w-4xl mx-auto px-4 py-16" aria-labelledby="bn-included">
        <h2 id="bn-included" className="text-3xl font-bold mb-6">What the offer includes</h2>
        <ul className="grid sm:grid-cols-2 gap-4">
          {CAMPAIGN_BENEFITS.map((b) => (
            <li key={b.title} className="rounded-xl border border-orange-500/30 bg-white/5 p-5">
              <p className="font-bold text-lg">{b.title}{b.free ? '' : ' (paid service)'}</p>
              <p className="text-slate-300 text-sm mt-1">{b.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-16" aria-labelledby="bn-terms">
        <h2 id="bn-terms" className="text-3xl font-bold mb-6">Offer terms</h2>
        <ol className="list-decimal pl-6 space-y-3 text-slate-200">
          {CAMPAIGN_TERMS.map((t) => (<li key={t}>{t}</li>))}
        </ol>
        <p className="mt-6 text-slate-400 text-sm">
          Published generator prices are on our <Link href="/generators" className="text-orange-300 underline">generators page</Link>.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-4 pb-24" aria-labelledby="bn-quote">
        <h2 id="bn-quote" className="text-3xl font-bold mb-6">Request your Black November quotation</h2>
        <GeneratorQuoteForm source="black-november-2026" />
      </section>
    </main>
  );
}
