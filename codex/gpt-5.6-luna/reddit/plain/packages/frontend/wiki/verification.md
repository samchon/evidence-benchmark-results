# Verification record

## Environment (2026-08-05)

- `pnpm dev` from `packages/backend` is resident on `http://127.0.0.1:37001`; `/health` returned `200 OK`.
- `pnpm dev` from `packages/frontend` is resident on `http://127.0.0.1:5173`; HTTP returned `200`.
- The backend `pnpm check:watch` process remains resident and reports a completed watch build.
- Browser journeys use the production preview server on port `4173`.

## Automated journeys

- `$env:PW_DISABLE_TS_ESM='1'; $env:VITE_API_SIMULATE='true'; pnpm test:e2e` - 6/6 passed.
- `$env:PW_DISABLE_TS_ESM='1'; $env:VITE_API_SIMULATE='false'; $env:VITE_API_HOST='http://127.0.0.1:37001'; pnpm test:e2e` - 6/6 passed against the live backend.
- The six journeys cover account controls, authentication and recovery, community participation, public discovery, guide health, and private moderation.

The implementation maps every generated SDK accessor through `src/lib/reddit/hooks.ts`; each hook is rendered by a screen, with `health.get` intentionally infrastructure-only on the Guide screen.
