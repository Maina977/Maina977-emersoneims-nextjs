'use client';

/**
 * General Services Maintenance Hub
 * Borehole pumps, motor rewinding, AC, electrical services
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { AnalogClock, AnalogCalendar, WeatherWidget } from '@/components/ui/AnalogWidgets';

// Service Categories
const SERVICE_CATEGORIES = [
  {
    id: 'borehole',
    name: 'Borehole Pumps',
    icon: '💧',
    description: 'Complete borehole pump installation, maintenance, and repair services. Submersible and surface pump specialists.',
    services: [
      {
        name: 'Pump Installation',
        description: 'Professional installation of submersible and surface pumps with proper sizing and configuration.',
        price: 'From KES 25,000',
        duration: '1-2 days'
      },
      {
        name: 'Pump Repair & Overhaul',
        description: 'Complete pump motor rewinding, impeller replacement, mechanical seal repair, and bearing replacement.',
        price: 'From KES 15,000',
        duration: '2-5 days'
      },
      {
        name: 'Borehole Rehabilitation',
        description: 'Well cleaning, development, and yield testing. Restore reduced water output to original capacity.',
        price: 'From KES 50,000',
        duration: '3-5 days'
      },
      {
        name: 'Control Panel Service',
        description: 'VFD repair, starter replacement, level sensor calibration, and automation upgrades.',
        price: 'From KES 10,000',
        duration: '1 day'
      }
    ],
    faults: [
      { code: 'BH-001', name: 'No Water Output', severity: 'critical', solution: 'Check pump motor, impeller, and water level' },
      { code: 'BH-002', name: 'Low Pressure', severity: 'warning', solution: 'Inspect pressure tank, check for leaks, verify pump sizing' },
      { code: 'BH-003', name: 'Pump Cycling', severity: 'warning', solution: 'Check pressure switch, inspect check valve, test pressure tank' },
      { code: 'BH-004', name: 'Motor Overheating', severity: 'critical', solution: 'Verify voltage, check cooling, inspect bearings' },
      { code: 'BH-005', name: 'Sand in Water', severity: 'warning', solution: 'Lower pump, install sand screen, check casing' },
    ]
  },
  {
    id: 'motor',
    name: 'Motor Rewinding',
    icon: '⚡',
    description: 'Professional electric motor rewinding and repair for all motor types. Single-phase, three-phase, and DC motors.',
    services: [
      {
        name: 'AC Motor Rewinding',
        description: 'Complete stator rewinding for single-phase and three-phase induction motors. Class F insulation standard.',
        price: 'From KES 5,000',
        duration: '2-5 days'
      },
      {
        name: 'DC Motor Repair',
        description: 'Armature rewinding, brush replacement, commutator resurfacing, and field coil repair.',
        price: 'From KES 8,000',
        duration: '3-7 days'
      },
      {
        name: 'Bearing Replacement',
        description: 'Motor bearing replacement with quality SKF or FAG bearings. Includes shaft inspection.',
        price: 'From KES 2,500',
        duration: '1 day'
      },
      {
        name: 'VFD Installation',
        description: 'Variable frequency drive installation and programming for motor speed control and energy savings.',
        price: 'From KES 15,000',
        duration: '1-2 days'
      }
    ],
    faults: [
      { code: 'MT-001', name: 'Motor Not Starting', severity: 'critical', solution: 'Check power supply, test capacitor, verify winding continuity' },
      { code: 'MT-002', name: 'Excessive Vibration', severity: 'warning', solution: 'Balance rotor, check bearings, verify alignment' },
      { code: 'MT-003', name: 'Overheating', severity: 'critical', solution: 'Check ventilation, verify load, test insulation' },
      { code: 'MT-004', name: 'Low Speed/Torque', severity: 'warning', solution: 'Check voltage, test capacitor, inspect windings' },
      { code: 'MT-005', name: 'Noisy Operation', severity: 'warning', solution: 'Replace bearings, check coupling, inspect fan' },
    ]
  },
  {
    id: 'ac',
    name: 'AC & Refrigeration',
    icon: '❄️',
    description: 'Air conditioning installation, maintenance, and repair. Split systems, central AC, and cold rooms.',
    services: [
      {
        name: 'AC Installation',
        description: 'Professional installation of split AC units, cassette systems, and ducted air conditioning.',
        price: 'From KES 8,000',
        duration: '1 day'
      },
      {
        name: 'AC Servicing',
        description: 'Complete AC service including filter cleaning, coil cleaning, gas check, and performance optimization.',
        price: 'From KES 3,500',
        duration: '2-3 hours'
      },
      {
        name: 'Gas Refill',
        description: 'Refrigerant recharge with R410A, R32, or R22 (for old systems). Leak testing included.',
        price: 'From KES 5,000',
        duration: '1-2 hours'
      },
      {
        name: 'Cold Room Maintenance',
        description: 'Commercial refrigeration service, compressor repair, and temperature control optimization.',
        price: 'From KES 15,000',
        duration: '4-8 hours'
      }
    ],
    faults: [
      { code: 'AC-001', name: 'Not Cooling', severity: 'critical', solution: 'Check refrigerant level, clean filters, verify compressor' },
      { code: 'AC-002', name: 'Water Leaking', severity: 'warning', solution: 'Clear drain line, check condensate pump, level unit' },
      { code: 'AC-003', name: 'Noisy Operation', severity: 'warning', solution: 'Check fan motor, inspect compressor, tighten mounts' },
      { code: 'AC-004', name: 'High Power Bill', severity: 'warning', solution: 'Clean coils, check insulation, verify sizing' },
      { code: 'AC-005', name: 'Bad Odor', severity: 'warning', solution: 'Clean evaporator, sanitize drain pan, replace filter' },
    ]
  },
  {
    id: 'electrical',
    name: 'Electrical Services',
    icon: '🔌',
    description: 'Industrial and commercial electrical services. Panel installation, wiring, and power factor correction.',
    services: [
      {
        name: 'Panel Installation',
        description: 'Distribution board installation, changeover systems, and automatic transfer switches.',
        price: 'From KES 20,000',
        duration: '1-3 days'
      },
      {
        name: 'Power Factor Correction',
        description: 'Capacitor bank installation to improve power factor and reduce electricity bills.',
        price: 'From KES 50,000',
        duration: '2-3 days'
      },
      {
        name: 'Industrial Wiring',
        description: 'Factory wiring, machine connections, and control panel wiring.',
        price: 'Based on scope',
        duration: 'Varies'
      },
      {
        name: 'Earthing Systems',
        description: 'Professional earthing installation and testing. Lightning protection systems.',
        price: 'From KES 25,000',
        duration: '2-3 days'
      }
    ],
    faults: [
      { code: 'EL-001', name: 'Tripping Breaker', severity: 'critical', solution: 'Identify overload, check for short circuits, test breaker' },
      { code: 'EL-002', name: 'Voltage Fluctuation', severity: 'warning', solution: 'Check neutral, inspect connections, install stabilizer' },
      { code: 'EL-003', name: 'High Bills', severity: 'warning', solution: 'Audit loads, check power factor, identify energy waste' },
      { code: 'EL-004', name: 'Earth Fault', severity: 'critical', solution: 'Test earth continuity, check insulation, identify fault' },
      { code: 'EL-005', name: 'Phase Imbalance', severity: 'warning', solution: 'Redistribute loads, check connections, verify supply' },
    ]
  },
  {
    id: 'welding',
    name: 'Welding & Fabrication',
    icon: '🔥',
    description: 'Professional welding services. Structural steel, piping, and custom fabrication.',
    services: [
      {
        name: 'Structural Welding',
        description: 'Steel structure fabrication, building frames, and industrial platforms.',
        price: 'Based on scope',
        duration: 'Varies'
      },
      {
        name: 'Pipe Welding',
        description: 'Pipeline welding for water, steam, and fuel systems. Pressure testing included.',
        price: 'From KES 500/joint',
        duration: 'Varies'
      },
      {
        name: 'Tank Fabrication',
        description: 'Custom water tanks, fuel tanks, and storage vessels. All sizes available.',
        price: 'Based on size',
        duration: '3-14 days'
      },
      {
        name: 'Gate & Grille Work',
        description: 'Security gates, window grilles, and decorative metalwork.',
        price: 'From KES 15,000',
        duration: '2-5 days'
      }
    ],
    faults: []
  },
  {
    id: 'plumbing',
    name: 'Plumbing Services',
    icon: '🚿',
    description: 'Commercial and industrial plumbing. Water supply, drainage, and pressure systems.',
    services: [
      {
        name: 'Pressure Boosting',
        description: 'Booster pump installation for multi-story buildings. Automatic pressure systems.',
        price: 'From KES 35,000',
        duration: '1-2 days'
      },
      {
        name: 'Pipeline Installation',
        description: 'Water and waste pipeline installation. PPR, HDPE, and GI pipe systems.',
        price: 'Based on scope',
        duration: 'Varies'
      },
      {
        name: 'Drainage Systems',
        description: 'Septic tank installation, drainage field design, and sewer connections.',
        price: 'From KES 50,000',
        duration: '3-7 days'
      },
      {
        name: 'Water Treatment',
        description: 'Water filtration, softening, and purification systems for homes and businesses.',
        price: 'From KES 25,000',
        duration: '1-2 days'
      }
    ],
    faults: [
      { code: 'PL-001', name: 'Low Pressure', severity: 'warning', solution: 'Check pump, inspect for leaks, verify pipe sizing' },
      { code: 'PL-002', name: 'No Water', severity: 'critical', solution: 'Check supply, inspect pump, test valves' },
      { code: 'PL-003', name: 'Blocked Drain', severity: 'warning', solution: 'Clear blockage, inspect pipe condition, check vents' },
      { code: 'PL-004', name: 'Water Hammer', severity: 'warning', solution: 'Install arrestor, check valves, secure pipes' },
    ]
  }
];

// Maintenance Tips
const MAINTENANCE_TIPS = [
  { category: 'borehole', tip: 'Run your borehole pump at least once a week even during rainy season to prevent seizing.' },
  { category: 'motor', tip: 'Keep motor ventilation clear. A 10°C temperature rise reduces insulation life by 50%.' },
  { category: 'ac', tip: 'Clean AC filters every 2 weeks during heavy use. Dirty filters increase power consumption by 15%.' },
  { category: 'electrical', tip: 'Label all circuit breakers clearly. This saves critical time during emergencies.' },
  { category: 'plumbing', tip: 'Check pressure tank air charge quarterly. Proper pre-charge extends pump life significantly.' },
];

export default function GeneralMaintenanceHub() {
  const [selectedCategory, setSelectedCategory] = useState(SERVICE_CATEGORIES[0]);
  const [selectedLocation, setSelectedLocation] = useState('nairobi');
  const [activeTab, setActiveTab] = useState<'services' | 'faults' | 'tips'>('services');

  const currentTip = MAINTENANCE_TIPS.find(t => t.category === selectedCategory.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header with Widgets */}
      <header className="bg-slate-900/80 border-b border-slate-700 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-amber-500 hover:text-amber-400 transition-colors">
                ← Home
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  🔧 General Services Hub
                </h1>
                <p className="text-slate-400 text-sm">Pumps, Motors, AC, Electrical & More</p>
              </div>
            </div>

            {/* Widgets */}
            <div className="hidden lg:flex items-center gap-3">
              <AnalogClock size={60} />
              <AnalogCalendar />
              <WeatherWidget location={selectedLocation} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Category Selector */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {SERVICE_CATEGORIES.map(category => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category)}
              className={`p-4 rounded-xl border transition-all text-left ${
                selectedCategory.id === category.id
                  ? 'bg-green-500/20 border-green-500 text-white'
                  : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-2xl mb-2">{category.icon}</div>
              <div className="font-medium text-sm">{category.name}</div>
            </motion.button>
          ))}
        </div>

        {/* Category Header */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="text-5xl">{selectedCategory.icon}</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">{selectedCategory.name}</h2>
              <p className="text-slate-400">{selectedCategory.description}</p>
            </div>
          </div>

          {/* Pro Tip */}
          {currentTip && (
            <div className="mt-4 bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <span className="text-amber-400">💡</span>
                <div>
                  <span className="text-amber-400 font-medium">Pro Tip: </span>
                  <span className="text-slate-300">{currentTip.tip}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'services'
                ? 'bg-green-500 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            📋 Services & Pricing
          </button>
          {selectedCategory.faults.length > 0 && (
            <button
              onClick={() => setActiveTab('faults')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'faults'
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              ⚠️ Common Problems
            </button>
          )}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'services' && (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 gap-4"
            >
              {selectedCategory.services.map((service, i) => (
                <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-green-500/50 transition-colors">
                  <h3 className="text-lg font-bold text-white mb-2">{service.name}</h3>
                  <p className="text-slate-400 text-sm mb-4">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-green-400 font-bold">{service.price}</span>
                      <span className="text-slate-500 text-sm ml-2">• {service.duration}</span>
                    </div>
                    <a
                      href="tel:+254782914717"
                      className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-1 rounded-lg text-sm transition-colors"
                    >
                      Get Quote
                    </a>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'faults' && (
            <motion.div
              key="faults"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {selectedCategory.faults.map((fault, i) => (
                <div key={i} className={`bg-slate-800/50 border rounded-xl p-4 ${
                  fault.severity === 'critical' ? 'border-red-500/50' : 'border-yellow-500/50'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className={`px-2 py-1 rounded text-xs font-mono ${
                      fault.severity === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {fault.code}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white">{fault.name}</h4>
                      <p className="text-slate-400 text-sm mt-1">
                        <span className="text-green-400">Solution: </span>
                        {fault.solution}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      fault.severity === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {fault.severity}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <Link href="/generator-oracle" className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 hover:from-blue-500 hover:to-blue-600 transition-all">
            <div className="text-2xl mb-2">🔌</div>
            <div className="font-bold text-white">Generator Oracle</div>
            <div className="text-blue-200 text-sm">230,000+ fault codes</div>
          </Link>
          <Link href="/solar" className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl p-4 hover:from-amber-500 hover:to-orange-500 transition-all">
            <div className="text-2xl mb-2">☀️</div>
            <div className="font-bold text-white">Solar Maintenance</div>
            <div className="text-amber-200 text-sm">Complete solar diagnostics</div>
          </Link>
          <Link href="/spare-parts" className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-4 hover:from-purple-500 hover:to-purple-600 transition-all">
            <div className="text-2xl mb-2">🛒</div>
            <div className="font-bold text-white">Spare Parts</div>
            <div className="text-purple-200 text-sm">1,560+ components</div>
          </Link>
        </div>

        {/* Contact CTA */}
        <div className="mt-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Need Professional Maintenance Services?</h3>
          <p className="text-green-100 mb-4">Our certified technicians are available 24/7 across Kenya</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a href="tel:+254782914717" className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg text-white font-medium transition-colors">
              📞 0782 914 717
            </a>
            <a href="tel:+254768860665" className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg text-white font-medium transition-colors">
              📞 0768 860 665
            </a>
            <a href="https://wa.me/254782914717" className="bg-green-500 hover:bg-green-400 px-6 py-2 rounded-lg text-white font-medium transition-colors">
              💬 WhatsApp
            </a>
          </div>
        </div>

        {/* Service Areas */}
        <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">🗺️ Service Areas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Nyeri', 'Machakos', 'Malindi', 'Kilifi', 'Naivasha', 'Meru'].map(area => (
              <div key={area} className="bg-slate-700/50 rounded-lg px-3 py-2 text-center text-slate-300 text-sm">
                📍 {area}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            © 2026 Emerson Industrial Maintenance Services Limited. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <Link href="/generator-oracle" className="text-slate-400 hover:text-green-400">Generator Oracle</Link>
            <Link href="/solar" className="text-slate-400 hover:text-green-400">Solar Maintenance</Link>
            <Link href="/spare-parts" className="text-slate-400 hover:text-green-400">Spare Parts</Link>
            <Link href="/contact" className="text-slate-400 hover:text-green-400">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
