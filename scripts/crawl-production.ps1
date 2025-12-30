param(
  [string]$BaseUrl = 'https://www.emersoneims.com',
  [int]$MaxTimeSeconds = 25,
  [switch]$ScanHtml
)

$ErrorActionPreference = 'Stop'

function Resolve-AppRoot {
  $candidate = Join-Path (Get-Location) 'app'
  if (-not (Test-Path $candidate)) {
    throw "Could not find 'app' directory at: $candidate"
  }
  return (Resolve-Path $candidate).Path
}

function To-RoutePath([string]$appRoot, [string]$fullName) {
  $rel = $fullName.Substring($appRoot.Length).TrimStart('\')
  # Strip trailing page.tsx (root page.tsx has no leading slash)
  $route = $rel -replace '(^|\\)page\.tsx$',''

  if ([string]::IsNullOrWhiteSpace($route)) {
    return '/'
  }

  $route = $route -replace '\\','/'

  # Strip group segments like (marketing)
  $segments = $route -split '/'
  $segments = $segments | Where-Object { $_ -notmatch '^\(.*\)$' }
  $route = ($segments -join '/')

  # Replace known dynamic segments with sensible samples
  $route = $route -replace '\[county\]','nairobi'
  $route = $route -replace '\[country\]','ke'
  $route = $route -replace '\[city\]','nairobi'

  # Replace catch-all and dynamic segments
  $route = $route -replace '\[\.\.\.[^\]]+\]','sample'
  $route = $route -replace '\[[^\]]+\]','sample'

  if (-not $route.StartsWith('/')) { $route = '/' + $route }
  return $route
}

function Invoke-RouteCheck([string]$baseUrl, [string]$route, [int]$maxTimeSeconds) {
  $url = "$baseUrl$route"

  $start = Get-Date
  # Use GET (with body discarded) for maximum compatibility.
  $out = (curl.exe -s -o NUL -L --max-time $maxTimeSeconds -w '%{http_code} %{url_effective}\n' $url)
  $elapsedMs = [int]((Get-Date) - $start).TotalMilliseconds

  $trimmed = (("" + $out)).Trim()
  $parts = $trimmed.Split(' ', 2)
  $rawStatus = if ($parts.Count -ge 1) { $parts[0] } else { '' }
  $status = (($rawStatus -replace '[^0-9]','') + '')
  $effective = if ($parts.Count -ge 2) { $parts[1] } else { $url }

  $badGlyphCount = 0
  $badGlyphSample = ''
  if ($ScanHtml.IsPresent) {
    $shouldScan = $true

    if ($route -like '/api/*') { $shouldScan = $false }
    if ($route -match '\.(xml|txt|webmanifest)$') { $shouldScan = $false }
    if ($route -match '^/sitemap\.xml$') { $shouldScan = $false }
    if ($route -match '^/robots\.txt$') { $shouldScan = $false }
    if ($route -match '^/manifest\.webmanifest$') { $shouldScan = $false }
    if ($route -match '^/test-page$') { $shouldScan = $false }
    if ($route -match '^/test-minimal$') { $shouldScan = $false }

    if ($shouldScan -and $status -eq '200') {
      try {
        $resp = Invoke-WebRequest -Uri $effective -UseBasicParsing -TimeoutSec $maxTimeSeconds
        $contentType = ''
        if ($resp.Headers -and $resp.Headers['Content-Type']) { $contentType = ("" + $resp.Headers['Content-Type']) }

        if ($contentType -match 'text/html') {
          $html = ("" + $resp.Content)
          # Build regex without literal non-ASCII chars in source (PS 5.1-safe).
          $badGlyphChars = @(
            [char]0x00E2, # â
            [char]0x00C2, # Â
            [char]0x00F0, # ð
            [char]0x00C3  # Ã
          )
          $pattern = ($badGlyphChars | ForEach-Object { [regex]::Escape([string]$_) }) -join '|'
          $matches = [regex]::Matches($html, $pattern)
          $badGlyphCount = $matches.Count
          if ($badGlyphCount -gt 0) {
            $first = $matches[0]
            $startIdx = [Math]::Max(0, $first.Index - 40)
            $len = [Math]::Min($html.Length - $startIdx, 120)
            $badGlyphSample = $html.Substring($startIdx, $len)
          }
        }
      } catch {
        # Don't fail the whole crawl on body-scan errors; keep status validation authoritative.
        $badGlyphSample = "scan-error: " + $_.Exception.Message
      }
    }
  }

  return [pscustomobject]@{
    Route = $route
    Url = $url
    Status = $status
    EffectiveUrl = $effective
    ElapsedMs = $elapsedMs
    BadGlyphCount = $badGlyphCount
    BadGlyphSample = $badGlyphSample
  }
}

$appRoot = Resolve-AppRoot

$pages = Get-ChildItem -Path $appRoot -Recurse -File -Filter page.tsx |
  Where-Object { $_.FullName -notmatch '\\app\\api\\' }

$routes = $pages | ForEach-Object { To-RoutePath -appRoot $appRoot -fullName $_.FullName }
$routes = $routes | Sort-Object -Unique

# Exclude internal/special routes
$routes = $routes | Where-Object { $_ -ne '/_not-found' }

# Ensure key non-page endpoints are checked too
$routes += @('/api/health','/robots.txt','/sitemap.xml','/manifest.webmanifest','/test-page','/test-minimal')
$routes = $routes | Sort-Object -Unique

Write-Host "Crawling $($routes.Count) routes on $BaseUrl" -ForegroundColor Cyan

$results = foreach ($r in $routes) {
  try {
    Invoke-RouteCheck -baseUrl $BaseUrl -route $r -maxTimeSeconds $MaxTimeSeconds
  } catch {
    [pscustomobject]@{
      Route = $r
      Url = "$BaseUrl$r"
      Status = 'ERR'
      EffectiveUrl = ''
      ElapsedMs = 0
      Error = $_.Exception.Message
    }
  }
}

$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$outDir = Join-Path (Get-Location) 'reports'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$jsonPath = Join-Path $outDir "crawl-production-$timestamp.json"
$csvPath  = Join-Path $outDir "crawl-production-$timestamp.csv"

$results | ConvertTo-Json -Depth 6 | Out-File -FilePath $jsonPath -Encoding utf8
$results | Export-Csv -Path $csvPath -NoTypeInformation -Encoding utf8

$allowed = @('200','204','301','302','307','308')
$expected404 = @('/test-page','/test-minimal')

$unexpected = @($results | Where-Object {
  if ($expected404 -contains $_.Route) { return $_.Status -ne '404' }
  return ($allowed -notcontains $_.Status)
})

$glyphIssues = @()
if ($ScanHtml.IsPresent) {
  $glyphIssues = @($results | Where-Object { $_.BadGlyphCount -gt 0 })
}

$okCount = @($results | Where-Object {
  if ($expected404 -contains $_.Route) { return $_.Status -eq '404' }
  return ($allowed -contains $_.Status)
}).Count

Write-Host "OK/Allowed: $okCount / $($results.Count)" -ForegroundColor Green
Write-Host "Reports written:" -ForegroundColor Cyan
Write-Host "- $csvPath"
Write-Host "- $jsonPath"

if (@($unexpected).Count -gt 0) {
  Write-Host "\nUnexpected statuses:" -ForegroundColor Yellow
  $unexpected | Sort-Object Status,Route | Select-Object Route,Status,EffectiveUrl,ElapsedMs | Format-Table -AutoSize
  exit 1
}

if ($ScanHtml.IsPresent -and @($glyphIssues).Count -gt 0) {
  Write-Host "\nDetected garbled glyph sequences in HTML:" -ForegroundColor Yellow
  $glyphIssues | Sort-Object Route | Select-Object Route,Status,BadGlyphCount,BadGlyphSample | Format-Table -AutoSize
  exit 1
}

Write-Host "\nAll routes returned allowed status codes." -ForegroundColor Green
