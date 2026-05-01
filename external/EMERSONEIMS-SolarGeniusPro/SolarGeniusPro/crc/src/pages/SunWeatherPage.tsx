// MODULE — Sun & Weather Analysis page
// Combines real free public APIs into a single visualization page:
//   - /api/solar/sun-position    (Michalsky 1988)
//   - /api/solar/sun-path/:date  (24h hourly samples)
//   - /api/solar/seasonal        (monthly daylight + peak elevation)
//   - /api/weather/:lat/:lon     (Open-Meteo current + forecast)
//   - /api/nasa/solar/:lat/:lon  (NASA POWER monthly irradiance)
// All data is real and sourced. Empty-state on upstream failure.

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Wrap = styled.div` padding: 1.25rem; max-width: 1300px; margin: 0 auto; color: #E6F1FF; `;
const Card = styled.section`
  background: rgba(11, 18, 48, 0.55);
  border: 1px solid rgba(0, 217, 255, 0.18);
  border-radius: 12px;
  padding: 1.1rem 1.2rem;
  margin-bottom: 1rem;
`;
const Grid = styled.div` display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; `;
const Field = styled.label`
  display: flex; flex-direction: column; gap: 0.2rem; font-size: 0.85rem;
  color: rgba(230,241,255,0.75);
  input {
    background: #0b1230; color: #E6F1FF;
    border: 1px solid rgba(0,217,255,0.25); border-radius: 6px;
    padding: 0.45rem 0.6rem; font-size: 0.92rem;
  }
`;
const Stat = styled.div`
  background: rgba(0,217,255,0.06); border: 1px solid rgba(0,217,255,0.2);
  border-radius: 8px; padding: 0.7rem 0.9rem;
  .label { font-size: 0.72rem; color: rgba(230,241,255,0.6); text-transform: uppercase; letter-spacing: 0.05em; }
  .value { font-size: 1.4rem; font-weight: 700; color: #00D9FF; }
  .sub   { font-size: 0.72rem; color: rgba(230,241,255,0.55); }
`;
const Pill = styled.span<{ $tone?: 'ok' | 'warn' }>`
  display: inline-block; padding: 2px 8px; border-radius: 999px;
  font-size: 0.72rem; border: 1px solid currentColor;
  background: ${p => p.$tone === 'warn' ? 'rgba(251,191,36,0.15)' : 'rgba(34,197,94,0.15)'};
  color: ${p => p.$tone === 'warn' ? '#fcd34d' : '#86efac'};
`;

const today = new Date().toISOString().slice(0, 10);

const SunWeatherPage: React.FC = () => {
  const [lat, setLat] = useState(-1.2865);
  const [lon, setLon] = useState(36.8172);
  const [date, setDate] = useState(today);
  const [sunNow, setSunNow] = useState<any>(null);
  const [sunPath, setSunPath] = useState<any[]>([]);
  const [seasonal, setSeasonal] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);
  const [nasa, setNasa] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setBusy(true); setErrors({});
    const grab = async (url: string, key: string) => {
      try {
        const r = await fetch(url);
        const j = await r.json();
        if (!r.ok || j.success === false) throw new Error(j.error || `HTTP ${r.status}`);
        return j.data ?? j;
      } catch (e: any) {
        setErrors(prev => ({ ...prev, [key]: e.message }));
        return null;
      }
    };
    const [s1, s2, s3, w, n] = await Promise.all([
      grab(`/api/solar/sun-position?lat=${lat}&lon=${lon}`, 'sun'),
      grab(`/api/solar/sun-path/${date}?lat=${lat}&lon=${lon}`, 'path'),
      grab(`/api/solar/seasonal?lat=${lat}&lon=${lon}`, 'seasonal'),
      grab(`/api/weather/${lat}/${lon}`, 'weather'),
      grab(`/api/nasa/solar/${lat}/${lon}`, 'nasa')
    ]);
    setSunNow(s1);
    setSunPath((s2?.samples || s2 || []).map((p: any) => ({
      hour: p.hourUTC != null ? `${String(p.hourUTC).padStart(2, '0')}:00` : (p.hour ?? p.timeUTC?.slice(11, 16)),
      altitude: p.elevation ?? p.altitudeDeg ?? p.altitude,
      azimuth:  p.azimuth  ?? p.azimuthDeg
    })));
    setSeasonal(s3);
    setWeather(w);
    setNasa(n);
    setBusy(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  // NASA POWER /daily returns properties.parameter.ALLSKY_SFC_SW_DWN keyed by YYYYMMDD.
  // Aggregate to monthly mean kWh/m²/day.
  const nasaMonthly = (() => {
    if (!nasa) return [];
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const ghi = nasa.properties?.parameter?.ALLSKY_SFC_SW_DWN
             || nasa.parameters?.ALLSKY_SFC_SW_DWN
             || nasa.monthly
             || null;
    if (!ghi) return [];
    if (Array.isArray(ghi)) return ghi.slice(0, 12).map((v: number, i: number) => ({ month: months[i], ghiKwhM2: v }));
    // Daily keys YYYYMMDD
    const buckets: number[][] = Array.from({ length: 12 }, () => []);
    for (const [k, v] of Object.entries(ghi)) {
      if (k === 'ANN' || /^\d{4}$/.test(k)) continue;
      const m = k.length >= 6 ? parseInt(k.slice(4, 6), 10) - 1 : -1;
      const num = typeof v === 'number' ? v : parseFloat(v as string);
      if (m >= 0 && m < 12 && Number.isFinite(num) && num > -100) buckets[m].push(num);
    }
    return buckets.map((arr, i) => ({
      month: months[i],
      ghiKwhM2: arr.length ? +(arr.reduce((s, x) => s + x, 0) / arr.length).toFixed(2) : 0
    })).filter(r => r.ghiKwhM2 > 0);
  })();

  return (
    <Wrap>
      <h1 style={{ marginTop: 0 }}>☀️ Sun & Weather Analysis</h1>
      <p style={{ color: 'rgba(230,241,255,0.65)' }}>
        Real solar geometry (Michalsky 1988) + Open-Meteo weather + NASA POWER irradiance
        for any location on Earth. All values are sourced; nothing is fabricated.
      </p>

      <Card>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.8rem', alignItems: 'end' }}>
          <Field>
            <span>Latitude (°)</span>
            <input type="number" step={0.0001} value={lat} onChange={e => setLat(parseFloat(e.target.value))} />
          </Field>
          <Field>
            <span>Longitude (°)</span>
            <input type="number" step={0.0001} value={lon} onChange={e => setLon(parseFloat(e.target.value))} />
          </Field>
          <Field>
            <span>Date (sun-path)</span>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </Field>
          <button onClick={load} disabled={busy} style={{
            padding: '0.55rem 1rem', borderRadius: 8, border: 0,
            background: '#00D9FF', color: '#050818', fontWeight: 700, cursor: 'pointer',
            opacity: busy ? 0.45 : 1
          }}>{busy ? 'Loading…' : 'Analyse'}</button>
        </div>
      </Card>

      {/* Live sun & weather snapshot */}
      <Card>
        <h3 style={{ marginTop: 0 }}>Now</h3>
        <Grid>
          <Stat>
            <div className="label">Sun altitude</div>
            <div className="value">{sunNow ? `${(sunNow.elevation ?? sunNow.altitudeDeg ?? sunNow.altitude ?? 0).toFixed(1)}°` : '—'}</div>
            <div className="sub">{sunNow ? `azimuth ${(sunNow.azimuth ?? sunNow.azimuthDeg ?? 0).toFixed(1)}°` : 'Michalsky 1988'}</div>
          </Stat>
          <Stat>
            <div className="label">Air temperature</div>
            <div className="value">{weather?.temp != null ? `${weather.temp}°C` : '—'}</div>
            <div className="sub">Open-Meteo current</div>
          </Stat>
          <Stat>
            <div className="label">Cloud cover</div>
            <div className="value">{weather?.cloud_cover != null ? `${weather.cloud_cover}%` : '—'}</div>
            <div className="sub">Open-Meteo</div>
          </Stat>
          <Stat>
            <div className="label">Wind</div>
            <div className="value">{weather?.wind_speed != null ? `${weather.wind_speed} m/s` : '—'}</div>
            <div className="sub">{weather?.humidity != null ? `humidity ${weather.humidity}%` : 'Open-Meteo'}</div>
          </Stat>
        </Grid>
        {Object.keys(errors).length > 0 && (
          <div style={{ marginTop: '0.8rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {Object.entries(errors).map(([k, v]) => <Pill $tone="warn" key={k}>{k}: {v}</Pill>)}
          </div>
        )}
      </Card>

      {/* Sun path chart */}
      <Card>
        <h3 style={{ marginTop: 0 }}>Sun path — {date}</h3>
        {sunPath.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={sunPath} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="hour" stroke="rgba(230,241,255,0.6)" tick={{ fontSize: 11 }} />
              <YAxis stroke="rgba(230,241,255,0.6)" tick={{ fontSize: 11 }} label={{ value: 'degrees', angle: -90, position: 'insideLeft', fill: 'rgba(230,241,255,0.5)' }} />
              <Tooltip contentStyle={{ background: '#0b1230', border: '1px solid rgba(0,217,255,0.3)', borderRadius: 8 }} />
              <Legend />
              <Line type="monotone" dataKey="altitude" stroke="#fbbf24" strokeWidth={2} dot={false} name="Altitude (°)" />
              <Line type="monotone" dataKey="azimuth"  stroke="#00D9FF" strokeWidth={2} dot={false} name="Azimuth (°)" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p style={{ color: 'rgba(230,241,255,0.55)' }}>No sun-path data — check date / location or upstream availability.</p>
        )}
        <p style={{ marginTop: '0.4rem', fontSize: '0.78rem', color: 'rgba(253,230,138,0.85)' }}>
          <strong>Source:</strong> Michalsky 1988 sun-position algorithm, accuracy ±0.01°.
        </p>
      </Card>

      {/* NASA POWER monthly irradiance */}
      <Card>
        <h3 style={{ marginTop: 0 }}>NASA POWER — Monthly GHI (kWh/m²/day)</h3>
        {nasaMonthly.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={nasaMonthly} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="month" stroke="rgba(230,241,255,0.6)" tick={{ fontSize: 11 }} />
              <YAxis stroke="rgba(230,241,255,0.6)" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#0b1230', border: '1px solid rgba(0,217,255,0.3)', borderRadius: 8 }} />
              <Bar dataKey="ghiKwhM2" fill="#00D9FF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p style={{ color: 'rgba(230,241,255,0.55)' }}>NASA POWER data not available for this location (or upstream offline).</p>
        )}
        <p style={{ marginTop: '0.4rem', fontSize: '0.78rem', color: 'rgba(253,230,138,0.85)' }}>
          <strong>Source:</strong> NASA POWER API · ALLSKY_SFC_SW_DWN climatology · public domain.
        </p>
      </Card>

      {/* Seasonal summary */}
      {seasonal && (
        <Card>
          <h3 style={{ marginTop: 0 }}>Seasonal summary</h3>
          <pre style={{
            margin: 0, padding: '0.6rem 0.8rem', background: 'rgba(0,0,0,0.35)',
            border: '1px solid rgba(0,217,255,0.2)', borderRadius: 8,
            color: '#cffafe', fontSize: '0.8rem', maxHeight: 280, overflow: 'auto', whiteSpace: 'pre-wrap'
          }}>{JSON.stringify(seasonal, null, 2)}</pre>
        </Card>
      )}
    </Wrap>
  );
};

export default SunWeatherPage;
