# Tech Stack and Code Conventions

## Technology Stack

### Frontend (apps/web)
- **Framework**: Next.js 15 with App Router
- **React**: Version 19
- **TypeScript**: Version 5+
- **Styling**: Tailwind CSS v4 with PostCSS
- **Fonts**: Geist Sans and Geist Mono from Google Fonts

### Backend (apps/backend) - Planned
- **Framework**: Express.js with TypeScript
- **Database**: Prisma ORM with SQLite (dev) / PostgreSQL (prod)
- **Authentication**: JWT tokens with bcrypt password hashing
- **Logging**: Winston logger
- **Middleware**: CORS, body-parser, helmet, rate limiting

### MCP Server (apps/mcp-server) - Planned
- **Protocol**: WebSocket-based MCP (Model Context Protocol)
- **AI Integration**: OpenAI/Claude APIs
- **Caching**: Redis for performance optimization

## Code Style and Conventions

### File Structure
- Uses Next.js App Router conventions
- TypeScript throughout the project
- Component files use PascalCase naming
- Utility files use camelCase naming

### React/Next.js Conventions
- Functional components with TypeScript
- Default exports for page components
- Named exports for utility functions
- CSS classes use Tailwind utility classes
- Font variables defined in layout.tsx

### TypeScript
- Strict TypeScript configuration
- Type definitions for all props and functions
- Interface definitions for complex objects
- Readonly types for component props

### Styling
- Tailwind CSS v4 with utility-first approach
- CSS variables for fonts (--font-geist-sans, --font-geist-mono)
- Dark mode support with dark: prefixes
- Responsive design with sm:, md:, lg: breakpoints