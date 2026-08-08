import * as React from 'react';
import { HubShell } from '@/components/hub/HubShell';
import ProductIntelligenceClient from '@/components/hub/ProductIntelligenceClient';

export const metadata = {
  /*
   * Dropped the ' — Solar & UPS Intelligence Hub' suffix. It spent ~30
   * characters of every search result repeating branding nobody types —
   * /hub ranked at position 34.7 for exactly that phrase. The root
   * template supplies ' | EmersonEIMS Kenya' instead, which at least
   * names the company. Visible Hub branding on the page is untouched.
   */
  title: 'Product Intelligence',
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
