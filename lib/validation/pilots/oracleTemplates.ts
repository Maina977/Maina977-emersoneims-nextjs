/**
 * The two Generator Oracle review sheets, generated from the live library so
 * the reviewer checks exactly what the tools run.
 *
 * - Alarm pack: identical to docs/engineering-apps/oracle-alarm-review-pack.csv
 *   (tests/regression/oracle-alarm-review-pack.test.ts builds the same file).
 * - Guided diagnostics: docs/engineering-apps/oracle-guided-diagnostics-review-sheet.csv
 *   with three columns added (edition, page, reviewer). The review ingest counts
 *   a verdict only with manual, edition, page and reviewer; the committed sheet
 *   has only oemReference and reviewerComment, so without these columns no
 *   verdict on it could ever count.
 */
import { getAllFaultCodes } from '@/lib/generator-oracle/controllerFaultCodes';
import { FAMILIES } from '@/lib/generator-oracle/diagnostics/families';
import { reviewCsv } from '@/lib/generator-oracle/diagnostics/reviewSheet';

const esc = (s: string) => `"${String(s ?? '').replace(/"/g, '""')}"`;
const SEVERITY_ORDER = ['shutdown', 'critical', 'warning', 'info'];

export function oracleAlarmPackCsv(): string {
  const head = ['id', 'brand', 'code', 'title', 'severity', 'highRisk', 'verified', 'oemManual (from register)', 'edition', 'page', 'verdict (correct / change / remove)', 'reviewer', 'comment'];
  const rows = [...getAllFaultCodes()]
    .sort((a, b) => (a.severity === b.severity ? a.brand.localeCompare(b.brand) || a.code.localeCompare(b.code) : SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity)))
    .map((c) => [c.id, c.brand, c.code, c.title, c.severity, c.severity === 'shutdown' || c.severity === 'critical' ? 'YES' : 'no', String(c.verified), '', '', '', '', '', ''].map(esc).join(','));
  return ['# Generator Oracle controller alarms: technician review pack. High-risk (shutdown/critical) first. Fill only from a held OEM manual; leave blank otherwise.', head.join(','), ...rows].join('\n') + '\n';
}

export function oracleGuidedSheetCsv(): string {
  const lines = reviewCsv(FAMILIES).replace(/\n$/, '').split('\n');
  const out = lines.map((l, i) => {
    if (i === 0) return `${l} Pilot copy: oemReference = OEM manual title from the register; fill edition, page and reviewer for every verdict.`;
    if (i === 1) return `${l},edition,page,reviewer`;
    return `${l},"","",""`;
  });
  return out.join('\n') + '\n';
}
