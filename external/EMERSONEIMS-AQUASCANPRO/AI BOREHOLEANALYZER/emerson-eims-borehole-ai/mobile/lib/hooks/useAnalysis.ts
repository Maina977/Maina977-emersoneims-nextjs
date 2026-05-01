import { useState } from 'react';
import { analysisApi } from '../api/analysis';

export const useAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState(null);

  const analyzeImage = async (file: File, latitude?: number, longitude?: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await analysisApi.analyzeImage(file, latitude, longitude);
      setResult(response);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { analyzeImage, loading, error, result };
};