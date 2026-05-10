Add-Type -AssemblyName System.Drawing

$sizes = @(20, 29, 40, 58, 60, 76, 80, 87, 120, 152, 167, 180, 1024)
$outputDir = "f:\ai学习app\client\src\static\icons\ios"

if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

foreach ($size in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias

    # 渐变背景
    $rect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        $rect,
        [System.Drawing.Color]::FromArgb(61, 86, 198),
        [System.Drawing.Color]::FromArgb(91, 123, 255),
        [System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal
    )
    $g.FillRectangle($brush, $rect)

    # 绘制文字
    $fontSize = [Math]::Round($size * 0.5)
    $font = New-Object System.Drawing.Font("Microsoft YaHei", $fontSize, [System.Drawing.FontStyle]::Bold)
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center
    $g.DrawString([char]0x7231, $font, $textBrush, [System.Drawing.RectangleF]::new(0, 0, $size, $size), $format)

    # 保存
    $filePath = Join-Path $outputDir "icon-$size.png"
    $bmp.Save($filePath, [System.Drawing.Imaging.ImageFormat]::Png)

    $g.Dispose()
    $bmp.Dispose()
    $brush.Dispose()
    $font.Dispose()
    $textBrush.Dispose()

    Write-Host "Generated: icon-$size.png"
}

Write-Host "`nAll $($sizes.Count) icons generated in: $outputDir"
