import { Metadata } from 'next';
import InteractiveDiagnosticJourney from '@/components/diagnostics/InteractiveDiagnosticJourney';

export const metadata: Metadata = {
  title: 'Diagnostic Journey - 5,930 Generator Error Codes | EmersonEIMS',
  description: 'Interactive journey through the world\'s largest generator error code database. Instant diagnosis for Cummins, Caterpillar, Perkins, FG Wilson, Kohler, MTU generators. Real solutions in 12 minutes average.',
  keywords: 'generator error codes, diagnostic journey, Cummins codes, Caterpillar codes, generator troubleshooting, interactive diagnostics, 5930 error codes',
};

export default function DiagnosticJourneyPage() {
  return <InteractiveDiagnosticJourney />;
}
