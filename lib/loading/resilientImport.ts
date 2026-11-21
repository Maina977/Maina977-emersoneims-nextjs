/**
 * RESILIENT LOADING of dynamically loaded engineering modules (management
 * priority 1, 2026-11-21). Generalised from the Solar Genius Pro workspace
 * loader (components/solar-modules/SolarGeniusProV2.tsx, 86e79b2e):
 *
 *  - importWithRetry: a failed download (ChunkLoadError, dropped connection)
 *    is tried 3 times in all, waiting 1 s then 2 s, then the error is passed on;
 *  - createPreloader: the download is started once and shared; after a failure
 *    the next call starts a fresh download (the "Try again" button);
 *  - useResilientModule: loading -> ready, with a "slow" flag after
 *    SLOW_NOTE_AFTER_MS (a stalled request never rejects, so only a full
 *    reload recovers it) and a "failed" flag with retry();
 *  - recoveryReload: the "Reload page" action. Modules that keep unsaved work
 *    register a flush with onBeforeRecoveryReload so it is written first.
 *
 * The UI for these states is in ./ResilientModule.tsx.
 */

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

export const SLOW_NOTE_AFTER_MS = 12_000;

const subscribeNever = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export type Wait = (ms: number) => Promise<void>;
const defaultWait: Wait = (ms) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * Runs `load` up to `attempts` times with back-off (1 s, 2 s, 4 s …); rethrows the last error.
 * `retryable` can pass an error straight on (e.g. an HTTP 400 that a retry cannot fix).
 */
export async function importWithRetry<T>(load: () => Promise<T>, attempts = 3, wait: Wait = defaultWait, retryable: (e: unknown) => boolean = () => true): Promise<T> {
  for (let i = 0; ; i++) {
    try { return await load(); }
    catch (e) {
      if (i >= attempts - 1 || !retryable(e)) throw e;
      await wait(1000 * 2 ** i); // 1 s, then 2 s
    }
  }
}

export interface Preloader<T> {
  /** Starts (once) the download; safe to call repeatedly. */
  (): Promise<T>;
  /** The loaded value, once the download has finished; otherwise undefined. */
  peek(): T | undefined;
}

/** Memoises a retried download. A failure clears the memo so a later call (Try again) downloads afresh. */
export function createPreloader<T>(load: () => Promise<T>, opts: { attempts?: number; wait?: Wait } = {}): Preloader<T> {
  let promise: Promise<T> | null = null;
  let done = false;
  let value: T | undefined;
  const preload = (() => {
    if (!promise) {
      promise = importWithRetry(load, opts.attempts ?? 3, opts.wait ?? defaultWait).then(
        (v) => { value = v; done = true; return v; },
        (e) => { promise = null; throw e; },
      );
    }
    return promise;
  }) as Preloader<T>;
  preload.peek = () => (done ? value : undefined);
  return preload;
}

export interface ResilientState<T> {
  value: T | null;
  /** True once SLOW_NOTE_AFTER_MS has passed without the module arriving. */
  slow: boolean;
  /** True after every attempt failed. */
  failed: boolean;
  /** Starts a new download (after `failed`). */
  retry: () => void;
}

/** Tracks one preloaded module through loading, slow, failed and ready. */
export function useResilientModule<T>(preload: Preloader<T>, slowAfterMs: number = SLOW_NOTE_AFTER_MS): ResilientState<T> {
  // Already downloaded (e.g. a panel opened a second time): render at once, no loader flash.
  // Not during hydration, though: the server rendered the loader, so the first
  // client render must match it (false from the server snapshot), then React re-renders.
  const canPeek = useSyncExternalStore(subscribeNever, clientSnapshot, serverSnapshot);
  const [loaded, setLoaded] = useState<T | null>(null);
  const [failed, setFailed] = useState(false);
  const [slow, setSlow] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const value = loaded ?? (canPeek ? preload.peek() ?? null : null);
  const isLoaded = value !== null;

  useEffect(() => {
    if (isLoaded) return;
    let live = true;
    setFailed(false); setSlow(false);
    const t = setTimeout(() => { if (live) setSlow(true); }, slowAfterMs);
    preload()
      .then((v) => { if (live) setLoaded(() => v); })
      .catch(() => { if (live) setFailed(true); })
      .finally(() => clearTimeout(t));
    return () => { live = false; clearTimeout(t); };
  }, [attempt, preload, slowAfterMs, isLoaded]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { value, slow, failed, retry };
}

// ---------------------------------------------------------------- recovery reload
type Flush = () => void;
const flushes = new Set<Flush>();

/** Registers a function that writes unsaved work before a recovery reload. Returns the unregister function. */
export function onBeforeRecoveryReload(flush: Flush): () => void {
  flushes.add(flush);
  return () => { flushes.delete(flush); };
}

/** The reload itself; replaceable in tests (jsdom cannot reload). */
export const pageReload = { run: (): void => { window.location.reload(); } };

/** Writes every registered draft, then reloads the page. One failing flush never blocks the others or the reload. */
export function recoveryReload(reload: () => void = pageReload.run): void {
  for (const f of Array.from(flushes)) {
    try { f(); } catch { /* storage full or blocked: the reload still goes ahead */ }
  }
  reload();
}
