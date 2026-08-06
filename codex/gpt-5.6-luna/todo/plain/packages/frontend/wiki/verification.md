# Frontend verification

Verified 2026-08-05.

## Environment

- Backend `pnpm dev` running at `http://127.0.0.1:37123`.
- Frontend `pnpm dev` running at `http://127.0.0.1:5183`.
- Simulation journeys use `VITE_API_SIMULATE=true`.
- Live journeys use `VITE_API_SIMULATE=false` against the running backend.

## Automated

- `pnpm lint` passed.
- `pnpm build` passed.
- `VITE_API_SIMULATE=true pnpm exec playwright test tests/journeys` passed: 5/5.
- `VITE_API_SIMULATE=true pnpm ui:review` passed: 3/3.
- `VITE_API_SIMULATE=true pnpm readme:screens` passed: 1/1.
- `VITE_API_HOST=http://127.0.0.1:37123 VITE_API_SIMULATE=false pnpm test:e2e` passed: 5/5.

## Browser flows

Journeys cover registration/login, recovery, todo creation and editing,
completion, trash recovery and permanent deletion, profile/security, session
controls, and the health status at mobile, tablet, and desktop widths.

The live run used the separately running backend on port 37123; the frontend
dev server remained active on port 5183 throughout the implementation and
verification passes.
