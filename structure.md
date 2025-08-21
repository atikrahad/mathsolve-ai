

## Repository Structure

```
mathsolve-ai/
├── apps/
│   ├── web/                    # Next.js Frontend Application
│   ├── api/                    # Express.js Backend API
│   └── mcp-server/             # MCP Server for AI Intelligence
├── packages/
│   ├── shared/                 # Shared utilities and types
│   ├── ui/                     # Shared UI components
│   └── database/               # Database schemas and migrations
├── docs/                       # Documentation
├── scripts/                    # Build and deployment scripts
└── docker/                     # Docker configurations
```

## Frontend Structure (apps/web)

```
apps/web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication pages group
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── reset-password/
│   │   ├── (dashboard)/       # Protected dashboard pages
│   │   │   ├── dashboard/
│   │   │   ├── problems/
│   │   │   ├── profile/
│   │   │   ├── rankings/
│   │   │   └── resources/
│   │   ├── api/               # API route handlers
│   │   │   └── auth/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                # Shadcn UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── layout/            # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Navigation.tsx
│   │   ├── problems/          # Problem-related components
│   │   │   ├── ProblemCard.tsx
│   │   │   ├── ProblemEditor.tsx
│   │   │   ├── ProblemViewer.tsx
│   │   │   ├── SolutionDisplay.tsx
│   │   │   └── MathInput.tsx
│   │   ├── user/              # User-related components
│   │   │   ├── ProfileCard.tsx
│   │   │   ├── RankBadge.tsx
│   │   │   ├── AchievementList.tsx
│   │   │   └── StatsDisplay.tsx
│   │   ├── ai/                # AI-related components
│   │   │   ├── SolutionGenerator.tsx
│   │   │   ├── HintDisplay.tsx
│   │   │   └── StepByStep.tsx
│   │   └── common/            # Common components
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── SEO.tsx
│   │       └── ThemeToggle.tsx
│   ├── services/              # API service layer
│   │   ├── api.config.ts      # Axios/Fetch configuration
│   │   ├── auth.service.ts    # Authentication API calls
│   │   ├── problem.service.ts # Problem-related API calls
│   │   ├── user.service.ts    # User-related API calls
│   │   ├── solution.service.ts # Solution API calls
│   │   ├── ranking.service.ts # Ranking API calls
│   │   ├── resource.service.ts # Resource API calls
│   │   ├── ai.service.ts      # AI-related API calls
│   │   └── websocket.service.ts # WebSocket connection
│   ├── store/                 # Zustand state management
│   │   ├── slices/
│   │   │   ├── authSlice.ts   # Authentication state
│   │   │   ├── userSlice.ts   # User profile state
│   │   │   ├── problemSlice.ts # Problems state
│   │   │   ├── solutionSlice.ts # Solutions state
│   │   │   └── uiSlice.ts     # UI state (theme, modals, etc)
│   │   └── useStore.ts        # Combined store
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.ts         # Auth hook using store
│   │   ├── useProblem.ts      # Problem operations
│   │   ├── useWebSocket.ts    # WebSocket connection
│   │   ├── useDebounce.ts     # Debounce hook
│   │   ├── usePagination.ts   # Pagination hook
│   │   └── useTheme.ts        # Theme management
│   ├── lib/
│   │   ├── utils/             # Utility functions
│   │   │   ├── math.ts        # Math helpers
│   │   │   ├── format.ts      # Formatting utilities
│   │   │   ├── validation.ts  # Validation helpers
│   │   │   ├── constants.ts   # App constants
│   │   │   └── errors.ts      # Error handling
│   │   └── config/            # Configuration files
│   │       ├── site.ts        # Site metadata
│   │       ├── routes.ts      # Route definitions
│   │       └── mathjax.ts     # MathJax configuration
│   ├── styles/
│   │   └── globals.css
│   └── types/
│       ├── index.ts
│       ├── problem.ts
│       ├── user.ts
│       └── api.ts
├── public/
│   ├── images/
│   ├── fonts/
│   └── icons/
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json

## Database Structure (packages/database)

```
packages/database/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed/
│       ├── data/
│       │   ├── problems.json
│       │   ├── users.json
│       │   └── resources.json
│       └── seed.ts
├── src/
│   ├── client.ts
│   └── types.ts
├── tsconfig.json
└── package.json
```

## Prisma Schema (prisma/schema.prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite" // Change to "postgresql" for production
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  username      String    @unique
  email         String    @unique
  passwordHash  String    @map("password_hash")
  profileImage  String?   @map("profile_image")
  bio           String?
  rankPoints    Int       @default(0) @map("rank_points")
  currentRank   String    @default("Bronze") @map("current_rank")
  streakCount   Int       @default(0) @map("streak_count")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  lastActiveAt  DateTime? @map("last_active_at")

  // Relations
  problems      Problem[]
  solutions     Solution[]
  resources     Resource[]
  comments      Comment[]
  achievements  Achievement[]
  ratings       ProblemRating[]
  bookmarks     Bookmark[]
  followers     UserFollow[] @relation("UserFollowers")
  following     UserFollow[] @relation("UserFollowing")

  @@map("users")
}

model Problem {
  id           String   @id @default(cuid())
  creatorId    String   @map("creator_id")
  title        String
  description  String
  difficulty   Difficulty
  category     String
  tags         Json     // Array of strings
  solution     String?
  qualityScore Float    @default(0) @map("quality_score")
  viewCount    Int      @default(0) @map("view_count")
  attemptCount Int      @default(0) @map("attempt_count")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  // Relations
  creator      User      @relation(fields: [creatorId], references: [id])
  solutions    Solution[]
  comments     Comment[]
  ratings      ProblemRating[]
  bookmarks    Bookmark[]

  @@index([category])
  @@index([difficulty])
  @@index([creatorId])
  @@map("problems")
}

model Solution {
  id          String   @id @default(cuid())
  problemId   String   @map("problem_id")
  userId      String   @map("user_id")
  answer      String
  isCorrect   Boolean  @default(false) @map("is_correct")
  pointsEarned Int     @default(0) @map("points_earned")
  timeSpent   Int?     @map("time_spent") // in seconds
  hintsUsed   Int      @default(0) @map("hints_used")
  submittedAt DateTime @default(now()) @map("submitted_at")

  // Relations
  problem     Problem  @relation(fields: [problemId], references: [id])
  user        User     @relation(fields: [userId], references: [id])

  @@unique([problemId, userId])
  @@index([userId])
  @@index([problemId])
  @@map("solutions")
}

model Resource {
  id         String       @id @default(cuid())
  title      String
  content    String
  type       ResourceType
  category   String
  difficulty String?
  authorId   String       @map("author_id")
  viewCount  Int          @default(0) @map("view_count")
  rating     Float        @default(0)
  createdAt  DateTime     @default(now()) @map("created_at")
  updatedAt  DateTime     @updatedAt @map("updated_at")

  // Relations
  author     User         @relation(fields: [authorId], references: [id])
  bookmarks  Bookmark[]

  @@index([category])
  @@index([authorId])
  @@map("resources")
}

model Comment {
  id        String   @id @default(cuid())
  problemId String   @map("problem_id")
  userId    String   @map("user_id")
  content   String
  parentId  String?  @map("parent_id")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // Relations
  problem   Problem  @relation(fields: [problemId], references: [id])
  user      User     @relation(fields: [userId], references: [id])
  parent    Comment? @relation("CommentReplies", fields: [parentId], references: [id])
  replies   Comment[] @relation("CommentReplies")

  @@index([problemId])
  @@index([userId])
  @@map("comments")
}

model Achievement {
  id          String   @id @default(cuid())
  userId      String   @map("user_id")
  type        String
  name        String
  description String?
  earnedAt    DateTime @default(now()) @map("earned_at")

  // Relations
  user        User     @relation(fields: [userId], references: [id])

  @@index([userId])
  @@map("achievements")
}

model UserFollow {
  followerId  String   @map("follower_id")
  followingId String   @map("following_id")
  createdAt   DateTime @default(now()) @map("created_at")

  // Relations
  follower    User     @relation("UserFollowers", fields: [followerId], references: [id])
  following   User     @relation("UserFollowing", fields: [followingId], references: [id])

  @@id([followerId, followingId])
  @@map("user_follows")
}

model ProblemRating {
  problemId String   @map("problem_id")
  userId    String   @map("user_id")
  rating    Int      // 1-5
  createdAt DateTime @default(now()) @map("created_at")

  // Relations
  problem   Problem  @relation(fields: [problemId], references: [id])
  user      User     @relation(fields: [userId], references: [id])

  @@id([problemId, userId])
  @@map("problem_ratings")
}

model Bookmark {
  id         String   @id @default(cuid())
  userId     String   @map("user_id")
  problemId  String?  @map("problem_id")
  resourceId String?  @map("resource_id")
  createdAt  DateTime @default(now()) @map("created_at")

  // Relations
  user       User      @relation(fields: [userId], references: [id])
  problem    Problem?  @relation(fields: [problemId], references: [id])
  resource   Resource? @relation(fields: [resourceId], references: [id])

  @@index([userId])
  @@map("bookmarks")
}

// Enums
enum Difficulty {
  LOW
  MEDIUM
  HIGH
}

enum ResourceType {
  TUTORIAL
  GUIDE
  REFERENCE
}
```

## Environment Variables

### Frontend (.env.local)
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_WS_URL=ws://localhost:5001

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Public Keys
NEXT_PUBLIC_MATHJAX_URL=https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js
```

### Backend (.env)
```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="file:./dev.db"  # SQLite for development
# DATABASE_URL="postgresql://user:password@localhost:5432/mathsolve"  # PostgreSQL for production

# Authentication
JWT_SECRET=your-jwt-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# AI Services
OPENAI_API_KEY=your-openai-api-key
CLAUDE_API_KEY=your-claude-api-key
WOLFRAM_APP_ID=your-wolfram-app-id

# Redis (optional for development)
REDIS_URL=redis://localhost:6379

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

### MCP Server (.env)
```bash
# Server Configuration
MCP_PORT=5001
NODE_ENV=development

# Database Connection
DATABASE_URL="file:../api/dev.db"  # Shared with API

# AI Configuration
EMBEDDING_MODEL=text-embedding-ada-002
OPENAI_API_KEY=your-openai-api-key

# Cache Configuration
REDIS_URL=redis://localhost:6379
CACHE_TTL=3600
```

## Package.json Scripts

### Root package.json
```json
{
  "name": "mathsolve-ai",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "dev:web": "turbo run dev --filter=web",
    "dev:api": "turbo run dev --filter=api",
    "dev:mcp": "turbo run dev --filter=mcp-server",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "db:migrate": "turbo run db:migrate",
    "db:seed": "turbo run db:seed",
    "db:studio": "turbo run db:studio"
  },
  "devDependencies": {
    "turbo": "latest",
    "prettier": "latest",
    "eslint": "latest"
  }
}
```

### Frontend package.json (apps/web)
```json
{
  "name": "web",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "react-dom": "18.x",
    "@tanstack/react-query": "^5.x",
    "zustand": "^4.x",
    "next-auth": "^4.x",
    "tailwindcss": "^3.x",
    "@radix-ui/react-*": "latest",
    "mathjax": "^3.x",
    "framer-motion": "^10.x",
    "react-hook-form": "^7.x",
    "zod": "^3.x"
  }
}
```

### Backend package.json (apps/api)
```json
{
  "name": "api",
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest",
    "db:migrate": "prisma migrate dev",
    "db:seed": "ts-node prisma/seed.ts",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "express": "^4.x",
    "@prisma/client": "^5.x",
    "bcryptjs": "^2.x",
    "jsonwebtoken": "^9.x",
    "cors": "^2.x",
    "helmet": "^7.x",
    "express-rate-limit": "^6.x",
    "winston": "^3.x",
    "joi": "^17.x",
    "openai": "^4.x",
    "@anthropic-ai/sdk": "latest",
    "socket.io": "^4.x"
  },
  "devDependencies": {
    "@types/express": "^4.x",
    "prisma": "^5.x",
    "nodemon": "^3.x",
    "ts-node": "^10.x",
    "typescript": "^5.x"
  }
}
```

### MCP Server package.json
```json
{
  "name": "mcp-server",
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest"
  },
  "dependencies": {
    "ws": "^8.x",
    "@prisma/client": "^5.x",
    "openai": "^4.x",
    "ioredis": "^5.x",
    "ml-distance": "^4.x",
    "mathjs": "^11.x"
  }
}
```

## Docker Configuration

### docker-compose.yml
```yaml
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: ./docker/Dockerfile.web
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://api:5000/api
    depends_on:
      - api

  api:
    build:
      context: .
      dockerfile: ./docker/Dockerfile.api
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=file:./dev.db
    volumes:
      - ./data:/app/data

  mcp:
    build:
      context: .
      dockerfile: ./docker/Dockerfile.mcp
    ports:
      - "5001:5001"
    depends_on:
      - api

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

## Git Structure

### .gitignore
```
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/
.nyc_output

# Production
dist/
build/
.next/
out/

# Database
*.db
*.db-journal
prisma/migrations/dev/

# Environment
.env
.env.local
.env.production

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Cache
.turbo
.cache
```
```

## Backend Structure (apps/api)

```
apps/api/
├── prisma/
│   ├── schema.prisma          # Prisma schema definition
│   ├── migrations/            # Database migrations
│   ├── seed/                  # Seed data
│   │   ├── data/
│   │   │   ├── problems.json
│   │   │   ├── users.json
│   │   │   └── resources.json
│   │   └── seed.ts
│   └── client.ts              # Prisma client singleton
├── src/
│   ├── config/
│   │   ├── database.ts        # Prisma client configuration
│   │   ├── redis.ts           # Redis configuration
│   │   ├── logger.ts          # Winston logger setup
│   │   ├── cors.ts            # CORS configuration
│   │   └── constants.ts       # Application constants
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── problem.controller.ts
│   │   ├── solution.controller.ts
│   │   ├── ranking.controller.ts
│   │   ├── resource.controller.ts
│   │   └── ai.controller.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts  # JWT authentication
│   │   ├── validate.middleware.ts # Request validation
│   │   ├── error.middleware.ts # Error handling
│   │   ├── rateLimit.middleware.ts # Rate limiting
│   │   └── logger.middleware.ts # Request logging
│   ├── routes/
│   │   ├── index.ts
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── problem.routes.ts
│   │   ├── solution.routes.ts
│   │   ├── ranking.routes.ts
│   │   ├── resource.routes.ts
│   │   └── ai.routes.ts
│   ├── services/
│   │   ├── auth.service.ts    # Auth business logic
│   │   ├── user.service.ts    # User operations
│   │   ├── problem.service.ts # Problem CRUD with Prisma
│   │   ├── solution.service.ts # Solution handling
│   │   ├── ranking.service.ts # Ranking calculations
│   │   ├── ai.service.ts      # AI integration
│   │   ├── email.service.ts   # Email notifications
│   │   └── cache.service.ts   # Redis caching
│   ├── repositories/          # Data access layer
│   │   ├── user.repository.ts
│   │   ├── problem.repository.ts
│   │   ├── solution.repository.ts
│   │   └── resource.repository.ts
│   ├── utils/
│   │   ├── validators/
│   │   │   ├── auth.validator.ts
│   │   │   ├── problem.validator.ts
│   │   │   └── user.validator.ts
│   │   ├── helpers/
│   │   │   ├── password.helper.ts
│   │   │   ├── token.helper.ts
│   │   │   ├── xp.calculator.ts
│   │   │   └── quality.scorer.ts
│   │   └── errors/
│   │       ├── ApiError.ts
│   │       ├── ValidationError.ts
│   │       └── errorTypes.ts
│   ├── types/
│   │   ├── express.d.ts      # Express type extensions
│   │   ├── request.types.ts  # Request interfaces
│   │   └── response.types.ts # Response interfaces
│   ├── integrations/
│   │   ├── openai/
│   │   │   ├── client.ts
│   │   │   └── prompts.ts
│   │   ├── claude/
│   │   │   ├── client.ts
│   │   │   └── prompts.ts
│   │   └── wolfram/
│   │       └── client.ts
│   ├── websocket/
│   │   ├── socketServer.ts
│   │   └── handlers.ts
│   ├── app.ts                 # Express app setup
│   └── server.ts              # Server entry point
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── .env
├── .env.example
├── tsconfig.json
├── jest.config.js
└── package.json
```

## MCP Server Structure (apps/mcp-server)

```
apps/mcp-server/
├── src/
│   ├── config/
│   │   ├── server.ts          # Server configuration
│   │   ├── ai.ts              # AI model configuration
│   │   └── database.ts        # Database connection
│   ├── core/
│   │   ├── engine/
│   │   │   ├── ProblemMatcher.ts
│   │   │   ├── SkillAnalyzer.ts
│   │   │   ├── RecommendationEngine.ts
│   │   │   └── LearningPathGenerator.ts
│   │   ├── models/
│   │   │   ├── UserSkillModel.ts
│   │   │   ├── ProblemEmbedding.ts
│   │   │   └── SimilarityModel.ts
│   │   └── algorithms/
│   │       ├── similarity.ts
│   │       ├── clustering.ts
│   │       └── ranking.ts
│   ├── services/
│   │   ├── EmbeddingService.ts
│   │   ├── AnalysisService.ts
│   │   ├── RecommendationService.ts
│   │   └── CacheService.ts
│   ├── handlers/
│   │   ├── connectionHandler.ts
│   │   ├── analysisHandler.ts
│   │   ├── recommendationHandler.ts
│   │   └── messageHandler.ts
│   ├── utils/
│   │   ├── vectorStore.ts
│   │   ├── mathParser.ts
│   │   └── logger.ts
│   ├── types/
│   │   ├── messages.ts
│   │   ├── models.ts
│   │   └── responses.ts
│   ├── index.ts               # Entry point
│   └── server.ts              # MCP server setup
├── tests/
├── .env
├── tsconfig.json
└── package.json