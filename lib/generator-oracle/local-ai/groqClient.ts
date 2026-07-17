/**
 * GENERATOR ORACLE — Groq provider (free, no billing).
 *
 * Free hosted alternative used automatically when:
 *   - LOCAL_AI_BASE_URL is NOT set (no Ollama configured), AND
 *   - GROQ_API_KEY IS set.
 *
 * WHY Groq (added 2026-07-17): the Gemini key available to this deployment had
 * free-tier quota = 0 (billing required). Groq offers a GENUINELY free tier
 * with NO billing and generous rate limits, running Llama-3.3-70B for text and
 * a Llama vision model for images — so all three AI surfaces (Expert Chat,
 * Parameter Analysis, Visual Diagnosis) work on a free key.
 *
 * It exposes the SAME call surface as the Ollama/Gemini clients
 * (groqChat / groqVision / groqPing / isGroqConfigured) so the routes and
 * aiDiagnosticService don't need to know which backend served the request.
 * Groq speaks the OpenAI-compatible Chat Completions API.
 *
 * It does NOT fabricate output: malformed JSON is rejected by the caller's
 * existing zod verifier exactly like the other providers, and it never bypasses
 * the asset-card gate, rule engine or audit log (all upstream of this client).
 *
 * @copyright 2026 EmersonEIMS / Generator Oracle
 */

const DEFAULT_TEXT_MODEL = 'llama-3.3-70b-versatile';
// Groq's current multimodal model; override with GROQ_VISION_MODEL if Groq
// rotates model ids. Vision is optional — text is the critical path.
const DEFAULT_VISION_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';
const API_BASE = 'https://api.groq.com/openai/v1';

export interface GroqEnv {
  apiKey: string | null;
  textModel: string;
  visionModel: string;
  timeoutMs: number;
  maxOutputTokens: number;
}

export function getGroqEnv(): GroqEnv {
  const apiKey = process.env.GROQ_API_KEY?.trim() || null;
  return {
    apiKey: apiKey || null,
    textModel: process.env.GROQ_TEXT_MODEL?.trim() || DEFAULT_TEXT_MODEL,
    visionModel: process.env.GROQ_VISION_MODEL?.trim() || DEFAULT_VISION_MODEL,
    timeoutMs: Number(process.env.GROQ_TIMEOUT_MS) || 60_000,
    maxOutputTokens: Number(process.env.GROQ_MAX_TOKENS) || 4096,
  };
}

export function isGroqConfigured(): boolean {
  return !!getGroqEnv().apiKey;
}

export class GroqUnavailableError extends Error {
  readonly code = 'GROQ_UNAVAILABLE' as const;
  constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = 'GroqUnavailableError';
  }
}

export class GroqResponseError extends Error {
  readonly code = 'GROQ_BAD_RESPONSE' as const;
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = 'GroqResponseError';
  }
}

interface GenerateResult {
  text: string;
  model: string;
  totalDurationMs: number;
  promptTokens?: number;
  outputTokens?: number;
}

// OpenAI-compatible message content: a string, or (for vision) an array of
// text/image_url parts.
type OpenAIContent =
  | string
  | Array<
      | { type: 'text'; text: string }
      | { type: 'image_url'; image_url: { url: string } }
    >;

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: OpenAIContent;
}

async function complete(opts: {
  messages: OpenAIMessage[];
  model: string;
  format?: 'json';
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}): Promise<GenerateResult> {
  const env = getGroqEnv();
  if (!env.apiKey) {
    throw new GroqUnavailableError('GROQ_API_KEY is not configured');
  }

  const startedAt = Date.now();
  const body: Record<string, unknown> = {
    model: opts.model,
    messages: opts.messages,
    temperature: opts.temperature ?? 0.2,
    max_tokens: opts.maxTokens ?? env.maxOutputTokens,
    ...(opts.format === 'json' ? { response_format: { type: 'json_object' } } : {}),
  };

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), opts.timeoutMs ?? env.timeoutMs);

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.apiKey}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
      cache: 'no-store',
    });
  } catch (err) {
    throw new GroqUnavailableError('Could not reach Groq API', err);
  } finally {
    clearTimeout(t);
  }

  if (!res.ok) {
    let detail = `${res.status} ${res.statusText}`;
    try {
      const errBody = await res.json();
      const msg = errBody?.error?.message;
      if (msg) detail += ` — ${msg}`;
    } catch {
      /* swallow */
    }
    throw new GroqResponseError(`Groq responded ${detail}`, res.status);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    usage?: { prompt_tokens?: number; completion_tokens?: number };
  };

  const text = data.choices?.[0]?.message?.content?.trim() ?? '';

  return {
    text,
    model: opts.model,
    totalDurationMs: Date.now() - startedAt,
    promptTokens: data.usage?.prompt_tokens,
    outputTokens: data.usage?.completion_tokens,
  };
}

/** Chat completion mirroring the Ollama/Gemini call surface. */
export async function groqChat(opts: {
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
  const env = getGroqEnv();
  const messages: OpenAIMessage[] = opts.messages.map((m) => {
    if (m.images && m.images.length && m.role === 'user') {
      const content: Exclude<OpenAIContent, string> = [];
      if (m.content) content.push({ type: 'text', text: m.content });
      for (const b64 of m.images) {
        content.push({
          type: 'image_url',
          image_url: { url: b64.startsWith('data:') ? b64 : `data:image/jpeg;base64,${b64}` },
        });
      }
      return { role: m.role, content };
    }
    return { role: m.role, content: m.content };
  });

  // Pick the vision model if any image parts are present.
  const hasImages = opts.messages.some((m) => m.images && m.images.length);
  return complete({
    messages,
    model: opts.model ?? (hasImages ? env.visionModel : env.textModel),
    format: opts.format,
    temperature: opts.temperature,
    maxTokens: opts.maxTokens,
    timeoutMs: opts.timeoutMs,
  });
}

export async function groqVision(opts: {
  prompt: string;
  imagesBase64: string[];
  model?: string;
  format?: 'json';
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}): Promise<GenerateResult> {
  const env = getGroqEnv();
  const content: Exclude<OpenAIContent, string> = [{ type: 'text', text: opts.prompt }];
  for (const b64 of opts.imagesBase64) {
    content.push({
      type: 'image_url',
      image_url: { url: b64.startsWith('data:') ? b64 : `data:image/jpeg;base64,${b64}` },
    });
  }
  return complete({
    messages: [{ role: 'user', content }],
    model: opts.model ?? env.visionModel,
    format: opts.format,
    temperature: opts.temperature,
    maxTokens: opts.maxTokens,
    timeoutMs: opts.timeoutMs,
  });
}

export async function groqPing(timeoutMs = 4000): Promise<{
  ok: boolean;
  reason?: string;
  modelsAvailable?: string[];
}> {
  const env = getGroqEnv();
  if (!env.apiKey) {
    return { ok: false, reason: 'GROQ_API_KEY unset' };
  }
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_BASE}/models`, {
      headers: { Authorization: `Bearer ${env.apiKey}` },
      signal: controller.signal,
      cache: 'no-store',
    });
    if (!res.ok) {
      return { ok: false, reason: `HTTP ${res.status}` };
    }
    const data = (await res.json().catch(() => ({}))) as {
      data?: Array<{ id?: string }>;
    };
    return {
      ok: true,
      modelsAvailable: (data.data ?? []).map((m) => m.id ?? '').filter(Boolean),
    };
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : 'unreachable' };
  } finally {
    clearTimeout(t);
  }
}
