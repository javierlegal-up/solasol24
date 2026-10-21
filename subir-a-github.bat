@echo off
chcp 65001 >nul
title DE SOL A SOL - Subir a GitHub
cd /d "%~dp0"

set REPO=git@github.com:javierlegal-up/solasol24.git

where git >nul 2>nul
if not %errorlevel%==0 (
  echo  Git no esta instalado. Descargalo en https://git-scm.com/download/win
  pause
  exit /b 1
)

rem --- Identidad de git (necesaria para el commit) ---
for /f "delims=" %%i in ('git config user.email 2^>nul') do set GITMAIL=%%i
if "%GITMAIL%"=="" (
  echo  Git no tiene configurado tu nombre y correo.
  set /p GITNAME= Escribe tu nombre:
  set /p GITMAIL= Escribe tu correo de GitHub:
)
if not "%GITNAME%"=="" git config --global user.name "%GITNAME%"
if not "%GITNAME%"=="" git config --global user.email "%GITMAIL%"

if not exist logo.png (
  echo.
  echo  AVISO: no se encontro logo.png en la carpeta. Se subira sin logo.
)

echo.
echo  [1/5] Preparando repositorio...
if not exist ".git" git init
git checkout -B main >nul 2>nul

echo  [2/5] Conectando con %REPO%
git remote get-url origin >nul 2>nul
if %errorlevel%==0 (
  git remote set-url origin %REPO%
) else (
  git remote add origin %REPO%
)

echo  [3/5] Guardando archivos (commit)...
git add -A
git commit -m "Landing page DE SOL A SOL - Minimarket 24 horas"

echo  [4/5] Sincronizando con GitHub...
git pull origin main --allow-unrelated-histories --no-edit

echo  [5/5] Subiendo...
git push -u origin main

if %errorlevel%==0 (
  echo.
  echo  ✅ Listo. Revisa: https://github.com/javierlegal-up/solasol24
) else (
  echo.
  echo  ❌ No se pudo subir.
  echo  Si el error dice "Permission denied (publickey)", tu PC no tiene
  echo  una llave SSH registrada en GitHub. Solucion rapida:
  echo    1^) ssh-keygen -t ed25519 -C "tu-correo"   ^(Enter a todo^)
  echo    2^) type %%USERPROFILE%%\.ssh\id_ed25519.pub
  echo    3^) Copia ese texto en GitHub ^> Settings ^> SSH and GPG keys ^> New SSH key
  echo    4^) Vuelve a ejecutar este archivo
)
pause
