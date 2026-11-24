'use client';

/**
 * RESILIENT MODULE — the on-screen side of ./resilientImport.ts.
 *
 * `resilient(() => import('./Panel'), { name })` replaces `dynamic(...)` /
 * `React.lazy(...)` for an engineering module. It shows:
 *  - the loader while the code downloads;
 *  - after 12 s, "Still downloading … — the connection is slow or a download
 *    stalled." with a "Reload page" button (a stalled request never fails, so
 *    the automatic retry cannot start; a full reload fetches everything again).
 *    Before reloading, registered drafts are written (onBeforeRecoveryReload);
 *  - when 3 attempts failed, a message with a "Try again" button.
 * Behaviour and wording follow the Solar Genius Pro loader of 2026-11-21.
 */

import type { ComponentType, ReactNode } from 'react';
import { ToolLoadingState } from '@/components/tools/ToolAppShell';
import { createPreloader, recoveryReload, SLOW_NOTE_AFTER_MS, useResilientModule, type Preloader, type Wait } from './resilientImport';

export interface ResilientOptions {
  /** Shown in the loader and messages, e.g. "Solar Genius Pro". */
  name: string;
  /** 'page' (full-height tool) or 'panel' (a section inside a tool). Default 'page'. */
  variant?: 'page' | 'panel';
  /** What is downloading, for the slow note. Default "the workspace" (page) / "this panel" (panel). */
  subject?: string;
  /** Custom loader; default ToolLoadingState (page) or a compact line (panel). */
  loading?: () => ReactNode;
  /** Heading when every attempt failed. Default "<name> did not download." */
  failedTitle?: string;
  /** Text under the heading when every attempt failed. */
  failedBody?: string;
  /** Start the download as soon as the module is evaluated in the browser. */
  eager?: boolean;
  slowAfterMs?: number;
  attempts?: number;
  wait?: Wait;
}

const BTN = 'rounded bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300';
const DEFAULT_FAILED_BODY = 'This is usually a dropped or slow connection. Press Try again to download it again.';

export interface ResilientViewProps {
  options: ResilientOptions;
  slow: boolean;
  failed: boolean;
  retry: () => void;
}

/** Loader / slow note / failure message for a module that has not arrived. */
export function ResilientModuleView({ options, slow, failed, retry }: ResilientViewProps) {
  const panel = options.variant === 'panel';
  const subject = options.subject ?? (panel ? 'this panel' : 'the workspace');
  if (failed) {
    return (
      <div className={panel ? 'p-6 flex items-center justify-center' : 'min-h-[60dvh] flex items-center justify-center bg-gradient-to-b from-slate-950 to-black'} role="alert">
        <div className="text-center px-4 max-w-md">
          <p className="text-slate-100 text-base font-medium">{options.failedTitle ?? `${options.name} did not download.`}</p>
          <p className="text-slate-300 text-sm mt-2">{options.failedBody ?? DEFAULT_FAILED_BODY}</p>
          <button type="button" onClick={retry} className={`mt-4 ${BTN}`}>Try again</button>
        </div>
      </div>
    );
  }
  const loader = options.loading
    ? options.loading()
    : panel
      ? (
        <div role="status" aria-live="polite" className="flex items-center justify-center gap-3 p-6 text-sm text-slate-300">
          <span aria-hidden="true" className="w-5 h-5 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          <span>Loading {options.name}…</span>
        </div>
      )
      : <ToolLoadingState name={options.name} />;
  return (
    <div>
      {loader}
      {slow ? (
        <div role="status" className={panel ? 'pb-6 text-center text-sm text-slate-300 px-4' : '-mt-24 pb-24 text-center text-sm text-slate-300 px-4'}>
          <p>Still downloading {subject} — the connection is slow or a download stalled.</p>
          <button type="button" onClick={() => recoveryReload()} className={`mt-3 ${BTN}`}>Reload page</button>
        </div>
      ) : null}
    </div>
  );
}

type Loaded<P> = ComponentType<P> | { default: ComponentType<P> };

function toComponent<P>(m: Loaded<P>): ComponentType<P> {
  return (m && typeof m === 'object' && 'default' in m ? m.default : m) as ComponentType<P>;
}

export type ResilientComponent<P> = ComponentType<P> & { preload: Preloader<ComponentType<P>> };

/** A client component that downloads `load` with retry and shows the recovery UI until it arrives. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resilient<P extends Record<string, any> = Record<string, never>>(load: () => Promise<Loaded<P>>, options: ResilientOptions): ResilientComponent<P> {
  const preload = createPreloader(() => load().then(toComponent), { attempts: options.attempts, wait: options.wait });
  if (options.eager && typeof window !== 'undefined') preload().catch(() => { /* surfaced by the component */ });

  function ResilientModule(props: P) {
    const { value: C, slow, failed, retry } = useResilientModule(preload, options.slowAfterMs ?? SLOW_NOTE_AFTER_MS);
    if (C) return <C {...props} />;
    return <ResilientModuleView options={options} slow={slow} failed={failed} retry={retry} />;
  }
  ResilientModule.displayName = `Resilient(${options.name})`;
  ResilientModule.preload = preload;
  return ResilientModule as ResilientComponent<P>;
}
