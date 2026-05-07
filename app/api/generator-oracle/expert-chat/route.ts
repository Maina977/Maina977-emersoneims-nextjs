/**
 * GENERATOR ORACLE — Expert AI Chat (LOCAL stack)
 *
 * Replaces the previous Anthropic-text implementation. The live chat path
 * is now: asset-card validation → deterministic rule engine → local
 * retrieval → Qwen2.5 via Ollama → zod-validated structured output →
 * confidence verifier.
 *
 * Track 1 (deployable now): Anthropic is removed from the live path. The
 * route returns AI_UNAVAILABLE when LOCAL_AI_BASE_URL is unset or
 * unreachable; never silently falls back to canned text.
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
  ollamaChat,
  OllamaUnavailableError,
  OllamaResponseError,
  buildExpertChatPrompt,
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
  if (isAIDisabledServer()) {
    logAudit({
      surface: 'expert_chat',
      outcome: 'ai_unavailable',
      assetCardPresent: false,
      detail: 'GENERATOR_ORACLE_AI_DISABLED flag set',
    });
    return jsonEnvelope(
      {
        ok: false,
        code: 'AI_UNAVAILABLE',
        message: 'Generator Oracle AI is disabled on this deployment.',
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

  // Asset card is mandatory before any conversation can start.
  const cardParse = AssetCardSchema.safeParse(body.assetCard);
  if (!cardParse.success) {
    logAudit({
      surface: 'expert_chat',
      outcome: 'asset_card_invalid',
      assetCardPresent: false,
      detail: cardParse.error.issues.map((i) => i.message).join('; '),
    });
    return jsonEnvelope(
      {
        ok: false,
        code: 'ASSET_CARD_REQUIRED',
        message:
          'Asset card is required: provide make, model, controller, serial, and firmware before chatting with Expert AI.',
        detail: cardParse.error.issues
          .map((i) => `${i.path.join('.') || 'card'}: ${i.message}`)
          .join('; '),
      },
      400,
    );
  }
  const card: AssetCard = cardParse.data;

  const messagesRaw = Array.isArray(body.messages) ? body.messages : null;
  if (!messagesRaw || messagesRaw.length === 0) {
    return jsonEnvelope(
      {
        ok: false,
        code: 'INVALID_REQUEST',
        message: 'messages[] is required.',
      },
      400,
    );
  }
  const messages = messagesRaw
    .filter(
      (m): m is { role: string; content: string } =>
        !!m &&
        typeof (m as { content?: unknown }).content === 'string' &&
        ((m as { role?: unknown }).role === 'user' ||
          (m as { role?: unknown }).role === 'assistant'),
    )
    .map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));
  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  if (!lastUser) {
    return jsonEnvelope(
      {
        ok: false,
        code: 'INVALID_REQUEST',
        message: 'No user message found in messages[].',
      },
      400,
    );
  }

  const preflight = runAllPreflightRules({
    card,
    faultCode: typeof body.faultCode === 'string' ? body.faultCode : null,
    freeText: lastUser.content,
    backupConfirmed: body.backupConfirmed === true,
  });
  if (!preflight.ok) {
    logAudit({
      surface: 'expert_chat',
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

  const env = getLocalAiEnv();
  const health = await getLocalAiHealth();
  if (!health.ok) {
    logAudit({
      surface: 'expert_chat',
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
          'Local AI stack is not configured or not reachable. Expert chat cannot run until LOCAL_AI_BASE_URL points at a healthy Ollama with Qwen2.5.',
        detail: health.text.reason ?? undefined,
      },
      503,
    );
  }

  const retrievalText = [
    `${card.make} ${card.model} ${card.controller}`,
    lastUser.content,
  ]
    .filter(Boolean)
    .join('\n');
  const retrieval = await retrievalQuery({
    text: retrievalText,
    k: 5,
    filter: { controller: card.controller, make: card.make },
  });
  const citations = hitsToCitations(retrieval.hits);

  // History excludes the final user turn; the prompt builder appends it.
  const history = messages.slice(0, -1).map((m) => ({
    role: m.role,
    content: m.content.slice(0, 2000),
  }));

  const { system, userMessages } = buildExpertChatPrompt({
    card,
    question: lastUser.content,
    citations,
    history,
  });

  let modelText: string;
  try {
    const resp = await ollamaChat({
      messages: [
        { role: 'system', content: system },
        ...userMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      ],
      format: 'json',
    });
    modelText = sanitizeModelOutput(resp.text);
  } catch (err) {
    if (
      err instanceof OllamaUnavailableError ||
      err instanceof OllamaResponseError
    ) {
      logAudit({
        surface: 'expert_chat',
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
          message: 'Local reasoning model call failed.',
          detail: err.message,
        },
        503,
      );
    }
    return jsonEnvelope(
      {
        ok: false,
        code: 'INTERNAL',
        message: 'Internal error during expert chat call.',
        detail: err instanceof Error ? err.message : undefined,
      },
      500,
    );
  }

  const draft = extractJsonObject(modelText);
  const parsed = DiagnosisOutputSchema.safeParse(draft);
  if (!parsed.success) {
    logAudit({
      surface: 'expert_chat',
      outcome: 'output_invalid',
      assetCardPresent: true,
      controller: card.controller,
      make: card.make,
      model: card.model,
      detail: parsed.error.issues
        .map((i) => `${i.path.join('.')}: ${i.message}`)
        .join('; '),
    });
    return jsonEnvelope(
      {
        ok: false,
        code: 'OUTPUT_INVALID',
        message:
          'The local model returned output that did not match the diagnosis schema.',
        detail: parsed.error.issues
          .map((i) => `${i.path.join('.')}: ${i.message}`)
          .join('; '),
      },
      502,
    );
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

  logAudit({
    surface: 'expert_chat',
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
    service: 'Generator Oracle Expert AI Chat (local-AI)',
    aiConfigured: !aiDisabledByFlag && health.ok,
    aiDisabledByFlag,
    health,
  });
}
