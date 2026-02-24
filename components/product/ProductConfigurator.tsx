'use client';

/**
 * INTERACTIVE PRODUCT CONFIGURATOR
 * Tesla Model 3-style configurator for generators
 */

import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { OrbitControls, PerspectiveCamera, Environment, Lightformer } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfigOption {
  id: string;
  name: string;
  value: string;
  price?: number;
}

interface ProductConfiguratorProps {
  productName: string;
  options: {
    category: string;
    options: ConfigOption[];
  }[];
  onConfigChange?: (config: Record<string, string>) => void;
}

function ProductModel({ config }: { config: Record<string, string> }) {
  const meshRef = useRef<Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  // Color based on config
  const color = config.color === 'gold' ? '#fbbf24' : config.color === 'blue' ? '#4a90e2' : '#ffffff';

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[3, 2, 2]} />
      <meshStandardMaterial
        color={color}
        metalness={0.8}
        roughness={0.2}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

export default function ProductConfigurator({
  productName,
  options,
  onConfigChange,
}: ProductConfiguratorProps) {
  const [config, setConfig] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    options.forEach(({ category, options: opts }) => {
      if (opts.length > 0) {
        initial[category] = opts[0].value;
      }
    });
    return initial;
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [isPreviewing, setIsPreviewing] = useState(false);

  useEffect(() => {
    let price = 0;
    options.forEach(({ category, options: opts }) => {
      const selected = opts.find(opt => opt.value === config[category]);
      if (selected?.price) {
        price += selected.price;
      }
    });
    setTotalPrice(price);
    onConfigChange?.(config);
  }, [config, options, onConfigChange]);

  const handleOptionChange = (category: string, value: string) => {
    setConfig(prev => ({ ...prev, [category]: value }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* 3D Preview */}
        <div className="relative h-[600px] bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-gray-800">
          <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
            <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={50} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            <ProductModel config={config} />
            <OrbitControls enableZoom={true} enablePan={false} />
            <Environment resolution={64}>
              <Lightformer intensity={1.2} position={[0, 5, -10]} scale={[20, 20, 1]} color="#fbbf24" />
              <Lightformer intensity={1.0} position={[0, -5, -10]} scale={[20, 20, 1]} color="#00ffff" />
            </Environment>
          </Canvas>
          
          {/* AR Preview Button */}
          <button
            onClick={() => setIsPreviewing(true)}
            className="absolute bottom-4 left-4 px-6 py-3 bg-brand-gold text-black font-semibold rounded-lg hover:bg-yellow-400 transition-all"
          >
            📱 View in AR
          </button>
        </div>

        {/* Configuration Panel */}
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">{productName}</h2>
            <p className="text-gray-400">Customize your generator</p>
          </div>

          {options.map(({ category, options: opts }) => (
            <div key={category} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-xl font-semibold text-white mb-4 capitalize">
                {category}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {opts.map((option) => {
                  const isSelected = config[category] === option.value;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleOptionChange(category, option.value)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-brand-gold bg-brand-gold/10 text-brand-gold'
                          : 'border-gray-700 bg-gray-800 text-white hover:border-gray-600'
                      }`}
                    >
                      <div className="font-semibold">{option.name}</div>
                      {option.price && (
                        <div className="text-sm text-gray-400 mt-1">
                          +${option.price.toLocaleString()}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Total Price */}
          <div className="bg-gradient-to-r from-brand-gold/20 to-yellow-600/20 rounded-xl p-6 border border-brand-gold/30">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-white">Total</span>
              <span className="text-3xl font-bold text-brand-gold">
                ${totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4">
            <a
              href={`https://wa.me/254768860665?text=${encodeURIComponent(`Hi! I'd like a quote for ${productName}:\n${Object.entries(config).map(([key, value]) => `- ${key}: ${value}`).join('\n')}\n- Estimated Price: KES ${totalPrice.toLocaleString()}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 cta-button-primary text-center"
            >
              Request Quote
            </a>
            <a
              href="/contact?type=specs-request&product=generator"
              className="flex-1 cta-button-secondary text-center"
            >
              Download Specs
            </a>
          </div>
        </div>
      </div>

      {/* AR Preview Modal */}
      <AnimatePresence>
        {isPreviewing && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsPreviewing(false)}
          >
            <motion.div
              className="bg-gray-900 rounded-2xl p-8 max-w-md text-center"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-white mb-4">AR Preview</h3>
              <p className="text-gray-400 mb-6">
                Scan the QR code with your mobile device to view this generator in AR
              </p>
              <div className="bg-white p-4 rounded-lg mb-6">
                {/* QR Code placeholder - use a QR code library */}
                <div className="w-64 h-64 bg-gray-200 mx-auto flex items-center justify-center">
                  QR Code
                </div>
              </div>
              <button
                onClick={() => setIsPreviewing(false)}
                className="cta-button-primary w-full"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

