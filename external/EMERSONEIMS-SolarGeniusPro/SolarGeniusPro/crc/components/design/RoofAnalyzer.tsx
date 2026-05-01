// ROOF ANALYZER — real Sobel + angle-histogram analysis via backend
// Calls /api/site/roof-pitch which runs sharp + 1° angle histogram on the
// uploaded image. No more Math.random pitch picks; no fake obstacles.

import React, { useEffect, useRef, useState } from 'react';

interface RoofAnalyzerProps {
  image: File;
  onRoofPitchDetected: (pitch: number) => void;
}

interface AnalysisResult {
  pitchDeg: number | null;
  dominantEdgeAngleDeg?: number;
  edgePixels?: number;
  confidence: number;
  reason?: string;
  provenance: { method: string; library: string; limits: string };
}

export const RoofAnalyzer: React.FC<RoofAnalyzerProps> = ({ image, onRoofPitchDetected }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const reader = new FileReader();
        const dataUrl: string = await new Promise((resolve, reject) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(image);
        });
        if (cancelled) return;
        const img = new Image();
        await new Promise<void>((resolve) => { img.onload = () => resolve(); img.src = dataUrl; });
        if (cancelled) return;
        if (canvasRef.current) {
          const w = Math.min(img.width, 480);
          const h = Math.round((img.height * w) / img.width);
          canvasRef.current.width = w;
          canvasRef.current.height = h;
          canvasRef.current.getContext('2d')?.drawImage(img, 0, 0, w, h);
        }
        const r = await fetch('/api/site/roof-pitch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: dataUrl })
        });
        if (!r.ok) throw new Error(`Analysis HTTP ${r.status}`);
        const json = await r.json();
        if (!json.success) throw new Error(json.error || 'Analysis failed');
        if (cancelled) return;
        setResult(json.data);
        if (typeof json.data.pitchDeg === 'number') onRoofPitchDetected(json.data.pitchDeg);
        setLoading(false);
      } catch (e: any) {
        if (cancelled) return;
        setError(e.message || String(e));
        setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [image, onRoofPitchDetected]);

  return (
    <div className="roof-analyzer" style={{ padding: '1rem', background: '#0f1432', borderRadius: 8 }}>
      <h3>🏠 Roof Pitch Analysis</h3>
      <canvas ref={canvasRef} className="roof-canvas" style={{ maxWidth: '100%', borderRadius: 6 }} />
      {loading && <p style={{ color: '#9ad' }}>Running Sobel edge detection on backend…</p>}
      {error && <p style={{ color: '#f66' }}>Error: {error}</p>}
      {result && (
        <div className="analysis-results" style={{ marginTop: '0.75rem', color: '#cde' }}>
          {result.pitchDeg !== null ? (
            <>
              <div>Estimated pitch: <strong style={{ color: '#0fc' }}>{result.pitchDeg}°</strong></div>
              <div>Dominant edge orientation: {result.dominantEdgeAngleDeg}°</div>
              <div>Edge pixels analysed: {result.edgePixels}</div>
              <div>Confidence: {((result.confidence ?? 0) * 100).toFixed(0)}%</div>
            </>
          ) : (
            <div style={{ color: '#fa3' }}>Inconclusive — {result.reason}</div>
          )}
          <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', opacity: 0.7 }}>
            Source: {result.provenance.method} ({result.provenance.library}). Limits: {result.provenance.limits}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoofAnalyzer;
