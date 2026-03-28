'use client';

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   SOLARGENIUS PRO™ - WORLD'S MOST ADVANCED SOLAR AI QUOTING SYSTEM          ║
 * ║   More Advanced Than Aurora Solar - Quotes in Under 5 Minutes               ║
 * ║   Copyright © 2024-2026 EmersonEIMS - All Rights Reserved                   ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useCallback, useRef } from 'react';
import {
  SolarGeniusProEngine,
  solarGeniusEngine,
  GLOBAL_COUNTRY_DATABASE,
  GLOBAL_PANELS_DATABASE,
  GLOBAL_INVERTERS_DATABASE,
  GLOBAL_BATTERIES_DATABASE,
  type SolarGeniusQuotation
} from '@/lib/solar/solarGeniusProEngine';
import { SOLAR_ACADEMY_COURSES, SOLAR_ACADEMY_METADATA } from '@/lib/solar/solarEducationAcademy';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const SolarGeniusPro: React.FC = () => {
  const [step, setStep] = useState<'input' | 'processing' | 'results' | 'education'>('input');
  const [inputType, setInputType] = useState<'image' | 'video' | 'bq' | 'coordinates'>('image');
  const [images, setImages] = useState<string[]>([]);
  const [coordinates, setCoordinates] = useState({ lat: -1.2921, lng: 36.8219 });
  const [countryCode, setCountryCode] = useState('KE');
  const [systemType, setSystemType] = useState<'grid-tied' | 'hybrid' | 'off-grid'>('hybrid');
  const [selectedPanel, setSelectedPanel] = useState('');
  const [selectedInverter, setSelectedInverter] = useState('');
  const [quotation, setQuotation] = useState<SolarGeniusQuotation | null>(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [educationModule, setEducationModule] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const clientInfo = {
    name: 'Customer Name',
    email: 'customer@example.com',
    phone: '+254 700 000 000',
    address: 'Nairobi, Kenya'
  };

  // Handle image upload
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).slice(0, 5).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setImages(prev => [...prev, ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  }, []);

  // Generate quotation
  const handleGenerate = useCallback(async () => {
    setStep('processing');
    setProgress(0);
    setError(null);

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 5, 90));
    }, 200);

    try {
      const result = await solarGeniusEngine.generateQuotation(
        {
          type: inputType,
          data: images.length > 0 ? images : 'default',
          coordinates
        },
        clientInfo,
        countryCode,
        {
          systemType,
          panelBrand: selectedPanel || undefined,
          inverterBrand: selectedInverter || undefined
        }
      );

      clearInterval(progressInterval);
      setProgress(100);
      setQuotation(result);
      setTimeout(() => setStep('results'), 500);
    } catch (err) {
      clearInterval(progressInterval);
      setError('Failed to generate quotation. Please try again.');
      setStep('input');
    }
  }, [inputType, images, coordinates, countryCode, systemType, selectedPanel, selectedInverter]);

  // Render input step
  const renderInputStep = () => (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-full text-amber-400 text-sm font-medium mb-4">
          <span className="animate-pulse">&#9889;</span>
          <span>WORLD'S #1 SOLAR AI - MORE ADVANCED THAN AURORA</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          SolarGenius <span className="text-amber-400">Pro™</span>
        </h1>
        <p className="text-xl text-gray-400">
          AI-Powered Solar Quotation in Under 5 Minutes | No Site Visit Required
        </p>
      </div>

      {/* AI Features Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { icon: '&#128506;', label: 'Satellite Roof Analyzer' },
          { icon: '&#129302;', label: 'Neural Panel Optimizer' },
          { icon: '&#127780;', label: 'NASA Weather AI' },
          { icon: '&#128176;', label: 'Financial Genius' },
          { icon: '&#128293;', label: 'Fire Risk Detector' },
          { icon: '&#128225;', label: 'AI BQ Parser' },
          { icon: '&#127968;', label: '3D Design Engine' },
          { icon: '&#128196;', label: 'Permit Generator' }
        ].map((feature, i) => (
          <div key={i} className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 text-center">
            <span className="text-2xl" dangerouslySetInnerHTML={{ __html: feature.icon }} />
            <p className="text-xs text-gray-400 mt-1">{feature.label}</p>
          </div>
        ))}
      </div>

      {/* Input Type Selection */}
      <div className="mb-6">
        <label className="block text-gray-400 text-sm mb-3">Select Input Method</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { type: 'image', icon: '&#128247;', label: 'Upload Images' },
            { type: 'video', icon: '&#127909;', label: 'Upload Video' },
            { type: 'bq', icon: '&#128196;', label: 'BQ Document (PDF/Word)' },
            { type: 'coordinates', icon: '&#128205;', label: 'GPS Coordinates' }
          ].map(opt => (
            <button
              key={opt.type}
              onClick={() => setInputType(opt.type as typeof inputType)}
              className={`p-4 rounded-xl border-2 transition-all ${
                inputType === opt.type
                  ? 'border-amber-500 bg-amber-500/10'
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
              }`}
            >
              <span className="text-3xl block mb-2" dangerouslySetInnerHTML={{ __html: opt.icon }} />
              <span className="text-sm text-gray-300">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Image Upload */}
      {inputType === 'image' && (
        <div className="mb-6">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-amber-500 transition-colors"
          >
            <span className="text-5xl mb-4 block">&#128247;</span>
            <p className="text-gray-400">Click to upload roof images (up to 5)</p>
            <p className="text-xs text-gray-500 mt-2">Supports: JPG, PNG, HEIC</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
          {images.length > 0 && (
            <div className="flex gap-2 mt-4 flex-wrap">
              {images.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img} alt={`Upload ${i+1}`} className="w-20 h-20 object-cover rounded-lg" />
                  <button
                    onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Coordinates Input */}
      {inputType === 'coordinates' && (
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Latitude</label>
            <input
              type="number"
              step="0.0001"
              value={coordinates.lat}
              onChange={(e) => setCoordinates(prev => ({ ...prev, lat: parseFloat(e.target.value) || 0 }))}
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Longitude</label>
            <input
              type="number"
              step="0.0001"
              value={coordinates.lng}
              onChange={(e) => setCoordinates(prev => ({ ...prev, lng: parseFloat(e.target.value) || 0 }))}
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
            />
          </div>
        </div>
      )}

      {/* Country Selection */}
      <div className="mb-6">
        <label className="block text-gray-400 text-sm mb-2">Country</label>
        <select
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
        >
          {Object.entries(GLOBAL_COUNTRY_DATABASE).map(([code, data]) => (
            <option key={code} value={code}>{data.name} ({data.currency})</option>
          ))}
        </select>
      </div>

      {/* System Type */}
      <div className="mb-6">
        <label className="block text-gray-400 text-sm mb-2">System Type</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { type: 'grid-tied', label: 'Grid-Tied', desc: 'No batteries, feed excess to grid' },
            { type: 'hybrid', label: 'Hybrid', desc: 'Grid + Battery backup' },
            { type: 'off-grid', label: 'Off-Grid', desc: '100% independent' }
          ].map(opt => (
            <button
              key={opt.type}
              onClick={() => setSystemType(opt.type as typeof systemType)}
              className={`p-4 rounded-xl border-2 text-left ${
                systemType === opt.type
                  ? 'border-amber-500 bg-amber-500/10'
                  : 'border-slate-700 bg-slate-800/50'
              }`}
            >
              <span className="font-bold text-white block">{opt.label}</span>
              <span className="text-xs text-gray-400">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Equipment Preferences */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-gray-400 text-sm mb-2">Preferred Panel Brand (Optional)</label>
          <select
            value={selectedPanel}
            onChange={(e) => setSelectedPanel(e.target.value)}
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
          >
            <option value="">AI Recommends Best Option</option>
            {[...new Set(GLOBAL_PANELS_DATABASE.map(p => p.brand))].map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-2">Preferred Inverter Brand (Optional)</label>
          <select
            value={selectedInverter}
            onChange={(e) => setSelectedInverter(e.target.value)}
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
          >
            <option value="">AI Recommends Best Option</option>
            {[...new Set(GLOBAL_INVERTERS_DATABASE.map(i => i.brand))].map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all flex items-center justify-center gap-3"
      >
        <span className="text-2xl">&#9889;</span>
        Generate AI Quotation in Seconds
      </button>

      {/* Education Link */}
      <div className="mt-8 text-center">
        <button
          onClick={() => setStep('education')}
          className="text-amber-400 hover:text-amber-300 flex items-center justify-center gap-2 mx-auto"
        >
          <span>&#128218;</span>
          Access Solar Academy - Complete Education Materials
        </button>
      </div>
    </div>
  );

  // Render processing step
  const renderProcessingStep = () => (
    <div className="max-w-xl mx-auto text-center py-20">
      <div className="w-24 h-24 mx-auto mb-8 relative">
        <div className="absolute inset-0 border-4 border-amber-500/30 rounded-full animate-ping" />
        <div className="absolute inset-0 border-4 border-t-amber-500 rounded-full animate-spin" />
        <span className="absolute inset-0 flex items-center justify-center text-4xl">&#9889;</span>
      </div>
      <h2 className="text-2xl font-bold text-white mb-4">AI Analyzing Your Project</h2>
      <div className="space-y-2 text-gray-400 text-sm mb-8">
        {progress > 10 && <p className="animate-pulse">&#10004; Satellite roof analysis...</p>}
        {progress > 25 && <p className="animate-pulse">&#10004; NASA weather data integration...</p>}
        {progress > 40 && <p className="animate-pulse">&#10004; Neural panel optimization...</p>}
        {progress > 55 && <p className="animate-pulse">&#10004; Financial calculations...</p>}
        {progress > 70 && <p className="animate-pulse">&#10004; Risk assessment...</p>}
        {progress > 85 && <p className="animate-pulse">&#10004; Generating comprehensive report...</p>}
      </div>
      <div className="w-full bg-slate-800 rounded-full h-3">
        <div
          className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-gray-500 text-sm mt-2">{progress}% Complete</p>
    </div>
  );

  // Render results step
  const renderResultsStep = () => {
    if (!quotation) return null;

    const country = GLOBAL_COUNTRY_DATABASE[countryCode];
    const formatCurrency = (amount: number) =>
      `${country.currencySymbol} ${amount.toLocaleString()}`;

    return (
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-amber-400 text-sm">Quotation #{quotation.id}</p>
              <h2 className="text-2xl font-bold text-white">
                {quotation.systemDesign.systemSize.toFixed(1)} kWp {quotation.systemDesign.systemType.replace('-', ' ')} System
              </h2>
              <p className="text-gray-400">Generated in {quotation.generationTime}ms</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Total Investment</p>
              <p className="text-3xl font-bold text-amber-400">{formatCurrency(quotation.totalCost)}</p>
              <p className="text-green-400 text-sm">Payback: {quotation.financials.paybackPeriod} years</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['summary', 'design', 'bom', 'financial', 'risks', 'weather', 'permits'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === tab
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-800 text-gray-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
          {activeTab === 'summary' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-4">System Overview</h3>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-slate-900/50 rounded-lg">
                    <span className="text-gray-400">System Size</span>
                    <span className="text-white font-bold">{quotation.systemDesign.systemSize.toFixed(1)} kWp</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-900/50 rounded-lg">
                    <span className="text-gray-400">Panel Count</span>
                    <span className="text-white font-bold">{quotation.systemDesign.panels.quantity} panels</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-900/50 rounded-lg">
                    <span className="text-gray-400">Annual Production</span>
                    <span className="text-white font-bold">{(quotation.systemDesign.systemSize * quotation.weatherAnalysis.annualProduction).toLocaleString()} kWh</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-900/50 rounded-lg">
                    <span className="text-gray-400">Annual Savings</span>
                    <span className="text-green-400 font-bold">{formatCurrency(quotation.financials.annualSavings)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-900/50 rounded-lg">
                    <span className="text-gray-400">25-Year ROI</span>
                    <span className="text-green-400 font-bold">{quotation.financials.roi.toFixed(0)}%</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Selected Equipment</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-slate-900/50 rounded-lg">
                    <p className="text-amber-400 text-xs">SOLAR PANELS</p>
                    <p className="text-white font-bold">{quotation.systemDesign.panels.spec.brand} {quotation.systemDesign.panels.spec.model}</p>
                    <p className="text-gray-400 text-sm">{quotation.systemDesign.panels.spec.wattage}W | {quotation.systemDesign.panels.spec.efficiency}% efficiency</p>
                  </div>
                  <div className="p-4 bg-slate-900/50 rounded-lg">
                    <p className="text-amber-400 text-xs">INVERTER</p>
                    <p className="text-white font-bold">{quotation.systemDesign.inverter.spec.brand} {quotation.systemDesign.inverter.spec.model}</p>
                    <p className="text-gray-400 text-sm">{quotation.systemDesign.inverter.spec.capacity}kW | {quotation.systemDesign.inverter.spec.type}</p>
                  </div>
                  {quotation.systemDesign.batteries && (
                    <div className="p-4 bg-slate-900/50 rounded-lg">
                      <p className="text-amber-400 text-xs">BATTERIES</p>
                      <p className="text-white font-bold">{quotation.systemDesign.batteries.spec.brand} {quotation.systemDesign.batteries.spec.model}</p>
                      <p className="text-gray-400 text-sm">{quotation.systemDesign.batteries.totalCapacity.toFixed(1)}kWh total</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bom' && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Bill of Materials</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 text-gray-400">Item</th>
                      <th className="text-left py-3 text-gray-400">Specification</th>
                      <th className="text-right py-3 text-gray-400">Qty</th>
                      <th className="text-right py-3 text-gray-400">Unit Price</th>
                      <th className="text-right py-3 text-gray-400">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotation.billOfMaterials.map((item, i) => (
                      <tr key={i} className="border-b border-slate-700/50">
                        <td className="py-3 text-white">{item.item}</td>
                        <td className="py-3 text-gray-400">{item.specification}</td>
                        <td className="py-3 text-right text-white">{item.quantity} {item.unit}</td>
                        <td className="py-3 text-right text-gray-400">{formatCurrency(item.unitPrice)}</td>
                        <td className="py-3 text-right text-amber-400 font-bold">{formatCurrency(item.totalPrice)}</td>
                      </tr>
                    ))}
                    <tr className="bg-amber-500/10">
                      <td colSpan={4} className="py-3 text-right text-white font-bold">TOTAL</td>
                      <td className="py-3 text-right text-amber-400 font-bold text-lg">{formatCurrency(quotation.totalCost)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'financial' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Financial Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-slate-900/50 rounded-lg">
                    <span className="text-gray-400">Total Investment</span>
                    <span className="text-white font-bold">{formatCurrency(quotation.totalCost)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-900/50 rounded-lg">
                    <span className="text-gray-400">Cost per Watt</span>
                    <span className="text-white font-bold">{formatCurrency(quotation.financials.costPerWatt)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-green-900/30 rounded-lg">
                    <span className="text-gray-400">Annual Savings</span>
                    <span className="text-green-400 font-bold">{formatCurrency(quotation.financials.annualSavings)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-green-900/30 rounded-lg">
                    <span className="text-gray-400">25-Year Savings</span>
                    <span className="text-green-400 font-bold">{formatCurrency(quotation.financials.lifetimeSavings)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-900/50 rounded-lg">
                    <span className="text-gray-400">Payback Period</span>
                    <span className="text-amber-400 font-bold">{quotation.financials.paybackPeriod} years</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-900/50 rounded-lg">
                    <span className="text-gray-400">ROI</span>
                    <span className="text-green-400 font-bold">{quotation.financials.roi.toFixed(0)}%</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Environmental Impact</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-900/20 rounded-xl text-center border border-green-500/20">
                    <p className="text-3xl font-bold text-green-400">{quotation.financials.carbonOffset}</p>
                    <p className="text-gray-400 text-sm">Tons CO2/year offset</p>
                  </div>
                  <div className="p-4 bg-green-900/20 rounded-xl text-center border border-green-500/20">
                    <p className="text-3xl font-bold text-green-400">{quotation.financials.treesEquivalent}</p>
                    <p className="text-gray-400 text-sm">Trees equivalent</p>
                  </div>
                </div>
                <h4 className="text-white font-bold mt-6 mb-3">Financing Options</h4>
                <div className="space-y-2">
                  {quotation.financials.financingOptions.map((opt, i) => (
                    <div key={i} className="flex justify-between p-3 bg-slate-900/50 rounded-lg">
                      <span className="text-gray-400">{opt.type}</span>
                      <span className="text-white">{opt.monthlyPayment > 0 ? `${formatCurrency(opt.monthlyPayment)}/mo` : 'One-time'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'risks' && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Risk Assessment</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-slate-900/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-bold">Fire Risk</span>
                      <span className={`px-2 py-1 rounded text-xs ${quotation.riskAssessment.fireRisk.level === 'low' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {quotation.riskAssessment.fireRisk.level.toUpperCase()}
                      </span>
                    </div>
                    <ul className="text-sm text-gray-400 space-y-1">
                      {quotation.riskAssessment.fireRisk.mitigations.map((m, i) => (
                        <li key={i}>&#10004; {m}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-slate-900/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-bold">Electrical Risk</span>
                      <span className={`px-2 py-1 rounded text-xs ${quotation.riskAssessment.electricalRisk.level === 'low' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {quotation.riskAssessment.electricalRisk.level.toUpperCase()}
                      </span>
                    </div>
                    <ul className="text-sm text-gray-400 space-y-1">
                      {quotation.riskAssessment.electricalRisk.mitigations.map((m, i) => (
                        <li key={i}>&#10004; {m}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-3">Maintenance Alerts</h4>
                  <ul className="space-y-2">
                    {quotation.riskAssessment.maintenanceAlerts.map((alert, i) => (
                      <li key={i} className="p-3 bg-amber-500/10 rounded-lg text-amber-200 text-sm">
                        &#9888; {alert}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'weather' && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4">NASA Weather Analysis</h3>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-amber-500/10 rounded-xl text-center">
                  <p className="text-3xl font-bold text-amber-400">{quotation.weatherAnalysis.avgSolarIrradiance}</p>
                  <p className="text-gray-400 text-sm">kWh/m²/day Irradiance</p>
                </div>
                <div className="p-4 bg-amber-500/10 rounded-xl text-center">
                  <p className="text-3xl font-bold text-amber-400">{quotation.weatherAnalysis.peakSunHours}</p>
                  <p className="text-gray-400 text-sm">Peak Sun Hours</p>
                </div>
                <div className="p-4 bg-amber-500/10 rounded-xl text-center">
                  <p className="text-3xl font-bold text-amber-400">{quotation.weatherAnalysis.annualProduction}</p>
                  <p className="text-gray-400 text-sm">kWh/kWp/year</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <h4 className="text-white font-bold mb-2">Optimal Angles</h4>
                  <p className="text-gray-400">Tilt: <span className="text-white">{quotation.weatherAnalysis.optimalTilt}°</span></p>
                  <p className="text-gray-400">Azimuth: <span className="text-white">{quotation.weatherAnalysis.optimalAzimuth}° (North)</span></p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <h4 className="text-white font-bold mb-2">Efficiency Factors</h4>
                  <p className="text-gray-400">Temperature Loss: <span className="text-white">{quotation.weatherAnalysis.temperatureImpact}%</span></p>
                  <p className="text-gray-400">Dust Factor: <span className="text-white">{(quotation.weatherAnalysis.dustFactor * 100).toFixed(0)}%</span></p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'permits' && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Permit Requirements</h3>
              <div className="p-4 bg-slate-900/50 rounded-lg mb-4">
                <h4 className="text-white font-bold mb-2">Regulatory Authority</h4>
                <p className="text-amber-400">{quotation.permits.authorityContacts.name}</p>
                <p className="text-gray-400 text-sm">{quotation.permits.authorityContacts.address}</p>
                <p className="text-gray-400 text-sm">{quotation.permits.authorityContacts.phone}</p>
              </div>
              <h4 className="text-white font-bold mb-3">Required Documents</h4>
              <div className="grid md:grid-cols-2 gap-2">
                {quotation.permits.requiredDocuments.map((doc, i) => (
                  <div key={i} className="p-3 bg-slate-900/50 rounded-lg text-gray-300 text-sm">
                    &#128196; {doc}
                  </div>
                ))}
              </div>
              <h4 className="text-white font-bold mt-6 mb-3">Fees</h4>
              <div className="space-y-2">
                {quotation.permits.fees.map((fee, i) => (
                  <div key={i} className="flex justify-between p-3 bg-slate-900/50 rounded-lg">
                    <span className="text-gray-400">{fee.type}</span>
                    <span className="text-white">{formatCurrency(fee.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button className="flex-1 py-3 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600">
            &#128196; Download PDF Report
          </button>
          <button className="flex-1 py-3 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-600">
            &#128231; Email Quote
          </button>
          <button
            onClick={() => { setStep('input'); setQuotation(null); }}
            className="px-6 py-3 border border-slate-600 text-gray-400 rounded-lg hover:text-white"
          >
            New Quote
          </button>
        </div>
      </div>
    );
  };

  // Render education step
  const renderEducationStep = () => (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={() => setStep('input')}
        className="mb-6 text-gray-400 hover:text-white flex items-center gap-2"
      >
        &#8592; Back to Quotation Tool
      </button>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          Solar <span className="text-amber-400">Academy</span>
        </h1>
        <p className="text-xl text-gray-400">{SOLAR_ACADEMY_METADATA.description}</p>
        <p className="text-sm text-gray-500 mt-2">
          {SOLAR_ACADEMY_METADATA.totalCourses} Courses | {SOLAR_ACADEMY_METADATA.totalHours} Hours | University-Grade Content
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SOLAR_ACADEMY_COURSES.map((course, i) => (
          <div
            key={course.id}
            className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 hover:border-amber-500/50 transition-colors cursor-pointer"
            onClick={() => setEducationModule(i)}
          >
            <span className="text-4xl mb-4 block">
              {i === 0 ? '&#9728;' : i === 1 ? '&#128295;' : i === 2 ? '&#128267;' : i === 3 ? '&#9889;' : '&#128391;'}
            </span>
            <h3 className="text-lg font-bold text-white mb-2">{course.title}</h3>
            <p className="text-gray-400 text-sm mb-4">{course.description.slice(0, 100)}...</p>
            <div className="flex items-center justify-between text-sm">
              <span className={`px-2 py-1 rounded ${
                course.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                course.difficulty === 'intermediate' ? 'bg-amber-500/20 text-amber-400' :
                course.difficulty === 'advanced' ? 'bg-orange-500/20 text-orange-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {course.difficulty}
              </span>
              <span className="text-gray-500">{course.duration}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Course Content Preview */}
      {SOLAR_ACADEMY_COURSES[educationModule] && (
        <div className="mt-8 bg-slate-800/50 rounded-xl border border-slate-700 p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            {SOLAR_ACADEMY_COURSES[educationModule].title}
          </h2>
          <div className="prose prose-invert max-w-none">
            {SOLAR_ACADEMY_COURSES[educationModule].content.slice(0, 3).map((section, i) => (
              <div key={i} className="mb-6">
                <h3 className="text-lg font-bold text-amber-400 mb-2">{section.heading}</h3>
                <div className="text-gray-300 whitespace-pre-wrap text-sm">
                  {section.content.slice(0, 500)}...
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 px-6 py-3 bg-amber-500 text-white font-bold rounded-lg">
            View Full Course
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black py-12 px-4">
      {step === 'input' && renderInputStep()}
      {step === 'processing' && renderProcessingStep()}
      {step === 'results' && renderResultsStep()}
      {step === 'education' && renderEducationStep()}
    </div>
  );
};

export default SolarGeniusPro;
