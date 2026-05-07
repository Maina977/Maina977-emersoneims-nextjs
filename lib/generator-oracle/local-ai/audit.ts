/**
 * GENERATOR ORACLE — Lightweight audit log.
 *
 * Records every Generator Oracle AI call (entry, decision, outcome) to the
 * server console in a structured format that is greppable in deployment
 * logs. There is intentionally no DB write here — the production audit
 * sink is wired in once a persistent store is available; until then this
 * module guarantees a forensic trail in stdout / Vercel function logs.
 */

export type AuditOutcome =
  | 'asset_card_invalid'
  | 'rule_block'
  | 'ai_unavailable'
  | 'ok'
  | 'output_invalid'
  | 'internal_error';

export interface AuditEvent {
  ts: string;
  surface: 'visual_diagnose' | 'expert_chat' | 'param_diagnose';
  userId?: string | null;
  outcome: AuditOutcome;
  assetCardPresent: boolean;
  controller?: string;
  make?: string;
  model?: string;
  ruleViolations?: string[];
  detail?: string;
}

export function logAudit(event: Omit<AuditEvent, 'ts'>): void {
  const full: AuditEvent = { ts: new Date().toISOString(), ...event };
  // eslint-disable-next-line no-console
  console.log(`[oracle-audit] ${JSON.stringify(full)}`);
}
