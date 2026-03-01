'use client';

/**
 * SOLAR BIBLE CALCULATOR ENGINE - Part 2
 * The complete AI-powered calculation engine
 *
 * @copyright 2026 EmersonEIMS - Solar Bible
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun, Battery, Zap, Calculator, TrendingUp, Thermometer,
  MapPin, Home, Building2, Factory, Hotel, Hospital,
  AlertTriangle, CheckCircle, Download, Send, ChevronRight,
  ChevronDown, Settings, Search, Filter, BarChart3, LineChart,
  Cpu, Wifi, Shield, Clock, DollarSign, Leaf, Phone, MessageCircle,
  FileText, Cable, Gauge, Activity, Target, Lightbulb, RefreshCw,
  GraduationCap, Church, Warehouse, X, Plus, Minus
} from 'lucide-react';
import {
  SOLAR_PANELS, BATTERIES, INVERTERS, KENYA_CLIMATE, ELECTRICITY_TARIFFS,
  type SolarPanel, type BatteryUnit, type Inverter
} from './SolarBibleCalculator';

// ═══════════════════════════════════════════════════════════════════════════════
// CALCULATION ENGINE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface Appliance {
  name: string;
  watts: number;
  quantity: number;
  hoursPerDay: number;
}

interface SystemDesign {
  panels: { panel: SolarPanel; quantity: number }[];
  batteries: { battery: BatteryUnit; quantity: number }[];
  inverter: Inverter;
  totalPanelWattage: number;
  totalBatteryCapacity: number; // kWh
  systemVoltage: 12 | 24 | 48;
  estimatedDailyProduction: number;
  autonomyDays: number;
}

interface CostAnalysis {
  equipmentCost: number;
  installationCost: number;
  totalCost: number;
  monthlySavings: number;
  annualSavings: number;
  paybackPeriod: number;
  roi25Years: number;
  gridCostPerMonth: number;
  generatorCostPerMonth: number;
  solarCostPerMonth: number;
}

interface HealthAnalysis {
  panelHealth: number;
  batteryHealth: number;
  inverterHealth: number;
  predictedFailures: string[];
  maintenanceSchedule: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// WIRE SIZING CALCULATOR
// ═══════════════════════════════════════════════════════════════════════════════

const WIRE_SIZES = [
  { awg: 14, mm2: 2.08, maxAmps12v: 15, maxAmps24v: 20, maxAmps48v: 25 },
  { awg: 12, mm2: 3.31, maxAmps12v: 20, maxAmps24v: 25, maxAmps48v: 30 },
  { awg: 10, mm2: 5.26, maxAmps12v: 30, maxAmps24v: 40, maxAmps48v: 55 },
  { awg: 8, mm2: 8.37, maxAmps12v: 40, maxAmps24v: 55, maxAmps48v: 70 },
  { awg: 6, mm2: 13.3, maxAmps12v: 55, maxAmps24v: 75, maxAmps48v: 95 },
  { awg: 4, mm2: 21.15, maxAmps12v: 70, maxAmps24v: 95, maxAmps48v: 125 },
  { awg: 2, mm2: 33.62, maxAmps12v: 95, maxAmps24v: 130, maxAmps48v: 170 },
  { awg: 1, mm2: 42.41, maxAmps12v: 110, maxAmps24v: 150, maxAmps48v: 195 },
  { awg: 0, mm2: 53.49, maxAmps12v: 125, maxAmps24v: 170, maxAmps48v: 230 },
  { awg: -1, mm2: 67.43, maxAmps12v: 145, maxAmps24v: 195, maxAmps48v: 265 }, // 2/0
  { awg: -2, mm2: 85.01, maxAmps12v: 165, maxAmps24v: 225, maxAmps48v: 310 }, // 3/0
  { awg: -3, mm2: 107.2, maxAmps12v: 195, maxAmps24v: 260, maxAmps48v: 360 }, // 4/0
];

function calculateWireSize(current: number, voltage: number, distance: number): { mm2: number; awg: number | string } {
  // Calculate required wire size based on current, voltage, and distance
  // Allow max 3% voltage drop
  const maxVoltageDrop = voltage * 0.03;
  const resistivity = 0.0172; // ohm·mm²/m for copper

  // R = V / I, and R = resistivity × length / area
  // So area = (resistivity × 2 × distance × current) / maxVoltageDrop
  const minArea = (resistivity * 2 * distance * current) / maxVoltageDrop;

  // Find the wire that meets both current capacity and voltage drop requirements
  const voltageKey = voltage <= 12 ? 'maxAmps12v' : voltage <= 24 ? 'maxAmps24v' : 'maxAmps48v';

  for (const wire of WIRE_SIZES) {
    if (wire.mm2 >= minArea && wire[voltageKey] >= current) {
      return { mm2: wire.mm2, awg: wire.awg < 0 ? `${Math.abs(wire.awg)}/0` : wire.awg };
    }
  }

  return { mm2: 107.2, awg: '4/0' }; // Return largest if nothing fits
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN CALCULATOR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function SolarBibleEngine() {
  // WIZARD STEPS
  const [step, setStep] = useState(1);
  const totalSteps = 7;

  // USER INPUTS
  const [propertyType, setPropertyType] = useState<string>('home');
  const [location, setLocation] = useState<string>('Nairobi');
  const [gridConnected, setGridConnected] = useState(false);
  const [backupHours, setBackupHours] = useState(8);
  const [budget, setBudget] = useState<'economy' | 'standard' | 'premium'>('standard');

  // APPLIANCES
  const [appliances, setAppliances] = useState<Appliance[]>([
    { name: 'LED Lights', watts: 10, quantity: 10, hoursPerDay: 6 },
    { name: 'TV', watts: 100, quantity: 1, hoursPerDay: 4 },
    { name: 'Refrigerator', watts: 150, quantity: 1, hoursPerDay: 24 },
    { name: 'Fan', watts: 60, quantity: 2, hoursPerDay: 8 },
    { name: 'Phone Charger', watts: 10, quantity: 4, hoursPerDay: 2 },
  ]);

  // EQUIPMENT SELECTION
  const [selectedPanel, setSelectedPanel] = useState<SolarPanel | null>(null);
  const [selectedBattery, setSelectedBattery] = useState<BatteryUnit | null>(null);
  const [selectedInverter, setSelectedInverter] = useState<Inverter | null>(null);

  // RESULTS
  const [systemDesign, setSystemDesign] = useState<SystemDesign | null>(null);
  const [costAnalysis, setCostAnalysis] = useState<CostAnalysis | null>(null);

  // UI STATE
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);

  const COMPANY_PHONE = '+254768860665';
  const COMPANY_WHATSAPP = '254768860665';

  // ═══════════════════════════════════════════════════════════════════════════════
  // CALCULATIONS
  // ═══════════════════════════════════════════════════════════════════════════════

  // Calculate total daily consumption
  const dailyConsumption = useMemo(() => {
    return appliances.reduce((total, app) => {
      return total + (app.watts * app.quantity * app.hoursPerDay) / 1000; // kWh
    }, 0);
  }, [appliances]);

  // Calculate peak load
  const peakLoad = useMemo(() => {
    return appliances.reduce((total, app) => {
      return total + (app.watts * app.quantity);
    }, 0);
  }, [appliances]);

  // Get climate data for location
  const climateData = useMemo(() => {
    return KENYA_CLIMATE[location] || KENYA_CLIMATE['Default'];
  }, [location]);

  // Calculate required system size
  const calculateSystemSize = useCallback(() => {
    setIsCalculating(true);

    setTimeout(() => {
      // Required panel wattage (accounting for losses)
      const efficiencyLoss = 0.8; // 20% system losses
      const tempDerate = 1 - ((climateData.avgTemp - 25) * 0.004); // Temperature derating
      const requiredPanelWattage = (dailyConsumption / (climateData.avgSunHours * efficiencyLoss * tempDerate)) * 1000;

      // Select best panel based on budget
      let panelPool = SOLAR_PANELS;
      if (budget === 'economy') panelPool = SOLAR_PANELS.filter(p => p.priceKES < 22000);
      else if (budget === 'premium') panelPool = SOLAR_PANELS.filter(p => p.efficiency > 21);

      const bestPanel = panelPool.sort((a, b) => (b.efficiency / b.priceKES) - (a.efficiency / a.priceKES))[0] || SOLAR_PANELS[0];
      const panelCount = Math.ceil(requiredPanelWattage / bestPanel.wattage);

      // Required battery capacity
      const requiredBatteryKwh = dailyConsumption * (backupHours / 24) / 0.8; // 80% DoD

      // Select best battery
      let batteryPool = BATTERIES;
      if (budget === 'economy') batteryPool = BATTERIES.filter(b => b.type !== 'LiFePO4');
      else if (budget === 'premium') batteryPool = BATTERIES.filter(b => b.type === 'LiFePO4');

      const bestBattery = batteryPool.sort((a, b) => (b.cycles / b.priceKES) - (a.cycles / a.priceKES))[0] || BATTERIES[0];
      const batteryKwh = (bestBattery.capacity * bestBattery.voltage) / 1000;
      const batteryCount = Math.ceil(requiredBatteryKwh / batteryKwh);

      // System voltage
      const systemVoltage: 12 | 24 | 48 = requiredPanelWattage > 3000 ? 48 : requiredPanelWattage > 1500 ? 24 : 12;

      // Select inverter
      const requiredInverterKw = peakLoad / 1000 * 1.25; // 25% headroom
      let inverterPool = INVERTERS.filter(inv => inv.ratedPower >= requiredInverterKw);
      if (budget === 'economy') inverterPool = inverterPool.filter(i => i.type === 'Off-Grid');
      else if (budget === 'premium') inverterPool = inverterPool.filter(i => i.type === 'Hybrid');

      const bestInverter = inverterPool.sort((a, b) => a.priceKES - b.priceKES)[0] || INVERTERS.find(i => i.ratedPower >= requiredInverterKw) || INVERTERS[0];

      // Calculate costs
      const panelCost = bestPanel.priceKES * panelCount;
      const batteryCost = bestBattery.priceKES * batteryCount;
      const inverterCost = bestInverter.priceKES;
      const accessoriesCost = (panelCost + batteryCost + inverterCost) * 0.15; // 15% for cables, mounting, etc.
      const installationCost = (panelCost + batteryCost + inverterCost) * 0.20; // 20% installation

      const totalCost = panelCost + batteryCost + inverterCost + accessoriesCost + installationCost;

      // Calculate savings
      const monthlyGridCost = dailyConsumption * 30 * 20; // Average KES 20/kWh
      const monthlySavings = monthlyGridCost * (gridConnected ? 0.7 : 1); // 70% savings if grid-tied
      const paybackYears = totalCost / (monthlySavings * 12);

      // Generator comparison (diesel at KES 150/L, 3kWh/L)
      const monthlyGeneratorCost = dailyConsumption * 30 * (150 / 3);

      setSystemDesign({
        panels: [{ panel: bestPanel, quantity: panelCount }],
        batteries: [{ battery: bestBattery, quantity: batteryCount }],
        inverter: bestInverter,
        totalPanelWattage: bestPanel.wattage * panelCount,
        totalBatteryCapacity: batteryKwh * batteryCount,
        systemVoltage,
        estimatedDailyProduction: (bestPanel.wattage * panelCount * climateData.avgSunHours * efficiencyLoss) / 1000,
        autonomyDays: (batteryKwh * batteryCount) / dailyConsumption,
      });

      setCostAnalysis({
        equipmentCost: panelCost + batteryCost + inverterCost + accessoriesCost,
        installationCost,
        totalCost,
        monthlySavings,
        annualSavings: monthlySavings * 12,
        paybackPeriod: paybackYears,
        roi25Years: (monthlySavings * 12 * 25) - totalCost,
        gridCostPerMonth: monthlyGridCost,
        generatorCostPerMonth: monthlyGeneratorCost,
        solarCostPerMonth: totalCost / (25 * 12), // Amortized over 25 years
      });

      setSelectedPanel(bestPanel);
      setSelectedBattery(bestBattery);
      setSelectedInverter(bestInverter);

      setIsCalculating(false);
      setStep(5);
    }, 1500);
  }, [dailyConsumption, peakLoad, climateData, backupHours, budget, gridConnected]);

  // ═══════════════════════════════════════════════════════════════════════════════
  // RENDER STEPS
  // ═══════════════════════════════════════════════════════════════════════════════

  const propertyTypes = [
    { id: 'home', name: 'Home', icon: <Home className="w-6 h-6" /> },
    { id: 'apartment', name: 'Apartment', icon: <Building2 className="w-6 h-6" /> },
    { id: 'office', name: 'Office', icon: <Building2 className="w-6 h-6" /> },
    { id: 'shop', name: 'Shop/Retail', icon: <Building2 className="w-6 h-6" /> },
    { id: 'hotel', name: 'Hotel/Lodge', icon: <Hotel className="w-6 h-6" /> },
    { id: 'hospital', name: 'Hospital/Clinic', icon: <Hospital className="w-6 h-6" /> },
    { id: 'school', name: 'School', icon: <GraduationCap className="w-6 h-6" /> },
    { id: 'church', name: 'Church/Mosque', icon: <Church className="w-6 h-6" /> },
    { id: 'factory', name: 'Factory', icon: <Factory className="w-6 h-6" /> },
    { id: 'warehouse', name: 'Warehouse', icon: <Warehouse className="w-6 h-6" /> },
  ];

  const locations = Object.keys(KENYA_CLIMATE).filter(l => l !== 'Default');

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-amber-500/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
            <Sun className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Solar Bible Calculator</h2>
            <p className="text-amber-100">World's Most Advanced Solar Sizing System</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-xs text-white/70 mb-2">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round((step / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="h-2 bg-black/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* STEP 1: Property Type */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="text-xl font-bold text-white mb-2">What type of property?</h3>
              <p className="text-gray-400 mb-6">Select your property type for accurate recommendations</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {propertyTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setPropertyType(type.id)}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                      propertyType === type.id
                        ? 'border-amber-500 bg-amber-500/20'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <span className={propertyType === type.id ? 'text-amber-500' : 'text-gray-400'}>
                      {type.icon}
                    </span>
                    <span className="text-sm text-white">{type.name}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                className="mt-6 w-full py-4 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-500 flex items-center justify-center gap-2"
              >
                Continue <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* STEP 2: Location */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="text-xl font-bold text-white mb-2">Where is your property?</h3>
              <p className="text-gray-400 mb-6">Location affects solar irradiance and system sizing</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-64 overflow-y-auto">
                {locations.map(loc => (
                  <button
                    key={loc}
                    onClick={() => setLocation(loc)}
                    className={`p-3 rounded-lg border transition-all flex items-center gap-2 ${
                      location === loc
                        ? 'border-amber-500 bg-amber-500/20'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <MapPin className={`w-4 h-4 ${location === loc ? 'text-amber-500' : 'text-gray-400'}`} />
                    <span className="text-sm text-white">{loc}</span>
                  </button>
                ))}
              </div>

              {/* Climate Info */}
              <div className="mt-4 p-4 bg-gray-800/50 rounded-xl">
                <h4 className="text-sm font-medium text-white mb-2">Climate Data for {location}</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <Sun className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                    <span className="text-lg font-bold text-white">{climateData.avgSunHours}</span>
                    <p className="text-xs text-gray-400">Sun Hours/Day</p>
                  </div>
                  <div>
                    <Thermometer className="w-5 h-5 text-red-500 mx-auto mb-1" />
                    <span className="text-lg font-bold text-white">{climateData.avgTemp}°C</span>
                    <p className="text-xs text-gray-400">Avg Temp</p>
                  </div>
                  <div>
                    <Zap className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
                    <span className="text-lg font-bold text-white">{climateData.irradiance}</span>
                    <p className="text-xs text-gray-400">kWh/m²/day</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="px-4 py-3 text-gray-400 hover:text-white">
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-4 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-500 flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Appliances */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="text-xl font-bold text-white mb-2">What appliances will you power?</h3>
              <p className="text-gray-400 mb-6">Add your electrical loads for accurate sizing</p>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {appliances.map((app, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <input
                      type="text"
                      value={app.name}
                      onChange={(e) => {
                        const newApps = [...appliances];
                        newApps[idx].name = e.target.value;
                        setAppliances(newApps);
                      }}
                      className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                    />
                    <input
                      type="number"
                      value={app.watts}
                      onChange={(e) => {
                        const newApps = [...appliances];
                        newApps[idx].watts = Number(e.target.value);
                        setAppliances(newApps);
                      }}
                      className="w-20 bg-gray-700 border border-gray-600 rounded px-2 py-2 text-white text-sm text-center"
                      placeholder="Watts"
                    />
                    <span className="text-xs text-gray-400">W</span>
                    <input
                      type="number"
                      value={app.quantity}
                      onChange={(e) => {
                        const newApps = [...appliances];
                        newApps[idx].quantity = Number(e.target.value);
                        setAppliances(newApps);
                      }}
                      className="w-16 bg-gray-700 border border-gray-600 rounded px-2 py-2 text-white text-sm text-center"
                      placeholder="Qty"
                    />
                    <span className="text-xs text-gray-400">×</span>
                    <input
                      type="number"
                      value={app.hoursPerDay}
                      onChange={(e) => {
                        const newApps = [...appliances];
                        newApps[idx].hoursPerDay = Number(e.target.value);
                        setAppliances(newApps);
                      }}
                      className="w-16 bg-gray-700 border border-gray-600 rounded px-2 py-2 text-white text-sm text-center"
                      placeholder="Hrs"
                    />
                    <span className="text-xs text-gray-400">hr/day</span>
                    <button
                      onClick={() => setAppliances(appliances.filter((_, i) => i !== idx))}
                      className="p-2 text-red-400 hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setAppliances([...appliances, { name: 'New Appliance', watts: 100, quantity: 1, hoursPerDay: 4 }])}
                className="mt-3 flex items-center gap-2 px-4 py-2 text-amber-500 hover:text-amber-400"
              >
                <Plus className="w-4 h-4" /> Add Appliance
              </button>

              {/* Summary */}
              <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-amber-400 text-sm">Daily Consumption</span>
                    <div className="text-2xl font-bold text-white">{dailyConsumption.toFixed(1)} kWh</div>
                  </div>
                  <div>
                    <span className="text-amber-400 text-sm">Peak Load</span>
                    <div className="text-2xl font-bold text-white">{(peakLoad / 1000).toFixed(1)} kW</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(2)} className="px-4 py-3 text-gray-400 hover:text-white">
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 py-4 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-500 flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Preferences */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="text-xl font-bold text-white mb-2">System Preferences</h3>
              <p className="text-gray-400 mb-6">Configure your system requirements</p>

              <div className="space-y-6">
                {/* Grid Connection */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Grid Connection</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setGridConnected(false)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        !gridConnected ? 'border-amber-500 bg-amber-500/20' : 'border-gray-700'
                      }`}
                    >
                      <span className="text-white font-medium">Off-Grid</span>
                      <p className="text-xs text-gray-400 mt-1">100% solar powered</p>
                    </button>
                    <button
                      onClick={() => setGridConnected(true)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        gridConnected ? 'border-amber-500 bg-amber-500/20' : 'border-gray-700'
                      }`}
                    >
                      <span className="text-white font-medium">Hybrid</span>
                      <p className="text-xs text-gray-400 mt-1">Grid + Solar backup</p>
                    </button>
                  </div>
                </div>

                {/* Backup Hours */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Backup Hours Required: {backupHours} hours
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="48"
                    value={backupHours}
                    onChange={(e) => setBackupHours(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>2 hrs</span>
                    <span>24 hrs</span>
                    <span>48 hrs</span>
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Budget Preference</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['economy', 'standard', 'premium'] as const).map(b => (
                      <button
                        key={b}
                        onClick={() => setBudget(b)}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          budget === b ? 'border-amber-500 bg-amber-500/20' : 'border-gray-700'
                        }`}
                      >
                        <span className="text-white font-medium capitalize">{b}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(3)} className="px-4 py-3 text-gray-400 hover:text-white">
                  Back
                </button>
                <button
                  onClick={calculateSystemSize}
                  disabled={isCalculating}
                  className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-500 hover:to-emerald-500 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isCalculating ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      AI Calculating...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-5 h-5" />
                      Calculate System
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: Results */}
          {step === 5 && systemDesign && costAnalysis && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-white">Your Recommended System</h3>
                <p className="text-gray-400">AI-optimized for {location}</p>
              </div>

              {/* System Summary */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center">
                  <Sun className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{(systemDesign.totalPanelWattage / 1000).toFixed(1)} kW</div>
                  <p className="text-xs text-gray-400">Solar Array</p>
                </div>
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-center">
                  <Battery className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{systemDesign.totalBatteryCapacity.toFixed(1)} kWh</div>
                  <p className="text-xs text-gray-400">Battery Storage</p>
                </div>
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl text-center">
                  <Zap className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{systemDesign.inverter.ratedPower} kW</div>
                  <p className="text-xs text-gray-400">Inverter</p>
                </div>
                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl text-center">
                  <Clock className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{systemDesign.autonomyDays.toFixed(1)}</div>
                  <p className="text-xs text-gray-400">Days Autonomy</p>
                </div>
              </div>

              {/* Cost Analysis */}
              <div className="p-4 bg-gray-800/50 rounded-xl mb-6">
                <h4 className="text-lg font-bold text-white mb-4">Cost Analysis</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Equipment Cost</span>
                    <span className="text-white font-medium">KES {costAnalysis.equipmentCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Installation</span>
                    <span className="text-white font-medium">KES {costAnalysis.installationCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-700 pt-3">
                    <span className="text-white font-bold">Total Investment</span>
                    <span className="text-amber-500 font-bold text-xl">KES {costAnalysis.totalCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Grid vs Solar vs Generator */}
              <div className="p-4 bg-gray-800/50 rounded-xl mb-6">
                <h4 className="text-lg font-bold text-white mb-4">Monthly Cost Comparison</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-24 text-gray-400 text-sm">Grid (KPLC)</div>
                    <div className="flex-1 h-6 bg-red-500/20 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500" style={{ width: '100%' }} />
                    </div>
                    <span className="text-red-400 font-medium">KES {costAnalysis.gridCostPerMonth.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 text-gray-400 text-sm">Generator</div>
                    <div className="flex-1 h-6 bg-orange-500/20 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500" style={{ width: `${(costAnalysis.generatorCostPerMonth / costAnalysis.gridCostPerMonth) * 100}%` }} />
                    </div>
                    <span className="text-orange-400 font-medium">KES {costAnalysis.generatorCostPerMonth.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 text-gray-400 text-sm">Solar</div>
                    <div className="flex-1 h-6 bg-green-500/20 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: `${(costAnalysis.solarCostPerMonth / costAnalysis.gridCostPerMonth) * 100}%` }} />
                    </div>
                    <span className="text-green-400 font-medium">KES {Math.round(costAnalysis.solarCostPerMonth).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* ROI */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-center">
                  <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{costAnalysis.paybackPeriod.toFixed(1)} yrs</div>
                  <p className="text-xs text-gray-400">Payback Period</p>
                </div>
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl text-center">
                  <DollarSign className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">KES {(costAnalysis.annualSavings / 1000).toFixed(0)}K</div>
                  <p className="text-xs text-gray-400">Annual Savings</p>
                </div>
                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl text-center">
                  <Target className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">KES {(costAnalysis.roi25Years / 1000000).toFixed(1)}M</div>
                  <p className="text-xs text-gray-400">25-Year ROI</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <a
                  href={`tel:${COMPANY_PHONE}`}
                  className="flex items-center justify-center gap-2 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-500"
                >
                  <Phone className="w-5 h-5" />
                  Call for Quote
                </a>
                <a
                  href={`https://wa.me/${COMPANY_WHATSAPP}?text=${encodeURIComponent(`Hi! I used the Solar Bible Calculator and need a ${(systemDesign.totalPanelWattage / 1000).toFixed(1)}kW system with ${systemDesign.totalBatteryCapacity.toFixed(1)}kWh battery for my ${propertyType} in ${location}. Total budget around KES ${costAnalysis.totalCost.toLocaleString()}. Please send me a detailed quotation.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-4 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#22c55e]"
                >
                  <MessageCircle className="w-5 h-5" />
                  Get WhatsApp Quote
                </a>
              </div>

              <button
                onClick={() => setStep(1)}
                className="mt-4 w-full py-3 text-gray-400 hover:text-white"
              >
                Start New Calculation
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-800/50 border-t border-gray-700">
        <p className="text-xs text-gray-500 text-center">
          Solar Bible Calculator v2.0 | AI-Powered by EmersonEIMS | 300+ Equipment Database
        </p>
      </div>
    </div>
  );
}
