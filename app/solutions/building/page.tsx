import dynamic from 'next/dynamic';
import type { Metadata } from 'next';

const ProBuildingSuiteV3 = dynamic(() => import('@/components/building/ProBuildingSuiteV3'), {
  loading: () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white text-xl font-bold">Loading Pro Building Suite™ V3...</p>
        <p className="text-indigo-400 text-sm mt-2">WORLD&apos;S #1 AI CONSTRUCTION PLATFORM</p>
        <p className="text-gray-500 text-xs mt-1">75+ AI Engines - 195+ Countries - 99.8% Accuracy</p>
      </div>
    </div>
  )
});

export const metadata: Metadata = {
  title: 'Pro Building Suite™ V3 | World\'s #1 AI Construction Platform | EmersonEIMS',
  description: 'The world\'s most advanced AI construction platform. 75+ AI engines, 195+ countries, 99.8% accuracy. Complete architecture, structural engineering, and quantity surveying. Like Autodesk Revit but with AI.',
  keywords: [
    'AI construction', 'building cost estimator', 'quantity surveyor AI', 'BOQ generator',
    'construction planning', 'site analysis', '3D house design', 'building permits',
    'construction materials', 'Kenya construction', 'Africa building', 'real estate development',
    'architect AI', 'engineering AI', 'construction ecosystem', 'AI architecture',
    'AI structural engineer', 'generative design', 'BIM AI', 'construction risk prediction',
    'carbon footprint construction', 'self-learning AI', 'professional BOQ'
  ],
  openGraph: {
    title: 'Pro Building Suite™ V3 | Universal AI Construction Platform',
    description: 'AI-powered construction platform: 75+ AI engines for architecture, structural engineering, and quantity surveying with 99.8% accuracy.',
    images: ['/images/pro-building-suite-og.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pro Building Suite™ V3 | AI Construction Platform',
    description: 'The world\'s most advanced AI construction platform with 75+ AI engines and 99.8% accuracy.',
  }
};

export default function BuildingPage() {
  return <ProBuildingSuiteV3 />;
}
