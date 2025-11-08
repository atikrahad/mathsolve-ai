# MathSolve AI – Programming Challenge Platform PRD

## 1. Product Overview

### Vision
Build a full-stack, AI-assisted platform where developers of all levels can practice programming problems, receive instant feedback from automated evaluators, collaborate with peers, and accelerate learning through personalized guidance.

### Target Users
- **Learners:** Students, bootcamp participants, career switchers needing structured practice
- **Educators & Coaches:** Instructors who assign challenges, track cohorts, and review submissions
- **Competitive Coders & Professionals:** Individuals preparing for coding interviews, hackathons, or job-specific skill refreshers

### Core Value Proposition
One workspace for discovering curated challenges, writing/running code in multiple languages, validating against hidden tests, reviewing AI-generated hints, and progressing through gamified ranks and learning paths.

## 2. User Personas

### Aspiring Developer
- **Goals:** Learn fundamentals, build confidence, land first role
- **Pain Points:** Fragmented learning resources, lack of actionable feedback
- **Needs:** Guided practice, detailed explanations, AI hints tailored to skill level

### Instructor / Coach
- **Goals:** Provide structured exercises, monitor progress, surface struggling learners
- **Pain Points:** Manual grading, limited visibility into student attempts
- **Needs:** Cohort dashboards, challenge playlists, analytics, plagiarism detection

### Competitive Programmer
- **Goals:** Sharpen problem-solving speed, explore advanced topics, track ranking
- **Pain Points:** Limited access to fresh curated sets, no adaptive recommendations
- **Needs:** Difficulty-scaled ladders, live contests, discussion forums, MCP-powered recommendations

## 3. Feature Requirements

### 3.1 Core Features

#### Authentication & Profiles
- Email + OAuth (Google, GitHub) sign-in with MFA option
- Developer profiles showing languages, streaks, contest history
- Privacy controls, handle reservation, avatar, social links
- Organization/team accounts for instructors or companies

#### Challenge Library
- Taxonomy by language, topic (DS/Algo, systems, web, ML), difficulty (Warm-up → Legendary)
- Rich challenge definition: narrative, constraints, sample IO, editorial outline
- Tags, search filters, curated tracks (Interview 75, Rust Starter, Backend Systems)
- Bookmarking, playlists, cohort-specific challenge sets

#### Code Workspace
- In-browser IDE (Monaco) with syntax highlighting, AI autocomplete, multi-file tabs
- Language runtimes (Python, JS/TS, Java, C++, Go, Rust) executed via sandbox service
- Input/output console, run vs. submit flows, custom testcases, runtime + memory stats
- Versioned drafts, diff view between attempts

#### Evaluation & Feedback
- Containerized judge that compiles/runs code with time/memory limits
- Public sample tests + hidden acceptance tests
- Detailed verdicts (pass/fail, TLE, MLE, RE) with stack traces or logs
- AI explanation service (Claude/OpenAI) referencing failing testcases and likely bug types
- Code quality checks (linting hints, complexity estimate)

#### AI Copilot & MCP Integration
- Skill graph tracking algorithms/data structures mastery
- Recommendation engine suggesting next best challenge based on performance and goals
- Conversational hinting: nudges, partial solutions, alternative approaches
- Similar-solution clustering for plagiarism detection and community insights

#### Community & Collaboration
- Discussion threads per challenge with syntax-highlighted code snippets
- Upvote/downvote, accepted answer markers, moderator tooling
- Shared workspaces/pairing sessions with live cursors (future)
- Reporting system for incorrect statements or poor challenge quality

#### Gamification & Progression
- XP system tied to difficulty, first-try solves, contest placement, community contributions
- Rank tiers: Novice, Apprentice, Developer, Senior, Principal, Architect, Legend
- Achievement badges (first compile, redundant test coverage, streak milestones, language mastery)
- Leaderboards: global, friends, organization, language-specific, weekly/monthly

#### Learning Paths & Resources
- Structured tracks per language or goal (e.g., “Python Data Structures”, “System Design Warm-up”)
- Embedded editorials, annotated reference implementations, video walkthroughs
- Auto-generated study plans with reminders and due dates
- Integration hooks for external LMS or company portals (webhooks/API)

### 3.2 Quality Attributes
- **Performance:** IDE loads <2s, run feedback <5s (cached) / <15s (fresh execution), websockets <200ms latency
- **Reliability:** Retries for sandbox jobs, submission idempotency, offline draft persistence
- **Security:** Isolated execution sandboxes, rate limiting, SSRF mitigation, secret scanning on uploads
- **Accessibility:** Keyboard shortcuts, screen reader compliant components, configurable themes
- **Scalability:** Stateless APIs with horizontal scaling, job queue for judge, CDN for static/editor bundles

## 4. User Journeys

### Onboarding Journey
1. Visit marketing homepage, learn value props
2. Register via email/OAuth, optionally join organization or cohort
3. Pick preferred languages + skill assessment quiz
4. Receive personalized dashboard with recommended track and first challenge
5. Solve tutorial challenge with guided hints, earn first badge

### Practice Journey
1. Filter/select challenge by topic/language/difficulty
2. Read prompt, open IDE, choose language
3. Write code, run custom tests
4. Submit → sandbox executes hidden tests → verdict displayed
5. If failing, request AI hint or view discussion snippet
6. Upon success, review editorial, share solution, earn XP

### Instructor Journey
1. Create organization and invite learners
2. Assemble playlist from library or upload custom challenge (with testcases & solution)
3. Assign due dates and difficulty ramp
4. Monitor submissions dashboard (pass/fail, average attempts, hints used)
5. Export analytics or trigger re-tests after challenge updates

### Contest Journey (future)
1. Join scheduled contest or create private contest
2. Enter live leaderboard, locking solutions until contest end
3. Automatic tie-breaker rules (penalty, completion order)
4. Post-contest editorials and rating adjustments

## 5. Technical Requirements

### Frontend (Next.js)
- Next.js 14 App Router, TypeScript, Tailwind, shadcn/ui
- Monaco-based CodeEditor component with language mode loading
- Zustand/TanStack Query for client state + data fetching
- WebSocket hook for real-time judge status + collaboration features
- MathJax removed; highlight.js/prism + Markdown with code fences for prompts/editorials

### Backend (Express + Services)
- Express + TypeScript, modular routing, Zod validation, Prisma ORM
- Submission pipeline: API → job queue (BullMQ/Redis) → sandbox runner service (Node worker or external cluster)
- Authentication via JWT + refresh tokens; OAuth providers maintained
- Rate limiting per endpoint (stricter on run/submit) and per-organization quotas
- Telemetry via Winston + OpenTelemetry exporters

### Sandbox / Judge
- Executes user code inside Firecracker/Docker sandboxes with language-specific images
- Resource limits configurable per challenge
- Streams stdout/stderr logs back to API, stores per-test results
- Supports custom judge scripts for interactive problems or SQL tasks
- Future: GPU-enabled workers for ML tasks

### Database
- PostgreSQL primary; SQLite only for local dev
- Tables: users, challenges, tags, playlists, submissions, testcases, discussions, organizations, achievements, recommendation_state
- Full-text search indexes on challenge titles/prompts
- Row-level security for organization-scoped data (optional)

### MCP Server
- Hosts skill graphs, embeddings, recommendation algorithms
- Consumes submission telemetry to update mastery vectors
- Provides APIs for AI hint generation, similar challenge lookup, autop-run severity classification
- Caches results in Redis + vector store (pgvector or Pinecone)

### Integrations
- AI providers (OpenAI, Anthropic) with prompt templates for hints/editorials/responses
- GitHub/Gist export for sharing accepted solutions
- Webhooks for LMS/Slack notifications (assignment created, submission failed)
- Payment gateway (future) for premium tiers

## 6. Data Models (simplified)

### User
- id, email, username, passwordHash, avatar, bio, preferredLanguages[], xp, rank, streak, organizationId?, roles[], createdAt, updatedAt

### Challenge
- id, slug, title, prompt (Markdown), constraints, difficulty, topics[], languages[], starterCode {lang: code}, solutionOutline, editorialUrl, creatorId, visibility, createdAt, updatedAt

### Submission
- id, challengeId, userId, language, code, status (pending/pass/fail/tle/mle/re), runtimeMs, memoryKb, verdictDetails Json, testsPassed, totalTests, hintCount, createdAt

### TestCase
- id, challengeId, isSample, inputBlob, expectedOutputBlob, metadata (time limit, scoring)

### Discussion
- id, challengeId, userId, parentId?, content Markdown, upvotes, createdAt, updatedAt, acceptedAnswer?

### Playlist / Track
- id, ownerId (user/org), title, description, visibility, challengeOrder[], tags, isOfficial

### Organization
- id, name, slug, logoUrl, planTier, seats, settings Json, createdAt

### RecommendationState
- id, userId, skillVector Json, lastAnalyzedAt, preferredGoals[], suggestedChallengeIds[]

## 7. API Endpoints (sample)

### Auth & Profile
- POST /api/auth/register, /login, /logout, /refresh, /oauth/callback
- GET/PUT /api/users/me, GET /api/users/:id, GET /api/users/:id/stats

### Challenges
- GET /api/challenges (filters), GET /api/challenges/:slug
- POST /api/challenges (staff/instructors), PUT/PATCH /api/challenges/:slug, DELETE ...
- GET /api/challenges/:slug/testcases/sample (public) – hides hidden cases

### Submissions & Judge
- POST /api/challenges/:slug/run (custom input)
- POST /api/challenges/:slug/submit
- GET /api/submissions/:id (includes per-test results)
- GET /api/challenges/:slug/submissions?userId=... (history)

### Community & Resources
- GET/POST /api/challenges/:slug/discussions
- POST /api/discussions/:id/upvote, POST /api/discussions/:id/accept
- GET /api/playlists, POST /api/playlists, POST /api/playlists/:id/assign

### Organizations & Analytics
- POST /api/orgs, GET /api/orgs/:id/learners, GET /api/orgs/:id/analytics
- POST /api/orgs/:id/invite, POST /api/orgs/:id/challenges

### MCP / AI
- POST /api/ai/hint, /analyze-code, /recommendations
- WS /mcp/connect for realtime hint sessions + recommendation pushes

## 8. UI / UX Requirements
- **Dashboard:** Personalized feed (recommended challenges, streak, XP), quick resume
- **Challenge Detail:** Markdown prompt, constraints table, stats (success rate, attempts), tags, discussion preview
- **IDE Workspace:** Resizable panels (code editor, console, tests, AI assistant), keyboard shortcuts, auto-save indicator
- **Playlists & Tracks:** Progress bars, reorderable lists, assignment due dates
- **Organizations:** Admin console for invites, analytics charts, export buttons
- **Leaderboards:** Filters (global/org/friends), language toggles, search bar
- **Responsive Design:** Desktop-first but optimized layouts for tablet/mobile; code editor falls back to full-screen on small screens

## 9. Success Metrics
- Weekly active coders, new submissions per user, median attempts to solve
- Time-to-first-success after onboarding, hint effectiveness (success after hint)
- Instructor adoption: active cohorts, assignments issued, average completion rate
- Judge reliability: average job latency, failure rate, sandbox utilization
- MCP value: recommendation click-through, skill progression delta, AI hint satisfaction rating

## 10. Compliance & Security
- GDPR/CCPA readiness, data export/delete on request
- Academic integrity: plagiarism detection, IP logging for proctored contests
- Secure sandboxing with no outbound network by default, scanning uploads for secrets
- WCAG 2.1 AA compliance, localization-ready copy (start with English)

## 11. Future Roadmap
- Mobile companion apps (solve or review editorials on the go)
- Live pair programming interviews + interviewer dashboards
- Company-branded portals with ATS integrations
- Adaptive certifications / badges minted on-chain (optional)
- AI-generated challenges vetted by human reviewers
- Offline-first desktop IDE sync
- Marketplace for premium tracks, mock interviews, mentoring sessions
