@echo off
setlocal EnableDelayedExpansion
title DE SOL A SOL - Publicar cambios
cd /d "%~dp0"

echo.
echo  ==========================================
echo     DE SOL A SOL - Publicar cambios
echo  ==========================================
echo.

where git >nul 2>nul
if errorlevel 1 (
  echo  ERROR: Git no esta instalado. Descargalo en https://git-scm.com/download/win
  echo.
  pause
  exit /b 1
)

git remote set-url origin https://github.com/javierlegal-up/solasol24.git

rem --- 1) Version nueva de los archivos (evita que se vea la version vieja) ---
echo  [1/4] Preparando la version nueva...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0actualizar-version.ps1"

rem --- 2) Guardar cambios ---
echo  [2/4] Guardando cambios...
git add -A
git diff --cached --quiet
if errorlevel 1 (
  git commit -q -m "Actualizacion %date% %time:~0,5%"
) else (
  echo        No habia cambios nuevos.
)

rem --- 3) Subir a GitHub (Netlify publica solo) ---
echo  [3/4] Subiendo a GitHub...
git pull -q --rebase origin main
if errorlevel 1 (
  echo.
  echo  ERROR al sincronizar con GitHub. Se deshace para no romper nada.
  git rebase --abort >nul 2>nul
  echo  Copia el mensaje de arriba y pegaselo a Claude.
  echo.
  pause
  exit /b 1
)
git push -q origin main
if errorlevel 1 (
  echo.
  echo  ERROR: no se pudo subir. Copia el mensaje de arriba y pegaselo a Claude.
  echo.
  pause
  exit /b 1
)

rem --- 4) Esperar a Netlify y abrir la pagina ---
echo  [4/4] Listo. Esperando que Netlify publique (unos 40 segundos)...
timeout /t 40 /nobreak >nul
start "" "https://solasol24.com.ar/?actualizado=%random%"

echo.
echo  ==========================================
echo   LISTO: tu pagina se abrio actualizada.
echo   https://solasol24.com.ar
echo  ==========================================
echo.
echo  (Si todavia ves algo viejo, espera un minuto y recarga.)
echo.
pause
