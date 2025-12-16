'use client';

import ReactECharts from 'echarts-for-react';

interface EChartsChartProps {
  type: string;
  data: any;
  options?: any;
  className?: string;
}

export default function EChartsChart({ type, data, options, className }: EChartsChartProps) {
  const defaultOption = {
    backgroundColor: 'transparent',
    textStyle: {
      color: 'oklch(0.75 0.20 200)',
      fontFamily: 'var(--font-manrope), sans-serif',
      fontSize: 12,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: data.labels || [],
      axisLine: { lineStyle: { color: 'oklch(0.40 0.05 200)', width: 1 } },
      axisLabel: { 
        color: 'oklch(0.60 0.05 200)',
        fontFamily: 'var(--font-body), sans-serif',
        fontSize: 11,
      },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: 'oklch(0.40 0.05 200)', width: 1 } },
      axisLabel: { 
        color: 'oklch(0.60 0.05 200)',
        fontFamily: 'var(--font-body), sans-serif',
        fontSize: 11,
        formatter: function(value: number) {
          return value.toLocaleString();
        }
      },
      splitLine: { 
        lineStyle: { 
          color: 'oklch(0.20 0.05 200 / 0.3)',
          width: 1,
          type: 'solid',
        } 
      },
    },
    series: data.datasets?.map((dataset: any) => ({
      type: type === 'bar' ? 'bar' : 'line',
      data: dataset.data,
      itemStyle: {
        color: dataset.backgroundColor || 'oklch(0.75 0.20 200)',
      },
      areaStyle: type === 'area' ? {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'oklch(0.75 0.20 200 / 0.8)' },
            { offset: 1, color: 'oklch(0.75 0.20 200 / 0.1)' },
          ],
        },
      } : undefined,
    })) || [],
    ...options,
  };

  return (
    <div className={className}>
      <ReactECharts option={defaultOption} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}

