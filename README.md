# Second Brain

A bookmarks / knowledge-management web app with a React + Vite frontend and an Express + TypeScript backend. Features include semantic Elastic search, card tagging, shareable public brains, SSE processing updates, and GitHub/Google auth.

## Repository structure
- client/ — frontend (Vite + React + TypeScript)
  - [client/package.json](client/package.json)
  - [client/.env](client/.env)
  - [client/src/pages/Search.tsx](client/src/pages/Search.tsx) — UI for semantic search
  - [client/src/pages/Cards.tsx](client/src/pages/Cards.tsx) — Cards list UI
  - [client/src/components/ShareModal.tsx](client/src/components/ShareModal.tsx) — Share link modal
  - [client/src/components/Sidebar.tsx](client/src/components/Sidebar.tsx) — Sidebar & navigation
  - [client/src/layouts/DashboardLayout.tsx](client/src/layouts/DashboardLayout.tsx) — App layout
  - [client/src/context/AuthContext.tsx](client/src/context/AuthContext.tsx) — Auth provider & helpers

- server/ — backend (Express + TypeScript)
  - [server/package.json](server/package.json)
  - [server/.env](server/.env)
  - [server/src/server.ts](server/src/server.ts) — Entrypoint
  - [server/src/app.ts](server/src/app.ts) — Express app setup
  - [server/src/controllers/verifyUserController.ts](server/src/controllers/verifyUserController.ts) — token verification endpoint (used by the frontend via /api/v1/me)
  - [server/src/routes](server/src/routes) — API routes (brain, cards, events, oauth, users)
  - [server/src/utils/sseManager.ts](server/src/utils/sseManager.ts) — SSE helpers for card processing updates
  - [server/src/services/processor.ts](server/src/services/processor.ts) — background processing integration

## Quick start (development)

Prerequisites:
- Node.js 18+
- pnpm / npm / yarn

Clone and install:

```sh
# from repo root
cd client
npm install

cd ../server
npm install
```

Environment:
- Frontend expects VITE_BACKEND_URL in [client/.env](client/.env).
- Backend expects typical server env in [server/.env](server/.env) (JWT_SECRET, DB_URL, QDRANT, OAuth keys, etc).

Run locally:

```sh
# start backend
cd server
npm run dev

# in a separate terminal, start frontend
cd client
npm run dev
```

The frontend uses [client/src/context/AuthContext.tsx](client/src/context/AuthContext.tsx) to call authentication endpoints. The backend exposes a verification endpoint implemented by [`verifyUserController`](server/src/controllers/verifyUserController.ts) (see [server/src/controllers/verifyUserController.ts](server/src/controllers/verifyUserController.ts)).

## Important pages & components
- Search UI: [client/src/pages/Search.tsx](client/src/pages/Search.tsx) — posts queries to `${VITE_BACKEND_URL}/api/v1/content/query`.
- Cards listing: [client/src/pages/Cards.tsx](client/src/pages/Cards.tsx) — fetches `/api/v1/content/cards` and listens to SSE at `${VITE_BACKEND_URL}/events`.
- Share modal: [client/src/components/ShareModal.tsx](client/src/components/ShareModal.tsx) — copies and opens the shareable link provided by the server.
- Sidebar: [client/src/components/Sidebar.tsx](client/src/components/Sidebar.tsx) and layout [client/src/layouts/DashboardLayout.tsx](client/src/layouts/DashboardLayout.tsx).

## API overview (server)
Key controllers and routes:
- Auth & user
  - [`verifyUserController`](server/src/controllers/verifyUserController.ts) — token verification used by the frontend ([server/src/controllers/verifyUserController.ts](server/src/controllers/verifyUserController.ts))
  - [server/src/controllers/authController.ts](server/src/controllers/authController.ts)
  - [server/src/routes/userRoutes.ts](server/src/routes/userRoutes.ts)
- Content / Cards
  - [server/src/controllers/cardController.ts](server/src/controllers/cardController.ts)
  - [server/src/routes/cardRoutes.ts](server/src/routes/cardRoutes.ts)
- Share
  - [server/src/controllers/shareController.ts](server/src/controllers/shareController.ts)
  - [server/src/routes/brainRoutes.ts](server/src/routes/brainRoutes.ts)
- Events (SSE)
  - [server/src/routes/eventRoutes.ts](server/src/routes/eventRoutes.ts)
  - [server/src/utils/sseManager.ts](server/src/utils/sseManager.ts)

Use the route files above to inspect exact endpoints.

## Deployment
- Frontend is a Vite app — build with `npm run build` in [client](client).
- Backend is an Express TypeScript app — compile / run via `npm run build` and `npm run dev` in [server](server). Ensure environment variables are set (JWT_SECRET, DB connection, Qdrant/Elastic configs).
- Example frontend production base URL is configured using VITE_BACKEND_URL ([client/.env](client/.env)).

## Notes & pointers
- SSE flow: backend emits events for card processing; frontend listens on `${VITE_BACKEND_URL}/events` (see [client/src/pages/Cards.tsx](client/src/pages/Cards.tsx)).
- Authentication: frontend stores a token in cookies and passes it in Authorization headers. See [client/src/context/AuthContext.tsx](client/src/context/AuthContext.tsx).
- Error handling: frontend uses [client/src/utils/handleError.ts](client/src/utils/handleError.ts).
- Elastic / vector search integration and embeddings are implemented in server utils and services ([server/src/utils/embeddings.ts](server/src/utils/embeddings.ts), [server/src/utils/qDrant.ts](server/src/utils/qDrant.ts), [server/src/config/QdrantConfig.ts](server/src/config/QdrantConfig.ts)).

