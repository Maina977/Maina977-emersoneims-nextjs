/**
 * GENERATOR ORACLE — Ollama client.
 *
 * Talks to a self-hosted Ollama instance (LOCAL_AI_BASE_URL) using the
 * native /api/generate and /api/chat endpoints. Qwen2.5 is used for
 * structured text reasoning; Qwen2.5-VL is used for vision. There is no
 * silent fallback — if the server is unreachable the caller gets a typed
 * error and the route returns AI_UNAVAILABLE.
 *
 * Status: SCAFFOLDED. The code path runs end-to-end against a real Ollama
 * server, but production (Vercel) cannot reach a private Ollama unless an
 * inference gateway URL is supplied via LOCAL_AI_BASE_URL. Until then the
 * health check returns false and routes return AI_UNAVAILABLE.
 */

import { getLocalAiEnv } from './env';
import {
  geminiChat,
  geminiVision,
  geminiPing,
  isGeminiConfigured,
  GeminiUnavailableError,
  GeminiResponseError,
} from './geminiClient';

export interface OllamaChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  images?: string[]; // base64 (no data URL prefix) for vision models
}

export interface OllamaGenerateResult {
  text: string;
  model: string;
  totalDurationMs: number;
  promptEvalCount?: number;
  evalCount?: number;
  done: boolean;
}

export class OllamaUnavailableError extends Error {
  readonly code = 'OLLAMA_UNAVAILABLE' as const;
  constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = 'OllamaUnavailableError';
  }
}

export class OllamaResponseError extends Error {
  readonly code = 'OLLAMA_BAD_RESPONSE' as const;
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = 'OllamaResponseError';
  }
}

async function postJson(
  url: string,
  body: unknown,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
      cache: 'no-store',
    });
  } finally {
    clearTimeout(t);
  }
}

export async function ollamaChat(opts: {
  messages: OllamaChatMessage[];
  model?: string;
  format?: 'json';
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}): Promise<OllamaGenerateResult> {
  const env = getLocalAiEnv();

  // Provider routing: if no local Ollama is configured but a Gemini key is
  // present, transparently use Gemini. Routes and the diagnostic service
  // continue to call this function — the abstraction lets them stay
  // backend-agnostic. Errors are remapped onto the existing typed error
  // classes so the route's `instanceof OllamaUnavailableError` checks still
  // trigger the same `AI_UNAVAILABLE` envelope.
  if (!env.baseUrl && isGeminiConfigured()) {
    try {
      const r = await geminiChat(opts);
      return {
        text: r.text,
        model: r.model,
        totalDurationMs: r.totalDurationMs,
        promptEvalCount: r.promptTokens,
        evalCount: r.outputTokens,
        done: true,
      };
    } catch (err) {
      if (err instanceof GeminiUnavailableError) {
        throw new OllamaUnavailableError(err.message, err);
      }
      if (err instanceof GeminiResponseError) {
        throw new OllamaResponseError(err.message, err.status);
      }
      throw err;
    }
  }

  if (!env.baseUrl) {
    throw new OllamaUnavailableError('LOCAL_AI_BASE_URL is not configured');
  }

  const url = `${env.baseUrl}/api/chat`;
  const model = opts.model ?? env.textModel;
  const startedAt = Date.now();

  let res: Response;
  try {
    res = await postJson(
      url,
      {
        model,
        messages: opts.messages,
        stream: false,
        format: opts.format,
        options: {
          temperature: opts.temperature ?? 0.2,
          num_predict: opts.maxTokens ?? env.maxOutputTokens,
        },
      },
      opts.timeoutMs ?? env.timeoutMs,
    );
  } catch (err) {
    throw new OllamaUnavailableError(
      `Could not reach Ollama at ${env.baseUrl}`,
      err,
    );
  }

  if (!res.ok) {
    throw new OllamaResponseError(
      `Ollama responded ${res.status} ${res.statusText}`,
      res.status,
    );
  }

  const data = (await res.json()) as {
    message?: { content?: string };
    done?: boolean;
    prompt_eval_count?: number;
    eval_count?: number;
  };

  return {
    text: data.message?.content ?? '',
    model,
    totalDurationMs: Date.now() - startedAt,
    promptEvalCount: data.prompt_eval_count,
    evalCount: data.eval_count,
    done: data.done ?? true,
  };
}

export async function ollamaVision(opts: {
  prompt: string;
  imagesBase64: string[]; // raw base64 (no data: URL prefix)
  model?: string;
  format?: 'json';
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}): Promise<OllamaGenerateResult> {
  const env = getLocalAiEnv();

  // Same provider routing as ollamaChat — Gemini's multimodal model
  // handles vision requests with the exact same call surface.
  if (!env.baseUrl && isGeminiConfigured()) {
    try {
      const r = await geminiVision(opts);
      return {
        text: r.text,
        model: r.model,
        totalDurationMs: r.totalDurationMs,
        promptEvalCount: r.promptTokens,
        evalCount: r.outputTokens,
        done: true,
      };
    } catch (err) {
      if (err instanceof GeminiUnavailableError) {
        throw new OllamaUnavailableError(err.message, err);
      }
      if (err instanceof GeminiResponseError) {
        throw new OllamaResponseError(err.message, err.status);
      }
      throw err;
    }
  }

  return ollamaChat({
    model: opts.model ?? env.visionModel,
    messages: [
      {
        role: 'user',
        content: opts.prompt,
        images: opts.imagesBase64,
      },
    ],
    format: opts.format,
    temperature: opts.temperature,
    maxTokens: opts.maxTokens,
    timeoutMs: opts.timeoutMs,
  });
}

export async function ollamaPing(timeoutMs = 4000): Promise<{
  ok: boolean;
  baseUrl: string | null;
  reason?: string;
  modelsAvailable?: string[];
}> {
  const env = getLocalAiEnv();
  if (!env.baseUrl) {
    // No Ollama configured — report Gemini as the active backend if its
    // key is set. The shape stays compatible with the health check.
    if (isGeminiConfigured()) {
      const g = await geminiPing(timeoutMs);
      return {
        ok: g.ok,
        baseUrl: 'gemini://generativelanguage.googleapis.com',
        reason: g.reason,
        modelsAvailable: g.modelsAvailable,
      };
    }
    return { ok: false, baseUrl: null, reason: 'LOCAL_AI_BASE_URL unset' };
  }
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${env.baseUrl}/api/tags`, {
      signal: controller.signal,
      cache: 'no-store',
    });
    if (!res.ok) {
      return {
        ok: false,
        baseUrl: env.baseUrl,
        reason: `HTTP ${res.status}`,
      };
    }
    const data = (await res.json().catch(() => ({}))) as {
      models?: Array<{ name?: string }>;
    };
    return {
      ok: true,
      baseUrl: env.baseUrl,
      modelsAvailable: (data.models ?? []).map((m) => m.name ?? '').filter(Boolean),
    };
  } catch (err) {
    return {
      ok: false,
      baseUrl: env.baseUrl,
      reason: err instanceof Error ? err.message : 'unreachable',
    };
  } finally {
    clearTimeout(t);
  }
}
