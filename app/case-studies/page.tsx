// app/case-studies/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Case studies are loaded from data/caseStudies.ts and only entries with
// status === 'PUBLISHED' AND signed evidence are rendered publicly. This is
// enforced by getPublishedCaseStudies(). When the published list is empty
// we show an honest "verified case studies in preparation" state — never
// fabricated counters, success rates, or savings totals.
// See data/caseStudies.ts header for the publication checklist.
// ─────────────────────────────────────────────────────────────────────────────
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import GlassmorphicCard from '@/components/effects/GlassmorphicCard';
import B2BCommercialBand from '@/components/b2b/B2BCommercialBand';
import { B2B_PROFILES } from '@/lib/b2b/pageProfiles';
import { CASE_STUDIES, getPublishedCaseStudies, type CaseStudy } from '@/data/caseStudies';

export default function CaseStudiesPage() {
  const published = getPublishedCaseStudies();
  const draftCount = CASE_STUDIES.length - published.length;

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      <B2BCommercialBand profile={B2B_PROFILES.caseStudies} />

      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
      <div className="fixed inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-7xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-white via-amber-200 to-white bg-clip-text text-transparent">
            Case Studies
          </h1>
          <p className="text-2xl md:text-3xl text-gray-300 max-w-4xl mx-auto font-light">
            Real engineering work across Kenya — published only with signed client release and verifiable evidence.
          </p>
          {published.length > 0 && (
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <span className="px-6 py-3 bg-white/10 rounded-full text-sm backdrop-blur-sm border border-white/20">
                {published.length} Published Project{published.length === 1 ? '' : 's'}
              </span>
            </div>
          )}
        </motion.div>

        {/* Published grid OR honest empty state */}
        {published.length === 0 ? (
          <EmptyState draftCount={draftCount} />
        ) : (
          <div className="space-y-32">
            {published.map((study, index) => (
              <CaseStudyCard key={study.id} study={study} index={index} />
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 text-center"
        >
          <h2 className="text-5xl font-bold mb-8">Need a reference for your project?</h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            We provide verified client references on request to qualified prospects, scoped to your sector and project size.
          </p>
          <Link
            href="/contact"
            className="inline-block px-12 py-6 bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xl font-bold rounded-full hover:scale-105 transition-all duration-500 shadow-[0_0_30px_rgba(251,191,36,0.3)]"
          >
            Request References
          </Link>
        </motion.div>
      </div>
    </main>
  );
}

function EmptyState({ draftCount }: { draftCount: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-3xl mx-auto"
    >
      <GlassmorphicCard intensity="medium" className="p-10 md:p-14 text-center">
        <div className="text-6xl mb-6">📋</div>
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Verified Case Studies In Preparation</h2>
        <p className="text-lg text-gray-300 leading-relaxed mb-6">
          We are finalising signed client releases and independently verifiable metrics
          {draftCount > 0 ? ` for ${draftCount} completed project${draftCount === 1 ? '' : 's'}` : ''}.
          Our policy is to publish only with the client&apos;s written consent and source-document evidence
          (KPLC bills, fuel logs, meter readings) — never marketing estimates.
        </p>
        <p className="text-base text-gray-400 mb-8">
          Qualified prospects can request references directly. We share names, contact details
          and scoped metrics under NDA, matched to your sector and project size.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-full hover:scale-105 transition-all"
          >
            Request References
          </Link>
          <Link
            href="/services"
            className="inline-block px-8 py-4 bg-white/10 text-white font-bold rounded-full border border-white/20 hover:bg-white/20 transition-all"
          >
            See Our Services
          </Link>
        </div>
      </GlassmorphicCard>
    </motion.div>
  );
}

function CaseStudyCard({ study, index }: { study: CaseStudy; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
    >
      <GlassmorphicCard intensity="medium" className="p-8 md:p-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="px-4 py-2 bg-amber-500/20 text-amber-300 rounded-full text-sm font-semibold">
              {study.category}
            </span>
            <span className="px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-full text-sm">
              {study.county}
            </span>
            <span className="px-4 py-2 bg-white/10 rounded-full text-sm">
              {'★'.repeat(study.complexity)} Complexity
            </span>
            {study.completedAt && (
              <span className="px-4 py-2 bg-white/10 rounded-full text-sm text-gray-300">
                Completed {study.completedAt}
              </span>
            )}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-2">{study.title}</h2>
          <p className="text-xl text-gray-400">
            {study.clientNameReleased ? study.client : 'Client (name on request)'} • {study.location}
          </p>
        </div>

        {/* Challenge & Solution */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-red-400">The Challenge</h3>
            <p className="text-gray-300 leading-relaxed">{study.challenge}</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4 text-green-400">Our Solution</h3>
            <p className="text-gray-300 leading-relaxed">{study.solution}</p>
          </div>
        </div>

        {/* Results */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Measurable Results</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {study.results.map((result, i) => (
              <div key={i} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="text-sm text-gray-400 mb-2">{result.metric}</div>
                <div className="text-2xl font-bold text-red-400 mb-1">{result.before}</div>
                <div className="text-xs text-gray-500 mb-2">↓</div>
                <div className="text-2xl font-bold text-green-400 mb-2">{result.after}</div>
                <div className="text-sm text-amber-400 font-semibold">{result.improvement}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical */}
        <div className="mb-12 bg-white/5 rounded-2xl p-8 border border-white/10">
          <h3 className="text-2xl font-bold mb-6">Technical Specifications</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-amber-400 mb-3">Equipment</h4>
              <ul className="space-y-2">
                {study.technical.equipment.map((item, i) => (
                  <li key={i} className="text-gray-300 text-sm flex items-start">
                    <span className="text-amber-500 mr-2">▸</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm text-gray-400">Capacity</h4>
                <p className="text-white font-semibold">{study.technical.capacity}</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-400">Installation</h4>
                <p className="text-white">{study.technical.installation}</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-400">Commissioning</h4>
                <p className="text-white">{study.technical.commissioning}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Financials */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Financial Impact</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-2xl p-6 border border-green-500/20">
              <div className="text-sm text-green-400 mb-2">Annual Savings</div>
              <div className="text-3xl font-bold text-white">
                KES {(study.savings.annualKES / 1_000_000).toFixed(1)}M
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-2xl p-6 border border-amber-500/20">
              <div className="text-sm text-amber-400 mb-2">Payback Period</div>
              <div className="text-3xl font-bold text-white">{study.savings.payback}</div>
            </div>
            <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 rounded-2xl p-6 border border-cyan-500/20">
              <div className="text-sm text-cyan-400 mb-2">ROI</div>
              <div className="text-3xl font-bold text-white">{study.savings.roi}</div>
            </div>
          </div>
        </div>

        {/* Testimonial — only when explicitly released */}
        {study.testimonial?.quoteReleased && (
          <div className="bg-gradient-to-r from-amber-500/10 to-cyan-500/10 rounded-2xl p-8 border-l-4 border-amber-500">
            <div className="text-4xl text-amber-500 mb-4">&ldquo;</div>
            <p className="text-xl text-gray-200 italic mb-6 leading-relaxed">
              {study.testimonial.quote}
            </p>
            <div>
              <p className="font-bold text-white">{study.testimonial.author}</p>
              <p className="text-gray-400">{study.testimonial.position}</p>
            </div>
          </div>
        )}

        {/* Evidence footer — public proof of provenance */}
        {study.evidence && study.evidence.length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/10 text-sm text-gray-400">
            <span className="font-semibold text-gray-300">Evidence on file:</span>{' '}
            {study.evidence.map((e, i) => (
              <span key={i}>
                {i > 0 && ' • '}
                {e.publicUrl ? (
                  <a href={e.publicUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-400">
                    {e.label}
                  </a>
                ) : (
                  e.label
                )}
              </span>
            ))}
          </div>
        )}
      </GlassmorphicCard>
    </motion.div>
  );
}
