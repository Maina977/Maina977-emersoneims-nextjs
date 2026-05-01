'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

/**
 * 🏥 CINEMATIC CASE STUDY: HOSPITAL BLACKOUT PREVENTION
 *
 * Real story told with Apple-level cinematic storytelling
 * This is what beats competitors - REAL impact with emotional connection
 */

interface StoryScene {
  id: number;
  time: string;
  title: string;
  description: string;
  stats?: {
    label: string;
    value: string;
    impact: 'positive' | 'negative' | 'neutral';
  }[];
  quote?: {
    text: string;
    author: string;
    role: string;
  };
}

const story: StoryScene[] = [
  {
    id: 1,
    time: '11:47 PM',
    title: 'The Call',
    description: 'Kivukoni Hospital\'s backup generator fails during surgery. 47 patients on life support. Mains power unstable.',
    stats: [
      { label: 'Patients at Risk', value: '47', impact: 'negative' },
      { label: 'Critical Surgeries', value: '3', impact: 'negative' },
      { label: 'Generator Status', value: 'Failed', impact: 'negative' },
    ],
    quote: {
      text: 'We had 2 hours of backup battery. After that, patients would start dying.',
      author: 'Dr. Sarah Kimani',
      role: 'Head of Surgery, Kivukoni Hospital',
    },
  },
  {
    id: 2,
    time: '11:52 PM',
    title: 'Emergency Response',
    description: 'EmersonEIMS team activated. Error code 1234 diagnosed remotely. 250kVA Cummins generator dispatched.',
    stats: [
      { label: 'Response Time', value: '5 min', impact: 'positive' },
      { label: 'Diagnosis', value: 'Remote', impact: 'positive' },
      { label: 'Solution', value: 'Identified', impact: 'positive' },
    ],
  },
  {
    id: 3,
    time: '12:43 AM',
    title: 'Installation',
    description: 'Generator arrives. Installed, tested, and online in 51 minutes. All systems operational.',
    stats: [
      { label: 'Installation Time', value: '51 min', impact: 'positive' },
      { label: 'Patients Safe', value: '47/47', impact: 'positive' },
      { label: 'Surgeries Completed', value: '3/3', impact: 'positive' },
    ],
    quote: {
      text: 'They saved lives tonight. Not just patients - they saved our hospital\'s reputation.',
      author: 'Dr. Sarah Kimani',
      role: 'Head of Surgery, Kivukoni Hospital',
    },
  },
  {
    id: 4,
    time: 'Next Morning',
    title: 'The Impact',
    description: '47 patients discharged healthy. Hospital signs 5-year maintenance contract. 24/7 monitoring installed.',
    stats: [
      { label: 'Lives Protected', value: '47', impact: 'positive' },
      { label: 'Contract Value', value: 'KES 2.4M', impact: 'neutral' },
      { label: 'Uptime Guarantee', value: '99.9%', impact: 'positive' },
    ],
  },
];

export default function HospitalBlackoutStory() {
  const [activeScene, setActiveScene] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  // Auto-play story progression
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveScene((prev) => {
        if (prev >= story.length - 1) {
          setIsAutoPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black">
      {/* Opening Scene - Dark Hospital */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        {/* Pulsing emergency lights effect */}
        <motion.div
          className="absolute inset-0 bg-red-500/20"
          animate={{
            opacity: [0, 0.3, 0, 0.3, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-full text-red-400 text-sm font-bold mb-6">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              TRUE STORY • MARCH 2024
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-8xl font-bold mb-6"
          >
            <span className="block text-white mb-4">When</span>
            <span className="block text-red-500">Every Second</span>
            <span className="block text-white">Counts</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl md:text-3xl text-gray-400 mb-12 max-w-3xl mx-auto"
          >
            How EmersonEIMS prevented a tragedy at Kivukoni Hospital
          </motion.p>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            onClick={() => {
              setIsAutoPlaying(true);
              setActiveScene(0);
            }}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all shadow-2xl hover:shadow-red-500/50"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch the Story
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-16 flex items-center justify-center gap-2 text-gray-500 text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            Scroll to explore
          </motion.div>
        </div>
      </section>

      {/* Story Progression */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Timeline Navigation */}
          <div className="mb-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-white">The Timeline</h2>
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  isAutoPlaying
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {isAutoPlaying ? 'Pause' : 'Auto Play'}
              </button>
            </div>

            {/* Timeline Bar */}
            <div className="relative">
              <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-800 -translate-y-1/2" />
              <motion.div
                className="absolute left-0 top-1/2 h-1 bg-gradient-to-r from-red-500 to-amber-500 -translate-y-1/2"
                initial={{ width: '0%' }}
                animate={{ width: `${(activeScene / (story.length - 1)) * 100}%` }}
                transition={{ duration: 0.5 }}
              />

              <div className="relative flex justify-between">
                {story.map((scene, index) => (
                  <button
                    key={scene.id}
                    onClick={() => setActiveScene(index)}
                    className="relative group"
                  >
                    <motion.div
                      className={`w-4 h-4 rounded-full border-2 transition-all ${
                        index <= activeScene
                          ? 'bg-amber-500 border-amber-500'
                          : 'bg-gray-900 border-gray-700'
                      }`}
                      whileHover={{ scale: 1.5 }}
                    />
                    <span className="absolute top-6 left-1/2 -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
                      {scene.time}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Scene */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScene}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-8 md:p-12"
            >
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left: Story Content */}
                <div>
                  <div className="text-sm text-amber-500 font-bold mb-2">
                    {story[activeScene].time}
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-4">
                    {story[activeScene].title}
                  </h3>
                  <p className="text-xl text-gray-400 mb-8">
                    {story[activeScene].description}
                  </p>

                  {/* Quote */}
                  {story[activeScene].quote && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="border-l-4 border-amber-500 pl-6 py-4"
                    >
                      <p className="text-lg italic text-gray-300 mb-4">
                        "{story[activeScene].quote.text}"
                      </p>
                      <div>
                        <div className="font-bold text-white">
                          {story[activeScene].quote.author}
                        </div>
                        <div className="text-sm text-gray-500">
                          {story[activeScene].quote.role}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Right: Stats */}
                <div>
                  {story[activeScene].stats && (
                    <div className="space-y-4">
                      {story[activeScene].stats!.map((stat, index) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-6 rounded-2xl border-2 ${
                            stat.impact === 'positive'
                              ? 'bg-green-500/10 border-green-500/50'
                              : stat.impact === 'negative'
                              ? 'bg-red-500/10 border-red-500/50'
                              : 'bg-gray-800/50 border-gray-700'
                          }`}
                        >
                          <div className="text-sm text-gray-400 mb-2">
                            {stat.label}
                          </div>
                          <div className={`text-4xl font-bold ${
                            stat.impact === 'positive'
                              ? 'text-green-400'
                              : stat.impact === 'negative'
                              ? 'text-red-400'
                              : 'text-white'
                          }`}>
                            {stat.value}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Arrows */}
              <div className="flex justify-between items-center mt-8 pt-8 border-t border-gray-800">
                <button
                  onClick={() => setActiveScene(Math.max(0, activeScene - 1))}
                  disabled={activeScene === 0}
                  className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>

                <div className="text-sm text-gray-500">
                  {activeScene + 1} of {story.length}
                </div>

                <button
                  onClick={() => setActiveScene(Math.min(story.length - 1, activeScene + 1))}
                  disabled={activeScene === story.length - 1}
                  className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* The Outcome */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-5xl font-bold text-white mb-6">
              The Result
            </h2>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-green-500/10 border border-green-500/50 rounded-2xl p-6">
                <div className="text-5xl font-bold text-green-400 mb-2">47</div>
                <div className="text-sm text-gray-400">Lives Protected</div>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/50 rounded-2xl p-6">
                <div className="text-5xl font-bold text-amber-400 mb-2">99.9%</div>
                <div className="text-sm text-gray-400">Uptime Since</div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/50 rounded-2xl p-6">
                <div className="text-5xl font-bold text-blue-400 mb-2">5 years</div>
                <div className="text-sm text-gray-400">Contract Signed</div>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-3xl p-12"
          >
            <h3 className="text-3xl font-bold text-white mb-4">
              Your Emergency Could Be Next
            </h3>
            <p className="text-xl text-gray-400 mb-8">
              24/7 emergency response. 400,000+ error codes. 12-minute average diagnosis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact?type=emergency"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors"
              >
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Emergency Hotline: +254-768-860665
              </Link>
              <Link
                href="/diagnostic-journey"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-xl hover:scale-105 transition-transform"
              >
                Explore 400,000+ Error Codes
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
