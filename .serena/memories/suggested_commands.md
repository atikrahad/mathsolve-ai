# Suggested Development Commands

## Frontend Development (apps/web)
```bash
cd apps/web
npm run dev          # Start development server with Turbopack
npm run build        # Build for production with Turbopack  
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Backend Development (apps/backend) - Planned
```bash
cd apps/backend
npm run dev          # Start development server with nodemon
npm run build        # Compile TypeScript
npm run start        # Start production server
npm test             # Run Jest tests
npm run db:migrate   # Run Prisma migrations
npm run db:seed      # Seed database with test data
npm run db:studio    # Open Prisma Studio
```

## MCP Server (apps/mcp-server) - Planned
```bash
cd apps/mcp-server
npm run dev          # Start MCP server in development
npm run build        # Build MCP server
npm run start        # Start production MCP server
```

## Root Level Commands (Turbo Monorepo) - Planned
```bash
npm run dev          # Start all services
npm run dev:web      # Start only web app
npm run dev:api      # Start only backend API
npm run dev:mcp      # Start only MCP server
npm run build        # Build all apps
npm run test         # Run all tests
npm run lint         # Lint all apps
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
```

## Windows System Commands
```bash
# File operations
dir                  # List directory contents (equivalent to ls)
cd <path>           # Change directory
type <file>         # Display file contents (equivalent to cat)
findstr <pattern>   # Search for text patterns (equivalent to grep)
where <command>     # Find command location (equivalent to which)

# Git operations
git status          # Check repository status
git add .           # Stage all changes
git commit -m       # Commit with message
git push            # Push to remote
git pull            # Pull from remote
git branch          # List branches
git checkout        # Switch branches
```

## Package Management
```bash
npm install         # Install dependencies
npm update          # Update dependencies
npm audit           # Check for vulnerabilities
npm run <script>    # Run package.json script
```