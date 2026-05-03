import { bspFeatureMetadata, bspFeatureRedirect } from '@/lib/buildingSuitePro/featurePage';

export const metadata = bspFeatureMetadata('collab');
export default function Page() { bspFeatureRedirect('collab'); }
