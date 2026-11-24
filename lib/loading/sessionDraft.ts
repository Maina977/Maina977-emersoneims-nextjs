/**
 * SESSION DRAFTS (management priority 1, 2026-11-21): the in-progress values of
 * a form survive a reload — including the recovery "Reload page" — without
 * being kept beyond the browser session.
 *
 *  - sessionStorage only: the browser clears it when the tab or window closes;
 *  - only the values the user typed into that form's fields are stored, under
 *    `eims-draft:<form>`; nothing else is collected;
 *  - every access is guarded: private mode, blocked site data or a full quota
 *    simply mean nothing is restored, and the form works as before;
 *  - a stored value is used only when it has the same type as the default, so
 *    a stale or edited entry cannot put a wrong type into a calculation.
 *
 * For client-only components (loaded with ssr:false / resilient()), so the
 * stored values can be read in the first render without a hydration mismatch.
 */

import { useCallback, useState, type SetStateAction } from 'react';

export const DRAFT_PREFIX = 'eims-draft:';

function store(): Storage | null {
  try { return typeof window === 'undefined' ? null : window.sessionStorage; } catch { return null; }
}

/** The saved draft for `form`, merged field by field over `defaults` (same type only). */
export function readSessionDraft<T extends Record<string, unknown>>(form: string, defaults: T): T {
  try {
    const raw = store()?.getItem(DRAFT_PREFIX + form);
    if (!raw) return defaults;
    const saved = JSON.parse(raw) as Record<string, unknown>;
    if (!saved || typeof saved !== 'object') return defaults;
    const out: Record<string, unknown> = { ...defaults };
    for (const k of Object.keys(defaults)) {
      const v = saved[k];
      if (v !== undefined && typeof v === typeof defaults[k] && (typeof v !== 'number' || Number.isFinite(v))) out[k] = v;
    }
    return out as T;
  } catch { return defaults; }
}

export function writeSessionDraft(form: string, values: Record<string, unknown>): void {
  try { store()?.setItem(DRAFT_PREFIX + form, JSON.stringify(values)); } catch { /* full or blocked: not kept */ }
}

export function clearSessionDraft(form: string): void {
  try { store()?.removeItem(DRAFT_PREFIX + form); } catch { /* blocked */ }
}

/**
 * useState for one form's fields, kept in sessionStorage on every change
 * (written synchronously, so a reload right after typing keeps the value).
 */
export function useSessionDraft<T extends Record<string, unknown>>(form: string, defaults: T) {
  const [values, setValues] = useState<T>(() => readSessionDraft(form, defaults));
  const set = useCallback(<K extends keyof T>(key: K, v: SetStateAction<T[K]>) => {
    setValues((prev) => {
      const nextV = typeof v === 'function' ? (v as (p: T[K]) => T[K])(prev[key]) : v;
      const next = { ...prev, [key]: nextV };
      writeSessionDraft(form, next);
      return next;
    });
  }, [form]);
  return [values, set] as const;
}
