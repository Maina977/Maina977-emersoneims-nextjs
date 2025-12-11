'use client';
import { useState } from 'react';
import MetalBezel from '@/components/diagnostics/MetalBezel';
import PressureGauges from '@/components/diagnostics/PressureGauges';
import RealtimeGraphs from '@/components/diagnostics/RealtimeGraphs';
import QuestionsChartToggle from '@/components/diagnostics/QuestionsChartToggle';
import UniversalDiagnosticMachine from '@/components/diagnostics/UniversalDiagnosticMachine';

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
