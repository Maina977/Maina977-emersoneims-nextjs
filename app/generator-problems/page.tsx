import { Metadata } from 'next';
import Link from 'next/link';
import { SYMPTOM_DIAGNOSES } from '@/lib/generator-oracle/educationalContent';

export const metadata: Metadata = {
  title: 'Generator Problems & Solutions | Free Diagnostic Guide',
  description: 'Complete guide to diagnosing generator problems. Expert solutions for starting issues, overheating, low oil pressure, voltage fluctuations, and exhaust smoke. Free troubleshooting help.',
  keywords: 'generator problems, generator troubleshooting, generator won\'t start, generator overheating, generator repair Kenya',
  openGraph: {
    title: 'Generator Problems & Solutions - Expert Diagnostic Guide',
    description: 'Diagnose and fix common generator problems with our expert troubleshooting guides.',
    images: ['/images/generator-diagnostics.webp'],
  },
};

// Problem card data with SEO-friendly slugs
const PROBLEM_PAGES = [
  {
    slug: 'wont-start',
    title: "Generator Won't Start",
    shortTitle: 'Starting Problems',
    icon: '🔑',
    description: 'Diagnose why your generator fails to start, cranks but won\'t fire, or dies immediately after starting.',
    searchVolume: 'High',
    urgency: 'high',
  },
  {
    slug: 'overheating',
    title: 'Generator Overheating',
    shortTitle: 'Overheating',
    icon: '🌡️',
    description: 'Identify causes of high engine temperature, coolant issues, and thermal shutdown problems.',
    searchVolume: 'High',
    urgency: 'critical',
  },
  {
    slug: 'low-oil-pressure',
    title: 'Low Oil Pressure',
    shortTitle: 'Oil Pressure Issues',
    icon: '🛢️',
    description: 'Troubleshoot oil pressure warnings, sensor faults, and lubrication system problems.',
    searchVolume: 'Medium',
    urgency: 'critical',
  },
  {
    slug: 'voltage-frequency-unstable',
    title: 'Unstable Voltage or Frequency',
    shortTitle: 'Power Quality',
    icon: '⚡',
    description: 'Fix voltage fluctuations, frequency instability, and AVR/governor issues.',
    searchVolume: 'Medium',
    urgency: 'medium',
  },
  {
    slug: 'exhaust-smoke',
    title: 'Excessive Exhaust Smoke',
    shortTitle: 'Smoke Problems',
    icon: '💨',
    description: 'Diagnose black, white, or blue smoke from your generator exhaust.',
    searchVolume: 'Medium',
    urgency: 'medium',
  },
];

const urgencyStyles = {
  critical: 'bg-red-500/10 border-red-500/30 text-red-400',
  high: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
  medium: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
  low: 'bg-green-500/10 border-green-500/30 text-green-400',
};

export default function GeneratorProblemsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black">
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-cyan-500/30 bg-cyan-500/10">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-sm text-cyan-300 tracking-wider uppercase">Free Diagnostic Guides</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Generator Problem?
            <span className="block text-transparent bg-gradient-to-r from-cyan-400 to-amber-400 bg-clip-text">
              We'll Help You Fix It
            </span>
          </h1>

          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Select your generator problem below for step-by-step diagnosis,
            possible causes ranked by likelihood, and expert repair guidance.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-400">{SYMPTOM_DIAGNOSES.length}</div>
              <div className="text-sm text-slate-400">Problem Types</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">
                {SYMPTOM_DIAGNOSES.reduce((acc, d) => acc + d.possibleCauses.length, 0)}+
              </div>
              <div className="text-sm text-slate-400">Possible Causes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">Free</div>
              <div className="text-sm text-slate-400">To Use</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Cards Grid */}
      <section className="pb-16 md:pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Select Your Generator Problem
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROBLEM_PAGES.map((problem) => (
              <Link
                key={problem.slug}
                href={`/generator-problems/${problem.slug}`}
                className="group relative bg-slate-900/50 border border-slate-700 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300"
              >
                {/* Urgency Badge */}
                <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium border ${urgencyStyles[problem.urgency as keyof typeof urgencyStyles]}`}>
                  {problem.urgency.toUpperCase()}
                </div>

                {/* Icon */}
                <div className="text-4xl mb-4">{problem.icon}</div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {problem.title}
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                  {problem.description}
                </p>

                {/* CTA */}
                <div className="flex items-center gap-2 text-cyan-400 text-sm font-medium">
                  <span>Diagnose Now</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Generator Oracle CTA */}
      <section className="pb-16 md:pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-amber-500/10 via-cyan-500/10 to-amber-500/10 border border-amber-500/30 rounded-2xl p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Need More Detailed Diagnostics?
            </h2>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Generator Oracle provides AI-powered diagnostics with 400,000+ fault codes,
              step-by-step reset procedures, and professional repair guides.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/generator-oracle"
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold rounded-xl hover:scale-105 transition-transform"
              >
                Launch Generator Oracle
              </Link>
              <Link
                href="/troubleshooting"
                className="px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
              >
                Interactive Troubleshooter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="pb-16 md:pb-24 px-6 border-t border-slate-800 pt-16">
        <div className="max-w-4xl mx-auto prose prose-invert">
          <h2 className="text-2xl font-bold text-white mb-6">
            Common Generator Problems in Kenya
          </h2>
          <div className="text-slate-300 space-y-4">
            <p>
              Generators are essential for backup power in Kenya, where grid reliability
              varies across regions. Understanding common generator problems helps you
              maintain your equipment and avoid costly downtime.
            </p>
            <p>
              The most frequent generator issues include starting problems (often caused
              by battery or fuel system faults), overheating (typically due to cooling
              system failures), and electrical issues like unstable voltage output.
            </p>
            <p>
              Our diagnostic guides are based on 12+ years of experience servicing
              generators across all 47 counties in Kenya. Each guide includes possible
              causes ranked by likelihood, step-by-step check procedures, required tools,
              and estimated repair costs.
            </p>
          </div>

          <h3 className="text-xl font-bold text-white mt-8 mb-4">
            When to Call a Professional
          </h3>
          <ul className="text-slate-300 space-y-2">
            <li>Engine internals (pistons, bearings, crankshaft)</li>
            <li>Injection pump calibration or replacement</li>
            <li>ECU/ECM programming and diagnostics</li>
            <li>Alternator rewinding or AVR replacement</li>
            <li>Any issue you're not comfortable diagnosing yourself</li>
          </ul>

          <div className="mt-8 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-green-300 font-medium">
              Need expert help? EmersonEIMS provides 24/7 generator service across Kenya.
              Call <a href="tel:+254768860665" className="underline">+254 768 860 665</a> for emergency assistance.
            </p>
          </div>
        </div>
      </section>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Diagnose Generator Problems',
            description: 'Complete guide to diagnosing and fixing common generator problems',
            step: PROBLEM_PAGES.map((p, i) => ({
              '@type': 'HowToStep',
              position: i + 1,
              name: p.title,
              text: p.description,
              url: `https://www.emersoneims.com/generator-problems/${p.slug}`,
            })),
          }),
        }}
      />
    </main>
  );
}
