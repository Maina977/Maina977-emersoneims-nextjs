// components/services/Fabrication.jsx
import React, { useState, useMemo, useCallback } from "react";

export default function Fabrication({ performanceTier }) {
  const [importInputs, setImportInputs] = useState({ 
    itemCost: "", 
    shippingPercent: 25, 
    dutyPercent: 20, 
    opportunityCost: "",
    leadTimeWeeks: 12,
    currency: "USD"
  });

  const [structuralInputs, setStructuralInputs] = useState({
    liveLoad: "",
    deadLoad: "",
    span: "",
    safetyFactor: 1.5,
    material: "steel",
    supportType: "simply",
    width: "",
    deflectionLimit: "L/360"
  });

  const exchangeRates = {
    USD: 150,
    EUR: 160,
    GBP: 190,
    CNY: 21,
    INR: 1.8
  };

  const landedImportCost = useMemo(() => {
    const baseCost = parseFloat(importInputs.itemCost) || 0;
    const exchangeRate = exchangeRates[importInputs.currency] || 1;
    const kesCost = baseCost * exchangeRate;
    const shippingCost = kesCost * (importInputs.shippingPercent / 100);
    const dutyCost = kesCost * (importInputs.dutyPercent / 100);
    const opportunityCost = parseFloat(importInputs.opportunityCost) || 0;
    
    return Math.max(0, Math.round(kesCost + shippingCost + dutyCost + opportunityCost));
  }, [importInputs]);

  const localFabricationCost = useMemo(() => {
    const landed = landedImportCost;
    if (landed <= 0) return { low: 0, high: 0, avg: 0 };
    
    const low = Math.round(landed * 0.55);
    const high = Math.round(landed * 0.7);
    const avg = Math.round((low + high) / 2);
    
    return { low, high, avg };
  }, [landedImportCost]);

  const savings = useMemo(() => {
    const landed = landedImportCost;
    const local = localFabricationCost.avg;
    return Math.max(0, landed - local);
  }, [landedImportCost, localFabricationCost]);

  const requiredBeam = useMemo(() => {
    const live = parseFloat(structuralInputs.liveLoad) || 0;
    const dead = parseFloat(structuralInputs.deadLoad) || 0;
    const span = parseFloat(structuralInputs.span) || 0;
    const width = parseFloat(structuralInputs.width) || 1;
    
    if (live <= 0 || dead <= 0 || span <= 0) return null;
    
    const totalLoad = (live + dead) * structuralInputs.safetyFactor;
    const moment = structuralInputs.supportType === "simply" 
      ? (totalLoad * Math.pow(span, 2)) / 8 
      : (totalLoad * Math.pow(span, 2)) / 12;
    
    const materials = {
      steel: { modulus: 200000, density: 7850, costPerKg: 250 },
      aluminum: { modulus: 70000, density: 2700, costPerKg: 600 },
      timber: { modulus: 11000, density: 500, costPerKg: 150 },
      concrete: { modulus: 30000, density: 2400, costPerKg: 50 }
    };
    
    const material = materials[structuralInputs.material];
    const sectionModulus = (moment * 1e6) / (material.modulus * 1000);
    
    return {
      moment: Math.round(moment),
      sectionModulus: Math.round(sectionModulus),
      material: structuralInputs.material,
      estimatedWeight: Math.round(sectionModulus * material.density * span * width / 1000),
      estimatedCost: Math.round(sectionModulus * material.density * span * width * material.costPerKg / 1000000)
    };
  }, [structuralInputs]);

  const handleImportChange = useCallback((field) => (e) => {
    const value = e.target.value;
    setImportInputs(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleStructuralChange = useCallback((field) => (e) => {
    const value = e.target.value;
    setStructuralInputs(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleMaterialSelect = useCallback((material) => {
    setStructuralInputs(prev => ({ ...prev, material }));
  }, []);

  const formatCurrency = useCallback((amount, currency = "KES") => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }, []);

  return (
    <section className="service service--fab section-pad" aria-labelledby="fab-heading">
      <h2 id="fab-heading" className="fab-title">
        <span className="title-icon">🔨</span>
        Fabrication & Mechanical Engineering
      </h2>
      
      <p className="service-intro">
        Structural steel, pressure vessels, conveyors, CNC machining — 
        <strong> AWS/ASME/ISO certified</strong>, in‑house NDT testing, 
        <strong> turnkey delivery</strong>, <strong>3D design</strong> and 
        <strong> finite element analysis</strong>.
      </p>

      <div className="grid-two">
        <div className="card import-card">
          <div className="card-header">
            <h3>Local vs Import Cost Analysis</h3>
            <span className="card-badge">Total Landed Cost</span>
          </div>
          
          <div className="calc-grid">
            <label htmlFor="imp">
              <span className="label-text">Item Cost</span>
              <span className="label-hint">Purchase price from supplier</span>
            </label>
            <div className="input-wrapper">
              <input 
                id="imp" 
                type="number" 
                min="0"
                max="1000000"
                step="100"
                value={importInputs.itemCost}
                onChange={handleImportChange("itemCost")}
                placeholder="e.g., 10000"
              />
              <select 
                value={importInputs.currency}
                onChange={handleImportChange("currency")}
                className="currency-select"
                aria-label="Select currency"
              >
                {Object.keys(exchangeRates).map(curr => (
                  <option key={curr} value={curr}>{curr}</option>
                ))}
              </select>
            </div>

            <label htmlFor="shipping">
              <span className="label-text">Shipping & Insurance (%)</span>
              <span className="label-hint">Ocean/air freight + insurance</span>
            </label>
            <div className="input-wrapper">
              <div className="percentage-control">
                <input 
                  id="shipping" 
                  type="range"
                  min="5"
                  max="50"
                  step="1"
                  value={importInputs.shippingPercent}
                  onChange={(e) => setImportInputs(prev => ({ ...prev, shippingPercent: e.target.value }))}
                  aria-label="Adjust shipping percentage"
                />
                <div className="percentage-value">{importInputs.shippingPercent}%</div>
              </div>
            </div>

            <label htmlFor="duty">
              <span className="label-text">Duty & Taxes (%)</span>
              <span className="label-hint">Import duty + VAT + other taxes</span>
            </label>
            <div className="input-wrapper">
              <div className="percentage-control">
                <input 
                  id="duty" 
                  type="range"
                  min="0"
                  max="40"
                  step="1"
                  value={importInputs.dutyPercent}
                  onChange={(e) => setImportInputs(prev => ({ ...prev, dutyPercent: e.target.value }))}
                  aria-label="Adjust duty percentage"
                />
                <div className="percentage-value">{importInputs.dutyPercent}%</div>
              </div>
            </div>

            <label htmlFor="opp">
              <span className="label-text">Opportunity Cost (KSh)</span>
              <span className="label-hint">Lost revenue during lead time</span>
            </label>
            <div className="input-wrapper">
              <input 
                id="opp" 
                type="number" 
                min="0"
                max="10000000"
                step="1000"
                value={importInputs.opportunityCost}
                onChange={handleImportChange("opportunityCost")}
                placeholder="Optional"
              />
              <span className="input-unit">KSh</span>
            </div>

            <label htmlFor="lead-time">
              <span className="label-text">Import Lead Time</span>
              <span className="label-hint">Weeks until delivery</span>
            </label>
            <div className="input-wrapper">
              <select 
                id="lead-time"
                value={importInputs.leadTimeWeeks}
                onChange={handleImportChange("leadTimeWeeks")}
                aria-label="Select lead time"
              >
                <option value="4">4 weeks (Express air)</option>
                <option value="8">8 weeks (Fast sea)</option>
                <option value="12">12 weeks (Standard)</option>
                <option value="16">16 weeks (Slow)</option>
                <option value="24">24 weeks (Complex)</option>
              </select>
            </div>
          </div>

          <div className="calc-results">
            <div className="cost-comparison">
              <div className="cost-option import">
                <div className="option-header">
                  <h4>Import Option</h4>
                  <div className="lead-time">{importInputs.leadTimeWeeks} weeks</div>
                </div>
                <div className="cost-breakdown">
                  <div className="breakdown-item">
                    <span className="breakdown-label">Item Cost:</span>
                    <span className="breakdown-value">
                      {formatCurrency(parseFloat(importInputs.itemCost || 0) * exchangeRates[importInputs.currency])}
                    </span>
                  </div>
                  <div className="breakdown-item">
                    <span className="breakdown-label">Shipping ({importInputs.shippingPercent}%):</span>
                    <span className="breakdown-value">
                      {formatCurrency(parseFloat(importInputs.itemCost || 0) * exchangeRates[importInputs.currency] * importInputs.shippingPercent / 100)}
                    </span>
                  </div>
                  <div className="breakdown-item">
                    <span className="breakdown-label">Duty ({importInputs.dutyPercent}%):</span>
                    <span className="breakdown-value">
                      {formatCurrency(parseFloat(importInputs.itemCost || 0) * exchangeRates[importInputs.currency] * importInputs.dutyPercent / 100)}
                    </span>
                  </div>
                  {importInputs.opportunityCost > 0 && (
                    <div className="breakdown-item">
                      <span className="breakdown-label">Opportunity Cost:</span>
                      <span className="breakdown-value">
                        {formatCurrency(parseFloat(importInputs.opportunityCost))}
                      </span>
                    </div>
                  )}
                  <div className="breakdown-total">
                    <span className="total-label">Total Landed Cost:</span>
                    <span className="total-value">{formatCurrency(landedImportCost)}</span>
                  </div>
                </div>
              </div>
              
              <div className="vs">VS</div>
              
              <div className="cost-option local">
                <div className="option-header">
                  <h4>Local Fabrication</h4>
                  <div className="lead-time">2–4 weeks</div>
                </div>
                <div className="cost-breakdown">
                  <div className="breakdown-item">
                    <span className="breakdown-label">Material Cost:</span>
                    <span className="breakdown-value">{formatCurrency(localFabricationCost.avg * 0.6)}</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="breakdown-label">Labor & Fabrication:</span>
                    <span className="breakdown-value">{formatCurrency(localFabricationCost.avg * 0.3)}</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="breakdown-label">Engineering & QA:</span>
                    <span className="breakdown-value">{formatCurrency(localFabricationCost.avg * 0.1)}</span>
                  </div>
                  <div className="breakdown-total">
                    <span className="total-label">Total Fabrication Cost:</span>
                    <span className="total-value">{formatCurrency(localFabricationCost.avg)}</span>
                    <div className="cost-range">
                      Range: {formatCurrency(localFabricationCost.low)} – {formatCurrency(localFabricationCost.high)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="savings-summary">
              <div className="savings-card">
                <div className="savings-label">Estimated Savings</div>
                <div className="savings-value">{formatCurrency(savings)}</div>
                <div className="savings-percent">
                  {landedImportCost > 0 ? Math.round((savings / landedImportCost) * 100) : 0}% savings
                </div>
              </div>
              
              <div className="time-savings">
                <div className="time-item">
                  <div className="time-label">Time Saved</div>
                  <div className="time-value">{importInputs.leadTimeWeeks - 4} weeks</div>
                </div>
                <div className="time-item">
                  <div className="time-label">Local Support</div>
                  <div className="time-value">Included</div>
                </div>
                <div className="time-item">
                  <div className="time-label">Customization</div>
                  <div className="time-value">Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card structural-card">
          <div className="card-header">
            <h3>Structural Design Calculator</h3>
            <span className="card-badge">AISC/BS Standards</span>
          </div>
          
          <div className="material-selector">
            <p className="selector-label">Select material:</p>
            <div className="material-buttons">
              {['steel', 'aluminum', 'timber', 'concrete'].map(material => (
                <button
                  key={material}
                  onClick={() => handleMaterialSelect(material)}
                  className={`material-btn ${structuralInputs.material === material ? 'active' : ''}`}
                  type="button"
                  aria-label={`Select ${material} material`}
                >
                  {material.charAt(0).toUpperCase() + material.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="calc-grid">
            <label htmlFor="live">
              <span className="label-text">Live Load (kg/m²)</span>
              <span className="label-hint">People, furniture, equipment</span>
            </label>
            <div className="input-wrapper">
              <input 
                id="live" 
                type="number" 
                min="0"
                max="5000"
                step="10"
                value={structuralInputs.liveLoad}
                onChange={handleStructuralChange("liveLoad")}
                placeholder="e.g., 200"
              />
              <span className="input-unit">kg/m²</span>
            </div>

            <label htmlFor="dead">
              <span className="label-text">Dead Load (kg/m²)</span>
              <span className="label-hint">Structure self-weight</span>
            </label>
            <div className="input-wrapper">
              <input 
                id="dead" 
                type="number" 
                min="0"
                max="5000"
                step="10"
                value={structuralInputs.deadLoad}
                onChange={handleStructuralChange("deadLoad")}
                placeholder="e.g., 150"
              />
              <span className="input-unit">kg/m²</span>
            </div>

            <label htmlFor="span">
              <span className="label-text">Span Length (m)</span>
              <span className="label-hint">Distance between supports</span>
            </label>
            <div className="input-wrapper">
              <input 
                id="span" 
                type="number" 
                min="0.5"
                max="50"
                step="0.5"
                value={structuralInputs.span}
                onChange={handleStructuralChange("span")}
                placeholder="e.g., 10"
              />
              <span className="input-unit">m</span>
            </div>

            <label htmlFor="width">
              <span className="label-text">Width (m)</span>
              <span className="label-hint">Tributary width per beam</span>
            </label>
            <div className="input-wrapper">
              <input 
                id="width" 
                type="number" 
                min="0.5"
                max="10"
                step="0.5"
                value={structuralInputs.width}
                onChange={handleStructuralChange("width")}
                placeholder="e.g., 3"
              />
              <span className="input-unit">m</span>
            </div>

            <label htmlFor="sf">
              <span className="label-text">Safety Factor</span>
              <span className="label-hint">Design margin (1.5–2.0)</span>
            </label>
            <div className="input-wrapper">
              <div className="slider-container">
                <input 
                  id="sf" 
                  type="range"
                  min="1.2"
                  max="2.5"
                  step="0.1"
                  value={structuralInputs.safetyFactor}
                  onChange={(e) => setStructuralInputs(prev => ({ ...prev, safetyFactor: e.target.value }))}
                  aria-label="Adjust safety factor"
                />
                <div className="slider-value">{structuralInputs.safetyFactor}</div>
              </div>
            </div>

            <label htmlFor="support">
              <span className="label-text">Support Type</span>
              <span className="label-hint">Beam end conditions</span>
            </label>
            <div className="input-wrapper">
              <select 
                id="support"
                value={structuralInputs.supportType}
                onChange={handleStructuralChange("supportType")}
                aria-label="Select support type"
              >
                <option value="simply">Simply Supported</option>
                <option value="fixed">Fixed Both Ends</option>
                <option value="cantilever">Cantilever</option>
                <option value="continuous">Continuous</option>
              </select>
            </div>
          </div>

          <div className="calc-results">
            {requiredBeam ? (
              <>
                <div className="beam-specification">
                  <h4>Beam Specification</h4>
                  <div className="spec-grid">
                    <div className="spec-item">
                      <span className="spec-label">Material:</span>
                      <span className="spec-value">{requiredBeam.material.charAt(0).toUpperCase() + requiredBeam.material.slice(1)}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Bending Moment:</span>
                      <span className="spec-value">{requiredBeam.moment.toLocaleString()} kN·m</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Section Modulus:</span>
                      <span className="spec-value">{requiredBeam.sectionModulus.toLocaleString()} cm³</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Estimated Weight:</span>
                      <span className="spec-value">{requiredBeam.estimatedWeight.toLocaleString()} kg</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Estimated Cost:</span>
                      <span className="spec-value">{formatCurrency(requiredBeam.estimatedCost)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="standard-sections">
                  <h5>Standard {structuralInputs.material.charAt(0).toUpperCase() + structuralInputs.material.slice(1)} Sections</h5>
                  <div className="sections-grid">
                    {getStandardSections(structuralInputs.material, requiredBeam.sectionModulus).map(section => (
                      <div key={section.name} className="section-card">
                        <div className="section-name">{section.name}</div>
                        <div className="section-properties">
                          <div className="property">
                            <span className="property-label">Z:</span>
                            <span className="property-value">{section.Z} cm³</span>
                          </div>
                          <div className="property">
                            <span className="property-label">Weight:</span>
                            <span className="property-value">{section.weight} kg/m</span>
                          </div>
                        </div>
                        <div className={`section-status ${section.status}`}>
                          {section.status === 'adequate' ? '✓ Adequate' : 'Inadequate'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="no-results">
                <p>Enter load values to calculate beam requirements.</p>
              </div>
            )}
            
            <div className="design-notes">
              <h5>Design Notes</h5>
              <ul>
                <li>Calculations based on {structuralInputs.material} properties</li>
                <li>Safety factor: {structuralInputs.safetyFactor}</li>
                <li>Deflection limit: {structuralInputs.deflectionLimit}</li>
                <li>For detailed design, consult our structural engineers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="fabrication-capabilities">
        <h3>Our Fabrication Capabilities</h3>
        <div className="capabilities-grid">
          <div className="capability-card">
            <div className="capability-icon">🛠️</div>
            <div className="capability-content">
              <h4>Steel Structures</h4>
              <p>Beams, columns, trusses, platforms up to 50-ton capacity</p>
            </div>
          </div>
          <div className="capability-card">
            <div className="capability-icon">⚗️</div>
            <div className="capability-content">
              <h4>Pressure Vessels</h4>
              <p>ASME Section VIII Div 1, up to 1000 PSI, 50m³ volume</p>
            </div>
          </div>
          <div className="capability-card">
            <div className="capability-icon">🔄</div>
            <div className="capability-content">
              <h4>Conveyor Systems</h4>
              <p>Belt, roller, chain conveyors up to 500m length</p>
            </div>
          </div>
          <div className="capability-card">
            <div className="capability-icon">💻</div>
            <div className="capability-content">
              <h4>CNC Machining</h4>
              <p>3–5 axis CNC, laser cutting, up to 2m × 4m capacity</p>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-row">
        <a className="btn-neon" href="mailto:fabrication@emersoneims.com?subject=Fabrication%20Quote" aria-label="Get fabrication quote">
          📋 Get Detailed Fabrication Quote
        </a>
        <a className="btn-neon" href="tel:0782914717" aria-label="Call project engineer at 0782 914 717">
          👷 Project Engineer: 0782 914 717
        </a>
        <a className="btn-neon" href="/portfolio/fabrication" aria-label="View fabrication portfolio">
          📸 View Fabrication Portfolio
        </a>
      </div>
    </section>
  );
}

function getStandardSections(material, requiredZ) {
  const sections = {
    steel: [
      { name: 'UB 203×133×25', Z: 232, weight: 25 },
      { name: 'UB 254×146×31', Z: 351, weight: 31 },
      { name: 'UB 305×165×40', Z: 623, weight: 40 },
      { name: 'UB 356×171×45', Z: 775, weight: 45 },
      { name: 'UB 406×178×60', Z: 1190, weight: 60 },
      { name: 'UB 457×191×67', Z: 1530, weight: 67 },
      { name: 'UB 533×210×82', Z: 2060, weight: 82 }
    ],
    aluminum: [
      { name: 'Alum 150×75×6', Z: 105, weight: 8.5 },
      { name: 'Alum 200×100×8', Z: 245, weight: 12.5 },
      { name: 'Alum 250×125×10', Z: 480, weight: 18.5 },
      { name: 'Alum 300×150×12', Z: 815, weight: 25.5 }
    ],
    timber: [
      { name: 'Timber 150×50', Z: 187.5, weight: 3.75 },
      { name: 'Timber 200×50', Z: 333, weight: 5 },
      { name: 'Timber 250×75', Z: 781, weight: 9.375 },
      { name: 'Timber 300×100', Z: 1500, weight: 15 }
    ],
    concrete: [
      { name: 'Concrete 300×600', Z: 5400, weight: 432 },
      { name: 'Concrete 400×800', Z: 12800, weight: 768 },
      { name: 'Concrete 500×1000', Z: 25000, weight: 1200 }
    ]
  };

  return sections[material].map(section => ({
    ...section,
    status: section.Z >= requiredZ ? 'adequate' : 'inadequate'
  }));
}