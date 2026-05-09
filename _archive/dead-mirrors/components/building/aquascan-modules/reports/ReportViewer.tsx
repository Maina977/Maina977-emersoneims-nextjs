'use client';

import React, { useState } from 'react';

interface ReportViewerProps {
  reportId: string;
  reportData: any;
  onDownload?: () => void;
  onShare?: () => void;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({ reportId, reportData, onDownload, onShare }) => {
  const [activeSection, setActiveSection] = useState('summary');

  const sections = [
    { id: 'summary', name: 'Executive Summary', icon: '📋' },
    { id: 'site', name: 'Site Analysis', icon: '📍' },
    { id: 'soil', name: 'Soil Analysis', icon: '🌱' },
    { id: 'water', name: 'Water Quality', icon: '💧' },
    { id: 'contamination', name: 'Contamination Risk', icon: '⚠️' },
    { id: 'recommendations', name: 'Recommendations', icon: '💡' }
  ];

  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '12px', 
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: '#4CAF50', 
        color: 'white', 
        padding: '20px',
        textAlign: 'center'
      }}>
        <h2 style={{ margin: 0, marginBottom: '8px' }}>Borehole Site Analysis Report</h2>
        <p style={{ margin: 0, opacity: 0.9 }}>Report ID: {reportId}</p>
        <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>Generated: {new Date().toLocaleDateString()}</p>
      </div>
      
      {/* Navigation Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e0e0e0', overflowX: 'auto' }}>
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            style={{
              padding: '12px 20px',
              backgroundColor: activeSection === section.id ? '#f5f5f5' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontWeight: activeSection === section.id ? 'bold' : 'normal',
              borderBottom: activeSection === section.id ? '2px solid #4CAF50' : 'none'
            }}
          >
            <span style={{ marginRight: '8px' }}>{section.icon}</span>
            {section.name}
          </button>
        ))}
      </div>
      
      {/* Content */}
      <div style={{ padding: '24px' }}>
        {activeSection === 'summary' && (
          <div>
            <h3>Executive Summary</h3>
            <p>This report provides a comprehensive analysis of the borehole site based on AI-powered image analysis and geophysical data.</p>
            <div style={{ 
              backgroundColor: '#e8f5e9', 
              padding: '16px', 
              borderRadius: '8px',
              marginTop: '16px'
            }}>
              <strong>Overall Assessment:</strong>
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '8px' }}>
                {(reportData?.probability * 100).toFixed(0)}% Success Probability
              </div>
              <div>Recommended for drilling with {(reportData?.risk?.viability || 'medium').toUpperCase()} confidence</div>
            </div>
          </div>
        )}
        
        {activeSection === 'site' && (
          <div>
            <h3>Site Analysis</h3>
            <div><strong>Site Type:</strong> {reportData?.site?.siteType?.toUpperCase()}</div>
            <div><strong>Coordinates:</strong> {reportData?.site?.latitude?.toFixed(4)}°, {reportData?.site?.longitude?.toFixed(4)}°</div>
            <div><strong>Vegetation Density:</strong> {(reportData?.site?.vegetationDensity * 100).toFixed(0)}%</div>
            <div><strong>Water Indicators:</strong> {(reportData?.site?.waterIndicator * 100).toFixed(0)}%</div>
            <div><strong>Terrain Slope:</strong> {reportData?.site?.terrainSlope?.toFixed(1)}°</div>
            <div><strong>Confidence Score:</strong> {(reportData?.site?.confidence * 100).toFixed(0)}%</div>
          </div>
        )}
        
        {activeSection === 'soil' && (
          <div>
            <h3>Soil Analysis</h3>
            <div><strong>Soil Type:</strong> {reportData?.soil?.type?.toUpperCase()}</div>
            <div><strong>Porosity:</strong> {(reportData?.soil?.porosity * 100).toFixed(0)}%</div>
            <div><strong>Permeability:</strong> {(reportData?.soil?.permeability * 100).toFixed(0)}%</div>
            <div><strong>Organic Matter:</strong> {(reportData?.soil?.organicMatter * 100).toFixed(1)}%</div>
            <div><strong>pH Level:</strong> {reportData?.soil?.pH?.toFixed(1)}</div>
            <div><strong>Moisture Content:</strong> {(reportData?.soil?.moistureContent * 100).toFixed(0)}%</div>
            <div><strong>Soil Suitability:</strong> {(reportData?.soil?.suitability * 100).toFixed(0)}%</div>
          </div>
        )}
        
        {activeSection === 'water' && (
          <div>
            <h3>Water Quality Analysis</h3>
            <div><strong>Potability:</strong> {reportData?.waterQuality?.isPotable ? '✅ Safe for drinking' : '⚠️ Treatment required'}</div>
            <div><strong>TDS:</strong> {reportData?.waterQuality?.tds?.toFixed(0)} mg/L</div>
            <div><strong>pH:</strong> {reportData?.waterQuality?.pH?.toFixed(1)}</div>
            <div><strong>Hardness:</strong> {reportData?.waterQuality?.hardness?.toFixed(0)} mg/L</div>
            <div><strong>Fluoride:</strong> {reportData?.waterQuality?.fluoride?.toFixed(2)} mg/L</div>
            <div><strong>Iron:</strong> {reportData?.waterQuality?.iron?.toFixed(2)} mg/L</div>
            <div><strong>Arsenic:</strong> {reportData?.waterQuality?.arsenic?.toFixed(3)} mg/L</div>
            <div><strong>Nitrate:</strong> {reportData?.waterQuality?.nitrate?.toFixed(0)} mg/L</div>
          </div>
        )}
        
        {activeSection === 'contamination' && (
          <div>
            <h3>Contamination Risk Assessment</h3>
            <div><strong>Risk Level:</strong> {(reportData?.risk?.contaminationRisk?.level * 100).toFixed(0)}%</div>
            {reportData?.risk?.contaminationRisk?.sources?.length > 0 ? (
              <div>
                <strong>Detected Sources:</strong>
                <ul>
                  {reportData.risk.contaminationRisk.sources.map((source: any, i: number) => (
                    <li key={i}>
                      {source.type.toUpperCase()} - {source.distance}m {source.direction} 
                      (Severity: {source.severity})
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No significant contamination sources detected.</p>
            )}
          </div>
        )}
        
        {activeSection === 'recommendations' && (
          <div>
            <h3>Recommendations</h3>
            <ul>
              {reportData?.risk?.recommendations?.map((rec: string, i: number) => (
                <li key={i} style={{ marginBottom: '8px' }}>{rec}</li>
              ))}
            </ul>
            <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#fff3e0', borderRadius: '8px' }}>
              <strong>📋 Next Steps:</strong>
              <ol style={{ marginTop: '8px', paddingLeft: '20px' }}>
                <li>Obtain necessary drilling permits</li>
                <li>Engage certified drilling contractor</li>
                <li>Install casing as per recommendations</li>
                <li>Conduct water quality testing post-drilling</li>
                <li>Implement regular monitoring schedule</li>
              </ol>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer Actions */}
      <div style={{ 
        padding: '16px 24px', 
        borderTop: '1px solid #e0e0e0', 
        display: 'flex', 
        gap: '12px',
        justifyContent: 'flex-end'
      }}>
        {onDownload && (
          <button
            onClick={onDownload}
            style={{
              padding: '8px 16px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            📥 Download PDF
          </button>
        )}
        {onShare && (
          <button
            onClick={onShare}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            📤 Share Report
          </button>
        )}
        <button
          onClick={() => window.print()}
          style={{
            padding: '8px 16px',
            backgroundColor: '#757575',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🖨️ Print
        </button>
      </div>
    </div>
  );
};