$dir = "c:\Users\user\Desktop\calender"
$files = Get-ChildItem -Path $dir -Recurse -Include *.html, *.js, *.css

foreach ($file in $files) {
    if ($file.Extension -eq '.html' -or $file.Extension -eq '.js' -or $file.Extension -eq '.css') {
        $content = Get-Content $file.FullName -Raw
        $originalContent = $content

        # Replace variations of Luna with Moon Bloom
        $content = $content -replace 'NewLuna Session', 'Moon Bloom Session'
        $content = $content -replace 'NewLunaUnlocked_', 'MoonBloomUnlocked_'
        $content = $content -replace 'NewLuna', 'Moon Bloom'
        $content = $content -replace 'Luna Soft', 'Moon Bloom'
        $content = $content -replace 'Luna AI', 'Moon Bloom AI'
        $content = $content -replace 'Talk to Luna', 'Talk to Moon Bloom'
        $content = $content -replace 'Luna''s', 'Moon Bloom''s'
        $content = $content -replace 'Luna', 'Moon Bloom'
        $content = $content -replace 'Moon Bloom AI Tip', 'Moon Bloom AI Tip' # Fix double replace
        $content = $content -replace 'Moon Bloom''s', 'Moon Bloom''s' # Fix double replace

        # Fix JavaScript transition conflicts (body.page-loaded) in CSS
        if ($file.Extension -eq '.css') {
            $content = $content -replace 'opacity: 0;\s*transition: opacity 0.5s ease-in-out;', ''
            $content = $content -replace 'body\.page-loaded\s*\{\s*opacity: 1;\s*\}', ''
        }

        # Fix JS transition conflicts in JS
        if ($file.Extension -eq '.js') {
            $content = $content -replace 'document\.body\.classList\.add\(''page-loaded''\);', '// Removed to prevent conflict with splash screen'
        }

        # Fix specific body tag in dashboard.html
        if ($file.Name -eq 'dashboard.html') {
            $content = $content -replace '<body class="page-loaded">', '<body>'
        }

        if ($content -cne $originalContent) {
            Set-Content -Path $file.FullName -Value $content -NoNewline
            Write-Host "Updated $($file.Name)"
        }
    }
}
