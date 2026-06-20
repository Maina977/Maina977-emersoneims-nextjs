# Start a public tunnel to ERP PRO (localhost:8088) — the PUSH method.
# Use this only if you prefer the website to push leads directly to the ERP.
# (The PULL bridge in scripts/erp-pull-leads.mjs needs NO tunnel and is simpler.)
#
# Requires cloudflared: https://developers.cloudflare.com/cloudflare-tunnel/downloads/
# Run:  powershell -ExecutionPolicy Bypass -File scripts/start-erp-tunnel.ps1

$ErrorActionPreference = 'Stop'

$cf = Get-Command cloudflared -ErrorAction SilentlyContinue
if (-not $cf) {
  Write-Host "cloudflared is not installed." -ForegroundColor Yellow
  Write-Host "Download the Windows .exe from:"
  Write-Host "  https://developers.cloudflare.com/cloudflare-tunnel/downloads/"
  Write-Host "Put cloudflared.exe on your PATH, then re-run this script."
  exit 1
}

# Verify the ERP is up first
try {
  $r = Invoke-WebRequest -Uri "http://localhost:8088" -TimeoutSec 5 -UseBasicParsing
  Write-Host ("ERP PRO is up (HTTP {0})." -f $r.StatusCode) -ForegroundColor Green
} catch {
  Write-Host "ERP PRO is NOT responding on localhost:8088 — start ERP PRO first." -ForegroundColor Red
  exit 1
}

Write-Host ""
Write-Host "Starting tunnel to http://localhost:8088 ..." -ForegroundColor Cyan
Write-Host "When it prints a https://*.trycloudflare.com URL, set this in Vercel:" -ForegroundColor Cyan
Write-Host "  ERP_QUOTE_ENDPOINT = https://<that-url>/api/public/quote-request" -ForegroundColor White
Write-Host "(Quick tunnels change URL on restart — for a permanent URL use a named tunnel.)" -ForegroundColor DarkGray
Write-Host ""

cloudflared tunnel --url http://localhost:8088
