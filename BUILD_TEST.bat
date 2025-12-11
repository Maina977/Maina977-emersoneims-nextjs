@echo off
cd /d "C:\Users\PC\my-app"
echo Building project...
npm.cmd run build > build-output.txt 2>&1
if errorlevel 1 (
    echo BUILD FAILED - Check build-output.txt
    type build-output.txt
) else (
    echo BUILD SUCCESS!
    echo Starting dev server...
    npm.cmd run dev
)

