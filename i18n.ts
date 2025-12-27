import { notFound } from 'next/navigation';

// Can be imported from a shared config
export const locales = [
  'en', // English
  'sw', // Swahili
  'fr', // French
  'pt', // Portuguese
  'de', // German
  'zh', // Chinese
  'es', // Spanish
  'nl', // Dutch
  'am', // Amharic
  'so', // Somali
  'ar'  // Arabic
] as const;

export type Locale = typeof locales[number];

const getRequestConfig = async ({ locale }: { locale: string }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as any)) notFound();

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
};

export default getRequestConfig;