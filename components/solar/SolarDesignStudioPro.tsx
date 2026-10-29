'use client';

/**
 * SOLAR DESIGN STUDIO — roof layout, sun-path shading, SLD and wire schedule
 *
 * Features:
 * 1. Interactive Roof Editor - Draw roof, place panels drag-drop
 * 2. Sun angle - sun slider showing low-sun loss on the panels (no obstacles are modelled)
 * 3. Auto SLD Generator - Professional electrical diagrams
 * 4. Complete System Calculator - Strings, wires, batteries
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sun, Zap, Battery, Calculator, FileText, Play, Pause, Trash2, Plus, Grid, Layers, Cable,
  AlertTriangle, CheckCircle2, Settings, Box, MapPin, Printer, Share2, Activity
} from 'lucide-react';
import { estimateInstalledCost, DEFAULT_TARIFF_KES_PER_KWH } from '@/lib/solar/sizing';

// Roof drawing scale and module size (metres). See the panel size state below.
const PX_PER_M = 20;
const PANEL_W_M = 1.134;
const PANEL_H_M = 2.278;
const EDGE_SETBACK_M = 0.3;

// =============================================================================
// TYPES
// =============================================================================

interface Point { x: number; y: number; }
interface Panel { id: string; x: number; y: number; width: number; height: number; watts: number; shaded: number; }
interface RoofSegment { id: string; points: Point[]; area: number; azimuth: number; tilt: number; }
interface SunPosition { altitude: number; azimuth: number; hour: number; }

// =============================================================================
// SUN POSITION CALCULATOR (SunCalc Algorithm)
// =============================================================================

function calculateSunPosition(lat: number, lng: number, date: Date): SunPosition {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const hour = date.getHours() + date.getMinutes() / 60;

  // Solar declination
  const declination = 23.45 * Math.sin((360 / 365) * (dayOfYear - 81) * Math.PI / 180);

  // Hour angle
  const solarNoon = 12 - lng / 15;
  const hourAngle = 15 * (hour - solarNoon);

  // Solar altitude
  const latRad = lat * Math.PI / 180;
  const decRad = declination * Math.PI / 180;
  const hourRad = hourAngle * Math.PI / 180;

  const altitude = Math.asin(
    Math.sin(latRad) * Math.sin(decRad) +
    Math.cos(latRad) * Math.cos(decRad) * Math.cos(hourRad)
  ) * 180 / Math.PI;

  // Solar azimuth
  const azimuth = Math.atan2(
    Math.sin(hourRad),
    Math.cos(hourRad) * Math.sin(latRad) - Math.tan(decRad) * Math.cos(latRad)
  ) * 180 / Math.PI + 180;

  return { altitude: Math.max(0, altitude), azimuth, hour };
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function SolarDesignStudioPro() {
  // Mode
  const [activeTab, setActiveTab] = useState<'design' | 'shading' | 'electrical' | 'report'>('design');

  // Location
  const [latitude, setLatitude] = useState(-1.2921); // Nairobi default
  const [longitude, setLongitude] = useState(36.8219);
  const [location, setLocation] = useState('Nairobi, Kenya');

  // Roof
  const [roofSegments, setRoofSegments] = useState<RoofSegment[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [roofTilt, setRoofTilt] = useState(15);
  const [roofAzimuth, setRoofAzimuth] = useState(0);

  // Panels
  const [panels, setPanels] = useState<Panel[]>([]);
  const [selectedPanel, setSelectedPanel] = useState<string | null>(null);
  const [panelWatts, setPanelWatts] = useState(550);
  // One scale for the roof and the panels: PX_PER_M pixels = 1 m, so each
  // 20 px grid square is 1 m. A 550 W module is about 2.28 × 1.13 m. (Before
  // the 2026-10-27 audit the roof was 10 px/m but panels were 40 × 60 px,
  // i.e. 4 × 6 m each.)
  const [panelWidth, setPanelWidth] = useState(Math.round(PANEL_W_M * PX_PER_M));
  const [panelHeight, setPanelHeight] = useState(Math.round(PANEL_H_M * PX_PER_M));

  // Sun & Shading
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentHour, setCurrentHour] = useState(12);
  const [isAnimating, setIsAnimating] = useState(false);
  const [sunPosition, setSunPosition] = useState<SunPosition>({ altitude: 45, azimuth: 180, hour: 12 });

  // System
  const [inverterSize, setInverterSize] = useState(5);
  const [batteryCapacity, setBatteryCapacity] = useState(10);
  const [stringConfig, setStringConfig] = useState({ series: 2, parallel: 2 });

  // NASA POWER sun-hours for the chosen point (via /api/site/pvwatts, kw=1).
  const [sunHours, setSunHours] = useState(5.5);
  const [sunSource, setSunSource] = useState('Kenya typical value (NASA loading…)');
  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(() => {
      fetch(`/api/site/pvwatts?lat=${latitude}&lon=${longitude}&kw=1`)
        .then((r) => r.json())
        .then((j) => {
          if (cancelled) return;
          if (j?.success && j.data?.solradAnnualKwhM2) {
            setSunHours(j.data.solradAnnualKwhM2);
            setSunSource(`NASA POWER long-term average for ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
          } else {
            setSunHours(5.5);
            setSunSource('Kenya typical value (NASA unavailable)');
          }
        })
        .catch(() => { if (!cancelled) { setSunHours(5.5); setSunSource('Kenya typical value (NASA unavailable)'); } });
    }, 600);
    return () => { cancelled = true; clearTimeout(t); };
  }, [latitude, longitude]);

  // Canvas refs
  const roofCanvasRef = useRef<HTMLCanvasElement>(null);
  const shadingCanvasRef = useRef<HTMLCanvasElement>(null);

  // ==========================================================================
  // CALCULATIONS
  // ==========================================================================

  const totalPanels = panels.length;
  const totalWatts = panels.reduce((sum, p) => sum + p.watts, 0);
  const totalKW = totalWatts / 1000;
  const avgShading = panels.length > 0
    ? panels.reduce((sum, p) => sum + p.shaded, 0) / panels.length
    : 0;
  // The performance ratio below already covers heat, dust, wiring and
  // low-sun losses. The sun-angle view is for one moment of one day, so it
  // must not scale the annual figure (2026-10-25 audit: moving the time
  // slider changed the yearly production).
  const effectiveKW = totalKW;
  // Production = kWp × NASA POWER sun-hours for this location × 78%
  // performance ratio (2026-10-18 tool audit: was kWp × a flat 5.5 with no
  // losses at all, ~28% high). Falls back to 5.5 until NASA answers.
  const PERFORMANCE_RATIO = 0.78;
  const dailyProduction = effectiveKW * sunHours * PERFORMANCE_RATIO;
  const monthlyProduction = dailyProduction * 30;
  const annualProduction = dailyProduction * 365;
  const installedCost = estimateInstalledCost(totalKW, inverterSize, batteryCapacity, batteryCapacity > 0 ? 'hybrid' : 'grid-tied');
  const TARIFF_KES = DEFAULT_TARIFF_KES_PER_KWH;
  // The calculator's use rule: about 90% of the solar used on site with a
  // battery, about 75% without (2026-10-29 audit: 100% of production was valued).
  const usedShare = batteryCapacity > 0 ? 0.9 : 0.75;
  const annualSavingKes = annualProduction * usedShare * TARIFF_KES;

  // Wire sizing from typical module data: modern 400 W+ half-cell modules
  // run ~41.5 V Vmp / ~49.5 V Voc; smaller 60/72-cell ~34 / ~41 V.
  const panelVmp = panelWatts >= 400 ? 41.5 : 34;
  const panelVoc = panelWatts >= 400 ? 49.5 : 41;
  const panelIsc = (panelWatts / panelVmp) * 1.06;
  const stringVoc = stringConfig.series * panelVoc;
  const stringDesignA = 1.25 * panelIsc;               // per string (IEC 62548)
  const arrayDesignA = stringDesignA * Math.max(1, stringConfig.parallel);
  const systemCurrent = panelIsc * Math.max(1, stringConfig.parallel);
  const pickCsa = (amps: number, table: [number, string][]) => (table.find(([a]) => amps <= a) ?? table[table.length - 1])[1];
  // PV1-F on a hot roof (derated): 4 mm² to ~22 A, 6 mm² to ~28 A, 10 mm² to ~39 A.
  const wireSize = pickCsa(stringDesignA, [[22, '4mm²'], [28, '6mm²'], [39, '10mm²'], [52, '16mm²']]);
  const combinerWire = pickCsa(arrayDesignA, [[22, '4mm²'], [28, '6mm²'], [39, '10mm²'], [52, '16mm²'], [69, '25mm²'], [86, '35mm²']]);
  // 48 V battery: inverter kW at ~90% efficiency; short run, copper.
  const batteryAmps = (inverterSize * 1000) / (48 * 0.9);
  const batteryWire = pickCsa(batteryAmps, [[70, '16mm²'], [100, '25mm²'], [125, '35mm²'], [160, '50mm²'], [200, '70mm²'], [245, '95mm²'], [285, '120mm²'], [330, '150mm²']]);
  // AC: single phase to 10 kW, three phase above.
  const threePhase = inverterSize > 10;
  const acAmps = threePhase ? (inverterSize * 1000) / (Math.sqrt(3) * 400) : (inverterSize * 1000) / 230;
  // Breaker at 1.25 x the inverter's AC current, then a cable whose rating is
  // at least the breaker's, so the breaker protects the cable (IEC 60364-4-43).
  // Ratings: IEC 60364-5-52 Table B.52.4, method B1 (PVC in conduit), copper.
  // 2026-10-27 audit: the diagram always printed "63A MCB + 6 mm²" (6 mm² is
  // about 41 A, so a 63 A breaker did not protect it) for 3 kW to 15 kW.
  const STD_MCB = [6, 10, 13, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160];
  const acBreakerA = STD_MCB.find((s) => s >= acAmps * 1.25) ?? 160;
  const CABLE_B1: [number, number][] = threePhase
    ? [[4, 28], [6, 36], [10, 50], [16, 68], [25, 89], [35, 110], [50, 134], [70, 171], [95, 207]]
    : [[4, 32], [6, 41], [10, 57], [16, 76], [25, 101], [35, 125], [50, 151], [70, 192], [95, 232]];
  const acCsa = (CABLE_B1.find(([, iz]) => iz >= acBreakerA) ?? CABLE_B1[CABLE_B1.length - 1])[0];
  const acWire = `${acCsa}mm²`;
  const acBreakerLabel = `${acBreakerA}A ${threePhase ? '4-pole (3P+N)' : 'double-pole'} MCB`;
  // Protective earth (IEC 60364-5-54): as the phase up to 16 mm², 16 mm² to 35, half above.
  const earthCsa = acCsa <= 16 ? acCsa : acCsa <= 35 ? 16 : acCsa / 2;
  const dcAcRatio = inverterSize > 0 ? totalKW / inverterSize : 0;

  // MPPT window: typical for this inverter class (check the datasheet). Hot
  // Vmp (70 °C module, -0.40 %/°C) must stay above the minimum; cold Voc
  // (10 °C, -0.27 %/°C) below the maximum DC input.
  const mppt = inverterSize > 10 ? { min: 200, max: 850, maxDc: 1000 } : { min: 125, max: 425, maxDc: 500 };
  const stringVmpHot = stringConfig.series * panelVmp * (1 - 0.004 * 45);
  const stringVmpCold = stringConfig.series * panelVmp * (1 + 0.004 * 15);
  const stringVocCold = stringConfig.series * panelVoc * (1 + 0.0027 * 15);
  const mpptProblems: string[] = [];
  if (stringVmpHot < mppt.min) mpptProblems.push(`Hot string voltage (${stringVmpHot.toFixed(0)} V) is below the typical MPPT minimum of ${mppt.min} V: add panels in series.`);
  if (stringVocCold > mppt.maxDc) mpptProblems.push(`Cold open-circuit voltage (${stringVocCold.toFixed(0)} V) exceeds the typical ${mppt.maxDc} V maximum DC input: fewer panels in series.`);
  else if (stringVmpCold > mppt.max) mpptProblems.push(`Cold string voltage (${stringVmpCold.toFixed(0)} V) is above the typical MPPT maximum of ${mppt.max} V.`);
  const plannedPanels = stringConfig.series * stringConfig.parallel;

  // ==========================================================================
  // SUN POSITION UPDATE
  // ==========================================================================

  useEffect(() => {
    const date = new Date(currentDate);
    date.setHours(Math.floor(currentHour));
    date.setMinutes((currentHour % 1) * 60);
    const pos = calculateSunPosition(latitude, longitude, date);
    setSunPosition(pos);

    // Update panel shading based on sun position
    if (panels.length > 0) {
      const updatedPanels = panels.map(panel => {
        // Simple shading calculation based on sun altitude
        let shaded = 0;
        if (pos.altitude < 10) shaded = 80;
        else if (pos.altitude < 20) shaded = 40;
        else if (pos.altitude < 30) shaded = 20;
        else if (pos.altitude < 45) shaded = 10;
        else shaded = 5;

        // Adjust for azimuth mismatch
        const azimuthDiff = Math.abs(pos.azimuth - roofAzimuth);
        if (azimuthDiff > 90) shaded += 15;

        return { ...panel, shaded };
      });
      setPanels(updatedPanels);
    }
  }, [currentHour, currentDate, latitude, longitude, roofAzimuth]);

  // Animation
  useEffect(() => {
    if (!isAnimating) return;
    const interval = setInterval(() => {
      setCurrentHour(h => {
        if (h >= 18) return 6;
        return h + 0.1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isAnimating]);

  // ==========================================================================
  // ROOF DRAWING
  // ==========================================================================

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = roofCanvasRef.current;
    if (!canvas) return;

    // The canvas is drawn at 900 × 500 but shown at the page width: map the
    // click into canvas pixels so points land where they were clicked.
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    setCurrentPoints(prev => [...prev, { x, y }]);
  }, [isDrawing]);

  const finishRoof = useCallback(() => {
    if (currentPoints.length < 3) return;

    // Calculate area using shoelace formula
    let area = 0;
    for (let i = 0; i < currentPoints.length; i++) {
      const j = (i + 1) % currentPoints.length;
      area += currentPoints[i].x * currentPoints[j].y;
      area -= currentPoints[j].x * currentPoints[i].y;
    }
    area = Math.abs(area) / 2;

    const newSegment: RoofSegment = {
      id: `roof-${Date.now()}`,
      points: currentPoints,
      area: area / (PX_PER_M * PX_PER_M), // px² to m²
      azimuth: roofAzimuth,
      tilt: roofTilt
    };

    setRoofSegments(prev => [...prev, newSegment]);
    setCurrentPoints([]);
    setIsDrawing(false);
  }, [currentPoints, roofAzimuth, roofTilt]);

  // ==========================================================================
  // PANEL PLACEMENT
  // ==========================================================================

  const addPanel = useCallback((x: number, y: number) => {
    const newPanel: Panel = {
      id: `panel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x, y,
      width: panelWidth,
      height: panelHeight,
      watts: panelWatts,
      shaded: 10
    };
    setPanels(prev => [...prev, newPanel]);
  }, [panelWatts, panelWidth, panelHeight]);

  const removePanel = useCallback((id: string) => {
    setPanels(prev => prev.filter(p => p.id !== id));
    if (selectedPanel === id) setSelectedPanel(null);
  }, [selectedPanel]);

  const autoPlacePanels = useCallback(() => {
    if (roofSegments.length === 0) return;

    const segment = roofSegments[0];
    const bounds = {
      minX: Math.min(...segment.points.map(p => p.x)),
      maxX: Math.max(...segment.points.map(p => p.x)),
      minY: Math.min(...segment.points.map(p => p.y)),
      maxY: Math.max(...segment.points.map(p => p.y))
    };

    const newPanels: Panel[] = [];
    const spacing = Math.max(1, Math.round(0.05 * PX_PER_M)); // ~5 cm between modules
    const setback = Math.round(EDGE_SETBACK_M * PX_PER_M);    // clear strip at the roof edge

    for (let y = bounds.minY + setback; y + panelHeight <= bounds.maxY - setback; y += panelHeight + spacing) {
      for (let x = bounds.minX + setback; x + panelWidth <= bounds.maxX - setback; x += panelWidth + spacing) {
        // The whole module, with the edge setback, must be on the roof: its
        // corners and edge midpoints are checked, not only its centre (which
        // let panels overhang the edge).
        const x0 = x - setback, x1 = x + panelWidth + setback, y0 = y - setback, y1 = y + panelHeight + setback;
        const xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
        const probes = [{ x: x0, y: y0 }, { x: x1, y: y0 }, { x: x0, y: y1 }, { x: x1, y: y1 }, { x: xm, y: y0 }, { x: xm, y: y1 }, { x: x0, y: ym }, { x: x1, y: ym }];
        if (probes.every((p) => isPointInPolygon(p, segment.points))) {
          newPanels.push({
            id: `panel-${Date.now()}-${newPanels.length}`,
            x, y,
            width: panelWidth,
            height: panelHeight,
            watts: panelWatts,
            shaded: 10
          });
        }
      }
    }

    setPanels(newPanels);
    // A string plan for the panels placed, inside the same MPPT window and
    // temperature factors as the check below (2026-10-29 audit: the plan
    // stayed 2S x 2P after Auto-Fill placed 14 panels).
    const n = newPanels.length;
    if (n > 0) {
      const w = inverterSize > 10 ? { min: 200, max: 850, maxDc: 1000 } : { min: 125, max: 425, maxDc: 500 };
      const okS = (s: number) => s * panelVmp * (1 - 0.004 * 45) >= w.min && s * panelVoc * (1 + 0.0027 * 15) <= w.maxDc && s * panelVmp * (1 + 0.004 * 15) <= w.max;
      let best: { s: number; p: number; left: number } | null = null;
      for (let s = 1; s <= n; s++) {
        if (!okS(s)) continue;
        const p = Math.floor(n / s);
        const left = n - s * p;
        if (!best || left < best.left || (left === best.left && s > best.s)) best = { s, p, left };
      }
      if (best) setStringConfig({ series: best.s, parallel: best.p });
    }
  }, [roofSegments, panelWatts, panelWidth, panelHeight, inverterSize, panelVmp, panelVoc]);

  // Point in polygon check
  function isPointInPolygon(point: Point, polygon: Point[]): boolean {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y;
      const xj = polygon[j].x, yj = polygon[j].y;
      if (((yi > point.y) !== (yj > point.y)) && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }
    return inside;
  }

  // ==========================================================================
  // CANVAS RENDERING
  // ==========================================================================

  useEffect(() => {
    const canvas = roofCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = '#2d2d44';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw roof segments
    roofSegments.forEach(segment => {
      ctx.beginPath();
      ctx.moveTo(segment.points[0].x, segment.points[0].y);
      segment.points.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.closePath();
      ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.fill();
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw current drawing
    if (currentPoints.length > 0) {
      ctx.beginPath();
      ctx.moveTo(currentPoints[0].x, currentPoints[0].y);
      currentPoints.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.stroke();

      currentPoints.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#fbbf24';
        ctx.fill();
      });
    }

    // Draw sun direction indicator
    const sunX = canvas.width / 2 + Math.cos((sunPosition.azimuth - 90) * Math.PI / 180) * 100;
    const sunY = 50;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 20, 0, Math.PI * 2);
    const sunGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 20);
    sunGrad.addColorStop(0, '#fbbf24');
    sunGrad.addColorStop(1, '#f59e0b');
    ctx.fillStyle = sunGrad;
    ctx.fill();

    // Draw panels with shading
    panels.forEach(panel => {
      const isSelected = panel.id === selectedPanel;

      // Shadow
      if (sunPosition.altitude > 0) {
        const shadowLength = (90 - sunPosition.altitude) / 3;
        const shadowX = Math.cos((sunPosition.azimuth - 90) * Math.PI / 180) * shadowLength;
        const shadowY = Math.sin((sunPosition.azimuth - 90) * Math.PI / 180) * shadowLength;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(panel.x + shadowX, panel.y + shadowY, panel.width, panel.height);
      }

      // Panel
      ctx.fillStyle = isSelected ? '#10b981' : `rgba(30, 58, 138, ${1 - panel.shaded/200})`;
      ctx.fillRect(panel.x, panel.y, panel.width, panel.height);

      // Panel grid lines
      ctx.strokeStyle = isSelected ? '#34d399' : '#60a5fa';
      ctx.lineWidth = 1;
      ctx.strokeRect(panel.x, panel.y, panel.width, panel.height);

      // Cell lines
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      for (let i = 1; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(panel.x, panel.y + (panel.height/6) * i);
        ctx.lineTo(panel.x + panel.width, panel.y + (panel.height/6) * i);
        ctx.stroke();
      }
      for (let i = 1; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(panel.x + (panel.width/4) * i, panel.y);
        ctx.lineTo(panel.x + (panel.width/4) * i, panel.y + panel.height);
        ctx.stroke();
      }

      // Shading indicator
      if (panel.shaded > 20) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.5)';
        ctx.fillRect(panel.x, panel.y, panel.width, panel.height * (panel.shaded / 100));
      }

      // Watts label
      ctx.fillStyle = '#fff';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${panel.watts}W`, panel.x + panel.width/2, panel.y + panel.height/2 + 4);
    });

  }, [roofSegments, currentPoints, panels, selectedPanel, sunPosition]);

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur border-b border-slate-700 px-3 sm:px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 shrink-0 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Sun className="w-7 h-7 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-bold text-white" role="heading" aria-level={2}>Solar Design Studio</p>
              <p className="text-slate-400 text-sm">Roof layout, sun angle and wiring</p>
            </div>
          </div>

          {/* Save / Load / "Export PDF" had no handlers and did nothing
              (2026-10-18 tool audit). Print works in every browser and gives
              a PDF via "Save as PDF"; sending the design to an engineer is the
              real next step. */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center gap-2"
            >
              <Printer className="w-4 h-4" /> Print / PDF
            </button>
            <a
              href={`https://wa.me/254768860665?text=${encodeURIComponent(`Hi EmersonEIMS, please check my solar layout: ${totalPanels} panels, ${totalKW.toFixed(2)} kW at ${location} (${latitude.toFixed(3)}, ${longitude.toFixed(3)}).`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" /> Send to an engineer
            </a>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mt-4">
          {[
            { id: 'design', label: 'Roof Design', icon: Layers },
            { id: 'shading', label: 'Sun Angle', icon: Sun },
            { id: 'electrical', label: 'Electrical (SLD)', icon: Zap },
            { id: 'report', label: 'Report', icon: FileText }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Left Sidebar - Tools (stacks above the canvas on phones) */}
        <aside className="w-full lg:w-64 shrink-0 bg-slate-800/50 border-b lg:border-b-0 lg:border-r border-slate-700 p-4 lg:min-h-[calc(100vh-140px)]">
          {/* Location */}
          <div className="mb-6">
            <label className="text-slate-400 text-sm mb-2 block">Location</label>
            <div className="flex items-center gap-2 bg-slate-700/50 rounded-lg px-3 py-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent text-white text-sm flex-1 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <input
                type="number"
                aria-label="Latitude"
                value={latitude}
                onChange={(e) => setLatitude(parseFloat(e.target.value))}
                className="bg-slate-700/50 text-white text-sm rounded px-2 py-1"
                placeholder="Lat"
                step="0.0001"
              />
              <input
                type="number"
                aria-label="Longitude"
                value={longitude}
                onChange={(e) => setLongitude(parseFloat(e.target.value))}
                className="bg-slate-700/50 text-white text-sm rounded px-2 py-1"
                placeholder="Lng"
                step="0.0001"
              />
            </div>
          </div>

          {activeTab === 'design' && (
            <>
              {/* Roof Tools */}
              <div className="mb-6">
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-400" /> Roof Tools
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setIsDrawing(!isDrawing)}
                    className={`w-full px-3 py-2 rounded-lg flex items-center gap-2 ${
                      isDrawing ? 'bg-amber-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    <Grid className="w-4 h-4" /> {isDrawing ? 'Drawing...' : 'Draw Roof'}
                  </button>
                  {isDrawing && currentPoints.length >= 3 && (
                    <button
                      onClick={finishRoof}
                      className="w-full px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Complete Roof
                    </button>
                  )}
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <label className="text-slate-500 text-xs">Tilt (°)</label>
                      <input
                        type="number"
                        value={roofTilt}
                        onChange={(e) => setRoofTilt(parseInt(e.target.value))}
                        className="w-full bg-slate-700 text-white text-sm rounded px-2 py-1"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 text-xs">Azimuth (°)</label>
                      <input
                        type="number"
                        value={roofAzimuth}
                        onChange={(e) => setRoofAzimuth(parseInt(e.target.value))}
                        className="w-full bg-slate-700 text-white text-sm rounded px-2 py-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Panel Tools */}
              <div className="mb-6">
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Box className="w-4 h-4 text-emerald-400" /> Panel Placement
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => addPanel(100 + Math.random() * 200, 100 + Math.random() * 200)}
                    className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Panel
                  </button>
                  <button
                    onClick={autoPlacePanels}
                    disabled={roofSegments.length === 0}
                    className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-600 text-white rounded-lg flex items-center gap-2"
                  >
                    <Grid className="w-4 h-4" /> Auto-Fill Roof
                  </button>
                  <button
                    onClick={() => setPanels([])}
                    className="w-full px-3 py-2 bg-red-600/50 hover:bg-red-600 text-white rounded-lg flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Clear Panels
                  </button>

                  <div className="mt-3">
                    <label className="text-slate-500 text-xs">Panel Watts</label>
                    <select
                      value={panelWatts}
                      onChange={(e) => setPanelWatts(parseInt(e.target.value))}
                      className="w-full bg-slate-700 text-white text-sm rounded px-2 py-1 mt-1"
                    >
                      <option value={450}>450W Standard</option>
                      <option value={550}>550W Premium</option>
                      <option value={650}>650W Commercial</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'shading' && (
            <>
              {/* Sun Controls */}
              <div className="mb-6">
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-400" /> Sun Position
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Time of Day</span>
                      <span className="text-amber-400">{Math.floor(currentHour)}:{String(Math.floor((currentHour % 1) * 60)).padStart(2, '0')}</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="19"
                      step="0.1"
                      value={currentHour}
                      onChange={(e) => setCurrentHour(parseFloat(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>5 AM</span>
                      <span>12 PM</span>
                      <span>7 PM</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsAnimating(!isAnimating)}
                    className={`w-full px-3 py-2 rounded-lg flex items-center justify-center gap-2 ${
                      isAnimating ? 'bg-red-600 text-white' : 'bg-amber-500 text-white'
                    }`}
                  >
                    {isAnimating ? <><Pause className="w-4 h-4" /> Stop Animation</> : <><Play className="w-4 h-4" /> Animate Sun</>}
                  </button>

                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-slate-500">Altitude</span>
                        <p className="text-amber-400 font-medium">{sunPosition.altitude.toFixed(1)}°</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Azimuth</span>
                        <p className="text-amber-400 font-medium">{sunPosition.azimuth.toFixed(1)}°</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-500 text-xs">Date</label>
                    <input
                      type="date"
                      value={currentDate.toISOString().split('T')[0]}
                      onChange={(e) => setCurrentDate(new Date(e.target.value))}
                      className="w-full bg-slate-700 text-white text-sm rounded px-2 py-1 mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Shading Results */}
              <div className="bg-slate-700/50 rounded-lg p-3">
                <h4 className="text-white font-medium mb-2">Shading Analysis</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Avg Shading</span>
                    <span className={avgShading > 20 ? 'text-red-400' : 'text-emerald-400'}>{avgShading.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Effective Output</span>
                    <span className="text-emerald-400">{effectiveKW.toFixed(2)} kW</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'electrical' && (
            <>
              {/* String Configuration */}
              <div className="mb-6">
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Cable className="w-4 h-4 text-cyan-400" /> String Config
                </h3>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="studio-series" className="text-slate-500 text-xs">Panels in Series</label>
                    <input
                      id="studio-series"
                      type="number"
                      value={stringConfig.series}
                      onChange={(e) => setStringConfig(s => ({ ...s, series: parseInt(e.target.value) || 1 }))}
                      className="w-full bg-slate-700 text-white rounded px-2 py-1 mt-1"
                      min="1"
                    />
                  </div>
                  <div>
                    <label htmlFor="studio-parallel" className="text-slate-500 text-xs">Strings in Parallel</label>
                    <input
                      id="studio-parallel"
                      type="number"
                      value={stringConfig.parallel}
                      onChange={(e) => setStringConfig(s => ({ ...s, parallel: parseInt(e.target.value) || 1 }))}
                      className="w-full bg-slate-700 text-white rounded px-2 py-1 mt-1"
                      min="1"
                    />
                  </div>
                  {plannedPanels !== totalPanels && (
                    <p className="text-amber-400 text-xs" role="status">
                      The string plan ({stringConfig.series} × {stringConfig.parallel} = {plannedPanels} panels) does not match the {totalPanels} panels placed on the roof.
                    </p>
                  )}
                  <div className={`text-xs rounded p-2 ${mpptProblems.length ? 'bg-amber-500/10 text-amber-300' : 'bg-green-500/10 text-green-300'}`} role="status">
                    <p>String: {stringVmpHot.toFixed(0)}–{stringVmpCold.toFixed(0)} V working, {stringVocCold.toFixed(0)} V open-circuit when cold.</p>
                    {mpptProblems.length
                      ? mpptProblems.map((m) => <p key={m}>{m}</p>)
                      : <p>Inside the typical {mppt.min}–{mppt.max} V MPPT window for a {inverterSize} kW unit.</p>}
                    <p className="text-slate-500 mt-1">Typical window only: check your inverter&apos;s datasheet.</p>
                  </div>
                </div>
              </div>

              {/* Inverter */}
              <div className="mb-6">
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" /> Inverter
                </h3>
                <select
                  value={inverterSize}
                  onChange={(e) => setInverterSize(parseInt(e.target.value))}
                  className="w-full bg-slate-700 text-white rounded px-2 py-1"
                >
                  <option value={3}>3kW Hybrid</option>
                  <option value={5}>5kW Hybrid</option>
                  <option value={8}>8kW Hybrid</option>
                  <option value={10}>10kW Hybrid</option>
                  <option value={15}>15kW Commercial</option>
                </select>
              </div>

              {/* Battery */}
              <div className="mb-6">
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Battery className="w-4 h-4 text-green-400" /> Battery
                </h3>
                <select
                  value={batteryCapacity}
                  onChange={(e) => setBatteryCapacity(parseInt(e.target.value))}
                  className="w-full bg-slate-700 text-white rounded px-2 py-1"
                >
                  <option value={5}>5kWh (1x 48V 100Ah)</option>
                  <option value={10}>10kWh (2x 48V 100Ah)</option>
                  <option value={15}>15kWh (3x 48V 100Ah)</option>
                  <option value={20}>20kWh (4x 48V 100Ah)</option>
                </select>
              </div>
            </>
          )}
        </aside>

        {/* Main Canvas */}
        <div className="flex-1 min-w-0 p-3 sm:p-6">
          {(activeTab === 'design' || activeTab === 'shading') && (
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-slate-700">
                <h2 className="text-white font-medium">
                  {activeTab === 'design' ? 'Roof Designer' : 'Shading Simulation'}
                </h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                  <span className="text-slate-400">Panels: <span className="text-white">{totalPanels}</span></span>
                  <span className="text-slate-400">Total: <span className="text-amber-400">{totalKW.toFixed(2)} kW</span></span>
                  <span className="text-slate-400">Effective: <span className="text-emerald-400">{effectiveKW.toFixed(2)} kW</span></span>
                </div>
              </div>
              <canvas
                ref={roofCanvasRef}
                width={900}
                height={500}
                onClick={handleCanvasClick}
                className="w-full cursor-crosshair"
                style={{ background: '#1a1a2e' }}
              />
              {isDrawing && (
                <div className="px-4 py-2 bg-amber-500/20 text-amber-400 text-sm">
                  Click to add points. Click "Complete Roof" when done (min 3 points). Each grid square is 1 m; Auto-Fill keeps a {EDGE_SETBACK_M} m clear strip at the edge.
                </div>
              )}
            </div>
          )}

          {activeTab === 'electrical' && (
            <div className="space-y-6">
              {/* Auto-Generated SLD */}
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                <h2 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  Single Line Diagram (Auto-Generated)
                </h2>

                {/* SLD Diagram */}
                <div className="bg-slate-900 rounded-lg p-6 font-mono text-sm overflow-x-auto">
                  <pre className="text-slate-300 overflow-x-auto">
{`
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SINGLE LINE DIAGRAM - AUTO GENERATED                  │
│                        System Size: ${totalKW.toFixed(2)} kW | ${totalPanels} Panels                       │
└─────────────────────────────────────────────────────────────────────────────┘

     ☀️ SOLAR ARRAY
     ═══════════════

     ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
     │ String 1│   │ String 2│   │ String 3│   │ String 4│  ...
     │ ${stringConfig.series} panels │   │ ${stringConfig.series} panels │   │ ${stringConfig.series} panels │   │ ${stringConfig.series} panels │
     │ ${(stringConfig.series * panelWatts / 1000).toFixed(1)}kW    │   │ ${(stringConfig.series * panelWatts / 1000).toFixed(1)}kW    │   │ ${(stringConfig.series * panelWatts / 1000).toFixed(1)}kW    │   │ ${(stringConfig.series * panelWatts / 1000).toFixed(1)}kW    │
     └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘
          │             │             │             │
          │   ${wireSize}     │   ${wireSize}     │   ${wireSize}     │   ${wireSize}
          │             │             │             │
          └──────┬──────┴──────┬──────┴──────┬──────┘
                 │             │             │
          ┌──────┴─────────────┴─────────────┴──────┐
          │          DC COMBINER BOX                 │
          │   Voc: ${stringVoc.toFixed(0)}V  |  Isc: ${(systemCurrent * 1.25).toFixed(1)}A              │
          │   Surge Protection: Type II              │
          └────────────────┬─────────────────────────┘
                           │
                           │  DC Cable ${wireSize}
                           │  Vmp: ${(stringConfig.series * panelVmp).toFixed(0)}V
                           │
                    ┌──────┴──────┐
                    │  DC ISOLATOR │
                    │  ${Math.ceil(stringVoc * 1.15)}V / ${Math.ceil(arrayDesignA * 1.25)}A   │
                    └──────┬──────┘
                           │
          ┌────────────────┴────────────────┐
          │     ⚡ HYBRID INVERTER           │
          │     Model: ${inverterSize}kW Hybrid              │
          │     MPPT: 2 inputs               │
          │     Battery Port: 48V            │
          │     Grid Port: 230V AC           │
          └───┬─────────────┬───────────────┘
              │             │
         DC   │             │  AC
              │             │
     ┌────────┴────────┐   │
     │  🔋 BATTERY BANK │   │
     │  ${batteryCapacity}kWh LiFePO4     │   │
     │  48V ${(batteryCapacity * 1000 / 48).toFixed(0)}Ah         │   │
     │  ${Math.ceil(batteryCapacity / 5)} x 48V 100Ah    │   │
     └─────────────────┘   │
                           │
                    ┌──────┴──────┐
                    │ AC ISOLATOR  │
                    │  ${(acBreakerA + 'A MCB').padEnd(11)}│
                    └──────┬──────┘
                           │
          ┌────────────────┴────────────────┐
          │     📊 ENERGY METER              │
          │     Bidirectional                │
          │     CT sized to the supply       │
          └────────────────┬────────────────┘
                           │
          ┌────────────────┴────────────────┐
          │     🏠 MAIN DISTRIBUTION BOARD   │
          │     ├── Lights Circuit  (example)│
          │     ├── Sockets Circuit (example)│
          │     ├── Other circuits  (example)│
          │     └── Backup circuits (example)│
          └────────────────┬────────────────┘
                           │
                    ┌──────┴──────┐
                    │  GRID TIE   │
                    │  (Optional) │
                    └─────────────┘

═══════════════════════════════════════════════════════════════════════════════
SPECIFICATIONS:
───────────────────────────────────────────────────────────────────────────────
  Total System Size    : ${totalKW.toFixed(2)} kW
  Number of Panels     : ${totalPanels} x ${panelWatts}W
  String Configuration : ${stringConfig.series}S x ${stringConfig.parallel}P
  System Voltage (Vmp) : ${(stringConfig.series * panelVmp).toFixed(0)}V DC
  System Current       : ${systemCurrent.toFixed(1)}A
  Inverter Size        : ${inverterSize} kW Hybrid
  Battery Capacity     : ${batteryCapacity} kWh
  DC Cable Size        : ${wireSize} (UV resistant)
  AC Cable Size        : ${acWire} (to DB; rated at least the breaker)

PROTECTION:
───────────────────────────────────────────────────────────────────────────────
  DC Surge Protection  : Type II SPD
  AC Surge Protection  : Type II SPD
  DC Isolator          : ${Math.ceil(stringVoc * 1.15)}V / ${Math.ceil(arrayDesignA * 1.25)}A
  AC MCB               : ${acBreakerLabel} (1.25 x ${acAmps.toFixed(1)} A inverter output)
  ELCB/RCD             : 30mA, rated at least ${acBreakerA}A

EARTHING:
───────────────────────────────────────────────────────────────────────────────
  Earth Rod            : 2m Copper-clad steel
  Earth Cable          : ${earthCsa}mm² Green/Yellow (IEC 60364-5-54)
  Lightning Protection : Recommended for arrays > 5kW
═══════════════════════════════════════════════════════════════════════════════
`}
                  </pre>
                </div>

                {/* These three buttons had no handlers (2026-10-18 tool audit). */}
                <div className="flex flex-wrap gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4" /> Print / save as PDF
                  </button>
                  <a
                    href={`https://wa.me/254768860665?text=${encodeURIComponent(`Hi EmersonEIMS, please check the wiring for my solar design: ${totalPanels} × ${panelWatts} W (${totalKW.toFixed(2)} kW), ${stringConfig.series} in series × ${stringConfig.parallel} strings, ${inverterSize} kW inverter, ${batteryCapacity} kWh battery.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" /> Send to an engineer
                  </a>
                </div>
              </div>

              {/* Wire Schedule */}
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                <h3 className="text-white font-bold mb-4">Wire Schedule</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-700">
                      <th className="text-left py-2">Section</th>
                      <th className="text-left py-2">Type</th>
                      <th className="text-left py-2">Size</th>
                      <th className="text-left py-2">Length (est.)</th>
                      <th className="text-left py-2">Color</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-300">
                    <tr className="border-b border-slate-700/50">
                      <td className="py-2">Panel to Combiner</td>
                      <td>DC Solar Cable</td>
                      <td>{wireSize}</td>
                      <td>~{totalPanels * 2}m</td>
                      <td>Red (+) / Black (-)</td>
                    </tr>
                    <tr className="border-b border-slate-700/50">
                      <td className="py-2">Combiner to Inverter</td>
                      <td>DC Cable</td>
                      <td>{combinerWire}</td>
                      <td>~10m</td>
                      <td>Red (+) / Black (-)</td>
                    </tr>
                    <tr className="border-b border-slate-700/50">
                      <td className="py-2">Inverter to Battery</td>
                      <td>Battery Cable ({Math.round(batteryAmps)} A at 48 V)</td>
                      <td>{batteryWire}</td>
                      <td>~3m</td>
                      <td>Red (+) / Black (-)</td>
                    </tr>
                    <tr className="border-b border-slate-700/50">
                      <td className="py-2">Inverter to DB</td>
                      <td>AC Cable ({Math.round(acAmps)} A{threePhase ? ', 3-phase' : ''}; breaker {acBreakerA} A)</td>
                      <td>{acWire}</td>
                      <td>~15m</td>
                      <td>Brown/Blue/Green-Yellow</td>
                    </tr>
                    <tr>
                      <td className="py-2">Earth</td>
                      <td>Earth Cable</td>
                      <td>{earthCsa}mm²</td>
                      <td>~20m</td>
                      <td>Green/Yellow</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'report' && (
            <div className="space-y-6">
              {/* System Summary */}
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                <h2 className="text-white font-bold text-xl mb-4">System Summary Report</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl p-4 border border-amber-500/30">
                    <Sun className="w-8 h-8 text-amber-400 mb-2" />
                    <p className="text-slate-400 text-sm">System Size</p>
                    <p className="text-white text-2xl font-bold">{totalKW.toFixed(2)} kW</p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl p-4 border border-emerald-500/30">
                    <Zap className="w-8 h-8 text-emerald-400 mb-2" />
                    <p className="text-slate-400 text-sm">Daily Production</p>
                    <p className="text-white text-2xl font-bold">{dailyProduction.toFixed(1)} kWh</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-4 border border-blue-500/30">
                    <Battery className="w-8 h-8 text-blue-400 mb-2" />
                    <p className="text-slate-400 text-sm">Battery Backup</p>
                    <p className="text-white text-2xl font-bold">{batteryCapacity} kWh</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30">
                    <Calculator className="w-8 h-8 text-purple-400 mb-2" />
                    <p className="text-slate-400 text-sm">Annual Savings</p>
                    <p className="text-white text-2xl font-bold">KSh {(annualProduction * 25).toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-white font-medium mb-3">Production Estimates</h3>
                    <table className="w-full text-sm">
                      <tbody className="text-slate-300">
                        <tr className="border-b border-slate-700/50">
                          <td className="py-2">Daily (avg)</td>
                          <td className="text-right text-emerald-400">{dailyProduction.toFixed(1)} kWh</td>
                        </tr>
                        <tr className="border-b border-slate-700/50">
                          <td className="py-2">Monthly (avg)</td>
                          <td className="text-right text-emerald-400">{monthlyProduction.toFixed(0)} kWh</td>
                        </tr>
                        <tr>
                          <td className="py-2">Annual</td>
                          <td className="text-right text-emerald-400">{annualProduction.toFixed(0)} kWh</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <h3 className="text-white font-medium mb-3">Financial Summary</h3>
                    <table className="w-full text-sm">
                      <tbody className="text-slate-300">
                        <tr className="border-b border-slate-700/50">
                          <td className="py-2">Typical installed cost</td>
                          <td className="text-right">KSh {installedCost.lowKes.toLocaleString()} – {installedCost.highKes.toLocaleString()}</td>
                        </tr>
                        <tr className="border-b border-slate-700/50">
                          <td className="py-2">Estimated annual saving (about {Math.round(usedShare * 100)}% of the solar used on site, KSh {TARIFF_KES}/kWh)</td>
                          <td className="text-right text-emerald-400">KSh {Math.round(annualSavingKes).toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="py-2">Simple payback (longer if less of the solar is used on site)</td>
                          <td className="text-right text-amber-400">{annualSavingKes > 0 ? `${(installedCost.midKes / annualSavingKes).toFixed(1)} years` : '—'}</td>
                        </tr>
                      </tbody>
                    </table>
                    <p className="text-xs text-slate-500 mt-2">
                      Sun data: {sunSource} ({sunHours} sun-hours a day), 78% performance ratio. Prices are typical Kenyan
                      installed ranges (mid-2026), not a quotation.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-2"
                  >
                    <Printer className="w-5 h-5" /> Print / save as PDF
                  </button>
                  <a
                    href={`https://wa.me/254768860665?text=${encodeURIComponent(`Hi EmersonEIMS, please quote this solar design: ${totalPanels} × ${panelWatts} W (${totalKW.toFixed(2)} kW), ${inverterSize} kW inverter, ${batteryCapacity} kWh battery, at ${location}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2"
                  >
                    <FileText className="w-5 h-5" /> Get a quotation on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Stats */}
        <aside className="w-full lg:w-72 shrink-0 bg-slate-800/50 border-t lg:border-t-0 lg:border-l border-slate-700 p-4 lg:min-h-[calc(100vh-140px)]">
          <h3 className="text-white font-medium mb-4">System Overview</h3>

          <div className="space-y-4">
            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Total Capacity</span>
                <Sun className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-white text-2xl font-bold">{totalKW.toFixed(2)} kW</p>
              <p className="text-slate-500 text-xs">{totalPanels} panels @ {panelWatts}W</p>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Effective Output</span>
                <Zap className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-emerald-400 text-2xl font-bold">{effectiveKW.toFixed(2)} kW</p>
              <p className="text-slate-500 text-xs">78% performance ratio (heat, dust, wiring, low sun)</p>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Daily Production</span>
                <Activity className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-blue-400 text-2xl font-bold">{dailyProduction.toFixed(1)} kWh</p>
              <p className="text-slate-500 text-xs">{sunHours.toFixed(2)} peak sun hours</p>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Inverter</span>
                <Settings className="w-4 h-4 text-purple-400" />
              </div>
              {/* No verdict until panels are placed (2026-10-20 audit: "5 kW ✓ Properly sized" with 0 panels). */}
              <p className="text-purple-400 text-2xl font-bold">{totalPanels > 0 ? `${inverterSize} kW` : '—'}</p>
              <p className={`text-xs ${totalPanels === 0 ? 'text-slate-500' : inverterSize < totalKW ? 'text-red-400' : 'text-emerald-400'}`}>
                {totalPanels === 0 ? 'Place panels first' : dcAcRatio > 1.35 ? '⚠️ Array too large for this inverter (clipping)' : dcAcRatio < 0.8 && batteryCapacity === 0 ? '⚠️ Inverter large for this array' : `✓ DC/AC ${dcAcRatio.toFixed(2)}`}
              </p>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Battery</span>
                <Battery className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-green-400 text-2xl font-bold">{totalPanels > 0 ? `${batteryCapacity} kWh` : '—'}</p>
              <p className="text-slate-500 text-xs">{totalPanels === 0 ? 'Place panels first' : batteryCapacity > 0 ? `${(batteryCapacity * 0.9).toFixed(1)} kWh usable (90% depth)` : 'No battery'}</p>
            </div>

            {roofSegments.length > 0 && (
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">Roof Area</span>
                  <Layers className="w-4 h-4 text-cyan-400" />
                </div>
                <p className="text-cyan-400 text-2xl font-bold">
                  {roofSegments.reduce((sum, s) => sum + s.area, 0).toFixed(1)} m²
                </p>
                <p className="text-slate-500 text-xs">{roofSegments.length} segment(s)</p>
              </div>
            )}
          </div>

          {/* Warnings */}
          {(totalKW / Math.max(inverterSize, 0.1) > 1.3 || avgShading > 25) && (
            <div className="mt-4 space-y-2">
              <h4 className="text-amber-400 font-medium text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Warnings
              </h4>
              {/* DC/AC up to about 1.3 is normal practice (some clipping at peak
                  sun); it was flagged as soon as the array exceeded the inverter. */}
              {totalKW / Math.max(inverterSize, 0.1) > 1.3 && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-2 text-red-400 text-xs">
                  DC/AC ratio {(totalKW / inverterSize).toFixed(2)} is above 1.3: expect heavy clipping. A {Math.ceil(totalKW / 1.15)} kW inverter or larger suits this array.
                </div>
              )}
              {avgShading > 25 && (
                <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg p-2 text-amber-400 text-xs">
                  Low sun at this time ({avgShading.toFixed(0)}% loss). Obstacles such as trees and walls are not modelled: check them on site.
                </div>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
