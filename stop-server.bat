@echo off
ECHO Stopping all Server Sentinel processes...

ECHO.
ECHO Stopping Next.js application (node.exe)...
taskkill /F /IM node.exe /T > nul 2>&1

ECHO Stopping Genkit service window...
taskkill /F /IM cmd.exe /FI "WINDOWTITLE eq Genkit" > nul 2>&1

ECHO Stopping Ollama service window...
taskkill /F /IM cmd.exe /FI "WINDOWTITLE eq Ollama" > nul 2>&1

ECHO.
ECHO All processes have been terminated.
pause
