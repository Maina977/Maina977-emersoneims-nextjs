# Deployed Changes Report (Production)

Date: 2025-12-29

## Live deployment
- Live domain (aliased): https://emersoneims.com
- Production deployment URL (Vercel): https://my-cdrujify3-emerson-industrial-maintenance-ss-projects.vercel.app

## Deployment-critical fixes applied (so the site could deploy)
1) Prevented secrets from being uploaded/committed
- Removed `.env` and `.env.local` from git tracking (kept locally).
- Updated `.gitignore` and `.vercelignore` to exclude `.env*` and `.npmrc`.

2) Stabilized the Vercel build environment
- Pinned Node engine to `22.x` in `package.json` so Vercel doesn’t auto-upgrade to a breaking major version.
- Updated `vercel.json` install command to: `npm install --legacy-peer-deps` to avoid npm peer dependency ERESOLVE failures.
- Removed `NODE_ENV=production` from `vercel.json` build/install env because it prevented devDependencies (TypeScript) from installing during build on Vercel.

## IMPORTANT: What is actually deployed vs not deployed
Vercel uploads your working directory, **but excludes files matching `.vercelignore`**.

In this repo, `.vercelignore` excludes (high level):
- `*.md` (except `README.md`, `VERCEL_DEPLOYMENT_GUIDE.md`, `DEPLOYMENT_CHECKLIST.md`)
- `*.bat`, `*.ps1`
- `app_MISPLACED/`, `pages_MISPLACED/`, `deployment-package/`, plus some other “do not deploy” folders
- Build output folders like `.next/`, `out/`, `dist/`, `build/`
- `.env*` and `.npmrc`

So:
- Everything in the lists below was part of the local change set at deploy time.
- Items matching the ignore rules above were **not** uploaded to the live site.

---

## A) Full tracked changes vs the current HEAD commit
Source: `git diff --name-status HEAD`

```text
D       .env
D       .env.local
M       .gitignore
M       .vercelignore
M       app/about-us/page.tsx
M       app/api/ai/chat/route.ts
M       app/api/ai/engagement-offer/route.ts
M       app/api/analytics/dashboard/route.ts
M       app/api/analytics/types.ts
M       app/api/notifications/new-lead/route.ts
D       app/api/src/middleware.ts
M       app/api/wordpress/route.ts
D       app/app/About us
D       app/app/data/calculatorFormulas.json
D       app/app/data/subsystems.json
D       app/app/data/telemetryMappings.json
D       app/app/data/telemetryValues.json
D       app/app/diagnostic page.jsx
D       app/app/generators models page tsx
D       app/app/solutions data-county page.tsx
M       app/components/FAQs.tsx
M       app/components/ServicesTeaser.tsx
M       app/components/contact/ContactForm.jsx
M       app/components/generators/ErrorFrequencyChart.tsx
M       app/components/generators/MTBFChart.tsx
M       app/components/generators/MaintenanceCharts.tsx
M       app/components/generators/SectionLead.tsx
M       app/components/generators/generatorscalculator.tsx
M       app/components/service/CrossServiceOptimizers.jsx
M       app/components/service/DieselGenerators.jsx
M       app/components/service/Fabrication.jsx
M       app/components/service/HVACSystems.jsx
M       app/components/service/HighVoltage.jsx
M       app/components/service/Incinerators.jsx
M       app/components/service/MotorRewinding.jsx
M       app/components/service/SolarEnergy.jsx
M       app/components/service/UPSSystems.jsx
M       app/components/service/WaterSystems.jsx
M       app/components/services/ServiceOverview.tsx
M       app/contact/page.tsx
M       app/diagnostic-suite/page.tsx
M       app/diagnostics/page.tsx
M       app/error.tsx
M       app/generators/case-studies/page.tsx
M       app/generators/maintenance/page.tsx
M       app/generators/page.tsx
M       app/generators/used/page.tsx
M       app/layout.tsx
M       app/not-found.tsx
M       app/page-backup.tsx
M       app/page-futuristic-backup.tsx
M       app/page-futuristic.tsx
M       app/page-sotd-winning.tsx
M       app/page.tsx
D       app/pages/contact us.css
D       app/pages/generator.css
D       app/pages/services.css
M       app/robots.ts
M       app/service/generators/page.tsx
M       app/service/page.tsx
M       app/services/page.tsx
M       app/sitemap.ts
M       app/solar/page.tsx
M       app/solution/generators/page.tsx
M       app/solution/page.tsx
M       app/solution/solar/page.tsx
M       components/accessibility/FocusVisible.tsx
M       components/analytics/AIEngagement.tsx
M       components/analytics/ComprehensiveAnalytics.tsx
M       components/analytics/GoogleAnalytics.tsx
M       components/analytics/WebVitals.tsx
M       components/ar/ARPreview.tsx
M       components/awwwards/LoadingSequence.tsx
M       components/cases/CaseStudies.tsx
M       components/charts/ChartJSChart.tsx
M       components/contact/ContactForm.jsx
M       components/contact/LiveChat.tsx
M       components/contact/SEOHead.jsx
M       components/diagnostics/GeneratorControlDiagnosticHub.jsx
M       components/diagnostics/GeneratorControlDiagnosticHub.tsx
M       components/diagnostics/QuestionsChartToggle.jsx
M       components/diagnostics/RadarScope.jsx
M       components/diagnostics/ServiceAnalytics.tsx
M       components/diagnostics/UniversalDiagnosticMachine.jsx
M       components/diagnostics/UniversalDiagnosticMachine.tsx
M       components/generators/ErrorFrequencyChart.tsx
M       components/generators/MTBFChart.tsx
M       components/hero/HeroCanvas.tsx
M       components/immersive/FullScreenHero.tsx
M       components/interactions/CustomCursor.tsx
M       components/interactions/MicroInteraction.tsx
M       components/interactions/MicroInteractions.tsx
M       components/interactive/LiveChat.tsx
M       components/layout/SciFiHeader.tsx
M       components/maps/AdvancedMapboxMap.tsx
M       components/media/OptimizedVideo.tsx
M       components/mobile/MobileOptimized.tsx
M       components/navigation/NavigationBar.tsx
M       components/navigation/TeslaStyleNavigation.tsx
M       components/performance/AdvancedPreloader.tsx
M       components/performance/FontOptimizer.tsx
M       components/performance/PerformanceMonitor.tsx
M       components/personalization/UserProfile.tsx
M       components/product/ProductConfigurator.tsx
M       components/security/MaximumSecurity.tsx
M       components/seo/StructuredData.tsx
M       components/service/CrossServiceOptimizers.tsx
M       components/service/DieselGenerators.tsx
M       components/service/Fabrication.tsx
M       components/service/HVACSystems.tsx
M       components/service/HighVoltage.tsx
M       components/service/Incinerators.tsx
M       components/service/MotorRewinding.tsx
M       components/service/SolarEnergy.tsx
M       components/service/UPSSystems.tsx
M       components/service/WaterSystems.tsx
M       components/services/ServiceComparison.tsx
M       components/services/ServicesTeaser.tsx
M       components/shared/AwardWinningPageTemplate.tsx
M       components/social/CustomerReviews.tsx
M       components/social/LiveVisitorCount.tsx
M       components/storytelling/BrandStorytelling.tsx
M       components/technical/TechnicalShowcase.tsx
M       components/ui/Icons.tsx
M       components/webgl/AbstractFloatingShapes.tsx
M       components/webgl/AdvancedGeneratorScene.tsx
M       components/webgl/AdvancedParticles.tsx
M       components/webgl/CumminsGenerator3D.tsx
M       components/webgl/FloatingUFOs.tsx
M       components/webgl/GeneratorCore.tsx
M       components/webgl/InteractiveBlobs.tsx
M       eslint.config.mjs
M       lib/data/services.ts
M       lib/db.ts
M       lib/media/optimizeMedia.ts
M       lib/notification-queue.ts
M       lib/proxy/proxy.ts
M       lib/security.ts
M       lib/wordpress/client.ts
M       middleware.ts.BACKUP
M       next-env.d.ts
D       next.config.js
M       next.config.ts
M       package-lock.json
M       package.json
M       proxy.ts
M       public/sw.js
M       scripts/auditMediaAssets.js
M       scripts/checkImageLocations.js
M       scripts/findImages.js
M       scripts/processImagesCinematic.js
M       tsconfig.json
M       tsconfig.tsbuildinfo
M       types/app-componets-ignore.d.ts
M       types/r3f-extended.d.ts
M       types/r3f.d.ts
M       vercel.json
```

---

## B) Full untracked (new) files present at deploy time
Source: `git ls-files --others --exclude-standard`

```text
AUDIT_FIXES_REPORT.md
AUDIT_SITE.ps1
DEPLOYMENT_AUDIT_REPORT.md
DEPLOYMENT_STATUS_FINAL_10_10.md
DEPLOYMENT_SUCCESS.md
DEPLOY_EMERSONEIMS_DOMAIN.bat
DEPLOY_EMERSONEIMS_DOMAIN.ps1
DEPLOY_FINAL_10_10.bat
DEPLOY_PRODUCTION_NOW.ps1
DNS_CLEANUP_GUIDE.md
DOMAIN_MIGRATION_GUIDE.md
DOMAIN_OVERRIDE_GUIDE.md
Domains
EMERGENCY_FIX_NOW.bat
FINAL_10_10_REPORT.md
FINAL_DEPLOYMENT_READY.md
NEXT_CONFIG_FIXED.md
QUICK_DIAGNOSTIC.bat
QUICK_START_GUIDE.md
SECURITY_AND_PERFORMANCE_FIXES.md
SEO_IMPLEMENTATION_COMPLETE.md
URGENT_DEPLOY.bat
URGENT_RESTORE_SITE.bat
URGENT_RESTORE_SITE.ps1
WEBSITE_AUDIT_REPORT.md
app/[country]/[city]/page.tsx
app/api/health/route.ts
app/brands/page.tsx
app/careers/page.tsx
app/kenya/[county]/page.tsx
app/layout-minimal.tsx
app/page-BACKUP-ERROR.tsx
app/page-BROKEN.tsx
app/page-minimal.tsx
app/privacy/page.tsx
app/terms/page.tsx
app/test-minimal/page.tsx
app/test-page/page.tsx
app_MISPLACED/About us
app_MISPLACED/data/calculatorFormulas.json
app_MISPLACED/data/subsystems.json
app_MISPLACED/data/telemetryMappings.json
app_MISPLACED/data/telemetryValues.json
app_MISPLACED/diagnostic page.jsx
app_MISPLACED/generators models page tsx
app_MISPLACED/solutions data-county page.tsx
app_MISPLACED/solutions-data-county-page.tsx
build_log_2.txt
build_log_6.txt
components/HeroVideo.css
components/HeroVideo.tsx
components/contact/QuickContactForm.tsx
components/home/ProjectGallery.tsx
components/home/StorySection.tsx
components/layout/PremiumFooter.tsx
components/performance/usePerformanceTier.ts
components/premium/TestimonialsShowcase.tsx
components/security/ContentProtection.tsx
components/seo/LocalBusinessSchema.tsx
debug.js
lib/performance.ts
pages_MISPLACED/contact us.css
pages_MISPLACED/generator.css
pages_MISPLACED/services.css
postcss.config.js
proxy.ts.bak
public/og-image.jpg
start-trapped.js
tailwind.config.ts
🚀_DEPLOY_NOW.bat
```

---

## C) Size of the change-set
Source: `git diff --stat HEAD`

- 157 files changed, 3445 insertions(+), 5638 deletions(-)

(If you want the exact per-file line deltas, I can paste the full `--stat` output into this report too.)
