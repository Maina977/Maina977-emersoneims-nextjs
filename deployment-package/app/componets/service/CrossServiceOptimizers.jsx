// components/services/CrossServiceOptimizers.jsx
import React, { useState, useMemo, useCallback } from "react";

export default function CrossServiceOptimizers({ performanceTier }) {
  const [energyInputs, setEnergyInputs] = useState({ 
    monthlySpend: "", 
    dieselPercent: 40, 
    gridPercent: 50, 
    solarPercent: 10,
    currentEfficiency: "medium",
    targetScenario: "balanced"
  });

  const [facilityInputs, setFacilityInputs] = useState({
    generatorCost: "",
    solarCost: "",
    upsCost: "",
    maintenanceCost: "",
    separateOverhead: 18,
    currentVendors: 4,
    integrationLevel: "full"
  });

  const [financingInputs, setFinancingInputs] = useState({
    cashPurchase: "",
    leaseMonthly: "",
    leaseTerm: 48,
    leaseRate: 12,
    ppaRate: "",
    ppaMonthlyKwh: "",
    ppaTerm: 120,
    financingType: "lease",
    taxRate: 30
  });

  const efficiencyLevels = {
    poor: { savings: 0.2 },
    medium: { savings: 0.32 },
    good: { savings: 0.4 },
    excellent: { savings: 0.45 }
  };

  const targetScenarios = {
    diesel: { diesel: 70, grid: 20, solar: 10, savings: 0.22 },
    balanced: { diesel: 40, grid: 40, solar: 20, savings: 0.32 },
    green: { diesel: 20, grid: 30, solar: 50, savings: 0.38 },
    maximum: { diesel: 10, grid: 20, solar: 70, savings: 0.45 }
  };

  const integrationLevels = {
    basic: { savings: 0.15, overhead: 0.12 },
    standard: { savings: 0.22, overhead: 0.08 },
    full: { savings: 0.3, overhead: 0.05 },
    premium: { savings: 0.35, overhead: 0.03 }
  };

  const energySavings = useMemo(() => {
    const spend = parseFloat(energyInputs.monthlySpend) || 0;
    const efficiency = efficiencyLevels[energyInputs.currentEfficiency];
    const scenario = targetScenarios[energyInputs.targetScenario];
    
    if (spend <= 0) return { annual: 0, monthly: 0, percent: 0 };
    
    const currentSavings = spend * 12 * efficiency.savings;
    const targetSavings = spend * 12 * scenario.savings;
    const additionalSavings = targetSavings - currentSavings;
    
    return {
      annual: Math.max(0, Math.round(targetSavings)),
      monthly: Math.round(targetSavings / 12),
      percent: Math.round(scenario.savings * 100),
      additional: Math.max(0, Math.round(additionalSavings))
    };
  }, [energyInputs]);

  const facilitySavings = useMemo(() => {
    const generator = parseFloat(facilityInputs.generatorCost) || 0;
    const solar = parseFloat(facilityInputs.solarCost) || 0;
    const ups = parseFloat(facilityInputs.upsCost) || 0;
    const maintenance = parseFloat(facilityInputs.maintenanceCost) || 0;
    
    const separateCost = generator + solar + ups + maintenance;
    const overhead = separateCost * (facilityInputs.separateOverhead / 100);
    const separateTotal = separateCost + overhead;
    
    const integration = integrationLevels[facilityInputs.integrationLevel];
    const integratedTotal = separateCost * (1 - integration.savings) * (1 + integration.overhead);
    const savings = separateTotal - integratedTotal;
    
    return {
      separateTotal: Math.round(separateTotal),
      integratedTotal: Math.round(integratedTotal),
      savings: Math.round(savings),
      percent: Math.round((savings / separateTotal) * 100),
      overheadReduction: Math.round(overhead * 0.7)
    };
  }, [facilityInputs]);

  const financingComparison = useMemo(() => {
    const cash = parseFloat(financingInputs.cashPurchase) || 0;
    const leaseMonthly = parseFloat(financingInputs.leaseMonthly) || 0;
    const leaseTerm = parseInt(financingInputs.leaseTerm) || 48;
    const leaseRate = parseFloat(financingInputs.leaseRate) || 12;
    const ppaRate = parseFloat(financingInputs.ppaRate) || 0;
    const ppaKwh = parseFloat(financingInputs.ppaMonthlyKwh) || 0;
    const ppaTerm = parseInt(financingInputs.ppaTerm) || 120;
    const taxRate = financingInputs.taxRate / 100;
    
    const leaseTotal = leaseMonthly * leaseTerm;
    const leaseInterest = leaseTotal - cash;
    const leaseTaxBenefit = leaseInterest * taxRate;
    const leaseNet = leaseTotal - leaseTaxBenefit;
    
    const ppaMonthly = ppaRate * ppaKwh;
    const ppaTotal = ppaMonthly * ppaTerm;
    const ppaTaxBenefit = ppaTotal * 0.3 * taxRate;
    const ppaNet = ppaTotal - ppaTaxBenefit;
    
    const cashTaxBenefit = cash * 0.3 * taxRate;
    const cashNet = cash - cashTaxBenefit;
    
    return {
      cash: {
        total: cash,
        net: Math.round(cashNet),
        taxBenefit: Math.round(cashTaxBenefit)
      },
      lease: {
        total: Math.round(leaseTotal),
        net: Math.round(leaseNet),
        taxBenefit: Math.round(leaseTaxBenefit),
        monthly: Math.round(leaseMonthly)
      },
      ppa: {
        total: Math.round(ppaTotal),
        net: Math.round(ppaNet),
        taxBenefit: Math.round(ppaTaxBenefit),
        monthly: Math.round(ppaMonthly)
      }
    };
  }, [financingInputs]);

  const totalOptimizationSavings = useMemo(() => {
    return energySavings.annual + facilitySavings.savings;
  }, [energySavings, facilitySavings]);

  const handleEnergyChange = useCallback((field) => (e) => {
    const value = e.target.value;
    setEnergyInputs(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleFacilityChange = useCallback((field) => (e) => {
    const value = e.target.value;
    setFacilityInputs(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleFinancingChange = useCallback((field) => (e) => {
    const value = e.target.value;
    setFinancingInputs(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleTargetScenarioSelect = useCallback((scenario) => {
    const target = targetScenarios[scenario];
    setEnergyInputs(prev => ({
      ...prev,
      targetScenario: scenario,
      dieselPercent: target.diesel,
      gridPercent: target.grid,
      solarPercent: target.solar
    }));
  }, []);

  const handleIntegrationLevelSelect = useCallback((level) => {
    setFacilityInputs(prev => ({ ...prev, integrationLevel: level }));
  }, []);

  const handleFinancingTypeSelect = useCallback((type) => {
    setFinancingInputs(prev => ({ ...prev, financingType: type }));
  }, []);

  const totalPercent = useMemo(() => {
    const total = parseFloat(energyInputs.dieselPercent) + 
                 parseFloat(energyInputs.gridPercent) + 
                 parseFloat(energyInputs.solarPercent);
    return Math.round(total);
  }, [energyInputs]);

  const formatCurrency = useCallback((amount) => {
    if (amount >= 1000000) return `${(amount/1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${(amount/1000).toFixed(0)}K`;
    return amount.toString();
  }, []);

  return (
    <section className="service service--optimizers section-pad" aria-labelledby="opt-heading">
      <h2 id="opt-heading" className="optimizer-title">
        <span className="title-icon">🎯</span>
        Cross‑Service Optimization Platform
      </h2>
      
      <p className="service-intro">
        One orchestration platform for maximum efficiency. 
        <strong> Integrated energy management</strong>, 
        <strong> facility‑wide optimization</strong>, 
        <strong> intelligent financing</strong>, and 
        <strong> predictive analytics</strong> aligned to your cash‑flow and sustainability goals.
      </p>

      <div className="optimization-summary">
        <div className="summary-card">
          <div className="summary-icon">💰</div>
          <div className="summary-content">
            <div className="summary-value">
              KSh {totalOptimizationSavings.toLocaleString()}
            </div>
            <div className="summary-label">Potential Annual Savings</div>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">⚡</div>
          <div className="summary-content">
            <div className="summary-value">
              {energySavings.percent}%
            </div>
            <div className="summary-label">Energy Cost Reduction</div>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">🔧</div>
          <div className="summary-content">
            <div className="summary-value">
              {facilitySavings.percent}%
            </div>
            <div className="summary-label">Facility Management Savings</div>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">📊</div>
          <div className="summary-content">
            <div className="summary-value">
              24/7
            </div>
            <div className="summary-label">Monitoring & Optimization</div>
          </div>
        </div>
      </div>

      <div className="grid-three">
        <div className="card energy-card">
          <div className="card-header">
            <h3>Integrated Energy Mix Optimization</h3>
            <span className="card-badge">Smart Grid</span>
          </div>
          
          <div className="scenario-selector">
            <p className="selector-label">Target optimization scenario:</p>
            <div className="scenario-buttons">
              {Object.keys(targetScenarios).map(scenario => (
                <button
                  key={scenario}
                  onClick={() => handleTargetScenarioSelect(scenario)}
                  className={`scenario-btn ${energyInputs.targetScenario === scenario ? 'active' : ''}`}
                  type="button"
                  aria-label={`Select ${scenario} optimization scenario`}
                >
                  {scenario.charAt(0).toUpperCase() + scenario.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="calc-grid">
            <label htmlFor="spend">
              <span className="label-text">Monthly Energy Spend (KSh)</span>
              <span className="label-hint">Current total energy cost</span>
            </label>
            <div className="input-wrapper">
              <input 
                id="spend" 
                type="number" 
                min="0"
                max="10000000"
                step="1000"
                value={energyInputs.monthlySpend}
                onChange={handleEnergyChange("monthlySpend")}
                placeholder="e.g., 500000"
              />
              <span className="input-unit">KSh</span>
            </div>

            <div className="energy-mix">
              <div className="mix-header">
                <h5>Current Energy Mix</h5>
                {totalPercent !== 100 && (
                  <span className="mix-warning">Total: {totalPercent}%</span>
                )}
              </div>
              
              <div className="mix-controls">
                <div className="mix-control">
                  <label htmlFor="diesel">Diesel</label>
                  <div className="slider-container">
                    <input 
                      id="diesel" 
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={energyInputs.dieselPercent}
                      onChange={(e) => setEnergyInputs(prev => ({ ...prev, dieselPercent: e.target.value }))}
                      aria-label="Adjust diesel percentage"
                    />
                    <div className="slider-value">{energyInputs.dieselPercent}%</div>
                  </div>
                </div>
                
                <div className="mix-control">
                  <label htmlFor="grid">Grid</label>
                  <div className="slider-container">
                    <input 
                      id="grid" 
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={energyInputs.gridPercent}
                      onChange={(e) => setEnergyInputs(prev => ({ ...prev, gridPercent: e.target.value }))}
                      aria-label="Adjust grid percentage"
                    />
                    <div className="slider-value">{energyInputs.gridPercent}%</div>
                  </div>
                </div>
                
                <div className="mix-control">
                  <label htmlFor="solar">Solar</label>
                  <div className="slider-container">
                    <input 
                      id="solar" 
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={energyInputs.solarPercent}
                      onChange={(e) => setEnergyInputs(prev => ({ ...prev, solarPercent: e.target.value }))}
                      aria-label="Adjust solar percentage"
                    />
                    <div className="slider-value">{energyInputs.solarPercent}%</div>
                  </div>
                </div>
              </div>
              
              <div className="mix-visualization">
                <div 
                  className="mix-bar diesel"
                  style={{ width: `${energyInputs.dieselPercent}%` }}
                  title={`Diesel: ${energyInputs.dieselPercent}%`}
                ></div>
                <div 
                  className="mix-bar grid"
                  style={{ width: `${energyInputs.gridPercent}%` }}
                  title={`Grid: ${energyInputs.gridPercent}%`}
                ></div>
                <div 
                  className="mix-bar solar"
                  style={{ width: `${energyInputs.solarPercent}%` }}
                  title={`Solar: ${energyInputs.solarPercent}%`}
                ></div>
              </div>
            </div>

            <label htmlFor="efficiency">
              <span className="label-text">Current System Efficiency</span>
              <span className="label-hint">How well your current systems work together</span>
            </label>
            <div className="input-wrapper">
              <select 
                id="efficiency"
                value={energyInputs.currentEfficiency}
                onChange={handleEnergyChange("currentEfficiency")}
                aria-label="Select current efficiency level"
              >
                <option value="poor">Poor (Isolated systems)</option>
                <option value="medium">Medium (Basic coordination)</option>
                <option value="good">Good (Some integration)</option>
                <option value="excellent">Excellent (Well integrated)</option>
              </select>
            </div>
          </div>

          <div className="calc-results">
            <div className="savings-breakdown">
              <h5>Optimization Savings</h5>
              
              <div className="breakdown-item">
                <div className="breakdown-label">
                  <span>Current Annual Cost</span>
                  <span className="breakdown-hint">
                    {formatCurrency(parseFloat(energyInputs.monthlySpend || 0) * 12)} KSh
                  </span>
                </div>
                <div className="breakdown-value">
                  KSh {formatCurrency(parseFloat(energyInputs.monthlySpend || 0) * 12)}
                </div>
              </div>
              
              <div className="breakdown-item">
                <div className="breakdown-label">
                  <span>Target Annual Cost</span>
                  <span className="breakdown-hint">
                    After {energySavings.percent}% reduction
                  </span>
                </div>
                <div className="breakdown-value">
                  KSh {formatCurrency(parseFloat(energyInputs.monthlySpend || 0) * 12 - energySavings.annual)}
                </div>
              </div>
              
              <div className="breakdown-total highlight">
                <div className="total-label">Annual Savings</div>
                <div className="total-value">KSh {formatCurrency(energySavings.annual)}</div>
              </div>
            </div>
            
            <div className="recommendation">
              <h5>Recommended Actions</h5>
              <ul className="action-list">
                {getEnergyActions(energyInputs.targetScenario).map((action, i) => (
                  <li key={i}>
                    <span className="action-icon">✅</span>
                    <span className="action-text">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="cta-row">
              <a className="btn-neon small" href="mailto:energy-optimization@emersoneims.com?subject=Energy%20Mix%20Optimization" aria-label="Get energy optimization plan">
                Get Optimization Plan
              </a>
            </div>
          </div>
        </div>

        <div className="card facility-card">
          <div className="card-header">
            <h3>Total Facility Management ROI</h3>
            <span className="card-badge">Single Provider</span>
          </div>
          
          <div className="integration-selector">
            <p className="selector-label">Integration level:</p>
            <div className="integration-buttons">
              {Object.keys(integrationLevels).map(level => (
                <button
                  key={level}
                  onClick={() => handleIntegrationLevelSelect(level)}
                  className={`integration-btn ${facilityInputs.integrationLevel === level ? 'active' : ''}`}
                  type="button"
                  aria-label={`Select ${level} integration level`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="calc-grid">
            <label htmlFor="gen">
              <span className="label-text">Generator Systems (KSh)</span>
              <span className="label-hint">Current generator costs</span>
            </label>
            <div className="input-wrapper">
              <input 
                id="gen" 
                type="number" 
                min="0"
                max="10000000"
                step="10000"
                value={facilityInputs.generatorCost}
                onChange={handleFacilityChange("generatorCost")}
                placeholder="e.g., 2000000"
              />
              <span className="input-unit">KSh</span>
            </div>

            <label htmlFor="sol">
              <span className="label-text">Solar Systems (KSh)</span>
              <span className="label-hint">Current solar costs</span>
            </label>
            <div className="input-wrapper">
              <input 
                id="sol" 
                type="number" 
                min="0"
                max="10000000"
                step="10000"
                value={facilityInputs.solarCost}
                onChange={handleFacilityChange("solarCost")}
                placeholder="e.g., 3000000"
              />
              <span className="input-unit">KSh</span>
            </div>

            <label htmlFor="ups">
              <span className="label-text">UPS Systems (KSh)</span>
              <span className="label-hint">Current UPS costs</span>
            </label>
            <div className="input-wrapper">
              <input 
                id="ups" 
                type="number" 
                min="0"
                max="10000000"
                step="10000"
                value={facilityInputs.upsCost}
                onChange={handleFacilityChange("upsCost")}
                placeholder="e.g., 1000000"
              />
              <span className="input-unit">KSh</span>
            </div>

            <label htmlFor="mnt">
              <span className="label-text">Maintenance (KSh)</span>
              <span className="label-hint">Annual maintenance costs</span>
            </label>
            <div className="input-wrapper">
              <input 
                id="mnt" 
                type="number" 
                min="0"
                max="10000000"
                step="10000"
                value={facilityInputs.maintenanceCost}
                onChange={handleFacilityChange("maintenanceCost")}
                placeholder="e.g., 500000"
              />
              <span className="input-unit">KSh/year</span>
            </div>

            <label htmlFor="vendors">
              <span className="label-text">Current Vendors</span>
              <span className="label-hint">Number of separate providers</span>
            </label>
            <div className="input-wrapper">
              <select 
                id="vendors"
                value={facilityInputs.currentVendors}
                onChange={handleFacilityChange("currentVendors")}
                aria-label="Select number of current vendors"
              >
                <option value="1">1 vendor</option>
                <option value="2">2 vendors</option>
                <option value="3">3 vendors</option>
                <option value="4">4 vendors</option>
                <option value="5">5+ vendors</option>
              </select>
            </div>

            <label htmlFor="overhead">
              <span className="label-text">Separate Vendor Overhead (%)</span>
              <span className="label-hint">Coordination & management cost</span>
            </label>
            <div className="input-wrapper">
              <div className="percentage-control">
                <input 
                  id="overhead" 
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={facilityInputs.separateOverhead}
                  onChange={(e) => setFacilityInputs(prev => ({ ...prev, separateOverhead: e.target.value }))}
                  aria-label="Adjust separate vendor overhead"
                />
                <div className="percentage-value">{facilityInputs.separateOverhead}%</div>
              </div>
            </div>
          </div>

          <div className="calc-results">
            <div className="comparison">
              <div className="option separate">
                <div className="option-header">
                  <h5>Separate Vendors</h5>
                  <div className="option-vendors">{facilityInputs.currentVendors} providers</div>
                </div>
                <div className="option-cost">
                  KSh {formatCurrency(facilitySavings.separateTotal)}
                </div>
                <ul className="option-issues">
                  <li>Multiple contracts</li>
                  <li>Coordination overhead</li>
                  <li>Blame shifting</li>
                  <li>Response delays</li>
                </ul>
              </div>
              
              <div className="vs">→</div>
              
              <div className="option integrated">
                <div className="option-header">
                  <h5>EmersonEIMS Integrated</h5>
                  <div className="option-level">{facilityInputs.integrationLevel}</div>
                </div>
                <div className="option-cost">
                  KSh {formatCurrency(facilitySavings.integratedTotal)}
                </div>
                <ul className="option-benefits">
                  <li>Single point of contact</li>
                  <li>Optimized systems</li>
                  <li>Predictive maintenance</li>
                  <li>Guaranteed uptime</li>
                </ul>
              </div>
            </div>
            
            <div className="savings-display">
              <div className="savings-card">
                <div className="savings-label">Annual Savings</div>
                <div className="savings-value">KSh {formatCurrency(facilitySavings.savings)}</div>
                <div className="savings-percent">{facilitySavings.percent}% reduction</div>
              </div>
              
              <div className="benefits-summary">
                <h6>Additional Benefits</h6>
                <div className="benefits-grid">
                  <div className="benefit-item">
                    <div className="benefit-icon">⏱️</div>
                    <div className="benefit-text">Faster response</div>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon">📊</div>
                    <div className="benefit-text">Unified reporting</div>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon">🎯</div>
                    <div className="benefit-text">Performance guarantees</div>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon">🔒</div>
                    <div className="benefit-text">Single SLA</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="cta-row">
              <a className="btn-neon small" href="tel:0768860655" aria-label="Call to consolidate services">
                Consolidate Now
              </a>
            </div>
          </div>
        </div>

        <div className="card financing-card">
          <div className="card-header">
            <h3>Intelligent Financing Options</h3>
            <span className="card-badge">Cash Flow Optimized</span>
          </div>
          
          <div className="financing-selector">
            <p className="selector-label">Preferred financing type:</p>
            <div className="financing-buttons">
              {['cash', 'lease', 'ppa'].map(type => (
                <button
                  key={type}
                  onClick={() => handleFinancingTypeSelect(type)}
                  className={`financing-btn ${financingInputs.financingType === type ? 'active' : ''}`}
                  type="button"
                  aria-label={`Select ${type} financing`}
                >
                  {type.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          
          <div className="calc-grid">
            <label htmlFor="cash">
              <span className="label-text">Cash Purchase (KSh)</span>
              <span className="label-hint">Total system cost</span>
            </label>
            <div className="input-wrapper">
              <input 
                id="cash" 
                type="number" 
                min="0"
                max="100000000"
                step="10000"
                value={financingInputs.cashPurchase}
                onChange={handleFinancingChange("cashPurchase")}
                placeholder="e.g., 5000000"
              />
              <span className="input-unit">KSh</span>
            </div>

            <div className="lease-inputs">
              <div className="input-group">
                <label htmlFor="lease">Lease (KSh/month)</label>
                <input 
                  id="lease"
                  type="number"
                  min="0"
                  max="1000000"
                  step="1000"
                  value={financingInputs.leaseMonthly}
                  onChange={handleFinancingChange("leaseMonthly")}
                  placeholder="e.g., 150000"
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="term">Lease Term (months)</label>
                <select 
                  id="term"
                  value={financingInputs.leaseTerm}
                  onChange={handleFinancingChange("leaseTerm")}
                  className="small-select"
                  aria-label="Select lease term"
                >
                  <option value="24">24 months</option>
                  <option value="36">36 months</option>
                  <option value="48">48 months</option>
                  <option value="60">60 months</option>
                  <option value="84">84 months</option>
                </select>
              </div>
              
              <div className="input-group">
                <label htmlFor="rate">Interest Rate (%)</label>
                <div className="percentage-control small">
                  <input 
                    id="rate"
                    type="range"
                    min="8"
                    max="20"
                    step="0.5"
                    value={financingInputs.leaseRate}
                    onChange={(e) => setFinancingInputs(prev => ({ ...prev, leaseRate: e.target.value }))}
                    aria-label="Adjust lease interest rate"
                  />
                  <div className="percentage-value">{financingInputs.leaseRate}%</div>
                </div>
              </div>
            </div>

            <div className="ppa-inputs">
              <div className="input-group">
                <label htmlFor="ppar">PPA Rate (KSh/kWh)</label>
                <input 
                  id="ppar"
                  type="number"
                  min="0"
                  max="50"
                  step="0.5"
                  value={financingInputs.ppaRate}
                  onChange={handleFinancingChange("ppaRate")}
                  placeholder="e.g., 12"
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="ppak">Monthly Energy (kWh)</label>
                <input 
                  id="ppak"
                  type="number"
                  min="0"
                  max="100000"
                  step="100"
                  value={financingInputs.ppaMonthlyKwh}
                  onChange={handleFinancingChange("ppaMonthlyKwh")}
                  placeholder="e.g., 10000"
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="ppat">PPA Term (months)</label>
                <select 
                  id="ppat"
                  value={financingInputs.ppaTerm}
                  onChange={handleFinancingChange("ppaTerm")}
                  className="small-select"
                  aria-label="Select PPA term"
                >
                  <option value="60">60 months (5 years)</option>
                  <option value="84">84 months (7 years)</option>
                  <option value="120">120 months (10 years)</option>
                  <option value="180">180 months (15 years)</option>
                </select>
              </div>
            </div>

            <label htmlFor="tax">
              <span className="label-text">Corporate Tax Rate (%)</span>
              <span className="label-hint">For tax benefit calculations</span>
            </label>
            <div className="input-wrapper">
              <div className="percentage-control">
                <input 
                  id="tax" 
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={financingInputs.taxRate}
                  onChange={(e) => setFinancingInputs(prev => ({ ...prev, taxRate: e.target.value }))}
                  aria-label="Adjust corporate tax rate"
                />
                <div className="percentage-value">{financingInputs.taxRate}%</div>
              </div>
            </div>
          </div>

          <div className="calc-results">
            <div className="financing-comparison">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Option</th>
                    <th>Total Cost</th>
                    <th>Net Cost*</th>
                    <th>Monthly</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={financingInputs.financingType === 'cash' ? 'selected' : ''}>
                    <td>
                      <div className="option-name">
                        <div className="option-icon">💵</div>
                        <div>Cash Purchase</div>
                      </div>
                    </td>
                    <td>KSh {formatCurrency(financingComparison.cash.total)}</td>
                    <td>KSh {formatCurrency(financingComparison.cash.net)}</td>
                    <td>One-time</td>
                  </tr>
                  
                  <tr className={financingInputs.financingType === 'lease' ? 'selected' : ''}>
                    <td>
                      <div className="option-name">
                        <div className="option-icon">📝</div>
                        <div>Equipment Lease</div>
                      </div>
                    </td>
                    <td>KSh {formatCurrency(financingComparison.lease.total)}</td>
                    <td>KSh {formatCurrency(financingComparison.lease.net)}</td>
                    <td>KSh {formatCurrency(financingComparison.lease.monthly)}</td>
                  </tr>
                  
                  <tr className={financingInputs.financingType === 'ppa' ? 'selected' : ''}>
                    <td>
                      <div className="option-name">
                        <div className="option-icon">⚡</div>
                        <div>Power Purchase Agreement</div>
                      </div>
                    </td>
                    <td>KSh {formatCurrency(financingComparison.ppa.total)}</td>
                    <td>KSh {formatCurrency(financingComparison.ppa.net)}</td>
                    <td>KSh {formatCurrency(financingComparison.ppa.monthly)}</td>
                  </tr>
                </tbody>
              </table>
              <div className="table-note">
                *Net cost includes {financingInputs.taxRate}% tax benefits
              </div>
            </div>
            
            <div className="recommendation-box">
              <div className="recommendation-icon">
                {financingInputs.financingType === 'cash' && '🏆'}
                {financingInputs.financingType === 'lease' && '📈'}
                {financingInputs.financingType === 'ppa' && '🌱'}
              </div>
              <div className="recommendation-content">
                <h6>{getFinancingRecommendation(financingInputs.financingType).title}</h6>
                <p>{getFinancingRecommendation(financingInputs.financingType).description}</p>
              </div>
            </div>
            
            <div className="cta-row">
              <a className="btn-neon small" href="mailto:finance@emersoneims.com?subject=Financing%20Options" aria-label="Discuss financing options">
                Discuss Financing
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="platform-features">
        <h3>Platform Features & Benefits</h3>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <div className="feature-content">
              <h4>Predictive Optimization</h4>
              <p>AI-driven recommendations based on usage patterns and weather forecasts.</p>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <div className="feature-content">
              <h4>Unified Dashboard</h4>
              <p>Single dashboard for all energy, equipment, and maintenance data.</p>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <div className="feature-content">
              <h4>Risk Management</h4>
              <p>Proactive risk identification and mitigation strategies.</p>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <div className="feature-content">
              <h4>Mobile Access</h4>
              <p>Real-time monitoring and control from any device.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-row centered">
        <a className="btn-neon large" href="mailto:optimization@emersoneims.com?subject=Cross-Service%20Optimization" aria-label="Request optimization consultation">
          🎯 Request Optimization Consultation
        </a>
      </div>
    </section>
  );
}

function getEnergyActions(scenario) {
  const actions = {
    diesel: [
      "Add solar hybrid controllers",
      "Optimize generator loading",
      "Implement load scheduling"
    ],
    balanced: [
      "Install solar + storage",
      "Smart grid integration",
      "Demand response systems"
    ],
    green: [
      "Expand solar capacity",
      "Energy storage systems",
      "Advanced energy management"
    ],
    maximum: [
      "Maximize solar generation",
      "Grid independence systems",
      "AI-powered optimization"
    ]
  };
  return actions[scenario] || actions.balanced;
}

function getFinancingRecommendation(type) {
  const recommendations = {
    cash: {
      title: "Cash Purchase Recommended",
      description: "Best for organizations with available capital and seeking maximum long-term savings."
    },
    lease: {
      title: "Lease Financing Recommended",
      description: "Ideal for preserving capital while benefiting from tax deductions and predictable payments."
    },
    ppa: {
      title: "PPA Recommended",
      description: "Perfect for avoiding upfront costs while locking in energy rates and benefiting from operational savings."
    }
  };
  return recommendations[type] || recommendations.lease;
}