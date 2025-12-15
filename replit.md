# Cruzador de Planilhas - Spreadsheet Cross-Reference Tool

## Overview

This is a fullstack monorepo application designed to help businesses cross-reference client data with debtor lists. Users upload two Excel spreadsheets (one with client names and phone numbers, another with debtor names), and the system generates a filtered spreadsheet containing only the debtors with their contact information.

The application is built as a React + Express TypeScript monorepo with PostgreSQL for data persistence, designed for deployment on platforms like Render.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **Routing**: wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS v4 with custom dark theme (slate/blue/purple color scheme)
- **Excel Processing**: xlsx library for client-side spreadsheet parsing and generation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Session Management**: express-session with PostgreSQL storage (connect-pg-simple)
- **Authentication**: Custom session-based auth with bcryptjs password hashing
- **API Pattern**: RESTful endpoints under `/api/` prefix

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` contains table definitions
- **Migrations**: Managed via drizzle-kit (`db:push` for development)
- **Session Storage**: PostgreSQL table (auto-created by connect-pg-simple)

### Authentication Flow
1. Users authenticate via `/api/auth/login` with username/password
2. Passwords are hashed using bcryptjs (salt rounds: 10)
3. Sessions stored in PostgreSQL, cookies used for session identification
4. Admin users identified by username containing "admin"
5. Protected routes redirect unauthenticated users to `/auth`

### Build and Deployment
- **Build Command**: `npm run build` (compiles frontend with Vite, backend with esbuild)
- **Deploy Command**: `npm run build-deploy` (build + db:push + db:seed)
- **Output**: `dist/index.cjs` (server bundle) and `dist/public/` (static assets)
- **Start Command**: `npm start` runs the production server

### Project Structure
```
/
├── client/          # React frontend (Vite)
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── hooks/       # Custom React hooks (auth, toast)
│   │   ├── lib/         # Utilities and Excel processing
│   │   └── pages/       # Route components
├── server/          # Express backend
│   ├── index.ts     # Server entry point
│   ├── routes.ts    # API route definitions
│   ├── storage.ts   # Database access layer
│   └── db.ts        # Drizzle database connection
├── shared/          # Shared code between client/server
│   └── schema.ts    # Drizzle schema definitions
├── script/          # Build and seed scripts
│   ├── build.ts     # Production build script
│   └── seed.ts      # Database seeding (admin user)
└── dist/            # Production build output
```

## External Dependencies

### Database
- **PostgreSQL**: Required for user storage and session management
- **Connection**: Via `DATABASE_URL` environment variable
- **ORM**: Drizzle ORM with node-postgres driver

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required)
- `SESSION_SECRET`: Express session secret (defaults to dev secret)
- `ADMIN_USERNAME`: Initial admin username (defaults to "admin")
- `ADMIN_PASSWORD`: Initial admin password (defaults to "diretor123")
- `NODE_ENV`: Set to "production" for production builds
- `PORT`: Server port (auto-detected from environment)

### Key NPM Packages
- **Frontend**: React, wouter, @tanstack/react-query, xlsx, shadcn/ui components
- **Backend**: Express, express-session, connect-pg-simple, bcryptjs, drizzle-orm
- **Build**: Vite, esbuild, tsx (for running TypeScript)

### Production Deployment (Render)
- Sessions persist across server restarts via PostgreSQL
- Trust proxy enabled for secure cookies behind reverse proxy
- Static files served from `dist/public/` directory
- SPA fallback configured for client-side routing

**Guia completo de deploy**: Consulte o arquivo `DEPLOY_NEON_RENDER_GUIA.md` para instrucoes passo a passo de como fazer o deploy gratuito no Neon + Render.

### Arquivos de Configuracao para Deploy
- `.env.example`: Modelo de variaveis de ambiente
- `DEPLOY_NEON_RENDER_GUIA.md`: Guia completo Neon + Render (RECOMENDADO)
- `DEPLOY_RENDER_GUIA.md`: Guia alternativo usando banco do Render