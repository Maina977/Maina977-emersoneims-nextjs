/**
 * GENERATOR ORACLE — Aggregated local-AI health.
 *
 * Routes call this on GET to report whether the local stack is reachable.
 * The UI's `useAIAvailable` hook consumes the same shape and renders
 * `AIUnavailableNotice` whenever `anyOnline` is false (or — strictly — when
 * the text reasoning model is unreachable, which is the minimum viable
 * surface for both Visual Diagnose and Expert Chat).
 */

import { ollamaPing } from './ollamaClient';
import { paddleOcrPing } from './paddleOcrClient';
import { retrievalPing } from './retrievalClient';
import { getLocalAiEnv } from './env';
import { isGeminiConfigured, getGeminiEnv } from './geminiClient';

export interface LocalAiHealth {
  ok: boolean; // text reasoning available — required for any diagnosis
  text: { configured: boolean; reachable: boolean; reason?: string; baseUrl: string | null };
  vision: { configured: boolean; reachable: boolean; reason?: string };
  ocr: { configured: boolean; reachable: boolean; reason?: string };
  retrieval: { configured: boolean; reachable: boolean; reason?: string };
  textModel: string;
  visionModel: string;
}

export async function getLocalAiHealth(): Promise<LocalAiHealth> {
  const env = getLocalAiEnv();
  const geminiActive = !env.baseUrl && isGeminiConfigured();
  const gemini = geminiActive ? getGeminiEnv() : null;

  const [tagsResult, ocr, retrieval] = await Promise.all([
    ollamaPing(),
    paddleOcrPing(),
    retrievalPing(),
  ]);

  // "Configured" means SOME text backend is wired up (Ollama OR Gemini).
  const textConfigured = !!env.baseUrl || isGeminiConfigured();
  const textReachable = tagsResult.ok;
  const models = tagsResult.modelsAvailable ?? [];

  // Vision availability: when Gemini is the backend, the configured vision
  // model (gemini-2.0-flash by default) is multimodal — vision is on.
  // When Ollama is the backend, vision is on only if a *VL* model is loaded.
  const visionReachable = geminiActive
    ? textReachable
    : textReachable &&
      models.some((m) => m.toLowerCase().includes('vl') || m.toLowerCase().includes('vision'));

  return {
    ok: textConfigured && textReachable,
    text: {
      configured: textConfigured,
      reachable: textReachable,
      reason: tagsResult.reason,
      baseUrl: tagsResult.baseUrl,
    },
    vision: {
      configured: textConfigured,
      reachable: visionReachable,
      reason: visionReachable
        ? undefined
        : geminiActive
          ? 'Gemini vision unreachable'
          : 'vision model not loaded in Ollama',
    },
    ocr: {
      configured: !!env.ocrUrl,
      reachable: ocr.ok,
      reason: ocr.reason,
    },
    retrieval: {
      configured: !!env.retrievalUrl,
      reachable: retrieval.ok,
      reason: retrieval.reason,
    },
    textModel: gemini?.textModel ?? env.textModel,
    visionModel: gemini?.visionModel ?? env.visionModel,
  };
}
