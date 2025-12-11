# Deployment Guide for emersoneims.com

## Domain Configuration

**Production Domain:** https://www.emersoneims.com
**WordPress URL:** https://www.emersoneims.com (or subdomain if separate)

## Pre-Deployment Setup

### 1. Environment Variables

Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Update with production values:
```env
NEXT_PUBLIC_SITE_URL=https://www.emersoneims.com
WORDPRESS_API_URL=https://www.emersoneims.com/wp-json/wp/v2
WORDPRESS_SITE_URL=https://www.emersoneims.com
WORDPRESS_INTEGRATION=true
NODE_ENV=production
```

### 2. WordPress Configuration

#### Enable REST API
Ensure WordPress REST API is enabled at:
`https://www.emersoneims.com/wp-json/wp/v2`

#### Configure CORS (in WordPress functions.php)
```php
function emersoneims_cors_headers() {
    header('Access-Control-Allow-Origin: https://www.emersoneims.com');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        exit(0);
    }
}
add_action('init', 'emersoneims_cors_headers');
```

## Deployment Options

### Option 1: Vercel Deployment (Recommended)

1. **Connect Repository**
   ```bash
   npm i -g vercel
   vercel login
   vercel
   ```

2. **Configure Domain**
   - Go to Vercel Dashboard
   - Project Settings → Domains
   - Add: `www.emersoneims.com`
   - Add: `emersoneims.com` (redirects to www)

3. **Environment Variables**
   - Project Settings → Environment Variables
   - Add all variables from `.env`

4. **Deploy**
   ```bash
   vercel --prod
   ```

### Option 2: WordPress Integration (Headless)

1. **Deploy Next.js**
   - Deploy to Vercel/Netlify/Your hosting
   - Configure domain: `www.emersoneims.com`

2. **WordPress Setup**
   - WordPress on same domain or subdomain
   - Configure REST API
   - Set up CORS

3. **Connect**
   - Update `WORDPRESS_API_URL` in production
   - Test API connectivity

### Option 3: Static Export to WordPress

1. **Build Static Files**
   ```bash
   # Update next.config.ts
   output: 'export'
   STATIC_EXPORT=true npm run build
   ```

2. **Upload to WordPress**
   - Upload `out/` folder contents
   - Configure WordPress to serve Next.js routes
   - Or use WordPress plugin to embed

## DNS Configuration

### Required DNS Records

```
Type    Name    Value
A       @       [Your Server IP]
A       www     [Your Server IP]
CNAME   www     [If using CDN]
```

### SSL Certificate

- Use Let's Encrypt (free)
- Or purchase SSL certificate
- Ensure HTTPS is enforced

## Post-Deployment Checklist

### Domain Verification
- [ ] www.emersoneims.com loads correctly
- [ ] emersoneims.com redirects to www
- [ ] HTTPS is working
- [ ] SSL certificate valid

### WordPress Integration
- [ ] REST API accessible: `https://www.emersoneims.com/wp-json/wp/v2`
- [ ] CORS headers configured
- [ ] API calls working
- [ ] Authentication working (if needed)

### Performance
- [ ] Page load time < 3 seconds
- [ ] Lighthouse score > 90
- [ ] Images optimized
- [ ] CDN configured (if applicable)

### SEO
- [ ] Metadata correct
- [ ] Open Graph tags working
- [ ] Sitemap accessible
- [ ] Robots.txt configured
- [ ] Canonical URLs correct

### Security
- [ ] Security headers configured
- [ ] HTTPS enforced
- [ ] Environment variables secure
- [ ] No sensitive data exposed

## Testing

### Test URLs
- Home: https://www.emersoneims.com
- WordPress API: https://www.emersoneims.com/wp-json/wp/v2/posts
- Sitemap: https://www.emersoneims.com/sitemap.xml
- Robots: https://www.emersoneims.com/robots.txt

### Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

## Monitoring

### Set Up
- [ ] Error tracking (Sentry)
- [ ] Analytics (Google Analytics)
- [ ] Uptime monitoring
- [ ] Performance monitoring

### Alerts
- [ ] Error rate alerts
- [ ] Uptime alerts
- [ ] Performance alerts

## Troubleshooting

### Domain Not Resolving
- Check DNS records
- Verify DNS propagation
- Check server configuration

### WordPress API Not Working
- Verify REST API enabled
- Check CORS configuration
- Review WordPress error logs
- Test API endpoint directly

### SSL Issues
- Verify certificate installed
- Check certificate expiration
- Ensure HTTPS redirect working

## Support

For deployment issues:
1. Check error logs
2. Review configuration
3. Test locally first
4. Contact hosting support if needed

---

**Last Updated:** $(date)
**Domain:** emersoneims.com
**Status:** Ready for Deployment




