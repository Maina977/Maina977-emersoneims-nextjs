$probes = @(
  @{u='/api/arch/daylight/adf'; b='{"window_area_m2":33,"total_internal_surface_m2":1100,"T_glass":0.68,"sky_angle_deg":65,"avg_reflectance":0.5,"maintenance_factor":0.9,"frame_factor":0.7}'},
  @{u='/api/arch/uvalue'; b='{"heat_flow":"horizontal","layers":[{"name":"External plaster","thickness_m":0.020,"k":0.60},{"name":"Concrete block 200","thickness_m":0.200,"k":1.00},{"name":"EPS insulation 50","thickness_m":0.050,"k":0.038},{"name":"Internal plaster","thickness_m":0.012,"k":0.60}]}'},
  @{u='/api/arch/acoustics/reverberation'; b='{"volume_m3":660,"method":"sabine","surfaces":[{"material":"plaster","area_m2":440,"absorption":0.04},{"material":"floor","area_m2":220,"absorption":0.02},{"material":"glazing","area_m2":33,"absorption":0.18},{"material":"furnishings","area_m2":110,"absorption":0.40}]}'},
  @{u='/api/arch/egress'; b='{"occupancy_type":"residential","floor_area_m2":220,"sprinklered":true,"voice_notification":false}'},
  @{u='/api/arch/accessibility/check'; b='{"jurisdiction":"strictest","measurements":{"door_clear_width_mm":900,"corridor_width_mm":1200,"ramp_slope_pct":7,"wc_clear_diameter_mm":1500,"threshold_height_mm":15}}'},
  @{u='/api/arch/shadow/solstice'; b='{"lat":-1.286,"lng":36.817,"pole_height_m":3.5}'},
  @{u='/api/loads/wind/eurocode'; b='{"vb_ms":24,"height_m":3.5,"length_m":17.8,"width_m":12.3,"terrain_category":"II","co":1.0,"cprob":1.0,"cdir":1.0,"cseason":1.0,"rho_kg_m3":1.25}'},
  @{u='/api/geotech/bearing/terzaghi'; b='{"c_kPa":15,"phi_deg":28,"gamma_kN_m3":18,"B_m":0.6,"Df_m":1.2,"shape":"strip"}'},
  @{u='/api/rc/beam/bending'; b='{"b_mm":300,"h_mm":500,"d_mm":450,"As_mm2":1500,"fck_MPa":30,"fyk_MPa":500,"Med_kNm":120}'},
  @{u='/api/qs/carbon/assess'; b='{"assessment_stage":"RIBA-3","materials":[{"name":"concrete","quantity_kg":79200,"ec_kgco2e_per_kg":0.13,"factor_source":"ICE Database v3.0 (Bath, 2019)"},{"name":"reinforcing steel","quantity_kg":6600,"ec_kgco2e_per_kg":1.85,"factor_source":"World Steel Association (2020)"},{"name":"concrete blocks","quantity_kg":49500,"ec_kgco2e_per_kg":0.07,"factor_source":"EPD CMU Industry Avg 2019"}]}'},
  @{u='/api/qs/ve/suggest'; b='{"items":[{"description":"Granite countertop","amount":5000,"category":"finishes"},{"description":"Imported marble flooring","amount":12000,"category":"finishes"}]}'},
  @{u='/api/sched/cpm'; b='{"project_start":"2026-05-01","activities":[{"id":"A","name":"Mobilisation","duration_days":7,"predecessors":[]},{"id":"B","name":"Excavation","duration_days":14,"predecessors":["A"]},{"id":"C","name":"Foundations","duration_days":21,"predecessors":["B"]},{"id":"D","name":"Superstructure","duration_days":35,"predecessors":["C"]},{"id":"E","name":"Roofing","duration_days":14,"predecessors":["D"]},{"id":"F","name":"Finishes","duration_days":30,"predecessors":["E"]},{"id":"G","name":"Handover","duration_days":7,"predecessors":["F"]}]}'},
  @{u='/api/safety/risks/register'; b='{"trades":["concrete","steel","scaffolding","electrical","excavation","roofing","plumbing","painting"],"site_type":"residential"}'}
)
$ok=0; $sucTrue=0
foreach($p in $probes){
  try {
    $r = Invoke-WebRequest "http://127.0.0.1:5000$($p.u)" -Method POST -Body $p.b -ContentType 'application/json' -UseBasicParsing -TimeoutSec 20
    $txt = $r.Content; $short = if ($txt.Length -gt 200) { $txt.Substring(0,200) + '...' } else { $txt }
    "[OK $($r.StatusCode)] $($p.u) -> $short"
    if ($r.StatusCode -eq 200) { $ok++ }
    if ($txt -match '"success"\s*:\s*true') { $sucTrue++ }
  } catch { "[FAIL] $($p.u) -> $($_.Exception.Message)" }
}
try {
  $r = Invoke-WebRequest "http://127.0.0.1:5000/api/safety/methods/catalog" -UseBasicParsing -TimeoutSec 20
  $txt = $r.Content; $short = if ($txt.Length -gt 200) { $txt.Substring(0,200) + '...' } else { $txt }
  "[OK $($r.StatusCode)] /api/safety/methods/catalog -> $short"
  if ($r.StatusCode -eq 200) { $ok++ }
  if ($txt -match '"success"\s*:\s*true') { $sucTrue++ }
} catch { "[FAIL] /api/safety/methods/catalog -> $($_.Exception.Message)" }
""
"=== TOTALS: HTTP200=$ok / 14 ; success:true=$sucTrue / 14 ==="
