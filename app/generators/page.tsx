/**
 * /generators (server). Renders the static sections on the server and hands
 * them to the interactive page, so only the interactive parts hydrate.
 */
import GeneratorPage from './GeneratorsPageClient';
import {
  GeneratorBibleHub,
  UrgencySection,
  TransparentPricing,
  WhyChooseUs,
  BrandComparisonTable,
  GeneratorLeasingSection,
  DownloadsSection,
  GuaranteeSection,
} from './GeneratorsStaticSections';

export default function GeneratorsRoute() {
  return (
    <GeneratorPage
      staticSections={{
        GeneratorBibleHub: <GeneratorBibleHub />,
        UrgencySection: <UrgencySection />,
        TransparentPricing: <TransparentPricing />,
        WhyChooseUs: <WhyChooseUs />,
        BrandComparisonTable: <BrandComparisonTable />,
        GeneratorLeasingSection: <GeneratorLeasingSection />,
        DownloadsSection: <DownloadsSection />,
        GuaranteeSection: <GuaranteeSection />,
      }}
    />
  );
}
