@echo off
title AegisDisaster - Backend (Port 8000)
echo ===================================================
echo Starting AegisDisaster AI Backend (FastAPI)
echo URL: http://localhost:8000
echo Docs: http://localhost:8000/docs
echo ===================================================
python -m uvicorn backend.app.main:app --reload --port 8000
pause
