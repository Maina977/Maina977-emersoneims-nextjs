import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Diagnostic Cockpit - Real-time Generator Monitoring | EmersonEIMS',
  description: 'Advanced aerospace-style diagnostic cockpit for real-time generator monitoring. Live telemetry, pressure gauges, fault code tracking, and comprehensive system health analysis.',
  keywords: [
    'generator diagnostics',
    'real-time monitoring',
    'generator telemetry',
    'fault code analysis',
    'pressure monitoring',
    'generator health check',
    'diagnostic cockpit',
    'generator control room',
    'EmersonEIMS diagnostics'
  ],
  openGraph: {
    title: 'Diagnostic Cockpit - Real-time Generator Monitoring',
    description: 'Advanced aerospace-style diagnostic cockpit for comprehensive generator health monitoring',
    type: 'website',
  },
};

export default function DiagnosticCockpitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
