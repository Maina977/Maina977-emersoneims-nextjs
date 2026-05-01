$body = @{ name='Audit Villa Nakuru'; location='Nakuru, Kenya'; area=220; stories=2; units=1; bedrooms=4
  building_type='residential'; client_name='Mr. K. Mwangi'
  plot_no='LR No. NAK/47/8901'; title_deed='Title Deed NAK/4567'
  architect='Arch. J. Mwangi BORAQS A/2341'; engineer='Eng. P. Otieno EBK PE/5678'
  qs='QS L. Wanjiru BORAQS QS/4421'; gps_lat=-0.303; gps_lng=36.080 } | ConvertTo-Json
Invoke-RestMethod -Uri 'http://127.0.0.1:5000/api/generate' -Method POST -Body $body -ContentType 'application/json' -TimeoutSec 90 | Out-Null
Invoke-WebRequest -Uri 'http://127.0.0.1:5000/api/export/pdf' -OutFile 'FINAL_REPORT.pdf' -TimeoutSec 120
