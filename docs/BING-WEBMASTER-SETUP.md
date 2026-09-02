# Bing Webmaster Tools — how to verify (the file was removed, here is why)

`public/BingSiteAuth.xml` used to contain:

```xml
<user>8F9B2C3D4E5F6A7B8C9D0E1F2A3B4C5D</user>
```

That token was **fabricated**. It was never issued by Bing, so it could never
verify the site, and serving it publicly only advertised a broken setup. It was
removed on 2026-08-03 with the owner's approval. Nothing in the codebase
referenced it.

## Verifying properly (5 minutes, no code changes needed)

The fastest route needs no file at all:

1. Go to <https://www.bing.com/webmasters>
2. Sign in and choose **Import from Google Search Console**
3. Authorise, pick `https://www.emersoneims.com/`

Search Console is already verified and working, so Bing accepts that as proof of
ownership. This imports the property and its sitemap in one step.

## If you prefer the manual route

Bing offers three alternatives. Any ONE is enough:

- **XML file** — Bing gives you a real token. Recreate
  `public/BingSiteAuth.xml` with it and redeploy. It is served at
  `https://www.emersoneims.com/BingSiteAuth.xml`.
- **Meta tag** — add the value to Vercel as `NEXT_PUBLIC_BING_VERIFICATION`;
  `app/layout.tsx` already emits verification meta conditionally, so it only
  needs wiring in the same pattern as `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.
  Note `NEXT_PUBLIC_*` is inlined at BUILD time, so it needs a redeploy.
- **DNS CNAME** — add the record Bing supplies at the domain registrar.

## Worth knowing

Bing indexing is already being fed regardless of verification: the site submits
every sitemap URL through **IndexNow**, whose key file
(`/emersoneims2025indexnow.txt`) IS genuine and matches the key in
`app/api/seo/submit-urls/route.ts`. Verification adds reporting and crawl
control — it is not what gets pages into Bing.

Verifying also covers DuckDuckGo, Ecosia and Yahoo, which all draw on Bing's
index.
