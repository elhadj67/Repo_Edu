
@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

echo ==============================
echo Edu-Live Deployment Script
echo ==============================

:: Vérification Node.js
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Node.js non trouvé ! Installez Node.js 20+.
    pause
    exit /b
)

echo Node.js OK

:: Vérification pnpm
pnpm -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo pnpm non trouvé ! Installation...
    npm install -g pnpm
)

echo pnpm OK

:: Build API
cd apps\api
echo Building API...
pnpm install
pnpm build
cd ..\..

:: Build Frontend
cd apps\web
echo Building Frontend...
pnpm install
pnpm build
cd ..\..

:: Lancer Docker
echo Lancement de Docker Compose...
docker-compose up -d --build

echo =================================
echo Deployment terminé !
echo API: http://localhost:4000
echo Front: http://localhost:3000
pause
