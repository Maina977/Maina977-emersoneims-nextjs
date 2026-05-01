/**
 * SMART HOME SOLAR DESIGN UI COMPONENT
 * Allows users to upload house images and get complete system designs
 * with architectural drawings, quotations, and 3D visualizations
 */

import React, { useState } from 'react';
import styled from 'styled-components';

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const DesignContainer = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 40px 20px;
  font-family: 'Segoe UI', sans-serif;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 40px;
  margin-bottom: 30px;
  max-width: 1200px;
  margin: 0 auto 30px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 50px;
  color: white;

  h1 {
    font-size: 3em;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
  }

  p {
    font-size: 1.2em;
    margin-top: 10px;
    opacity: 0.9;
  }
`;

const UploadSection = styled.div`
  border: 3px dashed #667eea;
  border-radius: 12px;
  padding: 50px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8f9ff;

  &:hover {
    background: #f0f2ff;
    border-color: #764ba2;
  }

  input {
    display: none;
  }

  h3 {
    color: #667eea;
    margin: 20px 0 10px;
    font-size: 1.3em;
  }

  p {
    color: #666;
    margin: 5px 0;
  }

  .icon {
    font-size: 3em;
    margin-bottom: 15px;
  }
`;

const ImagePreview = styled.div`
  margin: 30px 0;
  text-align: center;

  img {
    max-width: 100%;
    max-height: 400px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
`;

const AnalysisGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 30px 0;
`;

const MetricCard = styled.div<{ color?: string; color2?: string }>`
  background: linear-gradient(135deg, ${props => props.color || '#667eea'} 0%, ${props => props.color2 || '#764ba2'} 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;

  .metric-icon {
    font-size: 2.5em;
    margin-bottom: 10px;
  }

  .metric-label {
    font-size: 0.9em;
    opacity: 0.9;
    margin-bottom: 8px;
  }

  .metric-value {
    font-size: 2em;
    font-weight: 700;
    margin-bottom: 5px;
  }

  .metric-unit {
    font-size: 0.85em;
    opacity: 0.8;
  }
`;

const DrawingSection = styled.div`
  margin: 40px 0;

  h2 {
    color: #667eea;
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 30px 0 20px;
    font-size: 1.5em;
  }
`;

const DrawingCanvas = styled.div`
  background: #f8f9ff;
  border: 2px solid #e0e7ff;
  border-radius: 12px;
  padding: 20px;
  margin: 15px 0;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 1.1em;

  canvas {
    width: 100%;
  }
`;

const RoomList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin: 20px 0;
`;

const RoomCard = styled.div`
  background: #f8f9ff;
  border-left: 4px solid #667eea;
  padding: 15px;
  border-radius: 8px;

  .room-name {
    font-weight: 600;
    color: #667eea;
    margin-bottom: 8px;
  }

  .room-stat {
    display: flex;
    justify-content: space-between;
    font-size: 0.9em;
    color: #666;
    margin: 5px 0;
  }

  .room-stat-label {
    font-weight: 500;
  }

  .room-stat-value {
    color: #764ba2;
    font-weight: 600;
  }
`;

const QuotationTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;

  thead {
    background: #f0f2ff;
  }

  th {
    padding: 12px;
    text-align: left;
    font-weight: 600;
    color: #667eea;
    border-bottom: 2px solid #e0e7ff;
  }

  td {
    padding: 12px;
    border-bottom: 1px solid #f0f2ff;
  }

  tr:hover {
    background: #f8f9ff;
  }

  .total-row {
    background: #f0f2ff;
    font-weight: 600;
    font-size: 1.1em;
  }
`;

const SafetyWarning = styled.div`
  background: #fff3cd;
  border-left: 4px solid #ffc107;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;

  h4 {
    margin: 0 0 10px 0;
    color: #856404;
  }

  ul {
    margin: 0;
    padding-left: 20px;
    color: #856404;

    li {
      margin: 5px 0;
    }
  }
`;

const SummaryBox = styled.div<{ bgColor?: string; borderColor?: string }>`
  background: ${props => props.bgColor || '#f0f2ff'};
  border-left: 4px solid ${props => props.borderColor || '#667eea'};
  padding: 20px;
  border-radius: 8px;
  margin: 15px 0;
  white-space: pre-wrap;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
  line-height: 1.6;
  color: #333;
`;

const DownloadButtons = styled.div`
  display: flex;
  gap: 15px;
  margin: 30px 0;
  flex-wrap: wrap;

  button {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1em;

    &.primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
      }
    }

    &.secondary {
      background: white;
      border: 2px solid #667eea;
      color: #667eea;

      &:hover {
        background: #f0f2ff;
      }
    }
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 40px;
  border-radius: 16px;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const SmartHomeDesignUI: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [selectedAudience, setSelectedAudience] = useState<
    'layman' | 'technician' | 'engineer' | 'professor'
  >('layman');
  const [showModal, setShowModal] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedImage) return;

    setIsAnalyzing(true);
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock result
    setAnalysisResult({
      roofArea: 95.5,
      panelCount: 24,
      panelCapacity: 9.6,
      batteryCapacity: 28.8,
      dailyConsumption: 18.5,
      systemCost: 2850000,
      monthlyPayment: 78750,
      roi: 28.5,
      breakEven: 3.5,
      rooms: 5,
      shadows: 2,
    });
    setIsAnalyzing(false);
  };

  return (
    <DesignContainer>
      <Header>
        <h1>🏠 Smart Home Solar Design Studio</h1>
        <p>Upload your house image and get a complete solar system design in seconds</p>
      </Header>

      <Card>
        <h2>📸 Step 1: Upload Your House Image</h2>
        <UploadSection onClick={() => document.getElementById('upload-input')?.click()}>
          <div className="icon">🏘️</div>
          <h3>Drop your house photo here</h3>
          <p>or click to browse your computer</p>
          <p style={{ fontSize: '0.85em', color: '#999' }}>
            Supports: JPG, PNG (works best with clear roof view)
          </p>
          <input
            id="upload-input"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </UploadSection>

        {uploadedImage && (
          <>
            <ImagePreview>
              <img src={uploadedImage} alt="Uploaded house" />
              <p style={{ marginTop: '15px', color: '#666', fontSize: '0.9em' }}>
                ✅ Image uploaded successfully
              </p>
            </ImagePreview>

            <DownloadButtons>
              <button
                className="primary"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <LoadingSpinner /> Analyzing...
                  </>
                ) : (
                  '🚀 Analyze & Design System'
                )}
              </button>
            </DownloadButtons>
          </>
        )}
      </Card>

      {analysisResult && (
        <>
          <Card>
            <h2>🔍 Analysis Results</h2>
            <AnalysisGrid>
              <MetricCard color="#667eea" color2="#764ba2">
                <div className="metric-icon">☀️</div>
                <div className="metric-label">Solar Roof Area</div>
                <div className="metric-value">{analysisResult.roofArea}</div>
                <div className="metric-unit">m²</div>
              </MetricCard>

              <MetricCard color="#f093fb" color2="#f5576c">
                <div className="metric-icon">🔋</div>
                <div className="metric-label">Solar Panel Capacity</div>
                <div className="metric-value">{analysisResult.panelCapacity}</div>
                <div className="metric-unit">kW ({analysisResult.panelCount} panels)</div>
              </MetricCard>

              <MetricCard color="#4facfe" color2="#00f2fe">
                <div className="metric-icon">🗳️</div>
                <div className="metric-label">Battery Storage</div>
                <div className="metric-value">{analysisResult.batteryCapacity}</div>
                <div className="metric-unit">kWh</div>
              </MetricCard>

              <MetricCard color="#43e97b" color2="#38f9d7">
                <div className="metric-icon">⚡</div>
                <div className="metric-label">Daily Consumption</div>
                <div className="metric-value">{analysisResult.dailyConsumption}</div>
                <div className="metric-unit">kWh</div>
              </MetricCard>
            </AnalysisGrid>

            <DrawingSection>
              <h2>📐 Architectural Drawings</h2>

              <h3>Roof Elevation - Solar Panel Layout</h3>
              <DrawingCanvas>
                [Technical drawing: Roof with {analysisResult.panelCount} solar panels
                arranged for optimal sun exposure]
              </DrawingCanvas>

              <h3>Complete Wiring Diagram</h3>
              <DrawingCanvas>
                [Technical drawing: Solar panels → DC wiring → Combiner box → Main
                breaker → Inverter → Battery bank → AC distribution]
              </DrawingCanvas>

              <h3>Equipment Layout</h3>
              <DrawingCanvas>
                [Technical drawing: Inverter, battery bank, breakers, disconnect
                switches, and grounding system placement]
              </DrawingCanvas>

              <h3>Electrical Distribution by Room</h3>
              <h4>Rooms Detected in Your Home:</h4>
              <RoomList>
                <RoomCard>
                  <div className="room-name">🛋️ Living Room</div>
                  <div className="room-stat">
                    <span className="room-stat-label">Area:</span>
                    <span className="room-stat-value">30m²</span>
                  </div>
                  <div className="room-stat">
                    <span className="room-stat-label">Daily Use:</span>
                    <span className="room-stat-value">4.2 kWh</span>
                  </div>
                  <div className="room-stat">
                    <span className="room-stat-label">Appliances:</span>
                    <span className="room-stat-value">3</span>
                  </div>
                </RoomCard>

                <RoomCard>
                  <div className="room-name">🍳 Kitchen</div>
                  <div className="room-stat">
                    <span className="room-stat-label">Area:</span>
                    <span className="room-stat-value">15m²</span>
                  </div>
                  <div className="room-stat">
                    <span className="room-stat-label">Daily Use:</span>
                    <span className="room-stat-value">6.8 kWh</span>
                  </div>
                  <div className="room-stat">
                    <span className="room-stat-label">Appliances:</span>
                    <span className="room-stat-value">3</span>
                  </div>
                </RoomCard>

                <RoomCard>
                  <div className="room-name">🛏️ Bedroom 1</div>
                  <div className="room-stat">
                    <span className="room-stat-label">Area:</span>
                    <span className="room-stat-value">20m²</span>
                  </div>
                  <div className="room-stat">
                    <span className="room-stat-label">Daily Use:</span>
                    <span className="room-stat-value">3.5 kWh</span>
                  </div>
                  <div className="room-stat">
                    <span className="room-stat-label">Appliances:</span>
                    <span className="room-stat-value">2</span>
                  </div>
                </RoomCard>

                <RoomCard>
                  <div className="room-name">🛏️ Bedroom 2</div>
                  <div className="room-stat">
                    <span className="room-stat-label">Area:</span>
                    <span className="room-stat-value">18m²</span>
                  </div>
                  <div className="room-stat">
                    <span className="room-stat-label">Daily Use:</span>
                    <span className="room-stat-value">1.8 kWh</span>
                  </div>
                  <div className="room-stat">
                    <span className="room-stat-label">Appliances:</span>
                    <span className="room-stat-value">1</span>
                  </div>
                </RoomCard>

                <RoomCard>
                  <div className="room-name">🚿 Bathroom</div>
                  <div className="room-stat">
                    <span className="room-stat-label">Area:</span>
                    <span className="room-stat-value">8m²</span>
                  </div>
                  <div className="room-stat">
                    <span className="room-stat-label">Daily Use:</span>
                    <span className="room-stat-value">2.2 kWh</span>
                  </div>
                  <div className="room-stat">
                    <span className="room-stat-label">Appliances:</span>
                    <span className="room-stat-value">2</span>
                  </div>
                </RoomCard>
              </RoomList>
            </DrawingSection>
          </Card>

          <Card>
            <h2>💰 Automatic Quotation</h2>
            <QuotationTable>
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Quantity</th>
                  <th>Unit Price (KSH)</th>
                  <th>Total (KSH)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Solar Panels (400W)</td>
                  <td>{analysisResult.panelCount}</td>
                  <td>45,000</td>
                  <td>{(analysisResult.panelCount * 45000).toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Hybrid Inverter</td>
                  <td>1</td>
                  <td>120,000</td>
                  <td>120,000</td>
                </tr>
                <tr>
                  <td>LiFePO4 Battery (10kWh)</td>
                  <td>3</td>
                  <td>350,000</td>
                  <td>1,050,000</td>
                </tr>
                <tr>
                  <td>Electrical Wiring & Breakers</td>
                  <td>1</td>
                  <td>180,000</td>
                  <td>180,000</td>
                </tr>
                <tr>
                  <td>Installation & Labor</td>
                  <td>1</td>
                  <td>245,000</td>
                  <td>245,000</td>
                </tr>
                <tr>
                  <td>Permits & Certification</td>
                  <td>1</td>
                  <td>25,000</td>
                  <td>25,000</td>
                </tr>
                <tr className="total-row">
                  <td colSpan={3}>Subtotal</td>
                  <td>KSH {analysisResult.systemCost.toLocaleString()}</td>
                </tr>
                <tr className="total-row">
                  <td colSpan={3}>Tax (16% VAT)</td>
                  <td>KSH {Math.round(analysisResult.systemCost * 0.16).toLocaleString()}</td>
                </tr>
                <tr className="total-row">
                  <td colSpan={3}>TOTAL INVESTMENT</td>
                  <td>
                    KSH{' '}
                    {Math.round(
                      analysisResult.systemCost * 1.16
                    ).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </QuotationTable>

            <AnalysisGrid>
              <MetricCard color="#667eea" color2="#764ba2">
                <div className="metric-icon">💳</div>
                <div className="metric-label">Monthly Payment</div>
                <div className="metric-value">KSH {analysisResult.monthlyPayment.toLocaleString()}</div>
                <div className="metric-unit">(36-month plan)</div>
              </MetricCard>

              <MetricCard color="#f093fb" color2="#f5576c">
                <div className="metric-icon">📊</div>
                <div className="metric-label">Return on Investment</div>
                <div className="metric-value">{analysisResult.roi}%</div>
                <div className="metric-unit">annually</div>
              </MetricCard>

              <MetricCard color="#43e97b" color2="#38f9d7">
                <div className="metric-icon">⏱️</div>
                <div className="metric-label">Break-Even</div>
                <div className="metric-value">{analysisResult.breakEven}</div>
                <div className="metric-unit">years</div>
              </MetricCard>
            </AnalysisGrid>
          </Card>

          <Card>
            <h2>⚠️ Safety Specifications</h2>
            <SafetyWarning>
              <h4>Critical Safety Requirements:</h4>
              <ul>
                <li>System Voltage: 48V DC (Low voltage - Safer than 400V systems)</li>
                <li>Main DC Breaker: 150A with arc-fault detection</li>
                <li>Grounding: 2× ground rods @ 2.4m depth (Resistance &lt; 5Ω)</li>
                <li>DC Disconnect Switch: Between panels and battery</li>
                <li>AC Disconnect Switch: Between inverter and distribution</li>
                <li>All wiring in conduit protection (UV-resistant)</li>
                <li>GFDI Protection on all AC circuits</li>
                <li>Lightning protection and surge suppression</li>
              </ul>
            </SafetyWarning>

            <h3>Complete Wiring Specifications:</h3>
            <SummaryBox bgColor="#e3f2fd" borderColor="#2196f3">
              DC System (Solar to Battery):
              {`\n`}• Voltage: 48V DC
              {`\n`}• Main Breaker: 150A (DC-rated)
              {`\n`}• Wiring: AWG 6 (65A ampacity)
              {`\n`}• Voltage Drop: 2.5% max
              {`\n`}• Combiner Box: 6-string, rated for DC

              {`\n\n`}AC System (Inverter to Home):
              {`\n`}• Voltage: 230V AC
              {`\n`}• Main Breaker: 32A (AC-rated)
              {`\n`}• Wiring: AWG 4 (85A ampacity)
              {`\n`}• Voltage Drop: 3% max
              {`\n`}• Distribution Panel: 200A main switch

              {`\n\n`}Grounding System (Safety):
              {`\n`}• Type: TN-S (Separate neutral & ground)
              {`\n`}• Electrode: 2× copper rods (14mm dia)
              {`\n`}• Depth: 2.4 meters each
              {`\n`}• Resistance: Target {'<'} 5 ohms
              {`\n`}• Test: Measure with clamp meter
            </SummaryBox>
          </Card>

          <Card>
            <h2>👥 Project Summary</h2>

            <div>
              <label htmlFor="audience-select">Select your role: </label>
              <select
                id="audience-select"
                value={selectedAudience}
                onChange={(e) =>
                  setSelectedAudience(
                    e.target.value as
                      | 'layman'
                      | 'technician'
                      | 'engineer'
                      | 'professor'
                  )
                }
                style={{
                  padding: '10px 15px',
                  borderRadius: '6px',
                  border: '2px solid #667eea',
                  fontSize: '1em',
                  marginLeft: '10px',
                }}
              >
                <option value="layman">Homeowner (Simple Explanation)</option>
                <option value="technician">Technician (Installation Guide)</option>
                <option value="engineer">Engineer (Technical Specs)</option>
                <option value="professor">Professor (Academic Analysis)</option>
              </select>
            </div>

            {/* Summary would be displayed here based on selected audience */}
            <SummaryBox bgColor="#f3e5f5" borderColor="#9c27b0" style={{ marginTop: '20px' }}>
              {`[${selectedAudience.toUpperCase()} SUMMARY]\n\n`}
              Detailed summary for {selectedAudience} will appear here with relevant information and technical depth appropriate for the audience level.
            </SummaryBox>
          </Card>

          <Card style={{ textAlign: 'center' }}>
            <h2>📥 Download Your Complete Design Package</h2>
            <DownloadButtons style={{ justifyContent: 'center' }}>
              <button className="primary">📄 Download PDF Report</button>
              <button className="secondary">🎨 Download CAD Drawings</button>
              <button className="secondary">📊 Download Quotation</button>
              <button className="secondary">🏗️ Download 3D Model</button>
              <button className="secondary">⚙️ Download Bill of Materials</button>
            </DownloadButtons>
          </Card>
        </>
      )}
    </DesignContainer>
  );
};

export default SmartHomeDesignUI;
