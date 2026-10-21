@echo off
chcp 65001 >nul
title DE SOL A SOL - Servidor local
cd /d "%~dp0"

set PORT=8080
set URL=http://localhost:%PORT%/index.html

echo.
echo  ==========================================
echo     DE SOL A SOL - MINIMARKET 24 HORAS
echo     Servidor local en %URL%
echo  ==========================================
echo.

where py >nul 2>nul
if %errorlevel%==0 (
  echo  Usando Python ^(py^)...  Cierra esta ventana para detener.
  start "" "%URL%"
  py -m http.server %PORT%
  goto :eof
)

where python >nul 2>nul
if %errorlevel%==0 (
  echo  Usando Python...  Cierra esta ventana para detener.
  start "" "%URL%"
  python -m http.server %PORT%
  goto :eof
)

where npx >nul 2>nul
if %errorlevel%==0 (
  echo  Usando Node ^(npx http-server^)...  Cierra esta ventana para detener.
  start "" "%URL%"
  npx --yes http-server -p %PORT% -c-1
  goto :eof
)

echo  No se encontro Python ni Node.js.
echo  Abriendo la pagina directamente en el navegador...
start "" "%~dp0index.html"
timeout /t 3 >nul
