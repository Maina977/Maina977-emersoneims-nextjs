import { Metadata } from 'next';
import HospitalBlackoutStory from '@/components/case-studies/HospitalBlackoutStory';

export const metadata: Metadata = {
  title: 'Hospital Blackout Prevention - 47 Lives Saved | EmersonEIMS Case Study',
  description: 'True story: How EmersonEIMS prevented tragedy at Kivukoni Hospital with 51-minute emergency generator installation. 47 patients on life support. 3 critical surgeries. Zero casualties.',
  keywords: 'hospital backup power, emergency generator, Kivukoni Hospital, power failure prevention, lives saved, 24/7 emergency service, generator installation Kenya',
};

export default function HospitalBlackoutPage() {
  return <HospitalBlackoutStory />;
}
