# Cambia automaticamente el numero de version (?v=...) de styles.css, contenido.js y script.js
# en index.html, para que los navegadores siempre carguen la version nueva.
# Lo ejecuta subir-a-github.bat; no hace falta abrirlo a mano.

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$file = Join-Path $root 'index.html'
$text = [IO.File]::ReadAllText($file)
$ver  = Get-Date -Format 'yyyyMMddHHmm'
$text = [regex]::Replace($text, '(styles\.css|contenido\.js|script\.js)\?v=[^"]+', ('$1?v=' + $ver))
[IO.File]::WriteAllText($file, $text, (New-Object System.Text.UTF8Encoding $false))
Write-Host "        Version de archivos: $ver"
