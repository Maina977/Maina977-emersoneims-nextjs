'use client';
/**
 * Accounts and organisation management (Report B, preview only).
 *
 * Every action calls /api/accounts/* (lib/accounts/http.ts guard). Changes
 * send the session's CSRF token (the readable __Host-eims_csrf cookie) in
 * x-csrf-token. The page shows what the server decides; it never decides
 * access itself. Professional approvals appear only for reviewers a registry
 * administrator has verified; none are verified in this preview.
 */
import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from 'react';

// ------------------------------------------------------------------ API client
type Json = Record<string, unknown>;
function csrfToken(): string {
  const m = typeof document === 'undefined' ? null : document.cookie.match(/(?:^|;\s*)__Host-eims_csrf=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : '';
}
async function api(method: string, path: string, body?: Json): Promise<Json & { ok: boolean; httpStatus: number }> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers['content-type'] = 'application/json';
  if (method !== 'GET') headers['x-csrf-token'] = csrfToken();
  try {
    const r = await fetch(`/api/accounts/${path}`, { method, headers, credentials: 'same-origin', body: body === undefined ? undefined : JSON.stringify(body) });
    const j = (await r.json().catch(() => ({}))) as Json;
    return { ...j, ok: r.ok && j.success !== false, httpStatus: r.status }; // not 'status': replies carry their own 'status' field (approval status)
  } catch {
    return { ok: false, httpStatus: 0, error: 'The connection failed. Check your network and try again.' };
  }
}
const errorOf = (r: Json) => String(r.error ?? 'Something went wrong.');

// ------------------------------------------------------------------ small UI parts
const input = 'w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none';
const btn = 'rounded-lg bg-amber-500 px-4 py-2 font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-50';
const btn2 = 'rounded-lg border border-slate-500 px-3 py-1.5 text-sm text-slate-100 hover:bg-slate-800 disabled:opacity-50';

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block text-sm text-slate-300"><span className="mb-1 block">{label}</span>{children}</label>;
}
function Card({ title, children }: { title: string; children: ReactNode }) {
  return <section className="rounded-xl border border-slate-700 bg-slate-900/60 p-5"><h2 className="mb-4 text-lg font-semibold text-white">{title}</h2>{children}</section>;
}
function Notice({ msg }: { msg: { kind: 'ok' | 'err'; text: string } | null }) {
  if (!msg) return null;
  return <p role={msg.kind === 'err' ? 'alert' : 'status'} className={`mt-3 rounded-lg px-3 py-2 text-sm ${msg.kind === 'err' ? 'bg-red-950 text-red-200' : 'bg-emerald-950 text-emerald-200'}`}>{msg.text}</p>;
}
type Msg = { kind: 'ok' | 'err'; text: string } | null;
function useAction() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);
  const run = useCallback(async (fn: () => Promise<Json & { ok: boolean }>, okText?: string) => {
    setBusy(true); setMsg(null);
    const r = await fn();
    setBusy(false);
    setMsg(r.ok ? (okText ? { kind: 'ok', text: okText } : null) : { kind: 'err', text: errorOf(r) });
    return r;
  }, []);
  return { busy, msg, setMsg, run };
}

// ------------------------------------------------------------------ signed out
interface Me { id: string; email: string; mfa: boolean; totpEnabled: boolean; isRegistryAdmin: boolean }

function SignIn({ onSignedIn }: { onSignedIn: () => void }) {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [code, setCode] = useState('');
  const [needCode, setNeedCode] = useState(false);
  const [useRecovery, setUseRecovery] = useState(false);
  const a = useAction();
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const second = needCode ? (useRecovery ? { recoveryCode: code } : { totp: code }) : {};
    const r = await a.run(() => api('POST', 'login', { email, password, ...second }));
    if (r.ok && r.needTotp) { setNeedCode(true); a.setMsg({ kind: 'ok', text: 'Enter the 6-digit code from your authenticator app.' }); return; }
    if (r.ok) onSignedIn();
  };
  return (
    <form onSubmit={submit} className="space-y-3" aria-label="Sign in">
      <Field label="Email"><input className={input} type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
      <Field label="Password"><input className={input} type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
      {needCode && (useRecovery
        ? <Field label="Recovery code"><input className={input} autoComplete="off" placeholder="XXXXX-XXXXX" required value={code} onChange={(e) => setCode(e.target.value)} /></Field>
        : <Field label="Authenticator code"><input className={input} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" required value={code} onChange={(e) => setCode(e.target.value)} /></Field>)}
      {needCode && <button type="button" className="text-sm text-amber-300 underline" onClick={() => { setUseRecovery(!useRecovery); setCode(''); }}>
        {useRecovery ? 'Use my authenticator app instead' : 'Lost your authenticator? Use a recovery code'}</button>}
      <button className={btn} disabled={a.busy}>Sign in</button>
      <Notice msg={a.msg} />
    </form>
  );
}

function SignUp() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [name, setName] = useState('');
  const a = useAction();
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const r = await a.run(() => api('POST', 'signup', { email, password, displayName: name }));
    if (r.ok) a.setMsg({ kind: 'ok', text: String(r.message ?? 'Check your email for a verification link.') });
  };
  return (
    <form onSubmit={submit} className="space-y-3" aria-label="Create an account">
      <Field label="Your name"><input className={input} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} /></Field>
      <Field label="Email"><input className={input} type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
      <Field label="Password (at least 12 characters)"><input className={input} type="password" autoComplete="new-password" minLength={12} required value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
      <button className={btn} disabled={a.busy}>Create account</button>
      <Notice msg={a.msg} />
    </form>
  );
}

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const a = useAction();
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const r = await a.run(() => api('POST', 'password/reset-request', { email }));
    if (r.ok) a.setMsg({ kind: 'ok', text: String(r.message ?? 'If the address has an account, a reset link has been sent.') });
  };
  return (
    <form onSubmit={submit} className="space-y-3" aria-label="Reset your password">
      <Field label="Email"><input className={input} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
      <button className={btn} disabled={a.busy}>Send reset link</button>
      <Notice msg={a.msg} />
    </form>
  );
}

// ------------------------------------------------------------------ links from emails
function TokenView({ view, token, me, onDone }: { view: string; token: string; me: Me | null; onDone: () => void }) {
  const [password, setPassword] = useState('');
  const a = useAction();
  if (view === 'verify') {
    return <Card title="Verify your email">
      <button className={btn} disabled={a.busy} onClick={async () => { const r = await a.run(() => api('POST', 'verify-email', { token }), 'Your email is verified. You can sign in now.'); if (r.ok) setTimeout(onDone, 1500); }}>Verify my email</button>
      <Notice msg={a.msg} />
    </Card>;
  }
  if (view === 'reset') {
    return <Card title="Choose a new password">
      <form className="space-y-3" onSubmit={async (e) => { e.preventDefault(); const r = await a.run(() => api('POST', 'password/reset', { token, password }), 'Password changed. Sign in with the new password.'); if (r.ok) setTimeout(onDone, 1500); }}>
        <Field label="New password (at least 12 characters)"><input className={input} type="password" autoComplete="new-password" minLength={12} required value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
        <button className={btn} disabled={a.busy}>Change password</button>
      </form>
      <Notice msg={a.msg} />
    </Card>;
  }
  if (view === 'invite') {
    return <Card title="Join an organisation">
      {!me ? <p className="text-slate-300">Sign in (or create an account with the invited email address) first, then open the invitation link again.</p>
        : <button className={btn} disabled={a.busy} onClick={async () => { const r = await a.run(() => api('POST', 'invites/accept', { token }), 'You have joined the organisation.'); if (r.ok) setTimeout(onDone, 1200); }}>Accept invitation</button>}
      <Notice msg={a.msg} />
    </Card>;
  }
  return null;
}

// ------------------------------------------------------------------ second factor
// ------------------------------------------------------------------ preview test email
/** Outbox mode only: the real messages sent to a TEST address, with their real links. Nothing leaves the system. */
function TestOutbox() {
  const [info, setInfo] = useState<{ mode: string; testDomains: string[] } | null>(null);
  const [email, setEmail] = useState('');
  const [msgs, setMsgs] = useState<{ kind: string; subject: string; text: string; createdAt: string }[] | null>(null);
  const a = useAction();
  useEffect(() => { void api('GET', 'mail-mode').then((r) => { if (r.ok) setInfo({ mode: String(r.mode), testDomains: r.testDomains as string[] }); }); }, []);
  if (!info || info.mode !== 'outbox') return null;
  const linkOf = (text: string) => (text.match(/https?:\/\/\S+?\/accounts\?view=\w+&token=[A-Za-z0-9_-]+/) ?? [])[0];
  return <Card title="Test email outbox (preview)">
    <p className="mb-3 text-sm text-slate-400">This preview does not send email. Messages to test addresses (@{info.testDomains.join(', @')}) appear here; open the link exactly as you would from your inbox.</p>
    <form className="flex flex-wrap items-end gap-2" onSubmit={async (e) => { e.preventDefault(); const r = await a.run(() => api('GET', `test-outbox?email=${encodeURIComponent(email)}`)); if (r.ok) setMsgs(r.messages as never); }}>
      <div className="min-w-[14rem] flex-1"><Field label="Test address"><input className={input} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></Field></div>
      <button className={btn2} disabled={a.busy}>Show messages</button>
    </form>
    {msgs && (msgs.length === 0 ? <p className="mt-3 text-sm text-slate-400">No messages for this address.</p> : <ul className="mt-3 space-y-2">{msgs.map((m, i) => { const link = linkOf(m.text); return <li key={i} className="rounded bg-slate-950/60 px-3 py-2 text-sm">
      <p className="text-slate-100">{m.subject} <span className="text-xs text-slate-400">· {m.createdAt.slice(0, 16).replace('T', ' ')}</span></p>
      {link ? <a className="text-amber-300 underline" href={link}>Open the link in this message</a> : <p className="text-slate-300">{m.text}</p>}
    </li>; })}</ul>)}
    <Notice msg={a.msg} />
  </Card>;
}

function RecoveryCodes({ codes }: { codes: string[] }) {
  return <div role="region" aria-label="Recovery codes" className="mt-3 rounded-lg border border-amber-500 bg-slate-950 p-4">
    <p className="mb-2 text-sm font-semibold text-amber-300">Save these recovery codes now. They are shown only once.</p>
    <p className="mb-3 text-xs text-slate-300">Each works once, in place of your authenticator, if you lose your phone. Store them somewhere safe and private (not in email). Anyone with your password and a code can sign in as you.</p>
    <ol className="grid grid-cols-2 gap-1 font-mono text-sm text-white sm:grid-cols-5">{codes.map((c) => <li key={c}>{c}</li>)}</ol>
  </div>;
}

function SecondFactor({ me, onChange }: { me: Me; onChange: () => void }) {
  const [setup, setSetup] = useState<{ secret: string; uri: string } | null>(null);
  const [code, setCode] = useState('');
  const [codes, setCodes] = useState<string[] | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [mode, setMode] = useState<'none' | 'regenerate' | 'replace'>('none');
  const [proof, setProof] = useState(''); const [proofIsRecovery, setProofIsRecovery] = useState(false);
  const a = useAction();
  useEffect(() => { if (me.totpEnabled && me.mfa) void api('GET', 'recovery-codes').then((r) => { if (r.ok) setRemaining(Number(r.remaining)); }); }, [me.totpEnabled, me.mfa, codes]);
  if (me.totpEnabled) return <Card title="Second factor">
    <p className="text-emerald-300">Authenticator app enabled{me.mfa ? ' and used for this session.' : '. Sign out and in again with a code to use it in this session.'}</p>
    {codes && <RecoveryCodes codes={codes} />}
    {me.mfa && <>
      {remaining !== null && <p className={`mt-2 text-sm ${remaining <= 2 ? 'text-amber-300' : 'text-slate-300'}`}>Unused recovery codes: {remaining}{remaining <= 2 ? ': make new ones soon.' : ''}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        <button className={btn2} onClick={() => { setMode(mode === 'regenerate' ? 'none' : 'regenerate'); setProof(''); }}>Make new recovery codes</button>
        <button className={btn2} onClick={() => { setMode(mode === 'replace' ? 'none' : 'replace'); setProof(''); }}>Replace my authenticator (new phone)</button>
      </div>
      {mode === 'regenerate' && <form className="mt-3 flex flex-wrap items-end gap-2" onSubmit={async (e) => { e.preventDefault(); const r = await a.run(() => api('POST', 'recovery-codes', { totp: proof })); if (r.ok) { setCodes(r.recoveryCodes as string[]); setMode('none'); } }}>
        <p className="w-full text-xs text-slate-400">Your current codes will stop working.</p>
        <Field label="Fresh authenticator code"><input className={input} inputMode="numeric" pattern="[0-9]{6}" required value={proof} onChange={(e) => setProof(e.target.value)} /></Field>
        <button className={btn} disabled={a.busy}>Make new codes</button>
      </form>}
      {mode === 'replace' && <form className="mt-3 space-y-2" onSubmit={async (e) => { e.preventDefault(); const r = await a.run(() => api('POST', 'totp/reset', proofIsRecovery ? { recoveryCode: proof } : { totp: proof }), 'Authenticator removed. Set up the new one now.'); if (r.ok) { setCodes(null); setSetup(null); onChange(); } }}>
        <p className="text-xs text-slate-400">This removes your authenticator and recovery codes and signs you out everywhere else. You then set up the new phone straight away.</p>
        <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={proofIsRecovery} onChange={(e) => { setProofIsRecovery(e.target.checked); setProof(''); }} /> I no longer have my old authenticator (use a recovery code)</label>
        <Field label={proofIsRecovery ? 'Unused recovery code' : 'Fresh authenticator code'}><input className={input} required value={proof} onChange={(e) => setProof(e.target.value)} /></Field>
        <button className={btn} disabled={a.busy}>Remove my authenticator</button>
      </form>}
    </>}
    <Notice msg={a.msg} />
  </Card>;
  return <Card title="Second factor (required for owners, admins and reviewers)">
    {!setup ? <button className={btn} disabled={a.busy} onClick={async () => { const r = await a.run(() => api('POST', 'totp/setup', {})); if (r.ok) setSetup({ secret: String(r.secret), uri: String(r.uri) }); }}>Set up an authenticator app</button> : (
      <form className="space-y-3" onSubmit={async (e) => { e.preventDefault(); const r = await a.run(() => api('POST', 'totp/enable', { code }), 'Second factor enabled.'); if (r.ok) { setCodes(r.recoveryCodes as string[]); onChange(); } }}>
        <p className="text-sm text-slate-300">In your authenticator app choose <em>enter a setup key</em> and type this key (time-based):</p>
        <p className="break-all rounded bg-slate-950 px-3 py-2 font-mono text-amber-300" aria-label="Setup key">{setup.secret}</p>
        <p className="break-all text-xs text-slate-400">Or open: <a className="underline" href={setup.uri}>{setup.uri}</a></p>
        <Field label="The 6-digit code it shows"><input className={input} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" required value={code} onChange={(e) => setCode(e.target.value)} /></Field>
        <button className={btn} disabled={a.busy}>Turn on</button>
      </form>
    )}
    <Notice msg={a.msg} />
  </Card>;
}

// ------------------------------------------------------------------ organisations
interface Org { id: string; name: string; role: string }
interface Member { user_id: string; email: string; display_name: string; role: string }
interface Project { id: string; tool: string; name: string; currentVersion: number; currentRevisionId: string | null; updatedAt: string | null; deletedAt: string | null }
interface Revision { id: string; version: number; contentSha256: string; note: string; createdAt: string | null; restoredFrom: string | null }
interface Reviewer { id: string; userId: string; legalName: string; professionalBody: string; registrationNumber: string; scope: { tool: string; documentType: string }[]; state: string; effectiveState: string; validFrom: string | null; validUntil: string | null }
const ROLES = ['viewer', 'engineer', 'admin', 'owner'];
const APPROVABLE: Record<string, string> = { solar: 'proposal', oracle: 'service-signoff', building: 'boq-certification' };
const BODIES = ['EBK', 'EPRA', 'BORAQS', 'WRA', 'NCA'];

function Members({ org, me }: { org: Org; me: Me }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [email, setEmail] = useState(''); const [role, setRole] = useState('engineer');
  const a = useAction();
  const { setMsg } = a;
  const load = useCallback(async () => { const r = await api('GET', `orgs/${org.id}/members`); if (r.ok) setMembers(r.members as Member[]); else setMsg({ kind: 'err', text: errorOf(r) }); }, [org.id, setMsg]);
  useEffect(() => { void load(); }, [load]);
  const manage = org.role === 'owner' || org.role === 'admin';
  return <Card title="Members">
    <table className="w-full text-left text-sm"><thead><tr className="text-slate-400"><th className="py-1">Member</th><th>Role</th></tr></thead><tbody>
      {members.map((m) => <tr key={m.user_id} className="border-t border-slate-800"><td className="py-1.5 text-slate-100">{m.display_name || m.email}<span className="block text-xs text-slate-400">{m.email}</span></td><td>
        {manage && m.user_id !== me.id ? <select aria-label={`Role of ${m.email}`} className={`${input} py-1`} value={m.role} onChange={async (e) => { const r = await a.run(() => api('POST', `orgs/${org.id}/members/${m.user_id}/role`, { role: e.target.value }), 'Role changed.'); if (r.ok) void load(); }}>{ROLES.map((x) => <option key={x}>{x}</option>)}</select> : <span className="text-slate-200">{m.role}</span>}
      </td></tr>)}
    </tbody></table>
    {manage && <form className="mt-4 flex flex-wrap items-end gap-2" onSubmit={async (e) => { e.preventDefault(); const r = await a.run(() => api('POST', `orgs/${org.id}/invites`, { email, role }), 'Invitation sent.'); if (r.ok) setEmail(''); }}>
      <div className="min-w-[14rem] flex-1"><Field label="Invite by email"><input className={input} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></Field></div>
      <Field label="Role"><select className={input} value={role} onChange={(e) => setRole(e.target.value)}>{ROLES.filter((x) => x !== 'owner').map((x) => <option key={x}>{x}</option>)}</select></Field>
      <button className={btn} disabled={a.busy}>Invite</button>
    </form>}
    <Notice msg={a.msg} />
  </Card>;
}

function ProjectRow({ org, p, onChanged, isReviewer }: { org: Org; p: Project; onChanged: () => void; isReviewer: boolean }) {
  const [open, setOpen] = useState(false);
  const [revs, setRevs] = useState<Revision[]>([]);
  const [status, setStatus] = useState<{ label: string; reason: string; reviewer?: { name: string; registration: string; approvedAt: string }; rejection?: { name: string; registration: string; rejectedAt: string; reason: string } } | null>(null);
  const [code, setCode] = useState('');
  const [decision, setDecision] = useState<'approve' | 'reject'>('approve');
  const [rejectReason, setRejectReason] = useState('');
  const a = useAction();
  const docType = APPROVABLE[p.tool];
  const load = useCallback(async () => {
    const r = await api('GET', `orgs/${org.id}/projects/${p.id}/revisions`);
    if (r.ok) setRevs((r.revisions as Revision[]).sort((x, y) => y.version - x.version));
    if (docType && p.currentRevisionId) {
      const s = await api('GET', `orgs/${org.id}/projects/${p.id}/revisions/${p.currentRevisionId}/approval?documentType=${docType}`);
      if (s.ok) setStatus(s.status as never);
    }
  }, [org.id, p.id, p.currentRevisionId, docType]);
  const current = revs.find((r) => r.id === p.currentRevisionId);
  const download = async () => {
    const r = await api('GET', `orgs/${org.id}/projects/${p.id}/export`);
    if (!r.ok) { a.setMsg({ kind: 'err', text: errorOf(r) }); return; }
    const { ok: _o, httpStatus: _s, success: _x, ...body } = r; void _o; void _s; void _x;
    const url = URL.createObjectURL(new Blob([JSON.stringify(body, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = `${p.name.replace(/[^\w.-]+/g, '_')}-v${p.currentVersion}.json`; link.click(); URL.revokeObjectURL(url);
  };
  return <li className="border-t border-slate-800 py-3">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div><span className="font-medium text-white">{p.name}</span> <span className="text-xs text-slate-400">{p.tool} · version {p.currentVersion}{p.deletedAt ? ' · deleted' : ''}</span></div>
      <div className="flex flex-wrap gap-2">
        <button className={btn2} aria-expanded={open} onClick={() => { setOpen(!open); if (!open) void load(); }}>{open ? 'Hide' : 'Revisions'}</button>
        <button className={btn2} onClick={download}>Export</button>
        {p.deletedAt
          ? <button className={btn2} disabled={a.busy} onClick={async () => { const r = await a.run(() => api('POST', `orgs/${org.id}/projects/${p.id}/undelete`, {}), 'Restored.'); if (r.ok) onChanged(); }}>Undelete</button>
          : <button className={btn2} disabled={a.busy} onClick={async () => { if (!confirm(`Delete "${p.name}"? It can be restored for 30 days.`)) return; const r = await a.run(() => api('POST', `orgs/${org.id}/projects/${p.id}/delete`, {}), 'Deleted (restorable for 30 days).'); if (r.ok) onChanged(); }}>Delete</button>}
      </div>
    </div>
    {open && <div className="mt-3 space-y-3">
      {docType && status && <p className="text-sm text-slate-200">Status of the current revision: <strong className={status.reviewer ? 'text-emerald-300' : 'text-amber-300'}>{status.label}</strong>
        {status.reviewer ? <span className="block text-xs text-slate-400">Approved by {status.reviewer.name} ({status.reviewer.registration}), {status.reviewer.approvedAt}</span>
          : status.rejection ? <span className="block text-xs text-red-300">Rejected by {status.rejection.name} ({status.rejection.registration}), {status.rejection.rejectedAt}: {status.rejection.reason}</span>
          : <span className="block text-xs text-slate-400">{status.reason}</span>}</p>}
      {/* Only once the status is known: never offer a review of a revision that is already approved. */}
      {docType && isReviewer && current && status && !status.reviewer && !p.deletedAt && <form className="flex flex-wrap items-end gap-2" aria-label="Review decision" onSubmit={async (e) => {
        e.preventDefault();
        const path = `orgs/${org.id}/projects/${p.id}/revisions/${current.id}/${decision}`;
        const body = { documentType: docType, revisionHash: current.contentSha256, totp: code, ...(decision === 'reject' ? { reason: rejectReason } : {}) };
        const r = await a.run(() => api('POST', path, body), decision === 'approve' ? 'Approved: this exact revision only.' : 'Rejected: the reason is recorded against this exact revision.');
        if (r.ok) { setCode(''); setRejectReason(''); void load(); }
      }}>
        <p className="w-full text-xs text-slate-400">You are reviewing revision {current.version} exactly (SHA-256 {current.contentSha256.slice(0, 16)}…). Any later change needs a new review.</p>
        <fieldset className="flex w-full gap-4 text-sm text-slate-300"><legend className="sr-only">Decision</legend>
          <label className="inline-flex items-center gap-1"><input type="radio" name={`decision-${p.id}`} checked={decision === 'approve'} onChange={() => setDecision('approve')} /> Approve</label>
          <label className="inline-flex items-center gap-1"><input type="radio" name={`decision-${p.id}`} checked={decision === 'reject'} onChange={() => setDecision('reject')} /> Reject</label>
        </fieldset>
        {decision === 'reject' && <div className="w-full"><Field label="Reason for rejection"><input className={input} required maxLength={1000} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} /></Field></div>}
        <Field label="Fresh authenticator code"><input className={input} inputMode="numeric" pattern="[0-9]{6}" required value={code} onChange={(e) => setCode(e.target.value)} /></Field>
        <button className={btn} disabled={a.busy}>{decision === 'approve' ? 'Approve this revision' : 'Reject this revision'}</button>
      </form>}
      <ol className="space-y-1 text-sm">
        {revs.map((r) => <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 rounded bg-slate-950/60 px-3 py-1.5">
          <span className="text-slate-200">Version {r.version}{r.id === p.currentRevisionId ? ' (current)' : ''}{r.restoredFrom ? ' · restored' : ''} <span className="text-xs text-slate-400">{r.createdAt?.slice(0, 16).replace('T', ' ')} · {r.contentSha256.slice(0, 12)}…{r.note ? ` · ${r.note}` : ''}</span></span>
          {r.id !== p.currentRevisionId && !p.deletedAt && <button className={btn2} disabled={a.busy} onClick={async () => { const x = await a.run(() => api('POST', `orgs/${org.id}/projects/${p.id}/revisions/${r.id}/restore`, { baseVersion: p.currentVersion }), `Version ${r.version} restored as a new version.`); if (x.ok) onChanged(); }}>Restore as new version</button>}
        </li>)}
      </ol>
    </div>}
    <Notice msg={a.msg} />
  </li>;
}

function Projects({ org, isReviewer }: { org: Org; isReviewer: boolean }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [name, setName] = useState(''); const [tool, setTool] = useState('building');
  const a = useAction();
  const { setMsg } = a;
  const load = useCallback(async () => { const r = await api('GET', `orgs/${org.id}/projects${showDeleted ? '?deleted=1' : ''}`); if (r.ok) setProjects(r.projects as Project[]); else setMsg({ kind: 'err', text: errorOf(r) }); }, [org.id, showDeleted, setMsg]);
  useEffect(() => { void load(); }, [load]);
  const canEdit = org.role !== 'viewer';
  return <Card title="Projects">
    <label className="mb-2 flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={showDeleted} onChange={(e) => setShowDeleted(e.target.checked)} /> Show deleted projects</label>
    {projects.length === 0 ? <p className="text-sm text-slate-400">No projects yet.</p> : <ul>{projects.map((p) => <ProjectRow key={p.id} org={org} p={p} onChanged={load} isReviewer={isReviewer} />)}</ul>}
    {canEdit && <form className="mt-4 flex flex-wrap items-end gap-2" onSubmit={async (e) => { e.preventDefault(); const r = await a.run(() => api('POST', `orgs/${org.id}/projects`, { tool, name, content: {} }), 'Project created. Save work into it from the tool.'); if (r.ok) { setName(''); void load(); } }}>
      <div className="min-w-[14rem] flex-1"><Field label="New project name"><input className={input} required value={name} onChange={(e) => setName(e.target.value)} /></Field></div>
      <Field label="Tool"><select className={input} value={tool} onChange={(e) => setTool(e.target.value)}><option value="solar">Solar Genius Pro</option><option value="oracle">Generator Oracle</option><option value="building">Building Suite Pro</option><option value="aquascan">AquaScan Pro</option></select></Field>
      <button className={btn} disabled={a.busy}>Create</button>
    </form>}
    <Notice msg={a.msg} />
  </Card>;
}

function Reviewers({ org, me, onMine }: { org: Org; me: Me; onMine: (verified: boolean) => void }) {
  const [list, setList] = useState<Reviewer[]>([]);
  const [legalName, setLegalName] = useState(''); const [body, setBody] = useState('EBK'); const [reg, setReg] = useState('');
  const [scope, setScope] = useState<Record<string, boolean>>({});
  const a = useAction();
  const load = useCallback(async () => {
    const r = await api('GET', `orgs/${org.id}/reviewers`);
    if (r.ok) { const l = r.reviewers as Reviewer[]; setList(l); onMine(l.some((x) => x.userId === me.id && x.effectiveState === 'verified')); }
  }, [org.id, me.id, onMine]);
  useEffect(() => { void load(); }, [load]);
  const mine = list.find((x) => x.userId === me.id);
  return <Card title="Professional reviewers">
    <p className="mb-3 text-sm text-slate-400">A reviewer can approve documents only after a registry administrator has checked their identity and registration. Registering here verifies nothing.</p>
    {list.length === 0 ? <p className="text-sm text-slate-400">No reviewer profiles in this organisation.</p> : <ul className="space-y-1 text-sm">
      {list.map((r) => <li key={r.id} className="text-slate-200">{r.legalName} · {r.professionalBody} {r.registrationNumber} · <strong className={r.effectiveState === 'verified' ? 'text-emerald-300' : 'text-amber-300'}>{r.effectiveState}</strong>{r.validUntil ? <span className="text-xs text-slate-400"> · valid to {r.validUntil}</span> : null}</li>)}
    </ul>}
    {!mine && <form className="mt-4 space-y-3" onSubmit={async (e) => { e.preventDefault(); const sc = Object.entries(scope).filter(([, v]) => v).map(([t]) => ({ tool: t, documentType: APPROVABLE[t] })); const r = await a.run(() => api('POST', `orgs/${org.id}/reviewers`, { legalName, professionalBody: body, registrationNumber: reg, scope: sc }), 'Profile registered: pending verification.'); if (r.ok) void load(); }}>
      <h3 className="font-medium text-white">Register as a reviewer</h3>
      {!me.mfa && <p className="text-sm text-amber-300">You need the second factor, used in this session, to register.</p>}
      <Field label="Legal name (as on your registration)"><input className={input} required value={legalName} onChange={(e) => setLegalName(e.target.value)} /></Field>
      <div className="flex flex-wrap gap-2"><Field label="Professional body"><select className={input} value={body} onChange={(e) => setBody(e.target.value)}>{BODIES.map((b) => <option key={b}>{b}</option>)}</select></Field>
        <div className="flex-1"><Field label="Registration number"><input className={input} required value={reg} onChange={(e) => setReg(e.target.value)} /></Field></div></div>
      <fieldset className="text-sm text-slate-300"><legend className="mb-1">Documents you are qualified to approve</legend>
        {Object.entries({ solar: 'Solar proposals', oracle: 'Generator service sign-offs', building: 'Bills of quantities' }).map(([t, l]) => <label key={t} className="mr-4 inline-flex items-center gap-1"><input type="checkbox" checked={!!scope[t]} onChange={(e) => setScope({ ...scope, [t]: e.target.checked })} /> {l}</label>)}
      </fieldset>
      <button className={btn} disabled={a.busy}>Register</button>
    </form>}
    <Notice msg={a.msg} />
  </Card>;
}

function Audit({ org }: { org: Org }) {
  const [rows, setRows] = useState<{ seq: number; at: string; action: string; objectType: string; recordHash: string }[] | null>(null);
  const [err, setErr] = useState('');
  return <Card title="Audit trail">
    {!rows ? <button className={btn2} onClick={async () => { const r = await api('GET', `orgs/${org.id}/audit`); if (r.ok) setRows(r.audit as never); else setErr(errorOf(r)); }}>Show the audit trail (admins)</button>
      : <ol className="max-h-80 space-y-1 overflow-y-auto text-xs text-slate-300">{rows.map((x) => <li key={x.seq} className="font-mono">#{x.seq} {x.at?.slice(0, 19).replace('T', ' ')} {x.action} ({x.objectType}) {x.recordHash.slice(0, 10)}…</li>)}</ol>}
    {err && <p role="alert" className="mt-2 text-sm text-red-300">{err}</p>}
  </Card>;
}

function RegistryReset() {
  const [email, setEmail] = useState(''); const [reason, setReason] = useState(''); const [ref, setRef] = useState(''); const [code, setCode] = useState('');
  const a = useAction();
  return <Card title="Reset a person's second factor (last resort)">
    <p className="mb-3 text-sm text-slate-400">Only when the person has lost both their authenticator and their recovery codes, and only after checking their identity outside this system (for example in person or by a video call against their ID). The reset signs them out everywhere and suspends any reviewer profile they have until it is re-verified.</p>
    <form className="grid gap-2 sm:grid-cols-2" onSubmit={async (e) => { e.preventDefault(); const r = await a.run(() => api('POST', 'registry/users/reset-second-factor', { email, reason, identityCheckRef: ref, totp: code })); if (r.ok) { a.setMsg({ kind: 'ok', text: `Second factor reset. Reviewer profiles suspended: ${Number(r.suspendedReviewerProfiles)}.` }); setEmail(''); setReason(''); setRef(''); setCode(''); } }}>
      <Field label="Their email address"><input className={input} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
      <Field label="Reason"><input className={input} required value={reason} onChange={(e) => setReason(e.target.value)} /></Field>
      <Field label="Reference of the identity check"><input className={input} required value={ref} onChange={(e) => setRef(e.target.value)} /></Field>
      <Field label="Your fresh authenticator code"><input className={input} inputMode="numeric" pattern="[0-9]{6}" required value={code} onChange={(e) => setCode(e.target.value)} /></Field>
      <button className={btn} disabled={a.busy}>Reset second factor</button>
    </form>
    <Notice msg={a.msg} />
  </Card>;
}

function Registry() {
  const [list, setList] = useState<Reviewer[]>([]);
  const [form, setForm] = useState<Record<string, { evidence: string; from: string; until: string; code: string; checked: boolean; reason: string }>>({});
  const a = useAction();
  const { setMsg } = a;
  const load = useCallback(async () => { const r = await api('GET', 'registry/reviewers'); if (r.ok) setList(r.reviewers as Reviewer[]); else setMsg({ kind: 'err', text: errorOf(r) }); }, [setMsg]);
  useEffect(() => { void load(); }, [load]);
  const f = (id: string) => form[id] ?? { evidence: '', from: '', until: '', code: '', checked: false, reason: '' };
  const set = (id: string, k: string, v: string | boolean) => setForm({ ...form, [id]: { ...f(id), [k]: v } });
  return <Card title="Reviewer registry (registry administrators)">
    <p className="mb-3 text-sm text-slate-400">Verify only after checking the identity document and the registration with the professional body. Record where that evidence is kept.</p>
    {list.length === 0 ? <p className="text-sm text-slate-400">No reviewer profiles.</p> : <ul className="space-y-4">{list.map((r) => <li key={r.id} className="border-t border-slate-800 pt-3 text-sm">
      <p className="text-slate-100">{r.legalName} · {r.professionalBody} {r.registrationNumber} · <strong>{r.effectiveState}</strong></p>
      {r.state !== 'verified' ? <form className="mt-2 grid gap-2 sm:grid-cols-2" onSubmit={async (e) => { e.preventDefault(); const x = f(r.id); const res = await a.run(() => api('POST', `registry/reviewers/${r.id}/verify`, { identityCheckStatus: x.checked ? 'checked' : 'not_checked', evidenceRef: x.evidence, validFrom: x.from, validUntil: x.until, totp: x.code }), 'Reviewer verified.'); if (res.ok) void load(); }}>
        <label className="flex items-center gap-2 text-slate-300 sm:col-span-2"><input type="checkbox" checked={f(r.id).checked} onChange={(e) => set(r.id, 'checked', e.target.checked)} /> I have checked the identity document and the registration</label>
        <Field label="Evidence reference"><input className={input} required value={f(r.id).evidence} onChange={(e) => set(r.id, 'evidence', e.target.value)} /></Field>
        <Field label="Fresh authenticator code"><input className={input} inputMode="numeric" pattern="[0-9]{6}" required value={f(r.id).code} onChange={(e) => set(r.id, 'code', e.target.value)} /></Field>
        <Field label="Registration valid from"><input className={input} type="date" required value={f(r.id).from} onChange={(e) => set(r.id, 'from', e.target.value)} /></Field>
        <Field label="Valid until"><input className={input} type="date" required value={f(r.id).until} onChange={(e) => set(r.id, 'until', e.target.value)} /></Field>
        <button className={btn} disabled={a.busy}>Verify</button>
      </form> : <form className="mt-2 flex flex-wrap items-end gap-2" onSubmit={async (e) => { e.preventDefault(); const res = await a.run(() => api('POST', `registry/reviewers/${r.id}/suspend`, { reason: f(r.id).reason }), 'Reviewer suspended.'); if (res.ok) void load(); }}>
        <div className="flex-1"><Field label="Reason for suspension"><input className={input} required value={f(r.id).reason} onChange={(e) => set(r.id, 'reason', e.target.value)} /></Field></div>
        <button className={btn2} disabled={a.busy}>Suspend</button>
      </form>}
    </li>)}</ul>}
    <Notice msg={a.msg} />
  </Card>;
}

function Organisations({ me }: { me: Me }) {
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [sel, setSel] = useState<string>('');
  const [name, setName] = useState('');
  const [isReviewer, setIsReviewer] = useState(false);
  const a = useAction();
  const load = useCallback(async () => { const r = await api('GET', 'orgs'); if (r.ok) { const l = r.orgs as Org[]; setOrgs(l); setSel((s) => s || l[0]?.id || ''); } }, []);
  useEffect(() => { void load(); }, [load]);
  const org = orgs.find((o) => o.id === sel);
  const needsMfa = org && (org.role === 'owner' || org.role === 'admin') && !me.mfa;
  return <div className="space-y-6">
    <Card title="Organisations">
      {orgs.length > 0 && <Field label="Organisation"><select className={input} value={sel} onChange={(e) => setSel(e.target.value)}>{orgs.map((o) => <option key={o.id} value={o.id}>{o.name} ({o.role})</option>)}</select></Field>}
      <form className="mt-4 flex flex-wrap items-end gap-2" onSubmit={async (e) => { e.preventDefault(); const r = await a.run(() => api('POST', 'orgs', { name }), 'Organisation created. You are its owner: owners need the second factor.'); if (r.ok) { setName(''); setSel(String(r.id)); void load(); } }}>
        <div className="min-w-[14rem] flex-1"><Field label="New organisation"><input className={input} required value={name} onChange={(e) => setName(e.target.value)} /></Field></div>
        <button className={btn} disabled={a.busy}>Create</button>
      </form>
      <Notice msg={a.msg} />
    </Card>
    {org && (needsMfa
      ? <p role="alert" className="rounded-lg bg-amber-950 px-4 py-3 text-amber-200">As {org.role} of {org.name} you need the second factor: set it up above, then sign out and sign in with a code.</p>
      : <>
        <Members org={org} me={me} />
        <Projects org={org} isReviewer={isReviewer} />
        <Reviewers org={org} me={me} onMine={setIsReviewer} />
        {(org.role === 'owner' || org.role === 'admin') && <Audit org={org} />}
      </>)}
  </div>;
}

// ------------------------------------------------------------------ app
export default function AccountsApp() {
  const [me, setMe] = useState<Me | null | undefined>(undefined);
  const [tab, setTab] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [link, setLink] = useState<{ view: string; token: string } | null>(null);
  const refresh = useCallback(async () => { const r = await api('GET', 'me'); setMe(r.ok ? (r.user as Me) : null); }, []);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const view = q.get('view'); const token = q.get('token');
    if (view && token) setLink({ view, token });
    void refresh();
  }, [refresh]);
  const clearLink = () => { setLink(null); window.history.replaceState(null, '', '/accounts'); void refresh(); };
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-10 text-slate-100">
      <h1 className="mb-1 text-3xl font-bold text-white">EmersonEIMS accounts</h1>
      <p className="mb-6 text-sm text-amber-300">Preview for internal testing. Not available on the public site. Professional approvals are inactive until reviewers are verified.</p>
      {link && <div className="mb-6"><TokenView view={link.view} token={link.token} me={me ?? null} onDone={clearLink} /></div>}
      {me === undefined ? <p className="text-slate-400" role="status">Loading…</p> : !me ? (
        <Card title={tab === 'signin' ? 'Sign in' : tab === 'signup' ? 'Create an account' : 'Forgotten password'}>
          <div className="mb-4 flex gap-2" role="tablist" aria-label="Account actions">
            {(['signin', 'signup', 'forgot'] as const).map((t) => <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? btn : btn2} onClick={() => setTab(t)}>{t === 'signin' ? 'Sign in' : t === 'signup' ? 'Create account' : 'Forgot password'}</button>)}
          </div>
          {tab === 'signin' ? <SignIn onSignedIn={refresh} /> : tab === 'signup' ? <SignUp /> : <ForgotPassword />}
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-slate-300">Signed in as <strong className="text-white">{me.email}</strong>{me.mfa ? ' · second factor used' : ''}</p>
            <button className={btn2} onClick={async () => { await api('POST', 'logout', {}); setMe(null); }}>Sign out</button></div>
          <SecondFactor me={me} onChange={refresh} />
          <Organisations me={me} />
          {me.isRegistryAdmin && (me.mfa ? <><Registry /><RegistryReset /></> : <p className="text-amber-300">Registry administration needs the second factor in this session.</p>)}
        </div>
      )}
      <div className="mt-6"><TestOutbox /></div>
    </main>
  );
}
