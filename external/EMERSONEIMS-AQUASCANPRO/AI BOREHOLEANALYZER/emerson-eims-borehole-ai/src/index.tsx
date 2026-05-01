import React, { useState, useRef, useEffect } from 'react';
import { BoreholeAnalyzer } from './boreholeAnalyzer';
import { AnalysisResult } from './types';
import './styles.css';

const AIBoreholeAnalyzer: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzer, setAnalyzer] = useState<BoreholeAnalyzer | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const init = async () => {
      const boreholeAnalyzer = new BoreholeAnalyzer();
      await boreholeAnalyzer.initialize();
      setAnalyzer(boreholeAnalyzer);
    };
    init();
  }, []);

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !analyzer) return;

    const preview = URL.createObjectURL(file);
    setSelectedImage(preview);
    setSelectedFile(file);
    setResult(null);
    
    setAnalyzing(true);
    try {
      const analysisResult = await analyzer.analyzeImage(file);
      setResult(analysisResult);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk < 0.3) return '#4CAF50';
    if (risk < 0.6) return '#FFC107';
    if (risk < 0.8) return '#FF9800';
    return '#F44336';
  };

  const getViabilityIcon = (viability: string) => {
    switch(viability) {
      case 'high': return '✅ High';
      case 'medium': return '⚠️ Medium';
      case 'low': return '⚠️ Low';
      default: return '❌ Not Recommended';
    }
  };

  return (
    <div className="borehole-analyzer-container">
      <div className="borehole-analyzer-header">
        <h2>AI Borehole Site Analyzer</h2>
        <p>Upload a terrain image for comprehensive site analysis</p>
      </div>

      {!selectedImage ? (
        <div className="borehole-upload-area" onClick={() => fileInputRef.current?.click()}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            style={{ display: 'none' }}
          />
          <div className="borehole-upload-icon">📸</div>
          <p>Click to upload terrain image</p>
          <small>Supports: JPG, PNG (Max 10MB)</small>
        </div>
      ) : (
        <div className="borehole-analysis-container">
          <div className="borehole-image-preview">
            <img src={selectedImage} alt="Terrain" />
            <button onClick={() => {
              setSelectedImage(null);
              setSelectedFile(null);
              setResult(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}>Change Image</button>
          </div>

          {analyzing && (
            <div className="borehole-loading">
              <div className="borehole-spinner"></div>
              <p>Analyzing terrain, soil, contamination risks...</p>
            </div>
          )}

          {result && !analyzing && (
            <div className="borehole-results">
              <div className="borehole-tabs">
                {['overview', 'soil', 'water', 'contamination', 'risk'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`borehole-tab ${activeTab === tab ? 'active' : ''}`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="borehole-tab-content">
                {activeTab === 'overview' && (
                  <div>
                    <div className="borehole-metric">
                      <label>Success Probability:</label>
                      <div className="borehole-value">{(result.probability * 100).toFixed(1)}%</div>
                      <div className="borehole-progress-bar">
                        <div style={{ width: `${result.probability * 100}%` }}></div>
                      </div>
                    </div>

                    <div className="borehole-metric">
                      <label>Site Viability:</label>
                      <div className="borehole-value">{getViabilityIcon(result.risk.viability)}</div>
                    </div>

                    <div className="borehole-metric">
                      <label>Location:</label>
                      <div className="borehole-value">
                        {result.site.latitude.toFixed(4)}°, {result.site.longitude.toFixed(4)}°
                      </div>
                    </div>

                    <div className="borehole-metric">
                      <label>Site Type:</label>
                      <div className="borehole-value">{result.site.siteType.toUpperCase()}</div>
                    </div>

                    <div className="borehole-metric">
                      <label>Recommended Depth:</label>
                      <div className="borehole-value">{result.recommendedDepth.toFixed(0)} meters</div>
                    </div>

                    <div className="borehole-metric">
                      <label>Estimated Yield:</label>
                      <div className="borehole-value">{result.estimatedYield.toFixed(1)} m³/hour</div>
                    </div>

                    <div className="borehole-metric">
                      <label>Soil Type:</label>
                      <div className="borehole-value">{result.soil.type.toUpperCase()}</div>
                    </div>

                    <div className="borehole-metric">
                      <label>Water Potability:</label>
                      <div className="borehole-value">{result.waterQuality.isPotable ? '✅ Potable' : '⚠️ Treatment Required'}</div>
                    </div>

                    <div className="borehole-metric">
                      <label>Overall Risk Score:</label>
                      <div className="borehole-value" style={{ color: getRiskColor(result.risk.overallRisk) }}>
                        {(result.risk.overallRisk * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'soil' && (
                  <div>
                    <div className="borehole-metric">
                      <label>Soil Type:</label>
                      <div className="borehole-value">{result.soil.type.toUpperCase()}</div>
                    </div>

                    <div className="borehole-metric">
                      <label>Porosity:</label>
                      <div className="borehole-value">{(result.soil.porosity * 100).toFixed(0)}%</div>
                      <div className="borehole-progress-bar">
                        <div style={{ width: `${result.soil.porosity * 100}%` }}></div>
                      </div>
                    </div>

                    <div className="borehole-metric">
                      <label>Permeability:</label>
                      <div className="borehole-value">{(result.soil.permeability * 100).toFixed(0)}%</div>
                      <div className="borehole-progress-bar">
                        <div style={{ width: `${result.soil.permeability * 100}%` }}></div>
                      </div>
                    </div>

                    <div className="borehole-metric">
                      <label>Organic Matter:</label>
                      <div className="borehole-value">{(result.soil.organicMatter * 100).toFixed(1)}%</div>
                    </div>

                    <div className="borehole-metric">
                      <label>Soil pH:</label>
                      <div className="borehole-value">{result.soil.pH.toFixed(1)}</div>
                    </div>

                    <div className="borehole-metric">
                      <label>Moisture Content:</label>
                      <div className="borehole-value">{(result.soil.moistureContent * 100).toFixed(0)}%</div>
                    </div>

                    <div className="borehole-metric">
                      <label>Soil Suitability:</label>
                      <div className="borehole-value">{(result.soil.suitability * 100).toFixed(0)}%</div>
                    </div>

                    <div className="borehole-recommendations">
                      <h4>Recommendations:</h4>
                      <ul>
                        {result.soil.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'water' && (
                  <div>
                    <div className="borehole-metric">
                      <label>Water Quality Score:</label>
                      <div className="borehole-value">{(result.waterQuality.score * 100).toFixed(0)}%</div>
                      <div className="borehole-progress-bar">
                        <div style={{ width: `${result.waterQuality.score * 100}%`, background: result.waterQuality.score > 0.7 ? '#4CAF50' : '#FF9800' }}></div>
                      </div>
                    </div>

                    <div className="borehole-metric">
                      <label>Potability:</label>
                      <div className="borehole-value">{result.waterQuality.isPotable ? '✅ Safe for drinking' : '⚠️ Requires treatment'}</div>
                    </div>

                    <div className="borehole-metric">
                      <label>TDS (mg/L):</label>
                      <div className="borehole-value">{result.waterQuality.tds.toFixed(0)}</div>
                    </div>

                    <div className="borehole-metric">
                      <label>pH Level:</label>
                      <div className="borehole-value">{result.waterQuality.pH.toFixed(1)}</div>
                    </div>

                    <div className="borehole-metric">
                      <label>Hardness (mg/L):</label>
                      <div className="borehole-value">{result.waterQuality.hardness.toFixed(0)}</div>
                    </div>

                    <div className="borehole-metric">
                      <label>Fluoride (mg/L):</label>
                      <div className="borehole-value">{result.waterQuality.fluoride.toFixed(2)}</div>
                    </div>

                    <div className="borehole-metric">
                      <label>Iron (mg/L):</label>
                      <div className="borehole-value">{result.waterQuality.iron.toFixed(2)}</div>
                    </div>

                    <div className="borehole-metric">
                      <label>Arsenic (mg/L):</label>
                      <div className="borehole-value">{result.waterQuality.arsenic.toFixed(3)}</div>
                    </div>

                    <div className="borehole-metric">
                      <label>Nitrate (mg/L):</label>
                      <div className="borehole-value">{result.waterQuality.nitrate.toFixed(0)}</div>
                    </div>

                    {result.waterQuality.treatmentRequired.length > 0 && (
                      <div className="borehole-recommendations">
                        <h4>Treatment Required:</h4>
                        <ul>
                          {result.waterQuality.treatmentRequired.map((treatment, i) => (
                            <li key={i}>{treatment}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'contamination' && (
                  <div>
                    <div className="borehole-metric">
                      <label>Contamination Risk Level:</label>
                      <div className="borehole-value" style={{ color: getRiskColor(result.risk.contaminationRisk.level) }}>
                        {(result.risk.contaminationRisk.level * 100).toFixed(0)}%
                      </div>
                    </div>

                    {result.risk.contaminationRisk.sources.length > 0 ? (
                      <div>
                        <h4>Detected Contamination Sources:</h4>
                        {result.risk.contaminationRisk.sources.map((source, i) => (
                          <div key={i} className="borehole-contamination-source">
                            <strong>{source.type.toUpperCase()}</strong>
                            <div>Distance: {source.distance}m ({source.direction})</div>
                            <div>Severity: {source.severity.toUpperCase()}</div>
                            <div>Risk Level: {(source.riskLevel * 100).toFixed(0)}%</div>
                            <div>Chemicals: {source.chemicals.join(', ')}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No significant contamination sources detected.</p>
                    )}

                    {result.risk.contaminationRisk.mitigation.length > 0 && (
                      <div className="borehole-recommendations">
                        <h4>Mitigation Strategies:</h4>
                        <ul>
                          {result.risk.contaminationRisk.mitigation.map((strategy, i) => (
                            <li key={i}>{strategy}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'risk' && (
                  <div>
                    <div className="borehole-metric">
                      <label>Overall Risk Score:</label>
                      <div className="borehole-value" style={{ color: getRiskColor(result.risk.overallRisk) }}>
                        {(result.risk.overallRisk * 100).toFixed(0)}%
                      </div>
                    </div>

                    <div className="borehole-metric">
                      <label>Geological Risk:</label>
                      <div className="borehole-value">{(result.risk.categories.geological * 100).toFixed(0)}%</div>
                    </div>

                    <div className="borehole-metric">
                      <label>Contamination Risk:</label>
                      <div className="borehole-value">{(result.risk.categories.contamination * 100).toFixed(0)}%</div>
                    </div>

                    <div className="borehole-metric">
                      <label>Depth Risk:</label>
                      <div className="borehole-value">{(result.risk.categories.depth * 100).toFixed(0)}%</div>
                    </div>

                    <div className="borehole-metric">
                      <label>Financial Risk:</label>
                      <div className="borehole-value">{(result.risk.categories.financial * 100).toFixed(0)}%</div>
                    </div>

                    <div className="borehole-metric">
                      <label>Technical Risk:</label>
                      <div className="borehole-value">{(result.risk.categories.technical * 100).toFixed(0)}%</div>
                    </div>

                    <div className="borehole-recommendations">
                      <h4>Risk Recommendations:</h4>
                      <ul>
                        {result.risk.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIBoreholeAnalyzer;