// components/services/UPSSystems.jsx
import React, { useState, useMemo, useCallback } from "react";

export default function UPSSystems({ performanceTier }) {
  const [inputs, setInputs] = useState({ 
    watts: "", 
    efficiency: 0.94, 
    batteryAh: "", 
    dcVoltage: 48,
    runtimeReq: "30",
    redundancy: "N",
    loadType: "server"
  });

  const [downtimeInputs, setDowntimeInputs] = useState({
    hourlyRevenue: "",
    outageDuration: "",
    recoveryCost: "",
    reputationImpact: "medium"
  });

  const loadTypes = {
    server: { efficiency: 0.94, runtime: 15, redundancy: "N+1" },
    medical: { efficiency: 0.96, runtime: 60, redundancy: "2N" },
    industrial: { efficiency: 0.92, runtime: 5, redundancy: "N" },
    telecom: { efficiency: 0.95, runtime: 240, redundancy: "N+1" }
  };

  const apparentVA = useMemo(() => {
    const w = parseFloat(inputs.watts) || 0;
    return Math.max(0, Math.round(w / inputs.efficiency));
  }, [inputs.watts, inputs.efficiency]);

  const runtimeHours = useMemo(() => {
    const w = parseFloat(inputs.watts) || 0;
    const A = parseFloat(inputs.batteryAh) || 0;
    const V = parseFloat(inputs.dcVoltage) || 48;
    if (w <= 0 || A <= 0) return 0;
    return Math.max(0, +((A * V * 0.85 * inputs.efficiency) / w).toFixed(2));
  }, [inputs.watts, inputs.batteryAh, inputs.dcVoltage, inputs.efficiency]);

  const requiredBattery = useMemo(() => {
    const w = parseFloat(inputs.watts) || 0;
    const runtime = parseFloat(inputs.runtimeReq) || 0;
    if (w <= 0 || runtime <= 0) return 0;
    return Math.ceil((w * runtime) / (inputs.dcVoltage * inputs.efficiency * 0.85));
  }, [inputs.watts, inputs.runtimeReq, inputs.dcVoltage, inputs.efficiency]);

  const downtimeCost = useMemo(() => {
    const revenue = parseFloat(downtimeInputs.hourlyRevenue) || 0;
    const duration = parseFloat(downtimeInputs.outageDuration) || 0;
    const recovery = parseFloat(downtimeInputs.recoveryCost) || 0;
    
    const directLoss = revenue * duration;
    const recoveryCost = recovery || revenue * 0.2;
    
    const reputationFactors = {
      low: 0.05,
      medium: 0.15,
      high: 0.3,
      critical: 0.5
    };
    
    const reputationLoss = revenue * duration * reputationFactors[downtimeInputs.reputationImpact];
    
    return Math.max(0, Math.round(directLoss + recoveryCost + reputationLoss));
  }, [downtimeInputs]);

  const upsRecommendation = useMemo(() => {
    const va = apparentVA;
    if (va <= 0) return null;
    
    if (va < 1000) return { size: "1kVA", type: "Standby", cost: 50000, modules: 1 };
    if (va < 3000) return { size: "3kVA", type: "Line-Interactive", cost: 150000, modules: 1 };
    if (va < 10000) return { size: "10kVA", type: "Online Single", cost: 450000, modules: 1 };
    if (va < 20000) return { size: "20kVA", type: "Online 3-phase", cost: 900000, modules: 1 };
    if (va < 50000) return { size: "50kVA", type: "Modular", cost: 2000000, modules: Math.ceil(va / 10000) };
    return { size: "100kVA+", type: "Modular Parallel", cost: 4000000, modules: Math.ceil(va / 25000) };
  }, [apparentVA]);

  const handleInputChange = useCallback((field) => (e) => {
    const value = e.target.value;
    setInputs(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleDowntimeChange = useCallback((field) => (e) => {
    const value = e.target.value;
    setDowntimeInputs(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleLoadTypeSelect = useCallback((type) => {
    const config = loadTypes[type];
    setInputs(prev => ({
      ...prev,
      loadType: type,
      efficiency: config.efficiency,
      runtimeReq: config.runtime.toString()
    }));
  }, []);

  const formatRuntime = useCallback((minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }, []);

  return (
    <section className="service service--ups section-pad" aria-labelledby="ups-heading">
      <div className="grid-two">
        <div>
          <h2 id="ups-heading" className="ups-title">
            <span className="title-icon">🔋</span>
            UPS & Power Control Systems
          </h2>
          <p className="service-description">
            Online UPS, modular N+1, DCIM, lithium banks, intelligent PDUs — 
            seamless <strong>&lt;2ms transitions</strong>, zero data loss, 
            <strong> 96% efficiency</strong>, <strong>99.999% availability</strong>.
          </p>
          
          <div className="load-presets">
            <p className="preset-label">Quick presets:</p>
            <div className="preset-buttons">
              {Object.keys(loadTypes).map(type => (
                <button
                  key={type}
                  onClick={() => handleLoadTypeSelect(type)}
                  className={`preset-btn ${inputs.loadType === type ? 'active' : ''}`}
                  type="button"
                  aria-label={`Configure for ${type} load`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="ups-features">
            <div className="feature">
              <div className="feature-icon">⚡</div>
              <div className="feature-content">
                <h4>Zero Transfer Time</h4>
                <p>True online double conversion with &lt;2ms transfer</p>
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">🔄</div>
              <div className="feature-content">
                <h4>Hot-Swap Modules</h4>
                <p>Modular design for maintenance without downtime</p>
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">📱</div>
              <div className="feature-content">
                <h4>Remote Monitoring</h4>
                <p>SNMP, Modbus, cloud monitoring with alerts</p>
              </div>
            </div>
          </div>
          
          <div className="cta-row">
            <a className="btn-neon" href="mailto:ups@emersoneims.com?subject=UPS%20Design" aria-label="Request UPS design">
              🖥️ Design My UPS System
            </a>
            <a className="btn-neon" href="tel:0782914717" aria-label="Call DC expert at 0782 914 717">
              👨‍🔬 DC Power Expert: 0782 914 717
            </a>
          </div>
        </div>
        <figure aria-labelledby="ups-caption">
          <img 
            src="https://www.emersoneims.com/wp-content/uploads/2025/10/APC-UPS-scaled.png" 
            alt="APC UPS systems including modular and rack-mount configurations" 
            loading="lazy"
            width="600"
            height="400"
          />
          <figcaption id="ups-caption">Mission‑critical power protection for data centers, hospitals, and industrial applications.</figcaption>
        </figure>
      </div>

      <div className="grid-two">
        <div className="card ups-calculator">
          <div className="card-header">
            <h3>UPS Sizing Calculator</h3>
            <span className="card-badge">IEC 62040 Standards</span>
          </div>
          
          <div className="calc-grid">
            <label htmlFor="ups-w">
              <span className="label-text">Total Load (Watts)</span>
              <span className="label-hint">Active power consumption</span>
            </label>
            <div className="input-wrapper">
              <input 
                id="ups-w" 
                type="number" 
                min="0"
                max="1000000"
                step="100"
                value={inputs.watts}
                onChange={handleInputChange("watts")}
                placeholder="e.g., 5000"
              />
              <span className="input-unit">W</span>
            </div>

            <label htmlFor="ups-eff">
              <span className="label-text">UPS Efficiency</span>
              <span className="label-hint">Typical: 92–96%</span>
            </label>
            <div className="input-wrapper">
              <input 
                id="ups-eff" 
                type="number" 
                step="0.01"
                min="0.8"
                max="0.99"
                value={inputs.efficiency}
                onChange={handleInputChange("efficiency")}
              />
              <div className="efficiency-display">
                <span className="efficiency-value">{Math.round(inputs.efficiency * 100)}%</span>
              </div>
            </div>

            <label htmlFor="runtime-req">
              <span className="label-text">Required Runtime</span>
              <span className="label-hint">Backup time needed</span>
            </label>
            <div className="input-wrapper">
              <select 
                id="runtime-req"
                value={inputs.runtimeReq}
                onChange={handleInputChange("runtimeReq")}
                aria-label="Select required runtime"
              >
                <option value="5">5 minutes (Graceful shutdown)</option>
                <option value="15">15 minutes (Standard backup)</option>
                <option value="30">30 minutes (Extended backup)</option>
                <option value="60">60 minutes (Critical systems)</option>
                <option value="120">2 hours (Extended operations)</option>
                <option value="240">4 hours (Full shift)</option>
                <option value="480">8 hours (Work day)</option>
              </select>
            </div>

            <label htmlFor="ups-v">
              <span className="label-text">DC System Voltage</span>
              <span className="label-hint">Battery bank voltage</span>
            </label>
            <div className="input-wrapper">
              <select 
                id="ups-v"
                value={inputs.dcVoltage}
                onChange={handleInputChange("dcVoltage")}
                aria-label="Select DC voltage"
              >
                <option value="12">12V (Small UPS)</option>
                <option value="24">24V (Medium UPS)</option>
                <option value="48">48V (Standard)</option>
                <option value="96">96V (Large systems)</option>
                <option value="192">192V (Industrial)</option>
                <option value="240">240V (DC plant)</option>
              </select>
              <span className="input-unit">VDC</span>
            </div>

            <label htmlFor="redundancy">
              <span className="label-text">Redundancy Level</span>
              <span className="label-hint">System reliability</span>
            </label>
            <div className="input-wrapper">
              <select 
                id="redundancy"
                value={inputs.redundancy}
                onChange={handleInputChange("redundancy")}
                aria-label="Select redundancy level"
              >
                <option value="N">N (No redundancy)</option>
                <option value="N+1">N+1 (One extra module)</option>
                <option value="2N">2N (Full redundancy)</option>
                <option value="2(N+1)">2(N+1) (Maximum redundancy)</option>
              </select>
            </div>

            <label htmlFor="ups-ah">
              <span className="label-text">Battery Capacity (Ah)</span>
              <span className="label-hint">For runtime calculation</span>
            </label>
            <div className="input-wrapper">
              <input 
                id="ups-ah" 
                type="number" 
                min="0"
                max="5000"
                step="10"
                value={inputs.batteryAh}
                onChange={handleInputChange("batteryAh")}
                placeholder="e.g., 100"
              />
              <span className="input-unit">Ah</span>
            </div>
          </div>

          <div className="calc-results">
            <div className="result-grid">
              <div className="result-item">
                <div className="result-label">UPS Size</div>
                <div className="result-value">{apparentVA.toLocaleString()} VA</div>
                <div className="result-note">Apparent power</div>
              </div>
              
              <div className="result-item">
                <div className="result-label">Runtime</div>
                <div className="result-value">{runtimeHours > 0 ? formatRuntime(runtimeHours * 60) : '--'}</div>
                <div className="result-note">With current battery</div>
              </div>
              
              <div className="result-item">
                <div className="result-label">Battery Required</div>
                <div className="result-value">{requiredBattery > 0 ? `${requiredBattery} Ah` : '--'}</div>
                <div className="result-note">For {inputs.runtimeReq}min backup</div>
              </div>
              
              <div className="result-item">
                <div className="result-label">Battery Cost</div>
                <div className="result-value">
                  {requiredBattery > 0 ? `KSh ${(requiredBattery * 500).toLocaleString()}` : '--'}
                </div>
                <div className="result-note">VRLA batteries</div>
              </div>
            </div>
            
            {upsRecommendation && (
              <div className="recommendation">
                <h4>Recommended System</h4>
                <div className="recommendation-details">
                  <div className="detail-row">
                    <span className="detail-label">UPS Size:</span>
                    <span className="detail-value">{upsRecommendation.size}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Type:</span>
                    <span className="detail-value">{upsRecommendation.type}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Modules:</span>
                    <span className="detail-value">{upsRecommendation.modules}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Estimated Cost:</span>
                    <span className="detail-value">KSh {upsRecommendation.cost.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card downtime-calculator">
          <div className="card-header">
            <h3>Downtime Cost Analysis</h3>
            <span className="card-badge">Risk Assessment</span>
          </div>
          
          <div className="calc-grid">
            <label htmlFor="rev">
              <span className="label-text">Hourly Revenue (KSh)</span>
              <span className="label-hint">Business value per hour</span>
            </label>
            <div className="input-wrapper">
              <input 
                id="rev" 
                type="number" 
                min="0"
                max="10000000"
                step="1000"
                value={downtimeInputs.hourlyRevenue}
                onChange={handleDowntimeChange("hourlyRevenue")}
                placeholder="e.g., 50000"
              />
              <span className="input-unit">KSh/hr</span>
            </div>

            <label htmlFor="dur">
              <span className="label-text">Outage Duration (hours)</span>
              <span className="label-hint">Typical power failure</span>
            </label>
            <div className="input-wrapper">
              <select 
                id="dur"
                value={downtimeInputs.outageDuration}
                onChange={handleDowntimeChange("outageDuration")}
                aria-label="Select outage duration"
              >
                <option value="">Select duration</option>
                <option value="0.25">15 minutes</option>
                <option value="0.5">30 minutes</option>
                <option value="1">1 hour</option>
                <option value="2">2 hours</option>
                <option value="4">4 hours</option>
                <option value="8">8 hours</option>
                <option value="24">1 day</option>
              </select>
            </div>

            <label htmlFor="recovery">
              <span className="label-text">Recovery Cost (KSh)</span>
              <span className="label-hint">Data/equipment recovery</span>
            </label>
            <div className="input-wrapper">
              <input 
                id="recovery" 
                type="number" 
                min="0"
                max="10000000"
                step="1000"
                value={downtimeInputs.recoveryCost}
                onChange={handleDowntimeChange("recoveryCost")}
                placeholder="Optional"
              />
              <span className="input-unit">KSh</span>
            </div>

            <label htmlFor="reputation">
              <span className="label-text">Reputation Impact</span>
              <span className="label-hint">Brand damage risk</span>
            </label>
            <div className="input-wrapper">
              <select 
                id="reputation"
                value={downtimeInputs.reputationImpact}
                onChange={handleDowntimeChange("reputationImpact")}
                aria-label="Select reputation impact level"
              >
                <option value="low">Low (Internal systems)</option>
                <option value="medium">Medium (Customer facing)</option>
                <option value="high">High (Critical services)</option>
                <option value="critical">Critical (Life safety)</option>
              </select>
            </div>
          </div>

          <div className="calc-results">
            <div className="cost-breakdown">
              <h4>Cost Breakdown</h4>
              
              <div className="breakdown-item">
                <div className="breakdown-label">
                  <span>Direct Revenue Loss</span>
                  <span className="breakdown-hint">
                    {downtimeInputs.hourlyRevenue || 0} × {downtimeInputs.outageDuration || 0} hours
                  </span>
                </div>
                <div className="breakdown-value">
                  KSh {Math.round((parseFloat(downtimeInputs.hourlyRevenue) || 0) * (parseFloat(downtimeInputs.outageDuration) || 0)).toLocaleString()}
                </div>
              </div>
              
              <div className="breakdown-item">
                <div className="breakdown-label">
                  <span>Recovery Cost</span>
                  <span className="breakdown-hint">
                    {downtimeInputs.recoveryCost ? 'Custom' : '20% of revenue loss'}
                  </span>
                </div>
                <div className="breakdown-value">
                  KSh {Math.round(
                    parseFloat(downtimeInputs.recoveryCost) || 
                    ((parseFloat(downtimeInputs.hourlyRevenue) || 0) * (parseFloat(downtimeInputs.outageDuration) || 0) * 0.2)
                  ).toLocaleString()}
                </div>
              </div>
              
              <div className="breakdown-item">
                <div className="breakdown-label">
                  <span>Reputation Damage</span>
                  <span className="breakdown-hint">
                    {downtimeInputs.reputationImpact} impact level
                  </span>
                </div>
                <div className="breakdown-value">
                  KSh {Math.round(
                    ((parseFloat(downtimeInputs.hourlyRevenue) || 0) * 
                    (parseFloat(downtimeInputs.outageDuration) || 0) * 
                    { low: 0.05, medium: 0.15, high: 0.3, critical: 0.5 }[downtimeInputs.reputationImpact])
                  ).toLocaleString()}
                </div>
              </div>
              
              <div className="breakdown-total">
                <div className="total-label">Total Downtime Cost</div>
                <div className="total-value">KSh {downtimeCost.toLocaleString()}</div>
              </div>
            </div>
            
            {downtimeCost > 0 && (
              <div className="roi-analysis">
                <h4>UPS Investment Justification</h4>
                <div className="roi-details">
                  <div className="roi-item">
                    <span className="roi-label">UPS System Cost:</span>
                    <span className="roi-value">~KSh {(apparentVA * 100).toLocaleString()}</span>
                  </div>
                  <div className="roi-item">
                    <span className="roi-label">Single Outage Cost:</span>
                    <span className="roi-value">KSh {downtimeCost.toLocaleString()}</span>
                  </div>
                  <div className="roi-item">
                    <span className="roi-label">Annual Outage Risk:</span>
                    <span className="roi-value">2–4 events (typical)</span>
                  </div>
                  <div className="roi-item highlight">
                    <span className="roi-label">ROI Period:</span>
                    <span className="roi-value">
                      {Math.round((apparentVA * 100) / (downtimeCost * 2))} months
                    </span>
                  </div>
                </div>
                <p className="roi-note">
                  *Based on 2 outages per year. Actual ROI may be faster with more frequent outages.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="battery-options">
        <h3>Battery Technology Options</h3>
        <div className="battery-grid">
          <div className="battery-card">
            <div className="battery-header">
              <div className="battery-icon">🔋</div>
              <h4>VRLA (Sealed Lead Acid)</h4>
            </div>
            <ul className="battery-features">
              <li>3–5 year lifespan</li>
              <li>Lower upfront cost</li>
              <li>Proven technology</li>
              <li>80–85% efficiency</li>
            </ul>
            <div className="battery-cost">~KSh 500/Ah</div>
          </div>
          
          <div className="battery-card recommended">
            <div className="battery-header">
              <div className="battery-icon">⚡</div>
              <h4>Lithium-Ion</h4>
              <span className="recommended-badge">Recommended</span>
            </div>
            <ul className="battery-features">
              <li>8–10 year lifespan</li>
              <li>95%+ efficiency</li>
              <li>Half the weight/size</li>
              <li>Built-in BMS</li>
            </ul>
            <div className="battery-cost">~KSh 1200/Ah</div>
          </div>
          
          <div className="battery-card">
            <div className="battery-header">
              <div className="battery-icon">🔄</div>
              <h4>Ultracapacitors</h4>
            </div>
            <ul className="battery-features">
              <li>1M+ cycles</li>
              <li>Instantaneous power</li>
              <li>Wide temperature range</li>
              <li>Bridge power only</li>
            </ul>
            <div className="battery-cost">~KSh 3000/Ah</div>
          </div>
        </div>
      </div>

      <div className="cta-row centered">
        <a className="btn-neon large" href="mailto:battery@emersoneims.com?subject=Battery%20Options" aria-label="Discuss battery options">
          🔋 Compare Battery Technologies
        </a>
      </div>
    </section>
  );
}