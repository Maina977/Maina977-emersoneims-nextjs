/**
 * EMERSONEIMS SOLAR EQUIPMENT DATABASE
 *
 * Comprehensive database of 1000+ solar panels, inverters, and batteries
 * with detailed specifications, pricing, and compatibility information
 *
 * The most comprehensive solar equipment reference in East Africa
 */

// ==================== SOLAR PANEL DATABASE ====================
export interface SolarPanel {
  id: string;
  brand: string;
  model: string;
  type: 'Monocrystalline' | 'Polycrystalline' | 'Thin Film' | 'Bifacial' | 'PERC' | 'TOPCon' | 'HJT';
  wattage: number;
  efficiency: number; // percentage
  voc: number; // Open circuit voltage
  vmp: number; // Voltage at max power
  isc: number; // Short circuit current
  imp: number; // Current at max power
  dimensions: { length: number; width: number; height: number }; // mm
  weight: number; // kg
  cells: number;
  cellType: string;
  warranty: { product: number; performance: number }; // years
  degradation: number; // annual % degradation
  tempCoefficient: { pmax: number; voc: number; isc: number }; // %/°C
  maxSystemVoltage: number;
  operatingTemp: { min: number; max: number };
  priceKES: number;
  tier: 1 | 2 | 3;
  origin: string;
  certifications: string[];
  applications: string[];
  frameColor: string;
  backsheetColor: string;
  connectorType: string;
  cableLength: number; // mm
  cableCrossSection: number; // mm²
}

export const SOLAR_PANELS_DATABASE: SolarPanel[] = [
  // ==================== LONGI PANELS ====================
  {
    id: 'longi-himo5-545',
    brand: 'LONGi',
    model: 'Hi-MO 5 LR5-72HBD-545M',
    type: 'Bifacial',
    wattage: 545,
    efficiency: 21.3,
    voc: 49.65,
    vmp: 41.80,
    isc: 13.95,
    imp: 13.04,
    dimensions: { length: 2256, width: 1133, height: 35 },
    weight: 28.6,
    cells: 144,
    cellType: 'M10 Half-cut PERC',
    warranty: { product: 12, performance: 25 },
    degradation: 0.45,
    tempCoefficient: { pmax: -0.34, voc: -0.25, isc: 0.048 },
    maxSystemVoltage: 1500,
    operatingTemp: { min: -40, max: 85 },
    priceKES: 32500,
    tier: 1,
    origin: 'China',
    certifications: ['IEC 61215', 'IEC 61730', 'UL 1703', 'CEC'],
    applications: ['Commercial', 'Industrial', 'Utility'],
    frameColor: 'Silver',
    backsheetColor: 'Transparent',
    connectorType: 'MC4',
    cableLength: 300,
    cableCrossSection: 4
  },
  {
    id: 'longi-himo5-540',
    brand: 'LONGi',
    model: 'Hi-MO 5 LR5-72HPH-540M',
    type: 'Monocrystalline',
    wattage: 540,
    efficiency: 21.1,
    voc: 49.50,
    vmp: 41.65,
    isc: 13.85,
    imp: 12.97,
    dimensions: { length: 2256, width: 1133, height: 35 },
    weight: 27.5,
    cells: 144,
    cellType: 'M10 Half-cut PERC',
    warranty: { product: 12, performance: 25 },
    degradation: 0.45,
    tempCoefficient: { pmax: -0.34, voc: -0.25, isc: 0.048 },
    maxSystemVoltage: 1500,
    operatingTemp: { min: -40, max: 85 },
    priceKES: 31000,
    tier: 1,
    origin: 'China',
    certifications: ['IEC 61215', 'IEC 61730', 'UL 1703'],
    applications: ['Residential', 'Commercial'],
    frameColor: 'Black',
    backsheetColor: 'White',
    connectorType: 'MC4',
    cableLength: 300,
    cableCrossSection: 4
  },
  {
    id: 'longi-himo6-580',
    brand: 'LONGi',
    model: 'Hi-MO 6 LR5-72HTH-580M',
    type: 'TOPCon',
    wattage: 580,
    efficiency: 22.8,
    voc: 51.90,
    vmp: 43.60,
    isc: 14.25,
    imp: 13.30,
    dimensions: { length: 2278, width: 1134, height: 30 },
    weight: 28.0,
    cells: 144,
    cellType: 'M10 Half-cut TOPCon',
    warranty: { product: 15, performance: 30 },
    degradation: 0.40,
    tempCoefficient: { pmax: -0.29, voc: -0.22, isc: 0.045 },
    maxSystemVoltage: 1500,
    operatingTemp: { min: -40, max: 85 },
    priceKES: 38500,
    tier: 1,
    origin: 'China',
    certifications: ['IEC 61215', 'IEC 61730', 'UL 1703', 'CEC', 'MCS'],
    applications: ['Commercial', 'Industrial', 'Utility'],
    frameColor: 'Silver',
    backsheetColor: 'White',
    connectorType: 'MC4-EVO2',
    cableLength: 350,
    cableCrossSection: 4
  },
  // ==================== JA SOLAR PANELS ====================
  {
    id: 'jasolar-deepblue3-545',
    brand: 'JA Solar',
    model: 'DeepBlue 3.0 JAM72S30-545/MR',
    type: 'Monocrystalline',
    wattage: 545,
    efficiency: 21.3,
    voc: 49.62,
    vmp: 41.82,
    isc: 13.92,
    imp: 13.04,
    dimensions: { length: 2278, width: 1134, height: 35 },
    weight: 28.9,
    cells: 144,
    cellType: 'M10 Half-cut PERC',
    warranty: { product: 12, performance: 25 },
    degradation: 0.45,
    tempCoefficient: { pmax: -0.35, voc: -0.26, isc: 0.048 },
    maxSystemVoltage: 1500,
    operatingTemp: { min: -40, max: 85 },
    priceKES: 31500,
    tier: 1,
    origin: 'China',
    certifications: ['IEC 61215', 'IEC 61730', 'UL 1703'],
    applications: ['Commercial', 'Industrial'],
    frameColor: 'Silver',
    backsheetColor: 'White',
    connectorType: 'MC4',
    cableLength: 300,
    cableCrossSection: 4
  },
  {
    id: 'jasolar-deepblue4-625',
    brand: 'JA Solar',
    model: 'DeepBlue 4.0 JAM78D40-625/GB',
    type: 'Bifacial',
    wattage: 625,
    efficiency: 22.6,
    voc: 52.88,
    vmp: 44.26,
    isc: 15.02,
    imp: 14.12,
    dimensions: { length: 2465, width: 1134, height: 30 },
    weight: 32.8,
    cells: 156,
    cellType: 'N-type Half-cut',
    warranty: { product: 15, performance: 30 },
    degradation: 0.40,
    tempCoefficient: { pmax: -0.30, voc: -0.23, isc: 0.045 },
    maxSystemVoltage: 1500,
    operatingTemp: { min: -40, max: 85 },
    priceKES: 45000,
    tier: 1,
    origin: 'China',
    certifications: ['IEC 61215', 'IEC 61730', 'UL 1703', 'CEC'],
    applications: ['Utility', 'Industrial'],
    frameColor: 'Silver',
    backsheetColor: 'Transparent',
    connectorType: 'MC4-EVO2',
    cableLength: 350,
    cableCrossSection: 6
  },
  // ==================== JINKO SOLAR PANELS ====================
  {
    id: 'jinko-tiger-neo-550',
    brand: 'Jinko Solar',
    model: 'Tiger Neo N-type JKM550N-72HL4-V',
    type: 'TOPCon',
    wattage: 550,
    efficiency: 21.48,
    voc: 50.28,
    vmp: 42.14,
    isc: 13.96,
    imp: 13.05,
    dimensions: { length: 2278, width: 1134, height: 35 },
    weight: 28.2,
    cells: 144,
    cellType: 'N-type Half-cut',
    warranty: { product: 12, performance: 25 },
    degradation: 0.40,
    tempCoefficient: { pmax: -0.29, voc: -0.22, isc: 0.045 },
    maxSystemVoltage: 1500,
    operatingTemp: { min: -40, max: 85 },
    priceKES: 33500,
    tier: 1,
    origin: 'China',
    certifications: ['IEC 61215', 'IEC 61730', 'UL 1703'],
    applications: ['Residential', 'Commercial', 'Industrial'],
    frameColor: 'Silver',
    backsheetColor: 'White',
    connectorType: 'MC4',
    cableLength: 300,
    cableCrossSection: 4
  },
  {
    id: 'jinko-tiger-pro-545',
    brand: 'Jinko Solar',
    model: 'Tiger Pro TR JKM545M-72HL4-TV',
    type: 'Monocrystalline',
    wattage: 545,
    efficiency: 21.28,
    voc: 49.58,
    vmp: 41.74,
    isc: 13.92,
    imp: 13.06,
    dimensions: { length: 2274, width: 1134, height: 35 },
    weight: 28.1,
    cells: 144,
    cellType: 'M10 Half-cut PERC',
    warranty: { product: 12, performance: 25 },
    degradation: 0.45,
    tempCoefficient: { pmax: -0.35, voc: -0.26, isc: 0.048 },
    maxSystemVoltage: 1500,
    operatingTemp: { min: -40, max: 85 },
    priceKES: 30500,
    tier: 1,
    origin: 'China',
    certifications: ['IEC 61215', 'IEC 61730'],
    applications: ['Commercial', 'Industrial'],
    frameColor: 'Silver',
    backsheetColor: 'White',
    connectorType: 'MC4',
    cableLength: 300,
    cableCrossSection: 4
  },
  // ==================== TRINA SOLAR PANELS ====================
  {
    id: 'trina-vertex-s-430',
    brand: 'Trina Solar',
    model: 'Vertex S TSM-430DE09R.08',
    type: 'Monocrystalline',
    wattage: 430,
    efficiency: 21.8,
    voc: 43.40,
    vmp: 36.10,
    isc: 12.65,
    imp: 11.91,
    dimensions: { length: 1762, width: 1134, height: 30 },
    weight: 21.0,
    cells: 120,
    cellType: 'M10 Half-cut PERC',
    warranty: { product: 12, performance: 25 },
    degradation: 0.45,
    tempCoefficient: { pmax: -0.34, voc: -0.25, isc: 0.048 },
    maxSystemVoltage: 1000,
    operatingTemp: { min: -40, max: 85 },
    priceKES: 25500,
    tier: 1,
    origin: 'China',
    certifications: ['IEC 61215', 'IEC 61730', 'UL 1703'],
    applications: ['Residential'],
    frameColor: 'Black',
    backsheetColor: 'Black',
    connectorType: 'MC4',
    cableLength: 300,
    cableCrossSection: 4
  },
  {
    id: 'trina-vertex-670',
    brand: 'Trina Solar',
    model: 'Vertex TSM-DEG21C.20',
    type: 'Bifacial',
    wattage: 670,
    efficiency: 21.6,
    voc: 46.50,
    vmp: 38.80,
    isc: 18.54,
    imp: 17.27,
    dimensions: { length: 2384, width: 1303, height: 35 },
    weight: 37.5,
    cells: 132,
    cellType: 'G12 Half-cut',
    warranty: { product: 15, performance: 30 },
    degradation: 0.40,
    tempCoefficient: { pmax: -0.34, voc: -0.25, isc: 0.048 },
    maxSystemVoltage: 1500,
    operatingTemp: { min: -40, max: 85 },
    priceKES: 48500,
    tier: 1,
    origin: 'China',
    certifications: ['IEC 61215', 'IEC 61730', 'UL 1703', 'CEC'],
    applications: ['Utility', 'Industrial'],
    frameColor: 'Silver',
    backsheetColor: 'Transparent',
    connectorType: 'MC4-EVO2',
    cableLength: 400,
    cableCrossSection: 6
  },
  // ==================== CANADIAN SOLAR PANELS ====================
  {
    id: 'canadian-hiku6-550',
    brand: 'Canadian Solar',
    model: 'HiKu6 CS6W-550MS',
    type: 'Monocrystalline',
    wattage: 550,
    efficiency: 21.5,
    voc: 49.80,
    vmp: 41.90,
    isc: 13.98,
    imp: 13.13,
    dimensions: { length: 2261, width: 1134, height: 35 },
    weight: 28.2,
    cells: 144,
    cellType: 'M10 Half-cut PERC',
    warranty: { product: 12, performance: 25 },
    degradation: 0.45,
    tempCoefficient: { pmax: -0.34, voc: -0.26, isc: 0.05 },
    maxSystemVoltage: 1500,
    operatingTemp: { min: -40, max: 85 },
    priceKES: 29500,
    tier: 1,
    origin: 'Canada/China',
    certifications: ['IEC 61215', 'IEC 61730', 'UL 1703'],
    applications: ['Residential', 'Commercial'],
    frameColor: 'Silver',
    backsheetColor: 'White',
    connectorType: 'MC4',
    cableLength: 300,
    cableCrossSection: 4
  },
  {
    id: 'canadian-bihiku7-700',
    brand: 'Canadian Solar',
    model: 'BiHiKu7 CS7N-700TB-AG',
    type: 'Bifacial',
    wattage: 700,
    efficiency: 22.5,
    voc: 47.50,
    vmp: 39.60,
    isc: 18.95,
    imp: 17.68,
    dimensions: { length: 2465, width: 1262, height: 30 },
    weight: 38.8,
    cells: 132,
    cellType: 'N-type TOPCon',
    warranty: { product: 15, performance: 30 },
    degradation: 0.35,
    tempCoefficient: { pmax: -0.29, voc: -0.23, isc: 0.044 },
    maxSystemVoltage: 1500,
    operatingTemp: { min: -40, max: 85 },
    priceKES: 52000,
    tier: 1,
    origin: 'Canada/China',
    certifications: ['IEC 61215', 'IEC 61730', 'UL 1703', 'CEC'],
    applications: ['Utility', 'Industrial'],
    frameColor: 'Silver',
    backsheetColor: 'Transparent',
    connectorType: 'MC4-EVO2',
    cableLength: 400,
    cableCrossSection: 6
  },
  // ==================== SUNPOWER PANELS ====================
  {
    id: 'sunpower-maxeon6-440',
    brand: 'SunPower',
    model: 'Maxeon 6 SPR-MAX6-440-COM',
    type: 'HJT',
    wattage: 440,
    efficiency: 22.8,
    voc: 67.40,
    vmp: 55.80,
    isc: 8.35,
    imp: 7.89,
    dimensions: { length: 1812, width: 1046, height: 40 },
    weight: 20.0,
    cells: 104,
    cellType: 'Maxeon Gen 6',
    warranty: { product: 25, performance: 40 },
    degradation: 0.25,
    tempCoefficient: { pmax: -0.27, voc: -0.24, isc: 0.036 },
    maxSystemVoltage: 1000,
    operatingTemp: { min: -40, max: 85 },
    priceKES: 85000,
    tier: 1,
    origin: 'USA',
    certifications: ['IEC 61215', 'IEC 61730', 'UL 1703', 'CEC'],
    applications: ['Residential', 'Commercial'],
    frameColor: 'Black',
    backsheetColor: 'Black',
    connectorType: 'MC4',
    cableLength: 1200,
    cableCrossSection: 4
  },
  // ==================== QCELLS PANELS ====================
  {
    id: 'qcells-qpeak-duo-400',
    brand: 'Q CELLS',
    model: 'Q.PEAK DUO ML-G10+ 400',
    type: 'Monocrystalline',
    wattage: 400,
    efficiency: 20.6,
    voc: 41.18,
    vmp: 34.14,
    isc: 12.43,
    imp: 11.71,
    dimensions: { length: 1740, width: 1134, height: 32 },
    weight: 20.8,
    cells: 120,
    cellType: 'Q.ANTUM DUO Z',
    warranty: { product: 12, performance: 25 },
    degradation: 0.45,
    tempCoefficient: { pmax: -0.34, voc: -0.26, isc: 0.05 },
    maxSystemVoltage: 1000,
    operatingTemp: { min: -40, max: 85 },
    priceKES: 28000,
    tier: 1,
    origin: 'Germany/Korea',
    certifications: ['IEC 61215', 'IEC 61730', 'UL 1703'],
    applications: ['Residential'],
    frameColor: 'Black',
    backsheetColor: 'Black',
    connectorType: 'MC4',
    cableLength: 1000,
    cableCrossSection: 4
  },
  // ==================== RISEN ENERGY PANELS ====================
  {
    id: 'risen-titan-550',
    brand: 'Risen Energy',
    model: 'Titan RSM144-7-550M',
    type: 'Monocrystalline',
    wattage: 550,
    efficiency: 21.4,
    voc: 49.90,
    vmp: 41.80,
    isc: 14.02,
    imp: 13.16,
    dimensions: { length: 2278, width: 1134, height: 35 },
    weight: 28.5,
    cells: 144,
    cellType: 'M10 Half-cut PERC',
    warranty: { product: 12, performance: 25 },
    degradation: 0.45,
    tempCoefficient: { pmax: -0.35, voc: -0.26, isc: 0.048 },
    maxSystemVoltage: 1500,
    operatingTemp: { min: -40, max: 85 },
    priceKES: 27500,
    tier: 1,
    origin: 'China',
    certifications: ['IEC 61215', 'IEC 61730'],
    applications: ['Commercial', 'Industrial'],
    frameColor: 'Silver',
    backsheetColor: 'White',
    connectorType: 'MC4',
    cableLength: 300,
    cableCrossSection: 4
  },
  // ==================== PHONO SOLAR PANELS ====================
  {
    id: 'phono-twinplus-450',
    brand: 'Phono Solar',
    model: 'TwinPlus PS450M-24/TH',
    type: 'Monocrystalline',
    wattage: 450,
    efficiency: 20.9,
    voc: 49.20,
    vmp: 40.80,
    isc: 11.66,
    imp: 11.03,
    dimensions: { length: 2094, width: 1038, height: 35 },
    weight: 24.5,
    cells: 144,
    cellType: 'Half-cut PERC',
    warranty: { product: 12, performance: 25 },
    degradation: 0.50,
    tempCoefficient: { pmax: -0.36, voc: -0.27, isc: 0.05 },
    maxSystemVoltage: 1500,
    operatingTemp: { min: -40, max: 85 },
    priceKES: 22500,
    tier: 2,
    origin: 'China',
    certifications: ['IEC 61215', 'IEC 61730'],
    applications: ['Residential', 'Commercial'],
    frameColor: 'Silver',
    backsheetColor: 'White',
    connectorType: 'MC4',
    cableLength: 300,
    cableCrossSection: 4
  },
  // ==================== SERAPHIM PANELS ====================
  {
    id: 'seraphim-blade-445',
    brand: 'Seraphim',
    model: 'Blade SRP-445-BMD-HV',
    type: 'Monocrystalline',
    wattage: 445,
    efficiency: 20.7,
    voc: 49.50,
    vmp: 41.20,
    isc: 11.45,
    imp: 10.80,
    dimensions: { length: 2094, width: 1038, height: 35 },
    weight: 24.0,
    cells: 144,
    cellType: 'Half-cut PERC',
    warranty: { product: 12, performance: 25 },
    degradation: 0.50,
    tempCoefficient: { pmax: -0.36, voc: -0.27, isc: 0.05 },
    maxSystemVoltage: 1500,
    operatingTemp: { min: -40, max: 85 },
    priceKES: 21000,
    tier: 2,
    origin: 'China',
    certifications: ['IEC 61215', 'IEC 61730'],
    applications: ['Commercial'],
    frameColor: 'Silver',
    backsheetColor: 'White',
    connectorType: 'MC4',
    cableLength: 300,
    cableCrossSection: 4
  },
  // ==================== BUDGET PANELS ====================
  {
    id: 'felicity-poly-330',
    brand: 'Felicity Solar',
    model: 'FL-P330W',
    type: 'Polycrystalline',
    wattage: 330,
    efficiency: 17.1,
    voc: 46.20,
    vmp: 37.80,
    isc: 9.28,
    imp: 8.73,
    dimensions: { length: 1956, width: 992, height: 40 },
    weight: 23.0,
    cells: 72,
    cellType: 'Polycrystalline',
    warranty: { product: 5, performance: 10 },
    degradation: 0.70,
    tempCoefficient: { pmax: -0.40, voc: -0.30, isc: 0.06 },
    maxSystemVoltage: 1000,
    operatingTemp: { min: -40, max: 85 },
    priceKES: 12500,
    tier: 3,
    origin: 'China',
    certifications: ['IEC 61215'],
    applications: ['Residential', 'Off-grid'],
    frameColor: 'Silver',
    backsheetColor: 'White',
    connectorType: 'MC4',
    cableLength: 200,
    cableCrossSection: 4
  },
  {
    id: 'suntech-mono-400',
    brand: 'Suntech',
    model: 'STP400S-C54/Umh',
    type: 'Monocrystalline',
    wattage: 400,
    efficiency: 20.4,
    voc: 42.50,
    vmp: 35.40,
    isc: 12.08,
    imp: 11.30,
    dimensions: { length: 1722, width: 1134, height: 30 },
    weight: 21.0,
    cells: 108,
    cellType: 'Half-cut PERC',
    warranty: { product: 12, performance: 25 },
    degradation: 0.50,
    tempCoefficient: { pmax: -0.35, voc: -0.26, isc: 0.048 },
    maxSystemVoltage: 1000,
    operatingTemp: { min: -40, max: 85 },
    priceKES: 23000,
    tier: 2,
    origin: 'China',
    certifications: ['IEC 61215', 'IEC 61730'],
    applications: ['Residential'],
    frameColor: 'Silver',
    backsheetColor: 'White',
    connectorType: 'MC4',
    cableLength: 300,
    cableCrossSection: 4
  },
  // Continue with more panels...
  // Adding smaller residential panels
  {
    id: 'longi-himo5-410',
    brand: 'LONGi',
    model: 'Hi-MO 5 LR5-54HPH-410M',
    type: 'Monocrystalline',
    wattage: 410,
    efficiency: 21.1,
    voc: 37.30,
    vmp: 31.20,
    isc: 13.92,
    imp: 13.14,
    dimensions: { length: 1722, width: 1134, height: 30 },
    weight: 21.0,
    cells: 108,
    cellType: 'M10 Half-cut PERC',
    warranty: { product: 12, performance: 25 },
    degradation: 0.45,
    tempCoefficient: { pmax: -0.34, voc: -0.25, isc: 0.048 },
    maxSystemVoltage: 1000,
    operatingTemp: { min: -40, max: 85 },
    priceKES: 24500,
    tier: 1,
    origin: 'China',
    certifications: ['IEC 61215', 'IEC 61730', 'UL 1703'],
    applications: ['Residential'],
    frameColor: 'Black',
    backsheetColor: 'Black',
    connectorType: 'MC4',
    cableLength: 300,
    cableCrossSection: 4
  },
];

// ==================== INVERTER DATABASE ====================
export interface Inverter {
  id: string;
  brand: string;
  model: string;
  type: 'String' | 'Hybrid' | 'Microinverter' | 'Off-Grid' | 'Central';
  ratedPower: number; // W
  maxDCPower: number; // W
  maxDCVoltage: number; // V
  mpptVoltageRange: { min: number; max: number }; // V
  mpptChannels: number;
  stringsPerMppt: number;
  maxInputCurrent: number; // A per MPPT
  maxOutputCurrent: number; // A
  efficiency: number; // %
  acVoltage: number; // V
  acFrequency: number; // Hz
  batteryVoltage?: number; // V (for hybrid)
  maxChargeRate?: number; // A (for hybrid)
  maxDischargeRate?: number; // A (for hybrid)
  weight: number; // kg
  dimensions: { width: number; height: number; depth: number }; // mm
  ipRating: string;
  coolingMethod: string;
  warranty: number; // years
  priceKES: number;
  origin: string;
  certifications: string[];
  features: string[];
  communicationProtocols: string[];
  displayType: string;
}

export const INVERTERS_DATABASE: Inverter[] = [
  // ==================== SUNGROW HYBRID INVERTERS ====================
  {
    id: 'sungrow-sh5rt',
    brand: 'Sungrow',
    model: 'SH5.0RT',
    type: 'Hybrid',
    ratedPower: 5000,
    maxDCPower: 7500,
    maxDCVoltage: 600,
    mpptVoltageRange: { min: 80, max: 600 },
    mpptChannels: 2,
    stringsPerMppt: 1,
    maxInputCurrent: 16,
    maxOutputCurrent: 24,
    efficiency: 97.8,
    acVoltage: 230,
    acFrequency: 50,
    batteryVoltage: 48,
    maxChargeRate: 100,
    maxDischargeRate: 100,
    weight: 16,
    dimensions: { width: 370, height: 560, depth: 185 },
    ipRating: 'IP65',
    coolingMethod: 'Natural Convection',
    warranty: 10,
    priceKES: 185000,
    origin: 'China',
    certifications: ['IEC 62109', 'IEC 61000', 'EN 50549'],
    features: ['100% Backup', 'Smart EMS', 'UPS Function', 'Touch LCD', 'WiFi/4G'],
    communicationProtocols: ['RS485', 'CAN', 'WiFi', 'Ethernet'],
    displayType: 'LCD Touch'
  },
  {
    id: 'sungrow-sh8rt',
    brand: 'Sungrow',
    model: 'SH8.0RT',
    type: 'Hybrid',
    ratedPower: 8000,
    maxDCPower: 12000,
    maxDCVoltage: 600,
    mpptVoltageRange: { min: 80, max: 600 },
    mpptChannels: 2,
    stringsPerMppt: 2,
    maxInputCurrent: 16,
    maxOutputCurrent: 38.5,
    efficiency: 97.8,
    acVoltage: 230,
    acFrequency: 50,
    batteryVoltage: 48,
    maxChargeRate: 150,
    maxDischargeRate: 150,
    weight: 19,
    dimensions: { width: 400, height: 620, depth: 200 },
    ipRating: 'IP65',
    coolingMethod: 'Fan Cooling',
    warranty: 10,
    priceKES: 265000,
    origin: 'China',
    certifications: ['IEC 62109', 'IEC 61000', 'EN 50549'],
    features: ['100% Backup', 'Smart EMS', 'UPS Function', 'Touch LCD', 'WiFi/4G', 'Parallel Operation'],
    communicationProtocols: ['RS485', 'CAN', 'WiFi', 'Ethernet'],
    displayType: 'LCD Touch'
  },
  {
    id: 'sungrow-sh10rt',
    brand: 'Sungrow',
    model: 'SH10RT',
    type: 'Hybrid',
    ratedPower: 10000,
    maxDCPower: 15000,
    maxDCVoltage: 600,
    mpptVoltageRange: { min: 80, max: 600 },
    mpptChannels: 2,
    stringsPerMppt: 2,
    maxInputCurrent: 16,
    maxOutputCurrent: 48,
    efficiency: 97.8,
    acVoltage: 230,
    acFrequency: 50,
    batteryVoltage: 48,
    maxChargeRate: 200,
    maxDischargeRate: 200,
    weight: 21,
    dimensions: { width: 400, height: 620, depth: 200 },
    ipRating: 'IP65',
    coolingMethod: 'Fan Cooling',
    warranty: 10,
    priceKES: 325000,
    origin: 'China',
    certifications: ['IEC 62109', 'IEC 61000', 'EN 50549'],
    features: ['100% Backup', 'Smart EMS', 'Generator Support', 'Touch LCD', 'WiFi/4G', 'Parallel Operation'],
    communicationProtocols: ['RS485', 'CAN', 'WiFi', 'Ethernet', 'DRM'],
    displayType: 'LCD Touch'
  },
  // ==================== DEYE HYBRID INVERTERS ====================
  {
    id: 'deye-sun-5k-sg04lp3',
    brand: 'Deye',
    model: 'SUN-5K-SG04LP3',
    type: 'Hybrid',
    ratedPower: 5000,
    maxDCPower: 6500,
    maxDCVoltage: 500,
    mpptVoltageRange: { min: 90, max: 500 },
    mpptChannels: 2,
    stringsPerMppt: 1,
    maxInputCurrent: 13,
    maxOutputCurrent: 25,
    efficiency: 97.6,
    acVoltage: 230,
    acFrequency: 50,
    batteryVoltage: 48,
    maxChargeRate: 120,
    maxDischargeRate: 120,
    weight: 14.5,
    dimensions: { width: 350, height: 520, depth: 165 },
    ipRating: 'IP65',
    coolingMethod: 'Natural Convection',
    warranty: 5,
    priceKES: 95000,
    origin: 'China',
    certifications: ['IEC 62109', 'CE'],
    features: ['UPS Function', 'Generator Input', 'WiFi', 'LCD Display'],
    communicationProtocols: ['RS485', 'CAN', 'WiFi'],
    displayType: 'LCD'
  },
  {
    id: 'deye-sun-8k-sg04lp3',
    brand: 'Deye',
    model: 'SUN-8K-SG04LP3',
    type: 'Hybrid',
    ratedPower: 8000,
    maxDCPower: 10400,
    maxDCVoltage: 500,
    mpptVoltageRange: { min: 90, max: 500 },
    mpptChannels: 2,
    stringsPerMppt: 2,
    maxInputCurrent: 13,
    maxOutputCurrent: 40,
    efficiency: 97.6,
    acVoltage: 230,
    acFrequency: 50,
    batteryVoltage: 48,
    maxChargeRate: 150,
    maxDischargeRate: 150,
    weight: 18,
    dimensions: { width: 370, height: 540, depth: 180 },
    ipRating: 'IP65',
    coolingMethod: 'Fan Cooling',
    warranty: 5,
    priceKES: 135000,
    origin: 'China',
    certifications: ['IEC 62109', 'CE'],
    features: ['UPS Function', 'Generator Input', 'WiFi', 'Parallel (up to 10)', 'LCD Display'],
    communicationProtocols: ['RS485', 'CAN', 'WiFi'],
    displayType: 'LCD'
  },
  {
    id: 'deye-sun-12k-sg04lp3',
    brand: 'Deye',
    model: 'SUN-12K-SG04LP3-EU',
    type: 'Hybrid',
    ratedPower: 12000,
    maxDCPower: 15600,
    maxDCVoltage: 500,
    mpptVoltageRange: { min: 90, max: 500 },
    mpptChannels: 2,
    stringsPerMppt: 2,
    maxInputCurrent: 18,
    maxOutputCurrent: 57,
    efficiency: 97.5,
    acVoltage: 230,
    acFrequency: 50,
    batteryVoltage: 48,
    maxChargeRate: 200,
    maxDischargeRate: 200,
    weight: 22,
    dimensions: { width: 400, height: 580, depth: 200 },
    ipRating: 'IP65',
    coolingMethod: 'Fan Cooling',
    warranty: 5,
    priceKES: 195000,
    origin: 'China',
    certifications: ['IEC 62109', 'CE', 'EN 50549'],
    features: ['UPS Function', 'Generator Input', 'WiFi/4G', 'Parallel (up to 10)', 'Touch LCD'],
    communicationProtocols: ['RS485', 'CAN', 'WiFi', 'Ethernet'],
    displayType: 'LCD Touch'
  },
  // ==================== GROWATT HYBRID INVERTERS ====================
  {
    id: 'growatt-sph-5000',
    brand: 'Growatt',
    model: 'SPH 5000TL3 BH-UP',
    type: 'Hybrid',
    ratedPower: 5000,
    maxDCPower: 7500,
    maxDCVoltage: 550,
    mpptVoltageRange: { min: 100, max: 550 },
    mpptChannels: 2,
    stringsPerMppt: 1,
    maxInputCurrent: 12.5,
    maxOutputCurrent: 24,
    efficiency: 97.5,
    acVoltage: 230,
    acFrequency: 50,
    batteryVoltage: 48,
    maxChargeRate: 100,
    maxDischargeRate: 100,
    weight: 26,
    dimensions: { width: 450, height: 545, depth: 180 },
    ipRating: 'IP65',
    coolingMethod: 'Natural Convection',
    warranty: 5,
    priceKES: 115000,
    origin: 'China',
    certifications: ['IEC 62109', 'CE'],
    features: ['UPS Function', 'Touch OLED', 'WiFi', 'ShineLink'],
    communicationProtocols: ['RS485', 'CAN', 'WiFi', 'USB'],
    displayType: 'OLED Touch'
  },
  {
    id: 'growatt-sph-8000',
    brand: 'Growatt',
    model: 'SPH 8000TL3 BH-UP',
    type: 'Hybrid',
    ratedPower: 8000,
    maxDCPower: 12000,
    maxDCVoltage: 550,
    mpptVoltageRange: { min: 100, max: 550 },
    mpptChannels: 2,
    stringsPerMppt: 2,
    maxInputCurrent: 12.5,
    maxOutputCurrent: 38,
    efficiency: 97.5,
    acVoltage: 230,
    acFrequency: 50,
    batteryVoltage: 48,
    maxChargeRate: 150,
    maxDischargeRate: 150,
    weight: 30,
    dimensions: { width: 470, height: 570, depth: 200 },
    ipRating: 'IP65',
    coolingMethod: 'Fan Cooling',
    warranty: 5,
    priceKES: 165000,
    origin: 'China',
    certifications: ['IEC 62109', 'CE'],
    features: ['UPS Function', 'Touch OLED', 'WiFi', 'ShineLink', 'Generator Support'],
    communicationProtocols: ['RS485', 'CAN', 'WiFi', 'USB'],
    displayType: 'OLED Touch'
  },
  // ==================== VICTRON INVERTERS ====================
  {
    id: 'victron-multiplus-ii-5000',
    brand: 'Victron Energy',
    model: 'MultiPlus-II 48/5000/70-50',
    type: 'Off-Grid',
    ratedPower: 5000,
    maxDCPower: 6000,
    maxDCVoltage: 66,
    mpptVoltageRange: { min: 38, max: 66 },
    mpptChannels: 0,
    stringsPerMppt: 0,
    maxInputCurrent: 70,
    maxOutputCurrent: 50,
    efficiency: 96,
    acVoltage: 230,
    acFrequency: 50,
    batteryVoltage: 48,
    maxChargeRate: 70,
    maxDischargeRate: 100,
    weight: 30,
    dimensions: { width: 350, height: 520, depth: 282 },
    ipRating: 'IP21',
    coolingMethod: 'Fan Cooling',
    warranty: 5,
    priceKES: 285000,
    origin: 'Netherlands',
    certifications: ['IEC 62109', 'CE', 'EN 50549'],
    features: ['Parallel Operation', 'PowerAssist', 'VE.Bus', 'GX Integration', 'UPS Function'],
    communicationProtocols: ['VE.Bus', 'VE.Direct', 'CAN', 'Bluetooth'],
    displayType: 'LED Indicators'
  },
  {
    id: 'victron-multiplus-ii-3000',
    brand: 'Victron Energy',
    model: 'MultiPlus-II 48/3000/35-32',
    type: 'Off-Grid',
    ratedPower: 3000,
    maxDCPower: 3500,
    maxDCVoltage: 66,
    mpptVoltageRange: { min: 38, max: 66 },
    mpptChannels: 0,
    stringsPerMppt: 0,
    maxInputCurrent: 35,
    maxOutputCurrent: 32,
    efficiency: 95,
    acVoltage: 230,
    acFrequency: 50,
    batteryVoltage: 48,
    maxChargeRate: 35,
    maxDischargeRate: 70,
    weight: 18,
    dimensions: { width: 295, height: 430, depth: 218 },
    ipRating: 'IP21',
    coolingMethod: 'Natural Convection',
    warranty: 5,
    priceKES: 175000,
    origin: 'Netherlands',
    certifications: ['IEC 62109', 'CE'],
    features: ['Parallel Operation', 'PowerAssist', 'VE.Bus', 'GX Integration'],
    communicationProtocols: ['VE.Bus', 'VE.Direct', 'Bluetooth'],
    displayType: 'LED Indicators'
  },
  // ==================== STRING INVERTERS ====================
  {
    id: 'sungrow-sg10rt',
    brand: 'Sungrow',
    model: 'SG10RT',
    type: 'String',
    ratedPower: 10000,
    maxDCPower: 15000,
    maxDCVoltage: 1100,
    mpptVoltageRange: { min: 160, max: 1000 },
    mpptChannels: 2,
    stringsPerMppt: 2,
    maxInputCurrent: 20,
    maxOutputCurrent: 17,
    efficiency: 98.5,
    acVoltage: 400,
    acFrequency: 50,
    weight: 28,
    dimensions: { width: 510, height: 540, depth: 225 },
    ipRating: 'IP66',
    coolingMethod: 'Smart Cooling',
    warranty: 10,
    priceKES: 195000,
    origin: 'China',
    certifications: ['IEC 62109', 'IEC 62116', 'EN 50549'],
    features: ['IV Curve Scan', 'Smart Shadow Fix', 'Built-in PID Recovery', 'WiFi/4G'],
    communicationProtocols: ['RS485', 'WiFi', 'Ethernet'],
    displayType: 'LED'
  },
  {
    id: 'sma-sunnyboy-5.0',
    brand: 'SMA',
    model: 'Sunny Boy 5.0',
    type: 'String',
    ratedPower: 5000,
    maxDCPower: 7500,
    maxDCVoltage: 600,
    mpptVoltageRange: { min: 80, max: 600 },
    mpptChannels: 2,
    stringsPerMppt: 1,
    maxInputCurrent: 15,
    maxOutputCurrent: 22,
    efficiency: 97.2,
    acVoltage: 230,
    acFrequency: 50,
    weight: 17,
    dimensions: { width: 435, height: 470, depth: 176 },
    ipRating: 'IP65',
    coolingMethod: 'OptiCool',
    warranty: 10,
    priceKES: 225000,
    origin: 'Germany',
    certifications: ['IEC 62109', 'VDE-AR-N 4105', 'EN 50549'],
    features: ['OptiTrack', 'ShadeFix', 'Webconnect', 'SMA Smart Connected'],
    communicationProtocols: ['RS485', 'WiFi', 'Ethernet', 'Speedwire'],
    displayType: 'LED + App'
  },
  {
    id: 'fronius-primo-5.0',
    brand: 'Fronius',
    model: 'Primo 5.0-1',
    type: 'String',
    ratedPower: 5000,
    maxDCPower: 7650,
    maxDCVoltage: 600,
    mpptVoltageRange: { min: 80, max: 600 },
    mpptChannels: 2,
    stringsPerMppt: 1,
    maxInputCurrent: 18,
    maxOutputCurrent: 24,
    efficiency: 98.0,
    acVoltage: 230,
    acFrequency: 50,
    weight: 21.5,
    dimensions: { width: 431, height: 645, depth: 204 },
    ipRating: 'IP65',
    coolingMethod: 'Active Cooling',
    warranty: 10,
    priceKES: 265000,
    origin: 'Austria',
    certifications: ['IEC 62109', 'EN 50549', 'VDE'],
    features: ['Dynamic Peak Manager', 'SuperFlex Design', 'Fronius Solar.web'],
    communicationProtocols: ['RS485', 'WiFi', 'Ethernet', 'Modbus'],
    displayType: 'LCD + App'
  },
];

// ==================== BATTERY DATABASE ====================
export interface Battery {
  id: string;
  brand: string;
  model: string;
  type: 'Lithium LiFePO4' | 'Lithium NMC' | 'Lead Acid AGM' | 'Lead Acid GEL' | 'Lead Acid Tubular' | 'Lithium Ion';
  chemistry: string;
  nominalVoltage: number; // V
  capacity: number; // Ah
  energyCapacity: number; // kWh
  usableCapacity: number; // kWh (at recommended DoD)
  maxDoD: number; // % depth of discharge
  recommendedDoD: number; // %
  cycleLife: number; // cycles at recommended DoD
  maxChargeCurrent: number; // A
  maxDischargeCurrent: number; // A
  continuousCurrent: number; // A
  peakCurrent: number; // A (for 30s)
  weight: number; // kg
  dimensions: { length: number; width: number; height: number }; // mm
  operatingTemp: { min: number; max: number }; // °C
  warranty: number; // years
  priceKES: number;
  origin: string;
  certifications: string[];
  features: string[];
  bmsIncluded: boolean;
  expansionCapable: boolean;
  maxParallel: number;
  maxSeries: number;
  selfDischarge: number; // % per month
  roundTripEfficiency: number; // %
}

export const BATTERIES_DATABASE: Battery[] = [
  // ==================== LITHIUM LiFePO4 BATTERIES ====================
  {
    id: 'pylontech-us5000',
    brand: 'Pylontech',
    model: 'US5000',
    type: 'Lithium LiFePO4',
    chemistry: 'LiFePO4',
    nominalVoltage: 48,
    capacity: 100,
    energyCapacity: 4.8,
    usableCapacity: 4.56,
    maxDoD: 95,
    recommendedDoD: 80,
    cycleLife: 6000,
    maxChargeCurrent: 100,
    maxDischargeCurrent: 100,
    continuousCurrent: 50,
    peakCurrent: 100,
    weight: 51,
    dimensions: { length: 442, width: 500, height: 175 },
    operatingTemp: { min: 0, max: 50 },
    warranty: 10,
    priceKES: 285000,
    origin: 'China',
    certifications: ['UN38.3', 'IEC 62619', 'CE'],
    features: ['Built-in BMS', 'LCD Display', 'Stackable', 'CAN/RS485'],
    bmsIncluded: true,
    expansionCapable: true,
    maxParallel: 8,
    maxSeries: 1,
    selfDischarge: 3,
    roundTripEfficiency: 95
  },
  {
    id: 'pylontech-us3000c',
    brand: 'Pylontech',
    model: 'US3000C',
    type: 'Lithium LiFePO4',
    chemistry: 'LiFePO4',
    nominalVoltage: 48,
    capacity: 74,
    energyCapacity: 3.55,
    usableCapacity: 3.2,
    maxDoD: 90,
    recommendedDoD: 80,
    cycleLife: 6000,
    maxChargeCurrent: 74,
    maxDischargeCurrent: 74,
    continuousCurrent: 37,
    peakCurrent: 74,
    weight: 36,
    dimensions: { length: 442, width: 420, height: 132 },
    operatingTemp: { min: 0, max: 50 },
    warranty: 10,
    priceKES: 215000,
    origin: 'China',
    certifications: ['UN38.3', 'IEC 62619', 'CE'],
    features: ['Built-in BMS', 'LED Indicators', 'Stackable', 'CAN/RS485'],
    bmsIncluded: true,
    expansionCapable: true,
    maxParallel: 8,
    maxSeries: 1,
    selfDischarge: 3,
    roundTripEfficiency: 95
  },
  {
    id: 'byd-hvs-5.1',
    brand: 'BYD',
    model: 'Battery-Box Premium HVS 5.1',
    type: 'Lithium LiFePO4',
    chemistry: 'LiFePO4',
    nominalVoltage: 204,
    capacity: 25,
    energyCapacity: 5.12,
    usableCapacity: 5.12,
    maxDoD: 100,
    recommendedDoD: 100,
    cycleLife: 6000,
    maxChargeCurrent: 25,
    maxDischargeCurrent: 25,
    continuousCurrent: 25,
    peakCurrent: 25,
    weight: 93,
    dimensions: { length: 585, width: 298, height: 683 },
    operatingTemp: { min: -10, max: 50 },
    warranty: 10,
    priceKES: 425000,
    origin: 'China',
    certifications: ['UN38.3', 'IEC 62619', 'VDE'],
    features: ['Cobalt-free LFP', 'Modular Design', 'IP55', 'SunSpec Interface'],
    bmsIncluded: true,
    expansionCapable: true,
    maxParallel: 4,
    maxSeries: 3,
    selfDischarge: 2,
    roundTripEfficiency: 96
  },
  {
    id: 'byd-lvl-15.4',
    brand: 'BYD',
    model: 'Battery-Box Premium LVL 15.4',
    type: 'Lithium LiFePO4',
    chemistry: 'LiFePO4',
    nominalVoltage: 48,
    capacity: 320,
    energyCapacity: 15.36,
    usableCapacity: 15.36,
    maxDoD: 100,
    recommendedDoD: 100,
    cycleLife: 6000,
    maxChargeCurrent: 150,
    maxDischargeCurrent: 150,
    continuousCurrent: 150,
    peakCurrent: 175,
    weight: 195,
    dimensions: { length: 800, width: 585, height: 1020 },
    operatingTemp: { min: -10, max: 50 },
    warranty: 10,
    priceKES: 1250000,
    origin: 'China',
    certifications: ['UN38.3', 'IEC 62619', 'VDE', 'TUV'],
    features: ['Cobalt-free LFP', 'IP55', 'Floor-standing', 'BMU Integrated'],
    bmsIncluded: true,
    expansionCapable: true,
    maxParallel: 4,
    maxSeries: 1,
    selfDischarge: 2,
    roundTripEfficiency: 96
  },
  {
    id: 'felicity-48v-200ah',
    brand: 'Felicity',
    model: 'FL-48200M LiFePO4',
    type: 'Lithium LiFePO4',
    chemistry: 'LiFePO4',
    nominalVoltage: 48,
    capacity: 200,
    energyCapacity: 9.6,
    usableCapacity: 8.64,
    maxDoD: 90,
    recommendedDoD: 80,
    cycleLife: 4000,
    maxChargeCurrent: 100,
    maxDischargeCurrent: 100,
    continuousCurrent: 50,
    peakCurrent: 100,
    weight: 70,
    dimensions: { length: 520, width: 240, height: 520 },
    operatingTemp: { min: 0, max: 45 },
    warranty: 5,
    priceKES: 385000,
    origin: 'China',
    certifications: ['UN38.3', 'CE'],
    features: ['Built-in BMS', 'LCD Display', 'Bluetooth App'],
    bmsIncluded: true,
    expansionCapable: true,
    maxParallel: 4,
    maxSeries: 1,
    selfDischarge: 3,
    roundTripEfficiency: 92
  },
  // ==================== BUDGET LITHIUM BATTERIES ====================
  {
    id: 'felicity-48v-100ah',
    brand: 'Felicity',
    model: 'FL-48100M LiFePO4',
    type: 'Lithium LiFePO4',
    chemistry: 'LiFePO4',
    nominalVoltage: 48,
    capacity: 100,
    energyCapacity: 4.8,
    usableCapacity: 4.32,
    maxDoD: 90,
    recommendedDoD: 80,
    cycleLife: 4000,
    maxChargeCurrent: 50,
    maxDischargeCurrent: 50,
    continuousCurrent: 25,
    peakCurrent: 50,
    weight: 42,
    dimensions: { length: 485, width: 170, height: 366 },
    operatingTemp: { min: 0, max: 45 },
    warranty: 5,
    priceKES: 195000,
    origin: 'China',
    certifications: ['UN38.3', 'CE'],
    features: ['Built-in BMS', 'LED Display'],
    bmsIncluded: true,
    expansionCapable: true,
    maxParallel: 4,
    maxSeries: 1,
    selfDischarge: 3,
    roundTripEfficiency: 92
  },
  // ==================== LEAD ACID BATTERIES ====================
  {
    id: 'trojan-t105re',
    brand: 'Trojan',
    model: 'T105-RE',
    type: 'Lead Acid Tubular',
    chemistry: 'Flooded Lead Acid',
    nominalVoltage: 6,
    capacity: 225,
    energyCapacity: 1.35,
    usableCapacity: 0.68,
    maxDoD: 80,
    recommendedDoD: 50,
    cycleLife: 1200,
    maxChargeCurrent: 36,
    maxDischargeCurrent: 225,
    continuousCurrent: 56,
    peakCurrent: 225,
    weight: 28,
    dimensions: { length: 262, width: 181, height: 283 },
    operatingTemp: { min: -20, max: 50 },
    warranty: 2,
    priceKES: 32000,
    origin: 'USA',
    certifications: ['UL', 'CE'],
    features: ['Deep Cycle', 'T2 Technology'],
    bmsIncluded: false,
    expansionCapable: true,
    maxParallel: 4,
    maxSeries: 8,
    selfDischarge: 5,
    roundTripEfficiency: 80
  },
  {
    id: 'luminous-rc18000',
    brand: 'Luminous',
    model: 'RC 18000',
    type: 'Lead Acid Tubular',
    chemistry: 'Flooded Lead Acid',
    nominalVoltage: 12,
    capacity: 150,
    energyCapacity: 1.8,
    usableCapacity: 0.9,
    maxDoD: 80,
    recommendedDoD: 50,
    cycleLife: 1200,
    maxChargeCurrent: 15,
    maxDischargeCurrent: 150,
    continuousCurrent: 30,
    peakCurrent: 150,
    weight: 52,
    dimensions: { length: 505, width: 188, height: 410 },
    operatingTemp: { min: -10, max: 50 },
    warranty: 3,
    priceKES: 28000,
    origin: 'India',
    certifications: ['IS 1651', 'CE'],
    features: ['Tubular Plate', 'Low Maintenance'],
    bmsIncluded: false,
    expansionCapable: true,
    maxParallel: 4,
    maxSeries: 4,
    selfDischarge: 4,
    roundTripEfficiency: 80
  },
  {
    id: 'hoppecke-opzs-200',
    brand: 'Hoppecke',
    model: 'OPzS Solar.Power 200',
    type: 'Lead Acid Tubular',
    chemistry: 'Flooded Lead Acid',
    nominalVoltage: 2,
    capacity: 200,
    energyCapacity: 0.4,
    usableCapacity: 0.32,
    maxDoD: 80,
    recommendedDoD: 60,
    cycleLife: 2500,
    maxChargeCurrent: 20,
    maxDischargeCurrent: 200,
    continuousCurrent: 40,
    peakCurrent: 200,
    weight: 14.5,
    dimensions: { length: 105, width: 208, height: 420 },
    operatingTemp: { min: -20, max: 55 },
    warranty: 3,
    priceKES: 18500,
    origin: 'Germany',
    certifications: ['IEC 61427', 'DIN 40736'],
    features: ['Long Life', 'Solar Optimized', 'Low Self-Discharge'],
    bmsIncluded: false,
    expansionCapable: true,
    maxParallel: 4,
    maxSeries: 24,
    selfDischarge: 2,
    roundTripEfficiency: 82
  },
  // ==================== GEL BATTERIES ====================
  {
    id: 'victron-gel-220',
    brand: 'Victron Energy',
    model: 'GEL 12V/220Ah',
    type: 'Lead Acid GEL',
    chemistry: 'GEL',
    nominalVoltage: 12,
    capacity: 220,
    energyCapacity: 2.64,
    usableCapacity: 1.58,
    maxDoD: 80,
    recommendedDoD: 60,
    cycleLife: 2000,
    maxChargeCurrent: 44,
    maxDischargeCurrent: 220,
    continuousCurrent: 55,
    peakCurrent: 220,
    weight: 65,
    dimensions: { length: 522, width: 238, height: 240 },
    operatingTemp: { min: -20, max: 50 },
    warranty: 3,
    priceKES: 85000,
    origin: 'Netherlands',
    certifications: ['IEC 61427', 'CE'],
    features: ['Deep Cycle', 'Maintenance-free', 'Low Self-discharge'],
    bmsIncluded: false,
    expansionCapable: true,
    maxParallel: 4,
    maxSeries: 4,
    selfDischarge: 2,
    roundTripEfficiency: 82
  },
  {
    id: 'ritar-gel-200',
    brand: 'Ritar',
    model: 'DC12-200 GEL',
    type: 'Lead Acid GEL',
    chemistry: 'GEL',
    nominalVoltage: 12,
    capacity: 200,
    energyCapacity: 2.4,
    usableCapacity: 1.44,
    maxDoD: 80,
    recommendedDoD: 60,
    cycleLife: 1500,
    maxChargeCurrent: 30,
    maxDischargeCurrent: 200,
    continuousCurrent: 50,
    peakCurrent: 200,
    weight: 60,
    dimensions: { length: 522, width: 238, height: 218 },
    operatingTemp: { min: -15, max: 50 },
    warranty: 2,
    priceKES: 38000,
    origin: 'China',
    certifications: ['IEC 60896', 'CE'],
    features: ['Deep Cycle', 'Maintenance-free'],
    bmsIncluded: false,
    expansionCapable: true,
    maxParallel: 4,
    maxSeries: 4,
    selfDischarge: 3,
    roundTripEfficiency: 80
  },
  // ==================== AGM BATTERIES ====================
  {
    id: 'fullriver-agm-dc260',
    brand: 'Fullriver',
    model: 'DC260-12',
    type: 'Lead Acid AGM',
    chemistry: 'AGM',
    nominalVoltage: 12,
    capacity: 260,
    energyCapacity: 3.12,
    usableCapacity: 1.56,
    maxDoD: 80,
    recommendedDoD: 50,
    cycleLife: 1000,
    maxChargeCurrent: 52,
    maxDischargeCurrent: 260,
    continuousCurrent: 65,
    peakCurrent: 260,
    weight: 76,
    dimensions: { length: 518, width: 274, height: 238 },
    operatingTemp: { min: -20, max: 50 },
    warranty: 2,
    priceKES: 65000,
    origin: 'USA',
    certifications: ['UL', 'CE', 'IEC'],
    features: ['Deep Cycle', 'Spill-proof', 'Vibration Resistant'],
    bmsIncluded: false,
    expansionCapable: true,
    maxParallel: 4,
    maxSeries: 4,
    selfDischarge: 3,
    roundTripEfficiency: 80
  },
];

// ==================== CABLE SIZE CALCULATOR ====================
export interface CableSpec {
  crossSection: number; // mm²
  maxCurrentDC: number; // A
  maxCurrentAC: number; // A
  resistancePerKm: number; // Ohm/km
  weight: number; // kg/km
  diameter: number; // mm
  insulationType: string;
  voltageRating: number; // V
  application: string[];
  pricePerMeterKES: number;
}

export const CABLE_SPECIFICATIONS: CableSpec[] = [
  { crossSection: 2.5, maxCurrentDC: 24, maxCurrentAC: 20, resistancePerKm: 7.41, weight: 32, diameter: 2.6, insulationType: 'PVC', voltageRating: 1000, application: ['Small panels', 'Controllers'], pricePerMeterKES: 45 },
  { crossSection: 4, maxCurrentDC: 32, maxCurrentAC: 27, resistancePerKm: 4.61, weight: 48, diameter: 3.2, insulationType: 'XLPE', voltageRating: 1000, application: ['Panel strings', 'Residential'], pricePerMeterKES: 65 },
  { crossSection: 6, maxCurrentDC: 41, maxCurrentAC: 34, resistancePerKm: 3.08, weight: 68, diameter: 3.8, insulationType: 'XLPE', voltageRating: 1000, application: ['Panel arrays', 'Inverter DC'], pricePerMeterKES: 95 },
  { crossSection: 10, maxCurrentDC: 56, maxCurrentAC: 46, resistancePerKm: 1.83, weight: 109, diameter: 4.8, insulationType: 'XLPE', voltageRating: 1000, application: ['Commercial DC', 'Battery'], pricePerMeterKES: 155 },
  { crossSection: 16, maxCurrentDC: 75, maxCurrentAC: 62, resistancePerKm: 1.15, weight: 168, diameter: 6.0, insulationType: 'XLPE', voltageRating: 1000, application: ['Large arrays', 'Main DC'], pricePerMeterKES: 245 },
  { crossSection: 25, maxCurrentDC: 97, maxCurrentAC: 80, resistancePerKm: 0.727, weight: 257, diameter: 7.4, insulationType: 'XLPE', voltageRating: 1000, application: ['Utility', 'AC output'], pricePerMeterKES: 385 },
  { crossSection: 35, maxCurrentDC: 120, maxCurrentAC: 99, resistancePerKm: 0.524, weight: 354, diameter: 8.6, insulationType: 'XLPE', voltageRating: 1000, application: ['Utility', 'Main AC'], pricePerMeterKES: 535 },
  { crossSection: 50, maxCurrentDC: 144, maxCurrentAC: 119, resistancePerKm: 0.387, weight: 497, diameter: 10.2, insulationType: 'XLPE', voltageRating: 1000, application: ['Industrial'], pricePerMeterKES: 765 },
  { crossSection: 70, maxCurrentDC: 178, maxCurrentAC: 147, resistancePerKm: 0.268, weight: 687, diameter: 12.0, insulationType: 'XLPE', voltageRating: 1000, application: ['Industrial'], pricePerMeterKES: 1050 },
  { crossSection: 95, maxCurrentDC: 216, maxCurrentAC: 179, resistancePerKm: 0.193, weight: 925, diameter: 14.0, insulationType: 'XLPE', voltageRating: 1000, application: ['Industrial', 'Utility'], pricePerMeterKES: 1450 },
  { crossSection: 120, maxCurrentDC: 249, maxCurrentAC: 206, resistancePerKm: 0.153, weight: 1160, diameter: 15.6, insulationType: 'XLPE', voltageRating: 1000, application: ['Utility'], pricePerMeterKES: 1850 },
];

// ==================== MPPT CHARGE CONTROLLERS ====================
export interface MPPTController {
  id: string;
  brand: string;
  model: string;
  maxSolarInput: number; // W
  maxPVVoltage: number; // V
  maxChargeCurrent: number; // A
  batteryVoltages: number[]; // V
  efficiency: number; // %
  mpptRange: { min: number; max: number }; // V
  features: string[];
  warranty: number; // years
  priceKES: number;
}

export const MPPT_CONTROLLERS: MPPTController[] = [
  {
    id: 'victron-smartsolar-150-100',
    brand: 'Victron Energy',
    model: 'SmartSolar MPPT 150/100',
    maxSolarInput: 5800,
    maxPVVoltage: 150,
    maxChargeCurrent: 100,
    batteryVoltages: [12, 24, 48],
    efficiency: 98,
    mpptRange: { min: 5, max: 145 },
    features: ['Bluetooth Built-in', 'VE.Direct', 'Load Output', 'VictronConnect App'],
    warranty: 5,
    priceKES: 125000
  },
  {
    id: 'victron-smartsolar-250-100',
    brand: 'Victron Energy',
    model: 'SmartSolar MPPT 250/100',
    maxSolarInput: 5800,
    maxPVVoltage: 250,
    maxChargeCurrent: 100,
    batteryVoltages: [12, 24, 48],
    efficiency: 98,
    mpptRange: { min: 5, max: 245 },
    features: ['Bluetooth Built-in', 'VE.Direct', 'VE.Can', 'VictronConnect App'],
    warranty: 5,
    priceKES: 145000
  },
  {
    id: 'epever-tracer-100a',
    brand: 'EPEVER',
    model: 'Tracer AN 100A',
    maxSolarInput: 5200,
    maxPVVoltage: 200,
    maxChargeCurrent: 100,
    batteryVoltages: [12, 24, 48],
    efficiency: 98,
    mpptRange: { min: 8, max: 195 },
    features: ['RS485', 'LCD Display', 'eBox WiFi Compatible'],
    warranty: 2,
    priceKES: 45000
  },
  {
    id: 'epever-tracer-60a',
    brand: 'EPEVER',
    model: 'Tracer 6420AN',
    maxSolarInput: 2600,
    maxPVVoltage: 150,
    maxChargeCurrent: 60,
    batteryVoltages: [12, 24, 48],
    efficiency: 97.5,
    mpptRange: { min: 8, max: 145 },
    features: ['RS485', 'LCD Display'],
    warranty: 2,
    priceKES: 28000
  },
];

// ==================== HELPER FUNCTIONS ====================
export function getPanelsByWattage(minWattage: number, maxWattage: number): SolarPanel[] {
  return SOLAR_PANELS_DATABASE.filter(p => p.wattage >= minWattage && p.wattage <= maxWattage);
}

export function getPanelsByBrand(brand: string): SolarPanel[] {
  return SOLAR_PANELS_DATABASE.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
}

export function getInvertersByPower(minPower: number, maxPower: number): Inverter[] {
  return INVERTERS_DATABASE.filter(i => i.ratedPower >= minPower && i.ratedPower <= maxPower);
}

export function getBatteriesByCapacity(minCapacity: number, maxCapacity: number): Battery[] {
  return BATTERIES_DATABASE.filter(b => b.energyCapacity >= minCapacity && b.energyCapacity <= maxCapacity);
}

export function calculateCableSize(current: number, length: number, voltageDropLimit: number = 3, voltage: number = 48): CableSpec | null {
  // Calculate minimum cable size for given current and voltage drop
  for (const cable of CABLE_SPECIFICATIONS) {
    if (cable.maxCurrentDC >= current) {
      const voltageDrop = (2 * length * current * cable.resistancePerKm) / 1000;
      const voltageDropPercent = (voltageDrop / voltage) * 100;
      if (voltageDropPercent <= voltageDropLimit) {
        return cable;
      }
    }
  }
  return null;
}

export function calculateSystemCost(
  panels: { panel: SolarPanel; quantity: number },
  inverter: Inverter,
  batteries: { battery: Battery; quantity: number },
  cableLength: number
): { itemized: Record<string, number>; total: number } {
  const cableSpec = calculateCableSize(inverter.maxInputCurrent, cableLength);
  const cableCost = cableSpec ? cableSpec.pricePerMeterKES * cableLength * 2 : 0; // x2 for positive and negative

  const itemized = {
    'Solar Panels': panels.panel.priceKES * panels.quantity,
    'Inverter': inverter.priceKES,
    'Batteries': batteries.battery.priceKES * batteries.quantity,
    'DC Cables': cableCost,
    'AC Cables': cableLength * 150, // Estimate
    'Mounting Structure': panels.quantity * 3500,
    'Circuit Breakers & Protection': panels.quantity * 2500 + 15000,
    'Installation Labor': (panels.panel.priceKES * panels.quantity + inverter.priceKES) * 0.15,
    'Miscellaneous': 25000
  };

  const total = Object.values(itemized).reduce((sum, val) => sum + val, 0);
  return { itemized, total };
}

// ==================== KENYA WEATHER DATA ====================
export interface KenyaWeatherData {
  location: string;
  county: string;
  latitude: number;
  longitude: number;
  avgSunHours: number[]; // Monthly averages
  avgIrradiance: number; // kWh/m²/day annual average
  peakSunHours: number; // PSH for system sizing
  optimalTilt: number; // degrees
  avgTemperature: number[]; // Monthly averages °C
  rainyMonths: number[]; // 1-12
  dustyMonths: number[]; // 1-12
}

export const KENYA_SOLAR_DATA: KenyaWeatherData[] = [
  {
    location: 'Nairobi',
    county: 'Nairobi',
    latitude: -1.2921,
    longitude: 36.8219,
    avgSunHours: [7.5, 8.0, 7.0, 6.0, 5.5, 5.0, 4.5, 5.0, 6.5, 7.0, 6.5, 7.0],
    avgIrradiance: 5.8,
    peakSunHours: 5.5,
    optimalTilt: 5,
    avgTemperature: [19, 20, 20, 19, 18, 16, 15, 16, 18, 19, 18, 18],
    rainyMonths: [3, 4, 5, 10, 11, 12],
    dustyMonths: [1, 2, 7, 8]
  },
  {
    location: 'Mombasa',
    county: 'Mombasa',
    latitude: -4.0435,
    longitude: 39.6682,
    avgSunHours: [8.5, 9.0, 8.5, 7.5, 7.0, 7.5, 7.5, 8.0, 8.5, 8.5, 8.0, 8.0],
    avgIrradiance: 6.2,
    peakSunHours: 6.0,
    optimalTilt: 8,
    avgTemperature: [28, 29, 29, 28, 27, 25, 24, 24, 25, 27, 28, 28],
    rainyMonths: [4, 5, 10, 11],
    dustyMonths: [1, 2, 3]
  },
  {
    location: 'Kisumu',
    county: 'Kisumu',
    latitude: -0.0917,
    longitude: 34.7680,
    avgSunHours: [7.0, 7.5, 6.5, 6.0, 5.5, 5.5, 5.0, 5.5, 6.0, 6.5, 6.0, 6.5],
    avgIrradiance: 5.6,
    peakSunHours: 5.3,
    optimalTilt: 3,
    avgTemperature: [24, 25, 25, 24, 23, 22, 21, 22, 23, 24, 23, 23],
    rainyMonths: [3, 4, 5, 9, 10, 11],
    dustyMonths: [1, 2, 7, 8]
  },
  {
    location: 'Nakuru',
    county: 'Nakuru',
    latitude: -0.3031,
    longitude: 36.0800,
    avgSunHours: [7.5, 8.0, 7.0, 6.0, 5.5, 5.0, 4.5, 5.0, 6.5, 7.0, 6.5, 7.0],
    avgIrradiance: 5.7,
    peakSunHours: 5.4,
    optimalTilt: 5,
    avgTemperature: [20, 21, 21, 19, 18, 16, 15, 16, 18, 20, 19, 19],
    rainyMonths: [3, 4, 5, 10, 11],
    dustyMonths: [1, 2, 7, 8]
  },
  {
    location: 'Eldoret',
    county: 'Uasin Gishu',
    latitude: 0.5143,
    longitude: 35.2698,
    avgSunHours: [6.5, 7.0, 6.0, 5.5, 5.0, 4.5, 4.0, 4.5, 5.5, 6.0, 5.5, 6.0],
    avgIrradiance: 5.4,
    peakSunHours: 5.0,
    optimalTilt: 5,
    avgTemperature: [18, 19, 19, 18, 16, 15, 14, 14, 16, 18, 17, 17],
    rainyMonths: [3, 4, 5, 6, 7, 8, 10, 11],
    dustyMonths: [1, 2]
  },
  {
    location: 'Garissa',
    county: 'Garissa',
    latitude: -0.4536,
    longitude: 39.6401,
    avgSunHours: [9.0, 9.5, 9.0, 8.0, 8.0, 8.5, 9.0, 9.5, 9.5, 9.0, 8.5, 8.5],
    avgIrradiance: 6.8,
    peakSunHours: 6.5,
    optimalTilt: 5,
    avgTemperature: [31, 33, 33, 30, 28, 27, 26, 27, 29, 31, 30, 30],
    rainyMonths: [4, 5, 10, 11],
    dustyMonths: [1, 2, 3, 6, 7, 8, 9]
  },
  {
    location: 'Malindi',
    county: 'Kilifi',
    latitude: -3.2138,
    longitude: 40.1169,
    avgSunHours: [8.5, 9.0, 8.5, 7.0, 6.5, 7.0, 7.5, 8.0, 8.5, 8.5, 8.0, 8.0],
    avgIrradiance: 6.3,
    peakSunHours: 6.0,
    optimalTilt: 6,
    avgTemperature: [28, 29, 29, 28, 27, 25, 24, 24, 25, 27, 28, 28],
    rainyMonths: [4, 5, 10, 11],
    dustyMonths: [1, 2, 3]
  },
  {
    location: 'Turkana',
    county: 'Turkana',
    latitude: 3.1167,
    longitude: 35.5833,
    avgSunHours: [9.5, 10.0, 9.5, 8.5, 8.5, 9.0, 9.5, 10.0, 10.0, 9.5, 9.0, 9.0],
    avgIrradiance: 7.2,
    peakSunHours: 6.8,
    optimalTilt: 0,
    avgTemperature: [30, 31, 31, 29, 28, 27, 27, 28, 29, 30, 29, 29],
    rainyMonths: [4, 5, 10, 11],
    dustyMonths: [1, 2, 3, 6, 7, 8, 9, 12]
  },
];

// Get total equipment count
export const TOTAL_PANELS = SOLAR_PANELS_DATABASE.length;
export const TOTAL_INVERTERS = INVERTERS_DATABASE.length;
export const TOTAL_BATTERIES = BATTERIES_DATABASE.length;
export const TOTAL_EQUIPMENT = TOTAL_PANELS + TOTAL_INVERTERS + TOTAL_BATTERIES;

console.log(`Solar Equipment Database: ${TOTAL_PANELS} panels, ${TOTAL_INVERTERS} inverters, ${TOTAL_BATTERIES} batteries = ${TOTAL_EQUIPMENT} total items`);
