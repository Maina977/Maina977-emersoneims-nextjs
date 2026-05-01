// DATA CLEANING PIPELINE
// Cleans and validates ingested data

export interface CleaningResult {
  originalData: any;
  cleanedData: any;
  issuesFound: CleaningIssue[];
  transformations: string[];
  qualityScore: number; // 0-100
}

export interface CleaningIssue {
  field: string;
  issue: string;
  severity: 'critical' | 'warning' | 'info';
  originalValue: any;
  correctedValue: any;
}

class DataCleaning {
  async cleanBOQData(rawData: Record<string, any>): Promise<CleaningResult> {
    const issues: CleaningIssue[] = [];
    const transformations: string[] = [];
    const cleanedData = { ...rawData };
    
    // Remove duplicates
    if (cleanedData.components && Array.isArray(cleanedData.components)) {
      const uniqueComponents = new Map();
      for (const comp of cleanedData.components) {
        const key = `${comp.name}_${comp.model || ''}`;
        if (!uniqueComponents.has(key)) {
          uniqueComponents.set(key, comp);
        } else {
          issues.push({
            field: 'components',
            issue: 'Duplicate component found',
            severity: 'warning',
            originalValue: comp,
            correctedValue: null
          });
          transformations.push('Removed duplicate component');
        }
      }
      cleanedData.components = Array.from(uniqueComponents.values());
    }
    
    // Validate and fix prices
    if (cleanedData.components) {
      for (const comp of cleanedData.components) {
        if (comp.unitPrice && comp.unitPrice < 0) {
          issues.push({
            field: 'unitPrice',
            issue: 'Negative price detected',
            severity: 'critical',
            originalValue: comp.unitPrice,
            correctedValue: Math.abs(comp.unitPrice)
          });
          comp.unitPrice = Math.abs(comp.unitPrice);
          transformations.push('Fixed negative price values');
        }
        
        if (comp.quantity && comp.quantity < 0) {
          issues.push({
            field: 'quantity',
            issue: 'Negative quantity detected',
            severity: 'critical',
            originalValue: comp.quantity,
            correctedValue: 0
          });
          comp.quantity = 0;
          transformations.push('Fixed negative quantities');
        }
      }
    }
    
    // Fill missing values
    if (!cleanedData.total && cleanedData.components) {
      const calculatedTotal = cleanedData.components.reduce((sum: number, comp: any) => {
        return sum + (comp.unitPrice || 0) * (comp.quantity || 0);
      }, 0);
      cleanedData.total = calculatedTotal;
      transformations.push('Calculated missing total from components');
      issues.push({
        field: 'total',
        issue: 'Missing total value',
        severity: 'warning',
        originalValue: null,
        correctedValue: calculatedTotal
      });
    }
    
    // Validate data types
    if (cleanedData.components) {
      for (const comp of cleanedData.components) {
        if (typeof comp.quantity !== 'number') {
          comp.quantity = parseInt(comp.quantity) || 0;
          transformations.push('Converted quantity to number');
        }
        if (typeof comp.unitPrice !== 'number') {
          comp.unitPrice = parseFloat(comp.unitPrice) || 0;
          transformations.push('Converted price to number');
        }
      }
    }
    
    const qualityScore = this.calculateQualityScore(issues);
    
    return {
      originalData: rawData,
      cleanedData,
      issues,
      transformations: [...new Set(transformations)],
      qualityScore
    };
  }
  
  async cleanImageData(rawData: Record<string, any>): Promise<CleaningResult> {
    const issues: CleaningIssue[] = [];
    const transformations: string[] = [];
    const cleanedData = { ...rawData };
    
    // Normalize dimensions
    if (cleanedData.dimensions) {
      if (cleanedData.dimensions.width > 8000) {
        issues.push({
          field: 'dimensions.width',
          issue: 'Image width unusually large',
          severity: 'warning',
          originalValue: cleanedData.dimensions.width,
          correctedValue: 4000
        });
        cleanedData.dimensions.width = 4000;
        transformations.push('Normalized image dimensions');
      }
    }
    
    // Validate confidence scores
    if (cleanedData.confidence && (cleanedData.confidence < 0 || cleanedData.confidence > 1)) {
      issues.push({
        field: 'confidence',
        issue: 'Confidence score out of range',
        severity: 'critical',
        originalValue: cleanedData.confidence,
        correctedValue: Math.min(1, Math.max(0, cleanedData.confidence))
      });
      cleanedData.confidence = Math.min(1, Math.max(0, cleanedData.confidence));
      transformations.push('Clamped confidence score to [0,1]');
    }
    
    // Ensure required fields exist
    const requiredFields = ['roofArea', 'roofPitch'];
    for (const field of requiredFields) {
      if (cleanedData[field] === undefined) {
        issues.push({
          field,
          issue: `Missing required field: ${field}`,
          severity: 'warning',
          originalValue: undefined,
          correctedValue: null
        });
        transformations.push(`Added placeholder for missing field: ${field}`);
      }
    }
    
    const qualityScore = this.calculateQualityScore(issues);
    
    return {
      originalData: rawData,
      cleanedData,
      issues,
      transformations,
      qualityScore
    };
  }
  
  async cleanSensorData(rawData: Record<string, any>): Promise<CleaningResult> {
    const issues: CleaningIssue[] = [];
    const transformations: string[] = [];
    const cleanedData = { ...rawData };
    
    // Remove outliers
    if (cleanedData.temperature && (cleanedData.temperature < -20 || cleanedData.temperature > 80)) {
      issues.push({
        field: 'temperature',
        issue: 'Temperature outlier detected',
        severity: 'warning',
        originalValue: cleanedData.temperature,
        correctedValue: 25
      });
      cleanedData.temperature = 25;
      transformations.push('Replaced temperature outlier with default');
    }
    
    if (cleanedData.voltage && (cleanedData.voltage < 0 || cleanedData.voltage > 1000)) {
      issues.push({
        field: 'voltage',
        issue: 'Voltage outlier detected',
        severity: 'critical',
        originalValue: cleanedData.voltage,
        correctedValue: 230
      });
      cleanedData.voltage = 230;
      transformations.push('Replaced voltage outlier with default');
    }
    
    // Interpolate missing values
    if (cleanedData.timestamp && cleanedData.value === undefined) {
      issues.push({
        field: 'value',
        issue: 'Missing sensor value',
        severity: 'warning',
        originalValue: undefined,
        correctedValue: 0
      });
      cleanedData.value = 0;
      transformations.push('Filled missing sensor value with 0');
    }
    
    const qualityScore = this.calculateQualityScore(issues);
    
    return {
      originalData: rawData,
      cleanedData,
      issues,
      transformations,
      qualityScore
    };
  }
  
  private calculateQualityScore(issues: CleaningIssue[]): number {
    let score = 100;
    for (const issue of issues) {
      if (issue.severity === 'critical') score -= 20;
      else if (issue.severity === 'warning') score -= 10;
      else score -= 5;
    }
    return Math.max(0, score);
  }
}

export const dataCleaning = new DataCleaning();