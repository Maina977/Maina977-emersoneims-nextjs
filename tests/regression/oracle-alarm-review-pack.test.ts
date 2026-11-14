import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { getAllFaultCodes } from '@/lib/generator-oracle/controllerFaultCodes';
import { answerOracle } from '@/lib/generator-oracle/server/answer';

// Technician review pack for the 375 controller alarms (review 2026-11-14).
// No alarm is marked verified until a named reviewer checks it against a held
// OEM manual (edition and page). High-risk = shutdown or critical severity.
const all = getAllFaultCodes();
const esc = (s: string) => `"${String(s ?? '').replace(/"/g, '""')}"`;
function packCsv(): string {
  const head = ['id', 'brand', 'code', 'title', 'severity', 'highRisk', 'verified', 'oemManual (from register)', 'edition', 'page', 'verdict (correct / change / remove)', 'reviewer', 'comment'];
  const rows = [...all].sort((a, b) => (a.severity === b.severity ? a.brand.localeCompare(b.brand) || a.code.localeCompare(b.code) : ['shutdown', 'critical', 'warning', 'info'].indexOf(a.severity) - ['shutdown', 'critical', 'warning', 'info'].indexOf(b.severity)))
    .map((c) => [c.id, c.brand, c.code, c.title, c.severity, c.severity === 'shutdown' || c.severity === 'critical' ? 'YES' : 'no', String(c.verified), '', '', '', '', '', ''].map(esc).join(','));
  return ['# Generator Oracle controller alarms: technician review pack. High-risk (shutdown/critical) first. Fill only from a held OEM manual; leave blank otherwise.', head.join(','), ...rows].join('\n') + '\n';
}

describe('controller alarm provenance', () => {
  it('no alarm claims OEM verification without a review (all 375 unverified today)', () => {
    expect(all).toHaveLength(375);
    expect(all.every((c) => c.verified === false)).toBe(true);
  });
  it('129 high-risk alarms (66 shutdown, 63 critical)', () => {
    expect(all.filter((c) => c.severity === 'shutdown')).toHaveLength(66);
    expect(all.filter((c) => c.severity === 'critical')).toHaveLength(63);
  });
  it('alarm answers say the notes are NOT VERIFIED against the manufacturer manual', () => {
    const a = answerOracle('DSE Low Oil Pressure Shutdown');
    expect(a.found).toBe(true);
    expect(a.text).toMatch(/NOT VERIFIED against the manufacturer/);
    // Safety stop instructions are kept, ahead of everything else.
    expect(a.text.split('\n\n')[0]).toMatch(/Stop the engine/);
  });
  it('the committed review pack matches the live library', () => {
    const file = path.resolve('docs/engineering-apps/oracle-alarm-review-pack.csv');
    if (process.env.WRITE_REVIEW_SHEET) fs.writeFileSync(file, packCsv());
    expect(fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n')).toBe(packCsv());
  });
});
