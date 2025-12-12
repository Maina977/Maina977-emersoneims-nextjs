@echo off
title Rename Files/Folders with Spaces
color 0B
echo ================================================
echo    RENAMING FILES/FOLDERS WITH SPACES
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/3] Renaming folders with spaces...

rem Rename "contact us" to "contact"
if exist "app\componets\contact us" (
    ren "app\componets\contact us" "contact"
    echo ✓ Renamed: contact us → contact
)

if exist "app\app\Contact Us" (
    ren "app\app\Contact Us" "Contact"
    echo ✓ Renamed: Contact Us → Contact
)

if exist "app\app\About us" (
    ren "app\app\About us" "About"
    echo ✓ Renamed: About us → About
)

echo.
echo [2/3] Renaming files with spaces...

rem Rename files in app/app/ to use hyphens
for %%F in ("app\app\* page.tsx") do (
    set "oldname=%%F"
    set "newname=!oldname: page.tsx=-page.tsx!"
    ren "%%F" "%%~nF%%~xF"
    echo Processing: %%F
)

rem Better approach: PowerShell
powershell -Command "$files = Get-ChildItem -Path 'app\app' -File -Recurse | Where-Object { $_.Name -match ' ' }; foreach ($file in $files) { $newName = $file.Name -replace ' ', '-'; $newPath = Join-Path $file.DirectoryName $newName; Rename-Item -Path $file.FullName -NewName $newName -ErrorAction SilentlyContinue; if ($?) { Write-Host \"Renamed: $($file.Name) → $newName\" } }"
echo ✓ Files renamed

echo.
echo [3/3] Updating import paths after renaming...
powershell -Command "$files = Get-ChildItem -Path 'app' -Recurse -Include *.ts,*.tsx,*.js,*.jsx; foreach ($file in $files) { $content = [IO.File]::ReadAllText($file.FullName); $content = $content -replace 'contact us', 'contact'; $content = $content -replace 'contact page', 'contact-page'; $content = $content -replace 'generators page', 'generators-page'; $content = $content -replace 'service page', 'service-page'; $content = $content -replace 'solution page', 'solution-page'; $content = $content -replace 'solar page', 'solar-page'; [IO.File]::WriteAllText($file.FullName, $content) }"
echo ✓ Import paths updated

echo.
echo ================================================
echo   ✅ RENAMING COMPLETE!
echo ================================================
pause


