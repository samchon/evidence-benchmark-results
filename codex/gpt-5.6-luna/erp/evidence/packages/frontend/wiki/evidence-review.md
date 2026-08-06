# Frontend evidence review

The active frontend population was audited after the staged claims were enabled.

- `frontend-hooks`: 404 `@evidence` tags were checked against their complete hook bodies; each tag names the exact generated accessor called by that hook.
- `frontend-screens`: 404 hook-consumption tags were checked against `OperationsPage`; every referenced hook is called and placed in the operation table rendered by that page.
- `frontend-journeys`: the `OperationsPage` link was checked against the journey's actual browser flow.
- Both exclusion carriers contain one reviewed acknowledgement for each of the 253 H2 requirement targets. The target lists are unique and regenerated from `docs/analysis/` headings.

The exclusions are limited to obligations owned by backend controllers, providers, schema, and backend feature or integration tests: identity and persistence behavior, domain lifecycle semantics, business-rule invariants, and cross-cutting delivery outcomes. Each entry states the owning backend artifact class and the browser-facing condition that would invalidate the decision. The operations journey deliberately proves only command-surface interaction; it does not claim backend outcome verification.
