'use client';
import { useState } from 'react';
import MetalBezel from './MetalBezel';
import PressureGauges from './PressureGauges';
import RealtimeGraphs from './RealtimeGraphs';
import QuestionsChartToggle from './QuestionsChartToggle';
import UniversalDiagnosticMachine from './UniversalDiagnosticMachine';

export default function ServiceAnalytics({ questionsData }) {
  const [severityCounts, setSeverityCounts] = useState({});
  
  const handleSeverityUpdate = (service, severity) => {
    setSeverityCounts((prev) => {
      const current = prev[service] || { HIGH: 0, MED: 0, LOW: 0 };
      return {
        ...prev,
        [service]: {
          ...current,
          [severity]: current[severity] + 1,
        },
      };
    });
  };

  return (
    <MetalBezel title="Service Analytics">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PressureGauges />
        <RealtimeGraphs />
      </div>

      {/* Universal Diagnostic Machine */}
      <div className="mt-4">
        <UniversalDiagnosticMachine onSeverityUpdate={handleSeverityUpdate} />
      </div>

      {/* Toggle between Bar and Donut */}
      <div className="mt-4">
        <QuestionsChartToggle data={questionsData} severityData={severityCounts} />
      </div>
    </MetalBezel>
  );
}
