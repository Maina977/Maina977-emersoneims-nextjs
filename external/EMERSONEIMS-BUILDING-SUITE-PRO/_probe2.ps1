function probe($url, $body) {
  try {
    if ($body) { $r = Invoke-WebRequest "http://127.0.0.1:5000$url" -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing -TimeoutSec 15 }
    else        { $r = Invoke-WebRequest "http://127.0.0.1:5000$url" -Method GET -UseBasicParsing -TimeoutSec 15 }
    $txt = $r.Content
    if ($txt.Length -gt 400) { $txt = $txt.Substring(0,400) + '...' }
    "[$url] HTTP $($r.StatusCode): $txt"
  } catch {
    $resp = $_.Exception.Response
    if ($resp) {
      try { $sr = New-Object IO.StreamReader($resp.GetResponseStream()); $body2=$sr.ReadToEnd(); if($body2.Length -gt 200){$body2=$body2.Substring(0,200)+'...'} } catch { $body2='' }
      "[$url] HTTP $([int]$resp.StatusCode) ERROR: $body2"
    } else { "[$url] ERROR: $($_.Exception.Message)" }
  }
}
probe '/api/arch/daylight/adf'             '{"window_area_m2":12,"floor_area_m2":50,"glass_transmittance":0.7,"reflectance":0.5}'
probe '/api/arch/uvalue'                   '{"layers":[{"thickness_m":0.2,"k":0.5},{"thickness_m":0.05,"k":0.038},{"thickness_m":0.012,"k":0.6}]}'
probe '/api/arch/acoustics/reverberation'  '{"volume_m3":120,"surfaces":[{"area_m2":150,"absorption":0.05},{"area_m2":50,"absorption":0.4}]}'
probe '/api/arch/egress'                   '{"occupants":20,"travel_distance_m":18,"door_width_mm":900}'
probe '/api/arch/accessibility/check'      '{"door_clear_mm":900,"corridor_mm":1200,"ramp_slope":0.07,"wc_clear_mm":1500}'
probe '/api/arch/shadow/solstice'          '{"latitude":-1.286,"longitude":36.817}'
probe '/api/loads/wind/eurocode'           '{"vb_basic_ms":24,"terrain_category":2,"z_m":3.5,"width_m":15,"depth_m":15,"height_m":3.5,"cs_cd":1.0}'
probe '/api/geotech/bearing/terzaghi'      '{"c_kpa":15,"phi_deg":28,"gamma_kn_m3":18,"B_m":0.6,"D_m":1.2,"footing_shape":"strip"}'
probe '/api/rc/beam/bending'               '{"b_mm":300,"h_mm":500,"d_mm":450,"Mu_knm":120,"fck_mpa":30,"fyk_mpa":500}'
probe '/api/eng/frame/analyze'             '{"nodes":[{"id":1,"x":0,"y":0,"fixed":true},{"id":2,"x":0,"y":3.5,"fixed":false},{"id":3,"x":6,"y":3.5,"fixed":false},{"id":4,"x":6,"y":0,"fixed":true}],"members":[{"id":1,"i":1,"j":2,"E":210e9,"A":0.005,"I":0.0001},{"id":2,"i":2,"j":3,"E":210e9,"A":0.005,"I":0.0001},{"id":3,"i":3,"j":4,"E":210e9,"A":0.005,"I":0.0001}],"loads":[{"node":2,"fx":10000}]}'
probe '/api/qs/carbon/assess'              '{"materials":[{"name":"concrete","quantity_kg":50000,"ec_kgco2e_per_kg":0.13},{"name":"steel","quantity_kg":17000,"ec_kgco2e_per_kg":1.85}]}'
probe '/api/qs/ve/suggest'                 '{"items":[{"description":"Granite countertop","amount":5000,"category":"finishes"},{"description":"Imported tiles","amount":8000,"category":"finishes"}]}'
probe '/api/sched/cpm'                     '{"tasks":[{"id":"A","duration":10,"deps":[]},{"id":"B","duration":15,"deps":["A"]},{"id":"C","duration":8,"deps":["A"]},{"id":"D","duration":5,"deps":["B","C"]}]}'
probe '/api/safety/risks/register'         '{"trades":["concrete","steel","scaffolding","electrical","excavation"],"site_type":"residential"}'
probe '/api/safety/methods/generate'       '{"trade":"concrete","scale":"residential"}'
probe '/api/site/enrich'                   '{"latitude":-1.286,"longitude":36.817,"location":"Nairobi, Kenya"}'
