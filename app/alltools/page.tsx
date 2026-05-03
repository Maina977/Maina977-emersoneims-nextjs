import { bspFeatureMetadata, bspFeatureRedirect } from '@/lib/buildingSuitePro/featurePage';

export const metadata = bspFeatureMetadata('alltools');
export default function Page() { bspFeatureRedirect('alltools'); }
