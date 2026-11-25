/**
 * Generator fault identification list for /maintenance-hub/generators
 * (safety withdrawal, management rule, 2026-11-25).
 *
 * Identification only: code, title, severity and category of the eight records
 * the page listed from lib/generator-oracle/data/comprehensive-faults-index.ts
 * (ENHANCED_FAULT_DATABASE + comprehensive-faults-part1/part2). The page no
 * longer imports that data: its reset sequences, diagnostic and repair
 * procedures, AI insights, case studies and figures are withdrawn (review
 * finding S3: wrong-fault notes, invented PSI limits, start/run steps), and the
 * cross-brand "alternative codes" are left out because matching a bare code
 * across brands was the S3 defect itself.
 *
 * No instructions and no thresholds may be added here.
 */

export interface GeneratorFaultIdentification {
  code: string;
  title: string;
  severity: 'info' | 'warning' | 'critical' | 'shutdown' | 'emergency';
  category: string;
}

export const GENERATOR_FAULT_IDENTIFICATION: readonly GeneratorFaultIdentification[] = [
  { code: '100-1', title: 'Low Engine Oil Pressure - Critical Shutdown', severity: 'shutdown', category: 'Engine Protection' },
  { code: '110-0', title: 'High Engine Coolant Temperature - Overheat Shutdown', severity: 'shutdown', category: 'Engine Protection' },
  { code: 'C034', title: 'Generator Over Voltage Protection - Phase Voltage Exceeded Safe Limits', severity: 'shutdown', category: 'Electrical Protection' },
  { code: 'E001', title: 'Emergency Stop Activated - Manual E-Stop Button Pressed', severity: 'shutdown', category: 'Safety Systems' },
  { code: 'STS-001', title: 'Engine Fail to Start - No Crank', severity: 'critical', category: 'Starting System' },
  { code: 'STS-002', title: 'Engine Fail to Start - Cranks But No Ignition', severity: 'critical', category: 'Starting System' },
  { code: 'COOL-001', title: 'Low Coolant Level - Warning', severity: 'warning', category: 'Cooling System' },
  { code: 'LUB-001', title: 'Low Oil Level - Warning', severity: 'warning', category: 'Lubrication System' },
];

export function searchGeneratorFaultIdentification(query: string): GeneratorFaultIdentification[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...GENERATOR_FAULT_IDENTIFICATION];
  return GENERATOR_FAULT_IDENTIFICATION.filter((f) => f.code.toLowerCase().includes(q) || f.title.toLowerCase().includes(q) || f.category.toLowerCase().includes(q));
}

export function generatorFaultCategories(): string[] {
  return [...new Set(GENERATOR_FAULT_IDENTIFICATION.map((f) => f.category))].sort();
}
