// REGIONAL CODES AND REGULATIONS
// Country-specific electrical codes, building codes, and standards

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

class RegionalCodes {
  private codes: Map<string, RegionalCode[]> = new Map();
  
  constructor() {
    this.initializeCodes();
  }
  
  private initializeCodes(): void {
    // Kenya Codes
    const kenyaCodes: RegionalCode[] = [
      {
        country: 'Kenya',
        code: 'KS-1978',
        name: 'Kenya Standard for Electrical Installations',
        version: '2023',
        authority: 'KEBS',
        requirements: [
          {
            id: 'K-ELEC-001',
            category: 'electrical',
            requirement: 'Maximum DC voltage',
            value: 1000,
            unit: 'V',
            severity: 'mandatory'
          },
          {
            id: 'K-ELEC-002',
            category: 'electrical',
            requirement: 'Minimum wire gauge for solar',
            value: 4,
            unit: 'mm²',
            severity: 'mandatory'
          },
          {
            id: 'K-FIRE-001',
            category: 'fire',
            requirement: 'Arc fault protection required',
            value: true,
            severity: 'mandatory'
          }
        ]
      },
      {
        country: 'Kenya',
        code: 'EPRA-NM-2022',
        name: 'Net Metering Regulations',
        version: '2022',
        authority: 'EPRA',
        requirements: [
          {
            id: 'K-NM-001',
            category: 'permitting',
            requirement: 'Maximum net metering capacity',
            value: 1000,
            unit: 'kW',
            severity: 'mandatory'
          },
          {
            id: 'K-NM-002',
            category: 'permitting',
            requirement: 'Bi-directional meter required',
            value: true,
            severity: 'mandatory'
          }
        ]
      }
    ];
    
    // Nigeria Codes
    const nigeriaCodes: RegionalCode[] = [
      {
        country: 'Nigeria',
        code: 'NESP-2023',
        name: 'Nigerian Electricity Supply and Installation Standards',
        version: '2023',
        authority: 'NERC',
        requirements: [
          {
            id: 'N-ELEC-001',
            category: 'electrical',
            requirement: 'Maximum grid-tied inverter size',
            value: 100,
            unit: 'kW',
            severity: 'mandatory'
          },
          {
            id: 'N-PERM-001',
            category: 'permitting',
            requirement: 'NERC registration required',
            value: true,
            severity: 'mandatory'
          }
        ]
      }
    ];
    
    // South Africa Codes
    const southAfricaCodes: RegionalCode[] = [
      {
        country: 'South Africa',
        code: 'SANS-10142-1',
        name: 'The Wiring of Premises',
        version: '2023',
        authority: 'SABS',
        requirements: [
          {
            id: 'SA-ELEC-001',
            category: 'electrical',
            requirement: 'Surge protection required',
            value: true,
            severity: 'mandatory'
          },
          {
            id: 'SA-ELEC-002',
            category: 'electrical',
            requirement: 'Earth leakage protection',
            value: 30,
            unit: 'mA',
            severity: 'mandatory'
          }
        ]
      }
    ];
    
    this.codes.set('Kenya', kenyaCodes);
    this.codes.set('Nigeria', nigeriaCodes);
    this.codes.set('South Africa', southAfricaCodes);
  }
  
  async getCodes(country: string): Promise<RegionalCode[]> {
    return this.codes.get(country) || [];
  }
  
  async getRequirements(country: string, category?: string): Promise<CodeRequirement[]> {
    const codes = await this.getCodes(country);
    const requirements: CodeRequirement[] = [];
    
    for (const code of codes) {
      for (const req of code.requirements) {
        if (!category || req.category === category) {
          requirements.push(req);
        }
      }
    }
    
    return requirements;
  }
  
  async validateAgainstCode(
    country: string,
    category: string,
    actualValues: Record<string, any>
  ): Promise<{
    compliant: boolean;
    violations: Array<{ requirement: CodeRequirement; actual: any; message: string }>;
  }> {
    const requirements = await this.getRequirements(country, category);
    const violations = [];
    
    for (const req of requirements) {
      const actual = actualValues[req.id];
      if (actual !== undefined) {
        let isCompliant = true;
        
        if (typeof req.value === 'number' && typeof actual === 'number') {
          isCompliant = actual <= req.value;
        } else if (typeof req.value === 'boolean') {
          isCompliant = actual === req.value;
        }
        
        if (!isCompliant) {
          violations.push({
            requirement: req,
            actual,
            message: `${req.requirement}: expected ${req.value}${req.unit || ''}, got ${actual}${req.unit || ''}`
          });
        }
      }
    }
    
    return {
      compliant: violations.length === 0,
      violations
    };
  }
  
  async getPermitRequirements(country: string): Promise<{
    permits: string[];
    fees: number;
    processingDays: number;
    documents: string[];
  }> {
    const permits: Record<string, any> = {
      Kenya: {
        permits: ['EPRA License', 'KPLC Net Metering Agreement', 'County Building Permit'],
        fees: 25000,
        processingDays: 30,
        documents: ['Site plan', 'Single line diagram', 'Equipment specs', 'Engineer stamp']
      },
      Nigeria: {
        permits: ['NERC Generation License', 'DISCO Connection Agreement'],
        fees: 50000,
        processingDays: 45,
        documents: ['NERC form', 'Technical specification', 'Site assessment report']
      },
      'South Africa': {
        permits: ['NERSA Registration', 'Municipal Approval'],
        fees: 35000,
        processingDays: 60,
        documents: ['SSEG application', 'Electrical diagram', 'Compliance certificate']
      }
    };
    
    return permits[country] || {
      permits: ['Local Electrical Permit'],
      fees: 10000,
      processingDays: 14,
      documents: ['Application form', 'Site plan']
    };
  }
}

export const regionalCodes = new RegionalCodes();