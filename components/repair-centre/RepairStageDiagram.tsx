import type { RepairGroup } from '@/lib/repair-centre/types';

/**
 * Repair sequence rendered as a staged diagram.
 *
 * WHY: the owner's requirement is that every guide shows the STAGES of a repair
 * visually, not only as prose. Each article already carries its repair work as
 * ordered `RepairGroup`s with a level, a title and its steps, so the diagram is
 * generated from the article's own data — it cannot drift out of step with the
 * text beneath it, and it cannot show a stage the guide does not describe.
 *
 * The `level` is meaningful and is shown: it tells a technician what class of
 * work each stage is, and therefore whether it is within their competence.
 * Cleaning and connections is not the same undertaking as board-level work.
 *
 * Server component, inline SVG, no JavaScript. Text is wrapped manually because
 * SVG has no auto-wrap.
 */

const LEVEL_LABEL: Record<string, string> = {
  'cleaning-and-connections': 'Cleaning & connections',
  wiring: 'Wiring',
  'sensor-replacement': 'Sensor replacement',
  mechanical: 'Mechanical',
  'board-level': 'Board level',
  'component-replacement': 'Component replacement',
  configuration: 'Configuration',
  firmware: 'Firmware',
  'board-replacement': 'Board replacement',
  'manufacturer-level': 'Manufacturer level',
};

/** Escalating colour: routine work through to work that leaves the site. */
const LEVEL_TONE: Record<string, { fill: string; stroke: string; text: string }> = {
  'cleaning-and-connections': { fill: '#052e2b', stroke: '#2dd4bf', text: '#5eead4' },
  wiring: { fill: '#082f49', stroke: '#38bdf8', text: '#7dd3fc' },
  'sensor-replacement': { fill: '#082f49', stroke: '#38bdf8', text: '#7dd3fc' },
  configuration: { fill: '#0c2d48', stroke: '#60a5fa', text: '#93c5fd' },
  firmware: { fill: '#0c2d48', stroke: '#60a5fa', text: '#93c5fd' },
  mechanical: { fill: '#2c1f04', stroke: '#f59e0b', text: '#fcd34d' },
  'component-replacement': { fill: '#2c1f04', stroke: '#f59e0b', text: '#fcd34d' },
  'board-level': { fill: '#3b0d0d', stroke: '#f87171', text: '#fca5a5' },
  'board-replacement': { fill: '#3b0d0d', stroke: '#f87171', text: '#fca5a5' },
  'manufacturer-level': { fill: '#3b0d0d', stroke: '#f87171', text: '#fca5a5' },
};

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

export default function RepairStageDiagram({
  repair,
  slug,
}: {
  repair: RepairGroup[];
  slug: string;
}) {
  if (!repair.length) return null;

  const W = 900;
  const PAD = 16;
  const BOX_W = W - PAD * 2 - 70;
  const GAP = 16;

  // Height per stage depends on how many title lines it needs.
  const stages = repair.map((g, i) => {
    const titleLines = wrap(g.title, 62, 2);
    const h = 30 + titleLines.length * 17 + 20;
    return { g, i, titleLines, h };
  });

  const totalH = stages.reduce((s, x) => s + x.h, 0) + GAP * (stages.length - 1) + PAD * 2;

  let y = PAD;
  const placed = stages.map(s => {
    const at = y;
    y += s.h + GAP;
    return { ...s, y: at };
  });

  return (
    <figure className="mt-10 mb-4">
      <h3 className="text-lg font-bold text-white mb-1">Repair stages</h3>
      <p className="text-sm text-slate-400 mb-4">
        The work in order, with the class of each stage. Later stages are more invasive — check the
        stage class against your own competence before starting it.
      </p>
      <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${totalH}`}
          width="100%"
          style={{ minWidth: 660, maxWidth: '100%', height: 'auto' }}
          role="img"
          aria-labelledby={`rsd-${slug}`}
        >
          <title id={`rsd-${slug}`}>
            Repair sequence in {repair.length} stages:{' '}
            {repair.map((g, i) => `stage ${i + 1}, ${g.title}`).join('; ')}.
          </title>

          {placed.map((s, idx) => {
            const tone = LEVEL_TONE[s.g.level] ?? LEVEL_TONE.wiring;
            const x = PAD + 62;
            return (
              <g key={s.g.title}>
                {/* connector to the next stage */}
                {idx < placed.length - 1 && (
                  <line
                    x1={PAD + 26}
                    y1={s.y + s.h}
                    x2={PAD + 26}
                    y2={placed[idx + 1].y}
                    stroke="#334155"
                    strokeWidth="2"
                  />
                )}

                {/* stage number */}
                <circle cx={PAD + 26} cy={s.y + 24} r={18} fill={tone.fill} stroke={tone.stroke} strokeWidth="2" />
                <text
                  x={PAD + 26}
                  y={s.y + 30}
                  fontSize="15"
                  fontWeight="700"
                  fill={tone.text}
                  textAnchor="middle"
                  fontFamily="ui-sans-serif, system-ui, sans-serif"
                >
                  {idx + 1}
                </text>

                <rect
                  x={x}
                  y={s.y}
                  width={BOX_W}
                  height={s.h}
                  rx={10}
                  fill={tone.fill}
                  stroke={tone.stroke}
                  strokeWidth="1.5"
                />

                {/* stage class */}
                <text
                  x={x + 14}
                  y={s.y + 19}
                  fontSize="10.5"
                  fill={tone.text}
                  letterSpacing="1"
                  fontFamily="ui-sans-serif, system-ui, sans-serif"
                >
                  {(LEVEL_LABEL[s.g.level] ?? s.g.level).toUpperCase()}
                </text>

                {s.titleLines.map((ln, li) => (
                  <text
                    key={li}
                    x={x + 14}
                    y={s.y + 40 + li * 17}
                    fontSize="13.5"
                    fontWeight="600"
                    fill="#e2e8f0"
                    fontFamily="ui-sans-serif, system-ui, sans-serif"
                  >
                    {ln}
                  </text>
                ))}

                <text
                  x={x + BOX_W - 14}
                  y={s.y + 19}
                  fontSize="10.5"
                  fill="#94a3b8"
                  textAnchor="end"
                  fontFamily="ui-sans-serif, system-ui, sans-serif"
                >
                  {s.g.steps.length} step{s.g.steps.length === 1 ? '' : 's'}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="mt-2 text-xs text-slate-500">
        {repair.length} repair stages. The class shown on each stage indicates the nature of the work
        — cleaning and connections through to manufacturer-level. Full steps for each stage are
        listed below.
      </figcaption>
    </figure>
  );
}
