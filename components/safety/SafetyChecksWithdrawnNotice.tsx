/**
 * The one notice shown in place of generator guidance withdrawn by the
 * content-safety withdrawal of 2026-11-25 (non-Oracle pages). Generator Oracle
 * screens keep their own OracleSafetyWithdrawnNotice. See
 * lib/safety/contentWithdrawal.ts.
 *
 * No 'use client' and no hooks: it renders from server and client components.
 */
import { CONTENT_SAFETY_WITHDRAWN_MESSAGE } from '@/lib/safety/contentWithdrawal';

export { CONTENT_SAFETY_WITHDRAWN_MESSAGE };

export default function SafetyChecksWithdrawnNotice({
  surface,
  className = '',
}: {
  surface?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      data-testid="content-safety-withdrawn"
      data-surface={surface}
      className={`rounded-xl border border-amber-500/60 bg-amber-950/40 p-4 text-sm text-amber-100 ${className}`.trim()}
    >
      {CONTENT_SAFETY_WITHDRAWN_MESSAGE}
    </div>
  );
}
