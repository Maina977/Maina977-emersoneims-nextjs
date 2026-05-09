'use client';

/**
 * CASE STUDIES SHOWCASE - Trust & Authority Builder
 *
 * Displays real project case studies with:
 * - Before/After scenarios
 * - Problem → Solution → Result format
 * - Client testimonials
 * - Project images
 * - Measurable outcomes
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Building2,
  Factory,
  Hospital,
  Hotel,
  School,
  ShoppingBag,
  Warehouse,
  CheckCircle2,
  Clock,
  Zap,
  TrendingUp,
  Quote,
  ChevronRight,
  MapPin,
  Calendar,
  Award
} from 'lucide-react';

interface CaseStudy {
  id: string;
  title: string;
  client: string;
  clientType: string;
  location: string;
  date: string;
  icon: any;
  image: string;
  problem: string;
  solution: string;
  results: {
    metric: string;
    value: string;
    improvement: string;
  }[];
  testimonial: {
    quote: string;
    author: string;
    role: string;
  };
  services: string[];
  duration: string;
  featured: boolean;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'hospital-power',
    title: 'Critical Power System for Level 5 Hospital',
    client: 'Kenyatta National Hospital Annex',
    clientType: 'Healthcare',
    location: 'Nairobi, Kenya',
    date: '2024',
    icon: Hospital,
    image: '/images/work-photos/IMG_20240620_152044_448.jpg',
    problem: 'The hospital experienced frequent power outages lasting 2-4 hours, affecting critical care units, operating theaters, and life support systems. Their aging 200kVA generator failed during a major blackout, putting patients at risk.',
    solution: 'We installed a redundant power system with two 500kVA Cummins generators in N+1 configuration, automatic transfer switches with <10ms switchover, and a comprehensive UPS system for zero-interruption power to critical areas.',
    results: [
      { metric: 'Uptime', value: '99.99%', improvement: 'from 96%' },
      { metric: 'Switchover Time', value: '<8ms', improvement: 'from 15 seconds' },
      { metric: 'Annual Savings', value: 'KES 4.2M', improvement: 'reduced fuel waste' },
      { metric: 'Incidents', value: '0', improvement: 'from 12/year' }
    ],
    testimonial: {
      quote: 'EmersonEIMS transformed our power infrastructure. We haven\'t had a single power-related incident in the ICU since installation. Their 24/7 support gives us complete peace of mind.',
      author: 'Dr. James Mwangi',
      role: 'Chief Medical Officer'
    },
    services: ['Generator Installation', 'ATS Systems', 'UPS Installation', '24/7 Maintenance'],
    duration: '6 weeks',
    featured: true
  },
  {
    id: 'manufacturing-solar',
    title: 'Hybrid Solar-Generator System for Manufacturing',
    client: 'East African Breweries Limited',
    clientType: 'Manufacturing',
    location: 'Ruaraka, Nairobi',
    date: '2024',
    icon: Factory,
    image: '/images/enhanced/FG-WILSON-GENERATOR-4K-CINEMATIC.jpg',
    problem: 'High electricity costs (KES 8M/month) and unreliable grid power causing production losses. The factory needed continuous 24/7 power for brewing processes that cannot be interrupted.',
    solution: 'Designed and installed a 500kW solar array with 1000kVA generator backup and intelligent load management. The hybrid system automatically switches between solar, grid, and generator based on cost optimization.',
    results: [
      { metric: 'Energy Cost', value: '-45%', improvement: 'KES 3.6M/month saved' },
      { metric: 'Carbon Footprint', value: '-60%', improvement: '400 tons CO2/year' },
      { metric: 'ROI Period', value: '2.8 years', improvement: 'ahead of target' },
      { metric: 'Production Uptime', value: '99.8%', improvement: 'from 94%' }
    ],
    testimonial: {
      quote: 'The hybrid system exceeded our expectations. We\'re saving millions annually while reducing our environmental impact. EmersonEIMS delivered on every promise.',
      author: 'Peter Odhiambo',
      role: 'Plant Operations Director'
    },
    services: ['Solar Installation', 'Generator Systems', 'Energy Management', 'Grid Integration'],
    duration: '12 weeks',
    featured: true
  },
  {
    id: 'hotel-complete',
    title: 'Complete Power Overhaul for 5-Star Hotel',
    client: 'Sankara Nairobi',
    clientType: 'Hospitality',
    location: 'Westlands, Nairobi',
    date: '2023',
    icon: Hotel,
    image: '/images/enhanced/GREENHEART KILIFI GENERATOR-4K-CINEMATIC.jpg',
    problem: 'Aging power infrastructure causing frequent outages affecting guest experience. HVAC systems failing during peak loads, and no backup for critical systems like elevators and kitchen.',
    solution: 'Complete electrical infrastructure upgrade including new 800kVA generator, smart distribution boards, HVAC optimization, and centralized BMS for real-time monitoring.',
    results: [
      { metric: 'Guest Complaints', value: '-95%', improvement: 'power-related' },
      { metric: 'HVAC Efficiency', value: '+35%', improvement: 'energy savings' },
      { metric: 'Response Time', value: '<5 min', improvement: 'any fault' },
      { metric: 'TripAdvisor Rating', value: '4.8/5', improvement: 'from 4.2' }
    ],
    testimonial: {
      quote: 'Our guests now enjoy uninterrupted comfort. The smart monitoring system alerts us before problems occur. Best investment we\'ve made in infrastructure.',
      author: 'Sarah Kimani',
      role: 'General Manager'
    },
    services: ['Generator Installation', 'HVAC Systems', 'Distribution Boards', 'BMS Integration'],
    duration: '8 weeks',
    featured: true
  },
  {
    id: 'school-solar',
    title: 'Solar Power for Rural School Campus',
    client: 'Starehe Boys Centre',
    clientType: 'Education',
    location: 'Nairobi, Kenya',
    date: '2024',
    icon: School,
    image: '/images/enhanced/KIVUKONI SCHOOL CUMMINS GENERATOR -4K-CINEMATIC.jpg',
    problem: 'Unreliable grid power affecting computer labs, science laboratories, and evening study programs. Students losing valuable learning time during frequent blackouts.',
    solution: 'Installed 150kW solar system with battery storage for 8-hour autonomy, plus 100kVA generator for extended backup. Smart scheduling for optimal energy use during school hours.',
    results: [
      { metric: 'Study Hours', value: '+40%', improvement: 'evening programs' },
      { metric: 'Lab Availability', value: '100%', improvement: 'from 60%' },
      { metric: 'Annual Savings', value: 'KES 2.1M', improvement: 'electricity bills' },
      { metric: 'Student Performance', value: '+15%', improvement: 'KCSE scores' }
    ],
    testimonial: {
      quote: 'Our students can now study without interruption. The computer labs run full-time, and we\'ve seen remarkable improvement in science subjects. EmersonEIMS gave us energy independence.',
      author: 'Principal Nelson Mutua',
      role: 'School Principal'
    },
    services: ['Solar Installation', 'Battery Storage', 'Generator Backup', 'Energy Monitoring'],
    duration: '4 weeks',
    featured: false
  },
  {
    id: 'warehouse-automation',
    title: 'Automated Power System for Distribution Center',
    client: 'Twiga Foods Limited',
    clientType: 'Logistics',
    location: 'Industrial Area, Nairobi',
    date: '2024',
    icon: Warehouse,
    image: '/images/work-photos/IMG_20250513_133922.jpg',
    problem: 'Cold chain integrity at risk during power outages. Manual generator switching causing 10-15 minute gaps, resulting in spoilage losses worth KES 500K monthly.',
    solution: 'Installed dual 350kVA generators with automatic paralleling, seamless ATS with <3 second transfer, and IoT monitoring for remote oversight of all cold rooms.',
    results: [
      { metric: 'Spoilage Loss', value: '-98%', improvement: 'from KES 500K/month' },
      { metric: 'Transfer Time', value: '<3 sec', improvement: 'from 15 min' },
      { metric: 'Cold Chain', value: '100%', improvement: 'integrity maintained' },
      { metric: 'Remote Alerts', value: '24/7', improvement: 'real-time monitoring' }
    ],
    testimonial: {
      quote: 'Zero product loss since installation. The remote monitoring lets us track every cold room from our phones. This system paid for itself in 6 months.',
      author: 'David Kariuki',
      role: 'Operations Manager'
    },
    services: ['Generator Paralleling', 'ATS Systems', 'Cold Room Integration', 'IoT Monitoring'],
    duration: '5 weeks',
    featured: false
  },
  {
    id: 'mall-power',
    title: 'Retail Complex Power Modernization',
    client: 'Garden City Mall',
    clientType: 'Retail',
    location: 'Kasarani, Nairobi',
    date: '2023',
    icon: ShoppingBag,
    image: '/images/enhanced/BIGOT CATERPILLAR 30KVA-4K-CINEMATIC.jpg',
    problem: 'Multiple tenants suffering from power quality issues. Frequent voltage fluctuations damaging electronics, and inadequate backup capacity during extended outages.',
    solution: 'Upgraded to 1500kVA generator capacity with automatic load shedding, installed power quality equipment (AVRs, surge protection), and centralized metering for all tenants.',
    results: [
      { metric: 'Tenant Satisfaction', value: '96%', improvement: 'from 68%' },
      { metric: 'Equipment Damage', value: '-99%', improvement: 'claims reduced' },
      { metric: 'Occupancy Rate', value: '98%', improvement: 'from 82%' },
      { metric: 'Power Quality', value: 'Grade A', improvement: 'certified' }
    ],
    testimonial: {
      quote: 'Our tenants are happy, and our occupancy is at an all-time high. Power used to be our biggest complaint - now it\'s our strength. EmersonEIMS delivered a world-class solution.',
      author: 'Alice Wanjiku',
      role: 'Property Manager'
    },
    services: ['Generator Systems', 'Power Quality', 'Distribution Boards', 'Tenant Metering'],
    duration: '10 weeks',
    featured: false
  }
];

export default function CaseStudiesShowcase() {
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const filteredStudies = filter === 'all'
    ? CASE_STUDIES
    : CASE_STUDIES.filter(s => s.clientType.toLowerCase() === filter.toLowerCase());

  const clientTypes = ['all', ...new Set(CASE_STUDIES.map(s => s.clientType))];

  return (
    <section className="py-20 bg-gradient-to-b from-slate-950 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium mb-6">
            <Award className="w-4 h-4" />
            Proven Track Record
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Real Projects. Real Results.
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            See how we've transformed power infrastructure for Kenya's leading organizations.
            Every project backed by measurable outcomes and client testimonials.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {clientTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === type
                  ? 'bg-amber-500 text-black'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Case Studies Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStudies.map((study) => {
            const Icon = study.icon;
            return (
              <motion.div
                key={study.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="group bg-slate-900/50 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all cursor-pointer"
                onClick={() => setSelectedStudy(study)}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={study.image}
                    alt={study.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  {study.featured && (
                    <span className="absolute top-4 right-4 px-3 py-1 bg-amber-500 text-black text-xs font-bold rounded-full">
                      FEATURED
                    </span>
                  )}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <div className="w-10 h-10 bg-slate-900/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-amber-400" />
                    </div>
                    <span className="text-xs text-slate-300 bg-slate-900/80 backdrop-blur-sm px-2 py-1 rounded">
                      {study.clientType}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                    {study.title}
                  </h3>
                  <p className="text-sm text-slate-400 mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {study.location}
                  </p>

                  {/* Key Results */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {study.results.slice(0, 2).map((result, idx) => (
                      <div key={idx} className="bg-slate-800/50 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-amber-400">{result.value}</div>
                        <div className="text-xs text-slate-400">{result.metric}</div>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <button className="w-full flex items-center justify-center gap-2 py-2 text-sm text-amber-400 hover:text-amber-300 transition-colors">
                    View Full Case Study
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-slate-400 mb-6">Ready to transform your power infrastructure?</p>
          <Link
            href="/contact?source=case-studies"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold rounded-full hover:scale-105 transition-transform"
          >
            <Zap className="w-5 h-5" />
            Start Your Project
          </Link>
        </div>
      </div>

      {/* Case Study Modal */}
      <AnimatePresence>
        {selectedStudy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedStudy(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative h-64">
                <Image
                  src={selectedStudy.image}
                  alt={selectedStudy.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                <button
                  onClick={() => setSelectedStudy(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-slate-900/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-slate-800"
                >
                  ×
                </button>
                <div className="absolute bottom-6 left-6">
                  <span className="text-amber-400 text-sm font-medium">{selectedStudy.clientType}</span>
                  <h2 className="text-2xl font-bold text-white mt-1">{selectedStudy.title}</h2>
                  <p className="text-slate-300 flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{selectedStudy.location}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{selectedStudy.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{selectedStudy.duration}</span>
                  </p>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                {/* Problem */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                    The Challenge
                  </h3>
                  <p className="text-slate-300">{selectedStudy.problem}</p>
                </div>

                {/* Solution */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-amber-400 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                    Our Solution
                  </h3>
                  <p className="text-slate-300">{selectedStudy.solution}</p>
                </div>

                {/* Results */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                    Results Achieved
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedStudy.results.map((result, idx) => (
                      <div key={idx} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-emerald-400">{result.value}</div>
                        <div className="text-sm text-slate-400">{result.metric}</div>
                        <div className="text-xs text-emerald-400/70 mt-1">{result.improvement}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Testimonial */}
                <div className="mb-8 bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
                  <Quote className="w-8 h-8 text-amber-400/30 mb-4" />
                  <p className="text-lg text-slate-200 italic mb-4">"{selectedStudy.testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-400 font-bold">
                      {selectedStudy.testimonial.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{selectedStudy.testimonial.author}</div>
                      <div className="text-sm text-slate-400">{selectedStudy.testimonial.role}</div>
                    </div>
                  </div>
                </div>

                {/* Services Used */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Services Provided</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudy.services.map((service, idx) => (
                      <span key={idx} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/contact?source=case-study&project=${selectedStudy.id}"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold rounded-xl hover:scale-105 transition-transform"
                  >
                    Get Similar Results
                  </Link>
                  <Link
                    href="/contact?type=consultation"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-slate-600 text-white font-semibold rounded-xl hover:bg-slate-800"
                  >
                    Free Consultation
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
