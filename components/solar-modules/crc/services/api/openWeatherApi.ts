// OpenWeatherMap API Integration
// Real-time weather and forecasts.
//
// DATA POLICY: This service returns ONLY values supplied by OpenWeatherMap.
// There are no synthetic fallbacks. On failure a DataUnavailableError is
// thrown so callers cannot accidentally use fabricated weather.
// Source: https://openweathermap.org/api (free tier acceptable per project policy)

import { DataUnavailableError, Provenance, Sourced, provenance, sourced } from '../provenance';

export interface CurrentWeather {
  temperature: number;
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
  /**
   * Solar irradiance is NOT a native OpenWeather field. Left undefined so
   * callers cannot mistake it for measured data.
   */
  solarIrradianceEstimated?: number;
  condition: string;
}

class OpenWeatherApiService {
  private apiKey: string;
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor(apiKey: string) {
    if (!apiKey || apiKey === 'DEMO' || apiKey === 'demo') {
      throw new Error(
        'OpenWeather API key is required. Per data policy, demo/placeholder keys are not accepted.'
      );
    }
    this.apiKey = apiKey;
  }

  async getCurrentWeather(lat: number, lon: number): Promise<Sourced<CurrentWeather>> {
    const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`;
    let response: Response;
    try {
      response = await fetch(url);
    } catch (err) {
      throw new DataUnavailableError('OpenWeatherMap', 'network error', err);
    }
    if (!response.ok) {
      throw new DataUnavailableError(
        'OpenWeatherMap',
        `HTTP ${response.status} for current weather (${lat},${lon})`
      );
    }
    const data: any = await response.json();
    if (!data?.main || !data?.weather?.[0]) {
      throw new DataUnavailableError('OpenWeatherMap', 'malformed response');
    }

    const out: CurrentWeather = {
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind?.speed ?? NaN,
      windDirection: data.wind?.deg ?? NaN,
      cloudCover: data.clouds?.all ?? NaN,
      // UV index is not in /weather; mark as NaN rather than fake 0.
      uvIndex: NaN,
      visibility: typeof data.visibility === 'number' ? data.visibility / 1000 : NaN,
      condition: data.weather[0].description,
      icon: data.weather[0].icon,
    };
    const prov: Provenance = provenance('OpenWeatherMap /weather', 'measured', {
      citation: 'https://openweathermap.org/current',
      notes: 'uvIndex unavailable on this endpoint; reported as NaN (not zero).',
    });
    return sourced(out, prov);
  }

  async getDailyForecast(
    lat: number,
    lon: number,
    days: number = 7
  ): Promise<Sourced<DailyForecast[]>> {
    const url = `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`;
    let response: Response;
    try {
      response = await fetch(url);
    } catch (err) {
      throw new DataUnavailableError('OpenWeatherMap', 'network error', err);
    }
    if (!response.ok) {
      throw new DataUnavailableError(
        'OpenWeatherMap',
        `HTTP ${response.status} for forecast (${lat},${lon})`
      );
    }
    const data: any = await response.json();
    if (!Array.isArray(data?.list)) {
      throw new DataUnavailableError('OpenWeatherMap', 'malformed forecast response');
    }

    const forecasts: DailyForecast[] = [];
    const dailyMap = new Map<string, any[]>();
    for (const item of data.list) {
      const date = String(item.dt_txt).split(' ')[0];
      if (!dailyMap.has(date)) dailyMap.set(date, []);
      dailyMap.get(date)!.push(item);
    }
    let count = 0;
    for (const [date, items] of dailyMap) {
      if (count >= days) break;
      const temps = items.map((i: any) => i.main.temp);
      forecasts.push({
        date,
        minTemp: Math.min(...temps),
        maxTemp: Math.max(...temps),
        avgTemp: temps.reduce((a: number, b: number) => a + b, 0) / temps.length,
        humidity: items[0].main.humidity,
        windSpeed: items[0].wind?.speed ?? NaN,
        cloudCover: items[0].clouds?.all ?? NaN,
        rainProbability: typeof items[0].pop === 'number' ? items[0].pop * 100 : NaN,
        condition: items[0].weather[0].description,
      });
      count++;
    }
    const prov: Provenance = provenance('OpenWeatherMap /forecast', 'measured', {
      citation: 'https://openweathermap.org/forecast5',
      notes: 'Solar irradiance is not provided by OpenWeather and is omitted.',
    });
    return sourced(forecasts, prov);
  }
}

export const createOpenWeatherApiService = (apiKey: string) => new OpenWeatherApiService(apiKey);
