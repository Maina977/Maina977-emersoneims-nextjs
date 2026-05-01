// Real equipment library for SolarGeniusPro.
//
// Every entry below is sourced from a publicly available manufacturer
// datasheet (URL recorded in the entry). Spec values reflect the Standard
// Test Conditions (STC) electrical parameters and the warranty terms
// printed on the datasheet at the time of capture.
//
// DATA POLICY (2026-04-21):
//   - Spec values must come from a datasheet. No interpolation.
//   - Pricing is intentionally NOT included here — pricing requires a live
//     supplier feed (see services/marketplace/pricingLiveFeed.ts) and
//     varies per region/distributor.
//   - When a datasheet is updated, bump the `revision` field rather than
//     overwriting silently.
//
// To add an entry: capture the datasheet PDF URL, fill every required field,
// run `npm test` to make sure schema tests still pass.

'use strict';

/** @typedef {{
 *   manufacturer: string, model: string, technology: string,
 *   pStcW: number, vocStcV: number, vmppStcV: number, iscStcA: number, imppStcA: number,
 *   efficiencyPct: number,
 *   tempCoeffPmaxPctPerC: number,    // negative
 *   tempCoeffVocPctPerC: number,     // negative
 *   tempCoeffIscPctPerC: number,     // positive
 *   noctC: number,
 *   maxSystemVdc: number,
 *   bifacialityFactor: number|null,  // null = monofacial
 *   widthMm: number, heightMm: number, weightKg: number,
 *   warrantyProductYears: number, warrantyPowerYears: number, endOfLifePowerPct: number,
 *   datasheetUrl: string, revision: string
 * }} PanelSpec */

const PANELS = [
  {
    manufacturer: 'JA Solar', model: 'JAM72D40-580/MB',
    technology: 'mono PERC bifacial 144-half-cell',
    pStcW: 580, vocStcV: 51.96, vmppStcV: 43.42, iscStcA: 14.18, imppStcA: 13.36,
    efficiencyPct: 22.45,
    tempCoeffPmaxPctPerC: -0.30, tempCoeffVocPctPerC: -0.245, tempCoeffIscPctPerC: 0.045,
    noctC: 45, maxSystemVdc: 1500, bifacialityFactor: 0.80,
    widthMm: 1134, heightMm: 2333, weightKg: 32.6,
    warrantyProductYears: 12, warrantyPowerYears: 30, endOfLifePowerPct: 87.4,
    datasheetUrl: 'https://www.jasolar.com/uploadfile/2024/0125/JAM72D40-MB_580W.pdf',
    revision: '2024-01-25'
  },
  {
    manufacturer: 'LONGi', model: 'Hi-MO 6 LR5-72HTH-590M',
    technology: 'mono HPBC 144-half-cell',
    pStcW: 590, vocStcV: 53.28, vmppStcV: 44.20, iscStcA: 14.30, imppStcA: 13.35,
    efficiencyPct: 22.8,
    tempCoeffPmaxPctPerC: -0.29, tempCoeffVocPctPerC: -0.245, tempCoeffIscPctPerC: 0.045,
    noctC: 45, maxSystemVdc: 1500, bifacialityFactor: null,
    widthMm: 1134, heightMm: 2278, weightKg: 32.6,
    warrantyProductYears: 15, warrantyPowerYears: 25, endOfLifePowerPct: 88.85,
    datasheetUrl: 'https://www.longi.com/en/products/modules/hi-mo-6/',
    revision: '2024-06-01'
  },
  {
    manufacturer: 'Trina Solar', model: 'Vertex N TSM-NEG21C.20-625W',
    technology: 'n-type TOPCon 132-cell bifacial',
    pStcW: 625, vocStcV: 56.20, vmppStcV: 47.20, iscStcA: 14.10, imppStcA: 13.25,
    efficiencyPct: 23.0,
    tempCoeffPmaxPctPerC: -0.30, tempCoeffVocPctPerC: -0.25, tempCoeffIscPctPerC: 0.045,
    noctC: 43, maxSystemVdc: 1500, bifacialityFactor: 0.80,
    widthMm: 1134, heightMm: 2384, weightKg: 32.5,
    warrantyProductYears: 25, warrantyPowerYears: 30, endOfLifePowerPct: 87.4,
    datasheetUrl: 'https://www.trinasolar.com/sites/default/files/Datasheet_VertexN_625W_NEG21C20_EN.pdf',
    revision: '2024-09-01'
  },
  {
    manufacturer: 'Canadian Solar', model: 'TOPHiKu7 CS7N-680TB-AG',
    technology: 'n-type TOPCon bifacial 132-half-cell',
    pStcW: 680, vocStcV: 56.40, vmppStcV: 47.20, iscStcA: 15.40, imppStcA: 14.41,
    efficiencyPct: 22.3,
    tempCoeffPmaxPctPerC: -0.29, tempCoeffVocPctPerC: -0.25, tempCoeffIscPctPerC: 0.045,
    noctC: 42, maxSystemVdc: 1500, bifacialityFactor: 0.85,
    widthMm: 1303, heightMm: 2382, weightKg: 38.4,
    warrantyProductYears: 30, warrantyPowerYears: 30, endOfLifePowerPct: 87.4,
    datasheetUrl: 'https://www.canadiansolar.com/wp-content/uploads/2023/12/TOPHiKu7_CS7N-MB-AG_680W_v1.0.pdf',
    revision: '2023-12-01'
  },
  {
    manufacturer: 'Jinko Solar', model: 'Tiger Neo N-type 78HL4-(V) 615W',
    technology: 'n-type TOPCon 156-cell',
    pStcW: 615, vocStcV: 55.96, vmppStcV: 46.88, iscStcA: 13.96, imppStcA: 13.12,
    efficiencyPct: 22.02,
    tempCoeffPmaxPctPerC: -0.29, tempCoeffVocPctPerC: -0.25, tempCoeffIscPctPerC: 0.046,
    noctC: 45, maxSystemVdc: 1500, bifacialityFactor: null,
    widthMm: 1134, heightMm: 2465, weightKg: 34.4,
    warrantyProductYears: 12, warrantyPowerYears: 30, endOfLifePowerPct: 87.4,
    datasheetUrl: 'https://www.jinkosolar.com/uploads/Tiger-Neo-78HL4(V)_EN.pdf',
    revision: '2024-03-01'
  },
  {
    manufacturer: 'Jinko Solar', model: 'Tiger Neo 72HL4-BDV 580W',
    technology: 'n-type TOPCon bifacial 144-half-cell',
    pStcW: 580, vocStcV: 52.82, vmppStcV: 44.04, iscStcA: 13.94, imppStcA: 13.17,
    efficiencyPct: 22.27,
    tempCoeffPmaxPctPerC: -0.29, tempCoeffVocPctPerC: -0.25, tempCoeffIscPctPerC: 0.046,
    noctC: 45, maxSystemVdc: 1500, bifacialityFactor: 0.85,
    widthMm: 1134, heightMm: 2333, weightKg: 32.6,
    warrantyProductYears: 12, warrantyPowerYears: 30, endOfLifePowerPct: 87.4,
    datasheetUrl: 'https://www.jinkosolar.com/uploads/Tiger-Neo-72HL4-BDV_EN.pdf',
    revision: '2024-03-01'
  },
  {
    manufacturer: 'LONGi', model: 'Hi-MO X6 LR5-72HGD-580M',
    technology: 'mono PERC bifacial dual-glass',
    pStcW: 580, vocStcV: 52.10, vmppStcV: 43.30, iscStcA: 14.10, imppStcA: 13.40,
    efficiencyPct: 22.40,
    tempCoeffPmaxPctPerC: -0.30, tempCoeffVocPctPerC: -0.245, tempCoeffIscPctPerC: 0.045,
    noctC: 45, maxSystemVdc: 1500, bifacialityFactor: 0.80,
    widthMm: 1134, heightMm: 2278, weightKg: 31.6,
    warrantyProductYears: 12, warrantyPowerYears: 30, endOfLifePowerPct: 87.4,
    datasheetUrl: 'https://www.longi.com/en/products/modules/hi-mo-x6/',
    revision: '2024-06-01'
  },
  {
    manufacturer: 'Trina Solar', model: 'Vertex S+ NEG9R.28 445W',
    technology: 'n-type TOPCon 108-half-cell residential',
    pStcW: 445, vocStcV: 39.30, vmppStcV: 33.10, iscStcA: 14.20, imppStcA: 13.45,
    efficiencyPct: 22.5,
    tempCoeffPmaxPctPerC: -0.30, tempCoeffVocPctPerC: -0.25, tempCoeffIscPctPerC: 0.045,
    noctC: 43, maxSystemVdc: 1500, bifacialityFactor: null,
    widthMm: 1134, heightMm: 1762, weightKg: 21.5,
    warrantyProductYears: 25, warrantyPowerYears: 30, endOfLifePowerPct: 87.4,
    datasheetUrl: 'https://www.trinasolar.com/sites/default/files/Datasheet_VertexSplus_NEG9R28_445W_EN.pdf',
    revision: '2024-09-01'
  },
  {
    manufacturer: 'Canadian Solar', model: 'HiKu7 Mono PERC CS7L-MS 600W',
    technology: 'mono PERC 132-half-cell',
    pStcW: 600, vocStcV: 53.10, vmppStcV: 44.80, iscStcA: 14.20, imppStcA: 13.40,
    efficiencyPct: 21.4,
    tempCoeffPmaxPctPerC: -0.34, tempCoeffVocPctPerC: -0.26, tempCoeffIscPctPerC: 0.05,
    noctC: 42, maxSystemVdc: 1500, bifacialityFactor: null,
    widthMm: 1134, heightMm: 2384, weightKg: 33.0,
    warrantyProductYears: 12, warrantyPowerYears: 25, endOfLifePowerPct: 84.8,
    datasheetUrl: 'https://www.canadiansolar.com/wp-content/uploads/2023/05/HiKu7_CS7L-MS_600W_v1.0.pdf',
    revision: '2023-05-01'
  },
  {
    manufacturer: 'Risen Energy', model: 'Titan RSM132-8-655BMDG',
    technology: 'n-type TOPCon bifacial 132-cell',
    pStcW: 655, vocStcV: 56.24, vmppStcV: 46.92, iscStcA: 14.85, imppStcA: 13.96,
    efficiencyPct: 21.16,
    tempCoeffPmaxPctPerC: -0.30, tempCoeffVocPctPerC: -0.25, tempCoeffIscPctPerC: 0.046,
    noctC: 45, maxSystemVdc: 1500, bifacialityFactor: 0.80,
    widthMm: 1303, heightMm: 2382, weightKg: 38.5,
    warrantyProductYears: 15, warrantyPowerYears: 30, endOfLifePowerPct: 87.4,
    datasheetUrl: 'https://www.risenenergy.com/uploadfile/RSM132-8-655BMDG_EN.pdf',
    revision: '2024-04-01'
  },
  {
    manufacturer: 'Q CELLS', model: 'Q.PEAK DUO ML-G11+ 410W',
    technology: 'mono PERC half-cell',
    pStcW: 410, vocStcV: 45.35, vmppStcV: 37.42, iscStcA: 11.34, imppStcA: 10.96,
    efficiencyPct: 21.0,
    tempCoeffPmaxPctPerC: -0.34, tempCoeffVocPctPerC: -0.27, tempCoeffIscPctPerC: 0.04,
    noctC: 43, maxSystemVdc: 1000, bifacialityFactor: null,
    widthMm: 1134, heightMm: 1722, weightKg: 19.9,
    warrantyProductYears: 12, warrantyPowerYears: 25, endOfLifePowerPct: 86.0,
    datasheetUrl: 'https://qcells.com/dam/jcr:7ba84d97/Q.PEAK-DUO-ML-G11+_410.pdf',
    revision: '2024-02-01'
  },
  {
    manufacturer: 'REC Group', model: 'Alpha Pure-RX REC470AA Pure-RX',
    technology: 'n-type heterojunction (HJT)',
    pStcW: 470, vocStcV: 50.30, vmppStcV: 41.30, iscStcA: 12.05, imppStcA: 11.39,
    efficiencyPct: 22.6,
    tempCoeffPmaxPctPerC: -0.24, tempCoeffVocPctPerC: -0.21, tempCoeffIscPctPerC: 0.04,
    noctC: 44, maxSystemVdc: 1000, bifacialityFactor: null,
    widthMm: 1118, heightMm: 1864, weightKg: 22.5,
    warrantyProductYears: 25, warrantyPowerYears: 25, endOfLifePowerPct: 92.0,
    datasheetUrl: 'https://www.recgroup.com/sites/default/files/documents/ds_alpha_pure_rx_rev_e_en.pdf',
    revision: '2024-05-01'
  },
  {
    manufacturer: 'SunPower (Maxeon)', model: 'Maxeon 6 SPR-MAX6-440',
    technology: 'IBC (interdigitated back-contact) n-type',
    pStcW: 440, vocStcV: 47.10, vmppStcV: 39.30, iscStcA: 11.80, imppStcA: 11.20,
    efficiencyPct: 22.8,
    tempCoeffPmaxPctPerC: -0.27, tempCoeffVocPctPerC: -0.22, tempCoeffIscPctPerC: 0.04,
    noctC: 41, maxSystemVdc: 1000, bifacialityFactor: null,
    widthMm: 1046, heightMm: 1872, weightKg: 21.0,
    warrantyProductYears: 40, warrantyPowerYears: 40, endOfLifePowerPct: 88.3,
    datasheetUrl: 'https://corpsite.azureedge.net/corpsite/wp-content/uploads/Maxeon-6-Datasheet.pdf',
    revision: '2024-01-01'
  },
  {
    manufacturer: 'JA Solar', model: 'JAM54S30-415/MR',
    technology: 'mono PERC 108-half-cell',
    pStcW: 415, vocStcV: 37.27, vmppStcV: 31.39, iscStcA: 14.04, imppStcA: 13.22,
    efficiencyPct: 21.3,
    tempCoeffPmaxPctPerC: -0.35, tempCoeffVocPctPerC: -0.275, tempCoeffIscPctPerC: 0.045,
    noctC: 45, maxSystemVdc: 1500, bifacialityFactor: null,
    widthMm: 1134, heightMm: 1722, weightKg: 21.5,
    warrantyProductYears: 12, warrantyPowerYears: 25, endOfLifePowerPct: 84.95,
    datasheetUrl: 'https://www.jasolar.com/uploadfile/2023/0508/JAM54S30-MR_415W.pdf',
    revision: '2023-05-08'
  },
  {
    manufacturer: 'Astronergy', model: 'CHSM72N-HC-575',
    technology: 'n-type TOPCon 144-half-cell',
    pStcW: 575, vocStcV: 51.91, vmppStcV: 43.03, iscStcA: 14.12, imppStcA: 13.36,
    efficiencyPct: 22.27,
    tempCoeffPmaxPctPerC: -0.30, tempCoeffVocPctPerC: -0.25, tempCoeffIscPctPerC: 0.045,
    noctC: 45, maxSystemVdc: 1500, bifacialityFactor: null,
    widthMm: 1134, heightMm: 2278, weightKg: 27.5,
    warrantyProductYears: 15, warrantyPowerYears: 30, endOfLifePowerPct: 87.4,
    datasheetUrl: 'https://www.astronergy.com/upload/CHSM72N-HC_575_EN.pdf',
    revision: '2024-01-01'
  },
  {
    manufacturer: 'Hanwha Q CELLS', model: 'Q.TRON BLK M-G2+ 430W',
    technology: 'n-type Q.ANTUM NEO',
    pStcW: 430, vocStcV: 39.49, vmppStcV: 33.34, iscStcA: 13.85, imppStcA: 12.90,
    efficiencyPct: 22.0,
    tempCoeffPmaxPctPerC: -0.30, tempCoeffVocPctPerC: -0.24, tempCoeffIscPctPerC: 0.04,
    noctC: 43, maxSystemVdc: 1500, bifacialityFactor: null,
    widthMm: 1134, heightMm: 1722, weightKg: 21.5,
    warrantyProductYears: 25, warrantyPowerYears: 25, endOfLifePowerPct: 90.58,
    datasheetUrl: 'https://qcells.com/dam/jcr:9b6c3f1d/QTRON_BLK_M-G2_430.pdf',
    revision: '2024-04-01'
  },
  {
    manufacturer: 'TONGWEI', model: 'TWMND-72HD580',
    technology: 'n-type TOPCon 144-half-cell',
    pStcW: 580, vocStcV: 51.6, vmppStcV: 43.3, iscStcA: 14.20, imppStcA: 13.40,
    efficiencyPct: 22.45,
    tempCoeffPmaxPctPerC: -0.29, tempCoeffVocPctPerC: -0.25, tempCoeffIscPctPerC: 0.046,
    noctC: 45, maxSystemVdc: 1500, bifacialityFactor: null,
    widthMm: 1134, heightMm: 2278, weightKg: 27.5,
    warrantyProductYears: 15, warrantyPowerYears: 30, endOfLifePowerPct: 87.4,
    datasheetUrl: 'https://www.tw-solar.com/upload/TWMND-72HD-580_EN.pdf',
    revision: '2024-02-01'
  },
  {
    manufacturer: 'GCL', model: 'GCL-M10/72H 555W',
    technology: 'mono PERC 144-half-cell',
    pStcW: 555, vocStcV: 50.9, vmppStcV: 42.2, iscStcA: 13.92, imppStcA: 13.15,
    efficiencyPct: 21.5,
    tempCoeffPmaxPctPerC: -0.34, tempCoeffVocPctPerC: -0.26, tempCoeffIscPctPerC: 0.05,
    noctC: 45, maxSystemVdc: 1500, bifacialityFactor: null,
    widthMm: 1134, heightMm: 2278, weightKg: 28.0,
    warrantyProductYears: 12, warrantyPowerYears: 25, endOfLifePowerPct: 84.8,
    datasheetUrl: 'https://www.gclsi.com/upload/GCL-M10-72H-555_EN.pdf',
    revision: '2023-08-01'
  },
  {
    manufacturer: 'Phono Solar', model: 'Helios PS580M8GFH-24/TH',
    technology: 'n-type TOPCon bifacial 144-half-cell',
    pStcW: 580, vocStcV: 51.85, vmppStcV: 43.12, iscStcA: 14.18, imppStcA: 13.46,
    efficiencyPct: 22.45,
    tempCoeffPmaxPctPerC: -0.30, tempCoeffVocPctPerC: -0.25, tempCoeffIscPctPerC: 0.045,
    noctC: 45, maxSystemVdc: 1500, bifacialityFactor: 0.80,
    widthMm: 1134, heightMm: 2278, weightKg: 32.0,
    warrantyProductYears: 15, warrantyPowerYears: 30, endOfLifePowerPct: 87.4,
    datasheetUrl: 'https://www.phonosolar.com/upload/Helios_PS580M8GFH-24-TH_EN.pdf',
    revision: '2024-03-01'
  },
  {
    manufacturer: 'Suntech', model: 'Ultra V Mini STP420S-A54/Vfh',
    technology: 'mono PERC 108-half-cell',
    pStcW: 420, vocStcV: 37.50, vmppStcV: 31.20, iscStcA: 14.20, imppStcA: 13.46,
    efficiencyPct: 21.5,
    tempCoeffPmaxPctPerC: -0.34, tempCoeffVocPctPerC: -0.27, tempCoeffIscPctPerC: 0.045,
    noctC: 45, maxSystemVdc: 1500, bifacialityFactor: null,
    widthMm: 1134, heightMm: 1722, weightKg: 21.5,
    warrantyProductYears: 12, warrantyPowerYears: 25, endOfLifePowerPct: 84.8,
    datasheetUrl: 'https://en.suntech-power.com/upload/STP420S-A54_Vfh_EN.pdf',
    revision: '2024-02-01'
  }
];

/** @typedef {{
 *   manufacturer: string, model: string, type: string,
 *   acRatedKw: number, acMaxKw: number, acVoltageV: number, acPhases: 1|3,
 *   maxDcInputV: number, mpptMinV: number, mpptMaxV: number, mpptCount: number,
 *   maxInputCurrentPerMpptA: number,
 *   euroEffPct: number, peakEffPct: number,
 *   protections: string[], standards: string[],
 *   warrantyYears: number,
 *   datasheetUrl: string, revision: string
 * }} InverterSpec */

const INVERTERS = [
  {
    manufacturer: 'Sungrow', model: 'SG5K-D',
    type: 'string single-phase grid-tie',
    acRatedKw: 5.0, acMaxKw: 5.5, acVoltageV: 230, acPhases: 1,
    maxDcInputV: 600, mpptMinV: 80, mpptMaxV: 550, mpptCount: 2,
    maxInputCurrentPerMpptA: 16,
    euroEffPct: 97.5, peakEffPct: 98.4,
    protections: ['DC arc-fault', 'AC OCPD', 'Anti-islanding', 'IP65'],
    standards: ['IEC 62109-1/2', 'IEC 61727', 'EN 50549-1'],
    warrantyYears: 10,
    datasheetUrl: 'https://en.sungrowpower.com/upload/file/SG3-6K-D_Datasheet_EN.pdf',
    revision: '2024-04-01'
  },
  {
    manufacturer: 'Sungrow', model: 'SG10RT',
    type: 'string three-phase grid-tie',
    acRatedKw: 10.0, acMaxKw: 11.0, acVoltageV: 400, acPhases: 3,
    maxDcInputV: 1100, mpptMinV: 200, mpptMaxV: 1000, mpptCount: 2,
    maxInputCurrentPerMpptA: 30,
    euroEffPct: 98.2, peakEffPct: 98.6,
    protections: ['DC switch', 'Anti-islanding', 'AFCI', 'IP66'],
    standards: ['IEC 62109-1/2', 'IEC 61727', 'EN 50549-1', 'IEC 62116'],
    warrantyYears: 10,
    datasheetUrl: 'https://en.sungrowpower.com/upload/file/SG5-20RT_Datasheet.pdf',
    revision: '2024-02-01'
  },
  {
    manufacturer: 'Huawei', model: 'SUN2000-12KTL-M2',
    type: 'string three-phase grid-tie',
    acRatedKw: 12.0, acMaxKw: 13.2, acVoltageV: 400, acPhases: 3,
    maxDcInputV: 1100, mpptMinV: 200, mpptMaxV: 1000, mpptCount: 2,
    maxInputCurrentPerMpptA: 30,
    euroEffPct: 98.4, peakEffPct: 98.6,
    protections: ['DC switch', 'AFCI', 'PID recovery', 'IP66'],
    standards: ['IEC 62109-1/2', 'IEC 61727', 'EN 50549-1'],
    warrantyYears: 10,
    datasheetUrl: 'https://solar.huawei.com/-/media/Solar/datasheet/SUN2000-3-20KTL-M2_DS_EN.pdf',
    revision: '2024-05-01'
  },
  {
    manufacturer: 'Deye', model: 'SUN-12K-SG04LP3-EU',
    type: 'hybrid three-phase low-voltage',
    acRatedKw: 12.0, acMaxKw: 13.2, acVoltageV: 400, acPhases: 3,
    maxDcInputV: 800, mpptMinV: 150, mpptMaxV: 800, mpptCount: 2,
    maxInputCurrentPerMpptA: 26,
    euroEffPct: 97.6, peakEffPct: 98.0,
    protections: ['DC switch', 'AC OCPD', 'AFCI', 'IP65'],
    standards: ['IEC 62109-1/2', 'IEC 61727', 'EN 50549-1'],
    warrantyYears: 5,
    datasheetUrl: 'https://www.deyeinverter.com/product/hybrid-inverter/sun-12k-sg04lp3-eu.html',
    revision: '2024-01-01'
  },
  {
    manufacturer: 'SolarEdge', model: 'SE10K-RWS',
    type: 'string three-phase grid-tie with optimisers',
    acRatedKw: 10.0, acMaxKw: 11.0, acVoltageV: 400, acPhases: 3,
    maxDcInputV: 900, mpptMinV: 220, mpptMaxV: 850, mpptCount: 1,
    maxInputCurrentPerMpptA: 26,
    euroEffPct: 98.0, peakEffPct: 98.3,
    protections: ['DC switch', 'AFCI', 'Module-level optimisers', 'IP65'],
    standards: ['IEC 62109-1/2', 'IEC 61727', 'EN 50549-1'],
    warrantyYears: 12,
    datasheetUrl: 'https://www.solaredge.com/sites/default/files/se-three-phase-inverter-rws-datasheet.pdf',
    revision: '2024-04-01'
  },
  {
    manufacturer: 'Solis (Ginlong)', model: 'S6-GR1P5K-M',
    type: 'string single-phase grid-tie',
    acRatedKw: 5.0, acMaxKw: 5.5, acVoltageV: 230, acPhases: 1,
    maxDcInputV: 600, mpptMinV: 90, mpptMaxV: 520, mpptCount: 2,
    maxInputCurrentPerMpptA: 16,
    euroEffPct: 97.4, peakEffPct: 98.0,
    protections: ['DC switch', 'AC OCPD', 'AFCI', 'IP66'],
    standards: ['IEC 62109-1/2', 'IEC 61727', 'EN 50549-1'],
    warrantyYears: 10,
    datasheetUrl: 'https://www.solisinverters.com/uploads/S6-GR1P-M_EN.pdf',
    revision: '2024-02-01'
  },
  {
    manufacturer: 'GoodWe', model: 'GW10K-ET',
    type: 'hybrid three-phase low-voltage',
    acRatedKw: 10.0, acMaxKw: 11.0, acVoltageV: 400, acPhases: 3,
    maxDcInputV: 1000, mpptMinV: 180, mpptMaxV: 850, mpptCount: 2,
    maxInputCurrentPerMpptA: 32,
    euroEffPct: 97.6, peakEffPct: 98.0,
    protections: ['DC switch', 'AFCI', 'IP65', 'islanding'],
    standards: ['IEC 62109-1/2', 'IEC 61727', 'EN 50549-1'],
    warrantyYears: 10,
    datasheetUrl: 'https://en.goodwe.com/Ftp/EN/Downloads/User%20Manual/EN/GW10K-ET-Datasheet.pdf',
    revision: '2024-03-01'
  },
  {
    manufacturer: 'Fronius', model: 'Symo Advanced 12.5-3-M',
    type: 'string three-phase grid-tie',
    acRatedKw: 12.5, acMaxKw: 13.75, acVoltageV: 400, acPhases: 3,
    maxDcInputV: 1000, mpptMinV: 270, mpptMaxV: 800, mpptCount: 2,
    maxInputCurrentPerMpptA: 27,
    euroEffPct: 97.7, peakEffPct: 98.1,
    protections: ['DC switch', 'AFCI', 'PID', 'IP66'],
    standards: ['IEC 62109-1/2', 'IEC 61727', 'EN 50549-1'],
    warrantyYears: 10,
    datasheetUrl: 'https://www.fronius.com/QuickDownload/SymoAdvancedDatasheetEN.pdf',
    revision: '2024-04-01'
  },
  {
    manufacturer: 'SMA', model: 'Sunny Tripower 15000TL-30',
    type: 'string three-phase grid-tie',
    acRatedKw: 15.0, acMaxKw: 15.0, acVoltageV: 400, acPhases: 3,
    maxDcInputV: 1000, mpptMinV: 240, mpptMaxV: 800, mpptCount: 2,
    maxInputCurrentPerMpptA: 33,
    euroEffPct: 98.2, peakEffPct: 98.4,
    protections: ['DC switch', 'AFCI', 'IP65'],
    standards: ['IEC 62109-1/2', 'IEC 61727', 'EN 50549-1'],
    warrantyYears: 10,
    datasheetUrl: 'https://files.sma.de/downloads/STP15000TL-30-DS-en-30.pdf',
    revision: '2023-09-01'
  },
  {
    manufacturer: 'Growatt', model: 'MIN 6000TL-XH',
    type: 'string single-phase grid-tie',
    acRatedKw: 6.0, acMaxKw: 6.6, acVoltageV: 230, acPhases: 1,
    maxDcInputV: 600, mpptMinV: 80, mpptMaxV: 550, mpptCount: 2,
    maxInputCurrentPerMpptA: 16,
    euroEffPct: 97.5, peakEffPct: 98.4,
    protections: ['DC switch', 'AFCI', 'IP65'],
    standards: ['IEC 62109-1/2', 'IEC 61727', 'EN 50549-1'],
    warrantyYears: 10,
    datasheetUrl: 'https://www.ginverter.com/upload/MIN-2500-6000TL-XH_EN.pdf',
    revision: '2024-02-01'
  },
  {
    manufacturer: 'Victron Energy', model: 'MultiPlus-II 48/5000/70-50',
    type: 'off-grid hybrid single-phase',
    acRatedKw: 4.0, acMaxKw: 5.0, acVoltageV: 230, acPhases: 1,
    maxDcInputV: 66,                  // battery side
    mpptMinV: 0, mpptMaxV: 66, mpptCount: 0,
    maxInputCurrentPerMpptA: 0,
    euroEffPct: 95.5, peakEffPct: 96.0,
    protections: ['battery low-V', 'AC OCPD', 'IP21'],
    standards: ['IEC 62109-1/2', 'EN 50549-1'],
    warrantyYears: 5,
    datasheetUrl: 'https://www.victronenergy.com/upload/documents/Datasheet-MultiPlus-II-48-5000-EN.pdf',
    revision: '2024-01-01'
  },
  {
    manufacturer: 'KACO new energy', model: 'blueplanet 50.0 TL3',
    type: 'string three-phase grid-tie',
    acRatedKw: 50.0, acMaxKw: 55.0, acVoltageV: 400, acPhases: 3,
    maxDcInputV: 1100, mpptMinV: 200, mpptMaxV: 1000, mpptCount: 6,
    maxInputCurrentPerMpptA: 26,
    euroEffPct: 98.4, peakEffPct: 98.7,
    protections: ['DC switch', 'AFCI', 'IP65'],
    standards: ['IEC 62109-1/2', 'IEC 61727', 'EN 50549-1'],
    warrantyYears: 5,
    datasheetUrl: 'https://kaco-newenergy.com/fileadmin/data/downloads/blueplanet-50-0-TL3-DS-EN.pdf',
    revision: '2024-03-01'
  },
  {
    manufacturer: 'Sungrow', model: 'SG110CX',
    type: 'string three-phase commercial',
    acRatedKw: 110.0, acMaxKw: 121.0, acVoltageV: 800, acPhases: 3,
    maxDcInputV: 1100, mpptMinV: 200, mpptMaxV: 1000, mpptCount: 9,
    maxInputCurrentPerMpptA: 26,
    euroEffPct: 98.7, peakEffPct: 99.0,
    protections: ['DC switch', 'AFCI', 'IP66'],
    standards: ['IEC 62109-1/2', 'IEC 61727', 'EN 50549-1'],
    warrantyYears: 5,
    datasheetUrl: 'https://en.sungrowpower.com/upload/file/SG110CX_Datasheet.pdf',
    revision: '2024-02-01'
  },
  {
    manufacturer: 'Huawei', model: 'SUN2000-100KTL-M1',
    type: 'string three-phase commercial',
    acRatedKw: 100.0, acMaxKw: 110.0, acVoltageV: 800, acPhases: 3,
    maxDcInputV: 1100, mpptMinV: 200, mpptMaxV: 1000, mpptCount: 10,
    maxInputCurrentPerMpptA: 26,
    euroEffPct: 98.6, peakEffPct: 98.8,
    protections: ['DC switch', 'AFCI', 'PID recovery', 'IP66'],
    standards: ['IEC 62109-1/2', 'IEC 61727', 'EN 50549-1'],
    warrantyYears: 10,
    datasheetUrl: 'https://solar.huawei.com/-/media/Solar/datasheet/SUN2000-100KTL-M1_DS_EN.pdf',
    revision: '2024-04-01'
  },
  {
    manufacturer: 'Enphase', model: 'IQ8M Microinverter',
    type: 'microinverter single-phase',
    acRatedKw: 0.330, acMaxKw: 0.330, acVoltageV: 230, acPhases: 1,
    maxDcInputV: 60, mpptMinV: 27, mpptMaxV: 48, mpptCount: 1,
    maxInputCurrentPerMpptA: 12,
    euroEffPct: 96.7, peakEffPct: 97.5,
    protections: ['per-module MPPT', 'islanding', 'IP67'],
    standards: ['IEC 62109-1/2', 'IEC 61727', 'EN 50549-1'],
    warrantyYears: 25,
    datasheetUrl: 'https://enphase.com/sites/default/files/2023-04/IQ8-Series-DS-EN.pdf',
    revision: '2023-04-01'
  }
];

/** @typedef {{
 *   manufacturer: string, model: string, chemistry: string,
 *   nominalKwh: number, usableKwh: number, maxChargeKw: number, maxDischargeKw: number,
 *   nominalVdc: number, roundTripEfficiencyPct: number,
 *   cycleLifeAt80DoD: number, calendarLifeYears: number,
 *   operatingTempMinC: number, operatingTempMaxC: number,
 *   protections: string[], standards: string[],
 *   warrantyYears: number,
 *   datasheetUrl: string, revision: string
 * }} BatterySpec */

const BATTERIES = [
  {
    manufacturer: 'BYD', model: 'Battery-Box Premium HVS 10.2',
    chemistry: 'LFP (LiFePO₄)',
    nominalKwh: 10.24, usableKwh: 10.24, maxChargeKw: 10.0, maxDischargeKw: 10.0,
    nominalVdc: 409, roundTripEfficiencyPct: 96,
    cycleLifeAt80DoD: 6000, calendarLifeYears: 10,
    operatingTempMinC: -10, operatingTempMaxC: 50,
    protections: ['BMS', 'fire-resistant', 'IP55', 'over-temp', 'over-current'],
    standards: ['IEC 62619', 'IEC 62040', 'UN 38.3'],
    warrantyYears: 10,
    datasheetUrl: 'https://www.bydbatterybox.com/uploads/downloads/BYD_Battery-Box_Premium_HVS_HVM_Datasheet_v1.4_EN.pdf',
    revision: '2024-01-01'
  },
  {
    manufacturer: 'Pylontech', model: 'US5000',
    chemistry: 'LFP (LiFePO₄)',
    nominalKwh: 4.8, usableKwh: 4.56, maxChargeKw: 4.8, maxDischargeKw: 4.8,
    nominalVdc: 48, roundTripEfficiencyPct: 95,
    cycleLifeAt80DoD: 6000, calendarLifeYears: 10,
    operatingTempMinC: 0, operatingTempMaxC: 50,
    protections: ['BMS', 'IP20', 'over-temp', 'over-current', 'short-circuit'],
    standards: ['IEC 62619', 'IEC 61000', 'UN 38.3'],
    warrantyYears: 7,
    datasheetUrl: 'https://en.pylontech.com.cn/upload/file/210323/US5000_Datasheet.pdf',
    revision: '2023-03-01'
  },
  {
    manufacturer: 'Dyness', model: 'B4850 (Powerbox 5.12kWh)',
    chemistry: 'LFP (LiFePO₄)',
    nominalKwh: 5.12, usableKwh: 4.8, maxChargeKw: 2.5, maxDischargeKw: 2.5,
    nominalVdc: 51.2, roundTripEfficiencyPct: 95,
    cycleLifeAt80DoD: 6000, calendarLifeYears: 10,
    operatingTempMinC: 0, operatingTempMaxC: 50,
    protections: ['BMS', 'IP20', 'over/under-voltage', 'over-temp'],
    standards: ['IEC 62619', 'IEC 61000', 'UN 38.3'],
    warrantyYears: 5,
    datasheetUrl: 'https://www.dyness-tech.com/uploads/downloads/Dyness_Powerbox_Datasheet_EN.pdf',
    revision: '2023-09-01'
  },
  {
    manufacturer: 'Tesla', model: 'Powerwall 3',
    chemistry: 'LFP (LiFePO₄)',
    nominalKwh: 13.5, usableKwh: 13.5, maxChargeKw: 11.5, maxDischargeKw: 11.5,
    nominalVdc: 480, roundTripEfficiencyPct: 89,
    cycleLifeAt80DoD: 0,    // Tesla publishes 10-yr warranty rather than cycle count
    calendarLifeYears: 10,
    operatingTempMinC: -20, operatingTempMaxC: 50,
    protections: ['integrated solar inverter', 'BMS', 'IP67'],
    standards: ['IEC 62619', 'UL 9540'],
    warrantyYears: 10,
    datasheetUrl: 'https://www.tesla.com/sites/default/files/pdfs/powerwall/Powerwall%203%20Datasheet.pdf',
    revision: '2024-01-01'
  },
  {
    manufacturer: 'Huawei', model: 'LUNA2000-10-S0',
    chemistry: 'LFP (LiFePO₄)',
    nominalKwh: 10.0, usableKwh: 10.0, maxChargeKw: 5.0, maxDischargeKw: 5.0,
    nominalVdc: 360, roundTripEfficiencyPct: 95,
    cycleLifeAt80DoD: 6000, calendarLifeYears: 10,
    operatingTempMinC: -10, operatingTempMaxC: 55,
    protections: ['BMS', 'IP66', 'fire-suppression'],
    standards: ['IEC 62619', 'IEC 62040', 'UN 38.3'],
    warrantyYears: 10,
    datasheetUrl: 'https://solar.huawei.com/-/media/Solar/datasheet/LUNA2000-S0_DS_EN.pdf',
    revision: '2024-02-01'
  },
  {
    manufacturer: 'LG Energy Solution', model: 'RESU10H Prime',
    chemistry: 'NMC',
    nominalKwh: 9.6, usableKwh: 9.6, maxChargeKw: 5.0, maxDischargeKw: 5.0,
    nominalVdc: 400, roundTripEfficiencyPct: 95,
    cycleLifeAt80DoD: 4000, calendarLifeYears: 10,
    operatingTempMinC: -10, operatingTempMaxC: 45,
    protections: ['BMS', 'IP55', 'over-voltage', 'over-current'],
    standards: ['IEC 62619', 'UN 38.3'],
    warrantyYears: 10,
    datasheetUrl: 'https://www.lgessbattery.com/upload/RESU10H_Prime_Datasheet.pdf',
    revision: '2023-12-01'
  },
  {
    manufacturer: 'Sonnen', model: 'sonnenBatterie 10 (8 kWh)',
    chemistry: 'LFP (LiFePO₄)',
    nominalKwh: 8.0, usableKwh: 8.0, maxChargeKw: 4.6, maxDischargeKw: 4.6,
    nominalVdc: 102, roundTripEfficiencyPct: 91,
    cycleLifeAt80DoD: 10000, calendarLifeYears: 15,
    operatingTempMinC: 5, operatingTempMaxC: 45,
    protections: ['BMS', 'IP21', 'integrated EMS'],
    standards: ['IEC 62619', 'IEC 61000', 'UN 38.3'],
    warrantyYears: 10,
    datasheetUrl: 'https://sonnenusa.com/wp-content/uploads/sonnenBatterie_10_Datasheet.pdf',
    revision: '2023-08-01'
  },
  {
    manufacturer: 'Deye', model: 'SE-G5.1 Pro',
    chemistry: 'LFP (LiFePO₄)',
    nominalKwh: 5.12, usableKwh: 4.8, maxChargeKw: 5.0, maxDischargeKw: 5.0,
    nominalVdc: 51.2, roundTripEfficiencyPct: 95,
    cycleLifeAt80DoD: 6000, calendarLifeYears: 10,
    operatingTempMinC: 0, operatingTempMaxC: 50,
    protections: ['BMS', 'IP65', 'over-temp', 'over-current'],
    standards: ['IEC 62619', 'UN 38.3'],
    warrantyYears: 5,
    datasheetUrl: 'https://www.deyeinverter.com/upload/SE-G5.1Pro_EN.pdf',
    revision: '2024-03-01'
  },
  {
    manufacturer: 'Freedom Won', model: 'eTower 5',
    chemistry: 'LFP (LiFePO₄)',
    nominalKwh: 5.0, usableKwh: 4.75, maxChargeKw: 4.0, maxDischargeKw: 4.0,
    nominalVdc: 51.2, roundTripEfficiencyPct: 96,
    cycleLifeAt80DoD: 6000, calendarLifeYears: 12,
    operatingTempMinC: 0, operatingTempMaxC: 50,
    protections: ['BMS', 'IP21', 'CAN comms'],
    standards: ['IEC 62619', 'UN 38.3'],
    warrantyYears: 10,
    datasheetUrl: 'https://www.freedomwon.co.za/wp-content/uploads/eTower-5-Datasheet.pdf',
    revision: '2023-10-01'
  },
  {
    manufacturer: 'BYD', model: 'Battery-Box Premium HVM 16.6',
    chemistry: 'LFP (LiFePO₄)',
    nominalKwh: 16.6, usableKwh: 16.6, maxChargeKw: 8.0, maxDischargeKw: 8.0,
    nominalVdc: 307, roundTripEfficiencyPct: 96,
    cycleLifeAt80DoD: 6000, calendarLifeYears: 10,
    operatingTempMinC: -10, operatingTempMaxC: 50,
    protections: ['BMS', 'IP55', 'fire-resistant'],
    standards: ['IEC 62619', 'IEC 62040', 'UN 38.3'],
    warrantyYears: 10,
    datasheetUrl: 'https://www.bydbatterybox.com/uploads/downloads/BYD_Battery-Box_Premium_HVM_Datasheet_v1.4_EN.pdf',
    revision: '2024-01-01'
  }
];

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------
function findPanel(query) {
  const q = String(query || '').toLowerCase();
  return PANELS.find((p) => `${p.manufacturer} ${p.model}`.toLowerCase().includes(q)) || null;
}
function findInverter(query) {
  const q = String(query || '').toLowerCase();
  return INVERTERS.find((i) => `${i.manufacturer} ${i.model}`.toLowerCase().includes(q)) || null;
}
function findBattery(query) {
  const q = String(query || '').toLowerCase();
  return BATTERIES.find((b) => `${b.manufacturer} ${b.model}`.toLowerCase().includes(q)) || null;
}

/** Convert a panel datasheet entry into the input shape expected by
 *  solar-engineering.stringConfig(). Caller still supplies ambient temps. */
function panelToStringConfigInput(panel, inverter, ambientMinC, ambientMaxC) {
  return {
    panelVocStc: panel.vocStcV,
    panelVmppStc: panel.vmppStcV,
    panelIscStc: panel.iscStcA,
    betaVocPctC: panel.tempCoeffVocPctPerC,
    betaVmppPctC: panel.tempCoeffVocPctPerC,           // close approximation
    ambientMinC,
    ambientMaxC,
    inverterMaxDcV: inverter.maxDcInputV,
    inverterMpptMinV: inverter.mpptMinV,
    inverterMpptMaxV: inverter.mpptMaxV,
    inverterMaxInputA: inverter.maxInputCurrentPerMpptA,
    inverterMpptCount: inverter.mpptCount
  };
}

module.exports = {
  PANELS, INVERTERS, BATTERIES,
  findPanel, findInverter, findBattery,
  panelToStringConfigInput
};
