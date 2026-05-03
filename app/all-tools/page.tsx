import { bspFeatureMetadata, bspFeatureRedirect } from '@/lib/buildingSuitePro/featurePage';

export const metadata = bspFeatureMetadata('all-tools');
export default function Page() { bspFeatureRedirect('all-tools'); }
