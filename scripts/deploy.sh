#!/bin/bash
# Deployment Script for Emerson EIMS
# Deploys to Vercel Production

set -e

SKIP_BUILD=false
SKIP_LOGIN=false
ENVIRONMENT="production"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --skip-login)
            SKIP_LOGIN=true
            shift
            ;;
        --preview)
            ENVIRONMENT="preview"
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

echo "========================================"
echo "  Emerson EIMS Deployment Script"
echo "  Domain: www.emersoneims.com"
echo "========================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    echo "   Please run this script from the project root directory."
    exit 1
fi

# Check Node.js
echo "📦 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo "   ❌ Node.js not found! Please install Node.js 18+."
    exit 1
fi
NODE_VERSION=$(node --version)
echo "   ✅ Node.js: $NODE_VERSION"

if ! command -v npm &> /dev/null; then
    echo "   ❌ npm not found!"
    exit 1
fi
NPM_VERSION=$(npm --version)
echo "   ✅ npm: $NPM_VERSION"
echo ""

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📥 Installing dependencies..."
    npm install --legacy-peer-deps
    echo "   ✅ Dependencies installed"
    echo ""
fi

# Build the project
if [ "$SKIP_BUILD" = false ]; then
    echo "🔨 Building project..."
    echo "   This may take a few minutes..."
    
    # Try webpack build first
    if npx next build --webpack 2>/dev/null; then
        echo "   ✅ Build successful (webpack)"
    else
        echo "   ⚠️  Webpack build failed, trying default build..."
        if npm run build; then
            echo "   ✅ Build successful"
        else
            echo "   ❌ Build failed!"
            echo "   You can skip the build with --skip-build flag"
            exit 1
        fi
    fi
    echo ""
fi

# Check Vercel CLI
echo "🚀 Preparing for deployment..."
if ! command -v npx &> /dev/null; then
    echo "   ❌ npx not found!"
    exit 1
fi
echo "   ✅ Vercel CLI available"

# Check if logged in to Vercel
echo "🔐 Checking Vercel authentication..."
if npx vercel@latest whoami &> /dev/null; then
    echo "   ✅ Authenticated with Vercel"
else
    if [ "$SKIP_LOGIN" = true ]; then
        echo "   ⚠️  Not authenticated, but --skip-login flag is set"
        echo "   Deployment may fail. Run 'npx vercel@latest login' first."
    else
        echo "   ⚠️  Not authenticated with Vercel"
        echo "   Opening login page..."
        echo ""
        echo "   Please complete authentication in your browser."
        echo ""
        npx vercel@latest login
        if [ $? -ne 0 ]; then
            echo "   ❌ Login failed or cancelled!"
            exit 1
        fi
        echo "   ✅ Authentication successful"
    fi
fi
echo ""

# Deploy to Vercel
echo "🚀 Deploying to Vercel ($ENVIRONMENT)..."
echo "   Domain: www.emersoneims.com"
echo ""

if [ "$ENVIRONMENT" = "production" ]; then
    npx vercel@latest --prod --yes
else
    npx vercel@latest --yes
fi

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "  ✅ Deployment Successful!"
    echo "========================================"
    echo ""
    echo "Next steps:"
    echo "1. Configure your domain in Vercel Dashboard"
    echo "2. Add DNS records as instructed by Vercel"
    echo "3. Wait for DNS propagation (may take up to 48 hours)"
    echo ""
    echo "Visit: https://vercel.com/dashboard"
else
    echo ""
    echo "❌ Deployment failed!"
    echo "   Check the error messages above for details."
    exit 1
fi
