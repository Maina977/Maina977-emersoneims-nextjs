// components/services/WaterSystems.jsx
import React, { useState, useMemo, useCallback } from "react";

export default function WaterSystems({ performanceTier }) {
  const [waterSourceInputs, setWaterSourceInputs] = useState({ 
    countyRate: "120", 
    monthlyUsage: "", 
    drillingCost: "",
    annualMaintenance: "",
    waterQuality: "good",
    reliability: "80"
  });

  const [solarPumpInputs, setSolarPumpInputs] = useState({
    dailyNeed: "",
    pumpEfficiency: 70,
    sunHours: 5.5,
    storageDays: 2,
    pumpType: "submersible",
    totalHead: "",
    waterSource: "borehole"
  });

  const waterQualities = {
    good: { treatmentCost: 50000, maintenance: 20000 },
    moderate: { treatmentCost: 100000, maintenance: 40000 },
    poor: { treatmentCost: 250000, maintenance: 80000 },
    saline: { treatmentCost: 500000, maintenance: 150000 }
  };

  const countyAnnualCost = useMemo(() => {
    const rate = parseFloat(waterSourceInputs.countyRate) || 0;
    const usage = parseFloat(waterSourceInputs.monthlyUsage) || 0;
    const reliability = parseFloat(waterSourceInputs.reliability) || 100;
    
    if (usage <= 0) return 0;
    
    const baseCost = rate * usage * 12;
    const shortageCost = baseCost * (1 - reliability/100) * 2;
    
    return Math.max(0, Math.round(baseCost + shortageCost));
  }, [waterSourceInputs]);

  const boreholeAnnualCost = useMemo(() => {
    const drilling = parseFloat(waterSourceInputs.drillingCost) || 0;
    const maintenance = parseFloat(waterSourceInputs.annualMaintenance) || 0;
    const quality = waterQualities[waterSourceInputs.waterQuality];
    
    const amortizedDrilling = drilling / 20;
    const totalMaintenance = maintenance + quality.maintenance;
    const treatment = quality.treatmentCost / 10;
    
    return Math.max(0, Math.round(amortizedDrilling + totalMaintenance + treatment));
  }, [waterSourceInputs]);

  const solarPumpSystem = useMemo(() => {
    const dailyNeed = parseFloat(solarPumpInputs.dailyNeed) || 0;
    const efficiency = solarPumpInputs.pumpEfficiency / 100;
    const sunHours = solarPumpInputs.sunHours;
    const head = parseFloat(solarPumpInputs.totalHead) || 30;
    const storageDays = solarPumpInputs.storageDays;
    
    if (dailyNeed <= 0 || head <= 0) return null;
    
    const hydraulicPower = (dailyNeed * 1000 * 9.81 * head) / (3600 * 1000);
    const pumpPower = hydraulicPower / efficiency;
    const solarArray = (pumpPower * 1.3) / sunHours;
    const storageTank = dailyNeed * storageDays;
    
    const pumps = {
      submersible: { costPerKW: 300000, efficiency: 0.7 },
      surface: { costPerKW: 200000, efficiency: 0.65 },
      centrifugal: { costPerKW: 250000, efficiency: 0.75 },
      diaphragm: { costPerKW: 400000, efficiency: 0.6 }
    };
    
    const pump = pumps[solarPumpInputs.pumpType];
    const pumpCost = Math.round(pumpPower * pump.costPerKW);
    const solarCost = Math.round(solarArray * 100000);
    const storageCost = Math.round(storageTank * 5000);
    const controlCost = 150000;
    
    return {
      dailyNeed,
      pumpPower: Math.round(pumpPower * 1000),
      solarArray: Math.round(solarArray * 100) / 100,
      storageTank: Math.round(storageTank),
      totalCost: pumpCost + solarCost + storageCost + controlCost,
      breakdown: {
        pump: pumpCost,
        solar: solarCost,
        storage: storageCost,
        controls: controlCost
      }
    };
  }, [solarPumpInputs]);

  const roiYears = useMemo(() => {
    const countyCost = countyAnnualCost;
    const boreholeCost = boreholeAnnualCost;
    
    if (countyCost <= 0 || boreholeCost >= countyCost) return 0;
    
    const drilling = parseFloat(waterSourceInputs.drillingCost) || 0;
    const annualSavings = countyCost - boreholeCost;
    
    return annualSavings > 0 ? +(drilling / annualSavings).toFixed(1) : 0;
  }, [countyAnnualCost, boreholeAnnualCost, waterSourceInputs.drillingCost]);

  const handleWaterSourceChange = useCallback((field) => (e) => {
    const value = e.target.value;
    setWaterSourceInputs(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSolarPumpChange = useCallback((field) => (e) => {
    const value = e.target.value;
    setSolarPumpInputs(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleWaterQualitySelect = useCallback((quality) => {
    setWaterSourceInputs(prev => ({ ...prev, waterQuality: quality }));
  }, []);

  const handlePumpTypeSelect = useCallback((type) => {
    setSolarPumpInputs(prev => ({ ...prev, pumpType: type }));
  }, []);

  const formatVolume = useCallback((liters) => {
    if (liters >= 1000000) return `${(liters/1000000).toFixed(1)} ML`;
    if (liters >= 1000) return `${(liters/1000).toFixed(0)} m³`;
    return `${liters} L`;
  }, []);

  const getWaterSourceIcon = useCallback((source) => {
    const icons = {
      borehole: "🕳️",
      river: "🌊",
      dam: "🏞️",
      spring: "💧",
      rain: "🌧️"
    };
    return icons[source] || "💧";
  }, []);

  return (
    <section className="service service--water section-pad" aria-labelledby="ws-heading">
      <h2 id="ws-heading" className="water-title">
        <span className="title-icon">💧</span>
        Boreholes & Water Systems
      </h2>
      
      <p className="service-intro">
        Hydro-geological surveys, <strong>4"–24" drilling</strong> up to 400m depth, 
        solar/diesel/grid pumping, <strong>RO/UV treatment</strong>, 
        <strong> KEBS water quality</strong> certification, 
        <strong> 24/7 monitoring</strong> systems.
      </p>

      <div className="grid-two">
        <div className="card water-source-card">
          <div className="card-header">
            <h3>Water Source Economic Analysis</h3>
            <span className="card-badge">10-Year TCO</span>
          </div>
          
          <div className="source-selector">
            <p className="selector-label">Water quality affects treatment costs:</p>
            <div className="quality-buttons">
              {Object.keys(waterQualities).map(quality => (
                <button
                  key={quality}
                  onClick={() => handleWaterQualitySelect(quality)}
                  className={`quality-btn ${waterSourceInputs.waterQuality === quality ? 'active' : ''}`}
                  type="button"
                  aria-label={`Select ${quality} water quality`}
                >
                  {quality.charAt(0).toUpperCase() + quality.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="calc-grid">
            <div className="section-header">
              <h4>County Water Supply</h4>
            </div>

            <label htmlFor="rate">
              <span className="label-text">County Rate (KSh/m³)</span>
              <span className="label-hint">Current water tariff</span>
            </label>
            <div className="input-wrapper">
              <input 
                id="rate" 
                type="number" 
                min="0"
                max="500"
                step="1"
                value={waterSourceInputs.countyRate}
                onChange={handleWaterSourceChange("countyRate")}
              />
              <span className="input-unit">KSh/m³</span>
            </div>

            <label htmlFor="use">
              <span className="label-text">Monthly Usage (m³)</span>
              <span className="label-hint">Water consumption per month</span>
            </label>
            <div className="input-wrapper">
              <input 
                id="use" 
                type="number" 
                min="0"
                max="10000"
                step="10"
                value={waterSourceInputs.monthlyUsage}
                onChange={handleWaterSourceChange("monthlyUsage")}
                placeholder="e.g., 1000"
              />
              <span className="input-unit">m³</span>
            </div>

            <label htmlFor="reliability">
              <span className="label-text">Supply Reliability (%)</span>
              <span className="label-hint">County water availability</span>
            </label>
            <div className="input-wrapper">
              <div className="percentage-control">
                <input 
                  id="reliability" 
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={waterSourceInputs.reliability}
                  onChange={(e) => setWaterSourceInputs(prev => ({ ...prev, reliability: e.target.value }))}
                  aria-label="Adjust supply reliability"
                />
                <div className="percentage-value">{waterSourceInputs.reliability}%</div>
              </div>
            </div>

            <div className="section-header">
              <h4>Borehole Option</h4>
            </div>

            <label htmlFor="drill">
              <span className="label-text">Drilling & Equipment (KSh)</span>
              <span className="label-hint">Complete borehole installation</span>
            </label>
            <div className="input-wrapper">
              <input 
                id="drill" 
                type="number" 
                min="0"
                max="10000000"
                step="10000"
                value={waterSourceInputs.drillingCost}
                onChange={handleWaterSourceChange("drillingCost")}
                placeholder="e.g., 1500000"
              />
              <span className="input-unit">KSh</span>
            </div>

            <label htmlFor="maint">
              <span className="label-text">Annual Maintenance (KSh)</span>
              <span className="label-hint">Pump service, water testing</span>
            </label>
            <div className="input-wrapper">
              <input 
                id="maint" 
                type="number" 
                min="0"
                max="500000"
                step="5000"
                value={waterSourceInputs.annualMaintenance}
                onChange={handleWaterSourceChange("annualMaintenance")}
                placeholder="e.g., 50000"
              />
              <span className="input-unit">KSh/year</span>
            </div>
          </div>

          <div className="calc-results">
            <div className="cost-comparison">
              <div className="cost-option county">
                <div className="option-header">
                  <h4>County Water</h4>
                  <div className="reliability">{waterSourceInputs.reliability}% reliable</div>
                </div>
                <div className="cost-breakdown">
                  <div className="breakdown-item">
                    <span className="breakdown-label">Annual Water Cost:</span>
                    <span className="breakdown-value">KSh {countyAnnualCost.toLocaleString()}</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="breakdown-label">10-Year Cost:</span>
                    <span className="breakdown-value">KSh {(countyAnnualCost * 10).toLocaleString()}</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="breakdown-label">Shortage Risk:</span>
                    <span className="breakdown-value">{100 - parseFloat(waterSourceInputs.reliability)}%</span>
                  </div>
                </div>
              </div>
              
              <div className="vs">VS</div>
              
              <div className="cost-option borehole">
                <div className="option-header">
                  <h4>Borehole Water</h4>
                  <div className="reliability">95%+ reliable</div>
                </div>
                <div className="cost-breakdown">
                  <div className="breakdown-item">
                    <span className="breakdown-label">Annual Operating Cost:</span>
                    <span className="breakdown-value">KSh {boreholeAnnualCost.toLocaleString()}</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="breakdown-label">10-Year Cost:</span>
                    <span className="breakdown-value">
                      KSh {Math.round(boreholeAnnualCost * 10 + parseFloat(waterSourceInputs.drillingCost || 0)).toLocaleString()}
                    </span>
                  </div>
                  <div className="breakdown-item">
                    <span className="breakdown-label">Water Quality:</span>
                    <span className="breakdown-value">{waterSourceInputs.waterQuality}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="roi-analysis">
              <div className="roi-summary">
                <div className="roi-item">
                  <span className="roi-label">Annual Savings:</span>
                  <span className="roi-value">
                    KSh {Math.max(0, countyAnnualCost - boreholeAnnualCost).toLocaleString()}
                  </span>
                </div>
                <div className="roi-item">
                  <span className="roi-label">ROI Period:</span>
                  <span className="roi-value">
                    {roiYears > 0 ? `${roiYears} years` : 'Not viable'}
                  </span>
                </div>
                <div className="roi-item highlight">
                  <span className="roi-label">10-Year Savings:</span>
                  <span className="roi-value">
                    KSh {Math.max(0, (countyAnnualCost - boreholeAnnualCost) * 10 - parseFloat(waterSourceInputs.drillingCost || 0)).toLocaleString()}
                  </span>
                </div>
              </div>
              
              {roiYears > 0 && roiYears <= 5 && (
                <div className="recommendation">
                  <div className="recommendation-icon">✅</div>
                  <div className="recommendation-text">
                    <strong>Recommended:</strong> Borehole investment pays back in {roiYears} years.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="card solar-pump-card">
          <div className="card-header">
            <h3>Solar Pump Sizing Calculator</h3>
            <span className="card-badge">Renewable Solution</span>
          </div>
          
          <div className="pump-type-selector">
            <p className="selector-label">Select pump type:</p>
            <div className="pump-buttons">
              {['submersible', 'surface', 'centrifugal', 'diaphragm'].map(type => (
                <button
                  key={type}
                  onClick={() => handlePumpTypeSelect(type)}
                  className={`pump-btn ${solarPumpInputs.pumpType === type ? 'active' : ''}`}
                  type="button"
                  aria-label={`Select ${type} pump`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="calc-grid">
            <label htmlFor="need">
              <span className="label-text">Daily Water Need (m³)</span>
              <span className="label-hint">Total water required per day</span>
            </label>
            <div className="input-wrapper">
              <input 
                id="need" 
                type="number" 
                min="0"
                max="1000"
                step="1"
                value={solarPumpInputs.dailyNeed}
                onChange={handleSolarPumpChange("dailyNeed")}
                placeholder="e.g., 50"
              />
              <span className="input-unit">m³/day</span>
            </div>

            <label htmlFor="head">
              <span className="label-text">Total Dynamic Head (m)</span>
              <span className="label-hint">Pumping height + pipe friction</span>
            </label>
            <div className="input-wrapper">
              <input 
                id="head" 
                type="number" 
                min="1"
                max="200"
                step="1"
                value={solarPumpInputs.totalHead}
                onChange={handleSolarPumpChange("totalHead")}
                placeholder="e.g., 30"
              />
              <span className="input-unit">m</span>
            </div>

            <label htmlFor="eff">
              <span className="label-text">Pump Efficiency (%)</span>
              <span className="label-hint">Pump mechanical efficiency</span>
            </label>
            <div className="input-wrapper">
              <div className="percentage-control">
                <input 
                  id="eff" 
                  type="range"
                  min="40"
                  max="85"
                  step="1"
                  value={solarPumpInputs.pumpEfficiency}
                  onChange={(e) => setSolarPumpInputs(prev => ({ ...prev, pumpEfficiency: e.target.value }))}
                  aria-label="Adjust pump efficiency"
                />
                <div className="percentage-value">{solarPumpInputs.pumpEfficiency}%</div>
              </div>
            </div>

            <label htmlFor="sun">
              <span className="label-text">Daily Sun Hours</span>
              <span className="label-hint">Effective sunshine hours</span>
            </label>
            <div className="input-wrapper">
              <select 
                id="sun"
                value={solarPumpInputs.sunHours}
                onChange={handleSolarPumpChange("sunHours")}
                aria-label="Select sun hours"
              >
                <option value="4">4 hours (Cloudy season)</option>
                <option value="5">5 hours (Average)</option>
                <option value="5.5">5.5 hours (Nairobi avg)</option>
                <option value="6">6 hours (Good sun)</option>
                <option value="7">7 hours (Excellent sun)</option>
              </select>
            </div>

            <label htmlFor="storage">
              <span className="label-text">Storage Days</span>
              <span className="label-hint">Water storage capacity</span>
            </label>
            <div className="input-wrapper">
              <select 
                id="storage"
                value={solarPumpInputs.storageDays}
                onChange={handleSolarPumpChange("storageDays")}
                aria-label="Select storage days"
              >
                <option value="1">1 day (Minimal)</option>
                <option value="2">2 days (Recommended)</option>
                <option value="3">3 days (Good buffer)</option>
                <option value="5">5 days (Maximum safety)</option>
              </select>
            </div>

            <label htmlFor="source">
              <span className="label-text">Water Source</span>
              <span className="label-hint">Source of water</span>
            </label>
            <div className="input-wrapper">
              <select 
                id="source"
                value={solarPumpInputs.waterSource}
                onChange={handleSolarPumpChange("waterSource")}
                aria-label="Select water source"
              >
                <option value="borehole">Borehole</option>
                <option value="river">River</option>
                <option value="dam">Dam</option>
                <option value="spring">Spring</option>
                <option value="rain">Rainwater</option>
              </select>
            </div>
          </div>

          <div className="calc-results">
            {solarPumpSystem ? (
              <>
                <div className="system-specification">
                  <h4>Solar Pump System Specification</h4>
                  <div className="spec-grid">
                    <div className="spec-item">
                      <span className="spec-label">Pump Power:</span>
                      <span className="spec-value">{solarPumpSystem.pumpPower} W</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Solar Array:</span>
                      <span className="spec-value">{solarPumpSystem.solarArray} kWp</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Storage Tank:</span>
                      <span className="spec-value">{formatVolume(solarPumpSystem.storageTank * 1000)}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Daily Output:</span>
                      <span className="spec-value">{solarPumpSystem.dailyNeed} m³/day</span>
                    </div>
                  </div>
                </div>
                
                <div className="cost-breakdown">
                  <h5>System Cost Breakdown</h5>
                  <div className="breakdown-chart">
                    {Object.entries(solarPumpSystem.breakdown).map(([item, cost]) => (
                      <div key={item} className="breakdown-item">
                        <div className="breakdown-label">
                          <span className="item-name">{item.charAt(0).toUpperCase() + item.slice(1)}</span>
                          <span className="item-percent">
                            {Math.round((cost / solarPumpSystem.totalCost) * 100)}%
                          </span>
                        </div>
                        <div className="breakdown-value">KSh {cost.toLocaleString()}</div>
                        <div 
                          className="breakdown-bar" 
                          style={{ width: `${(cost / solarPumpSystem.totalCost) * 100}%` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                  <div className="breakdown-total">
                    <span className="total-label">Total System Cost:</span>
                    <span className="total-value">KSh {solarPumpSystem.totalCost.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="savings-analysis">
                  <h5>Operating Cost Savings</h5>
                  <div className="savings-grid">
                    <div className="savings-item">
                      <div className="savings-label">Diesel Pump (Annual)</div>
                      <div className="savings-value">KSh {Math.round(solarPumpSystem.pumpPower * 0.8 * 365 * 100).toLocaleString()}</div>
                    </div>
                    <div className="savings-item">
                      <div className="savings-label">Solar Pump (Annual)</div>
                      <div className="savings-value">KSh 0 (No fuel cost)</div>
                    </div>
                    <div className="savings-item highlight">
                      <div className="savings-label">Annual Savings</div>
                      <div className="savings-value">
                        KSh {Math.round(solarPumpSystem.pumpPower * 0.8 * 365 * 100).toLocaleString()}
                      </div>
                    </div>
                    <div className="savings-item">
                      <div className="savings-label">ROI Period</div>
                      <div className="savings-value">
                        {Math.round(solarPumpSystem.totalCost / (solarPumpSystem.pumpPower * 0.8 * 365 * 100))} years
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="no-results">
                <p>Enter water requirements to calculate solar pump system.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="water-treatment">
        <h3>Water Treatment Solutions</h3>
        <div className="treatment-grid">
          <div className="treatment-card">
            <div className="treatment-icon">🔬</div>
            <div className="treatment-content">
              <h4>Reverse Osmosis</h4>
              <p>Brackish/saline water treatment, 50–98% TDS reduction</p>
            </div>
          </div>
          <div className="treatment-card">
            <div className="treatment-icon">☀️</div>
            <div className="treatment-content">
              <h4>UV Disinfection</h4>
              <p>99.99% pathogen elimination, chemical-free treatment</p>
            </div>
          </div>
          <div className="treatment-card">
            <div className="treatment-icon">⚗️</div>
            <div className="treatment-content">
              <h4>Filtration Systems</h4>
              <p>Sand, carbon, multimedia filters for various contaminants</p>
            </div>
          </div>
          <div className="treatment-card">
            <div className="treatment-icon">📊</div>
            <div className="treatment-content">
              <h4>Water Testing</h4>
              <p>KEBS certified laboratory testing and certification</p>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-row">
        <a className="btn-neon" href="mailto:water@emersoneims.com?subject=Water%20System%20Survey" aria-label="Request hydro survey">
          🗺️ Request Free Hydro Survey
        </a>
        <a className="btn-neon" href="tel:0768860655" aria-label="Call water systems lead at 0768 860 655">
          👷 Water Systems Lead: 0768 860 655
        </a>
        <a className="btn-neon" href="/documents/water-quality-report.pdf" aria-label="Download water quality report sample">
          📄 Download Water Quality Report
        </a>
      </div>
    </section>
  );
}