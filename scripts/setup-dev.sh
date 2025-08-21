#!/bin/bash

# Development Setup Script for MathSolve AI
# This script sets up the development environment

set -e

echo "🚀 Setting up MathSolve AI development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Install dependencies for all apps
echo "📦 Installing dependencies..."

echo "  📱 Installing web app dependencies..."
cd apps/web
npm install --legacy-peer-deps
cd ../..

echo "  🚀 Installing backend dependencies..."
cd apps/backend
npm install
cd ../..

echo "  🔗 Installing MCP server dependencies..."
cd apps/mcp-server
npm install
cd ../..

# Setup database
echo "🗃️  Setting up database..."
cd apps/backend

# Generate Prisma client
echo "  📝 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "  🔄 Running database migrations..."
npx prisma migrate dev --name init

# Seed the database
echo "  🌱 Seeding database with sample data..."
npx prisma db seed

cd ../..

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p data/backend data/mcp logs

# Copy environment files if they don't exist
echo "⚙️  Setting up environment files..."

if [ ! -f apps/backend/.env ]; then
    echo "  📝 Creating backend .env file..."
    cp apps/backend/.env.example apps/backend/.env
    echo "  ⚠️  Please update apps/backend/.env with your API keys"
fi

if [ ! -f apps/mcp-server/.env ]; then
    echo "  📝 Creating MCP server .env file..."
    cp apps/mcp-server/.env.example apps/mcp-server/.env
    echo "  ⚠️  Please update apps/mcp-server/.env with your API keys"
fi

echo ""
echo "✅ Development environment setup complete!"
echo ""
echo "🏃 To start developing:"
echo "  1. Update API keys in .env files"
echo "  2. Run 'npm run dev:web' to start the web app"
echo "  3. Run 'npm run dev:api' to start the backend API (in another terminal)"
echo "  4. Run 'npm run dev:mcp' to start the MCP server (in another terminal)"
echo ""
echo "🔗 URLs:"
echo "  📱 Web App: http://localhost:3000"
echo "  🚀 API: http://localhost:5000"
echo "  🔗 MCP Server: ws://localhost:5001"
echo "  🗃️  Database Studio: Run 'npm run db:studio' in apps/backend/"
echo ""
echo "📚 For more information, check the README.md file"