# Security Guidelines

## Environment Variables

- **Never** prefix secrets with `VITE_` or `NEXT_PUBLIC_` — these are bundled into client-side code.
- All API keys (`COMPOSIO_API_KEY`, `ANTHROPIC_API_KEY`, database URIs) must remain server-side only.
- Use `.env.local` for local overrides; `.env.example` for documentation (no real values).

## Database Credentials

- Database connection strings must only be used in:
  - Server Components
  - API Routes (`src/app/api/`)
  - Server Actions
- Never import database clients in files under `"use client"`.
- If adding a Vite-based admin dashboard in the future, database access must go through an API layer — Vite bundles **everything** into the client.

## Authentication

- All dashboard/admin pages must be protected by authentication middleware.
- `src/middleware.ts` gates `/api/prospects*`, `/api/weekly*`, and `/api/surveys*`. Any new
  route serving prospect, survey, or other PII must be added to its `config.matcher`.
- Callers authenticate with `Authorization: Bearer $PROSPECTS_API_KEY`. Generate the key with
  `openssl rand -hex 32` and set it per environment; never prefix it with `NEXT_PUBLIC_`.
- The middleware fails closed: if `PROSPECTS_API_KEY` is unset the gated routes return 503
  rather than serving data.
- The `/api/health` endpoint suppresses env var details in production.

## PII and Prospect Data

- Prospect lists, hit lists, and batch data files must **never** be committed to the repository.
- `.gitignore` blocks `*-batch-*.json`, `*-hit-list.*`, and `*-credentials.*` patterns.
- Store prospect data in the database or encrypted external storage, not in `docs/`.

## Infrastructure Details

- Do not hardcode database project IDs, service URLs, or webhook endpoints in documentation or source code.
- Use environment variables for all infrastructure references.
- `CLAUDE.md` or similar AI instruction files must not contain real credentials or project IDs.

## If Adding a Second Frontend (Vite Admin Dashboard)

- Use a proper monorepo tool (Turborepo, Nx, or npm workspaces) to manage multiple apps.
- Keep a single `package.json` at root with workspace definitions.
- The Vite app must communicate with the backend through API routes — no direct database access.
- Hardcoded URLs in components (e.g., `brand.tsx`) must use environment variables.
