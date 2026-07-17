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
import { isGroqConfigured, getGroqEnv } from './groqClient';

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
  // Cloud provider precedence when no local Ollama: Groq (free) then Gemini.
  const groqActive = !env.baseUrl && isGroqConfigured();
  const geminiActive = !env.baseUrl && !groqActive && isGeminiConfigured();
  const groq = groqActive ? getGroqEnv() : null;
  const gemini = geminiActive ? getGeminiEnv() : null;
  const hostedActive = groqActive || geminiActive;

  const [tagsResult, ocr, retrieval] = await Promise.all([
    ollamaPing(),
    paddleOcrPing(),
    retrievalPing(),
  ]);

  // "Configured" means SOME text backend is wired up (Ollama OR Groq OR Gemini).
  const textConfigured = !!env.baseUrl || isGroqConfigured() || isGeminiConfigured();
  const textReachable = tagsResult.ok;
  const models = tagsResult.modelsAvailable ?? [];

  // Vision availability: a hosted multimodal model is on when the backend is
  // reachable. For Ollama it's on only if a *VL*/vision model is loaded.
  const visionReachable = hostedActive
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
        : hostedActive
          ? 'hosted vision unreachable'
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
    textModel: groq?.textModel ?? gemini?.textModel ?? env.textModel,
    visionModel: groq?.visionModel ?? gemini?.visionModel ?? env.visionModel,
  };
}
