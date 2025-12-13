# 🚀 Vercel Domain Configuration Guide

## Adding emersoneims.com to Vercel

---

## 📋 Step-by-Step Instructions

### Step 1: Deploy to Vercel First

```bash
# Login to Vercel
vercel login

# Deploy project
vercel --prod
```

Or connect via GitHub (recommended):
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Deploy

---

### Step 2: Add Custom Domain

1. **Go to Vercel Dashboard**
   - Navigate to your project
   - Click **Settings** → **Domains**

2. **Add Domain**
   - Click **Add Domain**
   - Enter: `emersoneims.com`
   - Click **Add**

3. **Add WWW Domain**
   - Click **Add Domain** again
   - Enter: `www.emersoneims.com`
   - Click **Add**

---

### Step 3: Get DNS Records

Vercel will show you DNS records needed:

**Example:**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Copy these records** - you'll need them for Hostinger!

---

### Step 4: Configure DNS in Hostinger

1. Go to [hpanel.hostinger.com](https://hpanel.hostinger.com)
2. Navigate to **Domains** → **emersoneims.com** → **DNS**
3. Add the DNS records from Step 3
4. Save

---

### Step 5: Verify Domain in Vercel

1. Go back to **Vercel Dashboard** → **Domains**
2. Wait for DNS propagation (5-30 minutes)
3. Vercel will automatically:
   - ✅ Verify domain
   - ✅ Issue SSL certificate
   - ✅ Configure HTTPS
   - ✅ Set up redirects

---

## 🔧 Environment Variables

**In Vercel Dashboard → Settings → Environment Variables:**

Add these for production:
```
NEXT_PUBLIC_SITE_URL=https://emersoneims.com
WORDPRESS_SITE_URL=https://www.emersoneims.com
WORDPRESS_API_URL=https://www.emersoneims.com/wp-json/wp/v2
```

---

## ✅ Verification

After setup, verify:

1. **Domain resolves:**
   ```bash
   nslookup emersoneims.com
   ```

2. **Site loads:**
   - Visit: `https://emersoneims.com`
   - Should show your Next.js site

3. **SSL works:**
   - Check for padlock icon
   - URL should be `https://`

4. **WordPress accessible:**
   - Visit: `https://www.emersoneims.com/wp-admin`
   - Should load WordPress

---

## 🎯 Architecture

```
emersoneims.com (Root)
    ↓
Vercel (Next.js)
    ↓
WordPress API
    ↓
www.emersoneims.com (WordPress on Scalahosting)
```

---

**Status: Ready to Configure** ✅

*Follow these steps to connect your domain!*




