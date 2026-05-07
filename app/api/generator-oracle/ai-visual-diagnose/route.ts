/**
 * GENERATOR ORACLE — AI Visual Diagnose (LOCAL stack)
 *
 * Replaces the previous Anthropic-vision implementation. The live
 * diagnostic path is now: asset-card validation → deterministic rule
 * engine → PaddleOCR → local retrieval → Qwen2.5-VL via Ollama → zod-
 * validated structured output → confidence verifier.
 *
 * Track 1 (deployable now): Anthropic is removed from the live path. If
 * LOCAL_AI_BASE_URL is unset or unreachable, the route returns a typed
 * AI_UNAVAILABLE envelope (no silent fallback to mocks, no canned demo).
 *
 * Track 2 (scaffolded): the local-AI clients (Ollama, PaddleOCR,
 * retrieval) exist on disk and are exercised end-to-end here, but they
 * stay in "unavailable" until LOCAL_AI_BASE_URL etc. point at a real
 * inference host (see .env.example).
 *
 * @copyright 2026 EmersonEIMS / Generator Oracle
 */

import { NextRequest, NextResponse } from 'next/server';
import { isAIDisabledServer } from '@/lib/generator-oracle/aiFlags';
import {
  AssetCardSchema,
  DiagnosisOutputSchema,
  type ApiEnvelope,
  type AssetCard,
  type DiagnosisOutput,
  runAllPreflightRules,
  hitsToCitations,
  retrievalQuery,
  paddleOcrExtract,
  PaddleOcrUnavailableError,
  ollamaVision,
  OllamaUnavailableError,
  OllamaResponseError,
  buildVisualDiagnosisPrompt,
  sanitizeOcrText,
  sanitizeModelOutput,
  extractJsonObject,
  labelConfidence,
  summarizeViolations,
  logAudit,
  getLocalAiHealth,
  getLocalAiEnv,
} from '@/lib/generator-oracle/local-ai';

function jsonEnvelope(env: ApiEnvelope, status: number) {
  return NextResponse.json(env, { status });
}

export async function POST(request: NextRequest) {
  // Deployment kill-switch — preserved from prior route.
  if (isAIDisabledServer()) {
    logAudit({
      surface: 'visual_diagnose',
      outcome: 'ai_unavailable',
      assetCardPresent: false,
      detail: 'GENERATOR_ORACLE_AI_DISABLED flag set',
    });
    return jsonEnvelope(
      {
        ok: false,
        code: 'AI_UNAVAILABLE',
        message:
          'Generator Oracle AI is disabled on this deployment.',
      },
      503,
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return jsonEnvelope(
      {
        ok: false,
        code: 'INVALID_REQUEST',
        message: 'Request body could not be parsed as JSON.',
      },
      400,
    );
  }

  const imageData =
    typeof body.image === 'string'
      ? body.image
      : Array.isArray(body.images) && typeof body.images[0] === 'string'
        ? (body.images[0] as string)
        : null;

  if (!imageData) {
    return jsonEnvelope(
      {
        ok: false,
        code: 'INVALID_REQUEST',
        message: 'No image provided.',
      },
      400,
    );
  }

  // Asset card is mandatory — blueprint section A/B.
  const cardParse = AssetCardSchema.safeParse(body.assetCard);
  if (!cardParse.success) {
    logAudit({
      surface: 'visual_diagnose',
      outcome: 'asset_card_invalid',
      assetCardPresent: false,
      detail: cardParse.error.issues.map((i) => i.message).join('; '),
    });
    return jsonEnvelope(
      {
        ok: false,
        code: 'ASSET_CARD_REQUIRED',
        message:
          'Asset card is required: provide make, model, controller, serial, and firmware before requesting a visual diagnosis.',
        detail: cardParse.error.issues
          .map((i) => `${i.path.join('.') || 'card'}: ${i.message}`)
          .join('; '),
      },
      400,
    );
  }
  const card: AssetCard = cardParse.data;
  const symptom = typeof body.symptom === 'string' ? body.symptom : undefined;

  // Pre-flight deterministic rules.
  const preflight = runAllPreflightRules({
    card,
    faultCode: typeof body.faultCode === 'string' ? body.faultCode : null,
    freeText: symptom ?? null,
    backupConfirmed: body.backupConfirmed === true,
  });
  if (!preflight.ok) {
    logAudit({
      surface: 'visual_diagnose',
      outcome: 'rule_block',
      assetCardPresent: true,
      controller: card.controller,
      make: card.make,
      model: card.model,
      ruleViolations: summarizeViolations(preflight.violations),
    });
    return jsonEnvelope(
      {
        ok: false,
        code: 'RULE_BLOCK',
        message:
          'Refused by deterministic rule engine. See detail for the failing rule(s).',
        detail: summarizeViolations(preflight.violations).join(' | '),
      },
      400,
    );
  }

  // Health gate — if local stack is offline, return AI_UNAVAILABLE.
  const env = getLocalAiEnv();
  const health = await getLocalAiHealth();
  if (!health.ok) {
    logAudit({
      surface: 'visual_diagnose',
      outcome: 'ai_unavailable',
      assetCardPresent: true,
      controller: card.controller,
      make: card.make,
      model: card.model,
      detail: env.baseUrl
        ? `text-reasoning unreachable: ${health.text.reason ?? 'unknown'}`
        : 'LOCAL_AI_BASE_URL is not configured',
    });
    return jsonEnvelope(
      {
        ok: false,
        code: 'AI_UNAVAILABLE',
        message:
          'Local AI stack is not configured or not reachable. Visual diagnosis cannot run until LOCAL_AI_BASE_URL points at a healthy Ollama with Qwen2.5-VL.',
        detail: health.text.reason ?? undefined,
      },
      503,
    );
  }

  // OCR (best-effort — when sidecar is offline we proceed with empty text).
  const base64 = imageData.replace(/^data:image\/\w+;base64,/, '');
  let ocrText = '';
  try {
    if (health.ocr.reachable) {
      const ocr = await paddleOcrExtract(base64);
      ocrText = sanitizeOcrText(ocr.text);
    }
  } catch (err) {
    if (!(err instanceof PaddleOcrUnavailableError)) {
      // unexpected — don't fail the whole pipeline, just record it.
      console.error('[visual-diagnose] OCR error:', err);
    }
  }

  // Retrieval (best-effort).
  const retrievalText = [
    `${card.make} ${card.model} ${card.controller} firmware ${card.firmware}`,
    symptom ?? '',
    ocrText,
  ]
    .filter(Boolean)
    .join('\n');
  const retrieval = await retrievalQuery({
    text: retrievalText,
    k: 5,
    filter: { controller: card.controller, make: card.make },
  });
  const citations = hitsToCitations(retrieval.hits);

  // Vision reasoning via Qwen2.5-VL.
  const { system, user } = buildVisualDiagnosisPrompt({
    card,
    ocrText,
    citations,
    symptom,
  });

  let modelText: string;
  try {
    const resp = await ollamaVision({
      prompt: `${system}\n\n${user}`,
      imagesBase64: [base64],
      format: 'json',
    });
    modelText = sanitizeModelOutput(resp.text);
  } catch (err) {
    if (
      err instanceof OllamaUnavailableError ||
      err instanceof OllamaResponseError
    ) {
      logAudit({
        surface: 'visual_diagnose',
        outcome: 'ai_unavailable',
        assetCardPresent: true,
        controller: card.controller,
        make: card.make,
        model: card.model,
        detail: err.message,
      });
      return jsonEnvelope(
        {
          ok: false,
          code: 'AI_UNAVAILABLE',
          message: 'Local vision model call failed.',
          detail: err.message,
        },
        503,
      );
    }
    logAudit({
      surface: 'visual_diagnose',
      outcome: 'internal_error',
      assetCardPresent: true,
      controller: card.controller,
      make: card.make,
      model: card.model,
      detail: err instanceof Error ? err.message : 'unknown',
    });
    return jsonEnvelope(
      {
        ok: false,
        code: 'INTERNAL',
        message: 'Internal error during visual diagnosis.',
        detail: err instanceof Error ? err.message : undefined,
      },
      500,
    );
  }

  const draftJson = extractJsonObject(modelText);
  const parsedDraft = DiagnosisOutputSchema.safeParse(draftJson);
  if (!parsedDraft.success) {
    logAudit({
      surface: 'visual_diagnose',
      outcome: 'output_invalid',
      assetCardPresent: true,
      controller: card.controller,
      make: card.make,
      model: card.model,
      detail: parsedDraft.error.issues
        .map((i) => `${i.path.join('.')}: ${i.message}`)
        .join('; '),
    });
    return jsonEnvelope(
      {
        ok: false,
        code: 'OUTPUT_INVALID',
        message:
          'The local model returned output that did not match the diagnosis schema.',
        detail: parsedDraft.error.issues
          .map((i) => `${i.path.join('.')}: ${i.message}`)
          .join('; '),
      },
      502,
    );
  }

  const verifierLabel = labelConfidence({
    citations,
    ruleViolations: preflight.violations,
  });

  const finalResult: DiagnosisOutput = {
    ...parsedDraft.data,
    confidence: verifierLabel,
    evidenceUsed: citations,
    ruleViolations: summarizeViolations(preflight.violations),
    modelMeta: {
      textModel: env.textModel,
      visionModel: env.visionModel,
      ocrEngine: health.ocr.reachable ? 'paddleocr' : 'unavailable',
      retrievalSource: retrieval.configured ? 'local-vector' : 'unavailable',
    },
  };

  logAudit({
    surface: 'visual_diagnose',
    outcome: 'ok',
    assetCardPresent: true,
    controller: card.controller,
    make: card.make,
    model: card.model,
    ruleViolations: summarizeViolations(preflight.violations),
  });

  return jsonEnvelope(
    { ok: true, source: 'local-ai', result: finalResult },
    200,
  );
}

export async function GET() {
  const aiDisabledByFlag = isAIDisabledServer();
  const health = await getLocalAiHealth();
  return NextResponse.json({
    service: 'Generator Oracle Visual Diagnose (local-AI)',
    aiConfigured: !aiDisabledByFlag && health.ok,
    aiDisabledByFlag,
    health,
  });
}
