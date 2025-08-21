# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MathSolve AI is a comprehensive AI-powered mathematics learning and problem-solving platform that combines intelligent tutoring, community collaboration, and gamified learning experiences. The platform is designed as a monorepo with multiple applications and shared packages.

## Development Commands

### Frontend (apps/api - Next.js)
```bash
cd apps/api
npm run dev          # Start development server with Turbopack
npm run build        # Build for production with Turbopack
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Backend (apps/api - Express.js - Not Yet Implemented)
```bash
cd apps/api
npm run dev          # Start development server with nodemon
npm run build        # Compile TypeScript
npm run start        # Start production server
npm test             # Run Jest tests
npm run db:migrate   # Run Prisma migrations
npm run db:seed      # Seed database with test data
npm run db:studio    # Open Prisma Studio
```

### MCP Server (apps/mcp-server - Not Yet Implemented)
```bash
cd apps/mcp-server
npm run dev          # Start MCP server in development
npm run build        # Build MCP server
npm run start        # Start production MCP server
```

### Testing
- No test framework currently configured
- Future implementation will use Jest for backend and frontend testing

## Architecture

### High-Level Structure
The project follows a monorepo architecture with apps and shared packages:

- **apps/api**: Next.js frontend application (currently the only implemented app)
- **apps/web**: Future Next.js frontend (planned)
- **apps/mcp-server**: Future MCP (Model Context Protocol) server for AI intelligence
- **packages/**: Shared utilities, UI components, and database schemas (planned)

### Technology Stack
- **Frontend**: Next.js 15 with App Router, React 19, TypeScript, Tailwind CSS v4
- **Backend**: Planned Express.js with TypeScript, Prisma ORM, SQLite/PostgreSQL
- **AI Integration**: OpenAI/Claude API for math problem solving
- **MCP Server**: Custom server for intelligent problem matching and recommendations
- **Deployment**: Docker containers, production-ready configuration planned

### Current State
The project is in early development phase with only the Next.js frontend partially implemented. The codebase structure follows the detailed specifications in PRD.md and structure.md.

### Key Features (Planned)
- AI-powered math problem solving with step-by-step explanations
- Community problem sharing and discussion
- Gamified ranking system with XP and achievements
- Personalized learning recommendations via MCP server
- Multiple math categories from basic arithmetic to advanced calculus

## Development Guidelines

### AI Agent Workflow
This project is designed to work with a specific AI agent collaboration pattern:
- **Terminal 1 (Algo)**: Developer agent for Next.js/Strapi implementation
- **Terminal 2 (Kairo)**: Senior engineer agent for code review and architecture
- Communication between agents happens through structured files (todo.md, improvement.md)

### File Structure
- Follow the detailed structure outlined in `structure.md`
- Use TypeScript throughout the project
- Implement proper error boundaries and loading states
- Follow Next.js App Router conventions

### Database Design
- Prisma ORM with SQLite for development, PostgreSQL for production
- Complete schema defined in structure.md with models for users, problems, solutions, resources
- Includes gamification elements (achievements, rankings, streaks)

### Environment Setup
- Copy environment variables from structure.md examples
- Configure AI API keys (OpenAI, Claude, Wolfram Alpha)
- Setup database connections and caching (Redis optional for development)

## Important Notes

- This is a defensive security project - only assist with defensive security tasks
- The project includes comprehensive gamification and AI features
- MCP server integration is planned for intelligent problem recommendations
- Multi-app architecture supports future mobile and web applications
- Development follows structured 16-week implementation plan outlined in Todo.md