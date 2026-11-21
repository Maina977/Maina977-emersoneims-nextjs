/**
 * Building Suite Pro take-off: saved projects and autosave (P1, 2026-11-21).
 * Every value here is a TEST value with a test source, not project data.
 */
import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axe from 'axe-core';
import { calibrate, quantify, type Measurement } from '@/lib/qs/takeoff';
import { DRAFT_NOTICE } from '@/lib/qs/boq';
import { calculateTrade, emptyForm, tradeBoqItems, type MasonryForm } from '@/lib/qs/tradeForms';
import { sha256Hex } from '@/lib/qs/pdfSheet';
import {
  buildProject, parseProject, restoreProject, draftBoq, checkDrawingHash, extractEmbeddedDrawing, bytesToBase64,
  guardedStorage, writeAutosave, readAutosave, autosaveKey, classifyStorageError, revisionProblem,
  ProjectError, PROJECT_FORMAT, PROJECT_SCHEMA_VERSION, STORAGE_MESSAGES, SAVE_NOTICE,
  type ItemDraft, type WorkbenchSnapshot, type ProjectFile,
} from '@/lib/qs/project';
import TakeoffWorkbench from '@/components/qs/TakeoffWorkbench';

const SHA = 'ab'.repeat(32);
const SHEET = `${SHA.slice(0, 16)}#p1`;
const DRAWING = { name: 'TEST-drawing.pdf', size: 4321, sha256: SHA, type: 'application/pdf' };
const P = (x: number, y: number) => ({ x, y });

function fixture(): WorkbenchSnapshot {
  // 0.1 m per PDF point in both directions (TEST references).
  const refs = [{ a: P(0, 0), b: P(100, 0), knownM: 10 }, { a: P(0, 0), b: P(0, 50), knownM: 5 }];
  const cal = calibrate(SHEET, refs, { ratio: 100, unit: 'pt' });
  const base = { sheetId: SHEET, metresPerUnit: cal.metresPerUnit, user: 'this browser', at: '2026-11-21T08:00:00.000Z', revision: 'A' };
  const measurements: Measurement[] = [
    { ...base, id: 'M1', kind: 'linear', label: 'TEST external wall', points: [P(0, 0), P(200, 0), P(200, 100)], snaps: ['none', 'endpoint', 'none'] },
    { ...base, id: 'M2', kind: 'area', label: 'TEST slab', points: [P(0, 0), P(100, 0), P(100, 80), P(0, 80)], holes: [[P(10, 10), P(30, 10), P(30, 30), P(10, 30)]] },
    { ...base, id: 'M3', kind: 'count', label: 'TEST sockets', points: [P(5, 5), P(6, 6), P(7, 7)] },
    { ...base, id: 'M4', kind: 'volume', label: 'TEST footing', points: [P(0, 0), P(50, 0), P(50, 10), P(0, 10)], depthM: 0.25 },
  ];
  const quantities = new Map(measurements.map((m) => [m.id, quantify(m)]));
  const form: MasonryForm = {
    ...(emptyForm('masonry') as MasonryForm), code: 'W', description: 'TEST walling', wallLengthId: 'M1',
    height: { value: '3', source: 'TEST section A-A' }, thickness: { value: '0.2', source: 'TEST spec' }, minDeducted: { value: '0.5', source: 'TEST rule' },
    openings: [{ mark: 'D1', type: 'door', width: { value: '0.9', source: 'TEST schedule' }, height: { value: '2.1', source: 'TEST schedule' }, count: '2' }],
  };
  const tradeItems = tradeBoqItems(calculateTrade(form, quantities), 'TEST Masonry', ['1', '2']);
  const rate = (value: string) => ({ rate: value, rateKind: 'rate-library' as const, source: 'TEST rate library', date: '2026-11-01', location: 'TEST town' });
  const items: ItemDraft[] = [
    { code: '1', section: 'TEST Substructure', description: 'TEST slab', measurementId: 'M2', factor: '1', ...rate('100') },
    { code: '2', section: 'TEST Substructure', description: 'TEST footing', measurementId: 'M4', factor: '2', ...rate('250.5') },
    ...tradeItems.map((b, i): ItemDraft => ({
      code: b.code, section: b.section, description: b.description, measurementId: '', factor: '', ...rate(String(10 + i)),
      trade: { name: b.trade, unit: b.unit, scheduled: b.scheduledQuantity!, lineCode: b.code, form },
    })),
  ];
  return {
    drawing: DRAWING, page: 1, stated: { ratio: '100', dpi: '' }, refs: { [SHEET]: refs }, cals: { [SHEET]: cal }, measurements, items,
    adj: { prelims: '3', contingency: '4', ohp: '6', vat: '7', vatFrom: '2026-01-01' }, revision: 'B',
  };
}
const saved = (s = fixture()) => buildProject(s, { savedAt: '2026-11-21T09:00:00.000Z', engines: ['TEST'] });
const edit = (f: (o: Record<string, any>) => void) => { const o = JSON.parse(JSON.stringify(saved())); f(o); return JSON.stringify(o); }; // eslint-disable-line @typescript-eslint/no-explicit-any
function refusal(text: string): ProjectError {
  try { restoreProject(parseProject(text)); } catch (e) { if (e instanceof ProjectError) return e; throw e; }
  throw new Error('the file was accepted');
}

describe('project file round trip', () => {
  it('measurements, trades and BOQ come back with identical recomputed quantities and totals', () => {
    const s = fixture();
    const file = saved(s);
    expect(file.format).toBe(PROJECT_FORMAT);
    expect(file.schemaVersion).toBe(PROJECT_SCHEMA_VERSION);
    expect(file.drawing).toEqual(DRAWING);
    expect(file.view.page).toBe(1);
    expect(file.sheets).toEqual([{ sheetId: SHEET, references: s.refs[SHEET], stated: { ratio: 100, unit: 'pt' } }]);
    expect(file.measurements.map((m) => [m.id, m.kind, m.label, m.points.length])).toEqual([['M1', 'linear', 'TEST external wall', 3], ['M2', 'area', 'TEST slab', 4], ['M3', 'count', 'TEST sockets', 3], ['M4', 'volume', 'TEST footing', 4]]);
    expect(JSON.stringify(file.measurements)).not.toContain('metresPerUnit'); // derived on open, never stored
    expect(file.items[2].trade?.scheduled.source).toContain('length × height');
    expect(file.items.map((i) => [i.rate, i.rateKind, i.source, i.date])[0]).toEqual(['100', 'rate-library', 'TEST rate library', '2026-11-01']);
    expect(file.revision).toBe('B');

    const r = restoreProject(parseProject(JSON.stringify(file)));
    expect(r.differences).toEqual([]);
    const before = new Map(s.measurements.map((m) => [m.id, quantify(m)]));
    expect([...r.quantities.entries()]).toEqual([...before.entries()]);
    expect(r.quantities.get('M1')!.net).toBe(30);
    expect(r.quantities.get('M2')!.net).toBe(76);
    expect(r.quantities.get('M4')!.net).toBe(1.25); // 50 × 10 pt = 5 m² × 0.25 m
    expect(r.cals[SHEET].metresPerUnit).toBeCloseTo(0.1, 12);
    expect(r.items).toEqual(s.items);
    const a = draftBoq(s.items, before, s.adj, s.revision)!.boq;
    const b = r.boq!.boq;
    expect(a.grandTotal).not.toBeNull();
    expect(b.lines).toEqual(a.lines);
    expect(b.sections).toEqual(a.sections);
    expect(b.grandTotal).toBe(a.grandTotal);
    expect(b.revision).toBe('B');
    expect(r.adj).toEqual(s.adj);
    expect(r.stated).toEqual(s.stated);
  });

  it('a drawing under the limit is embedded and verified on open; a damaged one is refused', async () => {
    const bytes = new TextEncoder().encode('%PDF-1.4 TEST drawing bytes');
    const sha = await sha256Hex(bytes);
    const s = { ...fixture(), drawing: { ...DRAWING, size: bytes.length, sha256: sha }, refs: {}, cals: {}, measurements: [], items: [] };
    const file = buildProject(s, { savedAt: '2026-11-21T09:00:00.000Z', embeddedBase64: bytesToBase64(bytes) });
    const got = await extractEmbeddedDrawing(parseProject(JSON.stringify(file)));
    expect(got && [...got]).toEqual([...bytes]);
    const damaged = { ...file, drawing: { ...file.drawing, embeddedBase64: bytesToBase64(new TextEncoder().encode('%PDF-1.4 TEST drawing byteZ')) } };
    await expect(extractEmbeddedDrawing(parseProject(JSON.stringify(damaged)))).rejects.toMatchObject({ kind: 'hash-mismatch' });
  });
});

describe('stored numbers are never trusted', () => {
  it('a tampered quantity is detected and the recomputed one is used', () => {
    const text = edit((o) => {
      o.measurements[0].quantity.net = 99;
      o.items[2].trade.scheduled.value = 1;
      o.computed.grandTotal += 1000;
    });
    const r = restoreProject(parseProject(text));
    expect(r.quantities.get('M1')!.net).toBe(30);
    const what = r.differences.map((d) => d.what);
    expect(what).toContain('M1 TEST external wall: net (m)');
    expect(what.some((w) => w.startsWith('Item W.1'))).toBe(true);
    expect(what).toContain('BOQ total (KES)');
    expect(r.differences.find((d) => d.what.startsWith('M1'))).toMatchObject({ stored: 99, recomputed: 30 });
    expect(r.items[2].trade!.scheduled.value).not.toBe(1);
    expect(r.boq!.boq.grandTotal).toBe(restoreProject(parseProject(JSON.stringify(saved()))).boq!.boq.grandTotal);
  });
  it('geometry that cannot produce a quantity refuses the file', () => {
    expect(refusal(edit((o) => { o.measurements[0].points = [o.measurements[0].points[0]]; })).kind).toBe('not-recomputable');
    expect(refusal(edit((o) => { o.sheets[0].references[1].knownM = 50; })).kind).toBe('not-recomputable'); // references disagree
  });
});

describe('files that are refused', () => {
  it('a drawing with a different hash is refused', () => {
    expect(() => checkDrawingHash(DRAWING, 'cd'.repeat(32))).toThrow(ProjectError);
    try { checkDrawingHash(DRAWING, 'cd'.repeat(32)); } catch (e) { expect((e as ProjectError).kind).toBe('hash-mismatch'); expect((e as Error).message).toMatch(/not this project's drawing/); }
    expect(() => checkDrawingHash(DRAWING, SHA)).not.toThrow();
  });
  it('corrupt files are refused', () => {
    const text = JSON.stringify(saved());
    expect(refusal(text.slice(0, text.length / 2)).kind).toBe('invalid-json');
    expect(refusal(edit((o) => { delete o.measurements; })).kind).toBe('corrupt');
    expect(refusal(edit((o) => { o.measurements[0].points[0].x = 'ten'; })).kind).toBe('corrupt');
    expect(refusal(edit((o) => { o.measurements[0].sheetId = 'ffffffffffffffff#p1'; })).kind).toBe('corrupt');
    expect(refusal(edit((o) => { o.items[0].rateKind = 'guess'; })).kind).toBe('corrupt');
    expect(refusal(edit((o) => { o.items[2].trade.form.height = 3; })).kind).toBe('corrupt');
    expect(refusal(edit((o) => { o.extra = 1; })).message).toMatch(/project\.extra is not a field of this format/);
  });
  it('foreign files are refused', () => {
    expect(refusal('{"name":"some-package","version":"1.0.0"}').kind).toBe('foreign');
    expect(refusal('[1,2,3]').kind).toBe('foreign');
    expect(refusal('"text"').kind).toBe('foreign');
    expect(refusal(edit((o) => { o.format = 'another-app/project'; })).kind).toBe('foreign');
  });
  it('a newer version is refused with a message, not half-read', () => {
    const e = refusal(edit((o) => { o.schemaVersion = PROJECT_SCHEMA_VERSION + 1; o.newField = { anything: true }; }));
    expect(e.kind).toBe('newer-version');
    expect(e.message).toMatch(/newer version/);
    expect(refusal(edit((o) => { o.schemaVersion = 0; })).kind).toBe('unsupported-version');
    expect(refusal(edit((o) => { o.schemaVersion = '1'; })).kind).toBe('corrupt');
  });
});

describe('nothing certifies', () => {
  it('an edited file that claims certification is refused', () => {
    for (const f of [
      (o: Record<string, any>) => { o.certified = true; o.certifiedBy = 'TEST QS'; }, // eslint-disable-line @typescript-eslint/no-explicit-any
      (o: Record<string, any>) => { o.items[0].approved = true; }, // eslint-disable-line @typescript-eslint/no-explicit-any
      (o: Record<string, any>) => { o.measurements[0].signedOffBy = 'TEST QS'; }, // eslint-disable-line @typescript-eslint/no-explicit-any
      (o: Record<string, any>) => { o.notice = 'CERTIFIED by a registered quantity surveyor (TEST)'; }, // eslint-disable-line @typescript-eslint/no-explicit-any
      (o: Record<string, any>) => { o.revision = 'Approved'; }, // eslint-disable-line @typescript-eslint/no-explicit-any
    ]) {
      const e = refusal(edit(f));
      expect(e.kind).toBe('certification');
      expect(e.message).toMatch(/can never carry/);
    }
  });
  it('saved files and drafts always carry the DRAFT notice; a revision label cannot claim approval', () => {
    expect(saved().notice).toBe(DRAFT_NOTICE);
    expect(DRAFT_NOTICE).toMatch(/^DRAFT — not certified/);
    expect(revisionProblem('B')).toBeNull();
    expect(revisionProblem('Certified')).toMatch(/cannot claim/);
    expect(revisionProblem('Issued for construction')).toMatch(/cannot claim/);
    const restored = restoreProject(parseProject(JSON.stringify(saved())));
    expect(JSON.stringify({ ...restored, quantities: [...restored.quantities] })).not.toMatch(/certif|approv/i);
  });
});

function memoryStorage(): Storage {
  const m = new Map<string, string>();
  return { get length() { return m.size; }, clear: () => m.clear(), getItem: (k) => m.get(k) ?? null, key: (i) => [...m.keys()][i] ?? null, removeItem: (k) => { m.delete(k); }, setItem: (k, v) => { m.set(k, String(v)); } };
}

describe('autosave in browser storage', () => {
  it('writes a draft without the drawing bytes, keyed by the drawing hash, and reads it back', () => {
    const st = memoryStorage();
    const store = guardedStorage(() => st);
    expect(writeAutosave(store, fixture(), '2026-11-21T10:00:00.000Z')).toEqual({ ok: true, value: undefined });
    const raw = st.getItem(autosaveKey(SHA))!;
    expect(raw).not.toContain('embeddedBase64');
    const r = readAutosave(store, DRAWING);
    expect(r.ok && r.value && 'project' in r.value && r.value.project.savedAt).toBe('2026-11-21T10:00:00.000Z');
    expect(readAutosave(store, { ...DRAWING, sha256: 'cd'.repeat(32) })).toEqual({ ok: true, value: null });
    st.setItem(autosaveKey(SHA), '{"format":');
    const bad = readAutosave(store, DRAWING);
    expect(bad.ok && bad.value && 'error' in bad.value).toBe(true);
  });
  it('full storage gives its own message and does not throw', () => {
    const st = memoryStorage();
    st.setItem = () => { throw new DOMException('The quota has been exceeded.', 'QuotaExceededError'); };
    const r = writeAutosave(guardedStorage(() => st), fixture(), '2026-11-21T10:00:00.000Z');
    expect(r).toEqual({ ok: false, problem: 'full', message: STORAGE_MESSAGES.full });
    expect(classifyStorageError({ name: 'NS_ERROR_DOM_QUOTA_REACHED' })).toBe('full');
    expect(classifyStorageError({ code: 22 })).toBe('full');
  });
  it('blocked storage gives a different message and does not throw', () => {
    const throwing = guardedStorage(() => { throw new DOMException('Access is denied for this document.', 'SecurityError'); });
    expect(throwing.read('x')).toEqual({ ok: false, problem: 'blocked', message: STORAGE_MESSAGES.blocked });
    expect(writeAutosave(throwing, fixture(), '2026-11-21T10:00:00.000Z')).toEqual({ ok: false, problem: 'blocked', message: STORAGE_MESSAGES.blocked });
    expect(guardedStorage(() => null).remove('x')).toMatchObject({ ok: false, problem: 'blocked' });
    expect(readAutosave(throwing, DRAWING)).toMatchObject({ ok: false, problem: 'blocked' });
    expect(STORAGE_MESSAGES.full).not.toBe(STORAGE_MESSAGES.blocked);
    expect(STORAGE_MESSAGES.full).toMatch(/full/);
    expect(STORAGE_MESSAGES.blocked).toMatch(/blocks/);
  });
});

describe('workbench project controls', { timeout: 30_000 }, () => {
  const pick = (label: string, text: string, name = 'TEST.json') => fireEvent.change(screen.getByLabelText(label), { target: { files: [new File([text], name, { type: 'application/json' })] } });
  it('shows the accurate notice and labelled save/open controls', () => {
    render(createElement(TakeoffWorkbench));
    expect(screen.getByRole('note')).toHaveTextContent(SAVE_NOTICE);
    expect(screen.getByRole('button', { name: 'Save project (.json)' })).toBeDisabled();
    expect(screen.getByLabelText('Open project (.json)')).toHaveAttribute('type', 'file');
    expect(screen.getByLabelText('Revision')).toHaveValue('A');
  });
  it('a foreign file is refused with an announced message', async () => {
    render(createElement(TakeoffWorkbench));
    pick('Open project (.json)', '{"hello":"world"}');
    await waitFor(() => expect(screen.getAllByRole('alert').some((a) => /not a Building Suite Pro take-off project file/.test(a.textContent ?? ''))).toBe(true));
  });
  it('a project without its drawing asks for it, and refuses a file with a different hash', async () => {
    render(createElement(TakeoffWorkbench));
    pick('Open project (.json)', JSON.stringify(saved() as ProjectFile));
    const input = await screen.findByLabelText('Drawing for the opened project');
    expect(screen.getByText(/does not contain its drawing/)).toHaveTextContent('TEST-drawing.pdf');
    fireEvent.change(input, { target: { files: [new File(['not the TEST drawing'], 'TEST-drawing.pdf', { type: 'application/pdf' })] } });
    await waitFor(() => expect(screen.getAllByRole('alert').some((a) => /not this project's drawing/.test(a.textContent ?? ''))).toBe(true));
    expect(screen.getByLabelText('Drawing for the opened project')).toBeInTheDocument(); // still waiting for the right file
  });
  it('the project controls have accessible names (axe)', async () => {
    const { container } = render(createElement(TakeoffWorkbench));
    pick('Open project (.json)', JSON.stringify(saved() as ProjectFile));
    await screen.findByLabelText('Drawing for the opened project');
    const r = await axe.run(container, { runOnly: { type: 'rule', values: ['label', 'button-name', 'aria-allowed-role', 'aria-valid-attr-value', 'aria-prohibited-attr'] } });
    expect(r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.html).join(' | ')}`)).toEqual([]);
  });
  it('phone width (390 px): project controls wrap and file inputs cannot overflow', () => {
    render(createElement(TakeoffWorkbench));
    const section = screen.getByRole('region', { name: 'Project' });
    expect(section.querySelector('div')!.className).toMatch(/flex-wrap/);
    for (const el of section.querySelectorAll('input[type=file]')) expect(el.className).toMatch(/max-w-full/);
  });
  it('a revision label claiming approval is not used', () => {
    render(createElement(TakeoffWorkbench));
    fireEvent.change(screen.getByLabelText('Revision'), { target: { value: 'Approved' } });
    expect(screen.getAllByRole('alert').some((a) => /cannot claim approval/.test(a.textContent ?? '') && /Revision A is still used/.test(a.textContent ?? ''))).toBe(true);
  });
});
