// components/services/Incinerators.jsx
import React, { useState, useMemo, useCallback } from "react";

export default function Incinerators({ performanceTier }) {
  const [sizingInputs, setSizingInputs] = useState({ 
    dailyWaste: "", 
    wasteType: "medical",
    operatingHours: 8,
    peakFactor: 1.5,
    futureGrowth: 25,
    chamberCount: 1
  });

  const [fuelInputs, setFuelInputs] = useState({
    wasteRate: "",
    calorificValue: "10000",
    burnerEfficiency: 85,
    fuelType: "diesel",
    preheat: "no",
    secondaryBurn: "yes"
  });

  const [complianceInputs, setComplianceInputs] = useState({
    facilityType: "hospital",
    location: "urban",
    fineProbability: 85,
    averageFine: "3500000",
    systemCost: "",
    annualMaintenance: "300000"
  });

  const wasteTypes = {
    medical: { density: 150, calorific: 12000, ash: 10 },
    industrial: { density: 300, calorific: 8000, ash: 30 },
    agricultural: { density: 200, calorific: 15000, ash: 15 },
    municipal: { density: 250, calorific: 10000, ash: 25 },
    hazardous: { density: 500, calorific: 5000, ash: 40 }
  };

  const requiredCapacity = useMemo(() => {
    const daily = parseFloat(sizingInputs.dailyWaste) || 0;
    const wasteType = wasteTypes[sizingInputs.wasteType];
    const operatingHours = parseFloat(sizingInputs.operatingHours) || 8;
    const peakFactor = parseFloat(sizingInputs.peakFactor) || 1.5;
    const growth = 1 + (parseFloat(sizingInputs.futureGrowth) || 0) / 100;
    
    if (daily <= 0 || operatingHours <= 0) return 0;
    
    const hourly = (daily * peakFactor * growth) / operatingHours;
    return Math.max(0, Math.round(hourly));
  }, [sizingInputs]);

  const chamberSize = useMemo(() => {
    const capacity = requiredCapacity;
    if (capacity <= 0) return { volume: 0, retention: 0, size: 'N/A' };
    
    const wasteType = wasteTypes[sizingInputs.wasteType];
    const volume = capacity / wasteType.density * 1.5;
    const retention = wasteType.density > 200 ? 1.0 : 1.5;
    
    let size = 'Small';
    if (capacity > 100) size = 'Medium';
    if (capacity > 500) size = 'Large';
    if (capacity > 1000) size = 'Industrial';
    
    return {
      volume: Math.round(volume * 10) / 10,
      retention: retention,
      size: size,
      chambers: Math.min(3, Math.ceil(capacity / 200))
    };
  }, [requiredCapacity, sizingInputs.wasteType]);

  const fuelConsumption = useMemo(() => {
    const rate = parseFloat(fuelInputs.wasteRate) || requiredCapacity;
    const cv = parseFloat(fuelInputs.calorificValue) || 10000;
    const efficiency = fuelInputs.burnerEfficiency / 100;
    
    if (rate <= 0 || efficiency <= 0) return { diesel: 0, electricity: 0, total: 0 };
    
    const energyNeeded = (rate * cv * (1 - wasteTypes[sizingInputs.wasteType].ash/100)) / efficiency;
    
    const fuelConsumptions = {
      diesel: energyNeeded / 45000,
      naturalGas: energyNeeded / 36000,
      lpg: energyNeeded / 46000,
      electricity: energyNeeded / 3600
    };
    
    const diesel = fuelConsumptions.diesel;
    const electricity = rate * 0.5;
    const totalCost = diesel * 150 + electricity * 22;
    
    return {
      diesel: +(diesel).toFixed(2),
      electricity: Math.round(electricity),
      totalCost: Math.round(totalCost * sizingInputs.operatingHours),
      perHour: Math.round(totalCost)
    };
  }, [fuelInputs, requiredCapacity, sizingInputs.wasteType, sizingInputs.operatingHours]);

  const complianceROI = useMemo(() => {
    const systemCost = parseFloat(complianceInputs.systemCost) || 0;
    const fineProb = complianceInputs.fineProbability / 100;
    const averageFine = parseFloat(complianceInputs.averageFine) || 0;
    const annualMaintenance = parseFloat(complianceInputs.annualMaintenance) || 0;
    
    if (systemCost <= 0) return { years: 0, annualRisk: 0, savings: 0 };
    
    const annualRisk = fineProb * averageFine;
    const annualSavings = annualRisk - annualMaintenance;
    const roiYears = annualSavings > 0 ? systemCost / annualSavings : 0;
    
    return {
      years: +(roiYears).toFixed(1),
      annualRisk: Math.round(annualRisk),
      annualSavings: Math.round(annualSavings),
      paybackMonths: Math.round(roiYears * 12)
    };
  }, [complianceInputs]);

  const emissionStandards = useMemo(() => {
    const wasteType = sizingInputs.wasteType;
    const location = complianceInputs.location;
    
    const standards = {
      nema: {
        particulate: location === 'urban' ? 50 : 100,
        co: 50,
        so2: 200,
        nox: 400,
        dioxins: 0.1
      },
      who: {
        particulate: 25,
        co: 10,
        so2: 20,
        nox: 40,
        dioxins: 0.1
      },
      eu: {
        particulate: 10,
        co: 50,
        so2: 50,
        nox: 200,
        dioxins: 0.1
      }
    };
    
    return standards;
  }, [sizingInputs.wasteType, complianceInputs.location]);

  const handleSizingChange = useCallback((field) => (e) => {
    const value = e.target.value;
    setSizingInputs(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleFuelChange = useCallback((field) => (e) => {
    const value = e.target.value;
    setFuelInputs(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleComplianceChange = useCallback((field) => (e) => {
    const value = e.target.value;
    setComplianceInputs(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleWasteTypeSelect = useCallback((type) => {
    const waste = wasteTypes[type];
    setSizingInputs(prev => ({ ...prev, wasteType: type }));
    setFuelInputs(prev => ({ 
      ...prev, 
      calorificValue: waste.calorificValue || waste.calorific.toString()
    }));
  }, []);

  const handleFacilityTypeSelect = useCallback((type) => {
    setComplianceInputs(prev => ({ ...prev, facilityType: type }));
  }, []);

  const formatWaste = useCallback((kg) => {
    if (kg >= 1000) return `${(kg/1000).toFixed(1)} tons`;
    return `${kg} kg`;
  }, []);

  const getWasteIcon = useCallback((type) => {
    const icons = {
      medical: "🏥",
      industrial: "🏭",
      agricultural: "🌾",
      municipal: "🗑️",
      hazardous: "☢️"
    };
    return icons[type] || "🗑️";
  }, []);

  return (
    <section className="service service--incin section-pad" aria-labelledby="inc-heading">
      <div className="grid-two">
        <div>
          <h2 id="inc-heading" className="incin-title">
            <span className="title-icon">🔥</span>
            Medical & Industrial Incinerators
          </h2>
          <p className="service-description">
            <strong>99.99% destruction efficiency</strong>, 
            <strong> NEMA/KEBS/WHO compliance</strong>, real‑time emissions monitoring, 
            automated safety interlocks, <strong>ash handling</strong> systems, 
            <strong> heat recovery</strong> options.
          </p>
          
          <div className="waste-type-selector">
            <p className="selector-label">Select waste type:</p>
            <div className="waste-buttons">
              {Object.keys(wasteTypes).map(type => (
                <button
                  key={type}
                  onClick={() => handleWasteTypeSelect(type)}
                  className={`waste-btn ${sizingInputs.wasteType === type ? 'active' : ''}`}
                  type="button"
                  aria-label={`Select ${type} waste type`}
                >
                  <span className="waste-icon">{getWasteIcon(type)}</span>
                  <span className="waste-name">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="compliance-badges">
            <div className="badge">
              <div className="badge-icon">🏛️</div>
              <div className="badge-content">
                <div className="badge-title">NEMA Certified</div>
                <div className="badge-subtitle">Kenya Standards</div>
              </div>
            </div>
            <div className="badge">
              <div className="badge-icon">🌍</div>
              <div className="badge-content">
                <div className="badge-title">WHO Guidelines</div>
                <div className="badge-subtitle">Global Standards</div>
              </div>
            </div>
            <div className="badge">
              <div className="badge-icon">🔬</div>
              <div className="badge-content">
                <div className="badge-title">EPA Standards</div>
                <div className="badge-subtitle">Emissions Control</div>
              </div>
            </div>
          </div>
          
          <div className="cta-row">
            <a className="btn-neon" href="mailto:incinerator@emersoneims.com?subject=Incinerator%20Consultation" aria-label="Request incinerator consultation">
              🔥 Request Free Consultation
            </a>
            <a className="btn-neon" href="tel:0768860655" aria-label="Call waste engineer at 0768 860 655">
              👷 Waste Engineer: 0768 860 655
            </a>
          </div>
        </div>
        <figure aria-labelledby="incin-caption">
          <img 
            src="https://www.emersoneims.com/wp-content/uploads/2025/10/UPS-EIGHT.svg" 
            alt="Industrial incinerator control system with monitoring displays and safety controls" 
            loading="lazy"
            width="600"
            height="400"
          />
          <figcaption id="incin-caption">Advanced incineration systems with emission control and heat recovery.</figcaption>
        </figure>
      </div>

      <div className="grid-two">
        <div className="card sizing-card">
          <div className="card-header">
            <h3>Incinerator Sizing Calculator</h3>
            <span className="card-badge">Capacity Planning</span>
          </div>
          
          <div className="calc-grid">
            <label htmlFor="dw">
              <span className="label-text">Daily Waste Generation (kg)</span>
              <span className="label-hint">Total waste produced per day</span>
            </label>
            <div className="input-wrapper">
              <input 
                id="dw" 
                type="number" 
                min="0"
                max="100000"
                step="10"
                value={sizingInputs.dailyWaste}
                onChange={handleSizingChange("dailyWaste")}
                placeholder="e.g., 500"
              />
              <span className="input-unit">kg/day</span>
            </div>

            <label htmlFor="hours">
              <span className="label-text">Operating Hours/Day</span>
              <span className="label-hint">Daily incineration schedule</span>
            </label>
            <div className="input-wrapper">
              <select 
                id="hours"
                value={sizingInputs.operatingHours}
                onChange={handleSizingChange("operatingHours")}
                aria-label="Select operating hours"
              >
                <option value="4">4 hours</option>
                <option value="8">8 hours</option>
                <option value="12">12 hours</option>
                <option value="16">16 hours</option>
                <option value="24">24 hours</option>
              </select>
            </div>

            <label htmlFor="peak">
              <span className="label-text">Peak Load Factor</span>
              <span className="label-hint">Maximum vs average load</span>
            </label>
            <div className="input-wrapper">
              <div className="slider-container">
                <input 
                  id="peak" 
                  type="range"
                  min="1"
                  max="2.5"
                  step="0.1"
                  value={sizingInputs.peakFactor}
                  onChange={(e) => setSizingInputs(prev => ({ ...prev, peakFactor: e.target.value }))}
                  aria-label="Adjust peak load factor"
                />
                <div className="slider-value">{sizingInputs.peakFactor}</div>
              </div>
            </div>

            <label htmlFor="growth">
              <span className="label-text">Future Growth (%)</span>
              <span className="label-hint">Expected waste increase</span>
            </label>
            <div className="input-wrapper">
              <select 
                id="growth"
                value={sizingInputs.futureGrowth}
                onChange={handleSizingChange("futureGrowth")}
                aria-label="Select future growth percentage"
              >
                <option value="10">10% growth</option>
                <option value="25">25% growth</option>
                <option value="50">50% growth</option>
                <option value="100">100% growth (double)</option>
              </select>
            </div>

            <label htmlFor="chambers">
              <span className="label-text">Number of Chambers</span>
              <span className="label-hint">Primary + secondary chambers</span>
            </label>
            <div className="input-wrapper">
              <select 
                id="chambers"
                value={sizingInputs.chamberCount}
                onChange={handleSizingChange("chamberCount")}
                aria-label="Select number of chambers"
              >
                <option value="1">1 chamber (Basic)</option>
                <option value="2">2 chambers (Standard)</option>
                <option value="3">3 chambers (Advanced)</option>
              </select>
            </div>
          </div>

          <div className="calc-results">
            <div className="sizing-summary">
              <div className="summary-item">
                <div className="summary-label">Required Capacity</div>
                <div className="summary-value">
                  {formatWaste(requiredCapacity)}/hour
                </div>
                <div className="summary-note">
                  {sizingInputs.operatingHours} hours operation
                </div>
              </div>
              
              <div className="summary-item">
                <div className="summary-label">Chamber Size</div>
                <div className="summary-value">{chamberSize.size}</div>
                <div className="summary-note">
                  {chamberSize.volume} m³ volume
                </div>
              </div>
            </div>
            
            {requiredCapacity > 0 && (
              <>
                <div className="system-specification">
                  <h5>System Specification</h5>
                  <div className="spec-grid">
                    <div className="spec-item">
                      <span className="spec-label">Type:</span>
                      <span className="spec-value">
                        {sizingInputs.wasteType.charAt(0).toUpperCase() + sizingInputs.wasteType.slice(1)} Waste Incinerator
                      </span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Chambers:</span>
                      <span className="spec-value">{chamberSize.chambers} (Primary + Secondary)</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Retention Time:</span>
                      <span className="spec-value">{chamberSize.retention} seconds</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Temperature:</span>
                      <span className="spec-value">850–1100°C</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Estimated Cost:</span>
                      <span className="spec-value">
                        KSh {Math.round(requiredCapacity * 50000).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="recommended-models">
                  <h5>Recommended Models</h5>
                  <div className="models-grid">
                    {getRecommendedModels(requiredCapacity, sizingInputs.wasteType).map(model => (
                      <div key={model.name} className="model-card">
                        <div className="model-header">
                          <div className="model-name">{model.name}</div>
                          <div className="model-capacity">{formatWaste(model.capacity)}/hr</div>
                        </div>
                        <ul className="model-features">
                          {model.features.map((feature, i) => (
                            <li key={i}>{feature}</li>
                          ))}
                        </ul>
                        <div className="model-price">
                          KSh {model.price.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="card fuel-card">
          <div className="card-header">
            <h3>Fuel Consumption & Emissions</h3>
            <span className="card-badge">Efficiency Analysis</span>
          </div>
          
          <div className="fuel-type-selector">
            <p className="selector-label">Select fuel type:</p>
            <div className="fuel-buttons">
              {['diesel', 'naturalGas', 'lpg', 'electricity'].map(type => (
                <button
                  key={type}
                  onClick={() => setFuelInputs(prev => ({ ...prev, fuelType: type }))}
                  className={`fuel-btn ${fuelInputs.fuelType === type ? 'active' : ''}`}
                  type="button"
                  aria-label={`Select ${type} fuel`}
                >
                  {type === 'diesel' && '⛽'}
                  {type === 'naturalGas' && '🔥'}
                  {type === 'lpg' && '🏺'}
                  {type === 'electricity' && '⚡'}
                  <span className="fuel-name">
                    {type === 'naturalGas' ? 'Natural Gas' : type.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="calc-grid">
            <label htmlFor="wr">
              <span className="label-text">Waste Processing Rate (kg/hr)</span>
              <span className="label-hint">How much waste is burned per hour</span>
            </label>
            <div className="input-wrapper">
              <input 
                id="wr" 
                type="number" 
                min="0"
                max="5000"
                step="10"
                value={fuelInputs.wasteRate || requiredCapacity}
                onChange={handleFuelChange("wasteRate")}
                placeholder="Auto-filled"
              />
              <span className="input-unit">kg/hour</span>
            </div>

            <label htmlFor="cv">
              <span className="label-text">Calorific Value (kJ/kg)</span>
              <span className="label-hint">Energy content of waste</span>
            </label>
            <div className="input-wrapper">
              <select 
                id="cv"
                value={fuelInputs.calorificValue}
                onChange={handleFuelChange("calorificValue")}
                aria-label="Select calorific value"
              >
                <option value="5000">5,000 kJ/kg (Low)</option>
                <option value="8000">8,000 kJ/kg (Medium)</option>
                <option value="10000">10,000 kJ/kg (Standard)</option>
                <option value="15000">15,000 kJ/kg (High)</option>
                <option value="20000">20,000 kJ/kg (Very High)</option>
              </select>
            </div>

            <label htmlFor="be">
              <span className="label-text">Burner Efficiency (%)</span>
              <span className="label-hint">Fuel combustion efficiency</span>
            </label>
            <div className="input-wrapper">
              <div className="percentage-control">
                <input 
                  id="be" 
                  type="range"
                  min="60"
                  max="95"
                  step="1"
                  value={fuelInputs.burnerEfficiency}
                  onChange={(e) => setFuelInputs(prev => ({ ...prev, burnerEfficiency: e.target.value }))}
                  aria-label="Adjust burner efficiency"
                />
                <div className="percentage-value">{fuelInputs.burnerEfficiency}%</div>
              </div>
            </div>

            <div className="efficiency-options">
              <div className="option-group">
                <label htmlFor="preheat">
                  <span className="label-text">Air Preheat</span>
                </label>
                <select 
                  id="preheat"
                  value={fuelInputs.preheat}
                  onChange={handleFuelChange("preheat")}
                  className="small-select"
                  aria-label="Select air preheat option"
                >
                  <option value="no">No preheat</option>
                  <option value="low">Low (200°C)</option>
                  <option value="medium">Medium (400°C)</option>
                  <option value="high">High (600°C)</option>
                </select>
              </div>
              
              <div className="option-group">
                <label htmlFor="secondary">
                  <span className="label-text">Secondary Burn</span>
                </label>
                <select 
                  id="secondary"
                  value={fuelInputs.secondaryBurn}
                  onChange={handleFuelChange("secondaryBurn")}
                  className="small-select"
                  aria-label="Select secondary burn option"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes (Standard)</option>
                  <option value="catalytic">Catalytic</option>
                </select>
              </div>
            </div>
          </div>

          <div className="calc-results">
            <div className="fuel-summary">
              <div className="summary-item">
                <div className="summary-label">Fuel Consumption</div>
                <div className="summary-value">
                  {fuelConsumption.diesel > 0 ? `${fuelConsumption.diesel} L/hr` : '--'}
                </div>
                <div className="summary-note">
                  {fuelInputs.fuelType === 'diesel' ? 'Diesel' : 'Fuel'}
                </div>
              </div>
              
              <div className="summary-item">
                <div className="summary-label">Electricity Use</div>
                <div className="summary-value">
                  {fuelConsumption.electricity > 0 ? `${fuelConsumption.electricity} kWh/hr` : '--'}
                </div>
                <div className="summary-note">Blowers & controls</div>
              </div>
              
              <div className="summary-item">
                <div className="summary-label">Hourly Cost</div>
                <div className="summary-value">
                  KSh {fuelConsumption.perHour > 0 ? fuelConsumption.perHour.toLocaleString() : '--'}
                </div>
                <div className="summary-note">Operating cost</div>
              </div>
            </div>
            
            {fuelConsumption.diesel > 0 && (
              <>
                <div className="cost-breakdown">
                  <h5>Daily Operating Cost</h5>
                  <div className="breakdown-chart">
                    <div className="breakdown-item">
                      <div className="breakdown-label">
                        <span className="item-name">Fuel Cost</span>
                        <span className="item-detail">
                          {fuelConsumption.diesel} L/hr × {sizingInputs.operatingHours} hrs
                        </span>
                      </div>
                      <div className="breakdown-value">
                        KSh {Math.round(fuelConsumption.diesel * 150 * sizingInputs.operatingHours).toLocaleString()}
                      </div>
                      <div 
                        className="breakdown-bar" 
                        style={{ width: '70%' }}
                      ></div>
                    </div>
                    
                    <div className="breakdown-item">
                      <div className="breakdown-label">
                        <span className="item-name">Electricity Cost</span>
                        <span className="item-detail">
                          {fuelConsumption.electricity} kWh/hr × {sizingInputs.operatingHours} hrs
                        </span>
                      </div>
                      <div className="breakdown-value">
                        KSh {Math.round(fuelConsumption.electricity * 22 * sizingInputs.operatingHours).toLocaleString()}
                      </div>
                      <div 
                        className="breakdown-bar" 
                        style={{ width: '20%' }}
                      ></div>
                    </div>
                    
                    <div className="breakdown-item">
                      <div className="breakdown-label">
                        <span className="item-name">Maintenance</span>
                        <span className="item-detail">Daily estimated</span>
                      </div>
                      <div className="breakdown-value">
                        KSh {Math.round(requiredCapacity * 10).toLocaleString()}
                      </div>
                      <div 
                        className="breakdown-bar" 
                        style={{ width: '10%' }}
                      ></div>
                    </div>
                    
                    <div className="breakdown-total">
                      <span className="total-label">Total Daily Cost:</span>
                      <span className="total-value">KSh {fuelConsumption.totalCost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="emissions-estimate">
                  <h5>Estimated Emissions</h5>
                  <div className="emissions-grid">
                    <div className="emission-item">
                      <span className="emission-label">Particulate Matter:</span>
                      <span className="emission-value">5–15 mg/Nm³</span>
                    </div>
                    <div className="emission-item">
                      <span className="emission-label">Carbon Monoxide:</span>
                      <span className="emission-value">20–50 mg/Nm³</span>
                    </div>
                    <div className="emission-item">
                      <span className="emission-label">Nitrogen Oxides:</span>
                      <span className="emission-value">100–300 mg/Nm³</span>
                    </div>
                    <div className="emission-item">
                      <span className="emission-label">Dioxins/Furans:</span>
                      <span className="emission-value">&lt;0.1 ng TEQ/Nm³</span>
                    </div>
                  </div>
                  <div className="compliance-status">
                    <div className="status-icon">✅</div>
                    <div className="status-text">Meets NEMA emission standards</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="card compliance-card">
        <div className="card-header">
          <h3>Compliance Risk & ROI Analysis</h3>
          <span className="card-badge">Regulatory Compliance</span>
        </div>
        
        <div className="facility-selector">
          <p className="selector-label">Select facility type:</p>
          <div className="facility-buttons">
            {['hospital', 'clinic', 'industry', 'municipality', 'research'].map(type => (
              <button
                key={type}
                onClick={() => handleFacilityTypeSelect(type)}
                className={`facility-btn ${complianceInputs.facilityType === type ? 'active' : ''}`}
                type="button"
                aria-label={`Select ${type} facility type`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="calc-grid">
          <label htmlFor="fp">
            <span className="label-text">Fine Probability (%)</span>
            <span className="label-hint">Chance of non-compliance fine</span>
          </label>
          <div className="input-wrapper">
            <div className="probability-control">
              <input 
                id="fp" 
                type="range"
                min="0"
                max="100"
                step="5"
                value={complianceInputs.fineProbability}
                onChange={(e) => setComplianceInputs(prev => ({ ...prev, fineProbability: e.target.value }))}
                aria-label="Adjust fine probability"
              />
              <div className="probability-value">{complianceInputs.fineProbability}%</div>
            </div>
          </div>

          <label htmlFor="fa">
            <span className="label-text">Average Fine Amount (KSh)</span>
            <span className="label-hint">Typical non-compliance fine</span>
          </label>
          <div className="input-wrapper">
            <select 
              id="fa"
              value={complianceInputs.averageFine}
              onChange={handleComplianceChange("averageFine")}
              aria-label="Select average fine amount"
            >
              <option value="1000000">KSh 1,000,000 (Minor)</option>
              <option value="2500000">KSh 2,500,000 (Moderate)</option>
              <option value="3500000">KSh 3,500,000 (Standard)</option>
              <option value="5000000">KSh 5,000,000 (Major)</option>
              <option value="10000000">KSh 10,000,000 (Severe)</option>
            </select>
          </div>

          <label htmlFor="cc">
            <span className="label-text">Compliant System Cost (KSh)</span>
            <span className="label-hint">Cost of approved incinerator</span>
          </label>
          <div className="input-wrapper">
            <input 
              id="cc" 
              type="number" 
              min="0"
              max="50000000"
              step="100000"
              value={complianceInputs.systemCost}
              onChange={handleComplianceChange("systemCost")}
              placeholder="e.g., 5000000"
            />
            <span className="input-unit">KSh</span>
          </div>

          <label htmlFor="am">
            <span className="label-text">Annual Maintenance (KSh)</span>
            <span className="label-hint">Maintenance & monitoring cost</span>
            </label>
            <div className="input-wrapper">
              <input 
                id="am" 
                type="number" 
                min="0"
                max="2000000"
                step="50000"
                value={complianceInputs.annualMaintenance}
                onChange={handleComplianceChange("annualMaintenance")}
                placeholder="e.g., 300000"
              />
              <span className="input-unit">KSh/year</span>
            </div>

            <label htmlFor="location">
              <span className="label-text">Facility Location</span>
              <span className="label-hint">Affects emission standards</span>
            </label>
            <div className="input-wrapper">
              <select 
                id="location"
                value={complianceInputs.location}
                onChange={handleComplianceChange("location")}
                aria-label="Select facility location"
              >
                <option value="urban">Urban area</option>
                <option value="periurban">Peri-urban area</option>
                <option value="rural">Rural area</option>
                <option value="remote">Remote area</option>
              </select>
            </div>
          </div>

          <div className="calc-results">
            <div className="risk-analysis">
              <div className="risk-summary">
                <div className="risk-item">
                  <div className="risk-label">Annual Risk Exposure</div>
                  <div className="risk-value">
                    KSh {complianceROI.annualRisk.toLocaleString()}
                  </div>
                  <div className="risk-note">
                    Probability × Fine amount
                  </div>
                </div>
                
                <div className="risk-item">
                  <div className="risk-label">Risk Reduction</div>
                  <div className="risk-value">
                    {complianceInputs.fineProbability}%
                  </div>
                  <div className="risk-note">
                    With compliant system
                  </div>
                </div>
              </div>
              
              <div className="roi-analysis">
                <h5>Return on Investment</h5>
                <div className="roi-grid">
                  <div className="roi-item">
                    <span className="roi-label">System Cost:</span>
                    <span className="roi-value">
                      KSh {parseFloat(complianceInputs.systemCost || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="roi-item">
                    <span className="roi-label">Annual Savings:</span>
                    <span className="roi-value">
                      KSh {complianceROI.annualSavings.toLocaleString()}
                    </span>
                  </div>
                  <div className="roi-item">
                    <span className="roi-label">Payback Period:</span>
                    <span className="roi-value">
                      {complianceROI.years} years ({complianceROI.paybackMonths} months)
                    </span>
                  </div>
                  <div className="roi-item highlight">
                    <span className="roi-label">5-Year Net Benefit:</span>
                    <span className="roi-value">
                      KSh {(complianceROI.annualSavings * 5 - parseFloat(complianceInputs.systemCost || 0)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="compliance-requirements">
                <h5>Compliance Requirements</h5>
                <div className="requirements-grid">
                  <div className="requirement-item">
                    <div className="requirement-icon">📋</div>
                    <div className="requirement-content">
                      <h6>NEMA License</h6>
                      <p>Environmental impact assessment and licensing</p>
                    </div>
                  </div>
                  <div className="requirement-item">
                    <div className="requirement-icon">🔬</div>
                    <div className="requirement-content">
                      <h6>Emission Testing</h6>
                      <p>Quarterly stack emission monitoring and reporting</p>
                    </div>
                  </div>
                  <div className="requirement-item">
                    <div className="requirement-icon">📊</div>
                    <div className="requirement-content">
                      <h6>Record Keeping</h6>
                      <p>Daily operation logs and waste tracking</p>
                    </div>
                  </div>
                  <div className="requirement-item">
                    <div className="requirement-icon">👷</div>
                    <div className="requirement-content">
                      <h6>Operator Training</h6>
                      <p>Certified operator training and certification</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {complianceROI.years > 0 && complianceROI.years <= 3 && (
                <div className="recommendation-box">
                  <div className="recommendation-icon">🚀</div>
                  <div className="recommendation-content">
                    <h6>Strong Recommendation</h6>
                    <p>
                      Investment pays back in {complianceROI.years} years with significant risk reduction.
                      Compliant system recommended.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="incin-services">
          <h3>Additional Incineration Services</h3>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🔄</div>
              <div className="service-content">
                <h4>Heat Recovery</h4>
                <p>Steam/hot water generation from waste heat</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-icon">🧪</div>
              <div className="service-content">
                <h4>Ash Analysis</h4>
                <p>TCLP testing and safe disposal certification</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-icon">📡</div>
              <div className="service-content">
                <h4>Remote Monitoring</h4>
                <p>24/7 remote monitoring and automated reporting</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-icon">🏛️</div>
              <div className="service-content">
                <h4>Regulatory Support</h4>
                <p>NEMA licensing and compliance documentation</p>
              </div>
            </div>
          </div>
        </div>

        <div className="cta-row centered">
          <a className="btn-neon large" href="mailto:compliance@emersoneims.com?subject=Incinerator%20Compliance" aria-label="Discuss compliance requirements">
            🏛️ Discuss Compliance Requirements
          </a>
        </div>
      </section>
    );
  }

  function getRecommendedModels(capacity, wasteType) {
    const models = [
      {
        name: 'MediBurn 50',
        capacity: 50,
        features: ['Single chamber', 'Basic controls', 'Manual loading'],
        price: 2500000
      },
      {
        name: 'EcoBurn 100',
        capacity: 100,
        features: ['Dual chamber', 'Semi-auto', 'Basic scrubber'],
        price: 4500000
      },
      {
        name: 'ProBurn 200',
        capacity: 200,
        features: ['Dual chamber', 'Auto controls', 'Wet scrubber'],
        price: 7500000
      },
      {
        name: 'Industrial 500',
        capacity: 500,
        features: ['Multi-chamber', 'Full auto', 'Advanced filtration'],
        price: 15000000
      }
    ];
    
    return models.filter(model => model.capacity >= capacity * 0.8 && model.capacity <= capacity * 1.5);
  }