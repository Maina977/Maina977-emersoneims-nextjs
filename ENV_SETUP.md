# Environment Variables Setup - emersoneims.com

## Quick Setup

### Option 1: Create `.env` File (Recommended)

Create a `.env` file in the project root with:

```env
NEXT_PUBLIC_SITE_URL=https://www.emersoneims.com
WORDPRESS_API_URL=https://www.emersoneims.com/wp-json/wp/v2
WORDPRESS_SITE_URL=https://www.emersoneims.com
NODE_ENV=production
```

### Option 2: Use Scripts

#### Windows PowerShell (Recommended for Windows)
```powershell
.\scripts\set-env.ps1
npm run build
```

#### Windows Command Prompt
```cmd
scripts\set-env.bat
npm run build
```

#### Linux/Mac/Git Bash
```bash
bash scripts/set-env.sh
npm run build
```

### Option 3: Manual Export (Current Session Only)

#### Windows PowerShell
```powershell
$env:NEXT_PUBLIC_SITE_URL = "https://www.emersoneims.com"
$env:WORDPRESS_API_URL = "https://www.emersoneims.com/wp-json/wp/v2"
$env:WORDPRESS_SITE_URL = "https://www.emersoneims.com"
$env:NODE_ENV = "production"
npm run build
```

#### Windows Command Prompt
```cmd
set NEXT_PUBLIC_SITE_URL=https://www.emersoneims.com
set WORDPRESS_API_URL=https://www.emersoneims.com/wp-json/wp/v2
set WORDPRESS_SITE_URL=https://www.emersoneims.com
set NODE_ENV=production
npm run build
```

#### Linux/Mac/Git Bash
```bash
export NEXT_PUBLIC_SITE_URL=https://www.emersoneims.com
export WORDPRESS_API_URL=https://www.emersoneims.com/wp-json/wp/v2
export WORDPRESS_SITE_URL=https://www.emersoneims.com
export NODE_ENV=production
npm run build
```

## Environment Variables

### Required Variables
- `NEXT_PUBLIC_SITE_URL` - Your site URL
- `WORDPRESS_API_URL` - WordPress REST API endpoint
- `WORDPRESS_SITE_URL` - WordPress site URL

### Optional Variables
- `WORDPRESS_INTEGRATION=true` - Enable WordPress features
- `STATIC_EXPORT=true` - Use static export mode
- `NODE_ENV=production` - Production environment

## Verification

After setting variables, verify they're loaded:

### Windows PowerShell
```powershell
echo $env:NEXT_PUBLIC_SITE_URL
echo $env:WORDPRESS_API_URL
```

### Linux/Mac/Git Bash
```bash
echo $NEXT_PUBLIC_SITE_URL
echo $WORDPRESS_API_URL
```

## Build Commands

```bash
# Install dependencies (if needed)
npm install

# Build with environment variables
npm run build

# Start production server
npm start
```

## Files Created

- ✅ `scripts/set-env.sh` - Bash script (Linux/Mac/Git Bash)
- ✅ `scripts/set-env.bat` - Batch script (Windows CMD)
- ✅ `scripts/set-env.ps1` - PowerShell script (Windows PowerShell)

## Notes

- `.env` file is gitignored (won't be committed)
- Environment variables set via scripts are only for the current terminal session
- For permanent setup, create `.env` file or set system environment variables
- Next.js automatically loads `.env` file if present

---

**Quick Start:** Just create a `.env` file in the project root with the variables above, then run `npm run build`!




