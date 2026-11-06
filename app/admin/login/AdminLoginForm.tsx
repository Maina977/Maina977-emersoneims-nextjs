'use client';

import { useState, type FormEvent } from 'react';

export default function AdminLoginForm() {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && json.ok) {
        window.location.assign('/admin/leads');
        return;
      }
      setError(json.error || 'Sign-in failed');
    } catch {
      setError('Sign-in failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="admin-key" className="mb-1 block text-sm font-medium text-white/80">Access key</label>
        <input
          id="admin-key"
          type="password"
          autoComplete="current-password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
        />
      </div>
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      <button type="submit" disabled={busy || !key} className="w-full rounded-lg bg-amber-500 py-2.5 font-semibold text-black disabled:opacity-50">
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
