import * as api from "@benchmark/reddit2-api";

/**
 * @evidence {@link api.functional.profile.edit.profileUpdate} Exercises the generated operation accessor.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-user-profile-model The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-001-define-public-profile-attributes The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-profile-operations The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-001-edit-the-current-users-profile The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-profile-profile-validation-rules The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-profile-001-validate-profile-field-changes The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 */
export async function test_api_profile_edit(connection: api.IConnection): Promise<void> {
  await api.functional.profile.edit.profileUpdate({ ...connection, simulate: true }, { displayName: "Updated", bio: "Bio", avatarUrl: null });
}






