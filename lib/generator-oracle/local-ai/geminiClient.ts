/**
 * GENERATOR ORACLE — Google Gemini provider.
 *
 * Free, hosted alternative to a self-hosted Ollama deployment. Used
 * automatically when:
 *   - LOCAL_AI_BASE_URL is NOT set (no Ollama configured), AND
 *   - GEMINI_API_KEY IS set.
 *
 * Exposes the same call surface as the Ollama client so the routes in
 * `app/api/generator-oracle/*` and `lib/generator-oracle/aiDiagnosticService`
 * do not need to know which backend served the request — they get the same
 * envelope and the same error semantics.
 *
 * Why Gemini for this app:
 *   - Single provider that handles both text reasoning AND vision
 *     (gemini-2.0-flash is multimodal), so AIVisualDiagnostic, AIAnalyzer
 *     and ExpertAIChat can all be served by the same key.
 *   - Free tier with generous limits for low-traffic deployments
 *     (rotating keys / quotas are user-controlled, never embedded).
 *   - Supports `responseMimeType: 'application/json'` which matches the
 *     local-AI contract (`format: 'json'`) without any prompt acrobatics.
 *
 * What this file deliberately does NOT do:
 *   - It does not fabricate any output. If Gemini returns malformed JSON
 *     the caller's existing zod verifier rejects it and the route returns
 *     `OUTPUT_INVALID`, exactly like the Ollama path.
 *   - It does not bypass the asset-card gate, the rule engine, or the
 *     audit log — those all live upstream of this client.
 *
 * @copyright 2026 EmersonEIMS / Generator Oracle
 */

const DEFAULT_TEXT_MODEL = 'gemini-2.0-flash';
const DEFAULT_VISION_MODEL = 'gemini-2.0-flash';
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

export interface GeminiEnv {
  apiKey: string | null;
  textModel: string;
  visionModel: string;
  timeoutMs: number;
  maxOutputTokens: number;
}

export function getGeminiEnv(): GeminiEnv {
  const apiKey =
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() ||
    null;
  return {
    apiKey: apiKey || null,
    textModel: process.env.GEMINI_TEXT_MODEL?.trim() || DEFAULT_TEXT_MODEL,
    visionModel: process.env.GEMINI_VISION_MODEL?.trim() || DEFAULT_VISION_MODEL,
    timeoutMs: Number(process.env.GEMINI_TIMEOUT_MS) || 60_000,
    maxOutputTokens: Number(process.env.GEMINI_MAX_TOKENS) || 4096,
  };
}

export function isGeminiConfigured(): boolean {
  return !!getGeminiEnv().apiKey;
}

interface GeminiPart {
  text?: string;
  inlineData?: { mimeType: string; data: string };
}

interface GeminiContent {
  role: 'user' | 'model';
  parts: GeminiPart[];
}

export class GeminiUnavailableError extends Error {
  readonly code = 'GEMINI_UNAVAILABLE' as const;
  constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = 'GeminiUnavailableError';
  }
}

export class GeminiResponseError extends Error {
  readonly code = 'GEMINI_BAD_RESPONSE' as const;
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = 'GeminiResponseError';
  }
}

interface GenerateOpts {
  contents: GeminiContent[];
  systemInstruction?: string;
  model: string;
  format?: 'json';
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}

interface GenerateResult {
  text: string;
  model: string;
  totalDurationMs: number;
  promptTokens?: number;
  outputTokens?: number;
}

async function generate(opts: GenerateOpts): Promise<GenerateResult> {
  const env = getGeminiEnv();
  if (!env.apiKey) {
    throw new GeminiUnavailableError('GEMINI_API_KEY is not configured');
  }

  const url = `${API_BASE}/models/${encodeURIComponent(opts.model)}:generateContent?key=${encodeURIComponent(env.apiKey)}`;
  const startedAt = Date.now();

  const body: Record<string, unknown> = {
    contents: opts.contents,
    generationConfig: {
      temperature: opts.temperature ?? 0.2,
      maxOutputTokens: opts.maxTokens ?? env.maxOutputTokens,
      ...(opts.format === 'json' ? { responseMimeType: 'application/json' } : {}),
    },
  };
  if (opts.systemInstruction) {
    body.systemInstruction = { parts: [{ text: opts.systemInstruction }] };
  }

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), opts.timeoutMs ?? env.timeoutMs);

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
      cache: 'no-store',
    });
  } catch (err) {
    throw new GeminiUnavailableError('Could not reach Gemini API', err);
  } finally {
    clearTimeout(t);
  }

  if (!res.ok) {
    let detail = `${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      const msg = body?.error?.message;
      if (msg) detail += ` — ${msg}`;
    } catch {
      /* swallow */
    }
    throw new GeminiResponseError(`Gemini responded ${detail}`, res.status);
  }

  const data = (await res.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
      finishReason?: string;
    }>;
    usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
  };

  const text =
    data.candidates?.[0]?.content?.parts
      ?.map((p) => p.text ?? '')
      .join('')
      .trim() ?? '';

  return {
    text,
    model: opts.model,
    totalDurationMs: Date.now() - startedAt,
    promptTokens: data.usageMetadata?.promptTokenCount,
    outputTokens: data.usageMetadata?.candidatesTokenCount,
  };
}

/**
 * Chat completion. Mirrors the OllamaChatMessage[] shape; the first
 * `system` message becomes Gemini's `systemInstruction`, the rest are
 * mapped to `user`/`model` turns.
 */
export async function geminiChat(opts: {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
    images?: string[];
  }>;
  model?: string;
  format?: 'json';
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}): Promise<GenerateResult> {
  const env = getGeminiEnv();
  const systemBits: string[] = [];
  const contents: GeminiContent[] = [];

  for (const m of opts.messages) {
    if (m.role === 'system') {
      systemBits.push(m.content);
      continue;
    }
    const parts: GeminiPart[] = [];
    if (m.content) parts.push({ text: m.content });
    if (m.images && m.images.length) {
      for (const b64 of m.images) {
        parts.push({ inlineData: { mimeType: 'image/jpeg', data: b64 } });
      }
    }
    contents.push({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts,
    });
  }

  return generate({
    contents,
    systemInstruction: systemBits.join('\n\n') || undefined,
    model: opts.model ?? env.textModel,
    format: opts.format,
    temperature: opts.temperature,
    maxTokens: opts.maxTokens,
    timeoutMs: opts.timeoutMs,
  });
}

export async function geminiVision(opts: {
  prompt: string;
  imagesBase64: string[];
  model?: string;
  format?: 'json';
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}): Promise<GenerateResult> {
  const env = getGeminiEnv();
  return generate({
    contents: [
      {
        role: 'user',
        parts: [
          { text: opts.prompt },
          ...opts.imagesBase64.map((b64) => ({
            inlineData: { mimeType: 'image/jpeg', data: b64 },
          })),
        ],
      },
    ],
    model: opts.model ?? env.visionModel,
    format: opts.format,
    temperature: opts.temperature,
    maxTokens: opts.maxTokens,
    timeoutMs: opts.timeoutMs,
  });
}

export async function geminiPing(timeoutMs = 4000): Promise<{
  ok: boolean;
  reason?: string;
  modelsAvailable?: string[];
}> {
  const env = getGeminiEnv();
  if (!env.apiKey) {
    return { ok: false, reason: 'GEMINI_API_KEY unset' };
  }
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(
      `${API_BASE}/models?key=${encodeURIComponent(env.apiKey)}`,
      { signal: controller.signal, cache: 'no-store' },
    );
    if (!res.ok) {
      return { ok: false, reason: `HTTP ${res.status}` };
    }
    const data = (await res.json().catch(() => ({}))) as {
      models?: Array<{ name?: string }>;
    };
    return {
      ok: true,
      modelsAvailable: (data.models ?? [])
        .map((m) => (m.name ?? '').replace(/^models\//, ''))
        .filter(Boolean),
    };
  } catch (err) {
    return {
      ok: false,
      reason: err instanceof Error ? err.message : 'unreachable',
    };
  } finally {
    clearTimeout(t);
  }
}
