// NASA POWER API Integration
// Solar irradiance, temperature, weather data
//
// DATA POLICY: This file calls the public NASA POWER service and returns
// only values supplied by NASA. There is NO synthetic fallback. If NASA
// is unreachable or returns no data, a DataUnavailableError is thrown so
// the caller cannot accidentally use fabricated numbers.
// Source: NASA Langley Research Center, POWER Project. https://power.larc.nasa.gov/

import { DataUnavailableError, Provenance, Sourced, provenance, sourced } from '../provenance';

export interface NASASolarData {
  latitude: number;
  longitude: number;
  dailyIrradiance: number[];
  averageGHI: number;
  averageDNI_estimated: number;   // derived ≈ 0.7 * GHI; flagged in provenance.notes
  averageDHI_estimated: number;   // derived ≈ 0.3 * GHI; flagged in provenance.notes
  averageTemperature: number;
  peakSunHours: number;
  monthlyData: MonthlySolarData[];
  periodStart: string;
  periodEnd: string;
}

export interface MonthlySolarData {
  month: number;
  ghi: number;
  dni_estimated: number;
  dhi_estimated: number;
  temp: number;
}

function ymd(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}${m}${day}`;
}

class NASAApiService {
  private baseUrl = 'https://power.larc.nasa.gov/api/temporal/daily/point';

  /**
   * Fetch the most recent full calendar year of NASA POWER data for (lat, lon).
   * Returns the data wrapped with provenance. Throws DataUnavailableError on
   * any failure — never substitutes synthetic values.
   */
  async getSolarData(lat: number, lon: number): Promise<Sourced<NASASolarData>> {
    // Use the most recent complete calendar year. NASA POWER usually has
    // a ~2-month lag, so previous year is the safe default.
    const now = new Date();
    const year = now.getUTCFullYear() - 1;
    const start = new Date(Date.UTC(year, 0, 1));
    const end = new Date(Date.UTC(year, 11, 31));
    const url = `${this.baseUrl}?parameters=ALLSKY_SFC_SW_DWN,T2M&community=RE&longitude=${lon}&latitude=${lat}&start=${ymd(start)}&end=${ymd(end)}&format=JSON`;

    let response: Response;
    try {
      response = await fetch(url);
    } catch (err) {
      throw new DataUnavailableError('NASA POWER', 'network error', err);
    }
    if (!response.ok) {
      throw new DataUnavailableError(
        'NASA POWER',
        `HTTP ${response.status} for (${lat},${lon}) ${ymd(start)}–${ymd(end)}`
      );
    }
    const data: any = await response.json();
    const ghiRaw = data?.properties?.parameter?.ALLSKY_SFC_SW_DWN;
    const tempRaw = data?.properties?.parameter?.T2M;
    if (!ghiRaw || !tempRaw) {
      throw new DataUnavailableError(
        'NASA POWER',
        `response missing ALLSKY_SFC_SW_DWN or T2M for (${lat},${lon})`
      );
    }
    // NASA flags missing days with -999. Drop them rather than averaging in.
    const ghiValuesAll = Object.values(ghiRaw) as number[];
    const tempValuesAll = Object.values(tempRaw) as number[];
    const ghiValues = ghiValuesAll.filter(v => typeof v === 'number' && v > -100);
    const tempValues = tempValuesAll.filter(v => typeof v === 'number' && v > -100);
    if (ghiValues.length === 0 || tempValues.length === 0) {
      throw new DataUnavailableError(
        'NASA POWER',
        `no valid days returned for (${lat},${lon}) in ${year}`
      );
    }

    // ALLSKY_SFC_SW_DWN is reported in kWh/m²/day (community=RE). Earlier
    // code multiplied by 0.0036 — that converts MJ/m²/day → kWh/m²/day.
    // Detect units by magnitude: daily kWh/m² ≤ ~10, daily MJ/m² typically 5–35.
    const ghiMean = ghiValues.reduce((a, b) => a + b, 0) / ghiValues.length;
    const looksLikeMJ = ghiMean > 12;
    const toKWh = (v: number) => (looksLikeMJ ? v * 0.2778 : v); // 1 MJ/m² = 0.2778 kWh/m²

    const dailyGHI = ghiValuesAll.map(v => (typeof v === 'number' && v > -100 ? toKWh(v) : NaN));
    const validGHI = dailyGHI.filter(v => Number.isFinite(v));
    const averageGHI = validGHI.reduce((a, b) => a + b, 0) / validGHI.length;
    const averageTemperature = tempValues.reduce((a, b) => a + b, 0) / tempValues.length;

    const monthlyData = this.calculateMonthlyAverages(dailyGHI, tempValuesAll);

    const out: NASASolarData = {
      latitude: lat,
      longitude: lon,
      dailyIrradiance: dailyGHI,
      averageGHI,
      // DNI/DHI are not in this query; we expose a transparent 0.7/0.3 split
      // and label it as 'estimate' in provenance.notes so callers can choose
      // to fetch the proper ALLSKY_SFC_SW_DNI / ALLSKY_SFC_SW_DIFF parameters.
      averageDNI_estimated: averageGHI * 0.7,
      averageDHI_estimated: averageGHI * 0.3,
      averageTemperature,
      peakSunHours: averageGHI,
      monthlyData,
      periodStart: start.toISOString().slice(0, 10),
      periodEnd: end.toISOString().slice(0, 10),
    };

    const prov: Provenance = provenance('NASA POWER (LARC) v9 daily point', 'measured', {
      periodStart: out.periodStart,
      periodEnd: out.periodEnd,
      citation: 'https://power.larc.nasa.gov/docs/services/api/temporal/daily/',
      notes:
        'GHI and T2M are measured/reanalysis values from NASA POWER. ' +
        'averageDNI_estimated and averageDHI_estimated are NOT from NASA — they are a fixed 0.7/0.3 GHI split exposed for backward compatibility; for true DNI/DHI re-query NASA with ALLSKY_SFC_SW_DNI and ALLSKY_SFC_SW_DIFF.',
    });
    return sourced(out, prov);
  }

  private calculateMonthlyAverages(ghiValues: number[], tempValues: number[]): MonthlySolarData[] {
    const monthlyData: MonthlySolarData[] = [];
    const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let dayIndex = 0;
    
    for (let month = 0; month < 12; month++) {
      let monthGHI = 0;
      let monthTemp = 0;
      let validDays = 0;
      let validTempDays = 0;
      
      for (let day = 0; day < daysPerMonth[month]; day++) {
        if (dayIndex < ghiValues.length) {
          const g = ghiValues[dayIndex];
          const t = tempValues[dayIndex];
          if (Number.isFinite(g) && g > -100) {
            monthGHI += g;
            validDays++;
          }
          if (typeof t === 'number' && t > -100) {
            monthTemp += t;
            validTempDays++;
          }
          dayIndex++;
        }
      }
      
      const ghiAvg = validDays > 0 ? monthGHI / validDays : NaN;
      monthlyData.push({
        month: month + 1,
        ghi: ghiAvg,
        dni_estimated: Number.isFinite(ghiAvg) ? ghiAvg * 0.7 : NaN,
        dhi_estimated: Number.isFinite(ghiAvg) ? ghiAvg * 0.3 : NaN,
        temp: validTempDays > 0 ? monthTemp / validTempDays : NaN
      });
    }
    
    return monthlyData;
  }
}

export const nasaApi = new NASAApiService();