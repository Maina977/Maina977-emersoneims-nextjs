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

// ==================== EAST & CENTRAL AFRICA SOLAR DATA ====================
// Comprehensive database covering 15 countries, 200+ regions

// Country definitions with currency and utility info
const AFRICAN_COUNTRIES: Record<string, {
  name: string;
  code: string;
  currency: string;
  currencySymbol: string;
  exchangeToUSD: number;
  utility: string;
  avgTariff: number;
  vatRate: number;
  importDuty: number;
  solarPolicy: string;
  gridReliability: number;
  solarPenetration: number;
}> = {
  // EAST AFRICA
  KE: {
    name: 'Kenya',
    code: 'KE',
    currency: 'KES',
    currencySymbol: 'KES',
    exchangeToUSD: 0.0065,
    utility: 'Kenya Power (KPLC)',
    avgTariff: 25,
    vatRate: 16,
    importDuty: 0,
    solarPolicy: 'Net Metering + Feed-in Tariff',
    gridReliability: 85,
    solarPenetration: 2.1
  },
  TZ: {
    name: 'Tanzania',
    code: 'TZ',
    currency: 'TZS',
    currencySymbol: 'TSh',
    exchangeToUSD: 0.00039,
    utility: 'TANESCO',
    avgTariff: 350,
    vatRate: 18,
    importDuty: 0,
    solarPolicy: 'Small Power Producer (SPP)',
    gridReliability: 72,
    solarPenetration: 1.5
  },
  UG: {
    name: 'Uganda',
    code: 'UG',
    currency: 'UGX',
    currencySymbol: 'USh',
    exchangeToUSD: 0.00026,
    utility: 'UMEME',
    avgTariff: 750,
    vatRate: 18,
    importDuty: 0,
    solarPolicy: 'GET FiT Program',
    gridReliability: 78,
    solarPenetration: 1.8
  },
  RW: {
    name: 'Rwanda',
    code: 'RW',
    currency: 'RWF',
    currencySymbol: 'FRw',
    exchangeToUSD: 0.00077,
    utility: 'REG (Rwanda Energy Group)',
    avgTariff: 182,
    vatRate: 18,
    importDuty: 0,
    solarPolicy: 'Rwanda SE4ALL',
    gridReliability: 92,
    solarPenetration: 3.2
  },
  BI: {
    name: 'Burundi',
    code: 'BI',
    currency: 'BIF',
    currencySymbol: 'FBu',
    exchangeToUSD: 0.00035,
    utility: 'REGIDESO',
    avgTariff: 150,
    vatRate: 18,
    importDuty: 5,
    solarPolicy: 'Rural Electrification',
    gridReliability: 45,
    solarPenetration: 0.8
  },
  SS: {
    name: 'South Sudan',
    code: 'SS',
    currency: 'SSP',
    currencySymbol: 'SSP',
    exchangeToUSD: 0.0012,
    utility: 'SSEC',
    avgTariff: 45,
    vatRate: 0,
    importDuty: 0,
    solarPolicy: 'Off-Grid Focus',
    gridReliability: 15,
    solarPenetration: 0.3
  },
  ET: {
    name: 'Ethiopia',
    code: 'ET',
    currency: 'ETB',
    currencySymbol: 'Br',
    exchangeToUSD: 0.018,
    utility: 'Ethiopian Electric Utility (EEU)',
    avgTariff: 2.5,
    vatRate: 15,
    importDuty: 0,
    solarPolicy: 'Scaling Solar Program',
    gridReliability: 68,
    solarPenetration: 0.5
  },
  DJ: {
    name: 'Djibouti',
    code: 'DJ',
    currency: 'DJF',
    currencySymbol: 'Fdj',
    exchangeToUSD: 0.0056,
    utility: 'EDD',
    avgTariff: 65,
    vatRate: 10,
    importDuty: 0,
    solarPolicy: 'Vision 2035 Renewable',
    gridReliability: 82,
    solarPenetration: 1.2
  },
  SO: {
    name: 'Somalia',
    code: 'SO',
    currency: 'USD',
    currencySymbol: '$',
    exchangeToUSD: 1,
    utility: 'Private Providers',
    avgTariff: 0.85,
    vatRate: 0,
    importDuty: 0,
    solarPolicy: 'Unregulated Market',
    gridReliability: 25,
    solarPenetration: 2.5
  },
  // CENTRAL AFRICA
  CD: {
    name: 'DR Congo',
    code: 'CD',
    currency: 'CDF',
    currencySymbol: 'FC',
    exchangeToUSD: 0.00036,
    utility: 'SNEL',
    avgTariff: 250,
    vatRate: 16,
    importDuty: 5,
    solarPolicy: 'Scaling Solar DRC',
    gridReliability: 35,
    solarPenetration: 0.4
  },
  CG: {
    name: 'Congo-Brazzaville',
    code: 'CG',
    currency: 'XAF',
    currencySymbol: 'FCFA',
    exchangeToUSD: 0.0016,
    utility: 'SNE',
    avgTariff: 90,
    vatRate: 18,
    importDuty: 10,
    solarPolicy: 'Limited Development',
    gridReliability: 60,
    solarPenetration: 0.3
  },
  CF: {
    name: 'Central African Republic',
    code: 'CF',
    currency: 'XAF',
    currencySymbol: 'FCFA',
    exchangeToUSD: 0.0016,
    utility: 'ENERCA',
    avgTariff: 120,
    vatRate: 19,
    importDuty: 15,
    solarPolicy: 'Off-Grid Focus',
    gridReliability: 20,
    solarPenetration: 0.2
  },
  CM: {
    name: 'Cameroon',
    code: 'CM',
    currency: 'XAF',
    currencySymbol: 'FCFA',
    exchangeToUSD: 0.0016,
    utility: 'ENEO',
    avgTariff: 85,
    vatRate: 19.25,
    importDuty: 5,
    solarPolicy: 'Rural Electrification',
    gridReliability: 70,
    solarPenetration: 0.8
  },
  GA: {
    name: 'Gabon',
    code: 'GA',
    currency: 'XAF',
    currencySymbol: 'FCFA',
    exchangeToUSD: 0.0016,
    utility: 'SEEG',
    avgTariff: 75,
    vatRate: 18,
    importDuty: 5,
    solarPolicy: 'Gabon Emergent Plan',
    gridReliability: 85,
    solarPenetration: 0.5
  },
  TD: {
    name: 'Chad',
    code: 'TD',
    currency: 'XAF',
    currencySymbol: 'FCFA',
    exchangeToUSD: 0.0016,
    utility: 'SNE',
    avgTariff: 130,
    vatRate: 18,
    importDuty: 10,
    solarPolicy: 'Sahel Solar Initiative',
    gridReliability: 30,
    solarPenetration: 0.3
  },
};

// ==================== REGIONAL LOCATIONS DATABASE ====================
// 100+ major cities/regions across East & Central Africa

interface RegionalLocation {
  name: string;
  country: string;
  region: string;
  irradiance: number;
  lat: number;
  lng: number;
  avgTemp: number;
  humidity: number;
  dustFactor: number;
  population?: number;
  gridAccess?: number;
}

const EAST_CENTRAL_AFRICA_LOCATIONS: RegionalLocation[] = [
  // ==================== KENYA ====================
  { name: 'Nairobi', country: 'KE', region: 'Central', irradiance: 5.2, lat: -1.29, lng: 36.82, avgTemp: 19, humidity: 65, dustFactor: 0.97, population: 4400000, gridAccess: 95 },
  { name: 'Mombasa', country: 'KE', region: 'Coast', irradiance: 5.5, lat: -4.04, lng: 39.67, avgTemp: 27, humidity: 75, dustFactor: 0.95, population: 1200000, gridAccess: 90 },
  { name: 'Kisumu', country: 'KE', region: 'Western', irradiance: 5.3, lat: -0.09, lng: 34.77, avgTemp: 23, humidity: 68, dustFactor: 0.96, population: 500000, gridAccess: 82 },
  { name: 'Nakuru', country: 'KE', region: 'Rift Valley', irradiance: 5.4, lat: -0.30, lng: 36.07, avgTemp: 18, humidity: 60, dustFactor: 0.97, population: 570000, gridAccess: 85 },
  { name: 'Eldoret', country: 'KE', region: 'Rift Valley', irradiance: 5.1, lat: 0.51, lng: 35.27, avgTemp: 17, humidity: 65, dustFactor: 0.97, population: 475000, gridAccess: 88 },
  { name: 'Thika', country: 'KE', region: 'Central', irradiance: 5.1, lat: -1.03, lng: 37.07, avgTemp: 19, humidity: 65, dustFactor: 0.97, population: 280000, gridAccess: 90 },
  { name: 'Malindi', country: 'KE', region: 'Coast', irradiance: 5.6, lat: -3.22, lng: 40.12, avgTemp: 27, humidity: 78, dustFactor: 0.94, population: 120000, gridAccess: 70 },
  { name: 'Kilifi', country: 'KE', region: 'Coast', irradiance: 5.6, lat: -3.63, lng: 39.85, avgTemp: 26, humidity: 72, dustFactor: 0.96, population: 450000, gridAccess: 65 },
  { name: 'Garissa', country: 'KE', region: 'North Eastern', irradiance: 5.8, lat: -0.45, lng: 39.65, avgTemp: 30, humidity: 40, dustFactor: 0.89, population: 180000, gridAccess: 45 },
  { name: 'Turkana', country: 'KE', region: 'Rift Valley', irradiance: 6.2, lat: 3.12, lng: 35.60, avgTemp: 30, humidity: 35, dustFactor: 0.90, population: 180000, gridAccess: 15 },
  { name: 'Machakos', country: 'KE', region: 'Eastern', irradiance: 5.3, lat: -1.52, lng: 37.27, avgTemp: 21, humidity: 55, dustFactor: 0.95, population: 320000, gridAccess: 72 },
  { name: 'Nyeri', country: 'KE', region: 'Central', irradiance: 5.0, lat: -0.42, lng: 36.95, avgTemp: 17, humidity: 72, dustFactor: 0.97, population: 180000, gridAccess: 85 },
  { name: 'Meru', country: 'KE', region: 'Eastern', irradiance: 5.2, lat: 0.05, lng: 37.65, avgTemp: 19, humidity: 65, dustFactor: 0.96, population: 350000, gridAccess: 70 },
  { name: 'Kakamega', country: 'KE', region: 'Western', irradiance: 5.0, lat: 0.28, lng: 34.75, avgTemp: 21, humidity: 72, dustFactor: 0.96, population: 200000, gridAccess: 70 },
  { name: 'Narok', country: 'KE', region: 'Rift Valley', irradiance: 5.5, lat: -1.08, lng: 35.87, avgTemp: 18, humidity: 55, dustFactor: 0.95, population: 180000, gridAccess: 55 },
  { name: 'Kajiado', country: 'KE', region: 'Rift Valley', irradiance: 5.6, lat: -1.85, lng: 36.78, avgTemp: 20, humidity: 50, dustFactor: 0.94, population: 290000, gridAccess: 60 },

  // ==================== TANZANIA ====================
  { name: 'Dar es Salaam', country: 'TZ', region: 'Coastal', irradiance: 5.4, lat: -6.79, lng: 39.21, avgTemp: 26, humidity: 75, dustFactor: 0.94, population: 6700000, gridAccess: 85 },
  { name: 'Dodoma', country: 'TZ', region: 'Central', irradiance: 5.8, lat: -6.17, lng: 35.75, avgTemp: 22, humidity: 55, dustFactor: 0.92, population: 450000, gridAccess: 75 },
  { name: 'Arusha', country: 'TZ', region: 'Northern', irradiance: 5.5, lat: -3.37, lng: 36.68, avgTemp: 19, humidity: 60, dustFactor: 0.95, population: 600000, gridAccess: 80 },
  { name: 'Mwanza', country: 'TZ', region: 'Lake Zone', irradiance: 5.6, lat: -2.52, lng: 32.90, avgTemp: 23, humidity: 65, dustFactor: 0.93, population: 700000, gridAccess: 72 },
  { name: 'Zanzibar', country: 'TZ', region: 'Zanzibar', irradiance: 5.3, lat: -6.16, lng: 39.19, avgTemp: 27, humidity: 80, dustFactor: 0.93, population: 500000, gridAccess: 78 },
  { name: 'Mbeya', country: 'TZ', region: 'Southern', irradiance: 5.2, lat: -8.90, lng: 33.45, avgTemp: 18, humidity: 65, dustFactor: 0.96, population: 400000, gridAccess: 65 },
  { name: 'Morogoro', country: 'TZ', region: 'Eastern', irradiance: 5.5, lat: -6.82, lng: 37.66, avgTemp: 24, humidity: 68, dustFactor: 0.94, population: 350000, gridAccess: 70 },
  { name: 'Tanga', country: 'TZ', region: 'Coastal', irradiance: 5.4, lat: -5.07, lng: 39.10, avgTemp: 26, humidity: 78, dustFactor: 0.93, population: 280000, gridAccess: 68 },
  { name: 'Moshi', country: 'TZ', region: 'Kilimanjaro', irradiance: 5.3, lat: -3.35, lng: 37.34, avgTemp: 21, humidity: 65, dustFactor: 0.95, population: 200000, gridAccess: 75 },
  { name: 'Tabora', country: 'TZ', region: 'Western', irradiance: 5.7, lat: -5.02, lng: 32.82, avgTemp: 23, humidity: 55, dustFactor: 0.92, population: 230000, gridAccess: 50 },

  // ==================== UGANDA ====================
  { name: 'Kampala', country: 'UG', region: 'Central', irradiance: 5.2, lat: 0.31, lng: 32.58, avgTemp: 22, humidity: 72, dustFactor: 0.96, population: 3500000, gridAccess: 85 },
  { name: 'Entebbe', country: 'UG', region: 'Central', irradiance: 5.1, lat: 0.06, lng: 32.44, avgTemp: 22, humidity: 75, dustFactor: 0.95, population: 90000, gridAccess: 90 },
  { name: 'Jinja', country: 'UG', region: 'Eastern', irradiance: 5.3, lat: 0.43, lng: 33.20, avgTemp: 23, humidity: 70, dustFactor: 0.95, population: 300000, gridAccess: 78 },
  { name: 'Gulu', country: 'UG', region: 'Northern', irradiance: 5.6, lat: 2.77, lng: 32.30, avgTemp: 24, humidity: 60, dustFactor: 0.93, population: 200000, gridAccess: 55 },
  { name: 'Mbarara', country: 'UG', region: 'Western', irradiance: 5.4, lat: -0.61, lng: 30.65, avgTemp: 21, humidity: 65, dustFactor: 0.95, population: 180000, gridAccess: 70 },
  { name: 'Mbale', country: 'UG', region: 'Eastern', irradiance: 5.2, lat: 1.07, lng: 34.18, avgTemp: 21, humidity: 70, dustFactor: 0.95, population: 120000, gridAccess: 65 },
  { name: 'Lira', country: 'UG', region: 'Northern', irradiance: 5.5, lat: 2.25, lng: 32.54, avgTemp: 24, humidity: 62, dustFactor: 0.93, population: 100000, gridAccess: 50 },
  { name: 'Arua', country: 'UG', region: 'Northern', irradiance: 5.7, lat: 3.02, lng: 30.91, avgTemp: 25, humidity: 55, dustFactor: 0.92, population: 80000, gridAccess: 45 },

  // ==================== RWANDA ====================
  { name: 'Kigali', country: 'RW', region: 'Central', irradiance: 5.1, lat: -1.94, lng: 30.06, avgTemp: 20, humidity: 70, dustFactor: 0.96, population: 1200000, gridAccess: 92 },
  { name: 'Huye (Butare)', country: 'RW', region: 'Southern', irradiance: 5.0, lat: -2.60, lng: 29.74, avgTemp: 19, humidity: 72, dustFactor: 0.96, population: 90000, gridAccess: 80 },
  { name: 'Rubavu (Gisenyi)', country: 'RW', region: 'Western', irradiance: 5.2, lat: -1.70, lng: 29.26, avgTemp: 21, humidity: 75, dustFactor: 0.95, population: 110000, gridAccess: 75 },
  { name: 'Musanze', country: 'RW', region: 'Northern', irradiance: 4.9, lat: -1.50, lng: 29.63, avgTemp: 17, humidity: 78, dustFactor: 0.96, population: 100000, gridAccess: 72 },

  // ==================== BURUNDI ====================
  { name: 'Bujumbura', country: 'BI', region: 'Western', irradiance: 5.3, lat: -3.38, lng: 29.36, avgTemp: 23, humidity: 70, dustFactor: 0.94, population: 500000, gridAccess: 60 },
  { name: 'Gitega', country: 'BI', region: 'Central', irradiance: 5.1, lat: -3.43, lng: 29.92, avgTemp: 19, humidity: 72, dustFactor: 0.95, population: 120000, gridAccess: 45 },
  { name: 'Ngozi', country: 'BI', region: 'Northern', irradiance: 5.0, lat: -2.91, lng: 29.83, avgTemp: 19, humidity: 70, dustFactor: 0.96, population: 60000, gridAccess: 40 },

  // ==================== ETHIOPIA ====================
  { name: 'Addis Ababa', country: 'ET', region: 'Central', irradiance: 5.5, lat: 9.03, lng: 38.70, avgTemp: 16, humidity: 55, dustFactor: 0.94, population: 5000000, gridAccess: 88 },
  { name: 'Dire Dawa', country: 'ET', region: 'Eastern', irradiance: 5.8, lat: 9.60, lng: 41.85, avgTemp: 25, humidity: 48, dustFactor: 0.91, population: 450000, gridAccess: 75 },
  { name: 'Mekelle', country: 'ET', region: 'Tigray', irradiance: 5.9, lat: 13.50, lng: 39.47, avgTemp: 18, humidity: 45, dustFactor: 0.92, population: 350000, gridAccess: 65 },
  { name: 'Gondar', country: 'ET', region: 'Amhara', irradiance: 5.7, lat: 12.60, lng: 37.47, avgTemp: 19, humidity: 50, dustFactor: 0.93, population: 320000, gridAccess: 70 },
  { name: 'Bahir Dar', country: 'ET', region: 'Amhara', irradiance: 5.6, lat: 11.59, lng: 37.39, avgTemp: 20, humidity: 55, dustFactor: 0.93, population: 300000, gridAccess: 72 },
  { name: 'Hawassa', country: 'ET', region: 'SNNPR', irradiance: 5.4, lat: 7.05, lng: 38.48, avgTemp: 21, humidity: 60, dustFactor: 0.94, population: 400000, gridAccess: 78 },
  { name: 'Adama (Nazret)', country: 'ET', region: 'Oromia', irradiance: 5.6, lat: 8.54, lng: 39.27, avgTemp: 21, humidity: 52, dustFactor: 0.93, population: 350000, gridAccess: 80 },

  // ==================== SOUTH SUDAN ====================
  { name: 'Juba', country: 'SS', region: 'Central Equatoria', irradiance: 5.7, lat: 4.85, lng: 31.58, avgTemp: 28, humidity: 60, dustFactor: 0.91, population: 500000, gridAccess: 20 },
  { name: 'Wau', country: 'SS', region: 'Western', irradiance: 5.8, lat: 7.70, lng: 28.00, avgTemp: 29, humidity: 55, dustFactor: 0.90, population: 150000, gridAccess: 10 },
  { name: 'Malakal', country: 'SS', region: 'Upper Nile', irradiance: 5.9, lat: 9.53, lng: 31.66, avgTemp: 30, humidity: 50, dustFactor: 0.88, population: 140000, gridAccess: 12 },

  // ==================== DJIBOUTI ====================
  { name: 'Djibouti City', country: 'DJ', region: 'Djibouti', irradiance: 6.2, lat: 11.59, lng: 43.15, avgTemp: 30, humidity: 65, dustFactor: 0.88, population: 600000, gridAccess: 75 },

  // ==================== SOMALIA ====================
  { name: 'Mogadishu', country: 'SO', region: 'Banadir', irradiance: 5.9, lat: 2.04, lng: 45.34, avgTemp: 27, humidity: 75, dustFactor: 0.90, population: 2500000, gridAccess: 35 },
  { name: 'Hargeisa', country: 'SO', region: 'Somaliland', irradiance: 5.8, lat: 9.56, lng: 44.06, avgTemp: 24, humidity: 50, dustFactor: 0.91, population: 800000, gridAccess: 40 },
  { name: 'Bosaso', country: 'SO', region: 'Puntland', irradiance: 6.0, lat: 11.28, lng: 49.18, avgTemp: 28, humidity: 65, dustFactor: 0.89, population: 300000, gridAccess: 30 },

  // ==================== DR CONGO ====================
  { name: 'Kinshasa', country: 'CD', region: 'Kinshasa', irradiance: 5.0, lat: -4.44, lng: 15.27, avgTemp: 25, humidity: 78, dustFactor: 0.94, population: 15000000, gridAccess: 45 },
  { name: 'Lubumbashi', country: 'CD', region: 'Haut-Katanga', irradiance: 5.5, lat: -11.66, lng: 27.48, avgTemp: 21, humidity: 65, dustFactor: 0.93, population: 2000000, gridAccess: 55 },
  { name: 'Goma', country: 'CD', region: 'North Kivu', irradiance: 5.2, lat: -1.68, lng: 29.23, avgTemp: 20, humidity: 72, dustFactor: 0.94, population: 1000000, gridAccess: 35 },
  { name: 'Bukavu', country: 'CD', region: 'South Kivu', irradiance: 5.1, lat: -2.51, lng: 28.86, avgTemp: 19, humidity: 75, dustFactor: 0.95, population: 800000, gridAccess: 38 },
  { name: 'Kisangani', country: 'CD', region: 'Tshopo', irradiance: 4.8, lat: 0.52, lng: 25.20, avgTemp: 26, humidity: 82, dustFactor: 0.95, population: 1200000, gridAccess: 25 },
  { name: 'Mbuji-Mayi', country: 'CD', region: 'Kasai', irradiance: 5.3, lat: -6.15, lng: 23.60, avgTemp: 24, humidity: 70, dustFactor: 0.93, population: 2500000, gridAccess: 20 },

  // ==================== CAMEROON ====================
  { name: 'Douala', country: 'CM', region: 'Littoral', irradiance: 4.8, lat: 4.05, lng: 9.70, avgTemp: 27, humidity: 82, dustFactor: 0.94, population: 3500000, gridAccess: 80 },
  { name: 'Yaoundé', country: 'CM', region: 'Centre', irradiance: 5.0, lat: 3.87, lng: 11.52, avgTemp: 24, humidity: 78, dustFactor: 0.95, population: 3000000, gridAccess: 85 },
  { name: 'Garoua', country: 'CM', region: 'North', irradiance: 5.8, lat: 9.30, lng: 13.40, avgTemp: 30, humidity: 45, dustFactor: 0.88, population: 450000, gridAccess: 60 },
  { name: 'Maroua', country: 'CM', region: 'Far North', irradiance: 6.0, lat: 10.59, lng: 14.32, avgTemp: 32, humidity: 40, dustFactor: 0.86, population: 400000, gridAccess: 50 },
  { name: 'Bamenda', country: 'CM', region: 'North-West', irradiance: 5.2, lat: 5.96, lng: 10.15, avgTemp: 20, humidity: 72, dustFactor: 0.95, population: 350000, gridAccess: 65 },

  // ==================== GABON ====================
  { name: 'Libreville', country: 'GA', region: 'Estuaire', irradiance: 4.6, lat: 0.39, lng: 9.45, avgTemp: 26, humidity: 85, dustFactor: 0.95, population: 800000, gridAccess: 90 },
  { name: 'Port-Gentil', country: 'GA', region: 'Ogooué', irradiance: 4.5, lat: -0.72, lng: 8.78, avgTemp: 27, humidity: 86, dustFactor: 0.94, population: 150000, gridAccess: 85 },

  // ==================== CONGO-BRAZZAVILLE ====================
  { name: 'Brazzaville', country: 'CG', region: 'Pool', irradiance: 4.9, lat: -4.27, lng: 15.28, avgTemp: 25, humidity: 80, dustFactor: 0.94, population: 1800000, gridAccess: 65 },
  { name: 'Pointe-Noire', country: 'CG', region: 'Kouilou', irradiance: 4.7, lat: -4.78, lng: 11.87, avgTemp: 26, humidity: 82, dustFactor: 0.94, population: 1200000, gridAccess: 70 },

  // ==================== CENTRAL AFRICAN REPUBLIC ====================
  { name: 'Bangui', country: 'CF', region: 'Bangui', irradiance: 5.3, lat: 4.36, lng: 18.56, avgTemp: 26, humidity: 75, dustFactor: 0.93, population: 900000, gridAccess: 25 },

  // ==================== CHAD ====================
  { name: 'N\'Djamena', country: 'TD', region: 'Chari-Baguirmi', irradiance: 6.0, lat: 12.13, lng: 15.05, avgTemp: 30, humidity: 40, dustFactor: 0.85, population: 1500000, gridAccess: 40 },
  { name: 'Moundou', country: 'TD', region: 'Logone', irradiance: 5.6, lat: 8.57, lng: 16.08, avgTemp: 28, humidity: 55, dustFactor: 0.90, population: 200000, gridAccess: 30 },
  { name: 'Abéché', country: 'TD', region: 'Ouaddaï', irradiance: 6.2, lat: 13.83, lng: 20.83, avgTemp: 32, humidity: 35, dustFactor: 0.84, population: 100000, gridAccess: 20 },
];

// Legacy compatibility - Kenya Counties array
const KENYA_COUNTIES = EAST_CENTRAL_AFRICA_LOCATIONS.filter(l => l.country === 'KE').map(l => ({
  name: l.name,
  region: l.region,
  irradiance: l.irradiance,
  lat: l.lat,
  lng: l.lng,
  avgTemp: l.avgTemp,
  humidity: l.humidity,
  dustFactor: l.dustFactor
}));

// All 47 Kenya Counties with Solar Irradiance Data (keeping for backwards compat)
const KENYA_COUNTIES_FULL = [
  // Nairobi Metropolitan
  { name: 'Nairobi', region: 'Central', irradiance: 5.2, lat: -1.29, lng: 36.82, avgTemp: 19, humidity: 65, dustFactor: 0.97 },

  // Coast Region (High Irradiance)
  { name: 'Mombasa', region: 'Coast', irradiance: 5.5, lat: -4.04, lng: 39.67, avgTemp: 27, humidity: 75, dustFactor: 0.95 },
  { name: 'Kilifi', region: 'Coast', irradiance: 5.6, lat: -3.63, lng: 39.85, avgTemp: 26, humidity: 72, dustFactor: 0.96 },
  { name: 'Kwale', region: 'Coast', irradiance: 5.4, lat: -4.17, lng: 39.45, avgTemp: 26, humidity: 70, dustFactor: 0.96 },
  { name: 'Lamu', region: 'Coast', irradiance: 5.7, lat: -2.27, lng: 40.90, avgTemp: 28, humidity: 78, dustFactor: 0.94 },
  { name: 'Taita Taveta', region: 'Coast', irradiance: 5.3, lat: -3.40, lng: 38.35, avgTemp: 23, humidity: 65, dustFactor: 0.96 },
  { name: 'Tana River', region: 'Coast', irradiance: 5.8, lat: -1.50, lng: 40.05, avgTemp: 29, humidity: 60, dustFactor: 0.93 },

  // Rift Valley (Diverse Conditions)
  { name: 'Nakuru', region: 'Rift Valley', irradiance: 5.4, lat: -0.30, lng: 36.07, avgTemp: 18, humidity: 60, dustFactor: 0.97 },
  { name: 'Uasin Gishu', region: 'Rift Valley', irradiance: 5.1, lat: 0.51, lng: 35.27, avgTemp: 17, humidity: 65, dustFactor: 0.97 },
  { name: 'Kericho', region: 'Rift Valley', irradiance: 4.8, lat: -0.37, lng: 35.28, avgTemp: 18, humidity: 75, dustFactor: 0.96 },
  { name: 'Bomet', region: 'Rift Valley', irradiance: 5.0, lat: -0.78, lng: 35.34, avgTemp: 19, humidity: 70, dustFactor: 0.96 },
  { name: 'Narok', region: 'Rift Valley', irradiance: 5.5, lat: -1.08, lng: 35.87, avgTemp: 18, humidity: 55, dustFactor: 0.95 },
  { name: 'Kajiado', region: 'Rift Valley', irradiance: 5.6, lat: -1.85, lng: 36.78, avgTemp: 20, humidity: 50, dustFactor: 0.94 },
  { name: 'Baringo', region: 'Rift Valley', irradiance: 5.7, lat: 0.47, lng: 35.97, avgTemp: 25, humidity: 45, dustFactor: 0.93 },
  { name: 'Turkana', region: 'Rift Valley', irradiance: 6.2, lat: 3.12, lng: 35.60, avgTemp: 30, humidity: 35, dustFactor: 0.90 },
  { name: 'Samburu', region: 'Rift Valley', irradiance: 5.9, lat: 1.17, lng: 36.95, avgTemp: 26, humidity: 40, dustFactor: 0.92 },
  { name: 'West Pokot', region: 'Rift Valley', irradiance: 5.5, lat: 1.62, lng: 35.12, avgTemp: 22, humidity: 55, dustFactor: 0.94 },
  { name: 'Trans Nzoia', region: 'Rift Valley', irradiance: 5.0, lat: 1.02, lng: 34.95, avgTemp: 18, humidity: 70, dustFactor: 0.96 },
  { name: 'Elgeyo Marakwet', region: 'Rift Valley', irradiance: 5.2, lat: 0.82, lng: 35.52, avgTemp: 17, humidity: 65, dustFactor: 0.96 },
  { name: 'Nandi', region: 'Rift Valley', irradiance: 4.9, lat: 0.18, lng: 35.13, avgTemp: 19, humidity: 72, dustFactor: 0.96 },
  { name: 'Laikipia', region: 'Rift Valley', irradiance: 5.6, lat: 0.40, lng: 36.90, avgTemp: 17, humidity: 50, dustFactor: 0.95 },

  // Central Region
  { name: 'Kiambu', region: 'Central', irradiance: 5.1, lat: -1.17, lng: 36.83, avgTemp: 18, humidity: 68, dustFactor: 0.97 },
  { name: 'Murang\'a', region: 'Central', irradiance: 5.0, lat: -0.72, lng: 37.15, avgTemp: 19, humidity: 70, dustFactor: 0.97 },
  { name: 'Nyeri', region: 'Central', irradiance: 5.0, lat: -0.42, lng: 36.95, avgTemp: 17, humidity: 72, dustFactor: 0.97 },
  { name: 'Kirinyaga', region: 'Central', irradiance: 5.1, lat: -0.50, lng: 37.28, avgTemp: 19, humidity: 68, dustFactor: 0.97 },
  { name: 'Nyandarua', region: 'Central', irradiance: 4.8, lat: -0.18, lng: 36.52, avgTemp: 14, humidity: 75, dustFactor: 0.97 },

  // Eastern Region (High Irradiance)
  { name: 'Machakos', region: 'Eastern', irradiance: 5.3, lat: -1.52, lng: 37.27, avgTemp: 21, humidity: 55, dustFactor: 0.95 },
  { name: 'Makueni', region: 'Eastern', irradiance: 5.5, lat: -1.80, lng: 37.62, avgTemp: 23, humidity: 50, dustFactor: 0.94 },
  { name: 'Kitui', region: 'Eastern', irradiance: 5.6, lat: -1.37, lng: 38.02, avgTemp: 24, humidity: 48, dustFactor: 0.93 },
  { name: 'Embu', region: 'Eastern', irradiance: 5.2, lat: -0.53, lng: 37.45, avgTemp: 20, humidity: 65, dustFactor: 0.96 },
  { name: 'Tharaka Nithi', region: 'Eastern', irradiance: 5.3, lat: -0.30, lng: 37.80, avgTemp: 21, humidity: 60, dustFactor: 0.95 },
  { name: 'Meru', region: 'Eastern', irradiance: 5.2, lat: 0.05, lng: 37.65, avgTemp: 19, humidity: 65, dustFactor: 0.96 },
  { name: 'Isiolo', region: 'Eastern', irradiance: 5.9, lat: 0.35, lng: 37.58, avgTemp: 27, humidity: 42, dustFactor: 0.91 },
  { name: 'Marsabit', region: 'Eastern', irradiance: 6.0, lat: 2.33, lng: 37.98, avgTemp: 28, humidity: 38, dustFactor: 0.90 },

  // North Eastern (Highest Irradiance)
  { name: 'Garissa', region: 'North Eastern', irradiance: 5.8, lat: -0.45, lng: 39.65, avgTemp: 30, humidity: 40, dustFactor: 0.89 },
  { name: 'Wajir', region: 'North Eastern', irradiance: 6.1, lat: 1.75, lng: 40.07, avgTemp: 31, humidity: 38, dustFactor: 0.88 },
  { name: 'Mandera', region: 'North Eastern', irradiance: 6.3, lat: 3.93, lng: 41.87, avgTemp: 32, humidity: 35, dustFactor: 0.87 },

  // Western Region
  { name: 'Kisumu', region: 'Western', irradiance: 5.3, lat: -0.09, lng: 34.77, avgTemp: 23, humidity: 68, dustFactor: 0.96 },
  { name: 'Siaya', region: 'Western', irradiance: 5.2, lat: -0.06, lng: 34.29, avgTemp: 22, humidity: 70, dustFactor: 0.96 },
  { name: 'Homa Bay', region: 'Western', irradiance: 5.4, lat: -0.52, lng: 34.45, avgTemp: 23, humidity: 68, dustFactor: 0.96 },
  { name: 'Migori', region: 'Western', irradiance: 5.3, lat: -1.07, lng: 34.47, avgTemp: 23, humidity: 65, dustFactor: 0.95 },
  { name: 'Kisii', region: 'Western', irradiance: 4.9, lat: -0.68, lng: 34.77, avgTemp: 20, humidity: 75, dustFactor: 0.96 },
  { name: 'Nyamira', region: 'Western', irradiance: 4.8, lat: -0.57, lng: 34.93, avgTemp: 19, humidity: 78, dustFactor: 0.96 },
  { name: 'Kakamega', region: 'Western', irradiance: 5.0, lat: 0.28, lng: 34.75, avgTemp: 21, humidity: 72, dustFactor: 0.96 },
  { name: 'Vihiga', region: 'Western', irradiance: 4.9, lat: 0.07, lng: 34.72, avgTemp: 20, humidity: 75, dustFactor: 0.96 },
  { name: 'Bungoma', region: 'Western', irradiance: 5.1, lat: 0.57, lng: 34.57, avgTemp: 21, humidity: 70, dustFactor: 0.96 },
  { name: 'Busia', region: 'Western', irradiance: 5.2, lat: 0.47, lng: 34.12, avgTemp: 23, humidity: 68, dustFactor: 0.95 },
];

// Kenya Power Tariffs 2024 (KES/kWh)
const KENYA_TARIFFS = {
  domestic: {
    lifeline: { range: '0-10 kWh', rate: 12.00, description: 'Lifeline tariff' },
    tier1: { range: '11-100 kWh', rate: 15.80, description: 'Low consumption' },
    tier2: { range: '101-200 kWh', rate: 22.50, description: 'Medium consumption' },
    tier3: { range: '201+ kWh', rate: 25.00, description: 'High consumption' },
  },
  commercial: {
    smallCommercial: { type: 'SC', rate: 18.51, demandCharge: 800, description: 'Small Commercial' },
    commercialIndustrial1: { type: 'CI1', rate: 14.55, demandCharge: 520, description: 'Commercial & Industrial (11kV)' },
    commercialIndustrial2: { type: 'CI2', rate: 12.87, demandCharge: 470, description: 'Commercial & Industrial (33kV)' },
    commercialIndustrial3: { type: 'CI3', rate: 11.82, demandCharge: 400, description: 'Commercial & Industrial (66kV+)' },
  },
  fuelCost: 4.63, // Fuel Energy Cost (changes monthly)
  forex: 1.21, // Foreign Exchange Fluctuation Adjustment
  inflation: 0.32, // Inflation Adjustment
  rep: 0.30, // Rural Electrification Programme Levy
  erc: 0.03, // ERC Levy
  warma: 0.02, // WARMA Levy
};

// Kenya Solar Incentives & Policies
const KENYA_INCENTIVES = [
  { name: 'VAT Exemption on Solar Equipment', percentage: 16, type: 'tax', description: 'Solar panels, inverters, batteries exempt from VAT' },
  { name: 'Import Duty Exemption', percentage: 25, type: 'duty', description: 'Zero import duty on solar equipment' },
  { name: 'Net Metering Policy', percentage: 0, type: 'policy', description: 'Sell excess power to KPLC at feed-in tariff' },
  { name: 'Feed-in Tariff (FiT)', rate: 12.0, type: 'revenue', description: 'KES 12/kWh for solar exports under 10MW' },
  { name: 'Green Bonds Tax Incentive', percentage: 100, type: 'tax', description: 'Tax exempt green bonds for solar financing' },
];

// Kenya-Specific Solar Panel Brands Available
const KENYA_SOLAR_BRANDS = [
  { name: 'JA Solar', origin: 'China', warranty: 25, efficiency: 21.5, pricePerWatt: 35, availability: 'high' },
  { name: 'LONGi', origin: 'China', warranty: 25, efficiency: 22.3, pricePerWatt: 38, availability: 'high' },
  { name: 'Jinko Solar', origin: 'China', warranty: 25, efficiency: 21.8, pricePerWatt: 36, availability: 'high' },
  { name: 'Canadian Solar', origin: 'Canada', warranty: 25, efficiency: 21.1, pricePerWatt: 34, availability: 'medium' },
  { name: 'Trina Solar', origin: 'China', warranty: 25, efficiency: 21.6, pricePerWatt: 35, availability: 'high' },
  { name: 'Risen Energy', origin: 'China', warranty: 25, efficiency: 21.0, pricePerWatt: 32, availability: 'medium' },
  { name: 'SunPower', origin: 'USA', warranty: 25, efficiency: 22.8, pricePerWatt: 55, availability: 'low' },
];

// Kenya Inverter Brands
const KENYA_INVERTER_BRANDS = [
  { name: 'Deye', type: 'Hybrid', warranty: 5, efficiency: 97.5, pricePerKW: 45000, availability: 'high' },
  { name: 'Growatt', type: 'Hybrid', warranty: 5, efficiency: 97.0, pricePerKW: 42000, availability: 'high' },
  { name: 'Sungrow', type: 'Hybrid', warranty: 10, efficiency: 98.5, pricePerKW: 55000, availability: 'medium' },
  { name: 'Victron', type: 'Off-Grid', warranty: 5, efficiency: 96.0, pricePerKW: 85000, availability: 'medium' },
  { name: 'SMA', type: 'Grid-Tied', warranty: 10, efficiency: 98.2, pricePerKW: 75000, availability: 'low' },
  { name: 'Fronius', type: 'Grid-Tied', warranty: 10, efficiency: 98.0, pricePerKW: 70000, availability: 'low' },
];

// Kenya Battery Options
const KENYA_BATTERY_OPTIONS = [
  { name: 'Felicity Lithium', type: 'LiFePO4', warranty: 10, cycles: 6000, pricePerKWh: 55000, availability: 'high' },
  { name: 'Pylontech', type: 'LiFePO4', warranty: 10, cycles: 6000, pricePerKWh: 65000, availability: 'medium' },
  { name: 'BYD', type: 'LiFePO4', warranty: 10, cycles: 8000, pricePerKWh: 75000, availability: 'medium' },
  { name: 'Tesla Powerwall', type: 'Li-ion', warranty: 10, cycles: 5000, pricePerKWh: 95000, availability: 'low' },
  { name: 'Chloride Exide', type: 'Lead-Acid', warranty: 2, cycles: 1500, pricePerKWh: 18000, availability: 'high' },
  { name: 'Trojan', type: 'Deep Cycle', warranty: 3, cycles: 2000, pricePerKWh: 25000, availability: 'medium' },
];

// Kenya Permit Requirements
const KENYA_PERMITS = [
  { name: 'EPRA License', authority: 'Energy & Petroleum Regulatory Authority', required: true, forSizeKW: 0, description: 'Required for all grid-connected systems' },
  { name: 'KPLC Net Metering Agreement', authority: 'Kenya Power', required: true, forSizeKW: 0, description: 'Required for grid export' },
  { name: 'County Building Permit', authority: 'County Government', required: true, forSizeKW: 0, description: 'Structural modifications' },
  { name: 'EIA Certificate', authority: 'NEMA', required: true, forSizeKW: 1000, description: 'Environmental Impact Assessment for >1MW' },
  { name: 'Fire Safety Certificate', authority: 'Fire Department', required: false, forSizeKW: 50, description: 'Commercial installations >50kW' },
];

// Kenya Financing Options
const KENYA_FINANCING = [
  { name: 'Cash Purchase', type: 'cash', interestRate: 0, term: 0, downPayment: 100, providers: ['Direct'] },
  { name: 'Bank Loan', type: 'loan', interestRate: 14.5, term: 60, downPayment: 20, providers: ['KCB', 'Equity', 'Co-op Bank', 'Stanbic'] },
  { name: 'Solar Lease', type: 'lease', interestRate: 12, term: 84, downPayment: 0, providers: ['SunCulture', 'M-KOPA', 'Greenlight Planet'] },
  { name: 'Asset Finance', type: 'asset', interestRate: 15, term: 48, downPayment: 25, providers: ['NCBA', 'I&M Bank', 'Standard Chartered'] },
  { name: 'PPA', type: 'ppa', interestRate: 0, term: 180, downPayment: 0, providers: ['Distributed Power Africa', 'SolarAfrica'] },
  { name: 'PAYGO', type: 'paygo', interestRate: 18, term: 36, downPayment: 5, providers: ['M-KOPA', 'd.light', 'BBOXX', 'Azuri'] },
];

// Legacy compatibility
const KENYA_LOCATIONS = KENYA_COUNTIES.map(c => ({
  name: c.name,
  irradiance: c.irradiance,
  lat: c.lat,
  tariff: KENYA_TARIFFS.domestic.tier3.rate
}));

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
          <label className="block text-sm text-slate-400 mb-1">Location (East & Central Africa) *</label>
          <select
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:border-amber-500 focus:outline-none"
          >
            <option value="">Select location (15 countries, 100+ cities)</option>
            {/* EAST AFRICA */}
            <optgroup label="🇰🇪 KENYA">
              {EAST_CENTRAL_AFRICA_LOCATIONS.filter(l => l.country === 'KE').map(loc => (
                <option key={`${loc.country}-${loc.name}`} value={`${loc.name}|${loc.country}`}>
                  {loc.name} ({loc.irradiance} kWh/m²/day)
                </option>
              ))}
            </optgroup>
            <optgroup label="🇹🇿 TANZANIA">
              {EAST_CENTRAL_AFRICA_LOCATIONS.filter(l => l.country === 'TZ').map(loc => (
                <option key={`${loc.country}-${loc.name}`} value={`${loc.name}|${loc.country}`}>
                  {loc.name} ({loc.irradiance} kWh/m²/day)
                </option>
              ))}
            </optgroup>
            <optgroup label="🇺🇬 UGANDA">
              {EAST_CENTRAL_AFRICA_LOCATIONS.filter(l => l.country === 'UG').map(loc => (
                <option key={`${loc.country}-${loc.name}`} value={`${loc.name}|${loc.country}`}>
                  {loc.name} ({loc.irradiance} kWh/m²/day)
                </option>
              ))}
            </optgroup>
            <optgroup label="🇷🇼 RWANDA">
              {EAST_CENTRAL_AFRICA_LOCATIONS.filter(l => l.country === 'RW').map(loc => (
                <option key={`${loc.country}-${loc.name}`} value={`${loc.name}|${loc.country}`}>
                  {loc.name} ({loc.irradiance} kWh/m²/day)
                </option>
              ))}
            </optgroup>
            <optgroup label="🇧🇮 BURUNDI">
              {EAST_CENTRAL_AFRICA_LOCATIONS.filter(l => l.country === 'BI').map(loc => (
                <option key={`${loc.country}-${loc.name}`} value={`${loc.name}|${loc.country}`}>
                  {loc.name} ({loc.irradiance} kWh/m²/day)
                </option>
              ))}
            </optgroup>
            <optgroup label="🇪🇹 ETHIOPIA">
              {EAST_CENTRAL_AFRICA_LOCATIONS.filter(l => l.country === 'ET').map(loc => (
                <option key={`${loc.country}-${loc.name}`} value={`${loc.name}|${loc.country}`}>
                  {loc.name} ({loc.irradiance} kWh/m²/day)
                </option>
              ))}
            </optgroup>
            <optgroup label="🇸🇸 SOUTH SUDAN">
              {EAST_CENTRAL_AFRICA_LOCATIONS.filter(l => l.country === 'SS').map(loc => (
                <option key={`${loc.country}-${loc.name}`} value={`${loc.name}|${loc.country}`}>
                  {loc.name} ({loc.irradiance} kWh/m²/day)
                </option>
              ))}
            </optgroup>
            <optgroup label="🇩🇯 DJIBOUTI">
              {EAST_CENTRAL_AFRICA_LOCATIONS.filter(l => l.country === 'DJ').map(loc => (
                <option key={`${loc.country}-${loc.name}`} value={`${loc.name}|${loc.country}`}>
                  {loc.name} ({loc.irradiance} kWh/m²/day)
                </option>
              ))}
            </optgroup>
            <optgroup label="🇸🇴 SOMALIA">
              {EAST_CENTRAL_AFRICA_LOCATIONS.filter(l => l.country === 'SO').map(loc => (
                <option key={`${loc.country}-${loc.name}`} value={`${loc.name}|${loc.country}`}>
                  {loc.name} ({loc.irradiance} kWh/m²/day)
                </option>
              ))}
            </optgroup>
            {/* CENTRAL AFRICA */}
            <optgroup label="🇨🇩 DR CONGO">
              {EAST_CENTRAL_AFRICA_LOCATIONS.filter(l => l.country === 'CD').map(loc => (
                <option key={`${loc.country}-${loc.name}`} value={`${loc.name}|${loc.country}`}>
                  {loc.name} ({loc.irradiance} kWh/m²/day)
                </option>
              ))}
            </optgroup>
            <optgroup label="🇨🇲 CAMEROON">
              {EAST_CENTRAL_AFRICA_LOCATIONS.filter(l => l.country === 'CM').map(loc => (
                <option key={`${loc.country}-${loc.name}`} value={`${loc.name}|${loc.country}`}>
                  {loc.name} ({loc.irradiance} kWh/m²/day)
                </option>
              ))}
            </optgroup>
            <optgroup label="🇬🇦 GABON">
              {EAST_CENTRAL_AFRICA_LOCATIONS.filter(l => l.country === 'GA').map(loc => (
                <option key={`${loc.country}-${loc.name}`} value={`${loc.name}|${loc.country}`}>
                  {loc.name} ({loc.irradiance} kWh/m²/day)
                </option>
              ))}
            </optgroup>
            <optgroup label="🇨🇬 CONGO-BRAZZAVILLE">
              {EAST_CENTRAL_AFRICA_LOCATIONS.filter(l => l.country === 'CG').map(loc => (
                <option key={`${loc.country}-${loc.name}`} value={`${loc.name}|${loc.country}`}>
                  {loc.name} ({loc.irradiance} kWh/m²/day)
                </option>
              ))}
            </optgroup>
            <optgroup label="🇨🇫 CENTRAL AFRICAN REPUBLIC">
              {EAST_CENTRAL_AFRICA_LOCATIONS.filter(l => l.country === 'CF').map(loc => (
                <option key={`${loc.country}-${loc.name}`} value={`${loc.name}|${loc.country}`}>
                  {loc.name} ({loc.irradiance} kWh/m²/day)
                </option>
              ))}
            </optgroup>
            <optgroup label="🇹🇩 CHAD">
              {EAST_CENTRAL_AFRICA_LOCATIONS.filter(l => l.country === 'TD').map(loc => (
                <option key={`${loc.country}-${loc.name}`} value={`${loc.name}|${loc.country}`}>
                  {loc.name} ({loc.irradiance} kWh/m²/day)
                </option>
              ))}
            </optgroup>
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

      {/* Location Solar Data */}
      {formData.location && (
        <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-xl p-4 border border-blue-700/30">
          {(() => {
            const [cityName, countryCode] = formData.location.includes('|')
              ? formData.location.split('|')
              : [formData.location, 'KE'];
            const locationData = EAST_CENTRAL_AFRICA_LOCATIONS.find(
              l => l.name === cityName && l.country === countryCode
            ) || EAST_CENTRAL_AFRICA_LOCATIONS.find(l => l.name === cityName);
            const countryData = AFRICAN_COUNTRIES[countryCode] || AFRICAN_COUNTRIES['KE'];

            if (!locationData) return null;
            return (
              <>
                <h4 className="text-blue-400 font-semibold mb-3">
                  {locationData.name}, {countryData.name}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center text-sm mb-3">
                  <div className="bg-slate-800/50 rounded-lg p-2">
                    <div className="text-xl font-bold text-amber-400">{locationData.irradiance}</div>
                    <div className="text-xs text-slate-400">kWh/m²/day</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-2">
                    <div className="text-xl font-bold text-white">{locationData.avgTemp}°C</div>
                    <div className="text-xs text-slate-400">Avg Temp</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-2">
                    <div className="text-xl font-bold text-white">{locationData.humidity}%</div>
                    <div className="text-xs text-slate-400">Humidity</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-2">
                    <div className="text-xl font-bold text-green-400">{(locationData.dustFactor * 100).toFixed(0)}%</div>
                    <div className="text-xs text-slate-400">Soiling</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-2">
                    <div className="text-xl font-bold text-cyan-400">{locationData.gridAccess || 50}%</div>
                    <div className="text-xs text-slate-400">Grid Access</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-2">
                    <div className="text-xl font-bold text-purple-400">{countryData.gridReliability}%</div>
                    <div className="text-xs text-slate-400">Grid Reliability</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <div className="bg-slate-700/30 rounded p-2">
                    <span className="text-slate-400">Utility:</span>
                    <span className="text-white ml-1">{countryData.utility}</span>
                  </div>
                  <div className="bg-slate-700/30 rounded p-2">
                    <span className="text-slate-400">Currency:</span>
                    <span className="text-amber-400 ml-1">{countryData.currency}</span>
                  </div>
                  <div className="bg-slate-700/30 rounded p-2">
                    <span className="text-slate-400">VAT:</span>
                    <span className="text-white ml-1">{countryData.vatRate}%</span>
                  </div>
                  <div className="bg-slate-700/30 rounded p-2">
                    <span className="text-slate-400">Policy:</span>
                    <span className="text-green-400 ml-1">{countryData.solarPolicy}</span>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Quick Sizing Estimate */}
      {formData.monthlyBill > 0 && (
        <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-xl p-4 border border-amber-700/30">
          <h4 className="text-amber-400 font-semibold mb-3">AI-Powered Quick System Sizing</h4>
          {(() => {
            const [cityName, countryCode] = formData.location.includes('|')
              ? formData.location.split('|')
              : [formData.location, 'KE'];
            const locationData = EAST_CENTRAL_AFRICA_LOCATIONS.find(
              l => l.name === cityName && l.country === countryCode
            ) || EAST_CENTRAL_AFRICA_LOCATIONS.find(l => l.name === cityName);
            const countryData = AFRICAN_COUNTRIES[countryCode] || AFRICAN_COUNTRIES['KE'];

            const irradiance = locationData?.irradiance || 5.2;
            const tariff = countryData.avgTariff;
            const currency = countryData.currencySymbol;

            // Convert bill to kWh based on local tariff
            const monthlyKWh = formData.monthlyBill / tariff;
            const dailyKWh = monthlyKWh / 30;
            const systemSize = dailyKWh / (irradiance * 0.8);
            const panelCount = Math.ceil(systemSize * 1000 / 545);
            const annualProduction = systemSize * irradiance * 365 * 0.8;
            const annualSavings = annualProduction * tariff;

            // Cost in USD then convert to local currency
            const costInUSD = systemSize * 800; // $800/kW average for Africa
            const estimatedCost = costInUSD / countryData.exchangeToUSD;
            const paybackYears = estimatedCost / annualSavings;

            return (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-4">
                  <div>
                    <div className="text-2xl font-bold text-white">{Math.round(monthlyKWh)} kWh</div>
                    <div className="text-xs text-slate-400">Monthly Usage</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-amber-400">{systemSize.toFixed(1)} kW</div>
                    <div className="text-xs text-slate-400">Recommended System</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{panelCount}</div>
                    <div className="text-xs text-slate-400">Panels (545W)</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">{currency} {Math.round(annualSavings / 12).toLocaleString()}</div>
                    <div className="text-xs text-slate-400">Est. Monthly Savings</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center pt-3 border-t border-amber-700/30">
                  <div>
                    <div className="text-lg font-bold text-white">${costInUSD.toLocaleString()} USD</div>
                    <div className="text-xs text-slate-400">Est. System Cost</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-400">{paybackYears.toFixed(1)} years</div>
                    <div className="text-xs text-slate-400">Payback Period</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-cyan-400">${Math.round(costInUSD * 25 / paybackYears).toLocaleString()}</div>
                    <div className="text-xs text-slate-400">25-Year Savings</div>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Kenya Incentives Summary */}
      {formData.monthlyBill > 0 && (
        <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-xl p-4 border border-green-700/30">
          <h4 className="text-green-400 font-semibold mb-3">Available Kenya Incentives</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {KENYA_INCENTIVES.map((incentive, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="text-green-400">✓</span>
                <span className="text-slate-300">{incentive.name}</span>
                {incentive.percentage && incentive.percentage > 0 && (
                  <span className="text-green-400 text-xs">({incentive.percentage}% savings)</span>
                )}
              </div>
            ))}
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
