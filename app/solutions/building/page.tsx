import dynamic from 'next/dynamic';
import type { Metadata } from 'next';

const BuildMasterProHub = dynamic(() => import('@/components/building/BuildMasterProHub'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white text-xl font-bold">Loading BuildMaster Pro™...</p>
        <p className="text-emerald-400 text-sm mt-2">Universal AI Construction Ecosystem</p>
      </div>
    </div>
  )
});

export const metadata: Metadata = {
  title: 'BuildMaster Pro™ | AI Construction Ecosystem | EmersonEIMS',
  description: 'The world\'s first universal AI construction platform. AI site analysis, 3D design, quantity surveying, BOQ generation, financial analysis, permits, and solar/borehole integration. Better than Autodesk.',
  keywords: [
    'AI construction', 'building cost estimator', 'quantity surveyor AI', 'BOQ generator',
    'construction planning', 'site analysis', '3D house design', 'building permits',
    'construction materials', 'Kenya construction', 'Africa building', 'real estate development',
    'architect AI', 'engineering AI', 'construction ecosystem', 'better than Autodesk'
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
    description: 'The world\'s first universal AI construction platform - better than Autodesk.',
  }
};

export default function BuildingPage() {
  return <BuildMasterProHub />;
}
