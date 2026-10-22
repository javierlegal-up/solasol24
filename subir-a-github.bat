@echo off
setlocal EnableDelayedExpansion
title DE SOL A SOL - Guardar en GitHub
cd /d "%~dp0"

where git >nul 2>nul
if errorlevel 1 (
  echo.
  echo  ERROR: Git no esta instalado.
  echo  Descargalo en https://git-scm.com/download/win y volve a intentar.
  echo.
  pause
  exit /b 1
)

git remote set-url origin https://github.com/javierlegal-up/solasol24.git

echo.
echo  ==========================================
echo     DE SOL A SOL - Guardar en GitHub
echo  ==========================================
echo.
set "MSG="
set /p "MSG= Descripcion del cambio (Enter = usar la fecha): "
if not defined MSG set "MSG=Actualizacion %date% %time:~0,5%"

echo.
echo  [1/3] Preparando archivos...
git add -A

git diff --cached --quiet
if errorlevel 1 (
  echo  [2/3] Guardando cambios...
  git commit -m "!MSG!"
) else (
  echo  [2/3] No hay cambios nuevos para guardar.
)

echo  [3/3] Subiendo a GitHub...
git pull --rebase origin main
if errorlevel 1 (
  echo.
  echo  ERROR: hubo un conflicto al sincronizar con GitHub.
  echo  Se deshace la sincronizacion para no romper nada.
  git rebase --abort >nul 2>nul
  echo  Copia el mensaje de arriba y pegaselo a Claude.
  echo.
  pause
  exit /b 1
)

git push origin main
if errorlevel 1 (
  echo.
  echo  ERROR: no se pudo subir. Copia el mensaje de arriba y pegaselo a Claude.
) else (
  echo.
  echo  LISTO. Cambios subidos a https://github.com/javierlegal-up/solasol24
  echo  La pagina se actualiza en 1-2 minutos:
  echo  https://javierlegal-up.github.io/solasol24/
)
echo.
pause
