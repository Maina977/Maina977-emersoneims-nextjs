'use client';

import { Suspense, lazy } from 'react';
import ScrollReveal from '@/components/gsap/ScrollReveal';

const NikeStyleServiceCard = lazy(() => import('./NikeStyleServiceCard'));

const services = [
  {
    title: 'Generator Systems',
    description: 'Premium diesel and gas generators engineered for reliability, efficiency, and performance. From 10 kVA to 2000 kVA, we power your future with Cummins, Perkins, and Caterpillar certified systems.',
    image: 'https://www.emersoneims.com/wp-content/uploads/2025/11/GEN-1-1-scaled.png',
    href: '/generators',
    stats: [
      { label: 'Models', value: '50+' },
      { label: 'Uptime', value: '99.2%' },
    ],
    tags: ['Diesel', 'Gas', 'Hybrid'],
  },
  {
    title: 'Solar Energy',
    description: 'Transform sunlight into sustainable power. Our solar solutions range from residential installations to large-scale commercial farms, delivering 45% average savings across Kenya.',
    image: 'https://www.emersoneims.com/wp-content/uploads/2025/11/SOLAR-IMAGE-KADENCE.png',
    href: '/solar',
    stats: [
      { label: 'Capacity', value: '10MW+' },
      { label: 'Savings', value: '45%' },
    ],
    tags: ['Residential', 'Commercial', 'Grid-Tie'],
  },
  {
    title: 'Intelligent Diagnostics',
    description: 'AI-powered diagnostic systems that predict, prevent, and optimize. Real-time monitoring for maximum uptime and efficiency with 98.7% accuracy.',
    image: '/images/premium/control-panel-main.jpg',
    href: '/diagnostics',
    stats: [
      { label: 'Accuracy', value: '98.7%' },
      { label: 'Response', value: '<1min' },
    ],
    tags: ['AI', 'Real-time', 'Predictive'],
  },
];

export default function ServicesShowcase() {
  return (
    <section className="section-spacing-xl bg-black">
      <div className="container-wide container-spacing">
        <ScrollReveal direction="up" delay={0}>
          <div className="text-center mb-16">
            <h2 className="text-display-1 font-display text-white mb-4">
              Our Solutions
            </h2>
            <p className="text-body-large text-text-secondary max-w-2xl mx-auto">
              Premium energy infrastructure solutions engineered for excellence,
              designed for the future.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ScrollReveal
              key={service.href}
              direction="up"
              delay={index * 0.1}
            >
              <Suspense fallback={
                <div className="h-96 bg-gray-900 rounded-2xl animate-pulse" />
              }>
                <NikeStyleServiceCard
                  {...service}
                  index={index}
                />
              </Suspense>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

