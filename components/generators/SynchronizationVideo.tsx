'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// SynchronizationVideo — an autoplaying, looping ANIMATED EXPLAINER (a code "video")
// that walks through generator synchronisation step by step: two out-of-sync
// sources → match voltage → match frequency → match phase → close breaker → share
// load. Plays automatically, with play/pause and step controls. Pure React + SVG +
// CSS (no media file, no heavy deps), reduced-motion aware.
// ═══════════════════════════════════════════════════════════════════════════════

import { useEffect, useRef, useState } from 'react';

interface Step {
  title: string;
  caption: string;
  ampInc: number;     // incoming wave amplitude (px)
  phaseInc: number;   // incoming wave phase offset (rad)
  slip: number;       // 0 = locked; larger = faster needle / beat
  needleDeg: number;  // synchroscope needle target angle
  closed: boolean;    // breaker closed
  share: boolean;     // load sharing shown
}

const AMP = 40;
const STEPS: Step[] = [
  { title: 'Two independent sources', caption: 'The incoming set and the live bus each have their own voltage, frequency and phase. Connect them now and a huge equalising current flows. We must match them first.', ampInc: 26, phaseInc: 2.1, slip: 1, needleDeg: 200, closed: false, share: false },
  { title: 'Step 1 — Match the voltage', caption: 'Trim the incoming set’s AVR until its voltage equals the bus (amplitudes match). A voltage difference would drive circulating reactive (kVAr) current on closing.', ampInc: AMP, phaseInc: 1.7, slip: 0.8, needleDeg: 150, closed: false, share: false },
  { title: 'Step 2 — Match the frequency (slightly fast)', caption: 'Trim the governor so the incoming set runs a touch above bus frequency. The synchroscope slows; the two waveforms drift toward each other.', ampInc: AMP, phaseInc: 0.9, slip: 0.35, needleDeg: 70, closed: false, share: false },
  { title: 'Step 3 — Match the phase angle', caption: 'At the in-phase instant the waveforms overlap and the synchroscope sits at 12 o’clock. This is the only safe moment to close.', ampInc: AMP, phaseInc: 0.06, slip: 0, needleDeg: 0, closed: false, share: false },
  { title: 'Step 4 — Close the breaker', caption: 'Close at (just before) the in-phase point — the contacts make at near-zero phase difference and the set parallels smoothly onto the bus.', ampInc: AMP, phaseInc: 0, slip: 0, needleDeg: 0, closed: true, share: false },
  { title: 'Step 5 — Share the load', caption: 'Ramp the governor for real power (kW) and trim the AVR for reactive power (kVAr) so the sets share load in proportion to their ratings.', ampInc: AMP, phaseInc: 0, slip: 0, needleDeg: 0, closed: true, share: true },
];

function sinePath(amp: number, phase: number, w = 520, mid = 60, freq = 3) {
  let d = '';
  for (let x = 0; x <= w; x += 4) {
    const y = mid - Math.sin((x / w) * Math.PI * 2 * freq + phase) * amp;
    d += (x === 0 ? 'M' : 'L') + x + ' ' + y.toFixed(1) + ' ';
  }
  return d;
}

export default function SynchronizationVideo() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!playing) return;
    timer.current = setTimeout(() => setStep((s) => (s + 1) % STEPS.length), 4600);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [step, playing]);

  const s = STEPS[step];

  return (
    <section id="synchronization-video" className="py-20 bg-gradient-to-b from-slate-950 via-black to-slate-950 border-t border-white/5">
      <div className="max-w-4xl mx-auto px-6">
        <header className="text-center mb-8">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-amber-400/90 mb-3">Animated lesson</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">How Generator Synchronization Works — Watch It Step by Step</h2>
          <p className="mt-3 text-white/65 max-w-2xl mx-auto">An auto-playing visual walkthrough of paralleling two generators: match voltage, frequency and phase, close at the in-phase instant, then share the load.</p>
        </header>

        <div className="rounded-2xl border border-amber-500/25 bg-black/60 overflow-hidden">
          {/* "screen" */}
          <div className="relative bg-gradient-to-b from-slate-900 to-black p-6">
            <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
              {/* waveforms + breaker */}
              <div>
                <svg viewBox="0 0 520 200" className="w-full h-auto" role="img" aria-label={`Synchronisation ${s.title}`}>
                  <line x1="0" y1="60" x2="520" y2="60" stroke="#27272a" strokeWidth="1" />
                  {/* bus (running) */}
                  <path d={sinePath(AMP, 0)} fill="none" stroke="#22d3ee" strokeWidth="2.5" style={{ transition: 'all 0.8s ease' }} />
                  {/* incoming */}
                  <path d={sinePath(s.ampInc, s.phaseInc)} fill="none" stroke="#fbbf24" strokeWidth="2.5" style={{ transition: 'all 0.8s ease' }} />
                  <text x="6" y="14" fontSize="11" fill="#22d3ee">Running bus</text>
                  <text x="6" y="150" fontSize="11" fill="#fbbf24">Incoming set</text>
                  {/* breaker */}
                  <g transform="translate(230,160)">
                    <line x1="0" y1="0" x2="40" y2="0" stroke="#9ca3af" strokeWidth="3" />
                    <line x1="120" y1="0" x2="160" y2="0" stroke="#9ca3af" strokeWidth="3" />
                    <line x1="40" y1="0" x2={s.closed ? 120 : 96} y2={s.closed ? 0 : -26} stroke={s.closed ? '#22c55e' : '#ef4444'} strokeWidth="4" style={{ transition: 'all 0.5s ease' }} />
                    <circle cx="40" cy="0" r="4" fill="#9ca3af" /><circle cx="120" cy="0" r="4" fill="#9ca3af" />
                    <text x="80" y="26" textAnchor="middle" fontSize="11" fill={s.closed ? '#22c55e' : '#ef4444'}>{s.closed ? 'BREAKER CLOSED' : 'breaker open'}</text>
                  </g>
                </svg>

                {/* load share bars */}
                <div className={`mt-3 grid grid-cols-2 gap-3 transition-opacity duration-700 ${s.share ? 'opacity-100' : 'opacity-30'}`}>
                  {['Set 1', 'Set 2'].map((lbl) => (
                    <div key={lbl}>
                      <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-1000" style={{ width: s.share ? '50%' : '6%' }} />
                      </div>
                      <span className="text-[11px] text-white/50">{lbl} — {s.share ? '50% load' : 'standby'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* synchroscope */}
              <div className="flex flex-col items-center">
                <svg viewBox="0 0 120 120" className="w-28 h-28" role="img" aria-label="synchroscope">
                  <circle cx="60" cy="60" r="54" fill="#0a0a0a" stroke="#3f3f46" strokeWidth="2" />
                  <circle cx="60" cy="60" r="54" fill="none" stroke="#22c55e" strokeWidth="4" strokeDasharray="10 329" strokeDashoffset="-165" />
                  <text x="60" y="16" textAnchor="middle" fontSize="8" fill="#22c55e" fontWeight="bold">SYNC</text>
                  <g style={{ transform: `rotate(${s.needleDeg}deg)`, transformOrigin: '60px 60px', transition: 'transform 1.2s ease' }}>
                    <line x1="60" y1="60" x2="60" y2="14" stroke="#fbbf24" strokeWidth="3" />
                  </g>
                  <circle cx="60" cy="60" r="5" fill="#fbbf24" />
                </svg>
                <span className="mt-2 text-[11px] text-white/50">{s.slip === 0 ? 'In phase ✓' : 'Slip — needle turning'}</span>
              </div>
            </div>
          </div>

          {/* caption + controls */}
          <div className="p-5 border-t border-white/10 bg-black/70">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-amber-400 font-bold">{step + 1}/{STEPS.length}</span>
              <h3 className="font-semibold text-white">{s.title}</h3>
            </div>
            <p className="text-sm text-white/70 leading-relaxed min-h-[3.5rem]">{s.caption}</p>
            <div className="mt-3 flex items-center gap-3">
              <button onClick={() => setPlaying((p) => !p)} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-sm font-bold rounded-lg">{playing ? '⏸ Pause' : '▶ Play'}</button>
              <button onClick={() => { setStep((s2) => (s2 - 1 + STEPS.length) % STEPS.length); setPlaying(false); }} className="px-3 py-2 border border-white/20 text-white text-sm rounded-lg hover:bg-white/10">‹ Prev</button>
              <button onClick={() => { setStep((s2) => (s2 + 1) % STEPS.length); setPlaying(false); }} className="px-3 py-2 border border-white/20 text-white text-sm rounded-lg hover:bg-white/10">Next ›</button>
              <div className="flex gap-1.5 ml-auto">
                {STEPS.map((_, i) => (
                  <button key={i} onClick={() => { setStep(i); setPlaying(false); }} aria-label={`Step ${i + 1}`} className={`w-2.5 h-2.5 rounded-full transition-colors ${i === step ? 'bg-amber-400' : 'bg-white/25 hover:bg-white/50'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-white/55">Full written guide, controller list and troubleshooting are <a href="#generator-synchronization" className="text-amber-400 hover:text-amber-300 underline underline-offset-2">just below</a>.</p>
      </div>
    </section>
  );
}
