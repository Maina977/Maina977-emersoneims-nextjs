import { bspFeatureMetadata, bspFeatureRedirect } from '@/lib/buildingSuitePro/featurePage';

export const metadata = bspFeatureMetadata('qs');
export default function Page() { bspFeatureRedirect('qs'); }
