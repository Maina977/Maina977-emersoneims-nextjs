import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Generator Maintenance & Engine Overhaul Services Kenya | All 47 Counties | EmersonEIMS',
  description: 'Expert generator maintenance, engine overhaul, repair & servicing across all 47 Kenya counties. Certified technicians for Cummins, Caterpillar, Perkins, FG Wilson, Kohler, MTU, Deutz generators. 24/7 emergency service. Call 0768860655.',
  keywords: [
    'generator maintenance Kenya', 'generator repair Kenya', 'generator servicing Kenya',
    'engine overhaul Kenya', 'generator engine rebuild', 'diesel generator maintenance',
    'Cummins generator service Kenya', 'Caterpillar generator maintenance', 'Perkins generator repair',
    'FG Wilson generator service', 'Kohler generator maintenance', 'MTU generator repair',
    'generator maintenance Nairobi', 'generator repair Mombasa', 'generator service Kisumu',
    'preventive generator maintenance', 'generator load bank testing', 'generator oil change',
  ],
  openGraph: {
    title: 'Generator Maintenance & Engine Overhaul | All 47 Counties | EmersonEIMS',
    description: 'Kenya\'s leading generator maintenance company. Expert engine overhauls, repairs & servicing for all brands across all 47 counties.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.emersoneims.com/generators/maintenance',
  },
};

export default function MaintenanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
