import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "es", "fr", "de", "pt", "nl", "ar", "zh", "am", "so", "sw"],
  defaultLocale: "en"
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"]
};
