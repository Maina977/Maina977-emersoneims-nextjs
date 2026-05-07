import * as React from 'react';
import { HubShell } from '@/components/hub/HubShell';
import ProductIntelligenceClient from '@/components/hub/ProductIntelligenceClient';

export const metadata = {
  title: 'Product Intelligence — Solar & UPS Intelligence Hub',
  description:
    'Searchable catalogue with stock, price, lead time and procurement notes.',
};

export default function ProductIntelligencePage() {
  return (
    <HubShell
      active="/hub/product-intelligence"
      title="Product Intelligence"
      caption="Catalogue index with stock and lead-time signals shared across audit, sizing and diagnostics."
    >
      <ProductIntelligenceClient />
    </HubShell>
  );
}
