# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Groovy Security - Cybersecurity company with three products: **Whiteout AI** (AI governance platform), **Maestro** (AI-driven penetration testing), and **Secure AI Skills** (111 enterprise-grade security skills for OpenClaw). Full-stack TypeScript monorepo with Express backend and React frontend.

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
| ~~`/maestro`~~ | Maestro product — **unpublished 2026-09-02** | `client/src/pages/maestro.tsx` |
| `/about` | About / Founders | `client/src/pages/about.tsx` |
| `/demo` | Request Demo form | `client/src/pages/demo.tsx` |
| `/whiteout-ai/government` | Government sector | `client/src/pages/whiteout-ai/government.tsx` |
| `/whiteout-ai/academic-integrity` | Academic integrity | `client/src/pages/whiteout-ai/academic-integrity.tsx` |
| `/whiteout-ai/security-whitepaper` | Security whitepaper | `client/src/pages/whiteout-ai/security-whitepaper.tsx` |
| `/terms-of-service` | Terms of Service | `client/src/pages/terms-of-service.tsx` |
| `/skills` | Secure AI Skills product | `client/src/pages/skills.tsx` |
| `/skills/success` | Post-purchase success | `client/src/pages/skills/success.tsx` |
| `/privacy-policy` | Privacy Policy | `client/src/pages/privacy-policy.tsx` |

### Unpublished surfaces

Two products are built but not currently listed on the site. Both follow the same
pattern: page files and components stay in the tree, and every entry point is
commented out with a `TEMP: <name> unpublished <date>` marker — routes in
`client/src/App.tsx`, menu entries in `navigation.tsx` and `footer.tsx`, and the
route meta in `scripts/build-docs.mjs` (which also controls the sitemap). Grep for
`TEMP:` to find every hold before relisting.

- **Maestro** (2026-09-02) — also: `/maestro/install`, the blog post
  `why-maestro-is-free.md.unpublished`, and Maestro clauses trimmed from copy on
  about / demo / contact / partners / review / security / privacy-policy.
  `company-home.tsx` still contains Maestro content but is **not routed**.
- **Secure AI Skills** (2026-07-16) — `/skills`, `/skills/success`.

A blog post is unpublished by renaming it to `*.md.unpublished`; both the glob in
`client/src/lib/blog.ts` and the readdir filter in `scripts/build-docs.mjs` key off
the `.md` extension.

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
