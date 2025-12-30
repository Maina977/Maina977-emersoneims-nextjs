param(
  [string]$BaseUrl = 'https://www.emersoneims.com',
  [string[]]$Paths = @('/', '/solution', '/generators', '/contact', '/diagnostic-suite'),
  [int]$TimeoutSec = 120,
  [switch]$Desktop
)

$ErrorActionPreference = 'Stop'

function Ensure-Dir([string]$path) {
  if (-not (Test-Path $path)) {
    New-Item -ItemType Directory -Force -Path $path | Out-Null
  }
}

function Get-LighthousePreset([switch]$Desktop) {
  if ($Desktop.IsPresent) { return 'desktop' }
  return ''
}

$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$preset = Get-LighthousePreset -Desktop:$Desktop
$presetLabel = if ([string]::IsNullOrWhiteSpace($preset)) { 'mobile' } else { $preset }
$outRoot = Join-Path (Get-Location) ("reports\\lighthouse-$presetLabel-$timestamp")
Ensure-Dir $outRoot

Write-Host "Running Lighthouse ($preset) against $BaseUrl" -ForegroundColor Cyan
Write-Host "Writing reports to: $outRoot" -ForegroundColor Cyan

$summary = @()

foreach ($p in $Paths) {
  $route = if ([string]::IsNullOrWhiteSpace($p)) { '/' } else { $p }
  if (-not $route.StartsWith('/')) { $route = '/' + $route }
  $url = $BaseUrl.TrimEnd('/') + $route

  $safe = $route.Trim('/').Replace('/', '_')
  if ([string]::IsNullOrWhiteSpace($safe)) { $safe = 'home' }

  $basePath = Join-Path $outRoot ("$safe.$presetLabel")
  $jsonPath = "$basePath.report.json"
  $htmlPath = "$basePath.report.html"
  $profileDir = Join-Path $outRoot ("chrome-profile-$safe")
  Ensure-Dir $profileDir

  Write-Host "- Auditing $url" -ForegroundColor Gray

  # Use npx to avoid permanently adding dependencies.
  # --quiet reduces noise, and we force a JSON+HTML output for easy review.
  $formFactor = if ($Desktop.IsPresent) { 'desktop' } else { 'mobile' }
  $chromeFlags = @(
    '--headless',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    "--user-data-dir=$profileDir"
  ) -join ' '

  $args = @(
    'lighthouse',
    $url,
    '--quiet',
    '--output=json',
    '--output=html',
    "--output-path=$basePath",
    "--timeout=$TimeoutSec",
    "--form-factor=$formFactor",
    '--disable-storage-reset',
    "--chrome-flags=$chromeFlags"
  )
  if (-not [string]::IsNullOrWhiteSpace($preset)) {
    $args += "--preset=$preset"
  }

  try {
    & npx --yes @args | Out-Null

    if (Test-Path $jsonPath) {
      $report = Get-Content -Raw -Path $jsonPath | ConvertFrom-Json
      $cats = $report.categories
      $summary += [pscustomobject]@{
        Route = $route
        Url = $url
        Performance = [int]([Math]::Round(($cats.performance.score * 100)))
        Accessibility = [int]([Math]::Round(($cats.accessibility.score * 100)))
        BestPractices = [int]([Math]::Round(($cats.'best-practices'.score * 100)))
        SEO = [int]([Math]::Round(($cats.seo.score * 100)))
        PWA = if ($cats.pwa) { [int]([Math]::Round(($cats.pwa.score * 100))) } else { $null }
        JsonReport = $jsonPath
        HtmlReport = $htmlPath
      }
    }
  } catch {
    Write-Host "  Failed: $($_.Exception.Message)" -ForegroundColor Yellow
    $summary += [pscustomobject]@{
      Route = $route
      Url = $url
      Performance = $null
      Accessibility = $null
      BestPractices = $null
      SEO = $null
      PWA = $null
      JsonReport = $jsonPath
      HtmlReport = $htmlPath
      Error = $_.Exception.Message
    }
  }
}

$summaryPath = Join-Path $outRoot "summary.csv"
$summary | Export-Csv -NoTypeInformation -Encoding utf8 -Path $summaryPath

Write-Host "\nSUMMARY" -ForegroundColor Green
$summary | Select-Object Route,Performance,Accessibility,BestPractices,SEO,PWA | Format-Table -AutoSize
Write-Host "\nSaved: $summaryPath" -ForegroundColor Cyan
