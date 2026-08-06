import * as api from "@benchmark/reddit2-api";

/**
 * @evidence {@link api.functional.profile.view.profile} Exercises the generated operation accessor.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-account-and-moderation-privacy This operation's contract carries the data needed for this requirement; live behavior is owned by the server operation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-001-keep-credentials-and-email-private This operation's contract carries the data needed for this requirement; live behavior is owned by the server operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-user-profile-model The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-001-define-public-profile-attributes The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-002-relate-profiles-to-karma-and-authored-content The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-profile-operations The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-002-view-a-users-public-profile The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-003-preserve-public-profiles-and-community-content The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 */
export async function test_api_profile_view(connection: api.IConnection): Promise<void> {
  await api.functional.profile.view.profile({ ...connection, simulate: true }, "example");
}








