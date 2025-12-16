# 📄 Complete Website Pages Inventory

## Main Pages (10 Pages)

1. **Homepage** - `/` (`app/page.tsx`)
2. **About Us** - `/about-us` (`app/about-us/page.tsx`)
3. **Contact** - `/contact` (`app/contact/page.tsx`)
4. **Generators** - `/generators` (`app/generators/page.tsx`)
5. **Used Generators** - `/generators/used` (`app/generators/used/page.tsx`)
6. **Service** - `/service` (`app/service/page.tsx`)
7. **Solar** - `/solar` (`app/solar/page.tsx`)
8. **Solution** - `/solution` (`app/solution/page.tsx`)
9. **Diagnostics** - `/diagnostics` (`app/diagnostics/page.tsx`)
10. **Diagnostic Suite** - `/diagnostic-suite` (`app/diagnostic-suite/page.tsx`)

## Special Routes (4 Routes)

11. **404 Not Found** - `/_not-found` (`app/not-found.tsx`)
12. **Robots.txt** - `/robots.txt` (`app/robots.ts`)
13. **Sitemap.xml** - `/sitemap.xml` (`app/sitemap.ts`)
14. **Manifest** - `/manifest.webmanifest` (`app/manifest.ts`)

## API Routes (8 Routes - Not Public Pages)

These are backend API endpoints, not public-facing pages:

1. `/api/ai/chat` - AI Chat API
2. `/api/ai/engagement-offer` - AI Engagement Offer API
3. `/api/analytics/conversion` - Analytics Conversion API
4. `/api/analytics/dashboard` - Analytics Dashboard API
5. `/api/analytics/event` - Analytics Event API
6. `/api/analytics/visitor` - Analytics Visitor API
7. `/api/notifications/new-lead` - New Lead Notification API
8. `/api/wordpress` - WordPress Integration API

---

## 📊 Summary

### Public-Facing Pages: **10 Pages**
- Main content pages that users can navigate to

### Special System Routes: **4 Routes**
- SEO and system files (robots, sitemap, manifest, 404)

### API Endpoints: **8 Routes**
- Backend services (not public pages)

### **Total Routes in Build: 24**
- 10 public pages
- 4 special routes
- 8 API routes
- 2 additional (likely middleware and root layout)

---

## 🗺️ Sitemap Pages (8 Listed)

According to `app/sitemap.ts`, these pages are included in the sitemap:

1. `/` (Homepage)
2. `/generators`
3. `/service`
4. `/solar`
5. `/diagnostic-suite`
6. `/solution`
7. `/about-us`
8. `/contact`

*Note: `/diagnostics` and `/generators/used` are not in the sitemap but are accessible pages.*

---

## ✅ Answer: **10 Main Public Pages**

Your website has **10 main public-facing pages** that users can navigate to, plus 4 special system routes (404, robots, sitemap, manifest) and 8 API endpoints.

