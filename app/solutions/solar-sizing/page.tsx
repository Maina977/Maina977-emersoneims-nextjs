'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionLead from "../../components/generators/SectionLead";
import UnifiedCTA from "@/components/cta/UnifiedCTA";

// =====================================================
// COMPREHENSIVE SOLAR SIZING SOLUTIONS HUB
// Load Calculation, System Design & Battery Sizing
// =====================================================

const SIZING_TABS = [
  { id: 'load', label: '📊 Load Analysis', color: 'blue' },
  { id: 'panels', label: '☀️ Panel Sizing', color: 'yellow' },
  { id: 'batteries', label: '🔋 Battery Sizing', color: 'purple' },
  { id: 'inverter', label: '📟 Inverter Selection', color: 'green' },
  { id: 'examples', label: '🏠 Design Examples', color: 'amber' },
];

// COMMON APPLIANCE LOADS
const COMMON_LOADS = [
  { category: 'Lighting', items: [
    { name: 'LED Bulb (9W)', watts: 9, hours: 6 },
    { name: 'LED Bulb (15W)', watts: 15, hours: 6 },
    { name: 'CFL Bulb (20W)', watts: 20, hours: 6 },
    { name: 'Fluorescent Tube (36W)', watts: 36, hours: 8 },
    { name: 'LED Floodlight (50W)', watts: 50, hours: 8 },
    { name: 'Security Light (100W)', watts: 100, hours: 12 },
  ]},
  { category: 'Entertainment', items: [
    { name: 'LED TV 32"', watts: 50, hours: 5 },
    { name: 'LED TV 43"', watts: 80, hours: 5 },
    { name: 'LED TV 55"', watts: 120, hours: 5 },
    { name: 'Satellite Decoder', watts: 25, hours: 8 },
    { name: 'WiFi Router', watts: 10, hours: 24 },
    { name: 'Sound System', watts: 100, hours: 4 },
    { name: 'Gaming Console', watts: 150, hours: 3 },
  ]},
  { category: 'Kitchen', items: [
    { name: 'Refrigerator (Small)', watts: 100, hours: 8 },
    { name: 'Refrigerator (Medium)', watts: 150, hours: 8 },
    { name: 'Refrigerator (Large)', watts: 200, hours: 8 },
    { name: 'Freezer (Chest)', watts: 80, hours: 8 },
    { name: 'Microwave', watts: 1200, hours: 0.3 },
    { name: 'Electric Kettle', watts: 2000, hours: 0.2 },
    { name: 'Blender', watts: 400, hours: 0.1 },
    { name: 'Toaster', watts: 800, hours: 0.1 },
  ]},
  { category: 'Office', items: [
    { name: 'Laptop', watts: 50, hours: 8 },
    { name: 'Desktop Computer', watts: 150, hours: 8 },
    { name: 'Monitor (24")', watts: 30, hours: 8 },
    { name: 'Printer (Inkjet)', watts: 50, hours: 0.5 },
    { name: 'Printer (Laser)', watts: 500, hours: 0.2 },
    { name: 'Phone Charger', watts: 10, hours: 3 },
  ]},
  { category: 'Cooling/Heating', items: [
    { name: 'Ceiling Fan', watts: 75, hours: 8 },
    { name: 'Standing Fan', watts: 50, hours: 8 },
    { name: 'AC (9000 BTU)', watts: 900, hours: 8 },
    { name: 'AC (12000 BTU)', watts: 1200, hours: 8 },
    { name: 'AC (18000 BTU)', watts: 1800, hours: 8 },
    { name: 'AC (24000 BTU)', watts: 2500, hours: 8 },
    { name: 'Water Heater (Instant)', watts: 3500, hours: 0.5 },
  ]},
  { category: 'Other', items: [
    { name: 'Water Pump (0.5HP)', watts: 370, hours: 2 },
    { name: 'Water Pump (1HP)', watts: 750, hours: 2 },
    { name: 'Washing Machine', watts: 500, hours: 1 },
    { name: 'Iron', watts: 1000, hours: 0.5 },
    { name: 'Vacuum Cleaner', watts: 1200, hours: 0.3 },
    { name: 'Security System', watts: 20, hours: 24 },
    { name: 'CCTV System (4 cameras)', watts: 50, hours: 24 },
  ]},
];

// PANEL SPECIFICATIONS
const PANEL_SPECS = [
  {
    type: 'Monocrystalline',
    efficiency: '20-23%',
    tempCoeff: '-0.35%/°C',
    warranty: '25-30 years',
    bestFor: 'Limited space, high efficiency needs',
    priceRange: 'Premium',
    sizes: ['400W', '450W', '500W', '550W'],
    pros: ['Highest efficiency', 'Best low-light performance', 'Longest lifespan'],
    cons: ['Higher cost', 'Performance drops in high heat'],
  },
  {
    type: 'Polycrystalline',
    efficiency: '16-18%',
    tempCoeff: '-0.40%/°C',
    warranty: '20-25 years',
    bestFor: 'Budget installations with adequate space',
    priceRange: 'Mid-range',
    sizes: ['330W', '340W', '350W'],
    pros: ['Lower cost', 'Good efficiency', 'Proven technology'],
    cons: ['Lower efficiency', 'More space needed', 'Heat sensitivity'],
  },
  {
    type: 'Thin Film',
    efficiency: '10-13%',
    tempCoeff: '-0.20%/°C',
    warranty: '10-20 years',
    bestFor: 'Hot climates, flexible mounting',
    priceRange: 'Budget',
    sizes: ['100W', '150W', '200W'],
    pros: ['Best heat tolerance', 'Flexible options', 'Works in low light'],
    cons: ['Lowest efficiency', 'Most space needed', 'Shorter lifespan'],
  },
  {
    type: 'Bifacial',
    efficiency: '20-25%',
    tempCoeff: '-0.35%/°C',
    warranty: '25-30 years',
    bestFor: 'Ground mounts, reflective surfaces',
    priceRange: 'Premium+',
    sizes: ['450W', '500W', '550W', '600W'],
    pros: ['Up to 30% more energy', 'Premium performance', 'Future-proof'],
    cons: ['Needs proper mounting', 'Higher cost', 'Needs reflective ground'],
  },
];

// BATTERY TYPES
const BATTERY_TYPES = [
  {
    type: 'Lead-Acid (Flooded)',
    dod: '50%',
    cycles: '500-800',
    life: '3-5 years',
    efficiency: '80%',
    maintenance: 'High (water top-up)',
    cost: 'KES 15,000-25,000 / kWh',
    pros: ['Lowest upfront cost', 'Easy to source', 'Recyclable'],
    cons: ['Shortest life', 'Heavy', 'Requires maintenance', 'Off-gassing'],
  },
  {
    type: 'Lead-Acid (AGM)',
    dod: '50%',
    cycles: '800-1200',
    life: '4-7 years',
    efficiency: '85%',
    maintenance: 'None',
    cost: 'KES 20,000-35,000 / kWh',
    pros: ['Maintenance-free', 'Sealed', 'Better cycle life'],
    cons: ['Higher cost than flooded', 'Still heavy', 'Temperature sensitive'],
  },
  {
    type: 'Lead-Acid (Gel)',
    dod: '60%',
    cycles: '1000-1500',
    life: '5-8 years',
    efficiency: '85%',
    maintenance: 'None',
    cost: 'KES 25,000-40,000 / kWh',
    pros: ['Best lead-acid cycle life', 'Temperature tolerant', 'Deep discharge ok'],
    cons: ['Higher cost', 'Slower charging', 'Voltage sensitive'],
  },
  {
    type: 'Lithium (LiFePO4)',
    dod: '80-90%',
    cycles: '3000-6000',
    life: '10-15 years',
    efficiency: '95%',
    maintenance: 'None',
    cost: 'KES 50,000-80,000 / kWh',
    pros: ['Longest life', 'Lightest weight', 'Best efficiency', 'Deep discharge'],
    cons: ['Highest upfront cost', 'Needs BMS', 'Cold performance'],
  },
];

// DESIGN EXAMPLES
const DESIGN_EXAMPLES = [
  {
    name: 'Basic Home System',
    description: 'Lights, TV, phone charging, basic appliances',
    dailyLoad: '3 kWh',
    peakLoad: '1.5 kW',
    design: {
      panels: '4 × 450W = 1.8 kWp',
      inverter: '3 kVA Hybrid',
      batteries: '5 kWh (100Ah @ 48V)',
      autonomy: '1.5 days',
    },
    estimatedCost: 'KES 280,000 - 350,000',
    notes: 'Suitable for small family, no AC or heavy loads',
  },
  {
    name: 'Standard Home System',
    description: 'Full home power including fridge, washing machine',
    dailyLoad: '8 kWh',
    peakLoad: '4 kW',
    design: {
      panels: '10 × 450W = 4.5 kWp',
      inverter: '5 kVA Hybrid',
      batteries: '10 kWh (200Ah @ 48V)',
      autonomy: '1 day',
    },
    estimatedCost: 'KES 550,000 - 700,000',
    notes: 'Covers most home needs except AC',
  },
  {
    name: 'Premium Home + AC',
    description: 'Full home with air conditioning, all appliances',
    dailyLoad: '20 kWh',
    peakLoad: '8 kW',
    design: {
      panels: '20 × 550W = 11 kWp',
      inverter: '10 kVA Hybrid (or 2 × 5 kVA)',
      batteries: '20 kWh (400Ah @ 48V Lithium)',
      autonomy: '1 day',
    },
    estimatedCost: 'KES 1,200,000 - 1,600,000',
    notes: 'Full energy independence, can run AC units',
  },
  {
    name: 'Small Office',
    description: 'Computers, lighting, small server, printer',
    dailyLoad: '15 kWh',
    peakLoad: '5 kW',
    design: {
      panels: '15 × 500W = 7.5 kWp',
      inverter: '8 kVA Hybrid',
      batteries: '15 kWh (Lithium)',
      autonomy: '1 day',
    },
    estimatedCost: 'KES 850,000 - 1,100,000',
    notes: 'Ideal for 5-10 person office',
  },
  {
    name: 'Commercial (Warehouse)',
    description: 'Lighting, cold storage, machinery',
    dailyLoad: '100 kWh',
    peakLoad: '50 kW',
    design: {
      panels: '100 × 550W = 55 kWp',
      inverter: '60 kVA (3-phase)',
      batteries: '100 kWh (Commercial Lithium)',
      autonomy: '1 day',
    },
    estimatedCost: 'KES 6,000,000 - 8,000,000',
    notes: 'May require grid-tie for economics',
  },
];

// KENYA PEAK SUN HOURS BY REGION
const KENYA_PSH = [
  { region: 'Nairobi', psh: 4.5, note: 'Moderate, some cloud cover' },
  { region: 'Mombasa', psh: 5.0, note: 'Good coastal radiation' },
  { region: 'Kisumu', psh: 5.2, note: 'Excellent, hot climate' },
  { region: 'Nakuru', psh: 4.8, note: 'Good highland conditions' },
  { region: 'Eldoret', psh: 4.5, note: 'Moderate, cooler temps' },
  { region: 'Turkana', psh: 6.0, note: 'Excellent, arid conditions' },
  { region: 'Garissa', psh: 5.8, note: 'Very good, hot and dry' },
  { region: 'Nyeri', psh: 4.3, note: 'Moderate, highland area' },
];

export default function SolarSizingHub() {
  const [activeTab, setActiveTab] = useState('load');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Lighting');
  const [expandedPanel, setExpandedPanel] = useState<string | null>(null);
  const [expandedBattery, setExpandedBattery] = useState<string | null>(null);

  return (
    <main className="bg-black min-h-screen">
      <SectionLead
        title="Solar System Sizing Hub"
        subtitle="Professional solar system design tools. Calculate your load, size panels, batteries, and inverters. Get it right the first time with our comprehensive sizing guides."
      />

      {/* Tab Navigation */}
      <section className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {SIZING_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-yellow-500 text-black'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <AnimatePresence mode="wait">
          {/* LOAD ANALYSIS SECTION */}
          {activeTab === 'load' && (
            <motion.div
              key="load"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Load Analysis Reference</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">
                  Use this reference to calculate your daily energy consumption. 
                  Daily kWh = Watts × Hours ÷ 1000
                </p>
              </div>

              {/* Load Formula Card */}
              <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-2xl p-8 border border-blue-500/30">
                <h3 className="text-2xl font-bold text-blue-400 mb-4">📊 Load Calculation Formula</h3>
                <div className="bg-black/30 rounded-lg p-6">
                  <p className="text-white font-mono text-lg mb-4">
                    Daily Energy (kWh) = Σ (Appliance Watts × Hours Used) ÷ 1000
                  </p>
                  <p className="text-gray-400 text-sm">
                    Add 20-30% safety margin for efficiency losses and future expansion
                  </p>
                </div>
              </div>

              {/* Appliance Categories */}
              {COMMON_LOADS.map((category) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-white/10 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedCategory(expandedCategory === category.category ? null : category.category)}
                    className="w-full text-left p-4 hover:bg-white/5 transition-colors flex items-center justify-between"
                  >
                    <h3 className="text-lg font-bold text-white">{category.category}</h3>
                    <motion.span
                      animate={{ rotate: expandedCategory === category.category ? 180 : 0 }}
                      className="text-gray-400"
                    >
                      ▼
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {expandedCategory === category.category && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/10"
                      >
                        <div className="p-4">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-white/10">
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-400">Appliance</th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-400">Watts</th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-400">Typical Hours</th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-400">Daily kWh</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {category.items.map((item) => (
                                <tr key={item.name}>
                                  <td className="px-3 py-2 text-white text-sm">{item.name}</td>
                                  <td className="px-3 py-2 text-right text-amber-400 font-mono text-sm">{item.watts}W</td>
                                  <td className="px-3 py-2 text-right text-gray-400 text-sm">{item.hours}h</td>
                                  <td className="px-3 py-2 text-right text-green-400 font-mono text-sm">
                                    {((item.watts * item.hours) / 1000).toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* PANEL SIZING SECTION */}
          {activeTab === 'panels' && (
            <motion.div
              key="panels"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Solar Panel Sizing</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">
                  Calculate the right panel capacity for your energy needs and location.
                </p>
              </div>

              {/* Sizing Formula */}
              <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-2xl p-8 border border-yellow-500/30">
                <h3 className="text-2xl font-bold text-yellow-400 mb-4">☀️ Panel Sizing Formula</h3>
                <div className="bg-black/30 rounded-lg p-6 space-y-4">
                  <p className="text-white font-mono text-lg">
                    Panel Capacity (kWp) = Daily Load (kWh) ÷ (Peak Sun Hours × System Efficiency)
                  </p>
                  <div className="grid md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <h4 className="text-white font-bold mb-2">Example:</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Daily load: 10 kWh</li>
                        <li>• Peak sun hours (Nairobi): 4.5</li>
                        <li>• System efficiency: 80%</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-2">Result:</h4>
                      <p className="text-green-400 font-mono">= 10 ÷ (4.5 × 0.8)</p>
                      <p className="text-green-400 text-2xl font-bold mt-2">= 2.78 kWp</p>
                      <p className="text-gray-400 text-sm mt-1">→ 6-7 × 450W panels</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kenya PSH Reference */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-yellow-500/30 p-6">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">🇰🇪 Kenya Peak Sun Hours by Region</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {KENYA_PSH.map((region) => (
                    <div key={region.region} className="bg-white/5 rounded-lg p-3 text-center">
                      <p className="text-white font-bold">{region.region}</p>
                      <p className="text-yellow-400 text-2xl font-mono">{region.psh}h</p>
                      <p className="text-gray-500 text-xs">{region.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Panel Types */}
              <div className="grid md:grid-cols-2 gap-6">
                {PANEL_SPECS.map((panel) => (
                  <motion.div
                    key={panel.type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-white/20 overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedPanel(expandedPanel === panel.type ? null : panel.type)}
                      className="w-full text-left p-4 hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-white">{panel.type}</h3>
                          <p className="text-yellow-400 text-sm">Efficiency: {panel.efficiency}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          panel.priceRange === 'Budget' ? 'bg-green-500/20 text-green-400' :
                          panel.priceRange === 'Mid-range' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          {panel.priceRange}
                        </span>
                      </div>
                    </button>

                    <AnimatePresence>
                      {expandedPanel === panel.type && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-white/10 p-4"
                        >
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Temp Coefficient:</span>
                              <span className="text-white">{panel.tempCoeff}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Warranty:</span>
                              <span className="text-white">{panel.warranty}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Best For:</span>
                              <span className="text-white text-right">{panel.bestFor}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Available Sizes:</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {panel.sizes.map((size) => (
                                  <span key={size} className="px-2 py-1 bg-white/10 rounded text-xs text-white">
                                    {size}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="pt-2 border-t border-white/10">
                              <p className="text-green-400 text-xs mb-1">✓ Pros:</p>
                              {panel.pros.map((pro, idx) => (
                                <p key={idx} className="text-gray-300 text-xs ml-2">• {pro}</p>
                              ))}
                            </div>
                            <div>
                              <p className="text-red-400 text-xs mb-1">✗ Cons:</p>
                              {panel.cons.map((con, idx) => (
                                <p key={idx} className="text-gray-300 text-xs ml-2">• {con}</p>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* BATTERY SIZING SECTION */}
          {activeTab === 'batteries' && (
            <motion.div
              key="batteries"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Battery Bank Sizing</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">
                  Size your battery bank correctly for reliable backup power and long battery life.
                </p>
              </div>

              {/* Battery Sizing Formula */}
              <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl p-8 border border-purple-500/30">
                <h3 className="text-2xl font-bold text-purple-400 mb-4">🔋 Battery Sizing Formula</h3>
                <div className="bg-black/30 rounded-lg p-6 space-y-4">
                  <p className="text-white font-mono text-lg">
                    Battery (Ah) = (Daily Load kWh × Autonomy Days × 1000) ÷ (DOD × Voltage × Efficiency)
                  </p>
                  <div className="grid md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <h4 className="text-white font-bold mb-2">Example (Lead-Acid):</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Daily load: 8 kWh</li>
                        <li>• Autonomy: 2 days</li>
                        <li>• DOD: 50%</li>
                        <li>• System voltage: 48V</li>
                        <li>• Efficiency: 85%</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-2">Result:</h4>
                      <p className="text-purple-400 font-mono">= (8 × 2 × 1000) ÷ (0.5 × 48 × 0.85)</p>
                      <p className="text-purple-400 text-2xl font-bold mt-2">= 784 Ah @ 48V</p>
                      <p className="text-gray-400 text-sm mt-1">→ 4 × 200Ah batteries in series-parallel</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Battery Types Comparison */}
              <div className="grid md:grid-cols-2 gap-6">
                {BATTERY_TYPES.map((battery) => (
                  <motion.div
                    key={battery.type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-purple-500/20 overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedBattery(expandedBattery === battery.type ? null : battery.type)}
                      className="w-full text-left p-4 hover:bg-white/5 transition-colors"
                    >
                      <h3 className="text-lg font-bold text-white">{battery.type}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-purple-400">DOD: {battery.dod}</span>
                        <span className="text-green-400">Cycles: {battery.cycles}</span>
                        <span className="text-gray-400">Life: {battery.life}</span>
                      </div>
                    </button>

                    <AnimatePresence>
                      {expandedBattery === battery.type && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-white/10 p-4"
                        >
                          <div className="space-y-3 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <span className="text-gray-400 block">Efficiency:</span>
                                <span className="text-white">{battery.efficiency}</span>
                              </div>
                              <div>
                                <span className="text-gray-400 block">Maintenance:</span>
                                <span className="text-white">{battery.maintenance}</span>
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-400 block">Est. Cost:</span>
                              <span className="text-green-400 font-mono">{battery.cost}</span>
                            </div>
                            <div className="pt-2 border-t border-white/10">
                              <p className="text-green-400 text-xs mb-1">✓ Advantages:</p>
                              {battery.pros.map((pro, idx) => (
                                <p key={idx} className="text-gray-300 text-xs ml-2">• {pro}</p>
                              ))}
                            </div>
                            <div>
                              <p className="text-red-400 text-xs mb-1">✗ Disadvantages:</p>
                              {battery.cons.map((con, idx) => (
                                <p key={idx} className="text-gray-300 text-xs ml-2">• {con}</p>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* INVERTER SELECTION SECTION */}
          {activeTab === 'inverter' && (
            <motion.div
              key="inverter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Inverter Selection Guide</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">
                  Choose the right inverter type and size for your solar system requirements.
                </p>
              </div>

              {/* Sizing Rules */}
              <div className="bg-gradient-to-r from-green-900/30 to-cyan-900/30 rounded-2xl p-8 border border-green-500/30">
                <h3 className="text-2xl font-bold text-green-400 mb-6">📟 Inverter Sizing Rules</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-white font-bold mb-3">1. Size for Peak Load</h4>
                    <p className="text-gray-300 text-sm">
                      Inverter VA ≥ Peak Load × 1.25<br/>
                      (Add 25% safety margin for surge loads)
                    </p>
                    <div className="mt-2 bg-black/30 rounded p-3">
                      <p className="text-green-400 font-mono text-sm">
                        Example: 4kW peak → 5kVA inverter
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-3">2. Match to Panel Array</h4>
                    <p className="text-gray-300 text-sm">
                      DC/AC ratio typically 1.0 - 1.3<br/>
                      (Slight oversizing of panels is OK)
                    </p>
                    <div className="mt-2 bg-black/30 rounded p-3">
                      <p className="text-green-400 font-mono text-sm">
                        5kW inverter → 5-6.5kWp panels
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inverter Types */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-blue-500/30 p-6">
                  <h3 className="text-xl font-bold text-blue-400 mb-4">Grid-Tie Inverter</h3>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li>✓ Feeds excess to grid</li>
                    <li>✓ Highest efficiency (97-99%)</li>
                    <li>✓ No batteries needed</li>
                    <li>✗ No backup during outage</li>
                    <li>✗ Requires grid connection</li>
                  </ul>
                  <p className="text-gray-500 text-xs mt-4">Best for: Grid-connected with net metering</p>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-green-500/30 p-6">
                  <h3 className="text-xl font-bold text-green-400 mb-4">Hybrid Inverter</h3>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li>✓ Battery + Grid capability</li>
                    <li>✓ Backup power available</li>
                    <li>✓ Flexible operation modes</li>
                    <li>✓ Future expandable</li>
                    <li>✗ More complex setup</li>
                  </ul>
                  <p className="text-gray-500 text-xs mt-4">Best for: Most residential &amp; commercial</p>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-purple-500/30 p-6">
                  <h3 className="text-xl font-bold text-purple-400 mb-4">Off-Grid Inverter</h3>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li>✓ Complete independence</li>
                    <li>✓ Works without grid</li>
                    <li>✓ Generator compatible</li>
                    <li>✗ No grid feed-in</li>
                    <li>✗ Requires batteries</li>
                  </ul>
                  <p className="text-gray-500 text-xs mt-4">Best for: Remote locations, no grid</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* DESIGN EXAMPLES SECTION */}
          {activeTab === 'examples' && (
            <motion.div
              key="examples"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Complete System Design Examples</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">
                  Reference designs for common applications. Use these as starting points for your system planning.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {DESIGN_EXAMPLES.map((example, idx) => (
                  <motion.div
                    key={example.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-amber-500/30 p-6"
                  >
                    <h3 className="text-xl font-bold text-amber-400 mb-2">{example.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{example.description}</p>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Daily Load:</span>
                        <span className="text-white font-mono">{example.dailyLoad}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Peak Load:</span>
                        <span className="text-white font-mono">{example.peakLoad}</span>
                      </div>
                      
                      <div className="border-t border-white/10 pt-3 mt-3">
                        <h4 className="text-amber-400 font-medium mb-2">System Design:</h4>
                        <div className="space-y-1 text-xs">
                          <p><span className="text-gray-400">Panels:</span> <span className="text-white">{example.design.panels}</span></p>
                          <p><span className="text-gray-400">Inverter:</span> <span className="text-white">{example.design.inverter}</span></p>
                          <p><span className="text-gray-400">Batteries:</span> <span className="text-white">{example.design.batteries}</span></p>
                          <p><span className="text-gray-400">Autonomy:</span> <span className="text-white">{example.design.autonomy}</span></p>
                        </div>
                      </div>
                      
                      <div className="bg-green-500/10 rounded-lg p-3 mt-3">
                        <p className="text-green-400 font-bold text-sm">{example.estimatedCost}</p>
                        <p className="text-gray-400 text-xs mt-1">{example.notes}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="bg-gradient-to-r from-yellow-900/30 to-amber-900/30 rounded-3xl p-8 md:p-12 border border-yellow-500/30 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need Professional System Design?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Our solar engineers will design a custom system tailored to your specific requirements, 
            budget, and location. Free site assessment included.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <UnifiedCTA action="get-quote" size="lg" label="Get Solar Quote" />
            <UnifiedCTA action="site-survey" variant="secondary" size="lg" label="Request Site Survey" />
          </div>
        </div>
      </section>
    </main>
  );
}
