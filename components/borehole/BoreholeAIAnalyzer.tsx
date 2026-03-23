'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
  AIBoreholeAnalyzer,
  BoreholeAssessmentResult,
  GeoCoordinates,
  KENYA_GEOLOGICAL_ZONES,
} from '@/lib/borehole/aiBoreholeAnalyzer';

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

const RatingBadge: React.FC<{ rating: string }> = ({ rating }) => {
  const colors: Record<string, string> = {
    'excellent': 'bg-green-500',
    'good': 'bg-emerald-500',
    'moderate': 'bg-yellow-500',
    'poor': 'bg-orange-500',
    'not_recommended': 'bg-red-500',
  };

  return (
    <span className={`${colors[rating] || 'bg-gray-500'} text-white px-3 py-1 rounded-full text-sm font-bold uppercase`}>
      {rating.replace('_', ' ')}
    </span>
  );
};

const RiskBadge: React.FC<{ severity: string }> = ({ severity }) => {
  const colors: Record<string, string> = {
    'low': 'bg-green-100 text-green-800 border-green-300',
    'medium': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'high': 'bg-red-100 text-red-800 border-red-300',
    'critical': 'bg-red-200 text-red-900 border-red-400',
  };

  return (
    <span className={`${colors[severity] || 'bg-gray-100'} px-2 py-0.5 rounded border text-xs font-medium`}>
      {severity.toUpperCase()}
    </span>
  );
};

const ProgressBar: React.FC<{ value: number; max?: number; color?: string }> = ({
  value,
  max = 100,
  color = 'emerald',
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const colorClasses: Record<string, string> = {
    'emerald': 'bg-emerald-500',
    'blue': 'bg-blue-500',
    'yellow': 'bg-yellow-500',
    'red': 'bg-red-500',
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className={`${colorClasses[color] || colorClasses.emerald} h-2.5 rounded-full transition-all duration-500`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const BoreholeAIAnalyzer: React.FC = () => {
  const [step, setStep] = useState<'upload' | 'location' | 'analyzing' | 'results'>('upload');
  const [imageData, setImageData] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [location, setLocation] = useState<GeoCoordinates>({ latitude: -1.2921, longitude: 36.8219 });
  const [county, setCounty] = useState<string>('nairobi');
  const [result, setResult] = useState<BoreholeAssessmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('summary');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const analyzer = useRef(new AIBoreholeAnalyzer());

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, etc.)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result as string;
      setImageData(data);
      setImagePreview(data);
      setError(null);
      setStep('location');
    };
    reader.onerror = () => {
      setError('Failed to read image file');
    };
    reader.readAsDataURL(file);
  }, []);

  const handleGetLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        setError('Unable to get your location. Please enter coordinates manually.');
      }
    );
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!imageData) {
      setError('Please upload an image first');
      return;
    }

    setStep('analyzing');
    setError(null);

    try {
      // Simulate analysis time for better UX
      await new Promise(resolve => setTimeout(resolve, 2000));

      const assessmentResult = await analyzer.current.analyzesite(
        imageData,
        location,
        county
      );

      setResult(assessmentResult);
      setStep('results');
    } catch (err) {
      setError('Analysis failed. Please try again.');
      setStep('location');
    }
  }, [imageData, location, county]);

  const handleReset = useCallback(() => {
    setStep('upload');
    setImageData(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
    setActiveTab('summary');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const generatePDFReport = useCallback(() => {
    if (!result) return;

    // In production, use jsPDF or server-side PDF generation
    const reportContent = `
EMERSONEIMS AI BOREHOLE PRE-ASSESSMENT REPORT
============================================
Report ID: ${result.id}
Generated: ${result.timestamp.toLocaleString()}

EXECUTIVE SUMMARY
-----------------
${result.executiveSummary}

SUCCESS PROBABILITY: ${result.successProbability}%
OVERALL RATING: ${result.overallRating.toUpperCase()}
CONFIDENCE LEVEL: ${result.confidenceLevel.toUpperCase()}

LOCATION DETAILS
----------------
Coordinates: ${result.location.latitude.toFixed(6)}, ${result.location.longitude.toFixed(6)}
County: ${result.countyData.county}
Geological Zone: ${result.countyData.geologicalZone}

GEOLOGICAL ANALYSIS
-------------------
${result.geologicalAnalysis.summary}

VEGETATION ANALYSIS
-------------------
${result.vegetationAnalysis.summary}

TERRAIN ANALYSIS
----------------
${result.terrainAnalysis.summary}

RECOMMENDATIONS
---------------
Recommended Depth: ${result.recommendations.recommendedDepth.optimal}m (${result.recommendations.recommendedDepth.minimum}-${result.recommendations.recommendedDepth.maximum}m range)
Expected Yield: ${result.recommendations.estimatedYield.conservative}-${result.recommendations.estimatedYield.optimistic} m³/hour
Drilling Method: ${result.recommendations.drillingMethod}
Estimated Cost: KES ${result.recommendations.estimatedCost.min.toLocaleString()} - ${result.recommendations.estimatedCost.max.toLocaleString()}
Construction Time: ${result.recommendations.constructionTime.min}-${result.recommendations.constructionTime.max} days

RISK ASSESSMENT
---------------
Overall Risk Level: ${result.riskAssessment.overallRisk.toUpperCase()}

${result.riskAssessment.factors.map(r => `- ${r.type} (${r.severity}): ${r.description}`).join('\n')}

NEXT STEPS
----------
${result.nextSteps.join('\n')}

DISCLAIMERS
-----------
${result.disclaimers.join('\n')}

============================================
This report was generated by EmersonEIMS AI Borehole Analyzer
Contact: +254 768 860 665 | info@emersoneims.com
Website: www.emersoneims.com
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EmersonEIMS-Borehole-Report-${result.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [result]);

  // ============================================================================
  // RENDER STEPS
  // ============================================================================

  const renderUploadStep = () => (
    <div className="text-center">
      <div className="mb-8">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Site Photo</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Upload a clear photo of your land for AI analysis. For best results, capture the terrain, vegetation, and any visible rock formations.
        </p>
      </div>

      <div
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-blue-500 transition-colors cursor-pointer bg-gray-50"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="text-lg font-medium text-gray-700">Click to upload or drag and drop</p>
        <p className="text-sm text-gray-500 mt-2">JPG, PNG up to 10MB</p>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg text-left">
        <h3 className="font-semibold text-blue-800 mb-2">Tips for Best Results:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Capture photos during daylight hours</li>
          <li>• Include visible terrain features (slopes, valleys)</li>
          <li>• Show vegetation patterns in the area</li>
          <li>• If possible, photograph from an elevated position</li>
          <li>• Include any visible rock outcrops or soil exposure</li>
        </ul>
      </div>
    </div>
  );

  const renderLocationStep = () => (
    <div>
      <div className="flex items-center gap-4 mb-6">
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Site preview"
            className="w-32 h-32 object-cover rounded-lg shadow-md"
          />
        )}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Site Location</h2>
          <p className="text-gray-600">Provide the location details for accurate analysis</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* County Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            County
          </label>
          <select
            value={county}
            onChange={(e) => setCounty(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Object.entries(KENYA_GEOLOGICAL_ZONES)
              .filter(([key]) => key !== 'default')
              .sort((a, b) => a[1].county.localeCompare(b[1].county))
              .map(([key, data]) => (
                <option key={key} value={key}>
                  {data.county}
                </option>
              ))}
          </select>
        </div>

        {/* GPS Coordinates */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GPS Coordinates
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.0001"
              placeholder="Latitude"
              value={location.latitude}
              onChange={(e) => setLocation({ ...location, latitude: parseFloat(e.target.value) || 0 })}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              step="0.0001"
              placeholder="Longitude"
              value={location.longitude}
              onChange={(e) => setLocation({ ...location, longitude: parseFloat(e.target.value) || 0 })}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleGetLocation}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Use my current location
          </button>
        </div>
      </div>

      {/* County Info Preview */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">Regional Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Avg. Water Table</span>
            <p className="font-medium">{KENYA_GEOLOGICAL_ZONES[county]?.averageWaterTable || 60}m</p>
          </div>
          <div>
            <span className="text-gray-500">Success Rate</span>
            <p className="font-medium">{KENYA_GEOLOGICAL_ZONES[county]?.drillingSuccessRate || 70}%</p>
          </div>
          <div>
            <span className="text-gray-500">Typical Depth</span>
            <p className="font-medium">
              {KENYA_GEOLOGICAL_ZONES[county]?.recommendedDepth?.min || 80}-
              {KENYA_GEOLOGICAL_ZONES[county]?.recommendedDepth?.max || 250}m
            </p>
          </div>
          <div>
            <span className="text-gray-500">Aquifer Type</span>
            <p className="font-medium text-xs">{KENYA_GEOLOGICAL_ZONES[county]?.aquiferType?.slice(0, 30) || 'Mixed'}...</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex gap-4">
        <button
          onClick={() => setStep('upload')}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleAnalyze}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-colors font-semibold flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Start AI Analysis
        </button>
      </div>
    </div>
  );

  const renderAnalyzingStep = () => (
    <div className="text-center py-12">
      <div className="relative w-32 h-32 mx-auto mb-8">
        <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4">AI Analysis in Progress</h2>

      <div className="max-w-md mx-auto space-y-3">
        <div className="flex items-center gap-3 text-left p-3 bg-green-50 rounded-lg">
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-green-800">Image uploaded successfully</span>
        </div>
        <div className="flex items-center gap-3 text-left p-3 bg-blue-50 rounded-lg">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-blue-800">Analyzing terrain features...</span>
        </div>
        <div className="flex items-center gap-3 text-left p-3 bg-gray-50 rounded-lg">
          <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
          <span className="text-gray-500">Identifying vegetation indicators...</span>
        </div>
        <div className="flex items-center gap-3 text-left p-3 bg-gray-50 rounded-lg">
          <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
          <span className="text-gray-500">Cross-referencing geological data...</span>
        </div>
        <div className="flex items-center gap-3 text-left p-3 bg-gray-50 rounded-lg">
          <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
          <span className="text-gray-500">Generating recommendations...</span>
        </div>
      </div>
    </div>
  );

  const renderResultsStep = () => {
    if (!result) return null;

    const tabs = [
      { id: 'summary', label: 'Summary', icon: '📊' },
      { id: 'satellite', label: 'Satellite', icon: '🛰️' },
      { id: 'lidar', label: 'LiDAR', icon: '📡' },
      { id: 'hyperspectral', label: 'Rock Mapping', icon: '💎' },
      { id: 'geophysics', label: 'Geophysics', icon: '⚡' },
      { id: 'gis', label: 'GIS Analysis', icon: '🗺️' },
      { id: 'geology', label: 'Geology', icon: '🪨' },
      { id: 'eia', label: 'EIA/Permits', icon: '📋' },
      { id: 'history', label: 'History', icon: '📜' },
      { id: 'risks', label: 'Risks', icon: '⚠️' },
      { id: 'recommendations', label: 'Next Steps', icon: '✅' },
    ];

    return (
      <div>
        {/* Header with Rating */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 -mx-6 -mt-6 px-6 py-6 mb-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-blue-100 text-sm">Report ID: {result.id}</p>
              <h2 className="text-2xl font-bold mt-1">AI Borehole Assessment Complete</h2>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">{result.successProbability}%</div>
              <p className="text-sm text-blue-100">Success Probability</p>
            </div>
            <div>
              <RatingBadge rating={result.overallRating} />
              <p className="text-xs text-blue-100 mt-1 text-center">
                Confidence: {result.confidenceLevel}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {/* Summary Tab */}
          {activeTab === 'summary' && (
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-line text-sm text-gray-700">
                {result.executiveSummary}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-white border rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Key Metrics</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Success Probability</span>
                        <span className="font-medium">{result.successProbability}%</span>
                      </div>
                      <ProgressBar
                        value={result.successProbability}
                        color={result.successProbability >= 65 ? 'emerald' : result.successProbability >= 45 ? 'yellow' : 'red'}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Terrain Score</span>
                        <span className="font-medium">{result.terrainAnalysis.overallScore}/100</span>
                      </div>
                      <ProgressBar value={result.terrainAnalysis.overallScore} color="blue" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Vegetation Index</span>
                        <span className="font-medium">{(result.vegetationAnalysis.greenIndex * 100).toFixed(0)}%</span>
                      </div>
                      <ProgressBar value={result.vegetationAnalysis.greenIndex * 100} color="emerald" />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white border rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Cost Estimate</h3>
                  <div className="text-center mb-4">
                    <p className="text-3xl font-bold text-gray-900">
                      KES {(result.recommendations.estimatedCost.min / 1000).toFixed(0)}K -
                      {(result.recommendations.estimatedCost.max / 1000).toFixed(0)}K
                    </p>
                    <p className="text-sm text-gray-500">Total project cost</p>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>• Drilling: {result.recommendations.recommendedDepth.optimal}m depth</p>
                    <p>• Method: {result.recommendations.drillingMethod.slice(0, 40)}...</p>
                    <p>• Timeline: {result.recommendations.constructionTime.min}-{result.recommendations.constructionTime.max} days</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Satellite Remote Sensing Tab */}
          {activeTab === 'satellite' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🛰️</span>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Satellite Remote Sensing Analysis</h3>
                  <p className="text-sm text-gray-600">Sentinel-2, Landsat-8 & MODIS data integration</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {/* Sentinel-2 */}
                <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <span>🇪🇺</span> Sentinel-2
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">NDVI (Vegetation)</span>
                      <span className="font-medium text-green-700">{(result.remoteSensing.sentinel2.ndvi * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">NDWI (Water)</span>
                      <span className="font-medium text-blue-700">{(result.remoteSensing.sentinel2.ndwi * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">NDMI (Moisture)</span>
                      <span className="font-medium text-cyan-700">{(result.remoteSensing.sentinel2.ndmi * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bare Soil Index</span>
                      <span className="font-medium">{(result.remoteSensing.sentinel2.bsi * 100).toFixed(0)}%</span>
                    </div>
                    <div className="pt-2 border-t text-xs text-gray-500">
                      Acquired: {result.remoteSensing.sentinel2.acquisitionDate}
                    </div>
                  </div>
                </div>

                {/* Landsat-8 */}
                <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                    <span>🇺🇸</span> Landsat-8
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Surface Temp</span>
                      <span className="font-medium">{result.remoteSensing.landsat8.surfaceTemperature.toFixed(1)}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thermal Anomaly</span>
                      <span className={`font-medium ${result.remoteSensing.landsat8.thermalAnomaly ? 'text-green-600' : 'text-gray-500'}`}>
                        {result.remoteSensing.landsat8.thermalAnomaly ? 'Detected' : 'None'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Moisture Index</span>
                      <span className="font-medium text-blue-700">{(result.remoteSensing.landsat8.moistureIndex * 100).toFixed(0)}%</span>
                    </div>
                    {result.remoteSensing.landsat8.thermalAnomaly && (
                      <div className="pt-2 mt-2 border-t">
                        <p className="text-xs text-green-700">Thermal anomaly may indicate subsurface water</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* MODIS */}
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                    <span>🌍</span> MODIS
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Evapotranspiration</span>
                      <span className="font-medium">{result.remoteSensing.modis.evapotranspiration.toFixed(1)} mm/day</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Land Surface Temp</span>
                      <span className="font-medium">{result.remoteSensing.modis.landSurfaceTemperature.toFixed(1)}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vegetation Condition</span>
                      <span className="font-medium">{result.remoteSensing.modis.vegetationCondition}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Interpretation:</strong> Multi-spectral satellite analysis provides vegetation health (NDVI),
                  water presence (NDWI), soil moisture (NDMI), and thermal signatures that indicate groundwater potential.
                  Higher moisture indices and thermal anomalies often correlate with aquifer presence.
                </p>
              </div>
            </div>
          )}

          {/* LiDAR Analysis Tab */}
          {activeTab === 'lidar' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">📡</span>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">LiDAR Terrain Analysis</h3>
                  <p className="text-sm text-gray-600">High-resolution digital elevation modeling</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Terrain Metrics */}
                <div className="p-4 bg-white border rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-4">Terrain Metrics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{result.lidarAnalysis.elevation.toFixed(0)}m</p>
                      <p className="text-xs text-gray-500">Elevation (ASL)</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">{result.lidarAnalysis.slope.toFixed(1)}°</p>
                      <p className="text-xs text-gray-500">Slope</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{result.lidarAnalysis.aspect}</p>
                      <p className="text-xs text-gray-500">Aspect</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-cyan-600">{result.lidarAnalysis.topographicWetnessIndex.toFixed(1)}</p>
                      <p className="text-xs text-gray-500">TWI (Wetness)</p>
                    </div>
                  </div>
                </div>

                {/* Lineament Detection */}
                <div className="p-4 bg-white border rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-4">Lineament Detection</h4>
                  {result.lidarAnalysis.lineamentDetection.length > 0 ? (
                    <div className="space-y-2">
                      {result.lidarAnalysis.lineamentDetection.map((lineament, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-green-50 rounded border border-green-200">
                          <div>
                            <span className="font-medium text-green-800 capitalize">{lineament.type}</span>
                            <span className="text-xs text-gray-500 ml-2">{lineament.azimuth.toFixed(0)}° azimuth</span>
                          </div>
                          <span className="text-xs bg-green-100 px-2 py-1 rounded">
                            {(lineament.confidence * 100).toFixed(0)}% conf
                          </span>
                        </div>
                      ))}
                      <p className="text-xs text-green-700 mt-2">
                        Lineaments (fractures/faults) are preferential groundwater flow paths
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No significant lineaments detected</p>
                  )}
                </div>
              </div>

              {/* Depression Detection */}
              {result.lidarAnalysis.depressionDetection.length > 0 && (
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-3">Depression Zones Detected</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    {result.lidarAnalysis.depressionDetection.map((dep, i) => (
                      <div key={i} className="bg-white p-3 rounded-lg">
                        <p className="font-medium">Depression {i + 1}</p>
                        <p className="text-sm text-gray-600">Area: {dep.area.toFixed(0)} m²</p>
                        <p className="text-sm text-gray-600">Depth: {dep.depth.toFixed(1)}m</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-blue-700 mt-3">
                    Depressions act as natural recharge zones where rainwater infiltrates to aquifers
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Hyperspectral Rock Mapping Tab */}
          {activeTab === 'hyperspectral' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">💎</span>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Hyperspectral Rock & Mineral Mapping</h3>
                  <p className="text-sm text-gray-600">Advanced spectral analysis for geological characterization</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Rock Type */}
                <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                  <h4 className="font-semibold text-amber-800 mb-3">Identified Rock Type</h4>
                  <p className="text-2xl font-bold text-amber-900">{result.hyperspectralAnalysis.rockType}</p>
                  <p className="text-sm text-amber-700 mt-2">
                    Weathering: <span className="font-medium capitalize">{result.hyperspectralAnalysis.weatheringDegree}</span>
                  </p>
                </div>

                {/* Mineral Indices */}
                <div className="p-4 bg-white border rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-3">Spectral Indices</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Iron Oxide Index</span>
                        <span>{(result.hyperspectralAnalysis.ironOxideIndex * 100).toFixed(0)}%</span>
                      </div>
                      <ProgressBar value={result.hyperspectralAnalysis.ironOxideIndex * 100} color="red" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Clay Mineral Index</span>
                        <span>{(result.hyperspectralAnalysis.clayMineralIndex * 100).toFixed(0)}%</span>
                      </div>
                      <ProgressBar value={result.hyperspectralAnalysis.clayMineralIndex * 100} color="yellow" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Carbonate Index</span>
                        <span>{(result.hyperspectralAnalysis.carbonateIndex * 100).toFixed(0)}%</span>
                      </div>
                      <ProgressBar value={result.hyperspectralAnalysis.carbonateIndex * 100} color="blue" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mineral Indicators */}
              <div className="p-4 bg-white border rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-4">Mineral Composition</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {result.hyperspectralAnalysis.mineralIndicators.map((mineral, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{mineral.mineral}</p>
                        <p className="text-xs text-gray-500">{mineral.significance}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{mineral.abundance.toFixed(0)}%</p>
                        <p className="text-xs text-gray-500">Abundance</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {result.hyperspectralAnalysis.alterationZones.length > 0 && (
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">Alteration Zones</h4>
                  <ul className="space-y-1">
                    {result.hyperspectralAnalysis.alterationZones.map((zone, i) => (
                      <li key={i} className="text-sm text-purple-700">• {zone}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Geophysics Tab */}
          {activeTab === 'geophysics' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">⚡</span>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Geophysical Survey Simulation</h3>
                  <p className="text-sm text-gray-600">VES, ERT & Magnetic survey analysis</p>
                </div>
              </div>

              {/* VES Results */}
              <div className="p-4 bg-white border rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">V</span>
                  Vertical Electrical Sounding (VES)
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-left">Layer</th>
                        <th className="p-2 text-left">Depth (m)</th>
                        <th className="p-2 text-left">Thickness (m)</th>
                        <th className="p-2 text-left">Resistivity (Ωm)</th>
                        <th className="p-2 text-left">Interpretation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.geophysicalSurvey.ves.layers.map((layer, i) => (
                        <tr key={i} className={`border-b ${layer.interpretation.includes('WATER') ? 'bg-blue-50' : ''}`}>
                          <td className="p-2">{i + 1}</td>
                          <td className="p-2">{layer.depth.toFixed(1)}</td>
                          <td className="p-2">{layer.thickness < 100 ? layer.thickness.toFixed(1) : '∞'}</td>
                          <td className="p-2">{layer.resistivity.toFixed(0)}</td>
                          <td className="p-2 text-xs">{layer.interpretation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{result.geophysicalSurvey.ves.aquiferDepth.toFixed(0)}m</p>
                      <p className="text-xs text-gray-500">Aquifer Depth</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-cyan-600">{result.geophysicalSurvey.ves.aquiferThickness.toFixed(0)}m</p>
                      <p className="text-xs text-gray-500">Aquifer Thickness</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold capitalize">{result.geophysicalSurvey.ves.waterQualityIndicator}</p>
                      <p className="text-xs text-gray-500">Water Quality</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ERT & Magnetic */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-3">ERT - Electrical Resistivity</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Bedrock Depth:</strong> {result.geophysicalSurvey.ert.bedrockDepth.toFixed(0)}m</p>
                    <p><strong>Fracture Zones:</strong> {result.geophysicalSurvey.ert.fractureZones.length} detected</p>
                    <p><strong>Saturated Zones:</strong> {result.geophysicalSurvey.ert.saturatedZones.length} identified</p>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-3">Magnetic Survey</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Basement Depth:</strong> {result.geophysicalSurvey.magnetic.basementDepth.toFixed(0)}m</p>
                    <p><strong>Dyke Presence:</strong> {result.geophysicalSurvey.magnetic.dykePresence ? 'Yes - may affect drilling' : 'No'}</p>
                    <p><strong>Anomalies:</strong> {result.geophysicalSurvey.magnetic.anomalies.length} detected</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GIS Analysis Tab */}
          {activeTab === 'gis' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🗺️</span>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">GIS Spatial Analysis</h3>
                  <p className="text-sm text-gray-600">Geographic information system integration</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {/* Proximity Analysis */}
                <div className="p-4 bg-white border rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-3">Proximity Analysis</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">To River</span>
                      <span className="font-medium">{result.gisAnalysis.distanceToRiver.toFixed(1)} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">To Lake</span>
                      <span className="font-medium">{result.gisAnalysis.distanceToLake.toFixed(1)} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">To Wetland</span>
                      <span className="font-medium">{result.gisAnalysis.distanceToWetland.toFixed(1)} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">To Existing Borehole</span>
                      <span className="font-medium">{result.gisAnalysis.distanceToExistingBorehole.toFixed(1)} km</span>
                    </div>
                  </div>
                </div>

                {/* Land Information */}
                <div className="p-4 bg-white border rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-3">Land Classification</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Land Cover:</strong> {result.gisAnalysis.landCoverClass}</p>
                    <p><strong>Land Use Zone:</strong> {result.gisAnalysis.landUseZone}</p>
                    <p><strong>Protected Area:</strong>
                      <span className={result.gisAnalysis.protectedArea ? 'text-red-600 font-medium' : 'text-green-600'}>
                        {result.gisAnalysis.protectedArea ? ' Yes - Permits Required' : ' No'}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Watershed */}
                <div className="p-4 bg-white border rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-3">Watershed Analysis</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Watershed:</strong> {result.gisAnalysis.watershedName}</p>
                    <p><strong>Stream Order:</strong> {result.gisAnalysis.streamOrder}</p>
                    <p><strong>Catchment Area:</strong> {result.gisAnalysis.catchmentArea.toFixed(0)} km²</p>
                  </div>
                </div>
              </div>

              {/* Lineament Analysis */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-3">Lineament & Fault Analysis</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{result.gisAnalysis.lineamentDensity.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">Lineament Density (km/km²)</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-cyan-600">{result.gisAnalysis.lineamentIntersections}</p>
                    <p className="text-xs text-gray-500">Lineament Intersections</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">{result.gisAnalysis.faultProximity.toFixed(1)} km</p>
                    <p className="text-xs text-gray-500">Distance to Major Fault</p>
                  </div>
                </div>
                <p className="text-xs text-blue-700 mt-3">
                  Higher lineament density and intersections indicate better groundwater potential
                </p>
              </div>
            </div>
          )}

          {/* EIA/Permits Tab */}
          {activeTab === 'eia' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">📋</span>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Environmental Impact & Permits</h3>
                  <p className="text-sm text-gray-600">Kenya EIA requirements and permit guidance</p>
                </div>
              </div>

              {/* Environmental Sensitivity */}
              <div className={`p-4 rounded-xl border ${
                result.eiaAssessment.environmentalSensitivity === 'critical' ? 'bg-red-50 border-red-300' :
                result.eiaAssessment.environmentalSensitivity === 'high' ? 'bg-orange-50 border-orange-300' :
                result.eiaAssessment.environmentalSensitivity === 'medium' ? 'bg-yellow-50 border-yellow-300' :
                'bg-green-50 border-green-300'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Environmental Sensitivity Level</h4>
                    <p className="text-sm text-gray-600">Based on proximity to protected areas and sensitive ecosystems</p>
                  </div>
                  <span className={`text-xl font-bold uppercase ${
                    result.eiaAssessment.environmentalSensitivity === 'critical' ? 'text-red-600' :
                    result.eiaAssessment.environmentalSensitivity === 'high' ? 'text-orange-600' :
                    result.eiaAssessment.environmentalSensitivity === 'medium' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {result.eiaAssessment.environmentalSensitivity}
                  </span>
                </div>
              </div>

              {/* Permit Requirements */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-white border rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-4">Required Permits (Kenya)</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>NEMA License</span>
                      <span className={result.eiaAssessment.nemaLicenseRequired ? 'text-red-600 font-medium' : 'text-green-600'}>
                        {result.eiaAssessment.nemaLicenseRequired ? 'Required' : 'Not Required'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>WRA Permit</span>
                      <span className="text-red-600 font-medium">Required</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>County Permit</span>
                      <span className="text-red-600 font-medium">Required</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <span>EIA Category</span>
                      <span className="font-medium capitalize">{result.eiaAssessment.eiaCategoryKenya.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white border rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-4">Cost & Timeline Estimate</h4>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-3xl font-bold text-green-600">
                        KES {result.eiaAssessment.estimatedPermitCost.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">Estimated Permit Cost</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{result.eiaAssessment.estimatedPermitTime}</p>
                      <p className="text-sm text-gray-500">Estimated Processing Time</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mitigation Measures */}
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <h4 className="font-semibold text-amber-800 mb-3">Required Mitigation Measures</h4>
                <ul className="space-y-2">
                  {result.eiaAssessment.mitigationMeasures.map((measure, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-amber-900">
                      <span className="text-amber-500 mt-1">•</span>
                      {measure}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Geotechnical Summary */}
              <div className="p-4 bg-white border rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-3">Geotechnical Assessment</h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Soil Type:</span>
                    <p className="font-medium">{result.geotechnicalAssessment.soilType}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Excavation:</span>
                    <p className="font-medium capitalize">{result.geotechnicalAssessment.excavationDifficulty}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Foundation:</span>
                    <p className="font-medium">{result.geotechnicalAssessment.foundationRecommendation}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Terrain Tab - REMOVED as we have more detailed LiDAR now */}

          {/* Vegetation Tab - REMOVED as we have satellite indices */}

          {/* Geology Tab */}
          {activeTab === 'geology' && (
            <div className="space-y-4">
              <p className="text-gray-600">{result.geologicalAnalysis.summary}</p>
              <div className="space-y-3">
                {result.terrainAnalysis.features.map((feature, i) => (
                  <div key={i} className="p-4 bg-white border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800 capitalize">{feature.type}</h4>
                        <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-medium ${
                          feature.favorability === 'excellent' ? 'text-green-600' :
                          feature.favorability === 'good' ? 'text-emerald-600' :
                          feature.favorability === 'moderate' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {feature.favorability}
                        </span>
                        <p className="text-xs text-gray-500">{(feature.confidence * 100).toFixed(0)}% confidence</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vegetation Tab */}
          {activeTab === 'vegetation' && (
            <div className="space-y-4">
              <p className="text-gray-600">{result.vegetationAnalysis.summary}</p>
              <div className="grid md:grid-cols-2 gap-4">
                {result.vegetationAnalysis.indicators.map((indicator, i) => (
                  <div key={i} className={`p-4 border rounded-lg ${
                    indicator.waterIndicator ? 'bg-green-50 border-green-200' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{indicator.waterIndicator ? '💧' : '🌱'}</span>
                      <div>
                        <h4 className="font-medium text-gray-800">{indicator.type}</h4>
                        <p className="text-sm text-gray-600 mt-1">{indicator.description}</p>
                        {indicator.depthEstimate && (
                          <p className="text-xs text-green-700 mt-2">
                            Estimated water depth: {indicator.depthEstimate.min}-{indicator.depthEstimate.max}m
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Geology Tab */}
          {activeTab === 'geology' && (
            <div className="space-y-4">
              <p className="text-gray-600">{result.geologicalAnalysis.summary}</p>
              <div className="grid md:grid-cols-2 gap-4">
                {result.geologicalAnalysis.formations.map((formation, i) => (
                  <div key={i} className="p-4 bg-white border rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">{formation.type}</h4>
                    <p className="text-sm text-gray-600 mb-3">{formation.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Aquifer Potential</span>
                        <p className="font-medium">{formation.aquiferPotential}%</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Drilling</span>
                        <p className="font-medium capitalize">{formation.drillingDifficulty}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Porosity</span>
                        <p className="font-medium capitalize">{formation.porosity}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Typical Depth</span>
                        <p className="font-medium">{formation.typicalDepth.min}-{formation.typicalDepth.max}m</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Regional Data: {result.countyData.county}</h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-700">
                  <div>
                    <span className="text-blue-600">Geological Zone</span>
                    <p className="font-medium">{result.countyData.geologicalZone}</p>
                  </div>
                  <div>
                    <span className="text-blue-600">Aquifer Type</span>
                    <p className="font-medium">{result.countyData.aquiferType}</p>
                  </div>
                  <div>
                    <span className="text-blue-600">Water Quality</span>
                    <p className="font-medium">{result.countyData.waterQualityNotes}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-white border rounded-lg text-center">
                  <p className="text-3xl font-bold text-emerald-600">{result.historicalData.averageSuccessRate.toFixed(0)}%</p>
                  <p className="text-sm text-gray-500">Area Success Rate</p>
                </div>
                <div className="p-4 bg-white border rounded-lg text-center">
                  <p className="text-3xl font-bold text-blue-600">{result.historicalData.averageDepth.toFixed(0)}m</p>
                  <p className="text-sm text-gray-500">Average Depth</p>
                </div>
                <div className="p-4 bg-white border rounded-lg text-center">
                  <p className="text-3xl font-bold text-cyan-600">{result.historicalData.averageYield.toFixed(1)} m³/hr</p>
                  <p className="text-sm text-gray-500">Average Yield</p>
                </div>
              </div>

              <h3 className="font-semibold text-gray-800">Nearby Boreholes</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-left">Distance</th>
                      <th className="p-3 text-left">Depth</th>
                      <th className="p-3 text-left">Yield</th>
                      <th className="p-3 text-left">Quality</th>
                      <th className="p-3 text-left">Year</th>
                      <th className="p-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.historicalData.nearbyBoreholes.map((bh, i) => (
                      <tr key={i} className="border-b">
                        <td className="p-3">{bh.distance.toFixed(1)} km</td>
                        <td className="p-3">{bh.depth.toFixed(0)}m</td>
                        <td className="p-3">{bh.yield.toFixed(1)} m³/hr</td>
                        <td className="p-3 capitalize">{bh.waterQuality}</td>
                        <td className="p-3">{bh.year}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs ${
                            bh.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {bh.success ? 'Success' : 'Failed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Risks Tab */}
          {activeTab === 'risks' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h3 className="font-semibold text-gray-800">Overall Risk Level</h3>
                  <RiskBadge severity={result.riskAssessment.overallRisk} />
                </div>
              </div>

              <div className="space-y-3">
                {result.riskAssessment.factors.map((risk, i) => (
                  <div key={i} className="p-4 bg-white border rounded-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-800">{risk.type}</h4>
                          <RiskBadge severity={risk.severity} />
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{risk.description}</p>
                        <p className="text-sm text-green-700 mt-2">
                          <strong>Mitigation:</strong> {risk.mitigation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {result.riskAssessment.factors.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <span className="text-4xl mb-4 block">✅</span>
                  <p>No significant risks identified</p>
                </div>
              )}
            </div>
          )}

          {/* Recommendations Tab */}
          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-3">Drilling Recommendations</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-600">Recommended Depth</span>
                    <p className="font-medium text-gray-800">{result.recommendations.recommendedDepth.optimal}m (optimal)</p>
                    <p className="text-xs text-gray-500">Range: {result.recommendations.recommendedDepth.minimum}-{result.recommendations.recommendedDepth.maximum}m</p>
                  </div>
                  <div>
                    <span className="text-blue-600">Expected Yield</span>
                    <p className="font-medium text-gray-800">{result.recommendations.estimatedYield.conservative}-{result.recommendations.estimatedYield.optimistic} m³/hour</p>
                  </div>
                  <div>
                    <span className="text-blue-600">Drilling Method</span>
                    <p className="font-medium text-gray-800">{result.recommendations.drillingMethod}</p>
                  </div>
                  <div>
                    <span className="text-blue-600">Casing</span>
                    <p className="font-medium text-gray-800 text-xs">{result.recommendations.casingRequirements}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Recommended Equipment</h3>
                <div className="flex flex-wrap gap-2">
                  {result.recommendations.additionalEquipment.map((equip, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                      {equip}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Next Steps</h3>
                <div className="space-y-2">
                  {result.nextSteps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-blue-500 font-bold">{i + 1}</span>
                      <p className="text-sm text-gray-700">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg">
                <h3 className="font-semibold text-cyan-800 mb-2">AI-Powered Confidence</h3>
                <p className="text-sm text-cyan-700">
                  This analysis uses the same satellite imagery, LiDAR, and remote sensing technologies employed by
                  leading geological survey companies worldwide. Our AI integrates data from Sentinel-2, Landsat-8,
                  MODIS, and Kenya&apos;s geological databases to deliver reliable groundwater assessments.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t flex flex-wrap gap-4">
          <button
            onClick={generatePDFReport}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Report
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Analyze Another Site
          </button>
          <a
            href="tel:+254768860665"
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Request Site Visit
          </a>
        </div>
      </div>
    );
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto">
      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
          <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {/* Step Progress */}
      <div className="flex items-center justify-between mb-8">
        {['Upload Photo', 'Set Location', 'AI Analysis', 'Results'].map((label, i) => {
          const stepNames = ['upload', 'location', 'analyzing', 'results'];
          const currentIndex = stepNames.indexOf(step);
          const isComplete = i < currentIndex;
          const isCurrent = i === currentIndex;

          return (
            <div key={i} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                isComplete ? 'bg-green-500 text-white' :
                isCurrent ? 'bg-blue-600 text-white' :
                'bg-gray-200 text-gray-500'
              }`}>
                {isComplete ? '✓' : i + 1}
              </div>
              <span className={`ml-2 text-sm hidden sm:inline ${
                isCurrent ? 'text-blue-600 font-medium' : 'text-gray-500'
              }`}>
                {label}
              </span>
              {i < 3 && (
                <div className={`w-12 lg:w-24 h-1 mx-2 ${
                  isComplete ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      {step === 'upload' && renderUploadStep()}
      {step === 'location' && renderLocationStep()}
      {step === 'analyzing' && renderAnalyzingStep()}
      {step === 'results' && renderResultsStep()}
    </div>
  );
};

export default BoreholeAIAnalyzer;
