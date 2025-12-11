# Fix all metadata exports in client components
$files = Get-ChildItem -Path "app" -Recurse -Include "*.tsx","*.ts","*.jsx","*.js" | Where-Object { $_.FullName -notmatch "node_modules|\.next" }

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $hasUseClient = $content -match "(^|\n)\s*['""]use client['""]"
    $hasMetadata = $content -match "export\s+const\s+metadata\s*="
    
    if ($hasUseClient -and $hasMetadata) {
        Write-Host "Fixing: $($file.FullName)"
        # Remove metadata export
        $content = $content -replace "export\s+const\s+metadata\s*=\s*\{[^}]*\};?\s*\n?", ""
        Set-Content -Path $file.FullName -Value $content -NoNewline
    }
}

Write-Host "Done!"


