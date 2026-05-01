'use client';

import React, { useState } from 'react';
import { PaymentModal } from '../payment/PaymentModal';

interface ReportPreviewProps {
  analysisId: string;
  previewData: any;
  onPaymentComplete: () => void;
}

export const ReportPreview: React.FC<ReportPreviewProps> = ({ analysisId, previewData, onPaymentComplete }) => {
  const [showPayment, setShowPayment] = useState(false);

  if (!previewData) return <div>Loading preview...</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      {/* Preview Banner */}
      <div style={{
        backgroundColor: '#f39c12',
        color: 'white',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '24px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>🔓 70% PREVIEW MODE</div>
        <div style={{ marginTop: '8px' }}>
          You're seeing 70% of the full report. Pay to unlock the complete analysis with detailed recommendations.
        </div>
        <button
          onClick={() => setShowPayment(true)}
          style={{
            marginTop: '12px',
            padding: '10px 24px',
            backgroundColor: '#2ecc71',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Unlock Full Report → {previewData.cost_estimation?.currency} {previewData.cost_estimation?.total_estimated_cost?.toLocaleString()}
        </button>
      </div>
      
      {/* Executive Summary - FULLY VISIBLE */}
      <div style={{ marginBottom: '24px' }}>
        <h2>Executive Summary</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ backgroundColor: '#f0f8ff', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2ecc71' }}>
              {(previewData.executive_summary?.probability * 100).toFixed(0)}%
            </div>
            <div>Success Probability</div>
          </div>
          <div style={{ backgroundColor: '#f0f8ff', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
              {previewData.executive_summary?.recommended_depth}m
            </div>
            <div>Recommended Depth</div>
          </div>
          <div style={{ backgroundColor: '#f0f8ff', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
              {previewData.executive_summary?.estimated_yield} m³/h
            </div>
            <div>Estimated Yield</div>
          </div>
        </div>
      </div>
      
      {/* Site Information - FULLY VISIBLE */}
      <div style={{ marginBottom: '24px' }}>
        <h3>📍 Site Information</h3>
        <div style={{ backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '8px' }}>
          <div><strong>Location:</strong> {previewData.site_information?.location}</div>
          <div><strong>Coordinates:</strong> {previewData.site_information?.latitude}°, {previewData.site_information?.longitude}°</div>
          <div><strong>Site Type:</strong> {previewData.site_information?.site_type?.toUpperCase()}</div>
          <div><strong>Vegetation Density:</strong> {(previewData.site_information?.vegetation_density * 100).toFixed(0)}%</div>
          <div><strong>Water Indicators:</strong> {(previewData.site_information?.water_indicators * 100).toFixed(0)}%</div>
        </div>
      </div>
      
      {/* Soil Analysis - PARTIALLY VISIBLE with note */}
      <div style={{ marginBottom: '24px' }}>
        <h3>🌱 Soil Analysis</h3>
        <div style={{ backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '8px' }}>
          <div><strong>Soil Type:</strong> {previewData.soil_analysis_preview?.soil_type?.toUpperCase()}</div>
          <div><strong>Porosity:</strong> {(previewData.soil_analysis_preview?.porosity * 100).toFixed(0)}%</div>
          <div><strong>Permeability:</strong> {(previewData.soil_analysis_preview?.permeability * 100).toFixed(0)}%</div>
          <div><strong>pH:</strong> {previewData.soil_analysis_preview?.ph}</div>
          <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#fff3e0', borderRadius: '4px', fontSize: '12px' }}>
            💡 {previewData.soil_analysis_preview?.preview_note}
          </div>
        </div>
      </div>
      
      {/* Water Quality - PARTIALLY VISIBLE */}
      <div style={{ marginBottom: '24px' }}>
        <h3>💧 Water Quality</h3>
        <div style={{ backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '8px' }}>
          <div><strong>TDS:</strong> {previewData.water_quality_preview?.tds} mg/L</div>
          <div><strong>pH:</strong> {previewData.water_quality_preview?.ph}</div>
          <div><strong>Potability:</strong> 
            <span style={{ color: previewData.water_quality_preview?.is_potable ? '#2ecc71' : '#e74c3c' }}>
              {previewData.water_quality_preview?.is_potable ? '✅ POTABLE' : '⚠️ NON-POTABLE'}
            </span>
          </div>
          <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#fff3e0', borderRadius: '4px', fontSize: '12px' }}>
            💡 {previewData.water_quality_preview?.preview_note}
          </div>
        </div>
      </div>
      
      {/* Risk Summary - FULLY VISIBLE */}
      <div style={{ marginBottom: '24px' }}>
        <h3>⚠️ Risk Assessment</h3>
        <div style={{ backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '8px' }}>
          <div><strong>Overall Risk:</strong> {(previewData.risk_summary?.overall_risk * 100).toFixed(0)}%</div>
          <div><strong>Viability:</strong> 
            <span style={{ 
              color: previewData.risk_summary?.viability === 'high' ? '#2ecc71' : 
                     previewData.risk_summary?.viability === 'medium' ? '#f39c12' : '#e74c3c',
              fontWeight: 'bold'
            }}>
              {previewData.risk_summary?.viability?.toUpperCase()}
            </span>
          </div>
          <div style={{ marginTop: '8px' }}>
            <strong>Risk Breakdown:</strong>
            <div>• Geological: {(previewData.risk_summary?.risk_categories?.geological * 100).toFixed(0)}%</div>
            <div>• Contamination: {(previewData.risk_summary?.risk_categories?.contamination * 100).toFixed(0)}%</div>
            <div>• Depth: {(previewData.risk_summary?.risk_categories?.depth * 100).toFixed(0)}%</div>
          </div>
        </div>
      </div>
      
      {/* Cost Estimation - FULLY VISIBLE */}
      <div style={{ marginBottom: '24px' }}>
        <h3>💰 Cost Estimation</h3>
        <div style={{ backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '8px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2ecc71' }}>
            {previewData.cost_estimation?.currency} {previewData.cost_estimation?.total_estimated_cost?.toLocaleString()}
          </div>
          <div style={{ marginTop: '8px' }}>
            <strong>Breakdown:</strong>
            <div>• Drilling: {previewData.cost_estimation?.currency} {previewData.cost_estimation?.cost_breakdown?.drilling?.toLocaleString()}</div>
            <div>• Casing: {previewData.cost_estimation?.currency} {previewData.cost_estimation?.cost_breakdown?.casing?.toLocaleString()}</div>
            <div>• Pump: {previewData.cost_estimation?.currency} {previewData.cost_estimation?.cost_breakdown?.pump?.toLocaleString()}</div>
          </div>
        </div>
      </div>
      
      {/* Locked Sections - Show what's missing */}
      <div style={{ marginBottom: '24px', backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔒</div>
        <h3>Unlock Full Report to Access:</h3>
        <ul style={{ textAlign: 'left', display: 'inline-block', margin: '0 auto' }}>
          {previewData.locked_sections?.sections_locked?.map((section: string, idx: number) => (
            <li key={idx}>{section}</li>
          ))}
        </ul>
        <button
          onClick={() => setShowPayment(true)}
          style={{
            marginTop: '20px',
            padding: '14px 32px',
            backgroundColor: '#2ecc71',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Unlock Full Report → {previewData.cost_estimation?.currency} {previewData.cost_estimation?.total_estimated_cost?.toLocaleString()}
        </button>
      </div>
      
      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onSuccess={() => {
          setShowPayment(false);
          onPaymentComplete();
        }}
        amount={previewData.cost_estimation?.total_estimated_cost || 5000}
        currency={previewData.cost_estimation?.currency || "KES"}
        reportId={previewData.report_id}
        analysisId={analysisId}
        customerEmail="customer@example.com" // Get from user context
        customerPhone="254700000000"
        customerName="Customer Name"
      />
    </div>
  );
};