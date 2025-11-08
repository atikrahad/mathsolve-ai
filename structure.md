## Repository Structure – Programming Challenge Platform

```
mathsolve-ai/
├── apps/
│   ├── web/          # Next.js 14 frontend with IDE + dashboards
│   ├── backend/      # Express/Prisma API + submission pipeline
│   └── mcp-server/   # MCP/AI microservice (recommendations, hints)
├── scripts/          # Setup, seeding, automation helpers
├── docker/           # Dockerfiles + docker-compose orchestration
├── docs/ (planned)   # Product/design references (PRD, flows)
├── node_modules/
├── package.json
└── ...
```

> The older `packages/*` workspace described in early plans has not been created. Shared utilities currently live inside each app (`apps/web/src/lib`, `apps/backend/src/utils`, etc.). When we introduce shared packages, update `package.json` workspaces accordingly.

---

## Frontend (apps/web)

Key directories reflect the programming-problem experience:

```
apps/web/
├── src/
│   ├── app/
│   │   ├── (auth)/             # Login/register/reset flows
│   │   ├── (dashboard)/        # Protected routes (dashboard, challenges, submissions, orgs)
│   │   ├── api/                # Next.js route handlers (auth callbacks, webhooks)
│   │   ├── layout.tsx          # Root layout with theme + providers
│   │   └── page.tsx            # Marketing/landing page
│   ├── components/
│   │   ├── ide/                # Monaco-based editor, language selector, AI sidecar
│   │   ├── challenges/         # ChallengeCard, PromptView, TestcaseTable, SubmissionTimeline
│   │   ├── dashboards/         # XP widgets, streak tracker, cohort stats
│   │   ├── community/          # Discussion thread, reply composer, moderation tools
│   │   ├── ui/                 # shadcn/ui primitives and project-specific wrappers
│   │   └── common/             # Header, Sidebar, ThemeToggle, ErrorBoundary
│   ├── services/               # REST/WebSocket clients (auth, challenge, submission, org, ai)
│   ├── store/                  # Zustand slices (auth, challenge, editorSettings, submissions, ui)
│   ├── hooks/                  # useChallenge, useCodeRunner, useWebSocket, useOrganization
│   ├── lib/
│   │   ├── config/             # Route map, feature flags, IDE language configs
│   │   └── utils/              # formatting, time, verdict helpers, diff utilities
│   ├── styles/                 # Tailwind + global styles
│   └── types/                  # Shared TS types for API payloads
├── public/                     # Logos, icons, landing assets
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

Core UI pillars:
- **Challenge Browser:** filtering, difficulty chips, language/topic tags, success stats.
- **Workspace:** Monaco Editor, test console, verdict timeline, AI hint drawer, autosave indicator.
- **Submissions:** history list with verdict filter, diff viewer, per-test breakdown modal.
- **Organizations:** admin area for assignment creation, roster management, analytics charts.

### Frontend Integration Points
- **API client:** `services/api.config.ts` centralizes base URLs, attaches JWT/refresh tokens, and handles 401 refresh logic.
- **WebSocket:** `services/websocket.service.ts` streams judge status and MCP notifications (recommendations, hints).
- **Feature Flags:** Use `lib/config/flags.ts` to gate contest mode, AI beta features, etc.

---

## Backend (apps/backend)

```
apps/backend/
├── src/
│   ├── app.ts               # Express app wiring (middleware, routes)
│   ├── server.ts            # HTTP + WebSocket bootstrap
│   ├── config/
│   │   ├── database.ts      # Prisma client + connection handling
│   │   ├── redis.ts         # BullMQ queue + cache connections
│   │   ├── logger.ts        # Winston transports (console + file)
│   │   └── env.ts           # Zod-validated env parsing
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── challenge.routes.ts
│   │   ├── submission.routes.ts
│   │   ├── discussion.routes.ts
│   │   ├── playlist.routes.ts
│   │   ├── org.routes.ts
│   │   └── ai.routes.ts     # Proxy to MCP (hint/recommendation requests)
│   ├── controllers/         # Request handlers calling services
│   ├── services/
│   │   ├── AuthService.ts
│   │   ├── ChallengeService.ts
│   │   ├── SubmissionService.ts (enqueue run/submit jobs)
│   │   ├── DiscussionService.ts
│   │   ├── PlaylistService.ts
│   │   ├── OrganizationService.ts
│   │   └── AnalyticsService.ts
│   ├── jobs/
│   │   ├── runner.queue.ts      # BullMQ queue definitions
│   │   └── runner.worker.ts     # Executes sandbox jobs locally (dev) or delegates to runner service
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── rateLimit.middleware.ts
│   │   ├── validate.middleware.ts
│   │   └── error.middleware.ts
│   ├── repositories/            # Prisma data access abstractions
│   ├── utils/
│   │   ├── token.helper.ts
│   │   ├── password.helper.ts
│   │   ├── verdict.helper.ts
│   │   └── plagiarism.helper.ts (future)
│   └── types/                   # Request/response contracts
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed/ (sample challenges, testcases, orgs)
├── tests/
│   ├── unit/
│   └── integration/
└── package.json
```

Submission lifecycle:
1. API receives `/run` or `/submit` → validates payload → stores draft submission (status `PENDING`).
2. Submission job is pushed to BullMQ (Redis) with code, language, limits.
3. Worker executes sandbox (local Docker or remote runner). It records per-test verdicts and logs.
4. Worker updates submission row (status + telemetry) and emits WebSocket event.
5. MCP is notified asynchronously to update skill graph and recommendations.

### Judge / Sandbox
- Dev mode: local Docker-in-Docker containers launched via runner worker.
- Prod mode: separate “runner” fleet (could be serverless) using same job queue contract.
- Language images kept under `docker/runner/` (Python, Node, Java, C++, Go, Rust). Each image exposes entrypoint script standardizing compile/run steps.

---

## MCP Server (apps/mcp-server)

```
apps/mcp-server/
├── src/
│   ├── config/          # Service config, AI providers, Redis/vector clients
│   ├── core/
│   │   ├── RecommendationEngine.ts
│   │   ├── SkillGraph.ts
│   │   ├── HintPlanner.ts (prompt templating, guardrails)
│   │   └── SimilarityIndex.ts (embeddings)
│   ├── services/
│   │   ├── EmbeddingService.ts
│   │   ├── HintService.ts
│   │   ├── RecommendationService.ts
│   │   └── TelemetryIngestService.ts
│   ├── handlers/        # WebSocket message handlers, REST controllers (if any)
│   ├── utils/           # Prompt builders, scoring functions, logging
│   ├── types/           # Protocol messages (requests/responses)
│   └── index.ts         # Entry point
└── package.json
```

Responsibilities:
- Maintain per-user skill vectors, difficulty calibration, and burnout detection (streak health).
- Provide APIs used by frontend/backoffice: recommendations, similar challenges, AI hints, code explanation summaries.
- Communicate with backend through secure internal APIs or message bus (submission events, new challenge metadata).

---

## Environment Variables

### apps/web (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=ws://localhost:3001
NEXT_PUBLIC_MCP_URL=http://localhost:5001
NEXT_PUBLIC_SUPPORTED_LANGS=\"python,javascript,typescript,java,cpp,go,rust\"
NEXTAUTH_URL=http://localhost:3003
NEXTAUTH_SECRET=change-me
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

### apps/backend (.env)
```
PORT=3001
NODE_ENV=development
DATABASE_URL=\"file:./dev.db\" # use postgres connection string in staging/prod
JWT_SECRET=change-me
JWT_REFRESH_SECRET=change-me-too
RUNNER_QUEUE_NAME=submission-jobs
REDIS_URL=redis://localhost:6379
SANDBOX_IMAGE_REGISTRY=ghcr.io/mathsolve-ai/runtimes
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...
GITHUB_TOKEN=optional
```

### apps/mcp-server (.env)
```
PORT=5001
NODE_ENV=development
DATABASE_URL=\"file:../backend/dev.db\" # shares Prisma schema locally
REDIS_URL=redis://localhost:6379
EMBEDDING_MODEL=text-embedding-3-large
HINT_MODEL=claude-3-5-sonnet
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...
CACHE_TTL_SECONDS=3600
```

---

## Docker & Tooling
- `docker-compose.yml` (planned update) should wire `web`, `backend`, `mcp`, `redis`, and `runner` services. Backend volume-mounts `apps/backend` for hot reload.
- Runner images live under `docker/runner/*` with language-specific Dockerfiles.
- Scripts under `scripts/` handle seeding sample challenges, provisioning organizations, and running smoke tests.

---

## Development Workflow
1. `npm install` at root; use workspace scripts (`npm run dev:web`, `dev:api`, `dev:mcp`).
2. Run `npm run db:migrate && npm run db:seed` to populate starter programming challenges and testcases.
3. Start Redis locally for job queue + cache.
4. For sandbox testing, ensure Docker daemon is available; runner worker uses it to spawn containers.
5. Update `Todo.md` when new features are scoped; Kairo/Algo collaboration still happens via `todo.md` and `improvement.md` if you keep the multi-agent workflow.

---

## Future Enhancements to Structure
- Introduce `packages/shared` for TypeScript DTOs, validation schemas, telemetry helpers.
- Add `packages/runner-sdk` with TypeScript/Go clients for interacting with the submission queue from external runners.
- Create `docs/` entries for API reference, sandbox design, and admin workflows once stabilized.
