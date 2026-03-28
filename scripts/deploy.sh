#!/bin/bash
# SAFE DEPLOYMENT SCRIPT
# This ensures code is committed to GitHub AND deployed to Vercel correctly
# Prevents cache mismatches between GitHub and Vercel

set -e

echo "=== EMERSON EIMS DEPLOYMENT SCRIPT ==="
echo ""

# Step 1: Check for uncommitted changes
echo "1. Checking for uncommitted changes..."
if [[ -n $(git status --porcelain) ]]; then
    echo "   Found uncommitted changes. Committing..."
    git add -A
    git commit -m "Auto-commit before deployment

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
else
    echo "   No uncommitted changes."
fi

# Step 2: Push to GitHub
echo ""
echo "2. Pushing to GitHub..."
git push origin main

# Step 3: Wait for sync
echo ""
echo "3. Waiting 5 seconds for GitHub sync..."
sleep 5

# Step 4: Deploy to Vercel with force flag
echo ""
echo "4. Deploying to Vercel production..."
npx vercel deploy --prod --force

echo ""
echo "=== DEPLOYMENT COMPLETE ==="
echo "Site is live at: https://emersoneims.com"
