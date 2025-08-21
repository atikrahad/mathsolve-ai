#!/bin/bash

# Development Start Script for MathSolve AI
# This script starts all development servers concurrently

set -e

echo "🚀 Starting MathSolve AI development servers..."

# Check if concurrently is installed globally
if ! command -v concurrently &> /dev/null; then
    echo "📦 Installing concurrently globally..."
    npm install -g concurrently
fi

# Start all services concurrently
concurrently \
  --prefix-colors "cyan,magenta,yellow" \
  --names "WEB,API,MCP" \
  "cd apps/web && npm run dev" \
  "cd apps/backend && npm run dev" \
  "cd apps/mcp-server && npm run dev"