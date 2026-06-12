@echo off
title Frontend Server - Dormitory Management
color 0B
echo ========================================
echo STARTING FRONTEND SERVER
echo ========================================
echo.
echo Location: root/
echo Port: 3000
echo.
echo Please wait...
echo.

cd /d "%~dp0"
call npm start

pause
