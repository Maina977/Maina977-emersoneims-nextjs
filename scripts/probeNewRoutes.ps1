$base = 'https://www.emersoneims.com'
$tests = @(
  @{n='v1 init';m='POST';u='/api/v1/payments/initialize';b='{"provider":"mpesa","amount":100,"customer_email":"a@b.c","customer_phone":"254700000000","customer_name":"Test"}'},
  @{n='v1 verify mpesa';m='GET';u='/api/v1/payments/verify/mpesa:test123'},
  @{n='v1 verify flw';m='GET';u='/api/v1/payments/verify/flw:test456'},
  @{n='team members';m='GET';u='/api/generator-oracle/team/members?orgId=1'},
  @{n='team update-role';m='POST';u='/api/generator-oracle/team/update-role';b='{"userId":1,"role":"viewer"}'},
  @{n='team deactivate';m='POST';u='/api/generator-oracle/team/deactivate';b='{"userId":1}'},
  @{n='team invite';m='POST';u='/api/generator-oracle/team/invite';b='{"email":"a@b.c","role":"viewer","organizationId":1}'},
  @{n='reports download';m='GET';u='/api/reports/test123/download'}
)
$pass=0; $fail=0
foreach ($t in $tests) {
  try {
    if ($t.m -eq 'POST') {
      $r = Invoke-WebRequest -Uri "$base$($t.u)" -Method POST -Body $t.b -ContentType 'application/json' -UseBasicParsing -TimeoutSec 35
    } else {
      $r = Invoke-WebRequest -Uri "$base$($t.u)" -UseBasicParsing -TimeoutSec 35
    }
    $ct = $r.Headers['Content-Type']
    Write-Host ("PASS  {0,3}  {1,-22}  ct={2}  bytes={3}" -f $r.StatusCode, $t.n, $ct, $r.RawContentLength) -ForegroundColor Green
    $pass++
  } catch {
    $code = if ($_.Exception.Response) { [int]$_.Exception.Response.StatusCode } else { 'ERR' }
    $body = ''
    if ($_.Exception.Response) {
      try { $s = $_.Exception.Response.GetResponseStream(); $rd = New-Object System.IO.StreamReader($s); $body = $rd.ReadToEnd(); $body = $body.Substring(0,[Math]::Min(140,$body.Length)) } catch {}
    }
    if ($code -in 401,403) {
      Write-Host ("PASS* {0,3}  {1,-22}  (gated) {2}" -f $code, $t.n, $body) -ForegroundColor Green
      $pass++
    } else {
      Write-Host ("FAIL  {0,3}  {1,-22}  {2}" -f $code, $t.n, $body) -ForegroundColor Red
      $fail++
    }
  }
}
Write-Host ""
Write-Host "RESULT: $pass / $($pass+$fail) PASSED" -ForegroundColor $(if($fail -eq 0){'Green'}else{'Yellow'})
