import React from 'react';

interface SectionLeadProps {
  title?: string;
  subtitle?: string;
  centered?: boolean;
  showWebGL?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export default function SectionLead({
  title = "Section Title",
  subtitle,
  centered = false,
  showWebGL = false,
  children,
  className = ""
}: SectionLeadProps) {
  const containerClasses = centered
    ? "text-center mb-12"
    : "mb-12";

  return (
    <div className={`${containerClasses} ${className}`}>
      {title && (
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="text-lg text-gray-600 mb-6">
          {subtitle}
        </p>
      )}
      {children}
      {showWebGL && (
        <div className="mt-4">
          {/* WebGL content would go here */}
        </div>
      )}
    </div>
  );
}