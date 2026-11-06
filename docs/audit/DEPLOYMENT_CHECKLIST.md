# Deployment checklist

Production deploys automatically when `main` is pushed to GitHub (Vercel project `my-app`). Nothing is pushed without the owner's go-ahead.

1. `git status` clean apart from `AGENTS.md`/`CLAUDE.md` (never committed).
2. `npx tsc --noEmit`, `npx vitest run`, `npx eslint .` (0 errors).
3. Gate: `node scripts/verify/run-local-verify.cjs --gate`, launched detached; read `scripts/verify/out/summary.txt` until `RESULT PASSED`.
4. Second check on the built pages: `--serve --no-build`, then the step-2 script (pages, retired endpoints, sitemap 479, robots tags).
5. Pre-push scan: no `.env`, no secrets, no owner email in the diff.
6. Owner says "push to live"; `git push origin main`.
7. Watch `npx vercel ls --prod` until the new deployment is Ready; then the spaced live check (9 s between requests; never a burst).
8. Rollback: in Vercel, Deployments → previous Ready deployment → "Promote to Production"; or `git revert <sha>` and push.

Environment variables in use (names only): `DATABASE_URL` and Neon set, `SMTP_*`, `LEAD_RECIPIENTS`, `LEAD_DIAG_TOKEN`, `ANALYTICS_*`, `GROQ_API_KEY`, `GEMINI_API_KEY`, `OPENAI_API_KEY`, `OPENWEATHERMAP_API_KEY`, `AFRICASTALKING_*`, `MPESA_*`, `ERP_QUOTE_ENDPOINT` (dead), `SITE_ORIGIN`. Optional: `OPEN_METEO_API_KEY`, `NEXT_PUBLIC_GOOGLE_ADS_CONTACT_LABEL`.
