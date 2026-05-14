$ErrorActionPreference = "Stop"

$SDK = "F:\Android\Sdk"
$BT = "$SDK\build-tools\35.0.0"
$PLAT = "$SDK\platforms\android-34"

# Fix JAVA_HOME if pointing to stale version
$javaExe = (Get-Command java -ErrorAction SilentlyContinue).Source
if ($javaExe) {
    $env:JAVA_HOME = (Split-Path (Split-Path $javaExe))
}

# Create junction to avoid CJK path issues with aapt2
$JUNCTION = "F:\aifuxue_build"
if (-not (Test-Path $JUNCTION)) {
    New-Item -ItemType Junction -Path $JUNCTION -Target "f:\ai学习app\native-app" | Out-Null
}
$SRC = "$JUNCTION\app\src\main"
$OUT = "$JUNCTION\build"

Write-Host "[1/6] Cleaning..."
if (Test-Path $OUT) { Remove-Item -Recurse -Force $OUT }
New-Item -ItemType Directory -Path "$OUT\gen", "$OUT\classes", "$OUT\apk" -Force | Out-Null

Write-Host "[2/6] AAPT2 compile..."
& "$BT\aapt2.exe" compile --dir "$SRC\res" -o "$OUT\compiled_res.zip"
if ($LASTEXITCODE -ne 0) { throw "AAPT2 compile failed" }

Write-Host "[3/6] AAPT2 link..."
& "$BT\aapt2.exe" link -o "$OUT\apk\base.apk" -I "$PLAT\android.jar" --manifest "$SRC\AndroidManifest.xml" --java "$OUT\gen" "$OUT\compiled_res.zip" --auto-add-overlay
if ($LASTEXITCODE -ne 0) { throw "AAPT2 link failed" }

Write-Host "[4/6] javac..."
& javac -encoding UTF-8 -source 1.8 -target 1.8 -bootclasspath "$PLAT\android.jar" -classpath "$PLAT\android.jar" -d "$OUT\classes" "$SRC\java\com\aifuxue\app\MainActivity.java"
if ($LASTEXITCODE -ne 0) { throw "javac failed" }

Write-Host "[5/6] d8..."
& "$BT\d8.bat" --release --output "$OUT\apk" "$OUT\classes\com\aifuxue\app\MainActivity.class"
if ($LASTEXITCODE -ne 0) { throw "d8 failed" }

Write-Host "[6/6] Building & signing APK..."
Copy-Item "$OUT\apk\base.apk" "$OUT\app-unsigned.apk"

Push-Location "$OUT\apk"
& "$BT\aapt.exe" add "$OUT\app-unsigned.apk" classes.dex
Pop-Location

& "$BT\zipalign.exe" -f 4 "$OUT\app-unsigned.apk" "$OUT\app-aligned.apk"

$keystore = "$env:USERPROFILE\.android\debug.keystore"
& "$BT\apksigner.bat" sign --ks $keystore --ks-pass pass:android --key-pass pass:android --out "$OUT\aifuxue.apk" "$OUT\app-aligned.apk"
if ($LASTEXITCODE -ne 0) { throw "Signing failed" }

Write-Host ""
Write-Host "=== BUILD SUCCESS ==="
Write-Host "APK: $OUT\aifuxue.apk"
