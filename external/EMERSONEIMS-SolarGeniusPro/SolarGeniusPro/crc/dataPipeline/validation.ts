// DATA VALIDATION PIPELINE
// Validates data quality and integrity

export interface ValidationResult {
  isValid: boolean;
  score: number; // 0-100
  errors: ValidationError[];
  warnings: ValidationWarning[];
  timestamp: Date;
}

export interface ValidationError {
  field: string;
  message: string;
  value: any;
  expected: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  value: any;
  suggestion: string;
}

class DataValidation {
  async validateSolarData(data: Record<string, any>): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    
    // Validate system size
    if (data.systemSize !== undefined) {
      if (data.systemSize <= 0) {
        errors.push({
          field: 'systemSize',
          message: 'System size must be positive',
          value: data.systemSize,
          expected: '> 0 kW'
        });
      } else if (data.systemSize > 100) {
        warnings.push({
          field: 'systemSize',
          message: 'Unusually large system size',
          value: data.systemSize,
          suggestion: 'Verify consumption data'
        });
      }
    }
    
    // Validate panel count
    if (data.panelCount !== undefined) {
      if (data.panelCount < 1 || data.panelCount > 500) {
        errors.push({
          field: 'panelCount',
          message: 'Panel count out of reasonable range',
          value: data.panelCount,
          expected: '1-500 panels'
        });
      }
    }
    
    // Validate battery capacity
    if (data.batteryKwh !== undefined) {
      if (data.batteryKwh < 0) {
        errors.push({
          field: 'batteryKwh',
          message: 'Battery capacity cannot be negative',
          value: data.batteryKwh,
          expected: '>= 0 kWh'
        });
      } else if (data.batteryKwh > 100) {
        warnings.push({
          field: 'batteryKwh',
          message: 'Very large battery capacity',
          value: data.batteryKwh,
          suggestion: 'Consider if this is necessary for your application'
        });
      }
    }
    
    // Validate roof pitch
    if (data.roofPitch !== undefined) {
      if (data.roofPitch < 0 || data.roofPitch > 60) {
        warnings.push({
          field: 'roofPitch',
          message: 'Unusual roof pitch',
          value: data.roofPitch,
          suggestion: 'Verify measurement - typical roof pitch is 0-45 degrees'
        });
      }
    }
    
    // Validate irradiance
    if (data.irradiance !== undefined) {
      if (data.irradiance < 0 || data.irradiance > 10) {
        errors.push({
          field: 'irradiance',
          message: 'Solar irradiance out of realistic range',
          value: data.irradiance,
          expected: '0-10 kWh/m²/day'
        });
      }
    }
    
    const score = this.calculateScore(errors, warnings);
    
    return {
      isValid: errors.length === 0,
      score,
      errors,
      warnings,
      timestamp: new Date()
    };
  }
  
  async validateLocationData(data: Record<string, any>): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    
    // Validate latitude
    if (data.latitude !== undefined) {
      if (data.latitude < -90 || data.latitude > 90) {
        errors.push({
          field: 'latitude',
          message: 'Latitude out of range',
          value: data.latitude,
          expected: '-90 to 90 degrees'
        });
      }
    }
    
    // Validate longitude
    if (data.longitude !== undefined) {
      if (data.longitude < -180 || data.longitude > 180) {
        errors.push({
          field: 'longitude',
          message: 'Longitude out of range',
          value: data.longitude,
          expected: '-180 to 180 degrees'
        });
      }
    }
    
    // Validate address
    if (data.address !== undefined && data.address.length < 3) {
      warnings.push({
        field: 'address',
        message: 'Address seems too short',
        value: data.address,
        suggestion: 'Provide more complete address for accurate results'
      });
    }
    
    const score = this.calculateScore(errors, warnings);
    
    return {
      isValid: errors.length === 0,
      score,
      errors,
      warnings,
      timestamp: new Date()
    };
  }
  
  async validateFinancialData(data: Record<string, any>): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    
    // Validate total cost
    if (data.totalCost !== undefined) {
      if (data.totalCost < 0) {
        errors.push({
          field: 'totalCost',
          message: 'Total cost cannot be negative',
          value: data.totalCost,
          expected: '>= 0'
        });
      } else if (data.totalCost === 0 && data.systemSize > 0) {
        warnings.push({
          field: 'totalCost',
          message: 'Total cost is zero for non-zero system',
          value: data.totalCost,
          suggestion: 'Verify cost data'
        });
      }
    }
    
    // Validate monthly saving
    if (data.monthlySaving !== undefined && data.monthlySaving < 0) {
      errors.push({
        field: 'monthlySaving',
        message: 'Monthly saving cannot be negative',
        value: data.monthlySaving,
        expected: '>= 0'
      });
    }
    
    // Validate payback period
    if (data.paybackYears !== undefined) {
      if (data.paybackYears < 0) {
        errors.push({
          field: 'paybackYears',
          message: 'Payback period cannot be negative',
          value: data.paybackYears,
          expected: '>= 0'
        });
      } else if (data.paybackYears > 30) {
        warnings.push({
          field: 'paybackYears',
          message: 'Payback period exceeds typical system lifetime',
          value: data.paybackYears,
          suggestion: 'Re-evaluate system economics'
        });
      }
    }
    
    const score = this.calculateScore(errors, warnings);
    
    return {
      isValid: errors.length === 0,
      score,
      errors,
      warnings,
      timestamp: new Date()
    };
  }
  
  private calculateScore(errors: ValidationError[], warnings: ValidationWarning[]): number {
    let score = 100;
    score -= errors.length * 15;
    score -= warnings.length * 5;
    return Math.max(0, score);
  }
}

export const dataValidation = new DataValidation();