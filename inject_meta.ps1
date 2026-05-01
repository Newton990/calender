$files = Get-ChildItem -Path $PSScriptRoot -Filter *.html
$tagsToAdd = @"
    <!-- App Icons and Favicon -->
    <link rel="icon" href="NewLuna_Logo_Transparent.svg" type="image/svg+xml">
    <meta property="og:image" content="NewLuna_Logo_Light.svg">
    <meta name="twitter:image" content="NewLuna_Logo_Light.svg">
"@

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Remove old tags if they exist
    $content = $content -replace '<link[^>]+rel="icon"[^>]*>', ''
    $content = $content -replace '<link[^>]+rel="shortcut icon"[^>]*>', ''
    $content = $content -replace '<link[^>]+rel="apple-touch-icon"[^>]*>', ''
    $content = $content -replace '<meta[^>]+property="og:image"[^>]*>', ''
    $content = $content -replace '<meta[^>]+name="twitter:image"[^>]*>', ''
    $content = $content -replace '<!-- App Icons and Favicon -->', ''

    if ($content -match '</head>') {
        $content = $content -replace '</head>', "`n$tagsToAdd`n</head>"
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
        Write-Host "Updated $($file.Name)"
    }
}
Write-Host "Finished adding SEO and social media meta tags."
