// components/services/DieselGenerators.jsx
import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { gsap } from "gsap";

export default function DieselGenerators({ performanceTier }) {
  const root = useRef(null);
  const [inputs, setInputs] = useState({ area: "", density: "", factor: 1.25 });
  const [calculatedData, setCalculatedData] = useState({ kVA: 0, dieselCost: 0, maintenance: 0, resale: 0 });

  const densityDefault = 60;
  const glow = useMemo(() => {
    const levels = { low: 0.2, medium: 0.4, high: 0.8 };
    return levels[performanceTier] || 0.6;
  }, [performanceTier]);

  const kVARequirement = useMemo(() => {
    const area = parseFloat(inputs.area) || 0;
    const density = parseFloat(inputs.density) || densityDefault;
    const factor = parseFloat(inputs.factor) || 1.25;
    if (area <= 0) return 0;
    
    const kW = (area * density * factor) / 1000;
    const kVA = Math.max(0, Math.round(kW / 0.8));
    
    setCalculatedData(prev => ({
      ...prev,
      kVA,
      dieselCost: kVA * 8 * 30,
      maintenance: kVA * 1500,
      resale: kVA * 12000 * 0.3
    }));
    
    return kVA;
  }, [inputs.area, inputs.density, inputs.factor]);

  const tco5y = useMemo(() => {
    const { dieselCost, maintenance, resale } = calculatedData;
    const initialCost = calculatedData.kVA * 12000;
    return initialCost + (dieselCost * 60) + (maintenance * 5) - resale;
  }, [calculatedData]);

  useEffect(() => {
    if (!root.current || performanceTier === 'low') return;
    
    const ctx = gsap.context(() => {
      if (performanceTier !== 'low') {
        gsap.fromTo(".dg-title",
          { opacity: 0, y: 40, scale: 0.95 },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            duration: 1.2, 
            ease: "back.out(1.7)",
            delay: 0.1
          }
        );
      }

      if (performanceTier === 'high') {
        gsap.to(".dg-hero", {
          boxShadow: `0 0 40px rgba(0,255,255,${glow})`,
          repeat: -1,
          yoyo: true,
          duration: 3,
          ease: "sine.inOut",
        });
        
        gsap.fromTo(".bullets li",
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "power2.out",
            delay: 0.5
          }
        );
      }
    }, root);
    
    return () => ctx.revert();
  }, [performanceTier, glow]);

  const handleInputChange = useCallback((field) => (e) => {
    const value = e.target.value;
    if (field === 'area' || field === 'density') {
      const num = parseFloat(value);
      if (value && (num < 0 || isNaN(num))) return;
    }
    if (field === 'factor') {
      const num = parseFloat(value);
      if (value && (num < 1 || num > 3 || isNaN(num))) return;
    }
    setInputs(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleExample = useCallback(() => {
    setInputs({ area: "500", density: "80", factor: "1.35" });
  }, []);

  const handleReset = useCallback(() => {
    setInputs({ area: "", density: "", factor: 1.25 });
  }, []);

  return (
    <section className="service service--diesel section-pad" aria-labelledby="dg-heading" ref={root}>
      <div className="grid-two">
        <div>
          <h2 id="dg-heading" className="dg-title">
            <span className="title-icon">⚡</span>
            Diesel Generators (10–2000 kVA)
          </h2>
          <p className="service-description">
            Official partners: Cummins, Perkins, FG Wilson. AMF panels, IoT monitoring, 
            <strong> 18% fuel optimization</strong>, <strong>98.7% uptime</strong> on maintained units.
          </p>
          <ul className="bullets" aria-label="Generator services">
            <li><strong>Sales:</strong> Silent, open, containerized</li>
            <li><strong>Rentals:</strong> 24/7 emergency power</li>
            <li><strong>Install:</strong> Civil, fuel, exhaust, acoustics</li>
            <li><strong>Maintain:</strong> Preventive, load bank, remote</li>
            <li><strong>Repair:</strong> 4‑hour response SLA</li>
          </ul>
          <div className="cta-row">
            <a className="btn-neon" href="tel:0768860655" aria-label="Call sales at 0768 860 655">
              <span className="btn-icon">📞</span>
              Call Sales: 0768 860 655
            </a>
            <a className="btn-neon" href="mailto:info@emersoneims.com?subject=Generator%20Inquiry" aria-label="Email sales">
              <span className="btn-icon">✉️</span>
              Email Sales
            </a>
          </div>
        </div>
        <figure className="dg-hero" aria-labelledby="dg-caption">
          <img 
            src="https://www.emersoneims.com/wp-content/uploads/2025/11/GEN-2-1.png" 
            alt="EmersonEIMS diesel generator lineup including Cummins, Perkins, and FG Wilson models" 
            loading="lazy"
            width="600"
            height="400"
          />
          <figcaption id="dg-caption">OEM-grade power solutions, delivered and maintained across East Africa.</figcaption>
        </figure>
      </div>

      <div className="calculator-wrap" aria-labelledby="dg-calc-heading">
        <div className="calculator-header">
          <h3 id="dg-calc-heading">Generator Sizing Calculator</h3>
          <div className="calculator-actions">
            <button 
              onClick={handleExample}
              className="btn-example"
              type="button"
              aria-label="Load example values"
            >
              Load Example
            </button>
            <button 
              onClick={handleReset}
              className="btn-reset"
              type="button"
              aria-label="Reset calculator"
            >
              Reset
            </button>
          </div>
        </div>
        
        <div className="calc-grid" role="form" aria-label="Generator sizing inputs">
          <label htmlFor="dg-area">
            <span className="label-text">Building Size (m²)</span>
            <span className="label-hint">e.g., 500 for medium office</span>
          </label>
          <div className="input-wrapper">
            <input 
              id="dg-area" 
              type="number" 
              min="0"
              max="100000"
              step="1"
              value={inputs.area}
              onChange={handleInputChange("area")}
              placeholder="Enter area in square meters"
              aria-describedby="area-help"
            />
            <span className="input-unit">m²</span>
          </div>

          <label htmlFor="dg-density">
            <span className="label-text">Power Density (W/m²)</span>
            <span className="label-hint">Default: 60 W/m² for offices</span>
          </label>
          <div className="input-wrapper">
            <input 
              id="dg-density" 
              type="number" 
              min="1"
              max="500"
              step="1"
              value={inputs.density}
              onChange={handleInputChange("density")}
              placeholder="Power per square meter"
              aria-describedby="density-help"
            />
            <span className="input-unit">W/m²</span>
          </div>

          <label htmlFor="dg-factor">
            <span className="label-text">Safety Factor</span>
            <span className="label-hint">1.0–3.0 (1.25 recommended)</span>
          </label>
          <div className="input-wrapper">
            <input 
              id="dg-factor" 
              type="number" 
              step="0.05"
              min="1"
              max="3"
              value={inputs.factor}
              onChange={handleInputChange("factor")}
              aria-describedby="factor-help"
            />
            <div className="factor-slider">
              <input 
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={inputs.factor}
                onChange={(e) => setInputs(prev => ({ ...prev, factor: e.target.value }))}
                aria-label="Adjust safety factor"
              />
            </div>
          </div>
        </div>
        
        <div className="calc-results" role="region" aria-live="polite">
          <div className="result-card primary">
            <div className="result-label">Recommended Generator Size</div>
            <div className="result-value">{kVARequirement} kVA</div>
            <div className="result-note">Based on your inputs and 0.8 power factor</div>
          </div>
          
          {kVARequirement > 0 && (
            <div className="result-details">
              <div className="detail-item">
                <span className="detail-label">Approx. Load:</span>
                <span className="detail-value">{Math.round(kVARequirement * 0.8)} kW</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Typical Cost:</span>
                <span className="detail-value">KSh {(kVARequirement * 12000).toLocaleString()}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Monthly Fuel:</span>
                <span className="detail-value">~KSh {Math.round(kVARequirement * 240).toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="calc-help" id="area-help">
          <p>For residential: 50-100 W/m² | Office: 60-100 W/m² | Industrial: 100-300 W/m²</p>
        </div>
      </div>

      <div className="tco-card" role="complementary" aria-label="5-year total cost analysis">
        <div className="tco-header">
          <h3>5‑Year Total Cost of Ownership</h3>
          <span className="tco-badge">Example Calculation</span>
        </div>
        
        <div className="tco-breakdown">
          <div className="breakdown-item">
            <div className="breakdown-label">Initial Investment</div>
            <div className="breakdown-value">KSh {(calculatedData.kVA * 12000).toLocaleString()}</div>
            <div className="breakdown-bar" style={{ width: '30%' }}></div>
          </div>
          <div className="breakdown-item">
            <div className="breakdown-label">Diesel Fuel (5 years)</div>
            <div className="breakdown-value">KSh {(calculatedData.dieselCost * 60).toLocaleString()}</div>
            <div className="breakdown-bar" style={{ width: '50%' }}></div>
          </div>
          <div className="breakdown-item">
            <div className="breakdown-label">Maintenance (5 years)</div>
            <div className="breakdown-value">KSh {(calculatedData.maintenance * 5).toLocaleString()}</div>
            <div className="breakdown-bar" style={{ width: '15%' }}></div>
          </div>
          <div className="breakdown-item positive">
            <div className="breakdown-label">Resale Value</div>
            <div className="breakdown-value">- KSh {calculatedData.resale.toLocaleString()}</div>
            <div className="breakdown-bar" style={{ width: '5%' }}></div>
          </div>
        </div>
        
        <div className="tco-total">
          <div className="total-label">Total 5-Year Cost</div>
          <div className="total-value">KSh {tco5y.toLocaleString()}</div>
        </div>
        
        <p className="tco-note">
          Based on {calculatedData.kVA || 150}kVA Cummins generator. 
          <button 
            onClick={() => alert('Contact us for a detailed TCO analysis with your specific requirements.')}
            className="btn-text"
            type="button"
          >
            Request detailed TCO analysis
          </button>
        </p>
      </div>
    </section>
  );
}