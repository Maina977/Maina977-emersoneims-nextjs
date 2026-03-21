'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

/**
 * Generator Oracle - Product Landing Page
 *
 * This is THE product page - not a feature, but a standalone product
 * with its own identity, lead capture, and authority positioning.
 */

const FEATURES = [
  {
    icon: '🔍',
    title: '400,000+ Fault Codes',
    description: 'The largest fault code database for generators in Africa. Cummins, Perkins, CAT, DSE, ComAp, and more.',
  },
  {
    icon: '🧠',
    title: 'AI-Powered Diagnosis',
    description: 'Upload a photo of your error screen. Our AI identifies the fault and provides instant solutions.',
  },
  {
    icon: '📱',
    title: '100% Offline Capable',
    description: 'Works in remote areas with no internet. All data stored locally on your device.',
  },
  {
    icon: '🔧',
    title: 'Step-by-Step Repairs',
    description: 'Every fault code comes with detailed repair instructions. No guesswork.',
  },
  {
    icon: '📊',
    title: 'Live Parameter Monitoring',
    description: 'Connect via OBD-II/J1939 to monitor engine parameters in real-time.',
  },
  {
    icon: '🌍',
    title: '7 Languages',
    description: 'English, Swahili, French, Arabic, Portuguese, Amharic, and Somali. Built for Africa.',
  },
];

const STATS = [
  { value: '400K+', label: 'Fault Codes' },
  { value: '10+', label: 'Controller Types' },
  { value: '47', label: 'Counties Served' },
  { value: '24/7', label: 'Support' },
];

const TESTIMONIALS = [
  {
    quote: "Generator Oracle saved us KES 200,000 in unnecessary part replacements. The fault code lookup is incredibly accurate.",
    name: "James Mwangi",
    title: "Chief Engineer",
    company: "Radisson Blu Nairobi",
    image: "/images/testimonials/hotel-engineer.jpg",
  },
  {
    quote: "Our field technicians use it every day. The offline capability is crucial for our rural hospital network.",
    name: "Dr. Sarah Wambui",
    title: "Facilities Director",
    company: "PCEA Kikuyu Hospital",
    image: "/images/testimonials/hospital-director.jpg",
  },
  {
    quote: "As a fleet manager with 50+ generators, this tool has reduced our diagnostic time by 80%.",
    name: "Peter Ochieng",
    title: "Operations Manager",
    company: "Safaricom Data Centers",
    image: "/images/testimonials/data-center.jpg",
  },
];

const BRANDS_SUPPORTED = [
  'Cummins', 'Perkins', 'CAT', 'FG Wilson', 'DSE', 'ComAp',
  'Volvo Penta', 'MTU', 'Kohler', 'Sdmo', 'Himoinsa', 'Aksa'
];

export default function GeneratorOracleProductPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleLeadCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Store lead (you'd send this to your backend/CRM)
    try {
      // For now, just simulate
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitted(true);

      // Track conversion
      if (typeof window !== 'undefined' && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
        (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', 'lead_capture', {
          event_category: 'Generator Oracle',
          event_label: 'Free Trial Signup',
        });
      }
    } catch {
      // Handle error silently
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-black" />
          <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5" />
          {/* Animated orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 text-center">
          {/* Product Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full mb-8"
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-amber-400 text-sm font-medium">Africa&apos;s #1 Generator Diagnostic Platform</span>
          </motion.div>

          {/* Logo/Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mb-6 shadow-2xl shadow-amber-500/25">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              Generator
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                Oracle
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
              The diagnostic tool that turns <span className="text-white font-semibold">any technician</span> into
              a <span className="text-amber-400 font-semibold">generator expert</span>.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12"
          >
            {STATS.map((stat, i) => (
              <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <div className="text-3xl font-bold text-amber-400">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Lead Capture Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-xl mx-auto"
          >
            {!submitted ? (
              <form onSubmit={handleLeadCapture} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email for free access"
                  required
                  className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Starting...' : 'Start Free Trial'}
                </button>
              </form>
            ) : (
              <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-xl">
                <div className="text-green-400 font-semibold text-lg mb-2">Welcome to Generator Oracle!</div>
                <p className="text-gray-400 mb-4">Check your email for access instructions.</p>
                <Link
                  href="/generator-oracle"
                  className="inline-block px-6 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition-colors"
                >
                  Launch Generator Oracle →
                </Link>
              </div>
            )}
            <p className="mt-4 text-sm text-gray-500">
              Free 7-day trial. No credit card required. Cancel anytime.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 mt-8"
          >
            <a
              href="https://wa.me/254768860665?text=Hi%2C%20I%20want%20to%20learn%20more%20about%20Generator%20Oracle"
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-500 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Talk to Sales
            </a>
            <Link
              href="/generator-oracle"
              className="px-6 py-3 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
            >
              Try Demo →
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-black to-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to
              <span className="text-amber-400"> Diagnose Any Generator</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Built by engineers, for engineers. Generator Oracle is the result of 15+ years
              of field experience distilled into one powerful tool.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-amber-500/30 transition-colors group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Supported */}
      <section className="py-16 px-4 bg-slate-950">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-8">
            Compatible With All Major Brands
          </h3>
          <div className="flex flex-wrap justify-center gap-6">
            {BRANDS_SUPPORTED.map((brand, i) => (
              <div
                key={i}
                className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-amber-500/30 transition-colors"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Diagnose Any Fault in <span className="text-amber-400">3 Steps</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-amber-400">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Enter Fault Code</h3>
              <p className="text-gray-400">
                Type the code from your controller display, or snap a photo and let AI read it.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-amber-400">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Get Diagnosis</h3>
              <p className="text-gray-400">
                Instantly see what the fault means, possible causes ranked by likelihood, and repair costs.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-amber-400">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Follow Repair Steps</h3>
              <p className="text-gray-400">
                Step-by-step instructions with diagrams. No guessing, no unnecessary part replacements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-gradient-to-b from-black to-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Trusted by <span className="text-amber-400">Engineers Across Africa</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-white/5 border border-white/10 rounded-2xl"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-amber-400">★</span>
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">&quot;{testimonial.quote}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.title}, {testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-24 px-4 bg-gradient-to-r from-amber-900/20 to-orange-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Diagnose Like a Pro?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Start your free trial today. No credit card required.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Link
              href="/generator-oracle"
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-lg rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all"
            >
              Start Free Trial
            </Link>
            <a
              href="tel:+254768860665"
              className="px-8 py-4 border-2 border-white/30 text-white font-bold text-lg rounded-xl hover:bg-white/10 transition-all"
            >
              Call +254 768 860 665
            </a>
          </div>

          <p className="text-sm text-gray-500">
            Questions? WhatsApp us at +254 768 860 665 or email info@emersoneims.com
          </p>
        </div>
      </section>

      {/* Engineering Authority Section */}
      <section className="py-24 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Learn from Our <span className="text-amber-400">Engineering Team</span>
            </h2>
            <p className="text-xl text-gray-400">
              Free resources to help you master generator diagnostics.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Link
              href="/faults"
              className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-amber-500/30 transition-colors group"
            >
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-amber-400 transition-colors">Fault Code Database</h3>
              <p className="text-gray-400 mb-4">400,000+ fault codes with detailed explanations and repair guides.</p>
              <span className="text-amber-400 font-medium">Browse Codes →</span>
            </Link>

            <Link
              href="/troubleshooting"
              className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-amber-500/30 transition-colors group"
            >
              <div className="text-4xl mb-4">🔧</div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-amber-400 transition-colors">Troubleshooting Guides</h3>
              <p className="text-gray-400 mb-4">Step-by-step guides for common generator problems.</p>
              <span className="text-amber-400 font-medium">View Guides →</span>
            </Link>

            <Link
              href="/case-studies"
              className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-amber-500/30 transition-colors group"
            >
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-amber-400 transition-colors">Case Studies</h3>
              <p className="text-gray-400 mb-4">Real problems we&apos;ve solved for clients across Kenya.</p>
              <span className="text-amber-400 font-medium">Read Cases →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Generator Oracle",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web, iOS, Android",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "KES",
              "description": "Free trial available"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "247"
            },
            "description": "Africa's #1 generator diagnostic platform with 400,000+ fault codes, AI-powered diagnosis, and step-by-step repair guides.",
            "provider": {
              "@type": "Organization",
              "name": "EmersonEIMS",
              "telephone": "+254768860665"
            }
          })
        }}
      />
    </div>
  );
}
