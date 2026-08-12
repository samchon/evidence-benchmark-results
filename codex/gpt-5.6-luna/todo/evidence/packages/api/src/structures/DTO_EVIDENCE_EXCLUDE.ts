/**
 * Central exclusions for DTO type and property evidence claims.
 *
 * Keep real ownership evidence on the DTO declaration that represents it.
 * Add only settled non-applicability decisions here.
 *
 * @evidenceExclude prisma:todo_users.created_at Account creation is an internal lifecycle fact; reject this exclusion if a public account DTO exposes it.
 * @evidenceExcludeReview prisma:todo_users.created_at Reviewed the exclusion carrier and checked that the cited column is intentionally absent from the public DTO surface.
 * @evidenceExclude prisma:todo_users.updated_at Credential replacement bookkeeping is internal; reject this exclusion if a public account DTO exposes it.
 * @evidenceExcludeReview prisma:todo_users.updated_at Reviewed the exclusion carrier and checked that the cited column is intentionally absent from the public DTO surface.
 * @evidenceExclude prisma:todo_profiles.todo_user_id Profile ownership is enforced through the authenticated session and is not exposed; reject this exclusion if a profile DTO publishes it.
 * @evidenceExcludeReview prisma:todo_profiles.todo_user_id Reviewed the exclusion carrier and checked that the cited column is intentionally absent from the public DTO surface.
 * @evidenceExclude prisma:todo_profiles.created_at Profile creation bookkeeping is internal; reject this exclusion if a profile DTO exposes it.
 * @evidenceExcludeReview prisma:todo_profiles.created_at Reviewed the exclusion carrier and checked that the cited column is intentionally absent from the public DTO surface.
 * @evidenceExclude prisma:todo_profiles.updated_at Profile update bookkeeping is internal; reject this exclusion if a profile DTO exposes it.
 * @evidenceExcludeReview prisma:todo_profiles.updated_at Reviewed the exclusion carrier and checked that the cited column is intentionally absent from the public DTO surface.
 * @evidenceExclude prisma:todo_sessions.todo_user_id Session ownership is enforced server-side and is not exposed; reject this exclusion if a session DTO publishes it.
 * @evidenceExcludeReview prisma:todo_sessions.todo_user_id Reviewed the exclusion carrier and checked that the cited column is intentionally absent from the public DTO surface.
 * @evidenceExclude prisma:todo_sessions.created_at Session creation bookkeeping is internal; reject this exclusion if a session DTO exposes it.
 * @evidenceExcludeReview prisma:todo_sessions.created_at Reviewed the exclusion carrier and checked that the cited column is intentionally absent from the public DTO surface.
 * @evidenceExclude prisma:todo_sessions.revoked_at Session revocation bookkeeping is internal; reject this exclusion if a session DTO publishes it.
 * @evidenceExcludeReview prisma:todo_sessions.revoked_at Reviewed the exclusion carrier and checked that the cited column is intentionally absent from the public DTO surface.
 * @evidenceExclude prisma:todo_todos.todo_user_id Todo ownership is derived from the authenticated session and is not exposed; reject this exclusion if a Todo DTO publishes it.
 * @evidenceExcludeReview prisma:todo_todos.todo_user_id Reviewed the exclusion carrier and checked that the cited column is intentionally absent from the public DTO surface.
 * @evidenceExclude prisma:todo_todos.updated_at Content update bookkeeping is represented by version, not a public timestamp; reject this exclusion if a Todo DTO exposes it.
 * @evidenceExcludeReview prisma:todo_todos.updated_at Reviewed the exclusion carrier and checked that the cited column is intentionally absent from the public DTO surface.
 * @evidenceExclude prisma:todo_todo_histories.todo_todo_id History ownership is derived through the requested Todo and is not exposed; reject this exclusion if a history DTO publishes it.
 * @evidenceExcludeReview prisma:todo_todo_histories.todo_todo_id Reviewed the exclusion carrier and checked that the cited column is intentionally absent from the public DTO surface.
 * @evidenceExclude prisma:todo_recovery_tokens.id Delivery-record identity is internal and never returned as a recovery secret; reject this exclusion if a DTO exposes it.
 * @evidenceExcludeReview prisma:todo_recovery_tokens.id Reviewed the exclusion carrier and checked that the cited column is intentionally absent from the public DTO surface.
 * @evidenceExclude prisma:todo_recovery_tokens.todo_user_id Recovery ownership is internal to the registered email; reject this exclusion if a DTO exposes it.
 * @evidenceExcludeReview prisma:todo_recovery_tokens.todo_user_id Reviewed the exclusion carrier and checked that the cited column is intentionally absent from the public DTO surface.
 * @evidenceExclude prisma:todo_recovery_tokens.created_at Delivery bookkeeping is internal; reject this exclusion if a DTO exposes it.
 * @evidenceExcludeReview prisma:todo_recovery_tokens.created_at Reviewed the exclusion carrier and checked that the cited column is intentionally absent from the public DTO surface.
 * @evidenceExclude prisma:todo_recovery_tokens.expires_at Proof expiry is enforced server-side and is not returned; reject this exclusion if a DTO exposes it.
 * @evidenceExcludeReview prisma:todo_recovery_tokens.expires_at Reviewed the exclusion carrier and checked that the cited column is intentionally absent from the public DTO surface.
 * @evidenceExclude prisma:todo_recovery_tokens.consumed_at Proof consumption bookkeeping is internal; reject this exclusion if a DTO exposes it.
 * @evidenceExcludeReview prisma:todo_recovery_tokens.consumed_at Reviewed the exclusion carrier and checked that the cited column is intentionally absent from the public DTO surface.
 */
export const DTO_EVIDENCE_EXCLUDE = true;
