@echo off
echo ========================================
echo DORMITORY MANAGEMENT - AUTO START
echo ========================================
echo.

echo [1/3] Checking MySQL...
sc query MySQL80 | find "RUNNING" >nul
if %errorlevel%==0 (
    echo ✅ MySQL is running
) else (
    echo ❌ MySQL is not running. Starting MySQL...
    net start MySQL80
)
echo.

echo [2/3] Starting Backend...
start "Backend Server" cmd /k "cd /d %~dp0backend && mvn spring-boot:run"
echo ✅ Backend starting in new window...
echo ⏳ Waiting 30 seconds for backend to start...
timeout /t 30 /nobreak
echo.

echo [3/3] Starting Frontend...
start "Frontend Server" cmd /k "cd /d %~dp0 && npm start"
echo ✅ Frontend starting in new window...
echo.

echo ========================================
echo 🎉 PROJECT STARTED!
echo ========================================
echo.
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo.
echo 🔐 Login credentials:
echo    Username: admin
echo    Password: 123456123456
echo.
echo Press any key to exit this window...
pause >nul
