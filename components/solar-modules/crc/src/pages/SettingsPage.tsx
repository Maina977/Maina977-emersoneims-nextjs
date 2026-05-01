import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiSave, FiRotateCcw, FiCheck } from 'react-icons/fi';
import { useSolarStore } from '../services/store';

/**
 * SettingsPage — bound to the project store. Persists via saveProject() to
 * localStorage so units, currency, theme, tariff, brand info survive reloads.
 */

const Wrap = styled.div`
  background: #0A0E27;
  min-height: 100vh;
  padding: 2rem;
  color: #E6F1FF;
  @media (max-width: 768px) { padding: 1rem; }
`;
const Title = styled.h1`
  background: linear-gradient(135deg,#00D9FF,#FF006E);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 0.5rem;
  font-size: clamp(1.4rem, 5vw, 2rem);
`;
const Sub = styled.p`
  color: rgba(255,255,255,0.65);
  margin: 0 0 2rem;
`;
const Card = styled(motion.section)`
  background: rgba(42,48,80,0.8);
  border: 1px solid rgba(0,217,255,0.25);
  border-radius: 14px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  & h2 { color: #00D9FF; margin: 0 0 1rem; font-size: 1.1rem; }
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
`;
const Field = styled.label`
  display: flex; flex-direction: column; gap: 4px;
  font-size: 0.75rem;
  color: rgba(230,241,255,0.65);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  & input, & select {
    background: rgba(5,8,24,0.6);
    border: 1px solid rgba(0,217,255,0.3);
    border-radius: 6px;
    color: #E6F1FF;
    padding: 0.55rem 0.7rem;
    font-size: 0.95rem;
  }
`;
const Toggle = styled.label`
  display: flex; align-items: center; justify-content: space-between;
  background: rgba(5,8,24,0.4);
  border: 1px solid rgba(0,217,255,0.2);
  border-radius: 8px;
  padding: 0.6rem 0.9rem;
  cursor: pointer;
  font-size: 0.9rem;
  & input { width: 18px; height: 18px; cursor: pointer; }
`;
const Btn = styled.button<{ $variant?: 'primary'|'ghost' }>`
  background: ${p => p.$variant === 'ghost' ? 'transparent' : 'linear-gradient(135deg,#00D9FF,#0099CC)'};
  color: ${p => p.$variant === 'ghost' ? '#E6F1FF' : '#0A0E27'};
  border: ${p => p.$variant === 'ghost' ? '1px solid rgba(0,217,255,0.35)' : 'none'};
  padding: 0.85rem 1.5rem;
  border-radius: 10px;
  font-weight: 700;
  display: inline-flex; align-items: center; gap: 0.5rem;
  cursor: pointer;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;
const Saved = styled(motion.div)`
  background: rgba(0,255,136,0.1);
  border: 1px solid rgba(0,255,136,0.4);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: #00FF88;
  display: flex; align-items: center; gap: 0.55rem;
  margin-bottom: 1rem;
`;

const SettingsPage: React.FC = () => {
  const settings = useSolarStore(s => s.settings);
  const brand = useSolarStore(s => s.brand);
  const site = useSolarStore(s => s.site);
  const updateSettings = useSolarStore(s => s.updateSettings);
  const updateBrand = useSolarStore(s => s.updateBrand);
  const updateSite = useSolarStore(s => s.updateSite);
  const saveProject = useSolarStore(s => s.saveProject);
  const loadProject = useSolarStore(s => s.loadProject);
  const resetProject = useSolarStore(s => s.resetProject);

  const [savedFlag, setSavedFlag] = useState(false);
  const [tariff, setTariff] = useState<number>(site.tariffKesPerKwh);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => { loadProject(); }, [loadProject]);
  useEffect(() => { setTariff(site.tariffKesPerKwh); }, [site.tariffKesPerKwh]);

  function handleSave() {
    if (tariff !== site.tariffKesPerKwh) updateSite({ tariffKesPerKwh: tariff });
    saveProject();
    setSavedFlag(true);
    setTimeout(() => setSavedFlag(false), 2500);
  }

  function handleReset() {
    if (!confirmReset) { setConfirmReset(true); setTimeout(() => setConfirmReset(false), 4000); return; }
    resetProject();
    setConfirmReset(false);
    setSavedFlag(true);
    setTimeout(() => setSavedFlag(false), 2500);
  }

  return (
    <Wrap>
      <Title>⚙️ Settings</Title>
      <Sub>Project preferences are persisted in this browser (localStorage key <code>solargeniuspro_project_v1</code>).</Sub>

      {savedFlag && (
        <Saved initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}}>
          <FiCheck size={18} /> Saved.
        </Saved>
      )}

      <Card initial={{opacity:0}} animate={{opacity:1}}>
        <h2>🏷 Brand &amp; Identity</h2>
        <Grid>
          <Field>Company name<input value={brand.companyName} onChange={e => updateBrand({companyName: e.target.value})} /></Field>
          <Field>Tagline<input value={brand.tagline} onChange={e => updateBrand({tagline: e.target.value})} /></Field>
          <Field>Contact email<input type="email" value={brand.contactEmail} onChange={e => updateBrand({contactEmail: e.target.value})} /></Field>
          <Field>Contact phone<input value={brand.contactPhone} onChange={e => updateBrand({contactPhone: e.target.value})} /></Field>
          <Field>Primary colour<input type="color" value={brand.primaryColor} onChange={e => updateBrand({primaryColor: e.target.value})} /></Field>
          <Field>Accent colour<input type="color" value={brand.accentColor} onChange={e => updateBrand({accentColor: e.target.value})} /></Field>
        </Grid>
      </Card>

      <Card initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.05}}>
        <h2>📊 Calculation defaults</h2>
        <Grid>
          <Field>Currency
            <select value={settings.currency} onChange={e => updateSettings({currency: e.target.value as any})}>
              <option value="KES">KES — Kenya Shilling</option>
              <option value="USD">USD — US Dollar</option>
              <option value="EUR">EUR — Euro</option>
            </select>
          </Field>
          <Field>Units
            <select value={settings.units} onChange={e => updateSettings({units: e.target.value as any})}>
              <option value="metric">Metric (m, kWh, °C)</option>
              <option value="imperial">Imperial (ft, kBtu, °F)</option>
            </select>
          </Field>
          <Field>Language
            <select value={settings.language} onChange={e => updateSettings({language: e.target.value as any})}>
              <option value="en">English</option>
              <option value="sw">Kiswahili</option>
              <option value="fr">Français</option>
            </select>
          </Field>
          <Field>Theme
            <select value={settings.theme} onChange={e => updateSettings({theme: e.target.value as any})}>
              <option value="dark">Dark (sci-fi)</option>
              <option value="light">Light (print-friendly)</option>
            </select>
          </Field>
          <Field>Tariff (KSh/kWh)
            <input type="number" step={0.01} value={tariff} onChange={e => setTariff(parseFloat(e.target.value) || 0)} />
          </Field>
          <Field>API endpoint
            <input value={settings.apiEndpoint} onChange={e => updateSettings({apiEndpoint: e.target.value})} />
          </Field>
        </Grid>
        <p style={{fontSize:'0.78rem', color:'rgba(255,255,255,0.5)', marginTop:'0.75rem', fontFamily:'JetBrains Mono, monospace'}}>
          Reference tariff: EPRA Kenya DC1/CI1 ≈ KSh 25.50/kWh
        </p>
      </Card>

      <Card initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.1}}>
        <h2>🔔 Notifications</h2>
        <Toggle>
          <span>Show in-app notifications</span>
          <input type="checkbox" checked={settings.notifications} onChange={e => updateSettings({notifications: e.target.checked})} />
        </Toggle>
      </Card>

      <div style={{display:'flex', gap:'1rem', flexWrap:'wrap'}}>
        <Btn onClick={handleSave}><FiSave /> Save settings</Btn>
        <Btn $variant="ghost" onClick={handleReset}>
          <FiRotateCcw /> {confirmReset ? 'Click again to confirm reset' : 'Reset project data'}
        </Btn>
      </div>
    </Wrap>
  );
};

export default SettingsPage;
