/**
 * Central exclusions for API-operation evidence claims.
 *
 * Keep real ownership evidence on the controller method that implements it.
 * Add only reviewed non-applicability decisions here, for example:
 * `@evidenceExclude docs/analysis/example.md#section Frontend owns this presentation-only requirement; reject this exclusion if the API gains a related response or refusal.`
 *
 * @evidenceExclude docs/analysis/05-non-functional.md#req-nfr-access-accessible-community-participation The frontend owns keyboard and assistive interaction; reject this exclusion if the backend publishes an accessibility contract.
 */
export const CONTROLLER_EVIDENCE_EXCLUDE = true;
