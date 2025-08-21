# Codebase Structure

## Current Directory Structure
```
mathsolve-ai/
├── apps/
│   ├── web/                    # Next.js Frontend (IMPLEMENTED)
│   │   ├── src/
│   │   │   ├── app/           # Next.js App Router
│   │   │   │   ├── layout.tsx # Root layout with fonts
│   │   │   │   ├── page.tsx   # Home page
│   │   │   │   ├── globals.css # Global styles
│   │   │   │   └── favicon.ico
│   │   │   └── (future structure from structure.md)
│   │   ├── public/            # Static assets
│   │   ├── package.json       # Dependencies and scripts
│   │   ├── next.config.ts     # Next.js configuration
│   │   ├── postcss.config.mjs # PostCSS for Tailwind
│   │   ├── tsconfig.json      # TypeScript config
│   │   └── eslint.config.mjs  # ESLint configuration
│   ├── backend/               # Express.js Backend (PLANNED)
│   └── mcp-server/            # MCP Server (PLANNED)
├── packages/                  # Shared packages (PLANNED)
│   ├── shared/               # Shared utilities and types
│   ├── ui/                   # Shared UI components  
│   └── database/             # Database schemas and migrations
├── docs/                     # Documentation
├── scripts/                  # Build and deployment scripts
├── docker/                   # Docker configurations
├── CLAUDE.md                 # Claude Code instructions
├── PRD.md                    # Product Requirements Document
├── structure.md              # Detailed structure specification
├── Todo.md                   # Development task list
└── README.md                 # Project documentation
```

## Key Configuration Files

### Frontend (apps/web)
- **package.json**: Next.js 15, React 19, TypeScript 5, Tailwind CSS v4
- **next.config.ts**: Next.js configuration with Turbopack
- **postcss.config.mjs**: PostCSS configuration for Tailwind
- **eslint.config.mjs**: ESLint rules for Next.js
- **tsconfig.json**: TypeScript configuration

### Current Implementation Status
- ✅ Basic Next.js app with TypeScript
- ✅ Tailwind CSS v4 configured  
- ✅ ESLint and development scripts
- ❌ Custom components not yet implemented
- ❌ Backend API not implemented
- ❌ MCP server not implemented
- ❌ Database not implemented
- ❌ Shared packages not implemented

## Planned Structure (from structure.md)
The structure.md file contains detailed specifications for:
- Complete frontend component structure
- Backend API structure with Express.js
- Database schema with Prisma
- MCP server architecture
- Shared packages organization
- Docker configurations
- Environment variable setup