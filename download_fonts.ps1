# Create fonts directory if it doesn't exist
New-Item -ItemType Directory -Force -Path "fonts"

# Font URLs
$fonts = @{
    "Tajawal-Light" = "https://fonts.gstatic.com/s/tajawal/v10/Iura6YBj_oCad4k1nzGBCw.woff2"
    "Tajawal-Regular" = "https://fonts.gstatic.com/s/tajawal/v10/Iura6YBj_oCad4k1nzSBC45I.woff2"
    "Tajawal-Medium" = "https://fonts.gstatic.com/s/tajawal/v10/Iura6YBj_oCad4k1nzGBC45I.woff2"
    "Tajawal-Bold" = "https://fonts.gstatic.com/s/tajawal/v10/Iura6YBj_oCad4k1nzGBC45I.woff2"
    "Tajawal-ExtraBold" = "https://fonts.gstatic.com/s/tajawal/v10/Iura6YBj_oCad4k1nzGBC45I.woff2"
}

# Download each font
foreach ($font in $fonts.GetEnumerator()) {
    $output = "fonts/$($font.Key).woff2"
    Write-Host "Downloading $($font.Key)..."
    Invoke-WebRequest -Uri $font.Value -OutFile $output
}

Write-Host "Font download complete!" 