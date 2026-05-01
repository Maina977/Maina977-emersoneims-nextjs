'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Users, Star } from 'lucide-react';

/**
 * LOCATION-AWARE CTA - PERSONALIZED FOR EACH VISITOR
 *
 * Shows visitors that we serve their area specifically
 * Creates trust and urgency by showing local presence
 */

// Kenya regions and their major towns
const KENYA_REGIONS: Record<string, { towns: string[]; technicians: number }> = {
  'Nairobi': { towns: ['Westlands', 'Karen', 'Embakasi', 'Industrial Area', 'Kilimani'], technicians: 12 },
  'Mombasa': { towns: ['Nyali', 'Likoni', 'Changamwe', 'Kisauni', 'Mvita'], technicians: 8 },
  'Kisumu': { towns: ['Milimani', 'Kondele', 'Mamboleo', 'Nyalenda', 'Kibos'], technicians: 5 },
  'Nakuru': { towns: ['Milimani', 'Section 58', 'Lanet', 'Bahati', 'Nakuru Town'], technicians: 4 },
  'Eldoret': { towns: ['Langas', 'Huruma', 'Kapsoya', 'Pioneer', 'Elgon View'], technicians: 4 },
  'Thika': { towns: ['Makongeni', 'Ngoingwa', 'Section 9', 'Landless', 'Garissa Road'], technicians: 3 },
  'Machakos': { towns: ['Machakos Town', 'Athi River', 'Kangundo', 'Masii', 'Matuu'], technicians: 3 },
  'Nyeri': { towns: ['Nyeri Town', 'Karatina', 'Othaya', 'Mukurweini', 'Tetu'], technicians: 3 },
  'Meru': { towns: ['Meru Town', 'Nkubu', 'Maua', 'Chuka', 'Timau'], technicians: 3 },
  'Kiambu': { towns: ['Kiambu Town', 'Ruiru', 'Juja', 'Kikuyu', 'Limuru'], technicians: 5 },
};

const EAST_AFRICA_COUNTRIES: Record<string, { capital: string; technicians: number }> = {
  'Uganda': { capital: 'Kampala', technicians: 6 },
  'Tanzania': { capital: 'Dar es Salaam', technicians: 5 },
  'Rwanda': { capital: 'Kigali', technicians: 3 },
  'South Sudan': { capital: 'Juba', technicians: 2 },
  'Ethiopia': { capital: 'Addis Ababa', technicians: 2 },
};

export default function LocationAwareCTA() {
  const [location, setLocation] = useState<string | null>(null);
  const [nearbyTechnicians, setNearbyTechnicians] = useState(5);
  const [recentJobs, setRecentJobs] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const COMPANY_PHONE = '+254768860665';

  useEffect(() => {
    // Try to detect location from various sources
    const detectLocation = async () => {
      try {
        // First, check URL path for location
        const path = window.location.pathname;
        const pathMatch = path.match(/\/counties\/([^\/]+)/i) || path.match(/\/([^\/]+)\/generators/i);
        if (pathMatch) {
          const urlLocation = pathMatch[1].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
          setLocation(urlLocation);
          setNearbyTechnicians(KENYA_REGIONS[urlLocation]?.technicians || 3);
          setRecentJobs(Math.floor(Math.random() * 15) + 5);
          setIsLoading(false);
          return;
        }

        // Try IP-based geolocation (using free service)
        const response = await fetch('https://ipapi.co/json/', {
          signal: AbortSignal.timeout(3000)
        });
        const data = await response.json();

        if (data.city) {
          // Check if it's in Kenya
          if (data.country_code === 'KE') {
            const region = data.region || data.city;
            setLocation(region);
            setNearbyTechnicians(KENYA_REGIONS[region]?.technicians || 3);
          } else if (EAST_AFRICA_COUNTRIES[data.country_name]) {
            setLocation(data.country_name);
            setNearbyTechnicians(EAST_AFRICA_COUNTRIES[data.country_name].technicians);
          } else {
            setLocation(data.city);
            setNearbyTechnicians(2);
          }
          setRecentJobs(Math.floor(Math.random() * 15) + 5);
        }
      } catch (error) {
        // Default to Nairobi if detection fails
        setLocation('Nairobi');
        setNearbyTechnicians(12);
        setRecentJobs(23);
      } finally {
        setIsLoading(false);
      }
    };

    detectLocation();
  }, []);

  if (isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-amber-500/30 p-6 shadow-xl"
    >
      {/* Location header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
          <MapPin className="w-6 h-6 text-amber-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">
            {location ? `Serving ${location}` : 'Serving Your Area'}
          </h3>
          <p className="text-sm text-gray-400">24/7 Emergency Response Available</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-800/50 rounded-xl">
          <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
            <Users className="w-4 h-4" />
            <span className="font-bold text-lg">{nearbyTechnicians}</span>
          </div>
          <p className="text-xs text-gray-400">Technicians Nearby</p>
        </div>

        <div className="text-center p-3 bg-gray-800/50 rounded-xl">
          <div className="flex items-center justify-center gap-1 text-green-500 mb-1">
            <Clock className="w-4 h-4" />
            <span className="font-bold text-lg">&lt;2hrs</span>
          </div>
          <p className="text-xs text-gray-400">Response Time</p>
        </div>

        <div className="text-center p-3 bg-gray-800/50 rounded-xl">
          <div className="flex items-center justify-center gap-1 text-blue-500 mb-1">
            <Star className="w-4 h-4" />
            <span className="font-bold text-lg">{recentJobs}</span>
          </div>
          <p className="text-xs text-gray-400">Jobs This Month</p>
        </div>
      </div>

      {/* Urgency message */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mb-4">
        <p className="text-amber-400 text-sm text-center">
          <span className="font-bold">{Math.floor(Math.random() * 3) + 1} technician(s)</span> available in {location || 'your area'} right now!
        </p>
      </div>

      {/* CTA */}
      <a
        href={`tel:${COMPANY_PHONE}`}
        className="flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold text-lg rounded-xl hover:from-green-500 hover:to-green-400 transition-all"
      >
        <Phone className="w-5 h-5" />
        Call Now for {location || 'Local'} Service
      </a>

      {/* Trust badges */}
      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
        <span>3-Year Warranty</span>
        <span className="text-amber-500">•</span>
        <span>Licensed & Insured</span>
        <span className="text-amber-500">•</span>
        <span>500+ Happy Clients</span>
      </div>
    </motion.div>
  );
}
