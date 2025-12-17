'use client';

export default function MetalBezel({ children, title }) {
  return (
    <div className="relative p-4 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 border-4 border-gray-600 rounded-lg shadow-inner">
      {/* Screws in corners */}
      <div className="absolute top-1 left-1 w-3 h-3 bg-gray-500 rounded-full border border-black"></div>
      <div className="absolute top-1 right-1 w-3 h-3 bg-gray-500 rounded-full border border-black"></div>
      <div className="absolute bottom-1 left-1 w-3 h-3 bg-gray-500 rounded-full border border-black"></div>
      <div className="absolute bottom-1 right-1 w-3 h-3 bg-gray-500 rounded-full border border-black"></div>

      {title && (
        <h2 className="text-sm font-bold text-gray-300 mb-2 tracking-widest">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
