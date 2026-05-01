'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'am', name: 'አማርኛ', flag: '🇪🇹' },
  { code: 'so', name: 'Soomaali', flag: '🇸🇴' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

// Supported locales
const locales = ['en', 'sw', 'fr', 'de', 'es', 'pt', 'zh', 'nl', 'am', 'so', 'ar'];

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

function setCookie(name: string, value: string, days: number = 365) {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

// Translation dictionary for all supported languages
const translations: Record<string, Record<string, string>> = {
  en: {
    Home: 'Home',
    About: 'About',
    Diagnostics: 'Diagnostics',
    Services: 'Services',
    Contact: 'Contact',
    Solar: 'Solar',
    Generators: 'Generators',
    Solutions: 'Solutions',
    selectLanguage: 'Select Language',
  },
  sw: {
    Home: 'Nyumbani',
    About: 'Kuhusu',
    Diagnostics: 'Uchunguzi',
    Services: 'Huduma',
    Contact: 'Wasiliana',
    Solar: 'Sola',
    Generators: 'Jenereta',
    Solutions: 'Suluhisho',
    selectLanguage: 'Chagua Lugha',
  },
  fr: {
    Home: 'Accueil',
    About: 'À propos',
    Diagnostics: 'Diagnostics',
    Services: 'Services',
    Contact: 'Contact',
    Solar: 'Solaire',
    Generators: 'Générateurs',
    Solutions: 'Solutions',
    selectLanguage: 'Choisir la langue',
  },
  de: {
    Home: 'Startseite',
    About: 'Über uns',
    Diagnostics: 'Diagnose',
    Services: 'Dienstleistungen',
    Contact: 'Kontakt',
    Solar: 'Solar',
    Generators: 'Generatoren',
    Solutions: 'Lösungen',
    selectLanguage: 'Sprache wählen',
  },
  es: {
    Home: 'Inicio',
    About: 'Acerca de',
    Diagnostics: 'Diagnósticos',
    Services: 'Servicios',
    Contact: 'Contacto',
    Solar: 'Solar',
    Generators: 'Generadores',
    Solutions: 'Soluciones',
    selectLanguage: 'Seleccionar idioma',
  },
  pt: {
    Home: 'Início',
    About: 'Sobre',
    Diagnostics: 'Diagnósticos',
    Services: 'Serviços',
    Contact: 'Contato',
    Solar: 'Solar',
    Generators: 'Geradores',
    Solutions: 'Soluções',
    selectLanguage: 'Selecionar idioma',
  },
  zh: {
    Home: '首页',
    About: '关于',
    Diagnostics: '诊断',
    Services: '服务',
    Contact: '联系',
    Solar: '太阳能',
    Generators: '发电机',
    Solutions: '解决方案',
    selectLanguage: '选择语言',
  },
  nl: {
    Home: 'Home',
    About: 'Over ons',
    Diagnostics: 'Diagnose',
    Services: 'Diensten',
    Contact: 'Contact',
    Solar: 'Zonne-energie',
    Generators: 'Generatoren',
    Solutions: 'Oplossingen',
    selectLanguage: 'Taal selecteren',
  },
  am: {
    Home: 'መነሻ',
    About: 'ስለ እኛ',
    Diagnostics: 'ምርመራዎች',
    Services: 'አገልግሎቶች',
    Contact: 'ያግኙን',
    Solar: 'የፀሐይ ኃይል',
    Generators: 'ጄኔሬተሮች',
    Solutions: 'መፍትሄዎች',
    selectLanguage: 'ቋንቋ ይምረጡ',
  },
  so: {
    Home: 'Bogga Hore',
    About: 'Ku saabsan',
    Diagnostics: 'Baaritaanka',
    Services: 'Adeegyada',
    Contact: 'Nala soo xiriir',
    Solar: 'Qorraxda',
    Generators: 'Koronto-sameeyeyaasha',
    Solutions: 'Xalalka',
    selectLanguage: 'Dooro Luqadda',
  },
  ar: {
    Home: 'الرئيسية',
    About: 'حول',
    Diagnostics: 'التشخيصات',
    Services: 'الخدمات',
    Contact: 'اتصل بنا',
    Solar: 'الطاقة الشمسية',
    Generators: 'المولدات',
    Solutions: 'الحلول',
    selectLanguage: 'اختر اللغة',
  },
};

// Create a global event for language changes
const LANGUAGE_CHANGE_EVENT = 'languageChange';

export function useCurrentLocale() {
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    // Get initial locale from cookie
    const cookieLocale = getCookie('NEXT_LOCALE');
    if (cookieLocale && locales.includes(cookieLocale)) {
      setLocale(cookieLocale);
    }

    // Listen for language changes
    const handleLanguageChange = (event: CustomEvent<string>) => {
      setLocale(event.detail);
    };

    window.addEventListener(LANGUAGE_CHANGE_EVENT, handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener(LANGUAGE_CHANGE_EVENT, handleLanguageChange as EventListener);
    };
  }, []);

  return locale;
}

export function useTranslation() {
  const locale = useCurrentLocale();

  const t = useCallback((key: string): string => {
    return translations[locale]?.[key] || translations['en']?.[key] || key;
  }, [locale]);

  return { t, locale };
}

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [locale, setLocale] = useState('en');
  const [isChanging, setIsChanging] = useState(false);
  const router = useRouter();

  // Get current locale from cookie on mount
  useEffect(() => {
    const cookieLocale = getCookie('NEXT_LOCALE');
    if (cookieLocale && locales.includes(cookieLocale)) {
      setLocale(cookieLocale);
    }
  }, []);

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  const switchLanguage = async (newLocale: string) => {
    if (newLocale === locale) {
      setIsOpen(false);
      return;
    }

    setIsChanging(true);

    // Set cookie for persistence
    setCookie('NEXT_LOCALE', newLocale);
    setLocale(newLocale);

    // Dispatch custom event for other components to react
    window.dispatchEvent(new CustomEvent(LANGUAGE_CHANGE_EVENT, { detail: newLocale }));

    // Update document language
    document.documentElement.lang = newLocale;

    // Close dropdown
    setIsOpen(false);

    // Refresh to load new translations (with a small delay for visual feedback)
    setTimeout(() => {
      router.refresh();
      setIsChanging(false);
    }, 300);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isChanging}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-[#fbbf24] transition-all text-white ${isChanging ? 'opacity-50 cursor-wait' : ''}`}
        aria-label="Switch language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {isChanging ? (
          <div className="w-6 h-6 border-2 border-[#fbbf24] border-t-transparent rounded-full animate-spin" />
        ) : (
          <span className="text-2xl">{currentLanguage.flag}</span>
        )}
        <span className="hidden md:inline text-sm">{currentLanguage.name}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && !isChanging && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-56 rounded-lg bg-gray-900 border border-gray-700 shadow-2xl z-50 max-h-96 overflow-y-auto"
              role="listbox"
              aria-label="Language options"
            >
              <div className="p-2">
                <div className="px-3 py-2 text-xs text-gray-400 font-semibold uppercase tracking-wider border-b border-gray-700 mb-2">
                  {translations[locale]?.selectLanguage || 'Select Language'}
                </div>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => switchLanguage(lang.code)}
                    role="option"
                    aria-selected={locale === lang.code}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all text-left ${
                      locale === lang.code
                        ? 'bg-[#fbbf24]/20 text-[#fbbf24] border border-[#fbbf24]/30'
                        : 'text-white hover:bg-gray-800'
                    }`}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="text-sm font-medium">{lang.name}</span>
                    {locale === lang.code && (
                      <svg
                        className="w-4 h-4 ml-auto text-[#fbbf24]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>

              {/* Footer with current selection */}
              <div className="px-4 py-2 bg-gray-800/50 border-t border-gray-700 text-xs text-gray-400">
                <span className="text-[#fbbf24]">{currentLanguage.flag}</span> {currentLanguage.name} selected
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
