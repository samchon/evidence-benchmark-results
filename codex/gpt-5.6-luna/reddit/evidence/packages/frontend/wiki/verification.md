# Frontend verification

Last verified: 2026-08-10 (Asia/Seoul)

| Command | Mode | Result |
| --- | --- | --- |
| `pnpm lint` | enabled frontend claims, graph error, review off | Passed. |
| `pnpm plan` | frozen requirement corpus | `194/194` sections delivered or decided. |
| `pnpm test:e2e` | live backend / production build | Passed: 1 journey. |
| `pnpm test:contract` | simulated SDK | Passed: 1 contract test. |
| `pnpm ui:review` | production build / Chromium at 390, 834, 1440 | Passed: 3 responsive tests. |
| `pnpm readme:screens` | production build / Chromium | Passed: 1 screenshot test. |

The persistent frontend development server was started from `packages/frontend` and remained alive after the final build checks. The backend watcher/live service remained running for the live integration gate.
