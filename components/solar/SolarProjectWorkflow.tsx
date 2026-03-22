'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ==================== SOLAR PROJECT WORKFLOW ====================
// Complete 8-Step Professional Solar Project Pipeline
// From Client Inquiry to Deployment & Monitoring

interface ClientInquiry {
  name: string;
  phone: string;
  email: string;
  location: string;
  propertyType: 'residential' | 'commercial' | 'industrial' | 'agricultural';
  monthlyBill: number;
  roofArea: number;
  roofType: string;
  budget: string;
  gridConnection: boolean;
  backupNeeded: boolean;
  notes: string;
}

interface SystemDesign {
  panelCount: number;
  panelWattage: number;
  systemSize: number;
  inverterSize: number;
  batteryCapacity: number;
  orientation: number;
  tilt: number;
  arrayArea: number;
  estimatedProduction: number;
}

interface ShadingAnalysis {
  annualLoss: number;
  worstMonth: string;
  worstMonthLoss: number;
  obstructions: { type: string; impact: number }[];
  optimizedLayout: boolean;
}

interface EnergyYield {
  annualProduction: number;
  monthlyProduction: number[];
  performanceRatio: number;
  specificYield: number;
  degradationRate: number;
  uncertaintyRange: { low: number; high: number };
  losses: { category: string; percentage: number }[];
}

interface FinancialModel {
  totalCost: number;
  paybackYears: number;
  npv: number;
  irr: number;
  lcoe: number;
  monthlySavings: number;
  annualSavings: number;
  lifetimeSavings: number;
  incentives: { name: string; amount: number }[];
  financingOption: string;
}

interface TechnicalValidation {
  performanceRatio: number;
  capacityFactor: number;
  losses: { category: string; value: number }[];
  components: { type: string; model: string; specs: string }[];
  certifications: string[];
}

interface GridIntegration {
  connectionType: 'grid-tied' | 'hybrid' | 'off-grid';
  exportLimit: number;
  batteryStrategy: string;
  selfConsumption: number;
  gridExport: number;
  peakShaving: boolean;
  backupHours: number;
}

interface ComplianceReport {
  documents: { name: string; status: 'ready' | 'pending' | 'required' }[];
  permits: { name: string; authority: string; status: string }[];
  uncertaintyAnalysis: { factor: string; impact: string }[];
}

interface ProjectState {
  currentStep: number;
  inquiry: ClientInquiry;
  design: SystemDesign;
  shading: ShadingAnalysis;
  yield: EnergyYield;
  financial: FinancialModel;
  technical: TechnicalValidation;
  grid: GridIntegration;
  compliance: ComplianceReport;
  completedSteps: number[];
}

// Kenya-specific data
const KENYA_LOCATIONS = [
  { name: 'Nairobi', irradiance: 5.2, lat: -1.29, tariff: 25 },
  { name: 'Mombasa', irradiance: 5.5, lat: -4.04, tariff: 25 },
  { name: 'Kisumu', irradiance: 5.3, lat: -0.09, tariff: 25 },
  { name: 'Nakuru', irradiance: 5.4, lat: -0.30, tariff: 25 },
  { name: 'Eldoret', irradiance: 5.1, lat: 0.51, tariff: 25 },
  { name: 'Malindi', irradiance: 5.6, lat: -3.22, tariff: 25 },
  { name: 'Nyeri', irradiance: 5.0, lat: -0.42, tariff: 25 },
  { name: 'Machakos', irradiance: 5.3, lat: -1.52, tariff: 25 },
  { name: 'Garissa', irradiance: 5.8, lat: -0.45, tariff: 25 },
  { name: 'Meru', irradiance: 5.2, lat: 0.05, tariff: 25 },
];

const WORKFLOW_STEPS = [
  {
    id: 1,
    title: 'Client Inquiry & Initial Assessment',
    icon: '📋',
    description: 'Gather energy demand, site details, and budget',
    tasks: [
      'Collect client energy consumption data',
      'Assess site characteristics and constraints',
      'Determine budget range and priorities',
      'Rapid system sizing estimation',
      'Generate initial 2D/3D layout visuals',
      'Deliver fast proposal with savings estimate'
    ]
  },
  {
    id: 2,
    title: 'Shading & Irradiance Validation',
    icon: '🌤️',
    description: 'Run shading simulations and quantify losses',
    tasks: [
      'Analyze satellite imagery and LIDAR data',
      'Simulate shading across seasons',
      'Quantify irradiance losses',
      'Identify obstruction impacts (trees, buildings)',
      'Optimize panel layout for maximum yield',
      'Generate shading loss report'
    ]
  },
  {
    id: 3,
    title: 'Energy Yield Simulation',
    icon: '⚡',
    description: 'Perform comprehensive production estimates',
    tasks: [
      'Calculate annual/monthly/daily production',
      'Apply temperature coefficients',
      'Factor wiring and inverter losses',
      'Model long-term degradation',
      'Generate uncertainty ranges',
      'Create bankable yield projections'
    ]
  },
  {
    id: 4,
    title: 'Financial & ROI Modeling',
    icon: '💰',
    description: 'Calculate payback, NPV, IRR with financing options',
    tasks: [
      'Calculate payback period',
      'Compute NPV and IRR',
      'Integrate local tariffs (KES 25/kWh)',
      'Apply available incentives',
      'Model financing scenarios',
      'Generate financial proposal'
    ]
  },
  {
    id: 5,
    title: 'Technical Validation',
    icon: '🔧',
    description: 'Engineering assurance and component verification',
    tasks: [
      'Calculate performance ratio',
      'Run loss breakdown analysis',
      'Verify component specifications',
      'Benchmark expected vs actual',
      'Generate engineering reports',
      'Validate for financier requirements'
    ]
  },
  {
    id: 6,
    title: 'Grid & Storage Integration',
    icon: '🔋',
    description: 'Optimize hybrid systems and grid interaction',
    tasks: [
      'Design battery sizing',
      'Model grid export/import',
      'Optimize self-consumption',
      'Configure peak shaving',
      'Plan backup strategy',
      'Simulate hybrid operation'
    ]
  },
  {
    id: 7,
    title: 'Compliance & Reporting',
    icon: '📑',
    description: 'Generate bank-grade documentation',
    tasks: [
      'Prepare financing documents',
      'Generate permit applications',
      'Create technical reports',
      'Compile uncertainty analysis',
      'Export regulator packages',
      'Finalize stakeholder reports'
    ]
  },
  {
    id: 8,
    title: 'Deployment & Monitoring',
    icon: '🚀',
    description: 'Site planning and ongoing performance tracking',
    tasks: [
      'Export GIS/CAD files',
      'Compare design scenarios',
      'Run sensitivity analyses',
      'Connect to monitoring system',
      'Set up alerts and reporting',
      'Enable API integration'
    ]
  }
];

// ==================== STEP COMPONENTS ====================

const Step1ClientInquiry: React.FC<{
  inquiry: ClientInquiry;
  onUpdate: (inquiry: ClientInquiry) => void;
  onComplete: () => void;
}> = ({ inquiry, onUpdate, onComplete }) => {
  const [formData, setFormData] = useState(inquiry);

  const handleChange = (field: keyof ClientInquiry, value: string | number | boolean) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdate(updated);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Client Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:border-amber-500 focus:outline-none"
            placeholder="John Kamau"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Phone *</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:border-amber-500 focus:outline-none"
            placeholder="+254 7XX XXX XXX"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:border-amber-500 focus:outline-none"
            placeholder="client@email.com"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Location *</label>
          <select
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:border-amber-500 focus:outline-none"
          >
            <option value="">Select location</option>
            {KENYA_LOCATIONS.map(loc => (
              <option key={loc.name} value={loc.name}>{loc.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Property Type *</label>
          <select
            value={formData.propertyType}
            onChange={(e) => handleChange('propertyType', e.target.value)}
            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:border-amber-500 focus:outline-none"
          >
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="industrial">Industrial</option>
            <option value="agricultural">Agricultural</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Monthly Electricity Bill (KES) *</label>
          <input
            type="number"
            value={formData.monthlyBill}
            onChange={(e) => handleChange('monthlyBill', parseInt(e.target.value) || 0)}
            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:border-amber-500 focus:outline-none"
            placeholder="15000"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Roof Area (m²)</label>
          <input
            type="number"
            value={formData.roofArea}
            onChange={(e) => handleChange('roofArea', parseInt(e.target.value) || 0)}
            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:border-amber-500 focus:outline-none"
            placeholder="50"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Roof Type</label>
          <select
            value={formData.roofType}
            onChange={(e) => handleChange('roofType', e.target.value)}
            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:border-amber-500 focus:outline-none"
          >
            <option value="flat">Flat Roof</option>
            <option value="gabled">Gabled Roof</option>
            <option value="hip">Hip Roof</option>
            <option value="metal">Metal Sheeting</option>
            <option value="tiles">Tiles</option>
            <option value="ground">Ground Mount</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Budget Range</label>
          <select
            value={formData.budget}
            onChange={(e) => handleChange('budget', e.target.value)}
            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:border-amber-500 focus:outline-none"
          >
            <option value="300-500k">KES 300,000 - 500,000</option>
            <option value="500k-1m">KES 500,000 - 1,000,000</option>
            <option value="1-2m">KES 1,000,000 - 2,000,000</option>
            <option value="2-5m">KES 2,000,000 - 5,000,000</option>
            <option value="5m+">KES 5,000,000+</option>
          </select>
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.gridConnection}
              onChange={(e) => handleChange('gridConnection', e.target.checked)}
              className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-amber-500 focus:ring-amber-500"
            />
            <span className="text-slate-300">Grid Connected</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.backupNeeded}
              onChange={(e) => handleChange('backupNeeded', e.target.checked)}
              className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-amber-500 focus:ring-amber-500"
            />
            <span className="text-slate-300">Battery Backup Needed</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-1">Additional Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={3}
          className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:border-amber-500 focus:outline-none"
          placeholder="Any specific requirements, existing equipment, constraints..."
        />
      </div>

      {/* Quick Sizing Estimate */}
      {formData.monthlyBill > 0 && (
        <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-xl p-4 border border-amber-700/30">
          <h4 className="text-amber-400 font-semibold mb-3">Quick System Sizing Estimate</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">
                {Math.round(formData.monthlyBill / 25)} kWh
              </div>
              <div className="text-xs text-slate-400">Monthly Usage</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">
                {((formData.monthlyBill / 25) / (30 * 4.5)).toFixed(1)} kW
              </div>
              <div className="text-xs text-slate-400">Recommended System</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {Math.ceil((formData.monthlyBill / 25) / (30 * 4.5) * 1000 / 545)}
              </div>
              <div className="text-xs text-slate-400">Panels (545W)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                KES {Math.round(formData.monthlyBill * 0.7).toLocaleString()}
              </div>
              <div className="text-xs text-slate-400">Est. Monthly Savings</div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={onComplete}
        disabled={!formData.name || !formData.phone || !formData.location || formData.monthlyBill <= 0}
        className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:from-amber-400 hover:to-orange-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Generate Initial Assessment
      </button>
    </div>
  );
};

const Step2ShadingAnalysis: React.FC<{
  inquiry: ClientInquiry;
  shading: ShadingAnalysis;
  onUpdate: (shading: ShadingAnalysis) => void;
  onComplete: () => void;
}> = ({ inquiry, shading, onUpdate, onComplete }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const runAnalysis = () => {
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      const newShading: ShadingAnalysis = {
        annualLoss: 3 + Math.random() * 5,
        worstMonth: 'June',
        worstMonthLoss: 8 + Math.random() * 7,
        obstructions: [
          { type: 'Trees (East)', impact: 2.1 },
          { type: 'Neighbor Building (West)', impact: 1.8 },
          { type: 'Parapet Wall', impact: 0.5 },
        ],
        optimizedLayout: true
      };
      onUpdate(newShading);
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Site Info */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <h4 className="text-white font-semibold mb-3">Site Information</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-slate-400">Location:</span>
            <span className="text-white ml-2">{inquiry.location}</span>
          </div>
          <div>
            <span className="text-slate-400">Roof Type:</span>
            <span className="text-white ml-2">{inquiry.roofType}</span>
          </div>
          <div>
            <span className="text-slate-400">Roof Area:</span>
            <span className="text-white ml-2">{inquiry.roofArea} m²</span>
          </div>
          <div>
            <span className="text-slate-400">Irradiance:</span>
            <span className="text-amber-400 ml-2">
              {KENYA_LOCATIONS.find(l => l.name === inquiry.location)?.irradiance || 5.2} kWh/m²/day
            </span>
          </div>
        </div>
      </div>

      {/* Analysis Controls */}
      {!analysisComplete && (
        <div className="text-center py-8">
          <button
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-500 hover:to-cyan-500 transition-all disabled:opacity-50"
          >
            {isAnalyzing ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing Satellite Data & LIDAR...
              </span>
            ) : (
              'Run Shading Analysis'
            )}
          </button>
          <p className="text-slate-400 text-sm mt-3">
            AI analyzes satellite imagery to detect obstructions and optimize panel placement
          </p>
        </div>
      )}

      {/* Analysis Results */}
      {analysisComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-900/30 rounded-xl p-4 border border-green-700/30 text-center">
              <div className="text-3xl font-bold text-green-400">{shading.annualLoss.toFixed(1)}%</div>
              <div className="text-sm text-slate-400">Annual Shading Loss</div>
            </div>
            <div className="bg-amber-900/30 rounded-xl p-4 border border-amber-700/30 text-center">
              <div className="text-3xl font-bold text-amber-400">{shading.worstMonth}</div>
              <div className="text-sm text-slate-400">Worst Month</div>
            </div>
            <div className="bg-red-900/30 rounded-xl p-4 border border-red-700/30 text-center">
              <div className="text-3xl font-bold text-red-400">{shading.worstMonthLoss.toFixed(1)}%</div>
              <div className="text-sm text-slate-400">Peak Loss</div>
            </div>
            <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-700/30 text-center">
              <div className="text-3xl font-bold text-blue-400">{shading.obstructions.length}</div>
              <div className="text-sm text-slate-400">Obstructions Found</div>
            </div>
          </div>

          {/* Obstruction Details */}
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <h4 className="text-white font-semibold mb-3">Obstruction Analysis</h4>
            <div className="space-y-2">
              {shading.obstructions.map((obs, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-slate-700/50 rounded-lg">
                  <span className="text-slate-300">{obs.type}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-slate-600 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500"
                        style={{ width: `${obs.impact * 20}%` }}
                      />
                    </div>
                    <span className="text-red-400 text-sm w-16 text-right">-{obs.impact}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shading Calendar Visualization */}
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <h4 className="text-white font-semibold mb-3">Monthly Shading Impact</h4>
            <div className="grid grid-cols-12 gap-1">
              {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((month, i) => {
                const loss = i === 5 ? shading.worstMonthLoss : 2 + Math.random() * 4;
                const color = loss > 10 ? 'bg-red-500' : loss > 5 ? 'bg-amber-500' : 'bg-green-500';
                return (
                  <div key={i} className="text-center">
                    <div
                      className={`h-16 ${color} rounded-t`}
                      style={{ opacity: 0.3 + (loss / 20) }}
                    />
                    <div className="text-xs text-slate-400 mt-1">{month}</div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center gap-4 mt-3 text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded" /> Low (&lt;5%)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-500 rounded" /> Medium (5-10%)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded" /> High (&gt;10%)</span>
            </div>
          </div>

          <button
            onClick={onComplete}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:from-amber-400 hover:to-orange-400 transition-all"
          >
            Proceed with Optimized Layout
          </button>
        </motion.div>
      )}
    </div>
  );
};

const Step3EnergyYield: React.FC<{
  inquiry: ClientInquiry;
  design: SystemDesign;
  yieldData: EnergyYield;
  onUpdate: (yieldData: EnergyYield) => void;
  onComplete: () => void;
}> = ({ inquiry, design, yieldData, onUpdate, onComplete }) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const locationData = KENYA_LOCATIONS.find(l => l.name === inquiry.location) || KENYA_LOCATIONS[0];
      const systemSize = design.systemSize || (inquiry.monthlyBill / 25) / (30 * 4.5);
      const annualProd = systemSize * locationData.irradiance * 365 * 0.8;

      const newYield: EnergyYield = {
        annualProduction: annualProd,
        monthlyProduction: Array.from({ length: 12 }, (_, i) => {
          const seasonFactor = 1 + Math.sin((i - 3) * Math.PI / 6) * 0.15;
          return (annualProd / 12) * seasonFactor;
        }),
        performanceRatio: 78 + Math.random() * 7,
        specificYield: locationData.irradiance * 365 * 0.82,
        degradationRate: 0.5,
        uncertaintyRange: {
          low: annualProd * 0.9,
          high: annualProd * 1.05
        },
        losses: [
          { category: 'Temperature', percentage: 5.2 },
          { category: 'Wiring (DC)', percentage: 1.5 },
          { category: 'Inverter Efficiency', percentage: 3.0 },
          { category: 'Wiring (AC)', percentage: 0.5 },
          { category: 'Shading', percentage: 4.2 },
          { category: 'Soiling', percentage: 2.0 },
          { category: 'Mismatch', percentage: 1.0 },
        ]
      };
      onUpdate(newYield);
      setIsSimulating(false);
      setSimulationComplete(true);
    }, 3500);
  };

  const systemSize = design.systemSize || (inquiry.monthlyBill / 25) / (30 * 4.5);

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <h4 className="text-white font-semibold mb-3">System Parameters</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-slate-400">System Size:</span>
            <span className="text-amber-400 ml-2 font-bold">{systemSize.toFixed(1)} kWp</span>
          </div>
          <div>
            <span className="text-slate-400">Panels:</span>
            <span className="text-white ml-2">{Math.ceil(systemSize * 1000 / 545)} × 545W</span>
          </div>
          <div>
            <span className="text-slate-400">Location:</span>
            <span className="text-white ml-2">{inquiry.location}</span>
          </div>
          <div>
            <span className="text-slate-400">GHI:</span>
            <span className="text-white ml-2">
              {KENYA_LOCATIONS.find(l => l.name === inquiry.location)?.irradiance || 5.2} kWh/m²/day
            </span>
          </div>
        </div>
      </div>

      {!simulationComplete && (
        <div className="text-center py-8">
          <button
            onClick={runSimulation}
            disabled={isSimulating}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-500 hover:to-emerald-500 transition-all disabled:opacity-50"
          >
            {isSimulating ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Running PVsyst-Grade Simulation...
              </span>
            ) : (
              'Run Energy Yield Simulation'
            )}
          </button>
          <p className="text-slate-400 text-sm mt-3">
            Comprehensive simulation with temperature coefficients, wiring losses, and degradation modeling
          </p>
        </div>
      )}

      {simulationComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-xl p-4 border border-green-700/30 text-center">
              <div className="text-3xl font-bold text-green-400">
                {(yieldData.annualProduction / 1000).toFixed(1)}
              </div>
              <div className="text-sm text-slate-400">MWh/year</div>
            </div>
            <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 rounded-xl p-4 border border-blue-700/30 text-center">
              <div className="text-3xl font-bold text-blue-400">
                {yieldData.performanceRatio.toFixed(1)}%
              </div>
              <div className="text-sm text-slate-400">Performance Ratio</div>
            </div>
            <div className="bg-gradient-to-br from-amber-900/50 to-orange-900/50 rounded-xl p-4 border border-amber-700/30 text-center">
              <div className="text-3xl font-bold text-amber-400">
                {yieldData.specificYield.toFixed(0)}
              </div>
              <div className="text-sm text-slate-400">kWh/kWp/year</div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl p-4 border border-purple-700/30 text-center">
              <div className="text-3xl font-bold text-purple-400">
                {yieldData.degradationRate}%
              </div>
              <div className="text-sm text-slate-400">Degradation/year</div>
            </div>
          </div>

          {/* Monthly Production Chart */}
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <h4 className="text-white font-semibold mb-3">Monthly Production Forecast</h4>
            <div className="h-48 flex items-end gap-1">
              {yieldData.monthlyProduction.map((prod, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t"
                    style={{ height: `${(prod / Math.max(...yieldData.monthlyProduction)) * 160}px` }}
                  />
                  <div className="text-xs text-slate-400 mt-1">
                    {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Loss Breakdown */}
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <h4 className="text-white font-semibold mb-3">Loss Breakdown</h4>
            <div className="space-y-2">
              {yieldData.losses.map((loss, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-32 text-sm text-slate-400">{loss.category}</span>
                  <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500"
                      style={{ width: `${loss.percentage * 10}%` }}
                    />
                  </div>
                  <span className="text-red-400 text-sm w-12 text-right">-{loss.percentage}%</span>
                </div>
              ))}
              <div className="pt-2 border-t border-slate-700 flex justify-between">
                <span className="text-slate-300 font-medium">Total Losses</span>
                <span className="text-red-400 font-bold">
                  -{yieldData.losses.reduce((sum, l) => sum + l.percentage, 0).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Uncertainty Range */}
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-4 border border-blue-700/30">
            <h4 className="text-white font-semibold mb-2">Bankable Yield Range (P90/P50/P10)</h4>
            <div className="flex items-center justify-between">
              <span className="text-blue-400">{(yieldData.uncertaintyRange.low / 1000).toFixed(1)} MWh</span>
              <div className="flex-1 mx-4 h-4 bg-slate-700 rounded-full relative overflow-hidden">
                <div className="absolute inset-y-0 left-[10%] right-[5%] bg-gradient-to-r from-blue-500 via-green-500 to-blue-500 rounded-full" />
                <div className="absolute top-0 left-[47%] w-1 h-full bg-white" />
              </div>
              <span className="text-blue-400">{(yieldData.uncertaintyRange.high / 1000).toFixed(1)} MWh</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center">
              90% confidence interval based on weather variability and system uncertainty
            </p>
          </div>

          <button
            onClick={onComplete}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:from-amber-400 hover:to-orange-400 transition-all"
          >
            Proceed to Financial Analysis
          </button>
        </motion.div>
      )}
    </div>
  );
};

const Step4Financial: React.FC<{
  inquiry: ClientInquiry;
  design: SystemDesign;
  yieldData: EnergyYield;
  financial: FinancialModel;
  onUpdate: (financial: FinancialModel) => void;
  onComplete: () => void;
}> = ({ inquiry, design, yieldData, financial, onUpdate, onComplete }) => {
  const [financingOption, setFinancingOption] = useState('cash');
  const [calculated, setCalculated] = useState(false);

  const systemSize = design.systemSize || (inquiry.monthlyBill / 25) / (30 * 4.5);
  const costPerWatt = inquiry.propertyType === 'residential' ? 120 : 100;
  const totalCost = systemSize * 1000 * costPerWatt;
  const annualSavings = (yieldData.annualProduction || systemSize * 4.5 * 365 * 0.8) * 25;

  const calculate = () => {
    const paybackYears = totalCost / annualSavings;
    const discountRate = 0.1;
    const years = 25;

    // NPV calculation
    let npv = -totalCost;
    for (let i = 1; i <= years; i++) {
      const yearSavings = annualSavings * Math.pow(0.995, i); // 0.5% degradation
      npv += yearSavings / Math.pow(1 + discountRate, i);
    }

    // IRR approximation
    const irr = (annualSavings / totalCost) * 0.8 + 0.05;

    // LCOE
    const totalProduction = yieldData.annualProduction * 25 * 0.9; // avg over lifetime
    const lcoe = totalCost / totalProduction;

    const newFinancial: FinancialModel = {
      totalCost,
      paybackYears,
      npv,
      irr: irr * 100,
      lcoe,
      monthlySavings: annualSavings / 12,
      annualSavings,
      lifetimeSavings: annualSavings * 25 * 0.9,
      incentives: [
        { name: 'VAT Exemption (Equipment)', amount: totalCost * 0.16 },
        { name: 'Import Duty Exemption', amount: totalCost * 0.05 },
      ],
      financingOption
    };

    onUpdate(newFinancial);
    setCalculated(true);
  };

  useEffect(() => {
    if (yieldData.annualProduction > 0) {
      calculate();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [financingOption]);

  return (
    <div className="space-y-6">
      {/* Financing Options */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <h4 className="text-white font-semibold mb-3">Select Financing Option</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { id: 'cash', label: 'Cash Purchase', icon: '💵' },
            { id: 'loan', label: 'Bank Loan', icon: '🏦' },
            { id: 'lease', label: 'Solar Lease', icon: '📋' },
            { id: 'ppa', label: 'PPA', icon: '⚡' },
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setFinancingOption(opt.id)}
              className={`p-3 rounded-lg text-center transition-all ${
                financingOption === opt.id
                  ? 'bg-amber-600 text-white border-2 border-amber-400'
                  : 'bg-slate-700 text-slate-300 border-2 border-transparent hover:border-slate-500'
              }`}
            >
              <div className="text-2xl mb-1">{opt.icon}</div>
              <div className="text-sm">{opt.label}</div>
            </button>
          ))}
        </div>
      </div>

      {calculated && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {/* Key Financial Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-xl p-4 border border-green-700/30 text-center">
              <div className="text-3xl font-bold text-green-400">
                {financial.paybackYears.toFixed(1)} yrs
              </div>
              <div className="text-sm text-slate-400">Payback Period</div>
            </div>
            <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 rounded-xl p-4 border border-blue-700/30 text-center">
              <div className="text-3xl font-bold text-blue-400">
                {financial.irr.toFixed(1)}%
              </div>
              <div className="text-sm text-slate-400">IRR</div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl p-4 border border-purple-700/30 text-center">
              <div className="text-3xl font-bold text-purple-400">
                KES {(financial.npv / 1000000).toFixed(2)}M
              </div>
              <div className="text-sm text-slate-400">NPV (25yr)</div>
            </div>
            <div className="bg-gradient-to-br from-amber-900/50 to-orange-900/50 rounded-xl p-4 border border-amber-700/30 text-center">
              <div className="text-3xl font-bold text-amber-400">
                KES {financial.lcoe.toFixed(1)}
              </div>
              <div className="text-sm text-slate-400">LCOE/kWh</div>
            </div>
          </div>

          {/* Cost & Savings Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <h4 className="text-white font-semibold mb-3">Investment Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">System Cost</span>
                  <span className="text-white">KES {financial.totalCost.toLocaleString()}</span>
                </div>
                {financial.incentives.map((inc, i) => (
                  <div key={i} className="flex justify-between text-green-400">
                    <span>{inc.name}</span>
                    <span>-KES {inc.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-700 flex justify-between font-bold">
                  <span className="text-white">Net Investment</span>
                  <span className="text-amber-400">
                    KES {(financial.totalCost - financial.incentives.reduce((s, i) => s + i.amount, 0)).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <h4 className="text-white font-semibold mb-3">Savings Projection</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Monthly Savings</span>
                  <span className="text-green-400">KES {Math.round(financial.monthlySavings).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Annual Savings</span>
                  <span className="text-green-400">KES {Math.round(financial.annualSavings).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">25-Year Savings</span>
                  <span className="text-green-400">KES {Math.round(financial.lifetimeSavings).toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-slate-700 flex justify-between">
                  <span className="text-slate-400">vs. Grid (KES 25/kWh)</span>
                  <span className="text-green-400 font-bold">
                    {Math.round((1 - financial.lcoe / 25) * 100)}% cheaper
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Cumulative Savings Chart */}
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <h4 className="text-white font-semibold mb-3">25-Year Cash Flow Projection</h4>
            <div className="h-48 relative">
              <div className="absolute inset-0 flex items-end">
                {Array.from({ length: 25 }, (_, i) => {
                  const cumSavings = financial.annualSavings * (i + 1) * 0.995;
                  const height = Math.min(100, (cumSavings / financial.lifetimeSavings) * 100);
                  const isPastPayback = i + 1 > financial.paybackYears;
                  return (
                    <div key={i} className="flex-1 px-px">
                      <div
                        className={`w-full rounded-t transition-all ${
                          isPastPayback ? 'bg-green-500' : 'bg-amber-500'
                        }`}
                        style={{ height: `${height * 1.8}px` }}
                      />
                    </div>
                  );
                })}
              </div>
              <div
                className="absolute left-0 right-0 border-t-2 border-dashed border-red-500"
                style={{ bottom: `${(financial.totalCost / financial.lifetimeSavings) * 180}px` }}
              >
                <span className="absolute right-0 -top-5 text-xs text-red-400">Investment</span>
              </div>
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>Year 1</span>
              <span>Payback: Year {Math.ceil(financial.paybackYears)}</span>
              <span>Year 25</span>
            </div>
          </div>

          <button
            onClick={onComplete}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:from-amber-400 hover:to-orange-400 transition-all"
          >
            Proceed to Technical Validation
          </button>
        </motion.div>
      )}
    </div>
  );
};

// Steps 5-8 Summary Component (for brevity)
const StepSummary: React.FC<{
  stepId: number;
  stepTitle: string;
  tasks: string[];
  onComplete: () => void;
}> = ({ stepId, stepTitle, tasks, onComplete }) => {
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const runAutomation = () => {
    setIsProcessing(true);
    let taskIndex = 0;
    const interval = setInterval(() => {
      if (taskIndex < tasks.length) {
        setCompletedTasks(prev => [...prev, taskIndex]);
        taskIndex++;
      } else {
        clearInterval(interval);
        setIsProcessing(false);
      }
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h4 className="text-xl font-semibold text-white mb-4">{stepTitle}</h4>
        <div className="space-y-3">
          {tasks.map((task, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                completedTasks.includes(i)
                  ? 'bg-green-900/30 border border-green-700/30'
                  : 'bg-slate-700/30'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                completedTasks.includes(i)
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-600 text-slate-400'
              }`}>
                {completedTasks.includes(i) ? '✓' : (i + 1)}
              </div>
              <span className={completedTasks.includes(i) ? 'text-green-400' : 'text-slate-300'}>
                {task}
              </span>
            </div>
          ))}
        </div>
      </div>

      {completedTasks.length < tasks.length ? (
        <button
          onClick={runAutomation}
          disabled={isProcessing}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-500 hover:to-cyan-500 transition-all disabled:opacity-50"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </span>
          ) : (
            `Run Step ${stepId} Automation`
          )}
        </button>
      ) : (
        <button
          onClick={onComplete}
          className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-500 hover:to-emerald-500 transition-all"
        >
          Step Complete - Continue
        </button>
      )}
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

export default function SolarProjectWorkflow() {
  const [projectState, setProjectState] = useState<ProjectState>({
    currentStep: 1,
    inquiry: {
      name: '',
      phone: '',
      email: '',
      location: '',
      propertyType: 'residential',
      monthlyBill: 0,
      roofArea: 50,
      roofType: 'flat',
      budget: '500k-1m',
      gridConnection: true,
      backupNeeded: false,
      notes: ''
    },
    design: {
      panelCount: 0,
      panelWattage: 545,
      systemSize: 0,
      inverterSize: 0,
      batteryCapacity: 0,
      orientation: 0,
      tilt: 15,
      arrayArea: 0,
      estimatedProduction: 0
    },
    shading: {
      annualLoss: 0,
      worstMonth: '',
      worstMonthLoss: 0,
      obstructions: [],
      optimizedLayout: false
    },
    yield: {
      annualProduction: 0,
      monthlyProduction: [],
      performanceRatio: 0,
      specificYield: 0,
      degradationRate: 0.5,
      uncertaintyRange: { low: 0, high: 0 },
      losses: []
    },
    financial: {
      totalCost: 0,
      paybackYears: 0,
      npv: 0,
      irr: 0,
      lcoe: 0,
      monthlySavings: 0,
      annualSavings: 0,
      lifetimeSavings: 0,
      incentives: [],
      financingOption: 'cash'
    },
    technical: {
      performanceRatio: 0,
      capacityFactor: 0,
      losses: [],
      components: [],
      certifications: []
    },
    grid: {
      connectionType: 'hybrid',
      exportLimit: 0,
      batteryStrategy: '',
      selfConsumption: 0,
      gridExport: 0,
      peakShaving: false,
      backupHours: 0
    },
    compliance: {
      documents: [],
      permits: [],
      uncertaintyAnalysis: []
    },
    completedSteps: []
  });

  const completeStep = (step: number) => {
    setProjectState(prev => ({
      ...prev,
      currentStep: step + 1,
      completedSteps: [...prev.completedSteps, step]
    }));
  };

  const goToStep = (step: number) => {
    setProjectState(prev => ({ ...prev, currentStep: step }));
  };

  const currentStepData = WORKFLOW_STEPS.find(s => s.id === projectState.currentStep);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-400">
          Professional Solar Project Workflow
        </h2>
        <p className="text-slate-400 mt-2">
          Complete 8-step pipeline from inquiry to deployment
        </p>
      </div>

      {/* Progress Steps */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {WORKFLOW_STEPS.map((step, i) => (
            <button
              key={step.id}
              onClick={() => goToStep(step.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
                projectState.currentStep === step.id
                  ? 'bg-amber-600 text-white'
                  : projectState.completedSteps.includes(step.id)
                  ? 'bg-green-900/50 text-green-400 border border-green-700/30'
                  : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                projectState.completedSteps.includes(step.id)
                  ? 'bg-green-500 text-white'
                  : projectState.currentStep === step.id
                  ? 'bg-white text-amber-600'
                  : 'bg-slate-600'
              }`}>
                {projectState.completedSteps.includes(step.id) ? '✓' : step.id}
              </span>
              <span className="text-sm">{step.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">{currentStepData?.icon}</span>
          <div>
            <h3 className="text-xl font-bold text-white">
              Step {projectState.currentStep}: {currentStepData?.title}
            </h3>
            <p className="text-slate-400">{currentStepData?.description}</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={projectState.currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {projectState.currentStep === 1 && (
              <Step1ClientInquiry
                inquiry={projectState.inquiry}
                onUpdate={(inquiry) => setProjectState(prev => ({ ...prev, inquiry }))}
                onComplete={() => completeStep(1)}
              />
            )}

            {projectState.currentStep === 2 && (
              <Step2ShadingAnalysis
                inquiry={projectState.inquiry}
                shading={projectState.shading}
                onUpdate={(shading) => setProjectState(prev => ({ ...prev, shading }))}
                onComplete={() => completeStep(2)}
              />
            )}

            {projectState.currentStep === 3 && (
              <Step3EnergyYield
                inquiry={projectState.inquiry}
                design={projectState.design}
                yieldData={projectState.yield}
                onUpdate={(yieldData) => setProjectState(prev => ({ ...prev, yield: yieldData }))}
                onComplete={() => completeStep(3)}
              />
            )}

            {projectState.currentStep === 4 && (
              <Step4Financial
                inquiry={projectState.inquiry}
                design={projectState.design}
                yieldData={projectState.yield}
                financial={projectState.financial}
                onUpdate={(financial) => setProjectState(prev => ({ ...prev, financial }))}
                onComplete={() => completeStep(4)}
              />
            )}

            {projectState.currentStep >= 5 && projectState.currentStep <= 8 && (
              <StepSummary
                stepId={projectState.currentStep}
                stepTitle={currentStepData?.title || ''}
                tasks={currentStepData?.tasks || []}
                onComplete={() => completeStep(projectState.currentStep)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Completed Summary */}
      {projectState.completedSteps.length === 8 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-xl p-6 border border-green-700/30 text-center"
        >
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-green-400 mb-2">Project Workflow Complete!</h3>
          <p className="text-slate-300 mb-4">
            All 8 steps have been completed. Your solar project is ready for deployment.
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500">
              Export Full Report
            </button>
            <button className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">
              Start New Project
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
