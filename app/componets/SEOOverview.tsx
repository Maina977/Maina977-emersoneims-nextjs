'use client';

import React from "react";

export default function SEOOverview() {
  return (
    <section aria-labelledby="overview-heading" className="py-24 px-4 bg-black">
      <div className="max-w-5xl mx-auto">
        <h2 id="overview-heading" className="text-3xl md:text-4xl font-black tracking-tight text-white mb-6">
          Technical Overview
        </h2>
        <p className="text-gray-300 mb-4">
          EmersonEIMS delivers end‑to‑end power engineering across generator sales (Cummins focus), solar energy solutions,
          high‑voltage infrastructure, UPS and AC systems, motor rewinding, generator spare parts, and precision fabrication:
          canopies, distribution boards, changeover enclosures, exhausts, automated fuel reservoir tanks, hammer mills,
          borehole pumps, and incinerators repair and automation. Controls expertise spans DeepSea and PowerWizard, bringing
          telemetry, auto‑diagnostics, and smart load orchestration to mission‑critical sites.
        </p>
        <p className="text-gray-400">
          From design and sizing to installation, commissioning, and lifecycle support, we combine technical rigor with
          conversion‑focused digital tools: calculators, charts, and diagnostics demos. Engineered in Nairobi — trusted across Kenya and beyond.
        </p>
      </div>
    </section>
  );
}
