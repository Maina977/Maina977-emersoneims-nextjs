'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Card,
  SectionHeading,
  SampleBadge,
  HubConnectStrip,
  ProOnly,
  useHubAudience,
} from '@/components/hub/HubShell';
import {
  KPICard,
  StatusBar,
  LockedChart,
  formatValue,
  resolveStatus,
  statusPalette,
  type StatusKey,
} from '@/components/charts/dataviz';

/**
 * Combination Verifier — the platform's signature tool.
 *
 * Buyer enters: appliances/loads + the quote they were given + the
 * brand/model line items + their budget. The verifier returns:
 *
 *   • whether the proposed combination actually works
 *   • expected runtime / output
 *   • whether the quote is honest vs. catalogue benchmark
 *   • what is missing (scope coverage)
 *   • safety risks
 *   • a cheaper-but-safe alternative
 *   • a stronger premium alternative
 *   • long-term (10-year) cost comparison across the three options
 *
 * Honesty: every numeric output renders with units; sample data is
 * labelled with <SampleBadge/>. Tariff, fuel price and battery prices are
 * defaults — replace with audited values before client commitment.
 */

/* ────────── Sample reference data (clearly labelled) ────────── */

interface ApplianceTemplate {
  id: string;
  label: string;
  watts: number;
  hoursPerDay: number;
  critical: boolean;
}

const APPLIANCE_LIBRARY: ApplianceTemplate[] = [
  { id: 'led-lights',   label: 'LED lighting (whole house)', watts:  120, hoursPerDay: 6,  critical: true  },
  { id: 'fridge',       label: 'Refrigerator',               watts:  150, hoursPerDay: 24, critical: true  },
  { id: 'tv',           label: 'TV (LED 55")',               watts:  120, hoursPerDay: 5,  critical: false },
  { id: 'router',       label: 'Router + ONT',               watts:   25, hoursPerDay: 24, critical: true  },
  { id: 'laptop',       label: 'Laptop',                     watts:   60, hoursPerDay: 8,  critical: false },
  { id: 'iron',         label: 'Clothes iron',               watts: 1200, hoursPerDay: 0.3, critical: false },
  { id: 'kettle',       label: 'Kettle',                     watts: 2200, hoursPerDay: 0.2, critical: false },
  { id: 'microwave',    label: 'Microwave',                  watts: 1100, hoursPerDay: 0.3, critical: false },
  { id: 'borehole',     label: 'Borehole pump 1 HP',         watts:  750, hoursPerDay: 2,  critical: true  },
  { id: 'ac-1hp',       label: 'AC 1 HP',                    watts:  900, hoursPerDay: 6,  critical: false },
  { id: 'security',     label: 'CCTV + alarm',               watts:   80, hoursPerDay: 24, critical: true  },
];

interface ProductOption {
  id: string;
  brand: string;
  model: string;
  category: 'inverter' | 'battery' | 'panel' | 'ups' | 'generator';
  ratingValue: number;
  ratingUnit: string;
  priceKes: number;
  authenticityNote: string;
}

const PRODUCT_LIBRARY: ProductOption[] = [
  // Inverters (expanded, premium, varied)
  { id: 'inv-huawei-10k', brand: 'Huawei', model: 'SUN2000-10KTL', category: 'inverter', ratingValue: 10, ratingUnit: 'kW', priceKes: 168_000, authenticityNote: 'Type-II SPD integrated; arc-fault detect option (Sample)' },
  { id: 'inv-sma-25k', brand: 'SMA', model: 'Sunny Tripower 25 kW', category: 'inverter', ratingValue: 25, ratingUnit: 'kW', priceKes: 480_000, authenticityNote: 'Reactive power control + grid-code compliance (Sample)' },
  { id: 'inv-fronius-15k', brand: 'Fronius', model: 'Symo 15 kW', category: 'inverter', ratingValue: 15, ratingUnit: 'kW', priceKes: 320_000, authenticityNote: 'SuperFlex MPPT; dynamic peak manager (Sample)' },
  { id: 'inv-victron-5k', brand: 'Victron', model: 'MultiPlus-II 5 kVA', category: 'inverter', ratingValue: 5, ratingUnit: 'kVA', priceKes: 245_000, authenticityNote: 'VE.Bus serial + Victron Connect handshake' },
  { id: 'inv-growatt-5k', brand: 'Growatt', model: 'SPF 5000 ES', category: 'inverter', ratingValue: 5, ratingUnit: 'kVA', priceKes: 98_000, authenticityNote: 'Built-in MPPT; basic SPD; manual transfer option (Sample)' },
  { id: 'inv-oem-3k', brand: 'Generic OEM', model: '3 kVA PWM Off-grid', category: 'inverter', ratingValue: 3, ratingUnit: 'kVA', priceKes: 24_000, authenticityNote: 'Limited surge tolerance; warranty clarity needed (Sample)' },

  // Batteries (expanded, premium, varied)
  { id: 'bat-byd-15', brand: 'BYD', model: 'B-Box LV 15.4', category: 'battery', ratingValue: 15.4, ratingUnit: 'kWh', priceKes: 285_000, authenticityNote: 'LFP chemistry + integrated BMS; partner-only commissioning (Sample)' },
  { id: 'bat-pylontech-3.5', brand: 'Pylontech', model: 'US3000C 3.5 kWh', category: 'battery', ratingValue: 3.5, ratingUnit: 'kWh', priceKes: 145_000, authenticityNote: 'BMS handshake required with inverter family' },
  { id: 'bat-tesla-13', brand: 'Tesla', model: 'Powerwall 3 13.5 kWh', category: 'battery', ratingValue: 13.5, ratingUnit: 'kWh', priceKes: 1180000, authenticityNote: 'Integrated hybrid inverter; whole-home backup capable (Sample)' },
  { id: 'bat-lg-10', brand: 'LG Energy', model: 'RESU10H Prime', category: 'battery', ratingValue: 9.6, ratingUnit: 'kWh', priceKes: 620_000, authenticityNote: 'NMC chemistry; thermal management included (Sample)' },
  { id: 'bat-narada-9.6', brand: 'Narada', model: '48V 200 Ah LFP Rack', category: 'battery', ratingValue: 9.6, ratingUnit: 'kWh', priceKes: 195_000, authenticityNote: 'CAN-bus BMS; over-temp + over-discharge protection (Sample)' },
  { id: 'bat-agm-2.4', brand: 'Generic AGM', model: '200 Ah AGM 12 V', category: 'battery', ratingValue: 2.4, ratingUnit: 'kWh', priceKes: 42_000, authenticityNote: 'No BMS; integration caution for lithium-style charge profiles (Sample)' },
  { id: 'bat-oem-li', brand: 'Generic OEM', model: '100 Ah LiFePO4 12 V', category: 'battery', ratingValue: 1.28, ratingUnit: 'kWh', priceKes: 35_000, authenticityNote: 'Documentation mismatch risk on cycle-life claims (Sample)' },

  // UPS (expanded, premium, varied)
  { id: 'ups-eaton-6k', brand: 'Eaton', model: '9PX 6 kVA', category: 'ups', ratingValue: 6, ratingUnit: 'kVA', priceKes: 295_000, authenticityNote: 'Online double-conversion; 0 ms transfer (Sample)' },
  { id: 'ups-apc-10k', brand: 'APC', model: 'Smart-UPS SRT 10 kVA', category: 'ups', ratingValue: 10, ratingUnit: 'kVA', priceKes: 612_000, authenticityNote: 'Online + extended runtime modules (Sample)' },
  { id: 'ups-vertiv-20k', brand: 'Vertiv', model: 'Liebert APM 20 kVA', category: 'ups', ratingValue: 20, ratingUnit: 'kVA', priceKes: 1220000, authenticityNote: 'Hot-swap modules; N+1 redundancy at module level (Sample)' },
  { id: 'ups-riello-15k', brand: 'Riello', model: 'Multi Sentry MST 15', category: 'ups', ratingValue: 15, ratingUnit: 'kVA', priceKes: 790_000, authenticityNote: 'IGBT rectifier; galvanic isolation option (Sample)' },
  { id: 'ups-cyberpower-3k', brand: 'CyberPower', model: 'OL3000ERT2U 3 kVA', category: 'ups', ratingValue: 3, ratingUnit: 'kVA', priceKes: 135_000, authenticityNote: 'Online double-conversion; SNMP card option (Sample)' },
  { id: 'ups-oem-2k', brand: 'Generic OEM', model: '2 kVA Line-Interactive', category: 'ups', ratingValue: 2, ratingUnit: 'kVA', priceKes: 18_000, authenticityNote: 'Limited transfer time; no isolation; warranty clarity needed (Sample)' },

  // Deye hybrid inverters (Kenya market)
  { id: 'inv-deye-3k',     brand: 'Deye', model: 'SUN-3K-SG04LP1 Hybrid',           category: 'inverter', ratingValue: 3,    ratingUnit: 'kW',  priceKes:  78_000, authenticityNote: 'Verify via Solarman serial + authorised distributor (Sample)' },
  { id: 'inv-deye-3.6k',   brand: 'Deye', model: 'SUN-3.6K-SG04LP1 Hybrid',         category: 'inverter', ratingValue: 3.6,  ratingUnit: 'kW',  priceKes:  88_000, authenticityNote: 'Verify Solarman serial + dealer chain (Sample)' },
  { id: 'inv-deye-5k',     brand: 'Deye', model: 'SUN-5K-SG03LP1-EU Hybrid',        category: 'inverter', ratingValue: 5,    ratingUnit: 'kW',  priceKes: 115_000, authenticityNote: 'Confirm BMS handshake list before LFP pairing (Sample)' },
  { id: 'inv-deye-6k',     brand: 'Deye', model: 'SUN-6K-SG04LP1-EU Hybrid',        category: 'inverter', ratingValue: 6,    ratingUnit: 'kW',  priceKes: 138_000, authenticityNote: 'Smart-load output port; parallel-capable (Sample)' },
  { id: 'inv-deye-8k',     brand: 'Deye', model: 'SUN-8K-SG01LP1-EU Hybrid',        category: 'inverter', ratingValue: 8,    ratingUnit: 'kW',  priceKes: 168_000, authenticityNote: 'Generator input + CT zero-export option (Sample)' },
  { id: 'inv-deye-12k',    brand: 'Deye', model: 'SUN-12K-SG01LP1-EU Hybrid',       category: 'inverter', ratingValue: 12,   ratingUnit: 'kW',  priceKes: 245_000, authenticityNote: 'UPS-class transfer to backup loads (Sample)' },
  { id: 'inv-deye-12k-3p', brand: 'Deye', model: 'SUN-12K-SG04LP3-EU 3-phase',      category: 'inverter', ratingValue: 12,   ratingUnit: 'kW',  priceKes: 275_000, authenticityNote: 'Compatibility caution: confirm BMS list (Sample)' },
  { id: 'inv-deye-16k',    brand: 'Deye', model: 'SUN-16K-SG01LP1 Hybrid',          category: 'inverter', ratingValue: 16,   ratingUnit: 'kW',  priceKes: 320_000, authenticityNote: 'High continuous output; verify firmware revision (Sample)' },

  // TBB / RIIO inverters (Kenya market)
  { id: 'inv-tbb-riio-115k', brand: 'TBB', model: 'RIIO SUN-11.5KVA/48V (250 V/100 A)', category: 'inverter', ratingValue: 11.5, ratingUnit: 'kVA', priceKes: 410_000, authenticityNote: 'Documentation clarity needed on battery-BMS list — verification recommended (Sample)' },
  { id: 'inv-tbb-riio-118k', brand: 'TBB', model: 'RIIO SUN-11.8 kVA/48 V Hybrid',      category: 'inverter', ratingValue: 11.8, ratingUnit: 'kVA', priceKes: 425_000, authenticityNote: 'Traceability check recommended via authorised TBB partner (Sample)' },
  { id: 'inv-tbb-riio-ii-3k',brand: 'TBB', model: 'RIIO SUN II 3 kW 24 V Hybrid',       category: 'inverter', ratingValue: 3,    ratingUnit: 'kW',  priceKes:  85_000, authenticityNote: 'MPPT solar charger built-in; basic SPD (Sample)' },
  { id: 'inv-tbb-riio-ii-8k',brand: 'TBB', model: 'RIIO SUN II 8 kVA Hybrid',           category: 'inverter', ratingValue: 8,    ratingUnit: 'kVA', priceKes: 235_000, authenticityNote: 'Authorised partner support recommended for warranty enforcement (Sample)' },

  // Chloride / Exide / extended battery line (Kenya market)
  { id: 'bat-chloride-1024', brand: 'Chloride',         model: 'Lithium 10.24 kWh',           category: 'battery', ratingValue: 10.24, ratingUnit: 'kWh', priceKes: 410_000, authenticityNote: 'LFP + integrated BMS; CAN-bus / RS485 (Sample)' },
  { id: 'bat-chloride-51',   brand: 'Chloride',         model: 'Lithium 5.1 kWh',             category: 'battery', ratingValue: 5.1,   ratingUnit: 'kWh', priceKes: 225_000, authenticityNote: 'Compatibility caution: confirm inverter handshake list (Sample)' },
  { id: 'bat-exide-2v100',   brand: 'PowerSafe Exide',  model: '2 V / 100 Ah VRLA cell',      category: 'battery', ratingValue: 0.2,   ratingUnit: 'kWh', priceKes:  18_500, authenticityNote: '10–12 yr design life @ 25 °C; structured maintenance recommended (Sample)' },
  { id: 'bat-li-12v200',     brand: 'Generic Lithium',  model: '12 V / 200 Ah LiFePO4',       category: 'battery', ratingValue: 2.56,  ratingUnit: 'kWh', priceKes:  58_000, authenticityNote: 'Built-in BMS; traceability check recommended (Sample)' },

  // Extended UPS coverage (server room → data hall)
  { id: 'ups-eaton-9sx-3k',   brand: 'Eaton',     model: '9SX 3 kVA Online',         category: 'ups', ratingValue: 3,  ratingUnit: 'kVA', priceKes:   145_000, authenticityNote: 'Online double-conversion; LCD monitoring (Sample)' },
  { id: 'ups-apc-smt-3k',     brand: 'APC',       model: 'Smart-UPS SMT3000RMI2U',   category: 'ups', ratingValue: 3,  ratingUnit: 'kVA', priceKes:   165_000, authenticityNote: 'Sine-wave output; SmartConnect cloud monitoring (Sample)' },
  { id: 'ups-vertiv-gxt5-1k', brand: 'Vertiv',    model: 'Liebert GXT5 1 kVA',       category: 'ups', ratingValue: 1,  ratingUnit: 'kVA', priceKes:    72_000, authenticityNote: 'Online double-conversion; SNMP card option (Sample)' },
  { id: 'ups-schneider-3k',   brand: 'Schneider', model: 'Easy UPS SRV3KI 3 kVA',    category: 'ups', ratingValue: 3,  ratingUnit: 'kVA', priceKes:   132_000, authenticityNote: 'Online; user-replaceable batteries (Sample)' },
  { id: 'ups-huawei-5k',      brand: 'Huawei',    model: 'UPS2000-G 5 kVA',          category: 'ups', ratingValue: 5,  ratingUnit: 'kVA', priceKes:   185_000, authenticityNote: 'Online tower; ECO mode option (Sample)' },
  { id: 'ups-delta-30k',      brand: 'Delta',     model: 'Amplon RT-30 30 kVA',      category: 'ups', ratingValue: 30, ratingUnit: 'kVA', priceKes: 1_580_000, authenticityNote: 'High efficiency in ECO mode (Sample)' },
  { id: 'ups-socomec-40k',    brand: 'Socomec',   model: 'ITYS 40 kVA',              category: 'ups', ratingValue: 40, ratingUnit: 'kVA', priceKes: 2_120_000, authenticityNote: 'IGBT rectifier; galvanic isolation option (Sample)' },

  // Panels (unchanged, for completeness)
  { id: 'pv-jinko', brand: 'Jinko', model: 'Tiger Neo 550 W', category: 'panel', ratingValue: 0.55, ratingUnit: 'kW', priceKes: 18500, authenticityNote: 'Jinko serial + BIS marking required' },
  { id: 'pv-canadian', brand: 'Canadian', model: 'HiKu7 600 W', category: 'panel', ratingValue: 0.6, ratingUnit: 'kW', priceKes: 21000, authenticityNote: 'Canadian Solar QR-code traceability' },
];

const FUEL_PRICE_KES_PER_LITRE   = 195;   // KE diesel (sample)
const GRID_TARIFF_KES_PER_KWH    = 28;    // KPLC commercial (sample)
const SOLAR_DAYTIME_HOURS        = 5;     // peak-equivalent sun hours (KE avg)
const BATTERY_DOD_PCT            = 80;    // safe depth-of-discharge for Li-ion
const INVERTER_EFFICIENCY        = 0.92;
const SYSTEM_DERATE              = 0.85;  // wiring + temp + soiling
const ANALYSIS_YEARS             = 10;
const BATTERY_LIFE_YEARS_LI      = 8;
const BATTERY_LIFE_YEARS_AGM     = 3;

/* ────────── Verifier model (transparent) ────────── */

interface QuoteLine {
  productId: string;     // matches PRODUCT_LIBRARY id
  qty: number;
  unitPriceKes: number;  // what the buyer was charged
}

interface VerifierInput {
  appliances: Array<{ templateId: string; qty: number }>;
  quote: QuoteLine[];
  budgetKes: number;
}

interface ApplianceMath {
  totalContinuousW: number;
  totalCriticalW: number;
  totalDailyKwh: number;
  largestStartingW: number;
}

function computeAppliances(items: VerifierInput['appliances']): ApplianceMath {
  let cont = 0;
  let crit = 0;
  let kwh = 0;
  let largestStart = 0;
  for (const it of items) {
    const t = APPLIANCE_LIBRARY.find((a) => a.id === it.templateId);
    if (!t) continue;
    const w = t.watts * it.qty;
    cont += w;
    if (t.critical) crit += w;
    kwh += (t.watts * t.hoursPerDay * it.qty) / 1000;
    // motor-bearing loads (pump, AC) typically draw 4× run current at start
    const startMult = ['borehole', 'ac-1hp', 'fridge'].includes(t.id) ? 4 : 1;
    largestStart = Math.max(largestStart, t.watts * it.qty * startMult);
  }
  return {
    totalContinuousW: cont,
    totalCriticalW: crit,
    totalDailyKwh: kwh,
    largestStartingW: largestStart,
  };
}

interface SystemSummary {
  inverterKva: number;
  batteryKwh: number;
  panelKwp: number;
  upsKva: number;
  generatorKva: number;
  hasBmsBattery: boolean;
}

function summariseQuote(quote: QuoteLine[]): SystemSummary {
  const s: SystemSummary = {
    inverterKva: 0,
    batteryKwh: 0,
    panelKwp: 0,
    upsKva: 0,
    generatorKva: 0,
    hasBmsBattery: false,
  };
  for (const l of quote) {
    const p = PRODUCT_LIBRARY.find((x) => x.id === l.productId);
    if (!p) continue;
    if (p.category === 'inverter')   s.inverterKva   += p.ratingValue * l.qty;
    if (p.category === 'battery') {
      s.batteryKwh += p.ratingValue * l.qty;
      if (!p.id.includes('bud')) s.hasBmsBattery = true;
    }
    if (p.category === 'panel')      s.panelKwp     += p.ratingValue * l.qty;
    if (p.category === 'ups')        s.upsKva       += p.ratingValue * l.qty;
    if (p.category === 'generator')  s.generatorKva += p.ratingValue * l.qty;
  }
  return s;
}

interface Risk {
  severity: Extract<StatusKey, 'success' | 'info' | 'warning' | 'danger'>;
  title: string;
  detail: string;
}

function evaluate(
  appliance: ApplianceMath,
  sys: SystemSummary,
  quote: QuoteLine[],
  budgetKes: number,
) {
  const risks: Risk[] = [];

  // 1. Power adequacy: continuous + starting headroom
  const inverterContW = sys.inverterKva * 1000 * 0.8 * INVERTER_EFFICIENCY;
  const inverterStartW = sys.inverterKva * 1000 * 2; // typical 2× surge for 5 s
  const continuousOk = inverterContW >= appliance.totalContinuousW;
  const startingOk = inverterStartW >= appliance.largestStartingW;
  if (!continuousOk) {
    risks.push({
      severity: 'danger',
      title: 'Inverter undersized for continuous load',
      detail: `Need ${formatValue(appliance.totalContinuousW / 1000, { unit: 'kW', decimals: 2 })} continuous; quoted ${formatValue(sys.inverterKva, { unit: 'kVA', decimals: 1 })} delivers ~${formatValue(inverterContW / 1000, { unit: 'kW', decimals: 2 })}.`,
    });
  }
  if (!startingOk && appliance.largestStartingW > 0) {
    risks.push({
      severity: 'warning',
      title: 'Motor-start surge risk',
      detail: `Largest starting draw ~${formatValue(appliance.largestStartingW / 1000, { unit: 'kW', decimals: 1 })}; inverter surge ~${formatValue(inverterStartW / 1000, { unit: 'kW', decimals: 1 })}.`,
    });
  }

  // 2. Energy / runtime
  const usableBatteryKwh = sys.batteryKwh * (BATTERY_DOD_PCT / 100);
  const eveningKwh = appliance.totalDailyKwh * 0.55; // assume ~55 % consumption after sundown
  const batteryRuntimeHrs = usableBatteryKwh / Math.max(appliance.totalContinuousW / 1000, 0.1);
  const batteryEveningOk = usableBatteryKwh >= eveningKwh;
  if (sys.batteryKwh > 0 && !batteryEveningOk) {
    risks.push({
      severity: 'warning',
      title: 'Battery undersized for evening demand',
      detail: `Evening demand ~${formatValue(eveningKwh, { unit: 'kWh', decimals: 1 })}; usable storage ~${formatValue(usableBatteryKwh, { unit: 'kWh', decimals: 1 })} (at ${BATTERY_DOD_PCT}% DoD).`,
    });
  }

  // 3. PV adequacy
  const pvDailyKwh = sys.panelKwp * SOLAR_DAYTIME_HOURS * SYSTEM_DERATE;
  const pvCoversAll = pvDailyKwh >= appliance.totalDailyKwh;
  if (sys.panelKwp > 0 && !pvCoversAll) {
    risks.push({
      severity: 'info',
      title: 'PV array under daily demand',
      detail: `PV ~${formatValue(pvDailyKwh, { unit: 'kWh/day', decimals: 1 })} vs. demand ${formatValue(appliance.totalDailyKwh, { unit: 'kWh/day', decimals: 1 })}. Grid/genset will top-up.`,
    });
  }

  // 4. Safety: AGM + critical loads
  if (!sys.hasBmsBattery && sys.batteryKwh > 0) {
    risks.push({
      severity: 'warning',
      title: 'No BMS-protected battery',
      detail: 'AGM/lead-acid without BMS — overdischarge will halve life. Specify Li-ion with manufacturer BMS for critical loads.',
    });
  }

  // 5. UPS for critical
  const wantsUps = appliance.totalCriticalW > 0;
  if (wantsUps && sys.upsKva === 0 && sys.batteryKwh === 0) {
    risks.push({
      severity: 'danger',
      title: 'No 0 ms backup for critical loads',
      detail: `Critical loads ~${formatValue(appliance.totalCriticalW / 1000, { unit: 'kW', decimals: 2 })} have no UPS or inverter battery — outage = data/refrigeration loss.`,
    });
  }

  // 6. Quote honesty: total vs. catalogue
  let quoted = 0;
  let catalogue = 0;
  for (const l of quote) {
    const p = PRODUCT_LIBRARY.find((x) => x.id === l.productId);
    if (!p) continue;
    quoted    += l.unitPriceKes * l.qty;
    catalogue += p.priceKes * l.qty;
  }
  const overPct = catalogue > 0 ? ((quoted - catalogue) / catalogue) * 100 : 0;
  if (overPct >= 25) {
    risks.push({
      severity: 'danger',
      title: 'Quote far above benchmark',
      detail: `Quote total ${formatValue(quoted, { decimals: 0 })} KES vs. catalogue ${formatValue(catalogue, { decimals: 0 })} KES (+${formatValue(overPct, { unit: '%', decimals: 1 })}).`,
    });
  } else if (overPct >= 12) {
    risks.push({
      severity: 'warning',
      title: 'Quote noticeably above benchmark',
      detail: `+${formatValue(overPct, { unit: '%', decimals: 1 })} over catalogue. Negotiate or request itemised justification.`,
    });
  } else if (overPct <= -10) {
    risks.push({
      severity: 'info',
      title: 'Quote suspiciously low',
      detail: `${formatValue(overPct, { unit: '%', decimals: 1 })} below catalogue — confirm documentation traceability and field condition before accepting.`,
    });
  }

  // 7. Budget vs. quote
  if (budgetKes > 0 && quoted > budgetKes * 1.05) {
    risks.push({
      severity: 'warning',
      title: 'Quote exceeds your budget',
      detail: `Quote ${formatValue(quoted, { decimals: 0 })} KES vs. budget ${formatValue(budgetKes, { decimals: 0 })} KES (+${formatValue(((quoted - budgetKes) / budgetKes) * 100, { unit: '%', decimals: 1 })}).`,
    });
  }

  // Compliance score: 100 minus weighted risks
  const weights = { danger: 25, warning: 12, info: 4, success: 0 };
  const compliance = Math.max(
    0,
    100 - risks.reduce((s, r) => s + weights[r.severity], 0),
  );

  // Verdict
  const verdict: 'works' | 'works-with-caveats' | 'will-not-work' =
    risks.some((r) => r.severity === 'danger')
      ? 'will-not-work'
      : risks.some((r) => r.severity === 'warning')
      ? 'works-with-caveats'
      : 'works';

  return {
    risks,
    quoted,
    catalogue,
    overPct,
    inverterContW,
    inverterStartW,
    pvDailyKwh,
    usableBatteryKwh,
    batteryRuntimeHrs,
    eveningKwh,
    compliance,
    verdict,
  };
}

/* ────────── 10-year lifecycle cost (transparent) ────────── */

interface LifecycleResult {
  capexKes: number;
  fuelKesPerYr: number;
  gridKesPerYr: number;
  batteryReplacementKes: number;
  total10yrKes: number;
  effectiveKesPerKwh: number;
  caption: string;
}

function lifecycle(
  sys: SystemSummary,
  appliance: ApplianceMath,
  capexKes: number,
  batteryLifeYears: number,
  fuelLitresPerYear: number,
): LifecycleResult {
  const annualKwh = appliance.totalDailyKwh * 365;
  const pvAnnual = sys.panelKwp * SOLAR_DAYTIME_HOURS * 365 * SYSTEM_DERATE;
  const fromGridKwh = Math.max(0, annualKwh - pvAnnual);
  const grid = fromGridKwh * GRID_TARIFF_KES_PER_KWH;
  const fuel = fuelLitresPerYear * FUEL_PRICE_KES_PER_LITRE;
  const batReplacements = Math.max(
    0,
    Math.floor(ANALYSIS_YEARS / batteryLifeYears) - 1,
  );
  const batReplacementCost = batReplacements *
    PRODUCT_LIBRARY
      .filter((p) => p.category === 'battery')
      .reduce((acc, p) => acc + (sys.batteryKwh > 0 && p.ratingValue >= sys.batteryKwh / 2 ? p.priceKes : 0), 0);
  const total = capexKes + (grid + fuel) * ANALYSIS_YEARS + batReplacementCost;
  const effectiveKesPerKwh = total / Math.max(annualKwh * ANALYSIS_YEARS, 1);
  return {
    capexKes,
    fuelKesPerYr: fuel,
    gridKesPerYr: grid,
    batteryReplacementKes: batReplacementCost,
    total10yrKes: total,
    effectiveKesPerKwh,
    caption: `Capex + ${ANALYSIS_YEARS} y of grid (${formatValue(GRID_TARIFF_KES_PER_KWH, { unit: 'KES/kWh' })}) + fuel (${formatValue(FUEL_PRICE_KES_PER_LITRE, { unit: 'KES/L' })}) + ${batReplacements} battery replacement(s).`,
  };
}

/* ────────── Default / sample inputs ────────── */

const DEFAULT_INPUT: VerifierInput = {
  appliances: [
    { templateId: 'led-lights', qty: 1 },
    { templateId: 'fridge',     qty: 1 },
    { templateId: 'router',     qty: 1 },
    { templateId: 'tv',         qty: 1 },
    { templateId: 'security',   qty: 1 },
    { templateId: 'borehole',   qty: 1 },
  ],
  quote: [
    { productId: 'inv-bud-3k', qty: 1, unitPriceKes: 58_000  },
    { productId: 'bat-bud-2k', qty: 1, unitPriceKes: 84_000  },
    { productId: 'pv-jinko',   qty: 4, unitPriceKes: 22_000  },
  ],
  budgetKes: 220_000,
};

/* ────────── Component ────────── */

export default function VerifierClient() {
  const { audience } = useHubAudience();
  const [input, setInput] = React.useState<VerifierInput>(DEFAULT_INPUT);

  const appliance = React.useMemo(() => computeAppliances(input.appliances), [input.appliances]);
  const sys = React.useMemo(() => summariseQuote(input.quote), [input.quote]);
  const result = React.useMemo(
    () => evaluate(appliance, sys, input.quote, input.budgetKes),
    [appliance, sys, input.quote, input.budgetKes],
  );

  // Three packages for comparison
  const cheaperSafe = React.useMemo(() => {
    const q: QuoteLine[] = [
      { productId: 'inv-bal-5k', qty: 1, unitPriceKes: PRODUCT_LIBRARY.find((p) => p.id === 'inv-bal-5k')!.priceKes },
      { productId: 'bat-bal-5k', qty: 2, unitPriceKes: PRODUCT_LIBRARY.find((p) => p.id === 'bat-bal-5k')!.priceKes },
      { productId: 'pv-jinko',   qty: 6, unitPriceKes: PRODUCT_LIBRARY.find((p) => p.id === 'pv-jinko')!.priceKes },
    ];
    const s = summariseQuote(q);
    const lc = lifecycle(s, appliance, q.reduce((a, l) => a + l.unitPriceKes * l.qty, 0), BATTERY_LIFE_YEARS_LI, 0);
    return { quote: q, sys: s, lifecycle: lc };
  }, [appliance]);

  const premium = React.useMemo(() => {
    const q: QuoteLine[] = [
      { productId: 'inv-prem-5k', qty: 1, unitPriceKes: PRODUCT_LIBRARY.find((p) => p.id === 'inv-prem-5k')!.priceKes },
      { productId: 'bat-prem-15', qty: 1, unitPriceKes: PRODUCT_LIBRARY.find((p) => p.id === 'bat-prem-15')!.priceKes },
      { productId: 'pv-canadian', qty: 6, unitPriceKes: PRODUCT_LIBRARY.find((p) => p.id === 'pv-canadian')!.priceKes },
    ];
    const s = summariseQuote(q);
    const lc = lifecycle(s, appliance, q.reduce((a, l) => a + l.unitPriceKes * l.qty, 0), BATTERY_LIFE_YEARS_LI, 0);
    return { quote: q, sys: s, lifecycle: lc };
  }, [appliance]);

  const yourLifecycle = React.useMemo(
    () =>
      lifecycle(
        sys,
        appliance,
        result.quoted,
        sys.hasBmsBattery ? BATTERY_LIFE_YEARS_LI : BATTERY_LIFE_YEARS_AGM,
        0,
      ),
    [sys, appliance, result.quoted],
  );

  const verdictKey: StatusKey =
    result.verdict === 'works'              ? 'success'
    : result.verdict === 'works-with-caveats' ? 'warning'
    : 'danger';

  return (
    <div className="space-y-6">
      {/* Verdict banner ─────────────────── */}
      <section
        className="relative overflow-hidden rounded-xl border bg-surface-base p-5 shadow-sm md:p-6"
        style={{ borderColor: 'var(--color-border-subtle)' }}
        aria-label="Verifier verdict"
      >
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-1"
          style={{ background: statusPalette(verdictKey).solid }}
        />
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
              Combination Verifier · result <SampleBadge />
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
              {result.verdict === 'works' && 'This combination works'}
              {result.verdict === 'works-with-caveats' && 'Works — with caveats'}
              {result.verdict === 'will-not-work' && 'This combination will NOT work as quoted'}
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-ink-secondary">
              {audience === 'client'
                ? 'Plain-language summary based on the products and loads you entered. Switch to Pro mode to see the engineering math.'
                : 'Engineering verdict from continuous + starting power, daily kWh, PV/battery balance and quote benchmark.'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <KpiBlock label="Compliance" value={result.compliance} unit="/100" sk={resolveStatus(result.compliance, { danger: 50, warning: 75, success: 90 })} />
            <KpiBlock label="Quote vs. catalogue" value={result.overPct} unit="%" sk={resolveStatus(result.overPct, { warning: 12, danger: 25, invert: true })} sign />
            <KpiBlock label="Daily demand" value={appliance.totalDailyKwh} unit="kWh" sk="info" />
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left: editor ─────────────────── */}
        <Card>
          <SectionHeading
            eyebrow="Step 1"
            title="Your loads"
            caption="Tick what the system must run, set quantities, and we read the rest from the appliance library."
          />
          <ul className="mb-4 space-y-1.5">
            {APPLIANCE_LIBRARY.map((a) => {
              const sel = input.appliances.find((x) => x.templateId === a.id);
              return (
                <li key={a.id} className="flex items-center gap-3 rounded-md border bg-surface-base px-2 py-1.5"
                    style={{ borderColor: 'var(--color-border-subtle)' }}>
                  <input
                    type="checkbox"
                    checked={!!sel}
                    onChange={(e) => {
                      setInput((prev) => ({
                        ...prev,
                        appliances: e.target.checked
                          ? [...prev.appliances, { templateId: a.id, qty: 1 }]
                          : prev.appliances.filter((x) => x.templateId !== a.id),
                      }));
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{a.label}</div>
                    <div className="text-[11px] text-ink-muted">
                      {formatValue(a.watts, { unit: 'W' })} · {formatValue(a.hoursPerDay, { unit: 'h/day' })}
                      {a.critical ? ' · critical' : ''}
                    </div>
                  </div>
                  {sel && (
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={sel.qty}
                      onChange={(e) => {
                        const n = Math.max(1, Number(e.target.value) || 1);
                        setInput((prev) => ({
                          ...prev,
                          appliances: prev.appliances.map((x) =>
                            x.templateId === a.id ? { ...x, qty: n } : x,
                          ),
                        }));
                      }}
                      className="w-16 rounded-md border px-2 py-1 text-sm tabular-nums"
                      style={{ borderColor: 'var(--color-border-subtle)' }}
                    />
                  )}
                </li>
              );
            })}
          </ul>

          <SectionHeading
            eyebrow="Step 2"
            title="Your quote"
            caption="Enter the line items the vendor proposed and the price they charged you."
          />
          <ul className="mb-3 space-y-2">
            {input.quote.map((l, idx) => {
              const p = PRODUCT_LIBRARY.find((x) => x.id === l.productId)!;
              return (
                <li key={idx} className="grid grid-cols-[1fr_70px_120px_28px] items-center gap-2 rounded-md border px-2 py-1.5"
                    style={{ borderColor: 'var(--color-border-subtle)' }}>
                  <select
                    value={l.productId}
                    onChange={(e) => {
                      const np = PRODUCT_LIBRARY.find((x) => x.id === e.target.value)!;
                      setInput((prev) => ({
                        ...prev,
                        quote: prev.quote.map((q, i) => i === idx ? { ...q, productId: np.id, unitPriceKes: np.priceKes } : q),
                      }));
                    }}
                    className="rounded-md border bg-surface-base px-2 py-1 text-sm"
                    style={{ borderColor: 'var(--color-border-subtle)' }}
                  >
                    {PRODUCT_LIBRARY.map((x) => (
                      <option key={x.id} value={x.id}>
                        [{x.category}] {x.brand} {x.model}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    value={l.qty}
                    onChange={(e) => {
                      const n = Math.max(1, Number(e.target.value) || 1);
                      setInput((prev) => ({
                        ...prev,
                        quote: prev.quote.map((q, i) => i === idx ? { ...q, qty: n } : q),
                      }));
                    }}
                    className="w-full rounded-md border px-2 py-1 text-sm tabular-nums"
                    style={{ borderColor: 'var(--color-border-subtle)' }}
                  />
                  <input
                    type="number"
                    min={0}
                    value={l.unitPriceKes}
                    onChange={(e) => {
                      const n = Math.max(0, Number(e.target.value) || 0);
                      setInput((prev) => ({
                        ...prev,
                        quote: prev.quote.map((q, i) => i === idx ? { ...q, unitPriceKes: n } : q),
                      }));
                    }}
                    className="w-full rounded-md border px-2 py-1 text-sm tabular-nums"
                    style={{ borderColor: 'var(--color-border-subtle)' }}
                  />
                  <button
                    type="button"
                    onClick={() => setInput((prev) => ({ ...prev, quote: prev.quote.filter((_, i) => i !== idx) }))}
                    aria-label="Remove line"
                    className="text-ink-muted hover:text-ink-primary"
                  >
                    ✕
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            onClick={() => setInput((prev) => ({
              ...prev,
              quote: [...prev.quote, { productId: PRODUCT_LIBRARY[0].id, qty: 1, unitPriceKes: PRODUCT_LIBRARY[0].priceKes }],
            }))}
            className="mb-4 rounded-md border px-3 py-1.5 text-xs font-semibold text-ink-secondary hover:bg-surface-sunken/60"
            style={{ borderColor: 'var(--color-border-subtle)' }}
          >
            + Add line
          </button>

          <SectionHeading eyebrow="Step 3" title="Your budget" />
          <label className="flex items-center gap-3 text-sm">
            <span className="w-32 text-ink-muted">Budget (KES)</span>
            <input
              type="number"
              min={0}
              step={5000}
              value={input.budgetKes}
              onChange={(e) => setInput((prev) => ({ ...prev, budgetKes: Number(e.target.value) || 0 }))}
              className="rounded-md border px-2 py-1.5 text-sm tabular-nums"
              style={{ borderColor: 'var(--color-border-subtle)' }}
            />
          </label>
        </Card>

        {/* Right: results ─────────────────── */}
        <div className="space-y-4">
          <Card>
            <SectionHeading eyebrow="Findings" title="Risks and missing items" caption="Highest severity first." />
            {result.risks.length === 0 ? (
              <p className="text-sm text-ink-muted">No risks detected with the current inputs. Re-verify after final SLD.</p>
            ) : (
              <ul className="space-y-2">
                {result.risks.map((r, i) => {
                  const p = statusPalette(r.severity);
                  return (
                    <li key={i} className="flex items-start gap-3 rounded-md border bg-surface-base p-3"
                        style={{ borderColor: p.border, background: p.bg }}>
                      <span aria-hidden className="mt-1 inline-block h-2.5 w-2.5 rounded-full" style={{ background: p.solid }} />
                      <div>
                        <div className="text-sm font-semibold" style={{ color: p.fg }}>{r.title}</div>
                        <div className="text-xs text-ink-secondary">{r.detail}</div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          <Card>
            <SectionHeading eyebrow="Capacity" title="Headroom & runtime" />
            <div className="space-y-3">
              <StatusBar
                label="Inverter continuous headroom"
                value={Math.max(0, result.inverterContW - appliance.totalContinuousW) / 1000}
                max={Math.max(2, result.inverterContW / 1000)}
                unit="kW"
                thresholds={{ danger: 0.2, warning: 0.5, success: 1 }}
              />
              <StatusBar
                label="Battery evening cover"
                value={result.usableBatteryKwh}
                max={Math.max(result.eveningKwh, 1)}
                unit="kWh"
                thresholds={{ danger: result.eveningKwh * 0.5, warning: result.eveningKwh * 0.85, success: result.eveningKwh }}
              />
              <StatusBar
                label="PV daily generation"
                value={result.pvDailyKwh}
                max={Math.max(appliance.totalDailyKwh, 1)}
                unit="kWh"
                thresholds={{ danger: appliance.totalDailyKwh * 0.4, warning: appliance.totalDailyKwh * 0.7, success: appliance.totalDailyKwh }}
              />
              <StatusBar
                label="Approx. battery runtime at full load"
                value={result.batteryRuntimeHrs}
                max={12}
                unit="h"
                thresholds={{ danger: 1, warning: 3, success: 6 }}
              />
            </div>
          </Card>

          <ProOnly note="Engineering math (continuous W, surge W, PV derate) — switch to Pro mode in the header to view.">
            <Card>
              <SectionHeading eyebrow="Pro · math" title="Transparent calculation" />
              <ul className="grid grid-cols-2 gap-2 text-xs">
                <ProLine label="Continuous load" v={appliance.totalContinuousW / 1000} u="kW" />
                <ProLine label="Critical load"   v={appliance.totalCriticalW / 1000}   u="kW" />
                <ProLine label="Largest surge"   v={appliance.largestStartingW / 1000} u="kW" />
                <ProLine label="Daily demand"    v={appliance.totalDailyKwh}            u="kWh" />
                <ProLine label="Inverter rated"  v={sys.inverterKva}                    u="kVA" />
                <ProLine label="Inverter cont."  v={result.inverterContW / 1000}        u="kW" />
                <ProLine label="Battery total"   v={sys.batteryKwh}                     u="kWh" />
                <ProLine label="Battery usable"  v={result.usableBatteryKwh}            u="kWh" />
                <ProLine label="PV array"        v={sys.panelKwp}                       u="kWp" />
                <ProLine label="PV daily"        v={result.pvDailyKwh}                  u="kWh" />
              </ul>
              <p className="mt-2 text-[11px] text-ink-muted">
                Constants: η<sub>inv</sub>={INVERTER_EFFICIENCY}, derate={SYSTEM_DERATE}, DoD={BATTERY_DOD_PCT} %,
                solar peak hours={SOLAR_DAYTIME_HOURS}.
              </p>
            </Card>
          </ProOnly>
        </div>
      </div>

      {/* Three-package comparison ───────────────── */}
      <Card>
        <SectionHeading
          eyebrow="Compare"
          title="Your quote vs. cheaper-but-safe vs. premium"
          caption={`10-year total cost using grid ${formatValue(GRID_TARIFF_KES_PER_KWH, { unit: 'KES/kWh' })} and battery life ${BATTERY_LIFE_YEARS_LI} y (Li-ion) / ${BATTERY_LIFE_YEARS_AGM} y (AGM).`}
        />
        <div className="grid gap-3 md:grid-cols-3">
          <PackageCard
            tier="Your quote"
            tag={result.verdict === 'works' ? 'OK' : result.verdict === 'works-with-caveats' ? 'Caveats' : 'Risky'}
            tagKey={verdictKey}
            sys={sys}
            lifecycle={yourLifecycle}
            highlight={false}
          />
          <PackageCard
            tier="Cheaper, safe alternative"
            tag="Balanced"
            tagKey="info"
            sys={cheaperSafe.sys}
            lifecycle={cheaperSafe.lifecycle}
            highlight
          />
          <PackageCard
            tier="Premium alternative"
            tag="Long life"
            tagKey="success"
            sys={premium.sys}
            lifecycle={premium.lifecycle}
            highlight={false}
          />
        </div>
      </Card>

      {/* Lifecycle chart ─────────────────── */}
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <SectionHeading eyebrow="Lifecycle" title={`Cumulative cost over ${ANALYSIS_YEARS} years`} caption="Capex + grid + battery replacements." />
          <SampleBadge />
        </div>
        <LockedChart
          type="line"
          title="Cumulative KES"
          unit="KES"
          decimals={0}
          labels={Array.from({ length: ANALYSIS_YEARS + 1 }, (_, y) => `Y${y}`)}
          series={[
            { label: 'Your quote',       data: cumulative(yourLifecycle) },
            { label: 'Cheaper safe',     data: cumulative(cheaperSafe.lifecycle) },
            { label: 'Premium',          data: cumulative(premium.lifecycle) },
          ]}
        />
      </Card>

      {/* Buyer education ─────────────────── */}
      <Card>
        <SectionHeading
          eyebrow="Buyer education"
          title="What to demand before signing"
          caption="Plain-language checks any buyer can use, even without an engineer present."
        />
        <ul className="grid gap-2 md:grid-cols-2">
          {[
            'Manufacturer name AND model number on every line. "Equivalent" is not a model.',
            'Warranty term in years AND who honours it (vendor or manufacturer).',
            'Battery technology stated (Li-ion / LiFePO4 / AGM) plus cycle life.',
            'Inverter surge rating in kVA for 5 s — not just continuous.',
            'BMS for any lithium battery. No BMS = unsafe.',
            'Single-line diagram + load schedule attached to the quote.',
            'Earthing scheme + SPD spec — life-safety items, never optional.',
            'Itemised labour and commissioning, not "as per site".',
          ].map((s) => (
            <li key={s} className="flex items-start gap-2 text-sm text-ink-secondary">
              <span aria-hidden className="mt-1 inline-block h-1.5 w-1.5 rounded-full" style={{ background: 'var(--color-brand-blue)' }} />
              {s}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-ink-muted">
          Need engineering depth? Run a full sizing in{' '}
          <Link href="/hub/simulator" className="text-ink-link">Smart Sizing</Link>, or audit the full quote in{' '}
          <Link href="/hub/quote-audit" className="text-ink-link">Quotation Audit</Link>.
        </p>
      </Card>

      <HubConnectStrip active="/hub/verifier" />
    </div>
  );
}

/* ────────── helpers / sub-components ────────── */

function cumulative(lc: LifecycleResult): number[] {
  const arr: number[] = [];
  let acc = lc.capexKes;
  arr.push(Math.round(acc));
  for (let y = 1; y <= ANALYSIS_YEARS; y++) {
    acc += lc.gridKesPerYr + lc.fuelKesPerYr;
    if (lc.batteryReplacementKes > 0 && y === Math.floor(ANALYSIS_YEARS / 2)) {
      acc += lc.batteryReplacementKes;
    }
    arr.push(Math.round(acc));
  }
  return arr;
}

function KpiBlock({
  label,
  value,
  unit,
  sk,
  sign = false,
}: {
  label: string;
  value: number;
  unit: string;
  sk: StatusKey;
  sign?: boolean;
}) {
  const p = statusPalette(sk);
  const display = sign && value > 0 ? `+${formatValue(value, { decimals: 1 })}` : formatValue(value, { decimals: 1 });
  return (
    <div className="text-right">
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">{label}</div>
      <div className="mt-0.5 text-xl font-bold tabular-nums" style={{ color: p.fg }}>
        {display}<span className="ml-1 text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>{unit}</span>
      </div>
    </div>
  );
}

function PackageCard({
  tier,
  tag,
  tagKey,
  sys,
  lifecycle: lc,
  highlight,
}: {
  tier: string;
  tag: string;
  tagKey: StatusKey;
  sys: SystemSummary;
  lifecycle: LifecycleResult;
  highlight: boolean;
}) {
  return (
    <div
      className="relative flex h-full flex-col rounded-lg border bg-surface-base p-4 shadow-sm"
      style={{
        borderColor: highlight ? 'var(--color-brand-blue)' : 'var(--color-border-subtle)',
        boxShadow: highlight ? '0 0 0 1px var(--color-brand-blue) inset' : undefined,
      }}
    >
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm font-semibold tracking-tight">{tier}</span>
        <span className={`status-chip status-chip--${tagKey}`}>{tag}</span>
      </div>
      <ul className="mb-3 space-y-0.5 text-xs text-ink-secondary">
        <li>Inverter: <strong>{formatValue(sys.inverterKva, { unit: 'kVA', decimals: 1 })}</strong></li>
        <li>Battery: <strong>{formatValue(sys.batteryKwh, { unit: 'kWh', decimals: 1 })}</strong>{sys.hasBmsBattery ? ' · BMS' : ' · no BMS'}</li>
        <li>PV: <strong>{formatValue(sys.panelKwp, { unit: 'kWp', decimals: 2 })}</strong></li>
      </ul>
      <div className="mt-auto border-t pt-2 text-xs" style={{ borderColor: 'var(--color-border-subtle)' }}>
        <div className="flex justify-between">
          <span className="text-ink-muted">Capex</span>
          <span className="font-semibold tabular-nums">{formatValue(lc.capexKes, { decimals: 0 })} KES</span>
        </div>
        <div className="flex justify-between">
          <span className="text-ink-muted">10-y total</span>
          <span className="font-semibold tabular-nums">{formatValue(lc.total10yrKes, { decimals: 0 })} KES</span>
        </div>
        <div className="flex justify-between">
          <span className="text-ink-muted">KES/kWh effective</span>
          <span className="font-semibold tabular-nums">{formatValue(lc.effectiveKesPerKwh, { decimals: 2 })}</span>
        </div>
      </div>
    </div>
  );
}

function ProLine({ label, v, u }: { label: string; v: number; u: string }) {
  return (
    <li className="flex items-baseline justify-between rounded border px-2 py-1"
        style={{ borderColor: 'var(--color-border-subtle)' }}>
      <span className="text-ink-muted">{label}</span>
      <span className="font-mono tabular-nums">{formatValue(v, { decimals: 2, unit: u })}</span>
    </li>
  );
}
