'use client';

import React from "react";

/**
 * SEOHead - Note: In Next.js App Router, metadata should be exported from layout.tsx
 * This component is kept for compatibility but metadata should be handled via layout.tsx
 * 
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string} props.keywords - SEO keywords (required)
 * @param {string} [props.canonical] - Canonical URL
 * @param {Object} [props.openGraph] - Open Graph metadata
 */
export default function SEOHead({ title, description, keywords, canonical, openGraph }) {
  // In App Router, we don't render <title> or <meta> directly
  // This component is a no-op for App Router compatibility
  // Actual SEO is handled via metadata export in app/contact/layout.tsx
  
  // Validate required props for TypeScript/development
  if (!keywords) {
    console.warn('SEOHead: keywords prop is required but was not provided');
  }
  
  return null;
}
