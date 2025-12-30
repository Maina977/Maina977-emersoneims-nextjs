'use client';

import React from 'react';
import Head from 'next/head';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  openGraph?: {
    type?: string;
    locale?: string;
    url?: string;
    siteName?: string;
    images?: Array<{
      url: string;
      width: number;
      height: number;
      alt: string;
    }>;
  };
}

export default function SEOHead({ title, description, canonical, openGraph }: SEOHeadProps) {
  return null; // Next.js 16 uses Metadata API in layout instead
}
