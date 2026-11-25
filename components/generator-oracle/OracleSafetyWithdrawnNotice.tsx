'use client';

/**
 * The one notice every withdrawn Generator Oracle screen shows (safety
 * withdrawal, 2026-11-25). See lib/generator-oracle/safety/withdrawal.ts.
 * The withdrawn screen's own module is not imported anywhere, so its code is
 * not in the build; this notice is all that renders in its place.
 */
import { ORACLE_SAFETY_WITHDRAWN_MESSAGE } from '@/lib/generator-oracle/safety/withdrawal';

export { ORACLE_SAFETY_WITHDRAWN_MESSAGE };

export default function OracleSafetyWithdrawnNotice({ surface }: { surface?: string }) {
  return (
    <div
      role="status"
      data-testid="oracle-safety-withdrawn"
      data-surface={surface}
      className="rounded-xl border border-amber-500/60 bg-amber-950/40 p-4 text-sm text-amber-100"
    >
      {ORACLE_SAFETY_WITHDRAWN_MESSAGE}
    </div>
  );
}
