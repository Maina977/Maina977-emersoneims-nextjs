'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

/**
 * Chart Library Wrapper
 * Supports: Chart.js, ECharts, D3.js, Lightweight Charts, Recharts, Visx
 */

// Lazy load chart libraries
const ChartJSChart = dynamic(() => import('./ChartJSChart'), { ssr: false });
const EChartsChart = dynamic(() => import('./EChartsChart'), { ssr: false });
const D3Chart = dynamic(() => import('./D3Chart'), { ssr: false });
const LightweightChart = dynamic(() => import('./LightweightChart'), { ssr: false });
const RechartsChart = dynamic(() => import('./RechartsChart'), { ssr: false });
const VisxChart = dynamic(() => import('./VisxChart'), { ssr: false });

export type ChartLibrary = 'chartjs' | 'echarts' | 'd3' | 'lightweight' | 'recharts' | 'visx';

interface ChartLibraryWrapperProps {
  library: ChartLibrary;
  type?: string;
  data: any;
  options?: any;
  className?: string;
}

export default function ChartLibraryWrapper({
  library,
  type = 'line',
  data,
  options,
  className = '',
}: ChartLibraryWrapperProps) {
  const chartProps = { type, data, options, className };

  switch (library) {
    case 'chartjs':
      return <ChartJSChart {...chartProps} />;
    case 'echarts':
      return <EChartsChart {...chartProps} />;
    case 'd3':
      return <D3Chart {...chartProps} />;
    case 'lightweight':
      return <LightweightChart {...chartProps} />;
    case 'recharts':
      return <RechartsChart {...chartProps} />;
    case 'visx':
      return <VisxChart {...chartProps} />;
    default:
      return <ChartJSChart {...chartProps} />;
  }
}








