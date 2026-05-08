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
  }
]);
