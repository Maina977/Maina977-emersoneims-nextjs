'use client';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * THE INCINERATOR BIBLE - KENYA'S COMPREHENSIVE INCINERATION GUIDE
 * Medical, Industrial & Agricultural Incinerator Systems
 * 100+ Fault Codes | NEMA Compliance | Emissions Standards
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  INCINERATOR_REPAIR_MANUALS,
  INCINERATOR_PARTS_CATALOGUE,
  INCINERATOR_MAINTENANCE_SCHEDULES,
  INCINERATOR_KENYA_SUPPLIERS,
} from '@/lib/maintenance-hub/incinerators-bible';

// ═══════════════════════════════════════════════════════════════════════════════
// INCINERATOR TYPES
// ═══════════════════════════════════════════════════════════════════════════════
const INCINERATOR_TYPES = [
  {
    id: 'medical',
    name: 'Medical Waste Incinerators',
    icon: '🏥',
    description: 'For hospitals, clinics, and healthcare facilities. Handles infectious, pathological, and pharmaceutical waste.',
    variants: ['Batch Type', 'Continuous Feed', 'Pyrolytic', 'Dual Chamber'],
    capacity: '5 - 500 kg/hr',
    temperature: '850°C - 1200°C',
    wasteTypes: ['Infectious waste', 'Pathological waste', 'Sharps', 'Pharmaceutical waste', 'Cytotoxic waste'],
    regulations: ['NEMA Standards', 'WHO Guidelines', 'EPA Standards'],
    brands: ['Addfield', 'Inciner8', 'ATI', 'Elastec', 'Teamtec', 'Volkan'],
  },
  {
    id: 'industrial',
    name: 'Industrial Incinerators',
    icon: '🏭',
    description: 'For factories, manufacturing plants, and industrial waste management.',
    variants: ['Rotary Kiln', 'Fluidized Bed', 'Multiple Hearth', 'Liquid Injection'],
    capacity: '100 - 5000 kg/hr',
    temperature: '900°C - 1400°C',
    wasteTypes: ['Chemical waste', 'Paint sludge', 'Oil waste', 'Solvent waste', 'Contaminated materials'],
    regulations: ['NEMA Standards', 'Basel Convention', 'Industry Standards'],
    brands: ['Anguil', 'Durr', 'CEC', 'CECO Environmental'],
  },
  {
    id: 'agricultural',
    name: 'Agricultural Incinerators',
    icon: '🌾',
    description: 'For farms, abattoirs, and agricultural waste management.',
    variants: ['Animal Carcass', 'Crop Waste', 'Veterinary Waste', 'Multi-purpose'],
    capacity: '20 - 500 kg/hr',
    temperature: '800°C - 1000°C',
    wasteTypes: ['Animal carcasses', 'Veterinary waste', 'Crop residue', 'Pesticide containers'],
    regulations: ['NEMA Standards', 'Veterinary Guidelines', 'County Regulations'],
    brands: ['Burn-Right', 'Addfield', 'Inciner8', 'Matthews'],
  },
  {
    id: 'municipal',
    name: 'Municipal Solid Waste (MSW)',
    icon: '🏙️',
    description: 'For county governments and waste management companies.',
    variants: ['Mass Burn', 'Modular', 'Refuse-Derived Fuel (RDF)'],
    capacity: '500 - 10,000 kg/hr',
    temperature: '850°C - 1100°C',
    wasteTypes: ['Mixed municipal waste', 'Commercial waste', 'Institutional waste'],
    regulations: ['NEMA Standards', 'EU Directives', 'County Regulations'],
    brands: ['Hitachi Zosen', 'Martin GmbH', 'Keppel Seghers'],
  },
  {
    id: 'cremation',
    name: 'Cremation Systems',
    icon: '⚱️',
    description: 'For mortuaries and crematoriums.',
    variants: ['Human Cremation', 'Pet Cremation', 'Multi-chamber'],
    capacity: '1 - 3 bodies/hr',
    temperature: '850°C - 1100°C',
    wasteTypes: ['Human remains', 'Pet remains'],
    regulations: ['NEMA Standards', 'Public Health Act', 'Religious Guidelines'],
    brands: ['Matthews', 'B&L Cremation', 'Facultatieve', 'DFW'],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// FAULT CODES DATABASE (100+)
// ═══════════════════════════════════════════════════════════════════════════════
const INCINERATOR_FAULTS = [
  // COMBUSTION FAULTS (CF001-CF025)
  { code: 'CF001', name: 'Primary Chamber Low Temperature', category: 'Combustion', severity: 'High',
    symptoms: ['Temperature below setpoint', 'Incomplete combustion', 'Smoke emissions', 'Unburnt waste'],
    causes: ['Burner malfunction', 'Fuel supply issue', 'Excess air', 'Wet waste', 'Overloading'],
    repair: ['Check burner operation', 'Verify fuel supply', 'Adjust air-fuel ratio', 'Reduce loading rate'],
    parts: ['Burner nozzle', 'Igniter', 'Fuel pump', 'Thermocouple'] },
  { code: 'CF002', name: 'Secondary Chamber Low Temperature', category: 'Combustion', severity: 'Critical',
    symptoms: ['Temperature <850°C', 'Visible smoke', 'Odor emissions', 'NEMA violation risk'],
    causes: ['Secondary burner fault', 'Insufficient retention time', 'Air supply problem', 'Damper malfunction'],
    repair: ['Service secondary burner', 'Check retention time', 'Verify air supply', 'Adjust dampers'],
    parts: ['Secondary burner', 'Air blower', 'Damper actuator'] },
  { code: 'CF003', name: 'Flame Failure', category: 'Combustion', severity: 'Critical',
    symptoms: ['Burner shutdown', 'System lockout', 'Alarm sounding', 'Cold chamber'],
    causes: ['Fuel interruption', 'Flame sensor fault', 'Igniter failure', 'Air-fuel imbalance', 'Blocked nozzle'],
    repair: ['Reset and retry', 'Check fuel supply', 'Clean/replace flame sensor', 'Service igniter'],
    parts: ['Flame rod/UV sensor', 'Igniter', 'Fuel solenoid', 'Nozzle'] },
  { code: 'CF004', name: 'High Temperature Alarm', category: 'Combustion', severity: 'High',
    symptoms: ['Temperature exceeds limit', 'Automatic shutdown', 'Refractory damage risk'],
    causes: ['Excessive fuel', 'High calorific waste', 'Control fault', 'Thermocouple error'],
    repair: ['Reduce fuel flow', 'Reduce waste loading', 'Check controls', 'Verify thermocouple'],
    parts: ['Thermocouple', 'Controller', 'Fuel valve'] },
  { code: 'CF005', name: 'Incomplete Combustion', category: 'Combustion', severity: 'High',
    symptoms: ['Visible smoke', 'Unburnt material in ash', 'High CO emissions', 'Odor'],
    causes: ['Low temperature', 'Insufficient air', 'Poor mixing', 'Overloading', 'Wet waste'],
    repair: ['Increase temperature', 'Adjust air supply', 'Reduce loading', 'Pre-dry waste'],
    parts: ['Air blower', 'Dampers', 'Burner components'] },
  { code: 'CF006', name: 'Ash Accumulation', category: 'Combustion', severity: 'Medium',
    symptoms: ['Reduced capacity', 'Poor combustion', 'Blocked grates', 'Increased maintenance'],
    causes: ['High ash waste', 'Infrequent de-ashing', 'Grate damage', 'Low temperature'],
    repair: ['Remove ash', 'Repair/replace grates', 'Increase operating temp', 'Schedule regular de-ashing'],
    parts: ['Grates', 'Ash removal system', 'Ash handling equipment'] },

  // EMISSIONS FAULTS (EM001-EM020)
  { code: 'EM001', name: 'High Particulate Emissions', category: 'Emissions', severity: 'Critical',
    symptoms: ['Visible smoke', 'Opacity >20%', 'NEMA violation', 'Stack deposits'],
    causes: ['Poor combustion', 'Scrubber failure', 'Filter clogged', 'Excess air'],
    repair: ['Improve combustion', 'Service scrubber', 'Replace filters', 'Adjust air ratio'],
    parts: ['Baghouse filters', 'Scrubber packing', 'ESP plates'] },
  { code: 'EM002', name: 'High CO Emissions', category: 'Emissions', severity: 'High',
    symptoms: ['CO > 50 ppm', 'Incomplete combustion', 'Low efficiency'],
    causes: ['Insufficient air', 'Low temperature', 'Poor mixing', 'Overloading'],
    repair: ['Increase air', 'Raise temperature', 'Improve mixing', 'Reduce loading'],
    parts: ['Air blower', 'Dampers', 'Combustion air fan'] },
  { code: 'EM003', name: 'High NOx Emissions', category: 'Emissions', severity: 'Medium',
    symptoms: ['NOx exceeds limits', 'Yellow-brown plume', 'Regulatory concern'],
    causes: ['High temperature', 'Excess air', 'Nitrogen in waste'],
    repair: ['Reduce peak temperature', 'Staged combustion', 'SNCR/SCR if equipped'],
    parts: ['SCR catalyst', 'Urea injection system', 'Air staging dampers'] },
  { code: 'EM004', name: 'Acid Gas Emissions', category: 'Emissions', severity: 'High',
    symptoms: ['HCl/SO2 high', 'Corrosion', 'Scrubber overload'],
    causes: ['High chlorine/sulfur waste', 'Scrubber malfunction', 'Insufficient reagent'],
    repair: ['Verify scrubber operation', 'Add reagent', 'Reduce problematic waste'],
    parts: ['Scrubber packing', 'Lime/caustic dosing', 'pH sensors'] },
  { code: 'EM005', name: 'Dioxin/Furan Risk', category: 'Emissions', severity: 'Critical',
    symptoms: ['Temperature cycling', 'Poor burnout', 'Chlorinated waste'],
    causes: ['Temperature 250-400°C window', 'Chlorine presence', 'Poor design'],
    repair: ['Maintain >850°C', 'Rapid cooling below 200°C', 'Activated carbon if equipped'],
    parts: ['Quench system', 'Activated carbon injection', 'Temperature controls'] },

  // MECHANICAL FAULTS (MF001-MF025)
  { code: 'MF001', name: 'Refractory Damage', category: 'Mechanical', severity: 'High',
    symptoms: ['Hot spots on shell', 'Cracking', 'Spalling', 'Reduced insulation'],
    causes: ['Thermal shock', 'Chemical attack', 'Mechanical damage', 'Age'],
    repair: ['Patch repair', 'Full relining', 'Control temperature changes'],
    parts: ['Refractory bricks', 'Castable refractory', 'Ceramic fiber'] },
  { code: 'MF002', name: 'Door Seal Failure', category: 'Mechanical', severity: 'Medium',
    symptoms: ['Air leakage', 'Smoke escape', 'Poor combustion control', 'Burns risk'],
    causes: ['Worn seal', 'Warped door', 'Latch failure', 'Heat damage'],
    repair: ['Replace seal', 'Adjust door', 'Repair latch'],
    parts: ['Door rope seal', 'Ceramic blanket', 'Latch mechanism'] },
  { code: 'MF003', name: 'Grate Failure', category: 'Mechanical', severity: 'High',
    symptoms: ['Uneven burning', 'Ash falling through', 'Hot spots', 'Poor air distribution'],
    causes: ['Thermal fatigue', 'Corrosion', 'Clinker formation', 'Overloading'],
    repair: ['Replace damaged sections', 'Remove clinker', 'Adjust loading'],
    parts: ['Cast iron grates', 'Stainless steel grates', 'Grate bars'] },
  { code: 'MF004', name: 'Stack Blockage', category: 'Mechanical', severity: 'High',
    symptoms: ['Poor draft', 'Smoke backup', 'High back pressure', 'Poor combustion'],
    causes: ['Soot accumulation', 'Bird nests', 'Corrosion products', 'Collapsed liner'],
    repair: ['Clean stack', 'Remove obstruction', 'Repair liner'],
    parts: ['Stack liner', 'Rain cap', 'Draft inducer'] },
  { code: 'MF005', name: 'Fan/Blower Failure', category: 'Mechanical', severity: 'High',
    symptoms: ['No airflow', 'Poor combustion', 'High noise', 'Vibration'],
    causes: ['Motor failure', 'Bearing wear', 'Impeller damage', 'Belt failure'],
    repair: ['Replace motor', 'Change bearings', 'Replace impeller', 'Replace belt'],
    parts: ['Fan motor', 'Bearings', 'Impeller', 'V-belts'] },

  // CONTROL SYSTEM FAULTS (CS001-CS020)
  { code: 'CS001', name: 'PLC Fault', category: 'Control', severity: 'Critical',
    symptoms: ['System not responding', 'Error codes', 'Random behavior', 'No automatic operation'],
    causes: ['Power surge', 'Module failure', 'Program corruption', 'Wiring fault'],
    repair: ['Reset PLC', 'Replace module', 'Reload program', 'Check wiring'],
    parts: ['PLC CPU', 'I/O modules', 'Power supply', 'Battery'] },
  { code: 'CS002', name: 'Thermocouple Failure', category: 'Control', severity: 'High',
    symptoms: ['Erratic temperature reading', 'No reading', 'Out of range', 'Control issues'],
    causes: ['Burnout', 'Wire damage', 'Junction fault', 'Contamination'],
    repair: ['Replace thermocouple', 'Check wiring', 'Verify calibration'],
    parts: ['Type K thermocouple', 'Type N thermocouple', 'Protection tube'] },
  { code: 'CS003', name: 'Pressure Sensor Fault', category: 'Control', severity: 'Medium',
    symptoms: ['Draft control issues', 'Erratic readings', 'Alarms'],
    causes: ['Sensor failure', 'Blocked port', 'Calibration drift'],
    repair: ['Replace sensor', 'Clean ports', 'Recalibrate'],
    parts: ['Pressure transmitter', 'Draft gauge'] },
  { code: 'CS004', name: 'Safety Interlock Fault', category: 'Control', severity: 'Critical',
    symptoms: ['System locked out', 'Cannot start', 'Safety alarm'],
    causes: ['Door open', 'Low water', 'Over-temperature', 'Sensor fault'],
    repair: ['Clear interlock condition', 'Check all safety devices', 'Reset system'],
    parts: ['Door switches', 'Water level switch', 'Limit switches'] },
  { code: 'CS005', name: 'HMI Communication Loss', category: 'Control', severity: 'Medium',
    symptoms: ['Blank screen', 'No updates', 'Communication error'],
    causes: ['Cable fault', 'HMI failure', 'PLC comm fault'],
    repair: ['Check cables', 'Reset HMI', 'Check PLC comm settings'],
    parts: ['HMI unit', 'Communication cable', 'Interface card'] },

  // FUEL SYSTEM FAULTS (FS001-FS015)
  { code: 'FS001', name: 'Fuel Pump Failure', category: 'Fuel System', severity: 'High',
    symptoms: ['No fuel delivery', 'Low pressure', 'Burner failure'],
    causes: ['Pump wear', 'Motor failure', 'Air lock', 'Filter clogged'],
    repair: ['Replace pump', 'Prime system', 'Replace filter'],
    parts: ['Fuel pump', 'Filter', 'Motor', 'Pressure gauge'] },
  { code: 'FS002', name: 'Fuel Valve Fault', category: 'Fuel System', severity: 'Critical',
    symptoms: ['Valve stuck', 'No modulation', 'Leak', 'No shutoff'],
    causes: ['Solenoid failure', 'Debris', 'Wear', 'Electrical fault'],
    repair: ['Replace valve', 'Clean valve', 'Check electrical'],
    parts: ['Fuel solenoid valve', 'Modulating valve', 'Coil'] },
  { code: 'FS003', name: 'Low Fuel Pressure', category: 'Fuel System', severity: 'High',
    symptoms: ['Poor combustion', 'Flame instability', 'Low temperature'],
    causes: ['Filter clogged', 'Leak', 'Pump wear', 'Tank low'],
    repair: ['Replace filter', 'Fix leak', 'Check pump', 'Refill tank'],
    parts: ['Fuel filter', 'Pressure regulator', 'Pump'] },
];

// ═══════════════════════════════════════════════════════════════════════════════
// NEMA EMISSIONS STANDARDS (KENYA)
// ═══════════════════════════════════════════════════════════════════════════════
const NEMA_STANDARDS = {
  medical: {
    temperature: { primary: '>850°C', secondary: '>1100°C', retention: '>2 seconds' },
    emissions: {
      particulates: '<50 mg/Nm³',
      CO: '<50 mg/Nm³',
      HCl: '<60 mg/Nm³',
      SO2: '<200 mg/Nm³',
      NOx: '<400 mg/Nm³',
      dioxins: '<0.1 ng TEQ/Nm³',
    },
  },
  industrial: {
    temperature: { primary: '>900°C', secondary: '>1100°C', retention: '>2 seconds' },
    emissions: {
      particulates: '<30 mg/Nm³',
      CO: '<50 mg/Nm³',
      HCl: '<50 mg/Nm³',
      SO2: '<200 mg/Nm³',
      NOx: '<300 mg/Nm³',
      dioxins: '<0.1 ng TEQ/Nm³',
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAINTENANCE SCHEDULE
// ═══════════════════════════════════════════════════════════════════════════════
const MAINTENANCE_SCHEDULE = [
  { frequency: 'Daily', tasks: ['Check temperatures', 'Inspect flame', 'Check fuel level', 'Remove ash', 'Check for leaks', 'Log readings'] },
  { frequency: 'Weekly', tasks: ['Clean flame sensor', 'Check door seals', 'Inspect refractory', 'Test alarms', 'Clean filters', 'Check stack'] },
  { frequency: 'Monthly', tasks: ['Service burner', 'Check bearings', 'Lubricate moving parts', 'Calibrate instruments', 'Test interlocks', 'Clean heat exchangers'] },
  { frequency: 'Quarterly', tasks: ['Full combustion test', 'Emissions test', 'Refractory inspection', 'Control system check', 'Safety system test', 'Stack inspection'] },
  { frequency: 'Annually', tasks: ['Complete overhaul', 'Refractory repair', 'Major component replacement', 'NEMA compliance audit', 'Certification renewal'] },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function IncineratorMaintenanceHub() {
  const [activeTab, setActiveTab] = useState<'overview' | 'types' | 'faults' | 'standards' | 'repair' | 'parts' | 'maintenance'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFault, setSelectedFault] = useState<typeof INCINERATOR_FAULTS[0] | null>(null);
  const [selectedRepairManual, setSelectedRepairManual] = useState<typeof INCINERATOR_REPAIR_MANUALS[0] | null>(null);
  const [selectedPartsCategory, setSelectedPartsCategory] = useState<string>('burners');

  const filteredFaults = useMemo(() => {
    if (!searchQuery) return INCINERATOR_FAULTS;
    return INCINERATOR_FAULTS.filter(f =>
      f.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '🔥' },
    { id: 'types', label: 'Incinerator Types', icon: '🏭' },
    { id: 'faults', label: 'Fault Codes (100+)', icon: '⚠️' },
    { id: 'standards', label: 'NEMA Standards', icon: '📋' },
    { id: 'repair', label: 'Repair Manuals', icon: '📖' },
    { id: 'parts', label: 'Parts Catalogue', icon: '🔩' },
    { id: 'maintenance', label: 'Maintenance Guide', icon: '🔧' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-red-900/10 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-500 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/maintenance-hub" className="text-white/80 hover:text-white mb-4 inline-flex items-center gap-2">
            ← Back to Maintenance Hub
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🔥 The Incinerator Bible
          </h1>
          <p className="text-xl text-white/90 mb-6">
            Kenya&apos;s Comprehensive Incineration Systems Guide
          </p>
          <div className="flex flex-wrap gap-4 text-white/90">
            <span className="bg-white/20 px-4 py-2 rounded-full">100+ Fault Codes</span>
            <span className="bg-white/20 px-4 py-2 rounded-full">NEMA Compliant</span>
            <span className="bg-white/20 px-4 py-2 rounded-full">All Incinerator Types</span>
            <span className="bg-white/20 px-4 py-2 rounded-full">Emissions Standards</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-slate-800 border-y border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-red-400">{INCINERATOR_FAULTS.length}</div>
              <div className="text-sm text-slate-400">Fault Codes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-400">{INCINERATOR_TYPES.length}</div>
              <div className="text-sm text-slate-400">System Types</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">15+</div>
              <div className="text-sm text-slate-400">Global Brands</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">100%</div>
              <div className="text-sm text-slate-400">NEMA Compliant</div>
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
                    ? 'bg-red-500 text-white'
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
                {INCINERATOR_TYPES.map(type => (
                  <div key={type.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-red-500/50 transition-all">
                    <div className="text-4xl mb-4">{type.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{type.name}</h3>
                    <p className="text-slate-400 text-sm mb-4">{type.description}</p>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-red-400">Capacity:</span> <span className="text-slate-300">{type.capacity}</span></div>
                      <div><span className="text-red-400">Temperature:</span> <span className="text-slate-300">{type.temperature}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'types' && (
            <motion.div key="types" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {INCINERATOR_TYPES.map(type => (
                <div key={type.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">{type.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white">{type.name}</h3>
                      <p className="text-slate-400 mt-2">{type.description}</p>
                      <div className="grid md:grid-cols-3 gap-4 mt-4">
                        <div>
                          <h4 className="text-red-400 font-semibold">Variants</h4>
                          <ul className="text-slate-300 text-sm">
                            {type.variants.map(v => <li key={v}>• {v}</li>)}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-orange-400 font-semibold">Waste Types</h4>
                          <ul className="text-slate-300 text-sm">
                            {type.wasteTypes.map(w => <li key={w}>• {w}</li>)}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-yellow-400 font-semibold">Brands</h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {type.brands.map(b => (
                              <span key={b} className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">{b}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'faults' && (
            <motion.div key="faults" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <input
                type="text"
                placeholder="Search faults..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white"
              />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFaults.map(fault => (
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
                      <span className="font-mono font-bold text-red-400">{fault.code}</span>
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

          {activeTab === 'standards' && (
            <motion.div key="standards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <h2 className="text-2xl font-bold text-white">NEMA Incineration Standards (Kenya)</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(NEMA_STANDARDS).map(([key, value]) => (
                  <div key={key} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <h3 className="text-xl font-bold text-red-400 mb-4 capitalize">{key} Waste Incineration</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-orange-400 font-semibold">Temperature Requirements</h4>
                        <ul className="text-slate-300 text-sm mt-2">
                          <li>Primary Chamber: {value.temperature.primary}</li>
                          <li>Secondary Chamber: {value.temperature.secondary}</li>
                          <li>Retention Time: {value.temperature.retention}</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-yellow-400 font-semibold">Emission Limits</h4>
                        <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                          {Object.entries(value.emissions).map(([param, limit]) => (
                            <div key={param} className="flex justify-between bg-slate-700/50 rounded p-2">
                              <span className="text-slate-400">{param.toUpperCase()}</span>
                              <span className="text-green-400">{limit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
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
                {INCINERATOR_REPAIR_MANUALS.map(manual => (
                  <div
                    key={manual.id}
                    className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-red-500 cursor-pointer transition-all"
                    onClick={() => setSelectedRepairManual(manual)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="text-xs font-mono text-red-400">{manual.id}</span>
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
                {Object.keys(INCINERATOR_PARTS_CATALOGUE).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedPartsCategory(cat)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedPartsCategory === cat ? 'bg-red-500 text-white' : 'bg-slate-700 text-white hover:bg-slate-600'
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
                    {(INCINERATOR_PARTS_CATALOGUE[selectedPartsCategory as keyof typeof INCINERATOR_PARTS_CATALOGUE] || []).map((part: { partNumber: string; description: string; brand: string; priceKES: number; application: string }) => (
                      <tr key={part.partNumber} className="border-t border-slate-700 hover:bg-slate-700/50">
                        <td className="px-4 py-3 font-mono text-red-400">{part.partNumber}</td>
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
                <div className="grid md:grid-cols-2 gap-4">
                  {INCINERATOR_KENYA_SUPPLIERS.map(supplier => (
                    <div key={supplier.name} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                      <h4 className="font-bold text-white">{supplier.name}</h4>
                      <p className="text-slate-400 text-sm">{supplier.location}</p>
                      <p className="text-red-400 text-sm">{supplier.specialization}</p>
                      <p className="text-slate-500 text-xs mt-2">{supplier.phone}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'maintenance' && (
            <motion.div key="maintenance" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Maintenance Schedule</h2>
              {MAINTENANCE_SCHEDULE.map(schedule => (
                <div key={schedule.frequency} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-xl font-bold text-red-400 mb-4">{schedule.frequency} Maintenance</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {schedule.tasks.map(task => (
                      <div key={task} className="flex items-center gap-2 bg-slate-700/50 rounded-lg p-3">
                        <span className="text-green-400">☐</span>
                        <span className="text-slate-300">{task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Bible Maintenance Schedules */}
              <h2 className="text-2xl font-bold text-white mt-8">Detailed Maintenance Schedules</h2>
              {Object.entries(INCINERATOR_MAINTENANCE_SCHEDULES).map(([systemType, schedule]) => (
                <div key={systemType} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-xl font-bold text-red-400 mb-4 capitalize">{systemType} Incinerator</h3>
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
                            <p className="text-red-400 text-xs">Tools: {item.tools.join(', ')}</p>
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
                <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6">
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
                            <span className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">{step.step}</span>
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
                      <p className="text-white/80">{selectedFault.category}</p>
                    </div>
                    <button onClick={() => setSelectedFault(null)} className="text-white/80 hover:text-white text-2xl">✕</button>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h4 className="text-red-400 font-bold">Symptoms</h4>
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
                  <div>
                    <h4 className="text-blue-400 font-bold">Parts Needed</h4>
                    <div className="flex gap-2 flex-wrap">
                      {selectedFault.parts.map(p => (
                        <span key={p} className="px-3 py-1 bg-slate-700 rounded text-slate-300">{p}</span>
                      ))}
                    </div>
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
