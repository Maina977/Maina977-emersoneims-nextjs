/**
 * GENERATOR ORACLE — Output / OCR sanitization.
 *
 * Two responsibilities:
 *   1. Strip prompt-injection vectors that arrive via OCR text on a
 *      photographed nameplate or controller display ("ignore previous
 *      instructions", role markers, tool-call hints).
 *   2. Sanitize the model's text output before it reaches the renderer
 *      (no script tags, no role-tag exfiltration, length cap).
 *
 * These are belt-and-braces: the model is also given a system prompt that
 * tells it to ignore any instructions found inside extracted text. The
 * sanitizer exists so a single regression in the prompt doesn't become a
 * downstream injection.
 */

const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions?/gi,
  /disregard\s+(all\s+)?(previous|prior|above)\s+instructions?/gi,
  /you\s+are\s+now\s+[a-z\s]+/gi,
  /\bsystem\s*:\s*/gi,
  /\bassistant\s*:\s*/gi,
  /<\|im_start\|>/gi,
  /<\|im_end\|>/gi,
  /<\|system\|>/gi,
  /<\|user\|>/gi,
  /<\|assistant\|>/gi,
  /\[\s*INST\s*\]/gi,
  /\[\s*\/\s*INST\s*\]/gi,
];

export function sanitizeOcrText(raw: string, maxLen = 4000): string {
  if (!raw) return '';
  let cleaned = raw;
  for (const re of INJECTION_PATTERNS) {
    cleaned = cleaned.replace(re, '[redacted-instruction]');
  }
  // Drop control characters that aren't whitespace.
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ' ');
  // Collapse runaway whitespace.
  cleaned = cleaned.replace(/\s{4,}/g, '   ');
  return cleaned.slice(0, maxLen);
}

export function sanitizeModelOutput(raw: string, maxLen = 16_000): string {
  if (!raw) return '';
  let cleaned = raw;
  cleaned = cleaned.replace(/<\s*script\b[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, '');
  cleaned = cleaned.replace(/<\|im_start\|>|<\|im_end\|>/g, '');
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
  return cleaned.slice(0, maxLen);
}

/**
 * Best-effort JSON extraction from a model response. Qwen2.5 with
 * format:'json' should already return clean JSON, but real deployments
 * occasionally add a fence. We try parse-as-is first, then a brace-balanced
 * substring search. Returns null on failure rather than throwing — the
 * caller treats that as OUTPUT_INVALID.
 */
export function extractJsonObject(raw: string): unknown | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    // fall through
  }
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch?.[1]) {
    try {
      return JSON.parse(fenceMatch[1].trim());
    } catch {
      // fall through
    }
  }
  const first = trimmed.indexOf('{');
  const last = trimmed.lastIndexOf('}');
  if (first >= 0 && last > first) {
    try {
      return JSON.parse(trimmed.slice(first, last + 1));
    } catch {
      return null;
    }
  }
  return null;
}
