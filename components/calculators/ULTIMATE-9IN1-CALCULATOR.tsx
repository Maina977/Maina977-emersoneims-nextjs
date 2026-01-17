'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut, Radar, Pie } from 'react-chartjs-2';
import {
  Zap, Sun, Battery, Cpu, Snowflake, Droplets,
  Hammer, Flame, TrendingUp, Download, Calculator,
  Gauge, Activity, DollarSign, Award, Info
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface CalculatorResult {
  value: number;
  unit: string;
  details: Record<string, any>;
  charts: ChartData[];
  recommendations: string[];
  costBreakdown: CostItem[];
  efficiency: number;
}

interface ChartData {
  type: 'gauge' | 'line' | 'bar' | 'doughnut' | 'radar' | 'pie';
  title: string;
  data: any;
  options: any;
}

interface CostItem {
  name: string;
  cost: number;
  percentage: number;
}

type CalculatorType = 'generator' | 'solar' | 'ups' | 'motor' | 'ac' | 'borehole' | 'fabrication' | 'incinerator' | 'highvoltage';

const CALCULATORS = [
  { id: 'generator', name: 'Generator Sizing', icon: Zap, color: '#FF6B35' },
  { id: 'solar', name: 'Solar System', icon: Sun, color: '#F7931E' },
  { id: 'ups', name: 'UPS Calculator', icon: Battery, color: '#00A8E8' },
  { id: 'motor', name: 'Motor Rewinding', icon: Cpu, color: '#6A4C93' },
  { id: 'ac', name: 'AC Sizing', icon: Snowflake, color: '#00BFB3' },
  { id: 'borehole', name: 'Borehole Pump', icon: Droplets, color: '#1982C4' },
  { id: 'fabrication', name: 'Fabrication', icon: Hammer, color: '#8B4513' },
  { id: 'incinerator', name: 'Incinerator', icon: Flame, color: '#FF4500' },
  { id: 'highvoltage', name: 'High Voltage', icon: TrendingUp, color: '#FFD60A' },
];

export default function Ultimate9In1Calculator() {
  const [activeCalc, setActiveCalc] = useState<CalculatorType>('generator');
  const [calculating, setCalculating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<CalculatorResult | null>(null);

  // Generator inputs
  const [genInputs, setGenInputs] = useState({
    totalLoad: 10000,
    startingCurrent: 3,
    altitude: 0,
    temperature: 25,
    diversityFactor: 0.8,
    powerFactor: 0.8,
    fuelType: 'diesel',
    runtime: 8,
  });

  // Solar inputs
  const [solarInputs, setSolarInputs] = useState({
    dailyConsumption: 20,
    peakSunHours: 5,
    systemVoltage: 24,
    batteryDays: 2,
    degradation: 0.8,
    mpptEfficiency: 0.98,
    depthOfDischarge: 0.5,
    inverterEfficiency: 0.95,
  });

  // UPS inputs
  const [upsInputs, setUpsInputs] = useState({
    loadWatts: 2000,
    loadVA: 2500,
    backupTime: 30,
    batteryVoltage: 12,
    batteriesInSeries: 2,
    efficiency: 0.9,
    powerFactor: 0.8,
    batteryType: 'lithium',
  });

  // Motor inputs
  const [motorInputs, setMotorInputs] = useState({
    motorHP: 10,
    voltage: 380,
    poles: 4,
    frequency: 50,
    efficiency: 0.88,
    powerFactor: 0.85,
    windingType: 'copper',
    slotFillFactor: 0.6,
  });

  // AC inputs
  const [acInputs, setAcInputs] = useState({
    roomLength: 5,
    roomWidth: 4,
    roomHeight: 3,
    occupants: 4,
    windows: 2,
    sunExposure: 'moderate',
    insulation: 'average',
    topFloor: false,
  });

  // Borehole inputs
  const [boreholeInputs, setBoreholeInputs] = useState({
    staticWaterLevel: 20,
    drawdownLevel: 30,
    flowRate: 5,
    pipeLength: 50,
    pipeDiameter: 2,
    elevation: 10,
    pumpEfficiency: 0.7,
    pipeRoughness: 0.015,
  });

  // Fabrication inputs
  const [fabricationInputs, setFabricationInputs] = useState({
    materialType: 'steel',
    thickness: 6,
    length: 10,
    width: 2,
    quantity: 5,
    weldingType: 'arc',
    paintLayers: 2,
    laborHourlyRate: 50,
  });

  // Incinerator inputs
  const [incineratorInputs, setIncineratorInputs] = useState({
    wasteType: 'medical',
    dailyCapacity: 500,
    burnRate: 100,
    temperature: 850,
    chambersNumber: 2,
    heatRecovery: true,
    scrubberType: 'wet',
    ashRemoval: 'automatic',
  });

  // High Voltage inputs
  const [hvInputs, setHvInputs] = useState({
    voltage: 11000,
    current: 100,
    distance: 1000,
    conductorType: 'aluminum',
    conductorSize: 95,
    powerFactor: 0.85,
    temperature: 40,
    installationType: 'overhead',
  });

  const calculateResult = () => {
    setCalculating(true);
    setProgress(0);

    // Simulate progressive calculation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setCalculating(false);
            generateResult();
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const generateResult = () => {
    switch (activeCalc) {
      case 'generator':
        setResult(calculateGenerator());
        break;
      case 'solar':
        setResult(calculateSolar());
        break;
      case 'ups':
        setResult(calculateUPS());
        break;
      case 'motor':
        setResult(calculateMotor());
        break;
      case 'ac':
        setResult(calculateAC());
        break;
      case 'borehole':
        setResult(calculateBorehole());
        break;
      case 'fabrication':
        setResult(calculateFabrication());
        break;
      case 'incinerator':
        setResult(calculateIncinerator());
        break;
      case 'highvoltage':
        setResult(calculateHighVoltage());
        break;
    }
  };

  const calculateGenerator = (): CalculatorResult => {
    const { totalLoad, startingCurrent, altitude, temperature, diversityFactor, powerFactor, fuelType, runtime } = genInputs;

    // Advanced calculations
    const altitudeDerating = 1 - (altitude * 0.035 / 1000);
    const tempDerating = temperature > 40 ? 1 - ((temperature - 40) * 0.01) : 1;
    const effectiveLoad = totalLoad * diversityFactor;
    const startingKVA = (effectiveLoad * startingCurrent) / 1000;
    const runningKVA = effectiveLoad / (powerFactor * 1000);
    const requiredKVA = Math.max(startingKVA, runningKVA) / (altitudeDerating * tempDerating);
    const recommendedKVA = Math.ceil(requiredKVA * 1.25 / 10) * 10;

    // Fuel consumption
    const fuelRate = fuelType === 'diesel' ? 0.3 : 0.4; // L/kWh
    const dailyFuelConsumption = (recommendedKVA * 0.8 * runtime * fuelRate);
    const monthlyFuelCost = dailyFuelConsumption * 30 * (fuelType === 'diesel' ? 3.5 : 2.8);

    // Cost breakdown
    const generatorCost = recommendedKVA * 450;
    const installationCost = generatorCost * 0.15;
    const maintenanceCost = generatorCost * 0.05;
    const totalCost = generatorCost + installationCost + maintenanceCost;

    const costBreakdown: CostItem[] = [
      { name: 'Generator Unit', cost: generatorCost, percentage: (generatorCost / totalCost) * 100 },
      { name: 'Installation', cost: installationCost, percentage: (installationCost / totalCost) * 100 },
      { name: 'Maintenance (Annual)', cost: maintenanceCost, percentage: (maintenanceCost / totalCost) * 100 },
    ];

    // Efficiency calculation
    const efficiency = Math.min(95, 85 + (powerFactor * 10));

    // Charts
    const charts: ChartData[] = [
      {
        type: 'gauge',
        title: 'Load vs Capacity',
        data: {
          labels: ['Used', 'Available'],
          datasets: [{
            data: [effectiveLoad / 1000, recommendedKVA - (effectiveLoad / 1000)],
            backgroundColor: ['#FF6B35', '#E8E8E8'],
            borderWidth: 0,
          }],
        },
        options: {
          responsive: true,
          cutout: '75%',
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context: any) => `${context.label}: ${context.parsed.toFixed(1)} kVA`
              }
            }
          }
        }
      },
      {
        type: 'bar',
        title: 'Cost Breakdown',
        data: {
          labels: costBreakdown.map(item => item.name),
          datasets: [{
            label: 'Cost (USD)',
            data: costBreakdown.map(item => item.cost),
            backgroundColor: ['#FF6B35', '#FFA07A', '#FFB84D'],
            borderRadius: 8,
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: { beginAtZero: true, ticks: { callback: (value: any) => `$${value.toLocaleString()}` } }
          }
        }
      },
      {
        type: 'line',
        title: 'Monthly Fuel Cost Projection',
        data: {
          labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
          datasets: [{
            label: 'Fuel Cost',
            data: Array(6).fill(monthlyFuelCost).map((cost, i) => cost * (1 + i * 0.02)),
            borderColor: '#FF6B35',
            backgroundColor: 'rgba(255, 107, 53, 0.1)',
            fill: true,
            tension: 0.4,
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: { beginAtZero: true, ticks: { callback: (value: any) => `$${value.toFixed(0)}` } }
          }
        }
      },
      {
        type: 'doughnut',
        title: 'Efficiency Rating',
        data: {
          labels: ['Efficiency', 'Loss'],
          datasets: [{
            data: [efficiency, 100 - efficiency],
            backgroundColor: ['#4CAF50', '#E8E8E8'],
            borderWidth: 0,
          }],
        },
        options: {
          responsive: true,
          cutout: '70%',
          plugins: {
            legend: { display: false },
          }
        }
      },
      {
        type: 'radar',
        title: 'System Performance',
        data: {
          labels: ['Capacity', 'Efficiency', 'Reliability', 'Cost-Effectiveness', 'Fuel Economy'],
          datasets: [{
            label: 'Performance',
            data: [
              (recommendedKVA / (requiredKVA * 1.5)) * 100,
              efficiency,
              90,
              75,
              fuelType === 'diesel' ? 85 : 70
            ],
            backgroundColor: 'rgba(255, 107, 53, 0.2)',
            borderColor: '#FF6B35',
            pointBackgroundColor: '#FF6B35',
          }],
        },
        options: {
          responsive: true,
          scales: {
            r: {
              beginAtZero: true,
              max: 100,
            }
          }
        }
      },
    ];

    return {
      value: recommendedKVA,
      unit: 'kVA',
      details: {
        effectiveLoad: effectiveLoad / 1000,
        startingKVA,
        runningKVA,
        altitudeDerating,
        tempDerating,
        dailyFuelConsumption,
        monthlyFuelCost,
        annualFuelCost: monthlyFuelCost * 12,
      },
      charts,
      recommendations: [
        `Recommended generator size: ${recommendedKVA} kVA`,
        `Expected fuel consumption: ${dailyFuelConsumption.toFixed(1)} L/day`,
        `Estimated monthly fuel cost: $${monthlyFuelCost.toFixed(2)}`,
        `System efficiency: ${efficiency.toFixed(1)}%`,
        altitudeDerating < 1 ? `Altitude derating applied: ${(altitudeDerating * 100).toFixed(1)}%` : '',
        tempDerating < 1 ? `Temperature derating applied: ${(tempDerating * 100).toFixed(1)}%` : '',
      ].filter(Boolean),
      costBreakdown,
      efficiency,
    };
  };

  const calculateSolar = (): CalculatorResult => {
    const { dailyConsumption, peakSunHours, systemVoltage, batteryDays, degradation, mpptEfficiency, depthOfDischarge, inverterEfficiency } = solarInputs;

    // Advanced calculations
    const dailyConsumptionWh = dailyConsumption * 1000;
    const requiredPanelWp = (dailyConsumptionWh / peakSunHours) / (degradation * mpptEfficiency);
    const recommendedPanelWp = Math.ceil(requiredPanelWp / 100) * 100;
    const numberOfPanels = Math.ceil(recommendedPanelWp / 300); // Assuming 300W panels

    // Battery calculations
    const batteryCapacityAh = (dailyConsumptionWh * batteryDays) / (systemVoltage * depthOfDischarge * inverterEfficiency);
    const recommendedBatteryAh = Math.ceil(batteryCapacityAh / 100) * 100;
    const batteryBankWh = (recommendedBatteryAh * systemVoltage) / 1000;

    // Cost calculations
    const panelCost = recommendedPanelWp * 0.6;
    const batteryCost = batteryBankWh * 200;
    const inverterCost = dailyConsumptionWh * 0.3;
    const controllerCost = recommendedPanelWp * 0.15;
    const installationCost = (panelCost + batteryCost + inverterCost) * 0.2;
    const totalCost = panelCost + batteryCost + inverterCost + controllerCost + installationCost;

    // ROI calculations
    const monthlySavings = dailyConsumption * 30 * 0.15; // $0.15 per kWh
    const annualSavings = monthlySavings * 12;
    const paybackPeriod = totalCost / annualSavings;

    const costBreakdown: CostItem[] = [
      { name: 'Solar Panels', cost: panelCost, percentage: (panelCost / totalCost) * 100 },
      { name: 'Battery Bank', cost: batteryCost, percentage: (batteryCost / totalCost) * 100 },
      { name: 'Inverter', cost: inverterCost, percentage: (inverterCost / totalCost) * 100 },
      { name: 'Charge Controller', cost: controllerCost, percentage: (controllerCost / totalCost) * 100 },
      { name: 'Installation', cost: installationCost, percentage: (installationCost / totalCost) * 100 },
    ];

    const efficiency = Math.min(95, degradation * mpptEfficiency * inverterEfficiency * 100);

    const charts: ChartData[] = [
      {
        type: 'gauge',
        title: 'Daily Energy Balance',
        data: {
          labels: ['Production', 'Consumption'],
          datasets: [{
            data: [(recommendedPanelWp * peakSunHours) / 1000, dailyConsumption],
            backgroundColor: ['#F7931E', '#FFD700'],
            borderWidth: 0,
          }],
        },
        options: {
          responsive: true,
          cutout: '75%',
          plugins: { legend: { display: false } }
        }
      },
      {
        type: 'pie',
        title: 'System Cost Distribution',
        data: {
          labels: costBreakdown.map(item => item.name),
          datasets: [{
            data: costBreakdown.map(item => item.cost),
            backgroundColor: ['#F7931E', '#FFD700', '#FFA500', '#FF8C00', '#FF6B35'],
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: {
              callbacks: {
                label: (context: any) => `${context.label}: $${context.parsed.toLocaleString()}`
              }
            }
          }
        }
      },
      {
        type: 'line',
        title: '10-Year Savings Projection',
        data: {
          labels: Array.from({ length: 10 }, (_, i) => `Year ${i + 1}`),
          datasets: [{
            label: 'Cumulative Savings',
            data: Array.from({ length: 10 }, (_, i) => (i + 1) * annualSavings - (i === 0 ? totalCost : 0)),
            borderColor: '#F7931E',
            backgroundColor: 'rgba(247, 147, 30, 0.1)',
            fill: true,
            tension: 0.4,
          }],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              ticks: { callback: (value: any) => `$${value.toLocaleString()}` },
              grid: { color: 'rgba(0,0,0,0.05)' }
            }
          }
        }
      },
      {
        type: 'doughnut',
        title: 'System Efficiency',
        data: {
          labels: ['Efficiency', 'Loss'],
          datasets: [{
            data: [efficiency, 100 - efficiency],
            backgroundColor: ['#4CAF50', '#E8E8E8'],
            borderWidth: 0,
          }],
        },
        options: {
          responsive: true,
          cutout: '70%',
          plugins: { legend: { display: false } }
        }
      },
      {
        type: 'bar',
        title: 'Monthly Production vs Consumption',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Production',
              data: Array(12).fill((recommendedPanelWp * peakSunHours * 30) / 1000).map((v, i) => v * (1 - 0.1 * Math.sin((i - 5) * Math.PI / 6))),
              backgroundColor: '#F7931E',
            },
            {
              label: 'Consumption',
              data: Array(12).fill(dailyConsumption * 30),
              backgroundColor: '#00BFB3',
            }
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { position: 'bottom' } },
          scales: { y: { beginAtZero: true, ticks: { callback: (value: any) => `${value} kWh` } } }
        }
      },
    ];

    return {
      value: recommendedPanelWp,
      unit: 'Wp',
      details: {
        numberOfPanels,
        batteryCapacity: recommendedBatteryAh,
        batteryBankWh,
        dailyProduction: (recommendedPanelWp * peakSunHours) / 1000,
        annualSavings,
        paybackPeriod: paybackPeriod.toFixed(1),
        systemEfficiency: efficiency,
      },
      charts,
      recommendations: [
        `Recommended solar panel capacity: ${recommendedPanelWp} Wp (${numberOfPanels} × 300W panels)`,
        `Battery bank required: ${recommendedBatteryAh} Ah at ${systemVoltage}V (${batteryBankWh.toFixed(1)} kWh)`,
        `Expected daily production: ${((recommendedPanelWp * peakSunHours) / 1000).toFixed(1)} kWh`,
        `Annual savings: $${annualSavings.toFixed(2)}`,
        `Payback period: ${paybackPeriod.toFixed(1)} years`,
        `System efficiency: ${efficiency.toFixed(1)}%`,
      ],
      costBreakdown,
      efficiency,
    };
  };

  const calculateUPS = (): CalculatorResult => {
    const { loadWatts, loadVA, backupTime, batteryVoltage, batteriesInSeries, efficiency, powerFactor, batteryType } = upsInputs;

    // Advanced calculations
    const systemVoltage = batteryVoltage * batteriesInSeries;
    const actualLoad = Math.max(loadWatts, loadVA * powerFactor);
    const batteryLoad = actualLoad / efficiency;
    const backupTimeHours = backupTime / 60;
    const requiredAh = (batteryLoad * backupTimeHours) / systemVoltage;
    const recommendedAh = Math.ceil(requiredAh / 50) * 50;

    // Battery life cycles
    const cycleLife = batteryType === 'lithium' ? 3000 : 500;
    const dailyCycles = 1;
    const batteryLifeYears = (cycleLife / dailyCycles) / 365;

    // Cost calculations
    const upsCost = loadVA * 0.8;
    const batteryCost = recommendedAh * systemVoltage * (batteryType === 'lithium' ? 0.5 : 0.15);
    const installationCost = (upsCost + batteryCost) * 0.1;
    const maintenanceCost = batteryCost * 0.05;
    const totalCost = upsCost + batteryCost + installationCost + maintenanceCost;

    const costBreakdown: CostItem[] = [
      { name: 'UPS Unit', cost: upsCost, percentage: (upsCost / totalCost) * 100 },
      { name: 'Battery Bank', cost: batteryCost, percentage: (batteryCost / totalCost) * 100 },
      { name: 'Installation', cost: installationCost, percentage: (installationCost / totalCost) * 100 },
      { name: 'Annual Maintenance', cost: maintenanceCost, percentage: (maintenanceCost / totalCost) * 100 },
    ];

    const charts: ChartData[] = [
      {
        type: 'gauge',
        title: 'Load vs Capacity',
        data: {
          labels: ['Load', 'Reserve'],
          datasets: [{
            data: [actualLoad, loadVA - actualLoad],
            backgroundColor: ['#00A8E8', '#E8E8E8'],
            borderWidth: 0,
          }],
        },
        options: {
          responsive: true,
          cutout: '75%',
          plugins: { legend: { display: false } }
        }
      },
      {
        type: 'line',
        title: 'Runtime Curve',
        data: {
          labels: Array.from({ length: 11 }, (_, i) => `${i * 10}%`),
          datasets: [{
            label: 'Backup Time (minutes)',
            data: Array.from({ length: 11 }, (_, i) => backupTime * (1 - i * 0.1) * 1.5),
            borderColor: '#00A8E8',
            backgroundColor: 'rgba(0, 168, 232, 0.1)',
            fill: true,
            tension: 0.4,
          }],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            x: { title: { display: true, text: 'Load Percentage' } },
            y: { beginAtZero: true, title: { display: true, text: 'Minutes' } }
          }
        }
      },
      {
        type: 'bar',
        title: 'Cost Breakdown',
        data: {
          labels: costBreakdown.map(item => item.name),
          datasets: [{
            label: 'Cost (USD)',
            data: costBreakdown.map(item => item.cost),
            backgroundColor: ['#00A8E8', '#0077B6', '#023E8A', '#03045E'],
            borderRadius: 8,
          }],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, ticks: { callback: (value: any) => `$${value.toLocaleString()}` } } }
        }
      },
      {
        type: 'doughnut',
        title: 'Efficiency Rating',
        data: {
          labels: ['Efficiency', 'Loss'],
          datasets: [{
            data: [efficiency * 100, (1 - efficiency) * 100],
            backgroundColor: ['#4CAF50', '#E8E8E8'],
            borderWidth: 0,
          }],
        },
        options: {
          responsive: true,
          cutout: '70%',
          plugins: { legend: { display: false } }
        }
      },
    ];

    return {
      value: recommendedAh,
      unit: 'Ah',
      details: {
        systemVoltage,
        actualLoad,
        batteryLoad,
        backupTimeHours,
        cycleLife,
        batteryLifeYears: batteryLifeYears.toFixed(1),
        totalCost,
      },
      charts,
      recommendations: [
        `Recommended battery capacity: ${recommendedAh} Ah at ${systemVoltage}V`,
        `UPS rating required: ${loadVA} VA`,
        `Backup time at full load: ${backupTime} minutes`,
        `Battery life expectancy: ${batteryLifeYears.toFixed(1)} years`,
        `System efficiency: ${(efficiency * 100).toFixed(1)}%`,
        batteryType === 'lithium' ? 'Lithium batteries offer 3-5x longer life than lead-acid' : 'Consider lithium batteries for longer life',
      ],
      costBreakdown,
      efficiency: efficiency * 100,
    };
  };

  const calculateMotor = (): CalculatorResult => {
    const { motorHP, voltage, poles, frequency, efficiency, powerFactor, windingType, slotFillFactor } = motorInputs;

    // Advanced calculations
    const motorKW = motorHP * 0.746;
    const rpm = (120 * frequency) / poles;
    const fullLoadCurrent = (motorKW * 1000) / (Math.sqrt(3) * voltage * efficiency * powerFactor);

    // Winding calculations
    const copperDensity = windingType === 'copper' ? 8.96 : 2.7; // kg/dm³
    const copperResistivity = windingType === 'copper' ? 0.0172 : 0.0282; // Ω·mm²/m
    const windingWeight = motorKW * 1.2 * copperDensity;
    const windingLength = motorKW * 50; // Approximate

    // Loss calculations
    const copperLoss = 3 * Math.pow(fullLoadCurrent, 2) * copperResistivity * windingLength / 1000;
    const ironLoss = motorKW * 0.02;
    const mechanicalLoss = motorKW * 0.01;
    const totalLoss = copperLoss + ironLoss + mechanicalLoss;

    // Cost calculations
    const materialCost = windingWeight * (windingType === 'copper' ? 15 : 8);
    const laborHours = motorKW * 2;
    const laborCost = laborHours * 45;
    const varnishCost = motorKW * 5;
    const testingCost = motorKW * 8;
    const totalCost = materialCost + laborCost + varnishCost + testingCost;

    const costBreakdown: CostItem[] = [
      { name: 'Winding Material', cost: materialCost, percentage: (materialCost / totalCost) * 100 },
      { name: 'Labor', cost: laborCost, percentage: (laborCost / totalCost) * 100 },
      { name: 'Varnish & Insulation', cost: varnishCost, percentage: (varnishCost / totalCost) * 100 },
      { name: 'Testing', cost: testingCost, percentage: (testingCost / totalCost) * 100 },
    ];

    const charts: ChartData[] = [
      {
        type: 'doughnut',
        title: 'Motor Losses Distribution',
        data: {
          labels: ['Copper Loss', 'Iron Loss', 'Mechanical Loss', 'Output Power'],
          datasets: [{
            data: [copperLoss, ironLoss, mechanicalLoss, motorKW],
            backgroundColor: ['#6A4C93', '#8B5A8B', '#A06B9E', '#4CAF50'],
            borderWidth: 0,
          }],
        },
        options: {
          responsive: true,
          cutout: '60%',
          plugins: {
            legend: { position: 'bottom' },
            tooltip: {
              callbacks: {
                label: (context: any) => `${context.label}: ${context.parsed.toFixed(2)} kW`
              }
            }
          }
        }
      },
      {
        type: 'bar',
        title: 'Rewinding Cost Breakdown',
        data: {
          labels: costBreakdown.map(item => item.name),
          datasets: [{
            label: 'Cost (USD)',
            data: costBreakdown.map(item => item.cost),
            backgroundColor: ['#6A4C93', '#8B5A8B', '#A06B9E', '#C084C0'],
            borderRadius: 8,
          }],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, ticks: { callback: (value: any) => `$${value.toLocaleString()}` } } }
        }
      },
      {
        type: 'gauge',
        title: 'Efficiency Rating',
        data: {
          labels: ['Efficiency', 'Loss'],
          datasets: [{
            data: [efficiency * 100, (1 - efficiency) * 100],
            backgroundColor: ['#4CAF50', '#E8E8E8'],
            borderWidth: 0,
          }],
        },
        options: {
          responsive: true,
          cutout: '75%',
          plugins: { legend: { display: false } }
        }
      },
      {
        type: 'radar',
        title: 'Motor Performance Metrics',
        data: {
          labels: ['Efficiency', 'Power Factor', 'Torque', 'Reliability', 'Cost-Effectiveness'],
          datasets: [{
            label: 'Performance',
            data: [
              efficiency * 100,
              powerFactor * 100,
              85,
              90,
              75,
            ],
            backgroundColor: 'rgba(106, 76, 147, 0.2)',
            borderColor: '#6A4C93',
            pointBackgroundColor: '#6A4C93',
          }],
        },
        options: {
          responsive: true,
          scales: { r: { beginAtZero: true, max: 100 } }
        }
      },
    ];

    return {
      value: windingWeight,
      unit: 'kg',
      details: {
        motorKW,
        rpm,
        fullLoadCurrent: fullLoadCurrent.toFixed(2),
        windingLength,
        copperLoss: copperLoss.toFixed(2),
        ironLoss: ironLoss.toFixed(2),
        mechanicalLoss: mechanicalLoss.toFixed(2),
        totalLoss: totalLoss.toFixed(2),
        laborHours,
      },
      charts,
      recommendations: [
        `Motor rating: ${motorHP} HP (${motorKW.toFixed(2)} kW)`,
        `Rated speed: ${rpm} RPM`,
        `Full load current: ${fullLoadCurrent.toFixed(2)} A`,
        `Winding material required: ${windingWeight.toFixed(2)} kg of ${windingType}`,
        `Estimated labor time: ${laborHours.toFixed(1)} hours`,
        `Total rewinding cost: $${totalCost.toFixed(2)}`,
        `Efficiency: ${(efficiency * 100).toFixed(1)}%`,
      ],
      costBreakdown,
      efficiency: efficiency * 100,
    };
  };

  const calculateAC = (): CalculatorResult => {
    const { roomLength, roomWidth, roomHeight, occupants, windows, sunExposure, insulation, topFloor } = acInputs;

    // Advanced BTU calculations
    const roomArea = roomLength * roomWidth;
    const roomVolume = roomArea * roomHeight;

    // Base BTU
    const baseBTU = roomArea * 25;

    // Occupancy factor
    const occupancyBTU = occupants * 600;

    // Window factor
    const windowBTU = windows * 1000 * (sunExposure === 'high' ? 1.5 : sunExposure === 'moderate' ? 1.2 : 0.8);

    // Insulation factor
    const insulationMultiplier = insulation === 'good' ? 0.9 : insulation === 'average' ? 1.0 : 1.15;

    // Top floor factor
    const topFloorBTU = topFloor ? roomArea * 10 : 0;

    // Total BTU
    const totalBTU = (baseBTU + occupancyBTU + windowBTU + topFloorBTU) * insulationMultiplier;
    const recommendedBTU = Math.ceil(totalBTU / 1000) * 1000;
    const tonnage = recommendedBTU / 12000;

    // CFM calculations
    const requiredCFM = roomVolume * 0.5; // 0.5 air changes per minute

    // Power calculations
    const powerConsumption = (tonnage * 1200) / 3.412; // Watts
    const monthlyCost = (powerConsumption * 8 * 30 * 0.15) / 1000;
    const annualCost = monthlyCost * 6; // 6 months of cooling

    // Cost calculations
    const unitCost = tonnage * 500;
    const installationCost = unitCost * 0.2;
    const maintenanceCost = unitCost * 0.05;
    const totalCost = unitCost + installationCost + maintenanceCost;

    const costBreakdown: CostItem[] = [
      { name: 'AC Unit', cost: unitCost, percentage: (unitCost / totalCost) * 100 },
      { name: 'Installation', cost: installationCost, percentage: (installationCost / totalCost) * 100 },
      { name: 'Annual Maintenance', cost: maintenanceCost, percentage: (maintenanceCost / totalCost) * 100 },
    ];

    const efficiency = 85; // EER based

    const charts: ChartData[] = [
      {
        type: 'bar',
        title: 'Heat Load Breakdown',
        data: {
          labels: ['Base Load', 'Occupancy', 'Windows', 'Top Floor', 'Insulation'],
          datasets: [{
            label: 'BTU',
            data: [baseBTU, occupancyBTU, windowBTU, topFloorBTU, totalBTU * (insulationMultiplier - 1)],
            backgroundColor: ['#00BFB3', '#00A896', '#028090', '#05668D', '#02C39A'],
            borderRadius: 8,
          }],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, ticks: { callback: (value: any) => `${value.toLocaleString()} BTU` } } }
        }
      },
      {
        type: 'gauge',
        title: 'Cooling Capacity',
        data: {
          labels: ['Required', 'Reserve'],
          datasets: [{
            data: [totalBTU, recommendedBTU - totalBTU],
            backgroundColor: ['#00BFB3', '#E8E8E8'],
            borderWidth: 0,
          }],
        },
        options: {
          responsive: true,
          cutout: '75%',
          plugins: { legend: { display: false } }
        }
      },
      {
        type: 'line',
        title: 'Monthly Operating Cost',
        data: {
          labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
          datasets: [{
            label: 'Cost (USD)',
            data: [
              monthlyCost * 0.7,
              monthlyCost * 0.9,
              monthlyCost,
              monthlyCost * 1.1,
              monthlyCost,
              monthlyCost * 0.8,
            ],
            borderColor: '#00BFB3',
            backgroundColor: 'rgba(0, 191, 179, 0.1)',
            fill: true,
            tension: 0.4,
          }],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, ticks: { callback: (value: any) => `$${value.toFixed(0)}` } } }
        }
      },
      {
        type: 'pie',
        title: 'Cost Distribution',
        data: {
          labels: costBreakdown.map(item => item.name),
          datasets: [{
            data: costBreakdown.map(item => item.cost),
            backgroundColor: ['#00BFB3', '#00A896', '#028090'],
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: {
              callbacks: {
                label: (context: any) => `${context.label}: $${context.parsed.toLocaleString()}`
              }
            }
          }
        }
      },
    ];

    return {
      value: tonnage,
      unit: 'Tons',
      details: {
        recommendedBTU,
        roomArea,
        roomVolume,
        requiredCFM,
        powerConsumption: powerConsumption.toFixed(0),
        monthlyCost: monthlyCost.toFixed(2),
        annualCost: annualCost.toFixed(2),
      },
      charts,
      recommendations: [
        `Recommended AC capacity: ${tonnage.toFixed(2)} Tons (${recommendedBTU.toLocaleString()} BTU)`,
        `Room area: ${roomArea} m² (${roomVolume} m³)`,
        `Required airflow: ${requiredCFM.toFixed(0)} CFM`,
        `Power consumption: ${powerConsumption.toFixed(0)} W`,
        `Estimated monthly cost: $${monthlyCost.toFixed(2)}`,
        `Annual cooling cost: $${annualCost.toFixed(2)}`,
        insulation === 'poor' ? 'Improving insulation can reduce cooling costs by 15-20%' : '',
      ].filter(Boolean),
      costBreakdown,
      efficiency,
    };
  };

  const calculateBorehole = (): CalculatorResult => {
    const { staticWaterLevel, drawdownLevel, flowRate, pipeLength, pipeDiameter, elevation, pumpEfficiency, pipeRoughness } = boreholeInputs;

    // Advanced hydraulic calculations
    const TDH_static = staticWaterLevel;
    const TDH_drawdown = drawdownLevel - staticWaterLevel;
    const TDH_elevation = elevation;

    // Friction loss calculation (Hazen-Williams)
    const velocity = (flowRate * 1000) / (Math.PI * Math.pow(pipeDiameter * 25.4 / 2, 2)); // m/s
    const C = 120; // Hazen-Williams coefficient
    const frictionLoss = (10.67 * Math.pow(flowRate, 1.852) * pipeLength) / (Math.pow(C, 1.852) * Math.pow(pipeDiameter, 4.87));

    const totalTDH = TDH_static + TDH_drawdown + TDH_elevation + frictionLoss;

    // Pump power calculation
    const hydraulicPower = (flowRate * totalTDH * 9.81) / 3600; // kW
    const motorPower = hydraulicPower / pumpEfficiency;
    const recommendedMotorHP = Math.ceil(motorPower / 0.746 * 1.25); // 25% safety factor

    // Operating costs
    const dailyRuntime = 8;
    const dailyEnergy = motorPower * dailyRuntime;
    const monthlyEnergyCost = dailyEnergy * 30 * 0.15;
    const annualEnergyCost = monthlyEnergyCost * 12;

    // Equipment costs
    const pumpCost = recommendedMotorHP * 350;
    const motorCost = recommendedMotorHP * 250;
    const pipeCost = pipeLength * pipeDiameter * 15;
    const installationCost = (pumpCost + motorCost + pipeCost) * 0.3;
    const totalCost = pumpCost + motorCost + pipeCost + installationCost;

    const costBreakdown: CostItem[] = [
      { name: 'Pump', cost: pumpCost, percentage: (pumpCost / totalCost) * 100 },
      { name: 'Motor', cost: motorCost, percentage: (motorCost / totalCost) * 100 },
      { name: 'Piping', cost: pipeCost, percentage: (pipeCost / totalCost) * 100 },
      { name: 'Installation', cost: installationCost, percentage: (installationCost / totalCost) * 100 },
    ];

    const charts: ChartData[] = [
      {
        type: 'bar',
        title: 'Total Dynamic Head (TDH) Breakdown',
        data: {
          labels: ['Static Head', 'Drawdown', 'Elevation', 'Friction Loss'],
          datasets: [{
            label: 'Meters',
            data: [TDH_static, TDH_drawdown, TDH_elevation, frictionLoss],
            backgroundColor: ['#1982C4', '#2A9D8F', '#4ECDC4', '#95E1D3'],
            borderRadius: 8,
          }],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, ticks: { callback: (value: any) => `${value} m` } } }
        }
      },
      {
        type: 'gauge',
        title: 'Pump Efficiency',
        data: {
          labels: ['Efficiency', 'Loss'],
          datasets: [{
            data: [pumpEfficiency * 100, (1 - pumpEfficiency) * 100],
            backgroundColor: ['#4CAF50', '#E8E8E8'],
            borderWidth: 0,
          }],
        },
        options: {
          responsive: true,
          cutout: '75%',
          plugins: { legend: { display: false } }
        }
      },
      {
        type: 'line',
        title: 'Annual Energy Cost Projection',
        data: {
          labels: Array.from({ length: 12 }, (_, i) => `Month ${i + 1}`),
          datasets: [{
            label: 'Energy Cost',
            data: Array(12).fill(monthlyEnergyCost),
            borderColor: '#1982C4',
            backgroundColor: 'rgba(25, 130, 196, 0.1)',
            fill: true,
            tension: 0.4,
          }],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, ticks: { callback: (value: any) => `$${value.toFixed(0)}` } } }
        }
      },
      {
        type: 'pie',
        title: 'Equipment Cost Distribution',
        data: {
          labels: costBreakdown.map(item => item.name),
          datasets: [{
            data: costBreakdown.map(item => item.cost),
            backgroundColor: ['#1982C4', '#2A9D8F', '#4ECDC4', '#95E1D3'],
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: {
              callbacks: {
                label: (context: any) => `${context.label}: $${context.parsed.toLocaleString()}`
              }
            }
          }
        }
      },
    ];

    return {
      value: recommendedMotorHP,
      unit: 'HP',
      details: {
        totalTDH: totalTDH.toFixed(2),
        hydraulicPower: hydraulicPower.toFixed(2),
        motorPower: motorPower.toFixed(2),
        frictionLoss: frictionLoss.toFixed(2),
        velocity: velocity.toFixed(2),
        dailyEnergy: dailyEnergy.toFixed(2),
        monthlyEnergyCost: monthlyEnergyCost.toFixed(2),
        annualEnergyCost: annualEnergyCost.toFixed(2),
      },
      charts,
      recommendations: [
        `Recommended motor: ${recommendedMotorHP} HP`,
        `Total Dynamic Head: ${totalTDH.toFixed(2)} meters`,
        `Hydraulic power required: ${hydraulicPower.toFixed(2)} kW`,
        `Motor power required: ${motorPower.toFixed(2)} kW`,
        `Water velocity in pipe: ${velocity.toFixed(2)} m/s`,
        `Monthly energy cost: $${monthlyEnergyCost.toFixed(2)}`,
        velocity > 2 ? 'Consider larger pipe diameter to reduce friction losses' : '',
      ].filter(Boolean),
      costBreakdown,
      efficiency: pumpEfficiency * 100,
    };
  };

  const calculateFabrication = (): CalculatorResult => {
    const { materialType, thickness, length, width, quantity, weldingType, paintLayers, laborHourlyRate } = fabricationInputs;

    // Material weight calculation
    const density = materialType === 'steel' ? 7850 : materialType === 'aluminum' ? 2700 : 8900; // kg/m³
    const volume = (length * width * thickness / 1000) / 1000000; // m³
    const unitWeight = volume * density;
    const totalWeight = unitWeight * quantity;

    // Welding calculations
    const weldLength = (length + width) * 2 * quantity;
    const weldingSpeed = weldingType === 'arc' ? 20 : weldingType === 'mig' ? 40 : 15; // cm/min
    const weldingTime = (weldLength * 100) / weldingSpeed; // minutes
    const weldingHours = weldingTime / 60;

    // Cutting time
    const cuttingSpeed = 50; // cm/min
    const cuttingLength = (length + width) * 2 * quantity;
    const cuttingHours = ((cuttingLength * 100) / cuttingSpeed) / 60;

    // Grinding time
    const grindingHours = weldingHours * 0.3;

    // Painting time
    const surfaceArea = (length * width * 2 + (length + width) * 2 * thickness / 1000) * quantity;
    const paintingHours = surfaceArea * paintLayers * 0.1;

    // Total labor
    const totalLaborHours = weldingHours + cuttingHours + grindingHours + paintingHours;
    const laborCost = totalLaborHours * laborHourlyRate;

    // Material costs
    const materialPricePerKg = materialType === 'steel' ? 1.2 : materialType === 'aluminum' ? 3.5 : 8.0;
    const materialCost = totalWeight * materialPricePerKg;

    // Consumables
    const electrodesCost = weldLength * 0.5;
    const paintCost = surfaceArea * paintLayers * 2;
    const consumablesCost = electrodesCost + paintCost + (totalWeight * 0.1);

    // Overhead
    const overheadCost = (laborCost + materialCost + consumablesCost) * 0.15;

    const totalCost = materialCost + laborCost + consumablesCost + overheadCost;
    const unitCost = totalCost / quantity;

    const costBreakdown: CostItem[] = [
      { name: 'Material', cost: materialCost, percentage: (materialCost / totalCost) * 100 },
      { name: 'Labor', cost: laborCost, percentage: (laborCost / totalCost) * 100 },
      { name: 'Consumables', cost: consumablesCost, percentage: (consumablesCost / totalCost) * 100 },
      { name: 'Overhead', cost: overheadCost, percentage: (overheadCost / totalCost) * 100 },
    ];

    const charts: ChartData[] = [
      {
        type: 'bar',
        title: 'Labor Time Breakdown',
        data: {
          labels: ['Welding', 'Cutting', 'Grinding', 'Painting'],
          datasets: [{
            label: 'Hours',
            data: [weldingHours, cuttingHours, grindingHours, paintingHours],
            backgroundColor: ['#8B4513', '#A0522D', '#CD853F', '#DEB887'],
            borderRadius: 8,
          }],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, ticks: { callback: (value: any) => `${value.toFixed(1)} hrs` } } }
        }
      },
      {
        type: 'pie',
        title: 'Cost Distribution',
        data: {
          labels: costBreakdown.map(item => item.name),
          datasets: [{
            data: costBreakdown.map(item => item.cost),
            backgroundColor: ['#8B4513', '#A0522D', '#CD853F', '#DEB887'],
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: {
              callbacks: {
                label: (context: any) => `${context.label}: $${context.parsed.toLocaleString()}`
              }
            }
          }
        }
      },
      {
        type: 'bar',
        title: 'Cost per Unit vs Quantity',
        data: {
          labels: Array.from({ length: 5 }, (_, i) => `${(i + 1) * quantity}`),
          datasets: [{
            label: 'Unit Cost',
            data: Array.from({ length: 5 }, (_, i) => unitCost / (1 + i * 0.1)),
            backgroundColor: '#8B4513',
            borderRadius: 8,
          }],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, ticks: { callback: (value: any) => `$${value.toFixed(0)}` } } }
        }
      },
      {
        type: 'doughnut',
        title: 'Material Weight',
        data: {
          labels: ['Material Weight', 'Reference'],
          datasets: [{
            data: [totalWeight, totalWeight * 0.5],
            backgroundColor: ['#8B4513', '#E8E8E8'],
            borderWidth: 0,
          }],
        },
        options: {
          responsive: true,
          cutout: '70%',
          plugins: { legend: { display: false } }
        }
      },
    ];

    return {
      value: totalCost,
      unit: 'USD',
      details: {
        totalWeight: totalWeight.toFixed(2),
        unitWeight: unitWeight.toFixed(2),
        totalLaborHours: totalLaborHours.toFixed(2),
        weldingHours: weldingHours.toFixed(2),
        unitCost: unitCost.toFixed(2),
        surfaceArea: surfaceArea.toFixed(2),
      },
      charts,
      recommendations: [
        `Total fabrication cost: $${totalCost.toFixed(2)}`,
        `Cost per unit: $${unitCost.toFixed(2)}`,
        `Total material weight: ${totalWeight.toFixed(2)} kg`,
        `Total labor time: ${totalLaborHours.toFixed(1)} hours`,
        `Welding time: ${weldingHours.toFixed(1)} hours`,
        `Larger quantities reduce unit cost by up to ${((1 - (unitCost / (totalCost / quantity * 2))) * 100).toFixed(0)}%`,
      ],
      costBreakdown,
      efficiency: 85,
    };
  };

  const calculateIncinerator = (): CalculatorResult => {
    const { wasteType, dailyCapacity, burnRate, temperature, chambersNumber, heatRecovery, scrubberType, ashRemoval } = incineratorInputs;

    // Combustion calculations
    const burningHours = dailyCapacity / burnRate;
    const chamberVolume = (dailyCapacity / burnRate) * 2; // m³
    const primaryChamberTemp = temperature;
    const secondaryChamberTemp = temperature + 100;

    // Air requirements
    const airRequirement = burnRate * 8; // m³/hr (excess air factor)
    const flueGasVelocity = 3; // m/s
    const flueGasDiameter = Math.sqrt((airRequirement / 3600) / (Math.PI * flueGasVelocity / 4)) * 1000; // mm

    // Energy calculations
    const heatGenerated = burnRate * 4.5; // kW (calorific value)
    const heatRecovered = heatRecovery ? heatGenerated * 0.6 : 0;
    const fuelConsumption = burnRate * 0.15; // kg/hr auxiliary fuel
    const dailyFuelCost = fuelConsumption * burningHours * 1.2;

    // Emissions
    const ashProduction = dailyCapacity * 0.15; // 15% ash
    const emissionRate = burnRate * 0.02; // kg/hr particulates

    // Equipment costs
    const primaryChamberCost = chamberVolume * 5000 * chambersNumber;
    const secondaryChamberCost = chamberVolume * 0.7 * 5000;
    const scrubberCost = scrubberType === 'wet' ? 50000 : 35000;
    const heatRecoveryCost = heatRecovery ? 40000 : 0;
    const ashSystemCost = ashRemoval === 'automatic' ? 25000 : 10000;
    const installationCost = (primaryChamberCost + secondaryChamberCost + scrubberCost) * 0.25;
    const totalCost = primaryChamberCost + secondaryChamberCost + scrubberCost + heatRecoveryCost + ashSystemCost + installationCost;

    // Operating costs
    const annualFuelCost = dailyFuelCost * 365;
    const maintenanceCost = totalCost * 0.08;
    const annualOperatingCost = annualFuelCost + maintenanceCost;

    const costBreakdown: CostItem[] = [
      { name: 'Primary Chamber', cost: primaryChamberCost, percentage: (primaryChamberCost / totalCost) * 100 },
      { name: 'Secondary Chamber', cost: secondaryChamberCost, percentage: (secondaryChamberCost / totalCost) * 100 },
      { name: 'Scrubber System', cost: scrubberCost, percentage: (scrubberCost / totalCost) * 100 },
      { name: 'Heat Recovery', cost: heatRecoveryCost, percentage: (heatRecoveryCost / totalCost) * 100 },
      { name: 'Ash Removal', cost: ashSystemCost, percentage: (ashSystemCost / totalCost) * 100 },
      { name: 'Installation', cost: installationCost, percentage: (installationCost / totalCost) * 100 },
    ].filter(item => item.cost > 0);

    const charts: ChartData[] = [
      {
        type: 'bar',
        title: 'Temperature Profile',
        data: {
          labels: ['Primary Chamber', 'Secondary Chamber', 'Flue Gas Out'],
          datasets: [{
            label: 'Temperature (°C)',
            data: [primaryChamberTemp, secondaryChamberTemp, 250],
            backgroundColor: ['#FF4500', '#FF6347', '#FFA500'],
            borderRadius: 8,
          }],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, ticks: { callback: (value: any) => `${value}°C` } } }
        }
      },
      {
        type: 'pie',
        title: 'Capital Cost Distribution',
        data: {
          labels: costBreakdown.map(item => item.name),
          datasets: [{
            data: costBreakdown.map(item => item.cost),
            backgroundColor: ['#FF4500', '#FF6347', '#FFA500', '#FFD700', '#FF8C00', '#FF7F50'],
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: {
              callbacks: {
                label: (context: any) => `${context.label}: $${context.parsed.toLocaleString()}`
              }
            }
          }
        }
      },
      {
        type: 'line',
        title: 'Heat Recovery Benefit (Annual)',
        data: {
          labels: Array.from({ length: 12 }, (_, i) => `Month ${i + 1}`),
          datasets: [{
            label: 'Energy Recovered',
            data: Array(12).fill(heatRecovered * burningHours * 30 * 0.15), // Value in dollars
            borderColor: '#FF4500',
            backgroundColor: 'rgba(255, 69, 0, 0.1)',
            fill: true,
            tension: 0.4,
          }],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, ticks: { callback: (value: any) => `$${value.toFixed(0)}` } } }
        }
      },
      {
        type: 'gauge',
        title: 'Combustion Efficiency',
        data: {
          labels: ['Efficiency', 'Loss'],
          datasets: [{
            data: [95, 5],
            backgroundColor: ['#4CAF50', '#E8E8E8'],
            borderWidth: 0,
          }],
        },
        options: {
          responsive: true,
          cutout: '75%',
          plugins: { legend: { display: false } }
        }
      },
    ];

    return {
      value: dailyCapacity,
      unit: 'kg/day',
      details: {
        burningHours: burningHours.toFixed(2),
        chamberVolume: chamberVolume.toFixed(2),
        airRequirement: airRequirement.toFixed(2),
        flueGasDiameter: flueGasDiameter.toFixed(0),
        heatGenerated: heatGenerated.toFixed(2),
        heatRecovered: heatRecovered.toFixed(2),
        ashProduction: ashProduction.toFixed(2),
        annualOperatingCost: annualOperatingCost.toFixed(2),
      },
      charts,
      recommendations: [
        `Incinerator capacity: ${dailyCapacity} kg/day`,
        `Burning time: ${burningHours.toFixed(1)} hours/day`,
        `Chamber volume: ${chamberVolume.toFixed(1)} m³`,
        `Heat generated: ${heatGenerated.toFixed(1)} kW`,
        heatRecovery ? `Heat recovered: ${heatRecovered.toFixed(1)} kW (saves $${(heatRecovered * burningHours * 365 * 0.15).toFixed(0)}/year)` : 'Consider heat recovery to reduce operating costs',
        `Ash production: ${ashProduction.toFixed(1)} kg/day`,
        `Annual operating cost: $${annualOperatingCost.toFixed(2)}`,
      ],
      costBreakdown,
      efficiency: 95,
    };
  };

  const calculateHighVoltage = (): CalculatorResult => {
    const { voltage, current, distance, conductorType, conductorSize, powerFactor, temperature, installationType } = hvInputs;

    // Power calculations
    const apparentPower = (Math.sqrt(3) * voltage * current) / 1000; // kVA
    const activePower = apparentPower * powerFactor; // kW
    const reactivePower = apparentPower * Math.sin(Math.acos(powerFactor)); // kVAR

    // Conductor resistance (temperature corrected)
    const resistivity = conductorType === 'copper' ? 0.0172 : 0.0282; // Ω·mm²/m at 20°C
    const tempCoeff = conductorType === 'copper' ? 0.00393 : 0.00403;
    const resistanceAt20 = (resistivity * distance) / conductorSize;
    const resistance = resistanceAt20 * (1 + tempCoeff * (temperature - 20));

    // Voltage drop
    const voltageDrop = Math.sqrt(3) * current * resistance;
    const voltageDropPercent = (voltageDrop / voltage) * 100;

    // Power loss
    const powerLoss = 3 * Math.pow(current, 2) * resistance / 1000; // kW
    const annualEnergyLoss = powerLoss * 8760; // kWh/year
    const annualCostLoss = annualEnergyLoss * 0.12;

    // Short circuit current
    const sourceImpedance = 0.1; // Assume 0.1 ohm source impedance
    const totalImpedance = sourceImpedance + resistance;
    const shortCircuitCurrent = voltage / (Math.sqrt(3) * totalImpedance);

    // Thermal limits
    const currentDensity = current / conductorSize;
    const maxCurrentDensity = installationType === 'underground' ? 2 : 3; // A/mm²
    const thermalMargin = ((maxCurrentDensity - currentDensity) / maxCurrentDensity) * 100;

    // Cost calculations
    const conductorCostPerKg = conductorType === 'copper' ? 15 : 4;
    const conductorDensity = conductorType === 'copper' ? 8.96 : 2.7; // kg/dm³
    const conductorWeight = (conductorSize * distance * conductorDensity * 3) / 1000; // kg (3 phases)
    const conductorCost = conductorWeight * conductorCostPerKg;

    const poleCost = installationType === 'overhead' ? (distance / 50) * 800 : 0;
    const cableCost = installationType === 'underground' ? conductorCost * 1.5 : 0;
    const installationCost = (conductorCost + poleCost + cableCost) * 0.25;
    const totalCost = conductorCost + poleCost + cableCost + installationCost;

    const costBreakdown: CostItem[] = [
      { name: 'Conductor', cost: conductorCost, percentage: (conductorCost / totalCost) * 100 },
      installationType === 'overhead' ? { name: 'Poles', cost: poleCost, percentage: (poleCost / totalCost) * 100 } : null,
      installationType === 'underground' ? { name: 'Cable & Ducting', cost: cableCost, percentage: (cableCost / totalCost) * 100 } : null,
      { name: 'Installation', cost: installationCost, percentage: (installationCost / totalCost) * 100 },
    ].filter(Boolean) as CostItem[];

    const charts: ChartData[] = [
      {
        type: 'gauge',
        title: 'Voltage Drop',
        data: {
          labels: ['Drop', 'Nominal'],
          datasets: [{
            data: [voltageDropPercent, 100 - voltageDropPercent],
            backgroundColor: voltageDropPercent > 5 ? ['#FF4500', '#E8E8E8'] : ['#4CAF50', '#E8E8E8'],
            borderWidth: 0,
          }],
        },
        options: {
          responsive: true,
          cutout: '75%',
          plugins: { legend: { display: false } }
        }
      },
      {
        type: 'bar',
        title: 'Power Distribution',
        data: {
          labels: ['Active Power', 'Reactive Power', 'Power Loss'],
          datasets: [{
            label: 'kW / kVAR',
            data: [activePower, reactivePower, powerLoss],
            backgroundColor: ['#FFD60A', '#FFA500', '#FF4500'],
            borderRadius: 8,
          }],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } }
        }
      },
      {
        type: 'line',
        title: 'Annual Energy Loss Cost',
        data: {
          labels: Array.from({ length: 10 }, (_, i) => `Year ${i + 1}`),
          datasets: [{
            label: 'Cumulative Loss',
            data: Array.from({ length: 10 }, (_, i) => (i + 1) * annualCostLoss),
            borderColor: '#FF4500',
            backgroundColor: 'rgba(255, 69, 0, 0.1)',
            fill: true,
            tension: 0.4,
          }],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, ticks: { callback: (value: any) => `$${value.toLocaleString()}` } } }
        }
      },
      {
        type: 'pie',
        title: 'Installation Cost Breakdown',
        data: {
          labels: costBreakdown.map(item => item.name),
          datasets: [{
            data: costBreakdown.map(item => item.cost),
            backgroundColor: ['#FFD60A', '#FFA500', '#FF8C00', '#FF7F50'],
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: {
              callbacks: {
                label: (context: any) => `${context.label}: $${context.parsed.toLocaleString()}`
              }
            }
          }
        }
      },
      {
        type: 'radar',
        title: 'System Performance',
        data: {
          labels: ['Voltage Regulation', 'Thermal Margin', 'Efficiency', 'Cost-Effectiveness', 'Reliability'],
          datasets: [{
            label: 'Performance',
            data: [
              Math.max(0, 100 - voltageDropPercent * 10),
              Math.max(0, thermalMargin),
              Math.max(0, 100 - (powerLoss / activePower) * 100),
              75,
              installationType === 'underground' ? 90 : 80,
            ],
            backgroundColor: 'rgba(255, 214, 10, 0.2)',
            borderColor: '#FFD60A',
            pointBackgroundColor: '#FFD60A',
          }],
        },
        options: {
          responsive: true,
          scales: { r: { beginAtZero: true, max: 100 } }
        }
      },
    ];

    return {
      value: conductorSize,
      unit: 'mm²',
      details: {
        apparentPower: apparentPower.toFixed(2),
        activePower: activePower.toFixed(2),
        reactivePower: reactivePower.toFixed(2),
        voltageDrop: voltageDrop.toFixed(2),
        voltageDropPercent: voltageDropPercent.toFixed(2),
        powerLoss: powerLoss.toFixed(2),
        annualEnergyLoss: annualEnergyLoss.toFixed(0),
        annualCostLoss: annualCostLoss.toFixed(2),
        shortCircuitCurrent: shortCircuitCurrent.toFixed(0),
        thermalMargin: thermalMargin.toFixed(1),
      },
      charts,
      recommendations: [
        `Conductor size: ${conductorSize} mm² ${conductorType}`,
        `Voltage drop: ${voltageDrop.toFixed(2)}V (${voltageDropPercent.toFixed(2)}%)`,
        voltageDropPercent > 5 ? `WARNING: Voltage drop exceeds 5% - consider larger conductor` : 'Voltage drop within acceptable limits',
        `Power loss: ${powerLoss.toFixed(2)} kW`,
        `Annual energy loss cost: $${annualCostLoss.toFixed(2)}`,
        `Short circuit current: ${shortCircuitCurrent.toFixed(0)} A`,
        `Thermal margin: ${thermalMargin.toFixed(1)}%`,
        thermalMargin < 20 ? 'WARNING: Low thermal margin - consider larger conductor' : '',
      ].filter(Boolean),
      costBreakdown,
      efficiency: Math.max(0, 100 - (powerLoss / activePower) * 100),
    };
  };

  const exportToPDF = () => {
    alert('PDF export feature - Would integrate with jsPDF library');
  };

  const renderInputs = () => {
    switch (activeCalc) {
      case 'generator':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputSlider label="Total Load (W)" value={genInputs.totalLoad} onChange={(v) => setGenInputs({...genInputs, totalLoad: v})} min={1000} max={100000} step={1000} />
            <InputSlider label="Starting Current (×FLC)" value={genInputs.startingCurrent} onChange={(v) => setGenInputs({...genInputs, startingCurrent: v})} min={1} max={10} step={0.5} />
            <InputSlider label="Altitude (m)" value={genInputs.altitude} onChange={(v) => setGenInputs({...genInputs, altitude: v})} min={0} max={3000} step={100} />
            <InputSlider label="Temperature (°C)" value={genInputs.temperature} onChange={(v) => setGenInputs({...genInputs, temperature: v})} min={-20} max={60} step={5} />
            <InputSlider label="Diversity Factor" value={genInputs.diversityFactor} onChange={(v) => setGenInputs({...genInputs, diversityFactor: v})} min={0.5} max={1} step={0.05} />
            <InputSlider label="Power Factor" value={genInputs.powerFactor} onChange={(v) => setGenInputs({...genInputs, powerFactor: v})} min={0.6} max={1} step={0.05} />
            <InputSlider label="Runtime (hrs/day)" value={genInputs.runtime} onChange={(v) => setGenInputs({...genInputs, runtime: v})} min={1} max={24} step={1} />
          </div>
        );
      case 'solar':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputSlider label="Daily Consumption (kWh)" value={solarInputs.dailyConsumption} onChange={(v) => setSolarInputs({...solarInputs, dailyConsumption: v})} min={1} max={100} step={1} />
            <InputSlider label="Peak Sun Hours" value={solarInputs.peakSunHours} onChange={(v) => setSolarInputs({...solarInputs, peakSunHours: v})} min={3} max={7} step={0.5} />
            <InputSlider label="System Voltage (V)" value={solarInputs.systemVoltage} onChange={(v) => setSolarInputs({...solarInputs, systemVoltage: v})} min={12} max={48} step={12} />
            <InputSlider label="Battery Days" value={solarInputs.batteryDays} onChange={(v) => setSolarInputs({...solarInputs, batteryDays: v})} min={1} max={5} step={1} />
            <InputSlider label="Panel Degradation" value={solarInputs.degradation} onChange={(v) => setSolarInputs({...solarInputs, degradation: v})} min={0.7} max={1} step={0.05} />
            <InputSlider label="MPPT Efficiency" value={solarInputs.mpptEfficiency} onChange={(v) => setSolarInputs({...solarInputs, mpptEfficiency: v})} min={0.90} max={0.99} step={0.01} />
          </div>
        );
      case 'ups':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputSlider label="Load (Watts)" value={upsInputs.loadWatts} onChange={(v) => setUpsInputs({...upsInputs, loadWatts: v})} min={500} max={10000} step={100} />
            <InputSlider label="Load (VA)" value={upsInputs.loadVA} onChange={(v) => setUpsInputs({...upsInputs, loadVA: v})} min={500} max={10000} step={100} />
            <InputSlider label="Backup Time (min)" value={upsInputs.backupTime} onChange={(v) => setUpsInputs({...upsInputs, backupTime: v})} min={5} max={240} step={5} />
            <InputSlider label="Battery Voltage (V)" value={upsInputs.batteryVoltage} onChange={(v) => setUpsInputs({...upsInputs, batteryVoltage: v})} min={12} max={12} step={12} />
            <InputSlider label="Batteries in Series" value={upsInputs.batteriesInSeries} onChange={(v) => setUpsInputs({...upsInputs, batteriesInSeries: v})} min={1} max={4} step={1} />
            <InputSlider label="Efficiency" value={upsInputs.efficiency} onChange={(v) => setUpsInputs({...upsInputs, efficiency: v})} min={0.7} max={0.95} step={0.05} />
          </div>
        );
      case 'motor':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputSlider label="Motor HP" value={motorInputs.motorHP} onChange={(v) => setMotorInputs({...motorInputs, motorHP: v})} min={1} max={100} step={1} />
            <InputSlider label="Voltage (V)" value={motorInputs.voltage} onChange={(v) => setMotorInputs({...motorInputs, voltage: v})} min={220} max={690} step={10} />
            <InputSlider label="Poles" value={motorInputs.poles} onChange={(v) => setMotorInputs({...motorInputs, poles: v})} min={2} max={8} step={2} />
            <InputSlider label="Frequency (Hz)" value={motorInputs.frequency} onChange={(v) => setMotorInputs({...motorInputs, frequency: v})} min={50} max={60} step={10} />
            <InputSlider label="Efficiency" value={motorInputs.efficiency} onChange={(v) => setMotorInputs({...motorInputs, efficiency: v})} min={0.7} max={0.95} step={0.01} />
            <InputSlider label="Power Factor" value={motorInputs.powerFactor} onChange={(v) => setMotorInputs({...motorInputs, powerFactor: v})} min={0.7} max={0.95} step={0.05} />
          </div>
        );
      case 'ac':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputSlider label="Room Length (m)" value={acInputs.roomLength} onChange={(v) => setAcInputs({...acInputs, roomLength: v})} min={2} max={20} step={0.5} />
            <InputSlider label="Room Width (m)" value={acInputs.roomWidth} onChange={(v) => setAcInputs({...acInputs, roomWidth: v})} min={2} max={20} step={0.5} />
            <InputSlider label="Room Height (m)" value={acInputs.roomHeight} onChange={(v) => setAcInputs({...acInputs, roomHeight: v})} min={2.5} max={5} step={0.5} />
            <InputSlider label="Occupants" value={acInputs.occupants} onChange={(v) => setAcInputs({...acInputs, occupants: v})} min={1} max={20} step={1} />
            <InputSlider label="Windows" value={acInputs.windows} onChange={(v) => setAcInputs({...acInputs, windows: v})} min={0} max={10} step={1} />
          </div>
        );
      case 'borehole':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputSlider label="Static Water Level (m)" value={boreholeInputs.staticWaterLevel} onChange={(v) => setBoreholeInputs({...boreholeInputs, staticWaterLevel: v})} min={5} max={100} step={5} />
            <InputSlider label="Drawdown Level (m)" value={boreholeInputs.drawdownLevel} onChange={(v) => setBoreholeInputs({...boreholeInputs, drawdownLevel: v})} min={10} max={150} step={5} />
            <InputSlider label="Flow Rate (m³/hr)" value={boreholeInputs.flowRate} onChange={(v) => setBoreholeInputs({...boreholeInputs, flowRate: v})} min={1} max={20} step={1} />
            <InputSlider label="Pipe Length (m)" value={boreholeInputs.pipeLength} onChange={(v) => setBoreholeInputs({...boreholeInputs, pipeLength: v})} min={10} max={200} step={10} />
            <InputSlider label="Pipe Diameter (inch)" value={boreholeInputs.pipeDiameter} onChange={(v) => setBoreholeInputs({...boreholeInputs, pipeDiameter: v})} min={1} max={6} step={0.5} />
            <InputSlider label="Elevation (m)" value={boreholeInputs.elevation} onChange={(v) => setBoreholeInputs({...boreholeInputs, elevation: v})} min={0} max={50} step={5} />
          </div>
        );
      case 'fabrication':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputSlider label="Thickness (mm)" value={fabricationInputs.thickness} onChange={(v) => setFabricationInputs({...fabricationInputs, thickness: v})} min={1} max={25} step={1} />
            <InputSlider label="Length (m)" value={fabricationInputs.length} onChange={(v) => setFabricationInputs({...fabricationInputs, length: v})} min={1} max={20} step={0.5} />
            <InputSlider label="Width (m)" value={fabricationInputs.width} onChange={(v) => setFabricationInputs({...fabricationInputs, width: v})} min={0.5} max={5} step={0.5} />
            <InputSlider label="Quantity" value={fabricationInputs.quantity} onChange={(v) => setFabricationInputs({...fabricationInputs, quantity: v})} min={1} max={100} step={1} />
            <InputSlider label="Paint Layers" value={fabricationInputs.paintLayers} onChange={(v) => setFabricationInputs({...fabricationInputs, paintLayers: v})} min={1} max={5} step={1} />
            <InputSlider label="Labor Rate ($/hr)" value={fabricationInputs.laborHourlyRate} onChange={(v) => setFabricationInputs({...fabricationInputs, laborHourlyRate: v})} min={20} max={100} step={5} />
          </div>
        );
      case 'incinerator':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputSlider label="Daily Capacity (kg)" value={incineratorInputs.dailyCapacity} onChange={(v) => setIncineratorInputs({...incineratorInputs, dailyCapacity: v})} min={100} max={5000} step={100} />
            <InputSlider label="Burn Rate (kg/hr)" value={incineratorInputs.burnRate} onChange={(v) => setIncineratorInputs({...incineratorInputs, burnRate: v})} min={20} max={500} step={10} />
            <InputSlider label="Temperature (°C)" value={incineratorInputs.temperature} onChange={(v) => setIncineratorInputs({...incineratorInputs, temperature: v})} min={600} max={1200} step={50} />
            <InputSlider label="Chambers" value={incineratorInputs.chambersNumber} onChange={(v) => setIncineratorInputs({...incineratorInputs, chambersNumber: v})} min={1} max={3} step={1} />
          </div>
        );
      case 'highvoltage':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputSlider label="Voltage (V)" value={hvInputs.voltage} onChange={(v) => setHvInputs({...hvInputs, voltage: v})} min={3300} max={33000} step={100} />
            <InputSlider label="Current (A)" value={hvInputs.current} onChange={(v) => setHvInputs({...hvInputs, current: v})} min={10} max={1000} step={10} />
            <InputSlider label="Distance (m)" value={hvInputs.distance} onChange={(v) => setHvInputs({...hvInputs, distance: v})} min={100} max={10000} step={100} />
            <InputSlider label="Conductor Size (mm²)" value={hvInputs.conductorSize} onChange={(v) => setHvInputs({...hvInputs, conductorSize: v})} min={16} max={400} step={5} />
            <InputSlider label="Power Factor" value={hvInputs.powerFactor} onChange={(v) => setHvInputs({...hvInputs, powerFactor: v})} min={0.7} max={0.95} step={0.05} />
            <InputSlider label="Temperature (°C)" value={hvInputs.temperature} onChange={(v) => setHvInputs({...hvInputs, temperature: v})} min={0} max={60} step={5} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 flex items-center justify-center gap-4">
            <Calculator className="w-12 h-12" />
            ULTIMATE 9-IN-1 CALCULATOR
          </h1>
          <p className="text-xl text-gray-300">Advanced Engineering Calculations with Real-Time Analytics</p>
        </motion.div>

        {/* Calculator Selection */}
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3 mb-8">
          {CALCULATORS.map((calc) => (
            <motion.button
              key={calc.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setActiveCalc(calc.id as CalculatorType);
                setResult(null);
              }}
              className={`p-4 rounded-xl backdrop-blur-lg transition-all ${
                activeCalc === calc.id
                  ? 'bg-white/20 ring-2 ring-white shadow-2xl'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
              style={{
                backgroundColor: activeCalc === calc.id ? `${calc.color}40` : undefined,
              }}
            >
              <calc.icon className="w-8 h-8 mx-auto mb-2" style={{ color: calc.color }} />
              <p className="text-xs text-white font-medium text-center">{calc.name}</p>
            </motion.button>
          ))}
        </div>

        {/* Input Section */}
        <motion.div
          key={activeCalc}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            {CALCULATORS.find(c => c.id === activeCalc)?.icon &&
              React.createElement(CALCULATORS.find(c => c.id === activeCalc)!.icon, { className: "w-6 h-6" })}
            {CALCULATORS.find(c => c.id === activeCalc)?.name} Parameters
          </h2>

          {renderInputs()}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={calculateResult}
            disabled={calculating}
            className="mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50"
          >
            {calculating ? (
              <>
                <Activity className="w-6 h-6 animate-spin" />
                Calculating... {progress}%
              </>
            ) : (
              <>
                <Gauge className="w-6 h-6" />
                Calculate
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Progress Bar */}
        <AnimatePresence>
          {calculating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-8"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-full h-4 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <AnimatePresence>
          {result && !calculating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Main Result Card */}
              <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-3xl font-bold text-white flex items-center gap-2">
                    <Award className="w-8 h-8" />
                    Result
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={exportToPDF}
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 text-white"
                  >
                    <Download className="w-5 h-5" />
                    Export PDF
                  </motion.button>
                </div>
                <div className="text-6xl font-bold text-white mb-2">
                  {result.value.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="text-3xl text-gray-300">{result.unit}</span>
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <Gauge className="w-5 h-5" />
                  <span>Efficiency: {result.efficiency.toFixed(1)}%</span>
                </div>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {result.charts.map((chart, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10"
                  >
                    <h4 className="text-lg font-bold text-white mb-4">{chart.title}</h4>
                    <div className="h-64">
                      {chart.type === 'line' && <Line data={chart.data} options={chart.options} />}
                      {chart.type === 'bar' && <Bar data={chart.data} options={chart.options} />}
                      {(chart.type === 'doughnut' || chart.type === 'gauge') && <Doughnut data={chart.data} options={chart.options} />}
                      {chart.type === 'radar' && <Radar data={chart.data} options={chart.options} />}
                      {chart.type === 'pie' && <Pie data={chart.data} options={chart.options} />}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Recommendations */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Info className="w-6 h-6" />
                  Recommendations & Details
                </h4>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="text-gray-200 flex items-start gap-2"
                    >
                      <span className="text-green-400 mt-1">✓</span>
                      <span>{rec}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Cost Breakdown Table */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <DollarSign className="w-6 h-6" />
                  Cost Breakdown
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left text-gray-300 py-2">Item</th>
                        <th className="text-right text-gray-300 py-2">Cost</th>
                        <th className="text-right text-gray-300 py-2">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.costBreakdown.map((item, index) => (
                        <tr key={index} className="border-b border-white/10">
                          <td className="text-white py-2">{item.name}</td>
                          <td className="text-right text-green-400 py-2">${item.cost.toLocaleString()}</td>
                          <td className="text-right text-gray-300 py-2">{item.percentage.toFixed(1)}%</td>
                        </tr>
                      ))}
                      <tr className="font-bold">
                        <td className="text-white py-2">TOTAL</td>
                        <td className="text-right text-green-400 py-2">
                          ${result.costBreakdown.reduce((sum, item) => sum + item.cost, 0).toLocaleString()}
                        </td>
                        <td className="text-right text-gray-300 py-2">100%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Input Slider Component
interface InputSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
}

function InputSlider({ label, value, onChange, min, max, step }: InputSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm text-gray-300">{label}</label>
        <span className="text-white font-bold">{value.toLocaleString()}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
      />
    </div>
  );
}
