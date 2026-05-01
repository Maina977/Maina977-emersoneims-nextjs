$base='https://www.emersoneims.com'
$urls = @(
  @{u="$base/pro-building-suite"; m='GET'; b=$null}
  @{u="$base/eims-building-suite.html"; m='HEAD'; b=$null}
  @{u="$base/api/loads/wind/asce7"; m='POST'; b='{"V_ms":40}'}
  @{u="$base/api/geotech/bearing/terzaghi"; m='POST'; b='{"phi_deg":30}'}
  @{u="$base/api/hydro/tc/kirpich"; m='POST'; b='{"L_m":500,"slope":0.02}'}
  @{u="$base/api/rc/beam/bending"; m='POST'; b='{"w_kN_m":12,"L_m":6}'}
  @{u="$base/api/qs/boq"; m='POST'; b='{}'}
  @{u="$base/api/bim/build"; m='POST'; b='{}'}
  @{u="$base/api/generate"; m='POST'; b='{}'}
  @{u="$base/api/export/pdf"; m='POST'; b='{}'}
  @{u="$base/api/ai/render"; m='POST'; b='{}'}
  @{u="$base/api/global/fx/rates"; m='GET'; b=$null}
)
foreach($t in $urls){
  try{
    if($t.m -eq 'GET'){     $r = Invoke-WebRequest -Uri $t.u -UseBasicParsing -TimeoutSec 25 }
    elseif($t.m -eq 'HEAD'){$r = Invoke-WebRequest -Uri $t.u -UseBasicParsing -TimeoutSec 25 -Method Head }
    else{                   $r = Invoke-WebRequest -Uri $t.u -UseBasicParsing -TimeoutSec 25 -Method Post -ContentType 'application/json' -Body $t.b }
    $sz = if($r.RawContentLength -gt 0){$r.RawContentLength}else{$r.Content.Length}
    "{0,3}  {1,8}b  {2}" -f $r.StatusCode, $sz, ($t.u -replace 'https://www.emersoneims.com','')
  } catch {
    $c = if($_.Exception.Response){[int]$_.Exception.Response.StatusCode}else{'ERR'}
    "{0}  {1}" -f $c, ($t.u -replace 'https://www.emersoneims.com','')
  }
}
