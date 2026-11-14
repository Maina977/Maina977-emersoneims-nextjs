import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { ingestReviewPack } from '@/lib/generator-oracle/reviewIngest';

const HEAD = 'id,brand,code,title,severity,highRisk,verified,oemManual (from register),edition,page,verdict (correct / change / remove),reviewer,comment';
// Rows below are TEST rows only (fictitious manual/reviewer placeholders), never real review results.
const csv = (...rows: string[]) => [HEAD, ...rows].join('\n');

describe('Oracle review pack ingest (read-only)', () => {
  it('the committed, unfilled pack reads as NO REVIEW YET with 375 alarms and 129 high-risk', () => {
    const r = ingestReviewPack(fs.readFileSync(path.resolve('docs/engineering-apps/oracle-alarm-review-pack.csv'), 'utf8'));
    expect(r.status).toBe('NO REVIEW YET');
    expect(r.rowsRead).toBe(375);
    expect(r.highRiskTotal).toBe(129);
    expect(r.reviewed).toBe(0);
  });
  it('a verdict counts only with manual, edition, page and reviewer; change/remove need a comment', () => {
    const r = ingestReviewPack(csv(
      'A1,DSE,1,Low oil,shutdown,YES,false,TEST-MANUAL,TEST-ED,12,correct,TEST-REVIEWER,',
      'A2,DSE,2,High temp,shutdown,YES,false,TEST-MANUAL,,13,correct,TEST-REVIEWER,',
      'A3,DSE,3,Overspeed,critical,YES,false,TEST-MANUAL,TEST-ED,14,change,TEST-REVIEWER,',
      'A4,DSE,4,Fuel low,warning,no,false,TEST-MANUAL,TEST-ED,15,remove,TEST-REVIEWER,not in this controller',
      'A5,DSE,5,Charge fail,warning,no,false,,,,,,',
    ));
    expect(r.reviewed).toBe(2);
    expect(r.byVerdict).toEqual({ correct: 1, change: 0, remove: 1 });
    expect(r.errors.join(' ')).toMatch(/A2.*edition/);
    expect(r.errors.join(' ')).toMatch(/A3.*needs a comment/);
    expect(r.highRiskReviewed).toBe(1);
    expect(r.status).toBe('PARTIAL');
  });
  it('rejects an unknown verdict word', () => {
    const r = ingestReviewPack(csv('A1,DSE,1,X,warning,no,false,M,E,1,ok,R,'));
    expect(r.reviewed).toBe(0);
    expect(r.errors[0]).toMatch(/correct, change or remove/);
  });
});
