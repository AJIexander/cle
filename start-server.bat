@echo off
:: Change the current directory to the one where this script is located.
:: This ensures that all npm commands run in the correct project root.
cd /d "%~dp0"

ECHO Starting Ollama Server...
:: We assume Ollama is installed and in the system's PATH.
:: This will run llama3 and keep it available. The window will stay open for logs.
start "Ollama" cmd /k "ollama run llama3"

ECHO Starting Genkit Service...
:: This starts the Genkit layer that connects the app to Ollama. The window will stay open for logs.
start "Genkit" cmd /k "npm run genkit:start"

ECHO Starting Next.js Web App...
:: This starts the main application server.
call npm run start

pause
