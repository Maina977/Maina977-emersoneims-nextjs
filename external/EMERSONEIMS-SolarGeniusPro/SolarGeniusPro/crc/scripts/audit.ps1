$base = if ($env:AUDIT_BASE) { $env:AUDIT_BASE } else { 'http://localhost:5173' }
Write-Host "`n=== SolarGeniusPro Feature Audit ===`nBase: $base`n" -ForegroundColor Cyan

function Test-Endpoint {
  param([string]$Method, [string]$Path, [string]$Body, [string]$ContentType = 'application/json')
  $url = "$base$Path"
  $args = @('-sS', '-o', '-', '-w', "`n__HTTP=%{http_code}__", '-X', $Method, '--max-time', '15')
  if ($Body) { $args += @('-H', "Content-Type: $ContentType", '-d', $Body) }
  $args += $url
  $raw = & curl.exe @args 2>&1 | Out-String
  $code = if ($raw -match '__HTTP=(\d+)__') { [int]$Matches[1] } else { 0 }
  $body = ($raw -replace '__HTTP=\d+__', '').Trim()
  $ok = ($code -ge 200 -and $code -lt 400)
  $status = if ($ok) { 'PASS' } else { 'FAIL' }
  $color = if ($ok) { 'Green' } else { 'Red' }
  $snippet = if ($body.Length -gt 80) { $body.Substring(0, 80) + '...' } else { $body }
  Write-Host ("  [{0}] {1,-5} {2,-40} HTTP {3}  {4}" -f $status, $Method, $Path, $code, $snippet) -ForegroundColor $color
  return [pscustomobject]@{ Path=$Path; Method=$Method; Code=$code; Pass=$ok }
}

$results = @()

Write-Host "[Frontend Routes]" -ForegroundColor Yellow
$routes = '/', '/dashboard', '/calculator', '/designer', '/analytics', '/features', '/report', '/settings'
foreach ($r in $routes) { $results += Test-Endpoint 'GET' $r }

Write-Host "`n[API: Health & Reference]" -ForegroundColor Yellow
$results += Test-Endpoint 'GET' '/api/health'
$results += Test-Endpoint 'GET' '/api/faults'

Write-Host "`n[API: Solar / Reports]" -ForegroundColor Yellow
$results += Test-Endpoint 'POST' '/api/solar/calculate' '{"consumption":250,"location":"Nairobi","roofType":"metal","budget":500000}'
$results += Test-Endpoint 'POST' '/api/reports/engineering' '{"projectId":"AUDIT-001"}'
$results += Test-Endpoint 'POST' '/api/reports/financial' '{"projectId":"AUDIT-001"}'

Write-Host "`n[API: Data Sources]" -ForegroundColor Yellow
$results += Test-Endpoint 'GET' '/api/weather/-1.2865/36.8172'
$results += Test-Endpoint 'GET' '/api/nasa/solar/-1.2865/36.8172'
$results += Test-Endpoint 'GET' '/api/market/prices'
$results += Test-Endpoint 'GET' '/api/market/suppliers'

Write-Host "`n[API: Payments]" -ForegroundColor Yellow
$results += Test-Endpoint 'POST' '/api/payment/mpesa' '{"phone":"254700000000","amount":100}'
$results += Test-Endpoint 'POST' '/api/payment/mpesa/stkpush' '{"phone":"254700000000","amount":100}'
$results += Test-Endpoint 'POST' '/api/payment/flutterwave' '{"amount":100,"currency":"KES","email":"a@b.com"}'
$results += Test-Endpoint 'POST' '/api/payment/paystack' '{"amount":100,"email":"a@b.com"}'
$results += Test-Endpoint 'GET' '/api/payment/verify/AUDIT-REF'

Write-Host "`n[API: Advanced]" -ForegroundColor Yellow
$results += Test-Endpoint 'POST' '/api/digitaltwin/create' '{"projectId":"AUDIT-001","systemSize":6.8}'
$results += Test-Endpoint 'POST' '/api/digitaltwin/simulate' '{"projectId":"AUDIT-001"}'
$results += Test-Endpoint 'POST' '/api/tenancy/tenant' '{"name":"AuditCo","plan":"pro"}'
$results += Test-Endpoint 'POST' '/api/command/advise' '{"query":"sizing"}'
$results += Test-Endpoint 'POST' '/api/validate/engineering' '{"systemSize":6.8,"voltage":48}'

$pass = ($results | Where-Object Pass).Count
$fail = ($results | Where-Object { -not $_.Pass }).Count
$total = $results.Count
Write-Host "`n=== Summary: $pass / $total passed, $fail failed ===" -ForegroundColor $(if ($fail -eq 0) {'Green'} else {'Yellow'})
if ($fail -gt 0) {
  Write-Host "`nFailures:" -ForegroundColor Red
  $results | Where-Object { -not $_.Pass } | ForEach-Object { Write-Host ("  - {0} {1}  -> HTTP {2}" -f $_.Method, $_.Path, $_.Code) }
}
