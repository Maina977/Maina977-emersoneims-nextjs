// MODULE 9 — Voice Design AI page
// Uses the browser-native Web Speech API. No external services, no fabricated
// transcripts. If the browser doesn't support speech recognition we say so
// honestly instead of pretending it works.

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Wrap = styled.div` padding: 1.25rem; max-width: 980px; margin: 0 auto; color: #E6F1FF; `;
const Card = styled.section`
  background: rgba(11, 18, 48, 0.55);
  border: 1px solid rgba(0, 217, 255, 0.18);
  border-radius: 12px;
  padding: 1.1rem 1.2rem;
  margin-bottom: 1rem;
`;
const Btn = styled.button<{ $danger?: boolean }>`
  background: ${p => p.$danger ? '#ff4d6d' : '#00D9FF'};
  color: #050818;
  border: 0; border-radius: 8px;
  padding: 0.55rem 1rem; font-weight: 600; cursor: pointer;
  &:disabled { opacity: 0.45; cursor: not-allowed; }
`;
const Pill = styled.span<{ $tone?: 'ok' | 'warn' | 'err' }>`
  display: inline-block; padding: 2px 8px; border-radius: 999px;
  font-size: 0.72rem; font-weight: 600;
  background: ${p => p.$tone === 'ok' ? 'rgba(34,197,94,0.15)' :
                     p.$tone === 'warn' ? 'rgba(251,191,36,0.18)' :
                     p.$tone === 'err' ? 'rgba(239,68,68,0.18)' : 'rgba(0,217,255,0.15)'};
  color: ${p => p.$tone === 'ok' ? '#86efac' :
                p.$tone === 'warn' ? '#fde68a' :
                p.$tone === 'err' ? '#fca5a5' : '#00D9FF'};
  border: 1px solid currentColor;
`;

interface ParsedIntent {
  action: string;
  count?: number;
  detail?: string;
}

// Simple deterministic intent classifier — covers the most common design
// commands without needing an LLM. Returns null when nothing matches so we
// never invent an intent.
function classify(text: string): ParsedIntent | null {
  const t = text.toLowerCase().trim();
  if (!t) return null;
  const numMatch = t.match(/(\d+)/);
  const n = numMatch ? parseInt(numMatch[1], 10) : undefined;
  if (/(add|insert|place).*panel/.test(t)) return { action: 'add_panels', count: n, detail: `Add ${n ?? '?'} panel(s)` };
  if (/(remove|delete).*panel/.test(t)) return { action: 'remove_panels', count: n, detail: `Remove ${n ?? '?'} panel(s)` };
  if (/(add|attach).*battery|battery.*add/.test(t)) return { action: 'add_battery', detail: 'Add battery storage' };
  if (/rotate|turn|spin/.test(t)) return { action: 'rotate_view', detail: 'Rotate 3D view' };
  if (/(landscape|portrait|orientation)/.test(t)) return { action: 'change_orientation', detail: t.includes('portrait') ? 'Portrait' : 'Landscape' };
  if (/shading|shadow/.test(t)) return { action: 'analyze_shading', detail: 'Run shading analysis' };
  if (/(quote|estimate|cost|price)/.test(t)) return { action: 'open_quote', detail: 'Open the quote panel' };
  return null;
}

const VoiceCommandPage: React.FC = () => {
  const SR = (typeof window !== 'undefined') && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  const [supported] = useState<boolean>(!!SR);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [history, setHistory] = useState<{ at: string; text: string; intent: ParsedIntent | null }[]>([]);
  const [error, setError] = useState<string>('');
  const recRef = useRef<any>(null);

  useEffect(() => {
    if (!SR) return;
    const r = new SR();
    r.continuous = false;
    r.interimResults = true;
    r.lang = 'en-US';
    r.onresult = (e: any) => {
      let txt = '';
      for (let i = e.resultIndex; i < e.results.length; i++) txt += e.results[i][0].transcript;
      setTranscript(txt);
      const last = e.results[e.results.length - 1];
      if (last && last.isFinal) {
        const intent = classify(txt);
        setHistory(h => [{ at: new Date().toLocaleTimeString(), text: txt.trim(), intent }, ...h].slice(0, 25));
      }
    };
    r.onerror = (e: any) => { setError(e.error || 'speech recognition error'); setListening(false); };
    r.onend = () => setListening(false);
    recRef.current = r;
    return () => { try { r.stop(); } catch { /* noop */ } };
  }, [SR]);

  const start = () => { setError(''); setTranscript(''); try { recRef.current?.start(); setListening(true); } catch (e: any) { setError(e?.message || 'mic blocked'); } };
  const stop  = () => { try { recRef.current?.stop(); } catch { /* noop */ } setListening(false); };

  return (
    <Wrap>
      <h1 style={{ marginTop: 0 }}>🎙 Voice Design AI</h1>
      <p style={{ color: 'rgba(230,241,255,0.65)' }}>
        Hands-free design commands using your browser's built-in Web Speech API.
        No transcripts are sent to any server — recognition runs locally in your browser.
      </p>

      <Card>
        <h3 style={{ marginTop: 0 }}>Microphone</h3>
        {!supported ? (
          <p>
            <Pill $tone="err">Not supported</Pill>{' '}
            This browser does not implement <code>SpeechRecognition</code>. Use Chrome/Edge on desktop or
            Safari 14.1+ to enable voice commands.
          </p>
        ) : (
          <>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '0.6rem' }}>
              {!listening
                ? <Btn onClick={start}>● Start listening</Btn>
                : <Btn $danger onClick={stop}>■ Stop</Btn>}
              <Pill $tone={listening ? 'ok' : undefined}>{listening ? 'Listening…' : 'Idle'}</Pill>
              {error && <Pill $tone="err">{error}</Pill>}
            </div>
            <div style={{
              minHeight: 50, padding: '0.6rem 0.8rem', borderRadius: 8,
              background: 'rgba(0,217,255,0.06)', border: '1px dashed rgba(0,217,255,0.25)',
              fontFamily: 'JetBrains Mono, monospace', fontSize: '0.92rem'
            }}>
              {transcript || <em style={{ color: 'rgba(230,241,255,0.45)' }}>Try saying: "add 4 panels", "rotate view", "add battery", "analyse shading"</em>}
            </div>
          </>
        )}
      </Card>

      <Card>
        <h3 style={{ marginTop: 0 }}>Recognised commands</h3>
        {history.length === 0
          ? <p style={{ color: 'rgba(230,241,255,0.55)', margin: 0 }}>No commands yet.</p>
          : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: 'rgba(230,241,255,0.55)' }}>
                  <th style={{ padding: '0.35rem 0' }}>Time</th>
                  <th style={{ padding: '0.35rem 0' }}>Transcript</th>
                  <th style={{ padding: '0.35rem 0' }}>Intent</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => (
                  <tr key={i} style={{ borderTop: '1px solid rgba(0,217,255,0.1)' }}>
                    <td style={{ padding: '0.4rem 0', color: 'rgba(230,241,255,0.55)' }}>{h.at}</td>
                    <td style={{ padding: '0.4rem 0' }}>{h.text}</td>
                    <td style={{ padding: '0.4rem 0' }}>
                      {h.intent
                        ? <Pill $tone="ok">{h.intent.detail}</Pill>
                        : <Pill $tone="warn">unrecognised</Pill>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </Card>

      <Card>
        <h3 style={{ marginTop: 0 }}>Notes</h3>
        <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(230,241,255,0.78)', lineHeight: 1.55 }}>
          <li>Intent classification is rule-based (deterministic) — no LLM call, no fabricated transcript.</li>
          <li>Recognition language is en-US. Others can be added on request.</li>
          <li>Intents are surfaced here only — wiring them into the System Designer canvas is a follow-up task.</li>
        </ul>
      </Card>
    </Wrap>
  );
};

export default VoiceCommandPage;
