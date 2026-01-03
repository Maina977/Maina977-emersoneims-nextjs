# PowerShell script to fix all import paths
# Works with PowerShell 2.0+ (no -Raw parameter needed)

$files = Get-ChildItem -Path "app" -Recurse -Include *.ts,*.tsx,*.js,*.jsx | Where-Object { $_.FullName -notmatch 'node_modules|\.next|app_backup' }

$fixedCount = 0

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName)
    $originalContent = $content
    
    # Fix contact components path
    $content = $content -replace '@/components/contact/', '@/app/components/contact/'
    
    # Fix styles path
    $content = $content -replace '@/styles/', '@/app/styles/'
    
    # Fix lib data paths (should already be @/lib/data, but verify)
    # No change needed if already correct
    
    if ($content -ne $originalContent) {
        [System.IO.File]::WriteAllText($file.FullName, $content)
        Write-Host "✅ Fixed: $($file.FullName)" -ForegroundColor Green
        $fixedCount++
    }
}

Write-Host "`n✅ Fixed $fixedCount files" -ForegroundColor Cyan















