import { getRequestConfig } from 'next-intl/server';

// Supported locales
export const locales = ['en', 'sw', 'fr', 'de', 'es', 'pt', 'zh', 'nl', 'am', 'so', 'ar'];
export const defaultLocale = 'en';

export default getRequestConfig(async ({ locale }) => {
  return {
    locale: locale!,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
