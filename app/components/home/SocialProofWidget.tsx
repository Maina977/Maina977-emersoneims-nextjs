'use client';

/**
 * ⚠️ DEAD CODE — NOT RENDERED, AND MUST NOT BE RE-ENABLED AS IT STANDS.
 *
 * app/page.tsx imports SocialProofWidget from '@/components/home/...', which is
 * a 3-line stub returning an empty div. THIS file is not imported by anything.
 *
 * Every testimonial below is FABRICATED: five invented individuals, invented
 * job titles, and invented metrics ("99.8% uptime SLA met", "45% cost
 * reduction", "94% accuracy to forecast"), each flagged `verified: true`. None
 * of it has a signed release or any evidence behind it.
 *
 * That directly violates the publication policy in data/caseStudies.ts, which
 * publishes a client only with written consent AND source-document evidence.
 * It is the reason /case-studies shows an honest empty state rather than
 * invented success stories.
 *
 * 2026-08-03: the named organisations were removed on the owner's instruction
 * that we do not put other companies' names on our site — they read
 * "Kenyatta National Hospital", "Equity Bank", "Nairobi Steel Works",
 * "Bigot Flowers" and "Safaricom". Removing the names does NOT make the
 * testimonials true.
 *
 * Before this component is ever used: replace every entry with a real,
 * released client quote, or delete the file.
 */

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function SocialProofWidget() {
  const testimonials = [
    {
      name: 'Dr. James Kipchoge',
      role: 'Hospital Director, Nairobi referral hospital',
      location: 'Nairobi',
      service: 'Generator Emergency Repair + UPS Systems',
      quote: 'When our main generator failed during a critical surgery, EmersonEIMS had a replacement running in 2 hours. Their 24/7 support saved lives.',
      metrics: '2-hour emergency response | 99.8% uptime SLA met',
      image: '👨‍⚕️',
      verified: true,
    },
    {
      name: 'Sarah Mwangi',
      role: 'Operations Manager, commercial bank',
      location: 'Kisumu',
      service: 'Solar + UPS + Generator Integration',
      quote: 'They designed a hybrid system that reduced our power costs by 45%. The AI sizing was spot-on — no guesswork, just engineering precision.',
      metrics: '45% cost reduction | 6-month ROI',
      image: '👩‍💼',
      verified: true,
    },
    {
      name: 'Peter Kariuki',
      role: 'Manufacturing Director, steel fabrication plant',
      location: 'Nairobi',
      service: 'Generator Maintenance + Preventive SLA',
      quote: 'We went from reactive repairs (KES 300K/year) to preventive maintenance (KES 120K/year). Their predictive maintenance caught 3 major issues before failure.',
      metrics: '60% cost savings | 40 hours downtime prevented',
      image: '👨‍🏭',
      verified: true,
    },
    {
      name: 'Grace Njoroge',
      role: 'Farm Manager, flower export farm',
      location: 'Naivasha',
      service: 'Solar System + Motor Rewinding',
      quote: 'EmersonEIMS sized our solar perfectly for Kenya\'s climate. Even in cloudy season, we hit 94% of forecast. No surprises, just science.',
      metrics: '94% accuracy to forecast | 25-year plan confident',
      image: '👩‍🌾',
      verified: true,
    },
    {
      name: 'Mohamed Hassan',
      role: 'Telecom Infrastructure Manager, mobile network operator',
      location: 'Mombasa',
      service: 'Tower Generator + ATS + Monitoring',
      quote: 'Their ATS changeover system improved our tower uptime from 98.2% to 99.7%. That\'s millions in prevented data loss.',
      metrics: '99.7% uptime achieved | 50+ towers nationwide',
      image: '👨‍💻',
      verified: true,
    },
  ];

  const stats = [
    { number: '1,200+', label: 'Generators Financed', icon: '⚡' },
    { number: '500+', label: 'Integrated Installations', icon: '🔧' },
    { number: '47', label: 'Counties Served', icon: '📍' },
    { number: '4.8/5', label: 'Average Rating', icon: '⭐' },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-black to-slate-900/30 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10 text-green-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Trusted by 1,200+ Customers Across Kenya
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Real Results
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
              From Real Customers
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            From hospitals saving lives to factories cutting costs to farms maximizing harvests — here's what EmersonEIMS delivers.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, idx) => (
            <div key={idx} className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-green-500/20 rounded-lg text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-green-400 mb-1">{stat.number}</div>
              <div className="text-sm text-gray-300">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="relative p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-green-500/20 rounded-lg hover:border-green-500/50 transition-all"
            >
              {/* Verified Badge */}
              {testimonial.verified && (
                <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">
                  ✓ Verified
                </div>
              )}

              {/* Quote */}
              <p className="text-gray-300 mb-6 italic text-sm leading-relaxed">
                "{testimonial.quote}"
              </p>

              {/* Divider */}
              <div className="border-t border-white/10 mb-6" />

              {/* Author */}
              <div className="flex items-start gap-4 mb-6">
                <div className="text-4xl">{testimonial.image}</div>
                <div>
                  <p className="font-bold text-white">{testimonial.name}</p>
                  <p className="text-sm text-green-400">{testimonial.role}</p>
                  <p className="text-xs text-gray-400">{testimonial.location}</p>
                </div>
              </div>

              {/* Service Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full mb-6">
                <span className="text-xs font-semibold text-green-300">{testimonial.service}</span>
              </div>

              {/* Metrics */}
              <div className="bg-black/50 rounded-lg p-4 border border-green-500/10">
                <p className="text-sm text-gray-300">
                  <span className="text-green-400 font-semibold">Results:</span> {testimonial.metrics}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-300 mb-6">
            Your business could be next. See how EmersonEIMS solves power, cuts costs, and scales operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact?type=case-study"
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:scale-105 transition-all"
            >
              Get Your Custom Solution
            </a>
            <a
              href="/case-studies"
              className="px-8 py-4 border-2 border-green-500 text-green-400 font-bold rounded-lg hover:bg-green-500/10 transition-all"
            >
              View More Case Studies
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
