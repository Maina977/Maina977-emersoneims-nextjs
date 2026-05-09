# 🌐 Domain Migration Guide: EmersonEIMS

## Overview
Migrating from `my-app-ten-rouge-96.vercel.app` to **`www.emersoneims.com`**

---

## ✅ Automated Deployment

Run the automated deployment script:

```powershell
# Navigate to project
cd C:\Users\PC\my-app

# Run deployment script
.\DEPLOY_EMERSONEIMS_DOMAIN.ps1
```

The script will automatically:
1. ✅ Clean all build artifacts
2. ✅ Fresh install dependencies
3. ✅ Configure environment variables
4. ✅ Deploy to Vercel production
5. ✅ Set up custom domain
6. ✅ Test deployment

---

## 🔧 Manual Domain Configuration (If Needed)

### Step 1: Vercel Dashboard Setup

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **emerson-eims**
3. Navigate to **Settings** → **Domains**

### Step 2: Add Custom Domains

Add both domains:
- `emersoneims.com` (root domain)
- `www.emersoneims.com` (www subdomain)

Click **Add** for each domain.

### Step 3: Configure DNS Records

At your domain registrar (GoDaddy, Namecheap, etc.), add these DNS records:

#### Required DNS Records:

```
Type    Name    Value                       TTL
----    ----    -----                       ---
A       @       76.76.21.21                 600
CNAME   www     cname.vercel-dns.com        600
```

**Alternative (if Vercel provides different IPs):**
- Check Vercel Dashboard → Domains → your domain
- Use the exact DNS records shown there

### Step 4: Verify Domain

1. In Vercel Dashboard → Domains
2. Wait for verification (can take 5 mins - 48 hours)
3. Status should change from "Pending" to "Active"

---

## 🔍 Verification Checklist

### ✅ Deployment Status
```powershell
# Check deployment status
vercel ls

# Verify environment variables
vercel env ls
```

### ✅ Domain Status
```powershell
# Test domain response
curl -I https://www.emersoneims.com

# Check DNS propagation
nslookup emersoneims.com
nslookup www.emersoneims.com
```

### ✅ Website Functionality
- [ ] Homepage loads correctly
- [ ] All pages accessible
- [ ] Images display properly
- [ ] Navigation works
- [ ] Forms submit correctly
- [ ] Calculators function
- [ ] Contact page works

---

## 🚨 Troubleshooting

### Issue: Domain shows "Domain not configured"

**Solution:**
1. Verify DNS records are correct
2. Wait for DNS propagation (up to 48 hours)
3. Use [DNS Checker](https://dnschecker.org/) to verify propagation

### Issue: "This domain is already in use"

**Solution:**
```powershell
# Remove domain from old project in Vercel Dashboard
# Then add to new project:
vercel domains add www.emersoneims.com
```

### Issue: SSL Certificate error

**Solution:**
- Vercel automatically provisions SSL certificates
- Can take up to 24 hours after DNS verification
- Check Vercel Dashboard → Domains for SSL status

### Issue: Environment variables not working

**Solution:**
```powershell
# Re-add environment variables
vercel env rm NEXT_PUBLIC_SITE_URL production --yes
echo "https://www.emersoneims.com" | vercel env add NEXT_PUBLIC_SITE_URL production --yes

# Redeploy
vercel --prod --yes
```

---

## 📊 DNS Propagation Status

Check DNS propagation globally:
- **DNS Checker**: https://dnschecker.org/
- **What's My DNS**: https://whatsmydns.net/

Enter: `emersoneims.com` or `www.emersoneims.com`

---

## 🔒 Security Checklist

After deployment, verify:
- [x] HTTPS enabled (automatic with Vercel)
- [x] SSL certificate active
- [x] HSTS headers configured
- [x] Security headers in place
- [x] No mixed content warnings

---

## 🎯 Post-Deployment Tasks

1. **Update Google Search Console**
   - Add new domain: www.emersoneims.com
   - Submit sitemap: https://www.emersoneims.com/sitemap.xml

2. **Update Analytics**
   - Google Analytics: Update property URL
   - Any other analytics tools

3. **Update Social Media**
   - Update website links on social profiles
   - Update Open Graph URLs

4. **Test All Functionality**
   - Run through all user flows
   - Test on different devices
   - Check all external integrations

5. **Monitor Performance**
   - Check Vercel Analytics
   - Monitor error rates
   - Review Core Web Vitals

---

## 📞 Support

If you encounter issues:

1. **Vercel Support**: https://vercel.com/support
2. **Documentation**: https://vercel.com/docs
3. **Community**: https://github.com/vercel/vercel/discussions

---

## 🎉 Success Criteria

Your deployment is successful when:

- ✅ https://www.emersoneims.com loads correctly
- ✅ SSL certificate is active (green padlock)
- ✅ All pages are accessible
- ✅ No console errors
- ✅ Forms and calculators work
- ✅ Images load properly
- ✅ Performance is optimal

---

**Last Updated**: December 28, 2025
**Domain**: www.emersoneims.com
**Status**: Ready for deployment 🚀
