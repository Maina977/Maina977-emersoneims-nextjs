'use client';

import * as React from 'react';
import { StatusLight } from './StatusLight';

export interface AlarmSignal {
  id: string;
  label: string;
  detail?: string;
  severity: 'warn' | 'fault';
}

/**
 * Cockpit alarm controller.
 *
 * Behaviour:
 *  - Renders a status light + alarm count + arm/silence toggle.
 *  - Plays a short, restrained beep ONLY on transitions into a new fault state
 *    AFTER the user has explicitly armed the alarm system (browser audio
 *    autoplay policy compliance).
 *  - "Silence" mutes the audible signal but keeps the visual indicator on.
 *  - No looping sound, no aggressive sound design — single 90 ms blip per
 *    transition for `warn`, two-blip 150 ms pattern for `fault`.
 *
 * Trust contract: this is a UX cue, not a safety annunciator. Sample data
 * conditions count as alarms (already labelled by SampleBadge upstream).
 */
export function AlarmController({ signals }: { signals: readonly AlarmSignal[] }) {
  const [armed, setArmed] = React.useState(false);
  const [silenced, setSilenced] = React.useState(false);
  const ctxRef = React.useRef<AudioContext | null>(null);
  const prevIdsRef = React.useRef<string>('');

  // Highest severity present
  const fault = signals.some((s) => s.severity === 'fault');
  const warn = signals.some((s) => s.severity === 'warn');
  const lampState: 'ok' | 'warn' | 'fault' = fault ? 'fault' : warn ? 'warn' : 'ok';

  // Beep on transitions
  React.useEffect(() => {
    if (!armed || silenced) {
      prevIdsRef.current = signals.map((s) => s.id).sort().join('|');
      return;
    }
    const currentKey = signals.map((s) => s.id).sort().join('|');
    if (currentKey === prevIdsRef.current) return;
    const newOnes = signals.filter(
      (s) => !prevIdsRef.current.split('|').includes(s.id),
    );
    prevIdsRef.current = currentKey;
    if (newOnes.length === 0) return;

    try {
      if (!ctxRef.current) {
        const Ctor =
          (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext })
            .AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return;
        ctxRef.current = new Ctor();
      }
      const ctx = ctxRef.current;
      if (!ctx) return;
      const sevHigh = newOnes.some((n) => n.severity === 'fault');
      const beep = (when: number, freq: number, dur: number, gain = 0.04) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        g.gain.setValueAtTime(0, when);
        g.gain.linearRampToValueAtTime(gain, when + 0.01);
        g.gain.linearRampToValueAtTime(0, when + dur);
        osc.connect(g).connect(ctx.destination);
        osc.start(when);
        osc.stop(when + dur + 0.02);
      };
      const t0 = ctx.currentTime + 0.01;
      if (sevHigh) {
        beep(t0, 880, 0.09);
        beep(t0 + 0.12, 660, 0.09);
      } else {
        beep(t0, 720, 0.09, 0.03);
      }
    } catch {
      // audio errors are non-fatal — ignore
    }
  }, [signals, armed, silenced]);

  // Resume audio context on user gesture (arm)
  const arm = async () => {
    setArmed(true);
    setSilenced(false);
    try {
      if (!ctxRef.current) {
        const Ctor =
          (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext })
            .AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (Ctor) ctxRef.current = new Ctor();
      }
      if (ctxRef.current && ctxRef.current.state === 'suspended') {
        await ctxRef.current.resume();
      }
    } catch {
      /* ignore */
    }
  };

  const count = signals.length;

  return (
    <div
      className="flex items-center gap-3 rounded-md border px-3 py-2"
      style={{
        borderColor: 'var(--cockpit-rail)',
        background: 'var(--cockpit-panel-raised)',
      }}
    >
      <StatusLight
        state={lampState}
        label={count === 0 ? 'No alarms' : `${count} alarm${count === 1 ? '' : 's'}`}
        description={fault ? 'Fault present' : warn ? 'Caution present' : 'All systems nominal'}
        pulse={fault && armed && !silenced}
        size="sm"
      />
      <div className="ml-auto flex items-center gap-1.5">
        {!armed ? (
          <button
            type="button"
            onClick={arm}
            className="rounded-sm border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors"
            style={{
              borderColor: 'var(--cockpit-edge)',
              color: 'var(--cockpit-ink)',
              background: 'transparent',
            }}
            title="Arm audible alarm — required by browser before sound can play"
          >
            Arm alarm
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setSilenced((s) => !s)}
              className="rounded-sm border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors"
              style={{
                borderColor: silenced ? 'var(--lamp-warn)' : 'var(--cockpit-edge)',
                color: silenced ? 'var(--lamp-warn)' : 'var(--cockpit-ink)',
                background: 'transparent',
              }}
              title={silenced ? 'Restore audible alarm' : 'Silence alarm'}
            >
              {silenced ? 'Silenced' : 'Silence'}
            </button>
            <button
              type="button"
              onClick={() => setArmed(false)}
              className="rounded-sm border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors"
              style={{ borderColor: 'var(--cockpit-edge)', color: 'var(--cockpit-ink-muted)' }}
              title="Disarm alarm system"
            >
              Disarm
            </button>
          </>
        )}
      </div>
    </div>
  );
}
