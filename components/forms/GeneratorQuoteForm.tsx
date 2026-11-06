'use client';

/**
 * GENERATOR QUOTATION FORM — the generator-specific RFQ the master brief (§10)
 * asks for: required kVA, new or used, application, phase, operating hours,
 * ATS, installation location, delivery, optional budget.
 *
 * Posts to /api/contact like every other form, so it inherits the server-side
 * validation, honeypot, rate limit, database storage and email alert. The
 * structured answers go into the message as labelled lines, so the sales team
 * reads them in the lead email without a schema change.
 *
 * Analytics: nothing personal is sent. AnalyticsTracker fires generate_lead
 * (service, source, page path only) when /api/contact accepts the POST.
 */

import { useId, useState, type FormEvent } from 'react';
import { referenceFromResponse } from '@/lib/leads/reference';
import { CALLBACK_PROMISE } from '@/lib/business/responseTime';

const WHATSAPP = '254768860665';

type Choice = { value: string; label: string };
const CONDITION: Choice[] = [
  { value: 'new', label: 'New (VOLTKA)' },
  { value: 'used', label: 'Used / refurbished' },
  { value: 'either', label: 'Either — advise me' },
];
const APPLICATION: Choice[] = [
  { value: 'standby', label: 'Standby (mains backup)' },
  { value: 'prime', label: 'Prime (runs daily / no mains)' },
  { value: 'continuous', label: 'Continuous (base load)' },
  { value: 'not-sure', label: 'Not sure' },
];
const PHASE: Choice[] = [
  { value: 'three', label: 'Three phase (415 V)' },
  { value: 'single', label: 'Single phase (240 V)' },
  { value: 'not-sure', label: 'Not sure' },
];
const YES_NO: Choice[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'not-sure', label: 'Not sure' },
];
const SITE: Choice[] = [
  { value: 'outdoor', label: 'Outdoors (silent set)' },
  { value: 'indoor', label: 'Plant room (open frame)' },
  { value: 'not-sure', label: 'Not sure' },
];

const labelOf = (list: Choice[], v: string) => list.find((c) => c.value === v)?.label ?? '—';

export interface GeneratorQuoteFormProps {
  /** Pre-fills the kVA field, e.g. on a size page. */
  defaultKva?: number;
  /** Which page produced the lead, e.g. "generator-size-100-kva". */
  source: string;
}

export default function GeneratorQuoteForm({ defaultKva, source }: GeneratorQuoteFormProps) {
  const id = useId();
  const [f, setF] = useState({
    name: '', phone: '', email: '', company: '', county: '',
    kva: defaultKva ? String(defaultKva) : '', condition: 'new', application: 'standby',
    phase: 'three', hours: '', ats: 'yes', site: 'outdoor', delivery: 'yes', budget: '', notes: '',
    consent: false, trap: '',
  });
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [ref, setRef] = useState<string | null>(null);
  const [problem, setProblem] = useState('');

  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (f.trap) { setState('sent'); return; } // honeypot: silent
    const phoneDigits = f.phone.replace(/\D/g, '');
    if (f.name.trim().length < 2) return setProblem('Please enter your name.');
    if (phoneDigits.length < 9) return setProblem('Please enter a phone number we can call.');
    if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) return setProblem('That email address does not look right.');
    if (f.kva && !(Number(f.kva) > 0 && Number(f.kva) <= 5000)) return setProblem('kVA should be a number between 1 and 5000, or leave it blank.');
    if (!f.consent) return setProblem('Please confirm we may contact you about this enquiry.');
    setProblem('');
    setState('sending');

    const message = [
      'GENERATOR QUOTATION REQUEST',
      `Required size: ${f.kva ? `${f.kva} kVA` : 'not sure — please size it'}`,
      `New or used: ${labelOf(CONDITION, f.condition)}`,
      `Application: ${labelOf(APPLICATION, f.application)}`,
      `Phase: ${labelOf(PHASE, f.phase)}`,
      `Operating hours per day: ${f.hours || 'not given'}`,
      `ATS / changeover needed: ${labelOf(YES_NO, f.ats)}`,
      `Installation: ${labelOf(SITE, f.site)}`,
      `Delivery needed: ${labelOf(YES_NO, f.delivery)}`,
      `Budget (optional): ${f.budget || 'not given'}`,
      f.notes ? `Notes: ${f.notes}` : '',
    ].filter(Boolean).join('\n');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: f.name.trim(),
          // The API requires an email; customers who give none are reached by phone.
          email: f.email.trim() || 'quote-form@emersoneims.com',
          phone: f.phone.trim(),
          company: f.company.trim() || undefined,
          location: f.county.trim() || undefined,
          service: 'generators',
          message: message.slice(0, 4900),
          source,
          company_website: f.trap,
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
        <p className="text-lg font-semibold text-green-400">Quotation request received</p>
        <p className="mt-2 text-sm text-gray-300">{CALLBACK_PROMISE}</p>
        {ref && (
          <p className="mt-2 text-sm text-gray-300">
            Your reference: <span className="font-mono font-semibold text-amber-400">{ref}</span>
          </p>
        )}
      </div>
    );
  }

  const input = 'w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2.5 text-white placeholder-gray-500 focus:border-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50';
  const lab = 'mb-1 block text-xs font-semibold uppercase tracking-wider text-amber-400/90';
  const select = (k: keyof typeof f, list: Choice[], label: string) => (
    <div>
      <label htmlFor={`${id}-${k}`} className={lab}>{label}</label>
      <select id={`${id}-${k}`} value={f[k] as string} onChange={set(k)} className={input}>
        {list.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
      </select>
    </div>
  );

  return (
    <form onSubmit={submit} noValidate className="space-y-4" aria-describedby={problem ? `${id}-problem` : undefined}>
      <div className="absolute h-px w-px overflow-hidden opacity-0" aria-hidden="true">
        <label htmlFor={`${id}-trap`}>Do not fill this in</label>
        <input id={`${id}-trap`} tabIndex={-1} autoComplete="off" value={f.trap} onChange={set('trap')} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className={lab}>Your name *</label>
          <input id={`${id}-name`} required autoComplete="name" value={f.name} onChange={set('name')} className={input} />
        </div>
        <div>
          <label htmlFor={`${id}-phone`} className={lab}>Phone / WhatsApp *</label>
          <input id={`${id}-phone`} required type="tel" autoComplete="tel" inputMode="tel" value={f.phone} onChange={set('phone')} className={input} placeholder="07xx xxx xxx" />
        </div>
        <div>
          <label htmlFor={`${id}-email`} className={lab}>Email (optional)</label>
          <input id={`${id}-email`} type="email" autoComplete="email" value={f.email} onChange={set('email')} className={input} />
        </div>
        <div>
          <label htmlFor={`${id}-company`} className={lab}>Company (optional)</label>
          <input id={`${id}-company`} autoComplete="organization" value={f.company} onChange={set('company')} className={input} />
        </div>
        <div>
          <label htmlFor={`${id}-county`} className={lab}>County / town</label>
          <input id={`${id}-county`} value={f.county} onChange={set('county')} className={input} placeholder="e.g. Nakuru" />
        </div>
        <div>
          <label htmlFor={`${id}-kva`} className={lab}>Size needed (kVA)</label>
          <input id={`${id}-kva`} inputMode="numeric" value={f.kva} onChange={set('kva')} className={input} placeholder="Leave blank if not sure" />
        </div>
        {select('condition', CONDITION, 'New or used')}
        {select('application', APPLICATION, 'How it will run')}
        {select('phase', PHASE, 'Supply')}
        <div>
          <label htmlFor={`${id}-hours`} className={lab}>Hours running per day</label>
          <input id={`${id}-hours`} inputMode="numeric" value={f.hours} onChange={set('hours')} className={input} placeholder="e.g. 4" />
        </div>
        {select('ats', YES_NO, 'Automatic changeover (ATS)')}
        {select('site', SITE, 'Where it will stand')}
        {select('delivery', YES_NO, 'Delivery to site')}
        <div>
          <label htmlFor={`${id}-budget`} className={lab}>Budget (optional)</label>
          <input id={`${id}-budget`} value={f.budget} onChange={set('budget')} className={input} placeholder="e.g. KES 3M" />
        </div>
      </div>
      <div>
        <label htmlFor={`${id}-notes`} className={lab}>Anything else (loads, motors, site access)</label>
        <textarea id={`${id}-notes`} rows={3} maxLength={1500} value={f.notes} onChange={set('notes')} className={input} />
      </div>
      <label className="flex items-start gap-2 text-sm text-gray-300">
        <input type="checkbox" checked={f.consent} onChange={(e) => setF((p) => ({ ...p, consent: e.target.checked }))} className="mt-1 h-4 w-4" />
        <span>
          You may contact me about this enquiry. See our <a href="/privacy" className="text-amber-400 underline underline-offset-2">privacy policy</a>.
        </span>
      </label>

      {problem && <p id={`${id}-problem`} role="alert" className="text-sm text-red-400">{problem}</p>}
      {state === 'error' && (
        <p role="alert" className="text-sm text-red-400">
          We couldn&apos;t send that just now. Please{' '}
          <a className="underline" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Generator quotation: ${f.kva ? `${f.kva} kVA` : 'size to be advised'}, ${labelOf(CONDITION, f.condition)}`)}`} target="_blank" rel="noopener noreferrer">WhatsApp us</a>{' '}
          or call +254 768 860 665.
        </p>
      )}

      <button
        type="submit"
        disabled={state === 'sending'}
        className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 py-3.5 font-bold text-black transition hover:opacity-90 disabled:opacity-50 sm:w-auto sm:px-8"
      >
        {state === 'sending' ? 'Sending…' : 'Request my quotation'}
      </button>
    </form>
  );
}
