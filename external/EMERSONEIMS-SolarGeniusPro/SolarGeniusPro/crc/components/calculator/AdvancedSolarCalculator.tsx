import React, { useState } from 'react';
import SolarCalculatorEngine, { Location, Appliance, CalculationResult } from '../../core/calculator/SolarCalculatorEngine';
import { DiagnosticEngine } from '../../core/calculator/DiagnosticEngine';
import { QualityAssessmentEngine } from '../../core/calculator/QualityAssessmentEngine';
import SunWeatherEngine, { WeatherData, SunPosition } from '../../core/calculator/SunWeatherEngine';
import { RoofShadingEngine, ShadingObject, RoofSpecification } from '../../core/calculator/RoofShadingEngine';
import './AdvancedSolarCalculator.css';

/**
 * 🌟 ADVANCED INTELLIGENT SOLAR CALCULATOR
 * 
 * Harvard-level solar design and diagnostic tool
 * - Complete system sizing
 * - Cost estimation  
 * - Troubleshooting & diagnostics
 * - Quality assessment
 * - Installation guides
 * - Sun & Weather analysis
 * - Roof shading calculations
 */

export const AdvancedSolarCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sizing' | 'diagnostic' | 'quality' | 'installation' | 'sunweather' | 'roofshading'>('sizing');
  const [location, setLocation] = useState<Location>({
    latitude: -1.2921,
    longitude: 36.8219,
    country: 'Kenya',
    city: 'Nairobi',
    altitude: 1661,
  });
  const [appliances, setAppliances] = useState<Appliance[]>([
    { name: 'LED Lights', wattage: 20, dailyHours: 4, quantity: 5, priority: 'essential' },
    { name: 'Refrigerator', wattage: 500, dailyHours: 24, quantity: 1, priority: 'essential' },
    { name: 'TV', wattage: 100, dailyHours: 5, quantity: 1, priority: 'important' },
  ]);

  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [symptom, setSymptom] = useState('');
  const [diagnosticResults, setDiagnosticResults] = useState<any[] | null>(null);

  // Sun & Weather state
  const [sunPosition, setSunPosition] = useState<SunPosition | null>(null);
  const [weather, setWeather] = useState<WeatherData>({
    date: new Date().toISOString().split('T')[0],
    temperature: 25,
    cloudCover: 20,
    windSpeed: 2.5,
    humidity: 60,
    pressure: 1013,
    uvIndex: 8,
    irradiance: 800,
  });
  const [productionForecast, setProductionForecast] = useState<any | null>(null);

  // Roof Shading state
  const [roofSpec, setRoofSpec] = useState<RoofSpecification>({
    latitude: -1.2921,
    longitude: 36.8219,
    roofAzimuth: 180,
    roofTilt: 20,
    roofArea: 50,
    roofType: 'pitched',
    surfaceAlbedo: 0.2,
  });
  const [shadingObjects, setShadingObjects] = useState<ShadingObject[]>([
    { type: 'tree', name: 'Acacia Tree', distance: 15, height: 8, azimuthStart: 230, azimuthEnd: 280, elevationAngle: 28, season: 'summer' },
  ]);
  const [shadingAnalysis, setShadingAnalysis] = useState<any | null>(null);

  const calculator = new SolarCalculatorEngine();
  const diagnostic = new DiagnosticEngine();
  const qualityEngine = new QualityAssessmentEngine();
  const sunWeatherEngine = new SunWeatherEngine();
  const shadingEngine = new RoofShadingEngine();

  // ==================== SIZING TAB ====================

  const handleAddAppliance = () => {
    setAppliances([
      ...appliances,
      { name: 'New Device', wattage: 100, dailyHours: 2, quantity: 1, priority: 'optional' },
    ]);
  };

  const handleRemoveAppliance = (index: number) => {
    setAppliances(appliances.filter((_, i) => i !== index));
  };

  const handleUpdateAppliance = (index: number, field: string, value: any) => {
    const updated = [...appliances];
    (updated[index] as any)[field] = value;
    setAppliances(updated);
  };

  const handleCalculate = () => {
    const result = calculator.calculateCompleteSystem(location, appliances);
    setCalculationResult(result);
  };

  // ==================== DIAGNOSTIC TAB ====================

  const handleDiagnose = () => {
    if (symptom.trim()) {
      const problems = diagnostic.diagnoseProblem(symptom);
      setDiagnosticResults(problems);
    }
  };

  // ==================== SUN & WEATHER HANDLERS ====================

  const handleCalculateSunPosition = () => {
    const sun = sunWeatherEngine.calculateSunPosition(location as any, new Date());
    setSunPosition(sun);
  };

  const handleGenerateProductionForecast = () => {
    const forecast = sunWeatherEngine.generateProductionForecast(
      location as any,
      calculationResult?.recommendation.systemSizeKW || 5,
      weather
    );
    setProductionForecast(forecast);
  };

  // ==================== ROOF SHADING HANDLERS ====================

  const handleAnalyzeShadingProfile = () => {
    const analysis = shadingEngine.analyzeShadingProfile(roofSpec, shadingObjects);
    setShadingAnalysis(analysis);
  };

  const handleAddShadingObject = () => {
    setShadingObjects([
      ...shadingObjects,
      { type: 'tree', name: 'New Object', distance: 20, height: 10, azimuthStart: 180, azimuthEnd: 200, elevationAngle: 25 },
    ]);
  };

  const handleRemoveShadingObject = (index: number) => {
    setShadingObjects(shadingObjects.filter((_, i) => i !== index));
  };

  const handleUpdateShadingObject = (index: number, field: string, value: any) => {
    const updated = [...shadingObjects];
    (updated[index] as any)[field] = value;
    setShadingObjects(updated);
  };

  // ==================== SIZING UI ====================

  const renderSizingTab = () => (
    <div className="calculator-tab sizing-tab">
      <div className="section-header">
        <h2>☀️ Solar System Sizing Calculator</h2>
        <p>Enter your location and appliances for complete system design</p>
      </div>

      {/* Location Section */}
      <div className="form-section">
        <h3>📍 Location</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              value={location.city}
              onChange={(e) => setLocation({ ...location, city: e.target.value })}
              placeholder="e.g., Nairobi"
            />
          </div>
          <div className="form-group">
            <label>Country</label>
            <input
              type="text"
              value={location.country}
              onChange={(e) => setLocation({ ...location, country: e.target.value })}
              placeholder="e.g., Kenya"
            />
          </div>
          <div className="form-group">
            <label>Latitude</label>
            <input
              type="number"
              step="0.001"
              value={location.latitude}
              onChange={(e) => setLocation({ ...location, latitude: parseFloat(e.target.value) })}
              placeholder="-1.2921"
            />
          </div>
          <div className="form-group">
            <label>Longitude</label>
            <input
              type="number"
              step="0.001"
              value={location.longitude}
              onChange={(e) => setLocation({ ...location, longitude: parseFloat(e.target.value) })}
              placeholder="36.8219"
            />
          </div>
        </div>
      </div>

      {/* Appliances Section */}
      <div className="form-section">
        <h3>🔌 Appliances & Loads</h3>
        <div className="appliances-list">
          {appliances.map((appliance, index) => (
            <div key={index} className="appliance-item">
              <div className="appliance-grid">
                <div className="form-group">
                  <label>Device Name</label>
                  <input
                    type="text"
                    value={appliance.name}
                    onChange={(e) => handleUpdateAppliance(index, 'name', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Wattage (W)</label>
                  <input
                    type="number"
                    value={appliance.wattage}
                    onChange={(e) => handleUpdateAppliance(index, 'wattage', parseInt(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label>Hours/Day</label>
                  <input
                    type="number"
                    step="0.5"
                    value={appliance.dailyHours}
                    onChange={(e) => handleUpdateAppliance(index, 'dailyHours', parseFloat(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    value={appliance.quantity}
                    onChange={(e) => handleUpdateAppliance(index, 'quantity', parseInt(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={appliance.priority}
                    onChange={(e) => handleUpdateAppliance(index, 'priority', e.target.value)}
                  >
                    <option>essential</option>
                    <option>important</option>
                    <option>optional</option>
                  </select>
                </div>
                <button onClick={() => handleRemoveAppliance(index)} className="btn-remove">
                  🗑️ Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={handleAddAppliance} className="btn-primary">
          + Add Appliance
        </button>
      </div>

      {/* Calculate Button */}
      <button onClick={handleCalculate} className="btn-calculate">
        ⚡ CALCULATE SYSTEM
      </button>

      {/* Results */}
      {calculationResult && <RenderCalculationResults result={calculationResult} />}
    </div>
  );

  // ==================== DIAGNOSTIC UI ====================

  const renderDiagnosticTab = () => (
    <div className="calculator-tab diagnostic-tab">
      <div className="section-header">
        <h2>🤖 Intelligent Diagnostic AI</h2>
        <p>Describe your solar system problem and get AI solutions</p>
      </div>

      <div className="diagnostic-input">
        <textarea
          value={symptom}
          onChange={(e) => setSymptom(e.target.value)}
          placeholder="Describe your problem. Examples:
- Inverter is on but no power
- Battery showing not charging
- System overheating
- Low solar production"
          className="symptom-input"
        />
        <button onClick={handleDiagnose} className="btn-diagnose">
          🔍 DIAGNOSE PROBLEM
        </button>
      </div>

      {diagnosticResults && diagnosticResults.length > 0 && (
        <div className="diagnostic-results">
          {diagnosticResults.map((problem, index) => (
            <div key={index} className="problem-card">
              <div className={`severity-badge ${problem.severity}`}>
                {problem.severity.toUpperCase()}
              </div>
              <h3>{problem.title}</h3>
              <p>{problem.description}</p>

              {/* Root Causes */}
              <div className="section">
                <h4>🔍 Possible Root Causes:</h4>
                <ul>
                  {problem.rootCauses.map((cause: any, i: number) => (
                    <li key={i}>
                      <strong>{cause.name}</strong> ({Math.round(cause.likelihood * 100)}% likely)
                      <br />
                      <small>Check: {cause.checkPoint}</small>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Safety Warnings */}
              {problem.safetyWarnings.length > 0 && (
                <div className="section safety">
                  <h4>⚠️ Safety Warnings:</h4>
                  <ul>
                    {problem.safetyWarnings.map((warning: string, i: number) => (
                      <li key={i}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Solutions */}
              <div className="section">
                <h4>✅ Recommended Solutions:</h4>
                {problem.solutions.map((solution: any, i: number) => (
                  <div key={i} className="solution-box">
                    <h5>{solution.title}</h5>
                    <div className="solution-meta">
                      <span>⏱️ {solution.timeRequired} min</span>
                      <span>💡 {solution.difficulty}</span>
                      <span>✓ {Math.round(solution.successRate * 100)}% success</span>
                      <span>💰 ~KSH {solution.costEstimate}</span>
                    </div>
                    <ol>
                      {solution.steps.map((step: string, j: number) => (
                        <li key={j}>{step}</li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>

              {/* Prevention Tips */}
              {problem.preventionTips.length > 0 && (
                <div className="section">
                  <h4>💡 Prevention Tips:</h4>
                  <ul>
                    {problem.preventionTips.map((tip: string, i: number) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ==================== QUALITY TAB ====================

  const renderQualityTab = () => (
    <div className="calculator-tab quality-tab">
      <div className="section-header">
        <h2>✅ Product Quality & Authenticity Checker</h2>
        <p>Verify if your solar equipment is authentic and safe</p>
      </div>

      <div className="quality-guides">
        <div className="guide-section">
          <h3>☀️ Solar Panel Verification</h3>
          <div className="checklist">
            {[
              'Serial number verification on manufacturer website',
              'Glass weight and quality inspection',
              'Frame straightness and connector quality',
              'Output specs verification (Voc, Isc, Power)',
              'Examine junction box for proper components',
            ].map((check, i) => (
              <div key={i} className="check-item">
                <input type="checkbox" id={`panel-${i}`} />
                <label htmlFor={`panel-${i}`}>{check}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="guide-section">
          <h3>⚡ Inverter Verification</h3>
          <div className="checklist">
            {[
              'Check internal components quality and weight',
              'Verify display responsiveness and menu navigation',
              'Listen for thermal and acoustic performance',
              'Measure output waveform (pure sine wave)',
              'Inspect connector quality and certifications',
            ].map((check, i) => (
              <div key={i} className="check-item">
                <input type="checkbox" id={`inverter-${i}`} />
                <label htmlFor={`inverter-${i}`}>{check}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="guide-section">
          <h3>🔋 Battery Verification</h3>
          <div className="checklist">
            {[
              'Check physical condition (no corrosion, even weight)',
              'BMS functionality and cell balancing',
              'Run full charge-discharge cycle test',
              'Verify certifications and documentation',
              'Monitor temperature and safety features',
            ].map((check, i) => (
              <div key={i} className="check-item">
                <input type="checkbox" id={`battery-${i}`} />
                <label htmlFor={`battery-${i}`}>{check}</label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ==================== INSTALLATION TAB ====================

  const renderInstallationTab = () => (
    <div className="calculator-tab installation-tab">
      <div className="section-header">
        <h2>🛠️ Installation & Wiring Guide</h2>
        <p>Complete installation procedures and wiring diagrams</p>
      </div>

      {calculationResult && calculationResult.wiringSpecs && (
        <div className="wiring-section">
          <h3>⚡ Wiring Specifications</h3>
          <div className="wiring-table">
            <table>
              <thead>
                <tr>
                  <th>Segment</th>
                  <th>Voltage</th>
                  <th>Current</th>
                  <th>Cable Size</th>
                  <th>Color Coding</th>
                  <th>Breaker</th>
                </tr>
              </thead>
              <tbody>
                {calculationResult.wiringSpecs.map((spec, i) => (
                  <tr key={i}>
                    <td>{spec.segment}</td>
                    <td>{spec.voltage}V</td>
                    <td>{Math.round(spec.current)}A</td>
                    <td>{spec.cableSize} mm²</td>
                    <td>{spec.colors.join(', ')}</td>
                    <td>{spec.breaker}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Safety Notes */}
          {calculationResult.safetyNotes && (
            <div className="safety-box">
              <h4>🔒 Safety Requirements:</h4>
              <ul>
                {calculationResult.safetyNotes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Best Practices */}
      <div className="best-practices">
        <h3>✅ Installation Best Practices</h3>
        <div className="practices-grid">
          <div className="practice-box">
            <h4>☀️ Panel Installation</h4>
            <ul>
              <li>Mount at optimal angle (15-25° for East Africa)</li>
              <li>North-facing slope for maximum sun hours</li>
              <li>Use stainless steel hardware</li>
              <li>Apply sealant to all penetrations</li>
              <li>Use PV-rated MC4 connectors</li>
            </ul>
          </div>

          <div className="practice-box">
            <h4>⚡ Inverter Installation</h4>
            <ul>
              <li>Mount in cool, ventilated location</li>
              <li>Keep 30cm clearance all around</li>
              <li>Install AC & DC disconnects</li>
              <li>Use proper cable gauges</li>
              <li>Ground the chassis</li>
            </ul>
          </div>

          <div className="practice-box">
            <h4>🔋 Battery Installation</h4>
            <ul>
              <li>Mount on stable, level surface</li>
              <li>Ensure adequate ventilation</li>
              <li>Temperature controlled (15-25°C)</li>
              <li>Isolate terminals properly</li>
              <li>Use short DC cable runs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  // ==================== SUN & WEATHER TAB ====================

  const renderSunWeatherTab = () => (
    <div className="calculator-tab sunweather-tab">
      <div className="section-header">
        <h2>☀️ Sun Position & Weather Analysis</h2>
        <p>Real-time solar angles, weather impact, and production forecasts</p>
      </div>

      {/* Location Info */}
      <div className="form-section">
        <h3>📍 Location Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="label">City:</span>
            <span className="value">{location.city}, {location.country}</span>
          </div>
          <div className="info-item">
            <span className="label">Coordinates:</span>
            <span className="value">{location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°</span>
          </div>
          <div className="info-item">
            <span className="label">Altitude:</span>
            <span className="value">{location.altitude}m</span>
          </div>
        </div>
      </div>

      {/* Sun Position */}
      <div className="form-section">
        <h3>🌞 Current Sun Position</h3>
        <button onClick={handleCalculateSunPosition} className="btn-primary">
          📍 Calculate Sun Position
        </button>

        {sunPosition && (
          <div className="sun-data">
            <div className="data-grid">
              <div className="data-card">
                <div className="data-value">{sunPosition.altitude.toFixed(1)}°</div>
                <div className="data-label">Solar Altitude</div>
              </div>
              <div className="data-card">
                <div className="data-value">{sunPosition.azimuth.toFixed(1)}°</div>
                <div className="data-label">Solar Azimuth (from North)</div>
              </div>
              <div className="data-card">
                <div className="data-value">{sunPosition.zenithAngle.toFixed(1)}°</div>
                <div className="data-label">Zenith Angle</div>
              </div>
              <div className="data-card">
                <div className="data-value">{sunPosition.solarNoon}</div>
                <div className="data-label">Solar Noon</div>
              </div>
              <div className="data-card">
                <div className="data-value">{sunPosition.sunriseTime}</div>
                <div className="data-label">Sunrise</div>
              </div>
              <div className="data-card">
                <div className="data-value">{sunPosition.sunsetTime}</div>
                <div className="data-label">Sunset</div>
              </div>
              <div className="data-card">
                <div className="data-value">{sunPosition.sunsetHours.toFixed(1)}h</div>
                <div className="data-label">Daylight Hours</div>
              </div>
              <div className="data-card">
                <div className="data-value">Day {sunPosition.dayOfYear}</div>
                <div className="data-label">Day of Year</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Weather Conditions */}
      <div className="form-section">
        <h3>🌤️ Weather Conditions</h3>
        <div className="weather-grid">
          <div className="form-group">
            <label>Temperature (°C)</label>
            <input
              type="number"
              value={weather.temperature}
              onChange={(e) => setWeather({ ...weather, temperature: parseFloat(e.target.value) })}
              min="-40"
              max="60"
            />
          </div>
          <div className="form-group">
            <label>Cloud Cover (%)</label>
            <input
              type="number"
              value={weather.cloudCover}
              onChange={(e) => setWeather({ ...weather, cloudCover: parseFloat(e.target.value) })}
              min="0"
              max="100"
            />
          </div>
          <div className="form-group">
            <label>Wind Speed (m/s)</label>
            <input
              type="number"
              value={weather.windSpeed}
              onChange={(e) => setWeather({ ...weather, windSpeed: parseFloat(e.target.value) })}
              min="0"
              max="30"
              step="0.1"
            />
          </div>
          <div className="form-group">
            <label>Humidity (%)</label>
            <input
              type="number"
              value={weather.humidity}
              onChange={(e) => setWeather({ ...weather, humidity: parseFloat(e.target.value) })}
              min="0"
              max="100"
            />
          </div>
          <div className="form-group">
            <label>UV Index</label>
            <input
              type="number"
              value={weather.uvIndex}
              onChange={(e) => setWeather({ ...weather, uvIndex: parseFloat(e.target.value) })}
              min="0"
              max="11"
            />
          </div>
          <div className="form-group">
            <label>Irradiance (W/m²)</label>
            <input
              type="number"
              value={weather.irradiance}
              onChange={(e) => setWeather({ ...weather, irradiance: parseFloat(e.target.value) })}
              min="0"
              max="1200"
            />
          </div>
        </div>

        <button onClick={handleGenerateProductionForecast} className="btn-calculate">
          📊 Generate Production Forecast
        </button>
      </div>

      {/* Production Forecast */}
      {productionForecast && (
        <div className="forecast-section">
          <h3>📈 Production Forecast</h3>
          <div className="forecast-cards">
            <div className="forecast-card highlight">
              <div className="card-value">{productionForecast.forecastedProduction.toFixed(1)} kWh</div>
              <div className="card-label">Forecasted Daily Production</div>
            </div>
            <div className="forecast-card">
              <div className="card-value">{productionForecast.confidence}%</div>
              <div className="card-label">Confidence Level</div>
            </div>
            <div className="forecast-card">
              <div className="card-value">{productionForecast.bestGenerationTime}</div>
              <div className="card-label">Peak Generation Time</div>
            </div>
            <div className="forecast-card">
              <div className="card-value">{Math.round(productionForecast.weatherFactors.combinedEfficiency * 100)}%</div>
              <div className="card-label">System Efficiency</div>
            </div>
          </div>

          {/* Weather Impact Details */}
          <div className="impact-details">
            <h4>🌡️ Weather Impact Analysis</h4>
            <div className="impact-grid">
              <div className="impact-item">
                <span className="label">Temperature Derating:</span>
                <span className="value">{(productionForecast.weatherFactors.temperatureDerating * 100).toFixed(1)}%</span>
              </div>
              <div className="impact-item">
                <span className="label">Cloud Cover Loss:</span>
                <span className="value">{productionForecast.weatherFactors.cloudCoverLoss.toFixed(1)}%</span>
              </div>
              <div className="impact-item">
                <span className="label">Wind Cooling Factor:</span>
                <span className="value">{(productionForecast.weatherFactors.windCoolingFactor * 100).toFixed(1)}%</span>
              </div>
              <div className="impact-item">
                <span className="label">Seasonal Factor:</span>
                <span className="value">{(productionForecast.weatherFactors.seasonalFactor * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Warnings */}
          {productionForecast.warnings.length > 0 && (
            <div className="warnings-section">
              <h4>⚠️ Weather Warnings:</h4>
              <ul>
                {productionForecast.warnings.map((warning: string, i: number) => (
                  <li key={i}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Hourly Generation */}
          <div className="hourly-section">
            <h4>📊 Hourly Generation Pattern</h4>
            <div className="hourly-chart">
              {productionForecast.hourlyData.map((hour: any) => (
                <div key={hour.hour} className="hourly-bar">
                  <div className="bar-label">{String(hour.hour).padStart(2, '0')}h</div>
                  <div className="bar-container">
                    <div
                      className="bar"
                      style={{ height: `${(hour.systemOutput / 100) * 100}%` }}
                      title={`${Math.round(hour.systemOutput)}W`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ==================== ROOF SHADING TAB ====================

  const renderRoofShadingTab = () => (
    <div className="calculator-tab roofshading-tab">
      <div className="section-header">
        <h2>🏠 Roof Shading & Obstruction Analysis</h2>
        <p>Calculate production losses from trees, buildings, and obstructions</p>
      </div>

      {/* Roof Specification */}
      <div className="form-section">
        <h3>🏘️ Roof Specification</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Roof Azimuth (°)</label>
            <input
              type="number"
              value={roofSpec.roofAzimuth}
              onChange={(e) => setRoofSpec({ ...roofSpec, roofAzimuth: parseFloat(e.target.value) })}
              min="0"
              max="360"
              placeholder="0=N, 90=E, 180=S, 270=W"
            />
            <small>0=North, 90=East, 180=South, 270=West</small>
          </div>
          <div className="form-group">
            <label>Roof Tilt (°)</label>
            <input
              type="number"
              value={roofSpec.roofTilt}
              onChange={(e) => setRoofSpec({ ...roofSpec, roofTilt: parseFloat(e.target.value) })}
              min="0"
              max="90"
            />
          </div>
          <div className="form-group">
            <label>Roof Area (m²)</label>
            <input
              type="number"
              value={roofSpec.roofArea}
              onChange={(e) => setRoofSpec({ ...roofSpec, roofArea: parseFloat(e.target.value) })}
              min="1"
              max="500"
            />
          </div>
          <div className="form-group">
            <label>Roof Type</label>
            <select value={roofSpec.roofType} onChange={(e) => setRoofSpec({ ...roofSpec, roofType: e.target.value as any })}>
              <option value="flat">Flat</option>
              <option value="pitched">Pitched</option>
              <option value="standing-seam">Standing Seam</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shading Objects */}
      <div className="form-section">
        <h3>🌳 Shading Objects</h3>
        <div className="shading-objects-list">
          {shadingObjects.map((obj, index) => (
            <div key={index} className="shading-item">
              <div className="shading-grid">
                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={obj.type}
                    onChange={(e) => handleUpdateShadingObject(index, 'type', e.target.value)}
                  >
                    <option value="tree">Tree</option>
                    <option value="building">Building</option>
                    <option value="mountain">Mountain</option>
                    <option value="structure">Structure</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={obj.name}
                    onChange={(e) => handleUpdateShadingObject(index, 'name', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Distance (m)</label>
                  <input
                    type="number"
                    value={obj.distance}
                    onChange={(e) => handleUpdateShadingObject(index, 'distance', parseFloat(e.target.value))}
                    min="1"
                    max="500"
                  />
                </div>
                <div className="form-group">
                  <label>Height (m)</label>
                  <input
                    type="number"
                    value={obj.height}
                    onChange={(e) => handleUpdateShadingObject(index, 'height', parseFloat(e.target.value))}
                    min="1"
                    max="100"
                  />
                </div>
                <div className="form-group">
                  <label>Azimuth Start (°)</label>
                  <input
                    type="number"
                    value={obj.azimuthStart}
                    onChange={(e) => handleUpdateShadingObject(index, 'azimuthStart', parseFloat(e.target.value))}
                    min="0"
                    max="360"
                  />
                </div>
                <div className="form-group">
                  <label>Azimuth End (°)</label>
                  <input
                    type="number"
                    value={obj.azimuthEnd}
                    onChange={(e) => handleUpdateShadingObject(index, 'azimuthEnd', parseFloat(e.target.value))}
                    min="0"
                    max="360"
                  />
                </div>
                <div className="form-group">
                  <label>Elevation Angle (°)</label>
                  <input
                    type="number"
                    value={obj.elevationAngle}
                    onChange={(e) => handleUpdateShadingObject(index, 'elevationAngle', parseFloat(e.target.value))}
                    min="0"
                    max="90"
                  />
                </div>
                {obj.type === 'tree' && (
                  <div className="form-group">
                    <label>Season</label>
                    <select
                      value={obj.season || 'year-round'}
                      onChange={(e) => handleUpdateShadingObject(index, 'season', e.target.value)}
                    >
                      <option value="winter">Winter Only</option>
                      <option value="summer">Summer Only</option>
                      <option value="year-round">Year-round</option>
                    </select>
                  </div>
                )}
                <button onClick={() => handleRemoveShadingObject(index)} className="btn-remove">
                  🗑️ Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={handleAddShadingObject} className="btn-primary">
          + Add Shading Object
        </button>
      </div>

      {/* Analyze Button */}
      <button onClick={handleAnalyzeShadingProfile} className="btn-calculate">
        🔍 Analyze Shading Profile
      </button>

      {/* Shading Analysis Results */}
      {shadingAnalysis && (
        <div className="shading-results">
          <h3>📊 Shading Analysis Results</h3>

          <div className="analysis-cards">
            <div className="analysis-card highlight">
              <div className="card-value">{shadingAnalysis.productionLossPercentage.toFixed(1)}%</div>
              <div className="card-label">Annual Production Loss</div>
            </div>
            <div className="analysis-card">
              <div className="card-value">{shadingAnalysis.annualProductionLoss.toFixed(0)}</div>
              <div className="card-label">Annual Loss (kWh for 1kW)</div>
            </div>
          </div>

          {/* Seasonal Breakdown */}
          <div className="seasonal-breakdown">
            <h4>📅 Seasonal Shading Losses</h4>
            <div className="season-grid">
              <div className="season-item">
                <span className="season-name">❄️ Winter</span>
                <span className="season-value">{shadingAnalysis.bySeason.winter.toFixed(1)}%</span>
              </div>
              <div className="season-item">
                <span className="season-name">🌸 Spring</span>
                <span className="season-value">{shadingAnalysis.bySeason.spring.toFixed(1)}%</span>
              </div>
              <div className="season-item">
                <span className="season-name">☀️ Summer</span>
                <span className="season-value">{shadingAnalysis.bySeason.summer.toFixed(1)}%</span>
              </div>
              <div className="season-item">
                <span className="season-name">🍂 Fall</span>
                <span className="season-value">{shadingAnalysis.bySeason.fall.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Monthly Breakdown */}
          <div className="monthly-breakdown">
            <h4>📆 Monthly Shading Losses</h4>
            <div className="monthly-chart">
              {shadingAnalysis.monthlyLoss.map((loss: number, i: number) => (
                <div key={i} className="month-bar">
                  <div className="bar-container">
                    <div className="bar" style={{ height: `${Math.min(100, loss * 5)}%` }} />
                  </div>
                  <div className="month-label">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                  </div>
                  <div className="month-value">{loss.toFixed(1)}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          {shadingAnalysis.recommendations.length > 0 && (
            <div className="recommendations-section">
              <h4>💡 Recommendations:</h4>
              <ul>
                {shadingAnalysis.recommendations.map((rec: string, i: number) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Visualization */}
          {shadingAnalysis.shadingVisualization && (
            <div className="visualization-section">
              <h4>🗺️ Shading Visualization</h4>
              <pre className="visualization">{shadingAnalysis.shadingVisualization}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="advanced-solar-calculator">
      <header className="calculator-header">
        <h1>🌟 INTELLIGENT SOLAR CALCULATOR</h1>
        <p>Harvard-level solar system design, diagnostics, and installation guide</p>
      </header>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'sizing' ? 'active' : ''}`}
          onClick={() => setActiveTab('sizing')}
        >
          ⚡ System Sizing
        </button>
        <button
          className={`tab-btn ${activeTab === 'diagnostic' ? 'active' : ''}`}
          onClick={() => setActiveTab('diagnostic')}
        >
          🤖 Diagnostics
        </button>
        <button
          className={`tab-btn ${activeTab === 'quality' ? 'active' : ''}`}
          onClick={() => setActiveTab('quality')}
        >
          ✅ Quality Check
        </button>
        <button
          className={`tab-btn ${activeTab === 'installation' ? 'active' : ''}`}
          onClick={() => setActiveTab('installation')}
        >
          🛠️ Installation
        </button>
        <button
          className={`tab-btn ${activeTab === 'sunweather' ? 'active' : ''}`}
          onClick={() => setActiveTab('sunweather')}
        >
          ☀️ Sun & Weather
        </button>
        <button
          className={`tab-btn ${activeTab === 'roofshading' ? 'active' : ''}`}
          onClick={() => setActiveTab('roofshading')}
        >
          🏠 Roof Shading
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'sizing' && renderSizingTab()}
        {activeTab === 'diagnostic' && renderDiagnosticTab()}
        {activeTab === 'quality' && renderQualityTab()}
        {activeTab === 'installation' && renderInstallationTab()}
        {activeTab === 'sunweather' && renderSunWeatherTab()}
        {activeTab === 'roofshading' && renderRoofShadingTab()}
      </div>
    </div>
  );
};

// ==================== CALCULATION RESULTS COMPONENT ====================

const RenderCalculationResults: React.FC<{ result: CalculationResult }> = ({ result }) => (
  <div className="calculation-results">
    <h2>📊 System Design Recommendation</h2>

    {/* Summary Cards */}
    <div className="results-grid">
      <div className="result-card highlight">
        <div className="card-value">{result.recommendation.systemSizeKW.toFixed(1)} kW</div>
        <div className="card-label">System Size</div>
      </div>
      <div className="result-card highlight">
        <div className="card-value">{result.recommendation.panelCount}</div>
        <div className="card-label">Solar Panels @ {result.recommendation.panelWattage}W</div>
      </div>
      <div className="result-card highlight">
        <div className="card-value">{result.recommendation.inverterSize} kW</div>
        <div className="card-label">Inverter Size</div>
      </div>
      <div className="result-card highlight">
        <div className="card-value">{result.recommendation.batteryCapacityKWh} kWh</div>
        <div className="card-label">Battery Storage</div>
      </div>
    </div>

    {/* Detailed Specs */}
    <div className="specs-section">
      <h3>⚙️ System Specifications</h3>
      <div className="specs-grid">
        <div className="spec-item">
          <span className="spec-label">Panel Type:</span>
          <span className="spec-value">{result.recommendation.panelType}</span>
        </div>
        <div className="spec-item">
          <span className="spec-label">Inverter Type:</span>
          <span className="spec-value">{result.recommendation.inverterType}</span>
        </div>
        <div className="spec-item">
          <span className="spec-label">Battery Type:</span>
          <span className="spec-value">{result.recommendation.batteryType} @ {result.recommendation.batteryVoltage}V</span>
        </div>
        <div className="spec-item">
          <span className="spec-label">Main Cable Size:</span>
          <span className="spec-value">{result.recommendation.cableMainSize} mm²</span>
        </div>
        <div className="spec-item">
          <span className="spec-label">Annual Production:</span>
          <span className="spec-value">{result.recommendation.estimatedProduction.toLocaleString()} kWh/year</span>
        </div>
        <div className="spec-item">
          <span className="spec-label">Payback Period:</span>
          <span className="spec-value">{result.recommendation.paybackPeriod} months</span>
        </div>
      </div>
    </div>

    {/* Cost Estimate */}
    <div className="cost-section">
      <h3>💰 Cost Estimate (KSH)</h3>
      <div className="cost-breakdown">
        <div className="cost-row">
          <span>Solar Panels ({result.recommendation.panelCount} × {result.recommendation.panelWattage}W)</span>
          <span>{result.costEstimate.panels.toLocaleString()}</span>
        </div>
        <div className="cost-row">
          <span>Inverter ({result.recommendation.inverterSize} kW)</span>
          <span>{result.costEstimate.inverter.toLocaleString()}</span>
        </div>
        <div className="cost-row">
          <span>Battery ({result.recommendation.batteryCapacityKWh} kWh)</span>
          <span>{result.costEstimate.battery.toLocaleString()}</span>
        </div>
        <div className="cost-row">
          <span>Cables & Wiring</span>
          <span>{result.costEstimate.cables.toLocaleString()}</span>
        </div>
        <div className="cost-row">
          <span>Breakers & Disconnects</span>
          <span>{(result.costEstimate.breakers + result.costEstimate.disconnects).toLocaleString()}</span>
        </div>
        <div className="cost-row">
          <span>Miscellaneous</span>
          <span>{result.costEstimate.miscellaneous.toLocaleString()}</span>
        </div>
        <div className="cost-row">
          <span>Installation Labour</span>
          <span>{result.costEstimate.installation.toLocaleString()}</span>
        </div>
        <div className="cost-row">
          <span>Permitting</span>
          <span>{result.costEstimate.permitting.toLocaleString()}</span>
        </div>
        <div className="cost-row total">
          <span>SUBTOTAL</span>
          <span>{result.costEstimate.subtotal.toLocaleString()}</span>
        </div>
        <div className="cost-row">
          <span>Contingency (10%)</span>
          <span>{result.costEstimate.contingency.toLocaleString()}</span>
        </div>
        <div className="cost-row grand-total">
          <span>TOTAL INVESTMENT</span>
          <span className="total-value">KSH {result.costEstimate.total.toLocaleString()}</span>
        </div>
        <div className="cost-row">
          <span>Cost per kW</span>
          <span>KSH {Math.round(result.costEstimate.costPerKW).toLocaleString()}</span>
        </div>
      </div>
    </div>

    {/* Quality Warnings */}
    {result.qualityWarnings.length > 0 && (
      <div className="warnings-section">
        <h3>⚠️ Quality Recommendations</h3>
        <ul>
          {result.qualityWarnings.map((warning, i) => (
            <li key={i}>{warning}</li>
          ))}
        </ul>
      </div>
    )}

    {/* Safety Notes */}
    {result.safetyNotes.length > 0 && (
      <div className="safety-section">
        <h3>🔒 Safety Requirements</h3>
        <ul>
          {result.safetyNotes.map((note, i) => (
            <li key={i}>{note}</li>
          ))}
        </ul>
      </div>
    )}

    {/* Export Button */}
    <div className="export-section">
      <button className="btn-export" onClick={() => window.print()}>
        📄 Export as PDF
      </button>
    </div>
  </div>
);

export default AdvancedSolarCalculator;
