$body = @{ name='Audit Villa Nakuru'; location='Nakuru, Kenya'; area=220; stories=2; units=1; bedrooms=4; building_type='residential'; client_name='Mr. K. Mwangi'; plot_no='LR No. NAK/47/8901'; title_deed='Title Deed NAK/4567'; architect='Arch. J. Mwangi BORAQS A/2341'; engineer='Eng. P. Otieno EBK PE/5678'; qs='QS L. Wanjiru BORAQS QS/4421'; gps_lat=-0.303; gps_lng=36.080 } | ConvertTo-Json
Write-Host "POSTING..."
$g = Invoke-RestMethod -Uri 'http://127.0.0.1:5000/api/generate' -Method POST -Body $body -ContentType 'application/json' -TimeoutSec 120
Write-Host "GENERATED"
Invoke-WebRequest -Uri 'http://127.0.0.1:5000/api/export/pdf' -OutFile 'pdf_audit4.pdf' -TimeoutSec 180
Write-Host "PDF SAVED"
$g | ConvertTo-Json -Depth 12 | Out-File -Encoding utf8 audit_generate4.json
Get-Item pdf_audit4.pdf, audit_generate4.json | Select-Object Name, Length, LastWriteTime
