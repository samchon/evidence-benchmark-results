/**
 * Central exclusions for DTO type and property evidence claims.
 *
 * Keep real ownership evidence on the DTO declaration that represents it.
 * Add only reviewed non-applicability decisions here, for example:
 * `@evidenceExclude prisma:example_models.internal_note The provider keeps this operator-only value server-side; reject this exclusion if a request or response carries it.`
 *
 * @evidenceExclude prisma:todo_accounts.id The account identifier stays inside the authenticated token; reject if a caller-visible account DTO is added.
 * @evidenceExclude prisma:todo_accounts.created_at Account creation time is internal; reject if account history becomes public.
 * @evidenceExclude prisma:todo_accounts.password_hash Password hashes never cross the DTO boundary; reject if plaintext or hashes are exposed.
 * @evidenceExclude prisma:todo_profiles.todo_account_id Ownership foreign key is enforced server-side; reject if profile DTOs expose it.
 * @evidenceExclude prisma:todo_sessions.id Session identity is internal; reject if session management becomes caller-visible.
 * @evidenceExclude prisma:todo_sessions.todo_account_id Session ownership is internal; reject if sessions become caller-visible.
 * @evidenceExclude prisma:todo_sessions.refresh_token_hash Refresh hashes never cross the DTO boundary; reject if raw proofs are exposed.
 * @evidenceExclude prisma:todo_sessions.created_at Session creation time is internal; reject if session history is exposed.
 * @evidenceExclude prisma:todo_sessions.revoked_at Revocation state is enforced by authorization; reject if session status is published.
 * @evidenceExclude prisma:todo_todos.todo_account_id Todo ownership foreign key is server-side; reject if DTOs expose it.
 * @evidenceExclude prisma:todo_todo_histories.todo_todo_id History ownership foreign key is server-side; reject if DTOs expose it.
 * @evidenceExclude prisma:todo_todo_histories.title_changed Participation flags are transport derivation state; reject if flags become public.
 * @evidenceExclude prisma:todo_todo_histories.description_changed Participation flags are transport derivation state; reject if flags become public.
 * @evidenceExclude prisma:todo_todo_histories.start_date_changed Participation flags are transport derivation state; reject if flags become public.
 * @evidenceExclude prisma:todo_todo_histories.due_date_changed Participation flags are transport derivation state; reject if flags become public.
 */
export const DTO_EVIDENCE_EXCLUDE = true;
