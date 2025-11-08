# TODO – Programming Challenge Platform Roadmap

_Last updated: September 2025_

## ✅ Completed Foundations
- Monorepo + workspace tooling (Next.js web, Express backend, MCP server)
- Auth stack with JWT + OAuth scaffolding
- Initial Prisma schema + SQLite dev database
- Seed data placeholder + sample users
- Basic problem management UI (list/create/edit) – to be refocused for programming prompts

## 🚧 Phase 1 – Reorient Product to Programming (In Progress)
- [ ] Rewrite challenge schema to include languages, constraints, starter code, editorial links
- [ ] Migrate existing math seed data to programming examples (arrays, strings, DP, SQL)
- [ ] Update frontend challenge pages to show code-specific sections (constraints, sample I/O, time limits)
- [ ] Replace math components (MathJax, geometry canvas) with code editor modules
- [ ] Refresh marketing copy and onboarding screens to emphasize developer workflows

## 🔁 Phase 2 – IDE & Submission Loop
- [ ] Integrate Monaco editor with language selector, theme sync, keyboard shortcuts
- [ ] Implement “Run” endpoint for custom input execution (limited test harness)
- [ ] Implement “Submit” endpoint to run hidden testcases + produce verdict timeline
- [ ] Create submission history view with diff, runtime, memory stats
- [ ] Autosave drafts + version snapshots per challenge attempt

## 🧰 Phase 3 – Sandbox & Runner Infrastructure
- [ ] Stand up Redis + BullMQ queue
- [ ] Build Docker images for Python, Node, Java, C++, Go, Rust runners
- [ ] Implement runner worker (local) + interface for remote runner fleet
- [ ] Enforce resource limits, detect TLE/MLE/RE, capture stdout/stderr
- [ ] Emit WebSocket updates for job progress + completion

## 🤖 Phase 4 – MCP, AI Hints, Recommendations
- [ ] Define skill graph schema (topics, difficulty, decay)
- [ ] Stream submission telemetry to MCP server
- [ ] Implement hint planner (prompt templates, guardrails, evaluation rules)
- [ ] Build recommendation endpoint returning next-best challenges per user
- [ ] UI integration: AI hint drawer, “Recommended for you” widget, skill radar chart

## 🧑‍🤝‍🧑 Phase 5 – Community & Organizations
- [ ] Challenge discussions with syntax-highlighted comments and moderation tools
- [ ] Playlist/track builder for instructors (ordering, due dates, visibility)
- [ ] Organization dashboards (roster, assignment progress, activity heatmap)
- [ ] Leaderboards (global/org/friends, weekly/monthly) + achievement badge system
- [ ] Reporting + flagging flow for problematic challenges or discussions

## 📈 Phase 6 – Contests & Advanced Analytics (Planned)
- [ ] Live contest mode with private/public rooms, freeze period, penalty calculation
- [ ] Rating adjustments (Elo-style) and contest history on profiles
- [ ] Instructor analytics exports (CSV/API) with submission breakdowns
- [ ] Plagiarism detection via code similarity + MCP embeddings
- [ ] Compliance tooling (GDPR export/delete, audit logs)

## 🧾 Operational Tasks
- [ ] Update docs: API reference, runner handbook, instructor guide
- [ ] Harden security: sandbox isolation tests, dependency scanning, secret detection
- [ ] CI pipelines for backend tests, frontend lint/unit, runner image builds
- [ ] Observability: OpenTelemetry traces, log aggregation, alerting playbooks
- [ ] Pricing & billing scaffolding for premium org features (Stripe or Paddle)

## 📌 Notes
- Keep `PRD.md` and `structure.md` synchronized with implementation progress.
- Coordinate Algo (implementation) and Kairo (review) agents through `todo.md` + `improvement.md` if following dual-agent workflow.
- Prioritize IDE + runner milestones before layering AI and community functionality.
