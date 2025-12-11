// components/services/MotorRewinding.jsx
import React, { useState, useMemo, useCallback } from "react";

export default function MotorRewinding({ performanceTier }) {
  const [inputs, setInputs] = useState({ 
    newCost: "", 
    rewindCostPercent: 40, 
    expectedLifePercent: 70, 
    plannedYears: 5,
    hp: "",
    operatingHours: "",
    electricityRate: 22,
    efficiencyGain: 8,
    motorType: "induction",
    voltage: "415",
    enclosure: "TEFC"
  });

  const motorTypes = {
    induction: { rewindCost: 40, efficiency: 92, costPerHP: 8000 },
    synchronous: { rewindCost: 50, efficiency: 95, costPerHP: 12000 },
    dc: { rewindCost: 60, efficiency: 88, costPerHP: 10000 },
    servo: { rewindCost: 70, efficiency: 94, costPerHP: 15000 }
  };

  const costPerYearRewind = useMemo(() => {
    const newCost = parseFloat(inputs.newCost) || 0;
    const rewindCost = newCost * (inputs.rewindCostPercent / 100);
    const annualizedRewindCost = rewindCost / inputs.plannedYears;
    const effectiveLifeFactor = inputs.expectedLifePercent / 100;
    
    if (inputs.plannedYears <= 0 || effectiveLifeFactor <= 0) return 0;
    
    return Math.max(0, Math.round(annualizedRewindCost / effectiveLifeFactor));
  }, [inputs.newCost, inputs.rewindCostPercent, inputs.plannedYears, inputs.expectedLifePercent]);

  const annualSavings = useMemo(() => {
    const hp = parseFloat(inputs.hp) || 0;
    const hours = parseFloat(inputs.operatingHours) || 0;
    const rate = parseFloat(inputs.electricityRate) || 0;
    const gain = parseFloat(inputs.efficiencyGain) || 0;
    
    if (hp <= 0 || hours <= 0) return 0;
    
    const kW = hp * 0.746;
    const currentConsumption = (kW * hours * rate) / (inputs.motorType === 'induction' ? 0.92 : 0.95);
    const improvedConsumption = currentConsumption * (1 - gain/100);
    
    return Math.max(0, Math.round(currentConsumption - improvedConsumption));
  }, [inputs.hp, inputs.operatingHours, inputs.electricityRate, inputs.efficiencyGain, inputs.motorType]);

  const replacementCost = useMemo(() => {
    const hp = parseFloat(inputs.hp) || 0;
    const motorType = motorTypes[inputs.motorType];
    return hp * motorType.costPerHP;
  }, [inputs.hp, inputs.motorType]);

  const rewindVsReplace = useMemo(() => {
    const rewindCost = (replacementCost * inputs.rewindCostPercent) / 100;
    const newMotorCost = replacementCost;
    
    return {
      rewindCost: Math.round(rewindCost),
      newMotorCost: Math.round(newMotorCost),
      savings: Math.round(newMotorCost - rewindCost),
      payback: rewindCost > 0 ? Math.round((rewindCost / annualSavings) * 12) : 0
    };
  }, [replacementCost, inputs.rewindCostPercent, annualSavings]);

  const carbonSavings = useMemo(() => {
    const hp = parseFloat(inputs.hp) || 0;
    const hours = parseFloat(inputs.operatingHours) || 0;
    const gain = parseFloat(inputs.efficiencyGain) || 0;
    
    if (hp <= 0 || hours <= 0 || gain <= 0) return 0;
    
    const kW = hp * 0.746;
    const energySavings = (kW * hours * (gain/100)) / 0.92;
    const carbonFactor = 0.5;
    
    return Math.round(energySavings * carbonFactor);
  }, [inputs.hp, inputs.operatingHours, inputs.efficiencyGain]);

  const handleInputChange = useCallback((field) => (e) => {
    const value = e.target.value;
    setInputs(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleMotorTypeChange = useCallback((type) => {
    const motorType = motorTypes[type];
    setInputs(prev => ({
      ...prev,
      motorType: type,
      rewindCostPercent: motorType.rewindCost,
      efficiencyGain: motorType.efficiency
    }));
  }, []);

  const formatHP = useCallback((hp) => {
    const num = parseFloat(hp) || 0;
    if (num >= 1000) return `${(num/1000).toFixed(1)}k HP`;
    return `${num} HP`;
  }, []);

  return (
    <section className="service service--rewind section-pad" aria-labelledby="mr-heading">
      <h2 id="mr-heading" className="rewind-title">
        <span className="title-icon">⚙️</span>
        Motor Rewinding & Industrial Maintenance
      </h2>
      
      <p className="service-intro">
        Up to <strong>5000HP</strong>, ISO‑certified processes, 
        <strong> 48‑hour critical turnaround</strong>, 
        <strong> 98% efficiency restoration</strong>, 
        <strong> 15% energy improvements</strong>. 
        NEMA, IEC, and IEEE standards compliance.
      </p>

      <div className="motor-type-selector">
        <p className="selector-label">Select motor type:</p>
        <div className="type-grid">
          {Object.keys(motorTypes).map(type => (
            <button
              key={type}
              onClick={() => handleMotorTypeChange(type)}
              className={`type-card ${inputs.motorType === type ? 'active' : ''}`}
              type="button"
              aria-label={`Select ${type} motor type`}
            >
              <div className="type-icon">
                {type === 'induction' && '🔄'}
                {type === 'synchronous' && '⚡'}
                {type === 'dc' && '🔋'}
                {type === 'servo' && '🎯'}
              </div>
              <div className="type-name">{type.charAt(0).toUpperCase() + type.slice(1)}</div>
              <div className="type-details">
                {motorTypes[type].rewindCost}% rewind cost
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid-two">
        <div className="card economic-card">
          <div className="card-header">
            <h3>Rewind vs Replace Analysis</h3>
            <span className="card-badge">5-Year TCO</span>
          </div>
          
          <div className="calc-grid">
            <label htmlFor="nc">
              <span className="label-text">New Motor Cost (KSh)</span>
              <span className="label-hint">Based on {formatHP(inputs.hp)} motor</span>
            </label>
            <div className="input-wrapper">
              <input 
                id="nc" 
                type="number" 
                min="0"
                max="10000000"
                step="1000"
                value={inputs.newCost || replacementCost}
                onChange={handleInputChange("newCost")}
                placeholder="Auto-calculated"
              />
              <span className="input-unit">KSh</span>
            </div>

            <label htmlFor="pct">
              <span className="label-text">Rewind Cost (%)</span>
              <span className="label-hint">Percent of new motor cost</span>
            </label>
            <div className="input-wrapper">
              <div className="percentage-control">
                <input 
                  id="pct" 
                  type="range"
                  min="20"
                  max="80"
                  step="1"
                  value={inputs.rewindCostPercent}
                  onChange={(e) => setInputs(prev => ({ ...prev, rewindCostPercent: e.target.value }))}
                  aria-label="Adjust rewind cost percentage"
                />
                <div className="percentage-value">{inputs.rewindCostPercent}%</div>
              </div>
            </div>

            <label htmlFor="life">
              <span className="label-text">Expected Life (%)</span>
              <span className="label-hint">Rewind life vs new motor</span>
            </label>
            <div className="input-wrapper">
              <div className="percentage-control">
                <input 
                  id="life" 
                  type="range"
                  min="50"
                  max="100"
                  step="1"
                  value={inputs.expectedLifePercent}
                  onChange={(e) => setInputs(prev => ({ ...prev, expectedLifePercent: e.target.value }))}
                  aria-label="Adjust expected life percentage"
                />
                <div className="percentage-value">{inputs.expectedLifePercent}%</div>
              </div>
            </div>

            <label htmlFor="yrs">
              <span className="label-text">Planned Service (Years)</span>
              <span className="label-hint">How long to keep motor</span>
            </label>
            <div className="input-wrapper">
              <select 
                id="yrs"
                value={inputs.plannedYears}
                onChange={handleInputChange("plannedYears")}
                aria-label="Select planned service years"
              >
                <option value="3">3 years</option>
                <option value="5">5 years</option>
                <option value="7">7 years</option>
                <option value="10">10 years</option>
                <option value="15">15 years</option>
              </select>
            </div>
          </div>

          <div className="calc-results">
            <div className="comparison">
              <div className="option-card replace">
                <div className="option-header">
                  <h4>Replace Motor</h4>
                  <div className="option-cost">KSh {rewindVsReplace.newMotorCost.toLocaleString()}</div>
                </div>
                <ul className="option-features">
                  <li>Full warranty (1–3 years)</li>
                  <li>100% expected life</li>
                  <li>Latest efficiency standards</li>
                  <li>Immediate availability</li>
                </ul>
              </div>
              
              <div className="vs">VS</div>
              
              <div className="option-card rewind">
                <div className="option-header">
                  <h4>Rewind Motor</h4>
                  <div className="option-cost">KSh {rewindVsReplace.rewindCost.toLocaleString()}</div>
                </div>
                <ul className="option-features">
                  <li>6–12 month warranty</li>
                  <li>{inputs.expectedLifePercent}% expected life</li>
                  <li>Efficiency restoration</li>
                  <li>48-hour turnaround</li>
                </ul>
              </div>
            </div>
            
            <div className="savings-summary">
              <div className="savings-item">
                <span className="savings-label">Immediate Savings:</span>
                <span className="savings-value">KSh {rewindVsReplace.savings.toLocaleString()}</span>
              </div>
              <div className="savings-item">
                <span className="savings-label">Annualized Cost (Rewind):</span>
                <span className="savings-value">KSh {costPerYearRewind.toLocaleString()}/year</span>
              </div>
              <div className="savings-item highlight">
                <span className="savings-label">Payback Period:</span>
                <span className="savings-value">
                  {rewindVsReplace.payback > 0 ? `${rewindVsReplace.payback} months` : '--'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card energy-card">
          <div className="card-header">
            <h3>Energy Efficiency Analysis</h3>
            <span className="card-badge">Annual Savings</span>
          </div>
          
          <div className="calc-grid">
            <label htmlFor="hp">
              <span className="label-text">Motor Size (HP)</span>
              <span className="label-hint">Horsepower rating</span>
            </label>
            <div className="input-wrapper">
              <input 
                id="hp" 
                type="number" 
                min="0.5"
                max="5000"
                step="0.5"
                value={inputs.hp}
                onChange={handleInputChange("hp")}
                placeholder="e.g., 50"
              />
              <span className="input-unit">HP</span>
            </div>

            <label htmlFor="hrs">
              <span className="label-text">Operating Hours/Year</span>
              <span className="label-hint">Annual runtime</span>
            </label>
            <div className="input-wrapper">
              <select 
                id="hrs"
                value={inputs.operatingHours}
                onChange={handleInputChange("operatingHours")}
                aria-label="Select operating hours"
              >
                <option value="">Select hours</option>
                <option value="2000">2,000 hrs (1 shift)</option>
                <option value="4000">4,000 hrs (2 shifts)</option>
                <option value="6000">6,000 hrs (3 shifts)</option>
                <option value="8000">8,000 hrs (Continuous)</option>
              </select>
            </div>

            <label htmlFor="rate">
              <span className="label-text">Electricity Rate (KSh/kWh)</span>
              <span className="label-hint">Your tariff rate</span>
            </label>
            <div className="input-wrapper">
              <select 
                id="rate"
                value={inputs.electricityRate}
                onChange={handleInputChange("electricityRate")}
                aria-label="Select electricity rate"
              >
                <option value="15">15 KSh (Residential)</option>
                <option value="18">18 KSh (Commercial)</option>
                <option value="22">22 KSh (Industrial)</option>
                <option value="25">25 KSh (Peak)</option>
                <option value="30">30 KSh (Emergency)</option>
              </select>
            </div>

            <label htmlFor="gain">
              <span className="label-text">Efficiency Gain (%)</span>
              <span className="label-hint">Improvement after rewind</span>
            </label>
            <div className="input-wrapper">
              <div className="percentage-control">
                <input 
                  id="gain" 
                  type="range"
                  min="1"
                  max="15"
                  step="0.5"
                  value={inputs.efficiencyGain}
                  onChange={(e) => setInputs(prev => ({ ...prev, efficiencyGain: e.target.value }))}
                  aria-label="Adjust efficiency gain percentage"
                />
                <div className="percentage-value">{inputs.efficiencyGain}%</div>
              </div>
            </div>

            <label htmlFor="voltage">
              <span className="label-text">Motor Voltage</span>
              <span className="label-hint">Operating voltage</span>
            </label>
            <div className="input-wrapper">
              <select 
                id="voltage"
                value={inputs.voltage}
                onChange={handleInputChange("voltage")}
                aria-label="Select motor voltage"
              >
                <option value="240">240V 1Φ</option>
                <option value="415">415V 3Φ</option>
                <option value="660">660V 3Φ</option>
                <option value="3300">3.3kV 3Φ</option>
                <option value="6600">6.6kV 3Φ</option>
              </select>
              <span className="input-unit">V</span>
            </div>

            <label htmlFor="enclosure">
              <span className="label-text">Enclosure Type</span>
              <span className="label-hint">Motor protection</span>
            </label>
            <div className="input-wrapper">
              <select 
                id="enclosure"
                value={inputs.enclosure}
                onChange={handleInputChange("enclosure")}
                aria-label="Select enclosure type"
              >
                <option value="ODP">ODP (Open Drip Proof)</option>
                <option value="TEFC">TEFC (Totally Enclosed)</option>
                <option value="TEAO">TEAO (Totally Enclosed Air Over)</option>
                <option value="EXP">EXP (Explosion Proof)</option>
                <option value="WPI">WPI (Weather Protected)</option>
              </select>
            </div>
          </div>

          <div className="calc-results">
            <div className="energy-breakdown">
              <div className="breakdown-header">
                <h4>Annual Energy Savings</h4>
                <div className="breakdown-value">KSh {annualSavings.toLocaleString()}</div>
              </div>
              
              <div className="breakdown-details">
                <div className="detail-item">
                  <span className="detail-label">Motor Power:</span>
                  <span className="detail-value">{formatHP(inputs.hp)} ({Math.round(parseFloat(inputs.hp || 0) * 0.746)} kW)</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Annual Energy:</span>
                  <span className="detail-value">
                    {Math.round((parseFloat(inputs.hp || 0) * 0.746 * parseFloat(inputs.operatingHours || 0)) / 0.92).toLocaleString()} kWh
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Efficiency Gain:</span>
                  <span className="detail-value">{inputs.efficiencyGain}% improvement</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Carbon Reduction:</span>
                  <span className="detail-value">{carbonSavings.toLocaleString()} kg CO₂/year</span>
                </div>
              </div>
              
              <div className="breakdown-timeline">
                <h5>5-Year Savings Projection</h5>
                <div className="timeline">
                  {[1, 2, 3, 4, 5].map(year => (
                    <div key={year} className="timeline-year">
                      <div className="year-label">Year {year}</div>
                      <div className="year-savings">
                        KSh {(annualSavings * year).toLocaleString()}
                      </div>
                      <div 
                        className="year-bar" 
                        style={{ height: `${Math.min(100, (annualSavings * year) / (annualSavings * 5) * 100)}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {annualSavings > 0 && (
              <div className="investment-note">
                <p>
                  <strong>Note:</strong> Energy savings alone can justify motor rewinding in 
                  {Math.ceil(rewindVsReplace.rewindCost / annualSavings)} years.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="services-grid">
        <h3>Additional Motor Services</h3>
        <div className="services-cards">
          <div className="service-card">
            <div className="service-icon">🔍</div>
            <div className="service-content">
              <h4>Motor Testing</h4>
              <p>Megger, surge, vibration, and thermal imaging tests.</p>
            </div>
          </div>
          <div className="service-card">
            <div className="service-icon">🛠️</div>
            <div className="service-content">
              <h4>Bearing Replacement</h4>
              <p>SKF/FAG bearings with proper lubrication.</p>
            </div>
          </div>
          <div className="service-card">
            <div className="service-icon">🎛️</div>
            <div className="service-content">
              <h4>Drive Installation</h4>
              <p>VFD and soft starter installation/retrofitting.</p>
            </div>
          </div>
          <div className="service-card">
            <div className="service-icon">📊</div>
            <div className="service-content">
              <h4>Predictive Maintenance</h4>
              <p>Condition monitoring and failure prediction.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-row">
        <a className="btn-neon" href="mailto:motor@emersoneims.com?subject=Motor%20Diagnostic" aria-label="Request motor diagnostic">
          🔧 Request Free Motor Diagnostic
        </a>
        <a className="btn-neon" href="tel:0768860655" aria-label="Call maintenance lead at 0768 860 655">
          👨‍🔧 Maintenance Lead: 0768 860 655
        </a>
        <a className="btn-neon" href="/documents/motor-test-report.pdf" aria-label="Download motor test report template">
          📄 Download Test Report Template
        </a>
      </div>
    </section>
  );
}