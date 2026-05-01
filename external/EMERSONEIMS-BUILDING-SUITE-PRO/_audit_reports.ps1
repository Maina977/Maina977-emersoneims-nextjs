$ErrorActionPreference = "Continue"
$base = "http://127.0.0.1:5000"
$results = @{ primary = @{}; disc = @{}; strings = @{}; bundle = @{} }

Write-Host "=== 1. BUNDLE INTEGRITY ==="
try {
  $idx = Invoke-WebRequest "$base/" -UseBasicParsing -TimeoutSec 15
  $m = [regex]::Match($idx.Content, '/static/wizard-[A-Za-z0-9]+\.js')
  if (-not $m.Success) { Write-Host "FAIL: wizard JS path not found"; $results.bundle.path = $null }
  else {
    $jsPath = $m.Value
    Write-Host "Found: $jsPath"
    $results.bundle.path = $jsPath
    $tmp = "$env:TEMP\wiz.js"
    Invoke-WebRequest "$base$jsPath" -UseBasicParsing -TimeoutSec 30 -OutFile $tmp
    $sz = (Get-Item $tmp).Length
    $hash = (Get-FileHash $tmp -Algorithm SHA256).Hash
    Write-Host ("Size: {0:N1} KB  SHA256: {1}" -f ($sz/1024), $hash)
    $results.bundle.size_kb = [math]::Round($sz/1024,1)
    $results.bundle.hash = $hash
    $nodeOut = & node --check $tmp 2>&1
    if ($LASTEXITCODE -eq 0) { Write-Host "node --check: OK"; $results.bundle.syntax = "OK" }
    else { Write-Host "node --check FAIL: $nodeOut"; $results.bundle.syntax = "FAIL" }
  }
} catch { Write-Host "BUNDLE ERROR: $_"; $results.bundle.error = "$_" }

function Post-Json($url, $body) {
  try {
    $r = Invoke-WebRequest "$base$url" -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing -TimeoutSec 30
    return @{ ok=$true; status=$r.StatusCode; body=$r.Content }
  } catch {
    $sc = if ($_.Exception.Response) { $_.Exception.Response.StatusCode.Value__ } else { 0 }
    $msg = "$_"
    return @{ ok=$false; status=$sc; body=$msg }
  }
}
function Get-Url($url) {
  try {
    $r = Invoke-WebRequest "$base$url" -UseBasicParsing -TimeoutSec 30
    return @{ ok=$true; status=$r.StatusCode; body=$r.Content }
  } catch {
    $sc = if ($_.Exception.Response) { $_.Exception.Response.StatusCode.Value__ } else { 0 }
    return @{ ok=$false; status=$sc; body="$_" }
  }
}

Write-Host "`n=== 2. PRIMARY REPORT ENDPOINTS ==="
$primaryBody = '{"area":220,"stories":1,"units":1,"bedrooms":4,"location":"Nairobi","country":"Kenya","currency":"KES","building_type":"residential","style":"modern","client_name":"Audit Client","company_name":"EIMS","vat_rate":16,"discount_pct":0,"payment_terms":"30/40/20/10","validity_days":30}'
$renderBody = '{"environment":"outdoor_daylight","quality":"high","resolution":[1920,1080],"objects":[{"type":"building"}]}'

$primary = @(
  @{ name="comprehensive"; url="/api/report/comprehensive"; body=$primaryBody; checks=@("project_summary","structural_summary","cost_summary") },
  @{ name="quotation"; url="/api/report/quotation"; body=$primaryBody; checks=@("quotation_number","trade_sections","payment_schedule") },
  @{ name="drawings"; url="/api/drawings/all"; body=$primaryBody; checks=@("floor_plan","elevation_north","structural") },
  @{ name="render"; url="/api/render/scene"; body=$renderBody; checks=@() }
)

$pPass = 0
foreach ($p in $primary) {
  $r = Post-Json $p.url $p.body
  $okFlag = $false
  $detail = ""
  if ($r.ok) {
    $bodyTxt = $r.body
    $hasSuccess = $bodyTxt -match '"success"\s*:\s*true'
    $missing = @()
    foreach ($c in $p.checks) {
      if ($bodyTxt -notmatch [regex]::Escape($c)) { $missing += $c }
    }
    if ($p.name -eq "render") {
      if ($bodyTxt -match '"render"' -or $bodyTxt -match '"success"\s*:\s*true') { $okFlag = $true }
      else { $detail = "no render/success key" }
    } elseif ($p.name -eq "drawings") {
      if ($missing.Count -eq 0) { $okFlag = $true } else { $detail = "missing keys: $($missing -join ',')" }
    } else {
      if ($hasSuccess -and $missing.Count -eq 0) { $okFlag = $true }
      else { $detail = "success=$hasSuccess missing=$($missing -join ',')" }
    }
  } else { $detail = "HTTP $($r.status): $($r.body.Substring(0,[Math]::Min(150,$r.body.Length)))" }
  $tag = if ($okFlag) { "PASS" } else { "FAIL" }
  if ($okFlag) { $pPass++ }
  Write-Host "[$tag] $($p.url) HTTP=$($r.status) $detail"
  $results.primary[$p.name] = $okFlag
}

Write-Host "`n=== 3. DISCIPLINE ENDPOINTS ==="
$disc = @(
  @{ n="adf"; m="POST"; u="/api/arch/daylight/adf"; b='{"window_area_m2":33,"total_internal_surface_m2":1100,"T_glass":0.68,"sky_angle_deg":65,"avg_reflectance":0.5,"maintenance_factor":0.9,"frame_factor":0.7}' },
  @{ n="uvalue"; m="POST"; u="/api/arch/uvalue"; b='{"heat_flow":"horizontal","layers":[{"description":"External plaster","thickness_m":0.020,"lambda_W_mK":0.60,"source":"EN ISO 10456"},{"description":"Block 200","thickness_m":0.200,"lambda_W_mK":1.00,"source":"EN ISO 10456"},{"description":"EPS 50","thickness_m":0.050,"lambda_W_mK":0.038,"source":"EN ISO 10456"},{"description":"Internal plaster","thickness_m":0.012,"lambda_W_mK":0.60,"source":"EN ISO 10456"}]}' },
  @{ n="acoustics"; m="POST"; u="/api/arch/acoustics/reverberation"; b='{"volume_m3":660,"method":"sabine","surfaces":[{"description":"plaster","area_m2":440,"alpha":0.04,"source":"EN ISO 11654"},{"description":"floor","area_m2":220,"alpha":0.02,"source":"EN ISO 11654"},{"description":"glazing","area_m2":33,"alpha":0.18,"source":"EN ISO 11654"},{"description":"furnishings","area_m2":110,"alpha":0.40,"source":"BS 8233"}]}' },
  @{ n="egress"; m="POST"; u="/api/arch/egress"; b='{"occupancy_type":"residential","floor_area_m2":220,"sprinklered":true,"voice_notification":false}' },
  @{ n="access"; m="POST"; u="/api/arch/accessibility/check"; b='{"jurisdiction":"strictest","measurements":{"door_clear_width_mm":900,"corridor_width_mm":1200,"ramp_slope_pct":7,"wc_clear_diameter_mm":1500,"threshold_height_mm":15}}' },
  @{ n="shadow"; m="POST"; u="/api/arch/shadow/solstice"; b='{"lat":-1.286,"lng":36.817,"pole_height_m":3.5}' },
  @{ n="wind"; m="POST"; u="/api/loads/wind/eurocode"; b='{"vb_ms":24,"height_m":3.5,"length_m":17.8,"width_m":12.3,"terrain_category":"II","co":1.0,"cprob":1.0,"cdir":1.0,"cseason":1.0,"rho_kg_m3":1.25}' },
  @{ n="bearing"; m="POST"; u="/api/geotech/bearing/terzaghi"; b='{"c_kPa":15,"phi_deg":28,"gamma_kN_m3":18,"B_m":0.6,"Df_m":1.2,"shape":"strip"}' },
  @{ n="rcbeam"; m="POST"; u="/api/rc/beam/bending"; b='{"b_mm":300,"h_mm":500,"d_mm":450,"As_mm2":1500,"fck_MPa":30,"fyk_MPa":500,"Med_kNm":120}' },
  @{ n="carbon"; m="POST"; u="/api/qs/carbon/assess"; b='{"assessment_stage":"RIBA-3","materials":[{"name":"concrete","quantity_kg":79200,"ec_kgco2e_per_kg":0.13,"factor_source":"ICE v3.0"},{"name":"steel","quantity_kg":6600,"ec_kgco2e_per_kg":1.85,"factor_source":"WSA 2020"},{"name":"blocks","quantity_kg":49500,"ec_kgco2e_per_kg":0.07,"factor_source":"EPD CMU 2019"}]}' },
  @{ n="ve"; m="POST"; u="/api/qs/ve/suggest"; b='{"items":[{"description":"Granite countertop","amount":5000,"category":"finishes"},{"description":"Marble flooring","amount":12000,"category":"finishes"}]}' },
  @{ n="cpm"; m="POST"; u="/api/sched/cpm"; b='{"project_start":"2026-05-01","activities":[{"id":"A","name":"Mobilisation","duration_days":7,"predecessors":[]},{"id":"B","name":"Excavation","duration_days":14,"predecessors":["A"]},{"id":"C","name":"Foundations","duration_days":21,"predecessors":["B"]},{"id":"D","name":"Superstructure","duration_days":35,"predecessors":["C"]},{"id":"E","name":"Roofing","duration_days":14,"predecessors":["D"]},{"id":"F","name":"Finishes","duration_days":30,"predecessors":["E"]},{"id":"G","name":"Handover","duration_days":7,"predecessors":["F"]}]}' },
  @{ n="risks"; m="POST"; u="/api/safety/risks/register"; b='{"trades":["concrete","steel","scaffolding","electrical","excavation","roofing","plumbing","painting"],"site_type":"residential"}' },
  @{ n="methods"; m="GET"; u="/api/safety/methods/catalog"; b=$null }
)

$dPass = 0
foreach ($d in $disc) {
  if ($d.m -eq "GET") { $r = Get-Url $d.u } else { $r = Post-Json $d.u $d.b }
  $okFlag = $r.ok -and $r.status -ge 200 -and $r.status -lt 300
  if ($okFlag) { $dPass++ }
  $tag = if ($okFlag) { "PASS" } else { "FAIL" }
  $snippet = ""
  if (-not $okFlag) { $snippet = " :: " + $r.body.Substring(0,[Math]::Min(180,$r.body.Length)) }
  Write-Host "[$tag] $($d.m) $($d.u) HTTP=$($r.status)$snippet"
  $results.disc[$d.n] = $okFlag
}

Write-Host "`n=== 4. BUNDLE STRING PRESENCE ==="
$strings = @("showReports","repBuild","repRender","repPrint","Comprehensive Project Report","6. Architectural Performance Analysis","7. Engineering Design Calculations","9. QS Quotation","10. QS","11. Safety Officer","12. Project Phase Delivery Status","/report/comprehensive","/arch/uvalue","/safety/risks/register")
$sPass = 0
$jsTxt = ""
if (Test-Path "$env:TEMP\wiz.js") { $jsTxt = Get-Content "$env:TEMP\wiz.js" -Raw }
foreach ($s in $strings) {
  $found = $jsTxt.Contains($s)
  if ($found) { $sPass++ }
  $tag = if ($found) { "PASS" } else { "FAIL" }
  Write-Host "[$tag] '$s'"
  $results.strings[$s] = $found
}

Write-Host "`n================ SCORECARD ================"
Write-Host ("Bundle: size={0} KB syntax={1} hash={2}" -f $results.bundle.size_kb, $results.bundle.syntax, $results.bundle.hash)
Write-Host ("Primary endpoints: {0}/4 OK" -f $pPass)
Write-Host ("Discipline endpoints: {0}/14 OK" -f $dPass)
Write-Host ("Bundle strings present: {0}/14" -f $sPass)
Write-Host ""
Write-Host "Failures:"
foreach ($k in $results.primary.Keys) { if (-not $results.primary[$k]) { Write-Host "  primary.$k FAILED" } }
foreach ($k in $results.disc.Keys) { if (-not $results.disc[$k]) { Write-Host "  disc.$k FAILED" } }
foreach ($k in $results.strings.Keys) { if (-not $results.strings[$k]) { Write-Host "  string '$k' MISSING" } }

