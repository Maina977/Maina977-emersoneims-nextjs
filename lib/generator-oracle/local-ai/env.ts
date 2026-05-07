/**
 * GENERATOR ORACLE — Local AI env access.
 *
 * Centralises every env var the local-AI stack reads, so we have one place
 * to audit what is configured. None of these have defaults pointing at a
 * real host — if an URL is unset the corresponding capability reports
 * "unavailable" and the route refuses rather than silently falling back.
 */

export interface LocalAiEnv {
  baseUrl: string | null; // Ollama HTTP base
  textModel: string;
  visionModel: string;
  ocrUrl: string | null; // PaddleOCR sidecar
  retrievalUrl: string | null; // Vector / retrieval sidecar
  timeoutMs: number;
  maxOutputTokens: number;
  cloudFallbackEnabled: boolean; // explicit, off by default — non-diagnostic only
}

function trim(value: string | undefined): string | null {
  if (!value) return null;
  const v = value.trim();
  if (!v) return null;
  return v.replace(/\/+$/, '');
}

export function getLocalAiEnv(): LocalAiEnv {
  return {
    baseUrl: trim(process.env.LOCAL_AI_BASE_URL),
    textModel: process.env.LOCAL_AI_TEXT_MODEL?.trim() || 'qwen2.5:7b-instruct',
    visionModel: process.env.LOCAL_AI_VISION_MODEL?.trim() || 'qwen2.5vl:7b',
    ocrUrl: trim(process.env.LOCAL_AI_OCR_URL),
    retrievalUrl: trim(process.env.LOCAL_AI_RETRIEVAL_URL),
    timeoutMs: Number(process.env.LOCAL_AI_TIMEOUT_MS) || 60_000,
    maxOutputTokens: Number(process.env.LOCAL_AI_MAX_TOKENS) || 4096,
    cloudFallbackEnabled:
      (process.env.GENERATOR_ORACLE_CLOUD_FALLBACK || '').toLowerCase() === 'true',
  };
}
