@echo off
title The End of Computation - Unified Theoretical Physics
cd /d "%~dp0"

echo ========================================================
echo   Starting The End of Computation Web Application
echo ========================================================
echo.

if not exist "node_modules\" (
    echo [INFO] Installing required dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] npm install failed. Please check your Node.js installation.
        pause
        exit /b %errorlevel%
    )
)

echo [INFO] Launching Vite development server...
echo [INFO] App will open in your default browser.
echo.

start "" http://localhost:5173
call npm run dev -- --host --port 5173

pause
