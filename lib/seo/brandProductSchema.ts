/**
 * Product identity for the brand pages' JSON-LD (Change Set C v2, 2026-11-12).
 *
 * The only prices those pages carry are the owner-confirmed VOLTKA list
 * prices (lib/pricing/voltkaConfirmedPrices.ts), and they are shown only for
 * the Cummins brand because VOLTKA sets use Cummins engines. A Product that
 * carries those prices is therefore the VOLTKA generator set: brand VOLTKA,
 * with Cummins named as the engine manufacturer. A Product without prices
 * keeps exactly the identity it had before.
 *
 * Used by app/brands/[brand]/page.tsx and app/brands/[brand]/kenya/[location]/page.tsx
 * so the parent page and its ten county variants cannot drift apart.
 * No engine model numbers: they are confirmed on quotation.
 */
export const VOLTKA_PRODUCT_DESCRIPTION =
  'New VOLTKA generator sets with Cummins engines. Published prices: prime rated, ex-warehouse, excluding VAT, ATS, delivery, installation and commissioning.';

export interface BrandProductIdentity {
  name: string;
  description: string;
  brand: { '@type': 'Brand'; name: string };
  additionalProperty?: { '@type': 'PropertyValue'; name: string; value: string }[];
}

/**
 * @param brand            the engine/make brand the page is about
 * @param carriesVoltkaPrices true when the Product's offers are the VOLTKA price band
 * @param place            county name for the /kenya/<county> variants
 */
export function brandProductIdentity(
  brand: { name: string; description: string },
  carriesVoltkaPrices: boolean,
  place?: string,
): BrandProductIdentity {
  if (!carriesVoltkaPrices) {
    return {
      name: place ? `${brand.name} Generators in ${place}` : `${brand.name} Generators`,
      description: place ? `${brand.description}. Available in ${place}, Kenya.` : brand.description,
      brand: { '@type': 'Brand', name: brand.name },
    };
  }
  return {
    name: place ? `VOLTKA generators with Cummins engines in ${place}` : 'VOLTKA generators with Cummins engines',
    description: place ? `${VOLTKA_PRODUCT_DESCRIPTION} Available in ${place}, Kenya.` : VOLTKA_PRODUCT_DESCRIPTION,
    brand: { '@type': 'Brand', name: 'VOLTKA' },
    additionalProperty: [{ '@type': 'PropertyValue', name: 'Engine manufacturer', value: 'Cummins' }],
  };
}
