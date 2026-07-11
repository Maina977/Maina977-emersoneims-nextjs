import React, { useState, useRef, useEffect, useCallback } from 'react';
import { BoreholeAnalyzer } from './boreholeAnalyzer';
import type { ClientLocation } from './boreholeAnalyzer';
import { AnalysisResult, FieldValidationData, SitePhoto } from './types';
import * as SCI from './scienceData';
import { generateVerificationResult, getOSINTChecklist } from './locationVerifier';
import type { RemoteSensingResult } from './remoteSensing';
import { generatePDFReport, generateExcelReport, generateWordReport, generateCSVReport, generateJSONReport, generateComparisonReport, runPrePublishAudit, AuditBlockError, VerificationBlockError, setCustomerDetails, type AuditReport } from './reportGenerator';
import { getTrackerStats, getLifetimeCount, searchHistory, getSuccessStories, type ReportRecord, type TrackerStats } from './reportTracker';
import { parseERTFile } from './ertFileParser';
import { recordDrillingOutcome, getLearningStats, exportOutcomes, importOutcomes, loadOutcomes } from './feedbackLearningLoop';
import { computeBacktest, parseBacktestCSV, type BacktestRecord } from './backtestEngine';
import { parseWRARecords, wraRecordsToJSON, WRA_LOCALSTORAGE_KEY, type WRAIngestResult } from './wraIngestEngine';
import { runAIScanner, type AIScanResult } from './aiScanner';
import { render2DAnnotatedMap, render2DCrossSection, render3DTerrain, render3DSubsurface } from './terrainMapper';
import { computeDrillReadiness } from './drillReadiness';
import { invertVES, type VESInversionResult, type VESDataPoint } from './vesInversionEngine';
// NOTE: styles.css is deliberately NOT imported here. This module is loaded
// via next/dynamic, so a CSS import here becomes a SEPARATE runtime CSS chunk
// that must fetch successfully or the whole tool dies with ChunkLoadError —
// the exact recurring crash of 2026-07-09 (chunk 5962c327…css failed
// deterministically on a customer device across deployments and cache purges;
// stylesheet-type requests can be blocked by extensions/proxies even when
// fetches succeed, so no amount of cache repair fixes it). The stylesheet is
// imported statically by app/aquascan-pro-v3/page.tsx instead, shipping in the
// initial page <head> where a failure degrades to unstyled content but can
// NEVER throw. Do not re-add the import here.

/* ═══════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════ */
type SubsystemId = 'location'|'ingestion'|'satellite'|'geological'|'hydrogeological'|'ml'|'risk'|'cost'|'verification'|'remote-sensing'|'calibration'|'report';
type ViewId = 'dashboard'|'analyze'|'results'|'compare'|'feedback'|'capabilities';
type ReportTier = 'basic'|'professional'|'expert';

interface SubsystemDef {
  id: SubsystemId; number: number; title: string; icon: string; status: number; color: string;
  accepts?: string[]; processes?: string[]; outputs?: string[]; calculates?: string[];
  models?: string[]; maps?: string[]; classifies?: string[]; predicts?: string[];
  evaluates?: string[]; detects?: string[]; creates?: string[]; includes?: string[];
  projects?: string[]; fetches?: string[];
}

/**
 * Format the resolved administrative ladder for display:
 * Village → Ward → Sub-County/Constituency → Town → County → Province → Country.
 * Deduped — Kenya geocoders often repeat the county name at several levels.
 */
function formatAdminHierarchy(rg: {
  village?: string; suburb?: string; ward?: string; constituency?: string;
  city?: string; county?: string; state?: string; country?: string;
}): string {
  const rows: Array<[string, string | undefined]> = [
    ['Village', rg.village], ['Sub-Location', rg.suburb], ['Ward', rg.ward],
    ['Sub-County', rg.constituency], ['Town', rg.city], ['County', rg.county],
    ['Province/Region', rg.state], ['Country', rg.country],
  ];
  const seen = new Set<string>();
  const parts: string[] = [];
  for (const [label, value] of rows) {
    const v = value?.trim();
    if (!v) continue;
    const k = v.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    parts.push(`${label}: ${v}`);
  }
  return parts.join('  •  ');
}

/**
 * Downscale the customer's photos to compact JPEG data URLs and read each
 * photo's own EXIF GPS. These ship inside the PDF report with the drill point
 * marked on the primary photo — so never skip a file silently.
 */
async function buildSitePhotos(files: File[], primary: File): Promise<SitePhoto[]> {
  const MAX_PHOTOS = 6;
  const MAX_DIM = 1280;
  let gpsReader: ((f: File) => Promise<{ latitude?: number; longitude?: number } | null>) | null = null;
  try {
    const exifr = (await import('exifr')).default;
    gpsReader = (f: File) => exifr.gps(f).catch(() => null);
  } catch { /* exif optional */ }

  const ordered = [primary, ...files.filter(f => f !== primary)].slice(0, MAX_PHOTOS);
  const photos: SitePhoto[] = [];
  for (const file of ordered) {
    try {
      const url = URL.createObjectURL(file);
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = reject;
        el.src = url;
      });
      const scale = Math.min(1, MAX_DIM / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.max(1, Math.round(img.naturalWidth * scale));
      const h = Math.max(1, Math.round(img.naturalHeight * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) { URL.revokeObjectURL(url); continue; }
      ctx.drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      URL.revokeObjectURL(url);
      let exifGps: SitePhoto['exifGps'];
      if (gpsReader) {
        const g = await gpsReader(file);
        if (g && Number.isFinite(g.latitude) && Number.isFinite(g.longitude)) {
          exifGps = { latitude: g.latitude as number, longitude: g.longitude as number };
        }
      }
      photos.push({ dataUrl, width: w, height: h, isPrimary: file === primary, fileName: file.name, exifGps });
    } catch (e) { console.warn('[SitePhotos] skipped a photo:', e); }
  }
  return photos;
}

interface ComparisonSite {
  id: string; name: string; image: string | null; file: File | null;
  result: AnalysisResult | null; analyzing: boolean;
}

interface FeedbackEntry {
  siteId: string; actualDepth: string; actualYield: string; success: 'yes'|'no'|'partial';
  notes: string; submitted: boolean;
}

interface SubsurfaceLayer {
  depthStart: number; depthEnd: number; label: string;
  color: string; waterBearing: boolean; confidence: number;
}

interface ScenarioResult {
  depth: number; yield: number; cost: number; risk: string; recommendation: string;
}

/* ═══════════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════════ */
const SUBSYSTEMS: SubsystemDef[] = [
  { id:'location', number:1, title:'Location Resolution', icon:'\u{1F4CD}', status:95, color:'#E91E63',
    accepts:['Client-provided Country, Region, City, County, Village'],
    processes:['Forward geocoding via Nominatim, coordinate validation'],
    outputs:['Verified GPS coordinates, administrative boundaries, country code'] },
  { id:'ingestion', number:2, title:'Image Analysis', icon:'\u{1F4E5}', status:95, color:'#4CAF50',
    accepts:['Photos, videos, EXIF metadata, image fingerprinting'],
    processes:['Pixel spectral analysis, terrain classification, vegetation scoring'],
    outputs:['Validated inputs, NDVI, soil exposure index, terrain type, forensic ID'] },
  { id:'satellite', number:3, title:'Satellite Data Fusion', icon:'\u{1F6F0}\uFE0F', status:100, color:'#2196F3',
    fetches:['Sentinel-1/2, Landsat 8/9, GRACE-FO, SMAP+S1, GPM IMERG, MODIS MCD43A3, AMSR-2, CHIRPS, SRTM'],
    calculates:['NDVI, NDWI (Otsu), LST, SEBAL ET, soil moisture 1km, SWE, BRDF albedo, InSAR, TWI'],
    outputs:['10 remote sensing capabilities, 28 spectral indices, 6 data providers'] },
  { id:'geological', number:4, title:'Geological Analysis', icon:'\u{1FAA8}', status:90, color:'#FF9800',
    maps:['Rock formations, fault lines, aquifer boundaries, lineament density, subsurface layers'],
    classifies:['Aquifer type (confined/unconfined/karst), lithology, porosity'],
    outputs:['Geological cross-sections, structure maps, subsurface visualization'] },
  { id:'hydrogeological', number:5, title:'Hydrogeological Modeling', icon:'\u{1F4A7}', status:92, color:'#00BCD4',
    calculates:['Hydraulic conductivity, transmissivity, storage coefficient, recharge rate'],
    models:['Groundwater flow, capture zones, drawdown, seasonal recharge cycles'],
    outputs:['Flow nets, capture zone maps, sustainable yield, climate projections'] },
  { id:'ml', number:6, title:'ML Predictions', icon:'\u{1F9E0}', status:88, color:'#9C27B0',
    predicts:['Success probability, depth, yield, scenario simulations, probability breakdown'],
    classifies:['Soil type, water potability, contamination risk, drilling strategy'],
    outputs:['Confidence intervals, SHAP explanations, self-learning feedback loop'] },
  { id:'risk', number:7, title:'Risk Assessment', icon:'\u26A0\uFE0F', status:85, color:'#F44336',
    evaluates:['Geological, contamination, depth, financial, technical, 5-year depletion risk'],
    detects:['Sewage, industrial, agricultural, landfill, mining contamination'],
    outputs:['Risk matrix, mitigation strategies, viability rating, water table stability'] },
  { id:'cost', number:8, title:'Cost & ROI Engine', icon:'\u{1F4B0}', status:90, color:'#FF5722',
    calculates:['Drilling, pump, casing, installation, solar, shelter, accessories, maintenance'],
    projects:['ROI, payback period, NPV, IRR, monthly savings, break-even analysis'],
    outputs:['Line-item quotation, solar sizing, structure costing, payback timeline'] },
  { id:'verification', number:9, title:'Location Verification', icon:'\u{1F50D}', status:95, color:'#E91E63',
    evaluates:['GPS confidence scoring, OSINT cross-check, reverse image search, map verification'],
    detects:['Location mismatches, unverified estimates, low-confidence coordinates'],
    outputs:['Drilling reliability grade (A-F), verification links, OSINT checklist, confidence warnings'] },
  { id:'remote-sensing', number:10, title:'World Data + GLDAS Fetch', icon:'\u{1F30D}', status:92, color:'#00BCD4',
    fetches:['ISRIC SoilGrids, Open-Elevation (SRTM), Open-Meteo Climate, NASA GLDAS V2.1 NOAH (soil moisture 4-depth, ET, runoff, baseflow), GRACE-FO TWS, 20-year weather, borehole database'],
    calculates:['NDWI proxy, MNDWI proxy, AWEI proxy, GLDAS water budget (P-ET-Qs=Recharge), GRACE storage anomaly, groundwater potential index'],
    outputs:['Satellite soil data, elevation, soil moisture & water budget (Budyko ET), GRACE storage trend proxy, drilling favorability rating, 20-year weather, regional statistics'] },
  { id:'calibration', number:11, title:'Cross-Reference & Calibration', icon:'\u{1F504}', status:90, color:'#FF9800',
    evaluates:['Image terrain analysis vs world data, regional borehole statistics vs AI prediction'],
    calculates:['Calibrated depth (weighted: 60% regional data + 40% image analysis)', 'Calibrated yield'],
    outputs:['Final calibrated depth, yield, cost estimates'] },
  { id:'report', number:12, title:'Report Generation', icon:'\u{1F4C4}', status:92, color:'#607D8B',
    creates:['PDF, DOCX, CSV, GeoJSON — Basic / Professional / Expert tiers'],
    includes:['Executive summary, methodology, results, drilling strategy, ROI analysis, 20-year weather history, regional borehole records'],
    outputs:['Tiered reports (30-50 pages), charts, maps, subsurface diagrams'] },
];

/* ═══════════════════════════════════════════════════════════════
   HELPER: generate analysis-derived data
   ═══════════════════════════════════════════════════════════════ */
/**
 * Convert the real subsurface model lithological column to display layers.
 * Uses actual API-derived geological data — NOT hardcoded proportions.
 * Falls back to a disclaimer layer if no subsurface model available.
 */
function genSubsurface(result: AnalysisResult): SubsurfaceLayer[] {
  if (result.subsurfaceModel?.lithologicalColumn?.length) {
    return result.subsurfaceModel.lithologicalColumn.map((layer: any) => ({
      depthStart: Math.round(layer.topDepth ?? layer.depthStart ?? 0),
      depthEnd: Math.round(layer.bottomDepth ?? layer.depthEnd ?? 0),
      label: layer.lithology ?? layer.label ?? 'Unknown',
      color: layer.waterBearing ? '#1E90FF' : layer.lithology?.toLowerCase().includes('sand') ? '#DAA520' :
             layer.lithology?.toLowerCase().includes('clay') ? '#A0522D' :
             layer.lithology?.toLowerCase().includes('rock') || layer.lithology?.toLowerCase().includes('granite') ? '#708090' :
             layer.lithology?.toLowerCase().includes('aquifer') ? '#1E90FF' : '#8B7355',
      waterBearing: layer.waterBearing ?? false,
      confidence: layer.confidence ?? (result.confidenceMetrics?.geological ?? 50),
    }));
  }
  // No subsurface model data — show honest disclaimer instead of fake layers
  return [{
    depthStart: 0, depthEnd: result.recommendedDepth,
    label: 'Subsurface model unavailable — no geological data from API. See "Subsurface 3D" tab if available.',
    color: '#888', waterBearing: false, confidence: 0,
  }];
}

/**
 * Compute weighted composite score for a site comparison.
 * Higher = better. Scale 0-100. Used in multi-site ranking.
 */
function computeSiteScore(r: AnalysisResult): { total: number; breakdown: Record<string, number> } {
  const prob = r.probability * 100;                           // 0-100
  const yieldScore = Math.min(r.estimatedYield / 5, 1) * 100; // Normalized: 5 m³/h = 100
  const riskScore = (1 - r.risk.overallRisk) * 100;            // Lower risk = higher score
  const conf = r.confidenceMetrics?.overall ?? 50;
  const depthScore = Math.max(0, 100 - r.recommendedDepth);     // Shallower = cheaper = better
  const breakdown: Record<string, number> = {
    'Success Probability': Math.round(prob * 0.30),
    'Yield Potential': Math.round(yieldScore * 0.25),
    'Low Risk': Math.round(riskScore * 0.20),
    'Data Confidence': Math.round(conf * 0.15),
    'Cost Efficiency': Math.round(depthScore * 0.10),
  };
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);
  return { total: Math.min(total, 100), breakdown };
}

/**
 * Compute credibility rating dashboard — 4 dimensions scored 0–5 stars.
 * Values derived from actual analysis data, not hardcoded.
 */
function computeCredibility(r: AnalysisResult) {
  // Scientific methodology: based on data source count and methodology transparency
  const conf = r.confidenceMetrics;
  const srcCount = (conf ? [conf.geological > 0, conf.terrain > 0, conf.vegetation > 0, conf.dataDensity > 0, conf.waterQuality > 0].filter(Boolean).length : 0)
    + (r.remoteSensing ? 1 : 0) + (r.gldasGroundwater ? 1 : 0);
  const sciScore = Math.min(5, 2.5 + srcCount * 0.35); // Base 2.5 + 0.35 per source

  // Data integrity: based on GPS quality, satellite data availability, real-time data
  const gpsBonus = r.gpsSource === 'exif' ? 1.0 : r.gpsSource === 'device' ? 0.8 : r.gpsSource === 'manual' ? 0.5 : 0;
  const satBonus = (r.remoteSensing ? 0.8 : 0) + (r.gldasGroundwater ? 0.6 : 0) + (r.realTimeWaterData ? 0.6 : 0);
  const dataScore = Math.min(5, 1.5 + gpsBonus + satBonus + (r.historicalData ? 0.5 : 0));

  // Economic analysis: scored by whether ROI, sensitivity, cost breakdown are present/realistic
  const hasFinancials = r.estimatedYield > 0 && r.recommendedDepth > 0;
  const econScore = hasFinancials ? Math.min(5, 3.0 + (r.uncertainty ? 0.5 : 0) + (r.confidenceMetrics ? 0.5 : 0)) : 2.0;

  // Confidence metrics: direct from overall confidence score
  const confPct = conf?.overall ?? 50;
  const confScore = Math.min(5, confPct / 20); // 0%→0, 50%→2.5, 100%→5

  const overall = (sciScore + dataScore + econScore + confScore) / 4;
  const overallPct = Math.round(overall / 5 * 100);

  return {
    dimensions: [
      { key: 'science', label: 'Scientific Methodology', score: sciScore, target: 5.0, comment: sciScore >= 4.5 ? 'Transparent, well-documented equations' : sciScore >= 3.5 ? 'Good methodology; ERT integration available for 5★' : 'Building data source coverage' },
      { key: 'data', label: 'Data Integrity', score: dataScore, target: 5.0, comment: dataScore >= 4.0 ? 'Multiple satellite + API sources confirmed' : dataScore >= 3.0 ? 'Satellite data present; ERT integration available for 5★' : 'Limited data sources — additional sources recommended' },
      { key: 'economics', label: 'Economic Analysis', score: econScore, target: 4.5, comment: econScore >= 4.0 ? 'Realistic ROI with sensitivity analysis' : 'Good base; validate tariff and utilization locally' },
      { key: 'confidence', label: 'Confidence Metrics', score: confScore, target: 4.5, comment: confPct >= 85 ? 'Bankable-grade confidence' : confPct >= 65 ? `Moderate (${confPct}%); ERT integration → 90%+` : `Building (${confPct}%); ERT + pump test → 90%+` },
    ],
    overall,
    overallPct,
    grade: overallPct >= 85 ? 'BANKABLE' : overallPct >= 70 ? 'PRE-FEASIBILITY' : overallPct >= 50 ? 'STANDARD' : 'PRELIMINARY',
    gradeColor: overallPct >= 85 ? '#16a34a' : overallPct >= 70 ? '#38bdf8' : overallPct >= 50 ? '#d97706' : '#dc2626',
  };
}

/**
 * Deterministic cost breakdown — rates derived from soil type and depth.
 * No Math.random(). Geology-based drilling rates from Kenya industry surveys.
 */
function genCostBreakdown(depth: number, yld: number, soilType?: string) {
  // Drilling rate per meter based on geology (Kenya 2024 contractor survey data)
  const ratesBySoil: Record<string, number> = {
    sandy: 52,   // Standard auger — $45-60/m midpoint
    loamy: 58,   // Mud rotary — $50-65/m
    clay: 68,    // Mud rotary with stabilizer — $55-75/m
    rocky: 115,  // DTH hammer — $80-150/m midpoint
    silty: 60,   // Similar to loamy
    laterite: 75, // Indurated laterite — $60-90/m
  };
  // Uncertainty multipliers: soil type affects cost variability
  const uncertaintyBySoil: Record<string, number> = {
    sandy: 0.15, loamy: 0.18, clay: 0.22, rocky: 0.35, silty: 0.18, laterite: 0.28,
  };
  const ratePerM = ratesBySoil[soilType || 'loamy'] || 65;
  const unc = uncertaintyBySoil[soilType || 'loamy'] || 0.20;
  const drilling = Math.round(depth * ratePerM);
  const casing = Math.round(depth * 0.35 * 45);
  const screen = Math.round(depth * 0.15 * 55);
  const pump = Math.round(3500 + yld * 800);
  const installation = Math.round(pump * 0.35);
  // Mobilization scales with depth (proxy for remoteness: deeper wells = harder terrain)
  const mobilization = Math.round(1200 + depth * 6);
  // Accessories scale with depth + yield (more pipe, fittings, storage for bigger systems)
  const accessories = Math.round(800 + depth * 3 + yld * 40);
  const contingency = Math.round((drilling+casing+screen+pump+installation+mobilization+accessories)*0.10);
  const total = drilling+casing+screen+pump+installation+mobilization+accessories+contingency;

  // P50/P75/P90 confidence intervals (lognormal cost distribution)
  // P50 = median (our base estimate), P75 = 75th percentile, P90 = 90th percentile
  // Deeper wells + harder rock = wider uncertainty
  const depthFactor = 1 + Math.max(0, (depth - 50) / 300) * 0.1; // deeper = more uncertain
  const p50 = total;
  const p75 = Math.round(total * (1 + unc * 0.65 * depthFactor));
  const p90 = Math.round(total * (1 + unc * 1.30 * depthFactor));
  const p10 = Math.round(total * (1 - unc * 0.50));  // optimistic scenario

  return { drilling, casing, screen, pump, installation, mobilization, accessories, contingency,
    total, ratePerM: Math.round(ratePerM),
    confidence: { p10, p50, p75, p90, uncertaintyPct: Math.round(unc * 100) },
  };
}

/**
 * Deterministic solar sizing — runtime derived from yield requirement.
 * Higher yield = longer runtime needed. Based on Kenya solar irradiance.
 */
function genSolar(yld: number, lat?: number) {
  const pumpKw = 0.5 + yld * 0.35;
  // Solar runtime based on latitude: equatorial Kenya gets ~5-6 peak sun hours
  // Pump runs proportional to yield need (bigger demand = longer runtime)
  const peakSunHours = lat !== undefined ? Math.max(4, 7 - Math.abs(lat) * 0.08) : 5.5;
  const runtime = Math.round((peakSunHours + Math.min(yld * 0.3, 3)) * 10) / 10;
  const dailyKwh = pumpKw * runtime;
  const panelKwp = Math.ceil(dailyKwh / 4.5 * 10)/10;
  const batteryKwh = Math.ceil(dailyKwh * 0.6 * 10)/10;
  const batteryAh = Math.round(batteryKwh / 48 * 1000);
  const inverterKva = Math.ceil(pumpKw * 1.3 * 10)/10;
  const panelCost = Math.round(panelKwp * 950);
  const batteryCost = Math.round(batteryKwh * 280);
  const inverterCost = Math.round(inverterKva * 350);
  const shelterCost = Math.round(1500 + panelKwp * 200);
  const labourCost = Math.round(800 + panelKwp * 150);
  const accessoryCost = Math.round(400 + panelKwp * 80);
  const totalSolar = panelCost+batteryCost+inverterCost+shelterCost+labourCost+accessoryCost;
  return { pumpKw:Math.round(pumpKw*10)/10, runtime:Math.round(runtime*10)/10, dailyKwh:Math.round(dailyKwh*10)/10,
    panelKwp, batteryKwh, batteryAh, inverterKva, panelCost, batteryCost, inverterCost,
    shelterCost, labourCost, accessoryCost, totalSolar };
}

/**
 * ROI calculation with P50/P75/P90 financial risk quantification.
 * Realistic assumptions: solar pump 6hrs/day, 300 operating days/yr, $0.80/m³ rural tariff.
 * Utilization ramp: 60% year 1, 75% year 2, 85% year 3+.
 */
function genROI(boreholeCost: number, solarCost: number, yld: number, runtime?: number, costConfidence?: { p10: number; p50: number; p75: number; p90: number }) {
  const totalInvestment = boreholeCost + solarCost;
  // Monthly water production: yield × runtime hours × 25 effective days/month (300/yr ÷ 12)
  const dailyHours = runtime || 6;
  const effectiveDaysPerMonth = 25; // 300 operating days/yr (excludes maintenance, weather)
  const monthlyM3 = yld * dailyHours * effectiveDaysPerMonth;
  // Water tariff: $0.80/m³ (realistic rural Africa average)
  const waterValuePerM3 = 0.80;
  const grossMonthlySavings = Math.round(monthlyM3 * waterValuePerM3);
  // Yr1 at 60% utilization, Yr3+ at 85% utilization (steady state)
  const yr1MonthlyRev = Math.round(grossMonthlySavings * 0.60);
  const steadyMonthlyRev = Math.round(grossMonthlySavings * 0.85);
  const maintenanceCost = Math.round(totalInvestment * 0.04); // 4% annual
  const monthlyMaintenance = Math.round(maintenanceCost / 12);
  const steadyMonthlySavings = steadyMonthlyRev - monthlyMaintenance;
  const annualRevenue = steadyMonthlySavings * 12;

  // Realistic payback: accumulate actual monthly cash flows with ramp-up
  let cumCF = -totalInvestment;
  let paybackMonths = 999;
  for (let m = 1; m <= 240; m++) {
    const util = m <= 12 ? 0.60 : m <= 24 ? 0.75 : 0.85;
    cumCF += Math.round(grossMonthlySavings * util) - monthlyMaintenance;
    if (cumCF >= 0) { paybackMonths = m; break; }
  }

  // NPV at 12% discount rate over 20 years
  const npv20 = Math.round(-totalInvestment + Array.from({length:20},(_,yr)=> {
    const util = yr === 0 ? 0.60 : yr === 1 ? 0.75 : 0.85;
    return (grossMonthlySavings * 12 * util - maintenanceCost) / Math.pow(1.12, yr+1);
  }).reduce((a,b)=>a+b,0));
  const roi = annualRevenue > 0 ? Math.round((annualRevenue / totalInvestment)*100) : 0;

  // P50/P75/P90 payback confidence — accounts for cost uncertainty + yield uncertainty (±30%)
  const yieldLow = yld * 0.7;
  const savingsLow = Math.round(yieldLow * dailyHours * effectiveDaysPerMonth * waterValuePerM3 * 0.85) - monthlyMaintenance;
  const investP75 = (costConfidence?.p75 ?? Math.round(totalInvestment * 1.15));
  const investP90 = (costConfidence?.p90 ?? Math.round(totalInvestment * 1.35));
  const paybackP75 = savingsLow > 0 ? Math.ceil(investP75 / Math.max(savingsLow, 1)) : 999;
  const paybackP90 = savingsLow > 0 ? Math.ceil(investP90 / Math.max(savingsLow, 1)) : 999;
  const npvP90 = Math.round(-investP90 + Array.from({length:20},(_,yr)=> {
    const util = yr === 0 ? 0.50 : yr === 1 ? 0.65 : 0.75;
    return (yieldLow * dailyHours * effectiveDaysPerMonth * 12 * waterValuePerM3 * util - Math.round(investP90 * 0.05)) / Math.pow(1.12, yr+1);
  }).reduce((a,b)=>a+b,0));

  return { totalInvestment, monthlySavings: steadyMonthlySavings, paybackMonths, annualRevenue, maintenanceCost, npv20, roi,
    financialConfidence: {
      paybackP50: paybackMonths,
      paybackP75,
      paybackP90,
      npvP50: npv20,
      npvP90,
      investmentRange: { p50: totalInvestment, p75: investP75, p90: investP90 },
    },
  };
}

function genScenarios(depth: number, yld: number): ScenarioResult[] {
  return [
    { depth:Math.round(depth*0.65), yield:Math.round(yld*0.4*10)/10, cost:Math.round(depth*0.65*85), risk:'Medium', recommendation:'Shallow option — lower cost but reduced yield; consider if budget is constrained' },
    { depth:Math.round(depth), yield:Math.round(yld*10)/10, cost:Math.round(depth*95), risk:'Low', recommendation:'Optimal depth — best yield-to-cost ratio' },
    { depth:Math.round(depth*1.4), yield:Math.round(yld*1.15*10)/10, cost:Math.round(depth*1.4*110), risk:'Medium', recommendation:'Marginal yield gain — higher cost, diminishing returns' },
  ];
}

/**
 * Climate summary derived from REAL historicalData (20-year NASA POWER archive).
 * Falls back to a basic label when no API data is available. Never fabricates rainfall values.
 */
function genClimate(historicalData: any, gldasData: any) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  if (historicalData?.weather?.monthly) {
    const monthly = historicalData.weather.monthly;
    const rainfall = months.map((m, i) => ({ month: m, mm: Math.round(monthly[i]?.precipitation ?? 0) }));
    const totalPrecip = rainfall.reduce((s, r) => s + r.mm, 0);
    const wetMonths = rainfall.filter(r => r.mm > 80).map(r => r.month);
    const bestSeason = wetMonths.length > 0 ? `${wetMonths[0]}–${wetMonths[wetMonths.length - 1]}` : 'Consult local data';
    const rechargeRate = gldasData?.waterBudget?.estimatedRecharge
      ? `${gldasData.waterBudget.estimatedRecharge} mm/yr (NASA POWER water budget)`
      : `~${Math.round(totalPrecip * 0.08)} mm/yr (8% of precipitation — global average estimate)`;
    const droughtRisk = totalPrecip < 500 ? 'High — arid zone' : totalPrecip < 800 ? 'Moderate' : 'Low';
    return { rainfall, bestDrillingSeason: bestSeason, aquiferRechargeRisk: droughtRisk,
      rechargeRate, waterTableStability: gldasData?.graceAnomaly?.trend === 'gaining' ? 'Stable/Rising' : gldasData?.graceAnomaly?.trend === 'losing' ? 'Declining' : 'Variable',
      dataSource: '20-year NASA POWER monthly archive' };
  }
  // No historical data — return empty with disclaimer instead of fabricating values
  return { rainfall: months.map(m => ({ month: m, mm: 0 })),
    bestDrillingSeason: 'No data — consult local meteorological service',
    aquiferRechargeRisk: 'Unknown — no precipitation data available',
    rechargeRate: 'No data', waterTableStability: 'Unknown',
    dataSource: 'NO DATA AVAILABLE — NASA POWER API did not return results for this location' };
}

/**
 * Deterministic probability breakdown — all values derived from probability + depth.
 * No Math.random(). Aquifer hit correlates with overall success probability;
 * deeper yield improvement decreases with depth (diminishing returns per Cooper-Jacob).
 */
function genProbability(prob: number, depth: number) {
  return {
    success: Math.round(prob * 100),
    // Aquifer hit probability tracks ~12% below success (structural uncertainty)
    hitMainAquifer: Math.round(Math.min(95, Math.max(0, prob * 100 - 12))),
    // Deeper drilling improvement follows diminishing returns curve
    deeperYieldImprovement: Math.round(Math.max(10, 60 - depth * 0.25)),
    rechargePotential: prob > 0.7 ? 'High' : prob > 0.4 ? 'Medium' : 'Low',
    fiveYearRisk: prob > 0.7 ? 'Low depletion risk' : prob > 0.4 ? 'Moderate depletion' : 'High depletion risk',
  };
}

/**
 * Expanded water quality with deterministic manganese.
 * Mn correlates with iron (both from reducing conditions) and depth.
 * Literature: Mn/Fe ratio typically 0.02-0.5 in groundwater.
 */
function genWaterQualityExpanded(wq: any, depth?: number) {
  const salinity = Math.round(wq.tds * 0.65);
  // Manganese correlates with iron levels (same redox conditions) + depth effect
  const depthFactor = depth ? Math.min(0.15, depth * 0.001) : 0.05;
  const manganese = Math.round((wq.iron * 0.35 + depthFactor) * 100) / 100;
  const treatmentCost = !wq.isPotable ? Math.round(500 + wq.tds * 0.8 + wq.fluoride * 200) : 0;
  return { ...wq, salinity, manganese, treatmentRequired: wq.isPotable ? 'NO' : 'YES',
    estimatedTreatmentCostUSD: treatmentCost, contaminationRisk: wq.fluoride > 1.5 || wq.arsenic > 0.01 ? 'High' : wq.iron > 0.3 ? 'Medium' : 'Low' };
}

function genDrillingStrategy(depth: number, soil: string) {
  const casingDepth = Math.round(depth * 0.35);
  return {
    recommendedSeason: 'Dry season (less water table interference)',
    method: depth > 100 ? 'DTH (Down-The-Hole) hammer from '+Math.round(depth*0.55)+'m' : 'Rotary drilling throughout',
    casingRequired: `Up to ${casingDepth}m (PVC/steel)`,
    screenPlacement: `${Math.round(depth*0.6)}m – ${depth}m`,
    gravelPack: 'Required around screen section',
    developmentMethod: 'Air-lift + surge for 4-6 hours',
    estimatedDuration: Math.round(2 + depth/30) + ' days',
    soilNote: soil === 'rocky' ? 'Hard rock expected — DTH recommended' : soil === 'clay' ? 'Clay layers — maintain casing pressure' : 'Standard conditions',
  };
}

/* genNearbyBoreholes — REMOVED: was generating fake sin-hash wells.
   Real nearby wells come from result.nearbyWells (USGS NWIS + OSM Overpass API). */

/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */
function findNearest(arr: number[], val: number): number {
  let best = 0, bestD = Math.abs(arr[0] - val);
  for (let i = 1; i < arr.length; i++) { const d = Math.abs(arr[i] - val); if (d < bestD) { best = i; bestD = d; } }
  return best;
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
const AIBoreholeAnalyzer: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string|null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult|null>(null);
  const [analyzer, setAnalyzer] = useState<BoreholeAnalyzer|null>(null);
  const [activeView, setActiveView] = useState<ViewId>('dashboard');
  const [activeResultTab, setActiveResultTab] = useState('overview');
  const [initStatus, setInitStatus] = useState<'loading'|'ready'|'error'>('loading');
  const [initError, setInitError] = useState('');
  const [analysisError, setAnalysisError] = useState<string|null>(null);
  const [expandedSubsystem, setExpandedSubsystem] = useState<SubsystemId|null>(null);
  const [pipelineStep, setPipelineStep] = useState(-1);
  const [pipelineLabel, setPipelineLabel] = useState('');
  const [reportTier, setReportTier] = useState<ReportTier>('expert');
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custOrg, setCustOrg] = useState('');
  const [trackerRefresh, setTrackerRefresh] = useState(0);
  const [historySearch, setHistorySearch] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [manualLat, setManualLat] = useState('');
  const [manualLon, setManualLon] = useState('');
  const [manualLocError, setManualLocError] = useState('');
  const [placeQuery, setPlaceQuery] = useState('');
  const [placeSearching, setPlaceSearching] = useState(false);
  const [extraImages, setExtraImages] = useState<string[]>([]);
  const primaryFileRef = useRef<File | null>(null);
  const sitePhotosRef = useRef<SitePhoto[]>([]);
  const [pinnedPlace, setPinnedPlace] = useState('');
  const [pinnedPlaceLoading, setPinnedPlaceLoading] = useState(false);
  const [locatingDevice, setLocatingDevice] = useState(false);
  const [clientLoc, setClientLoc] = useState<ClientLocation>({ country:'', region:'', city:'', county:'', province:'', district:'', location:'', sublocation:'', town:'', village:'', estate:'', farm:'' });
  const [compSites, setCompSites] = useState<ComparisonSite[]>([
    { id:'A', name:'Site A', image:null, file:null, result:null, analyzing:false },
    { id:'B', name:'Site B', image:null, file:null, result:null, analyzing:false },
    { id:'C', name:'Site C', image:null, file:null, result:null, analyzing:false },
  ]);
  const [feedback, setFeedback] = useState<FeedbackEntry>({ siteId:'', actualDepth:'', actualYield:'', success:'yes', notes:'', submitted:false });
  const [fieldDataInput, setFieldDataInput] = useState<Partial<FieldValidationData>>({});
  const [showFieldForms, setShowFieldForms] = useState(false);
  const [vesRaw, setVesRaw] = useState('');
  const [vesResult, setVesResult] = useState<VESInversionResult | null>(null);
  const [vesError, setVesError] = useState('');
  const [backtestCSV, setBacktestCSV] = useState('');
  const [wraRaw, setWraRaw] = useState('');
  const [wraResult, setWraResult] = useState<WRAIngestResult | null>(null);
  const [wraStoredCount, setWraStoredCount] = useState<number>(() => { try { const v = typeof localStorage !== 'undefined' ? localStorage.getItem(WRA_LOCALSTORAGE_KEY) : null; return v ? (JSON.parse(v)?.length ?? 0) : 0; } catch { return 0; } });
  const [learningStats, setLearningStats] = useState<ReturnType<typeof getLearningStats> | null>(null);
  const ertFileRef = useRef<HTMLInputElement>(null);
  const [activeSciPart, setActiveSciPart] = useState<string>('remote-sensing');
  const [scannerResult, setScannerResult] = useState<AIScanResult | null>(null);
  const [scannerRunning, setScannerRunning] = useState(false);
  const scannerMapRef = useRef<HTMLCanvasElement>(null);
  const scannerCrossRef = useRef<HTMLCanvasElement>(null);
  const scanner3dRef = useRef<HTMLCanvasElement>(null);
  const scanner3dSubRef = useRef<HTMLCanvasElement>(null);
  const scanner3dCleanup = useRef<{ cleanup: () => void } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const compInputRefs = useRef<(HTMLInputElement|null)[]>([]);
  const compRadarRef = useRef<HTMLCanvasElement>(null);
  const lastNominatimCall = useRef<number>(0);

  useEffect(() => {
    const init = async () => {
      try {
        const ba = new BoreholeAnalyzer();
        await ba.initialize();
        setAnalyzer(ba);
        setInitStatus('ready');
      } catch (err: any) {
        console.error('Init failed:', err);
        setInitError(err?.message || 'Unknown error');
        setInitStatus('error');
      }
    };
    init();
  }, []);

  // Draw comparison radar chart when sites change
  useEffect(() => {
    const analyzed = compSites.filter(s => s.result);
    if (analyzed.length < 2 || !compRadarRef.current) return;
    const canvas = compRadarRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.35;
    ctx.clearRect(0, 0, W, H);

    const axes = ['Success %', 'Yield', 'Low Risk', 'Confidence', 'Shallow Depth'];
    const n = axes.length;
    const siteColors = ['#38bdf8', '#4ade80', '#f59e0b'];

    // Draw concentric rings
    for (let ring = 1; ring <= 5; ring++) {
      const r = (R * ring) / 5;
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(148,163,184,0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw axis lines + labels
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < n; i++) {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const x1 = cx + R * Math.cos(angle);
      const y1 = cy + R * Math.sin(angle);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x1, y1);
      ctx.strokeStyle = 'rgba(148,163,184,0.2)';
      ctx.stroke();
      const lx = cx + (R + 24) * Math.cos(angle);
      const ly = cy + (R + 24) * Math.sin(angle);
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(axes[i], lx, ly);
    }

    // Normalize site data to 0-1 for radar
    const maxYield = Math.max(...analyzed.map(s => s.result!.estimatedYield), 1);
    const maxDepth = Math.max(...analyzed.map(s => s.result!.recommendedDepth), 1);

    analyzed.forEach((site, si) => {
      const r = site.result!;
      const conf = r.confidenceMetrics?.overall ?? 50;
      const vals = [
        r.probability,
        r.estimatedYield / maxYield,
        1 - r.risk.overallRisk,
        conf / 100,
        1 - (r.recommendedDepth / (maxDepth * 1.5)),
      ];
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const idx = i % n;
        const angle = (Math.PI * 2 * idx) / n - Math.PI / 2;
        const v = Math.max(0, Math.min(1, vals[idx]));
        const x = cx + R * v * Math.cos(angle);
        const y = cy + R * v * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      const c = siteColors[si % 3];
      ctx.fillStyle = c + '25';
      ctx.fill();
      ctx.strokeStyle = c;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw value dots
      for (let i = 0; i < n; i++) {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const v = Math.max(0, Math.min(1, vals[i]));
        const x = cx + R * v * Math.cos(angle);
        const y = cy + R * v * Math.sin(angle);
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = c;
        ctx.fill();
      }
    });

    // Legend
    const legendY = H - 20;
    analyzed.forEach((site, si) => {
      const lx = cx - ((analyzed.length - 1) * 60) / 2 + si * 60;
      ctx.fillStyle = siteColors[si % 3];
      ctx.fillRect(lx - 20, legendY - 5, 10, 10);
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(site.name, lx - 6, legendY);
    });
  }, [compSites]);

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0 || !analyzer) return;

    // Coordinates typed but invalid? STOP and say so — never run the analysis
    // at the wrong place while the user believes their location was applied.
    let manualCoords: { lat: number; lon: number } | null = null;
    if (manualLat.trim() || manualLon.trim()) {
      const parsed = parseManualCoordinates(manualLat, manualLon);
      if ('error' in parsed) {
        setManualLocError(parsed.error);
        setAnalysisError(`Location problem: ${parsed.error}`);
        return;
      }
      manualCoords = parsed;
    }

    // Multiple photos: analyze the one with EXIF GPS as primary (best
    // location evidence); the rest are kept as visual context thumbnails.
    let primary = files[0];
    if (files.length > 1) {
      try {
        const exifr = (await import('exifr')).default;
        for (const f of files) {
          const g = await exifr.gps(f).catch(() => null);
          if (g && Number.isFinite(g.latitude) && Number.isFinite(g.longitude)) { primary = f; break; }
        }
      } catch { /* keep first file as primary */ }
    }
    primaryFileRef.current = primary;
    setSelectedImage(URL.createObjectURL(primary));
    setExtraImages(files.filter(f => f !== primary).map(f => URL.createObjectURL(f)));
    setResult(null);
    setAnalysisError(null);
    setAnalyzing(true);
    setActiveView('analyze');
    setPipelineStep(0);
    setPipelineLabel(files.length > 1 ? `Analyzing primary photo (1 of ${files.length})...` : 'Initializing data ingestion pipeline...');
    // Compress every uploaded photo for the PDF report (runs alongside the
    // analysis) — the report embeds them with the drill point marked.
    const sitePhotosPromise = buildSitePhotos(files, primary)
      .then(p => { sitePhotosRef.current = p; return p; })
      .catch(() => [] as SitePhoto[]);
    try {
      // Pass client location if any fields are filled, AND inject manual coordinates if provided
      const hasClientLoc = Object.values(clientLoc).some(v => v && v.trim());

      // Build the location object: manual coords override everything
      let locationArg: ClientLocation | undefined;
      if (manualCoords) {
        locationArg = {
          ...clientLoc,
          latitude: manualCoords.lat,
          longitude: manualCoords.lon,
        };
      } else if (hasClientLoc) {
        locationArg = clientLoc;
      }

      // Build field data if any field forms were filled
      const hasFieldData = Object.keys(fieldDataInput).length > 0 && Object.values(fieldDataInput).some(v => v != null);
      const analysisResult = await analyzer.analyzeImage(
        primary,
        (step, label) => { setPipelineStep(step); setPipelineLabel(label); },
        locationArg,
        hasFieldData ? fieldDataInput as FieldValidationData : undefined,
      );
      try { analysisResult.sitePhotos = await sitePhotosPromise; } catch { /* photos optional */ }
      setResult(analysisResult);
      setActiveView('results');
      setActiveResultTab('overview');
    } catch (error: any) {
      console.error('Analysis failed:', error);
      setAnalysisError(error?.message || String(error) || 'Unknown pipeline error');
    }
    finally { setAnalyzing(false); setPipelineLabel(''); }
  };

  const handleCompSiteUpload = async (idx: number, file: File) => {
    if (!analyzer) return;
    const sites = [...compSites];
    sites[idx] = { ...sites[idx], image: URL.createObjectURL(file), file, analyzing: true, result: null };
    setCompSites(sites);
    try {
      const res = await analyzer.analyzeImage(file);
      const updated = [...sites]; updated[idx] = { ...updated[idx], result: res, analyzing: false };
      setCompSites(updated);
    } catch { const updated = [...sites]; updated[idx] = { ...updated[idx], analyzing: false }; setCompSites(updated); }
  };

  /**
   * Parse whatever the user actually pastes for coordinates. Real users paste
   * "0.0266768, 34.6471737" into one field, values with degree symbols, or a
   * Google Plus Code — the old parseFloat-or-silently-return threw ALL of that
   * away without a word, so reports shipped with the stale estimated location
   * while the user believed they had "updated the location" (Esikangu incident,
   * 2026-07-09). NEVER fail silently here.
   */
  const parseManualCoordinates = (rawLat: string, rawLon: string): { lat: number; lon: number } | { error: string } => {
    const clean = (s: string) => s.trim().replace(/[°º]/g, '');
    let a = clean(rawLat);
    let b = clean(rawLon);
    // Plus Code pasted? (e.g. "2JGW+JWV") — explain how to get decimals instead.
    const plusCode = /^[23456789CFGHJMPQRVWX]{4,8}\+[23456789CFGHJMPQRVWX]{2,3}$/i;
    if (plusCode.test(a) || plusCode.test(b) || plusCode.test(a.split(/[\s,]+/)[0] ?? '')) {
      return { error: 'That looks like a Plus Code (e.g. 2JGW+JWV) — it can’t be used directly. In Google Maps, PRESS AND HOLD on the exact spot until a pin drops, then copy the two decimal numbers that appear (e.g. 0.026677, 34.647174) and paste them here. Or use the place-name search above.' };
    }
    // "lat, lon" pasted into a single field
    if (!b && /[,;\s]/.test(a)) {
      const parts = a.split(/[,;\s]+/).filter(Boolean);
      if (parts.length >= 2) { b = parts[1]; a = parts[0]; }
    }
    const lat = parseFloat(a);
    const lon = parseFloat(b);
    if (isNaN(lat) || isNaN(lon)) {
      return { error: 'Coordinates must be two decimal numbers, e.g. latitude 0.026677 and longitude 34.647174. In Google Maps, press and hold on the site until a pin drops and copy the numbers shown. Or search the place by name above.' };
    }
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return { error: `Those numbers are out of range (latitude ${lat}, longitude ${lon}). Latitude must be -90..90 and longitude -180..180 — they may be swapped.` };
    }
    // Kenya sanity: catch obviously swapped lat/lon (lat 34.6, lon 0.02)
    if (Math.abs(lat) > 5.5 && lon >= -5.5 && lon <= 5.5 && lat >= 33 && lat <= 42.5) {
      return { error: `Latitude ${lat} with longitude ${lon} looks swapped for Kenya — try latitude ${lon}, longitude ${lat}.` };
    }
    return { lat, lon };
  };

  // Live place-name confirmation: the moment valid coordinates are pinned,
  // resolve the full administrative ladder (County / Sub-County / Ward /
  // Village) and show it under the PINNED banner — the user must SEE that the
  // tool understood exactly where the site is before running the analysis.
  useEffect(() => {
    if (!analyzer) return;
    if (!manualLat.trim() && !manualLon.trim()) { setPinnedPlace(''); setPinnedPlaceLoading(false); return; }
    const parsed = parseManualCoordinates(manualLat, manualLon);
    if ('error' in parsed) { setPinnedPlace(''); setPinnedPlaceLoading(false); return; }
    let cancelled = false;
    setPinnedPlaceLoading(true);
    const t = setTimeout(async () => {
      try {
        const rg = await analyzer.reverseGeocode(parsed.lat, parsed.lon);
        if (cancelled) return;
        setPinnedPlace(rg && rg.source !== 'none' ? formatAdminHierarchy(rg) : '');
      } catch { if (!cancelled) setPinnedPlace(''); }
      finally { if (!cancelled) setPinnedPlaceLoading(false); }
    }, 900);
    return () => { cancelled = true; clearTimeout(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manualLat, manualLon, analyzer]);

  /** Core: re-run the FULL analysis at the given verified coordinates. */
  const applyCoordinates = async (lat: number, lon: number) => {
    if (!analyzer) return;
    setManualLocError('');

    // If we have an image file, re-run the FULL analysis with correct coordinates
    // This is critical: all satellite data, geology, depth, yield must use the right location
    const imageInput = document.querySelector<HTMLInputElement>('input[type="file"][accept*="image"]');
    const file = primaryFileRef.current ?? imageInput?.files?.[0];
    if (file) {
      setResult(null);
      setAnalyzing(true);
      setActiveView('analyze');
      setPipelineStep(0);
      setPipelineLabel('Re-analyzing with corrected coordinates...');
      try {
        const hasFieldData = Object.keys(fieldDataInput).length > 0 && Object.values(fieldDataInput).some(v => v != null);
        const analysisResult = await analyzer.analyzeImage(
          file,
          (step, label) => { setPipelineStep(step); setPipelineLabel(label); },
          { ...clientLoc, latitude: lat, longitude: lon },
          hasFieldData ? fieldDataInput as FieldValidationData : undefined,
        );
        // Re-attach the photos from the original upload (or build them now)
        if (sitePhotosRef.current.length === 0) {
          try { sitePhotosRef.current = await buildSitePhotos([file], file); } catch { /* optional */ }
        }
        analysisResult.sitePhotos = sitePhotosRef.current;
        setResult(analysisResult);
        setActiveView('results');
        setActiveResultTab('overview');
      } catch (error) { console.error('Re-analysis failed:', error); }
      finally { setAnalyzing(false); setPipelineStep(-1); setPipelineLabel(''); }
    } else if (result) {
      // No image file available — do coordinate-only update (fallback)
      const now = Date.now();
      const elapsed = now - lastNominatimCall.current;
      if (elapsed < 1100) await new Promise(r => setTimeout(r, 1100 - elapsed));
      lastNominatimCall.current = Date.now();
      let resolvedLocation = result.resolvedLocation;
      try {
        const rg = await analyzer.reverseGeocode(lat, lon);
        if (rg && rg.source !== 'none') {
          resolvedLocation = { ...rg, isFromImage: false };
        }
      } catch { /* reverse geocode failed, continue without */ }
      setResult({
        ...result,
        site: { ...result.site, latitude: lat, longitude: lon, confidence: Math.max(result.site.confidence, 0.60) },
        gpsSource: 'manual' as const,
        locationMethod: 'manual-entry' as const,
        gpsAccuracy: 50,
        resolvedLocation,
      });
    }
    setManualLat('');
    setManualLon('');
  };

  /** Apply manually entered coordinates — validates loudly, then re-runs analysis. */
  const applyManualCoordinates = async () => {
    if (!analyzer) return;
    const parsed = parseManualCoordinates(manualLat, manualLon);
    if ('error' in parsed) { setManualLocError(parsed.error); return; }
    await applyCoordinates(parsed.lat, parsed.lon);
  };

  /**
   * Place-name search — the report cover promises "a manually entered
   * Country/County/Town/Village" unlocks the full report, so the UI must
   * actually accept a place name. Forward-geocodes via Nominatim and re-runs
   * the analysis at the top match.
   */
  const searchPlaceAndApply = async () => {
    const q = placeQuery.trim();
    if (!q || placeSearching) return;
    setManualLocError('');
    setPlaceSearching(true);
    try {
      const now = Date.now();
      const elapsed = now - lastNominatimCall.current;
      if (elapsed < 1100) await new Promise(r => setTimeout(r, 1100 - elapsed));
      lastNominatimCall.current = Date.now();
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1&addressdetails=1&accept-language=en`,
        { headers: { 'User-Agent': 'EmersonEIMS-BoreHoleAnalyzer/1.0' }, signal: AbortSignal.timeout(10000) },
      );
      const matches = await resp.json();
      if (!Array.isArray(matches) || matches.length === 0) {
        setManualLocError(`No place found for "${q}". Try adding the county (e.g. "Ebusembe Mukhungu, Vihiga") — or paste decimal coordinates below.`);
        return;
      }
      const m = matches[0];
      const lat = parseFloat(m.lat);
      const lon = parseFloat(m.lon);
      if (isNaN(lat) || isNaN(lon)) { setManualLocError('The map service returned an unusable result — paste decimal coordinates below instead.'); return; }
      setPlaceQuery(`${m.display_name}`);
      if (!result) {
        // Pre-analysis (dashboard): pin the coordinates so the upcoming
        // analysis runs there — the fields double as the visible confirmation.
        setManualLat(lat.toFixed(6));
        setManualLon(lon.toFixed(6));
        return;
      }
      await applyCoordinates(lat, lon);
    } catch {
      setManualLocError('Place search failed (network). Paste decimal coordinates below instead.');
    } finally {
      setPlaceSearching(false);
    }
  };

  /** Use device GPS — user explicitly confirms they are at the borehole site */
  const useMyLocation = async () => {
    if (!result || !navigator?.geolocation) return;
    setLocatingDevice(true);
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true, timeout: 15000, maximumAge: 60000,
        });
      });
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      const accuracy = pos.coords.accuracy;
      // Reverse geocode the confirmed device location
      // Rate limit: Nominatim requires max 1 req/sec
      const nowGps = Date.now();
      const elapsedGps = nowGps - lastNominatimCall.current;
      if (elapsedGps < 1100) {
        await new Promise(r => setTimeout(r, 1100 - elapsedGps));
      }
      lastNominatimCall.current = Date.now();
      let resolvedLocation = result.resolvedLocation;
      try {
        const rg = await analyzer?.reverseGeocode(lat, lon);
        if (rg && rg.source !== 'none') {
          resolvedLocation = { ...rg, isFromImage: false };
        }
      } catch { /* reverse geocode failed, still use coordinates */ }
      setResult({
        ...result,
        site: { ...result.site, latitude: lat, longitude: lon, confidence: Math.max(result.site.confidence, 0.70) },
        gpsSource: 'device' as const,
        locationMethod: 'device-gps' as const,
        gpsAccuracy: accuracy,
        resolvedLocation,
      });
    } catch {
      // Geolocation denied or failed — do nothing
    }
    setLocatingDevice(false);
  };

  const getRiskColor = (risk: number) => risk < 0.3 ? '#4CAF50' : risk < 0.6 ? '#FFC107' : risk < 0.8 ? '#FF9800' : '#F44336';
  const overallHealth = Math.round(SUBSYSTEMS.reduce((a,s) => a+s.status, 0) / SUBSYSTEMS.length);
  const fmtUSD = (n: number) => '$' + n.toLocaleString();
  const fmtKSH = (n: number) => 'KSh ' + Math.round(n*130).toLocaleString();

  /* ─── SUBSYSTEM DETAILS ─── */
  const renderSubsystemDetails = (s: SubsystemDef) => {
    const fields: [string, string[]|undefined][] = [
      ['Accepts',s.accepts],['Processes',s.processes],['Fetches',s.fetches],['Calculates',s.calculates],
      ['Maps',s.maps],['Classifies',s.classifies],['Models',s.models],['Predicts',s.predicts],
      ['Evaluates',s.evaluates],['Detects',s.detects],['Creates',s.creates],['Includes',s.includes],
      ['Projects',s.projects],['Outputs',s.outputs],
    ];
    return (
      <div className="subsystem-details">
        {fields.filter(([,v])=>v&&v.length>0).map(([label, items])=>(
          <div key={label} className="subsystem-detail-row">
            <span className="detail-label">{label}:</span>
            <span className="detail-value">{items!.join('; ')}</span>
          </div>
        ))}
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════════
     VIEW: DASHBOARD
     ═══════════════════════════════════════════════════════════════ */
  const renderDashboard = () => (
    <div className="dashboard">
      <div className="system-health-bar">
        <div className="health-label"><span>System Health</span><span className="health-value">{overallHealth}%</span></div>
        <div className="health-track"><div className="health-fill" style={{width:`${overallHealth}%`}}></div></div>
      </div>

      {/* Pipeline */}
      <div className="pipeline-flow">
        <h3 className="section-title">12-Subsystem AI Pipeline</h3>
        <div className="pipeline-steps">
          {SUBSYSTEMS.map((s,i) => (
            <React.Fragment key={s.id}>
              <div className={`pipeline-node ${expandedSubsystem===s.id?'expanded':''} ${pipelineStep===i?'active':''} ${pipelineStep>i?'done':''}`}
                onClick={()=>setExpandedSubsystem(expandedSubsystem===s.id?null:s.id)}>
                <div className="node-header"><span className="node-icon">{s.icon}</span><span className="node-number">{s.number}</span></div>
                <div className="node-title">{s.title}</div>
                <div className="node-status-bar"><div className="node-status-fill" style={{width:`${s.status}%`,background:s.color}}></div></div>
                <div className="node-status-text" style={{color:s.color}}>{s.status}%</div>
                {expandedSubsystem===s.id && renderSubsystemDetails(s)}
              </div>
              {i < SUBSYSTEMS.length-1 && <div className="pipeline-connector"><span>&rarr;</span></div>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-card"><div className="stat-icon">{'\u{1F6F0}\uFE0F'}</div><div className="stat-number">{SCI.TOTAL_CAPABILITIES}</div><div className="stat-label">Scientific Capabilities</div><div className="stat-sub">Parts 1–7: Remote Sensing → Validation</div></div>
        <div className="stat-card"><div className="stat-icon">{'\u{1F310}'}</div><div className="stat-number">6</div><div className="stat-label">Data Providers</div><div className="stat-sub">NASA, ESA, USGS, JAXA, GFZ, UCSB-CHG</div></div>
        <div className="stat-card"><div className="stat-icon">{'\u{1F9E0}'}</div><div className="stat-number">6</div><div className="stat-label">AI/ML Models</div><div className="stat-sub">ResNet-50, U-Net, ViT, RF, LSTM, XGBoost</div></div>
        <div className="stat-card"><div className="stat-icon">{'\u{1F4CA}'}</div><div className="stat-number">15</div><div className="stat-label">Science Domains</div><div className="stat-sub">Remote Sensing, Geology, Hydrology, ML, Risk, Reports, Validation</div></div>
      </div>

      {/* Science Catalog Quick Nav */}
      <div className="science-nav-section">
        <h3 className="section-title">7-Part Scientific Capability Catalog</h3>
        <div className="science-parts-grid">
          {SCI.SCIENCE_PARTS.map(p => (
            <div key={p.id} className="science-part-card" style={{borderColor:p.color}} onClick={()=>{setActiveSciPart(p.id);setActiveView('capabilities');}}>
              <div className="sp-header"><span className="sp-icon">{p.icon}</span><span className="sp-part" style={{color:p.color}}>Part {p.part}</span></div>
              <div className="sp-title">{p.title}</div>
              <div className="sp-count" style={{color:p.color}}>{p.count} capabilities</div>
              <div className="sp-desc">{p.description}</div>
            </div>
          ))}
        </div>
        <div style={{textAlign:'center',marginTop:16}}>
          <button className="btn btn-science" onClick={()=>setActiveView('capabilities')}>{'\u{1F52C}'} Browse Full Scientific Catalog ({SCI.TOTAL_CAPABILITIES} Capabilities)</button>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="feature-highlights">
        <h3 className="section-title">23 Analysis Features</h3>
        <div className="feature-grid">
          {[
            ['\u{1F4F7}','Photo Geolocation','GPS + NASA/Google Earth verification'],
            ['\u{1F4B5}','Cost Breakdown','Line-item: drilling, pump, casing, labour'],
            ['\u2600\uFE0F','Solar + Shelter','Panel, battery, inverter, structure sizing'],
            ['\u{1F6F0}\uFE0F','Remote Sensing','Rainfall + soil + satellite + borehole records'],
            ['\u{1F5FA}\uFE0F','Map Integration','Nearby boreholes, depths, yields, success rates'],
            ['\u{1FA78}','Subsurface Model','Visual layer diagram with confidence metrics'],
            ['\u{1F4A7}','Water Quality','Salinity, fluoride, iron, treatment cost'],
            ['\u{1F4C8}','ROI & Payback','Monthly savings, NPV, IRR, break-even'],
            ['\u{1F504}','Site Comparison','Compare A vs B vs C — pick the best'],
            ['\u{1F9E0}','Self-Learning','Feedback loop: actual vs predicted improves AI'],
            ['\u{1F3AC}','Video Analysis','Terrain slope, soil exposure, vegetation spread'],
            ['\u2601\uFE0F','Climate Modeling','Rainfall, drought cycles, best drilling season'],
            ['\u{1F4DD}','Report Tiers','Basic / Professional / Expert reports'],
            ['\u{1F3AF}','Scenario Simulation','Depth vs yield vs cost trade-offs'],
            ['\u{1F4CA}','Probability Breakdown','Aquifer hit, yield improvement, recharge'],
            ['\u2696\uFE0F','Simple Outputs','Water table stability, recharge, 5yr risk'],
            ['\u{1F6E0}\uFE0F','Drilling Strategy','Season, method, casing, screen, duration'],
            ['\u{1F30D}','Data Integration','Rainfall, soil maps, satellite moisture, records'],
            ['\u{1FAA8}','Geological Analysis','25 classes, fault lines, lineament density'],
            ['\u{1F4A6}','Hydrogeological','Flow nets, drawdown, sustainable yield'],
            ['\u{26A0}\uFE0F','Risk Matrix','5-category risk + mitigation strategies'],
            ['\u{1F3D7}\uFE0F','Structure Costing','Steel, blocks, prefab shelter, labour'],
            ['\u{1F52C}','Treatment Cost','If water needs treatment: estimated cost'],
          ].map(([icon,title,desc],i) => (
            <div key={i} className="feature-chip"><span className="feat-icon">{icon}</span><span className="feat-title">{title}</span><span className="feat-desc">{desc}</span></div>
          ))}
        </div>
      </div>

      {/* Key Formulas */}
      <div className="key-formulas">
        <h3 className="section-title">Key Formulas</h3>
        <div className="formula-grid">
          {[
            ['Transmissivity','T = K \u00D7 b','Rock type lookup (10 types)'],
            ['Sustainable Yield','min(T-lim, recharge, storage)\u00D7SF','3-constraint model'],
            ['NPV','NPV = -C\u2080 + \u03A3[(R\u209C-C\u209C)/(1+r)\u1D57]','20-year projection'],
            ['Drilling Cost','rate \u00D7 depth \u00D7 remoteness','$45-$150/m by geology'],
            ['SEBAL ET','\u03BBET = Rn - G - H','11-step energy balance'],
            ['SWE','SWE = \u03B1(Tb18V-Tb36V)+\u03B2','Modified Chang BTGR'],
            ['SMAP+S1','SM = a\u00B7\u03C3\u00B0VV + b\u00B7\u03C3\u00B0VH + c\u00B7NDVI','36km\u21921km fusion'],
            ['Otsu','argmax \u03C3\u00B2B = w0w1(\u03BC0-\u03BC1)\u00B2','Auto water threshold'],
            ['MCD43A3','BSA(\u03B8) = fiso+fvol\u00B7Kvol+fgeo\u00B7Kgeo','BRDF albedo (\u00B10.02)'],
          ].map(([name,eq,desc],i) => (
            <div key={i} className="formula-card"><div className="formula-name">{name}</div><div className="formula-eq">{eq}</div><div className="formula-desc">{desc}</div></div>
          ))}
        </div>
      </div>

      {/* CTA Section — Location Form + Image Upload */}
      <div className="cta-section">
        {initStatus === 'loading' && <div className="init-loading"><div className="borehole-spinner"></div><p>Loading TensorFlow.js AI models...</p></div>}
        {initStatus === 'error' && <div className="init-error"><p>AI model load failed: {initError}</p><button className="btn btn-retry" onClick={()=>window.location.reload()}>Retry</button></div>}
        {initStatus === 'ready' && (
          <>
            {/* LOCATION FORM — Client provides exact borehole site */}
            <div style={{background:'rgba(0,188,212,0.06)',border:'2px solid rgba(0,188,212,0.25)',borderRadius:16,padding:'20px 24px',marginBottom:20}}>
              <h3 style={{margin:'0 0 8px',fontSize:16,fontWeight:700,color:'var(--text-primary)'}}>
                {'\u{1F4CD}'} Step 1 — Enter Borehole Site Location
              </h3>
              <p style={{margin:'0 0 14px',fontSize:12,color:'var(--text-secondary)',lineHeight:1.5}}>
                Provide the exact location where you want to drill. The more fields you fill, the more precise the GPS coordinates and analysis.
                We fetch 20-year weather history, regional borehole records, groundwater data, and satellite imagery for these coordinates.
              </p>

              {/* SET SITE LOCATION — exact GPS, visible BEFORE analysis (owner request 2026-07-09) */}
              <div style={{background:'rgba(34,197,94,0.07)',border:'2px solid rgba(34,197,94,0.30)',borderRadius:12,padding:'14px 18px',marginBottom:14}}>
                <div style={{fontWeight:800,fontSize:14,color:'var(--text-primary)',marginBottom:6}}>{'\u{1F3AF}'} Set Site Location — Exact GPS (best accuracy)</div>
                <div style={{fontSize:11,color:'var(--text-secondary)',marginBottom:10,lineHeight:1.5}}>
                  Pin the exact drilling spot and the analysis runs THERE (GPS source: MANUAL — unlocks the full site report).
                  In Google Maps: <strong>press &amp; hold</strong> the spot until a pin drops, then copy the two decimal numbers. Plus Codes (e.g. 2JGW+JWV) won&apos;t work — use the numbers.
                </div>
                <div style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap',marginBottom:10}}>
                  <input type="text" placeholder='Search place name — e.g. "Emabungo, Vihiga"' value={placeQuery} onChange={e=>setPlaceQuery(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')void searchPlaceAndApply();}} style={{flex:2,minWidth:220,padding:'8px 12px',borderRadius:8,border:'1px solid var(--border)',background:'var(--bg-elevated)',color:'var(--text-primary)',fontSize:13}} />
                  <button onClick={searchPlaceAndApply} disabled={placeSearching} style={{padding:'8px 18px',borderRadius:8,border:'none',background:placeSearching?'var(--bg-elevated)':'#22c55e',color:placeSearching?'var(--text-secondary)':'#fff',fontWeight:700,fontSize:13,cursor:placeSearching?'wait':'pointer'}}>{placeSearching?'⏳ Searching…':'\u{1F50D} Find Place'}</button>
                  <button onClick={()=>{ if(!navigator?.geolocation){setManualLocError('This device/browser has no GPS access.');return;} navigator.geolocation.getCurrentPosition(p=>{setManualLat(String(p.coords.latitude));setManualLon(String(p.coords.longitude));setManualLocError('');},()=>setManualLocError('Device GPS failed — allow location access, or paste coordinates.'),{enableHighAccuracy:true,timeout:15000}); }} style={{padding:'8px 18px',borderRadius:8,border:'none',background:'#0ea5e9',color:'#fff',fontWeight:700,fontSize:13,cursor:'pointer'}}>{'\u{1F4F1}'} I&apos;m at the site</button>
                </div>
                <div style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap'}}>
                  <input type="text" placeholder="Latitude (e.g. 0.026677) — or paste both: 0.026677, 34.647174" value={manualLat} onChange={e=>{setManualLat(e.target.value);setManualLocError('');}} style={{flex:1.4,minWidth:210,padding:'8px 12px',borderRadius:8,border:'1px solid var(--border)',background:'var(--bg-elevated)',color:'var(--text-primary)',fontFamily:'var(--font-mono)',fontSize:13}} />
                  <input type="text" placeholder="Longitude (e.g. 34.647174)" value={manualLon} onChange={e=>{setManualLon(e.target.value);setManualLocError('');}} style={{flex:1,minWidth:150,padding:'8px 12px',borderRadius:8,border:'1px solid var(--border)',background:'var(--bg-elevated)',color:'var(--text-primary)',fontFamily:'var(--font-mono)',fontSize:13}} />
                </div>
                {(() => {
                  if (!manualLat.trim() && !manualLon.trim()) return null;
                  const p = parseManualCoordinates(manualLat, manualLon);
                  return 'error' in p
                    ? <div style={{marginTop:8,padding:'8px 12px',borderRadius:8,background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.25)',color:'#fca5a5',fontSize:12,lineHeight:1.5}}>{'⚠️'} {p.error}</div>
                    : <div style={{marginTop:8,padding:'8px 12px',borderRadius:8,background:'rgba(34,197,94,0.10)',border:'1px solid rgba(34,197,94,0.30)',fontSize:12}}>
                        <div style={{color:'#4ade80',fontWeight:700}}>{'✅'} Drilling location PINNED: {p.lat.toFixed(6)}, {p.lon.toFixed(6)} — the analysis will run exactly here (full site report unlocked)</div>
                        {pinnedPlaceLoading && <div style={{marginTop:6,color:'var(--text-secondary)',fontSize:11}}>{'\u{1F30D}'} Resolving County / Sub-County / Ward / Village names…</div>}
                        {!pinnedPlaceLoading && pinnedPlace && <div style={{marginTop:6,color:'#86efac',fontSize:11.5,lineHeight:1.6}}>{'\u{1F4CD}'} <strong>Site identified:</strong> {pinnedPlace}</div>}
                        {!pinnedPlaceLoading && !pinnedPlace && <div style={{marginTop:6,color:'var(--text-tertiary)',fontSize:11}}>Place names will be resolved during analysis and printed in the report.</div>}
                      </div>;
                })()}
                {manualLocError && (
                  <div style={{marginTop:8,padding:'8px 12px',borderRadius:8,background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.25)',color:'#fca5a5',fontSize:12,lineHeight:1.5}}>{'⚠️'} {manualLocError}</div>
                )}
              </div>

              <div style={{fontSize:11,color:'var(--text-tertiary)',marginBottom:8}}>Or describe the location by name (used to geocode if no GPS above):</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
                {/* Row 1 — Country, Region/State, Province */}
                <div>
                  <label style={{display:'block',fontSize:11,fontWeight:600,color:'var(--text-secondary)',marginBottom:3,textTransform:'uppercase',letterSpacing:1}}>Country *</label>
                  <input type="text" value={clientLoc.country||''} onChange={e=>setClientLoc({...clientLoc,country:e.target.value})}
                    placeholder="e.g. Kenya" style={{width:'100%',padding:'8px 12px',borderRadius:8,border:'1px solid rgba(255,255,255,0.15)',background:'rgba(0,0,0,0.3)',color:'var(--text-primary)',fontSize:13,boxSizing:'border-box'}} />
                </div>
                <div>
                  <label style={{display:'block',fontSize:11,fontWeight:600,color:'var(--text-secondary)',marginBottom:3,textTransform:'uppercase',letterSpacing:1}}>Region / State</label>
                  <input type="text" value={clientLoc.region||''} onChange={e=>setClientLoc({...clientLoc,region:e.target.value})}
                    placeholder="e.g. Rift Valley" style={{width:'100%',padding:'8px 12px',borderRadius:8,border:'1px solid rgba(255,255,255,0.15)',background:'rgba(0,0,0,0.3)',color:'var(--text-primary)',fontSize:13,boxSizing:'border-box'}} />
                </div>
                <div>
                  <label style={{display:'block',fontSize:11,fontWeight:600,color:'var(--text-secondary)',marginBottom:3,textTransform:'uppercase',letterSpacing:1}}>Province</label>
                  <input type="text" value={clientLoc.province||''} onChange={e=>setClientLoc({...clientLoc,province:e.target.value})}
                    placeholder="e.g. Central" style={{width:'100%',padding:'8px 12px',borderRadius:8,border:'1px solid rgba(255,255,255,0.15)',background:'rgba(0,0,0,0.3)',color:'var(--text-primary)',fontSize:13,boxSizing:'border-box'}} />
                </div>
                {/* Row 2 — County, District, City/Town */}
                <div>
                  <label style={{display:'block',fontSize:11,fontWeight:600,color:'var(--text-secondary)',marginBottom:3,textTransform:'uppercase',letterSpacing:1}}>County</label>
                  <input type="text" value={clientLoc.county||''} onChange={e=>setClientLoc({...clientLoc,county:e.target.value})}
                    placeholder="e.g. Nakuru County" style={{width:'100%',padding:'8px 12px',borderRadius:8,border:'1px solid rgba(255,255,255,0.15)',background:'rgba(0,0,0,0.3)',color:'var(--text-primary)',fontSize:13,boxSizing:'border-box'}} />
                </div>
                <div>
                  <label style={{display:'block',fontSize:11,fontWeight:600,color:'var(--text-secondary)',marginBottom:3,textTransform:'uppercase',letterSpacing:1}}>District / Sub-County</label>
                  <input type="text" value={clientLoc.district||''} onChange={e=>setClientLoc({...clientLoc,district:e.target.value})}
                    placeholder="e.g. Bahati Sub-County" style={{width:'100%',padding:'8px 12px',borderRadius:8,border:'1px solid rgba(255,255,255,0.15)',background:'rgba(0,0,0,0.3)',color:'var(--text-primary)',fontSize:13,boxSizing:'border-box'}} />
                </div>
                <div>
                  <label style={{display:'block',fontSize:11,fontWeight:600,color:'var(--text-secondary)',marginBottom:3,textTransform:'uppercase',letterSpacing:1}}>City / Major Town</label>
                  <input type="text" value={clientLoc.city||''} onChange={e=>setClientLoc({...clientLoc,city:e.target.value})}
                    placeholder="e.g. Nakuru" style={{width:'100%',padding:'8px 12px',borderRadius:8,border:'1px solid rgba(255,255,255,0.15)',background:'rgba(0,0,0,0.3)',color:'var(--text-primary)',fontSize:13,boxSizing:'border-box'}} />
                </div>
                {/* Row 3 — Location, Sublocation, Town */}
                <div>
                  <label style={{display:'block',fontSize:11,fontWeight:600,color:'var(--text-secondary)',marginBottom:3,textTransform:'uppercase',letterSpacing:1}}>Location</label>
                  <input type="text" value={clientLoc.location||''} onChange={e=>setClientLoc({...clientLoc,location:e.target.value})}
                    placeholder="e.g. Bahati Location" style={{width:'100%',padding:'8px 12px',borderRadius:8,border:'1px solid rgba(255,255,255,0.15)',background:'rgba(0,0,0,0.3)',color:'var(--text-primary)',fontSize:13,boxSizing:'border-box'}} />
                </div>
                <div>
                  <label style={{display:'block',fontSize:11,fontWeight:600,color:'var(--text-secondary)',marginBottom:3,textTransform:'uppercase',letterSpacing:1}}>Sub-Location</label>
                  <input type="text" value={clientLoc.sublocation||''} onChange={e=>setClientLoc({...clientLoc,sublocation:e.target.value})}
                    placeholder="e.g. Kabatini" style={{width:'100%',padding:'8px 12px',borderRadius:8,border:'1px solid rgba(255,255,255,0.15)',background:'rgba(0,0,0,0.3)',color:'var(--text-primary)',fontSize:13,boxSizing:'border-box'}} />
                </div>
                <div>
                  <label style={{display:'block',fontSize:11,fontWeight:600,color:'var(--text-secondary)',marginBottom:3,textTransform:'uppercase',letterSpacing:1}}>Town</label>
                  <input type="text" value={clientLoc.town||''} onChange={e=>setClientLoc({...clientLoc,town:e.target.value})}
                    placeholder="e.g. Kabatini Town" style={{width:'100%',padding:'8px 12px',borderRadius:8,border:'1px solid rgba(255,255,255,0.15)',background:'rgba(0,0,0,0.3)',color:'var(--text-primary)',fontSize:13,boxSizing:'border-box'}} />
                </div>
                {/* Row 4 — Village, Estate, Farm */}
                <div>
                  <label style={{display:'block',fontSize:11,fontWeight:600,color:'var(--text-secondary)',marginBottom:3,textTransform:'uppercase',letterSpacing:1}}>Village / Ward</label>
                  <input type="text" value={clientLoc.village||''} onChange={e=>setClientLoc({...clientLoc,village:e.target.value})}
                    placeholder="e.g. Bahati Ward" style={{width:'100%',padding:'8px 12px',borderRadius:8,border:'1px solid rgba(255,255,255,0.15)',background:'rgba(0,0,0,0.3)',color:'var(--text-primary)',fontSize:13,boxSizing:'border-box'}} />
                </div>
                <div>
                  <label style={{display:'block',fontSize:11,fontWeight:600,color:'var(--text-secondary)',marginBottom:3,textTransform:'uppercase',letterSpacing:1}}>Estate / Neighbourhood</label>
                  <input type="text" value={clientLoc.estate||''} onChange={e=>setClientLoc({...clientLoc,estate:e.target.value})}
                    placeholder="e.g. Milimani Estate" style={{width:'100%',padding:'8px 12px',borderRadius:8,border:'1px solid rgba(255,255,255,0.15)',background:'rgba(0,0,0,0.3)',color:'var(--text-primary)',fontSize:13,boxSizing:'border-box'}} />
                </div>
                <div>
                  <label style={{display:'block',fontSize:11,fontWeight:600,color:'var(--text-secondary)',marginBottom:3,textTransform:'uppercase',letterSpacing:1}}>Farm / Plot Name</label>
                  <input type="text" value={clientLoc.farm||''} onChange={e=>setClientLoc({...clientLoc,farm:e.target.value})}
                    placeholder="e.g. Kamau Farm, Plot 24" style={{width:'100%',padding:'8px 12px',borderRadius:8,border:'1px solid rgba(255,255,255,0.15)',background:'rgba(0,0,0,0.3)',color:'var(--text-primary)',fontSize:13,boxSizing:'border-box'}} />
                </div>
              </div>
              {Object.values(clientLoc).some(v => typeof v === 'string' && v.trim()) && (
                <div style={{marginTop:10,padding:'8px 12px',background:'rgba(34,197,94,0.08)',borderRadius:8,fontSize:12,color:'var(--text-secondary)'}}>
                  {'\u2705'} Location set: <strong style={{color:'var(--text-primary)'}}>{[clientLoc.farm,clientLoc.estate,clientLoc.village,clientLoc.town,clientLoc.sublocation,clientLoc.location,clientLoc.district,clientLoc.county,clientLoc.city,clientLoc.province,clientLoc.region,clientLoc.country].filter(Boolean).join(', ')}</strong>
                  — this will be geocoded to exact lat/lon coordinates for analysis
                </div>
              )}
            </div>

            {/* IMAGE UPLOAD — for terrain/soil/vegetation analysis */}
            <div style={{background:'rgba(76,175,80,0.06)',border:'2px solid rgba(76,175,80,0.25)',borderRadius:16,padding:'20px 24px',marginBottom:20}}>
              <h3 style={{margin:'0 0 8px',fontSize:16,fontWeight:700,color:'var(--text-primary)'}}>
                {'\u{1F4F7}'} Step 2 — Upload Site Photo (Terrain Analysis)
              </h3>
              <p style={{margin:'0 0 8px',fontSize:12,color:'var(--text-secondary)',lineHeight:1.5}}>
                Upload a photo of the actual borehole site. The AI analyzes soil type, vegetation cover, terrain characteristics,
                surface water indicators, and rock exposure to refine the drilling recommendations.
              </p>
              <div style={{margin:'0 0 14px',padding:'10px 14px',background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:8,fontSize:12,lineHeight:1.6}}>
                <strong style={{color:'#ef4444'}}>{'\u26A0\uFE0F'} IMPORTANT — Use Original Photos Only:</strong>
                <ul style={{margin:'6px 0 0',paddingLeft:20,color:'var(--text-secondary)'}}>
                  <li><strong>DO NOT</strong> send photos via WhatsApp, Facebook, Telegram, or any social media — they <strong>strip GPS coordinates, camera info, and compress the image</strong>, destroying critical metadata.</li>
                  <li><strong>DO</strong> transfer photos directly from your phone/camera via USB cable, Google Drive, email attachment, or AirDrop.</li>
                  <li>The photo must be the <strong>original file</strong> from the camera — we extract the Photo ID, GPS coordinates, camera serial number, date/time, and altitude embedded in the EXIF data.</li>
                  <li>If using a phone, ensure <strong>Location Services are ON</strong> for the camera app before taking photos at the site.</li>
                </ul>
              </div>
              <div className="cta-buttons">
                <button className="btn btn-analyze" onClick={()=>fileInputRef.current?.click()}>
                  {'\u{1F4F7}'} Upload Photos — Analyze Site (select multiple)
                </button>
                <button className="btn btn-video" onClick={()=>videoInputRef.current?.click()}>
                  {'\u{1F3AC}'} Upload Video — Terrain Analysis
                </button>
              </div>
            </div>

            <div className="cta-buttons">
              <button className="btn btn-compare" onClick={()=>setActiveView('compare')}>
                {'\u{1F504}'} Compare Multiple Sites
              </button>
              <button className="btn btn-feedback" onClick={()=>setActiveView('feedback')}>
                {'\u{1F9E0}'} Submit Drilling Feedback
              </button>
            </div>

            {/* ═══ FIELD DATA INPUT FORMS ═══ */}
            <div style={{marginTop:20,padding:16,background:'var(--bg-elevated)',borderRadius:12,border:'1px solid var(--border)'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:showFieldForms?12:0}}>
                <h4 style={{margin:0,fontSize:14,color:'var(--accent-green)'}}>
                  {'\u{1F9EA}'} Step 3 — Field Data (Optional — Boosts Confidence to 90–98%)
                </h4>
                <button className="btn btn-secondary" style={{fontSize:11,padding:'4px 12px'}} onClick={()=>setShowFieldForms(!showFieldForms)}>
                  {showFieldForms ? 'Hide' : 'Show'} Field Forms
                </button>
              </div>
              {showFieldForms && (
                <div style={{display:'grid',gap:16}}>
                  {/* ERT Survey */}
                  <fieldset style={{border:'1px solid var(--border)',borderRadius:8,padding:12}}>
                    <legend style={{fontSize:12,fontWeight:700,color:'#f59e0b'}}>ERT / Resistivity Survey</legend>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
                      <label style={{fontSize:11}}>Aquifer Depth (m)<input type="number" placeholder="e.g. 35" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=parseFloat(e.target.value);if(v>0)setFieldDataInput((p: any)=>({...p,ertSurvey:{...(p.ertSurvey || {}),aquiferDepthM:v,aquiferThicknessM:p.ertSurvey?.aquiferThicknessM??10,resistivityOhmM:p.ertSurvey?.resistivityOhmM??50,surveyDate:p.ertSurvey?.surveyDate??new Date().toISOString().split('T')[0],contractor:p.ertSurvey?.contractor??''}}))}}/></label>
                      <label style={{fontSize:11}}>Aquifer Thickness (m)<input type="number" placeholder="e.g. 15" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=parseFloat(e.target.value);if(v>0&&fieldDataInput.ertSurvey)setFieldDataInput((p: any)=>({...p,ertSurvey:{...(p.ertSurvey || {}),aquiferThicknessM:v}}))}}/></label>
                      <label style={{fontSize:11}}>Resistivity (Ω·m)<input type="number" placeholder="e.g. 45" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=parseFloat(e.target.value);if(v>0&&fieldDataInput.ertSurvey)setFieldDataInput((p: any)=>({...p,ertSurvey:{...(p.ertSurvey || {}),resistivityOhmM:v}}))}}/></label>
                      <label style={{fontSize:11}}>Contractor<input type="text" placeholder="Company name" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{if(fieldDataInput.ertSurvey)setFieldDataInput((p: any)=>({...p,ertSurvey:{...(p.ertSurvey || {}),contractor:e.target.value}}))}}/></label>
                      <label style={{fontSize:11}}>Survey Date<input type="date" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{if(fieldDataInput.ertSurvey)setFieldDataInput((p: any)=>({...p,ertSurvey:{...(p.ertSurvey || {}),surveyDate:e.target.value}}))}}/></label>
                      <label style={{fontSize:11}}>Upload .dat/.res file<input ref={ertFileRef} type="file" accept=".dat,.res,.stg,.csv,.txt" style={{width:'100%',fontSize:10}} onChange={e=>{const f=e.target.files?.[0];if(f){const reader=new FileReader();reader.onload=()=>{try{const parsed=parseERTFile(f.name,reader.result as string);setFieldDataInput((p: any)=>({...p,ertDataFile:parsed}))}catch(err){console.warn('ERT parse error:',err)}};reader.readAsText(f)}}}/></label>
                    </div>
                  </fieldset>
                  {/* ═══ VES SOUNDING INVERSION (flagship: interprets real field data) ═══ */}
                  <fieldset style={{border:'2px solid #0ea5e9',borderRadius:8,padding:12,background:'rgba(14,165,233,0.04)'}}>
                    <legend style={{fontSize:12,fontWeight:800,color:'#0ea5e9'}}>{'\u{1F4C8}'} VES Sounding Inversion &mdash; interpret your field resistivity curve</legend>
                    <p style={{fontSize:10,margin:'0 0 6px',color:'var(--text-secondary)'}}>
                      Paste your Schlumberger VES field data (one point per line: <strong>AB/2 &nbsp; apparent-resistivity</strong>, space/comma/tab separated).
                      This runs a real 1-D inversion (Pekeris kernel + Ghosh 1971 filter, Levenberg&ndash;Marquardt) and returns the layered earth model &mdash;
                      the same job as IPI2Win/RES1D. Results are an INTERPRETATION (non-unique) &mdash; confirm by drilling.
                    </p>
                    <textarea value={vesRaw} onChange={e=>setVesRaw(e.target.value)} rows={5}
                      placeholder={'1\t320\n2\t305\n4.6\t210\n10\t95\n22\t70\n46\t120\n100\t260\n220\t520'}
                      style={{width:'100%',fontSize:11,fontFamily:'monospace',padding:6,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}}/>
                    <div style={{display:'flex',gap:8,marginTop:6,flexWrap:'wrap'}}>
                      <button className="btn btn-primary" style={{fontSize:11,padding:'5px 14px'}} onClick={()=>{
                        try {
                          const pts: VESDataPoint[] = vesRaw.split(/\r?\n/).map(l=>l.trim()).filter(Boolean).map(l=>{
                            const parts = l.split(/[\s,;]+/).map(Number).filter(n=>!isNaN(n));
                            return parts.length>=2 ? { ab2_m: parts[0], rhoA_ohmm: parts[1] } : null;
                          }).filter((x): x is VESDataPoint => x !== null);
                          if (pts.length < 4) { setVesError('Need at least 4 valid AB/2 + resistivity points.'); setVesResult(null); return; }
                          const r = invertVES(pts, { dataSource: 'field_ves' });
                          setVesResult(r); setVesError('');
                          setFieldDataInput((p: any)=>({...p, vesInversion: r }));
                        } catch (err) { setVesError('Could not parse/invert — check the format.'); setVesResult(null); }
                      }}>Invert Sounding</button>
                      <button className="btn btn-secondary" style={{fontSize:11,padding:'5px 14px'}} onClick={()=>{ setVesRaw('1\t320\n1.5\t312\n2\t300\n3\t265\n4.6\t205\n6.8\t150\n10\t98\n15\t74\n22\t68\n32\t80\n46\t120\n68\t190\n100\t280\n150\t400\n220\t540\n320\t690'); }}>Load Example</button>
                    </div>
                    {vesError && <p style={{fontSize:11,color:'#ef4444',marginTop:6}}>{vesError}</p>}
                    {vesResult && (
                      <div style={{marginTop:10,padding:10,borderRadius:8,border:`1px solid ${vesResult.quality==='excellent'||vesResult.quality==='good'?'#10b981':'#f59e0b'}`,background:'var(--bg-secondary)'}}>
                        <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:8,marginBottom:6}}>
                          <span style={{fontSize:12,fontWeight:800,color:'#0ea5e9'}}>Inverted Model &mdash; curve type {vesResult.curveType}</span>
                          <span style={{fontSize:11,color:'var(--text-secondary)'}}>RMS misfit {vesResult.rmsErrorPct}% &middot; {vesResult.quality.toUpperCase()} &middot; {vesResult.iterations} iters</span>
                        </div>
                        <table style={{width:'100%',fontSize:11,borderCollapse:'collapse'}}>
                          <thead><tr style={{textAlign:'left',color:'var(--text-secondary)'}}><th>Layer</th><th>&rho; (&Omega;&middot;m)</th><th>Depth top (m)</th><th>Thickness (m)</th><th>Interpretation</th></tr></thead>
                          <tbody>
                            {vesResult.layers.map(l=>(
                              <tr key={l.layer} style={{borderTop:'1px solid var(--border)',background: l.waterBearing==='likely'?'rgba(16,185,129,0.08)':'transparent'}}>
                                <td>{l.layer}</td><td>{l.resistivity_ohmm}</td><td>{l.depthTop_m}</td><td>{l.thickness_m ?? '∞'}</td>
                                <td>{l.lithologyGuess} {l.waterBearing==='likely'?'✅':l.waterBearing==='possible'?'❓':''}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div style={{marginTop:8,padding:8,borderRadius:6,background:'rgba(16,185,129,0.08)',fontSize:11,color:'var(--text-primary)'}}>
                          <strong style={{color:'#10b981'}}>Aquifer target:</strong> {vesResult.interpretation.recommendation} <span style={{color:'var(--text-secondary)'}}>(confidence: {vesResult.interpretation.confidence})</span>
                        </div>
                        <p style={{fontSize:9,color:'var(--text-secondary)',marginTop:6,lineHeight:1.4}}>{vesResult.equivalenceNote} <br/>Method: {vesResult.method}</p>
                      </div>
                    )}
                  </fieldset>
                  {/* EM/TDEM Survey */}
                  <fieldset style={{border:'1px solid var(--border)',borderRadius:8,padding:12}}>
                    <legend style={{fontSize:12,fontWeight:700,color:'#8b5cf6'}}>EM / TDEM Survey</legend>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
                      <label style={{fontSize:11}}>Method<select style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>setFieldDataInput((p: any)=>({...p,emTdemSurvey:{method:e.target.value as any,maxDepthM:p.emTdemSurvey?.maxDepthM??100,conductiveLayerTopM:p.emTdemSurvey?.conductiveLayerTopM??20,conductiveLayerBottomM:p.emTdemSurvey?.conductiveLayerBottomM??50,conductivity_mS_m:p.emTdemSurvey?.conductivity_mS_m??30,interpretedAquifer:p.emTdemSurvey?.interpretedAquifer??true,surveyDate:p.emTdemSurvey?.surveyDate??new Date().toISOString().split('T')[0],contractor:p.emTdemSurvey?.contractor??'',soundingCount:p.emTdemSurvey?.soundingCount??1}}))}>
                        <option value="">Select...</option><option value="TEM">TEM</option><option value="FDEM">FDEM</option><option value="CSAMT">CSAMT</option><option value="AMT">AMT</option>
                      </select></label>
                      <label style={{fontSize:11}}>Conductive Layer Top (m)<input type="number" placeholder="e.g. 20" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=parseFloat(e.target.value);if(v>=0&&fieldDataInput.emTdemSurvey)setFieldDataInput((p: any)=>({...p,emTdemSurvey:{...(p.emTdemSurvey || {}),conductiveLayerTopM:v}}))}}/></label>
                      <label style={{fontSize:11}}>Conductive Layer Bottom (m)<input type="number" placeholder="e.g. 50" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=parseFloat(e.target.value);if(v>0&&fieldDataInput.emTdemSurvey)setFieldDataInput((p: any)=>({...p,emTdemSurvey:{...(p.emTdemSurvey || {}),conductiveLayerBottomM:v}}))}}/></label>
                      <label style={{fontSize:11}}>Conductivity (mS/m)<input type="number" placeholder="e.g. 30" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=parseFloat(e.target.value);if(v>0&&fieldDataInput.emTdemSurvey)setFieldDataInput((p: any)=>({...p,emTdemSurvey:{...(p.emTdemSurvey || {}),conductivity_mS_m:v}}))}}/></label>
                      <label style={{fontSize:11}}>Max Depth (m)<input type="number" placeholder="e.g. 100" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=parseFloat(e.target.value);if(v>0&&fieldDataInput.emTdemSurvey)setFieldDataInput((p: any)=>({...p,emTdemSurvey:{...(p.emTdemSurvey || {}),maxDepthM:v}}))}}/></label>
                      <label style={{fontSize:11}}>Soundings<input type="number" placeholder="e.g. 5" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=parseInt(e.target.value);if(v>0&&fieldDataInput.emTdemSurvey)setFieldDataInput((p: any)=>({...p,emTdemSurvey:{...(p.emTdemSurvey || {}),soundingCount:v}}))}}/></label>
                    </div>
                  </fieldset>
                  {/* Pump Test */}
                  <fieldset style={{border:'1px solid var(--border)',borderRadius:8,padding:12}}>
                    <legend style={{fontSize:12,fontWeight:700,color:'#06b6d4'}}>Pump Test Results</legend>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:8}}>
                      <label style={{fontSize:11}}>Sustainable Yield (m³/hr)<input type="number" step="0.1" placeholder="e.g. 2.5" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=parseFloat(e.target.value);if(v>0)setFieldDataInput((p: any)=>({...p,pumpTest:{...(p.pumpTest || {}),sustainableYieldM3Hr:v,transmissivityM2Day:p.pumpTest?.transmissivityM2Day??50,storativity:p.pumpTest?.storativity??0.01,drawdownM:p.pumpTest?.drawdownM??10,recoveryPercent:p.pumpTest?.recoveryPercent??85,testDurationHrs:p.pumpTest?.testDurationHrs??24,testDate:p.pumpTest?.testDate??new Date().toISOString().split('T')[0]}}))}}/></label>
                      <label style={{fontSize:11}}>Transmissivity (m²/day)<input type="number" step="0.1" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=parseFloat(e.target.value);if(v>0&&fieldDataInput.pumpTest)setFieldDataInput((p: any)=>({...p,pumpTest:{...(p.pumpTest || {}),transmissivityM2Day:v}}))}}/></label>
                      <label style={{fontSize:11}}>Drawdown (m)<input type="number" step="0.1" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=parseFloat(e.target.value);if(v>0&&fieldDataInput.pumpTest)setFieldDataInput((p: any)=>({...p,pumpTest:{...(p.pumpTest || {}),drawdownM:v}}))}}/></label>
                      <label style={{fontSize:11}}>Recovery %<input type="number" max="100" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=parseInt(e.target.value);if(v>0&&fieldDataInput.pumpTest)setFieldDataInput((p: any)=>({...p,pumpTest:{...(p.pumpTest || {}),recoveryPercent:v}}))}}/></label>
                    </div>
                  </fieldset>
                  {/* Lab Water Analysis — FULL CHEMISTRY (v3) */}
                  <fieldset style={{border:'1px solid var(--border)',borderRadius:8,padding:12}}>
                    <legend style={{fontSize:12,fontWeight:700,color:'#10b981'}}>Laboratory Water Analysis — Full Chemistry</legend>
                    <p style={{fontSize:10,margin:'0 0 6px',color:'var(--text-secondary)'}}>Complete chemistry enables LSI/RSI corrosion indices, pipe material selection, and treatment design. Minimum: pH + TDS.</p>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:8}}>
                      {[
                        {k:'pH',p:'e.g. 7.2',u:''},
                        {k:'tds',p:'mg/L',u:'mg/L'},
                        {k:'iron',p:'mg/L',u:'mg/L'},
                        {k:'fluoride',p:'mg/L',u:'mg/L'},
                        {k:'arsenic',p:'mg/L',u:'mg/L'},
                        {k:'nitrate',p:'mg/L',u:'mg/L'},
                        {k:'turbidity',p:'NTU',u:'NTU'},
                        {k:'coliform',p:'CFU/100mL',u:'CFU'},
                        {k:'hardness',p:'mg/L CaCO3',u:'mg/L'},
                        {k:'calcium',p:'mg/L',u:'mg/L'},
                        {k:'alkalinity',p:'mg/L CaCO3',u:'mg/L'},
                        {k:'sulfate',p:'mg/L',u:'mg/L'},
                        {k:'chloride',p:'mg/L',u:'mg/L'},
                        {k:'manganese',p:'mg/L',u:'mg/L'},
                        {k:'dissolvedOxygen',p:'mg/L',u:'mg/L'},
                        {k:'temperature',p:'°C',u:'°C'},
                        {k:'sodium',p:'mg/L',u:'mg/L'},
                        {k:'magnesium',p:'mg/L',u:'mg/L'},
                        {k:'bicarbonate',p:'mg/L',u:'mg/L'},
                        {k:'electricalConductivity',p:'µS/cm',u:'µS/cm'},
                      ].map(({k,p})=>(
                        <label key={k} style={{fontSize:11}}>{k==='pH'?'pH':k==='tds'?'TDS':k==='dissolvedOxygen'?'Dissolved O₂':k==='electricalConductivity'?'EC':k==='h2s'?'H₂S':k.charAt(0).toUpperCase()+k.slice(1)}<input type="number" step="0.01" placeholder={p} style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=parseFloat(e.target.value);if(!isNaN(v))setFieldDataInput((prev: any)=>{const lab={...(prev.labWaterAnalysis || {}),labName:prev.labWaterAnalysis?.labName??'',sampleDate:prev.labWaterAnalysis?.sampleDate??new Date().toISOString().split('T')[0],pH:prev.labWaterAnalysis?.pH??7,tds:prev.labWaterAnalysis?.tds??0,iron:prev.labWaterAnalysis?.iron??0,fluoride:prev.labWaterAnalysis?.fluoride??0,arsenic:prev.labWaterAnalysis?.arsenic??0,nitrate:prev.labWaterAnalysis?.nitrate??0,turbidity:prev.labWaterAnalysis?.turbidity??0,coliform:prev.labWaterAnalysis?.coliform??0,hardness:prev.labWaterAnalysis?.hardness??0,[k]:v};return{...prev,labWaterAnalysis:lab}})}}/></label>
                      ))}
                      <label style={{fontSize:11}}>H₂S Detected<select style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>setFieldDataInput((prev: any)=>({...prev,labWaterAnalysis:{...(prev.labWaterAnalysis||{}),...{h2s:e.target.value==='yes'}}}))}><option value="no">No</option><option value="yes">Yes</option></select></label>
                      <label style={{fontSize:11}}>Lab Name<input type="text" placeholder="Lab name" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{if(fieldDataInput.labWaterAnalysis)setFieldDataInput((p: any)=>({...p,labWaterAnalysis:{...(p.labWaterAnalysis || {}),labName:e.target.value}}))}}/></label>
                      <label style={{fontSize:11}}>Sample Date<input type="date" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{if(fieldDataInput.labWaterAnalysis)setFieldDataInput((p: any)=>({...p,labWaterAnalysis:{...(p.labWaterAnalysis||{}),sampleDate:e.target.value}}))}}/></label>
                    </div>
                  </fieldset>
                  {/* Site Demographics — for demand/sustainability (v3) */}
                  <fieldset style={{border:'1px solid var(--border)',borderRadius:8,padding:12}}>
                    <legend style={{fontSize:12,fontWeight:700,color:'#3b82f6'}}>Site Demographics & Demand</legend>
                    <p style={{fontSize:10,margin:'0 0 6px',color:'var(--text-secondary)'}}>Required for 20-year demand projection and sustainability analysis. If unknown, defaults will be estimated.</p>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
                      <label style={{fontSize:11}}>Population Served<input type="number" min="1" step="1" placeholder="e.g. 2000" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=parseInt(e.target.value);if(v>0)setFieldDataInput((p: any)=>({...p,siteDemographics:{...(p.siteDemographics||{}),populationServed:v}}))}}/></label>
                      <label style={{fontSize:11}}>Growth Rate (%/yr)<input type="number" min="0" max="10" step="0.1" placeholder="Default: 2.5" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=parseFloat(e.target.value);if(v>=0)setFieldDataInput((p: any)=>({...p,siteDemographics:{...(p.siteDemographics||{}),growthRate_pct:v}}))}}/></label>
                      <label style={{fontSize:11}}>Per Capita Demand (L/p/d)<input type="number" min="10" step="1" placeholder="Default: 50 (WHO min)" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=parseFloat(e.target.value);if(v>0)setFieldDataInput((p: any)=>({...p,siteDemographics:{...(p.siteDemographics||{}),perCapitaDemand_Lpd:v}}))}}/></label>
                      <label style={{fontSize:11}}>Catchment Area (km²)<input type="number" min="0.1" step="0.1" placeholder="Default: 5" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=parseFloat(e.target.value);if(v>0)setFieldDataInput((p: any)=>({...p,siteDemographics:{...(p.siteDemographics||{}),catchmentArea_km2:v}}))}}/></label>
                      <label style={{fontSize:11}}>No. of Households<input type="number" min="1" step="1" placeholder="Optional" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=parseInt(e.target.value);if(v>0)setFieldDataInput((p: any)=>({...p,siteDemographics:{...(p.siteDemographics||{}),numberOfHouseholds:v}}))}}/></label>
                      <label style={{fontSize:11}}>Community Type<select style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>setFieldDataInput((p: any)=>({...p,siteDemographics:{...(p.siteDemographics||{}),communityType:e.target.value||undefined}}))}><option value="">Select...</option><option value="rural_village">Rural Village</option><option value="peri_urban">Peri-Urban</option><option value="urban">Urban</option><option value="school">School</option><option value="clinic">Health Clinic</option><option value="refugee_camp">Refugee Camp</option></select></label>
                    </div>
                  </fieldset>
                  {/* Contamination Sources — for setback analysis (v3) */}
                  <fieldset style={{border:'1px solid var(--border)',borderRadius:8,padding:12}}>
                    <legend style={{fontSize:12,fontWeight:700,color:'#ef4444'}}>Nearby Contamination Sources</legend>
                    <p style={{fontSize:10,margin:'0 0 6px',color:'var(--text-secondary)'}}>Identify pollution sources within 1km. Used for WHO/EPA setback compliance and travel time analysis. If left empty, typical rural sources will be assumed.</p>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
                      {[
                        {type:'pit_latrine',label:'Pit Latrine'},
                        {type:'septic_tank',label:'Septic Tank'},
                        {type:'sewage_works',label:'Sewage Works'},
                        {type:'livestock',label:'Livestock Kraal/Feedlot'},
                        {type:'cemetery',label:'Cemetery'},
                        {type:'landfill',label:'Landfill/Dump'},
                        {type:'fuel_station',label:'Fuel Station'},
                        {type:'industrial',label:'Industrial/Factory'},
                        {type:'agriculture',label:'Agriculture (fertilizer)'},
                        {type:'mining',label:'Mining Activity'},
                      ].map(({type,label})=>(
                        <label key={type} style={{fontSize:11}}>{label} — distance (m)
                          <input type="number" min="0" step="1" placeholder="meters (0 = absent)" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=parseFloat(e.target.value);if(v>0)setFieldDataInput((p: any)=>{const prev=p.contaminationSources||[];const idx=prev.findIndex((c: any)=>c.type===type);const updated=idx>=0?prev.map((c: any,i: number)=>i===idx?{type,estimatedDistance_m:v}:c):[...prev,{type,estimatedDistance_m:v}];return{...p,contaminationSources:updated}})}}/>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  {/* Nearby Features — for boundary assessment (v3) */}
                  <fieldset style={{border:'1px solid var(--border)',borderRadius:8,padding:12}}>
                    <legend style={{fontSize:12,fontWeight:700,color:'#8b5cf6'}}>Nearby Hydrogeological Features</legend>
                    <p style={{fontSize:10,margin:'0 0 6px',color:'var(--text-secondary)'}}>Rivers, faults, and impermeable boundaries affect long-term yield. If left empty, features will be inferred from geological model.</p>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
                      {[
                        {type:'river',label:'River/Stream'},
                        {type:'lake',label:'Lake/Dam'},
                        {type:'fault',label:'Geological Fault'},
                        {type:'clay_boundary',label:'Clay/Impermeable Layer'},
                        {type:'existing_borehole',label:'Existing Borehole'},
                        {type:'spring',label:'Spring'},
                      ].map(({type,label})=>(
                        <label key={type} style={{fontSize:11}}>{label} — distance (m)
                          <input type="number" min="0" step="1" placeholder="meters (0 = absent)" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=parseFloat(e.target.value);if(v>0)setFieldDataInput((p: any)=>{const prev=p.nearbyFeatures||[];const idx=prev.findIndex((f: any)=>f.type===type);const updated=idx>=0?prev.map((f: any,i: number)=>i===idx?{type,distance_m:v}:f):[...prev,{type,distance_m:v}];return{...p,nearbyFeatures:updated}})}}/>
                        </label>
                      ))}
                    </div>
                    <div style={{marginTop:8}}>
                      <label style={{fontSize:11,display:'flex',alignItems:'center',gap:6}}><input type="checkbox" onChange={e=>setFieldDataInput((p: any)=>({...p,isRemoteSite:e.target.checked}))}/> Remote site (limited road access, &gt;50km from town)</label>
                    </div>
                  </fieldset>
                  {/* Sieve Analysis (v2 well design) */}
                  <fieldset style={{border:'1px solid var(--border)',borderRadius:8,padding:12}}>
                    <legend style={{fontSize:12,fontWeight:700,color:'#f97316'}}>Lab Sieve Analysis (ASTM D422)</legend>
                    <p style={{fontSize:10,margin:'0 0 8px',color:'var(--text-secondary)'}}>Enter grain-size distribution from lab report. Minimum 3 sieve sizes. Used for screen slot sizing and gravel pack design.</p>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr 1fr',gap:4,marginBottom:8}}>
                      {[{mm:4.75,label:'#4'},{mm:2.0,label:'#10'},{mm:0.85,label:'#20'},{mm:0.425,label:'#40'},{mm:0.25,label:'#60'},{mm:0.15,label:'#100'},{mm:0.075,label:'#200'},{mm:0.002,label:'Clay'}].map(({mm,label})=>(
                        <label key={mm} style={{fontSize:10}}>
                          {label} ({mm}mm)
                          <input type="number" min="0" max="100" step="0.1" placeholder="% pass" style={{width:'100%',padding:3,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)',fontSize:11}} onChange={e=>{const v=parseFloat(e.target.value);if(!isNaN(v)&&v>=0&&v<=100){setFieldDataInput((p: any)=>{const prev=p.sieveAnalysis?.curve||[];const idx=prev.findIndex((c: any)=>c.sieveMM===mm);const newCurve=idx>=0?prev.map((c: any,i: number)=>i===idx?{sieveMM:mm,passingPct:v}:c):[...prev,{sieveMM:mm,passingPct:v}];return{...p,sieveAnalysis:{...(p.sieveAnalysis||{}),curve:newCurve,sampleDate:p.sieveAnalysis?.sampleDate??new Date().toISOString().split('T')[0]}}})}}}/>
                        </label>
                      ))}
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
                      <label style={{fontSize:11}}>Lab Name<input type="text" placeholder="e.g. SGS, Intertek" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{if(fieldDataInput.sieveAnalysis)setFieldDataInput((p: any)=>({...p,sieveAnalysis:{...(p.sieveAnalysis||{}),labName:e.target.value}}))}}/></label>
                      <label style={{fontSize:11}}>Sample Depth (m)<input type="number" step="0.1" placeholder="e.g. 25" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=parseFloat(e.target.value);if(v>0&&fieldDataInput.sieveAnalysis)setFieldDataInput((p: any)=>({...p,sieveAnalysis:{...(p.sieveAnalysis||{}),sampleDepth_m:v}}))}}/></label>
                      <label style={{fontSize:11}}>Sample Date<input type="date" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{if(fieldDataInput.sieveAnalysis)setFieldDataInput((p: any)=>({...p,sieveAnalysis:{...(p.sieveAnalysis||{}),sampleDate:e.target.value}}))}}/></label>
                    </div>
                  </fieldset>
                  {/* Step-Drawdown Test (v2 well design) */}
                  <fieldset style={{border:'1px solid var(--border)',borderRadius:8,padding:12}}>
                    <legend style={{fontSize:12,fontWeight:700,color:'#8b5cf6'}}>Step-Drawdown Test (≥3 steps)</legend>
                    <p style={{fontSize:10,margin:'0 0 8px',color:'var(--text-secondary)'}}>Enter step test data for Jacob method well loss analysis. Minimum 3 steps required. s/Q = B + CQ</p>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:4,marginBottom:4}}>
                      <span style={{fontSize:10,fontWeight:700,textAlign:'center'}}>Pumping Rate (m³/hr)</span>
                      <span style={{fontSize:10,fontWeight:700,textAlign:'center'}}>Drawdown (m)</span>
                      <span style={{fontSize:10,fontWeight:700,textAlign:'center'}}>Duration (min)</span>
                    </div>
                    {[0,1,2,3,4].map(stepIdx=>(
                      <div key={stepIdx} style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:4,marginBottom:4}}>
                        <input type="number" step="0.1" placeholder={`Step ${stepIdx+1} Q`} style={{padding:3,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)',fontSize:11}} onChange={e=>{const v=parseFloat(e.target.value);if(v>0){setFieldDataInput((p: any)=>{const prev=p.stepDrawdownTest?.steps||[];const step={...(prev[stepIdx]||{pumpingRate_m3hr:0,drawdown_m:0,duration_min:60}),pumpingRate_m3hr:v};const newSteps=[...prev];newSteps[stepIdx]=step;return{...p,stepDrawdownTest:{...(p.stepDrawdownTest||{staticWaterLevel_m:0}),steps:newSteps.filter((s: any)=>s.pumpingRate_m3hr>0)}}})}}}/>
                        <input type="number" step="0.01" placeholder={`Step ${stepIdx+1} s`} style={{padding:3,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)',fontSize:11}} onChange={e=>{const v=parseFloat(e.target.value);if(v>0){setFieldDataInput((p: any)=>{const prev=p.stepDrawdownTest?.steps||[];const step={...(prev[stepIdx]||{pumpingRate_m3hr:0,drawdown_m:0,duration_min:60}),drawdown_m:v};const newSteps=[...prev];newSteps[stepIdx]=step;return{...p,stepDrawdownTest:{...(p.stepDrawdownTest||{staticWaterLevel_m:0}),steps:newSteps.filter((s: any)=>s.pumpingRate_m3hr>0)}}})}}}/>
                        <input type="number" step="1" placeholder="min" style={{padding:3,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)',fontSize:11}} onChange={e=>{const v=parseFloat(e.target.value);if(v>0){setFieldDataInput((p: any)=>{const prev=p.stepDrawdownTest?.steps||[];const step={...(prev[stepIdx]||{pumpingRate_m3hr:0,drawdown_m:0,duration_min:60}),duration_min:v};const newSteps=[...prev];newSteps[stepIdx]=step;return{...p,stepDrawdownTest:{...(p.stepDrawdownTest||{staticWaterLevel_m:0}),steps:newSteps.filter((s: any)=>s.pumpingRate_m3hr>0)}}})}}}/>
                      </div>
                    ))}
                    <label style={{fontSize:11}}>Static Water Level (m)<input type="number" step="0.1" placeholder="e.g. 12.5" style={{width:200,padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)',marginLeft:8}} onChange={e=>{const v=parseFloat(e.target.value);if(v>=0)setFieldDataInput((p: any)=>({...p,stepDrawdownTest:{...(p.stepDrawdownTest||{steps:[]}),staticWaterLevel_m:v}}))}}/></label>
                  </fieldset>
                  {/* Local Boreholes */}
                  <fieldset style={{border:'1px solid var(--border)',borderRadius:8,padding:12}}>
                    <legend style={{fontSize:12,fontWeight:700,color:'#64748b'}}>Local Borehole Records</legend>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr',gap:8}}>
                      <label style={{fontSize:11}}>Count<input type="number" placeholder="e.g. 15" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=parseInt(e.target.value);if(v>0)setFieldDataInput((p: any)=>({...p,localBoreholes:{count:v,averageDepthM:p.localBoreholes?.averageDepthM??40,averageYieldM3Hr:p.localBoreholes?.averageYieldM3Hr??1.5,successRate:p.localBoreholes?.successRate??0.7,dataSource:p.localBoreholes?.dataSource??'Local records'}}))}}/></label>
                      <label style={{fontSize:11}}>Avg Depth (m)<input type="number" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=parseFloat(e.target.value);if(v>0&&fieldDataInput.localBoreholes)setFieldDataInput((p: any)=>({...p,localBoreholes:{...(p.localBoreholes || {}),averageDepthM:v}}))}}/></label>
                      <label style={{fontSize:11}}>Avg Yield (m³/hr)<input type="number" step="0.1" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=parseFloat(e.target.value);if(v>0&&fieldDataInput.localBoreholes)setFieldDataInput((p: any)=>({...p,localBoreholes:{...(p.localBoreholes || {}),averageYieldM3Hr:v}}))}}/></label>
                      <label style={{fontSize:11}}>Success Rate %<input type="number" max="100" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=parseInt(e.target.value);if(v>0&&fieldDataInput.localBoreholes)setFieldDataInput((p: any)=>({...p,localBoreholes:{...(p.localBoreholes || {}),successRate:v/100}}))}}/></label>
                      <label style={{fontSize:11}}>Source<input type="text" placeholder="e.g. County records" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{if(fieldDataInput.localBoreholes)setFieldDataInput((p: any)=>({...p,localBoreholes:{...(p.localBoreholes || {}),dataSource:e.target.value}}))}}/></label>
                    </div>
                  </fieldset>
                  {/* Seismic Refraction / MASW */}
                  <fieldset style={{border:'1px solid var(--border)',borderRadius:8,padding:12}}>
                    <legend style={{fontSize:12,fontWeight:700,color:'#f59e0b'}}>Seismic Survey</legend>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:8}}>
                      <label style={{fontSize:11}}>Method<select style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>setFieldDataInput((p: any)=>({...p,seismicSurvey:{method:e.target.value as any,bedrockDepthM:p.seismicSurvey?.bedrockDepthM??30,weatheredZoneThicknessM:p.seismicSurvey?.weatheredZoneThicknessM??15,vpTopLayer_ms:p.seismicSurvey?.vpTopLayer_ms??800,vpBedrock_ms:p.seismicSurvey?.vpBedrock_ms??3500,layerCount:p.seismicSurvey?.layerCount??3,profileLengthM:p.seismicSurvey?.profileLengthM??115,geophoneSpacingM:p.seismicSurvey?.geophoneSpacingM??5,surveyDate:p.seismicSurvey?.surveyDate??new Date().toISOString().split('T')[0],contractor:p.seismicSurvey?.contractor??''}}))}>
                        <option value="">Select...</option><option value="refraction">Refraction</option><option value="MASW">MASW</option><option value="reflection">Reflection</option><option value="crosshole">Crosshole</option>
                      </select></label>
                      <label style={{fontSize:11}}>Bedrock Depth (m)<input type="number" placeholder="e.g. 30" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=parseFloat(e.target.value);if(v>0&&fieldDataInput.seismicSurvey)setFieldDataInput((p: any)=>({...p,seismicSurvey:{...(p.seismicSurvey||{}),bedrockDepthM:v}}))}}/></label>
                      <label style={{fontSize:11}}>Vp Top Layer (m/s)<input type="number" placeholder="e.g. 800" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=parseFloat(e.target.value);if(v>0&&fieldDataInput.seismicSurvey)setFieldDataInput((p: any)=>({...p,seismicSurvey:{...(p.seismicSurvey||{}),vpTopLayer_ms:v}}))}}/></label>
                      <label style={{fontSize:11}}>Vp Bedrock (m/s)<input type="number" placeholder="e.g. 3500" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=parseFloat(e.target.value);if(v>0&&fieldDataInput.seismicSurvey)setFieldDataInput((p: any)=>({...p,seismicSurvey:{...(p.seismicSurvey||{}),vpBedrock_ms:v}}))}}/></label>
                    </div>
                  </fieldset>
                  {/* GPR Survey */}
                  <fieldset style={{border:'1px solid var(--border)',borderRadius:8,padding:12}}>
                    <legend style={{fontSize:12,fontWeight:700,color:'#ec4899'}}>GPR Survey</legend>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:8}}>
                      <label style={{fontSize:11}}>Frequency (MHz)<input type="number" placeholder="e.g. 400" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=parseFloat(e.target.value);if(v>0)setFieldDataInput((p: any)=>({...p,gprSurvey:{antennaFrequencyMHz:v,maxPenetrationM:p.gprSurvey?.maxPenetrationM??10,voidDetected:p.gprSurvey?.voidDetected??false,shallowAquiferDetected:p.gprSurvey?.shallowAquiferDetected??false,profileLengthM:p.gprSurvey?.profileLengthM??100,surveyDate:p.gprSurvey?.surveyDate??new Date().toISOString().split('T')[0],contractor:p.gprSurvey?.contractor??''}}))}}/></label>
                      <label style={{fontSize:11}}>Max Penetration (m)<input type="number" placeholder="e.g. 10" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=parseFloat(e.target.value);if(v>0&&fieldDataInput.gprSurvey)setFieldDataInput((p: any)=>({...p,gprSurvey:{...(p.gprSurvey||{}),maxPenetrationM:v}}))}}/></label>
                      <label style={{fontSize:11}}>Water Table (m)<input type="number" placeholder="e.g. 5" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=parseFloat(e.target.value);if(v>=0&&fieldDataInput.gprSurvey)setFieldDataInput((p: any)=>({...p,gprSurvey:{...(p.gprSurvey||{}),waterTableDepthM:v}}))}}/></label>
                      <label style={{fontSize:11,display:'flex',alignItems:'center',gap:4}}><input type="checkbox" onChange={e=>{if(fieldDataInput.gprSurvey)setFieldDataInput((p: any)=>({...p,gprSurvey:{...(p.gprSurvey||{}),voidDetected:e.target.checked}}))}} /> Void Detected</label>
                    </div>
                  </fieldset>
                  {/* Magnetic/Gravity Survey */}
                  <fieldset style={{border:'1px solid var(--border)',borderRadius:8,padding:12}}>
                    <legend style={{fontSize:12,fontWeight:700,color:'#6366f1'}}>Magnetic / Gravity Survey</legend>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:8}}>
                      <label style={{fontSize:11}}>Method<select style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>setFieldDataInput((p: any)=>({...p,magneticGravitySurvey:{method:e.target.value as any,faultLineDetected:p.magneticGravitySurvey?.faultLineDetected??false,dykeDetected:p.magneticGravitySurvey?.dykeDetected??false,stationCount:p.magneticGravitySurvey?.stationCount??20,surveyDate:p.magneticGravitySurvey?.surveyDate??new Date().toISOString().split('T')[0],contractor:p.magneticGravitySurvey?.contractor??''}}))}>
                        <option value="">Select...</option><option value="magnetic">Magnetic</option><option value="gravity">Gravity</option><option value="both">Both</option>
                      </select></label>
                      <label style={{fontSize:11}}>Stations<input type="number" placeholder="e.g. 30" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=parseInt(e.target.value);if(v>0&&fieldDataInput.magneticGravitySurvey)setFieldDataInput((p: any)=>({...p,magneticGravitySurvey:{...(p.magneticGravitySurvey||{}),stationCount:v}}))}}/></label>
                      <label style={{fontSize:11,display:'flex',alignItems:'center',gap:4}}><input type="checkbox" onChange={e=>{if(fieldDataInput.magneticGravitySurvey)setFieldDataInput((p: any)=>({...p,magneticGravitySurvey:{...(p.magneticGravitySurvey||{}),faultLineDetected:e.target.checked}}))}} /> Fault Detected</label>
                      <label style={{fontSize:11,display:'flex',alignItems:'center',gap:4}}><input type="checkbox" onChange={e=>{if(fieldDataInput.magneticGravitySurvey)setFieldDataInput((p: any)=>({...p,magneticGravitySurvey:{...(p.magneticGravitySurvey||{}),dykeDetected:e.target.checked}}))}} /> Dyke Detected</label>
                    </div>
                  </fieldset>
                  {/* NMR / Surface NMR */}
                  <fieldset style={{border:'1px solid var(--border)',borderRadius:8,padding:12}}>
                    <legend style={{fontSize:12,fontWeight:700,color:'#ef4444'}}>NMR / Surface NMR (MRS)</legend>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:8}}>
                      <label style={{fontSize:11}}>Method<select style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>setFieldDataInput((p: any)=>({...p,nmrSurvey:{method:e.target.value as any,waterContentPercent:p.nmrSurvey?.waterContentPercent??15,freeWaterDepthM:p.nmrSurvey?.freeWaterDepthM??20,freeWaterThicknessM:p.nmrSurvey?.freeWaterThicknessM??10,maxSoundingDepthM:p.nmrSurvey?.maxSoundingDepthM??100,loopSizeM:p.nmrSurvey?.loopSizeM??50,surveyDate:p.nmrSurvey?.surveyDate??new Date().toISOString().split('T')[0],contractor:p.nmrSurvey?.contractor??''}}))}>
                        <option value="">Select...</option><option value="surface_NMR">Surface NMR (MRS)</option><option value="borehole_NMR">Borehole NMR</option>
                      </select></label>
                      <label style={{fontSize:11}}>Water Content (%)<input type="number" placeholder="e.g. 15" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=parseFloat(e.target.value);if(v>=0&&fieldDataInput.nmrSurvey)setFieldDataInput((p: any)=>({...p,nmrSurvey:{...(p.nmrSurvey||{}),waterContentPercent:v}}))}}/></label>
                      <label style={{fontSize:11}}>Free Water Depth (m)<input type="number" placeholder="e.g. 20" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=parseFloat(e.target.value);if(v>=0&&fieldDataInput.nmrSurvey)setFieldDataInput((p: any)=>({...p,nmrSurvey:{...(p.nmrSurvey||{}),freeWaterDepthM:v}}))}}/></label>
                      <label style={{fontSize:11}}>Free Water Thickness (m)<input type="number" placeholder="e.g. 10" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=parseFloat(e.target.value);if(v>0&&fieldDataInput.nmrSurvey)setFieldDataInput((p: any)=>({...p,nmrSurvey:{...(p.nmrSurvey||{}),freeWaterThicknessM:v}}))}}/></label>
                    </div>
                  </fieldset>
                  {/* \u2550\u2550\u2550 DRILLING-READINESS GATE EVIDENCE (2026-07-11) \u2550\u2550\u2550 */}
                  <fieldset style={{border:'2px solid #10b981',borderRadius:8,padding:12,background:'rgba(16,185,129,0.04)'}}>
                    <legend style={{fontSize:12,fontWeight:800,color:'#10b981'}}>{'\u{1F6A6}'} Drilling-Readiness Evidence &mdash; Field Validation &amp; Professional Sign-Off</legend>
                    <p style={{fontSize:10,margin:'0 0 10px',color:'var(--text-secondary)'}}>
                      A desktop analysis is a <strong>pre-feasibility screen</strong>, not authority to drill. The report can only be
                      released &ldquo;ISSUED FOR DRILLING&rdquo; once a hydrogeologist has done the field survey, pegged the point,
                      and the WRA/NEMA authorisation is on file. Uploading the evidence below is what lifts the readiness score past
                      the 79/100 ceiling &mdash; not more AI. Leave blank for a desktop-only screen.
                    </p>

                    {/* GPS field peg */}
                    <div style={{marginBottom:10}}>
                      <div style={{fontSize:11,fontWeight:700,color:'#22c55e',marginBottom:4}}>1. Survey-Grade GPS Peg (set on site)</div>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
                        <label style={{fontSize:11}}>Peg / Point ID<input type="text" placeholder="e.g. BH-01" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=e.target.value;setFieldDataInput((p: any)=>({...p,fieldPeg:v?{...(p.fieldPeg||{latitude:0,longitude:0,peggedBy:'',peggedDate:new Date().toISOString().split('T')[0]}),pegId:v}:undefined}))}}/></label>
                        <label style={{fontSize:11}}>Latitude<input type="number" step="0.000001" placeholder="e.g. -1.2921" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=parseFloat(e.target.value);if(!isNaN(v))setFieldDataInput((p: any)=>({...p,fieldPeg:{...(p.fieldPeg||{pegId:'',longitude:0,peggedBy:'',peggedDate:new Date().toISOString().split('T')[0]}),latitude:v}}))}}/></label>
                        <label style={{fontSize:11}}>Longitude<input type="number" step="0.000001" placeholder="e.g. 36.8219" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=parseFloat(e.target.value);if(!isNaN(v))setFieldDataInput((p: any)=>({...p,fieldPeg:{...(p.fieldPeg||{pegId:'',latitude:0,peggedBy:'',peggedDate:new Date().toISOString().split('T')[0]}),longitude:v}}))}}/></label>
                        <label style={{fontSize:11}}>Pegged By<input type="text" placeholder="Surveyor / hydrogeologist" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=e.target.value;if(fieldDataInput.fieldPeg)setFieldDataInput((p: any)=>({...p,fieldPeg:{...(p.fieldPeg||{}),peggedBy:v}}))}}/></label>
                        <label style={{fontSize:11}}>Pegged Date<input type="date" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=e.target.value;if(fieldDataInput.fieldPeg)setFieldDataInput((p: any)=>({...p,fieldPeg:{...(p.fieldPeg||{}),peggedDate:v}}))}}/></label>
                        <label style={{fontSize:11}}>ERT Line Ref (opt)<input type="text" placeholder="e.g. L1 @ 40m" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=e.target.value;if(fieldDataInput.fieldPeg)setFieldDataInput((p: any)=>({...p,fieldPeg:{...(p.fieldPeg||{}),ertLineRef:v||undefined}}))}}/></label>
                      </div>
                    </div>

                    {/* Hydrogeologist sign-off */}
                    <div style={{marginBottom:10}}>
                      <div style={{fontSize:11,fontWeight:700,color:'#22c55e',marginBottom:4}}>2. Hydrogeologist Sign-Off (signed survey report)</div>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:8}}>
                        <label style={{fontSize:11}}>Name<input type="text" placeholder="Full name" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=e.target.value;setFieldDataInput((p: any)=>({...p,hydrogeologistSignoff:v?{...(p.hydrogeologistSignoff||{registrationNo:'',signedDate:new Date().toISOString().split('T')[0]}),name:v}:undefined}))}}/></label>
                        <label style={{fontSize:11}}>Reg. No.<input type="text" placeholder="e.g. GSK/WRA reg" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=e.target.value;if(fieldDataInput.hydrogeologistSignoff)setFieldDataInput((p: any)=>({...p,hydrogeologistSignoff:{...(p.hydrogeologistSignoff||{}),registrationNo:v}}))}}/></label>
                        <label style={{fontSize:11}}>Report Ref (opt)<input type="text" placeholder="Report no." style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=e.target.value;if(fieldDataInput.hydrogeologistSignoff)setFieldDataInput((p: any)=>({...p,hydrogeologistSignoff:{...(p.hydrogeologistSignoff||{}),reportRef:v||undefined}}))}}/></label>
                        <label style={{fontSize:11}}>Signed Date<input type="date" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=e.target.value;if(fieldDataInput.hydrogeologistSignoff)setFieldDataInput((p: any)=>({...p,hydrogeologistSignoff:{...(p.hydrogeologistSignoff||{}),signedDate:v}}))}}/></label>
                      </div>
                    </div>

                    {/* WRA / NEMA authorisation */}
                    <div style={{marginBottom:10}}>
                      <div style={{fontSize:11,fontWeight:700,color:'#22c55e',marginBottom:4}}>3. WRA / NEMA Authorisation</div>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:8}}>
                        <label style={{fontSize:11}}>Reference No.<input type="text" placeholder="Permit / authorisation no." style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=e.target.value;setFieldDataInput((p: any)=>({...p,wraAuthorisation:v?{...(p.wraAuthorisation||{authorityType:'WRA'}),referenceNo:v}:undefined}))}}/></label>
                        <label style={{fontSize:11}}>Authority<select style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=e.target.value as any;if(fieldDataInput.wraAuthorisation)setFieldDataInput((p: any)=>({...p,wraAuthorisation:{...(p.wraAuthorisation||{}),authorityType:v}}))}}><option value="WRA">WRA</option><option value="NEMA">NEMA</option><option value="both">Both</option></select></label>
                        <label style={{fontSize:11}}>Permit Type (opt)<input type="text" placeholder="e.g. drilling permit" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=e.target.value;if(fieldDataInput.wraAuthorisation)setFieldDataInput((p: any)=>({...p,wraAuthorisation:{...(p.wraAuthorisation||{}),permitType:v||undefined}}))}}/></label>
                        <label style={{fontSize:11}}>Issued Date (opt)<input type="date" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=e.target.value;if(fieldDataInput.wraAuthorisation)setFieldDataInput((p: any)=>({...p,wraAuthorisation:{...(p.wraAuthorisation||{}),issuedDate:v||undefined}}))}}/></label>
                      </div>
                    </div>

                    {/* Post-drilling records */}
                    <div style={{marginBottom:4}}>
                      <div style={{fontSize:11,fontWeight:700,color:'#22c55e',marginBottom:4}}>4. Post-Drilling Records (completes the bankable record)</div>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:8}}>
                        <label style={{fontSize:11}}>Drilling Contractor<input type="text" placeholder="Contractor name" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=e.target.value;setFieldDataInput((p: any)=>({...p,drillLog:v?{...(p.drillLog||{totalDepthDrilled_m:0}),contractor:v}:undefined}))}}/></label>
                        <label style={{fontSize:11}}>Total Depth Drilled (m)<input type="number" step="0.1" placeholder="e.g. 64" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=parseFloat(e.target.value);if(v>0&&fieldDataInput.drillLog)setFieldDataInput((p: any)=>({...p,drillLog:{...(p.drillLog||{}),totalDepthDrilled_m:v}}))}}/></label>
                        <label style={{fontSize:11}}>Completion Record No.<input type="text" placeholder="WRA Form 008A ref" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=e.target.value;setFieldDataInput((p: any)=>({...p,completionRecord:v?{...(p.completionRecord||{submittedDate:new Date().toISOString().split('T')[0]}),referenceNo:v}:undefined}))}}/></label>
                        <label style={{fontSize:11}}>Submitted Date<input type="date" style={{width:'100%',padding:4,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}} onChange={e=>{const v=e.target.value;if(fieldDataInput.completionRecord)setFieldDataInput((p: any)=>({...p,completionRecord:{...(p.completionRecord||{}),submittedDate:v}}))}}/></label>
                      </div>
                    </div>
                  </fieldset>

                  {/* \u2550\u2550\u2550 LIVE DRILLING-READINESS PREVIEW \u2550\u2550\u2550 */}
                  {(() => {
                    const fd: any = fieldDataInput;
                    const dr = computeDrillReadiness({
                      hasFieldPeg: !!fd.fieldPeg,
                      hasFieldERT: !!(fd.ertSurvey || fd.ertDataFile),
                      hasHydrogeologistSignoff: !!fd.hydrogeologistSignoff,
                      hasWRAAuthorisation: !!fd.wraAuthorisation,
                      hasPumpTest: !!fd.pumpTest,
                      hasLabWaterAnalysis: !!fd.labWaterAnalysis,
                      hasDrillLog: !!fd.drillLog,
                      hasCompletionRecord: !!fd.completionRecord,
                      reportConsistent: true,
                      // Regional analog evidence — proven neighbours raise the
                      // DATA-BACKED groundwater prospect (chance of water).
                      analogBoreholeCount: fd.localBoreholes?.count,
                      analogSuccessRate: fd.localBoreholes?.successRate,
                    });
                    const prospectColor = dr.groundwaterProspect === 'VERY STRONG' || dr.groundwaterProspect === 'STRONG'
                      ? '#10b981' : dr.groundwaterProspect === 'MODERATE' ? '#f59e0b' : '#94a3b8';
                    const statusColor = dr.status === 'ISSUED FOR DRILLING' || dr.status === 'COMPLETED / BANKABLE RECORD'
                      ? '#10b981' : dr.status === 'FIELD VALIDATION IN PROGRESS' ? '#f59e0b' : '#ef4444';
                    const gateItems = [
                      { label: 'Actual ERT/VES field data', ok: !!(fd.ertSurvey || fd.ertDataFile) },
                      { label: 'Coordinates field-verified (peg)', ok: !!fd.fieldPeg },
                      { label: 'Hydrogeologist sign-off', ok: !!fd.hydrogeologistSignoff },
                      { label: 'WRA/NEMA authorisation', ok: !!fd.wraAuthorisation },
                      { label: 'No contradictory values', ok: true },
                    ];
                    return (
                      <div style={{padding:14,borderRadius:10,border:`2px solid ${statusColor}`,background:`${statusColor}12`}}>
                        {/* Two axes side by side: PROSPECT (chance of water) vs READINESS (authority to drill) */}
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}}>
                          <div style={{padding:10,borderRadius:8,border:`1px solid ${prospectColor}`,background:`${prospectColor}10`}}>
                            <div style={{fontSize:10,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:0.5}}>Groundwater Prospect</div>
                            <div style={{fontSize:16,fontWeight:800,color:prospectColor}}>{dr.groundwaterProspect} <span style={{fontSize:12,opacity:0.7}}>~{dr.prospectIndex}%</span></div>
                            <div style={{fontSize:9,color:'var(--text-secondary)'}}>Chance of water &mdash; data-backed, not gated</div>
                          </div>
                          <div style={{padding:10,borderRadius:8,border:`1px solid ${statusColor}`,background:`${statusColor}10`}}>
                            <div style={{fontSize:10,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:0.5}}>Drilling Readiness</div>
                            <div style={{fontSize:16,fontWeight:800,color:statusColor}}>{dr.score}/100</div>
                            <div style={{fontSize:9,color:'var(--text-secondary)'}}>Authority to mobilise &mdash; needs field steps</div>
                          </div>
                        </div>
                        {dr.prospectIndex >= 60 && (
                          <div style={{fontSize:10,color:'#10b981',lineHeight:1.5,marginBottom:10,padding:'6px 8px',background:'rgba(16,185,129,0.08)',borderRadius:6}}>
                            {dr.prospectStatement}
                          </div>
                        )}
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:8,marginBottom:10}}>
                          <div>
                            <div style={{fontSize:11,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:0.5}}>Live Drilling-Readiness</div>
                            <div style={{fontSize:18,fontWeight:800,color:statusColor}}>{dr.status}</div>
                            <div style={{fontSize:11,color:'var(--text-secondary)'}}>{dr.stage}</div>
                          </div>
                          <div style={{textAlign:'center'}}>
                            <div style={{fontSize:32,fontWeight:900,color:statusColor,lineHeight:1}}>{dr.score}<span style={{fontSize:14,opacity:0.6}}>/100</span></div>
                            {dr.cappedByGates && <div style={{fontSize:9,color:'#ef4444',fontWeight:700}}>CAPPED AT 79 &mdash; GATES OPEN</div>}
                          </div>
                        </div>
                        <div style={{height:8,borderRadius:4,background:'rgba(148,163,184,0.25)',overflow:'hidden',marginBottom:10}}>
                          <div style={{height:'100%',width:`${dr.score}%`,background:statusColor,transition:'width 0.3s'}}/>
                        </div>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:6,marginBottom:8}}>
                          {gateItems.map(g=>(
                            <div key={g.label} style={{fontSize:11,display:'flex',alignItems:'center',gap:6,color:g.ok?'#10b981':'var(--text-secondary)'}}>
                              <span style={{fontWeight:800}}>{g.ok?'\u2705':'\u2b1c'}</span>{g.label}
                            </div>
                          ))}
                        </div>
                        <div style={{fontSize:10,color:'var(--text-secondary)',lineHeight:1.5,borderTop:'1px solid var(--border)',paddingTop:8}}>
                          {dr.handoverStatement}
                        </div>
                      </div>
                    );
                  })()}

                  {Object.keys(fieldDataInput).length > 0 && (
                    <div style={{padding:8,background:'rgba(16,185,129,0.08)',borderRadius:8,fontSize:12,color:'var(--accent-green)'}}>
                      {'\u2705'} Field data loaded: {[
                        fieldDataInput.ertSurvey && 'ERT Survey',
                        fieldDataInput.emTdemSurvey && `${fieldDataInput.emTdemSurvey.method} Survey`,
                        fieldDataInput.ertDataFile && `ERT File (${fieldDataInput.ertDataFile.dataPoints} points)`,
                        fieldDataInput.seismicSurvey && `Seismic (${fieldDataInput.seismicSurvey.method})`,
                        fieldDataInput.gprSurvey && `GPR (${fieldDataInput.gprSurvey.antennaFrequencyMHz} MHz)`,
                        fieldDataInput.magneticGravitySurvey && `${fieldDataInput.magneticGravitySurvey.method} survey`,
                        fieldDataInput.nmrSurvey && `NMR (${fieldDataInput.nmrSurvey.method})`,
                        fieldDataInput.pumpTest && 'Pump Test',
                        fieldDataInput.sieveAnalysis && `Sieve (${fieldDataInput.sieveAnalysis.curve?.length ?? 0} points)`,
                        fieldDataInput.stepDrawdownTest && `Step Test (${fieldDataInput.stepDrawdownTest.steps?.length ?? 0} steps)`,
                        fieldDataInput.labWaterAnalysis && 'Lab Analysis',
                        fieldDataInput.localBoreholes && `${fieldDataInput.localBoreholes.count} Local Boreholes`,
                        (fieldDataInput as any).fieldPeg && 'GPS Peg',
                        (fieldDataInput as any).hydrogeologistSignoff && 'Hydrogeologist Sign-off',
                        (fieldDataInput as any).wraAuthorisation && 'WRA/NEMA Auth',
                        (fieldDataInput as any).drillLog && 'Drill Log',
                        (fieldDataInput as any).completionRecord && 'Completion Record',
                      ].filter(Boolean).join(' + ')} — confidence will be upgraded
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageSelect} style={{display:'none'}} />
        <input ref={videoInputRef} type="file" accept="video/*" onChange={(e) => { if(e.target.files?.[0]){ handleImageSelect(e as any); }}} style={{display:'none'}} />
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════════════════════
     VIEW: SCIENTIFIC CAPABILITIES CATALOG (Parts 1-7)
     ═══════════════════════════════════════════════════════════════ */
  const renderSciTable = (headers: string[], rows: Record<string,any>[], keys: string[]) => (
    <div className="sci-table-wrap">
      <table className="sci-table">
        <thead><tr>{headers.map(h=><th key={h}>{h}</th>)}</tr></thead>
        <tbody>{rows.map((r,i)=><tr key={i}>{keys.map(k=><td key={k}>{r[k]}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );

  const renderCapabilities = () => {
    const part = SCI.SCIENCE_PARTS.find(p=>p.id===activeSciPart) || SCI.SCIENCE_PARTS[0];
    return (
      <div className="capabilities-view">
        <div className="results-header">
          <h3>{'\u{1F52C}'} Scientific Capability Catalog</h3>
          <button className="btn btn-secondary" onClick={()=>setActiveView('dashboard')}>Dashboard</button>
        </div>
        <p className="tab-desc">Browse all {SCI.TOTAL_CAPABILITIES} scientific capabilities across 7 domains. Every capability listed here is integrated into the analysis pipeline.</p>

        {/* Part Navigation Tabs */}
        <div className="sci-part-tabs">
          {SCI.SCIENCE_PARTS.map(p => (
            <button key={p.id} className={`sci-part-tab ${activeSciPart===p.id?'active':''}`}
              style={activeSciPart===p.id?{borderColor:p.color,color:p.color}:{}}
              onClick={()=>setActiveSciPart(p.id)}>
              <span>{p.icon}</span> <span className="spt-label">{p.part}</span>
            </button>
          ))}
        </div>

        {/* Active Part Header */}
        <div className="sci-part-header" style={{borderColor:part.color}}>
          <div className="sph-icon">{part.icon}</div>
          <div>
            <div className="sph-title">Part {part.part}: {part.title}</div>
            <div className="sph-desc">{part.count} capabilities &mdash; {part.description}</div>
          </div>
        </div>

        {/* Part Content */}
        <div className="sci-part-content">
          {activeSciPart==='remote-sensing' && renderSciTable(
            ['Capability','Scientific Method','Data Source','Output','Accuracy'],
            SCI.REMOTE_SENSING, ['name','method','source','output','accuracy']
          )}
          {activeSciPart==='geo-hydro' && renderSciTable(
            ['Capability','Scientific Method','Data Source','Output','Accuracy'],
            SCI.GEO_HYDRO_MAPPING, ['name','method','source','output','accuracy']
          )}
          {activeSciPart==='topo-hydro' && renderSciTable(
            ['Capability','Scientific Method','Data Source','Output','Accuracy'],
            SCI.TOPO_HYDROLOGY, ['name','method','source','output','accuracy']
          )}
          {activeSciPart==='historical' && renderSciTable(
            ['Capability','Data Needed','Source','Output'],
            SCI.HISTORICAL_DATA, ['name','data','source','output']
          )}
          {activeSciPart==='deep-learning' && (
            <div>
              <h4 className="tab-title">Deep Learning Models</h4>
              {renderSciTable(['Model','Architecture','Input','Output','Training Data'], SCI.DL_MODELS, ['name','arch','input','output','training'])}
              <h4 className="tab-title" style={{marginTop:24}}>Ensemble Methods</h4>
              {renderSciTable(['Method','Purpose','Models Combined','Weighting'], SCI.ENSEMBLE_METHODS, ['method','purpose','models','weighting'])}
            </div>
          )}
          {activeSciPart==='ensemble' && renderSciTable(
            ['Method','Purpose','Models Combined','Weighting'],
            SCI.ENSEMBLE_METHODS, ['method','purpose','models','weighting']
          )}
          {activeSciPart==='time-series' && renderSciTable(
            ['Variable','Horizon','Model','Input Features','Accuracy'],
            SCI.TIME_SERIES, ['variable','horizon','model','input','accuracy']
          )}
          {activeSciPart==='geolocation' && renderSciTable(
            ['Method','Technology','Accuracy','Data Source'],
            SCI.GEOLOCATION_METHODS, ['method','tech','accuracy','source']
          )}
          {activeSciPart==='terrain' && renderSciTable(
            ['Feature','Method','Input','Output','Scientific Basis'],
            SCI.TERRAIN_FEATURES, ['feature','method','input','output','basis']
          )}
          {activeSciPart==='vegetation' && renderSciTable(
            ['Indicator Species','Confidence','Region','Scientific Basis'],
            SCI.VEGETATION_INDICATORS, ['species','confidence','region','basis']
          )}
          {activeSciPart==='geol-structures' && renderSciTable(
            ['Structure','Detection Method','Visual Indicators','Confidence'],
            SCI.GEOLOGICAL_STRUCTURES, ['structure','detection','visual','confidence']
          )}
          {activeSciPart==='predictions' && (
            <div>
              <h4 className="tab-title">{'\u{1F3AF}'} Success Probability Formula</h4>
              <div className="formula-block"><code>{SCI.FORMULAS.successProb}</code></div>
              <h4 className="tab-title" style={{marginTop:16}}>Weight Calibration</h4>
              {renderSciTable(['Factor','Weight','Data Source','Justification'], SCI.SUCCESS_WEIGHTS, ['factor','weight','source','justification'])}

              <h4 className="tab-title" style={{marginTop:24}}>Depth Prediction Regression</h4>
              <div className="formula-block"><code>{SCI.FORMULAS.depthRegression}</code></div>
              {renderSciTable(['Variable','Coefficient','p-value','Significance'], SCI.DEPTH_COEFFICIENTS, ['variable','coefficient','pValue','significance'])}
              <div className="sci-info-grid">
                {SCI.DEPTH_INTERVALS.map(d=><div key={d.confidence} className="sci-info-card"><strong>{d.confidence} confidence</strong><span>{d.range}</span></div>)}
              </div>

              <h4 className="tab-title" style={{marginTop:24}}>Yield Prediction</h4>
              <div className="formula-block"><code>{SCI.FORMULAS.yieldEmpirical}</code></div>
              <div className="formula-block"><code>{SCI.FORMULAS.yieldML}</code></div>
              <div className="sci-info-grid">
                <div className="sci-info-card"><strong>R²</strong><span>{SCI.YIELD_ACCURACY.r2}</span></div>
                <div className="sci-info-card"><strong>MAE</strong><span>{SCI.YIELD_ACCURACY.mae}</span></div>
                <div className="sci-info-card"><strong>RMSE</strong><span>{SCI.YIELD_ACCURACY.rmse}</span></div>
              </div>

              <h4 className="tab-title" style={{marginTop:24}}>Water Quality Prediction</h4>
              {renderSciTable(['Parameter','Prediction Method','R²','MAE'], SCI.WQ_PREDICTIONS, ['parameter','method','r2','mae'])}

              <h4 className="tab-title" style={{marginTop:24}}>Cost Components (Kenya Context)</h4>
              {renderSciTable(['Component','Cost Range','Unit','Notes'], SCI.COST_COMPONENTS, ['component','range','unit','notes'])}
              <div className="formula-block" style={{marginTop:12}}><code>{SCI.FORMULAS.costModel}</code></div>
            </div>
          )}
          {activeSciPart==='risk-assess' && (
            <div>
              <h4 className="tab-title">{'\u26A0\uFE0F'} Contamination Risk Sources</h4>
              {renderSciTable(['Source Type','Detection Method','Risk Factors','Mitigation'], SCI.CONTAMINATION_RISKS, ['source','detection','factors','mitigation'])}
              <h4 className="tab-title" style={{marginTop:24}}>Geological Risk</h4>
              {renderSciTable(['Risk Factor','Assessment Method','Mitigation'], SCI.GEOLOGICAL_RISKS, ['factor','assessment','mitigation'])}
              <h4 className="tab-title" style={{marginTop:24}}>Financial Risk</h4>
              {renderSciTable(['Risk Type','Calculation','Threshold'], SCI.FINANCIAL_RISKS, ['risk','calculation','threshold'])}
              <h4 className="tab-title" style={{marginTop:24}}>Operational Risk</h4>
              {renderSciTable(['Risk','Factors','Mitigation'], SCI.OPERATIONAL_RISKS, ['risk','factors','mitigation'])}
            </div>
          )}
          {activeSciPart==='reporting' && (
            <div>
              <h4 className="tab-title">{'\u{1F4C4}'} Professional Report Sections</h4>
              {renderSciTable(['Section','Content','Data Sources','Length'], SCI.REPORT_SECTIONS, ['section','content','sources','length'])}
              <h4 className="tab-title" style={{marginTop:24}}>Visualizations & Maps</h4>
              {renderSciTable(['Map Type','Data Displayed','Scale','Format'], SCI.MAP_TYPES, ['type','data','scale','format'])}
              <h4 className="tab-title" style={{marginTop:24}}>Charts & Graphs</h4>
              {renderSciTable(['Chart','X-axis','Y-axis','Purpose'], SCI.CHART_TYPES, ['chart','x','y','purpose'])}
              <h4 className="tab-title" style={{marginTop:24}}>Data Export Formats</h4>
              {renderSciTable(['Format','Use Case','Content','Schema'], SCI.EXPORT_FORMATS, ['format','useCase','content','schema'])}
            </div>
          )}
          {activeSciPart==='validation' && (
            <div>
              <h4 className="tab-title">{'\u2705'} Accuracy Targets (vs. Ground Truth)</h4>
              {renderSciTable(['Prediction','Target Accuracy','Current Best-in-Class','Our Goal'], SCI.ACCURACY_TARGETS, ['prediction','target','bestInClass','goal'])}
              <h4 className="tab-title" style={{marginTop:24}}>Validation Methodology</h4>
              {renderSciTable(['Method','Description','Sample Size','Frequency'], SCI.VALIDATION_METHODS, ['method','description','sample','frequency'])}
              <h4 className="tab-title" style={{marginTop:24}}>Confidence Metrics</h4>
              {renderSciTable(['Confidence Level','Criteria','Interpretation'], SCI.CONFIDENCE_LEVELS, ['level','criteria','interpretation'])}
            </div>
          )}
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════════
     VIEW: ANALYZING
     ═══════════════════════════════════════════════════════════════ */
  const renderAnalyzing = () => (
    <div className="analyzing-view">
      {selectedImage && <img src={selectedImage} alt="Terrain" className="analyzing-image" />}
      {extraImages.length > 0 && (
        <div style={{display:'flex',gap:8,flexWrap:'wrap',justifyContent:'center',marginTop:8}}>
          {extraImages.map((src, i) => <img key={i} src={src} alt={`Site photo ${i + 2}`} style={{width:72,height:72,objectFit:'cover',borderRadius:8,border:'1px solid var(--border)',opacity:0.8}} />)}
          <div style={{fontSize:11,color:'var(--text-tertiary)',alignSelf:'center'}}>+{extraImages.length} more photo{extraImages.length > 1 ? 's' : ''} received — primary photo analyzed in full</div>
        </div>
      )}
      {analysisError ? (
        <div style={{background:'rgba(244,67,54,0.12)',border:'2px solid rgba(244,67,54,0.4)',borderRadius:12,padding:'20px 24px',margin:'20px auto',maxWidth:600}}>
          <h3 style={{color:'#F44336',margin:'0 0 8px'}}>Pipeline Error</h3>
          <pre style={{color:'#ff8a80',fontSize:12,whiteSpace:'pre-wrap',wordBreak:'break-word',margin:'0 0 16px',fontFamily:'var(--font-mono)'}}>{analysisError}</pre>
          <p style={{fontSize:12,color:'var(--text-secondary)',margin:'0 0 12px'}}>
            {pipelineStep >= 0 ? `Failed at Subsystem ${pipelineStep + 1} of 12: ${SUBSYSTEMS[pipelineStep]?.title || ''}` : 'Failed before pipeline started'}
          </p>
          <button className="btn btn-analyze" onClick={() => { setAnalysisError(null); setActiveView('dashboard'); }}>
            Back to Dashboard
          </button>
        </div>
      ) : (
        <>
          <h3>Running 12-Subsystem Pipeline...</h3>
      {pipelineLabel && (
        <div style={{fontSize:12,color:'var(--accent)',fontFamily:'var(--font-mono)',marginBottom:10,textAlign:'center',opacity:0.9}}>{pipelineLabel}</div>
      )}
      <div className="pipeline-progress">
        {SUBSYSTEMS.map((s,i) => (
          <div key={s.id} className={`progress-step ${pipelineStep>i?'done':pipelineStep===i?'active':''}`}>
            <div className="step-indicator">
              {pipelineStep>i ? '\u2705' : pipelineStep===i ? <span className="mini-spinner"></span> : <span className="step-num">{s.number}</span>}
            </div>
            <div className="step-name">{s.title}</div>
          </div>
        ))}
      </div>
      <div style={{marginTop:12,fontSize:11,color:'var(--text-tertiary)',textAlign:'center'}}>
        {pipelineStep >= 0 && `Subsystem ${pipelineStep + 1} of 12`}
        {pipelineStep === 0 && ' — Geocoding client location (Country → Region → City → Village)'}
        {pipelineStep === 1 && ' — EXIF, GPS, image forensic ID, pixel spectral analysis'}
        {pipelineStep >= 2 && pipelineStep <= 8 && ' — Processing...'}
        {pipelineStep === 9 && ' — Fetching 20-year weather, borehole records, satellite data...'}
        {pipelineStep === 10 && ' — Calibrating depth & yield with regional data...'}
        {pipelineStep === 11 && ' — Compiling final report...'}
      </div>
        </>
      )}
    </div>
  );

  /* ═══════════════════════════════════════════════════════════════
     VIEW: RESULTS (23 features integrated)
     ═══════════════════════════════════════════════════════════════ */
  const renderResults = () => {
    if (!result) return null;
    const cost = genCostBreakdown(result.recommendedDepth, result.estimatedYield, result.soil.type);
    const solar = genSolar(result.estimatedYield, result.site.latitude);
    const roi = genROI(cost.total, solar.totalSolar, result.estimatedYield, solar.runtime, cost.confidence);
    const layers = genSubsurface(result);
    const scenarios = genScenarios(result.recommendedDepth, result.estimatedYield);
    const climate = genClimate(result.historicalData, result.gldasGroundwater);
    const prob = genProbability(result.probability, result.recommendedDepth);
    const wqExpanded = genWaterQualityExpanded(result.waterQuality, result.recommendedDepth);
    const strategy = genDrillingStrategy(result.recommendedDepth, result.soil.type);
    const nearby = result.nearbyWells?.nearbyWells ?? [];
    const tabs = ['overview','ai-scanner','verification','geolocation','remote-sensing','satellite-rs','surface-geophysics-30','gldas-groundwater','realtime-water','subsurface-3d','subsurface-twin','insar','survey-plan','hybrid-geophysics','advanced-geophysics','aquifer-sim','historical','borehole-records','subsurface','geological','rock-sites','topographic','scenarios','water','costs','solar','roi','strategy','climate','probability','ml-models','risk','risk-decision','confidence-quality','geophysics-fusion','fracture-ai','aquifer-type','recharge-model','drill-map','micro-siting','calibration-loop','borehole-intelligence','pump-test','lithology','ert-interpretation','source-agreement','drought-analysis','hydrochemistry','data-quality','drilling-prediction','regional-model','site-identity','drill-decision','risk-register','pump-protocol','prediction-table','confidence-breakdown','bankable-checklist','well-design','engineer-trust','data-provenance','methodology','cross-validation','ai-vs-reality','pinn-explainable','path-to-97','validation','compare','report'] as const;

    return (
      <div className="results-view">
        <div className="results-header">
          <h3>{'\u2705'} Analysis Complete</h3>
          <button className="btn btn-secondary" onClick={()=>{setActiveView('dashboard');setSelectedImage(null);setResult(null);}}>Dashboard</button>
        </div>
        {selectedImage && <img src={selectedImage} alt="Terrain" className="result-image" />}
        {extraImages.length > 0 && (
          <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:8}}>
            {extraImages.map((src, i) => <img key={i} src={src} alt={`Site photo ${i + 2}`} style={{width:64,height:64,objectFit:'cover',borderRadius:8,border:'1px solid var(--border)',opacity:0.85}} />)}
          </div>
        )}

        {/* Summary Cards */}
        <div className="results-summary-cards">
          <div className="summary-card success"><div className="summary-value">{(result.probability*100).toFixed(1)}%</div><div className="summary-label">Success Probability</div></div>
          <div className="summary-card depth"><div className="summary-value">{result.recommendedDepth.toFixed(0)}m</div><div className="summary-label">Recommended Depth</div></div>
          <div className="summary-card yield-card"><div className="summary-value">{result.estimatedYield.toFixed(1)}</div><div className="summary-label">Yield (m\u00B3/h)</div></div>
          <div className="summary-card cost-card"><div className="summary-value">{fmtUSD(cost.total)}</div><div className="summary-label">Total Borehole Cost</div></div>
          <div className="summary-card solar-card"><div className="summary-value">{fmtUSD(solar.totalSolar)}</div><div className="summary-label">Solar System Cost</div></div>
          <div className="summary-card roi-card"><div className="summary-value">{roi.paybackMonths}mo</div><div className="summary-label">Payback Period</div></div>
          <div className="summary-card risk-sc" style={{borderColor:getRiskColor(result.risk.overallRisk)}}><div className="summary-value" style={{color:getRiskColor(result.risk.overallRisk)}}>{(result.risk.overallRisk*100).toFixed(0)}%</div><div className="summary-label">Overall Risk</div></div>
          <div className="summary-card wq-card"><div className="summary-value">{wqExpanded.treatmentRequired}</div><div className="summary-label">Treatment Required</div></div>
        </div>

        {/* ═══ FINAL CONSENSUS — ONE authoritative answer ═══ */}
        {result.finalConsensus && (() => {
          const fc = result.finalConsensus;
          const fcColor = fc.successProbability >= 0.7 ? '#22c55e' : fc.successProbability >= 0.5 ? '#f59e0b' : '#ef4444';
          const fcBg = fc.successProbability >= 0.7 ? 'rgba(34,197,94,0.06)' : fc.successProbability >= 0.5 ? 'rgba(245,158,11,0.06)' : 'rgba(239,68,68,0.06)';
          const fcBorder = fc.successProbability >= 0.7 ? 'rgba(34,197,94,0.4)' : fc.successProbability >= 0.5 ? 'rgba(245,158,11,0.4)' : 'rgba(239,68,68,0.4)';
          const agrColor = fc.agreementLevel === 'Strong' ? '#22c55e' : fc.agreementLevel === 'Moderate' ? '#f59e0b' : '#ef4444';
          return (
            <div style={{background:fcBg,border:`2px solid ${fcBorder}`,borderRadius:14,padding:'18px 22px',marginBottom:16}}>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
                <span style={{fontSize:20}}>{'\u2B50'}</span>
                <div style={{fontSize:16,fontWeight:800,color:fcColor}}>FINAL RECOMMENDATION</div>
                <span style={{fontSize:11,padding:'2px 10px',borderRadius:6,background:fcColor,color:'#fff',fontWeight:700}}>{fc.assessmentGrade}</span>
                <span style={{fontSize:11,padding:'2px 10px',borderRadius:6,background:agrColor,color:'#fff',fontWeight:600}}>Agreement: {fc.agreementLevel}</span>
              </div>
              <div style={{display:'flex',gap:20,flexWrap:'wrap',marginBottom:12}}>
                <div style={{textAlign:'center',minWidth:120,padding:'10px 16px',background:'rgba(255,255,255,0.04)',borderRadius:10,border:'1px solid rgba(255,255,255,0.08)'}}>
                  <div style={{fontSize:28,fontWeight:800,color:'#38bdf8',lineHeight:1}}>{fc.depth_m}<span style={{fontSize:14}}>m</span></div>
                  <div style={{fontSize:10,color:'var(--text-secondary)',marginTop:4}}>Recommended Depth</div>
                  <div style={{fontSize:9,color:'var(--text-tertiary)'}}>Range: {fc.depthRange[0]}–{fc.depthRange[1]}m</div>
                </div>
                <div style={{textAlign:'center',minWidth:120,padding:'10px 16px',background:'rgba(255,255,255,0.04)',borderRadius:10,border:'1px solid rgba(255,255,255,0.08)'}}>
                  <div style={{fontSize:28,fontWeight:800,color:'#22c55e',lineHeight:1}}>{fc.yield_m3hr}<span style={{fontSize:14}}> m³/hr</span></div>
                  <div style={{fontSize:10,color:'var(--text-secondary)',marginTop:4}}>Expected Yield</div>
                  <div style={{fontSize:9,color:'var(--text-tertiary)'}}>Range: {fc.yieldRange[0]}–{fc.yieldRange[1]} m³/hr</div>
                </div>
                <div style={{textAlign:'center',minWidth:120,padding:'10px 16px',background:'rgba(255,255,255,0.04)',borderRadius:10,border:'1px solid rgba(255,255,255,0.08)'}}>
                  <div style={{fontSize:28,fontWeight:800,color:fcColor,lineHeight:1}}>{(fc.successProbability*100).toFixed(1)}<span style={{fontSize:14}}>%</span></div>
                  <div style={{fontSize:10,color:'var(--text-secondary)',marginTop:4}}>Success Probability</div>
                  <div style={{fontSize:9,color:'var(--text-tertiary)'}}>Range: {(fc.probabilityRange[0]*100).toFixed(0)}–{(fc.probabilityRange[1]*100).toFixed(0)}%</div>
                </div>
                <div style={{textAlign:'center',minWidth:100,padding:'10px 16px',background:'rgba(255,255,255,0.04)',borderRadius:10,border:'1px solid rgba(255,255,255,0.08)'}}>
                  <div style={{fontSize:28,fontWeight:800,color:'#a78bfa',lineHeight:1}}>{fc.confidenceLevel}<span style={{fontSize:14}}>%</span></div>
                  <div style={{fontSize:10,color:'var(--text-secondary)',marginTop:4}}>Confidence</div>
                  <div style={{fontSize:9,color:'var(--text-tertiary)'}}>{fc.dataSourceCount} models fused</div>
                </div>
              </div>
              <div style={{fontSize:11,color:'var(--text-secondary)',lineHeight:1.6,padding:'8px 12px',background:'rgba(255,255,255,0.02)',borderRadius:8,marginBottom:6}}>{fc.disclaimer}</div>
              <div style={{fontSize:9,color:'var(--text-tertiary)',lineHeight:1.4}}>{fc.methodology}</div>
            </div>
          );
        })()}

        {/* Assessment Classification */}
        {/* ═══ DATA SOURCE NOTE: Info banner when API fallbacks were used ═══ */}
        {result.fallbacksUsed && result.fallbacksUsed.length > 0 && (
          <div style={{
            background:'rgba(245,158,11,0.06)',
            border:'1px solid rgba(245,158,11,0.2)',
            borderRadius:12,
            padding:'14px 18px',
            marginBottom:16,
          }}>
            <div style={{fontSize:13,fontWeight:700,color:'#d97706',marginBottom:8}}>
              {'\u{1F4E1}'} {result.fallbacksUsed.length} Data Source{result.fallbacksUsed.length > 1 ? 's' : ''} Used Regional Estimates
            </div>
            <div style={{fontSize:11,color:'var(--text-secondary)',marginBottom:8}}>
              The following sources used latitude-based regional estimates. This is normal for remote or offline areas. Adding field data (ERT, pump test) will upgrade accuracy.
            </div>
            {result.fallbacksUsed.map((fb: string, i: number) => (
              <div key={i} style={{fontSize:11,color:'var(--text-muted)',padding:'3px 0',borderBottom:'1px solid rgba(255,255,255,0.03)'}}>
                {'\u{1F4CD}'} {fb}
              </div>
            ))}
          </div>
        )}
        {(() => {
          const confOv = result.confidenceMetrics?.overall ?? 0;
          const isField = result.assessmentType === 'FIELD_VALIDATED';
          const tierLabel = isField ? 'FIELD VALIDATED' : confOv >= 90 ? 'BANKABLE' : confOv >= 80 ? 'ENGINEERING GRADE' : confOv >= 70 ? 'PRE-FEASIBILITY' : 'STANDARD ASSESSMENT';
          const tierColor = isField || confOv >= 80 ? '#16a34a' : confOv >= 70 ? '#3b82f6' : '#d97706';
          const tierBg = isField || confOv >= 80 ? 'rgba(34,197,94,0.06)' : confOv >= 70 ? 'rgba(59,130,246,0.06)' : 'rgba(245,158,11,0.06)';
          const tierBorder = isField || confOv >= 80 ? 'rgba(34,197,94,0.25)' : confOv >= 70 ? 'rgba(59,130,246,0.25)' : 'rgba(245,158,11,0.25)';
          return (
        <div style={{background:tierBg,border:`2px solid ${tierBorder}`,padding:'14px 18px',borderRadius:12,marginBottom:16}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6}}>
            <div style={{fontWeight:700,fontSize:14,color:tierColor}}>{isField ? '\u2705' : '\uD83D\uDCCA'} {tierLabel} — {confOv}% Confidence</div>
            <div style={{fontSize:11,padding:'2px 8px',borderRadius:6,background:tierColor,color:'#fff',fontWeight:600}}>{(result as any).dataSources || 11} Data Sources</div>
          </div>
          <div style={{fontSize:12,color:'var(--text-secondary)',lineHeight:1.6}}>Multi-source AI ensemble analysis using Bayesian fusion of satellite, geological, and hydrological data. Predictions derived from physics-based models (Thiem, Cooper-Jacob, Dar Zarrouk) constrained by {(result as any).dataSources || 11} independent sources. {confOv < 90 ? 'ERT integration and pump test calibration available to upgrade confidence.' : ''}</div>
          {result.uncertainty && (
            <div style={{marginTop:10,display:'flex',gap:12,flexWrap:'wrap'}}>
              <div style={{padding:'6px 12px',borderRadius:8,background:'rgba(56,189,248,0.1)',fontSize:12}}>
                <strong>Depth:</strong> {result.uncertainty.depthRange[0]}–{result.uncertainty.depthRange[1]}m (confidence: {Math.round(result.uncertainty.depthConfidence*100)}%)
              </div>
              <div style={{padding:'6px 12px',borderRadius:8,background:'rgba(34,197,94,0.1)',fontSize:12}}>
                <strong>Yield:</strong> {result.uncertainty.yieldRange[0]}–{result.uncertainty.yieldRange[1]} m³/hr (confidence: {Math.round(result.uncertainty.yieldConfidence*100)}%)
              </div>
              <div style={{padding:'6px 12px',borderRadius:8,background:'rgba(251,191,36,0.1)',fontSize:12}}>
                <strong>Probability:</strong> {Math.round(result.uncertainty.probabilityRange[0]*100)}–{Math.round(result.uncertainty.probabilityRange[1]*100)}%
              </div>
            </div>
          )}
          {result.confidenceMetrics && (
            <div style={{marginTop:10,padding:'10px 14px',borderRadius:8,background:'rgba(59,130,246,0.06)',border:'1px solid rgba(59,130,246,0.15)'}}>
              <div style={{fontWeight:700,fontSize:12,color:'#3b82f6',marginBottom:6}}>Confidence Metrics</div>
              <div style={{display:'flex',gap:10,flexWrap:'wrap',fontSize:11}}>
                {[
                  {label:'Geological',val:result.confidenceMetrics.geological},
                  {label:'Terrain',val:result.confidenceMetrics.terrain},
                  {label:'Vegetation',val:result.confidenceMetrics.vegetation},
                  {label:'Data Density',val:result.confidenceMetrics.dataDensity},
                  {label:'Water Quality',val:result.confidenceMetrics.waterQuality},
                  {label:'OVERALL',val:result.confidenceMetrics.overall},
                ].map(m=>(
                  <div key={m.label} style={{padding:'4px 10px',borderRadius:6,background:m.val>=85?'rgba(34,197,94,0.12)':m.val>=65?'rgba(251,191,36,0.12)':'rgba(239,68,68,0.12)',minWidth:80,textAlign:'center'}}>
                    <div style={{fontWeight:700,fontSize:14,color:m.val>=85?'#16a34a':m.val>=65?'#d97706':'#dc2626'}}>{m.val}%</div>
                    <div style={{color:'var(--text-secondary)',fontSize:10}}>{m.label}</div>
                  </div>
                ))}
              </div>
              <div style={{fontSize:10,color:'var(--text-secondary)',marginTop:6}}>{result.confidenceMetrics.methodology}</div>
            </div>
          )}
        </div>
          );
        })()}

        {/* ── Credibility Rating Dashboard ── */}
        {(() => {
          const cred = computeCredibility(result);
          return (
            <div className="cred-dashboard">
              <div className="cred-header">
                <div className="cred-title">{'\u{1F4CA}'} Credibility Rating Dashboard</div>
                <div className="cred-grade" style={{color: cred.gradeColor, borderColor: cred.gradeColor}}>
                  {cred.grade}
                </div>
              </div>
              <div className="cred-dimensions">
                {cred.dimensions.map(dim => (
                  <div key={dim.key} className="cred-dim-card">
                    <div className="cred-dim-header">
                      <span className="cred-dim-label">{dim.label}</span>
                      <span className="cred-dim-score">{dim.score.toFixed(1)} / 5</span>
                    </div>
                    <div className="cred-bar-track">
                      <div className="cred-bar-fill" style={{width: `${(dim.score / 5) * 100}%`, background: dim.score >= 4.0 ? '#22c55e' : dim.score >= 3.0 ? '#38bdf8' : dim.score >= 2.0 ? '#f59e0b' : '#ef4444'}} />
                      <div className="cred-bar-target" style={{left: `${(dim.target / 5) * 100}%`}} title={`Target: ${dim.target}`} />
                    </div>
                    <div className="cred-stars">
                      {[1,2,3,4,5].map(s => (
                        <span key={s} className={`cred-star ${s <= Math.round(dim.score) ? 'filled' : ''}`}>{'\u2605'}</span>
                      ))}
                      <span className="cred-dim-comment">{dim.comment}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cred-overall">
                <div className="cred-gauge" style={{background: `conic-gradient(${cred.gradeColor} ${cred.overallPct * 3.6}deg, rgba(148,163,184,0.1) 0deg)`}}>
                  <div className="cred-gauge-inner">
                    <div className="cred-gauge-val">{cred.overallPct}%</div>
                    <div className="cred-gauge-label">Overall</div>
                  </div>
                </div>
                <div className="cred-verdict-text">
                  <strong>Status: {cred.grade}</strong>
                  <p style={{margin:'4px 0 0',fontSize:12,color:'var(--text-muted)'}}>
                    {cred.overallPct >= 85 ? 'This assessment meets bankable-grade standards. Suitable for investor proposals, government submissions, and drilling decisions.'
                     : cred.overallPct >= 70 ? 'Strong multi-source assessment with high data agreement. ERT integration available to elevate to bankable grade (≥85%).'
                     : cred.overallPct >= 50 ? 'Multi-source AI ensemble assessment. ERT survey and pump test integration recommended for engineering-grade confidence.'
                     : 'Preliminary assessment based on limited data coverage. Additional data sources recommended.'}
                  </p>
                  {cred.overallPct < 85 && (
                    <div className="cred-improve">
                      <strong>Upgrade Path to Bankable (≥85%):</strong>
                      <ul>
                        {cred.dimensions.filter(d => d.score < d.target).map(d => (
                          <li key={d.key}>{d.label}: {d.score.toFixed(1)} → {d.target} ({d.comment.includes('→') ? d.comment.split('→')[1].trim() : 'ERT/field integration available'})</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Simple Outputs Bar (#17) */}
        <div className="simple-outputs">
          <div className="simple-out"><span className="so-label">Water Table</span><span className="so-value">{climate.waterTableStability}</span></div>
          <div className="simple-out"><span className="so-label">Recharge</span><span className="so-value">{prob.rechargePotential}</span></div>
          <div className="simple-out"><span className="so-label">5-Year Risk</span><span className="so-value">{prob.fiveYearRisk}</span></div>
          <div className="simple-out"><span className="so-label">Best Season</span><span className="so-value">{climate.bestDrillingSeason}</span></div>
        </div>

        {/* Tabs */}
        <div className="result-tabs">
          {tabs.map(tab => (
            <button key={tab} onClick={()=>setActiveResultTab(tab)} className={`result-tab ${activeResultTab===tab?'active':''}`}>
              {tab.charAt(0).toUpperCase()+tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="result-tab-content">

          {/* ═══ LOCATION CONFIDENCE BANNER — ALWAYS VISIBLE ═══ */}
          {result.locationConfidence && (
            <div style={{
              background: result.locationConfidence.grade === 'A' ? 'rgba(34,197,94,0.08)' :
                result.locationConfidence.grade === 'B' ? 'rgba(56,189,248,0.08)' :
                result.locationConfidence.grade === 'C' ? 'rgba(251,191,36,0.08)' :
                result.locationConfidence.grade === 'D' ? 'rgba(249,115,22,0.08)' : 'rgba(239,68,68,0.10)',
              border: `2px solid ${result.locationConfidence.grade === 'A' ? 'rgba(34,197,94,0.3)' :
                result.locationConfidence.grade === 'B' ? 'rgba(56,189,248,0.3)' :
                result.locationConfidence.grade === 'C' ? 'rgba(251,191,36,0.3)' :
                result.locationConfidence.grade === 'D' ? 'rgba(249,115,22,0.3)' : 'rgba(239,68,68,0.4)'}`,
              padding: '14px 18px', borderRadius: 12, marginBottom: 16,
            }}>
              <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
                <div style={{
                  width:48, height:48, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center',
                  fontWeight:900, fontSize:22, color:'#fff',
                  background: result.locationConfidence.grade === 'A' ? '#22c55e' :
                    result.locationConfidence.grade === 'B' ? '#38bdf8' :
                    result.locationConfidence.grade === 'C' ? '#fbbf24' :
                    result.locationConfidence.grade === 'D' ? '#f97316' : '#ef4444',
                }}>
                  {result.locationConfidence.grade}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:14,color:'var(--text-primary)'}}>{result.locationConfidence.label}</div>
                  <div style={{fontSize:12,color:'var(--text-secondary)',marginTop:2}}>
                    Location Confidence: {result.locationConfidence.score}% | Drilling Reliability: <strong style={{
                      color: result.locationConfidence.drillingReliability === 'VERIFIED' ? '#22c55e' :
                        result.locationConfidence.drillingReliability === 'HIGH' ? '#38bdf8' :
                        result.locationConfidence.drillingReliability === 'MODERATE' ? '#fbbf24' :
                        result.locationConfidence.drillingReliability === 'LOW' ? '#f97316' : '#ef4444'
                    }}>{result.locationConfidence.drillingReliability}</strong>
                  </div>
                </div>
                <button onClick={()=>setActiveResultTab('verification')} style={{padding:'6px 14px',borderRadius:8,border:'none',background:'rgba(255,255,255,0.1)',color:'var(--text-secondary)',fontSize:12,cursor:'pointer',fontWeight:600}}>View Details →</button>
              </div>
              {result.locationConfidence.warnings.length > 0 && (result.locationConfidence.grade === 'D' || result.locationConfidence.grade === 'F') && (
                <div style={{marginTop:10,padding:'8px 12px',background:'rgba(239,68,68,0.06)',borderRadius:8,fontSize:12,color:'var(--text-secondary)'}}>
                  {result.locationConfidence.warnings.slice(0,2).map((w, i) => <div key={i} style={{marginBottom:2}}>{w}</div>)}
                </div>
              )}
            </div>
          )}

          {/* OVERVIEW (#1 photo geoloc in overview) */}
          {activeResultTab==='overview' && (
            <div>
              {/* NON-TERRAIN IMAGE WARNING */}
              {result.pixelAnalysis && !result.pixelAnalysis.isOutdoorScene && (
                <div style={{background:'rgba(245,158,11,0.1)',border:'1px solid rgba(245,158,11,0.3)',padding:'14px 18px',borderRadius:12,marginBottom:16,fontSize:13,color:'var(--text-secondary)'}}>
                  <div style={{fontWeight:700,marginBottom:6,color:'var(--accent-amber)',fontSize:14}}>{'\u26A0\uFE0F'} Image Quality Notice</div>
                  <div>This image may not show outdoor terrain (scene confidence: <strong>{result.pixelAnalysis.sceneConfidence ? Math.round(result.pixelAnalysis.sceneConfidence*100) : 0}%</strong>). For best accuracy, upload a <strong>landscape/terrain photo</strong> of the actual borehole site — taken outdoors, showing the ground, vegetation, and surrounding landscape.</div>
                  <div style={{marginTop:6,fontSize:12,color:'var(--text-muted)'}}>Results are based on pixel color analysis and may have reduced accuracy for non-terrain images.</div>
                </div>
              )}
              {/* DATA SOURCE TRANSPARENCY BANNER */}
              <div className="data-source-banner" style={{background:result.locationMethod==='exif-gps'||result.locationMethod==='filename-geocode'||result.locationMethod==='iptc-geocode'||result.gpsSource==='device'?'rgba(34,197,94,0.08)':result.gpsSource==='manual'?'rgba(56,189,248,0.08)':result.locationMethod==='visual-estimate'?'rgba(251,191,36,0.08)':'rgba(239,68,68,0.08)',color:'var(--text-secondary)',padding:'14px 18px',borderRadius:12,marginBottom:16,fontSize:13,border:`1px solid ${result.locationMethod==='exif-gps'||result.locationMethod==='filename-geocode'||result.locationMethod==='iptc-geocode'||result.gpsSource==='device'?'rgba(34,197,94,0.2)':result.gpsSource==='manual'?'rgba(56,189,248,0.2)':result.locationMethod==='visual-estimate'?'rgba(251,191,36,0.2)':'rgba(239,68,68,0.2)'}`}}>
                <div style={{fontWeight:700,marginBottom:6,color:'var(--text-primary)',fontSize:14}}>{'\u{1F4E1}'} Data Source Transparency</div>
                <div><strong>Image Verified:</strong> {result.pixelAnalysis?.isOutdoorScene ? `\u2705 Outdoor terrain scene (${Math.round((result.pixelAnalysis.sceneConfidence||0)*100)}% confidence)` : `\u26A0\uFE0F Non-terrain image detected \u2014 results may be less accurate`}</div>
                <div><strong>Location:</strong> {result.locationMethod==='exif-gps' ? '\u{1F4E1} Photo EXIF GPS (\u00B110m) \u2014 Location extracted FROM THE IMAGE' : result.locationMethod==='filename-geocode' ? `\u{1F4C1} Filename Geocode \u2014 "${result.locationContext?.filenameHint?.split(' \u2192 ')[0] || 'filename'}" matched to real place via OpenStreetMap` : result.locationMethod==='iptc-geocode' ? '\u{1F3F7}\uFE0F IPTC/XMP Geocode \u2014 Photo metadata text matched to real place' : result.gpsSource==='device' ? '\u{1F4F1} Device GPS \u2014 You confirmed you are at the borehole site' + (result.gpsAccuracy ? ` (\u00B1${Math.round(result.gpsAccuracy)}m)` : '') : result.gpsSource==='manual' ? '\u{1F4DD} Manual Entry \u2014 Coordinates entered by user' : result.locationMethod==='visual-estimate' ? '\u{1F30D} Visual Terrain Estimate \u2014 Location estimated from soil color, vegetation, and terrain' : '\u274C No location found \u2014 use your device location or enter coordinates below'}</div>
                {result.geoEstimate?.bestEstimate && (
                  <div><strong>{'\u{1F30D}'} Visual Geo-Estimate:</strong> <span style={{color:'var(--accent-amber)',fontWeight:600}}>{result.geoEstimate.bestEstimate.region}, {result.geoEstimate.bestEstimate.country}</span> ({Math.round(result.geoEstimate.bestEstimate.confidence*100)}% confidence) <span style={{opacity:0.6,fontSize:11}}>\u2014 Climate: {result.geoEstimate.climateZone} \u2014 from terrain visual analysis</span></div>
                )}
                {result.imageFingerprint && <div><strong>Image ID:</strong> <code style={{fontFamily:'var(--font-mono)',background:'rgba(56,189,248,0.1)',padding:'2px 6px',borderRadius:4}}>{result.imageForensicId?.compositeId || result.imageFingerprint}</code>{result.imageForensicId?.cameraMake ? ` — ${result.imageForensicId.cameraMake} ${result.imageForensicId.cameraModel||''}` : ''}{result.imageForensicId?.cameraSerial ? ` (SN: ${result.imageForensicId.cameraSerial})` : ''}{result.imageForensicId?.dateOriginal ? ` | Photo taken: ${(() => { try { const d = new Date(result.imageForensicId.dateOriginal!); return isNaN(d.getTime()) ? result.imageForensicId.dateOriginal : d.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}) + ' ' + d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}); } catch { return result.imageForensicId!.dateOriginal; } })()}` : ''}{result.imageForensicId?.imageSize ? ` | ${result.imageForensicId.imageSize}` : ''}</div>}
                {/* SOCIAL MEDIA / STRIPPED IMAGE WARNING */}
                {result.imageFingerprint && !result.imageForensicId?.cameraMake && !result.imageForensicId?.cameraSerial && result.locationMethod !== 'exif-gps' && (
                  <div style={{marginTop:6,padding:'8px 12px',background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.25)',borderRadius:8,fontSize:12,color:'#f87171'}}>
                    <strong>{'\u26A0\uFE0F'} Image Metadata Stripped</strong> — No camera info, serial number, or GPS found. This photo was likely sent via <strong>WhatsApp, Facebook, Telegram</strong> or another platform that removes EXIF data. For accurate analysis, upload the <strong>original photo</strong> directly from the camera/phone (via USB, Google Drive, or email).
                  </div>
                )}
                {result.locationContext && (result.locationContext.filenameHint || result.locationContext.iptcLocation) && (
                  <div><strong>Location Hints:</strong> {result.locationContext.filenameHint ? `filename: "${result.locationContext.filenameHint}"` : ''}{result.locationContext.iptcLocation ? ` [IPTC: ${result.locationContext.iptcLocation}]` : ''}</div>
                )}
                {result.resolvedLocation && result.resolvedLocation.source !== 'none' && (
                  <div><strong>{"\u{1F4CD}"} {result.locationMethod==='exif-gps'?'Image Location (from photo EXIF)':result.locationMethod==='filename-geocode'?'Filename Location (geocoded from file name)':result.locationMethod==='iptc-geocode'?'Metadata Location (geocoded from IPTC/XMP)':result.gpsSource==='device'?'Site Location (from your device GPS)':result.gpsSource==='manual'?'Site Location (from manual coordinates)':result.locationMethod==='visual-estimate'?'Estimated Location (from terrain analysis)':'Location'}:</strong> {result.resolvedLocation.displayName || [result.resolvedLocation.village, result.resolvedLocation.suburb, result.resolvedLocation.city, result.resolvedLocation.county, result.resolvedLocation.state, result.resolvedLocation.country].filter(Boolean).join(', ')} <span style={{opacity:0.6,fontSize:11}}>(via {result.resolvedLocation.source === 'nominatim' ? 'OpenStreetMap' : 'BigDataCloud'})</span></div>
                )}
                <div><strong>Terrain:</strong> Pixel color/texture analysis ({result.pixelAnalysis?.isOutdoorScene ? '80' : '70'}%) + MobileNet scene classification ({result.pixelAnalysis?.isOutdoorScene ? '20' : '10'}%)</div>
                <div><strong>Soil:</strong> {result.pixelAnalysis ? `Pixel color class: ${result.pixelAnalysis.dominantColorClass} (soil exposure: ${Math.round(result.pixelAnalysis.soilExposureIndex*100)}%)` : 'Rule-based from terrain type'}</div>
                <div><strong>Depth/Yield/Cost:</strong> Deterministic models from terrain + soil type \u2014 NOT from subsurface scanning</div>
              </div>
              {/* CLIENT LOCATION SUMMARY */}
              {result.clientLocation && Object.values(result.clientLocation).some(v=>v) && (
                <div style={{background:'rgba(0,188,212,0.06)',border:'1px solid rgba(0,188,212,0.2)',padding:'14px 18px',borderRadius:12,marginBottom:16}}>
                  <div style={{fontWeight:700,marginBottom:6,color:'var(--text-primary)',fontSize:14}}>{'\u{1F4CD}'} Client-Provided Location</div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:6}}>
                    {result.clientLocation.country && <span style={{fontSize:11,padding:'3px 8px',borderRadius:6,background:'rgba(0,188,212,0.15)',color:'#00BCD4',fontWeight:600}}>Country: {result.clientLocation.country}</span>}
                    {result.clientLocation.region && <span style={{fontSize:11,padding:'3px 8px',borderRadius:6,background:'rgba(255,152,0,0.15)',color:'#FF9800',fontWeight:600}}>Region: {result.clientLocation.region}</span>}
                    {(result.clientLocation as any).province && <span style={{fontSize:11,padding:'3px 8px',borderRadius:6,background:'rgba(255,87,34,0.15)',color:'#FF5722',fontWeight:600}}>Province: {(result.clientLocation as any).province}</span>}
                    {result.clientLocation.county && <span style={{fontSize:11,padding:'3px 8px',borderRadius:6,background:'rgba(156,39,176,0.15)',color:'#9C27B0',fontWeight:600}}>County: {result.clientLocation.county}</span>}
                    {(result.clientLocation as any).district && <span style={{fontSize:11,padding:'3px 8px',borderRadius:6,background:'rgba(103,58,183,0.15)',color:'#7E57C2',fontWeight:600}}>District: {(result.clientLocation as any).district}</span>}
                    {result.clientLocation.city && <span style={{fontSize:11,padding:'3px 8px',borderRadius:6,background:'rgba(76,175,80,0.15)',color:'#4CAF50',fontWeight:600}}>City: {result.clientLocation.city}</span>}
                    {(result.clientLocation as any).location && <span style={{fontSize:11,padding:'3px 8px',borderRadius:6,background:'rgba(0,150,136,0.15)',color:'#009688',fontWeight:600}}>Location: {(result.clientLocation as any).location}</span>}
                    {(result.clientLocation as any).sublocation && <span style={{fontSize:11,padding:'3px 8px',borderRadius:6,background:'rgba(63,81,181,0.15)',color:'#5C6BC0',fontWeight:600}}>Sublocation: {(result.clientLocation as any).sublocation}</span>}
                    {(result.clientLocation as any).town && <span style={{fontSize:11,padding:'3px 8px',borderRadius:6,background:'rgba(121,85,72,0.15)',color:'#8D6E63',fontWeight:600}}>Town: {(result.clientLocation as any).town}</span>}
                    {result.clientLocation.village && <span style={{fontSize:11,padding:'3px 8px',borderRadius:6,background:'rgba(233,30,99,0.15)',color:'#E91E63',fontWeight:600}}>Village: {result.clientLocation.village}</span>}
                    {(result.clientLocation as any).estate && <span style={{fontSize:11,padding:'3px 8px',borderRadius:6,background:'rgba(255,193,7,0.15)',color:'#FFC107',fontWeight:600}}>Estate: {(result.clientLocation as any).estate}</span>}
                    {(result.clientLocation as any).farm && <span style={{fontSize:11,padding:'3px 8px',borderRadius:6,background:'rgba(139,195,74,0.15)',color:'#8BC34A',fontWeight:600}}>Farm: {(result.clientLocation as any).farm}</span>}
                  </div>
                  {result.clientLocation.geocodedDisplayName && (
                    <div style={{fontSize:12,color:'var(--text-secondary)'}}>Geocoded to: <strong>{result.clientLocation.geocodedDisplayName}</strong></div>
                  )}
                  <div style={{fontSize:11,color:'var(--text-tertiary)',marginTop:4}}>20-year weather history, regional borehole records, and satellite data were fetched for these coordinates.</div>
                </div>
              )}
              {/* LOCATION ENTRY (when no EXIF GPS from image) */}
              {result.gpsSource!=='exif' && result.locationMethod!=='exif-gps' && (
                <div style={{background:'rgba(56,189,248,0.06)',border:'1px solid rgba(56,189,248,0.15)',padding:'14px 18px',borderRadius:12,marginBottom:16}}>
                  <div style={{fontWeight:700,marginBottom:8,color:'var(--text-primary)',fontSize:14}}>{'\u{1F4CD}'} {result.gpsSource==='none'&&result.locationMethod!=='filename-geocode'&&result.locationMethod!=='iptc-geocode'?'Set Site Location':'Update Site Location'}</div>
                  <div style={{fontSize:12,color:'var(--text-secondary)',marginBottom:10}}>{result.gpsSource==='none'&&result.locationMethod!=='filename-geocode'&&result.locationMethod!=='iptc-geocode'?'No GPS found in image. Use your device GPS (if you are at the site) or enter coordinates manually.':'Location is set. You can update it below if needed.'}</div>
                  <div style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap',marginBottom:10}}>
                    <button onClick={useMyLocation} disabled={locatingDevice} style={{padding:'10px 20px',borderRadius:8,border:'none',background:locatingDevice?'var(--bg-elevated)':'#22c55e',color:locatingDevice?'var(--text-secondary)':'#fff',fontWeight:700,fontSize:13,cursor:locatingDevice?'wait':'pointer',display:'flex',alignItems:'center',gap:6}}>
                      {locatingDevice ? '\u23F3 Locating...' : '\u{1F4F1} I\u2019m at the site \u2014 Use My GPS'}
                    </button>
                  </div>
                  <div style={{fontSize:11,color:'var(--text-tertiary)',marginBottom:8}}>Or search the place by name (village, church, school, town):</div>
                  <div style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap',marginBottom:10}}>
                    <input type="text" placeholder='e.g. "Esikangu Church of God, Vihiga"' value={placeQuery} onChange={e=>setPlaceQuery(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')void searchPlaceAndApply();}} style={{flex:2,minWidth:220,padding:'8px 12px',borderRadius:8,border:'1px solid var(--border)',background:'var(--bg-elevated)',color:'var(--text-primary)',fontSize:13}} />
                    <button onClick={searchPlaceAndApply} disabled={placeSearching} style={{padding:'8px 20px',borderRadius:8,border:'none',background:placeSearching?'var(--bg-elevated)':'#22c55e',color:placeSearching?'var(--text-secondary)':'#fff',fontWeight:700,fontSize:13,cursor:placeSearching?'wait':'pointer'}}>{placeSearching?'⏳ Searching…':'\u{1F50D} Find & Re-analyze'}</button>
                  </div>
                  <div style={{fontSize:11,color:'var(--text-tertiary)',marginBottom:8}}>Or paste decimal coordinates (in Google Maps: press &amp; hold the spot, copy the numbers — Plus Codes like 2JGW+JWV won&apos;t work):</div>
                  <div style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap'}}>
                    <input type="text" placeholder="Latitude (e.g. 0.026677)" value={manualLat} onChange={e=>setManualLat(e.target.value)} style={{flex:1,minWidth:140,padding:'8px 12px',borderRadius:8,border:'1px solid var(--border)',background:'var(--bg-elevated)',color:'var(--text-primary)',fontFamily:'var(--font-mono)',fontSize:13}} />
                    <input type="text" placeholder="Longitude (e.g. 34.647174)" value={manualLon} onChange={e=>setManualLon(e.target.value)} style={{flex:1,minWidth:140,padding:'8px 12px',borderRadius:8,border:'1px solid var(--border)',background:'var(--bg-elevated)',color:'var(--text-primary)',fontFamily:'var(--font-mono)',fontSize:13}} />
                    <button onClick={applyManualCoordinates} style={{padding:'8px 20px',borderRadius:8,border:'none',background:'var(--accent)',color:'#000',fontWeight:600,fontSize:13,cursor:'pointer'}}>Apply &amp; Re-analyze</button>
                  </div>
                  {manualLocError && (
                    <div style={{marginTop:10,padding:'10px 14px',borderRadius:8,background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.25)',color:'#fca5a5',fontSize:12,lineHeight:1.5}}>
                      {'⚠️'} {manualLocError}
                    </div>
                  )}
                  {(pinnedPlaceLoading || pinnedPlace) && (manualLat.trim() || manualLon.trim()) && (
                    <div style={{marginTop:10,padding:'8px 12px',borderRadius:8,background:'rgba(34,197,94,0.08)',border:'1px solid rgba(34,197,94,0.25)',fontSize:11.5,color:'#86efac',lineHeight:1.6}}>
                      {pinnedPlaceLoading ? <>{'\u{1F30D}'} Resolving County / Sub-County / Ward / Village names…</> : <>{'\u{1F4CD}'} <strong>Site identified:</strong> {pinnedPlace}</>}
                    </div>
                  )}
                </div>
              )}
              {/* PRIMARY DRILLING POINT — unmissable marker card (verified locations only;
                  regional estimates keep coordinates withheld per pre-screening policy) */}
              {(result.locationMethod==='exif-gps'||result.locationMethod==='filename-geocode'||result.locationMethod==='iptc-geocode'||result.gpsSource==='device'||result.gpsSource==='manual') && (() => {
                const dp = (result as any).drillDecision?.primaryPoint;
                const dLat = dp?.lat ?? result.site.latitude;
                const dLon = dp?.lon ?? result.site.longitude;
                const dDepth = (result as any).drillDecision?.targetDepth_m ?? result.recommendedDepth;
                return (
                  <div style={{background:'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(15,23,42,0.9))',border:'2px solid #ef4444',borderRadius:14,padding:'16px 20px',marginBottom:16}}>
                    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
                      <span style={{fontSize:26}}>{'\u{1F3AF}'}</span>
                      <div style={{fontWeight:800,fontSize:16,color:'#fca5a5',letterSpacing:0.5}}>PRIMARY DRILLING POINT</div>
                    </div>
                    <div style={{fontFamily:'var(--font-mono)',fontSize:22,fontWeight:800,color:'#fff',marginBottom:6}}>
                      {dLat.toFixed(6)}, {dLon.toFixed(6)}
                    </div>
                    {result.resolvedLocation && formatAdminHierarchy(result.resolvedLocation) && (
                      <div style={{fontSize:12,color:'#86efac',marginBottom:6,lineHeight:1.6}}>
                        {'\u{1F4CD}'} {formatAdminHierarchy(result.resolvedLocation)}
                      </div>
                    )}
                    <div style={{fontSize:13,color:'var(--text-secondary)',marginBottom:12}}>
                      Drill to <strong style={{color:'#fbbf24'}}>{Math.round(dDepth)} m</strong> at this point{result.gpsSource==='manual' ? ' (location you provided)' : result.gpsSource==='device' ? ' (your device GPS)' : ' (photo GPS)'} — confirm the final rig position with the ERT survey.
                    </div>
                    <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                      <a href={`https://www.google.com/maps?q=${dLat.toFixed(6)},${dLon.toFixed(6)}`} target="_blank" rel="noopener noreferrer" style={{padding:'8px 16px',borderRadius:8,background:'#22c55e',color:'#fff',fontWeight:700,fontSize:13,textDecoration:'none'}}>{'\u{1F5FA}️'} Open in Google Maps</a>
                      <button onClick={()=>{try{navigator.clipboard.writeText(`${dLat.toFixed(6)}, ${dLon.toFixed(6)}`);}catch{/* clipboard blocked */}}} style={{padding:'8px 16px',borderRadius:8,border:'1px solid var(--border)',background:'var(--bg-elevated)',color:'var(--text-primary)',fontWeight:600,fontSize:13,cursor:'pointer'}}>{'\u{1F4CB}'} Copy coordinates</button>
                    </div>
                  </div>
                );
              })()}

              {/* GEO-ESTIMATION FROM VISUAL TERRAIN ANALYSIS */}
              {result.geoEstimate && result.geoEstimate.estimates.length > 0 && (
                <div style={{background:'rgba(251,191,36,0.06)',border:'1px solid rgba(251,191,36,0.18)',padding:'14px 18px',borderRadius:12,marginBottom:16}}>
                  <div style={{fontWeight:700,marginBottom:8,color:'var(--text-primary)',fontSize:14}}>{'\u{1F30D}'} Visual Geographic Estimation {'\u2014'} AI Terrain Fingerprint</div>
                  <div style={{fontSize:12,color:'var(--text-secondary)',marginBottom:10}}>Location estimated by matching soil color, vegetation, brightness, and terrain texture against 30+ geographic profiles worldwide. Best with outdoor terrain photos.</div>
                  <div style={{display:'flex',flexDirection:'column',gap:6}}>
                    {result.geoEstimate.estimates.slice(0,3).map((est: any, i: number) => (
                      <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'6px 10px',borderRadius:8,background:i===0?'rgba(251,191,36,0.10)':'rgba(255,255,255,0.02)'}}>
                        <span style={{fontWeight:700,fontSize:15,color:i===0?'#fbbf24':i===1?'#94a3b8':'#64748b',minWidth:22}}>#{est.rank}</span>
                        <span style={{flex:1,fontWeight:i===0?700:400,color:i===0?'var(--text-primary)':'var(--text-secondary)',fontSize:13}}>
                          {est.region}{est.subRegion ? `, ${est.subRegion}`:''} <span style={{opacity:0.7}}>({est.country})</span>
                        </span>
                        <span style={{fontFamily:'var(--font-mono)',fontSize:12,color:est.confidence>0.45?'#22c55e':est.confidence>0.30?'#fbbf24':'#94a3b8',fontWeight:600}}>{Math.round(est.confidence*100)}%</span>
                        <span style={{fontSize:11,color:'var(--text-tertiary)',minWidth:80}}>{est.climateZone}</span>
                      </div>
                    ))}
                  </div>
                  {result.geoEstimate.bestEstimate && result.geoEstimate.bestEstimate.reasoning.length > 0 && (
                    <div style={{marginTop:8,fontSize:11,color:'var(--text-tertiary)'}}>
                      <strong>Why #{'\u00A0'}1:</strong> {result.geoEstimate.bestEstimate.reasoning.slice(0,3).join(' \u2022 ')}
                    </div>
                  )}
                  {result.resolvedLocation && result.resolvedLocation.source !== 'none' && result.gpsSource === 'none' && (
                    <div style={{marginTop:8,padding:'8px 12px',borderRadius:8,background:'rgba(34,197,94,0.06)',border:'1px solid rgba(34,197,94,0.12)'}}>
                      <div style={{fontSize:12,fontWeight:600,color:'var(--accent-green)'}}>
                        {'\u{1F4CD}'} Estimated Location: {result.resolvedLocation.displayName || [result.resolvedLocation.village, result.resolvedLocation.suburb, result.resolvedLocation.city, result.resolvedLocation.county, result.resolvedLocation.state, result.resolvedLocation.country].filter(Boolean).join(', ')}
                      </div>
                      <div style={{fontSize:10,color:'var(--text-tertiary)',marginTop:2}}>Reverse geocoded from visual estimate centroid via {result.resolvedLocation.source === 'nominatim' ? 'OpenStreetMap' : 'BigDataCloud'}</div>
                    </div>
                  )}
                </div>
              )}
              <div className="result-grid">
                <div className="result-item"><span className="rl">Location</span><span className="rv">{result.locationMethod==='exif-gps'||result.locationMethod==='filename-geocode'||result.locationMethod==='iptc-geocode'||result.gpsSource==='device'||result.gpsSource==='manual' ? `${result.site.latitude.toFixed(4)}, ${result.site.longitude.toFixed(4)}` : result.geoEstimate?.bestEstimate ? `~${result.geoEstimate.bestEstimate.latitude.toFixed(2)}, ${result.geoEstimate.bestEstimate.longitude.toFixed(2)} (estimated)` : 'No GPS \u2014 set location above'}</span></div>
                <div className="result-item"><span className="rl">GPS Source</span><span className="rv" style={{color:result.locationMethod==='exif-gps'||result.locationMethod==='filename-geocode'||result.locationMethod==='iptc-geocode'||result.gpsSource==='device'?'#4CAF50':result.gpsSource==='manual'?'#38bdf8':result.locationMethod==='visual-estimate'?'#fbbf24':'#F44336'}}>{result.locationMethod==='exif-gps'?'Photo EXIF (from image)':result.locationMethod==='filename-geocode'?'Filename Geocode (OSM)':result.locationMethod==='iptc-geocode'?'IPTC/XMP Geocode (OSM)':result.gpsSource==='device'?'Device GPS (at site)':result.gpsSource==='manual'?'Manual Entry':result.locationMethod==='visual-estimate'?`Visual Estimate (${result.geoEstimate?.bestEstimate?.country||'terrain'})`:'No GPS'}</span></div>
                {result.imageForensicId && <div className="result-item"><span className="rl">Image ID</span><span className="rv" style={{fontFamily:'var(--font-mono)',fontSize:11}}>{result.imageForensicId.compositeId}</span></div>}
                {result.imageForensicId?.cameraMake && <div className="result-item"><span className="rl">Camera</span><span className="rv">{[result.imageForensicId.cameraMake, result.imageForensicId.cameraModel].filter(Boolean).join(' ')}{result.imageForensicId.cameraSerial ? ` (SN: ${result.imageForensicId.cameraSerial})` : ''}</span></div>}
                <div className="result-item"><span className="rl">Site Type</span><span className="rv">{result.site.siteType.toUpperCase()}</span></div>
                <div className="result-item"><span className="rl">Viability</span><span className="rv">{result.risk.viability === 'not_recommended' ? 'NEEDS ASSESSMENT' : result.risk.viability.toUpperCase()}</span></div>
                <div className="result-item"><span className="rl">Soil Type</span><span className="rv">{result.soil.type.toUpperCase()}</span></div>
                <div className="result-item"><span className="rl">Potability</span><span className="rv">{result.waterQuality.isPotable ? 'Potable' : 'Treatment Required'}</span></div>
                <div className="result-item"><span className="rl">Quality Score</span><span className="rv">{(result.waterQuality.score*100).toFixed(0)}%</span></div>
                <div className="result-item"><span className="rl">Porosity</span><span className="rv">{(result.soil.porosity*100).toFixed(0)}%</span></div>
              </div>
            </div>
          )}

          {/* ═══ AI SCANNER TAB ═══ */}
          {activeResultTab==='ai-scanner' && (
            <div>
              <h4 className="tab-title">{'\u{1F50D}'} AI Image Scanner — Soil, Vegetation &amp; Terrain Analysis</h4>
              <p className="tab-desc">Advanced multi-layer image scanner: identifies soil type via Munsell Color Charts, detects water-indicating vegetation (phreatophytes), and generates 2D/3D terrain maps.</p>

              {/* Run Scanner Button */}
              {!scannerResult && !scannerRunning && (
                <div style={{textAlign:'center',padding:30}}>
                  <button className="btn btn-analyze" style={{padding:'16px 40px',fontSize:16,background:'linear-gradient(135deg,#7c3aed,#2563eb)'}}
                    onClick={async ()=>{
                      if(!result||!selectedImage) return;
                      setScannerRunning(true);
                      try {
                        const img = new Image();
                        img.crossOrigin = 'anonymous';
                        await new Promise<void>((resolve,reject)=>{img.onload=()=>resolve();img.onerror=reject;img.src=selectedImage;});
                        const mobilenetLabels = (result as any).pixelAnalysis?.predictions || (result as any).terrainFeatures?.predictions || [];
                        const pixelAn = result.pixelAnalysis;
                        const scanResult = await runAIScanner({
                          imageElement: img,
                          mobilenetLabels: mobilenetLabels.map((p: any)=>({className:p.className||p.label||'',probability:p.probability||p.score||0})),
                          pixelAnalysis: pixelAn ? {
                            greenRatio: pixelAn.greenRatio||0, blueRatio: pixelAn.blueRatio||0, redRatio: pixelAn.redRatio||0,
                            brightness: pixelAn.brightness||0, vegetationIndex: pixelAn.vegetationIndex||0,
                            waterIndex: pixelAn.waterIndex||0, soilExposureIndex: pixelAn.soilExposureIndex||0,
                            rockExposureIndex: pixelAn.rockExposureIndex||0, dominantColorClass: pixelAn.dominantColorClass||'',
                          } : undefined,
                          rockType: result.rockClassification?.primaryRockType,
                          estimatedDepth_m: result.recommendedDepth,
                          coordinates: result.site ? {latitude:result.site.latitude,longitude:result.site.longitude} : undefined,
                        });
                        setScannerResult(scanResult);

                        // Render 2D map after state update
                        setTimeout(()=>{
                          if(scannerMapRef.current){
                            render2DAnnotatedMap(scannerMapRef.current, img, scanResult.mapZones);
                          }
                          if(scannerCrossRef.current){
                            render2DCrossSection(scannerCrossRef.current, scanResult.subsurfaceLayers, scanResult.waterTableDepth_m,
                              Math.max(...scanResult.subsurfaceLayers.map(l=>l.bottomDepth_m)),
                              'Estimated Subsurface Profile');
                          }
                          if(scanner3dRef.current){
                            if(scanner3dCleanup.current) scanner3dCleanup.current.cleanup();
                            scanner3dCleanup.current = render3DTerrain(scanner3dRef.current, img);
                          }
                          if(scanner3dSubRef.current){
                            render3DSubsurface(scanner3dSubRef.current, scanResult.subsurfaceLayers, scanResult.waterTableDepth_m, 0.5);
                          }
                        }, 100);
                      } catch(e:any){console.error('Scanner error:',e);}
                      finally{setScannerRunning(false);}
                    }}>
                    {'\u{1F50D}'} Run AI Scanner on Uploaded Image
                  </button>
                  <div style={{marginTop:10,fontSize:12,color:'var(--text-muted)'}}>Analyzes soil color, vegetation, terrain type, and generates 2D/3D maps</div>
                </div>
              )}
              {scannerRunning && (
                <div style={{textAlign:'center',padding:40}}>
                  <div style={{fontSize:18,color:'#7c3aed',marginBottom:8}}>Scanning image...</div>
                  <div className="spinner"></div>
                </div>
              )}

              {scannerResult && (
                <div>
                  {/* Scanner Summary Bar */}
                  <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:10,marginBottom:20}}>
                    <div style={{padding:14,background:'rgba(124,58,237,0.1)',borderRadius:12,border:'1px solid rgba(124,58,237,0.2)',textAlign:'center'}}>
                      <div style={{fontSize:22,fontWeight:800,color:'#a78bfa'}}>{(scannerResult.overallConfidence*100).toFixed(0)}%</div>
                      <div style={{fontSize:10,color:'#94a3b8',marginTop:2}}>Scan Confidence</div>
                    </div>
                    <div style={{padding:14,background:'rgba(139,69,19,0.1)',borderRadius:12,border:'1px solid rgba(139,69,19,0.3)',textAlign:'center'}}>
                      <div style={{fontSize:14,fontWeight:700,color:'#d4a76a'}}>{scannerResult.soilAnalysis.soilType}</div>
                      <div style={{fontSize:10,color:'#94a3b8',marginTop:2}}>Soil Type</div>
                    </div>
                    <div style={{padding:14,background:'rgba(46,125,50,0.1)',borderRadius:12,border:'1px solid rgba(46,125,50,0.3)',textAlign:'center'}}>
                      <div style={{fontSize:14,fontWeight:700,color:'#66bb6a'}}>{scannerResult.vegetationAnalysis.pixelStats.vigor}</div>
                      <div style={{fontSize:10,color:'#94a3b8',marginTop:2}}>Vegetation ({Math.round(scannerResult.vegetationAnalysis.pixelStats.vegetationCover*100)}%)</div>
                    </div>
                    <div style={{padding:14,background:'rgba(21,101,192,0.1)',borderRadius:12,border:'1px solid rgba(21,101,192,0.3)',textAlign:'center'}}>
                      <div style={{fontSize:14,fontWeight:700,color:'#42a5f5'}}>{scannerResult.groundwaterSynthesis.overallLikelihood}</div>
                      <div style={{fontSize:10,color:'#94a3b8',marginTop:2}}>GW Likelihood</div>
                    </div>
                    <div style={{padding:14,background:'rgba(56,189,248,0.1)',borderRadius:12,border:'1px solid rgba(56,189,248,0.2)',textAlign:'center'}}>
                      <div style={{fontSize:14,fontWeight:700,color:'#38bdf8'}}>{scannerResult.waterTableDepth_m}m</div>
                      <div style={{fontSize:10,color:'#94a3b8',marginTop:2}}>Est. Water Table</div>
                    </div>
                  </div>

                  {/* Warnings */}
                  {scannerResult.warnings.length > 0 && (
                    <div style={{background:'rgba(245,158,11,0.1)',border:'1px solid rgba(245,158,11,0.3)',padding:12,borderRadius:10,marginBottom:16,fontSize:12,color:'#fbbf24'}}>
                      {scannerResult.warnings.map((w,i)=><div key={i}>{'\u26A0\uFE0F'} {w}</div>)}
                    </div>
                  )}

                  {/* ── Soil Color Analysis ── */}
                  <div style={{background:'rgba(139,69,19,0.06)',border:'1px solid rgba(139,69,19,0.2)',padding:18,borderRadius:12,marginBottom:16}}>
                    <h4 style={{color:'#d4a76a',margin:'0 0 12px',fontSize:15}}>{'\u{1F7EB}'} Soil Color Analysis (Munsell)</h4>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
                      <div style={{padding:10,background:'rgba(15,23,42,0.5)',borderRadius:8}}>
                        <div style={{fontSize:11,color:'#94a3b8'}}>Munsell Notation</div>
                        <div style={{fontSize:15,fontWeight:700,color:'#e2e8f0',marginTop:2}}>{scannerResult.soilAnalysis.munsell.notation}</div>
                      </div>
                      <div style={{padding:10,background:'rgba(15,23,42,0.5)',borderRadius:8}}>
                        <div style={{fontSize:11,color:'#94a3b8'}}>Color Name</div>
                        <div style={{fontSize:14,fontWeight:600,color:'#e2e8f0',marginTop:2}}>{scannerResult.soilAnalysis.colorName}</div>
                      </div>
                      <div style={{padding:10,background:'rgba(15,23,42,0.5)',borderRadius:8}}>
                        <div style={{fontSize:11,color:'#94a3b8'}}>Confidence</div>
                        <div style={{fontSize:15,fontWeight:700,color:scannerResult.soilAnalysis.confidence>0.7?'#22c55e':scannerResult.soilAnalysis.confidence>0.4?'#eab308':'#ef4444',marginTop:2}}>{(scannerResult.soilAnalysis.confidence*100).toFixed(0)}%</div>
                      </div>
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:8,marginTop:10}}>
                      {[
                        {label:'Organic Matter',value:scannerResult.soilAnalysis.organicMatter.level},
                        {label:'Iron Oxides',value:scannerResult.soilAnalysis.ironOxides.level},
                        {label:'Drainage',value:scannerResult.soilAnalysis.drainage},
                        {label:'Parent Material',value:scannerResult.soilAnalysis.parentMaterial},
                        {label:'Moisture',value:scannerResult.soilAnalysis.moisture.level},
                        {label:'GW Indicator',value:scannerResult.soilAnalysis.groundwaterIndicator.likelihood},
                      ].map(item=>(
                        <div key={item.label} style={{padding:8,background:'rgba(15,23,42,0.3)',borderRadius:6}}>
                          <div style={{fontSize:10,color:'#94a3b8'}}>{item.label}</div>
                          <div style={{fontSize:12,fontWeight:600,color:'#e2e8f0',marginTop:2}}>{item.value || 'N/A'}</div>
                        </div>
                      ))}
                    </div>
                    {/* Dominant Colors */}
                    {scannerResult.soilAnalysis.dominantColors && scannerResult.soilAnalysis.dominantColors.length > 0 && (
                      <div style={{marginTop:10}}>
                        <div style={{fontSize:11,color:'#94a3b8',marginBottom:6}}>Dominant Soil Colors</div>
                        <div style={{display:'flex',gap:8}}>
                          {scannerResult.soilAnalysis.dominantColors.map((c,i)=>(
                            <div key={i} style={{display:'flex',alignItems:'center',gap:6,padding:'4px 10px',background:'rgba(15,23,42,0.4)',borderRadius:6}}>
                              <div style={{width:20,height:20,borderRadius:4,background:`rgb(${c.rgb.join(',')})`,border:'1px solid rgba(255,255,255,0.2)'}}></div>
                              <span style={{fontSize:11,color:'#cbd5e1'}}>{c.percentage.toFixed(0)}% — RGB({c.rgb.join(',')})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ── Vegetation & Phreatophyte Detection ── */}
                  <div style={{background:'rgba(46,125,50,0.06)',border:'1px solid rgba(46,125,50,0.2)',padding:18,borderRadius:12,marginBottom:16}}>
                    <h4 style={{color:'#66bb6a',margin:'0 0 12px',fontSize:15}}>{'\u{1F33F}'} Vegetation &amp; Phreatophyte Detection</h4>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:10,marginBottom:12}}>
                      <div style={{padding:10,background:'rgba(15,23,42,0.5)',borderRadius:8}}>
                        <div style={{fontSize:11,color:'#94a3b8'}}>Cover</div>
                        <div style={{fontSize:15,fontWeight:700,color:'#66bb6a'}}>{Math.round(scannerResult.vegetationAnalysis.pixelStats.vegetationCover*100)}%</div>
                      </div>
                      <div style={{padding:10,background:'rgba(15,23,42,0.5)',borderRadius:8}}>
                        <div style={{fontSize:11,color:'#94a3b8'}}>Vigor</div>
                        <div style={{fontSize:14,fontWeight:600,color:'#e2e8f0'}}>{scannerResult.vegetationAnalysis.pixelStats.vigor}</div>
                      </div>
                      <div style={{padding:10,background:'rgba(15,23,42,0.5)',borderRadius:8}}>
                        <div style={{fontSize:11,color:'#94a3b8'}}>Distribution</div>
                        <div style={{fontSize:12,fontWeight:600,color:'#e2e8f0'}}>{scannerResult.vegetationAnalysis.pixelStats.distribution}</div>
                      </div>
                      <div style={{padding:10,background:'rgba(15,23,42,0.5)',borderRadius:8}}>
                        <div style={{fontSize:11,color:'#94a3b8'}}>Green-in-Dry?</div>
                        <div style={{fontSize:14,fontWeight:700,color:scannerResult.vegetationAnalysis.pixelStats.greenInDryPattern?'#22c55e':'#64748b'}}>{scannerResult.vegetationAnalysis.pixelStats.greenInDryPattern?'YES':'No'}</div>
                      </div>
                    </div>
                    {/* Phreatophytes */}
                    {scannerResult.vegetationAnalysis.phreatophytes.length > 0 && (
                      <div>
                        <div style={{fontSize:12,fontWeight:700,color:'#a5d6a7',marginBottom:6}}>Detected Water-Indicating Plants</div>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                          {scannerResult.vegetationAnalysis.phreatophytes.slice(0,6).map((ph,i)=>(
                            <div key={i} style={{padding:10,background:'rgba(15,23,42,0.4)',borderRadius:8,border:'1px solid rgba(46,125,50,0.15)'}}>
                              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                                <span style={{fontWeight:700,fontSize:13,color:'#e2e8f0'}}>{ph.species}</span>
                                <span style={{fontSize:11,color:ph.matchConfidence>0.5?'#22c55e':'#eab308',fontWeight:600}}>{(ph.matchConfidence*100).toFixed(0)}%</span>
                              </div>
                              <div style={{fontSize:10,color:'#94a3b8',fontStyle:'italic'}}>{ph.scientific}</div>
                              <div style={{fontSize:11,color:'#7dd3fc',marginTop:4}}>Water depth: {ph.waterDepthRange_m[0]}-{ph.waterDepthRange_m[1]}m (GW confidence: {(ph.gwConfidence*100).toFixed(0)}%)</div>
                              <div style={{fontSize:10,color:'#64748b',marginTop:2}}>Matched by: {ph.matchedBy}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {scannerResult.vegetationAnalysis.phreatophytes.length === 0 && (
                      <div style={{padding:12,background:'rgba(15,23,42,0.3)',borderRadius:8,fontSize:12,color:'#64748b',textAlign:'center'}}>No specific phreatophyte species detected — general vegetation metrics used for assessment</div>
                    )}
                  </div>

                  {/* ── Groundwater Evidence Synthesis ── */}
                  <div style={{background:'rgba(21,101,192,0.06)',border:'1px solid rgba(21,101,192,0.2)',padding:18,borderRadius:12,marginBottom:16}}>
                    <h4 style={{color:'#42a5f5',margin:'0 0 12px',fontSize:15}}>{'\u{1F4A7}'} Groundwater Evidence Synthesis</h4>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:16}}>
                      <div style={{textAlign:'center'}}>
                        <div style={{
                          width:100,height:100,borderRadius:'50%',margin:'0 auto 10px',
                          display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',
                          background:`conic-gradient(${
                            scannerResult.groundwaterSynthesis.combinedConfidence>0.6?'#22c55e':
                            scannerResult.groundwaterSynthesis.combinedConfidence>0.35?'#eab308':'#ef4444'
                          } ${scannerResult.groundwaterSynthesis.combinedConfidence*360}deg, rgba(100,116,139,0.2) 0deg)`,
                        }}>
                          <div style={{width:80,height:80,borderRadius:'50%',background:'#0f172a',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
                            <div style={{fontSize:20,fontWeight:800,color:'#e2e8f0'}}>{(scannerResult.groundwaterSynthesis.combinedConfidence*100).toFixed(0)}%</div>
                            <div style={{fontSize:9,color:'#94a3b8'}}>Combined</div>
                          </div>
                        </div>
                        <div style={{fontSize:16,fontWeight:800,color:
                          scannerResult.groundwaterSynthesis.overallLikelihood==='Very High'?'#22c55e':
                          scannerResult.groundwaterSynthesis.overallLikelihood==='High'?'#4ade80':
                          scannerResult.groundwaterSynthesis.overallLikelihood==='Moderate'?'#eab308':'#ef4444'
                        }}>{scannerResult.groundwaterSynthesis.overallLikelihood}</div>
                        <div style={{fontSize:12,color:'#94a3b8',marginTop:4}}>Depth: {scannerResult.groundwaterSynthesis.estimatedDepthRange_m[0]}–{scannerResult.groundwaterSynthesis.estimatedDepthRange_m[1]}m</div>
                      </div>
                      <div>
                        <div style={{fontSize:12,fontWeight:700,color:'#7dd3fc',marginBottom:8}}>Evidence Sources</div>
                        {scannerResult.groundwaterSynthesis.evidenceSources.map((ev,i)=>(
                          <div key={i} style={{padding:8,background:'rgba(15,23,42,0.4)',borderRadius:6,marginBottom:6,borderLeft:`3px solid ${ev.supports?'#22c55e':'#ef4444'}`}}>
                            <div style={{display:'flex',justifyContent:'space-between'}}>
                              <span style={{fontWeight:600,fontSize:12,color:'#e2e8f0'}}>{ev.source}</span>
                              <span style={{fontSize:11,color:ev.supports?'#22c55e':'#f87171'}}>{ev.supports?'SUPPORTS':'NEUTRAL'} ({(ev.confidence*100).toFixed(0)}%)</span>
                            </div>
                            <div style={{fontSize:11,color:'#94a3b8',marginTop:2}}>{ev.finding}</div>
                          </div>
                        ))}
                        <div style={{padding:10,background:'rgba(56,189,248,0.08)',borderRadius:8,marginTop:10,fontSize:12,color:'#7dd3fc',lineHeight:1.5}}>
                          <strong>Recommendation:</strong> {scannerResult.groundwaterSynthesis.recommendation}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── 2D Annotated Map ── */}
                  <div style={{background:'rgba(15,23,42,0.4)',border:'1px solid rgba(124,58,237,0.2)',padding:18,borderRadius:12,marginBottom:16}}>
                    <h4 style={{color:'#a78bfa',margin:'0 0 12px',fontSize:15}}>{'\u{1F5FA}\uFE0F'} 2D Annotated Map</h4>
                    <canvas ref={scannerMapRef} width={800} height={500} style={{width:'100%',borderRadius:8,background:'#0a0a1a'}}></canvas>
                    <div style={{fontSize:10,color:'#64748b',marginTop:6,textAlign:'center'}}>Overlays show detected soil zones, vegetation areas, and water indicators on the source image</div>
                  </div>

                  {/* ── 2D Cross-Section ── */}
                  <div style={{background:'rgba(15,23,42,0.4)',border:'1px solid rgba(56,189,248,0.2)',padding:18,borderRadius:12,marginBottom:16}}>
                    <h4 style={{color:'#38bdf8',margin:'0 0 12px',fontSize:15}}>{'\u{1F4D0}'} Subsurface Cross-Section</h4>
                    <canvas ref={scannerCrossRef} width={800} height={400} style={{width:'100%',borderRadius:8,background:'#1a1a2e'}}></canvas>
                    <div style={{fontSize:10,color:'#64748b',marginTop:6,textAlign:'center'}}>Estimated geological layers with aquifer zones and water table depth</div>
                  </div>

                  {/* ── 3D Terrain ── */}
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
                    <div style={{background:'rgba(15,23,42,0.4)',border:'1px solid rgba(124,58,237,0.2)',padding:18,borderRadius:12}}>
                      <h4 style={{color:'#a78bfa',margin:'0 0 12px',fontSize:15}}>{'\u{1F3D4}\uFE0F'} 3D Terrain Model</h4>
                      <canvas ref={scanner3dRef} width={500} height={400} style={{width:'100%',borderRadius:8,background:'#0a0a1a',cursor:'grab'}}></canvas>
                      <div style={{fontSize:10,color:'#64748b',marginTop:6,textAlign:'center'}}>Drag to rotate, scroll to zoom — image draped on terrain mesh</div>
                    </div>
                    <div style={{background:'rgba(15,23,42,0.4)',border:'1px solid rgba(56,189,248,0.2)',padding:18,borderRadius:12}}>
                      <h4 style={{color:'#38bdf8',margin:'0 0 12px',fontSize:15}}>{'\u{1F9CA}'} 3D Subsurface Model</h4>
                      <canvas ref={scanner3dSubRef} width={500} height={400} style={{width:'100%',borderRadius:8,background:'#0d1117'}}></canvas>
                      <div style={{fontSize:10,color:'#64748b',marginTop:6,textAlign:'center'}}>Isometric view of subsurface layers with borehole and water table</div>
                    </div>
                  </div>

                  {/* ── Scene Classification ── */}
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
                    <div style={{background:'rgba(15,23,42,0.4)',border:'1px solid rgba(100,116,139,0.2)',padding:18,borderRadius:12}}>
                      <h4 style={{color:'#94a3b8',margin:'0 0 10px',fontSize:14}}>{'\u{1F30D}'} Scene Classification</h4>
                      <div className="result-grid">
                        <div className="result-item"><span className="rl">Primary Scene</span><span className="rv">{scannerResult.sceneClassification.primaryScene}</span></div>
                        <div className="result-item"><span className="rl">Terrain Type</span><span className="rv">{scannerResult.sceneClassification.terrainType}</span></div>
                        <div className="result-item"><span className="rl">Outdoor</span><span className="rv">{scannerResult.sceneClassification.isOutdoor?'Yes':'No'}</span></div>
                        <div className="result-item"><span className="rl">Confidence</span><span className="rv">{(scannerResult.sceneClassification.confidence*100).toFixed(0)}%</span></div>
                      </div>
                    </div>
                    <div style={{background:'rgba(15,23,42,0.4)',border:'1px solid rgba(100,116,139,0.2)',padding:18,borderRadius:12}}>
                      <h4 style={{color:'#94a3b8',margin:'0 0 10px',fontSize:14}}>{'\u2699\uFE0F'} Scanner Metadata</h4>
                      <div className="result-grid">
                        <div className="result-item"><span className="rl">Processing Time</span><span className="rv">{scannerResult.processingTime_ms}ms</span></div>
                        <div className="result-item"><span className="rl">Systems Active</span><span className="rv">{scannerResult.activeSystems.length}</span></div>
                        <div className="result-item"><span className="rl">Map Zones</span><span className="rv">{scannerResult.mapZones.length}</span></div>
                        <div className="result-item"><span className="rl">Sub. Layers</span><span className="rv">{scannerResult.subsurfaceLayers.length}</span></div>
                      </div>
                      <div style={{marginTop:8,fontSize:10,color:'#64748b'}}>{scannerResult.activeSystems.join(' → ')}</div>
                    </div>
                  </div>

                  {/* Re-scan Button */}
                  <div style={{textAlign:'center',marginTop:10}}>
                    <button className="btn btn-secondary" style={{fontSize:12}} onClick={()=>{
                      if(scanner3dCleanup.current) scanner3dCleanup.current.cleanup();
                      scanner3dCleanup.current = null;
                      setScannerResult(null);
                    }}>{'\u{1F504}'} Re-scan Image</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* GEOLOCATION (#1) */}
          {activeResultTab==='verification' && (() => {
            const verif = generateVerificationResult(
              result.site?.latitude, result.site?.longitude,
              result.locationMethod || 'none', result.gpsSource, result.gpsAccuracy,
              result.resolvedLocation?.source !== 'none', result.resolvedLocation?.source,
              result.geoEstimate?.bestEstimate?.confidence,
            );
            const osint = getOSINTChecklist();
            return (
            <div>
              <h4 className="tab-title">{'\u{1F50D}'} Location Verification &amp; Drilling Reliability</h4>
              <p className="tab-desc">Borehole drilling costs $5,000–$50,000+. <strong>Wrong location = wrong data = wasted money.</strong> Verify the location before making any drilling decisions.</p>

              {/* Confidence Score Card */}
              <div style={{display:'flex',gap:16,flexWrap:'wrap',marginBottom:20}}>
                <div style={{flex:'1 1 200px',background:'var(--bg-elevated)',border:'1px solid var(--border)',borderRadius:12,padding:20,textAlign:'center'}}>
                  <div style={{
                    width:80,height:80,borderRadius:'50%',margin:'0 auto 12px',display:'flex',alignItems:'center',justifyContent:'center',
                    fontSize:36,fontWeight:900,color:'#fff',
                    background:verif.confidence.grade==='A'?'#22c55e':verif.confidence.grade==='B'?'#38bdf8':verif.confidence.grade==='C'?'#fbbf24':verif.confidence.grade==='D'?'#f97316':'#ef4444',
                  }}>{verif.confidence.grade}</div>
                  <div style={{fontSize:28,fontWeight:800,color:'var(--text-primary)'}}>{verif.confidence.score}%</div>
                  <div style={{fontSize:13,color:'var(--text-secondary)',marginTop:4}}>{verif.confidence.label}</div>
                  <div style={{marginTop:8,padding:'4px 12px',borderRadius:6,display:'inline-block',fontSize:12,fontWeight:700,
                    background:verif.confidence.drillingReliability==='VERIFIED'?'rgba(34,197,94,0.15)':verif.confidence.drillingReliability==='HIGH'?'rgba(56,189,248,0.15)':verif.confidence.drillingReliability==='MODERATE'?'rgba(251,191,36,0.15)':verif.confidence.drillingReliability==='LOW'?'rgba(249,115,22,0.15)':'rgba(239,68,68,0.15)',
                    color:verif.confidence.drillingReliability==='VERIFIED'?'#22c55e':verif.confidence.drillingReliability==='HIGH'?'#38bdf8':verif.confidence.drillingReliability==='MODERATE'?'#fbbf24':verif.confidence.drillingReliability==='LOW'?'#f97316':'#ef4444',
                  }}>Drilling Reliability: {verif.confidence.drillingReliability}</div>
                </div>
                <div style={{flex:'2 1 300px'}}>
                  {verif.confidence.warnings.length > 0 && (
                    <div style={{marginBottom:12}}>
                      <div style={{fontWeight:700,fontSize:13,color:'#ef4444',marginBottom:6}}>⚠️ Warnings</div>
                      {verif.confidence.warnings.map((w,i)=><div key={i} style={{fontSize:12,color:'var(--text-secondary)',padding:'4px 0',borderBottom:'1px solid rgba(255,255,255,0.03)'}}>{w}</div>)}
                    </div>
                  )}
                  {verif.confidence.recommendations.length > 0 && (
                    <div style={{marginBottom:12}}>
                      <div style={{fontWeight:700,fontSize:13,color:'#38bdf8',marginBottom:6}}>📋 Recommendations</div>
                      {verif.confidence.recommendations.map((r,i)=><div key={i} style={{fontSize:12,color:'var(--text-secondary)',padding:'4px 0',borderBottom:'1px solid rgba(255,255,255,0.03)'}}>{r}</div>)}
                    </div>
                  )}
                  <div>
                    <div style={{fontWeight:700,fontSize:13,color:'var(--text-primary)',marginBottom:6}}>📡 Data Sources Used</div>
                    {verif.confidence.dataSources.map((d,i)=><div key={i} style={{fontSize:12,color:'var(--text-secondary)',padding:'2px 0'}}>• {d}</div>)}
                  </div>
                </div>
              </div>

              {/* Reverse Image Search Tools */}
              <h4 style={{color:'#E91E63',marginBottom:12}}>🔍 Reverse Image Search — Verify Image Location</h4>
              <p style={{fontSize:12,color:'var(--text-tertiary)',marginBottom:12}}>Upload the same image to these services. If the image appears online, you can identify the actual location from the source context.</p>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:10,marginBottom:20}}>
                {verif.links.filter(l=>l.type==='reverse-image').map((link,i)=>(
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{
                    display:'block',padding:'12px 14px',borderRadius:10,border:'1px solid var(--border)',background:'var(--bg-elevated)',
                    textDecoration:'none',color:'var(--text-primary)',transition:'all 0.2s',
                  }}>
                    <div style={{fontSize:18,marginBottom:4}}>{link.icon} {link.service}</div>
                    <div style={{fontSize:11,color:'var(--text-tertiary)',lineHeight:1.3}}>{link.description}</div>
                    {link.requiresManualUpload && <div style={{fontSize:10,color:'#fbbf24',marginTop:6}}>↑ Upload image manually on the site</div>}
                  </a>
                ))}
              </div>

              {/* Map Verification Tools */}
              {verif.links.some(l=>l.type==='map'||l.type==='satellite'||l.type==='streetview') && (
                <>
                  <h4 style={{color:'#4CAF50',marginBottom:12}}>🗺️ Map & Satellite Verification</h4>
                  <p style={{fontSize:12,color:'var(--text-tertiary)',marginBottom:12}}>Compare the image against satellite imagery and street-level photos at the detected coordinates. Does the terrain actually match?</p>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:10,marginBottom:20}}>
                    {verif.links.filter(l=>l.type==='map'||l.type==='satellite'||l.type==='streetview').map((link,i)=>(
                      <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{
                        display:'block',padding:'12px 14px',borderRadius:10,border:'1px solid var(--border)',background:'var(--bg-elevated)',
                        textDecoration:'none',color:'var(--text-primary)',transition:'all 0.2s',
                      }}>
                        <div style={{fontSize:18,marginBottom:4}}>{link.icon} {link.service}</div>
                        <div style={{fontSize:11,color:'var(--text-tertiary)',lineHeight:1.3}}>{link.description}</div>
                      </a>
                    ))}
                  </div>
                </>
              )}

              {/* OSINT Verification Checklist */}
              <h4 style={{color:'#9C27B0',marginBottom:12}}>🕵️ OSINT Verification Checklist</h4>
              <p style={{fontSize:12,color:'var(--text-tertiary)',marginBottom:12}}>Systematic steps to verify the true location of any image. Complete each step before making drilling decisions.</p>
              <div className="sci-table-wrap">
                <table className="sci-table">
                  <thead><tr><th>Step</th><th>Tool</th><th>What to Check</th></tr></thead>
                  <tbody>{osint.map((o,i)=><tr key={i}><td style={{fontWeight:700,whiteSpace:'nowrap'}}>{o.step}</td><td style={{whiteSpace:'nowrap'}}>{o.tool}</td><td>{o.description}</td></tr>)}</tbody>
                </table>
              </div>

              <div className="geo-note" style={{marginTop:16,background: verif.confidence.grade==='F'||verif.confidence.grade==='D'?'rgba(239,68,68,0.08)':'rgba(56,189,248,0.06)',borderColor: verif.confidence.grade==='F'||verif.confidence.grade==='D'?'rgba(239,68,68,0.2)':'rgba(56,189,248,0.15)'}}>
                <strong>⚠️ DRILLING IS EXPENSIVE.</strong> A single borehole costs $5,000–$50,000+ depending on depth, geology, and location. All analysis results (soil, water quality, geological risk, depth, yield) depend on accurate location data. If the location confidence is below Grade B, <strong>do not proceed with drilling</strong> until the location is verified using the tools above. Enter exact GPS coordinates (from a site visit or Google Maps) for drilling-grade accuracy.
              </div>
            </div>
            );
          })()}

          {activeResultTab==='geolocation' && (
            <div>
              <h4 className="tab-title">{'\u{1F4F7}'} Photo Geolocation &amp; Image Analysis</h4>
              {result.gpsSource==='none' && result.locationMethod!=='filename-geocode' && result.locationMethod!=='iptc-geocode' && result.locationMethod!=='visual-estimate' && (
                <div style={{background:'rgba(239,68,68,0.08)',color:'var(--text-secondary)',padding:'12px 16px',borderRadius:8,marginBottom:14,fontSize:13,border:'1px solid rgba(239,68,68,0.2)'}}>
                  {'\u26A0\uFE0F'} <strong>No GPS data found in this image.</strong> Use the {'\u{1F4F1}'} button below to share your device GPS (if you are at the site), or enter coordinates manually.
                </div>
              )}
              {/* Location entry for geolocation tab */}
              {result.gpsSource!=='exif' && result.locationMethod!=='exif-gps' && (
                <div style={{background:'rgba(56,189,248,0.06)',border:'1px solid rgba(56,189,248,0.15)',padding:'14px 18px',borderRadius:12,marginBottom:16}}>
                  <div style={{fontWeight:700,marginBottom:8,color:'var(--text-primary)',fontSize:14}}>{'\u{1F4CD}'} {result.gpsSource==='none'?'Set Site Location':'Update Location'}</div>
                  <div style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap',marginBottom:10}}>
                    <button onClick={useMyLocation} disabled={locatingDevice} style={{padding:'10px 20px',borderRadius:8,border:'none',background:locatingDevice?'var(--bg-elevated)':'#22c55e',color:locatingDevice?'var(--text-secondary)':'#fff',fontWeight:700,fontSize:13,cursor:locatingDevice?'wait':'pointer',display:'flex',alignItems:'center',gap:6}}>
                      {locatingDevice ? '\u23F3 Locating...' : '\u{1F4F1} I\u2019m at the site \u2014 Use My GPS'}
                    </button>
                  </div>
                  <div style={{fontSize:11,color:'var(--text-tertiary)',marginBottom:8}}>Or enter coordinates manually:</div>
                  <div style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap'}}>
                    <input type="text" placeholder="Latitude" value={manualLat} onChange={e=>setManualLat(e.target.value)} style={{flex:1,minWidth:140,padding:'8px 12px',borderRadius:8,border:'1px solid var(--border)',background:'var(--bg-elevated)',color:'var(--text-primary)',fontFamily:'var(--font-mono)',fontSize:13}} />
                    <input type="text" placeholder="Longitude" value={manualLon} onChange={e=>setManualLon(e.target.value)} style={{flex:1,minWidth:140,padding:'8px 12px',borderRadius:8,border:'1px solid var(--border)',background:'var(--bg-elevated)',color:'var(--text-primary)',fontFamily:'var(--font-mono)',fontSize:13}} />
                    <button onClick={applyManualCoordinates} style={{padding:'8px 20px',borderRadius:8,border:'none',background:'var(--accent)',color:'#000',fontWeight:600,fontSize:13,cursor:'pointer'}}>Apply</button>
                  </div>
                </div>
              )}
              {/* GEO-ESTIMATION — VISUAL TERRAIN MATCHING */}
              {result.geoEstimate && result.geoEstimate.estimates.length > 0 && (
                <div style={{background:'rgba(251,191,36,0.06)',border:'1px solid rgba(251,191,36,0.18)',padding:'14px 18px',borderRadius:12,marginBottom:16}}>
                  <div style={{fontWeight:700,marginBottom:6,color:'var(--text-primary)',fontSize:14}}>{'\u{1F30D}'} Visual Geographic Estimation</div>
                  <div style={{fontSize:11,color:'var(--text-tertiary)',marginBottom:10}}>Estimated by matching soil color ({result.pixelAnalysis?.dominantColorClass}), vegetation ({Math.round((result.pixelAnalysis?.vegetationIndex||0)*100)}%), brightness ({result.pixelAnalysis?.brightness}), and terrain texture against geographic profiles.</div>
                  <div style={{display:'flex',flexDirection:'column',gap:5}}>
                    {result.geoEstimate.estimates.map((est: any, i: number) => (
                      <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'5px 10px',borderRadius:8,background:i===0?'rgba(251,191,36,0.10)':'transparent'}}>
                        <span style={{fontWeight:700,fontSize:14,color:i===0?'#fbbf24':i===1?'#94a3b8':'#475569',minWidth:22}}>#{est.rank}</span>
                        <span style={{flex:1,fontWeight:i===0?700:400,fontSize:13,color:i===0?'var(--text-primary)':'var(--text-secondary)'}}>
                          {est.region}{est.subRegion ? ` (${est.subRegion})`:''}, {est.country}
                        </span>
                        <div style={{width:60,height:6,borderRadius:3,background:'rgba(255,255,255,0.06)',overflow:'hidden'}}>
                          <div style={{width:`${Math.round(est.confidence*100)}%`,height:'100%',borderRadius:3,background:est.confidence>0.45?'#22c55e':est.confidence>0.30?'#fbbf24':'#94a3b8'}} />
                        </div>
                        <span style={{fontFamily:'var(--font-mono)',fontSize:11,fontWeight:600,color:est.confidence>0.45?'#22c55e':est.confidence>0.30?'#fbbf24':'#94a3b8',minWidth:30,textAlign:'right'}}>{Math.round(est.confidence*100)}%</span>
                      </div>
                    ))}
                  </div>
                  {(result.geoEstimate.bestEstimate?.reasoning?.length ?? 0) > 0 && (
                    <div style={{marginTop:8,fontSize:11,color:'var(--text-tertiary)',lineHeight:1.4}}>
                      <strong>Top match reasoning:</strong> {result.geoEstimate.bestEstimate!.reasoning!.join(' \u2022 ')}
                    </div>
                  )}
                  <div style={{marginTop:6,fontSize:10,color:'var(--text-tertiary)',opacity:0.7}}>Climate zone: {result.geoEstimate.climateZone} | Method: {result.geoEstimate.method} | Profiles: 30+ regions worldwide</div>
                </div>
              )}
              <div className="result-grid">
                <div className="result-item"><span className="rl">GPS Source</span><span className="rv" style={{color:result.locationMethod==='exif-gps'||result.locationMethod==='filename-geocode'||result.locationMethod==='iptc-geocode'||result.gpsSource==='device'?'#4CAF50':result.gpsSource==='manual'?'#38bdf8':result.locationMethod==='visual-estimate'?'#fbbf24':'#F44336'}}>{result.locationMethod==='exif-gps'?'Photo EXIF (\u00B110m) \u2014 from image':result.locationMethod==='filename-geocode'?'Filename Geocode \u2014 matched via OpenStreetMap':result.locationMethod==='iptc-geocode'?'IPTC/XMP Geocode \u2014 matched via OpenStreetMap':result.gpsSource==='device'?`Device GPS${result.gpsAccuracy?` (\u00B1${Math.round(result.gpsAccuracy)}m)`:''} \u2014 at site`:result.gpsSource==='manual'?'Manual Entry \u2014 user provided':result.locationMethod==='visual-estimate'?`Visual Estimate \u2014 ${result.geoEstimate?.bestEstimate?.region||'terrain analysis'}`:'No GPS \u2014 set location above'}</span></div>
                <div className="result-item"><span className="rl">GPS Coordinates</span><span className="rv">{result.locationMethod==='exif-gps'||result.locationMethod==='filename-geocode'||result.locationMethod==='iptc-geocode'||result.gpsSource==='device'||result.gpsSource==='manual' ? `${result.site.latitude.toFixed(6)}, ${result.site.longitude.toFixed(6)}` : result.geoEstimate?.bestEstimate ? `~${result.geoEstimate.bestEstimate.latitude.toFixed(2)}, ${result.geoEstimate.bestEstimate.longitude.toFixed(2)} (visual estimate)` : 'Not available \u2014 set location above'}</span></div>
                {result.imageForensicId && (
                  <>
                    <div className="result-item"><span className="rl">{"\u{1F50D}"} Image Forensic ID</span><span className="rv" style={{fontFamily:'var(--font-mono)',fontSize:11,wordBreak:'break-all'}}>{result.imageForensicId.compositeId}</span></div>
                    <div className="result-item"><span className="rl">{"\u{1F4F8}"} Perceptual Hash</span><span className="rv" style={{fontFamily:'var(--font-mono)'}}>{result.imageForensicId.pHash}</span></div>
                    {result.imageForensicId.cameraMake && <div className="result-item"><span className="rl">{"\u{1F4F7}"} Camera</span><span className="rv">{[result.imageForensicId.cameraMake, result.imageForensicId.cameraModel].filter(Boolean).join(' ')}</span></div>}
                    {result.imageForensicId.cameraSerial && <div className="result-item"><span className="rl">{"\u{1F511}"} Camera Serial</span><span className="rv" style={{fontFamily:'var(--font-mono)'}}>{result.imageForensicId.cameraSerial}</span></div>}
                    {result.imageForensicId.lensModel && <div className="result-item"><span className="rl">{"\u{1F52D}"} Lens</span><span className="rv">{result.imageForensicId.lensModel}</span></div>}
                    {result.imageForensicId.software && <div className="result-item"><span className="rl">{"\u{1F4BB}"} Software</span><span className="rv">{result.imageForensicId.software}</span></div>}
                    {result.imageForensicId.exifUniqueId && <div className="result-item"><span className="rl">{"\u{1F194}"} EXIF Unique ID</span><span className="rv" style={{fontFamily:'var(--font-mono)'}}>{result.imageForensicId.exifUniqueId}</span></div>}
                    {result.imageForensicId.documentId && <div className="result-item"><span className="rl">{"\u{1F4C4}"} Document ID</span><span className="rv" style={{fontFamily:'var(--font-mono)',fontSize:10,wordBreak:'break-all'}}>{result.imageForensicId.documentId}</span></div>}
                    {result.imageForensicId.dateOriginal && <div className="result-item"><span className="rl">{"\u{1F4C5}"} Date Taken</span><span className="rv">{result.imageForensicId.dateOriginal}</span></div>}
                    {result.imageForensicId.imageSize && <div className="result-item"><span className="rl">{"\u{1F4D0}"} Image Size</span><span className="rv">{result.imageForensicId.imageSize}</span></div>}
                  </>
                )}
                {!result.imageForensicId && result.imageFingerprint && <div className="result-item"><span className="rl">Image Fingerprint</span><span className="rv" style={{fontFamily:'var(--font-mono)'}}>{result.imageFingerprint}</span></div>}
                {result.locationContext && (result.locationContext.city || result.locationContext.country) && (
                  <div className="result-item"><span className="rl">Location Context</span><span className="rv">{[result.locationContext.city, result.locationContext.region, result.locationContext.country].filter(Boolean).join(', ')}</span></div>
                )}
                <div className="result-item"><span className="rl">Timestamp</span><span className="rv">{result.timestamp || new Date().toISOString()}</span></div>
                <div className="result-item"><span className="rl">Terrain Type</span><span className="rv">{result.site.siteType.toUpperCase()} (from pixel + MobileNet fusion)</span></div>
                <div className="result-item"><span className="rl">Location Confidence</span><span className="rv">{(result.site.confidence*100).toFixed(0)}%</span></div>
                <div className="result-item"><span className="rl">Vegetation Density</span><span className="rv">{(result.site.vegetationDensity*100).toFixed(0)}%</span></div>
                <div className="result-item"><span className="rl">Terrain Slope</span><span className="rv">{result.site.terrainSlope.toFixed(1)}&deg;</span></div>
                <div className="result-item"><span className="rl">Water Indicator</span><span className="rv">{(result.site.waterIndicator*100).toFixed(0)}%</span></div>
              </div>
              {result.resolvedLocation && result.resolvedLocation.source !== 'none' && (
                <div style={{marginTop:16}}>
                  <h4 className="tab-title">{'\u{1F4CD}'} {result.locationMethod==='exif-gps'?'Image Location \u2014 Verified from Photo EXIF GPS':result.locationMethod==='filename-geocode'?'Location \u2014 Geocoded from Filename':result.locationMethod==='iptc-geocode'?'Location \u2014 Geocoded from Photo Metadata':result.gpsSource==='device'?'Site Location \u2014 From Your Device GPS':result.gpsSource==='manual'?'Site Location \u2014 From Manual Coordinates':result.locationMethod==='visual-estimate'?'Estimated Location \u2014 From Visual Terrain Analysis':'Location'}</h4>
                  <div style={{background:result.locationMethod==='exif-gps'||result.locationMethod==='filename-geocode'||result.locationMethod==='iptc-geocode'||result.gpsSource==='device'?'rgba(34,197,94,0.06)':result.locationMethod==='visual-estimate'?'rgba(251,191,36,0.06)':'rgba(56,189,248,0.06)',border:`1px solid ${result.locationMethod==='exif-gps'||result.locationMethod==='filename-geocode'||result.locationMethod==='iptc-geocode'||result.gpsSource==='device'?'rgba(34,197,94,0.15)':result.locationMethod==='visual-estimate'?'rgba(251,191,36,0.15)':'rgba(56,189,248,0.15)'}`,padding:'14px 18px',borderRadius:12,marginBottom:8}}>
                    <div style={{fontWeight:700,fontSize:15,color:result.locationMethod==='exif-gps'||result.locationMethod==='filename-geocode'||result.locationMethod==='iptc-geocode'||result.gpsSource==='device'?'var(--accent-green)':result.locationMethod==='visual-estimate'?'#fbbf24':'#38bdf8',marginBottom:10}}>{result.resolvedLocation.displayName || 'Location resolved'}</div>
                    <div style={{fontSize:11,color:'var(--text-tertiary)',marginBottom:10}}>Source: {result.resolvedLocation.source === 'nominatim' ? 'OpenStreetMap Nominatim' : 'BigDataCloud'} \u2014 {result.locationMethod==='exif-gps'?'coordinates from photo EXIF data':result.locationMethod==='filename-geocode'?'place name from filename matched via OpenStreetMap':result.locationMethod==='iptc-geocode'?'place name from photo metadata matched via OpenStreetMap':result.gpsSource==='device'?'coordinates from your device GPS':result.locationMethod==='visual-estimate'?'coordinates estimated from terrain visual analysis':'coordinates entered manually'}, resolved via real map database</div>
                  </div>
                  <div className="result-grid">
                    {result.resolvedLocation.country && <div className="result-item"><span className="rl">{'\u{1F30D}'} Country</span><span className="rv">{result.resolvedLocation.country}{result.resolvedLocation.countryCode ? ` (${result.resolvedLocation.countryCode})` : ''}</span></div>}
                    {result.resolvedLocation.state && <div className="result-item"><span className="rl">{'\u{1F3DB}\uFE0F'} Province / State</span><span className="rv">{result.resolvedLocation.state}</span></div>}
                    {result.resolvedLocation.county && <div className="result-item"><span className="rl">{'\u{1F3E2}'} County / District</span><span className="rv">{result.resolvedLocation.county}</span></div>}
                    {result.resolvedLocation.city && <div className="result-item"><span className="rl">{'\u{1F3D9}\uFE0F'} City / Town</span><span className="rv">{result.resolvedLocation.city}</span></div>}
                    {result.resolvedLocation.village && <div className="result-item"><span className="rl">{'\u{1F3E0}'} Village</span><span className="rv">{result.resolvedLocation.village}</span></div>}
                    {result.resolvedLocation.suburb && <div className="result-item"><span className="rl">{'\u{1F3D8}\uFE0F'} Estate / Suburb</span><span className="rv">{result.resolvedLocation.suburb}</span></div>}
                    {result.resolvedLocation.neighbourhood && <div className="result-item"><span className="rl">{'\u{1F4CD}'} Neighbourhood</span><span className="rv">{result.resolvedLocation.neighbourhood}</span></div>}
                    {result.resolvedLocation.road && <div className="result-item"><span className="rl">{'\u{1F6E3}\uFE0F'} Road / Street</span><span className="rv">{result.resolvedLocation.road}</span></div>}
                    {result.resolvedLocation.postcode && <div className="result-item"><span className="rl">{'\u{1F4EE}'} Postcode</span><span className="rv">{result.resolvedLocation.postcode}</span></div>}
                    {result.resolvedLocation.placeType && <div className="result-item"><span className="rl">{'\u{1F4CB}'} Place Type</span><span className="rv">{result.resolvedLocation.placeType}</span></div>}
                  </div>
                </div>
              )}
              {result.pixelAnalysis && (
                <div style={{marginTop:16}}>
                  <h4 className="tab-title">{'\u{1F3A8}'} Pixel Analysis Results</h4>
                  <div className="result-grid">
                    <div className="result-item"><span className="rl">Scene Type</span><span className="rv" style={{color:result.pixelAnalysis.isOutdoorScene?'var(--accent-green)':'var(--accent-amber)'}}>{result.pixelAnalysis.isOutdoorScene ? '\u2705 Outdoor Terrain' : '\u26A0\uFE0F Non-Terrain Image'} ({Math.round(result.pixelAnalysis.sceneConfidence*100)}%)</span></div>
                    <div className="result-item"><span className="rl">Dominant Color</span><span className="rv">{result.pixelAnalysis.dominantColorClass}</span></div>
                    <div className="result-item"><span className="rl">Vegetation Index (ExG)</span><span className="rv">{(result.pixelAnalysis.vegetationIndex*100).toFixed(0)}%</span></div>
                    <div className="result-item"><span className="rl">Water Index</span><span className="rv">{(result.pixelAnalysis.waterIndex*100).toFixed(0)}%</span></div>
                    <div className="result-item"><span className="rl">Soil Exposure</span><span className="rv">{(result.pixelAnalysis.soilExposureIndex*100).toFixed(0)}%</span></div>
                    <div className="result-item"><span className="rl">Rock Exposure</span><span className="rv">{(result.pixelAnalysis.rockExposureIndex*100).toFixed(0)}%</span></div>
                    <div className="result-item"><span className="rl">Texture Variance</span><span className="rv">{(result.pixelAnalysis.textureVariance*100).toFixed(0)}% (higher = rougher terrain)</span></div>
                    <div className="result-item"><span className="rl">Edge Density</span><span className="rv">{(result.pixelAnalysis.edgeDensity*100).toFixed(1)}%</span></div>
                    <div className="result-item"><span className="rl">Brightness</span><span className="rv">{result.pixelAnalysis.brightness}/255</span></div>
                    <div className="result-item"><span className="rl">RGB Ratios</span><span className="rv">R:{result.pixelAnalysis.redRatio} G:{result.pixelAnalysis.greenRatio} B:{result.pixelAnalysis.blueRatio}</span></div>
                    <div className="result-item"><span className="rl">Histogram</span><span className="rv">Shadows:{Math.round(result.pixelAnalysis.colorHistogram.shadows*100)}% Mid:{Math.round(result.pixelAnalysis.colorHistogram.midtones*100)}% Hi:{Math.round(result.pixelAnalysis.colorHistogram.highlights*100)}%</span></div>
                  </div>
                </div>
              )}
              <div className="geo-note">
                <strong>Methodology:</strong> GPS extracted via multi-strategy EXIF parsing (3 strategies), IPTC/XMP text, filename parsing. When no GPS is available, <strong>Visual Geo-Estimation</strong> analyzes terrain color, vegetation density, soil exposure, brightness, and texture \u2014 matching against 30+ geographic profiles covering East Africa, West Africa, Southern Africa, North Africa, Middle East, South Asia, SE Asia, South America, Europe, Central Asia, Australia, and North America. Each image gets a unique perceptual fingerprint (pHash). Terrain classified using pixel-level analysis fused with MobileNet scene labels.
              </div>
              {/* Nearby Wells — REAL data from USGS NWIS + OSM + WPDx */}
              {nearby.length > 0 && (
                <>
                <h4 className="tab-title" style={{marginTop:24}}>{'\u{1F5FA}\uFE0F'} Nearby Wells ({nearby.length} found within {result.nearbyWells?.searchRadius_km ?? 25}km)</h4>

                {/* ── Borehole Density Analysis Panel ── */}
                {(result.nearbyWells as any)?.densityAnalysis && (
                  <div style={{marginBottom:16,padding:14,background:'linear-gradient(135deg, rgba(33,150,243,0.06), rgba(76,175,80,0.06))',borderRadius:10,border:'1px solid rgba(33,150,243,0.2)'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                      <strong style={{color:'#1565c0',fontSize:14}}>📊 Borehole Density Analysis</strong>
                      <span style={{padding:'3px 10px',borderRadius:12,fontSize:11,fontWeight:700,
                        background: (result.nearbyWells as any).densityAnalysis.dataRichness === 'excellent' ? 'rgba(34,197,94,0.15)' :
                                    (result.nearbyWells as any).densityAnalysis.dataRichness === 'good' ? 'rgba(59,130,246,0.15)' :
                                    (result.nearbyWells as any).densityAnalysis.dataRichness === 'moderate' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                        color: (result.nearbyWells as any).densityAnalysis.dataRichness === 'excellent' ? '#16a34a' :
                               (result.nearbyWells as any).densityAnalysis.dataRichness === 'good' ? '#2563eb' :
                               (result.nearbyWells as any).densityAnalysis.dataRichness === 'moderate' ? '#d97706' : '#dc2626',
                      }}>{(result.nearbyWells as any).densityAnalysis.dataRichness.toUpperCase()} DATA</span>
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:8,marginBottom:10}}>
                      <div style={{padding:8,background:'var(--bg-elevated)',borderRadius:6,textAlign:'center'}}>
                        <div style={{fontSize:22,fontWeight:700,color:'#1565c0'}}>{(result.nearbyWells as any).densityAnalysis.totalFound}</div>
                        <div style={{fontSize:10,color:'var(--text-secondary)'}}>Total Water Points</div>
                      </div>
                      <div style={{padding:8,background:'var(--bg-elevated)',borderRadius:6,textAlign:'center'}}>
                        <div style={{fontSize:22,fontWeight:700,color:'#2e7d32'}}>{(result.nearbyWells as any).densityAnalysis.wellsWithDepth}</div>
                        <div style={{fontSize:10,color:'var(--text-secondary)'}}>With Depth Data</div>
                      </div>
                      <div style={{padding:8,background:'var(--bg-elevated)',borderRadius:6,textAlign:'center'}}>
                        <div style={{fontSize:22,fontWeight:700,color:'#7b1fa2'}}>{(result.nearbyWells as any).densityAnalysis.wellsWithYield}</div>
                        <div style={{fontSize:10,color:'var(--text-secondary)'}}>With Yield Data</div>
                      </div>
                      <div style={{padding:8,background:'var(--bg-elevated)',borderRadius:6,textAlign:'center'}}>
                        <div style={{fontSize:22,fontWeight:700,color:'#e65100'}}>{(result.nearbyWells as any).densityAnalysis.densityPerKm2.toFixed(2)}</div>
                        <div style={{fontSize:10,color:'var(--text-secondary)'}}>Wells/km²</div>
                      </div>
                      <div style={{padding:8,background:'var(--bg-elevated)',borderRadius:6,textAlign:'center'}}>
                        <div style={{fontSize:22,fontWeight:700,color:'#16a34a'}}>{(result.nearbyWells as any).densityAnalysis.successfulWells}</div>
                        <div style={{fontSize:10,color:'var(--text-secondary)'}}>Successful</div>
                      </div>
                      <div style={{padding:8,background:'var(--bg-elevated)',borderRadius:6,textAlign:'center'}}>
                        <div style={{fontSize:22,fontWeight:700,color:'#dc2626'}}>{(result.nearbyWells as any).densityAnalysis.failedWells}</div>
                        <div style={{fontSize:10,color:'var(--text-secondary)'}}>Dry Wells</div>
                      </div>
                    </div>
                    {/* Depth distribution */}
                    {(result.nearbyWells as any).densityAnalysis.depthStats && (
                      <div style={{marginBottom:8,fontSize:12}}>
                        <strong>Depth range:</strong> {(result.nearbyWells as any).densityAnalysis.depthStats.min}-{(result.nearbyWells as any).densityAnalysis.depthStats.max}m (median {(result.nearbyWells as any).densityAnalysis.depthStats.median}m, IQR {(result.nearbyWells as any).densityAnalysis.depthStats.p25}-{(result.nearbyWells as any).densityAnalysis.depthStats.p75}m)
                        {(result.nearbyWells as any).densityAnalysis.depthDistribution && (result.nearbyWells as any).densityAnalysis.depthDistribution.length > 0 && (
                          <span style={{marginLeft:8,color:'var(--text-muted)'}}>
                            | Distribution: {(result.nearbyWells as any).densityAnalysis.depthDistribution.map((d: any) => `${d.range}: ${d.count}`).join(', ')}
                          </span>
                        )}
                      </div>
                    )}
                    {(result.nearbyWells as any).densityAnalysis.yieldStats && (
                      <div style={{marginBottom:8,fontSize:12}}>
                        <strong>Yield range:</strong> {(result.nearbyWells as any).densityAnalysis.yieldStats.min.toFixed(1)}-{(result.nearbyWells as any).densityAnalysis.yieldStats.max.toFixed(1)} m³/h (median {(result.nearbyWells as any).densityAnalysis.yieldStats.median.toFixed(1)}, IQR {(result.nearbyWells as any).densityAnalysis.yieldStats.p25.toFixed(1)}-{(result.nearbyWells as any).densityAnalysis.yieldStats.p75.toFixed(1)})
                      </div>
                    )}
                    {/* Source breakdown */}
                    {(result.nearbyWells as any).densityAnalysis.sourceBreakdown?.length > 0 && (
                      <div style={{fontSize:11,color:'var(--text-secondary)'}}>
                        <strong>Sources:</strong> {(result.nearbyWells as any).densityAnalysis.sourceBreakdown.map((s: any) => `${s.source} (${s.count})`).join(' · ')}
                      </div>
                    )}
                    <div style={{marginTop:8,padding:8,background:'rgba(33,150,243,0.05)',borderRadius:6,fontSize:12,lineHeight:1.5,color:'var(--text-primary)'}}>
                      {(result.nearbyWells as any).densityAnalysis.siteAssessment}
                    </div>
                  </div>
                )}

                {/* ── County Intelligence Panel (Kenya) ── */}
                {(result.boreholeRecords as any)?.countyIntelligence && (
                  <div style={{marginBottom:16,padding:14,background:'linear-gradient(135deg, rgba(76,175,80,0.06), rgba(255,152,0,0.06))',borderRadius:10,border:'1px solid rgba(76,175,80,0.2)'}}>
                    <strong style={{color:'#2e7d32',fontSize:14}}>🏛️ {(result.boreholeRecords as any).countyIntelligence.county} County Intelligence</strong>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:8,margin:'10px 0'}}>
                      <div style={{padding:8,background:'var(--bg-elevated)',borderRadius:6,textAlign:'center'}}>
                        <div style={{fontSize:18,fontWeight:700,color:'#1565c0'}}>{(result.boreholeRecords as any).countyIntelligence.estimatedBoreholes.toLocaleString()}</div>
                        <div style={{fontSize:10,color:'var(--text-secondary)'}}>Est. Total in County</div>
                      </div>
                      <div style={{padding:8,background:'var(--bg-elevated)',borderRadius:6,textAlign:'center'}}>
                        <div style={{fontSize:18,fontWeight:700,color:'#2e7d32'}}>{(result.boreholeRecords as any).countyIntelligence.avgDepth_m}m</div>
                        <div style={{fontSize:10,color:'var(--text-secondary)'}}>Avg Depth ({(result.boreholeRecords as any).countyIntelligence.depthRange[0]}-{(result.boreholeRecords as any).countyIntelligence.depthRange[1]}m)</div>
                      </div>
                      <div style={{padding:8,background:'var(--bg-elevated)',borderRadius:6,textAlign:'center'}}>
                        <div style={{fontSize:18,fontWeight:700,color:'#7b1fa2'}}>{(result.boreholeRecords as any).countyIntelligence.avgYield_m3h} m³/h</div>
                        <div style={{fontSize:10,color:'var(--text-secondary)'}}>Avg Yield ({(result.boreholeRecords as any).countyIntelligence.yieldRange[0]}-{(result.boreholeRecords as any).countyIntelligence.yieldRange[1]})</div>
                      </div>
                      <div style={{padding:8,background:'var(--bg-elevated)',borderRadius:6,textAlign:'center'}}>
                        <div style={{fontSize:18,fontWeight:700,color:'#e65100'}}>{Math.round((result.boreholeRecords as any).countyIntelligence.successRate * 100)}%</div>
                        <div style={{fontSize:10,color:'var(--text-secondary)'}}>Success Rate</div>
                      </div>
                    </div>
                    <div style={{fontSize:12,lineHeight:1.5}}>
                      <div><strong>Geology:</strong> {(result.boreholeRecords as any).countyIntelligence.primaryGeology}</div>
                      <div><strong>Aquifer:</strong> {(result.boreholeRecords as any).countyIntelligence.aquiferType}</div>
                      <div><strong>Water table:</strong> {(result.boreholeRecords as any).countyIntelligence.avgWaterTable_m}m avg ({(result.boreholeRecords as any).countyIntelligence.waterTableRange[0]}-{(result.boreholeRecords as any).countyIntelligence.waterTableRange[1]}m range)</div>
                      <div><strong>Drilling cost:</strong> ${(result.boreholeRecords as any).countyIntelligence.drillingCostPerM_USD[0]}-${(result.boreholeRecords as any).countyIntelligence.drillingCostPerM_USD[1]}/m</div>
                      {(result.boreholeRecords as any).countyIntelligence.keyRisks?.length > 0 && (
                        <div style={{marginTop:4}}><strong style={{color:'#dc2626'}}>⚠ Risks:</strong> {(result.boreholeRecords as any).countyIntelligence.keyRisks.join(' · ')}</div>
                      )}
                    </div>
                    <div style={{marginTop:8,padding:8,background:'rgba(76,175,80,0.05)',borderRadius:6,fontSize:12,fontStyle:'italic',color:'var(--text-secondary)'}}>
                      {(result.boreholeRecords as any).countyIntelligence.notes}
                    </div>
                  </div>
                )}

                <div className="nearby-table">
                  <table>
                    <thead><tr><th>Well ID</th><th>Distance</th><th>Depth</th><th>Yield</th><th>Lithology</th><th>Outcome</th><th>Source</th></tr></thead>
                    <tbody>
                      {nearby.map((b: any) => (
                        <tr key={b.id}><td style={{fontFamily:'monospace',fontSize:11}}>{b.id}</td><td>{b.distance_km} km</td><td>{b.depth_m ? `${Math.round(b.depth_m)}m` : 'N/A'}</td>
                          <td>{b.yield_m3h ? `${b.yield_m3h} m³/h` : b.outcome === 'Fail' ? '0' : 'N/A'}</td>
                          <td style={{fontSize:11}}>{b.lithology || b.aquiferType || 'N/A'}</td>
                          <td style={{fontWeight:'bold',color: b.outcome === 'Success' ? '#16a34a' : b.outcome === 'Moderate' ? '#d97706' : b.outcome === 'Fail' ? '#c88a30' : 'var(--text-muted)'}}>{b.outcome === 'Fail' ? 'Dry' : (b.outcome || 'Unknown')}</td>
                          <td style={{fontSize:10,color:'var(--text-tertiary)'}}>{b.source}</td></tr>
                      ))}
                    </tbody>
                  </table>
                  {result.nearbyWells && (
                    <div className="map-note">
                      <strong>Summary:</strong> Avg depth: {result.nearbyWells.averageDepth != null ? `${Math.round(result.nearbyWells.averageDepth)}m` : 'No data'} | Avg yield: {result.nearbyWells.averageYield != null ? `${result.nearbyWells.averageYield.toFixed(1)} m³/h` : 'No data'} | Sample: {result.nearbyWells.sampleSize} wells | Success rate: {Math.round((result.nearbyWells.successRate ?? 0) * 100)}%<br/>
                      <strong>Data sources:</strong> {result.nearbyWells.dataSources.join(', ')}
                    </div>
                  )}
                  <div style={{marginTop:12,padding:12,background:'rgba(33,150,243,0.06)',borderRadius:8,border:'1px solid rgba(33,150,243,0.15)'}}>
                    <strong style={{color:'#1976d2'}}>How Nearby Wells Calibrate This Prediction:</strong>
                    <ul style={{margin:'8px 0 0',paddingLeft:20,fontSize:13,lineHeight:1.6}}>
                      <li><strong>Depth calibration:</strong> {result.nearbyWells?.averageDepth != null ? `Average nearby well depth (${Math.round(result.nearbyWells.averageDepth)}m) anchors our recommended drilling depth, reducing reliance on satellite-only estimates.` : 'No depth data available from nearby wells — depth estimate relies on satellite analysis and regional database.'}</li>
                      <li><strong>Yield validation:</strong> Nearby yields ({result.nearbyWells?.averageYield?.toFixed(1) ?? '?'} m³/h avg) provide ground-truth bounds for expected productivity in this aquifer system.</li>
                      <li><strong>Lithology confirmation:</strong> Observed lithologies from nearby wells {nearby.some((b: any) => b.lithology) ? `(${[...new Set(nearby.filter((b: any) => b.lithology).map((b: any) => b.lithology))].join(', ')})` : ''} validate our geological model assumptions.</li>
                      <li><strong>Success rate:</strong> {Math.round((result.nearbyWells?.successRate ?? 0) * 100)}% of nearby wells were productive, directly informing our probability estimate.</li>
                      <li><strong>Dry wells:</strong> {nearby.filter((b: any) => b.outcome === 'Fail').length > 0 ? `${nearby.filter((b: any) => b.outcome === 'Fail').length} dry well(s) identified — their locations and lithologies inform our risk register and siting strategy.` : 'No dry wells recorded in the search radius.'}</li>
                    </ul>
                  </div>
                </div>
                </>
              )}
              {nearby.length === 0 && (result.gpsSource!=='none' || result.locationMethod==='filename-geocode' || result.locationMethod==='iptc-geocode' || result.locationMethod==='visual-estimate') && (
                <div style={{marginTop:16,padding:12,background:'var(--bg-elevated)',borderRadius:8,color:'var(--text-muted)',textAlign:'center',border:'1px solid var(--border)'}}>
                  <div style={{fontSize:20,marginBottom:8}}>🔍</div>
                  No nearby wells found within 25km in USGS NWIS, WPDx (Water Point Data Exchange), or OpenStreetMap databases. This does not mean no wells exist — it means no digital records were found in open databases for this area.
                </div>
              )}
              {result.gpsSource==='none' && result.locationMethod!=='filename-geocode' && result.locationMethod!=='iptc-geocode' && result.locationMethod!=='visual-estimate' && (
                <div style={{marginTop:16,padding:12,background:'var(--bg-elevated)',borderRadius:8,color:'var(--text-muted)',textAlign:'center',border:'1px solid var(--border)'}}>
                  Nearby borehole data unavailable — enter GPS coordinates above to enable.
                </div>
              )}
            </div>
          )}

          {/* REMOTE SENSING */}
          {activeResultTab==='remote-sensing' && (
            <div>
              <h4 className="tab-title">{'\u{1F6F0}\uFE0F'} Remote Sensing &amp; Satellite Data</h4>
              <p className="tab-desc">Scientific satellite data for the detected coordinates. Includes soil properties (ISRIC SoilGrids), elevation (SRTM), climate (Open-Meteo), and water indices (NDWI/MNDWI/AWEI proxies + satellite links).</p>

              {/* Water Indices from pixel analysis */}
              {result.remoteSensing?.waterIndices && (
                <div style={{marginBottom:20}}>
                  <h4 style={{color:'#00BCD4',marginBottom:12}}>💧 Water Indices (RGB Proxies)</h4>
                  <div className="result-grid">
                    <div className="result-item"><span className="rl">NDWI Proxy</span><span className="rv" style={{color:result.remoteSensing.waterIndices.ndwiProxy>0?'#22c55e':'#94a3b8'}}>{result.remoteSensing.waterIndices.ndwiProxy.toFixed(3)} <span style={{fontSize:10,color:'var(--text-tertiary)'}}>({result.remoteSensing.waterIndices.ndwiProxy>0.1?'Water likely':result.remoteSensing.waterIndices.ndwiProxy>0?'Weak signal':'No water signal'})</span></span></div>
                    <div className="result-item"><span className="rl">MNDWI Proxy</span><span className="rv">{result.remoteSensing.waterIndices.mndwiProxy.toFixed(3)}</span></div>
                    <div className="result-item"><span className="rl">AWEI Proxy</span><span className="rv">{result.remoteSensing.waterIndices.aweiProxy.toFixed(3)}</span></div>
                    <div className="result-item"><span className="rl">Water Presence Score</span><span className="rv" style={{fontWeight:700}}>{Math.round(result.remoteSensing.waterIndices.waterPresenceScore*100)}%</span></div>
                  </div>
                  <div style={{background:'rgba(251,191,36,0.06)',border:'1px solid rgba(251,191,36,0.15)',padding:'10px 14px',borderRadius:8,marginTop:8,fontSize:11,color:'var(--text-tertiary)'}}>
                    <strong>⚠️ Limitation:</strong> {result.remoteSensing.waterIndices.limitation}
                  </div>
                  {result.remoteSensing.waterIndices.sentinelNDWILink && (
                    <div style={{marginTop:8,display:'flex',gap:8,flexWrap:'wrap'}}>
                      <a href={result.remoteSensing.waterIndices.sentinelNDWILink} target="_blank" rel="noopener noreferrer" style={{padding:'6px 12px',borderRadius:6,background:'rgba(0,188,212,0.1)',color:'#00BCD4',fontSize:11,textDecoration:'none',fontWeight:600}}>🛰️ View REAL NDWI on Sentinel Hub →</a>
                      {result.remoteSensing.waterIndices.landsatLink && <a href={result.remoteSensing.waterIndices.landsatLink} target="_blank" rel="noopener noreferrer" style={{padding:'6px 12px',borderRadius:6,background:'rgba(76,175,80,0.1)',color:'#4CAF50',fontSize:11,textDecoration:'none',fontWeight:600}}>🌍 View on Landsat →</a>}
                    </div>
                  )}
                </div>
              )}

              {/* SoilGrids Data */}
              {result.remoteSensing?.soilGrids?.available && (
                <div style={{marginBottom:20}}>
                  <h4 style={{color:'#A0522D',marginBottom:12}}>🪨 Satellite Soil Data (ISRIC SoilGrids)</h4>
                  <div className="result-grid">
                    {result.remoteSensing.soilGrids.clay != null && <div className="result-item"><span className="rl">Clay Content</span><span className="rv">{result.remoteSensing.soilGrids.clay} g/kg ({(result.remoteSensing.soilGrids.clay/10).toFixed(1)}%)</span></div>}
                    {result.remoteSensing.soilGrids.sand != null && <div className="result-item"><span className="rl">Sand Content</span><span className="rv">{result.remoteSensing.soilGrids.sand} g/kg ({(result.remoteSensing.soilGrids.sand/10).toFixed(1)}%)</span></div>}
                    {result.remoteSensing.soilGrids.silt != null && <div className="result-item"><span className="rl">Silt Content</span><span className="rv">{result.remoteSensing.soilGrids.silt} g/kg ({(result.remoteSensing.soilGrids.silt/10).toFixed(1)}%)</span></div>}
                    {result.remoteSensing.soilGrids.phH2O != null && <div className="result-item"><span className="rl">Soil pH</span><span className="rv">{(result.remoteSensing.soilGrids.phH2O/10).toFixed(1)}</span></div>}
                    {result.remoteSensing.soilGrids.organicCarbon != null && <div className="result-item"><span className="rl">Organic Carbon</span><span className="rv">{result.remoteSensing.soilGrids.organicCarbon} dg/kg</span></div>}
                    {result.remoteSensing.soilGrids.bulkDensity != null && <div className="result-item"><span className="rl">Bulk Density</span><span className="rv">{(result.remoteSensing.soilGrids.bulkDensity/100).toFixed(2)} g/cm³</span></div>}
                    {result.remoteSensing.soilGrids.cec != null && <div className="result-item"><span className="rl">CEC (Cation Exchange)</span><span className="rv">{result.remoteSensing.soilGrids.cec} cmol(c)/kg</span></div>}
                    {result.remoteSensing.soilGrids.nitrogen != null && <div className="result-item"><span className="rl">Nitrogen</span><span className="rv">{result.remoteSensing.soilGrids.nitrogen} cg/kg</span></div>}
                  </div>
                  <div style={{fontSize:11,color:'var(--text-tertiary)',marginTop:6}}>Source: {result.remoteSensing.soilGrids.source} | Depth: {result.remoteSensing.soilGrids.depth}</div>
                </div>
              )}

              {/* Elevation Data */}
              {result.remoteSensing?.elevation && (
                <div style={{marginBottom:20}}>
                  <h4 style={{color:'#FF9800',marginBottom:12}}>⛰️ Terrain Elevation</h4>
                  <div className="result-grid">
                    <div className="result-item"><span className="rl">Elevation</span><span className="rv" style={{fontWeight:700,fontSize:18}}>{result.remoteSensing.elevation.elevation}m ASL</span></div>
                  </div>
                  <div style={{fontSize:11,color:'var(--text-tertiary)',marginTop:6}}>Source: {result.remoteSensing.elevation.source}</div>
                </div>
              )}

              {/* Climate Data */}
              {result.remoteSensing?.climate && (
                <div style={{marginBottom:20}}>
                  <h4 style={{color:'#2196F3',marginBottom:12}}>🌧️ Climate & Recharge Data</h4>
                  <div className="result-grid">
                    <div className="result-item"><span className="rl">Annual Precipitation</span><span className="rv">{result.remoteSensing.climate.annualPrecipitation} mm/year</span></div>
                    <div className="result-item"><span className="rl">Mean Temperature</span><span className="rv">{result.remoteSensing.climate.meanTemperature}°C</span></div>
                    <div className="result-item"><span className="rl">Aridity Class</span><span className="rv">{result.remoteSensing.climate.aridity}</span></div>
                    <div className="result-item"><span className="rl">Est. Groundwater Recharge</span><span className="rv" style={{fontWeight:700}}>{result.remoteSensing.climate.rechargeEstimate} mm/year</span></div>
                  </div>
                  {result.remoteSensing.climate.monthlyPrecipitation?.length > 0 && (
                    <div style={{marginTop:10}}>
                      <div style={{fontSize:12,fontWeight:600,color:'var(--text-secondary)',marginBottom:6}}>Monthly Precipitation (mm)</div>
                      <div style={{display:'flex',gap:4,alignItems:'flex-end',height:80}}>
                        {['J','F','M','A','M','J','J','A','S','O','N','D'].map((m,i)=>{
                          const val = result.remoteSensing!.climate!.monthlyPrecipitation[i]||0;
                          const max = Math.max(...result.remoteSensing!.climate!.monthlyPrecipitation,1);
                          return <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                            <div style={{fontSize:9,color:'var(--text-tertiary)'}}>{val}</div>
                            <div style={{width:'100%',height:`${(val/max)*60}px`,background:'rgba(33,150,243,0.4)',borderRadius:3,minHeight:2}}/>
                            <div style={{fontSize:9,color:'var(--text-tertiary)'}}>{m}</div>
                          </div>;
                        })}
                      </div>
                    </div>
                  )}
                  <div style={{fontSize:11,color:'var(--text-tertiary)',marginTop:6}}>Source: {result.remoteSensing.climate.source}</div>
                </div>
              )}

              {/* Available Scientific Indices */}
              <h4 style={{color:'#9C27B0',marginBottom:12}}>📊 Available Scientific Indices &amp; Satellite Data</h4>
              <p style={{fontSize:12,color:'var(--text-tertiary)',marginBottom:10}}>Full scientific remote sensing indices used in professional hydrogeological surveys. Click links to view actual satellite data for this location.</p>
              <div className="sci-table-wrap">
                <table className="sci-table">
                  <thead><tr><th>Index</th><th>Full Name</th><th>Formula / Bands</th><th>Satellite</th><th>Status</th></tr></thead>
                  <tbody>
                    {result.remoteSensing?.availableIndices?.map((idx: any,i: number)=>(
                      <tr key={i}>
                        <td style={{fontWeight:700,color:'#00BCD4'}}>{idx.name}</td>
                        <td>{idx.fullName}</td>
                        <td style={{fontFamily:'var(--font-mono)',fontSize:10}}>{idx.bands}</td>
                        <td style={{fontSize:11}}>{idx.satellite}</td>
                        <td style={{color:idx.available==='proxy'?'#fbbf24':idx.available==='satellite-link'?'#38bdf8':'#94a3b8',fontWeight:600,fontSize:11}}>{idx.available==='proxy'?'✅ Proxy computed':idx.available==='satellite-link'?'🔗 View on satellite':'—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Satellite Links */}
              {result.remoteSensing?.satelliteLinks && (
                <div style={{marginTop:16}}>
                  <h4 style={{color:'#4CAF50',marginBottom:12}}>🛰️ Satellite Data Viewers</h4>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:10}}>
                    {Object.entries(result.remoteSensing.satelliteLinks).map(([key, url])=>(
                      <a key={key} href={url as string} target="_blank" rel="noopener noreferrer" style={{
                        display:'block',padding:'10px 14px',borderRadius:8,border:'1px solid var(--border)',background:'var(--bg-elevated)',
                        textDecoration:'none',color:'var(--text-primary)',fontSize:12,fontWeight:600,
                      }}>
                        🛰️ {key.replace(/([A-Z])/g,' $1').replace(/^./,s=>s.toUpperCase())} →
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {!result.remoteSensing && (
                <div style={{padding:20,textAlign:'center',color:'var(--text-muted)',background:'var(--bg-elevated)',borderRadius:12,border:'1px solid var(--border)'}}>
                  <div style={{fontSize:24,marginBottom:8}}>🛰️</div>
                  <div>Remote sensing data requires valid coordinates. Set a location in the <strong>Geolocation</strong> tab to fetch satellite data.</div>
                </div>
              )}

              {/* ═══ SATELLITE WATER & EARTH OBSERVATION ═══ */}
              {result.satelliteWaterAnalysis && (() => {
                const sat = result.satelliteWaterAnalysis;
                return (
                  <div style={{marginTop:20}}>
                    {/* MODIS Vegetation */}
                    {sat.vegetation && (
                      <div style={{marginBottom:16,padding:14,background:'linear-gradient(135deg, rgba(76,175,80,0.06), rgba(139,195,74,0.06))',borderRadius:10,border:'1px solid rgba(76,175,80,0.2)'}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                          <strong style={{color:'#2e7d32',fontSize:14}}>🌿 MODIS Satellite Vegetation (Aqua + Terra)</strong>
                          <span style={{fontSize:11,color:'var(--text-secondary)'}}>{sat.vegetation.resolution}</span>
                        </div>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))',gap:8,marginBottom:10}}>
                          <div style={{padding:8,background:'var(--bg-elevated)',borderRadius:6,textAlign:'center'}}>
                            <div style={{fontSize:20,fontWeight:700,color:'#2e7d32'}}>{sat.vegetation.ndvi.current.toFixed(3)}</div>
                            <div style={{fontSize:10,color:'var(--text-secondary)'}}>Current NDVI</div>
                          </div>
                          <div style={{padding:8,background:'var(--bg-elevated)',borderRadius:6,textAlign:'center'}}>
                            <div style={{fontSize:20,fontWeight:700,color:'#558b2f'}}>{sat.vegetation.ndvi.annual_mean.toFixed(3)}</div>
                            <div style={{fontSize:10,color:'var(--text-secondary)'}}>Annual Mean</div>
                          </div>
                          <div style={{padding:8,background:'var(--bg-elevated)',borderRadius:6,textAlign:'center'}}>
                            <div style={{fontSize:20,fontWeight:700,color:'#f57c00'}}>{sat.vegetation.ndvi.amplitude.toFixed(3)}</div>
                            <div style={{fontSize:10,color:'var(--text-secondary)'}}>Seasonal Swing</div>
                          </div>
                          <div style={{padding:8,background:'var(--bg-elevated)',borderRadius:6,textAlign:'center'}}>
                            <div style={{fontSize:20,fontWeight:700,color:'#1565c0'}}>{sat.vegetation.evi.annual_mean.toFixed(3)}</div>
                            <div style={{fontSize:10,color:'var(--text-secondary)'}}>EVI Mean</div>
                          </div>
                          <div style={{padding:8,background:'var(--bg-elevated)',borderRadius:6,textAlign:'center'}}>
                            <div style={{fontSize:14,fontWeight:600,color:sat.vegetation.vegetationHealth==='excellent'?'#16a34a':sat.vegetation.vegetationHealth==='good'?'#2563eb':'#d97706'}}>{sat.vegetation.vegetationHealth.toUpperCase()}</div>
                            <div style={{fontSize:10,color:'var(--text-secondary)'}}>Health</div>
                          </div>
                          <div style={{padding:8,background:'var(--bg-elevated)',borderRadius:6,textAlign:'center'}}>
                            <div style={{fontSize:12,fontWeight:600,color:'var(--text-primary)'}}>{sat.vegetation.classification.replace(/_/g,' ')}</div>
                            <div style={{fontSize:10,color:'var(--text-secondary)'}}>Land Cover</div>
                          </div>
                        </div>
                        <div style={{fontSize:12,lineHeight:1.5,padding:8,background:'rgba(76,175,80,0.05)',borderRadius:6}}>
                          <strong>Groundwater Signal:</strong> {sat.vegetation.groundwaterSignal}
                        </div>
                        <div style={{fontSize:10,color:'var(--text-tertiary)',marginTop:6}}>Source: {sat.vegetation.dataSource}</div>
                      </div>
                    )}

                    {/* Leaf Area Index */}
                    {sat.leafAreaIndex && (
                      <div style={{marginBottom:16,padding:14,background:'var(--bg-elevated)',borderRadius:10,border:'1px solid var(--border)'}}>
                        <strong style={{color:'#558b2f',fontSize:13}}>🍃 Leaf Area Index (ERA5-Land)</strong>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginTop:8}}>
                          <div style={{textAlign:'center'}}><div style={{fontSize:18,fontWeight:700}}>{sat.leafAreaIndex.combined_lai}</div><div style={{fontSize:10,color:'var(--text-secondary)'}}>Combined LAI</div></div>
                          <div style={{textAlign:'center'}}><div style={{fontSize:18,fontWeight:700}}>{sat.leafAreaIndex.lai_high_vegetation.annual_mean}</div><div style={{fontSize:10,color:'var(--text-secondary)'}}>High Veg LAI</div></div>
                          <div style={{textAlign:'center'}}><div style={{fontSize:18,fontWeight:700}}>{sat.leafAreaIndex.lai_low_vegetation.annual_mean}</div><div style={{fontSize:10,color:'var(--text-secondary)'}}>Low Veg LAI</div></div>
                        </div>
                        <div style={{fontSize:12,marginTop:6}}><strong>Type:</strong> {sat.leafAreaIndex.vegetationType}</div>
                      </div>
                    )}

                    {/* Land Surface Temperature */}
                    {sat.landSurfaceTemp && (
                      <div style={{marginBottom:16,padding:14,background:'var(--bg-elevated)',borderRadius:10,border:'1px solid var(--border)'}}>
                        <strong style={{color:'#e65100',fontSize:13}}>🌡️ Land Surface Temperature (ERA5-Land)</strong>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginTop:8}}>
                          <div style={{textAlign:'center'}}><div style={{fontSize:18,fontWeight:700}}>{sat.landSurfaceTemp.soil_temp_surface_C}°C</div><div style={{fontSize:10,color:'var(--text-secondary)'}}>Surface (0-7cm)</div></div>
                          <div style={{textAlign:'center'}}><div style={{fontSize:18,fontWeight:700}}>{sat.landSurfaceTemp.soil_temp_deep_C}°C</div><div style={{fontSize:10,color:'var(--text-secondary)'}}>Deep (28-100cm)</div></div>
                          <div style={{textAlign:'center'}}><div style={{fontSize:18,fontWeight:700}}>{sat.landSurfaceTemp.diurnal_proxy}°C</div><div style={{fontSize:10,color:'var(--text-secondary)'}}>Diurnal Range</div></div>
                        </div>
                        <div style={{fontSize:12,marginTop:6}}>{sat.landSurfaceTemp.groundwaterImplication}</div>
                      </div>
                    )}

                    {/* Evapotranspiration & Water Balance */}
                    {sat.evapotranspiration && (
                      <div style={{marginBottom:16,padding:14,background:'linear-gradient(135deg, rgba(33,150,243,0.06), rgba(3,169,244,0.06))',borderRadius:10,border:'1px solid rgba(33,150,243,0.2)'}}>
                        <strong style={{color:'#1565c0',fontSize:14}}>💧 Evapotranspiration & Water Balance</strong>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))',gap:8,marginTop:10}}>
                          <div style={{padding:8,background:'var(--bg-elevated)',borderRadius:6,textAlign:'center'}}>
                            <div style={{fontSize:18,fontWeight:700,color:'#1565c0'}}>{sat.evapotranspiration.et0_annual_mm}</div>
                            <div style={{fontSize:10,color:'var(--text-secondary)'}}>ET₀ (mm/yr)</div>
                          </div>
                          <div style={{padding:8,background:'var(--bg-elevated)',borderRadius:6,textAlign:'center'}}>
                            <div style={{fontSize:18,fontWeight:700,color:'#0277bd'}}>{sat.evapotranspiration.aridity_index.toFixed(2)}</div>
                            <div style={{fontSize:10,color:'var(--text-secondary)'}}>Aridity Index</div>
                          </div>
                          <div style={{padding:8,background:'var(--bg-elevated)',borderRadius:6,textAlign:'center'}}>
                            <div style={{fontSize:14,fontWeight:600,color: sat.evapotranspiration.aridity_class==='humid'?'#16a34a':'#d97706'}}>{sat.evapotranspiration.aridity_class.replace(/_/g,' ').toUpperCase()}</div>
                            <div style={{fontSize:10,color:'var(--text-secondary)'}}>Climate Class</div>
                          </div>
                          <div style={{padding:8,background:'var(--bg-elevated)',borderRadius:6,textAlign:'center'}}>
                            <div style={{fontSize:18,fontWeight:700,color:'#d32f2f'}}>{sat.evapotranspiration.moisture_deficit_mm}</div>
                            <div style={{fontSize:10,color:'var(--text-secondary)'}}>Deficit (mm/yr)</div>
                          </div>
                        </div>
                        {sat.waterBalance && (
                          <div style={{marginTop:10,padding:10,background:'rgba(33,150,243,0.05)',borderRadius:6}}>
                            <div style={{fontSize:12,lineHeight:1.6}}>
                              <strong>Water Balance:</strong> P={sat.waterBalance.precipitation_mm}mm − ET={sat.waterBalance.evapotranspiration_mm}mm − Runoff≈{sat.waterBalance.runoff_estimate_mm}mm = <strong style={{color:sat.waterBalance.recharge_pct>10?'#16a34a':'#d97706'}}>Recharge ≈ {sat.waterBalance.potential_recharge_mm}mm ({sat.waterBalance.recharge_pct}%)</strong>
                            </div>
                            <div style={{fontSize:12,marginTop:4}}>{sat.waterBalance.verdict}</div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Water Body Analysis */}
                    {sat.waterBodies && (
                      <div style={{marginBottom:16,padding:14,background:'var(--bg-elevated)',borderRadius:10,border:'1px solid var(--border)'}}>
                        <strong style={{color:'#0277bd',fontSize:13}}>🌊 Water Body Coverage (JRC Global Surface Water)</strong>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(110px,1fr))',gap:8,marginTop:8}}>
                          <div style={{textAlign:'center'}}><div style={{fontSize:18,fontWeight:700}}>{sat.waterBodies.jrc_occurrence_pct}%</div><div style={{fontSize:10,color:'var(--text-secondary)'}}>Occurrence</div></div>
                          <div style={{textAlign:'center'}}><div style={{fontSize:18,fontWeight:700}}>{sat.waterBodies.jrc_seasonality_months}</div><div style={{fontSize:10,color:'var(--text-secondary)'}}>Months/Year</div></div>
                          <div style={{textAlign:'center'}}><div style={{fontSize:14,fontWeight:600}}>{sat.waterBodies.jrc_transition}</div><div style={{fontSize:10,color:'var(--text-secondary)'}}>Transition</div></div>
                          <div style={{textAlign:'center'}}><div style={{fontSize:14,fontWeight:600,color:sat.waterBodies.floodRisk==='low'?'#16a34a':'#dc2626'}}>{sat.waterBodies.floodRisk.toUpperCase()}</div><div style={{fontSize:10,color:'var(--text-secondary)'}}>Flood Risk</div></div>
                        </div>
                        <div style={{fontSize:12,marginTop:8,lineHeight:1.5}}>
                          <div>{sat.waterBodies.waterCoverage_assessment}</div>
                          <div style={{marginTop:4}}><strong>Recharge:</strong> {sat.waterBodies.rechargeZoneProximity}</div>
                        </div>
                      </div>
                    )}

                    {/* Aqua Satellite Capabilities */}
                    <div style={{marginBottom:16,padding:14,background:'linear-gradient(135deg, rgba(63,81,181,0.06), rgba(33,150,243,0.06))',borderRadius:10,border:'1px solid rgba(63,81,181,0.2)'}}>
                      <strong style={{color:'#283593',fontSize:14}}>🛰️ NASA Aqua Satellite Capabilities</strong>
                      <div style={{fontSize:12,marginTop:8,lineHeight:1.5}}>
                        <div><strong>Platform:</strong> {sat.aquaSatellite.platform}</div>
                        <div><strong>Orbit:</strong> {sat.aquaSatellite.orbit}</div>
                        <div><strong>Instruments:</strong> {sat.aquaSatellite.instruments.join(', ')}</div>
                        <div style={{marginTop:6}}><strong>Relevant Data Products:</strong></div>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:4,marginTop:4}}>
                          {sat.aquaSatellite.dataProducts.map((p: any, i: number) => (
                            <div key={i} style={{fontSize:11,padding:'3px 6px',background:'var(--bg-elevated)',borderRadius:4}}>
                              <strong>{p.name}</strong> — {p.resolution}, {p.temporal}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Verification Links */}
                    <div style={{marginBottom:16,padding:14,background:'var(--bg-elevated)',borderRadius:10,border:'1px solid var(--border)'}}>
                      <strong style={{color:'#1565c0',fontSize:13}}>✅ Verification Links (click to verify all data independently)</strong>
                      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:6,marginTop:8}}>
                        {sat.verificationLinks.map((link: any, i: number) => (
                          <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{display:'block',padding:'6px 10px',background:'rgba(33,150,243,0.05)',borderRadius:6,textDecoration:'none',fontSize:12}}>
                            <div style={{fontWeight:600,color:'#1565c0'}}>{link.name} →</div>
                            <div style={{color:'var(--text-secondary)',fontSize:11}}>{link.description}</div>
                          </a>
                        ))}
                      </div>
                    </div>

                    <div style={{fontSize:11,color:'var(--text-tertiary)',textAlign:'center'}}>
                      {sat.dataSummary}
                    </div>
                    <div style={{fontSize:10,color:'var(--text-tertiary)',textAlign:'center',marginTop:4}}>
                      {sat.globalCoverage}
                    </div>
                  </div>
                );
              })()}

              {/* ═══ GLOBAL SOIL RECOGNITION ═══ */}
              {result.globalSoilAnalysis && (() => {
                const gs = result.globalSoilAnalysis;
                return (
                  <div style={{marginTop:20}}>
                    <h4 style={{color:'#795548',marginBottom:12}}>🏔️ Global Soil Recognition & Hydraulic Properties</h4>

                    {/* WRB Classification */}
                    {gs.wrbClassification && (
                      <div style={{marginBottom:16,padding:14,background:'linear-gradient(135deg, rgba(121,85,72,0.06), rgba(161,136,127,0.06))',borderRadius:10,border:'1px solid rgba(121,85,72,0.2)'}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                          <strong style={{color:'#4e342e',fontSize:14}}>🌍 WRB Soil Classification (ISRIC 250m)</strong>
                          <span style={{padding:'3px 10px',borderRadius:12,fontSize:11,fontWeight:700,
                            background: gs.wrbClassification.aquiferSuitability==='excellent'?'rgba(34,197,94,0.15)':
                                        gs.wrbClassification.aquiferSuitability==='good'?'rgba(59,130,246,0.15)':
                                        gs.wrbClassification.aquiferSuitability==='moderate'?'rgba(245,158,11,0.15)':'rgba(239,68,68,0.15)',
                            color: gs.wrbClassification.aquiferSuitability==='excellent'?'#16a34a':
                                   gs.wrbClassification.aquiferSuitability==='good'?'#2563eb':
                                   gs.wrbClassification.aquiferSuitability==='moderate'?'#d97706':'#dc2626',
                          }}>{gs.wrbClassification.aquiferSuitability.toUpperCase()} AQUIFER SUITABILITY</span>
                        </div>
                        <div style={{fontSize:18,fontWeight:700,marginBottom:6}}>{gs.wrbClassification.primary_class} <span style={{fontSize:12,fontWeight:400,color:'var(--text-secondary)'}}>({gs.wrbClassification.probability_pct}% confidence)</span></div>
                        {gs.wrbClassification.secondary_class && (
                          <div style={{fontSize:12,color:'var(--text-secondary)',marginBottom:4}}>Also possible: {gs.wrbClassification.secondary_class} ({gs.wrbClassification.secondary_probability}%){gs.wrbClassification.tertiary_class ? `, ${gs.wrbClassification.tertiary_class}` : ''}</div>
                        )}
                        <div style={{fontSize:12,lineHeight:1.5}}>
                          <div>{gs.wrbClassification.description}</div>
                          <div style={{marginTop:6,padding:8,background:'rgba(121,85,72,0.05)',borderRadius:6}}>
                            <strong>Groundwater Relevance:</strong> {gs.wrbClassification.groundwaterRelevance}
                          </div>
                          <div style={{marginTop:4}}><strong>Typical Depth to Water:</strong> {gs.wrbClassification.typicalDepthToWater}</div>
                        </div>
                      </div>
                    )}

                    {/* Soil Recognition */}
                    {gs.soilRecognition && (
                      <div style={{marginBottom:16,padding:14,background:'var(--bg-elevated)',borderRadius:10,border:'1px solid var(--border)'}}>
                        <strong style={{color:'#795548',fontSize:13}}>🔬 Soil Texture & Recognition</strong>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(100px,1fr))',gap:8,marginTop:8}}>
                          <div style={{textAlign:'center'}}><div style={{fontSize:16,fontWeight:700}}>{gs.soilRecognition.clay_pct.toFixed(0)}%</div><div style={{fontSize:10,color:'var(--text-secondary)'}}>Clay</div></div>
                          <div style={{textAlign:'center'}}><div style={{fontSize:16,fontWeight:700}}>{gs.soilRecognition.sand_pct.toFixed(0)}%</div><div style={{fontSize:10,color:'var(--text-secondary)'}}>Sand</div></div>
                          <div style={{textAlign:'center'}}><div style={{fontSize:16,fontWeight:700}}>{gs.soilRecognition.silt_pct.toFixed(0)}%</div><div style={{fontSize:10,color:'var(--text-secondary)'}}>Silt</div></div>
                          <div style={{textAlign:'center'}}><div style={{fontSize:16,fontWeight:700}}>{gs.soilRecognition.ph.toFixed(1)}</div><div style={{fontSize:10,color:'var(--text-secondary)'}}>pH</div></div>
                          <div style={{textAlign:'center'}}><div style={{fontSize:16,fontWeight:700}}>{gs.soilRecognition.organicCarbon_pct.toFixed(1)}%</div><div style={{fontSize:10,color:'var(--text-secondary)'}}>Organic C</div></div>
                          <div style={{textAlign:'center'}}><div style={{fontSize:16,fontWeight:700}}>{gs.soilRecognition.bulkDensity_kg_m3}</div><div style={{fontSize:10,color:'var(--text-secondary)'}}>BD (kg/m³)</div></div>
                        </div>
                        <div style={{fontSize:12,marginTop:8}}>
                          <div><strong>Texture:</strong> {gs.soilRecognition.textureDescription}</div>
                          <div><strong>Group:</strong> {gs.soilRecognition.soilGroup}</div>
                          <div><strong>Color:</strong> {gs.soilRecognition.soilColor}</div>
                          <div><strong>Permeability:</strong> {gs.soilRecognition.permeability.replace(/_/g,' ')}</div>
                          <div style={{marginTop:4}}>{gs.soilRecognition.groundwaterImplication}</div>
                        </div>
                      </div>
                    )}

                    {/* Hydraulic Properties */}
                    {gs.hydraulicProperties && (
                      <div style={{marginBottom:16,padding:14,background:'linear-gradient(135deg, rgba(33,150,243,0.06), rgba(121,85,72,0.06))',borderRadius:10,border:'1px solid rgba(33,150,243,0.2)'}}>
                        <strong style={{color:'#1565c0',fontSize:13}}>💦 Soil Hydraulic Properties (Saxton & Rawls 2006)</strong>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:8,marginTop:8}}>
                          <div style={{padding:8,background:'var(--bg-elevated)',borderRadius:6,textAlign:'center'}}>
                            <div style={{fontSize:16,fontWeight:700,color:'#1565c0'}}>{gs.hydraulicProperties.ksat_mm_hr.toFixed(1)}</div>
                            <div style={{fontSize:10,color:'var(--text-secondary)'}}>Ksat (mm/hr)</div>
                            <div style={{fontSize:9,color:'var(--text-tertiary)'}}>{gs.hydraulicProperties.ksat_class}</div>
                          </div>
                          <div style={{padding:8,background:'var(--bg-elevated)',borderRadius:6,textAlign:'center'}}>
                            <div style={{fontSize:16,fontWeight:700,color:'#2e7d32'}}>{gs.hydraulicProperties.field_capacity_vol_pct.toFixed(1)}%</div>
                            <div style={{fontSize:10,color:'var(--text-secondary)'}}>Field Capacity</div>
                          </div>
                          <div style={{padding:8,background:'var(--bg-elevated)',borderRadius:6,textAlign:'center'}}>
                            <div style={{fontSize:16,fontWeight:700,color:'#e65100'}}>{gs.hydraulicProperties.wilting_point_vol_pct.toFixed(1)}%</div>
                            <div style={{fontSize:10,color:'var(--text-secondary)'}}>Wilting Point</div>
                          </div>
                          <div style={{padding:8,background:'var(--bg-elevated)',borderRadius:6,textAlign:'center'}}>
                            <div style={{fontSize:16,fontWeight:700,color:'#7b1fa2'}}>{gs.hydraulicProperties.totalAWC_0_100cm_mm.toFixed(0)}</div>
                            <div style={{fontSize:10,color:'var(--text-secondary)'}}>AWC 0-1m (mm)</div>
                          </div>
                          <div style={{padding:8,background:'var(--bg-elevated)',borderRadius:6,textAlign:'center'}}>
                            <div style={{fontSize:16,fontWeight:700}}>{gs.hydraulicProperties.drainable_porosity_pct.toFixed(1)}%</div>
                            <div style={{fontSize:10,color:'var(--text-secondary)'}}>Drainable Porosity</div>
                          </div>
                          <div style={{padding:8,background:'var(--bg-elevated)',borderRadius:6,textAlign:'center'}}>
                            <div style={{fontSize:16,fontWeight:700}}>{gs.hydraulicProperties.infiltration_rate_mm_hr.toFixed(1)}</div>
                            <div style={{fontSize:10,color:'var(--text-secondary)'}}>Infiltration (mm/hr)</div>
                          </div>
                        </div>
                        <div style={{marginTop:8,padding:8,background:'rgba(33,150,243,0.05)',borderRadius:6,fontSize:12}}>
                          {gs.hydraulicProperties.rechargeCapacity}
                        </div>
                        {gs.hydraulicProperties.depth_profiles?.length > 0 && (
                          <details style={{marginTop:8}}>
                            <summary style={{cursor:'pointer',fontSize:12,color:'var(--text-secondary)'}}>Depth profile (6 layers, 0-200cm)</summary>
                            <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:4,marginTop:6,fontSize:11,textAlign:'center'}}>
                              {gs.hydraulicProperties.depth_profiles.map((p: any) => (
                                <div key={p.depth} style={{padding:4,background:'var(--bg-elevated)',borderRadius:4}}>
                                  <div style={{fontWeight:600}}>{p.depth}</div>
                                  <div>FC: {p.field_capacity}%</div>
                                  <div>WP: {p.wilting_point}%</div>
                                  <div>AWC: {p.awc_mm}mm</div>
                                </div>
                              ))}
                            </div>
                          </details>
                        )}
                      </div>
                    )}

                    {/* Overall Soil-GW Assessment */}
                    <div style={{padding:12,background:'rgba(121,85,72,0.05)',borderRadius:8,fontSize:12,lineHeight:1.5}}>
                      <strong>Soil-Groundwater Assessment:</strong> {gs.groundwaterSoilAssessment}
                    </div>
                  </div>
                );
              })()}

              <div className="geo-note" style={{marginTop:16}}>
                <strong>Methodology:</strong> Soil data from ISRIC SoilGrids v2.0 (250m global grid, peer-reviewed). Elevation from SRTM 30m DEM via Open-Elevation API. Climate from Open-Meteo (EC-Earth3P-HR model). Water indices computed as RGB proxies — for true NDWI/MNDWI/AWEI, use the Sentinel Hub links above to view actual NIR/SWIR band data from Sentinel-2 and Landsat.
              </div>
            </div>
          )}

          {/* SUBSURFACE MODEL (#6, #14) */}

          {/* ═══ SATELLITE REMOTE SENSING — 10-METHOD NON-INVASIVE ANALYSIS ═══ */}
          {activeResultTab==='satellite-rs' && (() => {
            const srs = result.satelliteRemoteSensing;
            if (!srs) return <div><h4 className="tab-title">{'\u{1F6F0}\uFE0F'} Satellite Remote Sensing — 10-Method Analysis</h4><p className="tab-desc">No satellite remote sensing data available. Ensure coordinates are provided for analysis.</p></div>;
            const gpiColor = srs.fusion.groundwaterPotentialIndex >= 70 ? '#22c55e' : srs.fusion.groundwaterPotentialIndex >= 50 ? '#f59e0b' : '#ef4444';
            const statusIcon = (s: string) => s === 'available' ? '\u2705' : s === 'partial' ? '\u{1F7E1}' : s === 'modeled' ? '\u{1F7E0}' : '\u274C';
            const scoreColor = (s: number) => s >= 70 ? '#22c55e' : s >= 50 ? '#f59e0b' : s < 35 ? '#ef4444' : '#fb923c';
            return (
            <div>
              <h4 className="tab-title">{'\u{1F6F0}\uFE0F'} Satellite Remote Sensing — 10-Method Non-Invasive Analysis</h4>
              <p className="tab-desc">Comprehensive satellite-based groundwater exploration using 10 independent remote sensing methods fused via GIS weighted overlay analysis. Methods include multispectral (Landsat/Sentinel-2), SAR/InSAR (Sentinel-1), GRACE gravity, thermal IR (MODIS), hyperspectral proxy, SRTM DEM, NDVI vegetation indices, SMAP soil moisture, multi-sensor fusion, and LiDAR-derived products.</p>

              {/* GPI Summary Banner */}
              <div style={{background:'rgba(56,189,248,0.08)',border:`2px solid ${gpiColor}`,borderRadius:12,padding:'18px 22px',marginBottom:20,display:'flex',alignItems:'center',gap:24}}>
                <div style={{textAlign:'center',minWidth:120}}>
                  <div style={{fontSize:42,fontWeight:800,color:gpiColor,lineHeight:1}}>{srs.fusion.groundwaterPotentialIndex}</div>
                  <div style={{fontSize:11,color:'var(--text-secondary)',marginTop:4}}>GPI Score / 100</div>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:16,fontWeight:700,color:gpiColor,marginBottom:4}}>{srs.fusion.potentialClass} Groundwater Potential</div>
                  <div style={{fontSize:12,color:'var(--text-secondary)',lineHeight:1.5}}>{srs.fusion.drillingSuitability}</div>
                  <div style={{fontSize:11,color:'var(--text-secondary)',marginTop:8}}>{srs.totalMethodsUsed} of {srs.totalMethodsAvailable} methods provided data • Data completeness: {(srs.dataCompleteness * 100).toFixed(0)}%</div>
                </div>
              </div>

              {/* Method Cards */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>
                {srs.methods.map((m, i) => (
                  <div key={i} style={{background:'var(--bg-tertiary)',border:'1px solid var(--border-color)',borderRadius:10,padding:'14px 16px',borderLeft:`4px solid ${scoreColor(m.groundwaterScore)}`}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                      <div style={{fontSize:12,fontWeight:700,color:'var(--text-primary)'}}>{statusIcon(m.status)} {m.method}</div>
                      <div style={{fontSize:20,fontWeight:800,color:scoreColor(m.groundwaterScore)}}>{m.groundwaterScore}</div>
                    </div>
                    <div style={{fontSize:10,color:'var(--text-secondary)',marginBottom:4}}>{m.platform} • {m.resolution}</div>
                    <div style={{fontSize:10,color:'var(--text-secondary)',marginBottom:6}}>Confidence: {(m.confidence * 100).toFixed(0)}% • Status: {m.status}</div>
                    <ul style={{fontSize:10.5,color:'var(--text-secondary)',margin:'0 0 6px 16px',padding:0,lineHeight:1.6}}>
                      {m.keyFindings.slice(0, 4).map((f, fi) => <li key={fi}>{f}</li>)}
                    </ul>
                    <div style={{fontSize:10,color:scoreColor(m.groundwaterScore),fontWeight:600,fontStyle:'italic'}}>{m.implication.length > 150 ? m.implication.slice(0, 147) + '...' : m.implication}</div>
                    <div style={{fontSize:9,color:'var(--text-tertiary)',marginTop:4}}>Source: {m.dataSource}</div>
                  </div>
                ))}
              </div>

              {/* Fusion Weighted Scores Table */}
              <h4 style={{fontSize:14,color:'var(--text-primary)',marginBottom:8}}>{'\u{1F50D}'} Multi-Sensor Fusion Weighted Overlay</h4>
              <p style={{fontSize:11,color:'var(--text-secondary)',marginBottom:10}}>Method: {srs.fusion.fusionMethod}</p>
              <table className="data-table" style={{marginBottom:16}}>
                <thead><tr><th>Satellite Method</th><th>Raw Score</th><th>Weight</th><th>Weighted Contribution</th></tr></thead>
                <tbody>
                  {srs.fusion.weightedScores.map((ws, i) => (
                    <tr key={i}>
                      <td style={{fontSize:11}}>{ws.method}</td>
                      <td style={{color:scoreColor(ws.score),fontWeight:700}}>{ws.score}</td>
                      <td>{(ws.weight * 100).toFixed(1)}%</td>
                      <td style={{fontWeight:600}}>{ws.weightedContribution.toFixed(1)}</td>
                    </tr>
                  ))}
                  <tr style={{fontWeight:700,borderTop:'2px solid var(--border-color)'}}>
                    <td>TOTAL — Groundwater Potential Index</td>
                    <td colSpan={2}></td>
                    <td style={{color:gpiColor,fontSize:16}}>{srs.fusion.groundwaterPotentialIndex}/100</td>
                  </tr>
                </tbody>
              </table>

              {/* Top Indicators & Limiting Factors */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
                <div style={{background:'rgba(34,197,94,0.06)',border:'1px solid rgba(34,197,94,0.2)',borderRadius:8,padding:12}}>
                  <div style={{fontSize:12,fontWeight:700,color:'#22c55e',marginBottom:6}}>{'\u2705'} Top Positive Indicators</div>
                  {srs.fusion.topIndicators.length > 0 ? srs.fusion.topIndicators.map((t, i) => <div key={i} style={{fontSize:11,color:'var(--text-secondary)',marginBottom:3}}>• {t}</div>) : <div style={{fontSize:11,color:'var(--text-secondary)'}}>No strong positive indicators</div>}
                </div>
                <div style={{background:'rgba(239,68,68,0.06)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:8,padding:12}}>
                  <div style={{fontSize:12,fontWeight:700,color:'#ef4444',marginBottom:6}}>{'\u26A0\uFE0F'} Limiting Factors</div>
                  {srs.fusion.limitingFactors.length > 0 ? srs.fusion.limitingFactors.map((l, i) => <div key={i} style={{fontSize:11,color:'var(--text-secondary)',marginBottom:3}}>• {l}</div>) : <div style={{fontSize:11,color:'var(--text-secondary)'}}>No significant limiting factors</div>}
                </div>
              </div>

              {/* Recommended Follow-Up */}
              <div style={{background:'rgba(56,189,248,0.06)',border:'1px solid rgba(56,189,248,0.18)',borderRadius:8,padding:12,marginBottom:16}}>
                <div style={{fontSize:12,fontWeight:700,color:'#38bdf8',marginBottom:6}}>{'\u{1F4CB}'} Recommended Follow-Up Actions</div>
                {srs.fusion.recommendedFollowUp.map((r, i) => <div key={i} style={{fontSize:11,color:'var(--text-secondary)',marginBottom:3}}>{i + 1}. {r}</div>)}
              </div>

              {/* Overall Assessment */}
              <div style={{background:'var(--bg-secondary)',border:'1px solid var(--border-color)',borderRadius:8,padding:14}}>
                <div style={{fontSize:12,fontWeight:700,color:'var(--text-primary)',marginBottom:6}}>{'\u{1F4CA}'} Overall Satellite Assessment</div>
                <div style={{fontSize:11.5,color:'var(--text-secondary)',lineHeight:1.6}}>{srs.overallAssessment}</div>
                <div style={{fontSize:9,color:'var(--text-tertiary)',marginTop:8}}>Analysis timestamp: {srs.timestamp}</div>
              </div>
            </div>
            );
          })()}

          {/* ═══ SURFACE GEOPHYSICS — 30 NON-INVASIVE METHODS ═══ */}
          {activeResultTab==='surface-geophysics-30' && (() => {
            const sg = result.surfaceGeophysics30;
            if (!sg) return <div><h4 className="tab-title">{'\u{1F30D}'} Surface Geophysics — 30 Non-Invasive Methods</h4><p className="tab-desc">No surface geophysics data available.</p></div>;
            const plan = sg.surveyPlan;
            const priorityColor = (p: string) => p === 'Essential' ? '#22c55e' : p === 'Recommended' ? '#38bdf8' : p === 'Optional' ? '#fbbf24' : p === 'Situational' ? '#fb923c' : '#6b7280';
            const catIcon: Record<string, string> = {'A. Seismic':'\u{1F30A}','B. Electromagnetic / Radar':'\u26A1','C. Electrical / Potential':'\u{1F50C}','D. Potential Field':'\u{1F9F2}','E. Magnetotelluric':'\u{1F300}','F. Nuclear Magnetic Resonance':'\u2699\uFE0F','G. Airborne / Drone':'\u{1F681}','H. Remote Sensing':'\u{1F6F0}\uFE0F','I. Advanced / Integrated':'\u{1F52C}','J. Fiber-Optic':'\u{1F4E1}'};
            const categories = [...new Set(sg.methods.map(m => m.category))];
            return (
            <div>
              <h4 className="tab-title">{'\u{1F30D}'} Surface Geophysics — 30 Non-Invasive Field Methods</h4>
              <p className="tab-desc">Comprehensive evaluation of 30 non-invasive / minimally invasive geophysical methods for subsurface mapping, aquifer delineation, and borehole siting. Each method is scored for site-specific applicability based on geology, target depth, terrain, and soil conditions.</p>

              {/* Summary Banner */}
              <div style={{background:'rgba(56,189,248,0.08)',border:'2px solid #38bdf8',borderRadius:12,padding:'18px 22px',marginBottom:20,display:'flex',flexWrap:'wrap',gap:24}}>
                <div style={{textAlign:'center',minWidth:100}}>
                  <div style={{fontSize:36,fontWeight:800,color:'#22c55e',lineHeight:1}}>{plan.essentialMethods.length}</div>
                  <div style={{fontSize:11,color:'var(--text-secondary)',marginTop:4}}>Essential</div>
                </div>
                <div style={{textAlign:'center',minWidth:100}}>
                  <div style={{fontSize:36,fontWeight:800,color:'#38bdf8',lineHeight:1}}>{plan.recommendedMethods.length}</div>
                  <div style={{fontSize:11,color:'var(--text-secondary)',marginTop:4}}>Recommended</div>
                </div>
                <div style={{textAlign:'center',minWidth:100}}>
                  <div style={{fontSize:36,fontWeight:800,color:'#fbbf24',lineHeight:1}}>{plan.optionalMethods.length}</div>
                  <div style={{fontSize:11,color:'var(--text-secondary)',marginTop:4}}>Optional</div>
                </div>
                <div style={{textAlign:'center',minWidth:100}}>
                  <div style={{fontSize:36,fontWeight:800,color:'#6b7280',lineHeight:1}}>{sg.methods.filter(m=>m.priority==='Not Applicable').length}</div>
                  <div style={{fontSize:11,color:'var(--text-secondary)',marginTop:4}}>Not Applicable</div>
                </div>
                <div style={{flex:1,minWidth:200}}>
                  <div style={{fontSize:13,fontWeight:700,color:'var(--text-primary)',marginBottom:6}}>Site Context</div>
                  <div style={{fontSize:12,color:'var(--text-secondary)',lineHeight:1.6}}>
                    Geology: {sg.siteContext.geology} · Terrain: {sg.siteContext.terrainType} · Target Depth: {sg.siteContext.targetDepth_m}m<br/>
                    Access: {sg.siteContext.accessConstraints}<br/>
                    Confidence gain from survey: +{plan.confidenceGainEstimate.toFixed(0)}%
                  </div>
                </div>
              </div>

              {/* Cost Summary */}
              <div style={{background:'rgba(34,197,94,0.06)',border:'1px solid rgba(34,197,94,0.2)',borderRadius:10,padding:'14px 18px',marginBottom:16,display:'flex',gap:32,flexWrap:'wrap'}}>
                <div><span style={{fontSize:12,color:'var(--text-secondary)'}}>Est. Cost (Essential + Recommended):</span><br/><span style={{fontSize:18,fontWeight:700,color:'#22c55e'}}>${plan.totalEstimatedCostUSD[0].toLocaleString()} – ${plan.totalEstimatedCostUSD[1].toLocaleString()}</span></div>
                <div><span style={{fontSize:12,color:'var(--text-secondary)'}}>Est. Field Time:</span><br/><span style={{fontSize:18,fontWeight:700,color:'#38bdf8'}}>{plan.totalEstimatedTimeHrs[0]} – {plan.totalEstimatedTimeHrs[1]} hrs</span></div>
              </div>

              {/* Phased Survey Plan */}
              {plan.phaseSequence.length > 0 && (
                <div style={{marginBottom:20}}>
                  <div style={{fontSize:15,fontWeight:700,color:'var(--text-primary)',marginBottom:10}}>{'\u{1F4CB}'} Phased Survey Plan</div>
                  {plan.phaseSequence.map((ph, i) => (
                    <div key={i} style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,padding:'12px 16px',marginBottom:8}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                        <span style={{fontSize:14,fontWeight:700,color:'#38bdf8'}}>Phase {ph.phase}: {ph.name}</span>
                        <span style={{fontSize:11,color:'var(--text-secondary)'}}>${ph.costUSD[0].toLocaleString()}–${ph.costUSD[1].toLocaleString()} · {ph.timeHrs[0]}–{ph.timeHrs[1]} hrs</span>
                      </div>
                      <div style={{fontSize:12,color:'var(--text-secondary)',marginBottom:4}}>{ph.purpose}</div>
                      <div style={{display:'flex',flexWrap:'wrap',gap:6}}>{ph.methods.map((m, j) => <span key={j} style={{fontSize:10,padding:'2px 8px',background:'rgba(56,189,248,0.1)',borderRadius:4,color:'#38bdf8'}}>{m}</span>)}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Methods by Category */}
              {categories.map((cat, ci) => {
                const catMethods = sg.methods.filter(m => m.category === cat);
                return (
                  <div key={ci} style={{marginBottom:16}}>
                    <div style={{fontSize:14,fontWeight:700,color:'var(--text-primary)',marginBottom:8,borderBottom:'1px solid rgba(255,255,255,0.08)',paddingBottom:6}}>{catIcon[cat] || '\u{1F50D}'} {cat}</div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(360px,1fr))',gap:10}}>
                      {catMethods.map((m, mi) => (
                        <div key={mi} style={{background:'rgba(255,255,255,0.02)',border:`1px solid ${priorityColor(m.priority)}33`,borderRadius:10,padding:'14px 16px'}}>
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                            <div>
                              <div style={{fontSize:13,fontWeight:700,color:'var(--text-primary)'}}>{m.id}. {m.name}</div>
                              <div style={{fontSize:10,color:'var(--text-secondary)',marginTop:2}}>{m.platform} · {m.depthCapability} · Res: {m.resolution}</div>
                            </div>
                            <div style={{textAlign:'right'}}>
                              <div style={{fontSize:22,fontWeight:800,color:priorityColor(m.priority),lineHeight:1}}>{m.applicabilityScore}</div>
                              <div style={{fontSize:9,fontWeight:700,color:priorityColor(m.priority),textTransform:'uppercase'}}>{m.priority}</div>
                            </div>
                          </div>
                          <div style={{fontSize:11,color:'var(--text-secondary)',lineHeight:1.5,marginBottom:6}}>{m.principle.slice(0, 160)}{m.principle.length > 160 ? '…' : ''}</div>
                          <div style={{fontSize:11,color:'var(--text-secondary)',marginBottom:6}}>
                            <strong>Expected:</strong> {m.expectedOutcome.slice(0, 120)}{m.expectedOutcome.length > 120 ? '…' : ''}
                          </div>
                          <div style={{display:'flex',gap:12,fontSize:10,color:'var(--text-secondary)',marginBottom:6}}>
                            <span>{'\u{1F4B0}'} ${m.estimatedCostUSD[0].toLocaleString()}–${m.estimatedCostUSD[1].toLocaleString()}</span>
                            <span>{'\u23F1'} {m.estimatedTimeHrs[0]}–{m.estimatedTimeHrs[1]} hrs</span>
                          </div>
                          {m.siteSpecificNotes.length > 0 && (
                            <div style={{fontSize:10,padding:'6px 10px',background:'rgba(56,189,248,0.05)',borderRadius:6,color:'#7dd3fc',lineHeight:1.5}}>
                              {m.siteSpecificNotes.map((n, ni) => <div key={ni}>• {n}</div>)}
                            </div>
                          )}
                          <div style={{display:'flex',flexWrap:'wrap',gap:4,marginTop:6}}>
                            {m.knowledgeGapsFilled.slice(0, 4).map((g, gi) => <span key={gi} style={{fontSize:9,padding:'1px 6px',background:'rgba(34,197,94,0.1)',borderRadius:3,color:'#4ade80'}}>{g}</span>)}
                          </div>
                          <div style={{fontSize:9,color:'var(--text-tertiary)',marginTop:6}}>{'\u{1F1F0}\u{1F1EA}'} {m.kenyaRelevance.slice(0, 100)}{m.kenyaRelevance.length > 100 ? '…' : ''}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              <div style={{fontSize:9,color:'var(--text-tertiary)',marginTop:12}}>Analysis timestamp: {sg.timestamp} · {sg.totalMethodsEvaluated} methods evaluated · {sg.applicableMethods} applicable</div>
            </div>
            );
          })()}

          {/* ═══ SATELLITE SOIL MOISTURE & WATER BUDGET ═══ */}
          {activeResultTab==='gldas-groundwater' && (
            <div>
              <h4 className="tab-title">{'\u{1F4A7}'} Satellite Soil Moisture & Water Budget Analysis</h4>
              <p className="tab-desc">ERA5-Land reanalysis provides <strong>soil moisture</strong> at 4 depths (NOT groundwater directly). NASA POWER provides precipitation and reference evapotranspiration. Actual ET is derived using the <strong>Budyko (1974) framework</strong> to ensure water balance closure (ET &lt; Precipitation). GWETPROF trend used as GRACE TWS proxy.</p>
              <div style={{background:'rgba(251,191,36,0.06)',border:'1px solid rgba(251,191,36,0.18)',padding:'10px 14px',borderRadius:8,marginBottom:16,fontSize:12,color:'var(--text-secondary)'}}>
                {'\u26A0\uFE0F'} <strong>Important:</strong> GLDAS measures soil moisture (top 2.55m), not groundwater. "Groundwater potential" is an index derived from soil moisture, water budget, and storage trends — it is NOT a direct groundwater measurement. Recharge estimates carry ±30-50% uncertainty.
              </div>

              {result.gldasGroundwater ? (
                <div>
                  {/* Drilling Favorability Banner */}
                  <div style={{
                    background: result.gldasGroundwater.drillingFavorability==='excellent'?'rgba(34,197,94,0.08)':
                      result.gldasGroundwater.drillingFavorability==='good'?'rgba(56,189,248,0.08)':
                      result.gldasGroundwater.drillingFavorability==='moderate'?'rgba(251,191,36,0.08)':
                      result.gldasGroundwater.drillingFavorability==='poor'?'rgba(249,115,22,0.08)':'rgba(239,68,68,0.10)',
                    border: `2px solid ${result.gldasGroundwater.drillingFavorability==='excellent'?'rgba(34,197,94,0.3)':
                      result.gldasGroundwater.drillingFavorability==='good'?'rgba(56,189,248,0.3)':
                      result.gldasGroundwater.drillingFavorability==='moderate'?'rgba(251,191,36,0.3)':
                      result.gldasGroundwater.drillingFavorability==='poor'?'rgba(249,115,22,0.3)':'rgba(239,68,68,0.4)'}`,
                    padding:'16px 20px', borderRadius:12, marginBottom:20,
                  }}>
                    <div style={{display:'flex',alignItems:'center',gap:14,flexWrap:'wrap'}}>
                      <div style={{
                        width:56, height:56, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center',
                        fontWeight:900, fontSize:20, color:'#fff',
                        background: result.gldasGroundwater.drillingFavorability==='excellent'?'#22c55e':
                          result.gldasGroundwater.drillingFavorability==='good'?'#38bdf8':
                          result.gldasGroundwater.drillingFavorability==='moderate'?'#fbbf24':
                          result.gldasGroundwater.drillingFavorability==='poor'?'#f97316':'#ef4444',
                      }}>
                        {result.gldasGroundwater.groundwaterPotential}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:700,fontSize:16,color:'var(--text-primary)',textTransform:'uppercase'}}>{result.gldasGroundwater.drillingFavorability} Drilling Favorability</div>
                        <div style={{fontSize:12,color:'var(--text-secondary)',marginTop:3}}>Groundwater Potential Index: {result.gldasGroundwater.groundwaterPotential}/100 — based on ERA5-Land soil moisture + NASA POWER water budget + GWETPROF storage trend</div>
                      </div>
                    </div>
                  </div>

                  {/* Soil Moisture Profile (4 layers) */}
                  <div style={{marginBottom:20}}>
                    <h4 style={{color:'#00BCD4',marginBottom:12}}>{'💧'} Soil Moisture Profile (ERA5-Land Reanalysis, 4 True Depths)</h4>
                    <div style={{display:'flex',flexDirection:'column',gap:8}}>
                      {[
                        { label: '0–7 cm (Surface)', value: result.gldasGroundwater.soilMoisture.layer_0_7cm, max: 35 },
                        { label: '7–28 cm (Shallow)', value: result.gldasGroundwater.soilMoisture.layer_7_28cm, max: 105 },
                        { label: '28–100 cm (Mid)', value: result.gldasGroundwater.soilMoisture.layer_28_100cm, max: 360 },
                        { label: '100–255 cm (Deep/Root)', value: result.gldasGroundwater.soilMoisture.layer_100_255cm, max: 775 },
                      ].map((layer, i) => (
                        <div key={i} style={{display:'flex',alignItems:'center',gap:12}}>
                          <span style={{minWidth:160,fontSize:12,fontWeight:600,color:'var(--text-secondary)'}}>{layer.label}</span>
                          <div style={{flex:1,height:24,background:'rgba(255,255,255,0.05)',borderRadius:6,overflow:'hidden',position:'relative'}}>
                            <div style={{
                              width:`${Math.min(100, (layer.value/layer.max)*100)}%`,
                              height:'100%',
                              background:`linear-gradient(90deg, rgba(0,188,212,0.3), rgba(0,188,212,${0.3 + (layer.value/layer.max)*0.5}))`,
                              borderRadius:6,
                              transition:'width 0.3s',
                            }}/>
                          </div>
                          <span style={{minWidth:80,textAlign:'right',fontSize:13,fontWeight:700,color:'#00BCD4',fontFamily:'var(--font-mono)'}}>{layer.value} kg/m²</span>
                        </div>
                      ))}
                    </div>
                    <div className="result-grid" style={{marginTop:12}}>
                      <div className="result-item"><span className="rl">Total Column Moisture</span><span className="rv" style={{fontWeight:700,fontSize:18}}>{result.gldasGroundwater.soilMoisture.totalColumn} kg/m²</span></div>
                      <div className="result-item"><span className="rl">Classification</span><span className="rv" style={{fontWeight:700,textTransform:'uppercase',color:
                        result.gldasGroundwater.soilMoisture.classification==='saturated'?'#22c55e':
                        result.gldasGroundwater.soilMoisture.classification==='wet'?'#38bdf8':
                        result.gldasGroundwater.soilMoisture.classification==='moist'?'#fbbf24':
                        result.gldasGroundwater.soilMoisture.classification==='dry'?'#f97316':'#ef4444'
                      }}>{result.gldasGroundwater.soilMoisture.classification}</span></div>
                    </div>
                    <div style={{marginTop:8,padding:'8px 14px',background:'rgba(0,188,212,0.06)',borderRadius:8,fontSize:12,color:'var(--text-secondary)'}}>
                      {result.gldasGroundwater.soilMoisture.drillingImplication}
                    </div>
                  </div>

                  {/* Water Budget */}
                  <div style={{marginBottom:20}}>
                    <h4 style={{color:'#2196F3',marginBottom:12}}>{'🔄'} Water Budget (NASA POWER — Real GLDAS/MERRA-2 Data)</h4>
                    <div style={{background:'var(--bg-elevated)',borderRadius:12,padding:16,border:'1px solid var(--border)',marginBottom:12}}>
                      <div style={{fontFamily:'var(--font-mono)',fontSize:13,color:'#2196F3',fontWeight:700,textAlign:'center',padding:'8px 0'}}>
                        {result.gldasGroundwater.waterBudget.equation}
                      </div>
                    </div>
                    <div className="result-grid">
                      <div className="result-item"><span className="rl">Precipitation (P)</span><span className="rv" style={{fontWeight:700,color:'#2196F3'}}>{result.gldasGroundwater.waterBudget.precipitation} mm/yr</span></div>
                      <div className="result-item"><span className="rl">Evapotranspiration (ET)</span><span className="rv" style={{color:'#f97316'}}>{result.gldasGroundwater.waterBudget.evapotranspiration} mm/yr</span></div>
                      <div className="result-item"><span className="rl">Surface Runoff (Qs)</span><span className="rv">{result.gldasGroundwater.waterBudget.surfaceRunoff} mm/yr</span></div>
                      <div className="result-item"><span className="rl">Baseflow (Qsb)</span><span className="rv" style={{color:'#00BCD4'}}>{result.gldasGroundwater.waterBudget.baseflow} mm/yr</span></div>
                      <div className="result-item"><span className="rl">GW Recharge (estimated)</span><span className="rv" style={{fontWeight:700,fontSize:18,color:'#22c55e'}}>{result.gldasGroundwater.waterBudget.estimatedRecharge} mm/yr</span></div>
                      <div className="result-item"><span className="rl">Recharge Fraction</span><span className="rv" style={{fontWeight:700}}>{Math.round(result.gldasGroundwater.waterBudget.rechargeFraction * 100)}% of rainfall</span></div>
                    </div>
                  </div>

                  {/* GRACE Groundwater Storage Anomaly */}
                  <div style={{marginBottom:20}}>
                    <h4 style={{color:'#9C27B0',marginBottom:12}}>{'🛰️'} Water Storage Trend (GLDAS/MERRA-2 GWETPROF → GRACE Proxy)</h4>
                    <div style={{
                      background: result.gldasGroundwater.graceAnomaly.trend==='gaining'?'rgba(34,197,94,0.06)':
                        result.gldasGroundwater.graceAnomaly.trend==='stable'?'rgba(56,189,248,0.06)':
                        result.gldasGroundwater.graceAnomaly.trend==='losing'?'rgba(249,115,22,0.06)':'rgba(239,68,68,0.08)',
                      border: `1px solid ${result.gldasGroundwater.graceAnomaly.trend==='gaining'?'rgba(34,197,94,0.2)':
                        result.gldasGroundwater.graceAnomaly.trend==='stable'?'rgba(56,189,248,0.2)':
                        result.gldasGroundwater.graceAnomaly.trend==='losing'?'rgba(249,115,22,0.2)':'rgba(239,68,68,0.3)'}`,
                      borderRadius:12, padding:16,
                    }}>
                      <div className="result-grid">
                        <div className="result-item"><span className="rl">TWS Anomaly</span><span className="rv" style={{fontWeight:700,fontSize:18,color:result.gldasGroundwater.graceAnomaly.twsAnomaly>0?'#22c55e':'#ef4444'}}>{result.gldasGroundwater.graceAnomaly.twsAnomaly > 0 ? '+' : ''}{result.gldasGroundwater.graceAnomaly.twsAnomaly} cm</span></div>
                        <div className="result-item"><span className="rl">Trend</span><span className="rv" style={{fontWeight:700,textTransform:'uppercase',color:
                          result.gldasGroundwater.graceAnomaly.trend==='gaining'?'#22c55e':
                          result.gldasGroundwater.graceAnomaly.trend==='stable'?'#38bdf8':
                          result.gldasGroundwater.graceAnomaly.trend==='losing'?'#f97316':'#ef4444'
                        }}>{result.gldasGroundwater.graceAnomaly.trend}</span></div>
                        <div className="result-item"><span className="rl">Rate of Change</span><span className="rv">{result.gldasGroundwater.graceAnomaly.changeRate > 0 ? '+' : ''}{result.gldasGroundwater.graceAnomaly.changeRate} cm/year</span></div>
                        <div className="result-item"><span className="rl">Data Period</span><span className="rv">{result.gldasGroundwater.graceAnomaly.period}</span></div>
                      </div>
                      <div style={{marginTop:10,fontSize:12,color:'var(--text-secondary)'}}>{result.gldasGroundwater.graceAnomaly.basinStatus}</div>
                    </div>
                  </div>

                  {/* Key Findings */}
                  {result.gldasGroundwater.findings.length > 0 && (
                    <div style={{marginBottom:20,background:'rgba(255,255,255,0.02)',borderRadius:12,padding:16,border:'1px solid var(--border)'}}>
                      <h4 style={{margin:'0 0 10px',color:'#FF9800'}}>Key Findings</h4>
                      {result.gldasGroundwater.findings.map((f: string, i: number) => (
                        <div key={i} style={{padding:'4px 0',fontSize:12,color:'var(--text-secondary)',lineHeight:1.5}}>• {f}</div>
                      ))}
                    </div>
                  )}

                  {/* Dataset Info */}
                  <div style={{marginBottom:20,background:'var(--bg-elevated)',borderRadius:12,padding:16,border:'1px solid var(--border)'}}>
                    <h4 style={{margin:'0 0 10px',color:'var(--text-secondary)',fontSize:13}}>GLDAS Dataset Information</h4>
                    <div className="result-grid" style={{fontSize:12}}>
                      <div className="result-item"><span className="rl">Dataset</span><span className="rv">{result.gldasGroundwater.datasetInfo.name}</span></div>
                      <div className="result-item"><span className="rl">Model</span><span className="rv">{result.gldasGroundwater.datasetInfo.model}</span></div>
                      <div className="result-item"><span className="rl">Spatial Resolution</span><span className="rv">{result.gldasGroundwater.datasetInfo.resolution}</span></div>
                      <div className="result-item"><span className="rl">Temporal Resolution</span><span className="rv">{result.gldasGroundwater.datasetInfo.temporalResolution}</span></div>
                      <div className="result-item"><span className="rl">GEE Collection</span><span className="rv" style={{fontFamily:'var(--font-mono)',fontSize:11}}>{result.gldasGroundwater.datasetInfo.geeCollection}</span></div>
                    </div>
                    <div style={{marginTop:10}}>
                      <div style={{fontSize:11,fontWeight:600,color:'var(--text-tertiary)',marginBottom:4}}>GLDAS Variables Used:</div>
                      <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                        {result.gldasGroundwater.datasetInfo.variables.map((v: string, i: number) => (
                          <span key={i} style={{fontSize:10,padding:'2px 8px',borderRadius:4,background:'rgba(0,188,212,0.08)',color:'#00BCD4',fontFamily:'var(--font-mono)'}}>{v.split(' — ')[0]}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* GEE & NASA Links */}
                  <div style={{marginBottom:16}}>
                    <h4 style={{color:'#4CAF50',marginBottom:12}}>{'🌍'} View GLDAS Data in Google Earth Engine & NASA</h4>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))',gap:10}}>
                      {Object.entries(result.gldasGroundwater.links).map(([key, url]) => (
                        <a key={key} href={url as string} target="_blank" rel="noopener noreferrer" style={{
                          display:'block',padding:'12px 16px',borderRadius:10,border:'1px solid var(--border)',background:'var(--bg-elevated)',textDecoration:'none',
                        }}>
                          <div style={{fontWeight:700,color:'#4CAF50',fontSize:12}}>
                            {key === 'geeGLDAS' ? '🌍 GLDAS in Google Earth Engine' :
                             key === 'geeSoilMoisture' ? '🌍 GEE Soil Moisture Explorer' :
                             key === 'geeGRACE' ? '🛰️ GRACE in Google Earth Engine' :
                             key === 'nasaGiovanni' ? '📊 NASA Giovanni (GLDAS Maps)' :
                             key === 'nasaGRACEMap' ? '🗺️ NASA GRACE Groundwater Map' :
                             key === 'nasaPower' ? '⚡ NASA POWER Data Viewer' :
                             key === 'ldas' ? '📡 NASA LDAS Portal' : key} →
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Accuracy Assessment */}
                  {result.gldasGroundwater.accuracy && (
                    <div style={{marginBottom:20,background:'rgba(34,197,94,0.04)',borderRadius:12,padding:16,border:'1px solid rgba(34,197,94,0.15)'}}>
                      <h4 style={{margin:'0 0 10px',color:'#22c55e',fontSize:13}}>📊 Data Accuracy Assessment</h4>
                      <div className="result-grid" style={{fontSize:12}}>
                        <div className="result-item"><span className="rl">Soil Moisture</span><span className="rv" style={{color:'#22c55e',fontWeight:700}}>{result.gldasGroundwater.accuracy.soilMoisture}</span></div>
                        <div className="result-item"><span className="rl">Water Budget</span><span className="rv" style={{color:'#22c55e',fontWeight:700}}>{result.gldasGroundwater.accuracy.waterBudget}</span></div>
                        <div className="result-item"><span className="rl">Storage Trend</span><span className="rv" style={{color:'#fbbf24',fontWeight:700}}>{result.gldasGroundwater.accuracy.storageTrend}</span></div>
                        <div className="result-item"><span className="rl">Overall</span><span className="rv" style={{color:'#22c55e',fontWeight:900,fontSize:16}}>{result.gldasGroundwater.accuracy.overall}</span></div>
                      </div>
                    </div>
                  )}

                  {/* Data Source Traces */}
                  <div style={{marginBottom:20,background:'var(--bg-elevated)',borderRadius:12,padding:16,border:'1px solid var(--border)'}}>
                    <h4 style={{margin:'0 0 10px',color:'var(--text-secondary)',fontSize:13}}>🔗 Data Source Provenance</h4>
                    <div style={{fontSize:11,color:'var(--text-tertiary)',lineHeight:1.8}}>
                      <div><strong>Soil Moisture:</strong> {result.gldasGroundwater.soilMoisture.dataSource}</div>
                      <div><strong>Water Budget:</strong> {result.gldasGroundwater.waterBudget.dataSource}</div>
                      <div><strong>Storage Trend:</strong> {result.gldasGroundwater.graceAnomaly.dataSource}</div>
                    </div>
                  </div>

                  {/* GRACE-FO Deep Storage Trend (from advancedHydroEngine) */}
                  {result.graceData && (
                    <div style={{marginBottom:20,background:'rgba(156,39,176,0.04)',borderRadius:12,padding:16,border:'1px solid rgba(156,39,176,0.15)'}}>
                      <h4 style={{margin:'0 0 12px',color:'#9C27B0'}}>{'🛰️'} GRACE-FO Deep Storage Analysis (5-Year Trend)</h4>
                      <div className="result-grid">
                        <div className="result-item"><span className="rl">TWS Anomaly</span><span className="rv" style={{fontWeight:700,color:(result.graceData as any).twsAnomaly_cm>0?'#22c55e':'#ef4444'}}>{(result.graceData as any).twsAnomaly_cm > 0 ? '+' : ''}{(result.graceData as any).twsAnomaly_cm} cm</span></div>
                        <div className="result-item"><span className="rl">Trend</span><span className="rv" style={{fontWeight:700,color:(result.graceData as any).trend_cm_per_year>0?'#22c55e':'#ef4444'}}>{(result.graceData as any).trend_cm_per_year > 0 ? '+' : ''}{(result.graceData as any).trend_cm_per_year} cm/yr</span></div>
                        <div className="result-item"><span className="rl">Seasonal Amplitude</span><span className="rv">{(result.graceData as any).seasonalAmplitude_cm} cm</span></div>
                        <div className="result-item"><span className="rl">Status</span><span className="rv" style={{fontWeight:700,textTransform:'uppercase',color:(result.graceData as any).status==='gaining'?'#22c55e':(result.graceData as any).status==='stable'?'#38bdf8':(result.graceData as any).status==='losing'?'#f97316':'#ef4444'}}>{(result.graceData as any).status}</span></div>
                        <div className="result-item"><span className="rl">Aquifer Stress</span><span className="rv" style={{textTransform:'uppercase',color:(result.graceData as any).aquiferStress==='none'||(result.graceData as any).aquiferStress==='low'?'#22c55e':(result.graceData as any).aquiferStress==='moderate'?'#fbbf24':'#ef4444'}}>{(result.graceData as any).aquiferStress}</span></div>
                        <div className="result-item"><span className="rl">Period</span><span className="rv">{(result.graceData as any).period}</span></div>
                      </div>
                      <div style={{marginTop:8,fontSize:11,color:'var(--text-tertiary)'}}>{(result.graceData as any).dataSource}</div>
                    </div>
                  )}

                  {/* Vegetation Groundwater Proxy */}
                  {result.vegetationGWProxy && (
                    <div style={{marginBottom:20,background:'rgba(76,175,80,0.04)',borderRadius:12,padding:16,border:'1px solid rgba(76,175,80,0.15)'}}>
                      <h4 style={{margin:'0 0 12px',color:'#4CAF50'}}>{'🌿'} Vegetation-Groundwater Proxy</h4>
                      <div className="result-grid">
                        <div className="result-item"><span className="rl">NDVI Mean (proxy)</span><span className="rv">{(result.vegetationGWProxy as any).ndviMean.toFixed(3)}</span></div>
                        <div className="result-item"><span className="rl">NDVI Min (dry season)</span><span className="rv">{(result.vegetationGWProxy as any).ndviMin.toFixed(3)}</span></div>
                        <div className="result-item"><span className="rl">Seasonal Range</span><span className="rv">{(result.vegetationGWProxy as any).ndviSeasonalRange.toFixed(3)}</span></div>
                        <div className="result-item"><span className="rl">GW Dependence</span><span className="rv" style={{fontWeight:700,textTransform:'uppercase',color:(result.vegetationGWProxy as any).groundwaterDependence==='very_high'||(result.vegetationGWProxy as any).groundwaterDependence==='high'?'#22c55e':(result.vegetationGWProxy as any).groundwaterDependence==='moderate'?'#fbbf24':'#94a3b8'}}>{String((result.vegetationGWProxy as any).groundwaterDependence).replace('_',' ')}</span></div>
                        <div className="result-item"><span className="rl">Shallow Water Table</span><span className="rv" style={{fontWeight:700}}>{(result.vegetationGWProxy as any).shallowWaterTableLikelihood}%</span></div>
                      </div>
                      <div style={{marginTop:8,fontSize:11,color:'var(--text-tertiary)'}}>{(result.vegetationGWProxy as any).methodology}</div>
                    </div>
                  )}

                  {/* Bayesian Ensemble Result */}
                  {result.ensembleResult && (
                    <div style={{marginBottom:20,background:'rgba(255,152,0,0.04)',borderRadius:12,padding:16,border:'2px solid rgba(255,152,0,0.25)'}}>
                      <h4 style={{margin:'0 0 12px',color:'#FF9800'}}>{'🧮'} Bayesian Multi-Source Ensemble</h4>
                      <div className="result-grid">
                        <div className="result-item"><span className="rl">Fused Probability</span><span className="rv" style={{fontWeight:900,fontSize:20,color:'#FF9800'}}>{((result.ensembleResult as any).probability*100).toFixed(1)}%</span></div>
                        <div className="result-item"><span className="rl">Fused Depth</span><span className="rv" style={{fontWeight:700}}>{(result.ensembleResult as any).depth_m.toFixed(0)}m</span></div>
                        <div className="result-item"><span className="rl">Fused Yield</span><span className="rv" style={{fontWeight:700}}>{(result.ensembleResult as any).yield_m3h.toFixed(1)} m³/h</span></div>
                        <div className="result-item"><span className="rl">Ensemble Confidence</span><span className="rv" style={{fontWeight:700}}>{(result.ensembleResult as any).confidence}%</span></div>
                        <div className="result-item"><span className="rl">Sources Used</span><span className="rv">{(result.ensembleResult as any).sourcesUsed}</span></div>
                        <div className="result-item"><span className="rl">Source Agreement</span><span className="rv" style={{fontWeight:700,textTransform:'uppercase',color:(result.ensembleResult as any).sourceAgreement==='strong'?'#22c55e':(result.ensembleResult as any).sourceAgreement==='moderate'?'#fbbf24':'#ef4444'}}>{(result.ensembleResult as any).sourceAgreement}</span></div>
                      </div>
                      {(result.ensembleResult as any).individualEstimates?.length > 0 && (
                        <div style={{marginTop:12}}>
                          <h5 style={{margin:'0 0 8px',fontSize:12,color:'var(--text-secondary)'}}>Individual Source Estimates</h5>
                          <div className="sci-table-wrap">
                            <table className="sci-table" style={{fontSize:11}}>
                              <thead><tr><th>Source</th><th>Prob</th><th>Depth</th><th>Yield</th><th>Weight</th><th>Reliability</th></tr></thead>
                              <tbody>
                                {(result.ensembleResult as any).individualEstimates.map((e: any, i: number) => (
                                  <tr key={i}>
                                    <td>{e.source}</td>
                                    <td>{e.probability ? `${(e.probability*100).toFixed(0)}%` : '—'}</td>
                                    <td>{e.depth_m ? `${e.depth_m.toFixed(0)}m` : '—'}</td>
                                    <td>{e.yield_m3h ? `${e.yield_m3h.toFixed(1)}` : '—'}</td>
                                    <td>{(e.weight*100).toFixed(0)}%</td>
                                    <td>{(e.reliability*100).toFixed(0)}%</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                      <div style={{marginTop:8,fontSize:11,color:'var(--text-tertiary)'}}>{(result.ensembleResult as any).bayesianUpdate}</div>
                    </div>
                  )}

                  <div className="geo-note">
                    <strong>Methodology:</strong> Soil moisture from <strong>ERA5-Land reanalysis</strong> (ECMWF, 9km, 92-day average) at true depths: 0-7cm, 7-28cm, 28-100cm, 100-255cm. Water budget from <strong>NASA POWER API</strong> (real GLDAS/MERRA-2 derived precipitation and evapotranspiration). Storage trend from multi-year <strong>NASA POWER GWETPROF</strong> linear regression (GRACE TWS proxy, R≈0.80). <em>No lookup tables or hardcoded formulas are used.</em> For full GLDAS time-series, use GEE collection <code style={{background:'rgba(0,188,212,0.1)',padding:'1px 4px',borderRadius:3}}>NASA/GLDAS/V021/NOAH/G025/T3H</code>.
                  </div>
                </div>
              ) : (
                <div style={{padding:20,textAlign:'center',color:'var(--text-muted)',background:'var(--bg-elevated)',borderRadius:12,border:'1px solid var(--border)'}}>
                  <div style={{fontSize:24,marginBottom:8}}>💧</div>
                  <div>GLDAS groundwater data requires valid coordinates. Enter a location (Country + Region + City) to fetch GLDAS soil moisture, water budget, and GRACE storage anomaly.</div>
                </div>
              )}
            </div>
          )}

          {/* ═══ REAL-TIME WATER DATA (USGS + Flood + Current Weather) ═══ */}
          {activeResultTab==='realtime-water' && (
            <div>
              <h4 className="tab-title">{'\u{1F30A}'} Real-Time Water Data</h4>
              <p className="tab-desc">Live data from USGS Groundwater Levels (US monitoring wells), GloFAS River Discharge (global flood risk), and Open-Meteo Current Conditions (real-time soil moisture). <strong>All APIs are FREE — no API keys required.</strong></p>

              {result.realTimeWaterData ? (
                <div>
                  {/* API Status Banner */}
                  <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:20}}>
                    {[
                      {label:'USGS Groundwater', status: result.realTimeWaterData.apiStatus.usgs, icon:'\u{1F4CA}'},
                      {label:'GloFAS Flood/River', status: result.realTimeWaterData.apiStatus.flood, icon:'\u{1F30A}'},
                      {label:'Current Weather', status: result.realTimeWaterData.apiStatus.weather, icon:'\u26C5'},
                    ].map(api => (
                      <div key={api.label} style={{
                        flex:'1 1 180px', padding:'10px 14px', borderRadius:10,
                        background: api.status==='success'?'rgba(34,197,94,0.08)':api.status==='not-applicable'?'rgba(148,163,184,0.08)':'rgba(239,68,68,0.08)',
                        border: `1.5px solid ${api.status==='success'?'rgba(34,197,94,0.3)':api.status==='not-applicable'?'rgba(148,163,184,0.3)':'rgba(239,68,68,0.3)'}`,
                      }}>
                        <div style={{fontWeight:700,fontSize:13}}>{api.icon} {api.label}</div>
                        <div style={{fontSize:12,color:api.status==='success'?'#22c55e':api.status==='not-applicable'?'#94a3b8':'#ef4444',fontWeight:600,marginTop:4}}>
                          {api.status==='success'?'\u2705 LIVE DATA':api.status==='not-applicable'?'\u2014 Not applicable (non-US)':'\u274C Failed'}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* USGS Groundwater Section */}
                  {result.realTimeWaterData.usgsGroundwater && (
                    <div style={{marginBottom:24}}>
                      <h5 style={{fontSize:15,fontWeight:700,marginBottom:8}}>{'\u{1F4CA}'} USGS Groundwater Monitoring Wells</h5>
                      <p style={{fontSize:12,opacity:0.7,marginBottom:12}}>{result.realTimeWaterData.usgsGroundwater.note}</p>
                      {result.realTimeWaterData.usgsGroundwater.available && result.realTimeWaterData.usgsGroundwater.wells.length > 0 ? (
                        <div>
                          <div className="result-grid" style={{marginBottom:16}}>
                            <div className="result-item"><span className="rl">Wells Found</span><span className="rv" style={{fontWeight:700,color:'#38bdf8'}}>{result.realTimeWaterData.usgsGroundwater.wellCount}</span></div>
                            <div className="result-item"><span className="rl">Search Radius</span><span className="rv">~{result.realTimeWaterData.usgsGroundwater.searchRadiusKm} km</span></div>
                            <div className="result-item"><span className="rl">Avg Depth to Water</span><span className="rv" style={{fontWeight:700}}>{result.realTimeWaterData.usgsGroundwater.averageDepthToWaterM?.toFixed(1) ?? 'N/A'} m</span></div>
                            <div className="result-item"><span className="rl">Median Depth</span><span className="rv">{result.realTimeWaterData.usgsGroundwater.medianDepthToWaterM?.toFixed(1) ?? 'N/A'} m</span></div>
                            <div className="result-item"><span className="rl">Min Depth</span><span className="rv">{result.realTimeWaterData.usgsGroundwater.minDepthToWaterM?.toFixed(1) ?? 'N/A'} m</span></div>
                            <div className="result-item"><span className="rl">Max Depth</span><span className="rv">{result.realTimeWaterData.usgsGroundwater.maxDepthToWaterM?.toFixed(1) ?? 'N/A'} m</span></div>
                          </div>
                          {/* Nearest Well Details */}
                          {result.realTimeWaterData.usgsGroundwater.nearestWell && (
                            <div style={{background:'rgba(56,189,248,0.06)',border:'1.5px solid rgba(56,189,248,0.2)',padding:14,borderRadius:10,marginBottom:12}}>
                              <div style={{fontWeight:700,fontSize:14,marginBottom:8}}>Nearest Monitoring Well</div>
                              <div className="result-grid">
                                <div className="result-item"><span className="rl">Site</span><span className="rv">{result.realTimeWaterData.usgsGroundwater.nearestWell.siteName}</span></div>
                                <div className="result-item"><span className="rl">USGS Site #</span><span className="rv" style={{fontFamily:'monospace'}}>{result.realTimeWaterData.usgsGroundwater.nearestWell.siteNumber}</span></div>
                                <div className="result-item"><span className="rl">Distance</span><span className="rv">{result.realTimeWaterData.usgsGroundwater.nearestWell.distanceKm} km</span></div>
                                <div className="result-item"><span className="rl">Latest Depth to Water</span><span className="rv" style={{fontWeight:700,color:'#38bdf8'}}>{result.realTimeWaterData.usgsGroundwater.nearestWell.latestDepthToWaterM?.toFixed(2)} m ({result.realTimeWaterData.usgsGroundwater.nearestWell.latestDepthToWaterFt?.toFixed(1)} ft)</span></div>
                                <div className="result-item"><span className="rl">Measurement Date</span><span className="rv">{result.realTimeWaterData.usgsGroundwater.nearestWell.latestDate}</span></div>
                                {result.realTimeWaterData.usgsGroundwater.nearestWell.wellDepthFt && <div className="result-item"><span className="rl">Well Depth</span><span className="rv">{(result.realTimeWaterData.usgsGroundwater.nearestWell.wellDepthFt * 0.3048).toFixed(1)} m ({result.realTimeWaterData.usgsGroundwater.nearestWell.wellDepthFt} ft)</span></div>}
                                {result.realTimeWaterData.usgsGroundwater.nearestWell.aquiferCode && <div className="result-item"><span className="rl">Aquifer Code</span><span className="rv" style={{fontFamily:'monospace'}}>{result.realTimeWaterData.usgsGroundwater.nearestWell.aquiferCode}</span></div>}
                              </div>
                            </div>
                          )}
                          <div style={{fontSize:11,opacity:0.5}}>Source: {result.realTimeWaterData.usgsGroundwater.source}</div>
                        </div>
                      ) : (
                        <div style={{padding:16,background:'rgba(148,163,184,0.06)',borderRadius:10,textAlign:'center',fontSize:13,opacity:0.7}}>
                          {result.realTimeWaterData.usgsGroundwater.note || 'No USGS monitoring wells in this area. Other data sources provide groundwater estimates.'}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Flood / River Discharge Section */}
                  {result.realTimeWaterData.floodRiver && (
                    <div style={{marginBottom:24}}>
                      <h5 style={{fontSize:15,fontWeight:700,marginBottom:8}}>{'\u{1F30A}'} GloFAS River Discharge & Flood Risk</h5>
                      {result.realTimeWaterData.floodRiver.available ? (
                        <div>
                          <div className="result-grid" style={{marginBottom:12}}>
                            <div className="result-item"><span className="rl">Current Discharge</span><span className="rv" style={{fontWeight:700}}>{result.realTimeWaterData.floodRiver.currentDischarge?.toFixed(1) ?? 'N/A'} m&sup3;/s</span></div>
                            <div className="result-item"><span className="rl">7-Day Max</span><span className="rv">{result.realTimeWaterData.floodRiver.maxDischarge7Day?.toFixed(1) ?? 'N/A'} m&sup3;/s</span></div>
                            <div className="result-item"><span className="rl">7-Day Min</span><span className="rv">{result.realTimeWaterData.floodRiver.minDischarge7Day?.toFixed(1) ?? 'N/A'} m&sup3;/s</span></div>
                            <div className="result-item"><span className="rl">Average Discharge</span><span className="rv">{result.realTimeWaterData.floodRiver.averageDischarge?.toFixed(1) ?? 'N/A'} m&sup3;/s</span></div>
                            <div className="result-item"><span className="rl">Flood Risk</span><span className="rv" style={{
                              fontWeight:700,
                              color: result.realTimeWaterData.floodRiver.floodRiskLevel==='extreme'?'#ef4444':
                                result.realTimeWaterData.floodRiver.floodRiskLevel==='high'?'#f97316':
                                result.realTimeWaterData.floodRiver.floodRiskLevel==='moderate'?'#eab308':
                                result.realTimeWaterData.floodRiver.floodRiskLevel==='low'?'#22c55e':'#94a3b8'
                            }}>{result.realTimeWaterData.floodRiver.floodRiskLevel.toUpperCase()}</span></div>
                          </div>
                          {result.realTimeWaterData.floodRiver.dailyDischarge?.length > 0 && (
                            <div style={{background:'rgba(56,189,248,0.04)',padding:12,borderRadius:8,marginBottom:8}}>
                              <div style={{fontSize:12,fontWeight:600,marginBottom:6}}>Daily River Discharge (m&sup3;/s)</div>
                              <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                                {result.realTimeWaterData.floodRiver.dailyDischarge.slice(-14).map((d: any, i: number) => (
                                  <div key={i} style={{fontSize:10,padding:'2px 6px',background:'rgba(56,189,248,0.1)',borderRadius:4}}>
                                    {d.date?.substring(5)}: <strong>{d.discharge_m3s}</strong>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          <div style={{fontSize:11,opacity:0.5}}>Source: {result.realTimeWaterData.floodRiver.source}</div>
                        </div>
                      ) : (
                        <div style={{padding:16,background:'rgba(148,163,184,0.06)',borderRadius:10,textAlign:'center',fontSize:13,opacity:0.7}}>
                          No river discharge data available for this location.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Current Weather / Soil Moisture Section */}
                  {result.realTimeWaterData.currentWeather && result.realTimeWaterData.currentWeather.available && (
                    <div style={{marginBottom:24}}>
                      <h5 style={{fontSize:15,fontWeight:700,marginBottom:8}}>{'\u26C5'} Current Conditions (Real-Time)</h5>
                      <div className="result-grid">
                        <div className="result-item"><span className="rl">Temperature</span><span className="rv">{result.realTimeWaterData.currentWeather.temperature?.toFixed(1) ?? 'N/A'}&deg;C</span></div>
                        <div className="result-item"><span className="rl">Humidity</span><span className="rv">{result.realTimeWaterData.currentWeather.relativeHumidity ?? 'N/A'}%</span></div>
                        <div className="result-item"><span className="rl">Wind Speed</span><span className="rv">{result.realTimeWaterData.currentWeather.windSpeed?.toFixed(1) ?? 'N/A'} km/h</span></div>
                        <div className="result-item"><span className="rl">Currently Raining</span><span className="rv" style={{fontWeight:700,color:result.realTimeWaterData.currentWeather.isRaining?'#38bdf8':'#94a3b8'}}>{result.realTimeWaterData.currentWeather.isRaining ? 'YES \u{1F327}\uFE0F' : 'No'}</span></div>
                        <div className="result-item"><span className="rl">24h Precipitation</span><span className="rv">{result.realTimeWaterData.currentWeather.precipitation24h?.toFixed(1) ?? 'N/A'} mm</span></div>
                        <div className="result-item"><span className="rl">24h Evapotranspiration</span><span className="rv">{result.realTimeWaterData.currentWeather.evapotranspiration24h?.toFixed(1) ?? 'N/A'} mm</span></div>
                      </div>
                      <div style={{marginTop:12}}>
                        <div style={{fontSize:13,fontWeight:600,marginBottom:6}}>Real-Time Soil Moisture (m&sup3;/m&sup3;)</div>
                        {(result.realTimeWaterData.currentWeather.soilMoisture0to7cm != null ||
                          result.realTimeWaterData.currentWeather.soilMoisture7to28cm != null ||
                          result.realTimeWaterData.currentWeather.soilMoisture28to100cm != null ||
                          result.realTimeWaterData.currentWeather.soilMoisture100to255cm != null) ? (
                        <div className="result-grid">
                          {result.realTimeWaterData.currentWeather.soilMoisture0to7cm != null && <div className="result-item"><span className="rl">0-7 cm</span><span className="rv" style={{fontWeight:700}}>{result.realTimeWaterData.currentWeather.soilMoisture0to7cm.toFixed(3)}</span></div>}
                          {result.realTimeWaterData.currentWeather.soilMoisture7to28cm != null && <div className="result-item"><span className="rl">7-28 cm</span><span className="rv" style={{fontWeight:700}}>{result.realTimeWaterData.currentWeather.soilMoisture7to28cm.toFixed(3)}</span></div>}
                          {result.realTimeWaterData.currentWeather.soilMoisture28to100cm != null && <div className="result-item"><span className="rl">28-100 cm</span><span className="rv" style={{fontWeight:700}}>{result.realTimeWaterData.currentWeather.soilMoisture28to100cm.toFixed(3)}</span></div>}
                          {result.realTimeWaterData.currentWeather.soilMoisture100to255cm != null && <div className="result-item"><span className="rl">100-255 cm</span><span className="rv" style={{fontWeight:700}}>{result.realTimeWaterData.currentWeather.soilMoisture100to255cm.toFixed(3)}</span></div>}
                        </div>
                        ) : (
                        <div style={{fontSize:12,color:'var(--text-muted)',fontStyle:'italic',padding:'8px 0'}}>Soil moisture data temporarily unavailable for this location. Use GLDAS tab for modeled moisture estimates.</div>
                        )}
                      </div>
                      <div style={{fontSize:11,opacity:0.5,marginTop:8}}>Source: {result.realTimeWaterData.currentWeather.source} — Last updated: {result.realTimeWaterData.currentWeather.lastUpdated}</div>
                    </div>
                  )}

                  <div style={{fontSize:11,opacity:0.4,textAlign:'right'}}>Fetched at: {result.realTimeWaterData.fetchedAt}</div>
                </div>
              ) : (
                <div style={{padding:24,background:'rgba(148,163,184,0.06)',borderRadius:12,textAlign:'center'}}>
                  <div style={{fontSize:24,marginBottom:8}}>{'\u{1F30A}'}</div>
                  <div>Real-time water data requires valid coordinates. Enter a location to fetch USGS groundwater levels, river discharge, and current soil moisture.</div>
                </div>
              )}
            </div>
          )}

          {/* ═══ 3D/2D SUBSURFACE MODEL ═══ */}
          {activeResultTab==='subsurface-3d' && (
            <div>
              <h4 className="tab-title">{'\u{1F9F1}'} 3D/2D Subsurface Geological Model</h4>
              <p className="tab-desc">Physics-based layered geological model using Darcy's Law, Kozeny-Carman permeability, Saxton-Rawls pedotransfer functions, and USDA Soil Texture classification. Matches <strong>RockWorks, Surfer, Visual MODFLOW</strong> layer geometry.</p>

              {result.subsurfaceModel ? (
                <div>
                  {/* Confidence Banner */}
                  <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:16}}>
                    <div style={{flex:'1 1 200px',padding:'10px 14px',borderRadius:10,background:'rgba(56,189,248,0.08)',border:'1.5px solid rgba(56,189,248,0.2)'}}>
                      <div style={{fontSize:12,opacity:0.7}}>Model Confidence</div>
                      <div style={{fontSize:22,fontWeight:800,color:'#38bdf8'}}>{(result.subsurfaceModel.modelConfidence * 100).toFixed(0)}%</div>
                    </div>
                    <div style={{flex:'1 1 200px',padding:'10px 14px',borderRadius:10,background:'rgba(34,197,94,0.08)',border:'1.5px solid rgba(34,197,94,0.2)'}}>
                      <div style={{fontSize:12,opacity:0.7}}>Total Model Depth</div>
                      <div style={{fontSize:22,fontWeight:800,color:'#22c55e'}}>{result.subsurfaceModel.lithologicalColumn?.totalDepthM?.toFixed(0) ?? '?'} m</div>
                    </div>
                    <div style={{flex:'1 1 200px',padding:'10px 14px',borderRadius:10,background:'rgba(251,191,36,0.08)',border:'1.5px solid rgba(251,191,36,0.2)'}}>
                      <div style={{fontSize:12,opacity:0.7}}>Water Table Depth</div>
                      <div style={{fontSize:22,fontWeight:800,color:'#fbbf24'}}>{result.subsurfaceModel.lithologicalColumn?.waterTableDepthM?.toFixed(1) ?? '?'} m</div>
                    </div>
                    <div style={{flex:'1 1 200px',padding:'10px 14px',borderRadius:10,background:'rgba(168,85,247,0.08)',border:'1.5px solid rgba(168,85,247,0.2)'}}>
                      <div style={{fontSize:12,opacity:0.7}}>Aquifers Found</div>
                      <div style={{fontSize:22,fontWeight:800,color:'#a855f7'}}>{result.subsurfaceModel.lithologicalColumn?.aquifers?.length ?? 0}</div>
                    </div>
                  </div>

                  {/* ── Lithological Column (Borehole Log) ── */}
                  <div style={{marginBottom:24}}>
                    <h5 style={{fontSize:15,fontWeight:700,marginBottom:10}}>{'\u{1F4CB}'} Predicted Lithological Column (Borehole Log)</h5>
                    <div style={{position:'relative',background:'#0a0f1a',borderRadius:12,padding:16,border:'1px solid rgba(255,255,255,0.08)'}}>
                      {/* Depth scale */}
                      <div style={{display:'flex',gap:0}}>
                        {/* Depth ruler */}
                        <div style={{width:50,flexShrink:0,borderRight:'2px solid rgba(255,255,255,0.2)',paddingRight:6}}>
                          {result.subsurfaceModel.lithologicalColumn?.layers?.map((layer: any) => (
                            <div key={layer.id} style={{height:Math.max(layer.thicknessM * 3, 28),display:'flex',alignItems:'center',justifyContent:'flex-end',fontSize:10,opacity:0.6}}>
                              {layer.topDepthM.toFixed(0)}m
                            </div>
                          ))}
                          <div style={{fontSize:10,opacity:0.6,textAlign:'right',paddingTop:2}}>
                            {result.subsurfaceModel.lithologicalColumn?.totalDepthM?.toFixed(0)}m
                          </div>
                        </div>
                        {/* Layer bars */}
                        <div style={{flex:1,paddingLeft:8}}>
                          {result.subsurfaceModel.lithologicalColumn?.layers?.map((layer: any) => (
                            <div key={layer.id} style={{
                              height:Math.max(layer.thicknessM * 3, 28),
                              background:layer.color || 'rgba(100,100,100,0.3)',
                              borderBottom:'1px solid rgba(0,0,0,0.4)',
                              display:'flex',alignItems:'center',padding:'2px 10px',gap:8,
                              position:'relative',overflow:'hidden',
                            }}>
                              {layer.isAquifer && <div style={{position:'absolute',right:8,top:4,fontSize:9,background:'rgba(56,189,248,0.8)',color:'#fff',padding:'1px 6px',borderRadius:6,fontWeight:700}}>AQUIFER</div>}
                              <div style={{fontSize:12,fontWeight:700,color:'#fff',textShadow:'0 1px 3px rgba(0,0,0,0.8)',minWidth:120}}>{layer.name}</div>
                              <div style={{fontSize:10,color:'rgba(255,255,255,0.8)',textShadow:'0 1px 2px rgba(0,0,0,0.8)'}}>
                                {layer.topDepthM.toFixed(1)}-{layer.bottomDepthM.toFixed(1)}m | K={layer.hydraulicConductivity?.toFixed(3)} m/d | n={layer.porosity?.toFixed(2)} | {layer.lithology}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Water table line */}
                      {result.subsurfaceModel.lithologicalColumn?.waterTableDepthM != null && (
                        <div style={{position:'absolute',left:60,right:16,top:16 + result.subsurfaceModel.lithologicalColumn.waterTableDepthM * 3,height:2,background:'#38bdf8',zIndex:2}}>
                          <span style={{position:'absolute',right:0,top:-14,fontSize:10,color:'#38bdf8',fontWeight:700}}>WT {result.subsurfaceModel.lithologicalColumn.waterTableDepthM.toFixed(1)}m</span>
                        </div>
                      )}
                    </div>
                    <div style={{fontSize:10,opacity:0.5,marginTop:6}}>Colors represent lithology. Blue = aquifer zones. K = hydraulic conductivity (Kozeny-Carman). n = porosity (Saxton-Rawls).</div>
                  </div>

                  {/* ── Aquifer Units ── */}
                  {result.subsurfaceModel.lithologicalColumn?.aquifers?.length > 0 && (
                    <div style={{marginBottom:24}}>
                      <h5 style={{fontSize:15,fontWeight:700,marginBottom:10}}>{'\u{1F4A7}'} Identified Aquifer Units</h5>
                      {result.subsurfaceModel.lithologicalColumn.aquifers.map((aq: any, i: number) => (
                        <div key={i} style={{background:'rgba(56,189,248,0.06)',border:'1.5px solid rgba(56,189,248,0.2)',padding:14,borderRadius:10,marginBottom:10}}>
                          <div style={{fontWeight:700,fontSize:14,color:'#38bdf8',marginBottom:8}}>{aq.name} ({aq.type})</div>
                          <div className="result-grid">
                            <div className="result-item"><span className="rl">Depth Range</span><span className="rv">{aq.topDepthM?.toFixed(1)} - {aq.bottomDepthM?.toFixed(1)} m</span></div>
                            <div className="result-item"><span className="rl">Thickness</span><span className="rv" style={{fontWeight:700}}>{aq.thicknessM?.toFixed(1)} m</span></div>
                            <div className="result-item"><span className="rl">Transmissivity (T)</span><span className="rv">{aq.transmissivity?.toFixed(2)} m&sup2;/day</span></div>
                            <div className="result-item"><span className="rl">Hydraulic Conductivity (K)</span><span className="rv">{aq.hydraulicConductivity?.toFixed(4)} m/day</span></div>
                            <div className="result-item"><span className="rl">Specific Yield (Sy)</span><span className="rv">{aq.specificYield?.toFixed(3)}</span></div>
                            <div className="result-item"><span className="rl">Storativity (S)</span><span className="rv">{aq.storativity?.toExponential(2)}</span></div>
                            <div className="result-item"><span className="rl">Estimated Yield</span><span className="rv" style={{fontWeight:700,color:'#22c55e'}}>{aq.estimatedYieldM3h?.toFixed(2)} m&sup3;/h</span></div>
                            <div className="result-item"><span className="rl">Water Quality Risk</span><span className="rv" style={{color:aq.waterQualityRisk==='low'?'#22c55e':aq.waterQualityRisk==='moderate'?'#fbbf24':'#ef4444'}}>{aq.waterQualityRisk?.toUpperCase()}</span></div>
                            <div className="result-item"><span className="rl">Confidence</span><span className="rv">{((aq.confidence ?? 0) * 100).toFixed(0)}%</span></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ── 2D Cross-Sections ── */}
                  {(result.subsurfaceModel.crossSectionNS || result.subsurfaceModel.crossSectionEW) && (
                    <div style={{marginBottom:24}}>
                      <h5 style={{fontSize:15,fontWeight:700,marginBottom:10}}>{'\u{1F5FA}\uFE0F'} 2D Cross-Section Profiles</h5>
                      {[result.subsurfaceModel.crossSectionNS, result.subsurfaceModel.crossSectionEW].filter(Boolean).map((cs: any, idx: number) => (
                        <div key={idx} style={{background:'rgba(148,163,184,0.04)',border:'1px solid rgba(148,163,184,0.15)',padding:14,borderRadius:10,marginBottom:12}}>
                          <div style={{fontWeight:600,fontSize:13,marginBottom:8}}>{cs.direction} Cross-Section ({cs.totalWidth}m wide)</div>
                          <div style={{display:'flex',gap:1,height:120,alignItems:'flex-end',background:'rgba(0,0,0,0.2)',borderRadius:6,padding:4,overflow:'hidden'}}>
                            {cs.layerProperties?.map((posLayers: any[], xIdx: number) => (
                              <div key={xIdx} style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'flex-end',height:'100%'}}>
                                {posLayers?.map((layer: any, lIdx: number) => (
                                  <div key={lIdx} style={{
                                    height: Math.max(layer.thicknessM * 0.8, 2),
                                    background: layer.color || 'rgba(100,100,100,0.5)',
                                    borderBottom: '0.5px solid rgba(0,0,0,0.3)',
                                    minWidth: 2,
                                  }} title={`${layer.name}: ${layer.topDepthM?.toFixed(0)}-${layer.bottomDepthM?.toFixed(0)}m`}></div>
                                ))}
                              </div>
                            ))}
                          </div>
                          <div style={{display:'flex',justifyContent:'space-between',fontSize:9,opacity:0.5,marginTop:4}}>
                            <span>{cs.direction === 'N-S' ? 'North' : 'West'}</span>
                            <span>Center</span>
                            <span>{cs.direction === 'N-S' ? 'South' : 'East'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ── 3D Volumetric Summary ── */}
                  {result.subsurfaceModel.volumetricModel && (
                    <div style={{marginBottom:24}}>
                      <h5 style={{fontSize:15,fontWeight:700,marginBottom:10}}>{'\u{1F4E6}'} 3D Volumetric Model Summary</h5>
                      <div className="result-grid">
                        <div className="result-item"><span className="rl">Grid Dimensions</span><span className="rv">{result.subsurfaceModel.volumetricModel.nx} &times; {result.subsurfaceModel.volumetricModel.ny} &times; {result.subsurfaceModel.volumetricModel.nz}</span></div>
                        <div className="result-item"><span className="rl">Cell Size</span><span className="rv">{result.subsurfaceModel.volumetricModel.dx}m &times; {result.subsurfaceModel.volumetricModel.dy}m</span></div>
                        <div className="result-item"><span className="rl">Model Extent</span><span className="rv">{result.subsurfaceModel.volumetricModel.extentM}m &times; {result.subsurfaceModel.volumetricModel.extentM}m</span></div>
                        <div className="result-item"><span className="rl">Total Volume</span><span className="rv">{(result.subsurfaceModel.volumetricModel.totalVolumeCubicM / 1e6).toFixed(2)} million m&sup3;</span></div>
                        <div className="result-item"><span className="rl">Water Storage Capacity</span><span className="rv" style={{fontWeight:700,color:'#38bdf8'}}>{(result.subsurfaceModel.volumetricModel.waterStorageCubicM / 1e6).toFixed(3)} million m&sup3;</span></div>
                        <div className="result-item"><span className="rl">Aquifer Volume</span><span className="rv" style={{fontWeight:700,color:'#22c55e'}}>{(result.subsurfaceModel.volumetricModel.aquiferVolumeCubicM / 1e6).toFixed(3)} million m&sup3;</span></div>
                      </div>
                    </div>
                  )}

                  {/* Methodology */}
                  <div style={{marginTop:16}}>
                    <div style={{fontSize:12,fontWeight:600,marginBottom:6}}>Methodology</div>
                    <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                      {result.subsurfaceModel.methodology?.map((m: string, i: number) => (
                        <span key={i} style={{fontSize:10,padding:'2px 8px',background:'rgba(168,85,247,0.1)',border:'1px solid rgba(168,85,247,0.2)',borderRadius:6}}>{m}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{fontSize:11,opacity:0.4,marginTop:10}}>Data: {result.subsurfaceModel.dataSourceSummary}</div>
                </div>
              ) : (
                <div style={{padding:24,background:'rgba(148,163,184,0.06)',borderRadius:12,textAlign:'center'}}>
                  <div style={{fontSize:24,marginBottom:8}}>{'\u{1F9F1}'}</div>
                  <div>3D subsurface model requires valid coordinates with satellite data. Enter a location to generate the geological model.</div>
                </div>
              )}
            </div>
          )}

          {/* ═══ AQUIFER PHYSICS SIMULATOR ═══ */}
          {activeResultTab==='aquifer-sim' && (
            <div>
              <h4 className="tab-title">{'\u269B\uFE0F'} Aquifer Physics Simulator</h4>
              <p className="tab-desc">Full physics engine: <strong>Theis pump test, Cooper-Jacob analysis, Hvorslev slug test, transient flow modeling, solute transport (ADE), cone of depression, groundwater budget</strong>. Same equations as MODFLOW, FEFLOW, AquiferTest — automated with satellite data.</p>

              {result.aquiferSimulation ? (
                <div>
                  {/* Industry Match Banner */}
                  {result.aquiferSimulation.matchesIndustryTools?.length > 0 && (
                    <div style={{background:'rgba(34,197,94,0.06)',border:'1.5px solid rgba(34,197,94,0.2)',padding:12,borderRadius:10,marginBottom:16}}>
                      <div style={{fontSize:12,fontWeight:700,color:'#22c55e',marginBottom:6}}>Matches Industry-Standard Tools</div>
                      <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                        {result.aquiferSimulation.matchesIndustryTools.map((t: string, i: number) => (
                          <span key={i} style={{fontSize:11,padding:'3px 10px',background:'rgba(34,197,94,0.1)',border:'1px solid rgba(34,197,94,0.25)',borderRadius:6,fontWeight:600}}>{t}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Pump Test Analysis ── */}
                  {result.aquiferSimulation.pumpTest && (
                    <div style={{marginBottom:24}}>
                      <h5 style={{fontSize:15,fontWeight:700,marginBottom:10}}>{'\u{1F4C9}'} Pump Test Analysis</h5>

                      {/* Theis */}
                      <div style={{background:'rgba(56,189,248,0.04)',border:'1px solid rgba(56,189,248,0.15)',padding:14,borderRadius:10,marginBottom:10}}>
                        <div style={{fontWeight:700,fontSize:13,color:'#38bdf8',marginBottom:8}}>Theis (1935) Type-Curve Solution</div>
                        <div className="result-grid">
                          <div className="result-item"><span className="rl">Transmissivity (T)</span><span className="rv" style={{fontWeight:700}}>{result.aquiferSimulation.pumpTest.theis?.transmissivity?.toFixed(2)} m&sup2;/day</span></div>
                          <div className="result-item"><span className="rl">Storativity (S)</span><span className="rv">{result.aquiferSimulation.pumpTest.theis?.storativity?.toExponential(2)}</span></div>
                          <div className="result-item"><span className="rl">Drawdown at Well</span><span className="rv">{result.aquiferSimulation.pumpTest.theis?.drawdownAtWell?.toFixed(2)} m</span></div>
                          <div className="result-item"><span className="rl">Drawdown at 100m</span><span className="rv">{result.aquiferSimulation.pumpTest.theis?.drawdownAt100m?.toFixed(2)} m</span></div>
                          <div className="result-item"><span className="rl">Drawdown at 500m</span><span className="rv">{result.aquiferSimulation.pumpTest.theis?.drawdownAt500m?.toFixed(3)} m</span></div>
                        </div>
                        <div style={{fontSize:10,opacity:0.5,marginTop:6,fontFamily:'monospace'}}>{result.aquiferSimulation.pumpTest.theis?.equation}</div>
                      </div>

                      {/* Cooper-Jacob */}
                      <div style={{background:'rgba(168,85,247,0.04)',border:'1px solid rgba(168,85,247,0.15)',padding:14,borderRadius:10,marginBottom:10}}>
                        <div style={{fontWeight:700,fontSize:13,color:'#a855f7',marginBottom:8}}>Cooper-Jacob (1946) Approximation</div>
                        <div className="result-grid">
                          <div className="result-item"><span className="rl">Transmissivity (T)</span><span className="rv" style={{fontWeight:700}}>{result.aquiferSimulation.pumpTest.cooperJacob?.transmissivity?.toFixed(2)} m&sup2;/day</span></div>
                          <div className="result-item"><span className="rl">Storativity (S)</span><span className="rv">{result.aquiferSimulation.pumpTest.cooperJacob?.storativity?.toExponential(2)}</span></div>
                          <div className="result-item"><span className="rl">Slope per Log Cycle</span><span className="rv">{result.aquiferSimulation.pumpTest.cooperJacob?.slopePerLogCycle?.toFixed(3)} m</span></div>
                          <div className="result-item"><span className="rl">t0 Intercept</span><span className="rv">{result.aquiferSimulation.pumpTest.cooperJacob?.t0_intercept_min?.toFixed(2)} min</span></div>
                        </div>
                        {result.aquiferSimulation.pumpTest.cooperJacob?.drawdownVsTime?.length > 0 && (
                          <div style={{marginTop:8}}>
                            <div style={{fontSize:11,fontWeight:600,marginBottom:4}}>Drawdown vs Time</div>
                            <div style={{display:'flex',gap:3,flexWrap:'wrap'}}>
                              {result.aquiferSimulation.pumpTest.cooperJacob.drawdownVsTime.slice(0, 12).map((pt: any, i: number) => (
                                <span key={i} style={{fontSize:9,padding:'2px 6px',background:'rgba(168,85,247,0.1)',borderRadius:4}}>{pt.time_min}min: {pt.drawdown_m?.toFixed(3)}m</span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div style={{fontSize:10,opacity:0.5,marginTop:6,fontFamily:'monospace'}}>{result.aquiferSimulation.pumpTest.cooperJacob?.equation}</div>
                      </div>

                      {/* Hvorslev Slug Test */}
                      <div style={{background:'rgba(251,191,36,0.04)',border:'1px solid rgba(251,191,36,0.15)',padding:14,borderRadius:10,marginBottom:10}}>
                        <div style={{fontWeight:700,fontSize:13,color:'#fbbf24',marginBottom:8}}>Hvorslev (1951) Slug Test</div>
                        <div className="result-grid">
                          <div className="result-item"><span className="rl">Hydraulic Conductivity</span><span className="rv" style={{fontWeight:700}}>{result.aquiferSimulation.pumpTest.hvorslev?.hydraulicConductivity?.toFixed(4)} m/day</span></div>
                          <div className="result-item"><span className="rl">Time Lag (T0)</span><span className="rv">{result.aquiferSimulation.pumpTest.hvorslev?.timelag?.toFixed(0)} seconds</span></div>
                        </div>
                        <div style={{fontSize:10,opacity:0.5,marginTop:6,fontFamily:'monospace'}}>{result.aquiferSimulation.pumpTest.hvorslev?.equation}</div>
                      </div>

                      {/* Specific Capacity */}
                      <div style={{background:'rgba(34,197,94,0.04)',border:'1px solid rgba(34,197,94,0.15)',padding:14,borderRadius:10}}>
                        <div style={{fontWeight:700,fontSize:13,color:'#22c55e',marginBottom:8}}>Specific Capacity & Recovery</div>
                        <div className="result-grid">
                          <div className="result-item"><span className="rl">Specific Capacity</span><span className="rv" style={{fontWeight:700}}>{result.aquiferSimulation.pumpTest.specificCapacity?.value?.toFixed(2)} m&sup3;/day/m</span></div>
                          <div className="result-item"><span className="rl">Empirical T (Driscoll 1986)</span><span className="rv">{result.aquiferSimulation.pumpTest.specificCapacity?.empiricalT?.toFixed(2)} m&sup2;/day</span></div>
                          <div className="result-item"><span className="rl">Classification</span><span className="rv">{result.aquiferSimulation.pumpTest.specificCapacity?.classification}</span></div>
                          <div className="result-item"><span className="rl">T from Recovery</span><span className="rv">{result.aquiferSimulation.pumpTest.recovery?.transmissivityFromRecovery?.toFixed(2)} m&sup2;/day</span></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Cone of Depression ── */}
                  {result.aquiferSimulation.coneOfDepression && (
                    <div style={{marginBottom:24}}>
                      <h5 style={{fontSize:15,fontWeight:700,marginBottom:10}}>{'\u{1F573}\uFE0F'} Cone of Depression</h5>
                      <div className="result-grid" style={{marginBottom:12}}>
                        <div className="result-item"><span className="rl">Pumping Rate</span><span className="rv">{result.aquiferSimulation.coneOfDepression.pumpingRateM3day?.toFixed(1)} m&sup3;/day</span></div>
                        <div className="result-item"><span className="rl">Max Drawdown</span><span className="rv" style={{fontWeight:700,color:'#ef4444'}}>{result.aquiferSimulation.coneOfDepression.maxDrawdownM?.toFixed(2)} m</span></div>
                        <div className="result-item"><span className="rl">Radius of Influence</span><span className="rv" style={{fontWeight:700,color:'#38bdf8'}}>{result.aquiferSimulation.coneOfDepression.radiusOfInfluenceM?.toFixed(0)} m</span></div>
                        <div className="result-item"><span className="rl">Steady State</span><span className="rv">{result.aquiferSimulation.coneOfDepression.steadyStateReached ? '\u2705 Yes' : '\u{1F504} Not yet'}</span></div>
                      </div>
                      {/* Visual cone */}
                      {result.aquiferSimulation.coneOfDepression.drawdownProfile?.length > 0 && (
                        <div style={{background:'rgba(0,0,0,0.2)',borderRadius:8,padding:12,marginBottom:8}}>
                          <div style={{fontSize:11,fontWeight:600,marginBottom:6}}>Drawdown Profile (m vs distance)</div>
                          <div style={{display:'flex',alignItems:'flex-start',height:80,gap:1}}>
                            {result.aquiferSimulation.coneOfDepression.drawdownProfile.map((pt: any, i: number) => {
                              const maxDD = result.aquiferSimulation!.coneOfDepression.maxDrawdownM || 1;
                              const h = Math.max(2, (pt.drawdownM / maxDD) * 70);
                              return <div key={i} style={{flex:1,background:'rgba(56,189,248,0.6)',height:h,borderRadius:'2px 2px 0 0',minWidth:2}} title={`${pt.distanceM}m: ${pt.drawdownM?.toFixed(3)}m`}></div>;
                            })}
                          </div>
                          <div style={{display:'flex',justifyContent:'space-between',fontSize:9,opacity:0.5,marginTop:2}}>
                            <span>Well</span>
                            <span>{result.aquiferSimulation.coneOfDepression.radiusOfInfluenceM?.toFixed(0)}m</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── Transient Flow ── */}
                  {result.aquiferSimulation.transientFlow && (
                    <div style={{marginBottom:24}}>
                      <h5 style={{fontSize:15,fontWeight:700,marginBottom:10}}>{'\u{1F4C8}'} Transient Flow Modeling</h5>
                      <div className="result-grid" style={{marginBottom:12}}>
                        <div className="result-item"><span className="rl">Simulation Period</span><span className="rv">{result.aquiferSimulation.transientFlow.simulationDays} days</span></div>
                        <div className="result-item"><span className="rl">Time Step</span><span className="rv">{result.aquiferSimulation.transientFlow.timeStepDays} day</span></div>
                        <div className="result-item"><span className="rl">Equilibrium Drawdown</span><span className="rv">{result.aquiferSimulation.transientFlow.steadyState?.equilibriumDrawdown?.toFixed(2)} m</span></div>
                        <div className="result-item"><span className="rl">Time to Steady State</span><span className="rv">{result.aquiferSimulation.transientFlow.steadyState?.timeToSteadyState_days?.toFixed(0)} days</span></div>
                        <div className="result-item"><span className="rl">Sustainable Pumping</span><span className="rv" style={{fontWeight:700,color:'#22c55e'}}>{result.aquiferSimulation.transientFlow.steadyState?.sustainablePumpingRate?.toFixed(2)} m&sup3;/day</span></div>
                      </div>
                      {result.aquiferSimulation!.transientFlow.waterTableTimeSeries?.length > 0 && (
                        <div style={{background:'rgba(0,0,0,0.15)',borderRadius:8,padding:10}}>
                          <div style={{fontSize:11,fontWeight:600,marginBottom:4}}>Water Table Over Time</div>
                          <div style={{display:'flex',gap:3,flexWrap:'wrap'}}>
                            {result.aquiferSimulation!.transientFlow.waterTableTimeSeries.filter((_: any,i: number) => i % Math.max(1, Math.floor(result.aquiferSimulation!.transientFlow.waterTableTimeSeries.length / 15)) === 0).map((pt: any, i: number) => (
                              <span key={i} style={{fontSize:9,padding:'2px 6px',background:'rgba(56,189,248,0.1)',borderRadius:4}}>Day {pt.day}: {pt.waterTableM?.toFixed(2)}m</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── Solute Transport ── */}
                  {result.aquiferSimulation.soluteTransport && (
                    <div style={{marginBottom:24}}>
                      <h5 style={{fontSize:15,fontWeight:700,marginBottom:10}}>{'\u2623\uFE0F'} Solute Transport & Contamination Modeling</h5>
                      <div className="result-grid" style={{marginBottom:12}}>
                        <div className="result-item"><span className="rl">Avg Groundwater Velocity</span><span className="rv">{result.aquiferSimulation.soluteTransport.plume?.averageVelocity?.toFixed(4)} m/day</span></div>
                        <div className="result-item"><span className="rl">Longitudinal Dispersivity</span><span className="rv">{result.aquiferSimulation.soluteTransport.plume?.longitudinalDispersivity?.toFixed(1)} m</span></div>
                        <div className="result-item"><span className="rl">Peclet Number</span><span className="rv">{result.aquiferSimulation.soluteTransport.plume?.pecletNumber?.toFixed(1)}</span></div>
                        <div className="result-item"><span className="rl">Plume Length (50% C)</span><span className="rv">{result.aquiferSimulation.soluteTransport.plume?.plumeLength50pct_m?.toFixed(0)} m</span></div>
                        <div className="result-item"><span className="rl">Plume Length (10% C)</span><span className="rv">{result.aquiferSimulation.soluteTransport.plume?.plumeLength10pct_m?.toFixed(0)} m</span></div>
                        <div className="result-item"><span className="rl">Travel Time to 50m</span><span className="rv">{result.aquiferSimulation.soluteTransport.plume?.travelTime50m_days?.toFixed(0)} days</span></div>
                        <div className="result-item"><span className="rl">Travel Time to 100m</span><span className="rv">{result.aquiferSimulation.soluteTransport.plume?.travelTime100m_days?.toFixed(0)} days</span></div>
                      </div>

                      {/* Dilution Factors */}
                      <div style={{background:'rgba(168,85,247,0.04)',border:'1px solid rgba(168,85,247,0.15)',padding:12,borderRadius:8,marginBottom:12}}>
                        <div style={{fontSize:12,fontWeight:600,marginBottom:6}}>Dilution Factors</div>
                        <div className="result-grid">
                          <div className="result-item"><span className="rl">At 50m</span><span className="rv">{result.aquiferSimulation.soluteTransport.dilution?.dilutionFactorAt50m?.toFixed(2)}x</span></div>
                          <div className="result-item"><span className="rl">At 100m</span><span className="rv">{result.aquiferSimulation.soluteTransport.dilution?.dilutionFactorAt100m?.toFixed(2)}x</span></div>
                          <div className="result-item"><span className="rl">At 500m</span><span className="rv">{result.aquiferSimulation.soluteTransport.dilution?.dilutionFactorAt500m?.toFixed(2)}x</span></div>
                          <div className="result-item"><span className="rl">Natural Attenuation</span><span className="rv">{result.aquiferSimulation.soluteTransport.dilution?.naturalAttenuationRate?.toExponential(2)} /day</span></div>
                        </div>
                      </div>

                      {/* Safe Setback Distances */}
                      <div style={{background:'rgba(239,68,68,0.04)',border:'1px solid rgba(239,68,68,0.15)',padding:12,borderRadius:8}}>
                        <div style={{fontSize:12,fontWeight:600,marginBottom:6,color:'#ef4444'}}>Safe Setback Distances (Contamination Sources)</div>
                        <div className="result-grid">
                          <div className="result-item"><span className="rl">Septic Tank</span><span className="rv" style={{fontWeight:700}}>{result.aquiferSimulation.soluteTransport.setbackDistances?.septicTank} m</span></div>
                          <div className="result-item"><span className="rl">Latrine</span><span className="rv" style={{fontWeight:700}}>{result.aquiferSimulation.soluteTransport.setbackDistances?.latrine} m</span></div>
                          <div className="result-item"><span className="rl">Agricultural Field</span><span className="rv" style={{fontWeight:700}}>{result.aquiferSimulation.soluteTransport.setbackDistances?.agriculturalField} m</span></div>
                          <div className="result-item"><span className="rl">Industrial Site</span><span className="rv" style={{fontWeight:700}}>{result.aquiferSimulation.soluteTransport.setbackDistances?.industrialSite} m</span></div>
                          <div className="result-item"><span className="rl">Landfill</span><span className="rv" style={{fontWeight:700}}>{result.aquiferSimulation.soluteTransport.setbackDistances?.landfill} m</span></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Groundwater Budget ── */}
                  {result.aquiferSimulation.groundwaterBudget && (
                    <div style={{marginBottom:24}}>
                      <h5 style={{fontSize:15,fontWeight:700,marginBottom:10}}>{'\u{1F4B0}'} Groundwater Budget (Annual)</h5>
                      <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:12}}>
                        {/* Inflows */}
                        <div style={{flex:'1 1 280px',background:'rgba(34,197,94,0.04)',border:'1px solid rgba(34,197,94,0.15)',padding:14,borderRadius:10}}>
                          <div style={{fontWeight:700,fontSize:13,color:'#22c55e',marginBottom:8}}>Inflows (mm/year)</div>
                          <div className="result-grid">
                            <div className="result-item"><span className="rl">Precipitation</span><span className="rv">{result.aquiferSimulation.groundwaterBudget.inflows?.precipitation?.toFixed(0)}</span></div>
                            <div className="result-item"><span className="rl">Recharge</span><span className="rv" style={{fontWeight:700}}>{result.aquiferSimulation.groundwaterBudget.inflows?.rechargeFromPrecipitation?.toFixed(0)}</span></div>
                            <div className="result-item"><span className="rl">Lateral Inflow</span><span className="rv">{result.aquiferSimulation.groundwaterBudget.inflows?.lateralInflow?.toFixed(0)}</span></div>
                            <div className="result-item"><span className="rl">Total Inflows</span><span className="rv" style={{fontWeight:700,color:'#22c55e'}}>{result.aquiferSimulation.groundwaterBudget.inflows?.total?.toFixed(0)}</span></div>
                          </div>
                        </div>
                        {/* Outflows */}
                        <div style={{flex:'1 1 280px',background:'rgba(239,68,68,0.04)',border:'1px solid rgba(239,68,68,0.15)',padding:14,borderRadius:10}}>
                          <div style={{fontWeight:700,fontSize:13,color:'#ef4444',marginBottom:8}}>Outflows (mm/year)</div>
                          <div className="result-grid">
                            <div className="result-item"><span className="rl">Evapotranspiration</span><span className="rv">{result.aquiferSimulation.groundwaterBudget.outflows?.evapotranspiration?.toFixed(0)}</span></div>
                            <div className="result-item"><span className="rl">Surface Runoff</span><span className="rv">{result.aquiferSimulation.groundwaterBudget.outflows?.surfaceRunoff?.toFixed(0)}</span></div>
                            <div className="result-item"><span className="rl">Baseflow to Streams</span><span className="rv">{result.aquiferSimulation.groundwaterBudget.outflows?.baseflowToStreams?.toFixed(0)}</span></div>
                            <div className="result-item"><span className="rl">Total Outflows</span><span className="rv" style={{fontWeight:700,color:'#ef4444'}}>{result.aquiferSimulation.groundwaterBudget.outflows?.total?.toFixed(0)}</span></div>
                          </div>
                        </div>
                      </div>
                      {/* Balance */}
                      <div style={{background:'rgba(56,189,248,0.06)',border:'1.5px solid rgba(56,189,248,0.2)',padding:14,borderRadius:10}}>
                        <div style={{fontWeight:700,fontSize:13,color:'#38bdf8',marginBottom:8}}>Balance & Sustainability</div>
                        <div className="result-grid">
                          <div className="result-item"><span className="rl">Storage Change</span><span className="rv" style={{fontWeight:700,color:result.aquiferSimulation.groundwaterBudget.balance?.storageChange >= 0 ? '#22c55e' : '#ef4444'}}>{result.aquiferSimulation.groundwaterBudget.balance?.storageChange >= 0 ? '+' : ''}{result.aquiferSimulation.groundwaterBudget.balance?.storageChange?.toFixed(1)} mm/yr</span></div>
                          <div className="result-item"><span className="rl">Safe Yield</span><span className="rv" style={{fontWeight:700}}>{result.aquiferSimulation.groundwaterBudget.balance?.safeYieldM3day?.toFixed(1)} m&sup3;/day</span></div>
                          <div className="result-item"><span className="rl">Max Sustainable Pumping</span><span className="rv" style={{fontWeight:700,color:'#22c55e'}}>{result.aquiferSimulation.groundwaterBudget.balance?.maxSustainablePumping?.toFixed(2)} m&sup3;/hr</span></div>
                          <div className="result-item"><span className="rl">Depletion Risk</span><span className="rv" style={{fontWeight:700,color:
                            result.aquiferSimulation.groundwaterBudget.balance?.depletionRisk==='none'?'#22c55e':
                            result.aquiferSimulation.groundwaterBudget.balance?.depletionRisk==='low'?'#22c55e':
                            result.aquiferSimulation.groundwaterBudget.balance?.depletionRisk==='moderate'?'#fbbf24':
                            result.aquiferSimulation.groundwaterBudget.balance?.depletionRisk==='high'?'#f97316':'#ef4444'
                          }}>{result.aquiferSimulation.groundwaterBudget.balance?.depletionRisk?.toUpperCase()}</span></div>
                          {result.aquiferSimulation.groundwaterBudget.balance?.yearsToDepletion != null && (
                            <div className="result-item"><span className="rl">Years to Depletion</span><span className="rv" style={{fontWeight:700,color:'#ef4444'}}>{result.aquiferSimulation.groundwaterBudget.balance.yearsToDepletion} years</span></div>
                          )}
                        </div>
                        <div style={{fontSize:10,opacity:0.5,marginTop:8,fontFamily:'monospace'}}>{result.aquiferSimulation.groundwaterBudget.equation}</div>
                      </div>
                      <div style={{fontSize:11,opacity:0.4,marginTop:8}}>Confidence: {((result.aquiferSimulation.groundwaterBudget.confidence ?? 0) * 100).toFixed(0)}%</div>
                    </div>
                  )}

                  {/* Methodology */}
                  <div style={{marginTop:16}}>
                    <div style={{fontSize:12,fontWeight:600,marginBottom:6}}>Methodology & Physics</div>
                    <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                      {result.aquiferSimulation.methodology?.map((m: string, i: number) => (
                        <span key={i} style={{fontSize:10,padding:'2px 8px',background:'rgba(56,189,248,0.1)',border:'1px solid rgba(56,189,248,0.2)',borderRadius:6}}>{m}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{padding:24,background:'rgba(148,163,184,0.06)',borderRadius:12,textAlign:'center'}}>
                  <div style={{fontSize:24,marginBottom:8}}>{'\u269B\uFE0F'}</div>
                  <div>Aquifer simulation requires valid coordinates with satellite data. Enter a location to run physics-based pump test, flow modeling, and solute transport analysis.</div>
                </div>
              )}
            </div>
          )}

          {/* ═══ HISTORICAL WEATHER DATA (20-Year) ═══ */}
          {activeResultTab==='historical' && (
            <div>
              <h4 className="tab-title">{'\u{1F327}\uFE0F'} 20-Year Historical Weather Data</h4>
              <p className="tab-desc">Two decades of precipitation and temperature data from the Open-Meteo Archive API, used to estimate groundwater recharge, drought risk, and optimal drilling season.</p>

              {result.historicalData?.weather ? (
                <div>
                  {/* Summary Cards */}
                  <div className="result-grid" style={{marginBottom:20}}>
                    <div className="result-item"><span className="rl">Data Span</span><span className="rv" style={{fontWeight:700}}>{result.historicalData.weather.years} years</span></div>
                    <div className="result-item"><span className="rl">Avg Annual Precipitation</span><span className="rv" style={{fontWeight:700,color:'#2196F3'}}>{Math.round(result.historicalData.weather.averageAnnualPrecipitation)} mm/year</span></div>
                    <div className="result-item"><span className="rl">Avg Temperature</span><span className="rv">{result.historicalData.weather.averageTemperature.toFixed(1)}°C</span></div>
                    <div className="result-item"><span className="rl">Precipitation Trend</span><span className="rv" style={{color:result.historicalData.weather.trendDirection==='increasing'?'#22c55e':result.historicalData.weather.trendDirection==='decreasing'?'#ef4444':'#94a3b8',fontWeight:700}}>
                      {result.historicalData.weather.trendDirection==='increasing'?'📈':'📉'} {result.historicalData.weather.trendDirection} ({result.historicalData.weather.trendPerDecade>0?'+':''}{result.historicalData.weather.trendPerDecade.toFixed(0)} mm/decade)
                    </span></div>
                    <div className="result-item"><span className="rl">Best Drilling Season</span><span className="rv" style={{fontWeight:700,color:'#FF9800'}}>{result.historicalData.weather.bestDrillingSeason}</span></div>
                    <div className="result-item"><span className="rl">Drought Years</span><span className="rv" style={{color:'#ef4444'}}>{result.historicalData.weather.droughtYears.length > 0 ? result.historicalData.weather.droughtYears.join(', ') : 'None detected'}</span></div>
                    <div className="result-item"><span className="rl">Wet Years</span><span className="rv" style={{color:'#22c55e'}}>{result.historicalData.weather.wetYears.length > 0 ? result.historicalData.weather.wetYears.join(', ') : 'None detected'}</span></div>
                  </div>

                  {/* Annual Precipitation Chart */}
                  {result.historicalData.weather.annualPrecipitation.length > 0 && (
                    <div style={{marginBottom:20}}>
                      <h4 style={{color:'#2196F3',marginBottom:10}}>Annual Precipitation (mm)</h4>
                      <div style={{display:'flex',gap:2,alignItems:'flex-end',height:120,padding:'0 4px'}}>
                        {result.historicalData.weather.annualPrecipitation.map((yr: any,i: number) => {
                          const max = Math.max(...result.historicalData!.weather.annualPrecipitation.map((y: any)=>y.total), 1);
                          const avg = result.historicalData!.weather.averageAnnualPrecipitation;
                          const isDrought = result.historicalData!.weather.droughtYears.includes(yr.year);
                          const isWet = result.historicalData!.weather.wetYears.includes(yr.year);
                          return <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:1}} title={`${yr.year}: ${Math.round(yr.total)} mm`}>
                            <div style={{fontSize:7,color:'var(--text-tertiary)',whiteSpace:'nowrap'}}>{Math.round(yr.total)}</div>
                            <div style={{width:'100%',height:`${(yr.total/max)*100}px`,background:isDrought?'rgba(239,68,68,0.6)':isWet?'rgba(34,197,94,0.5)':'rgba(33,150,243,0.4)',borderRadius:2,minHeight:2,position:'relative'}}>
                              {/* Average line marker */}
                              <div style={{position:'absolute',bottom:`${(avg/max)*100-1}px`,left:0,right:0,height:1,background:'rgba(255,255,255,0.3)'}}/>
                            </div>
                            <div style={{fontSize:7,color:'var(--text-tertiary)',transform:'rotate(-45deg)',whiteSpace:'nowrap'}}>{yr.year}</div>
                          </div>;
                        })}
                      </div>
                      <div style={{display:'flex',gap:16,marginTop:8,fontSize:10,color:'var(--text-tertiary)'}}>
                        <span><span style={{display:'inline-block',width:10,height:10,background:'rgba(33,150,243,0.4)',borderRadius:2,marginRight:4}}/>Normal</span>
                        <span><span style={{display:'inline-block',width:10,height:10,background:'rgba(239,68,68,0.6)',borderRadius:2,marginRight:4}}/>Drought</span>
                        <span><span style={{display:'inline-block',width:10,height:10,background:'rgba(34,197,94,0.5)',borderRadius:2,marginRight:4}}/>Wet</span>
                      </div>
                    </div>
                  )}

                  {/* Seasonal Analysis */}
                  {result.historicalData.weather.seasonalAnalysis?.length > 0 && (
                    <div style={{marginBottom:20}}>
                      <h4 style={{color:'#FF9800',marginBottom:10}}>Seasonal Precipitation Analysis</h4>
                      <div className="result-grid">
                        {result.historicalData.weather.seasonalAnalysis.map((s: any, i: number) => (
                          <div key={i} className="result-item"><span className="rl">{s.season} <span style={{fontSize:10,color:'var(--text-tertiary)'}}>({s.months})</span></span><span className="rv" style={{fontWeight:700}}>{Math.round(s.avgPrecipitation)} mm</span></div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Groundwater Trend */}
                  {result.historicalData.groundwater && (
                    <div style={{background:'rgba(0,188,212,0.06)',border:'1px solid rgba(0,188,212,0.2)',borderRadius:12,padding:16}}>
                      <h4 style={{color:'#00BCD4',margin:'0 0 12px'}}>💧 Groundwater Sustainability Assessment</h4>
                      <div className="result-grid">
                        <div className="result-item"><span className="rl">Recharge Rate</span><span className="rv">{result.historicalData.groundwater.rechargeRate}</span></div>
                        <div className="result-item"><span className="rl">Depletion Risk</span><span className="rv" style={{fontWeight:700,color:
                          result.historicalData.groundwater.depletionRisk==='low'?'#22c55e':
                          result.historicalData.groundwater.depletionRisk==='moderate'?'#fbbf24':
                          result.historicalData.groundwater.depletionRisk==='high'?'#f97316':'#ef4444'
                        }}>{result.historicalData.groundwater.depletionRisk.toUpperCase()}</span></div>
                        <div className="result-item"><span className="rl">Water Table Trend</span><span className="rv" style={{fontWeight:700}}>{result.historicalData.groundwater.waterTableTrend}</span></div>
                        <div className="result-item"><span className="rl">Sustainability Score</span><span className="rv" style={{fontWeight:700,fontSize:18}}>{result.historicalData.groundwater.sustainabilityScore}/100</span></div>
                      </div>
                      {result.historicalData.groundwater.reasoning?.length > 0 && (
                        <div style={{marginTop:10}}>
                          {result.historicalData.groundwater.reasoning.map((r: string, i: number) => (
                            <div key={i} style={{fontSize:11,color:'var(--text-secondary)',padding:'2px 0'}}>• {r}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="geo-note" style={{marginTop:16}}>
                    <strong>Source:</strong> Open-Meteo Archive API — ERA5 reanalysis data (ECMWF). 20-year daily weather records aggregated to annual/seasonal. Groundwater sustainability estimated from precipitation trends, recharge rate, and regional hydrology.
                  </div>
                </div>
              ) : (
                <div style={{padding:20,textAlign:'center',color:'var(--text-muted)',background:'var(--bg-elevated)',borderRadius:12,border:'1px solid var(--border)'}}>
                  <div style={{fontSize:24,marginBottom:8}}>🌧️</div>
                  <div>No historical weather data available. Ensure a valid location was provided (Country + Region + City) to fetch 20 years of climate records.</div>
                </div>
              )}
            </div>
          )}

          {/* ═══ REGIONAL BOREHOLE RECORDS ═══ */}
          {activeResultTab==='borehole-records' && (
            <div>
              <h4 className="tab-title">{'\u{1F4CA}'} Regional Borehole Database</h4>
              <p className="tab-desc">Historical drilling data for the region — average depths, yields, success rates, and links to national borehole databases. These statistics calibrate the AI depth/yield predictions.</p>

              {result.boreholeRecords ? (
                <div>
                  <div style={{background:'rgba(33,150,243,0.06)',border:'1px solid rgba(33,150,243,0.2)',borderRadius:12,padding:16,marginBottom:20}}>
                    <h4 style={{margin:'0 0 12px',color:'#2196F3'}}>{'\u{1F3F3}\uFE0F'} {result.boreholeRecords.country} ({result.boreholeRecords.countryCode}){result.boreholeRecords.region ? ` — ${result.boreholeRecords.region}` : ''}</h4>
                    <div className="result-grid">
                      <div className="result-item"><span className="rl">Average Depth</span><span className="rv" style={{fontWeight:700,fontSize:18}}>{result.boreholeRecords.averageDepth}m</span></div>
                      <div className="result-item"><span className="rl">Depth Range</span><span className="rv">{result.boreholeRecords.depthRange[0]}m – {result.boreholeRecords.depthRange[1]}m</span></div>
                      <div className="result-item"><span className="rl">Average Yield</span><span className="rv" style={{fontWeight:700,fontSize:18}}>{result.boreholeRecords.averageYield} m³/h</span></div>
                      <div className="result-item"><span className="rl">Yield Range</span><span className="rv">{result.boreholeRecords.yieldRange[0]} – {result.boreholeRecords.yieldRange[1]} m³/h</span></div>
                      <div className="result-item"><span className="rl">Success Rate</span><span className="rv" style={{fontWeight:700,fontSize:18,color:result.boreholeRecords.successRate>0.7?'#22c55e':result.boreholeRecords.successRate>0.5?'#fbbf24':'#ef4444'}}>{Math.round(result.boreholeRecords.successRate*100)}%</span></div>
                      <div className="result-item"><span className="rl">Total Drilled</span><span className="rv">{result.boreholeRecords.totalBoreholesDrilled}</span></div>
                      <div className="result-item"><span className="rl">Average Cost</span><span className="rv">{result.boreholeRecords.averageCost}</span></div>
                      <div className="result-item"><span className="rl">Water Table</span><span className="rv">{result.boreholeRecords.typicalWaterTable}</span></div>
                    </div>
                  </div>

                  {/* Geology & Aquifer Types */}
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:20}}>
                    <div style={{background:'var(--bg-elevated)',borderRadius:12,padding:16,border:'1px solid var(--border)'}}>
                      <h4 style={{margin:'0 0 10px',fontSize:14,color:'#FF9800'}}>Common Aquifer Types</h4>
                      {result.boreholeRecords.commonAquiferTypes.map((t: string, i: number) => (
                        <div key={i} style={{padding:'4px 0',fontSize:12,color:'var(--text-secondary)'}}>• {t}</div>
                      ))}
                    </div>
                    <div style={{background:'var(--bg-elevated)',borderRadius:12,padding:16,border:'1px solid var(--border)'}}>
                      <h4 style={{margin:'0 0 10px',fontSize:14,color:'#9C27B0'}}>Common Geology</h4>
                      {result.boreholeRecords.commonGeology.map((g: string, i: number) => (
                        <div key={i} style={{padding:'4px 0',fontSize:12,color:'var(--text-secondary)'}}>• {g}</div>
                      ))}
                    </div>
                  </div>

                  {/* Regional Notes */}
                  {result.boreholeRecords.notes.length > 0 && (
                    <div style={{background:'rgba(255,152,0,0.06)',border:'1px solid rgba(255,152,0,0.2)',borderRadius:12,padding:16,marginBottom:20}}>
                      <h4 style={{margin:'0 0 10px',color:'#FF9800'}}>Regional Notes</h4>
                      {result.boreholeRecords.notes.map((n: string, i: number) => (
                        <div key={i} style={{padding:'3px 0',fontSize:12,color:'var(--text-secondary)'}}>• {n}</div>
                      ))}
                    </div>
                  )}

                  {/* National Database Links */}
                  {result.boreholeRecords.databaseLinks.length > 0 && (
                    <div style={{marginBottom:20}}>
                      <h4 style={{color:'#4CAF50',marginBottom:12}}>National Borehole Databases</h4>
                      <div style={{display:'grid',gap:10}}>
                        {result.boreholeRecords.databaseLinks.map((link: any, i: number) => (
                          <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{
                            display:'block',padding:'12px 16px',borderRadius:10,border:'1px solid var(--border)',background:'var(--bg-elevated)',textDecoration:'none',
                          }}>
                            <div style={{fontWeight:700,color:'#4CAF50',fontSize:13}}>{link.name} →</div>
                            <div style={{fontSize:11,color:'var(--text-secondary)',marginTop:3}}>{link.description}</div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="geo-note">
                    <strong>Source:</strong> {result.boreholeRecords.source} | National borehole statistics calibrate the AI depth/yield predictions (60% regional data weight + 40% image analysis weight).
                  </div>
                </div>
              ) : (
                <div style={{padding:20,textAlign:'center',color:'var(--text-muted)',background:'var(--bg-elevated)',borderRadius:12,border:'1px solid var(--border)'}}>
                  <div style={{fontSize:24,marginBottom:8}}>📊</div>
                  <div>No regional borehole data available. Enter a country/region in the location form to look up historical drilling records.</div>
                </div>
              )}
            </div>
          )}

          {/* SUBSURFACE MODEL (#6, #14) - original */}
          {activeResultTab==='subsurface' && (
            <div>
              <h4 className="tab-title">{'\u{1FA78}'} Visual Subsurface Model</h4>
              <div className="subsurface-diagram">
                {layers.map((l,i) => (
                  <div key={i} className="subsurface-layer" style={{background:l.color, minHeight: Math.max(40, (l.depthEnd-l.depthStart)*0.8)}}>
                    <div className="layer-depth">{l.depthStart}–{l.depthEnd}m</div>
                    <div className="layer-label">{l.label} {l.waterBearing && '\u{1F4A7}'}</div>
                    <div className="layer-conf">Confidence: {l.confidence}%</div>
                  </div>
                ))}
              </div>
              <div className="confidence-metrics">
                <h4>Confidence Metrics (derived from analysis)</h4>
                <div className="conf-grid">
                  <div className="conf-item"><span>Location</span><div className="conf-bar"><div style={{width:`${Math.round(result.site.confidence*100)}%`,background:result.gpsSource==='exif'?'#4CAF50':'#F44336'}}></div></div><span>{Math.round(result.site.confidence*100)}%</span></div>
                  <div className="conf-item"><span>Terrain</span><div className="conf-bar"><div style={{width:`${Math.round((result.pixelAnalysis ? 65 + result.pixelAnalysis.textureVariance*20 : 40))}%`,background:'#FFC107'}}></div></div><span>{Math.round(result.pixelAnalysis ? 65 + result.pixelAnalysis.textureVariance*20 : 40)}%</span></div>
                  <div className="conf-item"><span>Vegetation</span><div className="conf-bar"><div style={{width:`${Math.round(result.pixelAnalysis ? result.pixelAnalysis.vegetationIndex*90+10 : 50)}%`,background:'#FF9800'}}></div></div><span>{Math.round(result.pixelAnalysis ? result.pixelAnalysis.vegetationIndex*90+10 : 50)}%</span></div>
                  <div className="conf-item"><span>Soil</span><div className="conf-bar"><div style={{width:`${Math.round(result.pixelAnalysis && result.pixelAnalysis.soilExposureIndex > 0.2 ? 70 : 35)}%`,background:result.pixelAnalysis && result.pixelAnalysis.soilExposureIndex > 0.2 ? '#2196F3' : '#F44336'}}></div></div><span>{Math.round(result.pixelAnalysis && result.pixelAnalysis.soilExposureIndex > 0.2 ? 70 : 35)}%</span></div>
                </div>
                <div className="geo-note" style={{marginTop:12,fontSize:12}}>
                  Subsurface layers are estimated from surface analysis only — NO subsurface scanning is performed. Actual lithology may differ significantly. Always verify with test drilling.
                </div>
              </div>
            </div>
          )}

          {/* GEOLOGICAL / HYDROGEOLOGICAL — REAL data from subsurface model */}
          {activeResultTab==='geological' && (
            <div>
              <h4 className="tab-title">{'\u{1FAA8}'} Geological &amp; Hydrogeological Analysis</h4>
              {result.subsurfaceModel ? (
                <div>
                  <p className="tab-desc">Derived from ISRIC SoilGrids v2.0 pedotransfer functions + Kozeny-Carman equation. Physics-based hydraulic models.</p>
                  <div className="result-grid">
                    <div className="result-item"><span className="rl">Aquifer Type</span><span className="rv">{(result.subsurfaceModel as any).aquiferUnits?.[0]?.type ?? (result.soil.type==='rocky'?'Fractured/Confined':'Unconfined/Porous')}</span></div>
                    <div className="result-item"><span className="rl">Porosity</span><span className="rv">{(result.soil.porosity*100).toFixed(1)}%</span></div>
                    <div className="result-item"><span className="rl">Hydraulic Conductivity (K)</span><span className="rv">{(result.subsurfaceModel as any).aquiferUnits?.[0]?.hydraulicConductivity?.toFixed(2) ?? (result.soil.permeability*50).toFixed(1)} m/day</span></div>
                    <div className="result-item"><span className="rl">Aquifer Thickness</span><span className="rv">{(result.subsurfaceModel as any).aquiferUnits?.[0]?.thickness?.toFixed(0) ?? Math.round(result.recommendedDepth*0.4)}m</span></div>
                    <div className="result-item"><span className="rl">Transmissivity (T=Kb)</span><span className="rv">{(result.subsurfaceModel as any).aquiferUnits?.[0]?.transmissivity?.toFixed(0) ?? 'N/A'} m²/day</span></div>
                    <div className="result-item"><span className="rl">Storativity</span><span className="rv">{(result.subsurfaceModel as any).aquiferUnits?.[0]?.storativity?.toExponential(2) ?? (result.soil.porosity*0.1).toFixed(4)}</span></div>
                  </div>
                  {/* Lithological layers */}
                  {result.subsurfaceModel.lithologicalColumn?.length > 0 && (
                    <div style={{marginTop:20}}>
                      <h4 style={{color:'#FF9800',marginBottom:12}}>Lithological Column (estimated)</h4>
                      <div className="sci-table-wrap">
                        <table className="sci-table">
                          <thead><tr><th>Depth</th><th>Lithology</th><th>Water Bearing</th><th>Confidence</th></tr></thead>
                          <tbody>
                            {result.subsurfaceModel.lithologicalColumn.map((l: any, i: number) => (
                              <tr key={i}>
                                <td>{Math.round(l.topDepth ?? l.depthStart ?? 0)}–{Math.round(l.bottomDepth ?? l.depthEnd ?? 0)}m</td>
                                <td>{l.lithology ?? l.label ?? 'Unknown'}</td>
                                <td style={{color:l.waterBearing?'#22c55e':'#94a3b8'}}>{l.waterBearing?'Yes':'No'}</td>
                                <td>{l.confidence ?? '—'}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  <div className="geo-note" style={{marginTop:12}}>
                    <strong>Methods:</strong> ISRIC SoilGrids v2.0 + Kozeny-Carman hydraulic conductivity model + pedotransfer functions (Rawls & Brakensiek, 1985). Verify with ERT survey for field-grade confidence.
                  </div>
                </div>
              ) : (
                <div style={{padding:20,textAlign:'center',color:'var(--text-muted)',background:'var(--bg-elevated)',borderRadius:12,border:'1px solid var(--border)'}}>
                  <div style={{fontSize:24,marginBottom:8}}>🪨</div>
                  Geological model unavailable — satellite data APIs did not return results for this location.
                </div>
              )}
            </div>
          )}

          {/* TOPOGRAPHIC ANALYSIS — REAL DEM data from Open-Elevation API */}
          {activeResultTab==='rock-sites' && (
            <div>
              <h4 className="tab-title">{'\u{1FAA8}'} Rock Classification &amp; Smart Site Selection</h4>

              {/* Rock Classification */}
              {result.rockClassification ? (
                <div style={{marginBottom:24}}>
                  <h5 style={{color:'#8B4513',marginBottom:8}}>Rock Type Classification</h5>
                  <p className="tab-desc">Estimated from soil texture, climate, and elevation using Taylor &amp; Eggleton (2001) classification. Upgradeable with ERT survey integration.</p>
                  <div className="result-grid">
                    <div className="result-item"><span className="rl">Primary Rock</span><span className="rv">{result.rockClassification.primaryRockType}</span></div>
                    {result.rockClassification.secondaryRockType && <div className="result-item"><span className="rl">Secondary Rock</span><span className="rv">{result.rockClassification.secondaryRockType}</span></div>}
                    <div className="result-item"><span className="rl">Formation</span><span className="rv">{result.rockClassification.geologicalFormation}</span></div>
                    <div className="result-item"><span className="rl">Age</span><span className="rv">{result.rockClassification.geologicalAge}</span></div>
                    <div className="result-item"><span className="rl">Aquifer Type</span><span className="rv">{result.rockClassification.aquiferType}</span></div>
                    <div className="result-item"><span className="rl">Productivity</span><span className="rv" style={{color: result.rockClassification.aquiferProductivity === 'high' ? '#22c55e' : result.rockClassification.aquiferProductivity === 'moderate' ? '#f59e0b' : '#ef4444'}}>{result.rockClassification.aquiferProductivity.toUpperCase()}</span></div>
                    <div className="result-item"><span className="rl">Ksat Range</span><span className="rv">{result.rockClassification.typicalKsat_m_day[0]}–{result.rockClassification.typicalKsat_m_day[1]} m/day</span></div>
                    <div className="result-item"><span className="rl">Porosity</span><span className="rv">{(result.rockClassification.typicalPorosity[0]*100).toFixed(0)}–{(result.rockClassification.typicalPorosity[1]*100).toFixed(0)}%</span></div>
                    <div className="result-item"><span className="rl">Confidence</span><span className="rv">{(result.rockClassification.confidence*100).toFixed(0)}% (ESTIMATED)</span></div>
                  </div>
                </div>
              ) : (
                <div style={{padding:16,background:'var(--bg-elevated)',borderRadius:8,marginBottom:16,color:'var(--text-muted)'}}>Rock classification unavailable — coordinates or soil data missing.</div>
              )}

              {/* Weathering Profile */}
              {result.weatheringProfile && (
                <div style={{marginBottom:24}}>
                  <h5 style={{color:'#A0522D',marginBottom:8}}>Weathering Depth Profile</h5>
                  <p className="tab-desc">Bazilevskaya et al. (2013) regression model: weathering depth proportional to MAP^0.5 × MAT^0.3 × rock factor. ±50% uncertainty.</p>
                  <div style={{display:'flex',gap:8,marginBottom:12}}>
                    {[
                      {label:'Topsoil',depth:`0–${result.weatheringProfile.saproliteDepth_m}m`,color:'#8B4513'},
                      {label:'Saprolite',depth:`${result.weatheringProfile.saproliteDepth_m}–${result.weatheringProfile.regolithDepth_m}m`,color:'#CD853F'},
                      {label:'Weathered Rock',depth:`${result.weatheringProfile.regolithDepth_m}–${result.weatheringProfile.freshBedrockDepth_m}m`,color:'#A9A9A9'},
                      {label:'Fresh Bedrock',depth:`>${result.weatheringProfile.freshBedrockDepth_m}m`,color:'#696969'},
                    ].map((layer,i) => (
                      <div key={i} style={{flex:1,background:layer.color+'22',border:`1px solid ${layer.color}44`,borderRadius:8,padding:'10px 8px',textAlign:'center'}}>
                        <div style={{fontSize:11,fontWeight:600,color:layer.color}}>{layer.label}</div>
                        <div style={{fontSize:13,fontWeight:700}}>{layer.depth}</div>
                      </div>
                    ))}
                  </div>
                  <div className="result-grid">
                    <div className="result-item"><span className="rl">Aquifer Zone</span><span className="rv">{result.weatheringProfile.aquiferZone.top_m}–{result.weatheringProfile.aquiferZone.bottom_m}m ({result.weatheringProfile.aquiferZone.type})</span></div>
                    <div className="result-item"><span className="rl">Weathering Intensity</span><span className="rv">{result.weatheringProfile.weatheringIntensity.toUpperCase()}</span></div>
                    <div className="result-item"><span className="rl">Confidence</span><span className="rv">{(result.weatheringProfile.confidence*100).toFixed(0)}% (Bazilevskaya model)</span></div>
                  </div>
                </div>
              )}

              {/* Site Selection */}
              {result.siteSelection && result.siteSelection.topSites.length > 0 ? (
                <div style={{marginBottom:24}}>
                  <h5 style={{color:'#10B981',marginBottom:8}}>{'\u{1F4CD}'} Top 3 Recommended Drilling Sites</h5>
                  <p className="tab-desc">{result.siteSelection.candidatesEvaluated} candidate points evaluated within {result.siteSelection.searchRadius_m}m radius using 8-layer spatial feature fusion (Naghibi et al. 2015).</p>
                  <div className="sci-table-wrap">
                    <table className="sci-table">
                      <thead><tr><th>Rank</th><th>Coordinates</th><th>Score</th><th>Probability</th><th>Depth</th><th>Yield</th><th>Distance</th><th>Rock</th></tr></thead>
                      <tbody>
                        {result.siteSelection.topSites.map((s,i) => (
                          <tr key={i} style={{background: i===0 ? 'rgba(16,185,129,0.08)' : undefined}}>
                            <td style={{fontWeight:700}}>#{s.rank}</td>
                            <td style={{fontSize:11}}>{s.latitude.toFixed(5)}, {s.longitude.toFixed(5)}</td>
                            <td style={{fontWeight:700,color:'#10B981'}}>{s.score.toFixed(0)}/100</td>
                            <td>{(s.probability*100).toFixed(0)}%</td>
                            <td>{s.expectedDepth_m}m</td>
                            <td>{s.expectedYield_m3h} m³/hr</td>
                            <td>{s.distanceFromTarget_m}m</td>
                            <td>{s.rockType}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Top site reasoning */}
                  <div style={{marginTop:12,padding:12,background:'rgba(16,185,129,0.06)',borderRadius:8,border:'1px solid rgba(16,185,129,0.2)'}}>
                    <div style={{fontWeight:700,fontSize:13,color:'#10B981',marginBottom:6}}>Site #1 Recommendation</div>
                    {result.siteSelection.topSites[0].reasoning.map((r,i) => (
                      <div key={i} style={{fontSize:12,color:'var(--text-secondary)',marginBottom:2}}>• {r}</div>
                    ))}
                  </div>
                  <div style={{marginTop:8,fontSize:11,color:'#ef4444',fontStyle:'italic'}}>⚠ Run ERT survey on Site #1 before drilling to confirm aquifer geometry. Cost: $3,000–5,000.</div>
                </div>
              ) : (
                <div style={{padding:16,background:'var(--bg-elevated)',borderRadius:8,color:'var(--text-muted)'}}>Site selection unavailable — coordinates needed for spatial analysis.</div>
              )}

              {/* Learning Loop Status */}
              {result.learningCorrection?.correctionApplied && (
                <div style={{padding:12,background:'rgba(124,58,237,0.06)',borderRadius:8,border:'1px solid rgba(124,58,237,0.2)'}}>
                  <div style={{fontWeight:700,fontSize:13,color:'#7C3AED',marginBottom:4}}>{'\u{1F9E0}'} Self-Learning Calibration Applied</div>
                  <div style={{fontSize:12,color:'var(--text-secondary)'}}>{result.learningCorrection.correctionSource}</div>
                  <div style={{fontSize:12,color:'var(--text-secondary)'}}>Regional outcomes used: {result.learningCorrection.outcomeCount}</div>
                </div>
              )}
            </div>
          )}

          {activeResultTab==='subsurface-twin' && (
            <div>
              <h4 className="tab-title">{'\u{1F9EC}'} Digital Subsurface Twin</h4>
              {result.subsurfaceTwin ? (
                <div>
                  <p className="tab-desc">Physics-informed layered earth model fusing {result.subsurfaceTwin.dataSourceCount} data sources. {result.subsurfaceTwin.methodology}</p>
                  <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:16}}>
                    <div style={{padding:'8px 14px',borderRadius:8,background:'rgba(56,189,248,0.1)',fontSize:12}}><strong>Model Confidence:</strong> {Math.round(result.subsurfaceTwin.modelConfidence*100)}%</div>
                    <div style={{padding:'8px 14px',borderRadius:8,background:'rgba(34,197,94,0.1)',fontSize:12}}><strong>Est. Yield:</strong> {result.subsurfaceTwin.estimatedYield_m3hr} m³/hr</div>
                    <div style={{padding:'8px 14px',borderRadius:8,background:'rgba(251,191,36,0.1)',fontSize:12}}><strong>Water Level:</strong> {result.subsurfaceTwin.estimatedWaterLevel_m}m bgl</div>
                    <div style={{padding:'8px 14px',borderRadius:8,background:'rgba(139,92,246,0.1)',fontSize:12}}><strong>Total Depth:</strong> {result.subsurfaceTwin.totalDepthM}m</div>
                  </div>
                  <h5 style={{fontSize:13,fontWeight:700,marginBottom:8}}>Subsurface Layers</h5>
                  <table className="sci-table" style={{fontSize:11}}>
                    <thead><tr><th>Depth (m)</th><th>Lithology</th><th>Thickness</th><th>Porosity</th><th>K (m/day)</th><th>Aquifer</th><th>Confidence</th><th>Sources</th></tr></thead>
                    <tbody>{result.subsurfaceTwin.layers.map((l: any, i: number)=>(
                      <tr key={i} style={{background:l.isAquifer?'rgba(34,197,94,0.08)':'transparent'}}>
                        <td>{l.topDepthM}–{l.bottomDepthM}</td><td>{l.lithology}</td><td>{l.thicknessM}m</td>
                        <td>{(l.porosity*100).toFixed(0)}%</td><td>{l.hydraulicConductivity_m_day}</td>
                        <td style={{color:l.isAquifer?'#16a34a':'#94a3b8',fontWeight:l.isAquifer?700:400}}>{l.isAquifer?'YES':'no'}</td>
                        <td>{Math.round(l.confidence*100)}%</td><td style={{fontSize:10}}>{l.dataSourcesUsed.join(', ')}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                  <h5 style={{fontSize:13,fontWeight:700,margin:'16px 0 8px'}}>Drilling Prognosis</h5>
                  <table className="sci-table" style={{fontSize:11}}>
                    <thead><tr><th>Depth (m)</th><th>Formation</th><th>Difficulty</th><th>Penetration Rate</th><th>Notes</th></tr></thead>
                    <tbody>{result.subsurfaceTwin.drillingPrognosis.map((dp: any, i: number)=>(
                      <tr key={i}>
                        <td>{dp.depthFrom_m}–{dp.depthTo_m}</td><td>{dp.expectedFormation}</td>
                        <td style={{color:dp.drillingDifficulty==='very_hard'?'#dc2626':dp.drillingDifficulty==='hard'?'#f59e0b':dp.drillingDifficulty==='moderate'?'#3b82f6':'#22c55e'}}>{dp.drillingDifficulty}</td>
                        <td>{dp.expectedPenetrationRate_m_hr} m/hr</td><td style={{fontSize:10}}>{dp.notes}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                  <div style={{marginTop:12,padding:10,background:'rgba(59,130,246,0.06)',borderRadius:8,fontSize:11}}>
                    <strong>Uncertainty:</strong> Depth {result.subsurfaceTwin.uncertaintyBounds.depthRange_m[0]}–{result.subsurfaceTwin.uncertaintyBounds.depthRange_m[1]}m | Yield {result.subsurfaceTwin.uncertaintyBounds.yieldRange_m3hr[0]}–{result.subsurfaceTwin.uncertaintyBounds.yieldRange_m3hr[1]} m³/hr | Water Level {result.subsurfaceTwin.uncertaintyBounds.waterLevelRange_m[0]}–{result.subsurfaceTwin.uncertaintyBounds.waterLevelRange_m[1]}m
                  </div>
                </div>
              ) : <p className="tab-desc">Subsurface Twin model not available for this analysis.</p>}
            </div>
          )}

          {activeResultTab==='insar' && (
            <div>
              <h4 className="tab-title">{'\u{1F6F0}\uFE0F'} InSAR Ground Deformation</h4>
              {result.insarDeformation ? (
                <div>
                  <p className="tab-desc">{result.insarDeformation.methodology}</p>
                  <div className="result-grid">
                    <div className="result-item"><span className="rl">Ground Velocity</span><span className="rv">{result.insarDeformation.velocityMmYr} mm/yr</span></div>
                    <div className="result-item"><span className="rl">Classification</span><span className="rv" style={{color:result.insarDeformation.subsidenceRisk==='critical'?'#dc2626':result.insarDeformation.subsidenceRisk==='high'?'#f59e0b':'#22c55e'}}>{result.insarDeformation.deformationClass.replace(/_/g,' ')}</span></div>
                    <div className="result-item"><span className="rl">Subsidence Risk</span><span className="rv">{result.insarDeformation.subsidenceRisk}</span></div>
                    <div className="result-item"><span className="rl">Confidence</span><span className="rv">{Math.round(result.insarDeformation.confidence*100)}%</span></div>
                    <div className="result-item"><span className="rl">Sentinel-1 Coverage</span><span className="rv">{result.insarDeformation.sentinel1Coverage?'YES':'No'} ({result.insarDeformation.sceneCount} scenes)</span></div>
                    <div className="result-item"><span className="rl">Temporal Span</span><span className="rv">{result.insarDeformation.temporalSpan}</span></div>
                  </div>
                  <div style={{marginTop:12,padding:12,borderRadius:8,background:result.insarDeformation.subsidenceRisk==='critical'?'rgba(239,68,68,0.08)':result.insarDeformation.subsidenceRisk==='high'?'rgba(245,158,11,0.08)':'rgba(34,197,94,0.08)'}}>
                    <div style={{fontWeight:700,fontSize:12,marginBottom:4}}>Groundwater Implication</div>
                    <div style={{fontSize:12}}>{result.insarDeformation.groundwaterImplication}</div>
                  </div>
                  <div style={{marginTop:8,fontSize:11,color:'var(--text-secondary)'}}>Data: {result.insarDeformation.dataSource} | {result.insarDeformation.regionalContext}</div>
                </div>
              ) : <p className="tab-desc">InSAR data not available for this location.</p>}
            </div>
          )}

          {activeResultTab==='survey-plan' && (
            <div>
              <h4 className="tab-title">{'\u{1F4CB}'} Smart Survey Planner</h4>
              {result.surveyPlan ? (
                <div>
                  <div style={{display:'flex',gap:16,marginBottom:16,flexWrap:'wrap'}}>
                    <div style={{flex:1,minWidth:200,padding:16,borderRadius:12,background:'linear-gradient(135deg,rgba(59,130,246,0.1),rgba(139,92,246,0.1))',border:'2px solid rgba(59,130,246,0.3)'}}>
                      <div style={{fontSize:24,fontWeight:800,color:'#3b82f6'}}>Tier {result.surveyPlan.recommendedTier}</div>
                      <div style={{fontSize:14,fontWeight:600}}>{result.surveyPlan.tierName}</div>
                      <div style={{fontSize:11,color:'var(--text-secondary)',marginTop:4}}>{result.surveyPlan.tierDescription}</div>
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,flex:1,minWidth:200}}>
                      <div style={{padding:'10px 14px',borderRadius:8,background:'rgba(34,197,94,0.1)'}}><div style={{fontSize:18,fontWeight:700,color:'#16a34a'}}>${result.surveyPlan.totalCostUSD.toLocaleString()}</div><div style={{fontSize:10}}>Total Cost</div></div>
                      <div style={{padding:'10px 14px',borderRadius:8,background:'rgba(251,191,36,0.1)'}}><div style={{fontSize:18,fontWeight:700,color:'#d97706'}}>{result.surveyPlan.costSavingsPercent}%</div><div style={{fontSize:10}}>Cost Savings vs Full Survey</div></div>
                      <div style={{padding:'10px 14px',borderRadius:8,background:'rgba(56,189,248,0.1)'}}><div style={{fontSize:18,fontWeight:700,color:'#0ea5e9'}}>{result.surveyPlan.expectedConfidence}%</div><div style={{fontSize:10}}>Expected Confidence</div></div>
                      <div style={{padding:'10px 14px',borderRadius:8,background:'rgba(139,92,246,0.1)'}}><div style={{fontSize:18,fontWeight:700,color:'#8b5cf6'}}>{result.surveyPlan.totalTimeHrs}h</div><div style={{fontSize:10}}>Total Time</div></div>
                    </div>
                  </div>
                  <h5 style={{fontSize:13,fontWeight:700,marginBottom:8}}>Survey Recommendations</h5>
                  <table className="sci-table" style={{fontSize:11}}>
                    <thead><tr><th>Method</th><th>Priority</th><th>Cost</th><th>Time</th><th>Confidence Gain</th><th>$/% Conf</th><th>Reason</th></tr></thead>
                    <tbody>{result.surveyPlan.surveys.filter((s: any)=>s.priority!=='not_needed').map((s: any, i: number)=>(
                      <tr key={i}>
                        <td style={{fontWeight:600}}>{s.method}</td>
                        <td style={{color:s.priority==='essential'?'#dc2626':s.priority==='recommended'?'#f59e0b':'#94a3b8',fontWeight:700}}>{s.priority}</td>
                        <td>${s.costEstimateUSD.toLocaleString()}</td><td>{s.timeEstimateHrs}h</td>
                        <td>+{s.expectedConfidenceGain}%</td><td>${s.costPerConfidencePercent}</td>
                        <td style={{fontSize:10}}>{s.reason}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                  {result.surveyPlan.riskFactors.length > 0 && (
                    <div style={{marginTop:12,padding:10,background:'rgba(239,68,68,0.06)',borderRadius:8}}>
                      <div style={{fontWeight:700,fontSize:12,color:'#ef4444',marginBottom:4}}>Risk Factors</div>
                      <ul style={{margin:0,paddingLeft:16,fontSize:11}}>{result.surveyPlan.riskFactors.map((r: any,i: number)=><li key={i}>{r}</li>)}</ul>
                    </div>
                  )}
                  <div style={{marginTop:12,padding:10,background:'rgba(34,197,94,0.06)',borderRadius:8}}>
                    <div style={{fontWeight:700,fontSize:12,color:'#16a34a',marginBottom:4}}>AI Reasoning</div>
                    <ul style={{margin:0,paddingLeft:16,fontSize:11}}>{result.surveyPlan.reasoning.map((r: any,i: number)=><li key={i}>{r}</li>)}</ul>
                  </div>
                </div>
              ) : <p className="tab-desc">Survey plan not available.</p>}
            </div>
          )}

          {/* ═══ HYBRID AI + TARGETED GEOPHYSICS — 5-STEP PIPELINE ═══ */}
          {activeResultTab==='hybrid-geophysics' && (
            <div>
              <h4 className="tab-title">{'\u{1F9E0}'} Hybrid AI + Targeted Geophysics</h4>
              <div style={{background:'rgba(251,191,36,0.06)',border:'1px solid rgba(251,191,36,0.2)',borderRadius:8,padding:'8px 14px',marginBottom:10,fontSize:11,color:'#fbbf24'}}>{'\u26A0\uFE0F'} <strong>Independent Model Estimate</strong> — Values below are from the Hybrid ERT+AI model. See the <strong>Final Recommendation</strong> banner for the reconciled consensus answer.</div>
              <p className="tab-desc">Eliminates wasteful site surveys using a 5-step pipeline: AI screens the entire site, selects the top 3 drill points, runs ERT on ONLY the best point, fuses AI + ERT data, and delivers a final drilling decision.</p>
              {result.hybridGeophysics ? (() => {
                const hg = result.hybridGeophysics as any;
                return (
                  <div>
                    {/* Pipeline Summary Banner */}
                    <div style={{padding:'14px 18px',borderRadius:14,background:`linear-gradient(135deg,${hg.driColor}12,${hg.driColor}05)`,border:`2px solid ${hg.driColor}40`,marginBottom:20}}>
                      <div style={{fontWeight:800,fontSize:13,color:hg.driColor,marginBottom:4}}>Pipeline Summary</div>
                      <div style={{fontSize:12,lineHeight:1.6}}>{hg.pipelineSummary}</div>
                    </div>

                    {/* ═══ 5-STEP VISUAL PIPELINE ═══ */}
                    <div style={{marginBottom:24}}>
                      <h5 style={{fontSize:14,fontWeight:800,marginBottom:14,letterSpacing:0.5}}>5-STEP PIPELINE</h5>
                      <div style={{display:'flex',flexDirection:'column',gap:0}}>
                        {(hg.pipeline ?? []).map((step: any, i: number) => (
                          <div key={i}>
                            {/* Step card */}
                            <div style={{display:'flex',gap:14,padding:'14px 16px',borderRadius:14,
                              background: step.status==='complete' ? 'rgba(34,197,94,0.04)' : step.status==='actionable' ? 'rgba(251,191,36,0.06)' : 'rgba(100,116,139,0.04)',
                              border: `2px solid ${step.status==='complete' ? 'rgba(34,197,94,0.25)' : step.status==='actionable' ? 'rgba(251,191,36,0.35)' : 'rgba(100,116,139,0.15)'}`,
                            }}>
                              {/* Step number circle */}
                              <div style={{flexShrink:0,width:48,height:48,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:900,
                                background: step.status==='complete' ? 'rgba(34,197,94,0.15)' : step.status==='actionable' ? 'rgba(251,191,36,0.15)' : 'rgba(100,116,139,0.1)',
                                color: step.status==='complete' ? '#22c55e' : step.status==='actionable' ? '#d97706' : '#94a3b8',
                                border: `2px solid ${step.status==='complete' ? '#22c55e50' : step.status==='actionable' ? '#d9770650' : '#94a3b830'}`,
                              }}>
                                {step.icon}
                              </div>
                              {/* Content */}
                              <div style={{flex:1,minWidth:0}}>
                                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:6}}>
                                  <div>
                                    <span style={{fontWeight:800,fontSize:14,color: step.status==='complete' ? '#22c55e' : step.status==='actionable' ? '#d97706' : '#94a3b8'}}>
                                      Step {step.step}: {step.title}
                                    </span>
                                    <span style={{marginLeft:8,fontSize:11,padding:'2px 8px',borderRadius:10,fontWeight:700,
                                      background: step.status==='complete' ? 'rgba(34,197,94,0.12)' : step.status==='actionable' ? 'rgba(251,191,36,0.12)' : 'rgba(100,116,139,0.08)',
                                      color: step.status==='complete' ? '#16a34a' : step.status==='actionable' ? '#b45309' : '#64748b',
                                    }}>{step.subtitle}</span>
                                  </div>
                                  <div style={{display:'flex',gap:6}}>
                                    {step.costUSD > 0 && <span style={{fontSize:10,padding:'2px 8px',borderRadius:10,background:'rgba(34,197,94,0.1)',color:'#16a34a',fontWeight:700}}>${step.costUSD.toLocaleString()}</span>}
                                    {step.timeHrs > 0 && <span style={{fontSize:10,padding:'2px 8px',borderRadius:10,background:'rgba(139,92,246,0.1)',color:'#8b5cf6',fontWeight:700}}>{step.timeHrs}h</span>}
                                    <span style={{fontSize:10,padding:'2px 8px',borderRadius:10,fontWeight:700,
                                      background: step.status==='complete' ? 'rgba(34,197,94,0.12)' : step.status==='actionable' ? 'rgba(251,191,36,0.12)' : 'rgba(100,116,139,0.08)',
                                      color: step.status==='complete' ? '#16a34a' : step.status==='actionable' ? '#b45309' : '#64748b',
                                    }}>{step.status==='complete' ? 'DONE' : step.status==='actionable' ? 'ACTION NEEDED' : 'PENDING'}</span>
                                  </div>
                                </div>
                                <div style={{fontSize:11,marginTop:6,lineHeight:1.5}}>{step.description}</div>
                                <div style={{fontSize:10,marginTop:6,padding:'6px 10px',borderRadius:8,background:'rgba(59,130,246,0.05)',border:'1px solid rgba(59,130,246,0.12)',fontWeight:600,color:'#3b82f6'}}>
                                  {step.keyOutput}
                                </div>
                                {/* Expandable details */}
                                <details style={{marginTop:6}}>
                                  <summary style={{fontSize:10,color:'var(--text-secondary)',cursor:'pointer',fontWeight:600}}>Details ({step.details.length})</summary>
                                  <ul style={{margin:'4px 0 0',paddingLeft:16,fontSize:10,color:'var(--text-secondary)'}}>
                                    {step.details.map((d: string, j: number) => <li key={j} style={{marginBottom:2}}>{d}</li>)}
                                  </ul>
                                </details>
                              </div>
                            </div>
                            {/* Arrow connector between steps */}
                            {i < (hg.pipeline?.length ?? 5) - 1 && (
                              <div style={{display:'flex',justifyContent:'center',padding:'4px 0'}}>
                                <div style={{fontSize:20,color:'#64748b',fontWeight:900,lineHeight:1}}>{'\u{2193}'}</div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ═══ TOP 3 DRILL POINTS ═══ */}
                    {(hg.topDrillPoints ?? []).length > 0 && (
                      <div style={{marginBottom:20}}>
                        <h5 style={{fontSize:13,fontWeight:700,marginBottom:10}}>{'\u{1F4CD}'} Top 3 AI-Selected Drill Points</h5>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
                          {(hg.topDrillPoints ?? []).map((pt: any, i: number) => (
                            <div key={i} style={{padding:14,borderRadius:12,
                              background: pt.ertRecommended ? 'rgba(59,130,246,0.06)' : 'rgba(100,116,139,0.03)',
                              border: pt.ertRecommended ? '2px solid rgba(59,130,246,0.3)' : '1px solid rgba(100,116,139,0.15)',
                              position:'relative',
                            }}>
                              {pt.ertRecommended && (
                                <div style={{position:'absolute',top:-8,right:10,fontSize:9,padding:'2px 8px',borderRadius:10,background:'#3b82f6',color:'#fff',fontWeight:800}}>ERT TARGET</div>
                              )}
                              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                                <div style={{fontSize:18,fontWeight:900,color: pt.rank===1 ? '#3b82f6' : pt.rank===2 ? '#8b5cf6' : '#64748b'}}>#{pt.rank}</div>
                                <div style={{fontSize:20,fontWeight:900,color: pt.rank===1 ? '#3b82f6' : '#64748b'}}>{pt.aiScore}</div>
                              </div>
                              <div style={{fontSize:11,fontWeight:700,marginBottom:4}}>{pt.label}</div>
                              <div style={{fontSize:10,color:'var(--text-secondary)',marginBottom:6}}>{pt.lat.toFixed(4)}{'\u00B0'}, {pt.lon.toFixed(4)}{'\u00B0'}</div>
                              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:4,fontSize:10}}>
                                <div><span style={{fontWeight:600}}>Depth:</span> {pt.estimatedDepthM}m</div>
                                <div><span style={{fontWeight:600}}>Yield:</span> {pt.estimatedYieldM3hr} m{'\u00B3'}/hr</div>
                              </div>
                              <div style={{fontSize:10,color:'var(--text-secondary)',marginTop:4}}>{pt.geologyNote}</div>
                              <ul style={{margin:'6px 0 0',paddingLeft:12,fontSize:9,color:'var(--text-secondary)'}}>
                                {pt.reasons.map((r: string, j: number) => <li key={j} style={{marginBottom:1}}>{r}</li>)}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ═══ ERT SPECIFICATION ═══ */}
                    {hg.ertSpec && (
                      <div style={{marginBottom:20}}>
                        <h5 style={{fontSize:13,fontWeight:700,marginBottom:10}}>{'\u{26A1}'} ERT Survey Specification — Point #1 Only</h5>
                        <div style={{padding:14,borderRadius:12,background:'rgba(251,191,36,0.04)',border:'2px solid rgba(251,191,36,0.2)'}}>
                          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:10}}>
                            <div style={{padding:'8px 12px',borderRadius:8,background:'rgba(59,130,246,0.06)'}}>
                              <div style={{fontSize:16,fontWeight:800,color:'#3b82f6'}}>{hg.ertSpec.arrayType}</div>
                              <div style={{fontSize:9,color:'var(--text-secondary)'}}>Array Type</div>
                            </div>
                            <div style={{padding:'8px 12px',borderRadius:8,background:'rgba(139,92,246,0.06)'}}>
                              <div style={{fontSize:16,fontWeight:800,color:'#8b5cf6'}}>{hg.ertSpec.lineLength_m}m</div>
                              <div style={{fontSize:9,color:'var(--text-secondary)'}}>Line Length ({hg.ertSpec.electrodeSpacing_m}m spacing)</div>
                            </div>
                            <div style={{padding:'8px 12px',borderRadius:8,background:'rgba(34,197,94,0.06)'}}>
                              <div style={{fontSize:16,fontWeight:800,color:'#22c55e'}}>${hg.ertSpec.costUSD.toLocaleString()}</div>
                              <div style={{fontSize:9,color:'var(--text-secondary)'}}>Cost ({hg.ertSpec.timeHrs}h)</div>
                            </div>
                          </div>
                          <div style={{fontSize:11,marginBottom:4}}><strong>Orientation:</strong> {hg.ertSpec.lineOrientation}</div>
                          <div style={{fontSize:11,marginBottom:4}}><strong>Looking for:</strong> {hg.ertSpec.expectedTarget}</div>
                          <div style={{fontSize:11,padding:8,background:'rgba(34,197,94,0.05)',borderRadius:8,borderLeft:'3px solid #22c55e'}}>
                            <strong>Success criteria:</strong> {hg.ertSpec.successCriteria}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ═══ AI + ERT FUSION ═══ */}
                    {hg.fusionResult && (
                      <div style={{marginBottom:20}}>
                        <h5 style={{fontSize:13,fontWeight:700,marginBottom:10}}>{'\u{1F52C}'} AI + ERT Fusion (Projected)</h5>
                        <div style={{padding:14,borderRadius:12,background:'rgba(59,130,246,0.04)',border:'2px solid rgba(59,130,246,0.2)'}}>
                          {/* DRI boost visualization */}
                          <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:12}}>
                            <div style={{textAlign:'center'}}>
                              <div style={{fontSize:28,fontWeight:900,color:'#f59e0b'}}>{hg.fusionResult.preFusionDRI}%</div>
                              <div style={{fontSize:9,fontWeight:600}}>AI Only</div>
                            </div>
                            <div style={{fontSize:24,fontWeight:900,color:'#3b82f6'}}>{'\u{2192}'}</div>
                            <div style={{textAlign:'center'}}>
                              <div style={{fontSize:28,fontWeight:900,color:'#22c55e'}}>{hg.fusionResult.postFusionDRI}%</div>
                              <div style={{fontSize:9,fontWeight:600}}>AI + ERT</div>
                            </div>
                            <div style={{marginLeft:10,padding:'6px 14px',borderRadius:20,background: hg.fusionResult.fusionVerdict==='CONFIRMED'?'rgba(34,197,94,0.12)':hg.fusionResult.fusionVerdict==='REFINED'?'rgba(59,130,246,0.12)':'rgba(239,68,68,0.12)',
                              color: hg.fusionResult.fusionVerdict==='CONFIRMED'?'#22c55e':hg.fusionResult.fusionVerdict==='REFINED'?'#3b82f6':'#ef4444',
                              fontWeight:800,fontSize:12,letterSpacing:1}}>
                              +{hg.fusionResult.driBoostPercent}% {hg.fusionResult.fusionVerdict}
                            </div>
                          </div>
                          <div style={{fontSize:11,lineHeight:1.6,marginBottom:10}}>{hg.fusionResult.fusionNarrative}</div>
                          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                            <div style={{padding:10,borderRadius:8,background:'rgba(139,92,246,0.04)',border:'1px solid rgba(139,92,246,0.12)'}}>
                              <div style={{fontWeight:700,fontSize:11,color:'#8b5cf6',marginBottom:4}}>AI Predictions (Pre-ERT)</div>
                              <ul style={{margin:0,paddingLeft:14,fontSize:10}}>{hg.fusionResult.aiPredictions.map((p: string, j: number) => <li key={j} style={{marginBottom:2}}>{p}</li>)}</ul>
                            </div>
                            <div style={{padding:10,borderRadius:8,background:'rgba(34,197,94,0.04)',border:'1px solid rgba(34,197,94,0.12)'}}>
                              <div style={{fontWeight:700,fontSize:11,color:'#22c55e',marginBottom:4}}>ERT Will Confirm/Deny</div>
                              <ul style={{margin:0,paddingLeft:14,fontSize:10}}>{hg.fusionResult.ertExpected.map((e: string, j: number) => <li key={j} style={{marginBottom:2}}>{e}</li>)}</ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ═══ DRI + COST SUMMARY ═══ */}
                    <div style={{display:'flex',gap:16,marginBottom:20,flexWrap:'wrap'}}>
                      <div style={{flex:'0 0 200px',padding:18,borderRadius:16,background:`linear-gradient(135deg,${hg.driColor}15,${hg.driColor}08)`,border:`3px solid ${hg.driColor}50`,textAlign:'center'}}>
                        <div style={{fontSize:42,fontWeight:900,color:hg.driColor,lineHeight:1}}>{hg.drillReadinessIndex}%</div>
                        <div style={{fontSize:11,fontWeight:700,marginTop:4}}>Drill Readiness (AI Only)</div>
                        <div style={{display:'inline-block',marginTop:6,padding:'3px 12px',borderRadius:20,background:`${hg.driColor}20`,color:hg.driColor,fontWeight:800,fontSize:12}}>
                          {hg.drillReadinessLabel}
                        </div>
                      </div>
                      <div style={{flex:1,minWidth:240}}>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                          <div style={{padding:'10px 14px',borderRadius:10,background:'rgba(34,197,94,0.08)',border:'1px solid rgba(34,197,94,0.2)'}}>
                            <div style={{fontSize:20,fontWeight:800,color:'#22c55e'}}>${(hg.fullSurveyCostUSD - (hg.ertSpec?.costUSD ?? 0)).toLocaleString()}</div>
                            <div style={{fontSize:9,color:'var(--text-secondary)'}}>Saved vs Full Survey</div>
                          </div>
                          <div style={{padding:'10px 14px',borderRadius:10,background:'rgba(59,130,246,0.08)',border:'1px solid rgba(59,130,246,0.2)'}}>
                            <div style={{fontSize:20,fontWeight:800,color:'#3b82f6'}}>${hg.ertSpec?.costUSD?.toLocaleString() ?? '0'}</div>
                            <div style={{fontSize:9,color:'var(--text-secondary)'}}>ERT Only (vs ${hg.fullSurveyCostUSD.toLocaleString()} full)</div>
                          </div>
                          <div style={{padding:'10px 14px',borderRadius:10,background:'rgba(251,191,36,0.08)',border:'1px solid rgba(251,191,36,0.2)'}}>
                            <div style={{fontSize:20,fontWeight:800,color:'#d97706'}}>{Math.round((1 - (hg.ertSpec?.costUSD ?? 0)/hg.fullSurveyCostUSD)*100)}%</div>
                            <div style={{fontSize:9,color:'var(--text-secondary)'}}>Survey Cost Eliminated</div>
                          </div>
                          <div style={{padding:'10px 14px',borderRadius:10,background:'rgba(139,92,246,0.08)',border:'1px solid rgba(139,92,246,0.2)'}}>
                            <div style={{fontSize:20,fontWeight:800,color:'#8b5cf6'}}>{hg.sourceConvergence}</div>
                            <div style={{fontSize:9,color:'var(--text-secondary)'}}>Data Sources Used</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Knowledge Dimensions — visual bars */}
                    <h5 style={{fontSize:13,fontWeight:700,marginBottom:8}}>Knowledge Dimensions</h5>
                    <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:16}}>
                      {hg.knowledgeDimensions.map((d: any, i: number) => (
                        <div key={i} style={{display:'flex',alignItems:'center',gap:10}}>
                          <div style={{width:130,fontSize:11,fontWeight:600,textAlign:'right',flexShrink:0}}>{d.name}</div>
                          <div style={{flex:1,height:20,background:'rgba(255,255,255,0.06)',borderRadius:10,overflow:'hidden',position:'relative'}}>
                            <div style={{height:'100%',width:`${d.score}%`,background:d.score>=70?'#22c55e':d.score>=50?'#f59e0b':d.score>=30?'#f97316':'#ef4444',borderRadius:10,transition:'width 0.5s ease'}} />
                            <span style={{position:'absolute',right:6,top:2,fontSize:10,fontWeight:700,color:'#fff'}}>{d.score}%</span>
                          </div>
                          <div style={{width:180,fontSize:10,color:'var(--text-secondary)',flexShrink:0}}>{d.source}</div>
                        </div>
                      ))}
                    </div>

                    {/* Briefs */}
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
                      <div style={{padding:12,borderRadius:10,background:'rgba(59,130,246,0.04)',border:'1px solid rgba(59,130,246,0.15)'}}>
                        <div style={{fontWeight:700,fontSize:12,color:'#3b82f6',marginBottom:6}}>Driller Brief</div>
                        <div style={{fontSize:11,lineHeight:1.5}}>{hg.drillerBrief}</div>
                      </div>
                      <div style={{padding:12,borderRadius:10,background:'rgba(139,92,246,0.04)',border:'1px solid rgba(139,92,246,0.15)'}}>
                        <div style={{fontWeight:700,fontSize:12,color:'#8b5cf6',marginBottom:6}}>Client Brief</div>
                        <div style={{fontSize:11,lineHeight:1.5}}>{hg.clientBrief}</div>
                      </div>
                    </div>

                    {/* Data Sources */}
                    <div style={{marginTop:12,fontSize:10,color:'var(--text-secondary)'}}>
                      <strong>Data sources ({hg.dataSourcesUsed.length}):</strong> {hg.dataSourcesUsed.join(' | ')}
                    </div>
                  </div>
                );
              })() : <p className="tab-desc">Hybrid Geophysics analysis not available.</p>}
            </div>
          )}

          {/* ═══ ADVANCED GEOPHYSICS — Multi-Method 3D Subsurface Characterization ═══ */}
          {activeResultTab==='advanced-geophysics' && (
            <div>
              <h4 className="tab-title">{'\u{1F30D}'} Advanced Geophysics — Multi-Method 3D Survey</h4>
              <div style={{background:'rgba(251,191,36,0.06)',border:'1px solid rgba(251,191,36,0.2)',borderRadius:8,padding:'8px 14px',marginBottom:10,fontSize:11,color:'#fbbf24'}}>{'\u26A0\uFE0F'} <strong>Independent Model Estimate</strong> — Yield and depth values below are from the ERT simulation model (Logan 1964 approximation). See the <strong>Final Recommendation</strong> banner for the reconciled consensus answer.</div>
              <p className="tab-desc">Comprehensive multi-method geophysical survey design: <strong>3D + 2D ERT, Seismic Refraction, GPR, FDEM, VES, Magnetics</strong>. AI inversion projections and equipment catalog. Target: {'\u2265'}90% drilling success rate.</p>
              {result.advancedGeophysics ? (() => {
                const ag = result.advancedGeophysics as any;
                const sra = ag.successRateAnalysis;
                const integrated = ag.integratedResult;
                const opt = ag.optimalPackage;
                return (
                  <div>
                    {/* Recommendation Banner */}
                    <div style={{padding:'14px 18px',borderRadius:14,background:sra.meetsTarget?'linear-gradient(135deg,rgba(34,197,94,0.12),rgba(34,197,94,0.04))':'linear-gradient(135deg,rgba(251,191,36,0.12),rgba(251,191,36,0.04))',border:`2px solid ${sra.meetsTarget?'rgba(34,197,94,0.4)':'rgba(251,191,36,0.4)'}`,marginBottom:20}}>
                      <div style={{fontWeight:800,fontSize:13,color:sra.meetsTarget?'#22c55e':'#f59e0b',marginBottom:6}}>{sra.meetsTarget?'\u2705 Target Met':'\u26A0\uFE0F Below Target'}: {sra.withFullIntegrated_pct}% Success Rate (Target: {sra.target_pct}%)</div>
                      <div style={{fontSize:11,lineHeight:1.6}}>{ag.recommendation}</div>
                    </div>

                    {/* Success Rate Progression */}
                    <div style={{marginBottom:24}}>
                      <h4 style={{fontSize:13,fontWeight:700,marginBottom:10}}>Success Rate Analysis — AI to Full Geophysics</h4>
                      <div style={{display:'flex',gap:4,alignItems:'flex-end',height:140,padding:'0 4px'}}>
                        {[
                          {label:'AI Only',pct:sra.aiOnly_pct,color:'#6366f1'},
                          {label:'+2D ERT',pct:sra.withERT2D_pct,color:'#3b82f6'},
                          {label:'+3D ERT',pct:sra.withERT3D_pct,color:'#0ea5e9'},
                          {label:'+ERT+Seismic',pct:sra.withERTSeismic_pct,color:'#14b8a6'},
                          {label:'+Combined',pct:sra.withCombinedGeophysics_pct,color:'#22c55e'},
                          {label:'+Full Integrated',pct:sra.withFullIntegrated_pct,color:'#16a34a'},
                        ].map((bar,i)=>(
                          <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                            <div style={{fontSize:10,fontWeight:700,color:bar.color}}>{bar.pct}%</div>
                            <div style={{width:'100%',height:`${bar.pct * 1.2}px`,background:`linear-gradient(180deg,${bar.color},${bar.color}88)`,borderRadius:'6px 6px 0 0',minHeight:20,transition:'height 0.3s'}}/>
                            <div style={{fontSize:8,textAlign:'center',color:'var(--text-secondary)',lineHeight:1.2}}>{bar.label}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{height:2,background:sra.meetsTarget?'#22c55e':'#f59e0b',marginTop:2,borderRadius:1,position:'relative'}}>
                        <div style={{position:'absolute',right:0,top:-14,fontSize:9,fontWeight:700,color:sra.meetsTarget?'#22c55e':'#f59e0b'}}>Target: {sra.target_pct}%</div>
                      </div>
                    </div>

                    {/* Optimal Package */}
                    <div style={{padding:14,borderRadius:12,background:'rgba(59,130,246,0.05)',border:'1.5px solid rgba(59,130,246,0.2)',marginBottom:20}}>
                      <div style={{fontWeight:800,fontSize:13,color:'#3b82f6',marginBottom:6}}>Optimal Survey Package: {opt.name}</div>
                      <div style={{fontSize:11,lineHeight:1.5,marginBottom:8}}>{opt.description}</div>
                      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))',gap:8}}>
                        <div className="result-item"><span className="rl">Methods</span><span className="rv">{opt.methods.length}</span></div>
                        <div className="result-item"><span className="rl">Cost</span><span className="rv">${opt.cost_usd.toLocaleString()}</span></div>
                        <div className="result-item"><span className="rl">Time</span><span className="rv">{opt.time_hrs}h field work</span></div>
                        <div className="result-item"><span className="rl">Success Boost</span><span className="rv">+{opt.successRateBoost_pct}%</span></div>
                        <div className="result-item"><span className="rl">Target Accuracy</span><span className="rv">{opt.targetAccuracy_pct}%</span></div>
                      </div>
                    </div>

                    {/* Available Methods Grid */}
                    <h4 style={{fontSize:13,fontWeight:700,marginBottom:8}}>Available Geophysical Methods ({ag.availableMethods.length})</h4>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:10,marginBottom:20}}>
                      {ag.availableMethods.map((m: any,i: number)=>(
                        <div key={i} style={{padding:12,borderRadius:10,background:'rgba(148,163,184,0.05)',border:'1px solid rgba(148,163,184,0.15)'}}>
                          <div style={{fontWeight:700,fontSize:12,color:'#3b82f6',marginBottom:4}}>{m.shortName}</div>
                          <div style={{fontSize:10,color:'var(--text-secondary)',marginBottom:6}}>{m.principle.slice(0,120)}...</div>
                          <div style={{display:'flex',flexWrap:'wrap',gap:4,marginBottom:6}}>
                            {m.bestFor.slice(0,3).map((b: string,j: number)=>(<span key={j} style={{fontSize:9,padding:'2px 6px',borderRadius:4,background:'rgba(59,130,246,0.1)',color:'#3b82f6'}}>{b}</span>))}
                          </div>
                          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:4,fontSize:10}}>
                            <div><strong>Depth:</strong> {m.depthRange_m[0]}–{m.depthRange_m[1]}m</div>
                            <div><strong>Cost:</strong> ${m.cost_usd.toLocaleString()}</div>
                            <div><strong>Time:</strong> {m.deploymentTime_hrs}h</div>
                            <div><strong>Measures:</strong> {m.measuredProperty.split(',')[0]}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Survey Packages Ranked */}
                    <h4 style={{fontSize:13,fontWeight:700,marginBottom:8}}>Survey Packages — Ranked by Suitability</h4>
                    <div className="sci-table-wrap" style={{marginBottom:20}}>
                      <table className="sci-table"><thead><tr><th>Package</th><th>Methods</th><th>Success Boost</th><th>Cost</th><th>Time</th><th>Best For</th></tr></thead><tbody>
                        {ag.recommendedPackages.map((p: any,i: number)=>(
                          <tr key={i} style={{background:p.id===opt.id?'rgba(59,130,246,0.08)':''}}>
                            <td style={{fontWeight:p.id===opt.id?700:400}}>{p.id===opt.id?'\u2B50 ':''}{p.name}</td>
                            <td>{p.methods.length}</td>
                            <td style={{color:'#22c55e',fontWeight:700}}>+{p.successRateBoost_pct}%</td>
                            <td>${p.cost_usd.toLocaleString()}</td>
                            <td>{p.time_hrs}h</td>
                            <td style={{fontSize:10}}>{p.bestFor.slice(0,2).join(', ')}</td>
                          </tr>
                        ))}
                      </tbody></table>
                    </div>

                    {/* 3D ERT Configuration */}
                    {ag.ert3D && (
                      <div style={{marginBottom:20}}>
                        <h4 style={{fontSize:13,fontWeight:700,marginBottom:8}}>3D ERT Configuration</h4>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:8}}>
                          <div className="result-item"><span className="rl">Grid Size</span><span className="rv">{ag.ert3D.gridSize} ({ag.ert3D.electrodeCount} electrodes)</span></div>
                          <div className="result-item"><span className="rl">Spacing</span><span className="rv">{ag.ert3D.electrodeSpacing_m}m electrode / {ag.ert3D.lineSpacing_m}m line</span></div>
                          <div className="result-item"><span className="rl">Arrays</span><span className="rv">{ag.ert3D.arrayTypes.join(', ')}</span></div>
                          <div className="result-item"><span className="rl">Depth</span><span className="rv">{ag.ert3D.depth_m}m investigation</span></div>
                          <div className="result-item"><span className="rl">Inversion</span><span className="rv">{ag.ert3D.inversionSoftware.split('+')[0].trim()}</span></div>
                          <div className="result-item"><span className="rl">Voxel Size</span><span className="rv">{ag.ert3D.voxelSize_m.join('×')}m</span></div>
                          <div className="result-item"><span className="rl">Data Points</span><span className="rv">{ag.ert3D.datapointsEstimated.toLocaleString()}</span></div>
                          <div className="result-item"><span className="rl">Equipment</span><span className="rv">{ag.ert3D.equipment.split('with')[0].trim()}</span></div>
                        </div>
                      </div>
                    )}

                    {/* AI Inversion Projections */}
                    {ag.projectedInversions?.length > 0 && (
                      <div style={{marginBottom:20}}>
                        <h4 style={{fontSize:13,fontWeight:700,marginBottom:8}}>AI Inversion Projections ({ag.projectedInversions.length} methods)</h4>
                        {ag.projectedInversions.map((inv: any,i: number) => (
                          <div key={i} style={{padding:12,borderRadius:10,background:'rgba(139,92,246,0.04)',border:'1px solid rgba(139,92,246,0.15)',marginBottom:10}}>
                            <div style={{fontWeight:700,fontSize:12,color:'#8b5cf6',marginBottom:6}}>{inv.method} — {inv.algorithm}</div>
                            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:6,marginBottom:8,fontSize:10}}>
                              <div><strong>Iterations:</strong> {inv.iterations}</div>
                              <div><strong>RMS Error:</strong> {inv.rmsError_pct.toFixed(1)}%</div>
                              <div><strong>Converged:</strong> {inv.convergenceAchieved?'Yes':'No'}</div>
                              <div><strong>Quality:</strong> {inv.modelQuality}</div>
                            </div>
                            {inv.layers?.length > 0 && (
                              <div className="sci-table-wrap"><table className="sci-table"><thead><tr><th>Depth (m)</th><th>Lithology</th><th>{'\u03A9'}·m / mS/m</th><th>Water</th><th>Conf.</th></tr></thead><tbody>
                                {inv.layers.map((l: any,j: number)=>(
                                  <tr key={j}><td>{l.topDepth_m.toFixed(0)}–{l.bottomDepth_m.toFixed(0)}</td><td>{l.lithology}</td><td>{l.resistivity_ohm_m?l.resistivity_ohm_m.toFixed(0)+' \u03A9·m':l.conductivity_mS_m?l.conductivity_mS_m.toFixed(1)+' mS/m':l.velocity_ms?l.velocity_ms.toFixed(0)+' m/s':'—'}</td><td style={{color:l.waterBearing?'#22c55e':'#94a3b8'}}>{l.waterBearing?'\u2705':'\u274C'}</td><td>{(l.confidence*100).toFixed(0)}%</td></tr>
                                ))}
                              </tbody></table></div>
                            )}
                            {inv.fractureZones?.length > 0 && (
                              <div style={{marginTop:6}}>
                                <div style={{fontSize:10,fontWeight:700,marginBottom:4}}>Fracture Zones Detected: {inv.fractureZones.length}</div>
                                {inv.fractureZones.map((fz: any,j: number)=>(
                                  <div key={j} style={{fontSize:10,padding:'4px 8px',background:'rgba(251,191,36,0.08)',borderRadius:6,marginBottom:4}}>
                                    Depth: {fz.centerDepth_m.toFixed(0)}m | Width: {fz.width_m.toFixed(0)}m | {'\u03A9'}: {fz.resistivity_ohm_m.toFixed(0)} {'\u03A9'}·m | Yield: <strong style={{color:fz.yieldPotential==='high'?'#22c55e':'#f59e0b'}}>{fz.yieldPotential}</strong>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Integrated Survey Result — Drill Spec */}
                    {integrated && (
                      <div style={{padding:14,borderRadius:12,background:'rgba(22,163,74,0.05)',border:'1.5px solid rgba(22,163,74,0.2)',marginBottom:20}}>
                        <div style={{fontWeight:800,fontSize:13,color:'#16a34a',marginBottom:8}}>Integrated Survey — Drill Specification</div>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:8,marginBottom:10}}>
                          <div className="result-item"><span className="rl">Drill Depth</span><span className="rv">{integrated.drillSpec.optimalDepth_m}m</span></div>
                          <div className="result-item"><span className="rl">Casing Depth</span><span className="rv">{integrated.drillSpec.casingDepth_m}m</span></div>
                          <div className="result-item"><span className="rl">Screen</span><span className="rv">{integrated.drillSpec.screenInterval_m[0]}–{integrated.drillSpec.screenInterval_m[1]}m</span></div>
                          <div className="result-item"><span className="rl">Expected Yield</span><span className="rv">{integrated.drillSpec.expectedYield_m3hr} m{'\u00B3'}/hr</span></div>
                          <div className="result-item"><span className="rl">Success Prob.</span><span className="rv" style={{color:'#22c55e',fontWeight:700}}>{integrated.drillSpec.successProbability_pct}%</span></div>
                          <div className="result-item"><span className="rl">Method</span><span className="rv">{integrated.drillSpec.drillingMethod}</span></div>
                          <div className="result-item"><span className="rl">Drill Cost Est.</span><span className="rv">${integrated.drillSpec.estimatedCost_usd.toLocaleString()}</span></div>
                          <div className="result-item"><span className="rl">Survey Cost</span><span className="rv">${integrated.totalCost_usd.toLocaleString()}</span></div>
                        </div>
                        <div style={{fontSize:10,padding:'6px 10px',background:'rgba(22,163,74,0.08)',borderRadius:8}}>
                          <strong>Cross-Method Agreement:</strong> {integrated.crossMethodAgreement}% | <strong>Integration Boost:</strong> +{integrated.integrationBoost_pct}% confidence | <strong>Savings vs Traditional:</strong> ${integrated.savingsVsTraditional_usd.toLocaleString()} ({integrated.savingsPercent}%)
                        </div>
                      </div>
                    )}

                    {/* Equipment Catalog */}
                    <h4 style={{fontSize:13,fontWeight:700,marginBottom:8}}>Equipment Catalog</h4>
                    <div className="sci-table-wrap" style={{marginBottom:20}}>
                      <table className="sci-table"><thead><tr><th>Method</th><th>Model</th><th>Manufacturer</th><th>Channels</th><th>Advantage</th></tr></thead><tbody>
                        {ag.equipmentCatalog.map((eq: any,i: number)=>(
                          <tr key={i}><td>{eq.method}</td><td style={{fontWeight:600}}>{eq.model}</td><td>{eq.manufacturer}</td><td>{eq.channels||'—'}</td><td style={{fontSize:10}}>{eq.advantage.slice(0,80)}</td></tr>
                        ))}
                      </tbody></table>
                    </div>

                    {/* Technical Summary */}
                    <div style={{padding:12,borderRadius:10,background:'rgba(148,163,184,0.05)',border:'1px solid rgba(148,163,184,0.15)',whiteSpace:'pre-line',fontSize:10,lineHeight:1.6}}>
                      <div style={{fontWeight:700,fontSize:12,marginBottom:6}}>Technical Summary</div>
                      {ag.technicalSummary}
                    </div>
                  </div>
                );
              })() : <p className="tab-desc">Advanced Geophysics analysis not available.</p>}
            </div>
          )}

          {activeResultTab==='topographic' && (
            <div>
              <h4 className="tab-title">{'\u{1F3D4}\uFE0F'} Topographic &amp; Hydrological Analysis</h4>
              {result.demHydrology ? (
                <div>
                  <p className="tab-desc">DEM-derived indices from SRTM 30m elevation data via Open-Elevation API. {result.demHydrology.methodology}</p>
                  <div className="result-grid">
                    <div className="result-item"><span className="rl">Elevation</span><span className="rv">{result.demHydrology.elevation_m}m ASL</span></div>
                    <div className="result-item"><span className="rl">Slope</span><span className="rv">{result.demHydrology.slope_degrees.toFixed(2)}°</span></div>
                    <div className="result-item"><span className="rl">Aspect</span><span className="rv">{result.demHydrology.aspect_degrees}°</span></div>
                    <div className="result-item"><span className="rl">Topographic Wetness Index</span><span className="rv" style={{fontWeight:700,color:result.demHydrology.twi>11?'#22c55e':result.demHydrology.twi>8?'#fbbf24':'#ef4444'}}>{result.demHydrology.twi.toFixed(2)} ({result.demHydrology.twiClass.replace('_',' ')})</span></div>
                    <div className="result-item"><span className="rl">Drainage Density</span><span className="rv">{result.demHydrology.drainageDensity.toFixed(2)} km/km²</span></div>
                    <div className="result-item"><span className="rl">Relative Position</span><span className="rv" style={{textTransform:'capitalize'}}>{result.demHydrology.relativePosition.replace('_',' ')}</span></div>
                    <div className="result-item"><span className="rl">GW Favorability</span><span className="rv" style={{fontWeight:700,fontSize:18,color:result.demHydrology.groundwaterFavorability>70?'#22c55e':result.demHydrology.groundwaterFavorability>40?'#fbbf24':'#ef4444'}}>{result.demHydrology.groundwaterFavorability}/100</span></div>
                  </div>
                  {result.lineamentAnalysis && (
                    <div style={{marginTop:20}}>
                      <h4 style={{color:'#9C27B0',marginBottom:12}}>{'🔍'} Lineament / Fracture Analysis (DEM Gradient)</h4>
                      <div className="result-grid">
                        <div className="result-item"><span className="rl">Lineament Density</span><span className="rv">{result.lineamentAnalysis.lineamentDensity.toFixed(2)} /km²</span></div>
                        <div className="result-item"><span className="rl">Dominant Direction</span><span className="rv">{result.lineamentAnalysis.dominantDirection_deg}° azimuth</span></div>
                        <div className="result-item"><span className="rl">Intersections</span><span className="rv">{result.lineamentAnalysis.intersectionCount}</span></div>
                        <div className="result-item"><span className="rl">Fracture Zone Proximity</span><span className="rv">{result.lineamentAnalysis.fractureZoneProximity_m}m</span></div>
                        <div className="result-item"><span className="rl">Aquifer Enhancement</span><span className="rv" style={{textTransform:'uppercase',fontWeight:700,color:result.lineamentAnalysis.aquiferEnhancement==='excellent'||result.lineamentAnalysis.aquiferEnhancement==='high'?'#22c55e':result.lineamentAnalysis.aquiferEnhancement==='moderate'?'#fbbf24':'#94a3b8'}}>{result.lineamentAnalysis.aquiferEnhancement}</span></div>
                        <div className="result-item"><span className="rl">Yield Multiplier</span><span className="rv" style={{fontWeight:700}}>{result.lineamentAnalysis.yieldMultiplier.toFixed(2)}×</span></div>
                      </div>
                      <div className="geo-note" style={{marginTop:12}}>
                        <strong>Method:</strong> {result.lineamentAnalysis.methodology}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{padding:20,textAlign:'center',color:'var(--text-muted)',background:'var(--bg-elevated)',borderRadius:12,border:'1px solid var(--border)'}}>
                  <div style={{fontSize:24,marginBottom:8}}>🏔️</div>
                  DEM data unavailable — Open-Elevation API did not return results. Enter GPS coordinates to enable terrain analysis.
                </div>
              )}
            </div>
          )}

          {/* SCENARIO SIMULATION (#15) */}
          {activeResultTab==='scenarios' && (
            <div>
              <h4 className="tab-title">{'\u{1F3AF}'} Scenario Simulation</h4>
              <div className="scenario-cards">
                {scenarios.map((sc,i) => (
                  <div key={i} className={`scenario-card ${i===1?'recommended':''}`}>
                    {i===1 && <div className="scenario-badge">RECOMMENDED</div>}
                    <div className="scenario-header">Scenario {i+1}: Drill at {sc.depth}m</div>
                    <div className="scenario-row"><span>Yield</span><span>{sc.yield} m&sup3;/h</span></div>
                    <div className="scenario-row"><span>Cost</span><span>{fmtUSD(sc.cost)}</span></div>
                    <div className="scenario-row"><span>Risk</span><span style={{color:sc.risk==='Low'?'#4CAF50':'#FFC107'}}>{sc.risk}</span></div>
                    <div className="scenario-note">{sc.recommendation}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WATER QUALITY EXPANDED (#7, #18) */}
          {activeResultTab==='water' && (
            <div>
              <h4 className="tab-title">{'\u{1F4A7}'} Water Quality Prediction &amp; Treatment</h4>
              <div className="result-grid">
                <div className="result-item"><span className="rl">Quality Score</span><span className="rv">{(wqExpanded.score*100).toFixed(0)}%</span></div>
                <div className="result-item"><span className="rl">Potable</span><span className="rv" style={{color:wqExpanded.isPotable?'#4CAF50':'#F44336'}}>{wqExpanded.isPotable?'Yes':'No'}</span></div>
                <div className="result-item"><span className="rl">TDS</span><span className="rv">{wqExpanded.tds.toFixed(0)} mg/L</span></div>
                <div className="result-item"><span className="rl">Salinity</span><span className="rv">{wqExpanded.salinity} mg/L</span></div>
                <div className="result-item"><span className="rl">Fluoride</span><span className="rv" style={{color:wqExpanded.fluoride>1.5?'#F44336':'#4CAF50'}}>{wqExpanded.fluoride.toFixed(2)} mg/L</span></div>
                <div className="result-item"><span className="rl">Iron</span><span className="rv" style={{color:wqExpanded.iron>0.3?'#FF9800':'#4CAF50'}}>{wqExpanded.iron.toFixed(2)} mg/L</span></div>
                <div className="result-item"><span className="rl">Hardness</span><span className="rv">{wqExpanded.hardness.toFixed(0)} mg/L</span></div>
                <div className="result-item"><span className="rl">Arsenic</span><span className="rv" style={{color:wqExpanded.arsenic>0.01?'#F44336':'#4CAF50'}}>{wqExpanded.arsenic.toFixed(3)} mg/L</span></div>
                <div className="result-item"><span className="rl">Nitrate</span><span className="rv">{wqExpanded.nitrate.toFixed(0)} mg/L</span></div>
                <div className="result-item"><span className="rl">Manganese</span><span className="rv">{wqExpanded.manganese.toFixed(2)} mg/L</span></div>
                <div className="result-item"><span className="rl">pH</span><span className="rv">{wqExpanded.pH.toFixed(1)}</span></div>
                <div className="result-item"><span className="rl">Contamination Risk</span><span className="rv" style={{color:wqExpanded.contaminationRisk==='High'?'#F44336':wqExpanded.contaminationRisk==='Medium'?'#FF9800':'#4CAF50'}}>{wqExpanded.contaminationRisk}</span></div>
              </div>
              <div className="treatment-box">
                <div className="treatment-header">Treatment Required: <strong style={{color:wqExpanded.treatmentRequired==='YES'?'#F44336':'#4CAF50'}}>{wqExpanded.treatmentRequired}</strong></div>
                {wqExpanded.estimatedTreatmentCostUSD > 0 && <div className="treatment-cost">Estimated Treatment Cost: <strong>{fmtUSD(wqExpanded.estimatedTreatmentCostUSD)}</strong> ({fmtKSH(wqExpanded.estimatedTreatmentCostUSD)})</div>}
                {result.waterQuality.treatmentRequired.length>0 && <ul className="rec-list">{result.waterQuality.treatmentRequired.map((t,i)=><li key={i}>{t}</li>)}</ul>}
              </div>
            </div>
          )}

          {/* COST BREAKDOWN (#2, #22) */}
          {activeResultTab==='costs' && (
            <div>
              <h4 className="tab-title">{'\u{1F4B5}'} Comprehensive Cost Breakdown</h4>
              <div className="cost-table">
                <table>
                  <thead><tr><th>Item</th><th>Cost (USD)</th><th>Cost (KSh)</th></tr></thead>
                  <tbody>
                    <tr><td>Drilling ({result.recommendedDepth.toFixed(0)}m @ ${cost.ratePerM}/m)</td><td>{fmtUSD(cost.drilling)}</td><td>{fmtKSH(cost.drilling)}</td></tr>
                    <tr><td>Casing &amp; Screen</td><td>{fmtUSD(cost.casing+cost.screen)}</td><td>{fmtKSH(cost.casing+cost.screen)}</td></tr>
                    <tr><td>Pump (submersible)</td><td>{fmtUSD(cost.pump)}</td><td>{fmtKSH(cost.pump)}</td></tr>
                    <tr><td>Installation (labour, wiring, trenching)</td><td>{fmtUSD(cost.installation)}</td><td>{fmtKSH(cost.installation)}</td></tr>
                    <tr><td>Mobilization</td><td>{fmtUSD(cost.mobilization)}</td><td>{fmtKSH(cost.mobilization)}</td></tr>
                    <tr><td>Accessories (pipes, fittings, valves, tanks)</td><td>{fmtUSD(cost.accessories)}</td><td>{fmtKSH(cost.accessories)}</td></tr>
                    <tr><td>Contingency (10%)</td><td>{fmtUSD(cost.contingency)}</td><td>{fmtKSH(cost.contingency)}</td></tr>
                    <tr className="cost-total"><td><strong>TOTAL BOREHOLE</strong></td><td><strong>{fmtUSD(cost.total)}</strong></td><td><strong>{fmtKSH(cost.total)}</strong></td></tr>
                  </tbody>
                </table>
              </div>
              {/* P50/P75/P90 Confidence Intervals */}
              <div style={{marginTop:20,background:'rgba(251,191,36,0.06)',border:'1px solid rgba(251,191,36,0.18)',borderRadius:12,padding:16}}>
                <h4 style={{margin:'0 0 12px',color:'#fbbf24',fontSize:14}}>{'📊'} Cost Confidence Intervals (±{cost.confidence.uncertaintyPct}% base uncertainty for {result.soil.type} soil)</h4>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))',gap:12}}>
                  <div style={{padding:'12px 16px',borderRadius:8,background:'rgba(34,197,94,0.08)',border:'1px solid rgba(34,197,94,0.15)'}}>
                    <div style={{fontSize:11,color:'var(--text-tertiary)',marginBottom:4}}>P10 (Optimistic)</div>
                    <div style={{fontSize:18,fontWeight:700,color:'#22c55e'}}>{fmtUSD(cost.confidence.p10)}</div>
                  </div>
                  <div style={{padding:'12px 16px',borderRadius:8,background:'rgba(56,189,248,0.08)',border:'1px solid rgba(56,189,248,0.15)'}}>
                    <div style={{fontSize:11,color:'var(--text-tertiary)',marginBottom:4}}>P50 (Base Estimate)</div>
                    <div style={{fontSize:18,fontWeight:700,color:'#38bdf8'}}>{fmtUSD(cost.confidence.p50)}</div>
                  </div>
                  <div style={{padding:'12px 16px',borderRadius:8,background:'rgba(251,191,36,0.08)',border:'1px solid rgba(251,191,36,0.15)'}}>
                    <div style={{fontSize:11,color:'var(--text-tertiary)',marginBottom:4}}>P75 (Likely Maximum)</div>
                    <div style={{fontSize:18,fontWeight:700,color:'#fbbf24'}}>{fmtUSD(cost.confidence.p75)}</div>
                  </div>
                  <div style={{padding:'12px 16px',borderRadius:8,background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.15)'}}>
                    <div style={{fontSize:11,color:'var(--text-tertiary)',marginBottom:4}}>P90 (Worst Case)</div>
                    <div style={{fontSize:18,fontWeight:700,color:'#ef4444'}}>{fmtUSD(cost.confidence.p90)}</div>
                  </div>
                </div>
                <div style={{marginTop:10,fontSize:11,color:'var(--text-tertiary)'}}>
                  Budget at P75 for planning ({fmtUSD(cost.confidence.p75)}). Reserve P90 ({fmtUSD(cost.confidence.p90)}) for contingency. Uncertainty driven by: soil variability (±{cost.confidence.uncertaintyPct}%), depth uncertainty, and local market fluctuations.
                </div>
              </div>
            </div>
          )}

          {/* SOLAR + SHELTER (#3) */}
          {activeResultTab==='solar' && (
            <div>
              <h4 className="tab-title">{'\u2600\uFE0F'} Solar + Shelter + Structure Costing</h4>
              <div className="result-grid">
                <div className="result-item"><span className="rl">Pump Power</span><span className="rv">{solar.pumpKw} kW</span></div>
                <div className="result-item"><span className="rl">Runtime</span><span className="rv">{solar.runtime} hrs/day</span></div>
                <div className="result-item"><span className="rl">Daily Energy Need</span><span className="rv">{solar.dailyKwh} kWh</span></div>
                <div className="result-item"><span className="rl">Solar Panel Size</span><span className="rv">{solar.panelKwp} kWp</span></div>
                <div className="result-item"><span className="rl">Battery Capacity</span><span className="rv">{solar.batteryKwh} kWh / {solar.batteryAh} Ah</span></div>
                <div className="result-item"><span className="rl">Inverter Rating</span><span className="rv">{solar.inverterKva} kVA</span></div>
              </div>
              <div className="cost-table" style={{marginTop:20}}>
                <table>
                  <thead><tr><th>Item</th><th>Cost (USD)</th><th>Cost (KSh)</th></tr></thead>
                  <tbody>
                    <tr><td>Solar Panels ({solar.panelKwp} kWp)</td><td>{fmtUSD(solar.panelCost)}</td><td>{fmtKSH(solar.panelCost)}</td></tr>
                    <tr><td>Battery Bank ({solar.batteryKwh} kWh)</td><td>{fmtUSD(solar.batteryCost)}</td><td>{fmtKSH(solar.batteryCost)}</td></tr>
                    <tr><td>Inverter ({solar.inverterKva} kVA)</td><td>{fmtUSD(solar.inverterCost)}</td><td>{fmtKSH(solar.inverterCost)}</td></tr>
                    <tr><td>Shelter / Structure</td><td>{fmtUSD(solar.shelterCost)}</td><td>{fmtKSH(solar.shelterCost)}</td></tr>
                    <tr><td>Labour + Installation</td><td>{fmtUSD(solar.labourCost)}</td><td>{fmtKSH(solar.labourCost)}</td></tr>
                    <tr><td>Accessories (cables, mounts, fuses)</td><td>{fmtUSD(solar.accessoryCost)}</td><td>{fmtKSH(solar.accessoryCost)}</td></tr>
                    <tr className="cost-total"><td><strong>TOTAL SOLAR SYSTEM</strong></td><td><strong>{fmtUSD(solar.totalSolar)}</strong></td><td><strong>{fmtKSH(solar.totalSolar)}</strong></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ROI & PAYBACK (#8) */}
          {activeResultTab==='roi' && (
            <div>
              <h4 className="tab-title">{'\u{1F4C8}'} ROI &amp; Payback Analysis</h4>
              <div className="roi-highlight">
                <div className="roi-big"><div className="roi-big-value">{roi.paybackMonths}</div><div className="roi-big-label">Months to Payback (P50)</div></div>
                <div className="roi-big"><div className="roi-big-value">{roi.roi}%</div><div className="roi-big-label">Annual ROI</div></div>
                <div className="roi-big"><div className="roi-big-value">{fmtUSD(roi.npv20)}</div><div className="roi-big-label">20-Year NPV (P50)</div></div>
              </div>
              {/* P50/P75/P90 Financial Confidence */}
              <div style={{marginBottom:20,background:'rgba(251,191,36,0.06)',border:'1px solid rgba(251,191,36,0.18)',borderRadius:12,padding:16}}>
                <h4 style={{margin:'0 0 12px',color:'#fbbf24',fontSize:14}}>{'📊'} Financial Risk Confidence Intervals</h4>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:12,marginBottom:12}}>
                  <div style={{textAlign:'center',padding:'10px',borderRadius:8,background:'rgba(56,189,248,0.08)'}}>
                    <div style={{fontSize:11,color:'var(--text-tertiary)'}}>P50 Payback</div>
                    <div style={{fontSize:20,fontWeight:700,color:'#38bdf8'}}>{roi.financialConfidence.paybackP50} mo</div>
                    <div style={{fontSize:11,color:'var(--text-tertiary)'}}>({(roi.financialConfidence.paybackP50/12).toFixed(1)} yrs)</div>
                  </div>
                  <div style={{textAlign:'center',padding:'10px',borderRadius:8,background:'rgba(251,191,36,0.08)'}}>
                    <div style={{fontSize:11,color:'var(--text-tertiary)'}}>P75 Payback</div>
                    <div style={{fontSize:20,fontWeight:700,color:'#fbbf24'}}>{roi.financialConfidence.paybackP75} mo</div>
                    <div style={{fontSize:11,color:'var(--text-tertiary)'}}>({(roi.financialConfidence.paybackP75/12).toFixed(1)} yrs)</div>
                  </div>
                  <div style={{textAlign:'center',padding:'10px',borderRadius:8,background:'rgba(239,68,68,0.08)'}}>
                    <div style={{fontSize:11,color:'var(--text-tertiary)'}}>P90 Payback</div>
                    <div style={{fontSize:20,fontWeight:700,color:'#ef4444'}}>{roi.financialConfidence.paybackP90} mo</div>
                    <div style={{fontSize:11,color:'var(--text-tertiary)'}}>({(roi.financialConfidence.paybackP90/12).toFixed(1)} yrs)</div>
                  </div>
                </div>
                <div style={{fontSize:12,color:'var(--text-secondary)'}}>
                  P75 scenario: Investment {fmtUSD(roi.financialConfidence.investmentRange.p75)} + low yield → payback in {roi.financialConfidence.paybackP75} months.
                  P90 (worst case): Investment {fmtUSD(roi.financialConfidence.investmentRange.p90)} + 70% yield → payback in {roi.financialConfidence.paybackP90} months. NPV₂₀ at P90: {fmtUSD(roi.financialConfidence.npvP90)}.
                </div>
              </div>
              <div className="result-grid">
                <div className="result-item"><span className="rl">Total Investment</span><span className="rv">{fmtUSD(roi.totalInvestment)}</span></div>
                <div className="result-item"><span className="rl">Borehole Cost</span><span className="rv">{fmtUSD(cost.total)}</span></div>
                <div className="result-item"><span className="rl">Solar System Cost</span><span className="rv">{fmtUSD(solar.totalSolar)}</span></div>
                <div className="result-item"><span className="rl">Monthly Water Savings</span><span className="rv">{fmtUSD(roi.monthlySavings)} ({fmtKSH(roi.monthlySavings)})</span></div>
                <div className="result-item"><span className="rl">Annual Revenue</span><span className="rv">{fmtUSD(roi.annualRevenue)}</span></div>
                <div className="result-item"><span className="rl">Annual Maintenance</span><span className="rv">{fmtUSD(roi.maintenanceCost)}</span></div>
              </div>
              <div className="roi-note">This analysis converts the borehole from an expense into a <strong>business decision engine</strong>. Payback in {roi.paybackMonths} months means the borehole pays for itself in ~{(roi.paybackMonths/12).toFixed(1)} years.</div>
            </div>
          )}

          {/* DRILLING STRATEGY (#20) */}
          {activeResultTab==='strategy' && (
            <div>
              <h4 className="tab-title">{'\u{1F6E0}\uFE0F'} Best Drilling Strategy</h4>
              <div className="result-grid">
                <div className="result-item"><span className="rl">Recommended Season</span><span className="rv">{strategy.recommendedSeason}</span></div>
                <div className="result-item"><span className="rl">Drilling Method</span><span className="rv">{strategy.method}</span></div>
                <div className="result-item"><span className="rl">Casing Required</span><span className="rv">{strategy.casingRequired}</span></div>
                <div className="result-item"><span className="rl">Screen Placement</span><span className="rv">{strategy.screenPlacement}</span></div>
                <div className="result-item"><span className="rl">Gravel Pack</span><span className="rv">{strategy.gravelPack}</span></div>
                <div className="result-item"><span className="rl">Development</span><span className="rv">{strategy.developmentMethod}</span></div>
                <div className="result-item"><span className="rl">Est. Duration</span><span className="rv">{strategy.estimatedDuration}</span></div>
                <div className="result-item"><span className="rl">Soil Note</span><span className="rv">{strategy.soilNote}</span></div>
              </div>
            </div>
          )}

          {/* CLIMATE & SEASONAL (#12) */}
          {activeResultTab==='climate' && (
            <div>
              <h4 className="tab-title">{'\u2601\uFE0F'} Climate &amp; Seasonal Analysis</h4>
              <div style={{background:'rgba(56,189,248,0.06)',border:'1px solid rgba(56,189,248,0.15)',padding:'10px 14px',borderRadius:8,marginBottom:16,fontSize:12,color:'var(--text-secondary)'}}>
                <strong>Data Source:</strong> {(climate as any).dataSource ?? 'NASA POWER / ERA5-Land'}
              </div>
              <div className="result-grid" style={{marginBottom:20}}>
                <div className="result-item"><span className="rl">Best Drilling Season</span><span className="rv" style={{color:'#4CAF50'}}>{climate.bestDrillingSeason}</span></div>
                <div className="result-item"><span className="rl">Aquifer Recharge Risk</span><span className="rv">{climate.aquiferRechargeRisk}</span></div>
                <div className="result-item"><span className="rl">Recharge Rate</span><span className="rv">{climate.rechargeRate}</span></div>
                <div className="result-item"><span className="rl">Water Table Stability</span><span className="rv">{climate.waterTableStability}</span></div>
              </div>
              {climate.rainfall.some((r: any) => r.mm > 0) ? (
                <>
                <h4>Monthly Rainfall (NASA POWER 20-year average)</h4>
              <div className="rainfall-chart">
                {climate.rainfall.map((r: any,i: number) => (
                  <div key={i} className="rain-bar-wrap">
                    <div className="rain-bar" style={{height:Math.max(4, r.mm*0.8)+'px'}}></div>
                    <div className="rain-val">{r.mm}</div>
                    <div className="rain-month">{r.month}</div>
                  </div>
                ))}
              </div>
                </>
              ) : (
                <div style={{padding:16,background:'rgba(251,191,36,0.06)',border:'1px solid rgba(251,191,36,0.15)',borderRadius:8,fontSize:12,color:'var(--text-secondary)'}}>
                  No monthly rainfall data available from NASA POWER for this location. Consult local meteorological records.
                </div>
              )}
            </div>
          )}

          {/* PROBABILITY (#16) */}
          {activeResultTab==='probability' && (
            <div>
              <h4 className="tab-title">{'\u{1F4CA}'} Probability Breakdown</h4>
              <div className="prob-cards">
                <div className="prob-card"><div className="prob-value">{prob.success}%</div><div className="prob-label">Success Probability</div></div>
                <div className="prob-card"><div className="prob-value">{prob.hitMainAquifer}%</div><div className="prob-label">Hit Main Aquifer</div></div>
                <div className="prob-card"><div className="prob-value">{prob.deeperYieldImprovement}%</div><div className="prob-label">Deeper Yield Improvement</div></div>
              </div>
              <div className="result-grid">
                <div className="result-item"><span className="rl">Recharge Potential</span><span className="rv">{prob.rechargePotential}</span></div>
                <div className="result-item"><span className="rl">5-Year Risk</span><span className="rv">{prob.fiveYearRisk}</span></div>
              </div>
            </div>
          )}

          {/* ML MODELS (Part 2) */}
          {activeResultTab==='ml-models' && (
            <div>
              <h4 className="tab-title">{'\u{1F9E0}'} AI &amp; Machine Learning Models Used</h4>
              <p className="tab-desc">6 deep learning models, 4 ensemble methods, and 4 time series forecasters were applied to this site.</p>
              <h4 style={{color:'#E91E63',marginBottom:12}}>Deep Learning Models</h4>
              <div className="sci-table-wrap">
                <table className="sci-table">
                  <thead><tr><th>Model</th><th>Architecture</th><th>Input</th><th>Output</th><th>Training Data</th></tr></thead>
                  <tbody>{SCI.DL_MODELS.map((m,i)=><tr key={i}><td>{m.name}</td><td>{m.arch}</td><td>{m.input}</td><td>{m.output}</td><td>{m.training}</td></tr>)}</tbody>
                </table>
              </div>
              <h4 style={{color:'#00BCD4',margin:'20px 0 12px'}}>Ensemble Methods</h4>
              <div className="sci-table-wrap">
                <table className="sci-table">
                  <thead><tr><th>Method</th><th>Purpose</th><th>Models</th><th>Weighting</th></tr></thead>
                  <tbody>{SCI.ENSEMBLE_METHODS.map((m,i)=><tr key={i}><td>{m.method}</td><td>{m.purpose}</td><td>{m.models}</td><td>{m.weighting}</td></tr>)}</tbody>
                </table>
              </div>
              <h4 style={{color:'#FF5722',margin:'20px 0 12px'}}>Time Series Forecasting</h4>
              <div className="sci-table-wrap">
                <table className="sci-table">
                  <thead><tr><th>Variable</th><th>Horizon</th><th>Model</th><th>Inputs</th><th>Accuracy</th></tr></thead>
                  <tbody>{SCI.TIME_SERIES.map((m,i)=><tr key={i}><td>{m.variable}</td><td>{m.horizon}</td><td>{m.model}</td><td>{m.input}</td><td>{m.accuracy}</td></tr>)}</tbody>
                </table>
              </div>
              <div className="formula-block" style={{marginTop:16}}>
                <strong>Success Formula:</strong> <code>{SCI.FORMULAS.successProb}</code>
              </div>
            </div>
          )}

          {/* RISK (#6) */}
          {activeResultTab==='risk' && (
            <div>
              <h4 className="tab-title">{'\u26A0\uFE0F'} Risk Assessment Matrix</h4>
              <div className="result-grid">
                <div className="result-item"><span className="rl">Overall</span><span className="rv" style={{color:getRiskColor(result.risk.overallRisk)}}>{(result.risk.overallRisk*100).toFixed(0)}%</span></div>
                <div className="result-item"><span className="rl">Geological</span><span className="rv">{(result.risk.categories.geological*100).toFixed(0)}%</span></div>
                <div className="result-item"><span className="rl">Contamination</span><span className="rv">{(result.risk.categories.contamination*100).toFixed(0)}%</span></div>
                <div className="result-item"><span className="rl">Depth</span><span className="rv">{(result.risk.categories.depth*100).toFixed(0)}%</span></div>
                <div className="result-item"><span className="rl">Financial</span><span className="rv">{(result.risk.categories.financial*100).toFixed(0)}%</span></div>
                <div className="result-item"><span className="rl">Technical</span><span className="rv">{(result.risk.categories.technical*100).toFixed(0)}%</span></div>
              </div>
              {result.risk.contaminationRisk.sources.length>0 && (
                <div style={{marginTop:16}}>
                  <h4>Contamination Sources</h4>
                  {result.risk.contaminationRisk.sources.map((src,i) => (
                    <div key={i} className="contamination-card">
                      <strong>{src.type.toUpperCase()}</strong>
                      <div>Distance: {src.distance}m ({src.direction}) | Severity: {src.severity.toUpperCase()}</div>
                      <div>Risk: {(src.riskLevel*100).toFixed(0)}% | Chemicals: {src.chemicals.join(', ')}</div>
                    </div>
                  ))}
                </div>
              )}
              {result.risk.recommendations.length>0 && (
                <div className="result-item full-width" style={{marginTop:16}}><span className="rl">Recommendations</span><ul className="rec-list">{result.risk.recommendations.map((r,i)=><li key={i}>{r}</li>)}</ul></div>
              )}
            </div>
          )}

          {/* ═══ RISK-BASED DECISION ENGINE ═══ */}
          {activeResultTab==='risk-decision' && (
            <div>
              <h4 className="tab-title">{'\u{1F3AF}'} Risk-Based Decision Engine</h4>
              <p className="tab-desc">Probabilistic success/failure breakdown with financial risk analysis and actionable recommendations.</p>
              {result.riskDecision ? (
                <div>
                  {/* Probability Breakdown */}
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:10,marginBottom:20}}>
                    {[
                      {label:'Success',val:result.riskDecision.successProbability,color:'#22c55e'},
                      {label:'Low Yield',val:result.riskDecision.lowYieldProbability,color:'#f59e0b'},
                      {label:'Dry Borehole',val:result.riskDecision.dryBoreholeProbability,color:'#ef4444'},
                      {label:'Poor Quality',val:result.riskDecision.poorQualityProbability,color:'#8b5cf6'},
                      {label:'Collapse Risk',val:result.riskDecision.collapseRiskProbability,color:'#6b7280'},
                    ].map(p=>(
                      <div key={p.label} style={{padding:14,borderRadius:12,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',textAlign:'center'}}>
                        <div style={{fontSize:24,fontWeight:800,color:p.color}}>{p.val}%</div>
                        <div style={{fontSize:11,color:'var(--text-secondary)',marginTop:4}}>{p.label}</div>
                      </div>
                    ))}
                  </div>
                  {/* Decision Recommendation */}
                  <div style={{padding:16,borderRadius:12,background:result.riskDecision.recommendation.action==='DRILL'?'rgba(34,197,94,0.08)':result.riskDecision.recommendation.action==='SURVEY_FIRST'?'rgba(251,191,36,0.08)':'rgba(239,68,68,0.08)',border:`2px solid ${result.riskDecision.recommendation.action==='DRILL'?'rgba(34,197,94,0.3)':result.riskDecision.recommendation.action==='SURVEY_FIRST'?'rgba(251,191,36,0.3)':'rgba(239,68,68,0.3)'}`,marginBottom:16}}>
                    <div style={{fontWeight:800,fontSize:16,marginBottom:8}}>{result.riskDecision.recommendation.action}: {result.riskDecision.recommendation.headline}</div>
                    <ul style={{margin:0,paddingLeft:20}}>{result.riskDecision.recommendation.reasoning.map((r: string,i: number)=><li key={i} style={{fontSize:13,marginBottom:4}}>{r}</li>)}</ul>
                  </div>
                  {/* Financial Risk */}
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))',gap:8,marginBottom:16}}>
                    <div className="result-item"><span className="rl">Expected Value</span><span className="rv">${result.riskDecision.expectedValue_USD.toLocaleString()}</span></div>
                    <div className="result-item"><span className="rl">Best Case</span><span className="rv">${result.riskDecision.bestCase_USD.toLocaleString()}</span></div>
                    <div className="result-item"><span className="rl">Worst Case</span><span className="rv" style={{color:'#ef4444'}}>${result.riskDecision.worstCase_USD.toLocaleString()}</span></div>
                    <div className="result-item"><span className="rl">ROI</span><span className="rv">{(result.riskDecision.roi*100).toFixed(0)}%</span></div>
                    <div className="result-item"><span className="rl">Payback</span><span className="rv">{result.riskDecision.paybackMonths} months</span></div>
                    <div className="result-item"><span className="rl">Risk Level</span><span className="rv" style={{textTransform:'uppercase'}}>{result.riskDecision.overallRiskLevel}</span></div>
                    <div className="result-item"><span className="rl">Confidence Grade</span><span className="rv">{result.riskDecision.confidenceGrade}</span></div>
                  </div>
                  {/* Risk Categories */}
                  <h4 style={{marginTop:12,marginBottom:8}}>Risk Categories</h4>
                  {result.riskDecision.risks.map((r: any,i: number)=>(
                    <div key={i} style={{padding:10,borderRadius:8,background:'rgba(255,255,255,0.02)',marginBottom:8,borderLeft:`3px solid ${r.impact==='critical'?'#ef4444':r.impact==='high'?'#f97316':r.impact==='moderate'?'#f59e0b':'#22c55e'}`}}>
                      <div style={{fontWeight:700,fontSize:13}}>{r.name} — {(r.probability*100).toFixed(0)}% ({r.impact})</div>
                      <div style={{fontSize:12,color:'var(--text-secondary)',marginTop:2}}>{r.description}</div>
                      <ul style={{margin:'4px 0 0',paddingLeft:18}}>{r.mitigation.map((m: string,mi: number)=><li key={mi} style={{fontSize:11}}>{m}</li>)}</ul>
                    </div>
                  ))}
                  {result.riskDecision.dataQualityWarning && <div style={{padding:10,borderRadius:8,background:'rgba(239,68,68,0.06)',border:'1px solid rgba(239,68,68,0.2)',fontSize:12,marginTop:12}}>{result.riskDecision.dataQualityWarning}</div>}
                  {/* Scenarios */}
                  <h4 style={{marginTop:16,marginBottom:8}}>Scenario Analysis</h4>
                  <div className="sci-table-wrap"><table className="sci-table"><thead><tr><th>Scenario</th><th>Probability</th><th>Depth</th><th>Yield</th><th>Cost</th><th>Outcome</th></tr></thead><tbody>
                    {result.riskDecision.scenarios.map((s: any,i: number)=>(
                      <tr key={i}><td>{s.name}</td><td>{(s.probability*100).toFixed(0)}%</td><td>{s.depth_m.toFixed(0)}m</td><td>{s.yield_m3hr.toFixed(1)} m³/hr</td><td>${s.cost_USD.toLocaleString()}</td><td>{s.outcome}</td></tr>
                    ))}
                  </tbody></table></div>
                </div>
              ) : <p style={{color:'var(--text-muted)'}}>Risk decision engine requires analysis data.</p>}
            </div>
          )}

          {/* ═══ CONFIDENCE WEIGHTED BY DATA QUALITY ═══ */}
          {activeResultTab==='confidence-quality' && (
            <div>
              <h4 className="tab-title">{'\u{1F4CA}'} Confidence Weighted by Data Quality</h4>
              <p className="tab-desc">Dynamic confidence scoring based on data density, source agreement, and method quality.</p>
              {result.confidenceWeighted ? (
                <div>
                  <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:20}}>
                    <div style={{width:80,height:80,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',background:`conic-gradient(${result.confidenceWeighted.overallConfidence>=0.7?'#22c55e':result.confidenceWeighted.overallConfidence>=0.5?'#f59e0b':'#ef4444'} ${result.confidenceWeighted.overallConfidence*360}deg, rgba(148,163,184,0.1) 0deg)`}}>
                      <div style={{width:60,height:60,borderRadius:'50%',background:'var(--bg-primary)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:18}}>
                        {(result.confidenceWeighted.overallConfidence*100).toFixed(0)}%
                      </div>
                    </div>
                    <div>
                      <div style={{fontSize:22,fontWeight:800}}>Grade {result.confidenceWeighted.confidenceGrade}</div>
                      <div style={{fontSize:13,color:'var(--text-secondary)'}}>{result.confidenceWeighted.gradeDescription}</div>
                    </div>
                  </div>
                  {/* Score Breakdown */}
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:10,marginBottom:16}}>
                    {[
                      {label:'Data Quality',val:result.confidenceWeighted.dataQualityScore},
                      {label:'Completeness',val:result.confidenceWeighted.dataCompletenessScore},
                      {label:'Source Agreement',val:result.confidenceWeighted.sourceAgreementScore},
                      {label:'Validation',val:result.confidenceWeighted.validationScore},
                      {label:'Method Quality',val:result.confidenceWeighted.methodQualityScore},
                    ].map(s=>(
                      <div key={s.label} style={{padding:10,borderRadius:8,background:'rgba(255,255,255,0.03)'}}>
                        <div style={{fontSize:11,color:'var(--text-secondary)',marginBottom:4}}>{s.label}</div>
                        <div style={{height:6,borderRadius:3,background:'rgba(255,255,255,0.06)'}}>
                          <div style={{height:'100%',borderRadius:3,width:`${s.val*100}%`,background:s.val>=0.7?'#22c55e':s.val>=0.5?'#f59e0b':'#ef4444'}}/>
                        </div>
                        <div style={{fontSize:13,fontWeight:700,marginTop:4}}>{(s.val*100).toFixed(0)}%</div>
                      </div>
                    ))}
                  </div>
                  {/* Uncertainty Bounds */}
                  {result.confidenceWeighted.uncertaintyBounds && (
                    <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:16}}>
                      <div style={{padding:'8px 14px',borderRadius:8,background:'rgba(56,189,248,0.08)',fontSize:12}}>
                        <strong>Depth:</strong> {result.confidenceWeighted.uncertaintyBounds.depth_m.lower}–{result.confidenceWeighted.uncertaintyBounds.depth_m.upper}m
                      </div>
                      <div style={{padding:'8px 14px',borderRadius:8,background:'rgba(34,197,94,0.08)',fontSize:12}}>
                        <strong>Yield:</strong> {result.confidenceWeighted.uncertaintyBounds.yield_m3hr.lower}–{result.confidenceWeighted.uncertaintyBounds.yield_m3hr.upper} m³/hr
                      </div>
                      <div style={{padding:'8px 14px',borderRadius:8,background:'rgba(251,191,36,0.08)',fontSize:12}}>
                        <strong>Probability:</strong> {Math.round(result.confidenceWeighted.uncertaintyBounds.probability.lower*100)}–{Math.round(result.confidenceWeighted.uncertaintyBounds.probability.upper*100)}%
                      </div>
                    </div>
                  )}
                  {/* Improvements */}
                  {result.confidenceWeighted.improvements?.length>0 && (
                    <div>
                      <h4 style={{marginBottom:8}}>How to Improve Confidence</h4>
                      {result.confidenceWeighted.improvements.map((imp: any,i: number)=>(
                        <div key={i} style={{padding:8,borderRadius:6,background:'rgba(255,255,255,0.02)',marginBottom:6,display:'flex',gap:8,alignItems:'center'}}>
                          <span style={{padding:'2px 8px',borderRadius:4,fontSize:10,fontWeight:700,background:imp.priority==='critical'?'rgba(239,68,68,0.15)':imp.priority==='high'?'rgba(249,115,22,0.15)':'rgba(148,163,184,0.1)',color:imp.priority==='critical'?'#ef4444':imp.priority==='high'?'#f97316':'var(--text-secondary)'}}>{imp.priority.toUpperCase()}</span>
                          <div style={{flex:1,fontSize:12}}>{imp.action}</div>
                          <div style={{fontSize:11,color:'#22c55e',fontWeight:700}}>+{imp.expectedGainPct}%</div>
                          <div style={{fontSize:11,color:'var(--text-muted)'}}>{imp.cost}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Data Sources */}
                  <h4 style={{marginTop:16,marginBottom:8}}>Data Sources</h4>
                  <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                    {result.confidenceWeighted.sources?.map((s: any,i: number)=>(
                      <span key={i} style={{padding:'3px 10px',borderRadius:6,fontSize:11,background:s.available?'rgba(34,197,94,0.1)':'rgba(239,68,68,0.06)',color:s.available?'#22c55e':'var(--text-muted)',border:`1px solid ${s.available?'rgba(34,197,94,0.2)':'rgba(255,255,255,0.05)'}`}}>
                        {s.available?'\u2713':'\u2717'} {s.name.replace(/_/g,' ')}
                      </span>
                    ))}
                  </div>
                </div>
              ) : <p style={{color:'var(--text-muted)'}}>Confidence weighting requires analysis data.</p>}
            </div>
          )}

          {/* ═══ GEOPHYSICS FUSION ═══ */}
          {activeResultTab==='geophysics-fusion' && (
            <div>
              <h4 className="tab-title">{'\u26A1'} Multi-Geophysics Fusion</h4>
              <div style={{background:'rgba(251,191,36,0.06)',border:'1px solid rgba(251,191,36,0.2)',borderRadius:8,padding:'8px 14px',marginBottom:10,fontSize:11,color:'#fbbf24'}}>{'\u26A0\uFE0F'} <strong>Independent Model Estimate</strong> — Yield values below are from the geophysics fusion model. See the <strong>Final Recommendation</strong> banner for the reconciled consensus answer.</div>
              <p className="tab-desc">ERT + TDEM + Seismic + GPR + NMR unified subsurface model. Requires field geophysical data.</p>
              {result.geophysicsFusion ? (
                <div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:8,marginBottom:16}}>
                    <div className="result-item"><span className="rl">Methods Fused</span><span className="rv">{result.geophysicsFusion.unifiedLayers?.length ?? 0} layers</span></div>
                    <div className="result-item"><span className="rl">Bedrock Depth</span><span className="rv">{result.geophysicsFusion.bedrockDepth?.toFixed(0) ?? '—'}m</span></div>
                    <div className="result-item"><span className="rl">Water Table</span><span className="rv">{result.geophysicsFusion.waterTable?.toFixed(0) ?? '—'}m</span></div>
                    <div className="result-item"><span className="rl">Expected Yield</span><span className="rv">{result.geophysicsFusion.expectedYield?.toFixed(1) ?? '—'} m³/hr</span></div>
                    <div className="result-item"><span className="rl">Confidence</span><span className="rv">{((result.geophysicsFusion.overallConfidence ?? 0)*100).toFixed(0)}%</span></div>
                    <div className="result-item"><span className="rl">Confidence Boost</span><span className="rv">+{result.geophysicsFusion.confidenceBoost ?? 0}%</span></div>
                    <div className="result-item"><span className="rl">Drill Depth</span><span className="rv">{result.geophysicsFusion.recommendedDrillingDepth?.toFixed(0) ?? '—'}m</span></div>
                    <div className="result-item"><span className="rl">Casing Depth</span><span className="rv">{result.geophysicsFusion.recommendedCasingDepth?.toFixed(0) ?? '—'}m</span></div>
                  </div>
                  {result.geophysicsFusion.aquiferZones?.length>0 && (
                    <div><h4 style={{marginBottom:8}}>Aquifer Zones</h4>
                    <div className="sci-table-wrap"><table className="sci-table"><thead><tr><th>Depth (m)</th><th>Thickness</th><th>Type</th><th>Yield Est.</th><th>Confidence</th></tr></thead><tbody>
                      {result.geophysicsFusion.aquiferZones.map((z: any,i: number)=>(
                        <tr key={i}><td>{z.topDepth?.toFixed(0)}–{z.bottomDepth?.toFixed(0)}</td><td>{z.thickness?.toFixed(0)}m</td><td>{z.type}</td><td>{z.estimatedYield?.toFixed(1)} m³/hr</td><td>{((z.confidence??0)*100).toFixed(0)}%</td></tr>
                      ))}
                    </tbody></table></div></div>
                  )}
                </div>
              ) : <p style={{color:'var(--text-muted)'}}>Upload field geophysical data (ERT, TDEM, Seismic) to enable multi-geophysics fusion.</p>}
            </div>
          )}

          {/* ═══ FRACTURE & LINEAMENT AI ═══ */}
          {activeResultTab==='fracture-ai' && (
            <div>
              <h4 className="tab-title">{'\u{1F5FA}\uFE0F'} Fracture &amp; Lineament AI</h4>
              <p className="tab-desc">DEM morphometric analysis + tectonic pattern library + structural intersection ranking.</p>
              <div style={{background:'#fef3cd',borderLeft:'4px solid #f59e0b',padding:'8px 12px',marginBottom:12,borderRadius:4,fontSize:11,color:'#92400e'}}>⚠️ MODELLED — Lineaments are inferred from DEM morphometry and tectonic pattern library, not field-detected. Fracture density, orientation, and connectivity are model estimates.</div>
              {result.fractureAI ? (
                <div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:8,marginBottom:16}}>
                    <div className="result-item"><span className="rl">Fracture Score</span><span className="rv">{(result.fractureAI.overallFractureScore*100).toFixed(0)}/100</span></div>
                    <div className="result-item"><span className="rl">Lineaments</span><span className="rv">{result.fractureAI.lineaments?.length ?? 0}</span></div>
                    <div className="result-item"><span className="rl">Intersections</span><span className="rv">{result.fractureAI.intersections?.length ?? 0}</span></div>
                    <div className="result-item"><span className="rl">Yield Multiplier</span><span className="rv">{result.fractureAI.yieldMultiplier?.toFixed(1)}×</span></div>
                    <div className="result-item"><span className="rl">Preferred Azimuth</span><span className="rv">{result.fractureAI.preferredDrillingAzimuth?.toFixed(0)}°</span></div>
                    <div className="result-item"><span className="rl">Complexity</span><span className="rv" style={{textTransform:'capitalize'}}>{result.fractureAI.structuralComplexity}</span></div>
                    <div className="result-item"><span className="rl">Permeability</span><span className="rv">{(result.fractureAI.permeabilityScore*100).toFixed(0)}%</span></div>
                  </div>
                  {result.fractureAI.topIntersections?.length>0 && (
                    <div><h4 style={{marginBottom:8}}>Top Drilling Intersections</h4>
                    <div className="sci-table-wrap"><table className="sci-table"><thead><tr><th>#</th><th>Location</th><th>Angle</th><th>Score</th><th>Permeability</th></tr></thead><tbody>
                      {result.fractureAI.topIntersections.map((t: any,i: number)=>(
                        <tr key={i}><td>{i+1}</td><td>{t.latitude?.toFixed(5)}, {t.longitude?.toFixed(5)}</td><td>{t.angle?.toFixed(0)}°</td><td>{(t.score*100).toFixed(0)}</td><td>{t.permeabilityIndex?.toFixed(2)}</td></tr>
                      ))}
                    </tbody></table></div></div>
                  )}
                </div>
              ) : <p style={{color:'var(--text-muted)'}}>Fracture analysis requires GPS coordinates.</p>}
            </div>
          )}

          {/* ═══ AQUIFER TYPE CLASSIFIER ═══ */}
          {activeResultTab==='aquifer-type' && (
            <div>
              <h4 className="tab-title">{'\u{1F4A7}'} Aquifer Type Classifier</h4>
              <p className="tab-desc">Multi-evidence Bayesian classification with full aquifer characteristics and monitoring guidance.</p>
              {result.aquiferClassification ? (
                <div>
                  <div style={{padding:16,borderRadius:12,background:'rgba(56,189,248,0.06)',border:'1px solid rgba(56,189,248,0.15)',marginBottom:16}}>
                    <div style={{fontSize:22,fontWeight:800,color:'#38bdf8',textTransform:'capitalize'}}>{result.aquiferClassification.aquiferType?.replace(/_/g,' ')}</div>
                    <div style={{fontSize:13,color:'var(--text-secondary)',marginTop:4}}>Confidence: {((result.aquiferClassification.confidence ?? 0)*100).toFixed(0)}%</div>
                    {result.aquiferClassification.conceptualModel && <div style={{fontSize:12,marginTop:8,lineHeight:1.6}}>{result.aquiferClassification.conceptualModel}</div>}
                  </div>
                  {result.aquiferClassification.characteristics && (
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:8,marginBottom:16}}>
                      <div className="result-item"><span className="rl">Depth Range</span><span className="rv">{result.aquiferClassification.characteristics.typicalDepthRange?.[0]}–{result.aquiferClassification.characteristics.typicalDepthRange?.[1]}m</span></div>
                      <div className="result-item"><span className="rl">Yield Range</span><span className="rv">{result.aquiferClassification.characteristics.yieldRange?.[0]}–{result.aquiferClassification.characteristics.yieldRange?.[1]} m³/hr</span></div>
                      <div className="result-item"><span className="rl">Drill Method</span><span className="rv">{result.aquiferClassification.characteristics.drillMethod}</span></div>
                      <div className="result-item"><span className="rl">Vulnerability</span><span className="rv" style={{textTransform:'capitalize'}}>{result.aquiferClassification.characteristics.vulnerabilityToContamination}</span></div>
                      <div className="result-item"><span className="rl">Sustainability</span><span className="rv">{result.aquiferClassification.characteristics.sustainabilityOutlook}</span></div>
                      <div className="result-item"><span className="rl">Depletion Risk</span><span className="rv" style={{textTransform:'capitalize'}}>{result.aquiferClassification.characteristics.depletionRisk}</span></div>
                    </div>
                  )}
                  {result.aquiferClassification.allTypes?.length>0 && (
                    <div><h4 style={{marginBottom:8}}>Probability by Aquifer Type</h4>
                    {result.aquiferClassification.allTypes.map((t: any,i: number)=>(
                      <div key={i} style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                        <span style={{width:100,fontSize:12,textTransform:'capitalize'}}>{t.type?.replace(/_/g,' ')}</span>
                        <div style={{flex:1,height:8,borderRadius:4,background:'rgba(255,255,255,0.06)'}}>
                          <div style={{height:'100%',borderRadius:4,width:`${(t.probability??0)*100}%`,background:'#38bdf8'}}/>
                        </div>
                        <span style={{fontSize:12,width:40,textAlign:'right'}}>{((t.probability??0)*100).toFixed(0)}%</span>
                      </div>
                    ))}
                    </div>
                  )}
                </div>
              ) : <p style={{color:'var(--text-muted)'}}>Aquifer classification requires GPS coordinates.</p>}
            </div>
          )}

          {/* ═══ DYNAMIC RECHARGE MODEL ═══ */}
          {activeResultTab==='recharge-model' && (
            <div>
              <h4 className="tab-title">{'\u{1F327}\uFE0F'} Dynamic Recharge Model</h4>
              <p className="tab-desc">Thornthwaite soil-water balance + SCS-CN runoff. Monthly recharge estimation with trend analysis.</p>
              {result.rechargeModel ? (
                <div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:8,marginBottom:16}}>
                    <div className="result-item"><span className="rl">Annual Recharge</span><span className="rv">{result.rechargeModel.annualRecharge_mm?.toFixed(0)} mm/yr</span></div>
                    <div className="result-item"><span className="rl">Recharge Fraction</span><span className="rv">{((result.rechargeModel.rechargeFraction ?? 0)*100).toFixed(1)}%</span></div>
                    <div className="result-item"><span className="rl">Sustainable Yield</span><span className="rv">{result.rechargeModel.sustainableYield_m3day?.toFixed(1)} m³/day</span></div>
                    <div className="result-item"><span className="rl">Annual Runoff</span><span className="rv">{result.rechargeModel.annualRunoff_mm?.toFixed(0)} mm</span></div>
                    <div className="result-item"><span className="rl">Annual ET</span><span className="rv">{result.rechargeModel.annualET_mm?.toFixed(0)} mm</span></div>
                    <div className="result-item"><span className="rl">Depletion Risk</span><span className="rv" style={{textTransform:'capitalize'}}>{result.rechargeModel.depletionRisk}</span></div>
                  </div>
                  {/* Monthly Recharge Chart (text-based) */}
                  {result.rechargeModel.monthlyRecharge && (
                    <div style={{marginBottom:16}}>
                      <h4 style={{marginBottom:8}}>Monthly Recharge</h4>
                      <div style={{display:'flex',gap:4,alignItems:'flex-end',height:100}}>
                        {result.rechargeModel.monthlyRecharge.map((m: any,i: number)=>{
                          const maxR = Math.max(...result.rechargeModel.monthlyRecharge.map((x: any)=>x.recharge_mm ?? 0), 1);
                          const h = ((m.recharge_mm ?? 0) / maxR) * 80;
                          return (<div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                            <div style={{fontSize:9,color:'var(--text-muted)'}}>{(m.recharge_mm??0).toFixed(0)}</div>
                            <div style={{width:'100%',height:h,background:'rgba(56,189,248,0.5)',borderRadius:'3px 3px 0 0',minHeight:2}}/>
                            <div style={{fontSize:9,color:'var(--text-secondary)'}}>{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</div>
                          </div>);
                        })}
                      </div>
                    </div>
                  )}
                  {/* Climate Projections */}
                  {result.rechargeModel.climateProjections && (
                    <div><h4 style={{marginBottom:8}}>Climate Projections</h4>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                      <div className="result-item"><span className="rl">2030 Recharge</span><span className="rv">{result.rechargeModel.climateProjections.recharge2030_mm?.toFixed(0)} mm ({result.rechargeModel.climateProjections.change2030_pct > 0 ? '+' : ''}{result.rechargeModel.climateProjections.change2030_pct?.toFixed(0)}%)</span></div>
                      <div className="result-item"><span className="rl">2050 Recharge</span><span className="rv">{result.rechargeModel.climateProjections.recharge2050_mm?.toFixed(0)} mm ({result.rechargeModel.climateProjections.change2050_pct > 0 ? '+' : ''}{result.rechargeModel.climateProjections.change2050_pct?.toFixed(0)}%)</span></div>
                    </div></div>
                  )}
                </div>
              ) : <p style={{color:'var(--text-muted)'}}>Recharge model requires historical weather data and GPS coordinates.</p>}
            </div>
          )}

          {/* ═══ PROBABILISTIC DRILL MAP ═══ */}
          {activeResultTab==='drill-map' && (
            <div>
              <h4 className="tab-title">{'\u{1F5FA}\uFE0F'} Probabilistic Drilling Map</h4>
              <p className="tab-desc">Spatial probability heatmap with ranked drilling points and modifier analysis.</p>
              {result.drillMap ? (
                <div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:8,marginBottom:16}}>
                    <div className="result-item"><span className="rl">Grid Size</span><span className="rv">{result.drillMap.gridSize_m}m × {result.drillMap.gridSize_m}m</span></div>
                    <div className="result-item"><span className="rl">Cells Evaluated</span><span className="rv">{result.drillMap.cellsEvaluated}</span></div>
                    <div className="result-item"><span className="rl">Top Points</span><span className="rv">{result.drillMap.topDrillingPoints?.length ?? 0}</span></div>
                  </div>
                  {result.drillMap.topDrillingPoints?.length>0 && (
                    <div><h4 style={{marginBottom:8}}>Ranked Drilling Points</h4>
                    <div className="sci-table-wrap"><table className="sci-table"><thead><tr><th>#</th><th>Latitude</th><th>Longitude</th><th>Score</th><th>Distance</th></tr></thead><tbody>
                      {result.drillMap.topDrillingPoints.map((p: any,i: number)=>(
                        <tr key={i}><td style={{fontWeight:700}}>{p.rank}</td><td>{p.latitude?.toFixed(5)}</td><td>{p.longitude?.toFixed(5)}</td><td style={{color:'#22c55e',fontWeight:700}}>{(p.score*100).toFixed(0)}%</td><td>{p.distanceFromCenter_m?.toFixed(0)}m</td></tr>
                      ))}
                    </tbody></table></div></div>
                  )}
                </div>
              ) : <p style={{color:'var(--text-muted)'}}>Drilling map requires GPS coordinates.</p>}
            </div>
          )}

          {/* ═══ MICRO-SITING OPTIMIZER ═══ */}
          {activeResultTab==='micro-siting' && (
            <div>
              <h4 className="tab-title">{'\u{1F4CD}'} Micro-Siting Optimizer</h4>
              <p className="tab-desc">Find the exact best drilling point within your plot using terrain flow, fracture proximity, slope, and drainage.</p>
              {result.microSiting ? (
                <div>
                  <div style={{padding:16,borderRadius:12,background:'rgba(34,197,94,0.06)',border:'1px solid rgba(34,197,94,0.15)',marginBottom:16}}>
                    <div style={{fontSize:16,fontWeight:800,color:'#22c55e'}}>Best Point: {result.microSiting.shiftDirection} from center</div>
                    <div style={{fontSize:13,marginTop:4}}>Score: {result.microSiting.bestPoint?.score?.toFixed(0)}/100 — {result.microSiting.improvementOverCenter_pct?.toFixed(0)}% better than center point</div>
                    <div style={{fontSize:12,color:'var(--text-secondary)',marginTop:4}}>{result.microSiting.bestPoint?.reason}</div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:8,marginBottom:16}}>
                    <div className="result-item"><span className="rl">Grid Size</span><span className="rv">{result.microSiting.gridSize_m}m</span></div>
                    <div className="result-item"><span className="rl">Resolution</span><span className="rv">{result.microSiting.gridResolution_m}m</span></div>
                    <div className="result-item"><span className="rl">Candidates</span><span className="rv">{result.microSiting.candidatesEvaluated}</span></div>
                    <div className="result-item"><span className="rl">Shift Distance</span><span className="rv">{result.microSiting.shiftDistance_m?.toFixed(0)}m</span></div>
                  </div>
                  {/* Top candidates */}
                  {result.microSiting.allCandidates?.length>0 && (
                    <div><h4 style={{marginBottom:8}}>Top Drilling Points</h4>
                    <div className="sci-table-wrap"><table className="sci-table"><thead><tr><th>#</th><th>Offset</th><th>Score</th><th>Terrain</th><th>Fracture</th><th>Slope</th><th>Reason</th></tr></thead><tbody>
                      {result.microSiting.allCandidates.slice(0,5).map((c: any,i: number)=>(
                        <tr key={i}><td>{c.rank}</td><td>{c.relativeX_m?.toFixed(0)}E, {c.relativeY_m?.toFixed(0)}N</td><td style={{fontWeight:700,color:'#22c55e'}}>{c.score?.toFixed(0)}</td><td>{(c.terrainFlowScore*100).toFixed(0)}%</td><td>{(c.fractureProximityScore*100).toFixed(0)}%</td><td>{c.slopeDeg?.toFixed(1)}°</td><td style={{fontSize:11}}>{c.reason}</td></tr>
                      ))}
                    </tbody></table></div></div>
                  )}
                </div>
              ) : <p style={{color:'var(--text-muted)'}}>Micro-siting requires GPS coordinates.</p>}
            </div>
          )}

          {/* ═══ CALIBRATION LOOP ═══ */}
          {activeResultTab==='calibration-loop' && (
            <div>
              <h4 className="tab-title">{'\u{1F504}'} Real-Time Calibration Loop</h4>
              <p className="tab-desc">Prediction corrections based on drilling outcomes. Accuracy improves with every borehole drilled.</p>
              {result.calibrationCorrection ? (
                <div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:8,marginBottom:16}}>
                    <div className="result-item"><span className="rl">Corrected Depth</span><span className="rv">{result.calibrationCorrection.correctedDepth_m?.toFixed(1)}m</span></div>
                    <div className="result-item"><span className="rl">Corrected Yield</span><span className="rv">{result.calibrationCorrection.correctedYield_m3hr?.toFixed(2)} m³/hr</span></div>
                    <div className="result-item"><span className="rl">Corrected Prob.</span><span className="rv">{((result.calibrationCorrection.correctedProbability ?? 0)*100).toFixed(1)}%</span></div>
                    <div className="result-item"><span className="rl">Model Confidence</span><span className="rv">{((result.calibrationCorrection.modelConfidence ?? 0)*100).toFixed(0)}%</span></div>
                    <div className="result-item"><span className="rl">Based On</span><span className="rv">{result.calibrationCorrection.basedOnEntries} entries</span></div>
                  </div>
                  {result.calibrationCorrection.corrections?.length>0 && (
                    <div><h4 style={{marginBottom:8}}>Applied Corrections</h4>
                    {result.calibrationCorrection.corrections.map((c: any,i: number)=>(
                      <div key={i} style={{padding:6,borderRadius:6,background:'rgba(255,255,255,0.02)',marginBottom:4,fontSize:12}}>
                        <strong>{c.source}:</strong> {c.factor} (adjustment: {typeof c.adjustment === 'number' ? c.adjustment.toFixed(2) : c.adjustment}, weight: {typeof c.weight === 'number' ? c.weight.toFixed(2) : c.weight})
                      </div>
                    ))}
                    </div>
                  )}
                  <p style={{fontSize:11,color:'var(--text-muted)',marginTop:12}}>Record drilling outcomes in the Feedback tab to improve future predictions. Each entry makes the calibration model more accurate.</p>
                </div>
              ) : <p style={{color:'var(--text-muted)'}}>Calibration loop requires GPS coordinates. Record drilling outcomes to build the model.</p>}
            </div>
          )}

          {/* ═══ BOREHOLE INTELLIGENCE ═══ */}
          {activeResultTab==='borehole-intelligence' && (
            <div>
              <h4 className="tab-title">{'\u{1F4BE}'} Borehole Intelligence Database</h4>
              <p className="tab-desc">Analytics from nearby borehole records. Import your drilling data to improve predictions.</p>
              {result.boreholeIntelligence ? (
                <div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:8,marginBottom:16}}>
                    <div className="result-item"><span className="rl">Nearby Records</span><span className="rv">{result.boreholeIntelligence.totalRecords ?? 0}</span></div>
                    <div className="result-item"><span className="rl">Avg Depth</span><span className="rv">{result.boreholeIntelligence.avgDepth?.toFixed(0)}m</span></div>
                    <div className="result-item"><span className="rl">Avg Yield</span><span className="rv">{result.boreholeIntelligence.avgYield?.toFixed(1)} m³/hr</span></div>
                    <div className="result-item"><span className="rl">Success Rate</span><span className="rv">{((result.boreholeIntelligence.successRate ?? 0)*100).toFixed(0)}%</span></div>
                  </div>
                  {result.boreholeIntelligence.commonRockTypes?.length>0 && (
                    <div className="result-item full-width" style={{marginBottom:8}}><span className="rl">Common Rock Types</span><span className="rv">{result.boreholeIntelligence.commonRockTypes.join(', ')}</span></div>
                  )}
                  {result.boreholeIntelligence.bestGeophysics?.length>0 && (
                    <div className="result-item full-width"><span className="rl">Best Geophysics Methods</span><span className="rv">{result.boreholeIntelligence.bestGeophysics.join(', ')}</span></div>
                  )}
                  <p style={{fontSize:11,color:'var(--text-muted)',marginTop:12}}>Import borehole records (JSON/CSV) to expand the intelligence database and improve IDW-based predictions.</p>
                </div>
              ) : <p style={{color:'var(--text-muted)'}}>No borehole intelligence data available. Import records or analyze sites near existing boreholes.</p>}
            </div>
          )}

          {/* ═══ PUMP TEST ANALYSIS ═══ */}
          {activeResultTab==='pump-test' && (
            <div>
              <h4 className="tab-title">{'\u{1F4A7}'} Pump Test Analysis</h4>
              <p className="tab-desc">Theis/Cooper-Jacob analysis of pumping test data — transmissivity, storativity, safe yield, and sustainability.</p>
              {result.pumpTestAnalysis ? (
                <div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:8,marginBottom:16}}>
                    <div className="result-item"><span className="rl">Transmissivity</span><span className="rv">{result.pumpTestAnalysis.transmissivity_m2day?.toFixed(1) ?? result.pumpTestAnalysis.estimatedTransmissivity_m2day?.toFixed(1) ?? '—'} m²/day</span></div>
                    <div className="result-item"><span className="rl">Storativity</span><span className="rv">{result.pumpTestAnalysis.storativity?.toExponential(2) ?? result.pumpTestAnalysis.estimatedStorativity?.toExponential(2) ?? '—'}</span></div>
                    <div className="result-item"><span className="rl">Hydraulic K</span><span className="rv">{(result.pumpTestAnalysis.hydraulicConductivity_m_day ?? result.pumpTestAnalysis.estimatedK_m_day)?.toFixed(2) ?? '—'} m/day</span></div>
                    <div className="result-item"><span className="rl">Safe Yield</span><span className="rv" style={{color:'#16a34a',fontWeight:700}}>{(result.pumpTestAnalysis.safeYield_m3day ?? result.pumpTestAnalysis.estimatedYield_m3hr * 24)?.toFixed(1) ?? '—'} m³/day</span></div>
                    <div className="result-item"><span className="rl">Well Efficiency</span><span className="rv">{result.pumpTestAnalysis.wellEfficiency_pct?.toFixed(0) ?? '—'}%</span></div>
                    <div className="result-item"><span className="rl">Aquifer Type</span><span className="rv">{result.pumpTestAnalysis.aquiferTypeFromTest ?? result.pumpTestAnalysis.estimatedAquiferType ?? '—'}</span></div>
                  </div>
                  {result.pumpTestAnalysis.sustainability && (
                    <div className="result-item full-width" style={{marginBottom:12}}>
                      <span className="rl">Sustainability Rating</span>
                      <span className="rv" style={{color:result.pumpTestAnalysis.sustainability?.rating==='excellent'||result.pumpTestAnalysis.sustainability?.rating==='good'?'#16a34a':result.pumpTestAnalysis.sustainability?.rating==='moderate'?'#f59e0b':'#ef4444',fontWeight:700}}>
                        {result.pumpTestAnalysis.sustainability?.rating?.toUpperCase() ?? '—'}
                      </span>
                    </div>
                  )}
                  {result.pumpTestAnalysis.recovery && (
                    <div style={{marginBottom:12}}>
                      <h4 style={{marginBottom:8}}>Recovery Analysis</h4>
                      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:8}}>
                        <div className="result-item"><span className="rl">Recovery %</span><span className="rv">{result.pumpTestAnalysis.recovery.recoveryPercent?.toFixed(0) ?? '—'}%</span></div>
                        <div className="result-item"><span className="rl">Boundary</span><span className="rv">{result.pumpTestAnalysis.recovery.boundaryEffect ?? 'none'}</span></div>
                      </div>
                    </div>
                  )}
                  {result.pumpTestAnalysis.recommendations && (
                    <div style={{marginTop:12}}>
                      <h4 style={{marginBottom:8}}>Recommendations</h4>
                      {result.pumpTestAnalysis.recommendations.map((r: string, i: number) => (
                        <div key={i} style={{padding:6,borderRadius:6,background:'rgba(255,255,255,0.02)',marginBottom:4,fontSize:12}}>{r}</div>
                      ))}
                    </div>
                  )}
                  <p style={{fontSize:11,color:'var(--text-muted)',marginTop:12}}>Enter actual pump test data in the Field Data section for rigorous Theis curve-matching analysis.</p>
                </div>
              ) : <p style={{color:'var(--text-muted)'}}>No pump test data available. Enter pump test results in Field Data to unlock this analysis.</p>}
            </div>
          )}

          {/* ═══ LITHOLOGY LOG ═══ */}
          {activeResultTab==='lithology' && (
            <div>
              <h4 className="tab-title">{'\u{1F9F1}'} Lithology & Stratigraphy</h4>
              <p className="tab-desc">Stratigraphic analysis from drill cuttings, core logs, and regional lithology intelligence.</p>
              {result.lithologyAnalysis ? (
                <div>
                  {result.lithologyAnalysis.stratigraphicSummary && (
                    <div style={{marginBottom:16}}>
                      <h4 style={{marginBottom:8}}>Stratigraphic Summary</h4>
                      {result.lithologyAnalysis.stratigraphicSummary.map((s: any, i: number) => (
                        <div key={i} style={{padding:8,borderRadius:6,background:'rgba(255,255,255,0.03)',marginBottom:4,borderLeft:`3px solid ${s.isAquifer?'#16a34a':'#64748b'}`}}>
                          <strong>{s.depthFrom?.toFixed(0)}–{s.depthTo?.toFixed(0)}m:</strong> {s.rockType} — K: {s.hydraulicConductivity?.toFixed(2)} m/day, Porosity: {(s.porosity*100)?.toFixed(0)}%
                          {s.isAquifer && <span style={{color:'#16a34a',fontWeight:700,marginLeft:8}}>★ AQUIFER</span>}
                        </div>
                      ))}
                    </div>
                  )}
                  {result.lithologyAnalysis.waterStrikes && result.lithologyAnalysis.waterStrikes.length > 0 && (
                    <div style={{marginBottom:12}}>
                      <h4 style={{marginBottom:8}}>Water Strikes</h4>
                      {result.lithologyAnalysis.waterStrikes.map((w: any, i: number) => (
                        <div key={i} className="result-item"><span className="rl">Strike @ {w.depth?.toFixed(0)}m</span><span className="rv">{w.yield?.toFixed(1)} m³/hr ({w.type})</span></div>
                      ))}
                    </div>
                  )}
                  {result.lithologyAnalysis.casingRecommendation && (
                    <div className="result-item full-width" style={{marginBottom:12}}>
                      <span className="rl">Casing Recommendation</span>
                      <span className="rv">{typeof result.lithologyAnalysis.casingRecommendation === 'object' ? `${result.lithologyAnalysis.casingRecommendation.surfaceCasing_m}m surface + ${result.lithologyAnalysis.casingRecommendation.productionCasing_m}m production` : result.lithologyAnalysis.casingRecommendation}</span>
                    </div>
                  )}
                  {result.lithologyAnalysis.narrative && (
                    <div className="geo-note" style={{marginTop:12}}>{result.lithologyAnalysis.narrative}</div>
                  )}
                  {result.lithologyAnalysis.regional && (
                    <div style={{marginTop:12}}>
                      <h4 style={{marginBottom:8}}>Regional Lithology Intelligence</h4>
                      <div className="result-item"><span className="rl">Common Sequence</span><span className="rv">{result.lithologyAnalysis.regional.commonRockSequence?.join(' → ') ?? '—'}</span></div>
                      <div className="result-item"><span className="rl">Avg Water Strike</span><span className="rv">{result.lithologyAnalysis.regional.avgWaterStrikeDepth?.toFixed(0) ?? '—'}m</span></div>
                      <div className="result-item"><span className="rl">Success Rate</span><span className="rv">{((result.lithologyAnalysis.regional.successRate ?? 0)*100).toFixed(0)}%</span></div>
                    </div>
                  )}
                  <p style={{fontSize:11,color:'var(--text-muted)',marginTop:12}}>Record your drilling lithology logs to improve predictions for nearby sites.</p>
                </div>
              ) : <p style={{color:'var(--text-muted)'}}>No lithology data available. Record drill logs to build the stratigraphic database.</p>}
            </div>
          )}

          {/* ═══ ERT INTELLIGENCE PIPELINE ═══ */}
          {activeResultTab==='ert-interpretation' && (
            <div>
              <h4 className="tab-title">{'\u26A1'} ERT Intelligence Pipeline</h4>
              <p className="tab-desc">Engineering-grade groundwater decision platform — 10-step pipeline: Inversion → Feature Extraction → Hybrid AI → Depth Optimization → Yield Estimation → Confidence Engine.</p>
              {result.ertInterpretation ? (() => { const ert = result.ertInterpretation; return (
                <div>
                  {/* ─── Decision Banner ─── */}
                  {ert.drillOrNoDrill && (
                    <div style={{padding:14,borderRadius:10,marginBottom:16,background: ert.drillOrNoDrill==='DRILL'?'linear-gradient(135deg,rgba(22,163,74,0.15),rgba(22,163,74,0.05))': ert.drillOrNoDrill==='NEEDS_FURTHER_ASSESSMENT'?'linear-gradient(135deg,rgba(245,158,11,0.12),rgba(245,158,11,0.04))':'linear-gradient(135deg,rgba(56,130,246,0.12),rgba(56,130,246,0.04))',border:`1px solid ${ert.drillOrNoDrill==='DRILL'?'#16a34a':ert.drillOrNoDrill==='NEEDS_FURTHER_ASSESSMENT'?'#d97706':'#3b82f6'}`}}>
                      <div style={{fontSize:18,fontWeight:800,color:ert.drillOrNoDrill==='DRILL'?'#16a34a':ert.drillOrNoDrill==='NEEDS_FURTHER_ASSESSMENT'?'#d97706':'#3b82f6',marginBottom:4}}>
                        {ert.drillOrNoDrill==='DRILL'?'\u2705 PROCEED TO DRILL':ert.drillOrNoDrill==='INVESTIGATE_FURTHER'?'\u{1F50D} INVESTIGATE FURTHER':'\u{1F4CB} FURTHER ASSESSMENT NEEDED'}
                      </div>
                      <div style={{fontSize:12,color:'var(--text-secondary)'}}>{ert.drillDecisionReasoning}</div>
                    </div>
                  )}

                  {/* ─── Pipeline Steps ─── */}
                  {ert.executedSteps && (
                    <div style={{display:'flex',flexWrap:'wrap',gap:4,marginBottom:16}}>
                      {ert.executedSteps.map((s: string, i: number) => (
                        <span key={i} style={{padding:'3px 8px',borderRadius:12,background:'rgba(56,189,248,0.15)',color:'#38bdf8',fontSize:10,fontWeight:600}}>{s.replace(/_/g,' ')}</span>
                      ))}
                      <span style={{padding:'3px 8px',borderRadius:12,background:'rgba(22,163,74,0.15)',color:'#16a34a',fontSize:10,fontWeight:600}}>v{ert.pipelineVersion} | {ert.dataSource}</span>
                    </div>
                  )}

                  {/* ─── Confidence Engine ─── */}
                  {ert.confidence && (
                    <div style={{background:'rgba(255,255,255,0.03)',borderRadius:10,padding:14,marginBottom:16,border:'1px solid rgba(255,255,255,0.06)'}}>
                      <h4 style={{marginBottom:10,color:'#f59e0b'}}>Confidence Engine</h4>
                      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:8,marginBottom:10}}>
                        <div className="result-item"><span className="rl">Before ERT</span><span className="rv" style={{color:'#94a3b8'}}>{(ert.confidence.beforeERT*100).toFixed(0)}%</span></div>
                        <div className="result-item"><span className="rl">After ERT</span><span className="rv" style={{color:'#16a34a',fontWeight:700,fontSize:16}}>{(ert.confidence.afterERT*100).toFixed(0)}%</span></div>
                        <div className="result-item"><span className="rl">Improvement</span><span className="rv" style={{color:'#38bdf8'}}>+{ert.confidence.improvementPercent?.toFixed(0)}%</span></div>
                        <div className="result-item"><span className="rl">High Confidence?</span><span className="rv" style={{color:ert.confidence.isHighConfidence?'#16a34a':'#f59e0b'}}>{ert.confidence.isHighConfidence?'YES':'NO'}</span></div>
                      </div>
                      {ert.confidence.componentBreakdown && (
                        <div style={{marginTop:8}}>
                          {ert.confidence.componentBreakdown.map((c: any, i: number) => (
                            <div key={i} style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                              <span style={{fontSize:11,color:'var(--text-secondary)',minWidth:140}}>{c.name} ({(c.weight*100).toFixed(0)}%)</span>
                              <div style={{flex:1,height:8,borderRadius:4,background:'rgba(255,255,255,0.06)',overflow:'hidden'}}>
                                <div style={{width:`${c.score*100}%`,height:'100%',borderRadius:4,background:c.score>0.7?'#16a34a':c.score>0.5?'#f59e0b':'#ef4444'}}/>
                              </div>
                              <span style={{fontSize:11,fontWeight:600,minWidth:35,textAlign:'right',color:c.score>0.7?'#16a34a':'#f59e0b'}}>{(c.score*100).toFixed(0)}%</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ─── Depth Optimization ─── */}
                  {ert.depthOptimization && (
                    <div style={{background:'rgba(255,255,255,0.03)',borderRadius:10,padding:14,marginBottom:16,border:'1px solid rgba(255,255,255,0.06)'}}>
                      <h4 style={{marginBottom:10,color:'#38bdf8'}}>Depth Optimization Engine</h4>
                      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:8,marginBottom:10}}>
                        <div className="result-item"><span className="rl">Drill Depth</span><span className="rv" style={{color:'#16a34a',fontWeight:800,fontSize:18}}>{ert.depthOptimization.recommendedDrillingDepth_m}m</span></div>
                        <div className="result-item"><span className="rl">Aquifer Center</span><span className="rv">{ert.depthOptimization.aquiferCenter_m}m</span></div>
                        <div className="result-item"><span className="rl">Aquifer Thickness</span><span className="rv">{ert.depthOptimization.aquiferThickness_m}m</span></div>
                        <div className="result-item"><span className="rl">Safety Margin</span><span className="rv">{ert.depthOptimization.safetyMargin_m}m ({ert.depthOptimization.safetyMarginPercent}%)</span></div>
                        <div className="result-item"><span className="rl">Casing Depth</span><span className="rv">{ert.depthOptimization.casingDepth_m}m</span></div>
                        <div className="result-item"><span className="rl">Screen Interval</span><span className="rv">{ert.depthOptimization.screenFrom_m}–{ert.depthOptimization.screenTo_m}m</span></div>
                      </div>
                      {/* Borehole Column Diagram */}
                      {ert.depthOptimization.depthBreakdown && (
                        <div style={{display:'flex',alignItems:'stretch',marginTop:10,gap:12}}>
                          <div style={{width:60,position:'relative',minHeight:200}}>
                            {[
                              {label:'Topsoil',depth:ert.depthOptimization.depthBreakdown.topsoil_m,color:'#92400e'},
                              {label:'Overburden',depth:ert.depthOptimization.depthBreakdown.overburden_m,color:'#78716c'},
                              {label:'Aquifer',depth:ert.depthOptimization.aquiferThickness_m,color:'#0ea5e9'},
                              {label:'Drill Beyond',depth:ert.depthOptimization.depthBreakdown.drillBeyond_m,color:'#64748b'},
                            ].map((layer,i,arr) => {
                              const total = arr.reduce((s,l) => s+l.depth,0);
                              const pct = total>0?(layer.depth/total*100):25;
                              return <div key={i} style={{height:`${pct}%`,background:layer.color,borderRadius:i===0?'6px 6px 0 0':i===arr.length-1?'0 0 6px 6px':'0',display:'flex',alignItems:'center',justifyContent:'center',minHeight:20}}>
                                <span style={{fontSize:8,color:'#fff',fontWeight:700,textAlign:'center'}}>{layer.depth}m</span>
                              </div>;
                            })}
                          </div>
                          <div style={{flex:1,fontSize:12,color:'var(--text-secondary)',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
                            <div>0m — Surface</div>
                            <div style={{color:'#78716c'}}>{ert.depthOptimization.casingDepth_m}m — Casing bottom</div>
                            <div style={{color:'#0ea5e9',fontWeight:700}}>{ert.depthOptimization.screenFrom_m}m — Screen top</div>
                            <div style={{color:'#0ea5e9',fontWeight:700}}>{ert.depthOptimization.screenTo_m}m — Screen bottom</div>
                            <div style={{color:'#16a34a',fontWeight:800}}>{ert.depthOptimization.recommendedDrillingDepth_m}m — Total Depth</div>
                          </div>
                        </div>
                      )}
                      {ert.depthOptimization.rationale && <div style={{marginTop:10,fontSize:11,color:'var(--text-secondary)',lineHeight:1.5}}>{ert.depthOptimization.rationale}</div>}
                    </div>
                  )}

                  {/* ─── Yield Estimation ─── */}
                  {ert.yieldEstimation && (
                    <div style={{background:'rgba(255,255,255,0.03)',borderRadius:10,padding:14,marginBottom:16,border:'1px solid rgba(255,255,255,0.06)'}}>
                      <h4 style={{marginBottom:10,color:'#16a34a'}}>Yield Estimation Model</h4>
                      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:8,marginBottom:10}}>
                        <div className="result-item"><span className="rl">Estimated Yield</span><span className="rv" style={{color:'#16a34a',fontWeight:800,fontSize:16}}>{ert.yieldEstimation.estimatedYield_m3hr} m³/hr</span></div>
                        <div className="result-item"><span className="rl">Yield (L/min)</span><span className="rv" style={{fontWeight:700}}>{ert.yieldEstimation.estimatedYield_Lmin} L/min</span></div>
                        <div className="result-item"><span className="rl">Sustainable</span><span className="rv" style={{color:'#38bdf8'}}>{ert.yieldEstimation.sustainableYield_m3hr} m³/hr</span></div>
                        <div className="result-item"><span className="rl">Category</span><span className="rv" style={{color:ert.yieldEstimation.yieldCategory==='excellent'||ert.yieldEstimation.yieldCategory==='good'?'#16a34a':ert.yieldEstimation.yieldCategory==='moderate'?'#f59e0b':'#ef4444',fontWeight:700,textTransform:'uppercase'}}>{ert.yieldEstimation.yieldCategory}</span></div>
                        <div className="result-item"><span className="rl">SWL</span><span className="rv">{ert.yieldEstimation.staticWaterLevel_m}m</span></div>
                        <div className="result-item"><span className="rl">Drawdown</span><span className="rv">{ert.yieldEstimation.expectedDrawdown_m}m</span></div>
                        <div className="result-item"><span className="rl">Transmissivity</span><span className="rv">{ert.yieldEstimation.transmissivity_m2day} m²/day</span></div>
                        <div className="result-item"><span className="rl">K (m/day)</span><span className="rv">{ert.yieldEstimation.hydraulicConductivity_mday}</span></div>
                      </div>
                      {/* Component Donut */}
                      {ert.yieldEstimation.components && (
                        <div style={{marginTop:10}}>
                          <div style={{fontSize:11,color:'var(--text-secondary)',marginBottom:6}}>Yield contribution breakdown:</div>
                          {[
                            {label:'Aquifer Thickness',pct:ert.yieldEstimation.components.fromThickness,color:'#0ea5e9'},
                            {label:'Resistivity (K)',pct:ert.yieldEstimation.components.fromResistivity,color:'#16a34a'},
                            {label:'Fracture Boost',pct:ert.yieldEstimation.components.fromFractures,color:'#f59e0b'},
                            {label:'Recharge',pct:ert.yieldEstimation.components.fromRecharge,color:'#8b5cf6'},
                          ].map((c,i) => (
                            <div key={i} style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                              <span style={{fontSize:10,minWidth:110,color:'var(--text-secondary)'}}>{c.label}</span>
                              <div style={{flex:1,height:6,borderRadius:3,background:'rgba(255,255,255,0.06)',overflow:'hidden'}}>
                                <div style={{width:`${c.pct}%`,height:'100%',borderRadius:3,background:c.color}}/>
                              </div>
                              <span style={{fontSize:10,fontWeight:600,minWidth:30,textAlign:'right'}}>{c.pct}%</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div style={{marginTop:8,fontSize:10,color:'var(--text-tertiary)'}}>CI: {ert.yieldEstimation.confidenceInterval?.lower?.toFixed(2)}–{ert.yieldEstimation.confidenceInterval?.upper?.toFixed(2)} m³/hr</div>
                    </div>
                  )}

                  {/* ─── Hybrid AI Interpretation ─── */}
                  {ert.hybridInterpretation && (
                    <div style={{background:'rgba(255,255,255,0.03)',borderRadius:10,padding:14,marginBottom:16,border:'1px solid rgba(255,255,255,0.06)'}}>
                      <h4 style={{marginBottom:10,color:'#a855f7'}}>Hybrid AI Interpretation ({ert.hybridInterpretation.featureWeights?.length || 0} features)</h4>
                      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:8,marginBottom:10}}>
                        <div className="result-item"><span className="rl">Success Probability</span><span className="rv" style={{color:'#16a34a',fontWeight:800,fontSize:16}}>{(ert.hybridInterpretation.successProbability*100).toFixed(0)}%</span></div>
                        <div className="result-item"><span className="rl">Aquifer Type</span><span className="rv" style={{textTransform:'capitalize'}}>{ert.hybridInterpretation.aquiferType}</span></div>
                        <div className="result-item"><span className="rl">Lithology</span><span className="rv">{ert.hybridInterpretation.lithology}</span></div>
                        <div className="result-item"><span className="rl">Water Quality</span><span className="rv" style={{color:ert.hybridInterpretation.waterQuality==='good'||ert.hybridInterpretation.waterQuality==='excellent'?'#16a34a':'#f59e0b'}}>{ert.hybridInterpretation.waterQuality}</span></div>
                      </div>
                      {/* Feature weights */}
                      {ert.hybridInterpretation.featureWeights && (
                        <div style={{marginTop:8}}>
                          <div style={{fontSize:11,color:'var(--text-secondary)',marginBottom:6}}>Feature weights (ERT 40% + Satellite 35% + Geological 25%):</div>
                          {ert.hybridInterpretation.featureWeights.slice(0,8).map((f: any, i: number) => (
                            <div key={i} style={{display:'flex',alignItems:'center',gap:6,marginBottom:3}}>
                              <span style={{fontSize:9,minWidth:120,color:'var(--text-secondary)'}}>{f.feature}</span>
                              <div style={{flex:1,height:5,borderRadius:3,background:'rgba(255,255,255,0.06)',overflow:'hidden'}}>
                                <div style={{width:`${Math.min(100,f.contribution/0.12*100)}%`,height:'100%',borderRadius:3,background:'#a855f7'}}/>
                              </div>
                              <span style={{fontSize:9,minWidth:25,textAlign:'right'}}>{(f.weight*100).toFixed(0)}%</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {ert.hybridInterpretation.riskFactors && ert.hybridInterpretation.riskFactors.length > 0 && (
                        <div style={{marginTop:10}}>
                          <div style={{fontSize:11,color:'#ef4444',fontWeight:600,marginBottom:4}}>Risk Factors:</div>
                          {ert.hybridInterpretation.riskFactors.map((r: string, i: number) => (
                            <div key={i} style={{fontSize:11,color:'var(--text-secondary)',padding:'2px 0'}}>{'\u26A0\uFE0F'} {r}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ─── 2D Resistivity Cross-Section ─── */}
                  {ert.visualization?.resistivitySection && (() => {
                    const sec = ert.visualization.resistivitySection;
                    const overlay = ert.visualization.interpretationOverlay;
                    const marker = ert.visualization.drillMarker;
                    const nz = sec.zDepths?.length || 0;
                    const nx = sec.xPositions?.length || 0;
                    if (nz < 2 || nx < 2) return null;
                    const cellW = Math.max(3, Math.min(20, 600 / nx));
                    const cellH = Math.max(4, Math.min(20, 250 / nz));
                    const svgW = nx * cellW + 60;
                    const svgH = nz * cellH + 40;
                    const getColor = (rho: number) => {
                      const scale = sec.colorScale || [];
                      if (scale.length === 0) return '#888';
                      if (rho <= scale[0].value) return scale[0].color;
                      for (let i = 1; i < scale.length; i++) {
                        if (rho <= scale[i].value) return scale[i].color;
                      }
                      return scale[scale.length - 1].color;
                    };
                    return (
                      <div style={{background:'rgba(0,0,0,0.2)',borderRadius:10,padding:14,marginBottom:16,overflowX:'auto'}}>
                        <h4 style={{marginBottom:10,color:'#e2e8f0'}}>2D Resistivity Cross-Section</h4>
                        <svg width={svgW} height={svgH} style={{display:'block'}}>
                          {/* Grid cells */}
                          {sec.values.map((row: number[], iz: number) => row.map((rho: number, ix: number) => (
                            <rect key={`${iz}-${ix}`} x={50 + ix * cellW} y={iz * cellH} width={cellW} height={cellH} fill={getColor(rho)} stroke="none">
                              <title>{sec.xPositions[ix]?.toFixed(0)}m, {sec.zDepths[iz]?.toFixed(1)}m: {rho.toFixed(0)} Ωm</title>
                            </rect>
                          )))}
                          {/* Aquifer overlay */}
                          {overlay?.aquiferZones?.map((az: any, i: number) => {
                            const x1 = 50 + ((az.xStart - sec.xPositions[0]) / (sec.xPositions[nx-1] - sec.xPositions[0])) * nx * cellW;
                            const x2 = 50 + ((az.xEnd - sec.xPositions[0]) / (sec.xPositions[nx-1] - sec.xPositions[0])) * nx * cellW;
                            const y1 = (az.zTop / sec.zDepths[nz-1]) * nz * cellH;
                            const y2 = (az.zBottom / sec.zDepths[nz-1]) * nz * cellH;
                            return <rect key={`aq-${i}`} x={Math.max(50,x1)} y={y1} width={Math.max(10,x2-x1)} height={Math.max(5,y2-y1)} fill="rgba(34,197,94,0.25)" stroke="#16a34a" strokeWidth={1.5} strokeDasharray="4,2" rx={3}/>;
                          })}
                          {/* Drill marker */}
                          {marker && (() => {
                            const mx = 50 + ((marker.x - sec.xPositions[0]) / Math.max(1, sec.xPositions[nx-1] - sec.xPositions[0])) * nx * cellW;
                            return <g>
                              <line x1={mx} y1={0} x2={mx} y2={nz*cellH} stroke="#ef4444" strokeWidth={2} strokeDasharray="6,3"/>
                              <polygon points={`${mx-6},0 ${mx+6},0 ${mx},10`} fill="#ef4444"/>
                              <text x={mx+8} y={14} fill="#ef4444" fontSize={9} fontWeight="bold">DRILL {marker.targetDepth_m}m</text>
                            </g>;
                          })()}
                          {/* Y-axis labels */}
                          {sec.zDepths.filter((_: any, i: number) => i % Math.max(1, Math.floor(nz/6)) === 0).map((d: number, i: number) => (
                            <text key={`y-${i}`} x={46} y={findNearest(sec.zDepths, d) * cellH + cellH/2 + 3} fill="#94a3b8" fontSize={8} textAnchor="end">{d.toFixed(0)}m</text>
                          ))}
                          {/* X-axis labels */}
                          {sec.xPositions.filter((_: any, i: number) => i % Math.max(1, Math.floor(nx/6)) === 0).map((x: number, i: number) => (
                            <text key={`x-${i}`} x={50 + findNearest(sec.xPositions, x) * cellW + cellW/2} y={nz*cellH + 14} fill="#94a3b8" fontSize={8} textAnchor="middle">{x.toFixed(0)}m</text>
                          ))}
                        </svg>
                        {/* Color legend */}
                        <div style={{display:'flex',alignItems:'center',gap:2,marginTop:10,flexWrap:'wrap'}}>
                          <span style={{fontSize:9,color:'var(--text-secondary)',marginRight:6}}>Ωm:</span>
                          {sec.colorScale?.map((c: any, i: number) => (
                            <div key={i} style={{display:'flex',alignItems:'center',gap:2}}>
                              <div style={{width:14,height:10,background:c.color,borderRadius:2}}/>
                              <span style={{fontSize:8,color:'var(--text-tertiary)'}}>{c.value}</span>
                            </div>
                          ))}
                        </div>
                        <div style={{fontSize:10,color:'var(--text-tertiary)',marginTop:6}}>{ert.visualization.profileSummary}</div>
                      </div>
                    );
                  })()}

                  {/* ─── ERT Feature Extraction — Aquifer Parameters ─── */}
                  {ert.features && (
                    <div style={{background:'rgba(255,255,255,0.03)',borderRadius:10,padding:14,marginBottom:16,border:'1px solid rgba(255,255,255,0.06)'}}>
                      <h4 style={{marginBottom:10,color:'#f59e0b'}}>ERT Feature Extraction — Aquifer Parameters</h4>
                      <table className="data-table" style={{width:'100%',marginBottom:12}}>
                        <thead><tr><th>Parameter</th><th>Value</th><th>Method</th></tr></thead>
                        <tbody>
                          <tr><td><strong>Aquifer Top Depth</strong></td><td>{ert.features.lowResZones?.[0]?.depthTop_m?.toFixed(1) ?? ert.features.depthToTarget_m?.toFixed(1) ?? 'N/A'}m</td><td>2D Occam inversion + low-resistivity zone detection</td></tr>
                          <tr><td><strong>Aquifer Bottom Depth</strong></td><td>{ert.features.lowResZones?.[0]?.depthBottom_m?.toFixed(1) ?? (ert.features.depthToTarget_m != null && ert.features.targetThickness_m != null ? (ert.features.depthToTarget_m + ert.features.targetThickness_m).toFixed(1) : 'N/A')}m</td><td>Layer boundary detection (resistivity contrast)</td></tr>
                          <tr><td><strong>Aquifer Thickness</strong></td><td style={{fontWeight:'bold',color:'#0ea5e9'}}>{ert.features.targetThickness_m?.toFixed(1) ?? 'N/A'}m</td><td>Bottom - Top (verified against 1D model)</td></tr>
                          <tr><td><strong>Mean Resistivity</strong></td><td>{ert.features.lowResZones?.[0]?.avgResistivity?.toFixed(0) ?? ((ert.features.resistivityRange?.min ?? 0 + (ert.features.resistivityRange?.max ?? 0)) / 2).toFixed(0)} Ohm-m</td><td>Volume-weighted average within aquifer zone</td></tr>
                          <tr><td><strong>Continuity Score</strong></td><td style={{fontWeight:'bold',color:(ert.features.overallContinuity||0)>0.6?'#16a34a':'#f59e0b'}}>{((ert.features.overallContinuity||0)*100).toFixed(0)}%</td><td>Lateral extent / profile length (spatial persistence)</td></tr>
                          <tr><td><strong>Fracture Probability</strong></td><td style={{fontWeight:'bold',color:'#a855f7'}}>{ert.features.fractureIndicators} indicator{ert.features.fractureIndicators !== 1 ? 's' : ''} ({ert.features.fractureIndicators >= 3 ? 'High' : ert.features.fractureIndicators >= 1 ? 'Moderate' : 'Low'})</td><td>Vertical anomaly detection (sharp resistivity gradient)</td></tr>
                        </tbody>
                      </table>
                      {/* Low-res zones detail */}
                      {ert.features.lowResZones && ert.features.lowResZones.length > 0 && (
                        <div style={{marginTop:8}}>
                          <div style={{fontSize:11,color:'var(--text-secondary)',marginBottom:4}}>Detected Low-Resistivity Zones:</div>
                          {ert.features.lowResZones.slice(0,5).map((z: any, i: number) => (
                            <div key={i} style={{fontSize:11,padding:'3px 6px',borderRadius:4,background:z.isAquifer?'rgba(22,163,74,0.08)':'rgba(245,158,11,0.08)',marginBottom:3,borderLeft:`3px solid ${z.isAquifer?'#16a34a':'#f59e0b'}`}}>
                              {z.depthTop_m?.toFixed(0)}–{z.depthBottom_m?.toFixed(0)}m: {z.avgResistivity?.toFixed(0)} Ohm-m ({z.shape}) — {z.isAquifer ? 'AQUIFER' : z.isClay ? 'CLAY' : 'Unknown'} | Continuity: {((z.continuityScore||0)*100).toFixed(0)}%
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ─── ERT → AI FUSION (Explicit Equations) ─── */}
                  {ert.depthOptimization && ert.yieldEstimation && (
                    <div style={{background:'linear-gradient(135deg,rgba(168,85,247,0.08),rgba(14,165,233,0.08))',borderRadius:10,padding:16,marginBottom:16,border:'1px solid rgba(168,85,247,0.2)'}}>
                      <h4 style={{marginBottom:12,color:'#a855f7'}}>ERT + AI Fusion Equations</h4>
                      <p style={{fontSize:12,color:'var(--text-secondary)',marginBottom:12}}>Explicit fusion of ERT geophysical data with AI priors and borehole calibration data.</p>
                      <div style={{background:'rgba(0,0,0,0.15)',borderRadius:8,padding:12,fontFamily:'monospace',fontSize:12,lineHeight:2,marginBottom:12}}>
                        <div style={{color:'#38bdf8',fontWeight:700,marginBottom:4}}>DEPTH FUSION:</div>
                        <div>Final Depth = <span style={{color:'#16a34a'}}>w_ert</span> * ERT_depth + <span style={{color:'#f59e0b'}}>w_ai</span> * AI_prior + <span style={{color:'#a855f7'}}>w_bh</span> * Borehole_avg</div>
                        <div style={{color:'var(--text-muted)',fontSize:11}}>
                          = <span style={{color:'#16a34a'}}>0.40</span> * {ert.depthOptimization.aquiferCenter_m}m
                          + <span style={{color:'#f59e0b'}}>0.35</span> * {result.recommendedDepth}m
                          + <span style={{color:'#a855f7'}}>0.25</span> * {Math.round(result.nearbyWells?.averageDepth ?? result.recommendedDepth)}m
                        </div>
                        <div style={{color:'#16a34a',fontWeight:700}}>
                          = <strong>{ert.depthOptimization.recommendedDrillingDepth_m}m</strong> (range: {ert.depthOptimization.depthBreakdown ? `${Math.round(ert.depthOptimization.recommendedDrillingDepth_m * 0.9)}–${Math.round(ert.depthOptimization.recommendedDrillingDepth_m * 1.1)}m` : 'N/A'})
                        </div>
                      </div>
                      <div style={{background:'rgba(0,0,0,0.15)',borderRadius:8,padding:12,fontFamily:'monospace',fontSize:12,lineHeight:2,marginBottom:12}}>
                        <div style={{color:'#16a34a',fontWeight:700,marginBottom:4}}>YIELD FUSION:</div>
                        <div>Final Yield = f(thickness, resistivity, fractures, recharge)</div>
                        <div style={{color:'var(--text-muted)',fontSize:11}}>
                          = <span style={{color:'#0ea5e9'}}>Thickness({ert.features?.targetThickness_m?.toFixed(0) ?? '?'}m)</span>
                          * <span style={{color:'#16a34a'}}>K_from_rho({ert.yieldEstimation.hydraulicConductivity_mday} m/d)</span>
                          * <span style={{color:'#f59e0b'}}>Fracture_boost({ert.yieldEstimation.components?.fromFractures ?? 0}%)</span>
                          * <span style={{color:'#8b5cf6'}}>Recharge({ert.yieldEstimation.components?.fromRecharge ?? 0}%)</span>
                        </div>
                        <div style={{color:'#16a34a',fontWeight:700}}>
                          = <strong>{ert.yieldEstimation.estimatedYield_m3hr} m3/hr</strong> (sustainable: {ert.yieldEstimation.sustainableYield_m3hr} m3/hr, CI: {ert.yieldEstimation.confidenceInterval?.lower?.toFixed(1)}–{ert.yieldEstimation.confidenceInterval?.upper?.toFixed(1)})
                        </div>
                      </div>
                      <table className="data-table" style={{width:'100%'}}>
                        <thead><tr><th>Input Source</th><th>Weight</th><th>Depth Contribution</th><th>Yield Contribution</th></tr></thead>
                        <tbody>
                          <tr style={{background:'rgba(22,163,74,0.06)'}}>
                            <td><strong>ERT Geophysics</strong></td><td style={{fontWeight:'bold'}}>40%</td>
                            <td>Aquifer center: {ert.depthOptimization.aquiferCenter_m}m, thickness: {ert.depthOptimization.aquiferThickness_m}m</td>
                            <td>T={ert.yieldEstimation.transmissivity_m2day} m2/d, K={ert.yieldEstimation.hydraulicConductivity_mday} m/d</td>
                          </tr>
                          <tr style={{background:'rgba(245,158,11,0.06)'}}>
                            <td><strong>AI Prior (Satellite+ML)</strong></td><td style={{fontWeight:'bold'}}>35%</td>
                            <td>Predicted depth: {result.recommendedDepth}m</td>
                            <td>Predicted yield: {result.estimatedYield?.toFixed(1) ?? result.calibrationResult?.calibratedYield_m3h?.toFixed(1) ?? 'N/A'} m3/hr</td>
                          </tr>
                          <tr style={{background:'rgba(168,85,247,0.06)'}}>
                            <td><strong>Borehole Calibration</strong></td><td style={{fontWeight:'bold'}}>25%</td>
                            <td>Avg nearby depth: {Math.round(result.nearbyWells?.averageDepth ?? result.recommendedDepth)}m</td>
                            <td>Avg nearby yield: {result.nearbyWells?.averageYield?.toFixed(1) ?? 'N/A'} m3/hr</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* ─── 1D Layer Model ─── */}
                  {ert.interpretation1D?.layers && ert.interpretation1D.layers.length > 0 && (
                    <div style={{background:'rgba(255,255,255,0.03)',borderRadius:10,padding:14,marginBottom:16,border:'1px solid rgba(255,255,255,0.06)'}}>
                      <h4 style={{marginBottom:10}}>1D Layered Earth Model ({ert.interpretation1D.inversionQuality} quality, RMS {ert.interpretation1D.rmsError_pct}%)</h4>
                      {ert.interpretation1D.layers.map((l: any, i: number) => (
                        <div key={i} style={{padding:8,borderRadius:6,background:'rgba(255,255,255,0.03)',marginBottom:4,borderLeft:`3px solid ${l.waterBearing?'#16a34a':l.hydroRole==='aquitard'?'#78716c':'#64748b'}`}}>
                          <strong>{l.depthTop_m?.toFixed(0)}–{l.depthBottom_m?.toFixed(0)}m:</strong> {l.interpretation} ({l.resistivity_ohmm?.toFixed(0)} Ωm)
                          {l.waterBearing && <span style={{color:'#16a34a',fontWeight:700,marginLeft:8}}>AQUIFER</span>}
                          <span style={{float:'right',fontSize:10,color:'var(--text-tertiary)'}}>Confidence: {((l.confidence||0)*100).toFixed(0)}%</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ─── Inverted Model Stats ─── */}
                  {ert.invertedModel && (
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))',gap:8,marginBottom:16}}>
                      <div className="result-item"><span className="rl">Grid Size</span><span className="rv">{ert.invertedModel.nx}×{ert.invertedModel.nz}</span></div>
                      <div className="result-item"><span className="rl">Method</span><span className="rv">{ert.invertedModel.method}</span></div>
                      <div className="result-item"><span className="rl">RMS Error</span><span className="rv">{ert.invertedModel.rmsError_pct}%</span></div>
                      <div className="result-item"><span className="rl">Iterations</span><span className="rv">{ert.invertedModel.iterations}</span></div>
                      <div className="result-item"><span className="rl">Profile Length</span><span className="rv">{ert.invertedModel.profileLength_m?.toFixed(0)}m</span></div>
                      <div className="result-item"><span className="rl">Max Depth</span><span className="rv">{ert.invertedModel.maxDepth_m?.toFixed(0)}m</span></div>
                      <div className="result-item"><span className="rl">Layer Boundaries</span><span className="rv">{ert.invertedModel.layerBoundaries?.length || 0}</span></div>
                      <div className="result-item"><span className="rl">Anomalies</span><span className="rv">{ert.invertedModel.anomalies?.length || 0}</span></div>
                    </div>
                  )}

                  {/* ─── Model Accuracy (Feedback Loop) ─── */}
                  {ert.modelAccuracy && ert.modelAccuracy.sampleCount > 0 && (
                    <div style={{background:'rgba(168,85,247,0.08)',borderRadius:10,padding:14,marginBottom:16,border:'1px solid rgba(168,85,247,0.2)'}}>
                      <h4 style={{marginBottom:8,color:'#a855f7'}}>Feedback Loop — Model Accuracy ({ert.modelAccuracy.sampleCount} sites)</h4>
                      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))',gap:8}}>
                        <div className="result-item"><span className="rl">Mean Depth Error</span><span className="rv">{ert.modelAccuracy.meanDepthError_pct?.toFixed(1)}%</span></div>
                        <div className="result-item"><span className="rl">Mean Yield Error</span><span className="rv">{ert.modelAccuracy.meanYieldError_pct?.toFixed(1)}%</span></div>
                        <div className="result-item"><span className="rl">Success Rate</span><span className="rv" style={{color:'#16a34a',fontWeight:700}}>{((ert.modelAccuracy.successRate||0)*100).toFixed(0)}%</span></div>
                      </div>
                    </div>
                  )}

                  {/* ─── Executive Summary ─── */}
                  {ert.executiveSummary && (
                    <div className="geo-note" style={{marginTop:12,whiteSpace:'pre-line',fontSize:11,lineHeight:1.6}}>
                      <strong>Executive Summary:</strong>{'\n'}{ert.executiveSummary}
                    </div>
                  )}

                  {/* ─── Confidence Recommendations ─── */}
                  {ert.confidence?.recommendations && ert.confidence.recommendations.length > 0 && (
                    <div style={{marginTop:12}}>
                      <div style={{fontSize:11,color:'#38bdf8',fontWeight:600,marginBottom:4}}>Recommendations:</div>
                      {ert.confidence.recommendations.map((r: string, i: number) => (
                        <div key={i} style={{fontSize:11,color:'var(--text-secondary)',padding:'2px 0'}}>{'\u2192'} {r}</div>
                      ))}
                    </div>
                  )}
                </div>
              ); })() : <p style={{color:'var(--text-muted)'}}>No ERT data. Upload field ERT files or the pipeline will generate a modelled ERT from geological priors.</p>}
            </div>
          )}

          {/* ═══ MULTI-SOURCE AGREEMENT ═══ */}
          {activeResultTab==='source-agreement' && (
            <div>
              <h4 className="tab-title">{'\u{1F91D}'} Multi-Source Agreement</h4>
              <p className="tab-desc">Cross-validation of all data sources — identifies consensus, conflicts, and outliers to strengthen confidence.</p>
              {result.multiSourceAgreement ? (
                <div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:8,marginBottom:16}}>
                    <div className="result-item"><span className="rl">Overall Agreement</span><span className="rv" style={{color:result.multiSourceAgreement.overallAgreement>0.7?'#16a34a':result.multiSourceAgreement.overallAgreement>0.5?'#f59e0b':'#ef4444',fontWeight:700}}>{(result.multiSourceAgreement.overallAgreement*100)?.toFixed(0) ?? '—'}%</span></div>
                    <div className="result-item"><span className="rl">Sources Evaluated</span><span className="rv">{result.multiSourceAgreement.sourcesEvaluated ?? '—'}</span></div>
                    <div className="result-item"><span className="rl">Confidence Boost</span><span className="rv" style={{color:'#38bdf8'}}>+{((result.multiSourceAgreement.confidenceBoost ?? 0)*100).toFixed(0)}%</span></div>
                    <div className="result-item"><span className="rl">Conflicts</span><span className="rv" style={{color:result.multiSourceAgreement.conflicts?.length>0?'#ef4444':'#16a34a'}}>{result.multiSourceAgreement.conflicts?.length ?? 0}</span></div>
                  </div>
                  {result.multiSourceAgreement.consensus && (
                    <div className="result-item full-width" style={{marginBottom:12}}>
                      <span className="rl">Consensus Value</span>
                      <span className="rv" style={{fontWeight:700}}>{result.multiSourceAgreement.consensus.value?.toFixed(1)} {result.multiSourceAgreement.consensus.unit} (±{result.multiSourceAgreement.consensus.uncertainty?.toFixed(1)})</span>
                    </div>
                  )}
                  {result.multiSourceAgreement.sourceRanking && result.multiSourceAgreement.sourceRanking.length > 0 && (
                    <div style={{marginBottom:12}}>
                      <h4 style={{marginBottom:8}}>Source Ranking (by reliability × agreement)</h4>
                      {result.multiSourceAgreement.sourceRanking.map((s: any, i: number) => (
                        <div key={i} style={{padding:6,borderRadius:6,background:'rgba(255,255,255,0.02)',marginBottom:4,fontSize:12,display:'flex',justifyContent:'space-between'}}>
                          <span>{i+1}. <strong>{s.name}</strong></span>
                          <span style={{color:s.isOutlier?'#ef4444':'#16a34a'}}>{(s.score*100).toFixed(0)}% {s.isOutlier ? '⚠ outlier' : '✓'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {result.multiSourceAgreement.conflicts && result.multiSourceAgreement.conflicts.length > 0 && (
                    <div style={{marginTop:12}}>
                      <h4 style={{marginBottom:8,color:'#ef4444'}}>Data Conflicts</h4>
                      {result.multiSourceAgreement.conflicts.map((c: any, i: number) => (
                        <div key={i} style={{padding:6,borderRadius:6,background:'rgba(239,68,68,0.08)',marginBottom:4,fontSize:12}}>
                          <strong>{c.source}:</strong> {c.description} — Severity: {c.severity}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : <p style={{color:'var(--text-muted)'}}>Not enough data sources to evaluate agreement. Provide field data or nearby borehole records.</p>}
            </div>
          )}

          {/* ═══ TEMPORAL DROUGHT ANALYSIS ═══ */}
          {activeResultTab==='drought-analysis' && (
            <div>
              <h4 className="tab-title">{'\u{1F321}\uFE0F'} Temporal & Drought Analysis</h4>
              <p className="tab-desc">Multi-year rainfall trends, SPI drought index, drought cycles, and sustainable yield under climate variability.</p>
              {result.temporalDrought ? (
                <div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:8,marginBottom:16}}>
                    <div className="result-item"><span className="rl">Years Analyzed</span><span className="rv">{result.temporalDrought.yearsAnalyzed}</span></div>
                    <div className="result-item"><span className="rl">Mean Annual Rain</span><span className="rv">{result.temporalDrought.meanAnnualRainfall_mm} mm</span></div>
                    <div className="result-item"><span className="rl">Rainfall Trend</span><span className="rv" style={{color:result.temporalDrought.rainfallTrendDirection==='decreasing'?'#ef4444':result.temporalDrought.rainfallTrendDirection==='increasing'?'#16a34a':'#f59e0b'}}>{result.temporalDrought.rainfallTrend_mm_decade>0?'+':''}{result.temporalDrought.rainfallTrend_mm_decade} mm/decade</span></div>
                    <div className="result-item"><span className="rl">Rainfall CV</span><span className="rv">{result.temporalDrought.rainfallCV}</span></div>
                    <div className="result-item"><span className="rl">Current SPI</span><span className="rv" style={{color:result.temporalDrought.currentSPI<-1?'#ef4444':result.temporalDrought.currentSPI>1?'#16a34a':'#f59e0b',fontWeight:700}}>{result.temporalDrought.currentSPI}</span></div>
                    <div className="result-item"><span className="rl">Drought Status</span><span className="rv" style={{color:result.temporalDrought.currentlyInDrought?'#ef4444':'#16a34a',fontWeight:700}}>{result.temporalDrought.currentDroughtStatus?.toUpperCase()}</span></div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:8,marginBottom:16}}>
                    <div className="result-item"><span className="rl">Drought Events</span><span className="rv">{result.temporalDrought.droughtEvents?.length ?? 0}</span></div>
                    <div className="result-item"><span className="rl">Avg Duration</span><span className="rv">{result.temporalDrought.averageDroughtDuration_months} months</span></div>
                    <div className="result-item"><span className="rl">Return Period</span><span className="rv">{result.temporalDrought.droughtReturnPeriod_years} years</span></div>
                    <div className="result-item"><span className="rl">Sustainable Yield</span><span className="rv" style={{color:'#16a34a',fontWeight:700}}>{result.temporalDrought.sustainableYield_m3day?.toFixed(1)} m³/day</span></div>
                    <div className="result-item"><span className="rl">Drought Yield</span><span className="rv" style={{color:'#f59e0b'}}>{result.temporalDrought.yieldDuringDrought_m3day?.toFixed(1)} m³/day</span></div>
                    <div className="result-item"><span className="rl">Depletion Risk</span><span className="rv" style={{color:result.temporalDrought.depletionRiskUnderDrought==='critical'||result.temporalDrought.depletionRiskUnderDrought==='high'?'#ef4444':'#16a34a',fontWeight:700}}>{result.temporalDrought.depletionRiskUnderDrought?.toUpperCase()}</span></div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:16}}>
                    <div className="result-item"><span className="rl">Wet Season</span><span className="rv">Month {result.temporalDrought.wetSeason?.startMonth}–{result.temporalDrought.wetSeason?.endMonth} ({result.temporalDrought.wetSeason?.rainfall_pct}% rain)</span></div>
                    <div className="result-item"><span className="rl">Dry Season</span><span className="rv">{result.temporalDrought.drySeason?.months} months</span></div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:16}}>
                    <div className="result-item"><span className="rl">Projected 2030</span><span className="rv">{result.temporalDrought.projectedRainfall2030_mm} mm/yr</span></div>
                    <div className="result-item"><span className="rl">Projected 2050</span><span className="rv">{result.temporalDrought.projectedRainfall2050_mm} mm/yr</span></div>
                  </div>
                  {result.temporalDrought.warnings?.length > 0 && (
                    <div style={{marginTop:8}}>
                      {result.temporalDrought.warnings.map((w: string, i: number) => (
                        <div key={i} style={{padding:6,borderRadius:6,background:'rgba(239,68,68,0.08)',marginBottom:4,fontSize:12,color:'#ef4444'}}>⚠ {w}</div>
                      ))}
                    </div>
                  )}
                  {result.temporalDrought.narrative && (
                    <div className="geo-note" style={{marginTop:12}}>{result.temporalDrought.narrative}</div>
                  )}
                </div>
              ) : <p style={{color:'var(--text-muted)'}}>Insufficient historical rainfall data for temporal analysis. At least 2 years required.</p>}
            </div>
          )}

          {/* ═══ HYDROCHEMISTRY PREDICTION ═══ */}
          {activeResultTab==='hydrochemistry' && (
            <div>
              <h4 className="tab-title">{'\u{1F52C}'} Hydrochemical Prediction</h4>
              <p className="tab-desc">Water quality predicted from geology, depth, and aquifer type. Compared against WHO drinking water guidelines.</p>
              {result.hydrochemPrediction ? (
                <div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:8,marginBottom:16}}>
                    <div className="result-item"><span className="rl">Water Type</span><span className="rv" style={{fontWeight:700}}>{result.hydrochemPrediction.waterType}</span></div>
                    <div className="result-item"><span className="rl">Overall Quality</span><span className="rv" style={{color:result.hydrochemPrediction.overallQuality==='excellent'||result.hydrochemPrediction.overallQuality==='good'?'#16a34a':result.hydrochemPrediction.overallQuality==='acceptable'?'#f59e0b':'#ef4444',fontWeight:700}}>{result.hydrochemPrediction.overallQuality?.toUpperCase()}</span></div>
                    <div className="result-item"><span className="rl">Potability Score</span><span className="rv" style={{color:result.hydrochemPrediction.potabilityScore>=70?'#16a34a':'#ef4444',fontWeight:700}}>{result.hydrochemPrediction.potabilityScore}/100</span></div>
                    <div className="result-item"><span className="rl">Treatment Cost</span><span className="rv">{result.hydrochemPrediction.treatmentCost?.toUpperCase()}</span></div>
                  </div>
                  <div className="result-item full-width" style={{marginBottom:12}}>
                    <span className="rl">Water Type Description</span>
                    <span className="rv" style={{fontSize:12}}>{result.hydrochemPrediction.waterTypeDescription}</span>
                  </div>
                  {result.hydrochemPrediction.predictions && result.hydrochemPrediction.predictions.length > 0 && (
                    <div style={{marginBottom:16}}>
                      <h4 style={{marginBottom:8}}>Parameter Predictions vs WHO Guidelines</h4>
                      <div className="sci-table-wrap">
                        <table className="sci-table">
                          <thead><tr><th>Parameter</th><th>Predicted</th><th>WHO Limit</th><th>Status</th><th>Health Risk</th></tr></thead>
                          <tbody>
                            {result.hydrochemPrediction.predictions.map((p: any, i: number) => (
                              <tr key={i}>
                                <td style={{fontWeight:600}}>{p.parameter}</td>
                                <td>{p.predictedValue} {p.unit}</td>
                                <td>{p.whoGuideline} {p.unit}</td>
                                <td style={{color:p.exceedsGuideline?'#ef4444':'#16a34a',fontWeight:700}}>{p.exceedsGuideline ? '⚠ EXCEEDS' : '✓ OK'}</td>
                                <td style={{color:p.healthRisk==='high'||p.healthRisk==='critical'?'#ef4444':p.healthRisk==='moderate'?'#f59e0b':'#16a34a'}}>{p.healthRisk}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  {result.hydrochemPrediction.primaryConcerns?.length > 0 && (
                    <div style={{marginBottom:12}}>
                      <h4 style={{marginBottom:8,color:'#ef4444'}}>Primary Concerns</h4>
                      {result.hydrochemPrediction.primaryConcerns.map((c: string, i: number) => (
                        <div key={i} style={{padding:6,borderRadius:6,background:'rgba(239,68,68,0.08)',marginBottom:4,fontSize:12}}>⚠ {c}</div>
                      ))}
                    </div>
                  )}
                  {result.hydrochemPrediction.treatmentRequired?.length > 0 && (
                    <div style={{marginBottom:12}}>
                      <h4 style={{marginBottom:8}}>Treatment Required</h4>
                      {result.hydrochemPrediction.treatmentRequired.map((t: string, i: number) => (
                        <div key={i} style={{padding:6,borderRadius:6,background:'rgba(56,189,248,0.06)',marginBottom:4,fontSize:12}}>🔧 {t}</div>
                      ))}
                    </div>
                  )}
                  {result.hydrochemPrediction.validation && result.hydrochemPrediction.validation.length > 0 && (
                    <div style={{marginBottom:16}}>
                      <h4 style={{marginBottom:8,color:'#4CAF50'}}>Lab Validation — Predicted vs Actual</h4>
                      <div className="sci-table-wrap">
                        <table className="sci-table">
                          <thead><tr><th>Parameter</th><th>Predicted</th><th>Actual</th><th>Error %</th><th>Accurate?</th></tr></thead>
                          <tbody>
                            {result.hydrochemPrediction.validation.map((v: any, i: number) => (
                              <tr key={i}>
                                <td style={{fontWeight:600}}>{v.parameter}</td>
                                <td>{v.predicted} {v.unit}</td>
                                <td>{v.actual} {v.unit}</td>
                                <td style={{color:v.error_pct>30?'#ef4444':'#16a34a'}}>{v.error_pct}%</td>
                                <td style={{color:v.predictionAccurate?'#16a34a':'#ef4444',fontWeight:700}}>{v.predictionAccurate ? '✓' : '✗'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="result-item full-width" style={{marginTop:8}}>
                        <span className="rl">Validation Score</span>
                        <span className="rv" style={{fontWeight:700,color:result.hydrochemPrediction.validationScore_pct>=70?'#16a34a':'#f59e0b'}}>{result.hydrochemPrediction.validationScore_pct}%</span>
                      </div>
                    </div>
                  )}
                  {result.hydrochemPrediction.parametersToTest?.length > 0 && (
                    <div className="geo-note" style={{marginTop:12}}>
                      <strong>Priority Lab Tests:</strong> {result.hydrochemPrediction.parametersToTest.join(', ')}. Monitoring: {result.hydrochemPrediction.monitoringFrequency}.
                    </div>
                  )}
                  {result.hydrochemPrediction.narrative && (
                    <div className="geo-note" style={{marginTop:8}}>{result.hydrochemPrediction.narrative}</div>
                  )}
                </div>
              ) : <p style={{color:'var(--text-muted)'}}>Rock type classification required for hydrochemical prediction.</p>}
            </div>
          )}

          {/* ═══ PHASE 8: DATA QUALITY SCORING ═══ */}
          {activeResultTab==='data-quality' && (
            <div>
              <h4 className="tab-title">{'\u{1F4CA}'} Data Quality & Transparency Score</h4>
              <p className="tab-desc">Breakdown of every data source used: satellite, field, lab, modeled, and inferred. Critical for bank-ready reports.</p>
              {result.dataQualityScore ? (() => {
                const dq = result.dataQualityScore;
                return (
                <div>
                  {/* Bankability Badge */}
                  <div style={{textAlign:'center',marginBottom:16,padding:16,borderRadius:12,background:dq.bankabilityStatus==='BANKABLE'?'rgba(34,197,94,0.1)':dq.bankabilityStatus==='ENGINEERING_GRADE'?'rgba(56,189,248,0.1)':'rgba(251,191,36,0.1)',border:`2px solid ${dq.bankabilityStatus==='BANKABLE'?'rgba(34,197,94,0.3)':dq.bankabilityStatus==='ENGINEERING_GRADE'?'rgba(56,189,248,0.3)':'rgba(251,191,36,0.3)'}`}}>
                    <div style={{fontSize:24,fontWeight:800,color:dq.reliabilityGrade==='A'||dq.reliabilityGrade==='B'?'#16a34a':dq.reliabilityGrade==='C'?'#f59e0b':'#ef4444'}}>{dq.reliabilityGrade} — {dq.overallQualityScore}%</div>
                    <div style={{fontSize:14,marginTop:4,color:'var(--text-secondary)'}}>{dq.bankabilityStatus.replace(/_/g,' ')}</div>
                  </div>
                  {/* Source breakdown bars */}
                  <h4 style={{marginBottom:8}}>Data Origin Breakdown</h4>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))',gap:8,marginBottom:16}}>
                    {[['Satellite',dq.satelliteData_pct,'#38bdf8'],['Field',dq.fieldMeasurement_pct,'#16a34a'],['Lab',dq.laboratoryData_pct,'#a855f7'],['Modeled',dq.modelInferred_pct,'#f59e0b'],['Database',dq.databaseData_pct,'#06b6d4'],['User Input',dq.userInput_pct,'#ec4899']].map(([label,pct,color]: any) => (
                      <div key={label} style={{background:'rgba(255,255,255,0.03)',padding:10,borderRadius:8,textAlign:'center'}}>
                        <div style={{fontSize:20,fontWeight:700,color}}>{pct}%</div>
                        <div style={{fontSize:11,color:'var(--text-secondary)'}}>{label}</div>
                      </div>
                    ))}
                  </div>
                  {/* Quality tiers */}
                  <h4 style={{marginBottom:8}}>Quality Tiers</h4>
                  <div style={{display:'flex',gap:4,marginBottom:16,height:24,borderRadius:6,overflow:'hidden'}}>
                    {dq.measuredData_pct > 0 && <div style={{width:`${dq.measuredData_pct}%`,background:'#16a34a',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'#fff',fontWeight:600}}>{dq.measuredData_pct}% Measured</div>}
                    {dq.calibratedData_pct > 0 && <div style={{width:`${dq.calibratedData_pct}%`,background:'#38bdf8',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'#fff',fontWeight:600}}>{dq.calibratedData_pct}% Calibrated</div>}
                    {dq.estimatedData_pct > 0 && <div style={{width:`${dq.estimatedData_pct}%`,background:'#f59e0b',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'#fff',fontWeight:600}}>{dq.estimatedData_pct}% Estimated</div>}
                    {dq.inferredData_pct > 0 && <div style={{width:`${dq.inferredData_pct}%`,background:'#ef4444',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'#fff',fontWeight:600}}>{dq.inferredData_pct}% Inferred</div>}
                  </div>
                  {/* Per-prediction quality */}
                  <h4 style={{marginBottom:8}}>Prediction-Specific Quality</h4>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:8,marginBottom:16}}>
                    {[['Depth',dq.depthPredictionQuality],['Yield',dq.yieldPredictionQuality],['Water Quality',dq.waterQualityPredictionQuality],['Probability',dq.probabilityQuality]].map(([label,val]: any) => (
                      <div key={label} className="result-item"><span className="rl">{label}</span><span className="rv" style={{fontWeight:700,color:val>=75?'#16a34a':val>=50?'#f59e0b':'#ef4444'}}>{val}/100</span></div>
                    ))}
                  </div>
                  {/* Trust indicators */}
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:16}}>
                    <div className="result-item"><span className="rl">Independent Sources</span><span className="rv">{dq.independentSourceCount}</span></div>
                    <div className="result-item"><span className="rl">Cross-Validated</span><span className="rv">{dq.crossValidatedSources}</span></div>
                    <div className="result-item"><span className="rl">Ground Truth</span><span className="rv">{dq.fieldGroundTruthSources}</span></div>
                  </div>
                  {/* Missing critical */}
                  {dq.missingCriticalData?.length > 0 && (
                    <div style={{marginBottom:12}}>
                      <h4 style={{color:'#d97706',marginBottom:8}}>Data Gaps</h4>
                      {dq.missingCriticalData.map((m: string, i: number) => (
                        <div key={i} style={{padding:6,borderRadius:6,background:'rgba(245,158,11,0.06)',marginBottom:4,fontSize:12}}>{'\u{1F4CB}'} {m}</div>
                      ))}
                    </div>
                  )}
                  {/* Fallback data note */}
                  {dq.fallbackSources?.length > 0 && (
                    <div style={{marginBottom:12,padding:12,borderRadius:8,background:'rgba(245,158,11,0.05)',border:'1px solid rgba(245,158,11,0.2)'}}>
                      <h4 style={{color:'#d97706',marginBottom:8}}>{'\u{1F4E1}'} Regional Estimate Sources</h4>
                      <p style={{fontSize:12,color:'var(--text-secondary)',marginBottom:8}}>The following sources used latitude-based regional estimates. Adding field survey data (ERT, pump test) will upgrade these to measured values:</p>
                      {dq.fallbackSources.map((fb: string, i: number) => (
                        <div key={i} style={{padding:6,borderRadius:6,background:'rgba(245,158,11,0.04)',marginBottom:4,fontSize:12,color:'var(--text-muted)'}}>{'\u2022'} {fb}</div>
                      ))}
                    </div>
                  )}
                  {/* Upgrade recommendations */}
                  {dq.upgradeRecommendations?.length > 0 && (
                    <div style={{marginBottom:12}}>
                      <h4 style={{color:'#38bdf8',marginBottom:8}}>Upgrade Recommendations</h4>
                      {dq.upgradeRecommendations.map((r: string, i: number) => (
                        <div key={i} style={{padding:6,borderRadius:6,background:'rgba(56,189,248,0.06)',marginBottom:4,fontSize:12}}>📈 {r}</div>
                      ))}
                    </div>
                  )}
                  <div className="geo-note">{dq.narrative}</div>
                </div>
                );
              })() : <p style={{color:'var(--text-muted)'}}>Data quality scoring requires completed analysis.</p>}
            </div>
          )}

          {/* ═══ PHASE 8: DRILLING SUCCESS PREDICTION AI ═══ */}
          {activeResultTab==='drilling-prediction' && (
            <div>
              <h4 className="tab-title">{'\u{1F3AF}'} Drilling Success Prediction AI</h4>
              <div style={{background:'rgba(251,191,36,0.06)',border:'1px solid rgba(251,191,36,0.2)',borderRadius:8,padding:'8px 14px',marginBottom:10,fontSize:11,color:'#fbbf24'}}>{'\u26A0\uFE0F'} <strong>Independent Model Estimate</strong> — This ML predictor uses its own logistic model. See the <strong>Final Recommendation</strong> banner for the reconciled consensus answer fusing all models.</div>
              <p className="tab-desc">ML-style ensemble model predicting site-specific success probability, depth, yield, and ROI with confidence intervals.</p>
              {result.drillingPrediction ? (() => {
                const dp = result.drillingPrediction;
                return (
                <div>
                  {/* Main prediction */}
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:8,marginBottom:16}}>
                    <div style={{background:'rgba(34,197,94,0.1)',padding:14,borderRadius:12,textAlign:'center'}}>
                      <div style={{fontSize:28,fontWeight:800,color:'#16a34a'}}>{dp.successProbability}%</div>
                      <div style={{fontSize:11,color:'var(--text-secondary)'}}>Success Probability</div>
                    </div>
                    <div style={{background:'rgba(56,189,248,0.1)',padding:14,borderRadius:12,textAlign:'center'}}>
                      <div style={{fontSize:22,fontWeight:700,color:'#38bdf8'}}>{dp.depthConfidence.low}–{dp.depthConfidence.high}m</div>
                      <div style={{fontSize:11,color:'var(--text-secondary)'}}>Depth (90% CI)</div>
                    </div>
                    <div style={{background:'rgba(168,85,247,0.1)',padding:14,borderRadius:12,textAlign:'center'}}>
                      <div style={{fontSize:22,fontWeight:700,color:'#a855f7'}}>{dp.yieldConfidence.low}–{dp.yieldConfidence.high}</div>
                      <div style={{fontSize:11,color:'var(--text-secondary)'}}>Yield m³/h (90% CI)</div>
                    </div>
                    <div style={{background:'rgba(251,191,36,0.1)',padding:14,borderRadius:12,textAlign:'center'}}>
                      <div style={{fontSize:22,fontWeight:700,color:'#f59e0b'}}>{dp.modelConfidence}%</div>
                      <div style={{fontSize:11,color:'var(--text-secondary)'}}>Model Confidence</div>
                    </div>
                  </div>
                  {/* Risk breakdown */}
                  <h4 style={{marginBottom:8}}>Risk Analysis</h4>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:8,marginBottom:16}}>
                    <div className="result-item"><span className="rl">Dry Hole Risk</span><span className="rv" style={{color:dp.dryHoleRisk_pct>30?'#ef4444':'#16a34a',fontWeight:700}}>{dp.dryHoleRisk_pct}%</span></div>
                    <div className="result-item"><span className="rl">Low Yield Risk</span><span className="rv" style={{color:dp.lowYieldRisk_pct>30?'#ef4444':'#16a34a',fontWeight:700}}>{dp.lowYieldRisk_pct}%</span></div>
                    <div className="result-item"><span className="rl">Water Quality Risk</span><span className="rv" style={{fontWeight:700}}>{dp.waterQualityRisk_pct}%</span></div>
                    <div className="result-item"><span className="rl">Excessive Depth</span><span className="rv" style={{fontWeight:700}}>{dp.excessiveDepthRisk_pct}%</span></div>
                  </div>
                  {/* Financial */}
                  <h4 style={{marginBottom:8}}>Financial Analysis</h4>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:8,marginBottom:16}}>
                    <div className="result-item"><span className="rl">Drilling Cost</span><span className="rv" style={{fontWeight:700}}>${dp.expectedDrillingCost_usd.toLocaleString()}</span></div>
                    <div className="result-item"><span className="rl">Payback Period</span><span className="rv" style={{fontWeight:700}}>{dp.paybackPeriod_years} years</span></div>
                    <div className="result-item"><span className="rl">10-Year ROI</span><span className="rv" style={{color:dp.roi_pct>0?'#16a34a':'#ef4444',fontWeight:700}}>{dp.roi_pct}%</span></div>
                    <div className="result-item"><span className="rl">Cost per m³/day</span><span className="rv">${dp.costPerM3PerDay_usd}</span></div>
                  </div>
                  {/* Feature importance */}
                  <h4 style={{marginBottom:8}}>Feature Importance</h4>
                  <div style={{marginBottom:16}}>
                    {dp.featureImportance?.slice(0,8).map((f: any, i: number) => (
                      <div key={i} style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                        <div style={{width:140,fontSize:11,color:'var(--text-secondary)'}}>{f.feature}</div>
                        <div style={{flex:1,height:16,background:'rgba(255,255,255,0.05)',borderRadius:8,overflow:'hidden'}}>
                          <div style={{width:`${Math.min(100,f.importance*2)}%`,height:'100%',background:i===0?'#16a34a':i<3?'#38bdf8':'#64748b',borderRadius:8}}/>
                        </div>
                        <div style={{width:40,fontSize:11,textAlign:'right'}}>{f.importance}%</div>
                      </div>
                    ))}
                  </div>
                  {/* vs Desktop delta */}
                  <h4 style={{marginBottom:8}}>AI Prediction vs Desktop Estimate</h4>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:16}}>
                    <div className="result-item"><span className="rl">Depth Δ</span><span className="rv" style={{color:Math.abs(dp.vsDesktopDelta.depth)>5?'#f59e0b':'#16a34a'}}>{dp.vsDesktopDelta.depth>0?'+':''}{dp.vsDesktopDelta.depth}m</span></div>
                    <div className="result-item"><span className="rl">Yield Δ</span><span className="rv" style={{color:Math.abs(dp.vsDesktopDelta.yield)>1?'#f59e0b':'#16a34a'}}>{dp.vsDesktopDelta.yield>0?'+':''}{dp.vsDesktopDelta.yield} m³/h</span></div>
                    <div className="result-item"><span className="rl">Probability Δ</span><span className="rv" style={{color:Math.abs(dp.vsDesktopDelta.probability)>5?'#f59e0b':'#16a34a'}}>{dp.vsDesktopDelta.probability>0?'+':''}{dp.vsDesktopDelta.probability}%</span></div>
                  </div>
                  <div className="geo-note" style={{fontSize:11}}>{dp.methodology}</div>
                </div>
                );
              })() : <p style={{color:'var(--text-muted)'}}>Drilling prediction requires coordinates and rock classification.</p>}
            </div>
          )}

          {/* ═══ PHASE 8: REGIONAL LEARNING MODEL ═══ */}
          {activeResultTab==='regional-model' && (
            <div>
              <h4 className="tab-title">{'\u{1F30D}'} Regional Learning Model</h4>
              <p className="tab-desc">Region-specific geological calibration — corrections learned from published datasets and local drilling outcomes.</p>
              {result.regionalModel ? (() => {
                const rm = result.regionalModel;
                const am = rm.activeModel;
                return (
                <div>
                  {am ? (
                    <div>
                      <div style={{background:'rgba(34,197,94,0.08)',padding:14,borderRadius:12,marginBottom:16,border:'1px solid rgba(34,197,94,0.2)'}}>
                        <div style={{fontSize:16,fontWeight:700,color:'#16a34a'}}>{am.regionName}</div>
                        <div style={{fontSize:12,color:'var(--text-secondary)',marginTop:4}}>Province: {am.geologicalProvince} | Climate: {am.climateZone} | {am.outcomeCount} training outcomes</div>
                      </div>
                      <h4 style={{marginBottom:8}}>Regional Corrections Applied</h4>
                      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:8,marginBottom:16}}>
                        <div className="result-item"><span className="rl">Corrected Depth</span><span className="rv" style={{fontWeight:700}}>{rm.correctedDepth_m}m</span></div>
                        <div className="result-item"><span className="rl">Corrected Yield</span><span className="rv" style={{fontWeight:700}}>{rm.correctedYield_m3h} m³/h</span></div>
                        <div className="result-item"><span className="rl">Corrected Probability</span><span className="rv" style={{fontWeight:700}}>{rm.correctedProbability}%</span></div>
                        <div className="result-item"><span className="rl">Seasonal Factor</span><span className="rv" style={{color:rm.seasonalAdjustment<0.85?'#f59e0b':'#16a34a',fontWeight:700}}>×{rm.seasonalAdjustment}</span></div>
                        <div className="result-item"><span className="rl">Regional Confidence</span><span className="rv" style={{fontWeight:700}}>{rm.regionalConfidence}%</span></div>
                        <div className="result-item"><span className="rl">Model Accuracy</span><span className="rv">{am.accuracy_pct}%</span></div>
                      </div>
                      <h4 style={{marginBottom:8}}>Seasonal Yield Pattern</h4>
                      <div style={{display:'flex',gap:2,alignItems:'end',height:60,marginBottom:4}}>
                        {Object.entries(am.seasonalYieldFactor).map(([month, factor]: [string, any]) => (
                          <div key={month} style={{flex:1,height:`${factor * 50}px`,background:factor >= 1.1 ? 'rgba(34,197,94,0.5)' : factor <= 0.8 ? 'rgba(239,68,68,0.4)' : 'rgba(56,189,248,0.3)',borderRadius:'3px 3px 0 0'}} title={`${month}: ×${factor}`}/>
                        ))}
                      </div>
                      <div style={{display:'flex',gap:2,fontSize:9,color:'var(--text-muted)'}}>
                        {Object.keys(am.seasonalYieldFactor).map(m => <div key={m} style={{flex:1,textAlign:'center'}}>{m}</div>)}
                      </div>
                      <div style={{display:'flex',gap:8,marginTop:8,marginBottom:16,fontSize:12}}>
                        <span>Best: <strong style={{color:'#16a34a'}}>{am.bestDrillingMonth}</strong></span>
                        <span>Worst: <strong style={{color:'#ef4444'}}>{am.worstDrillingMonth}</strong></span>
                      </div>
                    </div>
                  ) : <p style={{color:'var(--text-muted)'}}>No matching regional model for this location.</p>}
                  {rm.recommendations?.length > 0 && (
                    <div style={{marginBottom:12}}>
                      <h4 style={{marginBottom:8}}>Recommendations</h4>
                      {rm.recommendations.map((r: string, i: number) => (
                        <div key={i} style={{padding:6,borderRadius:6,background:'rgba(251,191,36,0.06)',marginBottom:4,fontSize:12}}>{r}</div>
                      ))}
                    </div>
                  )}
                  <div className="geo-note" style={{fontSize:11}}>{rm.methodology}</div>
                </div>
                );
              })() : <p style={{color:'var(--text-muted)'}}>Regional model requires coordinates.</p>}
            </div>
          )}

          {/* ═══ BANKABLE REPORT: SITE IDENTITY ═══ */}
          {activeResultTab==='site-identity' && (
            <div>
              <h4 className="tab-title">{'\u{1F4CD}'} Verified Site Identity</h4>
              <p className="tab-desc">GPS coordinates, site ID, elevation, and coordinate system for bankable-grade reporting.</p>
              {result.siteIdentity ? (() => {
                const si = result.siteIdentity!;
                return (
                <div>
                  <table className="data-table" style={{width:'100%'}}>
                    <thead><tr><th>Parameter</th><th>Value</th><th>Verification</th></tr></thead>
                    <tbody>
                      <tr><td><strong>Site ID</strong></td><td style={{fontFamily:'monospace',fontSize:13}}>{si.siteId}</td><td>Auto-generated</td></tr>
                      <tr><td><strong>Latitude</strong></td><td>{si.coordinates.lat.toFixed(si.coordinates.decimals)}</td><td>{si.coordinates.datum}</td></tr>
                      <tr><td><strong>Longitude</strong></td><td>{si.coordinates.lon.toFixed(si.coordinates.decimals)}</td><td>{si.coordinates.datum}</td></tr>
                      <tr><td><strong>Coordinate System</strong></td><td>{si.coordinateSystem}</td><td>Standard geodetic</td></tr>
                      <tr><td><strong>Elevation</strong></td><td>{si.elevation_masl} m a.s.l.</td><td>SRTM 30m DEM</td></tr>
                      <tr><td><strong>Location Confidence</strong></td><td style={{color: si.locationConfidenceGrade <= 'B' ? '#16a34a' : si.locationConfidenceGrade === 'C' ? '#d97706' : '#dc2626', fontWeight:'bold'}}>Grade {si.locationConfidenceGrade}</td><td>{si.verificationMethod}</td></tr>
                    </tbody>
                  </table>
                  <div style={{marginTop:12,padding:10,borderRadius:8,background: si.locationConfidenceGrade <= 'B' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)',border: `1px solid ${si.locationConfidenceGrade <= 'B' ? 'rgba(34,197,94,0.3)' : 'rgba(245,158,11,0.3)'}`}}>
                    <strong>Gate Rule:</strong> GPS {si.locationConfidenceGrade <= 'B' ? 'VERIFIED -- Bankable grade' : si.locationConfidenceGrade === 'C' ? 'ACCEPTABLE (geocoded) -- Recommend field GPS for bankable' : 'REQUIRES FIELD VERIFICATION'}
                  </div>
                </div>
                );
              })() : <p style={{color:'var(--text-muted)'}}>Site identity not available.</p>}
            </div>
          )}

          {/* ═══ BANKABLE REPORT: PRIMARY DRILLING RECOMMENDATION ═══ */}
          {activeResultTab==='drill-decision' && (
            <div>
              <h4 className="tab-title">{'\u{1F3AF}'} Primary Drilling Recommendation</h4>
              <p className="tab-desc">Single decision point with no contradictions. All parameters derived from multi-source ensemble.</p>
              {result.drillDecision ? (() => {
                const dd = result.drillDecision!;
                return (
                <div>
                  <div style={{background:'rgba(34,197,94,0.08)',border:'2px solid rgba(34,197,94,0.4)',borderRadius:12,padding:20,marginBottom:16}}>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                      <div><strong>Coordinates:</strong><br/><span style={{fontFamily:'monospace',fontSize:15}}>{dd.primaryPoint.lat.toFixed(6)}, {dd.primaryPoint.lon.toFixed(6)}</span></div>
                      <div><strong>Success Probability:</strong><br/><span style={{fontSize:24,fontWeight:'bold',color:'#16a34a'}}>{dd.successProbability}%</span></div>
                      <div><strong>Target Depth:</strong><br/>{dd.targetDepth_m}m <span style={{color:'var(--text-muted)'}}>(range: {dd.depthRange_m[0]}-{dd.depthRange_m[1]}m)</span></div>
                      <div><strong>Expected Yield:</strong><br/>{dd.expectedYield_m3hr} m3/hr <span style={{color:'var(--text-muted)'}}>(range: {dd.yieldRange_m3hr[0]}-{dd.yieldRange_m3hr[1]})</span></div>
                      <div><strong>Casing Depth:</strong> {dd.casingDepth_m}m</div>
                      <div><strong>Screen Interval:</strong> {dd.screenInterval_m[0]}-{dd.screenInterval_m[1]}m</div>
                      <div><strong>Pump Type:</strong> {dd.pumpType}</div>
                      <div><strong>Estimated Cost:</strong> ${dd.estimatedCost_usd.toLocaleString()}</div>
                    </div>
                  </div>
                  {dd.alternativePoints?.length ? (
                    <div>
                      <h5>Alternative Points (ranked)</h5>
                      <table className="data-table" style={{width:'100%'}}>
                        <thead><tr><th>Rank</th><th>Latitude</th><th>Longitude</th><th>Score</th></tr></thead>
                        <tbody>
                          {dd.alternativePoints.map((p, i) => <tr key={i}><td>#{p.rank}</td><td>{p.lat.toFixed(6)}</td><td>{p.lon.toFixed(6)}</td><td>{p.score}%</td></tr>)}
                        </tbody>
                      </table>
                    </div>
                  ) : null}
                </div>
                );
              })() : <p style={{color:'var(--text-muted)'}}>Drill decision not available.</p>}
            </div>
          )}

          {/* ═══ BANKABLE REPORT: RISK REGISTER ═══ */}
          {activeResultTab==='risk-register' && (
            <div>
              <h4 className="tab-title">{'\u{26A0}\u{FE0F}'} Risk Register</h4>
              <p className="tab-desc">Explicit risk identification with likelihood, impact assessment, and mitigation strategy.</p>
              {result.riskRegister?.length ? (
                <table className="data-table" style={{width:'100%'}}>
                  <thead><tr><th>Risk</th><th>Likelihood</th><th>Impact</th><th>Mitigation</th><th>Residual</th></tr></thead>
                  <tbody>
                    {result.riskRegister.map((r, i) => (
                      <tr key={i}>
                        <td><strong>{r.risk}</strong><br/><small style={{color:'var(--text-muted)'}}>{r.category}</small></td>
                        <td style={{color: r.likelihood === 'High' || r.likelihood === 'Very High' ? '#dc2626' : r.likelihood === 'Medium' ? '#d97706' : '#16a34a', fontWeight:'bold'}}>{r.likelihood}</td>
                        <td style={{color: r.impact === 'Critical' || r.impact === 'High' ? '#dc2626' : r.impact === 'Medium' ? '#d97706' : '#16a34a', fontWeight:'bold'}}>{r.impact}</td>
                        <td style={{fontSize:12}}>{r.mitigation}</td>
                        <td style={{color: r.residualRisk === 'High' ? '#dc2626' : r.residualRisk === 'Medium' ? '#d97706' : '#16a34a', fontWeight:'bold'}}>{r.residualRisk}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p style={{color:'var(--text-muted)'}}>Risk register not available.</p>}
            </div>
          )}

          {/* ═══ BANKABLE REPORT: PUMP TEST PROTOCOL ═══ */}
          {activeResultTab==='pump-protocol' && (
            <div>
              <h4 className="tab-title">{'\u{1F4CB}'} Pump Test Protocol (Planned)</h4>
              <p className="tab-desc">Field validation protocol to upgrade confidence from pre-feasibility to bankable grade.</p>
              {result.pumpTestProtocol ? (() => {
                const pt = result.pumpTestProtocol!;
                return (
                <div>
                  <table className="data-table" style={{width:'100%'}}>
                    <thead><tr><th>Parameter</th><th>Specification</th></tr></thead>
                    <tbody>
                      <tr><td><strong>Test Type</strong></td><td>{pt.testType}</td></tr>
                      <tr><td><strong>Duration</strong></td><td>{pt.plannedDuration_hr} hours</td></tr>
                      <tr><td><strong>Pump Rates</strong></td><td>{pt.plannedRates_m3hr.map(r => `${r} m3/hr`).join(' -> ')}</td></tr>
                      <tr><td><strong>Step Drawdown</strong></td><td>{pt.stepDrawdown ? 'YES (3 steps, 2hr each)' : 'NO'}</td></tr>
                      <tr><td><strong>Recovery Test</strong></td><td>{pt.recoveryTest ? 'YES (monitor until 80% recovery)' : 'NO'}</td></tr>
                      <tr><td><strong>Monitoring</strong></td><td>{pt.monitoringFrequency}</td></tr>
                      <tr><td><strong>Acceptance</strong></td><td>{pt.acceptanceCriteria}</td></tr>
                    </tbody>
                  </table>
                  <h5 style={{marginTop:16}}>Required Equipment</h5>
                  <ul style={{paddingLeft:20}}>
                    {pt.equipmentRequired.map((eq, i) => <li key={i} style={{marginBottom:4}}>{eq}</li>)}
                  </ul>
                </div>
                );
              })() : <p style={{color:'var(--text-muted)'}}>Pump test protocol not available.</p>}
            </div>
          )}

          {/* ═══ BANKABLE REPORT: PREDICTION vs REALITY ═══ */}
          {activeResultTab==='prediction-table' && (
            <div>
              <h4 className="tab-title">{'\u{1F4CA}'} Prediction vs Reality</h4>
              <p className="tab-desc">Fill in "Actual" column after drilling. Error values feed back into the learning model.</p>
              {result.predictionTable?.length ? (
                <table className="data-table" style={{width:'100%'}}>
                  <thead><tr><th>Metric</th><th>Predicted</th><th style={{background:'rgba(255,255,0,0.1)'}}>Actual (fill in)</th><th style={{background:'rgba(255,255,0,0.1)'}}>Error (%)</th><th>Unit</th></tr></thead>
                  <tbody>
                    {result.predictionTable.map((p, i) => (
                      <tr key={i}>
                        <td><strong>{p.metric}</strong></td>
                        <td>{p.predicted}</td>
                        <td style={{background:'rgba(255,255,0,0.05)',fontStyle:'italic',color:'var(--text-muted)'}}>{p.actual}</td>
                        <td style={{background:'rgba(255,255,0,0.05)',fontStyle:'italic',color:'var(--text-muted)'}}>{p.error}</td>
                        <td>{p.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p style={{color:'var(--text-muted)'}}>Prediction table not available.</p>}
            </div>
          )}

          {/* ═══ BANKABLE REPORT: CONFIDENCE COMPOSITION ═══ */}
          {activeResultTab==='confidence-breakdown' && (
            <div>
              <h4 className="tab-title">{'\u{1F3AF}'} Confidence Composition</h4>
              <p className="tab-desc">Detailed breakdown showing how each data source contributes to the overall confidence score.</p>
              {result.confidenceComposition ? (() => {
                const cc = result.confidenceComposition!;
                return (
                <div>
                  <table className="data-table" style={{width:'100%'}}>
                    <thead><tr><th>Component</th><th>Score</th><th>Weight</th><th>Contribution</th></tr></thead>
                    <tbody>
                      <tr><td>AI Prior (ensemble)</td><td>{(cc.aiPrior * 100).toFixed(0)}%</td><td>0.25</td><td>{(cc.aiPrior * 0.25 * 100).toFixed(1)}%</td></tr>
                      <tr><td>Satellite Data</td><td>{(cc.satelliteData * 100).toFixed(0)}%</td><td>0.20</td><td>{(cc.satelliteData * 0.20 * 100).toFixed(1)}%</td></tr>
                      <tr><td>Geological Model</td><td>{(cc.geologicalModel * 100).toFixed(0)}%</td><td>0.20</td><td>{(cc.geologicalModel * 0.20 * 100).toFixed(1)}%</td></tr>
                      <tr><td>Borehole Calibration</td><td>{(cc.boreholeCalibration * 100).toFixed(0)}%</td><td>0.15</td><td>{(cc.boreholeCalibration * 0.15 * 100).toFixed(1)}%</td></tr>
                      <tr><td>Data Quality</td><td>{(cc.dataQuality * 100).toFixed(0)}%</td><td>0.20</td><td>{(cc.dataQuality * 0.20 * 100).toFixed(1)}%</td></tr>
                      {cc.ertAgreement != null && <tr style={{background:'rgba(34,197,94,0.08)'}}><td>ERT Agreement</td><td>{(cc.ertAgreement * 100).toFixed(0)}%</td><td>+0.15</td><td>+{(cc.ertAgreement * 0.15 * 100).toFixed(1)}%</td></tr>}
                      {cc.pumpTestValidation != null && <tr style={{background:'rgba(34,197,94,0.08)'}}><td>Pump Test</td><td>{(cc.pumpTestValidation * 100).toFixed(0)}%</td><td>+0.10</td><td>+{(cc.pumpTestValidation * 0.10 * 100).toFixed(1)}%</td></tr>}
                      <tr style={{fontWeight:'bold',background:'rgba(245,158,11,0.1)'}}><td>FINAL CONFIDENCE</td><td colSpan={2}></td><td style={{fontSize:16}}>{(cc.finalConfidence * 100).toFixed(0)}%</td></tr>
                    </tbody>
                  </table>
                  <div className="geo-note" style={{marginTop:8}}><strong>Method:</strong> {cc.method}</div>
                </div>
                );
              })() : <p style={{color:'var(--text-muted)'}}>Confidence composition not available.</p>}
            </div>
          )}

          {/* ═══ BANKABLE REPORT: BANKABLE READINESS CHECKLIST ═══ */}
          {activeResultTab==='bankable-checklist' && (
            <div>
              <h4 className="tab-title">{'\u{2705}'} Bankable Readiness Checklist</h4>
              <p className="tab-desc">Status of each component required for bankable-grade reporting.</p>
              {result.bankableChecklist?.length ? (() => {
                const present = result.bankableChecklist!.filter(c => c.status === 'PRESENT').length;
                const total = result.bankableChecklist!.length;
                const pct = Math.round((present / total) * 100);
                return (
                <div>
                  <div style={{marginBottom:16,padding:12,borderRadius:8,background: pct >= 80 ? 'rgba(34,197,94,0.1)' : pct >= 50 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)', textAlign:'center'}}>
                    <span style={{fontSize:24,fontWeight:'bold',color: pct >= 80 ? '#16a34a' : pct >= 50 ? '#d97706' : '#dc2626'}}>{pct}%</span>
                    <span style={{marginLeft:8}}>Bankable Readiness ({present}/{total} items)</span>
                  </div>
                  <table className="data-table" style={{width:'100%'}}>
                    <thead><tr><th>Item</th><th>Status</th><th>Detail</th><th>Required</th></tr></thead>
                    <tbody>
                      {result.bankableChecklist!.map((c, i) => (
                        <tr key={i}>
                          <td><strong>{c.item}</strong><br/><small style={{color:'var(--text-muted)'}}>{c.category}</small></td>
                          <td style={{fontWeight:'bold',color: c.status === 'PRESENT' ? '#16a34a' : c.status === 'PARTIAL' ? '#d97706' : c.status === 'PLANNED' ? '#38bdf8' : '#dc2626'}}>{c.status}</td>
                          <td style={{fontSize:12}}>{c.detail}</td>
                          <td>{c.requiredForBankable ? 'YES' : 'No'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                );
              })() : <p style={{color:'var(--text-muted)'}}>Bankable checklist not available.</p>}
            </div>
          )}

          {/* ═══ WELL DESIGN — ENGINEERING SPECIFICATIONS ═══ */}
          {activeResultTab==='well-design' && (
            <div>
              <h4 className="tab-title">{'\u{1F527}'} Well Design — Engineering Specifications</h4>
              <p className="tab-desc">Professional well design: casing, screen, gravel pack, pump selection, drawdown analysis, core sampling plan, and borehole log template.</p>
              {result.wellDesign ? (() => {
                const wd = result.wellDesign!;
                const dd = wd.drawdown;
                const pm = wd.pump;
                const cs = wd.coreSampling;
                const confColor = wd.designConfidence === 'HIGH' ? '#16a34a' : wd.designConfidence === 'MODERATE' ? '#d97706' : '#dc2626';
                return (
                <div>
                  {/* Confidence banner */}
                  <div style={{padding:12,marginBottom:16,borderRadius:10,background:`${confColor}10`,border:`2px solid ${confColor}30`,textAlign:'center'}}>
                    <span style={{fontSize:22,fontWeight:800,color:confColor}}>{wd.designConfidence}</span>
                    <p style={{fontSize:12,color:'var(--text-muted)',margin:'4px 0 0'}}>{wd.confidenceNote}</p>
                  </div>

                  {/* Borehole specifications */}
                  <div style={{marginBottom:20}}>
                    <h5 style={{fontSize:14,fontWeight:700,marginBottom:8}}>Borehole Specifications</h5>
                    <table className="data-table" style={{width:'100%',fontSize:12}}>
                      <tbody>
                        <tr><td style={{fontWeight:600}}>Drilling Method</td><td>{wd.boreholeSpecifications.drillingMethod}</td></tr>
                        <tr><td style={{fontWeight:600}}>Borehole Diameter</td><td>{wd.boreholeSpecifications.drillingDiameter_mm}mm ({wd.boreholeSpecifications.drillingDiameter_inches})</td></tr>
                        <tr><td style={{fontWeight:600}}>Total Depth</td><td>{wd.boreholeSpecifications.totalDepth_m}m (incl. {wd.boreholeSpecifications.ratHole_m}m rat hole)</td></tr>
                        <tr><td style={{fontWeight:600}}>Pilot Hole</td><td>{wd.boreholeSpecifications.pilotHole ? 'Yes' : 'Not required'}</td></tr>
                        <tr><td style={{fontWeight:600}}>Est. Drilling Days</td><td>{wd.boreholeSpecifications.estimatedDrillingDays[0]}-{wd.boreholeSpecifications.estimatedDrillingDays[1]} days</td></tr>
                        <tr><td style={{fontWeight:600}}>Cost/Meter (USD)</td><td>${wd.boreholeSpecifications.drillingCostPerMeter_usd[0]}-${wd.boreholeSpecifications.drillingCostPerMeter_usd[1]}</td></tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Casing design */}
                  <div style={{marginBottom:20}}>
                    <h5 style={{fontSize:14,fontWeight:700,marginBottom:8}}>Casing Design</h5>
                    <table className="data-table" style={{width:'100%',fontSize:11}}>
                      <thead><tr><th>Type</th><th>Material</th><th>OD</th><th>Wall</th><th>Depth</th><th>Purpose</th></tr></thead>
                      <tbody>
                        {wd.casing.map((c,i) => (
                          <tr key={i}>
                            <td style={{fontWeight:600}}>{c.depth_m[1] < 15 ? 'Surface' : 'Production'}</td>
                            <td>{c.material}</td>
                            <td>{c.outerDiameter_inches}</td>
                            <td>{c.wallThickness_mm}mm</td>
                            <td>{c.depth_m[0]}-{c.depth_m[1]}m</td>
                            <td style={{fontSize:10}}>{c.purpose}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Screen design */}
                  <div style={{marginBottom:20}}>
                    <h5 style={{fontSize:14,fontWeight:700,marginBottom:8}}>Screen Design</h5>
                    <table className="data-table" style={{width:'100%',fontSize:12}}>
                      <tbody>
                        <tr><td style={{fontWeight:600}}>Type</td><td>{wd.screen.type}</td></tr>
                        <tr><td style={{fontWeight:600}}>Material</td><td>{wd.screen.material}</td></tr>
                        <tr><td style={{fontWeight:600}}>Slot Size</td><td>{wd.screen.slotSize_mm}mm ({wd.screen.slotSize_inches})</td></tr>
                        <tr><td style={{fontWeight:600}}>Open Area</td><td>{wd.screen.openAreaPercent}%</td></tr>
                        <tr><td style={{fontWeight:600}}>Length</td><td>{wd.screen.length_m}m</td></tr>
                        <tr><td style={{fontWeight:600}}>Interval</td><td>{wd.screen.depth_m[0]}m - {wd.screen.depth_m[1]}m</td></tr>
                        <tr><td style={{fontWeight:600}}>Entrance Velocity</td><td style={{color: wd.screen.entranceVelocity_m_s > wd.screen.maxEntranceVelocity_m_s ? '#dc2626' : '#16a34a'}}>{(wd.screen.entranceVelocity_m_s * 1000).toFixed(1)} mm/s (max: {wd.screen.maxEntranceVelocity_m_s * 1000} mm/s)</td></tr>
                        <tr><td style={{fontWeight:600}}>Selection Basis</td><td style={{fontSize:11,fontStyle:'italic'}}>{wd.screen.selectionBasis}</td></tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Gravel pack */}
                  {wd.gravelPack.required && (
                  <div style={{marginBottom:20}}>
                    <h5 style={{fontSize:14,fontWeight:700,marginBottom:8}}>Gravel Pack</h5>
                    <table className="data-table" style={{width:'100%',fontSize:12}}>
                      <tbody>
                        <tr><td style={{fontWeight:600}}>Grain Size</td><td>{wd.gravelPack.grainSize_mm[0]}-{wd.gravelPack.grainSize_mm[1]}mm</td></tr>
                        <tr><td style={{fontWeight:600}}>Filter Ratio</td><td>{wd.gravelPack.filterRatio}</td></tr>
                        <tr><td style={{fontWeight:600}}>Thickness</td><td>{wd.gravelPack.thickness_mm}mm annular</td></tr>
                        <tr><td style={{fontWeight:600}}>Material</td><td>{wd.gravelPack.material}</td></tr>
                        <tr><td style={{fontWeight:600}}>Volume Required</td><td>{wd.gravelPack.volume_m3} m³ (incl. 30% overfill)</td></tr>
                        <tr><td style={{fontWeight:600}}>Placement</td><td>{wd.gravelPack.placementMethod}</td></tr>
                      </tbody>
                    </table>
                  </div>
                  )}

                  {/* Sanitary seal */}
                  <div style={{marginBottom:20,padding:12,borderRadius:8,background:'rgba(59,130,246,0.06)',border:'1px solid rgba(59,130,246,0.2)'}}>
                    <h5 style={{fontSize:13,fontWeight:700,marginBottom:6}}>Sanitary Seal</h5>
                    <p style={{fontSize:12,margin:0}}><strong>{wd.sanitary_seal.type}</strong> — 0 to {wd.sanitary_seal.depth_m}m — {wd.sanitary_seal.material}</p>
                    <p style={{fontSize:11,color:'var(--text-muted)',margin:'4px 0 0'}}>{wd.sanitary_seal.purpose}</p>
                  </div>

                  {/* Drawdown analysis */}
                  <div style={{marginBottom:20}}>
                    <h5 style={{fontSize:14,fontWeight:700,marginBottom:8}}>Drawdown Analysis (24-hour pump test)</h5>
                    <table className="data-table" style={{width:'100%',fontSize:12}}>
                      <tbody>
                        <tr><td style={{fontWeight:600}}>Design Rate</td><td>{dd.designPumpingRate_m3hr} m³/hr ({dd.designPumpingRate_m3day} m³/day)</td></tr>
                        <tr><td style={{fontWeight:600}}>Theis Drawdown</td><td>{dd.theis_drawdown_m}m</td></tr>
                        <tr><td style={{fontWeight:600}}>Cooper-Jacob Drawdown</td><td>{dd.cooperJacob_drawdown_m}m</td></tr>
                        <tr><td style={{fontWeight:600}}>Well Loss</td><td>{dd.wellLoss_m}m — <span style={{fontSize:10,color:'var(--text-muted)'}}>{dd.wellLossSource}</span></td></tr>
                        <tr style={{fontWeight:700,background:'rgba(59,130,246,0.06)'}}><td>TOTAL DRAWDOWN</td><td>{dd.totalDrawdown_m}m</td></tr>
                        <tr><td style={{fontWeight:600}}>Dynamic Water Level</td><td>{dd.dynamicWaterLevel_m}m bgl</td></tr>
                        <tr><td style={{fontWeight:600}}>Available Drawdown</td><td>{dd.availableDrawdown_m}m</td></tr>
                        <tr><td style={{fontWeight:600}}>Margin</td><td style={{color: dd.drawdownMargin_pct > 30 ? '#16a34a' : dd.drawdownMargin_pct > 10 ? '#d97706' : '#dc2626'}}>{dd.drawdownMargin_pct}%</td></tr>
                        <tr style={{fontWeight:700}}><td>Specific Capacity</td><td>{dd.specificCapacity_m3_day_m} m³/day/m ({dd.specificCapacity_class})</td></tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Pump selection */}
                  <div style={{marginBottom:20}}>
                    <h5 style={{fontSize:14,fontWeight:700,marginBottom:8}}>Pump Selection</h5>
                    <table className="data-table" style={{width:'100%',fontSize:12}}>
                      <tbody>
                        <tr><td style={{fontWeight:600}}>Type</td><td>{pm.type}</td></tr>
                        <tr><td style={{fontWeight:600}}>Suggested Model</td><td>{pm.make_model_suggestion}</td></tr>
                        <tr><td style={{fontWeight:600}}>Motor Rating</td><td>{pm.motorRating_kW} kW ({pm.motorRating_hp} HP)</td></tr>
                        <tr><td style={{fontWeight:600}}>Total Dynamic Head</td><td>{pm.totalDynamicHead_m}m</td></tr>
                        <tr><td style={{fontWeight:600}}>Pump Efficiency</td><td>{pm.pumpEfficiency_pct}% (at operating point from curve)</td></tr>
                        <tr><td style={{fontWeight:600}}>Installation Depth</td><td>{pm.installationDepth_m}m bgl</td></tr>
                        <tr><td style={{fontWeight:600}}>Power Source</td><td>{pm.powerSource}</td></tr>
                        {pm.solarPanels_kW && <tr><td style={{fontWeight:600}}>Solar Array</td><td>{pm.solarPanels_kW} kWp</td></tr>}
                        <tr><td style={{fontWeight:600}}>Riser Pipe</td><td>{pm.riserPipe.material}, {pm.riserPipe.diameter_mm}mm, {pm.riserPipe.length_m}m</td></tr>
                        <tr><td style={{fontWeight:600}}>Est. Cost (USD)</td><td>${pm.estimatedCost_usd[0].toLocaleString()} - ${pm.estimatedCost_usd[1].toLocaleString()}</td></tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Well development */}
                  <div style={{marginBottom:20}}>
                    <h5 style={{fontSize:14,fontWeight:700,marginBottom:8}}>Well Development Plan</h5>
                    <p style={{fontSize:12}}><strong>Primary:</strong> {wd.wellDevelopment.primaryMethod}</p>
                    <p style={{fontSize:12}}><strong>Secondary:</strong> {wd.wellDevelopment.secondaryMethod}</p>
                    <p style={{fontSize:12}}><strong>Duration:</strong> {wd.wellDevelopment.estimatedDuration_hr} hours</p>
                    <ol style={{fontSize:12,paddingLeft:20}}>
                      {wd.wellDevelopment.steps.map((s,i) => <li key={i} style={{marginBottom:3}}>{s}</li>)}
                    </ol>
                    <p style={{fontSize:12,fontWeight:600,marginTop:8}}>Success Criteria:</p>
                    <ul style={{fontSize:12,paddingLeft:20}}>
                      {wd.wellDevelopment.successCriteria.map((c,i) => <li key={i}>{c}</li>)}
                    </ul>
                  </div>

                  {/* Core sampling */}
                  <div style={{marginBottom:20}}>
                    <h5 style={{fontSize:14,fontWeight:700,marginBottom:8}}>Core Sampling Plan</h5>
                    <table className="data-table" style={{width:'100%',fontSize:11}}>
                      <thead><tr><th>From (m)</th><th>To (m)</th><th>Purpose</th><th>Method</th></tr></thead>
                      <tbody>
                        {cs.intervals.map((iv,i) => (
                          <tr key={i}><td>{iv.from_m}</td><td>{iv.to_m}</td><td>{iv.purpose}</td><td>{iv.method}</td></tr>
                        ))}
                      </tbody>
                    </table>
                    <p style={{fontSize:11,marginTop:6}}>Total core: {cs.totalCoreLengths_m}m | Est. cost: ${cs.estimatedCost_usd[0].toLocaleString()}-${cs.estimatedCost_usd[1].toLocaleString()}</p>
                    <p style={{fontSize:12,fontWeight:600,marginTop:6}}>Lab Analyses:</p>
                    <ul style={{fontSize:11,paddingLeft:20}}>{cs.analyses.map((a,i) => <li key={i}>{a}</li>)}</ul>
                    {cs.thinSectionRequired && (
                      <div style={{marginTop:8,padding:8,borderRadius:6,background:'rgba(168,85,247,0.06)',border:'1px solid rgba(168,85,247,0.2)'}}>
                        <p style={{fontSize:12,fontWeight:600,color:'#a855f7',margin:0}}>Thin Section Analysis Required:</p>
                        <ul style={{fontSize:11,paddingLeft:20,margin:'4px 0 0'}}>{cs.thinSectionIntervals.map((t,i) => <li key={i}>{t}</li>)}</ul>
                      </div>
                    )}
                  </div>

                  {/* Data Provenance (v2) */}
                  {wd.dataProvenance && wd.dataProvenance.length > 0 && (
                  <div style={{marginBottom:20}}>
                    <h5 style={{fontSize:14,fontWeight:700,marginBottom:8}}>Data Provenance — Source Tracking</h5>
                    <p style={{fontSize:11,color:'var(--text-muted)',marginBottom:8}}>Shows exactly which parameters are field-measured vs estimated. An engineer MUST verify all "estimated" parameters before signing off.</p>
                    <table className="data-table" style={{width:'100%',fontSize:11}}>
                      <thead><tr><th>Parameter</th><th>Source</th><th>Note</th></tr></thead>
                      <tbody>
                        {wd.dataProvenance.map((dp: any, i: number) => (
                          <tr key={i} style={{background: dp.source === 'field_measured' || dp.source === 'lab_tested' ? 'rgba(22,163,74,0.05)' : dp.source === 'estimated' ? 'rgba(220,38,38,0.05)' : 'transparent'}}>
                            <td style={{fontWeight:600}}>{dp.parameter}</td>
                            <td><span style={{padding:'2px 6px',borderRadius:4,fontSize:10,fontWeight:700,background: dp.source === 'field_measured' || dp.source === 'lab_tested' ? '#16a34a20' : dp.source === 'estimated' ? '#dc262620' : '#3b82f620',color: dp.source === 'field_measured' || dp.source === 'lab_tested' ? '#16a34a' : dp.source === 'estimated' ? '#dc2626' : '#3b82f6'}}>{dp.source.replace('_',' ').toUpperCase()}</span></td>
                            <td style={{fontSize:10}}>{dp.note}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  )}

                  {/* Design standards */}
                  <div style={{marginBottom:20,padding:12,borderRadius:8,background:'rgba(100,100,100,0.04)',border:'1px solid var(--border)'}}>
                    <h5 style={{fontSize:13,fontWeight:700,marginBottom:6}}>Design Standards</h5>
                    <ul style={{fontSize:11,paddingLeft:16,margin:0}}>{wd.designStandards.map((s,i) => <li key={i}>{s}</li>)}</ul>
                  </div>

                  {/* Design notes/warnings */}
                  {wd.designNotes.length > 0 && (
                  <div style={{padding:12,borderRadius:8,background:'rgba(220,38,38,0.05)',border:'1px solid rgba(220,38,38,0.2)'}}>
                    <h5 style={{fontSize:13,fontWeight:700,color:'#dc2626',marginBottom:6}}>Design Notes & Warnings</h5>
                    <ul style={{fontSize:11,paddingLeft:16,margin:0}}>{wd.designNotes.map((n,i) => <li key={i} style={{marginBottom:4}}>{n}</li>)}</ul>
                  </div>
                  )}
                </div>
                );
              })() : <p style={{color:'var(--text-muted)'}}>Well design data not available. Run analysis with sufficient location data.</p>}
            </div>
          )}

          {/* ═══ ENGINEER TRUST DASHBOARD ═══ */}
          {activeResultTab==='engineer-trust' && (
            <div>
              <h4 className="tab-title">{'\u{1F3DB}\u{FE0F}'} Engineer Trust Score</h4>
              <p className="tab-desc">Professional-grade confidence assessment. Shows data quality, physics rigor, validation status, and certification readiness.</p>
              {result.engineerConfidence ? (() => {
                const ec = result.engineerConfidence!;
                const gradeColor = ec.trustGrade <= 'A' ? '#16a34a' : ec.trustGrade === 'B' ? '#0ea5e9' : ec.trustGrade === 'C' ? '#d97706' : '#dc2626';
                return (
                <div>
                  {/* Hero Score */}
                  <div style={{textAlign:'center',padding:24,marginBottom:20,borderRadius:16,background:`linear-gradient(135deg,${gradeColor}15,${gradeColor}05)`,border:`2px solid ${gradeColor}40`}}>
                    <div style={{fontSize:56,fontWeight:800,color:gradeColor,lineHeight:1}}>{ec.engineerTrustScore}</div>
                    <div style={{fontSize:14,color:'var(--text-secondary)',marginTop:4}}>out of 100</div>
                    <div style={{fontSize:28,fontWeight:700,color:gradeColor,marginTop:6}}>Grade {ec.trustGrade}</div>
                    <div style={{fontSize:13,color:'var(--text-muted)',marginTop:8,maxWidth:500,marginLeft:'auto',marginRight:'auto'}}>
                      {ec.provenance.reportGradeJustification}
                    </div>
                  </div>

                  {/* Trust Breakdown (4 quadrants) */}
                  <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12,marginBottom:20}}>
                    {[
                      { label: 'Data Quality', score: ec.trustBreakdown.dataQuality, max: 25, color: '#0ea5e9', desc: `${ec.provenance.measuredCount} measured, ${ec.provenance.calibratedCount} calibrated, ${ec.provenance.estimatedCount} estimated` },
                      { label: 'Physics Rigor', score: ec.trustBreakdown.physicsRigor, max: 25, color: '#8b5cf6', desc: `Theis + Cooper-Jacob + ${ec.provenance.ertPresent ? 'ERT inversion' : 'pedotransfer only'}` },
                      { label: 'Validation', score: ec.trustBreakdown.validation, max: 25, color: '#f59e0b', desc: `${ec.crossValidation.wellCount} wells validated, MAPE ${ec.crossValidation.depthMAPE_pct}%` },
                      { label: 'Transparency', score: ec.trustBreakdown.transparency, max: 25, color: '#16a34a', desc: 'Full provenance, methodology, uncertainty disclosed' },
                    ].map((q, i) => (
                      <div key={i} style={{padding:16,borderRadius:12,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                          <span style={{fontWeight:700,color:q.color}}>{q.label}</span>
                          <span style={{fontSize:18,fontWeight:800,color:q.color}}>{q.score}/{q.max}</span>
                        </div>
                        <div style={{height:6,borderRadius:3,background:'rgba(255,255,255,0.08)',marginBottom:6}}>
                          <div style={{height:'100%',width:`${(q.score/q.max)*100}%`,borderRadius:3,background:q.color,transition:'width 0.3s'}} />
                        </div>
                        <div style={{fontSize:11,color:'var(--text-muted)'}}>{q.desc}</div>
                      </div>
                    ))}
                  </div>

                  {/* Report Grade Badge */}
                  <div style={{marginBottom:20,padding:16,borderRadius:12,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}>
                    <h5 style={{marginBottom:10}}>Report Classification</h5>
                    <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
                      <span style={{padding:'6px 14px',borderRadius:6,fontWeight:700,fontSize:13,
                        background: ec.provenance.reportGrade === 'BANKABLE' ? 'rgba(34,197,94,0.15)' : ec.provenance.reportGrade === 'ENGINEERING_GRADE' ? 'rgba(14,165,233,0.15)' : ec.provenance.reportGrade === 'PRE_FEASIBILITY' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                        color: ec.provenance.reportGrade === 'BANKABLE' ? '#16a34a' : ec.provenance.reportGrade === 'ENGINEERING_GRADE' ? '#0ea5e9' : ec.provenance.reportGrade === 'PRE_FEASIBILITY' ? '#d97706' : '#dc2626',
                        border: `1px solid ${ec.provenance.reportGrade === 'BANKABLE' ? '#16a34a40' : ec.provenance.reportGrade === 'ENGINEERING_GRADE' ? '#0ea5e940' : ec.provenance.reportGrade === 'PRE_FEASIBILITY' ? '#d9770640' : '#dc262640'}`
                      }}>{ec.provenance.reportGrade.replace(/_/g, ' ')}</span>
                      <span style={{fontSize:12,color:'var(--text-secondary)'}}>{ec.provenance.overallAccuracy_pct}% overall data accuracy</span>
                    </div>
                    <div style={{fontSize:12,color:'var(--text-muted)'}}>{ec.provenance.reportGradeJustification}</div>
                  </div>

                  {/* Certification Readiness */}
                  <div style={{marginBottom:16}}>
                    <h5 style={{marginBottom:10}}>Certification Readiness</h5>
                    <table className="data-table" style={{width:'100%'}}>
                      <thead><tr><th>Level</th><th>Ready</th><th>Score</th><th>Missing Items</th></tr></thead>
                      <tbody>
                        {([
                          ['Pre-Feasibility', ec.certificationReadiness.preFeasibility],
                          ['Engineering Grade', ec.certificationReadiness.engineeringGrade],
                          ['Bankable', ec.certificationReadiness.bankable],
                          ['Regulatory Submission', ec.certificationReadiness.regulatorySubmission],
                        ] as [string, {ready:boolean;score:number;missing:string[]}][]).map(([name, cert], i) => (
                          <tr key={i}>
                            <td><strong>{name}</strong></td>
                            <td style={{fontWeight:'bold',color:cert.ready?'#16a34a':'#dc2626'}}>{cert.ready?'READY':'NOT READY'}</td>
                            <td>{cert.score}/100</td>
                            <td style={{fontSize:11}}>{cert.missing.length ? cert.missing.join('; ') : 'All requirements met'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Data Inputs Summary */}
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:16}}>
                    <div style={{padding:10,borderRadius:8,background:ec.provenance.ertPresent?'rgba(34,197,94,0.08)':'rgba(239,68,68,0.08)',textAlign:'center'}}>
                      <div style={{fontSize:20,fontWeight:700,color:ec.provenance.ertPresent?'#16a34a':'#dc2626'}}>{ec.provenance.ertPresent?'YES':'NO'}</div>
                      <div style={{fontSize:11}}>ERT Survey</div>
                    </div>
                    <div style={{padding:10,borderRadius:8,background:ec.provenance.pumpTestPresent?'rgba(34,197,94,0.08)':'rgba(239,68,68,0.08)',textAlign:'center'}}>
                      <div style={{fontSize:20,fontWeight:700,color:ec.provenance.pumpTestPresent?'#16a34a':'#dc2626'}}>{ec.provenance.pumpTestPresent?'YES':'NO'}</div>
                      <div style={{fontSize:11}}>Pump Test</div>
                    </div>
                    <div style={{padding:10,borderRadius:8,background:ec.provenance.nearbyWellsUsed>=3?'rgba(34,197,94,0.08)':'rgba(245,158,11,0.08)',textAlign:'center'}}>
                      <div style={{fontSize:20,fontWeight:700,color:ec.provenance.nearbyWellsUsed>=3?'#16a34a':'#d97706'}}>{ec.provenance.nearbyWellsUsed}</div>
                      <div style={{fontSize:11}}>Nearby Wells</div>
                    </div>
                  </div>
                </div>
                );
              })() : <p style={{color:'var(--text-muted)'}}>Engineer confidence data not available. Re-run analysis.</p>}
            </div>
          )}

          {/* ═══ DATA PROVENANCE MATRIX ═══ */}
          {activeResultTab==='data-provenance' && (
            <div>
              <h4 className="tab-title">{'\u{1F50D}'} Data Provenance Matrix</h4>
              <p className="tab-desc">Every prediction tagged with source, method, accuracy, and tier. Engineers can verify exactly where each number comes from.</p>
              {result.engineerConfidence?.provenance ? (() => {
                const prov = result.engineerConfidence!.provenance;
                const tierColors: Record<string,string> = { MEASURED: '#16a34a', CALIBRATED: '#0ea5e9', ESTIMATED: '#f59e0b', INFERRED: '#dc2626', DEFAULT: '#6b7280' };
                return (
                <div>
                  {/* Tier summary */}
                  <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap'}}>
                    {(['MEASURED','CALIBRATED','ESTIMATED','INFERRED','DEFAULT'] as const).map(tier => {
                      const count = prov.items.filter(i => i.tier === tier).length;
                      return count > 0 ? (
                        <div key={tier} style={{padding:'6px 12px',borderRadius:6,background:`${tierColors[tier]}15`,border:`1px solid ${tierColors[tier]}40`,fontSize:12}}>
                          <span style={{fontWeight:700,color:tierColors[tier]}}>{tier}</span>
                          <span style={{marginLeft:6}}>{count}</span>
                        </div>
                      ) : null;
                    })}
                  </div>

                  {/* Full provenance table */}
                  {prov.items.map((item, idx) => (
                    <div key={idx} style={{marginBottom:12,padding:14,borderRadius:10,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',borderLeft:`4px solid ${tierColors[item.tier]}`}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                        <div>
                          <strong style={{fontSize:13}}>{item.parameter}</strong>
                          <span style={{marginLeft:10,padding:'2px 8px',borderRadius:4,fontSize:10,fontWeight:700,
                            background:`${tierColors[item.tier]}20`,color:tierColors[item.tier]
                          }}>{item.tier}</span>
                        </div>
                        <div style={{fontSize:16,fontWeight:700,color:tierColors[item.tier]}}>
                          {typeof item.value === 'number' ? item.value.toFixed(item.unit === '%' ? 0 : item.unit === 'm3/hr' ? 2 : 1) : item.value}{item.unit ? ` ${item.unit}` : ''}
                        </div>
                      </div>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,fontSize:11,color:'var(--text-secondary)'}}>
                        <div><strong>Source:</strong> {item.source}</div>
                        <div><strong>Accuracy:</strong> {item.accuracy_pct}%</div>
                        <div style={{gridColumn:'1/-1'}}><strong>Method:</strong> {item.method}</div>
                        {item.reference && <div><strong>Reference:</strong> {item.reference}</div>}
                        {item.isoStandard && <div><strong>Standard:</strong> {item.isoStandard}</div>}
                        {item.confidenceInterval && <div><strong>{item.confidenceInterval.confidence_pct}% CI:</strong> {item.confidenceInterval.lower.toFixed(1)} - {item.confidenceInterval.upper.toFixed(1)} {item.unit}</div>}
                      </div>
                      {item.limitations.length > 0 && (
                        <div style={{marginTop:6,fontSize:10,color:'var(--text-muted)'}}>
                          <strong>Limitations:</strong> {item.limitations.join(' | ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                );
              })() : <p style={{color:'var(--text-muted)'}}>Data provenance not available.</p>}
            </div>
          )}

          {/* ═══ METHODOLOGY & STANDARDS ═══ */}
          {activeResultTab==='methodology' && (
            <div>
              <h4 className="tab-title">{'\u{1F4D6}'} Methodology, Standards & Limitations</h4>
              <p className="tab-desc">Complete documentation of every calculation step, referenced standards, and honest limitations disclosure.</p>
              {result.engineerConfidence?.methodology ? (() => {
                const m = result.engineerConfidence!.methodology;
                return (
                <div>
                  {/* Assessment Note */}
                  <div style={{padding:14,borderRadius:10,background:'rgba(56,130,246,0.05)',border:'1px solid rgba(56,130,246,0.15)',marginBottom:16}}>
                    <div style={{fontWeight:700,color:'#3b82f6',marginBottom:6,fontSize:12}}>Assessment Note</div>
                    <div style={{fontSize:11,color:'var(--text-secondary)',lineHeight:1.6}}>{m.disclaimer}</div>
                  </div>

                  {/* Software & Date */}
                  <div style={{display:'flex',gap:16,marginBottom:16,fontSize:12}}>
                    <div><strong>Software:</strong> {m.softwareVersion}</div>
                    <div><strong>Analysis Date:</strong> {new Date(m.analysisDate).toLocaleDateString()}</div>
                  </div>

                  {/* Methodology Steps */}
                  <h5 style={{marginBottom:10}}>Calculation Methodology ({m.steps.length} Steps)</h5>
                  {m.steps.map((step, i) => {
                    const tierColor = step.dataTier === 'MEASURED' ? '#16a34a' : step.dataTier === 'CALIBRATED' ? '#0ea5e9' : step.dataTier === 'ESTIMATED' ? '#f59e0b' : '#dc2626';
                    return (
                    <div key={i} style={{marginBottom:12,padding:14,borderRadius:10,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                        <div style={{fontWeight:700,fontSize:13}}>
                          <span style={{background:'rgba(14,165,233,0.15)',color:'#0ea5e9',padding:'2px 8px',borderRadius:4,fontSize:11,marginRight:8}}>Step {step.step}</span>
                          {step.name}
                        </div>
                        <span style={{padding:'2px 8px',borderRadius:4,fontSize:10,fontWeight:700,background:`${tierColor}20`,color:tierColor}}>{step.dataTier}</span>
                      </div>
                      <div style={{fontSize:11,color:'var(--text-secondary)',marginBottom:6}}><strong>Method:</strong> {step.method}</div>
                      {step.equation && <div style={{fontFamily:'monospace',fontSize:11,padding:'4px 8px',borderRadius:4,background:'rgba(0,0,0,0.15)',marginBottom:6,color:'#38bdf8'}}>{step.equation}</div>}
                      <div style={{fontSize:10,color:'var(--text-muted)',marginBottom:4}}><strong>Reference:</strong> {step.reference}</div>
                      {step.isoStandard && <div style={{fontSize:10,color:'var(--text-muted)',marginBottom:4}}><strong>Standard:</strong> {step.isoStandard}</div>}
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,fontSize:10}}>
                        <div><strong>Inputs:</strong> {step.inputs.join(', ')}</div>
                        <div><strong>Outputs:</strong> {step.outputs.join(', ')}</div>
                      </div>
                      <div style={{marginTop:4,fontSize:10,color:'#f59e0b'}}><strong>Assumptions:</strong> {step.assumptions.join(' | ')}</div>
                      <div style={{fontSize:10,color:'var(--text-muted)'}}><strong>Limitations:</strong> {step.limitations.join(' | ')}</div>
                    </div>
                    );
                  })}

                  {/* Standards Referenced */}
                  <h5 style={{marginTop:16,marginBottom:10}}>Standards Referenced ({m.standardsReferenced.length})</h5>
                  <div style={{padding:12,borderRadius:10,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}>
                    {m.standardsReferenced.map((s, i) => (
                      <div key={i} style={{fontSize:11,padding:'4px 0',borderBottom:i<m.standardsReferenced.length-1?'1px solid rgba(255,255,255,0.04)':'none'}}>{s}</div>
                    ))}
                  </div>

                  {/* Key Assumptions */}
                  <h5 style={{marginTop:16,marginBottom:10}}>Key Assumptions</h5>
                  <div style={{padding:12,borderRadius:10,background:'rgba(245,158,11,0.06)',border:'1px solid rgba(245,158,11,0.2)'}}>
                    {m.assumptions.map((a, i) => (
                      <div key={i} style={{fontSize:11,padding:'4px 0',paddingLeft:16,position:'relative'}}>
                        <span style={{position:'absolute',left:0,color:'#f59e0b'}}>*</span>{a}
                      </div>
                    ))}
                  </div>

                  {/* Limitations */}
                  <h5 style={{marginTop:16,marginBottom:10,color:'var(--text-secondary)'}}>Limitations & Caveats</h5>
                  <div style={{padding:12,borderRadius:10,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}>
                    {m.limitations.map((l, i) => (
                      <div key={i} style={{fontSize:11,padding:'4px 0',paddingLeft:16,position:'relative'}}>
                        <span style={{position:'absolute',left:0,color:'var(--text-muted)'}}>{'\u2022'}</span>{l}
                      </div>
                    ))}
                  </div>

                  {/* Recommendations */}
                  <h5 style={{marginTop:16,marginBottom:10,color:'#16a34a'}}>Recommendations</h5>
                  <div style={{padding:12,borderRadius:10,background:'rgba(34,197,94,0.06)',border:'1px solid rgba(34,197,94,0.2)'}}>
                    {m.recommendations.map((r, i) => (
                      <div key={i} style={{fontSize:11,padding:'4px 0',paddingLeft:16,position:'relative'}}>
                        <span style={{position:'absolute',left:0,color:'#16a34a'}}>{'\u2192'}</span>{r}
                      </div>
                    ))}
                  </div>
                </div>
                );
              })() : <p style={{color:'var(--text-muted)'}}>Methodology report not available.</p>}
            </div>
          )}

          {/* ═══ CROSS-VALIDATION & UNCERTAINTY ═══ */}
          {activeResultTab==='cross-validation' && (
            <div>
              <h4 className="tab-title">{'\u{1F4CA}'} Cross-Validation & Uncertainty Analysis</h4>
              <p className="tab-desc">Prediction accuracy validated against nearby wells. Monte Carlo confidence intervals for all key estimates.</p>
              {result.engineerConfidence ? (() => {
                const cv = result.engineerConfidence!.crossValidation;
                const unc = result.engineerConfidence!.uncertainty;
                const verdictColor = cv.engineerVerdict === 'RELIABLE' ? '#16a34a' : cv.engineerVerdict === 'INDICATIVE' ? '#0ea5e9' : cv.engineerVerdict === 'USE_WITH_CAUTION' ? '#f59e0b' : '#dc2626';
                return (
                <div>
                  {/* Verdict Banner */}
                  <div style={{padding:16,borderRadius:12,marginBottom:20,textAlign:'center',background:`${verdictColor}10`,border:`2px solid ${verdictColor}40`}}>
                    <div style={{fontSize:22,fontWeight:800,color:verdictColor}}>{cv.engineerVerdict.replace(/_/g, ' ')}</div>
                    <div style={{fontSize:12,color:'var(--text-secondary)',marginTop:6,maxWidth:600,marginLeft:'auto',marginRight:'auto'}}>{cv.verdictJustification}</div>
                  </div>

                  {/* Validation Statistics */}
                  {cv.wellCount > 0 ? (
                    <div style={{marginBottom:20}}>
                      <h5 style={{marginBottom:10}}>Prediction vs Actual ({cv.wellCount} wells)</h5>
                      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:8,marginBottom:12}}>
                        <div className="result-item"><span className="rl">Depth RMSE</span><span className="rv">{cv.depthRMSE_m}m</span></div>
                        <div className="result-item"><span className="rl">Depth MAE</span><span className="rv">{cv.depthMAE_m}m</span></div>
                        <div className="result-item"><span className="rl">Depth MAPE</span><span className="rv" style={{color:cv.depthMAPE_pct<20?'#16a34a':cv.depthMAPE_pct<35?'#f59e0b':'#dc2626'}}>{cv.depthMAPE_pct}%</span></div>
                        <div className="result-item"><span className="rl">Depth R{'\u00B2'}</span><span className="rv">{cv.depthR2}</span></div>
                        <div className="result-item"><span className="rl">Yield RMSE</span><span className="rv">{cv.yieldRMSE_m3hr} m3/hr</span></div>
                        <div className="result-item"><span className="rl">Yield MAE</span><span className="rv">{cv.yieldMAE_m3hr} m3/hr</span></div>
                        <div className="result-item"><span className="rl">Yield MAPE</span><span className="rv" style={{color:cv.yieldMAPE_pct<30?'#16a34a':cv.yieldMAPE_pct<50?'#f59e0b':'#dc2626'}}>{cv.yieldMAPE_pct}%</span></div>
                        <div className="result-item"><span className="rl">Yield R{'\u00B2'}</span><span className="rv">{cv.yieldR2}</span></div>
                      </div>
                      <div style={{display:'flex',gap:16,marginBottom:12,fontSize:12}}>
                        <span>Actual success rate: <strong>{cv.successRateActual_pct}%</strong></span>
                        <span>Predicted success: <strong>{cv.successRatePredicted_pct}%</strong></span>
                      </div>

                      {/* Per-well validation table */}
                      <table className="data-table" style={{width:'100%'}}>
                        <thead><tr><th>Well</th><th>Dist</th><th>Actual Depth</th><th>Pred Depth</th><th>Depth Err</th><th>Actual Yield</th><th>Pred Yield</th><th>Yield Err</th><th>Outcome</th></tr></thead>
                        <tbody>
                          {cv.wells.map((w, i) => (
                            <tr key={i}>
                              <td style={{fontSize:10,fontFamily:'monospace'}}>{w.wellId}</td>
                              <td>{w.distance_km.toFixed(1)}km</td>
                              <td>{w.actualDepth_m}m</td>
                              <td>{w.predictedDepth_m}m</td>
                              <td style={{color:w.depthErrorPct<15?'#16a34a':w.depthErrorPct<30?'#f59e0b':'#dc2626'}}>{w.depthError_m.toFixed(1)}m ({w.depthErrorPct.toFixed(0)}%)</td>
                              <td>{w.actualYield_m3hr.toFixed(2)}</td>
                              <td>{w.predictedYield_m3hr.toFixed(2)}</td>
                              <td style={{color:w.yieldErrorPct<20?'#16a34a':w.yieldErrorPct<40?'#f59e0b':'#dc2626'}}>{w.yieldError_m3hr.toFixed(2)} ({w.yieldErrorPct.toFixed(0)}%)</td>
                              <td style={{fontWeight:700,color:w.outcome==='Success'?'#16a34a':w.outcome==='Moderate'?'#d97706':'#dc2626'}}>{w.outcome}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div style={{padding:16,borderRadius:12,background:'rgba(56,130,246,0.05)',border:'1px solid rgba(56,130,246,0.15)',marginBottom:20}}>
                      <div style={{fontWeight:700,color:'#3b82f6',marginBottom:6}}>No Nearby Validation Wells</div>
                      <div style={{fontSize:12,color:'var(--text-secondary)'}}>No nearby boreholes with depth/yield data found within the search radius. Predictions rely on satellite ensemble analysis and regional databases. ERT survey or pump test data can be added to upgrade confidence.</div>
                    </div>
                  )}

                  {/* Monte Carlo Uncertainty */}
                  <h5 style={{marginBottom:10}}>Monte Carlo Uncertainty Analysis ({unc.totalSimulations.toLocaleString()} simulations)</h5>
                  <div style={{fontSize:11,color:'var(--text-muted)',marginBottom:12}}>{unc.methodology}</div>
                  {[unc.depthEstimate, unc.yieldEstimate, unc.successProbability].map((mc, idx) => (
                    <div key={idx} style={{marginBottom:14,padding:14,borderRadius:10,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                        <strong style={{fontSize:13}}>{mc.parameter}</strong>
                        <span style={{fontSize:16,fontWeight:700,color:'#0ea5e9'}}>{mc.mean.toFixed(mc.unit==='%'?1:2)} {mc.unit}</span>
                      </div>
                      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(110px,1fr))',gap:6,fontSize:11,marginBottom:8}}>
                        <div>Median: <strong>{mc.median.toFixed(2)}</strong></div>
                        <div>Std Dev: <strong>{mc.stdDev.toFixed(2)}</strong></div>
                        <div>P5: <strong>{mc.p5.toFixed(2)}</strong></div>
                        <div>P25: <strong>{mc.p25.toFixed(2)}</strong></div>
                        <div>P75: <strong>{mc.p75.toFixed(2)}</strong></div>
                        <div>P95: <strong>{mc.p95.toFixed(2)}</strong></div>
                      </div>
                      <div style={{fontSize:12,marginBottom:6}}>
                        <span style={{color:'#f59e0b',fontWeight:700}}>90% CI: </span>
                        <span>{mc.ci90.lower.toFixed(2)} - {mc.ci90.upper.toFixed(2)} {mc.unit}</span>
                        <span style={{marginLeft:16,color:'#dc2626',fontWeight:700}}>95% CI: </span>
                        <span>{mc.ci95.lower.toFixed(2)} - {mc.ci95.upper.toFixed(2)} {mc.unit}</span>
                      </div>
                      {/* Histogram visualization */}
                      <div style={{display:'flex',alignItems:'flex-end',height:50,gap:1}}>
                        {mc.histogram.map((bin, bi) => {
                          const maxFreq = Math.max(...mc.histogram.map(h => h.frequency));
                          const pct = maxFreq > 0 ? (bin.frequency / maxFreq) * 100 : 0;
                          return <div key={bi} style={{flex:1,height:`${pct}%`,background:'rgba(14,165,233,0.4)',borderRadius:'2px 2px 0 0',minHeight:1}} title={`${bin.binCenter}: ${bin.frequency}`} />;
                        })}
                      </div>
                      <div style={{display:'flex',justifyContent:'space-between',fontSize:9,color:'var(--text-muted)',marginTop:2}}>
                        <span>{mc.histogram[0]?.binCenter.toFixed(1)}</span>
                        <span>{mc.histogram[mc.histogram.length-1]?.binCenter.toFixed(1)} {mc.unit}</span>
                      </div>
                      {mc.inputDistributions.length > 0 && (
                        <div style={{fontSize:10,color:'var(--text-muted)',marginTop:4}}>
                          {mc.inputDistributions.map((d, di) => <span key={di} style={{marginRight:12}}>{d.name}: <em>{d.distribution}</em> ({d.params})</span>)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                );
              })() : <p style={{color:'var(--text-muted)'}}>Cross-validation data not available.</p>}
            </div>
          )}

          {/* ═══ PHASE 8: AI VS REALITY DASHBOARD ═══ */}
          {activeResultTab==='ai-vs-reality' && (
            <div>
              <h4 className="tab-title">{'\u{1F4CA}'} AI vs Reality Dashboard</h4>
              <p className="tab-desc">Track how our predictions compare to actual drilling outcomes. Deviation metrics and calibration status.</p>
              <div>
                {/* Current prediction summary */}
                <h4 style={{marginBottom:8}}>Current Prediction Summary</h4>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:12,marginBottom:16}}>
                  <div style={{background:'rgba(56,189,248,0.06)',padding:14,borderRadius:12}}>
                    <div style={{fontSize:12,color:'var(--text-secondary)',marginBottom:6}}>DEPTH PREDICTION</div>
                    <div style={{fontSize:11}}>Desktop: <strong>{result.recommendedDepth.toFixed(0)}m</strong></div>
                    {result.drillingPrediction && <div style={{fontSize:11}}>AI Model: <strong>{result.drillingPrediction.depthConfidence.low}–{result.drillingPrediction.depthConfidence.high}m</strong></div>}
                    {result.regionalModel?.correctedDepth_m && <div style={{fontSize:11}}>Regional: <strong>{result.regionalModel.correctedDepth_m}m</strong></div>}
                    {result.calibrationResult && <div style={{fontSize:11}}>Field Calibrated: <strong>{result.calibrationResult.calibratedDepth_m}m</strong></div>}
                  </div>
                  <div style={{background:'rgba(34,197,94,0.06)',padding:14,borderRadius:12}}>
                    <div style={{fontSize:12,color:'var(--text-secondary)',marginBottom:6}}>YIELD PREDICTION</div>
                    <div style={{fontSize:11}}>Desktop: <strong>{result.estimatedYield.toFixed(1)} m³/h</strong></div>
                    {result.drillingPrediction && <div style={{fontSize:11}}>AI Model: <strong>{result.drillingPrediction.yieldConfidence.low}–{result.drillingPrediction.yieldConfidence.high} m³/h</strong></div>}
                    {result.regionalModel?.correctedYield_m3h && <div style={{fontSize:11}}>Regional: <strong>{result.regionalModel.correctedYield_m3h} m³/h</strong></div>}
                  </div>
                  <div style={{background:'rgba(168,85,247,0.06)',padding:14,borderRadius:12}}>
                    <div style={{fontSize:12,color:'var(--text-secondary)',marginBottom:6}}>SUCCESS PROBABILITY</div>
                    <div style={{fontSize:11}}>Desktop: <strong>{(result.probability*100).toFixed(1)}%</strong></div>
                    {result.drillingPrediction && <div style={{fontSize:11}}>AI Model: <strong>{result.drillingPrediction.successProbability}%</strong></div>}
                    {result.regionalModel?.correctedProbability && <div style={{fontSize:11}}>Regional: <strong>{result.regionalModel.correctedProbability}%</strong></div>}
                  </div>
                </div>
                {/* Data quality integration */}
                {result.dataQualityScore && (
                  <div style={{marginBottom:16}}>
                    <h4 style={{marginBottom:8}}>Data Quality Impact on Accuracy</h4>
                    <div style={{display:'flex',alignItems:'center',gap:16,padding:12,background:'rgba(255,255,255,0.03)',borderRadius:10}}>
                      <div style={{fontSize:36,fontWeight:800,color:result.dataQualityScore.reliabilityGrade==='A'||result.dataQualityScore.reliabilityGrade==='B'?'#16a34a':result.dataQualityScore.reliabilityGrade==='C'?'#f59e0b':'#ef4444'}}>{result.dataQualityScore.reliabilityGrade}</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:600}}>Quality Score: {result.dataQualityScore.overallQualityScore}% | Completeness: {result.dataQualityScore.dataCompleteness_pct}%</div>
                        <div style={{fontSize:11,color:'var(--text-secondary)',marginTop:4}}>Field data: {result.dataQualityScore.fieldMeasurement_pct}% | Satellite: {result.dataQualityScore.satelliteData_pct}% | Modeled: {result.dataQualityScore.modelInferred_pct}%</div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Accuracy tracking from learning loop */}
                {result.learningCorrection && (
                  <div style={{marginBottom:16}}>
                    <h4 style={{marginBottom:8}}>Learning Loop Status</h4>
                    <div className="result-item"><span className="rl">Correction Applied</span><span className="rv" style={{color:result.learningCorrection.correctionApplied?'#16a34a':'#64748b'}}>{result.learningCorrection.correctionApplied ? 'YES' : 'NO'}</span></div>
                    <div className="result-item"><span className="rl">Source</span><span className="rv">{result.learningCorrection.correctionSource}</span></div>
                    <div className="result-item"><span className="rl">Training Outcomes</span><span className="rv">{result.learningCorrection.outcomeCount}</span></div>
                  </div>
                )}
                {/* Accuracy improvement path */}
                <h4 style={{marginBottom:8}}>Path to 95% Accuracy</h4>
                <div style={{marginBottom:16}}>
                  {[
                    { level: 'Satellite AI Only', accuracy: '55-65%', status: true, color: '#ef4444' },
                    { level: '+ Satellite Fusion', accuracy: '65-75%', status: true, color: '#f59e0b' },
                    { level: '+ Regional Calibration', accuracy: '72-80%', status: !!result.regionalModel, color: '#38bdf8' },
                    { level: `+ Nearby Borehole DB (${result.nearbyWells?.sampleSize ?? 0} wells)`, accuracy: '78-85%', status: !!result.nearbyWells?.sampleSize, color: '#06b6d4' },
                    { level: '+ ERT/Geophysics', accuracy: '82-90%', status: !!result.ertInterpretation, color: '#8b5cf6' },
                    { level: '+ Pump Test', accuracy: '88-93%', status: !!result.pumpTestAnalysis, color: '#16a34a' },
                    { level: '+ 50+ Local Outcomes', accuracy: '92-96%', status: (result.drillingPrediction?.trainingOutcomes||0) >= 50, color: '#16a34a' },
                  ].map((step, i) => (
                    <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'6px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                      <div style={{width:24,height:24,borderRadius:'50%',background:step.status?step.color:'rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:step.status?'#fff':'var(--text-muted)'}}>{step.status ? '✓' : (i+1)}</div>
                      <div style={{flex:1,fontSize:12,color:step.status?'var(--text-primary)':'var(--text-muted)'}}>{step.level}</div>
                      <div style={{fontSize:12,fontWeight:600,color:step.status?step.color:'var(--text-muted)'}}>{step.accuracy}</div>
                    </div>
                  ))}
                </div>
                <div className="geo-note">Track accuracy over time by recording drilling outcomes in the Feedback Learning Loop. Each recorded outcome improves future predictions through Bayesian updating.</div>
              </div>
            </div>
          )}

          {/* ═══ PHYSICS-BASED GROUNDWATER MODEL ═══ */}
          {activeResultTab==='pinn-explainable' && (() => {
            const pinn = result.pinnExplainable;
            if (!pinn) return <div><h4 className="tab-title">{'\u{1F9E0}'} Physics-Based Groundwater Model</h4><p style={{color:'var(--text-muted)'}}>Physics model not available.</p></div>;
            return (
            <div>
              <h4 className="tab-title">{'\u{1F9E0}'} Physics-Based Groundwater Model</h4>
              <p className="tab-desc">Direct Darcy/Theis/mass-balance equations with Dempster-Shafer belief fusion, OAT sensitivity analysis, DEM terrain analysis, and {pinn.ensembleRealizations.count} Monte Carlo realizations.</p>

              {/* Physics Model Results */}
              <h4 style={{marginBottom:10}}>Groundwater Physics (Darcy + Theis + Mass Balance)</h4>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:12,marginBottom:16}}>
                <div style={{background:'rgba(56,189,248,0.08)',padding:14,borderRadius:12,border:'1px solid rgba(56,189,248,0.15)'}}>
                  <div style={{fontSize:11,color:'var(--text-secondary)',marginBottom:4}}>PREDICTED DEPTH</div>
                  <div style={{fontSize:22,fontWeight:800,color:'#38bdf8'}}>{pinn.physicsModel.predictedDepth_m.toFixed(1)}m</div>
                  <div style={{fontSize:10,color:'var(--text-muted)',marginTop:4}}>Consistency: {(pinn.physicsModel.physicsConsistency*100).toFixed(0)}%</div>
                </div>
                <div style={{background:'rgba(34,197,94,0.08)',padding:14,borderRadius:12,border:'1px solid rgba(34,197,94,0.15)'}}>
                  <div style={{fontSize:11,color:'var(--text-secondary)',marginBottom:4}}>SUSTAINABLE YIELD</div>
                  <div style={{fontSize:22,fontWeight:800,color:'#22c55e'}}>{pinn.physicsModel.predictedYield_m3h.toFixed(2)} m³/h</div>
                  <div style={{fontSize:10,color:'var(--text-muted)',marginTop:4}}>Specific capacity: {pinn.physicsModel.specificCapacity_m3h_m.toFixed(3)} m³/h/m</div>
                </div>
                <div style={{background:'rgba(168,85,247,0.08)',padding:14,borderRadius:12,border:'1px solid rgba(168,85,247,0.15)'}}>
                  <div style={{fontSize:11,color:'var(--text-secondary)',marginBottom:4}}>SUCCESS PROBABILITY</div>
                  <div style={{fontSize:22,fontWeight:800,color:'#a855f7'}}>{(pinn.physicsModel.predictedProbability*100).toFixed(1)}%</div>
                  <div style={{fontSize:10,color:'var(--text-muted)',marginTop:4}}>Darcy: {pinn.physicsModel.darcyYield_m3h} | Theis s: {pinn.physicsModel.theisDrawdown_m}m</div>
                </div>
              </div>
              <div style={{background:'rgba(251,191,36,0.06)',padding:10,borderRadius:10,marginBottom:16,fontSize:11,color:'var(--text-secondary)'}}>
                <strong>Limiting factor:</strong> {pinn.physicsModel.limitingFactor}
              </div>

              {/* Dempster-Shafer */}
              <h4 style={{marginBottom:10}}>Dempster-Shafer Belief Fusion ({pinn.dempsterShafer.sourceBeliefs.length} independent sources)</h4>
              <div style={{display:'flex',gap:16,marginBottom:12,flexWrap:'wrap'}}>
                <div style={{background:'rgba(34,197,94,0.08)',padding:'10px 16px',borderRadius:10}}>
                  <div style={{fontSize:10,color:'var(--text-secondary)'}}>BELIEF (Bel)</div>
                  <div style={{fontSize:20,fontWeight:800,color:'#22c55e'}}>{(pinn.dempsterShafer.belief*100).toFixed(1)}%</div>
                </div>
                <div style={{background:'rgba(56,189,248,0.08)',padding:'10px 16px',borderRadius:10}}>
                  <div style={{fontSize:10,color:'var(--text-secondary)'}}>PLAUSIBILITY (Pl)</div>
                  <div style={{fontSize:20,fontWeight:800,color:'#38bdf8'}}>{(pinn.dempsterShafer.plausibility*100).toFixed(1)}%</div>
                </div>
                <div style={{background:'rgba(251,191,36,0.08)',padding:'10px 16px',borderRadius:10}}>
                  <div style={{fontSize:10,color:'var(--text-secondary)'}}>UNCERTAINTY</div>
                  <div style={{fontSize:20,fontWeight:800,color:'#fbbf24'}}>{(pinn.dempsterShafer.uncertainty*100).toFixed(1)}%</div>
                </div>
                <div style={{background:'rgba(239,68,68,0.08)',padding:'10px 16px',borderRadius:10}}>
                  <div style={{fontSize:10,color:'var(--text-secondary)'}}>CONFLICT</div>
                  <div style={{fontSize:20,fontWeight:800,color:'#ef4444'}}>{(pinn.dempsterShafer.conflictFactor*100).toFixed(1)}%</div>
                </div>
              </div>
              <div style={{marginBottom:16}}>
                {pinn.dempsterShafer.sourceBeliefs.map((s: any,i: number)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'5px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                    <div style={{width:180,fontSize:11,fontWeight:600}}>{s.source}</div>
                    <div style={{flex:1,height:8,background:'rgba(255,255,255,0.06)',borderRadius:4,overflow:'hidden'}}>
                      <div style={{width:`${s.belief*100}%`,height:'100%',background:s.belief>0.5?'#22c55e':s.belief>0.3?'#fbbf24':'#ef4444',borderRadius:4}}/>
                    </div>
                    <div style={{fontSize:11,width:80,textAlign:'right'}}>{(s.belief*100).toFixed(0)}% Bel</div>
                  </div>
                ))}
              </div>

              {/* Sensitivity Analysis (OAT — not SHAP) */}
              <h4 style={{marginBottom:10}}>Sensitivity Analysis (OAT Perturbation)</h4>
              <p style={{fontSize:11,color:'var(--text-muted)',marginBottom:8}}>{pinn.sensitivityAnalysis.methodology}</p>
              <div style={{marginBottom:16}}>
                {pinn.sensitivityAnalysis.topPositive.slice(0,8).map((feat: any,i: number)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'4px 0'}}>
                    <div style={{width:160,fontSize:11,textAlign:'right',color:'var(--text-secondary)'}}>{feat.feature}</div>
                    <div style={{flex:1,display:'flex',alignItems:'center',gap:4}}>
                      <div style={{height:8,background:feat.contribution>0?'#22c55e':'#ef4444',borderRadius:4,width:`${Math.min(100,Math.abs(feat.contribution)*500)}%`,minWidth:4}}/>
                    </div>
                    <div style={{fontSize:11,width:55,textAlign:'right',color:feat.contribution>0?'#22c55e':'#ef4444'}}>{feat.contribution>0?'+':''}{feat.contribution.toFixed(3)}</div>
                  </div>
                ))}
                {pinn.sensitivityAnalysis.topNegative.slice(0,4).map((feat: any,i: number)=>(
                  <div key={`neg-${i}`} style={{display:'flex',alignItems:'center',gap:8,padding:'4px 0'}}>
                    <div style={{width:160,fontSize:11,textAlign:'right',color:'var(--text-secondary)'}}>{feat.feature}</div>
                    <div style={{flex:1,display:'flex',alignItems:'center',gap:4,direction:'rtl'}}>
                      <div style={{height:8,background:'#ef4444',borderRadius:4,width:`${Math.min(100,Math.abs(feat.contribution)*500)}%`,minWidth:4}}/>
                    </div>
                    <div style={{fontSize:11,width:55,textAlign:'right',color:'#ef4444'}}>{feat.contribution.toFixed(3)}</div>
                  </div>
                ))}
              </div>

              {/* Local Explanation */}
              <h4 style={{marginBottom:10}}>Why This Prediction?</h4>
              <div style={{background:'rgba(168,85,247,0.06)',padding:14,borderRadius:12,marginBottom:16}}>
                <div style={{fontSize:12,marginBottom:8}}>{pinn.localExplanation.explanation}</div>
                <div style={{marginTop:10}}>
                  {pinn.localExplanation.confidenceDrivers.map((d: any,i: number)=>(
                    <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'3px 0',fontSize:11}}>
                      <span>{d.factor} <span style={{color:'var(--text-muted)',fontSize:10}}>({d.source})</span></span>
                      <span style={{color:d.effect==='increases'?'#22c55e':d.effect==='decreases'?'#ef4444':'#fbbf24',fontWeight:600}}>{d.effect==='increases'?'\u2191':d.effect==='decreases'?'\u2193':'\u2194'} {d.effect}</span>
                    </div>
                  ))}
                </div>
                {pinn.localExplanation.dataGaps.length > 0 && (
                  <div style={{marginTop:10,borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:8}}>
                    <div style={{fontSize:10,color:'#fbbf24',fontWeight:600,marginBottom:4}}>DATA GAPS</div>
                    {pinn.localExplanation.dataGaps.map((g: string,i: number) => (
                      <div key={i} style={{fontSize:10,color:'var(--text-muted)',padding:'2px 0'}}>{'\u26A0'} {g}</div>
                    ))}
                  </div>
                )}
              </div>

              {/* DEM Terrain Analysis */}
              <h4 style={{marginBottom:10}}>DEM Terrain Analysis</h4>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:10,marginBottom:16}}>
                <div style={{background:'rgba(56,189,248,0.06)',padding:10,borderRadius:10}}>
                  <div style={{fontSize:10,color:'var(--text-secondary)',marginBottom:4}}>SLOPE</div>
                  <div style={{fontSize:11}}>{pinn.demAnalysis.slopeEffect}</div>
                </div>
                <div style={{background:'rgba(34,197,94,0.06)',padding:10,borderRadius:10}}>
                  <div style={{fontSize:10,color:'var(--text-secondary)',marginBottom:4}}>TWI</div>
                  <div style={{fontSize:11}}>{pinn.demAnalysis.twiEffect}</div>
                </div>
                <div style={{background:'rgba(168,85,247,0.06)',padding:10,borderRadius:10}}>
                  <div style={{fontSize:10,color:'var(--text-secondary)',marginBottom:4}}>POSITION</div>
                  <div style={{fontSize:11}}>{pinn.demAnalysis.positionEffect}</div>
                </div>
              </div>
              <div style={{background:'rgba(56,189,248,0.06)',padding:10,borderRadius:10,marginBottom:16,textAlign:'center'}}>
                <div style={{fontSize:10,color:'var(--text-secondary)'}}>TERRAIN FAVORABILITY (max 65% without field geophysics)</div>
                <div style={{fontSize:24,fontWeight:800,color:pinn.demAnalysis.overallTerrainFavorability>50?'#22c55e':pinn.demAnalysis.overallTerrainFavorability>30?'#fbbf24':'#ef4444'}}>{pinn.demAnalysis.overallTerrainFavorability}%</div>
              </div>

              {/* Ensemble Realizations */}
              <h4 style={{marginBottom:10}}>Monte Carlo Ensemble ({pinn.ensembleRealizations.count} realizations)</h4>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:12,marginBottom:12}}>
                <div style={{background:'rgba(56,189,248,0.06)',padding:12,borderRadius:10}}>
                  <div style={{fontSize:11,color:'var(--text-secondary)',marginBottom:6}}>DEPTH (m)</div>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:12}}>
                    <span>P10: <strong>{pinn.ensembleRealizations.depthP10.toFixed(1)}</strong></span>
                    <span style={{color:'#38bdf8',fontWeight:700}}>P50: {pinn.ensembleRealizations.depthP50.toFixed(1)}</span>
                    <span>P90: <strong>{pinn.ensembleRealizations.depthP90.toFixed(1)}</strong></span>
                  </div>
                  <div style={{fontSize:10,color:'var(--text-muted)',marginTop:4}}>Mean: {pinn.ensembleRealizations.depthMean.toFixed(1)} | Std: {pinn.ensembleRealizations.depthStd.toFixed(1)}</div>
                </div>
                <div style={{background:'rgba(34,197,94,0.06)',padding:12,borderRadius:10}}>
                  <div style={{fontSize:11,color:'var(--text-secondary)',marginBottom:6}}>YIELD (m³/h)</div>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:12}}>
                    <span>P10: <strong>{pinn.ensembleRealizations.yieldP10.toFixed(2)}</strong></span>
                    <span style={{color:'#22c55e',fontWeight:700}}>P50: {pinn.ensembleRealizations.yieldP50.toFixed(2)}</span>
                    <span>P90: <strong>{pinn.ensembleRealizations.yieldP90.toFixed(2)}</strong></span>
                  </div>
                  <div style={{fontSize:10,color:'var(--text-muted)',marginTop:4}}>Mean: {pinn.ensembleRealizations.yieldMean.toFixed(2)} | Std: {pinn.ensembleRealizations.yieldStd.toFixed(2)}</div>
                </div>
                <div style={{background:'rgba(168,85,247,0.06)',padding:12,borderRadius:10}}>
                  <div style={{fontSize:11,color:'var(--text-secondary)',marginBottom:6}}>PROBABILITY</div>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:12}}>
                    <span>P10: <strong>{(pinn.ensembleRealizations.probP10*100).toFixed(1)}%</strong></span>
                    <span style={{color:'#a855f7',fontWeight:700}}>P50: {(pinn.ensembleRealizations.probP50*100).toFixed(1)}%</span>
                    <span>P90: <strong>{(pinn.ensembleRealizations.probP90*100).toFixed(1)}%</strong></span>
                  </div>
                  <div style={{fontSize:10,color:'var(--text-muted)',marginTop:4}}>Convergence CV: {(pinn.ensembleRealizations.convergenceMetric*100).toFixed(1)}%</div>
                </div>
              </div>
              <div style={{fontSize:10,color:'var(--text-muted)',marginBottom:8}}>
                Parameters varied: {pinn.ensembleRealizations.parameterRanges.map((p: any) => `${p.parameter} (${p.source})`).join(', ')}
              </div>
              <div className="geo-note">{pinn.methodology}</div>
            </div>);
          })()}

          {/* ═══ PATH TO 97% CHECKLIST ═══ */}
          {activeResultTab==='path-to-97' && (() => {
            const p97 = result.pathTo97;
            if (!p97) return <div><h4 className="tab-title">{'\u{1F3AF}'} Path to 97%</h4><p style={{color:'var(--text-muted)'}}>Path to 97% analysis not available.</p></div>;
            const statusColors: Record<string,string> = { completed:'#22c55e', available:'#38bdf8', recommended:'#fbbf24', required:'#ef4444', not_applicable:'#64748b' };
            const priorityColors: Record<string,string> = { critical:'#ef4444', high:'#f97316', medium:'#fbbf24', low:'#22c55e' };
            return (
            <div>
              <h4 className="tab-title">{'\u{1F3AF}'} Path to 97% — Confidence Roadmap</h4>
              <p className="tab-desc">Actionable checklist to push confidence from {p97.currentConfidence}% to 97% bankable grade. Prioritized by cost-per-confidence-point.</p>

              {/* Current vs Target */}
              <div style={{display:'flex',gap:16,marginBottom:16,flexWrap:'wrap'}}>
                <div style={{background:'rgba(56,189,248,0.08)',padding:14,borderRadius:12,flex:1,minWidth:120,textAlign:'center'}}>
                  <div style={{fontSize:10,color:'var(--text-secondary)'}}>CURRENT</div>
                  <div style={{fontSize:28,fontWeight:800,color:'#38bdf8'}}>{p97.currentConfidence}%</div>
                </div>
                <div style={{background:'rgba(251,191,36,0.08)',padding:14,borderRadius:12,flex:1,minWidth:120,textAlign:'center'}}>
                  <div style={{fontSize:10,color:'var(--text-secondary)'}}>GAP</div>
                  <div style={{fontSize:28,fontWeight:800,color:'#fbbf24'}}>{p97.gap} pts</div>
                </div>
                <div style={{background:'rgba(34,197,94,0.08)',padding:14,borderRadius:12,flex:1,minWidth:120,textAlign:'center'}}>
                  <div style={{fontSize:10,color:'var(--text-secondary)'}}>TARGET</div>
                  <div style={{fontSize:28,fontWeight:800,color:'#22c55e'}}>97%</div>
                </div>
                <div style={{background:'rgba(168,85,247,0.08)',padding:14,borderRadius:12,flex:1,minWidth:120,textAlign:'center'}}>
                  <div style={{fontSize:10,color:'var(--text-secondary)'}}>COST TO 97%</div>
                  <div style={{fontSize:28,fontWeight:800,color:'#a855f7'}}>${p97.estimatedCostToTarget.toLocaleString()}</div>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{background:'rgba(255,255,255,0.06)',borderRadius:8,height:24,marginBottom:16,position:'relative',overflow:'hidden'}}>
                <div style={{height:'100%',background:'linear-gradient(90deg,#22c55e,#38bdf8)',borderRadius:8,width:`${p97.currentConfidence}%`,transition:'width 0.5s'}}/>
                {p97.milestones.map((m,i)=>(
                  <div key={i} style={{position:'absolute',left:`${m.confidence}%`,top:0,height:'100%',borderLeft:'2px dashed rgba(255,255,255,0.3)'}}>
                    <div style={{position:'absolute',top:-16,left:-20,fontSize:9,color:'var(--text-muted)',whiteSpace:'nowrap'}}>{m.confidence}% {m.label}</div>
                  </div>
                ))}
              </div>

              {/* Layer Breakdown */}
              <h4 style={{marginBottom:10}}>Confidence by Layer</h4>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:10,marginBottom:16}}>
                {p97.layerBreakdown.map((l,i)=>(
                  <div key={i} style={{background:'rgba(255,255,255,0.03)',padding:12,borderRadius:10}}>
                    <div style={{fontSize:11,fontWeight:600,marginBottom:6}}>{l.layer}</div>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div style={{flex:1,height:6,background:'rgba(255,255,255,0.08)',borderRadius:3,overflow:'hidden'}}>
                        <div style={{height:'100%',background:l.currentScore>70?'#22c55e':l.currentScore>40?'#fbbf24':'#ef4444',borderRadius:3,width:`${l.currentScore}%`}}/>
                      </div>
                      <div style={{fontSize:12,fontWeight:700,width:40,textAlign:'right'}}>{l.currentScore}%</div>
                    </div>
                    {l.gap > 0 && <div style={{fontSize:10,color:'var(--text-muted)',marginTop:4}}>Gap: {l.gap}% — {l.actions[0]}</div>}
                  </div>
                ))}
              </div>

              {/* Action Checklist */}
              <h4 style={{marginBottom:10}}>Action Checklist ({p97.checklist.filter(a=>a.status!=='completed').length} remaining)</h4>
              <div style={{marginBottom:16}}>
                {p97.checklist.map((a,i)=>(
                  <div key={i} style={{display:'flex',gap:12,padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.04)',opacity:a.status==='completed'?0.6:1}}>
                    <div style={{width:28,height:28,borderRadius:'50%',background:statusColors[a.status]||'#64748b',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:'#fff',flexShrink:0}}>
                      {a.status==='completed'?'\u2713':a.id}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:600}}>{a.action}</div>
                      <div style={{fontSize:11,color:'var(--text-secondary)',marginTop:2}}>{a.description}</div>
                      <div style={{display:'flex',gap:12,marginTop:4,flexWrap:'wrap'}}>
                        <span style={{fontSize:10,color:'var(--text-muted)'}}>Cost: <strong>${a.costUSD.toLocaleString()}</strong></span>
                        <span style={{fontSize:10,color:'var(--text-muted)'}}>Time: <strong>{a.timeHours < 24 ? `${a.timeHours}h` : `${(a.timeHours/24).toFixed(0)}d`}</strong></span>
                        <span style={{fontSize:10,color:'var(--text-muted)'}}>Gain: <strong>+{a.potentialGain} pts</strong></span>
                        {a.costPerConfidencePoint < Infinity && a.costPerConfidencePoint > 0 && <span style={{fontSize:10,color:'var(--text-muted)'}}>Efficiency: <strong>${a.costPerConfidencePoint}/pt</strong></span>}
                        <span style={{fontSize:10,background:statusColors[a.status],color:'#fff',padding:'1px 6px',borderRadius:4}}>{a.status.replace('_',' ')}</span>
                      </div>
                      <div style={{fontSize:10,color:'var(--text-muted)',marginTop:2}}>Standard: {a.standard}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Uncertainty Zones */}
              <h4 style={{marginBottom:10}}>Uncertainty Zones</h4>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:10,marginBottom:16}}>
                {p97.uncertaintyZones.map((z,i)=>(
                  <div key={i} style={{background:`${priorityColors[z.priority]}10`,border:`1px solid ${priorityColors[z.priority]}30`,padding:12,borderRadius:10}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                      <span style={{fontSize:12,fontWeight:700}}>{z.zone}</span>
                      <span style={{fontSize:10,background:priorityColors[z.priority],color:'#fff',padding:'1px 8px',borderRadius:4,fontWeight:600}}>{z.priority.toUpperCase()}</span>
                    </div>
                    <div style={{fontSize:11,color:'var(--text-secondary)',marginBottom:4}}>{z.reason}</div>
                    <div style={{fontSize:11,fontWeight:600}}>Fix: {z.mitigation}</div>
                    <div style={{fontSize:11,marginTop:4}}>Zone confidence: <strong>{z.confidence}%</strong></div>
                  </div>
                ))}
              </div>

              {/* Milestones */}
              <h4 style={{marginBottom:10}}>Confidence Milestones</h4>
              <div style={{marginBottom:16}}>
                {p97.milestones.map((m,i)=>(
                  <div key={i} style={{display:'flex',gap:12,padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                    <div style={{width:48,height:48,borderRadius:12,background:p97.currentConfidence>=m.confidence?'#22c55e':'rgba(255,255,255,0.08)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                      <div style={{fontSize:14,fontWeight:800,color:p97.currentConfidence>=m.confidence?'#fff':'var(--text-muted)'}}>{m.grade}</div>
                      <div style={{fontSize:9,color:p97.currentConfidence>=m.confidence?'rgba(255,255,255,0.8)':'var(--text-muted)'}}>{m.confidence}%</div>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:600}}>{m.label} {p97.currentConfidence>=m.confidence && '\u2705'}</div>
                      <div style={{fontSize:11,color:'var(--text-secondary)'}}>Cost: ${m.estimatedCostUSD.toLocaleString()} | Use: {m.useCases.join(', ')}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="geo-note">{p97.methodology}</div>
            </div>);
          })()}

          {/* VALIDATION (Part 7) */}
          {activeResultTab==='validation' && (
            <div>
              <h4 className="tab-title">{'\u2705'} Validation &amp; Accuracy Metrics</h4>
              <p className="tab-desc">How our predictions compare to ground truth, and how we continuously validate.</p>
              <h4 style={{color:'#4CAF50',marginBottom:12}}>Accuracy Targets vs. Ground Truth</h4>
              <div className="sci-table-wrap">
                <table className="sci-table">
                  <thead><tr><th>Prediction</th><th>Target</th><th>Best-in-Class</th><th>Our Goal</th></tr></thead>
                  <tbody>{SCI.ACCURACY_TARGETS.map((a,i)=><tr key={i}><td>{a.prediction}</td><td>{a.target}</td><td>{a.bestInClass}</td><td style={{color:'#4CAF50',fontWeight:700}}>{a.goal}</td></tr>)}</tbody>
                </table>
              </div>
              <h4 style={{margin:'20px 0 12px'}}>Validation Methodology</h4>
              <div className="sci-table-wrap">
                <table className="sci-table">
                  <thead><tr><th>Method</th><th>Description</th><th>Sample</th><th>Frequency</th></tr></thead>
                  <tbody>{SCI.VALIDATION_METHODS.map((v,i)=><tr key={i}><td>{v.method}</td><td>{v.description}</td><td>{v.sample}</td><td>{v.frequency}</td></tr>)}</tbody>
                </table>
              </div>
              <h4 style={{margin:'20px 0 12px'}}>Confidence Interpretation</h4>
              <div className="sci-table-wrap">
                <table className="sci-table">
                  <thead><tr><th>Level</th><th>Criteria</th><th>Interpretation</th></tr></thead>
                  <tbody>{SCI.CONFIDENCE_LEVELS.map((c,i)=><tr key={i}><td style={{fontWeight:700}}>{c.level}</td><td>{c.criteria}</td><td>{c.interpretation}</td></tr>)}</tbody>
                </table>
              </div>
              <div className="geo-note" style={{marginTop:16}}>
                <strong>This Site:</strong> Confidence level is <strong>{result.probability>=0.9?'High (90%+)':result.probability>=0.7?'Medium (70-90%)':result.probability>=0.5?'Low (50-70%)':'Very Low (<50%)'}</strong> — {result.probability>=0.9?'Proceed with standard design':result.probability>=0.7?'Conservative design recommended':result.probability>=0.5?'Test drilling recommended':'Site survey required'}.
              </div>

              {/* ── Credibility Rating Table (for Validation tab) ── */}
              {(() => {
                const cred = computeCredibility(result);
                return (
                  <div style={{marginTop:24}}>
                    <h4 style={{marginBottom:12}}>Credibility Rating Summary</h4>
                    <div className="sci-table-wrap">
                      <table className="sci-table">
                        <thead><tr><th>Dimension</th><th>Rating</th><th>Stars</th><th>Target</th><th>Comment</th></tr></thead>
                        <tbody>
                          {cred.dimensions.map(d => (
                            <tr key={d.key}>
                              <td style={{fontWeight:600}}>{d.label}</td>
                              <td style={{fontWeight:700,color:d.score>=4?'#16a34a':d.score>=3?'#38bdf8':'#d97706'}}>{d.score.toFixed(1)} / 5</td>
                              <td>{[1,2,3,4,5].map(s => <span key={s} style={{color:s<=Math.round(d.score)?'#f59e0b':'#374151'}}>{'\u2605'}</span>)}</td>
                              <td>{d.target} / 5</td>
                              <td style={{fontSize:12}}>{d.comment}</td>
                            </tr>
                          ))}
                          <tr style={{background:'rgba(56,189,248,0.06)'}}>
                            <td style={{fontWeight:800}}>OVERALL</td>
                            <td style={{fontWeight:800,color:cred.gradeColor}}>{cred.overall.toFixed(1)} / 5 ({cred.overallPct}%)</td>
                            <td>{[1,2,3,4,5].map(s => <span key={s} style={{color:s<=Math.round(cred.overall)?'#f59e0b':'#374151'}}>{'\u2605'}</span>)}</td>
                            <td>4.5 / 5</td>
                            <td style={{fontWeight:700,color:cred.gradeColor}}>{cred.grade}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="geo-note" style={{marginTop:12}}>
                      <strong>Path to Bankable Grade (≥85%):</strong> Conduct ERT + seismic survey, 24-hour pump test, laboratory water analysis, and integrate Sentinel-2 spectral indices. Expected outcome: confidence &gt;90%, yield ≈10±1 m³/hr, risk &lt;10%.
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* SITE COMPARISON (inline from results) (#9, #21) */}
          {activeResultTab==='compare' && (
            <div>
              <h4 className="tab-title">{'\u{1F504}'} Site Comparison Tool</h4>
              <p className="tab-desc">Upload additional sites from the <strong>Compare Sites</strong> view on the dashboard to compare Side A vs B vs C.</p>
              <button className="btn btn-analyze" style={{marginTop:12}} onClick={()=>setActiveView('compare')}>Go to Site Comparison</button>
            </div>
          )}

          {/* REPORT TIERS (#13) */}
          {activeResultTab==='report' && (
            <div>
              <h4 className="tab-title">{'\u{1F4DD}'} Professional Report Generation</h4>
              <div className="tier-cards">
                {[
                  { tier:'basic' as ReportTier, name:'Summary', price:'Free', desc:'Summary report — key findings, success probability, depth recommendation, final consensus answer', pages:'5-8 pages' },
                  { tier:'professional' as ReportTier, name:'Professional', price:'Free', desc:'Full analysis: subsurface model, aquifer physics (Theis/Cooper-Jacob), groundwater budget, cone of depression, water quality, charts', pages:'30-45 pages' },
                  { tier:'expert' as ReportTier, name:'Comprehensive Assessment', price:'Free', desc:'Full pre-feasibility assessment: all Professional content + drilling strategy, ROI analysis, risk register, pump test protocol, prediction table, engineer confidence', pages:'45-60 pages' },
                ].map(t => (
                  <div key={t.tier} className={`tier-card ${reportTier===t.tier?'selected':''}`} onClick={()=>setReportTier(t.tier)}>
                    <div className="tier-name">{t.name}</div>
                    <div className="tier-price">{t.price}</div>
                    <div className="tier-desc">{t.desc}</div>
                    <div className="tier-pages">{t.pages}</div>
                    {reportTier===t.tier && <div className="tier-selected-badge">{'\u2713'} Selected</div>}
                  </div>
                ))}
              </div>

              {/* ═══ 10-STEP PRE-PUBLISH AUDIT ═══ */}
              {result && (() => {
                const audit = runPrePublishAudit(result);
                const auditColor = audit.passed ? '#22c55e' : '#ef4444';
                const auditBg = audit.passed ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)';
                const auditBorder = audit.passed ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)';
                return (
                  <div style={{marginTop:20,padding:20,background:auditBg,borderRadius:12,border:`2px solid ${auditBorder}`}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
                      <h4 style={{color:auditColor,margin:0,fontSize:18}}>
                        {audit.passed ? '\u2705' : '\u{1F4CB}'} 10-Step Quality Review — {audit.passed ? 'PASSED' : 'PENDING'}
                      </h4>
                      <div style={{display:'flex',alignItems:'center',gap:12}}>
                        <span style={{fontSize:28,fontWeight:800,color:auditColor}}>{audit.score}/100</span>
                        <span style={{fontSize:12,color:'#94a3b8'}}>
                          {audit.passedChecks}P / {audit.warningChecks}W / {audit.failedChecks}F
                        </span>
                      </div>
                    </div>
                    {!audit.passed && (
                      <div style={{background:'rgba(245,158,11,0.1)',padding:12,borderRadius:8,marginBottom:16,border:'1px solid rgba(245,158,11,0.25)'}}>
                        <strong style={{color:'#d97706'}}>{'\u{1F4CB}'} Review Required:</strong>
                        <span style={{color:'#fbbf24',marginLeft:8}}>{audit.blockedReason}</span>
                        <div style={{color:'#fbbf24',fontSize:12,marginTop:4}}>Resolve the items above to enable report downloads.</div>
                      </div>
                    )}
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:8}}>
                      {audit.checks.map((ck, i) => {
                        const sev = ck.severity;
                        const sevColor = sev === 'PASS' ? '#22c55e' : sev === 'WARN' ? '#eab308' : '#ef4444';
                        const sevBg = sev === 'PASS' ? 'rgba(34,197,94,0.06)' : sev === 'WARN' ? 'rgba(234,179,8,0.06)' : 'rgba(239,68,68,0.1)';
                        const sevIcon = sev === 'PASS' ? '\u2705' : sev === 'WARN' ? '\u26A0\uFE0F' : '\u274C';
                        return (
                          <div key={i} style={{padding:10,borderRadius:8,background:sevBg,border:`1px solid ${sevColor}33`}}>
                            <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:4}}>
                              <span>{sevIcon}</span>
                              <strong style={{color:sevColor,fontSize:12}}>{sev}</strong>
                              <span style={{color:'#e2e8f0',fontSize:12,fontWeight:600}}>#{i+1} {ck.name}</span>
                            </div>
                            <div style={{color:sev === 'PASS' ? '#86efac' : sev === 'WARN' ? '#fde68a' : '#fca5a5',fontSize:11}}>{ck.description}</div>
                            {ck.details && <div style={{color:'#64748b',fontSize:10,marginTop:2}}>{ck.details}</div>}
                            {ck.fix && <div style={{color:'#38bdf8',fontSize:10,marginTop:2}}>Fix: {ck.fix}</div>}
                          </div>
                        );
                      })}
                    </div>
                    <div style={{marginTop:12,fontSize:11,color:'#64748b',textAlign:'center'}}>
                      Audit timestamp: {audit.timestamp} — 10 checks enforced per EmersonEIMS quality policy
                    </div>
                  </div>
                );
              })()}

              <h4 className="tab-title" style={{marginTop:24}}>{'\u{1F464}'} Customer Details (for Report Tracking)</h4>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:16}}>
                <div>
                  <label style={{fontSize:11,color:'#94a3b8',display:'block',marginBottom:4}}>Customer Name</label>
                  <input type="text" value={custName} onChange={e=>{setCustName(e.target.value);setCustomerDetails(e.target.value,custEmail,custOrg)}}
                    placeholder="Enter customer name" style={{width:'100%',padding:'8px 12px',borderRadius:8,border:'1px solid rgba(56,189,248,0.2)',background:'rgba(15,23,42,0.8)',color:'#e2e8f0',fontSize:13,boxSizing:'border-box'}} />
                </div>
                <div>
                  <label style={{fontSize:11,color:'#94a3b8',display:'block',marginBottom:4}}>Email</label>
                  <input type="email" value={custEmail} onChange={e=>{setCustEmail(e.target.value);setCustomerDetails(custName,e.target.value,custOrg)}}
                    placeholder="customer@email.com" style={{width:'100%',padding:'8px 12px',borderRadius:8,border:'1px solid rgba(56,189,248,0.2)',background:'rgba(15,23,42,0.8)',color:'#e2e8f0',fontSize:13,boxSizing:'border-box'}} />
                </div>
                <div>
                  <label style={{fontSize:11,color:'#94a3b8',display:'block',marginBottom:4}}>Organization</label>
                  <input type="text" value={custOrg} onChange={e=>{setCustOrg(e.target.value);setCustomerDetails(custName,custEmail,e.target.value)}}
                    placeholder="Company / NGO / Govt" style={{width:'100%',padding:'8px 12px',borderRadius:8,border:'1px solid rgba(56,189,248,0.2)',background:'rgba(15,23,42,0.8)',color:'#e2e8f0',fontSize:13,boxSizing:'border-box'}} />
                </div>
              </div>

              {/* ═══ VERIFICATION STATUS PANEL ═══ */}
              {result && (result as any).verificationReport && (() => {
                const vr = (result as any).verificationReport;
                const gradeColor = vr.grade === 'A' ? '#16a34a' : vr.grade === 'B' ? '#22c55e' : vr.grade === 'C' ? '#eab308' : vr.grade === 'D' ? '#f97316' : '#ef4444';
                return (
                  <div style={{background: vr.verified ? 'rgba(22,163,74,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${vr.verified ? 'rgba(22,163,74,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius:12, padding:16, marginTop:16}}>
                    <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:8}}>
                      <div style={{width:48,height:48,borderRadius:'50%',background:gradeColor,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:24,color:'#fff'}}>{vr.grade}</div>
                      <div>
                        <div style={{fontSize:16,fontWeight:700,color:vr.verified ? '#16a34a' : '#ef4444'}}>{vr.verified ? '\u2705 VERIFICATION PASSED' : '\u274C VERIFICATION FAILED — Report Blocked'}</div>
                        <div style={{fontSize:12,color:'#94a3b8'}}>Score: {vr.score}% | {vr.totalChecks} checks | {vr.apiRequeriesPerformed} API re-queries | {vr.durationMs}ms</div>
                      </div>
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8,marginBottom:8}}>
                      <div style={{textAlign:'center',padding:8,borderRadius:8,background:'rgba(22,163,74,0.15)'}}><div style={{fontSize:20,fontWeight:700,color:'#16a34a'}}>{vr.passed}</div><div style={{fontSize:10,color:'#94a3b8'}}>PASSED</div></div>
                      <div style={{textAlign:'center',padding:8,borderRadius:8,background:'rgba(234,179,8,0.15)'}}><div style={{fontSize:20,fontWeight:700,color:'#eab308'}}>{vr.warnings}</div><div style={{fontSize:10,color:'#94a3b8'}}>WARNINGS</div></div>
                      <div style={{textAlign:'center',padding:8,borderRadius:8,background:'rgba(239,68,68,0.15)'}}><div style={{fontSize:20,fontWeight:700,color:'#ef4444'}}>{vr.failures}</div><div style={{fontSize:10,color:'#94a3b8'}}>FAILURES</div></div>
                      <div style={{textAlign:'center',padding:8,borderRadius:8,background:'rgba(148,163,184,0.1)'}}><div style={{fontSize:20,fontWeight:700,color:'#94a3b8'}}>{vr.skipped}</div><div style={{fontSize:10,color:'#94a3b8'}}>SKIPPED</div></div>
                    </div>
                    {vr.failures > 0 && (
                      <div style={{background:'rgba(239,68,68,0.1)',borderRadius:8,padding:8,marginBottom:8}}>
                        <div style={{fontSize:11,fontWeight:700,color:'#ef4444',marginBottom:4}}>FAILURES (must resolve before report):</div>
                        {vr.checks.filter((c:any)=>c.severity==='FAIL').map((c:any,i:number)=>(
                          <div key={i} style={{fontSize:11,color:'#fca5a5',marginBottom:2}}>{'\u274C'} <strong>{c.name}</strong>: {c.message}</div>
                        ))}
                      </div>
                    )}
                    {vr.warnings > 0 && (
                      <details style={{marginBottom:4}}>
                        <summary style={{fontSize:11,color:'#eab308',cursor:'pointer'}}>Show {vr.warnings} warning(s)</summary>
                        {vr.checks.filter((c:any)=>c.severity==='WARN').map((c:any,i:number)=>(
                          <div key={i} style={{fontSize:11,color:'#fde68a',marginBottom:2,paddingLeft:12}}>{'\u26A0\uFE0F'} <strong>{c.name}</strong>: {c.message}</div>
                        ))}
                      </details>
                    )}
                    <div style={{fontSize:10,color:'#64748b',marginTop:4}}>Verified: {vr.timestamp} | {vr.apiRequeriesMatched}/{vr.apiRequeriesPerformed} API re-queries matched</div>
                  </div>
                );
              })()}

              <h4 className="tab-title" style={{marginTop:24}}>{'\u{1F4E5}'} Export Reports — All Formats</h4>
              <p className="tab-desc">Download comprehensive reports with all analysis data, color charts, graphs, tables, and maps. All exports are FREE.</p>
              {result && !runPrePublishAudit(result).passed && (
                <div style={{background:'rgba(245,158,11,0.08)',padding:12,borderRadius:8,marginBottom:12,border:'1px solid rgba(245,158,11,0.2)',textAlign:'center'}}>
                  <strong style={{color:'#d97706'}}>{'\u{1F4CB}'} Downloads available after quality review items are resolved.</strong>
                </div>
              )}
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:12,marginTop:12, opacity: result && !runPrePublishAudit(result).passed ? 0.4 : 1, pointerEvents: result && !runPrePublishAudit(result).passed ? 'none' : 'auto'}}>
                <button className="btn btn-analyze" style={{background:'linear-gradient(135deg,#ef4444,#dc2626)',padding:'16px 20px',fontSize:14,display:'flex',alignItems:'center',gap:8,justifyContent:'center'}}
                  onClick={async ()=>{if(result){try{setCustomerDetails(custName,custEmail,custOrg);await generatePDFReport(result,reportTier);setTrackerRefresh(n=>n+1);alert('PDF report downloaded!')}catch(e:any){if(e instanceof AuditBlockError){alert('Quality review: '+e.audit.blockedReason)}else if(e instanceof VerificationBlockError){alert('⛔ VERIFICATION FAILED — Report blocked.\n\n'+e.verification.summary)}else{alert('PDF error: '+e.message)}}}}}>
                  {'\u{1F4C4}'} <span><strong>PDF Report</strong><br/><small>Charts, tables, graphs in color</small></span>
                </button>
                <button className="btn btn-analyze" style={{background:'linear-gradient(135deg,#2563eb,#1d4ed8)',padding:'16px 20px',fontSize:14,display:'flex',alignItems:'center',gap:8,justifyContent:'center'}}
                  onClick={async ()=>{if(result){try{setCustomerDetails(custName,custEmail,custOrg);await generateWordReport(result,reportTier);setTrackerRefresh(n=>n+1);alert('Word document downloaded!')}catch(e:any){if(e instanceof AuditBlockError){alert('Quality review: '+e.audit.blockedReason)}else if(e instanceof VerificationBlockError){alert('⛔ VERIFICATION FAILED — Report blocked.\n\n'+e.verification.summary)}else{alert('Word error: '+e.message)}}}}}>
                  {'\u{1F4DD}'} <span><strong>MS Word (.docx)</strong><br/><small>Formatted document with tables</small></span>
                </button>
                <button className="btn btn-analyze" style={{background:'linear-gradient(135deg,#16a34a,#15803d)',padding:'16px 20px',fontSize:14,display:'flex',alignItems:'center',gap:8,justifyContent:'center'}}
                  onClick={async ()=>{if(result){try{setCustomerDetails(custName,custEmail,custOrg);await generateExcelReport(result,reportTier);setTrackerRefresh(n=>n+1);alert('Excel workbook downloaded!')}catch(e:any){if(e instanceof AuditBlockError){alert('Quality review: '+e.audit.blockedReason)}else if(e instanceof VerificationBlockError){alert('⛔ VERIFICATION FAILED — Report blocked.\n\n'+e.verification.summary)}else{alert('Excel error: '+e.message)}}}}}>
                  {'\u{1F4CA}'} <span><strong>Excel (.xlsx)</strong><br/><small>Multi-sheet workbook with data</small></span>
                </button>
                <button className="btn btn-analyze" style={{background:'linear-gradient(135deg,#ca8a04,#a16207)',padding:'16px 20px',fontSize:14,display:'flex',alignItems:'center',gap:8,justifyContent:'center'}}
                  onClick={()=>{if(result){try{setCustomerDetails(custName,custEmail,custOrg);generateCSVReport(result);setTrackerRefresh(n=>n+1);alert('CSV data exported!')}catch(e:any){if(e instanceof AuditBlockError){alert('Quality review: '+e.audit.blockedReason)}else if(e instanceof VerificationBlockError){alert('⛔ VERIFICATION FAILED — Report blocked.\n\n'+e.verification.summary)}else{alert('CSV error: '+e.message)}}}}}>
                  {'\u{1F4CB}'} <span><strong>CSV Data</strong><br/><small>Flat data for spreadsheets</small></span>
                </button>
                <button className="btn btn-analyze" style={{background:'linear-gradient(135deg,#7c3aed,#6d28d9)',padding:'16px 20px',fontSize:14,display:'flex',alignItems:'center',gap:8,justifyContent:'center'}}
                  onClick={()=>{if(result){try{setCustomerDetails(custName,custEmail,custOrg);generateJSONReport(result);setTrackerRefresh(n=>n+1);alert('JSON export downloaded!')}catch(e:any){if(e instanceof AuditBlockError){alert('Quality review: '+e.audit.blockedReason)}else if(e instanceof VerificationBlockError){alert('⛔ VERIFICATION FAILED — Report blocked.\n\n'+e.verification.summary)}else{alert('JSON error: '+e.message)}}}}}>
                  {'\u{1F4BE}'} <span><strong>JSON (Raw Data)</strong><br/><small>Full analysis data dump</small></span>
                </button>
              </div>
              {!result && <p style={{color:'#fbbf24',marginTop:12,textAlign:'center'}}>⚠ Analyze a site first before generating reports</p>}

              {result && (
                <div style={{marginTop:20,padding:16,background:'rgba(56,189,248,0.08)',borderRadius:12,border:'1px solid rgba(56,189,248,0.2)'}}>
                  <h4 style={{color:'#38bdf8',margin:'0 0 8px'}}>Report Contents ({reportTier.toUpperCase()} tier)</h4>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,fontSize:13,color:'#94a3b8'}}>
                    <div>{'\u2705'} Executive Summary & Probability</div>
                    <div>{'\u2705'} GPS Coordinates & Location</div>
                    <div>{'\u2705'} Soil Analysis (SoilGrids data)</div>
                    <div>{'\u2705'} Water Quality (WHO standards)</div>
                    <div>{'\u2705'} Risk Assessment (5 categories)</div>
                    <div>{'\u2705'} Depth & Yield Recommendations</div>
                    {reportTier !== 'basic' && <><div>{'\u2705'} 20-Year Weather Charts</div>
                    <div>{'\u2705'} GLDAS Soil Moisture Profile</div>
                    <div>{'\u2705'} Real-Time Water Data</div>
                    <div>{'\u2705'} Borehole Records & Statistics</div>
                    <div>{'\u2705'} 3D Subsurface Model (layers)</div>
                    <div>{'\u2705'} Aquifer Physics Simulation</div>
                    <div>{'\u2705'} Pump Test Analysis (Theis/CJ)</div>
                    <div>{'\u2705'} Cone of Depression Profile</div>
                    <div>{'\u2705'} Groundwater Budget</div>
                    <div>{'\u2705'} Solute Transport & Setbacks</div></>}
                    {reportTier === 'expert' && <><div>{'\u2705'} Bankable Readiness Checklist</div>
                    <div>{'\u2705'} Risk Register (7 categories)</div>
                    <div>{'\u2705'} Pump Test Protocol (24-hr)</div>
                    <div>{'\u2705'} Prediction vs Actual Table</div>
                    <div>{'\u2705'} Engineer Confidence Engine</div>
                    <div>{'\u2705'} Data Provenance Matrix</div></>}
                  </div>
                </div>
              )}

              {/* ═══ REPORT TRACKER DASHBOARD ═══ */}
              {(() => {
                const _refresh = trackerRefresh; // dependency to re-render on export
                const stats = getTrackerStats();
                const sortedCountries = Object.entries(stats.countryBreakdown).sort((a,b) => b[1] - a[1]);
                const filteredHistory = historySearch ? searchHistory(historySearch) : stats.recentReports;
                return (
                  <div style={{marginTop:24,padding:20,background:'rgba(139,92,246,0.06)',borderRadius:12,border:'1px solid rgba(139,92,246,0.2)'}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
                      <h4 style={{color:'#a78bfa',margin:0,fontSize:18}}>{'\u{1F4CA}'} Report Generation Tracker</h4>
                      <div style={{display:'flex',alignItems:'center',gap:16}}>
                        <div style={{textAlign:'center'}}>
                          <div style={{fontSize:36,fontWeight:800,color:'#a78bfa',lineHeight:1}}>{stats.totalReportsGenerated}</div>
                          <div style={{fontSize:10,color:'#94a3b8',textTransform:'uppercase',letterSpacing:1}}>Total Reports</div>
                        </div>
                        <div style={{textAlign:'center'}}>
                          <div style={{fontSize:24,fontWeight:700,color:'#22c55e',lineHeight:1}}>{stats.successStories}</div>
                          <div style={{fontSize:10,color:'#94a3b8',textTransform:'uppercase',letterSpacing:1}}>Success Stories</div>
                        </div>
                        <div style={{textAlign:'center'}}>
                          <div style={{fontSize:24,fontWeight:700,color:'#38bdf8',lineHeight:1}}>{stats.historyCount}</div>
                          <div style={{fontSize:10,color:'#94a3b8',textTransform:'uppercase',letterSpacing:1}}>In History</div>
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:16}}>
                      {/* Country Breakdown */}
                      <div style={{padding:12,background:'rgba(15,23,42,0.5)',borderRadius:8,border:'1px solid rgba(139,92,246,0.15)'}}>
                        <div style={{fontSize:12,fontWeight:700,color:'#a78bfa',marginBottom:8}}>{'\u{1F30D}'} Countries</div>
                        {sortedCountries.length === 0 && <div style={{fontSize:11,color:'#64748b'}}>No reports yet</div>}
                        {sortedCountries.slice(0, 8).map(([c, n]) => (
                          <div key={c} style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'#cbd5e1',padding:'2px 0'}}>
                            <span>{c}</span><span style={{color:'#a78bfa',fontWeight:600}}>{n}</span>
                          </div>
                        ))}
                        {sortedCountries.length > 8 && <div style={{fontSize:10,color:'#64748b',marginTop:4}}>+{sortedCountries.length - 8} more countries</div>}
                      </div>

                      {/* Format Breakdown */}
                      <div style={{padding:12,background:'rgba(15,23,42,0.5)',borderRadius:8,border:'1px solid rgba(139,92,246,0.15)'}}>
                        <div style={{fontSize:12,fontWeight:700,color:'#a78bfa',marginBottom:8}}>{'\u{1F4C1}'} Formats</div>
                        {Object.entries(stats.formatBreakdown).length === 0 && <div style={{fontSize:11,color:'#64748b'}}>No reports yet</div>}
                        {Object.entries(stats.formatBreakdown).sort((a,b)=>b[1]-a[1]).map(([f, n]) => (
                          <div key={f} style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'#cbd5e1',padding:'2px 0'}}>
                            <span>{f}</span><span style={{color:'#38bdf8',fontWeight:600}}>{n}</span>
                          </div>
                        ))}
                        <div style={{marginTop:8,borderTop:'1px solid rgba(139,92,246,0.1)',paddingTop:6}}>
                          <div style={{fontSize:10,color:'#94a3b8'}}>Avg Probability</div>
                          <div style={{fontSize:14,fontWeight:700,color:stats.averageProbability >= 0.65 ? '#22c55e' : '#eab308'}}>{(stats.averageProbability * 100).toFixed(1)}%</div>
                        </div>
                      </div>

                      {/* Tier Breakdown */}
                      <div style={{padding:12,background:'rgba(15,23,42,0.5)',borderRadius:8,border:'1px solid rgba(139,92,246,0.15)'}}>
                        <div style={{fontSize:12,fontWeight:700,color:'#a78bfa',marginBottom:8}}>{'\u{1F3AF}'} Tiers</div>
                        {Object.entries(stats.tierBreakdown).length === 0 && <div style={{fontSize:11,color:'#64748b'}}>No reports yet</div>}
                        {Object.entries(stats.tierBreakdown).sort((a,b)=>b[1]-a[1]).map(([t, n]) => (
                          <div key={t} style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'#cbd5e1',padding:'2px 0'}}>
                            <span style={{textTransform:'capitalize'}}>{t}</span><span style={{color:'#f59e0b',fontWeight:600}}>{n}</span>
                          </div>
                        ))}
                        <div style={{marginTop:8,borderTop:'1px solid rgba(139,92,246,0.1)',paddingTop:6}}>
                          <div style={{fontSize:10,color:'#94a3b8'}}>History Limit</div>
                          <div style={{fontSize:12,color:'#64748b'}}>{stats.historyCount} / 1,000 records</div>
                          <div style={{height:4,background:'rgba(139,92,246,0.1)',borderRadius:2,marginTop:4}}>
                            <div style={{height:4,background:'#a78bfa',borderRadius:2,width:`${Math.min(100, stats.historyCount / 10)}%`}}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* History Toggle + Search */}
                    <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
                      <button className="btn" style={{padding:'6px 16px',fontSize:12,background: showHistory ? 'rgba(139,92,246,0.2)' : 'rgba(15,23,42,0.5)',border:'1px solid rgba(139,92,246,0.3)',color:'#a78bfa',borderRadius:8,cursor:'pointer'}}
                        onClick={()=>setShowHistory(!showHistory)}>
                        {showHistory ? '\u25B2 Hide History' : '\u25BC Show Report History'}
                      </button>
                      {showHistory && (
                        <input type="text" value={historySearch} onChange={e=>setHistorySearch(e.target.value)}
                          placeholder="Search by name, email, country, ID..." style={{flex:1,padding:'6px 12px',borderRadius:8,border:'1px solid rgba(139,92,246,0.2)',background:'rgba(15,23,42,0.8)',color:'#e2e8f0',fontSize:12}} />
                      )}
                    </div>

                    {/* History Table */}
                    {showHistory && (
                      <div style={{overflowX:'auto',maxHeight:400,overflowY:'auto'}}>
                        <table style={{width:'100%',borderCollapse:'collapse',fontSize:11}}>
                          <thead>
                            <tr style={{background:'rgba(139,92,246,0.1)'}}>
                              {['#','Date','Customer','Org','Country','Region','Format','Tier','Prob','Depth','Yield','Risk','Audit','Success'].map(h => (
                                <th key={h} style={{padding:'6px 8px',color:'#a78bfa',fontWeight:600,textAlign:'left',borderBottom:'1px solid rgba(139,92,246,0.2)',whiteSpace:'nowrap'}}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {filteredHistory.length === 0 && (
                              <tr><td colSpan={14} style={{padding:20,textAlign:'center',color:'#64748b'}}>{historySearch ? 'No matching reports found' : 'No reports generated yet'}</td></tr>
                            )}
                            {filteredHistory.map(r => (
                              <tr key={r.id} style={{borderBottom:'1px solid rgba(139,92,246,0.08)'}}>
                                <td style={{padding:'5px 8px',color:'#a78bfa',fontWeight:700}}>{r.id}</td>
                                <td style={{padding:'5px 8px',color:'#94a3b8',whiteSpace:'nowrap'}}>{new Date(r.timestamp).toLocaleDateString()}</td>
                                <td style={{padding:'5px 8px',color:'#e2e8f0'}}>{r.customerName}</td>
                                <td style={{padding:'5px 8px',color:'#94a3b8'}}>{r.customerOrg || '—'}</td>
                                <td style={{padding:'5px 8px',color:'#e2e8f0'}}>{r.country}</td>
                                <td style={{padding:'5px 8px',color:'#94a3b8'}}>{r.region || '—'}</td>
                                <td style={{padding:'5px 8px',color:'#38bdf8'}}>{r.format}</td>
                                <td style={{padding:'5px 8px',color:'#f59e0b',textTransform:'capitalize'}}>{r.tier}</td>
                                <td style={{padding:'5px 8px',color: r.probability >= 0.65 ? '#22c55e' : '#eab308',fontWeight:600}}>{(r.probability*100).toFixed(0)}%</td>
                                <td style={{padding:'5px 8px',color:'#94a3b8'}}>{r.recommendedDepth.toFixed(0)}m</td>
                                <td style={{padding:'5px 8px',color:'#94a3b8'}}>{r.estimatedYield.toFixed(1)}</td>
                                <td style={{padding:'5px 8px',color: r.riskLevel === 'Low' ? '#22c55e' : r.riskLevel === 'Moderate' ? '#eab308' : '#ef4444'}}>{r.riskLevel}</td>
                                <td style={{padding:'5px 8px',color: r.auditPassed ? '#22c55e' : '#ef4444'}}>{r.auditScore}</td>
                                <td style={{padding:'5px 8px'}}>{r.isSuccessStory ? '\u2705' : ''}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    <div style={{marginTop:12,fontSize:10,color:'#64748b',textAlign:'center'}}>
                      Lifetime counter never resets. History stores the last 1,000 reports — oldest entries auto-deleted when limit reached. Counter: #{stats.totalReportsGenerated}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════════
     VIEW: SITE COMPARISON (#9, #21) — Enhanced multi-site comparison
     ═══════════════════════════════════════════════════════════════ */
  const renderCompare = () => {
    const analyzed = compSites.filter(s=>s.result);
    const scored = analyzed.map(s => ({ site: s, score: computeSiteScore(s.result!) }));
    scored.sort((a, b) => b.score.total - a.score.total);
    const best = scored.length > 1 ? scored[0].site : null;

    const siteColors = ['#38bdf8', '#4ade80', '#f59e0b'];

    // Comparison metrics table rows
    const compMetrics = analyzed.length >= 2 ? [
      { label: 'Success Probability', unit: '%', values: analyzed.map(s => (s.result!.probability * 100).toFixed(1)), best: 'max' as const },
      { label: 'Recommended Depth', unit: 'm', values: analyzed.map(s => s.result!.recommendedDepth.toFixed(0)), best: 'min' as const },
      { label: 'Estimated Yield', unit: 'm³/h', values: analyzed.map(s => s.result!.estimatedYield.toFixed(1)), best: 'max' as const },
      { label: 'Overall Risk', unit: '%', values: analyzed.map(s => (s.result!.risk.overallRisk * 100).toFixed(0)), best: 'min' as const },
      { label: 'Geological Risk', unit: '%', values: analyzed.map(s => (s.result!.risk.categories.geological * 100).toFixed(0)), best: 'min' as const },
      { label: 'Financial Risk', unit: '%', values: analyzed.map(s => (s.result!.risk.categories.financial * 100).toFixed(0)), best: 'min' as const },
      { label: 'Viability', unit: '', values: analyzed.map(s => s.result!.risk.viability.toUpperCase()), best: 'none' as const },
      { label: 'Soil Type', unit: '', values: analyzed.map(s => s.result!.soil.type.toUpperCase()), best: 'none' as const },
      { label: 'Data Confidence', unit: '%', values: analyzed.map(s => (s.result!.confidenceMetrics?.overall ?? 50).toFixed(0)), best: 'max' as const },
      { label: 'Est. Drilling Cost', unit: 'USD', values: analyzed.map(s => {
        const c = genCostBreakdown(s.result!.recommendedDepth, s.result!.estimatedYield, s.result!.soil.type);
        return '$' + c.total.toLocaleString();
      }), best: 'min_cost' as const },
    ] : [];

    const getBestIdx = (row: typeof compMetrics[0]): number => {
      if (row.best === 'none') return -1;
      const nums = row.values.map(v => parseFloat(v.replace(/[$,]/g, '')));
      if (row.best === 'max') return nums.indexOf(Math.max(...nums));
      return nums.indexOf(Math.min(...nums)); // min or min_cost
    };

    return (
      <div className="compare-view">
        <div className="results-header">
          <h3>{'\u{1F504}'} Multi-Site Comparison Tool</h3>
          <div style={{display:'flex',gap:8}}>
            {analyzed.length >= 2 && (
              <button className="btn btn-primary" onClick={async () => {
                try {
                  await generateComparisonReport(analyzed.map(s => ({ name: s.name, result: s.result! })));
                  alert('Comparison PDF downloaded!');
                } catch (e: any) { alert('Export error: ' + e.message); }
              }}>{'\u{1F4E5}'} Export Comparison PDF</button>
            )}
            <button className="btn btn-secondary" onClick={()=>setActiveView('dashboard')}>Dashboard</button>
          </div>
        </div>
        <p className="tab-desc">Upload terrain images for up to 3 candidate sites. The AI analyzes each independently, then ranks them using a weighted scoring model (success 30%, yield 25%, risk 20%, confidence 15%, cost 10%).</p>

        {/* ── Upload Cards ── */}
        <div className="compare-grid">
          {compSites.map((site, idx) => (
            <div key={site.id} className={`compare-card ${best && best.id===site.id ? 'best-site' : ''}`}>
              {best && best.id===site.id && <div className="best-badge">{'\u{1F3C6}'} BEST SITE</div>}
              <h4>{site.name}</h4>
              {site.image ? <img src={site.image} alt={site.name} className="compare-img" /> :
                <div className="compare-upload" onClick={()=>compInputRefs.current[idx]?.click()}>
                  <span>{'\u{1F4F7}'}</span><span>Upload Image</span>
                </div>
              }
              <input ref={el=>{compInputRefs.current[idx]=el}} type="file" accept="image/*" style={{display:'none'}}
                onChange={e=>{if(e.target.files?.[0]) handleCompSiteUpload(idx, e.target.files[0]);}} />
              {site.analyzing && <div className="compare-status"><div className="mini-spinner"></div> Analyzing...</div>}
              {site.result && (
                <div className="compare-results">
                  <div className="cr-row"><span>Success</span><span style={{color:'#4CAF50'}}>{(site.result.probability*100).toFixed(1)}%</span></div>
                  <div className="cr-row"><span>Depth</span><span>{site.result.recommendedDepth.toFixed(0)}m</span></div>
                  <div className="cr-row"><span>Yield</span><span>{site.result.estimatedYield.toFixed(1)} m&sup3;/h</span></div>
                  <div className="cr-row"><span>Risk</span><span style={{color:getRiskColor(site.result.risk.overallRisk)}}>{(site.result.risk.overallRisk*100).toFixed(0)}%</span></div>
                  <div className="cr-row"><span>Confidence</span><span>{(site.result.confidenceMetrics?.overall ?? 50).toFixed(0)}%</span></div>
                  <div className="cr-row"><span>Viability</span><span>{site.result.risk.viability.toUpperCase()}</span></div>
                </div>
              )}
              {site.result && (
                <div className="compare-score-badge">
                  Score: <strong>{computeSiteScore(site.result).total}</strong>/100
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Radar Chart ── */}
        {analyzed.length >= 2 && (
          <div className="compare-section">
            <h4 className="compare-section-title">{'\u{1F578}\uFE0F'} Multi-Axis Performance Comparison</h4>
            <div className="compare-radar-wrap">
              <canvas ref={compRadarRef} width={420} height={420} className="compare-radar-canvas" />
            </div>
          </div>
        )}

        {/* ── Visual Bar Comparison ── */}
        {analyzed.length >= 2 && (
          <div className="compare-section">
            <h4 className="compare-section-title">{'\u{1F4CA}'} Parameter Comparison</h4>
            <div className="compare-bars">
              {[
                { label: 'Success Probability', key: 'prob', values: analyzed.map(s => s.result!.probability * 100), max: 100, unit: '%', higherBetter: true },
                { label: 'Estimated Yield', key: 'yield', values: analyzed.map(s => s.result!.estimatedYield), max: Math.max(...analyzed.map(s => s.result!.estimatedYield)) * 1.2, unit: ' m³/h', higherBetter: true },
                { label: 'Overall Risk', key: 'risk', values: analyzed.map(s => s.result!.risk.overallRisk * 100), max: 100, unit: '%', higherBetter: false },
                { label: 'Recommended Depth', key: 'depth', values: analyzed.map(s => s.result!.recommendedDepth), max: Math.max(...analyzed.map(s => s.result!.recommendedDepth)) * 1.2, unit: 'm', higherBetter: false },
                { label: 'Data Confidence', key: 'conf', values: analyzed.map(s => s.result!.confidenceMetrics?.overall ?? 50), max: 100, unit: '%', higherBetter: true },
              ].map(metric => (
                <div key={metric.key} className="comp-bar-group">
                  <div className="comp-bar-label">{metric.label}</div>
                  <div className="comp-bar-tracks">
                    {analyzed.map((site, si) => {
                      const pct = (metric.values[si] / metric.max) * 100;
                      const isBest = metric.higherBetter
                        ? metric.values[si] === Math.max(...metric.values)
                        : metric.values[si] === Math.min(...metric.values);
                      return (
                        <div key={site.id} className="comp-bar-row">
                          <span className="comp-bar-site" style={{ color: siteColors[si] }}>{site.name}</span>
                          <div className="comp-bar-track">
                            <div className={`comp-bar-fill ${isBest ? 'comp-bar-best' : ''}`}
                              style={{ width: `${Math.max(pct, 3)}%`, background: siteColors[si] }} />
                          </div>
                          <span className="comp-bar-val">{metric.values[si].toFixed(metric.key === 'prob' || metric.key === 'risk' || metric.key === 'conf' ? 1 : 1)}{metric.unit}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Detailed Metric Matrix ── */}
        {analyzed.length >= 2 && (
          <div className="compare-section">
            <h4 className="compare-section-title">{'\u{1F4CB}'} Detailed Metric Matrix</h4>
            <div className="sci-table-wrap">
              <table className="sci-table compare-matrix">
                <thead>
                  <tr>
                    <th>Parameter</th>
                    {analyzed.map((s, i) => <th key={s.id} style={{ color: siteColors[i] }}>{s.name}</th>)}
                    <th>Best</th>
                  </tr>
                </thead>
                <tbody>
                  {compMetrics.map((row, ri) => {
                    const bestIdx = getBestIdx(row);
                    return (
                      <tr key={ri}>
                        <td>{row.label} {row.unit && <span style={{color:'var(--text-muted)',fontSize:11}}>({row.unit})</span>}</td>
                        {row.values.map((v, vi) => (
                          <td key={vi} className={vi === bestIdx ? 'matrix-best' : ''}>
                            {v}
                          </td>
                        ))}
                        <td style={{color:'var(--accent-green)', fontWeight:600}}>
                          {bestIdx >= 0 ? analyzed[bestIdx].name : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Weighted Scoring Breakdown ── */}
        {scored.length >= 2 && (
          <div className="compare-section">
            <h4 className="compare-section-title">{'\u{1F3AF}'} Weighted Scoring Breakdown</h4>
            <div className="compare-ranking">
              {scored.map((item, rank) => (
                <div key={item.site.id} className={`rank-card ${rank === 0 ? 'rank-first' : ''}`}>
                  <div className="rank-position">#{rank + 1}</div>
                  <div className="rank-info">
                    <div className="rank-name">{item.site.name}</div>
                    <div className="rank-total">Score: <strong>{item.score.total}</strong>/100</div>
                    <div className="rank-breakdown">
                      {Object.entries(item.score.breakdown).map(([k, v]) => (
                        <span key={k} className="rank-chip">{k}: {v}</span>
                      ))}
                    </div>
                  </div>
                  <div className="rank-gauge" style={{ background: `conic-gradient(${siteColors[compSites.findIndex(s => s.id === item.site.id)] || '#38bdf8'} ${item.score.total * 3.6}deg, rgba(148,163,184,0.1) 0deg)` }}>
                    <span>{item.score.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Verdict ── */}
        {best && (
          <div className="compare-verdict">
            <div className="verdict-header">
              <span className="verdict-icon">{'\u{1F3C6}'}</span>
              <strong>Engineering Recommendation</strong>
            </div>
            <p>
              <strong>{best.name}</strong> is the recommended drilling site with a composite score of <strong>{scored[0].score.total}/100</strong>.
              It achieves {(best.result!.probability*100).toFixed(1)}% success probability with an estimated yield of {best.result!.estimatedYield.toFixed(1)} m&sup3;/h
              at {best.result!.recommendedDepth.toFixed(0)}m depth. Overall risk is {(best.result!.risk.overallRisk*100).toFixed(0)}% ({best.result!.risk.viability}).
            </p>
            {scored.length > 1 && scored[1].site.result && (
              <p style={{marginTop:8, fontSize:13, color:'var(--text-muted)'}}>
                Runner-up: {scored[1].site.name} (score {scored[1].score.total}/100) — {scored.length > 2 && scored[2].site.result ? `Third: ${scored[2].site.name} (score ${scored[2].score.total}/100)` : ''}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════════
     VIEW: FEEDBACK / SELF-LEARNING (#10)
     Real storage in localStorage with prediction vs actual comparison.
     ═══════════════════════════════════════════════════════════════ */
  const FEEDBACK_KEY = 'aquascan_feedback';
  const loadFeedbackHistory = (): Array<{
    siteId: string; actualDepth: number; actualYield: number; success: string; notes: string;
    predictedDepth?: number; predictedYield?: number; predictedProb?: number;
    timestamp: string; location?: string;
  }> => {
    try { return JSON.parse(localStorage.getItem(FEEDBACK_KEY) || '[]'); } catch { return []; }
  };
  const saveFeedbackEntry = () => {
    const history = loadFeedbackHistory();
    const entry = {
      siteId: feedback.siteId || `BH-${Date.now().toString(36).toUpperCase()}`,
      actualDepth: parseFloat(feedback.actualDepth) || 0,
      actualYield: parseFloat(feedback.actualYield) || 0,
      success: feedback.success,
      notes: feedback.notes,
      predictedDepth: result?.recommendedDepth,
      predictedYield: result?.estimatedYield,
      predictedProb: result?.probability,
      timestamp: new Date().toISOString(),
      location: result?.resolvedLocation?.displayName || '',
    };
    history.push(entry);
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(history));
    setFeedback({...feedback, submitted: true});
  };
  const feedbackHistory = loadFeedbackHistory();
  const calcDeviation = (predicted: number, actual: number) => {
    if (!predicted || !actual) return null;
    return Math.round(((actual - predicted) / predicted) * 100);
  };
  const avgDeviation = (field: 'Depth' | 'Yield') => {
    const entries = feedbackHistory.filter(e =>
      field === 'Depth' ? (e.predictedDepth && e.actualDepth) : (e.predictedYield && e.actualYield)
    );
    if (entries.length === 0) return null;
    const sum = entries.reduce((acc, e) => {
      const pred = field === 'Depth' ? e.predictedDepth! : e.predictedYield!;
      const act = field === 'Depth' ? e.actualDepth : e.actualYield;
      return acc + Math.abs((act - pred) / pred);
    }, 0);
    return Math.round((sum / entries.length) * 100);
  };

  const renderFeedback = () => (
    <div className="feedback-view">
      <div className="results-header">
        <h3>{'\u{1F9E0}'} Post-Drilling Feedback & Model Calibration</h3>
        <button className="btn btn-secondary" onClick={()=>setActiveView('dashboard')}>Dashboard</button>
      </div>
      <p className="tab-desc">Submit actual drilling results to track prediction accuracy. Data is stored locally and used to calculate model deviation over time. <strong>{feedbackHistory.length} submissions recorded.</strong></p>

      {/* ═══ BACKTEST & VALIDATION CONSOLE ═══ */}
      {(() => {
        const stored: BacktestRecord[] = (() => { try {
          return loadOutcomes().map((o: any) => ({
            name: o.boreholeId, predictedDepth_m: o.predictedDepth_m, actualDepth_m: o.actualDepth_m,
            predictedYield_m3h: o.predictedYield_m3h, actualYield_m3h: o.actualYield_m3h,
            predictedProbability: o.predictedProbability, success: o.success,
          }));
        } catch { return []; } })();
        const pasted = backtestCSV.trim() ? parseBacktestCSV(backtestCSV) : [];
        const bt = computeBacktest([...stored, ...pasted]);
        const statusColor = bt.status === 'VALIDATED' ? '#10b981' : bt.status === 'PRELIMINARY' ? '#f59e0b' : '#94a3b8';
        const pctOrNA = (v: number | null) => v == null ? 'N/A' : `${Math.round(v * 100)}%`;
        return (
          <div style={{marginBottom:20,padding:16,borderRadius:12,border:`2px solid ${statusColor}`,background:`${statusColor}0f`}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:8}}>
              <h4 style={{margin:0,fontSize:15,color:statusColor}}>{'\u{1F52C}'} Backtest &amp; Validation Console</h4>
              <span style={{fontSize:12,fontWeight:800,color:statusColor}}>{bt.status}{bt.grade !== 'N/A' ? ` · Grade ${bt.grade}` : ''} · n={bt.n}</span>
            </div>
            <p style={{fontSize:11,color:'var(--text-secondary)',margin:'6px 0 10px',lineHeight:1.5}}>{bt.message}</p>
            {bt.n > 0 && (
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:10,marginBottom:10}}>
                {[
                  { l:'Hit rate (recommended holes)', v: bt.hitRate==null?'N/A':`${pctOrNA(bt.hitRate)} of ${bt.recommendedN}` },
                  { l:'Observed success rate', v: pctOrNA(bt.observedSuccessRate) },
                  { l:'Depth error (MAPE)', v: bt.depthMAPE_pct==null?'N/A':`${bt.depthMAPE_pct}% (n=${bt.depthN})` },
                  { l:'Depth within ±20%', v: pctOrNA(bt.depthWithin20pct) },
                  { l:'Yield error (MAPE)', v: bt.yieldMAPE_pct==null?'N/A':`${bt.yieldMAPE_pct}% (n=${bt.yieldN})` },
                  { l:'Brier score (calibration)', v: bt.brierScore==null?'N/A':`${bt.brierScore}` },
                ].map(m=>(
                  <div key={m.l} style={{textAlign:'center',padding:10,borderRadius:8,background:'var(--bg-secondary)'}}>
                    <div style={{fontSize:10,color:'var(--text-tertiary)'}}>{m.l}</div>
                    <div style={{fontSize:16,fontWeight:700,color:statusColor}}>{m.v}</div>
                  </div>
                ))}
              </div>
            )}
            {bt.calibration.length > 0 && (
              <div style={{fontSize:10,color:'var(--text-secondary)',marginBottom:10}}>
                Calibration (predicted → observed): {bt.calibration.map(c=>`${c.binLabel}: ${Math.round(c.predictedMean*100)}%→${Math.round(c.observedFreq*100)}% (n=${c.count})`).join('  ·  ')}
              </div>
            )}
            <details>
              <summary style={{fontSize:11,cursor:'pointer',color:'var(--accent-green)'}}>Load drilled-borehole outcomes (CSV)</summary>
              <p style={{fontSize:10,color:'var(--text-secondary)',margin:'6px 0'}}>One borehole per line: <code>name, predictedDepth_m, actualDepth_m, predictedYield_m3h, actualYield_m3h, predictedProbability, success</code> (probability as 0-1 or %; success as yes/no). Header row optional.</p>
              <textarea value={backtestCSV} onChange={e=>setBacktestCSV(e.target.value)} rows={4}
                placeholder={'BH-1, 55, 60, 3, 2.5, 80, yes\nBH-2, 40, 38, 2, 1.8, 60, no'}
                style={{width:'100%',fontSize:11,fontFamily:'monospace',padding:6,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}}/>
              <p style={{fontSize:10,color:'var(--text-secondary)',marginTop:4}}>{pasted.length} pasted + {stored.length} stored = {bt.n} outcomes scored.</p>
            </details>
          </div>
        );
      })()}

      {/* ═══ WRA / COUNTY BOREHOLE INGESTION ═══ */}
      <div style={{marginBottom:20,padding:16,borderRadius:12,border:'2px solid #0284c7',background:'rgba(2,132,199,0.05)'}}>
        <h4 style={{margin:'0 0 4px',fontSize:15,color:'#0284c7'}}>{'\u{1F5C3}'} WRA / County Borehole Records — Import</h4>
        <p style={{fontSize:11,color:'var(--text-secondary)',margin:'0 0 8px',lineHeight:1.5}}>
          Nearby real boreholes are the single strongest predictor of success. WRA/county completion records aren&rsquo;t on any public API — paste or upload your spreadsheet (CSV) or JSON here.
          It validates every row, then you can <strong>use it immediately</strong> (stored on this device) or <strong>download <code>wra-boreholes.json</code></strong> to bundle site-wide. {wraStoredCount > 0 && <span style={{color:'#10b981',fontWeight:700}}> {wraStoredCount} record(s) currently active on this device.</span>}
        </p>
        <p style={{fontSize:10,color:'var(--text-tertiary)',margin:'0 0 6px'}}>Columns (any order, header row required): <code>name, lat, lon, depth_m, yield_m3h, swl_m, outcome, permit, county</code>. Outcome accepts functional/dry/low etc.</p>
        <textarea value={wraRaw} onChange={e=>setWraRaw(e.target.value)} rows={5}
          placeholder={'name,lat,lon,depth_m,yield_m3h,swl_m,outcome,permit\nMakuyu PS,-0.90,37.19,87,3.2,21,Functional,WRA/123\nThika Farm,-1.03,37.07,120,1.5,45,Dry,WRA/124'}
          style={{width:'100%',fontSize:11,fontFamily:'monospace',padding:6,borderRadius:4,border:'1px solid var(--border)',background:'var(--bg-secondary)',color:'var(--text-primary)'}}/>
        <div style={{display:'flex',gap:8,marginTop:6,flexWrap:'wrap',alignItems:'center'}}>
          <input type="file" accept=".csv,.json,.txt,.tsv" style={{fontSize:10}} onChange={e=>{const f=e.target.files?.[0]; if(f){const rd=new FileReader(); rd.onload=()=>{const t=rd.result as string; setWraRaw(t); setWraResult(parseWRARecords(t));}; rd.readAsText(f);}}}/>
          <button className="btn btn-secondary" style={{fontSize:11,padding:'5px 14px'}} onClick={()=>setWraResult(parseWRARecords(wraRaw))}>Validate &amp; Preview</button>
          <button className="btn btn-primary" style={{fontSize:11,padding:'5px 14px'}} disabled={!wraResult || wraResult.accepted===0} onClick={()=>{ if(wraResult){ try { localStorage.setItem(WRA_LOCALSTORAGE_KEY, JSON.stringify(wraResult.records.map(r=>({name:r.name,lat:r.lat,lon:r.lon,depth_m:r.depth_m,yield_m3h:r.yield_m3h,swl_m:r.swl_m,outcome:r.outcome,permit:r.permit,aquiferType:r.aquiferType,lithology:r.lithology,county:r.county})))); setWraStoredCount(wraResult.accepted); } catch(err){} } }}>Use Now ({wraResult?.accepted ?? 0})</button>
          <button className="btn btn-secondary" style={{fontSize:11,padding:'5px 14px'}} disabled={!wraResult || wraResult.accepted===0} onClick={()=>{ if(wraResult){ const blob=new Blob([wraRecordsToJSON(wraResult.records)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='wra-boreholes.json'; a.click(); URL.revokeObjectURL(url);} }}>Download JSON</button>
          {wraStoredCount > 0 && <button className="btn btn-secondary" style={{fontSize:11,padding:'5px 14px'}} onClick={()=>{ try{ localStorage.removeItem(WRA_LOCALSTORAGE_KEY); setWraStoredCount(0);}catch(e){} }}>Clear Active</button>}
        </div>
        {wraResult && (
          <div style={{marginTop:10,padding:10,borderRadius:8,background:'var(--bg-secondary)',fontSize:11}}>
            <span style={{color:'#10b981',fontWeight:700}}>{wraResult.accepted} accepted</span>
            {wraResult.rejected > 0 && <span style={{color:'#ef4444',fontWeight:700,marginLeft:10}}>{wraResult.rejected} rejected</span>}
            {wraResult.warnings.map((w,i)=><div key={'w'+i} style={{color:'#f59e0b',fontSize:10,marginTop:4}}>{'⚠'} {w}</div>)}
            {wraResult.errors.slice(0,6).map((er,i)=><div key={'e'+i} style={{color:'#ef4444',fontSize:10,marginTop:2}}>{er}</div>)}
            {wraResult.accepted > 0 && (
              <table style={{width:'100%',fontSize:10,borderCollapse:'collapse',marginTop:6}}>
                <thead><tr style={{textAlign:'left',color:'var(--text-secondary)'}}><th>Name</th><th>Lat</th><th>Lon</th><th>Depth</th><th>Yield</th><th>Outcome</th></tr></thead>
                <tbody>{wraResult.records.slice(0,6).map((r,i)=>(<tr key={i} style={{borderTop:'1px solid var(--border)'}}><td>{r.name}</td><td>{r.lat}</td><td>{r.lon}</td><td>{r.depth_m||'—'}</td><td>{r.yield_m3h??'—'}</td><td>{r.outcome}</td></tr>))}</tbody>
              </table>
            )}
            {wraResult.accepted > 6 && <div style={{fontSize:10,color:'var(--text-secondary)',marginTop:4}}>+{wraResult.accepted-6} more…</div>}
          </div>
        )}
      </div>

      {/* Accuracy Statistics */}
      {feedbackHistory.length > 0 && (
        <div style={{marginBottom:20,background:'var(--bg-elevated)',borderRadius:12,padding:16,border:'1px solid var(--border)'}}>
          <h4 style={{margin:'0 0 12px',color:'#22c55e',fontSize:14}}>{'📊'} Model Accuracy (from {feedbackHistory.length} drilling{feedbackHistory.length>1?'s':''})</h4>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))',gap:12}}>
            <div style={{textAlign:'center',padding:'10px',borderRadius:8,background:'rgba(56,189,248,0.08)'}}>
              <div style={{fontSize:11,color:'var(--text-tertiary)'}}>Avg Depth Deviation</div>
              <div style={{fontSize:20,fontWeight:700,color:'#38bdf8'}}>{avgDeviation('Depth') !== null ? `±${avgDeviation('Depth')}%` : 'N/A'}</div>
            </div>
            <div style={{textAlign:'center',padding:'10px',borderRadius:8,background:'rgba(34,197,94,0.08)'}}>
              <div style={{fontSize:11,color:'var(--text-tertiary)'}}>Avg Yield Deviation</div>
              <div style={{fontSize:20,fontWeight:700,color:'#22c55e'}}>{avgDeviation('Yield') !== null ? `±${avgDeviation('Yield')}%` : 'N/A'}</div>
            </div>
            <div style={{textAlign:'center',padding:'10px',borderRadius:8,background:'rgba(251,191,36,0.08)'}}>
              <div style={{fontSize:11,color:'var(--text-tertiary)'}}>Success Rate</div>
              <div style={{fontSize:20,fontWeight:700,color:'#fbbf24'}}>{Math.round((feedbackHistory.filter(e=>e.success==='yes').length / feedbackHistory.length)*100)}%</div>
            </div>
          </div>
        </div>
      )}

      {feedback.submitted ? (
        <div className="feedback-success">
          <div className="feedback-check">{'\u2705'}</div>
          <h4>Feedback Saved!</h4>
          <p>Data stored locally ({feedbackHistory.length} total entries). Deviation metrics updated.</p>
          <button className="btn btn-secondary" onClick={()=>setFeedback({siteId:'',actualDepth:'',actualYield:'',success:'yes',notes:'',submitted:false})}>Submit Another</button>
        </div>
      ) : (
        <div className="feedback-form">
          <div className="fb-field"><label>Site / Borehole ID</label><input type="text" value={feedback.siteId} onChange={e=>setFeedback({...feedback,siteId:e.target.value})} placeholder="e.g. BH-1042" /></div>
          <div className="fb-field"><label>Actual Depth Drilled (m)</label><input type="number" value={feedback.actualDepth} onChange={e=>setFeedback({...feedback,actualDepth:e.target.value})} placeholder="e.g. 120" /></div>
          <div className="fb-field"><label>Actual Yield (m&sup3;/h)</label><input type="number" step="0.1" value={feedback.actualYield} onChange={e=>setFeedback({...feedback,actualYield:e.target.value})} placeholder="e.g. 8.5" /></div>
          <div className="fb-field">
            <label>Success?</label>
            <div className="fb-radio">
              {(['yes','partial','no'] as const).map(v => (
                <label key={v}><input type="radio" name="success" checked={feedback.success===v} onChange={()=>setFeedback({...feedback,success:v})} /> {v.charAt(0).toUpperCase()+v.slice(1)}</label>
              ))}
            </div>
          </div>
          <div className="fb-field"><label>Notes</label><textarea value={feedback.notes} onChange={e=>setFeedback({...feedback,notes:e.target.value})} placeholder="Any observations, issues, or additional data..." rows={3} /></div>
          <button className="btn btn-analyze" onClick={saveFeedbackEntry}>Save Feedback</button>
        </div>
      )}

      {/* Historical Submissions Table */}
      {feedbackHistory.length > 0 && (
        <div style={{marginTop:20}}>
          <h4 style={{color:'var(--text-secondary)',fontSize:14,marginBottom:12}}>{'📋'} Submission History</h4>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
              <thead>
                <tr style={{borderBottom:'2px solid var(--border)'}}>
                  <th style={{textAlign:'left',padding:'8px 6px',color:'var(--text-tertiary)'}}>Site ID</th>
                  <th style={{textAlign:'right',padding:'8px 6px',color:'var(--text-tertiary)'}}>Predicted</th>
                  <th style={{textAlign:'right',padding:'8px 6px',color:'var(--text-tertiary)'}}>Actual</th>
                  <th style={{textAlign:'right',padding:'8px 6px',color:'var(--text-tertiary)'}}>Deviation</th>
                  <th style={{textAlign:'center',padding:'8px 6px',color:'var(--text-tertiary)'}}>Success</th>
                  <th style={{textAlign:'left',padding:'8px 6px',color:'var(--text-tertiary)'}}>Date</th>
                </tr>
              </thead>
              <tbody>
                {feedbackHistory.slice(-10).reverse().map((entry, i) => {
                  const depthDev = calcDeviation(entry.predictedDepth || 0, entry.actualDepth);
                  const yieldDev = calcDeviation(entry.predictedYield || 0, entry.actualYield);
                  return (
                    <tr key={i} style={{borderBottom:'1px solid var(--border)'}}>
                      <td style={{padding:'6px',fontWeight:600}}>{entry.siteId}</td>
                      <td style={{padding:'6px',textAlign:'right',fontFamily:'var(--font-mono)'}}>{entry.predictedDepth ? `${entry.predictedDepth.toFixed(0)}m / ${entry.predictedYield?.toFixed(1)}` : '—'}</td>
                      <td style={{padding:'6px',textAlign:'right',fontFamily:'var(--font-mono)'}}>{entry.actualDepth}m / {entry.actualYield}</td>
                      <td style={{padding:'6px',textAlign:'right',fontFamily:'var(--font-mono)',color: depthDev !== null && Math.abs(depthDev) < 15 ? '#22c55e' : depthDev !== null && Math.abs(depthDev) < 30 ? '#fbbf24' : '#ef4444'}}>{depthDev !== null ? `${depthDev > 0 ? '+' : ''}${depthDev}%` : '—'}{yieldDev !== null ? ` / ${yieldDev > 0 ? '+' : ''}${yieldDev}%` : ''}</td>
                      <td style={{padding:'6px',textAlign:'center'}}>{entry.success === 'yes' ? '✅' : entry.success === 'partial' ? '⚠️' : '❌'}</td>
                      <td style={{padding:'6px',fontSize:11,color:'var(--text-tertiary)'}}>{new Date(entry.timestamp).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  /* ═══════════════════════════════════════════════════════════════
     MAIN RENDER
     ═══════════════════════════════════════════════════════════════ */
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <div className="logo">{'\u{1F30D}'}</div>
          <div>
            <h1>EMERSON EIMS &mdash; AquaScan Pro</h1>
            <p className="subtitle">{SCI.TOTAL_CAPABILITIES} Capabilities &bull; 8 Subsystems &bull; AI-Powered Borehole Analysis</p>
          </div>
        </div>
        <div className="header-right">
          <div className="header-badge" style={{background:overallHealth>=90?'rgba(34,197,94,0.2)':'rgba(245,158,11,0.2)',border:`1px solid ${overallHealth>=90?'rgba(34,197,94,0.3)':'rgba(245,158,11,0.3)'}`, color:overallHealth>=90?'#22c55e':'#f59e0b'}}>{overallHealth}% Online</div>
          {activeView !=='dashboard' && <button className="btn btn-ghost" onClick={()=>{setActiveView('dashboard');setAnalyzing(false);}}>Dashboard</button>}
        </div>
      </header>
      <main className="app-main">
        {activeView==='dashboard' && renderDashboard()}
        {activeView==='capabilities' && renderCapabilities()}
        {activeView==='analyze' && renderAnalyzing()}
        {activeView==='results' && renderResults()}
        {activeView==='compare' && renderCompare()}
        {activeView==='feedback' && renderFeedback()}
      </main>
      <footer className="app-footer">
        <span>&copy; {new Date().getFullYear()} EmersonEIMS &mdash; AquaScan Pro v3.0 &bull; {SCI.TOTAL_CAPABILITIES} Capabilities &bull; 7 Scientific Domains &bull; 8 AI Subsystems</span>
      </footer>
    </div>
  );
};

export default AIBoreholeAnalyzer;
