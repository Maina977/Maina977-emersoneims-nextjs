import { bspFeatureMetadata, bspFeatureRedirect } from '@/lib/buildingSuitePro/featurePage';

export const metadata = bspFeatureMetadata('curation');
export default function Page() { bspFeatureRedirect('curation'); }
