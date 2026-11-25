/**
 * Review of 126efdbc, B-2 (2026-11-25): free text that the page shows (e.g. the pre-publish audit
 * details) may quote modelled depth, yield or cost figures. Without the field evidence the evidence
 * gate requires, those figures are replaced by the gate's own wording; nothing else is changed.
 */
import { DEPTH_NEEDS, YIELD_NEEDS, COST_NEEDS } from './evidenceGate';

export interface FigureGate { depth: boolean; yield: boolean; cost: boolean }

const YIELD_RE = /\b\d+(?:\.\d+)?(?:\s?(?:–|-|to)\s?\d+(?:\.\d+)?)?\s?m(?:³|3)\/h(?:r|our)?\b(?! per m)/gi;
const YIELD_KV_RE = /\b(yield)\s*[=:]\s*\d+(?:\.\d+)?/gi;
const DEPTH_RE = /\b(depth|drill(?:ing)? to|target)([^.;\n]{0,40}?)\b\d{1,4}(?:\.\d+)?(?:\s?(?:–|-|to)\s?\d{1,4}(?:\.\d+)?)?\s?m\b(?!³|3|\/)/gi;
const DEPTH_KV_RE = /\b(depth)\s*=\s*\d+(?:\.\d+)?m?/gi;
const MONEY_RE = /(?:\$|USD|KSh|KES)\s?\d[\d,]*(?:\.\d+)?(?:\s?(?:–|-)\s?(?:\$|USD|KSh|KES)?\s?\d[\d,]*)?\+?/g;

export function withholdModelFigures(text: string, g: FigureGate): string {
  let t = String(text ?? '');
  if (!g.yield) t = t.replace(YIELD_KV_RE, `$1 ${YIELD_NEEDS.toLowerCase()}`).replace(YIELD_RE, `(${YIELD_NEEDS.toLowerCase()})`);
  if (!g.depth) t = t.replace(DEPTH_KV_RE, `$1 ${DEPTH_NEEDS.toLowerCase()}`).replace(DEPTH_RE, (_m, a: string, b: string) => `${a}${b}(${DEPTH_NEEDS.toLowerCase()})`);
  if (!g.cost) t = t.replace(MONEY_RE, `(${COST_NEEDS.toLowerCase()})`);
  return t;
}
