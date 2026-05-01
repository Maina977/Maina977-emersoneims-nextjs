'use client';

import React from 'react';

interface CallUsProps {
  performanceTier?: string;
}

export default function CallUs({ performanceTier }: CallUsProps) {
  return (
    <div className="contact-method">
      <h3>Call Us</h3>
      <p>+254 (0)20 1234567</p>
    </div>
  );
}
