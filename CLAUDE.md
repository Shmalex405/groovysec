# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Groovy Security - Cybersecurity company with two products: **Whiteout AI** (AI governance platform) and **Maestro** (AI-driven penetration testing). Full-stack TypeScript monorepo with Express backend and React frontend.

## Commands

```bash
# Development
npm run dev              # Start Vite dev server (frontend only)
npm run dev:server       # Start Express server with hot reload (tsx)

# Build
npm run build            # Build frontend (Vite) and backend (esbuild)
npm run build:docs       # Build and deploy to docs/ folder for GitHub Pages

# Database
npm run db:push          # Push Drizzle schema to PostgreSQL

# Type checking
npm run check            # Run TypeScript compiler

# Deploy (Claude Code skill)
/deploy                  # Build docs, verify output, check CNAME
```

## Architecture

### Monorepo Structure
- `client/` - React frontend (Vite)
- `server/` - Express backend
- `shared/` - Shared types and Drizzle schema

### Route Structure
| Route | Page | File |
|-------|------|------|
| `/` | Company landing | `client/src/pages/company-home.tsx` |
| `/whiteout-ai` | Whiteout AI product | `client/src/pages/whiteout-ai.tsx` |
| `/maestro` | Maestro product | `client/src/pages/maestro.tsx` |
| `/about` | About / Founders | `client/src/pages/about.tsx` |
| `/demo` | Request Demo form | `client/src/pages/demo.tsx` |
| `/whiteout-ai/government` | Government sector | `client/src/pages/whiteout-ai/government.tsx` |
| `/whiteout-ai/academic-integrity` | Academic integrity | `client/src/pages/whiteout-ai/academic-integrity.tsx` |
| `/whiteout-ai/security-whitepaper` | Security whitepaper | `client/src/pages/whiteout-ai/security-whitepaper.tsx` |
| `/terms-of-service` | Terms of Service | `client/src/pages/terms-of-service.tsx` |
| `/privacy-policy` | Privacy Policy | `client/src/pages/privacy-policy.tsx` |

### Path Aliases
- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`
- `@assets` → `attached_assets/`

### Backend
- Express server in `server/index.ts`
- Routes split between `server/routes.ts` (GET endpoints) and `server/routes/leads.ts` (POST /api/leads with Resend email)
- Storage layer: `server/storage.ts` implements `IStorage` interface with Drizzle ORM
- Database: Neon PostgreSQL with `@neondatabase/serverless` driver
- Drizzle schema defined in `shared/schema.ts`

### Frontend
- React 18 with Wouter for routing
- TanStack Query for server state
- shadcn/ui components in `client/src/components/ui/`
- Custom components: navigation, hero-section, lead-capture, platform-overview, etc.
- API client in `client/src/lib/queryClient.ts` with `apiRequest()` helper

### Environment Variables
- `DATABASE_URL` - Neon PostgreSQL connection string (required)
- `RESEND_API_KEY` - For email notifications on lead submission (optional)
- `VITE_API_BASE_URL` - API base URL for frontend (defaults to http://localhost:5000/api)
- `PORT` - Server port (defaults to 5000)

## Database Schema

Two tables defined in `shared/schema.ts`:
- `leads` - Lead capture data (firstName, lastName, email, company, role, companySize, aiUsage, useCase)
- `users` - Basic auth (currently unused)

Use `insertLeadSchema` and `insertUserSchema` for Zod validation of insert operations.
