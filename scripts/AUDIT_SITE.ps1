$logFile = "C:\Users\PC\my-app\SITE_AUDIT_LOG.txt"
Start-Transcript -Path $logFile -Force

Write-Host "--- DNS CHECK ---"
try {
    Resolve-DnsName www.emersoneims.com | Format-Table
} catch {
    Write-Host "DNS Resolution Failed: $_"
}

Write-Host "--- HTTP CHECK ---"
try {
    $response = Invoke-WebRequest -Uri "https://www.emersoneims.com" -Method Head -ErrorAction Stop
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "StatusDescription: $($response.StatusDescription)"
} catch {
    Write-Host "HTTP Request Failed: $_"
}

Write-Host "--- VERCEL STATUS ---"
vercel ls --prod | Select-Object -First 5

Stop-Transcript
