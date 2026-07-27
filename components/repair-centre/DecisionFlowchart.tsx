import type { DecisionNode } from '@/lib/repair-centre/types';

/**
 * Diagnostic decision tree, drawn as an original SVG flowchart.
 *
 * Section 6 of the Repair Centre brief requires the decision tree to appear
 * BOTH as written steps and as a visual flowchart. This renders the same
 * `decisionTree` data the written list uses, so the diagram can never drift
 * from the text and nothing is invented to fill it.
 *
 * Server component, inline SVG: no JavaScript, present in the initial HTML,
 * readable by crawlers and by readers with scripting disabled. Text is wrapped
 * manually because SVG has no automatic line breaking — an unwrapped label
 * would overflow its box, which is exactly the "distorted text" the brief
 * prohibits.
 */

const VB_W = 920;
const X_Q = 10;
const W_Q = 520;
const X_N = 590;
const W_N = 320;
const PAD = 14;
const Q_LINE = 20;
const S_LINE = 16;
const V_GAP = 34;

/** Greedy wrap by character budget. Approximates width for the given size. */
function wrap(text: string, maxChars: number): string[] {
  const words = String(text ?? '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [''];
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    if (line.length === 0) {
      line = w;
    } else if ((line + ' ' + w).length <= maxChars) {
      line += ' ' + w;
    } else {
      lines.push(line);
      line = w;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export default function DecisionFlowchart({
  nodes,
  title,
}: {
  nodes: DecisionNode[];
  title: string;
}) {
  if (!nodes || nodes.length === 0) return null;

  // Measure first, then draw — heights depend on how the text wraps.
  const rows = nodes.map((n, i) => {
    const qLines = wrap(`${i + 1}. ${n.question}`, 56);
    const yLines = wrap(`Yes — ${n.yes}`, 60);
    const nLines = wrap(n.no, 38);
    const qH = PAD * 2 + qLines.length * Q_LINE + 6 + yLines.length * S_LINE;
    const nH = PAD * 2 + S_LINE + nLines.length * S_LINE;
    return { qLines, yLines, nLines, h: Math.max(qH, nH), qH, nH };
  });

  const TERM_H = 46;
  const totalH =
    rows.reduce((sum, r) => sum + r.h + V_GAP, 0) + TERM_H + 10;

  let y = 10;
  const drawn: React.ReactNode[] = [];

  rows.forEach((r, i) => {
    const rowTop = y;
    const qMid = rowTop + r.qH / 2;

    // Decision box
    drawn.push(
      <g key={`q-${i}`}>
        <rect
          x={X_Q}
          y={rowTop}
          width={W_Q}
          height={r.qH}
          rx={10}
          fill="#0f172a"
          stroke="#334155"
          strokeWidth={1.5}
        />
        {r.qLines.map((ln, k) => (
          <text
            key={k}
            x={X_Q + PAD}
            y={rowTop + PAD + 15 + k * Q_LINE}
            fill="#f1f5f9"
            fontSize={14}
            fontWeight={600}
            fontFamily="system-ui, sans-serif"
          >
            {ln}
          </text>
        ))}
        {r.yLines.map((ln, k) => (
          <text
            key={`y${k}`}
            x={X_Q + PAD}
            y={rowTop + PAD + 15 + r.qLines.length * Q_LINE + 6 + k * S_LINE}
            fill="#6ee7b7"
            fontSize={12}
            fontFamily="system-ui, sans-serif"
          >
            {ln}
          </text>
        ))}
      </g>
    );

    // "No" outcome box
    drawn.push(
      <g key={`n-${i}`}>
        <rect
          x={X_N}
          y={rowTop}
          width={W_N}
          height={r.nH}
          rx={10}
          fill="#1c1414"
          stroke="#7c4a2d"
          strokeWidth={1.5}
        />
        <text
          x={X_N + PAD}
          y={rowTop + PAD + 12}
          fill="#fbbf24"
          fontSize={12}
          fontWeight={700}
          fontFamily="system-ui, sans-serif"
        >
          No
        </text>
        {r.nLines.map((ln, k) => (
          <text
            key={k}
            x={X_N + PAD}
            y={rowTop + PAD + 12 + S_LINE + k * S_LINE}
            fill="#fcd9a8"
            fontSize={12}
            fontFamily="system-ui, sans-serif"
          >
            {ln}
          </text>
        ))}
      </g>
    );

    // Arrow: decision -> No box
    drawn.push(
      <line
        key={`an-${i}`}
        x1={X_Q + W_Q}
        y1={qMid}
        x2={X_N - 8}
        y2={qMid}
        stroke="#7c4a2d"
        strokeWidth={1.5}
        markerEnd="url(#rc-arrow-no)"
      />
    );

    // Arrow: decision -> next row (the "Yes" path)
    const nextTop = rowTop + r.h + V_GAP;
    drawn.push(
      <g key={`ay-${i}`}>
        <line
          x1={X_Q + 60}
          y1={rowTop + r.qH}
          x2={X_Q + 60}
          y2={nextTop - 8}
          stroke="#10b981"
          strokeWidth={1.5}
          markerEnd="url(#rc-arrow-yes)"
        />
        <text
          x={X_Q + 70}
          y={rowTop + r.qH + (V_GAP + 8) / 2}
          fill="#6ee7b7"
          fontSize={11}
          fontWeight={700}
          fontFamily="system-ui, sans-serif"
        >
          Yes
        </text>
      </g>
    );

    y = nextTop;
  });

  // Terminal
  drawn.push(
    <g key="term">
      <rect
        x={X_Q}
        y={y}
        width={W_Q}
        height={TERM_H}
        rx={23}
        fill="#052e2b"
        stroke="#0d9488"
        strokeWidth={1.5}
      />
      <text
        x={X_Q + PAD}
        y={y + 28}
        fill="#5eead4"
        fontSize={13}
        fontWeight={600}
        fontFamily="system-ui, sans-serif"
      >
        Continue to the step-by-step diagnosis below.
      </text>
    </g>
  );

  const descId = 'rc-flow-desc';
  const titleId = 'rc-flow-title';

  return (
    <figure className="mt-6">
      <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-950/60 p-3">
        <svg
          viewBox={`0 0 ${VB_W} ${totalH}`}
          width="100%"
          style={{ minWidth: 680, height: 'auto', display: 'block' }}
          role="img"
          aria-labelledby={`${titleId} ${descId}`}
        >
          <title id={titleId}>{`Diagnostic decision flowchart: ${title}`}</title>
          <desc id={descId}>
            {`A ${nodes.length}-step decision flowchart. Each step asks a diagnostic question; answering yes continues down to the next question, while answering no leads to the stated finding. The same sequence is written out in full immediately below this diagram.`}
          </desc>
          <defs>
            <marker
              id="rc-arrow-yes"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
            </marker>
            <marker
              id="rc-arrow-no"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#7c4a2d" />
            </marker>
          </defs>
          {drawn}
        </svg>
      </div>
      <figcaption className="mt-2 text-sm text-slate-400">
        Diagnostic decision flow for {title.toLowerCase()}. Simplified illustration — not a replacement for the
        manufacturer&apos;s model-specific schematic or service data. The same sequence is written out in full below.
      </figcaption>
    </figure>
  );
}
