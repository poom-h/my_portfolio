@echo off
title Poom — Admin Panel
cd /d "%~dp0"

echo.
echo  ==========================================
echo    Poom Portfolio  ^|  Admin Panel
echo  ==========================================
echo.
echo  Starting server in admin mode...
echo  Browser will open when ready.
echo.

:: Force admin mode in .env.local
powershell -Command "(Get-Content .env.local) -replace '^NEXT_PUBLIC_INTERFACE=.*','NEXT_PUBLIC_INTERFACE=admin' | Set-Content .env.local"
echo  .env.local set to admin mode.

:: Start Next.js dev server in a new window
start "Poom Admin Server" cmd /k "npm run dev"

:: Poll until the server responds (max 60s)
set /a attempts=0
:wait
set /a attempts+=1
if %attempts% gtr 30 goto timeout
timeout /t 2 /nobreak >nul
curl -s -o nul -w "%%{http_code}" http://localhost:3000 | findstr /r "^[23]" >nul 2>&1
if errorlevel 1 (
  echo  Waiting... [%attempts%/30]
  goto wait
)

:ready
echo.
echo  Server ready! Opening http://localhost:3000/dashboard
echo.
start "" "http://localhost:3000/dashboard"
goto end

:timeout
echo.
echo  Server is taking longer than usual — opening browser anyway...
echo.
start "" "http://localhost:3000/dashboard"

:end
echo  Admin panel is running.
echo  Close the "Poom Admin Server" window to stop the server.
echo.
pause
