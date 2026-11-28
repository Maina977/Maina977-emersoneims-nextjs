'use client';

/**
 * "Cookie settings": re-opens the cookie notice so a visitor can change or
 * withdraw a stored choice (privacy correction 2026-11-27). Before this there
 * was no way back to the notice once it had been answered.
 *
 * A real <button> (keyboard and screen-reader operable), styled by the caller
 * to sit with the links around it.
 */

import { openCookieSettings } from '@/lib/compliance/googleConsent';
import { COOKIE_SETTINGS_LABEL } from '@/lib/compliance/cookieNoticeText';

export default function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openCookieSettings} className={className} aria-haspopup="dialog">
      {COOKIE_SETTINGS_LABEL}
    </button>
  );
}
