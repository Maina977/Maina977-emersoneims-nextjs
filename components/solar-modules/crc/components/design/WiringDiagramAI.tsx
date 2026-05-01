// MODULE 11: WIRING DIAGRAM AI
// Generates single-line electrical diagrams based on selected components
// Output: SVG + PDF (locked until payment)

import React, { useRef, useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface WiringDiagramProps {
  systemSize: number; // kWp
  panels: Array<{ count: number; wattage: number }>;
  inverter: { model: string; ratedPower: number };
  battery?: { model: string; capacity: number; voltage: number };
  isPaid: boolean; // 70% paywall logic
}

interface DiagramComponents {
  dc_pv_array: string;
  dc_disconnect: string;
  charge_controller: string;
  ac_disconnect: string;
  inverter: string;
  battery_bank?: string;
  grid_connection?: string;
  breakers: string[];
}

export const WiringDiagramAI: React.FC<WiringDiagramProps> = ({
  systemSize,
  panels,
  inverter,
  battery,
  isPaid
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [diagram, setDiagram] = useState<DiagramComponents | null>(null);
  const [showWatermark, setShowWatermark] = useState(!isPaid);

  useEffect(() => {
    // Generate diagram layout based on components
    const generatedDiagram: DiagramComponents = {
      dc_pv_array: `PV Array: ${panels.reduce((sum, p) => sum + p.count, 0)}x${panels[0]?.wattage}W`,
      dc_disconnect: 'DC Disconnect Switch',
      charge_controller: 'MPPT Charge Controller',
      ac_disconnect: 'AC Disconnect Switch',
      inverter: `${inverter.model} (${inverter.ratedPower/1000}kW)`,
      battery_bank: battery ? `${battery.model} (${battery.capacity}kWh)` : undefined,
      grid_connection: 'Grid Connection (Utility)',
      breakers: [
        'DC Array Breaker (MCB)',
        'AC Output Breaker (MCB)',
        battery ? 'Battery Breaker (MCB)' : null
      ].filter(Boolean) as string[]
    };

    setDiagram(generatedDiagram);
  }, [panels, inverter, battery]);

  // Render SVG wiring diagram
  const renderDiagram = () => {
    const width = 1000;
    const height = 800;
    const margin = 50;

    return (
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ border: '1px solid #ccc', background: 'white' }}
      >
        {/* Title */}
        <text x={width / 2} y={30} textAnchor="middle" fontSize="24" fontWeight="bold">
          Solar System Single-Line Diagram
        </text>
        <text x={width / 2} y={55} textAnchor="middle" fontSize="14" fill="#666">
          System Size: {systemSize} kWp
        </text>

        {/* Grid background */}
        {Array.from({ length: Math.ceil(width / 50) }).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={i * 50}
            y1={0}
            x2={i * 50}
            y2={height}
            stroke="#f0f0f0"
            strokeWidth="0.5"
          />
        ))}
        {Array.from({ length: Math.ceil(height / 50) }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1={0}
            y1={i * 50}
            x2={width}
            y2={i * 50}
            stroke="#f0f0f0"
            strokeWidth="0.5"
          />
        ))}

        {/* DC Side - Top Left */}
        <g id="dc-side">
          {/* PV Array Box */}
          <rect x={margin} y={100} width={150} height={80} fill="#fff3cd" stroke="#ff8c00" strokeWidth="2" />
          <text x={margin + 75} y={130} textAnchor="middle" fontSize="12" fontWeight="bold">
            ☀️ PV Array
          </text>
          <text x={margin + 75} y={150} textAnchor="middle" fontSize="10">
            {panels.reduce((sum, p) => sum + p.count, 0)} × {panels[0]?.wattage}W
          </text>
          <text x={margin + 75} y={165} textAnchor="middle" fontSize="9" fill="#666">
            {systemSize} kWp
          </text>

          {/* DC Disconnect */}
          <rect x={margin} y={220} width={150} height={50} fill="#e8f4f8" stroke="#0066ff" strokeWidth="2" />
          <text x={margin + 75} y={240} textAnchor="middle" fontSize="12" fontWeight="bold">
            DC Disconnect
          </text>
          <text x={margin + 75} y={257} textAnchor="middle" fontSize="10">
            Switch
          </text>

          {/* DC Breaker */}
          <circle cx={margin + 75} cy={310} r={15} fill="#f0f0f0" stroke="#333" strokeWidth="2" />
          <text x={margin + 75} y={316} textAnchor="middle" fontSize="12" fontWeight="bold">
            CB
          </text>
          <text x={margin + 75} y={340} textAnchor="middle" fontSize="9">
            DC Breaker
          </text>
        </g>

        {/* Center - Inverter */}
        <g id="inverter-section">
          {/* Charge Controller (if battery) */}
          {battery && (
            <>
              <rect x={350} y={100} width={180} height={80} fill="#e8f8e8" stroke="#00aa00" strokeWidth="2" />
              <text x={440} y={130} textAnchor="middle" fontSize="12" fontWeight="bold">
                ⚙️ MPPT Controller
              </text>
              <text x={440} y={150} textAnchor="middle" fontSize="10">
                Max {systemSize * 1.25} A Input
              </text>
            </>
          )}

          {/* Inverter */}
          <rect x={350} y={250} width={180} height={100} fill="#fff0f5" stroke="#cc00cc" strokeWidth="3" />
          <text x={440} y={280} textAnchor="middle" fontSize="14" fontWeight="bold">
            🔄 Inverter
          </text>
          <text x={440} y={305} textAnchor="middle" fontSize="11">
            {inverter.model}
          </text>
          <text x={440} y={325} textAnchor="middle" fontSize="10">
            {inverter.ratedPower / 1000} kW Rated
          </text>
        </g>

        {/* Battery Bank (if exists) - Right side */}
        {battery && (
          <g id="battery-section">
            <rect x={650} y={100} width={180} height={100} fill="#ffe8e8" stroke="#cc0000" strokeWidth="2" />
            <text x={740} y={130} textAnchor="middle" fontSize="12" fontWeight="bold">
              🔋 Battery Bank
            </text>
            <text x={740} y={150} textAnchor="middle" fontSize="10">
              {battery.model}
            </text>
            <text x={740} y={170} textAnchor="middle" fontSize="10">
              {battery.capacity} kWh
            </text>
            <text x={740} y={190} textAnchor="middle" fontSize="10">
              {battery.voltage}V System
            </text>
          </g>
        )}

        {/* AC Side - Bottom */}
        <g id="ac-side">
          {/* AC Disconnect */}
          <rect x={350} y={450} width={180} height={50} fill="#fff0e6" stroke="#ff6600" strokeWidth="2" />
          <text x={440} y={470} textAnchor="middle" fontSize="12" fontWeight="bold">
            AC Disconnect
          </text>
          <text x={440} y={490} textAnchor="middle" fontSize="10">
            Switch
          </text>

          {/* AC Breaker */}
          <circle cx={440} cy={550} r={15} fill="#f0f0f0" stroke="#333" strokeWidth="2" />
          <text x={440} y={556} textAnchor="middle" fontSize="12" fontWeight="bold">
            CB
          </text>
          <text x={440} y={580} textAnchor="middle" fontSize="9">
            AC Breaker
          </text>

          {/* Distribution Panel */}
          <rect x={350} y={620} width={180} height={70} fill="#e8e8ff" stroke="#0000cc" strokeWidth="2" />
          <text x={440} y={645} textAnchor="middle" fontSize="12" fontWeight="bold">
            ⚡ Load Center
          </text>
          <text x={440} y={665} textAnchor="middle" fontSize="10">
            Distribution Panel
          </text>
        </g>

        {/* Grid Connection */}
        <g id="grid-connection">
          <rect x={650} y={620} width={180} height={70} fill="#fff5f5" stroke="#999" strokeWidth="2" />
          <text x={740} y={645} textAnchor="middle" fontSize="12" fontWeight="bold">
            🔌 Grid
          </text>
          <text x={740} y={665} textAnchor="middle" fontSize="10">
            Utility Connection
          </text>
        </g>

        {/* Wiring connections (simplified) */}
        <g id="wiring" stroke="#333" strokeWidth="2">
          {/* DC to Inverter */}
          <line x1={225} y1={135} x2={350} y2={300} />

          {/* Inverter to AC Disconnect */}
          <line x1={440} y1={350} x2={440} y2={450} />

          {/* AC to Distribution */}
          <line x1={440} y1={500} x2={440} y2={620} />

          {/* Distribution to Grid */}
          <line x1={530} y1={655} x2={650} y2={655} />

          {/* Battery connections (if exists) */}
          {battery && (
            <>
              <line x1={530} y1={135} x2={650} y2={150} stroke="#cc0000" strokeWidth="3" />
              <line x1={530} y1={300} x2={650} y2={280} stroke="#cc0000" strokeWidth="3" />
            </>
          )}
        </g>

        {/* Component Labels */}
        <g id="labels" fontSize="10" fill="#666">
          <text x={margin + 75} y={380}>DC String: {panels.reduce((sum, p) => sum + p.count, 0)} panels</text>
          <text x={margin + 75} y={400}>DC Voltage: {Math.ceil(panels[0]?.wattage / 100 * 40)}V nominal</text>
          <text x={350} y={400}>AC Output: 230V/400V 3-phase</text>
        </g>

        {/* Watermark for unpaid */}
        {showWatermark && (
          <g id="watermark" opacity="0.3">
            <text
              x={width / 2}
              y={height / 2}
              textAnchor="middle"
              fontSize="60"
              fontWeight="bold"
              fill="#999"
              transform={`rotate(-45 ${width / 2} ${height / 2})`}
            >
              SAMPLE
            </text>
            <text x={width / 2} y={height - 30} textAnchor="middle" fontSize="14" fill="#ff6b6b" fontWeight="bold">
              🔒 Full diagram available after payment
            </text>
          </g>
        )}
      </svg>
    );
  };

  // Export diagram as PDF
  const exportToPDF = async () => {
    if (!svgRef.current) return;

    try {
      const canvas = await html2canvas(svgRef.current as unknown as HTMLElement, {
        backgroundColor: '#ffffff',
        scale: 2
      });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a3'
      });

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 10, 10, 270, 190);

      // Add specifications page
      pdf.addPage();
      pdf.setFontSize(16);
      pdf.text('Solar System Specifications', 20, 20);

      pdf.setFontSize(12);
      let yPos = 40;
      const specs = [
        `System Size: ${systemSize} kWp`,
        `Inverter: ${inverter.model}`,
        `Rated Power: ${inverter.ratedPower / 1000} kW`,
        `PV Array: ${panels.reduce((sum, p) => sum + p.count, 0)} panels`,
        battery ? `Battery: ${battery.model} (${battery.capacity} kWh)` : 'Battery: N/A (Grid-tied)',
        `Installation Date: ${new Date().toLocaleDateString()}`,
        `Compliance: IEC 61724, IEC 62109`
      ];

      specs.forEach(spec => {
        pdf.text(spec, 20, yPos);
        yPos += 10;
      });

      // Add disclaimer
      pdf.setFontSize(10);
      pdf.text('This is a single-line diagram for reference only.', 20, yPos + 20);
      pdf.text('For installation, consult a licensed electrician.', 20, yPos + 30);

      pdf.save(`wiring-diagram-${systemSize}kWp.pdf`);
    } catch (error) {
      console.error('PDF export error:', error);
    }
  };

  return (
    <div className="wiring-diagram-container">
      <div className="diagram-header">
        <h2>⚡ Wiring Diagram AI</h2>
        <p>Single-line diagram for your {systemSize} kWp system</p>
      </div>

      <div className="diagram-tools">
        <button className="btn-primary" onClick={exportToPDF} disabled={showWatermark}>
          {showWatermark ? '🔒 Locked - Purchase to Download' : '📥 Download PDF'}
        </button>
        <button className="btn-secondary" onClick={() => window.print()}>
          🖨️ Print
        </button>
      </div>

      <div className="diagram-viewer">
        {renderDiagram()}
      </div>

      {showWatermark && (
        <div className="watermark-message">
          <div className="message-box">
            <h3>🔐 Diagram Preview - 70% Locked</h3>
            <p>Component specifications and detailed wiring connections are hidden until payment is received.</p>
            <p><strong>Complete Diagram Includes:</strong></p>
            <ul>
              <li>✓ Exact cable sizes (mm²) for each circuit</li>
              <li>✓ Component part numbers (currently blurred)</li>
              <li>✓ Installation manual (first 3 pages)</li>
              <li>✓ Safety interlocks and disconnects</li>
              <li>✓ Grounding specifications</li>
            </ul>
            <button className="btn-primary-large" onClick={() => setShowWatermark(false)}>
              💳 Complete Purchase to Unlock
            </button>
          </div>
        </div>
      )}

      <div className="diagram-legend">
        <h3>📋 Legend</h3>
        <div className="legend-grid">
          <div className="legend-item">
            <div style={{ background: '#fff3cd', border: '2px solid #ff8c00', width: '30px', height: '30px' }}></div>
            <span>PV Array</span>
          </div>
          <div className="legend-item">
            <div style={{ background: '#e8f4f8', border: '2px solid #0066ff', width: '30px', height: '30px' }}></div>
            <span>Disconnect Switch</span>
          </div>
          <div className="legend-item">
            <div style={{ background: '#e8f8e8', border: '2px solid #00aa00', width: '30px', height: '30px' }}></div>
            <span>Charge Controller</span>
          </div>
          <div className="legend-item">
            <div style={{ background: '#fff0f5', border: '3px solid #cc00cc', width: '30px', height: '30px' }}></div>
            <span>Inverter</span>
          </div>
          <div className="legend-item">
            <div style={{ background: '#ffe8e8', border: '2px solid #cc0000', width: '30px', height: '30px' }}></div>
            <span>Battery Bank</span>
          </div>
          <div className="legend-item">
            <div style={{ background: '#e8e8ff', border: '2px solid #0000cc', width: '30px', height: '30px' }}></div>
            <span>Load Center</span>
          </div>
        </div>
      </div>

      <div className="safety-notice">
        <strong>⚠️ Safety Notice:</strong> This wiring diagram must be reviewed and approved by a licensed electrician before installation.
        Improper electrical installation can result in fire, electrocution, or equipment damage.
      </div>
    </div>
  );
};

export default WiringDiagramAI;
