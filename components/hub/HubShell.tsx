'use client';

import * as React from 'react';
import Link from 'next/link';

/**
 * Shared shell for the Solar & UPS Intelligence Hub. Every page under
 * `/hub` renders inside this layout so spacing, typography, and navigation
 * stay locked to the design tokens.
 *
 * Audience layer: the hub serves two audiences — clients (buyers) and
 * professionals (technicians/engineers). `HubAudienceProvider` is mounted
 * by the shell automatically; pages use `useHubAudience()` to gate
 * professional-only depth (controller fault codes, derate math, etc.) so
 * the same module is safe for buyers and useful for engineers.
 */

export type HubAudience = 'client' | 'pro';

interface HubAudienceContextValue {
  audience: HubAudience;
  setAudience: (a: HubAudience) => void;
}

const HubAudienceContext = React.createContext<HubAudienceContextValue>({
  audience: 'client',
  setAudience: () => {},
});

export function useHubAudience() {
  return React.useContext(HubAudienceContext);
}

const AUDIENCE_STORAGE_KEY = 'hub:audience';

function HubAudienceProvider({ children }: { children: React.ReactNode }) {
  const [audience, setAudienceState] = React.useState<HubAudience>('client');
  React.useEffect(() => {
    try {
      const v = window.localStorage.getItem(AUDIENCE_STORAGE_KEY);
      if (v === 'client' || v === 'pro') setAudienceState(v);
    } catch {
      /* ignore */
    }
  }, []);
  const setAudience = React.useCallback((a: HubAudience) => {
    setAudienceState(a);
    try {
      window.localStorage.setItem(AUDIENCE_STORAGE_KEY, a);
    } catch {
      /* ignore */
    }
  }, []);
  return (
    <HubAudienceContext.Provider value={{ audience, setAudience }}>
      {children}
    </HubAudienceContext.Provider>
  );
}

/**
 * Audience toggle pill — rendered in the hub header. Switches the whole
 * workspace between buyer-safe and professional-depth disclosure without
 * navigating away from the current tool.
 */
function AudienceToggle() {
  const { audience, setAudience } = useHubAudience();
  const Btn = ({ value, label, sub, hint }: { value: HubAudience; label: string; sub: string; hint: string }) => {
    const active = audience === value;
    return (
      <button
        type="button"
        onClick={() => setAudience(value)}
        aria-pressed={active}
        title={hint}
        className="group flex flex-col items-start px-3 py-1.5 text-left transition-all"
        style={{
          color: active ? '#ffffff' : 'rgba(230,237,247,0.62)',
          background: active
            ? 'linear-gradient(135deg, #0071e3 0%, #003a73 100%)'
            : 'transparent',
          boxShadow: active ? '0 6px 18px -8px rgba(0,113,227,0.65), inset 0 0 0 1px rgba(255,255,255,0.08)' : 'none',
        }}
      >
        <span className="text-[11px] font-bold uppercase tracking-[0.16em] leading-none">{label}</span>
        <span className="mt-0.5 text-[9.5px] font-medium tracking-wide leading-none opacity-80">{sub}</span>
      </button>
    );
  };
  return (
    <div className="flex items-center gap-2">
      <span className="hidden lg:inline text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--cockpit-ink-muted)]">Audience</span>
      <div
        role="group"
        aria-label="Audience mode — switches between buyer-safe wording and full engineering depth (fault codes, derate math, cockpit instruments)"
        className="inline-flex overflow-hidden rounded-lg"
        style={{ background: 'rgba(11,18,32,0.55)', boxShadow: 'inset 0 0 0 1px rgba(140,170,220,0.18)' }}
      >
        <Btn value="client" label="Buyer" sub="plain-language" hint="Buyer view — plain-language disclosures, no controller fault codes or derate math." />
        <Btn value="pro" label="Engineer" sub="full depth" hint="Engineer view — full fault codes, derate math, harmonics depth and cockpit instruments unlocked." />
      </div>
    </div>
  );
}

/**
 * Pro-only content wrapper. In `client` (Buyer) mode the children are
 * hidden and a calm note tells the buyer this is engineer-grade depth.
 * In `pro` (Engineer) mode the children render unchanged.
 */
export function ProOnly({
  children,
  note = 'Switch the header toggle to Engineer to unlock fault-codes, derate math and standards references.',
}: {
  children: React.ReactNode;
  note?: string;
}) {
  const { audience, setAudience } = useHubAudience();
  if (audience === 'pro') return <>{children}</>;
  return (
    <div
      className="flex items-start gap-3 rounded-lg border bg-surface-base px-4 py-3 text-[13px] text-ink-secondary"
      style={{
        borderColor: 'var(--color-border-subtle)',
        borderLeft: '3px solid var(--color-brand-gold-deep)',
      }}
    >
      <span
        aria-hidden
        className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold tracking-[0.1em] text-white shadow"
        style={{ background: 'linear-gradient(135deg, #c9a227 0%, #8a6a14 100%)' }}
      >
        ENG
      </span>
      <div className="flex-1">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Engineer-only section</div>
        <p className="mt-0.5">{note}</p>
      </div>
      <button
        type="button"
        onClick={() => setAudience('pro')}
        className="shrink-0 self-center rounded-md px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white shadow transition-transform hover:scale-[1.03]"
        style={{ background: 'linear-gradient(135deg, #0071e3 0%, #003a73 100%)' }}
      >
        Switch to Engineer
      </button>
    </div>
  );
}

export { HUB_TOOLS, type HubTool } from '@/components/hub/hub-tools';
import { HUB_TOOLS } from '@/components/hub/hub-tools';

export function HubShell(props: {
  active: string;
  title: string;
  caption?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <HubAudienceProvider>
      <HubShellInner {...props} />
    </HubAudienceProvider>
  );
}

function HubShellInner({
  active,
  title,
  caption,
  children,
  wide = false,
}: {
  active: string;
  title: string;
  caption?: string;
  children: React.ReactNode;
  /**
   * When true, the main content area uses a wider container (max-w-[1600px])
   * and tighter vertical padding so flagship tools (e.g. the simulator
   * cockpit) can claim the full screen instead of sitting inside a narrow
   * 7xl text-column. Header / footer remain at the standard width to keep
   * navigation chrome consistent across the module.
   */
  wide?: boolean;
}) {
  const mainWidth = wide ? 'max-w-[1600px]' : 'max-w-7xl';
  const mainPad = wide ? 'px-3 pt-3 pb-4 md:px-6 md:pt-4 md:pb-5' : 'px-4 py-6 md:py-8';
  const headerInnerWidth = wide ? 'max-w-[1600px]' : 'max-w-7xl';
  return (
    <div
      className="hub-shell min-h-screen text-ink-primary"
      style={{
        background:
          'radial-gradient(1200px 600px at 15% -10%, rgba(0,113,227,0.18), transparent 60%),' +
          ' radial-gradient(900px 500px at 95% -5%, rgba(201,162,39,0.10), transparent 55%),' +
          ' linear-gradient(180deg, #0b1220 0%, #0d1730 30%, #0a1428 100%)',
      }}
    >
      <header
        className="sticky top-0 z-sticky backdrop-blur-md"
        style={{
          background: 'linear-gradient(180deg, rgba(11,18,32,0.92) 0%, rgba(13,23,48,0.88) 100%)',
          borderBottom: '1px solid rgba(140,170,220,0.14)',
          boxShadow: '0 10px 30px -20px rgba(0,0,0,0.6)',
        }}
      >
        {/* Row 1: Product family identity + nav */}
        <div className={`mx-auto flex ${headerInnerWidth} items-center gap-3 px-4 md:px-8 py-2.5`}>
          <Link href="/hub" className="group flex items-center gap-3 shrink-0">
            <span
              aria-hidden
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[11px] font-bold tracking-tight text-white"
              style={{
                background: 'linear-gradient(135deg, #0071e3 0%, #003a73 100%)',
                boxShadow: '0 6px 16px -6px rgba(0,113,227,0.6), inset 0 0 0 1px rgba(255,255,255,0.10)',
              }}
            >SU</span>
            <span className="flex flex-col leading-none">
              <span className="text-[9px] font-semibold uppercase tracking-[0.22em]" style={{ color: 'var(--cockpit-ink-muted)' }}>Resources</span>
              <span className="mt-1 text-[15px] font-bold tracking-tight" style={{ color: 'var(--cockpit-ink)' }}>Solar &amp; UPS Intelligence Hub</span>
            </span>
          </Link>

          {/* Scrollable nav with edge fades — works at every breakpoint */}
          <div className="relative flex-1 min-w-0">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-6 z-10"
              style={{ background: 'linear-gradient(90deg, rgba(11,18,32,0.95) 0%, rgba(11,18,32,0) 100%)' }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-8 z-10"
              style={{ background: 'linear-gradient(270deg, rgba(11,18,32,0.95) 0%, rgba(11,18,32,0) 100%)' }}
            />
            <nav
              aria-label="Hub sections"
              className="hub-nav-scroll flex items-stretch gap-0 overflow-x-auto whitespace-nowrap px-2"
              style={{ scrollbarWidth: 'thin' }}
            >
              {HUB_TOOLS.filter(t => t.href !== '/hub').map(t => {
                const isActive = active === t.href;
                return (
                  <Link
                    key={t.href}
                    href={t.href}
                    aria-current={isActive ? 'page' : undefined}
                    className="relative flex items-center px-3 py-2 text-[13px] font-semibold transition-colors"
                    style={{
                      color: isActive ? '#ffffff' : 'rgba(230,237,247,0.62)',
                    }}
                  >
                    {t.short}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-2 -bottom-[2px] h-[2px] rounded-full transition-opacity"
                      style={{
                        opacity: isActive ? 1 : 0,
                        background: 'linear-gradient(90deg, #4cd2ee 0%, #c9a64a 100%)',
                      }}
                    />
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="shrink-0">
            <AudienceToggle />
          </div>
        </div>

        {/* Row 2: Breadcrumb + page title/caption, visually clear hierarchy */}
        <div className={`mx-auto ${headerInnerWidth} px-4 md:px-8 pb-3 pt-0`}>
          <Breadcrumbs active={active} />
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1 mt-1">
            <h1 className="text-[22px] font-bold tracking-tight md:text-[28px] leading-tight" style={{ color: '#ffffff', textShadow: '0 1px 0 rgba(0,0,0,0.35)' }}>
              {title}
            </h1>
            {caption ? (
              <p className="max-w-3xl text-[13px] md:text-[14px] leading-snug font-medium" style={{ color: 'rgba(230,237,247,0.78)' }}>
                {caption}
              </p>
            ) : null}
          </div>
        </div>

        {/* Accent stripe under header */}
        <div
          aria-hidden
          className="h-[2px] w-full"
          style={{ background: 'linear-gradient(90deg, #0071e3 0%, #4cd2ee 35%, #c9a64a 70%, transparent 100%)', opacity: 0.85 }}
        />
      </header>

      <main id="hub-main" className={`mx-auto ${mainWidth} overflow-x-clip ${mainPad}`}>
        {children}
      </main>

      <footer
        className="mt-8"
        style={{
          background: 'linear-gradient(180deg, rgba(11,18,32,0) 0%, rgba(11,18,32,0.6) 100%)',
          borderTop: '1px solid rgba(140,170,220,0.12)',
        }}
      >
        <div className={`mx-auto ${headerInnerWidth} px-4 md:px-8 py-3 flex items-center justify-end`}>
          <CompactGovernanceLine />
        </div>
      </footer>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  caption,
}: {
  eyebrow?: string;
  title: string;
  caption?: string;
}) {
  return (
    <header className="mb-4">
      {eyebrow ? (
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
          {eyebrow}
        </div>
      ) : null}
      <h2 className="text-xl font-semibold tracking-tight md:text-2xl">{title}</h2>
      {caption ? <p className="mt-1 text-sm text-ink-muted">{caption}</p> : null}
    </header>
  );
}

export function Card({
  children,
  className = '',
  tone = 'panel',
}: {
  children: React.ReactNode;
  className?: string;
  /**
   * `panel` — default. Light instrument panel that floats on the dark hub
   *   canvas with a subtle gradient border, soft shadow, and gold/blue
   *   accent rule on the top edge so it reads as part of the cockpit family.
   * `flush` — quieter card for nested groupings (no top accent, lighter shadow).
   */
  tone?: 'panel' | 'flush';
}) {
  if (tone === 'flush') {
    return (
      <div
        className={`rounded-lg border bg-surface-base p-4 ${className}`}
        style={{ borderColor: 'var(--color-border-subtle)' }}
      >
        {children}
      </div>
    );
  }
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-surface-base p-5 transition-all ${className}`}
      style={{
        boxShadow:
          '0 1px 0 0 rgba(255,255,255,0.6) inset,' +
          ' 0 0 0 1px rgba(15,30,60,0.06),' +
          ' 0 24px 50px -28px rgba(8,15,35,0.55),' +
          ' 0 8px 18px -14px rgba(8,15,35,0.35)',
      }}
    >
      {/* Top gradient accent — instrument-panel cue */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px]"
        style={{ background: 'linear-gradient(90deg, rgba(0,113,227,0.55) 0%, rgba(76,210,238,0.35) 40%, rgba(201,166,74,0.45) 80%, transparent 100%)' }}
      />
      {children}
    </div>
  );
}

export function SampleBadge({ label = 'Demo data' }: { label?: string } = {}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]"
      title="Demo data — replace with your own measurements / authoritative source."
      style={{
        background: 'rgba(201,166,74,0.10)',
        color: '#8a6a14',
        borderColor: 'rgba(201,166,74,0.45)',
      }}
    >
      <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: '#c9a64a', boxShadow: '0 0 6px rgba(201,166,74,0.7)' }} />
      {label}
    </span>
  );
}

/**
 * HubConnectStrip — premium cross-tool quick-link strip used at the bottom
 * of every hub module page so the workspace reads as one connected
 * engineering platform, not a folder of isolated mini-apps. Renders the
 * other hub tools as compact pills with a brand accent stripe matching the
 * landing-page flagship card.
 */
export function HubConnectStrip({
  active,
  title = 'Connected workspace',
  caption = 'Continue the engineering loop — sizing, audit, intelligence, diagnostics, solar/UPS, library.',
}: {
  active: string;
  title?: string;
  caption?: string;
}) {
  const others = HUB_TOOLS.filter((t) => t.href !== active && t.href !== '/hub');
  return (
    <section
      aria-label="Connected workspace"
      className="relative mt-8 overflow-hidden rounded-2xl p-5 md:p-6"
      style={{
        background: 'linear-gradient(180deg, rgba(17,25,44,0.94) 0%, rgba(13,23,48,0.94) 100%)',
        boxShadow: '0 30px 60px -30px rgba(0,0,0,0.65), inset 0 0 0 1px rgba(140,170,220,0.14)',
      }}
    >
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{ background: 'linear-gradient(180deg, #0071e3 0%, #4cd2ee 50%, #c9a64a 100%)' }}
      />
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--cockpit-ink-muted)' }}>
            One platform · {others.length + 1} tools
          </div>
          <h3 className="mt-0.5 text-base font-semibold tracking-tight md:text-lg" style={{ color: 'var(--cockpit-ink)' }}>
            {title}
          </h3>
        </div>
        <p className="max-w-2xl text-xs md:text-[13px]" style={{ color: 'rgba(230,237,247,0.7)' }}>{caption}</p>
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
        {others.map((t) => (
          <li key={t.href}>
            <Link
              href={t.href}
              className="group flex h-full flex-col rounded-lg px-3 py-2.5 transition-all hover:-translate-y-[1px] focus:outline-none"
              style={{
                background: 'rgba(11,18,32,0.55)',
                boxShadow: 'inset 0 0 0 1px rgba(140,170,220,0.16)',
              }}
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--cockpit-ink-unit)' }}>
                {t.short}
              </span>
              <span className="mt-0.5 text-sm font-semibold tracking-tight" style={{ color: 'var(--cockpit-ink)' }}>
                {t.label}
              </span>
              <span className="mt-1 text-[11px] font-semibold tracking-wide" style={{ color: '#4cd2ee' }}>
                Open →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Governance metadata for the hub. Versioning, approval status, audit-trail
 * pointer and rollback note are surfaced on every page so reviewers can
 * trace what is deployed without leaving the workspace. Values below are
 * sourced from build-time constants and updated by the release process.
 */
export const HUB_GOVERNANCE = {
  version: 'v1.0.0-rc.1',
  approvalState: 'staging' as 'staging' | 'approved' | 'production',
  approver: 'pending engineering sign-off',
  auditTrail: '/docs/governance/hub-audit-trail.md',
  rollbackTarget: 'previous release tag · 1-step revert',
  lastReviewedISO: '2026-05-03',
} as const;

export function GovernanceStrip() {
  // Retained for any caller that still embeds the full strip in-page; the
  // hub footer itself now uses `CompactGovernanceLine` (a single quiet
  // typographic line) so the page does not end with a debug-style card.
  const g = HUB_GOVERNANCE;
  const stateChip =
    g.approvalState === 'production'
      ? 'status-chip--success'
      : g.approvalState === 'approved'
      ? 'status-chip--info'
      : 'status-chip--warning';
  return (
    <div
      className="overflow-hidden rounded-md border bg-surface-base px-3 py-2.5 shadow-sm"
      style={{
        borderColor: 'var(--color-border-subtle)',
        borderLeft: '3px solid var(--color-brand-gold-deep)',
      }}
      aria-label="Hub governance"
    >
      <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
        Governance
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[12px] text-ink-secondary">
        <span className="inline-flex items-center gap-1.5">
          <span className="text-ink-muted">Version</span>
          <span className="font-mono text-ink-primary">{g.version}</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="text-ink-muted">Approval</span>
          <span className={`status-chip ${stateChip}`}>{g.approvalState}</span>
          <span className="text-ink-muted">· {g.approver}</span>
        </span>
        <span className="inline-flex min-w-0 max-w-full items-center gap-1.5">
          <span className="text-ink-muted">Audit trail</span>
          <Link
            href={g.auditTrail}
            className="block min-w-0 truncate font-mono text-ink-link hover:underline"
            title={g.auditTrail}
          >
            {g.auditTrail}
          </Link>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="text-ink-muted">Rollback</span>
          <span>{g.rollbackTarget}</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="text-ink-muted">Last reviewed</span>
          <span className="font-mono">{g.lastReviewedISO}</span>
        </span>
      </div>
    </div>
  );
}

/**
 * Quiet single-line governance bar used inside the hub footer. Replaces
 * the previous chunky governance card so /hub pages end with a calm
 * trust line instead of a debug-style block, while still surfacing
 * version, approval state, last-reviewed date, and the audit-trail link.
 */
export function CompactGovernanceLine() {
  const g = HUB_GOVERNANCE;
  const stateChip =
    g.approvalState === 'production'
      ? 'status-chip--success'
      : g.approvalState === 'approved'
      ? 'status-chip--info'
      : 'status-chip--warning';
  const Sep = () => (
    <span aria-hidden className="text-ink-muted/60">·</span>
  );
  return (
    <div
      className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]"
      style={{ color: 'rgba(230,237,247,0.55)' }}
      aria-label="Hub governance"
    >
      <span className="flex items-center gap-1.5">
        Sample values labelled <SampleBadge />
      </span>
      <Sep />
      <span>
        Hub <span className="font-mono" style={{ color: 'rgba(230,237,247,0.85)' }}>{g.version}</span>
      </span>
      <Sep />
      <span className={`status-chip ${stateChip}`}>{g.approvalState}</span>
      <Sep />
      <span>
        Reviewed <span className="font-mono">{g.lastReviewedISO}</span>
      </span>
      <Sep />
      <Link
        href={g.auditTrail}
        className="hover:underline underline-offset-2"
        style={{ color: '#4cd2ee' }}
      >
        Audit trail
      </Link>
    </div>
  );
}

/**
 * Breadcrumbs — locked to:
 *   Home / Resources / Solar & UPS Intelligence Hub / <Module>
 *
 * The module segment is derived from the active hub tool. The landing page
 * (`/hub`) renders only the first three segments.
 */
export function Breadcrumbs({ active }: { active: string }) {
  const moduleLabel =
    active === '/hub'
      ? null
      : HUB_TOOLS.find(t => t.href === active)?.label ?? null;

  const items: Array<{ label: string; href?: string }> = [
    { label: 'Home', href: '/' },
    { label: 'Resources', href: '/resources' },
    { label: 'Solar & UPS Intelligence Hub', href: moduleLabel ? '/hub' : undefined },
  ];
  if (moduleLabel) items.push({ label: moduleLabel });

  return (
    <nav aria-label="Breadcrumb" className="mb-1.5 text-[11px]" style={{ color: 'rgba(230,237,247,0.55)' }}>
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((it, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${it.label}-${i}`} className="flex items-center gap-1">
              {it.href && !isLast ? (
                <Link href={it.href} className="hover:underline" style={{ color: 'rgba(230,237,247,0.78)' }}>
                  {it.label}
                </Link>
              ) : (
                <span aria-current={isLast ? 'page' : undefined} style={isLast ? { color: '#ffffff' } : undefined}>
                  {it.label}
                </span>
              )}
              {!isLast ? <span aria-hidden>/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
