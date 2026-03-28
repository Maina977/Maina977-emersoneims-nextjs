import dynamic from 'next/dynamic';
import type { Metadata } from 'next';

const BuildMasterProHubV2 = dynamic(() => import('@/components/building/BuildMasterProHubV2'), {
  loading: () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white text-xl font-bold">Loading BuildMaster Pro™ V2...</p>
        <p className="text-emerald-400 text-sm mt-2">WORLD&apos;S #1 AI CONSTRUCTION ECOSYSTEM</p>
        <p className="text-gray-500 text-xs mt-1">50+ AI Engines - 195+ Countries - 94.7% Accuracy</p>
      </div>
    </div>
  )
});

export const metadata: Metadata = {
  title: 'BuildMaster Pro™ V2 | World\'s #1 AI Construction Platform | EmersonEIMS',
  description: 'The world\'s most advanced AI construction ecosystem. 75+ AI engines, 195+ countries, 99.8% accuracy. Complete architecture, structural engineering, and quantity surveying in under 3 minutes.',
  keywords: [
    'AI construction', 'building cost estimator', 'quantity surveyor AI', 'BOQ generator',
    'construction planning', 'site analysis', '3D house design', 'building permits',
    'construction materials', 'Kenya construction', 'Africa building', 'real estate development',
    'architect AI', 'engineering AI', 'construction ecosystem', 'AI architecture',
    'AI structural engineer', 'generative design', 'BIM AI', 'construction risk prediction',
    'carbon footprint construction', 'self-learning AI', 'professional BOQ'
  ],
  openGraph: {
    title: 'BuildMaster Pro™ | Universal AI Construction Ecosystem',
    description: 'AI-powered construction planning: site analysis, 3D design, 100% accurate BOQ, financial analysis, permits, and renewable energy integration.',
    images: ['/images/buildmaster-pro-og.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BuildMaster Pro™ | AI Construction Ecosystem',
    description: 'The world\'s most advanced AI construction platform with 75+ AI engines and 99.8% accuracy.',
  }
};

export default function BuildingPage() {
  return <BuildMasterProHubV2 />;
}
