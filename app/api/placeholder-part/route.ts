/**
 * Dynamic Part Placeholder Image Generator
 * Generates professional placeholder images for spare parts
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name') || 'Part';
  const brand = searchParams.get('brand') || 'Generic';
  const partNo = searchParams.get('partNo') || 'N/A';

  // Generate SVG placeholder with part info
  const svg = `
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#00d4ff;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0066ff;stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="400" height="400" fill="url(#bg)"/>

      <!-- Grid pattern -->
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#ffffff" stroke-width="0.5" opacity="0.05"/>
      </pattern>
      <rect width="400" height="400" fill="url(#grid)"/>

      <!-- Part icon -->
      <g transform="translate(150, 100)">
        <rect x="0" y="0" width="100" height="100" rx="10" fill="#0a4f6e" opacity="0.5"/>
        <path d="M50 20 L80 40 L80 70 L50 90 L20 70 L20 40 Z" fill="none" stroke="url(#accent)" stroke-width="2"/>
        <circle cx="50" cy="55" r="15" fill="none" stroke="#00d4ff" stroke-width="2"/>
        <line x1="50" y1="40" x2="50" y2="70" stroke="#00d4ff" stroke-width="2"/>
        <line x1="35" y1="55" x2="65" y2="55" stroke="#00d4ff" stroke-width="2"/>
      </g>

      <!-- Brand badge -->
      <rect x="20" y="20" rx="4" ry="4" width="auto" height="24" fill="#00d4ff" opacity="0.2"/>
      <text x="30" y="37" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#00d4ff">${escapeXml(brand.toUpperCase())}</text>

      <!-- Part number -->
      <text x="200" y="240" font-family="monospace" font-size="14" fill="#666" text-anchor="middle">${escapeXml(partNo)}</text>

      <!-- Part name (truncated) -->
      <text x="200" y="280" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#fff" text-anchor="middle">
        ${escapeXml(truncate(name, 30))}
      </text>

      <!-- Bottom accent line -->
      <rect x="50" y="380" width="300" height="3" rx="1.5" fill="url(#accent)" opacity="0.5"/>

      <!-- EmersonEIMS watermark -->
      <text x="200" y="360" font-family="Arial, sans-serif" font-size="10" fill="#444" text-anchor="middle">EMERSON EIMS - Genuine Parts</text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function truncate(str: string, maxLength: number): string {
  return str.length > maxLength ? str.substring(0, maxLength - 3) + '...' : str;
}
