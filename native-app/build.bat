@echo off
setlocal

set SDK=F:\Android\Sdk
set BUILD_TOOLS=%SDK%\build-tools\34.0.0
set PLATFORM=%SDK%\platforms\android-34
set PROJECT=f:\ai学习app\native-app
set SRC=%PROJECT%\app\src\main
set OUT=%PROJECT%\build
set UNSIGNED_APK=%OUT%\app-unsigned.apk
set ALIGNED_APK=%OUT%\app-aligned.apk
set FINAL_APK=%OUT%\aifuxue.apk

echo [1/6] Cleaning...
if exist "%OUT%" rmdir /s /q "%OUT%"
mkdir "%OUT%\gen"
mkdir "%OUT%\classes"
mkdir "%OUT%\apk"

echo [2/6] Running AAPT2 compile...
"%BUILD_TOOLS%\aapt2.exe" compile --dir "%SRC%\res" -o "%OUT%\compiled_res.zip"
if errorlevel 1 (echo AAPT2 compile failed & exit /b 1)

echo [3/6] Running AAPT2 link...
"%BUILD_TOOLS%\aapt2.exe" link -o "%OUT%\apk\base.apk" -I "%PLATFORM%\android.jar" --manifest "%SRC%\AndroidManifest.xml" --java "%OUT%\gen" "%OUT%\compiled_res.zip" --auto-add-overlay
if errorlevel 1 (echo AAPT2 link failed & exit /b 1)

echo [4/6] Compiling Java...
javac -source 1.8 -target 1.8 -bootclasspath "%PLATFORM%\android.jar" -classpath "%PLATFORM%\android.jar" -d "%OUT%\classes" "%SRC%\java\com\aifuxue\app\MainActivity.java"
if errorlevel 1 (echo javac failed & exit /b 1)

echo [5/6] Creating DEX...
"%BUILD_TOOLS%\d8.bat" --release --output "%OUT%\apk" "%OUT%\classes\com\aifuxue\app\MainActivity.class"
if errorlevel 1 (echo d8 failed & exit /b 1)

echo [6/6] Building APK...
cd "%OUT%\apk"
copy base.apk "%UNSIGNED_APK%" >nul

rem Add classes.dex to the APK
"%BUILD_TOOLS%\aapt.exe" add "%UNSIGNED_APK%" classes.dex

rem Align
"%BUILD_TOOLS%\zipalign.exe" -f 4 "%UNSIGNED_APK%" "%ALIGNED_APK%"

rem Sign with debug key
if not exist "%USERPROFILE%\.android\debug.keystore" (
    keytool -genkeypair -v -keystore "%USERPROFILE%\.android\debug.keystore" -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"
)

"%BUILD_TOOLS%\apksigner.bat" sign --ks "%USERPROFILE%\.android\debug.keystore" --ks-pass pass:android --key-pass pass:android --out "%FINAL_APK%" "%ALIGNED_APK%"
if errorlevel 1 (echo Signing failed & exit /b 1)

echo.
echo === BUILD SUCCESS ===
echo APK: %FINAL_APK%
