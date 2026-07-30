import type { DiagnosticStep } from '@/lib/repair-centre/types';

/**
 * The diagnostic sequence as a diagram, showing what is measured at each step,
 * with what instrument, and what reading is expected.
 *
 * WHY: the article already lists the steps in prose, but a technician working on
 * a set wants the whole path visible at once — where they are in it, what comes
 * next, and which instrument to have in hand. Generated from the article's own
 * `diagnosis` array, so it can never show a step the guide does not describe.
 *
 * Instrument names are shown deliberately: knowing that step 4 needs a DC clamp
 * meter before you climb onto a roof or open a panel saves a second trip.
 *
 * Server component, inline SVG, no JavaScript.
 */

function wrap(text: string, perLine: number, max: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if (!cur) cur = w;
    else if ((cur + ' ' + w).length <= perLine) cur += ' ' + w;
    else {
      lines.push(cur);
      cur = w;
      if (lines.length === max) break;
    }
  }
  if (cur && lines.length < max) lines.push(cur);
  if (lines.length === max) {
    const joined = lines.join(' ');
    if (joined.length < text.length) {
      lines[max - 1] = lines[max - 1].slice(0, Math.max(0, perLine - 1)) + '…';
    }
  }
  return lines;
}

export default function DiagnosticSequenceDiagram({
  steps,
  slug,
}: {
  steps: DiagnosticStep[];
  slug: string;
}) {
  if (!steps.length) return null;

  const W = 900;
  const PAD = 16;
  const RAIL_X = PAD + 24;
  const BOX_X = PAD + 62;
  const BOX_W = W - BOX_X - PAD;

  const laid = steps.map(s => {
    const titleLines = wrap(s.title, 60, 2);
    const instLine = wrap(s.instrument, 78, 1)[0] ?? '';
    const h = 26 + titleLines.length * 17 + 20;
    return { s, titleLines, instLine, h };
  });

  let y = PAD;
  const placed = laid.map(l => {
    const at = y;
    y += l.h + 14;
    return { ...l, y: at };
  });
  const totalH = y - 14 + PAD;

  return (
    <figure className="mt-10 mb-4">
      <h3 className="text-lg font-bold text-white mb-1">Diagnostic sequence</h3>
      <p className="text-sm text-slate-400 mb-4">
        The order the checks are made in, and the instrument each one needs. Working out of order is
        how the wrong component gets replaced.
      </p>
      <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${totalH}`}
          width="100%"
          style={{ minWidth: 660, maxWidth: '100%', height: 'auto' }}
          role="img"
          aria-labelledby={`dsd-${slug}`}
        >
          <title id={`dsd-${slug}`}>
            Diagnostic sequence of {steps.length} steps:{' '}
            {steps.map(s => `step ${s.step}, ${s.title}, using ${s.instrument}`).join('; ')}.
          </title>

          {placed.map((p, i) => (
            <g key={p.s.step}>
              {i < placed.length - 1 && (
                <line
                  x1={RAIL_X}
                  y1={p.y + p.h}
                  x2={RAIL_X}
                  y2={placed[i + 1].y}
                  stroke="#334155"
                  strokeWidth="2"
                />
              )}

              <circle cx={RAIL_X} cy={p.y + 22} r={16} fill="#082f49" stroke="#38bdf8" strokeWidth="2" />
              <text
                x={RAIL_X}
                y={p.y + 27}
                fontSize="13"
                fontWeight="700"
                fill="#7dd3fc"
                textAnchor="middle"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
              >
                {p.s.step}
              </text>

              <rect
                x={BOX_X}
                y={p.y}
                width={BOX_W}
                height={p.h}
                rx={9}
                fill="#0f172a"
                stroke="#1e3a5f"
                strokeWidth="1.4"
              />

              {p.titleLines.map((ln, li) => (
                <text
                  key={li}
                  x={BOX_X + 14}
                  y={p.y + 22 + li * 17}
                  fontSize="13.5"
                  fontWeight="600"
                  fill="#e2e8f0"
                  fontFamily="ui-sans-serif, system-ui, sans-serif"
                >
                  {ln}
                </text>
              ))}

              <text
                x={BOX_X + 14}
                y={p.y + p.h - 11}
                fontSize="11"
                fill="#22d3ee"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
              >
                {'▸ '}
                {p.instLine}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <figcaption className="mt-2 text-xs text-slate-500">
        {steps.length} diagnostic steps in order, each showing the instrument required. Expected
        readings and what to do when a reading is abnormal are given in full below.
      </figcaption>
    </figure>
  );
}
