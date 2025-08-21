# MathSolve AI - Project Overview

## Purpose
MathSolve AI is a comprehensive AI-powered mathematics learning and problem-solving platform that combines intelligent tutoring, community collaboration, and gamified learning experiences.

## Target Users
- **Primary**: Students (middle school through university)
- **Secondary**: Educators, math enthusiasts, competitive math participants  
- **Tertiary**: Parents and tutors seeking learning resources

## Core Features
- AI-powered math problem solving with step-by-step explanations
- Community problem sharing and discussion
- Gamified ranking system with XP and achievements
- Personalized learning recommendations via MCP server
- Multiple math categories from basic arithmetic to advanced calculus

## Tech Stack
- **Frontend**: Next.js 15 with App Router, React 19, TypeScript, Tailwind CSS v4
- **Backend**: Express.js with TypeScript, Prisma ORM, SQLite/PostgreSQL (planned)
- **AI Integration**: OpenAI/Claude API for math problem solving
- **MCP Server**: Custom server for intelligent problem matching and recommendations
- **Deployment**: Docker containers, production-ready configuration planned

## Architecture
The project follows a monorepo architecture:
- **apps/web**: Next.js frontend application (currently implemented)
- **apps/backend**: Express.js backend API (planned)
- **apps/mcp-server**: MCP server for AI intelligence (planned)
- **packages/**: Shared utilities, UI components, and database schemas (planned)

## Current State
Early development phase with only the Next.js frontend partially implemented using default Next.js template. Project structure follows detailed specifications in PRD.md and structure.md.