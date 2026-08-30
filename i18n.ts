import { getRequestConfig } from 'next-intl/server';
// `cookies` is deliberately NOT imported — reading it here made every page in
// the app render dynamically. See the note in getRequestConfig below.

// Supported locales
export const locales = ['en', 'sw', 'fr', 'de', 'es', 'pt', 'zh', 'nl', 'am', 'so', 'ar'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export default getRequestConfig(async () => {
  /*
   * THE COOKIE READ IS GONE (2026-08-29), AND WITH IT DYNAMIC RENDERING.
   *
   * This used to do:
   *     const cookieStore = await cookies();
   *     const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;
   * Reading cookies here runs inside every page's render, so it opted ALL
   * ~3,400 pages into dynamic rendering. Next then answered every URL with its
   * dynamic default —
   *     Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate
   * — which told every visitor's browser never to store a page. Repeat visits
   * re-downloaded the whole document (440KB of HTML on the homepage), and the
   * s-maxage / stale-while-revalidate policy tuned in vercel.json was
   * overridden on the browser-facing header.
   *
   * NOTHING USER-FACING IS LOST, because the locale switching this supported
   * was already non-functional. Verified three ways before changing it:
   *   - components/layout/SciFiHeader.tsx:27 has `useTranslations` commented
   *     out, marked "Disabled until i18n configured";
   *   - components/navigation/TeslaStyleNavigation.tsx:10 records that
   *     LanguageSwitcher was removed from the nav on 2026-07-31, so nothing
   *     can set NEXT_LOCALE any more;
   *   - messages/en.json holds 8 FLAT keys ("Home") while messages/sw.json
   *     holds 75 NESTED ones (navigation.home) — incompatible shapes, so the
   *     default locale could not resolve most keys even if it were wired up.
   * Requesting the live site with Accept-Language sw-KE, fr-FR and zh-CN all
   * returned identical English with lang="en".
   *
   * NOTHING IS DELETED. Every messages/*.json file stays exactly where it is,
   * including the genuine Swahili in sw.json. Restoring real multilingual
   * support means reconciling those key shapes, re-enabling the hooks and
   * mounting a switcher — and at that point it should use locale-prefixed
   * routes (/sw/...) with generateStaticParams, which keeps pages static
   * instead of trading the whole site's cacheability for a cookie read.
   */
  return {
    locale: defaultLocale,
    messages: (await import(`./messages/${defaultLocale}.json`)).default
  };
});
