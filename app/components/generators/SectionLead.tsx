'use client';

import React from 'react';

interface SectionLeadProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

/**
 * SectionLead - Premium section header component
 * Used for generators, solutions, and other major sections
 */
export default function SectionLead({ title, subtitle, centered = false }: SectionLeadProps) {
  return (
    <section className={`py-16 px-4 ${centered ? 'text-center' : ''}`}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl" style={{ marginLeft: centered ? 'auto' : '0', marginRight: centered ? 'auto' : '0' }}>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}















