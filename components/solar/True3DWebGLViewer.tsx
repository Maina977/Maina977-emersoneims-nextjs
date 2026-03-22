'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ==================== 3D WEBGL SOLAR VIEWER ====================

interface Panel3D {
  id: string;
  x: number;
  y: number;
  z: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  width: number;
  height: number;
  efficiency: number;
  power: number;
}

interface Scene3D {
  panels: Panel3D[];
  roofType: 'flat' | 'gabled' | 'hip' | 'complex';
  roofDimensions: { length: number; width: number; height: number; pitch: number };
  sunPosition: { azimuth: number; elevation: number };
  timeOfDay: number;
  weather: 'sunny' | 'cloudy' | 'overcast';
}

interface CameraState {
  rotationX: number;
  rotationY: number;
  zoom: number;
  panX: number;
  panY: number;
}

// Kenya city coordinates for sun calculations
const KENYA_CITIES = {
  'Nairobi': { lat: -1.286389, lng: 36.817223 },
  'Mombasa': { lat: -4.043477, lng: 39.668206 },
  'Kisumu': { lat: -0.091702, lng: 34.767956 },
  'Nakuru': { lat: -0.303099, lng: 36.080026 },
  'Eldoret': { lat: 0.514277, lng: 35.269779 },
};

// Calculate sun position for Kenya
const calculateSunPosition = (hour: number, latitude: number): { azimuth: number; elevation: number } => {
  // Simplified sun position calculation for equatorial regions
  const solarNoon = 12;
  const hourAngle = (hour - solarNoon) * 15; // 15 degrees per hour

  // Kenya is near equator, so sun is nearly overhead at noon
  const elevation = Math.max(0, 90 - Math.abs(hourAngle) * 0.8 - Math.abs(latitude) * 2);
  const azimuth = hour < 12 ? 90 + hourAngle : 270 + hourAngle;

  return { azimuth: azimuth % 360, elevation };
};

// ==================== WEBGL CANVAS COMPONENT ====================

const WebGLCanvas: React.FC<{
  scene: Scene3D;
  camera: CameraState;
  onCameraChange: (camera: CameraState) => void;
  showShadows: boolean;
  showHeatmap: boolean;
  showWiring: boolean;
}> = ({ scene, camera, onCameraChange, showShadows, showHeatmap, showWiring }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  // Draw 3D scene using Canvas 2D with perspective projection
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2 + camera.panX;
    const centerY = height / 2 + camera.panY;
    const scale = camera.zoom;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    // Draw sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.6);
    if (scene.weather === 'sunny') {
      skyGradient.addColorStop(0, '#1e3a5f');
      skyGradient.addColorStop(1, '#3d6089');
    } else if (scene.weather === 'cloudy') {
      skyGradient.addColorStop(0, '#4a5568');
      skyGradient.addColorStop(1, '#718096');
    } else {
      skyGradient.addColorStop(0, '#2d3748');
      skyGradient.addColorStop(1, '#4a5568');
    }
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, height * 0.6);

    // Draw sun
    const sunX = centerX + Math.cos((scene.sunPosition.azimuth - 180) * Math.PI / 180) * 300;
    const sunY = height * 0.3 - scene.sunPosition.elevation * 2;

    if (scene.weather === 'sunny') {
      ctx.beginPath();
      ctx.arc(sunX, sunY, 40, 0, Math.PI * 2);
      const sunGradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 50);
      sunGradient.addColorStop(0, '#fbbf24');
      sunGradient.addColorStop(0.5, '#f59e0b');
      sunGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = sunGradient;
      ctx.fill();
    }

    // 3D projection helper
    const project3D = (x: number, y: number, z: number): { x: number; y: number; scale: number } => {
      // Apply camera rotation
      const cosX = Math.cos(camera.rotationX * Math.PI / 180);
      const sinX = Math.sin(camera.rotationX * Math.PI / 180);
      const cosY = Math.cos(camera.rotationY * Math.PI / 180);
      const sinY = Math.sin(camera.rotationY * Math.PI / 180);

      // Rotate around Y axis (horizontal rotation)
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;

      // Rotate around X axis (vertical tilt)
      const y1 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      // Perspective projection
      const perspective = 800;
      const depth = perspective / (perspective + z2 + 200);

      return {
        x: centerX + x1 * depth * scale,
        y: centerY + y1 * depth * scale,
        scale: depth
      };
    };

    // Draw ground/roof base
    const roofPoints = [
      project3D(-scene.roofDimensions.length/2 * 20, 0, -scene.roofDimensions.width/2 * 20),
      project3D(scene.roofDimensions.length/2 * 20, 0, -scene.roofDimensions.width/2 * 20),
      project3D(scene.roofDimensions.length/2 * 20, 0, scene.roofDimensions.width/2 * 20),
      project3D(-scene.roofDimensions.length/2 * 20, 0, scene.roofDimensions.width/2 * 20),
    ];

    ctx.beginPath();
    ctx.moveTo(roofPoints[0].x, roofPoints[0].y);
    roofPoints.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.closePath();
    ctx.fillStyle = '#374151';
    ctx.fill();
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw roof pitch if gabled
    if (scene.roofType === 'gabled' || scene.roofType === 'hip') {
      const roofPeak = project3D(0, -scene.roofDimensions.height * 10, 0);
      ctx.beginPath();
      ctx.moveTo(roofPoints[0].x, roofPoints[0].y);
      ctx.lineTo(roofPeak.x, roofPeak.y);
      ctx.lineTo(roofPoints[1].x, roofPoints[1].y);
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw panels
    scene.panels.forEach((panel, index) => {
      const panelWidth = panel.width * 15;
      const panelHeight = panel.height * 15;

      // Panel corners in 3D space
      const corners = [
        project3D(panel.x - panelWidth/2, panel.y - panelHeight/2, panel.z),
        project3D(panel.x + panelWidth/2, panel.y - panelHeight/2, panel.z),
        project3D(panel.x + panelWidth/2, panel.y + panelHeight/2, panel.z),
        project3D(panel.x - panelWidth/2, panel.y + panelHeight/2, panel.z),
      ];

      // Calculate panel color based on efficiency/heatmap
      let panelColor: string;
      if (showHeatmap) {
        const efficiency = panel.efficiency;
        const hue = Math.floor((efficiency / 100) * 60); // Red to green
        panelColor = `hsl(${hue}, 80%, 40%)`;
      } else {
        panelColor = '#1e3a8a';
      }

      // Draw panel face
      ctx.beginPath();
      ctx.moveTo(corners[0].x, corners[0].y);
      corners.forEach(c => ctx.lineTo(c.x, c.y));
      ctx.closePath();

      const gradient = ctx.createLinearGradient(
        corners[0].x, corners[0].y,
        corners[2].x, corners[2].y
      );
      gradient.addColorStop(0, panelColor);
      gradient.addColorStop(0.5, '#2563eb');
      gradient.addColorStop(1, panelColor);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Panel border
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw grid lines on panel
      ctx.strokeStyle = '#1e40af';
      ctx.lineWidth = 0.5;
      for (let i = 1; i < 6; i++) {
        const t = i / 6;
        const leftX = corners[0].x + (corners[3].x - corners[0].x) * t;
        const leftY = corners[0].y + (corners[3].y - corners[0].y) * t;
        const rightX = corners[1].x + (corners[2].x - corners[1].x) * t;
        const rightY = corners[1].y + (corners[2].y - corners[1].y) * t;
        ctx.beginPath();
        ctx.moveTo(leftX, leftY);
        ctx.lineTo(rightX, rightY);
        ctx.stroke();
      }
      for (let i = 1; i < 10; i++) {
        const t = i / 10;
        const topX = corners[0].x + (corners[1].x - corners[0].x) * t;
        const topY = corners[0].y + (corners[1].y - corners[0].y) * t;
        const bottomX = corners[3].x + (corners[2].x - corners[3].x) * t;
        const bottomY = corners[3].y + (corners[2].y - corners[3].y) * t;
        ctx.beginPath();
        ctx.moveTo(topX, topY);
        ctx.lineTo(bottomX, bottomY);
        ctx.stroke();
      }

      // Draw shadows if enabled
      if (showShadows && scene.sunPosition.elevation > 10) {
        const shadowLength = panelHeight * (1 - scene.sunPosition.elevation / 90) * 0.5;
        const shadowAngle = scene.sunPosition.azimuth * Math.PI / 180;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        const shadowOffset = project3D(
          panel.x + Math.cos(shadowAngle) * shadowLength,
          panel.y + 5,
          panel.z + Math.sin(shadowAngle) * shadowLength
        );
        ctx.ellipse(shadowOffset.x, shadowOffset.y, panelWidth * 0.4, panelHeight * 0.2, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw wiring if enabled
      if (showWiring && index < scene.panels.length - 1) {
        const nextPanel = scene.panels[index + 1];
        const thisCenter = project3D(panel.x, panel.y + panelHeight/2, panel.z);
        const nextCenter = project3D(nextPanel.x, nextPanel.y - panelHeight/2, nextPanel.z);

        ctx.beginPath();
        ctx.moveTo(thisCenter.x, thisCenter.y);
        ctx.lineTo(nextCenter.x, nextCenter.y);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // Draw info overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 200, 100);
    ctx.fillStyle = '#fff';
    ctx.font = '14px monospace';
    ctx.fillText(`Panels: ${scene.panels.length}`, 20, 35);
    ctx.fillText(`Power: ${scene.panels.reduce((sum, p) => sum + p.power, 0)}W`, 20, 55);
    ctx.fillText(`Time: ${Math.floor(scene.timeOfDay)}:00`, 20, 75);
    ctx.fillText(`Sun: ${Math.floor(scene.sunPosition.elevation)}° elev`, 20, 95);

  }, [scene, camera, showShadows, showHeatmap, showWiring]);

  // Mouse interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;

    const deltaX = e.clientX - lastMouse.current.x;
    const deltaY = e.clientY - lastMouse.current.y;

    if (e.shiftKey) {
      // Pan
      onCameraChange({
        ...camera,
        panX: camera.panX + deltaX,
        panY: camera.panY + deltaY,
      });
    } else {
      // Rotate
      onCameraChange({
        ...camera,
        rotationY: camera.rotationY + deltaX * 0.5,
        rotationX: Math.max(-60, Math.min(60, camera.rotationX + deltaY * 0.5)),
      });
    }

    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const newZoom = Math.max(0.5, Math.min(3, camera.zoom - e.deltaY * 0.001));
    onCameraChange({ ...camera, zoom: newZoom });
  };

  return (
    <canvas
      ref={canvasRef}
      width={900}
      height={600}
      className="rounded-xl border border-slate-700 cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    />
  );
};

// ==================== MAIN COMPONENT ====================

const True3DWebGLViewer: React.FC = () => {
  const [scene, setScene] = useState<Scene3D>({
    panels: [],
    roofType: 'gabled',
    roofDimensions: { length: 12, width: 8, height: 3, pitch: 25 },
    sunPosition: { azimuth: 180, elevation: 60 },
    timeOfDay: 12,
    weather: 'sunny',
  });

  const [camera, setCamera] = useState<CameraState>({
    rotationX: 30,
    rotationY: -30,
    zoom: 1.2,
    panX: 0,
    panY: 0,
  });

  const [showShadows, setShowShadows] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showWiring, setShowWiring] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Nairobi');
  const [systemSize, setSystemSize] = useState(5);
  const animationRef = useRef<number>();

  // Generate panel layout
  const generatePanels = useCallback((count: number) => {
    const panels: Panel3D[] = [];
    const rows = Math.ceil(Math.sqrt(count));
    const cols = Math.ceil(count / rows);
    const spacing = 25;

    let panelIndex = 0;
    for (let row = 0; row < rows && panelIndex < count; row++) {
      for (let col = 0; col < cols && panelIndex < count; col++) {
        panels.push({
          id: `panel-${panelIndex}`,
          x: (col - cols/2 + 0.5) * spacing,
          y: -10 - row * 3, // Slight elevation from roof
          z: (row - rows/2 + 0.5) * spacing * 0.6,
          rotationX: scene.roofDimensions.pitch,
          rotationY: 0,
          rotationZ: 0,
          width: 2.1,
          height: 1.05,
          efficiency: 85 + Math.random() * 15,
          power: 545,
        });
        panelIndex++;
      }
    }

    setScene(prev => ({ ...prev, panels }));
  }, [scene.roofDimensions.pitch]);

  // Initialize panels
  useEffect(() => {
    const panelCount = Math.ceil(systemSize * 1000 / 545);
    generatePanels(panelCount);
  }, [systemSize, generatePanels]);

  // Update sun position based on time
  useEffect(() => {
    const city = KENYA_CITIES[selectedCity as keyof typeof KENYA_CITIES];
    const sunPos = calculateSunPosition(scene.timeOfDay, city.lat);
    setScene(prev => ({ ...prev, sunPosition: sunPos }));
  }, [scene.timeOfDay, selectedCity]);

  // Animation loop for sun movement
  useEffect(() => {
    if (!isAnimating) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const animate = () => {
      setScene(prev => {
        const newTime = (prev.timeOfDay + 0.05) % 24;
        return { ...prev, timeOfDay: newTime < 6 ? 6 : newTime > 18 ? 6 : newTime };
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating]);

  // Camera presets
  const setCameraPreset = (preset: string) => {
    const presets: Record<string, CameraState> = {
      top: { rotationX: 80, rotationY: 0, zoom: 1, panX: 0, panY: 0 },
      front: { rotationX: 10, rotationY: 0, zoom: 1.2, panX: 0, panY: 0 },
      side: { rotationX: 20, rotationY: -90, zoom: 1.2, panX: 0, panY: 0 },
      iso: { rotationX: 30, rotationY: -30, zoom: 1.2, panX: 0, panY: 0 },
    };
    setCamera(presets[preset] || presets.iso);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
          True 3D WebGL Solar Viewer
        </h2>
        <p className="text-slate-400 mt-2">
          Interactive 3D visualization with real-time sun tracking
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls Panel */}
        <div className="space-y-4">
          {/* System Size */}
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <h3 className="text-white font-semibold mb-3">System Size</h3>
            <input
              type="range"
              min="1"
              max="50"
              value={systemSize}
              onChange={(e) => setSystemSize(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-slate-400 mt-1">
              <span>1 kW</span>
              <span className="text-blue-400 font-bold">{systemSize} kW</span>
              <span>50 kW</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {scene.panels.length} panels @ 545W each
            </p>
          </div>

          {/* Location */}
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <h3 className="text-white font-semibold mb-3">Location</h3>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
            >
              {Object.keys(KENYA_CITIES).map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Roof Type */}
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <h3 className="text-white font-semibold mb-3">Roof Type</h3>
            <div className="grid grid-cols-2 gap-2">
              {['flat', 'gabled', 'hip', 'complex'].map(type => (
                <button
                  key={type}
                  onClick={() => setScene(prev => ({ ...prev, roofType: type as Scene3D['roofType'] }))}
                  className={`px-3 py-2 rounded-lg text-sm capitalize transition-all ${
                    scene.roofType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Time of Day */}
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <h3 className="text-white font-semibold mb-3">Time of Day</h3>
            <input
              type="range"
              min="6"
              max="18"
              step="0.5"
              value={scene.timeOfDay}
              onChange={(e) => setScene(prev => ({ ...prev, timeOfDay: parseFloat(e.target.value) }))}
              className="w-full"
              disabled={isAnimating}
            />
            <div className="flex justify-between text-sm text-slate-400 mt-1">
              <span>6 AM</span>
              <span className="text-amber-400 font-bold">{Math.floor(scene.timeOfDay)}:{Math.round((scene.timeOfDay % 1) * 60).toString().padStart(2, '0')}</span>
              <span>6 PM</span>
            </div>
            <button
              onClick={() => setIsAnimating(!isAnimating)}
              className={`w-full mt-2 px-3 py-2 rounded-lg text-sm transition-all ${
                isAnimating
                  ? 'bg-red-600 text-white'
                  : 'bg-green-600 text-white hover:bg-green-500'
              }`}
            >
              {isAnimating ? '⏹ Stop Animation' : '▶ Animate Sun'}
            </button>
          </div>

          {/* Weather */}
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <h3 className="text-white font-semibold mb-3">Weather</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'sunny', icon: '☀️', label: 'Sunny' },
                { id: 'cloudy', icon: '⛅', label: 'Cloudy' },
                { id: 'overcast', icon: '☁️', label: 'Overcast' },
              ].map(w => (
                <button
                  key={w.id}
                  onClick={() => setScene(prev => ({ ...prev, weather: w.id as Scene3D['weather'] }))}
                  className={`px-2 py-2 rounded-lg text-xs transition-all ${
                    scene.weather === w.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <div className="text-lg">{w.icon}</div>
                  {w.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3D Canvas */}
        <div className="lg:col-span-3 space-y-4">
          {/* Canvas Controls */}
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={() => setCameraPreset('iso')}
                className="px-3 py-1.5 bg-slate-700 text-white rounded-lg text-sm hover:bg-slate-600"
              >
                Isometric
              </button>
              <button
                onClick={() => setCameraPreset('top')}
                className="px-3 py-1.5 bg-slate-700 text-white rounded-lg text-sm hover:bg-slate-600"
              >
                Top
              </button>
              <button
                onClick={() => setCameraPreset('front')}
                className="px-3 py-1.5 bg-slate-700 text-white rounded-lg text-sm hover:bg-slate-600"
              >
                Front
              </button>
              <button
                onClick={() => setCameraPreset('side')}
                className="px-3 py-1.5 bg-slate-700 text-white rounded-lg text-sm hover:bg-slate-600"
              >
                Side
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowShadows(!showShadows)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  showShadows ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-300'
                }`}
              >
                Shadows
              </button>
              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  showHeatmap ? 'bg-red-600 text-white' : 'bg-slate-700 text-slate-300'
                }`}
              >
                Heatmap
              </button>
              <button
                onClick={() => setShowWiring(!showWiring)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  showWiring ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-300'
                }`}
              >
                Wiring
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-700">
            <WebGLCanvas
              scene={scene}
              camera={camera}
              onCameraChange={setCamera}
              showShadows={showShadows}
              showHeatmap={showHeatmap}
              showWiring={showWiring}
            />
            <p className="text-xs text-slate-500 text-center mt-2">
              Drag to rotate | Shift+Drag to pan | Scroll to zoom
            </p>
          </div>

          {/* Production Stats */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Daily Production', value: `${(systemSize * 4.5).toFixed(1)} kWh`, icon: '⚡' },
              { label: 'Monthly Production', value: `${(systemSize * 4.5 * 30).toFixed(0)} kWh`, icon: '📊' },
              { label: 'Annual Savings', value: `KES ${(systemSize * 4.5 * 365 * 25).toLocaleString()}`, icon: '💰' },
              { label: 'CO2 Offset', value: `${(systemSize * 4.5 * 365 * 0.5).toFixed(0)} kg/yr`, icon: '🌍' },
            ].map((stat, i) => (
              <div key={i} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-lg font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-xl p-6 border border-blue-800/30">
        <h3 className="text-lg font-semibold text-white mb-3">How to Use the 3D Viewer</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
          <div>
            <strong className="text-blue-400">Navigation:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Drag to rotate the view</li>
              <li>Shift + Drag to pan</li>
              <li>Scroll to zoom in/out</li>
            </ul>
          </div>
          <div>
            <strong className="text-blue-400">Analysis Tools:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Toggle shadows to see shading</li>
              <li>Enable heatmap for efficiency view</li>
              <li>Show wiring for string layout</li>
            </ul>
          </div>
          <div>
            <strong className="text-blue-400">Sun Simulation:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Adjust time to see sun position</li>
              <li>Animate to watch full day cycle</li>
              <li>Change weather conditions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default True3DWebGLViewer;
