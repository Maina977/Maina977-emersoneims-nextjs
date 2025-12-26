// components/diagnostics/DiagnosticChart.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface DiagnosticChartProps {
  data: ChartData[];
  type: 'bar' | 'line' | 'pie';
  width?: number;
  height?: number;
  title?: string;
  showExport?: boolean;
  voiceEnabled?: boolean;
}

export default function DiagnosticChart({
  data,
  type,
  width = 400,
  height = 300,
  title,
  showExport = true,
  voiceEnabled = true
}: DiagnosticChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const margin = { top: 40, right: 30, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Color scale
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    if (type === 'bar') {
      // Bar chart
      const x = d3.scaleBand()
        .domain(data.map(d => d.label))
        .range([0, innerWidth])
        .padding(0.1);

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value) || 0])
        .nice()
        .range([innerHeight, 0]);

      // X axis
      g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em');

      // Y axis
      g.append('g')
        .call(d3.axisLeft(y));

      // Bars
      g.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.label) || 0)
        .attr('y', d => y(d.value))
        .attr('width', x.bandwidth())
        .attr('height', d => innerHeight - y(d.value))
        .attr('fill', (d, i) => d.color || colorScale(i.toString()))
        .attr('rx', 4)
        .on('mouseover', function(event, d) {
          d3.select(this).attr('opacity', 0.8);

          // Tooltip
          const tooltip = svg.append('g')
            .attr('class', 'tooltip')
            .attr('transform', `translate(${event.offsetX - margin.left + 10}, ${event.offsetY - margin.top - 10})`);

          tooltip.append('rect')
            .attr('width', 80)
            .attr('height', 30)
            .attr('fill', 'rgba(0,0,0,0.8)')
            .attr('rx', 4);

          tooltip.append('text')
            .attr('x', 40)
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .style('font-size', '12px')
            .text(`${d.label}: ${d.value}`);
        })
        .on('mouseout', function() {
          d3.select(this).attr('opacity', 1);
          svg.select('.tooltip').remove();
        });

    } else if (type === 'line') {
      // Line chart
      const x = d3.scalePoint()
        .domain(data.map(d => d.label))
        .range([0, innerWidth]);

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value) || 0])
        .nice()
        .range([innerHeight, 0]);

      // X axis
      g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x));

      // Y axis
      g.append('g')
        .call(d3.axisLeft(y));

      // Line
      const line = d3.line<ChartData>()
        .x(d => x(d.label) || 0)
        .y(d => y(d.value))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#2563eb')
        .attr('stroke-width', 3)
        .attr('d', line);

      // Dots
      g.selectAll('.dot')
        .data(data)
        .enter().append('circle')
        .attr('class', 'dot')
        .attr('cx', d => x(d.label) || 0)
        .attr('cy', d => y(d.value))
        .attr('r', 5)
        .attr('fill', '#2563eb');

    } else if (type === 'pie') {
      // Pie chart
      const radius = Math.min(innerWidth, innerHeight) / 2;

      const pie = d3.pie<ChartData>()
        .value(d => d.value)
        .sort(null);

      const arc = d3.arc<d3.PieArcDatum<ChartData>>()
        .innerRadius(0)
        .outerRadius(radius);

      const arcs = g.selectAll('.arc')
        .data(pie(data))
        .enter().append('g')
        .attr('class', 'arc')
        .attr('transform', `translate(${innerWidth / 2},${innerHeight / 2})`);

      arcs.append('path')
        .attr('d', arc)
        .attr('fill', (d, i) => d.data.color || colorScale(i.toString()))
        .attr('stroke', 'white')
        .style('stroke-width', '2px');

      // Labels
      arcs.append('text')
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('fill', 'white')
        .style('font-weight', 'bold')
        .text(d => `${d.data.label}: ${d.data.value}`);
    }

    // Title
    if (title) {
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .text(title);
    }

  }, [data, type, width, height, title]);

  const handleExport = () => {
    if (!svgRef.current) return;

    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `${title || 'chart'}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  const handleVoiceNarration = () => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;

    const utterance = new SpeechSynthesisUtterance();
    utterance.text = `${title || 'Chart'}. ${data.map(d => `${d.label}: ${d.value}`).join('. ')}`;
    utterance.rate = 0.8;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="diagnostic-chart">
      <svg ref={svgRef} className="w-full h-auto border border-gray-200 rounded-lg"></svg>

      {(showExport || voiceEnabled) && (
        <div className="flex gap-2 mt-4">
          {showExport && (
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Export SVG
            </button>
          )}
          {voiceEnabled && (
            <button
              onClick={handleVoiceNarration}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              🔊 Narrate
            </button>
          )}
        </div>
      )}
    </div>
  );
}