# Frontend verification

Date: 2026-08-10

## Automated gates

- `pnpm --filter @benchmark/todo-frontend plan` — passed: 73/73 requirement sections are delivered by a screen
  or recorded as an omission.
- `pnpm lint` — passed.
- `pnpm --filter @benchmark/todo-frontend test:contract` — passed: the
  simulated typed-client scaffold rendered in 1/1 contract test.
- `pnpm --filter @benchmark/todo-frontend ui:review` — passed: auth layout
  checks passed at 390, 834, and 1440 pixels in 3/3 tests.
- `pnpm --filter @benchmark/todo-frontend readme:screens` — passed: the
  landing-page screenshot test passed in 1/1 test.
- `pnpm --filter @benchmark/todo-frontend test:e2e` with
  `VITE_API_HOST=http://127.0.0.1:37001` and
  `VITE_API_SIMULATE=false` — passed: production build completed and 13/13 live
  journeys passed.

The live journey suite covers account creation, todo creation and editing,
history values, completion transitions, trash/restore/erase, list filters,
profile update and password replacement, stale-version refusal, URL state,
session invalidation, account isolation, generic login and recovery refusal,
description preservation, and refused profile-edit behavior.
Contract-mode verification remains available through the frontend package's
`pnpm --filter @benchmark/todo-frontend test:contract` command.

## Manual browser gate

The interactive evidence is recorded in
[`interactive-review.md`](./interactive-review.md). It covers auth at 390,
834, and 1440 pixels; the active workspace and empty state at desktop width;
responsive protected-shell checks for todo, trash, and account surfaces; and
the development state gallery at all three widths.
