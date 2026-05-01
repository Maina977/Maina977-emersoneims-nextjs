import { useState } from 'react';
import api from '../api/client';

export const useReports = () => {
  const [loading, setLoading] = useState(false);

  const generateReport = async (analysisId: number) => {
    setLoading(true);
    try {
      const response = await api.post('/api/v1/reports/generate', { analysis_id: analysisId });
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async (reportId: string) => {
    const response = await api.get(`/api/v1/reports/${reportId}/download`, {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `report_${reportId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return { generateReport, downloadReport, loading };
};