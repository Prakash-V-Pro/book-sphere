# Contentstack SDK Setup (BookSphere)

This folder lets you create all Contentstack content types, upload image assets,
and seed sample entries using the **Contentstack Management SDK**.

## 1) Get Contentstack credentials
1. Create a Contentstack account and a Stack.
2. Go to Stack -> Settings -> Tokens -> create a **Management Token**.
3. Go to Stack -> Settings -> API Keys -> copy the **Stack API Key**.
4. Go to Stack -> Environments -> create or note an environment name (ex: `dev`).

## 2) Set SDK environment
Copy `env.example` to `.env` (or `env`) in this folder and fill in:
```
CS_MANAGEMENT_TOKEN=...
CS_AUTH_TOKEN=...
CS_STACK_API_KEY=...
CS_ENVIRONMENT_NAME=dev
CS_MANAGEMENT_HOST=api.contentstack.io
```

## 3) Add some images
Place a few concert images here:
```
tools/contentstack-setup/assets/
```
Supported: `.jpg`, `.jpeg`, `.png`, `.webp`

## 4) Run scripts
From the repo root:
```
cd tools/contentstack-setup
npm install
npm run create-models
npm run upload-assets
npm run create-entries
npm run attach-assets
```

## 5) Connect the app
Set these in your app env files:
```
apps/web/.env.local
CONTENTSTACK_API_KEY=...
CONTENTSTACK_DELIVERY_TOKEN=...
CONTENTSTACK_ENVIRONMENT=dev

apps/api/.env
API_CONTENTSTACK_API_KEY=...
API_CONTENTSTACK_DELIVERY_TOKEN=...
API_CONTENTSTACK_ENVIRONMENT=dev
```

Note: Management Token is sent as the `authorization` header by the SDK scripts.

