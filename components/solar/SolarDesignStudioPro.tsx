'use client';

/**
 * SOLAR DESIGN STUDIO PRO - AURORA KILLER
 *
 * Features:
 * 1. Interactive Roof Editor - Draw roof, place panels drag-drop
 * 2. Real-Time Shading - Sun slider, minute-by-minute shadows
 * 3. Auto SLD Generator - Professional electrical diagrams
 * 4. Complete System Calculator - Strings, wires, batteries
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sun, Zap, Battery, Calculator, FileText, Download, Play, Pause,
  RotateCw, Move, Trash2, Plus, Minus, Grid, Layers, Cable,
  AlertTriangle, CheckCircle2, Settings, Eye, Box, MapPin,
  Clock, Calendar, ArrowLeft, Save, Upload, Printer, Share2
} from 'lucide-react';

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
  const [panelWidth, setPanelWidth] = useState(40);
  const [panelHeight, setPanelHeight] = useState(60);

  // Sun & Shading
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentHour, setCurrentHour] = useState(12);
  const [isAnimating, setIsAnimating] = useState(false);
  const [sunPosition, setSunPosition] = useState<SunPosition>({ altitude: 45, azimuth: 180, hour: 12 });

  // System
  const [inverterSize, setInverterSize] = useState(5);
  const [batteryCapacity, setBatteryCapacity] = useState(10);
  const [stringConfig, setStringConfig] = useState({ series: 2, parallel: 2 });

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
  const effectiveKW = totalKW * (1 - avgShading / 100);
  const dailyProduction = effectiveKW * 5.5; // Avg sun hours Kenya
  const monthlyProduction = dailyProduction * 30;
  const annualProduction = dailyProduction * 365;

  // Wire sizing (simplified)
  const systemVoltage = stringConfig.series * 40; // ~40V per panel
  const systemCurrent = (totalWatts / systemVoltage) || 0;
  const wireSize = systemCurrent < 15 ? '4mm²' : systemCurrent < 25 ? '6mm²' : systemCurrent < 35 ? '10mm²' : '16mm²';

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

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

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
      area: area * 0.01, // Convert to m²
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
    const spacing = 5;

    for (let y = bounds.minY + 20; y < bounds.maxY - panelHeight; y += panelHeight + spacing) {
      for (let x = bounds.minX + 20; x < bounds.maxX - panelWidth; x += panelWidth + spacing) {
        // Check if point is inside polygon
        if (isPointInPolygon({ x: x + panelWidth/2, y: y + panelHeight/2 }, segment.points)) {
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
  }, [roofSegments, panelWatts, panelWidth, panelHeight]);

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
      <header className="bg-slate-800/80 backdrop-blur border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Sun className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Solar Design Studio Pro</h1>
              <p className="text-slate-400 text-sm">Better Than Aurora - Interactive Design Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center gap-2">
              <Save className="w-4 h-4" /> Save
            </button>
            <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center gap-2">
              <Upload className="w-4 h-4" /> Load
            </button>
            <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-2">
              <Download className="w-4 h-4" /> Export PDF
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          {[
            { id: 'design', label: 'Roof Design', icon: Layers },
            { id: 'shading', label: 'Shading Analysis', icon: Sun },
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

      <div className="flex">
        {/* Left Sidebar - Tools */}
        <aside className="w-64 bg-slate-800/50 border-r border-slate-700 p-4 min-h-[calc(100vh-140px)]">
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
                value={latitude}
                onChange={(e) => setLatitude(parseFloat(e.target.value))}
                className="bg-slate-700/50 text-white text-sm rounded px-2 py-1"
                placeholder="Lat"
                step="0.0001"
              />
              <input
                type="number"
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
                    <label className="text-slate-500 text-xs">Panels in Series</label>
                    <input
                      type="number"
                      value={stringConfig.series}
                      onChange={(e) => setStringConfig(s => ({ ...s, series: parseInt(e.target.value) || 1 }))}
                      className="w-full bg-slate-700 text-white rounded px-2 py-1 mt-1"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 text-xs">Strings in Parallel</label>
                    <input
                      type="number"
                      value={stringConfig.parallel}
                      onChange={(e) => setStringConfig(s => ({ ...s, parallel: parseInt(e.target.value) || 1 }))}
                      className="w-full bg-slate-700 text-white rounded px-2 py-1 mt-1"
                      min="1"
                    />
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
        <main className="flex-1 p-6">
          {(activeTab === 'design' || activeTab === 'shading') && (
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
                <h2 className="text-white font-medium">
                  {activeTab === 'design' ? 'Roof Designer' : 'Shading Simulation'}
                </h2>
                <div className="flex items-center gap-4 text-sm">
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
                  Click to add points. Click "Complete Roof" when done (min 3 points).
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
                  <pre className="text-slate-300">
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
          │   Voc: ${(stringConfig.series * 40).toFixed(0)}V  |  Isc: ${(systemCurrent * 1.25).toFixed(1)}A              │
          │   Surge Protection: Type II              │
          └────────────────┬─────────────────────────┘
                           │
                           │  DC Cable ${wireSize}
                           │  Vmp: ${(stringConfig.series * 35).toFixed(0)}V
                           │
                    ┌──────┴──────┐
                    │  DC ISOLATOR │
                    │  ${Math.ceil(stringConfig.series * 40 * 1.25)}V / ${Math.ceil(systemCurrent * 1.5)}A   │
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
                    │  63A DP MCB  │
                    └──────┬──────┘
                           │
          ┌────────────────┴────────────────┐
          │     📊 ENERGY METER              │
          │     Bidirectional                │
          │     CT Ratio: 100/5A             │
          └────────────────┬────────────────┘
                           │
          ┌────────────────┴────────────────┐
          │     🏠 MAIN DISTRIBUTION BOARD   │
          │     ├── Lights Circuit  (16A)    │
          │     ├── Sockets Circuit (20A)    │
          │     ├── AC Unit Circuit (32A)    │
          │     └── Backup Circuit  (32A)    │
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
  System Voltage (Vmp) : ${(stringConfig.series * 35).toFixed(0)}V DC
  System Current       : ${systemCurrent.toFixed(1)}A
  Inverter Size        : ${inverterSize} kW Hybrid
  Battery Capacity     : ${batteryCapacity} kWh
  DC Cable Size        : ${wireSize} (UV resistant)
  AC Cable Size        : 6mm² (to DB)

PROTECTION:
───────────────────────────────────────────────────────────────────────────────
  DC Surge Protection  : Type II SPD
  AC Surge Protection  : Type II SPD
  DC Isolator          : ${Math.ceil(stringConfig.series * 40 * 1.25)}V / ${Math.ceil(systemCurrent * 1.5)}A
  AC MCB               : 63A Double Pole
  ELCB/RCD             : 63A 30mA

EARTHING:
───────────────────────────────────────────────────────────────────────────────
  Earth Rod            : 2m Copper-clad steel
  Earth Cable          : 16mm² Green/Yellow
  Lightning Protection : Recommended for arrays > 5kW
═══════════════════════════════════════════════════════════════════════════════
`}
                  </pre>
                </div>

                <div className="flex gap-3 mt-4">
                  <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-2">
                    <Download className="w-4 h-4" /> Download SLD (PDF)
                  </button>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2">
                    <Printer className="w-4 h-4" /> Print
                  </button>
                  <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg flex items-center gap-2">
                    <Share2 className="w-4 h-4" /> Share with Electrician
                  </button>
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
                      <td>{systemCurrent > 30 ? '10mm²' : '6mm²'}</td>
                      <td>~10m</td>
                      <td>Red (+) / Black (-)</td>
                    </tr>
                    <tr className="border-b border-slate-700/50">
                      <td className="py-2">Inverter to Battery</td>
                      <td>Battery Cable</td>
                      <td>16mm²</td>
                      <td>~3m</td>
                      <td>Red (+) / Black (-)</td>
                    </tr>
                    <tr className="border-b border-slate-700/50">
                      <td className="py-2">Inverter to DB</td>
                      <td>AC Cable</td>
                      <td>6mm²</td>
                      <td>~15m</td>
                      <td>Brown/Blue/Green-Yellow</td>
                    </tr>
                    <tr>
                      <td className="py-2">Earth</td>
                      <td>Earth Cable</td>
                      <td>16mm²</td>
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

                <div className="grid grid-cols-4 gap-4 mb-6">
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
                          <td className="py-2">Estimated System Cost</td>
                          <td className="text-right">KSh {(totalKW * 85000).toLocaleString()}</td>
                        </tr>
                        <tr className="border-b border-slate-700/50">
                          <td className="py-2">Annual Savings</td>
                          <td className="text-right text-emerald-400">KSh {(annualProduction * 25).toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="py-2">Payback Period</td>
                          <td className="text-right text-amber-400">{((totalKW * 85000) / (annualProduction * 25)).toFixed(1)} years</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-2">
                    <Download className="w-5 h-5" /> Download Full Report (PDF)
                  </button>
                  <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2">
                    <FileText className="w-5 h-5" /> Generate Quotation
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Right Sidebar - Stats */}
        <aside className="w-72 bg-slate-800/50 border-l border-slate-700 p-4 min-h-[calc(100vh-140px)]">
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
              <p className="text-slate-500 text-xs">After {avgShading.toFixed(1)}% shading loss</p>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Daily Production</span>
                <Activity className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-blue-400 text-2xl font-bold">{dailyProduction.toFixed(1)} kWh</p>
              <p className="text-slate-500 text-xs">~5.5 peak sun hours</p>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Inverter</span>
                <Settings className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-purple-400 text-2xl font-bold">{inverterSize} kW</p>
              <p className={`text-xs ${inverterSize < totalKW ? 'text-red-400' : 'text-emerald-400'}`}>
                {inverterSize < totalKW ? '⚠️ Undersized!' : '✓ Properly sized'}
              </p>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Battery</span>
                <Battery className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-green-400 text-2xl font-bold">{batteryCapacity} kWh</p>
              <p className="text-slate-500 text-xs">{(batteryCapacity / (dailyProduction || 1) * 100).toFixed(0)}% daily backup</p>
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
          {(inverterSize < totalKW || avgShading > 25) && (
            <div className="mt-4 space-y-2">
              <h4 className="text-amber-400 font-medium text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Warnings
              </h4>
              {inverterSize < totalKW && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-2 text-red-400 text-xs">
                  Inverter undersized by {(totalKW - inverterSize).toFixed(1)}kW
                </div>
              )}
              {avgShading > 25 && (
                <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg p-2 text-amber-400 text-xs">
                  High shading ({avgShading.toFixed(0)}%) - consider panel repositioning
                </div>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
