/**
 * GENERATOR ORACLE — AI Diagnostic Service (LOCAL stack)
 *
 * Previously this module called Anthropic; that path has been removed.
 * The diagnostic flow is now:
 *
 *   - if useAI=false (or local stack offline) → return the deterministic
 *     local rule-based engine result (`performAIDiagnosis` in
 *     `ai-diagnostic-engine.ts`). This is NOT an AI result and is labelled
 *     `source: 'rule-based'`.
 *   - if useAI=true AND local stack is reachable → call Qwen2.5 via the
 *     local Ollama and return its `DiagnosisOutput` payload, labelled
 *     `source: 'local-ai'`.
 *   - if useAI=true AND local stack is offline → return `source:
 *     'unavailable'` with a typed reason. The service NEVER silently falls
 *     back to a different surface; the caller must decide what to render.
 *
 * @copyright 2026 EmersonEIMS / Generator Oracle
 */

import {
  performAIDiagnosis as performLocalDiagnosis,
  type GeneratorReadings,
  type AIAnalysisResult,
} from './ai-diagnostic-engine';
import { isAIDisabledServer } from './aiFlags';
import {
  AssetCardSchema,
  DiagnosisOutputSchema,
  type AssetCard,
  type DiagnosisOutput,
  buildExpertChatPrompt,
  hitsToCitations,
  retrievalQuery,
  ollamaChat,
  OllamaUnavailableError,
  OllamaResponseError,
  sanitizeModelOutput,
  extractJsonObject,
  labelConfidence,
  runAllPreflightRules,
  summarizeViolations,
  getLocalAiEnv,
  getLocalAiHealth,
  isGeminiConfigured,
} from './local-ai';

export interface AIDiagnosticRequest {
  readings: GeneratorReadings;
  faultCodes?: string[];
  symptoms?: string;
  assetCard?: unknown;
  controllerBrand?: string;
  generatorBrand?: string;
  engineBrand?: string;
  useAI?: boolean;
}

export type AIDiagnosticSource = 'rule-based' | 'local-ai' | 'unavailable';

export interface AIDiagnosticResponse {
  success: boolean;
  source: AIDiagnosticSource;
  result?: AIAnalysisResult;
  localAiResult?: DiagnosisOutput;
  error?: string;
  unavailableReason?: string;
  processingTimeMs: number;
}

export function isAIDiagnosticsEnabled(): boolean {
  if (isAIDisabledServer()) return false;
  // FIX (2026-07-17): this gate only checked LOCAL_AI_BASE_URL, so the AI
  // Parameter Analysis surface stayed dark on Vercel even though the generation
  // path (ollamaChat) transparently falls back to Gemini — the exact
  // inconsistency that left this surface off while Expert Chat and Visual
  // Diagnosis (which use the Gemini-aware health check) went live. Mirror that
  // health path: AI is available with a local Ollama server OR a Gemini key.
  return !!process.env.LOCAL_AI_BASE_URL || isGeminiConfigured();
}

function readingsSummary(r: GeneratorReadings, faultCodes?: string[], symptoms?: string): string {
  const parts: string[] = [];
  for (const [k, v] of Object.entries(r)) {
    if (v === undefined || v === null) continue;
    parts.push(`${k}=${v}`);
  }
  if (faultCodes?.length) parts.push(`fault_codes=${faultCodes.join(',')}`);
  if (symptoms) parts.push(`symptoms="${symptoms}"`);
  return parts.join('; ');
}

export async function getAIDiagnosis(
  request: AIDiagnosticRequest,
): Promise<AIDiagnosticResponse> {
  const startTime = Date.now();

  // Default branch — deterministic local engine. NOT AI.
  const shouldUseAI = request.useAI === true;
  if (!shouldUseAI) {
    const result = performLocalDiagnosis(request.readings);
    return {
      success: true,
      source: 'rule-based',
      result,
      processingTimeMs: Date.now() - startTime,
    };
  }

  // AI branch — local-AI only. Never paid AI.
  if (isAIDisabledServer()) {
    return {
      success: false,
      source: 'unavailable',
      unavailableReason: 'Generator Oracle AI is disabled on this deployment.',
      processingTimeMs: Date.now() - startTime,
    };
  }

  // Asset card is required for the AI branch (blueprint).
  const cardParse = AssetCardSchema.safeParse(request.assetCard);
  if (!cardParse.success) {
    return {
      success: false,
      source: 'unavailable',
      unavailableReason:
        'Asset card (make, model, controller, serial, firmware) is required for AI diagnosis.',
      processingTimeMs: Date.now() - startTime,
    };
  }
  const card: AssetCard = cardParse.data;

  const preflight = runAllPreflightRules({
    card,
    faultCode: request.faultCodes?.[0] ?? null,
    freeText: request.symptoms ?? null,
  });
  if (!preflight.ok) {
    return {
      success: false,
      source: 'unavailable',
      unavailableReason: `Refused by rule engine: ${summarizeViolations(preflight.violations).join('; ')}`,
      processingTimeMs: Date.now() - startTime,
    };
  }

  const env = getLocalAiEnv();
  const health = await getLocalAiHealth();
  if (!health.ok) {
    return {
      success: false,
      source: 'unavailable',
      unavailableReason: env.baseUrl
        ? `Local AI stack unreachable: ${health.text.reason ?? 'unknown'}`
        : 'LOCAL_AI_BASE_URL is not configured',
      processingTimeMs: Date.now() - startTime,
    };
  }

  const summary = readingsSummary(request.readings, request.faultCodes, request.symptoms);
  const retrieval = await retrievalQuery({
    text: `${card.make} ${card.model} ${card.controller}\n${summary}`,
    k: 5,
    filter: { controller: card.controller, make: card.make },
  });
  const citations = hitsToCitations(retrieval.hits);

  const { system, userMessages } = buildExpertChatPrompt({
    card,
    question: `Analyse the following live readings and produce a structured diagnosis. Treat threshold breaches as evidence and rank likely root causes. Live readings: ${summary || '(none)'}.`,
    citations,
  });

  try {
    const resp = await ollamaChat({
      messages: [
        { role: 'system', content: system },
        ...userMessages.map((m) => ({ role: m.role, content: m.content })),
      ],
      format: 'json',
    });
    const draft = extractJsonObject(sanitizeModelOutput(resp.text));
    const parsed = DiagnosisOutputSchema.safeParse(draft);
    if (!parsed.success) {
      return {
        success: false,
        source: 'unavailable',
        unavailableReason:
          'Local model returned output that failed schema validation.',
        error: parsed.error.issues
          .map((i) => `${i.path.join('.')}: ${i.message}`)
          .join('; '),
        processingTimeMs: Date.now() - startTime,
      };
    }
    const finalResult: DiagnosisOutput = {
      ...parsed.data,
      confidence: labelConfidence({
        citations,
        ruleViolations: preflight.violations,
      }),
      evidenceUsed: citations,
      ruleViolations: summarizeViolations(preflight.violations),
      modelMeta: {
        textModel: env.textModel,
        retrievalSource: retrieval.configured ? 'local-vector' : 'unavailable',
      },
    };
    return {
      success: true,
      source: 'local-ai',
      localAiResult: finalResult,
      processingTimeMs: Date.now() - startTime,
    };
  } catch (err) {
    if (
      err instanceof OllamaUnavailableError ||
      err instanceof OllamaResponseError
    ) {
      return {
        success: false,
        source: 'unavailable',
        unavailableReason: `Local model call failed: ${err.message}`,
        processingTimeMs: Date.now() - startTime,
      };
    }
    return {
      success: false,
      source: 'unavailable',
      unavailableReason: err instanceof Error ? err.message : 'Unknown error',
      processingTimeMs: Date.now() - startTime,
    };
  }
}

/**
 * Streaming variant — kept compatible with the existing GET stream
 * consumers. Currently the local stack call is non-streaming; we emit a
 * single 'complete' event at the end so the client transport stays the
 * same.
 */
export interface StreamingDiagnosticEvent {
  type: 'start' | 'delta' | 'complete' | 'error';
  content?: string;
  result?: AIAnalysisResult;
  localAiResult?: DiagnosisOutput;
  error?: string;
  source?: AIDiagnosticSource;
}

export async function* streamAIDiagnosis(
  request: AIDiagnosticRequest,
): AsyncGenerator<StreamingDiagnosticEvent, void, unknown> {
  yield { type: 'start' };
  const resp = await getAIDiagnosis(request);
  if (resp.success) {
    yield {
      type: 'complete',
      result: resp.result,
      localAiResult: resp.localAiResult,
      source: resp.source,
    };
  } else {
    yield {
      type: 'error',
      error: resp.unavailableReason ?? resp.error ?? 'Diagnosis failed',
      source: resp.source,
    };
  }
}

export function getServiceStatus(): {
  enabled: boolean;
  hasLocalAi: boolean;
  textModel: string;
  visionModel: string;
} {
  const env = getLocalAiEnv();
  return {
    enabled: isAIDiagnosticsEnabled(),
    hasLocalAi: !!env.baseUrl,
    textModel: env.textModel,
    visionModel: env.visionModel,
  };
}
