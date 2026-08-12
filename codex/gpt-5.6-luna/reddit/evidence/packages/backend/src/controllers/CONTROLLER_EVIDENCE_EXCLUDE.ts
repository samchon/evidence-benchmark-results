/**
 * Central exclusions for API-operation evidence claims.
 *
 * Keep real ownership evidence on the controller method that implements it.
 * Add only settled non-applicability decisions here, for example:
 * `@evidenceExclude docs/analysis/example.md#section Frontend owns this presentation-only requirement; reject this exclusion if the API gains a related response or refusal.`
 * @evidenceExclude docs/analysis/05-non-functional.md#req-nfr-access-accessible-community-participation Keyboard, labeling, focus, validation, and non-color semantics belong to frontend presentation; reject if the API contract must carry them.
 * @evidenceExcludeReview docs/analysis/05-non-functional.md#req-nfr-access-accessible-community-participation Read the cited accessibility requirement and confirmed frontend presentation code owns keyboard, focus, labeling, and visual semantics; this controller exposes no such API contract.
 */
export const CONTROLLER_EVIDENCE_EXCLUDE = true;
