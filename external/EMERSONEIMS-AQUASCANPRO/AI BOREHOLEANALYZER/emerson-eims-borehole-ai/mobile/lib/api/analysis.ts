import api from './client';

export const analysisApi = {
  analyzeImage: async (file: File, latitude?: number, longitude?: number) => {
    const formData = new FormData();
    formData.append('file', file);
    if (latitude) formData.append('latitude', latitude.toString());
    if (longitude) formData.append('longitude', longitude.toString());
    
    const response = await api.post('/api/v1/analysis/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  
  getAnalysisHistory: async (limit = 10, offset = 0) => {
    const response = await api.get(`/api/v1/analysis/history?limit=${limit}&offset=${offset}`);
    return response.data;
  },
  
  getAnalysisById: async (id: number) => {
    const response = await api.get(`/api/v1/analysis/${id}`);
    return response.data;
  }
};