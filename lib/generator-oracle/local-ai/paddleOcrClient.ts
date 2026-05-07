/**
 * GENERATOR ORACLE — PaddleOCR sidecar client.
 *
 * Calls a HTTP wrapper around PaddleOCR (LOCAL_AI_OCR_URL). The sidecar is
 * expected to expose POST /ocr with body { image: <base64> } returning
 * { text: string, lines: string[] }. The exact wrapper spec is in
 * docs/local-ai/PADDLEOCR_SIDECAR.md (to be authored alongside the infra).
 *
 * Status: SCAFFOLDED. No sidecar runs in production today — `paddleOcrPing`
 * returns false until LOCAL_AI_OCR_URL points at a reachable instance.
 */

import { getLocalAiEnv } from './env';

export interface PaddleOcrResult {
  text: string;
  lines: string[];
  raw?: unknown;
}

export class PaddleOcrUnavailableError extends Error {
  readonly code = 'PADDLEOCR_UNAVAILABLE' as const;
  constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = 'PaddleOcrUnavailableError';
  }
}

export async function paddleOcrExtract(
  imageBase64: string,
  opts?: { timeoutMs?: number },
): Promise<PaddleOcrResult> {
  const env = getLocalAiEnv();
  if (!env.ocrUrl) {
    throw new PaddleOcrUnavailableError('LOCAL_AI_OCR_URL is not configured');
  }
  const controller = new AbortController();
  const t = setTimeout(
    () => controller.abort(),
    opts?.timeoutMs ?? env.timeoutMs,
  );
  try {
    const res = await fetch(`${env.ocrUrl}/ocr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageBase64 }),
      signal: controller.signal,
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new PaddleOcrUnavailableError(
        `PaddleOCR sidecar responded ${res.status}`,
      );
    }
    const data = (await res.json()) as {
      text?: string;
      lines?: string[];
    };
    return {
      text: data.text ?? '',
      lines: data.lines ?? [],
      raw: data,
    };
  } catch (err) {
    if (err instanceof PaddleOcrUnavailableError) throw err;
    throw new PaddleOcrUnavailableError(
      `Could not reach PaddleOCR sidecar`,
      err,
    );
  } finally {
    clearTimeout(t);
  }
}

export async function paddleOcrPing(
  timeoutMs = 4000,
): Promise<{ ok: boolean; ocrUrl: string | null; reason?: string }> {
  const env = getLocalAiEnv();
  if (!env.ocrUrl) {
    return { ok: false, ocrUrl: null, reason: 'LOCAL_AI_OCR_URL unset' };
  }
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${env.ocrUrl}/health`, {
      signal: controller.signal,
      cache: 'no-store',
    });
    return {
      ok: res.ok,
      ocrUrl: env.ocrUrl,
      reason: res.ok ? undefined : `HTTP ${res.status}`,
    };
  } catch (err) {
    return {
      ok: false,
      ocrUrl: env.ocrUrl,
      reason: err instanceof Error ? err.message : 'unreachable',
    };
  } finally {
    clearTimeout(t);
  }
}
