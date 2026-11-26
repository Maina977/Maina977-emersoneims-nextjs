/**
 * Report download (/api/reports/[reportId]/download): RETIRED (security
 * sweep 2026-11-26). See lib/security/retiredRoute.ts.
 *
 * There is no reports store. For ANY id it generated an "EmersonEIMS -
 * AquaScan Pro" PDF stating that it "confirms the borehole site analysis
 * report identified by the report id" and that every figure is traceable to
 * government hydrogeology databases: a confirmation of reports that do not
 * exist. The previous code (0d8261ba) is in git history. All 7 methods answer
 * 410 Gone. (The page that links here, /aquascan-pro-v3/reports, lists a
 * hard-coded sample history; reported separately.)
 */
import { retired } from '@/lib/security/retiredRoute';

const gone = () => retired('Online report download');
export const GET = gone;
export const HEAD = gone;
export const POST = gone;
export const PUT = gone;
export const PATCH = gone;
export const DELETE = gone;
export const OPTIONS = gone;
