@echo off
cd /d C:\Users\PC\my-app
echo Current directory: %CD%
echo.
echo Pushing to GitHub...
echo.
git init
git remote remove origin 2>nul
git remote add origin https://github.com/Maina977/emersoneims-nextjs.git
git branch -M main
git add .
git commit -m "Awwwards 9.8/10 - Production ready website"
git push -u origin main
pause

