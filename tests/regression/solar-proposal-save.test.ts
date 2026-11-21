import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProposalPage from '@/components/solar-modules/crc/src/pages/ProposalPage';
import { buildProposal, type ProposalInput } from '@/lib/solar/design/proposal';
import {
  formToProposalInput, WORKED_EXAMPLE_FORM, WORKED_EXAMPLE_BOM, WORKED_EXAMPLE_PRODUCTION, type ProposalForm,
} from '@/lib/solar/design/proposalForm';
import { proposalRevisionHash, signApproval, type ApprovalVerifier, type AuthorisedReviewer } from '@/lib/solar/design/proposalApproval';
import {
  clearDraft, isClaimKey, loadDraft, makeEnvelope, projectFileName, readProject, saveDraft, serializeProject, stripClaims,
  DRAFT_STORAGE_KEY, MAX_PROJECT_BYTES, PROJECT_FORMAT, PROJECT_SCHEMA_VERSION, SAVED_HERE_ONLY_NOTE,
  STORAGE_BLOCKED_MESSAGE, STORAGE_FULL_MESSAGE, type SavedProject, type StorageLike,
} from '@/lib/solar/design/proposalSave';

// TEST values, TEST key and TEST reviewer only: no real engineer, registration, price or key.
const TEST_KEY = 'TEST-ONLY-signing-key-not-a-secret-0123456789';
const TEST_REVIEWER: AuthorisedReviewer = { reviewerId: 'test-reviewer-1', name: 'TEST REVIEWER', registration: 'TEST-REG-0001' };
const verifier: ApprovalVerifier = { signingKey: TEST_KEY, registry: [TEST_REVIEWER], now: Date.parse('2026-11-21T12:00:00Z') };
const NOW = new Date('2026-11-21T10:00:00Z');

const SIGN_OFF_KEYS = ['m.verified', 'm.verifiedBy', 'm.verifiedOn', 'i.verified', 'i.verifiedBy', 'i.verifiedOn'];
const unsignedForm = (): ProposalForm => Object.fromEntries(Object.entries(WORKED_EXAMPLE_FORM).filter(([k]) => !SIGN_OFF_KEYS.includes(k)));
const project = (form: ProposalForm = unsignedForm()): SavedProject => ({
  form, bom: WORKED_EXAMPLE_BOM.map((r) => ({ ...r })), production: { kind: 'test-example', label: WORKED_EXAMPLE_PRODUCTION.assumptions[0] },
});
const inputOf = (p: SavedProject): ProposalInput => {
  const r = formToProposalInput(p.form, p.bom, WORKED_EXAMPLE_PRODUCTION, null);
  if (!r.input) throw new Error(r.errors.join('; '));
  return r.input;
};

/** In-memory Storage with switchable failure modes. */
function memoryStorage(mode: { full?: boolean; blockedGet?: boolean; blockedRemove?: boolean } = {}) {
  const m = new Map<string, string>();
  const s: StorageLike = {
    getItem: (k) => { if (mode.blockedGet) throw new DOMException('denied', 'SecurityError'); return m.get(k) ?? null; },
    setItem: (k, v) => { if (mode.full) throw new DOMException('full', 'QuotaExceededError'); m.set(k, v); },
    removeItem: (k) => { if (mode.blockedRemove) throw new DOMException('denied', 'SecurityError'); m.delete(k); },
  };
  return { s, m, resolver: () => s };
}

describe('autosave in this browser', () => {
  beforeEach(() => window.localStorage.clear());

  it('save then reload gives identical data (real jsdom localStorage, versioned key with a format marker)', () => {
    const p = project();
    const r = saveDraft(p, null, undefined, NOW);
    expect(r).toEqual({ ok: true, savedAt: NOW.toISOString(), removed: false });
    expect(DRAFT_STORAGE_KEY).toMatch(/\.v1$/);
    const raw = JSON.parse(window.localStorage.getItem(DRAFT_STORAGE_KEY) as string);
    expect(raw.format).toBe(PROJECT_FORMAT);
    expect(raw.schemaVersion).toBe(PROJECT_SCHEMA_VERSION);
    const back = loadDraft();
    expect(back.status).toBe('restored');
    if (back.status !== 'restored') return;
    expect(back.project).toEqual(p);
    expect(back.savedAt).toBe(NOW.toISOString());
    expect(back.stripped).toEqual([]);
    expect(proposalRevisionHash(inputOf(back.project))).toBe(proposalRevisionHash(inputOf(p)));
  });

  it('nothing stored is "none"; an empty project removes the draft; clearDraft removes it', () => {
    const { m, resolver } = memoryStorage();
    expect(loadDraft(resolver)).toEqual({ status: 'none' });
    saveDraft(project(), null, resolver, NOW);
    expect(m.has(DRAFT_STORAGE_KEY)).toBe(true);
    expect(saveDraft({ form: { ref: '  ' }, bom: [{ item: '', model: '', quantity: '', unit: '', rate: '', rateSource: '', rateDate: '' }], production: { kind: 'none', label: '' } }, null, resolver, NOW)).toMatchObject({ ok: true, removed: true });
    expect(m.has(DRAFT_STORAGE_KEY)).toBe(false);
    saveDraft(project(), null, resolver, NOW);
    expect(clearDraft(resolver)).toEqual({ ok: true });
    expect(loadDraft(resolver)).toEqual({ status: 'none' });
  });

  it('full storage gives the "full" message and does not throw', () => {
    const { resolver } = memoryStorage({ full: true });
    expect(saveDraft(project(), null, resolver, NOW)).toEqual({ ok: false, problem: 'full', message: STORAGE_FULL_MESSAGE });
    // Firefox's legacy quota error and the numeric codes are recognised too.
    const legacy: StorageLike = { getItem: () => null, removeItem: () => undefined, setItem: () => { throw Object.assign(new Error('x'), { name: 'NS_ERROR_DOM_QUOTA_REACHED' }); } };
    expect(saveDraft(project(), null, () => legacy, NOW)).toMatchObject({ ok: false, problem: 'full' });
    const coded: StorageLike = { getItem: () => null, removeItem: () => undefined, setItem: () => { throw Object.assign(new Error('x'), { code: 22 }); } };
    expect(saveDraft(project(), null, () => coded, NOW)).toMatchObject({ ok: false, problem: 'full' });
  });

  it('blocked storage gives the "blocked" message, distinct from "full", and never throws', () => {
    expect(STORAGE_BLOCKED_MESSAGE).not.toBe(STORAGE_FULL_MESSAGE);
    expect(STORAGE_FULL_MESSAGE).toMatch(/full/);
    expect(STORAGE_BLOCKED_MESSAGE).toMatch(/blocking/);
    const throwing = () => { throw new DOMException('The operation is insecure.', 'SecurityError'); };
    expect(saveDraft(project(), null, throwing, NOW)).toEqual({ ok: false, problem: 'blocked', message: STORAGE_BLOCKED_MESSAGE });
    expect(loadDraft(throwing)).toEqual({ status: 'blocked', message: STORAGE_BLOCKED_MESSAGE });
    expect(clearDraft(throwing)).toEqual({ ok: false, message: STORAGE_BLOCKED_MESSAGE });
    expect(saveDraft(project(), null, () => null, NOW)).toMatchObject({ ok: false, problem: 'blocked' });
    expect(loadDraft(memoryStorage({ blockedGet: true }).resolver)).toEqual({ status: 'blocked', message: STORAGE_BLOCKED_MESSAGE });
    expect(clearDraft(memoryStorage({ blockedRemove: true }).resolver)).toEqual({ ok: false, message: STORAGE_BLOCKED_MESSAGE });
    const setDenied: StorageLike = { getItem: () => null, removeItem: () => undefined, setItem: throwing };
    expect(saveDraft(project(), null, () => setDenied, NOW)).toMatchObject({ ok: false, problem: 'blocked' });
  });

  it('a corrupt, foreign or newer stored draft is rejected with a message, not restored', () => {
    const { m, resolver } = memoryStorage();
    m.set(DRAFT_STORAGE_KEY, '{"format":"solar-genius-pro/proposal-project","schemaVersion":1,"form":{');
    expect(loadDraft(resolver)).toMatchObject({ status: 'rejected', reason: 'corrupt', message: expect.stringMatching(/draft saved in this browser was not restored.*damaged/) });
    m.set(DRAFT_STORAGE_KEY, JSON.stringify({ hello: 'world' }));
    expect(loadDraft(resolver)).toMatchObject({ status: 'rejected', reason: 'foreign' });
    m.set(DRAFT_STORAGE_KEY, JSON.stringify({ ...makeEnvelope(project(), null, NOW), schemaVersion: PROJECT_SCHEMA_VERSION + 1 }));
    expect(loadDraft(resolver)).toMatchObject({ status: 'rejected', reason: 'newer' });
  });

  it('the UI note says the save is local only', () => {
    expect(SAVED_HERE_ONLY_NOTE).toBe('Saved in this browser only — accounts and shared storage are not available yet.');
  });
});

describe('project file (.json)', () => {
  it('export then import is an identical round trip, with the schema version, production source and revision hash', () => {
    const p = project();
    const hash = proposalRevisionHash(inputOf(p));
    const text = serializeProject(p, hash, NOW);
    const file = JSON.parse(text);
    expect(file).toMatchObject({ format: PROJECT_FORMAT, schemaVersion: PROJECT_SCHEMA_VERSION, savedAt: NOW.toISOString(), revisionHash: hash, production: p.production });
    const r = readProject(text);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.project).toEqual(p);
    expect(r.fileRevisionHash).toBe(hash);
    expect(r.stripped).toEqual([]);
    expect(proposalRevisionHash(inputOf(r.project))).toBe(hash);
    // A second round trip is byte-identical.
    expect(serializeProject(r.project, hash, NOW)).toBe(text);
    expect(projectFileName('TEST-001')).toBe('solar-proposal-TEST-001.json');
    expect(projectFileName('../a b')).toBe('solar-proposal-.._a_b.json');
    expect(projectFileName('')).toBe('solar-proposal-proposal.json');
  });

  it('an incomplete project (no revision yet) round-trips with a null revision', () => {
    const p: SavedProject = { form: { ref: 'TEST-002', 'c.name': 'Test client' }, bom: [], production: { kind: 'none', label: '' } };
    const r = readProject(serializeProject(p, null, NOW));
    expect(r).toMatchObject({ ok: true, project: p, fileRevisionHash: null });
  });

  it('corrupt files are rejected', () => {
    const good = makeEnvelope(project(), null, NOW);
    const bad: Array<[string, unknown]> = [
      ['truncated JSON', serializeProject(project(), null, NOW).slice(0, 200)],
      ['not JSON', 'PK\u0003\u0004 binary'],
      ['schema version missing', { ...good, schemaVersion: undefined }],
      ['schema version not an integer', { ...good, schemaVersion: '1' }],
      ['schema version 0', { ...good, schemaVersion: 0 }],
      ['form missing', { ...good, form: undefined }],
      ['form is an array', { ...good, form: [] }],
      ['form value not text', { ...good, form: { ...good.form, 'm.pmaxW': 550 } }],
      ['prototype key', JSON.stringify(good).replace('"form":{', '"form":{"__proto__":"x",')],
      ['unexpected form key 2', { ...good, form: { ...good.form, 'm.pmax W': 'x' } }],
      ['bill of materials not an array', { ...good, bom: {} }],
      ['bill of materials row missing a field', { ...good, bom: [{ item: 'PV modules' }] }],
      ['bill of materials field not text', { ...good, bom: [{ ...good.bom[0], quantity: 32 }] }],
      ['production missing', { ...good, production: undefined }],
      ['production kind unknown', { ...good, production: { kind: 'measured', label: 'x' } }],
      ['revision hash not hex', { ...good, revisionHash: 'abc' }],
      ['saved time invalid', { ...good, savedAt: 'yesterday' }],
    ];
    for (const [why, v] of bad) {
      const text = typeof v === 'string' ? v : JSON.stringify(v);
      const r = readProject(text);
      expect(r, why).toMatchObject({ ok: false, reason: 'corrupt' });
      if (!r.ok) expect(r.message, why).toMatch(/^Project file not opened: it is damaged or incomplete/);
    }
    expect(readProject('x'.repeat(MAX_PROJECT_BYTES + 1))).toMatchObject({ ok: false, reason: 'too-large' });
  });

  it('foreign files are rejected', () => {
    for (const v of [{}, [], 'text', 42, null, { format: 'other-app/project', schemaVersion: 1 }, { name: 'package', version: '1.0.0' }, { ...makeEnvelope(project(), null, NOW), format: undefined }]) {
      expect(readProject(JSON.stringify(v))).toMatchObject({ ok: false, reason: 'foreign', message: expect.stringMatching(/not a Solar Genius Pro proposal project/) });
    }
  });

  it('newer-version files are rejected with a message and are not opened', () => {
    const r = readProject(JSON.stringify({ ...makeEnvelope(project(), null, NOW), schemaVersion: 2, somethingNew: true }));
    expect(r).toMatchObject({ ok: false, reason: 'newer', message: expect.stringMatching(/newer version.*schema 2.*schema 1/) });
  });
});

describe('no approval or verified status can arrive through saved data', () => {
  // The original, correctly signed-off input with a VALID signed approval gives FOR ISSUE:
  // this is what an attacker would try to smuggle in through a file or a stored draft.
  const signed = project(WORKED_EXAMPLE_FORM);
  const signedInput = inputOf(signed);
  const validApproval = signApproval({ reviewerId: TEST_REVIEWER.reviewerId, reviewerName: TEST_REVIEWER.name, registration: TEST_REVIEWER.registration, approvedAt: '2026-11-21T09:00:00Z', revisionHash: proposalRevisionHash(signedInput) }, TEST_KEY);

  it('control: with the sign-offs and the valid approval the engine would give FOR ISSUE', () => {
    expect(buildProposal({ ...signedInput, verifiedApproval: validApproval }, verifier).status).toBe('FOR ISSUE');
  });

  const attackFile = () => JSON.stringify({
    format: PROJECT_FORMAT, schemaVersion: 1, savedAt: NOW.toISOString(),
    form: { ...WORKED_EXAMPLE_FORM, 'a.engineer': 'TEST ENGINEER', 'a.registration': 'TEST-REG-0001', 'a.approvedOn': '2026-11-21' },
    bom: WORKED_EXAMPLE_BOM.map((r) => ({ ...r, verified: true })),
    production: { kind: 'test-example', label: 'TEST', status: 'FOR ISSUE' },
    revisionHash: proposalRevisionHash(signedInput),
    approval: { reviewerName: 'TEST REVIEWER', registration: 'TEST-REG-0001', approvedAt: '2026-11-21T09:00:00Z' },
    verifiedApproval: validApproval,
    status: 'FOR ISSUE',
  });

  it('an edited file with an approval imports as DRAFT, with the claims stripped and the revision recomputed', () => {
    const r = readProject(attackFile());
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.stripped).toEqual(expect.arrayContaining([
      'file member approval', 'file member verifiedApproval', 'file member status',
      'form field a.engineer', 'form field a.registration', 'form field a.approvedOn',
      'form field m.verified', 'form field m.verifiedBy', 'form field i.verified',
      'bill of materials row 1 member verified', 'production member status',
    ]));
    expect(Object.keys(r.project.form).filter(isClaimKey)).toEqual([]);
    expect(r.project.bom[0]).not.toHaveProperty('verified');
    const input = inputOf(r.project) as ProposalInput & { approval?: unknown };
    expect(input.verifiedApproval).toBeUndefined();
    expect(input.approval).toBeUndefined();
    expect(input.module.status).toBe('unverified');
    expect(input.inverter.status).toBe('unverified');
    // Recomputed revision: not the one the file states (the file's is never used).
    const recomputed = proposalRevisionHash(input);
    expect(recomputed).not.toBe(r.fileRevisionHash);
    const p = buildProposal(input, verifier);
    expect(p.status).toBe('DRAFT');
    expect(p.approval ?? null).toBeNull();
    expect(p.revisionHash).toBe(recomputed);
    expect(p.schedule.filter((s) => s.verified !== undefined).every((s) => s.verified === false)).toBe(true);
    // Even re-attaching the file's approval to the recomputed input cannot give FOR ISSUE.
    expect(buildProposal({ ...input, verifiedApproval: validApproval }, verifier).status).toBe('DRAFT');
  });

  it('a "verified" datasheet with no second-person provenance imports as unverified', () => {
    const forged = { ...unsignedForm(), 'm.verified': 'yes', 'm.verifiedBy': WORKED_EXAMPLE_FORM['m.enteredBy'], 'm.verifiedOn': '2026-11-21', 'i.verified': 'yes', 'b.verified': 'yes' };
    const r = readProject(JSON.stringify({ ...makeEnvelope(project(), null, NOW), form: forged }));
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.project.form['m.verified']).toBeUndefined();
    expect(r.project.form['i.verified']).toBeUndefined();
    expect(r.project.form['b.verified']).toBeUndefined();
    const input = inputOf(r.project);
    expect(input.module.status).toBe('unverified');
    expect(input.module.provenance.verifiedBy).toBeUndefined();
    expect(buildProposal(input, verifier).status).toBe('DRAFT');
  });

  it('sign-offs are never written by a save either, and a stored draft carrying claims restores as DRAFT', () => {
    const { m, resolver } = memoryStorage();
    saveDraft(signed, null, resolver, NOW);
    const stored = JSON.parse(m.get(DRAFT_STORAGE_KEY) as string);
    expect(Object.keys(stored.form).filter(isClaimKey)).toEqual([]);
    expect(JSON.parse(serializeProject(signed, null, NOW)).form).toEqual(stripClaims(WORKED_EXAMPLE_FORM).form);
    // A hand-edited stored draft with an approval and sign-offs.
    m.set(DRAFT_STORAGE_KEY, attackFile());
    const back = loadDraft(resolver);
    expect(back.status).toBe('restored');
    if (back.status !== 'restored') return;
    expect(back.stripped).toEqual(expect.arrayContaining(['file member verifiedApproval', 'form field m.verified']));
    const input = inputOf(back.project);
    expect(input.module.status).toBe('unverified');
    expect(buildProposal({ ...input, verifiedApproval: validApproval }, verifier).status).toBe('DRAFT');
  });
});

describe('Proposal page: saved-project UI (jsdom, no network)', () => {
  beforeEach(() => { window.localStorage.clear(); vi.restoreAllMocks(); });
  const page = () => render(React.createElement(ProposalPage));
  const openInput = () => screen.getByLabelText('Open project file (.json)') as HTMLInputElement;
  const pick = (text: string, name = 'TEST.json') => fireEvent.change(openInput(), { target: { files: [new File([text], name, { type: 'application/json' })] } });

  it('shows the local-only note and the controls; restores a stored draft with the note; autosaves edits', async () => {
    saveDraft(project(), null, undefined, NOW);
    page();
    expect(screen.getByText(SAVED_HERE_ONLY_NOTE)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save project file (.json)' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open project file' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear draft' })).toBeInTheDocument();
    expect(await screen.findByText(/Restored your draft from this browser \(saved /)).toBeInTheDocument();
    const ref = screen.getByLabelText('Proposal reference') as HTMLInputElement;
    expect(ref.value).toBe('TEST-001');
    fireEvent.change(ref, { target: { value: 'TEST-003' } });
    await waitFor(() => expect(JSON.parse(window.localStorage.getItem(DRAFT_STORAGE_KEY) as string).form.ref).toBe('TEST-003'));
  });

  it('opening an edited file with an approval shows DRAFT and the recomputed revision; sign-off boxes stay unticked', async () => {
    page();
    pick(JSON.stringify({ ...makeEnvelope(project(WORKED_EXAMPLE_FORM), 'f'.repeat(64), NOW), form: WORKED_EXAMPLE_FORM, verifiedApproval: { signature: 'f'.repeat(64) } }));
    const status = await screen.findByText(/Opened TEST\.json .*The proposal is DRAFT/);
    expect(status.textContent).toMatch(/Ignored from the file: .*file member verifiedApproval/);
    expect(status.textContent).toMatch(/Revision recomputed from the opened inputs: [0-9a-f]{64}/);
    expect(status.textContent).toMatch(/differs: the recomputed one applies/);
    for (const box of screen.getAllByLabelText('Verified against the datasheet by a second person')) expect((box as HTMLInputElement).checked).toBe(false);
  });

  it('a corrupt, foreign or newer file shows an alert and changes nothing', async () => {
    page();
    pick('{not json', 'bad.json');
    expect((await screen.findByRole('alert')).textContent).toMatch(/Project file not opened \(bad\.json\): it is damaged/);
    pick(JSON.stringify({ name: 'x' }), 'other.json');
    await waitFor(() => expect(screen.getByRole('alert').textContent).toMatch(/not a Solar Genius Pro proposal project/));
    pick(JSON.stringify({ ...makeEnvelope(project(), null, NOW), schemaVersion: 9 }), 'new.json');
    await waitFor(() => expect(screen.getByRole('alert').textContent).toMatch(/newer version/));
    expect((screen.getByLabelText('Proposal reference') as HTMLInputElement).value).toBe('');
  });

  it('blocked storage shows the blocked alert; full storage shows the full alert; neither crashes', async () => {
    const spy = vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => { throw new DOMException('denied', 'SecurityError'); });
    const { unmount } = page();
    expect((await screen.findByRole('alert')).textContent).toBe(STORAGE_BLOCKED_MESSAGE);
    unmount(); spy.mockRestore();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('full', 'QuotaExceededError'); });
    page();
    fireEvent.change(screen.getByLabelText('Proposal reference'), { target: { value: 'TEST-004' } });
    expect((await screen.findByRole('alert')).textContent).toBe(STORAGE_FULL_MESSAGE);
  });
});
