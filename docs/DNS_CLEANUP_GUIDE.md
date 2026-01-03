# 🚨 URGENT DNS FIX: Resolve `www` Conflict

You have confirmed that your nameservers are set to:
- `ns1.vercel-dns.com`
- `ns2.vercel-dns.com`

**This is correct.** Vercel is now in control.

However, your previous scan showed a **CRITICAL CONFLICT** that will break the site. You have both **A Records** and a **CNAME Record** for `www`. This is not allowed.

## 🛠️ STEP 1: Clean Up Vercel DNS Records

Go to your **Vercel Dashboard** > **Project Settings** > **Domains** (or DNS tab).

### 1. DELETE these specific records (if they exist):
You must remove the "A" records for `www`. They are conflicting with the CNAME.

| Type | Name | Value | Action |
|------|------|-------|--------|
| **A** | **www** | `216.198.79.65` | ❌ **DELETE** |
| **A** | **www** | `64.29.17.65` | ❌ **DELETE** |

### 2. VERIFY these records exist:
Ensure these are the **only** records for the website itself.

| Type | Name | Value | Status |
|------|------|-------|--------|
| **A** | **@** | `76.76.21.21` | ✅ KEEP |
| **CNAME** | **www** | `cname.vercel-dns.com.` | ✅ KEEP |
| **AAAA** | **@** | `2a06:98c1:3121::3` | ✅ KEEP (Optional but good) |

---

## 📧 STEP 2: Re-Add Email Records (ScalaHosting)

Since Vercel is now authoritative, you must manually add your email records back into Vercel, or email will stop working.

**Add these in Vercel DNS:**

| Type | Name | Value | Priority |
|------|------|-------|----------|
| **MX** | **@** | `mail.emersoneims.com.` | `10` |
| **A** | **mail** | *[Your ScalaHosting IP]* | - |
| **TXT** | **@** | `"v=spf1 include:spf.scalahosting.com ~all"` | - |

*(Note: You need to find your specific ScalaHosting IP address from your cPanel for the `mail` A record).*

---

## 🚀 STEP 3: Final Propagation Test

After making these changes, wait 15-30 minutes.

1. Open a terminal or use a tool like `WhatsMyDNS.net`.
2. Check **A Record** for `www.emersoneims.com`.
   - **Result:** Should show NO records (or just the CNAME alias IP).
3. Check **CNAME Record** for `www.emersoneims.com`.
   - **Result:** Should show `cname.vercel-dns.com`.

Once the "A" records for `www` are gone, the site will stabilize.
