import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/solar/proposal/route';
import { formToProposalInput, WORKED_EXAMPLE_FORM, WORKED_EXAMPLE_BOM, WORKED_EXAMPLE_PRODUCTION } from '@/lib/solar/design/proposalForm';
import type { ProposalInput } from '@/lib/solar/design/proposal';

// TEST values only (the same as tests/regression/solar-proposal.test.ts).
const base = (): ProposalInput => {
  const r = formToProposalInput(WORKED_EXAMPLE_FORM, WORKED_EXAMPLE_BOM, WORKED_EXAMPLE_PRODUCTION, null);
  if (!r.input) throw new Error(r.errors.join('; '));
  return r.input;
};
const call = (body: unknown, ip = '10.0.0.1') => POST(new NextRequest('http://x/api/solar/proposal', { method: 'POST', body: JSON.stringify(body), headers: { 'x-forwarded-for': ip } }));

describe('POST /api/solar/proposal', () => {
  it('json: DRAFT without an approval, never cached', async () => {
    const r = await call({ input: base(), format: 'json' });
    expect(r.status).toBe(200);
    expect(r.headers.get('vercel-cdn-cache-control')).toBe('no-store');
    const p = await r.json();
    expect(p.status).toBe('DRAFT');
    expect(p.system.dcKwp).toBe(17.6);
    expect(p.costing.capexKes).toBe(800000);
    expect(p.statusReasons.join(' ')).toMatch(/approval not yet recorded/);
  });
  it('json: FOR ISSUE once an approval is recorded', async () => {
    const r = await call({ input: { ...base(), approval: { engineer: 'TEST ENGINEER', registration: 'TEST-REG', date: '2026-11-20' } }, format: 'json' });
    expect((await r.json()).status).toBe('FOR ISSUE');
  });
  it('xlsx: a zip (PK) workbook with an attachment name', async () => {
    const r = await call({ input: base(), format: 'xlsx' });
    expect(r.status).toBe(200);
    expect(r.headers.get('content-type')).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    expect(r.headers.get('content-disposition')).toBe('attachment; filename="solar-proposal-TEST-001.xlsx"');
    const b = new Uint8Array(await r.arrayBuffer());
    expect(String.fromCharCode(b[0], b[1])).toBe('PK');
  }, 30000);
  it('pdf: starts with %PDF-', async () => {
    const r = await call({ input: base(), format: 'pdf' });
    expect(r.status).toBe(200);
    expect(r.headers.get('content-type')).toBe('application/pdf');
    expect(r.headers.get('content-disposition')).toMatch(/solar-proposal-TEST-001\.pdf/);
    const b = new Uint8Array(await r.arrayBuffer());
    expect(new TextDecoder().decode(b.slice(0, 5))).toBe('%PDF-');
  }, 30000);
  it('400 with the engine message on an unsourced tariff', async () => {
    const i = base(); i.finance.tariffKesPerKwh = { value: 25, source: '' };
    const r = await call({ input: i, format: 'json' });
    expect(r.status).toBe(400);
    expect((await r.json()).error).toMatch(/Tariff \(KES\/kWh\) with its source is required/);
  });
  it('400 on a malformed body or format', async () => {
    expect((await call({ format: 'json' })).status).toBe(400);
    expect((await call({ input: base(), format: 'docx' })).status).toBe(400);
    const { production: _p, ...noProd } = base();
    const r = await call({ input: noProd, format: 'json' });
    expect(r.status).toBe(400);
    expect((await r.json()).error).toMatch(/production/);
  });
  it('REFUSED on an unsafe string design (20 modules per string)', async () => {
    const r = await call({ input: { ...base(), design: { modulesPerString: 20, stringsPerMppt: [1] } }, format: 'json' });
    expect(r.status).toBe(200);
    expect((await r.json()).status).toBe('REFUSED');
  });
  it('rate-limits at 20 requests per minute per IP', async () => {
    let last = 200;
    for (let k = 0; k < 21; k++) last = (await call({}, '10.9.9.9')).status;
    expect(last).toBe(429);
  });
});
