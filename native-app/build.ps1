$ErrorActionPreference = "Stop"

$SDK = "F:\Android\Sdk"
$BT = "$SDK\build-tools\34.0.0"
$PLAT = "$SDK\platforms\android-34"
$SRC = "f:\ai学习app\native-app\app\src\main"
$OUT = "f:\ai学习app\native-app\build"

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
& javac -source 1.8 -target 1.8 -bootclasspath "$PLAT\android.jar" -classpath "$PLAT\android.jar" -d "$OUT\classes" "$SRC\java\com\aifuxue\app\MainActivity.java"
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
