/**
 * GENERATOR ORACLE — Local AI schemas (zod)
 *
 * These schemas define the contract between the rule engine, the local
 * inference layer (Ollama / Qwen2.5 / Qwen2.5-VL / PaddleOCR / retrieval),
 * the verifier, and the renderer. They are intentionally strict so a
 * malformed model output cannot propagate silently to the UI.
 *
 * @copyright 2026 EmersonEIMS / Generator Oracle
 */

import { z } from 'zod';

// ─── ASSET CARD (mandatory pre-use form) ──────────────────────────────────────

export const AssetCardSchema = z.object({
  make: z.string().min(1, 'make required').max(64),
  model: z.string().min(1, 'model required').max(64),
  controller: z.string().min(1, 'controller required').max(64),
  serial: z.string().min(1, 'serial required').max(64),
  firmware: z.string().min(1, 'firmware required').max(64),
});

export type AssetCard = z.infer<typeof AssetCardSchema>;

// ─── CONFIDENCE LABELS ────────────────────────────────────────────────────────

export const ConfidenceLabelSchema = z.enum([
  'verified',
  'probable',
  'generic',
  'verification_required',
]);

export type ConfidenceLabel = z.infer<typeof ConfidenceLabelSchema>;

// ─── EVIDENCE & CITATIONS ─────────────────────────────────────────────────────

export const EvidenceCitationSchema = z.object({
  source: z.string().min(1),
  snippet: z.string().min(1).max(2000),
  score: z.number().min(0).max(1).optional(),
  applicabilityConfirmed: z.boolean().default(false),
});

export type EvidenceCitation = z.infer<typeof EvidenceCitationSchema>;

// ─── DIAGNOSIS OUTPUT (the only shape the renderer accepts) ───────────────────

export const DiagnosisOutputSchema = z.object({
  verdict: z.string().min(1).max(500),
  // The model's self-assessed confidence is DISCARDED and overwritten by the
  // deterministic verifier (labelConfidence) in every route. So an off-enum or
  // missing value from the model (e.g. Llama-3.3 returning "high") must not
  // fail the whole diagnosis — coerce it to the conservative default here; the
  // verifier sets the authoritative label immediately after parse. This keeps
  // the output contract model-agnostic (Gemini complied; Groq/Llama needed it).
  confidence: ConfidenceLabelSchema.catch('verification_required'),
  evidenceUsed: z.array(EvidenceCitationSchema).default([]),
  evidenceMissing: z.array(z.string()).default([]),
  userSafeChecks: z.array(z.string()).default([]),
  technicianOnlyActions: z.array(z.string()).default([]),
  nextChecks: z.array(z.string()).default([]),
  safetyNotes: z.array(z.string()).default([]),
  ruleViolations: z.array(z.string()).default([]),
  modelMeta: z
    .object({
      textModel: z.string().optional(),
      visionModel: z.string().optional(),
      ocrEngine: z.string().optional(),
      retrievalSource: z.string().optional(),
    })
    .optional(),
});

export type DiagnosisOutput = z.infer<typeof DiagnosisOutputSchema>;

// ─── ENVELOPE (what the API routes return) ────────────────────────────────────

export const ApiEnvelopeOkSchema = z.object({
  ok: z.literal(true),
  source: z.literal('local-ai'),
  result: DiagnosisOutputSchema,
});

export const ApiEnvelopeErrSchema = z.object({
  ok: z.literal(false),
  code: z.enum([
    'AI_UNAVAILABLE',
    'ASSET_CARD_REQUIRED',
    'ASSET_CARD_INVALID',
    'RULE_BLOCK',
    'INVALID_REQUEST',
    'UNAUTHENTICATED',
    'OUTPUT_INVALID',
    'INTERNAL',
  ]),
  message: z.string(),
  detail: z.string().optional(),
});

export const ApiEnvelopeSchema = z.discriminatedUnion('ok', [
  ApiEnvelopeOkSchema,
  ApiEnvelopeErrSchema,
]);

export type ApiEnvelope = z.infer<typeof ApiEnvelopeSchema>;
