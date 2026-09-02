import type { RepairHub } from '@/lib/repair-centre/types';

/**
 * Fault-domain map for a Repair Centre hub, rendered as inline SVG.
 *
 * WHY: every hub page was pure text. The owner's standing requirement is that
 * every page under /repair-centre carries a diagram, and a category index with
 * no visual is also simply harder to scan — a technician wants to see the fault
 * domains of a system at a glance and jump to the one matching their symptom.
 *
 * WHAT IT SHOWS: the equipment at the centre, each declared scope item as a
 * fault domain around it. Domains with a published guide are drawn solid and
 * labelled with the guide count; domains without one are drawn dashed and muted.
 * The diagram therefore carries the same honest distinction the page text does —
 * it can never show coverage that does not exist, because both are derived from
 * the same data.
 *
 * Server component, inline SVG: it is in the initial HTML, needs no JavaScript,
 * and scales without a raster asset. Text is wrapped manually because SVG has no
 * auto-wrap (same constraint as DecisionFlowchart).
 */

interface Domain {
  label: string;
  guides: number;
}

/** Split a label into at most `max` lines of roughly `perLine` characters. */
function wrap(text: string, perLine: number, max: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if (!cur.length) cur = w;
    else if ((cur + ' ' + w).length <= perLine) cur += ' ' + w;
    else {
      lines.push(cur);
      cur = w;
      if (lines.length === max - 1) break;
    }
  }
  if (cur && lines.length < max) lines.push(cur);
  const used = lines.join(' ');
  if (used.length < text.length && lines.length) {
    const last = lines[lines.length - 1];
    lines[lines.length - 1] = last.slice(0, Math.max(0, perLine - 1)) + '…';
  }
  return lines;
}

export default function HubScopeDiagram({
  hub,
  coveredCounts,
}: {
  hub: RepairHub;
  /** scope label -> number of published guides covering it (0 = not yet written) */
  coveredCounts: Record<string, number>;
}) {
  const domains: Domain[] = hub.scope.map(label => ({
    label,
    guides: coveredCounts[label] ?? 0,
  }));

  // Two columns of domain boxes either side of a central equipment node.
  const BOX_W = 210;
  const BOX_H = 58;
  const GAP_Y = 14;
  const COL_GAP = 150;
  const perCol = Math.ceil(domains.length / 2);
  const left = domains.slice(0, perCol);
  const right = domains.slice(perCol);

  const colH = perCol * BOX_H + (perCol - 1) * GAP_Y;
  const H = Math.max(colH, 150) + 70;
  const W = BOX_W * 2 + COL_GAP + 40;
  const cx = W / 2;
  const cy = H / 2;

  const colTop = (n: number) => (H - (n * BOX_H + (n - 1) * GAP_Y)) / 2;
  const leftTop = colTop(left.length);
  const rightTop = colTop(right.length);

  const equipment = hub.title.replace(/ (Diagnosis|Repair|Troubleshooting).*$/i, '').trim();

  const box = (d: Domain, x: number, y: number, side: 'l' | 'r', key: string) => {
    const on = d.guides > 0;
    const lines = wrap(d.label, 26, 2);
    const anchorX = side === 'l' ? x + BOX_W : x;
    return (
      <g key={key}>
        <line
          x1={anchorX}
          y1={y + BOX_H / 2}
          x2={cx + (side === 'l' ? -62 : 62)}
          y2={cy}
          stroke={on ? '#22d3ee' : '#475569'}
          strokeWidth={on ? 1.5 : 1}
          strokeDasharray={on ? undefined : '4 4'}
        />
        <rect
          x={x}
          y={y}
          width={BOX_W}
          height={BOX_H}
          rx={8}
          fill={on ? '#0f172a' : '#0b1220'}
          stroke={on ? '#22d3ee' : '#475569'}
          strokeWidth={on ? 1.5 : 1}
          strokeDasharray={on ? undefined : '5 4'}
        />
        {lines.map((ln, i) => (
          <text
            key={i}
            x={x + 12}
            y={y + (lines.length === 1 ? 27 : 21) + i * 15}
            fontSize="12"
            fill={on ? '#e2e8f0' : '#7c8aa0'}
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            {ln}
          </text>
        ))}
        <text
          x={x + 12}
          y={y + BOX_H - 9}
          fontSize="10"
          fill={on ? '#22d3ee' : '#64748b'}
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          {on ? `${d.guides} guide${d.guides > 1 ? 's' : ''}` : 'guide not yet published'}
        </text>
      </g>
    );
  };

  const title = `Fault domains for ${equipment}`;
  const covered = domains.filter(d => d.guides > 0).length;

  return (
    <figure className="mt-8 mb-2">
      <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ minWidth: 620, maxWidth: '100%', height: 'auto' }}
          role="img"
          aria-labelledby={`hubdiag-${hub.slug}-title`}
        >
          <title id={`hubdiag-${hub.slug}-title`}>
            {title}. {covered} of {domains.length} domains have a published guide.
          </title>

          {left.map((d, i) => box(d, 20, leftTop + i * (BOX_H + GAP_Y), 'l', `l${i}`))}
          {right.map((d, i) =>
            box(d, 20 + BOX_W + COL_GAP, rightTop + i * (BOX_H + GAP_Y), 'r', `r${i}`),
          )}

          {/* central equipment node */}
          <ellipse cx={cx} cy={cy} rx={62} ry={40} fill="#082f49" stroke="#38bdf8" strokeWidth="2" />
          {wrap(equipment, 14, 3).map((ln, i, arr) => (
            <text
              key={i}
              x={cx}
              y={cy - (arr.length - 1) * 7 + i * 14 + 4}
              fontSize="12"
              fontWeight="700"
              fill="#e0f2fe"
              textAnchor="middle"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              {ln}
            </text>
          ))}
        </svg>
      </div>
      <figcaption className="mt-2 text-xs text-slate-500">
        Fault domains for {equipment}. Solid outline means a published guide covers that domain;
        dashed means the guide is not yet written. {covered} of {domains.length} covered.
      </figcaption>
    </figure>
  );
}
