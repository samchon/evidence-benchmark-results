/**
 * Central exclusions for frontend screen evidence claims.
 *
 * Only the requirement obligation accepts an exclusion. Every hook is rendered
 * by a screen or the call it wraps reaches no user, so that obligation refuses
 * this file and an unused hook stays a build failure.
 *
 * Keep real ownership evidence on the screen that delivers it. Add only
 * reviewed non-applicability decisions here.
 * @evidenceExclude docs/analysis/04-business-rules.md#req-rule-media-uploaded-image-rules Media decoding, storage, and the shared avatar/community-icon/upload boundary are owned by the backend/API contract; reject this exclusion if the frontend receives a multipart media accessor.
 */
export const SCREEN_EVIDENCE_EXCLUDE = true;
