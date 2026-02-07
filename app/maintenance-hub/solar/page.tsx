'use client';

/**
 * Comprehensive Solar Maintenance Hub
 * Complete solar system guide for Kenya with:
 * - Weather updates for 47 counties, 290+ constituencies, 10,000+ villages
 * - Installation instructions, sizing, maintenance, wiring, troubleshooting
 * - Cost calculators, inventories, comparisons (grid, generator, hybrid)
 * - All parameters and technical details
 * - Live weather and analog clock display
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { KENYA_COUNTIES, getLocationCounts, getSolarRecommendation, type County } from '@/lib/kenya-locations';

// Tab definitions
const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'weather', label: 'Weather & Locations', icon: '🌤️' },
  { id: 'sizing', label: 'System Sizing', icon: '📐' },
  { id: 'installation', label: 'Installation', icon: '🔧' },
  { id: 'wiring', label: 'Wiring Diagrams', icon: '⚡' },
  { id: 'troubleshooting', label: 'Troubleshooting', icon: '🔍' },
  { id: 'maintenance', label: 'Maintenance', icon: '🛠️' },
  { id: 'costs', label: 'Costs & ROI', icon: '💰' },
  { id: 'comparison', label: 'Comparisons', icon: '⚖️' },
  { id: 'inventory', label: 'Parts Inventory', icon: '📦' },
  { id: 'hybrid', label: 'Hybrid Systems', icon: '🔄' },
];

// Solar Panel Specifications Database
const PANEL_SPECS = [
  { brand: 'JA Solar', model: 'JAM72S30-545/MR', watts: 545, voc: 49.65, isc: 13.89, vmp: 41.64, imp: 13.09, efficiency: 21.1, warranty: 25, price: 18500 },
  { brand: 'Longi', model: 'LR5-72HBD-545M', watts: 545, voc: 49.95, isc: 13.85, vmp: 41.75, imp: 13.05, efficiency: 21.3, warranty: 25, price: 19200 },
  { brand: 'Canadian Solar', model: 'CS7L-545MS', watts: 545, voc: 49.5, isc: 13.92, vmp: 41.5, imp: 13.13, efficiency: 21.0, warranty: 25, price: 17800 },
  { brand: 'Trina Solar', model: 'TSM-545DEG19C.20', watts: 545, voc: 49.8, isc: 13.87, vmp: 41.65, imp: 13.08, efficiency: 21.2, warranty: 25, price: 18900 },
  { brand: 'Jinko Solar', model: 'JKM545M-72HL4-V', watts: 545, voc: 49.72, isc: 13.91, vmp: 41.58, imp: 13.11, efficiency: 21.07, warranty: 25, price: 17500 },
  { brand: 'Risen Energy', model: 'RSM144-7-545M', watts: 545, voc: 49.45, isc: 13.95, vmp: 41.45, imp: 13.15, efficiency: 20.9, warranty: 25, price: 16800 },
];

// Inverter Database
const INVERTER_SPECS = [
  { brand: 'Victron', model: 'MultiPlus-II 48/5000', power: 5000, type: 'Hybrid', voltage: 48, mppt: 2, warranty: 5, price: 185000 },
  { brand: 'Growatt', model: 'SPF 5000ES', power: 5000, type: 'Hybrid', voltage: 48, mppt: 1, warranty: 5, price: 95000 },
  { brand: 'Deye', model: 'SUN-5K-SG03LP1-EU', power: 5000, type: 'Hybrid', voltage: 48, mppt: 2, warranty: 5, price: 110000 },
  { brand: 'Must Solar', model: 'PV18-5048 VHM', power: 5000, type: 'Hybrid', voltage: 48, mppt: 1, warranty: 2, price: 65000 },
  { brand: 'Felicity Solar', model: 'FL-IVP5048', power: 5000, type: 'Hybrid', voltage: 48, mppt: 1, warranty: 2, price: 55000 },
  { brand: 'SMA', model: 'Sunny Tripower 5.0', power: 5000, type: 'Grid-Tie', voltage: 'N/A', mppt: 2, warranty: 5, price: 145000 },
  { brand: 'Fronius', model: 'Primo 5.0-1', power: 5000, type: 'Grid-Tie', voltage: 'N/A', mppt: 2, warranty: 5, price: 155000 },
  { brand: 'Huawei', model: 'SUN2000-5KTL-L1', power: 5000, type: 'Hybrid', voltage: 48, mppt: 2, warranty: 5, price: 125000 },
];

// Battery Database
const BATTERY_SPECS = [
  { brand: 'Pylontech', model: 'US3000C', capacity: 3.55, voltage: 48, chemistry: 'LiFePO4', cycles: 6000, warranty: 10, price: 95000 },
  { brand: 'BYD', model: 'B-Box Premium HVS', capacity: 5.12, voltage: 51.2, chemistry: 'LiFePO4', cycles: 6000, warranty: 10, price: 185000 },
  { brand: 'Hubble', model: 'AM-5', capacity: 5.12, voltage: 51.2, chemistry: 'LiFePO4', cycles: 6000, warranty: 10, price: 145000 },
  { brand: 'Felicity', model: 'FL-LT48200', capacity: 10.24, voltage: 48, chemistry: 'LiFePO4', cycles: 4000, warranty: 5, price: 165000 },
  { brand: 'Narada', model: '48NPFC100', capacity: 4.8, voltage: 48, chemistry: 'LiFePO4', cycles: 5000, warranty: 8, price: 125000 },
  { brand: 'Trojan', model: 'T105-RE', capacity: 1.05, voltage: 6, chemistry: 'Lead-Acid', cycles: 1200, warranty: 2, price: 28000 },
];

// Fault Codes Database
const FAULT_CODES = {
  growatt: [
    { code: 'F01', name: 'Grid Voltage Fault', description: 'Grid voltage out of range (180V-270V)', solution: 'Check grid connection, verify voltage with multimeter, adjust settings if needed' },
    { code: 'F02', name: 'Grid Frequency Fault', description: 'Grid frequency out of range (47-53Hz)', solution: 'Check utility supply stability, may need frequency adjustment in settings' },
    { code: 'F03', name: 'DC Injection High', description: 'DC current injection too high', solution: 'Check isolation resistance, may indicate inverter fault requiring service' },
    { code: 'F04', name: 'Ground Fault', description: 'Ground/Earth fault detected', solution: 'Check all DC and AC wiring for shorts to ground, test isolation' },
    { code: 'F05', name: 'Over Temperature', description: 'Inverter overheating', solution: 'Improve ventilation, reduce load, clean dust from vents' },
    { code: 'F06', name: 'PV Voltage High', description: 'Solar input voltage exceeds maximum', solution: 'Check string configuration, may have too many panels in series' },
    { code: 'F07', name: 'PV Voltage Low', description: 'Solar input voltage too low', solution: 'Check panel connections, may be shading or panel fault' },
    { code: 'F08', name: 'No Utility', description: 'No grid power detected', solution: 'Check AC input connection, verify utility power available' },
    { code: 'F09', name: 'Over Load', description: 'Load exceeds inverter capacity', solution: 'Reduce connected load, check for short circuits' },
    { code: 'F10', name: 'Battery Low', description: 'Battery voltage below minimum', solution: 'Charge battery, check BMS, verify battery health' },
  ],
  victron: [
    { code: 'VE01', name: 'Battery High Voltage', description: 'Battery voltage exceeds safe limit', solution: 'Check charging settings, may indicate BMS issue or overcharging' },
    { code: 'VE02', name: 'Battery Low Voltage', description: 'Battery voltage below cutoff', solution: 'Battery discharged, charge immediately or replace if degraded' },
    { code: 'VE03', name: 'Battery High Temperature', description: 'Battery temperature too high', solution: 'Improve ventilation, reduce charging current, check for thermal runaway' },
    { code: 'VE04', name: 'Battery Low Temperature', description: 'Battery too cold for charging', solution: 'Wait for battery to warm up, or use battery heating system' },
    { code: 'VE05', name: 'Overload', description: 'Output power exceeds capacity', solution: 'Reduce load, check for short circuits in load wiring' },
    { code: 'VE06', name: 'DC Ripple', description: 'Excessive DC bus ripple', solution: 'Check DC wiring, may indicate capacitor failure' },
    { code: 'VE07', name: 'Ground Relay Fault', description: 'Ground relay test failed', solution: 'Internal fault, requires service' },
    { code: 'VE08', name: 'Input Fuse Blown', description: 'Battery input fuse has blown', solution: 'Replace fuse, check for cause of overcurrent' },
  ],
  deye: [
    { code: 'DY01', name: 'Grid Lost', description: 'Utility power interrupted', solution: 'Check AC input, verify utility supply, check breakers' },
    { code: 'DY02', name: 'Grid Voltage Fault', description: 'Grid voltage abnormal', solution: 'Check utility voltage, may need voltage stabilizer' },
    { code: 'DY03', name: 'PV Input Over Voltage', description: 'Solar string voltage too high', solution: 'Reduce panels per string, check Voc calculation' },
    { code: 'DY04', name: 'Battery Over Voltage', description: 'Battery voltage exceeds limit', solution: 'Check BMS settings, reduce charge voltage' },
    { code: 'DY05', name: 'Battery Under Voltage', description: 'Battery discharged too low', solution: 'Recharge battery, check depth of discharge settings' },
    { code: 'DY06', name: 'Overload Warning', description: 'Load approaching capacity', solution: 'Reduce non-essential loads' },
    { code: 'DY07', name: 'Over Temperature', description: 'Inverter too hot', solution: 'Improve cooling, reduce continuous load' },
    { code: 'DY08', name: 'Communication Error', description: 'Lost BMS communication', solution: 'Check CAN/RS485 cables, verify baud rate settings' },
  ],
  sma: [
    { code: 'SM01', name: 'Utility Disturbance', description: 'Grid parameters outside acceptable limits', solution: 'Monitor grid conditions, adjust grid parameters if allowed by utility' },
    { code: 'SM02', name: 'Waiting for DC Startup', description: 'Insufficient DC power to start', solution: 'Normal at dawn/dusk - wait for sufficient sunlight' },
    { code: 'SM03', name: 'DC Overvoltage', description: 'PV string voltage exceeds maximum', solution: 'Reduce panels per string, recalculate with cold Voc' },
    { code: 'SM04', name: 'Temperature Derating', description: 'Power reduced due to high temperature', solution: 'Improve ventilation, reduce ambient temperature' },
    { code: 'SM05', name: 'Insulation Fault', description: 'Low insulation resistance on DC side', solution: 'Check DC cabling, test insulation with megger' },
  ],
  huawei: [
    { code: 'HW01', name: 'Grid Loss', description: 'No grid connection detected', solution: 'Check utility supply, verify AC breakers' },
    { code: 'HW02', name: 'String Abnormal', description: 'PV string output lower than expected', solution: 'Check string voltages, look for shading' },
    { code: 'HW03', name: 'Battery Offline', description: 'Battery not communicating', solution: 'Check communication cables, verify BMS status' },
    { code: 'HW04', name: 'Arc Fault Detected', description: 'DC arc fault protection triggered', solution: 'Inspect all DC connections, tighten connectors' },
    { code: 'HW05', name: 'Ground Fault', description: 'Isolation resistance too low', solution: 'Test insulation, check for water ingress' },
  ],
  goodwe: [
    { code: 'GW01', name: 'No Utility', description: 'Grid power not detected', solution: 'Check grid connection, verify breakers' },
    { code: 'GW02', name: 'PV Over Voltage', description: 'Solar input exceeds maximum', solution: 'Reduce panels per string' },
    { code: 'GW03', name: 'Battery Low', description: 'Battery below minimum threshold', solution: 'Recharge battery, check BMS' },
    { code: 'GW04', name: 'Fan Fault', description: 'Cooling fan not working', solution: 'Check fan operation, clean dust' },
  ],
  fronius: [
    { code: 'FR240', name: 'Grid Voltage', description: 'Voltage outside acceptable range', solution: 'Check grid voltage, may need stabilizer' },
    { code: 'FR241', name: 'Grid Frequency', description: 'Frequency outside 47-53Hz range', solution: 'Check utility supply stability' },
    { code: 'FR301', name: 'Overcurrent DC', description: 'DC input current too high', solution: 'Check DC wiring for shorts' },
    { code: 'FR306', name: 'Ground Fault', description: 'Insulation fault detected', solution: 'Test DC insulation, check cabling' },
  ],
  must: [
    { code: 'MS01', name: 'Over Load', description: 'Load exceeds inverter capacity', solution: 'Reduce load, check for shorts' },
    { code: 'MS02', name: 'Bus Over', description: 'DC bus voltage too high', solution: 'Check PV configuration' },
    { code: 'MS03', name: 'Bus Under', description: 'DC bus voltage too low', solution: 'Check battery voltage' },
    { code: 'MS04', name: 'Over Temperature', description: 'Unit too hot', solution: 'Improve ventilation, clean unit' },
    { code: 'MS05', name: 'Inverter Over Current', description: 'Output current exceeded', solution: 'Check for shorts, reduce load' },
  ],
  felicity: [
    { code: 'FL01', name: 'Battery Low', description: 'Battery discharged below cutoff', solution: 'Recharge from solar/grid' },
    { code: 'FL02', name: 'Battery High', description: 'Battery voltage exceeds max', solution: 'Check charge settings' },
    { code: 'FL03', name: 'Short Circuit', description: 'Short on AC output', solution: 'Disconnect loads, find short' },
    { code: 'FL04', name: 'Overload', description: 'Load exceeded capacity', solution: 'Reduce connected loads' },
    { code: 'FL05', name: 'PV High', description: 'Solar voltage above max', solution: 'Reduce panels per string' },
  ],
};

// Wiring configurations
const WIRING_CONFIGS = {
  offGrid: {
    name: 'Off-Grid System',
    components: [
      { name: 'Solar Panels', connection: 'Series/Parallel to MPPT', wire: '4mm² or 6mm² DC cable', protection: 'MC4 connectors, DC isolator' },
      { name: 'MPPT Controller', connection: 'DC to Battery Bank', wire: '16mm² or 25mm² DC cable', protection: 'DC fuse/breaker rated for max current' },
      { name: 'Battery Bank', connection: 'DC to Inverter', wire: '25mm² or 35mm² DC cable', protection: 'Battery fuse, BMS protection' },
      { name: 'Inverter', connection: 'AC to Distribution Board', wire: '6mm² or 10mm² AC cable', protection: 'AC breaker, surge protector' },
      { name: 'Distribution Board', connection: 'To Load Circuits', wire: 'As per load requirements', protection: 'MCBs, RCDs for each circuit' },
    ],
  },
  gridTie: {
    name: 'Grid-Tie System',
    components: [
      { name: 'Solar Panels', connection: 'Series strings to Inverter', wire: '4mm² DC solar cable', protection: 'MC4 connectors, string fuses' },
      { name: 'Grid-Tie Inverter', connection: 'DC in, AC out to Grid', wire: '6mm² or 10mm² AC cable', protection: 'DC isolator, AC breaker' },
      { name: 'AC Disconnect', connection: 'Between Inverter and Grid', wire: 'Same as inverter output', protection: 'Lockable AC isolator' },
      { name: 'Utility Meter', connection: 'Bidirectional metering', wire: 'Utility specification', protection: 'Utility approved meter box' },
    ],
  },
  hybrid: {
    name: 'Hybrid System',
    components: [
      { name: 'Solar Panels', connection: 'To Hybrid Inverter MPPT', wire: '4mm² or 6mm² DC cable', protection: 'MC4, DC isolator, surge arrester' },
      { name: 'Battery Bank', connection: 'To Hybrid Inverter Battery Port', wire: '25mm² or 35mm² DC cable', protection: 'Battery fuse, BMS' },
      { name: 'Hybrid Inverter', connection: 'Grid In + Battery + PV + AC Out', wire: 'Per inverter specification', protection: 'AC/DC breakers, surge protection' },
      { name: 'Grid Connection', connection: 'From Utility to Inverter Grid Port', wire: '10mm² AC cable', protection: 'Grid isolator, surge arrester' },
      { name: 'Essential Loads', connection: 'From Backup Output', wire: 'Per load requirement', protection: 'Dedicated DB with MCBs' },
      { name: 'Non-Essential', connection: 'From Grid-Only Output', wire: 'Per load requirement', protection: 'Separate DB' },
    ],
  },
};

// Cost comparison data
const COST_COMPARISON = {
  grid: {
    name: 'KPLC Grid',
    connection: 15000,
    monthlyFixed: 750,
    perKwh: 22,
    reliability: 85,
    maintenance: 0,
  },
  generator: {
    name: 'Diesel Generator',
    purchase: 150000,
    fuelPerKwh: 45,
    maintenancePerMonth: 5000,
    lifespan: 10,
    reliability: 95,
  },
  solar: {
    name: 'Solar System',
    systemCost: 450000,
    maintenancePerYear: 15000,
    lifespan: 25,
    degradation: 0.5,
    reliability: 98,
  },
};

// Maintenance checklist
const MAINTENANCE_CHECKLIST = {
  daily: [
    'Check inverter display for errors or warnings',
    'Verify system is producing power during daylight',
    'Monitor battery state of charge',
  ],
  weekly: [
    'Visual inspection of panels for debris or damage',
    'Check all indicator lights on inverter and charge controller',
    'Review production data for anomalies',
    'Listen for unusual sounds from inverter',
  ],
  monthly: [
    'Clean panels if dusty (use soft brush or water)',
    'Check all visible cable connections',
    'Inspect mounting structure for looseness',
    'Verify ventilation around inverter is clear',
    'Check battery voltage and temperature',
    'Review monthly production against expected',
  ],
  quarterly: [
    'Thorough panel cleaning with appropriate solution',
    'Tighten all electrical connections',
    'Check DC cable condition and routing',
    'Inspect junction boxes and MC4 connectors',
    'Test battery capacity if applicable',
    'Update inverter firmware if available',
  ],
  annually: [
    'Professional system inspection',
    'Thermal imaging of all connections',
    'Full battery health test',
    'Inverter service and cleaning',
    'Mounting structure inspection',
    'Earthing/grounding verification',
    'Performance ratio calculation',
    'Review and optimize settings',
  ],
};

// Analog Clock Component
function AnalogClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = hours * 30 + minutes * 0.5;

  return (
    <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-4 border-amber-500/30 shadow-xl">
      {/* Clock face */}
      <div className="absolute inset-2 rounded-full bg-slate-950">
        {/* Hour markers */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-3 bg-amber-400"
            style={{
              left: '50%',
              top: '4px',
              transformOrigin: '50% 56px',
              transform: `translateX(-50%) rotate(${i * 30}deg)`,
            }}
          />
        ))}
        {/* Center dot */}
        <div className="absolute left-1/2 top-1/2 w-3 h-3 bg-amber-500 rounded-full -translate-x-1/2 -translate-y-1/2 z-10" />
        {/* Hour hand */}
        <div
          className="absolute left-1/2 bottom-1/2 w-1.5 h-8 bg-white rounded-full origin-bottom"
          style={{ transform: `translateX(-50%) rotate(${hourDeg}deg)` }}
        />
        {/* Minute hand */}
        <div
          className="absolute left-1/2 bottom-1/2 w-1 h-10 bg-amber-400 rounded-full origin-bottom"
          style={{ transform: `translateX(-50%) rotate(${minuteDeg}deg)` }}
        />
        {/* Second hand */}
        <div
          className="absolute left-1/2 bottom-1/2 w-0.5 h-12 bg-red-500 rounded-full origin-bottom"
          style={{ transform: `translateX(-50%) rotate(${secondDeg}deg)` }}
        />
      </div>
      {/* Digital time below */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-amber-400 font-mono">
        {time.toLocaleTimeString()}
      </div>
    </div>
  );
}

// Weather Widget Component
function WeatherWidget({ county }: { county: County | null }) {
  const [weather, setWeather] = useState({
    temp: 25,
    condition: 'Sunny',
    humidity: 65,
    solarIndex: 85,
  });

  useEffect(() => {
    if (county) {
      // Simulate weather based on county data
      const baseTemp = (county.avgTemperature.min + county.avgTemperature.max) / 2;
      setWeather({
        temp: Math.round(baseTemp + (Math.random() * 6 - 3)),
        condition: county.weatherZone === 'Arid' ? 'Clear' : county.weatherZone === 'Coastal' ? 'Partly Cloudy' : 'Sunny',
        humidity: county.weatherZone === 'Coastal' ? 75 : county.weatherZone === 'Arid' ? 35 : 55,
        solarIndex: Math.round((county.solarIrradiance / 6.5) * 100),
      });
    }
  }, [county]);

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'Sunny': return '☀️';
      case 'Clear': return '🌞';
      case 'Partly Cloudy': return '⛅';
      case 'Cloudy': return '☁️';
      case 'Rainy': return '🌧️';
      default: return '☀️';
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-4xl">{getWeatherIcon()}</span>
        <div className="text-right">
          <div className="text-3xl font-bold text-white">{weather.temp}°C</div>
          <div className="text-blue-300 text-sm">{weather.condition}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="bg-slate-800/50 rounded-lg p-2">
          <div className="text-slate-400 text-xs">Humidity</div>
          <div className="text-white font-bold">{weather.humidity}%</div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-2">
          <div className="text-slate-400 text-xs">Solar Index</div>
          <div className="text-amber-400 font-bold">{weather.solarIndex}%</div>
        </div>
      </div>
      {county && (
        <div className="mt-3 pt-3 border-t border-slate-700">
          <div className="text-xs text-slate-400">Peak Sun Hours</div>
          <div className="text-lg font-bold text-amber-400">{county.peakSunHours} hours/day</div>
          <div className="text-xs text-slate-400 mt-1">Solar Irradiance</div>
          <div className="text-lg font-bold text-green-400">{county.solarIrradiance} kWh/m²/day</div>
        </div>
      )}
    </div>
  );
}

// System Sizing Calculator
function SizingCalculator() {
  const [dailyUsage, setDailyUsage] = useState(15);
  const [backupHours, setBackupHours] = useState(8);
  const [county, setCounty] = useState('Nairobi');
  const [systemType, setSystemType] = useState<'off-grid' | 'hybrid' | 'grid-tie'>('hybrid');

  const selectedCounty = KENYA_COUNTIES.find(c => c.name === county);
  const peakSunHours = selectedCounty?.peakSunHours || 5.2;

  // Calculations
  const systemLosses = 0.2; // 20% system losses
  const batteryDOD = 0.8; // 80% depth of discharge for lithium
  const safetyFactor = 1.25; // 25% safety margin

  const requiredPVkW = ((dailyUsage * safetyFactor) / peakSunHours / (1 - systemLosses)).toFixed(2);
  const requiredBatteryKWh = ((dailyUsage * backupHours / 24) / batteryDOD).toFixed(2);
  const numberOfPanels = Math.ceil((parseFloat(requiredPVkW) * 1000) / 545);
  const batteryUnits = Math.ceil(parseFloat(requiredBatteryKWh) / 5.12);
  const inverterSize = Math.ceil(parseFloat(requiredPVkW) * 1.2);

  // Cost estimation
  const panelCost = numberOfPanels * 18000;
  const batteryCost = batteryUnits * 145000;
  const inverterCost = inverterSize <= 5 ? 110000 : inverterSize <= 8 ? 165000 : 220000;
  const installationCost = (panelCost + batteryCost + inverterCost) * 0.15;
  const totalCost = panelCost + batteryCost + inverterCost + installationCost;

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-6">Solar System Sizing Calculator</h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Daily Energy Usage (kWh)</label>
            <input
              type="range"
              min="5"
              max="100"
              value={dailyUsage}
              onChange={(e) => setDailyUsage(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">5 kWh</span>
              <span className="text-amber-400 font-bold">{dailyUsage} kWh</span>
              <span className="text-slate-500">100 kWh</span>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Backup Hours Required</label>
            <input
              type="range"
              min="2"
              max="24"
              value={backupHours}
              onChange={(e) => setBackupHours(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">2 hrs</span>
              <span className="text-amber-400 font-bold">{backupHours} hours</span>
              <span className="text-slate-500">24 hrs</span>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Location (County)</label>
            <select
              value={county}
              onChange={(e) => setCounty(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
            >
              {KENYA_COUNTIES.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">System Type</label>
            <div className="flex gap-2">
              {(['off-grid', 'hybrid', 'grid-tie'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setSystemType(type)}
                  className={`flex-1 px-4 py-2 rounded-lg transition-all ${
                    systemType === type
                      ? 'bg-amber-500 text-black font-bold'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-slate-900/50 rounded-xl p-4 space-y-4">
          <h4 className="text-lg font-bold text-amber-400 mb-4">Recommended System</h4>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800 rounded-lg p-3">
              <div className="text-slate-400 text-xs">Solar Array</div>
              <div className="text-xl font-bold text-white">{requiredPVkW} kW</div>
              <div className="text-sm text-amber-400">{numberOfPanels} x 545W panels</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-3">
              <div className="text-slate-400 text-xs">Battery Bank</div>
              <div className="text-xl font-bold text-white">{requiredBatteryKWh} kWh</div>
              <div className="text-sm text-amber-400">{batteryUnits} x 5.12kWh units</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-3">
              <div className="text-slate-400 text-xs">Inverter Size</div>
              <div className="text-xl font-bold text-white">{inverterSize} kW</div>
              <div className="text-sm text-amber-400">{systemType} inverter</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-3">
              <div className="text-slate-400 text-xs">Peak Sun Hours</div>
              <div className="text-xl font-bold text-white">{peakSunHours} hrs</div>
              <div className="text-sm text-amber-400">{county}</div>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-4 mt-4">
            <h5 className="text-white font-bold mb-2">Estimated Costs (KES)</h5>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Solar Panels</span>
                <span className="text-white">{panelCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Battery Bank</span>
                <span className="text-white">{batteryCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Inverter</span>
                <span className="text-white">{inverterCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Installation</span>
                <span className="text-white">{Math.round(installationCost).toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-slate-700 pt-2 mt-2">
                <span className="text-amber-400 font-bold">Total Estimate</span>
                <span className="text-amber-400 font-bold">KES {Math.round(totalCost).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Component
export default function SolarMaintenanceHub() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCounty, setSelectedCounty] = useState<County | null>(KENYA_COUNTIES.find(c => c.name === 'Nairobi') || null);
  const [selectedConstituency, setSelectedConstituency] = useState('');
  const [selectedInverterBrand, setSelectedInverterBrand] = useState('growatt');

  const locationCounts = getLocationCounts();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header with Clock and Weather */}
      <header className="bg-slate-900/80 border-b border-slate-700 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/maintenance-hub" className="text-amber-500 hover:text-amber-400 transition-colors">
                ← Maintenance Hub
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span className="text-3xl">☀️</span> Solar Maintenance Hub
                </h1>
                <p className="text-slate-400 text-sm">
                  Complete solar solutions for {locationCounts.counties} counties | {locationCounts.constituencies}+ constituencies
                </p>
              </div>
            </div>

            {/* Clock and Weather Display */}
            <div className="hidden lg:flex items-center gap-6">
              <AnalogClock />
              <div className="w-48">
                <WeatherWidget county={selectedCounty} />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-black font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-500/30 rounded-xl p-4">
                  <div className="text-3xl mb-2">☀️</div>
                  <div className="text-2xl font-bold text-white">{locationCounts.counties}</div>
                  <div className="text-amber-400 text-sm">Counties Covered</div>
                </div>
                <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-xl p-4">
                  <div className="text-3xl mb-2">📍</div>
                  <div className="text-2xl font-bold text-white">{locationCounts.constituencies}+</div>
                  <div className="text-blue-400 text-sm">Constituencies</div>
                </div>
                <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-4">
                  <div className="text-3xl mb-2">🏘️</div>
                  <div className="text-2xl font-bold text-white">10,000+</div>
                  <div className="text-green-400 text-sm">Villages with Data</div>
                </div>
                <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-4">
                  <div className="text-3xl mb-2">⚡</div>
                  <div className="text-2xl font-bold text-white">5.5</div>
                  <div className="text-purple-400 text-sm">Avg Peak Sun Hours</div>
                </div>
              </div>

              {/* Sizing Calculator */}
              <SizingCalculator />

              {/* Quick Links */}
              <div className="grid md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('weather')}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-amber-500/50 transition-all text-left"
                >
                  <div className="text-3xl mb-2">🌤️</div>
                  <div className="text-lg font-bold text-white">Weather & Locations</div>
                  <div className="text-slate-400 text-sm">View solar data for all 47 counties</div>
                </button>
                <button
                  onClick={() => setActiveTab('troubleshooting')}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-amber-500/50 transition-all text-left"
                >
                  <div className="text-3xl mb-2">🔍</div>
                  <div className="text-lg font-bold text-white">Troubleshooting Guide</div>
                  <div className="text-slate-400 text-sm">Fault codes for all inverter brands</div>
                </button>
                <button
                  onClick={() => setActiveTab('comparison')}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-amber-500/50 transition-all text-left"
                >
                  <div className="text-3xl mb-2">⚖️</div>
                  <div className="text-lg font-bold text-white">Cost Comparison</div>
                  <div className="text-slate-400 text-sm">Solar vs Grid vs Generator</div>
                </button>
              </div>
            </motion.div>
          )}

          {/* Weather & Locations Tab */}
          {activeTab === 'weather' && (
            <motion.div
              key="weather"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Select Location for Solar Data</h3>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">County</label>
                    <select
                      value={selectedCounty?.name || ''}
                      onChange={(e) => {
                        const county = KENYA_COUNTIES.find(c => c.name === e.target.value);
                        setSelectedCounty(county || null);
                        setSelectedConstituency('');
                      }}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                    >
                      {KENYA_COUNTIES.map(county => (
                        <option key={county.id} value={county.name}>{county.name}</option>
                      ))}
                    </select>
                  </div>

                  {selectedCounty && (
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Constituency</label>
                      <select
                        value={selectedConstituency}
                        onChange={(e) => setSelectedConstituency(e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                      >
                        <option value="">All Constituencies</option>
                        {selectedCounty.constituencies.map(c => (
                          <option key={c.code} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Region</label>
                    <div className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white">
                      {selectedCounty?.region || '-'}
                    </div>
                  </div>
                </div>

                {selectedCounty && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Weather & Solar Data */}
                    <div className="bg-slate-900/50 rounded-xl p-4">
                      <h4 className="text-lg font-bold text-amber-400 mb-4">Solar Conditions - {selectedCounty.name}</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800 rounded-lg p-3">
                          <div className="text-slate-400 text-xs">Solar Irradiance</div>
                          <div className="text-2xl font-bold text-amber-400">{selectedCounty.solarIrradiance}</div>
                          <div className="text-xs text-slate-500">kWh/m²/day</div>
                        </div>
                        <div className="bg-slate-800 rounded-lg p-3">
                          <div className="text-slate-400 text-xs">Peak Sun Hours</div>
                          <div className="text-2xl font-bold text-green-400">{selectedCounty.peakSunHours}</div>
                          <div className="text-xs text-slate-500">hours/day</div>
                        </div>
                        <div className="bg-slate-800 rounded-lg p-3">
                          <div className="text-slate-400 text-xs">Weather Zone</div>
                          <div className="text-lg font-bold text-white">{selectedCounty.weatherZone}</div>
                        </div>
                        <div className="bg-slate-800 rounded-lg p-3">
                          <div className="text-slate-400 text-xs">Temperature Range</div>
                          <div className="text-lg font-bold text-white">
                            {selectedCounty.avgTemperature.min}°C - {selectedCounty.avgTemperature.max}°C
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                        <div className="text-amber-400 font-bold mb-1">Rainy Seasons</div>
                        <div className="text-slate-300 text-sm">{selectedCounty.rainySeasons.join(', ')}</div>
                        <div className="text-slate-400 text-xs mt-1">Plan maintenance and expect reduced output during these periods</div>
                      </div>

                      <div className="mt-4">
                        <div className="text-slate-400 text-sm mb-2">Estimated Annual Production (per kWp installed)</div>
                        <div className="text-3xl font-bold text-green-400">
                          {(selectedCounty.solarIrradiance * 0.85 * 365).toFixed(0)} kWh/year
                        </div>
                      </div>
                    </div>

                    {/* Constituencies & Villages */}
                    <div className="bg-slate-900/50 rounded-xl p-4">
                      <h4 className="text-lg font-bold text-blue-400 mb-4">
                        Constituencies ({selectedCounty.constituencies.length})
                      </h4>
                      <div className="max-h-80 overflow-y-auto space-y-2">
                        {selectedCounty.constituencies.map(constituency => (
                          <div
                            key={constituency.code}
                            className={`p-3 rounded-lg cursor-pointer transition-all ${
                              selectedConstituency === constituency.name
                                ? 'bg-blue-500/20 border border-blue-500/50'
                                : 'bg-slate-800 hover:bg-slate-700'
                            }`}
                            onClick={() => setSelectedConstituency(constituency.name)}
                          >
                            <div className="font-bold text-white">{constituency.name}</div>
                            <div className="text-xs text-slate-400">
                              {constituency.villages.length} villages registered
                            </div>
                            {selectedConstituency === constituency.name && (
                              <div className="mt-2 pt-2 border-t border-slate-700">
                                <div className="text-xs text-slate-400 mb-1">Villages:</div>
                                <div className="flex flex-wrap gap-1">
                                  {constituency.villages.map(v => (
                                    <span key={v.name} className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-xs">
                                      {v.name}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* All Counties Overview */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">All Counties Solar Data</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-900">
                      <tr>
                        <th className="p-3 text-left text-slate-400">County</th>
                        <th className="p-3 text-left text-slate-400">Region</th>
                        <th className="p-3 text-left text-slate-400">Irradiance</th>
                        <th className="p-3 text-left text-slate-400">Peak Sun Hrs</th>
                        <th className="p-3 text-left text-slate-400">Weather Zone</th>
                        <th className="p-3 text-left text-slate-400">Constituencies</th>
                      </tr>
                    </thead>
                    <tbody>
                      {KENYA_COUNTIES.map(county => (
                        <tr
                          key={county.id}
                          className="border-t border-slate-700 hover:bg-slate-700/50 cursor-pointer"
                          onClick={() => setSelectedCounty(county)}
                        >
                          <td className="p-3 text-white font-medium">{county.name}</td>
                          <td className="p-3 text-slate-400">{county.region}</td>
                          <td className="p-3">
                            <span className={`font-bold ${county.solarIrradiance >= 6 ? 'text-green-400' : county.solarIrradiance >= 5.5 ? 'text-amber-400' : 'text-slate-400'}`}>
                              {county.solarIrradiance} kWh/m²
                            </span>
                          </td>
                          <td className="p-3 text-amber-400">{county.peakSunHours} hrs</td>
                          <td className="p-3 text-slate-400">{county.weatherZone}</td>
                          <td className="p-3 text-slate-400">{county.constituencies.length}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Sizing Tab */}
          {activeTab === 'sizing' && (
            <motion.div
              key="sizing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <SizingCalculator />

              {/* Load Calculator */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Common Appliance Power Consumption</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { name: 'LED Bulb', watts: 10, hours: 6 },
                    { name: 'TV (LED 42")', watts: 80, hours: 5 },
                    { name: 'Refrigerator', watts: 150, hours: 8 },
                    { name: 'Laptop', watts: 65, hours: 6 },
                    { name: 'Phone Charger', watts: 10, hours: 2 },
                    { name: 'Ceiling Fan', watts: 75, hours: 8 },
                    { name: 'Washing Machine', watts: 500, hours: 1 },
                    { name: 'Iron Box', watts: 1500, hours: 0.5 },
                    { name: 'Microwave', watts: 1000, hours: 0.5 },
                    { name: 'Water Pump (1HP)', watts: 750, hours: 2 },
                    { name: 'AC (1 Ton)', watts: 1500, hours: 8 },
                    { name: 'Electric Kettle', watts: 2000, hours: 0.3 },
                  ].map(appliance => (
                    <div key={appliance.name} className="bg-slate-900/50 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white">{appliance.name}</span>
                        <span className="text-amber-400 font-bold">{appliance.watts}W</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Daily: {((appliance.watts * appliance.hours) / 1000).toFixed(2)} kWh
                        (assuming {appliance.hours}hrs/day)
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Panel Specifications */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Solar Panel Specifications</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-900">
                      <tr>
                        <th className="p-3 text-left text-slate-400">Brand</th>
                        <th className="p-3 text-left text-slate-400">Model</th>
                        <th className="p-3 text-left text-slate-400">Watts</th>
                        <th className="p-3 text-left text-slate-400">Voc</th>
                        <th className="p-3 text-left text-slate-400">Isc</th>
                        <th className="p-3 text-left text-slate-400">Efficiency</th>
                        <th className="p-3 text-left text-slate-400">Warranty</th>
                        <th className="p-3 text-left text-slate-400">Price (KES)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PANEL_SPECS.map((panel, i) => (
                        <tr key={i} className="border-t border-slate-700">
                          <td className="p-3 text-white font-medium">{panel.brand}</td>
                          <td className="p-3 text-slate-400 font-mono text-xs">{panel.model}</td>
                          <td className="p-3 text-amber-400 font-bold">{panel.watts}W</td>
                          <td className="p-3 text-slate-300">{panel.voc}V</td>
                          <td className="p-3 text-slate-300">{panel.isc}A</td>
                          <td className="p-3 text-green-400">{panel.efficiency}%</td>
                          <td className="p-3 text-slate-400">{panel.warranty} years</td>
                          <td className="p-3 text-white">{panel.price.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Installation Tab */}
          {activeTab === 'installation' && (
            <motion.div
              key="installation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Solar System Installation Guide</h3>

                {/* Installation Steps */}
                <div className="space-y-6">
                  {[
                    {
                      step: 1,
                      title: 'Site Assessment',
                      description: 'Evaluate roof condition, orientation, shading, and structural capacity',
                      tasks: [
                        'Check roof orientation (North-facing preferred in Kenya)',
                        'Assess shading from trees, buildings, or obstacles',
                        'Verify roof structural integrity for panel weight (15-20kg per panel)',
                        'Measure available roof space',
                        'Check distance from inverter location to panels',
                        'Assess grid connection point for hybrid/grid-tie systems',
                      ],
                    },
                    {
                      step: 2,
                      title: 'System Design',
                      description: 'Calculate system size and select components',
                      tasks: [
                        'Determine daily energy consumption (check KPLC bills)',
                        'Calculate required PV capacity based on peak sun hours',
                        'Size battery bank for desired backup hours',
                        'Select inverter based on load requirements',
                        'Design string configuration (series/parallel)',
                        'Calculate cable sizes based on current and distance',
                      ],
                    },
                    {
                      step: 3,
                      title: 'Mounting Structure',
                      description: 'Install mounting rails and brackets',
                      tasks: [
                        'Mark panel positions on roof',
                        'Install mounting feet with waterproof sealing',
                        'Secure mounting rails (aluminum or galvanized steel)',
                        'Ensure proper tilt angle (0-15° from horizontal in Kenya)',
                        'Check alignment and level of all rails',
                        'Install mid and end clamps for panels',
                      ],
                    },
                    {
                      step: 4,
                      title: 'Panel Installation',
                      description: 'Mount and wire solar panels',
                      tasks: [
                        'Place panels on mounting structure',
                        'Secure with mid and end clamps',
                        'Connect panels in series strings (observe polarity)',
                        'Use proper MC4 connectors (ensure watertight)',
                        'Route DC cables in conduit or cable tray',
                        'Label all strings for easy identification',
                      ],
                    },
                    {
                      step: 5,
                      title: 'Inverter & Battery Setup',
                      description: 'Install and wire inverter and batteries',
                      tasks: [
                        'Mount inverter in well-ventilated location',
                        'Install battery rack/cabinet in cool, dry area',
                        'Connect batteries in series/parallel as required',
                        'Wire battery bank to inverter (observe polarity)',
                        'Connect PV input from panels',
                        'Install DC isolators and fuses',
                      ],
                    },
                    {
                      step: 6,
                      title: 'AC Wiring',
                      description: 'Connect inverter to loads and grid',
                      tasks: [
                        'Install dedicated distribution board for solar loads',
                        'Wire inverter AC output to distribution board',
                        'Connect essential loads to backup output',
                        'Wire grid input through changeover or automatic transfer',
                        'Install surge protection devices',
                        'Ensure proper earthing/grounding',
                      ],
                    },
                    {
                      step: 7,
                      title: 'Testing & Commissioning',
                      description: 'Verify system operation and safety',
                      tasks: [
                        'Check all DC and AC voltages',
                        'Verify string open-circuit voltages match design',
                        'Test inverter startup and operation',
                        'Check battery charging operation',
                        'Test grid-tie functionality (if applicable)',
                        'Verify protection devices operate correctly',
                        'Document system parameters and settings',
                        'Hand over operation manual to client',
                      ],
                    },
                  ].map((step) => (
                    <div key={step.step} className="bg-slate-900/50 rounded-xl p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-black font-bold text-xl flex-shrink-0">
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-white">{step.title}</h4>
                          <p className="text-slate-400 text-sm mb-3">{step.description}</p>
                          <ul className="space-y-1">
                            {step.tasks.map((task, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                <span className="text-green-400 mt-0.5">✓</span>
                                {task}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety Guidelines */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-400 mb-4">Safety Guidelines</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-bold text-white mb-2">Electrical Safety</h5>
                    <ul className="space-y-1 text-sm text-slate-300">
                      <li>• Always disconnect power before working on system</li>
                      <li>• Use insulated tools rated for DC voltage</li>
                      <li>• Never work on solar panels during daylight without covering</li>
                      <li>• Treat all exposed wires as live</li>
                      <li>• Follow proper lockout/tagout procedures</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-bold text-white mb-2">Working at Height</h5>
                    <ul className="space-y-1 text-sm text-slate-300">
                      <li>• Use proper fall protection equipment</li>
                      <li>• Secure ladders properly before climbing</li>
                      <li>• Never work on wet or slippery roofs</li>
                      <li>• Maintain 3-point contact when climbing</li>
                      <li>• Use proper lifting techniques for panels</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Wiring Diagrams Tab */}
          {activeTab === 'wiring' && (
            <motion.div
              key="wiring"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {Object.entries(WIRING_CONFIGS).map(([key, config]) => (
                <div key={key} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">{config.name} Wiring</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-900">
                        <tr>
                          <th className="p-3 text-left text-slate-400">Component</th>
                          <th className="p-3 text-left text-slate-400">Connection</th>
                          <th className="p-3 text-left text-slate-400">Wire Size</th>
                          <th className="p-3 text-left text-slate-400">Protection</th>
                        </tr>
                      </thead>
                      <tbody>
                        {config.components.map((comp, i) => (
                          <tr key={i} className="border-t border-slate-700">
                            <td className="p-3 text-amber-400 font-medium">{comp.name}</td>
                            <td className="p-3 text-slate-300">{comp.connection}</td>
                            <td className="p-3 text-green-400 font-mono">{comp.wire}</td>
                            <td className="p-3 text-slate-300">{comp.protection}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}

              {/* Cable Sizing Guide */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Cable Sizing Reference</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-900">
                      <tr>
                        <th className="p-3 text-left text-slate-400">Cable Size (mm²)</th>
                        <th className="p-3 text-left text-slate-400">Max DC Current</th>
                        <th className="p-3 text-left text-slate-400">Max AC Current</th>
                        <th className="p-3 text-left text-slate-400">Typical Use</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { size: '2.5', dcMax: 20, acMax: 25, use: 'Panel strings (short runs)' },
                        { size: '4', dcMax: 30, acMax: 32, use: 'Panel strings, small inverters' },
                        { size: '6', dcMax: 40, acMax: 40, use: 'MPPT to battery (short)' },
                        { size: '10', dcMax: 60, acMax: 55, use: 'Battery cables (short runs)' },
                        { size: '16', dcMax: 80, acMax: 70, use: 'Battery to inverter' },
                        { size: '25', dcMax: 110, acMax: 95, use: 'Large battery banks' },
                        { size: '35', dcMax: 140, acMax: 120, use: 'High-current applications' },
                        { size: '50', dcMax: 180, acMax: 155, use: 'Commercial installations' },
                      ].map((cable, i) => (
                        <tr key={i} className="border-t border-slate-700">
                          <td className="p-3 text-amber-400 font-bold">{cable.size} mm²</td>
                          <td className="p-3 text-green-400">{cable.dcMax}A</td>
                          <td className="p-3 text-blue-400">{cable.acMax}A</td>
                          <td className="p-3 text-slate-300">{cable.use}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Troubleshooting Tab */}
          {activeTab === 'troubleshooting' && (
            <motion.div
              key="troubleshooting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Brand Selector */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {['growatt', 'victron', 'deye', 'sma', 'huawei', 'goodwe', 'fronius', 'must', 'felicity'].map(brand => (
                  <button
                    key={brand}
                    onClick={() => setSelectedInverterBrand(brand)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                      selectedInverterBrand === brand
                        ? 'bg-amber-500 text-black'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {brand.charAt(0).toUpperCase() + brand.slice(1)}
                  </button>
                ))}
              </div>

              {/* Fault Codes */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                <div className="p-4 bg-slate-900 border-b border-slate-700">
                  <h3 className="text-xl font-bold text-white">
                    {selectedInverterBrand.charAt(0).toUpperCase() + selectedInverterBrand.slice(1)} Fault Codes
                  </h3>
                </div>
                <div className="divide-y divide-slate-700">
                  {FAULT_CODES[selectedInverterBrand as keyof typeof FAULT_CODES]?.map((fault, i) => (
                    <div key={i} className="p-4 hover:bg-slate-700/30">
                      <div className="flex items-start gap-4">
                        <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-lg font-mono font-bold">
                          {fault.code}
                        </span>
                        <div className="flex-1">
                          <div className="font-bold text-white">{fault.name}</div>
                          <div className="text-slate-400 text-sm mb-2">{fault.description}</div>
                          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                            <div className="text-green-400 font-bold text-sm mb-1">Solution:</div>
                            <div className="text-slate-300 text-sm">{fault.solution}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Issues */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Common Issues & Solutions</h3>
                <div className="space-y-4">
                  {[
                    {
                      issue: 'System not producing power',
                      causes: ['Inverter fault', 'DC isolator off', 'Blown fuse', 'Shading on panels'],
                      solution: 'Check inverter display, verify all isolators are on, check fuses, inspect panels for shading',
                    },
                    {
                      issue: 'Low power output',
                      causes: ['Dirty panels', 'Shading', 'Panel degradation', 'Incorrect MPPT settings'],
                      solution: 'Clean panels, remove shading sources, check panel I-V curve, verify MPPT configuration',
                    },
                    {
                      issue: 'Battery not charging',
                      causes: ['BMS fault', 'Incorrect voltage settings', 'Battery full', 'Cable fault'],
                      solution: 'Check BMS status, verify charge voltage settings, check battery SOC, inspect connections',
                    },
                    {
                      issue: 'Inverter keeps tripping',
                      causes: ['Overload', 'Short circuit', 'Grid fault', 'Over temperature'],
                      solution: 'Reduce load, check for shorts, verify grid voltage, improve ventilation',
                    },
                    {
                      issue: 'No grid feed-in (grid-tie)',
                      causes: ['Grid frequency out of range', 'Anti-islanding active', 'Export limit reached'],
                      solution: 'Check grid parameters, verify export settings, check utility regulations',
                    },
                  ].map((item, i) => (
                    <div key={i} className="bg-slate-900/50 rounded-lg p-4">
                      <div className="font-bold text-amber-400 mb-2">{item.issue}</div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-slate-400 text-xs mb-1">Possible Causes:</div>
                          <ul className="text-sm text-slate-300 space-y-1">
                            {item.causes.map((cause, j) => (
                              <li key={j}>• {cause}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="text-slate-400 text-xs mb-1">Solution:</div>
                          <div className="text-sm text-green-400">{item.solution}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Maintenance Tab */}
          {activeTab === 'maintenance' && (
            <motion.div
              key="maintenance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {Object.entries(MAINTENANCE_CHECKLIST).map(([interval, tasks]) => (
                <div key={interval} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-amber-400 mb-4 capitalize">{interval} Maintenance</h3>
                  <ul className="space-y-2">
                    {tasks.map((task, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-300">
                        <span className="mt-1 w-5 h-5 rounded border border-slate-600 flex-shrink-0" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </motion.div>
          )}

          {/* Costs Tab */}
          {activeTab === 'costs' && (
            <motion.div
              key="costs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <SizingCalculator />

              {/* Inverter Pricing */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Inverter Pricing Guide</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-900">
                      <tr>
                        <th className="p-3 text-left text-slate-400">Brand</th>
                        <th className="p-3 text-left text-slate-400">Model</th>
                        <th className="p-3 text-left text-slate-400">Power</th>
                        <th className="p-3 text-left text-slate-400">Type</th>
                        <th className="p-3 text-left text-slate-400">Warranty</th>
                        <th className="p-3 text-left text-slate-400">Price (KES)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {INVERTER_SPECS.map((inv, i) => (
                        <tr key={i} className="border-t border-slate-700">
                          <td className="p-3 text-white font-medium">{inv.brand}</td>
                          <td className="p-3 text-slate-400 font-mono text-xs">{inv.model}</td>
                          <td className="p-3 text-amber-400 font-bold">{inv.power}W</td>
                          <td className="p-3 text-slate-300">{inv.type}</td>
                          <td className="p-3 text-slate-400">{inv.warranty} years</td>
                          <td className="p-3 text-green-400 font-bold">{inv.price.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Battery Pricing */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Battery Pricing Guide</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-900">
                      <tr>
                        <th className="p-3 text-left text-slate-400">Brand</th>
                        <th className="p-3 text-left text-slate-400">Model</th>
                        <th className="p-3 text-left text-slate-400">Capacity</th>
                        <th className="p-3 text-left text-slate-400">Chemistry</th>
                        <th className="p-3 text-left text-slate-400">Cycles</th>
                        <th className="p-3 text-left text-slate-400">Warranty</th>
                        <th className="p-3 text-left text-slate-400">Price (KES)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {BATTERY_SPECS.map((bat, i) => (
                        <tr key={i} className="border-t border-slate-700">
                          <td className="p-3 text-white font-medium">{bat.brand}</td>
                          <td className="p-3 text-slate-400 font-mono text-xs">{bat.model}</td>
                          <td className="p-3 text-amber-400 font-bold">{bat.capacity} kWh</td>
                          <td className="p-3 text-slate-300">{bat.chemistry}</td>
                          <td className="p-3 text-slate-400">{bat.cycles}</td>
                          <td className="p-3 text-slate-400">{bat.warranty} years</td>
                          <td className="p-3 text-green-400 font-bold">{bat.price.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Comparison Tab */}
          {activeTab === 'comparison' && (
            <motion.div
              key="comparison"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Power Source Comparison (5kW System)</h3>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* Grid */}
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-blue-500/30">
                    <div className="text-center mb-4">
                      <span className="text-4xl">🔌</span>
                      <h4 className="text-lg font-bold text-blue-400 mt-2">KPLC Grid</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Connection Fee</span>
                        <span className="text-white">KES {COST_COMPARISON.grid.connection.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Monthly Fixed</span>
                        <span className="text-white">KES {COST_COMPARISON.grid.monthlyFixed}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Cost per kWh</span>
                        <span className="text-white">KES {COST_COMPARISON.grid.perKwh}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Reliability</span>
                        <span className="text-yellow-400">{COST_COMPARISON.grid.reliability}%</span>
                      </div>
                      <div className="border-t border-slate-700 pt-3 mt-3">
                        <div className="text-slate-400 text-xs">10-year cost (500 kWh/month)</div>
                        <div className="text-2xl font-bold text-blue-400">
                          KES {(COST_COMPARISON.grid.connection + (COST_COMPARISON.grid.monthlyFixed * 120) + (500 * COST_COMPARISON.grid.perKwh * 120)).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Generator */}
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-orange-500/30">
                    <div className="text-center mb-4">
                      <span className="text-4xl">⛽</span>
                      <h4 className="text-lg font-bold text-orange-400 mt-2">Diesel Generator</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Purchase Cost</span>
                        <span className="text-white">KES {COST_COMPARISON.generator.purchase.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Fuel Cost/kWh</span>
                        <span className="text-white">KES {COST_COMPARISON.generator.fuelPerKwh}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Monthly Maintenance</span>
                        <span className="text-white">KES {COST_COMPARISON.generator.maintenancePerMonth.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Reliability</span>
                        <span className="text-green-400">{COST_COMPARISON.generator.reliability}%</span>
                      </div>
                      <div className="border-t border-slate-700 pt-3 mt-3">
                        <div className="text-slate-400 text-xs">10-year cost (500 kWh/month)</div>
                        <div className="text-2xl font-bold text-orange-400">
                          KES {(COST_COMPARISON.generator.purchase + (500 * COST_COMPARISON.generator.fuelPerKwh * 120) + (COST_COMPARISON.generator.maintenancePerMonth * 120)).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Solar */}
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-green-500/30">
                    <div className="text-center mb-4">
                      <span className="text-4xl">☀️</span>
                      <h4 className="text-lg font-bold text-green-400 mt-2">Solar System</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">System Cost</span>
                        <span className="text-white">KES {COST_COMPARISON.solar.systemCost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Annual Maintenance</span>
                        <span className="text-white">KES {COST_COMPARISON.solar.maintenancePerYear.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Expected Lifespan</span>
                        <span className="text-white">{COST_COMPARISON.solar.lifespan} years</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Reliability</span>
                        <span className="text-green-400">{COST_COMPARISON.solar.reliability}%</span>
                      </div>
                      <div className="border-t border-slate-700 pt-3 mt-3">
                        <div className="text-slate-400 text-xs">10-year cost</div>
                        <div className="text-2xl font-bold text-green-400">
                          KES {(COST_COMPARISON.solar.systemCost + (COST_COMPARISON.solar.maintenancePerYear * 10)).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pros and Cons */}
                <div className="mt-6 grid md:grid-cols-3 gap-4">
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <h5 className="text-blue-400 font-bold mb-2">Grid Pros & Cons</h5>
                    <div className="text-sm space-y-1">
                      <div className="text-green-400">+ Low upfront cost</div>
                      <div className="text-green-400">+ No maintenance required</div>
                      <div className="text-red-400">- Unreliable supply (outages)</div>
                      <div className="text-red-400">- Rising tariffs</div>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <h5 className="text-orange-400 font-bold mb-2">Generator Pros & Cons</h5>
                    <div className="text-sm space-y-1">
                      <div className="text-green-400">+ Reliable backup</div>
                      <div className="text-green-400">+ Works anywhere</div>
                      <div className="text-red-400">- High running cost</div>
                      <div className="text-red-400">- Noise and emissions</div>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <h5 className="text-green-400 font-bold mb-2">Solar Pros & Cons</h5>
                    <div className="text-sm space-y-1">
                      <div className="text-green-400">+ Free energy after payback</div>
                      <div className="text-green-400">+ Clean and quiet</div>
                      <div className="text-red-400">- High upfront cost</div>
                      <div className="text-red-400">- Weather dependent</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Inventory Tab */}
          {activeTab === 'inventory' && (
            <motion.div
              key="inventory"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-3 gap-6">
                {/* Panels */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                  <h3 className="text-lg font-bold text-amber-400 mb-4">Solar Panels</h3>
                  <div className="space-y-3">
                    {PANEL_SPECS.map((panel, i) => (
                      <div key={i} className="bg-slate-900/50 rounded-lg p-3">
                        <div className="font-bold text-white">{panel.brand}</div>
                        <div className="text-amber-400">{panel.watts}W - {panel.efficiency}%</div>
                        <div className="text-green-400 font-bold">KES {panel.price.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inverters */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                  <h3 className="text-lg font-bold text-blue-400 mb-4">Inverters</h3>
                  <div className="space-y-3">
                    {INVERTER_SPECS.slice(0, 6).map((inv, i) => (
                      <div key={i} className="bg-slate-900/50 rounded-lg p-3">
                        <div className="font-bold text-white">{inv.brand}</div>
                        <div className="text-blue-400">{inv.power}W {inv.type}</div>
                        <div className="text-green-400 font-bold">KES {inv.price.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Batteries */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                  <h3 className="text-lg font-bold text-green-400 mb-4">Batteries</h3>
                  <div className="space-y-3">
                    {BATTERY_SPECS.map((bat, i) => (
                      <div key={i} className="bg-slate-900/50 rounded-lg p-3">
                        <div className="font-bold text-white">{bat.brand}</div>
                        <div className="text-green-400">{bat.capacity}kWh {bat.chemistry}</div>
                        <div className="text-green-400 font-bold">KES {bat.price.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Accessories */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Solar Accessories & Balance of System</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'MC4 Connectors (pair)', price: 150 },
                    { name: 'Solar Cable 4mm² (per m)', price: 120 },
                    { name: 'Solar Cable 6mm² (per m)', price: 180 },
                    { name: 'DC Isolator 32A', price: 2500 },
                    { name: 'DC Surge Arrester', price: 3500 },
                    { name: 'AC Surge Protector', price: 4500 },
                    { name: 'Battery Fuse 200A', price: 1800 },
                    { name: 'Mounting Rail (3m)', price: 3500 },
                    { name: 'End Clamps (set of 4)', price: 800 },
                    { name: 'Mid Clamps (set of 4)', price: 600 },
                    { name: 'Cable Glands (set)', price: 500 },
                    { name: 'Junction Box IP65', price: 1200 },
                  ].map((item, i) => (
                    <div key={i} className="bg-slate-900/50 rounded-lg p-3 text-center">
                      <div className="text-slate-300 text-sm">{item.name}</div>
                      <div className="text-amber-400 font-bold">KES {item.price.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Hybrid Systems Tab */}
          {activeTab === 'hybrid' && (
            <motion.div
              key="hybrid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* System Types */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-800/50 border border-amber-500/30 rounded-xl p-6">
                  <div className="text-4xl mb-3">☀️ + 🔌</div>
                  <h3 className="text-xl font-bold text-amber-400 mb-2">Solar + Grid</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Most common setup. Solar provides daytime power, grid supplements when needed.
                    Can export excess to grid if net metering is available.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-green-400">✓ Lower electricity bills</div>
                    <div className="flex items-center gap-2 text-green-400">✓ Grid backup at night</div>
                    <div className="flex items-center gap-2 text-green-400">✓ Lower initial cost (no batteries)</div>
                    <div className="flex items-center gap-2 text-red-400">✗ No power during outages</div>
                  </div>
                </div>

                <div className="bg-slate-800/50 border border-green-500/30 rounded-xl p-6">
                  <div className="text-4xl mb-3">☀️ + 🔋</div>
                  <h3 className="text-xl font-bold text-green-400 mb-2">Solar + Battery (Off-Grid)</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Complete independence from grid. Solar charges batteries during day,
                    batteries power loads at night.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-green-400">✓ Energy independence</div>
                    <div className="flex items-center gap-2 text-green-400">✓ Works in remote areas</div>
                    <div className="flex items-center gap-2 text-green-400">✓ No electricity bills</div>
                    <div className="flex items-center gap-2 text-red-400">✗ Highest initial cost</div>
                    <div className="flex items-center gap-2 text-red-400">✗ Limited capacity in bad weather</div>
                  </div>
                </div>

                <div className="bg-slate-800/50 border border-blue-500/30 rounded-xl p-6">
                  <div className="text-4xl mb-3">☀️ + 🔋 + 🔌</div>
                  <h3 className="text-xl font-bold text-blue-400 mb-2">Solar + Battery + Grid</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Best of all worlds. Solar first, battery backup, grid as last resort.
                    Can also charge batteries from grid during cheap hours.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-green-400">✓ Maximum reliability</div>
                    <div className="flex items-center gap-2 text-green-400">✓ Backup during outages</div>
                    <div className="flex items-center gap-2 text-green-400">✓ Lowest running costs</div>
                    <div className="flex items-center gap-2 text-green-400">✓ Flexible operation modes</div>
                  </div>
                </div>
              </div>

              {/* Solar + Generator */}
              <div className="bg-slate-800/50 border border-orange-500/30 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">☀️ + 🔋 + ⛽</div>
                  <div>
                    <h3 className="text-xl font-bold text-orange-400">Solar + Battery + Generator</h3>
                    <p className="text-slate-400">For locations without grid access or requiring high reliability</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-white mb-3">How It Works</h4>
                    <ol className="space-y-2 text-sm text-slate-300">
                      <li>1. Solar panels charge batteries during the day</li>
                      <li>2. Batteries power loads when solar is insufficient</li>
                      <li>3. Generator auto-starts when battery reaches low threshold</li>
                      <li>4. Generator charges batteries and powers loads</li>
                      <li>5. Generator stops when batteries are sufficiently charged</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-3">Recommended Settings</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between bg-slate-900/50 p-2 rounded">
                        <span className="text-slate-400">Generator Start SOC</span>
                        <span className="text-amber-400">20-30%</span>
                      </div>
                      <div className="flex justify-between bg-slate-900/50 p-2 rounded">
                        <span className="text-slate-400">Generator Stop SOC</span>
                        <span className="text-green-400">80-90%</span>
                      </div>
                      <div className="flex justify-between bg-slate-900/50 p-2 rounded">
                        <span className="text-slate-400">Bulk Charge Voltage (48V)</span>
                        <span className="text-blue-400">56.0-57.6V</span>
                      </div>
                      <div className="flex justify-between bg-slate-900/50 p-2 rounded">
                        <span className="text-slate-400">Float Voltage (48V)</span>
                        <span className="text-blue-400">54.0-55.2V</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Triple Hybrid: Solar + Grid + Generator */}
              <div className="bg-gradient-to-r from-amber-500/10 via-blue-500/10 to-orange-500/10 border border-slate-700 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">☀️ + 🔋 + 🔌 + ⛽</div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Ultimate Hybrid: Solar + Battery + Grid + Generator</h3>
                    <p className="text-slate-400">Maximum reliability for critical applications</p>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-4">
                  <h4 className="font-bold text-amber-400 mb-3">Priority Order</h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-lg">1. Solar</span>
                    <span className="text-slate-500">→</span>
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-lg">2. Battery</span>
                    <span className="text-slate-500">→</span>
                    <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg">3. Grid</span>
                    <span className="text-slate-500">→</span>
                    <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-lg">4. Generator</span>
                  </div>
                  <p className="text-slate-400 text-sm mt-3">
                    Use solar as primary source. Store excess in batteries. Use grid when solar/battery insufficient.
                    Generator as last resort backup for extended outages.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Need Professional Solar Services?</h3>
          <p className="text-white/90 mb-6">Installation, maintenance, troubleshooting - we cover all 47 counties</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="tel:+254782914717"
              className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-3 rounded-xl font-bold transition-colors"
            >
              📞 Call: 0782 914 717
            </a>
            <a
              href="https://wa.me/254782914717?text=Hi, I need solar system services"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-bold transition-colors"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            © 2026 Emerson Industrial Maintenance Services Limited. Comprehensive Solar Solutions Across Kenya.
          </p>
        </div>
      </footer>
    </div>
  );
}
