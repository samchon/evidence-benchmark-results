# Frontend verification

## Environment

- Date: 2026-08-06.
- Vite development server: `packages/frontend`, `http://127.0.0.1:46072`.
- Backend development server: `packages/backend`, `http://127.0.0.1:47123` (health returned `200 OK`).
- Simulation run: `VITE_API_HOST=http://127.0.0.1:47123 VITE_API_SIMULATE=true`.
- Live run: `VITE_API_HOST=http://127.0.0.1:47123 VITE_API_SIMULATE=false`.

## Automated

- Simulation: `pnpm test:e2e` - 7 journeys passed.
- Live: `pnpm test:e2e` - 7 journeys passed.
- Presentation: `pnpm ui:review` - 3 responsive viewport checks passed.
- Each command rebuilt the production frontend before Playwright.

## Browser flows

- Dashboard navigation: open the dashboard, open Vendors, search `Northwind`, and return to the workspace.
- Authentication: open sign-in, traverse recovery and invitation entry screens, and return to sign-in.
- Profile: sign in, open Profile and access, and inspect organization memberships; live mode provisions and selects an organization.
- Module workspace: open Reports and inspect its populated/error-safe list surface.
- Published operations: select an accessor, submit a JSON argument array, and inspect the result or refusal.
- Production scaffold: load the application shell and verify the primary navigation.
- Development gallery: inspect deterministic loading, empty, refusal, retry, and mutation-success fixtures at `/__dev/gallery` while Vite runs in development mode.
