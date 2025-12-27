'use client';

/**
 * USER PROFILE & PREFERENCES
 * Personalization system
 */

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface UserPreferences {
  language: string;
  theme: 'light' | 'dark' | 'auto';
  interests: string[];
  savedProducts: string[];
  recentViews: string[];
}

export default function UserProfile() {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Load preferences from localStorage on client-side only
    const saved = localStorage.getItem('userPreferences');
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch (error) {
        console.warn('Failed to load preferences:', error);
        setPreferences({
          language: 'en',
          theme: 'dark',
          interests: [],
          savedProducts: [],
          recentViews: [],
        });
      }
    } else {
      setPreferences({
        language: 'en',
        theme: 'dark',
        interests: [],
        savedProducts: [],
        recentViews: [],
      });
    }
    setIsHydrated(true);
  }, []);

  const savePreferences = (newPrefs: Partial<UserPreferences>) => {
    if (!preferences) return;
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    localStorage.setItem('userPreferences', JSON.stringify(updated));

    // Handle language change
    if (newPrefs.language && newPrefs.language !== preferences.language) {
      // Redirect to the new locale
      const newPath = `/${newPrefs.language}${pathname.replace(/^\/[a-z]{2}/, '')}`;
      router.push(newPath);
    }
  };

  // Don't render until hydrated to prevent hydration mismatch
  if (!isHydrated || !preferences) {
    return null;
  }

  const addInterest = (interest: string) => {
    if (!preferences.interests.includes(interest)) {
      savePreferences({
        interests: [...preferences.interests, interest],
      });
    }
  };

  const saveProduct = (productId: string) => {
    if (!preferences.savedProducts.includes(productId)) {
      savePreferences({
        savedProducts: [...preferences.savedProducts, productId],
      });
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-32 right-6 z-50 w-12 h-12 bg-gray-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-gray-800 transition-all border border-gray-700"
        aria-label="User profile"
      >
        👤
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-32 right-6 w-80 bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 z-50 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <h3 className="text-xl font-bold text-white mb-4">{t('userProfile.title')}</h3>
            
            {/* Preferences */}
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">{t('userProfile.language')}</label>
                <select
                  value={preferences.language}
                  onChange={(e) => savePreferences({ language: e.target.value })}
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
                >
                  <option value="en">English</option>
                  <option value="sw">Swahili</option>
                  <option value="fr">French</option>
                  <option value="pt">Portuguese</option>
                  <option value="de">German</option>
                  <option value="zh">Chinese</option>
                  <option value="es">Spanish</option>
                  <option value="nl">Dutch</option>
                  <option value="am">Amharic</option>
                  <option value="so">Somali</option>
                  <option value="ar">Arabic</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">{t('userProfile.interests')}</label>
                <div className="flex flex-wrap gap-2">
                  {[t('userProfile.generators'), t('userProfile.solar'), t('userProfile.ups'), t('userProfile.diagnostics')].map((interest) => (
                    <button
                      key={interest}
                      onClick={() => addInterest(interest)}
                      className={`px-3 py-1 rounded-lg text-sm transition-all ${
                        preferences.interests.includes(interest)
                          ? 'bg-brand-gold text-black'
                          : 'bg-gray-800 text-white hover:bg-gray-700'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              {preferences.savedProducts.length > 0 && (
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">{t('userProfile.savedProducts')}</label>
                  <div className="text-white text-sm">
                    {preferences.savedProducts.length} {t('userProfile.saved')}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

