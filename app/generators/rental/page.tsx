'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Comprehensive Rental Fleet Data
const rentalFleet = [
  {
    category: 'Small Generators (5-20 kVA)',
    icon: '🔌',
    description: 'Perfect for small offices, shops, residential backup',
    units: [
      { model: '7.5 kVA Silent', brand: 'Kipor/Lister', fuel: 'Diesel', noise: '65 dB', weight: '180 kg', dimensions: '1.2m x 0.6m x 0.8m' },
      { model: '10 kVA Silent', brand: 'Perkins/FG Wilson', fuel: 'Diesel', noise: '68 dB', weight: '250 kg', dimensions: '1.4m x 0.7m x 0.9m' },
      { model: '15 kVA Silent', brand: 'Cummins/Perkins', fuel: 'Diesel', noise: '70 dB', weight: '380 kg', dimensions: '1.6m x 0.8m x 1.0m' },
      { model: '20 kVA Silent', brand: 'Perkins/FG Wilson', fuel: 'Diesel', noise: '72 dB', weight: '520 kg', dimensions: '1.8m x 0.9m x 1.1m' },
    ],
    applications: ['Home backup', 'Small retail shops', 'Mobile food vendors', 'Outdoor events (small)', 'Construction site offices', 'Temporary clinics'],
    rentalTerms: {
      daily: 'KSh 5,000 - 15,000',
      weekly: 'KSh 25,000 - 75,000',
      monthly: 'KSh 80,000 - 250,000',
      deposit: '1 month rent or 30% of equipment value',
    },
  },
  {
    category: 'Medium Generators (25-100 kVA)',
    icon: '⚡',
    description: 'Ideal for medium businesses, events, construction sites',
    units: [
      { model: '30 kVA Silent', brand: 'Cummins/Perkins', fuel: 'Diesel', noise: '72 dB', weight: '850 kg', dimensions: '2.2m x 0.9m x 1.3m' },
      { model: '50 kVA Silent', brand: 'Cummins/Caterpillar', fuel: 'Diesel', noise: '75 dB', weight: '1,200 kg', dimensions: '2.5m x 1.0m x 1.4m' },
      { model: '60 kVA Silent', brand: 'Perkins/FG Wilson', fuel: 'Diesel', noise: '75 dB', weight: '1,400 kg', dimensions: '2.7m x 1.1m x 1.5m' },
      { model: '80 kVA Silent', brand: 'Cummins/Caterpillar', fuel: 'Diesel', noise: '76 dB', weight: '1,800 kg', dimensions: '3.0m x 1.2m x 1.6m' },
      { model: '100 kVA Silent', brand: 'Cummins/Perkins', fuel: 'Diesel', noise: '77 dB', weight: '2,200 kg', dimensions: '3.2m x 1.3m x 1.7m' },
    ],
    applications: ['Wedding venues', 'Corporate events', 'Medium factories', 'Shopping centers backup', 'Hotels', 'Schools', 'Construction projects'],
    rentalTerms: {
      daily: 'KSh 15,000 - 40,000',
      weekly: 'KSh 75,000 - 200,000',
      monthly: 'KSh 250,000 - 650,000',
      deposit: '1 month rent or 30% of equipment value',
    },
  },
  {
    category: 'Large Generators (150-500 kVA)',
    icon: '🏭',
    description: 'For large events, industrial applications, major construction',
    units: [
      { model: '150 kVA Silent', brand: 'Cummins/Caterpillar', fuel: 'Diesel', noise: '78 dB', weight: '3,200 kg', dimensions: '3.8m x 1.4m x 2.0m' },
      { model: '200 kVA Silent', brand: 'Cummins/MTU', fuel: 'Diesel', noise: '78 dB', weight: '4,000 kg', dimensions: '4.2m x 1.5m x 2.1m' },
      { model: '250 kVA Silent', brand: 'Caterpillar/Cummins', fuel: 'Diesel', noise: '79 dB', weight: '4,800 kg', dimensions: '4.5m x 1.6m x 2.2m' },
      { model: '350 kVA Silent', brand: 'Cummins/MTU', fuel: 'Diesel', noise: '80 dB', weight: '5,500 kg', dimensions: '5.0m x 1.8m x 2.3m' },
      { model: '500 kVA Silent', brand: 'Caterpillar/Cummins', fuel: 'Diesel', noise: '82 dB', weight: '7,000 kg', dimensions: '6.0m x 2.0m x 2.5m' },
    ],
    applications: ['Large concerts', 'Film production', 'Major construction', 'Mining operations', 'Industrial backup', 'Hospital emergencies', 'Data centers'],
    rentalTerms: {
      daily: 'KSh 40,000 - 120,000',
      weekly: 'KSh 200,000 - 600,000',
      monthly: 'KSh 650,000 - 2,000,000',
      deposit: '1 month rent or 30% of equipment value',
    },
  },
  {
    category: 'Extra Large Generators (600+ kVA)',
    icon: '🏗️',
    description: 'For mega events, large industrial projects, utility backup',
    units: [
      { model: '750 kVA Silent', brand: 'Cummins/MTU', fuel: 'Diesel', noise: '83 dB', weight: '9,500 kg', dimensions: '6.5m x 2.2m x 2.6m' },
      { model: '1000 kVA (1 MVA)', brand: 'Caterpillar/Cummins', fuel: 'Diesel', noise: '85 dB', weight: '12,000 kg', dimensions: '7.5m x 2.4m x 2.8m' },
      { model: '1250 kVA', brand: 'MTU/Cummins', fuel: 'Diesel', noise: '85 dB', weight: '15,000 kg', dimensions: '9.0m x 2.5m x 3.0m' },
      { model: '1500 kVA', brand: 'Caterpillar/MTU', fuel: 'Diesel', noise: '86 dB', weight: '18,000 kg', dimensions: '10.0m x 2.6m x 3.0m' },
      { model: '2000 kVA (2 MVA)', brand: 'Cummins/MTU', fuel: 'Diesel', noise: '88 dB', weight: '22,000 kg', dimensions: '12.0m x 2.8m x 3.2m' },
    ],
    applications: ['Stadium events', 'Political rallies', 'Major industrial plants', 'Grid backup', 'Mining operations', 'Oil & gas', 'Mega concerts'],
    rentalTerms: {
      daily: 'KSh 120,000 - 400,000',
      weekly: 'KSh 600,000 - 2,000,000',
      monthly: 'KSh 2,000,000 - 6,000,000',
      deposit: '1 month rent or 30% of equipment value',
    },
  },
];

const deliveryAreas = [
  {
    region: 'Nairobi Metropolitan',
    counties: ['Nairobi', 'Kiambu', 'Machakos', 'Kajiado'],
    deliveryTime: 'Same day / 2-4 hours',
    deliveryCost: 'Free for rentals over 7 days',
    icon: '🏙️',
  },
  {
    region: 'Central Kenya',
    counties: ['Nyeri', 'Kirinyaga', 'Murang\'a', 'Nyandarua', 'Laikipia'],
    deliveryTime: '4-8 hours',
    deliveryCost: 'KSh 15,000 - 30,000',
    icon: '🏔️',
  },
  {
    region: 'Rift Valley',
    counties: ['Nakuru', 'Narok', 'Kericho', 'Bomet', 'Baringo', 'Uasin Gishu', 'Nandi', 'Trans Nzoia', 'Elgeyo-Marakwet', 'West Pokot'],
    deliveryTime: '6-12 hours',
    deliveryCost: 'KSh 25,000 - 50,000',
    icon: '🌄',
  },
  {
    region: 'Western Kenya',
    counties: ['Kisumu', 'Siaya', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira', 'Kakamega', 'Vihiga', 'Bungoma', 'Busia'],
    deliveryTime: '8-14 hours',
    deliveryCost: 'KSh 35,000 - 60,000',
    icon: '🌅',
  },
  {
    region: 'Coast Region',
    counties: ['Mombasa', 'Kilifi', 'Kwale', 'Taita-Taveta', 'Tana River', 'Lamu'],
    deliveryTime: '12-18 hours',
    deliveryCost: 'KSh 45,000 - 80,000',
    icon: '🏖️',
  },
  {
    region: 'Eastern Kenya',
    counties: ['Meru', 'Tharaka-Nithi', 'Embu', 'Kitui', 'Makueni', 'Marsabit', 'Isiolo'],
    deliveryTime: '8-16 hours',
    deliveryCost: 'KSh 30,000 - 60,000',
    icon: '🌵',
  },
  {
    region: 'Northern Kenya',
    counties: ['Turkana', 'Samburu', 'Wajir', 'Mandera', 'Garissa'],
    deliveryTime: '18-36 hours',
    deliveryCost: 'KSh 60,000 - 120,000',
    icon: '🏜️',
  },
];

const rentalInclusions = [
  {
    title: 'Equipment',
    icon: '🔧',
    included: [
      'Generator unit (silenced canopy)',
      'Fuel tank (8-24 hour capacity)',
      'Distribution board with MCBs',
      'Emergency stop button',
      'Hour meter and fuel gauge',
      'Earth rod and cable',
    ],
  },
  {
    title: 'Delivery Services',
    icon: '🚚',
    included: [
      'Transportation to site',
      'Offloading with crane/forklift',
      'Positioning and leveling',
      'Initial fuel fill (first tank)',
      'Basic electrical connection',
      'Return collection',
    ],
  },
  {
    title: 'Technical Support',
    icon: '👨‍🔧',
    included: [
      'Commissioning and start-up',
      'Operator briefing',
      '24/7 phone support',
      'Emergency breakdown response',
      'Fuel delivery arrangement',
      'Load monitoring advice',
    ],
  },
  {
    title: 'Documentation',
    icon: '📋',
    included: [
      'Equipment inspection checklist',
      'Rental agreement and terms',
      'Operating manual',
      'Emergency contact numbers',
      'Daily log sheet',
      'Handover certificate',
    ],
  },
];

const rentalFAQs = [
  {
    question: 'What size generator do I need?',
    answer: 'Generator sizing depends on your total load. As a rule of thumb: add up all your equipment wattages, multiply by 1.25 for safety margin. Our team can do a free load assessment. Common examples: Average home (5-10 kVA), Small office (15-20 kVA), Wedding venue (50-100 kVA), Factory (100-500 kVA).',
  },
  {
    question: 'What is included in the rental price?',
    answer: 'Our rental includes: generator with silenced canopy, fuel tank, distribution board, delivery and setup within Nairobi (other areas charged extra), commissioning, 24/7 technical support, and collection. Fuel is typically the customer\'s responsibility, but we can arrange fuel delivery.',
  },
  {
    question: 'What are your payment terms?',
    answer: 'We require: rental period payment in advance, plus a refundable security deposit (1 month rent or 30% of equipment value). We accept cash, bank transfer, M-Pesa, and cheques (cleared before delivery). For long-term rentals, monthly invoicing may be arranged for established clients.',
  },
  {
    question: 'How quickly can you deliver?',
    answer: 'Within Nairobi: Same day delivery for orders placed before 12pm. Outside Nairobi: 24-48 hours depending on location. For urgent requirements, call our emergency line - we maintain a rapid response fleet.',
  },
  {
    question: 'What happens if the generator breaks down?',
    answer: 'We provide 24/7 breakdown support. Within Nairobi, a technician will arrive within 2-4 hours. For critical applications, we can position a standby unit on site. If repair takes longer than 4 hours, we\'ll replace the unit at no extra cost.',
  },
  {
    question: 'Who is responsible for fuel?',
    answer: 'The customer is responsible for fuel during the rental period. We deliver with the first tank full (approximately 8-24 hours of running depending on load). We can arrange regular fuel delivery at competitive rates, or you can arrange your own supply.',
  },
  {
    question: 'What if I damage the generator?',
    answer: 'Normal wear and tear is expected and covered. Damage due to negligence, overloading, using wrong fuel, or vandalism is the customer\'s responsibility. We recommend adding the generator to your insurance, or we can provide coverage (additional cost).',
  },
  {
    question: 'Can I extend my rental period?',
    answer: 'Yes, extensions are usually possible subject to availability. Please notify us at least 48 hours before your rental ends. Long-term rentals (3+ months) qualify for discounted rates. We also offer rent-to-own options.',
  },
];

const eventTypes = [
  {
    type: 'Weddings & Social Events',
    icon: '💒',
    requirements: ['Lighting systems', 'PA and music', 'Catering equipment', 'Air conditioning (tents)', 'Photography'],
    recommended: '30-100 kVA depending on guest count',
    tips: ['Book 2 weeks in advance', 'Consider backup unit for peace of mind', 'We provide silent units to not disturb ceremony'],
  },
  {
    type: 'Corporate Events',
    icon: '🏢',
    requirements: ['Stage lighting', 'AV equipment', 'Climate control', 'Catering', 'IT equipment'],
    recommended: '50-200 kVA depending on venue size',
    tips: ['We can provide multiple units for redundancy', 'Load distribution prevents single point failure', 'Professional setup team available'],
  },
  {
    type: 'Concerts & Festivals',
    icon: '🎵',
    requirements: ['High-power PA systems', 'Stage lighting rigs', 'LED screens', 'Vendor power', 'VIP areas'],
    recommended: '200 kVA - 2 MVA or more',
    tips: ['Book 1 month in advance for large events', 'Multiple synchronized units available', 'On-site technician included'],
  },
  {
    type: 'Film & TV Production',
    icon: '🎬',
    requirements: ['Lighting (very high power)', 'Cameras and equipment', 'Base camp facilities', 'Catering', 'AC for talent'],
    recommended: '100-500 kVA depending on production scale',
    tips: ['Ultra-quiet units available for sound recording', 'Power distribution boards included', 'Flexible positioning on set'],
  },
  {
    type: 'Construction Sites',
    icon: '🏗️',
    requirements: ['Power tools', 'Welding machines', 'Tower cranes', 'Site offices', 'Lighting'],
    recommended: '50-500 kVA depending on project',
    tips: ['Long-term rates available', 'Robust units for tough environments', 'Weekly fuel delivery available'],
  },
  {
    type: 'Emergency Backup',
    icon: '🏥',
    requirements: ['Hospital equipment', 'Data centers', 'Manufacturing continuity', 'Cold storage'],
    recommended: 'Matched to your existing load',
    tips: ['Rapid deployment available', 'ATS/synchronization possible', '24/7 monitoring available'],
  },
];

function FleetCard({ fleet, isExpanded, onToggle }: { fleet: typeof rentalFleet[0]; isExpanded: boolean; onToggle: () => void }) {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/10 overflow-hidden">
      <button 
        onClick={onToggle}
        className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-all duration-300"
      >
        <div className="flex items-center gap-4">
          <div className="text-4xl">{fleet.icon}</div>
          <div className="text-left">
            <h3 className="text-xl font-bold text-white">{fleet.category}</h3>
            <p className="text-blue-400 text-sm">{fleet.description}</p>
          </div>
        </div>
        <div className={`text-2xl text-white/60 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/10"
          >
            <div className="p-6 space-y-6">
              {/* Units Table */}
              <div>
                <h4 className="text-green-400 font-bold mb-3">Available Units:</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-white/60 border-b border-white/10">
                        <th className="text-left py-2 px-2">Model</th>
                        <th className="text-left py-2 px-2">Brand</th>
                        <th className="text-left py-2 px-2">Noise</th>
                        <th className="text-left py-2 px-2">Weight</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fleet.units.map((unit, idx) => (
                        <tr key={idx} className="border-b border-white/5 text-white/80">
                          <td className="py-2 px-2 font-medium text-yellow-300">{unit.model}</td>
                          <td className="py-2 px-2">{unit.brand}</td>
                          <td className="py-2 px-2">{unit.noise}</td>
                          <td className="py-2 px-2">{unit.weight}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Applications */}
              <div className="bg-white/5 rounded-xl p-4">
                <h4 className="text-blue-400 font-bold mb-3">Best For:</h4>
                <div className="flex flex-wrap gap-2">
                  {fleet.applications.map((app, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                      {app}
                    </span>
                  ))}
                </div>
              </div>

              {/* Rental Rates */}
              <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-xl p-4">
                <h4 className="text-green-400 font-bold mb-3">💰 Rental Rates:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-white/60 text-xs uppercase">Daily</div>
                    <div className="text-white font-bold">{fleet.rentalTerms.daily}</div>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs uppercase">Weekly</div>
                    <div className="text-white font-bold">{fleet.rentalTerms.weekly}</div>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs uppercase">Monthly</div>
                    <div className="text-white font-bold">{fleet.rentalTerms.monthly}</div>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs uppercase">Deposit</div>
                    <div className="text-yellow-300 text-sm">{fleet.rentalTerms.deposit}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function GeneratorRentalPage() {
  const [expandedFleet, setExpandedFleet] = useState<string | null>('Medium Generators (25-100 kVA)');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-blue-500/20 rounded-full text-blue-400 text-sm font-medium">
              Flexible Generator Rental Solutions
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-300 via-white to-purple-300 bg-clip-text text-transparent">
              Generator Rental Kenya
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              From 7.5 kVA to 2 MVA. Daily, weekly, or monthly rentals. 
              Delivered anywhere in Kenya with 24/7 support.
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { value: '50+', label: 'Units in Fleet', icon: '🔋' },
              { value: '47', label: 'Counties Covered', icon: '📍' },
              { value: '2-4 hrs', label: 'Nairobi Delivery', icon: '🚚' },
              { value: '24/7', label: 'Support Available', icon: '📞' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white/5 rounded-xl p-6 text-center border border-white/10">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-blue-400">{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet Section */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Rental Fleet
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Browse our range of generators available for rent. Click each category to see available units and pricing.
            </p>
          </div>
          
          <div className="space-y-4">
            {rentalFleet.map((fleet) => (
              <FleetCard
                key={fleet.category}
                fleet={fleet}
                isExpanded={expandedFleet === fleet.category}
                onToggle={() => setExpandedFleet(expandedFleet === fleet.category ? null : fleet.category)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Event Types */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Rental for Every Occasion
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              We've powered thousands of events across Kenya. Here's our expertise:
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventTypes.map((event, idx) => (
              <div key={idx} className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all">
                <div className="text-4xl mb-4">{event.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{event.type}</h3>
                
                <div className="mb-4">
                  <div className="text-blue-400 text-sm font-medium mb-2">Power Requirements:</div>
                  <ul className="space-y-1">
                    {event.requirements.map((req, reqIdx) => (
                      <li key={reqIdx} className="text-white/70 text-sm flex items-center gap-2">
                        <span className="text-blue-400">•</span> {req}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-4">
                  <div className="text-green-400 text-sm font-medium">Recommended Size:</div>
                  <div className="text-white font-bold">{event.recommended}</div>
                </div>
                
                <div className="bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/20">
                  <div className="text-yellow-400 text-sm font-medium mb-1">💡 Pro Tips:</div>
                  <ul className="space-y-1">
                    {event.tips.map((tip, tipIdx) => (
                      <li key={tipIdx} className="text-white/70 text-xs">• {tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Coverage */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Delivery Coverage - All 47 Counties
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              We deliver generators anywhere in Kenya. Here are our delivery zones and timelines:
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {deliveryAreas.map((area, idx) => (
              <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{area.icon}</span>
                  <h3 className="text-lg font-bold text-white">{area.region}</h3>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-white/60">Counties: </span>
                    <span className="text-white/80">{area.counties.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-white/60">Delivery Time: </span>
                    <span className="text-green-400 font-medium">{area.deliveryTime}</span>
                  </div>
                  <div>
                    <span className="text-white/60">Transport Cost: </span>
                    <span className="text-yellow-400 font-medium">{area.deliveryCost}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What's Included in Your Rental
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rentalInclusions.map((inc, idx) => (
              <div key={idx} className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="text-3xl mb-4">{inc.icon}</div>
                <h3 className="text-lg font-bold text-white mb-4">{inc.title}</h3>
                <ul className="space-y-2">
                  {inc.included.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2 text-white/70 text-sm">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="space-y-4">
            {rentalFAQs.map((faq, idx) => (
              <div key={idx} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                  className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-all"
                >
                  <span className="font-bold text-white text-left">{faq.question}</span>
                  <span className={`text-xl text-white/60 transition-transform ${expandedFAQ === idx ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                <AnimatePresence>
                  {expandedFAQ === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/10"
                    >
                      <div className="p-4 text-white/70">{faq.answer}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Need a Generator? Call Now!
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Get a quote within minutes. Same-day delivery available in Nairobi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:0768860665"
              className="px-8 py-4 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold rounded-xl hover:from-blue-500 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg shadow-blue-500/30"
            >
              📞 Call: 0768 860 655
            </a>
            <a
              href="tel:0782914717"
              className="px-8 py-4 bg-gradient-to-r from-purple-400 to-purple-600 text-white font-bold rounded-xl hover:from-purple-500 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg shadow-purple-500/30"
            >
              📞 Call: 0782914717
            </a>
          </div>
          <p className="mt-6 text-white/60">
            WhatsApp available on both numbers • 24/7 for emergencies
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/generators" className="text-blue-400 hover:text-blue-300 underline">
              Buy a Generator →
            </Link>
            <Link href="/generators/installation" className="text-green-400 hover:text-green-300 underline">
              Installation Services →
            </Link>
            <Link href="/generators/maintenance" className="text-yellow-400 hover:text-yellow-300 underline">
              Maintenance Services →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Navigation */}
      <section className="py-10 bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/generators" className="text-white/60 hover:text-blue-400 transition">Generators</Link>
            <Link href="/generators/installation" className="text-white/60 hover:text-blue-400 transition">Installation</Link>
            <Link href="/generators/maintenance" className="text-white/60 hover:text-blue-400 transition">Maintenance</Link>
            <Link href="/generators/spare-parts" className="text-white/60 hover:text-blue-400 transition">Spare Parts</Link>
            <Link href="/generators/used" className="text-white/60 hover:text-blue-400 transition">Used Generators</Link>
            <Link href="/solar" className="text-white/60 hover:text-blue-400 transition">Solar Solutions</Link>
            <Link href="/contact" className="text-white/60 hover:text-blue-400 transition">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
