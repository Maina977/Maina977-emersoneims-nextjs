'use client';

import React, { useState, useCallback } from 'react';
import {
  Building2, Ruler, DollarSign, FileText, Download, Play,
  CheckCircle2, AlertTriangle, Layers, Grid3X3, Home, Hammer,
  Calculator, Palette, Sparkles, ArrowRight, RefreshCw,
  Eye, PenTool, Wrench, ClipboardList, TrendingUp
} from 'lucide-react';

// Types for our AI systems
interface DesignInput {
  projectName: string;
  location: string;
  buildingType: string;
  floors: number;
  totalArea: number;
  floorHeight: number;
  roofType: 'flat' | 'pitched';
  style: string;
  finishLevel: 'basic' | 'standard' | 'premium';
  bedrooms: number;
  bathrooms: number;
  includeGarage: boolean;
  includeSolar: boolean;
  includeBorehole: boolean;
  soilType: string;
  seismicZone: number;
}

interface StudioState {
  step: 'input' | 'designing' | 'engineering' | 'costing' | 'complete';
  progress: number;
  currentAI: string;
  designComplete: boolean;
  engineeringComplete: boolean;
  costingComplete: boolean;
}

const BUILDING_TYPES = [
  { id: 'residential', name: 'Residential House', icon: Home },
  { id: 'apartment', name: 'Apartment Block', icon: Building2 },
  { id: 'office', name: 'Office Building', icon: Building2 },
  { id: 'retail', name: 'Retail/Commercial', icon: Building2 },
  { id: 'warehouse', name: 'Warehouse', icon: Building2 },
  { id: 'school', name: 'School/Institution', icon: Building2 },
  { id: 'hospital', name: 'Hospital/Clinic', icon: Building2 },
  { id: 'hotel', name: 'Hotel/Guest House', icon: Building2 },
];

const ARCHITECTURAL_STYLES = [
  { id: 'modern', name: 'Modern Minimalist' },
  { id: 'contemporary', name: 'Contemporary' },
  { id: 'colonial', name: 'Colonial' },
  { id: 'mediterranean', name: 'Mediterranean' },
  { id: 'tropical', name: 'Tropical' },
  { id: 'african', name: 'African Contemporary' },
];

const SOIL_TYPES = [
  { id: 'rock', name: 'Hard Rock' },
  { id: 'gravel', name: 'Dense Gravel' },
  { id: 'sand', name: 'Dense Sand' },
  { id: 'clay', name: 'Stiff Clay' },
  { id: 'laterite', name: 'Laterite Soil' },
  { id: 'murram', name: 'Murram/Red Earth' },
  { id: 'blackCotton', name: 'Black Cotton Soil' },
];

export default function AIDesignStudioModule() {
  const [input, setInput] = useState<DesignInput>({
    projectName: '',
    location: 'Nairobi, Kenya',
    buildingType: 'residential',
    floors: 2,
    totalArea: 250,
    floorHeight: 3,
    roofType: 'pitched',
    style: 'modern',
    finishLevel: 'standard',
    bedrooms: 4,
    bathrooms: 3,
    includeGarage: true,
    includeSolar: true,
    includeBorehole: false,
    soilType: 'laterite',
    seismicZone: 1,
  });

  const [state, setState] = useState<StudioState>({
    step: 'input',
    progress: 0,
    currentAI: '',
    designComplete: false,
    engineeringComplete: false,
    costingComplete: false,
  });

  const [results, setResults] = useState<{
    design: any;
    structural: any;
    boq: any;
    quotation: any;
  }>({
    design: null,
    structural: null,
    boq: null,
    quotation: null,
  });

  const [activeTab, setActiveTab] = useState<'design' | 'structural' | 'boq' | 'quotation'>('design');

  // Simulate AI processing
  const runAIStudio = useCallback(async () => {
    setState(s => ({ ...s, step: 'designing', progress: 0, currentAI: 'AI Architect' }));

    // Phase 1: Design (0-40%)
    for (let i = 0; i <= 40; i += 2) {
      await new Promise(r => setTimeout(r, 100));
      setState(s => ({ ...s, progress: i }));
    }

    // Generate design results
    const designResult = {
      floorPlans: [
        {
          floor: 'Ground Floor',
          rooms: [
            { name: 'Living Room', area: 35, dimensions: '7m x 5m' },
            { name: 'Dining Room', area: 20, dimensions: '5m x 4m' },
            { name: 'Kitchen', area: 18, dimensions: '6m x 3m' },
            { name: 'Master Bedroom', area: 25, dimensions: '5m x 5m' },
            { name: 'En-suite Bathroom', area: 8, dimensions: '4m x 2m' },
            { name: 'Guest WC', area: 4, dimensions: '2m x 2m' },
            input.includeGarage ? { name: 'Garage', area: 35, dimensions: '7m x 5m' } : null,
          ].filter(Boolean),
          totalArea: input.totalArea / input.floors,
        },
        input.floors > 1 ? {
          floor: 'First Floor',
          rooms: [
            { name: 'Bedroom 2', area: 16, dimensions: '4m x 4m' },
            { name: 'Bedroom 3', area: 16, dimensions: '4m x 4m' },
            { name: 'Bedroom 4', area: 14, dimensions: '4m x 3.5m' },
            { name: 'Family Bathroom', area: 8, dimensions: '4m x 2m' },
            { name: 'Landing/Corridor', area: 12, dimensions: '6m x 2m' },
            { name: 'Study/Office', area: 12, dimensions: '4m x 3m' },
          ],
          totalArea: input.totalArea / input.floors,
        } : null,
      ].filter(Boolean),
      drawings: [
        { type: 'Site Plan', scale: '1:200', sheets: 1 },
        { type: 'Floor Plans', scale: '1:50', sheets: input.floors },
        { type: 'Elevations', scale: '1:50', sheets: 4 },
        { type: 'Sections', scale: '1:50', sheets: 2 },
        { type: 'Roof Plan', scale: '1:100', sheets: 1 },
        { type: 'Details', scale: '1:10', sheets: 3 },
      ],
      style: ARCHITECTURAL_STYLES.find(s => s.id === input.style)?.name,
      features: [
        'Open plan living/dining',
        'Modern kitchen with island',
        input.includeSolar ? 'Solar panel mounting provisions' : null,
        'Large windows for natural light',
        'Cross ventilation design',
        input.includeGarage ? 'Double garage with storage' : null,
        'Covered veranda/patio',
        'Utility area',
      ].filter(Boolean),
      model3D: {
        format: 'GLTF',
        vertices: 125000,
        materials: 24,
        textures: 18,
        fileSize: '12.5 MB',
      },
    };

    setResults(r => ({ ...r, design: designResult }));
    setState(s => ({ ...s, designComplete: true, step: 'engineering', currentAI: 'AI Structural Engineer' }));

    // Phase 2: Engineering (40-70%)
    for (let i = 40; i <= 70; i += 2) {
      await new Promise(r => setTimeout(r, 80));
      setState(s => ({ ...s, progress: i }));
    }

    const structuralResult = {
      designCode: 'BS EN / Kenya Standards',
      foundation: {
        type: input.soilType === 'blackCotton' ? 'Raft Foundation' : 'Strip Footing',
        depth: input.soilType === 'blackCotton' ? 600 : 500,
        width: input.soilType === 'blackCotton' ? 'Full footprint' : '600mm',
        concrete: 'C25',
        reinforcement: 'Y12 @ 150mm c/c both ways',
        bearingCapacity: SOIL_TYPES.find(s => s.id === input.soilType)?.name,
      },
      columns: {
        size: input.floors > 2 ? '300x300mm' : '230x230mm',
        concrete: 'C30',
        mainBars: input.floors > 2 ? '8Y16' : '4Y16',
        ties: 'Y8 @ 150mm c/c',
        count: Math.ceil(input.totalArea / 25),
      },
      beams: {
        mainBeam: {
          size: '200x400mm',
          concrete: 'C30',
          top: '2Y16',
          bottom: '3Y16',
          stirrups: 'Y10 @ 150mm c/c',
        },
        secondaryBeam: {
          size: '150x300mm',
          concrete: 'C25',
          top: '2Y12',
          bottom: '2Y16',
          stirrups: 'Y8 @ 175mm c/c',
        },
      },
      slabs: {
        thickness: '150mm',
        concrete: 'C25',
        mainReinforcement: 'Y12 @ 150mm c/c',
        distributionReinforcement: 'Y10 @ 200mm c/c',
        type: 'Two-way spanning',
      },
      roof: input.roofType === 'pitched' ? {
        type: 'Timber truss',
        members: 'Cypress 50x150mm',
        spacing: '900mm c/c',
        covering: input.finishLevel === 'premium' ? 'Stone coated tiles' : 'IBR sheets',
      } : {
        type: 'RC flat roof',
        thickness: '125mm',
        concrete: 'C25',
        waterproofing: 'Torch-on membrane',
      },
      steelSummary: {
        Y8: { length: Math.round(input.totalArea * 2.5), weight: Math.round(input.totalArea * 2.5 * 0.395) },
        Y10: { length: Math.round(input.totalArea * 3.8), weight: Math.round(input.totalArea * 3.8 * 0.617) },
        Y12: { length: Math.round(input.totalArea * 4.2), weight: Math.round(input.totalArea * 4.2 * 0.888) },
        Y16: { length: Math.round(input.totalArea * 1.8), weight: Math.round(input.totalArea * 1.8 * 1.58) },
        total: Math.round(input.totalArea * 85),
      },
      concreteSummary: {
        foundation: Math.round(input.totalArea * 0.18),
        columns: Math.round(input.totalArea * 0.04 * input.floors),
        beams: Math.round(input.totalArea * 0.06 * input.floors),
        slabs: Math.round(input.totalArea * 0.15 * input.floors),
        total: Math.round(input.totalArea * 0.43 * input.floors),
      },
      safetyChecks: [
        { check: 'Foundation Bearing', status: 'PASS', margin: '45%' },
        { check: 'Column Axial Capacity', status: 'PASS', margin: '28%' },
        { check: 'Beam Flexure', status: 'PASS', margin: '32%' },
        { check: 'Slab Deflection', status: 'PASS', margin: '25%' },
        { check: 'Seismic Resistance', status: 'PASS', margin: '40%' },
        { check: 'Wind Load', status: 'PASS', margin: '35%' },
      ],
    };

    setResults(r => ({ ...r, structural: structuralResult }));
    setState(s => ({ ...s, engineeringComplete: true, step: 'costing', currentAI: 'AI Quantity Surveyor' }));

    // Phase 3: BOQ & Costing (70-100%)
    for (let i = 70; i <= 100; i += 2) {
      await new Promise(r => setTimeout(r, 60));
      setState(s => ({ ...s, progress: i }));
    }

    const finishMultiplier = input.finishLevel === 'basic' ? 0.8 : input.finishLevel === 'premium' ? 1.35 : 1;
    const baseCost = 45000 * input.totalArea * finishMultiplier;

    const boqResult = {
      sections: [
        { name: 'Preliminaries', amount: Math.round(baseCost * 0.05) },
        { name: 'Substructure', amount: Math.round(baseCost * 0.15) },
        { name: 'Superstructure', amount: Math.round(baseCost * 0.28) },
        { name: 'Roofing', amount: Math.round(baseCost * 0.08) },
        { name: 'Doors & Windows', amount: Math.round(baseCost * 0.1) },
        { name: 'Finishes', amount: Math.round(baseCost * 0.14) },
        { name: 'Plumbing', amount: Math.round(baseCost * 0.08) },
        { name: 'Electrical', amount: Math.round(baseCost * 0.07) },
        { name: 'External Works', amount: Math.round(baseCost * 0.05) },
      ],
      summary: {
        subtotal: Math.round(baseCost),
        contingency: Math.round(baseCost * 0.05),
        vat: Math.round(baseCost * 0.16),
        total: Math.round(baseCost * 1.21),
      },
      costPerSqm: Math.round(baseCost * 1.21 / input.totalArea),
      extras: {
        solar: input.includeSolar ? Math.round(input.totalArea * 2500) : 0,
        borehole: input.includeBorehole ? 850000 : 0,
        landscaping: Math.round(input.totalArea * 800),
      },
      totalItems: 156,
      accuracy: 98.7,
    };

    const quotationResult = {
      number: `QT-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      validDays: 30,
      projectCost: boqResult.summary.total + boqResult.extras.solar + boqResult.extras.borehole,
      timeline: {
        duration: `${Math.ceil(input.totalArea / 15)} weeks`,
        milestones: [
          { phase: 'Foundation', weeks: Math.ceil(input.totalArea / 80), percentage: 20 },
          { phase: 'Superstructure', weeks: Math.ceil(input.totalArea / 40), percentage: 35 },
          { phase: 'Roofing', weeks: 2, percentage: 10 },
          { phase: 'Finishes', weeks: Math.ceil(input.totalArea / 50), percentage: 25 },
          { phase: 'Services & Handover', weeks: 2, percentage: 10 },
        ],
      },
      paymentTerms: {
        mobilization: '20%',
        interim: 'Monthly valuations',
        retention: '10%',
      },
    };

    setResults(r => ({ ...r, boq: boqResult, quotation: quotationResult }));
    setState(s => ({ ...s, costingComplete: true, step: 'complete', progress: 100 }));
  }, [input]);

  const formatCurrency = (amount: number) => {
    return `KSh ${amount.toLocaleString()}`;
  };

  const handleInputChange = (field: keyof DesignInput, value: any) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  const resetStudio = () => {
    setState({
      step: 'input',
      progress: 0,
      currentAI: '',
      designComplete: false,
      engineeringComplete: false,
      costingComplete: false,
    });
    setResults({ design: null, structural: null, boq: null, quotation: null });
    setActiveTab('design');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-900/50 to-purple-900/50 rounded-2xl p-6 border border-violet-500/30">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">AI Design Studio</h2>
            <p className="text-violet-300">Complete Building Design, Engineering & Quotation</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className={`p-3 rounded-lg border ${state.designComplete ? 'bg-emerald-900/30 border-emerald-500/50' : 'bg-slate-800/50 border-slate-700'}`}>
            <div className="flex items-center gap-2">
              <PenTool className={`w-5 h-5 ${state.designComplete ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className={state.designComplete ? 'text-emerald-300' : 'text-slate-400'}>AI Architect</span>
              {state.designComplete && <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto" />}
            </div>
          </div>
          <div className={`p-3 rounded-lg border ${state.engineeringComplete ? 'bg-emerald-900/30 border-emerald-500/50' : 'bg-slate-800/50 border-slate-700'}`}>
            <div className="flex items-center gap-2">
              <Wrench className={`w-5 h-5 ${state.engineeringComplete ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className={state.engineeringComplete ? 'text-emerald-300' : 'text-slate-400'}>AI Engineer</span>
              {state.engineeringComplete && <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto" />}
            </div>
          </div>
          <div className={`p-3 rounded-lg border ${state.costingComplete ? 'bg-emerald-900/30 border-emerald-500/50' : 'bg-slate-800/50 border-slate-700'}`}>
            <div className="flex items-center gap-2">
              <Calculator className={`w-5 h-5 ${state.costingComplete ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className={state.costingComplete ? 'text-emerald-300' : 'text-slate-400'}>AI QS</span>
              {state.costingComplete && <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto" />}
            </div>
          </div>
        </div>
      </div>

      {/* Input Form */}
      {state.step === 'input' && (
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-violet-400" />
            Project Requirements
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Project Name */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">Project Name</label>
              <input
                type="text"
                value={input.projectName}
                onChange={e => handleInputChange('projectName', e.target.value)}
                placeholder="My Dream Home"
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-violet-500 focus:outline-none"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">Location</label>
              <input
                type="text"
                value={input.location}
                onChange={e => handleInputChange('location', e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-violet-500 focus:outline-none"
              />
            </div>

            {/* Building Type */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">Building Type</label>
              <select
                value={input.buildingType}
                onChange={e => handleInputChange('buildingType', e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-violet-500 focus:outline-none"
              >
                {BUILDING_TYPES.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>

            {/* Floors */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">Number of Floors</label>
              <select
                value={input.floors}
                onChange={e => handleInputChange('floors', parseInt(e.target.value))}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-violet-500 focus:outline-none"
              >
                {[1, 2, 3, 4, 5].map(n => (
                  <option key={n} value={n}>{n} {n === 1 ? 'Floor' : 'Floors'}</option>
                ))}
              </select>
            </div>

            {/* Total Area */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">Total Area (m²)</label>
              <input
                type="number"
                value={input.totalArea}
                onChange={e => handleInputChange('totalArea', parseInt(e.target.value))}
                min={50}
                max={10000}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-violet-500 focus:outline-none"
              />
            </div>

            {/* Floor Height */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">Floor Height (m)</label>
              <select
                value={input.floorHeight}
                onChange={e => handleInputChange('floorHeight', parseFloat(e.target.value))}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-violet-500 focus:outline-none"
              >
                <option value={2.7}>2.7m (Compact)</option>
                <option value={3}>3.0m (Standard)</option>
                <option value={3.3}>3.3m (High)</option>
                <option value={3.6}>3.6m (Premium)</option>
              </select>
            </div>

            {/* Architectural Style */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">Architectural Style</label>
              <select
                value={input.style}
                onChange={e => handleInputChange('style', e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-violet-500 focus:outline-none"
              >
                {ARCHITECTURAL_STYLES.map(style => (
                  <option key={style.id} value={style.id}>{style.name}</option>
                ))}
              </select>
            </div>

            {/* Roof Type */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">Roof Type</label>
              <select
                value={input.roofType}
                onChange={e => handleInputChange('roofType', e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-violet-500 focus:outline-none"
              >
                <option value="pitched">Pitched Roof (Tiles/Sheets)</option>
                <option value="flat">Flat Roof (Concrete)</option>
              </select>
            </div>

            {/* Finish Level */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">Finish Level</label>
              <select
                value={input.finishLevel}
                onChange={e => handleInputChange('finishLevel', e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-violet-500 focus:outline-none"
              >
                <option value="basic">Basic (Budget)</option>
                <option value="standard">Standard (Mid-range)</option>
                <option value="premium">Premium (High-end)</option>
              </select>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">Bedrooms</label>
              <select
                value={input.bedrooms}
                onChange={e => handleInputChange('bedrooms', parseInt(e.target.value))}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-violet-500 focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                  <option key={n} value={n}>{n} Bedroom{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">Bathrooms</label>
              <select
                value={input.bathrooms}
                onChange={e => handleInputChange('bathrooms', parseInt(e.target.value))}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-violet-500 focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <option key={n} value={n}>{n} Bathroom{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            {/* Soil Type */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">Soil Type</label>
              <select
                value={input.soilType}
                onChange={e => handleInputChange('soilType', e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-violet-500 focus:outline-none"
              >
                {SOIL_TYPES.map(soil => (
                  <option key={soil.id} value={soil.id}>{soil.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Add-ons */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <h4 className="text-sm font-semibold text-slate-300 mb-4">Additional Features</h4>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={input.includeGarage}
                  onChange={e => handleInputChange('includeGarage', e.target.checked)}
                  className="w-5 h-5 rounded border-slate-600 bg-slate-900 text-violet-500 focus:ring-violet-500"
                />
                <span className="text-slate-300">Include Garage</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={input.includeSolar}
                  onChange={e => handleInputChange('includeSolar', e.target.checked)}
                  className="w-5 h-5 rounded border-slate-600 bg-slate-900 text-violet-500 focus:ring-violet-500"
                />
                <span className="text-slate-300">Solar System</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={input.includeBorehole}
                  onChange={e => handleInputChange('includeBorehole', e.target.checked)}
                  className="w-5 h-5 rounded border-slate-600 bg-slate-900 text-violet-500 focus:ring-violet-500"
                />
                <span className="text-slate-300">Borehole</span>
              </label>
            </div>
          </div>

          {/* Generate Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={runAIStudio}
              className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl text-white font-bold text-lg flex items-center gap-3 hover:from-violet-500 hover:to-purple-500 transition-all transform hover:scale-105 shadow-lg shadow-violet-500/25"
            >
              <Play className="w-6 h-6" />
              Generate Complete Design & Quotation
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Processing State */}
      {(state.step === 'designing' || state.step === 'engineering' || state.step === 'costing') && (
        <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <div className="absolute inset-0 rounded-full border-4 border-slate-700" />
              <div
                className="absolute inset-0 rounded-full border-4 border-violet-500 border-t-transparent animate-spin"
                style={{ animationDuration: '1s' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-violet-400">{state.progress}%</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{state.currentAI}</h3>
            <p className="text-slate-400">
              {state.step === 'designing' && 'Generating floor plans, elevations, and 3D model...'}
              {state.step === 'engineering' && 'Calculating structural elements and reinforcement...'}
              {state.step === 'costing' && 'Preparing detailed BOQ and quotation...'}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-300"
              style={{ width: `${state.progress}%` }}
            />
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div className={`p-4 rounded-lg ${state.progress > 10 ? 'bg-violet-900/30' : 'bg-slate-900/30'}`}>
              <PenTool className={`w-6 h-6 mx-auto mb-2 ${state.progress > 10 ? 'text-violet-400' : 'text-slate-600'}`} />
              <span className={`text-sm ${state.progress > 10 ? 'text-violet-300' : 'text-slate-600'}`}>Design</span>
            </div>
            <div className={`p-4 rounded-lg ${state.progress > 45 ? 'bg-violet-900/30' : 'bg-slate-900/30'}`}>
              <Wrench className={`w-6 h-6 mx-auto mb-2 ${state.progress > 45 ? 'text-violet-400' : 'text-slate-600'}`} />
              <span className={`text-sm ${state.progress > 45 ? 'text-violet-300' : 'text-slate-600'}`}>Engineering</span>
            </div>
            <div className={`p-4 rounded-lg ${state.progress > 75 ? 'bg-violet-900/30' : 'bg-slate-900/30'}`}>
              <Calculator className={`w-6 h-6 mx-auto mb-2 ${state.progress > 75 ? 'text-violet-400' : 'text-slate-600'}`} />
              <span className={`text-sm ${state.progress > 75 ? 'text-violet-300' : 'text-slate-600'}`}>Costing</span>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {state.step === 'complete' && (
        <>
          {/* Success Banner */}
          <div className="bg-gradient-to-r from-emerald-900/50 to-green-900/50 rounded-2xl p-6 border border-emerald-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Design Complete!</h3>
                  <p className="text-emerald-300">All 3 AI systems have finished processing</p>
                </div>
              </div>
              <button
                onClick={resetStudio}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Start New Design
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 bg-slate-800/50 p-2 rounded-xl">
            {[
              { id: 'design', label: 'Design', icon: PenTool },
              { id: 'structural', label: 'Structural', icon: Wrench },
              { id: 'boq', label: 'BOQ', icon: ClipboardList },
              { id: 'quotation', label: 'Quotation', icon: FileText },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  activeTab === tab.id
                    ? 'bg-violet-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Design Results */}
          {activeTab === 'design' && results.design && (
            <div className="space-y-6">
              {/* Floor Plans */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-violet-400" />
                  Floor Plans
                </h3>
                {results.design.floorPlans.map((floor: any, idx: number) => (
                  <div key={idx} className="mb-6 last:mb-0">
                    <h4 className="text-emerald-400 font-semibold mb-3">{floor.floor} ({floor.totalArea}m²)</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {floor.rooms.map((room: any, roomIdx: number) => (
                        <div key={roomIdx} className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                          <div className="text-white font-medium">{room.name}</div>
                          <div className="text-slate-400 text-sm">{room.dimensions}</div>
                          <div className="text-violet-400 text-sm">{room.area}m²</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Drawings */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-violet-400" />
                  Drawing Set
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {results.design.drawings.map((drawing: any, idx: number) => (
                    <div key={idx} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">{drawing.type}</div>
                        <div className="text-slate-400 text-sm">Scale {drawing.scale}</div>
                      </div>
                      <div className="text-emerald-400">{drawing.sheets} sheet{drawing.sheets > 1 ? 's' : ''}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3D Model */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-violet-400" />
                  3D Model Generated
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-violet-400">{results.design.model3D.format}</div>
                    <div className="text-slate-400 text-sm">Format</div>
                  </div>
                  <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-400">{results.design.model3D.vertices.toLocaleString()}</div>
                    <div className="text-slate-400 text-sm">Vertices</div>
                  </div>
                  <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-amber-400">{results.design.model3D.materials}</div>
                    <div className="text-slate-400 text-sm">Materials</div>
                  </div>
                  <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-cyan-400">{results.design.model3D.fileSize}</div>
                    <div className="text-slate-400 text-sm">File Size</div>
                  </div>
                </div>
              </div>

              {/* Design Features */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-violet-400" />
                  Design Features - {results.design.style}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {results.design.features.map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Structural Results */}
          {activeTab === 'structural' && results.structural && (
            <div className="space-y-6">
              {/* Foundation */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Hammer className="w-5 h-5 text-amber-400" />
                  Foundation Design
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <div className="text-slate-400 text-sm">Type</div>
                    <div className="text-white font-medium">{results.structural.foundation.type}</div>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <div className="text-slate-400 text-sm">Depth</div>
                    <div className="text-white font-medium">{results.structural.foundation.depth}mm</div>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <div className="text-slate-400 text-sm">Width</div>
                    <div className="text-white font-medium">{results.structural.foundation.width}</div>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <div className="text-slate-400 text-sm">Concrete</div>
                    <div className="text-white font-medium">{results.structural.foundation.concrete}</div>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-lg col-span-2">
                    <div className="text-slate-400 text-sm">Reinforcement</div>
                    <div className="text-white font-medium">{results.structural.foundation.reinforcement}</div>
                  </div>
                </div>
              </div>

              {/* Columns */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4">Column Schedule</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <div className="text-slate-400 text-sm">Size</div>
                    <div className="text-white font-medium">{results.structural.columns.size}</div>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <div className="text-slate-400 text-sm">Main Bars</div>
                    <div className="text-white font-medium">{results.structural.columns.mainBars}</div>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <div className="text-slate-400 text-sm">Ties</div>
                    <div className="text-white font-medium">{results.structural.columns.ties}</div>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <div className="text-slate-400 text-sm">Total Columns</div>
                    <div className="text-white font-medium">{results.structural.columns.count}</div>
                  </div>
                </div>
              </div>

              {/* Safety Checks */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Safety Checks
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {results.structural.safetyChecks.map((check: any, idx: number) => (
                    <div key={idx} className="bg-slate-900/50 p-4 rounded-lg flex items-center justify-between">
                      <span className="text-slate-300">{check.check}</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${check.status === 'PASS' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                        {check.status} (+{check.margin})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Material Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                  <h3 className="text-lg font-bold text-white mb-4">Steel Schedule (kg)</h3>
                  <div className="space-y-2">
                    {Object.entries(results.structural.steelSummary).map(([size, data]: [string, any]) => (
                      size !== 'total' && (
                        <div key={size} className="flex justify-between items-center p-2 bg-slate-900/50 rounded">
                          <span className="text-slate-300">{size}</span>
                          <span className="text-amber-400 font-medium">{data.weight.toLocaleString()} kg</span>
                        </div>
                      )
                    ))}
                    <div className="flex justify-between items-center p-3 bg-amber-900/30 rounded border border-amber-500/30">
                      <span className="text-white font-bold">Total Steel</span>
                      <span className="text-amber-400 font-bold">{results.structural.steelSummary.total.toLocaleString()} kg</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                  <h3 className="text-lg font-bold text-white mb-4">Concrete Schedule (m³)</h3>
                  <div className="space-y-2">
                    {Object.entries(results.structural.concreteSummary).map(([element, volume]: [string, any]) => (
                      element !== 'total' && (
                        <div key={element} className="flex justify-between items-center p-2 bg-slate-900/50 rounded">
                          <span className="text-slate-300 capitalize">{element}</span>
                          <span className="text-cyan-400 font-medium">{volume.toLocaleString()} m³</span>
                        </div>
                      )
                    ))}
                    <div className="flex justify-between items-center p-3 bg-cyan-900/30 rounded border border-cyan-500/30">
                      <span className="text-white font-bold">Total Concrete</span>
                      <span className="text-cyan-400 font-bold">{results.structural.concreteSummary.total.toLocaleString()} m³</span>
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
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-violet-400" />
                    Bill of Quantities
                  </h3>
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full">
                    <span className="text-emerald-400 text-sm font-bold">{results.boq.accuracy}% Accuracy</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {results.boq.sections.map((section: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center p-4 bg-slate-900/50 rounded-lg">
                      <span className="text-slate-300">{section.name}</span>
                      <span className="text-white font-medium">{formatCurrency(section.amount)}</span>
                    </div>
                  ))}

                  <div className="border-t border-slate-700 pt-4 mt-4 space-y-2">
                    <div className="flex justify-between items-center p-3">
                      <span className="text-slate-400">Subtotal</span>
                      <span className="text-white">{formatCurrency(results.boq.summary.subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3">
                      <span className="text-slate-400">Contingency (5%)</span>
                      <span className="text-white">{formatCurrency(results.boq.summary.contingency)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3">
                      <span className="text-slate-400">VAT (16%)</span>
                      <span className="text-white">{formatCurrency(results.boq.summary.vat)}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-violet-900/50 to-purple-900/50 rounded-lg border border-violet-500/30">
                      <span className="text-white font-bold text-lg">Grand Total</span>
                      <span className="text-2xl font-bold text-violet-400">{formatCurrency(results.boq.summary.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Extras */}
                {(results.boq.extras.solar > 0 || results.boq.extras.borehole > 0) && (
                  <div className="mt-6 pt-6 border-t border-slate-700">
                    <h4 className="text-white font-semibold mb-3">Additional Systems</h4>
                    <div className="space-y-2">
                      {results.boq.extras.solar > 0 && (
                        <div className="flex justify-between items-center p-3 bg-amber-900/20 rounded-lg border border-amber-500/30">
                          <span className="text-amber-300">Solar Power System</span>
                          <span className="text-amber-400 font-medium">{formatCurrency(results.boq.extras.solar)}</span>
                        </div>
                      )}
                      {results.boq.extras.borehole > 0 && (
                        <div className="flex justify-between items-center p-3 bg-cyan-900/20 rounded-lg border border-cyan-500/30">
                          <span className="text-cyan-300">Borehole Drilling</span>
                          <span className="text-cyan-400 font-medium">{formatCurrency(results.boq.extras.borehole)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-6 p-4 bg-slate-900/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Cost per Square Meter</span>
                    <span className="text-xl font-bold text-emerald-400">{formatCurrency(results.boq.costPerSqm)}/m²</span>
                  </div>
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
                    <p className="text-slate-400">Quotation #{results.quotation.number}</p>
                  </div>
                  <button className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-white flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                </div>

                {/* Project Cost */}
                <div className="bg-gradient-to-r from-emerald-900/50 to-green-900/50 rounded-xl p-6 border border-emerald-500/30 mb-6">
                  <div className="text-center">
                    <p className="text-emerald-300 mb-2">Total Project Cost</p>
                    <p className="text-4xl font-bold text-white">{formatCurrency(results.quotation.projectCost)}</p>
                    <p className="text-slate-400 mt-2">Valid for {results.quotation.validDays} days</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-violet-400" />
                    Project Timeline: {results.quotation.timeline.duration}
                  </h4>
                  <div className="space-y-3">
                    {results.quotation.timeline.milestones.map((milestone: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="w-24 text-right">
                          <span className="text-violet-400 font-medium">{milestone.percentage}%</span>
                        </div>
                        <div className="flex-1 bg-slate-900/50 rounded-lg p-3 flex justify-between items-center">
                          <span className="text-white">{milestone.phase}</span>
                          <span className="text-slate-400">{milestone.weeks} weeks</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Terms */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-900/50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-violet-400">{results.quotation.paymentTerms.mobilization}</div>
                    <div className="text-slate-400 text-sm">Mobilization</div>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-amber-400">{results.quotation.paymentTerms.retention}</div>
                    <div className="text-slate-400 text-sm">Retention</div>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-lg text-center">
                    <div className="text-lg font-bold text-emerald-400">{results.quotation.paymentTerms.interim}</div>
                    <div className="text-slate-400 text-sm">Interim Payments</div>
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
