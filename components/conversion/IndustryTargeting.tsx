'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

/**
 * IndustryTargeting - Industry-Specific Conversion Component
 *
 * Displays targeted messaging for different industries:
 * - Hotels, Hospitals, Schools, Banks
 * - Industries, Flower Farms, Churches, Real Estate
 *
 * Each industry gets custom pain points and solutions.
 * Phone: +254768860665
 */

const PHONE_NUMBER = '+254768860665';
const WHATSAPP_NUMBER = '254768860665';

interface Industry {
  id: string;
  name: string;
  icon: string;
  headline: string;
  painPoints: string[];
  solutions: string[];
  stats: { value: string; label: string }[];
  ctaText: string;
  color: string;
  gradient: string;
}

const industries: Industry[] = [
  {
    id: 'hotels',
    name: 'Hotels & Hospitality',
    icon: '🏨',
    headline: 'Never Lose Guests Due to Power Outages',
    painPoints: [
      'Guest complaints during blackouts',
      'Lost bookings due to power reputation',
      'Food spoilage in kitchen freezers',
      'HVAC failures affecting comfort',
    ],
    solutions: [
      'Automatic transfer switch for seamless backup',
      'Silent-running generators for guest comfort',
      '24/7 monitoring with instant alerts',
      'Preventive maintenance plans',
    ],
    stats: [
      { value: '16,245+', label: 'Hotels Served in Kenya' },
      { value: '<10s', label: 'Power Transfer Time' },
      { value: '99.9%', label: 'Uptime Guarantee' },
    ],
    ctaText: 'Protect Your Guests - Get Quote',
    color: 'from-purple-500 to-indigo-600',
    gradient: 'bg-gradient-to-br from-purple-500/20 to-indigo-600/20',
  },
  {
    id: 'hospitals',
    name: 'Hospitals & Healthcare',
    icon: '🏥',
    headline: 'Life-Saving Power Solutions - Zero Downtime',
    painPoints: [
      'Life-support equipment at risk',
      'Operating theater interruptions',
      'Vaccine & blood storage failures',
      'Emergency room chaos',
    ],
    solutions: [
      'Medical-grade power systems',
      'Redundant backup systems',
      'UPS for critical equipment',
      'Compliance with health standards',
    ],
    stats: [
      { value: '9,458+', label: 'Healthcare Facilities Served' },
      { value: '0', label: 'Seconds Interruption' },
      { value: 'Tier-1', label: 'Healthcare Certified' },
    ],
    ctaText: 'Protect Lives - Get Quote',
    color: 'from-red-500 to-rose-600',
    gradient: 'bg-gradient-to-br from-red-500/20 to-rose-600/20',
  },
  {
    id: 'schools',
    name: 'Schools & Education',
    icon: '🏫',
    headline: 'Keep Education Running 24/7',
    painPoints: [
      'Exam disruptions during blackouts',
      'Computer lab downtime',
      'Science equipment failures',
      'Boarding school safety concerns',
    ],
    solutions: [
      'Reliable backup for exam periods',
      'Solar + generator hybrid systems',
      'Low-cost maintenance plans for schools',
      'Energy savings up to 40%',
    ],
    stats: [
      { value: '93,988+', label: 'Schools in Kenya' },
      { value: '40%', label: 'Energy Cost Savings' },
      { value: '24/7', label: 'Boarding Support' },
    ],
    ctaText: 'Empower Education - Get Quote',
    color: 'from-blue-500 to-cyan-600',
    gradient: 'bg-gradient-to-br from-blue-500/20 to-cyan-600/20',
  },
  {
    id: 'banks',
    name: 'Banks & Financial',
    icon: '🏦',
    headline: 'Secure, Uninterrupted Banking Operations',
    painPoints: [
      'ATM downtime losing customers',
      'Transaction failures costing money',
      'Data center vulnerabilities',
      'Branch security concerns',
    ],
    solutions: [
      'Enterprise-grade UPS systems',
      'Dual-redundant power backup',
      'Real-time monitoring dashboard',
      'SLA-backed service agreements',
    ],
    stats: [
      { value: '100+', label: 'Bank Branches Powered' },
      { value: '99.99%', label: 'Uptime Achieved' },
      { value: '0', label: 'Data Loss Incidents' },
    ],
    ctaText: 'Secure Your Operations - Get Quote',
    color: 'from-emerald-500 to-teal-600',
    gradient: 'bg-gradient-to-br from-emerald-500/20 to-teal-600/20',
  },
  {
    id: 'industries',
    name: 'Industries & Manufacturing',
    icon: '🏭',
    headline: 'Maximize Production, Minimize Downtime',
    painPoints: [
      'Production line stops costing millions',
      'Equipment damage from power surges',
      'Worker overtime during outages',
      'Raw material spoilage',
    ],
    solutions: [
      'High-capacity industrial generators',
      'Power factor correction systems',
      'Surge protection for machines',
      'Preventive maintenance contracts',
    ],
    stats: [
      { value: 'KES 2M+', label: 'Saved Per Outage' },
      { value: '500kVA+', label: 'Generators Available' },
      { value: '2hr', label: 'Emergency Response' },
    ],
    ctaText: 'Protect Production - Get Quote',
    color: 'from-orange-500 to-amber-600',
    gradient: 'bg-gradient-to-br from-orange-500/20 to-amber-600/20',
  },
  {
    id: 'flower-farms',
    name: 'Flower Farms & Agriculture',
    icon: '🌸',
    headline: 'Protect Your Harvest with Reliable Power',
    painPoints: [
      'Cold chain failures destroying flowers',
      'Irrigation pump failures',
      'Greenhouse climate control issues',
      'Pack house downtime during exports',
    ],
    solutions: [
      'Cold room backup systems',
      'Borehole pump power solutions',
      'Solar-powered irrigation',
      '24/7 harvest season support',
    ],
    stats: [
      { value: '200+', label: 'Farms Served in Naivasha' },
      { value: 'KES 5M+', label: 'Saved in Flower Loss' },
      { value: '100%', label: 'Cold Chain Uptime' },
    ],
    ctaText: 'Protect Your Harvest - Get Quote',
    color: 'from-pink-500 to-rose-600',
    gradient: 'bg-gradient-to-br from-pink-500/20 to-rose-600/20',
  },
  {
    id: 'churches',
    name: 'Churches & Religious',
    icon: '⛪',
    headline: 'Worship Without Interruption',
    painPoints: [
      'Service interruptions during worship',
      'Sound system failures',
      'Live streaming disruptions',
      'Event power shortages',
    ],
    solutions: [
      'Silent generators for worship',
      'Solar systems for cost savings',
      'Reliable PA system power',
      'Flexible payment plans',
    ],
    stats: [
      { value: '500+', label: 'Churches Powered' },
      { value: '50%', label: 'Energy Cost Reduction' },
      { value: 'Silent', label: 'Operation Guaranteed' },
    ],
    ctaText: 'Empower Your Ministry - Get Quote',
    color: 'from-yellow-500 to-orange-600',
    gradient: 'bg-gradient-to-br from-yellow-500/20 to-orange-600/20',
  },
  {
    id: 'real-estate',
    name: 'Real Estate & Property',
    icon: '🏢',
    headline: 'Premium Power for Premium Properties',
    painPoints: [
      'Tenant complaints during outages',
      'Elevator failures causing issues',
      'Security system vulnerabilities',
      'Common area lighting failures',
    ],
    solutions: [
      'Whole-building backup systems',
      'Solar for common areas',
      'Smart monitoring systems',
      'Maintenance-inclusive packages',
    ],
    stats: [
      { value: '300+', label: 'Buildings Powered' },
      { value: 'KES 200K+', label: 'Monthly Savings' },
      { value: '24/7', label: 'Tenant Satisfaction' },
    ],
    ctaText: 'Elevate Your Property - Get Quote',
    color: 'from-slate-500 to-slate-700',
    gradient: 'bg-gradient-to-br from-slate-500/20 to-slate-700/20',
  },
];

interface IndustryTargetingProps {
  selectedIndustry?: string;
  showAll?: boolean;
  className?: string;
}

export default function IndustryTargeting({
  selectedIndustry,
  showAll = true,
  className = '',
}: IndustryTargetingProps) {
  const [activeIndustry, setActiveIndustry] = useState(
    selectedIndustry || industries[0].id
  );

  const currentIndustry = industries.find(i => i.id === activeIndustry) || industries[0];

  const whatsappMessage = encodeURIComponent(
    `Hello EmersonEIMS! I'm from the ${currentIndustry.name} sector and I'm interested in power solutions. Please send me information and a FREE quote. Thank you!`
  );

  return (
    <div className={`${className}`}>
      {/* Industry Selector */}
      {showAll && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">
            Select Your Industry
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {industries.map(industry => (
              <motion.button
                key={industry.id}
                onClick={() => setActiveIndustry(industry.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                  activeIndustry === industry.id
                    ? 'border-amber-500 bg-amber-500/20 text-white'
                    : 'border-slate-600 bg-slate-800 text-slate-400 hover:border-slate-500'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-xl">{industry.icon}</span>
                <span className="text-sm font-medium hidden sm:inline">{industry.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Industry Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndustry.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`rounded-2xl border border-slate-700/50 overflow-hidden ${currentIndustry.gradient}`}
        >
          {/* Header */}
          <div className={`bg-gradient-to-r ${currentIndustry.color} p-6 md:p-8`}>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl">{currentIndustry.icon}</span>
              <div>
                <p className="text-white/80 text-sm font-medium">Power Solutions for</p>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  {currentIndustry.name}
                </h2>
              </div>
            </div>
            <p className="text-xl md:text-2xl font-bold text-white">
              {currentIndustry.headline}
            </p>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 bg-slate-900/50">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Pain Points */}
              <div>
                <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                  <span>😰</span> Common Challenges
                </h3>
                <ul className="space-y-3">
                  {currentIndustry.painPoints.map((point, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 text-slate-300"
                    >
                      <span className="text-red-500 mt-1">✕</span>
                      <span>{point}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Solutions */}
              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                  <span>✅</span> Our Solutions
                </h3>
                <ul className="space-y-3">
                  {currentIndustry.solutions.map((solution, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 text-slate-300"
                    >
                      <span className="text-green-500 mt-1">✓</span>
                      <span>{solution}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {currentIndustry.stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-4 bg-slate-800/50 rounded-lg"
                >
                  <p className="text-2xl md:text-3xl font-bold text-amber-400">
                    {stat.value}
                  </p>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {currentIndustry.ctaText}
              </motion.a>
              <motion.a
                href={`tel:${PHONE_NUMBER}`}
                className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call: {PHONE_NUMBER}
              </motion.a>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Export individual industry cards for use in pages
export function IndustryCard({ industryId }: { industryId: string }) {
  const industry = industries.find(i => i.id === industryId);
  if (!industry) return null;

  const whatsappMessage = encodeURIComponent(
    `Hello EmersonEIMS! I'm from the ${industry.name} sector. Please send me a FREE quote for power solutions. Thank you!`
  );

  return (
    <Link href={`/industries/${industryId}`}>
      <motion.div
        className={`rounded-xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all cursor-pointer ${industry.gradient}`}
        whileHover={{ scale: 1.02, y: -5 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{industry.icon}</span>
          <h3 className="text-lg font-bold text-white">{industry.name}</h3>
        </div>
        <p className="text-slate-300 text-sm mb-4">{industry.headline}</p>
        <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
          Learn More
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </motion.div>
    </Link>
  );
}

// Export industries data for use elsewhere
export { industries };
