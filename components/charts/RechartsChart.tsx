'use client';

import { BarChart, LineChart, PieChart, Bar, Line, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RechartsChartProps {
  type: string;
  data: any;
  options?: any;
  className?: string;
}

const COLORS = [
  'oklch(0.75 0.20 200)',
  'oklch(0.85 0.15 85)',
  'oklch(0.65 0.20 280)',
  'oklch(0.65 0.20 150)',
];

export default function RechartsChart({ type, data, options, className }: RechartsChartProps) {
  const chartData = data.labels?.map((label: string, index: number) => ({
    name: label,
    value: data.datasets?.[0]?.data?.[index] || 0,
  })) || [];

  const commonProps = {
    data: chartData,
    className,
  };

  switch (type) {
    case 'bar':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart {...commonProps}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="oklch(0.20 0.05 200 / 0.3)" 
              strokeWidth={1}
            />
            <XAxis 
              dataKey="name" 
              stroke="oklch(0.60 0.05 200)"
              tick={{ fill: 'oklch(0.60 0.05 200)', fontSize: 11, fontFamily: 'var(--font-body)' }}
            />
            <YAxis 
              stroke="oklch(0.60 0.05 200)"
              tick={{ fill: 'oklch(0.60 0.05 200)', fontSize: 11, fontFamily: 'var(--font-body)' }}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'oklch(0.10 0.05 200 / 0.95)', 
                border: '1px solid oklch(0.40 0.05 200)',
                borderRadius: '8px',
                fontFamily: 'var(--font-body)',
                boxShadow: 'var(--shadow-md)',
              }} 
            />
            <Legend 
              wrapperStyle={{ fontFamily: 'var(--font-manrope)' }}
            />
            <Bar dataKey="value" fill="oklch(0.75 0.20 200)" />
          </BarChart>
        </ResponsiveContainer>
      );
    case 'line':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart {...commonProps}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="oklch(0.20 0.05 200 / 0.3)" 
              strokeWidth={1}
            />
            <XAxis 
              dataKey="name" 
              stroke="oklch(0.60 0.05 200)"
              tick={{ fill: 'oklch(0.60 0.05 200)', fontSize: 11, fontFamily: 'var(--font-body)' }}
            />
            <YAxis 
              stroke="oklch(0.60 0.05 200)"
              tick={{ fill: 'oklch(0.60 0.05 200)', fontSize: 11, fontFamily: 'var(--font-body)' }}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'oklch(0.10 0.05 200 / 0.95)', 
                border: '1px solid oklch(0.40 0.05 200)',
                borderRadius: '8px',
                fontFamily: 'var(--font-body)',
                boxShadow: 'var(--shadow-md)',
              }} 
            />
            <Legend 
              wrapperStyle={{ fontFamily: 'var(--font-manrope)' }}
            />
            <Line type="monotone" dataKey="value" stroke="oklch(0.75 0.20 200)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      );
    case 'pie':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="oklch(0.75 0.20 200)"
              dataKey="value"
            >
              {chartData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    default:
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart {...commonProps}>
            <Line type="monotone" dataKey="value" stroke="oklch(0.75 0.20 200)" />
          </LineChart>
        </ResponsiveContainer>
      );
  }
}

