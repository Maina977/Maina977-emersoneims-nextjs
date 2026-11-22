/**
 * BOOT WATCHDOG (Report A final correction, 2026-11-22).
 *
 * The resilient loader (./resilientImport) and the error pages recover from a
 * failed or stalled download only once React is running. The Solar stress test
 * found the case they cannot reach: the connection drops while the page's own
 * framework scripts are downloading. React then never starts, the page stays as
 * server-rendered HTML, the tool tabs only change the address, and nothing tells
 * the visitor (production 86e79b2e behaves the same).
 *
 * This plain inline script runs before the framework. It shows a small notice
 * with a Reload page button when
 *   - a /_next/static script failed to load and React has not started 4 s later; or
 *   - React has not started 20 s after the HTML arrived (a stalled download).
 * The notice disappears by itself if React starts after all. Nothing is shown on
 * a page that boots normally. A reload keeps typed inputs: the tools keep their
 * drafts in sessionStorage.
 *
 * "React has started" = React's root marker on `document` (App Router hydrates
 * the whole document). React 19 skips nodes injected into <body> by third-party
 * scripts during hydration, so the notice cannot break hydration.
 */
export const BOOT_FAILED_AFTER_MS = 4_000;
export const BOOT_STALLED_AFTER_MS = 20_000;
export const BOOT_NOTICE_ID = 'eims-boot-notice';

export const BOOT_WATCHDOG_SCRIPT = [
  '(function(){',
  'var failedAt=0,shown=null,t0=Date.now();',
  "function started(){try{return Object.keys(document).some(function(k){return k.indexOf('__reactContainer')===0;});}catch(e){return true;}}",
  "addEventListener('error',function(e){var t=e&&e.target;if(t&&t.tagName==='SCRIPT'&&String(t.src||'').indexOf('/_next/static/')>=0&&!failedAt){failedAt=Date.now();}},true);",
  'function show(failed){if(shown||!document.body)return;',
  "var d=document.createElement('div');d.id='" + BOOT_NOTICE_ID + "';d.setAttribute('role','alert');",
  "d.style.cssText='position:fixed;left:16px;right:16px;bottom:16px;z-index:2147483647;max-width:560px;margin:0 auto;padding:14px 16px;border-radius:12px;background:#0f172a;color:#f8fafc;border:1px solid #f59e0b;font:15px/1.45 system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.4)';",
  "var p=document.createElement('p');p.style.margin='0 0 10px';",
  "p.textContent=failed?'The page did not finish loading. The connection dropped while it was downloading, so the tools on this page cannot start.':'This page is still downloading. The connection is slow or a download stalled.';",
  "var b=document.createElement('button');b.type='button';b.textContent='Reload page';",
  "b.style.cssText='padding:8px 16px;border-radius:8px;border:0;background:#f59e0b;color:#0f172a;font-weight:600;cursor:pointer';",
  "b.onclick=function(){location.reload();};",
  "var n=document.createElement('p');n.style.cssText='margin:8px 0 0;font-size:13px;color:#cbd5e1';n.textContent='Figures you typed in the tools are kept.';",
  'd.appendChild(p);d.appendChild(b);d.appendChild(n);document.body.appendChild(d);shown=d;}',
  'function tick(){',
  'if(started()){if(shown){shown.remove();shown=null;}return;}',
  'var now=Date.now();',
  'if(failedAt&&now-failedAt>=' + BOOT_FAILED_AFTER_MS + ')show(true);',
  'else if(now-t0>=' + BOOT_STALLED_AFTER_MS + ')show(false);',
  'setTimeout(tick,1000);}',
  'setTimeout(tick,1000);',
  '})();',
].join('');
