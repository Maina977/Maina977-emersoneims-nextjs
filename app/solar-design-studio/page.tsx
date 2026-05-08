'use client';

/**
 * SOLAR DESIGN STUDIO - Interactive Solar Design Platform
 * Better Than Aurora Solar
 */

import dynamic from 'next/dynamic';
import B2BCommercialBand from '@/components/b2b/B2BCommercialBand';
import { B2B_PROFILES } from '@/lib/b2b/pageProfiles';

const SolarDesignStudioPro = dynamic(
  () => import('@/components/solar/SolarDesignStudioPro'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-amber-400 text-lg">Loading Solar Design Studio...</p>
          <p className="text-slate-500 text-sm mt-2">Interactive Roof Designer & SLD Generator</p>
        </div>
      </div>
    )
  }
);

export default function SolarDesignStudioPage() {
  return (
    <>
      <B2BCommercialBand profile={B2B_PROFILES.solarDesignStudio} />
      <SolarDesignStudioPro />
    </>
  );
}
