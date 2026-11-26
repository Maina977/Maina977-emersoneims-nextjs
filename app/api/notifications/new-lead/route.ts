/**
 * New-lead notification API (/api/notifications/new-lead): RETIRED
 * (security sweep 2026-11-26). See lib/security/retiredRoute.ts.
 *
 * Anyone could POST to it with no sign-in and no rate limit, and it sent the
 * owner an email (caller text unescaped in the HTML), a Slack message and, for
 * "form_submit", a paid SMS, when EMAIL_SERVICE_URL / SLACK_WEBHOOK_URL /
 * SMS_SERVICE_URL are set. It also logged the caller's whole payload. It
 * stored and delivered no lead: real enquiries go through /api/contact (see
 * the note in app/generators/GeneratorsPageClient.tsx). Its only callers are
 * not mounted on any page (components/analytics/ComprehensiveAnalytics.tsx,
 * loaded only by PerformanceProvider, which app/layout.tsx does not mount;
 * lib/notification-queue.ts, imported by nothing). The previous code is in git
 * history. All 7 methods answer 410 Gone and send nothing.
 */
import { retired } from '@/lib/security/retiredRoute';

const gone = () => retired('This notification API');
export const GET = gone;
export const HEAD = gone;
export const POST = gone;
export const PUT = gone;
export const PATCH = gone;
export const DELETE = gone;
export const OPTIONS = gone;
