@echo off
setlocal
cd /d "%~dp0"

echo [1/2] Checking build artifacts...

echo [1/2] Building artifacts with Maven Wrapper...

call .\mvnw.cmd clean package -DskipTests
if errorlevel 1 (
    echo [ERROR] Build failed. Please check your Java version (JDK 17+) and environment.
    pause
    exit /b 1
)

echo.
echo [2/2] Starting Smart Campus Backend...
echo.

REM Try to find java.exe
set "JAVA_EXE=java"
if defined JAVA_HOME (
    set "JAVA_EXE=%JAVA_HOME%\bin\java.exe"
)

"%JAVA_EXE%" -jar "target\smartcampus-1.0.0.jar"

if errorlevel 1 (
    echo.
    echo [ERROR] Application crashed or port 8080 is already in use.
    echo Make sure node server.js is NOT running on the same port.
    pause
)
endlocal
