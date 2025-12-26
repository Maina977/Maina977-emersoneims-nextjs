import React from 'react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  features?: string[];
  image?: string;
  href?: string;
  color?: string;
  index?: number;
  className?: string;
}

export default function ServiceCard({
  title,
  description,
  icon,
  features = [],
  className = ""
}: ServiceCardProps) {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${className}`}>
      {icon && (
        <div className="mb-4">
          {icon}
        </div>
      )}

      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {title}
      </h3>

      <p className="text-gray-600 mb-4">
        {description}
      </p>

      {features.length > 0 && (
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm text-gray-700">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
              {feature}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}