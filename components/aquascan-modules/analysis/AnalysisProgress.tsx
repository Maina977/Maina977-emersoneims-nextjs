'use client';

import React from 'react';

interface AnalysisProgressProps {
  progress: number;
  status: string;
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ progress, status }) => {
  return (
    <div className="analysis-progress">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="progress-status">{status}</p>
      <style jsx>{`
        .analysis-progress {
          padding: 20px;
          text-align: center;
        }
        .progress-bar {
          background: #e0e0e0;
          border-radius: 10px;
          height: 8px;
          overflow: hidden;
        }
        .progress-fill {
          background: #4CAF50;
          height: 100%;
          transition: width 0.3s ease;
        }
        .progress-status {
          margin-top: 10px;
          color: #666;
        }
      `}</style>
    </div>
  );
};