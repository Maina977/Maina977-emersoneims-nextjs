import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

// Supported locales
export const locales = ['en', 'sw', 'fr', 'de', 'es', 'pt', 'zh', 'nl', 'am', 'so', 'ar'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export default getRequestConfig(async () => {
  // Get locale from cookie
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;

  // Validate and use cookie locale or fall back to default
  const locale = cookieLocale && locales.includes(cookieLocale as Locale)
    ? cookieLocale
    : defaultLocale;

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
