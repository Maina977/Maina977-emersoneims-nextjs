'use client';

import { Group } from '@visx/group';
import { Bar } from '@visx/shape';
import { scaleBand, scaleLinear } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';

interface VisxChartProps {
  type: string;
  data: any;
  options?: any;
  className?: string;
}

export default function VisxChart({ type, data, options, className }: VisxChartProps) {
  const width = 800;
  const height = 400;
  const margin = { top: 20, right: 20, bottom: 40, left: 40 };

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const xScale = scaleBand<string>({
    range: [0, xMax],
    domain: data.labels || [],
    padding: 0.2,
  });

  const yScale = scaleLinear<number>({
    range: [yMax, 0],
    domain: [0, Math.max(...(data.datasets?.[0]?.data || [0]))],
  });

  return (
    <svg width={width} height={height} className={className}>
      <defs>
        <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="oklch(0.20 0.05 200 / 0.3)" strokeWidth="1"/>
        </pattern>
      </defs>
      <rect width={width} height={height} fill="url(#grid)" />
      <Group left={margin.left} top={margin.top}>
        {(data.datasets?.[0]?.data || []).map((d: number, i: number) => {
          const label = data.labels?.[i] || '';
          const barWidth = xScale.bandwidth();
          const barHeight = yMax - yScale(d);
          const barX = xScale(label) || 0;
          const barY = yScale(d);

          return (
            <Bar
              key={`bar-${i}`}
              x={barX}
              y={barY}
              width={barWidth}
              height={barHeight}
              fill="oklch(0.75 0.20 200)"
              rx={4}
            />
          );
        })}
        <AxisLeft
          scale={yScale}
          stroke="oklch(0.60 0.05 200)"
          tickStroke="oklch(0.60 0.05 200)"
          tickLabelProps={{
            fill: 'oklch(0.60 0.05 200)',
            fontSize: 11,
            fontFamily: 'var(--font-body), sans-serif',
          }}
          tickFormat={(value) => value.toLocaleString()}
        />
        <AxisBottom
          top={yMax}
          scale={xScale}
          stroke="oklch(0.60 0.05 200)"
          tickStroke="oklch(0.60 0.05 200)"
          tickLabelProps={{
            fill: 'oklch(0.60 0.05 200)',
            fontSize: 11,
            fontFamily: 'var(--font-body), sans-serif',
            angle: -45,
            textAnchor: 'end',
          }}
        />
      </Group>
    </svg>
  );
}

