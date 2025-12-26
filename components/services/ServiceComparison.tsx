import React from 'react';

interface ServiceComparisonProps {
  services?: any[];
  className?: string;
}

export default function ServiceComparison({ services = [], className = "" }: ServiceComparisonProps) {
  const defaultServices = [
    {
      name: 'Basic Service',
      price: '$299',
      features: [
        'Visual inspection',
        'Basic maintenance',
        'Performance check',
        '30-day warranty',
      ],
    },
    {
      name: 'Standard Service',
      price: '$499',
      features: [
        'Complete diagnostics',
        'All basic services',
        'Parts replacement',
        '90-day warranty',
        'Priority scheduling',
      ],
      popular: true,
    },
    {
      name: 'Premium Service',
      price: '$799',
      features: [
        'All standard services',
        'Advanced diagnostics',
        'Performance optimization',
        'Extended warranty',
        '24/7 support',
        'Preventive maintenance plan',
      ],
    },
  ];

  const displayServices = services && services.length > 0 ? services : defaultServices;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
      {displayServices.map((service, index) => (
        <div
          key={index}
          className={`relative bg-white p-6 rounded-lg shadow-md ${
            service.popular ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          {service.popular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
          )}

          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {service.name}
            </h3>
            <div className="text-3xl font-bold text-blue-600">
              {service.price}
            </div>
            <div className="text-sm text-gray-500">per service</div>
          </div>

          <ul className="space-y-3">
            {service.features.map((feature: string, featureIndex: number) => (
              <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                <svg
                  className="w-4 h-4 text-green-500 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          <button
            className={`w-full mt-6 px-4 py-2 rounded-md font-medium transition-colors ${
              service.popular
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            Choose {service.name}
          </button>
        </div>
      ))}
    </div>
  );
}