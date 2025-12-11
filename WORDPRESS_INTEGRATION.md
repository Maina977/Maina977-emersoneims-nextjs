# WordPress Integration Guide

## Overview

This guide explains how to integrate the Emerson EIMS Next.js application with WordPress.

## Integration Methods

### Method 1: Headless WordPress (Recommended)

Use WordPress as a headless CMS and Next.js as the frontend.

#### Setup

1. **WordPress Configuration**
   ```php
   // In wp-config.php
   define('WP_REST_API_ENABLED', true);
   ```

2. **CORS Configuration**
   ```php
   // In functions.php
   function add_cors_headers() {
       $allowed_origins = [
           'https://your-nextjs-app.com',
           'http://localhost:3000', // For development
       ];
       
       $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
       if (in_array($origin, $allowed_origins)) {
           header("Access-Control-Allow-Origin: $origin");
           header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
           header('Access-Control-Allow-Headers: Content-Type, Authorization');
       }
       
       if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
           exit(0);
       }
   }
   add_action('init', 'add_cors_headers');
   ```

3. **Next.js Configuration**
   ```env
   WORDPRESS_API_URL=https://your-wordpress-site.com/wp-json/wp/v2
   WORDPRESS_SITE_URL=https://your-wordpress-site.com
   WORDPRESS_INTEGRATION=true
   ```

4. **Usage in Components**
   ```typescript
   import { wordpressClient } from '@/lib/wordpress/client';
   
   // Server Component
   export default async function PostsPage() {
     const posts = await wordpressClient.getPosts({ per_page: 10 });
     
     return (
       <div>
         {posts.map(post => (
           <article key={post.id}>
             <h2>{post.title.rendered}</h2>
             <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
           </article>
         ))}
       </div>
     );
   }
   ```

### Method 2: WordPress Plugin Integration

Create a WordPress plugin to embed the Next.js app.

#### Plugin Structure

```php
<?php
/**
 * Plugin Name: Emerson EIMS Integration
 * Description: Integrates Next.js Emerson EIMS application
 * Version: 1.0.0
 */

class EmersonEIMSIntegration {
    public function __construct() {
        add_shortcode('emerson_eims', [$this, 'render_shortcode']);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_scripts']);
    }
    
    public function render_shortcode($atts) {
        $atts = shortcode_atts([
            'page' => 'home',
            'height' => '800px',
        ], $atts);
        
        $nextjs_url = 'https://your-nextjs-app.com';
        
        return sprintf(
            '<iframe src="%s/%s" width="100%%" height="%s" frameborder="0"></iframe>',
            esc_url($nextjs_url),
            esc_attr($atts['page']),
            esc_attr($atts['height'])
        );
    }
    
    public function enqueue_scripts() {
        // Enqueue any necessary scripts
    }
}

new EmersonEIMSIntegration();
```

#### Usage

```
[emerson_eims page="generators" height="1000px"]
```

### Method 3: Static Export

Export Next.js as static files and integrate with WordPress theme.

#### Setup

1. **Update next.config.ts**
   ```typescript
   const nextConfig: NextConfig = {
     output: 'export',
     images: {
       unoptimized: true,
     },
   };
   ```

2. **Build Static Files**
   ```bash
   npm run build
   ```

3. **WordPress Theme Integration**
   ```php
   // In theme functions.php
   function load_emerson_eims() {
       $nextjs_path = get_template_directory() . '/nextjs-app';
       if (file_exists($nextjs_path)) {
           // Load Next.js app
           include $nextjs_path . '/index.html';
       }
   }
   add_action('wp_footer', 'load_emerson_eims');
   ```

## API Endpoints

### Available Endpoints

- `GET /api/wordpress?endpoint=posts` - Fetch posts
- `GET /api/wordpress?endpoint=pages` - Fetch pages
- `GET /api/wordpress?endpoint=media/{id}` - Fetch media
- `POST /api/wordpress` - Post data to WordPress

### Example Usage

```typescript
// Fetch posts with parameters
const response = await fetch(
  '/api/wordpress?endpoint=posts&params=per_page=10&page=1'
);
const posts = await response.json();
```

## Authentication

### Basic Authentication

```typescript
const response = await fetch(WORDPRESS_API_URL + '/posts', {
  headers: {
    'Authorization': 'Basic ' + btoa('username:password'),
  },
});
```

### JWT Authentication

1. Install [JWT Authentication Plugin](https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/)

2. Configure in Next.js:
   ```typescript
   const token = await getJWTToken();
   const response = await fetch(WORDPRESS_API_URL + '/posts', {
     headers: {
       'Authorization': 'Bearer ' + token,
     },
   });
   ```

## Caching Strategy

### Next.js Caching

```typescript
// In API routes
export async function GET() {
  const response = await fetch(WORDPRESS_API_URL, {
    next: { revalidate: 3600 }, // Revalidate every hour
  });
  return response.json();
}
```

### WordPress Caching

Install a caching plugin like WP Super Cache or W3 Total Cache.

## Security Considerations

1. **CORS Configuration**
   - Only allow specific origins
   - Use HTTPS in production

2. **API Authentication**
   - Use JWT tokens
   - Implement rate limiting

3. **Input Validation**
   - Validate all WordPress API responses
   - Sanitize HTML content

4. **Error Handling**
   - Handle API failures gracefully
   - Log errors securely

## Troubleshooting

### CORS Errors
- Check WordPress CORS headers
- Verify allowed origins
- Check browser console for errors

### API Connection Issues
- Verify WordPress REST API is enabled
- Check API URL is correct
- Test API endpoint directly

### Authentication Problems
- Verify JWT plugin is active
- Check token expiration
- Review WordPress error logs

## Best Practices

1. **Use Server Components** for WordPress data fetching
2. **Implement Caching** to reduce API calls
3. **Handle Errors** gracefully
4. **Optimize Images** from WordPress media library
5. **Monitor API Usage** to prevent rate limiting

## Support

For integration issues, check:
- WordPress REST API documentation
- Next.js API routes documentation
- Browser console for errors
- WordPress error logs




