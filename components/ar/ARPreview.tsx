'use client';

/**
 * AR PREVIEW COMPONENT
 * WebXR-based AR preview for products
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ARPreviewProps {
  productName: string;
  modelUrl?: string;
  qrCodeUrl?: string;
}

export default function ARPreview({ productName, modelUrl, qrCodeUrl }: ARPreviewProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const arContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check WebXR support
    if (typeof navigator !== 'undefined' && 'xr' in navigator) {
      (navigator as any).xr?.isSessionSupported('immersive-ar').then((supported: boolean) => {
        setIsSupported(supported);
      });
    }
  }, []);

  const startAR = async () => {
    if (!isSupported) {
      alert('AR is not supported on your device. Please use a compatible mobile device.');
      return;
    }

    try {
      // In production, this would initialize WebXR session
      // For now, we'll show a QR code for mobile AR
      setIsActive(true);
    } catch (error) {
      console.error('AR initialization failed:', error);
      alert('Failed to start AR. Please try again.');
    }
  };

  return (
    <>
      <button
        onClick={startAR}
        className="px-6 py-3 bg-gradient-to-r from-brand-gold to-yellow-600 text-black font-semibold rounded-lg hover:from-yellow-400 hover:to-brand-gold transition-all flex items-center gap-2"
      >
        <span>📱</span>
        View in AR
      </button>

      <AnimatePresence>
        {isActive && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsActive(false)}
          >
            <motion.div
              className="bg-gray-900 rounded-2xl p-8 max-w-md text-center border border-gray-800"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-white mb-4">
                View {productName} in AR
              </h3>
              
              {isSupported ? (
                <>
                  <p className="text-gray-400 mb-6">
                    AR is supported! Click below to start the AR experience.
                  </p>
                  <div className="bg-white p-6 rounded-lg mb-6">
                    {/* QR Code for mobile AR */}
                    <div className="w-64 h-64 bg-gray-200 mx-auto flex items-center justify-center rounded">
                      {qrCodeUrl ? (
                        <img src={qrCodeUrl} alt="AR QR Code" className="w-full h-full object-contain" />
                      ) : (
                        <div className="text-gray-500">QR Code</div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-6">
                    Scan with your mobile device camera to view in AR
                  </p>
                  <button
                    onClick={() => {
                      // In production, this would start WebXR session
                      window.open(`/ar/${productName.toLowerCase().replace(/\s+/g, '-')}`, '_blank');
                    }}
                    className="w-full cta-button-primary mb-4"
                  >
                    Start AR Experience
                  </button>
                </>
              ) : (
                <>
                  <p className="text-gray-400 mb-6">
                    AR requires a compatible mobile device. Scan the QR code with your phone's camera.
                  </p>
                  <div className="bg-white p-6 rounded-lg mb-6">
                    <div className="w-64 h-64 bg-gray-200 mx-auto flex items-center justify-center rounded">
                      {qrCodeUrl ? (
                        <img src={qrCodeUrl} alt="AR QR Code" className="w-full h-full object-contain" />
                      ) : (
                        <div className="text-gray-500">QR Code</div>
                      )}
                    </div>
                  </div>
                </>
              )}
              
              <button
                onClick={() => setIsActive(false)}
                className="w-full px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}




