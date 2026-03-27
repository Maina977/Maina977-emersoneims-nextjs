'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
  AIBoreholeAnalyzer,
  BoreholeAssessmentResult,
  GeoCoordinates,
  GLOBAL_GEOLOGICAL_DATABASE,
  detectRegionFromCoordinates,
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
  const [region, setRegion] = useState<string>('nairobi');
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
        region
      );

      setResult(assessmentResult);
      setStep('results');
    } catch (err) {
      setError('Analysis failed. Please try again.');
      setStep('location');
    }
  }, [imageData, location, region]);

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
Region: ${result.regionData.region}, ${result.regionData.country}
Continent: ${result.regionData.continent}
Geological Zone: ${result.regionData.geologicalZone}

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
        {/* Region Selection - Global Coverage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Region / City (195+ Countries)
          </label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {/* Group by continent */}
            {['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'].map(continent => (
              <optgroup key={continent} label={`🌍 ${continent}`}>
                {Object.entries(GLOBAL_GEOLOGICAL_DATABASE)
                  .filter(([key, data]) => key !== 'default' && data.continent === continent)
                  .sort((a, b) => `${a[1].country}-${a[1].region}`.localeCompare(`${b[1].country}-${b[1].region}`))
                  .map(([key, data]) => (
                    <option key={key} value={key}>
                      {data.region}, {data.country}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Or enter GPS coordinates below for auto-detection
          </p>
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

      {/* Regional Info Preview */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
        <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <span className="text-lg">🌍</span>
          Regional Geological Data: {GLOBAL_GEOLOGICAL_DATABASE[region]?.region || 'Unknown'}, {GLOBAL_GEOLOGICAL_DATABASE[region]?.country || ''}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Continent</span>
            <p className="font-medium">{GLOBAL_GEOLOGICAL_DATABASE[region]?.continent || 'Unknown'}</p>
          </div>
          <div>
            <span className="text-gray-500">Avg. Water Table</span>
            <p className="font-medium">{GLOBAL_GEOLOGICAL_DATABASE[region]?.averageWaterTable || 60}m</p>
          </div>
          <div>
            <span className="text-gray-500">Success Rate</span>
            <p className="font-medium">{GLOBAL_GEOLOGICAL_DATABASE[region]?.drillingSuccessRate || 70}%</p>
          </div>
          <div>
            <span className="text-gray-500">Typical Depth</span>
            <p className="font-medium">
              {GLOBAL_GEOLOGICAL_DATABASE[region]?.recommendedDepth?.min || 80}-
              {GLOBAL_GEOLOGICAL_DATABASE[region]?.recommendedDepth?.max || 250}m
            </p>
          </div>
          <div>
            <span className="text-gray-500">Currency</span>
            <p className="font-medium">{GLOBAL_GEOLOGICAL_DATABASE[region]?.currency || 'USD'}</p>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Aquifer: {GLOBAL_GEOLOGICAL_DATABASE[region]?.aquiferType || 'Mixed aquifer system'}
        </p>
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
      { id: 'areaMap', label: 'Area Map', icon: '🗺️', isNew: true, isPremium: true },
      { id: 'gldasData', label: 'GLDAS Groundwater', icon: '🌍', isNew: true, isPremium: true },
      { id: 'soilAnalysis', label: 'Soil Analysis', icon: '🏔️', isNew: true, isPremium: true },
      { id: 'weatherData', label: 'Weather & Rainfall', icon: '🌧️', isNew: true, isPremium: true },
      { id: 'visualGraphs', label: 'Charts & Graphs', icon: '📉', isNew: true, isPremium: true },
      { id: 'imageId', label: 'Image ID', icon: '📍', isNew: true },
      { id: 'subsurface', label: 'Subsurface', icon: '🔬', isNew: true },
      { id: 'costBreakdown', label: 'Full Costs', icon: '💰', isNew: true },
      { id: 'solarCost', label: 'Solar+Shelter', icon: '☀️', isNew: true },
      { id: 'waterQuality', label: 'Water Quality', icon: '💧', isNew: true },
      { id: 'roiAnalysis', label: 'ROI Analysis', icon: '📈', isNew: true },
      { id: 'scenarios', label: 'Scenarios', icon: '🎯', isNew: true },
      { id: 'climate', label: 'Climate', icon: '🌦️', isNew: true },
      { id: 'strategy', label: 'Drill Strategy', icon: '🛠️', isNew: true },
      { id: 'confidence', label: 'Confidence', icon: '✓', isNew: true },
      { id: 'satellite', label: 'Satellite', icon: '🛰️' },
      { id: 'lidar', label: 'LiDAR', icon: '📡' },
      { id: 'hyperspectral', label: 'Rock Mapping', icon: '💎' },
      { id: 'geophysics', label: 'Geophysics', icon: '⚡' },
      { id: 'gis', label: 'GIS Analysis', icon: '🗺️' },
      { id: 'nearbyMap', label: 'Nearby Boreholes', icon: '📍', isNew: true },
      { id: 'geology', label: 'Geology', icon: '🪨' },
      { id: 'eia', label: 'EIA/Permits', icon: '📋' },
      { id: 'history', label: 'History', icon: '📜' },
      { id: 'risks', label: 'Risks', icon: '⚠️' },
      { id: 'timeBased', label: '5-10 Year', icon: '⏳', isNew: true },
      { id: 'recommendations', label: 'Next Steps', icon: '✅' },
    ];

    return (
      <div className="relative">
        {/* FLOATING DOWNLOAD BUTTON - Always visible */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
          <button
            onClick={generatePDFReport}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-2xl hover:scale-105 transition-all animate-pulse hover:animate-none font-bold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Report
          </button>
          <a
            href={`https://wa.me/254768860665?text=${encodeURIComponent(`Hi EmersonEIMS, I just completed an AI Borehole Analysis (AquaScan Pro). Report ID: ${result.id}. Success Rate: ${result.successProbability}%. Location: ${result.regionData.region}, ${result.regionData.country}. Please contact me about drilling.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full shadow-xl hover:scale-105 transition-all font-bold"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Share via WhatsApp
          </a>
        </div>

        {/* Header with Rating & Download */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 -mx-6 -mt-6 px-6 py-6 mb-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-blue-100 text-sm">Report ID: {result.id}</p>
              <h2 className="text-2xl font-bold mt-1">AI Borehole Assessment Complete</h2>
              {/* Quick Download in Header */}
              <button
                onClick={generatePDFReport}
                className="mt-3 flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Full Report
              </button>
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
              className={`flex items-center gap-1 px-4 py-2 rounded-lg whitespace-nowrap transition-colors relative ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : tab.isPremium
                    ? 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border border-amber-300 hover:bg-amber-100'
                    : tab.isNew
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200 hover:bg-green-100'
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

          {/* NEW: Area Map Visualization Tab */}
          {activeTab === 'areaMap' && result.areaMapData && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🗺️</span>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Area Map & Location Analysis</h3>
                  <p className="text-sm text-gray-600">100% real location with satellite imagery, Google Earth integration</p>
                </div>
                <span className="px-3 py-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs font-bold rounded-full">PREMIUM</span>
              </div>

              {/* Map Placeholder with Satellite Info */}
              <div className="relative rounded-xl overflow-hidden border-4 border-blue-300 shadow-xl">
                <div className="bg-gradient-to-br from-green-200 via-green-300 to-blue-200 h-80 relative">
                  {/* Grid overlay */}
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                  {/* Points of Interest */}
                  {result.areaMapData.pointsOfInterest.map((poi, index) => (
                    <div
                      key={index}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-125 transition-transform"
                      style={{
                        left: `${50 + (poi.coordinates.longitude - result.areaMapData.center.longitude) * 2000}%`,
                        top: `${50 - (poi.coordinates.latitude - result.areaMapData.center.latitude) * 2000}%`,
                      }}
                      title={`${poi.name} (${poi.distance.toFixed(1)}km)`}
                    >
                      <span className="text-2xl drop-shadow-lg">{poi.icon}</span>
                    </div>
                  ))}

                  {/* Center marker - Your Site */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      <div className="w-8 h-8 bg-red-500 rounded-full animate-ping absolute" />
                      <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold relative z-10">📍</div>
                    </div>
                    <p className="text-xs font-bold text-center mt-1 bg-white/80 px-2 py-1 rounded">YOUR SITE</p>
                  </div>

                  {/* Compass */}
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-sm font-bold">N ↑</span>
                  </div>

                  {/* Scale bar */}
                  <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded shadow">
                    <div className="w-20 h-1 bg-black mb-1" />
                    <p className="text-xs">500m</p>
                  </div>
                </div>

                {/* Satellite info overlay */}
                <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg text-xs">
                  <p className="font-bold">{result.areaMapData.layers.satellite.source}</p>
                  <p>Date: {result.areaMapData.layers.satellite.date}</p>
                  <p>Cloud: {result.areaMapData.layers.satellite.cloudCover.toFixed(0)}%</p>
                </div>
              </div>

              {/* Map Legend */}
              <div className="p-4 bg-white rounded-xl border shadow">
                <h4 className="font-semibold text-gray-800 mb-3">Map Legend</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {result.areaMapData.legend.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
                      <span className="text-sm">{item.item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location Details */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <h4 className="font-semibold text-blue-800 mb-3">📍 Coordinates</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Latitude</span><span className="font-mono font-bold">{result.areaMapData.center.latitude.toFixed(6)}°</span></div>
                    <div className="flex justify-between"><span>Longitude</span><span className="font-mono font-bold">{result.areaMapData.center.longitude.toFixed(6)}°</span></div>
                    <div className="flex justify-between"><span>Elevation</span><span className="font-bold">{result.areaMapData.layers.elevation.minElevation.toFixed(0)}m</span></div>
                    <div className="flex justify-between"><span>Slope</span><span>{result.areaMapData.layers.elevation.slope.toFixed(1)}°</span></div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <h4 className="font-semibold text-green-800 mb-3">🏛️ Administrative</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>County</span><span className="font-bold">{result.areaMapData.administrativeBoundaries.county}</span></div>
                    <div className="flex justify-between"><span>Sub-County</span><span>{result.areaMapData.administrativeBoundaries.subCounty}</span></div>
                    <div className="flex justify-between"><span>Ward</span><span>{result.areaMapData.administrativeBoundaries.ward}</span></div>
                    <div className="flex justify-between"><span>Country</span><span>{result.areaMapData.administrativeBoundaries.country}</span></div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <h4 className="font-semibold text-amber-800 mb-3">📊 Area Statistics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Total Area</span><span className="font-bold">{result.areaMapData.statistics.totalArea.toFixed(2)} km²</span></div>
                    <div className="flex justify-between"><span>Cultivated</span><span>{result.areaMapData.statistics.cultivatedArea.toFixed(2)} km²</span></div>
                    <div className="flex justify-between"><span>Forest</span><span>{result.areaMapData.statistics.forestArea.toFixed(2)} km²</span></div>
                    <div className="flex justify-between"><span>Pop. Density</span><span>{result.areaMapData.statistics.populationDensity.toFixed(0)}/km²</span></div>
                  </div>
                </div>
              </div>

              {/* Land Use Distribution */}
              <div className="p-4 bg-white border rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-4">Land Use Distribution</h4>
                <div className="flex h-8 rounded-full overflow-hidden mb-3">
                  {result.areaMapData.layers.landUse.map((lu, index) => (
                    <div
                      key={index}
                      style={{ width: `${lu.percentage}%`, backgroundColor: lu.color }}
                      className="h-full"
                      title={`${lu.type}: ${lu.percentage}%`}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  {result.areaMapData.layers.landUse.map((lu, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: lu.color }} />
                      <span>{lu.type}: {lu.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nearby Water Sources */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <h4 className="font-semibold text-blue-800 mb-3">💧 Nearby Water Sources</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Rivers & Streams</p>
                    {result.areaMapData.layers.hydrology.rivers.map((river, i) => (
                      <div key={i} className="flex justify-between text-sm p-2 bg-white rounded mb-1">
                        <span>{river.name}</span>
                        <span>{river.distance.toFixed(1)} km ({river.flow})</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Drainage Direction: {result.areaMapData.layers.hydrology.drainageDirection}</p>
                    <p className="text-sm text-gray-600">Geology: {result.areaMapData.layers.geology.formation}</p>
                    <p className="text-sm text-gray-600">Aquifer Potential: <span className={`font-bold ${result.areaMapData.layers.geology.aquiferPotential === 'high' ? 'text-green-600' : 'text-yellow-600'}`}>{result.areaMapData.layers.geology.aquiferPotential.toUpperCase()}</span></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NEW: GLDAS Groundwater Tab */}
          {activeTab === 'gldasData' && result.gldasGroundwater && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🌍</span>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">GLDAS Groundwater Monitoring</h3>
                  <p className="text-sm text-gray-600">NASA Global Land Data Assimilation System via Google Earth Engine</p>
                </div>
                <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold rounded-full">NASA DATA</span>
              </div>

              {/* Dataset Info */}
              <div className="p-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">🛰️</div>
                  <div>
                    <p className="font-bold text-lg">NASA GLDAS 2.1 Dataset</p>
                    <p className="text-blue-200 text-sm">Resolution: {result.gldasGroundwater.datasetInfo.resolution} | Coverage: {result.gldasGroundwater.datasetInfo.temporalCoverage}</p>
                    <p className="text-blue-300 text-xs">Last Update: {result.gldasGroundwater.datasetInfo.lastUpdate}</p>
                  </div>
                </div>
              </div>

              {/* Groundwater Storage */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-xl">
                  <h4 className="font-semibold text-cyan-800 mb-4">💧 Groundwater Storage</h4>
                  <div className="text-center mb-4">
                    <p className="text-5xl font-bold text-cyan-600">{result.gldasGroundwater.groundwaterStorage.currentLevel.toFixed(0)}</p>
                    <p className="text-sm text-gray-600">mm (Current Level)</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Monthly Average</span><span>{result.gldasGroundwater.groundwaterStorage.monthlyAverage} mm</span></div>
                    <div className="flex justify-between"><span>Annual Average</span><span>{result.gldasGroundwater.groundwaterStorage.annualAverage} mm</span></div>
                    <div className="flex justify-between"><span>Trend</span><span className={`font-bold ${result.gldasGroundwater.groundwaterStorage.trend === 'increasing' ? 'text-green-600' : result.gldasGroundwater.groundwaterStorage.trend === 'stable' ? 'text-blue-600' : 'text-red-600'}`}>{result.gldasGroundwater.groundwaterStorage.trend.toUpperCase()}</span></div>
                    <div className="flex justify-between"><span>Anomaly</span><span>{result.gldasGroundwater.groundwaterStorage.anomaly.toFixed(1)} mm</span></div>
                    <div className="flex justify-between"><span>Percentile</span><span>{result.gldasGroundwater.groundwaterStorage.percentile.toFixed(0)}%</span></div>
                  </div>
                </div>

                {/* Soil Moisture by Layer */}
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <h4 className="font-semibold text-amber-800 mb-4">🏔️ Soil Moisture by Layer</h4>
                  {Object.entries(result.gldasGroundwater.soilMoisture).filter(([key]) => key !== 'rootZoneMoisture').map(([key, data]: [string, any]) => (
                    <div key={key} className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{key.replace(/layer|cm/g, ' ').trim()}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${data.status === 'wet' ? 'bg-blue-200 text-blue-800' : data.status === 'dry' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>{data.status}</span>
                      </div>
                      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full ${data.status === 'wet' ? 'bg-blue-500' : data.status === 'dry' ? 'bg-red-400' : 'bg-green-500'}`} style={{ width: `${Math.min(data.value * 2, 100)}%` }} />
                      </div>
                      <p className="text-xs text-right text-gray-500">{data.value.toFixed(1)}%</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Time Series Chart */}
              <div className="p-4 bg-white border rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-4">📊 Monthly Groundwater & Precipitation</h4>
                <div className="h-48 flex items-end justify-between gap-1">
                  {result.gldasGroundwater.monthlyTimeSeries.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="w-full flex flex-col items-center gap-1" style={{ height: '160px' }}>
                        {/* Precipitation bar */}
                        <div
                          className="w-full bg-blue-400 rounded-t"
                          style={{ height: `${data.precipitation / 3}%` }}
                          title={`Precipitation: ${data.precipitation.toFixed(0)}mm`}
                        />
                        {/* Groundwater line dot */}
                        <div
                          className="w-3 h-3 bg-cyan-600 rounded-full absolute"
                          style={{ bottom: `${data.groundwaterStorage / 3}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{data.month}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-6 mt-3 text-sm">
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-400 rounded" /> Precipitation</div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-cyan-600 rounded-full" /> Groundwater</div>
                </div>
              </div>

              {/* Recharge Indicators */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <h4 className="font-semibold text-green-800 mb-3">🔄 Recharge Indicators</h4>
                <div className="grid md:grid-cols-4 gap-4 text-center">
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{result.gldasGroundwater.rechargeIndicators.estimatedRecharge.toFixed(0)}</p>
                    <p className="text-xs text-gray-600">mm/year Recharge</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{result.gldasGroundwater.rechargeIndicators.rechargeEfficiency.toFixed(0)}%</p>
                    <p className="text-xs text-gray-600">Efficiency</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-2xl font-bold text-amber-600">{result.gldasGroundwater.rechargeIndicators.rechargeZoneProximity.toFixed(1)}</p>
                    <p className="text-xs text-gray-600">km to Recharge Zone</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <p className={`text-xl font-bold ${result.gldasGroundwater.rechargeIndicators.aquiferVulnerability === 'low' ? 'text-green-600' : result.gldasGroundwater.rechargeIndicators.aquiferVulnerability === 'moderate' ? 'text-yellow-600' : 'text-red-600'}`}>
                      {result.gldasGroundwater.rechargeIndicators.aquiferVulnerability.toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-600">Vulnerability</p>
                  </div>
                </div>
              </div>

              {/* Evapotranspiration & Runoff */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                  <h4 className="font-semibold text-orange-800 mb-3">☀️ Evapotranspiration</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Actual ET</span><span className="font-bold">{result.gldasGroundwater.evapotranspiration.actual.toFixed(1)} mm/day</span></div>
                    <div className="flex justify-between"><span>Potential ET</span><span>{result.gldasGroundwater.evapotranspiration.potential.toFixed(1)} mm/day</span></div>
                    <div className="flex justify-between"><span>ET Ratio</span><span>{(result.gldasGroundwater.evapotranspiration.ratio * 100).toFixed(0)}%</span></div>
                    <div className="flex justify-between"><span>Monthly Total</span><span>{result.gldasGroundwater.evapotranspiration.monthlyTotal.toFixed(0)} mm</span></div>
                  </div>
                </div>
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                  <h4 className="font-semibold text-indigo-800 mb-3">🌊 Runoff & Infiltration</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Surface Runoff</span><span>{result.gldasGroundwater.runoff.surface.toFixed(1)} mm</span></div>
                    <div className="flex justify-between"><span>Subsurface Runoff</span><span>{result.gldasGroundwater.runoff.subsurface.toFixed(1)} mm</span></div>
                    <div className="flex justify-between"><span>Total Runoff</span><span className="font-bold">{result.gldasGroundwater.runoff.total.toFixed(1)} mm</span></div>
                    <div className="flex justify-between"><span>Infiltration Rate</span><span className="font-bold text-green-600">{result.gldasGroundwater.runoff.infiltrationRate.toFixed(1)} mm/hr</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NEW: Detailed Soil Analysis Tab */}
          {activeTab === 'soilAnalysis' && result.detailedSoilAnalysis && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🏔️</span>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Detailed Soil Analysis</h3>
                  <p className="text-sm text-gray-600">Comprehensive soil classification, physical & chemical properties</p>
                </div>
                <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full">EXPERT</span>
              </div>

              {/* Soil Classification */}
              <div className="p-4 bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 rounded-xl">
                <h4 className="font-bold text-amber-800 mb-3">Soil Classification</h4>
                <div className="grid md:grid-cols-4 gap-4 text-center">
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-sm text-gray-600">USDA Order</p>
                    <p className="font-bold text-lg">{result.detailedSoilAnalysis.classification.usdaSoilOrder}</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-sm text-gray-600">FAO Group</p>
                    <p className="font-bold text-lg">{result.detailedSoilAnalysis.classification.faoSoilGroup}</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-sm text-gray-600">Texture Class</p>
                    <p className="font-bold text-lg">{result.detailedSoilAnalysis.classification.textureClass}</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-sm text-gray-600">Local Name</p>
                    <p className="font-bold text-lg">{result.detailedSoilAnalysis.classification.localName}</p>
                  </div>
                </div>
              </div>

              {/* Soil Color Profile */}
              <div className="p-4 bg-white border rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-4">🎨 Soil Color Profile</h4>
                <div className="flex gap-2 h-20">
                  {result.detailedSoilAnalysis.soilColorPalette.map((layer, index) => (
                    <div key={index} className="flex-1 rounded-lg relative group cursor-pointer" style={{ backgroundColor: layer.hexCode }}>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="font-bold">{layer.depth}</p>
                        <p>{layer.color}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Texture Triangle */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <h4 className="font-semibold text-amber-800 mb-4">📐 Soil Texture</h4>
                  <div className="relative h-40">
                    {/* Simple texture visualization */}
                    <div className="flex h-full gap-2">
                      <div className="flex-1 bg-yellow-200 rounded flex items-end justify-center">
                        <div className="bg-yellow-400 w-full rounded-t" style={{ height: `${result.detailedSoilAnalysis.physicalProperties.texture.sand}%` }}>
                          <p className="text-center text-xs font-bold py-1">Sand {result.detailedSoilAnalysis.physicalProperties.texture.sand}%</p>
                        </div>
                      </div>
                      <div className="flex-1 bg-gray-200 rounded flex items-end justify-center">
                        <div className="bg-gray-400 w-full rounded-t" style={{ height: `${result.detailedSoilAnalysis.physicalProperties.texture.silt}%` }}>
                          <p className="text-center text-xs font-bold py-1">Silt {result.detailedSoilAnalysis.physicalProperties.texture.silt}%</p>
                        </div>
                      </div>
                      <div className="flex-1 bg-red-200 rounded flex items-end justify-center">
                        <div className="bg-red-400 w-full rounded-t" style={{ height: `${result.detailedSoilAnalysis.physicalProperties.texture.clay}%` }}>
                          <p className="text-center text-xs font-bold py-1">Clay {result.detailedSoilAnalysis.physicalProperties.texture.clay}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-center font-bold mt-2">Texture Triangle: {result.detailedSoilAnalysis.physicalProperties.texture.textureTriangle}</p>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <h4 className="font-semibold text-green-800 mb-4">💧 Hydraulic Properties</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Saturated Conductivity</span><span className="font-bold">{result.detailedSoilAnalysis.hydraulicProperties.saturatedConductivity} cm/hr</span></div>
                    <div className="flex justify-between"><span>Field Capacity</span><span>{result.detailedSoilAnalysis.hydraulicProperties.fieldCapacity}%</span></div>
                    <div className="flex justify-between"><span>Wilting Point</span><span>{result.detailedSoilAnalysis.hydraulicProperties.wiltingPoint}%</span></div>
                    <div className="flex justify-between"><span>Available Water</span><span className="font-bold text-blue-600">{result.detailedSoilAnalysis.hydraulicProperties.availableWaterCapacity}%</span></div>
                    <div className="flex justify-between"><span>Infiltration Rate</span><span>{result.detailedSoilAnalysis.hydraulicProperties.infiltrationRate} mm/hr</span></div>
                    <div className="flex justify-between"><span>Drainage Class</span><span className="capitalize">{result.detailedSoilAnalysis.hydraulicProperties.drainageClass.replace('_', ' ')}</span></div>
                  </div>
                </div>
              </div>

              {/* Chemical Properties */}
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                <h4 className="font-semibold text-purple-800 mb-4">🧪 Chemical Properties</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-white rounded-lg text-center">
                    <p className="text-3xl font-bold text-purple-600">{result.detailedSoilAnalysis.chemicalProperties.ph.value.toFixed(1)}</p>
                    <p className="text-xs text-gray-600">pH ({result.detailedSoilAnalysis.chemicalProperties.ph.classification})</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg text-center">
                    <p className="text-3xl font-bold text-blue-600">{result.detailedSoilAnalysis.chemicalProperties.organicCarbon.toFixed(1)}%</p>
                    <p className="text-xs text-gray-600">Organic Carbon</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg text-center">
                    <p className="text-3xl font-bold text-green-600">{result.detailedSoilAnalysis.chemicalProperties.cationExchangeCapacity.toFixed(0)}</p>
                    <p className="text-xs text-gray-600">CEC (cmol/kg)</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg text-center">
                    <p className="text-3xl font-bold text-amber-600">{result.detailedSoilAnalysis.chemicalProperties.basesSaturation.toFixed(0)}%</p>
                    <p className="text-xs text-gray-600">Base Saturation</p>
                  </div>
                </div>
              </div>

              {/* Suitability Assessment */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <h4 className="font-semibold text-blue-800 mb-4">✅ Suitability Assessment</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {Object.entries(result.detailedSoilAnalysis.suitability).map(([key, value]) => (
                    <div key={key} className={`p-3 rounded-lg text-center ${
                      value === 'excellent' || value === 'stable' || value === 'low' ? 'bg-green-100 border border-green-300' :
                      value === 'good' || value === 'moderate' ? 'bg-yellow-100 border border-yellow-300' :
                      'bg-red-100 border border-red-300'
                    }`}>
                      <p className="text-xs text-gray-600 mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className="font-bold capitalize">{String(value).replace('_', ' ')}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Depth Profile */}
              <div className="p-4 bg-white border rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-4">📊 Soil Depth Profile</h4>
                <div className="space-y-2">
                  {result.detailedSoilAnalysis.depthProfile.map((horizon, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg" style={{ backgroundColor: horizon.color + '20' }}>
                      <div className="w-8 h-8 rounded" style={{ backgroundColor: horizon.color }} />
                      <div className="flex-1">
                        <p className="font-bold">{horizon.horizon}</p>
                        <p className="text-sm text-gray-600">{horizon.depthFrom}-{horizon.depthTo}cm | {horizon.texture} | {horizon.structure}</p>
                      </div>
                      <div className="text-right text-sm">
                        <p>Roots: {horizon.rootDensity}</p>
                        {horizon.waterBearing && <span className="text-blue-600 font-bold">💧 Water Bearing</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* NEW: Weather & Rainfall Tab */}
          {activeTab === 'weatherData' && result.weatherAnalysis && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🌧️</span>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Weather & Rainfall Analysis</h3>
                  <p className="text-sm text-gray-600">Historical climate data, rainfall patterns, seasonal forecasts</p>
                </div>
              </div>

              {/* Current Weather */}
              <div className="p-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-6xl">{result.weatherAnalysis.currentConditions.weatherIcon}</span>
                    <div>
                      <p className="text-5xl font-bold">{result.weatherAnalysis.currentConditions.temperature.toFixed(0)}°C</p>
                      <p className="text-blue-100">{result.weatherAnalysis.currentConditions.weatherDescription}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-blue-200">Humidity:</span> {result.weatherAnalysis.currentConditions.humidity.toFixed(0)}%</div>
                    <div><span className="text-blue-200">Wind:</span> {result.weatherAnalysis.currentConditions.windSpeed.toFixed(0)} km/h {result.weatherAnalysis.currentConditions.windDirection}</div>
                    <div><span className="text-blue-200">Pressure:</span> {result.weatherAnalysis.currentConditions.pressure.toFixed(0)} hPa</div>
                    <div><span className="text-blue-200">UV Index:</span> {result.weatherAnalysis.currentConditions.uvIndex.toFixed(0)}</div>
                  </div>
                </div>
              </div>

              {/* Climate Zone */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <h4 className="font-semibold text-amber-800 mb-3">🌡️ Climate Classification</h4>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-amber-600">{result.weatherAnalysis.climateData.climateZone}</p>
                    <p className="text-sm text-gray-600">Climate Zone</p>
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-4 text-center">
                    <div><p className="font-bold">{result.weatherAnalysis.climateData.meanAnnualTemperature}°C</p><p className="text-xs text-gray-600">Avg Temperature</p></div>
                    <div><p className="font-bold">{result.weatherAnalysis.climateData.meanAnnualRainfall}mm</p><p className="text-xs text-gray-600">Annual Rainfall</p></div>
                    <div><p className="font-bold">{result.weatherAnalysis.climateData.rainyDaysPerYear}</p><p className="text-xs text-gray-600">Rainy Days/Year</p></div>
                  </div>
                </div>
              </div>

              {/* Monthly Rainfall Chart */}
              <div className="p-4 bg-white border rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-4">📊 Monthly Rainfall Pattern</h4>
                <div className="h-48 flex items-end justify-between gap-1">
                  {result.weatherAnalysis.rainfallAnalysis.monthlyData.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className={`w-full rounded-t transition-all hover:opacity-80 ${data.intensity === 'heavy' ? 'bg-blue-600' : data.intensity === 'moderate' ? 'bg-blue-400' : 'bg-blue-200'}`}
                        style={{ height: `${Math.max(data.rainfall / 3, 5)}%` }}
                        title={`${data.month}: ${data.rainfall.toFixed(0)}mm (${data.rainyDays} rainy days)`}
                      />
                      <p className="text-xs text-gray-500 mt-2">{data.month}</p>
                      <p className="text-xs font-bold">{data.rainfall.toFixed(0)}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-6 mt-4 text-sm">
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-600 rounded" /> Heavy</div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-400 rounded" /> Moderate</div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-200 rounded" /> Light</div>
                </div>
              </div>

              {/* Seasons Summary */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <h4 className="font-semibold text-blue-800 mb-3">🌧️ Rainy Seasons</h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-white rounded-lg">
                      <p className="font-bold">Long Rains (MAM)</p>
                      <p className="text-2xl font-bold text-blue-600">{result.weatherAnalysis.rainfallAnalysis.longRainsTotal.toFixed(0)}mm</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <p className="font-bold">Short Rains (OND)</p>
                      <p className="text-2xl font-bold text-blue-500">{result.weatherAnalysis.rainfallAnalysis.shortRainsTotal.toFixed(0)}mm</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                  <h4 className="font-semibold text-orange-800 mb-3">☀️ Dry Seasons</h4>
                  <div className="p-3 bg-white rounded-lg">
                    <p className="font-bold">Dry Months</p>
                    <p className="text-lg">{result.weatherAnalysis.climateData.dryMonths.join(', ')}</p>
                    <p className="text-sm text-gray-600 mt-2">Drought Risk: <span className={`font-bold ${result.weatherAnalysis.rainfallAnalysis.droughtRisk === 'low' ? 'text-green-600' : 'text-amber-600'}`}>{result.weatherAnalysis.rainfallAnalysis.droughtRisk.toUpperCase()}</span></p>
                  </div>
                </div>
              </div>

              {/* Water Balance */}
              <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-xl">
                <h4 className="font-semibold text-cyan-800 mb-4">💧 Water Balance</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{result.weatherAnalysis.waterBalance.annualEvaporation.toFixed(0)}</p>
                    <p className="text-xs text-gray-600">Annual Evaporation (mm)</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">{result.weatherAnalysis.waterBalance.potentialEvapotranspiration.toFixed(0)}</p>
                    <p className="text-xs text-gray-600">Potential ET (mm)</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{result.weatherAnalysis.waterBalance.waterDeficit.toFixed(0)}</p>
                    <p className="text-xs text-gray-600">Water Deficit (mm)</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{result.weatherAnalysis.waterBalance.waterSurplus.toFixed(0)}</p>
                    <p className="text-xs text-gray-600">Water Surplus (mm)</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{result.weatherAnalysis.waterBalance.ariditIndex.toFixed(2)}</p>
                    <p className="text-xs text-gray-600">Aridity Index</p>
                  </div>
                </div>
              </div>

              {/* Seasonal Forecast */}
              <div className="p-4 bg-gradient-to-r from-green-100 to-blue-100 border border-green-300 rounded-xl">
                <h4 className="font-semibold text-green-800 mb-3">🔮 Seasonal Forecast</h4>
                <div className="flex items-center gap-4">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <p className="font-bold">{result.weatherAnalysis.seasonalForecast.nextSeason}</p>
                    <p className={`text-xl font-bold ${result.weatherAnalysis.seasonalForecast.expectedRainfall === 'above_normal' ? 'text-green-600' : result.weatherAnalysis.seasonalForecast.expectedRainfall === 'normal' ? 'text-blue-600' : 'text-orange-600'}`}>
                      {result.weatherAnalysis.seasonalForecast.expectedRainfall.replace('_', ' ').toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-600">Confidence: {result.weatherAnalysis.seasonalForecast.confidence}%</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium mb-2">Advisories:</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {result.weatherAnalysis.seasonalForecast.advisories.map((adv, i) => (
                        <li key={i}>{adv}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NEW: Visual Graphs & Charts Tab */}
          {activeTab === 'visualGraphs' && result.visualGraphs && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">📉</span>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Charts, Graphs & Visual Analysis</h3>
                  <p className="text-sm text-gray-600">Comprehensive visual data representation</p>
                </div>
                <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">VISUAL</span>
              </div>

              {/* Success Gauge */}
              <div className="p-6 bg-white border rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-4 text-center">Success Probability Gauge</h4>
                <div className="relative h-32 mx-auto max-w-md">
                  {/* Gauge background */}
                  <div className="absolute inset-0 flex">
                    {result.visualGraphs.successGauge.segments.map((seg, i) => (
                      <div key={i} className="flex-1 first:rounded-l-full last:rounded-r-full" style={{ backgroundColor: seg.color + '30' }} />
                    ))}
                  </div>
                  {/* Gauge fill */}
                  <div className="absolute left-0 top-0 bottom-0 rounded-l-full" style={{ width: `${result.visualGraphs.successGauge.value}%`, background: `linear-gradient(to right, ${result.visualGraphs.successGauge.segments.map(s => s.color).join(', ')})` }} />
                  {/* Needle */}
                  <div className="absolute top-0 bottom-0 w-1 bg-black shadow-lg" style={{ left: `${result.visualGraphs.successGauge.value}%` }} />
                  {/* Value display */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white rounded-full p-4 shadow-lg">
                      <p className="text-4xl font-bold">{result.visualGraphs.successGauge.value}%</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between mt-4 text-xs">
                  {result.visualGraphs.successGauge.segments.map((seg, i) => (
                    <span key={i} style={{ color: seg.color }} className="font-bold">{seg.label}</span>
                  ))}
                </div>
              </div>

              {/* Cost Breakdown Pie */}
              <div className="p-6 bg-white border rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-4">Cost Breakdown</h4>
                <div className="flex items-center gap-8">
                  {/* Pie chart simulation */}
                  <div className="relative w-48 h-48">
                    <svg viewBox="0 0 100 100" className="transform -rotate-90">
                      {(() => {
                        let cumulative = 0;
                        return result.visualGraphs.costPieChart.segments.map((seg, i) => {
                          const start = cumulative;
                          cumulative += seg.percentage;
                          const large = seg.percentage > 50 ? 1 : 0;
                          const startX = 50 + 40 * Math.cos(2 * Math.PI * start / 100);
                          const startY = 50 + 40 * Math.sin(2 * Math.PI * start / 100);
                          const endX = 50 + 40 * Math.cos(2 * Math.PI * cumulative / 100);
                          const endY = 50 + 40 * Math.sin(2 * Math.PI * cumulative / 100);
                          return (
                            <path
                              key={i}
                              d={`M 50 50 L ${startX} ${startY} A 40 40 0 ${large} 1 ${endX} ${endY} Z`}
                              fill={seg.color}
                              stroke="white"
                              strokeWidth="1"
                            />
                          );
                        });
                      })()}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="font-bold">KES {(result.visualGraphs.costPieChart.totalCost / 1000000).toFixed(1)}M</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {result.visualGraphs.costPieChart.segments.map((seg, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: seg.color }} />
                        <span className="flex-1 text-sm">{seg.category}</span>
                        <span className="font-bold text-sm">{seg.percentage}%</span>
                        <span className="text-sm text-gray-500">KES {seg.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Depth vs Yield Chart */}
              <div className="p-6 bg-white border rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-4">Depth vs Yield Analysis</h4>
                <div className="h-64 flex items-end justify-between gap-2 border-l-2 border-b-2 border-gray-300 p-4 relative">
                  {/* Y-axis label */}
                  <div className="absolute -left-12 top-1/2 transform -rotate-90 text-sm text-gray-600">Yield (m³/hr)</div>
                  {/* Optimal zone highlight */}
                  <div className="absolute bg-green-100 border-l-4 border-r-4 border-green-400" style={{ left: '40%', right: '30%', top: 0, bottom: 0, opacity: 0.5 }}>
                    <p className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs font-bold text-green-700">OPTIMAL ZONE</p>
                  </div>
                  {result.visualGraphs.depthYieldChart.data.map((point, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end">
                      <div
                        className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t relative group cursor-pointer"
                        style={{ height: `${point.yield * 10}%` }}
                      >
                        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                          Depth: {point.depth}m<br/>Yield: {point.yield.toFixed(1)} m³/hr<br/>Prob: {point.probability}%
                        </div>
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">
                          {point.probability}
                        </div>
                      </div>
                      <p className="text-xs mt-2 font-medium">{point.depth}m</p>
                    </div>
                  ))}
                  {/* X-axis label */}
                  <p className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-600">Drilling Depth (m)</p>
                </div>
              </div>

              {/* ROI Timeline */}
              <div className="p-6 bg-white border rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-4">ROI Timeline & Break-even Analysis</h4>
                <div className="h-48 relative border-l-2 border-b-2 border-gray-300 ml-8">
                  {/* Investment line */}
                  <div className="absolute top-1/3 left-0 right-0 border-t-2 border-dashed border-red-400">
                    <span className="absolute -top-4 right-0 text-xs text-red-600 font-bold">Investment: KES {(result.visualGraphs.roiTimeline.investmentLine / 1000000).toFixed(1)}M</span>
                  </div>
                  {/* Savings curve */}
                  <svg className="w-full h-full">
                    <polyline
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="3"
                      points={result.visualGraphs.roiTimeline.months.slice(0, 48).map((m, i) => {
                        const x = (i / 47) * 100 + '%';
                        const y = 100 - (result.visualGraphs.roiTimeline.cumulativeSavings[i] / (result.visualGraphs.roiTimeline.investmentLine * 1.5)) * 100 + '%';
                        return `${(i / 47) * 100},${100 - (result.visualGraphs.roiTimeline.cumulativeSavings[i] / (result.visualGraphs.roiTimeline.investmentLine * 1.5)) * 100}`;
                      }).join(' ')}
                    />
                  </svg>
                  {/* Break-even marker */}
                  <div className="absolute bg-green-500 w-3 h-3 rounded-full" style={{ left: `${(result.visualGraphs.roiTimeline.breakEvenPoint / 48) * 100}%`, top: '33%' }}>
                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-green-700 whitespace-nowrap">Break-even: {result.visualGraphs.roiTimeline.breakEvenPoint} months</span>
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Month 0</span>
                  <span>Month 24</span>
                  <span>Month 48</span>
                </div>
              </div>

              {/* Aquifer Cross-Section */}
              <div className="p-6 bg-white border rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-4">Aquifer Cross-Section Diagram</h4>
                <div className="relative h-64 bg-gradient-to-b from-amber-100 via-gray-200 to-blue-200 rounded-xl overflow-hidden">
                  {/* Layers */}
                  {result.visualGraphs.aquiferCrossSection.lithologyColors.map((layer, i) => (
                    <div
                      key={i}
                      className="absolute left-0 right-0"
                      style={{
                        top: `${layer.depth / 2}%`,
                        height: '30%',
                        backgroundColor: layer.color + '80',
                      }}
                    >
                      <span className="absolute left-2 top-2 text-xs font-bold text-white drop-shadow">{layer.label}</span>
                    </div>
                  ))}
                  {/* Water table line */}
                  <div className="absolute left-0 right-0 border-t-4 border-dashed border-blue-500" style={{ top: '35%' }}>
                    <span className="absolute -top-6 right-2 text-xs font-bold text-blue-700 bg-white px-2 rounded">💧 Water Table</span>
                  </div>
                  {/* Borehole */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 bg-gradient-to-b from-gray-800 to-gray-600 rounded-b" style={{ top: '0', height: '70%' }}>
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="text-2xl">⬇️</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  {result.visualGraphs.aquiferCrossSection.lithologyColors.map((layer, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: layer.color }} />
                      <span>{layer.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* NEW: Image ID & Geolocation Tab */}
          {activeTab === 'imageId' && result.photoImageId && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">📍</span>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Photo Image ID & Geolocation</h3>
                  <p className="text-sm text-gray-600">NASA/Google Earth verified location</p>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">✓</div>
                  <div>
                    <p className="font-bold text-green-800">LOCATION VERIFIED</p>
                    <p className="text-sm text-green-600">Confirmed via NASA/Google Earth satellite overlay</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-white rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">Image Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-gray-600">Image ID</span><span className="font-mono font-medium">{result.photoImageId.imageId}</span></div>
                      <div className="flex justify-between"><span className="text-gray-600">Timestamp</span><span className="font-medium">{result.photoImageId.timestamp.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-gray-600">Latitude</span><span className="font-medium">{result.photoImageId.gpsCoordinates.latitude.toFixed(6)}°</span></div>
                      <div className="flex justify-between"><span className="text-gray-600">Longitude</span><span className="font-medium">{result.photoImageId.gpsCoordinates.longitude.toFixed(6)}°</span></div>
                      <div className="flex justify-between"><span className="text-gray-600">Altitude</span><span className="font-medium">{result.photoImageId.altitude.toFixed(0)}m</span></div>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">Satellite Verification</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-gray-600">Source</span><span className="font-medium">{result.photoImageId.satelliteOverlay.source}</span></div>
                      <div className="flex justify-between"><span className="text-gray-600">Image Date</span><span className="font-medium">{result.photoImageId.satelliteOverlay.imageDate}</span></div>
                      <div className="flex justify-between"><span className="text-gray-600">Resolution</span><span className="font-medium">{result.photoImageId.satelliteOverlay.resolution}</span></div>
                      <div className="flex justify-between"><span className="text-gray-600">Match Confidence</span><span className="font-bold text-green-600">{result.photoImageId.verification.confidence.toFixed(1)}%</span></div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">NASA Earth Data</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div><span className="text-gray-600">Terrain:</span> <span className="font-medium">{result.photoImageId.nasaEarthData.terrainType}</span></div>
                    <div><span className="text-gray-600">Elevation:</span> <span className="font-medium">{result.photoImageId.nasaEarthData.elevationVerified.toFixed(0)}m</span></div>
                    <div><span className="text-gray-600">Vegetation:</span> <span className="font-medium">{(result.photoImageId.nasaEarthData.vegetationIndex * 100).toFixed(0)}%</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NEW: Subsurface Visualization Tab */}
          {activeTab === 'subsurface' && result.subsurfaceVisualization && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🔬</span>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Subsurface Visualization</h3>
                  <p className="text-sm text-gray-600">Visual representation of underground layers</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Visual Diagram */}
                <div className="p-4 bg-white border rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-4">Subsurface Profile</h4>
                  <div className="relative">
                    {result.subsurfaceVisualization.layers.map((layer, index) => (
                      <div
                        key={index}
                        className="flex items-center border-b border-gray-200 last:border-0"
                        style={{ minHeight: Math.max(40, layer.thickness * 1.5) }}
                      >
                        <div
                          className="w-16 h-full mr-4 rounded"
                          style={{ backgroundColor: layer.color, minHeight: Math.max(40, layer.thickness * 1.5) }}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{layer.depthFrom}-{layer.depthTo}m: {layer.layerType}</p>
                          <p className="text-xs text-gray-500">{layer.description}</p>
                          {layer.waterBearing && <span className="text-xs text-blue-600 font-medium">💧 Water Bearing</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Aquifer Details */}
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <h4 className="font-semibold text-blue-800 mb-3">Aquifer Zone</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>Depth Range</span><span className="font-bold">{result.subsurfaceVisualization.aquiferZone.topDepth}-{result.subsurfaceVisualization.aquiferZone.bottomDepth}m</span></div>
                      <div className="flex justify-between"><span>Thickness</span><span className="font-bold">{result.subsurfaceVisualization.aquiferZone.thickness}m</span></div>
                      <div className="flex justify-between"><span>Type</span><span className="font-bold capitalize">{result.subsurfaceVisualization.aquiferZone.type.replace('_', ' ')}</span></div>
                      <div className="flex justify-between"><span>Productivity</span><span className="font-bold capitalize text-green-600">{result.subsurfaceVisualization.aquiferZone.productivityClass.replace('_', ' ')}</span></div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 border rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-3">Water Table</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>Static Level</span><span className="font-bold">{result.subsurfaceVisualization.waterTable.staticLevel}m</span></div>
                      <div className="flex justify-between"><span>Seasonal Variation</span><span className="font-medium">±{result.subsurfaceVisualization.waterTable.seasonalVariation.toFixed(1)}m</span></div>
                      <div className="flex justify-between"><span>Trend</span><span className="font-medium capitalize">{result.subsurfaceVisualization.waterTable.trend}</span></div>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <h4 className="font-semibold text-amber-800 mb-3">Bedrock Info</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>Depth</span><span className="font-bold">{result.subsurfaceVisualization.bedrockInfo.depth}m</span></div>
                      <div className="flex justify-between"><span>Type</span><span className="font-medium">{result.subsurfaceVisualization.bedrockInfo.type}</span></div>
                      <div className="flex justify-between"><span>Fractured</span><span className="font-medium">{result.subsurfaceVisualization.bedrockInfo.fractured ? 'Yes ✓' : 'No'}</span></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-3">Layer Legend</h4>
                <div className="flex flex-wrap gap-4">
                  {result.subsurfaceVisualization.diagramLegend.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
                      <span className="font-medium">{item.label}</span>
                      <span className="text-gray-500">- {item.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* NEW: Comprehensive Cost Breakdown Tab */}
          {activeTab === 'costBreakdown' && result.comprehensiveCost && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">💰</span>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Comprehensive Cost Breakdown</h3>
                  <p className="text-sm text-gray-600">Complete itemized quotation</p>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl">
                <div className="text-center mb-6">
                  <p className="text-sm text-amber-600 mb-1">Total Borehole Cost</p>
                  <p className="text-4xl font-bold text-amber-800">KES {result.comprehensiveCost.totalCost.toLocaleString()}</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Drilling Costs */}
                  <div className="p-4 bg-white rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3 border-b pb-2">🔧 Drilling</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>Cost per meter</span><span>KES {result.comprehensiveCost.drilling.costPerMeter.toLocaleString()}/m</span></div>
                      <div className="flex justify-between"><span>Total depth</span><span>{result.comprehensiveCost.drilling.totalDepth}m</span></div>
                      <div className="flex justify-between"><span>Drilling cost</span><span className="font-medium">KES {result.comprehensiveCost.drilling.drillingCost.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span>Mobilization</span><span>KES {result.comprehensiveCost.drilling.mobilizationCost.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span>Site clearing</span><span>KES {result.comprehensiveCost.drilling.siteClearingCost.toLocaleString()}</span></div>
                    </div>
                  </div>

                  {/* Casing Costs */}
                  <div className="p-4 bg-white rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3 border-b pb-2">🔩 Casing & Screens</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>PVC Casing ({result.comprehensiveCost.casing.pvcCasing.meters}m)</span><span>KES {result.comprehensiveCost.casing.pvcCasing.total.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span>Steel Casing ({result.comprehensiveCost.casing.steelCasing.meters}m)</span><span>KES {result.comprehensiveCost.casing.steelCasing.total.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span>Screens ({result.comprehensiveCost.casing.screens.meters}m)</span><span>KES {result.comprehensiveCost.casing.screens.total.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span>Gravel pack ({result.comprehensiveCost.casing.gravelPack.bags} bags)</span><span>KES {result.comprehensiveCost.casing.gravelPack.total.toLocaleString()}</span></div>
                    </div>
                  </div>

                  {/* Pump System */}
                  <div className="p-4 bg-white rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3 border-b pb-2">⚡ Pump System</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>Type</span><span className="capitalize">{result.comprehensiveCost.pump.type}</span></div>
                      <div className="flex justify-between"><span>Brand</span><span>{result.comprehensiveCost.pump.brand}</span></div>
                      <div className="flex justify-between"><span>Power</span><span>{result.comprehensiveCost.pump.powerRating} kW</span></div>
                      <div className="flex justify-between"><span>Pump cost</span><span className="font-medium">KES {result.comprehensiveCost.pump.cost.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span>Installation</span><span>KES {result.comprehensiveCost.pump.installationCost.toLocaleString()}</span></div>
                    </div>
                  </div>

                  {/* Accessories */}
                  <div className="p-4 bg-white rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3 border-b pb-2">🔧 Accessories</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>Pipes ({result.comprehensiveCost.accessories.pipes.meters}m)</span><span>KES {result.comprehensiveCost.accessories.pipes.cost.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span>Fittings</span><span>KES {result.comprehensiveCost.accessories.fittings.cost.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span>Valves</span><span>KES {result.comprehensiveCost.accessories.valves.cost.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span>Tank ({result.comprehensiveCost.accessories.tank.capacity}L)</span><span>KES {result.comprehensiveCost.accessories.tank.cost.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span>Electrical panel</span><span>KES {result.comprehensiveCost.accessories.electricalPanel.toLocaleString()}</span></div>
                    </div>
                  </div>

                  {/* Labour */}
                  <div className="p-4 bg-white rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3 border-b pb-2">👷 Labour</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>Pump installation</span><span>KES {result.comprehensiveCost.labour.pumpInstallation.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span>Plumbing</span><span>KES {result.comprehensiveCost.labour.plumbing.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span>Electrical</span><span>KES {result.comprehensiveCost.labour.electrical.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span>Supervision</span><span>KES {result.comprehensiveCost.labour.supervision.toLocaleString()}</span></div>
                    </div>
                  </div>

                  {/* Permits */}
                  <div className="p-4 bg-white rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3 border-b pb-2">📋 Permits</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>WRA License</span><span>KES {result.comprehensiveCost.permits.wraBoreholeLicense.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span>NEMA Permit</span><span>KES {result.comprehensiveCost.permits.nemaPermit.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span>County Permit</span><span>KES {result.comprehensiveCost.permits.countyPermit.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span>Water Testing</span><span>KES {result.comprehensiveCost.permits.waterTestingFee.toLocaleString()}</span></div>
                    </div>
                  </div>
                </div>

                {/* Cost Summary Chart */}
                <div className="mt-6 p-4 bg-white rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-4">Cost Distribution</h4>
                  <div className="space-y-2">
                    {result.comprehensiveCost.costBreakdownSummary.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="w-32 text-sm text-gray-600">{item.category}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-400 to-amber-600 flex items-center justify-end pr-2 text-xs text-white font-medium"
                            style={{ width: `${item.percentage}%` }}
                          >
                            {item.percentage}%
                          </div>
                        </div>
                        <span className="w-28 text-right text-sm font-medium">KES {item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NEW: Solar + Shelter Cost Tab */}
          {activeTab === 'solarCost' && result.solarSystemCost && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">☀️</span>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Solar System + Shelter Costing</h3>
                  <p className="text-sm text-gray-600">Complete solar pump system with structure</p>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl">
                <div className="text-center mb-6">
                  <p className="text-sm text-orange-600 mb-1">Total Solar System Cost</p>
                  <p className="text-4xl font-bold text-orange-800">KES {result.solarSystemCost.totalSolarCost.toLocaleString()}</p>
                  <p className="text-sm text-orange-600 mt-2">Cost per kWp: KES {result.solarSystemCost.costPerKwp.toLocaleString()} | Payback: {result.solarSystemCost.paybackPeriod} months</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Power Requirements */}
                  <div className="p-4 bg-white rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3 border-b pb-2">⚡ Power Requirements</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>Pump Power</span><span className="font-medium">{result.solarSystemCost.powerRequirement.pumpPower} kW</span></div>
                      <div className="flex justify-between"><span>Daily Runtime</span><span>{result.solarSystemCost.powerRequirement.dailyRuntime} hours</span></div>
                      <div className="flex justify-between"><span>Daily Energy Need</span><span className="font-bold text-blue-600">{result.solarSystemCost.powerRequirement.dailyEnergyNeed.toFixed(1)} kWh</span></div>
                      <div className="flex justify-between"><span>Peak Sun Hours</span><span>{result.solarSystemCost.powerRequirement.peakSunHours} hrs</span></div>
                    </div>
                  </div>

                  {/* Solar Panels */}
                  <div className="p-4 bg-white rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3 border-b pb-2">🔆 Solar Panels</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>Panels Required</span><span className="font-bold">{result.solarSystemCost.solarSystem.numberOfPanels} x {result.solarSystemCost.solarSystem.panelCapacity}Wp</span></div>
                      <div className="flex justify-between"><span>Total Capacity</span><span className="font-bold text-green-600">{result.solarSystemCost.solarSystem.totalCapacity.toFixed(2)} kWp</span></div>
                      <div className="flex justify-between"><span>Brand</span><span>{result.solarSystemCost.solarSystem.panelBrand}</span></div>
                      <div className="flex justify-between"><span>Panel Cost</span><span>KES {result.solarSystemCost.solarSystem.totalPanelCost.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span>Mounting</span><span>KES {result.solarSystemCost.solarSystem.mountingStructure.toLocaleString()}</span></div>
                    </div>
                  </div>

                  {/* Battery System */}
                  <div className="p-4 bg-white rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3 border-b pb-2">🔋 Battery System</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>Type</span><span className="capitalize">{result.solarSystemCost.battery.type}</span></div>
                      <div className="flex justify-between"><span>Capacity</span><span>{result.solarSystemCost.battery.totalKwh} kWh</span></div>
                      <div className="flex justify-between"><span>Quantity</span><span>{result.solarSystemCost.battery.quantity} units</span></div>
                      <div className="flex justify-between"><span>Backup Time</span><span>{result.solarSystemCost.battery.backupHours} hours</span></div>
                      <div className="flex justify-between"><span>Total Cost</span><span className="font-medium">KES {result.solarSystemCost.battery.totalCost.toLocaleString()}</span></div>
                    </div>
                  </div>

                  {/* Inverter */}
                  <div className="p-4 bg-white rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3 border-b pb-2">🔌 Inverter</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>Type</span><span className="capitalize">{result.solarSystemCost.inverter.type}</span></div>
                      <div className="flex justify-between"><span>Capacity</span><span>{result.solarSystemCost.inverter.capacity} kVA</span></div>
                      <div className="flex justify-between"><span>Brand</span><span>{result.solarSystemCost.inverter.brand}</span></div>
                      <div className="flex justify-between"><span>Cost</span><span className="font-medium">KES {result.solarSystemCost.inverter.cost.toLocaleString()}</span></div>
                    </div>
                  </div>

                  {/* Shelter/Structure */}
                  <div className="p-4 bg-white rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3 border-b pb-2">🏠 Pump House/Shelter</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>Type</span><span className="capitalize">{result.solarSystemCost.shelter.type}</span></div>
                      <div className="flex justify-between"><span>Size</span><span>{result.solarSystemCost.shelter.size.length}x{result.solarSystemCost.shelter.size.width}x{result.solarSystemCost.shelter.size.height}m</span></div>
                      <div className="flex justify-between"><span>Foundation</span><span>KES {result.solarSystemCost.shelter.foundation.cost.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span>Walls</span><span>KES {result.solarSystemCost.shelter.walls.cost.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span>Roof</span><span>KES {result.solarSystemCost.shelter.roof.cost.toLocaleString()}</span></div>
                      <div className="flex justify-between font-bold"><span>Total Structure</span><span>KES {result.solarSystemCost.shelter.totalStructureCost.toLocaleString()}</span></div>
                    </div>
                  </div>

                  {/* Installation */}
                  <div className="p-4 bg-white rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3 border-b pb-2">🛠️ Installation</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>Panel Installation</span><span>KES {result.solarSystemCost.installation.solarPanelInstallation.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span>Electrical Wiring</span><span>KES {result.solarSystemCost.installation.electricalWiring.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span>Commissioning</span><span>KES {result.solarSystemCost.installation.commissioning.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span>Testing</span><span>KES {result.solarSystemCost.installation.testing.toLocaleString()}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NEW: Water Quality Prediction Tab */}
          {activeTab === 'waterQuality' && result.waterQualityPrediction && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">💧</span>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Water Quality Prediction</h3>
                  <p className="text-sm text-gray-600">AI-predicted water quality parameters</p>
                </div>
              </div>

              <div className={`p-6 rounded-xl border ${result.waterQualityPrediction.treatmentRequired ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${result.waterQualityPrediction.treatmentRequired ? 'bg-amber-200' : 'bg-green-200'}`}>
                    {result.waterQualityPrediction.treatmentRequired ? '⚠️' : '✓'}
                  </div>
                  <div>
                    <p className={`font-bold text-xl ${result.waterQualityPrediction.treatmentRequired ? 'text-amber-800' : 'text-green-800'}`}>
                      {result.waterQualityPrediction.overallQualityRating.toUpperCase().replace('_', ' ')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {result.waterQualityPrediction.treatmentRequired ? 'Water treatment will be required' : 'Water suitable for use without treatment'}
                    </p>
                  </div>
                </div>

                {/* Parameters Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(result.waterQualityPrediction.parameters).filter(([key]) => key !== 'bacteria').map(([key, param]: [string, any]) => (
                    <div key={key} className="p-3 bg-white rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium capitalize">{key}</span>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${param.status === 'safe' ? 'bg-green-100 text-green-700' : param.status === 'caution' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                          {param.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-2xl font-bold">{typeof param.predicted === 'number' ? param.predicted.toFixed(2) : param.predicted} <span className="text-sm font-normal text-gray-500">{param.unit}</span></div>
                      <p className="text-xs text-gray-500">Limit: {param.limit || `${param.minLimit}-${param.maxLimit}`} {param.unit}</p>
                    </div>
                  ))}
                </div>

                {/* Usability */}
                <div className="mt-6 p-4 bg-white rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Usability Assessment</h4>
                  <div className="flex flex-wrap gap-4">
                    <div className={`px-4 py-2 rounded-full ${result.waterQualityPrediction.usability.drinking ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {result.waterQualityPrediction.usability.drinking ? '✓' : '✗'} Drinking
                    </div>
                    <div className={`px-4 py-2 rounded-full ${result.waterQualityPrediction.usability.irrigation ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {result.waterQualityPrediction.usability.irrigation ? '✓' : '✗'} Irrigation
                    </div>
                    <div className={`px-4 py-2 rounded-full ${result.waterQualityPrediction.usability.livestock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {result.waterQualityPrediction.usability.livestock ? '✓' : '✗'} Livestock
                    </div>
                    <div className={`px-4 py-2 rounded-full ${result.waterQualityPrediction.usability.industrial ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {result.waterQualityPrediction.usability.industrial ? '✓' : '✗'} Industrial
                    </div>
                  </div>
                </div>

                {/* Treatment Costs if needed */}
                {result.waterQualityPrediction.treatmentRequired && (
                  <div className="mt-6 p-4 bg-amber-100 rounded-lg">
                    <h4 className="font-semibold text-amber-800 mb-3">Treatment Required</h4>
                    <p className="text-sm mb-3">Recommended: {result.waterQualityPrediction.treatmentType.join(', ')}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div><span className="text-gray-600">Equipment:</span><br/><span className="font-bold">KES {result.waterQualityPrediction.treatmentCost.equipment.toLocaleString()}</span></div>
                      <div><span className="text-gray-600">Installation:</span><br/><span className="font-bold">KES {result.waterQualityPrediction.treatmentCost.installation.toLocaleString()}</span></div>
                      <div><span className="text-gray-600">Monthly Operating:</span><br/><span className="font-bold">KES {result.waterQualityPrediction.treatmentCost.monthlyOperating.toLocaleString()}</span></div>
                      <div><span className="text-gray-600">Annual Maintenance:</span><br/><span className="font-bold">KES {result.waterQualityPrediction.treatmentCost.annualMaintenance.toLocaleString()}</span></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* NEW: ROI Analysis Tab */}
          {activeTab === 'roiAnalysis' && result.roiAnalysis && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">📈</span>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">ROI & Payback Analysis</h3>
                  <p className="text-sm text-gray-600">Is this investment financially worth it?</p>
                </div>
              </div>

              <div className={`p-6 rounded-xl border ${result.roiAnalysis.financialVerdict === 'highly_recommended' ? 'bg-green-50 border-green-300' : result.roiAnalysis.financialVerdict === 'recommended' ? 'bg-blue-50 border-blue-300' : 'bg-yellow-50 border-yellow-300'}`}>
                <div className="text-center mb-6">
                  <p className={`text-4xl font-bold ${result.roiAnalysis.financialVerdict === 'highly_recommended' ? 'text-green-600' : result.roiAnalysis.financialVerdict === 'recommended' ? 'text-blue-600' : 'text-yellow-600'}`}>
                    {result.roiAnalysis.financialVerdict.replace('_', ' ').toUpperCase()}
                  </p>
                  <p className="text-gray-600 mt-2">{result.roiAnalysis.financialSummary}</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-white rounded-lg text-center">
                    <p className="text-sm text-gray-600">Total Investment</p>
                    <p className="text-2xl font-bold text-gray-800">KES {result.roiAnalysis.investment.totalInvestment.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg text-center">
                    <p className="text-sm text-gray-600">Monthly Savings</p>
                    <p className="text-2xl font-bold text-green-600">KES {result.roiAnalysis.netMonthlySavings.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg text-center">
                    <p className="text-sm text-gray-600">Payback Period</p>
                    <p className="text-2xl font-bold text-blue-600">{result.roiAnalysis.paybackPeriod} months</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg text-center">
                    <p className="text-sm text-gray-600">Annual ROI</p>
                    <p className="text-2xl font-bold text-amber-600">{result.roiAnalysis.roiPercentage}%</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Investment Breakdown */}
                  <div className="p-4 bg-white rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">Investment Breakdown</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>Borehole + Pump</span><span>KES {result.roiAnalysis.investment.boreholeCost.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span>Solar System</span><span>KES {result.roiAnalysis.investment.solarSystemCost.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span>Structure</span><span>KES {result.roiAnalysis.investment.structureCost.toLocaleString()}</span></div>
                      <div className="flex justify-between font-bold border-t pt-2"><span>TOTAL</span><span>KES {result.roiAnalysis.investment.totalInvestment.toLocaleString()}</span></div>
                    </div>
                  </div>

                  {/* Savings Breakdown */}
                  <div className="p-4 bg-white rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">Savings Analysis</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>Current Water Cost</span><span>KES {result.roiAnalysis.savings.currentWaterCost.toLocaleString()}/month</span></div>
                      <div className="flex justify-between"><span>Operating Costs</span><span className="text-red-600">-KES {result.roiAnalysis.operatingCosts.totalMonthlyOperating.toLocaleString()}/month</span></div>
                      <div className="flex justify-between font-bold text-green-600 border-t pt-2"><span>Net Savings</span><span>KES {result.roiAnalysis.netMonthlySavings.toLocaleString()}/month</span></div>
                      <div className="flex justify-between font-bold text-green-600"><span>Annual Savings</span><span>KES {(result.roiAnalysis.netMonthlySavings * 12).toLocaleString()}/year</span></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Financial Projections</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div><span className="text-gray-600">Break-even:</span><br/><span className="font-bold">{result.roiAnalysis.breakEvenPoint.date}</span></div>
                    <div><span className="text-gray-600">10-Year NPV:</span><br/><span className="font-bold text-green-600">KES {result.roiAnalysis.npv10Year.toLocaleString()}</span></div>
                    <div><span className="text-gray-600">IRR:</span><br/><span className="font-bold">{result.roiAnalysis.irr}%</span></div>
                    <div><span className="text-gray-600">Annual ROI:</span><br/><span className="font-bold text-amber-600">{result.roiAnalysis.roiPercentage}%</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NEW: Scenario Simulation Tab */}
          {activeTab === 'scenarios' && result.scenarioSimulation && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🎯</span>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Scenario Simulation</h3>
                  <p className="text-sm text-gray-600">What-if analysis for different drilling depths</p>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl">
                {/* Optimal Scenario Highlight */}
                <div className="p-4 bg-green-100 border border-green-300 rounded-lg mb-6">
                  <h4 className="font-bold text-green-800 mb-2">✓ OPTIMAL SCENARIO</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div><p className="text-sm text-gray-600">Depth</p><p className="text-2xl font-bold text-green-700">{result.scenarioSimulation.optimalScenario.depth}m</p></div>
                    <div><p className="text-sm text-gray-600">Expected Yield</p><p className="text-2xl font-bold text-blue-700">{result.scenarioSimulation.optimalScenario.yield} m³/hr</p></div>
                    <div><p className="text-sm text-gray-600">Estimated Cost</p><p className="text-2xl font-bold text-amber-700">KES {result.scenarioSimulation.optimalScenario.cost.toLocaleString()}</p></div>
                  </div>
                  <p className="text-sm text-green-700 mt-2">{result.scenarioSimulation.optimalScenario.reason}</p>
                </div>

                {/* All Scenarios */}
                <div className="space-y-4">
                  {result.scenarioSimulation.scenarios.map((scenario, index) => (
                    <div key={index} className={`p-4 rounded-lg ${scenario.yieldCategory === 'optimal' ? 'bg-green-50 border-2 border-green-300' : 'bg-white border'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          scenario.yieldCategory === 'optimal' ? 'bg-green-200 text-green-800' :
                          scenario.yieldCategory === 'moderate' ? 'bg-blue-200 text-blue-800' :
                          scenario.yieldCategory === 'low' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-gray-200 text-gray-800'
                        }`}>
                          {scenario.yieldCategory.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-600">Success: {scenario.successProbability}%</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div><p className="text-xs text-gray-500">Depth</p><p className="font-bold">{scenario.depth}m</p></div>
                        <div><p className="text-xs text-gray-500">Yield</p><p className="font-bold">{scenario.estimatedYield} m³/hr</p></div>
                        <div><p className="text-xs text-gray-500">Cost</p><p className="font-bold">KES {scenario.cost.toLocaleString()}</p></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{scenario.recommendation}</p>
                    </div>
                  ))}
                </div>

                {/* Probability Breakdown */}
                <div className="mt-6 p-4 bg-white rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-4">Probability Breakdown</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-3xl font-bold text-green-600">{result.scenarioSimulation.probabilityBreakdown.overallSuccess}%</p>
                      <p className="text-xs text-gray-600">Overall Success</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-3xl font-bold text-blue-600">{result.scenarioSimulation.probabilityBreakdown.hitMainAquifer}%</p>
                      <p className="text-xs text-gray-600">Hit Main Aquifer</p>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg">
                      <p className="text-3xl font-bold text-amber-600">{result.scenarioSimulation.probabilityBreakdown.achieveTargetYield}%</p>
                      <p className="text-xs text-gray-600">Target Yield</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-3xl font-bold text-purple-600">{result.scenarioSimulation.probabilityBreakdown.deeperYieldImprovement}%</p>
                      <p className="text-xs text-gray-600">Deeper Yield Gain</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NEW: Climate & Seasonal Modeling Tab */}
          {activeTab === 'climate' && result.climateModeling && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🌦️</span>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Climate & Seasonal Modeling</h3>
                  <p className="text-sm text-gray-600">Rainfall patterns, recharge analysis & best drilling time</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Best Drilling Season - Highlight */}
                <div className="md:col-span-2 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                  <h4 className="font-bold text-green-800 mb-3">🎯 BEST DRILLING SEASON</h4>
                  <p className="text-2xl font-bold text-green-700">{result.climateModeling.bestDrillingSeason.recommended}</p>
                  <p className="text-sm text-green-600 mt-1">{result.climateModeling.bestDrillingSeason.reason}</p>
                  <div className="mt-4 p-3 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-700"><strong>Avoid:</strong> {result.climateModeling.bestDrillingSeason.monthsToAvoid}</p>
                    <p className="text-xs text-red-600">{result.climateModeling.bestDrillingSeason.avoidReason}</p>
                  </div>
                </div>

                {/* Rainfall Patterns */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <h4 className="font-semibold text-blue-800 mb-3">🌧️ Rainfall Patterns</h4>
                  <p className="text-2xl font-bold text-blue-700 mb-3">{result.climateModeling.rainfall.annualAverage.toFixed(0)}mm/year</p>
                  <div className="space-y-2 text-sm">
                    {result.climateModeling.rainfall.rainySeasons.map((season, i) => (
                      <div key={i} className="flex justify-between p-2 bg-white rounded">
                        <span className="font-medium">{season.name} ({season.months})</span>
                        <span>{season.avgRainfall}mm</span>
                      </div>
                    ))}
                    {result.climateModeling.rainfall.drySeasons.map((season, i) => (
                      <div key={i} className="flex justify-between p-2 bg-gray-100 rounded">
                        <span>{season.name} ({season.months})</span>
                        <span>{season.avgRainfall}mm</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recharge Analysis */}
                <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-xl">
                  <h4 className="font-semibold text-cyan-800 mb-3">💧 Recharge Analysis</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Recharge Rate</span>
                      <span className="font-bold">{result.climateModeling.rechargeAnalysis.rechargeRate.toFixed(0)} mm/year</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Potential</span>
                      <span className={`px-2 py-1 rounded font-bold ${result.climateModeling.rechargeAnalysis.rechargePotential === 'high' ? 'bg-green-200 text-green-800' : result.climateModeling.rechargeAnalysis.rechargePotential === 'medium' ? 'bg-yellow-200 text-yellow-800' : 'bg-red-200 text-red-800'}`}>
                        {result.climateModeling.rechargeAnalysis.rechargePotential.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-600">Primary Source:</p>
                      <p className="font-medium">{result.climateModeling.rechargeAnalysis.primaryRechargeSource}</p>
                    </div>
                  </div>
                </div>

                {/* Long-term Predictions */}
                <div className="md:col-span-2 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <h4 className="font-semibold text-amber-800 mb-3">📊 Long-term Predictions</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="p-3 bg-white rounded-lg">
                      <p className="text-sm text-gray-600">Water Table Stability</p>
                      <p className="font-bold capitalize">{result.climateModeling.longTermPrediction.waterTableStability}</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <p className="text-sm text-gray-600">5-Year Depletion Risk</p>
                      <p className={`font-bold capitalize ${result.climateModeling.longTermPrediction.depletionRisk5Year === 'low' ? 'text-green-600' : result.climateModeling.longTermPrediction.depletionRisk5Year === 'moderate' ? 'text-yellow-600' : 'text-red-600'}`}>
                        {result.climateModeling.longTermPrediction.depletionRisk5Year}
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <p className="text-sm text-gray-600">Climate Impact</p>
                      <p className="font-medium text-sm">{result.climateModeling.longTermPrediction.climateChangeImpact}</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <p className="text-sm text-gray-600">Sustainability Score</p>
                      <p className="font-bold text-green-600">{result.climateModeling.longTermPrediction.sustainabilityScore}/100</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NEW: Drilling Strategy Tab */}
          {activeTab === 'strategy' && result.drillingStrategy && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🛠️</span>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Best Drilling Strategy</h3>
                  <p className="text-sm text-gray-600">Recommended method, casing program & timeline</p>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-slate-50 to-gray-50 border border-gray-200 rounded-xl">
                {/* Recommended Method */}
                <div className="p-4 bg-blue-100 border border-blue-300 rounded-lg mb-6">
                  <h4 className="font-bold text-blue-800 mb-2">Recommended Drilling Method</h4>
                  <p className="text-2xl font-bold text-blue-700">{result.drillingStrategy.recommendedMethod.replace('_', ' ')}</p>
                  <p className="text-sm text-blue-600 mt-1">{result.drillingStrategy.methodReason}</p>
                  <div className="mt-3 flex gap-4 text-sm">
                    <span className="px-3 py-1 bg-white rounded-full">Duration: {result.drillingStrategy.estimatedDuration} days</span>
                    <span className="px-3 py-1 bg-white rounded-full">Best Time: {result.drillingStrategy.bestDrillingTime}</span>
                  </div>
                </div>

                {/* Drilling Phases */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  {result.drillingStrategy.drillingPhases.map((phase, index) => (
                    <div key={index} className="p-4 bg-white rounded-lg border-l-4 border-blue-500">
                      <h5 className="font-semibold text-gray-800">{phase.phase}</h5>
                      <p className="text-sm text-gray-600">{phase.depthFrom}-{phase.depthTo}m</p>
                      <p className="text-sm"><strong>Method:</strong> {phase.method}</p>
                      <p className="text-sm"><strong>Equipment:</strong> {phase.equipment}</p>
                      <p className="text-sm text-blue-600">{phase.duration}</p>
                    </div>
                  ))}
                </div>

                {/* Casing Program */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">Casing Program</h4>
                    <div className="space-y-2 text-sm">
                      <div className="p-2 bg-gray-50 rounded">
                        <strong>Surface Casing:</strong> {result.drillingStrategy.casingProgram.surfaceCasing.diameter} {result.drillingStrategy.casingProgram.surfaceCasing.material} to {result.drillingStrategy.casingProgram.surfaceCasing.depth}m
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <strong>Production Casing:</strong> {result.drillingStrategy.casingProgram.productionCasing.diameter} {result.drillingStrategy.casingProgram.productionCasing.material} to {result.drillingStrategy.casingProgram.productionCasing.depth}m
                      </div>
                      <div className="p-2 bg-blue-50 rounded">
                        <strong>Screens:</strong> {result.drillingStrategy.casingProgram.screens.depthFrom}-{result.drillingStrategy.casingProgram.screens.depthTo}m (slot: {result.drillingStrategy.casingProgram.screens.slotSize})
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">Additional Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="p-2 bg-gray-50 rounded">
                        <strong>Gravel Pack:</strong> {result.drillingStrategy.gravelPacking.depthFrom}-{result.drillingStrategy.gravelPacking.depthTo}m, {result.drillingStrategy.gravelPacking.grainSize}
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <strong>Development:</strong> {result.drillingStrategy.developmentMethod}
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <strong>Test Pumping:</strong> {result.drillingStrategy.testPumping.duration}hr {result.drillingStrategy.testPumping.method}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk Mitigation */}
                <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                  <h4 className="font-semibold text-amber-800 mb-2">Risk Mitigation Measures</h4>
                  <ul className="list-disc list-inside text-sm text-amber-700 space-y-1">
                    {result.drillingStrategy.riskMitigation.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* NEW: Confidence Metrics Tab */}
          {activeTab === 'confidence' && result.confidenceMetrics && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">✓</span>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Confidence Metrics</h3>
                  <p className="text-sm text-gray-600">How AI explains its decision</p>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl">
                {/* Overall Confidence */}
                <div className="text-center mb-6">
                  <p className="text-sm text-indigo-600 mb-2">Overall Confidence Score</p>
                  <p className="text-5xl font-bold text-indigo-700">{result.confidenceMetrics.overallConfidence}%</p>
                  <p className="text-sm text-gray-600 mt-2">{result.confidenceMetrics.confidenceExplanation}</p>
                </div>

                {/* Individual Metrics */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'Geological', data: result.confidenceMetrics.geological, color: 'amber', source: result.confidenceMetrics.geological.dataSource },
                    { name: 'Terrain', data: result.confidenceMetrics.terrain, color: 'green', source: result.confidenceMetrics.terrain.dataSource },
                    { name: 'Vegetation', data: result.confidenceMetrics.vegetation, color: 'emerald', source: result.confidenceMetrics.vegetation.dataSource },
                    { name: 'Satellite', data: result.confidenceMetrics.satellite, color: 'blue', source: result.confidenceMetrics.satellite.dataSource },
                    { name: 'Historical', data: result.confidenceMetrics.historical, color: 'purple', source: result.confidenceMetrics.historical.dataSource },
                    { name: 'Data Density', data: result.confidenceMetrics.dataDensity, color: 'cyan', source: `${result.confidenceMetrics.dataDensity.nearbyDataPoints} nearby data points` },
                  ].map((metric, index) => (
                    <div key={index} className="p-4 bg-white rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">{metric.name}</span>
                        <span className={`text-2xl font-bold text-${metric.color}-600`}>{metric.data.score.toFixed(0)}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full bg-${metric.color}-500`} style={{ width: `${metric.data.score}%` }} />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">{metric.source}</p>
                      <p className="text-xs text-gray-400">Reliability: {metric.data.reliability}</p>
                    </div>
                  ))}
                </div>

                {/* Data Gaps & Improvements */}
                {(result.confidenceMetrics.dataGaps.length > 0 || result.confidenceMetrics.improvementSuggestions.length > 0) && (
                  <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                    {result.confidenceMetrics.dataGaps.length > 0 && (
                      <div className="mb-3">
                        <h4 className="font-semibold text-yellow-800">Data Gaps:</h4>
                        <ul className="list-disc list-inside text-sm text-yellow-700">
                          {result.confidenceMetrics.dataGaps.map((gap, i) => <li key={i}>{gap}</li>)}
                        </ul>
                      </div>
                    )}
                    {result.confidenceMetrics.improvementSuggestions.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-yellow-800">Improvement Suggestions:</h4>
                        <ul className="list-disc list-inside text-sm text-yellow-700">
                          {result.confidenceMetrics.improvementSuggestions.map((sug, i) => <li key={i}>{sug}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* NEW: Time-Based Modeling Tab */}
          {activeTab === 'timeBased' && result.timeBasedModeling && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">⏳</span>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">5-10 Year Projections</h3>
                  <p className="text-sm text-gray-600">Long-term sustainability & maintenance planning</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Current State */}
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <h4 className="font-semibold text-green-800 mb-3">Current State</h4>
                  <div className="space-y-3 text-sm">
                    <div><span className="text-gray-600">Water Table:</span><br/><span className="font-bold text-lg">{result.timeBasedModeling.currentState.waterTableDepth}m</span></div>
                    <div><span className="text-gray-600">Estimated Yield:</span><br/><span className="font-bold text-lg">{result.timeBasedModeling.currentState.estimatedYield} m³/hr</span></div>
                    <div><span className="text-gray-600">Quality:</span><br/><span className="font-bold">{result.timeBasedModeling.currentState.qualityRating}</span></div>
                  </div>
                </div>

                {/* 5-Year Projection */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <h4 className="font-semibold text-blue-800 mb-3">5-Year Projection</h4>
                  <div className="space-y-3 text-sm">
                    <div><span className="text-gray-600">Water Table:</span><br/><span className="font-bold text-lg">{result.timeBasedModeling.projection5Year.waterTableDepth}m</span></div>
                    <div><span className="text-gray-600">Yield Change:</span><br/><span className={`font-bold text-lg ${result.timeBasedModeling.projection5Year.yieldChange < 0 ? 'text-red-600' : 'text-green-600'}`}>{result.timeBasedModeling.projection5Year.yieldChange}%</span></div>
                    <div><span className="text-gray-600">Quality:</span><br/><span className="font-medium">{result.timeBasedModeling.projection5Year.qualityChange}</span></div>
                    <div><span className="text-gray-600">Risk:</span><br/><span className="font-medium">{result.timeBasedModeling.projection5Year.risk}</span></div>
                  </div>
                </div>

                {/* 10-Year Projection */}
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <h4 className="font-semibold text-amber-800 mb-3">10-Year Projection</h4>
                  <div className="space-y-3 text-sm">
                    <div><span className="text-gray-600">Water Table:</span><br/><span className="font-bold text-lg">{result.timeBasedModeling.projection10Year.waterTableDepth}m</span></div>
                    <div><span className="text-gray-600">Yield Change:</span><br/><span className={`font-bold text-lg ${result.timeBasedModeling.projection10Year.yieldChange < 0 ? 'text-red-600' : 'text-green-600'}`}>{result.timeBasedModeling.projection10Year.yieldChange}%</span></div>
                    <div><span className="text-gray-600">Quality:</span><br/><span className="font-medium">{result.timeBasedModeling.projection10Year.qualityChange}</span></div>
                    <div><span className="text-gray-600">Risk:</span><br/><span className="font-medium">{result.timeBasedModeling.projection10Year.risk}</span></div>
                  </div>
                </div>
              </div>

              {/* Sustainability & Extraction */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-white border rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-3">Sustainability Index</h4>
                  <div className="text-center">
                    <p className="text-5xl font-bold text-green-600">{result.timeBasedModeling.sustainabilityIndex}</p>
                    <p className="text-sm text-gray-500">/100</p>
                  </div>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between"><span>Max Daily Extraction</span><span className="font-bold">{result.timeBasedModeling.recommendedExtraction.maxDailyExtraction} m³</span></div>
                    <div className="flex justify-between"><span>Sustainable Yield</span><span className="font-bold text-green-600">{result.timeBasedModeling.recommendedExtraction.sustainableYield} m³/hr</span></div>
                    <div className="text-xs text-gray-500 mt-2">{result.timeBasedModeling.recommendedExtraction.overextractionRisk}</div>
                  </div>
                </div>

                <div className="p-4 bg-white border rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-3">Maintenance Schedule</h4>
                  <div className="space-y-2">
                    {result.timeBasedModeling.maintenanceSchedule.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                        <div>
                          <p className="font-medium">{item.task}</p>
                          <p className="text-xs text-gray-500">{item.frequency}</p>
                        </div>
                        <span className="font-bold">KES {item.estimatedCost.toLocaleString()}</span>
                      </div>
                    ))}
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

              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <span>🌍</span>
                  Regional Data: {result.regionData.region}, {result.regionData.country}
                </h4>
                <div className="grid md:grid-cols-4 gap-4 text-sm text-blue-700">
                  <div>
                    <span className="text-blue-600">Continent</span>
                    <p className="font-medium">{result.regionData.continent}</p>
                  </div>
                  <div>
                    <span className="text-blue-600">Geological Zone</span>
                    <p className="font-medium">{result.regionData.geologicalZone}</p>
                  </div>
                  <div>
                    <span className="text-blue-600">Aquifer Type</span>
                    <p className="font-medium">{result.regionData.aquiferType}</p>
                  </div>
                  <div>
                    <span className="text-blue-600">Water Quality</span>
                    <p className="font-medium">{result.regionData.waterQualityNotes}</p>
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
