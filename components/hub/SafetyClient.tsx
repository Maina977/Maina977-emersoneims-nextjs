'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, SectionHeading, SampleBadge, HubConnectStrip, ProOnly } from '@/components/hub/HubShell';
import { KPICard, StatusBar, formatValue, statusPalette, type StatusKey } from '@/components/charts/dataviz';

/**
 * Safety & Fire Prevention — promoted from a Diagnostics sub-section
 * to a standalone module covering thermal-runaway risk, ventilation,
 * clearance, PPE and the fire-class extinguisher matrix.
 */

interface SafetyInput {
  chemistry: 'lifepo4' | 'nmc' | 'agm' | 'flooded';
  bankKwh: number;
  roomVolumeM3: number;
  ambientC: number;
  hasBms: boolean;
  hasSmokeAlarm: boolean;
  clearanceMm: number;       // around the bank
  hasFireSeparation: boolean;
}

const DEFAULT_INPUT: SafetyInput = {
  chemistry: 'lifepo4',
  bankKwh: 10,
  roomVolumeM3: 18,
  ambientC: 30,
  hasBms: true,
  hasSmokeAlarm: false,
  clearanceMm: 200,
  hasFireSeparation: false,
};

interface ChemProfile {
  label: string;
  thermalRunawayC: number;
  needsHydrogenVent: boolean;
  fireClass: string;
  extinguisher: string;
  notes: string;
}

const CHEM: Record<SafetyInput['chemistry'], ChemProfile> = {
  lifepo4:  { label: 'LiFePO4 (LFP)',  thermalRunawayC: 270, needsHydrogenVent: false, fireClass: 'Class D / Li-ion', extinguisher: 'F500 or copious water (not CO₂ alone)',           notes: 'Lowest runaway risk among Li chemistries. Still requires BMS.' },
  nmc:      { label: 'NMC Li-ion',     thermalRunawayC: 210, needsHydrogenVent: false, fireClass: 'Class D / Li-ion', extinguisher: 'F500, AVD or copious water',                       notes: 'Higher energy density, runaway propagation faster — separate cells where possible.' },
  agm:      { label: 'AGM lead-acid',  thermalRunawayC: 0,   needsHydrogenVent: true,  fireClass: 'Class C',          extinguisher: 'CO₂ for electrical; water for spreading fire',     notes: 'Sealed but vents H₂ on overcharge. Top-of-room ventilation mandatory.' },
  flooded:  { label: 'Flooded lead-acid', thermalRunawayC: 0, needsHydrogenVent: true, fireClass: 'Class C',          extinguisher: 'CO₂ for electrical; water for spreading fire',     notes: 'Highest H₂ output. Requires acid-resistant tray and bunding.' },
};

interface Risk { severity: 'success' | 'info' | 'warning' | 'danger'; title: string; detail: string }

function evaluate(i: SafetyInput): { risks: Risk[]; score: number; chem: ChemProfile } {
  const chem = CHEM[i.chemistry];
  const risks: Risk[] = [];

  // 1. BMS
  if ((i.chemistry === 'lifepo4' || i.chemistry === 'nmc') && !i.hasBms) {
    risks.push({ severity: 'danger', title: 'Lithium without BMS', detail: 'Mandatory. No BMS = thermal-runaway path on overcharge / over-discharge.' });
  }

  // 2. Ventilation for lead-acid
  const requiredCfm = chem.needsHydrogenVent ? Math.max(50, i.bankKwh * 6) : Math.max(30, i.bankKwh * 2);
  const roomCfm = i.roomVolumeM3 * 4; // 4 ACH baseline
  if (chem.needsHydrogenVent && roomCfm < requiredCfm) {
    risks.push({ severity: 'danger', title: 'Insufficient hydrogen ventilation', detail: `Need ≥ ${formatValue(requiredCfm, { unit: 'CFM' })}; room provides ≈ ${formatValue(roomCfm, { unit: 'CFM' })}.` });
  } else if (!chem.needsHydrogenVent && i.ambientC > 35 && roomCfm < requiredCfm) {
    risks.push({ severity: 'warning', title: 'Heat-removal ventilation low', detail: `Ambient ${i.ambientC} °C — increase ACH or add forced ventilation.` });
  }

  // 3. Clearance
  if (i.clearanceMm < 100) {
    risks.push({ severity: 'danger', title: 'Clearance below safety minimum', detail: 'Need ≥ 100 mm around the bank for service and heat dissipation.' });
  } else if (i.clearanceMm < 200) {
    risks.push({ severity: 'warning', title: 'Clearance tight', detail: 'Manufacturer recommendation typically ≥ 200 mm on at least three sides.' });
  }

  // 4. Smoke / heat alarm
  if (!i.hasSmokeAlarm) {
    risks.push({ severity: 'warning', title: 'No smoke / heat alarm', detail: 'Add a heat alarm in the battery room rated for the room temperature class.' });
  }

  // 5. Fire separation
  if (!i.hasFireSeparation && i.bankKwh >= 10) {
    risks.push({ severity: 'warning', title: 'No fire separation', detail: 'Banks ≥ 10 kWh should sit behind a 60-min fire-rated wall away from sleeping or escape areas.' });
  }

  // 6. Ambient
  if (i.ambientC >= 40) {
    risks.push({ severity: 'warning', title: 'Ambient too high', detail: `Cell life halves every +10 °C above 25 °C. Current ambient: ${i.ambientC} °C.` });
  }

  const weights = { danger: 30, warning: 12, info: 4, success: 0 };
  const score = Math.max(0, 100 - risks.reduce((a, r) => a + weights[r.severity], 0));
  return { risks, score, chem };
}

export default function SafetyClient() {
  const [input, setInput] = React.useState<SafetyInput>(DEFAULT_INPUT);
  const result = React.useMemo(() => evaluate(input), [input]);
  const sk: StatusKey = result.score >= 85 ? 'success' : result.score >= 60 ? 'warning' : 'danger';

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card>
          <SectionHeading eyebrow="Step 1" title="Battery room inputs" caption="Tell us what you have. Sample defaults shown." />
          <div className="grid gap-3 text-sm">
            <Field label="Chemistry">
              <select
                value={input.chemistry}
                onChange={(e) => setInput((p) => ({ ...p, chemistry: e.target.value as SafetyInput['chemistry'] }))}
                className="w-full rounded-md border bg-surface-base px-2 py-1.5"
                style={{ borderColor: 'var(--color-border-subtle)' }}
              >
                {(Object.keys(CHEM) as SafetyInput['chemistry'][]).map((k) => (
                  <option key={k} value={k}>{CHEM[k].label}</option>
                ))}
              </select>
            </Field>
            <Field label="Bank size (kWh)">
              <NumberInput value={input.bankKwh} step={1} onChange={(v) => setInput((p) => ({ ...p, bankKwh: v }))} />
            </Field>
            <Field label="Room volume (m³)">
              <NumberInput value={input.roomVolumeM3} step={1} onChange={(v) => setInput((p) => ({ ...p, roomVolumeM3: v }))} />
            </Field>
            <Field label="Ambient (°C)">
              <NumberInput value={input.ambientC} step={1} onChange={(v) => setInput((p) => ({ ...p, ambientC: v }))} />
            </Field>
            <Field label="Clearance around bank (mm)">
              <NumberInput value={input.clearanceMm} step={10} onChange={(v) => setInput((p) => ({ ...p, clearanceMm: v }))} />
            </Field>
            <Toggle label="BMS installed" value={input.hasBms} onChange={(v) => setInput((p) => ({ ...p, hasBms: v }))} />
            <Toggle label="Smoke / heat alarm" value={input.hasSmokeAlarm} onChange={(v) => setInput((p) => ({ ...p, hasSmokeAlarm: v }))} />
            <Toggle label="60-min fire-rated separation" value={input.hasFireSeparation} onChange={(v) => setInput((p) => ({ ...p, hasFireSeparation: v }))} />
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <SectionHeading eyebrow="Score" title="Fire-safety compliance" />
            <KPICard label="Score" value={result.score} unit="/100" status={sk} decimals={0} />
            <p className="mt-3 text-xs text-ink-secondary">
              {sk === 'success' && 'Compliant. Keep the alarm batteries fresh and re-score after any layout change.'}
              {sk === 'warning' && 'Several items must be closed before commissioning.'}
              {sk === 'danger' && 'Do not energise. Close the danger items first.'}
            </p>
          </Card>

          <Card>
            <SectionHeading eyebrow="Chemistry profile" title={result.chem.label} />
            <ul className="space-y-1 text-sm">
              <li><strong>Thermal-runaway onset:</strong> {result.chem.thermalRunawayC > 0 ? `${result.chem.thermalRunawayC} °C` : 'n/a'}</li>
              <li><strong>Hydrogen vent required:</strong> {result.chem.needsHydrogenVent ? 'YES' : 'No'}</li>
              <li><strong>Fire class:</strong> {result.chem.fireClass}</li>
              <li><strong>Extinguishing:</strong> {result.chem.extinguisher}</li>
            </ul>
            <p className="mt-2 text-xs text-ink-muted">{result.chem.notes}</p>
          </Card>
        </div>
      </div>

      <Card>
        <SectionHeading eyebrow="Findings" title="Risks" />
        {result.risks.length === 0 ? (
          <p className="text-sm text-ink-muted">No risks at the current inputs. Re-score after commissioning.</p>
        ) : (
          <ul className="space-y-2">
            {result.risks.map((r, i) => {
              const p = statusPalette(r.severity);
              return (
                <li key={i} className="rounded-md border p-3" style={{ borderColor: p.border, background: p.bg }}>
                  <div className="text-sm font-semibold" style={{ color: p.fg }}>{r.title}</div>
                  <div className="text-xs text-ink-secondary">{r.detail}</div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <SectionHeading eyebrow="Reference" title="Fire-class extinguisher matrix" caption="Pick the extinguisher by class — never water on a Class C live circuit." />
          <SampleBadge />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--color-border-subtle)' }}>
                <th className="py-2 pr-3 text-left text-[11px] font-semibold uppercase tracking-wider text-ink-muted">Class</th>
                <th className="py-2 pr-3 text-left text-[11px] font-semibold uppercase tracking-wider text-ink-muted">Fuel</th>
                <th className="py-2 pr-3 text-left text-[11px] font-semibold uppercase tracking-wider text-ink-muted">Use</th>
                <th className="py-2 pr-3 text-left text-[11px] font-semibold uppercase tracking-wider text-ink-muted">Avoid</th>
              </tr>
            </thead>
            <tbody className="text-ink-secondary">
              {[
                ['A', 'Wood, paper, cloth',         'Water, foam, ABC dry powder', '—'],
                ['B', 'Petrol, oil',                'Foam, CO₂, dry powder',       'Water (spreads fuel)'],
                ['C', 'Live electrical (≤ 1 kV)',   'CO₂, dry powder',             'Water (electrocution)'],
                ['D', 'Metal / Li-ion',             'F500, AVD, copious water',    'CO₂ alone (will reignite)'],
                ['F', 'Cooking oil',                'Wet-chemical',                'Water (boil-over)'],
              ].map((row) => (
                <tr key={row[0]} className="border-b" style={{ borderColor: 'var(--color-border-subtle)' }}>
                  {row.map((c, i) => <td key={i} className="py-2 pr-3 align-top">{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <ProOnly note="PPE & test thresholds — switch to Pro mode to view.">
        <Card>
          <SectionHeading eyebrow="Pro · PPE" title="PPE for battery work" />
          <ul className="grid gap-2 md:grid-cols-2 text-xs text-ink-secondary">
            <li className="rounded border px-2 py-1" style={{ borderColor: 'var(--color-border-subtle)' }}>Class 0 insulating gloves rated 1 kV (DC)</li>
            <li className="rounded border px-2 py-1" style={{ borderColor: 'var(--color-border-subtle)' }}>Arc-flash face shield (HRC 2 minimum)</li>
            <li className="rounded border px-2 py-1" style={{ borderColor: 'var(--color-border-subtle)' }}>Acid-resistant apron (lead-acid only)</li>
            <li className="rounded border px-2 py-1" style={{ borderColor: 'var(--color-border-subtle)' }}>Insulated tools (1 kV-rated)</li>
            <li className="rounded border px-2 py-1" style={{ borderColor: 'var(--color-border-subtle)' }}>Eye-wash station within 10 m (lead-acid)</li>
            <li className="rounded border px-2 py-1" style={{ borderColor: 'var(--color-border-subtle)' }}>Lock-out / tag-out kit at the DC isolator</li>
          </ul>
        </Card>
      </ProOnly>

      <Card>
        <SectionHeading eyebrow="Use this with" title="Connected workflow" />
        <p className="text-sm text-ink-secondary">
          Confirm the SLD in{' '}
          <Link href="/hub/installation" className="text-ink-link">Installation Visualizer</Link>, schedule alarm tests in{' '}
          <Link href="/hub/maintenance" className="text-ink-link">Maintenance Planner</Link>, and pull symptoms in{' '}
          <Link href="/hub/diagnostics" className="text-ink-link">Diagnostics</Link>.
        </p>
      </Card>

      <HubConnectStrip active="/hub/safety" />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid grid-cols-[160px_1fr] items-center gap-2">
      <span className="text-ink-muted">{label}</span>
      {children}
    </label>
  );
}

function NumberInput({ value, onChange, step = 1 }: { value: number; onChange: (n: number) => void; step?: number }) {
  return (
    <input
      type="number"
      value={value}
      step={step}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
      className="w-full rounded-md border bg-surface-base px-2 py-1.5 tabular-nums"
      style={{ borderColor: 'var(--color-border-subtle)' }}
    />
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="grid grid-cols-[160px_1fr] items-center gap-2">
      <span className="text-ink-muted">{label}</span>
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4" />
    </label>
  );
}
