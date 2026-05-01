// DATA NORMALIZATION PIPELINE
// Normalizes data to consistent formats and units

export interface NormalizationResult {
  originalData: any;
  normalizedData: any;
  transformations: string[];
  unitConversions: UnitConversion[];
}

export interface UnitConversion {
  from: string;
  to: string;
  field: string;
  originalValue: number;
  convertedValue: number;
}

class DataNormalization {
  async normalizeSolarData(rawData: Record<string, any>): Promise<NormalizationResult> {
    const transformations: string[] = [];
    const unitConversions: UnitConversion[] = [];
    const normalizedData = { ...rawData };
    
    // Normalize power units to kW
    if (normalizedData.systemSize) {
      if (typeof normalizedData.systemSize === 'string') {
        const match = normalizedData.systemSize.match(/(\d+\.?\d*)\s*(kWp|kW|W|MW)/i);
        if (match) {
          let value = parseFloat(match[1]);
          const unit = match[2].toLowerCase();
          
          if (unit === 'w') {
            value = value / 1000;
            unitConversions.push({
              from: 'W',
              to: 'kW',
              field: 'systemSize',
              originalValue: parseFloat(match[1]),
              convertedValue: value
            });
          } else if (unit === 'mw') {
            value = value * 1000;
            unitConversions.push({
              from: 'MW',
              to: 'kW',
              field: 'systemSize',
              originalValue: parseFloat(match[1]),
              convertedValue: value
            });
          }
          normalizedData.systemSize = value;
          transformations.push('Normalized system size to kW');
        }
      }
    }
    
    // Normalize energy units to kWh
    if (normalizedData.dailyProduction) {
      if (typeof normalizedData.dailyProduction === 'string') {
        const match = normalizedData.dailyProduction.match(/(\d+\.?\d*)\s*(kWh|Wh|MWh)/i);
        if (match) {
          let value = parseFloat(match[1]);
          const unit = match[2].toLowerCase();
          
          if (unit === 'wh') {
            value = value / 1000;
            unitConversions.push({
              from: 'Wh',
              to: 'kWh',
              field: 'dailyProduction',
              originalValue: parseFloat(match[1]),
              convertedValue: value
            });
          } else if (unit === 'mwh') {
            value = value * 1000;
            unitConversions.push({
              from: 'MWh',
              to: 'kWh',
              field: 'dailyProduction',
              originalValue: parseFloat(match[1]),
              convertedValue: value
            });
          }
          normalizedData.dailyProduction = value;
          transformations.push('Normalized energy to kWh');
        }
      }
    }
    
    // Normalize currency to KSh (Kenyan Shilling)
    if (normalizedData.totalCost) {
      if (typeof normalizedData.totalCost === 'string') {
        const match = normalizedData.totalCost.match(/(\d+\.?\d*)\s*(KSh|KES|USD|EUR|GBP)/i);
        if (match) {
          let value = parseFloat(match[1]);
          const currency = match[2].toUpperCase();
          const rates: Record<string, number> = { USD: 130, EUR: 140, GBP: 165, KES: 1 };
          
          if (currency !== 'KSH' && currency !== 'KES') {
            value = value * rates[currency];
            unitConversions.push({
              from: currency,
              to: 'KES',
              field: 'totalCost',
              originalValue: parseFloat(match[1]),
              convertedValue: value
            });
            transformations.push(`Converted ${currency} to KES`);
          }
          normalizedData.totalCost = value;
        }
      }
    }
    
    // Normalize angles to degrees
    if (normalizedData.roofPitch) {
      if (typeof normalizedData.roofPitch === 'string') {
        const match = normalizedData.roofPitch.match(/(\d+\.?\d*)\s*(deg|°|rad)/i);
        if (match) {
          let value = parseFloat(match[1]);
          const unit = match[2].toLowerCase();
          
          if (unit === 'rad') {
            value = value * 180 / Math.PI;
            unitConversions.push({
              from: 'rad',
              to: 'deg',
              field: 'roofPitch',
              originalValue: parseFloat(match[1]),
              convertedValue: value
            });
            transformations.push('Converted roof pitch from radians to degrees');
          }
          normalizedData.roofPitch = value;
        }
      }
    }
    
    // Normalize dates to ISO format
    if (normalizedData.timestamp) {
      try {
        const date = new Date(normalizedData.timestamp);
        if (!isNaN(date.getTime())) {
          normalizedData.timestamp = date.toISOString();
          transformations.push('Normalized timestamp to ISO format');
        }
      } catch (e) {
        // Keep original
      }
    }
    
    return {
      originalData: rawData,
      normalizedData,
      transformations,
      unitConversions
    };
  }
  
  async normalizeLocationData(rawData: Record<string, any>): Promise<NormalizationResult> {
    const transformations: string[] = [];
    const unitConversions: UnitConversion[] = [];
    const normalizedData = { ...rawData };
    
    // Normalize coordinates to decimal degrees
    if (normalizedData.latitude) {
      if (typeof normalizedData.latitude === 'string') {
        const match = normalizedData.latitude.match(/(\d+)°\s*(\d+)'?\s*(\d+)?\"?\s*([NS])/i);
        if (match) {
          let degrees = parseFloat(match[1]);
          const minutes = parseFloat(match[2]) / 60;
          const seconds = (match[3] ? parseFloat(match[3]) : 0) / 3600;
          let value = degrees + minutes + seconds;
          if (match[4] === 'S') value = -value;
          
          normalizedData.latitude = value;
          transformations.push('Converted DMS latitude to decimal degrees');
        } else {
          normalizedData.latitude = parseFloat(normalizedData.latitude);
        }
      }
    }
    
    if (normalizedData.longitude) {
      if (typeof normalizedData.longitude === 'string') {
        const match = normalizedData.longitude.match(/(\d+)°\s*(\d+)'?\s*(\d+)?\"?\s*([EW])/i);
        if (match) {
          let degrees = parseFloat(match[1]);
          const minutes = parseFloat(match[2]) / 60;
          const seconds = (match[3] ? parseFloat(match[3]) : 0) / 3600;
          let value = degrees + minutes + seconds;
          if (match[4] === 'W') value = -value;
          
          normalizedData.longitude = value;
          transformations.push('Converted DMS longitude to decimal degrees');
        } else {
          normalizedData.longitude = parseFloat(normalizedData.longitude);
        }
      }
    }
    
    return {
      originalData: rawData,
      normalizedData,
      transformations,
      unitConversions
    };
  }
  
  async normalizeWeatherData(rawData: Record<string, any>): Promise<NormalizationResult> {
    const transformations: string[] = [];
    const unitConversions: UnitConversion[] = [];
    const normalizedData = { ...rawData };
    
    // Normalize temperature to Celsius
    if (normalizedData.temperature) {
      if (typeof normalizedData.temperature === 'string') {
        const match = normalizedData.temperature.match(/(\d+\.?\d*)\s*([CFK])/i);
        if (match) {
          let value = parseFloat(match[1]);
          const unit = match[2].toUpperCase();
          
          if (unit === 'F') {
            value = (value - 32) * 5 / 9;
            unitConversions.push({
              from: 'F',
              to: 'C',
              field: 'temperature',
              originalValue: parseFloat(match[1]),
              convertedValue: value
            });
            transformations.push('Converted temperature from Fahrenheit to Celsius');
          } else if (unit === 'K') {
            value = value - 273.15;
            unitConversions.push({
              from: 'K',
              to: 'C',
              field: 'temperature',
              originalValue: parseFloat(match[1]),
              convertedValue: value
            });
            transformations.push('Converted temperature from Kelvin to Celsius');
          }
          normalizedData.temperature = value;
        }
      }
    }
    
    // Normalize wind speed to m/s
    if (normalizedData.windSpeed) {
      if (typeof normalizedData.windSpeed === 'string') {
        const match = normalizedData.windSpeed.match(/(\d+\.?\d*)\s*(m\/s|km\/h|mph|knots?)/i);
        if (match) {
          let value = parseFloat(match[1]);
          const unit = match[2].toLowerCase();
          
          if (unit === 'km/h') {
            value = value / 3.6;
            unitConversions.push({
              from: 'km/h',
              to: 'm/s',
              field: 'windSpeed',
              originalValue: parseFloat(match[1]),
              convertedValue: value
            });
            transformations.push('Converted wind speed from km/h to m/s');
          } else if (unit === 'mph') {
            value = value * 0.44704;
            unitConversions.push({
              from: 'mph',
              to: 'm/s',
              field: 'windSpeed',
              originalValue: parseFloat(match[1]),
              convertedValue: value
            });
            transformations.push('Converted wind speed from mph to m/s');
          }
          normalizedData.windSpeed = value;
        }
      }
    }
    
    return {
      originalData: rawData,
      normalizedData,
      transformations,
      unitConversions
    };
  }
}

export const dataNormalization = new DataNormalization();