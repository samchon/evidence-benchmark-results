# Frontend omissions

The screen claim exclusions are centralized in `src/components/SCREEN_EVIDENCE_EXCLUDE.ts`. They cover identity and persistence obligations, backend-owned lifecycle and business-rule behavior, and cross-cutting delivery outcomes for which the requirements do not define a distinct browser acceptance criterion. Those targets are owned by the backend schema, controllers, providers, and feature/integration tests; an exclusion becomes invalid when a requirement adds a distinct user-facing workflow or browser acceptance criterion.

The command workbench is intentionally the shared UI boundary for the complete generated accessor surface. It exposes typed commands and server refusals, but it does not claim that backend persistence, policy invariants, or cross-module outcome verification are rendered as independent screens or browser journeys.
