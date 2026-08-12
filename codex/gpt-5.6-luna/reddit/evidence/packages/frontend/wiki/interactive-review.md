# Interactive browser review

Review date: 2026-08-10 (Asia/Seoul)

The review used the Playwright Chromium browser against the built application. The live journey opened every application screen route; the responsive review exercised the feed at the required mobile, tablet, and desktop widths.

| Screen / route | Widths | Observation | Defects / assertion |
| --- | --- | --- | --- |
| Feed `/feed` | 390, 834, 1440 | Main content stayed in the viewport at mobile, tablet, and desktop widths; controls remained reachable. | None found; responsive UI gate passed 3/3. |
| Auth `/auth` | Desktop journey | Sign-in, create-account, and recovery tabs were reachable; the browser exposed labeled email, username, password, proof, and replacement-password controls. | None found; tab and field assertions passed. |
| Communities `/communities` | Desktop journey | Catalog route loaded; search input accepted text and preserved `search=field` in the URL. | None found; URL ownership assertion passed. |
| Community detail `/communities/:id` | Desktop journey | Detail route was opened with a stable UUID path; loading/error fallback remained navigable. | No visual defect observed for the resource-dependent state. |
| Post `/posts/:id` | Desktop journey | Detail route was opened with a stable UUID path; post/comment resource state remained navigable. | No visual defect observed for the resource-dependent state. |
| Profile `/profile/:username` | Desktop journey | Public profile route was opened and remained addressable. | No visual defect observed for the resource-dependent state. |
| Subscriptions `/subscriptions` | Desktop journey | Subscription screen route was opened; empty/authenticated state remained navigable. | No visual defect observed. |
| Settings `/settings` | Desktop journey | Settings screen loaded with public-profile, session, and deletion sections. | None found; heading assertion passed. |
| Moderation `/moderation/:id` | Desktop journey | Community-tools route was opened with a stable UUID path and retained its private-state fallback. | No visual defect observed for the resource-dependent state. |
| Health `/health` | Desktop journey | Service-status route was opened with its explicit loading/error/success boundary. | No visual defect observed. |

Assertions recorded by the browser runs: production live E2E 1/1 passed; contract simulation 1/1 passed; responsive UI review 3/3 passed; README screenshot 1/1 passed. No browser console or navigation failure was reported by the passing journey.
