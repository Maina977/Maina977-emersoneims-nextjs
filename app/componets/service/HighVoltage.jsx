// components/services/HighVoltage.jsx
import React, { useState, useMemo, useCallback } from "react";

export default function HighVoltage({ performanceTier }) {
  const [inputs, setInputs] = useState({ 
    demand: "", 
    diversity: 0.8, 
    growth: 1.25,
    pf: 0.75,
    bill: "",
    voltage: "11",
    loadType: "commercial"
  });

  const loadTypes = {
    residential: { diversity: 0.6, growth: 1.15, demandFactor: 0.7 },
    commercial: { diversity: 0.8, growth: 1.25, demandFactor: 0.85 },
    industrial: { diversity: 0.9, growth: 1.35, demandFactor: 0.95 },
    hospital: { diversity: 0.7, growth: 1.3, demandFactor: 0.9 }
  };

  const recommendedTx = useMemo(() => {
    const md = parseFloat(inputs.demand) || 0;
    const { diversity, growth, demandFactor } = loadTypes[inputs.loadType];
    const adjustedDemand = md * demandFactor;
    return Math.max(0, Math.ceil(adjustedDemand * diversity * growth));
  }, [inputs.demand, inputs.diversity, inputs.growth, inputs.loadType]);

  const savingsIf95 = useMemo(() => {
    const current = parseFloat(inputs.bill) || 0;
    const penalty = inputs.pf < 0.9 ? 0.015 : 0;
    const eliminatedPenalty = current * penalty;
    const efficiencyGain = current * 0.08;
    return Math.max(0, Math.round(eliminatedPenalty + efficiencyGain));
  }, [inputs.bill, inputs.pf]);

  const capacitorSize = useMemo(() => {
    const md = parseFloat(inputs.demand) || 0;
    if (md <= 0 || inputs.pf >= 0.95) return 0;
    
    const theta1 = Math.acos(inputs.pf);
    const theta2 = Math.acos(0.95);
    const kVAR = md * (Math.tan(theta1) - Math.tan(theta2));
    return Math.max(0, Math.round(kVAR));
  }, [inputs.demand, inputs.pf]);

  const handleInputChange = useCallback((field) => (e) => {
    const value = e.target.value;
    setInputs(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleLoadTypeChange = useCallback((type) => {
    setInputs(prev => ({
      ...prev,
      loadType: type,
      diversity: loadTypes[type].diversity,
      growth: loadTypes[type].growth
    }));
  }, []);

  const formatVoltage = useCallback((voltage) => {
    const volts = parseInt(voltage);
    return volts >= 1000 ? `${volts/1000} kV` : `${volts} V`;
  }, []);

  return (
    <section className="service service--hv section-pad" aria-labelledby="hv-heading">
      <h2 id="hv-heading" className="hv-title">
        <span className="title-icon">⚡</span>
        High‑Voltage & Electrical Infrastructure
      </h2>
      
      <p className="service-intro">
        11–132kV substations, RMUs, transmission lines, MV/LV switchgear, SCADA systems, 
        and power quality solutions compliant with <strong>Kenya Power</strong>, 
        <strong> EPRA</strong>, and <strong>NEMA</strong> regulations.
      </p>

      <div className="load-type-selector">
        <p className="selector-label">Select load type for default values:</p>
        <div className="type-buttons">
          {Object.keys(loadTypes).map(type => (
            <button
              key={type}
              onClick={() => handleLoadTypeChange(type)}
              className={`type-btn ${inputs.loadType === type ? 'active' : ''}`}
              type="button"
              aria-label={`Set ${type} load type`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid-two">
        <div className="card transformer-card">
          <div className="card-header">
            <h3>Transformer Sizing</h3>
            <span className="card-badge">IEC 60076 Standards</span>
          </div>
          
          <div className="calc-grid">
            <label htmlFor="md">
              <span className="label-text">Maximum Demand (kVA)</span>
              <span className="label-hint">Peak load requirement</span>
            </label>
            <div className="input-wrapper">
              <input 
                id="md" 
                type="number" 
                min="0"
                max="100000"
                step="10"
                value={inputs.demand}
                onChange={handleInputChange("demand")}
                placeholder="e.g., 1000"
              />
              <span className="input-unit">kVA</span>
            </div>

            <label htmlFor="div">
              <span className="label-text">Diversity Factor</span>
              <span className="label-hint">0.1–1.0 (lower = more simultaneous)</span>
            </label>
            <div className="input-wrapper">
              <input 
                id="div" 
                type="number" 
                step="0.05"
                min="0.1"
                max="1"
                value={inputs.diversity}
                onChange={handleInputChange("diversity")}
              />
              <div className="factor-display">
                <span className="factor-label">Current: </span>
                <span className="factor-value">{inputs.diversity}</span>
              </div>
            </div>

            <label htmlFor="grow">
              <span className="label-text">Growth Factor</span>
              <span className="label-hint">Future expansion (1.0–2.0)</span>
            </label>
            <div className="input-wrapper">
              <input 
                id="grow" 
                type="number" 
                step="0.05"
                min="1"
                max="2"
                value={inputs.growth}
                onChange={handleInputChange("growth")}
              />
              <div className="slider-container">
                <input 
                  type="range"
                  min="1"
                  max="2"
                  step="0.05"
                  value={inputs.growth}
                  onChange={(e) => setInputs(prev => ({ ...prev, growth: e.target.value }))}
                  aria-label="Adjust growth factor"
                />
              </div>
            </div>

            <label htmlFor="voltage">
              <span className="label-text">System Voltage</span>
              <span className="label-hint">Primary voltage level</span>
            </label>
            <div className="input-wrapper">
              <select 
                id="voltage"
                value={inputs.voltage}
                onChange={handleInputChange("voltage")}
                aria-label="Select system voltage"
              >
                <option value="0.4">400V LV</option>
                <option value="11">11kV MV</option>
                <option value="33">33kV HV</option>
                <option value="66">66kV HV</option>
                <option value="132">132kV EHV</option>
              </select>
              <span className="input-unit">{formatVoltage(inputs.voltage)}</span>
            </div>
          </div>

          <div className="calc-results">
            <div className="result-card">
              <div className="result-label">Recommended Transformer</div>
              <div className="result-value">{recommendedTx} kVA</div>
              <div className="result-details">
                <div className="detail">
                  <span className="detail-label">Voltage:</span>
                  <span className="detail-value">{formatVoltage(inputs.voltage)}</span>
                </div>
                <div className="detail">
                  <span className="detail-label">Type:</span>
                  <span className="detail-value">Oil/Dry as required</span>
                </div>
                <div className="detail">
                  <span className="detail-label">Est. Cost:</span>
                  <span className="detail-value">KSh {(recommendedTx * 15000).toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            {recommendedTx > 0 && (
              <div className="transformer-options">
                <h4>Standard Sizes Near Recommendation:</h4>
                <div className="size-options">
                  {[315, 500, 630, 800, 1000, 1250, 1600, 2000, 2500]
                    .filter(size => size >= recommendedTx * 0.8 && size <= recommendedTx * 1.2)
                    .map(size => (
                      <div key={size} className="size-option">
                        <div className="size-value">{size} kVA</div>
                        <div className="size-diff">
                          {size >= recommendedTx ? `+${size - recommendedTx}` : `-${recommendedTx - size}`} kVA
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card pf-card">
          <div className="card-header">
            <h3>Power Factor Correction</h3>
            <span className="card-badge">KEBS Approved</span>
          </div>
          
          <div className="pf-display">
            <div className="pf-meter">
              <div className="meter-scale">
                <div className="scale-segment poor" style={{ width: '30%' }}>Poor</div>
                <div className="scale-segment fair" style={{ width: '30%' }}>Fair</div>
                <div className="scale-segment good" style={{ width: '40%' }}>Good</div>
              </div>
              <div 
                className="pf-indicator"
                style={{ left: `${inputs.pf * 100}%` }}
                aria-label={`Current power factor: ${inputs.pf}`}
              >
                <div className="indicator-value">{inputs.pf}</div>
              </div>
            </div>
          </div>

          <div className="calc-grid">
            <label htmlFor="pf">
              <span className="label-text">Current Power Factor</span>
              <span className="label-hint">0.1–1.0 (1.0 = ideal)</span>
            </label>
            <div className="input-wrapper">
              <input 
                id="pf" 
                type="number" 
                step="0.01"
                min="0.1"
                max="1"
                value={inputs.pf}
                onChange={handleInputChange("pf")}
              />
              <div className="slider-container">
                <input 
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.01"
                  value={inputs.pf}
                  onChange={(e) => setInputs(prev => ({ ...prev, pf: e.target.value }))}
                  aria-label="Adjust power factor"
                />
              </div>
            </div>

            <label htmlFor="hv-bill">
              <span className="label-text">Monthly Bill (KSh)</span>
              <span className="label-hint">Total electricity cost</span>
            </label>
            <div className="input-wrapper">
              <input 
                id="hv-bill" 
                type="number" 
                min="0"
                max="10000000"
                step="1000"
                value={inputs.bill}
                onChange={handleInputChange("bill")}
                placeholder="e.g., 500000"
              />
              <span className="input-unit">KSh</span>
            </div>
          </div>

          <div className="calc-results">
            <div className="result-grid">
              <div className="result-item">
                <div className="result-label">Monthly Savings</div>
                <div className="result-value">KSh {savingsIf95.toLocaleString()}</div>
                <div className="result-note">At PF = 0.95</div>
              </div>
              
              <div className="result-item">
                <div className="result-label">Capacitor Size</div>
                <div className="result-value">{capacitorSize} kVAR</div>
                <div className="result-note">Required correction</div>
              </div>
              
              <div className="result-item">
                <div className="result-label">Annual Savings</div>
                <div className="result-value">KSh {(savingsIf95 * 12).toLocaleString()}</div>
                <div className="result-note">12 months</div>
              </div>
              
              <div className="result-item">
                <div className="result-label">ROI Period</div>
                <div className="result-value">
                  {capacitorSize > 0 ? `${Math.round((capacitorSize * 8000) / (savingsIf95 * 12))} months` : '--'}
                </div>
                <div className="result-note">Payback time</div>
              </div>
            </div>
            
            {capacitorSize > 0 && (
              <div className="pf-breakdown">
                <h4>Correction System Components</h4>
                <div className="components-list">
                  <div className="component-item">
                    <span className="component-name">Capacitor Bank</span>
                    <span className="component-value">{capacitorSize} kVAR</span>
                  </div>
                  <div className="component-item">
                    <span className="component-name">Controller</span>
                    <span className="component-value">Microprocessor based</span>
                  </div>
                  <div className="component-item">
                    <span className="component-name">Contactors</span>
                    <span className="component-value">{Math.ceil(capacitorSize / 25)} steps</span>
                  </div>
                  <div className="component-item">
                    <span className="component-name">Estimated Cost</span>
                    <span className="component-value">KSh {(capacitorSize * 8000).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="services-overview">
        <h3>Additional HV Services</h3>
        <div className="services-grid">
          <div className="service-item">
            <div className="service-icon">🏗️</div>
            <div className="service-content">
              <h4>Substation Design</h4>
              <p>Complete 11–132kV substation design, civil works, and commissioning.</p>
            </div>
          </div>
          <div className="service-item">
            <div className="service-icon">🔧</div>
            <div className="service-content">
              <h4>Switchgear Installation</h4>
              <p>MV/LV switchgear, RMUs, circuit breakers, and protection systems.</p>
            </div>
          </div>
          <div className="service-item">
            <div className="service-icon">📡</div>
            <div className="service-content">
              <h4>SCADA & Monitoring</h4>
              <p>Real-time monitoring, remote control, and data logging systems.</p>
            </div>
          </div>
          <div className="service-item">
            <div className="service-icon">⚡</div>
            <div className="service-content">
              <h4>Power Quality</h4>
              <p>Harmonic filters, voltage stabilizers, and surge protection.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-row">
        <a className="btn-neon" href="mailto:hv@emersoneims.com?subject=HV%20Design%20Request" aria-label="Request HV design">
          📐 Request HV Design Package
        </a>
        <a className="btn-neon" href="tel:0768860655" aria-label="Call HV engineer at 0768 860 655">
          👨‍💼 HV Engineer: 0768 860 655
        </a>
        <a className="btn-neon" href="/documents/hv-standards.pdf" aria-label="Download HV standards PDF">
          📄 Download Standards PDF
        </a>
      </div>
    </section>
  );
}