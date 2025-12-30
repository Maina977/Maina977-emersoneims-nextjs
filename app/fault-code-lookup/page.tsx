// app/fault-code-lookup/page.tsx
import FaultCodeLookup from '@/components/diagnostics/FaultCodeLookup';

export const metadata = {
  title: 'Fault Code Lookup | EmersonEIMS Diagnostic Suite',
  description: 'Search 6000+ verified generator error codes across Cummins, Perkins, Caterpillar, DeepSea, PowerCommand and more. Get detailed solutions, parts lists, and expert guidance.',
  keywords: 'fault code lookup, generator error codes, Cummins fault codes, Perkins error codes, Caterpillar diagnostic codes, DeepSea codes, PowerCommand codes'
};

export default function FaultCodeLookupPage() {
  return <FaultCodeLookup />;
}
