'use client';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * EMERSONEIMS QR CODE GENERATOR
 * Professional QR Code Component for Business Use
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Uses: Business cards, brochures, vehicles, trade shows, equipment labels
 * 
 * © 2026 EmersonEIMS. All Rights Reserved.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useRef, useState } from 'react';

interface QRCodeProps {
  /** The data to encode (URL, phone, email, vCard, etc.) */
  data?: string;
  /** Size of the QR code in pixels */
  size?: number;
  /** QR code type preset */
  type?: 'website' | 'whatsapp' | 'phone' | 'email' | 'vcard' | 'custom';
  /** Background color */
  bgColor?: string;
  /** Foreground color */
  fgColor?: string;
  /** Show company logo in center */
  showLogo?: boolean;
  /** Show download button */
  showDownload?: boolean;
  /** Label text below QR code */
  label?: string;
  /** Additional CSS classes */
  className?: string;
}

// Company contact info - UPDATED WITH REAL EMERSONEIMS DETAILS
const COMPANY_INFO = {
  name: 'EmersonEIMS',
  fullName: 'Emerson Electrical & Instrumentation Management Services',
  website: 'https://www.emersoneims.com',
  phone: '0782914717',
  whatsapp: '0768860665', // Primary WhatsApp number
  email: 'info@emersoneims.com',
  address: 'P.O. Box 387-00521, Old North Airport Road, Nairobi, Kenya',
  tagline: 'Reliable Power. Without Limits.',
};

// Generate vCard string
const generateVCard = (): string => {
  return `BEGIN:VCARD
VERSION:3.0
FN:${COMPANY_INFO.fullName}
ORG:${COMPANY_INFO.name}
TEL;TYPE=WORK:${COMPANY_INFO.phone}
EMAIL:${COMPANY_INFO.email}
URL:${COMPANY_INFO.website}
ADR;TYPE=WORK:;;${COMPANY_INFO.address}
NOTE:${COMPANY_INFO.tagline}
END:VCARD`;
};

// Get data based on type
const getDataByType = (type: QRCodeProps['type'], customData?: string): string => {
  switch (type) {
    case 'website':
      return COMPANY_INFO.website;
    case 'whatsapp':
      return `https://wa.me/${COMPANY_INFO.whatsapp.replace(/\+/g, '')}?text=Hello%20EmersonEIMS%2C%20I%20would%20like%20to%20inquire%20about%20your%20services.`;
    case 'phone':
      return `tel:${COMPANY_INFO.phone}`;
    case 'email':
      return `mailto:${COMPANY_INFO.email}?subject=Inquiry%20from%20QR%20Code`;
    case 'vcard':
      return generateVCard();
    case 'custom':
    default:
      return customData || COMPANY_INFO.website;
  }
};

// Simple QR Code generation using Canvas API (no external dependencies)
const generateQRMatrix = (data: string, size: number = 21): boolean[][] => {
  // This is a simplified QR code generator
  // For production, consider using a library like 'qrcode' for proper error correction
  const matrix: boolean[][] = Array(size).fill(null).map(() => Array(size).fill(false));
  
  // Add finder patterns (corners)
  const addFinderPattern = (startX: number, startY: number) => {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        const isOuter = x === 0 || x === 6 || y === 0 || y === 6;
        const isInner = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        matrix[startY + y][startX + x] = isOuter || isInner;
      }
    }
  };
  
  addFinderPattern(0, 0); // Top-left
  addFinderPattern(size - 7, 0); // Top-right
  addFinderPattern(0, size - 7); // Bottom-left
  
  // Add timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }
  
  // Add data pattern (simplified - creates a pattern based on string hash)
  const hash = data.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  for (let y = 9; y < size - 8; y++) {
    for (let x = 9; x < size - 8; x++) {
      if (x !== 6 && y !== 6) {
        matrix[y][x] = ((hash >> ((x + y) % 32)) & 1) === 1;
      }
    }
  }
  
  return matrix;
};

export default function QRCodeGenerator({
  data,
  size = 200,
  type = 'website',
  bgColor = '#FFFFFF',
  fgColor = '#000000',
  showLogo = true,
  showDownload = true,
  label,
  className = '',
}: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const qrData = getDataByType(type, data);

  useEffect(() => {
    const generateQR = async () => {
      setIsLoading(true);
      
      // Use external QR code API for reliable generation
      const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(qrData)}&bgcolor=${bgColor.replace('#', '')}&color=${fgColor.replace('#', '')}&format=svg`;
      
      setQrDataUrl(apiUrl);
      setIsLoading(false);
    };

    generateQR();
  }, [qrData, size, bgColor, fgColor]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `EmersonEIMS-QR-${type}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'website': return 'Visit Our Website';
      case 'whatsapp': return 'Chat on WhatsApp';
      case 'phone': return 'Call Us';
      case 'email': return 'Email Us';
      case 'vcard': return 'Save Contact';
      default: return label || 'Scan Me';
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'website': return '🌐';
      case 'whatsapp': return '💬';
      case 'phone': return '📞';
      case 'email': return '📧';
      case 'vcard': return '👤';
      default: return '📱';
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* QR Code Container */}
      <div className="relative bg-white p-4 rounded-xl shadow-lg">
        {isLoading ? (
          <div 
            className="flex items-center justify-center bg-gray-100 animate-pulse"
            style={{ width: size, height: size }}
          >
            <span className="text-gray-400">Loading...</span>
          </div>
        ) : (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={qrDataUrl} 
              alt={`QR Code - ${getTypeLabel()}`}
              width={size}
              height={size}
              className="block"
            />
            
            {/* Center Logo Overlay */}
            {showLogo && (
              <div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-1 shadow-md"
                style={{ width: size * 0.22, height: size * 0.22 }}
              >
                <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">EIMS</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Label */}
      <div className="mt-3 text-center">
        <span className="text-2xl">{getTypeIcon()}</span>
        <p className="text-sm font-medium text-gray-700 mt-1">
          {label || getTypeLabel()}
        </p>
      </div>
      
      {/* Download Button */}
      {showDownload && (
        <button
          onClick={handleDownload}
          className="mt-3 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download QR
        </button>
      )}
    </div>
  );
}

/**
 * QR Code Gallery - Shows all QR code types
 */
export function QRCodeGallery() {
  const qrTypes: Array<{ type: QRCodeProps['type']; description: string }> = [
    { type: 'website', description: 'Direct link to website' },
    { type: 'whatsapp', description: 'Open WhatsApp chat' },
    { type: 'phone', description: 'Quick dial' },
    { type: 'email', description: 'Compose email' },
    { type: 'vcard', description: 'Save contact card' },
  ];

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          EmersonEIMS QR Codes
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Use these QR codes for business cards, brochures, vehicles, and more
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {qrTypes.map(({ type, description }) => (
            <div key={type} className="bg-gray-800 rounded-xl p-4">
              <QRCodeGenerator 
                type={type} 
                size={160}
                showDownload={true}
              />
              <p className="text-gray-400 text-xs text-center mt-2">{description}</p>
            </div>
          ))}
        </div>
        
        {/* Usage Instructions */}
        <div className="mt-12 bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-cyan-400 mb-4">📋 How to Use</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-300 text-sm">
            <div>
              <h3 className="font-semibold text-white mb-2">For Print Materials</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Download the SVG for best quality</li>
                <li>Minimum print size: 2cm x 2cm</li>
                <li>Ensure good contrast with background</li>
                <li>Test scan before mass printing</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Recommended Uses</h3>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Website:</strong> Business cards, brochures</li>
                <li><strong>WhatsApp:</strong> Vehicle stickers, posters</li>
                <li><strong>vCard:</strong> Business cards, trade shows</li>
                <li><strong>Phone:</strong> Emergency contact labels</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact QR for Footer/Sidebar
 */
export function CompactQR({ type = 'website' }: { type?: QRCodeProps['type'] }) {
  return (
    <div className="inline-block">
      <QRCodeGenerator 
        type={type} 
        size={100}
        showDownload={false}
        showLogo={false}
      />
    </div>
  );
}
