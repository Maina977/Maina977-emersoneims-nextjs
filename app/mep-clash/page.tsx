import { bspFeatureMetadata, bspFeatureRedirect } from '@/lib/buildingSuitePro/featurePage';

export const metadata = bspFeatureMetadata('mep-clash');
export default function Page() { bspFeatureRedirect('mep-clash'); }
