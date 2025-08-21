@echo off
REM Development Setup Script for MathSolve AI (Windows)
REM This script sets up the development environment

echo 🚀 Setting up MathSolve AI development environment...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ and try again.
    exit /b 1
)

echo ✅ Node.js version:
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm and try again.
    exit /b 1
)

echo ✅ npm version:
npm --version

REM Install dependencies for all apps
echo 📦 Installing dependencies...

echo   📱 Installing web app dependencies...
cd apps\web
call npm install --legacy-peer-deps
cd ..\..

echo   🚀 Installing backend dependencies...
cd apps\backend
call npm install
cd ..\..

echo   🔗 Installing MCP server dependencies...
cd apps\mcp-server
call npm install
cd ..\..

REM Setup database
echo 🗃️  Setting up database...
cd apps\backend

REM Generate Prisma client
echo   📝 Generating Prisma client...
call npx prisma generate

REM Run database migrations
echo   🔄 Running database migrations...
call npx prisma migrate dev --name init

REM Seed the database
echo   🌱 Seeding database with sample data...
call npx prisma db seed

cd ..\..

REM Create necessary directories
echo 📁 Creating necessary directories...
if not exist "data\backend" mkdir data\backend
if not exist "data\mcp" mkdir data\mcp
if not exist "logs" mkdir logs

REM Copy environment files if they don't exist
echo ⚙️  Setting up environment files...

if not exist "apps\backend\.env" (
    echo   📝 Creating backend .env file...
    copy "apps\backend\.env.example" "apps\backend\.env" >nul
    echo   ⚠️  Please update apps\backend\.env with your API keys
)

if not exist "apps\mcp-server\.env" (
    echo   📝 Creating MCP server .env file...
    copy "apps\mcp-server\.env.example" "apps\mcp-server\.env" >nul
    echo   ⚠️  Please update apps\mcp-server\.env with your API keys
)

echo.
echo ✅ Development environment setup complete!
echo.
echo 🏃 To start developing:
echo   1. Update API keys in .env files
echo   2. Run 'npm run dev:web' to start the web app
echo   3. Run 'npm run dev:api' to start the backend API (in another terminal)
echo   4. Run 'npm run dev:mcp' to start the MCP server (in another terminal)
echo.
echo 🔗 URLs:
echo   📱 Web App: http://localhost:3000
echo   🚀 API: http://localhost:5000
echo   🔗 MCP Server: ws://localhost:5001
echo   🗃️  Database Studio: Run 'npm run db:studio' in apps\backend\
echo.
echo 📚 For more information, check the README.md file

pause