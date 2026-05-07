'use client';

import * as React from 'react';
import { Card, SectionHeading, SampleBadge, HubConnectStrip } from '@/components/hub/HubShell';
import {
  KPICard,
  StatusBar,
  formatValue,
  resolveStatus,
  statusPalette,
  type StatusKey,
} from '@/components/charts/dataviz';

/**
 * Product Intelligence Database — searchable catalogue.
 *
 * Status of stock, lead time and price drift uses the shared status logic.
 * All engineering values render with units.
 */

type Grade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

interface Product {
  sku: string;
  brand: string;
  category: 'Generator' | 'Solar' | 'UPS' | 'Cable' | 'Switchgear' | 'Battery' | 'Inverter' | 'Controller';
  name: string;
  ratingValue: number;
  ratingUnit: string;
  priceKes: number;
  stock: number;
  reorder: number;
  leadTimeDays: number;
  countryOrigin: string;
  tier: 'premium' | 'balanced' | 'budget';
  /** Internal platform suitability grade. NEVER a claim against a manufacturer.
   *  Reflects: suitability, documentation clarity, install compatibility,
   *  supportability, protection completeness, lifecycle value, integration confidence. */
  grade: Grade;
  useCase: string;
  protectionNote: string;
  lifecycleNote: string;
}

const SAMPLE_PRODUCTS: Product[] = [
  // ── Generators ──
  { sku: 'CUM-C250D5', brand: 'Cummins',  category: 'Generator', name: 'C250D5 Prime', ratingValue: 250, ratingUnit: 'kVA', priceKes: 4_950_000, stock: 3, reorder: 2, leadTimeDays: 21, countryOrigin: 'IN', tier: 'premium',  grade: 'A', useCase: 'Hospital / data hall standby + prime', protectionNote: 'AVR + electronic governor; auto-start ATS ready', lifecycleNote: 'Service kits + dealer network nationwide; 10-yr block life typical' },
  { sku: 'CUM-C500D5', brand: 'Cummins',  category: 'Generator', name: 'C500D5 Prime', ratingValue: 500, ratingUnit: 'kVA', priceKes: 9_120_000, stock: 1, reorder: 1, leadTimeDays: 35, countryOrigin: 'IN', tier: 'premium',  grade: 'A', useCase: 'Industrial site / large commercial standby', protectionNote: 'Engine-over-temp + oil-pressure shutdown; dual-bus capable', lifecycleNote: 'Major overhaul ~12,000 h; OEM parts continuity' },
  { sku: 'PER-1106A',  brand: 'Perkins',  category: 'Generator', name: '1106A-70TG1',  ratingValue: 150, ratingUnit: 'kVA', priceKes: 3_280_000, stock: 4, reorder: 2, leadTimeDays: 18, countryOrigin: 'GB', tier: 'balanced', grade: 'B', useCase: 'Mid-commercial standby / construction prime', protectionNote: 'Mechanical governor option; AVR included', lifecycleNote: 'Common parts; service intervals every 500 h' },
  { sku: 'FG-P165',    brand: 'FG Wilson', category: 'Generator', name: 'P165-3 Prime', ratingValue: 165, ratingUnit: 'kVA', priceKes: 3_650_000, stock: 2, reorder: 2, leadTimeDays: 24, countryOrigin: 'GB', tier: 'balanced', grade: 'B', useCase: 'Light-industrial standby + prime', protectionNote: 'PowerWizard controller; remote monitor option', lifecycleNote: 'Service every 500 h; consumables widely stocked' },
  { sku: 'KOH-KD550',  brand: 'Kohler',   category: 'Generator', name: 'KD550 Diesel', ratingValue: 550, ratingUnit: 'kVA', priceKes: 10_400_000, stock: 1, reorder: 1, leadTimeDays: 45, countryOrigin: 'FR', tier: 'premium',  grade: 'A', useCase: 'Mission-critical standby (telecoms, hospital)', protectionNote: 'Dual-bus parallel; arc-flash compliant cubicle option', lifecycleNote: 'Long-life block; structured maintenance contract recommended' },
  { sku: 'GEN-OEM50',  brand: 'Generic OEM', category: 'Generator', name: '50 kVA Open Set', ratingValue: 50, ratingUnit: 'kVA', priceKes: 690_000, stock: 8, reorder: 4, leadTimeDays: 14, countryOrigin: 'CN', tier: 'budget', grade: 'E', useCase: 'Light backup / non-critical loads only', protectionNote: 'Basic AVR; no auto-start; limited surge tolerance', lifecycleNote: 'Spares availability variable; 3–5 yr useful life under continuous duty' },

  // ── Solar PV modules ──
  { sku: 'JIN-T550',   brand: 'Jinko',    category: 'Solar',     name: 'Tiger Neo 550 W',     ratingValue: 550, ratingUnit: 'W',  priceKes:    18_500, stock: 220, reorder: 80, leadTimeDays: 14, countryOrigin: 'CN', tier: 'balanced', grade: 'B', useCase: 'Rooftop C&I + utility blocks', protectionNote: 'IEC 61215/61730 + IP68 J-box; salt-mist option', lifecycleNote: 'Linear performance warranty; 25-yr power output curve documented' },
  { sku: 'CAN-HK7-600',brand: 'Canadian Solar', category: 'Solar', name: 'HiKu7 600 W',       ratingValue: 600, ratingUnit: 'W',  priceKes:    21_000, stock: 140, reorder: 60, leadTimeDays: 18, countryOrigin: 'CN', tier: 'balanced', grade: 'B', useCase: 'Large rooftop & ground-mount C&I',           protectionNote: 'PID-resistant; bypass diodes per cell-string',           lifecycleNote: 'Bankable manufacturer; flash-test reports per pallet' },
  { sku: 'LON-HI590',  brand: 'LONGi',    category: 'Solar',     name: 'Hi-MO 6 590 W',       ratingValue: 590, ratingUnit: 'W',  priceKes:    20_400, stock: 180, reorder: 80, leadTimeDays: 16, countryOrigin: 'CN', tier: 'premium',  grade: 'A', useCase: 'High-yield commercial / residential premium',  protectionNote: 'HPBC cell tech; reduced shading sensitivity',          lifecycleNote: '30-yr linear power warranty option; strong bankability' },
  { sku: 'TRI-V650',   brand: 'Trina',    category: 'Solar',     name: 'Vertex 650 W',        ratingValue: 650, ratingUnit: 'W',  priceKes:    23_500, stock:  90, reorder: 40, leadTimeDays: 18, countryOrigin: 'CN', tier: 'balanced', grade: 'B', useCase: 'Utility-scale & large C&I',                    protectionNote: 'Multi-busbar; low operating temperature coeff',         lifecycleNote: 'Documented degradation 0.40 %/yr; 25-yr coverage' },
  { sku: 'JA-DS555',   brand: 'JA Solar', category: 'Solar',     name: 'DeepBlue 4.0X 555 W', ratingValue: 555, ratingUnit: 'W',  priceKes:    18_800, stock: 160, reorder: 70, leadTimeDays: 17, countryOrigin: 'CN', tier: 'balanced', grade: 'B', useCase: 'Mainstream rooftop C&I',                       protectionNote: 'PERC half-cell; n-type variant available',             lifecycleNote: 'Stable supply; partner network for warranty claims' },
  { sku: 'PV-OEM450',  brand: 'Generic OEM', category: 'Solar',  name: '450 W Mono PERC',     ratingValue: 450, ratingUnit: 'W',  priceKes:    11_000, stock: 240, reorder: 80, leadTimeDays: 21, countryOrigin: 'CN', tier: 'budget',   grade: 'E', useCase: 'Low-budget residential off-grid',              protectionNote: 'Documentation clarity needed; flash report not always supplied', lifecycleNote: 'Field verification recommended; warranty enforcement variable' },

  // ── Inverters & string inverters ──
  { sku: 'HUA-SUN10',  brand: 'Huawei',   category: 'Inverter',  name: 'SUN2000-10KTL',       ratingValue: 10,   ratingUnit: 'kW', priceKes:   168_000, stock: 6,  reorder: 4, leadTimeDays: 21, countryOrigin: 'CN', tier: 'premium',  grade: 'A', useCase: 'Hybrid PV + storage residential / small C&I',  protectionNote: 'Type-II SPD integrated; arc-fault detect option',        lifecycleNote: '10-yr standard warranty; OTA firmware updates' },
  { sku: 'SMA-STP25',  brand: 'SMA',      category: 'Inverter',  name: 'Sunny Tripower 25 kW',ratingValue: 25,   ratingUnit: 'kW', priceKes:   480_000, stock: 3,  reorder: 2, leadTimeDays: 28, countryOrigin: 'DE', tier: 'premium',  grade: 'A', useCase: 'Commercial PV string inverter',               protectionNote: 'Reactive power control + grid-code compliance',       lifecycleNote: 'EU manufacturer; documented 20-yr service path' },
  { sku: 'FRO-SYM15',  brand: 'Fronius',  category: 'Inverter',  name: 'Symo 15 kW',          ratingValue: 15,   ratingUnit: 'kW', priceKes:   320_000, stock: 4,  reorder: 2, leadTimeDays: 25, countryOrigin: 'AT', tier: 'premium',  grade: 'A', useCase: 'C&I rooftop, dual-MPPT', protectionNote: 'SuperFlex MPPT; dynamic peak manager',                       lifecycleNote: 'Solar.web monitoring lifetime included' },
  { sku: 'VIC-MP2-5',  brand: 'Victron',  category: 'Inverter',  name: 'MultiPlus-II 5 kVA',  ratingValue: 5,    ratingUnit: 'kVA',priceKes:   245_000, stock: 7,  reorder: 3, leadTimeDays: 18, countryOrigin: 'NL', tier: 'premium',  grade: 'A', useCase: 'Off-grid + ESS hybrid backup',                protectionNote: 'PowerAssist + UPS-class transfer ≤20 ms',                lifecycleNote: 'Open API + Cerbo GX integration; 5-yr warranty' },
  { sku: 'GRO-SPF5K',  brand: 'Growatt',  category: 'Inverter',  name: 'SPF 5000 ES',         ratingValue: 5,    ratingUnit: 'kVA',priceKes:    98_000, stock: 11, reorder: 5, leadTimeDays: 16, countryOrigin: 'CN', tier: 'balanced', grade: 'C', useCase: 'Residential off-grid / hybrid',               protectionNote: 'Built-in MPPT; basic SPD; manual transfer option',     lifecycleNote: 'Wide spares network; firmware updates via dongle' },
  { sku: 'INV-OEM3K',  brand: 'Generic OEM', category: 'Inverter', name: '3 kVA PWM Off-grid',ratingValue: 3,    ratingUnit: 'kVA',priceKes:    24_000, stock: 14, reorder: 6, leadTimeDays: 12, countryOrigin: 'CN', tier: 'budget',   grade: 'F', useCase: 'Very-light backup; documentation caution applies', protectionNote: 'Limited surge tolerance; warranty clarity needed',  lifecycleNote: 'Field verification recommended before commissioning critical loads' },

  // ── Deye hybrid inverters (Kenya market) ──
  { sku: 'DEYE-SUN3K',     brand: 'Deye', category: 'Inverter', name: 'SUN-3K-SG04LP1 Hybrid',          ratingValue: 3,    ratingUnit: 'kW',  priceKes:  78_000, stock: 8,  reorder: 4, leadTimeDays: 14, countryOrigin: 'CN', tier: 'balanced', grade: 'C', useCase: 'Small residential hybrid (single-phase)',           protectionNote: 'Built-in MPPT; AC + PV input; battery-ready',                  lifecycleNote: 'Wide Kenya dealer network; firmware updates via app' },
  { sku: 'DEYE-SUN36K',    brand: 'Deye', category: 'Inverter', name: 'SUN-3.6K-SG04LP1 Hybrid',        ratingValue: 3.6,  ratingUnit: 'kW',  priceKes:  88_000, stock: 6,  reorder: 3, leadTimeDays: 14, countryOrigin: 'CN', tier: 'balanced', grade: 'C', useCase: 'Compact residential hybrid backup',                 protectionNote: 'Dual-MPPT; CAN-bus battery handshake on supported BMS',         lifecycleNote: 'Common spares; cloud monitoring via Solarman' },
  { sku: 'DEYE-SUN5K',     brand: 'Deye', category: 'Inverter', name: 'SUN-5K-SG03LP1-EU Hybrid',       ratingValue: 5,    ratingUnit: 'kW',  priceKes: 115_000, stock: 9,  reorder: 4, leadTimeDays: 14, countryOrigin: 'CN', tier: 'balanced', grade: 'B', useCase: 'Mainstream Kenya residential hybrid',               protectionNote: 'Dual-MPPT; built-in AC bypass; LFP battery pairing recommended', lifecycleNote: 'Dealer network nationwide; documented BMS compatibility list' },
  { sku: 'DEYE-SUN6K',     brand: 'Deye', category: 'Inverter', name: 'SUN-6K-SG04LP1-EU Hybrid',       ratingValue: 6,    ratingUnit: 'kW',  priceKes: 138_000, stock: 7,  reorder: 3, leadTimeDays: 16, countryOrigin: 'CN', tier: 'balanced', grade: 'B', useCase: 'Mid-size residential / small commercial hybrid',    protectionNote: 'Parallel-capable up to 16 units; smart-load output port',       lifecycleNote: 'Spares + firmware support via authorised distributor' },
  { sku: 'DEYE-SUN8K',     brand: 'Deye', category: 'Inverter', name: 'SUN-8K-SG01LP1-EU Hybrid',       ratingValue: 8,    ratingUnit: 'kW',  priceKes: 168_000, stock: 5,  reorder: 3, leadTimeDays: 18, countryOrigin: 'CN', tier: 'balanced', grade: 'B', useCase: 'Large residential / SME hybrid',                    protectionNote: 'Dual-MPPT; generator input port; CT-based zero-export option',  lifecycleNote: 'Documented service path; widely deployed across East Africa' },
  { sku: 'DEYE-SUN12K',    brand: 'Deye', category: 'Inverter', name: 'SUN-12K-SG01LP1-EU Hybrid',      ratingValue: 12,   ratingUnit: 'kW',  priceKes: 245_000, stock: 4,  reorder: 2, leadTimeDays: 18, countryOrigin: 'CN', tier: 'balanced', grade: 'B', useCase: 'High-capacity single-phase hybrid',                 protectionNote: 'Dual-MPPT; UPS-class transfer to backup loads',                  lifecycleNote: 'Battery handshake list maintained by manufacturer' },
  { sku: 'DEYE-SUN12K-3P', brand: 'Deye', category: 'Inverter', name: 'SUN-12K-SG04LP3-EU 3-phase Hybrid',ratingValue: 12, ratingUnit: 'kW',  priceKes: 275_000, stock: 3,  reorder: 2, leadTimeDays: 21, countryOrigin: 'CN', tier: 'balanced', grade: 'B', useCase: 'Three-phase commercial hybrid',                     protectionNote: '3-phase balanced output; integrates with existing C&I switchgear',lifecycleNote: 'Compatibility caution: confirm BMS list before LFP pairing' },
  { sku: 'DEYE-SUN16K',    brand: 'Deye', category: 'Inverter', name: 'SUN-16K-SG01LP1 Hybrid',         ratingValue: 16,   ratingUnit: 'kW',  priceKes: 320_000, stock: 2,  reorder: 1, leadTimeDays: 24, countryOrigin: 'CN', tier: 'balanced', grade: 'B', useCase: 'Premium single-phase hybrid for large homes / SMEs', protectionNote: 'High continuous output; dual-MPPT; smart-load port',           lifecycleNote: 'Firmware OTA via Solarman; documented warranty path' },

  // ── TBB / RIIO inverters (Kenya market) ──
  { sku: 'TBB-RIIO-115K',  brand: 'TBB',  category: 'Inverter', name: 'RIIO SUN-11.5KVA/48V (250 V/100 A)',ratingValue: 11.5, ratingUnit: 'kVA', priceKes: 410_000, stock: 3, reorder: 2, leadTimeDays: 21, countryOrigin: 'CN', tier: 'balanced', grade: 'B', useCase: 'High-capacity single-phase hybrid (250 V PV / 100 A charger)', protectionNote: 'Wide PV voltage window; integrated 100 A solar charger',   lifecycleNote: 'Documentation clarity needed on battery-BMS list — verification recommended' },
  { sku: 'TBB-RIIO-118K',  brand: 'TBB',  category: 'Inverter', name: 'RIIO SUN-11.8 kVA/48 V Hybrid',  ratingValue: 11.8, ratingUnit: 'kVA', priceKes: 425_000, stock: 2, reorder: 1, leadTimeDays: 24, countryOrigin: 'CN', tier: 'balanced', grade: 'B', useCase: 'Large residential / SME hybrid backup',              protectionNote: 'Pure sine output; PV + grid + battery priority modes',          lifecycleNote: 'Traceability check recommended via authorised TBB partner' },
  { sku: 'TBB-RIIO-II-3K', brand: 'TBB',  category: 'Inverter', name: 'RIIO SUN II 3 kW 24 V Hybrid',   ratingValue: 3,    ratingUnit: 'kW',  priceKes:  85_000, stock: 6, reorder: 3, leadTimeDays: 18, countryOrigin: 'CN', tier: 'balanced', grade: 'C', useCase: 'Small residential 24 V hybrid',                     protectionNote: 'MPPT solar charger built-in; basic SPD',                       lifecycleNote: 'Spares via TBB partner network; firmware via USB' },
  { sku: 'TBB-RIIO-II-8K', brand: 'TBB',  category: 'Inverter', name: 'RIIO SUN II 8 kVA Hybrid',       ratingValue: 8,    ratingUnit: 'kVA', priceKes: 235_000, stock: 4, reorder: 2, leadTimeDays: 21, countryOrigin: 'CN', tier: 'balanced', grade: 'B', useCase: 'Mid-commercial hybrid backup',                       protectionNote: 'Dual-MPPT; parallel-capable; AC bypass',                       lifecycleNote: 'Authorised partner support recommended for warranty enforcement' },

  // ── Batteries ──
  { sku: 'BYD-LV15',   brand: 'BYD',      category: 'Battery',   name: 'B-Box LV 15.4',       ratingValue: 15.4, ratingUnit: 'kWh',priceKes:   285_000, stock: 9,  reorder: 4, leadTimeDays: 28, countryOrigin: 'CN', tier: 'balanced', grade: 'B', useCase: 'Residential / small commercial ESS',          protectionNote: 'LFP chemistry + integrated BMS; partner-only commissioning',  lifecycleNote: '6,000 cycles to 80 % SoH; 10-yr warranty' },
  { sku: 'PYL-US3KC',  brand: 'Pylontech',category: 'Battery',   name: 'US3000C 3.5 kWh',     ratingValue: 3.5,  ratingUnit: 'kWh',priceKes:   145_000, stock: 22, reorder: 8, leadTimeDays: 18, countryOrigin: 'CN', tier: 'balanced', grade: 'B', useCase: 'Modular residential storage',                 protectionNote: 'BMS handshake required with inverter family',         lifecycleNote: 'Modular stacking up to 8 units; documented cycle profile' },
  { sku: 'TES-PW3',    brand: 'Tesla',    category: 'Battery',   name: 'Powerwall 3 13.5 kWh',ratingValue: 13.5, ratingUnit: 'kWh',priceKes: 1_180_000, stock: 1,  reorder: 1, leadTimeDays: 60, countryOrigin: 'US', tier: 'premium',  grade: 'A', useCase: 'Premium residential / small C&I',             protectionNote: 'Integrated hybrid inverter; whole-home backup capable', lifecycleNote: '10-yr unlimited cycle warranty; certified installer required' },
  { sku: 'LG-RES10',   brand: 'LG Energy',category: 'Battery',   name: 'RESU10H Prime',       ratingValue: 9.6,  ratingUnit: 'kWh',priceKes:   620_000, stock: 2,  reorder: 1, leadTimeDays: 45, countryOrigin: 'KR', tier: 'premium',  grade: 'B', useCase: 'High-voltage residential ESS',                protectionNote: 'NMC chemistry; thermal management included',          lifecycleNote: 'Compatibility caution: confirm inverter handshake list' },
  { sku: 'NRT-LFP200', brand: 'Narada',   category: 'Battery',   name: '48V 200 Ah LFP Rack', ratingValue: 9.6,  ratingUnit: 'kWh',priceKes:   195_000, stock: 6,  reorder: 3, leadTimeDays: 24, countryOrigin: 'CN', tier: 'balanced', grade: 'C', useCase: 'Telecom / commercial backup rack',            protectionNote: 'CAN-bus BMS; over-temp + over-discharge protection',  lifecycleNote: '4,500 cycles @ 80 % DoD documented' },
  { sku: 'AGM-OEM200', brand: 'Generic AGM', category: 'Battery', name: '200 Ah AGM 12 V',    ratingValue: 2.4,  ratingUnit: 'kWh',priceKes:    42_000, stock: 18, reorder: 8, leadTimeDays: 7,  countryOrigin: 'CN', tier: 'budget',   grade: 'E', useCase: 'Light backup; non-critical loads',            protectionNote: 'No BMS; integration caution for lithium-style charge profiles', lifecycleNote: '300–500 cycles typical; halved life if over-discharged' },
  { sku: 'BAT-OEMLI',  brand: 'Generic OEM', category: 'Battery', name: '100 Ah LiFePO4 12 V',ratingValue: 1.28, ratingUnit: 'kWh',priceKes:    35_000, stock: 12, reorder: 6, leadTimeDays: 21, countryOrigin: 'CN', tier: 'budget',   grade: 'F', useCase: 'Low-cost off-grid / hobbyist',                protectionNote: 'Documentation mismatch risk on cycle-life claims',     lifecycleNote: 'Field verification recommended; warranty clarity needed' },

  // ── Chloride / Exide / extended battery line (Kenya market) ──
  { sku: 'CHL-LFP-1024', brand: 'Chloride', category: 'Battery', name: 'Chloride Lithium 10.24 kWh', ratingValue: 10.24, ratingUnit: 'kWh', priceKes: 410_000, stock: 5, reorder: 2, leadTimeDays: 21, countryOrigin: 'ZA', tier: 'balanced', grade: 'B', useCase: 'Residential / small commercial ESS — high-capacity wall mount', protectionNote: 'LFP chemistry; integrated BMS; CAN-bus / RS485 communication', lifecycleNote: 'Regional support via Chloride Exide network; documented cycle profile' },
  { sku: 'CHL-LFP-51',   brand: 'Chloride', category: 'Battery', name: 'Chloride Lithium 5.1 kWh',   ratingValue: 5.1,   ratingUnit: 'kWh', priceKes: 225_000, stock: 9, reorder: 4, leadTimeDays: 18, countryOrigin: 'ZA', tier: 'balanced', grade: 'B', useCase: 'Residential ESS — modular stacking',                            protectionNote: 'LFP chemistry; integrated BMS; modular up to multiple units',  lifecycleNote: 'Regional warranty path; compatibility caution: confirm inverter handshake list' },
  { sku: 'EXD-PS-2V100', brand: 'PowerSafe Exide', category: 'Battery', name: 'PowerSafe 2 V / 100 Ah VRLA', ratingValue: 0.2, ratingUnit: 'kWh', priceKes: 18_500, stock: 24, reorder: 8, leadTimeDays: 14, countryOrigin: 'IN', tier: 'balanced', grade: 'B', useCase: 'Telecom / utility 2 V cell — series-string DC plant',         protectionNote: 'AGM VRLA; gas-recombination; designed for float operation',     lifecycleNote: '10–12 yr design life @ 25 °C; structured maintenance recommended' },
  { sku: 'BAT-LI-12V200',brand: 'Generic Lithium', category: 'Battery', name: '12 V / 200 Ah LiFePO4 (2.56 kWh)', ratingValue: 2.56, ratingUnit: 'kWh', priceKes: 58_000, stock: 14, reorder: 6, leadTimeDays: 14, countryOrigin: 'CN', tier: 'balanced', grade: 'C', useCase: 'Small off-grid / RV / light backup',                          protectionNote: 'Built-in BMS; over-current + over-temp protection',             lifecycleNote: 'Traceability check recommended — supplier-grade BMS varies' },

  // ── UPS ──
  { sku: 'EAT-9PX6K',  brand: 'Eaton',    category: 'UPS',       name: '9PX 6 kVA',           ratingValue: 6,    ratingUnit: 'kVA',priceKes:   295_000, stock: 5,  reorder: 3, leadTimeDays: 12, countryOrigin: 'US', tier: 'premium',  grade: 'A', useCase: 'Server room / small data hall',               protectionNote: 'Online double-conversion; 0 ms transfer',             lifecycleNote: 'EBM upgradeable; service contract widely available' },
  { sku: 'APC-SRT10K', brand: 'APC',      category: 'UPS',       name: 'Smart-UPS SRT 10 kVA',ratingValue: 10,   ratingUnit: 'kVA',priceKes:   612_000, stock: 0,  reorder: 2, leadTimeDays: 30, countryOrigin: 'US', tier: 'premium',  grade: 'A', useCase: 'Critical IT infrastructure',                  protectionNote: 'Online + extended runtime modules',                   lifecycleNote: '8–10-yr service path; battery cartridge programme' },
  { sku: 'VRT-LBA20',  brand: 'Vertiv',   category: 'UPS',       name: 'Liebert APM 20 kVA',  ratingValue: 20,   ratingUnit: 'kVA',priceKes: 1_220_000, stock: 1,  reorder: 1, leadTimeDays: 40, countryOrigin: 'CN', tier: 'premium',  grade: 'A', useCase: 'Modular data-centre UPS',                     protectionNote: 'Hot-swap modules; N+1 redundancy at module level',    lifecycleNote: 'Modular service; uptime SLA contracts standard' },
  { sku: 'RIE-EXC15',  brand: 'Riello',   category: 'UPS',       name: 'Multi Sentry MST 15', ratingValue: 15,   ratingUnit: 'kVA',priceKes:   790_000, stock: 2,  reorder: 1, leadTimeDays: 32, countryOrigin: 'IT', tier: 'premium',  grade: 'B', useCase: 'Industrial / commercial double-conversion',  protectionNote: 'IGBT rectifier; galvanic isolation option',           lifecycleNote: 'EU manufacturer; documented 15-yr service path' },
  { sku: 'CYB-OL3000', brand: 'CyberPower', category: 'UPS',     name: 'OL3000ERT2U 3 kVA',   ratingValue: 3,    ratingUnit: 'kVA',priceKes:   135_000, stock: 6,  reorder: 3, leadTimeDays: 14, countryOrigin: 'TW', tier: 'balanced', grade: 'C', useCase: 'Workstation / network closet',               protectionNote: 'Online double-conversion; SNMP card option',          lifecycleNote: '3-yr standard warranty + EBM option' },
  { sku: 'UPS-OEM2K',  brand: 'Generic OEM', category: 'UPS',    name: '2 kVA Line-Interactive',ratingValue: 2,  ratingUnit: 'kVA',priceKes:    18_000, stock: 16, reorder: 6, leadTimeDays: 9,  countryOrigin: 'CN', tier: 'budget',   grade: 'F', useCase: 'Light desktop backup only',                   protectionNote: 'Limited transfer time; no isolation; warranty clarity needed', lifecycleNote: 'Field verification recommended for critical use' },

  // ── Extended UPS coverage (Kenya market — server room → data hall) ──
  { sku: 'EAT-9SX3K',  brand: 'Eaton',      category: 'UPS', name: '9SX 3 kVA Online',          ratingValue: 3,   ratingUnit: 'kVA', priceKes: 145_000, stock: 7, reorder: 3, leadTimeDays: 12, countryOrigin: 'CH', tier: 'premium',  grade: 'A', useCase: 'Network closet / small server stack',          protectionNote: 'Online double-conversion; LCD monitoring',                lifecycleNote: 'EBM upgradeable; spare batteries widely stocked' },
  { sku: 'APC-SMT3K',  brand: 'APC',        category: 'UPS', name: 'Smart-UPS SMT3000RMI2U',    ratingValue: 3,   ratingUnit: 'kVA', priceKes: 165_000, stock: 8, reorder: 4, leadTimeDays: 10, countryOrigin: 'PH', tier: 'premium',  grade: 'A', useCase: 'Rack-mount line-interactive for IT racks',     protectionNote: 'Sine-wave output; SmartConnect cloud monitoring',         lifecycleNote: '3-yr standard warranty; battery cartridge programme' },
  { sku: 'VRT-LIE-1K', brand: 'Vertiv',     category: 'UPS', name: 'Liebert GXT5 1 kVA',        ratingValue: 1,   ratingUnit: 'kVA', priceKes:  72_000, stock: 12,reorder: 6, leadTimeDays: 14, countryOrigin: 'CN', tier: 'balanced', grade: 'B', useCase: 'Edge / small server backup',                   protectionNote: 'Online double-conversion; SNMP card option',              lifecycleNote: 'Documented service path via Vertiv partner' },
  { sku: 'SCH-EASY3K', brand: 'Schneider',  category: 'UPS', name: 'Easy UPS SRV3KI 3 kVA',     ratingValue: 3,   ratingUnit: 'kVA', priceKes: 132_000, stock: 6, reorder: 3, leadTimeDays: 14, countryOrigin: 'CN', tier: 'balanced', grade: 'B', useCase: 'Small business / branch IT',                   protectionNote: 'Online; user-replaceable batteries',                      lifecycleNote: '2-yr standard warranty; widely available in Kenya' },
  { sku: 'HUA-UPS5K',  brand: 'Huawei',     category: 'UPS', name: 'UPS2000-G 5 kVA',           ratingValue: 5,   ratingUnit: 'kVA', priceKes: 185_000, stock: 4, reorder: 2, leadTimeDays: 18, countryOrigin: 'CN', tier: 'balanced', grade: 'B', useCase: 'Small-medium server room',                     protectionNote: 'Online; tower form-factor; ECO mode option',              lifecycleNote: 'Spares via Huawei enterprise channel' },
  { sku: 'DEL-AMP30',  brand: 'Delta',      category: 'UPS', name: 'Amplon RT-30 30 kVA',       ratingValue: 30,  ratingUnit: 'kVA', priceKes: 1_580_000, stock: 1, reorder: 1, leadTimeDays: 35, countryOrigin: 'TW', tier: 'premium', grade: 'A', useCase: 'Mid-size data hall / hospital',                protectionNote: 'Online double-conversion; high efficiency in ECO mode',   lifecycleNote: 'EU-grade engineering; structured service contract' },
  { sku: 'SOC-ITY40',  brand: 'Socomec',    category: 'UPS', name: 'ITYS 40 kVA',               ratingValue: 40,  ratingUnit: 'kVA', priceKes: 2_120_000, stock: 1, reorder: 1, leadTimeDays: 40, countryOrigin: 'FR', tier: 'premium', grade: 'A', useCase: 'Industrial / data-centre online UPS',          protectionNote: 'IGBT rectifier; galvanic isolation option',               lifecycleNote: 'EU manufacturer; documented 15-yr service path' },

  // ── Cables & switchgear ──
  { sku: 'CU-95XLPE',  brand: 'East African Cables', category: 'Cable',  name: '4×95 mm² Cu XLPE', ratingValue: 95,  ratingUnit: 'mm²', priceKes: 17_200, stock: 480, reorder: 200, leadTimeDays: 7,  countryOrigin: 'KE', tier: 'budget',   grade: 'B', useCase: 'Sub-main feeder / DB inter-tie',              protectionNote: 'XLPE/PVC armoured; KEBS marked',                       lifecycleNote: '30+ yr life if installed within bend radius' },
  { sku: 'CU-50XLPE',  brand: 'Metsec',   category: 'Cable',     name: '4×50 mm² Cu XLPE',     ratingValue: 50,  ratingUnit: 'mm²', priceKes: 11_400, stock: 360, reorder: 150, leadTimeDays: 7,  countryOrigin: 'KE', tier: 'balanced', grade: 'B', useCase: 'Sub-circuit feeder',                          protectionNote: 'XLPE armoured; voltage drop documented per length',   lifecycleNote: '25-yr life with correct gland kit' },
  { sku: 'CU-DC10',    brand: 'Lapp',     category: 'Cable',     name: '6 mm² PV Solar DC',    ratingValue: 6,   ratingUnit: 'mm²', priceKes:    420, stock: 1800,reorder: 500, leadTimeDays: 10, countryOrigin: 'DE', tier: 'premium',  grade: 'A', useCase: 'PV string DC / battery interconnect',         protectionNote: 'TÜV ÖLFLEX SOLAR; UV + ozone resistant',              lifecycleNote: '25-yr UV warranty; salt-mist verified' },
  { sku: 'SCH-NSX400', brand: 'Schneider', category: 'Switchgear', name: 'Compact NSX400 4P', ratingValue: 400, ratingUnit: 'A',  priceKes:  92_000, stock: 12, reorder: 4, leadTimeDays: 10, countryOrigin: 'FR', tier: 'balanced', grade: 'A', useCase: 'Main / sub-main MCCB feeder',                 protectionNote: 'Micrologic trip; arc-flash assessment compatible',     lifecycleNote: '15,000 mech ops; spares well-stocked' },
  { sku: 'ABB-T5N400', brand: 'ABB',      category: 'Switchgear', name: 'Tmax T5N 400 A',     ratingValue: 400, ratingUnit: 'A',  priceKes:  88_000, stock: 9,  reorder: 4, leadTimeDays: 12, countryOrigin: 'IT', tier: 'balanced', grade: 'A', useCase: 'MCCB main isolator',                          protectionNote: 'Selectivity tables published; PR221 trip',            lifecycleNote: '10,000 mech ops; modular accessories' },
  { sku: 'SCH-IC60H',  brand: 'Schneider', category: 'Switchgear', name: 'Acti9 iC60H 32 A 1P', ratingValue: 32, ratingUnit: 'A',  priceKes:   3_200, stock: 320, reorder: 80,  leadTimeDays: 7, countryOrigin: 'FR', tier: 'balanced', grade: 'B', useCase: 'Final-circuit MCB',                           protectionNote: 'C-curve standard; 10 kA breaking capacity',           lifecycleNote: '20,000 mech ops; long supply continuity' },

  // ── Charge controllers ──
  { sku: 'VIC-SC150',  brand: 'Victron',  category: 'Controller', name: 'SmartSolar MPPT 150/70', ratingValue: 70,  ratingUnit: 'A', priceKes:  82_000, stock: 8,  reorder: 3, leadTimeDays: 18, countryOrigin: 'NL', tier: 'premium',  grade: 'A', useCase: 'PV charge controller for off-grid + ESS',     protectionNote: 'Integrated battery temp probe + remote sense',         lifecycleNote: 'VictronConnect monitoring lifetime; 5-yr warranty' },
  { sku: 'EPS-XTRA',   brand: 'EPEVER',   category: 'Controller', name: 'XTRA 4415N 40 A',       ratingValue: 40,  ratingUnit: 'A', priceKes:   24_000, stock: 14, reorder: 6, leadTimeDays: 14, countryOrigin: 'CN', tier: 'balanced', grade: 'C', useCase: 'Mid-range MPPT charge controller',            protectionNote: 'Standard MPPT; documented derate above 50 °C',         lifecycleNote: 'Spares available; 2-yr warranty' },
];

function tierChipClass(t: Product['tier']) {
  return t === 'premium' ? 'status-chip--success'
       : t === 'balanced' ? 'status-chip--info'
       : 'status-chip--warning';
}

function stockStatus(p: Product): StatusKey {
  if (p.stock === 0) return 'danger';
  if (p.stock <= p.reorder) return 'warning';
  if (p.stock >= p.reorder * 3) return 'success';
  return 'info';
}

function leadStatus(days: number): StatusKey {
  return resolveStatus(days, { warning: 21, danger: 35, invert: true });
}

const CATEGORIES = ['All', 'Generator', 'Solar', 'Inverter', 'UPS', 'Battery', 'Controller', 'Cable', 'Switchgear'] as const;

/** Visual palette for the internal A–G suitability grade.
 *  This is a platform-internal rating, NOT a defamatory claim. */
const GRADE_PALETTE: Record<Grade, { bg: string; fg: string; border: string; label: string }> = {
  A: { bg: 'rgba(34,197,94,0.14)',  fg: '#0e7c3a', border: 'rgba(34,197,94,0.45)',  label: 'Reference' },
  B: { bg: 'rgba(59,130,246,0.14)', fg: '#1d4ed8', border: 'rgba(59,130,246,0.45)', label: 'Strong'    },
  C: { bg: 'rgba(14,165,233,0.14)', fg: '#0c6e91', border: 'rgba(14,165,233,0.45)', label: 'Solid'     },
  D: { bg: 'rgba(234,179,8,0.16)',  fg: '#92660a', border: 'rgba(234,179,8,0.50)',  label: 'Acceptable'},
  E: { bg: 'rgba(249,115,22,0.16)', fg: '#9a4112', border: 'rgba(249,115,22,0.50)', label: 'Caution'   },
  F: { bg: 'rgba(239,68,68,0.16)',  fg: '#991b1b', border: 'rgba(239,68,68,0.50)',  label: 'Verify'    },
  G: { bg: 'rgba(120,113,108,0.18)',fg: '#3f3f46', border: 'rgba(120,113,108,0.50)',label: 'Not advised'},
};

function GradePill({ g }: { g: Grade }) {
  const p = GRADE_PALETTE[g];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-bold tracking-wider"
      style={{ background: p.bg, color: p.fg, border: `1px solid ${p.border}` }}
      title={`Grade ${g} — ${p.label}`}
    >
      <span>{g}</span>
      <span className="opacity-75 font-medium">{p.label}</span>
    </span>
  );
}

export default function ProductIntelligenceClient() {
  const [query, setQuery] = React.useState('');
  const [cat, setCat] = React.useState<(typeof CATEGORIES)[number]>('All');
  const [selected, setSelected] = React.useState<Product | null>(null);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return SAMPLE_PRODUCTS.filter(p => {
      if (cat !== 'All' && p.category !== cat) return false;
      if (!q) return true;
      return [p.sku, p.brand, p.name, p.category].some(s => s.toLowerCase().includes(q));
    });
  }, [query, cat]);

  const totalSkus = SAMPLE_PRODUCTS.length;
  const oos = SAMPLE_PRODUCTS.filter(p => p.stock === 0).length;
  const lowStock = SAMPLE_PRODUCTS.filter(p => p.stock > 0 && p.stock <= p.reorder).length;
  const avgLead = SAMPLE_PRODUCTS.reduce((s, p) => s + p.leadTimeDays, 0) / totalSkus;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-4">
        <KPICard label="Total SKUs"        value={totalSkus} unit="" caption="Sample subset" />
        <KPICard label="Out of stock"      value={oos} unit="" thresholds={{ warning: 1, danger: 3, invert: true }} />
        <KPICard label="At/under reorder"  value={lowStock} unit="" thresholds={{ warning: 1, danger: 3, invert: true }} />
        <KPICard label="Average lead time" value={avgLead} unit="days" decimals={1} thresholds={{ warning: 18, danger: 28, invert: true }} />
      </div>

      {/* A–G Suitability Grading legend.
          Platform-internal rating across 7 axes — NOT a claim against any
          manufacturer. Surfaces what "Grade X" means before the catalogue. */}
      <div
        className="rounded-lg border p-4"
        style={{
          borderColor: 'var(--color-border-subtle)',
          background: 'linear-gradient(135deg, rgba(0,113,227,0.06), rgba(76,210,238,0.04) 60%, rgba(201,166,74,0.05))',
        }}
        aria-label="Suitability grading legend"
      >
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Internal grading</div>
            <h3 className="mt-0.5 text-base font-semibold tracking-tight">A–G suitability grade</h3>
            <p className="mt-1 text-xs text-ink-secondary">
              Platform-internal score across seven axes: <strong>suitability</strong>, <strong>documentation clarity</strong>,{' '}
              <strong>install compatibility</strong>, <strong>supportability</strong>, <strong>protection completeness</strong>,{' '}
              <strong>lifecycle value</strong>, <strong>integration confidence</strong>. It rates how the product behaves inside our
              workflow — it is not a claim about the manufacturer or the brand.
            </p>
          </div>
          <SampleBadge />
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {(['A','B','C','D','E','F','G'] as Grade[]).map((g) => <GradePill key={g} g={g} />)}
        </div>
      </div>

      {/* Trust strip — surface the authenticity workflow on the index so
          first-time visitors see how every product is verified, not only
          after they click into a SKU. */}
      <div
        className="rounded-lg border bg-surface-base p-4 shadow-sm"
        style={{ borderColor: 'var(--color-border-subtle)', borderLeft: '3px solid var(--color-brand-blue)' }}
        aria-label="Product authenticity"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
              Authenticity
            </div>
            <h3 className="mt-0.5 text-base font-semibold tracking-tight">
              Every SKU passes a 6-step pre-handover authenticity workflow
            </h3>
          </div>
          <span className="text-xs text-ink-muted">Open any product to see the full checklist.</span>
        </div>
        <ul className="mt-3 grid gap-1.5 md:grid-cols-3">
          {[
            'Manufacturer seal intact',
            'Tamper labels verified',
            'Authorised dealer confirmed',
            'Photo evidence captured',
            'System labelling printed',
            'Warranty record filed',
          ].map((s) => (
            <li key={s} className="flex items-center gap-2 text-xs text-ink-secondary">
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: 'var(--color-brand-blue)' }}
              />
              {s}
            </li>
          ))}
        </ul>
      </div>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <SectionHeading eyebrow="Catalogue" title="Searchable index" />
          <SampleBadge />
        </div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search SKU, brand, name…"
            className="w-full max-w-xs rounded-md border bg-surface-base px-3 py-2 text-sm focus:outline-none focus:ring-2 md:w-72"
            style={{
              borderColor: 'var(--color-border-subtle)',
              // @ts-expect-error custom prop
              '--tw-ring-color': 'var(--color-brand-blue)',
            }}
          />
          <div className="inline-flex flex-wrap gap-1">
            {CATEGORIES.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                  cat === c ? 'bg-surface-sunken text-ink-primary' : 'text-ink-secondary hover:bg-surface-sunken/60'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-wider text-ink-muted">
                <th className="px-2 py-2">SKU</th>
                <th className="px-2 py-2">Product</th>
                <th className="px-2 py-2">Category</th>
                <th className="px-2 py-2">Grade</th>
                <th className="px-2 py-2 text-right">Rating</th>
                <th className="px-2 py-2 text-right">Price (KES)</th>
                <th className="px-2 py-2 text-right">Stock</th>
                <th className="px-2 py-2 text-right">Lead time</th>
                <th className="px-2 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const sk = stockStatus(p);
                const lk = leadStatus(p.leadTimeDays);
                return (
                  <tr
                    key={p.sku}
                    className="border-t hover:bg-surface-sunken/40 cursor-pointer"
                    style={{ borderColor: 'var(--color-border-subtle)' }}
                    onClick={() => setSelected(p)}
                  >
                    <td className="px-2 py-2 font-mono text-xs">{p.sku}</td>
                    <td className="px-2 py-2">
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-ink-muted">{p.brand} · {p.countryOrigin}</div>
                    </td>
                    <td className="px-2 py-2 text-ink-secondary">
                      <div>{p.category}</div>
                      <div><span className={`status-chip ${tierChipClass(p.tier)} mt-1`}>{p.tier}</span></div>
                    </td>
                    <td className="px-2 py-2"><GradePill g={p.grade} /></td>
                    <td className="px-2 py-2 text-right tabular-nums">
                      {formatValue(p.ratingValue, { unit: p.ratingUnit })}
                    </td>
                    <td className="px-2 py-2 text-right tabular-nums">{formatValue(p.priceKes, { decimals: 0 })}</td>
                    <td className="px-2 py-2 text-right">
                      <span className={`status-chip status-chip--${sk}`}>
                        {p.stock === 0 ? 'OOS' : `${p.stock} in stock`}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-right">
                      <span className={`status-chip status-chip--${lk}`}>
                        {formatValue(p.leadTimeDays, { unit: 'days' })}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-right text-ink-link">→</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-2 py-6 text-center text-ink-muted">No products match the filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selected ? (
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <SectionHeading
              eyebrow={selected.category}
              title={`${selected.brand} ${selected.name}`}
              caption={`SKU ${selected.sku} · origin ${selected.countryOrigin}`}
            />
            <div className="flex items-center gap-2">
              <GradePill g={selected.grade} />
              <span className={`status-chip ${tierChipClass(selected.tier)}`}>{selected.tier}</span>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-sm text-ink-link"
              >
                Close
              </button>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <KPICard
              label="Rating"
              value={selected.ratingValue}
              unit={selected.ratingUnit}
              decimals={selected.ratingValue < 10 ? 2 : 0}
            />
            <KPICard
              label="List price"
              value={selected.priceKes}
              unit=""
              decimals={0}
              caption="KES"
            />
            <KPICard
              label="Lead time"
              value={selected.leadTimeDays}
              unit="days"
              status={leadStatus(selected.leadTimeDays)}
            />
          </div>

          {/* Product context — use-case, protection, lifecycle. */}
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-md border bg-surface-base p-3 text-sm" style={{ borderColor: 'var(--color-border-subtle)' }}>
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Use case</div>
              <div className="mt-1 text-ink-secondary">{selected.useCase}</div>
            </div>
            <div className="rounded-md border bg-surface-base p-3 text-sm" style={{ borderColor: 'var(--color-border-subtle)' }}>
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Protection / compatibility</div>
              <div className="mt-1 text-ink-secondary">{selected.protectionNote}</div>
            </div>
            <div className="rounded-md border bg-surface-base p-3 text-sm" style={{ borderColor: 'var(--color-border-subtle)' }}>
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Lifecycle / value</div>
              <div className="mt-1 text-ink-secondary">{selected.lifecycleNote}</div>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <StatusBar
              label="Stock vs. reorder point"
              value={selected.stock}
              max={Math.max(selected.reorder * 4, selected.stock + 1)}
              unit="units"
              status={stockStatus(selected)}
            />
            <div
              className="rounded-md border p-3 text-sm"
              style={{
                borderColor: statusPalette(stockStatus(selected)).border,
                background: statusPalette(stockStatus(selected)).bg,
                color: statusPalette(stockStatus(selected)).fg,
              }}
            >
              <strong>Procurement note:</strong>{' '}
              {selected.stock === 0
                ? `Out of stock. Trigger PO; ${formatValue(selected.leadTimeDays, { unit: 'days' })} lead.`
                : selected.stock <= selected.reorder
                ? `At/under reorder of ${formatValue(selected.reorder, { unit: 'units' })}. Replenish.`
                : `Healthy. Reorder point ${formatValue(selected.reorder, { unit: 'units' })}.`}
            </div>
          </div>

          {/* Authenticity workflow ────────── */}
          <div className="mt-6">
            <SectionHeading
              eyebrow="Authenticity"
              title="Pre-handover authenticity workflow"
              caption="Every checked item must be photographed and stored against the SKU before sign-off."
            />
            <ul className="grid gap-2 md:grid-cols-2">
              {[
                'Manufacturer seal intact — photograph on box and on unit',
                'Tamper labels intact — verify serial matches box, unit and packing list',
                'Authorised dealer verified — cross-check name on manufacturer portal',
                'Photo evidence captured — nameplate, serial, seal, accessories',
                'System labelling printed — panel ID, ratings, install date, owner',
                'Warranty record filed — start date, term, contact, registration receipt',
              ].map(step => (
                <li key={step} className="flex items-start gap-2 rounded-md border bg-surface-base p-2 text-sm"
                    style={{ borderColor: 'var(--color-border-subtle)' }}>
                  <span aria-hidden className="mt-0.5 inline-block h-4 w-4 rounded border"
                        style={{ borderColor: 'var(--color-border-strong)' }} />
                  <span className="text-ink-secondary">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      ) : null}

      <HubConnectStrip active="/hub/product-intelligence" />
    </div>
  );
}
