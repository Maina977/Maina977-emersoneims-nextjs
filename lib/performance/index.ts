/**
 * Performance Optimization Library - Index
 *
 * Centralized exports for all performance utilities
 *
 * © 2026 EmersonEIMS. All Rights Reserved.
 */

// Core performance utilities
export {
  PERFORMANCE_BUDGET,
  DEVICE_CATEGORIES,
  getDeviceCapabilities,
  getOptimalImageQuality,
  getOptimalImageSize,
  preloadCriticalResources,
  prefetchPages,
  deferExecution,
  createLazyLoadObserver,
  analyzeResourceTiming,
  addCleanableEventListener,
  throttle,
  debounce,
  isInViewport,
  generateSrcSet,
  generateSizes,
} from './ultraPerformance';

// Mobile-specific optimizations
export {
  CONNECTION_PROFILES,
  getConnectionProfile,
  isMobileDevice,
  isLowBattery,
  getOptimalViewport,
  enableFastTap,
  cleanupHiddenElements,
  enableSmoothScroll,
  preloadMobileCritical,
  loadFontsAdaptively,
  initMobileOptimizations,
  getMobileImageUrl,
} from './mobileOptimization';

export type { ConnectionType } from './mobileOptimization';
