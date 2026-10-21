@echo off
chcp 65001 >nul
title DE SOL A SOL - Guardar en GitHub
cd /d "%~dp0"

set REPO=https://github.com/javierlegal-up/solasol24.git

where git >nul 2>nul
if not %errorlevel%==0 (
  echo  Git no esta instalado. Descargalo en https://git-scm.com/download/win
  pause
  exit /b 1
)

git remote set-url origin %REPO%

echo.
echo  Escribe una descripcion del cambio (o Enter para usar la fecha):
set /p MSG= ^>
if "%MSG%"=="" set MSG=Actualizacion %date% %time:~0,5%

echo.
echo  [1/3] Preparando archivos...
git add -A

echo  [2/3] Guardando cambios...
git commit -m "%MSG%"

echo  [3/3] Subiendo a GitHub...
git pull --rebase origin main
git push origin main

if %errorlevel%==0 (
  echo.
  echo  ✅ Listo. Revisa: https://github.com/javierlegal-up/solasol24
) else (
  echo.
  echo  ❌ No se pudo subir. Copia el mensaje de arriba y pegaselo a Claude.
)
echo.
pause
