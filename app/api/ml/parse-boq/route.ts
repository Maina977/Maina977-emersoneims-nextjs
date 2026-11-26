/**
 * BOQ parser API (/api/ml/parse-boq): RETIRED (security sweep 2026-11-26). See lib/security/retiredRoute.ts.
 *
 * It sent caller text of any size to OpenAI and, when the model did not return JSON, returned the raw model output, so it worked as a free general-purpose GPT-4o proxy; it also logged the full model output (customer BOQ data). It had no sign-in and no rate limit, so anyone could spend the
 * site's OpenAI key without limit (gpt-4o, up to 4,000 output tokens per call), and its GET said whether
 * the key was configured. No page calls it: the only reference is
 * lib/solar/apiService.ts, which no page or component imports (git grep,
 * 2026-11-26). The previous code (a71da552, 2026-04-05) is in git history.
 * All 7 methods answer 410 Gone and call nothing.
 */
import { retired } from '@/lib/security/retiredRoute';

const gone = () => retired('This BOQ parser API');
export const GET = gone;
export const HEAD = gone;
export const POST = gone;
export const PUT = gone;
export const PATCH = gone;
export const DELETE = gone;
export const OPTIONS = gone;
