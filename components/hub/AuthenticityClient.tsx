'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, SectionHeading, SampleBadge, HubConnectStrip } from '@/components/hub/HubShell';
import { KPICard, StatusBar, formatValue, statusPalette, type StatusKey } from '@/components/charts/dataviz';

/**
 * Authenticity Verification — buyer-facing module that turns
 * "is this brand/model the unit on my invoice?" into a verifiable checklist
 * with serial portals, BIS/CE markings, seal photos and field-verification
 * cautions. The platform never accuses a manufacturer; it simply records
 * traceability evidence and surfaces documentation-mismatch risk.
 */

interface VerifyStep {
  id: string;
  title: string;
  detail: string;
  weight: number;
  state: 'pass' | 'fail' | 'unknown';
}

interface BrandProfile {
  id: string;
  brand: string;
  category: 'inverter' | 'battery' | 'panel' | 'ups';
  portal: string;
  baseSteps: Omit<VerifyStep, 'state'>[];
  redFlags: string[];
  /** Platform-internal field-verification risk score (0–100). Reflects how
   *  often documentation/serial mismatches are observed in field samples,
   *  NOT a claim against the manufacturer. */
  verificationRiskPct: number;
}

const BRANDS: BrandProfile[] = [
  {
    id: 'pylontech',
    brand: 'Pylontech (battery)',
    category: 'battery',
    portal: 'https://en.pylontech.com.cn/  ·  serial via authorised partner',
    verificationRiskPct: 18,
    baseSteps: [
      { id: 'serial',  title: 'Serial number reads on the BMS comms portal', detail: 'Connect to the LCD; serial must match the carton label and the partner export record.', weight: 30 },
      { id: 'bms',     title: 'BMS handshake with inverter',                 detail: 'Pylontech-protocol negotiation succeeds; SOC and current display in real time.',          weight: 25 },
      { id: 'seal',    title: 'Pylontech tamper-seal intact',                detail: 'Holographic sticker on the side, no peel marks or scratches around the seal.',           weight: 15 },
      { id: 'weight',  title: 'Module weight matches datasheet',             detail: 'US3000C ≈ 32 kg. ±10 % is acceptable; ±20 % means cells substituted.',                  weight: 15 },
      { id: 'invoice', title: 'Invoice from authorised partner',             detail: 'Authorised partner list is published on the Pylontech regional site.',                   weight: 15 },
    ],
    redFlags: [
      'Loose modules shipped without the original manufacturer carton',
      '"OEM" or "factory grade" cells priced 40 % below partner MOQ',
      'BMS UI does not match the documented Pylontech interface',
    ],
  },
  {
    id: 'victron',
    brand: 'Victron Energy (inverter)',
    category: 'inverter',
    portal: 'https://www.victronenergy.com  ·  VE.Bus serial + Victron Connect',
    verificationRiskPct: 8,
    baseSteps: [
      { id: 'serial',  title: 'Serial registered on Victron portal',          detail: 'Enter HQ-prefixed serial; must return matching model, build week and firmware family.', weight: 30 },
      { id: 'connect', title: 'Victron Connect handshake',                    detail: 'Bluetooth pairing succeeds; firmware update path appears.',                              weight: 25 },
      { id: 'label',   title: 'Type-label QR scan',                            detail: 'QR resolves to victronenergy.com with model + serial.',                                  weight: 15 },
      { id: 'box',     title: 'Original Victron carton + manuals',             detail: 'Multilingual quick-start, EU declaration of conformity included.',                       weight: 15 },
      { id: 'invoice', title: 'Invoice from listed Victron partner',          detail: 'Victron publishes the partner list per country.',                                        weight: 15 },
    ],
    redFlags: [
      'No QR or QR resolves to a third-party storefront',
      'Carton resealed with non-Victron tape',
      'Bluetooth firmware version older than 5 years',
    ],
  },
  {
    id: 'jinko',
    brand: 'Jinko Solar (panel)',
    category: 'panel',
    portal: 'https://www.jinkosolar.com  ·  module serial verifier',
    verificationRiskPct: 22,
    baseSteps: [
      { id: 'serial',  title: 'Module serial verifies on Jinko portal',       detail: 'Serial is laser-etched on the frame and printed on the back-sheet sticker; both must match.', weight: 30 },
      { id: 'flash',   title: 'Flash test report supplied',                    detail: 'Per-pallet flash report: Pmax, Voc, Isc, FF for each module.',                            weight: 25 },
      { id: 'iec',     title: 'IEC 61215 + 61730 certification on label',     detail: 'Certifier name (TÜV / Intertek) and certificate number must appear.',                     weight: 20 },
      { id: 'pallet',  title: 'Original pallet + Jinko strapping',             detail: 'Re-strapped pallets often hide cosmetic-reject "B-grade" modules.',                       weight: 15 },
      { id: 'invoice', title: 'Invoice from authorised distributor',          detail: 'Authorised distributor list at jinkosolar.com.',                                          weight: 10 },
    ],
    redFlags: [
      'Power class differs from the datasheet by more than 3 %',
      'Visible micro-cracks under EL imaging',
      'Frame paint chipped at corners — handled too many times',
    ],
  },
  {
    id: 'eaton',
    brand: 'Eaton (UPS)',
    category: 'ups',
    portal: 'https://www.eaton.com  ·  serial verifier + partner finder',
    verificationRiskPct: 6,
    baseSteps: [
      { id: 'serial',  title: 'Serial registered on Eaton portal',            detail: 'Enter the serial; must return matching model + warranty start date.',                    weight: 30 },
      { id: 'firmware',title: 'Firmware splash matches Eaton family',         detail: 'Boot screen shows Eaton logo + firmware build with valid checksum.',                    weight: 20 },
      { id: 'sticker', title: 'Authorised partner sticker',                   detail: 'Holographic sticker on the rear panel; partner name visible.',                          weight: 15 },
      { id: 'battery', title: 'Original Eaton battery cartridge',             detail: 'EBM model number printed; not a generic AGM block.',                                    weight: 20 },
      { id: 'invoice', title: 'Invoice from listed Eaton partner',            detail: 'Eaton partner finder lists distributors per country.',                                  weight: 15 },
    ],
    redFlags: [
      'Battery cartridge weight differs from spec',
      'No Eaton sticker on rear panel',
      'Firmware version >5 y old or refuses to update',
    ],
  },
];

export default function AuthenticityClient() {
  const [brandId, setBrandId] = React.useState<string>(BRANDS[0].id);
  const brand = BRANDS.find((b) => b.id === brandId)!;
  const [steps, setSteps] = React.useState<VerifyStep[]>(
    brand.baseSteps.map((s) => ({ ...s, state: 'unknown' })),
  );

  React.useEffect(() => {
    setSteps(brand.baseSteps.map((s) => ({ ...s, state: 'unknown' })));
  }, [brandId, brand.baseSteps]);

  const total = brand.baseSteps.reduce((a, s) => a + s.weight, 0);
  const passed = steps.filter((s) => s.state === 'pass').reduce((a, s) => a + s.weight, 0);
  const failed = steps.filter((s) => s.state === 'fail').reduce((a, s) => a + s.weight, 0);
  const score = Math.max(0, Math.round((passed - failed * 0.5) * 100 / total));
  const scoreStatus: StatusKey = score >= 85 ? 'success' : score >= 60 ? 'warning' : 'danger';

  return (
    <div className="space-y-6">
      <Card>
        <SectionHeading
          eyebrow="Step 1"
          title="Pick the brand you want to verify"
          caption={`${BRANDS.length} reference profiles. Each one has a manufacturer serial portal and a weighted authenticity checklist.`}
        />
        <div className="flex flex-wrap gap-2">
          {BRANDS.map((b) => {
            const on = b.id === brandId;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setBrandId(b.id)}
                className="rounded-md border px-3 py-2 text-left text-xs"
                style={{
                  borderColor: on ? 'var(--color-brand-blue)' : 'var(--color-border-subtle)',
                  background: on ? 'var(--color-brand-blue)' : 'var(--color-surface-base)',
                  color: on ? '#fff' : 'var(--color-text-primary)',
                  minWidth: 220,
                }}
              >
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] opacity-80">{b.category}</div>
                <div className="mt-0.5 text-sm font-semibold tracking-tight">{b.brand}</div>
                <div className="mt-1 text-[11px] opacity-90">Verification risk: {b.verificationRiskPct} % (sample)</div>
              </button>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <SectionHeading
            eyebrow="Step 2"
            title="Verification checklist"
            caption="Tick each item only after physically observing or successfully testing it."
          />
          <ul className="space-y-2">
            {steps.map((s, i) => {
              const p = statusPalette(s.state === 'pass' ? 'success' : s.state === 'fail' ? 'danger' : 'info');
              return (
                <li key={s.id} className="rounded-md border p-3"
                    style={{ borderColor: p.border, background: s.state === 'unknown' ? 'transparent' : p.bg }}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold" style={{ color: s.state === 'unknown' ? undefined : p.fg }}>
                        {s.title}
                      </div>
                      <div className="mt-0.5 text-xs text-ink-secondary">{s.detail}</div>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      {(['pass', 'fail', 'unknown'] as const).map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() =>
                            setSteps((prev) => prev.map((x, j) => (j === i ? { ...x, state: opt } : x)))
                          }
                          className="rounded-md border px-2 py-1 text-[11px] font-semibold uppercase tracking-wider"
                          style={{
                            borderColor: s.state === opt ? statusPalette(opt === 'pass' ? 'success' : opt === 'fail' ? 'danger' : 'info').solid : 'var(--color-border-subtle)',
                            background: s.state === opt ? statusPalette(opt === 'pass' ? 'success' : opt === 'fail' ? 'danger' : 'info').solid : 'transparent',
                            color: s.state === opt ? '#fff' : 'var(--color-text-secondary)',
                          }}
                        >
                          {opt === 'unknown' ? '—' : opt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-1 text-[11px] text-ink-muted">Weight: {s.weight}</div>
                </li>
              );
            })}
          </ul>
        </Card>

        <div className="space-y-4">
          <Card>
            <SectionHeading eyebrow="Score" title="Authenticity confidence" />
            <KPICard label="Confidence" value={score} unit="/100" status={scoreStatus} decimals={0} />
            <p className="mt-3 text-xs text-ink-secondary">
              {score >= 85 && 'High confidence — record the serial and keep the invoice.'}
              {score < 85 && score >= 60 && 'Mixed signals — chase the missing items before accepting delivery.'}
              {score < 60 && 'Reject the unit and request a different sample. Do not commission.'}
            </p>
            <div className="mt-3 space-y-2">
              <StatusBar
                label="Items verified"
                value={steps.filter((s) => s.state === 'pass').length}
                max={steps.length}
                unit="items"
                thresholds={{ danger: 1, warning: steps.length * 0.6, success: steps.length }}
              />
              <StatusBar
                label="Items failed"
                value={steps.filter((s) => s.state === 'fail').length}
                max={steps.length}
                unit="items"
                thresholds={{ danger: 1, warning: 0.5, success: 0, invert: true }}
              />
            </div>
          </Card>

          <Card>
            <div className="mb-2 flex items-center justify-between">
              <SectionHeading eyebrow="Portal" title="Manufacturer reference" />
              <SampleBadge />
            </div>
            <p className="font-mono text-xs text-ink-secondary break-all">{brand.portal}</p>
          </Card>

          <Card>
            <SectionHeading eyebrow="Watch out" title="Field verification cautions" />
            <ul className="space-y-1 text-sm text-ink-secondary">
              {brand.redFlags.map((rf) => (
                <li key={rf} className="flex items-start gap-2">
                  <span aria-hidden className="mt-1 inline-block h-1.5 w-1.5 rounded-full" style={{ background: statusPalette('danger').solid }} />
                  {rf}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <Card>
        <SectionHeading eyebrow="Use this with" title="Connected workflow" />
        <p className="text-sm text-ink-secondary">
          Cross-check brand specs in{' '}
          <Link href="/hub/product-intelligence" className="text-ink-link">Product Intelligence</Link>, run the proposal through{' '}
          <Link href="/hub/verifier" className="text-ink-link">Combination Verifier</Link>, and audit pricing in{' '}
          <Link href="/hub/quote-audit" className="text-ink-link">Quotation Audit</Link>.
        </p>
      </Card>

      <HubConnectStrip active="/hub/authenticity" />
    </div>
  );
}
