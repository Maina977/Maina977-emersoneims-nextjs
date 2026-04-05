#!/bin/bash
# ============================================================================
# PRO BUILDING SUITE - COMPLETE SETUP SCRIPT
# Run this to set up the entire backend infrastructure
# ============================================================================

echo "============================================"
echo "  PRO BUILDING SUITE SETUP"
echo "  Complete Backend Infrastructure"
echo "============================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Run this script from the project root directory${NC}"
    exit 1
fi

echo "Step 1: Checking dependencies..."
echo "─────────────────────────────────"

# Check if Prisma is installed
if ! npm list prisma > /dev/null 2>&1; then
    echo -e "${YELLOW}Installing Prisma...${NC}"
    npm install prisma@5 @prisma/client@5 --legacy-peer-deps
fi
echo -e "${GREEN}✓ Prisma installed${NC}"

echo ""
echo "Step 2: Database Configuration"
echo "─────────────────────────────────"

# Check for DATABASE_URL
if [ -z "$DATABASE_URL" ] && ! grep -q "^DATABASE_URL=" .env.local 2>/dev/null; then
    echo -e "${YELLOW}DATABASE_URL not found. You have two options:${NC}"
    echo ""
    echo "Option A: Use PostgreSQL (recommended for production)"
    echo "  1. Install PostgreSQL locally or use a cloud provider"
    echo "  2. Create a database: createdb emersoneims_building"
    echo "  3. Add to .env.local:"
    echo "     DATABASE_URL=postgresql://postgres:password@localhost:5432/emersoneims_building"
    echo ""
    echo "Option B: Skip database (APIs will work without persistence)"
    echo "  The building APIs will use in-memory storage"
    echo "  Data will not persist between restarts"
    echo ""
    read -p "Do you have a PostgreSQL database ready? (y/n): " has_db

    if [ "$has_db" = "y" ]; then
        read -p "Enter your DATABASE_URL: " db_url
        echo "DATABASE_URL=$db_url" >> .env.local
        echo -e "${GREEN}✓ Database URL saved${NC}"
    else
        echo -e "${YELLOW}⏭ Skipping database setup. APIs will work with in-memory storage.${NC}"
    fi
else
    echo -e "${GREEN}✓ DATABASE_URL found${NC}"
fi

echo ""
echo "Step 3: API Keys Configuration"
echo "─────────────────────────────────"

# Check for OpenWeatherMap
if ! grep -q "^OPENWEATHERMAP_API_KEY=" .env.local 2>/dev/null; then
    echo -e "${YELLOW}OpenWeatherMap API key not found.${NC}"
    echo "Get a free key at: https://openweathermap.org/api"
    read -p "Enter key (or press Enter to skip): " owm_key
    if [ -n "$owm_key" ]; then
        echo "OPENWEATHERMAP_API_KEY=$owm_key" >> .env.local
        echo -e "${GREEN}✓ OpenWeatherMap key saved${NC}"
    fi
else
    echo -e "${GREEN}✓ OpenWeatherMap key found${NC}"
fi

# Check for OpenAI
if ! grep -q "^OPENAI_API_KEY=" .env.local 2>/dev/null; then
    echo -e "${YELLOW}OpenAI API key not found.${NC}"
    echo "Get a key at: https://platform.openai.com/api-keys"
    read -p "Enter key (or press Enter to skip): " openai_key
    if [ -n "$openai_key" ]; then
        echo "OPENAI_API_KEY=$openai_key" >> .env.local
        echo -e "${GREEN}✓ OpenAI key saved${NC}"
    fi
else
    echo -e "${GREEN}✓ OpenAI key found${NC}"
fi

echo ""
echo "Step 4: Generating Prisma Client"
echo "─────────────────────────────────"
npx prisma generate
echo -e "${GREEN}✓ Prisma client generated${NC}"

# If database is configured, run migrations
if grep -q "^DATABASE_URL=" .env.local 2>/dev/null; then
    echo ""
    echo "Step 5: Database Migration"
    echo "─────────────────────────────────"
    read -p "Run database migration? (y/n): " run_migration
    if [ "$run_migration" = "y" ]; then
        npx prisma db push
        echo -e "${GREEN}✓ Database schema pushed${NC}"

        read -p "Seed database with initial data? (y/n): " run_seed
        if [ "$run_seed" = "y" ]; then
            npm run db:seed
            echo -e "${GREEN}✓ Database seeded${NC}"
        fi
    fi
fi

echo ""
echo "============================================"
echo -e "${GREEN}  ✅ SETUP COMPLETE!${NC}"
echo "============================================"
echo ""
echo "What's working now:"
echo "  ✓ Elevation API (Open-Elevation - free)"
echo "  ✓ Soil API (ISRIC SoilGrids - free)"
echo "  ✓ Climate API (NASA POWER - free)"
echo "  ✓ Flood Risk API (Open-Meteo - free)"
echo "  ✓ Site Analysis API (combines all above)"
echo "  ✓ Suppliers API (Kenya database)"
echo "  ✓ Projects API"
echo "  ✓ Quotations API"
echo ""
echo "API Endpoints:"
echo "  POST /api/building/elevation"
echo "  POST /api/building/soil"
echo "  POST /api/building/climate"
echo "  POST /api/building/flood"
echo "  POST /api/building/site-analysis"
echo "  GET  /api/building/suppliers"
echo "  GET  /api/building/projects"
echo "  GET  /api/building/quotations"
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "To test an API (example):"
echo "  curl -X POST http://localhost:3000/api/building/site-analysis \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"latitude\": -1.2921, \"longitude\": 36.8219}'"
echo ""
