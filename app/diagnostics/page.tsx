'use client';
const AdvancedGeneratorCalculator = dynamic(() => import('@/components/calculators/AdvancedGeneratorCalculator'), { 
  loading: () => <div className="p-4 text-center text-gray-400">Loading calculator...</div>,
  ssr: false 
});
const AdvancedSolarCalculator = dynamic(() => import('@/components/calculators/AdvancedSolarCalculator'), { 
  loading: () => <div className="p-4 text-center text-gray-400">Loading calculator...</div>,
  ssr: false 
});
const AdvancedHighVoltageCalculator = dynamic(() => import('@/components/calculators/AdvancedHighVoltageCalculator'), { 
  loading: () => <div className="p-4 text-center text-gray-400">Loading calculator...</div>,
  ssr: false 
});
const AdvancedMotorRewindingCalculator = dynamic(() => import('@/components/calculators/AdvancedMotorRewindingCalculator'), { 
  loading: () => <div className="p-4 text-center text-gray-400">Loading calculator...</div>,
  ssr: false 
});
const AdvancedACCalculator = dynamic(() => import('@/components/calculators/AdvancedACCalculator'), { 
  loading: () => <div className="p-4 text-center text-gray-400">Loading calculator...</div>,
  ssr: false 
});
const AdvancedUPSCalculator = dynamic(() => import('@/components/calculators/AdvancedUPSCalculator'), { 
  loading: () => <div className="p-4 text-center text-gray-400">Loading calculator...</div>,
  ssr: false 
});
const AdvancedBoreholePumpCalculator = dynamic(() => import('@/components/calculators/AdvancedBoreholePumpCalculator'), { 
  loading: () => <div className="p-4 text-center text-gray-400">Loading calculator...</div>,
  ssr: false 
});
const AdvancedFabricationCalculator = dynamic(() => import('@/components/calculators/AdvancedFabricationCalculator'), { 
  loading: () => <div className="p-4 text-center text-gray-400">Loading calculator...</div>,
  ssr: false 
});
const AdvancedIncineratorCalculator = dynamic(() => import('@/components/calculators/AdvancedIncineratorCalculator'), { 
  loading: () => <div className="p-4 text-center text-gray-400">Loading calculator...</div>,
  ssr: false 
});
                    <a 
                      href="https://wa.me/0768860665"
                      className="block w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded font-bold text-center"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp: 0768860665
                    </a>

const calculators = {
  'motor-rewinding': AdvancedMotorRewindingCalculator,
  'ac': AdvancedACCalculator,
  'ups': AdvancedUPSCalculator,
  'borehole': AdvancedBoreholePumpCalculator,
  'fabrication': AdvancedFabricationCalculator,
  'incinerators': AdvancedIncineratorCalculator,
};

// =====================================================
// 9 SERVICES DATA WITH Q&A, SUB-SERVICES, AND CTAs
// =====================================================

const NINE_SERVICES = [
  {
    id: 'generators',
    name: 'Generators',
    icon: '⚡',
    color: 'cyan',
    subServices: ['Controls', 'Engine', 'Electricals'],
    qaPairs: [
      { q: 'Generator fails to start?', a: 'Check battery (12.5V+), fuel level, oil level. Ensure fuel valve open.', severity: 'high', solutions: ['Charge/replace battery', 'Refill fuel', 'Check oil level', 'Bleed fuel system'] },
      { q: 'Generator starts but stops immediately?', a: 'Fuel starvation or faulty governor. Check fuel filter, pump, governor.', severity: 'high', solutions: ['Replace fuel filter', 'Test fuel pump (2.5-3.5 PSI)', 'Adjust governor linkage'] },
      { q: 'No power output?', a: 'Check AVR, alternator field winding, circuit breakers.', severity: 'critical', solutions: ['Test AVR output', 'Check alternator excitation', 'Reset breakers'] },
      { q: 'Generator overheating?', a: 'Check coolant, radiator, fan belt, thermostat.', severity: 'high', solutions: ['Top up coolant', 'Clean radiator fins', 'Adjust fan belt'] },
      { q: 'Excessive black smoke?', a: 'Rich fuel mixture or incomplete combustion.', severity: 'medium', solutions: ['Replace air filter', 'Clean injectors', 'Check timing'] },
      { q: 'Low oil pressure warning?', a: 'Check oil level immediately. Stop if below 20 PSI.', severity: 'critical', solutions: ['Add correct oil', 'Replace filter', 'Test sensor'] },
    ],
    calculator: {
      name: 'Generator Sizing Calculator',
      fields: ['Load (kW)', 'Power Factor', 'Safety Factor'],
      formula: 'Generator kVA = (Load × Safety Factor) / Power Factor'
    },
    gauges: [
      { label: 'Oil Pressure', value: 45, max: 80, unit: 'PSI', color: '#00ff00' },
      { label: 'Coolant Temp', value: 85, max: 120, unit: '°C', color: '#ffaa00' },
      { label: 'RPM', value: 1500, max: 2000, unit: 'RPM', color: '#00ffff' },
    ]
  },
  {
    id: 'solar',
    name: 'Solar Systems',
    icon: '☀️',
    color: 'yellow',
    subServices: ['Panels', 'Batteries', 'Inverter'],
    qaPairs: [
      { q: 'Panels not charging batteries?', a: 'Check orientation, shading, connections. Test voltage (18-22V for 12V system).', severity: 'high', solutions: ['Clean panels', 'Remove shading', 'Check charge controller'] },
      { q: 'Inverter showing error?', a: 'Common: overvoltage, undervoltage, overload, overtemperature.', severity: 'medium', solutions: ['Reduce AC load', 'Check battery voltage', 'Improve ventilation'] },
      { q: 'Battery draining quickly?', a: 'Test capacity (80%+ of rated Ah). Check parasitic loads.', severity: 'medium', solutions: ['Load test battery', 'Check phantom loads', 'Replace if 5+ years old'] },
      { q: 'Low panel output?', a: 'Degradation, dirt, or bypass diode failure.', severity: 'low', solutions: ['Clean panels', 'Test each panel', 'Check bypass diodes'] },
    ],
    calculator: {
      name: 'Solar Panel Calculator',
      fields: ['Daily Energy (kWh)', 'Sun Hours', 'Panel Wattage'],
      formula: 'Panels Needed = (Daily Energy × 1000) / (Panel Wattage × Sun Hours)'
    },
    gauges: [
      { label: 'Panel Voltage', value: 38, max: 50, unit: 'V', color: '#ffff00' },
      { label: 'Battery SOC', value: 85, max: 100, unit: '%', color: '#00ff00' },
      { label: 'Inverter Load', value: 65, max: 100, unit: '%', color: '#00ffff' },
    ]
  },
  {
    id: 'high-voltage',
    name: 'High Power Voltage & Infrastructure',
    icon: '🔌',
    color: 'red',
    subServices: [
      'Construction & Installation',
      'Erection of poles, towers, supports',
      'Stringing of conductors',
      'Underground cables installation',
      'Transformer & substation integration',
      'Connection & Distribution',
      'Service connections (residential, commercial, industrial)',
      'Metering and load balancing',
      'Renewable energy integration',
      'Maintenance & Repairs',
      'Routine inspections & fault detection',
      'Vegetation management',
      'Replacement of conductors, insulators, poles',
      'Emergency outage response',
      'Safety & Compliance',
      'Earthing & lightning protection',
      'National electrical code compliance',
      'Worker safety protocols',
      'Upgrades & Modernization',
      'Grid reinforcement',
      'Smart grid integration (IoT sensors)',
      'Energy efficiency improvements'
    ],
    qaPairs: [
      { q: 'Voltage drop in distribution?', a: 'Undersized cables, loose connections. Should be <3%.', severity: 'medium', solutions: ['Calculate cable size', 'Check terminations', 'Upgrade cables'] },
      { q: 'Transformer overheating?', a: 'Overload, poor ventilation, or internal fault.', severity: 'critical', solutions: ['Reduce load', 'Check cooling fans', 'Test oil quality'] },
      { q: 'Neutral-earth voltage high?', a: 'Poor neutral connection. Should be <2V.', severity: 'high', solutions: ['Check neutral continuity', 'Tighten connections', 'Balance loads'] },
      { q: 'Frequent outages?', a: 'Faulty protection, overloaded circuit, or external factors.', severity: 'high', solutions: ['Check protection settings', 'Balance loads', 'Inspect insulators'] },
    ],
    calculator: {
      name: 'Voltage Drop Calculator',
      fields: ['Current (A)', 'Cable Length (m)', 'Cable Size (mm²)'],
      formula: 'Voltage Drop = (2 × Length × Current × 0.0175) / Cable Size'
    },
    gauges: [
      { label: 'Line Voltage', value: 11000, max: 15000, unit: 'V', color: '#ff0000' },
      { label: 'Load Current', value: 250, max: 400, unit: 'A', color: '#ffaa00' },
      { label: 'Power Factor', value: 92, max: 100, unit: '%', color: '#00ff00' },
    ]
  },
  {
    id: 'motor-rewinding',
    name: 'Motor Rewinding',
    icon: '🔄',
    color: 'orange',
    subServices: ['Single Phase Motors', 'Three Phase Motors', 'Submersible Motors', 'DC Motors'],
    qaPairs: [
      { q: 'Motor not starting after rewind?', a: 'Check winding connections, insulation resistance (>1MΩ), rotation.', severity: 'high', solutions: ['Verify connections', 'Test insulation', 'Check centrifugal switch'] },
      { q: 'Motor overheating after rewind?', a: 'Wrong wire gauge, incorrect turns, or ventilation issues.', severity: 'high', solutions: ['Verify wire gauge', 'Count turns', 'Clean ventilation'] },
      { q: 'Motor running but low power?', a: 'Shorted turns, wrong configuration, or low voltage.', severity: 'medium', solutions: ['Test winding resistance', 'Verify delta/star', 'Check supply voltage'] },
      { q: 'Excessive vibration?', a: 'Unbalanced rotor, worn bearings, or misalignment.', severity: 'medium', solutions: ['Balance rotor', 'Replace bearings', 'Check alignment'] },
    ],
    calculator: {
      name: 'Motor Rewinding Calculator',
      fields: ['Motor HP', 'Voltage', 'Efficiency (%)'],
      formula: 'Full Load Amps = (HP × 746) / (Voltage × Efficiency × PF)'
    },
    gauges: [
      { label: 'Insulation', value: 500, max: 1000, unit: 'MΩ', color: '#00ff00' },
      { label: 'Winding Temp', value: 75, max: 120, unit: '°C', color: '#ffaa00' },
      { label: 'Vibration', value: 2, max: 10, unit: 'mm/s', color: '#00ffff' },
    ]
  },
  {
    id: 'ac',
    name: 'Air Conditioning',
    icon: '❄️',
    color: 'blue',
    subServices: ['Split Units', 'Central AC', 'Chillers', 'VRF Systems'],
    qaPairs: [
      { q: 'AC not cooling?', a: 'Check thermostat, air filter, refrigerant level, compressor.', severity: 'high', solutions: ['Replace filter', 'Check refrigerant (R410A: 118/250 PSI)', 'Clean condenser'] },
      { q: 'AC freezing up?', a: 'Low airflow or low refrigerant.', severity: 'medium', solutions: ['Turn off, let ice melt', 'Replace filter', 'Test refrigerant'] },
      { q: 'AC making loud noise?', a: 'Worn compressor, loose fan, or debris.', severity: 'medium', solutions: ['Tighten fan blades', 'Remove debris', 'Check compressor mounts'] },
      { q: 'AC tripping breaker?', a: 'Overload, short circuit, or compressor failure.', severity: 'high', solutions: ['Test amp draw', 'Check for shorts', 'Test capacitor'] },
    ],
    calculator: {
      name: 'AC Sizing Calculator (BTU)',
      fields: ['Room Area (m²)', 'Ceiling Height (m)', 'Sun Exposure Factor'],
      formula: 'BTU = Room Area × Ceiling Height × 337 × Sun Factor'
    },
    gauges: [
      { label: 'Suction PSI', value: 68, max: 150, unit: 'PSI', color: '#0088ff' },
      { label: 'Discharge PSI', value: 250, max: 400, unit: 'PSI', color: '#ff4444' },
      { label: 'Superheat', value: 12, max: 30, unit: '°F', color: '#00ff00' },
    ]
  },
  {
    id: 'ups',
    name: 'UPS Systems',
    icon: '🔋',
    color: 'purple',
    subServices: ['Online UPS', 'Offline UPS', 'Line Interactive', 'Modular UPS'],
    qaPairs: [
      { q: 'UPS not switching to battery?', a: 'Dead batteries, faulty transfer switch. Test battery (13.5V+).', severity: 'critical', solutions: ['Load test batteries', 'Replace if >3 years', 'Check connections'] },
      { q: 'UPS runtime very short?', a: 'Battery capacity degraded. Batteries last 3-5 years.', severity: 'high', solutions: ['Perform capacity test', 'Replace all batteries', 'Reduce load'] },
      { q: 'UPS showing overload?', a: 'Connected load exceeds UPS rating.', severity: 'medium', solutions: ['Calculate wattage', 'Remove non-essential devices', 'Upgrade UPS'] },
      { q: 'UPS making beeping noise?', a: 'On battery (normal) or fault condition.', severity: 'low', solutions: ['Check display', 'Restore mains', 'Run self-test'] },
    ],
    calculator: {
      name: 'UPS Runtime Calculator',
      fields: ['Battery Capacity (Ah)', 'Battery Voltage (V)', 'Load (W)'],
      formula: 'Runtime (hours) = (Capacity × Voltage × 0.8) / Load'
    },
    gauges: [
      { label: 'Battery V', value: 54, max: 60, unit: 'V', color: '#00ff00' },
      { label: 'Load', value: 45, max: 100, unit: '%', color: '#ffaa00' },
      { label: 'Runtime', value: 25, max: 60, unit: 'min', color: '#00ffff' },
    ]
  },
  {
    id: 'borehole',
    name: 'Borehole Pumps',
    icon: '💧',
    color: 'teal',
    subServices: ['Submersible Pumps', 'Jet Pumps', 'Solar Pumps', 'Pump Controllers'],
    qaPairs: [
      { q: 'Pump not delivering water?', a: 'Check water level, pump depth, foot valve, delivery pipe.', severity: 'high', solutions: ['Measure water level', 'Lower pump', 'Replace foot valve'] },
      { q: 'Pump tripping overload?', a: 'Motor overload, bearing failure, voltage issues.', severity: 'high', solutions: ['Measure current', 'Test insulation', 'Check for sand'] },
      { q: 'Low water pressure?', a: 'Worn impellers, blocked strainer, air in system.', severity: 'medium', solutions: ['Clean strainer', 'Bleed air', 'Replace impellers'] },
      { q: 'Pump cycling frequently?', a: 'Pressure tank waterlogged or faulty pressure switch.', severity: 'medium', solutions: ['Check tank air pressure', 'Adjust pressure switch', 'Replace bladder'] },
    ],
    calculator: {
      name: 'Pump Sizing Calculator',
      fields: ['Flow Rate (m³/h)', 'Total Head (m)', 'Efficiency (%)'],
      formula: 'Power (kW) = (Flow × Head × 9.81) / (3600 × Efficiency)'
    },
    gauges: [
      { label: 'Pressure', value: 3.5, max: 6, unit: 'Bar', color: '#00ffff' },
      { label: 'Flow Rate', value: 8, max: 15, unit: 'm³/h', color: '#00ff00' },
      { label: 'Motor Amps', value: 12, max: 20, unit: 'A', color: '#ffaa00' },
    ]
  },
  {
    id: 'fabrication',
    name: 'Fabrications',
    icon: '🔧',
    color: 'gray',
    subServices: ['Canopies', 'Hammer Mills', 'Generator Canopies', 'Exhaust Pipes', 'Fuel Reserve Tanks', 'Automations'],
    qaPairs: [
      { q: 'Canopy inadequate ventilation?', a: 'Inlet area = radiator × 1.5, outlet = inlet × 1.25.', severity: 'high', solutions: ['Enlarge inlet louvers', 'Add exhaust fans', 'Install roof vents'] },
      { q: 'Hammer mill excessive vibration?', a: 'Unbalanced rotor, worn bearings, loose hammers.', severity: 'high', solutions: ['Check hammer wear', 'Balance rotor', 'Replace bearings'] },
      { q: 'Fuel tank level sensor incorrect?', a: 'Calibration drift or sensor fouling.', severity: 'low', solutions: ['Clean sensor', 'Recalibrate', 'Check wiring'] },
      { q: 'Exhaust excessive back pressure?', a: 'Should be <75 mmH2O. Check blockages.', severity: 'high', solutions: ['Increase pipe diameter', 'Reduce bends', 'Clean soot'] },
    ],
    calculator: {
      name: 'Tank Capacity Calculator',
      fields: ['Length (m)', 'Width (m)', 'Height (m)'],
      formula: 'Capacity (Liters) = Length × Width × Height × 1000'
    },
    gauges: [
      { label: 'Fuel Level', value: 75, max: 100, unit: '%', color: '#ffaa00' },
      { label: 'Tank Temp', value: 28, max: 50, unit: '°C', color: '#00ff00' },
      { label: 'Pressure', value: 0.5, max: 2, unit: 'Bar', color: '#00ffff' },
    ]
  },
  {
    id: 'incinerators',
    name: 'Hospital Incinerator Controls',
    icon: '🔥',
    color: 'rose',
    subServices: ['Temperature Controls', 'Combustion Systems', 'Emission Monitoring', 'Safety Interlocks'],
    qaPairs: [
      { q: 'Temperature not reaching setpoint?', a: 'Check burner, fuel supply, temperature sensor, airflow.', severity: 'high', solutions: ['Clean burner nozzle', 'Check fuel pressure', 'Verify damper position'] },
      { q: 'Excessive smoke emission?', a: 'Incomplete combustion. Adjust air-to-fuel ratio.', severity: 'high', solutions: ['Increase combustion air', 'Check fuel quality', 'Clean air passages'] },
      { q: 'Safety interlock tripping?', a: 'Door switch, high temp, or flame failure.', severity: 'critical', solutions: ['Check door seal', 'Verify flame sensor', 'Test interlocks'] },
      { q: 'Controller not responding?', a: 'Power supply, fuse, or control board issue.', severity: 'high', solutions: ['Test power supply', 'Replace fuse', 'Check control board'] },
    ],
    calculator: {
      name: 'Incinerator Capacity Calculator',
      fields: ['Waste Volume (kg/h)', 'Calorific Value (MJ/kg)', 'Efficiency (%)'],
      formula: 'Heat Output (MJ/h) = Volume × Calorific Value × Efficiency'
    },
    gauges: [
      { label: 'Chamber Temp', value: 850, max: 1200, unit: '°C', color: '#ff4400' },
      { label: 'Stack Temp', value: 450, max: 800, unit: '°C', color: '#ffaa00' },
      { label: 'O2 Level', value: 8, max: 21, unit: '%', color: '#00ff00' },
    ]
  }
];

// =====================================================
// NEEDLE GAUGE COMPONENT
// =====================================================
function NeedleGauge({ label, value, max, unit, color }: { label: string; value: number; max: number; unit: string; color: string }) {
  const percentage = Math.min((value / max) * 100, 100);
  const angle = (percentage / 100) * 180 - 90;
  
  return (
    <div className="flex flex-col items-center p-4 bg-gray-900/50 rounded-lg border border-gray-700">
      <svg width="120" height="70" viewBox="0 0 120 70">
        {/* Background arc */}
        <path d="M10,65 A50,50 0 0,1 110,65" stroke="#333" strokeWidth="8" fill="none" />
        {/* Colored arc based on value */}
        <path 
          d="M10,65 A50,50 0 0,1 110,65" 
          stroke={color} 
          strokeWidth="8" 
          fill="none"
          strokeDasharray={`${percentage * 1.57} 157`}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
        {/* Needle */}
        <line
          x1="60" y1="65"
          x2={60 + 40 * Math.cos((angle * Math.PI) / 180)}
          y2={65 + 40 * Math.sin((angle * Math.PI) / 180)}
          stroke="white" strokeWidth="3" strokeLinecap="round"
        />
        {/* Center dot */}
        <circle cx="60" cy="65" r="5" fill={color} />
        {/* Min/Max labels */}
        <text x="10" y="68" fill="#666" fontSize="8">0</text>
        <text x="100" y="68" fill="#666" fontSize="8">{max}</text>
      </svg>
      <div className="text-center mt-2">
        <div className="text-lg font-bold" style={{ color }}>{value} {unit}</div>
        <div className="text-xs text-gray-400">{label}</div>
      </div>
    </div>
  );
}

// =====================================================
// SERVICE CALCULATOR COMPONENT - NOW USES ADVANCED CALCULATORS
// =====================================================
function ServiceCalculator({ serviceId }: { serviceId: string }) {
  const CalculatorComponent = CALCULATOR_COMPONENTS[serviceId];
  
  if (!CalculatorComponent) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
        <p className="text-gray-400 text-center">Calculator coming soon...</p>
      </div>
    );
  }
  
  return <CalculatorComponent />;
}

// =====================================================
// MAIN PAGE COMPONENT
// =====================================================
export default function UniversalDiagnosticPage() {
  const [selectedService, setSelectedService] = useState(NINE_SERVICES[0]);
  const [expandedQA, setExpandedQA] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Header */}
      <header className="border-b border-cyan-500/30 bg-gradient-to-r from-black via-gray-900 to-black sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div 
                className="w-3 h-3 bg-green-400 rounded-full"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <h1 className="text-xl sm:text-2xl font-bold text-cyan-400 tracking-wider">
                UNIVERSAL DIAGNOSTIC CENTER
              </h1>
            </div>
            <Link href="/" className="text-cyan-400 hover:text-cyan-300 text-sm">
              ← Back to Home
            </Link>
          </div>
          <p className="text-gray-400 text-sm mt-1">9 Complete Services • Q&A • Calculators • Pressure Gauges</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Service Selector - 9 Services Grid */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-cyan-400 mb-4">SELECT SERVICE</h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
            {NINE_SERVICES.map((service) => (
              <button
                key={service.id}
                onClick={() => { setSelectedService(service); setExpandedQA(null); }}
                className={`p-3 rounded-lg border transition-all text-center ${
                  selectedService.id === service.id
                    ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
                    : 'border-gray-700 bg-gray-900/50 text-gray-400 hover:border-cyan-500/50'
                }`}
              >
                <div className="text-2xl mb-1">{service.icon}</div>
                <div className="text-[10px] sm:text-xs font-bold leading-tight">{service.name}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Selected Service Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedService.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Service Header */}
            <div className="bg-gradient-to-r from-gray-900 to-black border border-cyan-500/30 rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl">{selectedService.icon}</span>
                <div>
                  <h2 className="text-2xl font-bold text-cyan-400">{selectedService.name}</h2>
                  <p className="text-gray-400">{selectedService.qaPairs.length} diagnostic Q&As • {selectedService.subServices.length} sub-services</p>
                </div>
              </div>

              {/* Sub-services */}
              <div className="flex flex-wrap gap-2">
                {selectedService.subServices.map((sub, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-800 border border-gray-600 rounded-full text-xs text-gray-300">
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            {/* Advanced Calculator - Full Width */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-cyan-400 border-b border-gray-700 pb-2 mb-4">
                🧮 ADVANCED PROFESSIONAL CALCULATOR
              </h3>
              <ServiceCalculator serviceId={selectedService.id} />
            </div>

            {/* Two Column Layout for Q&A and Gauges */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Column 1: Q&A Section */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-lg font-bold text-cyan-400 border-b border-gray-700 pb-2">
                  DIAGNOSTIC Q&A
                </h3>
                {selectedService.qaPairs.map((qa, idx) => (
                  <div 
                    key={idx}
                    className={`border rounded-lg overflow-hidden ${
                      qa.severity === 'critical' ? 'border-red-500/50 bg-red-900/10' :
                      qa.severity === 'high' ? 'border-orange-500/50 bg-orange-900/10' :
                      qa.severity === 'medium' ? 'border-yellow-500/50 bg-yellow-900/10' :
                      'border-green-500/50 bg-green-900/10'
                    }`}
                  >
                    <button
                      onClick={() => setExpandedQA(expandedQA === idx ? null : idx)}
                      className="w-full text-left p-4 flex items-start justify-between hover:bg-white/5"
                    >
                      <div className="flex items-start gap-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          qa.severity === 'critical' ? 'bg-red-500 text-white' :
                          qa.severity === 'high' ? 'bg-orange-500 text-white' :
                          qa.severity === 'medium' ? 'bg-yellow-500 text-black' :
                          'bg-green-500 text-white'
                        }`}>
                          {qa.severity?.toUpperCase()}
                        </span>
                        <span className="font-semibold text-white">{qa.q}</span>
                      </div>
                      <span className={`text-cyan-400 transition-transform ${expandedQA === idx ? 'rotate-180' : ''}`}>▼</span>
                    </button>
                    
                    <AnimatePresence>
                      {expandedQA === idx && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden border-t border-gray-700"
                        >
                          <div className="p-4 bg-black/30">
                            <div className="mb-3">
                              <h4 className="text-xs text-cyan-400 font-bold mb-1">DIAGNOSIS:</h4>
                              <p className="text-gray-300 text-sm">{qa.a}</p>
                            </div>
                            <div>
                              <h4 className="text-xs text-green-400 font-bold mb-2">SOLUTIONS:</h4>
                              <ul className="space-y-1">
                                {qa.solutions.map((sol, i) => (
                                  <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                                    <span className="text-green-400">✓</span> {sol}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            {/* CTA Buttons */}
                            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-700">
                              <a 
                                href="https://wa.me/0768860665" 
                                target="_blank"
                                className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded text-center text-sm font-bold"
                              >
                                📱 WhatsApp Expert
                              </a>
                              <a 
                                href="tel:0782914717"
                                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded text-center text-sm font-bold"
                              >
                                📞 Call Now
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Column 2: Gauges & Contact */}
              <div className="space-y-6">

                {/* Pressure Gauges */}
                <div>
                  <h3 className="text-lg font-bold text-cyan-400 border-b border-gray-700 pb-2 mb-4">
                    PRESSURE GAUGES
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {selectedService.gauges.map((gauge, idx) => (
                      <NeedleGauge key={idx} {...gauge} />
                    ))}
                  </div>
                </div>

                {/* Quick Contact */}
                <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-cyan-400 mb-3">NEED EXPERT HELP?</h3>
                  <p className="text-gray-400 text-sm mb-4">Our certified technicians are available 24/7</p>
                  <div className="space-y-2">
                    <a 
                      href="https://wa.me/0768860665"
                      className="block w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded font-bold text-center"
                    >
                      💬 WhatsApp: 0768860665
                    </a>
                    <a 
                      href="tel:0768860665"
                      className="block w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded font-bold text-center"
                    >
                      📞 Call: 0768860665
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom Navigation to Other Diagnostic Pages */}
        <section className="mt-12 border-t border-gray-700 pt-8">
          <h3 className="text-lg font-bold text-cyan-400 mb-4">MORE DIAGNOSTIC TOOLS</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/diagnostic-suite" className="p-4 bg-gray-900 border border-gray-700 rounded-lg hover:border-cyan-500 transition-colors">
              <div className="text-2xl mb-2">🔧</div>
              <div className="font-bold text-white">Diagnostic Suite</div>
              <div className="text-sm text-gray-400">5,930+ error codes database</div>
            </Link>
            <Link href="/diagnostic-cockpit" className="p-4 bg-gray-900 border border-gray-700 rounded-lg hover:border-cyan-500 transition-colors">
              <div className="text-2xl mb-2">🎛️</div>
              <div className="font-bold text-white">Mission Control Cockpit</div>
              <div className="text-sm text-gray-400">Real-time telemetry & gauges</div>
            </Link>
            <Link href="/diagnostic-qa" className="p-4 bg-gray-900 border border-gray-700 rounded-lg hover:border-cyan-500 transition-colors">
              <div className="text-2xl mb-2">❓</div>
              <div className="font-bold text-white">Q&A Database</div>
              <div className="text-sm text-gray-400">Comprehensive troubleshooting</div>
            </Link>
          </div>
        </section>
      </main>

      {/* HUD Corners */}
      <div className="hidden sm:block fixed top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-cyan-500/30 pointer-events-none" />
      <div className="hidden sm:block fixed top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyan-500/30 pointer-events-none" />
      <div className="hidden sm:block fixed bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-cyan-500/30 pointer-events-none" />
      <div className="hidden sm:block fixed bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-cyan-500/30 pointer-events-none" />
    </div>
  );
}
