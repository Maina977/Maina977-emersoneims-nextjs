'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

/**
 * Generator Oracle - Product Landing Page
 *
 * This is THE product page - not a feature, but a standalone product
 * with its own identity, lead capture, and authority positioning.
 */

/*
 * 2026-10-18 tool audit: this list claimed "the largest fault code database
 * in Africa", AI photo diagnosis, "100% offline", live J1939 monitoring and
 * Portuguese/Amharic/Somali. None of those are in the product. What follows
 * is what Generator Oracle actually does.
 */
const FEATURES = [
  {
    icon: '🔍',
    title: 'Controller Alarm Lookup',
    description: 'Plain-English guides to the alarms on DeepSea, ComAp, Woodward, SmartGen, CAT PowerWizard, Datakom, Lovato, Siemens and ENKO controllers.',
  },
  {
    icon: '🔢',
    title: 'J1939 Engine Codes',
    description: 'Type SPN 100 FMI 1 the way it shows on the display and see what it means, for Cummins, CAT, Perkins, Volvo Penta and other electronic diesels.',
  },
  {
    icon: '🛠️',
    title: 'Symptom Diagnosis',
    description: 'Describe what the generator is doing and get the matching diagnostic guides and alarms. Rule-based, written by our engineers.',
  },
  {
    icon: '🔧',
    title: 'Step-by-Step Checks',
    description: 'Likely causes, what to check first, and how to clear the alarm once the cause is fixed.',
  },
  {
    icon: '🖥️',
    title: 'Training Simulators',
    description: 'Practise on simulated controller displays and a simulated running set before you touch the real one.',
  },
  {
    icon: '🌍',
    title: '7 Languages',
    description: 'English, Kiswahili, French, Spanish, Arabic, Hindi and Chinese.',
  },
];

const STATS = [
  { value: '10', label: 'Controller Brands' },
  { value: 'J1939', label: 'Engine Codes Decoded' },
  { value: 'Free', label: 'No Sign-up Needed' },
  { value: '1 tap', label: 'To an Engineer' },
];

// Testimonials audit 2026-07-23 (owner-directed): the Radisson Blu Nairobi and
// Safaricom Data Centers entries were removed — they attributed invented quotes
// and figures to named organisations that are not confirmed clients. The
// remaining entry is retained per the owner as a genuine client. The `image`
// field is intentionally gone: the card renders an initials avatar, not a photo.
const TESTIMONIALS = [
  {
    quote: "Our field technicians use it every day. The offline capability is crucial for our rural hospital network.",
    name: "Dr. Sarah Wambui",
    title: "Facilities Director",
    company: "PCEA Kikuyu Hospital",
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
  const [submitError, setSubmitError] = useState(false);

  const handleLeadCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(false);

    // Deliver the lead through the real pipeline (/api/contact → email/SMS/ERP/sheet).
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Generator Oracle signup',
          email,
          phone: '',
          service: 'Generator Oracle',
          message: 'Asked to be told about new Generator Oracle guides (product page).',
          source: 'generator_oracle_product_page',
        }),
      });
      if (!res.ok) { setSubmitError(true); return; }
      setSubmitted(true);

      // Track conversion
      if (typeof window !== 'undefined' && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
        (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', 'lead_capture', {
          event_category: 'Generator Oracle',
          event_label: 'Free Trial Signup',
        });
      }
    } catch {
      setSubmitError(true);
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
            <span className="text-amber-400 text-sm font-medium">Free generator fault-code tool</span>
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
              Find the cause of a generator fault faster, with an
              <span className="text-amber-400 font-semibold"> EmersonEIMS engineer</span> one tap away.
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
                  placeholder="Your email for new fault-code guides"
                  required
                  className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending…' : 'Keep me posted'}
                </button>
              </form>
            ) : (
              <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-xl">
                <div className="text-green-400 font-semibold text-lg mb-2">Thank you, we have your email.</div>
                <p className="text-gray-400 mb-4">You do not need to wait for us: Generator Oracle is free to use now.</p>
                <Link
                  href="/generator-oracle"
                  className="inline-block px-6 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition-colors"
                >
                  Launch Generator Oracle →
                </Link>
              </div>
            )}
            {submitError && (
              <p role="alert" className="mt-3 text-sm text-red-300">
                That did not go through. Please try again, or WhatsApp us on 0768 860 665.
              </p>
            )}
            <p className="mt-4 text-sm text-gray-500">
              Generator Oracle is free to use with no sign-up. We only email you about new guides.
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
              Open Generator Oracle →
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
              <span className="text-amber-400"> Diagnose Common Generator Faults</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Built by our field engineers from the faults we see on Kenyan sites, and kept to what we can stand behind.
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
            Works With Sets From These Brands
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
              Find the Cause in <span className="text-amber-400">3 Steps</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-amber-400">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Enter Fault Code</h3>
              <p className="text-gray-400">
                Type the code or alarm exactly as it shows on your controller display.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-amber-400">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Get Diagnosis</h3>
              <p className="text-gray-400">
                See what the fault means, the likely causes, and what to check first.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-amber-400">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Follow Repair Steps</h3>
              <p className="text-gray-400">
                Step-by-step checks, fewer guesses and fewer unnecessary part replacements. Stuck? WhatsApp an engineer.
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
              What Our <span className="text-amber-400">Clients Say</span>
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
            Ready to Find the Fault?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Free to use. No sign-up needed.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Link
              href="/generator-oracle"
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-lg rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all"
            >
              Open Generator Oracle
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
              <p className="text-gray-400 mb-4">Common controller alarms and engine codes, explained with causes and fixes.</p>
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
            "operatingSystem": "Web browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "KES",
              "description": "Free to use"
            },
            "description": "A free generator fault-code tool: controller alarm guides, J1939 engine codes and step-by-step checks, with escalation to EmersonEIMS engineers.",
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
