'use client';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * THE FABRICATION BIBLE - KENYA'S COMPREHENSIVE FABRICATION GUIDE
 * Generator Exhausts, Canopies, Tanks, Enclosures & Electrical Panels
 * Complete Design Specifications | Material Standards | Installation Guides
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  FABRICATION_FAULT_CODES as BIBLE_FAULT_CODES,
  FABRICATION_REPAIR_MANUALS,
  FABRICATION_PARTS_CATALOGUE,
  FABRICATION_MAINTENANCE_SCHEDULES,
  FABRICATION_KENYA_SUPPLIERS,
} from '@/lib/maintenance-hub/fabrication-bible';

// ═══════════════════════════════════════════════════════════════════════════════
// FABRICATION CATEGORIES
// ═══════════════════════════════════════════════════════════════════════════════
const FABRICATION_CATEGORIES = [
  {
    id: 'exhausts',
    name: 'Generator Exhaust Systems',
    icon: '💨',
    description: 'Complete exhaust piping, silencers, and emission control systems for generators.',
    services: ['Exhaust pipe fabrication', 'Silencer installation', 'Flexible connections', 'Rain caps', 'Insulation', 'Support structures'],
    materials: ['Mild steel', 'Stainless steel 304/316', 'Galvanized steel', 'Aluminized steel'],
    standards: ['BS 5493', 'ISO 8528-9', 'Generator manufacturer specs'],
  },
  {
    id: 'canopies',
    name: 'Generator Canopies & Enclosures',
    icon: '🏠',
    description: 'Weatherproof and soundproof enclosures for generators of all sizes.',
    services: ['Custom canopy design', 'Acoustic treatment', 'Ventilation systems', 'Access doors', 'Control panel integration'],
    materials: ['Powder-coated steel', 'Galvanized steel', 'Aluminum', 'Acoustic foam', 'Rock wool'],
    standards: ['ISO 8528-12', 'Noise regulations', 'NEMA 3R/4'],
  },
  {
    id: 'tanks',
    name: 'Fuel Tanks & Day Tanks',
    icon: '⛽',
    description: 'Base tanks, day tanks, and bulk storage with automation systems.',
    services: ['Tank fabrication', 'Fuel transfer systems', 'Level automation', 'Bund walls', 'Piping installation'],
    materials: ['Mild steel', 'Double-wall steel', 'Stainless steel', 'HDPE (above ground)'],
    standards: ['NFPA 30', 'API 650', 'BS 799', 'NEMA regulations'],
  },
  {
    id: 'mdb',
    name: 'Main Distribution Boards',
    icon: '⚡',
    description: 'Custom electrical panels, MCCs, and distribution boards.',
    services: ['Panel design', 'Busbar fabrication', 'Component mounting', 'Wiring', 'Testing & commissioning'],
    materials: ['Powder-coated steel', 'Stainless steel', 'Copper busbars', 'Aluminum busbars'],
    standards: ['IEC 61439', 'KEBS standards', 'KPLC requirements'],
  },
  {
    id: 'structures',
    name: 'Structural Steel Fabrication',
    icon: '🏗️',
    description: 'Equipment supports, platforms, and industrial structures.',
    services: ['Platform fabrication', 'Equipment skids', 'Pipe supports', 'Cable trays', 'Ladders & handrails'],
    materials: ['Structural steel', 'Hot-dip galvanized', 'Stainless steel', 'Aluminum'],
    standards: ['AISC', 'BS 5950', 'Kenya Building Code'],
  },
  {
    id: 'piping',
    name: 'Industrial Piping Systems',
    icon: '🔧',
    description: 'Process piping, fuel lines, cooling systems, and compressed air.',
    services: ['Pipe fabrication', 'Welding', 'Threading', 'Support installation', 'Testing'],
    materials: ['Carbon steel', 'Stainless steel', 'Copper', 'HDPE', 'PVC'],
    standards: ['ASME B31.1', 'ASME B31.3', 'BS 1560'],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// EXHAUST SYSTEM SPECIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════════
const EXHAUST_SPECS = {
  pipesSizing: [
    { genSize: '10-30 kVA', pipeSize: '3" (75mm)', material: 'Mild Steel 2mm', backPressure: '<50mm WC' },
    { genSize: '50-100 kVA', pipeSize: '4" (100mm)', material: 'Mild Steel 3mm', backPressure: '<75mm WC' },
    { genSize: '150-250 kVA', pipeSize: '5" (125mm)', material: 'Mild Steel 3mm', backPressure: '<100mm WC' },
    { genSize: '300-500 kVA', pipeSize: '6" (150mm)', material: 'Mild Steel 4mm', backPressure: '<125mm WC' },
    { genSize: '600-1000 kVA', pipeSize: '8" (200mm)', material: 'Mild Steel 5mm', backPressure: '<150mm WC' },
    { genSize: '1250-2000 kVA', pipeSize: '10" (250mm)', material: 'Mild Steel 6mm', backPressure: '<150mm WC' },
    { genSize: '2500+ kVA', pipeSize: '12"+ (300mm+)', material: 'Mild Steel 6mm+', backPressure: 'Per design' },
  ],
  silencers: [
    { type: 'Industrial', attenuation: '20-25 dB', application: 'Standard installations', pressure_drop: '25mm WC' },
    { type: 'Residential', attenuation: '25-35 dB', application: 'Near occupied areas', pressure_drop: '50mm WC' },
    { type: 'Critical', attenuation: '35-45 dB', application: 'Hospitals, hotels, studios', pressure_drop: '75mm WC' },
    { type: 'Super Critical', attenuation: '45+ dB', application: 'Recording studios, theatres', pressure_drop: '100mm WC' },
  ],
  components: [
    { name: 'Flexible Bellows', function: 'Absorb vibration, thermal expansion', material: 'Stainless steel braided' },
    { name: 'Rain Cap', function: 'Prevent water entry', material: 'Galvanized/SS' },
    { name: 'Spark Arrestor', function: 'Prevent sparks (fire safety)', material: 'Stainless mesh' },
    { name: 'Thermal Insulation', function: 'Personnel protection, heat reduction', material: 'Ceramic fiber + cladding' },
    { name: 'Support Brackets', function: 'Pipe support, weight distribution', material: 'Structural steel' },
    { name: 'Thimble (Wall Pass)', function: 'Safe wall penetration', material: 'Steel with ventilation' },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// CANOPY SPECIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════════
const CANOPY_SPECS = {
  types: [
    { type: 'Weather Protection Only', panels: 'Single skin 1.2mm', insulation: 'None', noise: '-5 to -10 dB', application: 'Remote sites, farms' },
    { type: 'Standard Acoustic', panels: 'Double skin 1.2+0.8mm', insulation: '25mm foam', noise: '-15 to -20 dB', application: 'Commercial, light industrial' },
    { type: 'Super Silent', panels: 'Double skin 1.5+1.0mm', insulation: '50mm rockwool', noise: '-25 to -30 dB', application: 'Hotels, hospitals, urban' },
    { type: 'Ultra Silent', panels: 'Triple layer', insulation: '75-100mm composite', noise: '-35+ dB', application: 'Studios, theatres, sensitive areas' },
  ],
  ventilation: {
    cooling_air: '8-12 m³/min per kW of heat rejection',
    inlet_area: '1.5 × radiator face area minimum',
    outlet_area: '1.2 × radiator face area minimum',
    air_velocity: '< 5 m/s through silencers',
  },
  features: [
    'Lockable access doors with gas struts',
    'Removable roof panels for major service',
    'Integrated lifting points',
    'Drip tray with drain',
    'Emergency stop button',
    'Control panel window',
    'Lighting (LED, explosion proof optional)',
    'Ventilation louvers with bird mesh',
    'Cable/fuel entry grommets',
    'Earthing points',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// FUEL TANK SPECIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════════
const TANK_SPECS = {
  baseTanks: [
    { genSize: '10-50 kVA', capacity: '100-200L', runtime: '8-12 hours', dimensions: '600×400×500mm' },
    { genSize: '100-200 kVA', capacity: '300-500L', runtime: '8-12 hours', dimensions: '1000×600×600mm' },
    { genSize: '250-500 kVA', capacity: '500-1000L', runtime: '8-12 hours', dimensions: '1200×800×800mm' },
    { genSize: '600-1000 kVA', capacity: '1000-2000L', runtime: '8-12 hours', dimensions: '1500×1000×1000mm' },
    { genSize: '1500-2500 kVA', capacity: '2000-5000L', runtime: '8-12 hours', dimensions: '2000×1200×1200mm' },
  ],
  bulkTanks: [
    { capacity: '5,000L', dimensions: '2400×1200×2200mm', application: 'Small commercial' },
    { capacity: '10,000L', dimensions: '3000×1500×2500mm', application: 'Medium commercial' },
    { capacity: '20,000L', dimensions: '4000×2000×3000mm', application: 'Large commercial' },
    { capacity: '50,000L', dimensions: '6000×3000×3500mm', application: 'Industrial' },
  ],
  automation: [
    { component: 'Level Sensor', type: 'Float/Ultrasonic/Capacitive', function: 'Monitor fuel level' },
    { component: 'Auto Fill Valve', type: 'Solenoid + Motorized', function: 'Automatic fuel transfer' },
    { component: 'High Level Switch', type: 'Float/Electronic', function: 'Prevent overflow' },
    { component: 'Low Level Switch', type: 'Float/Electronic', function: 'Generator protection' },
    { component: 'Fuel Pump', type: 'Electric transfer pump', function: 'Bulk to day tank transfer' },
    { component: 'Level Indicator', type: 'Mechanical/Electronic', function: 'Local/remote display' },
    { component: 'Leak Detector', type: 'Bund sensor', function: 'Environmental protection' },
    { component: 'GSM Module', type: 'Remote monitoring', function: 'SMS alerts for levels' },
  ],
  bund_requirements: {
    capacity: '110% of largest tank or 25% of total',
    material: 'Concrete or double-wall tank',
    slope: 'Towards sump for drainage',
    accessories: ['Rain cover', 'Drain valve (locked)', 'Leak detection'],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// MDB SPECIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════════
const MDB_SPECS = {
  enclosures: [
    { type: 'IP31', application: 'Indoor dry locations', features: 'Basic protection' },
    { type: 'IP42', application: 'Indoor general purpose', features: 'Water drip protection' },
    { type: 'IP54', application: 'Indoor dusty/damp', features: 'Dust and splash protection' },
    { type: 'IP55', application: 'Outdoor/wash-down', features: 'Jet water protection' },
    { type: 'IP65', application: 'Outdoor harsh', features: 'Dust tight, water jet' },
    { type: 'IP66', application: 'Outdoor severe', features: 'Dust tight, powerful jets' },
  ],
  busbars: [
    { rating: '100-250A', size: '25×3mm copper', arrangement: '3P or 3P+N' },
    { rating: '400A', size: '40×5mm copper', arrangement: '3P+N' },
    { rating: '630A', size: '50×5mm copper', arrangement: '3P+N' },
    { rating: '800A', size: '60×6mm copper', arrangement: '3P+N' },
    { rating: '1000A', size: '80×6mm copper', arrangement: '3P+N' },
    { rating: '1250A', size: '100×6mm copper', arrangement: '3P+N' },
    { rating: '1600A', size: '2×60×6mm copper', arrangement: '3P+N' },
    { rating: '2000A', size: '2×80×6mm copper', arrangement: '3P+N' },
    { rating: '2500A', size: '2×100×8mm copper', arrangement: '3P+N' },
    { rating: '3200A', size: '3×100×8mm copper', arrangement: '3P+N' },
    { rating: '4000A', size: '4×100×8mm copper', arrangement: '3P+N' },
  ],
  components: [
    { category: 'Main Switch', items: ['MCCB', 'ACB', 'Fused switch', 'Isolator'] },
    { category: 'Protection', items: ['MCB', 'MCCB', 'RCD/RCCB', 'RCBO', 'Surge protection'] },
    { category: 'Metering', items: ['kWh meter', 'Power analyzer', 'Ammeter', 'Voltmeter'] },
    { category: 'Control', items: ['Changeover switch', 'Timer', 'Contactor', 'Relay'] },
    { category: 'Accessories', items: ['Cable glands', 'Terminal blocks', 'DIN rails', 'Labels'] },
  ],
  standards: {
    design: 'IEC 61439-1, IEC 61439-2',
    testing: 'Type tested or partially type tested',
    verification: 'Design verification, routine verification',
    labeling: 'Circuit schedule, warning labels, earthing labels',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// FAULT CODES DATABASE
// ═══════════════════════════════════════════════════════════════════════════════
const FABRICATION_FAULTS = [
  // Exhaust System Faults
  { code: 'EX001', name: 'Excessive Back Pressure', category: 'Exhaust', severity: 'High',
    symptoms: ['Generator overheating', 'Power loss', 'Black smoke', 'High exhaust temp'],
    causes: ['Undersized pipe', 'Too many bends', 'Blocked silencer', 'Collapsed pipe'],
    repair: ['Resize piping', 'Reduce bends', 'Clean silencer', 'Replace damaged sections'] },
  { code: 'EX002', name: 'Exhaust Leak', category: 'Exhaust', severity: 'Critical',
    symptoms: ['Visible smoke', 'Noise', 'Carbon monoxide risk', 'Heat damage'],
    causes: ['Cracked weld', 'Corroded pipe', 'Failed gasket', 'Loose flanges'],
    repair: ['Re-weld cracks', 'Replace pipe', 'Replace gaskets', 'Tighten flanges'] },
  { code: 'EX003', name: 'Silencer Damage', category: 'Exhaust', severity: 'Medium',
    symptoms: ['Excessive noise', 'Reduced attenuation', 'Rattling'],
    causes: ['Internal baffle failure', 'Corrosion', 'Condensation damage'],
    repair: ['Replace silencer', 'Improve drainage', 'Add condensate trap'] },
  { code: 'EX004', name: 'Thermal Insulation Failure', category: 'Exhaust', severity: 'Medium',
    symptoms: ['Hot pipe surface', 'Fire risk', 'Personnel burn risk'],
    causes: ['Water damage', 'Age', 'Mechanical damage', 'Poor installation'],
    repair: ['Replace insulation', 'Add weather protection', 'Improve cladding'] },

  // Canopy Faults
  { code: 'CN001', name: 'Overheating Inside Canopy', category: 'Canopy', severity: 'High',
    symptoms: ['Generator overheating', 'High ambient temp', 'Reduced output'],
    causes: ['Blocked ventilation', 'Undersized openings', 'Radiator recirculation'],
    repair: ['Clear blockages', 'Add ventilation', 'Redesign airflow'] },
  { code: 'CN002', name: 'Excessive Noise Emission', category: 'Canopy', severity: 'Medium',
    symptoms: ['Noise above specification', 'Complaints', 'Regulation breach'],
    causes: ['Damaged seals', 'Open panels', 'Insufficient insulation', 'Vibration transfer'],
    repair: ['Replace seals', 'Close gaps', 'Add insulation', 'Install vibration mounts'] },
  { code: 'CN003', name: 'Water Ingress', category: 'Canopy', severity: 'High',
    symptoms: ['Water in canopy', 'Electrical faults', 'Corrosion'],
    causes: ['Failed seals', 'Rust holes', 'Poor drainage', 'Damaged roof'],
    repair: ['Replace seals', 'Patch/replace panels', 'Improve drainage'] },

  // Tank Faults
  { code: 'TK001', name: 'Fuel Leak', category: 'Tank', severity: 'Critical',
    symptoms: ['Fuel smell', 'Level drop', 'Staining', 'Environmental risk'],
    causes: ['Corrosion', 'Weld failure', 'Fitting leak', 'Impact damage'],
    repair: ['Repair/replace tank', 'Fix fittings', 'Restore bund'] },
  { code: 'TK002', name: 'Auto-Fill Failure', category: 'Tank', severity: 'High',
    symptoms: ['Generator runs out of fuel', 'No automatic transfer'],
    causes: ['Pump failure', 'Valve stuck', 'Sensor fault', 'Control fault'],
    repair: ['Replace pump', 'Service valve', 'Calibrate sensor', 'Check controls'] },
  { code: 'TK003', name: 'Level Sensor Fault', category: 'Tank', severity: 'Medium',
    symptoms: ['Incorrect readings', 'No alarm', 'Overflow risk'],
    causes: ['Sensor failure', 'Calibration drift', 'Wiring fault'],
    repair: ['Replace sensor', 'Recalibrate', 'Fix wiring'] },

  // MDB Faults
  { code: 'MB001', name: 'Busbar Overheating', category: 'MDB', severity: 'Critical',
    symptoms: ['Hot enclosure', 'Discoloration', 'Burning smell'],
    causes: ['Loose connections', 'Overloading', 'Undersized busbar'],
    repair: ['Tighten connections', 'Reduce load', 'Upgrade busbar'] },
  { code: 'MB002', name: 'Breaker Tripping', category: 'MDB', severity: 'Medium',
    symptoms: ['Frequent trips', 'Power loss'],
    causes: ['Overload', 'Short circuit', 'Wrong setting', 'Faulty breaker'],
    repair: ['Reduce load', 'Find fault', 'Adjust settings', 'Replace breaker'] },
  { code: 'MB003', name: 'Earth Fault', category: 'MDB', severity: 'High',
    symptoms: ['RCD tripping', 'Shock hazard', 'Equipment damage'],
    causes: ['Insulation failure', 'Water ingress', 'Cable damage'],
    repair: ['Find and fix fault', 'Improve sealing', 'Replace cables'] },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MATERIAL SPECIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════════
const MATERIALS = {
  steel: [
    { grade: 'Mild Steel (A36)', yield: '250 MPa', application: 'General fabrication', coating: 'Paint or galvanize' },
    { grade: 'SS 304', yield: '205 MPa', application: 'Corrosion resistance', coating: 'None required' },
    { grade: 'SS 316', yield: '205 MPa', application: 'Marine/chemical', coating: 'None required' },
    { grade: 'Galvanized', yield: '250 MPa', application: 'Outdoor structures', coating: 'Zinc coating' },
    { grade: 'Corten Steel', yield: '345 MPa', application: 'Weathering applications', coating: 'Self-protecting rust' },
  ],
  finishes: [
    { type: 'Powder Coating', thickness: '60-80 microns', durability: '10-15 years outdoor', colors: 'RAL colors' },
    { type: 'Hot-Dip Galvanizing', thickness: '85-100 microns', durability: '25-50 years', colors: 'Silver/grey' },
    { type: 'Zinc Spray', thickness: '100-150 microns', durability: '15-25 years', colors: 'Silver/grey' },
    { type: 'Paint (2-pack)', thickness: '125-200 microns', durability: '5-10 years', colors: 'Any color' },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function FabricationMaintenanceHub() {
  const [activeTab, setActiveTab] = useState<'overview' | 'exhausts' | 'canopies' | 'tanks' | 'mdb' | 'faults' | 'repair' | 'parts' | 'maintenance'>('overview');
  const [selectedFault, setSelectedFault] = useState<typeof FABRICATION_FAULTS[0] | null>(null);
  const [selectedRepairManual, setSelectedRepairManual] = useState<typeof FABRICATION_REPAIR_MANUALS[0] | null>(null);
  const [selectedPartsCategory, setSelectedPartsCategory] = useState<string>('plasma');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '🏭' },
    { id: 'exhausts', label: 'Exhaust Systems', icon: '💨' },
    { id: 'canopies', label: 'Canopies', icon: '🏠' },
    { id: 'tanks', label: 'Fuel Tanks', icon: '⛽' },
    { id: 'mdb', label: 'Distribution Boards', icon: '⚡' },
    { id: 'faults', label: 'Fault Codes', icon: '⚠️' },
    { id: 'repair', label: 'Repair Manuals', icon: '📖' },
    { id: 'parts', label: 'Parts Catalogue', icon: '🔩' },
    { id: 'maintenance', label: 'Maintenance', icon: '🗓️' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900/10 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/maintenance-hub" className="text-white/80 hover:text-white mb-4 inline-flex items-center gap-2">
            ← Back to Maintenance Hub
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🏭 The Fabrication Bible
          </h1>
          <p className="text-xl text-white/90 mb-6">
            Kenya&apos;s Comprehensive Fabrication & Panel Building Guide
          </p>
          <div className="flex flex-wrap gap-4 text-white/90">
            <span className="bg-white/20 px-4 py-2 rounded-full">Exhaust Systems</span>
            <span className="bg-white/20 px-4 py-2 rounded-full">Generator Canopies</span>
            <span className="bg-white/20 px-4 py-2 rounded-full">Fuel Tanks & Automation</span>
            <span className="bg-white/20 px-4 py-2 rounded-full">Distribution Boards</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-slate-800 border-y border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-400">{FABRICATION_CATEGORIES.length}</div>
              <div className="text-sm text-slate-400">Service Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">{FABRICATION_FAULTS.length}</div>
              <div className="text-sm text-slate-400">Fault Codes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-400">{EXHAUST_SPECS.pipesSizing.length}</div>
              <div className="text-sm text-slate-400">Exhaust Sizes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">{MDB_SPECS.busbars.length}</div>
              <div className="text-sm text-slate-400">Busbar Ratings</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-800/50 sticky top-0 z-40 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-700 text-white hover:bg-slate-600'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {FABRICATION_CATEGORIES.map(cat => (
                  <div key={cat.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 transition-all">
                    <div className="text-4xl mb-4">{cat.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{cat.name}</h3>
                    <p className="text-slate-400 text-sm mb-4">{cat.description}</p>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {cat.materials.slice(0, 3).map(m => (
                          <span key={m} className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">{m}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Materials */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-white mb-6">Material Specifications</h2>
                <div className="overflow-x-auto">
                  <table className="w-full bg-slate-800 rounded-xl overflow-hidden">
                    <thead className="bg-slate-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-blue-400">Grade</th>
                        <th className="px-4 py-3 text-left text-blue-400">Yield Strength</th>
                        <th className="px-4 py-3 text-left text-blue-400">Application</th>
                        <th className="px-4 py-3 text-left text-blue-400">Coating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MATERIALS.steel.map(mat => (
                        <tr key={mat.grade} className="border-t border-slate-700">
                          <td className="px-4 py-3 text-white font-semibold">{mat.grade}</td>
                          <td className="px-4 py-3 text-slate-300">{mat.yield}</td>
                          <td className="px-4 py-3 text-slate-300">{mat.application}</td>
                          <td className="px-4 py-3 text-slate-400">{mat.coating}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'exhausts' && (
            <motion.div key="exhausts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <h2 className="text-2xl font-bold text-white">Generator Exhaust System Design</h2>

              {/* Pipe Sizing */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-blue-400 mb-4">Exhaust Pipe Sizing Guide</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-blue-400">Generator Size</th>
                        <th className="px-4 py-3 text-left text-blue-400">Pipe Size</th>
                        <th className="px-4 py-3 text-left text-blue-400">Material</th>
                        <th className="px-4 py-3 text-left text-blue-400">Max Back Pressure</th>
                      </tr>
                    </thead>
                    <tbody>
                      {EXHAUST_SPECS.pipesSizing.map(spec => (
                        <tr key={spec.genSize} className="border-t border-slate-700">
                          <td className="px-4 py-3 text-white">{spec.genSize}</td>
                          <td className="px-4 py-3 text-green-400 font-semibold">{spec.pipeSize}</td>
                          <td className="px-4 py-3 text-slate-300">{spec.material}</td>
                          <td className="px-4 py-3 text-yellow-400">{spec.backPressure}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Silencers */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-blue-400 mb-4">Silencer Types</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {EXHAUST_SPECS.silencers.map(sil => (
                    <div key={sil.type} className="bg-slate-700/50 rounded-lg p-4">
                      <h4 className="text-white font-bold">{sil.type}</h4>
                      <div className="mt-2 space-y-1 text-sm">
                        <div><span className="text-slate-400">Attenuation:</span> <span className="text-green-400">{sil.attenuation}</span></div>
                        <div><span className="text-slate-400">Application:</span> <span className="text-slate-300">{sil.application}</span></div>
                        <div><span className="text-slate-400">Pressure Drop:</span> <span className="text-yellow-400">{sil.pressure_drop}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Components */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-blue-400 mb-4">Exhaust System Components</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {EXHAUST_SPECS.components.map(comp => (
                    <div key={comp.name} className="bg-slate-700/50 rounded-lg p-4">
                      <h4 className="text-white font-bold">{comp.name}</h4>
                      <p className="text-slate-400 text-sm mt-1">{comp.function}</p>
                      <p className="text-blue-400 text-xs mt-2">Material: {comp.material}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'canopies' && (
            <motion.div key="canopies" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <h2 className="text-2xl font-bold text-white">Generator Canopy Specifications</h2>

              {/* Types */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-blue-400 mb-4">Canopy Types</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-blue-400">Type</th>
                        <th className="px-4 py-3 text-left text-blue-400">Panel Construction</th>
                        <th className="px-4 py-3 text-left text-blue-400">Insulation</th>
                        <th className="px-4 py-3 text-left text-blue-400">Noise Reduction</th>
                        <th className="px-4 py-3 text-left text-blue-400">Application</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CANOPY_SPECS.types.map(type => (
                        <tr key={type.type} className="border-t border-slate-700">
                          <td className="px-4 py-3 text-white font-semibold">{type.type}</td>
                          <td className="px-4 py-3 text-slate-300">{type.panels}</td>
                          <td className="px-4 py-3 text-slate-300">{type.insulation}</td>
                          <td className="px-4 py-3 text-green-400">{type.noise}</td>
                          <td className="px-4 py-3 text-slate-400">{type.application}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Features */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-blue-400 mb-4">Standard Features</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {CANOPY_SPECS.features.map(feature => (
                    <div key={feature} className="flex items-center gap-2 bg-slate-700/50 rounded-lg p-3">
                      <span className="text-green-400">✓</span>
                      <span className="text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ventilation */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-blue-400 mb-4">Ventilation Requirements</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(CANOPY_SPECS.ventilation).map(([key, value]) => (
                    <div key={key} className="bg-slate-700/50 rounded-lg p-4">
                      <h4 className="text-white font-semibold capitalize">{key.replace(/_/g, ' ')}</h4>
                      <p className="text-green-400 text-lg mt-1">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'tanks' && (
            <motion.div key="tanks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <h2 className="text-2xl font-bold text-white">Fuel Tank Specifications</h2>

              {/* Base Tanks */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-blue-400 mb-4">Base Tank Sizing (8-12hr Runtime)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-blue-400">Generator Size</th>
                        <th className="px-4 py-3 text-left text-blue-400">Tank Capacity</th>
                        <th className="px-4 py-3 text-left text-blue-400">Runtime</th>
                        <th className="px-4 py-3 text-left text-blue-400">Typical Dimensions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {TANK_SPECS.baseTanks.map(tank => (
                        <tr key={tank.genSize} className="border-t border-slate-700">
                          <td className="px-4 py-3 text-white">{tank.genSize}</td>
                          <td className="px-4 py-3 text-green-400 font-semibold">{tank.capacity}</td>
                          <td className="px-4 py-3 text-slate-300">{tank.runtime}</td>
                          <td className="px-4 py-3 text-slate-400">{tank.dimensions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Automation */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-blue-400 mb-4">Tank Automation Components</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {TANK_SPECS.automation.map(item => (
                    <div key={item.component} className="bg-slate-700/50 rounded-lg p-4">
                      <h4 className="text-white font-bold">{item.component}</h4>
                      <div className="mt-2 space-y-1 text-sm">
                        <div><span className="text-slate-400">Type:</span> <span className="text-slate-300">{item.type}</span></div>
                        <div><span className="text-slate-400">Function:</span> <span className="text-green-400">{item.function}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bund Requirements */}
              <div className="bg-slate-800 rounded-xl p-6 border border-red-500/30">
                <h3 className="text-xl font-bold text-red-400 mb-4">Bund Requirements (NEMA/NFPA)</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-white font-semibold">Capacity</h4>
                    <p className="text-slate-300">{TANK_SPECS.bund_requirements.capacity}</p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Material</h4>
                    <p className="text-slate-300">{TANK_SPECS.bund_requirements.material}</p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Slope</h4>
                    <p className="text-slate-300">{TANK_SPECS.bund_requirements.slope}</p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Accessories</h4>
                    <ul className="text-slate-300 text-sm">
                      {TANK_SPECS.bund_requirements.accessories.map(acc => <li key={acc}>• {acc}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'mdb' && (
            <motion.div key="mdb" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <h2 className="text-2xl font-bold text-white">Main Distribution Board Specifications</h2>

              {/* Enclosures */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-blue-400 mb-4">Enclosure IP Ratings</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {MDB_SPECS.enclosures.map(enc => (
                    <div key={enc.type} className="bg-slate-700/50 rounded-lg p-4">
                      <h4 className="text-2xl font-bold text-blue-400">{enc.type}</h4>
                      <p className="text-white font-semibold mt-2">{enc.application}</p>
                      <p className="text-slate-400 text-sm">{enc.features}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Busbar Sizing */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-blue-400 mb-4">Copper Busbar Sizing</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-blue-400">Current Rating</th>
                        <th className="px-4 py-3 text-left text-blue-400">Busbar Size</th>
                        <th className="px-4 py-3 text-left text-blue-400">Arrangement</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MDB_SPECS.busbars.map(bar => (
                        <tr key={bar.rating} className="border-t border-slate-700">
                          <td className="px-4 py-3 text-white font-semibold">{bar.rating}</td>
                          <td className="px-4 py-3 text-green-400">{bar.size}</td>
                          <td className="px-4 py-3 text-slate-300">{bar.arrangement}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Components */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-blue-400 mb-4">Panel Components</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {MDB_SPECS.components.map(cat => (
                    <div key={cat.category} className="bg-slate-700/50 rounded-lg p-4">
                      <h4 className="text-white font-bold">{cat.category}</h4>
                      <ul className="text-slate-300 text-sm mt-2">
                        {cat.items.map(item => <li key={item}>• {item}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'faults' && (
            <motion.div key="faults" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Fabrication Fault Codes</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {FABRICATION_FAULTS.map(fault => (
                  <div
                    key={fault.code}
                    onClick={() => setSelectedFault(fault)}
                    className={`bg-slate-800 rounded-xl p-4 border cursor-pointer transition-all hover:scale-[1.02] ${
                      fault.severity === 'Critical' ? 'border-red-500/50' :
                      fault.severity === 'High' ? 'border-orange-500/50' :
                      'border-yellow-500/50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono font-bold text-blue-400">{fault.code}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        fault.severity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                        fault.severity === 'High' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>{fault.severity}</span>
                    </div>
                    <h3 className="text-white font-semibold">{fault.name}</h3>
                    <p className="text-slate-400 text-sm">{fault.category}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* REPAIR MANUALS */}
          {activeTab === 'repair' && (
            <motion.div key="repair" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Repair Manuals</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {FABRICATION_REPAIR_MANUALS.map(manual => (
                  <div
                    key={manual.id}
                    className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500 cursor-pointer transition-all"
                    onClick={() => setSelectedRepairManual(manual)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="text-xs font-mono text-blue-400">{manual.id}</span>
                        <h3 className="text-xl font-bold text-white">{manual.title}</h3>
                        <span className="text-sm text-slate-400">{manual.category}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        manual.difficulty === 'Advanced' ? 'bg-red-500/20 text-red-400' :
                        manual.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>{manual.difficulty}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-sm text-slate-400">Time: {manual.timeRequired}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {manual.tools.slice(0, 4).map(tool => (
                        <span key={tool} className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">{tool}</span>
                      ))}
                      {manual.tools.length > 4 && <span className="text-xs text-slate-400">+{manual.tools.length - 4} more</span>}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* PARTS CATALOGUE */}
          {activeTab === 'parts' && (
            <motion.div key="parts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Parts Catalogue with Kenya Suppliers</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.keys(FABRICATION_PARTS_CATALOGUE).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedPartsCategory(cat)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedPartsCategory === cat ? 'bg-blue-500 text-white' : 'bg-slate-700 text-white hover:bg-slate-600'
                    }`}
                  >
                    {cat.replace(/([A-Z])/g, ' $1').trim()}
                  </button>
                ))}
              </div>
              <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                <table className="w-full">
                  <thead className="bg-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-white">Part Number</th>
                      <th className="px-4 py-3 text-left text-white">Description</th>
                      <th className="px-4 py-3 text-left text-white">Brand</th>
                      <th className="px-4 py-3 text-left text-white">Price (KES)</th>
                      <th className="px-4 py-3 text-left text-white">Application</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(FABRICATION_PARTS_CATALOGUE[selectedPartsCategory as keyof typeof FABRICATION_PARTS_CATALOGUE] || []).map((part: { partNumber: string; description: string; brand: string; priceKES: number; application: string }) => (
                      <tr key={part.partNumber} className="border-t border-slate-700 hover:bg-slate-700/50">
                        <td className="px-4 py-3 font-mono text-blue-400">{part.partNumber}</td>
                        <td className="px-4 py-3 text-white">{part.description}</td>
                        <td className="px-4 py-3 text-slate-300">{part.brand}</td>
                        <td className="px-4 py-3 text-green-400 font-bold">KES {part.priceKES.toLocaleString()}</td>
                        <td className="px-4 py-3 text-slate-400">{part.application}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-bold text-white mb-4">Kenya Suppliers</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {FABRICATION_KENYA_SUPPLIERS.map(supplier => (
                    <div key={supplier.name} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                      <h4 className="font-bold text-white">{supplier.name}</h4>
                      <p className="text-slate-400 text-sm">{supplier.location}</p>
                      <p className="text-blue-400 text-sm">{supplier.specialization}</p>
                      <p className="text-slate-500 text-xs mt-2">{supplier.phone}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* MAINTENANCE SCHEDULES */}
          {activeTab === 'maintenance' && (
            <motion.div key="maintenance" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Maintenance Schedules</h2>
              {Object.entries(FABRICATION_MAINTENANCE_SCHEDULES).map(([areaType, schedule]) => (
                <div key={areaType} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-xl font-bold text-blue-400 mb-4 capitalize">{areaType.replace(/([A-Z])/g, ' $1').trim()}</h3>
                  {Object.entries(schedule).map(([period, tasks]) => (
                    <div key={period} className="mb-4">
                      <h4 className={`font-semibold mb-2 ${
                        period === 'daily' ? 'text-green-400' :
                        period === 'weekly' ? 'text-yellow-400' :
                        period === 'monthly' ? 'text-orange-400' :
                        'text-red-400'
                      }`}>{period.charAt(0).toUpperCase() + period.slice(1)}</h4>
                      <div className="grid md:grid-cols-2 gap-2">
                        {(tasks as Array<{task: string; procedure: string; tools: string[]}>).map((item, idx) => (
                          <div key={idx} className="bg-slate-700/50 rounded-lg p-3">
                            <p className="text-white font-medium">{item.task}</p>
                            <p className="text-slate-400 text-sm">{item.procedure}</p>
                            <p className="text-blue-400 text-xs">Tools: {item.tools.join(', ')}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Repair Manual Modal */}
      <AnimatePresence>
        {selectedRepairManual && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto"
            onClick={() => setSelectedRepairManual(null)}
          >
            <div className="min-h-screen py-8 px-4">
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="max-w-4xl mx-auto bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-mono text-white/70">{selectedRepairManual.id}</span>
                      <h2 className="text-2xl font-bold text-white">{selectedRepairManual.title}</h2>
                      <p className="text-white/80">{selectedRepairManual.category} | {selectedRepairManual.difficulty} | {selectedRepairManual.timeRequired}</p>
                    </div>
                    <button onClick={() => setSelectedRepairManual(null)} className="text-white/80 hover:text-white text-2xl">&times;</button>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <h3 className="font-bold text-red-400 mb-2">Safety Warnings</h3>
                    <ul className="list-disc list-inside text-red-300 space-y-1">
                      {selectedRepairManual.safetyWarnings.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-2">Tools Required</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedRepairManual.tools.map(t => <span key={t} className="px-3 py-1 bg-slate-700 rounded-full text-sm text-slate-300">{t}</span>)}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-4">Step-by-Step Procedure</h3>
                    <div className="space-y-4">
                      {selectedRepairManual.steps.map(step => (
                        <div key={step.step} className="bg-slate-700/50 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">{step.step}</span>
                            <h4 className="font-bold text-white">{step.title}</h4>
                          </div>
                          <p className="text-slate-300 ml-11">{step.description}</p>
                          <p className="text-slate-400 text-sm ml-11 mt-1">{step.details}</p>
                          {step.caution && <p className="text-yellow-400 text-sm ml-11 mt-1">Caution: {step.caution}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-2">Verification Checklist</h3>
                    <div className="grid md:grid-cols-2 gap-2">
                      {selectedRepairManual.verification.map((v, i) => (
                        <div key={i} className="flex items-center gap-2 bg-green-500/10 rounded-lg p-2">
                          <span className="text-green-400">✓</span>
                          <span className="text-green-300">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fault Modal */}
      <AnimatePresence>
        {selectedFault && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 overflow-y-auto"
            onClick={() => setSelectedFault(null)}
          >
            <div className="min-h-screen py-8 px-4">
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="max-w-4xl mx-auto bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className={`p-6 ${
                  selectedFault.severity === 'Critical' ? 'bg-red-600' :
                  selectedFault.severity === 'High' ? 'bg-orange-600' :
                  'bg-yellow-600'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-3xl font-mono font-bold text-white">{selectedFault.code}</span>
                      <h2 className="text-2xl font-bold text-white mt-2">{selectedFault.name}</h2>
                    </div>
                    <button onClick={() => setSelectedFault(null)} className="text-white/80 hover:text-white text-2xl">✕</button>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h4 className="text-blue-400 font-bold">Symptoms</h4>
                    <ul className="text-slate-300">{selectedFault.symptoms.map(s => <li key={s}>• {s}</li>)}</ul>
                  </div>
                  <div>
                    <h4 className="text-orange-400 font-bold">Causes</h4>
                    <ul className="text-slate-300">{selectedFault.causes.map(c => <li key={c}>• {c}</li>)}</ul>
                  </div>
                  <div>
                    <h4 className="text-green-400 font-bold">Repair Steps</h4>
                    <ul className="text-slate-300">{selectedFault.repair.map(r => <li key={r}>• {r}</li>)}</ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
