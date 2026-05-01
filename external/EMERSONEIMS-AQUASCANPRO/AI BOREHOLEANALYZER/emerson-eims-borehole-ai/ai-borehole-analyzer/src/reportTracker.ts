/**
 * ══════════════════════════════════════════════════════════════════════════════
 *  REPORT TRACKER — Persistent Report Generation Counter & History
 * ══════════════════════════════════════════════════════════════════════════════
 *
 *  Tracks every report generated:
 *    - Total lifetime counter (NEVER resets, even when history rotates)
 *    - Customer details, country, coordinates, tier, format
 *    - Success probability for success story tracking
 *    - Rolling history of last 1000 reports (oldest auto-deleted)
 *
 *  Storage: localStorage — persists across sessions on the same device.
 *
 *  Keys:
 *    aquascan_report_counter  — lifetime total (number)
 *    aquascan_report_history  — JSON array of ReportRecord[]
 * ══════════════════════════════════════════════════════════════════════════════
 */

import type { AnalysisResult } from './types';

const COUNTER_KEY = 'aquascan_report_counter';
const HISTORY_KEY = 'aquascan_report_history';
const MAX_HISTORY = 1000;

export type ReportFormat = 'PDF' | 'Word' | 'Excel' | 'CSV' | 'JSON';
export type ReportTier = 'basic' | 'professional' | 'expert';

export interface ReportRecord {
  id: number;                    // sequential ID (lifetime counter value at time of generation)
  timestamp: string;             // ISO 8601
  customerName: string;          // entered by user or 'Anonymous'
  customerEmail: string;         // entered by user or ''
  customerOrg: string;           // organization/company
  country: string;
  countryCode: string;
  region: string;
  city: string;
  coordinates: string;           // "lat, lon"
  format: ReportFormat;
  tier: ReportTier;
  probability: number;           // 0-1 success probability
  recommendedDepth: number;
  estimatedYield: number;
  riskLevel: string;             // 'Low' | 'Moderate' | 'High' | 'Very High'
  auditScore: number;            // 0-100
  auditPassed: boolean;
  isSuccessStory: boolean;       // probability >= 0.65 and risk <= 0.5
}

export interface TrackerStats {
  totalReportsGenerated: number;   // lifetime counter — never resets
  historyCount: number;            // current records in history (max 1000)
  countryBreakdown: Record<string, number>;
  formatBreakdown: Record<string, number>;
  tierBreakdown: Record<string, number>;
  successStories: number;
  averageProbability: number;
  recentReports: ReportRecord[];   // last 10 for quick display
}

// ═══ COUNTER ═══

export function getLifetimeCount(): number {
  const raw = localStorage.getItem(COUNTER_KEY);
  return raw ? parseInt(raw, 10) || 0 : 0;
}

function incrementCounter(): number {
  const next = getLifetimeCount() + 1;
  localStorage.setItem(COUNTER_KEY, String(next));
  return next;
}

// ═══ HISTORY ═══

export function getHistory(): ReportRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHistory(records: ReportRecord[]): void {
  // Keep only the latest MAX_HISTORY entries
  const trimmed = records.length > MAX_HISTORY
    ? records.slice(records.length - MAX_HISTORY)
    : records;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
}

// ═══ RECORD A REPORT ═══

export function recordReport(
  result: AnalysisResult,
  format: ReportFormat,
  tier: ReportTier,
  auditScore: number,
  auditPassed: boolean,
  customerName?: string,
  customerEmail?: string,
  customerOrg?: string,
): ReportRecord {
  const id = incrementCounter();

  // Extract location data
  const loc = result.resolvedLocation || result.clientLocation;
  const country = (loc as any)?.country || result.locationContext?.country ||
    result.geoEstimate?.bestEstimate?.country || 'Unknown';
  const countryCode = (loc as any)?.countryCode || result.geoEstimate?.bestEstimate?.countryCode || '';
  const region = (loc as any)?.state || (loc as any)?.region || result.locationContext?.region || '';
  const city = (loc as any)?.city || (loc as any)?.village || result.locationContext?.city || '';

  const lat = result.site?.latitude;
  const lon = result.site?.longitude;
  const coordinates = (lat != null && lon != null && (lat !== 0 || lon !== 0))
    ? `${lat.toFixed(6)}, ${lon.toFixed(6)}`
    : 'N/A';

  const overallRisk = result.risk?.overallRisk ?? 0.5;
  const riskLevel = overallRisk < 0.3 ? 'Low' : overallRisk < 0.5 ? 'Moderate' : overallRisk < 0.7 ? 'High' : 'Very High';
  const probability = result.probability ?? 0;
  const isSuccessStory = probability >= 0.65 && overallRisk <= 0.5;

  const record: ReportRecord = {
    id,
    timestamp: new Date().toISOString(),
    customerName: customerName || 'Anonymous',
    customerEmail: customerEmail || '',
    customerOrg: customerOrg || '',
    country,
    countryCode,
    region,
    city,
    coordinates,
    format,
    tier,
    probability,
    recommendedDepth: result.recommendedDepth ?? 0,
    estimatedYield: result.estimatedYield ?? 0,
    riskLevel,
    auditScore,
    auditPassed,
    isSuccessStory,
  };

  const history = getHistory();
  history.push(record);
  saveHistory(history);

  return record;
}

// ═══ STATISTICS ═══

export function getTrackerStats(): TrackerStats {
  const history = getHistory();
  const total = getLifetimeCount();

  const countryBreakdown: Record<string, number> = {};
  const formatBreakdown: Record<string, number> = {};
  const tierBreakdown: Record<string, number> = {};
  let successStories = 0;
  let probSum = 0;

  for (const r of history) {
    countryBreakdown[r.country] = (countryBreakdown[r.country] || 0) + 1;
    formatBreakdown[r.format] = (formatBreakdown[r.format] || 0) + 1;
    tierBreakdown[r.tier] = (tierBreakdown[r.tier] || 0) + 1;
    if (r.isSuccessStory) successStories++;
    probSum += r.probability;
  }

  return {
    totalReportsGenerated: total,
    historyCount: history.length,
    countryBreakdown,
    formatBreakdown,
    tierBreakdown,
    successStories,
    averageProbability: history.length > 0 ? probSum / history.length : 0,
    recentReports: history.slice(-10).reverse(), // newest first
  };
}

// ═══ SEARCH / FILTER ═══

export function searchHistory(query: string): ReportRecord[] {
  const q = query.toLowerCase();
  return getHistory().filter(r =>
    r.customerName.toLowerCase().includes(q) ||
    r.customerEmail.toLowerCase().includes(q) ||
    r.customerOrg.toLowerCase().includes(q) ||
    r.country.toLowerCase().includes(q) ||
    r.city.toLowerCase().includes(q) ||
    r.region.toLowerCase().includes(q) ||
    String(r.id).includes(q)
  );
}

export function getHistoryByCountry(country: string): ReportRecord[] {
  const c = country.toLowerCase();
  return getHistory().filter(r => r.country.toLowerCase() === c);
}

export function getSuccessStories(): ReportRecord[] {
  return getHistory().filter(r => r.isSuccessStory);
}
