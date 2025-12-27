'use client';

/**
 * OPEN GRAPH OPTIMIZATION
 * Dynamic Open Graph meta tags
 * Note: In App Router, use metadata API in layout.tsx instead
 */

import { useEffect } from 'react';

interface OpenGraphProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
}

export default function OpenGraph({
  title,
  description,
  image = '/og-image.jpg',
  url,
  type = 'website',
}: OpenGraphProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://emersoneims.com';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

  useEffect(() => {
    // Update meta tags dynamically
    const updateMetaTag = (property: string, content: string, isProperty = true) => {
      const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`;
      let meta = document.querySelector(selector);
      
      if (!meta) {
        meta = document.createElement('meta');
        if (isProperty) {
          meta.setAttribute('property', property);
        } else {
          meta.setAttribute('name', property);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Open Graph
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:image', fullImage);
    updateMetaTag('og:url', fullUrl);
    updateMetaTag('og:type', type);
    updateMetaTag('og:site_name', 'Emerson EiMS');
    updateMetaTag('og:locale', 'en_US');
    updateMetaTag('og:image:width', '1200');
    updateMetaTag('og:image:height', '630');
    
    // Twitter Card
    updateMetaTag('twitter:card', 'summary_large_image', false);
    updateMetaTag('twitter:title', title, false);
    updateMetaTag('twitter:description', description, false);
    updateMetaTag('twitter:image', fullImage, false);
  }, [title, description, fullImage, fullUrl, type]);

  return null;
}

