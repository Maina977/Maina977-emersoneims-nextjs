'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// FAQ Data - Aggregated from across the site
const FAQ_DATA = [
  // Generator FAQs
  {
    id: 'gen-1',
    category: 'Generators',
    question: 'What size generator do I need for my home or business?',
    answer: 'Generator sizing depends on your total electrical load. For homes, typically 10-25kVA covers most needs. For businesses, calculate your total connected load and add 25% safety margin. Use our free Generator Sizing Calculator for accurate recommendations based on your specific appliances and equipment.',
    tags: ['sizing', 'home', 'business', 'kva']
  },
  {
    id: 'gen-2',
    category: 'Generators',
    question: 'How often should I service my generator?',
    answer: 'We recommend: Daily checks (oil, coolant, fuel levels), oil change every 250 hours or 6 months, full service every 500 hours or annually, and major overhaul every 2000-3000 hours. Regular maintenance extends generator life from 15,000 to 25,000+ hours.',
    tags: ['maintenance', 'service', 'oil change']
  },
  {
    id: 'gen-3',
    category: 'Generators',
    question: 'What brands of generators do you supply?',
    answer: 'We are authorized dealers for Cummins and Voltka generators. We also supply and service Caterpillar, FG Wilson, Perkins, Kohler, SDMO, MTU, Deutz, Volvo Penta, and other major brands from 20kVA to 2000kVA.',
    tags: ['brands', 'cummins', 'caterpillar', 'kohler']
  },
  {
    id: 'gen-4',
    category: 'Generators',
    question: 'Do you offer generator rental services?',
    answer: 'Yes! We offer short-term (daily/weekly) and long-term (monthly/yearly) generator rentals from 20kVA to 500kVA. Rentals include delivery, installation, fuel management, and 24/7 technical support. Perfect for events, construction sites, or backup during maintenance.',
    tags: ['rental', 'hire', 'temporary']
  },
  {
    id: 'gen-5',
    category: 'Generators',
    question: 'What is the difference between standby and prime rated generators?',
    answer: 'Standby rated generators are designed for emergency backup with limited running hours (typically 200-500 hours/year at varying loads). Prime rated generators can run continuously at varying loads for unlimited hours. Choose standby for backup power and prime for continuous or frequent use.',
    tags: ['standby', 'prime', 'rating', 'continuous']
  },
  {
    id: 'gen-6',
    category: 'Generators',
    question: 'How much fuel does a generator consume?',
    answer: 'Fuel consumption depends on generator size and load. As a rough guide: 20kVA uses 4-5 L/hr, 50kVA uses 10-12 L/hr, 100kVA uses 20-25 L/hr, 200kVA uses 40-50 L/hr at 75% load. Use our calculator for precise estimates based on your usage pattern.',
    tags: ['fuel', 'consumption', 'diesel', 'cost']
  },
  {
    id: 'gen-7',
    category: 'Generators',
    question: 'What causes a generator to fail to start?',
    answer: 'Common causes include: Low/dead battery, fuel problems (empty tank, contaminated fuel, air in lines), faulty starter motor, blocked fuel filter, low oil level triggering safety shutdown, or control panel issues. Our diagnostic suite can help identify the exact cause.',
    tags: ['troubleshooting', 'start', 'battery', 'fuel']
  },
  {
    id: 'gen-8',
    category: 'Generators',
    question: 'Do you provide emergency generator repair services?',
    answer: 'Yes! We offer 24/7 emergency response with <2 hour response time in Nairobi and <24 hours across all 47 Kenya counties. Call +254768860665 for immediate assistance.',
    tags: ['emergency', 'repair', '24/7', 'response']
  },

  // Solar FAQs
  {
    id: 'sol-1',
    category: 'Solar Energy',
    question: 'How much does a solar system cost in Kenya?',
    answer: 'Solar system costs vary by size: 3kW residential system (KES 350,000-450,000), 5kW home system (KES 550,000-700,000), 10kW commercial (KES 1.1M-1.4M), 50kW industrial (KES 5M-6.5M). Prices include panels, inverter, mounting, and installation. ROI is typically 3-4 years.',
    tags: ['cost', 'price', 'investment', 'roi']
  },
  {
    id: 'sol-2',
    category: 'Solar Energy',
    question: 'What solar panel brands do you install?',
    answer: 'We install Tier-1 panels including JA Solar, Longi, Canadian Solar, Jinko, and Trina. All panels come with 25-year performance warranty. We also integrate Tesla Powerwall and other premium battery storage solutions.',
    tags: ['panels', 'brands', 'warranty', 'tesla']
  },
  {
    id: 'sol-3',
    category: 'Solar Energy',
    question: 'Can I connect solar to KPLC grid (net metering)?',
    answer: 'Yes! Kenya allows net metering for solar installations. Excess power generated is exported to the grid and credited to your account. We handle the entire KPLC application and approval process. You can reduce your electricity bill by 50-80%.',
    tags: ['net metering', 'kplc', 'grid', 'export']
  },
  {
    id: 'sol-4',
    category: 'Solar Energy',
    question: 'How long do solar panels last?',
    answer: 'Quality solar panels last 25-30 years with minimal degradation (0.5% per year). Inverters typically last 10-15 years, batteries 5-10 years depending on type. We provide comprehensive warranties and maintenance packages.',
    tags: ['lifespan', 'warranty', 'durability']
  },
  {
    id: 'sol-5',
    category: 'Solar Energy',
    question: 'Do solar panels work during cloudy days or rainy season?',
    answer: 'Yes, solar panels work in cloudy conditions but at reduced efficiency (10-25% of peak output). Kenya\'s solar irradiance of 5.5-5.9 kWh/m²/day is excellent even during rainy seasons. Battery storage ensures power availability during low-production periods.',
    tags: ['cloudy', 'rain', 'efficiency', 'weather']
  },
  {
    id: 'sol-6',
    category: 'Solar Energy',
    question: 'What is the difference between on-grid and off-grid solar?',
    answer: 'On-grid (grid-tied) systems connect to KPLC, allowing net metering and no batteries needed. Off-grid systems are completely independent with battery storage. Hybrid systems combine both - grid connection with battery backup for outages.',
    tags: ['on-grid', 'off-grid', 'hybrid', 'battery']
  },

  // UPS FAQs
  {
    id: 'ups-1',
    category: 'UPS Systems',
    question: 'What size UPS do I need for my computer/server?',
    answer: 'For a single computer: 600VA-1kVA. Home office with multiple devices: 1.5-2kVA. Small server: 3-5kVA. Server room: 10-20kVA. Data center: 50-800kVA. We recommend 30% headroom above your calculated load.',
    tags: ['sizing', 'computer', 'server', 'data center']
  },
  {
    id: 'ups-2',
    category: 'UPS Systems',
    question: 'How long will a UPS provide backup power?',
    answer: 'Backup time depends on UPS capacity and connected load. A 1kVA UPS with 500W load provides ~15-20 minutes. For extended runtime, we can add external battery banks. For critical loads, we recommend UPS + generator combination.',
    tags: ['runtime', 'backup', 'battery', 'duration']
  },
  {
    id: 'ups-3',
    category: 'UPS Systems',
    question: 'What brands of UPS do you supply?',
    answer: 'We supply and service APC (Schneider Electric), Eaton, Vertiv (Liebert), Riello, and other premium brands. All UPS systems come with warranty and we provide battery replacement services.',
    tags: ['brands', 'apc', 'eaton', 'vertiv']
  },
  {
    id: 'ups-4',
    category: 'UPS Systems',
    question: 'How often should UPS batteries be replaced?',
    answer: 'Typical UPS batteries last 3-5 years depending on usage, temperature, and discharge cycles. We recommend annual battery testing and replacement when capacity drops below 80%. We offer battery replacement services for all major brands.',
    tags: ['battery', 'replacement', 'lifespan', 'testing']
  },

  // Service FAQs
  {
    id: 'srv-1',
    category: 'Services',
    question: 'What areas do you cover in Kenya?',
    answer: 'We serve all 47 counties in Kenya with headquarters in Nairobi. Response times: Nairobi <2 hours, Central Kenya <4 hours, other regions <24 hours. We also serve Uganda, Tanzania, Rwanda, and Somalia.',
    tags: ['coverage', 'counties', 'nairobi', 'east africa']
  },
  {
    id: 'srv-2',
    category: 'Services',
    question: 'Do you offer Annual Maintenance Contracts (AMC)?',
    answer: 'Yes! Our AMC packages include scheduled preventive maintenance, priority emergency response, discounted parts, 24/7 support hotline, and detailed service reports. AMC costs typically 3-5% of equipment value annually.',
    tags: ['amc', 'maintenance', 'contract', 'support']
  },
  {
    id: 'srv-3',
    category: 'Services',
    question: 'What payment methods do you accept?',
    answer: 'We accept M-Pesa, bank transfer, cheque, and cash. For large projects, we offer flexible payment terms including 30-60 day credit for established businesses, and equipment financing options.',
    tags: ['payment', 'mpesa', 'credit', 'financing']
  },
  {
    id: 'srv-4',
    category: 'Services',
    question: 'Do you provide installation services?',
    answer: 'Yes! All our equipment comes with professional installation by certified technicians. Installation includes site survey, civil/electrical preparation, equipment mounting, connection, testing, commissioning, and operator training.',
    tags: ['installation', 'setup', 'commissioning', 'training']
  },
  {
    id: 'srv-5',
    category: 'Services',
    question: 'What warranty do you provide?',
    answer: 'Warranty varies by product: Generators 1-2 years or 2000 hours, Solar panels 25 years performance warranty, Inverters 5-10 years, UPS systems 2-3 years. All warranties are manufacturer-backed through our authorized dealership.',
    tags: ['warranty', 'guarantee', 'coverage']
  },

  // Technical FAQs
  {
    id: 'tech-1',
    category: 'Technical',
    question: 'What is an Automatic Transfer Switch (ATS)?',
    answer: 'An ATS automatically switches your electrical load between mains power and generator. When KPLC fails, ATS signals the generator to start and transfers load within seconds. When mains returns, it transfers back and shuts down the generator. Essential for seamless backup power.',
    tags: ['ats', 'transfer switch', 'automatic', 'changeover']
  },
  {
    id: 'tech-2',
    category: 'Technical',
    question: 'What is synchronization in generators?',
    answer: 'Synchronization allows multiple generators to run in parallel, sharing load equally. Requires matching voltage, frequency, and phase angle. Essential for large installations needing more power than a single generator can provide, or for N+1 redundancy.',
    tags: ['synchronization', 'parallel', 'load sharing']
  },
  {
    id: 'tech-3',
    category: 'Technical',
    question: 'What does kVA mean and how is it different from kW?',
    answer: 'kVA (kilovolt-amperes) is apparent power, kW (kilowatts) is real power. They\'re related by power factor: kW = kVA × power factor. Generators are rated in kVA. For most loads, assume 0.8 power factor, so a 100kVA generator provides ~80kW of usable power.',
    tags: ['kva', 'kw', 'power factor', 'electrical']
  },
  {
    id: 'tech-4',
    category: 'Technical',
    question: 'What is load banking and why is it needed?',
    answer: 'Load banking tests a generator under controlled load conditions to verify performance, burn off wet stacking (carbon buildup from light loads), and ensure reliability. Recommended annually or after extended light-load operation. We provide mobile load bank testing services.',
    tags: ['load bank', 'testing', 'wet stacking', 'performance']
  },
  {
    id: 'tech-5',
    category: 'Technical',
    question: 'How do I read generator fault codes?',
    answer: 'Generator controllers display fault codes when issues occur. Our Diagnostic Suite contains 25+ fault codes for Cummins, CAT, Perkins, and other brands. Enter the code to get detailed causes, solutions, and step-by-step repair guides.',
    tags: ['fault codes', 'error', 'diagnostic', 'troubleshooting']
  },

  // Diagnostic FAQs
  {
    id: 'diag-1',
    category: 'Diagnostics',
    question: 'What is the EmersonEIMS Diagnostic Suite?',
    answer: 'Our free, industry-first diagnostic tool contains 25+ error codes for all major generator brands. Features include AI-powered symptom analysis, voice commands, offline capability, 47 language support, and step-by-step repair guides. No login required.',
    tags: ['diagnostic suite', 'error codes', 'ai', 'free']
  },
  {
    id: 'diag-2',
    category: 'Diagnostics',
    question: 'How do I use the AI diagnostic chat?',
    answer: 'Simply describe your generator problem in plain language, e.g., "My Cummins generator won\'t start and shows black smoke." Our AI analyzes symptoms, matches fault codes, and provides causes, solutions, and safety warnings with confidence scoring.',
    tags: ['ai', 'chat', 'natural language', 'diagnosis']
  },
  {
    id: 'diag-3',
    category: 'Diagnostics',
    question: 'Does the diagnostic tool work offline?',
    answer: 'Yes! Our diagnostic suite is a Progressive Web App (PWA) that works fully offline. Install it on your phone or tablet for field use without internet. All 25+ codes and solutions are cached locally.',
    tags: ['offline', 'pwa', 'mobile', 'field']
  },

  // Pricing FAQs
  {
    id: 'price-1',
    category: 'Pricing',
    question: 'How much does generator installation cost?',
    answer: 'Installation costs vary: Small generators (20-50kVA) KES 50,000-100,000, Medium (100-200kVA) KES 150,000-300,000, Large (300kVA+) KES 400,000+. Includes site preparation, mounting, fuel tank, ATS, cabling, testing, and commissioning.',
    tags: ['installation', 'cost', 'price']
  },
  {
    id: 'price-2',
    category: 'Pricing',
    question: 'What is the cost of generator servicing?',
    answer: 'Service costs: Basic service (oil, filters) KES 15,000-35,000, Full service KES 45,000-85,000, Major overhaul KES 150,000-500,000 depending on generator size. AMC packages offer 15-25% savings on service costs.',
    tags: ['service', 'maintenance', 'cost', 'amc']
  },
  {
    id: 'price-3',
    category: 'Pricing',
    question: 'Do you offer free site surveys?',
    answer: 'Yes! We provide free site surveys and consultations for projects within Nairobi. For upcountry locations, a nominal transport fee may apply, which is waived if you proceed with the project.',
    tags: ['site survey', 'consultation', 'free', 'quote']
  }
];

const CATEGORIES = ['All', 'Generators', 'Solar Energy', 'UPS Systems', 'Services', 'Technical', 'Diagnostics', 'Pricing'];

// Schema.org FAQ structured data
function generateFAQSchema(faqs: typeof FAQ_DATA) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter(faq => {
      const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
      const matchesSearch = searchQuery === '' || 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const expandAll = () => setExpandedIds(filteredFAQs.map(f => f.id));
  const collapseAll = () => setExpandedIds([]);

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQSchema(FAQ_DATA))
        }}
      />

      <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Frequently Asked Questions
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Find answers to common questions about generators, solar systems, UPS, and our services
              </p>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <input
                  type="text"
                  placeholder="Search FAQs... (e.g., 'generator sizing', 'solar cost', 'maintenance')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pl-14 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
                <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Category Filters */}
        <section className="py-8 border-y border-white/10">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-3">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    activeCategory === category
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ List */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-8">
              <p className="text-gray-400">
                Showing {filteredFAQs.length} of {FAQ_DATA.length} questions
                {searchQuery && <span className="text-blue-400"> for "{searchQuery}"</span>}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={expandAll}
                  className="px-4 py-2 text-sm bg-white/10 text-gray-300 rounded hover:bg-white/20"
                >
                  Expand All
                </button>
                <button
                  onClick={collapseAll}
                  className="px-4 py-2 text-sm bg-white/10 text-gray-300 rounded hover:bg-white/20"
                >
                  Collapse All
                </button>
              </div>
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
              <AnimatePresence>
                {filteredFAQs.map((faq, index) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-blue-500/30 transition-colors"
                  >
                    <button
                      onClick={() => toggleExpanded(faq.id)}
                      className="w-full px-6 py-5 flex items-start justify-between text-left"
                    >
                      <div className="flex-1 pr-4">
                        <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-full mb-2">
                          {faq.category}
                        </span>
                        <h3 className="text-lg font-semibold text-white">
                          {faq.question}
                        </h3>
                      </div>
                      <motion.span
                        animate={{ rotate: expandedIds.includes(faq.id) ? 180 : 0 }}
                        className="text-2xl text-blue-400 flex-shrink-0"
                      >
                        ▼
                      </motion.span>
                    </button>
                    
                    <AnimatePresence>
                      {expandedIds.includes(faq.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="px-6 pb-5 border-t border-white/10">
                            <p className="text-gray-300 leading-relaxed pt-4">
                              {faq.answer}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-4">
                              {faq.tags.map(tag => (
                                <button
                                  key={tag}
                                  onClick={() => setSearchQuery(tag)}
                                  className="px-3 py-1 text-xs bg-white/10 text-gray-400 rounded-full hover:bg-white/20 hover:text-white transition-colors"
                                >
                                  #{tag}
                                </button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* No Results */}
            {filteredFAQs.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-white mb-2">No FAQs Found</h3>
                <p className="text-gray-400 mb-6">
                  We couldn't find any questions matching "{searchQuery}"
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                  className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 border-t border-white/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Didn't Find Your Answer?
              </h2>
              <p className="text-gray-400 mb-8">
                Our team is ready to help with any questions about generators, solar, UPS, or services
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-blue-500 text-white font-bold rounded-full hover:bg-blue-600 transition-colors"
                >
                  Contact Us
                </Link>
                <Link
                  href="/diagnostic-suite"
                  className="px-8 py-4 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-colors"
                >
                  🔧 Try Diagnostic Suite
                </Link>
                <a
                  href="https://wa.me/254768860665"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-colors"
                >
                  💬 WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-16 bg-white/5">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Popular Resources
            </h2>
            <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <Link href="/calculators" className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-blue-500/50 transition-colors text-center group">
                <div className="text-4xl mb-3">🧮</div>
                <h3 className="font-semibold text-white group-hover:text-blue-400">Calculators</h3>
                <p className="text-sm text-gray-400">Sizing & ROI tools</p>
              </Link>
              <Link href="/diagnostic-suite" className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-blue-500/50 transition-colors text-center group">
                <div className="text-4xl mb-3">🔧</div>
                <h3 className="font-semibold text-white group-hover:text-blue-400">Diagnostics</h3>
                <p className="text-sm text-gray-400">25+ error codes</p>
              </Link>
              <Link href="/knowledge-base" className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-blue-500/50 transition-colors text-center group">
                <div className="text-4xl mb-3">📚</div>
                <h3 className="font-semibold text-white group-hover:text-blue-400">Knowledge Base</h3>
                <p className="text-sm text-gray-400">Technical guides</p>
              </Link>
              <Link href="/booking" className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-blue-500/50 transition-colors text-center group">
                <div className="text-4xl mb-3">📅</div>
                <h3 className="font-semibold text-white group-hover:text-blue-400">Book Service</h3>
                <p className="text-sm text-gray-400">Schedule online</p>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
