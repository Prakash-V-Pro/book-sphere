# BookSphere

Minimalistic, headless concert booking UX powered by Contentstack.

## Apps
- `apps/web` — Next.js frontend
- `apps/api` — NestJS backend
- `packages/shared` — shared types

## Quick Start
1. Copy `config/env.example` into `apps/web/.env.local` and `apps/api/.env`.
2. Fill in Contentstack keys/tokens.
3. Run:
   - `npm install`
   - `npm run dev:api`
   - `npm run dev:web`

## Docs
- Content models: `docs/contentstack-models.md`
- Deployment: `docs/deployment.md`
- SDK automation: `tools/contentstack-setup/README.md`

