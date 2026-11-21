# Dependency audit, 2026-11-21 (Management Priority 2)

Branch `phase2/deps`, based on production `86e79b2e`. No paid services were added.

## Totals

| Scope | Before | After |
|---|---|---|
| `npm audit --omit=dev` (production) | 11 moderate, 0 high, 0 critical | **0** |
| `npm audit` (including dev) | 18 (17 moderate, 1 high) | 8 (7 moderate, 1 high), all dev-only |

The 8 dev-only findings that remain are outside this scope and never ship to the site:
- `sharp` (high). It is a dev dependency that Next uses only for local image work.
- `minimatch` 10.2.6 under `@typescript-eslint/typescript-estree`, which is pulled in by `eslint-config-next` 16.0.7. That one finding is counted 6 times across the typescript-eslint packages.

## What changed

| Package | Before | After | How |
|---|---|---|---|
| next (and @next/env, @next/swc-*) | 16.4.2 | 16.4.6 | `^16.4.6` (patch within 16.4) |
| @sentry/nextjs | 10.78.0 | 10.78.0 | unchanged. 10.78.0 is the newest 10.x, and the advisory comes through its glob dependency |
| glob (under @sentry/bundler-plugins) | 13.0.6 | 14.0.6 | `overrides: { "@sentry/bundler-plugins": { "glob": "14.0.6" } }` |
| minimatch (under that glob) | 10.2.6 | 11.0.9 | follows from glob 14 (`^11.0.5`) |
| echarts (and zrender) | 5.6.0 | 6.1.0 | `^6.1.0`. echarts-for-react 3.0.5 accepts `^6.0.0` as a peer |
| react-router-dom / react-router | 6.30.6 | 7.18.6 | `^7.18.6`. `@remix-run/router` is no longer installed |
| uuid (under exceljs) | 8.3.2 | 11.1.1 | `overrides: { "exceljs": { "uuid": "11.1.1" } }` |
| exceljs | 4.4.0 | 4.4.0 | unchanged. The 3.4.0 that npm offered is a downgrade and was rejected |

## Per-advisory decisions

### next: 7 advisories (fixed)

| Advisory | Path | Reachable in our usage? | Action |
|---|---|---|---|
| [GHSA-7qx7-33qx-rqx2](https://github.com/advisories/GHSA-7qx7-33qx-rqx2) SVG rejection bypass in image optimisation | `next` (direct) | **Yes**: `next.config.ts` sets `images.dangerouslyAllowSVG: true` | upgrade 16.4.2 → 16.4.6 |
| [GHSA-f3mh-rxg3-f5g2](https://github.com/advisories/GHSA-f3mh-rxg3-f5g2) HttpOnly cookie exposure via internal header on Edge routes | `next` | Possibly: `middleware.ts` runs in the Edge runtime | upgrade 16.4.2 → 16.4.6 |
| [GHSA-pc58-hwjq-p385](https://github.com/advisories/GHSA-pc58-hwjq-p385) cross-client response injection when self-hosted apps forward fetched responses | `next` | Low: the site is hosted on Vercel (`output: 'standalone'` is set) | upgrade 16.4.2 → 16.4.6 |
| [GHSA-mfr8-8qww-v76h](https://github.com/advisories/GHSA-mfr8-8qww-v76h) `use cache` called through `unstable_cache()` | `next` | No: the code has no `'use cache'` and no `unstable_cache` | upgrade 16.4.2 → 16.4.6 |
| [GHSA-vc7v-qv4w-wrv8](https://github.com/advisories/GHSA-vc7v-qv4w-wrv8) nested `use cache` root-param leak | `next` | No (no `'use cache'`) | upgrade 16.4.2 → 16.4.6 |
| [GHSA-rhh4-g77r-r9qj](https://github.com/advisories/GHSA-rhh4-g77r-r9qj) `use cache` with binary arguments | `next` | No (no `'use cache'`) | upgrade 16.4.2 → 16.4.6 |
| [GHSA-vvgp-ww4w-46vf](https://github.com/advisories/GHSA-vvgp-ww4w-46vf) Cache Components fallback-shell poisoning | `next` | No: `cacheComponents` is not enabled | upgrade 16.4.2 → 16.4.6 |

### glob and minimatch, and the 3 Sentry entries that only report them (fixed)

| Advisory | Path | Reachable? | Action |
|---|---|---|---|
| [GHSA-3g3m-2fjr-6pw4](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4) glob: an AbortSignal abort does not stop the walk | `@sentry/nextjs` → `@sentry/bundler-plugins` → `glob@13.0.6` | No. The Sentry build plugin never runs because `withSentryConfig` is not used in `next.config.ts` (only the runtime SDK in `sentry.*.config.ts` / `instrumentation-client.ts` is). Even if it ran, it would not pass a `signal`. | override glob → 14.0.6 |
| [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) minimatch: globparts amplification DoS | `…bundler-plugins` → `glob` → `minimatch@10.2.6` | No. The patterns are fixed at build time and never come from users. | minimatch 11.0.9, which comes with glob 14 |
| @sentry/bundler-plugins, @sentry/webpack-plugin, @sentry/nextjs (no advisory of their own) | as above | as above | cleared by the override. There is no 10.x Sentry release with the fix (10.78.0 is the newest), and moving to 11.x would cross a major version |

Compatibility check: bundler-plugins 10.78.0 only calls the top-level `glob(patterns, { absolute, nodir, ...options })`. Glob 14 still has that API; the breaking changes in 14 are in internal classes (`Pattern`, `Processor`, `GlobWalker`) and in how `ignore` is rooted. The other copies of minimatch in the production tree (3.1.5 and 5.1.9, used by archiver and readdir-glob under exceljs) are outside the vulnerable range of 7.0.0 up to but not including 11.0.1.

### echarts: [GHSA-fgmj-fm8m-jvvx](https://github.com/advisories/GHSA-fgmj-fm8m-jvvx) / CVE-2026-45249 (fixed)

| Path | Reachable? | Action |
|---|---|---|
| `echarts` (direct), and as the peer of `echarts-for-react` | No. The bug is an XSS in the Lines-series tooltip. No source file imports `echarts` or `echarts-for-react`: the charts use recharts and chart.js. The only reference is the `optimizePackageImports` list in `next.config.ts`. | upgrade 5.6.0 → 6.1.0. Nothing imports it and the peer range allows it, so the major bump carries no risk. It also stops anyone from adding the vulnerable version later. |

### react-router / react-router-dom (fixed)

| Advisory | Path | Reachable? | Action |
|---|---|---|---|
| [GHSA-wrjc-x8rr-h8h6](https://github.com/advisories/GHSA-wrjc-x8rr-h8h6) open redirect via backslash in `<Link>` / `useNavigate` | `react-router-dom` (direct) → `react-router` | Not exploitable. The Solar Genius Pro SPA (`components/solar-modules/crc/src/App.tsx`, loaded by `SolarGeniusProV2.tsx`) passes only hard-coded literal paths to `navigate()`, `<Link to>` and `<Navigate to>`. | upgrade 6.30.6 → 7.18.6 |
| [GHSA-337j-9hxr-rhxg](https://github.com/advisories/GHSA-337j-9hxr-rhxg) constructor injection via `deserializeErrors()` during SSR hydration | same | No. The app uses Declarative Mode (`HashRouter` + `<Routes>`), with no data router and no SSR hydration. The advisory states that Declarative Mode is not affected. | upgrade 6.30.6 → 7.18.6 |

Compatibility: v7 needs React 18 or later and Node 20 or later, and both are met. The SPA uses only `HashRouter`, `Routes`, `Route`, `Navigate replace`, `useNavigate`, `useLocation` and `Link`. All of these are unchanged in v7. There are no splat routes, so the relative-splat-path change does not apply. Loaders, `json` and `defer` are not used. A new test, `tests/regression/deps-audit-2026-11-21.test.tsx`, renders this exact pattern under v7: the index route, `useNavigate`, `Link`, and a `Navigate replace` redirect from a retired route.

### uuid via exceljs: [GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq) / CVE-2026-41907 (fixed)

| Path | Reachable? | Action |
|---|---|---|
| `exceljs@4.4.0` → `uuid@8.3.2` | No. The bug is a missing bounds check in `v3()`, `v5()` and `v6()` when a caller passes its own `buf`. exceljs calls only `v4()` with no buffer (`lib/xlsx/xform/sheet/cf-ext/cf-rule-ext-xform.js`), and our own code does not import uuid. | override uuid → 11.1.1. That version still has the CommonJS entry exceljs needs (`dist/cjs/index.js`) and the same `v4` export. exceljs itself is not downgraded. |

The new test checks that exceljs resolves uuid 11.1.1. It then writes and reads back a workbook with a data-bar conditional-format rule, which is the one code path in exceljs that calls `uuid.v4()`. Note that exceljs's browser bundle (`dist/exceljs.min.js`) contains its own copy of uuid, which the override does not change. That copy is still only called through `v4()` without a buffer, so it is not reachable either.

## Lockfile integrity

- `npm install --legacy-peer-deps` was run in this worktree's own `node_modules` (the shared junction to `p1-building` was removed first and the target left intact). The lockfile diff touches only the packages in the table above, plus the new transitive dependencies `@isaacs/nonrecursive-glob-match`, `path-scurry@3`, `cookie` and `set-cookie-parser` (the last two come with react-router 7). The unused top-level `glob@13`, `path-scurry@2` and `@remix-run/router` were removed.
- Every entry in `package-lock.json` has `resolved` and `integrity`, except the pinned SheetJS CDN tarball, which was already like that.
- A clean `npm ci --legacy-peer-deps` from the committed lockfile succeeded and left the lockfile unchanged.
- `npm ls --omit=dev` reports no missing packages. The only "invalid" entries are peer-range warnings that this change did not cause and that `--legacy-peer-deps` tolerates: react/react-dom 18.3.1 against the `^19` peers of `@react-three/fiber` 9 and `react-leaflet` 5, `@react-three/fiber` 9 against drei's `^8`, and `picomatch` 2.3.2 against fdir. None of those packages is in the lockfile diff. The "UNMET OPTIONAL" lines are Expo peers of the three.js stack, which are not used on the web.

## Verification results

| Check | Result |
|---|---|
| `npx tsc --noEmit -p tsconfig.json` | passed, 0 errors |
| `npx next build` (Next.js 16.4.6, Turbopack, run detached in this worktree) | passed. Compiled in 72 s, 4961/4961 static pages generated, `.next/BUILD_ID` written |
| `npx vitest run --maxWorkers=3` on the targeted suites: `tests/regression/deps*`, `qs-*` (BOQ/PDF exports), `solar*` (including solar-proposal and solar-workspace), `oracle-service-pdf`, `aquascan-pdf` | 44 files, 449 tests, all passed |
| Exports (exceljs, jspdf, xlsx) | covered by `deps-email-xlsx-2026-11-21`, `qs-boq-export-trades`, `qs-pdf-report`, `qs-pdf-sheet`, `solar-proposal*`, `oracle-service-pdf` and the new exceljs data-bar test. All passed |
