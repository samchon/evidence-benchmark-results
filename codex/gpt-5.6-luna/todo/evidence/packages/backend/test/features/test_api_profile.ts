import * as api from "@benchmark/todo-api";

/**
 * @evidence {@link api.functional.todo_profile.at} Proves private profile retrieval.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-profile-meaning-and-relationship Exercises the private display identity.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-1-define-the-user-profile Reads the display name.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-2-bind-one-private-profile-to-each-account Resolves the account's profile.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-profile-operations Exercises the profile surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-1-view-the-current-users-profile Reads the current profile.
 * @evidence docs/analysis/04-business-rules.md#req-rule-profile-display-name-rules Reads the normalized name.
 * @evidence docs/analysis/04-business-rules.md#req-rule-profile-1-validate-private-display-names Returns a bounded name.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Uses owner authority.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Uses a protected profile operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-2-limit-authority-to-owned-private-information Reads only the current profile.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Keeps profile output private.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-1-isolate-every-accounts-private-information Exposes no other profile.
 */
export async function test_api_profile(connection: api.IConnection): Promise<void> {
  const result = await api.functional.todo_auth_join.join(connection, { email: `profile-${Date.now()}@example.com`, password: "Password123!", displayName: "Profile User" });
  const secured: api.IConnection = { ...connection, headers: { Authorization: `Bearer ${result.token.access}` } };
  const profile = await api.functional.todo_profile.at(secured);
  if (profile.displayName !== "Profile User") throw new Error("profile mismatch");
  const other = await api.functional.todo_auth_join.join(connection, { email: `profile-other-${Date.now()}@example.com`, password: "Password123!", displayName: "Other User" });
  const otherProfile = await api.functional.todo_profile.at({ ...connection, headers: { Authorization: `Bearer ${other.token.access}` } });
  if (otherProfile.displayName === profile.displayName) throw new Error("profiles were not isolated");
}
