/**
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-identity-and-permission-boundaries This DTO family represents req-access-boundaries identity and permission boundaries at the API boundary.
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-1-require-registration-for-every-feature This DTO family represents req-access-boundaries-1 require registration for every feature at the API boundary.
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-5-block-login-for-banned-accounts This DTO family represents req-access-boundaries-5 block login for banned accounts at the API boundary.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-audit-integrity-commercial-change-evidence-integrity This DTO family represents req-nfr-audit-integrity commercial change evidence integrity at the API boundary.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-audit-integrity-1-keep-commercial-change-evidence-immutable This DTO family represents req-nfr-audit-integrity-1 keep commercial change evidence immutable at the API boundary.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-audit-integrity-2-reconstruct-each-recorded-modification This DTO family represents req-nfr-audit-integrity-2 reconstruct each recorded modification at the API boundary.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-history-continuity-commercial-history-and-privacy-continuity This DTO family represents req-nfr-history-continuity commercial history and privacy continuity at the API boundary.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-history-continuity-1-keep-commercial-history-through-retirement This DTO family represents req-nfr-history-continuity-1 keep commercial history through retirement at the API boundary.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-history-continuity-4-limit-retained-history-to-relevant-parties This DTO family represents req-nfr-history-continuity-4 limit retained history to relevant parties at the API boundary. Small status response for lifecycle commands. @evidence docs/analysis/03-functional-requirements.md Carries an observable transition result. @evidence prisma:shopping_products.status Mirrors the persisted lifecycle status. */
export interface IShoppingResult {
  /**
   * Resulting lifecycle status.
   * @evidence prisma:shopping_products.status Carries the persisted value represented by this DTO property.
   */
  status: string;
}
