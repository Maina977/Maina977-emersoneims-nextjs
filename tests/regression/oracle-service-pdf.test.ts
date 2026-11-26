import { describe, it, expect, beforeAll } from 'vitest';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { jobCardReport, SIGNOFF, TYPED_SIGNOFF_NOTICE, type Asset } from '@/lib/generator-oracle/service/maintenance';
import { jobCardToPdf, JOB_CARD_PDF_FOOTER } from '@/lib/generator-oracle/service/jobCardPdf';
import { emptyState, reduce, type ServiceAction, type ServiceState } from '@/lib/generator-oracle/service/store';

// TEST values and TEST references only — never real OEM intervals, names or part numbers.
type Pdfjs = typeof import('pdfjs-dist/legacy/build/pdf.mjs');
let pdfjs: Pdfjs;
beforeAll(async () => {
  pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(path.resolve('node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs')).href;
});
/** Text of each page, whitespace collapsed (wrapped lines join with a space). */
const pagesOf = async (bytes: Uint8Array) => {
  const doc = await pdfjs.getDocument({ data: bytes.slice() }).promise;
  const out: string[] = [];
  for (let p = 1; p <= doc.numPages; p++) out.push((await (await doc.getPage(p)).getTextContent()).items.map((i) => ('str' in i ? i.str : '')).join(' ').replace(/\s+/g, ' '));
  return out;
};

const ref = { document: 'TEST O&M manual', edition: 'TEST ed. 1', page: '42' };
const book = { document: 'TEST parts book', edition: 'TEST ed.', page: '7' };
const run = (s: ServiceState, ...acts: ServiceAction[]) => acts.reduce(reduce, s);
const signed = () => run(emptyState(),
  { type: 'saveAsset', asset: { make: 'TEST', model: 'T-100', engine: 'TEST-ENG', controller: 'TEST-CTRL', serial: 'S-1', ratedKva: 100 } },
  { type: 'addTask', assetId: 'A-1', task: { task: 'TEST oil and filter', intervalHours: 250, source: ref } },
  { type: 'openCard', card: { assetId: 'A-1', opened: '2026-11-20', reportedFault: 'TEST low oil pressure shutdown', faultCodes: ['TEST-LOP', 'TEST-E2'], technician: 'TECH-A' } },
  { type: 'transition', cardId: 'JC-1', to: 'IN PROGRESS', by: 'TECH-A', at: '2026-11-20T08:00', note: 'TEST started' },
  { type: 'transition', cardId: 'JC-1', to: 'COMPLETED', by: 'TECH-A', at: '2026-11-20T12:00', update: {
    findings: 'TEST sender faulty', tasks: ['TEST replace sender', 'TEST test run'], engineHoursAtJob: 1500, labourHours: 2,
    parts: [{ partNo: 'TEST-123', description: 'TEST sender', qty: 1, compatibility: book }],
    readings: [{ name: 'TEST voltage', value: 405, unit: 'V', min: 380, max: 420, limitSource: 'TEST rating plate', checklistId: 'voltage' }, { name: 'TEST frequency', value: 50, unit: 'Hz', checklistId: 'frequency' }, { name: 'TEST oil pressure', value: 300, unit: 'kPa', checklistId: 'oilPressure' }, { name: 'TEST coolant temperature', value: 80, unit: '°C', checklistId: 'coolantTemp' }],
  } },
  { type: 'transition', cardId: 'JC-1', to: SIGNOFF, by: 'SUPERVISOR-B', at: '2026-11-20T13:00' },
);
/** Signed, reopened, a part with no parts-book reference added: the cancelled sign-off no longer matches. */
const reopened = () => run(signed(),
  { type: 'reopen', cardId: 'JC-1', by: 'SUPERVISOR-B', at: '2026-11-21T08:00', reason: 'TEST add washer' },
  { type: 'updateCard', cardId: 'JC-1', update: { parts: [{ partNo: 'TEST-123', description: 'TEST sender', qty: 1, compatibility: book }, { partNo: 'TEST-456', description: 'TEST washer', qty: 2, compatibility: null }] } });
const card = (s: ServiceState) => s.jobCards[0];
const asset = (s: ServiceState): Asset => s.assets[0];

/** "certified", "approved"/"approval" and "SIGNED OFF" may appear only in a sentence that says NOT/not. */
const unnegated = (text: string) => text.split(/(?<=[.;])\s+/).filter((sentence) => /certif|approv|\bSIGNED OFF\b/i.test(sentence) && !/\bnot\b/i.test(sentence));

describe('job card PDF', () => {
  it('is a PDF with the whole .txt report content: asset, fault, work, parts, readings, findings, history, hash, notice', async () => {
    const s = signed();
    const c = card(s);
    const bytes = jobCardToPdf(c, asset(s));
    expect(new TextDecoder('latin1').decode(bytes.slice(0, 5))).toBe('%PDF-');
    const text = (await pagesOf(bytes)).join(' ');
    for (const want of [
      'JOB CARD JC-1 (revision 1)',
      'A-1: TEST T-100 (100 kVA), engine TEST-ENG, controller TEST-CTRL, serial S-1',
      'Reported fault: TEST low oil pressure shutdown',
      'Fault codes: TEST-LOP, TEST-E2',
      'technician (typed name): TECH-A',
      'TEST replace sender', 'TEST test run',
      'Engine hours at job: 1500 h. Labour: 2 h.',
      '1 × TEST-123 TEST sender — parts book: TEST parts book, TEST ed., p. 7',
      'TEST voltage: 405 V (limits 380–420 V, source: TEST rating plate)',
      'TEST frequency: 50 Hz (no limit given — NOT VERIFIED, not a pass)',
      'TEST sender faulty',
      `Content hash at sign-off (SHA-256): ${c.signOffHash}`,
      'Card content matches the hash recorded at sign-off',
      // history: who, when, revision ("→" is printed as "->": the standard PDF fonts have no arrow)
      '2026-11-20T08:00 OPEN -> IN PROGRESS by TECH-A — TEST started',
      '2026-11-20T12:00 IN PROGRESS -> COMPLETED by TECH-A',
      `2026-11-20T13:00 COMPLETED -> ${SIGNOFF} by SUPERVISOR-B (revision 1)`,
      `[content hash ${c.signOffHash}]`,
      TYPED_SIGNOFF_NOTICE,
      'Sign-off recorded by typed name — not an authenticated signature. Not valid as a certified record until reviewer accounts exist.',
    ]) expect(text).toContain(want);
  });
  it('shows "compatibility unverified" and CHANGED AFTER SIGN-OFF when the card no longer matches the recorded hash', async () => {
    const s = reopened();
    const c = card(s);
    const txt = jobCardReport(c, asset(s));
    expect(txt).toContain('CHANGED AFTER SIGN-OFF');
    const text = (await pagesOf(jobCardToPdf(c, asset(s)))).join(' ');
    expect(text).toContain('2 × TEST-456 TEST washer — compatibility unverified (no parts-book reference)');
    expect(text).toContain('CHANGED AFTER SIGN-OFF: the card no longer matches the hash recorded at sign-off');
    expect(text).toContain('No current sign-off (revision 2)');
    expect(text).toContain('REOPENED. Reason: TEST add washer.');
    expect(text).toContain('JOB CARD JC-1 (revision 2)');
  });
  it('has the DRAFT / not-certified footer on every page, also when the card runs to several pages', async () => {
    let s = reopened();
    for (let k = 0; k < 40; k++) {
      s = run(s,
        { type: 'transition', cardId: 'JC-1', to: 'AWAITING PARTS', by: 'TECH-A', at: `2026-11-21T09:${String(k).padStart(2, '0')}`, note: `TEST waiting for part batch ${k}` },
        { type: 'transition', cardId: 'JC-1', to: 'IN PROGRESS', by: 'TECH-A', at: `2026-11-21T10:${String(k).padStart(2, '0')}`, note: `TEST part batch ${k} arrived` });
    }
    const pages = await pagesOf(jobCardToPdf(card(s), asset(s)));
    expect(pages.length).toBeGreaterThan(1);
    pages.forEach((p, i) => {
      expect(p).toContain(JOB_CARD_PDF_FOOTER);
      expect(p).toContain('DRAFT — NOT A CERTIFIED RECORD');
      expect(p).toContain(`page ${i + 1} of ${pages.length}`);
    });
    expect(pages.join(' ')).toContain('TEST part batch 39 arrived');
  });
  it('never says SIGNED OFF, approved or certified without NOT/not', async () => {
    for (const s of [signed(), reopened()]) {
      const text = (await pagesOf(jobCardToPdf(card(s), asset(s)))).join(' ');
      expect(text).not.toMatch(/\bSIGNED OFF\b/i);
      expect(text).toMatch(/certified/i); // the notice and footer are there...
      expect(unnegated(text)).toEqual([]); // ...and only ever negated
    }
  });
});
