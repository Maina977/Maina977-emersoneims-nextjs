/**
 * REPAIR CENTRE — article schema
 *
 * Implements the twelve-section technical article structure. The schema is
 * deliberately strict so that every published article carries the same
 * sections, and so a missing section is a type error rather than a silent gap.
 *
 * CONTENT DISCIPLINE (enforced by review, not by types)
 * ====================================================
 * - Every value that is model-specific must be stated as something to VERIFY
 *   against the manufacturer's documentation, never asserted as fact. The
 *   `verify` field on a diagnostic step exists for exactly this.
 * - Typical ranges are permitted where they are genuinely typical across the
 *   equipment class, and must be written as ranges with the instruction to
 *   confirm against the specific unit.
 * - Nothing is transcribed from a service manual. Descriptions, causes and
 *   procedures are written from engineering principle in our own words.
 * - Causes are ranked. Presenting every possible cause as equally likely is a
 *   failure of diagnosis, not thoroughness.
 * - No article promises a guaranteed outcome.
 */

export type Difficulty = 'basic' | 'intermediate' | 'advanced' | 'specialist';
export type Competence = 'operator' | 'technician' | 'qualified-electrician' | 'specialist-engineer';
export type SafetyClass = 'low-voltage-isolated' | 'live-electrical' | 'stored-energy' | 'rotating-machinery' | 'fuel-and-fire' | 'multiple-hazard';

export interface ArticleHeader {
  title: string;
  equipmentCategory: string;
  appliesTo: string;
  faultCode?: string;
  difficulty: Difficulty;
  diagnosisComplexity: string;
  competence: Competence;
  author: string;
  technicalReviewer: string;
  published: string;
  lastReviewed: string;
  electricalSystem: string;
  safetyClass: SafetyClass;
}

/** Ranked causes. Order within each list is most- to least-likely. */
export interface CauseGroups {
  mostLikely: string[];
  possible: string[];
  lessCommon: string[];
  modelSpecific: string[];
  environmental: string[];
  installation: string[];
  maintenance: string[];
  componentLevel: string[];
}

export interface SafetySection {
  isolation: string[];
  lockoutTagout: string[];
  ppe: string[];
  storedEnergy: string[];
  specificHazards: string[];
  /** The point at which an unqualified reader must stop. Every article has one. */
  stopAndCallProfessional: string[];
}

export interface DiagnosticStep {
  step: number;
  title: string;
  inspect: string;
  where: string;
  instrument: string;
  expected: string;
  ifAbnormal: string;
  next: string;
  warning?: string;
  /** What must be confirmed against manufacturer documentation for this unit. */
  verify?: string;
}

export interface DecisionNode {
  question: string;
  yes: string;
  no: string;
}

export interface RepairGroup {
  level:
    | 'cleaning-and-connections'
    | 'wiring'
    | 'sensor-replacement'
    | 'mechanical'
    | 'board-level'
    | 'component-replacement'
    | 'configuration'
    | 'firmware'
    | 'board-replacement'
    | 'manufacturer-level';
  title: string;
  steps: string[];
  note?: string;
}

export interface RepairArticle {
  slug: string;
  hub: string;
  header: ArticleHeader;
  /** Concise answer placed before the deep explanation, for readers and retrieval. */
  directAnswer: string;
  symptoms: {
    display: string[];
    indicators: string[];
    sounds: string[];
    smells: string[];
    behaviour: string[];
    visible: string[];
  };
  whatItMeans: { plain: string; technical: string };
  causes: CauseGroups;
  safety: SafetySection;
  tools: { tool: string; why: string }[];
  decisionTree: DecisionNode[];
  diagnosis: DiagnosticStep[];
  repair: RepairGroup[];
  validation: string[];
  whenNotToRepair: string[];
  prevention: string[];
  relatedSlugs: string[];
  faq: { q: string; a: string }[];
  references: string[];
}

export interface RepairHub {
  slug: string;
  title: string;
  intro: string;
  scope: string[];
  articleSlugs: string[];
}
