import { bspFeatureMetadata, bspFeatureRedirect } from '@/lib/buildingSuitePro/featurePage';

export const metadata = bspFeatureMetadata('interior');
export default function Page() { bspFeatureRedirect('interior'); }
