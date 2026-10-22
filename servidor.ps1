# ============================================================
#  DE SOL A SOL - Servidor local para ver la pagina en tu compu
#  No requiere instalar nada: usa PowerShell (viene con Windows).
#  Se ejecuta desde iniciar.bat. Para detenerlo, cerra la ventana.
# ============================================================

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

$mime = @{
  '.html' = 'text/html; charset=utf-8'
  '.htm'  = 'text/html; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.js'   = 'application/javascript; charset=utf-8'
  '.json' = 'application/json; charset=utf-8'
  '.txt'  = 'text/plain; charset=utf-8'
  '.md'   = 'text/plain; charset=utf-8'
  '.svg'  = 'image/svg+xml'
  '.png'  = 'image/png'
  '.jpg'  = 'image/jpeg'
  '.jpeg' = 'image/jpeg'
  '.jfif' = 'image/jpeg'
  '.webp' = 'image/webp'
  '.gif'  = 'image/gif'
  '.ico'  = 'image/x-icon'
  '.mp4'  = 'video/mp4'
  '.webm' = 'video/webm'
  '.woff2'= 'font/woff2'
}

# Buscar un puerto libre entre 8080 y 8099
$listener = $null
$port = 0
foreach ($p in 8080..8099) {
  try {
    $l = New-Object System.Net.HttpListener
    $l.Prefixes.Add("http://localhost:$p/")
    $l.Start()
    $listener = $l
    $port = $p
    break
  } catch { }
}

if (-not $listener) {
  Write-Host ''
  Write-Host '  ERROR: no se pudo abrir ningun puerto (8080 a 8099).' -ForegroundColor Red
  Write-Host '  Cerra otras ventanas de servidor y volve a intentar.'
  Read-Host '  Presiona Enter para salir'
  exit 1
}

$url = "http://localhost:$port/index.html"
Write-Host ''
Write-Host '  ==========================================' -ForegroundColor Yellow
Write-Host '     DE SOL A SOL - Minimarket'                -ForegroundColor Yellow
Write-Host "     Pagina abierta en: $url"
Write-Host '  ==========================================' -ForegroundColor Yellow
Write-Host '  Para detener el servidor, cerra esta ventana.'
Write-Host ''

Start-Process $url

while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $res = $ctx.Response

    $rel = [Uri]::UnescapeDataString($req.Url.AbsolutePath.TrimStart('/'))
    if ([string]::IsNullOrEmpty($rel)) { $rel = 'index.html' }
    $path = [IO.Path]::GetFullPath((Join-Path $root $rel))

    $dentro = $path.StartsWith($root, [StringComparison]::OrdinalIgnoreCase)
    if (-not $dentro -or -not (Test-Path -LiteralPath $path -PathType Leaf)) {
      $res.StatusCode = 404
      $res.ContentType = 'text/plain; charset=utf-8'
      $b = [Text.Encoding]::UTF8.GetBytes("404 - No encontrado: $rel")
      $res.OutputStream.Write($b, 0, $b.Length)
      Write-Host "  404  $rel" -ForegroundColor DarkGray
    } else {
      $ext = [IO.Path]::GetExtension($path).ToLower()
      if ($mime.ContainsKey($ext)) { $res.ContentType = $mime[$ext] } else { $res.ContentType = 'application/octet-stream' }
      $res.Headers.Add('Cache-Control', 'no-store')
      $bytes = [IO.File]::ReadAllBytes($path)
      $res.ContentLength64 = $bytes.Length
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    }
    $res.OutputStream.Close()
  } catch {
    # el navegador cerro la conexion: se ignora y se sigue atendiendo
  }
}
