'use client';

/**
 * Category enquiry form driven by lib/forms/rfqConfigs.ts. Same contract as
 * GeneratorQuoteForm: validates, posts labelled lines to /api/contact (which
 * stores, alerts and rate-limits), shows the EIMS reference, and offers
 * WhatsApp when sending fails. No personal data goes to analytics.
 */
import { useId, useState, type FormEvent } from 'react';
import { referenceFromResponse } from '@/lib/leads/reference';
import { CALLBACK_PROMISE } from '@/lib/business/responseTime';
import { RFQ_CONFIGS, type RfqConfig, type RfqField } from '@/lib/forms/rfqConfigs';

const WHATSAPP = '254768860665';

export default function RfqForm({ kind, source }: { kind: RfqConfig['id']; source: string }) {
  const cfg = RFQ_CONFIGS[kind];
  const id = useId();
  const initial: Record<string, string> = {};
  for (const fd of cfg.fields) initial[fd.id] = fd.kind === 'select' ? fd.options[0] : '';
  const [vals, setVals] = useState<Record<string, string>>(initial);
  const [who, setWho] = useState({ name: '', phone: '', email: '', company: '', county: '', consent: false, trap: '' });
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [ref, setRef] = useState<string | null>(null);
  const [problem, setProblem] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (who.trap) { setState('sent'); return; }
    if (who.name.trim().length < 2) return setProblem('Please enter your name.');
    if (who.phone.replace(/\D/g, '').length < 9) return setProblem('Please enter a phone number we can call.');
    if (who.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(who.email)) return setProblem('That email address does not look right.');
    for (const fd of cfg.fields) {
      const v = (vals[fd.id] ?? '').trim();
      if ('required' in fd && fd.required && !v) return setProblem(`Please fill in: ${fd.label}.`);
      if (fd.kind === 'number' && v && !(Number(v) > 0 && Number(v) <= (fd.max ?? 1e9))) return setProblem(`${fd.label} should be a number.`);
    }
    if (!who.consent) return setProblem('Please confirm we may contact you about this enquiry.');
    setProblem('');
    setState('sending');

    const message = [
      cfg.title.toUpperCase(),
      ...cfg.fields.map((fd) => `${fd.label}: ${(vals[fd.id] ?? '').trim() || 'not given'}`),
    ].join('\n').slice(0, 4900);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: who.name.trim(),
          email: who.email.trim() || 'rfq-form@emersoneims.com',
          phone: who.phone.trim(),
          company: who.company.trim() || undefined,
          location: who.county.trim() || undefined,
          service: cfg.service,
          message,
          source,
          company_website: who.trap,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setRef(referenceFromResponse(await res.json().catch(() => null)));
      setState('sent');
    } catch {
      setState('error');
    }
  }

  if (state === 'sent') {
    return (
      <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-6 text-center" role="status">
        <p className="text-lg font-semibold text-green-400">{cfg.successTitle}</p>
        <p className="mt-2 text-sm text-gray-300">{CALLBACK_PROMISE}</p>
        {ref && (
          <p className="mt-2 text-sm text-gray-300">
            Your reference: <span className="font-mono font-semibold text-amber-400">{ref}</span>
          </p>
        )}
        {cfg.photoHint && (
          <p className="mt-3 text-sm text-gray-300">
            {cfg.photoHint}{' '}
            <a className="text-green-400 underline" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`${cfg.title}${ref ? ` (${ref})` : ''}: photos attached`)}`} target="_blank" rel="noopener noreferrer">Open WhatsApp</a>
          </p>
        )}
      </div>
    );
  }

  const input = 'w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2.5 text-white placeholder-gray-500 focus:border-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50';
  const lab = 'mb-1 block text-xs font-semibold uppercase tracking-wider text-amber-400/90';
  const fieldEl = (fd: RfqField) => {
    const fid = `${id}-${fd.id}`;
    const req = 'required' in fd && fd.required;
    const label = <label htmlFor={fid} className={lab}>{fd.label}{req ? ' *' : ''}</label>;
    const on = (e: { target: { value: string } }) => setVals((p) => ({ ...p, [fd.id]: e.target.value }));
    if (fd.kind === 'select') {
      return <div key={fd.id}>{label}<select id={fid} value={vals[fd.id]} onChange={on} className={input}>{fd.options.map((o) => <option key={o}>{o}</option>)}</select></div>;
    }
    if (fd.kind === 'textarea') {
      return <div key={fd.id} className="sm:col-span-2">{label}<textarea id={fid} rows={3} maxLength={1500} value={vals[fd.id]} onChange={on} placeholder={fd.placeholder} className={input} /></div>;
    }
    return <div key={fd.id}>{label}<input id={fid} inputMode={fd.kind === 'number' ? 'numeric' : undefined} value={vals[fd.id]} onChange={on} placeholder={fd.placeholder} className={input} /></div>;
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-4" aria-label={cfg.title}>
      <div className="absolute h-px w-px overflow-hidden opacity-0" aria-hidden="true">
        <label htmlFor={`${id}-trap`}>Do not fill this in</label>
        <input id={`${id}-trap`} tabIndex={-1} autoComplete="off" value={who.trap} onChange={(e) => setWho((p) => ({ ...p, trap: e.target.value }))} />
      </div>
      <p className="text-sm text-gray-300">{cfg.intro}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className={lab}>Your name *</label>
          <input id={`${id}-name`} autoComplete="name" value={who.name} onChange={(e) => setWho((p) => ({ ...p, name: e.target.value }))} className={input} />
        </div>
        <div>
          <label htmlFor={`${id}-phone`} className={lab}>Phone / WhatsApp *</label>
          <input id={`${id}-phone`} type="tel" inputMode="tel" autoComplete="tel" value={who.phone} onChange={(e) => setWho((p) => ({ ...p, phone: e.target.value }))} className={input} placeholder="07xx xxx xxx" />
        </div>
        <div>
          <label htmlFor={`${id}-email`} className={lab}>Email (optional)</label>
          <input id={`${id}-email`} type="email" autoComplete="email" value={who.email} onChange={(e) => setWho((p) => ({ ...p, email: e.target.value }))} className={input} />
        </div>
        <div>
          <label htmlFor={`${id}-county`} className={lab}>County / town</label>
          <input id={`${id}-county`} value={who.county} onChange={(e) => setWho((p) => ({ ...p, county: e.target.value }))} className={input} placeholder="e.g. Kisumu" />
        </div>
        {cfg.fields.map(fieldEl)}
      </div>
      <label className="flex items-start gap-2 text-sm text-gray-300">
        <input type="checkbox" checked={who.consent} onChange={(e) => setWho((p) => ({ ...p, consent: e.target.checked }))} className="mt-1 h-4 w-4" />
        <span>You may contact me about this enquiry. See our <a href="/privacy" className="text-amber-400 underline underline-offset-2">privacy policy</a>.</span>
      </label>
      {problem && <p role="alert" className="text-sm text-red-400">{problem}</p>}
      {state === 'error' && (
        <p role="alert" className="text-sm text-red-400">
          We couldn&apos;t send that just now. Please{' '}
          <a className="underline" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(cfg.title)}`} target="_blank" rel="noopener noreferrer">WhatsApp us</a>{' '}
          or call +254 768 860 665.
        </p>
      )}
      <button type="submit" disabled={state === 'sending'} className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 py-3.5 font-bold text-black transition hover:opacity-90 disabled:opacity-50 sm:w-auto sm:px-8">
        {state === 'sending' ? 'Sending…' : cfg.submitLabel}
      </button>
    </form>
  );
}
