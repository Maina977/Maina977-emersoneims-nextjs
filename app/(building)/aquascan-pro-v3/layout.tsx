import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AquaScan Pro V3 - AI Borehole Analyzer | EmersonEIMS',
  description: 'The world\'s most advanced AI-powered borehole pre-assessment analyzer. 26 AI engines, NASA GRACE/GLDAS integration, comprehensive charts, graphs, and maps. 195+ countries coverage.',
  keywords: 'borehole drilling, groundwater analysis, AI borehole, water well, Kenya drilling, AquaScan Pro, EmersonEIMS, NASA GRACE, GLDAS, geophysical survey',
  openGraph: {
    title: 'AquaScan Pro V3 - AI Borehole Analyzer',
    description: '26 AI Engines | Charts & Graphs | NASA Integration | 195+ Countries',
    type: 'website',
    siteName: 'EmersonEIMS',
  },
};

export default function AquaScanProV3Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
