# 🔧 DOMAIN SETUP GUIDE - www.emersoneims.com

## 🔍 Issue Diagnosis

The domain `www.emersoneims.com` is not working because:

1. **Domain not configured in Vercel** - The domain needs to be added in Vercel dashboard
2. **DNS not pointing to Vercel** - DNS records need to be updated
3. **No redirect configured** - Need to handle www vs non-www

---

## ✅ SOLUTION: Configure Domain in Vercel

### **Step 1: Add Domain in Vercel Dashboard**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `Maina977-emersoneims-nextjs`
3. Go to **Settings** → **Domains**
4. Add both domains:
   - `emersoneims.com` (apex domain)
   - `www.emersoneims.com` (www subdomain)

### **Step 2: Configure DNS Records**

Vercel will provide DNS records. Add these to your domain registrar:

#### **For www.emersoneims.com:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### **For emersoneims.com (apex domain):**
```
Type: A
Name: @
Value: 76.76.21.21
```

OR use Vercel's nameservers:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

### **Step 3: Add Redirect in Next.js Config**

Update `next.config.ts` to redirect www to non-www (or vice versa):

