# Frontend verification

Environment: Windows PowerShell, 2026-08-10, backend `pnpm dev` on port `37003`, frontend `pnpm dev` on port `5173`, API host `http://127.0.0.1:37003`.

## Gates

- `pnpm lint` passed (`ttsc --noEmit`).
- `pnpm build` passed.
- `pnpm test:contract` passed: one simulated-client contract journey.
- `pnpm test:e2e` passed: four Chromium journeys against the live backend.
- `pnpm ui:review` passed: desktop, tablet, and phone route checks.
- `pnpm readme:screens` passed: public home screenshot capture.
- `pnpm plan` passed: all 194 requirement sections are mapped to screens or recorded omissions.

## Live browser journeys

The discussion journey registers a user, creates a community with an icon, publishes text/link/image posts, upvotes, comments and edits, reports a comment and post, exercises moderation, opens the authored-post profile, and opens settings. The account-management journey verifies current-session continuation, password replacement, all-session logout, re-login, and deletion. The public journey opens popular discovery, searches communities, and verifies the empty-result state. The refusal journey verifies private subscriptions and neutral recovery behavior for an unknown email.

The generated SDK accessors are used through `src/lib/hooks.ts`; screen components consume those hooks rather than calling fetch directly. The contract build and live build both completed after the latest frontend correction.

Both development processes remained resident during implementation and verification. The API health endpoint returned HTTP 200 on port 37003, and the final browser suites reloaded the latest build with `VITE_API_HOST=http://127.0.0.1:37003`.
