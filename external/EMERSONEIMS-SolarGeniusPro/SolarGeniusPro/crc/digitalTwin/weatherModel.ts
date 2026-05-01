// DIGITAL TWIN - WEATHER MODEL
// Weather simulation and forecasting

export interface WeatherModel {
  id: string;
  siteId: string;
  location: { lat: number; lng: number };
  historical: HistoricalWeather[];
  forecast: ForecastWeather[];
  statistics: WeatherStatistics;
  updatedAt: Date;
}

export interface HistoricalWeather {
  date: Date;
  temperature: {
    min: number;
    max: number;
    avg: number;
  };
  irradiance: {
    ghi: number;
    dni: number;
    dhi: number;
  };
  wind: {
    speed: number;
    direction: number;
  };
  precipitation: number;
  cloudCover: number;
}

export interface ForecastWeather {
  date: Date;
  temperature: number;
  irradiance: number;
  windSpeed: number;
  cloudCover: number;
  rainProbability: number;
}

export interface WeatherStatistics {
  annualIrradiance: number;
  averageTemperature: number;
  peakSunHours: number;
  cloudyDays: number;
  rainyDays: number;
  seasonalFactors: number[];
}

class WeatherModelService {
  private models: Map<string, WeatherModel> = new Map();
  
  async createWeatherModel(siteId: string, lat: number, lng: number): Promise<WeatherModel> {
    const id = this.generateId();
    
    const weatherModel: WeatherModel = {
      id,
      siteId,
      location: { lat, lng },
      historical: await this.getHistoricalWeather(lat, lng),
      forecast: await this.getForecast(lat, lng),
      statistics: await this.calculateStatistics(lat, lng),
      updatedAt: new Date()
    };
    
    this.models.set(id, weatherModel);
    return weatherModel;
  }
  
  async getWeatherModel(id: string): Promise<WeatherModel | null> {
    return this.models.get(id) || null;
  }
  
  async updateForecast(id: string): Promise<WeatherModel | null> {
    const model = await this.getWeatherModel(id);
    if (!model) return null;
    
    model.forecast = await this.getForecast(model.location.lat, model.location.lng);
    model.updatedAt = new Date();
    
    this.models.set(id, model);
    return model;
  }
  
  async getSolarForecast(siteId: string, days: number = 7): Promise<{
    date: Date;
    irradiance: number;
    production: number;
    confidence: number;
  }[]> {
    const model = await this.getWeatherModel(siteId);
    if (!model) throw new Error('Weather model not found');
    
    const systemPower = 6.96; // kWp
    const efficiency = 0.85;
    
    return model.forecast.slice(0, days).map(day => ({
      date: day.date,
      irradiance: day.irradiance,
      production: systemPower * day.irradiance * efficiency,
      confidence: 0.85 - (day.cloudCover / 100) * 0.3
    }));
  }
  
  async getOptimalInstallationPeriod(siteId: string): Promise<{
    bestMonths: string[];
    averageProduction: number;
    paybackImpact: number;
  }> {
    const model = await this.getWeatherModel(siteId);
    if (!model) throw new Error('Weather model not found');
    
    const monthlyIrradiance = model.statistics.seasonalFactors.map(f => f * 5.2);
    const bestMonthsIndices = monthlyIrradiance
      .map((v, i) => ({ v, i }))
      .sort((a, b) => b.v - a.v)
      .slice(0, 3)
      .map(({ i }) => i);
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const bestMonths = bestMonthsIndices.map(i => monthNames[i]);
    
    const avgIrradiance = monthlyIrradiance.reduce((a, b) => a + b, 0) / 12;
    const bestIrradiance = bestMonthsIndices.reduce((sum, i) => sum + monthlyIrradiance[i], 0) / 3;
    const improvement = (bestIrradiance - avgIrradiance) / avgIrradiance;
    
    return {
      bestMonths,
      averageProduction: avgIrradiance * 6.96 * 0.85,
      paybackImpact: improvement * 100
    };
  }
  
  private async getHistoricalWeather(_lat: number, _lng: number): Promise<HistoricalWeather[]> {
    // DATA POLICY: previously synthesised 365 days of weather with sin() +
    // Math.random(). That is forbidden. Wire this to NASA POWER
    // (services/api/nasaApi.ts) before re-enabling.
    throw new Error(
      'WeatherModel.getHistoricalWeather is not implemented. ' +
      'Per data policy, no synthetic weather is generated. ' +
      'Wire this to services/api/nasaApi.ts (NASA POWER daily point).'
    );
  }
  
  private async getForecast(_lat: number, _lng: number): Promise<ForecastWeather[]> {
    // DATA POLICY: previously synthesised 14-day forecast with Math.random().
    // Wire this to services/api/openWeatherApi.ts.getDailyForecast() instead.
    throw new Error(
      'WeatherModel.getForecast is not implemented. ' +
      'Per data policy, no synthetic forecast is generated. ' +
      'Wire this to services/api/openWeatherApi.ts.'
    );
  }
  
  private async calculateStatistics(_lat: number, _lng: number): Promise<WeatherStatistics> {
    // DATA POLICY: previously returned hard-coded statistics that were not
    // computed from any actual weather record. Compute these from real
    // historical data once getHistoricalWeather() is wired to NASA POWER.
    throw new Error(
      'WeatherModel.calculateStatistics is not implemented. ' +
      'Per data policy, no hard-coded statistics are returned. ' +
      'Compute from real getHistoricalWeather() output once that source is wired.'
    );
  }
  
  private generateId(): string {
    return `weather_${Date.now()}_${Math.random().toString(36).substr(2, 10)}`;
  }
}

export const weatherModel = new WeatherModelService();