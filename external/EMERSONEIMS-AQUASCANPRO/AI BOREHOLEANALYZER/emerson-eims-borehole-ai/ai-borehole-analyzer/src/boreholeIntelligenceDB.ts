/* ═══════════════════════════════════════════════════════════════════════
   BOREHOLE INTELLIGENCE DATABASE
   GPS | Depth | Yield | Lithology | Success/Failure | Pump Test
   Persistent localStorage + backend sync + AI training from outcomes
   ═══════════════════════════════════════════════════════════════════════ */

/* ── Types ─────────────────────────────────────────────────── */

export interface BoreholeRecord {
  id: string;
  createdAt: string;
  updatedAt: string;

  // Location
  latitude: number;
  longitude: number;
  country: string;
  region?: string;
  locality?: string;

  // Borehole physical data
  totalDepth_m: number;
  waterStrikeDepths_m: number[];  // depth(s) where water first appeared
  staticWaterLevel_m: number;
  casingDepth_m?: number;

  // Yield data
  yield_m3hr: number;
  testType?: 'constant_rate' | 'step_drawdown' | 'slug' | 'recovery' | 'estimate';
  testDuration_hr?: number;

  // Pump test data
  drawdown_m?: number;
  recoveryPercent?: number;
  transmissivity_m2day?: number;
  storativity?: number;
  specificCapacity_m2hr?: number;

  // Lithology log
  lithologyLog: LithologyEntry[];

  // Hydrochemistry
  hydrochemistry?: HydrochemistryResult;

  // Outcome
  success: boolean;
  failureReason?: 'dry' | 'low_yield' | 'poor_quality' | 'collapsed' | 'other';

  // Geology context
  rockType?: string;
  aquiferType?: 'unconfined' | 'confined' | 'semi-confined' | 'fractured' | 'perched';
  geologicalFormation?: string;

  // Geophysics used
  geophysicsUsed: string[];  // e.g. ['ERT', 'Seismic', 'TDEM']

  // Cost
  totalCost_USD?: number;
  costPerMeter_USD?: number;

  // Metadata
  contractor?: string;
  drillDate?: string;
  drillMethod?: 'rotary' | 'percussion' | 'DTH' | 'cable_tool' | 'manual';
  source: 'field_entry' | 'imported' | 'api_sync';
  verified: boolean;
  notes?: string;

  // AI prediction that was made before drilling
  aiPrediction?: {
    predictedDepth_m: number;
    predictedYield_m3hr: number;
    predictedProbability: number;
    rockTypeGuess: string;
  };
}

export interface LithologyEntry {
  fromDepth_m: number;
  toDepth_m: number;
  lithology: string;          // e.g. 'red laterite', 'weathered granite', 'fractured gneiss'
  description?: string;
  color?: string;
  grainSize?: 'clay' | 'silt' | 'fine_sand' | 'medium_sand' | 'coarse_sand' | 'gravel' | 'cobble' | 'boulder';
  waterBearing: boolean;
  fractured?: boolean;
  hardness?: 'soft' | 'medium' | 'hard' | 'very_hard';
}

export interface HydrochemistryResult {
  sampleDate: string;
  labName?: string;
  pH: number;
  tds_mgL: number;
  ec_uScm: number;
  iron_mgL: number;
  fluoride_mgL: number;
  nitrate_mgL: number;
  arsenic_ugL?: number;
  manganese_mgL?: number;
  chloride_mgL?: number;
  sulfate_mgL?: number;
  calcium_mgL?: number;
  magnesium_mgL?: number;
  sodium_mgL?: number;
  potassium_mgL?: number;
  bicarbonate_mgL?: number;
  hardness_mgL?: number;
  coliform_cfu_100ml?: number;
  ecoli_cfu_100ml?: number;
  isPotable: boolean;
  waterType?: string;    // Piper classification: Ca-HCO3, Na-Cl, etc.
  treatmentNeeded: string[];
}

export interface BoreholeQuery {
  latitude: number;
  longitude: number;
  radiusKm: number;
  minYield_m3hr?: number;
  rockType?: string;
  aquiferType?: string;
  successOnly?: boolean;
}

export interface IntelligenceInsight {
  avgDepth_m: number;
  avgYield_m3hr: number;
  avgWaterStrike_m: number;
  successRate: number;
  totalRecords: number;
  commonRockTypes: { rock: string; count: number; avgYield: number }[];
  commonAquiferTypes: { type: string; count: number; avgYield: number }[];
  depthYieldCorrelation: number;  // Pearson r
  bestGeophysics: { method: string; avgAccuracy: number; count: number }[];
  lithologyPatterns: { depth_range: string; commonLithology: string; waterBearingPct: number }[];
  waterQualityAvg?: {
    pH: number; tds: number; iron: number; fluoride: number; nitrate: number;
    potablePercent: number;
  };
  seasonalTrend?: { bestMonth: number; worstMonth: number; yieldVariation: number };
  predictiveFactors: { factor: string; importance: number; direction: string }[];
}

export interface TrainingDataPoint {
  features: number[];  // normalized input vector
  label: number;       // target (yield, or success probability)
  featureNames: string[];
}

/* ── Storage Keys ─────────────────────────────────────────── */

const STORAGE_KEY = 'aquascan_borehole_intelligence_db';
const VERSION = 2;

/* ── Database Class ───────────────────────────────────────── */

class BoreholeIntelligenceDB {
  private records: BoreholeRecord[] = [];
  private loaded = false;

  constructor() {
    this.load();
  }

  private load(): void {
    if (this.loaded) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.version === VERSION && Array.isArray(parsed.records)) {
          this.records = parsed.records;
        }
      }
    } catch { /* empty or corrupt storage */ }
    this.loaded = true;
  }

  private save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: VERSION,
        updatedAt: new Date().toISOString(),
        count: this.records.length,
        records: this.records,
      }));
    } catch {
      // localStorage full — trim oldest unverified records
      const verified = this.records.filter(r => r.verified);
      const unverified = this.records.filter(r => !r.verified).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      this.records = [...verified, ...unverified.slice(0, Math.floor(unverified.length / 2))];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: VERSION, updatedAt: new Date().toISOString(), count: this.records.length, records: this.records }));
      } catch { /* give up */ }
    }
  }

  /* ── CRUD Operations ──────────────────────────────────── */

  addRecord(record: Omit<BoreholeRecord, 'id' | 'createdAt' | 'updatedAt'>): BoreholeRecord {
    const now = new Date().toISOString();
    const full: BoreholeRecord = {
      ...record,
      id: `BH-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: now,
      updatedAt: now,
    };
    this.records.push(full);
    this.save();
    return full;
  }

  updateRecord(id: string, updates: Partial<BoreholeRecord>): boolean {
    const idx = this.records.findIndex(r => r.id === id);
    if (idx < 0) return false;
    this.records[idx] = { ...this.records[idx], ...updates, updatedAt: new Date().toISOString() };
    this.save();
    return true;
  }

  deleteRecord(id: string): boolean {
    const before = this.records.length;
    this.records = this.records.filter(r => r.id !== id);
    if (this.records.length < before) { this.save(); return true; }
    return false;
  }

  getRecord(id: string): BoreholeRecord | undefined {
    return this.records.find(r => r.id === id);
  }

  getAllRecords(): BoreholeRecord[] {
    return [...this.records];
  }

  getCount(): number {
    return this.records.length;
  }

  /* ── Spatial Query ────────────────────────────────────── */

  queryNearby(query: BoreholeQuery): BoreholeRecord[] {
    return this.records.filter(r => {
      const dist = haversineKm(query.latitude, query.longitude, r.latitude, r.longitude);
      if (dist > query.radiusKm) return false;
      if (query.minYield_m3hr && r.yield_m3hr < query.minYield_m3hr) return false;
      if (query.rockType && r.rockType !== query.rockType) return false;
      if (query.aquiferType && r.aquiferType !== query.aquiferType) return false;
      if (query.successOnly && !r.success) return false;
      return true;
    }).sort((a, b) => {
      const da = haversineKm(query.latitude, query.longitude, a.latitude, a.longitude);
      const db = haversineKm(query.latitude, query.longitude, b.latitude, b.longitude);
      return da - db;
    });
  }

  /* ── Intelligence / Analytics ─────────────────────────── */

  getIntelligence(lat: number, lon: number, radiusKm: number = 50): IntelligenceInsight | null {
    const nearby = this.queryNearby({ latitude: lat, longitude: lon, radiusKm });
    if (nearby.length < 2) return null;

    const successful = nearby.filter(r => r.success);
    const depths = nearby.map(r => r.totalDepth_m);
    const yields = nearby.filter(r => r.yield_m3hr > 0).map(r => r.yield_m3hr);
    const waterStrikes = nearby.flatMap(r => r.waterStrikeDepths_m);

    // Rock type statistics
    const rockMap = new Map<string, { count: number; yields: number[] }>();
    for (const r of nearby) {
      if (!r.rockType) continue;
      const entry = rockMap.get(r.rockType) || { count: 0, yields: [] };
      entry.count++;
      if (r.yield_m3hr > 0) entry.yields.push(r.yield_m3hr);
      rockMap.set(r.rockType, entry);
    }
    const commonRockTypes = [...rockMap.entries()]
      .map(([rock, d]) => ({ rock, count: d.count, avgYield: d.yields.length > 0 ? d.yields.reduce((a, b) => a + b) / d.yields.length : 0 }))
      .sort((a, b) => b.count - a.count);

    // Aquifer type statistics
    const aqMap = new Map<string, { count: number; yields: number[] }>();
    for (const r of nearby) {
      if (!r.aquiferType) continue;
      const entry = aqMap.get(r.aquiferType) || { count: 0, yields: [] };
      entry.count++;
      if (r.yield_m3hr > 0) entry.yields.push(r.yield_m3hr);
      aqMap.set(r.aquiferType, entry);
    }
    const commonAquiferTypes = [...aqMap.entries()]
      .map(([type, d]) => ({ type, count: d.count, avgYield: d.yields.length > 0 ? d.yields.reduce((a, b) => a + b) / d.yields.length : 0 }))
      .sort((a, b) => b.count - a.count);

    // Depth-yield correlation (Pearson r)
    const pairedDY = nearby.filter(r => r.yield_m3hr > 0).map(r => [r.totalDepth_m, r.yield_m3hr] as [number, number]);
    const depthYieldCorrelation = pearsonR(pairedDY.map(p => p[0]), pairedDY.map(p => p[1]));

    // Best geophysics method analysis
    const geophMap = new Map<string, { accuracies: number[]; count: number }>();
    for (const r of nearby) {
      if (!r.aiPrediction) continue;
      for (const method of r.geophysicsUsed) {
        const entry = geophMap.get(method) || { accuracies: [], count: 0 };
        entry.count++;
        const depthAcc = 1 - Math.abs(r.aiPrediction.predictedDepth_m - r.totalDepth_m) / r.totalDepth_m;
        entry.accuracies.push(Math.max(0, depthAcc));
        geophMap.set(method, entry);
      }
    }
    const bestGeophysics = [...geophMap.entries()]
      .map(([method, d]) => ({ method, avgAccuracy: d.accuracies.reduce((a, b) => a + b) / d.accuracies.length, count: d.count }))
      .sort((a, b) => b.avgAccuracy - a.avgAccuracy);

    // Lithology patterns by depth
    const depthBins = [
      { range: '0-10m', min: 0, max: 10 },
      { range: '10-25m', min: 10, max: 25 },
      { range: '25-50m', min: 25, max: 50 },
      { range: '50-100m', min: 50, max: 100 },
      { range: '100m+', min: 100, max: 999 },
    ];
    const lithologyPatterns = depthBins.map(bin => {
      const entries = nearby.flatMap(r => r.lithologyLog.filter(l => l.fromDepth_m >= bin.min && l.fromDepth_m < bin.max));
      if (entries.length === 0) return { depth_range: bin.range, commonLithology: 'unknown', waterBearingPct: 0 };
      const lithCounts = new Map<string, number>();
      let waterCount = 0;
      for (const e of entries) {
        lithCounts.set(e.lithology, (lithCounts.get(e.lithology) || 0) + 1);
        if (e.waterBearing) waterCount++;
      }
      const common = [...lithCounts.entries()].sort((a, b) => b[1] - a[1])[0][0];
      return { depth_range: bin.range, commonLithology: common, waterBearingPct: waterCount / entries.length };
    });

    // Water quality averages
    const chemRecords = nearby.filter(r => r.hydrochemistry);
    let waterQualityAvg: IntelligenceInsight['waterQualityAvg'];
    if (chemRecords.length > 0) {
      const chems = chemRecords.map(r => r.hydrochemistry!);
      waterQualityAvg = {
        pH: avg(chems.map(c => c.pH)),
        tds: avg(chems.map(c => c.tds_mgL)),
        iron: avg(chems.map(c => c.iron_mgL)),
        fluoride: avg(chems.map(c => c.fluoride_mgL)),
        nitrate: avg(chems.map(c => c.nitrate_mgL)),
        potablePercent: chems.filter(c => c.isPotable).length / chems.length,
      };
    }

    // Predictive factors (simple feature importance via univariate correlation)
    const predictiveFactors = computeFeatureImportance(nearby);

    return {
      avgDepth_m: avg(depths),
      avgYield_m3hr: yields.length > 0 ? avg(yields) : 0,
      avgWaterStrike_m: waterStrikes.length > 0 ? avg(waterStrikes) : 0,
      successRate: successful.length / nearby.length,
      totalRecords: nearby.length,
      commonRockTypes,
      commonAquiferTypes,
      depthYieldCorrelation,
      bestGeophysics,
      lithologyPatterns,
      waterQualityAvg,
      predictiveFactors,
    };
  }

  /* ── AI Training Data Generation ──────────────────────── */

  generateTrainingData(): TrainingDataPoint[] {
    const featureNames = [
      'latitude', 'longitude', 'totalDepth_m', 'staticWaterLevel_m',
      'numWaterStrikes', 'firstWaterStrike_m', 'numLithLayers',
      'hasFracturedLayer', 'hasClayLayer', 'maxLithDepth_m',
      'usedERT', 'usedSeismic', 'usedTDEM', 'usedGPR', 'numGeophysicsMethods',
    ];

    return this.records.filter(r => r.yield_m3hr >= 0).map(r => {
      const features = [
        r.latitude,
        r.longitude,
        r.totalDepth_m,
        r.staticWaterLevel_m,
        r.waterStrikeDepths_m.length,
        r.waterStrikeDepths_m[0] ?? 0,
        r.lithologyLog.length,
        r.lithologyLog.some(l => l.fractured) ? 1 : 0,
        r.lithologyLog.some(l => l.lithology.toLowerCase().includes('clay')) ? 1 : 0,
        Math.max(...r.lithologyLog.map(l => l.toDepth_m), 0),
        r.geophysicsUsed.includes('ERT') ? 1 : 0,
        r.geophysicsUsed.includes('Seismic') ? 1 : 0,
        r.geophysicsUsed.includes('TDEM') ? 1 : 0,
        r.geophysicsUsed.includes('GPR') ? 1 : 0,
        r.geophysicsUsed.length,
      ];
      return { features, label: r.yield_m3hr, featureNames };
    });
  }

  /* ── Regional Prediction from Database ────────────────── */

  predictFromDatabase(lat: number, lon: number, rockType?: string): {
    predictedDepth_m: number;
    predictedYield_m3hr: number;
    predictedSuccessRate: number;
    confidence: number;
    basedOnRecords: number;
    recommendation: string;
  } | null {
    // Search in expanding radius until we have enough records
    let radius = 10;
    let nearby: BoreholeRecord[] = [];
    while (radius <= 200 && nearby.length < 5) {
      nearby = this.queryNearby({ latitude: lat, longitude: lon, radiusKm: radius });
      radius *= 2;
    }
    if (nearby.length < 3) return null;

    // Weight by inverse distance
    const weighted = nearby.map(r => {
      const dist = Math.max(0.5, haversineKm(lat, lon, r.latitude, r.longitude));
      const w = 1 / (dist * dist);
      return { record: r, weight: w };
    });
    const totalW = weighted.reduce((s, w) => s + w.weight, 0);

    // Rock type match bonus
    if (rockType) {
      for (const w of weighted) {
        if (w.record.rockType === rockType) w.weight *= 2;
      }
    }
    const totalW2 = weighted.reduce((s, w) => s + w.weight, 0);

    const predictedDepth = weighted.reduce((s, w) => s + w.record.totalDepth_m * w.weight, 0) / totalW2;
    const predictedYield = weighted.filter(w => w.record.yield_m3hr > 0).reduce((s, w) => s + w.record.yield_m3hr * w.weight, 0) / totalW2;
    const successCount = weighted.filter(w => w.record.success).reduce((s, w) => s + w.weight, 0);
    const predictedSuccessRate = successCount / totalW;

    // Confidence based on record count and proximity
    const avgDist = nearby.reduce((s, r) => s + haversineKm(lat, lon, r.latitude, r.longitude), 0) / nearby.length;
    const confidence = Math.min(0.95, 0.4 + 0.05 * Math.min(nearby.length, 10) + Math.max(0, 0.3 - avgDist / 100));

    const recommendation = predictedSuccessRate > 0.8
      ? 'Regional data strongly supports drilling here.'
      : predictedSuccessRate > 0.6
      ? 'Moderate success rate in region; recommend geophysics survey before drilling.'
      : 'Low regional success rate; detailed geophysical survey essential.';

    return {
      predictedDepth_m: Math.round(predictedDepth),
      predictedYield_m3hr: Math.round(predictedYield * 100) / 100,
      predictedSuccessRate: Math.round(predictedSuccessRate * 1000) / 1000,
      confidence,
      basedOnRecords: nearby.length,
      recommendation,
    };
  }

  /* ── Import / Export ──────────────────────────────────── */

  exportJSON(): string {
    return JSON.stringify({ version: VERSION, records: this.records, exportedAt: new Date().toISOString() }, null, 2);
  }

  importJSON(json: string): number {
    try {
      const parsed = JSON.parse(json);
      const records: BoreholeRecord[] = parsed.records || [];
      let added = 0;
      for (const rec of records) {
        // Skip duplicates (same lat/lon within 10m + same depth)
        const isDup = this.records.some(existing =>
          haversineKm(existing.latitude, existing.longitude, rec.latitude, rec.longitude) < 0.01
          && Math.abs(existing.totalDepth_m - rec.totalDepth_m) < 1
        );
        if (!isDup) {
          this.records.push({ ...rec, source: 'imported' });
          added++;
        }
      }
      if (added > 0) this.save();
      return added;
    } catch {
      return 0;
    }
  }

  importCSV(csv: string): number {
    const lines = csv.split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length < 2) return 0;

    const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
    const latIdx = headers.findIndex(h => h.includes('lat'));
    const lonIdx = headers.findIndex(h => h.includes('lon'));
    const depthIdx = headers.findIndex(h => h.includes('depth'));
    const yieldIdx = headers.findIndex(h => h.includes('yield'));
    const successIdx = headers.findIndex(h => h.includes('success'));

    if (latIdx < 0 || lonIdx < 0 || depthIdx < 0) return 0;

    let added = 0;
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map(c => c.trim());
      const lat = parseFloat(cols[latIdx]);
      const lon = parseFloat(cols[lonIdx]);
      const depth = parseFloat(cols[depthIdx]);
      if (isNaN(lat) || isNaN(lon) || isNaN(depth)) continue;
      if (lat < -90 || lat > 90 || lon < -180 || lon > 180) continue;

      const yld = yieldIdx >= 0 ? parseFloat(cols[yieldIdx]) || 0 : 0;
      const suc = successIdx >= 0 ? cols[successIdx].toLowerCase() !== 'false' && cols[successIdx] !== '0' : yld > 0;

      this.addRecord({
        latitude: lat, longitude: lon, country: '',
        totalDepth_m: depth, waterStrikeDepths_m: [], staticWaterLevel_m: depth * 0.3,
        yield_m3hr: yld, success: suc, lithologyLog: [],
        geophysicsUsed: [], source: 'imported', verified: false,
      });
      added++;
    }
    return added;
  }

  /** Clear all records */
  clear(): void {
    this.records = [];
    this.save();
  }
}

/* ── Utilities ────────────────────────────────────────────── */

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function avg(arr: number[]): number {
  return arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length;
}

function pearsonR(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length);
  if (n < 3) return 0;
  const mx = avg(x.slice(0, n));
  const my = avg(y.slice(0, n));
  let num = 0, dx2 = 0, dy2 = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - mx;
    const dy = y[i] - my;
    num += dx * dy;
    dx2 += dx * dx;
    dy2 += dy * dy;
  }
  const denom = Math.sqrt(dx2 * dy2);
  return denom === 0 ? 0 : num / denom;
}

function computeFeatureImportance(records: BoreholeRecord[]): IntelligenceInsight['predictiveFactors'] {
  if (records.length < 5) return [];
  const yields = records.map(r => r.yield_m3hr);

  const factors: { factor: string; importance: number; direction: string }[] = [];

  // Depth vs yield
  const depthCorr = pearsonR(records.map(r => r.totalDepth_m), yields);
  factors.push({ factor: 'Drilling Depth', importance: Math.abs(depthCorr), direction: depthCorr > 0 ? 'deeper = higher yield' : 'deeper = lower yield' });

  // Water strike depth vs yield
  const wsRecords = records.filter(r => r.waterStrikeDepths_m.length > 0);
  if (wsRecords.length >= 3) {
    const wsCorr = pearsonR(wsRecords.map(r => r.waterStrikeDepths_m[0]), wsRecords.map(r => r.yield_m3hr));
    factors.push({ factor: 'Water Strike Depth', importance: Math.abs(wsCorr), direction: wsCorr > 0 ? 'deeper strike = higher yield' : 'shallower strike = higher yield' });
  }

  // Number of geophysics methods vs yield
  const geoCorr = pearsonR(records.map(r => r.geophysicsUsed.length), yields);
  factors.push({ factor: 'Geophysics Methods Used', importance: Math.abs(geoCorr), direction: geoCorr > 0 ? 'more methods = higher yield' : 'diminishing returns' });

  // Fractured layers vs yield
  const fracRecords = records.filter(r => r.lithologyLog.some(l => l.fractured));
  const nonFracRecords = records.filter(r => !r.lithologyLog.some(l => l.fractured));
  if (fracRecords.length >= 2 && nonFracRecords.length >= 2) {
    const fracYield = avg(fracRecords.map(r => r.yield_m3hr));
    const nonFracYield = avg(nonFracRecords.map(r => r.yield_m3hr));
    const diff = fracYield - nonFracYield;
    factors.push({ factor: 'Fracture Presence', importance: Math.min(1, Math.abs(diff) / Math.max(1, avg(yields))), direction: diff > 0 ? 'fractured rock = higher yield' : 'fractured rock = no benefit' });
  }

  return factors.sort((a, b) => b.importance - a.importance);
}

/* ── Singleton Instance ───────────────────────────────────── */

const db = new BoreholeIntelligenceDB();

/* ── Public API ───────────────────────────────────────────── */

export function getBoreholeDB(): BoreholeIntelligenceDB {
  return db;
}

export function addBoreholeRecord(record: Omit<BoreholeRecord, 'id' | 'createdAt' | 'updatedAt'>): BoreholeRecord {
  return db.addRecord(record);
}

export function queryNearbyBoreholes(query: BoreholeQuery): BoreholeRecord[] {
  return db.queryNearby(query);
}

export function getBoreholeIntelligence(lat: number, lon: number, radiusKm?: number): IntelligenceInsight | null {
  return db.getIntelligence(lat, lon, radiusKm);
}

export function predictFromBoreholeDB(lat: number, lon: number, rockType?: string) {
  return db.predictFromDatabase(lat, lon, rockType);
}

export function getBoreholeDBCount(): number {
  return db.getCount();
}

export function exportBoreholeDB(): string {
  return db.exportJSON();
}

export function importBoreholeJSON(json: string): number {
  return db.importJSON(json);
}

export function importBoreholeCSV(csv: string): number {
  return db.importCSV(csv);
}

export function clearBoreholeDB(): void {
  db.clear();
}

export function generateBoreholeTrainingData(): TrainingDataPoint[] {
  return db.generateTrainingData();
}
