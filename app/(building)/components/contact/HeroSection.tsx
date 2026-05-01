'use client';

import React from 'react';

interface HeroSectionProps {
  performanceTier?: string;
}

export default function HeroSection({ performanceTier }: HeroSectionProps) {
  return (
    <section className="hero-section">
      <h1>Contact EmersonEIMS</h1>
      <p>Reliable Power. Without Limits.</p>
    </section>
  );
}
