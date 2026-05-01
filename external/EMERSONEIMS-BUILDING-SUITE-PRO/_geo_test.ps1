# --- Test A: Generate WITHOUT geotech --> should be BLOCKED ---
$body = @{ name='Audit Villa Nakuru'; location='Nakuru, Kenya'; area=220; stories=2; units=1; bedrooms=4
  building_type='residential'; client_name='Mr. K. Mwangi'
  plot_no='LR No. NAK/47/8901'; title_deed='Title Deed NAK/4567'
  architect='Arch. J. Mwangi BORAQS A/2341'; engineer='Eng. P. Otieno EBK PE/5678'
  qs='QS L. Wanjiru BORAQS QS/4421'; gps_lat=-0.303; gps_lng=36.080 } | ConvertTo-Json
Invoke-RestMethod -Uri 'http://127.0.0.1:5000/api/generate' -Method POST -Body $body -ContentType 'application/json' -TimeoutSec 90 | Out-Null
Invoke-WebRequest -Uri 'http://127.0.0.1:5000/api/export/pdf' -OutFile 'NO_GEOTECH.pdf' -TimeoutSec 120
"--- Test A: NO_GEOTECH.pdf size: $((Get-Item NO_GEOTECH.pdf).Length) bytes ---"

# --- Test B: Upload geotech then re-export ---
$geo = @{ safe_bearing_kPa=220; water_table_m=4.2; soil_class='CL'
  report_ref='NAK-GEO-2026-0117'; geotech_engineer='Eng. M. Kariuki, EBK GE/0987' } | ConvertTo-Json
$r = Invoke-RestMethod -Uri 'http://127.0.0.1:5000/api/project/geotech' -Method POST -Body $geo -ContentType 'application/json' -TimeoutSec 30
"--- Geotech upload response ---"; $r | ConvertTo-Json
Invoke-WebRequest -Uri 'http://127.0.0.1:5000/api/export/pdf' -OutFile 'WITH_GEOTECH.pdf' -TimeoutSec 120
"--- Test B: WITH_GEOTECH.pdf size: $((Get-Item WITH_GEOTECH.pdf).Length) bytes ---"
