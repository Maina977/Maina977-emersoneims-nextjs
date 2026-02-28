/**
 * Security Module - Central Export
 *
 * COPYRIGHT NOTICE:
 * Copyright (c) 2024-2026 Generator Oracle. All Rights Reserved.
 * Unauthorized reproduction or distribution is strictly prohibited.
 */

// Code protection utilities
export {
  BUILD_INTEGRITY,
  LICENSED_DOMAINS,
  SCRAPER_PATTERNS,
  SECURITY_METADATA,
  generateDeviceFingerprint,
  detectScrapingAttempt,
  verifyDomain,
  checkRateLimit,
  verifyContentIntegrity,
  detectDebugger,
  protectConsole,
  disableRightClick,
  disableTextSelection,
  blockCopyShortcuts,
  initializeProtection,
} from './code-protection';

// Malware protection utilities
export {
  MALWARE_PATTERNS,
  SECURITY_HEADERS,
  SECURITY_CONFIG,
  sanitizeInput,
  containsMaliciousPatterns,
  validateFileUpload,
  generateSecurityToken,
  verifyCSRFToken,
  trackIPActivity,
  isIPBlocked,
  validateHoneypot,
  validateRequestTiming,
  generateCSPNonce,
} from './malware-protection';

// Copyright watermark
export const COPYRIGHT_NOTICE = `
================================================================================
  GENERATOR ORACLE - PROPRIETARY SOFTWARE
  Copyright (c) 2024-2026 All Rights Reserved

  This software is protected by copyright law and international treaties.
  Unauthorized reproduction, distribution, reverse engineering, or use
  of this software or any portion thereof is strictly prohibited and
  may result in severe civil and criminal penalties.

  Licensed for use only on authorized domains.
  Build ID: ${process.env.NEXT_PUBLIC_BUILD_ID || 'development'}
================================================================================
`;

// Log copyright notice on module load (server-side)
if (typeof window === 'undefined') {
  console.log(COPYRIGHT_NOTICE);
}
