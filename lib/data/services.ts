/**
 * Complete Services Data - All 10 Services
 * Single source of truth for all services
 */

export const ALL_SERVICES = [
  {
    id: 'solar-systems',
    name: 'Solar Systems',
    slug: 'solar',
    description: 'Complete solar energy solutions from residential to commercial installations',
    icon: '☀️',
    category: 'Renewable Energy',
    href: '/service/solar',
    image: 'https://www.emersoneims.com/wp-content/uploads/2025/11/SOLAR-IMAGE-KADENCE.png',
  },
  {
    id: 'diesel-generators',
    name: 'Diesel Generators',
    slug: 'generators',
    description: 'Premium diesel and gas generators from 10kVA to 2000kVA',
    icon: '⚡',
    category: 'Power Generation',
    href: '/service/generators',
    image: 'https://www.emersoneims.com/wp-content/uploads/2025/11/GEN-1-1-scaled.png',
  },
  {
    id: 'controls',
    name: 'Controls',
    slug: 'controls',
    description: 'Advanced control systems for generator automation and monitoring',
    icon: '🎛️',
    category: 'Automation',
    href: '/service/controls',
    image: 'https://www.emersoneims.com/wp-content/uploads/2025/11/controls.jpg',
  },
  {
    id: 'ac-ups',
    name: 'AC & UPS',
    slug: 'ac-ups',
    description: 'Air conditioning and uninterruptible power supply systems',
    icon: '❄️',
    category: 'Climate Control',
    href: '/service/ac-ups',
    image: '/images/premium/ac-installation.jpg',
  },
  {
    id: 'automation',
    name: 'Automation',
    slug: 'automation',
    description: 'Smart automation solutions for energy infrastructure',
    icon: '🤖',
    category: 'Automation',
    href: '/service/automation',
    image: '/images/premium/premium-infrastructure.jpg',
  },
  {
    id: 'pumps',
    name: 'Pumps',
    slug: 'pumps',
    description: 'Water pumping systems and borehole solutions',
    icon: '💧',
    category: 'Water Systems',
    href: '/service/pumps',
    image: '/images/premium/borehole-drill.jpg',
  },
  {
    id: 'incinerators',
    name: 'Incinerators',
    slug: 'incinerators',
    description: 'Waste management and incineration systems',
    icon: '🔥',
    category: 'Waste Management',
    href: '/service/incinerators',
    image: '/images/premium/incinerator-system.jpg',
  },
  {
    id: 'motors-rewinding',
    name: 'Motors/Rewinding',
    slug: 'motors',
    description: 'Motor repair, rewinding, and maintenance services',
    icon: '⚙️',
    category: 'Maintenance',
    href: '/service/motors',
    image: '/images/premium/motor-winding.jpg',
  },
  {
    id: 'fabrication',
    name: 'Fabrication',
    slug: 'fabrication',
    description: 'Metal fabrication and custom engineering solutions',
    icon: '🔧',
    category: 'Manufacturing',
    href: '/service/fabrication',
    image: '/images/premium/metal-fabrication.jpg',
  },
  {
    id: 'diagnostics-hub',
    name: 'Diagnostics Hub',
    slug: 'diagnostics',
    description: 'AI-powered diagnostic systems for predictive maintenance',
    icon: '🔍',
    category: 'Technology',
    href: '/diagnostics',
    image: '/images/premium/control-panel-main.jpg',
  },
] as const;

export type ServiceId = typeof ALL_SERVICES[number]['id'];
export type ServiceSlug = typeof ALL_SERVICES[number]['slug'];

export function getServiceById(id: ServiceId) {
  return ALL_SERVICES.find(service => service.id === id);
}

export function getServiceBySlug(slug: ServiceSlug) {
  return ALL_SERVICES.find(service => service.slug === slug);
}

export function getServicesByCategory(category: string) {
  return ALL_SERVICES.filter(service => service.category === category);
}

