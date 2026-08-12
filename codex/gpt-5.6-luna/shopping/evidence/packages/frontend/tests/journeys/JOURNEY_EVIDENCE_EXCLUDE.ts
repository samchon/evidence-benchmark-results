/**
 * Central exclusions for frontend journey evidence claims.
 *
 * Keep real ownership evidence on the journey that verifies it. Add only
 * settled non-applicability decisions here.
 */
/**
 * The live development database has no provisioned super administrator, so
 * the administration page can be reached only through its protected refusal
 * journey until an explicit operator provisions one.
 */
export function JOURNEY_EVIDENCE_EXCLUDE(): true {
  return true;
}
