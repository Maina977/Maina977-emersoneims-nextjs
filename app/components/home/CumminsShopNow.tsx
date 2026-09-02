'use client';

import Link from 'next/link';
import { GENERATOR_SIZES } from '@/lib/products/generatorSizes';

/*
 * PRICES COME FROM GENERATOR_SIZES, NOT FROM THIS FILE.
 *
 * The hardcoded prices here contradicted the published figures on /generators:
 * a 62 kVA set was listed at KES 1,580,000 when the published 60 kVA range is
 * 1,100,000–1,350,000 (1.58M is an 80 kVA price), and a 125 kVA set at
 * 2,890,000 against a published 100 kVA range of 1,750,000–2,100,000. Two
 * prices for the same machine on one website is worse than no price.
 *
 * Each card now looks up the nearest published size band and shows that range,
 * so this section and /generators cannot drift apart. If a figure is wrong it
 * is corrected once, in generatorSizes.ts, and both places follow.
 */
function publishedRangeFor(kva: number): { range: string; slug: string } {
  const nearest = GENERATOR_SIZES.reduce((best, s) =>
    Math.abs(s.kva - kva) < Math.abs(best.kva - kva) ? s : best
  );
  return { range: nearest.priceRange, slug: nearest.slug };
}

export default function CumminsShopNow() {
  const models = [
    {
      model: 'VOLTKA VKS10',
      kva: '10 kVA',
      price: 'KES 320,000',
      priceUsd: '$2,400',
      stock: 7,
      features: ['Single phase', 'Compact', 'Quiet'],
      financing: '12/24 months',
      popular: false,
    },
    {
      model: 'VOLTKA VKS22',
      kva: '22 kVA',
      price: 'KES 620,000',
      priceUsd: '$4,650',
      stock: 5,
      features: ['3-phase', 'Commercial', 'Efficient'],
      financing: '12/24/36 months',
      popular: true,
    },
    {
      model: 'VOLTKA VKS44',
      kva: '44 kVA',
      price: 'KES 1,050,000',
      priceUsd: '$7,875',
      stock: 4,
      features: ['Industrial', 'Heavy-duty', 'Reliable'],
      financing: '24/36 months',
      popular: true,
    },
    {
      model: 'CUMMINS C62D',
      kva: '62 kVA',
      price: 'KES 1,580,000',
      priceUsd: '$11,850',
      stock: 3,
      features: ['Cummins engine', 'Industrial', 'Proven'],
      financing: '24/36/48 months',
      popular: false,
    },
    {
      model: 'CUMMINS C125',
      kva: '125 kVA',
      price: 'KES 2,890,000',
      priceUsd: '$21,675',
      stock: 2,
      features: ['Heavy industrial', 'Mining', 'Healthcare'],
      financing: '36/48 months',
      popular: true,
    },
  ];

  return (
    <section className="py-20 px-4 bg-black border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 reveal">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            {/* "Real Stock" contradicted the "Ask for availability" badge on
                every card below it, and "Real Financing" implied a facility we
                do not provide. */}
            Published pricing · confirmed on quotation
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Cummins Generators
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              Ready to Ship — 48 Hours
            </span>
          </h2>
          {/* "in stock across Kenya" and "Same-day delivery to Nairobi" were
              availability commitments no system backs; the stat band below
              already states delivery as 48–72 hours, which contradicted the
              same-day claim in the same section. */}
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Five popular Cummins and VOLTKA models, at the prices published on
            our generators page. Financing is arranged through your own bank or
            asset financier.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {models.map((gen, idx) => (
            <div key={idx} className={`relative rounded-2xl border transition-all duration-300 overflow-hidden group ${ gen.popular ? 'border-amber-500 bg-gradient-to-b from-amber-500/10 to-black' : 'border-white/20 bg-white/5 hover:border-amber-500/50 hover:bg-white/10' } reveal`}>
              {gen.popular && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold rounded-bl-lg">
                  POPULAR
                </div>
              )}

              <div className="p-6">
                {/* Availability.
                    This said "{gen.stock} in stock" from hardcoded numbers
                    (7, 5, 4, 3, 2) that no inventory system produced. A
                    specific count presented as live availability is a factual
                    claim about the warehouse, and it would have been wrong the
                    first time a set was sold. "Ask for availability" is true
                    on every day of the year. */}
                <div className="mb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs font-semibold text-green-300">Ask for availability</span>
                  </div>
                </div>

                {/* Model Name */}
                <h3 className="text-xl font-bold text-white mb-1">{gen.model}</h3>
                <p className="text-sm text-amber-400 font-semibold mb-4">{gen.kva}</p>

                {/* Features */}
                <ul className="space-y-1 mb-6">
                  {gen.features.map((feature, i) => (
                    <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Divider */}
                <div className="border-t border-white/10 my-6" />

                {/* Pricing — the published band for this size, read from
                    GENERATOR_SIZES so it cannot contradict /generators. The
                    USD conversion is dropped: it was a fixed number baked into
                    this file, so it silently became wrong the moment the rate
                    moved, and we publish in KES everywhere else. */}
                <div className="mb-4">
                  <p className="text-2xl font-bold text-white">
                    {publishedRangeFor(parseInt(gen.kva, 10)).range}
                  </p>
                  <p className="text-xs text-gray-400">Published range · confirmed on quotation</p>
                </div>

                {/* Financing */}
                <p className="text-xs text-gray-400 mb-6">
                  <span className="text-amber-400 font-semibold">Financing:</span> {gen.financing}
                </p>

                {/* CTAs */}
                <div className="space-y-3">
                  <Link
                    href={`/contact?type=generator-purchase&model=${gen.model}`}
                    className={`block w-full py-3 rounded-lg font-bold text-center transition-all duration-300 ${
                      gen.popular
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-black hover:scale-105'
                        : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                    }`}
                  >
                    Request Quotation
                  </Link>
                  <Link
                    href={`/generators/cummins?model=${gen.model}`}
                    className="block w-full py-2 text-center text-amber-400 text-sm font-semibold hover:text-amber-300 transition-colors"
                  >
                    View Specs →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Strip */}
        <div className="bg-gradient-to-r from-slate-900/30 via-amber-900/20 to-slate-900/30 border border-amber-500/20 rounded-2xl p-8 md:p-12 reveal">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-400 mb-2">48 Hours</div>
              <p className="text-gray-300">Delivery to Nairobi · nationwide within 48–72 hours</p>
            </div>
            <div className="text-center border-l border-r border-white/10">
              {/* Owner confirmed 2026-08-29: the universal warranty period is
                  two years. This said three. */}
              <div className="text-3xl font-bold text-amber-400 mb-2">2 Years</div>
              <p className="text-gray-300">Full warranty · free maintenance first 12 months</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-400 mb-2">24/7</div>
              <p className="text-gray-300">Emergency support · nationwide mobile workshop</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-300 mb-6">
              Not finding your model? We service all Cummins, Perkins, Caterpillar, FG Wilson and 15+ other brands.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact?type=generator-consultation"
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold rounded-full hover:scale-105 transition-all"
              >
                Get a Custom Quote
              </Link>
              <a
                href="https://wa.me/254768860665?text=I%20want%20to%20order%20a%20generator"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border-2 border-green-500 text-green-400 font-bold rounded-full hover:bg-green-500/10 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Sales
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
