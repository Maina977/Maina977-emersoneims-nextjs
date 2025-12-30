'use client';

import React from 'react';

interface CountiesGridProps {
  performanceTier?: string;
}

export default function CountiesGrid({ performanceTier }: CountiesGridProps) {
  return (
    <section className="counties-grid">
      <h3>47 Counties Served</h3>
    </section>
  );
}
