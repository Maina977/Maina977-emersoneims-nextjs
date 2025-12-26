import React from 'react';

interface ServiceOverviewProps {
  title?: string;
  description?: string;
  image?: string;
  features?: string[];
  benefits?: string[];
  stats?: { label: string; value: string }[];
  className?: string;
}

export default function ServiceOverview({ className = "" }: ServiceOverviewProps) {
  const services = [
    {
      title: 'Generator Maintenance',
      description: 'Comprehensive maintenance services for all generator types',
      features: ['Preventive maintenance', 'Emergency repairs', 'Performance optimization'],
    },
    {
      title: 'Electrical Services',
      description: 'Complete electrical system installation and repair',
      features: ['Panel upgrades', 'Wiring installation', 'System testing'],
    },
    {
      title: 'Fuel System Services',
      description: 'Fuel system diagnostics and repair services',
      features: ['Fuel pump repair', 'Filter replacement', 'System cleaning'],
    },
    {
      title: 'Emergency Response',
      description: '24/7 emergency repair and maintenance services',
      features: ['Rapid response', 'On-site repairs', 'Parts replacement'],
    },
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}>
      {services.map((service, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            {service.title}
          </h3>
          <p className="text-gray-600 mb-4">
            {service.description}
          </p>
          <ul className="space-y-2">
            {service.features.map((feature, featureIndex) => (
              <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}