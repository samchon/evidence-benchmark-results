/**
 * Central exclusions for DTO type and property evidence claims.
 *
 * Keep real ownership evidence on the DTO declaration that represents it.
 * Add only reviewed non-applicability decisions here, for example:
 * `@evidenceExclude prisma:example_models.internal_note The provider keeps this operator-only value server-side; reject this exclusion if a request or response carries it.`
 *
 * @evidenceExclude docs/analysis/05-non-functional.md#req-nfr-access-accessible-community-participation Accessibility interaction and presentation semantics are owned by the frontend; reject this exclusion if a DTO gains a presentation-specific contract.
 * @evidenceExclude docs/analysis/04-business-rules.md#req-rule-media-uploaded-image-rules Media decoding and thumbnail presentation are handled outside the DTO contract; reject this exclusion if the DTO gains a validated media representation.
 */
export const DTO_EVIDENCE_EXCLUDE = true;
