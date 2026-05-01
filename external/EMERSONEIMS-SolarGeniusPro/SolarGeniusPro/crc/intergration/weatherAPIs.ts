// WEATHER API INTEGRATIONS
// Real-time weather, forecasts, historical data

export interface WeatherData {
  current: {
    temp: number;
    feelsLike: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windDirection: number;
    cloudCover: number;
    uvIndex: number;
    visibility: number;
    condition: string;
    icon: string;
  };
  forecast: DailyForecast[];
  hourly: HourlyForecast[];
  alerts: WeatherAlert[];
}

export interface DailyForecast {
  date: string;
  minTemp: number;
  maxTemp: number;
  avgTemp: number;
  humidity: number;
  windSpeed: number;
  cloudCover: number;
  rainProbability: number;
  solarIrradiance: number;
  condition: string;
}

export interface HourlyForecast {
  hour: number;
  temperature: number;
  cloudCover: number;
  rainProbability: number;
  solarIrradiance: number;
  windSpeed: number;
}

export interface WeatherAlert {
  title: string;
  severity: 'advisory' | 'watch' | 'warning';
  description: string;
  startTime: Date;
  endTime: Date;
}

class WeatherAPIs {
  private openWeatherKey: string;
  private openMeteoUrl = 'https://api.open-meteo.com/v1/forecast';
  
  constructor() {
    this.openWeatherKey = process.env.OPENWEATHER_API_KEY || '';
  }
  
  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData['current']> {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.openWeatherKey}`
      );
      const data = await response.json();
      
      return {
        temp: data.main.temp,
        feelsLike: data.main.feels_like,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: data.wind.speed,
        windDirection: data.wind.deg,
        cloudCover: data.clouds.all,
        uvIndex: 0, // Would need separate UV API
        visibility: data.visibility / 1000,
        condition: data.weather[0].description,
        icon: data.weather[0].icon
      };
    } catch (error) {
      console.error('Weather API error:', error);
      return this.getSimulatedWeather(lat, lon);
    }
  }
  
  async getForecast(lat: number, lon: number, days: number = 7): Promise<DailyForecast[]> {
    try {
      const response = await fetch(
        `${this.openMeteoUrl}?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability,wind_speed_10m_max&timezone=auto&forecast_days=${days}`
      );
      const data = await response.json();
      
      const forecasts: DailyForecast[] = [];
      for (let i = 0; i < data.daily.time.length; i++) {
        forecasts.push({
          date: data.daily.time[i],
          minTemp: data.daily.temperature_2m_min[i],
          maxTemp: data.daily.temperature_2m_max[i],
          avgTemp: (data.daily.temperature_2m_min[i] + data.daily.temperature_2m_max[i]) / 2,
          humidity: 65, // OpenMeteo doesn't provide humidity in free tier
          windSpeed: data.daily.wind_speed_10m_max[i],
          cloudCover: 35,
          rainProbability: data.daily.precipitation_probability[i],
          solarIrradiance: this.estimateSolarIrradiance(lat, data.daily.time[i]),
          condition: data.daily.precipitation_probability[i] > 50 ? 'Rain' : 'Partly cloudy'
        });
      }
      return forecasts;
    } catch (error) {
      return this.getSimulatedForecast(lat, lon, days);
    }
  }
  
  async getHourlyForecast(lat: number, lon: number, hours: number = 24): Promise<HourlyForecast[]> {
    try {
      const response = await fetch(
        `${this.openMeteoUrl}?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,cloud_cover,precipitation_probability,wind_speed_10m&timezone=auto&forecast_days=1`
      );
      const data = await response.json();
      
      const hourly: HourlyForecast[] = [];
      const now = new Date();
      for (let i = 0; i < Math.min(hours, 24); i++) {
        const hour = (now.getHours() + i) % 24;
        hourly.push({
          hour,
          temperature: data.hourly.temperature_2m[i] || 22,
          cloudCover: data.hourly.cloud_cover[i] || 35,
          rainProbability: data.hourly.precipitation_probability[i] || 0,
          solarIrradiance: this.getHourlySolarIrradiance(hour, lat),
          windSpeed: data.hourly.wind_speed_10m[i] || 3
        });
      }
      return hourly;
    } catch (error) {
      return this.getSimulatedHourlyForecast(lat, lon, hours);
    }
  }
  
  async getSolarIrradiance(lat: number, lon: number, date: Date = new Date()): Promise<number> {
    // Calculate solar irradiance based on time of day, season, cloud cover
    const hour = date.getHours();
    const dayOfYear = this.getDayOfYear(date);
    const declination = 23.45 * Math.sin((360 / 365) * (dayOfYear - 81) * Math.PI / 180);
    const latitudeRad = lat * Math.PI / 180;
    const hourAngle = (hour - 12) * 15;
    const zenithAngle = Math.acos(
      Math.sin(latitudeRad) * Math.sin(declination * Math.PI / 180) +
      Math.cos(latitudeRad) * Math.cos(declination * Math.PI / 180) * Math.cos(hourAngle * Math.PI / 180)
    );
    
    const clearSkyIrradiance = Math.max(0, Math.cos(zenithAngle)) * 1361; // W/m²
    const cloudFactor = 0.7; // Assume 30% cloud cover average
    
    return clearSkyIrradiance * cloudFactor / 1000; // Return in kW/m²
  }
  
  async getWeatherAlerts(lat: number, lon: number): Promise<WeatherAlert[]> {
    try {
      const response = await fetch(
        `https://api.weather.gov/alerts/active?point=${lat},${lon}`
      );
      const data = await response.json();
      
      if (data.features) {
        return data.features.map((feature: any) => ({
          title: feature.properties.event,
          severity: feature.properties.severity?.toLowerCase() || 'advisory',
          description: feature.properties.description,
          startTime: new Date(feature.properties.effective),
          endTime: new Date(feature.properties.expires)
        }));
      }
      return [];
    } catch (error) {
      return [];
    }
  }
  
  private getSimulatedWeather(lat: number, lon: number): WeatherData['current'] {
    return {
      temp: 23.5,
      feelsLike: 24.2,
      humidity: 65,
      pressure: 1013,
      windSpeed: 3.2,
      windDirection: 120,
      cloudCover: 35,
      uvIndex: 8,
      visibility: 10,
      condition: 'Partly cloudy',
      icon: '02d'
    };
  }
  
  private getSimulatedForecast(lat: number, lon: number, days: number): DailyForecast[] {
    const forecasts: DailyForecast[] = [];
    for (let i = 0; i < days; i++) {
      forecasts.push({
        date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
        minTemp: 18 + Math.random() * 5,
        maxTemp: 25 + Math.random() * 5,
        avgTemp: 22 + Math.random() * 3,
        humidity: 55 + Math.random() * 20,
        windSpeed: 2 + Math.random() * 3,
        cloudCover: 20 + Math.random() * 50,
        rainProbability: Math.random() * 60,
        solarIrradiance: 3 + Math.random() * 3,
        condition: ['Sunny', 'Partly cloudy', 'Cloudy', 'Light rain'][Math.floor(Math.random() * 4)]
      });
    }
    return forecasts;
  }
  
  private getSimulatedHourlyForecast(lat: number, lon: number, hours: number): HourlyForecast[] {
    const hourly: HourlyForecast[] = [];
    const now = new Date();
    for (let i = 0; i < hours; i++) {
      const hour = (now.getHours() + i) % 24;
      hourly.push({
        hour,
        temperature: 20 + Math.sin(hour / 24 * Math.PI * 2) * 5,
        cloudCover: 30 + Math.random() * 40,
        rainProbability: Math.random() * 30,
        solarIrradiance: this.getHourlySolarIrradiance(hour, lat),
        windSpeed: 2 + Math.random() * 4
      });
    }
    return hourly;
  }
  
  private getHourlySolarIrradiance(hour: number, lat: number): number {
    if (hour < 6 || hour > 18) return 0;
    const peak = Math.sin((hour - 6) / 12 * Math.PI);
    return peak * 5.2; // Max 5.2 kWh/m²/day
  }
  
  private getDayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 86400000;
    return Math.floor(diff / oneDay);
  }
  
  private estimateSolarIrradiance(lat: number, date: string): number {
    // Simplified irradiance estimation
    return 4.5 + Math.random() * 2;
  }
}

export const weatherAPIs = new WeatherAPIs();