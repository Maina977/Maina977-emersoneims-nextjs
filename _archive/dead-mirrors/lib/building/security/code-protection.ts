/**
 * Code Protection & Anti-Copy Security Module
 *
 * COPYRIGHT NOTICE:
 * This file and all associated code is protected by copyright law.
 * Copyright (c) 2024-2026 Generator Oracle. All Rights Reserved.
 * Unauthorized reproduction, distribution, or use is strictly prohibited.
 */

// Build integrity hash - regenerated on each build
export const BUILD_INTEGRITY = {
  version: '3.0.0',
  buildId: process.env.NEXT_PUBLIC_BUILD_ID || 'development',
  timestamp: process.env.NEXT_PUBLIC_BUILD_TIMESTAMP || new Date().toISOString(),
  checksum: process.env.NEXT_PUBLIC_BUILD_CHECKSUM || 'dev-checksum',
};

// Licensed domains - only these domains can run the application
export const LICENSED_DOMAINS = [
  'localhost',
  '127.0.0.1',
  'generatororacle.com',
  'www.generatororacle.com',
  'app.generatororacle.com',
  'generator-oracle.vercel.app',
  'eaikirafiki-technologies.vercel.app',
  // Add your production domains here
];

// Anti-copy detection patterns
export const SCRAPER_PATTERNS = [
  /wget/i,
  /curl/i,
  /httrack/i,
  /scrapy/i,
  /python-requests/i,
  /phantomjs/i,
  /selenium/i,
  /puppeteer/i,
  /playwright/i,
  /headless/i,
  /bot/i,
  /crawler/i,
  /spider/i,
  /scraper/i,
  /copybot/i,
  /harvest/i,
  /offline/i,
  /teleport/i,
  /webcopy/i,
  /sitecopy/i,
  /website-copier/i,
];

// Fingerprinting for device identification
export function generateDeviceFingerprint(): string {
  if (typeof window === 'undefined') return 'server';

  const components = [
    navigator.userAgent,
    navigator.language,
    new Date().getTimezoneOffset().toString(),
    screen.width.toString(),
    screen.height.toString(),
    screen.colorDepth.toString(),
    navigator.hardwareConcurrency?.toString() || 'unknown',
  ];

  return btoa(components.join('|')).substring(0, 32);
}

// Detect potential scraping attempts
export function detectScrapingAttempt(userAgent: string): boolean {
  return SCRAPER_PATTERNS.some(pattern => pattern.test(userAgent));
}

// Verify domain authorization
export function verifyDomain(hostname: string): boolean {
  // Allow localhost and development
  if (process.env.NODE_ENV === 'development') return true;

  // Check against licensed domains
  return LICENSED_DOMAINS.some(domain =>
    hostname === domain || hostname.endsWith(`.${domain}`)
  );
}

// Rate limiting tracker (per session)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(identifier: string, limit: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = requestCounts.get(identifier);

  if (!record || now > record.resetTime) {
    requestCounts.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

// Content integrity verification
export function verifyContentIntegrity(content: string, expectedHash: string): boolean {
  // Simple hash verification - in production, use crypto module
  const hash = btoa(content.substring(0, 100)).substring(0, 16);
  return hash === expectedHash;
}

// Anti-debugging detection
export function detectDebugger(): boolean {
  if (typeof window === 'undefined') return false;

  const start = performance.now();
  // eslint-disable-next-line no-debugger
  debugger;
  const end = performance.now();

  // If debugger paused execution, time difference will be significant
  return end - start > 100;
}

// Console protection (production only)
export function protectConsole(): void {
  if (typeof window === 'undefined') return;
  if (process.env.NODE_ENV === 'development') return;

  const noop = () => {};
  const methods = ['log', 'debug', 'info', 'warn', 'error', 'table', 'trace'];

  methods.forEach(method => {
    (console as any)[method] = noop;
  });
}

// Right-click protection (optional, can be disabled)
export function disableRightClick(): void {
  if (typeof window === 'undefined') return;

  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });
}

// Text selection protection (optional)
export function disableTextSelection(): void {
  if (typeof window === 'undefined') return;

  const style = document.createElement('style');
  style.textContent = `
    .protected-content {
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
  `;
  document.head.appendChild(style);
}

// Keyboard shortcut blocking (Ctrl+S, Ctrl+U, etc.)
export function blockCopyShortcuts(): void {
  if (typeof window === 'undefined') return;
  if (process.env.NODE_ENV === 'development') return;

  document.addEventListener('keydown', (e) => {
    // Block Ctrl+S (save), Ctrl+U (view source), Ctrl+Shift+I (dev tools)
    if (e.ctrlKey && (e.key === 's' || e.key === 'u')) {
      e.preventDefault();
      return false;
    }
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
      e.preventDefault();
      return false;
    }
    // Block F12 (dev tools)
    if (e.key === 'F12') {
      e.preventDefault();
      return false;
    }
  });
}

// Initialize all protections
export function initializeProtection(options: {
  disableRightClick?: boolean;
  disableTextSelection?: boolean;
  blockShortcuts?: boolean;
  protectConsole?: boolean;
} = {}): void {
  if (typeof window === 'undefined') return;

  // Only apply in production
  if (process.env.NODE_ENV !== 'production') return;

  if (options.disableRightClick) disableRightClick();
  if (options.disableTextSelection) disableTextSelection();
  if (options.blockShortcuts) blockCopyShortcuts();
  if (options.protectConsole) protectConsole();

  // Add watermark to console
  console.log('%c⚠️ PROTECTED SOFTWARE', 'color: red; font-size: 24px; font-weight: bold;');
  console.log('%cThis application is protected by copyright law.', 'color: orange; font-size: 14px;');
  console.log('%cUnauthorized copying or reverse engineering is prohibited.', 'color: orange; font-size: 14px;');
  console.log('%c© 2024-2026 Generator Oracle. All Rights Reserved.', 'color: gray; font-size: 12px;');
}

// Export security metadata
export const SECURITY_METADATA = {
  copyrightHolder: 'Generator Oracle',
  copyrightYear: '2024-2026',
  licenseType: 'Proprietary',
  protectionLevel: 'Enterprise',
  contactEmail: 'legal@generatororacle.com',
};
