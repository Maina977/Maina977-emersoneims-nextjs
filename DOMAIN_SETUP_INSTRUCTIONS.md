# 🌐 DOMAIN SETUP - www.emersoneims.com

## 🔍 ROOT CAUSE

**www.emersoneims.com is not working because:**

1. ❌ **Domain not added in Vercel Dashboard** - Most likely cause
2. ❌ **DNS not pointing to Vercel** - DNS records not configured
3. ❌ **Domain not verified** - SSL certificate not issued

---

## ✅ SOLUTION: Complete Setup Steps

### **STEP 1: Add Domain in Vercel Dashboard** ⚠️ REQUIRED

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Login to your account
   - Select project: `Maina977-emersoneims-nextjs`

2. **Navigate to Domain Settings:**
   - Click on your project
   - Go to **Settings** tab
   - Click **Domains** in the left sidebar

3. **Add www.emersoneims.com:**
   - Click **"Add Domain"** button
   - Enter: `www.emersoneims.com`
   - Click **"Add"**
   - Vercel will show DNS configuration instructions

4. **Add emersoneims.com (apex domain):**
   - Also add: `emersoneims.com` (without www)
   - This ensures both work

---

### **STEP 2: Configure DNS Records** ⚠️ REQUIRED

**At your domain registrar (where you bought emersoneims.com):**

#### **For www.emersoneims.com:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

#### **For emersoneims.com (apex domain):**
**Option A - Use A Records (if CNAME not supported):**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**Option B - Use Vercel Nameservers (Recommended):**
Change nameservers to:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

---

### **STEP 3: Wait for DNS Propagation**

- DNS changes can take **24-48 hours** to propagate
- Check status: https://dnschecker.org
- Test with: `nslookup www.emersoneims.com`

---

### **STEP 4: Verify SSL Certificate**

- Vercel automatically issues SSL certificates
- Wait 5-10 minutes after DNS is configured
- Check: https://www.emersoneims.com (should show green lock)

---

## 🔧 Code Configuration (Already Done)

✅ **Middleware redirect** - Added in `middleware.ts`
✅ **Vercel config** - Updated in `vercel.json`
✅ **Environment variables** - Set in `vercel.json`

**Note:** Code changes are complete. Domain setup in Vercel dashboard is required.

---

## 🧪 Testing After Setup

### **Test 1: Check DNS**
```bash
nslookup www.emersoneims.com
# Should return: cname.vercel-dns.com
```

### **Test 2: Check HTTPS**
```bash
curl -I https://www.emersoneims.com
# Should return: HTTP/2 200 (or 301 redirect)
```

### **Test 3: Check SSL**
Visit: https://www.ssllabs.com/ssltest/analyze.html?d=www.emersoneims.com

---

## ⚙️ Optional: Redirect Configuration

**Current behavior:** Both www and non-www work independently

**To redirect www → non-www:**
1. Add environment variable in Vercel:
   - Name: `REDIRECT_WWW`
   - Value: `true`
2. Redeploy

**To redirect non-www → www:**
- Update middleware.ts (currently redirects www to non-www)

---

## 📋 Checklist

- [ ] Domain added in Vercel dashboard
- [ ] DNS records configured at registrar
- [ ] DNS propagated (check with dnschecker.org)
- [ ] SSL certificate issued (check in Vercel dashboard)
- [ ] Test www.emersoneims.com in browser
- [ ] Test emersoneims.com in browser
- [ ] Both domains working correctly

---

## 🆘 Troubleshooting

### **Domain shows "Not Configured" in Vercel:**
- Make sure you added the domain in Settings → Domains
- Check spelling: `www.emersoneims.com`

### **DNS not resolving:**
- Wait 24-48 hours for propagation
- Check DNS records at your registrar
- Verify CNAME points to `cname.vercel-dns.com`

### **SSL certificate not issued:**
- Wait 5-10 minutes after DNS is configured
- Check Vercel dashboard → Domains → SSL status
- May need to remove and re-add domain

### **Getting 404 or error page:**
- Check Vercel deployment is successful
- Verify project is connected to GitHub
- Check build logs in Vercel dashboard

---

## ✅ Expected Result

After completing all steps:
- ✅ www.emersoneims.com → Works
- ✅ emersoneims.com → Works  
- ✅ SSL certificates → Auto-generated
- ✅ Both domains → Serve the same Next.js app

---

**Status:** Code ready. **Domain configuration in Vercel dashboard required.**

