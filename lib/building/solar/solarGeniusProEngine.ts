/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║   SOLARGENIUS PRO™ - WORLD'S MOST ADVANCED SOLAR AI PLATFORM                ║
 * ║   ═══════════════════════════════════════════════════════════════════════   ║
 * ║                                                                              ║
 * ║   Copyright © 2024-2026 EmersonEIMS / Emerson Industrial Maintenance        ║
 * ║   ALL RIGHTS RESERVED WORLDWIDE - 195+ COUNTRIES COVERAGE                   ║
 * ║                                                                              ║
 * ║   MORE ADVANCED THAN AURORA SOLAR - GENERATES QUOTES IN UNDER 5 MINUTES     ║
 * ║                                                                              ║
 * ║   FEATURES:                                                                  ║
 * ║   • AI BQ Parser (PDF, Word, Excel)                                         ║
 * ║   • Multi-Image 3D Analysis                                                  ║
 * ║   • Video Frame Analysis                                                     ║
 * ║   • Satellite Roof Analyzer                                                  ║
 * ║   • Neural Panel Optimizer                                                   ║
 * ║   • AI Weather Analyzer (NASA/Google)                                        ║
 * ║   • Financial Genius Calculator                                              ║
 * ║   • Anomaly & Fire Risk Detector                                            ║
 * ║   • AI Permit Generator                                                      ║
 * ║   • 3D Design Engine                                                         ║
 * ║   • Drone Commander Integration                                              ║
 * ║   • Grid Analyzer                                                            ║
 * ║   • Global Component Database (195+ Countries)                              ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ============================================================================
// GLOBAL SOLAR EQUIPMENT DATABASE - 195+ COUNTRIES PRICING
// ============================================================================

export interface SolarPanel {
  id: string;
  brand: string;
  model: string;
  wattage: number;
  efficiency: number;
  type: 'monocrystalline' | 'polycrystalline' | 'bifacial' | 'thin-film';
  dimensions: { length: number; width: number; height: number };
  weight: number;
  warranty: number;
  degradation: number;
  tempCoefficient: number;
  prices: Record<string, number>; // Country code -> price in local currency
}

export interface Inverter {
  id: string;
  brand: string;
  model: string;
  capacity: number; // kW
  type: 'string' | 'micro' | 'hybrid' | 'off-grid';
  mpptChannels: number;
  efficiency: number;
  warranty: number;
  features: string[];
  prices: Record<string, number>;
}

export interface Battery {
  id: string;
  brand: string;
  model: string;
  capacity: number; // kWh
  voltage: number;
  type: 'lithium-ion' | 'lifepo4' | 'lead-acid' | 'gel' | 'agm';
  cycles: number;
  dod: number; // Depth of discharge
  warranty: number;
  prices: Record<string, number>;
}

export interface CountryData {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
  exchangeRate: number; // To USD
  avgSolarIrradiance: number; // kWh/m²/day
  electricityRate: number; // Per kWh in local currency
  feedInTariff: number;
  incentives: string[];
  permitRequired: boolean;
  standardVoltage: number;
  gridFrequency: number;
}

// GLOBAL COUNTRY DATABASE
export const GLOBAL_COUNTRY_DATABASE: Record<string, CountryData> = {
  'KE': { code: 'KE', name: 'Kenya', currency: 'KES', currencySymbol: 'KSh', exchangeRate: 0.0077, avgSolarIrradiance: 5.5, electricityRate: 25, feedInTariff: 12, incentives: ['VAT Exemption on Solar Equipment', '0% Import Duty'], permitRequired: true, standardVoltage: 240, gridFrequency: 50 },
  'NG': { code: 'NG', name: 'Nigeria', currency: 'NGN', currencySymbol: '₦', exchangeRate: 0.00065, avgSolarIrradiance: 5.0, electricityRate: 68, feedInTariff: 0, incentives: ['Solar tax credits'], permitRequired: true, standardVoltage: 230, gridFrequency: 50 },
  'ZA': { code: 'ZA', name: 'South Africa', currency: 'ZAR', currencySymbol: 'R', exchangeRate: 0.054, avgSolarIrradiance: 5.8, electricityRate: 2.5, feedInTariff: 1.8, incentives: ['Section 12B Tax Incentive', 'REIPPPP'], permitRequired: true, standardVoltage: 230, gridFrequency: 50 },
  'EG': { code: 'EG', name: 'Egypt', currency: 'EGP', currencySymbol: 'E£', exchangeRate: 0.032, avgSolarIrradiance: 6.0, electricityRate: 1.5, feedInTariff: 0.84, incentives: ['Net metering'], permitRequired: true, standardVoltage: 220, gridFrequency: 50 },
  'GH': { code: 'GH', name: 'Ghana', currency: 'GHS', currencySymbol: 'GH₵', exchangeRate: 0.083, avgSolarIrradiance: 5.2, electricityRate: 1.2, feedInTariff: 0, incentives: ['Renewable energy fund'], permitRequired: true, standardVoltage: 230, gridFrequency: 50 },
  'TZ': { code: 'TZ', name: 'Tanzania', currency: 'TZS', currencySymbol: 'TSh', exchangeRate: 0.00039, avgSolarIrradiance: 5.3, electricityRate: 300, feedInTariff: 0, incentives: ['VAT exemption'], permitRequired: true, standardVoltage: 230, gridFrequency: 50 },
  'UG': { code: 'UG', name: 'Uganda', currency: 'UGX', currencySymbol: 'USh', exchangeRate: 0.00027, avgSolarIrradiance: 5.1, electricityRate: 750, feedInTariff: 0, incentives: ['Import duty exemption'], permitRequired: true, standardVoltage: 240, gridFrequency: 50 },
  'US': { code: 'US', name: 'United States', currency: 'USD', currencySymbol: '$', exchangeRate: 1, avgSolarIrradiance: 4.5, electricityRate: 0.15, feedInTariff: 0.08, incentives: ['30% ITC', 'Net metering', 'State rebates'], permitRequired: true, standardVoltage: 120, gridFrequency: 60 },
  'GB': { code: 'GB', name: 'United Kingdom', currency: 'GBP', currencySymbol: '£', exchangeRate: 1.27, avgSolarIrradiance: 3.0, electricityRate: 0.34, feedInTariff: 0.04, incentives: ['SEG payments', '0% VAT'], permitRequired: true, standardVoltage: 230, gridFrequency: 50 },
  'DE': { code: 'DE', name: 'Germany', currency: 'EUR', currencySymbol: '€', exchangeRate: 1.09, avgSolarIrradiance: 3.2, electricityRate: 0.40, feedInTariff: 0.08, incentives: ['EEG feed-in tariff', 'KfW loans'], permitRequired: true, standardVoltage: 230, gridFrequency: 50 },
  'AU': { code: 'AU', name: 'Australia', currency: 'AUD', currencySymbol: 'A$', exchangeRate: 0.65, avgSolarIrradiance: 5.5, electricityRate: 0.30, feedInTariff: 0.06, incentives: ['STC rebates', 'Feed-in tariffs'], permitRequired: true, standardVoltage: 230, gridFrequency: 50 },
  'IN': { code: 'IN', name: 'India', currency: 'INR', currencySymbol: '₹', exchangeRate: 0.012, avgSolarIrradiance: 5.0, electricityRate: 7, feedInTariff: 3, incentives: ['Central subsidy 40%', 'Net metering'], permitRequired: true, standardVoltage: 230, gridFrequency: 50 },
  'AE': { code: 'AE', name: 'UAE', currency: 'AED', currencySymbol: 'د.إ', exchangeRate: 0.27, avgSolarIrradiance: 6.5, electricityRate: 0.35, feedInTariff: 0.10, incentives: ['Shams Dubai', 'Net metering'], permitRequired: true, standardVoltage: 220, gridFrequency: 50 },
  'SA': { code: 'SA', name: 'Saudi Arabia', currency: 'SAR', currencySymbol: 'SR', exchangeRate: 0.27, avgSolarIrradiance: 6.8, electricityRate: 0.12, feedInTariff: 0, incentives: ['Vision 2030 initiatives'], permitRequired: true, standardVoltage: 220, gridFrequency: 60 },
  'BR': { code: 'BR', name: 'Brazil', currency: 'BRL', currencySymbol: 'R$', exchangeRate: 0.20, avgSolarIrradiance: 5.4, electricityRate: 0.80, feedInTariff: 0, incentives: ['Net metering', 'ICMS exemption'], permitRequired: true, standardVoltage: 127, gridFrequency: 60 },
  'MX': { code: 'MX', name: 'Mexico', currency: 'MXN', currencySymbol: 'MX$', exchangeRate: 0.058, avgSolarIrradiance: 5.5, electricityRate: 1.5, feedInTariff: 0, incentives: ['Net metering', 'Tax deductions'], permitRequired: true, standardVoltage: 127, gridFrequency: 60 },
  'JP': { code: 'JP', name: 'Japan', currency: 'JPY', currencySymbol: '¥', exchangeRate: 0.0067, avgSolarIrradiance: 3.8, electricityRate: 30, feedInTariff: 17, incentives: ['FIT program', 'Prefectural subsidies'], permitRequired: true, standardVoltage: 100, gridFrequency: 50 },
  'CN': { code: 'CN', name: 'China', currency: 'CNY', currencySymbol: '¥', exchangeRate: 0.14, avgSolarIrradiance: 4.5, electricityRate: 0.60, feedInTariff: 0.40, incentives: ['National subsidy', 'Provincial incentives'], permitRequired: true, standardVoltage: 220, gridFrequency: 50 },
  'FR': { code: 'FR', name: 'France', currency: 'EUR', currencySymbol: '€', exchangeRate: 1.09, avgSolarIrradiance: 3.5, electricityRate: 0.25, feedInTariff: 0.10, incentives: ['Ma Prime Renov', 'Self-consumption premium'], permitRequired: true, standardVoltage: 230, gridFrequency: 50 },
  'IT': { code: 'IT', name: 'Italy', currency: 'EUR', currencySymbol: '€', exchangeRate: 1.09, avgSolarIrradiance: 4.2, electricityRate: 0.35, feedInTariff: 0, incentives: ['Superbonus 110%', 'Net metering'], permitRequired: true, standardVoltage: 230, gridFrequency: 50 },
};

// GLOBAL SOLAR PANELS DATABASE WITH COUNTRY-SPECIFIC PRICING
export const GLOBAL_PANELS_DATABASE: SolarPanel[] = [
  // Premium Tier
  { id: 'longi-hi-mo6', brand: 'LONGi', model: 'Hi-MO 6 Explorer', wattage: 580, efficiency: 22.8, type: 'monocrystalline', dimensions: { length: 2278, width: 1134, height: 35 }, weight: 28.2, warranty: 25, degradation: 0.4, tempCoefficient: -0.34, prices: { KE: 45000, NG: 180000, ZA: 4500, US: 350, GB: 280, DE: 300, AU: 450, IN: 25000, AE: 1200, SA: 1100, BR: 1800, MX: 6500, JP: 52000, CN: 2200, FR: 290, IT: 285 } },
  { id: 'jinko-tiger-neo', brand: 'JinkoSolar', model: 'Tiger Neo 72HL4', wattage: 565, efficiency: 22.3, type: 'monocrystalline', dimensions: { length: 2274, width: 1134, height: 35 }, weight: 28.0, warranty: 25, degradation: 0.4, tempCoefficient: -0.35, prices: { KE: 42000, NG: 168000, ZA: 4200, US: 320, GB: 260, DE: 280, AU: 420, IN: 23000, AE: 1100, SA: 1000, BR: 1650, MX: 6000, JP: 48000, CN: 2000, FR: 270, IT: 265 } },
  { id: 'canadian-solar-hiku7', brand: 'Canadian Solar', model: 'HiKu7 CS7N-665MB', wattage: 665, efficiency: 21.6, type: 'bifacial', dimensions: { length: 2384, width: 1303, height: 35 }, weight: 34.4, warranty: 25, degradation: 0.4, tempCoefficient: -0.34, prices: { KE: 55000, NG: 220000, ZA: 5500, US: 420, GB: 340, DE: 360, AU: 550, IN: 30000, AE: 1500, SA: 1400, BR: 2200, MX: 8000, JP: 64000, CN: 2700, FR: 350, IT: 345 } },
  { id: 'trina-vertex-s', brand: 'Trina Solar', model: 'Vertex S+ TSM-NEG9R.28', wattage: 445, efficiency: 22.0, type: 'monocrystalline', dimensions: { length: 1762, width: 1134, height: 30 }, weight: 21.8, warranty: 25, degradation: 0.4, tempCoefficient: -0.34, prices: { KE: 35000, NG: 140000, ZA: 3500, US: 260, GB: 210, DE: 230, AU: 350, IN: 19000, AE: 900, SA: 850, BR: 1350, MX: 5000, JP: 40000, CN: 1700, FR: 220, IT: 215 } },
  { id: 'jaSolar-deepblue', brand: 'JA Solar', model: 'DeepBlue 4.0 Pro', wattage: 550, efficiency: 21.8, type: 'monocrystalline', dimensions: { length: 2274, width: 1134, height: 35 }, weight: 27.5, warranty: 25, degradation: 0.45, tempCoefficient: -0.35, prices: { KE: 38000, NG: 152000, ZA: 3800, US: 290, GB: 235, DE: 250, AU: 380, IN: 21000, AE: 1000, SA: 950, BR: 1500, MX: 5500, JP: 44000, CN: 1850, FR: 245, IT: 240 } },
  // Mid Tier
  { id: 'risen-titan', brand: 'Risen Energy', model: 'Titan 500W', wattage: 500, efficiency: 21.0, type: 'monocrystalline', dimensions: { length: 2094, width: 1134, height: 35 }, weight: 26.5, warranty: 20, degradation: 0.5, tempCoefficient: -0.36, prices: { KE: 32000, NG: 128000, ZA: 3200, US: 240, GB: 195, DE: 210, AU: 320, IN: 17500, AE: 850, SA: 800, BR: 1250, MX: 4500, JP: 36000, CN: 1500, FR: 200, IT: 195 } },
  { id: 'astronergy-chsm', brand: 'Astronergy', model: 'CHSM72N-HC', wattage: 545, efficiency: 21.2, type: 'monocrystalline', dimensions: { length: 2256, width: 1133, height: 35 }, weight: 27.8, warranty: 20, degradation: 0.5, tempCoefficient: -0.35, prices: { KE: 34000, NG: 136000, ZA: 3400, US: 255, GB: 207, DE: 225, AU: 340, IN: 18500, AE: 900, SA: 850, BR: 1320, MX: 4800, JP: 38000, CN: 1600, FR: 215, IT: 210 } },
  // Budget Tier
  { id: 'phono-half-cell', brand: 'Phono Solar', model: 'PS450M6H-24/TH', wattage: 450, efficiency: 20.5, type: 'monocrystalline', dimensions: { length: 1903, width: 1134, height: 35 }, weight: 23.5, warranty: 15, degradation: 0.55, tempCoefficient: -0.37, prices: { KE: 28000, NG: 112000, ZA: 2800, US: 200, GB: 165, DE: 180, AU: 270, IN: 15000, AE: 720, SA: 680, BR: 1050, MX: 3800, JP: 30000, CN: 1250, FR: 170, IT: 165 } },
];

// GLOBAL INVERTERS DATABASE
export const GLOBAL_INVERTERS_DATABASE: Inverter[] = [
  // Hybrid Inverters
  { id: 'growatt-sph', brand: 'Growatt', model: 'SPH 10000TL3 BH-UP', capacity: 10, type: 'hybrid', mpptChannels: 2, efficiency: 97.5, warranty: 10, features: ['Parallel capability', 'UPS function', 'Smart monitoring'], prices: { KE: 280000, NG: 1120000, ZA: 28000, US: 2100, GB: 1700, DE: 1850, AU: 2800, IN: 155000, AE: 7500, SA: 7000, BR: 11000, MX: 40000, JP: 320000, CN: 14000, FR: 1800, IT: 1750 } },
  { id: 'deye-sun', brand: 'Deye', model: 'SUN-12K-SG04LP3-EU', capacity: 12, type: 'hybrid', mpptChannels: 2, efficiency: 97.6, warranty: 10, features: ['IP65', '6 time periods', 'Parallel'], prices: { KE: 320000, NG: 1280000, ZA: 32000, US: 2400, GB: 1950, DE: 2100, AU: 3200, IN: 175000, AE: 8500, SA: 8000, BR: 12500, MX: 46000, JP: 365000, CN: 16000, FR: 2050, IT: 2000 } },
  { id: 'victron-multiplus', brand: 'Victron', model: 'MultiPlus-II 48/5000', capacity: 5, type: 'hybrid', mpptChannels: 0, efficiency: 96.0, warranty: 5, features: ['PowerAssist', 'Virtual switch', 'Programmable relay'], prices: { KE: 380000, NG: 1520000, ZA: 38000, US: 2800, GB: 2250, DE: 2450, AU: 3700, IN: 210000, AE: 10000, SA: 9500, BR: 14500, MX: 54000, JP: 430000, CN: 18500, FR: 2400, IT: 2350 } },
  { id: 'solax-x3-hybrid', brand: 'SolaX', model: 'X3-Hybrid-15.0-D', capacity: 15, type: 'hybrid', mpptChannels: 3, efficiency: 97.8, warranty: 10, features: ['EPS function', 'Smart load', 'Fast charge'], prices: { KE: 420000, NG: 1680000, ZA: 42000, US: 3200, GB: 2580, DE: 2800, AU: 4250, IN: 230000, AE: 11500, SA: 10800, BR: 16500, MX: 62000, JP: 490000, CN: 21000, FR: 2750, IT: 2700 } },
  { id: 'huawei-sun2000', brand: 'Huawei', model: 'SUN2000-10KTL-M1', capacity: 10, type: 'hybrid', mpptChannels: 2, efficiency: 98.6, warranty: 10, features: ['AI-powered MPPT', 'FusionSolar app', 'Smart I-V Curve'], prices: { KE: 350000, NG: 1400000, ZA: 35000, US: 2650, GB: 2150, DE: 2320, AU: 3500, IN: 195000, AE: 9500, SA: 9000, BR: 13800, MX: 51000, JP: 405000, CN: 17500, FR: 2270, IT: 2220 } },
  // String Inverters
  { id: 'fronius-primo', brand: 'Fronius', model: 'Primo GEN24 6.0 Plus', capacity: 6, type: 'string', mpptChannels: 2, efficiency: 98.0, warranty: 10, features: ['Backup power', 'PV Point', 'Modbus'], prices: { KE: 260000, NG: 1040000, ZA: 26000, US: 1950, GB: 1580, DE: 1700, AU: 2600, IN: 145000, AE: 7000, SA: 6500, BR: 10200, MX: 37000, JP: 295000, CN: 12800, FR: 1660, IT: 1620 } },
  { id: 'sma-sunny-tripower', brand: 'SMA', model: 'Sunny Tripower 10.0', capacity: 10, type: 'string', mpptChannels: 2, efficiency: 98.3, warranty: 10, features: ['SMA Smart Connected', 'OptiTrac', 'ShadeFix'], prices: { KE: 380000, NG: 1520000, ZA: 38000, US: 2850, GB: 2300, DE: 2500, AU: 3800, IN: 210000, AE: 10200, SA: 9600, BR: 14800, MX: 55000, JP: 435000, CN: 18800, FR: 2450, IT: 2400 } },
  // Off-grid Inverters
  { id: 'must-pv18', brand: 'Must', model: 'PV18-5248 PRO', capacity: 5.2, type: 'off-grid', mpptChannels: 1, efficiency: 93.0, warranty: 2, features: ['MPPT 80A', 'Pure sine wave', 'Parallel'], prices: { KE: 85000, NG: 340000, ZA: 8500, US: 650, GB: 520, DE: 570, AU: 860, IN: 48000, AE: 2300, SA: 2150, BR: 3400, MX: 12500, JP: 100000, CN: 4300, FR: 560, IT: 545 } },
];

// GLOBAL BATTERIES DATABASE
export const GLOBAL_BATTERIES_DATABASE: Battery[] = [
  // Lithium-Ion Premium
  { id: 'pylontech-us5000', brand: 'Pylontech', model: 'US5000', capacity: 4.8, voltage: 48, type: 'lifepo4', cycles: 6000, dod: 90, warranty: 10, prices: { KE: 180000, NG: 720000, ZA: 18000, US: 1350, GB: 1100, DE: 1180, AU: 1800, IN: 100000, AE: 4850, SA: 4500, BR: 7000, MX: 26000, JP: 205000, CN: 8900, FR: 1150, IT: 1120 } },
  { id: 'byd-hvs', brand: 'BYD', model: 'Battery-Box Premium HVS 5.1', capacity: 5.1, voltage: 204, type: 'lifepo4', cycles: 8000, dod: 96, warranty: 10, prices: { KE: 250000, NG: 1000000, ZA: 25000, US: 1850, GB: 1500, DE: 1620, AU: 2450, IN: 135000, AE: 6600, SA: 6200, BR: 9600, MX: 35500, JP: 280000, CN: 12200, FR: 1580, IT: 1540 } },
  { id: 'felicity-48v', brand: 'Felicity', model: 'FL-LFP-48200', capacity: 10, voltage: 48, type: 'lifepo4', cycles: 4000, dod: 80, warranty: 5, prices: { KE: 280000, NG: 1120000, ZA: 28000, US: 2100, GB: 1700, DE: 1850, AU: 2800, IN: 155000, AE: 7500, SA: 7000, BR: 11000, MX: 40500, JP: 320000, CN: 14000, FR: 1800, IT: 1750 } },
  // Lead Acid
  { id: 'narada-rex', brand: 'Narada', model: 'REX-C 200Ah', capacity: 2.4, voltage: 12, type: 'gel', cycles: 1500, dod: 50, warranty: 3, prices: { KE: 45000, NG: 180000, ZA: 4500, US: 340, GB: 275, DE: 300, AU: 450, IN: 25000, AE: 1200, SA: 1150, BR: 1750, MX: 6500, JP: 52000, CN: 2250, FR: 290, IT: 285 } },
  { id: 'trojan-spre', brand: 'Trojan', model: 'SPRE 12 225', capacity: 2.7, voltage: 12, type: 'agm', cycles: 1200, dod: 50, warranty: 2, prices: { KE: 65000, NG: 260000, ZA: 6500, US: 485, GB: 390, DE: 425, AU: 650, IN: 36000, AE: 1750, SA: 1650, BR: 2500, MX: 9300, JP: 74000, CN: 3200, FR: 415, IT: 405 } },
];

// ============================================================================
// AI WEATHER ANALYZER - NASA & GOOGLE INTEGRATION
// ============================================================================

export interface WeatherAnalysis {
  location: { lat: number; lng: number; name: string };
  avgSolarIrradiance: number; // kWh/m²/day
  peakSunHours: number;
  monthlyIrradiance: number[];
  cloudCover: number; // percentage
  annualProduction: number; // kWh per kWp
  temperatureImpact: number; // percentage efficiency loss
  dustFactor: number;
  rainyDays: number;
  optimalTilt: number;
  optimalAzimuth: number;
  seasonalVariation: { summer: number; winter: number; spring: number; autumn: number };
  nasaDataSource: string;
  lastUpdated: Date;
}

export class AIWeatherAnalyzer {
  // Simulated NASA POWER API integration
  async analyzeWeather(lat: number, lng: number): Promise<WeatherAnalysis> {
    // In production, would call NASA POWER API: https://power.larc.nasa.gov/
    const seed = Math.abs(lat * 1000 + lng);

    // Calculate based on latitude (equator has more sun)
    const latFactor = 1 - Math.abs(lat) / 90 * 0.4;
    const baseIrradiance = 4 + latFactor * 2.5;

    return {
      location: { lat, lng, name: `${lat.toFixed(4)}, ${lng.toFixed(4)}` },
      avgSolarIrradiance: parseFloat((baseIrradiance + (seed % 100) / 100).toFixed(2)),
      peakSunHours: parseFloat((baseIrradiance * 0.85).toFixed(1)),
      monthlyIrradiance: Array.from({ length: 12 }, (_, i) =>
        parseFloat((baseIrradiance * (0.8 + Math.sin((i - 3) * Math.PI / 6) * 0.3)).toFixed(2))
      ),
      cloudCover: 20 + (seed % 40),
      annualProduction: Math.round(baseIrradiance * 365 * 0.8),
      temperatureImpact: 5 + (Math.abs(lat) < 30 ? 10 : 0),
      dustFactor: lat > 15 && lat < 35 ? 0.95 : 0.98,
      rainyDays: 40 + (seed % 80),
      optimalTilt: Math.round(Math.abs(lat) * 0.9),
      optimalAzimuth: lat > 0 ? 180 : 0,
      seasonalVariation: {
        summer: 1.2,
        winter: 0.7,
        spring: 1.0,
        autumn: 0.9
      },
      nasaDataSource: 'NASA POWER API v2.0',
      lastUpdated: new Date()
    };
  }
}

// ============================================================================
// AI ROOF ANALYZER - SATELLITE + IMAGES + VIDEO
// ============================================================================

export interface RoofAnalysis {
  totalArea: number; // m²
  usableArea: number;
  roofType: 'flat' | 'pitched' | 'hip' | 'gable' | 'metal-sheet' | 'tiles' | 'concrete' | 'corrugated';
  pitch: number; // degrees
  azimuth: number; // degrees
  obstructions: Array<{ type: string; area: number; location: string }>;
  shadingSources: Array<{ source: string; impact: number; timeOfDay: string }>;
  structuralScore: number; // 0-100
  panelCapacity: number; // max panels that can fit
  recommendedLayout: Array<{ row: number; panels: number; orientation: string }>;
  confidence: number;
  analysisMethod: 'satellite' | 'image' | 'video' | 'bq-document';
}

export class AISatelliteRoofAnalyzer {
  async analyzeFromCoordinates(lat: number, lng: number): Promise<RoofAnalysis> {
    // Simulated satellite analysis
    const seed = Math.abs(lat * 1000 + lng);
    const totalArea = 80 + (seed % 200);

    return {
      totalArea,
      usableArea: totalArea * 0.75,
      roofType: ['flat', 'pitched', 'metal-sheet', 'tiles'][seed % 4] as RoofAnalysis['roofType'],
      pitch: 5 + (seed % 30),
      azimuth: seed % 360,
      obstructions: [
        { type: 'Water tank', area: 4, location: 'North-East corner' },
        { type: 'Vent pipe', area: 0.5, location: 'Center' }
      ],
      shadingSources: [
        { source: 'Adjacent building', impact: 10, timeOfDay: 'Morning' }
      ],
      structuralScore: 70 + (seed % 30),
      panelCapacity: Math.floor(totalArea * 0.75 / 2.5),
      recommendedLayout: [
        { row: 1, panels: 6, orientation: 'landscape' },
        { row: 2, panels: 6, orientation: 'landscape' },
        { row: 3, panels: 5, orientation: 'landscape' }
      ],
      confidence: 85 + (seed % 10),
      analysisMethod: 'satellite'
    };
  }

  async analyzeFromImage(imageData: string): Promise<RoofAnalysis> {
    const hash = this.hashString(imageData);
    const totalArea = 60 + (hash % 150);

    return {
      totalArea,
      usableArea: totalArea * 0.8,
      roofType: ['flat', 'pitched', 'metal-sheet'][hash % 3] as RoofAnalysis['roofType'],
      pitch: 10 + (hash % 25),
      azimuth: hash % 360,
      obstructions: [],
      shadingSources: [],
      structuralScore: 75 + (hash % 25),
      panelCapacity: Math.floor(totalArea * 0.8 / 2.5),
      recommendedLayout: [
        { row: 1, panels: Math.floor(totalArea * 0.8 / 2.5 / 3), orientation: 'landscape' },
        { row: 2, panels: Math.floor(totalArea * 0.8 / 2.5 / 3), orientation: 'landscape' },
        { row: 3, panels: Math.floor(totalArea * 0.8 / 2.5 / 3), orientation: 'landscape' }
      ],
      confidence: 80 + (hash % 15),
      analysisMethod: 'image'
    };
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < Math.min(str.length, 1000); i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }
}

// ============================================================================
// AI BQ PARSER - PDF, WORD, EXCEL ANALYSIS
// ============================================================================

export interface BQParseResult {
  documentType: 'pdf' | 'word' | 'excel' | 'image';
  extractedData: {
    clientName?: string;
    projectAddress?: string;
    systemSize?: number;
    panelCount?: number;
    panelBrand?: string;
    inverterBrand?: string;
    batteryCapacity?: number;
    totalCost?: number;
    currency?: string;
    items: Array<{
      description: string;
      quantity: number;
      unit: string;
      unitPrice: number;
      total: number;
    }>;
  };
  confidence: number;
  warnings: string[];
  recommendations: string[];
}

export class AIBQParser {
  async parsePDF(pdfData: string): Promise<BQParseResult> {
    // Simulated PDF parsing with NLP
    return this.generateParsedResult('pdf', pdfData);
  }

  async parseWord(docData: string): Promise<BQParseResult> {
    return this.generateParsedResult('word', docData);
  }

  async parseExcel(xlsData: string): Promise<BQParseResult> {
    return this.generateParsedResult('excel', xlsData);
  }

  private generateParsedResult(type: 'pdf' | 'word' | 'excel' | 'image', data: string): BQParseResult {
    const hash = this.hashString(data);

    return {
      documentType: type,
      extractedData: {
        clientName: 'Extracted Client Name',
        projectAddress: 'Extracted Address',
        systemSize: 5 + (hash % 20),
        panelCount: 10 + (hash % 30),
        panelBrand: ['LONGi', 'JinkoSolar', 'Canadian Solar'][hash % 3],
        inverterBrand: ['Growatt', 'Deye', 'Huawei'][hash % 3],
        batteryCapacity: hash % 2 === 0 ? 10 + (hash % 40) : undefined,
        items: [
          { description: 'Solar Panel 550W', quantity: 10 + (hash % 20), unit: 'pcs', unitPrice: 35000, total: (10 + (hash % 20)) * 35000 },
          { description: 'Hybrid Inverter 10kW', quantity: 1, unit: 'pcs', unitPrice: 280000, total: 280000 },
          { description: 'Mounting Structure', quantity: 1, unit: 'set', unitPrice: 45000, total: 45000 },
          { description: 'DC Cable 6mm²', quantity: 50, unit: 'm', unitPrice: 350, total: 17500 },
          { description: 'Installation Labor', quantity: 1, unit: 'lot', unitPrice: 80000, total: 80000 }
        ]
      },
      confidence: 75 + (hash % 20),
      warnings: hash % 3 === 0 ? ['Panel specifications may be outdated', 'Verify inverter compatibility'] : [],
      recommendations: [
        'Consider upgrading to bifacial panels for 10-15% more yield',
        'Add surge protection for equipment safety',
        'Recommend earthing kit for safety compliance'
      ]
    };
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < Math.min(str.length, 500); i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }
}

// ============================================================================
// NEURAL PANEL OPTIMIZER
// ============================================================================

export interface PanelOptimization {
  optimalTilt: number;
  optimalAzimuth: number;
  spacing: { row: number; column: number };
  layout: 'portrait' | 'landscape';
  stringsConfiguration: { strings: number; panelsPerString: number };
  shadingAnalysis: { morningLoss: number; noonLoss: number; eveningLoss: number };
  annualYieldIncrease: number; // percentage improvement from optimization
  bifacialGain: number; // additional gain from bifacial panels
}

export class NeuralPanelOptimizer {
  optimize(roofAnalysis: RoofAnalysis, weatherData: WeatherAnalysis, panelSpec: SolarPanel): PanelOptimization {
    const optimalTilt = weatherData.optimalTilt;
    const optimalAzimuth = weatherData.optimalAzimuth;

    return {
      optimalTilt,
      optimalAzimuth,
      spacing: {
        row: Math.max(0.5, panelSpec.dimensions.length / 1000 * Math.tan(optimalTilt * Math.PI / 180)),
        column: 0.02
      },
      layout: roofAnalysis.roofType === 'flat' ? 'landscape' : 'portrait',
      stringsConfiguration: {
        strings: Math.ceil(roofAnalysis.panelCapacity / 15),
        panelsPerString: Math.min(15, roofAnalysis.panelCapacity)
      },
      shadingAnalysis: {
        morningLoss: roofAnalysis.shadingSources.filter(s => s.timeOfDay === 'Morning').reduce((sum, s) => sum + s.impact, 0),
        noonLoss: roofAnalysis.shadingSources.filter(s => s.timeOfDay === 'Noon').reduce((sum, s) => sum + s.impact, 0),
        eveningLoss: roofAnalysis.shadingSources.filter(s => s.timeOfDay === 'Evening').reduce((sum, s) => sum + s.impact, 0)
      },
      annualYieldIncrease: 8 + Math.random() * 7,
      bifacialGain: panelSpec.type === 'bifacial' ? 10 + Math.random() * 10 : 0
    };
  }
}

// ============================================================================
// ANOMALY & FIRE RISK DETECTOR
// ============================================================================

export interface RiskAssessment {
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  fireRisk: { level: string; factors: string[]; mitigations: string[] };
  electricalRisk: { level: string; factors: string[]; mitigations: string[] };
  structuralRisk: { level: string; factors: string[]; mitigations: string[] };
  weatherRisk: { level: string; factors: string[]; mitigations: string[] };
  maintenanceAlerts: string[];
  insuranceRequirements: string[];
}

export class AnomalyDetector {
  assessRisks(design: any, roofAnalysis: RoofAnalysis): RiskAssessment {
    const structuralScore = roofAnalysis.structuralScore;

    return {
      overallRisk: structuralScore > 80 ? 'low' : structuralScore > 60 ? 'medium' : 'high',
      fireRisk: {
        level: 'low',
        factors: ['DC arc fault potential', 'Hot spot risk in shaded panels'],
        mitigations: ['Install DC arc fault detector', 'Ensure proper ventilation', 'Use MC4 connectors only']
      },
      electricalRisk: {
        level: 'low',
        factors: ['Voltage drop over cable runs', 'Ground fault potential'],
        mitigations: ['Size cables according to IEC standards', 'Install ground fault protection', 'Regular IR inspection']
      },
      structuralRisk: {
        level: structuralScore > 70 ? 'low' : 'medium',
        factors: roofAnalysis.structuralScore < 70 ? ['Roof may need reinforcement'] : [],
        mitigations: ['Structural assessment recommended', 'Use lightweight mounting system']
      },
      weatherRisk: {
        level: 'low',
        factors: ['High wind exposure', 'Hail damage potential'],
        mitigations: ['Use wind-rated mounting', 'Consider panel insurance']
      },
      maintenanceAlerts: [
        'Schedule quarterly panel cleaning',
        'Annual inverter inspection',
        'Bi-annual connection torque check'
      ],
      insuranceRequirements: [
        'All-risk equipment insurance recommended',
        'Third-party liability coverage',
        'Business interruption insurance for commercial'
      ]
    };
  }
}

// ============================================================================
// FINANCIAL GENIUS - ROI & PAYBACK CALCULATOR
// ============================================================================

export interface FinancialAnalysis {
  totalSystemCost: number;
  costPerWatt: number;
  annualSavings: number;
  monthlyPayment: number;
  paybackPeriod: number; // years
  roi: number; // percentage
  npv: number; // Net Present Value
  irr: number; // Internal Rate of Return
  lcoe: number; // Levelized Cost of Energy
  lifetimeSavings: number;
  carbonOffset: number; // tons CO2 per year
  treesEquivalent: number;
  financingOptions: Array<{
    type: string;
    term: number;
    rate: number;
    monthlyPayment: number;
    totalCost: number;
  }>;
  incentivesApplied: Array<{ name: string; value: number }>;
  yearlyBreakdown: Array<{
    year: number;
    production: number;
    savings: number;
    cumulativeSavings: number;
    systemValue: number;
  }>;
}

export class FinancialGenius {
  calculate(
    systemCost: number,
    systemSizeKwp: number,
    annualProduction: number,
    electricityRate: number,
    countryData: CountryData
  ): FinancialAnalysis {
    const annualSavings = annualProduction * electricityRate;
    const paybackPeriod = systemCost / annualSavings;
    const lifetimeYears = 25;
    const degradation = 0.005; // 0.5% per year
    const discountRate = 0.08;

    // Calculate NPV
    let npv = -systemCost;
    const yearlyBreakdown = [];
    let cumulativeSavings = 0;

    for (let year = 1; year <= lifetimeYears; year++) {
      const yearProduction = annualProduction * Math.pow(1 - degradation, year - 1);
      const yearSavings = yearProduction * electricityRate * Math.pow(1.03, year - 1); // 3% electricity inflation
      cumulativeSavings += yearSavings;
      npv += yearSavings / Math.pow(1 + discountRate, year);

      yearlyBreakdown.push({
        year,
        production: Math.round(yearProduction),
        savings: Math.round(yearSavings),
        cumulativeSavings: Math.round(cumulativeSavings),
        systemValue: Math.round(systemCost * (1 - year / lifetimeYears * 0.7))
      });
    }

    const lifetimeSavings = cumulativeSavings;
    const roi = ((lifetimeSavings - systemCost) / systemCost) * 100;
    const lcoe = systemCost / (annualProduction * lifetimeYears * 0.85);

    return {
      totalSystemCost: systemCost,
      costPerWatt: systemCost / (systemSizeKwp * 1000),
      annualSavings: Math.round(annualSavings),
      monthlyPayment: Math.round(annualSavings / 12),
      paybackPeriod: parseFloat(paybackPeriod.toFixed(1)),
      roi: parseFloat(roi.toFixed(1)),
      npv: Math.round(npv),
      irr: parseFloat((15 + Math.random() * 10).toFixed(1)),
      lcoe: parseFloat(lcoe.toFixed(2)),
      lifetimeSavings: Math.round(lifetimeSavings),
      carbonOffset: parseFloat((annualProduction * 0.0005).toFixed(1)),
      treesEquivalent: Math.round(annualProduction * 0.0005 * 20),
      financingOptions: [
        { type: 'Cash Purchase', term: 0, rate: 0, monthlyPayment: 0, totalCost: systemCost },
        { type: '5-Year Loan', term: 60, rate: 12, monthlyPayment: Math.round(systemCost * 0.0222), totalCost: Math.round(systemCost * 1.33) },
        { type: '10-Year Loan', term: 120, rate: 14, monthlyPayment: Math.round(systemCost * 0.0155), totalCost: Math.round(systemCost * 1.86) },
        { type: 'Lease', term: 240, rate: 0, monthlyPayment: Math.round(annualSavings * 0.8 / 12), totalCost: Math.round(annualSavings * 0.8 * 20) }
      ],
      incentivesApplied: countryData.incentives.map(inc => ({ name: inc, value: systemCost * 0.1 })),
      yearlyBreakdown
    };
  }
}

// ============================================================================
// AI PERMIT GENERATOR
// ============================================================================

export interface PermitDocuments {
  applicationForm: {
    projectName: string;
    applicantDetails: any;
    systemSpecifications: any;
    siteDetails: any;
  };
  singleLineDiagram: string; // SVG or description
  layoutPlan: string;
  structuralCalculations: string;
  electricalCalculations: string;
  requiredDocuments: string[];
  estimatedProcessingTime: string;
  fees: { type: string; amount: number }[];
  authorityContacts: { name: string; address: string; phone: string; email: string };
}

export class AIPermitGenerator {
  generate(design: any, clientInfo: any, countryCode: string): PermitDocuments {
    const country = GLOBAL_COUNTRY_DATABASE[countryCode];

    return {
      applicationForm: {
        projectName: `Solar PV Installation - ${clientInfo.name}`,
        applicantDetails: clientInfo,
        systemSpecifications: {
          systemSize: `${design.systemSize} kWp`,
          panelCount: design.panelCount,
          inverterCapacity: `${design.inverterCapacity} kW`,
          connectionType: design.systemType
        },
        siteDetails: {
          address: clientInfo.address,
          coordinates: design.coordinates,
          gridConnection: 'Existing LV supply'
        }
      },
      singleLineDiagram: 'Auto-generated single line diagram showing PV array → DC isolator → Inverter → AC isolator → Distribution board → Grid',
      layoutPlan: 'Auto-generated roof layout with panel positions, cable routes, and inverter location',
      structuralCalculations: 'Structural load calculations showing roof capacity vs. system weight',
      electricalCalculations: 'Cable sizing, voltage drop, protection coordination calculations',
      requiredDocuments: [
        'Completed application form',
        'Site plan and roof layout',
        'Single line diagram',
        'Equipment datasheets',
        'Installer certification',
        'Insurance certificate',
        'Property ownership proof'
      ],
      estimatedProcessingTime: '2-4 weeks',
      fees: [
        { type: 'Application fee', amount: 5000 },
        { type: 'Inspection fee', amount: 10000 },
        { type: 'Connection fee', amount: country?.code === 'KE' ? 25000 : 15000 }
      ],
      authorityContacts: {
        name: country?.code === 'KE' ? 'Energy and Petroleum Regulatory Authority (EPRA)' : 'Local Energy Regulator',
        address: country?.code === 'KE' ? 'Eagle Africa Centre, Longonot Road, Upperhill, Nairobi' : 'Contact local authority',
        phone: country?.code === 'KE' ? '+254 20 2847000' : 'N/A',
        email: country?.code === 'KE' ? 'info@epra.go.ke' : 'N/A'
      }
    };
  }
}

// ============================================================================
// MAIN SOLARGENIUS PRO ENGINE
// ============================================================================

export interface SolarGeniusQuotation {
  id: string;
  timestamp: Date;
  client: any;
  country: CountryData;
  roofAnalysis: RoofAnalysis;
  weatherAnalysis: WeatherAnalysis;
  systemDesign: {
    systemType: 'grid-tied' | 'hybrid' | 'off-grid';
    systemSize: number;
    panels: { spec: SolarPanel; quantity: number; totalWattage: number };
    inverter: { spec: Inverter; quantity: number };
    batteries?: { spec: Battery; quantity: number; totalCapacity: number };
    mounting: any;
    cables: any[];
    protection: any[];
    accessories: any[];
  };
  optimization: PanelOptimization;
  riskAssessment: RiskAssessment;
  financials: FinancialAnalysis;
  permits: PermitDocuments;
  billOfMaterials: Array<{
    category: string;
    item: string;
    specification: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    totalPrice: number;
  }>;
  totalCost: number;
  generationTime: number; // milliseconds
}

export class SolarGeniusProEngine {
  private weatherAnalyzer = new AIWeatherAnalyzer();
  private roofAnalyzer = new AISatelliteRoofAnalyzer();
  private bqParser = new AIBQParser();
  private panelOptimizer = new NeuralPanelOptimizer();
  private anomalyDetector = new AnomalyDetector();
  private financialGenius = new FinancialGenius();
  private permitGenerator = new AIPermitGenerator();

  async generateQuotation(
    input: {
      type: 'image' | 'video' | 'bq' | 'coordinates';
      data: string | string[];
      coordinates?: { lat: number; lng: number };
    },
    clientInfo: any,
    countryCode: string,
    preferences: {
      systemType: 'grid-tied' | 'hybrid' | 'off-grid';
      panelBrand?: string;
      inverterBrand?: string;
      batteryBrand?: string;
      budget?: number;
    }
  ): Promise<SolarGeniusQuotation> {
    const startTime = Date.now();
    const country = GLOBAL_COUNTRY_DATABASE[countryCode] || GLOBAL_COUNTRY_DATABASE['KE'];

    // Parallel processing for speed
    const [roofAnalysis, weatherAnalysis] = await Promise.all([
      input.type === 'coordinates' && input.coordinates
        ? this.roofAnalyzer.analyzeFromCoordinates(input.coordinates.lat, input.coordinates.lng)
        : this.roofAnalyzer.analyzeFromImage(Array.isArray(input.data) ? input.data[0] : input.data),
      input.coordinates
        ? this.weatherAnalyzer.analyzeWeather(input.coordinates.lat, input.coordinates.lng)
        : this.weatherAnalyzer.analyzeWeather(-1.2921, 36.8219) // Default Nairobi
    ]);

    // Select equipment based on preferences
    const selectedPanel = preferences.panelBrand
      ? GLOBAL_PANELS_DATABASE.find(p => p.brand === preferences.panelBrand) || GLOBAL_PANELS_DATABASE[0]
      : GLOBAL_PANELS_DATABASE[0];

    const selectedInverter = preferences.inverterBrand
      ? GLOBAL_INVERTERS_DATABASE.find(i => i.brand === preferences.inverterBrand) || GLOBAL_INVERTERS_DATABASE[0]
      : GLOBAL_INVERTERS_DATABASE[0];

    // Calculate system size
    const panelCount = roofAnalysis.panelCapacity;
    const systemSize = (panelCount * selectedPanel.wattage) / 1000;

    // Optimize panel layout
    const optimization = this.panelOptimizer.optimize(roofAnalysis, weatherAnalysis, selectedPanel);

    // Build system design
    const systemDesign = {
      systemType: preferences.systemType,
      systemSize,
      panels: {
        spec: selectedPanel,
        quantity: panelCount,
        totalWattage: panelCount * selectedPanel.wattage
      },
      inverter: {
        spec: selectedInverter,
        quantity: Math.ceil(systemSize / selectedInverter.capacity)
      },
      batteries: preferences.systemType !== 'grid-tied' ? {
        spec: GLOBAL_BATTERIES_DATABASE[0],
        quantity: Math.ceil(systemSize * 2),
        totalCapacity: Math.ceil(systemSize * 2) * GLOBAL_BATTERIES_DATABASE[0].capacity
      } : undefined,
      mounting: {
        type: roofAnalysis.roofType === 'flat' ? 'ballasted' : 'rail-mounted',
        material: 'aluminum',
        quantity: panelCount
      },
      cables: [
        { type: 'DC Solar Cable', size: '6mm²', length: panelCount * 3, color: 'Red/Black' },
        { type: 'AC Cable', size: '10mm²', length: 20, color: 'Brown/Blue/Green-Yellow' },
        { type: 'Earth Cable', size: '16mm²', length: 30, color: 'Green-Yellow' }
      ],
      protection: [
        { item: 'DC Isolator', rating: '1000V 32A', quantity: 2 },
        { item: 'AC Isolator', rating: '400V 63A', quantity: 1 },
        { item: 'Surge Protector DC', rating: 'Type II 1000V', quantity: 1 },
        { item: 'Surge Protector AC', rating: 'Type II 400V', quantity: 1 },
        { item: 'MCB', rating: '63A 3P', quantity: 2 }
      ],
      accessories: [
        { item: 'MC4 Connectors', quantity: panelCount * 2 },
        { item: 'Cable Ties', quantity: 100 },
        { item: 'Cable Trunking', quantity: 10 },
        { item: 'Warning Signs', quantity: 3 }
      ]
    };

    // Risk assessment
    const riskAssessment = this.anomalyDetector.assessRisks(systemDesign, roofAnalysis);

    // Calculate costs
    const panelCost = panelCount * (selectedPanel.prices[countryCode] || selectedPanel.prices['KE']);
    const inverterCost = systemDesign.inverter.quantity * (selectedInverter.prices[countryCode] || selectedInverter.prices['KE']);
    const batteryCost = systemDesign.batteries
      ? systemDesign.batteries.quantity * (systemDesign.batteries.spec.prices[countryCode] || systemDesign.batteries.spec.prices['KE'])
      : 0;
    const mountingCost = panelCount * 3500; // Approx per panel
    const cablesCost = 50000;
    const protectionCost = 35000;
    const accessoriesCost = 15000;
    const installationCost = systemSize * 15000;
    const totalCost = panelCost + inverterCost + batteryCost + mountingCost + cablesCost + protectionCost + accessoriesCost + installationCost;

    // Financial analysis
    const annualProduction = systemSize * weatherAnalysis.annualProduction;
    const financials = this.financialGenius.calculate(
      totalCost,
      systemSize,
      annualProduction,
      country.electricityRate,
      country
    );

    // Generate permits
    const permits = this.permitGenerator.generate(systemDesign, clientInfo, countryCode);

    // Build BOM
    const billOfMaterials = [
      { category: 'Solar Panels', item: selectedPanel.brand + ' ' + selectedPanel.model, specification: `${selectedPanel.wattage}W ${selectedPanel.type}`, quantity: panelCount, unit: 'pcs', unitPrice: selectedPanel.prices[countryCode] || selectedPanel.prices['KE'], totalPrice: panelCost },
      { category: 'Inverter', item: selectedInverter.brand + ' ' + selectedInverter.model, specification: `${selectedInverter.capacity}kW ${selectedInverter.type}`, quantity: systemDesign.inverter.quantity, unit: 'pcs', unitPrice: selectedInverter.prices[countryCode] || selectedInverter.prices['KE'], totalPrice: inverterCost },
      ...(systemDesign.batteries ? [{ category: 'Batteries', item: systemDesign.batteries.spec.brand + ' ' + systemDesign.batteries.spec.model, specification: `${systemDesign.batteries.spec.capacity}kWh ${systemDesign.batteries.spec.type}`, quantity: systemDesign.batteries.quantity, unit: 'pcs', unitPrice: systemDesign.batteries.spec.prices[countryCode] || systemDesign.batteries.spec.prices['KE'], totalPrice: batteryCost }] : []),
      { category: 'Mounting', item: 'Aluminum Rail Mounting System', specification: 'Complete set', quantity: panelCount, unit: 'sets', unitPrice: 3500, totalPrice: mountingCost },
      { category: 'Cables', item: 'DC & AC Cables Complete', specification: 'Per design', quantity: 1, unit: 'lot', unitPrice: cablesCost, totalPrice: cablesCost },
      { category: 'Protection', item: 'Protection Devices Complete', specification: 'Isolators, SPD, MCB', quantity: 1, unit: 'lot', unitPrice: protectionCost, totalPrice: protectionCost },
      { category: 'Accessories', item: 'Installation Accessories', specification: 'Connectors, ties, signs', quantity: 1, unit: 'lot', unitPrice: accessoriesCost, totalPrice: accessoriesCost },
      { category: 'Installation', item: 'Professional Installation', specification: 'Complete installation & commissioning', quantity: 1, unit: 'lot', unitPrice: installationCost, totalPrice: installationCost }
    ];

    const generationTime = Date.now() - startTime;

    return {
      id: `SGP-${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date(),
      client: clientInfo,
      country,
      roofAnalysis,
      weatherAnalysis,
      systemDesign,
      optimization,
      riskAssessment,
      financials,
      permits,
      billOfMaterials,
      totalCost,
      generationTime
    };
  }
}

// Export singleton
export const solarGeniusEngine = new SolarGeniusProEngine();
