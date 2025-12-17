# PowerShell script to copy contact components
$source = "app\components\contact"
$dest = "components\contact"

if (-not (Test-Path $source)) {
    Write-Host "ERROR: Source folder not found: $source" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $dest)) {
    New-Item -ItemType Directory -Path $dest -Force | Out-Null
    Write-Host "Created directory: $dest"
}

$files = Get-ChildItem -Path $source -Filter "*.jsx","*.tsx" -File
$copied = 0

foreach ($file in $files) {
    $destPath = Join-Path $dest $file.Name
    Copy-Item -Path $file.FullName -Destination $destPath -Force
    Write-Host "Copied: $($file.Name)" -ForegroundColor Green
    $copied++
}

Write-Host "`nTotal files copied: $copied" -ForegroundColor Cyan

if (Test-Path "$dest\SEOHead.jsx") {
    Write-Host "✓ Verification: SEOHead.jsx exists" -ForegroundColor Green
} else {
    Write-Host "✗ Verification FAILED: SEOHead.jsx missing" -ForegroundColor Red
}















