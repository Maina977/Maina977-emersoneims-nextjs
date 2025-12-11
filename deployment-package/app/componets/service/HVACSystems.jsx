// components/services/HVACSystems.jsx
import React, { useState, useMemo, useCallback } from "react";

export default function HVACSystems({ performanceTier }) {
  const [coolingInputs, setCoolingInputs] = useState({ 
    length: "", 
    width: "", 
    height: "", 
    occupants: "",
    equipmentWatts: "",
    lightingWatts: "",
    solarGain: "medium",
    insulation: "average",
    buildingType: "office",
    orientation: "north"
  });

  const [systemInputs, setSystemInputs] = useState({
    systemA: { type: "split", capacity: "", cost: "", efficiency: "3.2", annualEnergy: "" },
    systemB: { type: "vrf", capacity: "", cost: "", efficiency: "4.0", annualEnergy: "" },
    analysisYears: 10,
    electricityRate: 22,
    maintenanceRate: 5
  });

  const buildingTypes = {
    office: { occupancy: 0.1, equipment: 15, lighting: 15 },
    residential: { occupancy: 0.05, equipment: 10, lighting: 10 },
    retail: { occupancy: 0.2, equipment: 20, lighting: 30 },
    hospital: { occupancy: 0.15, equipment: 25, lighting: 20 },
    industrial: { occupancy: 0.05, equipment: 50, lighting: 10 }
  };

  const insulationLevels = {
    poor: { uValue: 2.5, infiltration: 1.5 },
    average: { uValue: 1.5, infiltration: 1.0 },
    good: { uValue: 0.8, infiltration: 0.5 },
    excellent: { uValue: 0.4, infiltration: 0.3 }
  };

  const solarGainLevels = {
    low: { shgc: 0.3, shading: 0.8 },
    medium: { shgc: 0.5, shading: 1.0 },
    high: { shgc: 0.7, shading: 1.2 },
    veryHigh: { shgc: 0.9, shading: 1.5 }
  };

  const calculateCoolingLoad = useMemo(() => {
    const length = parseFloat(coolingInputs.length) || 0;
    const width = parseFloat(coolingInputs.width) || 0;
    const height = parseFloat(coolingInputs.height) || 3;
    
    if (length <= 0 || width <= 0) return null;
    
    const area = length * width;
    const volume = area * height;
    const occupants = parseFloat(coolingInputs.occupants) || Math.ceil(area * buildingTypes[coolingInputs.buildingType].occupancy);
    const equipment = parseFloat(coolingInputs.equipmentWatts) || area * buildingTypes[coolingInputs.buildingType].equipment;
    const lighting = parseFloat(coolingInputs.lightingWatts) || area * buildingTypes[coolingInputs.buildingType].lighting;
    
    const buildingType = buildingTypes[coolingInputs.buildingType];
    const insulation = insulationLevels[coolingInputs.insulation];
    const solar = solarGainLevels[coolingInputs.solarGain];
    
    const sensibleLoads = {
      walls: (area * 0.4) * insulation.uValue * 5,
      roof: area * insulation.uValue * 8,
      windows: (area * 0.2) * solar.shgc * 300,
      infiltration: volume * insulation.infiltration * 0.33 * 5,
      occupants: occupants * 100,
      equipment: equipment,
      lighting: lighting
    };
    
    const latentLoads = {
      occupants: occupants * 70,
      infiltration: volume * insulation.infiltration * 0.33 * 7,
      ventilation: occupants * 7.5 * 5
    };
    
    const totalSensible = Object.values(sensibleLoads).reduce((a, b) => a + b, 0);
    const totalLatent = Object.values(latentLoads).reduce((a, b) => a + b, 0);
    const totalBTU = (totalSensible + totalLatent) * 3.412;
    
    const tons = totalBTU / 12000;
    const recommendedCapacity = Math.ceil(tons * 1.2);
    
    return {
      area,
      volume,
      occupants,
      totalBTU: Math.round(totalBTU),
      totalSensible: Math.round(totalSensible),
      totalLatent: Math.round(totalLatent),
      tons: +(tons).toFixed(1),
      recommendedCapacity,
      sensibleLoads,
      latentLoads
    };
  }, [coolingInputs]);

  const calculateLifecycleCost = useMemo(() => {
    const systemA = systemInputs.systemA;
    const systemB = systemInputs.systemB;
    const years = systemInputs.analysisYears;
    const rate = systemInputs.electricityRate;
    const maintenance = systemInputs.maintenanceRate / 100;
    
    const calculateSystemCost = (system) => {
      const initial = parseFloat(system.cost) || 0;
      const annualEnergy = parseFloat(system.annualEnergy) || 0;
      const capacity = parseFloat(system.capacity) || 0;
      
      if (!initial) return null;
      
      const annualElectricity = annualEnergy || (capacity * 2920 * rate) / parseFloat(system.efficiency);
      const annualMaintenance = initial * maintenance;
      const replacementCost = years >= 15 ? initial * 0.7 : 0;
      
      return {
        initial,
        annualElectricity: Math.round(annualElectricity),
        annualMaintenance: Math.round(annualMaintenance),
        totalAnnual: Math.round(annualElectricity + annualMaintenance),
        tenYear: Math.round(initial + (annualElectricity + annualMaintenance) * years - replacementCost),
        breakdown: {
          electricity: Math.round(annualElectricity * years),
          maintenance: Math.round(annualMaintenance * years),
          replacement: replacementCost
        }
      };
    };
    
    const costA = calculateSystemCost(systemA);
    const costB = calculateSystemCost(systemB);
    
    return { costA, costB };
  }, [systemInputs]);

  const handleCoolingChange = useCallback((field) => (e) => {
    const value = e.target.value;
    setCoolingInputs(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSystemChange = useCallback((system, field) => (e) => {
    const value = e.target.value;
    setSystemInputs(prev => ({
      ...prev,
      [system]: {
        ...prev[system],
        [field]: value
      }
    }));
  }, []);

  const handleBuildingTypeSelect = useCallback((type) => {
    const building = buildingTypes[type];
    setCoolingInputs(prev => ({
      ...prev,
      buildingType: type,
      occupants: Math.ceil((parseFloat(prev.length) || 1) * (parseFloat(prev.width) || 1) * building.occupancy).toString()
    }));
  }, []);

  const handleInsulationSelect = useCallback((level) => {
    setCoolingInputs(prev => ({ ...prev, insulation: level }));
  }, []);

  const handleSolarGainSelect = useCallback((level) => {
    setCoolingInputs(prev => ({ ...prev, solarGain: level }));
  }, []);

  const formatBTU = useCallback((btu) => {
    if (btu >= 12000) return `${(btu/12000).toFixed(1)} tons`;
    return `${Math.round(btu/1000)}k BTU/hr`;
  }, []);

  const getSystemIcon = useCallback((type) => {
    const icons = {
      split: "❄️",
      vrf: "🔄",
      chiller: "🏢",
      packaged: "📦",
      ductless: "💨"
    };
    return icons[type] || "❄️";
  }, []);

  return (
    <section className="service service--hvac section-pad" aria-labelledby="hvac-heading">
      <h2 id="hvac-heading" className="hvac-title">
        <span className="title-icon">❄️</span>
        HVAC & Climate Control Systems
      </h2>
      
      <p className="service-intro">
        Precision cooling to centralized VRF/VRV systems. 
        <strong> EER up to 4.5</strong>, intelligent zoning (<strong>‑35% energy</strong>), 
        <strong> IAQ safeguards</strong>, <strong>BMS integration</strong>, 
        <strong> remote monitoring</strong> with predictive maintenance.
      </p>

      <div className="grid-two">
        <div className="card cooling-card">
          <div className="card-header">
            <h3>Cooling Load Calculation</h3>
            <span className="card-badge">Manual J Method</span>
          </div>
          
          <div className="building-type-selector">
            <p className="selector-label">Building type affects default values:</p>
            <div className="type-buttons">
              {Object.keys(buildingTypes).map(type => (
                <button
                  key={type}
                  onClick={() => handleBuildingTypeSelect(type)}
                  className={`type-btn ${coolingInputs.buildingType === type ? 'active' : ''}`}
                  type="button"
                  aria-label={`Select ${type} building type`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="calc-grid">
            <div className="dimension-inputs">
              <div className="dimension-group">
                <label htmlFor="length">
                  <span className="label-text">Length (m)</span>
                </label>
                <div className="input-wrapper">
                  <input 
                    id="length" 
                    type="number" 
                    min="1"
                    max="200"
                    step="0.5"
                    value={coolingInputs.length}
                    onChange={handleCoolingChange("length")}
                    placeholder="e.g., 20"
                  />
                  <span className="input-unit">m</span>
                </div>
              </div>
              
              <div className="dimension-group">
                <label htmlFor="width">
                  <span className="label-text">Width (m)</span>
                </label>
                <div className="input-wrapper">
                  <input 
                    id="width" 
                    type="number" 
                    min="1"
                    max="200"
                    step="0.5"
                    value={coolingInputs.width}
                    onChange={handleCoolingChange("width")}
                    placeholder="e.g., 15"
                  />
                  <span className="input-unit">m</span>
                </div>
              </div>
              
              <div className="dimension-group">
                <label htmlFor="height">
                  <span className="label-text">Height (m)</span>
                </label>
                <div className="input-wrapper">
                  <input 
                    id="height" 
                    type="number" 
                    min="2"
                    max="20"
                    step="0.1"
                    value={coolingInputs.height}
                    onChange={handleCoolingChange("height")}
                    placeholder="e.g., 3"
                  />
                  <span className="input-unit">m</span>
                </div>
              </div>
            </div>

            <label htmlFor="occupants">
              <span className="label-text">Number of Occupants</span>
              <span className="label-hint">People in the space</span>
            </label>
            <div className="input-wrapper">
              <input 
                id="occupants" 
                type="number" 
                min="1"
                max="1000"
                step="1"
                value={coolingInputs.occupants}
                onChange={handleCoolingChange("occupants")}
                placeholder="Auto-calculated"
              />
            </div>

            <label htmlFor="equipment">
              <span className="label-text">Equipment Load (W)</span>
              <span className="label-hint">Computers, servers, machines</span>
            </label>
            <div className="input-wrapper">
              <input 
                id="equipment" 
                type="number" 
                min="0"
                max="100000"
                step="100"
                value={coolingInputs.equipmentWatts}
                onChange={handleCoolingChange("equipmentWatts")}
                placeholder="Auto-calculated"
              />
              <span className="input-unit">W</span>
            </div>

            <label htmlFor="lighting">
              <span className="label-text">Lighting Load (W)</span>
              <span className="label-hint">Lighting power consumption</span>
            </label>
            <div className="input-wrapper">
              <input 
                id="lighting" 
                type="number" 
                min="0"
                max="50000"
                step="100"
                value={coolingInputs.lightingWatts}
                onChange={handleCoolingChange("lightingWatts")}
                placeholder="Auto-calculated"
              />
              <span className="input-unit">W</span>
            </div>

            <div className="factor-selectors">
              <div className="factor-group">
                <label htmlFor="insulation">
                  <span className="label-text">Insulation Level</span>
                </label>
                <div className="factor-buttons">
                  {Object.keys(insulationLevels).map(level => (
                    <button
                      key={level}
                      onClick={() => handleInsulationSelect(level)}
                      className={`factor-btn ${coolingInputs.insulation === level ? 'active' : ''}`}
                      type="button"
                      aria-label={`Select ${level} insulation`}
                    >
                      {level.charAt(0).toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="factor-group">
                <label htmlFor="solar">
                  <span className="label-text">Solar Gain</span>
                </label>
                <div className="factor-buttons">
                  {Object.keys(solarGainLevels).map(level => (
                    <button
                      key={level}
                      onClick={() => handleSolarGainSelect(level)}
                      className={`factor-btn ${coolingInputs.solarGain === level ? 'active' : ''}`}
                      type="button"
                      aria-label={`Select ${level} solar gain`}
                    >
                      {level.split(' ')[0].charAt(0).toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <label htmlFor="orientation">
              <span className="label-text">Building Orientation</span>
              <span className="label-hint">Main façade direction</span>
            </label>
            <div className="input-wrapper">
              <select 
                id="orientation"
                value={coolingInputs.orientation}
                onChange={handleCoolingChange("orientation")}
                aria-label="Select building orientation"
              >
                <option value="north">North facing</option>
                <option value="south">South facing</option>
                <option value="east">East facing</option>
                <option value="west">West facing</option>
                <option value="northeast">Northeast</option>
                <option value="northwest">Northwest</option>
                <option value="southeast">Southeast</option>
                <option value="southwest">Southwest</option>
              </select>
            </div>
          </div>

          <div className="calc-results">
            {calculateCoolingLoad ? (
              <>
                <div className="load-summary">
                  <div className="summary-item">
                    <div className="summary-label">Total Cooling Load</div>
                    <div className="summary-value">
                      {formatBTU(calculateCoolingLoad.totalBTU)}
                    </div>
                    <div className="summary-note">
                      {calculateCoolingLoad.tons} tons of cooling
                    </div>
                  </div>
                  
                  <div className="summary-item">
                    <div className="summary-label">Recommended Capacity</div>
                    <div className="summary-value">
                      {calculateCoolingLoad.recommendedCapacity} tons
                    </div>
                    <div className="summary-note">
                      Includes 20% safety margin
                    </div>
                  </div>
                </div>
                
                <div className="load-breakdown">
                  <h5>Load Breakdown</h5>
                  <div className="breakdown-chart">
                    {Object.entries(calculateCoolingLoad.sensibleLoads).map(([source, load]) => (
                      <div key={source} className="breakdown-item">
                        <div className="breakdown-label">
                          <span className="source-name">{source.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                          <span className="source-percent">
                            {Math.round((load / calculateCoolingLoad.totalSensible) * 100)}%
                          </span>
                        </div>
                        <div className="breakdown-value">{Math.round(load)} W</div>
                        <div 
                          className="breakdown-bar" 
                          style={{ width: `${(load / calculateCoolingLoad.totalSensible) * 100}%` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="system-recommendations">
                  <h5>System Recommendations</h5>
                  <div className="recommendation-cards">
                    {getSystemRecommendations(calculateCoolingLoad.recommendedCapacity).map(system => (
                      <div key={system.type} className="recommendation-card">
                        <div className="recommendation-header">
                          <div className="system-icon">{getSystemIcon(system.type)}</div>
                          <h6>{system.name}</h6>
                        </div>
                        <ul className="system-features">
                          {system.features.map((feature, i) => (
                            <li key={i}>{feature}</li>
                          ))}
                        </ul>
                        <div className="system-cost">
                          Est. Cost: KSh {system.cost.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="no-results">
                <p>Enter building dimensions to calculate cooling load.</p>
              </div>
            )}
          </div>
        </div>

        <div className="card lifecycle-card">
          <div className="card-header">
            <h3>Lifecycle Cost Analysis</h3>
            <span className="card-badge">{systemInputs.analysisYears}-Year TCO</span>
          </div>
          
          <div className="system-comparison">
            <div className="system-inputs">
              <div className="system-column">
                <div className="system-header">
                  <h4>System A</h4>
                  <select 
                    value={systemInputs.systemA.type}
                    onChange={handleSystemChange('systemA', 'type')}
                    className="system-type-select"
                    aria-label="Select system A type"
                  >
                    <option value="split">Split AC</option>
                    <option value="vrf">VRF/VRV</option>
                    <option value="chiller">Chiller</option>
                    <option value="packaged">Packaged Unit</option>
                    <option value="ductless">Ductless Mini-split</option>
                  </select>
                </div>
                
                <div className="input-group">
                  <label htmlFor="A-capacity">Capacity (tons)</label>
                  <input 
                    id="A-capacity"
                    type="number"
                    min="1"
                    max="500"
                    step="0.5"
                    value={systemInputs.systemA.capacity}
                    onChange={handleSystemChange('systemA', 'capacity')}
                    placeholder="e.g., 10"
                  />
                </div>
                
                <div className="input-group">
                  <label htmlFor="A-cost">Initial Cost (KSh)</label>
                  <input 
                    id="A-cost"
                    type="number"
                    min="0"
                    max="100000000"
                    step="10000"
                    value={systemInputs.systemA.cost}
                    onChange={handleSystemChange('systemA', 'cost')}
                    placeholder="e.g., 1500000"
                  />
                </div>
                
                <div className="input-group">
                  <label htmlFor="A-efficiency">EER (W/W)</label>
                  <select 
                    id="A-efficiency"
                    value={systemInputs.systemA.efficiency}
                    onChange={handleSystemChange('systemA', 'efficiency')}
                    aria-label="Select system A efficiency"
                  >
                    <option value="2.5">2.5 (Poor)</option>
                    <option value="3.0">3.0 (Standard)</option>
                    <option value="3.2">3.2 (Good)</option>
                    <option value="3.5">3.5 (Better)</option>
                    <option value="4.0">4.0 (Excellent)</option>
                  </select>
                </div>
                
                <div className="input-group">
                  <label htmlFor="A-energy">Annual Energy (KSh)</label>
                  <input 
                    id="A-energy"
                    type="number"
                    min="0"
                    max="10000000"
                    step="1000"
                    value={systemInputs.systemA.annualEnergy}
                    onChange={handleSystemChange('systemA', 'annualEnergy')}
                    placeholder="Auto-calculated"
                  />
                </div>
              </div>
              
              <div className="vs-column">
                <div className="vs">VS</div>
              </div>
              
              <div className="system-column">
                <div className="system-header">
                  <h4>System B</h4>
                  <select 
                    value={systemInputs.systemB.type}
                    onChange={handleSystemChange('systemB', 'type')}
                    className="system-type-select"
                    aria-label="Select system B type"
                  >
                    <option value="split">Split AC</option>
                    <option value="vrf">VRF/VRV</option>
                    <option value="chiller">Chiller</option>
                    <option value="packaged">Packaged Unit</option>
                    <option value="ductless">Ductless Mini-split</option>
                  </select>
                </div>
                
                <div className="input-group">
                  <label htmlFor="B-capacity">Capacity (tons)</label>
                  <input 
                    id="B-capacity"
                    type="number"
                    min="1"
                    max="500"
                    step="0.5"
                    value={systemInputs.systemB.capacity}
                    onChange={handleSystemChange('systemB', 'capacity')}
                    placeholder="e.g., 10"
                  />
                </div>
                
                <div className="input-group">
                  <label htmlFor="B-cost">Initial Cost (KSh)</label>
                  <input 
                    id="B-cost"
                    type="number"
                    min="0"
                    max="100000000"
                    step="10000"
                    value={systemInputs.systemB.cost}
                    onChange={handleSystemChange('systemB', 'cost')}
                    placeholder="e.g., 2000000"
                  />
                </div>
                
                <div className="input-group">
                  <label htmlFor="B-efficiency">EER (W/W)</label>
                  <select 
                    id="B-efficiency"
                    value={systemInputs.systemB.efficiency}
                    onChange={handleSystemChange('systemB', 'efficiency')}
                    aria-label="Select system B efficiency"
                  >
                    <option value="2.5">2.5 (Poor)</option>
                    <option value="3.0">3.0 (Standard)</option>
                    <option value="3.2">3.2 (Good)</option>
                    <option value="3.5">3.5 (Better)</option>
                    <option value="4.0">4.0 (Excellent)</option>
                  </select>
                </div>
                
                <div className="input-group">
                  <label htmlFor="B-energy">Annual Energy (KSh)</label>
                  <input 
                    id="B-energy"
                    type="number"
                    min="0"
                    max="10000000"
                    step="1000"
                    value={systemInputs.systemB.annualEnergy}
                    onChange={handleSystemChange('systemB', 'annualEnergy')}
                    placeholder="Auto-calculated"
                  />
                </div>
              </div>
            </div>
            
            <div className="analysis-settings">
              <div className="setting-group">
                <label htmlFor="years">Analysis Period (years)</label>
                <select 
                  id="years"
                  value={systemInputs.analysisYears}
                  onChange={(e) => setSystemInputs(prev => ({ ...prev, analysisYears: e.target.value }))}
                  aria-label="Select analysis period"
                >
                  <option value="5">5 years</option>
                  <option value="10">10 years</option>
                  <option value="15">15 years</option>
                  <option value="20">20 years</option>
                </select>
              </div>
              
              <div className="setting-group">
                <label htmlFor="rate">Electricity Rate (KSh/kWh)</label>
                <input 
                  id="rate"
                  type="number"
                  min="10"
                  max="50"
                  step="1"
                  value={systemInputs.electricityRate}
                  onChange={(e) => setSystemInputs(prev => ({ ...prev, electricityRate: e.target.value }))}
                />
              </div>
              
              <div className="setting-group">
                <label htmlFor="maintenance">Maintenance Rate (% of initial)</label>
                <div className="percentage-control">
                  <input 
                    id="maintenance"
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={systemInputs.maintenanceRate}
                    onChange={(e) => setSystemInputs(prev => ({ ...prev, maintenanceRate: e.target.value }))}
                    aria-label="Adjust maintenance rate"
                  />
                  <div className="percentage-value">{systemInputs.maintenanceRate}%</div>
                </div>
              </div>
            </div>
          </div>

          <div className="calc-results">
            {calculateLifecycleCost.costA && calculateLifecycleCost.costB ? (
              <>
                <div className="tco-comparison">
                  <div className="tco-card">
                    <div className="tco-header">
                      <h5>System A TCO</h5>
                      <div className="tco-period">{systemInputs.analysisYears} years</div>
                    </div>
                    <div className="tco-value">
                      KSh {calculateLifecycleCost.costA.tenYear.toLocaleString()}
                    </div>
                    <div className="tco-breakdown">
                      <div className="breakdown-item">
                        <span>Initial: </span>
                        <span>KSh {calculateLifecycleCost.costA.initial.toLocaleString()}</span>
                      </div>
                      <div className="breakdown-item">
                        <span>Electricity: </span>
                        <span>KSh {calculateLifecycleCost.costA.breakdown.electricity.toLocaleString()}</span>
                      </div>
                      <div className="breakdown-item">
                        <span>Maintenance: </span>
                        <span>KSh {calculateLifecycleCost.costA.breakdown.maintenance.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="comparison-result">
                    <div className="difference">
                      {calculateLifecycleCost.costA.tenYear < calculateLifecycleCost.costB.tenYear ? (
                        <>
                          <div className="difference-label">System A saves</div>
                          <div className="difference-value">
                            KSh {(calculateLifecycleCost.costB.tenYear - calculateLifecycleCost.costA.tenYear).toLocaleString()}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="difference-label">System B saves</div>
                          <div className="difference-value">
                            KSh {(calculateLifecycleCost.costA.tenYear - calculateLifecycleCost.costB.tenYear).toLocaleString()}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="tco-card">
                    <div className="tco-header">
                      <h5>System B TCO</h5>
                      <div className="tco-period">{systemInputs.analysisYears} years</div>
                    </div>
                    <div className="tco-value">
                      KSh {calculateLifecycleCost.costB.tenYear.toLocaleString()}
                    </div>
                    <div className="tco-breakdown">
                      <div className="breakdown-item">
                        <span>Initial: </span>
                        <span>KSh {calculateLifecycleCost.costB.initial.toLocaleString()}</span>
                      </div>
                      <div className="breakdown-item">
                        <span>Electricity: </span>
                        <span>KSh {calculateLifecycleCost.costB.breakdown.electricity.toLocaleString()}</span>
                      </div>
                      <div className="breakdown-item">
                        <span>Maintenance: </span>
                        <span>KSh {calculateLifecycleCost.costB.breakdown.maintenance.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="annual-costs">
                  <h5>Annual Operating Costs</h5>
                  <div className="costs-chart">
                    <div className="costs-bars">
                      <div className="costs-bar electricity">
                        <div className="bar-label">Electricity</div>
                        <div className="bar-values">
                          <div 
                            className="bar-value A"
                            style={{ width: `${(calculateLifecycleCost.costA.annualElectricity / (calculateLifecycleCost.costA.annualElectricity + calculateLifecycleCost.costB.annualElectricity)) * 100}%` }}
                          >
                            KSh {calculateLifecycleCost.costA.annualElectricity.toLocaleString()}
                          </div>
                          <div 
                            className="bar-value B"
                            style={{ width: `${(calculateLifecycleCost.costB.annualElectricity / (calculateLifecycleCost.costA.annualElectricity + calculateLifecycleCost.costB.annualElectricity)) * 100}%` }}
                          >
                            KSh {calculateLifecycleCost.costB.annualElectricity.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="costs-bar maintenance">
                        <div className="bar-label">Maintenance</div>
                        <div className="bar-values">
                          <div 
                            className="bar-value A"
                            style={{ width: `${(calculateLifecycleCost.costA.annualMaintenance / (calculateLifecycleCost.costA.annualMaintenance + calculateLifecycleCost.costB.annualMaintenance)) * 100}%` }}
                          >
                            KSh {calculateLifecycleCost.costA.annualMaintenance.toLocaleString()}
                          </div>
                          <div 
                            className="bar-value B"
                            style={{ width: `${(calculateLifecycleCost.costB.annualMaintenance / (calculateLifecycleCost.costA.annualMaintenance + calculateLifecycleCost.costB.annualMaintenance)) * 100}%` }}
                          >
                            KSh {calculateLifecycleCost.costB.annualMaintenance.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="costs-legend">
                      <div className="legend-item">
                        <div className="legend-color A"></div>
                        <span>System A</span>
                      </div>
                      <div className="legend-item">
                        <div className="legend-color B"></div>
                        <span>System B</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="recommendation-box">
                  <div className="recommendation-icon">
                    {calculateLifecycleCost.costA.tenYear < calculateLifecycleCost.costB.tenYear ? '👍' : '👑'}
                  </div>
                  <div className="recommendation-content">
                    <h6>Recommendation</h6>
                    <p>
                      {calculateLifecycleCost.costA.tenYear < calculateLifecycleCost.costB.tenYear 
                        ? 'System A has lower total cost of ownership over ' + systemInputs.analysisYears + ' years.'
                        : 'System B has lower total cost of ownership over ' + systemInputs.analysisYears + ' years.'
                      }
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="no-results">
                <p>Enter system costs to compare lifecycle costs.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="hvac-services">
        <h3>Additional HVAC Services</h3>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">🌡️</div>
            <div className="service-content">
              <h4>BMS Integration</h4>
              <p>Building Management System integration and automation</p>
            </div>
          </div>
          <div className="service-card">
            <div className="service-icon">💨</div>
            <div className="service-content">
              <h4>Air Quality Testing</h4>
              <p>CO₂, VOC, particulate matter testing and improvement</p>
            </div>
          </div>
          <div className="service-card">
            <div className="service-icon">🔧</div>
            <div className="service-content">
              <h4>Preventive Maintenance</h4>
              <p>Scheduled maintenance contracts with 24/7 support</p>
            </div>
          </div>
          <div className="service-card">
            <div className="service-icon">📱</div>
            <div className="service-content">
              <h4>Remote Monitoring</h4>
              <p>Cloud-based monitoring with AI predictive maintenance</p>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-row">
        <a className="btn-neon" href="mailto:hvac@emersoneims.com?subject=Cooling%20Load%20Calculation" aria-label="Request free load calculation">
          📐 Request Free Load Calculation
        </a>
        <a className="btn-neon" href="tel:0782914717" aria-label="Call HVAC specialist at 0782 914 717">
          👨‍🔧 HVAC Specialist: 0782 914 717
        </a>
        <a className="btn-neon" href="/documents/hvac-design-guide.pdf" aria-label="Download HVAC design guide">
          📄 Download Design Guide
        </a>
      </div>
    </section>
  );
}

function getSystemRecommendations(tons) {
  const recommendations = [
    {
      type: 'split',
      name: 'Split AC Systems',
      features: ['Individual room control', 'Easy installation', 'Low upfront cost'],
      cost: Math.round(tons * 150000)
    },
    {
      type: 'vrf',
      name: 'VRF/VRV Systems',
      features: ['High efficiency', 'Individual zoning', 'Quiet operation'],
      cost: Math.round(tons * 250000)
    },
    {
      type: 'chiller',
      name: 'Chilled Water Systems',
      features: ['Large capacity', 'Centralized control', 'Best for large buildings'],
      cost: Math.round(tons * 300000)
    }
  ];
  
  return recommendations;
}