import { describe, it, expect } from 'vitest';
import { createHash, createHmac } from 'node:crypto';
import { buildProposal, type ProposalInput } from '@/lib/solar/design/proposal';
import { formToProposalInput, WORKED_EXAMPLE_FORM, WORKED_EXAMPLE_BOM, WORKED_EXAMPLE_PRODUCTION } from '@/lib/solar/design/proposalForm';
import { sha256Hex, hmacSha256Hex } from '@/lib/solar/design/sha256';
import {
  canonicalJson, proposalRevisionHash, signApproval, verifyApproval, approvalVerifierFromEnvironment,
  appendAuditRecord, verifyAuditChain, auditRecordHash, APPROVAL_UNAVAILABLE_REASON,
  type ApprovalVerifier, type AuthorisedReviewer, type ApprovalAuditRecord, type VerifiedApproval,
} from '@/lib/solar/design/proposalApproval';

// TEST key, TEST reviewers and the TEST worked example only: no real engineer, registration or key.
const TEST_KEY = 'TEST-ONLY-signing-key-not-a-secret-0123456789';
const TEST_REVIEWER: AuthorisedReviewer = { reviewerId: 'test-reviewer-1', name: 'TEST REVIEWER', registration: 'TEST-REG-0001' };
// Fixed clock: approvals are dated 2026-11-21T09:00Z (L1 date window).
const NOW = Date.parse('2026-11-21T12:00:00Z');
const verifier: ApprovalVerifier = { signingKey: TEST_KEY, registry: [TEST_REVIEWER], now: NOW };
const base = (): ProposalInput => {
  const r = formToProposalInput(WORKED_EXAMPLE_FORM, WORKED_EXAMPLE_BOM, WORKED_EXAMPLE_PRODUCTION, null);
  if (!r.input) throw new Error(r.errors.join('; '));
  return r.input;
};
const approve = (input: ProposalInput, who: AuthorisedReviewer = TEST_REVIEWER, key = TEST_KEY): VerifiedApproval =>
  signApproval({ reviewerId: who.reviewerId, reviewerName: who.name, registration: who.registration, approvedAt: '2026-11-21T09:00:00Z', revisionHash: proposalRevisionHash(input) }, key);

describe('SHA-256 / HMAC (pure JS, browser and server)', () => {
  it('matches node:crypto, including empty, multi-block and non-ASCII input', () => {
    for (const s of ['', 'abc', 'a'.repeat(55), 'a'.repeat(56), 'a'.repeat(64), 'x'.repeat(1000), 'Test · 25 KES/kWh — ✓']) {
      expect(sha256Hex(s)).toBe(createHash('sha256').update(s, 'utf8').digest('hex'));
      expect(hmacSha256Hex(TEST_KEY, s)).toBe(createHmac('sha256', TEST_KEY).update(s, 'utf8').digest('hex'));
    }
    const longKey = 'k'.repeat(100);
    expect(hmacSha256Hex(longKey, 'abc')).toBe(createHmac('sha256', longKey).update('abc').digest('hex'));
    expect(sha256Hex('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  });
});

describe('revision hash', () => {
  it('is deterministic, independent of key order, and survives a JSON round trip', () => {
    expect(canonicalJson({ b: 1, a: [1, { d: 2, c: undefined }], e: undefined })).toBe('{"a":[1,{"d":2}],"b":1}');
    const i = base();
    const reordered = Object.fromEntries(Object.entries(i).reverse()) as unknown as ProposalInput;
    expect(proposalRevisionHash(reordered)).toBe(proposalRevisionHash(i));
    expect(proposalRevisionHash(JSON.parse(JSON.stringify(i)))).toBe(proposalRevisionHash(i));
  });
  it('excludes any approval and changes with any edit to the input', () => {
    const i = base();
    expect(proposalRevisionHash({ ...i, verifiedApproval: approve(i) })).toBe(proposalRevisionHash(i));
    const edited = base(); edited.bom[0].quantity = 33;
    expect(proposalRevisionHash(edited)).not.toBe(proposalRevisionHash(i));
  });
});

describe('verified approval (engine level, TEST key and TEST reviewer)', () => {
  it('a valid HMAC approval by a registry reviewer on the current revision gives FOR ISSUE', () => {
    const i = base();
    const p = buildProposal({ ...i, verifiedApproval: approve(i) }, verifier);
    expect(p.status).toBe('FOR ISSUE');
    expect(p.statusReasons).toEqual([]);
    expect(p.approval).toEqual({ reviewerId: 'test-reviewer-1', reviewerName: 'TEST REVIEWER', registration: 'TEST-REG-0001', approvedAt: '2026-11-21T09:00:00Z' });
  });
  it('the same valid approval without a verifier (no key/registry/authentication) stays DRAFT', () => {
    const i = base();
    const p = buildProposal({ ...i, verifiedApproval: approve(i) });
    expect(p.status).toBe('DRAFT');
    expect(p.approval).toBeNull();
    expect(p.statusReasons).toEqual([APPROVAL_UNAVAILABLE_REASON]);
  });
  it('an input changed after approval drops back to DRAFT', () => {
    const i = base();
    const a = approve(i);
    const edited = base(); edited.finance.tariffKesPerKwh = { value: 26, source: 'customer bill (test)' };
    const p = buildProposal({ ...edited, verifiedApproval: a }, verifier);
    expect(p.status).toBe('DRAFT');
    expect(p.approval).toBeNull();
    expect(p.statusReasons.join(' ')).toMatch(/changed since it was approved/);
  });
  it('a wrong signature gives DRAFT (wrong key, or a field altered after signing)', () => {
    const i = base();
    const wrongKey = approve(i, TEST_REVIEWER, 'TEST-ONLY-a-different-key-0123456789abcdef');
    expect(buildProposal({ ...i, verifiedApproval: wrongKey }, verifier).status).toBe('DRAFT');
    const altered = { ...approve(i), approvedAt: '2026-11-22T09:00:00Z' };
    const p = buildProposal({ ...i, verifiedApproval: altered }, verifier);
    expect(p.status).toBe('DRAFT');
    expect(p.statusReasons.join(' ')).toMatch(/signature is not valid/);
  });
  it('a reviewer not in the registry gives DRAFT, even with a valid signature', () => {
    const i = base();
    const stranger: AuthorisedReviewer = { reviewerId: 'test-not-registered', name: 'TEST STRANGER', registration: 'TEST-REG-9999' };
    const p = buildProposal({ ...i, verifiedApproval: approve(i, stranger) }, verifier);
    expect(p.status).toBe('DRAFT');
    expect(p.statusReasons.join(' ')).toMatch(/not in the authorised-reviewer registry/);
    // A registry id with a different name or registration does not match either.
    const imposter = approve(i, { ...TEST_REVIEWER, registration: 'TEST-REG-0002' });
    expect(buildProposal({ ...i, verifiedApproval: imposter }, verifier).status).toBe('DRAFT');
  });
  it('a malformed approval, a short key or an empty registry fail closed', () => {
    const i = base();
    expect(verifyApproval({ reviewerId: 'test-reviewer-1' }, proposalRevisionHash(i), verifier)).toMatchObject({ ok: false });
    expect(verifyApproval(approve(i), proposalRevisionHash(i), { signingKey: 'short', registry: [TEST_REVIEWER] })).toEqual({ ok: false, reason: APPROVAL_UNAVAILABLE_REASON });
    expect(verifyApproval(approve(i), proposalRevisionHash(i), { signingKey: TEST_KEY, registry: [] })).toEqual({ ok: false, reason: APPROVAL_UNAVAILABLE_REASON });
    expect(() => signApproval({ reviewerId: 'x', reviewerName: 'x', registration: 'x', approvedAt: '2026-11-21', revisionHash: proposalRevisionHash(i) }, 'short')).toThrow(/at least 32/);
  });
  it('the environment verifier needs both the key and a registry', () => {
    expect(approvalVerifierFromEnvironment({}, [TEST_REVIEWER])).toBeNull();
    expect(approvalVerifierFromEnvironment({ PROPOSAL_APPROVAL_SIGNING_KEY: TEST_KEY }, null)).toBeNull();
    expect(approvalVerifierFromEnvironment({ PROPOSAL_APPROVAL_SIGNING_KEY: TEST_KEY }, [])).toBeNull();
    expect(approvalVerifierFromEnvironment({ PROPOSAL_APPROVAL_SIGNING_KEY: TEST_KEY }, [TEST_REVIEWER])).toEqual({ signingKey: TEST_KEY, registry: [TEST_REVIEWER] });
  });
  it('exports print FOR ISSUE only with the verified approval', async () => {
    const { proposalToPdf } = await import('@/lib/solar/design/proposalExport');
    const i = base();
    const ok = buildProposal({ ...i, verifiedApproval: approve(i) }, verifier);
    const text = new TextDecoder('latin1').decode(proposalToPdf(ok));
    expect(text).toContain('(FOR ISSUE)');
    expect(text).toContain(ok.revisionHash);
    // A forged FOR ISSUE status without an approval is still printed as DRAFT.
    const forged = new TextDecoder('latin1').decode(proposalToPdf({ ...ok, approval: null }));
    expect(forged).not.toContain('(FOR ISSUE)');
    expect(forged).toContain('DRAFT: NOT FOR ISSUE');
  }, 30000); // jsPDF import under load exceeds 5 s
});

describe('approval audit trail (hash chain)', () => {
  const rev = proposalRevisionHash(base());
  const entry = (action: 'APPROVED' | 'REVOKED', at: string) => ({ action, proposalReference: 'TEST-001', revisionHash: rev, reviewerId: TEST_REVIEWER.reviewerId, reviewerName: TEST_REVIEWER.name, registration: TEST_REVIEWER.registration, at });
  const chain = (): ApprovalAuditRecord[] => appendAuditRecord(appendAuditRecord(appendAuditRecord([], entry('APPROVED', '2026-11-21T09:00:00Z')), entry('REVOKED', '2026-11-21T10:00:00Z')), entry('APPROVED', '2026-11-21T11:00:00Z'));

  it('a well-formed chain verifies and links each record to the previous one', () => {
    const c = chain();
    expect(c[0].previousRecordHash).toBeNull();
    expect(c[1].previousRecordHash).toBe(c[0].recordHash);
    expect(verifyAuditChain(c)).toEqual({ ok: true, headHash: c[2].recordHash });
    expect(verifyAuditChain([])).toEqual({ ok: true, headHash: null });
  });
  it('detects a tampered record (field changed, hash left as it was)', () => {
    const c = chain(); c[1] = { ...c[1], reviewerName: 'TEST SOMEONE ELSE' };
    expect(verifyAuditChain(c)).toMatchObject({ ok: false, index: 1, problem: expect.stringMatching(/record altered/) });
  });
  it('detects a tampered record whose own hash was recomputed (the link breaks)', () => {
    const c = chain();
    const body = { ...c[0], action: 'REVOKED' as const };
    c[0] = { ...body, recordHash: auditRecordHash(body) };
    expect(verifyAuditChain(c)).toMatchObject({ ok: false, index: 0 });
    const d = chain();
    const b1 = { ...d[1], at: '2026-11-21T09:30:00Z' };
    d[1] = { ...b1, recordHash: auditRecordHash(b1) };
    expect(verifyAuditChain(d)).toMatchObject({ ok: false, index: 2, problem: expect.stringMatching(/broken link/) });
  });
  it('detects a removed, reordered or inserted record and an unmatched revocation', () => {
    const c = chain();
    expect(verifyAuditChain([c[0], c[2]])).toMatchObject({ ok: false, index: 1 });
    expect(verifyAuditChain([c[1], c[0], c[2]])).toMatchObject({ ok: false, index: 0 });
    expect(verifyAuditChain(appendAuditRecord([], entry('REVOKED', '2026-11-21T09:00:00Z')))).toMatchObject({ ok: false, problem: expect.stringMatching(/REVOKED without/) });
  });
});

describe('approval date window (audit L1, 2026-11-21)', () => {
  const signedAt = (iso: string, i: ProposalInput) =>
    signApproval({ reviewerId: TEST_REVIEWER.reviewerId, reviewerName: TEST_REVIEWER.name, registration: TEST_REVIEWER.registration, approvedAt: iso, revisionHash: proposalRevisionHash(i) }, TEST_KEY);
  it('a correctly signed approval dated 2001 or 2099 gives DRAFT', () => {
    const i = base();
    expect(verifyApproval(signedAt('2001-01-01T00:00:00Z', i), proposalRevisionHash(i), verifier)).toMatchObject({ ok: false, reason: expect.stringMatching(/too old/) });
    expect(verifyApproval(signedAt('2099-01-01T00:00:00Z', i), proposalRevisionHash(i), verifier)).toMatchObject({ ok: false, reason: expect.stringMatching(/future/) });
  });
  it('an approval from earlier the same day is accepted', () => {
    const i = base();
    expect(verifyApproval(signedAt('2026-11-21T09:00:00Z', i), proposalRevisionHash(i), verifier).ok).toBe(true);
  });
});
