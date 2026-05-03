/**
 * SolarGeniusPro unified dispatcher (CommonJS).
 *
 * Routes incoming requests to the real ported backend modules in
 * ./server/*.js. This is a faithful port of crc/server/index.js (Express)
 * adapted to Next.js Node runtime API routes.
 *
 * Returns a plain object:
 *   { status, body }                       — JSON response
 *   { status, body, headers, isBinary }    — Binary (PDF/XLSX/DOCX)
 *   null                                   — unknown route (caller -> 404)
 *
 * No fabricated data: anything not implemented returns 501 with a clear
 * note. Anything that needs env vars (M-Pesa, Paystack, etc.) returns 503
 * with the missing key name.
 */

'use strict';

// Lazy-loaded modules — required on first hit so cold-start cost is paid only
// for the family actually being called.
let fin, sus, solar, reports, biz, engPro, engElite, engGlobal, engExtras,
    eqLib, autoDesigner, sld, adv, research, faultsJson;

function loadFin()        { return fin        || (fin        = require('./server/financial')); }
function loadSus()        { return sus        || (sus        = require('./server/sustainability')); }
function loadSolar()      { return solar      || (solar      = require('./server/solar-engineering')); }
function loadReports()    { return reports    || (reports    = require('./server/reports')); }
function loadBiz()        { return biz        || (biz        = require('./server/business')); }
function loadEngPro()     { return engPro     || (engPro     = require('./server/engineering-pro')); }
function loadEngElite()   { return engElite   || (engElite   = require('./server/engineering-elite')); }
function loadEngGlobal()  { return engGlobal  || (engGlobal  = require('./server/engineering-global')); }
function loadEngExtras()  { return engExtras  || (engExtras  = require('./server/engineering-extras')); }
function loadEqLib()      { return eqLib      || (eqLib      = require('./server/equipment-library')); }
function loadAutoDes()    { return autoDesigner || (autoDesigner = require('./server/autoDesigner')); }
function loadSld()        { return sld        || (sld        = require('./server/sld-generator')); }
function loadAdv()        { return adv        || (adv        = require('./server/advanced-engines')); }
function loadResearch()   { return research   || (research   = require('./server/research-stubs')); }
function loadFaults()     { return faultsJson || (faultsJson = require('./data/fault-codes.json')); }

const num = (v, d = 0) => {
  const n = typeof v === 'string' ? parseFloat(v) : v;
  return Number.isFinite(n) ? n : d;
};

const okJson = (data, extra = {}) =>
  ({ status: 200, body: { success: true, data, ...extra } });

const errJson = (code, message, extra = {}) =>
  ({ status: code, body: { success: false, error: message, ...extra } });

function safe(fn) {
  try {
    const r = fn();
    if (r && typeof r.then === 'function') {
      return r.then((v) => v).catch((e) => errJson(e.statusCode || 400, e.message || String(e)));
    }
    return r;
  } catch (e) {
    return errJson(e.statusCode || 400, e.message || String(e));
  }
}

/**
 * Main dispatcher.
 *
 * @param {string} family    e.g. 'finance', 'sustain', 'solar', 'reports',
 *                           'biz', 'eng', 'engpro', 'engelite', 'engglobal',
 *                           'research', 'equipment', 'faults', 'market',
 *                           'archapproval', 'engapproval', 'pipeline',
 *                           'decision', 'simulation', 'governance',
 *                           'learning', 'digitaltwin'.
 * @param {string[]} segs    URL segments after /api/<family>/
 * @param {string} method    HTTP method (GET/POST/...)
 * @param {object} body      Parsed JSON body (or {} for GET)
 * @param {URLSearchParams|object} query  Query params
 * @returns {Promise<{status,body,headers?,isBinary?}|null>}
 */
async function dispatch(family, segs, method, body, query) {
  body = body || {};
  query = query || {};
  const q = (k) => (typeof query.get === 'function' ? query.get(k) : query[k]);
  const path = segs.join('/');

  // ─────────────────────────────────────────────────────────────────────
  // FAULTS — single endpoint
  // ─────────────────────────────────────────────────────────────────────
  if (family === 'faults') {
    const f = loadFaults();
    const list = Array.isArray(f.faults) ? f.faults : Object.values(f.faults || {});
    return okJson(list, { provenance: f._provenance || null, count: list.length });
  }

  // ─────────────────────────────────────────────────────────────────────
  // EQUIPMENT — panels / inverters / batteries
  // ─────────────────────────────────────────────────────────────────────
  if (family === 'equipment') {
    const lib = loadEqLib();
    if (segs[0] === 'panels')    return okJson(lib.PANELS,    { count: lib.PANELS.length });
    if (segs[0] === 'inverters') return okJson(lib.INVERTERS, { count: lib.INVERTERS.length });
    if (segs[0] === 'batteries') return okJson(lib.BATTERIES, { count: lib.BATTERIES.length });
    return null;
  }

  // ─────────────────────────────────────────────────────────────────────
  // FINANCE
  // ─────────────────────────────────────────────────────────────────────
  if (family === 'finance') {
    const f = loadFin();
    if (path === 'npv') {
      if (!Array.isArray(body.cashFlows)) return errJson(400, 'cashFlows array is required');
      const value = f.npv(num(body.discountRate, 0.10), body.cashFlows.map(Number));
      return okJson(
        { npv: Math.round(value * 100) / 100, discountRate: num(body.discountRate, 0.10), periods: body.cashFlows.length },
        { provenance: { method: 'Discounted cash flow (Brealey & Myers)' } },
      );
    }
    if (path === 'irr') {
      if (!Array.isArray(body.cashFlows)) return errJson(400, 'cashFlows array is required');
      const r = f.irr(body.cashFlows.map(Number), num(body.guess, 0.1));
      return okJson(
        { irr: r != null ? Math.round(r * 10000) / 10000 : null, irrPct: r != null ? Math.round(r * 10000) / 100 : null },
        { provenance: { method: 'Newton–Raphson with bisection fallback' } },
      );
    }
    if (path === 'loan') {
      if (!body.principal || !body.annualRate || !body.years) return errJson(400, 'principal, annualRate, years are required');
      const result = f.amortize(num(body.principal), num(body.annualRate), num(body.years), num(body.paymentsPerYear, 12));
      return okJson(
        { ...result, schedule: result.schedule.slice(0, 12), scheduleLength: result.schedule.length },
        { provenance: { method: 'Standard PMT annuity formula (ISO 31-11)' } },
      );
    }
    if (path === 'inflation') {
      if (!body.baseAmount) return errJson(400, 'baseAmount is required');
      const series = f.inflateSeries(num(body.baseAmount), num(body.inflationRate, 0.07), num(body.years, 20));
      return okJson({
        series,
        summary: { startNominal: series[0]?.nominal, endNominal: series[series.length - 1]?.nominal },
      }, { provenance: { method: 'Compound inflation: F = P(1+i)^t' } });
    }
    if (path === 'margin') {
      return okJson(f.profitMargin(body), { provenance: { method: 'Standard gross-margin & markup formulas' } });
    }
    if (path === 'loan-vs-cash') {
      if (!body.systemCost || !body.annualSavings) return errJson(400, 'systemCost and annualSavings are required');
      const result = f.loanVsCash({
        systemCost: num(body.systemCost),
        annualSavings: num(body.annualSavings),
        years: num(body.years, 20),
        loanRate: num(body.loanRate, 0.14),
        downPaymentPct: num(body.downPaymentPct, 0.2),
        discountRate: num(body.discountRate, 0.10),
      });
      return okJson(result, { provenance: { method: 'NPV + IRR comparison; loan via PMT amortization' } });
    }
    if (segs[0] === 'tariff') {
      const category = segs[1] || 'DC2';
      const kWh = q('kWh');
      if (kWh) {
        const bill = f.kplcMonthlyBill(num(kWh), category);
        return okJson(bill, { provenance: { source: f.KPLC_TARIFFS_2026.source } });
      }
      return okJson(f.KPLC_TARIFFS_2026, { provenance: { source: f.KPLC_TARIFFS_2026.source } });
    }
    if (path === 'currency') {
      try {
        const result = await f.convertCurrency(num(q('amount'), 1), String(q('from') || 'USD').toUpperCase(), String(q('to') || 'KES').toUpperCase());
        return okJson(result);
      } catch (e) {
        return errJson(e.statusCode || 502, e.message);
      }
    }
    return null;
  }

  // ─────────────────────────────────────────────────────────────────────
  // SUSTAIN
  // ─────────────────────────────────────────────────────────────────────
  if (family === 'sustain') {
    const s = loadSus();
    if (path === 'carbon-footprint') {
      if (!body.annualKwh) return errJson(400, 'annualKwh is required');
      return okJson(s.carbonFootprint({ annualKwh: num(body.annualKwh), country: body.country || 'KE' }));
    }
    if (path === 'solar-offset') {
      if (!body.annualPvKwh) return errJson(400, 'annualPvKwh is required');
      return okJson(s.solarOffset({
        annualPvKwh: num(body.annualPvKwh), country: body.country || 'KE',
        projectYears: num(body.projectYears, 25), panelDegradationPct: num(body.panelDegradationPct, 0.5),
      }));
    }
    if (path === 'carbon-credits') {
      if (!body.tonnesCO2) return errJson(400, 'tonnesCO2 is required');
      return okJson(s.carbonCredits({
        tonnesCO2: num(body.tonnesCO2), marketTier: body.marketTier || 'voluntary_avg',
        exchangeRateKesPerUsd: num(body.exchangeRateKesPerUsd, 130),
      }));
    }
    if (path === 'ev-charging')      return okJson(s.evCharging(body));
    if (path === 'microgrid')        return okJson(s.microgridSizing(body));
    if (path === 'diesel-vs-solar')  return okJson(s.dieselVsSolar(body));
    if (path === 'emission-factors') return okJson(s.GRID_EMISSION_FACTORS, { provenance: { source: s.GRID_EMISSION_FACTORS.source } });
    return null;
  }

  // ─────────────────────────────────────────────────────────────────────
  // SOLAR
  // ─────────────────────────────────────────────────────────────────────
  if (family === 'solar') {
    const sg = loadSolar();
    if (path === 'sun-position') {
      const lat = num(q('lat'));
      const lon = num(q('lon'));
      if (q('lat') == null || q('lon') == null) return errJson(400, 'lat and lon are required');
      const t = q('time') ? new Date(q('time')) : new Date();
      const p = sg.sunPosition(lat, lon, t);
      return okJson({ lat, lon, timeUTC: t.toISOString(), ...p }, { provenance: { algorithm: 'Michalsky 1988', accuracyDeg: 0.01 } });
    }
    if (segs[0] === 'sun-path' && segs[1]) {
      if (q('lat') == null || q('lon') == null) return errJson(400, 'lat and lon are required');
      const path2 = sg.sunPathDay(num(q('lat')), num(q('lon')), segs[1]);
      return okJson({ date: segs[1], lat: num(q('lat')), lon: num(q('lon')), samples: path2 }, { provenance: { algorithm: 'Michalsky 1988 hourly samples (UTC)' } });
    }
    if (path === 'poa')             return okJson(sg.poaIrradiance(body),         { provenance: { models: ['Erbs 1982', 'Liu & Jordan 1960'] } });
    if (path === 'poa-haydavies') {
      const { panelTilt, panelAz, ...rest } = body;
      return okJson(sg.poaIrradianceHayDavies({ ...rest, tilt: panelTilt, azimuth: panelAz }), { provenance: { models: ['Hay & Davies 1980'] } });
    }
    if (path === 'poa-perez') {
      const { panelTilt, panelAz, ...rest } = body;
      return okJson(sg.poaIrradiancePerez({ ...rest, tilt: panelTilt, azimuth: panelAz }), { provenance: { models: ['Perez et al. 1990'] } });
    }
    if (path === 'bifacial-gain')   return okJson(sg.bifacialGain(body),          { provenance: { models: ['First-order bifacial rear-irradiance estimator'] } });
    if (path === 'hourly')          return okJson(sg.hourlySimulation(body),      { provenance: { models: ['Michalsky', 'Erbs', 'Liu–Jordan', 'King 2004', 'NREL SAM loss stack'] } });
    if (path === 'losses')          { const r = sg.systemLossBreakdown(body); return okJson(r, { provenance: { source: r.source } }); }
    if (path === 'string-config')   { const r = sg.stringConfig(body);        return okJson(r, { provenance: { source: r.source } }); }
    if (path === 'inverter-match')  { const r = sg.inverterMatch(body);       return okJson(r, { provenance: { source: r.source } }); }
    if (path === 'soiling')         { const r = sg.soilingDerate(body);       return okJson(r, { provenance: { source: r.source } }); }
    if (path === 'voltage-drop')    return okJson(sg.recommendConductor(body));
    if (path === 'ocpd-sizing')     return okJson(sg.ocpdSizing(body));
    if (path === 'seasonal') {
      if (q('lat') == null || q('lon') == null) return errJson(400, 'lat and lon are required');
      const r = sg.seasonalProfile({ lat: num(q('lat')), lon: num(q('lon')), year: q('year') ? num(q('year')) : undefined });
      return okJson(r, { provenance: { source: r.source } });
    }
    if (path === 'auto-design') {
      const design = loadAutoDes().autoDesign(body);
      return okJson(design, { provenance: { standards: design.standards } });
    }
    if (path === 'sld') {
      const svg = loadSld().generateSLD(body || {});
      return { status: 200, body: svg, headers: { 'Content-Type': 'image/svg+xml' }, isBinary: true };
    }
    return null;
  }

  // ─────────────────────────────────────────────────────────────────────
  // REPORTS — most return binary buffers
  // ─────────────────────────────────────────────────────────────────────
  if (family === 'reports') {
    const r = loadReports();
    if (path === 'pdf') {
      const buf = r.buildPdf(body);
      return { status: 200, body: buf, headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="report-${Date.now()}.pdf"` }, isBinary: true };
    }
    if (path === 'xlsx') {
      const buf = r.buildXlsx(body);
      return { status: 200, body: buf, headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Content-Disposition': `attachment; filename="report-${Date.now()}.xlsx"` }, isBinary: true };
    }
    if (path === 'csv') {
      const csv = r.buildCsv(body.rows || [], body.options || {});
      return { status: 200, body: csv, headers: { 'Content-Type': 'text/csv', 'Content-Disposition': `attachment; filename="report-${Date.now()}.csv"` }, isBinary: true };
    }
    if (path === 'proposal') {
      // Original used report-assets to render charts via sharp — skipped for serverless.
      const buf = r.buildProposal({ ...body, assets: {} });
      return { status: 200, body: buf, headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="proposal-${Date.now()}.pdf"` }, isBinary: true };
    }
    if (path === 'proposal-docx') {
      const buf = await r.buildProposalDocx({ ...body, assets: {} });
      return { status: 200, body: buf, headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'Content-Disposition': `attachment; filename="proposal-${Date.now()}.docx"` }, isBinary: true };
    }
    if (path === 'proposal-xlsx') {
      const buf = await r.buildProposalXlsx(body);
      return { status: 200, body: Buffer.from(buf), headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Content-Disposition': `attachment; filename="proposal-${Date.now()}.xlsx"` }, isBinary: true };
    }
    if (path === 'schematic')  return okJson(r.singleLineSchematic(body), { provenance: { standard: 'IEC 60617 / IEEE 315' } });
    if (path === 'spec-sheet') return okJson(r.specSheet(body),           { provenance: { source: 'Manufacturer datasheet — values supplied by caller' } });
    return null;
  }

  // ─────────────────────────────────────────────────────────────────────
  // BIZ — sites / leads / deals / pipeline / conversion / profit / mode
  // (in-memory state — does not persist across serverless instances)
  // ─────────────────────────────────────────────────────────────────────
  if (family === 'biz') {
    const b = loadBiz();
    if (path === 'sites' && method === 'POST') {
      if (!body.name) return errJson(400, 'name required');
      return okJson(b.createSite(body));
    }
    if (path === 'sites')      return okJson(b.listSites(query));
    if (path === 'portfolio')  return okJson(b.portfolioSummary());
    if (path === 'leads' && method === 'POST') {
      if (!body.name || !(body.email || body.phone)) return errJson(400, 'name and email|phone required');
      return okJson(b.captureLead(body));
    }
    if (path === 'leads')      return okJson(b.listLeads(query));
    if (segs[0] === 'leads' && segs[2] === 'status') {
      const r = b.updateLeadStatus(segs[1], body.status);
      if (!r) return errJson(404, 'lead not found');
      return okJson(r);
    }
    if (path === 'deals' && method === 'POST') {
      if (!body.title) return errJson(400, 'title required');
      return okJson(b.createDeal(body));
    }
    if (segs[0] === 'deals' && segs[2] === 'stage') {
      const r = b.moveDealStage(segs[1], body.stage);
      if (!r) return errJson(404, 'deal not found');
      if (r.error) return errJson(400, r.error);
      return okJson(r);
    }
    if (path === 'pipeline')   return okJson({ stages: b.PIPELINE_STAGES, ...b.pipelineSummary() });
    if (path === 'conversion') return okJson(b.conversionFunnel(num(q('days'), 90)));
    if (path === 'jobs' && method === 'POST') return okJson(b.recordJob(body));
    if (path === 'profit')     return okJson(b.profitSummary());
    if (path === 'mode' && method === 'GET')  return okJson({ mode: b.getMode() });
    if (path === 'mode' && method === 'POST') {
      const r = b.setMode(body.mode);
      if (r.error) return errJson(400, r.error);
      return okJson(r);
    }
    return null;
  }

  // ─────────────────────────────────────────────────────────────────────
  // ENG (extras) — Tier 1+2+3 calculators
  // ─────────────────────────────────────────────────────────────────────
  if (family === 'eng') {
    const e = loadEngExtras();
    const map = {
      'lightning-risk': e.lightningRiskClass,
      'battery-sizing': e.batterySizing,
      'net-metering-ke': e.netMeteringKenya,
      'generator-displacement': e.generatorDisplacement,
      'tariff-sensitivity': e.tariffSensitivity,
      'om-schedule': e.oAndMSchedule,
      'priced-boq': e.pricedBoq,
      'three-phase-imbalance': e.threePhaseImbalance,
      'geo-risk': e.geoRisk,
      'client-portal-link': e.clientPortalLink,
    };
    if (map[path]) {
      try {
        const result = map[path](body);
        const data = result && typeof result.then === 'function' ? await result : result;
        return okJson(data);
      } catch (err) {
        return errJson(400, err.message);
      }
    }
    return null;
  }

  // ─────────────────────────────────────────────────────────────────────
  // ENGPRO — Aurora-grade
  // ─────────────────────────────────────────────────────────────────────
  if (family === 'engpro') {
    const e = loadEngPro();
    const map = {
      'hourly-shading': e.hourlyShading,
      'battery-mc': e.batterySizingMonteCarlo,
      'lightning-full': e.lightningRiskFull,
      'priced-boq-fx': e.pricedBoqFx,
      'geo-risk-ke': e.geoRiskKE,
      'net-metering-tou': e.netMeteringTOU,
      'structural-wind': e.structuralWindBallast,
      'p50-p90': e.p50p90Yield,
      'earth-electrode': e.earthElectrodeBS7430,
      'portal-jwt': e.clientPortalJwt,
      'portal-revoke': e.clientPortalRevoke,
      'portal-verify': e.clientPortalVerify,
    };
    if (map[path]) {
      try {
        const result = map[path](body);
        const data = result && typeof result.then === 'function' ? await result : result;
        return okJson(data);
      } catch (err) { return errJson(400, err.message); }
    }
    return null;
  }

  // ─────────────────────────────────────────────────────────────────────
  // ENGELITE — Tier-4 utility-scale / bankable
  // ─────────────────────────────────────────────────────────────────────
  if (family === 'engelite') {
    const e = loadEngElite();
    const map = {
      'tmy-8760': e.tmy8760Simulation,
      'obstructions': e.obstructionsToHorizon,
      'interval-meter': e.intervalMeterIngest,
      'member-structural': e.memberStructural,
      'epra-grid-code': e.epraGridCodePack,
      'ga-optimiser': e.gaOptimiser,
      'pan-degradation': e.panDegradation,
    };
    if (map[path]) {
      try {
        const result = map[path](body);
        const data = result && typeof result.then === 'function' ? await result : result;
        return okJson(data);
      } catch (err) { return errJson(400, err.message); }
    }
    return null;
  }

  // ─────────────────────────────────────────────────────────────────────
  // ENGGLOBAL — Tier-5 utility-scale
  // ─────────────────────────────────────────────────────────────────────
  if (family === 'engglobal') {
    const e = loadEngGlobal();
    const map = {
      'epw-import': e.epwTmyImport,
      'pan-ond-parse': e.panOndFullParse,
      'continuous-beam': e.continuousBeamFE,
      'grid-code': e.globalGridCodePack,
      'pvgis-hourly': e.pvgisHourlyFetch,
      'finance-pack': e.globalFinancePack,
    };
    if (map[path]) {
      try {
        const result = map[path](body);
        const data = result && typeof result.then === 'function' ? await result : result;
        return okJson(data);
      } catch (err) { return errJson(400, err.message); }
    }
    return null;
  }

  // ─────────────────────────────────────────────────────────────────────
  // RESEARCH — catalogue + 501 stubs (research-impl skipped)
  // ─────────────────────────────────────────────────────────────────────
  if (family === 'research') {
    const rs = loadResearch();
    if (segs.length === 0) return okJson(rs.listAll(), { count: rs.listAll().length });
    if (segs.length === 1) {
      const item = rs.describe(segs[0]);
      if (!item) return errJson(404, 'unknown research feature key');
      return okJson({ key: segs[0], ...item });
    }
    if (segs[1] === 'invoke') {
      const item = rs.describe(segs[0]);
      if (!item) return errJson(404, 'unknown research feature key');
      return {
        status: 501,
        body: {
          success: false,
          error: 'Not yet implemented in this deployment',
          feature: item.feature, requires: item.requires,
          free_alternative: item.free_alternative, note: item.note,
          data_policy: 'Per project policy, this endpoint will not return synthesized data.',
        },
      };
    }
    return null;
  }

  // ─────────────────────────────────────────────────────────────────────
  // ADVANCED ENGINES — decision/simulation/governance/learning/twin/market/pipeline
  // ─────────────────────────────────────────────────────────────────────
  if (['decision', 'simulation', 'governance', 'learning', 'digitaltwin', 'market', 'pipeline'].includes(family)) {
    const a = loadAdv();
    const key = `${family}/${path}`;
    const map = {
      'decision/optimize':           a.optimize,
      'decision/recommend':          a.recommend,
      'decision/risk':               a.assessRisk,
      'decision/confidence':         a.scoreConfidence,
      'simulation/energy':           a.simulateEnergy,
      'simulation/financial':        a.simulateFinancial,
      'simulation/load-behavior':    a.simulateLoadBehavior,
      'simulation/whatif':           a.whatIf,
      'governance/audit':            a.auditLog,
      'governance/bias':             a.detectBias,
      'governance/drift':            a.detectDrift,
      'governance/explain':          a.explain,
      'pipeline/clean':              a.cleanData,
      'pipeline/normalize':          a.normalize,
      'pipeline/validate-solar':     a.validateSolarData,
      'learning/feedback':           a.recordFeedback,
      'learning/performance':        a.trackPerformance,
      'digitaltwin/lifecycle':       a.lifecycle,
      'market/supplier-score':       a.scoreSupplier,
    };
    if (map[key]) {
      try {
        const data = map[key](body);
        return okJson(data, { provenance: { engine: key } });
      } catch (err) { return errJson(400, err.message); }
    }
    if (family === 'governance' && path === 'audit' && method === 'GET') {
      return okJson(a.auditQuery(query || {}));
    }
    if (family === 'governance' && path === 'audit/stats') {
      return okJson(a.auditStatistics({
        tenantId: q('tenantId'),
        hoursBack: q('hoursBack') ? num(q('hoursBack')) : 24,
      }));
    }
    return null;
  }

  return null;
}

module.exports = { dispatch };
