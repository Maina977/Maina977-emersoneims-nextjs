/**
 * BACKEND API CLIENT — Bridges the frontend analyzer to the backend services
 *
 * Connects the browser-based analyzer to the FastAPI backend when available.
 * Falls back gracefully to free API-only mode when backend is unreachable.
 *
 * This solves the frontend↔backend disconnect: the standalone analyzer can now
 * optionally leverage server-side ML models, Earth Engine, and PostGIS queries.
 */

export interface BackendConfig {
  baseUrl: string;
  timeout: number;
  authToken?: string;
}

interface BackendStatus {
  available: boolean;
  version?: string;
  capabilities?: string[];
  earthEngineEnabled?: boolean;
  mlModelsLoaded?: string[];
}

const DEFAULT_CONFIG: BackendConfig = {
  baseUrl: typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}:8000/api/v1`
    : 'http://localhost:8000/api/v1',
  timeout: 15000,
};

let cachedStatus: BackendStatus | null = null;
let statusCheckedAt = 0;
const STATUS_CACHE_MS = 60_000; // Re-check every 60 seconds

/**
 * Check if backend is reachable and what capabilities it offers.
 */
export async function checkBackendStatus(config?: Partial<BackendConfig>): Promise<BackendStatus> {
  const now = Date.now();
  if (cachedStatus && (now - statusCheckedAt) < STATUS_CACHE_MS) {
    return cachedStatus;
  }

  const cfg = { ...DEFAULT_CONFIG, ...config };
  try {
    const resp = await fetch(`${cfg.baseUrl.replace('/api/v1', '')}/health`, {
      signal: AbortSignal.timeout(cfg.timeout),
    });
    if (!resp.ok) {
      cachedStatus = { available: false };
      statusCheckedAt = now;
      return cachedStatus;
    }
    const data = await resp.json();
    cachedStatus = {
      available: true,
      version: data.version,
      capabilities: data.capabilities,
      earthEngineEnabled: data.earth_engine_enabled,
      mlModelsLoaded: data.ml_models,
    };
    statusCheckedAt = now;
    return cachedStatus;
  } catch {
    cachedStatus = { available: false };
    statusCheckedAt = now;
    return cachedStatus;
  }
}

/**
 * Submit a site analysis request to the backend.
 * Backend performs server-side ML (ResNet-50, U-Net, XGBoost, LSTM)
 * and Earth Engine satellite data fusion.
 */
export async function submitBackendAnalysis(
  lat: number,
  lon: number,
  config?: Partial<BackendConfig>,
): Promise<{
  jobId: string;
  status: string;
} | null> {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const status = await checkBackendStatus(cfg);
  if (!status.available) return null;

  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (cfg.authToken) {
      headers['Authorization'] = `Bearer ${cfg.authToken}`;
    }

    const resp = await fetch(`${cfg.baseUrl}/analysis/site`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ latitude: lat, longitude: lon }),
      signal: AbortSignal.timeout(cfg.timeout),
    });
    if (!resp.ok) return null;
    return await resp.json();
  } catch {
    return null;
  }
}

/**
 * Poll for backend analysis result.
 */
export async function getBackendAnalysisResult(
  jobId: string,
  config?: Partial<BackendConfig>,
): Promise<Record<string, unknown> | null> {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  try {
    const headers: Record<string, string> = {};
    if (cfg.authToken) {
      headers['Authorization'] = `Bearer ${cfg.authToken}`;
    }

    const resp = await fetch(`${cfg.baseUrl}/analysis/status/${encodeURIComponent(jobId)}`, {
      headers,
      signal: AbortSignal.timeout(cfg.timeout),
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    if (data.status === 'completed') return data.result;
    return null;
  } catch {
    return null;
  }
}

/**
 * Query backend Earth Engine satellite data.
 * Returns Sentinel-1/2, Landsat, GRACE data processed server-side.
 */
export async function queryBackendSatellite(
  lat: number,
  lon: number,
  config?: Partial<BackendConfig>,
): Promise<{
  sentinel2?: { ndvi: number; ndwi: number; mndwi: number; evi: number };
  sentinel1?: { vvMean: number; vhMean: number; coherence: number };
  landsat?: { lst: number; albedo: number };
  grace?: { twsAnomaly: number; trendCmYr: number };
  dem?: { elevation: number; slope: number; aspect: number; twi: number };
} | null> {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const status = await checkBackendStatus(cfg);
  if (!status.available || !status.earthEngineEnabled) return null;

  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (cfg.authToken) {
      headers['Authorization'] = `Bearer ${cfg.authToken}`;
    }

    const resp = await fetch(`${cfg.baseUrl}/satellite/query`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ latitude: lat, longitude: lon }),
      signal: AbortSignal.timeout(30000), // Satellite queries can be slow
    });
    if (!resp.ok) return null;
    return await resp.json();
  } catch {
    return null;
  }
}

/**
 * Submit drilling outcome feedback to the backend learning system.
 */
export async function submitDrillingFeedback(
  feedback: {
    latitude: number;
    longitude: number;
    predictedDepth: number;
    actualDepth: number;
    predictedYield: number;
    actualYield: number;
    success: boolean;
    rockTypeEncountered?: string;
    waterQualityTDS?: number;
  },
  config?: Partial<BackendConfig>,
): Promise<boolean> {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const status = await checkBackendStatus(cfg);
  if (!status.available) return false;

  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (cfg.authToken) {
      headers['Authorization'] = `Bearer ${cfg.authToken}`;
    }

    const resp = await fetch(`${cfg.baseUrl}/learning/outcomes`, {
      method: 'POST',
      headers,
      body: JSON.stringify(feedback),
      signal: AbortSignal.timeout(cfg.timeout),
    });
    return resp.ok;
  } catch {
    return false;
  }
}
