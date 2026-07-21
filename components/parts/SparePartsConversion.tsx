'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// SparePartsConversion — turns the spare-parts page into a lead/sales engine.
// A frictionless "request a parts quote" form that opens a pre-filled WhatsApp chat
// to the business (the way parts are actually ordered in Kenya) and also logs the
// lead via /api/contact. Plus crawlable SEO content: parts categories, genuine-vs-
// counterfeit assurance, brands covered, and how to identify the exact part.
// ═══════════════════════════════════════════════════════════════════════════════

import { useState } from 'react';

const CATEGORIES = [
  { name: 'Filters', items: 'Oil, fuel, air, water-separator, bypass filters' },
  { name: 'Belts & hoses', items: 'Fan belts, radiator hoses, clamps' },
  { name: 'AVRs', items: 'Stamford, Mecc Alte, Leroy Somer, Kutai AVRs' },
  { name: 'Controllers', items: 'DeepSea, ComAp, PowerWizard, SmartGen modules' },
  { name: 'Alternators & parts', items: 'Stators, rotors, diodes, bearings, brushes' },
  { name: 'Injectors & fuel system', items: 'Injectors, lift pumps, injection pumps, solenoids' },
  { name: 'Cooling', items: 'Radiators, water pumps, thermostats, fans' },
  { name: 'Starting', items: 'Starter motors, alternators (charging), batteries' },
  { name: 'Gaskets & seals', items: 'Head gaskets, sump gaskets, oil seals, kits' },
  { name: 'Sensors & senders', items: 'Oil pressure, temperature, speed (MPU), level' },
  { name: 'ATS & switchgear parts', items: 'Contactors, breakers, relays, motorised mechanisms' },
  { name: 'Engine internals', items: 'Liners, pistons, rings, bearings, valves, turbos' },
];

const BRANDS = ['Cummins', 'Perkins', 'Caterpillar', 'FG Wilson', 'Volvo Penta', 'John Deere', 'Deutz', 'Mitsubishi', 'Doosan', 'Yanmar', 'Kohler', 'MTU', 'Stamford', 'Mecc Alte', 'Leroy Somer', 'DeepSea', 'ComAp'];

export default function SparePartsConversion() {
  const [form, setForm] = useState({ name: '', phone: '', brand: '', model: '', part: '' });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.part.trim()) return;
    const msg =
      `Hello EmersonEIMS, I need generator spare parts.\n` +
      (form.name ? `Name: ${form.name}\n` : '') +
      (form.brand ? `Brand: ${form.brand}\n` : '') +
      (form.model ? `Model/kVA: ${form.model}\n` : '') +
      `Part(s) needed: ${form.part}\n` +
      (form.phone ? `My number: ${form.phone}` : '');
    // Open WhatsApp (guaranteed delivery) on the user's click, before any await
    if (typeof window !== 'undefined') {
      window.open(`https://wa.me/254768860665?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    }
    // Also log the lead
    try {
      fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name || 'Parts enquiry', email: 'parts@request.local', phone: form.phone,
          service: 'spare-parts', source: 'spare_parts_quote',
          message: `Parts request — Brand: ${form.brand || '—'}, Model/kVA: ${form.model || '—'}, Parts: ${form.part}`,
          location: typeof window !== 'undefined' ? window.location.pathname : undefined,
        }),
      }).catch(() => {});
    } catch {}
  };

  const field = 'w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2.5 text-white placeholder-white/30 focus:border-cyan-500/60 focus:outline-none';

  return (
    <>
      {/* QUOTE / ORDER BAND */}
      <section id="request-parts" className="py-16 bg-gradient-to-b from-black via-slate-950 to-black border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-start">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-cyan-400/90 mb-3">Get the exact part, fast</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Request a Parts Quote</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Tell us your generator brand, model (or kVA) and the part you need — or just send a photo of the part or the engine
              nameplate. We match the exact OEM or quality-equivalent part, confirm price and stock, and arrange delivery or
              countrywide dispatch. The fastest way to order is WhatsApp.
            </p>
            <ul className="space-y-2 text-sm text-white/65">
              <li>✓ Genuine OEM &amp; quality-equivalent parts for all major brands</li>
              <li>✓ Send a photo of the part or nameplate — we identify it</li>
              <li>✓ Price &amp; stock confirmed on WhatsApp, countrywide dispatch</li>
              {/* OWNER CORRECTION 2026-07-21: same-day DISPATCH is real, so the
                  original claim was closer to the truth than my replacement.
                  Restored with the dispatch/arrival distinction intact. */}
              <li>✓ Confirmed orders dispatched the same day — arrival depends on transport, often a day or two</li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href="https://wa.me/254768860665?text=Hello%20EmersonEIMS%2C%20I%20need%20generator%20spare%20parts." target="_blank" rel="noopener noreferrer" className="px-5 py-3 bg-[#25D366] text-black font-bold rounded-xl hover:brightness-110">💬 WhatsApp parts desk</a>
              <a href="tel:+254768860665" className="px-5 py-3 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10">Call +254 768 860 665</a>
            </div>
          </div>

          <form onSubmit={submit} className="rounded-2xl border border-cyan-500/25 bg-white/[0.03] p-6 space-y-3">
            <h3 className="font-semibold text-white">Quick parts request</h3>
            <input className={field} placeholder="Your name" value={form.name} onChange={(e) => set('name', e.target.value)} />
            <input className={field} placeholder="Phone / WhatsApp number" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <input list="parts-brands" className={field} placeholder="Generator brand" value={form.brand} onChange={(e) => set('brand', e.target.value)} />
              <input className={field} placeholder="Model / kVA" value={form.model} onChange={(e) => set('model', e.target.value)} />
              <datalist id="parts-brands">{BRANDS.map((b) => <option key={b} value={b} />)}</datalist>
            </div>
            <textarea className={`${field} resize-none`} rows={3} placeholder="Part(s) needed — e.g. fuel filter, AVR, starter motor…" value={form.part} onChange={(e) => set('part', e.target.value)} required />
            <button type="submit" className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-xl transition-colors">Send request on WhatsApp →</button>
            <p className="text-[11px] text-white/40 text-center">Opens WhatsApp with your request pre-filled. We reply with price &amp; stock.</p>
          </form>
        </div>
      </section>

      {/* SEO CONTENT — parts categories, genuine assurance, brands */}
      <section className="py-16 bg-black">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Generator Spare Parts in Kenya — Every Brand, Every System</h2>
          <p className="text-white/70 leading-relaxed mb-8 max-w-3xl">
            EmersonEIMS supplies genuine and quality-equivalent generator spare parts for diesel sets across Kenya — from a single
            fuel filter to a full engine rebuild kit, an AVR, a controller or an alternator. We carry fast-moving consumables in
            stock and source specialist parts quickly, with countrywide dispatch to all 47 counties.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {CATEGORIES.map((c) => (
              <div key={c.name} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <h3 className="font-semibold text-cyan-300 mb-1">{c.name}</h3>
                <p className="text-sm text-white/55">{c.items}</p>
              </div>
            ))}
          </div>

          <div className="prose prose-invert max-w-none text-white/70 space-y-4">
            <h3 className="text-white text-xl font-bold">Genuine parts — why it matters</h3>
            <p>
              Counterfeit filters, AVRs and injectors are common in the regional market and they are a false economy: a fake oil
              filter that bypasses can destroy an engine, a counterfeit AVR can take out an alternator, and a non-spec injector
              ruins fuel economy and emissions. We supply genuine OEM parts and clearly-identified quality equivalents, so the
              part that goes into your set is the part that protects it.
            </p>
            <h3 className="text-white text-xl font-bold">How to get the exact part the first time</h3>
            <p>
              The fastest, most accurate way is to send us the engine and alternator <strong>nameplate</strong> (or a clear photo
              of the old part and its markings). From the make, model and serial we identify the precise part number — no
              guesswork, no wrong deliveries. For controllers, AVRs and electronics, the model and part number on the unit are
              what we match.
            </p>
            <h3 className="text-white text-xl font-bold">Brands we supply parts for</h3>
            <p>{BRANDS.join(' · ')} and more — engines, alternators, controllers and switchgear.</p>
          </div>
        </div>
      </section>
    </>
  );
}
