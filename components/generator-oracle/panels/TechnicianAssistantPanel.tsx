'use client';

/**
 * Technician Assistant Panel
 * Comprehensive problem reporting and diagnostic assistance
 * Editable inputs for all generator parameters and conditions
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Generator info types
interface GeneratorInfo {
  brand: string;
  model: string;
  kvaRating: string;
  engineBrand: string;
  engineModel: string;
  alternatorBrand: string;
  controllerType: string;
  fuelType: 'diesel' | 'petrol' | 'gas' | 'dual';
  serialNumber: string;
  yearOfManufacture: string;
  totalRunningHours: string;
}

// Current readings
interface CurrentReadings {
  // Electrical
  voltageL1N: string;
  voltageL2N: string;
  voltageL3N: string;
  frequency: string;
  loadPercent: string;
  powerFactor: string;
  currentL1: string;
  currentL2: string;
  currentL3: string;

  // Engine
  rpm: string;
  oilPressure: string;
  oilTemperature: string;
  coolantTemperature: string;
  exhaustTemperature: string;
  fuelPressure: string;

  // Other
  batteryVoltage: string;
  fuelLevel: string;
  ambientTemperature: string;
}

// Problem categories
const PROBLEM_CATEGORIES = [
  { id: 'starting', label: 'Starting Issues', icon: '🔑' },
  { id: 'overheating', label: 'Overheating', icon: '🌡️' },
  { id: 'electrical', label: 'Electrical Problems', icon: '⚡' },
  { id: 'mechanical', label: 'Mechanical Issues', icon: '⚙️' },
  { id: 'fuel', label: 'Fuel System', icon: '⛽' },
  { id: 'oil', label: 'Oil/Lubrication', icon: '🛢️' },
  { id: 'noise', label: 'Abnormal Noise', icon: '🔊' },
  { id: 'smoke', label: 'Smoke/Exhaust', icon: '💨' },
  { id: 'vibration', label: 'Vibration', icon: '📳' },
  { id: 'shutdown', label: 'Unexpected Shutdown', icon: '🛑' },
  { id: 'performance', label: 'Poor Performance', icon: '📉' },
  { id: 'faultcode', label: 'Fault Code Display', icon: '⚠️' },
];

// Common symptoms checklist
const SYMPTOM_CHECKLIST = {
  starting: [
    'Engine cranks but won\'t start',
    'Engine won\'t crank at all',
    'Slow cranking',
    'Starts then immediately stops',
    'Multiple start attempts needed',
    'Starter motor noise but no engagement',
  ],
  overheating: [
    'High coolant temperature alarm',
    'Coolant leaking',
    'Radiator fan not working',
    'Low coolant level',
    'Steam from engine',
    'Temperature rises under load',
    'Thermostat stuck',
  ],
  electrical: [
    'Low voltage output',
    'High voltage output',
    'Voltage fluctuation',
    'Frequency unstable',
    'Phase imbalance',
    'No output at all',
    'Circuit breaker tripping',
    'AVR failure',
  ],
  mechanical: [
    'Knocking sound',
    'Grinding noise',
    'Belt slipping/broken',
    'Pulley damaged',
    'Bearing noise',
    'Coupling misalignment',
    'Turbo failure',
  ],
  fuel: [
    'Fuel leak',
    'Air in fuel system',
    'Fuel filter blocked',
    'Injector problem',
    'Fuel pump failure',
    'Contaminated fuel',
    'High fuel consumption',
  ],
  oil: [
    'Low oil pressure alarm',
    'Oil leak (external)',
    'Oil in coolant',
    'Oil in exhaust/smoke',
    'High oil consumption',
    'Oil contamination',
    'Sump overfull',
  ],
  noise: [
    'Engine knock/ping',
    'Rattling sound',
    'Whistling/hissing',
    'Grinding from alternator',
    'Exhaust noise unusual',
    'Turbo whine',
  ],
  smoke: [
    'Black smoke',
    'White smoke',
    'Blue smoke',
    'Excessive exhaust',
    'Oil smell in exhaust',
    'Fuel smell in exhaust',
  ],
  vibration: [
    'Engine vibration excessive',
    'Alternator vibration',
    'Mounting bolts loose',
    'Coupling worn',
    'Damper failure',
    'Unbalanced load',
  ],
  shutdown: [
    'Overspeed shutdown',
    'Low oil pressure shutdown',
    'High temperature shutdown',
    'Emergency stop activated',
    'Controller fault',
    'Fuel system shutdown',
  ],
  performance: [
    'Cannot reach rated power',
    'Power drops under load',
    'Unstable power output',
    'Slow response to load',
    'Hunting/surging',
    'Efficiency decreased',
  ],
  faultcode: [
    'Fault code displayed',
    'Warning light on',
    'Multiple alarms',
    'Cannot reset fault',
    'Recurring fault',
  ],
};

// Recent history options
const HISTORY_OPTIONS = [
  'Recently serviced/overhauled',
  'Oil changed recently',
  'Filters replaced',
  'Coolant topped up/changed',
  'Fuel filters changed',
  'New batteries installed',
  'Injectors serviced',
  'AVR replaced/adjusted',
  'Governor adjusted',
  'Alternator rewound',
  'Controller replaced',
  'Running for extended period',
  'Generator moved/relocated',
  'Load bank tested',
  'First use after storage',
];

// Environment conditions
const ENVIRONMENT_CONDITIONS = [
  'Hot climate (>35°C)',
  'Cold climate (<10°C)',
  'High altitude (>1500m)',
  'Dusty environment',
  'High humidity',
  'Salt air/coastal',
  'Indoor installation',
  'Outdoor installation',
  'Poor ventilation',
  'Fuel quality issues in area',
];

// ==================== INPUT COMPONENTS ====================

function TextInput({
  label,
  value,
  onChange,
  placeholder,
  unit,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  unit?: string;
  type?: 'text' | 'number';
}) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || '--'}
          className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/50 rounded-lg text-cyan-400 font-mono text-sm focus:outline-none focus:border-cyan-500/50 placeholder-slate-600"
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">{unit}</span>
        )}
      </div>
    </div>
  );
}

function SelectInput({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/50 rounded-lg text-cyan-400 text-sm focus:outline-none focus:border-cyan-500/50"
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function TextAreaInput({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/50 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500/50 placeholder-slate-600 resize-none"
      />
    </div>
  );
}

function CheckboxGroup({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}) {
  const toggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
      {options.map((option) => (
        <label
          key={option}
          className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${
            selected.includes(option)
              ? 'bg-cyan-500/20 border border-cyan-500/50'
              : 'bg-slate-900/50 border border-slate-700/50 hover:border-slate-600'
          }`}
        >
          <input
            type="checkbox"
            checked={selected.includes(option)}
            onChange={() => toggle(option)}
            className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
          />
          <span className={`text-sm ${selected.includes(option) ? 'text-cyan-300' : 'text-slate-400'}`}>
            {option}
          </span>
        </label>
      ))}
    </div>
  );
}

// ==================== DIAGNOSIS RESULT ====================

interface DiagnosisResult {
  possibleCauses: { cause: string; likelihood: 'high' | 'medium' | 'low' }[];
  recommendations: string[];
  urgency: 'immediate' | 'soon' | 'routine';
  relatedFaultCodes: string[];
}

function DiagnosisResultCard({ result }: { result: DiagnosisResult }) {
  const urgencyColors = {
    immediate: 'bg-red-500/20 border-red-500/50 text-red-400',
    soon: 'bg-amber-500/20 border-amber-500/50 text-amber-400',
    routine: 'bg-green-500/20 border-green-500/50 text-green-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Urgency Badge */}
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${urgencyColors[result.urgency]}`}>
        <span className="text-lg">
          {result.urgency === 'immediate' ? '🚨' : result.urgency === 'soon' ? '⚠️' : '✅'}
        </span>
        <span className="font-bold uppercase tracking-wider">
          {result.urgency === 'immediate' ? 'Immediate Attention Required' :
           result.urgency === 'soon' ? 'Attention Needed Soon' :
           'Routine Maintenance'}
        </span>
      </div>

      {/* Possible Causes */}
      <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
        <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3">
          Possible Causes
        </h4>
        <div className="space-y-2">
          {result.possibleCauses.map((cause, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 bg-slate-950/50 rounded-lg"
            >
              <span className="text-sm text-slate-300">{cause.cause}</span>
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                cause.likelihood === 'high' ? 'bg-red-500/20 text-red-400' :
                cause.likelihood === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                'bg-blue-500/20 text-blue-400'
              }`}>
                {cause.likelihood.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
        <h4 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-3">
          Recommended Actions
        </h4>
        <ol className="space-y-2">
          {result.recommendations.map((rec, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 text-sm font-bold flex items-center justify-center">
                {idx + 1}
              </span>
              <span className="text-sm text-slate-300">{rec}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Related Fault Codes */}
      {result.relatedFaultCodes.length > 0 && (
        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
          <h4 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-3">
            Related Fault Codes to Check
          </h4>
          <div className="flex flex-wrap gap-2">
            {result.relatedFaultCodes.map((code) => (
              <span
                key={code}
                className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg font-mono text-purple-400 text-sm"
              >
                {code}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ==================== MAIN PANEL ====================

export default function TechnicianAssistantPanel() {
  // Form state
  const [activeStep, setActiveStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);

  // Generator info
  const [generatorInfo, setGeneratorInfo] = useState<GeneratorInfo>({
    brand: '',
    model: '',
    kvaRating: '',
    engineBrand: '',
    engineModel: '',
    alternatorBrand: '',
    controllerType: '',
    fuelType: 'diesel',
    serialNumber: '',
    yearOfManufacture: '',
    totalRunningHours: '',
  });

  // Current readings
  const [readings, setReadings] = useState<CurrentReadings>({
    voltageL1N: '',
    voltageL2N: '',
    voltageL3N: '',
    frequency: '',
    loadPercent: '',
    powerFactor: '',
    currentL1: '',
    currentL2: '',
    currentL3: '',
    rpm: '',
    oilPressure: '',
    oilTemperature: '',
    coolantTemperature: '',
    exhaustTemperature: '',
    fuelPressure: '',
    batteryVoltage: '',
    fuelLevel: '',
    ambientTemperature: '',
  });

  // Problem details
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [problemDescription, setProblemDescription] = useState('');
  const [faultCodesDisplayed, setFaultCodesDisplayed] = useState('');

  // History & environment
  const [recentHistory, setRecentHistory] = useState<string[]>([]);
  const [environmentConditions, setEnvironmentConditions] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Update handlers
  const updateGeneratorInfo = useCallback(<K extends keyof GeneratorInfo>(key: K, value: GeneratorInfo[K]) => {
    setGeneratorInfo(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateReadings = useCallback(<K extends keyof CurrentReadings>(key: K, value: CurrentReadings[K]) => {
    setReadings(prev => ({ ...prev, [key]: value }));
  }, []);

  // Get available symptoms based on selected categories
  const availableSymptoms = selectedCategories.flatMap(
    cat => SYMPTOM_CHECKLIST[cat as keyof typeof SYMPTOM_CHECKLIST] || []
  );

  // Analyze and generate diagnosis
  const analyzeProblem = async () => {
    setIsAnalyzing(true);

    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate diagnosis based on inputs
    const result: DiagnosisResult = generateDiagnosis();
    setDiagnosisResult(result);
    setIsAnalyzing(false);
    setActiveStep(4); // Move to results step
  };

  // Generate diagnosis based on inputs (simplified logic)
  const generateDiagnosis = (): DiagnosisResult => {
    const causes: DiagnosisResult['possibleCauses'] = [];
    const recommendations: string[] = [];
    const relatedCodes: string[] = [];
    let urgency: DiagnosisResult['urgency'] = 'routine';

    // Analyze based on categories and symptoms
    if (selectedCategories.includes('overheating')) {
      if (readings.coolantTemperature && parseFloat(readings.coolantTemperature) > 95) {
        causes.push({ cause: 'Coolant system failure - temperature critically high', likelihood: 'high' });
        urgency = 'immediate';
      }
      if (selectedSymptoms.includes('Coolant leaking')) {
        causes.push({ cause: 'Coolant leak - check hoses, radiator, and water pump', likelihood: 'high' });
        recommendations.push('Inspect all coolant hoses for cracks or loose clamps');
        recommendations.push('Check radiator for leaks or damage');
        recommendations.push('Verify water pump operation');
        relatedCodes.push('E1001', 'W2015', 'E1003');
        urgency = 'immediate';
      }
      if (selectedSymptoms.includes('Radiator fan not working')) {
        causes.push({ cause: 'Radiator fan failure', likelihood: 'high' });
        recommendations.push('Check fan belt tension and condition');
        recommendations.push('Test fan motor electrically');
        recommendations.push('Verify fan thermostat switch');
      }
      if (readings.loadPercent && parseFloat(readings.loadPercent) > 80) {
        causes.push({ cause: 'Generator overloaded - load exceeds safe capacity', likelihood: 'medium' });
        recommendations.push('Reduce electrical load on the generator');
        recommendations.push('Check if load calculation matches generator rating');
      }
    }

    if (selectedCategories.includes('oil')) {
      if (selectedSymptoms.includes('Oil in exhaust/smoke')) {
        causes.push({ cause: 'Piston ring wear - oil entering combustion chamber', likelihood: 'high' });
        causes.push({ cause: 'Valve stem seal failure', likelihood: 'medium' });
        causes.push({ cause: 'Turbocharger seal leak', likelihood: 'medium' });
        recommendations.push('Perform compression test on all cylinders');
        recommendations.push('Check turbo for oil leaks if equipped');
        recommendations.push('Measure oil consumption over defined period');
        relatedCodes.push('E2001', 'W3012');
        urgency = 'soon';
      }
      if (readings.oilPressure && parseFloat(readings.oilPressure) < 20) {
        causes.push({ cause: 'Low oil pressure - potential bearing damage risk', likelihood: 'high' });
        urgency = 'immediate';
        recommendations.push('STOP generator immediately if oil pressure is critically low');
        recommendations.push('Check oil level and top up if needed');
        recommendations.push('Inspect oil pump and relief valve');
      }
    }

    if (selectedCategories.includes('electrical')) {
      if (selectedSymptoms.includes('Voltage fluctuation')) {
        causes.push({ cause: 'AVR (Automatic Voltage Regulator) malfunction', likelihood: 'high' });
        causes.push({ cause: 'Governor instability causing speed fluctuation', likelihood: 'medium' });
        causes.push({ cause: 'Exciter winding issue', likelihood: 'low' });
        recommendations.push('Check AVR settings and connections');
        recommendations.push('Verify governor actuator response');
        recommendations.push('Test exciter output voltage');
        relatedCodes.push('E4001', 'E4002', 'W4010');
      }
      if (selectedSymptoms.includes('Phase imbalance')) {
        causes.push({ cause: 'Unbalanced load across phases', likelihood: 'high' });
        causes.push({ cause: 'Alternator winding issue', likelihood: 'medium' });
        recommendations.push('Balance the load across all three phases');
        recommendations.push('Check for single-phasing on any circuit');
        recommendations.push('Measure alternator winding resistance');
      }
    }

    if (selectedCategories.includes('starting')) {
      if (selectedSymptoms.includes('Engine cranks but won\'t start')) {
        causes.push({ cause: 'Fuel system issue - no fuel reaching injectors', likelihood: 'high' });
        causes.push({ cause: 'Air in fuel lines', likelihood: 'high' });
        causes.push({ cause: 'Fuel solenoid not energizing', likelihood: 'medium' });
        recommendations.push('Bleed fuel system to remove air');
        recommendations.push('Check fuel solenoid operation');
        recommendations.push('Verify fuel pump is delivering fuel');
        recommendations.push('Inspect fuel filters for blockage');
        relatedCodes.push('E5001', 'E5002', 'W5015');
      }
      if (selectedSymptoms.includes('Slow cranking')) {
        causes.push({ cause: 'Battery weak or failing', likelihood: 'high' });
        causes.push({ cause: 'Starter motor worn', likelihood: 'medium' });
        causes.push({ cause: 'Poor battery connections', likelihood: 'medium' });
        recommendations.push('Load test battery - replace if below 12.4V under load');
        recommendations.push('Clean and tighten battery terminals');
        recommendations.push('Check starter motor current draw');
      }
    }

    if (selectedCategories.includes('smoke')) {
      if (selectedSymptoms.includes('Black smoke')) {
        causes.push({ cause: 'Over-fueling - injector stuck open or maladjusted', likelihood: 'high' });
        causes.push({ cause: 'Air filter blocked - insufficient air', likelihood: 'high' });
        causes.push({ cause: 'Turbo boost leak', likelihood: 'medium' });
        recommendations.push('Replace or clean air filter immediately');
        recommendations.push('Check injector spray pattern and timing');
        recommendations.push('Inspect turbo boost pipes for leaks');
        urgency = 'soon';
      }
      if (selectedSymptoms.includes('White smoke')) {
        causes.push({ cause: 'Coolant entering combustion chamber - head gasket failure', likelihood: 'high' });
        causes.push({ cause: 'Water in fuel', likelihood: 'medium' });
        recommendations.push('Check coolant level for unexplained loss');
        recommendations.push('Inspect oil for milky appearance (coolant contamination)');
        recommendations.push('Drain fuel water separator');
        relatedCodes.push('E1005', 'E6001');
        urgency = 'immediate';
      }
    }

    // Add generic recommendations if nothing specific
    if (recommendations.length === 0) {
      recommendations.push('Perform visual inspection of all systems');
      recommendations.push('Check all fluid levels (oil, coolant, fuel)');
      recommendations.push('Review any fault codes on controller display');
      recommendations.push('Listen for abnormal sounds during operation');
    }

    if (causes.length === 0) {
      causes.push({ cause: 'Further investigation needed - insufficient data', likelihood: 'medium' });
    }

    return { possibleCauses: causes, recommendations, urgency, relatedFaultCodes: relatedCodes };
  };

  // Reset form
  const resetForm = () => {
    setActiveStep(0);
    setDiagnosisResult(null);
    setSelectedCategories([]);
    setSelectedSymptoms([]);
    setProblemDescription('');
    setFaultCodesDisplayed('');
    setRecentHistory([]);
    setEnvironmentConditions([]);
    setAdditionalNotes('');
  };

  const steps = [
    { id: 0, title: 'Generator Info', icon: '🔧' },
    { id: 1, title: 'Current Readings', icon: '📊' },
    { id: 2, title: 'Problem Details', icon: '⚠️' },
    { id: 3, title: 'History & Environment', icon: '📋' },
    { id: 4, title: 'Diagnosis', icon: '💡' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🛠️</span>
          <div>
            <h2 className="text-xl font-bold text-green-400 uppercase tracking-wider">Technician Assistant</h2>
            <p className="text-sm text-slate-500">Describe your generator problem for expert diagnosis</p>
          </div>
        </div>

        {diagnosisResult && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={resetForm}
            className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg border border-slate-700 hover:bg-slate-700 text-sm"
          >
            New Problem Report
          </motion.button>
        )}
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => !diagnosisResult && setActiveStep(step.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                activeStep === step.id
                  ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400'
                  : activeStep > step.id
                  ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="text-lg">{activeStep > step.id ? '✓' : step.icon}</span>
              <span className="text-sm font-medium hidden sm:inline">{step.title}</span>
            </button>
            {idx < steps.length - 1 && (
              <div className={`w-8 h-px mx-2 ${activeStep > idx ? 'bg-green-500' : 'bg-slate-700'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {/* Step 0: Generator Info */}
        {activeStep === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50"
          >
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4">Generator Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <TextInput
                label="Generator Brand"
                value={generatorInfo.brand}
                onChange={(v) => updateGeneratorInfo('brand', v)}
                placeholder="e.g., Cummins"
              />
              <TextInput
                label="Generator Model"
                value={generatorInfo.model}
                onChange={(v) => updateGeneratorInfo('model', v)}
                placeholder="e.g., C150D5"
              />
              <TextInput
                label="KVA Rating"
                value={generatorInfo.kvaRating}
                onChange={(v) => updateGeneratorInfo('kvaRating', v)}
                placeholder="e.g., 150"
                unit="kVA"
              />
              <SelectInput
                label="Fuel Type"
                value={generatorInfo.fuelType}
                onChange={(v) => updateGeneratorInfo('fuelType', v as GeneratorInfo['fuelType'])}
                options={[
                  { value: 'diesel', label: 'Diesel' },
                  { value: 'petrol', label: 'Petrol/Gasoline' },
                  { value: 'gas', label: 'Natural Gas' },
                  { value: 'dual', label: 'Dual Fuel' },
                ]}
              />
              <TextInput
                label="Engine Brand"
                value={generatorInfo.engineBrand}
                onChange={(v) => updateGeneratorInfo('engineBrand', v)}
                placeholder="e.g., Perkins"
              />
              <TextInput
                label="Engine Model"
                value={generatorInfo.engineModel}
                onChange={(v) => updateGeneratorInfo('engineModel', v)}
                placeholder="e.g., 1106A-70TAG2"
              />
              <TextInput
                label="Controller Type"
                value={generatorInfo.controllerType}
                onChange={(v) => updateGeneratorInfo('controllerType', v)}
                placeholder="e.g., DSE 7320"
              />
              <TextInput
                label="Running Hours"
                value={generatorInfo.totalRunningHours}
                onChange={(v) => updateGeneratorInfo('totalRunningHours', v)}
                placeholder="e.g., 5000"
                unit="hrs"
              />
            </div>

            <div className="flex justify-end mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveStep(1)}
                className="px-6 py-2 bg-cyan-500 text-white font-medium rounded-lg"
              >
                Next: Current Readings →
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 1: Current Readings */}
        {activeStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50"
          >
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4">Current Readings (Enter what you can measure)</h3>

            {/* Electrical */}
            <div className="mb-6">
              <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-3">⚡ Electrical Parameters</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <TextInput label="Voltage L1-N" value={readings.voltageL1N} onChange={(v) => updateReadings('voltageL1N', v)} unit="V" type="number" />
                <TextInput label="Voltage L2-N" value={readings.voltageL2N} onChange={(v) => updateReadings('voltageL2N', v)} unit="V" type="number" />
                <TextInput label="Voltage L3-N" value={readings.voltageL3N} onChange={(v) => updateReadings('voltageL3N', v)} unit="V" type="number" />
                <TextInput label="Frequency" value={readings.frequency} onChange={(v) => updateReadings('frequency', v)} unit="Hz" type="number" />
                <TextInput label="Load" value={readings.loadPercent} onChange={(v) => updateReadings('loadPercent', v)} unit="%" type="number" />
                <TextInput label="Power Factor" value={readings.powerFactor} onChange={(v) => updateReadings('powerFactor', v)} unit="PF" type="number" />
              </div>
            </div>

            {/* Engine */}
            <div className="mb-6">
              <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-3">⚙️ Engine Parameters</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <TextInput label="RPM" value={readings.rpm} onChange={(v) => updateReadings('rpm', v)} unit="rpm" type="number" />
                <TextInput label="Oil Pressure" value={readings.oilPressure} onChange={(v) => updateReadings('oilPressure', v)} unit="PSI" type="number" />
                <TextInput label="Oil Temp" value={readings.oilTemperature} onChange={(v) => updateReadings('oilTemperature', v)} unit="°C" type="number" />
                <TextInput label="Coolant Temp" value={readings.coolantTemperature} onChange={(v) => updateReadings('coolantTemperature', v)} unit="°C" type="number" />
                <TextInput label="Battery" value={readings.batteryVoltage} onChange={(v) => updateReadings('batteryVoltage', v)} unit="V" type="number" />
                <TextInput label="Fuel Level" value={readings.fuelLevel} onChange={(v) => updateReadings('fuelLevel', v)} unit="%" type="number" />
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveStep(0)}
                className="px-6 py-2 bg-slate-800 text-slate-300 rounded-lg border border-slate-700"
              >
                ← Back
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveStep(2)}
                className="px-6 py-2 bg-cyan-500 text-white font-medium rounded-lg"
              >
                Next: Problem Details →
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Problem Details */}
        {activeStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Problem Categories */}
            <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-4">What type of problem are you experiencing?</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {PROBLEM_CATEGORIES.map((cat) => (
                  <motion.button
                    key={cat.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (selectedCategories.includes(cat.id)) {
                        setSelectedCategories(selectedCategories.filter(c => c !== cat.id));
                      } else {
                        setSelectedCategories([...selectedCategories, cat.id]);
                      }
                    }}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      selectedCategories.includes(cat.id)
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                        : 'bg-slate-900/50 border-slate-700/50 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{cat.icon}</span>
                    <span className="text-xs">{cat.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Symptoms Checklist */}
            {selectedCategories.length > 0 && (
              <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50">
                <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-4">Select observed symptoms</h3>
                <CheckboxGroup
                  options={availableSymptoms}
                  selected={selectedSymptoms}
                  onChange={setSelectedSymptoms}
                />
              </div>
            )}

            {/* Problem Description */}
            <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4">Describe the problem in detail</h3>
              <TextAreaInput
                label="Problem Description"
                value={problemDescription}
                onChange={setProblemDescription}
                placeholder="Describe what is happening... e.g., '30 kVA generator overheating when load exceeds 70%, coolant temperature rises to 100°C, recently overhauled 2 months ago, noticed oil in exhaust smoke...'"
                rows={5}
              />

              <div className="mt-4">
                <TextInput
                  label="Fault Codes Displayed (if any)"
                  value={faultCodesDisplayed}
                  onChange={setFaultCodesDisplayed}
                  placeholder="e.g., E1234, W2045, E1001"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveStep(1)}
                className="px-6 py-2 bg-slate-800 text-slate-300 rounded-lg border border-slate-700"
              >
                ← Back
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveStep(3)}
                className="px-6 py-2 bg-cyan-500 text-white font-medium rounded-lg"
              >
                Next: History →
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 3: History & Environment */}
        {activeStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Recent History */}
            <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-4">Recent Maintenance/History</h3>
              <CheckboxGroup
                options={HISTORY_OPTIONS}
                selected={recentHistory}
                onChange={setRecentHistory}
              />
            </div>

            {/* Environment */}
            <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4">Operating Environment</h3>
              <CheckboxGroup
                options={ENVIRONMENT_CONDITIONS}
                selected={environmentConditions}
                onChange={setEnvironmentConditions}
              />
            </div>

            {/* Additional Notes */}
            <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <TextAreaInput
                label="Additional Notes"
                value={additionalNotes}
                onChange={setAdditionalNotes}
                placeholder="Any other information that might help with diagnosis..."
                rows={3}
              />
            </div>

            <div className="flex justify-between">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveStep(2)}
                className="px-6 py-2 bg-slate-800 text-slate-300 rounded-lg border border-slate-700"
              >
                ← Back
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={analyzeProblem}
                disabled={isAnalyzing}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg shadow-green-500/25 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    Analyzing...
                  </span>
                ) : (
                  '🔍 Analyze Problem'
                )}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Diagnosis Results */}
        {activeStep === 4 && diagnosisResult && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <DiagnosisResultCard result={diagnosisResult} />

            {/* Contact Support */}
            <div className="mt-6 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3">Need Expert Help?</h4>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://wa.me/254768860665"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg border border-green-500/30 hover:bg-green-500/30"
                >
                  <span>💬</span>
                  WhatsApp Support
                </a>
                <a
                  href="tel:+254782914717"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30 hover:bg-blue-500/30"
                >
                  <span>📞</span>
                  Call Technician
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
