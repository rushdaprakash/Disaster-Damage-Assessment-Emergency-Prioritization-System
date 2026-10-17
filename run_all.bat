@echo off
title AegisDisaster AI Launcher
echo ========================================================
echo  Launching AegisDisaster AI Platform
echo ========================================================
echo [1/2] Starting Backend in a separate window...
start "AegisDisaster - Backend" cmd /k "cd /d "%~dp0" && python -m uvicorn backend.app.main:app --reload --port 8000"

echo [2/2] Waiting 3 seconds before starting Frontend...
timeout /t 3 /nobreak >nul

echo Starting Frontend in a separate window...
start "AegisDisaster - Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo ========================================================
echo  Both services launched!
echo  - Backend API:    http://localhost:8000
echo  - Swagger Docs:   http://localhost:8000/docs
echo  - Frontend UI:    http://localhost:3000
echo ========================================================
pause
