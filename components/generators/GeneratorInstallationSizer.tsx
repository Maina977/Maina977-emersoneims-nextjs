'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// GeneratorInstallationSizer — "AutoSmart" intelligent installation sizing.
// From the generator rating it computes: full-load current, copper cable size
// (ampacity + volt-drop checked), main breaker (MCCB), ATS/changeover rating,
// earth (PE) conductor, external fuel tank for a target autonomy, exhaust pipe
// diameter, and generator cage + concrete plinth dimensions — plus a power-factor
// note. Engineering tables are indicative (confirm with a full site design); the
// output pre-fills a WhatsApp quote so every use is a potential lead.
// ═══════════════════════════════════════════════════════════════════════════════

import { useMemo, useState } from 'react';

// Copper conductor ampacity (A) — indicative, 4-core XLPE ~30°C in air/conduit.
const CABLE: { mm2: number; amp: number; mvAmPerM: number }[] = [
  { mm2: 2.5, amp: 25, mvAmPerM: 18 },
  { mm2: 4, amp: 34, mvAmPerM: 11 },
  { mm2: 6, amp: 43, mvAmPerM: 7.3 },
  { mm2: 10, amp: 60, mvAmPerM: 4.4 },
  { mm2: 16, amp: 80, mvAmPerM: 2.8 },
  { mm2: 25, amp: 101, mvAmPerM: 1.75 },
  { mm2: 35, amp: 126, mvAmPerM: 1.25 },
  { mm2: 50, amp: 153, mvAmPerM: 0.93 },
  { mm2: 70, amp: 196, mvAmPerM: 0.63 },
  { mm2: 95, amp: 238, mvAmPerM: 0.46 },
  { mm2: 120, amp: 276, mvAmPerM: 0.36 },
  { mm2: 150, amp: 319, mvAmPerM: 0.30 },
  { mm2: 185, amp: 364, mvAmPerM: 0.24 },
  { mm2: 240, amp: 430, mvAmPerM: 0.195 },
  { mm2: 300, amp: 497, mvAmPerM: 0.155 },
];
const BREAKERS = [16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500];
const nextStd = (v: number) => BREAKERS.find((b) => b >= v) ?? BREAKERS[BREAKERS.length - 1];

function peSize(phase: number): number {
  if (phase <= 16) return phase;
  if (phase <= 35) return 16;
  return Math.ceil(phase / 2);
}
function exhaustDia(kw: number): string {
  if (kw < 30) return '50–65 mm (2–2.5")';
  if (kw < 80) return '75–100 mm (3–4")';
  if (kw < 200) return '100–125 mm (4–5")';
  if (kw < 400) return '125–150 mm (5–6")';
  if (kw < 700) return '150–200 mm (6–8")';
  return '200–250 mm (8–10")';
}
function plinth(kva: number): { footprint: string; plinth: string } {
  if (kva <= 50) return { footprint: '~2.0 × 1.0 m canopy', plinth: '2.4 × 1.4 m × 150 mm, reinforced' };
  if (kva <= 150) return { footprint: '~2.8 × 1.1 m canopy', plinth: '3.2 × 1.6 m × 200 mm, reinforced' };
  if (kva <= 400) return { footprint: '~3.8 × 1.4 m canopy', plinth: '4.3 × 2.0 m × 250 mm, reinforced' };
  if (kva <= 800) return { footprint: '~5.0 × 1.8 m canopy', plinth: '5.6 × 2.4 m × 300 mm, reinforced' };
  return { footprint: '~6.5 × 2.2 m canopy', plinth: '7.2 × 2.8 m × 350 mm, reinforced' };
}

export default function GeneratorInstallationSizer() {
  const [kva, setKva] = useState(100);
  const [voltage, setVoltage] = useState(415);
  const [phase, setPhase] = useState<'3' | '1'>('3');
  const [pf, setPf] = useState(0.8);
  const [length, setLength] = useState(30);
  const [derate, setDerate] = useState(1.0);
  const [vdLimit, setVdLimit] = useState(2.5);
  const [autonomy, setAutonomy] = useState(12);

  const r = useMemo(() => {
    const v = phase === '3' ? voltage : 240;
    const kw = +(kva * pf).toFixed(1);
    const flc = phase === '3' ? (kva * 1000) / (Math.sqrt(3) * v) : (kva * 1000) / v;
    const designI = (flc * 1.25) / derate; // 125% + derating

    // pick cable: ampacity first, then volt-drop
    let chosen = CABLE[CABLE.length - 1];
    for (const c of CABLE) {
      if (c.amp >= designI) {
        const vd = (c.mvAmPerM * flc * length) / 1000;
        const vdPct = (vd / v) * 100;
        if (vdPct <= vdLimit) { chosen = c; break; }
      }
    }
    // if nothing met both, upsize for volt-drop from the ampacity-valid set
    if (!CABLE.some((c) => c.amp >= designI && (c.mvAmPerM * flc * length) / 1000 / v * 100 <= vdLimit)) {
      const ampOk = CABLE.filter((c) => c.amp >= designI);
      chosen = ampOk.reduce((best, c) => {
        const vdPct = (c.mvAmPerM * flc * length) / 1000 / v * 100;
        return vdPct < ((best.mvAmPerM * flc * length) / 1000 / v * 100) ? c : best;
      }, ampOk[0] ?? CABLE[CABLE.length - 1]);
    }
    const vdPct = (chosen.mvAmPerM * flc * length) / 1000 / v * 100;

    const breaker = nextStd(flc * 1.25);
    const ats = nextStd(flc * 1.0);
    const pe = peSize(chosen.mm2);
    const lph = +(kw * 0.28).toFixed(1); // full-load fuel burn
    const tank = Math.ceil((lph * autonomy * 1.1) / 10) * 10;
    const pl = plinth(kva);

    return {
      v, kw, flc: +flc.toFixed(1), designI: +designI.toFixed(1),
      cable: chosen.mm2, cableAmp: chosen.amp, vdPct: +vdPct.toFixed(2),
      breaker, ats, pe, lph, tank, exhaust: exhaustDia(kw), ...pl,
    };
  }, [kva, voltage, phase, pf, length, derate, vdLimit, autonomy]);

  const waMsg = encodeURIComponent(
    `Hello EmersonEIMS, please quote a generator installation.\n` +
    `Set: ${kva} kVA (${r.kw} kW), ${phase}-phase ${r.v}V, PF ${pf}\n` +
    `My AutoSmart sizing: FLC ${r.flc} A · Cable ${r.cable} mm² · Breaker ${r.breaker} A · ATS ${r.ats} A · Earth ${r.pe} mm² · Fuel tank ${r.tank} L (${autonomy} h) · Exhaust ${r.exhaust}\n` +
    `Cable run ${length} m. Please confirm and quote installation + changeover.`
  );

  const field = 'w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-white focus:border-green-500/60 focus:outline-none';
  const Row = ({ label, value, hint }: { label: string; value: string; hint?: string }) => (
    <div className="flex items-baseline justify-between gap-4 py-2.5 border-b border-white/8">
      <span className="text-sm text-white/60">{label}</span>
      <span className="text-right"><span className="font-semibold text-green-300">{value}</span>{hint && <span className="block text-[11px] text-white/40">{hint}</span>}</span>
    </div>
  );

  return (
    <section id="installation-sizer" className="py-20 bg-gradient-to-b from-black via-slate-950 to-black border-t border-white/5">
      <div className="max-w-5xl mx-auto px-6">
        <header className="mb-10 text-center">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-green-400/90 mb-3">AutoSmart sizing</p>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-green-400 bg-clip-text text-transparent">
            Intelligent Generator Installation Sizer
          </h2>
          <p className="mt-4 text-white/65 max-w-2xl mx-auto">
            Enter your generator rating and we compute the cable, breaker, changeover (ATS), earthing, fuel tank, exhaust and
            plinth — to IEC practice. Indicative sizing to plan with; our engineers confirm the final design on site.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
            <h3 className="font-semibold text-white">Your generator</h3>
            <label className="block text-sm text-white/60">Rating (kVA)
              <input type="number" min={5} max={3000} value={kva} onChange={(e) => setKva(Math.max(1, +e.target.value || 0))} className={field} />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm text-white/60">Phase
                <select value={phase} onChange={(e) => setPhase(e.target.value as '3' | '1')} className={field}>
                  <option value="3">3-phase</option>
                  <option value="1">1-phase</option>
                </select>
              </label>
              <label className="block text-sm text-white/60">Voltage (V)
                <input type="number" value={voltage} onChange={(e) => setVoltage(+e.target.value || 415)} className={field} disabled={phase === '1'} />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm text-white/60">Power factor
                <input type="number" step={0.05} min={0.5} max={1} value={pf} onChange={(e) => setPf(Math.min(1, Math.max(0.5, +e.target.value || 0.8)))} className={field} />
              </label>
              <label className="block text-sm text-white/60">Cable run (m)
                <input type="number" min={1} value={length} onChange={(e) => setLength(Math.max(1, +e.target.value || 1))} className={field} />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm text-white/60">Install condition
                <select value={derate} onChange={(e) => setDerate(+e.target.value)} className={field}>
                  <option value={1.0}>Cool, ventilated (1.0)</option>
                  <option value={0.85}>Hot / grouped (0.85)</option>
                  <option value={0.75}>Buried / hot conduit (0.75)</option>
                </select>
              </label>
              <label className="block text-sm text-white/60">Autonomy (hours)
                <input type="number" min={1} value={autonomy} onChange={(e) => setAutonomy(Math.max(1, +e.target.value || 1))} className={field} />
              </label>
            </div>
            <label className="block text-sm text-white/60">Max volt-drop (%)
              <input type="number" step={0.5} min={1} max={5} value={vdLimit} onChange={(e) => setVdLimit(Math.min(5, Math.max(1, +e.target.value || 2.5)))} className={field} />
            </label>
          </div>

          {/* Results */}
          <div className="rounded-2xl border border-green-500/25 bg-white/[0.03] p-6">
            <h3 className="font-semibold text-white mb-2">Recommended installation</h3>
            <Row label="Real power" value={`${r.kw} kW`} />
            <Row label="Full-load current (FLC)" value={`${r.flc} A`} hint={`design ${r.designI} A @125% +derate`} />
            <Row label="Supply cable (copper)" value={`${r.cable} mm²`} hint={`ampacity ${r.cableAmp} A · volt-drop ${r.vdPct}% over ${length} m`} />
            <Row label="Main breaker (MCCB)" value={`${r.breaker} A`} />
            <Row label="Changeover / ATS rating" value={`${r.ats} A`} />
            <Row label="Earth (PE) conductor" value={`${r.pe} mm²`} />
            <Row label="External fuel tank" value={`${r.tank} L`} hint={`~${r.lph} L/h full load · ${autonomy} h + reserve`} />
            <Row label="Exhaust pipe" value={r.exhaust} />
            <Row label="Canopy footprint" value={r.footprint} />
            <Row label="Concrete plinth" value={r.plinth} />
            <a
              href={`https://wa.me/254768860665?text=${waMsg}`}
              target="_blank" rel="noopener noreferrer"
              className="mt-5 block w-full text-center py-3 bg-green-500 hover:bg-green-600 text-black font-bold rounded-xl transition-colors"
            >
              Send this sizing for a quote on WhatsApp →
            </a>
            <p className="mt-3 text-[11px] text-white/40 text-center">Indicative to IEC practice — final design confirmed on site by our engineers.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
