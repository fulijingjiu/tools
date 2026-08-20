@echo off
setlocal
set "ROOT=%~dp0"
cd /d "%ROOT%"

if not exist "node_modules" (
  echo [info] node_modules not found, running npm install...
  call npm install
)

echo [info] Starting my-tools-web dev server...
start "my-tools-web-dev" cmd /k "cd /d "%ROOT%" && npm run dev"

echo [info] Waiting for server start...
timeout /t 2 /nobreak >nul
start "" "http://localhost:5173/"

endlocal
