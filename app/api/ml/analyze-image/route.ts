/**
 * Image analysis API (/api/ml/analyze-image): RETIRED (security sweep 2026-11-26). See lib/security/retiredRoute.ts.
 *
 * It sent a caller-supplied image (URL or base64) to OpenAI vision and returned an AI-estimated roof area and kWp as an analysis. It had no sign-in and no rate limit, so anyone could spend the
 * site's OpenAI key without limit (gpt-4o vision per call), and its GET said whether
 * the key was configured. No page calls it: the only reference is
 * lib/solar/apiService.ts, which no page or component imports (git grep,
 * 2026-11-26). The previous code (a71da552, 2026-04-05) is in git history.
 * All 7 methods answer 410 Gone and call nothing.
 */
import { retired } from '@/lib/security/retiredRoute';

const gone = () => retired('This image analysis API');
export const GET = gone;
export const HEAD = gone;
export const POST = gone;
export const PUT = gone;
export const PATCH = gone;
export const DELETE = gone;
export const OPTIONS = gone;
