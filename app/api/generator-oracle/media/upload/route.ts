/**
 * Generator Oracle media API (/api/generator-oracle/media/upload): RETIRED
 * (security sweep 2026-11-26). See lib/security/retiredRoute.ts.
 *
 * It had no sign-in and no ownership: anyone could read a media record by id
 * or diagnosis id, overwrite it (INSERT ... ON CONFLICT (id) DO UPDATE) or
 * delete it, when a database is configured. Records carry no owner, so an
 * access check is not possible without a schema change. Its only client
 * (lib/generator-oracle/mediaService.ts, via CameraCapture.tsx) is not mounted
 * on any page. The previous code (48e16ad5) is in git history. All 7 methods
 * answer 410 Gone.
 */
import { retired } from '@/lib/security/retiredRoute';

const gone = () => retired('This media API');
export const GET = gone;
export const HEAD = gone;
export const POST = gone;
export const PUT = gone;
export const PATCH = gone;
export const DELETE = gone;
export const OPTIONS = gone;
