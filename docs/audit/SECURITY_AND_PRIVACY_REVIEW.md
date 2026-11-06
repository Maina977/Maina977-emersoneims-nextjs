# Security and privacy review (2026-11-05)

## Fixed in this pass
| Issue | Evidence | Fix | Verified |
|---|---|---|---|
| **Critical**: Next.js 16.3.8 in range of GHSA-2464-fhr4-w9xw (unauthenticated RCE in image optimisation when SVG is allowed). `next.config.ts` sets `images.dangerouslyAllowSVG: true` | `npm audit` | Next.js 16.4.2 (released 2026-10-15) | `npm audit`: critical 0; tests, type check, lint, full gate |
| **Critical**: Next.js GHSA-673q-mjm6-r5xr (`use cache` RCE), GHSA-p3m5-59mp-jv5r (Server Actions DoS) | `npm audit` | same upgrade | same |
| **Critical**: DOMPurify ≤3.4.16 (GHSA-cg2g-xh64-v4q7) | `npm audit` | 3.4.17 | same |
| Transitive highs (source-map-js and others) | `npm audit` | `npm audit fix` (no major versions) | high 4 → 3 |

## Open, with reasons
| Package | Risk here | Plan |
|---|---|---|
| nodemailer 8.0.11 (needs 10.x, two majors) | It sends enquiry emails. Advisories need the `raw` option (unused) or very long crafted addresses (the form caps email at 320 chars and validates format) | Upgrade in its own change with a labelled test enquiry and inbox check |
| xlsx 0.18.5 (no fixed version) | Parses spreadsheets the visitor uploads, in the visitor's own browser (Solar quote parser) | Replace with a maintained parser, or remove the upload |
| brace-expansion | File-pattern expansion; no visitor input reaches it | Will clear with upstream updates |

## Existing protections (verified in code)
- Contact API: honeypot field, 6 requests/min/IP rate limit, field length caps, email format check, spam classifier; leads stored even if notifications fail; "nobody was told" alarm in logs.
- Data relay: host allow-list, per-client limit (300/min), 10-minute block on sources whose quota is spent, paid key used only for same-site requests.
- Content-Security-Policy header in `next.config.ts`; `X-Robots-Tag: noindex` on API responses.
- Sensitive Vercel variables (SMTP password, diagnostics token, analytics tokens) are stored as Sensitive and cannot be read back.
- Retired public endpoints answer 410 (old AquaScan engine, integrated-diagnose).

## Privacy (Kenya Data Protection Act 2019)
- Analytics never receive names, phone numbers, emails or messages (only service category and page).
- Google tags load behind consent mode.
- PENDING OWNER: retention period for the `leads` table, privacy policy review, cookie notice wording, data-controller registration status with the ODPC.
