# Deployment Guide

## Local Development
1. Copy `config/env.example` to `apps/web/.env.local` and `apps/api/.env`.
2. Update Contentstack keys and tokens.
3. Run:
   - `npm install`
   - `npm run dev:api`
   - `npm run dev:web`

## Contentstack SDK Setup (Optional)
If you prefer SDK automation over manual setup:
1. Go to `tools/contentstack-setup/README.md`
2. Follow the steps to create content types and seed entries with the Management SDK.

## Contentstack Launch (Frontend)
1. Create a Launch project and connect the repo.
2. Build command: `npm install && npm run build:web`
3. Output directory: `apps/web/.next`
4. Set env vars from `apps/web/.env.local`.

## Render Free Tier (Backend)
1. Create a new Web Service.
2. Root directory: `apps/api`
3. Build command: `npm install && npm run build`
4. Start command: `npm run start`
5. Set env vars from `apps/api/.env`.

## Notes
- Contentstack Launch hosts the Next.js frontend.
- Render hosts the NestJS API with free tier limits.
- Update `NEXT_PUBLIC_API_BASE_URL` to point to the Render URL in production.

