@echo off
title DE SOL A SOL - Servidor local
cd /d "%~dp0"

echo.
echo  Iniciando la pagina en tu compu...
echo.

if not exist "%~dp0servidor.ps1" (
  echo  ERROR: falta el archivo servidor.ps1 en esta carpeta.
  echo  Abriendo la pagina directamente en el navegador...
  start "" "%~dp0index.html"
  pause
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0servidor.ps1"

if errorlevel 1 (
  echo.
  echo  No se pudo iniciar el servidor.
  echo  Abriendo la pagina directamente en el navegador...
  start "" "%~dp0index.html"
  echo.
  pause
)
