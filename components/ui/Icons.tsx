'use client';

import React from 'react';

interface IconProps {
  reducedMotion?: boolean;
  className?: string;
}

export function EngineIcon({ reducedMotion = false, className = '' }: IconProps) {
  return (
    <svg
      className={className}
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M24 8L28 12H32V16H36V20H40V28H36V32H32V36H28L24 40L20 36H16V32H12V28H8V20H12V16H16V12H20L24 8Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="24" r="4" fill="currentColor" opacity="0.8" />
      <path
        d="M20 20L24 24L28 20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}

export function SolarIcon({ reducedMotion = false, className = '' }: IconProps) {
  return (
    <svg
      className={className}
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="12" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="24" cy="24" r="6" fill="currentColor" opacity="0.8" />
      <path
        d="M24 4V8M24 40V44M44 24H40M8 24H4M38.34 9.66L35.76 12.24M12.24 35.76L9.66 38.34M38.34 38.34L35.76 35.76M12.24 12.24L9.66 9.66"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function UPSIcon({ reducedMotion = false, className = '' }: IconProps) {
  return (
    <svg
      className={className}
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="12" y="10" width="24" height="32" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="16" y="14" width="16" height="20" rx="1" fill="currentColor" opacity="0.2" />
      <path
        d="M20 20H28M20 24H28M20 28H26"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M18 6L24 2L30 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M24 42V38"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

