import { bspFeatureMetadata, bspFeatureRedirect } from '@/lib/buildingSuitePro/featurePage';

export const metadata = bspFeatureMetadata('safety');
export default function Page() { bspFeatureRedirect('safety'); }
