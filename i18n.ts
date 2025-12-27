import { getRequestConfig } from 'next-intl/server';
import { locales } from './config/locales';

export default getRequestConfig(async ({ locale }) => {
  if (!locale || !locales.includes(locale as any)) {
    throw new Error(`Locale ${locale} is not supported`);
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
    now: new Date(),
    timeZone: 'UTC',
  };
});
