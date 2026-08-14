param(
    [string]$SourcePath,
    [string]$OutputDirectory
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$repositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot '../../../..')).Path
if (-not $SourcePath) {
    $SourcePath = Join-Path $repositoryRoot '2629363c-aed1-49a3-8c05-181b4f1faa6e.png'
}
if (-not $OutputDirectory) {
    $OutputDirectory = Join-Path $repositoryRoot 'public/profile-icons'
}

$icons = @(
    @{ Key = 'dorito-feliz';          Title = 'Dorito feliz';             X = 38;   Y = 40  },
    @{ Key = 'dorito-guino';          Title = 'Dorito guiñando un ojo';  X = 416;  Y = 40  },
    @{ Key = 'dorito-notas';          Title = 'Dorito tomando notas';      X = 800;  Y = 40  },
    @{ Key = 'dorito-amor';           Title = 'Dorito expresando amor';    X = 1195; Y = 40  },
    @{ Key = 'felicia-atenta';        Title = 'Felicia atenta';            X = 1591; Y = 40  },
    @{ Key = 'felicia-dormida';       Title = 'Felicia dormida';           X = 38;   Y = 403 },
    @{ Key = 'felicia-saludo';        Title = 'Felicia saludando';         X = 416;  Y = 403 },
    @{ Key = 'felipa-seria';          Title = 'Felipa seria';              X = 800;  Y = 403 },
    @{ Key = 'felipa-candado';        Title = 'Felipa con un candado';     X = 1195; Y = 403 },
    @{ Key = 'felipa-entrenamiento';  Title = 'Felipa entrenando';         X = 1591; Y = 403 }
)

$cropSize = 348
$clipRadius = 166
$center = $cropSize / 2
$utf8WithoutBom = [System.Text.UTF8Encoding]::new($false)

New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null
$source = [System.Drawing.Bitmap]::FromFile((Resolve-Path $SourcePath))

try {
    foreach ($icon in $icons) {
        $crop = [System.Drawing.Bitmap]::new(
            $cropSize,
            $cropSize,
            [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
        )

        try {
            $graphics = [System.Drawing.Graphics]::FromImage($crop)
            try {
                $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
                $graphics.DrawImage(
                    $source,
                    [System.Drawing.Rectangle]::new(0, 0, $cropSize, $cropSize),
                    [System.Drawing.Rectangle]::new($icon.X, $icon.Y, $cropSize, $cropSize),
                    [System.Drawing.GraphicsUnit]::Pixel
                )
            }
            finally {
                $graphics.Dispose()
            }

            $stream = [System.IO.MemoryStream]::new()
            try {
                $crop.Save($stream, [System.Drawing.Imaging.ImageFormat]::Png)
                $encodedPng = [Convert]::ToBase64String($stream.ToArray())
            }
            finally {
                $stream.Dispose()
            }
        }
        finally {
            $crop.Dispose()
        }

        $escapedTitle = [System.Security.SecurityElement]::Escape($icon.Title)
        $svg = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 $cropSize $cropSize" role="img" aria-labelledby="title">
  <title id="title">$escapedTitle</title>
  <defs>
    <clipPath id="avatar-circle">
      <circle cx="$center" cy="$center" r="$clipRadius"/>
    </clipPath>
  </defs>
  <image width="$cropSize" height="$cropSize" href="data:image/png;base64,$encodedPng" clip-path="url(#avatar-circle)"/>
</svg>
"@

        $destination = Join-Path $OutputDirectory ($icon.Key + '.svg')
        [System.IO.File]::WriteAllText($destination, $svg, $utf8WithoutBom)
    }
}
finally {
    $source.Dispose()
}

Write-Host "Generated $($icons.Count) profile icons in $OutputDirectory"
