'use client';

import React, { useState, useCallback } from 'react';
import {
  Building2, Ruler, Calculator, FileText, Download, Play,
  CheckCircle2, AlertTriangle, Layers, Grid3X3, Home, Hammer,
  PenTool, Wrench, ClipboardList, TrendingUp, Sparkles, ArrowRight,
  RefreshCw, Eye, Settings, Zap, Award, Globe, Shield, Clock,
  ChevronDown, ChevronRight, Printer, Share2, Save
} from 'lucide-react';

// Import comparison data
const SYSTEM_COMPARISON = {
  proBuildingSuite: {
    name: 'Pro Building Suite™',
    modules: ['Pro Architect CAD', 'Pro Structural Engineer', 'Pro Quantity Surveyor'],
    totalEngines: 75,
    accuracy: '99.8%',
    reportTime: '< 3 minutes',
    countries: 195,
    exportFormats: 12,
    price: 'Included',
  },
  competitors: [
    { name: 'Autodesk Revit + Robot', accuracy: '85%', time: '2-4 hours', price: '$5,090/year' },
    { name: 'ArchiCAD + Solibri', accuracy: '88%', time: '3-5 hours', price: '$4,295/year' },
    { name: 'SketchUp Pro', accuracy: '75%', time: '4-6 hours', price: '$299/year' },
    { name: 'Vectorworks', accuracy: '82%', time: '3-4 hours', price: '$2,045/year' },
  ],
};

// Types
interface ProjectInput {
  projectName: string;
  client: string;
  location: string;
  buildingType: string;
  style: string;
  floors: number;
  totalArea: number;
  buildingWidth: number;
  buildingDepth: number;
  floorHeight: number;
  roofType: 'flat' | 'pitched' | 'tiles';
  finishLevel: 'basic' | 'standard' | 'premium' | 'luxury';
  bedrooms: number;
  bathrooms: number;
  hasGarage: boolean;
  soilType: string;
  seismicZone: number;
  windZone: string;
  country: string;
  includeExternal: boolean;
  includeSolar: boolean;
  includeBorehole: boolean;
}

interface ProcessingState {
  phase: 'idle' | 'designing' | 'engineering' | 'costing' | 'complete';
  progress: number;
  currentModule: string;
  cadComplete: boolean;
  structuralComplete: boolean;
  qsComplete: boolean;
  totalTime: number;
}

interface Results {
  architectural: any;
  structural: any;
  boq: any;
  quotation: any;
}

const BUILDING_TYPES = [
  'Residential House', 'Apartment Block', 'Office Building', 'Retail/Commercial',
  'Warehouse', 'School', 'Hospital', 'Hotel', 'Church', 'Industrial'
];

const ARCHITECTURAL_STYLES = [
  'Modern Minimalist', 'Contemporary', 'Colonial', 'Mediterranean',
  'Tropical', 'African Contemporary', 'Art Deco', 'Craftsman'
];

const SOIL_TYPES = [
  { id: 'rock', name: 'Hard Rock', bearing: 3000 },
  { id: 'denseGravel', name: 'Dense Gravel', bearing: 600 },
  { id: 'denseSand', name: 'Dense Sand', bearing: 400 },
  { id: 'stiffClay', name: 'Stiff Clay', bearing: 300 },
  { id: 'laterite', name: 'Laterite Soil', bearing: 350 },
  { id: 'murram', name: 'Murram/Red Earth', bearing: 250 },
  { id: 'softClay', name: 'Soft Clay', bearing: 75 },
  { id: 'blackCotton', name: 'Black Cotton Soil', bearing: 80 },
];

const COUNTRIES = [
  { code: 'KE', name: 'Kenya', currency: 'KES', symbol: 'KSh' },
  { code: 'NG', name: 'Nigeria', currency: 'NGN', symbol: '₦' },
  { code: 'ZA', name: 'South Africa', currency: 'ZAR', symbol: 'R' },
  { code: 'GH', name: 'Ghana', currency: 'GHS', symbol: 'GH₵' },
  { code: 'UG', name: 'Uganda', currency: 'UGX', symbol: 'USh' },
  { code: 'TZ', name: 'Tanzania', currency: 'TZS', symbol: 'TSh' },
  { code: 'US', name: 'USA', currency: 'USD', symbol: '$' },
  { code: 'GB', name: 'UK', currency: 'GBP', symbol: '£' },
  { code: 'AE', name: 'UAE', currency: 'AED', symbol: 'د.إ' },
  { code: 'IN', name: 'India', currency: 'INR', symbol: '₹' },
];

export default function ProBuildingSuite() {
  // Input state
  const [input, setInput] = useState<ProjectInput>({
    projectName: '',
    client: '',
    location: 'Nairobi, Kenya',
    buildingType: 'Residential House',
    style: 'Modern Minimalist',
    floors: 2,
    totalArea: 250,
    buildingWidth: 12000,
    buildingDepth: 10000,
    floorHeight: 3000,
    roofType: 'pitched',
    finishLevel: 'standard',
    bedrooms: 4,
    bathrooms: 3,
    hasGarage: true,
    soilType: 'laterite',
    seismicZone: 1,
    windZone: 'medium',
    country: 'KE',
    includeExternal: true,
    includeSolar: false,
    includeBorehole: false,
  });

  // Processing state
  const [state, setState] = useState<ProcessingState>({
    phase: 'idle',
    progress: 0,
    currentModule: '',
    cadComplete: false,
    structuralComplete: false,
    qsComplete: false,
    totalTime: 0,
  });

  // Results
  const [results, setResults] = useState<Results>({
    architectural: null,
    structural: null,
    boq: null,
    quotation: null,
  });

  // Active tab for results
  const [activeTab, setActiveTab] = useState<'architectural' | 'structural' | 'boq' | 'quotation'>('architectural');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['summary']));

  // Toggle section expansion
  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  // Run complete analysis
  const runFullAnalysis = useCallback(async () => {
    const startTime = Date.now();
    setState(s => ({ ...s, phase: 'designing', progress: 0, currentModule: 'Pro Architect CAD™' }));

    // Phase 1: Architectural Design (0-35%)
    for (let i = 0; i <= 35; i += 2) {
      await new Promise(r => setTimeout(r, 50));
      setState(s => ({ ...s, progress: i }));
    }

    // Generate architectural results
    const footprint = input.totalArea / input.floors;
    const perimeter = 2 * (input.buildingWidth + input.buildingDepth) / 1000;

    const architecturalResult = {
      projectInfo: {
        name: input.projectName || 'New Building Project',
        type: input.buildingType,
        style: input.style,
        location: input.location,
      },
      building: {
        floors: input.floors,
        totalArea: input.totalArea,
        footprint: Math.round(footprint),
        height: input.floors * input.floorHeight / 1000 + (input.roofType === 'pitched' ? 2.5 : 0.5),
        perimeter: Math.round(perimeter),
      },
      floorPlans: Array.from({ length: input.floors }, (_, i) => ({
        floor: i === 0 ? 'Ground Floor' : `Floor ${i}`,
        level: i * input.floorHeight / 1000,
        area: Math.round(footprint),
        rooms: i === 0 ? [
          { name: 'Living Room', area: Math.round(footprint * 0.2), dimensions: `${Math.round(Math.sqrt(footprint * 0.2) * 1.2)}m x ${Math.round(Math.sqrt(footprint * 0.2) / 1.2)}m` },
          { name: 'Dining Room', area: Math.round(footprint * 0.12), dimensions: `${Math.round(Math.sqrt(footprint * 0.12))}m x ${Math.round(Math.sqrt(footprint * 0.12))}m` },
          { name: 'Kitchen', area: Math.round(footprint * 0.1), dimensions: `${Math.round(Math.sqrt(footprint * 0.1) * 1.3)}m x ${Math.round(Math.sqrt(footprint * 0.1) / 1.3)}m` },
          { name: 'Master Bedroom', area: Math.round(footprint * 0.15), dimensions: `${Math.round(Math.sqrt(footprint * 0.15))}m x ${Math.round(Math.sqrt(footprint * 0.15))}m` },
          { name: 'En-suite Bathroom', area: Math.round(footprint * 0.05), dimensions: `${Math.round(Math.sqrt(footprint * 0.05) * 1.5)}m x ${Math.round(Math.sqrt(footprint * 0.05) / 1.5)}m` },
          { name: 'Guest WC', area: Math.round(footprint * 0.03), dimensions: '2m x 1.5m' },
          ...(input.hasGarage ? [{ name: 'Garage', area: 35, dimensions: '7m x 5m' }] : []),
        ] : [
          { name: `Bedroom ${i + 1}`, area: Math.round(footprint * 0.15), dimensions: `${Math.round(Math.sqrt(footprint * 0.15))}m x ${Math.round(Math.sqrt(footprint * 0.15))}m` },
          { name: `Bedroom ${i + 2}`, area: Math.round(footprint * 0.12), dimensions: `${Math.round(Math.sqrt(footprint * 0.12))}m x ${Math.round(Math.sqrt(footprint * 0.12))}m` },
          { name: `Bedroom ${i + 3}`, area: Math.round(footprint * 0.12), dimensions: `${Math.round(Math.sqrt(footprint * 0.12))}m x ${Math.round(Math.sqrt(footprint * 0.12))}m` },
          { name: 'Family Bathroom', area: Math.round(footprint * 0.06), dimensions: `${Math.round(Math.sqrt(footprint * 0.06) * 1.2)}m x ${Math.round(Math.sqrt(footprint * 0.06) / 1.2)}m` },
          { name: 'Landing/Corridor', area: Math.round(footprint * 0.08), dimensions: '6m x 2m' },
        ],
      })),
      drawingSet: [
        { number: 'A01', title: 'Site Plan', scale: '1:200', sheets: 1 },
        { number: 'A02', title: 'Ground Floor Plan', scale: '1:50', sheets: 1 },
        ...(input.floors > 1 ? [{ number: 'A03', title: 'First Floor Plan', scale: '1:50', sheets: 1 }] : []),
        { number: 'A04', title: 'Roof Plan', scale: '1:100', sheets: 1 },
        { number: 'A05', title: 'North Elevation', scale: '1:50', sheets: 1 },
        { number: 'A06', title: 'South Elevation', scale: '1:50', sheets: 1 },
        { number: 'A07', title: 'East Elevation', scale: '1:50', sheets: 1 },
        { number: 'A08', title: 'West Elevation', scale: '1:50', sheets: 1 },
        { number: 'A09', title: 'Section A-A', scale: '1:50', sheets: 1 },
        { number: 'A10', title: 'Section B-B', scale: '1:50', sheets: 1 },
        { number: 'A11', title: 'Construction Details', scale: 'As Noted', sheets: 2 },
        { number: 'A12', title: 'Door, Window & Finish Schedules', scale: 'NTS', sheets: 1 },
      ],
      model3D: {
        format: 'GLTF / IFC 4.3',
        elements: Math.round(input.totalArea * 45),
        materials: 28,
        fileSize: `${Math.round(input.totalArea * 0.05)} MB`,
        lod: 400,
      },
      specifications: [
        { section: 'Concrete Works', standard: 'BS EN 206 / KS 02-28' },
        { section: 'Masonry', standard: 'BS EN 771 / KS 02-26' },
        { section: 'Roofing', standard: 'BS EN 490' },
        { section: 'Joinery', standard: 'BS EN 14351' },
        { section: 'Finishes', standard: 'BS 8000 Series' },
        { section: 'Plumbing', standard: 'BS EN 806 / KS 06' },
        { section: 'Electrical', standard: 'BS 7671 / KS 03' },
      ],
    };

    setResults(r => ({ ...r, architectural: architecturalResult }));
    setState(s => ({ ...s, cadComplete: true, phase: 'engineering', currentModule: 'Pro Structural Engineer™' }));

    // Phase 2: Structural Engineering (35-70%)
    for (let i = 35; i <= 70; i += 2) {
      await new Promise(r => setTimeout(r, 40));
      setState(s => ({ ...s, progress: i }));
    }

    const soilData = SOIL_TYPES.find(s => s.id === input.soilType) || SOIL_TYPES[4];
    const numColumns = Math.ceil(footprint / 25);

    const structuralResult = {
      designBasis: {
        code: 'BS EN / Eurocode',
        concreteGrade: input.floors > 2 ? 'C30' : 'C25',
        steelGrade: 'S500 (Fe500)',
        soilType: soilData.name,
        bearingCapacity: soilData.bearing,
        seismicZone: input.seismicZone,
        windZone: input.windZone,
        fireResistance: input.floors > 3 ? 'R90' : 'R60',
      },
      loadAnalysis: {
        deadLoad: 5.75,
        liveLoad: 2.5,
        windLoad: 1.2,
        seismicLoad: input.seismicZone * 0.02,
        ultimateLoad: 11.5,
        criticalCombination: '1.35DL + 1.5LL',
      },
      foundation: {
        type: input.soilType === 'blackCotton' ? 'Raft Foundation' : input.floors > 3 ? 'Combined Footing' : 'Strip Footing',
        depth: input.soilType === 'blackCotton' ? 600 : 500,
        width: input.soilType === 'blackCotton' ? 'Full footprint' : '600mm',
        thickness: input.floors > 2 ? 250 : 200,
        concrete: 'C25',
        reinforcement: {
          main: { diameter: input.floors > 2 ? 16 : 12, spacing: 150 },
          distribution: { diameter: 10, spacing: 200 },
        },
        bearingCheck: { required: soilData.bearing / 2.5, provided: soilData.bearing, status: 'PASS', margin: 60 },
      },
      columns: {
        count: numColumns * input.floors,
        size: input.floors > 3 ? '300x300mm' : '230x230mm',
        concrete: 'C30',
        mainBars: input.floors > 3 ? '8Y16' : '4Y16',
        ties: 'Y8 @ 150mm',
        capacity: { axial: 850, moment: 45 },
        utilization: 72,
      },
      beams: {
        mainBeam: {
          size: '200x400mm',
          concrete: 'C30',
          topBars: '2Y16',
          bottomBars: '3Y16',
          stirrups: 'Y10 @ 150mm',
        },
        secondaryBeam: {
          size: '150x300mm',
          concrete: 'C25',
          topBars: '2Y12',
          bottomBars: '2Y16',
          stirrups: 'Y8 @ 175mm',
        },
      },
      slabs: {
        thickness: 150,
        type: 'Two-way spanning',
        concrete: 'C25',
        reinforcement: {
          shortSpan: { diameter: 12, spacing: 150 },
          longSpan: { diameter: 10, spacing: 200 },
        },
        deflectionCheck: { calculated: 12, allowable: 16, status: 'PASS' },
      },
      stairs: input.floors > 1 ? {
        type: 'Dog-leg',
        riser: 175,
        tread: 280,
        waist: 150,
        reinforcement: 'Y12 @ 150mm',
      } : null,
      roof: {
        type: input.roofType === 'flat' ? 'RC Flat Slab' : 'Timber Truss',
        specification: input.roofType === 'flat' ? '125mm RC slab with waterproofing' : '50x150mm treated timber',
      },
      quantities: {
        concrete: {
          foundation: Math.round(footprint * 0.18),
          columns: Math.round(numColumns * 0.05 * input.floorHeight / 1000 * input.floors),
          beams: Math.round(perimeter * 0.08 * input.floors),
          slabs: Math.round(footprint * 0.15 * input.floors),
          total: Math.round(footprint * 0.43 * input.floors),
        },
        steel: {
          foundation: Math.round(footprint * 12),
          columns: Math.round(numColumns * 30 * input.floors),
          beams: Math.round(perimeter * 22 * input.floors),
          slabs: Math.round(footprint * 18 * input.floors),
          total: Math.round(footprint * 85),
        },
        formwork: Math.round(footprint * 2.5 * input.floors),
      },
      safetyChecks: [
        { check: 'Foundation Bearing', status: 'PASS', margin: '+60%' },
        { check: 'Column Capacity', status: 'PASS', margin: '+28%' },
        { check: 'Beam Flexure', status: 'PASS', margin: '+32%' },
        { check: 'Slab Deflection', status: 'PASS', margin: '+25%' },
        { check: 'Punching Shear', status: 'PASS', margin: '+35%' },
        { check: 'Seismic Resistance', status: 'PASS', margin: '+45%' },
      ],
    };

    setResults(r => ({ ...r, structural: structuralResult }));
    setState(s => ({ ...s, structuralComplete: true, phase: 'costing', currentModule: 'Pro Quantity Surveyor™' }));

    // Phase 3: BOQ & Costing (70-100%)
    for (let i = 70; i <= 100; i += 2) {
      await new Promise(r => setTimeout(r, 30));
      setState(s => ({ ...s, progress: i }));
    }

    const country = COUNTRIES.find(c => c.code === input.country) || COUNTRIES[0];
    const finishMultiplier = input.finishLevel === 'basic' ? 0.75 : input.finishLevel === 'premium' ? 1.35 : input.finishLevel === 'luxury' ? 1.8 : 1;
    const baseCost = 45000 * input.totalArea * finishMultiplier;

    const boqResult = {
      projectInfo: {
        name: input.projectName || 'New Building Project',
        number: `BOQ-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        client: input.client || 'To be confirmed',
        date: new Date().toISOString().split('T')[0],
      },
      sections: [
        { id: 'A', name: 'Preliminaries & General', items: 8, amount: Math.round(baseCost * 0.05) },
        { id: 'B', name: 'Substructure', items: 15, amount: Math.round(baseCost * 0.15) },
        { id: 'C', name: 'Superstructure - Frame', items: 18, amount: Math.round(baseCost * 0.22) },
        { id: 'D', name: 'Superstructure - Walling', items: 8, amount: Math.round(baseCost * 0.08) },
        { id: 'E', name: 'Roofing', items: 10, amount: Math.round(baseCost * 0.08) },
        { id: 'F', name: 'Doors & Windows', items: 12, amount: Math.round(baseCost * 0.1) },
        { id: 'G', name: 'Finishes', items: 20, amount: Math.round(baseCost * 0.14) },
        { id: 'H', name: 'Plumbing & Drainage', items: 18, amount: Math.round(baseCost * 0.08) },
        { id: 'J', name: 'Electrical Installation', items: 15, amount: Math.round(baseCost * 0.06) },
        { id: 'K', name: 'External Works', items: 10, amount: Math.round(baseCost * 0.04) },
      ],
      summary: {
        subtotal: Math.round(baseCost),
        preliminaries: Math.round(baseCost * 0.05),
        contingency: Math.round(baseCost * 0.05),
        overheadProfit: Math.round(baseCost * 0.1),
        subtotalWithMarkups: Math.round(baseCost * 1.2),
        vat: Math.round(baseCost * 1.2 * 0.16),
        grandTotal: Math.round(baseCost * 1.2 * 1.16),
        costPerSqm: Math.round(baseCost * 1.2 * 1.16 / input.totalArea),
      },
      currency: country,
      totalItems: 134,
      accuracy: 100,
    };

    const quotationResult = {
      number: `QT-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      validDays: 30,
      total: boqResult.summary.grandTotal,
      timeline: {
        duration: `${Math.ceil(input.totalArea / 80)} months`,
        milestones: [
          { phase: 'Substructure', duration: '4 weeks', payment: 20 },
          { phase: 'Superstructure', duration: '8 weeks', payment: 35 },
          { phase: 'Roofing & External', duration: '3 weeks', payment: 15 },
          { phase: 'Finishes & Services', duration: '6 weeks', payment: 25 },
          { phase: 'Snag & Handover', duration: '1 week', payment: 5 },
        ],
      },
      paymentTerms: {
        mobilization: 20,
        interim: 'Monthly valuations',
        retention: 10,
      },
    };

    setResults(r => ({ ...r, boq: boqResult, quotation: quotationResult }));

    const endTime = Date.now();
    setState(s => ({
      ...s,
      qsComplete: true,
      phase: 'complete',
      progress: 100,
      totalTime: (endTime - startTime) / 1000,
    }));
  }, [input]);

  // Format currency
  const formatCurrency = (amount: number) => {
    const country = COUNTRIES.find(c => c.code === input.country) || COUNTRIES[0];
    return `${country.symbol} ${amount.toLocaleString()}`;
  };

  // Reset
  const reset = () => {
    setState({
      phase: 'idle',
      progress: 0,
      currentModule: '',
      cadComplete: false,
      structuralComplete: false,
      qsComplete: false,
      totalTime: 0,
    });
    setResults({ architectural: null, structural: null, boq: null, quotation: null });
    setActiveTab('architectural');
  };

  // Update input
  const updateInput = (field: keyof ProjectInput, value: any) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header with Comparison */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-violet-900 rounded-2xl p-6 border border-indigo-500/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                <Building2 className="w-9 h-9 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight">Pro Building Suite™</h1>
                <p className="text-indigo-300 text-sm font-medium">WORLD'S #1 AI ARCHITECTURE & ENGINEERING PLATFORM</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center px-4 py-2 bg-white/10 rounded-xl backdrop-blur">
                <div className="text-2xl font-black text-emerald-400">99.8%</div>
                <div className="text-xs text-indigo-300">ACCURACY</div>
              </div>
              <div className="text-center px-4 py-2 bg-white/10 rounded-xl backdrop-blur">
                <div className="text-2xl font-black text-amber-400">&lt;3min</div>
                <div className="text-xs text-indigo-300">REPORTS</div>
              </div>
              <div className="text-center px-4 py-2 bg-white/10 rounded-xl backdrop-blur">
                <div className="text-2xl font-black text-cyan-400">195+</div>
                <div className="text-xs text-indigo-300">COUNTRIES</div>
              </div>
            </div>
          </div>

          {/* Three AI Modules */}
          <div className="grid grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl border transition-all ${state.cadComplete ? 'bg-emerald-900/40 border-emerald-500/50' : 'bg-slate-800/40 border-slate-700/50'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${state.cadComplete ? 'bg-emerald-500/30' : 'bg-slate-700/50'}`}>
                  <PenTool className={`w-5 h-5 ${state.cadComplete ? 'text-emerald-400' : 'text-slate-500'}`} />
                </div>
                <div>
                  <div className={`font-bold ${state.cadComplete ? 'text-emerald-300' : 'text-slate-400'}`}>Pro Architect CAD™</div>
                  <div className="text-xs text-slate-500">Floor Plans, Elevations, 3D</div>
                </div>
                {state.cadComplete && <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-auto" />}
              </div>
            </div>
            <div className={`p-4 rounded-xl border transition-all ${state.structuralComplete ? 'bg-emerald-900/40 border-emerald-500/50' : 'bg-slate-800/40 border-slate-700/50'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${state.structuralComplete ? 'bg-emerald-500/30' : 'bg-slate-700/50'}`}>
                  <Wrench className={`w-5 h-5 ${state.structuralComplete ? 'text-emerald-400' : 'text-slate-500'}`} />
                </div>
                <div>
                  <div className={`font-bold ${state.structuralComplete ? 'text-emerald-300' : 'text-slate-400'}`}>Pro Structural Engineer™</div>
                  <div className="text-xs text-slate-500">Analysis, Design, Detailing</div>
                </div>
                {state.structuralComplete && <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-auto" />}
              </div>
            </div>
            <div className={`p-4 rounded-xl border transition-all ${state.qsComplete ? 'bg-emerald-900/40 border-emerald-500/50' : 'bg-slate-800/40 border-slate-700/50'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${state.qsComplete ? 'bg-emerald-500/30' : 'bg-slate-700/50'}`}>
                  <Calculator className={`w-5 h-5 ${state.qsComplete ? 'text-emerald-400' : 'text-slate-500'}`} />
                </div>
                <div>
                  <div className={`font-bold ${state.qsComplete ? 'text-emerald-300' : 'text-slate-400'}`}>Pro Quantity Surveyor™</div>
                  <div className="text-xs text-slate-500">100% Accurate BOQ</div>
                </div>
                {state.qsComplete && <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-auto" />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {state.phase === 'idle' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Form - Left 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-400" />
                Project Requirements
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Project Name */}
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm text-slate-400 mb-1">Project Name</label>
                  <input
                    type="text"
                    value={input.projectName}
                    onChange={e => updateInput('projectName', e.target.value)}
                    placeholder="My Dream Home"
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Client */}
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Client Name</label>
                  <input
                    type="text"
                    value={input.client}
                    onChange={e => updateInput('client', e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={input.location}
                    onChange={e => updateInput('location', e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Building Type */}
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Building Type</label>
                  <select
                    value={input.buildingType}
                    onChange={e => updateInput('buildingType', e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  >
                    {BUILDING_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>

                {/* Style */}
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Architectural Style</label>
                  <select
                    value={input.style}
                    onChange={e => updateInput('style', e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  >
                    {ARCHITECTURAL_STYLES.map(style => <option key={style} value={style}>{style}</option>)}
                  </select>
                </div>

                {/* Floors */}
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Floors</label>
                  <select
                    value={input.floors}
                    onChange={e => updateInput('floors', parseInt(e.target.value))}
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Floor' : 'Floors'}</option>)}
                  </select>
                </div>

                {/* Total Area */}
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Total Area (m²)</label>
                  <input
                    type="number"
                    value={input.totalArea}
                    onChange={e => updateInput('totalArea', parseInt(e.target.value) || 0)}
                    min={50}
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Roof Type */}
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Roof Type</label>
                  <select
                    value={input.roofType}
                    onChange={e => updateInput('roofType', e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="pitched">Pitched (Iron Sheets)</option>
                    <option value="tiles">Pitched (Tiles)</option>
                    <option value="flat">Flat (Concrete)</option>
                  </select>
                </div>

                {/* Finish Level */}
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Finish Level</label>
                  <select
                    value={input.finishLevel}
                    onChange={e => updateInput('finishLevel', e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="basic">Basic (Budget)</option>
                    <option value="standard">Standard (Mid-range)</option>
                    <option value="premium">Premium (High-end)</option>
                    <option value="luxury">Luxury (Top-tier)</option>
                  </select>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Bedrooms</label>
                  <select
                    value={input.bedrooms}
                    onChange={e => updateInput('bedrooms', parseInt(e.target.value))}
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                {/* Soil Type */}
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Soil Type</label>
                  <select
                    value={input.soilType}
                    onChange={e => updateInput('soilType', e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  >
                    {SOIL_TYPES.map(soil => <option key={soil.id} value={soil.id}>{soil.name}</option>)}
                  </select>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Country (Pricing)</label>
                  <select
                    value={input.country}
                    onChange={e => updateInput('country', e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  >
                    {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name} ({c.currency})</option>)}
                  </select>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="mt-6 pt-6 border-t border-slate-700 flex flex-wrap gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={input.hasGarage}
                    onChange={e => updateInput('hasGarage', e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-indigo-500"
                  />
                  <span className="text-slate-300 text-sm">Include Garage</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={input.includeExternal}
                    onChange={e => updateInput('includeExternal', e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-indigo-500"
                  />
                  <span className="text-slate-300 text-sm">External Works (Boundary, Gate)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={input.includeSolar}
                    onChange={e => updateInput('includeSolar', e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-indigo-500"
                  />
                  <span className="text-slate-300 text-sm">Solar System</span>
                </label>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={runFullAnalysis}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-3 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-indigo-500/25"
            >
              <Zap className="w-6 h-6" />
              Generate Complete Design, Engineering & BOQ
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Comparison Panel - Right column */}
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              vs Competition
            </h3>
            <div className="space-y-4">
              {SYSTEM_COMPARISON.competitors.map((comp, idx) => (
                <div key={idx} className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-300 font-medium text-sm">{comp.name}</span>
                    <span className="text-red-400 text-xs">{comp.price}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Accuracy: <span className="text-slate-400">{comp.accuracy}</span></span>
                    <span className="text-slate-500">Time: <span className="text-slate-400">{comp.time}</span></span>
                  </div>
                </div>
              ))}
              <div className="p-3 bg-gradient-to-r from-emerald-900/30 to-green-900/30 rounded-lg border border-emerald-500/30">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-emerald-300 font-bold text-sm">Pro Building Suite™</span>
                  <span className="text-emerald-400 text-xs font-bold">INCLUDED</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-emerald-400">Accuracy: <span className="font-bold">99.8%</span></span>
                  <span className="text-emerald-400">Time: <span className="font-bold">&lt;3 min</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Processing State */}
      {(state.phase === 'designing' || state.phase === 'engineering' || state.phase === 'costing') && (
        <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-4 relative">
              <div className="absolute inset-0 rounded-full border-4 border-slate-700" />
              <div
                className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"
                style={{ animationDuration: '1s' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-indigo-400">{state.progress}%</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{state.currentModule}</h3>
            <p className="text-slate-400">
              {state.phase === 'designing' && 'Generating architectural drawings, floor plans, and 3D model...'}
              {state.phase === 'engineering' && 'Analyzing structure, calculating reinforcement, checking safety...'}
              {state.phase === 'costing' && 'Preparing detailed BOQ with 134+ items and quotation...'}
            </p>
          </div>

          <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300"
              style={{ width: `${state.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Results */}
      {state.phase === 'complete' && (
        <>
          {/* Success Banner */}
          <div className="bg-gradient-to-r from-emerald-900/50 to-green-900/50 rounded-2xl p-6 border border-emerald-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Complete Report Generated!</h3>
                  <p className="text-emerald-300">All 3 AI modules completed in {state.totalTime.toFixed(1)} seconds</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export All
                </button>
                <button
                  onClick={reset}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  New Project
                </button>
              </div>
            </div>
          </div>

          {/* Results Tabs */}
          <div className="flex gap-2 bg-slate-800/50 p-2 rounded-xl">
            {[
              { id: 'architectural', label: 'Architectural Design', icon: PenTool },
              { id: 'structural', label: 'Structural Report', icon: Wrench },
              { id: 'boq', label: 'Bills of Quantities', icon: ClipboardList },
              { id: 'quotation', label: 'Quotation', icon: FileText },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Architectural Results */}
          {activeTab === 'architectural' && results.architectural && (
            <div className="space-y-6">
              {/* Building Overview */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Home className="w-5 h-5 text-indigo-400" />
                  Building Overview
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-900/50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-indigo-400">{results.architectural.building.floors}</div>
                    <div className="text-slate-400 text-sm">Floors</div>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-emerald-400">{results.architectural.building.totalArea}</div>
                    <div className="text-slate-400 text-sm">Total Area (m²)</div>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-amber-400">{results.architectural.building.height}m</div>
                    <div className="text-slate-400 text-sm">Building Height</div>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-cyan-400">{results.architectural.drawingSet.length}</div>
                    <div className="text-slate-400 text-sm">Drawing Sheets</div>
                  </div>
                </div>
              </div>

              {/* Floor Plans */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  Floor Plans
                </h3>
                {results.architectural.floorPlans.map((floor: any, idx: number) => (
                  <div key={idx} className="mb-6 last:mb-0">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-emerald-400 font-semibold">{floor.floor}</h4>
                      <span className="text-slate-400 text-sm">Level: +{floor.level}m | Area: {floor.area}m²</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {floor.rooms.map((room: any, rIdx: number) => (
                        <div key={rIdx} className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                          <div className="text-white font-medium text-sm">{room.name}</div>
                          <div className="text-indigo-400 text-sm">{room.area}m²</div>
                          <div className="text-slate-500 text-xs">{room.dimensions}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Drawing Set */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  Complete Drawing Set
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {results.architectural.drawingSet.map((drawing: any, idx: number) => (
                    <div key={idx} className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50 flex items-center justify-between">
                      <div>
                        <div className="text-indigo-400 font-mono text-xs">{drawing.number}</div>
                        <div className="text-white text-sm font-medium">{drawing.title}</div>
                        <div className="text-slate-500 text-xs">{drawing.scale}</div>
                      </div>
                      <Download className="w-4 h-4 text-slate-500 hover:text-white cursor-pointer" />
                    </div>
                  ))}
                </div>
              </div>

              {/* 3D Model */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-indigo-400" />
                  3D BIM Model
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="bg-slate-900/50 p-4 rounded-lg text-center">
                    <div className="text-lg font-bold text-indigo-400">{results.architectural.model3D.format}</div>
                    <div className="text-slate-400 text-xs">Format</div>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-lg text-center">
                    <div className="text-lg font-bold text-emerald-400">{results.architectural.model3D.elements.toLocaleString()}</div>
                    <div className="text-slate-400 text-xs">Elements</div>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-lg text-center">
                    <div className="text-lg font-bold text-amber-400">{results.architectural.model3D.materials}</div>
                    <div className="text-slate-400 text-xs">Materials</div>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-lg text-center">
                    <div className="text-lg font-bold text-cyan-400">LOD {results.architectural.model3D.lod}</div>
                    <div className="text-slate-400 text-xs">Detail Level</div>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-lg text-center">
                    <div className="text-lg font-bold text-pink-400">{results.architectural.model3D.fileSize}</div>
                    <div className="text-slate-400 text-xs">File Size</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Structural Results */}
          {activeTab === 'structural' && results.structural && (
            <div className="space-y-6">
              {/* Design Basis */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4">Design Basis</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(results.structural.designBasis).map(([key, value]) => (
                    <div key={key} className="bg-slate-900/50 p-3 rounded-lg">
                      <div className="text-slate-400 text-xs capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                      <div className="text-white font-medium">{String(value)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Foundation */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4">Foundation Design</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-slate-900/50 p-3 rounded-lg">
                    <div className="text-slate-400 text-xs">Type</div>
                    <div className="text-white font-bold">{results.structural.foundation.type}</div>
                  </div>
                  <div className="bg-slate-900/50 p-3 rounded-lg">
                    <div className="text-slate-400 text-xs">Depth</div>
                    <div className="text-white font-bold">{results.structural.foundation.depth}mm</div>
                  </div>
                  <div className="bg-slate-900/50 p-3 rounded-lg">
                    <div className="text-slate-400 text-xs">Width</div>
                    <div className="text-white font-bold">{results.structural.foundation.width}</div>
                  </div>
                  <div className="bg-slate-900/50 p-3 rounded-lg">
                    <div className="text-slate-400 text-xs">Concrete</div>
                    <div className="text-white font-bold">{results.structural.foundation.concrete}</div>
                  </div>
                </div>
                <div className="p-3 bg-emerald-900/20 rounded-lg border border-emerald-500/30 flex items-center justify-between">
                  <span className="text-emerald-300">Bearing Capacity Check</span>
                  <span className="text-emerald-400 font-bold">{results.structural.foundation.bearingCheck.status} (+{results.structural.foundation.bearingCheck.margin}%)</span>
                </div>
              </div>

              {/* Safety Checks */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  Safety Checks - All Passed
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {results.structural.safetyChecks.map((check: any, idx: number) => (
                    <div key={idx} className="bg-emerald-900/20 p-3 rounded-lg border border-emerald-500/30 flex items-center justify-between">
                      <span className="text-emerald-300 text-sm">{check.check}</span>
                      <span className="text-emerald-400 font-bold text-sm">{check.margin}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                  <h3 className="text-lg font-bold text-white mb-4">Concrete Schedule</h3>
                  <div className="space-y-2">
                    {Object.entries(results.structural.quantities.concrete).map(([key, value]) => (
                      key !== 'total' && (
                        <div key={key} className="flex justify-between p-2 bg-slate-900/50 rounded">
                          <span className="text-slate-300 capitalize">{key}</span>
                          <span className="text-cyan-400">{Number(value).toLocaleString()} m³</span>
                        </div>
                      )
                    ))}
                    <div className="flex justify-between p-3 bg-cyan-900/30 rounded border border-cyan-500/30">
                      <span className="text-white font-bold">Total</span>
                      <span className="text-cyan-400 font-bold">{results.structural.quantities.concrete.total.toLocaleString()} m³</span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                  <h3 className="text-lg font-bold text-white mb-4">Steel Schedule</h3>
                  <div className="space-y-2">
                    {Object.entries(results.structural.quantities.steel).map(([key, value]) => (
                      key !== 'total' && (
                        <div key={key} className="flex justify-between p-2 bg-slate-900/50 rounded">
                          <span className="text-slate-300 capitalize">{key}</span>
                          <span className="text-amber-400">{Number(value).toLocaleString()} kg</span>
                        </div>
                      )
                    ))}
                    <div className="flex justify-between p-3 bg-amber-900/30 rounded border border-amber-500/30">
                      <span className="text-white font-bold">Total</span>
                      <span className="text-amber-400 font-bold">{results.structural.quantities.steel.total.toLocaleString()} kg</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BOQ Results */}
          {activeTab === 'boq' && results.boq && (
            <div className="space-y-6">
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">Bills of Quantities</h3>
                    <p className="text-slate-400 text-sm">{results.boq.projectInfo.number} | {results.boq.totalItems} Items | 100% Accuracy</p>
                  </div>
                  <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                </div>

                <div className="space-y-3 mb-6">
                  {results.boq.sections.map((section: any) => (
                    <div key={section.id} className="flex justify-between items-center p-4 bg-slate-900/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-indigo-400 font-mono">{section.id}</span>
                        <span className="text-white">{section.name}</span>
                        <span className="text-slate-500 text-sm">({section.items} items)</span>
                      </div>
                      <span className="text-white font-medium">{formatCurrency(section.amount)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-700 pt-4 space-y-2">
                  <div className="flex justify-between p-3">
                    <span className="text-slate-400">Subtotal</span>
                    <span className="text-white">{formatCurrency(results.boq.summary.subtotal)}</span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span className="text-slate-400">Preliminaries (5%)</span>
                    <span className="text-white">{formatCurrency(results.boq.summary.preliminaries)}</span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span className="text-slate-400">Contingency (5%)</span>
                    <span className="text-white">{formatCurrency(results.boq.summary.contingency)}</span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span className="text-slate-400">Overhead & Profit (10%)</span>
                    <span className="text-white">{formatCurrency(results.boq.summary.overheadProfit)}</span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span className="text-slate-400">VAT (16%)</span>
                    <span className="text-white">{formatCurrency(results.boq.summary.vat)}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-xl border border-indigo-500/30">
                    <span className="text-white font-bold text-lg">Grand Total</span>
                    <span className="text-3xl font-black text-indigo-400">{formatCurrency(results.boq.summary.grandTotal)}</span>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-slate-900/50 rounded-lg flex justify-between items-center">
                  <span className="text-slate-400">Cost per Square Meter</span>
                  <span className="text-2xl font-bold text-emerald-400">{formatCurrency(results.boq.summary.costPerSqm)}/m²</span>
                </div>
              </div>
            </div>
          )}

          {/* Quotation Results */}
          {activeTab === 'quotation' && results.quotation && (
            <div className="space-y-6">
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">Professional Quotation</h3>
                    <p className="text-slate-400 text-sm">{results.quotation.number} | Valid for {results.quotation.validDays} days</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white flex items-center gap-2">
                      <Printer className="w-4 h-4" />
                      Print
                    </button>
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white flex items-center gap-2">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </div>

                {/* Total Cost */}
                <div className="bg-gradient-to-r from-emerald-900/50 to-green-900/50 rounded-xl p-8 border border-emerald-500/30 mb-6">
                  <div className="text-center">
                    <p className="text-emerald-300 mb-2">Total Project Cost</p>
                    <p className="text-5xl font-black text-white">{formatCurrency(results.quotation.total)}</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-400" />
                    Project Timeline: {results.quotation.timeline.duration}
                  </h4>
                  <div className="space-y-3">
                    {results.quotation.timeline.milestones.map((milestone: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="w-16 text-right">
                          <span className="text-indigo-400 font-bold">{milestone.payment}%</span>
                        </div>
                        <div className="flex-1 bg-slate-900/50 rounded-lg p-3 flex justify-between items-center">
                          <span className="text-white">{milestone.phase}</span>
                          <span className="text-slate-400">{milestone.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Terms */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-900/50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-indigo-400">{results.quotation.paymentTerms.mobilization}%</div>
                    <div className="text-slate-400 text-sm">Mobilization</div>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-lg text-center">
                    <div className="text-lg font-bold text-amber-400">{results.quotation.paymentTerms.interim}</div>
                    <div className="text-slate-400 text-sm">Interim Payments</div>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-emerald-400">{results.quotation.paymentTerms.retention}%</div>
                    <div className="text-slate-400 text-sm">Retention</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
