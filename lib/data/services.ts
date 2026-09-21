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
    href: '/service#solar',
    image: '/images/solar%20power%20farms.png',
  },
  {
    id: 'diesel-generators',
    name: 'Diesel Generators',
    slug: 'generators',
    description: 'Premium diesel and gas generators from 10kVA to 2000kVA',
    icon: '⚡',
    category: 'Power Generation',
    href: '/generators',
    image: '/images/GEN%202-1920x1080.png',
  },
  {
    id: 'controls',
    name: 'Controls',
    slug: 'controls',
    description: 'Advanced control systems for generator automation and monitoring',
    icon: '🎛️',
    category: 'Automation',
    href: '/service#opt',
    image: '/images/solar%20changeover%20control.png',
  },
  {
    id: 'ac-ups',
    name: 'AC & UPS',
    slug: 'ac-ups',
    description: 'Air conditioning and uninterruptible power supply systems',
    icon: '❄️',
    category: 'Climate Control',
    href: '/service#ups',
    image: 'https://www.emersoneims.com/wp-content/uploads/2025/11/ac-systems.jpg',
  },
  {
    id: 'automation',
    name: 'Automation',
    slug: 'automation',
    description: 'Smart automation solutions for energy infrastructure',
    icon: '🤖',
    category: 'Automation',
    href: '/service#opt',
    image: 'https://www.emersoneims.com/wp-content/uploads/2025/11/automation.jpg',
  },
  {
    id: 'pumps',
    name: 'Pumps',
    slug: 'pumps',
    description: 'Water pumping systems and borehole solutions',
    icon: '💧',
    category: 'Water Systems',
    href: '/service#water',
    image: 'https://www.emersoneims.com/wp-content/uploads/2025/11/pumps.jpg',
  },
  {
    id: 'incinerators',
    name: 'Incinerators',
    slug: 'incinerators',
    description: 'Waste management and incineration systems',
    icon: '🔥',
    category: 'Waste Management',
    href: '/service#incin',
    image: 'https://www.emersoneims.com/wp-content/uploads/2025/11/incinerators.jpg',
  },
  {
    id: 'motors-rewinding',
    name: 'Motors/Rewinding',
    slug: 'motors',
    description: 'Motor repair, rewinding, and maintenance services',
    icon: '⚙️',
    category: 'Maintenance',
    href: '/service#motor',
    image: 'https://www.emersoneims.com/wp-content/uploads/2025/11/motors.jpg',
  },
  {
    id: 'fabrication',
    name: 'Fabrication',
    slug: 'fabrication',
    description: 'Metal fabrication and custom engineering solutions',
    icon: '🔧',
    category: 'Manufacturing',
    href: '/service#fab',
    image: '/images/ENGINE%20PARTS.png',
  },
  {
    id: 'diagnostics-hub',
    name: 'Diagnostics Hub',
    slug: 'diagnostics',
    description: 'AI-powered diagnostic systems for predictive maintenance',
    icon: '🔍',
    category: 'Technology',
    href: '/diagnostics',
    image: '/images/Multimeter.png',
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

