import { getRequestConfig } from 'next-intl/server';

// Supported locales
export const locales = ['en', 'sw', 'fr', 'de', 'es', 'pt', 'zh', 'nl', 'am', 'so', 'ar'];
export const defaultLocale = 'en';

export default getRequestConfig(async ({ locale }) => {
  // Use default locale if locale is undefined or not supported
  const resolvedLocale = locale && locales.includes(locale) ? locale : defaultLocale;
  
  return {
    locale: resolvedLocale,
    messages: (await import(`./messages/${resolvedLocale}.json`)).default
  };
});
