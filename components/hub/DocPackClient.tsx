'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, SectionHeading, SampleBadge, HubConnectStrip } from '@/components/hub/HubShell';

/**
 * Documentation Pack — a printable installer / commissioning bundle.
 *
 * Honest scope: this is a browser-printable preview (window.print()).
 * No server-side PDF generation is performed. The user can print to
 * PDF via the OS print dialog, which is what installers / engineers
 * actually need on a job site (no extra dependencies).
 */

type Architecture = 'residential-solar' | 'sme-solar-ups' | 'datacentre-ups' | 'genset-only';

interface ProjectMeta {
  client: string;
  site: string;
  contact: string;
  ref: string;
  date: string;
  arch: Architecture;
  scope: string;
  systemKW: number;
  batteryKWh: number;
  upsKVA: number;
  pvKWp: number;
  gensetKVA: number;
}

const DEFAULT_META: ProjectMeta = {
  client: '[Client name]',
  site: '[Site address]',
  contact: '[Site contact + phone]',
  ref: 'EIMS-' + new Date().getFullYear() + '-XXXX',
  date: new Date().toISOString().slice(0, 10),
  arch: 'sme-solar-ups',
  scope: 'Supply, install, commission and hand over.',
  systemKW: 10,
  batteryKWh: 14.4,
  upsKVA: 6,
  pvKWp: 8,
  gensetKVA: 0,
};

const ARCH_LABEL: Record<Architecture, string> = {
  'residential-solar': 'Residential solar + battery',
  'sme-solar-ups': 'SME solar + UPS hybrid',
  'datacentre-ups': 'Data-centre UPS + genset',
  'genset-only': 'Generator-only (standby)',
};

/**
 * Section spec — each block is a printable A4 page (sort of).
 * Engineer/installer ticks each item on the printed copy.
 */
const SLD_NOTES: Record<Architecture, string[]> = {
  'residential-solar': [
    'PV array → DC isolator → MPPT charge controller / hybrid inverter',
    'Battery bank → DC fuse + class-T or NH fuse → inverter DC bus',
    'Inverter AC out → AC isolator → consumer unit (RCBO per circuit)',
    'Earthing: TT or TN-S, electrode resistance ≤ 10 Ω, bond all metal frames',
    'SPD Type 2 on AC side, Type 1+2 on DC side (PV + battery)',
  ],
  'sme-solar-ups': [
    'PV array → DC isolator → hybrid inverter (with grid + genset port)',
    'Battery bank → BMS → DC fuse → inverter DC bus',
    'Hybrid inverter AC out → ATS → critical loads MCB',
    'Online double-conversion UPS in parallel for IT racks (kVA per rack)',
    'Earthing TN-S, separate electrode for PV array, equipotential bond',
    'SPD Type 1+2 at main board, Type 2 at sub-boards, Type 3 at rack',
  ],
  'datacentre-ups': [
    'Utility → MV/LV transformer → main LV board with Form 3b separation',
    'Genset (N+1) → ATS → main LV board (open-transition)',
    'Modular online UPS (2N or N+1) → static switch → maintenance bypass → PDU',
    'Earthing TN-S with separately-derived neutral, ≤ 1 Ω electrode',
    'Cooling on UPS-backed circuits (precision DX or chilled-water with UPS pump)',
    'SPD Type 1 at LV main, Type 2 at UPS input, surge-protected PDU strips',
  ],
  'genset-only': [
    'Genset → ATS → main LV board → essential load distribution',
    'Fuel: belly tank (8 h) + bulk tank with bunding 110 % volume',
    'Exhaust: residential silencer, condensate drain, ≥ 3 m clearance from openings',
    'Battery: 12/24 V starter battery + automatic float charger',
    'Earthing TN-C-S; neutral lift handled by ATS configuration',
    'Remote stop / e-stop at panel, key-lock, lockable fuel tap',
  ],
};

const COMMISSIONING_CHECK: { group: string; items: string[] }[] = [
  {
    group: 'Mechanical',
    items: [
      'Equipment torqued to spec (record values in margin)',
      'PV modules secured, no shading, MC4 connectors crimped + sealed',
      'Battery rack bolted, terminals torqued, no swollen cells',
      'Cable trays/ducts mechanically supported, no sharp edges, fire-stopped at penetrations',
      'Genset mountings on anti-vibration pads, exhaust hangers, fuel lines secured',
    ],
  },
  {
    group: 'Electrical',
    items: [
      'Insulation resistance ≥ 1 MΩ on all circuits (record per circuit)',
      'Earth-electrode resistance measured and recorded (target ≤ 10 Ω; ≤ 1 Ω data-centre)',
      'Continuity of protective conductors verified end-to-end',
      'RCD trip times within IEC 61008 limits at I_Δn and 5×I_Δn',
      'Polarity verified at every socket/outlet on UPS + bypass paths',
      'SPD indicator windows green; Type 1 verified ≤ 25 kA (10/350 µs) where required',
    ],
  },
  {
    group: 'Functional',
    items: [
      'Loss-of-mains test: load transfers to UPS / battery within rated time',
      'Genset start: cranks, syncs, picks up load on ATS within 10 s',
      'Return-to-mains: open transition, no equipment trip',
      'Inverter island mode tested with grid open',
      'Battery cycled to ≥ 80 % DoD then recharged; capacity ≥ 90 % nameplate',
      'Alarm console reachable on site network; SNMP/Modbus tags verified',
    ],
  },
  {
    group: 'Safety & handover',
    items: [
      'Fire extinguishers per matrix (CO₂ for electrical, ABC for general, F-class for kitchens)',
      'PPE on site: insulated gloves Class 0, face shield, arc-rated jacket where Ik > 6 kA',
      'Single-line diagram printed and laminated at panel',
      'Operator trained: start/stop, alarm response, emergency shutdown',
      'Service contract & SLA explained, next service date scheduled',
      'As-built drawings + test certificates handed over',
    ],
  },
];

const ACCEPTANCE_TABLE_ROWS = [
  ['Pre-commissioning checks', '☐ Pass / ☐ Fail', '____________________'],
  ['Earth-electrode resistance', '____ Ω',         '____________________'],
  ['Insulation resistance min.', '____ MΩ',        '____________________'],
  ['Loss-of-mains transfer time','____ ms',        '____________________'],
  ['Genset start time',          '____ s',         '____________________'],
  ['Battery autonomy at full load','____ min',     '____________________'],
  ['UPS efficiency (online)',    '____ %',         '____________________'],
  ['THD at PCC',                 '____ %',         '____________________'],
  ['Operator training delivered','☐ Yes / ☐ No',   '____________________'],
  ['Documentation handed over',  '☐ Yes / ☐ No',   '____________________'],
];

export default function DocPackClient() {
  const [m, setM] = React.useState<ProjectMeta>(DEFAULT_META);

  const sldNotes = SLD_NOTES[m.arch];

  function set<K extends keyof ProjectMeta>(k: K, val: ProjectMeta[K]) {
    setM((p) => ({ ...p, [k]: val }));
  }

  return (
    <div className="space-y-6">
      <Card>
        <SectionHeading
          eyebrow="Step 1"
          title="Project meta"
          caption="Fill in the project header, then preview the bundle below. Use your browser's Print → Save as PDF to export."
        />
        <div className="grid gap-3 md:grid-cols-3 text-sm">
          {([
            ['client',  'Client',         'text'],
            ['site',    'Site address',   'text'],
            ['contact', 'Site contact',   'text'],
            ['ref',     'Project ref.',   'text'],
            ['date',    'Date',           'date'],
          ] as const).map(([k, label, type]) => (
            <label key={k} className="grid gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">{label}</span>
              <input
                type={type}
                value={m[k] as string}
                onChange={(e) => set(k as keyof ProjectMeta, e.target.value as ProjectMeta[typeof k])}
                className="rounded-md border bg-surface-base px-2 py-1.5"
                style={{ borderColor: 'var(--color-border-subtle)' }}
              />
            </label>
          ))}
          <label className="grid gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Architecture</span>
            <select
              value={m.arch}
              onChange={(e) => set('arch', e.target.value as Architecture)}
              className="rounded-md border bg-surface-base px-2 py-1.5"
              style={{ borderColor: 'var(--color-border-subtle)' }}
            >
              {(Object.keys(ARCH_LABEL) as Architecture[]).map((a) => (
                <option key={a} value={a}>{ARCH_LABEL[a]}</option>
              ))}
            </select>
          </label>
          {([
            ['systemKW',   'System size (kW)'],
            ['batteryKWh', 'Battery (kWh)'],
            ['upsKVA',     'UPS (kVA)'],
            ['pvKWp',      'PV (kWp)'],
            ['gensetKVA',  'Genset (kVA)'],
          ] as const).map(([k, label]) => (
            <label key={k} className="grid gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">{label}</span>
              <input
                type="number"
                value={m[k] as number}
                step={0.1}
                onChange={(e) => set(k as keyof ProjectMeta, (Number(e.target.value) || 0) as ProjectMeta[typeof k])}
                className="rounded-md border bg-surface-base px-2 py-1.5 tabular-nums"
                style={{ borderColor: 'var(--color-border-subtle)' }}
              />
            </label>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <SampleBadge />
          <button
            type="button"
            onClick={() => typeof window !== 'undefined' && window.print()}
            className="btn-primary"
          >
            <span aria-hidden>🖨</span> Print / Save as PDF
          </button>
        </div>
      </Card>

      {/* PRINTABLE REGION */}
      <div id="docpack-printable" className="space-y-6 print:space-y-0">
        <Card>
          <header className="border-b pb-3 mb-4" style={{ borderColor: 'var(--color-border-subtle)' }}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-ink-muted">Emerson Industrial Maintenance Services</div>
                <h2 className="text-2xl font-semibold mt-1">Installation & Commissioning Pack</h2>
                <div className="text-sm text-ink-secondary mt-1">{ARCH_LABEL[m.arch]}</div>
              </div>
              <div className="text-right text-xs text-ink-secondary">
                <div>Ref: <strong>{m.ref}</strong></div>
                <div>Date: <strong>{m.date}</strong></div>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-1 mt-3 text-sm">
              <div><dt className="inline text-ink-muted">Client: </dt><dd className="inline font-medium">{m.client}</dd></div>
              <div><dt className="inline text-ink-muted">Site: </dt><dd className="inline font-medium">{m.site}</dd></div>
              <div><dt className="inline text-ink-muted">Contact: </dt><dd className="inline font-medium">{m.contact}</dd></div>
              <div><dt className="inline text-ink-muted">Scope: </dt><dd className="inline font-medium">{m.scope}</dd></div>
            </dl>
            <dl className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-3 text-xs">
              <div className="rounded border px-2 py-1" style={{ borderColor: 'var(--color-border-subtle)' }}><dt className="text-ink-muted">System</dt><dd className="font-semibold tabular-nums">{m.systemKW} kW</dd></div>
              <div className="rounded border px-2 py-1" style={{ borderColor: 'var(--color-border-subtle)' }}><dt className="text-ink-muted">Battery</dt><dd className="font-semibold tabular-nums">{m.batteryKWh} kWh</dd></div>
              <div className="rounded border px-2 py-1" style={{ borderColor: 'var(--color-border-subtle)' }}><dt className="text-ink-muted">UPS</dt><dd className="font-semibold tabular-nums">{m.upsKVA} kVA</dd></div>
              <div className="rounded border px-2 py-1" style={{ borderColor: 'var(--color-border-subtle)' }}><dt className="text-ink-muted">PV</dt><dd className="font-semibold tabular-nums">{m.pvKWp} kWp</dd></div>
              <div className="rounded border px-2 py-1" style={{ borderColor: 'var(--color-border-subtle)' }}><dt className="text-ink-muted">Genset</dt><dd className="font-semibold tabular-nums">{m.gensetKVA} kVA</dd></div>
            </dl>
          </header>

          <SectionHeading eyebrow="Section A" title="Single-line diagram (reference)" caption="Use as a blueprint; redraw to scale on as-built." />
          <ol className="list-decimal pl-5 text-sm space-y-1">
            {sldNotes.map((n, i) => <li key={i}>{n}</li>)}
          </ol>
        </Card>

        <Card>
          <SectionHeading eyebrow="Section B" title="Commissioning checklist" caption="Tick on the printed copy. Engineer signs each block." />
          <div className="grid gap-4 md:grid-cols-2">
            {COMMISSIONING_CHECK.map((g) => (
              <div key={g.group} className="rounded border p-3" style={{ borderColor: 'var(--color-border-subtle)' }}>
                <div className="text-[11px] uppercase tracking-[0.2em] text-ink-muted">{g.group}</div>
                <ul className="mt-2 space-y-1 text-sm">
                  {g.items.map((it, i) => (
                    <li key={i} className="flex gap-2"><span className="select-none">☐</span><span>{it}</span></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeading eyebrow="Section C" title="Acceptance test record" />
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--color-border-subtle)' }}>
                <th className="text-left p-2 text-xs uppercase tracking-wider text-ink-muted">Test</th>
                <th className="text-left p-2 text-xs uppercase tracking-wider text-ink-muted">Result</th>
                <th className="text-left p-2 text-xs uppercase tracking-wider text-ink-muted">Engineer initials</th>
              </tr>
            </thead>
            <tbody>
              {ACCEPTANCE_TABLE_ROWS.map((r, i) => (
                <tr key={i} className="border-b" style={{ borderColor: 'var(--color-border-subtle)' }}>
                  <td className="p-2">{r[0]}</td>
                  <td className="p-2 tabular-nums">{r[1]}</td>
                  <td className="p-2">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card>
          <SectionHeading eyebrow="Section D" title="Sign-off" />
          <div className="grid gap-6 md:grid-cols-2 text-sm">
            <div>
              <div className="text-xs uppercase text-ink-muted">Installation engineer</div>
              <div className="mt-6 border-t pt-1" style={{ borderColor: 'var(--color-border-subtle)' }}>Name / Signature</div>
              <div className="mt-4 border-t pt-1" style={{ borderColor: 'var(--color-border-subtle)' }}>Date</div>
            </div>
            <div>
              <div className="text-xs uppercase text-ink-muted">Client representative</div>
              <div className="mt-6 border-t pt-1" style={{ borderColor: 'var(--color-border-subtle)' }}>Name / Signature</div>
              <div className="mt-4 border-t pt-1" style={{ borderColor: 'var(--color-border-subtle)' }}>Date</div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <SectionHeading eyebrow="Use this with" title="Connected workflow" />
        <p className="text-sm text-ink-secondary">
          Pull the architecture and SLD reference from the{' '}
          <Link href="/hub/installation" className="text-ink-link">Installation Visualizer</Link>; carry maintenance frequencies forward into the{' '}
          <Link href="/hub/maintenance" className="text-ink-link">Maintenance Planner</Link>.
        </p>
      </Card>

      <HubConnectStrip active="/hub/doc-pack" />

      {/* eslint-disable-next-line react/no-unknown-property */}
      <style jsx global>{`
        @media print {
          @page { size: A4; margin: 14mm; }
          body * { visibility: hidden !important; }
          #docpack-printable, #docpack-printable * { visibility: visible !important; }
          #docpack-printable {
            position: absolute !important;
            inset: 0 !important;
            background: #fff !important;
            color: #000 !important;
          }
          #docpack-printable .border { border-color: #000 !important; }
        }
      `}</style>
    </div>
  );
}
