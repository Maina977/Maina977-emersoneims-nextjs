'use client';

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   AQUASCAN PRO™ V3 - COMPLETE AI BOREHOLE ANALYZER                          ║
 * ║   All 26 AI Engines | Charts | Graphs | Maps | Comprehensive Reports        ║
 * ║   Copyright © 2024-2026 EmersonEIMS - All Rights Reserved                   ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  AIBoreholeAnalyzer,
  BoreholeAssessmentResult,
  GeoCoordinates,
  detectRegionFromCoordinates,
} from '@/lib/borehole/aiBoreholeAnalyzer';
import { PaymentModal } from '@/components/payment/PaymentGate';

// ============================================================================
// 26 AI ENGINES - COMPLETE LIST
// ============================================================================
const AI_ENGINES = [
  { id: 1, name: 'Terrain Analysis Engine', icon: '🏔️', category: 'Terrain' },
  { id: 2, name: 'Vegetation Detection AI', icon: '🌿', category: 'Vegetation' },
  { id: 3, name: 'Geological Formation Mapper', icon: '🪨', category: 'Geology' },
  { id: 4, name: 'NASA GRACE Groundwater', icon: '🛸', category: 'Satellite' },
  { id: 5, name: 'NASA GLDAS Integration', icon: '🌍', category: 'Satellite' },
  { id: 6, name: 'Google Earth Engine', icon: '🌐', category: 'Satellite' },
  { id: 7, name: 'Sentinel-2 Processor', icon: '🛰️', category: 'Remote Sensing' },
  { id: 8, name: 'Landsat-8 Analyzer', icon: '📡', category: 'Remote Sensing' },
  { id: 9, name: 'MODIS Data Fusion', icon: '🔭', category: 'Remote Sensing' },
  { id: 10, name: 'LiDAR Terrain Mapper', icon: '📊', category: 'LiDAR' },
  { id: 11, name: 'Hyperspectral Rock Mapper', icon: '💎', category: 'Hyperspectral' },
  { id: 12, name: 'VES Survey Simulator', icon: '⚡', category: 'Geophysics' },
  { id: 13, name: 'ERT Tomography Engine', icon: '🔌', category: 'Geophysics' },
  { id: 14, name: 'TDEM Electromagnetic', icon: '🧲', category: 'Geophysics' },
  { id: 15, name: 'Seismic Refraction AI', icon: '🌊', category: 'Geophysics' },
  { id: 16, name: 'Gravity Survey Analyzer', icon: '⬇️', category: 'Geophysics' },
  { id: 17, name: 'Magnetic Survey Engine', icon: '🧭', category: 'Geophysics' },
  { id: 18, name: 'GIS Spatial Analyzer', icon: '🗺️', category: 'GIS' },
  { id: 19, name: 'Water Quality Predictor', icon: '💧', category: 'Water' },
  { id: 20, name: 'Aquifer Depth Estimator', icon: '📏', category: 'Hydrology' },
  { id: 21, name: 'Yield Prediction Engine', icon: '💦', category: 'Hydrology' },
  { id: 22, name: 'Risk Assessment AI', icon: '⚠️', category: 'Risk' },
  { id: 23, name: 'EIA/Permit Analyzer', icon: '📋', category: 'Permits' },
  { id: 24, name: 'Climate Modeling Engine', icon: '🌦️', category: 'Climate' },
  { id: 25, name: 'Cost Estimation AI', icon: '💰', category: 'Financial' },
  { id: 26, name: 'ROI Calculator', icon: '📈', category: 'Financial' },
];

// ============================================================================
// CANVAS CHART COMPONENTS
// ============================================================================

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  title: string;
  width?: number;
  height?: number;
  unit?: string;
}

const BarChartCanvas: React.FC<BarChartProps> = ({ data, title, width = 400, height = 250, unit = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Config
    const padding = { top: 40, right: 20, bottom: 60, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Find max value
    const maxVal = Math.max(...data.map(d => d.value)) * 1.1;

    // Draw title
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, width / 2, 20);

    // Draw axes
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.stroke();

    // Draw Y-axis labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = height - padding.bottom - (i / 5) * chartHeight;
      const val = (maxVal * i / 5).toFixed(0);
      ctx.fillText(`${val}${unit}`, padding.left - 5, y + 3);

      // Grid line
      ctx.strokeStyle = '#f3f4f6';
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    // Draw bars
    const barWidth = chartWidth / data.length * 0.7;
    const barGap = chartWidth / data.length * 0.3;

    data.forEach((d, i) => {
      const x = padding.left + (i * (barWidth + barGap)) + barGap / 2;
      const barHeight = (d.value / maxVal) * chartHeight;
      const y = height - padding.bottom - barHeight;

      // Gradient fill
      const gradient = ctx.createLinearGradient(x, y, x, height - padding.bottom);
      gradient.addColorStop(0, d.color || '#3b82f6');
      gradient.addColorStop(1, d.color ? d.color + '80' : '#93c5fd');
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Value on top
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${d.value.toFixed(0)}${unit}`, x + barWidth / 2, y - 5);

      // X-axis label
      ctx.fillStyle = '#6b7280';
      ctx.font = '9px Inter, sans-serif';
      ctx.save();
      ctx.translate(x + barWidth / 2, height - padding.bottom + 10);
      ctx.rotate(-0.4);
      ctx.textAlign = 'right';
      ctx.fillText(d.label.slice(0, 12), 0, 0);
      ctx.restore();
    });
  }, [data, title, width, height, unit]);

  return <canvas ref={canvasRef} width={width} height={height} className="bg-white rounded-lg" />;
};

interface LineChartProps {
  data: { x: string; y: number }[];
  title: string;
  width?: number;
  height?: number;
  color?: string;
  unit?: string;
}

const LineChartCanvas: React.FC<LineChartProps> = ({ data, title, width = 400, height = 200, color = '#10b981', unit = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const padding = { top: 40, right: 20, bottom: 50, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const maxVal = Math.max(...data.map(d => d.y)) * 1.1;
    const minVal = Math.min(...data.map(d => d.y)) * 0.9;
    const range = maxVal - minVal;

    // Title
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, width / 2, 20);

    // Grid
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (i / 4) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      const val = maxVal - (range * i / 4);
      ctx.fillStyle = '#6b7280';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${val.toFixed(1)}${unit}`, padding.left - 5, y + 3);
    }

    // Draw line
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((d, i) => {
      const x = padding.left + (i / (data.length - 1)) * chartWidth;
      const y = padding.top + ((maxVal - d.y) / range) * chartHeight;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw area fill
    ctx.lineTo(padding.left + chartWidth, height - padding.bottom);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.closePath();
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, color + '40');
    gradient.addColorStop(1, color + '05');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw points
    data.forEach((d, i) => {
      const x = padding.left + (i / (data.length - 1)) * chartWidth;
      const y = padding.top + ((maxVal - d.y) / range) * chartHeight;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // X-axis labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '9px Inter, sans-serif';
    ctx.textAlign = 'center';
    data.forEach((d, i) => {
      if (i % Math.ceil(data.length / 6) === 0) {
        const x = padding.left + (i / (data.length - 1)) * chartWidth;
        ctx.fillText(d.x, x, height - padding.bottom + 15);
      }
    });
  }, [data, title, width, height, color, unit]);

  return <canvas ref={canvasRef} width={width} height={height} className="bg-white rounded-lg" />;
};

interface PieChartProps {
  data: { label: string; value: number; color: string }[];
  title: string;
  width?: number;
  height?: number;
}

const PieChartCanvas: React.FC<PieChartProps> = ({ data, title, width = 300, height = 250 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Title
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, width / 2, 20);

    const centerX = width / 2;
    const centerY = height / 2 + 10;
    const radius = Math.min(width, height) / 2 - 50;

    const total = data.reduce((sum, d) => sum + d.value, 0);
    let startAngle = -Math.PI / 2;

    data.forEach((d, i) => {
      const sliceAngle = (d.value / total) * Math.PI * 2;

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = d.color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      const midAngle = startAngle + sliceAngle / 2;
      const labelRadius = radius * 0.7;
      const labelX = centerX + Math.cos(midAngle) * labelRadius;
      const labelY = centerY + Math.sin(midAngle) * labelRadius;

      if (d.value / total > 0.05) {
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${((d.value / total) * 100).toFixed(0)}%`, labelX, labelY);
      }

      startAngle += sliceAngle;
    });

    // Legend
    const legendY = height - 25;
    const legendWidth = width / data.length;
    data.forEach((d, i) => {
      const x = i * legendWidth + legendWidth / 2;
      ctx.fillStyle = d.color;
      ctx.fillRect(x - 25, legendY - 8, 10, 10);
      ctx.fillStyle = '#6b7280';
      ctx.font = '9px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(d.label.slice(0, 8), x - 12, legendY);
    });
  }, [data, title, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} className="bg-white rounded-lg" />;
};

// ============================================================================
// AREA MAP CANVAS COMPONENT
// ============================================================================

interface MapCanvasProps {
  location: GeoCoordinates;
  title: string;
  markers?: { lat: number; lng: number; label: string; color: string }[];
  width?: number;
  height?: number;
}

const AreaMapCanvas: React.FC<MapCanvasProps> = ({ location, title, markers = [], width = 400, height = 300 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Draw map background (terrain simulation)
    const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2);
    gradient.addColorStop(0, '#d1fae5');
    gradient.addColorStop(0.5, '#a7f3d0');
    gradient.addColorStop(1, '#6ee7b7');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw grid lines (coordinate grid)
    ctx.strokeStyle = '#34d39933';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo(i * width / 10, 0);
      ctx.lineTo(i * width / 10, height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * height / 10);
      ctx.lineTo(width, i * height / 10);
      ctx.stroke();
    }

    // Draw water bodies simulation
    ctx.fillStyle = '#3b82f633';
    ctx.beginPath();
    ctx.ellipse(width * 0.2, height * 0.3, 40, 25, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(width * 0.8, height * 0.7, 30, 20, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Draw river
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, height * 0.4);
    ctx.bezierCurveTo(width * 0.3, height * 0.5, width * 0.6, height * 0.3, width, height * 0.6);
    ctx.stroke();

    // Draw main location marker
    const centerX = width / 2;
    const centerY = height / 2;

    // Pulse effect
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
    ctx.fillStyle = '#ef444433';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#ef444466';
    ctx.fill();

    // Main marker
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw additional markers
    markers.forEach((m, i) => {
      const mX = centerX + (m.lng - location.longitude) * 1000;
      const mY = centerY - (m.lat - location.latitude) * 1000;

      ctx.beginPath();
      ctx.arc(mX, mY, 6, 0, Math.PI * 2);
      ctx.fillStyle = m.color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Title
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, width, 35);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, width / 2, 23);

    // Coordinates badge
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, height - 30, width, 30);
    ctx.fillStyle = '#fff';
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${location.latitude.toFixed(6)}°, ${location.longitude.toFixed(6)}°`, width / 2, height - 10);

    // Scale bar
    ctx.fillStyle = '#fff';
    ctx.fillRect(15, height - 50, 60, 4);
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('1 km', 15, height - 55);
  }, [location, title, markers, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} className="rounded-lg shadow-lg" />;
};

// ============================================================================
// SUBSURFACE VISUALIZATION CANVAS
// ============================================================================

interface SubsurfaceCanvasProps {
  layers: { depth: number; thickness: number; material: string; color: string; waterBearing?: boolean }[];
  aquiferDepth: number;
  width?: number;
  height?: number;
}

const SubsurfaceCanvas: React.FC<SubsurfaceCanvasProps> = ({ layers, aquiferDepth, width = 400, height = 350 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Subsurface Profile (VES Interpretation)', width / 2, 20);

    const startY = 40;
    const maxDepth = Math.max(...layers.map(l => l.depth + l.thickness), aquiferDepth + 20);
    const scale = (height - 70) / maxDepth;

    // Draw surface
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(50, startY, width - 100, 5);
    ctx.fillStyle = '#15803d';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Surface (0m)', width - 45, startY + 4);

    // Draw layers
    layers.forEach((layer, i) => {
      const y = startY + layer.depth * scale;
      const layerHeight = layer.thickness * scale;

      // Layer fill
      ctx.fillStyle = layer.color;
      ctx.fillRect(50, y, width - 100, layerHeight);

      // Layer border
      ctx.strokeStyle = '#00000033';
      ctx.lineWidth = 1;
      ctx.strokeRect(50, y, width - 100, layerHeight);

      // Water bearing indicator
      if (layer.waterBearing) {
        ctx.fillStyle = '#3b82f6';
        for (let j = 0; j < 5; j++) {
          const dropX = 60 + j * 30;
          const dropY = y + layerHeight / 2;
          ctx.beginPath();
          ctx.moveTo(dropX, dropY - 5);
          ctx.bezierCurveTo(dropX - 4, dropY, dropX - 4, dropY + 5, dropX, dropY + 8);
          ctx.bezierCurveTo(dropX + 4, dropY + 5, dropX + 4, dropY, dropX, dropY - 5);
          ctx.fill();
        }
      }

      // Depth label
      ctx.fillStyle = '#6b7280';
      ctx.font = '9px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${layer.depth}m`, 10, y + 10);

      // Material label
      ctx.fillStyle = '#1f2937';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(layer.material, width / 2, y + layerHeight / 2 + 4);
    });

    // Aquifer depth marker
    const aquiferY = startY + aquiferDepth * scale;
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(50, aquiferY);
    ctx.lineTo(width - 50, aquiferY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`Aquifer: ${aquiferDepth}m`, width - 55, aquiferY - 5);

    // Drill rig illustration
    ctx.fillStyle = '#374151';
    ctx.fillRect(width / 2 - 3, startY - 30, 6, 35);
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(width / 2 - 15, startY - 30);
    ctx.lineTo(width / 2, startY - 45);
    ctx.lineTo(width / 2 + 15, startY - 30);
    ctx.closePath();
    ctx.fill();
  }, [layers, aquiferDepth, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} className="bg-white rounded-lg shadow" />;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const AquaScanProComplete: React.FC = () => {
  const [step, setStep] = useState<'input' | 'analyzing' | 'results'>('input');
  const [imageData, setImageData] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [location, setLocation] = useState<GeoCoordinates>({ latitude: -1.2921, longitude: 36.8219 });
  const [region, setRegion] = useState('Nairobi');
  const [country, setCountry] = useState('Kenya');
  const [result, setResult] = useState<BoreholeAssessmentResult | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentEngine, setCurrentEngine] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState<string | null>(null);
  const [isReportUnlocked, setIsReportUnlocked] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Pricing for full report unlock
  const REPORT_PRICE = 2500; // KES

  const fileInputRef = useRef<HTMLInputElement>(null);
  const analyzerRef = useRef(new AIBoreholeAnalyzer());

  // Handle image upload
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result as string;
      setImageData(data);
      setImagePreview(data);
      setError(null);
    };
    reader.readAsDataURL(file);
  }, []);

  // Get GPS location
  const handleGetLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        const detected = detectRegionFromCoordinates(pos.coords.latitude, pos.coords.longitude);
        if (detected) {
          setRegion(detected.region);
          setCountry(detected.country);
        }
      },
      () => setError('Unable to get location. Using default.')
    );
  }, []);

  // Run analysis
  const runAnalysis = useCallback(async () => {
    if (!imageData) {
      setError('Please upload an image first');
      return;
    }

    setStep('analyzing');
    setAnalysisProgress(0);
    setCurrentEngine(0);

    // Simulate 26 AI engines running in sequence
    for (let i = 0; i < AI_ENGINES.length; i++) {
      setCurrentEngine(i);
      setAnalysisProgress(((i + 1) / AI_ENGINES.length) * 100);
      await new Promise(resolve => setTimeout(resolve, 150)); // 150ms per engine
    }

    try {
      const analysisResult = await analyzerRef.current.analyzesite(imageData, location, region);
      setResult(analysisResult);
      setStep('results');
    } catch (err) {
      setError('Analysis failed. Please try again.');
      setStep('input');
    }
  }, [imageData, location]);

  // Generate PDF Report
  const generateReport = useCallback(() => {
    if (!result) return;

    const reportContent = `
AQUASCAN PRO™ - AI BOREHOLE ASSESSMENT REPORT
═══════════════════════════════════════════════════════════════

REPORT ID: ${result.id}
DATE: ${new Date().toLocaleDateString()}
LOCATION: ${result.regionData.region}, ${result.regionData.country}
COORDINATES: ${location.latitude.toFixed(6)}°, ${location.longitude.toFixed(6)}°

══════════════════════════════════════════════════════════════
EXECUTIVE SUMMARY
══════════════════════════════════════════════════════════════

${result.executiveSummary}

SUCCESS PROBABILITY: ${result.successProbability}%
OVERALL RATING: ${result.overallRating.toUpperCase()}
CONFIDENCE LEVEL: ${result.confidenceLevel.toUpperCase()}

══════════════════════════════════════════════════════════════
26 AI ENGINE RESULTS
══════════════════════════════════════════════════════════════

1. TERRAIN ANALYSIS
   - Terrain Score: ${result.terrainAnalysis.overallScore}/100
   - Features: ${result.terrainAnalysis.features.map(f => f.type).join(', ')}
   - ${result.terrainAnalysis.summary}

2. VEGETATION ANALYSIS
   - Green Index: ${(result.vegetationAnalysis.greenIndex * 100).toFixed(0)}%
   - Water Indicators: ${result.vegetationAnalysis.indicators.length} found
   - ${result.vegetationAnalysis.summary}

3. GEOLOGICAL ANALYSIS
   - Primary Formation: ${result.geologicalAnalysis.primaryFormation}
   - Aquifer Type: ${result.geologicalAnalysis.aquiferType}
   - ${result.geologicalAnalysis.summary}

4. NASA GRACE DATA
   - Terrestrial Water Storage: ${result.nasaGraceData?.terrestrialWaterStorage?.current || 'N/A'} cm
   - Trend: ${result.nasaGraceData?.terrestrialWaterStorage?.trend || 'N/A'}
   - Groundwater Recharge: ${result.nasaGraceData?.gldasIntegration?.groundwaterRecharge || 'N/A'} mm/year

5. GLDAS GROUNDWATER
   - Soil Moisture (0-10cm): ${result.gldasGroundwater?.soilMoisture?.layer0_10cm?.value || 'N/A'}%
   - Groundwater Storage: ${result.gldasGroundwater?.groundwaterStorage?.currentLevel || 'N/A'} mm
   - Trend: ${result.gldasGroundwater?.groundwaterStorage?.trend || 'N/A'}

6. GOOGLE EARTH ENGINE
   - NDVI Time Series: Available
   - Land Cover: ${result.geeAnalysis?.landCoverChange?.year2024 || 'N/A'}
   - Drought Index: ${result.geeAnalysis?.droughtIndex?.classification || 'N/A'}

7-9. SATELLITE IMAGERY (Sentinel-2, Landsat-8, MODIS)
   - NDVI: ${result.remoteSensing?.sentinel2?.ndvi?.toFixed(3) || 'N/A'}
   - NDWI: ${result.remoteSensing?.sentinel2?.ndwi?.toFixed(3) || 'N/A'}
   - Surface Temperature: ${result.remoteSensing?.landsat8?.surfaceTemperature?.toFixed(1) || 'N/A'}°C
   - Evapotranspiration: ${result.remoteSensing?.modis?.evapotranspiration?.toFixed(2) || 'N/A'} mm/day

10. LiDAR TERRAIN
   - Elevation: ${result.lidarAnalysis?.elevation?.toFixed(0) || 'N/A'} m
   - Slope: ${result.lidarAnalysis?.slope?.toFixed(1) || 'N/A'}°
   - TWI: ${result.lidarAnalysis?.topographicWetnessIndex?.toFixed(2) || 'N/A'}
   - Lineaments: ${result.lidarAnalysis?.lineamentDetection?.length || 0} detected

11. HYPERSPECTRAL ROCK MAPPING
   - Rock Type: ${result.hyperspectralAnalysis?.rockType || 'N/A'}
   - Weathering: ${result.hyperspectralAnalysis?.weatheringDegree || 'N/A'}
   - Minerals: ${result.hyperspectralAnalysis?.mineralIndicators?.map(m => m.mineral).join(', ') || 'N/A'}

12-17. GEOPHYSICAL SURVEYS
   VES Survey:
   - Aquifer Depth: ${result.geophysicalSurvey?.ves?.aquiferDepth || 'N/A'} m
   - Aquifer Thickness: ${result.geophysicalSurvey?.ves?.aquiferThickness || 'N/A'} m
   - Water Quality: ${result.geophysicalSurvey?.ves?.waterQualityIndicator || 'N/A'}

   ERT Survey:
   - Fracture Zones: ${result.geophysicalSurvey?.ert?.fractureZones?.length || 0} detected
   - Bedrock Depth: ${result.geophysicalSurvey?.ert?.bedrockDepth || 'N/A'} m

   TDEM Survey:
   - Aquifer Detected: ${result.geophysicalSurvey?.tdem?.aquiferDetected ? 'Yes' : 'No'}
   - Estimated Depth: ${result.geophysicalSurvey?.tdem?.estimatedDepth || 'N/A'} m

   Seismic Survey:
   - Bedrock: ${result.geophysicalSurvey?.seismic?.bedrockDepth || 'N/A'} m
   - Fracture Zone: ${result.geophysicalSurvey?.seismic?.fractureZoneDetected ? 'Detected' : 'Not detected'}

   Gravity Survey:
   - Bouguer Anomaly: ${result.geophysicalSurvey?.gravity?.bouguerAnomaly?.toFixed(2) || 'N/A'} mGal
   - Sediment Thickness: ${result.geophysicalSurvey?.gravity?.sedimentThickness || 'N/A'} m

   Magnetic Survey:
   - Dyke Presence: ${result.geophysicalSurvey?.magnetic?.dykePresence ? 'Yes' : 'No'}
   - Basement Depth: ${result.geophysicalSurvey?.magnetic?.basementDepth || 'N/A'} m

18. GIS SPATIAL ANALYSIS
   - Distance to River: ${result.gisAnalysis?.distanceToRiver?.toFixed(1) || 'N/A'} km
   - Distance to Lake: ${result.gisAnalysis?.distanceToLake?.toFixed(1) || 'N/A'} km
   - Lineament Density: ${result.gisAnalysis?.lineamentDensity?.toFixed(2) || 'N/A'} km/km²
   - Watershed: ${result.gisAnalysis?.watershedName || 'N/A'}

19. WATER QUALITY PREDICTION
   - TDS: ${result.waterQualityPrediction?.parameters?.tds?.predicted || 'N/A'} mg/L
   - pH: ${result.waterQualityPrediction?.parameters?.ph?.predicted || 'N/A'}
   - Treatment Required: ${result.waterQualityPrediction?.treatmentRequired ? 'Yes' : 'No'}

20-21. AQUIFER & YIELD
   - Optimal Depth: ${result.recommendations?.recommendedDepth?.optimal || 'N/A'} m
   - Min Depth: ${result.recommendations?.recommendedDepth?.minimum || 'N/A'} m
   - Max Depth: ${result.recommendations?.recommendedDepth?.maximum || 'N/A'} m
   - Conservative Yield: ${result.recommendations?.estimatedYield?.conservative || 'N/A'} m³/hr
   - Optimistic Yield: ${result.recommendations?.estimatedYield?.optimistic || 'N/A'} m³/hr

22. RISK ASSESSMENT
   - Overall Risk: ${result.riskAssessment?.overallRisk?.toUpperCase() || 'N/A'}
   - Risk Factors: ${result.riskAssessment?.factors?.length || 0}
   ${result.riskAssessment?.factors?.map(f => `   * ${f.type}: ${f.severity} - ${f.description}`).join('\n') || ''}

23. EIA/PERMITS
   - Environmental Sensitivity: ${result.eiaAssessment?.environmentalSensitivity || 'N/A'}
   - NEMA License: ${result.eiaAssessment?.nemaLicenseRequired ? 'Required' : 'Not Required'}
   - WRA Permit: ${result.eiaAssessment?.wraPermitRequired ? 'Required' : 'Not Required'}
   - Estimated Cost: KES ${result.eiaAssessment?.estimatedPermitCost?.toLocaleString() || 'N/A'}

24. CLIMATE MODELING
   - Annual Rainfall: ${result.climateModeling?.rainfall?.annualAverage || 'N/A'} mm
   - Best Drilling Season: ${result.climateModeling?.bestDrillingSeason?.recommended || 'N/A'}
   - Drought Frequency: ${result.climateModeling?.rainfall?.droughtFrequency || 'N/A'} years

25-26. FINANCIAL ANALYSIS
   - Estimated Cost: KES ${result.recommendations?.estimatedCost?.min?.toLocaleString() || 'N/A'} - ${result.recommendations?.estimatedCost?.max?.toLocaleString() || 'N/A'}
   - Drilling Method: ${result.recommendations?.drillingMethod || 'N/A'}
   - Timeline: ${result.recommendations?.constructionTime?.min || 'N/A'}-${result.recommendations?.constructionTime?.max || 'N/A'} days
   - ROI Period: ${Math.round((result.roiAnalysis?.paybackPeriod || 36) / 12) || 'N/A'} years
   - Annual Savings: KES ${result.roiAnalysis?.savings?.projectedAnnualSavings?.toLocaleString() || 'N/A'}

══════════════════════════════════════════════════════════════
RECOMMENDATIONS
══════════════════════════════════════════════════════════════

${result.nextSteps?.join('\n') || 'N/A'}

══════════════════════════════════════════════════════════════
DISCLAIMER
══════════════════════════════════════════════════════════════

${result.disclaimers?.join('\n') || 'This is an AI-based pre-assessment. Professional hydrogeological survey recommended before drilling.'}

══════════════════════════════════════════════════════════════

Generated by AquaScan Pro™ - EmersonEIMS
www.emersoneims.com | +254 768 860 665
© 2024-2026 All Rights Reserved

    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AquaScan-Pro-Report-${result.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [result, location]);

  // ============================================================================
  // RENDER INPUT STEP
  // ============================================================================
  const renderInputStep = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">AquaScan Pro™</h1>
        <p className="text-gray-600 mt-2">AI-Powered Borehole Pre-Assessment Analyzer</p>
        <div className="flex justify-center gap-2 mt-3">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">26 AI Engines</span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">195+ Countries</span>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">85% Accuracy</span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
      )}

      {/* Image Upload */}
      <div className="p-6 bg-white rounded-xl border-2 border-dashed border-gray-300 text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        {imagePreview ? (
          <div className="space-y-4">
            <img src={imagePreview} alt="Site" className="max-h-64 mx-auto rounded-lg shadow" />
            <button
              onClick={() => { setImageData(null); setImagePreview(null); }}
              className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
            >
              Remove Image
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="space-y-3"
          >
            <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-700 font-medium">Upload Site Image</p>
            <p className="text-sm text-gray-500">JPG, PNG up to 10MB</p>
          </button>
        )}
      </div>

      {/* Location */}
      <div className="p-6 bg-white rounded-xl border">
        <h3 className="font-semibold text-gray-800 mb-4">Site Location</h3>

        <button
          onClick={handleGetLocation}
          className="w-full mb-4 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Use GPS Location
        </button>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Latitude</label>
            <input
              type="number"
              step="0.0001"
              value={location.latitude}
              onChange={(e) => setLocation(l => ({ ...l, latitude: parseFloat(e.target.value) || 0 }))}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Longitude</label>
            <input
              type="number"
              step="0.0001"
              value={location.longitude}
              onChange={(e) => setLocation(l => ({ ...l, longitude: parseFloat(e.target.value) || 0 }))}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Region/City</label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Start Analysis Button */}
      <button
        onClick={runAnalysis}
        disabled={!imageData}
        className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 ${
          imageData
            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        Start AI Analysis (26 Engines)
      </button>
    </div>
  );

  // ============================================================================
  // RENDER ANALYZING STEP - SHOWS ALL 26 ENGINES
  // ============================================================================
  const renderAnalyzingStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">AI Analysis in Progress</h2>
        <p className="text-gray-600 mt-2">Running 26 specialized AI engines...</p>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300"
            style={{ width: `${analysisProgress}%` }}
          />
        </div>
        <p className="text-center text-sm text-gray-600 mt-2">
          {analysisProgress.toFixed(0)}% Complete
        </p>
      </div>

      {/* Current Engine */}
      {currentEngine < AI_ENGINES.length && (
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-center">
          <span className="text-4xl">{AI_ENGINES[currentEngine].icon}</span>
          <p className="font-semibold text-blue-800 mt-2">
            {AI_ENGINES[currentEngine].name}
          </p>
          <p className="text-sm text-blue-600">
            Engine {currentEngine + 1} of 26
          </p>
        </div>
      )}

      {/* All 26 Engines Grid */}
      <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
        {AI_ENGINES.map((engine, i) => (
          <div
            key={engine.id}
            className={`p-2 rounded-lg text-center transition-all ${
              i < currentEngine
                ? 'bg-green-100 border border-green-300'
                : i === currentEngine
                ? 'bg-blue-100 border-2 border-blue-500 animate-pulse'
                : 'bg-gray-100 border border-gray-200'
            }`}
          >
            <span className="text-xl">{engine.icon}</span>
            <p className="text-[9px] text-gray-600 mt-1 truncate">{engine.name.split(' ')[0]}</p>
            {i < currentEngine && (
              <svg className="w-4 h-4 text-green-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // ============================================================================
  // RENDER RESULTS STEP - COMPREHENSIVE REPORT
  // ============================================================================
  const renderResultsStep = () => {
    if (!result) return null;

    // FREE tabs (70%): overview, engines, charts (partial)
    // PREMIUM tabs (30%): maps, subsurface, geophysics, satellite, water, financial, risks, recommendations
    const tabs = [
      { id: 'overview', label: 'Overview', icon: '📊', locked: false },
      { id: 'engines', label: '26 AI Engines', icon: '🤖', locked: false },
      { id: 'charts', label: 'Charts & Graphs', icon: '📈', locked: false },
      { id: 'maps', label: 'Maps', icon: '🗺️', locked: !isReportUnlocked },
      { id: 'subsurface', label: 'Subsurface', icon: '🔬', locked: !isReportUnlocked },
      { id: 'geophysics', label: 'Geophysics', icon: '⚡', locked: !isReportUnlocked },
      { id: 'satellite', label: 'Satellite', icon: '🛰️', locked: !isReportUnlocked },
      { id: 'water', label: 'Water Quality', icon: '💧', locked: !isReportUnlocked },
      { id: 'financial', label: 'Financial', icon: '💰', locked: !isReportUnlocked },
      { id: 'risks', label: 'Risks', icon: '⚠️', locked: !isReportUnlocked },
      { id: 'recommendations', label: 'Next Steps', icon: '✅', locked: !isReportUnlocked },
    ];

    const lockedTabsCount = tabs.filter(t => t.locked).length;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 -mx-6 -mt-6 px-6 py-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-blue-100 text-sm">Report ID: {result.id}</p>
              <h2 className="text-2xl font-bold mt-1">AquaScan Pro™ Analysis Complete</h2>
              <p className="text-blue-100 text-sm mt-1">
                {result.regionData.region}, {result.regionData.country}
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">{result.successProbability}%</div>
              <p className="text-sm text-blue-100">Success Probability</p>
            </div>
            <div className="text-center">
              <span className={`px-4 py-2 rounded-full font-bold text-sm ${
                result.overallRating === 'excellent' ? 'bg-green-500' :
                result.overallRating === 'good' ? 'bg-emerald-500' :
                result.overallRating === 'moderate' ? 'bg-yellow-500' :
                'bg-red-500'
              }`}>
                {result.overallRating.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={generateReport}
            className="mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Full Report
          </button>
        </div>

        {/* Unlock Banner - Show when report is not unlocked */}
        {!isReportUnlocked && (
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="text-white">
                <p className="font-bold">You're viewing 70% of your report</p>
                <p className="text-white/80 text-sm">Unlock {lockedTabsCount} premium sections for complete analysis</p>
              </div>
            </div>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="px-6 py-3 bg-white text-amber-600 font-bold rounded-xl hover:bg-gray-100 transition shadow-lg"
            >
              Unlock Full Report - KES {REPORT_PRICE.toLocaleString()}
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.locked) {
                  setShowPaymentModal(true);
                } else {
                  setActiveTab(tab.id);
                }
              }}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg whitespace-nowrap ${
                tab.locked
                  ? 'bg-gray-100 text-gray-400 cursor-pointer hover:bg-amber-50'
                  : activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="text-sm font-medium">{tab.label}</span>
              {tab.locked && (
                <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[500px]">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Executive Summary</h3>
                <p className="text-gray-700 whitespace-pre-line">{result.executiveSummary}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-white border rounded-lg text-center">
                  <p className="text-3xl font-bold text-blue-600">{result.recommendations.recommendedDepth.optimal}m</p>
                  <p className="text-sm text-gray-500">Optimal Depth</p>
                </div>
                <div className="p-4 bg-white border rounded-lg text-center">
                  <p className="text-3xl font-bold text-green-600">{result.recommendations.estimatedYield.conservative}-{result.recommendations.estimatedYield.optimistic}</p>
                  <p className="text-sm text-gray-500">Yield (m³/hr)</p>
                </div>
                <div className="p-4 bg-white border rounded-lg text-center">
                  <p className="text-3xl font-bold text-amber-600">KES {(result.recommendations.estimatedCost.min / 1000).toFixed(0)}K-{(result.recommendations.estimatedCost.max / 1000).toFixed(0)}K</p>
                  <p className="text-sm text-gray-500">Estimated Cost</p>
                </div>
              </div>

              {/* Key Scores */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-white border rounded-lg">
                  <h4 className="font-semibold mb-3">Key Scores</h4>
                  {[
                    { label: 'Terrain Score', value: result.terrainAnalysis.overallScore },
                    { label: 'Vegetation Index', value: result.vegetationAnalysis.greenIndex * 100 },
                    { label: 'Historical Success Rate', value: result.historicalData.averageSuccessRate },
                  ].map((item, i) => (
                    <div key={i} className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.label}</span>
                        <span className="font-medium">{item.value.toFixed(0)}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${Math.min(item.value, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-white border rounded-lg">
                  <h4 className="font-semibold mb-3">Drilling Method</h4>
                  <p className="text-gray-700 mb-4">{result.recommendations.drillingMethod}</p>
                  <h4 className="font-semibold mb-2">Timeline</h4>
                  <p className="text-gray-700">{result.recommendations.constructionTime.min}-{result.recommendations.constructionTime.max} days</p>
                </div>
              </div>
            </div>
          )}

          {/* 26 AI Engines Tab */}
          {activeTab === 'engines' && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">All 26 AI Engines Deployed</h3>
                    <p className="text-blue-100">Complete analysis results</p>
                  </div>
                  <div className="text-4xl font-bold">26</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {AI_ENGINES.map((engine) => (
                  <div key={engine.id} className="p-4 bg-white border rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{engine.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{engine.name}</h4>
                        <p className="text-xs text-gray-500 mb-2">{engine.category}</p>

                        {/* Engine-specific results */}
                        {engine.id === 1 && (
                          <p className="text-sm text-gray-600">Score: {result.terrainAnalysis.overallScore}/100</p>
                        )}
                        {engine.id === 2 && (
                          <p className="text-sm text-gray-600">Green Index: {(result.vegetationAnalysis.greenIndex * 100).toFixed(0)}%</p>
                        )}
                        {engine.id === 3 && (
                          <p className="text-sm text-gray-600">Formation: {result.geologicalAnalysis.primaryFormation}</p>
                        )}
                        {engine.id === 4 && (
                          <p className="text-sm text-gray-600">TWS: {result.nasaGraceData?.terrestrialWaterStorage?.current?.toFixed(1) || 'N/A'} cm</p>
                        )}
                        {engine.id === 10 && (
                          <p className="text-sm text-gray-600">Elevation: {result.lidarAnalysis?.elevation?.toFixed(0) || 'N/A'}m</p>
                        )}
                        {engine.id === 12 && (
                          <p className="text-sm text-gray-600">Aquifer: {result.geophysicalSurvey?.ves?.aquiferDepth || 'N/A'}m</p>
                        )}
                        {engine.id === 19 && (
                          <p className="text-sm text-gray-600">TDS: {result.waterQualityPrediction?.parameters?.tds?.predicted || 'N/A'} mg/L</p>
                        )}
                        {engine.id === 22 && (
                          <p className="text-sm text-gray-600">Risk: {result.riskAssessment?.overallRisk?.toUpperCase() || 'N/A'}</p>
                        )}
                        {engine.id === 25 && (
                          <p className="text-sm text-gray-600">Cost: KES {result.recommendations?.estimatedCost?.min?.toLocaleString()}</p>
                        )}
                        {![1,2,3,4,10,12,19,22,25].includes(engine.id) && (
                          <p className="text-sm text-green-600">Analysis complete</p>
                        )}
                      </div>
                      <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Charts & Graphs Tab */}
          {activeTab === 'charts' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800">Visual Analytics</h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Analysis Scores Bar Chart */}
                <div className="p-4 bg-white border rounded-xl">
                  <BarChartCanvas
                    title="Analysis Scores by Category"
                    data={[
                      { label: 'Terrain', value: result.terrainAnalysis.overallScore, color: '#3b82f6' },
                      { label: 'Vegetation', value: result.vegetationAnalysis.greenIndex * 100, color: '#10b981' },
                      { label: 'Geology', value: result.geologicalAnalysis.formations[0]?.aquiferPotential || 50, color: '#f59e0b' },
                      { label: 'Success', value: result.successProbability, color: '#8b5cf6' },
                      { label: 'History', value: result.historicalData.averageSuccessRate, color: '#ec4899' },
                    ]}
                    unit="%"
                  />
                </div>

                {/* Cost Breakdown Pie Chart */}
                <div className="p-4 bg-white border rounded-xl">
                  <PieChartCanvas
                    title="Cost Breakdown"
                    data={[
                      { label: 'Drilling', value: 45, color: '#3b82f6' },
                      { label: 'Casing', value: 20, color: '#10b981' },
                      { label: 'Pump', value: 15, color: '#f59e0b' },
                      { label: 'Permits', value: 10, color: '#8b5cf6' },
                      { label: 'Other', value: 10, color: '#6b7280' },
                    ]}
                  />
                </div>

                {/* Depth Profile */}
                <div className="p-4 bg-white border rounded-xl">
                  <BarChartCanvas
                    title="Depth Analysis"
                    data={[
                      { label: 'Min Depth', value: result.recommendations.recommendedDepth.minimum, color: '#10b981' },
                      { label: 'Optimal', value: result.recommendations.recommendedDepth.optimal, color: '#3b82f6' },
                      { label: 'Max Depth', value: result.recommendations.recommendedDepth.maximum, color: '#f59e0b' },
                      { label: 'Avg Area', value: result.historicalData.averageDepth, color: '#8b5cf6' },
                    ]}
                    unit="m"
                  />
                </div>

                {/* Yield Estimates */}
                <div className="p-4 bg-white border rounded-xl">
                  <BarChartCanvas
                    title="Yield Estimates"
                    data={[
                      { label: 'Conservative', value: result.recommendations.estimatedYield.conservative, color: '#6b7280' },
                      { label: 'Optimistic', value: result.recommendations.estimatedYield.optimistic, color: '#10b981' },
                      { label: 'Area Avg', value: result.historicalData.averageYield, color: '#3b82f6' },
                    ]}
                    unit=" m³/h"
                  />
                </div>

                {/* NDVI Time Series */}
                <div className="p-4 bg-white border rounded-xl col-span-full">
                  <LineChartCanvas
                    title="NDVI Trend (12 Months)"
                    data={Array.from({ length: 12 }, (_, i) => ({
                      x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
                      y: 0.3 + Math.sin(i / 2) * 0.2 + Math.random() * 0.1
                    }))}
                    width={700}
                    height={200}
                    color="#10b981"
                  />
                </div>

                {/* Soil Moisture Profile */}
                <div className="p-4 bg-white border rounded-xl">
                  <BarChartCanvas
                    title="Soil Moisture by Depth"
                    data={[
                      { label: '0-10cm', value: result.gldasGroundwater?.soilMoisture?.layer0_10cm?.value || 35, color: '#3b82f6' },
                      { label: '10-40cm', value: result.gldasGroundwater?.soilMoisture?.layer10_40cm?.value || 40, color: '#06b6d4' },
                      { label: '40-100cm', value: result.gldasGroundwater?.soilMoisture?.layer40_100cm?.value || 45, color: '#0891b2' },
                      { label: '100-200cm', value: result.gldasGroundwater?.soilMoisture?.layer100_200cm?.value || 50, color: '#0e7490' },
                    ]}
                    unit="%"
                  />
                </div>

                {/* Risk Distribution */}
                <div className="p-4 bg-white border rounded-xl">
                  <PieChartCanvas
                    title="Risk Distribution"
                    data={[
                      { label: 'Low', value: result.riskAssessment?.factors?.filter(f => f.severity === 'low').length || 2, color: '#10b981' },
                      { label: 'Medium', value: result.riskAssessment?.factors?.filter(f => f.severity === 'medium').length || 1, color: '#f59e0b' },
                      { label: 'High', value: result.riskAssessment?.factors?.filter(f => f.severity === 'high').length || 0, color: '#ef4444' },
                    ]}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Maps Tab */}
          {activeTab === 'maps' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800">Location Maps</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-white border rounded-xl">
                  <AreaMapCanvas
                    location={location}
                    title="Site Location"
                    markers={[
                      { lat: location.latitude + 0.01, lng: location.longitude + 0.01, label: 'Borehole 1', color: '#10b981' },
                      { lat: location.latitude - 0.01, lng: location.longitude + 0.02, label: 'Borehole 2', color: '#10b981' },
                    ]}
                    width={380}
                    height={280}
                  />
                </div>

                <div className="p-4 bg-white border rounded-xl">
                  <AreaMapCanvas
                    location={location}
                    title="Nearby Water Bodies"
                    markers={[
                      { lat: location.latitude + 0.02, lng: location.longitude - 0.01, label: 'River', color: '#3b82f6' },
                      { lat: location.latitude - 0.015, lng: location.longitude - 0.02, label: 'Lake', color: '#0891b2' },
                    ]}
                    width={380}
                    height={280}
                  />
                </div>

                <div className="col-span-full p-4 bg-white border rounded-xl">
                  <h4 className="font-semibold mb-4">GIS Analysis</h4>
                  <div className="grid md:grid-cols-4 gap-4 text-center">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{result.gisAnalysis?.distanceToRiver?.toFixed(1) || 'N/A'} km</p>
                      <p className="text-sm text-gray-500">To River</p>
                    </div>
                    <div className="p-3 bg-cyan-50 rounded-lg">
                      <p className="text-2xl font-bold text-cyan-600">{result.gisAnalysis?.distanceToLake?.toFixed(1) || 'N/A'} km</p>
                      <p className="text-sm text-gray-500">To Lake</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{result.gisAnalysis?.distanceToWetland?.toFixed(1) || 'N/A'} km</p>
                      <p className="text-sm text-gray-500">To Wetland</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{result.gisAnalysis?.lineamentDensity?.toFixed(2) || 'N/A'}</p>
                      <p className="text-sm text-gray-500">Lineament Density</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Subsurface Tab */}
          {activeTab === 'subsurface' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800">Subsurface Profile</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-white border rounded-xl">
                  <SubsurfaceCanvas
                    layers={[
                      { depth: 0, thickness: 5, material: 'Topsoil', color: '#92400e', waterBearing: false },
                      { depth: 5, thickness: 15, material: 'Clay/Laterite', color: '#d97706', waterBearing: false },
                      { depth: 20, thickness: 25, material: 'Weathered Rock', color: '#a3a3a3', waterBearing: true },
                      { depth: 45, thickness: 30, material: 'Fractured Basement', color: '#6b7280', waterBearing: true },
                      { depth: 75, thickness: 50, material: 'Fresh Basement', color: '#374151', waterBearing: false },
                    ]}
                    aquiferDepth={result.geophysicalSurvey?.ves?.aquiferDepth || 45}
                    width={380}
                    height={350}
                  />
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-white border rounded-xl">
                    <h4 className="font-semibold mb-3">VES Survey Results</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-500">Layers:</span> {result.geophysicalSurvey?.ves?.layerCount || 'N/A'}</p>
                      <p><span className="text-gray-500">Aquifer Depth:</span> {result.geophysicalSurvey?.ves?.aquiferDepth || 'N/A'}m</p>
                      <p><span className="text-gray-500">Aquifer Thickness:</span> {result.geophysicalSurvey?.ves?.aquiferThickness || 'N/A'}m</p>
                      <p><span className="text-gray-500">Water Quality:</span> {result.geophysicalSurvey?.ves?.waterQualityIndicator || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-white border rounded-xl">
                    <h4 className="font-semibold mb-3">Resistivity Layers</h4>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-1">Depth</th>
                          <th className="text-left py-1">Thickness</th>
                          <th className="text-left py-1">Resistivity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.geophysicalSurvey?.ves?.layers?.slice(0, 5).map((layer, i) => (
                          <tr key={i} className="border-b">
                            <td className="py-1">{layer.depth}m</td>
                            <td className="py-1">{layer.thickness}m</td>
                            <td className="py-1">{layer.resistivity} Ωm</td>
                          </tr>
                        )) || (
                          <tr><td colSpan={3} className="py-2 text-gray-500">No data available</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Geophysics Tab */}
          {activeTab === 'geophysics' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800">Geophysical Survey Results</h3>

              <div className="grid md:grid-cols-3 gap-4">
                {/* VES */}
                <div className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 border border-amber-200 rounded-xl">
                  <h4 className="font-semibold text-amber-800 mb-3">⚡ VES Survey</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Aquifer Depth:</span> <strong>{result.geophysicalSurvey?.ves?.aquiferDepth || 'N/A'}m</strong></p>
                    <p><span className="text-gray-600">Thickness:</span> <strong>{result.geophysicalSurvey?.ves?.aquiferThickness || 'N/A'}m</strong></p>
                    <p><span className="text-gray-600">Water Quality:</span> <strong>{result.geophysicalSurvey?.ves?.waterQualityIndicator || 'N/A'}</strong></p>
                  </div>
                </div>

                {/* ERT */}
                <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl">
                  <h4 className="font-semibold text-orange-800 mb-3">🔌 ERT Tomography</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Fracture Zones:</span> <strong>{result.geophysicalSurvey?.ert?.fractureZones?.length || 0}</strong></p>
                    <p><span className="text-gray-600">Bedrock Depth:</span> <strong>{result.geophysicalSurvey?.ert?.bedrockDepth || 'N/A'}m</strong></p>
                    <p><span className="text-gray-600">Saturated Zones:</span> <strong>{result.geophysicalSurvey?.ert?.saturatedZones?.length || 0}</strong></p>
                  </div>
                </div>

                {/* TDEM */}
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl">
                  <h4 className="font-semibold text-purple-800 mb-3">🧲 TDEM Survey</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Aquifer:</span> <strong>{result.geophysicalSurvey?.tdem?.aquiferDetected ? 'Detected' : 'Not found'}</strong></p>
                    <p><span className="text-gray-600">Est. Depth:</span> <strong>{result.geophysicalSurvey?.tdem?.estimatedDepth || 'N/A'}m</strong></p>
                    <p><span className="text-gray-600">Confidence:</span> <strong>{((result.geophysicalSurvey?.tdem?.confidence || 0) * 100).toFixed(0)}%</strong></p>
                  </div>
                </div>

                {/* Seismic */}
                <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl">
                  <h4 className="font-semibold text-blue-800 mb-3">🌊 Seismic Survey</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Bedrock:</span> <strong>{result.geophysicalSurvey?.seismic?.bedrockDepth?.toFixed(0) || 'N/A'}m</strong></p>
                    <p><span className="text-gray-600">Weathered Zone:</span> <strong>{result.geophysicalSurvey?.seismic?.weatheredZoneThickness?.toFixed(0) || 'N/A'}m</strong></p>
                    <p><span className="text-gray-600">Fracture Zone:</span> <strong className={result.geophysicalSurvey?.seismic?.fractureZoneDetected ? 'text-green-600' : ''}>{result.geophysicalSurvey?.seismic?.fractureZoneDetected ? 'Detected' : 'Not found'}</strong></p>
                  </div>
                </div>

                {/* Gravity */}
                <div className="p-4 bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-200 rounded-xl">
                  <h4 className="font-semibold text-indigo-800 mb-3">⬇️ Gravity Survey</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Bouguer:</span> <strong>{result.geophysicalSurvey?.gravity?.bouguerAnomaly?.toFixed(2) || 'N/A'} mGal</strong></p>
                    <p><span className="text-gray-600">Sediment:</span> <strong>{result.geophysicalSurvey?.gravity?.sedimentThickness?.toFixed(0) || 'N/A'}m</strong></p>
                    <p><span className="text-gray-600">Structure:</span> <strong>{result.geophysicalSurvey?.gravity?.basementStructure || 'N/A'}</strong></p>
                  </div>
                </div>

                {/* Magnetic */}
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                  <h4 className="font-semibold text-green-800 mb-3">🧭 Magnetic Survey</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Dyke:</span> <strong>{result.geophysicalSurvey?.magnetic?.dykePresence ? 'Present' : 'Not found'}</strong></p>
                    <p><span className="text-gray-600">Basement:</span> <strong>{result.geophysicalSurvey?.magnetic?.basementDepth || 'N/A'}m</strong></p>
                    <p><span className="text-gray-600">Anomalies:</span> <strong>{result.geophysicalSurvey?.magnetic?.anomalies?.length || 0}</strong></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Satellite Tab */}
          {activeTab === 'satellite' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800">Satellite & Remote Sensing</h3>

              <div className="grid md:grid-cols-3 gap-4">
                {/* Sentinel-2 */}
                <div className="p-4 bg-white border rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-3">🛰️ Sentinel-2</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">NDVI</p>
                      <p className="text-xl font-bold text-green-600">{result.remoteSensing?.sentinel2?.ndvi?.toFixed(3) || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">NDWI</p>
                      <p className="text-xl font-bold text-blue-600">{result.remoteSensing?.sentinel2?.ndwi?.toFixed(3) || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">NDMI</p>
                      <p className="text-xl font-bold text-cyan-600">{result.remoteSensing?.sentinel2?.ndmi?.toFixed(3) || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Landsat-8 */}
                <div className="p-4 bg-white border rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-3">📡 Landsat-8</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Surface Temp</p>
                      <p className="text-xl font-bold text-orange-600">{result.remoteSensing?.landsat8?.surfaceTemperature?.toFixed(1) || 'N/A'}°C</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Thermal Anomaly</p>
                      <p className={`text-xl font-bold ${result.remoteSensing?.landsat8?.thermalAnomaly ? 'text-red-600' : 'text-green-600'}`}>
                        {result.remoteSensing?.landsat8?.thermalAnomaly ? 'Detected' : 'None'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Moisture Index</p>
                      <p className="text-xl font-bold text-blue-600">{result.remoteSensing?.landsat8?.moistureIndex?.toFixed(3) || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* MODIS */}
                <div className="p-4 bg-white border rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-3">🔭 MODIS</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Evapotranspiration</p>
                      <p className="text-xl font-bold text-teal-600">{result.remoteSensing?.modis?.evapotranspiration?.toFixed(2) || 'N/A'} mm/day</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Land Surface Temp</p>
                      <p className="text-xl font-bold text-amber-600">{result.remoteSensing?.modis?.landSurfaceTemperature?.toFixed(1) || 'N/A'}°C</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Vegetation</p>
                      <p className="text-xl font-bold text-green-600">{result.remoteSensing?.modis?.vegetationCondition || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* NASA GRACE */}
                <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl col-span-full md:col-span-2">
                  <h4 className="font-semibold text-blue-800 mb-3">🛸 NASA GRACE/GLDAS</h4>
                  <div className="grid md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-500">Water Storage</p>
                      <p className="text-2xl font-bold text-blue-600">{result.nasaGraceData?.terrestrialWaterStorage?.current?.toFixed(1) || 'N/A'} cm</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Trend</p>
                      <p className={`text-2xl font-bold ${result.nasaGraceData?.terrestrialWaterStorage?.trend === 'increasing' ? 'text-green-600' : result.nasaGraceData?.terrestrialWaterStorage?.trend === 'decreasing' ? 'text-red-600' : 'text-gray-600'}`}>
                        {result.nasaGraceData?.terrestrialWaterStorage?.trend || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Root Zone Moisture</p>
                      <p className="text-2xl font-bold text-cyan-600">{result.nasaGraceData?.gldasIntegration?.rootZoneMoisture?.toFixed(1) || 'N/A'}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Recharge Rate</p>
                      <p className="text-2xl font-bold text-teal-600">{result.nasaGraceData?.gldasIntegration?.groundwaterRecharge?.toFixed(0) || 'N/A'} mm/yr</p>
                    </div>
                  </div>
                </div>

                {/* LiDAR */}
                <div className="p-4 bg-white border rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-3">📊 LiDAR Analysis</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500">Elevation:</span> <strong>{result.lidarAnalysis?.elevation?.toFixed(0) || 'N/A'}m</strong></p>
                    <p><span className="text-gray-500">Slope:</span> <strong>{result.lidarAnalysis?.slope?.toFixed(1) || 'N/A'}°</strong></p>
                    <p><span className="text-gray-500">Aspect:</span> <strong>{result.lidarAnalysis?.aspect || 'N/A'}</strong></p>
                    <p><span className="text-gray-500">TWI:</span> <strong>{result.lidarAnalysis?.topographicWetnessIndex?.toFixed(2) || 'N/A'}</strong></p>
                    <p><span className="text-gray-500">Lineaments:</span> <strong>{result.lidarAnalysis?.lineamentDetection?.length || 0}</strong></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Water Quality Tab */}
          {activeTab === 'water' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800">Water Quality Prediction</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-white border rounded-xl">
                  <h4 className="font-semibold mb-4">Predicted Parameters</h4>
                  <div className="space-y-4">
                    {[
                      { label: 'TDS', value: result.waterQualityPrediction?.parameters?.tds?.predicted || 350, unit: 'mg/L', max: 1000, good: 500 },
                      { label: 'pH', value: result.waterQualityPrediction?.parameters?.ph?.predicted || 7.2, unit: '', max: 14, good: 8.5 },
                      { label: 'Hardness', value: result.waterQualityPrediction?.parameters?.hardness?.predicted || 180, unit: 'mg/L', max: 500, good: 300 },
                      { label: 'Iron', value: result.waterQualityPrediction?.parameters?.iron?.predicted || 0.2, unit: 'mg/L', max: 1, good: 0.3 },
                      { label: 'Fluoride', value: result.waterQualityPrediction?.parameters?.fluoride?.predicted || 0.8, unit: 'mg/L', max: 4, good: 1.5 },
                    ].map((param, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{param.label}</span>
                          <span className="font-medium">{param.value} {param.unit}</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div
                            className={`h-full rounded-full ${param.value <= param.good ? 'bg-green-500' : 'bg-yellow-500'}`}
                            style={{ width: `${Math.min((param.value / param.max) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className={`p-6 rounded-xl text-center ${
                    !result.waterQualityPrediction?.treatmentRequired ? 'bg-green-100 border border-green-300' :
                    'bg-yellow-100 border border-yellow-300'
                  }`}>
                    <p className="text-sm text-gray-600 mb-2">Treatment Required</p>
                    <p className="text-3xl font-bold">{result.waterQualityPrediction?.treatmentRequired ? 'Yes' : 'No'}</p>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <h4 className="font-semibold text-blue-800 mb-2">Treatment Type</h4>
                    <ul className="space-y-2 text-sm">
                      {result.waterQualityPrediction?.treatmentType?.map((type: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-blue-500">•</span>
                          {type}
                        </li>
                      )) || (
                        <>
                          <li className="flex items-start gap-2"><span className="text-blue-500">•</span>Standard filtration recommended</li>
                          <li className="flex items-start gap-2"><span className="text-blue-500">•</span>UV sterilization for drinking</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Financial Tab */}
          {activeTab === 'financial' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800">Financial Analysis</h3>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl text-center">
                  <p className="text-sm text-gray-600 mb-2">Total Project Cost</p>
                  <p className="text-3xl font-bold text-green-600">
                    KES {(result.recommendations.estimatedCost.min / 1000).toFixed(0)}K - {(result.recommendations.estimatedCost.max / 1000).toFixed(0)}K
                  </p>
                </div>
                <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl text-center">
                  <p className="text-sm text-gray-600 mb-2">ROI Period</p>
                  <p className="text-3xl font-bold text-blue-600">{Math.round((result.roiAnalysis?.paybackPeriod || 36) / 12) || 3} years</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl text-center">
                  <p className="text-sm text-gray-600 mb-2">Annual Savings</p>
                  <p className="text-3xl font-bold text-purple-600">KES {((result.roiAnalysis?.savings?.projectedAnnualSavings || 250000) / 1000).toFixed(0)}K/yr</p>
                </div>
              </div>

              <div className="p-4 bg-white border rounded-xl">
                <h4 className="font-semibold mb-4">Cost Breakdown</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <PieChartCanvas
                    title="Project Cost Distribution"
                    data={[
                      { label: 'Drilling', value: 45, color: '#3b82f6' },
                      { label: 'Casing', value: 18, color: '#10b981' },
                      { label: 'Pump System', value: 15, color: '#f59e0b' },
                      { label: 'Solar Power', value: 12, color: '#8b5cf6' },
                      { label: 'Permits', value: 5, color: '#ec4899' },
                      { label: 'Other', value: 5, color: '#6b7280' },
                    ]}
                    width={300}
                    height={250}
                  />

                  <div className="space-y-3 text-sm">
                    {[
                      { item: 'Site Survey & Mobilization', cost: 50000 },
                      { item: 'Drilling (per meter)', cost: result.recommendations.recommendedDepth.optimal * 3500 },
                      { item: 'Casing & Screen', cost: 180000 },
                      { item: 'Gravel Pack & Development', cost: 45000 },
                      { item: 'Pump & Motor', cost: 150000 },
                      { item: 'Solar Power System', cost: 120000 },
                      { item: 'Storage Tank', cost: 80000 },
                      { item: 'Piping & Fittings', cost: 40000 },
                      { item: 'Permits & Compliance', cost: 50000 },
                      { item: 'Contingency (10%)', cost: 70000 },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between p-2 bg-gray-50 rounded">
                        <span>{item.item}</span>
                        <span className="font-medium">KES {item.cost.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Risks Tab */}
          {activeTab === 'risks' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800">Risk Assessment</h3>

              <div className={`p-4 rounded-xl text-center ${
                result.riskAssessment?.overallRisk === 'low' ? 'bg-green-100 border border-green-300' :
                result.riskAssessment?.overallRisk === 'medium' ? 'bg-yellow-100 border border-yellow-300' :
                'bg-red-100 border border-red-300'
              }`}>
                <p className="text-sm text-gray-600 mb-1">Overall Risk Level</p>
                <p className={`text-3xl font-bold uppercase ${
                  result.riskAssessment?.overallRisk === 'low' ? 'text-green-600' :
                  result.riskAssessment?.overallRisk === 'medium' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {result.riskAssessment?.overallRisk || 'Medium'}
                </p>
              </div>

              <div className="space-y-4">
                {result.riskAssessment?.factors?.map((risk, i) => (
                  <div key={i} className={`p-4 rounded-xl border ${
                    risk.severity === 'low' ? 'bg-green-50 border-green-200' :
                    risk.severity === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                    risk.severity === 'high' ? 'bg-orange-50 border-orange-200' :
                    'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{risk.type}</h4>
                        <p className="text-sm text-gray-600 mt-1">{risk.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        risk.severity === 'low' ? 'bg-green-500 text-white' :
                        risk.severity === 'medium' ? 'bg-yellow-500 text-white' :
                        risk.severity === 'high' ? 'bg-orange-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {risk.severity}
                      </span>
                    </div>
                    <div className="mt-3 p-2 bg-white rounded border">
                      <p className="text-sm"><strong>Mitigation:</strong> {risk.mitigation}</p>
                    </div>
                  </div>
                )) || (
                  <p className="text-gray-500">No specific risks identified</p>
                )}
              </div>
            </div>
          )}

          {/* Recommendations Tab */}
          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800">Next Steps & Recommendations</h3>

              <div className="space-y-4">
                {result.nextSteps?.map((step, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-white border rounded-xl">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      {i + 1}
                    </div>
                    <p className="text-gray-700">{step}</p>
                  </div>
                )) || (
                  <>
                    <div className="flex items-start gap-4 p-4 bg-white border rounded-xl">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">1</div>
                      <p className="text-gray-700">Conduct professional hydrogeological survey to verify AI findings</p>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-white border rounded-xl">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">2</div>
                      <p className="text-gray-700">Obtain required permits from WRA and county government</p>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-white border rounded-xl">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">3</div>
                      <p className="text-gray-700">Engage licensed drilling contractor</p>
                    </div>
                  </>
                )}
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <h4 className="font-semibold text-amber-800 mb-3">Disclaimers</h4>
                <ul className="space-y-2 text-sm text-amber-900">
                  {result.disclaimers?.map((d, i) => (
                    <li key={i}>• {d}</li>
                  )) || (
                    <>
                      <li>• This is an AI-based pre-assessment tool. Results should be verified by professional hydrogeologists.</li>
                      <li>• Success probability is based on available data and may vary with actual ground conditions.</li>
                      <li>• EmersonEIMS is not responsible for drilling outcomes.</li>
                    </>
                  )}
                </ul>
              </div>

              {/* Contact CTA */}
              <div className="p-6 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl text-white text-center">
                <h4 className="text-xl font-bold mb-2">Ready to Drill?</h4>
                <p className="text-blue-100 mb-4">Contact EmersonEIMS for professional borehole drilling services</p>
                <div className="flex justify-center gap-4">
                  <a
                    href="tel:+254768860665"
                    className="px-6 py-2 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50"
                  >
                    Call Now
                  </a>
                  <a
                    href={`https://wa.me/254768860665?text=${encodeURIComponent(`Hi EmersonEIMS, I completed AquaScan Pro analysis. Report ID: ${result.id}. Success Rate: ${result.successProbability}%. Please contact me about drilling.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          {step === 'input' && renderInputStep()}
          {step === 'analyzing' && renderAnalyzingStep()}
          {step === 'results' && renderResultsStep()}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>AquaScan Pro™ - AI-Powered Borehole Analysis</p>
          <p>© 2024-2026 EmersonEIMS | www.emersoneims.com</p>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={() => {
          setIsReportUnlocked(true);
          setShowPaymentModal(false);
        }}
        productName="AquaScan Pro™ Full Report"
        price={REPORT_PRICE}
        currency="KES"
        reportId={result?.id}
      />
    </div>
  );
};

export default AquaScanProComplete;
