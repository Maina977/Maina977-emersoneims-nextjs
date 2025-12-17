import React from 'react';

interface SectionLeadProps {
  title: string;
  subtitle: string;
  centered?: boolean;
}

export default function SectionLead({ title, subtitle, centered = false }: SectionLeadProps) {
  return (
    <div className={`${centered ? 'text-center' : ''}`}>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
        {title}
      </h2>
      <p className="mt-4 text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
        {subtitle}
      </p>
      <div className="mt-6 h-1 w-24 bg-gradient-to-r from-brand-gold to-transparent mx-auto"></div>
    </div>
  );
}