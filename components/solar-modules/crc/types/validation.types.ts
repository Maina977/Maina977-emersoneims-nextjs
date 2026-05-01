// Validation Type Definitions

export interface ValidationResult {
  isValid: boolean;
  score: number;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  recommendations: string[];
  timestamp: Date;
}

export interface ValidationError {
  code: string;
  severity: 'critical' | 'major' | 'minor';
  message: string;
  component: string;
  fix: string;
}

export interface ValidationWarning {
  code: string;
  message: string;
  recommendation: string;
}

export interface ComplianceReport {
  standard: string;
  version: string;
  compliant: boolean;
  score: number;
  violations: ComplianceViolation[];
  certificates: string[];
}

export interface ComplianceViolation {
  clause: string;
  description: string;
  severity: 'critical' | 'major' | 'minor';
  remediation: string;
}

export interface SafetyCheck {
  id: string;
  name: string;
  category: 'fire' | 'electrical' | 'structural' | 'environmental';
  status: 'pass' | 'fail' | 'warning' | 'not_applicable';
  message: string;
  recommendation: string;
  severity: 'critical' | 'major' | 'minor';
}

export interface QualityCheck {
  id: string;
  name: string;
  category: 'design' | 'components' | 'installation' | 'documentation';
  status: 'pass' | 'fail' | 'warning' | 'not_applicable';
  score: number;
  message: string;
  recommendation: string;
  details: string[];
}

export interface RegionalCode {
  country: string;
  code: string;
  name: string;
  version: string;
  authority: string;
  requirements: CodeRequirement[];
}

export interface CodeRequirement {
  id: string;
  category: 'electrical' | 'structural' | 'fire' | 'environmental' | 'permitting';
  requirement: string;
  value: string | number;
  unit?: string;
  severity: 'mandatory' | 'recommended' | 'informative';
}