/**
 * ServiceWidgetsPanel — renders the per-service interactive widget bundle
 * defined in lib/services/serviceWidgets.tsx.
 *
 * Always-visible (no tabs). Sourced data only. Each widget displays its
 * citation so the user can verify provenance.
 */
'use client';

import {
  Knob,
  BarChart,
  LineChart,
  SpecTable,
  Diagram,
} from '@/components/services/widgets/WidgetPrimitives';
import { SERVICE_WIDGETS } from '@/lib/services/serviceWidgets';

interface Props {
  slug: string;
  serviceName: string;
}

export default function ServiceWidgetsPanel({ slug, serviceName }: Props) {
  const widgets = SERVICE_WIDGETS[slug];
  if (!widgets || widgets.length === 0) return null;

  return (
    <section
      id="widgets"
      className="py-16 px-4 scroll-mt-32 border-t border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Live Engineering Tools
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              {serviceName} — Interactive Engineering Panel
            </h2>
            <p className="text-slate-400 mt-2 text-sm md:text-base max-w-3xl">
              Tap, drag and explore. Every value is sourced from authoritative
              standards (NEMA Kenya, IEC, KEBS, NASA POWER, OEM data sheets) —
              citations appear at the foot of each widget.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {widgets.map((w) => (
              <a
                key={w.id}
                href={`#widget-${w.id}`}
                className="px-3 py-1.5 text-xs font-bold rounded-full border border-slate-700 text-slate-300 hover:border-cyan-500 hover:text-cyan-300"
              >
                {w.kind === 'knob' ? '🎛️' : w.kind === 'bar' ? '📊' : w.kind === 'line' ? '📈' : w.kind === 'spec' ? '📋' : '🗺️'}{' '}
                {w.kind === 'knob'
                  ? w.label
                  : w.kind === 'bar' || w.kind === 'line' || w.kind === 'spec' || w.kind === 'diagram'
                  ? w.title
                  : ''}
              </a>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {widgets.map((w) => (
            <div key={w.id} id={`widget-${w.id}`} className="scroll-mt-32">
              {w.kind === 'knob' && (
                <Knob
                  label={w.label}
                  unit={w.unit}
                  min={w.min}
                  max={w.max}
                  initial={w.initial}
                  step={w.step}
                  zones={w.zones}
                  description={w.description}
                  source={w.source}
                />
              )}
              {w.kind === 'bar' && (
                <BarChart title={w.title} data={w.data} source={w.source} />
              )}
              {w.kind === 'line' && (
                <LineChart
                  title={w.title}
                  xLabel={w.xLabel}
                  yLabel={w.yLabel}
                  unit={w.unit}
                  series={w.series}
                  source={w.source}
                />
              )}
              {w.kind === 'spec' && (
                <SpecTable title={w.title} rows={w.rows} source={w.source} />
              )}
              {w.kind === 'diagram' && (
                <Diagram
                  title={w.title}
                  svg={w.svg}
                  hotspots={w.hotspots}
                  source={w.source}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
