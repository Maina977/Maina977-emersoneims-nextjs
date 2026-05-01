import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { DesignStudioAI } from '../../components/design/DesignStudioAI';
import { useSolarStore } from '../services/store';

const Wrap = styled.div`
  background: #0A0E27;
  min-height: 100vh;
  padding: 1rem;
`;
const Bar = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  & input {
    flex: 1; min-width: 280px;
    padding: 0.55rem 0.75rem;
    border-radius: 6px;
    border: 1px solid rgba(0,217,255,0.3);
    background: rgba(5,8,24,0.6);
    color: #E6F1FF;
    font-size: 0.95rem;
  }
  & button {
    padding: 0.55rem 1.2rem;
    border-radius: 6px;
    border: none;
    background: linear-gradient(135deg,#00D9FF,#0099CC);
    color: #0A0E27;
    font-weight: 700;
    cursor: pointer;
  }
`;
const Hint = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.78rem;
  color: rgba(230,241,255,0.55);
  margin-bottom: 0.5rem;
`;

const DesignStudioPage: React.FC = () => {
  const site = useSolarStore(s => s.site);
  const loadProject = useSolarStore(s => s.loadProject);
  const nav = useNavigate();

  const initial = site.displayName || '';
  const [address, setAddress] = useState(initial);
  const [submitted, setSubmitted] = useState(initial);

  useEffect(() => { loadProject(); }, [loadProject]);
  useEffect(() => {
    if (site.displayName && !submitted) {
      setAddress(site.displayName);
      setSubmitted(site.displayName);
    }
  }, [site.displayName, submitted]);

  return (
    <Wrap>
      <Hint>
        {site.displayName
          ? `Pre-filled from project site: ${site.displayName}`
          : 'No project site set — enter an address or assess one on Mission Control first.'}
      </Hint>
      <Bar>
        <input
          value={address}
          onChange={e => setAddress(e.target.value)}
          placeholder="Site address (e.g. Westlands, Nairobi)"
        />
        <button onClick={() => setSubmitted(address)}>Load Site</button>
        <button onClick={() => nav('/dashboard')} style={{background:'transparent', border:'1px solid rgba(0,217,255,0.35)', color:'#E6F1FF'}}>
          Mission Control
        </button>
      </Bar>
      {submitted ? (
        <DesignStudioAI address={submitted} />
      ) : (
        <div style={{padding:'2rem', color:'rgba(255,255,255,0.6)', textAlign:'center'}}>
          Enter a site address above to load the AI design studio.
        </div>
      )}
    </Wrap>
  );
};

export default DesignStudioPage;
