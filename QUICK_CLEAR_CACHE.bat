@echo off
title Quick Cache Clear
cd /d "C:\Users\PC\my-app"
rmdir /s /q .next 2>nul
rmdir /s /q node_modules\.cache 2>nul
if exist tsconfig.tsbuildinfo del /f tsconfig.tsbuildinfo 2>nul
if exist .tsbuildinfo del /f .tsbuildinfo 2>nul
echo Cache cleared. Ready to build.


