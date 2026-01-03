@echo off
title Fix All Import Paths
color 0B
echo ================================================
echo    FIXING ALL IMPORT PATHS
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo Fixing import paths in all files...
powershell -Command "$files = Get-ChildItem -Path 'app' -Recurse -Include *.ts,*.tsx,*.js,*.jsx; foreach ($file in $files) { $content = [IO.File]::ReadAllText($file.FullName); $original = $content; $content = $content -replace '@/app/components', '@/components'; $content = $content -replace '@/app/componets', '@/componets'; $content = $content -replace '@/app/lib', '@/lib'; $content = $content -replace '@/app/app/data', '@/app/data'; $content = $content -replace '@/app/styles', '@/styles'; if ($content -ne $original) { [IO.File]::WriteAllText($file.FullName, $content); Write-Host \"Fixed: $($file.FullName)\" } }"

echo.
echo ================================================
echo   ✓ ALL IMPORT PATHS FIXED!
echo ================================================
echo.
pause















