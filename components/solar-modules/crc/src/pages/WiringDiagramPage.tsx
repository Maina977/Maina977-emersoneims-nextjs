import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { WiringDiagramAI } from '../../components/design/WiringDiagramAI';
import { useSolarStore } from '../services/store';

const Wrap = styled.div`
  background: #0A0E27;
  min-height: 100vh;
  padding: 1rem;
`;
const Banner = styled.div`
  background: rgba(42,48,80,0.7);
  border: 1px dashed rgba(0,217,255,0.4);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  color: rgba(255,255,255,0.8);
  margin: 2rem auto;
  max-width: 720px;
`;
const Status = styled.div`
  background: rgba(0,217,255,0.08);
  border: 1px solid rgba(0,217,255,0.25);
  border-radius: 8px;
  padding: 0.6rem 0.9rem;
  color: #E6F1FF;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.78rem;
  margin-bottom: 0.75rem;
`;
const Btn = styled.button`
  margin-top: 1rem;
  background: linear-gradient(135deg,#00D9FF,#0099CC);
  color: #fff;
  border: none;
  padding: 0.7rem 1.4rem;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
`;

const WiringDiagramPage: React.FC = () => {
  const metrics = useSolarStore(s => s.metrics);
  const design = useSolarStore(s => s.design);
  const loadProject = useSolarStore(s => s.loadProject);
  const nav = useNavigate();

  useEffect(() => { loadProject(); }, [loadProject]);

  if (metrics.systemSizeKw <= 0 || metrics.panelCount === 0) {
    return (
      <Wrap>
        <Banner>
          <h2 style={{ color: '#00D9FF', marginTop: 0 }}>Wiring Diagram</h2>
          <p>The single-line diagram is generated from your real designed system. Run the Calculator first.</p>
          <Btn onClick={() => nav('/calculator')}>Open Calculator</Btn>
        </Banner>
      </Wrap>
    );
  }

  // Build inverter / battery descriptors from store, with sensible defaults.
  const invMake = design.inverterMake || 'Generic';
  const invModel = design.inverterModel || `${invMake} ${(design.inverterKw || metrics.systemSizeKw * 0.9).toFixed(1)}kW Hybrid`;
  const battMake = design.batteryMake || 'Generic';
  const battModel = design.batteryModel || `${battMake} LFP ${(design.batteryKwh || 0).toFixed(1)}kWh`;
  const battVoltage = 48; // Standard residential/commercial bus voltage

  return (
    <Wrap>
      <Status>
        System: {metrics.systemSizeKw.toFixed(2)} kW · {metrics.panelCount} × {design.panelW || 580}W
        · Inverter: {invModel} · Battery: {battModel}
      </Status>
      <WiringDiagramAI
        systemSize={metrics.systemSizeKw}
        panels={[{ count: metrics.panelCount, wattage: design.panelW || 580 }]}
        inverter={{
          model: invModel,
          ratedPower: (design.inverterKw || metrics.systemSizeKw * 0.9) * 1000
        }}
        battery={design.batteryKwh > 0 ? {
          model: battModel,
          capacity: design.batteryKwh,
          voltage: battVoltage
        } : undefined}
        isPaid={true}
      />
    </Wrap>
  );
};

export default WiringDiagramPage;
