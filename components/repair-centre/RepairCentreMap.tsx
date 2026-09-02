import type { RepairHub } from '@/lib/repair-centre/types';

/**
 * Coverage map for the whole Repair Centre, rendered as inline SVG.
 *
 * WHY: the index listed 15 categories as text cards with no visual. A technician
 * arriving with a symptom needs to see the shape of the whole library at once —
 * which systems are covered deeply, which are thin — and the owner's standing
 * requirement is a diagram on every page under /repair-centre.
 *
 * WHAT IT SHOWS: every category as a tile, sized bar showing published guide
 * count, grouped by the system family a fault actually belongs to. Counts come
 * from the registry, so the map cannot overstate the library.
 *
 * Server component, inline SVG — present in the initial HTML, no JavaScript.
 */

interface Group {
  name: string;
  slugs: string[];
}

const GROUPS: Group[] = [
  { name: 'Power generation', slugs: ['generators', 'engine-systems', 'fuel-systems', 'controllers', 'fault-codes'] },
  { name: 'Backup & renewable', slugs: ['inverters', 'ups', 'solar', 'ats-changeover'] },
  { name: 'Electrical & electronics', slugs: ['motors', 'pumps', 'industrial-electronics', 'pcb-motherboards'] },
  { name: 'Method & safety', slugs: ['safety', 'testing-tools'] },
];

export default function RepairCentreMap({
  hubs,
  counts,
}: {
  hubs: RepairHub[];
  /** hub slug -> published guide count */
  counts: Record<string, number>;
}) {
  const bySlug = new Map(hubs.map(h => [h.slug, h]));
  const maxCount = Math.max(1, ...Object.values(counts));

  const TILE_W = 168;
  const TILE_H = 62;
  const GAP = 10;
  const GROUP_GAP = 28;
  const PAD = 16;
  const COLS = 5;

  // lay groups out in rows
  let y = PAD;
  const rows: { group: Group; y: number }[] = [];
  for (const g of GROUPS) {
    rows.push({ group: g, y });
    const lines = Math.ceil(g.slugs.length / COLS);
    y += 22 + lines * TILE_H + (lines - 1) * GAP + GROUP_GAP;
  }
  const W = PAD * 2 + COLS * TILE_W + (COLS - 1) * GAP;
  const H = y;

  const total = hubs.reduce((s, h) => s + (counts[h.slug] ?? 0), 0);

  return (
    <figure className="mt-8 mb-10">
      <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ minWidth: 680, maxWidth: '100%', height: 'auto' }}
          role="img"
          aria-labelledby="rc-map-title"
        >
          <title id="rc-map-title">
            Repair Centre coverage map: {hubs.length} equipment categories holding {total} published
            diagnostic guides, grouped by system family.
          </title>

          {rows.map(({ group, y: gy }) => (
            <g key={group.name}>
              <text
                x={PAD}
                y={gy + 12}
                fontSize="12"
                fontWeight="700"
                fill="#38bdf8"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
                letterSpacing="1"
              >
                {group.name.toUpperCase()}
              </text>
              {group.slugs.map((slug, i) => {
                const hub = bySlug.get(slug);
                if (!hub) return null;
                const n = counts[slug] ?? 0;
                const col = i % COLS;
                const row = Math.floor(i / COLS);
                const x = PAD + col * (TILE_W + GAP);
                const ty = gy + 22 + row * (TILE_H + GAP);
                const barW = Math.max(4, Math.round((n / maxCount) * (TILE_W - 24)));
                const short = hub.title
                  .replace(/ (Diagnosis|Repair|Troubleshooting)( &.*| and.*)?$/i, '')
                  .replace(/ & /g, ' & ');
                return (
                  <g key={slug}>
                    <rect
                      x={x}
                      y={ty}
                      width={TILE_W}
                      height={TILE_H}
                      rx={8}
                      fill="#0f172a"
                      stroke={n >= 5 ? '#22d3ee' : n >= 2 ? '#0e7490' : '#475569'}
                      strokeWidth={n >= 5 ? 1.6 : 1.2}
                    />
                    <text
                      x={x + 12}
                      y={ty + 20}
                      fontSize="11.5"
                      fill="#e2e8f0"
                      fontFamily="ui-sans-serif, system-ui, sans-serif"
                    >
                      {short.length > 24 ? short.slice(0, 23) + '…' : short}
                    </text>
                    <rect x={x + 12} y={ty + 30} width={TILE_W - 24} height={6} rx={3} fill="#1e293b" />
                    <rect
                      x={x + 12}
                      y={ty + 30}
                      width={barW}
                      height={6}
                      rx={3}
                      fill={n >= 5 ? '#22d3ee' : n >= 2 ? '#0e7490' : '#64748b'}
                    />
                    <text
                      x={x + 12}
                      y={ty + 52}
                      fontSize="10"
                      fill="#94a3b8"
                      fontFamily="ui-sans-serif, system-ui, sans-serif"
                    >
                      {n} published guide{n === 1 ? '' : 's'}
                    </text>
                  </g>
                );
              })}
            </g>
          ))}
        </svg>
      </div>
      <figcaption className="mt-2 text-xs text-slate-500">
        Coverage map — {hubs.length} equipment categories, {total} published guides. Bar length shows
        how many guides each category holds.
      </figcaption>
    </figure>
  );
}
