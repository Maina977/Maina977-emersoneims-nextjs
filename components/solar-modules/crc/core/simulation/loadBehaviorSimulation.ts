// CORE SIMULATION - LOAD BEHAVIOR SIMULATION
// Simulates electricity consumption patterns

export interface LoadProfile {
  hourly: number[];
  daily: number[];
  monthly: number[];
  seasonal: SeasonalLoad[];
  peakDemand: number;
  baseLoad: number;
  variability: number;
}

export interface SeasonalLoad {
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  averageDaily: number;
  peakHour: number;
  loadFactor: number;
}

export interface ApplianceProfile {
  name: string;
  wattage: number;
  quantity: number;
  hoursPerDay: number;
  typicalUsage: number[]; // Hourly distribution
  seasonality: number[]; // Monthly factors
}

export interface LoadSimulationInput {
  appliances: ApplianceProfile[];
  buildingType: 'residential' | 'commercial' | 'industrial' | 'agricultural';
  occupancy: {
    people: number;
    schedule: number[];
  };
  climate: {
    coolingDegreeDays: number[];
    heatingDegreeDays: number[];
  };
  historicalData?: number[];
}

class LoadBehaviorSimulation {
  async simulate(input: LoadSimulationInput): Promise<LoadProfile> {
    // Calculate base load from appliances
    const applianceLoad = this.calculateApplianceLoad(input.appliances);
    
    // Calculate occupancy-based load
    const occupancyLoad = this.calculateOccupancyLoad(input);
    
    // Calculate climate-based load (HVAC)
    const climateLoad = this.calculateClimateLoad(input);
    
    // Combine all loads
    const hourlyLoad: number[] = [];
    const dailyLoad: number[] = Array(365).fill(0);
    const monthlyLoad: number[] = Array(12).fill(0);
    
    for (let day = 0; day < 365; day++) {
      let dayTotal = 0;
      for (let hour = 0; hour < 24; hour++) {
        const load = applianceLoad[hour] + occupancyLoad[hour] + climateLoad[day][hour];
        hourlyLoad.push(load);
        dayTotal += load;
      }
      dailyLoad[day] = dayTotal;
      
      const month = new Date(2024, 0, day + 1).getMonth();
      monthlyLoad[month] += dayTotal;
    }
    
    // Calculate monthly averages
    const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    for (let i = 0; i < 12; i++) {
      monthlyLoad[i] = monthlyLoad[i] / daysPerMonth[i];
    }
    
    // Calculate seasonal profiles
    const seasonal = this.calculateSeasonalProfiles(dailyLoad, hourlyLoad);
    
    // Calculate statistics
    const peakDemand = Math.max(...hourlyLoad);
    const baseLoad = Math.min(...hourlyLoad);
    const averageLoad = hourlyLoad.reduce((a, b) => a + b, 0) / hourlyLoad.length;
    const variability = (peakDemand - baseLoad) / averageLoad;
    
    return {
      hourly: hourlyLoad.slice(0, 168), // First week
      daily: dailyLoad.slice(0, 30), // First month
      monthly: monthlyLoad,
      seasonal,
      peakDemand,
      baseLoad,
      variability
    };
  }
  
  private calculateApplianceLoad(appliances: ApplianceProfile[]): number[] {
    const hourlyLoad = Array(24).fill(0);
    
    for (const appliance of appliances) {
      const totalWattage = appliance.wattage * appliance.quantity;
      const dailyEnergy = totalWattage * appliance.hoursPerDay / 1000;
      
      // Distribute across typical usage hours
      for (let hour = 0; hour < 24; hour++) {
        const usageFactor = appliance.typicalUsage[hour] || (1 / 24);
        hourlyLoad[hour] += totalWattage * usageFactor;
      }
    }
    
    return hourlyLoad;
  }
  
  private calculateOccupancyLoad(input: LoadSimulationInput): number[] {
    const hourlyLoad = Array(24).fill(0);
    const baseOccupancyLoad = 200; // Watts per person
    
    for (let hour = 0; hour < 24; hour++) {
      const occupancyFactor = input.occupancy.schedule[hour] || 0.5;
      hourlyLoad[hour] = baseOccupancyLoad * input.occupancy.people * occupancyFactor;
    }
    
    return hourlyLoad;
  }
  
  private calculateClimateLoad(input: LoadSimulationInput): number[][] {
    const dailyLoad: number[][] = [];
    const coolingPower = 3000; // Watts for AC
    const heatingPower = 2000; // Watts for heater
    
    for (let day = 0; day < 365; day++) {
      const hourlyLoad = Array(24).fill(0);
      const month = new Date(2024, 0, day + 1).getMonth();
      
      // Cooling load
      const coolingNeed = input.climate.coolingDegreeDays[month] / 30;
      for (let hour = 12; hour <= 18; hour++) {
        hourlyLoad[hour] += coolingPower * coolingNeed * 0.5;
      }
      
      // Heating load
      const heatingNeed = input.climate.heatingDegreeDays[month] / 30;
      for (let hour = 6; hour <= 22; hour++) {
        hourlyLoad[hour] += heatingPower * heatingNeed * 0.3;
      }
      
      dailyLoad.push(hourlyLoad);
    }
    
    return dailyLoad;
  }
  
  private calculateSeasonalProfiles(dailyLoad: number[], hourlyLoad: number[]): SeasonalLoad[] {
    const seasons: SeasonalLoad[] = [];
    const seasonRanges = {
      spring: { start: 79, end: 171 }, // Mar 20 - Jun 20
      summer: { start: 172, end: 265 }, // Jun 21 - Sep 22
      autumn: { start: 266, end: 355 }, // Sep 23 - Dec 21
      winter: { start: 0, end: 78 } // Dec 22 - Mar 19
    };
    
    for (const [season, range] of Object.entries(seasonRanges)) {
      let totalLoad = 0;
      let count = 0;
      
      for (let day = range.start; day <= range.end && day < dailyLoad.length; day++) {
        totalLoad += dailyLoad[day];
        count++;
      }
      
      const averageDaily = totalLoad / count;
      const peakHour = this.findPeakHour(hourlyLoad);
      const loadFactor = averageDaily / (Math.max(...hourlyLoad) * 24);
      
      seasons.push({
        season: season as any,
        averageDaily: Math.round(averageDaily),
        peakHour,
        loadFactor: Math.round(loadFactor * 100) / 100
      });
    }
    
    return seasons;
  }
  
  private findPeakHour(hourlyLoad: number[]): number {
    let peakHour = 0;
    let peakLoad = 0;
    
    for (let hour = 0; hour < 24; hour++) {
      if (hourlyLoad[hour] > peakLoad) {
        peakLoad = hourlyLoad[hour];
        peakHour = hour;
      }
    }
    
    return peakHour;
  }
  
  async predictPeakDemand(input: LoadSimulationInput, confidence: number = 0.95): Promise<{
    expected: number;
    upperBound: number;
    lowerBound: number;
    timeOfDay: number;
  }> {
    const profile = await this.simulate(input);
    const expected = profile.peakDemand;
    const margin = expected * (1 - confidence) * 2;
    
    return {
      expected: Math.round(expected),
      upperBound: Math.round(expected + margin),
      lowerBound: Math.round(expected - margin),
      timeOfDay: this.findPeakHour(profile.hourly)
    };
  }
  
  async generateLoadDurationCurve(input: LoadSimulationInput): Promise<{
    hours: number[];
    load: number[];
    exceedanceProbability: number[];
  }> {
    const profile = await this.simulate(input);
    const sortedLoad = [...profile.hourly].sort((a, b) => b - a);
    const hours = Array.from({ length: 8760 }, (_, i) => i + 1);
    const exceedance = hours.map(h => (h / 8760) * 100);
    
    return {
      hours: hours.slice(0, 100),
      load: sortedLoad.slice(0, 100),
      exceedanceProbability: exceedance.slice(0, 100)
    };
  }
  
  async optimizeLoadShifting(input: LoadSimulationInput, solarProfile: number[]): Promise<{
    recommendedShifts: Array<{ appliance: string; fromHour: number; toHour: number; savings: number }>;
    totalSavings: number;
    newPeakDemand: number;
  }> {
    const profile = await this.simulate(input);
    const shifts = [];
    let totalSavings = 0;
    
    // Identify high-value shift opportunities
    for (const appliance of input.appliances) {
      if (appliance.hoursPerDay > 2) {
        const currentCost = this.calculateHourlyCost(profile.hourly, appliance);
        const shiftedCost = this.calculateShiftedCost(solarProfile, appliance);
        const savings = currentCost - shiftedCost;
        
        if (savings > 0) {
          shifts.push({
            appliance: appliance.name,
            fromHour: 18, // Evening peak
            toHour: 12, // Solar peak
            savings: Math.round(savings)
          });
          totalSavings += savings;
        }
      }
    }
    
    const newPeakDemand = profile.peakDemand * 0.85;
    
    return {
      recommendedShifts: shifts,
      totalSavings: Math.round(totalSavings),
      newPeakDemand: Math.round(newPeakDemand)
    };
  }
  
  private calculateHourlyCost(profile: number[], appliance: ApplianceProfile): number {
    const tariff = 25.5; // KSh/kWh
    let cost = 0;
    
    for (let hour = 0; hour < 24; hour++) {
      const usage = appliance.typicalUsage[hour] || (1 / 24);
      const energy = appliance.wattage * appliance.quantity * usage / 1000;
      cost += energy * tariff;
    }
    
    return cost;
  }
  
  private calculateShiftedCost(solarProfile: number[], appliance: ApplianceProfile): number {
    const tariff = 25.5;
    let cost = 0;
    
    // Shift to solar peak hours (10am-2pm)
    for (let hour = 10; hour <= 14; hour++) {
      const usage = 1 / 5; // Distribute across 5 hours
      const energy = appliance.wattage * appliance.quantity * usage / 1000;
      cost += energy * tariff * 0.5; // 50% saving during solar hours
    }
    
    return cost;
  }
}

export const loadBehaviorSimulation = new LoadBehaviorSimulation();