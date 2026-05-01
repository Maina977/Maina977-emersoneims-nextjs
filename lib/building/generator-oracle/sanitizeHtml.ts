/**
 * HTML Sanitization Utility for Generator Oracle
 * Prevents XSS attacks when rendering dynamic content
 * SSR-safe: returns unmodified content on server, sanitizes on client
 */

import type DOMPurifyType from 'dompurify';

// Configure DOMPurify to allow only safe tags and attributes
const ALLOWED_TAGS = ['strong', 'em', 'b', 'i', 'br', 'span', 'code', 'p', 'ul', 'ol', 'li'];
const ALLOWED_ATTR = ['class'];

// Lazy-loaded DOMPurify instance (client-side only)
let purifyInstance: typeof DOMPurifyType | null = null;

function getPurify(): typeof DOMPurifyType | null {
  if (typeof window === 'undefined') return null;
  if (!purifyInstance) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    purifyInstance = require('dompurify').default || require('dompurify');
  }
  return purifyInstance;
}

/**
 * Sanitize HTML content and apply markdown-like transformations
 * Safe for use with dangerouslySetInnerHTML
 */
export function sanitizeAndFormatContent(content: string): string {
  if (!content) return '';

  // First apply markdown-like transformations
  const formatted = content
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
    .replace(/\n/g, '<br>')
    .replace(/^(\d+)\./gm, '<span class="text-cyan-400 font-bold">$1.</span>')
    .replace(/•/g, '<span class="text-cyan-400">•</span>')
    .replace(/\|(.+?)\|/g, '<code>$1</code>');

  // Sanitize on client, return formatted on server (SSR)
  const DOMPurify = getPurify();
  if (!DOMPurify) return formatted;

  return DOMPurify.sanitize(formatted, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
  });
}

/**
 * Sanitize instruction content with specific formatting
 */
export function sanitizeInstruction(content: string): string {
  if (!content) return '';

  const formatted = content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
    .replace(/\|(.+?)\|/g, '<code>$1</code>');

  // Sanitize on client, return formatted on server (SSR)
  const DOMPurify = getPurify();
  if (!DOMPurify) return formatted;

  return DOMPurify.sanitize(formatted, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
  });
}

/**
 * Sanitize plain HTML without transformations
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';

  // Sanitize on client, return as-is on server (SSR)
  const DOMPurify = getPurify();
  if (!DOMPurify) return html;

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
  });
}
