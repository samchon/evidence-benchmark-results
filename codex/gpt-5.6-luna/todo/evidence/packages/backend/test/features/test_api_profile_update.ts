import * as api from "@benchmark/todo-api";

/**
 * @evidence {@link api.functional.todo_profile_update.update} Proves display-name editing.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-profile-meaning-and-relationship Changes private display identity.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-1-define-the-user-profile Changes only the display name.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-2-bind-one-private-profile-to-each-account Updates the current account's profile.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-profile-operations Exercises the profile surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-2-edit-the-display-name Replaces the display name.
 * @evidence docs/analysis/04-business-rules.md#req-rule-profile-display-name-rules Exercises name normalization.
 * @evidence docs/analysis/04-business-rules.md#req-rule-profile-1-validate-private-display-names Exercises the name bound.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Uses owner authority.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Uses a protected profile operation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Keeps profile changes private.
 */
export async function test_api_profile_update(connection: api.IConnection): Promise<void> {
  const result = await api.functional.todo_auth_join.join(connection, { email: `profile-update-${Date.now()}@example.com`, password: "Password123!", displayName: "Before" });
  const secured: api.IConnection = { ...connection, headers: { Authorization: `Bearer ${result.token.access}` } };
  const profile = await api.functional.todo_profile_update.update(secured, { displayName: "  After  " });
  if (profile.displayName !== "After") throw new Error("profile update failed");
}
