# Deployment Guide

## Pre-Deployment Checklist

### ✅ Code Quality
- [ ] All TypeScript errors resolved
- [ ] Linting passes (`npm run lint`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] All components tested
- [ ] No console errors in browser

### ✅ Configuration
- [ ] Environment variables configured
- [ ] WordPress API URLs set correctly
- [ ] Build succeeds (`npm run build`)
- [ ] Production build tested locally

### ✅ Performance
- [ ] Images optimized
- [ ] Code splitting verified
- [ ] Bundle size acceptable
- [ ] Lighthouse score > 90

### ✅ SEO
- [ ] Metadata configured
- [ ] Sitemap generated (if needed)
- [ ] Robots.txt configured
- [ ] Open Graph tags added

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login
   vercel login
   
   # Deploy
   vercel
   ```

2. **Configure Environment Variables**
   - Go to Vercel Dashboard
   - Project Settings → Environment Variables
   - Add all variables from `.env.example`

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Option 2: WordPress Integration

#### Method A: Headless WordPress

1. **Deploy Next.js App**
   ```bash
   npm run build
   npm start
   ```

2. **Configure WordPress**
   - Install WordPress REST API plugin
   - Configure CORS headers
   - Set up authentication if needed

3. **Connect**
   - Update `WORDPRESS_API_URL` in production
   - Test API connectivity

#### Method B: Static Export to WordPress

1. **Export Static Files**
   ```bash
   # Update next.config.ts
   output: 'export'
   
   # Build
   npm run build
   ```

2. **Upload to WordPress**
   - Upload `out/` folder to WordPress theme
   - Or create custom page template
   - Configure routing

3. **WordPress Plugin Integration**
   ```php
   // Create WordPress plugin
   // Embed Next.js app via iframe or shortcode
   ```

### Option 3: Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   FROM node:18-alpine AS runner
   WORKDIR /app
   ENV NODE_ENV production
   COPY --from=builder /app/public ./public
   COPY --from=builder /app/.next/standalone ./
   COPY --from=builder /app/.next/static ./.next/static
   EXPOSE 3000
   CMD ["node", "server.js"]
   ```

2. **Build and Run**
   ```bash
   docker build -t emerson-eims .
   docker run -p 3000:3000 emerson-eims
   ```

## WordPress Integration Steps

### 1. Enable REST API

Add to `wp-config.php`:
```php
define('WP_REST_API_ENABLED', true);
```

### 2. Configure CORS

Add to `functions.php`:
```php
function add_cors_headers() {
    header('Access-Control-Allow-Origin: https://your-nextjs-app.com');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
}
add_action('init', 'add_cors_headers');
```

### 3. Test API Connection

```bash
curl https://your-wordpress-site.com/wp-json/wp/v2/posts
```

### 4. Configure Next.js

Update `.env`:
```env
WORDPRESS_API_URL=https://your-wordpress-site.com/wp-json/wp/v2
WORDPRESS_SITE_URL=https://your-wordpress-site.com
WORDPRESS_INTEGRATION=true
```

## Post-Deployment

### Monitoring
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure analytics
- [ ] Monitor API calls
- [ ] Check performance metrics

### Maintenance
- [ ] Set up automated backups
- [ ] Schedule dependency updates
- [ ] Monitor security updates
- [ ] Review logs regularly

## Troubleshooting

### Build Fails
```bash
# Clear cache
rm -rf .next node_modules/.cache
npm run clean
npm install
npm run build
```

### WordPress API Errors
- Check CORS configuration
- Verify API URL
- Check authentication
- Review WordPress error logs

### Performance Issues
- Enable image optimization
- Check bundle size
- Review code splitting
- Optimize API calls




