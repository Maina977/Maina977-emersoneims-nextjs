'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface CaseStudy {
  id: string;
  title: string;
  client: string;
  industry: string;
  location: string;
  challenge: string;
  solution: string;
  results: {
    metric: string;
    value: string;
    improvement: string;
  }[];
  image: string;
  logo?: string;
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
}

const caseStudies: CaseStudy[] = [
  {
    id: 'st-austins-academy',
    title: 'Educational Institution Power Upgrade',
    client: 'St. Austins Academy',
    industry: 'Education',
    location: 'Nairobi, Kenya',
    challenge: 'Frequent power outages disrupting classes, computer labs, and examination periods. Unreliable grid supply affecting student learning.',
    solution: 'Installed 50kVA automatic generator system with instant transfer switching, surge protection for computer equipment, and remote monitoring capabilities.',
    results: [
      { metric: 'Uptime', value: '99.9%', improvement: '+12%' },
      { metric: 'Transfer Time', value: '<5s', improvement: 'instant' },
      { metric: 'Annual Savings', value: 'KES 2.5M', improvement: 'verified' },
      { metric: 'Disruptions', value: 'Zero', improvement: 'Since 2023' },
    ],
    image: '/images/case-studies/education.jpg',
    testimonial: {
      quote: 'Our students no longer lose work during power cuts. EmersonEIMS has been transformative for our learning environment.',
      author: 'Principal',
      role: 'School Administration'
    }
  },
  {
    id: 'bigot-flowers',
    title: 'Agricultural Cold Chain Power',
    client: 'Bigot Flowers Naivasha',
    industry: 'Agriculture',
    location: 'Naivasha, Kenya',
    challenge: 'Cold storage facilities requiring 24/7 power for flower preservation. Power failures causing significant crop losses and export delays.',
    solution: 'Deployed 300+100kVA redundant generator system with automatic load management, temperature monitoring integration, and scheduled maintenance alerts.',
    results: [
      { metric: 'Cold Chain', value: '100%', improvement: 'maintained' },
      { metric: 'Crop Losses', value: '-95%', improvement: 'reduced' },
      { metric: 'Export Quality', value: 'Grade A', improvement: 'consistent' },
      { metric: 'ROI Period', value: '18 mo', improvement: 'achieved' },
    ],
    image: '/images/case-studies/agriculture.jpg',
    testimonial: {
      quote: 'Our flower exports now meet European standards consistently. The power system pays for itself.',
      author: 'Farm Manager',
      role: 'Operations'
    }
  },
  {
    id: 'maua-hospital',
    title: 'Healthcare Facility Power Solution',
    client: 'Maua Methodist Hospital',
    industry: 'Healthcare',
    location: 'Meru, Kenya',
    challenge: 'Rural healthcare facility needing reliable power for surgical theaters, laboratory equipment, and patient care systems.',
    solution: 'Installed 200kVA medical-grade generator with UPS backup for critical equipment, automatic transfer switching, and 24/7 remote monitoring.',
    results: [
      { metric: 'Uptime', value: '99.95%', improvement: '+8%' },
      { metric: 'Surgeries', value: 'Zero', improvement: 'interrupted' },
      { metric: 'Equipment Life', value: '+35%', improvement: 'extended' },
      { metric: 'Response Time', value: '<2hr', improvement: 'guaranteed' },
    ],
    image: '/images/case-studies/hospital.jpg',
    testimonial: {
      quote: 'EmersonEIMS ensures our patients receive uninterrupted care. Critical for rural healthcare.',
      author: 'Hospital Administrator',
      role: 'Healthcare'
    }
  },
];

export default function CaseStudiesSection() {
  return (
    <section className="py-24 sm:py-32 bg-gradient-to-b from-black via-gray-950 to-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(6,182,212,0.08),transparent_60%)]" />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-cyan-400 text-sm uppercase tracking-[0.3em] mb-4 block font-medium">
            Proven Results
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Real Projects.
            <span className="text-transparent bg-gradient-to-r from-cyan-400 to-amber-400 bg-clip-text"> Measurable Impact.</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            See how we&apos;ve transformed power infrastructure for East Africa&apos;s leading organizations.
          </p>
        </motion.div>

        {/* Case studies grid */}
        <div className="space-y-24">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image side */}
              <div className={`relative ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="relative h-[400px] sm:h-[500px] rounded-3xl overflow-hidden group">
                  {/* Placeholder gradient for missing images */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/50 via-gray-900 to-amber-900/50">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-4">
                          {study.industry === 'Healthcare' ? '🏥' : 
                           study.industry === 'Manufacturing' ? '🏭' : '🏨'}
                        </div>
                        <div className="text-white/60 text-sm uppercase tracking-wider">{study.industry}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Industry badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-xs text-white">
                    {study.industry}
                  </div>
                  
                  {/* Location badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-xs text-gray-400">
                    📍 {study.location}
                  </div>

                  {/* Client name */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="text-amber-400 text-sm font-medium mb-1">{study.client}</div>
                    <div className="text-white text-2xl font-bold">{study.title}</div>
                  </div>
                </div>
              </div>

              {/* Content side */}
              <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                {/* Challenge & Solution */}
                <div className="space-y-6 mb-8">
                  <div>
                    <h4 className="text-red-400 text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                      <span>⚠️</span> The Challenge
                    </h4>
                    <p className="text-gray-300">{study.challenge}</p>
                  </div>
                  <div>
                    <h4 className="text-green-400 text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                      <span>✅</span> Our Solution
                    </h4>
                    <p className="text-gray-300">{study.solution}</p>
                  </div>
                </div>

                {/* Results grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {study.results.map((result, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-colors"
                    >
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{result.metric}</div>
                      <div className="text-2xl font-bold text-white">{result.value}</div>
                      <div className="text-xs text-amber-400">{result.improvement}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Testimonial */}
                {study.testimonial && (
                  <div className="p-6 rounded-xl bg-gradient-to-r from-amber-500/10 to-transparent border-l-4 border-amber-500">
                    <p className="text-gray-300 italic mb-3">&ldquo;{study.testimonial.quote}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
                        {study.testimonial.author.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">{study.testimonial.author}</div>
                        <div className="text-gray-500 text-xs">{study.testimonial.role}, {study.client}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <p className="text-gray-400 mb-6">Ready to write your success story?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact?type=consultation"
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-full hover:shadow-[0_0_40px_rgba(251,191,36,0.4)] transition-all hover:scale-105"
            >
              Start Your Project
            </Link>
            <Link
              href="/case-studies"
              className="px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-full hover:border-white/40 transition-all"
            >
              View All Case Studies
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
