# Fix all import paths in app/app/ directory
$files = Get-ChildItem -Path "app\app" -Recurse -Include *.ts,*.tsx,*.js,*.jsx

foreach ($file in $files) {
    $content = [IO.File]::ReadAllText($file.FullName)
    $original = $content
    
    # Fix all import paths
    $content = $content -replace '@/app/components', '@/components'
    $content = $content -replace '@/app/componets', '@/componets'
    $content = $content -replace '@/app/lib', '@/lib'
    $content = $content -replace '@/app/app/data', '@/app/data'
    $content = $content -replace '@/app/styles', '@/styles'
    
    if ($content -ne $original) {
        [IO.File]::WriteAllText($file.FullName, $content)
        Write-Host "Fixed: $($file.Name)"
    }
}

Write-Host "`nAll imports fixed in app/app/ directory"





