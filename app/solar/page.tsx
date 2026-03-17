'use client';

/**
 * SOLAR HUB - COMPLETE SOLAR SOLUTIONS CENTER
 *
 * Features:
 * - Solar Products Shop with M-Pesa
 * - ROI Calculator
 * - Installation Booking
 * - System Calculator (Solar Bible)
 * - Fault Diagnostics
 * - Maintenance Schedule
 * - Educational Content
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { AnalogClock, AnalogCalendar, WeatherWidget } from '@/components/ui/AnalogWidgets';
import CinematicImageGallery from '@/components/ui/CinematicImageGallery';

// Solar Gallery Images - 4K Cinematic
const solarGalleryImages = [
  {
    src: '/images/1 (1).png',
    alt: 'Solar Panels at Sunset',
    category: 'Solar Arrays',
    title: 'Premium Solar Installation',
    description: 'High-efficiency solar panels with cinematic sunset backdrop',
  },
  {
    src: '/images/solar power farms.png',
    alt: 'Solar Power Farm Kenya',
    category: 'Commercial',
    title: 'Solar Power Farms',
    description: 'Large-scale solar farms powering Kenyan businesses',
  },
  {
    src: '/images/solar for flower farms.png',
    alt: 'Solar for Flower Farms',
    category: 'Agriculture',
    title: 'Agricultural Solar',
    description: 'Solar solutions for Kenya flower farms',
  },
  {
    src: '/images/solar hotel heaters.png',
    alt: 'Solar Hotel Water Heaters',
    category: 'Hospitality',
    title: 'Solar Water Heating',
    description: 'Solar thermal systems for hotels and resorts',
  },
  {
    src: '/images/solar-water-pumping.png',
    alt: 'Solar Water Pumping System',
    category: 'Water Solutions',
    title: 'Solar Water Pumps',
    description: 'Off-grid solar pumping for irrigation',
  },
  {
    src: '/images/solar changeover control.png',
    alt: 'Solar Changeover Control Panel',
    category: 'Controls',
    title: 'Smart Changeover Systems',
    description: 'Automatic solar-grid-generator switching',
  },
];

// Dynamic imports for heavy components
const SolarBibleEngine = dynamic(() => import('@/components/solar/SolarBibleEngine'), {
  loading: () => <div className="animate-pulse bg-slate-800 rounded-xl h-96" />,
  ssr: false
});

const SolarProductsShop = dynamic(() => import('@/components/solar/SolarProductsShop'), {
  loading: () => <div className="animate-pulse bg-slate-800 rounded-xl h-96" />,
  ssr: false
});

const SolarROICalculator = dynamic(() => import('@/components/solar/SolarROICalculator'), {
  loading: () => <div className="animate-pulse bg-slate-800 rounded-xl h-96" />,
  ssr: false
});

const SolarInstallationBooking = dynamic(() => import('@/components/solar/SolarInstallationBooking'), {
  loading: () => <div className="animate-pulse bg-slate-800 rounded-xl h-96" />,
  ssr: false
});

const SolarMaintenanceHub = dynamic(() => import('@/components/solar/SolarMaintenanceHub'), {
  loading: () => <div className="animate-pulse bg-slate-800 rounded-xl h-96" />,
  ssr: false
});

// Kenya locations for weather
const KENYA_LOCATIONS = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret',
  'Malindi', 'Kilifi', 'Karen', 'Embakasi', 'Thika',
  'Nyeri', 'Machakos', 'Garissa', 'Meru', 'Kakamega'
];

// Solar System Types
const SOLAR_SYSTEMS = [
  { id: 'residential', name: 'Residential Solar', icon: '🏠', capacity: '1-10 kW', description: 'Home solar systems with battery backup for reliable power supply.', components: ['Solar Panels', 'Inverter', 'Battery Bank', 'Charge Controller', 'Distribution Board'], maintenanceTasks: ['Panel cleaning and inspection', 'Battery water level check', 'Connection tightening', 'Inverter ventilation check', 'Performance monitoring'] },
  { id: 'commercial', name: 'Commercial Solar', icon: '🏢', capacity: '10-100 kW', description: 'Medium-scale solar installations for businesses and institutions.', components: ['Solar Array', 'String Inverters', 'Battery Storage', 'Monitoring System', 'Grid Tie'], maintenanceTasks: ['Array inspection and cleaning', 'String voltage verification', 'Inverter performance check', 'Battery state of health', 'Grid synchronization test'] },
  { id: 'industrial', name: 'Industrial Solar', icon: '🏭', capacity: '100+ kW', description: 'Large-scale solar farms and industrial installations.', components: ['Solar Farm', 'Central Inverters', 'SCADA System', 'Transformers', 'Substation'], maintenanceTasks: ['Thermal imaging inspection', 'IV curve tracing', 'Transformer oil analysis', 'SCADA calibration', 'Grid compliance testing'] },
  { id: 'hybrid', name: 'Hybrid Systems', icon: '⚡', capacity: '5-500 kW', description: 'Solar-generator-battery hybrid systems for maximum reliability.', components: ['Solar Array', 'Generator', 'Hybrid Inverter', 'Battery Bank', 'ATS Panel'], maintenanceTasks: ['Solar-generator synchronization', 'Battery cycling test', 'ATS operation check', 'Fuel optimization review', 'System efficiency audit'] },
  { id: 'offgrid', name: 'Off-Grid Systems', icon: '🏕️', capacity: '0.5-50 kW', description: 'Standalone systems for remote locations without grid access.', components: ['Solar Panels', 'MPPT Controller', 'Battery Bank', 'Off-Grid Inverter', 'Load Controller'], maintenanceTasks: ['Battery equalization', 'Charge controller calibration', 'Load priority configuration', 'System autonomy test', 'Backup assessment'] },
  { id: 'solar-pump', name: 'Solar Water Pumps', icon: '💧', capacity: '0.5-50 HP', description: 'Solar-powered water pumping for irrigation and domestic use.', components: ['Solar Array', 'VFD/Controller', 'Submersible Pump', 'Water Tank', 'Level Sensors'], maintenanceTasks: ['Pump efficiency test', 'VFD parameter check', 'Water quality analysis', 'Tank inspection', 'Irrigation schedule optimization'] },
];

// Common Solar Faults
const SOLAR_FAULTS = [
  { code: 'SOL-001', title: 'Low Solar Production', severity: 'warning', description: 'Solar panels producing below expected output. This could indicate soiling, shading, degradation, or equipment malfunction.', causes: ['Panel soiling', 'Partial shading', 'Panel degradation', 'Faulty connections', 'Inverter issues'], solutions: ['Clean panels with soft brush and water', 'Remove shading obstacles', 'Check all DC connections', 'Verify inverter operation', 'Test individual string voltages'] },
  { code: 'SOL-002', title: 'Battery Overcharge', severity: 'critical', description: 'Battery voltage exceeding safe limits. This dangerous condition can cause battery damage, reduced lifespan, or thermal runaway.', causes: ['Charge controller malfunction', 'Wrong voltage settings', 'Temperature sensor failure', 'Oversized solar array'], solutions: ['Reduce charging current', 'Verify charge controller settings', 'Check temperature sensors', 'Inspect battery ventilation', 'Consider load diversion'] },
  { code: 'SOL-003', title: 'Grid Sync Failure', severity: 'critical', description: 'Inverter unable to synchronize with utility grid. System cannot export power or provide grid-tied operation.', causes: ['Grid voltage out of range', 'Frequency deviation', 'Ground fault detected', 'Anti-islanding trip', 'Communication failure'], solutions: ['Check utility supply quality', 'Verify grid parameters', 'Clear ground faults', 'Reset anti-islanding', 'Update inverter firmware'] },
  { code: 'SOL-004', title: 'MPPT Tracking Error', severity: 'warning', description: 'Maximum Power Point Tracker not optimizing panel output. System losing potential energy harvest.', causes: ['Rapid irradiance changes', 'Partial shading', 'Controller malfunction', 'Wiring issues', 'Panel mismatch'], solutions: ['Check for shading patterns', 'Verify string configuration', 'Update controller firmware', 'Inspect DC wiring', 'Test individual panels'] },
  { code: 'SOL-005', title: 'Battery Low State of Charge', severity: 'warning', description: 'Battery bank below minimum recommended charge level. Continued discharge may damage batteries.', causes: ['Insufficient solar input', 'Excessive load demand', 'Battery degradation', 'Charge controller fault', 'Weather conditions'], solutions: ['Reduce non-essential loads', 'Check solar production', 'Verify charge controller', 'Test battery capacity', 'Consider backup charging'] },
  { code: 'SOL-006', title: 'Inverter Overtemperature', severity: 'critical', description: 'Inverter temperature exceeding safe operating limits. Unit will derate or shut down to prevent damage.', causes: ['Blocked ventilation', 'Fan failure', 'High ambient temperature', 'Overloading', 'Dust accumulation'], solutions: ['Improve ventilation', 'Clean heat sinks', 'Replace cooling fans', 'Reduce load', 'Relocate if needed'] },
];

// Maintenance Schedule
const MAINTENANCE_SCHEDULE = [
  { task: 'Visual inspection', frequency: 'Weekly', duration: '15 min', priority: 'routine' },
  { task: 'Panel cleaning', frequency: 'Monthly', duration: '1-2 hours', priority: 'routine' },
  { task: 'Battery water check', frequency: 'Monthly', duration: '30 min', priority: 'important' },
  { task: 'Connection tightening', frequency: 'Quarterly', duration: '1 hour', priority: 'important' },
  { task: 'Performance audit', frequency: 'Quarterly', duration: '2-3 hours', priority: 'important' },
  { task: 'Inverter service', frequency: 'Annually', duration: '4-6 hours', priority: 'critical' },
  { task: 'Battery load test', frequency: 'Annually', duration: '4 hours', priority: 'critical' },
  { task: 'Full system inspection', frequency: 'Annually', duration: '1 day', priority: 'critical' },
];

// Educational Content
const SOLAR_EDUCATION = [
  { title: 'How Solar Panels Work', content: 'Solar panels convert sunlight into electricity through photovoltaic cells. When sunlight hits the silicon cells, it knocks electrons loose, creating an electrical current. This DC power is then converted to AC by an inverter for use in your home or business.', icon: '☀️' },
  { title: 'Battery Storage Basics', content: 'Solar batteries store excess energy produced during the day for use at night or during power outages. Modern lithium batteries offer 10-15 year lifespans with 95% depth of discharge, while lead-acid batteries typically last 3-5 years with 50% DoD.', icon: '🔋' },
  { title: 'Grid-Tied vs Off-Grid', content: 'Grid-tied systems connect to the utility grid and can sell excess power. Off-grid systems are completely independent and require battery storage. Hybrid systems combine both approaches for maximum flexibility and reliability.', icon: '⚡' },
  { title: 'Sizing Your System', content: 'System size depends on your daily energy consumption, available roof space, and budget. In Kenya, expect 5-6 peak sun hours daily. A 5kW system produces about 20-25 kWh/day, suitable for a medium-sized home.', icon: '📐' },
  { title: 'Inverter Types Explained', content: 'String inverters connect multiple panels in series. Microinverters attach to individual panels for better shade tolerance. Hybrid inverters manage solar, battery, and grid connections, offering the most flexibility for Kenya conditions.', icon: '🔌' },
  { title: 'Maintenance Best Practices', content: 'Clean panels monthly during dry season. Check battery water levels (for lead-acid). Inspect connections quarterly. Monitor system performance daily through your inverter app. Schedule professional inspection annually.', icon: '🔧' },
];

type TabType = 'overview' | 'shop' | 'calculator' | 'roi' | 'booking' | 'faults' | 'maintenance' | 'education';

export default function SolarHub() {
  const [selectedSystem, setSelectedSystem] = useState(SOLAR_SYSTEMS[0]);
  const [selectedLocation, setSelectedLocation] = useState('nairobi');
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'shop', label: 'Shop', icon: '🛒', badge: 'NEW' },
    { id: 'calculator', label: 'System Calculator', icon: '🧮' },
    { id: 'roi', label: 'ROI Calculator', icon: '💰' },
    { id: 'booking', label: 'Book Installation', icon: '📅' },
    { id: 'faults', label: 'Fault Diagnostics', icon: '⚠️' },
    { id: 'maintenance', label: 'Maintenance', icon: '🔧' },
    { id: 'education', label: 'Learn', icon: '📚' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/80 border-b border-slate-700 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-amber-500 hover:text-amber-400 transition-colors">
                ← Home
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  ☀️ Solar Hub
                </h1>
                <p className="text-slate-400 text-sm">Complete solar solutions for Kenya</p>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <AnalogClock size={60} />
              <AnalogCalendar />
              <WeatherWidget location={selectedLocation} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Location Selector */}
        <div className="mb-6 flex items-center gap-4 flex-wrap">
          <span className="text-slate-400 text-sm">Your Location:</span>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
          >
            {KENYA_LOCATIONS.map(loc => (
              <option key={loc} value={loc.toLowerCase().replace(/[^a-z]/g, '')}>{loc}</option>
            ))}
          </select>
          <span className="text-green-400 text-sm">
            ☀️ Weather affects solar production - select your location for accurate recommendations
          </span>
        </div>

        {/* System Type Selector */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {SOLAR_SYSTEMS.map(system => (
            <motion.button
              key={system.id}
              onClick={() => setSelectedSystem(system)}
              className={`p-4 rounded-xl border transition-all text-left ${
                selectedSystem.id === system.id
                  ? 'bg-amber-500/20 border-amber-500 text-white'
                  : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-2xl mb-2">{system.icon}</div>
              <div className="font-medium text-sm">{system.name}</div>
              <div className="text-xs text-slate-500">{system.capacity}</div>
            </motion.button>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {tab.icon} {tab.label}
              {tab.badge && (
                <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">{tab.badge}</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Selected System Details */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{selectedSystem.icon}</div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedSystem.name}</h2>
                    <p className="text-slate-400 mb-4">{selectedSystem.description}</p>
                    <div className="text-amber-400 font-medium">Typical Capacity: {selectedSystem.capacity}</div>
                  </div>
                </div>
              </div>

              {/* Components & Tasks */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">📦 System Components</h3>
                  <ul className="space-y-2">
                    {selectedSystem.components.map((comp, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-300">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        {comp}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">🔧 Maintenance Tasks</h3>
                  <ul className="space-y-2">
                    {selectedSystem.maintenanceTasks.map((task, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-300">
                        <span className="text-green-400">✓</span>
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Quick Links */}
              <div className="grid md:grid-cols-4 gap-4">
                <button onClick={() => setActiveTab('shop')} className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl p-4 hover:from-amber-500 hover:to-orange-500 transition-all text-left">
                  <div className="text-2xl mb-2">🛒</div>
                  <div className="font-bold text-white">Shop Solar</div>
                  <div className="text-amber-200 text-sm">Browse equipment</div>
                </button>
                <button onClick={() => setActiveTab('roi')} className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-4 hover:from-green-500 hover:to-emerald-500 transition-all text-left">
                  <div className="text-2xl mb-2">💰</div>
                  <div className="font-bold text-white">ROI Calculator</div>
                  <div className="text-green-200 text-sm">See your savings</div>
                </button>
                <button onClick={() => setActiveTab('booking')} className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-4 hover:from-blue-500 hover:to-cyan-500 transition-all text-left">
                  <div className="text-2xl mb-2">📅</div>
                  <div className="font-bold text-white">Book Installation</div>
                  <div className="text-blue-200 text-sm">Free site survey</div>
                </button>
                <Link href="/generator-oracle" className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 hover:from-purple-500 hover:to-pink-500 transition-all">
                  <div className="text-2xl mb-2">🔮</div>
                  <div className="font-bold text-white">Generator Oracle</div>
                  <div className="text-purple-200 text-sm">Backup power diagnostics</div>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-amber-400">500+</p>
                  <p className="text-slate-400 text-sm">Systems Installed</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-green-400">5.5</p>
                  <p className="text-slate-400 text-sm">Avg Sun Hours/Day</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-blue-400">25</p>
                  <p className="text-slate-400 text-sm">Years Panel Warranty</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-purple-400">47</p>
                  <p className="text-slate-400 text-sm">Counties Served</p>
                </div>
              </div>

              {/* Solar Gallery - Cinematic 4K Showcase */}
              <div className="mt-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  ☀️ Our Solar Installations
                </h3>
                <CinematicImageGallery
                  images={solarGalleryImages}
                  layout="carousel"
                  showCaptions={true}
                  enableLightbox={true}
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'shop' && (
            <motion.div
              key="shop"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <SolarProductsShop />
            </motion.div>
          )}

          {activeTab === 'calculator' && (
            <motion.div
              key="calculator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <SolarBibleEngine />
            </motion.div>
          )}

          {activeTab === 'roi' && (
            <motion.div
              key="roi"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <SolarROICalculator />
            </motion.div>
          )}

          {activeTab === 'booking' && (
            <motion.div
              key="booking"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <SolarInstallationBooking />
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
              <h2 className="text-xl font-bold text-white mb-4">⚠️ Common Solar System Faults</h2>
              {SOLAR_FAULTS.map(fault => (
                <div key={fault.code} className={`bg-slate-800/50 border rounded-xl p-6 ${
                  fault.severity === 'critical' ? 'border-red-500/50' : 'border-yellow-500/50'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className={`px-3 py-1 rounded-lg text-sm font-mono ${
                      fault.severity === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {fault.code}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-2">{fault.title}</h3>
                      <p className="text-slate-400 mb-4">{fault.description}</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-slate-300 mb-2">Possible Causes:</h4>
                          <ul className="space-y-1">
                            {fault.causes.map((cause, i) => (
                              <li key={i} className="text-sm text-slate-400 flex items-center gap-2">
                                <span className="text-red-400">•</span> {cause}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-slate-300 mb-2">Solutions:</h4>
                          <ul className="space-y-1">
                            {fault.solutions.map((sol, i) => (
                              <li key={i} className="text-sm text-slate-400 flex items-center gap-2">
                                <span className="text-green-400">✓</span> {sol}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'maintenance' && (
            <motion.div
              key="maintenance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <SolarMaintenanceHub />
            </motion.div>
          )}

          {activeTab === 'education' && (
            <motion.div
              key="education"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-bold text-white mb-4">📚 Solar Education Center</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {SOLAR_EDUCATION.map((topic, i) => (
                  <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-amber-500/50 transition-all">
                    <div className="text-3xl mb-3">{topic.icon}</div>
                    <h3 className="text-lg font-bold text-white mb-2">{topic.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{topic.content}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contact CTA */}
        <div className="mt-8 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Need Professional Solar Services?</h3>
          <p className="text-amber-100 mb-4">Our certified technicians are available across Kenya</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a href="tel:+254793573208" className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg text-white font-medium transition-colors">
              📞 0793 573 208
            </a>
            <a href="https://wa.me/254793573208" className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg text-white font-medium transition-colors">
              💬 WhatsApp
            </a>
          </div>
          <p className="text-amber-200 text-sm mt-3">M-Pesa Payment: 0793573208</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            © 2026 Emerson Industrial Maintenance Services Limited. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <Link href="/generator-oracle" className="text-slate-400 hover:text-amber-400">Generator Oracle</Link>
            <Link href="/generators/spare-parts" className="text-slate-400 hover:text-amber-400">Spare Parts</Link>
            <Link href="/services" className="text-slate-400 hover:text-amber-400">Services</Link>
            <Link href="/contact" className="text-slate-400 hover:text-amber-400">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
