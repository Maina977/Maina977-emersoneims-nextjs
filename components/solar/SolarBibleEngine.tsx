'use client';

/**
 * SOLAR BIBLE CALCULATOR ENGINE - Part 2
 * The complete AI-powered calculation engine
 *
 * @copyright 2026 EmersonEIMS - Solar Bible
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun, Battery, Zap, Calculator, TrendingUp, Thermometer,
  MapPin, Home, Building2, Factory, Hotel, Hospital,
  AlertTriangle, CheckCircle, Download, Send, ChevronRight,
  ChevronDown, Settings, Search, Filter, BarChart3, LineChart,
  Cpu, Wifi, Shield, Clock, DollarSign, Leaf, Phone, MessageCircle,
  FileText, Cable, Gauge, Activity, Target, Lightbulb, RefreshCw,
  GraduationCap, Church, Warehouse, X, Plus, Minus, Wrench,
  Heart, Brain, FileDown, Printer, AlertCircle, HelpCircle
} from 'lucide-react';
import {
  SOLAR_PANELS, BATTERIES, INVERTERS, ACCESSORIES, KENYA_CLIMATE, ELECTRICITY_TARIFFS,
  findOptimalSystem, calculateElectricityCost,
  type SolarPanel, type BatteryUnit, type Inverter, type Accessory, type OptimizationResult
} from './SolarEquipmentDatabase';
import {
  INVERTER_FAULT_CODES, BATTERY_FAULT_CODES, PANEL_FAULT_CODES,
  analyzeSystemHealth, type FaultCode, type HealthMetrics, type HealthReport
} from './SolarFaultCodes';

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
  // MODE SELECTOR (Calculator, Fault Codes, Health Analysis, AI Diagnosis)
  const [mode, setMode] = useState<'calculator' | 'faultcodes' | 'health' | 'ai'>('calculator');

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

  // FAULT CODE DIAGNOSIS
  const [faultCodeSearch, setFaultCodeSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('Deye');
  const [selectedFault, setSelectedFault] = useState<FaultCode | null>(null);
  const [equipmentType, setEquipmentType] = useState<'inverter' | 'battery' | 'panel'>('inverter');

  // HEALTH ANALYSIS
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics>({
    panelEfficiency: 95,
    batterySOH: 90,
    inverterEfficiency: 94,
    systemAge: 2,
    maintenanceScore: 85,
  });
  const [healthReport, setHealthReport] = useState<HealthReport | null>(null);

  // AI DIAGNOSIS
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // PDF REF
  const printRef = useRef<HTMLDivElement>(null);

  const COMPANY_PHONE = '+254768860665';
  const COMPANY_WHATSAPP = '254768860665';

  // ═══════════════════════════════════════════════════════════════════════════════
  // FAULT CODE SEARCH
  // ═══════════════════════════════════════════════════════════════════════════════

  const filteredFaultCodes = useMemo(() => {
    if (equipmentType === 'panel') {
      return PANEL_FAULT_CODES.filter(fc =>
        fc.code.toLowerCase().includes(faultCodeSearch.toLowerCase()) ||
        fc.description.toLowerCase().includes(faultCodeSearch.toLowerCase())
      );
    }

    const codes = equipmentType === 'inverter'
      ? INVERTER_FAULT_CODES[selectedBrand] || []
      : BATTERY_FAULT_CODES[selectedBrand] || [];

    if (!faultCodeSearch) return codes;

    return codes.filter(fc =>
      fc.code.toLowerCase().includes(faultCodeSearch.toLowerCase()) ||
      fc.description.toLowerCase().includes(faultCodeSearch.toLowerCase())
    );
  }, [equipmentType, selectedBrand, faultCodeSearch]);

  const inverterBrands = Object.keys(INVERTER_FAULT_CODES);
  const batteryBrands = Object.keys(BATTERY_FAULT_CODES);

  // ═══════════════════════════════════════════════════════════════════════════════
  // HEALTH ANALYSIS
  // ═══════════════════════════════════════════════════════════════════════════════

  const runHealthAnalysis = useCallback(() => {
    const report = analyzeSystemHealth(healthMetrics);
    setHealthReport(report);
  }, [healthMetrics]);

  // ═══════════════════════════════════════════════════════════════════════════════
  // AI DIAGNOSIS
  // ═══════════════════════════════════════════════════════════════════════════════

  const runAIDiagnosis = useCallback(async () => {
    if (!aiQuery.trim()) return;

    setIsAiLoading(true);
    setAiResponse('');

    try {
      const response = await fetch('/api/ai/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: aiQuery,
          context: 'solar',
          systemInfo: systemDesign ? {
            panelWattage: systemDesign.totalPanelWattage,
            batteryCapacity: systemDesign.totalBatteryCapacity,
            inverterPower: systemDesign.inverter?.ratedPower,
          } : null,
        }),
      });

      const data = await response.json();
      setAiResponse(data.diagnosis || data.response || 'Unable to get AI response. Please try again.');
    } catch (error) {
      setAiResponse('Error connecting to AI service. Please check your internet connection and try again.');
    }

    setIsAiLoading(false);
  }, [aiQuery, systemDesign]);

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

  // Calculate required system size using advanced optimization algorithm
  const calculateSystemSize = useCallback(() => {
    setIsCalculating(true);

    setTimeout(() => {
      // Use the advanced optimization algorithm from SolarEquipmentDatabase
      const optimizedSystems = findOptimalSystem(
        dailyConsumption,
        peakLoad,
        backupHours,
        location,
        budget,
        gridConnected
      );

      if (optimizedSystems.length === 0) {
        setIsCalculating(false);
        alert('No suitable system found. Please adjust your requirements.');
        return;
      }

      // Select the cheapest optimal system
      const bestSystem = optimizedSystems[0];

      // Calculate accurate electricity costs
      const monthlyConsumption = dailyConsumption * 30;
      const monthlyGridCost = calculateElectricityCost(monthlyConsumption);
      const monthlyGeneratorCost = dailyConsumption * 30 * (160 / 3); // Diesel at KES 160/L, 3kWh/L

      const systemVoltage: 12 | 24 | 48 = bestSystem.systemSpecs.systemVoltage >= 48 ? 48 :
                                          bestSystem.systemSpecs.systemVoltage >= 24 ? 24 : 12;

      setSystemDesign({
        panels: bestSystem.panels,
        batteries: bestSystem.batteries,
        inverter: bestSystem.inverter,
        totalPanelWattage: bestSystem.systemSpecs.totalWattage,
        totalBatteryCapacity: bestSystem.systemSpecs.totalBatteryKwh,
        systemVoltage,
        estimatedDailyProduction: bestSystem.systemSpecs.dailyProduction,
        autonomyDays: bestSystem.systemSpecs.autonomyDays,
      });

      setCostAnalysis({
        equipmentCost: bestSystem.costBreakdown.panels + bestSystem.costBreakdown.batteries +
                       bestSystem.costBreakdown.inverter + bestSystem.costBreakdown.accessories,
        installationCost: bestSystem.costBreakdown.installation,
        totalCost: bestSystem.totalCost,
        monthlySavings: bestSystem.roi.monthlySavings,
        annualSavings: bestSystem.roi.monthlySavings * 12,
        paybackPeriod: bestSystem.roi.paybackYears,
        roi25Years: bestSystem.roi.twentyFiveYearSavings,
        gridCostPerMonth: monthlyGridCost,
        generatorCostPerMonth: monthlyGeneratorCost,
        solarCostPerMonth: bestSystem.totalCost / (25 * 12),
      });

      if (bestSystem.panels[0]) setSelectedPanel(bestSystem.panels[0].panel);
      if (bestSystem.batteries[0]) setSelectedBattery(bestSystem.batteries[0].battery);
      setSelectedInverter(bestSystem.inverter);

      setIsCalculating(false);
      setStep(5);
    }, 1500);
  }, [dailyConsumption, peakLoad, location, backupHours, budget, gridConnected]);

  // ═══════════════════════════════════════════════════════════════════════════════
  // PDF GENERATION
  // ═══════════════════════════════════════════════════════════════════════════════

  const generatePDF = useCallback(() => {
    if (!systemDesign || !costAnalysis) {
      alert('Please complete a system calculation first.');
      return;
    }

    // Create printable content
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Solar System Quotation - EmersonEIMS</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
          .header { text-align: center; border-bottom: 2px solid #f59e0b; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { color: #f59e0b; margin: 0; }
          .header p { color: #666; margin: 5px 0; }
          .section { margin-bottom: 25px; }
          .section h2 { color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0; }
          th { background: #f8fafc; }
          .total-row { font-weight: bold; background: #fef3c7; }
          .highlight { color: #f59e0b; font-weight: bold; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #666; }
          .contact { background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>☀️ SOLAR SYSTEM QUOTATION</h1>
          <p>EmersonEIMS - Solar Bible Calculator</p>
          <p>Generated: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
        </div>

        <div class="section">
          <h2>Customer Details</h2>
          <table>
            <tr><td><strong>Property Type:</strong></td><td>${propertyType}</td></tr>
            <tr><td><strong>Location:</strong></td><td>${location}, Kenya</td></tr>
            <tr><td><strong>System Type:</strong></td><td>${gridConnected ? 'Hybrid (Grid-Tied)' : 'Off-Grid'}</td></tr>
            <tr><td><strong>Daily Consumption:</strong></td><td>${dailyConsumption.toFixed(1)} kWh</td></tr>
            <tr><td><strong>Backup Required:</strong></td><td>${backupHours} hours</td></tr>
          </table>
        </div>

        <div class="section">
          <h2>Recommended System</h2>
          <table>
            <tr><th>Component</th><th>Specification</th><th>Quantity</th></tr>
            <tr>
              <td>Solar Panels</td>
              <td>${systemDesign.panels[0]?.panel.brand} ${systemDesign.panels[0]?.panel.model} (${systemDesign.panels[0]?.panel.wattage}W)</td>
              <td>${systemDesign.panels[0]?.quantity} pcs</td>
            </tr>
            <tr>
              <td>Battery Bank</td>
              <td>${systemDesign.batteries[0]?.battery.brand} ${systemDesign.batteries[0]?.battery.model} (${systemDesign.batteries[0]?.battery.capacity}Ah ${systemDesign.batteries[0]?.battery.voltage}V)</td>
              <td>${systemDesign.batteries[0]?.quantity} pcs</td>
            </tr>
            <tr>
              <td>Inverter</td>
              <td>${systemDesign.inverter.brand} ${systemDesign.inverter.model} (${systemDesign.inverter.ratedPower}kW ${systemDesign.inverter.type})</td>
              <td>1 pc</td>
            </tr>
          </table>
        </div>

        <div class="section">
          <h2>System Performance</h2>
          <table>
            <tr><td><strong>Total Solar Capacity:</strong></td><td class="highlight">${(systemDesign.totalPanelWattage / 1000).toFixed(1)} kW</td></tr>
            <tr><td><strong>Battery Storage:</strong></td><td class="highlight">${systemDesign.totalBatteryCapacity.toFixed(1)} kWh</td></tr>
            <tr><td><strong>Inverter Capacity:</strong></td><td class="highlight">${systemDesign.inverter.ratedPower} kW</td></tr>
            <tr><td><strong>System Voltage:</strong></td><td>${systemDesign.systemVoltage}V</td></tr>
            <tr><td><strong>Estimated Daily Production:</strong></td><td>${systemDesign.estimatedDailyProduction.toFixed(1)} kWh</td></tr>
            <tr><td><strong>Battery Autonomy:</strong></td><td>${systemDesign.autonomyDays.toFixed(1)} days</td></tr>
          </table>
        </div>

        <div class="section">
          <h2>Investment Summary</h2>
          <table>
            <tr><td>Equipment Cost</td><td>KES ${costAnalysis.equipmentCost.toLocaleString()}</td></tr>
            <tr><td>Installation & Accessories</td><td>KES ${costAnalysis.installationCost.toLocaleString()}</td></tr>
            <tr class="total-row"><td><strong>TOTAL INVESTMENT</strong></td><td><strong>KES ${costAnalysis.totalCost.toLocaleString()}</strong></td></tr>
          </table>
        </div>

        <div class="section">
          <h2>Return on Investment</h2>
          <table>
            <tr><td>Monthly Grid Cost (Current):</td><td>KES ${costAnalysis.gridCostPerMonth.toLocaleString()}</td></tr>
            <tr><td>Monthly Solar Cost (Amortized):</td><td>KES ${Math.round(costAnalysis.solarCostPerMonth).toLocaleString()}</td></tr>
            <tr><td><strong>Monthly Savings:</strong></td><td class="highlight">KES ${Math.round(costAnalysis.monthlySavings).toLocaleString()}</td></tr>
            <tr><td><strong>Payback Period:</strong></td><td class="highlight">${costAnalysis.paybackPeriod.toFixed(1)} years</td></tr>
            <tr><td><strong>25-Year ROI:</strong></td><td class="highlight">KES ${(costAnalysis.roi25Years / 1000000).toFixed(1)} Million</td></tr>
          </table>
        </div>

        <div class="contact">
          <h3>📞 Contact Us for Installation</h3>
          <p><strong>Phone:</strong> +254 768 860 665</p>
          <p><strong>WhatsApp:</strong> +254 768 860 665</p>
          <p><strong>Email:</strong> info@emersoneims.com</p>
          <p><strong>Website:</strong> www.emersoneims.com</p>
        </div>

        <div class="footer">
          <p>This quotation is valid for 30 days. Prices may vary based on market conditions.</p>
          <p>© ${new Date().getFullYear()} EmersonEIMS - Solar Bible Calculator | Kenya's Most Advanced Solar Sizing System</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  }, [systemDesign, costAnalysis, propertyType, location, gridConnected, dailyConsumption, backupHours]);

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

        {/* Mode Selector Tabs */}
        <div className="mt-6 flex gap-2 flex-wrap">
          {[
            { id: 'calculator', label: 'System Sizing', icon: <Calculator className="w-4 h-4" /> },
            { id: 'faultcodes', label: 'Fault Codes', icon: <AlertCircle className="w-4 h-4" /> },
            { id: 'health', label: 'Health Analysis', icon: <Heart className="w-4 h-4" /> },
            { id: 'ai', label: 'AI Diagnosis', icon: <Brain className="w-4 h-4" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id as typeof mode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === tab.id
                  ? 'bg-white text-amber-600'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Progress Bar - Only for Calculator mode */}
        {mode === 'calculator' && (
          <div className="mt-4">
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
        )}
      </div>

      {/* CALCULATOR MODE */}
      {mode === 'calculator' && (
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

              {/* PDF & New Calculation Buttons */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <button
                  onClick={generatePDF}
                  className="flex items-center justify-center gap-2 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-500"
                >
                  <FileDown className="w-5 h-5" />
                  Download PDF Quote
                </button>
                <button
                  onClick={() => setStep(1)}
                  className="py-3 text-gray-400 hover:text-white border border-gray-600 rounded-xl"
                >
                  Start New Calculation
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      )}

      {/* FAULT CODES MODE */}
      {mode === 'faultcodes' && (
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-4">Solar Fault Code Diagnosis</h3>
          <p className="text-gray-400 mb-6">500+ fault codes for inverters, batteries, and panels</p>

          {/* Equipment Type Selector */}
          <div className="flex gap-2 mb-4">
            {[
              { id: 'inverter', label: 'Inverter', icon: <Zap className="w-4 h-4" /> },
              { id: 'battery', label: 'Battery', icon: <Battery className="w-4 h-4" /> },
              { id: 'panel', label: 'Panel', icon: <Sun className="w-4 h-4" /> },
            ].map(type => (
              <button
                key={type.id}
                onClick={() => {
                  setEquipmentType(type.id as typeof equipmentType);
                  setSelectedFault(null);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  equipmentType === type.id
                    ? 'bg-amber-500 text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {type.icon}
                {type.label}
              </button>
            ))}
          </div>

          {/* Brand Selector (for inverter/battery) */}
          {equipmentType !== 'panel' && (
            <div className="mb-4">
              <label className="text-sm text-gray-400 block mb-2">Select Brand</label>
              <div className="flex gap-2 flex-wrap">
                {(equipmentType === 'inverter' ? inverterBrands : batteryBrands).map(brand => (
                  <button
                    key={brand}
                    onClick={() => {
                      setSelectedBrand(brand);
                      setSelectedFault(null);
                    }}
                    className={`px-3 py-1 rounded-lg text-sm transition-all ${
                      selectedBrand === brand
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500'
                        : 'bg-gray-800 text-gray-300 border border-gray-700'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search fault code or description..."
              value={faultCodeSearch}
              onChange={(e) => setFaultCodeSearch(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500"
            />
          </div>

          {/* Fault Codes List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredFaultCodes.map((fault, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedFault(fault)}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  selectedFault?.code === fault.code
                    ? 'bg-amber-500/20 border border-amber-500'
                    : 'bg-gray-800/50 hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-mono ${
                    fault.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                    fault.severity === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {fault.code}
                  </span>
                  <span className="text-white text-sm">{fault.description}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Selected Fault Details */}
          {selectedFault && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-gray-800/50 rounded-xl border border-amber-500/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded font-mono text-lg ${
                  selectedFault.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                  selectedFault.severity === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {selectedFault.code}
                </span>
                <h4 className="text-xl font-bold text-white">{selectedFault.description}</h4>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium text-red-400 mb-2">Possible Causes</h5>
                  <ul className="space-y-1">
                    {selectedFault.causes.map((cause, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                        {cause}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-green-400 mb-2">Solutions</h5>
                  <ul className="space-y-1">
                    {selectedFault.solutions.map((sol, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        {sol}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {selectedFault.partsNeeded && selectedFault.partsNeeded.length > 0 && (
                <div className="mt-4 p-3 bg-amber-500/10 rounded-lg">
                  <h5 className="text-sm font-medium text-amber-400 mb-2">Parts That May Be Needed</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedFault.partsNeeded.map((part, i) => (
                      <span key={i} className="px-2 py-1 bg-amber-500/20 rounded text-xs text-amber-300">
                        {part}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* WhatsApp Support */}
              <a
                href={`https://wa.me/${COMPANY_WHATSAPP}?text=${encodeURIComponent(`Hi! I need help with fault code ${selectedFault.code} (${selectedFault.description}) on my ${equipmentType}. Can you assist?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#22c55e] w-full"
              >
                <MessageCircle className="w-5 h-5" />
                Get Expert Help on WhatsApp
              </a>
            </motion.div>
          )}
        </div>
      )}

      {/* HEALTH ANALYSIS MODE */}
      {mode === 'health' && (
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-4">System Health Analysis</h3>
          <p className="text-gray-400 mb-6">Predictive maintenance and failure prediction</p>

          {/* Input Metrics */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-2">
                  Panel Efficiency: {healthMetrics.panelEfficiency}%
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={healthMetrics.panelEfficiency}
                  onChange={(e) => setHealthMetrics({...healthMetrics, panelEfficiency: Number(e.target.value)})}
                  className="w-full accent-amber-500"
                />
                <p className="text-xs text-gray-500 mt-1">Current output vs rated output</p>
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-2">
                  Battery State of Health: {healthMetrics.batterySOH}%
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={healthMetrics.batterySOH}
                  onChange={(e) => setHealthMetrics({...healthMetrics, batterySOH: Number(e.target.value)})}
                  className="w-full accent-green-500"
                />
                <p className="text-xs text-gray-500 mt-1">Current capacity vs original</p>
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-2">
                  Inverter Efficiency: {healthMetrics.inverterEfficiency}%
                </label>
                <input
                  type="range"
                  min="80"
                  max="98"
                  value={healthMetrics.inverterEfficiency}
                  onChange={(e) => setHealthMetrics({...healthMetrics, inverterEfficiency: Number(e.target.value)})}
                  className="w-full accent-blue-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-2">
                  System Age: {healthMetrics.systemAge} years
                </label>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={healthMetrics.systemAge}
                  onChange={(e) => setHealthMetrics({...healthMetrics, systemAge: Number(e.target.value)})}
                  className="w-full accent-purple-500"
                />
              </div>

              <button
                onClick={runHealthAnalysis}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-500 hover:to-emerald-500 flex items-center justify-center gap-2"
              >
                <Activity className="w-5 h-5" />
                Analyze System Health
              </button>
            </div>

            {/* Health Report */}
            {healthReport && (
              <div className="space-y-4">
                {/* Overall Score */}
                <div className="text-center p-4 bg-gray-800/50 rounded-xl">
                  <div className={`text-5xl font-bold ${
                    healthReport.overallScore >= 80 ? 'text-green-400' :
                    healthReport.overallScore >= 60 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {healthReport.overallScore}%
                  </div>
                  <p className="text-gray-400 mt-2">Overall System Health</p>
                </div>

                {/* Component Scores */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 bg-amber-500/10 rounded-lg text-center">
                    <Sun className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                    <div className="text-xl font-bold text-white">{healthReport.panelHealth.score}%</div>
                    <p className="text-xs text-gray-400">Panels</p>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-lg text-center">
                    <Battery className="w-5 h-5 text-green-500 mx-auto mb-1" />
                    <div className="text-xl font-bold text-white">{healthReport.batteryHealth.score}%</div>
                    <p className="text-xs text-gray-400">Battery</p>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-lg text-center">
                    <Zap className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                    <div className="text-xl font-bold text-white">{healthReport.inverterHealth.score}%</div>
                    <p className="text-xs text-gray-400">Inverter</p>
                  </div>
                </div>

                {/* Predicted Failures */}
                {healthReport.predictedFailures.length > 0 && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <h5 className="text-sm font-medium text-red-400 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Predicted Failures
                    </h5>
                    <div className="space-y-2">
                      {healthReport.predictedFailures.map((failure, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-gray-300">{failure.component}</span>
                          <span className="text-red-400">{failure.probability}% in {failure.timeframe}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Maintenance Schedule */}
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <h5 className="text-sm font-medium text-white mb-2">Maintenance Schedule</h5>
                  <div className="space-y-1">
                    {healthReport.maintenanceSchedule.slice(0, 4).map((task, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-300">{task.task}</span>
                        <span className={
                          task.priority === 'high' ? 'text-red-400' :
                          task.priority === 'medium' ? 'text-yellow-400' :
                          'text-green-400'
                        }>{task.due}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI DIAGNOSIS MODE */}
      {mode === 'ai' && (
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-500" />
            AI Solar Diagnosis
          </h3>
          <p className="text-gray-400 mb-6">Describe your issue and get expert AI-powered advice</p>

          <div className="space-y-4">
            <textarea
              placeholder="Describe your solar system issue... e.g., 'My inverter shows F03 error and battery is not charging properly. The system is 3 years old with Pylontech batteries and Deye inverter.'"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 resize-none"
            />

            <button
              onClick={runAIDiagnosis}
              disabled={isAiLoading || !aiQuery.trim()}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-500 hover:to-pink-500 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAiLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Get AI Diagnosis
                </>
              )}
            </button>

            {aiResponse && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gray-800/50 rounded-xl border border-purple-500/30"
              >
                <h4 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  AI Diagnosis
                </h4>
                <div className="text-gray-300 whitespace-pre-wrap">{aiResponse}</div>

                <a
                  href={`https://wa.me/${COMPANY_WHATSAPP}?text=${encodeURIComponent(`Hi! I need help with my solar system. AI diagnosed: ${aiResponse.substring(0, 200)}...`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#22c55e] w-full"
                >
                  <MessageCircle className="w-5 h-5" />
                  Get Expert Help on WhatsApp
                </a>
              </motion.div>
            )}

            {/* Quick Prompts */}
            <div>
              <p className="text-sm text-gray-400 mb-2">Quick prompts:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Battery not charging properly',
                  'Inverter overheating',
                  'Low solar production',
                  'System sizing for 5kWh daily usage',
                  'Battery bank configuration',
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => setAiQuery(prompt)}
                    className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-lg hover:bg-gray-700"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-800/50 border-t border-gray-700">
        <p className="text-xs text-gray-500 text-center">
          Solar Bible Calculator v3.0 | AI-Powered by EmersonEIMS | 300+ Equipment | 500+ Fault Codes | Health Analytics
        </p>
      </div>
    </div>
  );
}
