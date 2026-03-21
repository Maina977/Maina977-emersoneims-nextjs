'use client';

/**
 * LicenseGate - Generator Oracle Access Component
 *
 * FULL ACCESS - No restrictions, no licensing required.
 * Generator Oracle is a free tool by EmersonEIMS to establish
 * engineering authority and generate leads.
 *
 * This component simply renders its children with no gating.
 */

import { ReactNode } from 'react';

interface LicenseGateProps {
  children: ReactNode;
}

export default function LicenseGate({ children }: LicenseGateProps) {
  // Full access - no restrictions
  // Generator Oracle is a lead generation tool, not a paid product
  return <>{children}</>;
}
