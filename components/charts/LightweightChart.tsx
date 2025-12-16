'use client';

import { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi } from 'lightweight-charts';

interface LightweightChartProps {
  type: string;
  data: any;
  options?: any;
  className?: string;
}

export default function LightweightChart({ type, data, options, className }: LightweightChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'oklch(0 0 0)' },
        textColor: 'oklch(0.75 0.20 200)',
        fontFamily: 'var(--font-body), sans-serif',
      },
      grid: {
        vertLines: { 
          color: 'oklch(0.20 0.05 200 / 0.3)',
          style: 1, // Solid lines
        },
        horzLines: { 
          color: 'oklch(0.20 0.05 200 / 0.3)',
          style: 1, // Solid lines
        },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      ...options,
    });

    const series = type === 'candlestick' 
      ? chart.addCandlestickSeries({
          upColor: 'oklch(0.65 0.20 150)',
          downColor: 'oklch(0.65 0.20 0)',
          borderVisible: false,
        })
      : chart.addLineSeries({
          color: 'oklch(0.75 0.20 200)',
          lineWidth: 2,
        });

    const chartData = data.labels?.map((label: string, index: number) => ({
      time: label,
      value: data.datasets?.[0]?.data?.[index] || 0,
    })) || [];

    series.setData(chartData as any);
    chartRef.current = chart;

    return () => {
      chart.remove();
    };
  }, [type, data, options]);

  return <div ref={chartContainerRef} className={className} />;
}

