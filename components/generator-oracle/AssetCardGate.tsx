'use client';

/**
 * AssetCardGate
 *
 * The mandatory pre-use form for every Generator Oracle AI surface.
 * Captures the five fields the rule engine and reasoning model require
 * before any diagnostic call is allowed: make, model, controller, serial,
 * firmware. The gate persists the captured card to localStorage so the
 * technician does not retype between Visual Diagnose and Expert Chat.
 *
 * The gate refuses to render its child until all five fields are present.
 * This is enforced again on the server by zod (`AssetCardSchema`).
 *
 * @copyright 2026 EmersonEIMS / Generator Oracle
 */

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export interface AssetCardValue {
  make: string;
  model: string;
  controller: string;
  serial: string;
  firmware: string;
}

const STORAGE_KEY = 'oracle.asset-card.v1';
const FIELDS: Array<{
  key: keyof AssetCardValue;
  label: string;
  placeholder: string;
}> = [
  { key: 'make', label: 'Engine make', placeholder: 'Cummins / Caterpillar / Perkins …' },
  { key: 'model', label: 'Engine / set model', placeholder: 'QSB6.7 / C9 / 1106D …' },
  { key: 'controller', label: 'Controller', placeholder: 'DSE7320 / ComAp IL-NT / SmartGen HGM6120 …' },
  { key: 'serial', label: 'Serial number', placeholder: 'visible plate / display' },
  { key: 'firmware', label: 'Firmware / cal version', placeholder: 'v3.4.2 / CPL2895 …' },
];

function loadCard(): AssetCardValue | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AssetCardValue>;
    if (
      parsed.make &&
      parsed.model &&
      parsed.controller &&
      parsed.serial &&
      parsed.firmware
    ) {
      return parsed as AssetCardValue;
    }
    return null;
  } catch {
    return null;
  }
}

function saveCard(card: AssetCardValue) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(card));
  } catch {
    /* quota / private mode — non-fatal */
  }
}

export interface AssetCardGateProps {
  children: (card: AssetCardValue, reset: () => void) => ReactNode;
  feature: string;
}

export default function AssetCardGate({ children, feature }: AssetCardGateProps) {
  const [draft, setDraft] = useState<AssetCardValue>({
    make: '',
    model: '',
    controller: '',
    serial: '',
    firmware: '',
  });
  const [committed, setCommitted] = useState<AssetCardValue | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = loadCard();
    if (stored) {
      setCommitted(stored);
      setDraft(stored);
    }
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  if (committed) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-shrink-0 px-4 py-2 bg-slate-900/40 border-b border-slate-700/40 text-xs text-slate-400 flex items-center justify-between">
          <span>
            <span className="text-slate-500">Asset card:</span>{' '}
            <span className="text-slate-200 font-medium">
              {committed.make} {committed.model}
            </span>{' '}
            • <span className="text-slate-300">{committed.controller}</span> •
            S/N <span className="text-slate-300">{committed.serial}</span> • FW{' '}
            <span className="text-slate-300">{committed.firmware}</span>
          </span>
          <button
            type="button"
            onClick={() => {
              setCommitted(null);
            }}
            className="text-amber-300 hover:text-amber-200 text-xs underline-offset-2 hover:underline"
          >
            Edit
          </button>
        </div>
        <div className="flex-1 min-h-0">
          {children(committed, () => setCommitted(null))}
        </div>
      </div>
    );
  }

  const allFilled = FIELDS.every((f) => draft[f.key].trim().length > 0);

  return (
    <div className="flex flex-col h-full items-center justify-center p-6">
      <div className="max-w-xl w-full bg-slate-900/60 border border-amber-500/40 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-amber-300 mb-1">
          Asset card required
        </h3>
        <p className="text-sm text-slate-300 mb-4">
          {feature} cannot run without the unit&apos;s identifying details.
          The deterministic rule engine uses these fields to refuse unsafe
          procedures and to ground retrieval against the correct controller.
          All five fields are mandatory.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!allFilled) return;
            const card: AssetCardValue = {
              make: draft.make.trim(),
              model: draft.model.trim(),
              controller: draft.controller.trim(),
              serial: draft.serial.trim(),
              firmware: draft.firmware.trim(),
            };
            saveCard(card);
            setCommitted(card);
          }}
          className="space-y-3"
        >
          {FIELDS.map((f) => (
            <div key={f.key}>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
                {f.label}
              </label>
              <input
                type="text"
                value={draft[f.key]}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, [f.key]: e.target.value }))
                }
                placeholder={f.placeholder}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500"
                required
                maxLength={64}
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={!allFilled}
            className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-colors ${
              allFilled
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            Continue to {feature}
          </button>
          <p className="text-[11px] text-slate-500 text-center">
            Stored on this device only (localStorage). Cleared via Edit.
          </p>
        </form>
      </div>
    </div>
  );
}
