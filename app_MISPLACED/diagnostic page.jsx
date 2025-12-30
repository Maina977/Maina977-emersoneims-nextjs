'use client';

import KnobCursor from '@/components/diagnostics/KnobCursor';
import HeroDiagnostics from '@/components/diagnostics/HeroDiagnostics';
import UniversalDiagnosticMachine from '@/components/diagnostics/UniversalDiagnosticMachine'; // create this
import NineInOneCalculator from '@/components/diagnostics/NineInOneCalculator';
import ServiceAnalytics from '@/components/diagnostics/ServiceAnalytics';
import TrustRow from '@/components/diagnostics/TrustRow';
import '@/styles/diagnostics.css';

export default function DiagnosticsPage() {
  const questionsData = [
    { service: 'Solar Systems', count: 120 },
    { service: 'Diesel Generators', count: 95 },
    { service: 'Controls', count: 80 },
    { service: 'AC & UPS', count: 60 },
    { service: 'Automation', count: 70 },
    { service: 'Pumps', count: 50 },
    { service: 'Incinerators', count: 40 },
    { service: 'Motors/Rewinding', count: 55 },
    { service: 'Diagnostics Hub', count: 200 },
  ];

  return (
    <main className="bg-black text-white">
      <KnobCursor />
      <HeroDiagnostics />

      {/* Tool 1: Universal Diagnostic Machine */}
      <section className="px-4 mt-10">
        <UniversalDiagnosticMachine />
      </section>

      {/* Tool 2: Universal Engineering Calculator */}
      <section className="px-4 mt-10">
        <NineInOneCalculator />
      </section>

      {/* Tool 3: Gauges + Graphs + Charts */}
      <section className="px-4 mt-10">
        <ServiceAnalytics questionsData={questionsData} />
      </section>

      <TrustRow />
    </main>
  );
}
<ServiceAnalytics questionsData={questionsData} />
import useSimulatedDiagnostics from '../hooks/useSimulatedDiagnostics';
import ServiceAnalytics from '../components/diagnostics/ServiceAnalytics';
import ErrorList from '../components/diagnostics/ErrorList';

export default function DiagnosticPage() {
  const { severityCounts, telemetry, errors } = useSimulatedDiagnostics();

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <header className="flex items-center justify-between p-4 border-b border-gray-700">
        <img src="/logo.png" alt="EmersonEIMS Logo" className="h-12" />
        <span className="text-yellow-400">Reliable Power. Without Limits.</span>
      </header>

      <ServiceAnalytics severityCounts={severityCounts} telemetry={telemetry} />

      <ErrorList errors={errors} />
    </div>
  );
}
