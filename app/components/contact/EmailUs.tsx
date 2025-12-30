'use client';

import React from 'react';

interface EmailUsProps {
  performanceTier?: string;
}

export default function EmailUs({ performanceTier }: EmailUsProps) {
  return (
    <div className="contact-method">
      <h3>Email Us</h3>
      <p>info@emersoneims.com</p>
    </div>
  );
}
