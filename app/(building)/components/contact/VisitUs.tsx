'use client';

import React from 'react';

interface VisitUsProps {
  performanceTier?: string;
}

export default function VisitUs({ performanceTier }: VisitUsProps) {
  return (
    <div className="contact-method">
      <h3>Visit Us</h3>
      <p>Nairobi, Kenya</p>
    </div>
  );
}
