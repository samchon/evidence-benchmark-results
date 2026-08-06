# Frontend verification

Implementation verification completed 2026-08-06:

- `pnpm lint` and `pnpm build` pass.
- Simulated `pnpm test:e2e` passes all seven journeys.
- Live `VITE_API_SIMULATE=false VITE_API_HOST=http://127.0.0.1:46050 pnpm test:e2e` passes all seven journeys.
- `pnpm ui:review` passes mobile (390px), tablet (834px), and desktop (1440px) checks.
- `pnpm readme:screens` passes and captures the landing screen.
- Backend `pnpm test` passes all discovered feature and generated-operation tests after the explicit schema setup.
- Backend health is `200 OK` on `http://127.0.0.1:46050/health`; frontend Vite serves on port 46052. Both dev processes remained running and Vite recorded clean page reloads after scoped changes.

Journey coverage: anonymous redirect; customer registration/login, collection search/detail, cart entry, seller registration/workspace, authenticated operation inventory, checkout result, order history, account, seller, and administrator routes. Every generated SDK accessor is exposed through `src/hooks/use-shopping-sdk.ts` and an explicit domain hook in `src/lib/shopping/hooks.ts`; the operation workspace consumes the complete hook map through the shared connection.
