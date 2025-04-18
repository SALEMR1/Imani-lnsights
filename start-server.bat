@echo off
echo Starting local web server for Basaer Imaniya website...
echo.
echo Please open your browser and navigate to: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server when done.
echo.

python -m http.server 8000

pause
