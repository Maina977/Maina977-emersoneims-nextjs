import { getSystemDiagram, FLOW_STYLE, type SystemDiagram } from '@/lib/repair-centre/systemDiagrams';

/**
 * Labelled component schematic for the equipment the guide covers.
 *
 * Every component is named as a technician would name it, and every connection
 * is coloured by what flows along it — fuel, intake air, exhaust, coolant,
 * mechanical drive, AC power, DC power, or signal. The colour coding is what
 * carries the teaching: seeing that the AVR senses at the main stator and feeds
 * the exciter makes an excitation fault reasonable about rather than memorised.
 *
 * These are functional block schematics drawn from engineering principle, not
 * physical layout drawings of any manufacturer's machine. That distinction is
 * stated in the caption, because a diagram implying it shows YOUR machine's
 * physical arrangement would be inventing information.
 *
 * Server component, inline SVG, no JavaScript, scales without a raster asset.
 */

const NODE_W = 150;
const NODE_H = 54;
const GAP_X = 34;
const GAP_Y = 30;
const PAD = 18;

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
  return lines;
}

export default function SystemComponentDiagram({ hub }: { hub: string }) {
  const d: SystemDiagram | undefined = getSystemDiagram(hub);
  if (!d) return null;

  const W = PAD * 2 + d.cols * NODE_W + (d.cols - 1) * GAP_X;
  const LEGEND_H = 30;
  const H = PAD * 2 + d.rows * NODE_H + (d.rows - 1) * GAP_Y + LEGEND_H;

  const pos = (col: number, row: number) => ({
    x: PAD + col * (NODE_W + GAP_X),
    y: PAD + row * (NODE_H + GAP_Y),
  });
  const byId = new Map(d.nodes.map(n => [n.id, n]));

  return (
    <figure className="mt-10 mb-4">
      <h3 className="text-lg font-bold text-white mb-1">System components</h3>
      <p className="text-sm text-slate-400 mb-4">
        What the system contains and how the parts connect. Line colour shows what travels between
        them.
      </p>
      <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ minWidth: 700, maxWidth: '100%', height: 'auto' }}
          role="img"
          aria-labelledby={`sysdiag-${hub}`}
        >
          <title id={`sysdiag-${hub}`}>
            {d.title}. Components: {d.nodes.map(n => n.label).join(', ')}.
          </title>

          <defs>
            {d.legend.map(k => (
              <marker
                key={k}
                id={`arw-${hub}-${k}`}
                viewBox="0 0 8 8"
                refX="7"
                refY="4"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 8 4 L 0 7 z" fill={FLOW_STYLE[k].colour} />
              </marker>
            ))}
          </defs>

          {/* connections drawn first so boxes sit above them */}
          {d.edges.map((e, i) => {
            const a = byId.get(e.from);
            const b = byId.get(e.to);
            if (!a || !b) return null;
            const pa = pos(a.col, a.row);
            const pb = pos(b.col, b.row);
            const style = FLOW_STYLE[e.kind];

            // connect from the nearest edge midpoints
            let x1 = pa.x + NODE_W / 2;
            let y1 = pa.y + NODE_H / 2;
            let x2 = pb.x + NODE_W / 2;
            let y2 = pb.y + NODE_H / 2;
            if (a.row === b.row) {
              if (b.col > a.col) { x1 = pa.x + NODE_W; x2 = pb.x; }
              else { x1 = pa.x; x2 = pb.x + NODE_W; }
            } else if (a.col === b.col) {
              if (b.row > a.row) { y1 = pa.y + NODE_H; y2 = pb.y; }
              else { y1 = pa.y; y2 = pb.y + NODE_H; }
            }

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={style.colour}
                strokeWidth="1.8"
                strokeDasharray={style.dash}
                opacity="0.85"
                markerEnd={`url(#arw-${hub}-${e.kind})`}
              />
            );
          })}

          {/* components */}
          {d.nodes.map(n => {
            const p = pos(n.col, n.row);
            const nameLines = wrap(n.label, 20, n.sub ? 1 : 2);
            return (
              <g key={n.id}>
                <rect
                  x={p.x}
                  y={p.y}
                  width={NODE_W}
                  height={NODE_H}
                  rx={8}
                  fill="#0f172a"
                  stroke="#38bdf8"
                  strokeWidth="1.4"
                />
                {nameLines.map((ln, i) => (
                  <text
                    key={i}
                    x={p.x + NODE_W / 2}
                    y={p.y + (n.sub ? 23 : nameLines.length === 1 ? 32 : 24) + i * 15}
                    fontSize="12.5"
                    fontWeight="600"
                    fill="#e2e8f0"
                    textAnchor="middle"
                    fontFamily="ui-sans-serif, system-ui, sans-serif"
                  >
                    {ln}
                  </text>
                ))}
                {n.sub && (
                  <text
                    x={p.x + NODE_W / 2}
                    y={p.y + 40}
                    fontSize="10"
                    fill="#94a3b8"
                    textAnchor="middle"
                    fontFamily="ui-sans-serif, system-ui, sans-serif"
                  >
                    {wrap(n.sub, 26, 1)[0]}
                  </text>
                )}
              </g>
            );
          })}

          {/* legend */}
          {d.legend.map((k, i) => {
            const x = PAD + i * 132;
            const y = H - 14;
            return (
              <g key={k}>
                <line
                  x1={x}
                  y1={y}
                  x2={x + 22}
                  y2={y}
                  stroke={FLOW_STYLE[k].colour}
                  strokeWidth="2.4"
                  strokeDasharray={FLOW_STYLE[k].dash}
                />
                <text
                  x={x + 28}
                  y={y + 4}
                  fontSize="11"
                  fill="#94a3b8"
                  fontFamily="ui-sans-serif, system-ui, sans-serif"
                >
                  {FLOW_STYLE[k].label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="mt-2 text-xs text-slate-500">
        {d.title}. This is a functional schematic showing which components a system of this type
        contains and how they connect — not a physical layout of any particular make or model.
        Confirm physical arrangement and all model-specific values against the manufacturer&apos;s
        documentation for your unit.
      </figcaption>
    </figure>
  );
}
