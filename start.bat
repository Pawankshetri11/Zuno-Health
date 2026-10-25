@echo off
setlocal

echo ==========================================
echo   Zuno - Database Setup + Start Servers
echo ==========================================
echo.

REM Run PowerShell script and exit immediately - servers run in separate windows
powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0start.ps1" -SkipDb
exit /b 0