import { bspFeatureMetadata, bspFeatureRedirect } from '@/lib/buildingSuitePro/featurePage';

export const metadata = bspFeatureMetadata('high-rise');
export default function Page() { bspFeatureRedirect('high-rise'); }
