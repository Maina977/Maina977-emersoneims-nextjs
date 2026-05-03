// Business tooling module — multi-site portfolio, lead capture, CRM, conversion analytics
// Persistent JSON store at data/business.json (created on first write).
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const STORE_PATH = path.join(DATA_DIR, 'business.json');

function loadStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(STORE_PATH)) {
      const empty = { sites: [], leads: [], deals: [], events: [], jobs: [], settings: { mode: 'engineer' } };
      fs.writeFileSync(STORE_PATH, JSON.stringify(empty, null, 2));
      return empty;
    }
    return JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
  } catch (e) {
    return { sites: [], leads: [], deals: [], events: [], jobs: [], settings: { mode: 'engineer' } };
  }
}

function saveStore(s) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(s, null, 2));
}

function uid(prefix) { return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`; }

// ---------------------------------------------------------------------------
// 1. Multi-site portfolio
// ---------------------------------------------------------------------------
function createSite(input) {
  const s = loadStore();
  const site = {
    id: uid('site'),
    name: input.name,
    location: input.location || {},
    systemKw: input.systemKw || 0,
    batteryKwh: input.batteryKwh || 0,
    capexKes: input.capexKes || 0,
    annualKwhExpected: input.annualKwhExpected || 0,
    commissionedAt: input.commissionedAt || null,
    status: input.status || 'design',
    tags: input.tags || [],
    createdAt: new Date().toISOString()
  };
  s.sites.push(site);
  saveStore(s);
  return site;
}

function listSites(filter = {}) {
  const s = loadStore();
  let out = s.sites;
  if (filter.status) out = out.filter((x) => x.status === filter.status);
  if (filter.tag) out = out.filter((x) => (x.tags || []).includes(filter.tag));
  return out;
}

function portfolioSummary() {
  const s = loadStore();
  const totalKw = s.sites.reduce((a, x) => a + (x.systemKw || 0), 0);
  const totalKwh = s.sites.reduce((a, x) => a + (x.batteryKwh || 0), 0);
  const totalCapex = s.sites.reduce((a, x) => a + (x.capexKes || 0), 0);
  const totalAnnualKwh = s.sites.reduce((a, x) => a + (x.annualKwhExpected || 0), 0);
  const byStatus = s.sites.reduce((acc, x) => { acc[x.status] = (acc[x.status] || 0) + 1; return acc; }, {});
  return {
    totalSites: s.sites.length,
    totalKwInstalled: round2(totalKw),
    totalBatteryKwh: round2(totalKwh),
    totalCapexKes: totalCapex,
    totalExpectedAnnualKwh: totalAnnualKwh,
    byStatus
  };
}

// ---------------------------------------------------------------------------
// 2. Lead capture
// ---------------------------------------------------------------------------
function captureLead(input) {
  const s = loadStore();
  const lead = {
    id: uid('lead'),
    name: input.name,
    email: input.email,
    phone: input.phone,
    source: input.source || 'website',
    monthlyBillKes: input.monthlyBillKes || null,
    location: input.location || null,
    notes: input.notes || '',
    status: 'new',
    createdAt: new Date().toISOString()
  };
  s.leads.push(lead);
  // Auto-event for funnel analytics
  s.events.push({ id: uid('evt'), type: 'lead_captured', leadId: lead.id, at: lead.createdAt });
  saveStore(s);
  return lead;
}

function listLeads(filter = {}) {
  const s = loadStore();
  let out = s.leads;
  if (filter.status) out = out.filter((x) => x.status === filter.status);
  if (filter.source) out = out.filter((x) => x.source === filter.source);
  return out;
}

function updateLeadStatus(id, status) {
  const s = loadStore();
  const lead = s.leads.find((x) => x.id === id);
  if (!lead) return null;
  lead.status = status;
  s.events.push({ id: uid('evt'), type: `lead_${status}`, leadId: id, at: new Date().toISOString() });
  saveStore(s);
  return lead;
}

// ---------------------------------------------------------------------------
// 3. CRM / deals pipeline
// ---------------------------------------------------------------------------
const PIPELINE_STAGES = ['new', 'qualified', 'site_visit', 'proposal_sent', 'negotiation', 'won', 'lost'];

function createDeal(input) {
  const s = loadStore();
  const deal = {
    id: uid('deal'),
    leadId: input.leadId,
    title: input.title,
    valueKes: input.valueKes || 0,
    stage: input.stage || 'new',
    probabilityPct: input.probabilityPct ?? 20,
    expectedCloseDate: input.expectedCloseDate || null,
    ownerEmail: input.ownerEmail || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  s.deals.push(deal);
  s.events.push({ id: uid('evt'), type: 'deal_created', dealId: deal.id, at: deal.createdAt });
  saveStore(s);
  return deal;
}

function moveDealStage(id, stage) {
  if (!PIPELINE_STAGES.includes(stage)) return { error: `Invalid stage. Allowed: ${PIPELINE_STAGES.join(', ')}` };
  const s = loadStore();
  const deal = s.deals.find((x) => x.id === id);
  if (!deal) return null;
  const prev = deal.stage;
  deal.stage = stage;
  deal.updatedAt = new Date().toISOString();
  // probability auto-update by stage
  const map = { new: 20, qualified: 35, site_visit: 50, proposal_sent: 65, negotiation: 80, won: 100, lost: 0 };
  deal.probabilityPct = map[stage];
  s.events.push({ id: uid('evt'), type: 'deal_stage_changed', dealId: id, from: prev, to: stage, at: deal.updatedAt });
  saveStore(s);
  return deal;
}

function pipelineSummary() {
  const s = loadStore();
  const byStage = {};
  let weightedValue = 0, totalValue = 0;
  for (const stage of PIPELINE_STAGES) byStage[stage] = { count: 0, valueKes: 0 };
  for (const d of s.deals) {
    if (!byStage[d.stage]) byStage[d.stage] = { count: 0, valueKes: 0 };
    byStage[d.stage].count += 1;
    byStage[d.stage].valueKes += d.valueKes || 0;
    if (d.stage !== 'lost') {
      totalValue += d.valueKes || 0;
      weightedValue += (d.valueKes || 0) * (d.probabilityPct || 0) / 100;
    }
  }
  return {
    stages: byStage,
    pipelineValueKes: totalValue,
    weightedForecastKes: round2(weightedValue)
  };
}

// ---------------------------------------------------------------------------
// 4. Conversion analytics (funnel)
// ---------------------------------------------------------------------------
function conversionFunnel(rangeDays = 90) {
  const s = loadStore();
  const since = Date.now() - rangeDays * 86400 * 1000;
  const recent = s.events.filter((e) => new Date(e.at).getTime() >= since);
  const counts = {
    leads: recent.filter((e) => e.type === 'lead_captured').length,
    qualified: recent.filter((e) => e.type === 'lead_qualified').length,
    proposals: recent.filter((e) => e.type === 'deal_stage_changed' && e.to === 'proposal_sent').length,
    negotiations: recent.filter((e) => e.type === 'deal_stage_changed' && e.to === 'negotiation').length,
    won: recent.filter((e) => e.type === 'deal_stage_changed' && e.to === 'won').length,
    lost: recent.filter((e) => e.type === 'deal_stage_changed' && e.to === 'lost').length
  };
  const closedTotal = counts.won + counts.lost;
  const winRate = closedTotal ? counts.won / closedTotal : 0;
  const leadToWin = counts.leads ? counts.won / counts.leads : 0;
  return {
    rangeDays,
    counts,
    rates: {
      leadToQualifiedPct: counts.leads ? round2(counts.qualified / counts.leads * 100) : 0,
      qualifiedToProposalPct: counts.qualified ? round2(counts.proposals / counts.qualified * 100) : 0,
      proposalToWonPct: counts.proposals ? round2(counts.won / counts.proposals * 100) : 0,
      winRatePct: round2(winRate * 100),
      leadToWinPct: round2(leadToWin * 100)
    }
  };
}

// ---------------------------------------------------------------------------
// 5. Profit / job tracking
// ---------------------------------------------------------------------------
function recordJob(input) {
  const s = loadStore();
  const job = {
    id: uid('job'),
    siteId: input.siteId || null,
    dealId: input.dealId || null,
    quotedKes: input.quotedKes || 0,
    actualMaterialsKes: input.actualMaterialsKes || 0,
    actualLabourKes: input.actualLabourKes || 0,
    actualOtherKes: input.actualOtherKes || 0,
    completedAt: input.completedAt || new Date().toISOString()
  };
  job.totalCostKes = job.actualMaterialsKes + job.actualLabourKes + job.actualOtherKes;
  job.profitKes = job.quotedKes - job.totalCostKes;
  job.marginPct = job.quotedKes ? round2(job.profitKes / job.quotedKes * 100) : 0;
  s.jobs.push(job);
  saveStore(s);
  return job;
}

function profitSummary() {
  const s = loadStore();
  const totalRevenue = s.jobs.reduce((a, j) => a + (j.quotedKes || 0), 0);
  const totalCost = s.jobs.reduce((a, j) => a + (j.totalCostKes || 0), 0);
  const totalProfit = totalRevenue - totalCost;
  return {
    jobs: s.jobs.length,
    revenueKes: totalRevenue,
    costKes: totalCost,
    profitKes: totalProfit,
    marginPct: totalRevenue ? round2(totalProfit / totalRevenue * 100) : 0
  };
}

// ---------------------------------------------------------------------------
// 6. UI mode (beginner / engineer)
// ---------------------------------------------------------------------------
function getMode() { return loadStore().settings?.mode || 'engineer'; }
function setMode(mode) {
  if (!['beginner', 'engineer'].includes(mode)) return { error: 'mode must be beginner or engineer' };
  const s = loadStore();
  s.settings = s.settings || {};
  s.settings.mode = mode;
  saveStore(s);
  return { mode };
}

function round2(x) { return Math.round(x * 100) / 100; }

module.exports = {
  PIPELINE_STAGES,
  createSite, listSites, portfolioSummary,
  captureLead, listLeads, updateLeadStatus,
  createDeal, moveDealStage, pipelineSummary,
  conversionFunnel,
  recordJob, profitSummary,
  getMode, setMode
};
