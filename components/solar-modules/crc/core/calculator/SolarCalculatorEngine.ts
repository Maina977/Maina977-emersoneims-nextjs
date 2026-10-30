/**
 * Appliance calculator engine (rewritten 2026-10-30 after an audit).
 *
 * The old engine set sun-hours to GHI/1000 for any city but Nairobi (5,188
 * panels for a Mombasa home), sized cable at 2.5 mm² whenever the current was
 * off its chart (153 A on 2.5 mm²), sized the inverter on the single largest
 * appliance and priced everything at a flat KES 250,000 per kW.
 *
 * Now it only turns the appliance list into a daily energy and a peak demand.
 * Sizing, sun-hours (NASA POWER), prices and payback come from the shared
 * calculator (lib/solar/sizing.ts through /api/solar/calculate), so this tab
 * and the main calculator always agree. Cables are sized here from IEC
 * 60364-5-52 current ratings and a voltage-drop limit.
 */
import {
  PANEL_KES_PER_W, PV_KES_PER_KWP_BANDS, BATTERY_KES_PER_KWH, INSTALLATION_FACTOR,
  tieredKes, inverterBands, type SizingResult, type SystemType,
} from '@/lib/solar/sizing';

// ==================== TYPES ====================

export interface Location {
  latitude: number;
  longitude: number;
  country: string;
  city: string;
  altitude: number; // metres
}

export interface Appliance {
  name: string;
  wattage: number;
  dailyHours: number;
  quantity: number;
  priority: 'essential' | 'important' | 'optional';
}

export interface LoadProfile {
  totalDailyEnergy: number; // kWh/day
  /** Simultaneous peak demand, kW (largest load plus half of the rest). */
  peakLoad: number;
  averageLoad: number; // kW
  appliances: Appliance[];
}

export interface SystemRecommendation {
  systemType: SystemType;
  systemSizeKW: number;
  panelCount: number;
  panelWattage: number;
  panelType: string;
  inverterSize: number; // kW
  inverterType: string;
  batteryCapacityKWh: number; // nominal
  batteryUsableKWh: number;
  batteryType: string;
  batteryVoltage: number;
  estimatedProduction: number; // kWh/year
  paybackYears: number | null;
  sunHours: number;
  sunHoursSource: string;
}

export interface CostEstimate {
  pvArray: number;       // panels, mounting and DC cabling
  inverter: number;
  battery: number;
  installation: number;  // installation, AC cabling and protection
  total: number;
  low: number;
  high: number;
  panelsAlone: number;   // panel equipment only, for comparing quotes
  currency: 'KES';
  basis: string;
}

export interface WiringSpec {
  segment: string;
  voltage: number;
  current: number;   // design current, A
  distance: number;  // one-way, m
  cableSize: string; // mm², or '—' when beyond a single cable
  cableType: string;
  colors: string[];
  breaker: string;
  disconnect: boolean;
  notes: string;
}

export interface CalculationResult {
  location: Location;
  loadProfile: LoadProfile;
  recommendation: SystemRecommendation;
  costEstimate: CostEstimate;
  wiringSpecs: WiringSpec[];
  assumptions: string[];
  qualityWarnings: string[];
  safetyNotes: string[];
}

/** What /api/solar/calculate returns (SizingResult plus the sun-hours used). */
export type SizingResponse = SizingResult & { sunHours: { annual: number; source: string; note: string }; warning?: string };

// ==================== APPLIANCES ====================

/** Typical appliance draws. Fridges and freezers cycle: the hours are compressor running time. */
export const APPLIANCE_DATABASE = {
  lights: [
    { name: 'LED Light (10W)', wattage: 10, dailyHours: 4 },
    { name: 'LED Light (20W)', wattage: 20, dailyHours: 4 },
  ],
  kitchen: [
    { name: 'Electric Kettle (2000W)', wattage: 2000, dailyHours: 0.25 },
    { name: 'Refrigerator (150W, compressor ~10 h/day)', wattage: 150, dailyHours: 10 },
    { name: 'Chest Freezer (120W, compressor ~12 h/day)', wattage: 120, dailyHours: 12 },
    { name: 'Microwave (1000W)', wattage: 1000, dailyHours: 0.25 },
    { name: 'Blender (500W)', wattage: 500, dailyHours: 0.1 },
  ],
  entertainment: [
    { name: 'TV 32" (60W)', wattage: 60, dailyHours: 5 },
    { name: 'TV 55" (120W)', wattage: 120, dailyHours: 5 },
    { name: 'Laptop (65W)', wattage: 65, dailyHours: 6 },
    { name: 'Wi-Fi router (12W)', wattage: 12, dailyHours: 24 },
  ],
  climate: [
    { name: 'Air Conditioner 12,000 BTU (1100W)', wattage: 1100, dailyHours: 6 },
    { name: 'Fan (60W)', wattage: 60, dailyHours: 8 },
    { name: 'Instant shower (3000W)', wattage: 3000, dailyHours: 0.3 },
  ],
  other: [
    { name: 'Washing Machine (500W)', wattage: 500, dailyHours: 1 },
    { name: 'Iron (1200W)', wattage: 1200, dailyHours: 0.5 },
    { name: 'Water Pump (750W)', wattage: 750, dailyHours: 1.5 },
  ],
};

// ==================== CABLES ====================

/** Copper, PVC, two loaded conductors, IEC 60364-5-52 Table B.52.4 method C (A). */
const AMPACITY_A: [number, number][] = [
  [1.5, 19.5], [2.5, 27], [4, 36], [6, 46], [10, 63], [16, 85], [25, 112], [35, 138],
  [50, 168], [70, 213], [95, 258], [120, 299], [150, 344], [185, 392], [240, 461],
];
const RHO_70C = 0.0225; // Ω·mm²/m, copper at 70 °C operating temperature
const BREAKERS_A = [10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630];

/** Smallest conductor carrying the current with the drop within the limit, or null. */
export function sizeConductor(currentA: number, oneWayM: number, volts: number, maxDropPct: number): { mm2: number; dropPct: number } | null {
  for (const [mm2, amp] of AMPACITY_A) {
    if (amp < currentA) continue;
    const dropPct = ((2 * oneWayM * currentA * RHO_70C) / mm2 / volts) * 100;
    if (dropPct <= maxDropPct) return { mm2, dropPct: Math.round(dropPct * 100) / 100 };
  }
  return null;
}
const breakerFor = (designA: number) => BREAKERS_A.find((b) => b >= designA) ?? null;

// ==================== ENGINE ====================

export class SolarCalculatorEngine {
  /** Daily energy and a simultaneous peak (largest load plus half of the others). */
  calculateLoadProfile(appliances: Appliance[]): LoadProfile {
    const bad = appliances.find((a) => !(a.wattage > 0 && a.wattage <= 50_000) || !(a.dailyHours >= 0 && a.dailyHours <= 24) || !(Number.isInteger(a.quantity) && a.quantity >= 1 && a.quantity <= 500));
    if (bad) throw new Error(`Check "${bad.name}": watts must be 1 to 50,000, hours 0 to 24 and quantity a whole number from 1 to 500.`);
    const loads = appliances.map((a) => (a.wattage * a.quantity) / 1000);
    const totalDailyEnergy = appliances.reduce((s, a) => s + (a.wattage * a.dailyHours * a.quantity) / 1000, 0);
    const largest = Math.max(0, ...loads);
    const peakLoad = largest + 0.5 * (loads.reduce((s, x) => s + x, 0) - largest);
    return { totalDailyEnergy, peakLoad, averageLoad: totalDailyEnergy / 24, appliances };
  }

  /** Request body for /api/solar/calculate. */
  sizingRequest(location: Location, load: LoadProfile, systemType: SystemType, tariffKes?: number) {
    return {
      consumption: Math.round(load.totalDailyEnergy * 30 * 10) / 10,
      lat: location.latitude,
      lon: location.longitude,
      systemType,
      peakLoadKw: Math.round(load.peakLoad * 100) / 100,
      ...(tariffKes ? { tariff: tariffKes } : {}),
    };
  }

  /** Cost split on the calculator's own price list (before VAT). */
  costFrom(s: SizingResponse): CostEstimate {
    const pvArray = tieredKes(s.pvKwp, PV_KES_PER_KWP_BANDS);
    const inverter = tieredKes(s.inverterKw, inverterBands(s.systemType));
    const battery = s.batteryKwh * BATTERY_KES_PER_KWH;
    const equipment = pvArray + inverter + battery;
    const round = (x: number) => Math.round(x / 1000) * 1000;
    return {
      pvArray: round(pvArray), inverter: round(inverter), battery: round(battery),
      installation: round(equipment * (INSTALLATION_FACTOR - 1)),
      total: s.cost.midKes, low: s.cost.lowKes, high: s.cost.highKes,
      panelsAlone: round(s.panels * s.panelWatt * PANEL_KES_PER_W),
      currency: 'KES',
      basis: 'Typical Kenyan installed prices, mid-2026, before VAT; not a quotation.',
    };
  }

  /** Wiring for a 48 V battery system: string, battery and AC cables. */
  generateWiringSpecs(s: SizingResponse): WiringSpec[] {
    const specs: WiringSpec[] = [];
    // 550 W module: Isc about 14 A, Vmp about 41.6 V. Up to 9 in series keeps
    // Voc at 10 °C under a typical 500 V MPPT input.
    const perString = Math.min(9, Math.max(s.panels >= 4 ? 4 : s.panels, Math.ceil(s.panels / Math.ceil(s.panels / 9))));
    const strings = Math.ceil(s.panels / perString);
    // Breaker first, then a cable that carries it (In ≤ Iz) within the drop
    // limit (2026-10-30 re-audit: 50 A MCB on 6 mm², Iz 46 A).
    const stringA = 14 * 1.25;
    // IEC 62548: string fuse at least 1.5 × Isc (21 A for Isc 14 A) and not
    // above the module's maximum series fuse (typically 25-30 A).
    const stringFuse = BREAKERS_A.find((b) => b >= 14 * 1.5) ?? 25;
    const pv = sizeConductor(Math.max(stringA, stringFuse), 25, perString * 41.6, 1.5);
    specs.push({
      segment: `PV strings to inverter (${strings} × ${perString} panels)`, voltage: Math.round(perString * 41.6), current: Math.round(stringA * 10) / 10, distance: 25,
      cableSize: pv ? String(Math.max(pv.mm2, 4)) : '—', cableType: 'PV1-F / H1Z2Z2-K solar cable', colors: ['Red (+)', 'Black (−)'],
      breaker: strings > 2 ? `${stringFuse} A gPV fuse per string (≥ 1.5 × Isc; check the module's maximum series fuse)` : 'DC isolator', disconnect: true,
      notes: 'UV-rated cable, MC4 connectors of one make; DC isolator at the inverter',
    });
    if (s.batteryKwh > 0) {
      const battA = ((s.inverterKw * 1000) / (48 * 0.9)) * 1.25;
      const battBreaker = breakerFor(battA);
      const b = battBreaker ? sizeConductor(battBreaker, 3, 48, 1) : null;
      specs.push({
        segment: 'Battery to inverter (48 V)', voltage: 48, current: Math.round(battA), distance: 3,
        cableSize: b ? String(b.mm2) : '—', cableType: 'Flexible battery cable', colors: ['Red (+)', 'Black (−)'],
        breaker: battBreaker && b ? `${battBreaker} A DC breaker or fuse` : '—', disconnect: true,
        notes: b ? `Voltage drop ${b.dropPct}% over 3 m` : 'Above a single 240 mm² cable: use parallel runs sized by an electrician, or a higher-voltage battery',
      });
    }
    const acA = ((s.inverterKw * 1000) / 230) * 1.25;
    const acBreaker = breakerFor(acA);
    const ac = acBreaker ? sizeConductor(acBreaker, 20, 230, 3) : null;
    specs.push({
      segment: 'Inverter AC out to distribution board (single-phase 230 V)', voltage: 230, current: Math.round(acA), distance: 20,
      cableSize: ac ? String(ac.mm2) : '—', cableType: 'PVC copper', colors: ['Brown (L)', 'Blue (N)', 'Green/Yellow (PE)'],
      breaker: acBreaker && ac ? `${acBreaker} A AC MCB` : '—', disconnect: true,
      notes: s.inverterKw > 10 ? 'Above about 10 kW use a three-phase inverter and size per phase' : (ac ? `Voltage drop ${ac.dropPct}% over 20 m` : 'Beyond a single cable: engineer to size'),
    });
    return specs;
  }

  /** Everything the page shows, from the appliance list and the shared calculator's answer. */
  buildResult(location: Location, load: LoadProfile, s: SizingResponse): CalculationResult {
    const wiringSpecs = this.generateWiringSpecs(s);
    const recommendation: SystemRecommendation = {
      systemType: s.systemType,
      systemSizeKW: s.pvKwp,
      panelCount: s.panels,
      panelWattage: s.panelWatt,
      panelType: `Monocrystalline ${s.panelWatt} W (tier-1 brand)`,
      inverterSize: s.inverterKw,
      inverterType: s.systemType === 'off-grid' ? 'Off-grid inverter-charger' : s.systemType === 'hybrid' ? 'Hybrid inverter' : 'Grid-tie inverter',
      batteryCapacityKWh: s.batteryKwh,
      batteryUsableKWh: s.batteryUsableKwh,
      batteryType: s.batteryKwh > 0 ? 'LiFePO4' : 'None',
      batteryVoltage: 48,
      estimatedProduction: s.annualEnergyKwh,
      paybackYears: s.paybackYears,
      sunHours: s.sunHours.annual,
      sunHoursSource: s.sunHours.note,
    };
    const assumptions = [
      `Your appliances use ${load.totalDailyEnergy.toFixed(1)} kWh a day (${Math.round(load.totalDailyEnergy * 30)} kWh a month).`,
      `Peak demand ${load.peakLoad.toFixed(2)} kW: the largest appliance plus half of the others running at once.`,
      ...s.assumptions,
    ];
    const qualityWarnings: string[] = [];
    if (wiringSpecs.some((w) => w.cableSize === '—')) qualityWarnings.push('A cable run is beyond a single cable: have a qualified electrician design it.');
    if (s.warning) qualityWarnings.push(s.warning);
    if (s.notWorthwhile) qualityWarnings.push(s.assumptions[0]);
    return {
      location, loadProfile: load, recommendation, costEstimate: this.costFrom(s), wiringSpecs, assumptions, qualityWarnings,
      safetyNotes: [
        'Installation by an EPRA-licensed solar technician (Energy (Solar Photovoltaic Systems) Regulations 2012).',
        'DC isolator between the array and the inverter; battery breaker or fuse next to the battery; AC isolator on the output.',
        'Earth the array frame and the inverter; surge protection on DC and AC sides (lightning is common in Kenya).',
        'Use UV-rated solar cable and matching MC4 connectors; label every isolator.',
      ],
    };
  }
}

export default SolarCalculatorEngine;
