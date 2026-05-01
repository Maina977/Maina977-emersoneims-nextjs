'use client';

import React, { useState } from 'react';

interface QuotationViewerProps {
  analysisData: any;
  onGenerateQuotation: () => void;
}

export const QuotationViewer: React.FC<QuotationViewerProps> = ({ analysisData, onGenerateQuotation }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount);
  };

  const costs = {
    drilling: analysisData?.cost?.drilling || 2250,
    casing: analysisData?.cost?.casing || 1350,
    screen: analysisData?.cost?.screen || 1125,
    pump: analysisData?.cost?.pump || 500,
    mobilization: analysisData?.cost?.mobilization || 1000,
    contingency: analysisData?.cost?.contingency || 780
  };

  const totalCost = Object.values(costs).reduce((a, b) => a + b, 0);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ 
          backgroundColor: '#1a5f7a', 
          color: 'white', 
          padding: '20px',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: 0 }}>Borehole Drilling Quotation</h2>
          <p style={{ margin: '5px 0 0', opacity: 0.9 }}>AI-Powered Analysis & Cost Estimation</p>
        </div>
        
        {/* Quotation Details */}
        <div style={{ padding: '24px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3>Quotation Details</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr><td style={{ padding: '8px 0' }}><strong>Quotation Number:</strong></td><td>BHA-{new Date().getFullYear()}-{Math.floor(Math.random() * 10000)}</td></tr>
                <tr><td style={{ padding: '8px 0' }}><strong>Date:</strong></td><td>{new Date().toLocaleDateString()}</td></tr>
                <tr><td style={{ padding: '8px 0' }}><strong>Valid Until:</strong></td><td>{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</td></tr>
                <tr><td style={{ padding: '8px 0' }}><strong>Project Location:</strong></td><td>{analysisData?.site?.location || 'Nairobi, Kenya'}</td></tr>
              </tbody>
            </table>
          </div>
          
          {/* Cost Breakdown Table */}
          <div style={{ marginBottom: '24px' }}>
            <h3>Cost Breakdown</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e0e0e0' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Item</th>
                  <th style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #e0e0e0' }}>Amount (KES)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ padding: '10px', borderBottom: '1px solid #e0e0e0' }}>Drilling ({analysisData?.recommended_depth || 45}m @ KES 50/m)</td><td style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #e0e0e0' }}>{formatCurrency(costs.drilling)}</td></tr>
                <tr><td style={{ padding: '10px', borderBottom: '1px solid #e0e0e0' }}>Casing Installation</td><td style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #e0e0e0' }}>{formatCurrency(costs.casing)}</td></tr>
                <tr><td style={{ padding: '10px', borderBottom: '1px solid #e0e0e0' }}>Well Screen</td><td style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #e0e0e0' }}>{formatCurrency(costs.screen)}</td></tr>
                <tr><td style={{ padding: '10px', borderBottom: '1px solid #e0e0e0' }}>Pump and Motor</td><td style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #e0e0e0' }}>{formatCurrency(costs.pump)}</td></tr>
                <tr><td style={{ padding: '10px', borderBottom: '1px solid #e0e0e0' }}>Mobilization/Demobilization</td><td style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #e0e0e0' }}>{formatCurrency(costs.mobilization)}</td></tr>
                <tr><td style={{ padding: '10px', borderBottom: '1px solid #e0e0e0' }}>Contingency (15%)</td><td style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #e0e0e0' }}>{formatCurrency(costs.contingency)}</td></tr>
                <tr style={{ backgroundColor: '#e8f5e9' }}>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>Total Estimated Cost</td>
                  <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', fontSize: '18px' }}>{formatCurrency(totalCost)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Payment Terms */}
          <div style={{ marginBottom: '24px' }}>
            <h3>Payment Terms</h3>
            <ul style={{ margin: '0', paddingLeft: '20px' }}>
              <li>30% deposit upon quotation acceptance</li>
              <li>40% upon mobilization to site</li>
              <li>30% upon successful completion and testing</li>
              <li>Payment methods: Bank Transfer, M-Pesa, or Cheque</li>
            </ul>
          </div>
          
          {/* Warranty */}
          <div style={{ marginBottom: '24px', backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '8px' }}>
            <h3 style={{ marginTop: 0 }}>Warranty & Guarantee</h3>
            <p><strong>Workmanship Warranty:</strong> 12 months on all drilling and installation work</p>
            <p><strong>Equipment Warranty:</strong> 24 months on pump and motor</p>
            <p><strong>Yield Guarantee:</strong> Minimum {analysisData?.estimated_yield || 12.5} m³/hour at recommended depth</p>
            <p><strong>Water Quality:</strong> Guaranteed to meet WHO standards for potability</p>
          </div>
          
          {/* Terms and Conditions */}
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '24px' }}>
            <h4>Terms and Conditions</h4>
            <p>1. This quotation is based on AI analysis and estimated subsurface conditions.</p>
            <p>2. Final cost may vary based on actual drilling conditions encountered.</p>
            <p>3. Additional costs may apply for unexpected rock conditions or deep water tables.</p>
            <p>4. Prices are exclusive of government taxes and permits.</p>
            <p>5. Site access and preparation are client's responsibility.</p>
          </div>
          
          {/* Signature */}
          <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #e0e0e0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <p><strong>Authorized Signature:</strong></p>
                <div style={{ marginTop: '40px' }}>_________________</div>
                <p>Date: _______________</p>
              </div>
              <div>
                <p><strong>Client Signature:</strong></p>
                <div style={{ marginTop: '40px' }}>_________________</div>
                <p>Date: _______________</p>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '32px', justifyContent: 'center' }}>
            <button
              onClick={() => window.print()}
              style={{
                padding: '10px 20px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              🖨️ Print Quotation
            </button>
            <button
              onClick={onGenerateQuotation}
              disabled={isGenerating}
              style={{
                padding: '10px 20px',
                backgroundColor: '#2ecc71',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: isGenerating ? 'not-allowed' : 'pointer'
              }}
            >
              {isGenerating ? '📧 Sending...' : '📧 Send to Client'}
            </button>
            <button
              onClick={() => {
                const element = document.createElement('a');
                const content = document.getElementById('quotation-content')?.innerHTML;
                const blob = new Blob([`<html>${content}</html>`], { type: 'text/html' });
                element.href = URL.createObjectURL(blob);
                element.download = `quotation_${Date.now()}.html`;
                element.click();
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: '#f39c12',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              💾 Download HTML
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};