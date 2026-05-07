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

  const [tagsResult, ocr, retrieval] = await Promise.all([
    ollamaPing(),
    paddleOcrPing(),
    retrievalPing(),
  ]);

  const textConfigured = !!env.baseUrl;
  const textReachable = tagsResult.ok;
  const models = tagsResult.modelsAvailable ?? [];
  const visionReachable =
    textReachable &&
    models.some((m) => m.toLowerCase().includes('vl') || m.toLowerCase().includes('vision'));

  return {
    ok: textConfigured && textReachable,
    text: {
      configured: textConfigured,
      reachable: textReachable,
      reason: tagsResult.reason,
      baseUrl: env.baseUrl,
    },
    vision: {
      configured: textConfigured,
      reachable: visionReachable,
      reason: visionReachable ? undefined : 'vision model not loaded in Ollama',
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
    textModel: env.textModel,
    visionModel: env.visionModel,
  };
}
