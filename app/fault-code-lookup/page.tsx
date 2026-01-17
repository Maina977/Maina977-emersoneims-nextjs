// app/fault-code-lookup/page.tsx
import FaultCodeLookup from '@/components/diagnostics/FaultCodeLookup';

export const metadata = {
  title: 'Fault Code Lookup | EmersonEIMS Diagnostic Suite - 13,500+ Codes',
  description: 'Search 13,500+ verified generator error codes across Cummins, Perkins, Caterpillar, DeepSea, PowerCommand, Volvo, MTU, Deutz, Kohler, Generac and more. Get detailed solutions, parts lists, and expert guidance.',
  keywords: 'fault code lookup, generator error codes, Cummins fault codes, Perkins error codes, Caterpillar diagnostic codes, DeepSea codes, PowerCommand codes, Volvo generator codes, MTU fault codes'
};

export default function FaultCodeLookupPage() {
  return <FaultCodeLookup />;
}
