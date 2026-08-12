/**
 * Central exclusions for API-operation evidence claims.
 *
 * Keep real ownership evidence on the controller method that implements it.
 * Add only settled non-applicability decisions here, for example:
 * `@evidenceExclude docs/analysis/example.md#section Frontend owns this presentation-only requirement; reject this exclusion if the API gains a related response or refusal.`
 * `@evidenceExcludeReview docs/analysis/example.md#section Read the requirement and confirmed it has no backend operation or response obligation.`
 */
export const CONTROLLER_EVIDENCE_EXCLUDE = true;
