// components/services/SolarEnergy.jsx
import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { gsap } from "gsap";
import OptimizedImage from "@/components/media/OptimizedImage";

export default function SolarEnergy({ performanceTier }) {
  const root = useRef(null);
  const [inputs, setInputs] = useState({ bill: "", cost: "", roofArea: "" });
  const [calculatedData, setCalculatedData] = useState({ 
    paybackYears: 0, 
    dailyGen: 0,
    systemSize: 0,
    annualSavings: 0
  });

  const efficiency = 0.18;
  const sunHours = 5.5;
  const panelCapacity = 450;
  const panelArea = 2.0;

  const paybackYears = useMemo(() => {
    const monthlyBill = parseFloat(inputs.bill) || 0;
    const systemCost = parseFloat(inputs.cost) || 0;
    const monthlySavings = monthlyBill * 0.65;
    
    if (systemCost <= 0 || monthlySavings <= 0) return 0;
    
    const years = systemCost / (monthlySavings * 12);
    return Math.max(0, Math.min(50, +(years).toFixed(1)));
  }, [inputs.bill, inputs.cost]);

  const dailyGen = useMemo(() => {
    const area = parseFloat(inputs.roofArea) || 0;
    if (area <= 0) return 0;
    
    const generation = area * efficiency * sunHours;
    const systemSize = (area / panelArea) * panelCapacity;
    const annualSavings = (generation * 365 * 0.85 * 22);
    
    setCalculatedData(prev => ({
      ...prev,
      dailyGen: generation,
      systemSize: Math.round(systemSize),
      annualSavings: Math.round(annualSavings)
    }));
    
    return Math.max(0, +(generation).toFixed(1));
  }, [inputs.roofArea]);

  useEffect(() => {
    if (!root.current || performanceTier === 'low') return;
    
    const ctx = gsap.context(() => {
      if (performanceTier !== 'low') {
        gsap.fromTo(".solar-title",
          { opacity: 0, y: 50, rotationX: 15 },
          { 
            opacity: 1, 
            y: 0, 
            rotationX: 0,
            duration: 1.4, 
            ease: "power3.out",
            delay: 0.2
          }
        );
      }

      if (performanceTier === 'high') {
        gsap.fromTo(".service-description",
          { opacity: 0 },
          { opacity: 1, duration: 1, delay: 0.4 }
        );
        
        gsap.fromTo(".bullets li",
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            delay: 0.6
          }
        );
      }
    }, root);
    
    return () => ctx.revert();
  }, [performanceTier]);

  const handleInputChange = useCallback((field) => (e) => {
    const value = e.target.value;
    if (value && (parseFloat(value) < 0 || isNaN(parseFloat(value)))) return;
    setInputs(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleExample = useCallback((type) => {
    const examples = {
      residential: { bill: "15000", cost: "800000", roofArea: "50" },
      commercial: { bill: "250000", cost: "4000000", roofArea: "300" },
      industrial: { bill: "1000000", cost: "15000000", roofArea: "1000" }
    };
    setInputs(examples[type]);
  }, []);

  const formatNumber = useCallback((num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  }, []);

  return (
    <section className="service service--solar section-pad" aria-labelledby="solar-heading" ref={root}>
      <div className="grid-two">
        <div>
          <h2 id="solar-heading" className="solar-title">
            <span className="title-icon">☀️</span>
            Solar Energy Solutions
          </h2>
          <p className="service-description">
            Grid‑tied, hybrid, and off‑grid — built for Kenya's <strong>5.5 kWh/m²/day</strong> irradiance. 
            ROI within <strong>2.8–4.5 years</strong>, tax relief up to <strong>30%</strong>, 
            <strong> 25-year</strong> panel warranties.
          </p>
          <ul className="bullets" aria-label="Solar solutions">
            <li><strong>Residential:</strong> 3–20kW net‑metered with battery backup</li>
            <li><strong>Commercial:</strong> 50kW–1MW rooftop/carport systems</li>
            <li><strong>Industrial:</strong> Solar‑diesel hybrids with smart controllers</li>
            <li><strong>Storage:</strong> Lithium-ion with 10‑year performance warranties</li>
            <li><strong>Monitoring:</strong> Real-time IoT tracking with mobile alerts</li>
          </ul>
          <div className="cta-row">
            <a className="btn-neon" href="mailto:solar@emersoneims.com?subject=Solar%20Assessment" aria-label="Request solar assessment">
              <span className="btn-icon">📊</span>
              Request Free Assessment
            </a>
            <a className="btn-neon" href="tel:0782914717" aria-label="Call solar engineer at 0782 914 717">
              <span className="btn-icon">👨‍🔧</span>
              Solar Engineer: 0782 914 717
            </a>
          </div>
        </div>
        <figure aria-labelledby="solar-caption">
          <OptimizedImage 
            src="https://www.emersoneims.com/wp-content/uploads/2025/11/solar-for-a-home-scaled.png" 
            alt="Modern residential solar installation with rooftop panels and battery storage" 
            width={600}
            height={400}
            hollywoodGrading={true}
          />
          <figcaption id="solar-caption">Complete solar solutions — from residential rooftops to industrial-scale installations.</figcaption>
        </figure>
      </div>

      <div className="example-selector">
        <p className="example-label">Quick examples:</p>
        <div className="example-buttons">
          <button 
            onClick={() => handleExample('residential')}
            className="btn-example-type"
            type="button"
            aria-label="Load residential example"
          >
            🏠 Residential
          </button>
          <button 
            onClick={() => handleExample('commercial')}
            className="btn-example-type"
            type="button"
            aria-label="Load commercial example"
          >
            🏢 Commercial
          </button>
          <button 
            onClick={() => handleExample('industrial')}
            className="btn-example-type"
            type="button"
            aria-label="Load industrial example"
          >
            🏭 Industrial
          </button>
        </div>
      </div>

      <div className="calculators-grid">
        <div className="calculator-wrap">
          <h3>Solar Payback Calculator</h3>
          <div className="calc-grid" role="form">
            <label htmlFor="bill">
              <span className="label-text">Current Monthly Bill (KSh)</span>
              <span className="label-hint">Your average electricity bill</span>
            </label>
            <div className="input-wrapper">
              <input 
                id="bill" 
                type="number" 
                min="0"
                max="10000000"
                step="1000"
                value={inputs.bill}
                onChange={handleInputChange("bill")}
                placeholder="e.g., 50000"
                aria-describedby="bill-help"
              />
              <span className="input-unit">KSh</span>
            </div>

            <label htmlFor="cost">
              <span className="label-text">System Cost (KSh)</span>
              <span className="label-hint">Estimated installation cost</span>
            </label>
            <div className="input-wrapper">
              <input 
                id="cost" 
                type="number" 
                min="0"
                max="50000000"
                step="10000"
                value={inputs.cost}
                onChange={handleInputChange("cost")}
                placeholder="e.g., 1000000"
                aria-describedby="cost-help"
              />
              <span className="input-unit">KSh</span>
            </div>
          </div>
          
          <div className="calc-results">
            <div className="result-card">
              <div className="result-label">Payback Period</div>
              <div className={`result-value ${paybackYears <= 4 ? 'positive' : paybackYears <= 7 ? 'medium' : 'high'}`}>
                {paybackYears > 0 ? `${paybackYears} years` : 'Enter values'}
              </div>
              <div className="result-note">
                {paybackYears > 0 && paybackYears <= 4 && 'Excellent ROI'}
                {paybackYears > 4 && paybackYears <= 7 && 'Good investment'}
                {paybackYears > 7 && paybackYears <= 10 && 'Consider incentives'}
                {paybackYears > 10 && 'Review system sizing'}
              </div>
            </div>
            
            {paybackYears > 0 && (
              <div className="result-details">
                <div className="detail-item">
                  <span className="detail-label">Monthly Savings:</span>
                  <span className="detail-value">KSh {formatNumber(Math.round(parseFloat(inputs.bill || 0) * 0.65))}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Annual Savings:</span>
                  <span className="detail-value">KSh {formatNumber(Math.round(parseFloat(inputs.bill || 0) * 0.65 * 12))}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">20-Year Savings:</span>
                  <span className="detail-value">KSh {formatNumber(Math.round(parseFloat(inputs.bill || 0) * 0.65 * 12 * 20))}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="calculator-wrap">
          <h3>Roof Utilization Analysis</h3>
          <div className="calc-grid" role="form">
            <label htmlFor="roof">
              <span className="label-text">Available Roof Area (m²)</span>
              <span className="label-hint">South-facing area is best</span>
            </label>
            <div className="input-wrapper">
              <input 
                id="roof" 
                type="number" 
                min="0"
                max="10000"
                step="1"
                value={inputs.roofArea}
                onChange={handleInputChange("roofArea")}
                placeholder="e.g., 100"
                aria-describedby="roof-help"
              />
              <span className="input-unit">m²</span>
            </div>
            
            <div className="input-info">
              <div className="info-item">
                <span className="info-label">Panel Efficiency:</span>
                <span className="info-value">{efficiency * 100}%</span>
              </div>
              <div className="info-item">
                <span className="info-label">Daily Sun Hours:</span>
                <span className="info-value">{sunHours} hrs</span>
              </div>
            </div>
          </div>
          
          <div className="calc-results">
            <div className="result-card">
              <div className="result-label">Daily Generation</div>
              <div className="result-value">{dailyGen > 0 ? `${dailyGen} kWh` : '--'}</div>
              <div className="result-note">From available roof area</div>
            </div>
            
            {dailyGen > 0 && (
              <>
                <div className="result-details">
                  <div className="detail-item">
                    <span className="detail-label">System Size:</span>
                    <span className="detail-value">{calculatedData.systemSize} W</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Annual Generation:</span>
                    <span className="detail-value">{formatNumber(Math.round(dailyGen * 365))} kWh</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Annual Savings:</span>
                    <span className="detail-value">KSh {formatNumber(calculatedData.annualSavings)}</span>
                  </div>
                </div>
                
                <div className="system-breakdown">
                  <h4>System Components</h4>
                  <div className="components-grid">
                    <div className="component">
                      <div className="component-icon">🔋</div>
                      <div className="component-info">
                        <div className="component-name">Panels</div>
                        <div className="component-detail">{Math.round(calculatedData.systemSize / 450)} × 450W</div>
                      </div>
                    </div>
                    <div className="component">
                      <div className="component-icon">⚡</div>
                      <div className="component-info">
                        <div className="component-name">Inverter</div>
                        <div className="component-detail">{Math.round(calculatedData.systemSize * 1.2)} W</div>
                      </div>
                    </div>
                    <div className="component">
                      <div className="component-icon">📊</div>
                      <div className="component-info">
                        <div className="component-name">Monitoring</div>
                        <div className="component-detail">IoT enabled</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="incentives-section">
        <h3>Available Incentives & Financing</h3>
        <div className="incentives-grid">
          <div className="incentive-card">
            <div className="incentive-icon">🏛️</div>
            <div className="incentive-content">
              <h4>Tax Relief</h4>
              <p>Up to 30% investment deduction under Kenyan tax laws for commercial installations.</p>
            </div>
          </div>
          <div className="incentive-card">
            <div className="incentive-icon">🔋</div>
            <div className="incentive-content">
              <h4>Net Metering</h4>
              <p>Sell excess power back to the grid with approved net metering agreements.</p>
            </div>
          </div>
          <div className="incentive-card">
            <div className="incentive-icon">💰</div>
            <div className="incentive-content">
              <h4>Financing Options</h4>
              <p>Lease-to-own, PPA, and bank financing with 3–7 year terms available.</p>
            </div>
          </div>
        </div>
        
        <div className="cta-row centered">
          <a className="btn-neon large" href="mailto:finance@emersoneims.com?subject=Solar%20Financing" aria-label="Discuss financing options">
            💬 Discuss Financing Options
          </a>
        </div>
      </div>
    </section>
  );
}