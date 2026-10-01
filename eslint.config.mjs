import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "chunk-*.js",
      "**/*.min.js",
      "next-env.d.ts",
      "app/componets/**",
      "app/PC/**",
      "deployment-package/**",
      // Third-party / vendored bundles. Linting these triggers Babel
      // OOM on >500KB generated sources and is not our code to police.
      "external/**",
      /*
       * The vendored SolarGenius SPA, for the same reason, and to match
       * tsconfig.json which has always excluded it.
       *
       * Linting it produced 18 of this project’s lint errors and none of them
       * were actionable here. Eleven are PARSE errors in files that are simply
       * corrupt: crc/tenancy/customDomain.ts ends mid-literal at `value: ''35.`,
       * and crc/logging/errorTracker.ts has its own file header spliced into the
       * middle of an interface declaration. Five more are React Native - `View`
       * and `TouchableOpacity` in crc/mobile/ReactNativeApp - which cannot run in
       * a browser at all.
       *
       * None of those files is imported by anything in app/ or lib/, which is why
       * tsc reports a clean tree: it only checks what the import graph reaches.
       * Repairing them would mean inventing the truncated content, starting with
       * an IP address nobody has.
       *
       * THE LIVE PARTS OF THIS DIRECTORY ARE STILL TYPE-CHECKED. crc/src/pages/*,
       * crc/core/calculator and crc/components/calculator are dynamically imported
       * by app/solar-genius-pro/*, so tsc covers them through those imports and
       * four real bugs in them were fixed on 2026-10-01. What stops here is style
       * linting of vendored code, not type checking of code we ship.
       */
      "components/solar-modules/**",
      "node_modules/**",
      "components/aquascan-modules/**",
    ],
  },
  {
    rules: {
      "react-hooks/purity": "off",
      "react-hooks/refs": "off",
      "react-hooks/rules-of-hooks": "off",
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "off",
      "react-hooks/static-components": "off",
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off",
      "@next/next/no-html-link-for-pages": "off",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-require-imports": "warn",
      // Prevent fragile parent-relative imports that point at top-level folders.
      // These break easily when files move and were the root cause of repeated
      // Vercel build failures in components/building/security/SecurityProvider.tsx.
      // Always use the "@/" path alias for cross-folder imports.
      "no-restricted-imports": ["error", {
        patterns: [
          {
            group: [
              "**/../lib/**",
              "**/../components/**",
              "**/../app/**",
              "**/../hooks/**",
              "**/../config/**",
              "**/../types/**",
              "**/../styles/**",
              "**/../prisma/**"
            ],
            message: "Use the '@/' path alias instead of parent-relative imports into top-level folders (e.g. '@/lib/...' not '../../lib/...')."
          },
          {
            // Hard ban on importing from the dead `components/building/` and
            // `lib/building/` mirror trees. They are inert duplicates kept for
            // historical reference; editing them produces "changes did not
            // take effect" symptoms in production.
            /*
             * NARROWED 2026-10-01: lib/building/building/** is NOT a mirror.
             *
             * The blanket ban flagged five imports in three API routes that all
             * answer 200 in production - /api/building/floor-plan, /model-3d and
             * /comprehensive-report - and it had no alternative to offer them,
             * because floorPlanGenerator.ts and building3DGenerator.ts exist
             * ONLY under lib/building/building/. There is no live copy to point
             * at.
             *
             * comprehensiveReportGenerator.ts proves the distinction. The copy
             * at lib/building/borehole/ is byte-identical to lib/borehole/, so
             * that one is a genuine mirror and stays banned. The copy at
             * lib/building/building/ is 51,557 bytes with 13 exports against the
             * borehole file’s 72,968 and 3 - a different module that happens to
             * share a filename.
             *
             * So the ban keeps its teeth where the trees really are duplicates,
             * and stops telling three working routes to import something that
             * does not exist.
             */
            group: [
              "@/components/building/**",
              "@/lib/building/**",
              "**/components/building/**",
              "**/lib/building/**"
            ],
            message: "components/building/** and lib/building/** are DEAD MIRROR trees. Edit the live copy under components/** or lib/** instead."
          }
        ]
      }]
    }
  },
  {
    files: ["scripts/**/*.js", "debug.js", "start-trapped.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    /*
     * THE THREE ROUTES THAT GENUINELY NEED lib/building/building/**.
     *
     * The dead-mirror ban above is correct for 29 of the 30 subtrees under
     * lib/building: lib/building/borehole/comprehensiveReportGenerator.ts is
     * byte-identical to lib/borehole/, for instance. But lib/building/building/
     * duplicates nothing. floorPlanGenerator.ts and building3DGenerator.ts
     * exist nowhere else in the repository, and its
     * comprehensiveReportGenerator.ts is 51,557 bytes with 13 exports against
     * the borehole module’s 72,968 and 3 - same filename, different module.
     *
     * All three routes answer 200 in production, so the ban was reporting five
     * errors with no fix that did not break a working endpoint. Scoped off here
     * rather than weakened globally, so the ban still bites everywhere else.
     *
     * If these modules move out of lib/building/, delete this block.
     */
    files: [
      "app/api/building/comprehensive-report/route.ts",
      "app/api/building/floor-plan/route.ts",
      "app/api/building/model-3d/route.ts",
    ],
    rules: { "no-restricted-imports": "off" },
  },
  {
    /*
     * Build scripts run on node directly, with no bundler and no "@/" alias, so
     * a relative import is the only specifier that resolves. tsconfig.json has
     * always excluded scripts/ for the same reason.
     */
    files: ["scripts/**"],
    rules: { "no-restricted-imports": "off" },
  },
  {
    /*
     * TWO COMPILER BAILOUTS, LEFT AS BAILOUTS DELIBERATELY.
     *
     * React Compiler reports "Existing memoization could not be preserved" for
     * performAnalysis in AIAnalysisPanel and generateQuotation in
     * SolarGeniusProComplete. It is an OPTIMISATION notice, not a defect: both
     * callbacks run correctly, they simply are not auto-memoised, so those two
     * components re-render more than they strictly need to.
     *
     * One real cause was found and fixed on 2026-10-01 - performAnalysis built
     * its readings object by writing through a type assertion, a mutation the
     * compiler cannot prove safe - and the notice survived it. What remains is
     * the shape of two long async handlers, each a few hundred lines of
     * sequential API calls and progress updates. Satisfying the optimiser means
     * restructuring the generator diagnostics flow and the solar quotation
     * flow, which are live revenue paths, for no behavioural gain.
     *
     * Scoped to these two files rather than switched off globally, so anything
     * written after this still gets the warning. Note the project already
     * disables seven sibling react-hooks rules in the block above; this is the
     * narrow version of the same decision.
     */
    files: [
      "components/generator-oracle/panels/AIAnalysisPanel.tsx",
      "components/solar/SolarGeniusProComplete.tsx",
    ],
    rules: { "react-hooks/preserve-manual-memoization": "off" },
  },
]);
