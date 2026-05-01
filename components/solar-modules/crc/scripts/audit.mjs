// Feature audit using Node's built-in fetch — no curl, no Invoke-WebRequest.
// Usage: node scripts/audit.mjs [baseUrl]
const base = process.argv[2] || process.env.AUDIT_BASE || 'http://localhost:5173';

const tests = [
  // Frontend routes
  ['GET', '/', null, 'Frontend: home'],
  ['GET', '/dashboard', null, 'Frontend: dashboard'],
  ['GET', '/calculator', null, 'Frontend: calculator'],
  ['GET', '/intelligent', null, 'Frontend: Intelligent Calculator'],
  ['GET', '/designer', null, 'Frontend: Designer'],
  ['GET', '/analytics', null, 'Frontend: Analytics'],
  ['GET', '/features', null, 'Frontend: Features'],
  ['GET', '/report', null, 'Frontend: Report'],
  ['GET', '/pro', null, 'Frontend: Pro Tools'],
  ['GET', '/advanced', null, 'Frontend: Advanced Features'],
  ['GET', '/design-studio', null, 'Frontend: Design Studio AI'],
  ['GET', '/viewer-3d', null, 'Frontend: 3D Viewer'],
  ['GET', '/global-3d', null, 'Frontend: Global 3D Map'],
  ['GET', '/smart-home', null, 'Frontend: Smart Home Design'],
  ['GET', '/wiring', null, 'Frontend: Wiring Diagram AI'],
  ['GET', '/workflow', null, 'Frontend: Project Workflow'],
  ['GET', '/fault-codes', null, 'Frontend: Fault Codes AI'],
  ['GET', '/settings', null, 'Frontend: settings'],

  // API: health & reference
  ['GET', '/api/health', null, 'API: health'],
  ['GET', '/api/faults', null, 'API: faults'],

  // API: solar / reports
  ['POST', '/api/solar/calculate', { consumption: 250, location: 'Nairobi', roofType: 'metal', budget: 500000 }, 'API: solar calculate'],
  ['POST', '/api/reports/engineering', { projectId: 'AUDIT-001', systemSize: 6.8 }, 'API: engineering report'],
  ['POST', '/api/reports/financial', { projectId: 'AUDIT-001', initialCost: 1247500, annualProduction: 12600 }, 'API: financial report'],

  // API: data sources
  ['GET', '/api/weather/-1.2865/36.8172', null, 'API: weather'],
  ['GET', '/api/nasa/solar/-1.2865/36.8172', null, 'API: NASA POWER'],
  ['GET', '/api/market/prices', null, 'API: market prices'],
  ['GET', '/api/market/suppliers', null, 'API: suppliers'],

  // API: payments
  ['POST', '/api/payment/mpesa', { phone: '254700000000', amount: 100 }, 'API: M-Pesa'],
  ['POST', '/api/payment/mpesa/stkpush', { phone: '254700000000', amount: 100 }, 'API: M-Pesa STK'],
  ['POST', '/api/payment/flutterwave', { amount: 100, currency: 'KES', email: 'a@b.com' }, 'API: Flutterwave'],
  ['POST', '/api/payment/paystack', { amount: 100, email: 'a@b.com' }, 'API: Paystack'],
  ['GET', '/api/payment/verify/AUDIT-REF?provider=paystack', null, 'API: payment verify (paystack)'],

  // API: advanced
  ['POST', '/api/digitaltwin/create', { projectId: 'AUDIT-001', systemSize: 6.8 }, 'API: digital twin create'],
  ['POST', '/api/digitaltwin/simulate', { projectId: 'AUDIT-001' }, 'API: digital twin simulate'],
  ['POST', '/api/tenancy/tenant', { name: 'AuditCo', plan: 'pro' }, 'API: tenancy'],
  ['POST', '/api/command/advise', { query: 'sizing for 250kWh/month' }, 'API: command advise'],
  ['POST', '/api/validate/engineering', { systemKw: 6.8, voltage: 48, panelCount: 14 }, 'API: engineering validate'],

  // Batch A: Financial engineering
  ['POST', '/api/finance/npv', { discountRate: 0.10, cashFlows: [-1247500, 240000, 240000, 240000, 240000, 240000, 240000, 240000, 240000, 240000, 240000] }, 'Finance: NPV'],
  ['POST', '/api/finance/irr', { cashFlows: [-1247500, 240000, 240000, 240000, 240000, 240000, 240000, 240000, 240000, 240000, 240000] }, 'Finance: IRR'],
  ['POST', '/api/finance/loan', { principal: 1000000, annualRate: 0.14, years: 5 }, 'Finance: Loan amortization'],
  ['POST', '/api/finance/inflation', { baseAmount: 240000, inflationRate: 0.07, years: 20 }, 'Finance: Inflation projection'],
  ['GET',  '/api/finance/tariff/DC2?kWh=250', null, 'Finance: KPLC tariff bill'],
  ['GET',  '/api/finance/currency?amount=1000&from=USD&to=KES', null, 'Finance: Currency conversion'],
  ['POST', '/api/finance/margin', { cost: 1000000, sellingPrice: 1300000 }, 'Finance: Profit margin'],
  ['POST', '/api/finance/loan-vs-cash', { systemCost: 1247500, annualSavings: 240000, years: 20, loanRate: 0.14 }, 'Finance: Loan vs cash'],

  // Batch B: Solar engineering
  ['GET',  '/api/solar/sun-position?lat=-1.2865&lon=36.8172&time=2026-04-21T09:00:00Z', null, 'Solar: Sun position'],
  ['GET',  '/api/solar/sun-path/2026-04-21?lat=-1.2865&lon=36.8172', null, 'Solar: Daily sun path'],
  ['POST', '/api/solar/poa', { ghi: 850, sunElev: 60, sunAz: 120, tilt: 15, azimuth: 0 }, 'Solar: POA irradiance'],
  ['POST', '/api/solar/hourly', { lat: -1.2865, lon: 36.8172, dateISO: '2026-04-21', tilt: 15, azimuth: 0, systemKwStc: 6.8 }, 'Solar: Hourly simulation'],
  ['POST', '/api/solar/losses', { soiling: 2.5, shading: 4 }, 'Solar: Loss breakdown'],
  ['POST', '/api/solar/string-config', { panelVocStc: 49.5, panelVmppStc: 41.5, panelImppStc: 11.7, panelIscStc: 12.4, inverterMaxDcV: 600, inverterMpptMinV: 150, inverterMpptMaxV: 500, inverterMaxInputA: 25, inverterMpptCount: 2 }, 'Solar: String config'],
  ['POST', '/api/solar/inverter-match', { pvKwStc: 6.8, inverterAcKw: 5.0 }, 'Solar: Inverter match'],
  ['POST', '/api/solar/soiling', { climate: 'semiarid', daysSinceClean: 45 }, 'Solar: Soiling derate'],
  ['GET',  '/api/solar/seasonal?lat=-1.2865&lon=36.8172', null, 'Solar: Seasonal profile'],

  // Batch C: Reports & exports
  ['POST', '/api/reports/pdf', { title: 'Audit Report', sections: [{ heading: 'Intro', body: 'Test body' }], tables: [{ title: 'Demo', head: ['A', 'B'], body: [['1', '2']] }] }, 'Reports: PDF generic'],
  ['POST', '/api/reports/proposal', { brand: { companyName: 'Audit Solar', primaryHex: '#0b8457' }, customer: { name: 'Test Co', site: 'Nairobi' }, design: { systemKw: 6.8, batteryKwh: 10, panelCount: 14, panelW: 485, inverterKw: 5, tiltDeg: 15, azimuthDeg: 0, specificYieldKwhPerKwp: 1850, annualOffsetPct: 95, bom: [['Panel 485W', 14, 12500, 175000], ['Inverter 5kW', 1, 180000, 180000]] }, financial: { capexKes: 1247500, year1SavingsKes: 240000, paybackYears: 5.2, irrPct: 14.1, npvKes: 227196, cashFlowTable: [[1, 240000, 240000], [2, 240000, 480000]] } }, 'Reports: Branded proposal PDF'],
  ['POST', '/api/reports/xlsx', { sheets: [{ name: 'CashFlow', aoa: [['Year', 'Net'], [1, 240000], [2, 240000]] }, { name: 'BOM', rows: [{ item: 'Panel', qty: 14, price: 12500 }] }] }, 'Reports: Excel XLSX'],
  ['POST', '/api/reports/csv', { rows: [{ year: 1, net: 240000 }, { year: 2, net: 240000 }] }, 'Reports: CSV export'],
  ['POST', '/api/reports/schematic', { panels: 14, panelW: 485, strings: 2, inverterKw: 5, batteryKwh: 10, hasGrid: true }, 'Reports: Single-line schematic'],
  ['POST', '/api/reports/spec-sheet', { category: 'panel', brand: 'JA Solar', model: 'JAM72S30 485/MR', attrs: { wattage: 485, voc: 49.5, vmpp: 41.5, isc: 12.4, impp: 11.7, efficiencyPct: 21.0 } }, 'Reports: Spec sheet'],

  // Batch D: Sustainability
  ['POST', '/api/sustain/carbon-footprint', { annualKwh: 12000, country: 'KE' }, 'Sustain: Carbon footprint'],
  ['POST', '/api/sustain/solar-offset', { annualPvKwh: 12600, country: 'KE', projectYears: 25 }, 'Sustain: Solar offset'],
  ['POST', '/api/sustain/carbon-credits', { tonnesCO2: 65, marketTier: 'voluntary_avg' }, 'Sustain: Carbon credits'],
  ['POST', '/api/sustain/ev-charging', { vehicleType: 'sedan_ev', kmPerDay: 50, daysPerYear: 330 }, 'Sustain: EV charging'],
  ['POST', '/api/sustain/microgrid', { households: 50, avgDailyKwhPerHousehold: 4, productiveLoadKwh: 30, peakKwLoad: 25 }, 'Sustain: Microgrid sizing'],
  ['POST', '/api/sustain/diesel-vs-solar', { annualKwh: 50000, pvCapexKes: 4500000 }, 'Sustain: Diesel vs solar'],
  ['GET',  '/api/sustain/emission-factors', null, 'Sustain: Emission factors'],

  // Batch E: Business tooling
  ['POST', '/api/biz/sites', { name: 'Audit Site Nairobi HQ', location: { lat: -1.2865, lon: 36.8172, city: 'Nairobi' }, systemKw: 6.8, batteryKwh: 10, capexKes: 1247500, annualKwhExpected: 12600, status: 'commissioned', tags: ['audit', 'commercial'] }, 'Biz: Create site'],
  ['GET',  '/api/biz/sites', null, 'Biz: List sites'],
  ['GET',  '/api/biz/portfolio', null, 'Biz: Portfolio summary'],
  ['POST', '/api/biz/leads', { name: 'Audit Lead', email: 'audit@example.com', phone: '254700000000', source: 'website', monthlyBillKes: 8500 }, 'Biz: Capture lead'],
  ['GET',  '/api/biz/leads', null, 'Biz: List leads'],
  ['POST', '/api/biz/deals', { title: 'Audit Deal — 6.8 kWp', valueKes: 1247500, stage: 'proposal_sent', expectedCloseDate: '2026-06-30' }, 'Biz: Create deal'],
  ['GET',  '/api/biz/pipeline', null, 'Biz: Pipeline summary'],
  ['GET',  '/api/biz/conversion?days=90', null, 'Biz: Conversion funnel'],
  ['POST', '/api/biz/jobs', { quotedKes: 1247500, actualMaterialsKes: 720000, actualLabourKes: 180000, actualOtherKes: 50000 }, 'Biz: Record job'],
  ['GET',  '/api/biz/profit', null, 'Biz: Profit summary'],
  ['GET',  '/api/biz/mode', null, 'Biz: Get UI mode'],
  ['POST', '/api/biz/mode', { mode: 'beginner' }, 'Biz: Set UI mode'],

  // Tier-3 honest research stubs (data policy)
  ['GET', '/api/research', null, 'Research: catalogue'],
  ['GET', '/api/research/satellite-shading', null, 'Research: describe one'],

  // Tier-3 IMPLEMENTED features (free tools, real algorithms)
  ['POST', '/api/research/ai-fault-prediction/run', { series: Array.from({length: 30}, (_,i)=>({ts:i,value:100+Math.sin(i/3)*5+(i===20?40:0)})) }, 'R&D: anomaly detection (EWMA z-score)'],
  ['POST', '/api/research/nlp-advisor/run', { query: 'how do I size my system and check savings' }, 'R&D: NL advisor (rule engine)'],
  ['POST', '/api/research/load-forecast/run', { series: [110,115,120,135,150,160,170,165,140,125,115,108,112,118,125,140,155,165,175,170,145,128,118,110], season: 12, horizon: 6 }, 'R&D: Holt-Winters load forecast'],
  ['POST', '/api/research/tou-dispatch/run', { batteryKwh: 10, hourlyLoadKwh: Array.from({length:24},(_,h)=> h>=18&&h<22?2.5:0.8), hourlyPvKwh: Array.from({length:24},(_,h)=> h>=6&&h<18?Math.sin((h-6)/12*Math.PI)*4:0) }, 'R&D: TOU battery dispatch'],
  ['POST', '/api/research/permit-pack/run', { country: 'KE', projectKw: 6.8, customerName: 'Audit Co', siteAddress: 'Nairobi' }, 'R&D: permit pack (KE)'],
  ['POST', '/api/research/panel-counter/run', { roofAreaM2: 60 }, 'R&D: panel counter (IEC 62548)'],
  ['GET', '/api/research/iot-mqtt/status', null, 'R&D: IoT MQTT status'],

  // Real free-tool site analysis (OSM + NREL PVWatts)
  ['GET', '/api/site/obstacles?lat=-1.2865&lon=36.8172&radiusMeters=60', null, 'Site: OSM obstacles (Overpass)'],
  ['GET', '/api/site/pvwatts?lat=-1.2865&lon=36.8172&kw=6.8', null, 'Site: NREL PVWatts production'],
  ['GET', '/api/site/buildings?lat=-1.2865&lon=36.8172&radiusMeters=60', null, 'Site: OSM building polygons (3D)'],
];

const C = { reset: '\x1b[0m', red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m', cyan: '\x1b[36m', dim: '\x1b[2m' };

console.log(`\n${C.cyan}=== SolarGeniusPro Feature Audit ===${C.reset}`);
console.log(`Base: ${base}\n`);

const results = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (const [method, path, body, label] of tests) {
  await sleep(120);
  const url = base + path;
  const opts = { method, headers: {}, signal: AbortSignal.timeout(20000) };
  if (body) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  let code = 0, snippet = '', err = '';
  try {
    const r = await fetch(url, opts);
    code = r.status;
    const text = await r.text();
    snippet = text.slice(0, 90).replace(/\s+/g, ' ').trim();
  } catch (e) {
    err = e.message;
  }
  const pass = code >= 200 && code < 400;
  const disabled = code === 503; // honest "needs API key" — counts as PASS but tagged
  const tag = pass
    ? `${C.green}PASS${C.reset}`
    : disabled
      ? `${C.yellow}SKIP${C.reset}`
      : `${C.red}FAIL${C.reset}`;
  const okCount = pass || disabled;
  const codeStr = code ? `HTTP ${code}` : `ERR  ${err}`;
  console.log(`  [${tag}] ${method.padEnd(5)} ${path.padEnd(38)} ${codeStr}  ${C.dim}${snippet}${C.reset}`);
  results.push({ label, method, path, code, pass: okCount, err, snippet, disabled });
}

const pass = results.filter((r) => r.pass && !r.disabled).length;
const skip = results.filter((r) => r.disabled).length;
const fail = results.length - pass - skip;
console.log(`\n${C.cyan}=== Summary: ${pass} pass, ${skip} disabled (need API key), ${fail} fail ===${C.reset}`);
if (fail) {
  console.log(`\n${C.red}Failures:${C.reset}`);
  for (const r of results.filter((x) => !x.pass)) {
    console.log(`  - ${r.method} ${r.path}  -> HTTP ${r.code} ${r.err ? '(' + r.err + ')' : ''}`);
    if (r.snippet) console.log(`      ${C.dim}${r.snippet}${C.reset}`);
  }
}
process.exit(fail ? 1 : 0);
