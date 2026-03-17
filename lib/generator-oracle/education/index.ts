/**
 * Generator Oracle - Comprehensive Educational Content Index
 *
 * EMERSON EIMS PROPRIETARY CONTENT
 * All content original, rephrased in unique wording
 * SEO optimized for Kenya and East Africa markets
 * Integrated with 400,000+ fault code database
 */

// Import all category content
import { ECM_CONTENT, ECM_CONTENT_COUNT } from './ecm-content';
import { CONTROLLER_CONTENT, CONTROLLER_CONTENT_COUNT } from './controller-content';
import { SENSORS_CONTENT, SENSORS_CONTENT_COUNT } from './sensors-content';
import { FUEL_SYSTEM_CONTENT, FUEL_SYSTEM_CONTENT_COUNT } from './fuel-system-content';
import { COOLING_CONTENT, COOLING_CONTENT_COUNT } from './cooling-content';
import { AVR_CONTENT, AVR_CONTENT_COUNT } from './avr-content';
import { ACTUATOR_CONTENT, ACTUATOR_CONTENT_COUNT } from './actuator-content';
import { ENGINE_CONTENT, ENGINE_CONTENT_COUNT } from './engine-content';
import { ELECTRICAL_CONTENT, ELECTRICAL_CONTENT_COUNT } from './electrical-content';
import { INJECTOR_NOZZLE_CONTENT, INJECTOR_NOZZLE_CONTENT_COUNT } from './injector-nozzle-content';
import { INJECTOR_PUMP_CONTENT, INJECTOR_PUMP_CONTENT_COUNT } from './injector-pump-content';
import { ALTERNATOR_CONTENT, ALTERNATOR_CONTENT_COUNT } from './alternator-content';
import { TURBO_CONTENT, TURBO_CONTENT_COUNT } from './turbo-content';
import { SAFETY_CONTENT, SAFETY_CONTENT_COUNT } from './safety-content';
import { PARALLEL_CONTENT, PARALLEL_CONTENT_COUNT } from './parallel-content';
import { STARTER_CONTENT, STARTER_CONTENT_COUNT } from './starter-content';
import { MPU_CONTENT, MPU_CONTENT_COUNT } from './mpu-content';
import { LUBRICATION_CONTENT, LUBRICATION_CONTENT_COUNT } from './lubrication-content';
import { EXHAUST_CONTENT, EXHAUST_CONTENT_COUNT } from './exhaust-content';
import { LOAD_MANAGEMENT_CONTENT, LOAD_MANAGEMENT_CONTENT_COUNT } from './load-management-content';

import { EducationalContent, EducationCategory, SkillLevel, ContentType, CategoryMeta, EDUCATION_CATEGORIES } from '../comprehensiveEducation';

// ═══════════════════════════════════════════════════════════════════════════════
// COMBINED CONTENT DATABASE
// ═══════════════════════════════════════════════════════════════════════════════

export const ALL_EDUCATIONAL_CONTENT: EducationalContent[] = [
  ...ECM_CONTENT,
  ...CONTROLLER_CONTENT,
  ...SENSORS_CONTENT,
  ...FUEL_SYSTEM_CONTENT,
  ...COOLING_CONTENT,
  ...AVR_CONTENT,
  ...ACTUATOR_CONTENT,
  ...ENGINE_CONTENT,
  ...ELECTRICAL_CONTENT,
  ...INJECTOR_NOZZLE_CONTENT,
  ...INJECTOR_PUMP_CONTENT,
  ...ALTERNATOR_CONTENT,
  ...TURBO_CONTENT,
  ...SAFETY_CONTENT,
  ...PARALLEL_CONTENT,
  ...STARTER_CONTENT,
  ...MPU_CONTENT,
  ...LUBRICATION_CONTENT,
  ...EXHAUST_CONTENT,
  ...LOAD_MANAGEMENT_CONTENT,
];

// ═══════════════════════════════════════════════════════════════════════════════
// CONTENT STATISTICS
// ═══════════════════════════════════════════════════════════════════════════════

export const CONTENT_STATISTICS = {
  totalArticles: ALL_EDUCATIONAL_CONTENT.length,
  byCategory: {
    ecm: ECM_CONTENT_COUNT,
    controller: CONTROLLER_CONTENT_COUNT,
    sensors: SENSORS_CONTENT_COUNT,
    fuel_system: FUEL_SYSTEM_CONTENT_COUNT,
    cooling: COOLING_CONTENT_COUNT,
    avr: AVR_CONTENT_COUNT,
    actuator: ACTUATOR_CONTENT_COUNT,
    engine: ENGINE_CONTENT_COUNT,
    electrical: ELECTRICAL_CONTENT_COUNT,
    injector_nozzle: INJECTOR_NOZZLE_CONTENT_COUNT,
    injector_pump: INJECTOR_PUMP_CONTENT_COUNT,
    alternator: ALTERNATOR_CONTENT_COUNT,
    turbocharger: TURBO_CONTENT_COUNT,
    safety_systems: SAFETY_CONTENT_COUNT,
    parallel_operation: PARALLEL_CONTENT_COUNT,
    starter_system: STARTER_CONTENT_COUNT,
    mpu: MPU_CONTENT_COUNT,
    lubrication: LUBRICATION_CONTENT_COUNT,
    exhaust: EXHAUST_CONTENT_COUNT,
    load_management: LOAD_MANAGEMENT_CONTENT_COUNT,
  },
  lastUpdated: new Date().toISOString().split('T')[0],
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONTENT QUERY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get all content for a specific category
 */
export function getContentByCategory(category: EducationCategory): EducationalContent[] {
  return ALL_EDUCATIONAL_CONTENT.filter(c => c.category === category);
}

/**
 * Get content by skill level
 */
export function getContentBySkillLevel(level: SkillLevel): EducationalContent[] {
  return ALL_EDUCATIONAL_CONTENT.filter(c => c.skillLevel === level);
}

/**
 * Get content by type (theory, diagnostic, repair, etc.)
 */
export function getContentByType(type: ContentType): EducationalContent[] {
  return ALL_EDUCATIONAL_CONTENT.filter(c => c.contentType === type);
}

/**
 * Search content by keyword (for search functionality)
 */
export function searchContent(query: string): EducationalContent[] {
  const lowerQuery = query.toLowerCase();
  return ALL_EDUCATIONAL_CONTENT.filter(content =>
    content.keywords.some(kw => kw.toLowerCase().includes(lowerQuery)) ||
    content.title.toLowerCase().includes(lowerQuery) ||
    content.summary.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get content by URL slug (for dynamic pages)
 */
export function getContentBySlug(slug: string): EducationalContent | undefined {
  return ALL_EDUCATIONAL_CONTENT.find(c => c.slug === slug);
}

/**
 * Get content by ID
 */
export function getContentById(id: string): EducationalContent | undefined {
  return ALL_EDUCATIONAL_CONTENT.find(c => c.id === id);
}

/**
 * Get related content for an article
 */
export function getRelatedContent(contentId: string): EducationalContent[] {
  const content = getContentById(contentId);
  if (!content) return [];

  return content.relatedContent
    .map(id => getContentById(id))
    .filter((c): c is EducationalContent => c !== undefined);
}

/**
 * Get content linked to a specific fault code
 */
export function getContentByFaultCode(faultCode: string): EducationalContent[] {
  const normalizedFault = faultCode.toLowerCase();
  return ALL_EDUCATIONAL_CONTENT.filter(content =>
    content.relatedFaultCodes.some(fc => fc.toLowerCase().includes(normalizedFault))
  );
}

/**
 * Get all slugs for static site generation
 */
export function getAllSlugs(): string[] {
  return ALL_EDUCATIONAL_CONTENT.map(c => c.slug);
}

/**
 * Get all slugs for a category (for category pages)
 */
export function getCategorySlugs(category: EducationCategory): string[] {
  return getContentByCategory(category).map(c => c.slug);
}

/**
 * Get featured content (high-traffic topics)
 */
export function getFeaturedContent(limit: number = 10): EducationalContent[] {
  // Return first articles from key categories
  const featured: EducationalContent[] = [];
  const categories: EducationCategory[] = ['ecm', 'controller', 'avr', 'fuel_system', 'sensors'];

  for (const cat of categories) {
    const catContent = getContentByCategory(cat);
    if (catContent.length > 0) {
      featured.push(catContent[0]);
      if (catContent.length > 1) featured.push(catContent[1]);
    }
    if (featured.length >= limit) break;
  }

  return featured.slice(0, limit);
}

/**
 * Get beginner-friendly content
 */
export function getBeginnerContent(limit: number = 20): EducationalContent[] {
  return ALL_EDUCATIONAL_CONTENT
    .filter(c => c.skillLevel === 'beginner')
    .slice(0, limit);
}

/**
 * Get category metadata with content counts
 */
export function getCategoryMetadata(): CategoryMeta[] {
  return EDUCATION_CATEGORIES.map(cat => ({
    ...cat,
    contentCount: getContentByCategory(cat.id).length
  }));
}

/**
 * Get total reading time for a category (in minutes)
 */
export function getCategoryReadTime(category: EducationCategory): number {
  return getContentByCategory(category)
    .reduce((sum, c) => sum + c.estimatedReadTime, 0);
}

// ═══════════════════════════════════════════════════════════════════════════════
// SEO UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get all keywords for sitemap/SEO
 */
export function getAllKeywords(): string[] {
  const keywords = new Set<string>();
  ALL_EDUCATIONAL_CONTENT.forEach(content => {
    content.keywords.forEach(kw => keywords.add(kw));
  });
  return Array.from(keywords);
}

/**
 * Get Kenya-specific keywords
 */
export function getKenyaKeywords(): string[] {
  return getAllKeywords().filter(kw =>
    kw.toLowerCase().includes('kenya') ||
    kw.toLowerCase().includes('nairobi') ||
    kw.toLowerCase().includes('mombasa')
  );
}

/**
 * Generate sitemap entries for educational content
 */
export function getSitemapEntries(): Array<{ url: string; priority: number; changefreq: string }> {
  return ALL_EDUCATIONAL_CONTENT.map(content => ({
    url: `/education/${content.slug}`,
    priority: content.skillLevel === 'beginner' ? 0.8 : 0.7,
    changefreq: 'monthly'
  }));
}

// Export individual category content for direct access
export {
  ECM_CONTENT,
  CONTROLLER_CONTENT,
  SENSORS_CONTENT,
  FUEL_SYSTEM_CONTENT,
};

// Export types
export type { EducationalContent, EducationCategory, SkillLevel, ContentType, CategoryMeta };
