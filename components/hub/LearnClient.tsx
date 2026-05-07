'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, SectionHeading, SampleBadge, HubConnectStrip, useHubAudience } from '@/components/hub/HubShell';
import { KPICard, StatusBar, statusPalette, type StatusKey } from '@/components/charts/dataviz';

/**
 * Learning Mode — short structured lessons. Audience-aware:
 *  - Client track teaches how to buy and own safely.
 *  - Pro track teaches sizing, commissioning and acceptance.
 *
 * Lesson completion is held in localStorage (key: hub:learn).
 */

interface Lesson {
  id: string;
  track: 'client' | 'pro';
  title: string;
  minutes: number;
  summary: string;
  takeaways: string[];
  hubLink?: { href: string; label: string };
}

const LESSONS: Lesson[] = [
  // Client
  { id: 'c-buy-safe',  track: 'client', title: 'How to read a solar / UPS quote',  minutes:  6,
    summary: 'Five things every line item must show before you sign.',
    takeaways: ['Brand AND model on every line', 'Warranty term + who honours it', 'Battery technology + cycle life', 'Inverter surge in kVA for 5 s', 'BMS for any lithium'],
    hubLink: { href: '/hub/quote-audit', label: 'Audit your quote' } },
  { id: 'c-loads',     track: 'client', title: 'Sizing your loads in 10 minutes',   minutes: 10,
    summary: 'Walk through the appliance picker the right way.',
    takeaways: ['Watts × hours = daily kWh', 'Mark critical vs non-critical', 'Motors need 4× starting headroom', 'Evening fraction ≈ 55 % of daily kWh'],
    hubLink: { href: '/hub/verifier', label: 'Open the Verifier' } },
  { id: 'c-fakes',     track: 'client', title: 'Field verification of hardware authenticity', minutes:  7,
    summary: 'Documentation cautions by category and what to demand from the vendor.',
    takeaways: ['Manufacturer serial portal', 'Holographic seals intact', 'Original carton + manuals', 'Authorised partner invoice'],
    hubLink: { href: '/hub/authenticity', label: 'Run the check' } },
  { id: 'c-runtime',   track: 'client', title: 'Why your runtime is shorter than promised', minutes: 5,
    summary: 'Usable kWh, DoD, derate, ageing — explained without jargon.',
    takeaways: ['Usable ≈ 80 % of nameplate (Li)', 'Inverter losses ≈ 8 %', 'Wiring + heat ≈ 15 %', 'Year-3 capacity ≈ 92 %'],
    hubLink: { href: '/hub/abuse', label: 'See the curves' } },

  // Pro
  { id: 'p-sld',       track: 'pro',    title: 'Single-line diagrams that survive review', minutes: 12,
    summary: 'Layered SLD: utility → SPD → ATS → bus → DBs.',
    takeaways: ['Show breaker ratings', 'Mark critical buses', 'Earthing scheme labelled', 'Cable schedule attached'],
    hubLink: { href: '/hub/installation', label: 'Open the visualizer' } },
  { id: 'p-derate',    track: 'pro',    title: 'PV derate factors that actually matter',   minutes:  9,
    summary: 'Temp, soiling, mismatch, inverter clipping, wiring.',
    takeaways: ['T-coeff −0.35 %/°C typical', 'Soiling 5–8 % KE coastal', 'Mismatch 2 %', 'Wiring + clipping 4 %'],
    hubLink: { href: '/hub/simulator', label: 'Run the simulator' } },
  { id: 'p-commission',track: 'pro',    title: 'Commissioning acceptance numbers',         minutes: 14,
    summary: 'What to bring back from site so the client can sign off.',
    takeaways: ['Earth resistance ≤ 2 Ω commercial', 'String I-V Pmax ±5 %', 'UPS transfer < 10 ms', 'BMS cell Δ < 30 mV'],
    hubLink: { href: '/hub/maintenance', label: 'Schedule it' } },
  { id: 'p-fire',      track: 'pro',    title: 'Battery-room fire safety',                  minutes:  8,
    summary: 'Chemistry, ventilation, separation, extinguisher class.',
    takeaways: ['LFP ≠ flammable but still Class D', 'AGM needs H₂ vent at top of room', 'F500 over CO₂ for Li-ion', '60-min separation ≥ 10 kWh'],
    hubLink: { href: '/hub/safety', label: 'Score the room' } },
];

const STORAGE_KEY = 'hub:learn';

export default function LearnClient() {
  const { audience } = useHubAudience();
  const track = audience === 'pro' ? 'pro' : 'client';
  const lessons = LESSONS.filter((l) => l.track === track);

  const [done, setDone] = React.useState<Record<string, boolean>>({});
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setDone(JSON.parse(raw));
    } catch {}
  }, []);
  React.useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(done)); } catch {}
  }, [done]);

  const completed = lessons.filter((l) => done[l.id]).length;
  const totalMin  = lessons.reduce((a, l) => a + l.minutes, 0);
  const doneMin   = lessons.filter((l) => done[l.id]).reduce((a, l) => a + l.minutes, 0);
  const pct       = Math.round((completed / Math.max(1, lessons.length)) * 100);
  const sk: StatusKey = pct >= 80 ? 'success' : pct >= 40 ? 'info' : 'warning';

  return (
    <div className="space-y-6">
      <Card>
        <SectionHeading
          eyebrow={track === 'client' ? 'Buyer track' : 'Engineer track'}
          title={track === 'client' ? 'Buy and own safely' : 'Size, commission and accept'}
          caption={`The header audience toggle (Buyer / Engineer) switches the track. You are currently on the ${track === 'client' ? 'BUYER' : 'ENGINEER'} track.`}
        />
        <div className="grid gap-4 md:grid-cols-3">
          <KPICard label="Lessons completed" value={completed} unit={`/ ${lessons.length}`} status={sk} decimals={0} />
          <KPICard label="Time invested"     value={doneMin}   unit={`/ ${totalMin} min`}   status={sk} decimals={0} />
          <KPICard label="Progress"          value={pct}       unit="%"                     status={sk} decimals={0} />
        </div>
        <div className="mt-4">
          <StatusBar
            label="Track progress"
            value={completed}
            max={lessons.length}
            unit="lessons"
            thresholds={{ danger: 1, warning: lessons.length * 0.5, success: lessons.length }}
          />
        </div>
      </Card>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <SectionHeading eyebrow="Lessons" title={track === 'client' ? 'Client lessons' : 'Pro lessons'} caption="Mark each lesson done to update progress." />
          <SampleBadge />
        </div>
        <ol className="space-y-2">
          {lessons.map((l, i) => {
            const isDone = !!done[l.id];
            const p = statusPalette(isDone ? 'success' : 'info');
            return (
              <li key={l.id} className="rounded-md border p-3"
                  style={{ borderColor: p.border, background: isDone ? p.bg : 'transparent' }}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                      Lesson {i + 1} · {l.minutes} min
                    </div>
                    <div className="text-sm font-semibold tracking-tight">{l.title}</div>
                    <div className="mt-0.5 text-xs text-ink-secondary">{l.summary}</div>
                    <ul className="mt-2 grid gap-1 text-[12px] text-ink-secondary md:grid-cols-2">
                      {l.takeaways.map((t) => (
                        <li key={t} className="flex items-start gap-2">
                          <span aria-hidden className="mt-1 inline-block h-1.5 w-1.5 rounded-full"
                                style={{ background: 'var(--color-brand-blue)' }} />
                          {t}
                        </li>
                      ))}
                    </ul>
                    {l.hubLink && (
                      <Link href={l.hubLink.href} className="mt-2 inline-block text-xs text-ink-link">
                        Practice in {l.hubLink.label} →
                      </Link>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setDone((prev) => ({ ...prev, [l.id]: !prev[l.id] }))}
                    className="rounded-md border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider"
                    style={{
                      borderColor: isDone ? statusPalette('success').solid : 'var(--color-border-subtle)',
                      background: isDone ? statusPalette('success').solid : 'transparent',
                      color: isDone ? '#fff' : 'var(--color-text-secondary)',
                    }}
                  >
                    {isDone ? 'Done ✓' : 'Mark done'}
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      </Card>

      <Card>
        <SectionHeading eyebrow="Use this with" title="Connected workflow" />
        <p className="text-sm text-ink-secondary">
          Each lesson links into a tool: practise in{' '}
          <Link href="/hub/verifier" className="text-ink-link">Verifier</Link>,{' '}
          <Link href="/hub/simulator" className="text-ink-link">Simulator</Link>,{' '}
          <Link href="/hub/installation" className="text-ink-link">Installation</Link>,{' '}
          <Link href="/hub/safety" className="text-ink-link">Safety</Link> or{' '}
          <Link href="/hub/maintenance" className="text-ink-link">Maintenance</Link>.
        </p>
      </Card>

      <HubConnectStrip active="/hub/learn" />
    </div>
  );
}
