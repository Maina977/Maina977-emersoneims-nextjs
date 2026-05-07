'use client';

import { useEffect } from 'react';

/**
 * The Solar & UPS Intelligence Hub is a focused engineering workspace.
 * The marketing-site chrome (TeslaStyleNavigation + PremiumFooter) is
 * irrelevant inside the hub and was visually stacking above the cockpit
 * and leaking footer/copyright text beneath the simulator.
 *
 * This client-only effect tags `<html data-hub-route="true">` while a hub
 * route is mounted; matching CSS in `app/globals.css` hides the global
 * nav/footer for the duration. No DOM is removed — the elements stay in
 * the tree for SEO/structured-data purposes — they are simply not rendered.
 */
export default function HubChromeIsolator() {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.hubRoute = 'true';
    return () => {
      delete root.dataset.hubRoute;
    };
  }, []);
  return null;
}
