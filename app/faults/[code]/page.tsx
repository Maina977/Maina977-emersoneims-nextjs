import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FAULT_CODES, FaultCode } from '@/lib/data/faultCodes';

/**
 * Individual Fault Code Page
 *
 * SEO-optimized page for each fault code.
 * Target searches: "Cummins SPN 111", "DSE E020 error", etc.
 */

interface Props {
  params: Promise<{ code: string }>;
}

// Generate static pages for all fault codes
export async function generateStaticParams() {
  return FAULT_CODES.map((fault) => ({
    code: fault.code.toLowerCase(),
  }));
}

// Generate SEO metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const fault = FAULT_CODES.find(
    (f) => f.code.toLowerCase() === decodeURIComponent(code).toLowerCase()
  );

  if (!fault) {
    return { title: 'Fault Code Not Found' };
  }

  return {
    title: `${fault.brand} ${fault.code} - ${fault.title} | Generator Oracle`,
    description: `${fault.brand} fault code ${fault.code}: ${fault.title}. ${fault.description.slice(0, 150)}... Get step-by-step repair instructions.`,
    keywords: fault.searchKeywords?.join(', '),
    openGraph: {
      title: `${fault.brand} ${fault.code} - ${fault.title}`,
      description: fault.description.slice(0, 200),
      type: 'article',
    },
    alternates: {
      canonical: `https://www.emersoneims.com/faults/${fault.code.toLowerCase()}`,
    },
  };
}

const SEVERITY_CONFIG = {
  critical: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    label: 'CRITICAL',
    icon: '🚨',
  },
  warning: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    label: 'WARNING',
    icon: '⚠️',
  },
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    label: 'INFO',
    icon: 'ℹ️',
  },
};

export default async function FaultCodePage({ params }: Props) {
  const { code } = await params;
  const fault = FAULT_CODES.find(
    (f) => f.code.toLowerCase() === decodeURIComponent(code).toLowerCase()
  );

  if (!fault) {
    notFound();
  }

  const severity = SEVERITY_CONFIG[fault.severity];
  const relatedFaults = FAULT_CODES.filter(
    (f) => fault.relatedCodes?.includes(f.code) || f.category === fault.category
  ).slice(0, 4);

  const whatsappLink = `https://wa.me/254768860665?text=Hi%2C%20I%20need%20help%20with%20${fault.brand}%20fault%20code%20${encodeURIComponent(fault.code)}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
      {/* Hero */}
      <section className="py-12 px-4 border-b border-white/10">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="mb-6 text-sm">
            <ol className="flex items-center gap-2 text-slate-400">
              <li><Link href="/" className="hover:text-amber-400">Home</Link></li>
              <li>/</li>
              <li><Link href="/faults" className="hover:text-amber-400">Fault Codes</Link></li>
              <li>/</li>
              <li className="text-white">{fault.code}</li>
            </ol>
          </nav>

          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <span className="text-sm text-gray-500 uppercase tracking-wider">{fault.brand}</span>
              <h1 className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">{fault.code}</h1>
              <p className="text-2xl text-white font-semibold">{fault.title}</p>
            </div>
            <div className={`px-4 py-2 rounded-lg border ${severity.bg} ${severity.border}`}>
              <span className={`${severity.text} font-bold flex items-center gap-2`}>
                <span>{severity.icon}</span>
                {severity.label}
              </span>
            </div>
          </div>

          <p className="text-lg text-gray-300 leading-relaxed">{fault.description}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Possible Causes */}
              <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-2xl">🔍</span> Possible Causes
                </h2>
                <ul className="space-y-3">
                  {fault.possibleCauses.map((cause, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-amber-400 mt-1">•</span>
                      <span className="text-gray-300">{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Troubleshooting Steps */}
              <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-2xl">🔧</span> Troubleshooting Steps
                </h2>
                <ol className="space-y-4">
                  {fault.troubleshootingSteps.map((step, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span className="w-8 h-8 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center text-amber-400 font-bold flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-gray-300 pt-1">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Related Parts */}
              <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-2xl">🛠️</span> Parts You May Need
                </h2>
                <div className="flex flex-wrap gap-2">
                  {fault.relatedParts.map((part, i) => (
                    <span
                      key={i}
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-gray-300"
                    >
                      {part}
                    </span>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <p className="text-amber-400 text-sm">
                    <strong>Need parts?</strong> We stock genuine {fault.brand} parts with next-day delivery in Nairobi.
                    <a href="tel:+254768860665" className="underline ml-1">Call +254 768 860 665</a>
                  </p>
                </div>
              </div>

              {/* FAQ Section */}
              {fault.faqQuestions && fault.faqQuestions.length > 0 && (
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="text-2xl">❓</span> Frequently Asked Questions
                  </h2>
                  <div className="space-y-4">
                    {fault.faqQuestions.map((faq, i) => (
                      <details key={i} className="group">
                        <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors">
                          <span className="font-medium text-white">{faq.question}</span>
                          <svg className="w-5 h-5 text-amber-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </summary>
                        <p className="mt-2 px-4 pb-4 text-gray-400">{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Expert Help CTA */}
              <div className="p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl">
                <h3 className="text-lg font-bold mb-3">Need Expert Help?</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Our engineers have fixed 1,000+ {fault.brand} generators. Get professional diagnosis now.
                </p>
                <div className="space-y-3">
                  <a
                    href={whatsappLink}
                    className="w-full px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp Engineer
                  </a>
                  <a
                    href="tel:+254768860665"
                    className="w-full px-4 py-3 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-center"
                  >
                    Call +254 768 860 665
                  </a>
                </div>
              </div>

              {/* Generator Oracle CTA */}
              <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                <h3 className="text-lg font-bold mb-3">Advanced Diagnostics</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Use Generator Oracle for AI-powered diagnosis, wiring diagrams, and repair manuals.
                </p>
                <Link
                  href="/generator-oracle"
                  className="w-full px-4 py-3 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition-colors flex items-center justify-center gap-2"
                >
                  Launch Generator Oracle →
                </Link>
              </div>

              {/* Related Codes */}
              {relatedFaults.length > 0 && (
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                  <h3 className="text-lg font-bold mb-4">Related Fault Codes</h3>
                  <div className="space-y-2">
                    {relatedFaults.map((related) => (
                      <Link
                        key={related.code}
                        href={`/faults/${related.code.toLowerCase()}`}
                        className="block p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        <span className="text-amber-400 font-bold">{related.code}</span>
                        <span className="text-gray-400 text-sm ml-2">{related.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": `How to Fix ${fault.brand} ${fault.code} - ${fault.title}`,
            "description": fault.description,
            "step": fault.troubleshootingSteps.map((step, i) => ({
              "@type": "HowToStep",
              "position": i + 1,
              "text": step,
            })),
            "tool": fault.relatedParts.map((part) => ({
              "@type": "HowToTool",
              "name": part,
            })),
          }),
        }}
      />

      {/* FAQ Schema */}
      {fault.faqQuestions && fault.faqQuestions.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": fault.faqQuestions.map((faq) => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer,
                },
              })),
            }),
          }}
        />
      )}
    </div>
  );
}
