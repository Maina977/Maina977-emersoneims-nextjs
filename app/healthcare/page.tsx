import { bspFeatureMetadata, bspFeatureRedirect } from '@/lib/buildingSuitePro/featurePage';

export const metadata = bspFeatureMetadata('healthcare');
export default function Page() { bspFeatureRedirect('healthcare'); }
