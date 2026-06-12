@echo off
title Backend Server - Dormitory Management
color 0A
echo ========================================
echo STARTING BACKEND SERVER
echo ========================================
echo.
echo Location: backend/
echo Port: 8080
echo.
echo Please wait...
echo.

cd /d "%~dp0backend"
call mvn spring-boot:run

pause
