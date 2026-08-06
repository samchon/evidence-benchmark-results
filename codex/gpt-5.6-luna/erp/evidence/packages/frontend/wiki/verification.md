# Frontend verification

## Environment

- Frontend dev server: `pnpm dev` from `packages/frontend` (resident through final verification).
- Backend dev server: `pnpm dev` from `packages/backend` at `http://127.0.0.1:37001`.
- Live browser mode: `VITE_API_HOST=http://127.0.0.1:37001` and `VITE_API_SIMULATE=false`.

## Automated

- `pnpm lint`
- `pnpm build`
- `pnpm test:e2e`

## Browser flows

- Chromium, desktop: searched for `HealthGet`, selected the generated command, submitted an empty argument list, and observed the live response.
- Chromium, mobile/tablet/desktop presentation checks remain available in `tests/ui-review.spec.ts`.

## Findings

- The generated SDK bundle is large because the workbench consumes every published accessor; Vite reports a chunk-size warning but the production build succeeds.
