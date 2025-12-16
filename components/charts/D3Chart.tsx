'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface D3ChartProps {
  type: string;
  data: any;
  options?: any;
  className?: string;
}

export default function D3Chart({ type, data, options, className }: D3ChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };

    svg.attr('width', width).attr('height', height);

    const xScale = d3
      .scaleBand()
      .domain(data.labels || [])
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const maxValue = d3.max(data.datasets?.[0]?.data || []) as number | undefined;
    const yScale = d3
      .scaleLinear()
      .domain([0, maxValue || 100])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Add axes
    // Add subtle gridlines
    svg
      .append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickSize(-(height - margin.top - margin.bottom))
          .tickFormat(() => '')
      )
      .selectAll('line')
      .style('stroke', 'oklch(0.20 0.05 200 / 0.3)')
      .style('stroke-width', 1);

    svg
      .append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(${margin.left},0)`)
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-(width - margin.left - margin.right))
          .tickFormat(() => '')
      )
      .selectAll('line')
      .style('stroke', 'oklch(0.20 0.05 200 / 0.3)')
      .style('stroke-width', 1);

    // Add axes
    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('fill', 'oklch(0.60 0.05 200)')
      .style('font-family', 'var(--font-body), sans-serif')
      .style('font-size', '11px');

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(
        d3
          .axisLeft(yScale)
          .tickFormat((d) => (typeof d === 'number' ? d.toLocaleString() : String(d)))
      )
      .selectAll('text')
      .style('fill', 'oklch(0.60 0.05 200)')
      .style('font-family', 'var(--font-body), sans-serif')
      .style('font-size', '11px')
      .style('font-variant-numeric', 'tabular-nums');

    // Add bars or lines
    const chartData = (data.datasets?.[0]?.data || []) as number[];
    
    if (type === 'bar') {
      svg
        .selectAll('.bar')
        .data(chartData)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', (d, i) => xScale(data.labels?.[i] || '') || 0)
        .attr('y', (d) => yScale(d as number))
        .attr('width', xScale.bandwidth())
        .attr('height', (d) => height - margin.bottom - yScale(d as number))
        .attr('fill', 'oklch(0.75 0.20 200)')
        .attr('rx', 4);
    } else {
      const line = d3
        .line<number>()
        .x((d, i) => (xScale(data.labels?.[i] || '') || 0) + xScale.bandwidth() / 2)
        .y((d) => yScale(d))
        .curve(d3.curveMonotoneX);

      svg
        .append('path')
        .datum(chartData)
        .attr('fill', 'none')
        .attr('stroke', 'oklch(0.75 0.20 200)')
        .attr('stroke-width', 2)
        .attr('d', line);
    }
  }, [type, data, options]);

  return <svg ref={svgRef} className={className} />;
}

