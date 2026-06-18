<#
  setup-vercel-env.ps1 — one-shot Vercel environment setup for the my-app project.
  ============================================================================
  Sets EVERY environment variable the website needs (leads + analytics + Google
  Sheet backend) on Vercel Production, then triggers a production redeploy. It
  reads the secrets it can from your local CampaignPilot .env so you don't have
  to hunt for them, generates the diagnostic token, and prompts ONLY for the two
  Google Apps Script values.

  THE ONLY THING YOU DO FIRST (one time):  vercel login
  Then run:                                 ./scripts/setup-vercel-env.ps1

  Requires the Vercel CLI. If missing, the script installs it globally.
  No secrets are stored in this file — they are read from your .env or prompted.
#>

$ErrorActionPreference = 'Stop'
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$CampaignEnv = 'D:\EMERSONEIMSAPP\EIMS CampaignPilot AI\.env'

function Read-EnvValue([string]$file, [string]$key) {
  if (-not (Test-Path $file)) { return $null }
  $line = Select-String -Path $file -Pattern "^\s*$key\s*=" -ErrorAction SilentlyContinue | Select-Object -First 1
  if (-not $line) { return $null }
  return ($line.Line -replace "^\s*$key\s*=\s*", '').Trim().Trim('"').Trim("'")
}

Write-Host "== EmersonEIMS — Vercel environment setup ==" -ForegroundColor Cyan

# Ensure the Vercel CLI exists.
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
  Write-Host "Vercel CLI not found — installing globally (npm i -g vercel)..." -ForegroundColor Yellow
  npm install -g vercel
}

# Confirm the user is logged in.
try { $who = (vercel whoami 2>$null) } catch { $who = $null }
if (-not $who) {
  Write-Host "You are not logged in to Vercel. Run 'vercel login' first, then re-run this script." -ForegroundColor Red
  exit 1
}
Write-Host "Logged in to Vercel as: $who" -ForegroundColor Green

# --- Gather values -----------------------------------------------------------
$smtpPass = Read-EnvValue $CampaignEnv 'SMTP_PASSWORD'
$analyticsToken = Read-EnvValue $CampaignEnv 'ANALYTICS_READ_TOKEN'
if (-not $analyticsToken) { $analyticsToken = Read-Host "ANALYTICS_READ_TOKEN not found in CampaignPilot .env — paste it" }
if (-not $smtpPass) {
  $smtpPass = Read-Host "SMTP_PASSWORD (Gmail app password) not found in CampaignPilot .env — paste it"
}

# Generate strong tokens for anything we own.
function New-Token([int]$bytes = 24) {
  $b = New-Object 'System.Byte[]' $bytes
  [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b)
  return -join ($b | ForEach-Object { $_.ToString('x2') })
}
$leadDiagToken = New-Token 24
$analyticsSalt = New-Token 16

# The two values that only exist after you deploy the Apps Script (see
# integrations/google-sheets/SETUP.md). Prompt for them.
$sheetUrl = Read-Host "SHEET_WEBAPP_URL (Apps Script /exec URL — leave blank to skip the Sheet backend for now)"
$sheetToken = ''
if ($sheetUrl) { $sheetToken = Read-Host "SHEET_TOKEN (the Script Property secret you set on the Apps Script)" }

# --- The full env set --------------------------------------------------------
$vars = [ordered]@{
  'DATABASE_URL'         = ''   # intentionally empty → website uses the Google Sheet backend
  'SHEET_WEBAPP_URL'     = $sheetUrl
  'SHEET_TOKEN'          = $sheetToken
  'ANALYTICS_READ_TOKEN' = $analyticsToken
  'ANALYTICS_SALT'       = $analyticsSalt
  'LEAD_DIAG_TOKEN'      = $leadDiagToken
  'SMTP_HOST'            = 'smtp.gmail.com'
  'SMTP_PORT'            = '587'
  'SMTP_USER'            = 'emersoneimservices@gmail.com'
  'SMTP_PASSWORD'        = $smtpPass
  'LEAD_RECIPIENTS'      = 'info@emersoneims.com,sally@emersoneims.com'
  'SITE_ORIGIN'          = 'https://www.emersoneims.com'
}

foreach ($name in $vars.Keys) {
  $val = [string]$vars[$name]
  if ([string]::IsNullOrWhiteSpace($val)) { Write-Host "  skip $name (empty)" -ForegroundColor DarkGray; continue }
  # Remove any existing value, then add (idempotent).
  vercel env rm $name production -y 2>$null | Out-Null
  $val | vercel env add $name production | Out-Null
  Write-Host "  set  $name" -ForegroundColor Green
}

Write-Host ""
Write-Host "Environment set. Triggering a production redeploy..." -ForegroundColor Cyan
vercel deploy --prod

Write-Host ""
Write-Host "Done. Save these tokens (you'll need them to verify):" -ForegroundColor Yellow
Write-Host "  LEAD_DIAG_TOKEN      = $leadDiagToken"
Write-Host "  ANALYTICS_READ_TOKEN = $analyticsToken"
Write-Host "Then verify:  LEAD_DIAG_TOKEN=$leadDiagToken ANALYTICS_READ_TOKEN=$analyticsToken VERIFY_SEND=1 node scripts/verify-leads-analytics.mjs"
