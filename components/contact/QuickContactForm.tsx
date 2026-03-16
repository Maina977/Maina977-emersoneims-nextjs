'use client';

import { useMemo, useState } from 'react';

type FormState = {
  name: string;
  contact: string;
  message: string;
};

export default function QuickContactForm() {
  const [form, setForm] = useState<FormState>({ name: '', contact: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const whatsappNumber = useMemo(() => {
    return '+254768860665';
  }, []);

  const whatsappHref = useMemo(() => {
    const text = `Hello Emerson EiMS.%0A%0AI'd like to request a site assessment.%0A%0AName: ${encodeURIComponent(form.name)}%0AContact: ${encodeURIComponent(form.contact)}%0A%0AMessage: ${encodeURIComponent(form.message)}`;
    return `https://wa.me/${whatsappNumber}?text=${text}`;
  }, [form.contact, form.message, form.name, whatsappNumber]);

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent('Site Assessment Request');
    const body = encodeURIComponent(
      `Name: ${form.name}\nContact: ${form.contact}\n\nMessage:\n${form.message}`
    );
    return `mailto:info@emersoneims.com?subject=${subject}&body=${body}`;
  }, [form.contact, form.message, form.name]);

  const canSubmit = form.name.trim() && form.contact.trim() && form.message.trim().length >= 10;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || status === 'sending') return;

    setStatus('sending');
    try {
      await fetch('/api/notifications/new-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversionType: 'form_submit',
          data: {
            name: form.name,
            contact: form.contact,
            message: form.message,
            source: 'quick_contact_form',
          },
        }),
      });
      setStatus('sent');
      setForm({ name: '', contact: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 gap-4"
      noValidate
      aria-describedby={status === 'error' ? 'qc-error' : status === 'sent' ? 'qc-success' : undefined}
    >
      <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <legend className="sr-only">Contact Information</legend>
        <div>
          <label className="block text-xs tracking-[0.2em] uppercase text-white/60" htmlFor="qc-name">
            Name <span aria-hidden="true">*</span>
          </label>
          <input
            id="qc-name"
            value={form.name}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            className="mt-2 w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]"
            placeholder="Your name"
            autoComplete="name"
            inputMode="text"
            required
            aria-required="true"
            aria-invalid={status === 'error' ? 'true' : undefined}
          />
        </div>
        <div>
          <label className="block text-xs tracking-[0.2em] uppercase text-white/60" htmlFor="qc-contact">
            Phone or Email <span aria-hidden="true">*</span>
          </label>
          <input
            id="qc-contact"
            value={form.contact}
            onChange={(e) => setForm((s) => ({ ...s, contact: e.target.value }))}
            className="mt-2 w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]"
            placeholder="+254 or name@email.com"
            autoComplete="tel"
            inputMode="text"
            required
            aria-required="true"
            aria-invalid={status === 'error' ? 'true' : undefined}
          />
        </div>
      </fieldset>

      <div>
        <label className="block text-xs tracking-[0.2em] uppercase text-white/60" htmlFor="qc-message">
          Message <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="qc-message"
          value={form.message}
          onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
          className="mt-2 w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]"
          placeholder="Site location, load size, timeline (10+ characters)"
          rows={5}
          required
          aria-required="true"
          aria-invalid={status === 'error' ? 'true' : undefined}
          aria-describedby="qc-message-hint"
        />
        <p id="qc-message-hint" className="mt-2 text-xs text-white/50">
          Keep it short - we will reply with the next steps.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center" role="group" aria-label="Submit options">
        <button
          type="submit"
          disabled={!canSubmit || status === 'sending'}
          className="inline-flex items-center justify-center rounded-xl bg-white text-black px-5 py-3 text-sm font-semibold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/90 transition"
          aria-busy={status === 'sending'}
        >
          {status === 'sending' ? 'Sending...' : 'Send Request'}
        </button>
        <a
          href={whatsappHref}
          className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-transparent text-white px-5 py-3 text-sm font-semibold tracking-wide hover:bg-white/10 transition"
          aria-label="Contact our technical team via WhatsApp"
        >
          WhatsApp Technical Team
        </a>
        <a
          href={mailtoHref}
          className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-transparent text-white px-5 py-3 text-sm font-semibold tracking-wide hover:bg-white/10 transition"
          aria-label="Send us an email"
        >
          Email
        </a>
      </div>

      {status === 'sent' && (
        <p id="qc-success" role="status" aria-live="polite" className="text-sm text-white/80">
          <span className="sr-only">Success: </span>
          Sent. We will get back to you shortly.
        </p>
      )}
      {status === 'error' && (
        <p id="qc-error" role="alert" aria-live="assertive" className="text-sm text-white/80">
          <span className="sr-only">Error: </span>
          Could not send right now. Use WhatsApp or Email above.
        </p>
      )}
    </form>
  );
}
