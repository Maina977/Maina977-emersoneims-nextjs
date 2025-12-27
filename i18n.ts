import {getRequestConfig} from "next-intl/server";
import {notFound} from "next/navigation";

export const locales = ["en", "es", "fr", "de", "pt", "nl", "ar", "zh", "am", "so", "sw"];
export const defaultLocale = "en";

export const routing = {
  locales,
  defaultLocale,
};

export default getRequestConfig(async ({locale}) => {
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
