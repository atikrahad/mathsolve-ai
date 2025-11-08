# MathSolve AI – Programming Challenge Platform

MathSolve AI evolves into a full-stack workspace for solving programming problems with instant feedback, AI guidance, and rich community features. The platform combines a Next.js IDE experience, an Express/Prisma API with sandboxed code evaluation, and an MCP microservice that drives recommendations, hints, and personalization.

## 🔍 Key Capabilities
- **Challenge Library:** Curated problems tagged by language, topic, and difficulty with editorials and stats.
- **In-Browser IDE:** Monaco-based editor, multi-language runtimes (Python, JS/TS, Java, C++, Go, Rust), custom inputs, autosave, diff view.
- **Automated Judge:** Containerized execution with per-test verdicts, runtime/memory telemetry, and structured error output.
- **AI Copilot:** MCP-powered hints, solution critiques, and personalized recommendations based on skill graphs.
- **Community & Organizations:** Discussions, playlists, cohort assignments, leaderboards, achievements, and org-level analytics.

## 🏗️ Architecture
```
apps/
├── web        # Next.js frontend (App Router + Tailwind + shadcn/ui + Monaco)
├── backend    # Express + Prisma API, submission queue, runner orchestration
└── mcp-server # MCP service for hints, recommendations, embeddings
```
Supporting directories: `docker/` (runtimes + compose), `scripts/` (setup, seeding), documentation such as `PRD.md` and `structure.md`.

## 🚀 Getting Started
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Generate & seed database**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```
3. **Start services** (requires Redis + Docker for sandbox jobs)
   ```bash
   npm run dev:web
   npm run dev:api
   npm run dev:mcp
   ```
4. Visit `http://localhost:3003` for the frontend, `http://localhost:3001/api` for API routes, and `ws://localhost:5001` for MCP WebSocket during development.

### Environment Variables
- `apps/web/.env.local` – API/MCP URLs, NextAuth + OAuth creds, supported language list
- `apps/backend/.env` – server port, database URL, JWT secrets, Redis URL, runner queue, AI API keys
- `apps/mcp-server/.env` – MCP port, Redis, embedding + hint models, AI provider keys

See `structure.md` for the exact variable matrix and file locations.

## 📦 Workspace Scripts (root package.json)
| Script | Description |
| --- | --- |
| `npm run dev` | Run web, API, and MCP concurrently |
| `npm run dev:web` / `dev:api` / `dev:mcp` | Start individual apps |
| `npm run build:*` | Build artifacts for each app |
| `npm run start:*` | Run compiled production builds |
| `npm run test:*` | Execute unit/integration tests per app |
| `npm run db:migrate` / `db:seed` | Prisma migrations + seed data |
| `npm run docker:*` | Compose up/down/logs for local infra |

## 🧪 Submission Pipeline (High Level)
1. Frontend sends `/run` or `/submit` to backend with code + language.
2. Backend stores a `PENDING` submission, enqueues a job via BullMQ (Redis).
3. Runner worker spins up language container, executes tests, streams logs.
4. Verdict + telemetry stored in Prisma, WebSocket event notifies client, MCP ingests telemetry for recommendations.

## 🤝 Collaboration Workflow (optional)
Teams can still use dual-agent collaboration (Algo developer + Kairo reviewer) by coordinating through:
- `todo.md` – implementation plan and status updates
- `improvement.md` – review notes and refactor guidance
- `principle.md` – shared engineering principles

These files should now reflect programming-problem goals; see `Todo.md` for current roadmap.

## 📚 Reference Documents
- `PRD.md` – Programming challenge product requirements (personas, features, metrics)
- `structure.md` – Updated repo layout, service responsibilities, env expectations
- `Todo.md` – Phase-by-phase delivery plan and backlog items

## 🛣️ Next Steps
- Implement sandbox runner images + queue consumers for all required languages
- Build challenge creation/editorial tooling for staff and instructors
- Flesh out MCP hinting pipelines and run human-in-the-loop review
- Harden security (resource isolation, plagiarism detection) before opening to cohorts

Feel free to open issues or pull requests with improvements. Let’s build the best developer practice platform together! 💻✨
