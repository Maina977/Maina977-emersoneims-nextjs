import { bspFeatureMetadata, bspFeatureRedirect } from '@/lib/buildingSuitePro/featurePage';

export const metadata = bspFeatureMetadata('pro-console');
export default function Page() { bspFeatureRedirect('pro-console'); }
