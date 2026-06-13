/**
 * ADVANCED SUITE — interactive dashboard
 * Every feature card is a clickable button that opens a drawer running a real
 * backend endpoint, or navigates to the dedicated page.
 */

import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useSolarStore } from '../src/services/store';
import { finance, sustain, research, biz, core, bos, eng, engPro, engElite, engGlobal, engApproval, archApproval } from '../src/services/api';

// ============== STYLES ==============
const Shell = styled.div`
  background: linear-gradient(135deg, #050B22 0%, #0A1438 100%);
  color: #E6F1FF; padding: clamp(12px, 2.5vw, 24px); min-height: 100vh;
  font-family: 'Inter','Segoe UI',sans-serif;
`;
const Header = styled.div`
  background: linear-gradient(135deg, rgba(11,132,87,0.18), rgba(0,217,255,0.10));
  border: 1px solid rgba(0,217,255,0.25); padding: clamp(16px,3vw,28px);
  border-radius: 14px; margin-bottom: 22px;
  h1 { margin: 0; font-size: clamp(1.4rem,3.4vw,2.1rem); }
  p  { margin: 8px 0 0; opacity: 0.78; font-size: clamp(0.86rem,1.6vw,1rem); }
`;
const Tabs = styled.div`display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 18px;`;
const TabBtn = styled.button<{ $active?: boolean }>`
  padding: 8px 14px; border-radius: 8px;
  background: ${p => p.$active ? '#0B8457' : 'rgba(255,255,255,0.06)'};
  color: ${p => p.$active ? 'white' : 'rgba(230,241,255,0.85)'};
  border: 1px solid ${p => p.$active ? '#0B8457' : 'rgba(255,255,255,0.12)'};
  font-size: 0.86rem; font-weight: 600; cursor: pointer;
  &:hover { border-color: rgba(0,217,255,0.4); }
`;
const SectionTitle = styled.div`
  display: flex; align-items: baseline; justify-content: space-between;
  gap: 12px; margin: 18px 0 10px;
  h2 { margin: 0; font-size: 1.05rem; color: #00D9FF; }
  small { opacity: 0.55; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; }
`;
const Grid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px;
`;
const Card = styled.button`
  text-align: left; cursor: pointer; background: rgba(11,18,48,0.65);
  border: 1px solid rgba(0,217,255,0.18); border-radius: 12px;
  padding: 16px 16px 14px; color: inherit; font: inherit;
  display: flex; flex-direction: column; gap: 8px;
  transition: transform .14s, border-color .14s, box-shadow .14s;
  &:hover { transform: translateY(-2px); border-color: rgba(0,217,255,0.55); box-shadow: 0 8px 22px rgba(0,217,255,0.10); }
  &:focus-visible { outline: 2px solid #00D9FF; outline-offset: 2px; }
`;
const CardIcon = styled.div`font-size: 1.6rem; line-height: 1;`;
const CardTitle = styled.div`font-weight: 700; font-size: 0.95rem;`;
const CardDesc = styled.div`font-size: 0.8rem; opacity: 0.72; line-height: 1.45; min-height: 38px;`;
const CardFoot = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-top: 6px; padding-top: 8px; border-top: 1px dashed rgba(255,255,255,0.10);
  font-size: 0.74rem;
  span:first-child { opacity: 0.55; text-transform: uppercase; letter-spacing: 0.06em; }
  span:last-child { color: #5BE3B5; font-weight: 600; }
`;
const KpiRow = styled.div`
  display: grid; gap: 12px; margin-bottom: 18px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
`;
const Kpi = styled.div`
  background: rgba(11,18,48,0.65); border: 1px solid rgba(0,217,255,0.18);
  border-radius: 12px; padding: 14px;
  .l { font-size: 0.7rem; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.08em; }
  .v { font-size: 1.5rem; font-weight: 700; color: #00D9FF; margin-top: 4px; }
  .s { font-size: 0.72rem; opacity: 0.7; margin-top: 2px; }
`;
const Banner = styled.div<{ $tone?: 'info'|'ok'|'warn' }>`
  margin: 0 0 18px; padding: 10px 14px; border-radius: 8px;
  font-size: 0.84rem; line-height: 1.5;
  background: ${p => p.$tone==='ok' ? 'rgba(34,197,94,0.10)' : p.$tone==='warn' ? 'rgba(251,191,36,0.10)' : 'rgba(0,217,255,0.08)'};
  border: 1px solid ${p => p.$tone==='ok' ? 'rgba(34,197,94,0.30)' : p.$tone==='warn' ? 'rgba(251,191,36,0.35)' : 'rgba(0,217,255,0.25)'};
  color: ${p => p.$tone==='ok' ? '#86efac' : p.$tone==='warn' ? '#fcd34d' : '#9be4ff'};
`;
const Backdrop = styled.div<{ $open: boolean }>`
  position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 200;
  opacity: ${p => p.$open ? 1 : 0}; pointer-events: ${p => p.$open ? 'auto' : 'none'};
  transition: opacity .15s;
`;
const Drawer = styled.aside<{ $open: boolean }>`
  position: fixed; top: 0; right: 0; height: 100vh; width: min(640px, 100vw);
  background: #0A1336; border-left: 1px solid rgba(0,217,255,0.25);
  box-shadow: -10px 0 40px rgba(0,0,0,0.4); z-index: 201;
  transform: translateX(${p => p.$open ? '0' : '100%'});
  transition: transform .22s cubic-bezier(.2,.8,.2,1);
  display: flex; flex-direction: column;
`;
const DrawerHead = styled.div`
  display: flex; align-items: center; gap: 12px; padding: 14px 18px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  .icon { font-size: 1.6rem; }
  .ttl { font-weight: 700; font-size: 1.05rem; }
  .sub { font-size: 0.75rem; opacity: 0.6; }
  .close { margin-left: auto; background: transparent; border: 0; color: #fff;
           font-size: 1.6rem; cursor: pointer; padding: 4px 10px; border-radius: 6px; }
  .close:hover { background: rgba(255,255,255,0.08); }
`;
const DrawerBody = styled.div`padding: 16px 18px; overflow-y: auto; flex: 1;`;
const Field = styled.label`
  display: block; margin-bottom: 12px;
  .l { display: block; font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.06em; color: #9be4ff; margin-bottom: 4px; font-weight: 600; }
  input, textarea, select {
    width: 100%; box-sizing: border-box; padding: 9px 11px;
    background: rgba(0,0,0,0.30); color: #fff;
    border: 1px solid rgba(0,217,255,0.25); border-radius: 7px;
    font: inherit; font-size: 0.92rem;
  }
  input:focus, textarea:focus, select:focus { outline: none; border-color: #00D9FF; }
`;
const Run = styled.button`
  width: 100%; padding: 12px; margin-top: 6px;
  background: linear-gradient(135deg, #0B8457, #0d9968); color: white;
  border: 0; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 0.95rem;
  &:hover { filter: brightness(1.08); }
  &:disabled { opacity: 0.55; cursor: not-allowed; }
`;
const Panel = styled.div`
  margin-top: 14px; padding: 14px 16px; border-radius: 10px;
  background: rgba(0,40,30,0.32); border: 1px solid rgba(0,217,255,0.20);
  color: #E6F1FF; font-size: 0.9rem; line-height: 1.5;
`;
const PanelTitle = styled.div`
  font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase;
  color: #5BE3B5; font-weight: 700; margin-bottom: 10px;
`;
const StatRow = styled.div`
  display: flex; justify-content: space-between; gap: 14px;
  padding: 7px 0; border-bottom: 1px dashed rgba(255,255,255,0.07);
  &:last-child { border-bottom: 0; }
  .k { opacity: 0.72; font-size: 0.85rem; }
  .v { font-weight: 600; color: #fff; text-align: right; word-break: break-word; }
`;
const Pill = styled.span<{ $tone?: 'ok'|'warn'|'info' }>`
  display: inline-block; padding: 3px 10px; border-radius: 999px;
  font-size: 0.75rem; font-weight: 600;
  background: ${p => p.$tone==='ok' ? 'rgba(34,197,94,0.18)' : p.$tone==='warn' ? 'rgba(251,191,36,0.18)' : 'rgba(0,217,255,0.18)'};
  color: ${p => p.$tone==='ok' ? '#86efac' : p.$tone==='warn' ? '#fcd34d' : '#9be4ff'};
`;
const Note = styled.div`
  margin-top: 12px; font-size: 0.78rem; opacity: 0.65;
  padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.08);
  line-height: 1.5;
`;
const BarTrack = styled.div`
  height: 10px; border-radius: 5px; background: rgba(255,255,255,0.08); overflow: hidden;
  margin-top: 6px;
`;
const BarFill = styled.div<{ $pct: number }>`
  height: 100%; width: ${p => Math.max(0, Math.min(100, p.$pct))}%;
  background: linear-gradient(90deg, #0B8457, #00D9FF);
  transition: width .3s ease;
`;
const Hint = styled.div`
  margin-bottom: 14px; padding: 10px 12px; border-radius: 8px;
  background: rgba(255,255,255,0.04); font-size: 0.85rem; line-height: 1.5;
`;

// ============== FEATURES ==============
type Tier = 'ai' | 'financial' | 'iot' | 'sustainability' | 'design';

interface FeatureCfg {
  id: string; icon: string; title: string; desc: string; tier: Tier; status: string;
  open: { kind: 'drawer'; runner: string } | { kind: 'route'; path: string };
}

const FEATURES: FeatureCfg[] = [
  { id: 'storage-optimizer', icon: '🔋', title: 'AI Storage Optimizer', tier: 'ai', desc: 'TOU battery dispatch — when to charge/discharge to maximise self-consumption', status: 'Run live', open: { kind: 'drawer', runner: 'tou-dispatch' } },
  { id: 'predictive-maint',  icon: '🚨', title: 'Predictive Maintenance', tier: 'ai', desc: 'EWMA + z-score anomaly detection on inverter telemetry', status: 'Run live', open: { kind: 'drawer', runner: 'fault-prediction' } },
  { id: 'smart-load',        icon: '⚡', title: 'Smart Load Management', tier: 'ai', desc: 'Holt-Winters seasonal load forecast', status: 'Run live', open: { kind: 'drawer', runner: 'load-forecast' } },
  { id: 'weather-alerts',    icon: '☁️', title: 'Weather Alerts', tier: 'ai', desc: 'Open-Meteo live forecast at the project coordinates', status: 'Live', open: { kind: 'drawer', runner: 'weather' } },
  { id: 'ar-installer',      icon: '📱', title: 'AR Installation Guide', tier: 'ai', desc: 'Step-by-step procedures from the Repair & Maintenance library', status: 'Open', open: { kind: 'route', path: '/repair' } },
  { id: 'energy-assistant',  icon: '🤖', title: 'AI Energy Assistant', tier: 'ai', desc: 'Rule-based NL advisor — sizing, savings, ROI, faults', status: 'Run live', open: { kind: 'drawer', runner: 'nlp-advisor' } },
  { id: 'independence-score',icon: '💚', title: 'Energy Independence Score', tier: 'ai', desc: 'Live score from your project: yield ÷ consumption', status: 'From project', open: { kind: 'drawer', runner: 'independence' } },
  { id: 'benchmark',         icon: '📈', title: 'Performance Benchmarking', tier: 'ai', desc: 'Compare specific yield (kWh/kWp) vs KE climate-zone median', status: 'From project', open: { kind: 'drawer', runner: 'benchmark' } },
  { id: 'finance-roi',       icon: '💰', title: 'Financial Modeling', tier: 'financial', desc: '25-yr NPV + IRR using EPRA tariffs and your project capex', status: 'Run live', open: { kind: 'drawer', runner: 'finance-roi' } },
  { id: 'carbon-credits',    icon: '🌍', title: 'Carbon Credits', tier: 'financial', desc: 'CO₂ offset valuation at Voluntary Carbon Market price', status: 'Run live', open: { kind: 'drawer', runner: 'carbon-credits' } },
  { id: 'loan-vs-cash',      icon: '🏦', title: 'Loan vs Cash', tier: 'financial', desc: 'Compare upfront-cash vs bank financing for your system', status: 'Run live', open: { kind: 'drawer', runner: 'loan-vs-cash' } },
  { id: 'currency-fx',       icon: '💲', title: 'FX Quote Conversion', tier: 'financial', desc: 'Live USD/KES/EUR rates from Frankfurter (ECB)', status: 'Run live', open: { kind: 'drawer', runner: 'currency' } },
  { id: 'permit-pack',       icon: '🏗️', title: 'Permit Pack (KE)', tier: 'financial', desc: 'EPRA & utility-interconnect document checklist', status: 'Run live', open: { kind: 'drawer', runner: 'permit-pack' } },
  { id: 'microgrid',         icon: '🏘️', title: 'Microgrid Sizing', tier: 'financial', desc: 'Size a community microgrid by households + productive load', status: 'Run live', open: { kind: 'drawer', runner: 'microgrid' } },
  { id: 'twin',              icon: '🤖', title: 'Digital Twin', tier: 'financial', desc: 'Project state machine — design → quote → install → commissioned', status: 'Open', open: { kind: 'route', path: '/workflow' } },
  { id: 'supply-chain',      icon: '🚚', title: 'Supply-Chain Optimisation', tier: 'financial', desc: 'Compare supplier prices and lead times', status: 'Run live', open: { kind: 'drawer', runner: 'suppliers' } },
  { id: 'grid-intel',        icon: '🌐', title: 'Grid Intelligence', tier: 'iot', desc: 'KPLC tariff bill estimator', status: 'Run live', open: { kind: 'drawer', runner: 'tariff' } },
  { id: 'fleet',             icon: '👥', title: 'Fleet Management', tier: 'iot', desc: 'Live portfolio across all installed sites', status: 'Run live', open: { kind: 'drawer', runner: 'portfolio' } },
  { id: 'ev-charging',       icon: '🚗', title: 'EV Charging', tier: 'iot', desc: 'Annual EV kWh, CO₂ avoided & savings vs petrol/diesel', status: 'Run live', open: { kind: 'drawer', runner: 'ev-charging' } },
  { id: 'water-heater',      icon: '💧', title: 'Diesel vs Solar TCO', tier: 'iot', desc: 'Diesel boiler vs solar-thermal TCO + payback', status: 'Run live', open: { kind: 'drawer', runner: 'diesel-vs-solar' } },
  { id: 'mqtt-status',       icon: '📡', title: 'IoT MQTT Status', tier: 'iot', desc: 'MQTT broker bridge status for live inverter telemetry', status: 'Live', open: { kind: 'drawer', runner: 'mqtt' } },
  { id: 'carbon-footprint',  icon: '🌱', title: 'Carbon Footprint', tier: 'sustainability', desc: 'IEA 2024 country grid factors — annual tCO₂', status: 'Run live', open: { kind: 'drawer', runner: 'carbon-footprint' } },
  { id: 'solar-offset',      icon: '🌳', title: '25-yr Solar CO₂ Offset', tier: 'sustainability', desc: 'Lifetime grid emissions avoided + tree-equivalent', status: 'Run live', open: { kind: 'drawer', runner: 'solar-offset' } },
  { id: 'emission-factors',  icon: '📊', title: 'Emission Factors Reference', tier: 'sustainability', desc: 'IEA 11-country grid factors + Climate TRACE', status: 'Open', open: { kind: 'drawer', runner: 'emission-factors' } },
  { id: 'panel-counter',     icon: '📐', title: 'Roof Panel Counter', tier: 'sustainability', desc: 'Max panels at IEC 62548 setbacks for a roof area', status: 'Run live', open: { kind: 'drawer', runner: 'panel-counter' } },
  { id: 'p2p-energy',        icon: '🔗', title: 'P2P Energy Trading', tier: 'sustainability', desc: 'Blockchain energy marketplace — pilot, EPRA approval pending', status: 'Pilot', open: { kind: 'drawer', runner: 'pilot' } },
  { id: 'carbon-nft',        icon: '🪙', title: 'Carbon NFTs', tier: 'sustainability', desc: 'Tokenise carbon credits — Polygon testnet ready', status: 'Pilot', open: { kind: 'drawer', runner: 'pilot' } },
  { id: 'design-studio',     icon: '🎨', title: 'Design Studio AI', tier: 'design', desc: 'Drag-and-drop array design with shading and string topology', status: 'Open', open: { kind: 'route', path: '/design-studio' } },
  { id: 'panel-layout',      icon: '🟦', title: 'Panel Layout AI', tier: 'design', desc: 'Deterministic grid layout with NEC 690.12 setbacks', status: 'Open', open: { kind: 'route', path: '/panel-layout' } },
  { id: 'wiring',            icon: '🔌', title: 'Wiring Diagram AI', tier: 'design', desc: 'SVG single-line diagram from your project string config', status: 'Open', open: { kind: 'route', path: '/wiring' } },
  { id: 'true-3d',           icon: '🏠', title: 'True 3D Viewer', tier: 'design', desc: 'WebGL render of array on the actual OSM building footprint', status: 'Open', open: { kind: 'route', path: '/viewer-3d' } },
  { id: 'global-3d',         icon: '🌐', title: 'Global 3D Map', tier: 'design', desc: 'Geo-positioned 3D scene at your site lat/lon', status: 'Open', open: { kind: 'route', path: '/global-3d' } },
  { id: 'smart-home',        icon: '🏘️', title: 'Smart Home Design', tier: 'design', desc: 'House-image analysis, BOM matcher, multi-audience summaries', status: 'Open', open: { kind: 'route', path: '/smart-home' } },
  { id: 'sun-weather',       icon: '☀️', title: 'Sun & Weather', tier: 'design', desc: 'Sun-path chart, NASA POWER GHI, live weather', status: 'Open', open: { kind: 'route', path: '/sun-weather' } },
  { id: 'fault-codes',       icon: '🛠️', title: 'Fault Codes Database', tier: 'design', desc: '80+ inverter fault codes (Deye, Sungrow, Growatt, SMA, Huawei…)', status: 'Open', open: { kind: 'route', path: '/fault-codes' } },

  // ===== ENGINEERING TIER 1 — peer-reviewer essentials =====
  { id: 'string-mppt',       icon: '🧮', title: 'String / MPPT Validator', tier: 'design', desc: 'Cold-Voc & hot-Vmpp string check vs inverter MPPT window (IEC 62548, NEC 690.7)', status: 'Run live', open: { kind: 'drawer', runner: 'string-mppt' } },
  { id: 'voltage-drop',      icon: '🔌', title: 'Cable & Voltage Drop', tier: 'design', desc: 'IEC 60364-5-52 conductor sizing with copper/Al ampacity & 3 % drop (NEC 690.8)', status: 'Run live', open: { kind: 'drawer', runner: 'voltage-drop' } },
  { id: 'ocpd-fuse',         icon: '🧯', title: 'Fuse / OCPD Sizing', tier: 'design', desc: 'String fuse + AC breaker per NEC 690.9 / IEC 60269-6 (gPV) / IEC 60898', status: 'Run live', open: { kind: 'drawer', runner: 'ocpd-fuse' } },
  { id: 'lightning-iec62305',icon: '⚡', title: 'Lightning Protection (IEC 62305)', tier: 'design', desc: 'Risk class + rolling sphere + SPD selection per IEC 62305 / KS 1515', status: 'Run live', open: { kind: 'drawer', runner: 'lightning' } },
  { id: 'battery-sizing',    icon: '🔋', title: 'Battery Sizing Wizard', tier: 'financial', desc: 'IEEE 1561 sizing: autonomy × critical loads × DoD × derating', status: 'Run live', open: { kind: 'drawer', runner: 'battery-sizing' } },
  { id: 'priced-boq',        icon: '📄', title: 'Priced BOQ / Quotation', tier: 'financial', desc: 'Line-itemised BOM → cost → contingency → margin → 16 % VAT', status: 'Run live', open: { kind: 'drawer', runner: 'priced-boq' } },
  { id: 'om-schedule',       icon: '📅', title: 'O&M Schedule Generator', tier: 'iot', desc: 'IEC 62446-1 annual maintenance calendar + labour cost', status: 'Run live', open: { kind: 'drawer', runner: 'om-schedule' } },
  { id: 'net-metering-ke',   icon: '⇄', title: 'Net-Metering (KE)', tier: 'financial', desc: 'EPRA 2024 export-credit math — avoided cost, not retail', status: 'Run live', open: { kind: 'drawer', runner: 'net-metering' } },

  // ===== ENGINEERING TIER 2 — differentiators =====
  { id: 'bifacial-gain',     icon: '🪞', title: 'Bifacial Gain', tier: 'design', desc: 'Rear-side irradiance + albedo → specific-yield uplift', status: 'Run live', open: { kind: 'drawer', runner: 'bifacial' } },
  { id: 'soiling-loss',      icon: '🌫️', title: 'Soiling & Cleaning ROI', tier: 'sustainability', desc: 'NREL/Kimber soiling derate + climate-tuned wash interval', status: 'Run live', open: { kind: 'drawer', runner: 'soiling' } },
  { id: 'tariff-sens',       icon: '📉', title: 'Tariff Sensitivity (IRR)', tier: 'financial', desc: 'IRR vs ±tariff escalation slider (NREL SAM methodology)', status: 'Run live', open: { kind: 'drawer', runner: 'tariff-sens' } },
  { id: 'genset-displace',   icon: '⛽', title: 'Generator Displacement', tier: 'iot', desc: 'Diesel hours saved + fuel + CO₂ + overhaul accrual', status: 'Run live', open: { kind: 'drawer', runner: 'genset-displace' } },
  { id: 'three-phase',       icon: '⏺️', title: '3-Phase Imbalance Check', tier: 'design', desc: 'NEMA / IEC 61000-3-13 phase-unbalance for hybrid C&I', status: 'Run live', open: { kind: 'drawer', runner: '3phase' } },
  { id: 'geo-risk',          icon: '🗺️', title: 'Geo-Risk Overlay (KE)', tier: 'design', desc: 'Wind / seismic / flood zoning per KS EAS 162 + KE NBC', status: 'Run live', open: { kind: 'drawer', runner: 'geo-risk' } },
  { id: 'inverter-match',    icon: '⚖️', title: 'DC/AC Ratio Validator', tier: 'design', desc: 'Inverter sizing per NREL/IEC 62109 (1.10–1.30 typical)', status: 'Run live', open: { kind: 'drawer', runner: 'inverter-match' } },

  // ===== ENGINEERING TIER 3 — moat features =====
  { id: 'client-portal',     icon: '🔗', title: 'Client Portal Link', tier: 'iot', desc: 'Generate read-only dashboard URL + WhatsApp share', status: 'Run live', open: { kind: 'drawer', runner: 'client-portal' } },
  { id: 'auto-bom',          icon: '🧩', title: 'Auto-Design Full BOM', tier: 'design', desc: 'End-to-end pipeline: load → panels → inverter → strings → cables', status: 'Run live', open: { kind: 'drawer', runner: 'auto-bom' } },
  // ===== ENGINEERING-PRO — Aurora-grade peer-reviewable =====
  { id: 'hourly-shading',    icon: '🌄', title: 'Hourly Shading (sun-path)', tier: 'design', desc: 'Per-azimuth horizon mask × Spencer 1971 sun-path → hourly losses', status: 'Run live', open: { kind: 'drawer', runner: 'hourly-shading' } },
  { id: 'battery-mc',        icon: '🎲', title: 'Battery Sizing (Monte Carlo)', tier: 'financial', desc: '1000-trial Gaussian load profile → P50/P75/P90/P95 sizing', status: 'Run live', open: { kind: 'drawer', runner: 'battery-mc' } },
  { id: 'lightning-full',    icon: '☢️', title: 'Lightning Risk Full (R1–R4)', tier: 'design', desc: 'IEC 62305-2 full risk: life loss, service loss, economic loss', status: 'Run live', open: { kind: 'drawer', runner: 'lightning-full' } },
  { id: 'priced-boq-fx',     icon: '💱', title: 'Priced BOQ (live FX)', tier: 'financial', desc: 'USD-pegged unit costs × live KES/USD FX + supplier feed', status: 'Run live', open: { kind: 'drawer', runner: 'priced-boq-fx' } },
  { id: 'geo-risk-ke',       icon: '🗺️', title: 'Geo-Risk KE (12 zones)', tier: 'design', desc: 'County-resolution wind/seismic/flood/corrosion zoning', status: 'Run live', open: { kind: 'drawer', runner: 'geo-risk-ke' } },
  { id: 'net-metering-tou',  icon: '⏰', title: 'Net-Metering TOU (C&I)', tier: 'financial', desc: 'Hour-by-hour PV vs load × peak/shoulder/off-peak tariff bands', status: 'Run live', open: { kind: 'drawer', runner: 'net-metering-tou' } },
  { id: 'structural-wind',   icon: '🏗️', title: 'Structural Wind & Ballast', tier: 'design', desc: 'EN 1991-1-4 uplift + ballast/anchor sizing for PV mounts', status: 'Run live', open: { kind: 'drawer', runner: 'structural-wind' } },
  { id: 'p50-p90',           icon: '📊', title: 'P50 / P75 / P90 Yield', tier: 'financial', desc: 'NREL uncertainty quadrature → bankable P90 yield estimate', status: 'Run live', open: { kind: 'drawer', runner: 'p50-p90' } },
  { id: 'earth-electrode',   icon: '⚡', title: 'Earth Electrode (BS 7430)', tier: 'design', desc: 'Dwight equation + multi-rod correction for soil resistivity', status: 'Run live', open: { kind: 'drawer', runner: 'earth-electrode' } },
  { id: 'portal-jwt',        icon: '🔐', title: 'Portal JWT (signed)', tier: 'iot', desc: 'HMAC-SHA256 signed JWT + revocation list (production-grade)', status: 'Run live', open: { kind: 'drawer', runner: 'portal-jwt' } },
  // ===== ENGINEERING-ELITE — Tier-4 utility-scale / bankable =====
  { id: 'tmy-8760',          icon: '🌞', title: 'Full 8760-hr TMY Sim', tier: 'design', desc: 'Hour-by-hour PVsyst-grade simulation: Erbs + Hay-Davies + clipping', status: 'Run live', open: { kind: 'drawer', runner: 'tmy-8760' } },
  { id: 'obstructions',      icon: '🌲', title: '3D Obstructions → Mask', tier: 'design', desc: 'Trees / buildings as cylinders → 36-azimuth horizon mask (ray-test)', status: 'Run live', open: { kind: 'drawer', runner: 'obstructions' } },
  { id: 'interval-meter',    icon: '📈', title: 'Interval-Meter CSV Ingest', tier: 'ai', desc: 'Paste KPLC/AMR meter export → 8760 load profile + battery sizing', status: 'Run live', open: { kind: 'drawer', runner: 'interval-meter' } },
  { id: 'member-structural', icon: '🔩', title: 'Member-by-Member Structural', tier: 'design', desc: 'Purlin + rafter + fastener pull-out per Eurocode 5/3, ACI 318-19', status: 'Run live', open: { kind: 'drawer', runner: 'member-structural' } },
  { id: 'epra-grid-code',    icon: '📜', title: 'EPRA 2024 Grid-Code Pack', tier: 'financial', desc: 'Auto-fills Form ECP-1 + KE Grid Code 2024 compliance checklist', status: 'Run live', open: { kind: 'drawer', runner: 'epra-grid-code' } },
  { id: 'ga-optimiser',      icon: '🧠', title: 'GA Optimiser (lowest LCOE)', tier: 'ai', desc: 'Genetic algorithm picks panel + inverter combo from catalog', status: 'Run live', open: { kind: 'drawer', runner: 'ga-optimiser' } },
  { id: 'pan-degradation',   icon: '📉', title: 'PAN-File Degradation', tier: 'financial', desc: 'Year-1 LID step + linear annual decline; module-specific presets', status: 'Run live', open: { kind: 'drawer', runner: 'pan-degradation' } },
  // ===== ENGINEERING-GLOBAL — Tier-5 global utility-scale, no upper limit =====
  { id: 'epw-import',        icon: '🌍', title: 'EPW Weather File Import', tier: 'design', desc: 'Real Meteonorm / NSRDB / SolarGIS .epw → 8760 hourly TMY', status: 'Run live', open: { kind: 'drawer', runner: 'epw-import' } },
  { id: 'pan-ond-parse',     icon: '📄', title: 'PVsyst .PAN/.OND Parser', tier: 'design', desc: 'Full module / inverter spec extraction (Pmax, Voc, MPPT, η, NOCT)', status: 'Run live', open: { kind: 'drawer', runner: 'pan-ond-parse' } },
  { id: 'continuous-beam',   icon: '🏗️', title: 'Continuous-Beam FE (N-span)', tier: 'design', desc: 'Three-moment Clapeyron solver: support moments, reactions, deflection', status: 'Run live', open: { kind: 'drawer', runner: 'continuous-beam' } },
  { id: 'grid-code',         icon: '🌐', title: 'Global Grid-Code Pack', tier: 'financial', desc: '11-country switch: KE/US/EU/UK/DE/AU/ZA/IN/NG/JP/BR + IEC fallback', status: 'Run live', open: { kind: 'drawer', runner: 'grid-code' } },
  { id: 'pvgis-hourly',      icon: '🛰️', title: 'PVGIS Satellite Hourly TMY', tier: 'design', desc: 'JRC PVGIS v5.2 SARAH-2 hourly GHI/DNI/DHI for any lat/lon (free)', status: 'Run live', open: { kind: 'drawer', runner: 'pvgis-hourly' } },
  { id: 'finance-pack',      icon: '💱', title: 'Multi-Currency Finance Pack', tier: 'financial', desc: 'LCOE / NPV / IRR in KES/USD/EUR/GBP/ZAR/NGN/INR/AUD/JPY/BRL/CNY', status: 'Run live', open: { kind: 'drawer', runner: 'finance-pack' } },
  // ===== ENGINEERING-APPROVAL — Tier-6 PE / Chartered Engineer sign-off =====
  { id: 'iec62446-report',   icon: '✅', title: 'IEC 62446-1 Commissioning', tier: 'design', desc: 'Full visual + electrical inspection report; tamper-evident hash', status: 'Run live', open: { kind: 'drawer', runner: 'iec62446-report' } },
  { id: 'sld-svg',           icon: '📐', title: 'Auto Single-Line Diagram', tier: 'design', desc: 'IEC 60617-symbol SLD as embeddable SVG; ready for PDF report', status: 'Run live', open: { kind: 'drawer', runner: 'sld-svg' } },
  { id: 'arc-rsd',           icon: '⚡', title: 'NEC 690.11/12 + IEC 63027', tier: 'design', desc: 'Arc-fault & rapid-shutdown compliance for USA/IEC jurisdictions', status: 'Run live', open: { kind: 'drawer', runner: 'arc-rsd' } },
  { id: 'cable-derated',     icon: '🔌', title: 'Cable Ampacity (IEC 60364-5-52)', tier: 'design', desc: 'Full ambient + grouping + soil derating per IEC tables', status: 'Run live', open: { kind: 'drawer', runner: 'cable-derated' } },
  { id: 'nfpa855',           icon: '🔥', title: 'NFPA 855 Battery Fire Safety', tier: 'design', desc: 'Threshold quantity, setbacks, suppression, gas detection, UL 9540A', status: 'Run live', open: { kind: 'drawer', runner: 'nfpa855' } },
  { id: 'faa-glare',         icon: '✨', title: 'FAA Glare Analysis (SGHAT)', tier: 'design', desc: 'Specular reflection → Green/Yellow/Red category for airports/towers', status: 'Run live', open: { kind: 'drawer', runner: 'faa-glare' } },
  { id: 'sign-off-package',  icon: '📜', title: 'PE Sign-Off Package', tier: 'financial', desc: 'Audit evidence + SHA-256 tamper-evident manifest, ready to stamp', status: 'Run live', open: { kind: 'drawer', runner: 'sign-off-package' } },
  // ===== ARCHITECTURE-APPROVAL — Tier-7 Architect / Building Surveyor pack =====
  { id: 'wind-uplift',       icon: '🌬️', title: 'Wind Uplift (ASCE 7-22)', tier: 'design', desc: 'Rooftop PV uplift pressure with edge/corner zones + parapet reduction', status: 'Run live', open: { kind: 'drawer', runner: 'wind-uplift' } },
  { id: 'snow-load',         icon: '❄️', title: 'Snow Load on PV', tier: 'design', desc: 'ASCE 7-22 / EN 1991-1-3 sloped roof snow with sliding check', status: 'Run live', open: { kind: 'drawer', runner: 'snow-load' } },
  { id: 'ballast-schedule',  icon: '🧱', title: 'Ballast Schedule (SEAOC PV2)', tier: 'design', desc: 'Non-penetrating ballast + sliding friction + zone multiplier', status: 'Run live', open: { kind: 'drawer', runner: 'ballast-schedule' } },
  { id: 'roof-reserve',      icon: '🏠', title: 'Roof Reserve Capacity (IBC 1604.4)', tier: 'design', desc: 'Added DL vs allowable reserve with condition-rating derating', status: 'Run live', open: { kind: 'drawer', runner: 'roof-reserve' } },
  { id: 'fire-setback',      icon: '🚒', title: 'Rooftop Fire Pathways (IFC 1204)', tier: 'design', desc: 'Pitched ridge / flat perimeter setbacks + sub-array pathway check', status: 'Run live', open: { kind: 'drawer', runner: 'fire-setback' } },
  { id: 'flashing',          icon: '🛠️', title: 'Flashing & Penetration (ICC-ES AC428)', tier: 'design', desc: 'Roof-covering compatibility + galvanic + Class A + BOM', status: 'Run live', open: { kind: 'drawer', runner: 'flashing' } },
  { id: 'neighbour-shadow',  icon: '🏘️', title: 'Neighbour Shadow (BRE 209)', tier: 'design', desc: 'Right-to-light 25° rule + APSH retention + EN 17037 sunlight', status: 'Run live', open: { kind: 'drawer', runner: 'neighbour-shadow' } },
  { id: 'ifc-export',        icon: '📦', title: 'IFC / BIM Export (ISO 16739-1)', tier: 'design', desc: 'IFC4 STEP file for architect coordination model', status: 'Run live', open: { kind: 'drawer', runner: 'ifc-export' } },
  { id: 'planning-narrative',icon: '📝', title: 'Planning Narrative (GPDO / NPPF)', tier: 'financial', desc: 'PD assessment + heritage + visual impact + LDC narrative', status: 'Run live', open: { kind: 'drawer', runner: 'planning-narrative' } },
];

const TIER_LABELS: Record<Tier, string> = {
  ai: 'AI & Predictive Intelligence',
  financial: 'Financial · Modeling · Twins',
  iot: 'IoT · Grid · Fleet',
  sustainability: 'Sustainability · Carbon · Web3',
  design: 'Design · Engineering · 3D',
};

// ============== COMPONENT ==============
const AdvancedFeaturesDashboard: React.FC = () => {
  const navigate = useNavigate();
  const metrics = useSolarStore(s => s.metrics);
  const siteData = useSolarStore(s => s.site);
  const financialData = useSolarStore(s => s.financial);
  const designData = useSolarStore(s => s.design);

  const hasProject = metrics.systemSizeKw > 0;
  const [tab, setTab] = useState<'overview' | Tier>('overview');
  const [openId, setOpenId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const out: Record<Tier, number> = { ai: 0, financial: 0, iot: 0, sustainability: 0, design: 0 };
    for (const f of FEATURES) out[f.tier]++;
    return out;
  }, []);
  const cardsForTier = (t: Tier) => FEATURES.filter(f => f.tier === t);

  function handleClick(f: FeatureCfg) {
    if (f.open.kind === 'route') navigate(f.open.path);
    else setOpenId(f.id);
  }

  const openFeature = openId ? FEATURES.find(f => f.id === openId) || null : null;

  const renderCards = (tier: Tier) => (
    <Grid>
      {cardsForTier(tier).map(f => (
        <Card key={f.id} onClick={() => handleClick(f)} aria-label={`Open ${f.title}`}>
          <CardIcon>{f.icon}</CardIcon>
          <CardTitle>{f.title}</CardTitle>
          <CardDesc>{f.desc}</CardDesc>
          <CardFoot>
            <span>{f.open.kind === 'route' ? 'Page' : 'Tool'}</span>
            <span>{f.status} →</span>
          </CardFoot>
        </Card>
      ))}
    </Grid>
  );

  return (
    <Shell>
      <Header>
        <h1>🚀 Advanced Suite — {FEATURES.length} interactive engines</h1>
        <p>Every tile is a live tool. Click any card to run it or open its dedicated page.</p>
      </Header>

      {!hasProject && (
        <Banner $tone="info">
          ℹ No project loaded yet — these tools still work with the defaults shown in each
          drawer. Run the <strong>Solar Calculator</strong> first to auto-fill from your real site.
        </Banner>
      )}

      <Tabs>
        <TabBtn $active={tab === 'overview'} onClick={() => setTab('overview')}>Overview</TabBtn>
        {(Object.keys(TIER_LABELS) as Tier[]).map(t => (
          <TabBtn key={t} $active={tab === t} onClick={() => setTab(t)}>
            {TIER_LABELS[t]} ({counts[t]})
          </TabBtn>
        ))}
      </Tabs>

      {tab === 'overview' ? (
        <>
          <KpiRow>
            <Kpi>
              <div className="l">System Size</div>
              <div className="v">{hasProject ? `${metrics.systemSizeKw} kW` : '—'}</div>
              <div className="s">{hasProject ? `${metrics.panelCount} panels` : 'Awaiting project'}</div>
            </Kpi>
            <Kpi>
              <div className="l">Annual Yield</div>
              <div className="v">{hasProject ? `${metrics.annualProduction.toLocaleString()} kWh` : '—'}</div>
              <div className="s">{hasProject ? 'From Calculator' : 'Awaiting project'}</div>
            </Kpi>
            <Kpi>
              <div className="l">Annual CO₂ Offset</div>
              <div className="v">{hasProject ? `${Math.round(metrics.carbonOffsetKg).toLocaleString()} kg` : '—'}</div>
              <div className="s">{hasProject ? 'KE grid 0.82 kgCO₂/kWh' : 'Awaiting project'}</div>
            </Kpi>
            <Kpi>
              <div className="l">Monthly Saving</div>
              <div className="v">{hasProject ? `KSh ${Math.round(metrics.monthlySaving).toLocaleString()}` : '—'}</div>
              <div className="s">{hasProject ? 'EPRA tariff' : 'Awaiting project'}</div>
            </Kpi>
          </KpiRow>

          {(Object.keys(TIER_LABELS) as Tier[]).map(t => (
            <div key={t}>
              <SectionTitle>
                <h2>{TIER_LABELS[t]}</h2>
                <small>{counts[t]} engines · click any tile</small>
              </SectionTitle>
              {renderCards(t)}
            </div>
          ))}
        </>
      ) : (
        <>
          <SectionTitle>
            <h2>{TIER_LABELS[tab]}</h2>
            <small>{counts[tab]} engines</small>
          </SectionTitle>
          {renderCards(tab)}
        </>
      )}

      <Backdrop $open={!!openFeature} onClick={() => setOpenId(null)} />
      <Drawer $open={!!openFeature} role="dialog" aria-modal="true">
        {openFeature && (
          <>
            <DrawerHead>
              <span className="icon">{openFeature.icon}</span>
              <div>
                <div className="ttl">{openFeature.title}</div>
                <div className="sub">{openFeature.desc}</div>
              </div>
              <button className="close" onClick={() => setOpenId(null)} aria-label="Close">×</button>
            </DrawerHead>
            <DrawerBody>
              <FeatureRunner
                runnerId={(openFeature.open as any).runner}
                ctx={{ metrics, site: siteData, financial: financialData, design: designData, hasProject, navigate }}
              />
            </DrawerBody>
          </>
        )}
      </Drawer>
    </Shell>
  );
};

// ============== RUNNER ROUTER ==============
interface RunnerCtx {
  metrics: any; site: any; financial: any; design: any; hasProject: boolean;
  navigate: ReturnType<typeof useNavigate>;
}

const FeatureRunner: React.FC<{ runnerId: string; ctx: RunnerCtx }> = ({ runnerId, ctx }) => {
  switch (runnerId) {
    case 'tou-dispatch':     return <TouDispatchRunner ctx={ctx} />;
    case 'fault-prediction': return <FaultPredictionRunner />;
    case 'load-forecast':    return <LoadForecastRunner ctx={ctx} />;
    case 'weather':          return <WeatherRunner ctx={ctx} />;
    case 'nlp-advisor':      return <NlpAdvisorRunner />;
    case 'independence':     return <IndependenceRunner ctx={ctx} />;
    case 'benchmark':        return <BenchmarkRunner ctx={ctx} />;
    case 'finance-roi':      return <FinanceRoiRunner ctx={ctx} />;
    case 'carbon-credits':   return <CarbonCreditsRunner ctx={ctx} />;
    case 'loan-vs-cash':     return <LoanVsCashRunner ctx={ctx} />;
    case 'currency':         return <CurrencyRunner />;
    case 'permit-pack':      return <PermitPackRunner ctx={ctx} />;
    case 'microgrid':        return <MicrogridRunner />;
    case 'tariff':           return <TariffRunner />;
    case 'portfolio':        return <PortfolioRunner />;
    case 'suppliers':        return <SuppliersRunner />;
    case 'ev-charging':      return <EvChargingRunner />;
    case 'diesel-vs-solar':  return <DieselVsSolarRunner ctx={ctx} />;
    case 'mqtt':             return <MqttRunner />;
    case 'carbon-footprint': return <CarbonFootprintRunner ctx={ctx} />;
    case 'solar-offset':     return <SolarOffsetRunner ctx={ctx} />;
    case 'emission-factors': return <EmissionFactorsRunner />;
    case 'panel-counter':    return <PanelCounterRunner ctx={ctx} />;
    case 'pilot':            return <PilotRunner />;
    // ===== Engineering Tier 1+2+3 =====
    case 'string-mppt':      return <StringMpptRunner ctx={ctx} />;
    case 'voltage-drop':     return <VoltageDropRunner ctx={ctx} />;
    case 'ocpd-fuse':        return <OcpdRunner ctx={ctx} />;
    case 'lightning':        return <LightningRunner />;
    case 'battery-sizing':   return <BatterySizingRunner ctx={ctx} />;
    case 'priced-boq':       return <PricedBoqRunner ctx={ctx} />;
    case 'om-schedule':      return <OmScheduleRunner ctx={ctx} />;
    case 'net-metering':     return <NetMeteringRunner ctx={ctx} />;
    case 'bifacial':         return <BifacialRunner />;
    case 'soiling':          return <SoilingRunner />;
    case 'tariff-sens':      return <TariffSensRunner ctx={ctx} />;
    case 'genset-displace':  return <GensetDisplaceRunner />;
    case '3phase':           return <ThreePhaseRunner />;
    case 'geo-risk':         return <GeoRiskRunner ctx={ctx} />;
    case 'inverter-match':   return <InverterMatchRunner ctx={ctx} />;
    case 'client-portal':    return <ClientPortalRunner ctx={ctx} />;
    case 'auto-bom':         return <AutoBomRunner ctx={ctx} />;
    // ===== Engineering-Pro =====
    case 'hourly-shading':   return <HourlyShadingRunner ctx={ctx} />;
    case 'battery-mc':       return <BatteryMCRunner ctx={ctx} />;
    case 'lightning-full':   return <LightningFullRunner />;
    case 'priced-boq-fx':    return <PricedBoqFxRunner ctx={ctx} />;
    case 'geo-risk-ke':      return <GeoRiskKERunner ctx={ctx} />;
    case 'net-metering-tou': return <NetMeteringTOURunner />;
    case 'structural-wind':  return <StructuralWindRunner />;
    case 'p50-p90':          return <P50P90Runner ctx={ctx} />;
    case 'earth-electrode':  return <EarthElectrodeRunner />;
    case 'portal-jwt':       return <PortalJwtRunner ctx={ctx} />;
    // ===== Engineering-Elite =====
    case 'tmy-8760':         return <Tmy8760Runner ctx={ctx} />;
    case 'obstructions':     return <ObstructionsRunner />;
    case 'interval-meter':   return <IntervalMeterRunner />;
    case 'member-structural':return <MemberStructuralRunner />;
    case 'epra-grid-code':   return <EpraGridCodeRunner ctx={ctx} />;
    case 'ga-optimiser':     return <GaOptimiserRunner ctx={ctx} />;
    case 'pan-degradation':  return <PanDegradationRunner ctx={ctx} />;
    // ===== Engineering-Global =====
    case 'epw-import':        return <EpwImportRunner />;
    case 'pan-ond-parse':     return <PanOndParseRunner />;
    case 'continuous-beam':   return <ContinuousBeamRunner />;
    case 'grid-code':         return <GridCodeRunner ctx={ctx} />;
    case 'pvgis-hourly':      return <PvgisHourlyRunner ctx={ctx} />;
    case 'finance-pack':      return <FinancePackRunner ctx={ctx} />;
    // ===== Engineering-Approval =====
    case 'iec62446-report':   return <Iec62446Runner ctx={ctx} />;
    case 'sld-svg':           return <SldSvgRunner ctx={ctx} />;
    case 'arc-rsd':           return <ArcRsdRunner />;
    case 'cable-derated':     return <CableDeratedRunner />;
    case 'nfpa855':           return <Nfpa855Runner />;
    case 'faa-glare':         return <FaaGlareRunner ctx={ctx} />;
    case 'sign-off-package':  return <SignOffRunner ctx={ctx} />;
    // ===== Architecture-Approval =====
    case 'wind-uplift':       return <WindUpliftRunner />;
    case 'snow-load':         return <SnowLoadRunner />;
    case 'ballast-schedule':  return <BallastRunner />;
    case 'roof-reserve':      return <RoofReserveRunner />;
    case 'fire-setback':      return <FireSetbackRunner />;
    case 'flashing':          return <FlashingRunner />;
    case 'neighbour-shadow':  return <NeighbourShadowRunner ctx={ctx} />;
    case 'ifc-export':        return <IfcExportRunner ctx={ctx} />;
    case 'planning-narrative':return <PlanningNarrativeRunner ctx={ctx} />;
    default: return <Hint>This tool isn't wired up yet.</Hint>;
  }
};

function useRunner<T = any>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);
  async function run(fn: () => Promise<any>) {
    setLoading(true); setError(null); setData(null);
    try { const r = await fn(); setData((r?.data ?? r) as T); }
    catch (e: any) { setError(e?.message || 'Request failed'); }
    finally { setLoading(false); }
  }
  return { loading, error, data, run, setData, setError };
}

// ----- Human-readable result formatter -----
function humaniseKey(k: string): string {
  return k
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_\-]+/g, ' ')
    .replace(/\bkwh\b/gi, 'kWh').replace(/\bkwp\b/gi, 'kWp').replace(/\bkw\b/gi, 'kW')
    .replace(/\bco2\b/gi, 'CO₂').replace(/\bpv\b/gi, 'PV').replace(/\bnpv\b/gi, 'NPV').replace(/\birr\b/gi, 'IRR')
    .replace(/\bsoc\b/gi, 'SOC').replace(/\bid\b/gi, 'ID').replace(/\bkes\b/gi, 'KSh').replace(/\busd\b/gi, 'USD')
    .replace(/\bttl\b/gi, 'TTL').replace(/\bewma\b/gi, 'EWMA').replace(/\bisc\b/gi, 'ISC')
    .replace(/\b(\w)/g, m => m.toUpperCase());
}
function formatValue(v: any): string {
  if (v == null) return '—';
  if (typeof v === 'boolean') return v ? 'Yes' : 'No';
  if (typeof v === 'number') {
    if (!isFinite(v)) return '—';
    if (Math.abs(v) >= 1000) return Math.round(v).toLocaleString();
    if (Number.isInteger(v)) return String(v);
    return v.toFixed(Math.abs(v) < 1 ? 3 : 2);
  }
  if (typeof v === 'string') return v;
  return String(v);
}
function isPlainObject(v: any): boolean {
  return v != null && typeof v === 'object' && !Array.isArray(v);
}

const SmartResult: React.FC<{ data: any }> = ({ data }) => {
  // Primitive
  if (data == null) return null;
  if (typeof data !== 'object') {
    return <Panel><div>{formatValue(data)}</div></Panel>;
  }

  // Array of primitives — render as comma-separated list
  if (Array.isArray(data)) {
    if (data.length === 0) return <Panel><Pill>No items</Pill></Panel>;
    if (data.every(x => typeof x !== 'object' || x == null)) {
      return <Panel><div>{data.map(formatValue).join(', ')}</div></Panel>;
    }
    // Array of objects — render as a stack of mini-panels (cap at 8 with summary)
    const shown = data.slice(0, 8);
    return (
      <Panel>
        <PanelTitle>{data.length} item{data.length === 1 ? '' : 's'}{data.length > 8 ? ` · showing first 8` : ''}</PanelTitle>
        {shown.map((row, i) => (
          <div key={i} style={{ marginBottom: 10, paddingBottom: 8, borderBottom: i < shown.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 0 }}>
            <KvList obj={row} />
          </div>
        ))}
      </Panel>
    );
  }

  // Object — extract provenance/source as footer
  const { provenance, source, sources, _meta, ...rest } = data as Record<string, any>;
  const noteParts: string[] = [];
  if (typeof source === 'string') noteParts.push(source);
  if (Array.isArray(sources)) noteParts.push(sources.join(' · '));
  if (provenance && typeof provenance === 'object') {
    if (provenance.method) noteParts.push(provenance.method);
    if (provenance.reference) noteParts.push(provenance.reference);
    if (provenance.limits) noteParts.push(provenance.limits);
  } else if (typeof provenance === 'string') noteParts.push(provenance);

  return (
    <Panel>
      <KvList obj={rest} />
      {noteParts.length > 0 && <Note><strong style={{ color: '#9be4ff' }}>Source · </strong>{noteParts.join(' — ')}</Note>}
    </Panel>
  );
};

const KvList: React.FC<{ obj: any }> = ({ obj }) => {
  if (!isPlainObject(obj)) return <div>{formatValue(obj)}</div>;
  const entries = Object.entries(obj);
  return (
    <>
      {entries.map(([k, v]) => {
        const label = humaniseKey(k);
        // Nested object
        if (isPlainObject(v)) {
          return (
            <div key={k} style={{ marginTop: 6 }}>
              <PanelTitle style={{ marginBottom: 4 }}>{label}</PanelTitle>
              <KvList obj={v} />
            </div>
          );
        }
        // Array
        if (Array.isArray(v)) {
          if (v.length === 0) {
            return <StatRow key={k}><span className="k">{label}</span><span className="v"><Pill>None</Pill></span></StatRow>;
          }
          if (v.every(x => typeof x !== 'object' || x == null)) {
            const txt = v.length > 6 ? `${v.slice(0,6).map(formatValue).join(', ')} … (+${v.length-6} more)` : v.map(formatValue).join(', ');
            return <StatRow key={k}><span className="k">{label}</span><span className="v">{txt}</span></StatRow>;
          }
          return <StatRow key={k}><span className="k">{label}</span><span className="v"><Pill>{v.length} entries</Pill></span></StatRow>;
        }
        // Boolean → pill
        if (typeof v === 'boolean') {
          return <StatRow key={k}><span className="k">{label}</span><span className="v"><Pill $tone={v ? 'ok' : 'warn'}>{v ? 'Yes' : 'No'}</Pill></span></StatRow>;
        }
        // Percentage hint
        if (typeof v === 'number' && /(pct|percent|score|ratio)$/i.test(k) && v >= 0 && v <= 100) {
          return (
            <StatRow key={k}>
              <span className="k">{label}</span>
              <span className="v" style={{ minWidth: 140 }}>
                <div>{formatValue(v)}%</div>
                <BarTrack><BarFill $pct={v} /></BarTrack>
              </span>
            </StatRow>
          );
        }
        return <StatRow key={k}><span className="k">{label}</span><span className="v">{formatValue(v)}</span></StatRow>;
      })}
    </>
  );
};

const ResultBlock: React.FC<{ loading: boolean; error: string | null; data: any }> = ({ loading, error, data }) => {
  if (loading) return <Panel><Pill>Running…</Pill></Panel>;
  if (error) return <Panel><Pill $tone="warn">Error</Pill> <span style={{ marginLeft: 8 }}>{error}</span></Panel>;
  if (data == null) return null;
  return <SmartResult data={data} />;
};

// ============== INDIVIDUAL RUNNERS ==============

const TouDispatchRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const [battery, setBattery] = useState(ctx.design?.batteryKwh > 0 ? ctx.design.batteryKwh : 10);
  return (
    <>
      <Hint>Computes optimal battery charge/discharge across 24h with a typical residential load and clear-sky PV curve.</Hint>
      <Field><span className="l">Battery capacity (kWh)</span>
        <input type="number" min={1} step={0.5} value={battery} onChange={e => setBattery(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => research.touDispatch({
        batteryKwh: battery,
        hourlyLoadKwh: Array.from({length:24},(_,h)=> h>=18&&h<22 ? 2.5 : (h>=6&&h<8 ? 1.4 : 0.6)),
        hourlyPvKwh: Array.from({length:24},(_,h)=> h>=6&&h<18 ? Math.sin((h-6)/12*Math.PI) * (ctx.design?.systemKw || 5) * 0.85 : 0)
      }))}>{r.loading ? 'Computing…' : 'Run dispatch optimisation'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const FaultPredictionRunner: React.FC = () => {
  const r = useRunner();
  return (
    <>
      <Hint>EWMA + z-score detector against a 30-point telemetry stream with a deliberate spike at index 20.</Hint>
      <Run disabled={r.loading} onClick={() => r.run(() => research.faultPrediction({
        series: Array.from({length: 30}, (_,i) => ({ ts: i, value: 100 + Math.sin(i/3)*5 + (i===20 ? 40 : 0) }))
      }))}>{r.loading ? 'Detecting…' : 'Detect anomalies'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const LoadForecastRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const monthly = ctx.site?.monthlyConsumptionKwh || 1000;
  return (
    <>
      <Hint>Holt-Winters seasonal forecast (period 12). Uses your monthly consumption with ±15% seasonal swing.</Hint>
      <Run disabled={r.loading} onClick={() => r.run(() => research.loadForecast({
        series: Array.from({length: 24}, (_,i) => Math.round(monthly * (1 + 0.15 * Math.sin(i/12*2*Math.PI)))),
        season: 12, horizon: 6
      }))}>{r.loading ? 'Forecasting…' : 'Forecast next 6 months'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const WeatherRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const lat = ctx.site?.lat ?? -1.2865;
  const lon = ctx.site?.lon ?? 36.8172;
  return (
    <>
      <Hint>Live weather from Open-Meteo at ({lat.toFixed(3)}, {lon.toFixed(3)}).</Hint>
      <Run disabled={r.loading} onClick={() => r.run(() => core.weather(lat, lon))}>
        {r.loading ? 'Fetching…' : 'Fetch live weather'}
      </Run>
      <ResultBlock {...r} />
    </>
  );
};

const NlpAdvisorRunner: React.FC = () => {
  const r = useRunner();
  const [q, setQ] = useState('How do I size my system and check ROI?');
  return (
    <>
      <Hint>Rule-based intent classifier — no LLM, no fabrication.</Hint>
      <Field><span className="l">Question</span>
        <textarea rows={3} value={q} onChange={e => setQ(e.target.value)} /></Field>
      <Run disabled={r.loading || !q.trim()} onClick={() => r.run(() => research.nlpAdvisor(q))}>
        {r.loading ? 'Thinking…' : 'Ask the assistant'}
      </Run>
      <ResultBlock {...r} />
    </>
  );
};

const IndependenceRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  if (!ctx.hasProject) return <Hint>Run the Solar Calculator first — this tile reads from your project.</Hint>;
  const annualLoad = (ctx.site?.monthlyConsumptionKwh || 0) * 12;
  const annualPv = ctx.metrics.annualProduction || 0;
  const score = annualLoad > 0 ? Math.min(100, Math.round(annualPv / annualLoad * 100)) : 0;
  return (
    <SmartResult data={{
      annualPvKwh: Math.round(annualPv),
      annualLoadKwh: Math.round(annualLoad),
      independencePct: score,
      verdict: score >= 90 ? 'Near-100% offset' : score >= 60 ? 'Strong offset' : score >= 30 ? 'Partial offset' : 'Top-up only',
    }} />
  );
};

const BenchmarkRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  if (!ctx.hasProject) return <Hint>Run the Solar Calculator first to compare against medians.</Hint>;
  const specYield = ctx.metrics.systemSizeKw > 0 ? ctx.metrics.annualProduction / ctx.metrics.systemSizeKw : 0;
  const median = 1750;
  return (
    <SmartResult data={{
      yourSpecificYieldKwhPerKwp: Math.round(specYield),
      kenyaMedianKwhPerKwp: median,
      deltaPct: Math.round((specYield - median) / median * 100),
      source: 'IRENA East-Africa solar atlas + NREL PVWatts regional medians',
    }} />
  );
};

const FinanceRoiRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const capex = ctx.financial?.capexKes || ctx.metrics?.totalCost || 1247500;
  const yr1 = ctx.financial?.year1SavingsKes || (ctx.metrics?.monthlySaving || 0) * 12 || 240000;
  const [discount, setDiscount] = useState(0.10);
  const [years, setYears] = useState(25);
  return (
    <>
      <Hint>NPV + IRR using capex KSh {capex.toLocaleString()} and yr-1 saving KSh {yr1.toLocaleString()}, +2.5%/yr escalation.</Hint>
      <Field><span className="l">Discount rate</span>
        <input type="number" step="0.005" value={discount} onChange={e => setDiscount(+e.target.value)} /></Field>
      <Field><span className="l">Years</span>
        <input type="number" min={5} max={30} value={years} onChange={e => setYears(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={async () => {
        try {
          const cashFlows = [-capex, ...Array.from({length: years}, (_,i) => Math.round(yr1 * Math.pow(1.025, i)))];
          const [npv, irr] = await Promise.all([finance.npv(discount, cashFlows), finance.irr(cashFlows)]);
          r.setData({ inputs: { capex, year1Saving: yr1, discount, years }, npv: (npv as any).data ?? npv, irr: (irr as any).data ?? irr });
        } catch (e: any) { r.setError(e?.message || 'Failed'); }
      }}>{r.loading ? 'Computing…' : 'Run NPV + IRR'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const CarbonCreditsRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const [tonnes, setTonnes] = useState(Math.max(1, Math.round(((ctx.metrics?.carbonOffsetKg || 0) * 25) / 1000)));
  return (
    <>
      <Hint>Voluntary Carbon Market price (≈ USD 5-15 / tCO₂).</Hint>
      <Field><span className="l">Lifetime CO₂ tonnes</span>
        <input type="number" min={1} value={tonnes} onChange={e => setTonnes(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => sustain.carbonCredits(tonnes, 'voluntary_avg'))}>
        {r.loading ? 'Pricing…' : 'Price carbon credits'}
      </Run>
      <ResultBlock {...r} />
    </>
  );
};

const LoanVsCashRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const cost = ctx.financial?.capexKes || 1247500;
  const ann = ctx.financial?.year1SavingsKes || 240000;
  const [rate, setRate] = useState(0.14);
  return (
    <>
      <Hint>Cash purchase vs 5-year bank loan at the rate below.</Hint>
      <Field><span className="l">Loan annual rate</span>
        <input type="number" step="0.005" value={rate} onChange={e => setRate(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => finance.loanVsCash({
        systemCost: cost, annualSavings: ann, years: 20, loanRate: rate
      }))}>{r.loading ? 'Comparing…' : 'Compare scenarios'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const CurrencyRunner: React.FC = () => {
  const r = useRunner();
  const [amount, setAmount] = useState(1000);
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('KES');
  return (
    <>
      <Field><span className="l">Amount</span><input type="number" value={amount} onChange={e => setAmount(+e.target.value)} /></Field>
      <Field><span className="l">From</span><input value={from} onChange={e => setFrom(e.target.value.toUpperCase())} /></Field>
      <Field><span className="l">To</span><input value={to} onChange={e => setTo(e.target.value.toUpperCase())} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => finance.currency(amount, from, to))}>
        {r.loading ? 'Converting…' : 'Convert'}
      </Run>
      <ResultBlock {...r} />
    </>
  );
};

const PermitPackRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const kw = ctx.metrics?.systemSizeKw || ctx.design?.systemKw || 6.8;
  const [name, setName] = useState('Project Owner');
  const [addr, setAddr] = useState(ctx.site?.displayName || 'Nairobi');
  return (
    <>
      <Field><span className="l">Customer name</span><input value={name} onChange={e => setName(e.target.value)} /></Field>
      <Field><span className="l">Site address</span><input value={addr} onChange={e => setAddr(e.target.value)} /></Field>
      <Field><span className="l">Project kW</span><input type="number" step="0.1" value={kw} readOnly /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => research.permitPack({
        country: 'KE', projectKw: kw, customerName: name, siteAddress: addr
      }))}>{r.loading ? 'Generating…' : 'Generate KE permit pack'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const MicrogridRunner: React.FC = () => {
  const r = useRunner();
  const [hh, setHh] = useState(50);
  const [kwhPerHh, setKwhPerHh] = useState(4);
  const [productive, setProductive] = useState(30);
  const [peakKw, setPeakKw] = useState(25);
  return (
    <>
      <Field><span className="l">Households</span><input type="number" value={hh} onChange={e => setHh(+e.target.value)} /></Field>
      <Field><span className="l">Avg daily kWh / household</span><input type="number" step="0.5" value={kwhPerHh} onChange={e => setKwhPerHh(+e.target.value)} /></Field>
      <Field><span className="l">Productive kWh/day</span><input type="number" value={productive} onChange={e => setProductive(+e.target.value)} /></Field>
      <Field><span className="l">Peak kW</span><input type="number" value={peakKw} onChange={e => setPeakKw(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => sustain.microgrid({
        households: hh, avgDailyKwhPerHousehold: kwhPerHh, productiveLoadKwh: productive, peakKwLoad: peakKw
      }))}>{r.loading ? 'Sizing…' : 'Size microgrid'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const TariffRunner: React.FC = () => {
  const r = useRunner();
  const [cat, setCat] = useState('DC2');
  const [kwh, setKwh] = useState(250);
  return (
    <>
      <Hint>All-in KPLC bill (fuel, forex, EPRA & inflation levies).</Hint>
      <Field><span className="l">Tariff category</span>
        <select value={cat} onChange={e => setCat(e.target.value)}>
          <option value="DC1">DC1 (≤100 kWh)</option>
          <option value="DC2">DC2 (100-15,000 kWh)</option>
          <option value="SC">SC (Small Commercial)</option>
          <option value="CI1">CI1 (Commercial-Industrial 1)</option>
        </select></Field>
      <Field><span className="l">kWh consumption</span><input type="number" value={kwh} onChange={e => setKwh(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => finance.tariff(cat, kwh))}>
        {r.loading ? 'Computing…' : 'Compute KPLC bill'}
      </Run>
      <ResultBlock {...r} />
    </>
  );
};

const PortfolioRunner: React.FC = () => {
  const r = useRunner();
  useEffect(() => { r.run(() => biz.portfolio()); /* eslint-disable-line */ }, []);
  return (
    <>
      <Hint>Live rollup of every site (kWp, capex, expected kWh).</Hint>
      <Run disabled={r.loading} onClick={() => r.run(() => biz.portfolio())}>{r.loading ? 'Loading…' : 'Refresh portfolio'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const SuppliersRunner: React.FC = () => {
  const r = useRunner();
  useEffect(() => { r.run(() => core.suppliers()); /* eslint-disable-line */ }, []);
  return (
    <>
      <Hint>Live supplier catalogue with prices, lead times and contact info.</Hint>
      <Run disabled={r.loading} onClick={() => r.run(() => core.suppliers())}>{r.loading ? 'Loading…' : 'Refresh catalogue'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const EvChargingRunner: React.FC = () => {
  const r = useRunner();
  const [type, setType] = useState('sedan_ev');
  const [km, setKm] = useState(50);
  const [days, setDays] = useState(330);
  return (
    <>
      <Field><span className="l">Vehicle</span>
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="sedan_ev">Sedan EV</option>
          <option value="suv_ev">SUV EV</option>
          <option value="bakkie_ev">Pickup EV</option>
          <option value="motorbike_ev">Motorbike EV</option>
        </select></Field>
      <Field><span className="l">km / day</span><input type="number" value={km} onChange={e => setKm(+e.target.value)} /></Field>
      <Field><span className="l">Days / year</span><input type="number" value={days} onChange={e => setDays(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => sustain.evCharging({ vehicleType: type, kmPerDay: km, daysPerYear: days }))}>
        {r.loading ? 'Calculating…' : 'Calculate EV impact'}
      </Run>
      <ResultBlock {...r} />
    </>
  );
};

const DieselVsSolarRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const [annualKwh, setAnnualKwh] = useState(ctx.metrics?.annualProduction || 50000);
  const [pvCapex, setPvCapex] = useState(ctx.financial?.capexKes || ctx.metrics?.totalCost || 4500000);
  return (
    <>
      <Hint>TCO comparison of diesel vs PV.</Hint>
      <Field><span className="l">Annual kWh load</span><input type="number" value={annualKwh} onChange={e => setAnnualKwh(+e.target.value)} /></Field>
      <Field><span className="l">PV capex (KSh)</span><input type="number" value={pvCapex} onChange={e => setPvCapex(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => sustain.dieselVsSolar({ annualKwh, pvCapexKes: pvCapex }))}>
        {r.loading ? 'Comparing…' : 'Run TCO comparison'}
      </Run>
      <ResultBlock {...r} />
    </>
  );
};

const MqttRunner: React.FC = () => {
  const r = useRunner();
  useEffect(() => { r.run(() => research.mqttStatus()); /* eslint-disable-line */ }, []);
  return (
    <>
      <Hint>MQTT broker status for live inverter telemetry.</Hint>
      <Run disabled={r.loading} onClick={() => r.run(() => research.mqttStatus())}>{r.loading ? 'Polling…' : 'Refresh MQTT status'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const CarbonFootprintRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const [annualKwh, setAnnualKwh] = useState((ctx.site?.monthlyConsumptionKwh || 1000) * 12);
  const [country, setCountry] = useState('KE');
  return (
    <>
      <Field><span className="l">Annual kWh load</span><input type="number" value={annualKwh} onChange={e => setAnnualKwh(+e.target.value)} /></Field>
      <Field><span className="l">Country (ISO-2)</span><input value={country} onChange={e => setCountry(e.target.value.toUpperCase())} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => sustain.carbonFootprint(annualKwh, country))}>
        {r.loading ? 'Computing…' : 'Compute footprint'}
      </Run>
      <ResultBlock {...r} />
    </>
  );
};

const SolarOffsetRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const [annualPv, setAnnualPv] = useState(ctx.metrics?.annualProduction || 12000);
  return (
    <>
      <Field><span className="l">Annual PV yield (kWh)</span><input type="number" value={annualPv} onChange={e => setAnnualPv(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => sustain.solarOffset(annualPv, 'KE', 25))}>
        {r.loading ? 'Computing…' : 'Compute 25-yr offset'}
      </Run>
      <ResultBlock {...r} />
    </>
  );
};

const EmissionFactorsRunner: React.FC = () => {
  const r = useRunner();
  useEffect(() => { r.run(() => sustain.emissionFactors()); /* eslint-disable-line */ }, []);
  return (
    <>
      <Hint>IEA Emissions Factors 2024 + KPLC LCOE 2023 + Climate TRACE.</Hint>
      <ResultBlock {...r} />
    </>
  );
};

const PanelCounterRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const [area, setArea] = useState(ctx.site?.roofAreaM2 || 60);
  return (
    <>
      <Field><span className="l">Roof area (m²)</span><input type="number" value={area} onChange={e => setArea(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => research.panelCounter({ roofAreaM2: area }))}>
        {r.loading ? 'Computing…' : 'Count max panels'}
      </Run>
      <ResultBlock {...r} />
    </>
  );
};

const PilotRunner: React.FC = () => (
  <>
    <Banner $tone="warn">
      Pilot status — these blockchain features are wired but require an EPRA sandbox approval
      before customer use. They run on Polygon Mumbai testnet today.
    </Banner>
    <Hint>
      Once approved, prosumers will be able to list surplus kWh and consumers bid in real time.
      Carbon credits mint as ERC-721 NFTs with project provenance recorded on-chain.
    </Hint>
  </>
);

// =====================================================================
// ENGINEERING TIER 1+2+3 RUNNERS
// =====================================================================

const StringMpptRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const [voc, setVoc] = useState(50.5);
  const [vmpp, setVmpp] = useState(42.1);
  const [isc, setIsc] = useState(13.9);
  const [maxDcV, setMaxDcV] = useState(1000);
  const [mpptMin, setMpptMin] = useState(180);
  const [mpptMax, setMpptMax] = useState(850);
  const [maxInputA, setMaxInputA] = useState(26);
  const [mppts, setMppts] = useState(2);
  return (
    <>
      <Hint>Validates string length against cold-Voc and hot-Vmpp limits per IEC 62548 / NEC 690.7. Defaults: 580 W mono panel + typical hybrid inverter.</Hint>
      <Field><span className="l">Panel Voc (V)</span><input type="number" step="0.1" value={voc} onChange={e=>setVoc(+e.target.value)} /></Field>
      <Field><span className="l">Panel Vmpp (V)</span><input type="number" step="0.1" value={vmpp} onChange={e=>setVmpp(+e.target.value)} /></Field>
      <Field><span className="l">Panel Isc (A)</span><input type="number" step="0.1" value={isc} onChange={e=>setIsc(+e.target.value)} /></Field>
      <Field><span className="l">Inverter max DC voltage (V)</span><input type="number" value={maxDcV} onChange={e=>setMaxDcV(+e.target.value)} /></Field>
      <Field><span className="l">MPPT window min (V)</span><input type="number" value={mpptMin} onChange={e=>setMpptMin(+e.target.value)} /></Field>
      <Field><span className="l">MPPT window max (V)</span><input type="number" value={mpptMax} onChange={e=>setMpptMax(+e.target.value)} /></Field>
      <Field><span className="l">Inverter max input current per MPPT (A)</span><input type="number" value={maxInputA} onChange={e=>setMaxInputA(+e.target.value)} /></Field>
      <Field><span className="l">MPPT count</span><input type="number" value={mppts} onChange={e=>setMppts(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => bos.stringConfig({
        panelVocStc: voc, panelVmppStc: vmpp, panelIscStc: isc,
        betaVocPctC: -0.27, betaVmppPctC: -0.40,
        ambientMinC: 5, ambientMaxC: 60,
        inverterMaxDcV: maxDcV, inverterMpptMinV: mpptMin, inverterMpptMaxV: mpptMax,
        inverterMaxInputA: maxInputA, inverterMpptCount: mppts,
      }))}>{r.loading ? 'Validating…' : 'Validate string config'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const VoltageDropRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const [systemType, setSystemType] = useState<'dc'|'ac_single_phase'|'ac_three_phase'>('dc');
  const [currentA, setCurrentA] = useState(15);
  const [voltageV, setVoltageV] = useState(400);
  const [lengthM, setLengthM] = useState(25);
  const [material, setMaterial] = useState<'copper'|'aluminium'>('copper');
  const [maxDropPct, setMaxDropPct] = useState(3);
  return (
    <>
      <Hint>Computes the smallest IEC 60228 conductor that meets the voltage-drop limit AND ampacity (PVC, free-air, 30 °C).</Hint>
      <Field><span className="l">Run type</span>
        <select value={systemType} onChange={e=>setSystemType(e.target.value as any)}>
          <option value="dc">DC string</option>
          <option value="ac_single_phase">AC single-phase</option>
          <option value="ac_three_phase">AC three-phase</option>
        </select></Field>
      <Field><span className="l">Current (A)</span><input type="number" value={currentA} onChange={e=>setCurrentA(+e.target.value)} /></Field>
      <Field><span className="l">Voltage (V)</span><input type="number" value={voltageV} onChange={e=>setVoltageV(+e.target.value)} /></Field>
      <Field><span className="l">One-way length (m)</span><input type="number" value={lengthM} onChange={e=>setLengthM(+e.target.value)} /></Field>
      <Field><span className="l">Conductor</span>
        <select value={material} onChange={e=>setMaterial(e.target.value as any)}>
          <option value="copper">Copper</option>
          <option value="aluminium">Aluminium</option>
        </select></Field>
      <Field><span className="l">Max voltage drop (%)</span><input type="number" step="0.1" value={maxDropPct} onChange={e=>setMaxDropPct(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => bos.voltageDrop({
        systemType, currentA, voltageV, oneWayLengthM: lengthM,
        conductorMaterial: material, ambientTempC: 30, maxVoltDropPct: maxDropPct,
      }))}>{r.loading ? 'Sizing…' : 'Recommend conductor'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const OcpdRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const [isc, setIsc] = useState(13.9);
  const [strings, setStrings] = useState(3);
  const [invKw, setInvKw] = useState(8);
  const [acV, setAcV] = useState(400);
  return (
    <>
      <Hint>String fuse + AC breaker per NEC 690.9 / IEC 60269-6 (gPV). String fuses become mandatory at ≥3 parallel strings.</Hint>
      <Field><span className="l">Panel Isc STC (A)</span><input type="number" step="0.1" value={isc} onChange={e=>setIsc(+e.target.value)} /></Field>
      <Field><span className="l">Strings in parallel</span><input type="number" value={strings} onChange={e=>setStrings(+e.target.value)} /></Field>
      <Field><span className="l">Inverter AC (kW)</span><input type="number" step="0.1" value={invKw} onChange={e=>setInvKw(+e.target.value)} /></Field>
      <Field><span className="l">AC voltage (V)</span><input type="number" value={acV} onChange={e=>setAcV(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => bos.ocpdSizing({
        panelIscStc: isc, stringsInParallel: strings, inverterAcKw: invKw, acVoltageV: acV,
      }))}>{r.loading ? 'Sizing…' : 'Size fuses & breaker'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const LightningRunner: React.FC = () => {
  const r = useRunner();
  const [occ, setOcc] = useState('residential');
  const [flash, setFlash] = useState(8);
  const [height, setHeight] = useState(6);
  const [footprint, setFootprint] = useState(120);
  return (
    <>
      <Hint>IEC 62305-2 short-form risk assessment. KE flash density: plateau ≈ 6–10, coast ≈ 4, lake region ≈ 12 strokes/km²/yr.</Hint>
      <Field><span className="l">Occupancy</span>
        <select value={occ} onChange={e=>setOcc(e.target.value)}>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="industrial">Industrial</option>
          <option value="hospital">Hospital</option>
          <option value="telecom">Telecom</option>
        </select></Field>
      <Field><span className="l">Flash density (strokes/km²/yr)</span><input type="number" step="0.1" value={flash} onChange={e=>setFlash(+e.target.value)} /></Field>
      <Field><span className="l">Building height (m)</span><input type="number" value={height} onChange={e=>setHeight(+e.target.value)} /></Field>
      <Field><span className="l">Building footprint (m²)</span><input type="number" value={footprint} onChange={e=>setFootprint(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => eng.lightningRisk({
        occupancyType: occ, flashDensityPerKm2Year: flash, buildingHeightM: height,
        buildingFootprintM2: footprint, arrayLocation: 'roof', metallicServicesEntering: true,
      }))}>{r.loading ? 'Assessing…' : 'Assess lightning risk'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const BatterySizingRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const dailyDefault = (ctx.site?.monthlyConsumptionKwh || 600) / 30;
  const [dailyKwh, setDailyKwh] = useState(Math.round(dailyDefault * 0.6 * 10) / 10); // critical = 60 % of total
  const [autonomy, setAutonomy] = useState(1);
  const [dod, setDod] = useState(0.85);
  const [chemistry, setChemistry] = useState<'lifepo4'|'lead-acid'>('lifepo4');
  return (
    <>
      <Hint>IEEE 1561 sizing. Enter only the CRITICAL daily load to back up (lights, fridge, sockets — not aircon/iron unless wanted).</Hint>
      <Field><span className="l">Daily critical load (kWh)</span><input type="number" step="0.1" value={dailyKwh} onChange={e=>setDailyKwh(+e.target.value)} /></Field>
      <Field><span className="l">Autonomy (days)</span><input type="number" step="0.5" value={autonomy} onChange={e=>setAutonomy(+e.target.value)} /></Field>
      <Field><span className="l">Depth of discharge</span><input type="number" step="0.05" min="0.3" max="0.95" value={dod} onChange={e=>setDod(+e.target.value)} /></Field>
      <Field><span className="l">Chemistry</span>
        <select value={chemistry} onChange={e=>setChemistry(e.target.value as any)}>
          <option value="lifepo4">LiFePO4 (recommended)</option>
          <option value="lead-acid">Lead-acid (legacy)</option>
        </select></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => eng.batterySizing({
        dailyCriticalLoadKwh: dailyKwh, autonomyDays: autonomy,
        depthOfDischarge: dod, chemistry,
      }))}>{r.loading ? 'Sizing…' : 'Size battery bank'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const PricedBoqRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const [systemKw, setSystemKw] = useState(ctx.metrics?.systemSizeKw > 0 ? ctx.metrics.systemSizeKw : 5);
  const [batteryKwh, setBatteryKwh] = useState(ctx.design?.batteryKwh || 10);
  const [margin, setMargin] = useState(18);
  return (
    <>
      <Hint>Bottom-up cost build with 5 % contingency, your margin and 16 % VAT (KE 2025).</Hint>
      <Field><span className="l">System size (kW DC)</span><input type="number" step="0.1" value={systemKw} onChange={e=>setSystemKw(+e.target.value)} /></Field>
      <Field><span className="l">Battery (kWh, 0 if none)</span><input type="number" step="0.5" value={batteryKwh} onChange={e=>setBatteryKwh(+e.target.value)} /></Field>
      <Field><span className="l">Sales margin (%)</span><input type="number" step="0.5" value={margin} onChange={e=>setMargin(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => eng.pricedBoq({
        systemKw, batteryKwh, marginPct: margin,
      }))}>{r.loading ? 'Building BOQ…' : 'Generate priced BOQ'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const OmScheduleRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const [systemKw, setSystemKw] = useState(ctx.metrics?.systemSizeKw > 0 ? ctx.metrics.systemSizeKw : 5);
  const [climate, setClimate] = useState('tropical');
  const [hasBattery, setHasBattery] = useState(true);
  return (
    <>
      <Hint>IEC 62446-1 inspection schedule, climate-tuned wash interval, annual labour hours.</Hint>
      <Field><span className="l">System size (kW)</span><input type="number" step="0.1" value={systemKw} onChange={e=>setSystemKw(+e.target.value)} /></Field>
      <Field><span className="l">Climate</span>
        <select value={climate} onChange={e=>setClimate(e.target.value)}>
          <option value="arid">Arid (NE Kenya, Turkana)</option>
          <option value="semiarid">Semi-arid (Machakos, Eastern)</option>
          <option value="tropical">Tropical (Coast, Western, most of KE)</option>
          <option value="temperate">Temperate (Highlands &gt;2000 m)</option>
        </select></Field>
      <Field><span className="l">Has battery?</span>
        <select value={hasBattery ? 'y' : 'n'} onChange={e=>setHasBattery(e.target.value==='y')}>
          <option value="y">Yes</option><option value="n">No</option>
        </select></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => eng.oAndMSchedule({
        systemKw, climate, hasBattery, hasInverter: true,
        installCommissionDateISO: new Date().toISOString().slice(0,10),
      }))}>{r.loading ? 'Generating…' : 'Generate annual schedule'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const NetMeteringRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const [pvKwh, setPvKwh] = useState(ctx.metrics?.annualProduction || 7800);
  const [loadKwh, setLoadKwh] = useState((ctx.site?.monthlyConsumptionKwh || 600) * 12);
  const [selfUse, setSelfUse] = useState(0.70);
  const [exportCredit, setExportCredit] = useState(0.65);
  return (
    <>
      <Hint>EPRA Net-Metering Regulations 2024 — exports credited at avoided-cost (~65 % of retail), not retail.</Hint>
      <Field><span className="l">Annual PV (kWh)</span><input type="number" value={pvKwh} onChange={e=>setPvKwh(+e.target.value)} /></Field>
      <Field><span className="l">Annual load (kWh)</span><input type="number" value={loadKwh} onChange={e=>setLoadKwh(+e.target.value)} /></Field>
      <Field><span className="l">Self-consumption fraction</span><input type="number" step="0.05" min="0" max="1" value={selfUse} onChange={e=>setSelfUse(+e.target.value)} /></Field>
      <Field><span className="l">Export credit fraction (avoided/retail)</span><input type="number" step="0.05" min="0" max="1" value={exportCredit} onChange={e=>setExportCredit(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => eng.netMeteringKE({
        annualPvKwh: pvKwh, annualLoadKwh: loadKwh,
        selfConsumptionFraction: selfUse, exportCreditFraction: exportCredit,
      }))}>{r.loading ? 'Computing…' : 'Compute net-metering benefit'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const BifacialRunner: React.FC = () => {
  const r = useRunner();
  const [poaFront, setPoaFront] = useState(900);
  const [ghi, setGhi] = useState(950);
  const [tilt, setTilt] = useState(15);
  const [albedo, setAlbedo] = useState(0.25);
  return (
    <>
      <Hint>Rear-irradiance estimator. Albedo: grass 0.20, concrete 0.35, white roof 0.55, sand 0.40.</Hint>
      <Field><span className="l">Front POA irradiance (W/m²)</span><input type="number" value={poaFront} onChange={e=>setPoaFront(+e.target.value)} /></Field>
      <Field><span className="l">GHI (W/m²)</span><input type="number" value={ghi} onChange={e=>setGhi(+e.target.value)} /></Field>
      <Field><span className="l">Tilt (°)</span><input type="number" value={tilt} onChange={e=>setTilt(+e.target.value)} /></Field>
      <Field><span className="l">Albedo</span><input type="number" step="0.05" min="0" max="1" value={albedo} onChange={e=>setAlbedo(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => bos.bifacialGain({
        poaFront, ghi, tilt, albedo, bifacialityFactor: 0.70, structureFactor: 0.95,
      }))}>{r.loading ? 'Computing…' : 'Compute bifacial gain'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const SoilingRunner: React.FC = () => {
  const r = useRunner();
  const [climate, setClimate] = useState('tropical');
  const [days, setDays] = useState(30);
  return (
    <>
      <Hint>Kimber/NREL 2006 climate-dependent soiling derate.</Hint>
      <Field><span className="l">Climate</span>
        <select value={climate} onChange={e=>setClimate(e.target.value)}>
          <option value="arid">Arid</option>
          <option value="semiarid">Semi-arid</option>
          <option value="tropical">Tropical</option>
          <option value="temperate">Temperate</option>
        </select></Field>
      <Field><span className="l">Days since last cleaning</span><input type="number" value={days} onChange={e=>setDays(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => bos.soiling({ climate, daysSinceClean: days }))}>
        {r.loading ? 'Computing…' : 'Compute soiling loss'}
      </Run>
      <ResultBlock {...r} />
    </>
  );
};

const TariffSensRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const [capex, setCapex] = useState(ctx.financial?.capexKes || ctx.metrics?.totalCost || 1200000);
  const [year1, setYear1] = useState((ctx.metrics?.monthlySaving || 8000) * 12);
  const [baseline, setBaseline] = useState(6);
  return (
    <>
      <Hint>IRR sensitivity to KPLC tariff escalation. Tests baseline ±3 % around your assumption.</Hint>
      <Field><span className="l">CAPEX (KSh)</span><input type="number" value={capex} onChange={e=>setCapex(+e.target.value)} /></Field>
      <Field><span className="l">Year-1 saving (KSh)</span><input type="number" value={year1} onChange={e=>setYear1(+e.target.value)} /></Field>
      <Field><span className="l">Baseline tariff escalation (%/yr)</span><input type="number" step="0.5" value={baseline} onChange={e=>setBaseline(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => eng.tariffSensitivity({
        capexKes: capex, year1SavingKes: year1, baselineEscalationPct: baseline,
      }))}>{r.loading ? 'Computing…' : 'Compute IRR sensitivity'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const GensetDisplaceRunner: React.FC = () => {
  const r = useRunner();
  const [kva, setKva] = useState(30);
  const [hours, setHours] = useState(6);
  const [diesel, setDiesel] = useState(195);
  return (
    <>
      <Hint>Computes diesel litres + maintenance + overhaul accrual saved by solar/battery.</Hint>
      <Field><span className="l">Genset rated (kVA)</span><input type="number" value={kva} onChange={e=>setKva(+e.target.value)} /></Field>
      <Field><span className="l">Genset run hours/day (current)</span><input type="number" step="0.5" value={hours} onChange={e=>setHours(+e.target.value)} /></Field>
      <Field><span className="l">Diesel pump price (KSh/l)</span><input type="number" value={diesel} onChange={e=>setDiesel(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => eng.generatorDisplacement({
        gensetRatedKva: kva, gensetRunHoursPerDay: hours, dieselPriceKesPerL: diesel,
      }))}>{r.loading ? 'Computing…' : 'Compute genset displacement'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const ThreePhaseRunner: React.FC = () => {
  const r = useRunner();
  const [l1, setL1] = useState(8); const [l2, setL2] = useState(6); const [l3, setL3] = useState(10);
  const [pv1, setPv1] = useState(3); const [pv2, setPv2] = useState(3); const [pv3, setPv3] = useState(3);
  return (
    <>
      <Hint>IEC 61000-3-13 phase-unbalance. EPRA limit: 2 % at PCC.</Hint>
      <Field><span className="l">Load L1 (kW)</span><input type="number" step="0.5" value={l1} onChange={e=>setL1(+e.target.value)} /></Field>
      <Field><span className="l">Load L2 (kW)</span><input type="number" step="0.5" value={l2} onChange={e=>setL2(+e.target.value)} /></Field>
      <Field><span className="l">Load L3 (kW)</span><input type="number" step="0.5" value={l3} onChange={e=>setL3(+e.target.value)} /></Field>
      <Field><span className="l">PV L1 (kW)</span><input type="number" step="0.5" value={pv1} onChange={e=>setPv1(+e.target.value)} /></Field>
      <Field><span className="l">PV L2 (kW)</span><input type="number" step="0.5" value={pv2} onChange={e=>setPv2(+e.target.value)} /></Field>
      <Field><span className="l">PV L3 (kW)</span><input type="number" step="0.5" value={pv3} onChange={e=>setPv3(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => eng.threePhaseImbalance({
        loadL1Kw: l1, loadL2Kw: l2, loadL3Kw: l3, pvL1Kw: pv1, pvL2Kw: pv2, pvL3Kw: pv3,
      }))}>{r.loading ? 'Checking…' : 'Check phase imbalance'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const GeoRiskRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const [lat, setLat] = useState(ctx.site?.lat ?? -1.2865);
  const [lon, setLon] = useState(ctx.site?.lon ?? 36.8172);
  return (
    <>
      <Hint>KE wind/seismic/flood zoning per KS EAS 162 + KE National Building Code.</Hint>
      <Field><span className="l">Latitude</span><input type="number" step="0.0001" value={lat} onChange={e=>setLat(+e.target.value)} /></Field>
      <Field><span className="l">Longitude</span><input type="number" step="0.0001" value={lon} onChange={e=>setLon(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => eng.geoRisk({ lat, lon }))}>
        {r.loading ? 'Looking up…' : 'Lookup geo-risk'}
      </Run>
      <ResultBlock {...r} />
    </>
  );
};

const InverterMatchRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const [pv, setPv] = useState(ctx.metrics?.systemSizeKw > 0 ? ctx.metrics.systemSizeKw : 6);
  const [inv, setInv] = useState(5);
  return (
    <>
      <Hint>DC/AC ratio per NREL/IEC 62109. Sweet spot 1.10–1.30.</Hint>
      <Field><span className="l">PV array (kW STC)</span><input type="number" step="0.1" value={pv} onChange={e=>setPv(+e.target.value)} /></Field>
      <Field><span className="l">Inverter AC (kW)</span><input type="number" step="0.1" value={inv} onChange={e=>setInv(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => bos.inverterMatch({ pvKwStc: pv, inverterAcKw: inv }))}>
        {r.loading ? 'Checking…' : 'Check DC/AC match'}
      </Run>
      <ResultBlock {...r} />
    </>
  );
};

const ClientPortalRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const [projectId, setProjectId] = useState('PRJ-' + Date.now().toString().slice(-6));
  const [client, setClient] = useState(ctx.metrics?.clientName || 'Client');
  return (
    <>
      <Hint>Generates a read-only portal URL + WhatsApp share link your client can open from their phone.</Hint>
      <Field><span className="l">Project ID</span><input value={projectId} onChange={e=>setProjectId(e.target.value)} /></Field>
      <Field><span className="l">Client name</span><input value={client} onChange={e=>setClient(e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => eng.clientPortalLink({ projectId, clientName: client }))}>
        {r.loading ? 'Generating…' : 'Generate portal link'}
      </Run>
      <ResultBlock {...r} />
    </>
  );
};

const AutoBomRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const [annualKwh, setAnnualKwh] = useState((ctx.site?.monthlyConsumptionKwh || 600) * 12);
  const [tilt, setTilt] = useState(10);
  const [azimuth, setAzimuth] = useState(0);
  return (
    <>
      <Hint>End-to-end engineering pipeline: load → panels → inverter → strings → cables → BOM, with IEC/NEC standards verified.</Hint>
      <Field><span className="l">Annual consumption (kWh)</span><input type="number" value={annualKwh} onChange={e=>setAnnualKwh(+e.target.value)} /></Field>
      <Field><span className="l">Tilt (°)</span><input type="number" value={tilt} onChange={e=>setTilt(+e.target.value)} /></Field>
      <Field><span className="l">Azimuth (° from N, 0=N, 180=S)</span><input type="number" value={azimuth} onChange={e=>setAzimuth(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => fetch('/api/solar/auto-design', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          annualConsumptionKwh: annualKwh, ambientMinC: 5, ambientMaxC: 60,
          tiltDeg: tilt, azimuthDeg: azimuth, targetSpecificYieldKwhPerKwp: 1700,
        })
      }).then(x => x.json()))}>{r.loading ? 'Designing…' : 'Auto-design system'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

// =====================================================================
// ENGINEERING-PRO RUNNERS (Aurora-grade)
// =====================================================================

const HourlyShadingRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const [lat, setLat] = useState(ctx.site?.lat ?? -1.2865);
  const [horizonN, setHorizonN] = useState(10);
  const [horizonE, setHorizonE] = useState(5);
  const [horizonS, setHorizonS] = useState(0);
  const [horizonW, setHorizonW] = useState(8);
  const [ghi, setGhi] = useState(1900);
  return (
    <>
      <Hint>Per-azimuth horizon mask in degrees (0=flat, 30=tall obstruction). Spencer 1971 sun-path × mask → annual loss.</Hint>
      <Field><span className="l">Latitude</span><input type="number" step="0.0001" value={lat} onChange={e=>setLat(+e.target.value)} /></Field>
      <Field><span className="l">Horizon north (°)</span><input type="number" value={horizonN} onChange={e=>setHorizonN(+e.target.value)} /></Field>
      <Field><span className="l">Horizon east (°)</span><input type="number" value={horizonE} onChange={e=>setHorizonE(+e.target.value)} /></Field>
      <Field><span className="l">Horizon south (°)</span><input type="number" value={horizonS} onChange={e=>setHorizonS(+e.target.value)} /></Field>
      <Field><span className="l">Horizon west (°)</span><input type="number" value={horizonW} onChange={e=>setHorizonW(+e.target.value)} /></Field>
      <Field><span className="l">Annual GHI (kWh/m²)</span><input type="number" value={ghi} onChange={e=>setGhi(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => engPro.hourlyShading({
        latDeg: lat,
        horizonMask: { '0': horizonN, '90': horizonE, '180': horizonS, '270': horizonW },
        ghiAnnualKwhPerM2: ghi,
      }))}>{r.loading ? 'Computing…' : 'Compute hourly shading'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const BatteryMCRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const [variability, setVariability] = useState(25);
  const [autonomy, setAutonomy] = useState(1);
  const [confidence, setConfidence] = useState(95);
  const [trials, setTrials] = useState(1000);
  const [chemistry, setChemistry] = useState<'lifepo4'|'lead-acid'>('lifepo4');
  return (
    <>
      <Hint>1000-trial Monte Carlo with Gaussian load noise. Default profile is tropical residential — supply your own 24-hour kW array for finance-grade.</Hint>
      <Field><span className="l">Load variability (±%)</span><input type="number" value={variability} onChange={e=>setVariability(+e.target.value)} /></Field>
      <Field><span className="l">Autonomy (days)</span><input type="number" step="0.5" value={autonomy} onChange={e=>setAutonomy(+e.target.value)} /></Field>
      <Field><span className="l">Sizing confidence (P-X)</span>
        <select value={confidence} onChange={e=>setConfidence(+e.target.value)}>
          <option value={75}>P75</option><option value={90}>P90</option><option value={95}>P95</option><option value={99}>P99</option>
        </select></Field>
      <Field><span className="l">Trials</span><input type="number" value={trials} onChange={e=>setTrials(+e.target.value)} /></Field>
      <Field><span className="l">Chemistry</span>
        <select value={chemistry} onChange={e=>setChemistry(e.target.value as any)}>
          <option value="lifepo4">LiFePO4</option><option value="lead-acid">Lead-acid</option>
        </select></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => engPro.batteryMonteCarlo({
        loadVariabilityPct: variability, autonomyDays: autonomy,
        confidencePct: confidence, trials, chemistry,
      }))}>{r.loading ? 'Simulating…' : 'Run Monte Carlo'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const LightningFullRunner: React.FC = () => {
  const r = useRunner();
  const [occ, setOcc] = useState('residential');
  const [flash, setFlash] = useState(8);
  const [height, setHeight] = useState(6);
  const [footprint, setFootprint] = useState(120);
  const [building, setBuilding] = useState(5_000_000);
  const [content, setContent] = useState(2_000_000);
  return (
    <>
      <Hint>Full IEC 62305-2 risk: R1 (life), R2 (service), R4 (economic). Computes required LPS class to bring R1 ≤ 10⁻⁵.</Hint>
      <Field><span className="l">Occupancy</span>
        <select value={occ} onChange={e=>setOcc(e.target.value)}>
          <option value="residential">Residential</option><option value="commercial">Commercial</option>
          <option value="industrial">Industrial</option><option value="hospital">Hospital</option><option value="telecom">Telecom</option>
        </select></Field>
      <Field><span className="l">Flash density (strokes/km²/yr)</span><input type="number" step="0.1" value={flash} onChange={e=>setFlash(+e.target.value)} /></Field>
      <Field><span className="l">Building height (m)</span><input type="number" value={height} onChange={e=>setHeight(+e.target.value)} /></Field>
      <Field><span className="l">Footprint (m²)</span><input type="number" value={footprint} onChange={e=>setFootprint(+e.target.value)} /></Field>
      <Field><span className="l">Building value (KSh)</span><input type="number" value={building} onChange={e=>setBuilding(+e.target.value)} /></Field>
      <Field><span className="l">Contents value (KSh)</span><input type="number" value={content} onChange={e=>setContent(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => engPro.lightningFull({
        occupancyType: occ, flashDensityPerKm2Year: flash,
        buildingHeightM: height, buildingFootprintM2: footprint,
        buildingValueKes: building, contentValueKes: content,
      }))}>{r.loading ? 'Assessing…' : 'Run full RA'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const PricedBoqFxRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const [systemKw, setSystemKw] = useState(ctx.metrics?.systemSizeKw > 0 ? ctx.metrics.systemSizeKw : 5);
  const [batteryKwh, setBatteryKwh] = useState(ctx.design?.batteryKwh || 10);
  const [fx, setFx] = useState(130);
  const [margin, setMargin] = useState(18);
  return (
    <>
      <Hint>USD-pegged BOQ × live FX rate (pull from /api/finance/currency for binding offer).</Hint>
      <Field><span className="l">System (kW)</span><input type="number" step="0.1" value={systemKw} onChange={e=>setSystemKw(+e.target.value)} /></Field>
      <Field><span className="l">Battery (kWh, 0=none)</span><input type="number" step="0.5" value={batteryKwh} onChange={e=>setBatteryKwh(+e.target.value)} /></Field>
      <Field><span className="l">FX (KES per USD)</span><input type="number" step="0.5" value={fx} onChange={e=>setFx(+e.target.value)} /></Field>
      <Field><span className="l">Margin (%)</span><input type="number" step="0.5" value={margin} onChange={e=>setMargin(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => engPro.pricedBoqFx({
        systemKw, batteryKwh, fxKesPerUsd: fx, marginPct: margin,
      }))}>{r.loading ? 'Building…' : 'Build FX-aware BOQ'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const GeoRiskKERunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const [lat, setLat] = useState(ctx.site?.lat ?? -1.2865);
  const [lon, setLon] = useState(ctx.site?.lon ?? 36.8172);
  return (
    <>
      <Hint>12-zone county-resolution KE classification: wind, seismic, flood, atmospheric corrosion class.</Hint>
      <Field><span className="l">Latitude</span><input type="number" step="0.0001" value={lat} onChange={e=>setLat(+e.target.value)} /></Field>
      <Field><span className="l">Longitude</span><input type="number" step="0.0001" value={lon} onChange={e=>setLon(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => engPro.geoRiskKE({ lat, lon }))}>
        {r.loading ? 'Looking up…' : 'Lookup zone'}
      </Run>
      <ResultBlock {...r} />
    </>
  );
};

const NetMeteringTOURunner: React.FC = () => {
  const r = useRunner();
  const [base, setBase] = useState(22.5);
  const [exportCredit, setExportCredit] = useState(0.65);
  return (
    <>
      <Hint>Hour-by-hour PV vs load × TOU bands (peak ×1.30, shoulder ×1.00, off-peak ×0.50). Default profiles synthetic; supply real curves for finance-grade.</Hint>
      <Field><span className="l">Base C&I tariff (KSh/kWh)</span><input type="number" step="0.1" value={base} onChange={e=>setBase(+e.target.value)} /></Field>
      <Field><span className="l">Export credit fraction</span><input type="number" step="0.05" min="0" max="1" value={exportCredit} onChange={e=>setExportCredit(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => engPro.netMeteringTOU({
        baseRetailKesPerKwh: base, exportCreditFraction: exportCredit,
      }))}>{r.loading ? 'Computing…' : 'Compute TOU benefit'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const StructuralWindRunner: React.FC = () => {
  const r = useRunner();
  const [Vb, setVb] = useState(33);
  const [height, setHeight] = useState(6);
  const [tilt, setTilt] = useState(15);
  const [area, setArea] = useState(30);
  const [mounting, setMounting] = useState<'flat-roof-ballast'|'rail-bolted'|'ground-screw'>('flat-roof-ballast');
  const [terrain, setTerrain] = useState<'I'|'II'|'III'|'IV'>('III');
  return (
    <>
      <Hint>EN 1991-1-4 wind-uplift + ballast/anchor sizing. Get Vb from Geo-Risk KE result.</Hint>
      <Field><span className="l">Basic wind speed Vb (m/s)</span><input type="number" value={Vb} onChange={e=>setVb(+e.target.value)} /></Field>
      <Field><span className="l">Building height (m)</span><input type="number" value={height} onChange={e=>setHeight(+e.target.value)} /></Field>
      <Field><span className="l">Array tilt (°)</span><input type="number" value={tilt} onChange={e=>setTilt(+e.target.value)} /></Field>
      <Field><span className="l">Array area (m²)</span><input type="number" value={area} onChange={e=>setArea(+e.target.value)} /></Field>
      <Field><span className="l">Mounting</span>
        <select value={mounting} onChange={e=>setMounting(e.target.value as any)}>
          <option value="flat-roof-ballast">Flat roof — ballast</option>
          <option value="rail-bolted">Pitched roof — rail-bolted</option>
          <option value="ground-screw">Ground — screw piles</option>
        </select></Field>
      <Field><span className="l">Terrain</span>
        <select value={terrain} onChange={e=>setTerrain(e.target.value as any)}>
          <option value="I">I (open sea)</option><option value="II">II (open country)</option>
          <option value="III">III (suburban)</option><option value="IV">IV (urban)</option>
        </select></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => engPro.structuralWind({
        basicWindSpeedMs: Vb, buildingHeightM: height, arrayTiltDeg: tilt,
        arrayAreaM2: area, mountingType: mounting, terrainCategory: terrain,
      }))}>{r.loading ? 'Computing…' : 'Compute wind & ballast'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const P50P90Runner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const [p50, setP50] = useState(ctx.metrics?.annualProduction || 7800);
  return (
    <>
      <Hint>NREL uncertainty quadrature → bankable P90 yield. Use P90 for debt-service-coverage in finance proposals.</Hint>
      <Field><span className="l">P50 annual yield (kWh)</span><input type="number" value={p50} onChange={e=>setP50(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => engPro.p50p90({ p50AnnualKwh: p50 }))}>
        {r.loading ? 'Computing…' : 'Compute P50/P75/P90'}
      </Run>
      <ResultBlock {...r} />
    </>
  );
};

const EarthElectrodeRunner: React.FC = () => {
  const r = useRunner();
  const [soil, setSoil] = useState<'clay'|'loam'|'sandy'|'rocky'|'desert'>('loam');
  const [length, setLength] = useState(2.4);
  const [diameter, setDiameter] = useState(16);
  const [rods, setRods] = useState(1);
  const [target, setTarget] = useState(10);
  return (
    <>
      <Hint>Dwight equation R = ρ/(2πL)·[ln(8L/d)−1] with multi-rod correction. KS 1515: ≤10 Ω LV; ≤1 Ω medical/telecom.</Hint>
      <Field><span className="l">Soil type</span>
        <select value={soil} onChange={e=>setSoil(e.target.value as any)}>
          <option value="clay">Clay (50 Ω·m)</option><option value="loam">Loam (150 Ω·m)</option>
          <option value="sandy">Sandy (500 Ω·m)</option><option value="rocky">Rocky (1000 Ω·m)</option>
          <option value="desert">Desert (3000 Ω·m)</option>
        </select></Field>
      <Field><span className="l">Rod length (m)</span><input type="number" step="0.1" value={length} onChange={e=>setLength(+e.target.value)} /></Field>
      <Field><span className="l">Rod diameter (mm)</span><input type="number" value={diameter} onChange={e=>setDiameter(+e.target.value)} /></Field>
      <Field><span className="l">Number of rods</span><input type="number" min="1" value={rods} onChange={e=>setRods(+e.target.value)} /></Field>
      <Field><span className="l">Target resistance (Ω)</span><input type="number" step="0.5" value={target} onChange={e=>setTarget(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => engPro.earthElectrode({
        soilType: soil, rodLengthM: length, rodDiameterMm: diameter,
        numRods: rods, targetResistanceOhm: target,
      }))}>{r.loading ? 'Computing…' : 'Size earth electrode'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const PortalJwtRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const [projectId, setProjectId] = useState('PRJ-' + Date.now().toString().slice(-6));
  const [client, setClient] = useState(ctx.metrics?.clientName || 'Client');
  const [phone, setPhone] = useState('+254768860665');
  const [scope, setScope] = useState<'read'|'comment'>('read');
  const [ttl, setTtl] = useState(90);
  return (
    <>
      <Hint>HMAC-SHA256 signed JWT (RFC 7519) with revocation support. Set PORTAL_JWT_SECRET env var in production.</Hint>
      <Field><span className="l">Project ID</span><input value={projectId} onChange={e=>setProjectId(e.target.value)} /></Field>
      <Field><span className="l">Client name</span><input value={client} onChange={e=>setClient(e.target.value)} /></Field>
      <Field><span className="l">Client phone (E.164)</span><input value={phone} onChange={e=>setPhone(e.target.value)} /></Field>
      <Field><span className="l">Scope</span>
        <select value={scope} onChange={e=>setScope(e.target.value as any)}>
          <option value="read">Read-only</option><option value="comment">Read + comment</option>
        </select></Field>
      <Field><span className="l">TTL (days)</span><input type="number" value={ttl} onChange={e=>setTtl(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => engPro.portalJwt({
        projectId, clientName: client, clientPhone: phone, scope, ttlDays: ttl,
      }))}>{r.loading ? 'Signing…' : 'Issue JWT'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

// =====================================================================
// ENGINEERING-ELITE RUNNERS (Tier-4 utility-scale / bankable)
// =====================================================================

const Tmy8760Runner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const [lat, setLat] = useState(ctx.site?.lat ?? -1.2865);
  const [lon, setLon] = useState(ctx.site?.lon ?? 36.8172);
  const [systemKw, setSystemKw] = useState(ctx.metrics?.systemSizeKw > 0 ? ctx.metrics.systemSizeKw : 5);
  const [invKw, setInvKw] = useState(4.2);
  const [tilt, setTilt] = useState(10);
  const [az, setAz] = useState(0);
  return (
    <>
      <Hint>Hour-by-hour 8760 simulation: Spencer sun-position × Erbs diffuse × Hay-Davies POA × NOCT cell-temp × inverter clipping. Synthesises hourly GHI from 12 monthly values when no TMY supplied.</Hint>
      <Field><span className="l">Latitude</span><input type="number" step="0.0001" value={lat} onChange={e=>setLat(+e.target.value)} /></Field>
      <Field><span className="l">Longitude</span><input type="number" step="0.0001" value={lon} onChange={e=>setLon(+e.target.value)} /></Field>
      <Field><span className="l">DC system (kWp)</span><input type="number" step="0.1" value={systemKw} onChange={e=>setSystemKw(+e.target.value)} /></Field>
      <Field><span className="l">Inverter (kW AC)</span><input type="number" step="0.1" value={invKw} onChange={e=>setInvKw(+e.target.value)} /></Field>
      <Field><span className="l">Tilt (°)</span><input type="number" value={tilt} onChange={e=>setTilt(+e.target.value)} /></Field>
      <Field><span className="l">Azimuth (° from N)</span><input type="number" value={az} onChange={e=>setAz(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => engElite.tmy8760({
        latDeg: lat, lonDeg: lon, systemKwDc: systemKw, inverterKwAc: invKw, tiltDeg: tilt, azimuthDeg: az,
      }))}>{r.loading ? 'Simulating 8760 hours…' : 'Run TMY simulation'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const ObstructionsRunner: React.FC = () => {
  const r = useRunner();
  const [obstructions, setObstructions] = useState([
    { type: 'cylinder', dx_m: 10, dy_m: 0, h_m: 6.5, w_m: 3 },
    { type: 'box',      dx_m: 0,  dy_m: 8, h_m: 4.0, w_m: 5 },
  ]);
  const [arrayHeight, setArrayHeight] = useState(1.5);
  const updateObst = (i: number, k: string, v: any) => {
    const clone = [...obstructions]; (clone[i] as any)[k] = v; setObstructions(clone);
  };
  return (
    <>
      <Hint>List nearby trees / buildings as boxes or cylinders. Coordinates: dx_m east, dy_m north of array centre. h_m = top height; w_m = width/diameter. Output feeds into Hourly Shading & TMY.</Hint>
      <Field><span className="l">Array height (m)</span><input type="number" step="0.1" value={arrayHeight} onChange={e=>setArrayHeight(+e.target.value)} /></Field>
      {obstructions.map((o, i) => (
        <div key={i} style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:6, fontSize:12, marginBottom:6 }}>
          <select value={o.type} onChange={e=>updateObst(i,'type',e.target.value)}>
            <option value="cylinder">Tree</option><option value="box">Building</option>
          </select>
          <input type="number" placeholder="dx" value={o.dx_m} onChange={e=>updateObst(i,'dx_m',+e.target.value)} />
          <input type="number" placeholder="dy" value={o.dy_m} onChange={e=>updateObst(i,'dy_m',+e.target.value)} />
          <input type="number" placeholder="h"  value={o.h_m}  onChange={e=>updateObst(i,'h_m',+e.target.value)} />
          <input type="number" placeholder="w"  value={o.w_m}  onChange={e=>updateObst(i,'w_m',+e.target.value)} />
        </div>
      ))}
      <Run disabled={r.loading} onClick={() => r.run(() => engElite.obstructions({
        obstructions, arrayHeightM: arrayHeight,
      }))}>{r.loading ? 'Computing…' : 'Build horizon mask'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const IntervalMeterRunner: React.FC = () => {
  const r = useRunner();
  // Generate sample 30-day hourly CSV
  const sample = (() => {
    let csv = 'timestamp,kw\n';
    for (let h = 0; h < 30 * 24; h++) {
      const ts = new Date(2025, 0, 1, h).toISOString();
      const hod = h % 24;
      const kw = (hod < 6 || hod >= 22) ? 0.30 : (hod >= 17 && hod < 22) ? 2.50 : 1.00;
      csv += `${ts},${kw.toFixed(2)}\n`;
    }
    return csv;
  })();
  const [csv, setCsv] = useState(sample);
  return (
    <>
      <Hint>Paste CSV with two columns: <code>timestamp</code> + <code>kw</code>. Accepts 1-min, 5-min, 15-min, hourly intervals. KPLC AMR exports work directly. Sample: 30 days of synthetic residential load.</Hint>
      <Field><span className="l">CSV data</span>
        <textarea rows={6} value={csv} onChange={e=>setCsv(e.target.value)} style={{ fontFamily:'monospace', fontSize:11, width:'100%' }} />
      </Field>
      <Run disabled={r.loading} onClick={() => r.run(() => engElite.intervalMeter({ csvText: csv }))}>
        {r.loading ? 'Parsing…' : 'Ingest meter data'}
      </Run>
      <ResultBlock {...r} />
    </>
  );
};

const MemberStructuralRunner: React.FC = () => {
  const r = useRunner();
  const [load, setLoad] = useState(0.30);
  const [purlinSpan, setPurlinSpan] = useState(1.2);
  const [rafterSpan, setRafterSpan] = useState(4.0);
  const [purlinMat, setPurlinMat] = useState('timber-c24');
  const [rafterMat, setRafterMat] = useState('timber-c24');
  const [fastener, setFastener] = useState('timber-screw');
  const [substrate, setSubstrate] = useState('timber-c24');
  const [uplift, setUplift] = useState(1.5);
  const [count, setCount] = useState(4);
  return (
    <>
      <Hint>Member-by-member elastic check. Use uplift from Structural Wind & Ballast endpoint.</Hint>
      <Field><span className="l">Design pressure (kN/m²)</span><input type="number" step="0.05" value={load} onChange={e=>setLoad(+e.target.value)} /></Field>
      <Field><span className="l">Purlin material</span>
        <select value={purlinMat} onChange={e=>setPurlinMat(e.target.value)}>
          <option value="timber-c24">Timber C24</option><option value="timber-c30">Timber C30</option>
          <option value="steel-s275">Steel S275</option><option value="aluminium-6061t6">Al 6061-T6</option>
        </select></Field>
      <Field><span className="l">Purlin span (m)</span><input type="number" step="0.1" value={purlinSpan} onChange={e=>setPurlinSpan(+e.target.value)} /></Field>
      <Field><span className="l">Rafter material</span>
        <select value={rafterMat} onChange={e=>setRafterMat(e.target.value)}>
          <option value="timber-c24">Timber C24</option><option value="timber-c30">Timber C30</option>
          <option value="steel-s275">Steel S275</option>
        </select></Field>
      <Field><span className="l">Rafter span (m)</span><input type="number" step="0.1" value={rafterSpan} onChange={e=>setRafterSpan(+e.target.value)} /></Field>
      <Field><span className="l">Fastener type</span>
        <select value={fastener} onChange={e=>setFastener(e.target.value)}>
          <option value="timber-screw">Timber screw</option>
          <option value="concrete-anchor">Concrete anchor</option>
          <option value="steel-bolt">Steel bolt</option>
        </select></Field>
      <Field><span className="l">Substrate</span>
        <select value={substrate} onChange={e=>setSubstrate(e.target.value)}>
          <option value="timber-c24">Timber C24</option>
          <option value="concrete-c25">Concrete C25</option>
          <option value="steel-s275">Steel S275</option>
        </select></Field>
      <Field><span className="l">Fastener count per array</span><input type="number" value={count} onChange={e=>setCount(+e.target.value)} /></Field>
      <Field><span className="l">Design uplift (kN)</span><input type="number" step="0.1" value={uplift} onChange={e=>setUplift(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => engElite.memberStructural({
        arrayLoadKnPerM2: load, purlinMaterial: purlinMat, purlinSpanM: purlinSpan,
        rafterMaterial: rafterMat, rafterSpanM: rafterSpan,
        fastenerType: fastener, substrate, fastenerCount: count, upliftLoadKn: uplift,
      }))}>{r.loading ? 'Checking…' : 'Run member checks'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const EpraGridCodeRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const [kw, setKw] = useState(ctx.metrics?.systemSizeKw > 0 ? ctx.metrics.systemSizeKw : 5);
  const [voltage, setVoltage] = useState(240);
  const [conn, setConn] = useState<'net-metering'|'wheeling'|'captive'>('net-metering');
  const [hasBattery, setHasBattery] = useState(true);
  const [iec62116, setIec62116] = useState(true);
  const [applicant, setApplicant] = useState(ctx.metrics?.clientName || 'Applicant');
  const [county, setCounty] = useState('Nairobi');
  return (
    <>
      <Hint>Auto-fills EPRA Form ECP-1 + Grid Code 2024 compliance checklist for KPLC interconnection.</Hint>
      <Field><span className="l">System (kW AC)</span><input type="number" step="0.1" value={kw} onChange={e=>setKw(+e.target.value)} /></Field>
      <Field><span className="l">Voltage (V)</span>
        <select value={voltage} onChange={e=>setVoltage(+e.target.value)}>
          <option value={240}>240 single-phase</option><option value={415}>415 three-phase</option>
        </select></Field>
      <Field><span className="l">Connection type</span>
        <select value={conn} onChange={e=>setConn(e.target.value as any)}>
          <option value="net-metering">Net-metering</option>
          <option value="wheeling">Wheeling</option>
          <option value="captive">Captive (no export)</option>
        </select></Field>
      <Field><span className="l">Battery storage</span>
        <select value={hasBattery ? 'y':'n'} onChange={e=>setHasBattery(e.target.value==='y')}>
          <option value="y">Yes</option><option value="n">No</option>
        </select></Field>
      <Field><span className="l">Inverter has IEC 62116?</span>
        <select value={iec62116 ? 'y':'n'} onChange={e=>setIec62116(e.target.value==='y')}>
          <option value="y">Yes (anti-islanding cert)</option><option value="n">No</option>
        </select></Field>
      <Field><span className="l">Applicant name</span><input value={applicant} onChange={e=>setApplicant(e.target.value)} /></Field>
      <Field><span className="l">County</span><input value={county} onChange={e=>setCounty(e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => engElite.epraGridCode({
        systemKwAc: kw, voltage, connectionType: conn, hasBattery,
        inverterCertifications: iec62116 ? ['IEC 62109-1','IEC 62109-2','IEC 62116'] : ['IEC 62109-1'],
        applicantName: applicant, siteCounty: county,
      }))}>{r.loading ? 'Building pack…' : 'Generate compliance pack'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const GaOptimiserRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const [load, setLoad] = useState(ctx.metrics?.annualConsumption || 8000);
  const [budget, setBudget] = useState(800000);
  const [pop, setPop] = useState(30);
  const [gens, setGens] = useState(40);
  const [tariff, setTariff] = useState(25);
  const [life, setLife] = useState(25);
  const [discount, setDiscount] = useState(12);
  return (
    <>
      <Hint>Genetic algorithm minimises LCOE picking panel + inverter from catalog under DC/AC, MPPT-window, and budget constraints.</Hint>
      <Field><span className="l">Annual load (kWh)</span><input type="number" value={load} onChange={e=>setLoad(+e.target.value)} /></Field>
      <Field><span className="l">Budget (KSh)</span><input type="number" value={budget} onChange={e=>setBudget(+e.target.value)} /></Field>
      <Field><span className="l">Tariff (KSh/kWh)</span><input type="number" step="0.5" value={tariff} onChange={e=>setTariff(+e.target.value)} /></Field>
      <Field><span className="l">Lifetime (yrs)</span><input type="number" value={life} onChange={e=>setLife(+e.target.value)} /></Field>
      <Field><span className="l">Discount rate (%)</span><input type="number" step="0.5" value={discount} onChange={e=>setDiscount(+e.target.value)} /></Field>
      <Field><span className="l">Population</span><input type="number" min="10" max="200" value={pop} onChange={e=>setPop(+e.target.value)} /></Field>
      <Field><span className="l">Generations</span><input type="number" min="10" max="200" value={gens} onChange={e=>setGens(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => engElite.gaOptimiser({
        loadKwhYear: load, budgetKes: budget, populationSize: pop, generations: gens,
        tariffKesPerKwh: tariff, systemLifetimeYears: life, discountRatePct: discount,
      }))}>{r.loading ? 'Evolving…' : 'Run GA optimisation'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const PanDegradationRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const [moduleType, setModuleType] = useState<'mono-perc'|'tops'|'bifacial'|'thin-film'>('mono-perc');
  const [life, setLife] = useState(25);
  const [initial, setInitial] = useState(ctx.metrics?.annualProduction || 7800);
  const [pan, setPan] = useState('');
  return (
    <>
      <Hint>Year-1 LID step + linear annual decline. Defaults from NREL PV degradation review (Jordan & Kurtz 2013). Optionally paste PAN file text for module-specific overrides.</Hint>
      <Field><span className="l">Module type</span>
        <select value={moduleType} onChange={e=>setModuleType(e.target.value as any)}>
          <option value="mono-perc">Mono-PERC</option>
          <option value="tops">TOPCon n-type</option>
          <option value="bifacial">Bifacial</option>
          <option value="thin-film">Thin-film</option>
        </select></Field>
      <Field><span className="l">Lifetime (yrs)</span><input type="number" value={life} onChange={e=>setLife(+e.target.value)} /></Field>
      <Field><span className="l">Year-1 yield (kWh)</span><input type="number" value={initial} onChange={e=>setInitial(+e.target.value)} /></Field>
      <Field><span className="l">PAN file (optional)</span>
        <textarea rows={3} value={pan} onChange={e=>setPan(e.target.value)} placeholder="Paste raw .PAN text..." style={{ fontFamily:'monospace', fontSize:11, width:'100%' }} />
      </Field>
      <Run disabled={r.loading} onClick={() => r.run(() => engElite.panDegradation({
        moduleType, systemLifetimeYears: life, initialKwhYear: initial,
        panFileText: pan || null,
      }))}>{r.loading ? 'Computing…' : 'Compute degradation curve'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

// =====================================================================
// ENGINEERING-GLOBAL — 6 runners (Tier-5: utility-scale, no upper limit)
// =====================================================================
const EpwImportRunner: React.FC = () => {
  const r = useRunner();
  const [epw, setEpw] = useState('');
  return (
    <>
      <Hint>Paste contents of a .epw (EnergyPlus Weather) file. Free sources: <code>energyplus.net/weather</code>, <code>climate.onebuilding.org</code>, NSRDB, SolarGIS, Meteonorm. Output feeds directly into 8760-hr TMY simulation.</Hint>
      <Field><span className="l">EPW file text</span>
        <textarea rows={6} value={epw} onChange={e=>setEpw(e.target.value)} placeholder="LOCATION,Nairobi,..,KEN,ASHRAE,..,..,-1.32,36.92,3.0,1798&#10;DESIGN CONDITIONS,..&#10;... 8 header lines ...&#10;1985,1,1,1,60,...,GHI,DNI,DHI,..." style={{ fontFamily:'monospace', fontSize:11, width:'100%' }} />
      </Field>
      <Run disabled={r.loading || !epw} onClick={() => r.run(() => engGlobal.epwImport({ epwText: epw }))}>{r.loading ? 'Parsing…' : 'Parse EPW file'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const PanOndParseRunner: React.FC = () => {
  const r = useRunner();
  const [text, setText] = useState('');
  const [type, setType] = useState<'auto'|'PAN'|'OND'>('auto');
  return (
    <>
      <Hint>Paste raw .PAN (module) or .OND (inverter) file from PVsyst, manufacturer's website, or pvsyst.com database. Auto-detects type. Returns full spec sheet: STC values, temp coefs, NOCT, MPPT window, efficiency.</Hint>
      <Field><span className="l">File type</span>
        <select value={type} onChange={e=>setType(e.target.value as any)}>
          <option value="auto">Auto-detect</option>
          <option value="PAN">PAN (module)</option>
          <option value="OND">OND (inverter)</option>
        </select></Field>
      <Field><span className="l">PAN/OND file text</span>
        <textarea rows={6} value={text} onChange={e=>setText(e.target.value)} placeholder="PVObject_=pvModule&#10;Manufacturer=Trina Solar&#10;Model=TSM-550NEG19RC.20&#10;PNom=550&#10;Vmpp=42.1&#10;Impp=13.07&#10;..." style={{ fontFamily:'monospace', fontSize:11, width:'100%' }} />
      </Field>
      <Run disabled={r.loading || !text} onClick={() => r.run(() => engGlobal.panOndParse({ fileText: text, fileType: type }))}>{r.loading ? 'Parsing…' : 'Parse file'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const ContinuousBeamRunner: React.FC = () => {
  const r = useRunner();
  const [spans, setSpans] = useState('3,3,3,3');
  const [load, setLoad] = useState(0.5);
  const [E, setE] = useState(210);
  const [I, setI] = useState(1e7);
  return (
    <>
      <Hint>N-span continuous racking rail crossing equally-spaced posts. Three-moment Clapeyron equation with Gaussian elimination on the tridiagonal system. Returns support moments, reactions, and max field deflection.</Hint>
      <Field><span className="l">Span lengths (m, comma-sep)</span><input value={spans} onChange={e=>setSpans(e.target.value)} placeholder="3,3,3,3" /></Field>
      <Field><span className="l">Uniform load (kN/m)</span><input type="number" step="0.05" value={load} onChange={e=>setLoad(+e.target.value)} /></Field>
      <Field><span className="l">E (GPa) — steel 210, Al 69, timber 11</span><input type="number" value={E} onChange={e=>setE(+e.target.value)} /></Field>
      <Field><span className="l">I (mm⁴)</span><input type="number" value={I} onChange={e=>setI(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => engGlobal.continuousBeam({
        spanLengthsM: spans.split(',').map(s => +s.trim()).filter(n => n > 0),
        uniformLoadKnPerM: load, E_GPa: E, I_mm4: I,
      }))}>{r.loading ? 'Solving…' : 'Solve continuous beam'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const GridCodeRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const [cc, setCc] = useState('KE');
  const [kw, setKw] = useState(ctx.metrics?.systemSizeKw || 100);
  const [vlevel, setVlevel] = useState<'LV'|'MV'|'HV'>('LV');
  return (
    <>
      <Hint>Per-country grid-code pack — 11 jurisdictions plus generic IEC fallback. Returns regulator, regulations list, anti-islanding standard, V/f ride-through, harmonics limit, and required documents.</Hint>
      <Field><span className="l">Country</span>
        <select value={cc} onChange={e=>setCc(e.target.value)}>
          <option value="KE">Kenya (EPRA)</option>
          <option value="US">USA (IEEE 1547)</option>
          <option value="EU">EU (EN 50549)</option>
          <option value="UK">UK (G98/G99)</option>
          <option value="DE">Germany (VDE-AR-N 4105)</option>
          <option value="AU">Australia (AS/NZS 4777)</option>
          <option value="ZA">South Africa (NRS 097-2)</option>
          <option value="IN">India (CEA)</option>
          <option value="NG">Nigeria (NERC)</option>
          <option value="JP">Japan (JET)</option>
          <option value="BR">Brazil (ANEEL)</option>
          <option value="IEC">Generic IEC fallback</option>
        </select></Field>
      <Field><span className="l">System AC kW</span><input type="number" value={kw} onChange={e=>setKw(+e.target.value)} /></Field>
      <Field><span className="l">Voltage level</span>
        <select value={vlevel} onChange={e=>setVlevel(e.target.value as any)}>
          <option value="LV">Low Voltage</option>
          <option value="MV">Medium Voltage</option>
          <option value="HV">High Voltage</option>
        </select></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => engGlobal.gridCode({ countryCode: cc, systemAcKw: kw, voltageLevel: vlevel }))}>{r.loading ? 'Loading…' : 'Get grid-code pack'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const PvgisHourlyRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const [lat, setLat] = useState(ctx.site?.latitude ?? -1.2865);
  const [lon, setLon] = useState(ctx.site?.longitude ?? 36.8172);
  const [year, setYear] = useState(2020);
  const [db, setDb] = useState<'PVGIS-SARAH2'|'PVGIS-NSRDB'|'PVGIS-ERA5'>('PVGIS-SARAH2');
  return (
    <>
      <Hint>Fetches real satellite-derived hourly TMY from JRC PVGIS v5.2 (free, CC-BY 4.0). Coverage 65°S to 65°N. SARAH-2 best for Africa/EU/Asia, NSRDB best for Americas, ERA5 reanalysis covers everywhere including high latitudes.</Hint>
      <Field><span className="l">Latitude (°)</span><input type="number" step="0.001" value={lat} onChange={e=>setLat(+e.target.value)} /></Field>
      <Field><span className="l">Longitude (°)</span><input type="number" step="0.001" value={lon} onChange={e=>setLon(+e.target.value)} /></Field>
      <Field><span className="l">Year</span><input type="number" min="2005" max="2023" value={year} onChange={e=>setYear(+e.target.value)} /></Field>
      <Field><span className="l">Radiation database</span>
        <select value={db} onChange={e=>setDb(e.target.value as any)}>
          <option value="PVGIS-SARAH2">SARAH-2 (best for AF/EU/AS)</option>
          <option value="PVGIS-NSRDB">NSRDB (best for Americas)</option>
          <option value="PVGIS-ERA5">ERA5 reanalysis (global)</option>
        </select></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => engGlobal.pvgisHourly({ latDeg: lat, lonDeg: lon, startYear: year, endYear: year, raddatabase: db }))}>{r.loading ? 'Fetching from PVGIS…' : 'Fetch hourly TMY'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const FinancePackRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const [capex, setCapex] = useState(ctx.financial?.totalCost || 5_000_000);
  const [gen, setGen] = useState(ctx.metrics?.annualProduction || 150_000);
  const [tariff, setTariff] = useState(25);
  const [cur, setCur] = useState('KES');
  const [life, setLife] = useState(25);
  const [disc, setDisc] = useState(8);
  const [infl, setInfl] = useState(5);
  return (
    <>
      <Hint>Multi-currency LCOE / NPV / IRR with discounted cash-flow. Supports 11 currencies with default FX (override via fxToUsd if real-time needed). Bankability verdict applied if LCOE &lt; tariff and IRR &gt; 10%.</Hint>
      <Field><span className="l">Capex (local)</span><input type="number" value={capex} onChange={e=>setCapex(+e.target.value)} /></Field>
      <Field><span className="l">Annual generation (kWh)</span><input type="number" value={gen} onChange={e=>setGen(+e.target.value)} /></Field>
      <Field><span className="l">Tariff per kWh (local)</span><input type="number" step="0.01" value={tariff} onChange={e=>setTariff(+e.target.value)} /></Field>
      <Field><span className="l">Currency</span>
        <select value={cur} onChange={e=>setCur(e.target.value)}>
          <option value="KES">KES (Kenyan Shilling)</option>
          <option value="USD">USD (US Dollar)</option>
          <option value="EUR">EUR (Euro)</option>
          <option value="GBP">GBP (British Pound)</option>
          <option value="ZAR">ZAR (SA Rand)</option>
          <option value="NGN">NGN (Naira)</option>
          <option value="INR">INR (Indian Rupee)</option>
          <option value="AUD">AUD (Australian Dollar)</option>
          <option value="JPY">JPY (Japanese Yen)</option>
          <option value="BRL">BRL (Brazilian Real)</option>
          <option value="CNY">CNY (Chinese Yuan)</option>
        </select></Field>
      <Field><span className="l">Lifetime (yrs)</span><input type="number" value={life} onChange={e=>setLife(+e.target.value)} /></Field>
      <Field><span className="l">Discount rate (%)</span><input type="number" step="0.5" value={disc} onChange={e=>setDisc(+e.target.value)} /></Field>
      <Field><span className="l">Inflation rate (%)</span><input type="number" step="0.5" value={infl} onChange={e=>setInfl(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => engGlobal.financePack({
        capexLocalCurrency: capex, annualGenKwh: gen, tariffPerKwh: tariff,
        currencyCode: cur, systemLifetimeYears: life,
        discountRatePct: disc, inflationRatePct: infl,
      }))}>{r.loading ? 'Computing…' : 'Compute multi-currency finance'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

// =====================================================================
// ENGINEERING-APPROVAL — 7 runners (Tier-6: PE / Chartered Engineer sign-off)
// =====================================================================
const Iec62446Runner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const [proj, setProj] = useState(ctx.site?.address || 'PROJ-001');
  const [kw, setKw] = useState(ctx.metrics?.systemSizeKw || 5);
  const [voc, setVoc] = useState(480);
  const [vocExp, setVocExp] = useState(492);
  const [iso, setIso] = useState(50);
  const [earth, setEarth] = useState(5);
  const [eng, setEng] = useState('TBC');
  const [lic, setLic] = useState('EPRA Class A1 — TBC');
  return (
    <>
      <Hint>Generates the IEC 62446-1:2016 Verification Report — visual inspection (10 items) + electrical testing (7 items). Returns SHA-256 tamper-evident hash. Engineer name + licence required for sign-off.</Hint>
      <Field><span className="l">Project ID</span><input value={proj} onChange={e=>setProj(e.target.value)} /></Field>
      <Field><span className="l">System DC kWp</span><input type="number" value={kw} onChange={e=>setKw(+e.target.value)} /></Field>
      <Field><span className="l">Voc measured (V)</span><input type="number" value={voc} onChange={e=>setVoc(+e.target.value)} /></Field>
      <Field><span className="l">Voc expected (V)</span><input type="number" value={vocExp} onChange={e=>setVocExp(+e.target.value)} /></Field>
      <Field><span className="l">Insulation resistance (MΩ)</span><input type="number" value={iso} onChange={e=>setIso(+e.target.value)} /></Field>
      <Field><span className="l">Earth resistance (Ω)</span><input type="number" step="0.1" value={earth} onChange={e=>setEarth(+e.target.value)} /></Field>
      <Field><span className="l">Test engineer name</span><input value={eng} onChange={e=>setEng(e.target.value)} /></Field>
      <Field><span className="l">Engineer licence</span><input value={lic} onChange={e=>setLic(e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => engApproval.iec62446Report({
        projectId: proj, systemKwDc: kw, vocMeasuredV: voc, vocExpectedV: vocExp,
        insulationResistanceMOhm: iso, earthResistanceOhm: earth,
        testEngineerName: eng, testEngineerLicence: lic,
      }))}>{r.loading ? 'Generating…' : 'Generate IEC 62446-1 report'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const SldSvgRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner<any>();
  const [proj, setProj] = useState('PROJ-001');
  const [strings, setStrings] = useState(4);
  const [perStr, setPerStr] = useState(12);
  const [pmax, setPmax] = useState(550);
  const [inv, setInv] = useState(ctx.metrics?.systemSizeKw || 25);
  return (
    <>
      <Hint>Generates a single-line diagram per IEC 60617 symbols as embeddable SVG (data-URI). Topology: strings → fuses → DC bus → DC isolator → inverter → AC MCB → bidirectional meter → grid + earthing.</Hint>
      <Field><span className="l">Project ID</span><input value={proj} onChange={e=>setProj(e.target.value)} /></Field>
      <Field><span className="l">String count</span><input type="number" value={strings} onChange={e=>setStrings(+e.target.value)} /></Field>
      <Field><span className="l">Modules per string</span><input type="number" value={perStr} onChange={e=>setPerStr(+e.target.value)} /></Field>
      <Field><span className="l">Module Pmax (W)</span><input type="number" value={pmax} onChange={e=>setPmax(+e.target.value)} /></Field>
      <Field><span className="l">Inverter AC kW</span><input type="number" value={inv} onChange={e=>setInv(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => engApproval.singleLineDiagram({
        projectId: proj, stringCount: strings, modulesPerString: perStr, modulePmaxW: pmax, inverterKwAc: inv,
      }))}>{r.loading ? 'Drawing…' : 'Generate SLD'}</Run>
      {r.data?.sldDataUri && (
        <div style={{ marginTop: 12, padding: 8, border: '1px solid #ccc', background: '#fafafa' }}>
          <img src={r.data.sldDataUri} alt="SLD" style={{ maxWidth: '100%' }} />
          <div style={{ marginTop: 6, fontSize: 11 }}>
            <a href={r.data.sldDataUri} download={`SLD-${proj}.svg`}>Download SVG</a>
          </div>
        </div>
      )}
      <ResultBlock {...r} />
    </>
  );
};

const ArcRsdRunner: React.FC = () => {
  const r = useRunner();
  const [jur, setJur] = useState<'NEC2020'|'NEC2017'|'IEC63027'|'none'>('NEC2020');
  const [vdc, setVdc] = useState(600);
  const [loc, setLoc] = useState<'rooftop'|'ground'|'carport'>('rooftop');
  const [afci, setAfci] = useState(true);
  const [rsd, setRsd] = useState(true);
  return (
    <>
      <Hint>Validates DC arc-fault (NEC 690.11 / IEC 63027) and rapid-shutdown (NEC 690.12) compliance for the selected jurisdiction. Returns per-item compliance verdict + remediation text.</Hint>
      <Field><span className="l">Jurisdiction</span>
        <select value={jur} onChange={e=>setJur(e.target.value as any)}>
          <option value="NEC2020">NEC 2020 (USA)</option>
          <option value="NEC2017">NEC 2017 (USA)</option>
          <option value="IEC63027">IEC 63027:2023 (international)</option>
          <option value="none">No jurisdiction</option>
        </select></Field>
      <Field><span className="l">System DC voltage (V)</span><input type="number" value={vdc} onChange={e=>setVdc(+e.target.value)} /></Field>
      <Field><span className="l">Array location</span>
        <select value={loc} onChange={e=>setLoc(e.target.value as any)}>
          <option value="rooftop">Rooftop</option>
          <option value="ground">Ground-mount</option>
          <option value="carport">Carport</option>
        </select></Field>
      <Field><span className="l">Inverter integrated AFCI?</span>
        <select value={String(afci)} onChange={e=>setAfci(e.target.value==='true')}><option value="true">Yes</option><option value="false">No</option></select>
      </Field>
      <Field><span className="l">RSD controller present?</span>
        <select value={String(rsd)} onChange={e=>setRsd(e.target.value==='true')}><option value="true">Yes</option><option value="false">No</option></select>
      </Field>
      <Run disabled={r.loading} onClick={() => r.run(() => engApproval.arcRsdCompliance({
        jurisdiction: jur, systemDcVoltage: vdc, arrayLocation: loc,
        inverterHasIntegratedAfci: afci, inverterHasModuleRapidShutdown: rsd,
        rsdControllerPresent: rsd, rsdInitiatorAtServiceDisconnect: rsd,
      }))}>{r.loading ? 'Checking…' : 'Check compliance'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const CableDeratedRunner: React.FC = () => {
  const r = useRunner();
  const [mat, setMat] = useState<'copper'|'aluminium'>('copper');
  const [csa, setCsa] = useState(6);
  const [meth, setMeth] = useState<'A1'|'B1'|'C'|'D'>('C');
  const [amb, setAmb] = useState(35);
  const [grp, setGrp] = useState(1);
  const [soil, setSoil] = useState(1.0);
  const [ins, setIns] = useState<'PVC'|'XLPE'>('XLPE');
  return (
    <>
      <Hint>Full IEC 60364-5-52 ampacity table lookup with ambient temperature (Table B.52.14/15), grouping (Table B.52.17), and soil thermal resistivity (Table B.52.16) corrections. PVC = 70°C, XLPE = 90°C insulation.</Hint>
      <Field><span className="l">Conductor</span>
        <select value={mat} onChange={e=>setMat(e.target.value as any)}>
          <option value="copper">Copper</option>
          <option value="aluminium">Aluminium</option>
        </select></Field>
      <Field><span className="l">CSA (mm²)</span>
        <select value={csa} onChange={e=>setCsa(+e.target.value)}>
          {[1.5,2.5,4,6,10,16,25,35,50,70,95,120].map(s => <option key={s} value={s}>{s}</option>)}
        </select></Field>
      <Field><span className="l">Installation method</span>
        <select value={meth} onChange={e=>setMeth(e.target.value as any)}>
          <option value="A1">A1 — In conduit, thermal insulation</option>
          <option value="B1">B1 — In conduit, on wall</option>
          <option value="C">C — Clipped direct</option>
          <option value="D">D — Buried</option>
        </select></Field>
      <Field><span className="l">Ambient (°C)</span><input type="number" value={amb} onChange={e=>setAmb(+e.target.value)} /></Field>
      <Field><span className="l">Grouped circuits</span><input type="number" value={grp} onChange={e=>setGrp(+e.target.value)} /></Field>
      {meth==='D' && <Field><span className="l">Soil thermal resistivity (K·m/W)</span><input type="number" step="0.1" value={soil} onChange={e=>setSoil(+e.target.value)} /></Field>}
      <Field><span className="l">Insulation</span>
        <select value={ins} onChange={e=>setIns(e.target.value as any)}>
          <option value="PVC">PVC (70°C)</option>
          <option value="XLPE">XLPE (90°C)</option>
        </select></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => engApproval.cableDerated({
        conductorMaterial: mat, csaMm2: csa, installationMethod: meth,
        ambientC: amb, groupedCircuits: grp, soilThermalResistivityKMPerW: soil,
        insulationType: ins,
      }))}>{r.loading ? 'Computing…' : 'Derate cable'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const Nfpa855Runner: React.FC = () => {
  const r = useRunner();
  const [chem, setChem] = useState<'LFP'|'NMC'|'LTO'|'LeadAcid'|'Flow'>('LFP');
  const [kwh, setKwh] = useState(50);
  const [loc, setLoc] = useState<'outdoor'|'dedicated-room'|'residential-garage'|'residential-bedroom'>('outdoor');
  const [occ, setOcc] = useState<'residential'|'commercial'|'industrial'|'data-centre'|'utility'>('commercial');
  const [pl, setPl] = useState(5);
  const [eg, setEg] = useState(3);
  const [supp, setSupp] = useState(false);
  const [gas, setGas] = useState(false);
  return (
    <>
      <Hint>NFPA 855:2023 + IEC 62933-5-2 fire-safety pack: threshold quantity, separation, egress, suppression, gas detection, residential limits, UL 9540A test report. Returns per-item compliance.</Hint>
      <Field><span className="l">Chemistry</span>
        <select value={chem} onChange={e=>setChem(e.target.value as any)}>
          <option value="LFP">LFP (Li-iron-phosphate)</option>
          <option value="NMC">NMC (Li-nickel-manganese-cobalt)</option>
          <option value="LTO">LTO</option>
          <option value="LeadAcid">Lead-acid</option>
          <option value="Flow">Flow (Vanadium/Zn-Br)</option>
        </select></Field>
      <Field><span className="l">Total energy (kWh)</span><input type="number" value={kwh} onChange={e=>setKwh(+e.target.value)} /></Field>
      <Field><span className="l">Location</span>
        <select value={loc} onChange={e=>setLoc(e.target.value as any)}>
          <option value="outdoor">Outdoor</option>
          <option value="dedicated-room">Dedicated room</option>
          <option value="residential-garage">Residential garage</option>
          <option value="residential-bedroom">Residential bedroom (prohibited)</option>
        </select></Field>
      <Field><span className="l">Occupancy</span>
        <select value={occ} onChange={e=>setOcc(e.target.value as any)}>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="industrial">Industrial</option>
          <option value="data-centre">Data centre</option>
          <option value="utility">Utility</option>
        </select></Field>
      <Field><span className="l">Property line distance (m)</span><input type="number" step="0.1" value={pl} onChange={e=>setPl(+e.target.value)} /></Field>
      <Field><span className="l">Egress corridor (m)</span><input type="number" step="0.1" value={eg} onChange={e=>setEg(+e.target.value)} /></Field>
      <Field><span className="l">Fire suppression installed?</span>
        <select value={String(supp)} onChange={e=>setSupp(e.target.value==='true')}><option value="false">No</option><option value="true">Yes</option></select>
      </Field>
      <Field><span className="l">Gas detection installed?</span>
        <select value={String(gas)} onChange={e=>setGas(e.target.value==='true')}><option value="false">No</option><option value="true">Yes</option></select>
      </Field>
      <Run disabled={r.loading} onClick={() => r.run(() => engApproval.nfpa855Battery({
        batteryChemistry: chem, totalEnergyKwh: kwh, installationLocation: loc,
        buildingOccupancyType: occ, propertyLineDistanceM: pl, egressDistanceM: eg,
        hasFireSuppression: supp, hasGasDetection: gas,
      }))}>{r.loading ? 'Checking…' : 'Check NFPA 855 compliance'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const FaaGlareRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const [aLat, setALat] = useState(ctx.site?.latitude ?? -1.32);
  const [aLon, setALon] = useState(ctx.site?.longitude ?? 36.92);
  const [tilt, setTilt] = useState(10);
  const [az, setAz] = useState(180);
  const [oLat, setOLat] = useState(-1.32);
  const [oLon, setOLon] = useState(36.93);
  const [oH, setOH] = useState(30);
  const [aH, setAH] = useState(5);
  const [obs, setObs] = useState<'atc-tower'|'aircraft-on-approach'|'road'|'residential'>('atc-tower');
  return (
    <>
      <Hint>Specular-reflection ray test per FAA Interim Policy (2013) / SGHAT methodology. Classifies glare as Green/Yellow/Red for the observer (ATC tower / approach path / road / residential).</Hint>
      <Field><span className="l">Array latitude (°)</span><input type="number" step="0.001" value={aLat} onChange={e=>setALat(+e.target.value)} /></Field>
      <Field><span className="l">Array longitude (°)</span><input type="number" step="0.001" value={aLon} onChange={e=>setALon(+e.target.value)} /></Field>
      <Field><span className="l">Array tilt (°)</span><input type="number" value={tilt} onChange={e=>setTilt(+e.target.value)} /></Field>
      <Field><span className="l">Array azimuth (°, 180=south)</span><input type="number" value={az} onChange={e=>setAz(+e.target.value)} /></Field>
      <Field><span className="l">Observer latitude (°)</span><input type="number" step="0.001" value={oLat} onChange={e=>setOLat(+e.target.value)} /></Field>
      <Field><span className="l">Observer longitude (°)</span><input type="number" step="0.001" value={oLon} onChange={e=>setOLon(+e.target.value)} /></Field>
      <Field><span className="l">Observer height (m)</span><input type="number" value={oH} onChange={e=>setOH(+e.target.value)} /></Field>
      <Field><span className="l">Array height (m)</span><input type="number" value={aH} onChange={e=>setAH(+e.target.value)} /></Field>
      <Field><span className="l">Observer type</span>
        <select value={obs} onChange={e=>setObs(e.target.value as any)}>
          <option value="atc-tower">ATC tower</option>
          <option value="aircraft-on-approach">Aircraft on approach</option>
          <option value="road">Road</option>
          <option value="residential">Residential</option>
        </select></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => engApproval.faaGlare({
        arrayLatDeg: aLat, arrayLonDeg: aLon, arrayTiltDeg: tilt, arrayAzimuthDeg: az,
        observerLatDeg: oLat, observerLonDeg: oLon, observerHeightM: oH, arrayHeightM: aH,
        observerType: obs,
      }))}>{r.loading ? 'Computing…' : 'Run glare analysis'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const SignOffRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const [proj, setProj] = useState('PROJ-001');
  const [name, setName] = useState('Solar PV Installation');
  const [client, setClient] = useState('Client TBC');
  const [kw, setKw] = useState(ctx.metrics?.systemSizeKw || 5);
  const [jur, setJur] = useState('KE');
  const [eng, setEng] = useState('TBC');
  const [lic, setLic] = useState('EPRA Class A1 — TBC');
  const [evidence, setEvidence] = useState<Record<string, boolean>>({
    iec62446CommissioningReport: true,
    singleLineDiagramSvg: true,
    cableAmpacityDerated: true,
    gridCodePack: true,
    memberStructural: true,
    lightningRiskFull: true,
    earthElectrodeBS7430: true,
  });
  const toggle = (k: string) => setEvidence({ ...evidence, [k]: !evidence[k] });
  return (
    <>
      <Hint>Audits the submitted evidence pack against per-jurisdiction sign-off requirements and emits a SHA-256 tamper-evident manifest hash. Verdict: READY FOR PE STAMP, or list of mandatory blockers.</Hint>
      <Field><span className="l">Project ID</span><input value={proj} onChange={e=>setProj(e.target.value)} /></Field>
      <Field><span className="l">Project name</span><input value={name} onChange={e=>setName(e.target.value)} /></Field>
      <Field><span className="l">Client name</span><input value={client} onChange={e=>setClient(e.target.value)} /></Field>
      <Field><span className="l">System DC kWp</span><input type="number" value={kw} onChange={e=>setKw(+e.target.value)} /></Field>
      <Field><span className="l">Jurisdiction</span><input value={jur} onChange={e=>setJur(e.target.value)} /></Field>
      <Field><span className="l">Engineer name</span><input value={eng} onChange={e=>setEng(e.target.value)} /></Field>
      <Field><span className="l">Engineer licence</span><input value={lic} onChange={e=>setLic(e.target.value)} /></Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, padding: 8, background: '#f6f6f6', borderRadius: 6 }}>
        <strong style={{ gridColumn: '1 / -1', fontSize: 12 }}>Submitted evidence:</strong>
        {[
          ['iec62446CommissioningReport','IEC 62446-1 Report'],
          ['singleLineDiagramSvg','Single-Line Diagram'],
          ['cableAmpacityDerated','Cable Derating'],
          ['arcRsCompliance','Arc-Fault & RSD'],
          ['nfpa855BatteryFireSafety','NFPA 855 Battery'],
          ['faaGlareAnalysis','FAA Glare'],
          ['gridCodePack','Grid-Code Pack'],
          ['p50p90Yield','P50/P90 Yield'],
          ['memberStructural','Structural'],
          ['lightningRiskFull','Lightning'],
          ['earthElectrodeBS7430','Earth Electrode'],
        ].map(([k, label]) => (
          <label key={k} style={{ fontSize: 11, cursor: 'pointer' }}>
            <input type="checkbox" checked={!!evidence[k]} onChange={() => toggle(k)} /> {label}
          </label>
        ))}
      </div>
      <Run disabled={r.loading} onClick={() => r.run(() => engApproval.signOffPackage({
        projectId: proj, projectName: name, clientName: client,
        systemKwDc: kw, jurisdiction: jur, engineerName: eng, engineerLicence: lic,
        evidenceManifest: evidence,
      }))}>{r.loading ? 'Auditing…' : 'Audit & generate manifest'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

// =====================================================================
// ARCHITECTURE-APPROVAL — 9 runners (Tier-7: Architect / Building Surveyor)
// =====================================================================
const WindUpliftRunner: React.FC = () => {
  const r = useRunner();
  const [v, setV] = useState(50);
  const [exp, setExp] = useState<'B'|'C'|'D'>('C');
  const [h, setH] = useState(10);
  const [tilt, setTilt] = useState(10);
  const [zone, setZone] = useState<'field'|'edge'|'corner'>('field');
  const [parapet, setParapet] = useState(0);
  return (
    <>
      <Hint>ASCE 7-22 §29.4.4 design uplift pressure on rooftop PV — velocity pressure qz × GCrn × edge/corner factor × parapet reduction; minimum 0.77 kPa.</Hint>
      <Field><span className="l">Basic wind speed V (m/s, 3-s gust)</span><input type="number" value={v} onChange={e=>setV(+e.target.value)} /></Field>
      <Field><span className="l">Exposure category</span>
        <select value={exp} onChange={e=>setExp(e.target.value as any)}>
          <option value="B">B — Suburban / wooded</option>
          <option value="C">C — Open terrain</option>
          <option value="D">D — Open water / unobstructed</option>
        </select></Field>
      <Field><span className="l">Building height (m)</span><input type="number" value={h} onChange={e=>setH(+e.target.value)} /></Field>
      <Field><span className="l">Panel tilt (°)</span><input type="number" value={tilt} onChange={e=>setTilt(+e.target.value)} /></Field>
      <Field><span className="l">Array zone on roof</span>
        <select value={zone} onChange={e=>setZone(e.target.value as any)}>
          <option value="field">Field (interior)</option>
          <option value="edge">Edge</option>
          <option value="corner">Corner</option>
        </select></Field>
      <Field><span className="l">Parapet height (m)</span><input type="number" step="0.05" value={parapet} onChange={e=>setParapet(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => archApproval.windUplift({
        basicWindSpeedMps: v, exposureCategory: exp, buildingHeightM: h,
        panelTiltDeg: tilt, arrayLocationOnRoof: zone, parapetHeightM: parapet,
      }))}>{r.loading ? 'Computing…' : 'Compute design uplift'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const SnowLoadRunner: React.FC = () => {
  const r = useRunner();
  const [pg, setPg] = useState(0.5);
  const [tilt, setTilt] = useState(10);
  const [code, setCode] = useState<'ASCE'|'Eurocode'>('ASCE');
  const [ce, setCe] = useState(1.0);
  const [ct, setCt] = useState(1.0);
  return (
    <>
      <Hint>Sloped-roof snow load on PV per ASCE 7-22 §7.4 OR EN 1991-1-3. Includes sliding-snow flag for slippery glass &gt; 15° tilt.</Hint>
      <Field><span className="l">Code</span>
        <select value={code} onChange={e=>setCode(e.target.value as any)}>
          <option value="ASCE">ASCE 7-22 (USA)</option>
          <option value="Eurocode">EN 1991-1-3 (Europe)</option>
        </select></Field>
      <Field><span className="l">Ground snow load (kN/m²)</span><input type="number" step="0.1" value={pg} onChange={e=>setPg(+e.target.value)} /></Field>
      <Field><span className="l">Panel tilt (°)</span><input type="number" value={tilt} onChange={e=>setTilt(+e.target.value)} /></Field>
      <Field><span className="l">Exposure factor Ce</span><input type="number" step="0.1" value={ce} onChange={e=>setCe(+e.target.value)} /></Field>
      <Field><span className="l">Thermal factor Ct</span><input type="number" step="0.1" value={ct} onChange={e=>setCt(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => archApproval.snowLoad({
        groundSnowLoadKnPerM2: pg, panelTiltDeg: tilt, exposureFactor: ce,
        thermalFactor: ct, code,
      }))}>{r.loading ? 'Computing…' : 'Compute design snow'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const BallastRunner: React.FC = () => {
  const r = useRunner();
  const [up, setUp] = useState(1.2);
  const [n, setN] = useState(20);
  const [block, setBlock] = useState(18);
  const [zone, setZone] = useState<'field'|'edge'|'corner'>('field');
  const [fric, setFric] = useState(0.6);
  return (
    <>
      <Hint>Non-penetrating ballast schedule per SEAOC PV2-2017. Resists net uplift (wind − self-weight) with safety factor 1.5; checks sliding via Coulomb friction.</Hint>
      <Field><span className="l">Design uplift (kN/m² = kPa)</span><input type="number" step="0.1" value={up} onChange={e=>setUp(+e.target.value)} /></Field>
      <Field><span className="l">Number of panels</span><input type="number" value={n} onChange={e=>setN(+e.target.value)} /></Field>
      <Field><span className="l">Concrete block mass (kg)</span><input type="number" value={block} onChange={e=>setBlock(+e.target.value)} /></Field>
      <Field><span className="l">Array zone</span>
        <select value={zone} onChange={e=>setZone(e.target.value as any)}>
          <option value="field">Field</option><option value="edge">Edge</option><option value="corner">Corner</option>
        </select></Field>
      <Field><span className="l">Friction coeff (membrane to ballast)</span><input type="number" step="0.05" value={fric} onChange={e=>setFric(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => archApproval.ballastSchedule({
        designUpliftKnPerM2: up, numberOfPanels: n, blockMassKg: block,
        arrayLocationOnRoof: zone, frictionCoeffRoofToBallast: fric,
      }))}>{r.loading ? 'Sizing…' : 'Generate ballast schedule'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const RoofReserveRunner: React.FC = () => {
  const r = useRunner();
  const [exDl, setExDl] = useState(0.5);
  const [allow, setAllow] = useState(0.75);
  const [pv, setPv] = useState(0.15);
  const [bal, setBal] = useState(0);
  const [age, setAge] = useState(20);
  const [cond, setCond] = useState<'good'|'fair'|'poor'>('good');
  return (
    <>
      <Hint>IBC §1604.4 added-load check: PV+ballast must fit within remaining structural reserve. Includes 5% rule exemption + age/condition derating.</Hint>
      <Field><span className="l">Existing roof DL (kPa)</span><input type="number" step="0.05" value={exDl} onChange={e=>setExDl(+e.target.value)} /></Field>
      <Field><span className="l">Original DL allowance (kPa)</span><input type="number" step="0.05" value={allow} onChange={e=>setAllow(+e.target.value)} /></Field>
      <Field><span className="l">PV+racking added DL (kPa)</span><input type="number" step="0.01" value={pv} onChange={e=>setPv(+e.target.value)} /></Field>
      <Field><span className="l">Ballast added DL (kPa)</span><input type="number" step="0.01" value={bal} onChange={e=>setBal(+e.target.value)} /></Field>
      <Field><span className="l">Building age (yr)</span><input type="number" value={age} onChange={e=>setAge(+e.target.value)} /></Field>
      <Field><span className="l">Condition rating</span>
        <select value={cond} onChange={e=>setCond(e.target.value as any)}>
          <option value="good">Good</option><option value="fair">Fair</option><option value="poor">Poor</option>
        </select></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => archApproval.roofReserve({
        existingRoofDeadLoadKpa: exDl, existingDesignDeadLoadAllowanceKpa: allow,
        newPvAddedDeadLoadKpa: pv, ballastAddedDeadLoadKpa: bal,
        buildingAgeYears: age, conditionRating: cond,
      }))}>{r.loading ? 'Checking…' : 'Check reserve capacity'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const FireSetbackRunner: React.FC = () => {
  const r = useRunner();
  const [type, setType] = useState<'pitched'|'flat'>('pitched');
  const [rL, setRL] = useState(12);
  const [rW, setRW] = useState(8);
  const [aL, setAL] = useState(8);
  const [aW, setAW] = useState(6);
  const [sub, setSub] = useState(1);
  return (
    <>
      <Hint>IFC §1204 / NFPA 1 §11.12 firefighter-access pathways — pitched ridge & eaves OR flat-roof perimeter & sub-array spacing.</Hint>
      <Field><span className="l">Roof type</span>
        <select value={type} onChange={e=>setType(e.target.value as any)}>
          <option value="pitched">Pitched</option><option value="flat">Flat</option>
        </select></Field>
      <Field><span className="l">Roof plan length (m)</span><input type="number" step="0.5" value={rL} onChange={e=>setRL(+e.target.value)} /></Field>
      <Field><span className="l">Roof plan width (m)</span><input type="number" step="0.5" value={rW} onChange={e=>setRW(+e.target.value)} /></Field>
      <Field><span className="l">Array plan length (m)</span><input type="number" step="0.5" value={aL} onChange={e=>setAL(+e.target.value)} /></Field>
      <Field><span className="l">Array plan width (m)</span><input type="number" step="0.5" value={aW} onChange={e=>setAW(+e.target.value)} /></Field>
      <Field><span className="l">Number of sub-arrays</span><input type="number" value={sub} onChange={e=>setSub(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => archApproval.fireSetback({
        roofType: type, roofPlanLengthM: rL, roofPlanWidthM: rW,
        arrayPlanLengthM: aL, arrayPlanWidthM: aW, numberOfPvSubarrays: sub,
      }))}>{r.loading ? 'Checking…' : 'Check fire pathways'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const FlashingRunner: React.FC = () => {
  const r = useRunner();
  const [cov, setCov] = useState<'asphalt-shingle'|'metal-standing-seam'|'clay-tile'|'concrete-tile'|'epdm'|'tpo'|'slate'>('asphalt-shingle');
  const [n, setN] = useState(16);
  const [flash, setFlash] = useState<'aluminium-stamped'|'EPDM-pipe-boot'|'lead'|'copper'|'sealant-only'>('aluminium-stamped');
  const [att, setAtt] = useState<'L-foot-lag'|'hanger-bolt'|'rail-bracket'>('L-foot-lag');
  return (
    <>
      <Hint>ICC-ES AC428 / FM 4474 flashing & penetration spec — roof-covering compatibility, galvanic check, Class A fire, BOM.</Hint>
      <Field><span className="l">Roof covering</span>
        <select value={cov} onChange={e=>setCov(e.target.value as any)}>
          <option value="asphalt-shingle">Asphalt shingle</option>
          <option value="metal-standing-seam">Metal standing seam</option>
          <option value="clay-tile">Clay tile</option>
          <option value="concrete-tile">Concrete tile</option>
          <option value="epdm">EPDM membrane</option>
          <option value="tpo">TPO membrane</option>
          <option value="slate">Slate</option>
        </select></Field>
      <Field><span className="l">Penetrations</span><input type="number" value={n} onChange={e=>setN(+e.target.value)} /></Field>
      <Field><span className="l">Flashing material</span>
        <select value={flash} onChange={e=>setFlash(e.target.value as any)}>
          <option value="aluminium-stamped">Aluminium stamped</option>
          <option value="EPDM-pipe-boot">EPDM pipe boot</option>
          <option value="lead">Lead</option>
          <option value="copper">Copper</option>
          <option value="sealant-only">Sealant only (NOT recommended)</option>
        </select></Field>
      <Field><span className="l">Attachment type</span>
        <select value={att} onChange={e=>setAtt(e.target.value as any)}>
          <option value="L-foot-lag">L-foot + lag bolt</option>
          <option value="hanger-bolt">Hanger bolt</option>
          <option value="rail-bracket">Rail bracket</option>
        </select></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => archApproval.flashing({
        roofCovering: cov, numberOfPenetrations: n, flashingMaterial: flash, attachmentType: att,
      }))}>{r.loading ? 'Specifying…' : 'Generate flashing spec'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const NeighbourShadowRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner();
  const [aLat, setALat] = useState(ctx.site?.latitude ?? -1.32);
  const [aLon, setALon] = useState(ctx.site?.longitude ?? 36.92);
  const [aH, setAH] = useState(6);
  const [aW, setAW] = useState(6);
  const [nLat, setNLat] = useState(-1.32);
  const [nLon, setNLon] = useState(36.921);
  const [winH, setWinH] = useState(1.5);
  return (
    <>
      <Hint>BRE 209 25° rule + EN 17037 daylight provision for neighbouring window. Returns GREEN/AMBER/RED right-to-light category.</Hint>
      <Field><span className="l">Array latitude (°)</span><input type="number" step="0.001" value={aLat} onChange={e=>setALat(+e.target.value)} /></Field>
      <Field><span className="l">Array longitude (°)</span><input type="number" step="0.001" value={aLon} onChange={e=>setALon(+e.target.value)} /></Field>
      <Field><span className="l">Array height above ground (m)</span><input type="number" value={aH} onChange={e=>setAH(+e.target.value)} /></Field>
      <Field><span className="l">Array width (m)</span><input type="number" value={aW} onChange={e=>setAW(+e.target.value)} /></Field>
      <Field><span className="l">Neighbour latitude (°)</span><input type="number" step="0.001" value={nLat} onChange={e=>setNLat(+e.target.value)} /></Field>
      <Field><span className="l">Neighbour longitude (°)</span><input type="number" step="0.001" value={nLon} onChange={e=>setNLon(+e.target.value)} /></Field>
      <Field><span className="l">Window centre height (m)</span><input type="number" step="0.1" value={winH} onChange={e=>setWinH(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => archApproval.neighbourShadow({
        arrayLatDeg: aLat, arrayLonDeg: aLon, arrayHeightAboveGroundM: aH, arrayWidthM: aW,
        neighbourLatDeg: nLat, neighbourLonDeg: nLon, neighbourWindowHeightAboveGroundM: winH,
      }))}>{r.loading ? 'Computing…' : 'Run shadow analysis'}</Run>
      <ResultBlock {...r} />
    </>
  );
};

const IfcExportRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner<any>();
  const [proj, setProj] = useState('PROJ-001');
  const [name, setName] = useState('Solar PV Installation');
  const [aL, setAL] = useState(10);
  const [aW, setAW] = useState(6);
  const [aH, setAH] = useState(0.15);
  return (
    <>
      <Hint>ISO 16739-1 IFC4 STEP file — for hand-off to architect's BIM model (Solibri, Navisworks, BIMcollab). Stub level: array envelope as IfcBuildingElementProxy.</Hint>
      <Field><span className="l">Project ID</span><input value={proj} onChange={e=>setProj(e.target.value)} /></Field>
      <Field><span className="l">Project name</span><input value={name} onChange={e=>setName(e.target.value)} /></Field>
      <Field><span className="l">Array length (m)</span><input type="number" step="0.5" value={aL} onChange={e=>setAL(+e.target.value)} /></Field>
      <Field><span className="l">Array width (m)</span><input type="number" step="0.5" value={aW} onChange={e=>setAW(+e.target.value)} /></Field>
      <Field><span className="l">Array height above roof (m)</span><input type="number" step="0.05" value={aH} onChange={e=>setAH(+e.target.value)} /></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => archApproval.ifcExport({
        projectId: proj, projectName: name, arrayPlanLengthM: aL,
        arrayPlanWidthM: aW, arrayHeightAboveRoofM: aH,
      }))}>{r.loading ? 'Generating…' : 'Generate IFC4 file'}</Run>
      {r.data?.ifcDataUri && (
        <div style={{ marginTop: 8, fontSize: 11 }}>
          <a href={r.data.ifcDataUri} download={`${proj}.ifc`}>Download .ifc</a>
        </div>
      )}
      <ResultBlock {...r} />
    </>
  );
};

const PlanningNarrativeRunner: React.FC<{ ctx: RunnerCtx }> = ({ ctx }) => {
  const r = useRunner<any>();
  const [proj, setProj] = useState('PROJ-001');
  const [addr, setAddr] = useState(ctx.site?.address || 'Site address TBC');
  const [area, setArea] = useState(30);
  const [proj_h, setProjH] = useState(0.15);
  const [her, setHer] = useState<'none'|'locally-listed'|'grade-II'|'grade-II-star'|'grade-I'|'within-conservation-area'>('none');
  const [vis, setVis] = useState(true);
  const [colour, setColour] = useState<'standard-blue'|'all-black'|'terracotta-red'|'green'>('all-black');
  const [pitch, setPitch] = useState(25);
  const [jur, setJur] = useState<'UK'|'KE'|'US'|'EU'|'other'>('UK');
  return (
    <>
      <Hint>Permitted Development assessment + heritage + visual impact + LDC narrative. UK GPDO 2015 Sch2 Pt14 + NPPF Dec 2023.</Hint>
      <Field><span className="l">Project ID</span><input value={proj} onChange={e=>setProj(e.target.value)} /></Field>
      <Field><span className="l">Site address</span><input value={addr} onChange={e=>setAddr(e.target.value)} /></Field>
      <Field><span className="l">Array area (m²)</span><input type="number" value={area} onChange={e=>setArea(+e.target.value)} /></Field>
      <Field><span className="l">Projection above roof (m)</span><input type="number" step="0.01" value={proj_h} onChange={e=>setProjH(+e.target.value)} /></Field>
      <Field><span className="l">Heritage status</span>
        <select value={her} onChange={e=>setHer(e.target.value as any)}>
          <option value="none">None</option>
          <option value="locally-listed">Locally listed</option>
          <option value="grade-II">Grade II listed</option>
          <option value="grade-II-star">Grade II* listed</option>
          <option value="grade-I">Grade I listed</option>
          <option value="within-conservation-area">Within conservation area</option>
        </select></Field>
      <Field><span className="l">Visible from public highway?</span>
        <select value={String(vis)} onChange={e=>setVis(e.target.value==='true')}><option value="true">Yes</option><option value="false">No</option></select>
      </Field>
      <Field><span className="l">Module colour</span>
        <select value={colour} onChange={e=>setColour(e.target.value as any)}>
          <option value="standard-blue">Standard blue</option>
          <option value="all-black">All-black</option>
          <option value="terracotta-red">Terracotta red</option>
          <option value="green">Green</option>
        </select></Field>
      <Field><span className="l">Roof pitch (°)</span><input type="number" value={pitch} onChange={e=>setPitch(+e.target.value)} /></Field>
      <Field><span className="l">Jurisdiction</span>
        <select value={jur} onChange={e=>setJur(e.target.value as any)}>
          <option value="UK">UK</option><option value="KE">KE</option>
          <option value="US">US</option><option value="EU">EU</option><option value="other">Other</option>
        </select></Field>
      <Run disabled={r.loading} onClick={() => r.run(() => archApproval.planningNarrative({
        projectId: proj, siteAddress: addr, arrayAreaM2: area,
        arrayHeightAboveExistingRoofM: proj_h, buildingHeritageStatus: her,
        visibleFromPublicHighway: vis, arrayColour: colour, roofPitchDeg: pitch, jurisdiction: jur,
      }))}>{r.loading ? 'Drafting…' : 'Generate planning narrative'}</Run>
      {r.data?.narrativeMarkdown && (
        <pre style={{ marginTop: 8, padding: 8, background: '#f6f6f6', borderRadius: 6, fontSize: 11, whiteSpace: 'pre-wrap', maxHeight: 360, overflow: 'auto' }}>{r.data.narrativeMarkdown}</pre>
      )}
      <ResultBlock {...r} />
    </>
  );
};

export default AdvancedFeaturesDashboard;
export { AdvancedFeaturesDashboard };
