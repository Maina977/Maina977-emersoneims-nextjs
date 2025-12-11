'use client';

import UniversalDiagnosticMachine from '../componets/diagnostics/UniversalDiagnosticMachine';
import NineInOneCalculator from '../componets/diagnostics/NineInOneCalculator';
import ServiceAnalytics from '../componets/diagnostics/ServiceAnalytics';
import '../styles/diagnostics.css';

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
    <main className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="hero-diagnostics px-4 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            DIAGNOSTICS COCKPIT
          </h1>
          <p className="text-xl text-gray-400">
            Awwwards Winning Interface - Universal Power System Diagnostics
          </p>
        </div>
      </section>

      {/* Tool 1: Universal Diagnostic Machine */}
      <section className="px-4 mt-10">
        <UniversalDiagnosticMachine />
      </section>

      {/* Tool 2: Universal Engineering Calculator */}
      <section className="px-4 mt-10">
        <NineInOneCalculator />
      </section>

      {/* Tool 3: Gauges + Graphs + Charts */}
      <section className="px-4 mt-10 mb-20">
        <ServiceAnalytics questionsData={questionsData} />
      </section>
    </main>
  );
}

