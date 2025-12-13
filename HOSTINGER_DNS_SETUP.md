# 🌐 Hostinger DNS Configuration Guide

## Domain: emersoneims.com
## Hosting: Scalahosting (WordPress)
## CDN/Hosting: Vercel (Next.js)

---

## 📋 DNS Records to Add in Hostinger

### Step 1: Login to Hostinger

1. Go to [hpanel.hostinger.com](https://hpanel.hostinger.com)
2. Login with your Hostinger account
3. Navigate to **Domains** → **emersoneims.com**
4. Click **DNS / Name Servers**

---

## 📝 DNS Records Configuration

### After Vercel Deployment:

1. **Deploy to Vercel first** (get DNS records from Vercel)
2. **Go to Vercel Dashboard** → Your Project → **Settings** → **Domains**
3. **Add domain:** `emersoneims.com`
4. **Copy the DNS records** Vercel provides

### Typical Vercel DNS Records:

**For Root Domain (emersoneims.com):**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
Priority: -
```

**For WWW (www.emersoneims.com):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
Priority: -
```

---

## 🔧 Hostinger DNS Setup Steps

### 1. Add A Record (Root Domain)

1. In Hostinger DNS panel, click **Add Record**
2. Select **Type:** `A`
3. **Name:** `@` (or leave blank for root)
4. **Value:** [Vercel IP Address]
5. **TTL:** `3600`
6. Click **Add**

### 2. Add CNAME Record (WWW)

1. Click **Add Record**
2. Select **Type:** `CNAME`
3. **Name:** `www`
4. **Value:** `cname.vercel-dns.com`
5. **TTL:** `3600`
6. Click **Add**

### 3. Keep WordPress Records

**Keep existing records for WordPress (Scalahosting):**
- Any `A` records pointing to Scalahosting IP
- Any `CNAME` records for WordPress subdomains
- MX records for email (if using Hostinger email)

---

## ⚠️ Important Notes

### WordPress on Subdomain (Recommended)

If WordPress is on `www.emersoneims.com`:
- **Root domain** (`emersoneims.com`) → Points to Vercel
- **WWW** (`www.emersoneims.com`) → Can point to WordPress OR Vercel

**Option A: WordPress on www, Next.js on root**
- `emersoneims.com` → Vercel (A record)
- `www.emersoneims.com` → WordPress (existing CNAME/A record)

**Option B: Both on same domain**
- `emersoneims.com` → Vercel (A record)
- `www.emersoneims.com` → Vercel (CNAME)
- WordPress accessible via: `wordpress.emersoneims.com` (subdomain)

---

## 🔍 Verify DNS Configuration

### Check DNS Propagation:

```bash
# Check A record
nslookup emersoneims.com

# Check CNAME record
nslookup www.emersoneims.com

# Check all records
dig emersoneims.com ANY
```

### Online Tools:
- [whatsmydns.net](https://www.whatsmydns.net)
- [dnschecker.org](https://dnschecker.org)

---

## ⏱️ DNS Propagation Time

- **Initial:** 5-15 minutes
- **Full propagation:** 24-48 hours
- **Global:** Up to 72 hours

**Tip:** Clear your DNS cache after changes:
```bash
# Windows
ipconfig /flushdns

# Mac/Linux
sudo dscacheutil -flushcache
```

---

## ✅ Verification Checklist

- [ ] A record added for root domain
- [ ] CNAME record added for www
- [ ] WordPress records preserved
- [ ] DNS propagated (check with nslookup)
- [ ] Domain verified in Vercel
- [ ] SSL certificate issued (automatic)
- [ ] Site accessible at https://emersoneims.com

---

## 🆘 Troubleshooting

### Domain Not Resolving?

1. **Wait 24-48 hours** for full propagation
2. **Check DNS records** are correct
3. **Verify in Vercel** that domain is added
4. **Clear browser cache** and DNS cache

### SSL Certificate Issues?

- Vercel automatically issues SSL certificates
- Wait 5-10 minutes after domain verification
- Check Vercel dashboard for certificate status

### WordPress Not Accessible?

- Keep WordPress DNS records intact
- WordPress should be accessible at `www.emersoneims.com`
- Or use subdomain like `wordpress.emersoneims.com`

---

**Need Help?** Check `INTEGRATION_SETUP_GUIDE.md` for complete setup instructions.




