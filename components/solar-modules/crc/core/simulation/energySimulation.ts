// CORE SIMULATION - ENERGY SIMULATION
// Simulates energy production over time

export interface EnergySimulationInput {
  systemKw: number;
  panelTilt: number;
  panelAzimuth: number;
  location: {
    lat: number;
    lng: number;
    elevation?: number;
  };
  losses: {
    shading: number;
    soiling: number;
    temperature: number;
    mismatch: number;
    dcAc: number;
  };
  inverterEfficiency: number;
  simulationPeriod: {
    startDate: Date;
    endDate: Date;
    interval: 'hourly' | 'daily' | 'monthly';
  };
}

export interface EnergySimulationOutput {
  totalEnergy: number;
  averageDaily: number;
  peakPower: number;
  capacityFactor: number;
  performanceRatio: number;
  timeSeries: TimeSeriesData[];
  monthlyBreakdown: MonthlyData[];
  yearlyBreakdown: YearlyData[];
}

export interface TimeSeriesData {
  timestamp: Date;
  powerKw: number;
  energyKwh: number;
  irradiance: number;
  temperature: number;
}

export interface MonthlyData {
  month: number;
  monthName: string;
  energyKwh: number;
  averageDaily: number;
}

export interface YearlyData {
  year: number;
  energyKwh: number;
  degradation: number;
}

class EnergySimulation {
  async simulate(input: EnergySimulationInput): Promise<EnergySimulationOutput> {
    const startYear = input.simulationPeriod.startDate.getFullYear();
    const endYear = input.simulationPeriod.endDate.getFullYear();
    const years = endYear - startYear + 1;
    
    // Calculate base production using PVWatts-style algorithm
    const baseAnnualProduction = await this.calculateBaseProduction(input);
    
    // Apply degradation over time
    const degradationRate = 0.005; // 0.5% per year
    const yearlyData: YearlyData[] = [];
    let totalEnergy = 0;
    
    for (let i = 0; i < years; i++) {
      const degradation = 1 - (degradationRate * i);
      const yearlyEnergy = baseAnnualProduction * degradation;
      yearlyData.push({
        year: startYear + i,
        energyKwh: yearlyEnergy,
        degradation: (1 - degradation) * 100
      });
      totalEnergy += yearlyEnergy;
    }
    
    // Calculate monthly breakdown
    const monthlyData = this.calculateMonthlyBreakdown(baseAnnualProduction, input.location.lat);
    
    // Generate time series if requested
    let timeSeries: TimeSeriesData[] = [];
    if (input.simulationPeriod.interval === 'hourly') {
      timeSeries = await this.generateHourlySeries(input, baseAnnualProduction);
    } else if (input.simulationPeriod.interval === 'daily') {
      timeSeries = await this.generateDailySeries(input, baseAnnualProduction);
    }
    
    const averageDaily = totalEnergy / (years * 365);
    const peakPower = input.systemKw * 0.95; // Peak around 95% of rated
    const capacityFactor = (totalEnergy / years) / (input.systemKw * 8760) * 100;
    const performanceRatio = this.calculatePerformanceRatio(input.losses, input.inverterEfficiency);
    
    return {
      totalEnergy: Math.round(totalEnergy),
      averageDaily: Math.round(averageDaily),
      peakPower: Math.round(peakPower * 100) / 100,
      capacityFactor: Math.round(capacityFactor * 10) / 10,
      performanceRatio: Math.round(performanceRatio * 100) / 100,
      timeSeries,
      monthlyBreakdown: monthlyData,
      yearlyBreakdown: yearlyData
    };
  }
  
  private async calculateBaseProduction(input: EnergySimulationInput): Promise<number> {
    // PVWatts algorithm simplified
    const solarConstant = 1361; // W/m²
    const airMass = 1.5;
    
    // Calculate clear sky irradiance
    const latitude = input.location.lat;
    const optimalTilt = Math.abs(latitude) * 0.9 + 10;
    const tiltFactor = Math.cos((input.panelTilt - optimalTilt) * Math.PI / 180);
    
    // Azimuth factor (optimal is 180° in northern hemisphere)
    const optimalAzimuth = latitude > 0 ? 180 : 0;
    const azimuthDifference = Math.abs(input.panelAzimuth - optimalAzimuth);
    const azimuthFactor = Math.cos(azimuthDifference * Math.PI / 180);
    
    // Average daily irradiance based on location
    const baseIrradiance = this.getBaseIrradiance(latitude);
    const effectiveIrradiance = baseIrradiance * tiltFactor * azimuthFactor;
    
    // Apply losses
    const totalLoss = (input.losses.shading + input.losses.soiling + 
                       input.losses.temperature + input.losses.mismatch + 
                       input.losses.dcAc) / 100;
    const efficiency = input.inverterEfficiency * (1 - totalLoss);
    
    // Annual energy (kWh)
    const annualEnergy = input.systemKw * effectiveIrradiance * 365 * efficiency;
    
    return annualEnergy;
  }
  
  private getBaseIrradiance(latitude: number): number {
    // Average daily irradiance (kWh/m²/day) based on latitude
    const absLat = Math.abs(latitude);
    if (absLat < 10) return 5.5;
    if (absLat < 20) return 5.2;
    if (absLat < 30) return 4.8;
    if (absLat < 40) return 4.2;
    return 3.5;
  }
  
  private calculateMonthlyBreakdown(annualEnergy: number, latitude: number): MonthlyData[] {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const seasonalFactors = this.getSeasonalFactors(latitude);
    
    return monthNames.map((name, index) => {
      const monthlyEnergy = annualEnergy * seasonalFactors[index] / 12;
      return {
        month: index + 1,
        monthName: name,
        energyKwh: Math.round(monthlyEnergy),
        averageDaily: Math.round(monthlyEnergy / 30)
      };
    });
  }
  
  private getSeasonalFactors(latitude: number): number[] {
    // Seasonal variation based on latitude
    const isNorthern = latitude > 0;
    if (isNorthern) {
      return [0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.2, 1.1, 1.0, 0.8, 0.7];
    }
    return [1.2, 1.1, 1.0, 0.9, 0.8, 0.7, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2];
  }
  
  private async generateHourlySeries(input: EnergySimulationInput, annualEnergy: number): Promise<TimeSeriesData[]> {
    const series: TimeSeriesData[] = [];
    const startDate = new Date(input.simulationPeriod.startDate);
    const endDate = new Date(input.simulationPeriod.endDate);
    const dailyAverage = annualEnergy / 365;
    
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      for (let hour = 0; hour < 24; hour++) {
        const hourOfDay = hour;
        const isDaytime = hourOfDay >= 6 && hourOfDay <= 18;
        
        let powerKw = 0;
        if (isDaytime) {
          const hourFactor = Math.sin((hourOfDay - 6) / 12 * Math.PI);
          powerKw = input.systemKw * hourFactor * 0.9;
        }
        
        series.push({
          timestamp: new Date(currentDate),
          powerKw: Math.round(powerKw * 100) / 100,
          energyKwh: Math.round(powerKw * 100) / 100,
          irradiance: isDaytime ? 800 * Math.sin((hourOfDay - 6) / 12 * Math.PI) : 0,
          temperature: 20 + 10 * Math.sin((hourOfDay - 12) / 24 * Math.PI * 2)
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return series;
  }
  
  private async generateDailySeries(input: EnergySimulationInput, annualEnergy: number): Promise<TimeSeriesData[]> {
    const series: TimeSeriesData[] = [];
    const startDate = new Date(input.simulationPeriod.startDate);
    const endDate = new Date(input.simulationPeriod.endDate);
    const dailyAverage = annualEnergy / 365;
    
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dayOfYear = this.getDayOfYear(currentDate);
      const seasonalFactor = 0.8 + 0.4 * Math.sin((dayOfYear - 80) / 365 * 2 * Math.PI);
      
      series.push({
        timestamp: new Date(currentDate),
        powerKw: 0,
        energyKwh: Math.round(dailyAverage * seasonalFactor),
        irradiance: 5000 * seasonalFactor,
        temperature: 20 + 10 * Math.sin((dayOfYear - 172) / 365 * 2 * Math.PI)
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return series;
  }
  
  private calculatePerformanceRatio(losses: any, inverterEfficiency: number): number {
    const totalLoss = (losses.shading + losses.soiling + losses.temperature + 
                       losses.mismatch + losses.dcAc) / 100;
    return inverterEfficiency * (1 - totalLoss);
  }
  
  private getDayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 86400000;
    return Math.floor(diff / oneDay);
  }
}

export const energySimulation = new EnergySimulation();