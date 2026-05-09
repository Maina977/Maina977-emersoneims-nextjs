'use client';

import React, { useState } from 'react';

interface ReportDownloadProps {
  reportId: string;
  onDownloadComplete?: () => void;
}

export const ReportDownload: React.FC<ReportDownloadProps> = ({ reportId, onDownloadComplete }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [format, setFormat] = useState('pdf');

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Simulate download
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create mock PDF blob
      const blob = new Blob(['Mock PDF content'], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `borehole_report_${reportId}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      onDownloadComplete?.();
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Download Report</h3>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>Format:</label>
        <select 
          value={format} 
          onChange={(e) => setFormat(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="pdf">PDF Document</option>
          <option value="docx">Word Document</option>
          <option value="csv">CSV Data</option>
          <option value="json">JSON Data</option>
        </select>
      </div>
      
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        style={{
          padding: '12px 24px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: isDownloading ? 'not-allowed' : 'pointer',
          opacity: isDownloading ? 0.6 : 1
        }}
      >
        {isDownloading ? '⏳ Generating...' : `📥 Download ${format.toUpperCase()}`}
      </button>
      
      <div style={{ marginTop: '16px', fontSize: '12px', color: '#666' }}>
        Report ID: {reportId}
      </div>
    </div>
  );
};