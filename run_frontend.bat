@echo off
title AegisDisaster - Frontend (Port 3000)
echo ===================================================
echo Starting AegisDisaster AI Frontend (React + Vite)
echo URL: http://localhost:3000
echo ===================================================
cd /d "%~dp0frontend"
npm run dev
pause
