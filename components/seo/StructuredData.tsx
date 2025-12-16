'use client';

/**
 * STRUCTURED DATA (Schema.org)
 * JSON-LD structured data for SEO
 */

import { useEffect } from 'react';

interface StructuredDataProps {
  type: 'Organization' | 'Product' | 'Service' | 'WebSite' | 'BreadcrumbList';
  data: Record<string, any>;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': type,
      ...data,
    };
    
    script.text = JSON.stringify(structuredData);
    script.id = `structured-data-${type.toLowerCase()}`;
    
    // Remove existing script if present
    const existing = document.getElementById(script.id);
    if (existing) {
      existing.remove();
    }
    
    document.head.appendChild(script);
    
    return () => {
      const scriptToRemove = document.getElementById(script.id);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [type, data]);

  return null;
}


