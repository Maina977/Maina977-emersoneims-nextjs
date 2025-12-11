#!/bin/bash
# Script to set environment variables for Emerson EIMS

# Export environment variables
export NEXT_PUBLIC_SITE_URL=https://www.emersoneims.com
export WORDPRESS_API_URL=https://www.emersoneims.com/wp-json/wp/v2
export WORDPRESS_SITE_URL=https://www.emersoneims.com
export NODE_ENV=production

# Optional WordPress integration flags
# export WORDPRESS_INTEGRATION=true
# export STATIC_EXPORT=true

echo "✅ Environment variables set:"
echo "   NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL"
echo "   WORDPRESS_API_URL=$WORDPRESS_API_URL"
echo "   WORDPRESS_SITE_URL=$WORDPRESS_SITE_URL"
echo "   NODE_ENV=$NODE_ENV"
echo ""
echo "🚀 Ready to build! Run: npm run build"




