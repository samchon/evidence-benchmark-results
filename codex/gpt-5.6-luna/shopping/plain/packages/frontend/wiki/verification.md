# Frontend verification

Implementation verification for the first frontend pass. The backend and frontend resident development processes were started from their package directories and kept alive for live integration.

## Commands

- `pnpm lint` from `packages/frontend`
- `pnpm plan` from `packages/frontend`
- `pnpm build` from `packages/frontend`
- `pnpm test:contract` from `packages/frontend`
- `pnpm test:e2e` from `packages/frontend`
- `pnpm ui:review` from `packages/frontend`
- `pnpm readme:screens` from `packages/frontend`
- `pnpm test` from `packages/backend` (the backend package has no `test:e2e` script; the live harness ran on isolated `API_PORT=46054` while resident development stayed on 46050)

## Runtime checks

- Backend health: `http://127.0.0.1:46050/health`
- Frontend shell: `http://127.0.0.1:46052/`
- Browser journeys use the live backend connection supplied to Vite.
- Any contract change is regenerated before frontend verification; generated accessors are consumed through `src/lib/shopping/hooks.ts`.
- Results are refreshed after the frontend review corrections; final command evidence is recorded in the handoff, including lint, plan `427/427`, build, contract suite, expanded live journeys, responsive UI checks, README screenshot, and backend feature executions.
