'use client';

import React, { useState, useEffect } from 'react';

interface Report {
  id: string;
  title: string;
  date: string;
  probability: number;
  status: string;
}

export const ReportHistory: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch report history
    const fetchReports = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setReports([
        { id: '1', title: 'Nairobi Site Analysis', date: '2024-01-15', probability: 0.78, status: 'completed' },
        { id: '2', title: 'Kisumu Site Analysis', date: '2024-01-10', probability: 0.65, status: 'completed' },
        { id: '3', title: 'Mombasa Site Analysis', date: '2024-01-05', probability: 0.82, status: 'completed' }
      ]);
      setLoading(false);
    };
    fetchReports();
  }, []);

  const viewReport = (reportId: string) => {
    window.open(`/reports/${reportId}`, '_blank');
  };

  const downloadReport = (reportId: string) => {
    window.location.href = `/api/reports/${reportId}/download`;
  };

  const deleteReport = async (reportId: string) => {
    if (confirm('Are you sure you want to delete this report?')) {
      setReports(reports.filter(r => r.id !== reportId));
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading reports...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h3>Report History</h3>
      
      {reports.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          No reports found. Start by analyzing an image.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Title</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Probability</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(report => (
                <tr key={report.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                  <td style={{ padding: '12px' }}>{report.title}</td>
                  <td style={{ padding: '12px' }}>{new Date(report.date).toLocaleDateString()}</td>
                  <td style={{ padding: '12px' }}>{(report.probability * 100).toFixed(0)}%</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      backgroundColor: '#e8f5e9', 
                      color: '#4CAF50',
                      fontSize: '12px'
                    }}>
                      {report.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button
                      onClick={() => viewReport(report.id)}
                      style={{ marginRight: '8px', padding: '4px 8px', cursor: 'pointer' }}
                    >
                      👁️ View
                    </button>
                    <button
                      onClick={() => downloadReport(report.id)}
                      style={{ marginRight: '8px', padding: '4px 8px', cursor: 'pointer' }}
                    >
                      📥 Download
                    </button>
                    <button
                      onClick={() => deleteReport(report.id)}
                      style={{ padding: '4px 8px', backgroundColor: '#ffebee', color: '#F44336', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};