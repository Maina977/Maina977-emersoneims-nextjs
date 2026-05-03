// Centralised typed-ish client for all SolarGeniusPro backend endpoints.
// All requests go through Vite's /api proxy -> http://localhost:3001
const BASE = '/api';

async function req<T = any>(path: string, opts: RequestInit = {}): Promise<T> {
  const url = path.startsWith('http') ? path : BASE + path;
  const res = await fetch(url, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) }
  });
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error || `HTTP ${res.status}`);
    return json;
  }
  // Non-JSON response (e.g. Next.js 404 HTML page). Read the text safely
  // and surface a clear error instead of letting downstream code call
  // `.json()` on HTML and explode with "Unexpected token '<', '<!DOCTYPE'".
  if (!res.ok) {
    const snippet = (await res.text().catch(() => '')).slice(0, 120);
    throw new Error(`HTTP ${res.status}${snippet ? ` — ${snippet}` : ''}`);
  }
  return (await res.blob()) as any;
}

const post = (p: string, body: any) => req(p, { method: 'POST', body: JSON.stringify(body) });
const get = (p: string) => req(p);
const patch = (p: string, body: any) => req(p, { method: 'PATCH', body: JSON.stringify(body) });

// ---------------- Finance ----------------
export const finance = {
  npv: (discountRate: number, cashFlows: number[]) => post('/finance/npv', { discountRate, cashFlows }),
  irr: (cashFlows: number[]) => post('/finance/irr', { cashFlows }),
  loan: (principal: number, annualRate: number, years: number) =>
    post('/finance/loan', { principal, annualRate, years }),
  inflation: (baseAmount: number, inflationRate: number, years: number) =>
    post('/finance/inflation', { baseAmount, inflationRate, years }),
  tariff: (category = 'DC2', kWh?: number) =>
    get(`/finance/tariff/${category}${kWh ? `?kWh=${kWh}` : ''}`),
  currency: (amount: number, from: string, to: string) =>
    get(`/finance/currency?amount=${amount}&from=${from}&to=${to}`),
  margin: (cost: number, sellingPrice: number) => post('/finance/margin', { cost, sellingPrice }),
  loanVsCash: (p: any) => post('/finance/loan-vs-cash', p)
};

// ---------------- Solar engineering ----------------
export const solar = {
  sunPosition: (lat: number, lon: number, time?: string) =>
    get(`/solar/sun-position?lat=${lat}&lon=${lon}${time ? `&time=${encodeURIComponent(time)}` : ''}`),
  sunPath: (date: string, lat: number, lon: number) =>
    get(`/solar/sun-path/${date}?lat=${lat}&lon=${lon}`),
  poa: (p: any) => post('/solar/poa', p),
  hourly: (p: any) => post('/solar/hourly', p),
  losses: (p: any) => post('/solar/losses', p),
  stringConfig: (p: any) => post('/solar/string-config', p),
  inverterMatch: (p: any) => post('/solar/inverter-match', p),
  soiling: (p: any) => post('/solar/soiling', p),
  seasonal: (lat: number, lon: number, year?: number) =>
    get(`/solar/seasonal?lat=${lat}&lon=${lon}${year ? `&year=${year}` : ''}`)
};

// ---------------- Reports ----------------
export const reports = {
  pdfBlob: (p: any) => post('/reports/pdf', p),
  proposalBlob: (p: any) => post('/reports/proposal', p),
  proposalDocxBlob: (p: any) => post('/reports/proposal-docx', p),
  proposalXlsxBlob: (p: any) => post('/reports/proposal-xlsx', p),
  xlsxBlob: (p: any) => post('/reports/xlsx', p),
  csv: (rows: any[]) => post('/reports/csv', { rows }),
  schematic: (p: any) => post('/reports/schematic', p),
  specSheet: (p: any) => post('/reports/spec-sheet', p)
};

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ---------------- Sustainability ----------------
export const sustain = {
  carbonFootprint: (annualKwh: number, country = 'KE') =>
    post('/sustain/carbon-footprint', { annualKwh, country }),
  solarOffset: (annualPvKwh: number, country = 'KE', projectYears = 25) =>
    post('/sustain/solar-offset', { annualPvKwh, country, projectYears }),
  carbonCredits: (tonnesCO2: number, marketTier = 'voluntary_avg') =>
    post('/sustain/carbon-credits', { tonnesCO2, marketTier }),
  evCharging: (p: any) => post('/sustain/ev-charging', p),
  microgrid: (p: any) => post('/sustain/microgrid', p),
  dieselVsSolar: (p: any) => post('/sustain/diesel-vs-solar', p),
  emissionFactors: () => get('/sustain/emission-factors')
};

// ---------------- Business / CRM ----------------
export const biz = {
  createSite: (p: any) => post('/biz/sites', p),
  listSites: () => get('/biz/sites'),
  portfolio: () => get('/biz/portfolio'),
  captureLead: (p: any) => post('/biz/leads', p),
  listLeads: () => get('/biz/leads'),
  setLeadStatus: (id: string, status: string) => patch(`/biz/leads/${id}/status`, { status }),
  createDeal: (p: any) => post('/biz/deals', p),
  moveDealStage: (id: string, stage: string) => patch(`/biz/deals/${id}/stage`, { stage }),
  pipeline: () => get('/biz/pipeline'),
  conversion: (days = 90) => get(`/biz/conversion?days=${days}`),
  recordJob: (p: any) => post('/biz/jobs', p),
  profit: () => get('/biz/profit'),
  getMode: () => get('/biz/mode'),
  setMode: (mode: 'beginner' | 'engineer') => post('/biz/mode', { mode })
};

// ---------------- Research stubs ----------------
export const research = {
  list: () => get('/research'),
  describe: (key: string) => get(`/research/${key}`),
  // Implemented free-tool features
  satelliteShading: (p: any) => post('/research/satellite-shading/run', p),
  faultPrediction: (p: any) => post('/research/ai-fault-prediction/run', p),
  nlpAdvisor: (query: string) => post('/research/nlp-advisor/run', { query }),
  satelliteSoiling: (p: any) => post('/research/satellite-soiling/run', p),
  ocrBom: (imageBase64: string) => post('/research/cv-bom/run', { imageBase64 }),
  loadForecast: (p: any) => post('/research/load-forecast/run', p),
  yieldValidation: (p: any) => post('/research/yield-validation/run', p),
  evRoute: (p: any) => post('/research/ev-route/run', p),
  touDispatch: (p: any) => post('/research/tou-dispatch/run', p),
  mqttConnect: (p: any) => post('/research/iot-mqtt/connect', p),
  mqttStatus: () => get('/research/iot-mqtt/status'),
  permitPack: (p: any) => post('/research/permit-pack/run', p),
  panelCounter: (p: any) => post('/research/panel-counter/run', p)
};

// ---------------- Existing legacy endpoints ----------------
export const core = {
  health: () => get('/health'),
  weather: (lat: number, lon: number) => get(`/weather/${lat}/${lon}`),
  nasa: (lat: number, lon: number) => get(`/nasa/solar/${lat}/${lon}`),
  marketPrices: () => get('/market/prices'),
  suppliers: () => get('/market/suppliers'),
  faults: () => get('/faults'),
  calculate: (p: any) => post('/solar/calculate', p),
  validateEngineering: (p: any) => post('/validate/engineering', p)
};

// ---------------- Site assessment helpers (the killer features) ----------------
export const site = {
  /** Geocode an address via OSM Nominatim (free, no API key). */
  geocode: (q: string) => get(`/geocode?q=${encodeURIComponent(q)}`),
  /** OSM-based roof footprint autofill at a coordinate. */
  roofAutofill: (p: { lat: number; lon: number; searchRadiusM?: number; assumedPitchDegrees?: number }) =>
    post('/solar/roof-autofill', p)
};

// ---------------- Equipment library ----------------
export const equipment = {
  panels: () => get('/equipment/panels'),
  inverters: () => get('/equipment/inverters'),
  batteries: () => get('/equipment/batteries')
};

// ---------------- Auto-design (full BOM) ----------------
export const autoDesign = (p: any) => post('/solar/auto-design', p);

// ---------------- Engineering BOS calculators (existing solar-engineering.js) ----------------
export const bos = {
  voltageDrop: (p: any) => post('/solar/voltage-drop', p),
  ocpdSizing:  (p: any) => post('/solar/ocpd-sizing', p),
  stringConfig:(p: any) => post('/solar/string-config', p),
  inverterMatch:(p: any) => post('/solar/inverter-match', p),
  bifacialGain:(p: any) => post('/solar/bifacial-gain', p),
  poaHayDavies:(p: any) => post('/solar/poa-haydavies', p),
  poaPerez:    (p: any) => post('/solar/poa-perez', p),
  soiling:     (p: any) => post('/solar/soiling', p),
  sld:         (p: any) => post('/solar/sld', p),
};

// ---------------- Engineering EXTRAS (Tier 1+2+3 — engineering-extras.js) ----------------
export const eng = {
  lightningRisk:        (p: any) => post('/eng/lightning-risk', p),
  batterySizing:        (p: any) => post('/eng/battery-sizing', p),
  netMeteringKE:        (p: any) => post('/eng/net-metering-ke', p),
  generatorDisplacement:(p: any) => post('/eng/generator-displacement', p),
  tariffSensitivity:    (p: any) => post('/eng/tariff-sensitivity', p),
  oAndMSchedule:        (p: any) => post('/eng/om-schedule', p),
  pricedBoq:            (p: any) => post('/eng/priced-boq', p),
  threePhaseImbalance:  (p: any) => post('/eng/three-phase-imbalance', p),
  geoRisk:              (p: any) => post('/eng/geo-risk', p),
  clientPortalLink:     (p: any) => post('/eng/client-portal-link', p),
};
// Engineering-Pro: Aurora-grade peer-reviewable calculators
export const engPro = {
  hourlyShading:        (p: any) => post('/engpro/hourly-shading', p),
  batteryMonteCarlo:    (p: any) => post('/engpro/battery-mc', p),
  lightningFull:        (p: any) => post('/engpro/lightning-full', p),
  pricedBoqFx:          (p: any) => post('/engpro/priced-boq-fx', p),
  geoRiskKE:            (p: any) => post('/engpro/geo-risk-ke', p),
  netMeteringTOU:       (p: any) => post('/engpro/net-metering-tou', p),
  structuralWind:       (p: any) => post('/engpro/structural-wind', p),
  p50p90:               (p: any) => post('/engpro/p50-p90', p),
  earthElectrode:       (p: any) => post('/engpro/earth-electrode', p),
  portalJwt:            (p: any) => post('/engpro/portal-jwt', p),
  portalRevoke:         (p: any) => post('/engpro/portal-revoke', p),
  portalVerify:         (p: any) => post('/engpro/portal-verify', p),
};

// =====================================================================
// ENGINEERING-ELITE — Tier-4 utility-scale / bankable
// =====================================================================
export const engElite = {
  tmy8760:           (p: any) => post('/engelite/tmy-8760', p),
  obstructions:      (p: any) => post('/engelite/obstructions', p),
  intervalMeter:     (p: any) => post('/engelite/interval-meter', p),
  memberStructural:  (p: any) => post('/engelite/member-structural', p),
  epraGridCode:      (p: any) => post('/engelite/epra-grid-code', p),
  gaOptimiser:       (p: any) => post('/engelite/ga-optimiser', p),
  panDegradation:    (p: any) => post('/engelite/pan-degradation', p),
};

// =====================================================================
// ENGINEERING-GLOBAL — Tier-5 global utility-scale, no upper limit
// =====================================================================
export const engGlobal = {
  epwImport:         (p: any) => post('/engglobal/epw-import', p),
  panOndParse:       (p: any) => post('/engglobal/pan-ond-parse', p),
  continuousBeam:    (p: any) => post('/engglobal/continuous-beam', p),
  gridCode:          (p: any) => post('/engglobal/grid-code', p),
  pvgisHourly:       (p: any) => post('/engglobal/pvgis-hourly', p),
  financePack:       (p: any) => post('/engglobal/finance-pack', p),
};

// =====================================================================
// ENGINEERING-APPROVAL — Tier-6 PE / Chartered Engineer sign-off pack
// =====================================================================
export const engApproval = {
  iec62446Report:    (p: any) => post('/engapproval/iec62446-report', p),
  singleLineDiagram: (p: any) => post('/engapproval/single-line-diagram', p),
  arcRsdCompliance:  (p: any) => post('/engapproval/arc-rsd-compliance', p),
  cableDerated:      (p: any) => post('/engapproval/cable-derated', p),
  nfpa855Battery:    (p: any) => post('/engapproval/nfpa855-battery', p),
  faaGlare:          (p: any) => post('/engapproval/faa-glare', p),
  signOffPackage:    (p: any) => post('/engapproval/sign-off-package', p),
};

// =====================================================================
// ARCHITECTURE-APPROVAL — Tier-7 Architect / Building Surveyor pack
// =====================================================================
export const archApproval = {
  windUplift:         (p: any) => post('/archapproval/wind-uplift', p),
  snowLoad:           (p: any) => post('/archapproval/snow-load', p),
  ballastSchedule:    (p: any) => post('/archapproval/ballast-schedule', p),
  roofReserve:        (p: any) => post('/archapproval/roof-reserve', p),
  fireSetback:        (p: any) => post('/archapproval/fire-setback', p),
  flashing:           (p: any) => post('/archapproval/flashing', p),
  neighbourShadow:    (p: any) => post('/archapproval/neighbour-shadow', p),
  ifcExport:          (p: any) => post('/archapproval/ifc-export', p),
  planningNarrative:  (p: any) => post('/archapproval/planning-narrative', p),
};
