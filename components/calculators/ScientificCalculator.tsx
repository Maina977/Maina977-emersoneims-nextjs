'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// ScientificCalculator — a dependency-free scientific/engineering calculator with a
// live function grapher. Includes a SAFE expression evaluator (tokeniser →
// shunting-yard → RPN; NO eval/Function, CSP-safe), trig (deg/rad), logs, powers,
// roots, constants, and an inline SVG plot of f(x). Fast and light — delivers the
// math.js/chart.js capability without shipping pyodide/WASM to every visitor.
// ═══════════════════════════════════════════════════════════════════════════════

import { useMemo, useState } from 'react';

type Tok = { t: 'num' | 'op' | 'lp' | 'rp' | 'fn' | 'id' | 'comma'; v: string };

const FUNCS: Record<string, (...a: number[]) => number> = {
  sin: Math.sin, cos: Math.cos, tan: Math.tan,
  asin: Math.asin, acos: Math.acos, atan: Math.atan,
  sqrt: Math.sqrt, cbrt: Math.cbrt, ln: Math.log, log: (x) => Math.log10(x), log10: (x) => Math.log10(x),
  exp: Math.exp, abs: Math.abs, floor: Math.floor, ceil: Math.ceil, round: Math.round,
  pow: (a, b) => Math.pow(a, b), min: Math.min, max: Math.max,
};
const PREC: Record<string, number> = { '+': 2, '-': 2, '*': 3, '/': 3, '%': 3, '^': 4, 'u-': 5 };
const RIGHT = new Set(['^', 'u-']);

function tokenize(src: string): Tok[] {
  const out: Tok[] = [];
  let i = 0;
  const s = src.replace(/\s+/g, '');
  while (i < s.length) {
    const c = s[i];
    if (/[0-9.]/.test(c)) {
      let n = c; i++;
      while (i < s.length && /[0-9.eE]/.test(s[i])) {
        // allow scientific notation e.g. 1e3
        if ((s[i] === 'e' || s[i] === 'E') && !/[0-9]/.test(s[i + 1] ?? '') && s[i + 1] !== '-' && s[i + 1] !== '+') break;
        if ((s[i] === 'e' || s[i] === 'E') && (s[i + 1] === '-' || s[i + 1] === '+')) { n += s[i] + s[i + 1]; i += 2; continue; }
        n += s[i]; i++;
      }
      out.push({ t: 'num', v: n });
    } else if (/[a-zA-Z_]/.test(c)) {
      let id = c; i++;
      while (i < s.length && /[a-zA-Z0-9_]/.test(s[i])) { id += s[i]; i++; }
      if (FUNCS[id]) out.push({ t: 'fn', v: id });
      else out.push({ t: 'id', v: id });
    } else if ('+-*/%^'.includes(c)) {
      const prev = out[out.length - 1];
      const unary = c === '-' && (!prev || prev.t === 'op' || prev.t === 'lp' || prev.t === 'comma');
      out.push({ t: 'op', v: unary ? 'u-' : c }); i++;
    } else if (c === '(') { out.push({ t: 'lp', v: c }); i++; }
    else if (c === ')') { out.push({ t: 'rp', v: c }); i++; }
    else if (c === ',') { out.push({ t: 'comma', v: c }); i++; }
    else throw new Error('Bad character: ' + c);
  }
  return out;
}

function toRPN(toks: Tok[]): Tok[] {
  const out: Tok[] = []; const st: Tok[] = [];
  for (const tk of toks) {
    if (tk.t === 'num' || tk.t === 'id') out.push(tk);
    else if (tk.t === 'fn') st.push(tk);
    else if (tk.t === 'comma') { while (st.length && st[st.length - 1].t !== 'lp') out.push(st.pop()!); }
    else if (tk.t === 'op') {
      while (st.length) {
        const top = st[st.length - 1];
        if (top.t === 'op' && (PREC[top.v] > PREC[tk.v] || (PREC[top.v] === PREC[tk.v] && !RIGHT.has(tk.v)))) out.push(st.pop()!);
        else break;
      }
      st.push(tk);
    } else if (tk.t === 'lp') st.push(tk);
    else if (tk.t === 'rp') {
      while (st.length && st[st.length - 1].t !== 'lp') out.push(st.pop()!);
      if (!st.length) throw new Error('Mismatched )');
      st.pop();
      if (st.length && st[st.length - 1].t === 'fn') out.push(st.pop()!);
    }
  }
  while (st.length) { const t = st.pop()!; if (t.t === 'lp') throw new Error('Mismatched ('); out.push(t); }
  return out;
}

function evalRPN(rpn: Tok[], scope: Record<string, number>, deg: boolean): number {
  const st: number[] = [];
  for (const tk of rpn) {
    if (tk.t === 'num') st.push(parseFloat(tk.v));
    else if (tk.t === 'id') {
      const k = tk.v.toLowerCase();
      if (k === 'pi') st.push(Math.PI);
      else if (k === 'e') st.push(Math.E);
      else if (k in scope) st.push(scope[k]);
      else throw new Error('Unknown: ' + tk.v);
    } else if (tk.t === 'op') {
      if (tk.v === 'u-') { st.push(-st.pop()!); continue; }
      const b = st.pop()!, a = st.pop()!;
      st.push(tk.v === '+' ? a + b : tk.v === '-' ? a - b : tk.v === '*' ? a * b : tk.v === '/' ? a / b : tk.v === '%' ? a % b : Math.pow(a, b));
    } else if (tk.t === 'fn') {
      const f = FUNCS[tk.v];
      const arity = f.length || 1;
      const args: number[] = [];
      for (let k = 0; k < arity; k++) args.unshift(st.pop()!);
      let a0 = args[0];
      if (deg && ['sin', 'cos', 'tan'].includes(tk.v)) a0 = (a0 * Math.PI) / 180;
      const res = ['sin', 'cos', 'tan'].includes(tk.v) ? f(a0) : ['asin', 'acos', 'atan'].includes(tk.v) ? (deg ? (f(args[0]) * 180) / Math.PI : f(args[0])) : f(...args);
      st.push(res);
    }
  }
  if (st.length !== 1) throw new Error('Invalid expression');
  return st[0];
}

function compute(expr: string, scope: Record<string, number>, deg: boolean): number {
  return evalRPN(toRPN(tokenize(expr)), scope, deg);
}

export default function ScientificCalculator() {
  const [expr, setExpr] = useState('');
  const [deg, setDeg] = useState(true);
  const [fx, setFx] = useState('sin(x)');
  const [xmin, setXmin] = useState(-10);
  const [xmax, setXmax] = useState(10);

  const result = useMemo(() => {
    if (!expr.trim()) return '';
    try { const r = compute(expr, {}, deg); return Number.isFinite(r) ? String(+r.toPrecision(12)) : 'Math error'; }
    catch (e) { return 'Error: ' + (e as Error).message; }
  }, [expr, deg]);

  const plot = useMemo(() => {
    const W = 560, H = 260, n = 280;
    const pts: { x: number; y: number }[] = [];
    let ymin = Infinity, ymax = -Infinity;
    try {
      const rpn = toRPN(tokenize(fx));
      for (let i = 0; i <= n; i++) {
        const x = xmin + ((xmax - xmin) * i) / n;
        const y = evalRPN(rpn, { x }, deg);
        if (Number.isFinite(y)) { pts.push({ x, y }); if (y < ymin) ymin = y; if (y > ymax) ymax = y; }
      }
    } catch { return null; }
    if (!pts.length || !Number.isFinite(ymin) || !Number.isFinite(ymax)) return null;
    if (ymin === ymax) { ymin -= 1; ymax += 1; }
    const pad = (ymax - ymin) * 0.08; ymin -= pad; ymax += pad;
    const sx = (x: number) => 40 + ((x - xmin) / (xmax - xmin)) * (W - 56);
    const sy = (y: number) => 12 + (1 - (y - ymin) / (ymax - ymin)) * (H - 36);
    const d = pts.map((p, i) => (i === 0 ? 'M' : 'L') + sx(p.x).toFixed(1) + ' ' + sy(p.y).toFixed(1)).join(' ');
    const y0 = ymin <= 0 && ymax >= 0 ? sy(0) : null;
    const x0 = xmin <= 0 && xmax >= 0 ? sx(0) : null;
    return { d, W, H, y0, x0, ymin: +ymin.toPrecision(4), ymax: +ymax.toPrecision(4) };
  }, [fx, xmin, xmax, deg]);

  const btns = ['7', '8', '9', '/', 'sin(', '4', '5', '6', '*', 'cos(', '1', '2', '3', '-', 'tan(', '0', '.', '^', '+', 'sqrt(', '(', ')', 'pi', 'e', 'ln('];

  return (
    <section id="scientific-calculator" className="py-16 bg-gradient-to-b from-black via-slate-950 to-black border-t border-white/5">
      <div className="max-w-5xl mx-auto px-6">
        <header className="text-center mb-8">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-cyan-400/90 mb-3">Scientific calculator &amp; grapher</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Engineering Calculator &amp; Function Plotter</h2>
          <p className="mt-3 text-white/65 max-w-2xl mx-auto">Type any expression — trig, logs, powers, roots, constants — or plot a function f(x). Fast, in-browser, no plugins.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {/* calculator */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">Calculator</h3>
              <button onClick={() => setDeg((d) => !d)} className="text-xs px-3 py-1 rounded-full border border-white/20 text-white/70 hover:bg-white/10">{deg ? 'DEG' : 'RAD'}</button>
            </div>
            <input value={expr} onChange={(e) => setExpr(e.target.value)} placeholder="e.g. 2*sin(45) + sqrt(16)" className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-3 text-white text-lg font-mono focus:border-cyan-500/60 focus:outline-none" />
            <div className={`mt-2 text-right font-mono text-xl ${result.startsWith('Error') || result === 'Math error' ? 'text-rose-400' : 'text-cyan-300'} min-h-[1.75rem]`}>{result && '= ' + result}</div>
            <div className="grid grid-cols-5 gap-2 mt-3">
              {btns.map((b) => (
                <button key={b} onClick={() => setExpr((e) => e + b)} className="py-2 rounded-lg bg-white/5 hover:bg-white/15 text-white text-sm font-mono">{b.replace('(', '')}</button>
              ))}
              <button onClick={() => setExpr((e) => e.slice(0, -1))} className="py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm col-span-2">⌫ Del</button>
              <button onClick={() => setExpr('')} className="py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-sm col-span-3">Clear</button>
            </div>
          </div>

          {/* grapher */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="font-semibold text-white mb-3">Graph f(x)</h3>
            <div className="flex gap-2 mb-3">
              <input value={fx} onChange={(e) => setFx(e.target.value)} placeholder="f(x) = …" className="flex-1 bg-black/60 border border-white/15 rounded-lg px-3 py-2 text-white font-mono focus:border-cyan-500/60 focus:outline-none" />
            </div>
            <div className="flex gap-2 mb-3 text-sm">
              <label className="flex items-center gap-1 text-white/60">x min<input type="number" value={xmin} onChange={(e) => setXmin(+e.target.value)} className="w-16 bg-black/60 border border-white/15 rounded px-2 py-1 text-white" /></label>
              <label className="flex items-center gap-1 text-white/60">x max<input type="number" value={xmax} onChange={(e) => setXmax(+e.target.value)} className="w-16 bg-black/60 border border-white/15 rounded px-2 py-1 text-white" /></label>
            </div>
            {plot ? (
              <svg viewBox={`0 0 ${plot.W} ${plot.H}`} className="w-full h-auto rounded-lg bg-black/40" role="img" aria-label="function plot">
                {plot.y0 !== null && <line x1="40" y1={plot.y0} x2={plot.W - 16} y2={plot.y0} stroke="#3f3f46" strokeWidth="1" />}
                {plot.x0 !== null && <line x1={plot.x0} y1="12" x2={plot.x0} y2={plot.H - 24} stroke="#3f3f46" strokeWidth="1" />}
                <path d={plot.d} fill="none" stroke="#22d3ee" strokeWidth="2" />
                <text x="42" y="22" fontSize="10" fill="#9ca3af">{plot.ymax}</text>
                <text x="42" y={plot.H - 26} fontSize="10" fill="#9ca3af">{plot.ymin}</text>
                <text x={plot.W - 18} y={plot.H - 10} fontSize="10" fill="#9ca3af" textAnchor="end">x = {xmax}</text>
                <text x="40" y={plot.H - 10} fontSize="10" fill="#9ca3af">x = {xmin}</text>
              </svg>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-white/40 text-sm border border-white/10 rounded-lg">Enter a valid f(x), e.g. sin(x), x^2, 1/x</div>
            )}
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-white/40">Functions: sin cos tan asin acos atan sqrt cbrt ln log exp abs floor ceil round pow min max · constants: pi e · use x for graphing</p>
      </div>
    </section>
  );
}
